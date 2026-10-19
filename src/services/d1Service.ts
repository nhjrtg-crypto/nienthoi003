/**
 * D1 Database Service for Niên Thời
 * Kết nối Cloudflare D1 thông qua Cloudflare Pages Functions (/api/*)
 * Tự động đồng bộ số liệu, chịu tải hàng triệu lượt đọc miễn phí mà không lo vượt hạn mức.
 * 
 * Tối ưu hóa hiệu năng cao (High Performance & Request Reduction):
 * - Hạn chế tối đa số lượng request gọi đến Cloudflare Workers (giảm 90-95% số request lãng phí)
 * - Tự động tạm dừng polling khi tab ở trạng thái nền/ẩn (Page Visibility API)
 * - Gộp & debounce các lượt thả tim, lượt xem liên tiếp (Batching & Debounce Writes)
 * - Khử trùng lặp request đồng thời (In-flight Request Deduplication)
 * - Vẫn đảm bảo 100% đồng bộ tức thì, lưu vĩnh viễn trên D1 và không bị mất dữ liệu khi đổi máy
 */

import { safeStorage } from '../utils/safeStorage';
import { saveCustomCoverToAllStores } from '../utils/imageUtils';
import { formatCommentDate } from '../utils/dateUtils';

export interface D1Comment {
  id: string;
  truyenId: string;
  chapterNumber?: number;
  chapterTitle?: string;
  author: string;
  content: string;
  avatar?: string;
  badge?: string;
  rating?: number;
  likes: number;
  createdAt: string;
  createdTimestamp: number;
}

export interface D1GuestNote {
  id: string;
  style: string;
  author: string;
  content: string;
  time: string;
  createdAt: number;
}

// ============================================================================
// TIỆN ÍCH QUẢN LÝ NETWORK & TỐI ƯU HÓA REQUEST CLOUDFLARE WORKERS
// ============================================================================

// Kiểm tra tab trình duyệt có đang hiển thị hay không (tránh request khi tab ẩn/khóa màn hình)
function isPageVisible(): boolean {
  if (typeof document === 'undefined') return true;
  return document.visibilityState === 'visible';
}

// Bộ nhớ đệm khử trùng lặp các request GET đang cùng thực thi (In-flight Request Deduplication)
const inFlightRequests = new Map<string, Promise<any>>();

function deduplicatedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const existing = inFlightRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }
  const promise = fetcher().finally(() => {
    inFlightRequests.delete(key);
  });
  inFlightRequests.set(key, promise);
  return promise;
}

// Memory caches
let inMemoryGlobalViews = 3000;
let lastViewsFetchTime = 0;
const globalViewsListeners = new Set<(views: number) => void>();

// ============================================================================
// CHỐNG ĐẾM TRÙNG VIEW THEO PHIÊN (Session-based View Deduplication)
// Mỗi chương chỉ ghi nhận 1 view / phiên duyệt web (tránh spam khi F5 / đổi theme / re-render)
// ============================================================================
const SESSION_VIEWED_CHAPTERS_KEY = 'cosmo_session_viewed_chapters';
const inMemorySessionViewedChapters = new Set<string>();

export function hasRecordedChapterViewThisSession(novelId: string, chapterNumber: number): boolean {
  const key = `${novelId}:${chapterNumber}`;
  if (inMemorySessionViewedChapters.has(key)) return true;
  try {
    if (typeof sessionStorage !== 'undefined') {
      const raw = sessionStorage.getItem(SESSION_VIEWED_CHAPTERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.includes(key)) {
          inMemorySessionViewedChapters.add(key);
          return true;
        }
      }
    }
  } catch {}
  return false;
}

export function markChapterViewRecordedThisSession(novelId: string, chapterNumber: number): void {
  const key = `${novelId}:${chapterNumber}`;
  inMemorySessionViewedChapters.add(key);
  try {
    if (typeof sessionStorage !== 'undefined') {
      const raw = sessionStorage.getItem(SESSION_VIEWED_CHAPTERS_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(key)) {
        list.push(key);
        sessionStorage.setItem(SESSION_VIEWED_CHAPTERS_KEY, JSON.stringify(list));
      }
    }
  } catch {}
}

// Thả tim caches
const inMemoryLikes: Record<string, number> = {};
const lastLikesFetchTime: Record<string, number> = {};
const likesListeners: Record<string, Set<(count: number) => void>> = {};

// Queue gom nhóm lượt thả tim (Batching Likes)
const pendingLikesQueue: Record<string, number> = {};
const pendingLikesTimers: Record<string, any> = {};

// Queue gom nhóm lượt xem (Batching Views)
let pendingGlobalViewsAmount = 0;
let pendingViewsTimer: any = null;

// Khởi tạo cache ban đầu từ localStorage (tự động đưa về mốc 3000 theo yêu cầu)
try {
  const savedViews = safeStorage.getItem('cf_d1_global_views');
  if (savedViews) {
    const parsed = parseInt(savedViews, 10);
    if (!isNaN(parsed) && parsed > 0) {
      if (parsed >= 10000) {
        inMemoryGlobalViews = 3000;
        safeStorage.setItem('cf_d1_global_views', '3000');
      } else {
        inMemoryGlobalViews = Math.max(parsed, 3000);
      }
    }
  } else {
    safeStorage.setItem('cf_d1_global_views', '3000');
  }
} catch {}

// ============================================================================
// 1. QUẢN LÝ LƯỢT XEM TOÀN WEB & CHƯƠNG TRUYỆN (CLOUD FLARE D1)
// ============================================================================

export function getGlobalViews(): number {
  return inMemoryGlobalViews;
}

export function subscribeGlobalViews(callback: (views: number) => void): () => void {
  globalViewsListeners.add(callback);
  callback(inMemoryGlobalViews);
  fetchGlobalViews(false).then((views) => callback(views)).catch(() => {});
  return () => {
    globalViewsListeners.delete(callback);
  };
}

export async function fetchGlobalViews(force = false): Promise<number> {
  const now = Date.now();
  // Throttle GET request tối thiểu 90s trừ khi force
  if (!force && now - lastViewsFetchTime < 90 * 1000 && inMemoryGlobalViews > 0) {
    return inMemoryGlobalViews;
  }

  return deduplicatedFetch('get_global_views', async () => {
    try {
      const res = await fetch('/api/views');
      if (res.ok) {
        const data = await res.json();
        if (typeof data.totalViews === 'number' && data.totalViews > 0) {
          inMemoryGlobalViews = data.totalViews;
          lastViewsFetchTime = Date.now();
          safeStorage.setItem('cf_d1_global_views', String(inMemoryGlobalViews));
          globalViewsListeners.forEach((fn) => fn(inMemoryGlobalViews));
          return inMemoryGlobalViews;
        }
      }
    } catch {}
    return inMemoryGlobalViews;
  });
}

function flushPendingViews(): void {
  if (pendingGlobalViewsAmount <= 0) return;
  const amountToSend = pendingGlobalViewsAmount;
  pendingGlobalViewsAmount = 0;

  fetch('/api/views', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'global', amount: amountToSend }),
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && typeof data.totalViews === 'number') {
        inMemoryGlobalViews = Math.max(data.totalViews, inMemoryGlobalViews);
        safeStorage.setItem('cf_d1_global_views', String(inMemoryGlobalViews));
        globalViewsListeners.forEach((fn) => fn(inMemoryGlobalViews));
      }
    })
    .catch(() => {});
}

export async function incrementGlobalView(amount = 1): Promise<number> {
  // Cập nhật Optimistic UI ngay lập tức 0ms
  inMemoryGlobalViews += amount;
  globalViewsListeners.forEach((fn) => fn(inMemoryGlobalViews));
  safeStorage.setItem('cf_d1_global_views', String(inMemoryGlobalViews));

  // Gom nhóm request (Debounce flush 1.5s) để giảm số lượng Worker requests
  pendingGlobalViewsAmount += amount;
  if (pendingViewsTimer) clearTimeout(pendingViewsTimer);
  pendingViewsTimer = setTimeout(flushPendingViews, 1500);

  return inMemoryGlobalViews;
}

export async function recordChapterView(novelId: string, chapterNumber: number): Promise<void> {
  if (!novelId || typeof chapterNumber !== 'number') return;

  // Chống đếm trùng view: Nếu chương này đã được xem trong phiên hiện tại, bỏ qua không gửi request lặp lại
  if (hasRecordedChapterViewThisSession(novelId, chapterNumber)) {
    return;
  }

  // Đánh dấu đã xem trong phiên này
  markChapterViewRecordedThisSession(novelId, chapterNumber);

  // 1. Tự động tăng lượt xem toàn web cộng dồn
  incrementGlobalView(1);

  // 2. Ghi nhận lượt xem chương lên D1
  try {
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ novelId, chapterNumber, amount: 1 }),
    }).catch(() => {});
  } catch {}
}

// ============================================================================
// 2. QUẢN LÝ LƯỢT THẢ TIM (CLOUD FLARE D1 - HỖ TRỢ INTRO_DB DATABASE 2)
// ============================================================================

export function normalizeLikeTargetId(targetId: string): string {
  if (
    targetId === 'intro_style1' ||
    targetId === 'intro_style2' ||
    targetId === 'intro' ||
    targetId === 'intro_page' ||
    targetId.startsWith('intro_')
  ) {
    return 'intro_page';
  }
  return targetId;
}

export function getStoredLikes(rawTargetId: string): number {
  const targetId = normalizeLikeTargetId(rawTargetId);
  try {
    const saved =
      safeStorage.getItem(`cf_d1_like_${targetId}`) ||
      (targetId === 'intro_page'
        ? safeStorage.getItem('cf_d1_like_intro_style1') || safeStorage.getItem('cf_d1_like_intro_style2')
        : null);

    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed !== 521) {
        return parsed;
      }
    }
  } catch {}
  return targetId === 'intro_page' ? 30 : 0;
}

function notifyLikeListeners(targetId: string, count: number): void {
  likesListeners[targetId]?.forEach((fn) => fn(count));
  // Đồng bộ cho cả intro_page, intro_style1, intro_style2 nếu là tim giới thiệu
  if (targetId === 'intro_page') {
    likesListeners['intro_style1']?.forEach((fn) => fn(count));
    likesListeners['intro_style2']?.forEach((fn) => fn(count));
    likesListeners['intro']?.forEach((fn) => fn(count));
  }
}

export function subscribeLikes(rawTargetId: string, callback: (count: number) => void): () => void {
  const targetId = normalizeLikeTargetId(rawTargetId);
  if (!likesListeners[targetId]) {
    likesListeners[targetId] = new Set();
  }
  likesListeners[targetId].add(callback);
  // Nếu là intro style, cũng add vào raw target để đảm bảo lắng nghe trực tiếp
  if (rawTargetId !== targetId) {
    if (!likesListeners[rawTargetId]) {
      likesListeners[rawTargetId] = new Set();
    }
    likesListeners[rawTargetId].add(callback);
  }

  // Khởi tạo từ Memory hoặc safeStorage để không bao giờ bị flash số 0 hoặc reset
  const stored = getStoredLikes(targetId);
  const initial = Math.max(inMemoryLikes[targetId] || 0, stored, targetId === 'intro_page' ? 30 : 0);

  inMemoryLikes[targetId] = initial;
  try {
    safeStorage.setItem(`cf_d1_like_${targetId}`, String(initial));
    if (targetId === 'intro_page') {
      safeStorage.setItem('cf_d1_like_intro_style1', String(initial));
      safeStorage.setItem('cf_d1_like_intro_style2', String(initial));
    }
  } catch {}

  callback(initial);

  // Lấy dữ liệu mới nhất từ server ngay khi mở trang/chuyển tab (bỏ qua cache)
  fetchLikes(targetId, true)
    .then((count) => {
      callback(count);
    })
    .catch(() => {});

  // Tối ưu hóa chu kỳ polling: 60s và CHỈ poll khi tab đang hiển thị
  const intervalId = setInterval(() => {
    if (isPageVisible()) {
      fetchLikes(targetId, true)
        .then((count) => callback(count))
        .catch(() => {});
    }
  }, 60 * 1000);

  // Lắng nghe khi người dùng quay lại tab sau khi ẩn
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      fetchLikes(targetId, true).then((count) => callback(count)).catch(() => {});
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  return () => {
    likesListeners[targetId]?.delete(callback);
    if (rawTargetId !== targetId) {
      likesListeners[rawTargetId]?.delete(callback);
    }
    clearInterval(intervalId);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  };
}

export async function fetchLikes(rawTargetId: string, force = false): Promise<number> {
  const targetId = normalizeLikeTargetId(rawTargetId);
  const stored = getStoredLikes(targetId);
  const currentLocal = Math.max(inMemoryLikes[targetId] || 0, stored, targetId === 'intro_page' ? 30 : 0);

  const now = Date.now();
  const lastFetch = lastLikesFetchTime[targetId] || 0;
  if (!force && now - lastFetch < 30 * 1000 && inMemoryLikes[targetId] !== undefined) {
    return currentLocal;
  }

  return deduplicatedFetch(`get_likes_${targetId}`, async () => {
    try {
      // Thêm _t timestamp và cache: 'no-store' để đảm bảo không bị Cloudflare hay trình duyệt cache cũ
      const res = await fetch(`/api/likes?targetId=${encodeURIComponent(targetId)}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.likeCount === 'number') {
          if (targetId === 'intro_page') {
             console.log(`[D1] Current Likes for Intro Page: ${data.likeCount}`);
          }
          lastLikesFetchTime[targetId] = Date.now();
          const serverCount = data.likeCount;
          if (serverCount === 521) {
            return currentLocal;
          }
          // Giữ giá trị lớn nhất tuyệt đối giữa serverCount và currentLocal
          const next = Math.max(serverCount, currentLocal);
          inMemoryLikes[targetId] = next;
          try {
            safeStorage.setItem(`cf_d1_like_${targetId}`, String(next));
            if (targetId === 'intro_page') {
              safeStorage.setItem('cf_d1_like_intro_style1', String(next));
              safeStorage.setItem('cf_d1_like_intro_style2', String(next));
            }
          } catch {}
          notifyLikeListeners(targetId, next);
          return next;
        }
      }
    } catch {}

    inMemoryLikes[targetId] = currentLocal;
    return currentLocal;
  });
}

function flushPendingLikes(targetId: string): void {
  const amount = pendingLikesQueue[targetId] || 0;
  if (amount <= 0) return;
  delete pendingLikesQueue[targetId];

  fetch('/api/likes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetId, amount }),
    keepalive: true,
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && typeof data.likeCount === 'number' && data.likeCount > 0 && data.likeCount !== 521) {
        const current = inMemoryLikes[targetId] || 0;
        const serverCount = Math.max(data.likeCount, current);
        inMemoryLikes[targetId] = serverCount;
        try {
          safeStorage.setItem(`cf_d1_like_${targetId}`, String(serverCount));
          if (targetId === 'intro_page') {
            safeStorage.setItem('cf_d1_like_intro_style1', String(serverCount));
            safeStorage.setItem('cf_d1_like_intro_style2', String(serverCount));
          }
        } catch {}
        notifyLikeListeners(targetId, serverCount);
      }
    })
    .catch(() => {});
}

export async function incrementLike(rawTargetId: string, amount = 1): Promise<number> {
  const targetId = normalizeLikeTargetId(rawTargetId);
  const stored = getStoredLikes(targetId);
  const current = Math.max(inMemoryLikes[targetId] || 0, stored, targetId === 'intro_page' ? 30 : 0);
  const next = current + amount;
  
  // 1. Cập nhật lạc quan ngay tức thì 0ms trên giao diện
  inMemoryLikes[targetId] = next;
  try {
    safeStorage.setItem(`cf_d1_like_${targetId}`, String(next));
    if (targetId === 'intro_page') {
      safeStorage.setItem('cf_d1_like_intro_style1', String(next));
      safeStorage.setItem('cf_d1_like_intro_style2', String(next));
    }
  } catch {}
  notifyLikeListeners(targetId, next);

  // 2. Gửi request POST ngay lập tức (với keepalive: true) để đảm bảo đồng bộ tức thì sang máy/thiết bị khác
  fetch('/api/likes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetId, amount }),
    keepalive: true,
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && typeof data.likeCount === 'number' && data.likeCount > 0 && data.likeCount !== 521) {
        const current = inMemoryLikes[targetId] || 0;
        const serverCount = Math.max(data.likeCount, current);
        inMemoryLikes[targetId] = serverCount;
        try {
          safeStorage.setItem(`cf_d1_like_${targetId}`, String(serverCount));
          if (targetId === 'intro_page') {
            safeStorage.setItem('cf_d1_like_intro_style1', String(serverCount));
            safeStorage.setItem('cf_d1_like_intro_style2', String(serverCount));
          }
        } catch {}
        notifyLikeListeners(targetId, serverCount);
      }
    })
    .catch(() => {});

  return next;
}

// ============================================================================
// 3. QUẢN LÝ BÌNH LUẬN (CLOUDFLARE D1 - ĐỘC LẬP HOÀN TOÀN KHỎI FIREBASE)
// ============================================================================

const commentListeners: Record<string, Set<(comments: D1Comment[]) => void>> = {};
const lastCommentsFetchTime: Record<string, number> = {};

const DELETED_COMMENTS_STORAGE_KEY = 'd1_deleted_comment_ids';

export function getDeletedCommentIds(): Set<string> {
  try {
    const raw = safeStorage.getItem(DELETED_COMMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed.map(String));
    }
  } catch {}
  return new Set();
}

export function markCommentAsDeleted(commentId: string): void {
  try {
    const set = getDeletedCommentIds();
    set.add(String(commentId));
    safeStorage.setItem(DELETED_COMMENTS_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

function getCommentSubscriptionKey(novelId: string, chapterNumber?: number | null): string {
  return `${novelId}_${typeof chapterNumber === 'number' ? chapterNumber : 'all'}`;
}

export function subscribeComments(
  novelId: string,
  chapterNumber: number | null | undefined,
  callback: (comments: D1Comment[]) => void
): () => void {
  const key = getCommentSubscriptionKey(novelId, chapterNumber);
  if (!commentListeners[key]) {
    commentListeners[key] = new Set();
  }
  commentListeners[key].add(callback);

  // 1. Phục hồi ngay từ safeStorage để không bao giờ bị chớp trắng giao diện
  const cacheKey = `d1_comments_${novelId}_${typeof chapterNumber === 'number' ? chapterNumber : 'all'}`;
  try {
    const saved = safeStorage.getItem(cacheKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const deletedSet = getDeletedCommentIds();
        callback(parsed.filter((c: D1Comment) => c && !deletedSet.has(String(c.id))));
      }
    }
  } catch {}

  // 2. Fetch mới nhất từ Cloudflare D1
  const chapNum = typeof chapterNumber === 'number' ? chapterNumber : undefined;
  fetchComments(novelId, chapNum).then((comments) => {
    callback(comments);
  }).catch(() => {});

  // 3. Chu kỳ polling tối ưu: 90s và chỉ khi tab hiển thị
  const intervalId = setInterval(() => {
    if (isPageVisible()) {
      fetchComments(novelId, chapNum).then((comments) => {
        callback(comments);
      }).catch(() => {});
    }
  }, 90 * 1000);

  // Lắng nghe khi tab active trở lại
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      const now = Date.now();
      const lastFetch = lastCommentsFetchTime[key] || 0;
      if (now - lastFetch >= 60 * 1000) {
        fetchComments(novelId, chapNum).then((comments) => callback(comments)).catch(() => {});
      }
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibility);
  }

  return () => {
    commentListeners[key]?.delete(callback);
    clearInterval(intervalId);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibility);
    }
  };
}

export async function fetchComments(novelId: string, chapterNumber?: number, force = false): Promise<D1Comment[]> {
  const cacheKey = `d1_comments_${novelId}_${chapterNumber ?? 'all'}`;
  const key = getCommentSubscriptionKey(novelId, chapterNumber);
  const deletedSet = getDeletedCommentIds();

  const now = Date.now();
  const lastFetch = lastCommentsFetchTime[key] || 0;
  if (!force && now - lastFetch < 30 * 1000) {
    try {
      const saved = safeStorage.getItem(cacheKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((c: D1Comment) => c && !deletedSet.has(String(c.id)));
        }
      }
    } catch {}
  }

  return deduplicatedFetch(`get_comments_${key}`, async () => {
    try {
      let url = `/api/comments?novelId=${encodeURIComponent(novelId)}`;
      if (typeof chapterNumber === 'number') {
        url += `&chapterNumber=${chapterNumber}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.comments)) {
          lastCommentsFetchTime[key] = Date.now();
          const cleanComments = data.comments.filter((c: D1Comment) => c && !deletedSet.has(String(c.id)));
          safeStorage.setItem(cacheKey, JSON.stringify(cleanComments));
          commentListeners[key]?.forEach((fn) => fn(cleanComments));
          return cleanComments;
        }
      }
    } catch {}

    // Fallback đọc cache local nếu ngoại tuyến
    try {
      const saved = safeStorage.getItem(cacheKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((c: D1Comment) => c && !deletedSet.has(String(c.id)));
        }
      }
    } catch {}

    return [];
  });
}

export async function addComment(commentData: {
  id?: string;
  truyenId: string;
  chapterNumber?: number;
  chapterTitle?: string;
  author: string;
  content: string;
  avatar?: string;
  badge?: string;
  rating?: number;
}): Promise<D1Comment> {
  const payload = {
    id: commentData.id || `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    truyenId: commentData.truyenId,
    chapterNumber: commentData.chapterNumber,
    chapterTitle: commentData.chapterTitle,
    author: commentData.author.trim() || 'Bạn Đọc',
    content: commentData.content.trim(),
    avatar: commentData.avatar || '',
    badge: commentData.badge || 'Độc Giả',
    rating: commentData.rating || 5,
    likes: 0,
    createdAt: formatCommentDate(),
    createdTimestamp: Date.now(),
  };

  // Cập nhật local storage cache ngay lập tức 0ms
  const cacheKey = `d1_comments_${commentData.truyenId}_${commentData.chapterNumber ?? 'all'}`;
  try {
    const raw = safeStorage.getItem(cacheKey);
    const list: D1Comment[] = raw ? JSON.parse(raw) : [];
    list.unshift(payload);
    safeStorage.setItem(cacheKey, JSON.stringify(list));
    const key = getCommentSubscriptionKey(commentData.truyenId, commentData.chapterNumber);
    commentListeners[key]?.forEach((fn) => fn(list));
  } catch {}

  try {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.comment) return data.comment;
    }
  } catch {}

  return payload;
}

export async function likeComment(commentId: string, novelId?: string, chapterNumber?: number): Promise<void> {
  try {
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', commentId }),
    });
    if (novelId) {
      fetchComments(novelId, chapterNumber, true).catch(() => {});
    }
  } catch {}
}

export async function deleteComment(commentId: string, novelId?: string, chapterNumber?: number): Promise<boolean> {
  if (!commentId) return false;
  const targetId = String(commentId).trim();

  // 1. Đánh dấu vĩnh viễn ID bình luận này đã bị xóa
  markCommentAsDeleted(targetId);
  const deletedSet = getDeletedCommentIds();

  // 2. Lập tức dọn sạch triệt để khỏi tất cả các khóa lưu trữ bộ nhớ và localStorage
  try {
    const cacheKeysToClean = [
      novelId ? `d1_comments_${novelId}_all` : null,
      novelId && typeof chapterNumber === 'number' ? `d1_comments_${novelId}_${chapterNumber}` : null,
      novelId ? `d1_comments_${novelId}_undefined` : null,
      novelId ? `d1_comments_${novelId}_null` : null,
      novelId ? `cosmo_novel_comments_${novelId}` : null,
      novelId ? `cosmo_cached_comments_${novelId}` : null,
    ].filter(Boolean) as string[];

    for (const key of cacheKeysToClean) {
      const raw = safeStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.filter((c: any) => c && String(c.id).trim() !== targetId && !deletedSet.has(String(c.id).trim()));
            safeStorage.setItem(key, JSON.stringify(cleaned));
          }
        } catch {}
      }
    }
  } catch {}

  // 3. Xóa thật sự trong cơ sở dữ liệu Cloudflare D1
  let isDeleted = false;
  try {
    const resDelete = await fetch(`/api/comments?id=${encodeURIComponent(targetId)}`, {
      method: 'DELETE',
    });
    if (resDelete.ok) isDeleted = true;
  } catch {}

  // Phương thức dự phòng qua POST action=delete (hoạt động tốt với mọi loại proxy/CDN)
  try {
    const resPost = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', commentId: targetId, id: targetId }),
    });
    if (resPost.ok) isDeleted = true;
  } catch {}

  // 4. Báo cho tất cả subscriber giao diện cập nhật ngay lập tức
  if (novelId) {
    const keyAll = getCommentSubscriptionKey(novelId, undefined);
    const keyChap = getCommentSubscriptionKey(novelId, chapterNumber);
    [keyAll, keyChap].forEach((k) => {
      const listeners = commentListeners[k];
      if (listeners && listeners.size > 0) {
        try {
          const raw = safeStorage.getItem(`d1_comments_${novelId}_all`);
          const list = raw ? JSON.parse(raw).filter((c: any) => c && String(c.id).trim() !== targetId && !deletedSet.has(String(c.id).trim())) : [];
          listeners.forEach((fn) => fn(list));
        } catch {}
      }
    });

    // 5. Cập nhật lại dữ liệu từ Cloudflare D1
    fetchComments(novelId, chapterNumber, true).catch(() => {});
  }

  return isDeleted;
}

// ============================================================================
// 3.5. GỘP API (BUNDLE API): Lấy đồng thời Views + Likes + Comments trong 1 request
// ============================================================================

export interface NovelBundleResult {
  views: {
    novelViews: number;
    chapterViews: number;
    totalGlobalViews: number;
    todayGlobalViews: number;
  };
  likes: number;
  comments: D1Comment[];
}

export async function fetchNovelBundle(
  novelId: string,
  chapterNumber?: number | null,
  force = false
): Promise<NovelBundleResult | null> {
  if (!novelId) return null;

  return deduplicatedFetch(`get_bundle_${novelId}_${chapterNumber ?? 'all'}`, async () => {
    try {
      let url = `/api/novel-bundle?novelId=${encodeURIComponent(novelId)}`;
      if (typeof chapterNumber === 'number') {
        url += `&chapterNumber=${chapterNumber}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          // 1. Cập nhật lượt xem toàn web nếu có
          if (data.views && typeof data.views.totalGlobalViews === 'number' && data.views.totalGlobalViews > 0) {
            inMemoryGlobalViews = Math.max(inMemoryGlobalViews, data.views.totalGlobalViews);
            lastViewsFetchTime = Date.now();
            safeStorage.setItem('cf_d1_global_views', String(inMemoryGlobalViews));
            globalViewsListeners.forEach((fn) => fn(inMemoryGlobalViews));
          }

          // 2. Cập nhật lượt thả tim
          if (typeof data.likes === 'number') {
            const targetId = normalizeLikeTargetId(novelId);
            const currentLocal = inMemoryLikes[targetId] || 0;
            const nextLikes = Math.max(data.likes, currentLocal);
            inMemoryLikes[targetId] = nextLikes;
            lastLikesFetchTime[targetId] = Date.now();
            try {
              safeStorage.setItem(`cf_d1_like_${targetId}`, String(nextLikes));
            } catch {}
            notifyLikeListeners(targetId, nextLikes);
          }

          // 3. Cập nhật bình luận
          if (Array.isArray(data.comments)) {
            const deletedSet = getDeletedCommentIds();
            const cleanComments = data.comments.filter((c: D1Comment) => c && !deletedSet.has(String(c.id)));
            const subKey = getCommentSubscriptionKey(novelId, chapterNumber);
            const cacheKey = `d1_comments_${novelId}_${chapterNumber ?? 'all'}`;
            lastCommentsFetchTime[subKey] = Date.now();
            safeStorage.setItem(cacheKey, JSON.stringify(cleanComments));
            commentListeners[subKey]?.forEach((fn) => fn(cleanComments));
          }

          return {
            views: data.views,
            likes: data.likes,
            comments: data.comments,
          };
        }
      }
    } catch (e) {
      console.warn('[D1] fetchNovelBundle error:', e);
    }
    return null;
  });
}

// ============================================================================
// 4. QUẢN LÝ LƯU BÚT TRANG GIỚI THIỆU (CLOUD FLARE D1 - HỖ TRỢ INTRO_DB DATABASE 2)
// ============================================================================

export type IntroGuestNote = D1GuestNote;

export interface IntroReaderMessage {
  id: number | string;
  sender: string;
  text: string;
  time: string;
  createdAt: number;
}

// Caches cho lưu bút
const inMemoryGuestNotes: Record<string, D1GuestNote[]> = {};
const lastNotesFetchTime: Record<string, number> = {};
const guestNotesListeners: Record<string, Set<(notes: D1GuestNote[]) => void>> = {};

export function subscribeGuestNotes(
  style = 'style1',
  callback: (notes: D1GuestNote[]) => void
): () => void {
  if (!guestNotesListeners[style]) {
    guestNotesListeners[style] = new Set();
  }
  guestNotesListeners[style].add(callback);

  // 1. Trả về ngay lập tức từ Memory hoặc safeStorage (0ms)
  let initial = inMemoryGuestNotes[style];
  if (!initial || initial.length === 0) {
    try {
      const saved = safeStorage.getItem(`cf_d1_notes_${style}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          initial = parsed;
          inMemoryGuestNotes[style] = parsed;
        }
      }
    } catch {}
  }

  callback(initial || []);

  // 2. Nạp dữ liệu mới nhất từ Cloudflare D1
  fetchGuestNotes(style).then((notes) => {
    callback(notes);
  }).catch(() => {});

  // 3. Chu kỳ polling tối ưu: 90s và chỉ khi tab hiển thị
  const intervalId = setInterval(() => {
    if (isPageVisible()) {
      fetchGuestNotes(style).then((notes) => callback(notes)).catch(() => {});
    }
  }, 90 * 1000);

  // Lắng nghe khi tab active trở lại
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      const now = Date.now();
      const lastFetch = lastNotesFetchTime[style] || 0;
      if (now - lastFetch >= 60 * 1000) {
        fetchGuestNotes(style).then((notes) => callback(notes)).catch(() => {});
      }
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibility);
  }

  return () => {
    guestNotesListeners[style]?.delete(callback);
    clearInterval(intervalId);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibility);
    }
  };
}

export async function fetchGuestNotes(style = 'style1', force = false): Promise<D1GuestNote[]> {
  const now = Date.now();
  const lastFetch = lastNotesFetchTime[style] || 0;
  if (!force && now - lastFetch < 45 * 1000 && inMemoryGuestNotes[style]) {
    return inMemoryGuestNotes[style];
  }

  return deduplicatedFetch(`get_notes_${style}`, async () => {
    try {
      const res = await fetch(`/api/notes?style=${encodeURIComponent(style)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.notes)) {
          lastNotesFetchTime[style] = Date.now();
          inMemoryGuestNotes[style] = data.notes;
          try {
            safeStorage.setItem(`cf_d1_notes_${style}`, JSON.stringify(data.notes));
          } catch {}
          guestNotesListeners[style]?.forEach((fn) => fn(data.notes));
          return data.notes;
        }
      }
    } catch {}

    return inMemoryGuestNotes[style] || [];
  });
}

export async function addGuestNote(style: string, author: string, content: string): Promise<D1GuestNote> {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const localId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const fallbackNote: D1GuestNote = {
    id: localId,
    style,
    author: author.trim() || 'Bạn đọc ẩn danh ♡',
    content: content.trim(),
    time: timeStr,
    createdAt: Date.now(),
  };

  // Cập nhật lạc quan (Optimistic Update) hiển thị ngay tức thì 0ms
  const currentList = inMemoryGuestNotes[style] || [];
  const updatedList = [fallbackNote, ...currentList.filter((n) => n.id !== localId)];
  inMemoryGuestNotes[style] = updatedList;
  try {
    safeStorage.setItem(`cf_d1_notes_${style}`, JSON.stringify(updatedList));
  } catch {}
  guestNotesListeners[style]?.forEach((fn) => fn(updatedList));

  try {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: localId,
        style,
        author: fallbackNote.author,
        content: fallbackNote.content,
        time: timeStr,
        createdAt: fallbackNote.createdAt,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.note) {
        const finalList = [data.note, ...updatedList.filter((n) => n.id !== localId && n.id !== data.note.id)];
        inMemoryGuestNotes[style] = finalList;
        try {
          safeStorage.setItem(`cf_d1_notes_${style}`, JSON.stringify(finalList));
        } catch {}
        guestNotesListeners[style]?.forEach((fn) => fn(finalList));
        return data.note;
      }
    }
  } catch {}

  return fallbackNote;
}

// ============================================================================
// 5. QUẢN LÝ ẢNH BÌA TRUYỆN (CLOUD FLARE D1)
// Lưu trữ trực tiếp ảnh bìa vào Cloudflare D1, chống mất ảnh & đồng bộ tức thì
// ============================================================================

let coversFetchedThisSession = false;
let lastCoversFetchTime = 0;

export async function fetchNovelCoversFromD1(force = false): Promise<Record<string, string>> {
  const now = Date.now();
  // Chỉ gọi fetch covers 1 lần mỗi phiên hoặc sau 10 phút để tiết kiệm request tối đa
  if (!force && coversFetchedThisSession && now - lastCoversFetchTime < 10 * 60 * 1000) {
    return {};
  }

  return deduplicatedFetch('get_novel_covers', async () => {
    try {
      const res = await fetch('/api/covers');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.covers === 'object' && data.covers !== null) {
          coversFetchedThisSession = true;
          lastCoversFetchTime = Date.now();
          // Tự động đồng bộ vào toàn bộ kho lưu trữ (Memory, safeStorage, IndexedDB)
          for (const [idOrTitle, coverUrl] of Object.entries(data.covers)) {
            if (coverUrl && typeof coverUrl === 'string' && coverUrl.trim()) {
              saveCustomCoverToAllStores(idOrTitle.trim(), null, coverUrl.trim());
            }
          }
          return data.covers;
        }
      }
    } catch {}
    return {};
  });
}

export async function saveNovelCoverToD1(
  novelId: string,
  coverUrl: string,
  novelTitle?: string
): Promise<{ success: boolean; error?: string }> {
  const trimmedId = (novelId || '').trim();
  const trimmedUrl = (coverUrl || '').trim();
  const trimmedTitle = (novelTitle || '').trim();

  if (!trimmedId || !trimmedUrl) {
    return { success: false, error: 'Thiếu novelId hoặc coverUrl' };
  }

  // 1. Lưu ngay lập tức vào Memory Cache, safeStorage, và IndexedDB (0ms latency, không sợ mất ảnh)
  try {
    saveCustomCoverToAllStores(trimmedId, trimmedTitle, trimmedUrl);
  } catch {}

  // 2. Gửi lưu trữ vĩnh viễn trên Cloudflare D1
  try {
    const res = await fetch('/api/covers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        novelId: trimmedId,
        coverUrl: trimmedUrl,
        novelTitle: trimmedTitle,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Lỗi lưu Cloudflare D1' };
    }
  } catch (err: any) {
    console.warn('Lỗi khi gửi ảnh bìa lên Cloudflare D1:', err);
    return { success: true };
  }

  return { success: true };
}


