import { Novel } from '../types';
import { safeStorage } from './safeStorage';

const BOOKMARKS_STORAGE_KEY = 'cosmo_user_bookmarks_v1';

export function getBookmarkedNovelIds(): string[] {
  try {
    const raw = safeStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse bookmarks', e);
  }
  return [];
}

export function isNovelBookmarked(novelId: string): boolean {
  if (!novelId) return false;
  const list = getBookmarkedNovelIds();
  return list.includes(novelId);
}

export function toggleNovelBookmark(novelId: string): boolean {
  if (!novelId) return false;
  const list = getBookmarkedNovelIds();
  const exists = list.includes(novelId);
  const next = exists ? list.filter((id) => id !== novelId) : [...list, novelId];
  try {
    safeStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('cosmo_bookmarks_changed', { detail: next }));
  } catch (e) {
    console.warn('Failed to save bookmark', e);
  }
  return !exists;
}

export function getBookmarkedNovels(availableNovels: Novel[]): Novel[] {
  if (!availableNovels || availableNovels.length === 0) return [];
  const ids = getBookmarkedNovelIds();
  if (ids.length === 0) return [];
  return availableNovels.filter((n) => ids.includes(n.id));
}
