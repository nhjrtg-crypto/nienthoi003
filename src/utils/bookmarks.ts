import { safeStorage } from './safeStorage';

const BOOKMARKS_STORAGE_KEY = 'cosmo_novel_bookmarks';

export function getBookmarkedNovelIds(): string[] {
  try {
    const raw = safeStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isNovelBookmarked(novelId: string): boolean {
  if (!novelId) return false;
  const bookmarks = getBookmarkedNovelIds();
  return bookmarks.includes(novelId);
}

export function toggleNovelBookmark(novelId: string): boolean {
  if (!novelId) return false;
  const bookmarks = getBookmarkedNovelIds();
  const index = bookmarks.indexOf(novelId);
  let nextState = false;
  let updated: string[];
  if (index >= 0) {
    updated = bookmarks.filter((id) => id !== novelId);
    nextState = false;
  } else {
    updated = [...bookmarks, novelId];
    nextState = true;
  }
  try {
    safeStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cosmo_bookmarks_changed', { detail: updated }));
    }
  } catch {}
  return nextState;
}
