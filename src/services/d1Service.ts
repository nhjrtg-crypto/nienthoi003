/**
 * D1 Database Service for Niên Thời
 * Kết nối Cloudflare D1 thông qua Cloudflare Pages Functions (/api/*)
 * Tự động đồng bộ số liệu, chịu tải hàng triệu lượt đọc miễn phí mà không lo vượt hạn mức.
 */

import { safeStorage } from '../utils/safeStorage';
import { saveCustomCoverToAllStores } from '../utils/imageUtils';

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

// Memory caches
let inMemoryGlobalViews = 3000;
let lastViewsFetchTime = 0;
const globalViewsListeners = new Set<(views: number) => void>();

// Thả tim caches
const inMemoryLikes: Record<string, number> = {};
const likesListeners: Record<string, Set<(count: number) => void>> = {};

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
  if (!force && now - lastViewsFetchTime < 60 * 1000 && inMemoryGlobalViews > 0) {
    return inMemoryGlobalViews;
  }

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
  } catch (err) {
    // Fallback mượt mà nếu đang chạy local chưa có functions
  }
  return inMemoryGlobalViews;
}

export async function incrementGlobalView(amount = 1): Promise<number> {
  inMemoryGlobalViews += amount;
  globalViewsListeners.forEach((fn) => fn(inMemoryGlobalViews));
  safeStorage.setItem('cf_d1_global_views', String(inMemoryGlobalViews));

  try {
    const res = await fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'global', amount }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.totalViews === 'number') {
        inMemoryGlobalViews = data.totalViews;
        safeStorage.setItem('cf_d1_global_views', String(inMemoryGlobalViews));
        globalViewsListeners.forEach((fn) => fn(inMemoryGlobalViews));
      }
    }
  } catch {}

  return inMemoryGlobalViews;
}

export async function recordChapterView(novelId: string, chapterNumber: number): Promise<void> {
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

export function subscribeLikes(targetId: string, callback: (count: number) => void): () => void {
  if (!likesListeners[targetId]) {
    likesListeners[targetId] = new Set();
  }
  likesListeners[targetId].add(callback);

  // Khởi tạo từ Memory hoặc safeStorage để không bao giờ bị flash số 0
  let initial = inMemoryLikes[targetId] || 0;
  try {
    const saved = safeStorage.getItem(`cf_d1_like_${targetId}`);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        // Nếu dính số ảo cũ >= 500 thì reset về 30 theo yêu cầu người dùng
        if (targetId.startsWith('intro_') && parsed >= 500) {
          initial = 30;
          safeStorage.setItem(`cf_d1_like_${targetId}`, '30');
        } else {
          initial = parsed;
        }
      }
    }
  } catch {}

  // Mặc định bắt đầu từ số 30 cho trang giới thiệu
  if (initial <= 0 || (targetId.startsWith('intro_') && initial >= 500)) {
    if (targetId === 'intro_style1' || targetId === 'intro_style2') {
      initial = 30;
      try {
        safeStorage.setItem(`cf_d1_like_${targetId}`, '30');
      } catch {}
    }
  }

  inMemoryLikes[targetId] = initial;
  callback(initial);

  fetchLikes(targetId).then((count) => {
    callback(count);
  }).catch(() => {});

  // Tự động làm mới mỗi 30s nếu người dùng còn ở trang
  const intervalId = setInterval(() => {
    fetchLikes(targetId).then((count) => callback(count)).catch(() => {});
  }, 30 * 1000);

  return () => {
    likesListeners[targetId]?.delete(callback);
    clearInterval(intervalId);
  };
}

export async function fetchLikes(targetId: string): Promise<number> {
  try {
    const res = await fetch(`/api/likes?targetId=${encodeURIComponent(targetId)}`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.likeCount === 'number') {
        let serverCount = data.likeCount;
        if (targetId.startsWith('intro_') && serverCount >= 500) {
          serverCount = 30;
        }
        const next = Math.max(serverCount, inMemoryLikes[targetId] || (targetId.startsWith('intro_') ? 30 : 0));
        inMemoryLikes[targetId] = next;
        try {
          safeStorage.setItem(`cf_d1_like_${targetId}`, String(next));
        } catch {}
        likesListeners[targetId]?.forEach((fn) => fn(next));
        return next;
      }
    }
  } catch {}
  return inMemoryLikes[targetId] || (targetId.startsWith('intro_') ? 30 : 0);
}

export async function incrementLike(targetId: string, amount = 1): Promise<number> {
  const current = inMemoryLikes[targetId] || (targetId.startsWith('intro_') ? 30 : 0);
  const next = current + amount;
  inMemoryLikes[targetId] = next;
  try {
    safeStorage.setItem(`cf_d1_like_${targetId}`, String(next));
  } catch {}
  likesListeners[targetId]?.forEach((fn) => fn(next));

  try {
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId, amount }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.likeCount === 'number') {
        const serverCount = Math.max(data.likeCount, next);
        inMemoryLikes[targetId] = serverCount;
        try {
          safeStorage.setItem(`cf_d1_like_${targetId}`, String(serverCount));
        } catch {}
        likesListeners[targetId]?.forEach((fn) => fn(serverCount));
        return serverCount;
      }
    }
  } catch {}

  return next;
}

// ============================================================================
// 3. QUẢN LÝ BÌNH LUẬN (CLOUDFLARE D1 - ĐỘC LẬP HOÀN TOÀN KHỎI FIREBASE)
// ============================================================================

const commentListeners: Record<string, Set<(comments: D1Comment[]) => void>> = {};

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
        callback(parsed);
      }
    }
  } catch {}

  // 2. Fetch mới nhất từ Cloudflare D1
  const chapNum = typeof chapterNumber === 'number' ? chapterNumber : undefined;
  fetchComments(novelId, chapNum).then((comments) => {
    callback(comments);
  }).catch(() => {});

  // 3. Tự động kiểm tra bình luận mới mỗi 25s
  const intervalId = setInterval(() => {
    fetchComments(novelId, chapNum).then((comments) => {
      callback(comments);
    }).catch(() => {});
  }, 25 * 1000);

  return () => {
    commentListeners[key]?.delete(callback);
    clearInterval(intervalId);
  };
}

export async function fetchComments(novelId: string, chapterNumber?: number): Promise<D1Comment[]> {
  const cacheKey = `d1_comments_${novelId}_${chapterNumber ?? 'all'}`;
  try {
    let url = `/api/comments?novelId=${encodeURIComponent(novelId)}`;
    if (typeof chapterNumber === 'number') {
      url += `&chapterNumber=${chapterNumber}`;
    }
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.comments)) {
        safeStorage.setItem(cacheKey, JSON.stringify(data.comments));
        const key = getCommentSubscriptionKey(novelId, chapterNumber);
        commentListeners[key]?.forEach((fn) => fn(data.comments));
        return data.comments;
      }
    }
  } catch {}

  // Fallback đọc cache local nếu ngoại tuyến
  try {
    const saved = safeStorage.getItem(cacheKey);
    if (saved) return JSON.parse(saved);
  } catch {}

  return [];
}

export async function addComment(commentData: {
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
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    truyenId: commentData.truyenId,
    chapterNumber: commentData.chapterNumber,
    chapterTitle: commentData.chapterTitle,
    author: commentData.author.trim() || 'Bạn Đọc',
    content: commentData.content.trim(),
    avatar: commentData.avatar || '',
    badge: commentData.badge || 'Độc Giả',
    rating: commentData.rating || 5,
    likes: 0,
    createdAt: new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    createdTimestamp: Date.now(),
  };

  // Cập nhật local storage cache ngay lập tức
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
      fetchComments(novelId, chapterNumber).catch(() => {});
    }
  } catch {}
}

export async function deleteComment(commentId: string, novelId?: string, chapterNumber?: number): Promise<boolean> {
  try {
    const res = await fetch(`/api/comments?id=${encodeURIComponent(commentId)}`, {
      method: 'DELETE',
    });
    if (novelId) {
      fetchComments(novelId, chapterNumber).catch(() => {});
    }
    return res.ok;
  } catch {
    return false;
  }
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

  // 3. Chu kỳ 20s tự động cập nhật nếu độc giả còn trên trang
  const intervalId = setInterval(() => {
    fetchGuestNotes(style).then((notes) => callback(notes)).catch(() => {});
  }, 20 * 1000);

  return () => {
    guestNotesListeners[style]?.delete(callback);
    clearInterval(intervalId);
  };
}

export async function fetchGuestNotes(style = 'style1'): Promise<D1GuestNote[]> {
  try {
    const res = await fetch(`/api/notes?style=${encodeURIComponent(style)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.notes)) {
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

export async function fetchNovelCoversFromD1(): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/covers');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.covers === 'object' && data.covers !== null) {
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

