import { safeStorage } from './safeStorage';

export function normalizeNovelTitle(title?: string | null): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export const NOVEL_ORIGINAL_COVERS: Record<string, string> = {
  // By Novel ID
  'JyjZxRaIxFvvZ2Ijyxef': '/covers/series_ntr.jpg',
  'KR2dQTBMVfyRrzmewydO': '/covers/gap_doi_luan_ham.jpg',
  'gap-doi-luan-ham': '/covers/gap_doi_luan_ham.jpg',
  'efOQgOJqeFd1hoUzVrnT': '/covers/tu_duoi.jpg',
  'tu-duoi': '/covers/tu_duoi.jpg',
  's1zJUVAn4uMW3h7NXO9M': '/covers/truc_ma_alpha.jpg',
  'Wt9SMT1pLOVFGoQZMrH6': '/covers/truc_ma_alpha.jpg',
  'truc-ma-alpha': '/covers/truc_ma_alpha.jpg',
  'S905U9txM2WsuwTneSd8': '/covers/cuoc_song_dam_loan.jpg',
  'cuoc-song-dam-loan': '/covers/cuoc_song_dam_loan.jpg',
  'QTMywdfEbQJLVQP7wboP': '/covers/thoi_mien.jpg',
  'thoi-mien': '/covers/thoi_mien.jpg',
  'zXqsDoGbW3P2uvf93eIS': '/covers/cuong_ep_yeu.jpg',
  'cuong-ep-yeu': '/covers/cuong_ep_yeu.jpg',
  'Rr94841TlcKroz8iyzdv': '/covers/ke_thu.jpg',
  'ke-thu': '/covers/ke_thu.jpg',
  'lua-nhau': '/covers/lua_nhau.jpg',
  'me-ke-vua-mem-vua-ngot': '/me_ke_vua_mem_vua_ngot_cover.jpg',
  'e5H5oZGg1sGnFyHjdM5Z': '/me_ke_vua_mem_vua_ngot_cover.jpg',
  'yme8xnS09QjO5nYF8Jsz': '/me_ke_vua_mem_vua_ngot_cover.jpg',
};

/**
 * In-memory fast cache of user custom covers
 */
const inMemoryCustomCovers = new Map<string, string>();

/**
 * IndexedDB persistence for novel covers (Không giới hạn dung lượng 5MB như localStorage)
 */
const IDB_NAME = 'cosmo_covers_db';
const IDB_STORE = 'covers';

function openCoverDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = window.indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveCoverToIndexedDB(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openCoverDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put({ key, dataUrl, updatedAt: Date.now() });
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
  } catch {}
}

export async function initCoversFromIndexedDB(): Promise<Record<string, string>> {
  try {
    const db = await openCoverDB();
    const tx = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req = store.getAll();
    return new Promise((resolve) => {
      req.onsuccess = () => {
        const result: Record<string, string> = {};
        if (Array.isArray(req.result)) {
          for (const item of req.result) {
            if (item.key && item.dataUrl) {
              result[item.key] = item.dataUrl;
              inMemoryCustomCovers.set(item.key, item.dataUrl);
            }
          }
        }
        resolve(result);
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

// Khởi tạo IndexedDB ngay khi tải trang
if (typeof window !== 'undefined') {
  initCoversFromIndexedDB().catch(() => {});
}

/**
 * Lưu ảnh bìa tùy chỉnh vào mọi kho lưu trữ cục bộ:
 * In-memory Cache, safeStorage, và IndexedDB
 */
export function saveCustomCoverToAllStores(
  novelId: string,
  title: string | undefined | null,
  coverUrl: string
): void {
  const trimmedUrl = (coverUrl || '').trim();
  if (!trimmedUrl) return;

  const rawId = (novelId || '').trim();
  const rawTitle = (title || '').trim();
  const normTitle = normalizeNovelTitle(rawTitle);

  // 1. In-memory Cache
  if (rawId) inMemoryCustomCovers.set(rawId, trimmedUrl);
  if (rawTitle) inMemoryCustomCovers.set(rawTitle, trimmedUrl);
  if (normTitle) inMemoryCustomCovers.set(normTitle, trimmedUrl);

  // 2. safeStorage
  try {
    if (rawId) safeStorage.setItem(`cosmo_novel_custom_cover_${rawId}`, trimmedUrl);
    if (rawTitle) safeStorage.setItem(`cosmo_novel_custom_cover_${rawTitle}`, trimmedUrl);
    if (normTitle) safeStorage.setItem(`cosmo_novel_custom_cover_${normTitle}`, trimmedUrl);

    // Cập nhật từ điển tổng
    const mapStr = safeStorage.getItem('cosmo_novel_covers_map');
    const map = mapStr ? JSON.parse(mapStr) : {};
    if (rawId) map[rawId] = trimmedUrl;
    if (rawTitle) map[rawTitle] = trimmedUrl;
    if (normTitle) map[normTitle] = trimmedUrl;
    safeStorage.setItem('cosmo_novel_covers_map', JSON.stringify(map));
  } catch {}

  // 3. IndexedDB
  if (rawId) saveCoverToIndexedDB(rawId, trimmedUrl);
  if (normTitle) saveCoverToIndexedDB(normTitle, trimmedUrl);
}

/**
 * Find exact original cover based on ID or title keyword
 */
export function getOriginalCoverByNovel(novelId?: string | null, title?: string | null): string | null {
  if (novelId && NOVEL_ORIGINAL_COVERS[novelId]) {
    return NOVEL_ORIGINAL_COVERS[novelId];
  }

  const query = `${novelId || ''} ${title || ''}`.toLowerCase();
  const norm = normalizeNovelTitle(query);

  if (norm.includes('trucmaalpha') || query.includes('trúc mã alpha') || query.includes('truc-ma-alpha') || query.includes('truc_ma_alpha') || query.includes('truc ma alpha') || query.includes('wt9smt1plovfgoqzmrh6') || query.includes('s1zjuvan4umw3h7nxo9m')) {
    return '/covers/truc_ma_alpha.jpg';
  }
  if (norm.includes('gapdoiluanham') || query.includes('gấp đôi luân hãm') || query.includes('gap-doi') || query.includes('gap_doi') || query.includes('luân hãm') || query.includes('kr2dqtbmvfyrrzmewydo')) {
    return '/covers/gap_doi_luan_ham.jpg';
  }
  if (norm.includes('camdovungtrom') || norm.includes('seriesntr') || norm.includes('ntr') || query.includes('cám dỗ vụng trộm') || query.includes('series ntr')) {
    return '/covers/series_ntr.jpg';
  }
  if (norm.includes('tuduoi') || query.includes('tù đuôi') || query.includes('tu-duoi') || query.includes('tu_duoi')) {
    return '/covers/tu_duoi.jpg';
  }
  if (norm.includes('cuocsongdamloan') || query.includes('cuộc sống dâm loạn') || query.includes('bộ lạc')) {
    return '/covers/cuoc_song_dam_loan.jpg';
  }
  if (norm.includes('thoimien') || query.includes('thôi miên') || query.includes('bạn cùng phòng')) {
    return '/covers/thoi_mien.jpg';
  }
  if (norm.includes('cuongepyeu') || query.includes('cưỡng ép yêu') || query.includes('bị nam chính điên cuồng')) {
    return '/covers/cuong_ep_yeu.jpg';
  }
  if (norm.includes('cangsua') || norm.includes('kethu') || query.includes('căng sữa') || query.includes('kẻ thù')) {
    return '/covers/ke_thu.jpg';
  }
  if (norm.includes('luanhau') || query.includes('lừa nhau') || query.includes('lua-nhau') || query.includes('lua nhau')) {
    return '/covers/lua_nhau.jpg';
  }
  if (norm.includes('mekevuamemvuangot') || norm.includes('meke') || query.includes('mẹ kế') || query.includes('me-ke')) {
    return '/me_ke_vua_mem_vua_ngot_cover.jpg';
  }

  return null;
}

/**
 * Retrieve custom cover image uploaded or set by user from safeStorage or memory.
 * Keeps cover perfectly synchronized between NovelDetailView, NovelHomeView, and all components.
 */
export function getCustomCoverFromStorage(novelIdOrTitle?: string | null): string | null {
  if (!novelIdOrTitle) return null;
  const raw = novelIdOrTitle.trim();
  if (!raw) return null;

  // 1. Fast check in memory cache
  const inMem = inMemoryCustomCovers.get(raw);
  if (inMem && inMem.trim()) return inMem.trim();

  const norm = normalizeNovelTitle(raw);
  if (norm) {
    const inMemNorm = inMemoryCustomCovers.get(norm);
    if (inMemNorm && inMemNorm.trim()) return inMemNorm.trim();
  }

  try {
    // 2. Direct ID / Title check in safeStorage
    const byId = safeStorage.getItem(`cosmo_novel_custom_cover_${raw}`);
    if (byId && typeof byId === 'string' && byId.trim()) {
      inMemoryCustomCovers.set(raw, byId.trim());
      return byId.trim();
    }

    if (norm) {
      const byNorm = safeStorage.getItem(`cosmo_novel_custom_cover_${norm}`);
      if (byNorm && typeof byNorm === 'string' && byNorm.trim()) {
        inMemoryCustomCovers.set(norm, byNorm.trim());
        return byNorm.trim();
      }
    }

    // 3. Check in covers map dictionary
    const mapStr = safeStorage.getItem('cosmo_novel_covers_map');
    if (mapStr) {
      const map = JSON.parse(mapStr);
      if (map[raw] && typeof map[raw] === 'string' && map[raw].trim()) {
        return map[raw].trim();
      }
      if (norm && map[norm] && typeof map[norm] === 'string' && map[norm].trim()) {
        return map[norm].trim();
      }
    }

    // 4. Known aliases
    const qLower = raw.toLowerCase();
    if (qLower === 'me-ke-vua-mem-vua-ngot' || qLower === 'e5h5ozgg1sgnfyhjdm5z' || qLower.includes('mẹ kế')) {
      const c =
        safeStorage.getItem('cosmo_novel_custom_cover_e5H5oZGg1sGnFyHjdM5Z') ||
        safeStorage.getItem('cosmo_novel_custom_cover_me-ke-vua-mem-vua-ngot');
      if (c && c.trim()) return c.trim();
    }
    if (qLower === 'lua-nhau' || qLower.includes('lừa nhau')) {
      const c = safeStorage.getItem('cosmo_novel_custom_cover_lua-nhau');
      if (c && c.trim()) return c.trim();
    }
    if (
      qLower.includes('truc-ma-alpha') ||
      qLower.includes('truc ma alpha') ||
      qLower.includes('trúc mã alpha') ||
      qLower === 's1zjuvan4umw3h7nxo9m' ||
      qLower === 'wt9smt1plovfgoqzmrh6'
    ) {
      const c =
        safeStorage.getItem('cosmo_novel_custom_cover_s1zJUVAn4uMW3h7NXO9M') ||
        safeStorage.getItem('cosmo_novel_custom_cover_truc-ma-alpha') ||
        safeStorage.getItem('cosmo_novel_custom_cover_Wt9SMT1pLOVFGoQZMrH6');
      if (c && c.trim()) return c.trim();
    }
  } catch {}
  return null;
}

/**
 * Utility to resolve direct displayable image URLs from various sources,
 * prioritizing user custom covers and properly formatting Google Drive links.
 */
export function getDirectImageUrl(url: string | undefined | null, novelIdOrTitle?: string): string {
  // 0. Highest priority: if a custom cover exists (synced with NovelDetailView), ALWAYS use it!
  const customCover = getCustomCoverFromStorage(novelIdOrTitle);
  if (customCover && customCover.trim()) {
    return customCover.trim();
  }

  if (url && typeof url === 'string') {
    const trimmed = url.trim();
    if (trimmed) {
      // 1. If uploaded by user (data URL or blob), always use it directly!
      if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) {
        return trimmed;
      }

      // Direct asset correction for hashed bundle paths
      if (trimmed.includes('truc_ma_alpha')) {
        return '/covers/truc_ma_alpha.jpg';
      }
      if (trimmed.includes('lua_nhau') || trimmed.includes('1oqpUECsYtkmUUAYkXlRbq1cTUhUHFHGm') || trimmed.includes('19Wkxij9kEqzeFU5QcfBrJJWlYETPpWB_')) {
        return '/covers/lua_nhau.jpg';
      }
      if (trimmed.startsWith('/assets/') && trimmed.includes('me_ke')) {
        return '/me_ke_vua_mem_vua_ngot_cover.jpg';
      }

      // 2. If it is already a local asset path (/covers/...)
      if (trimmed.startsWith('/covers/') || trimmed.startsWith('./covers/')) {
        return trimmed;
      }

      // 3. Handle Google Drive links
      const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (driveFileMatch && driveFileMatch[1]) {
        const fileId = driveFileMatch[1];
        if (fileId === '1nm6xF9zncDSSWiwHrpa0ppG14E0JcLFB') {
          return '/covers/gap_doi_luan_ham.jpg';
        }
        if (fileId === '1oqpUECsYtkmUUAYkXlRbq1cTUhUHFHGm' || fileId === '19Wkxij9kEqzeFU5QcfBrJJWlYETPpWB_') {
          return '/covers/lua_nhau.jpg';
        }
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      }

      const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (trimmed.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) {
        const fileId = driveIdMatch[1];
        if (fileId === '1nm6xF9zncDSSWiwHrpa0ppG14E0JcLFB') {
          return '/covers/gap_doi_luan_ham.jpg';
        }
        if (fileId === '1oqpUECsYtkmUUAYkXlRbq1cTUhUHFHGm' || fileId === '19Wkxij9kEqzeFU5QcfBrJJWlYETPpWB_') {
          return '/covers/lua_nhau.jpg';
        }
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      }

      // 4. Any other valid web link (http://, https://, /...)
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
        return trimmed;
      }
    }
  }

  // Fallback: If no valid url provided, use novel's original cover or placeholder
  if (novelIdOrTitle) {
    const matched = getOriginalCoverByNovel(novelIdOrTitle, novelIdOrTitle);
    if (matched) return matched;
  }

  return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop';
}

/**
 * Handle image error by falling back to the novel's specific original cover,
 * preventing broken images and cross-contamination.
 */
export function handleCoverImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  novelIdentifier?: string
) {
  const target = event.currentTarget;
  if (!target.dataset.hasFallback) {
    target.dataset.hasFallback = 'true';
    const altText = target.alt || '';
    const idToTry = (typeof novelIdentifier === 'string' && novelIdentifier) ? novelIdentifier : altText;
    const original = getOriginalCoverByNovel(idToTry, idToTry);
    target.src = original || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop';
  }
}
