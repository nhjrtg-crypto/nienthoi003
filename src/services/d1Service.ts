/**
 * D1 Database Service for Niên Thời
 * Kết nối Cloudflare D1 thông qua Cloudflare Pages Functions (/api/*)
 * Tự động đồng bộ số liệu, chịu tải hàng triệu lượt đọc miễn phí mà không lo vượt hạn mức.
 */

import { safeStorage } from '../utils/safeStorage';

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
// 2. QUẢN LÝ LƯỢT THẢ TIM (CLOUD FLARE D1)
// ============================================================================

export function subscribeLikes(targetId: string, callback: (count: number) => void): () => void {
  if (!likesListeners[targetId]) {
    likesListeners[targetId] = new Set();
  }
  likesListeners[targetId].add(callback);

  const initial = inMemoryLikes[targetId] || 0;
  if (initial > 0) callback(initial);

  fetchLikes(targetId).then((count) => callback(count)).catch(() => {});

  return () => {
    likesListeners[targetId]?.delete(callback);
  };
}

export async function fetchLikes(targetId: string): Promise<number> {
  try {
    const res = await fetch(`/api/likes?targetId=${encodeURIComponent(targetId)}`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.likeCount === 'number') {
        inMemoryLikes[targetId] = data.likeCount;
        likesListeners[targetId]?.forEach((fn) => fn(data.likeCount));
        return data.likeCount;
      }
    }
  } catch {}
  return inMemoryLikes[targetId] || 0;
}

export async function incrementLike(targetId: string, amount = 1): Promise<number> {
  const current = inMemoryLikes[targetId] || 0;
  const next = current + amount;
  inMemoryLikes[targetId] = next;
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
        inMemoryLikes[targetId] = data.likeCount;
        likesListeners[targetId]?.forEach((fn) => fn(data.likeCount));
        return data.likeCount;
      }
    }
  } catch {}

  return next;
}

// ============================================================================
// 3. QUẢN LÝ BÌNH LUẬN (CLOUD FLARE D1)
// ============================================================================

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

  // Cập nhật local storage cache nếu offline
  const cacheKey = `d1_comments_${commentData.truyenId}_${commentData.chapterNumber ?? 'all'}`;
  try {
    const raw = safeStorage.getItem(cacheKey);
    const list: D1Comment[] = raw ? JSON.parse(raw) : [];
    list.unshift(payload);
    safeStorage.setItem(cacheKey, JSON.stringify(list));
  } catch {}

  return payload;
}

export async function likeComment(commentId: string): Promise<void> {
  try {
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', commentId }),
    });
  } catch {}
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/comments?id=${encodeURIComponent(commentId)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ============================================================================
// 4. QUẢN LÝ LƯU BÚT TRANG GIỚI THIỆU (CLOUD FLARE D1)
// ============================================================================

export async function fetchGuestNotes(style = 'style1'): Promise<D1GuestNote[]> {
  try {
    const res = await fetch(`/api/notes?style=${encodeURIComponent(style)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.notes)) return data.notes;
    }
  } catch {}
  return [];
}

export async function addGuestNote(style: string, author: string, content: string): Promise<D1GuestNote | null> {
  try {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ style, author, content }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.note) return data.note;
    }
  } catch {}
  return null;
}
