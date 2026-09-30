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
  'efOQgOJqeFd1hoUzVrnT': '/covers/tu_duoi.jpg',
  's1zJUVAn4uMW3h7NXO9M': '/covers/truc_ma_alpha.jpg',
  'Wt9SMT1pLOVFGoQZMrH6': '/covers/truc_ma_alpha.jpg',
  'truc-ma-alpha': '/covers/truc_ma_alpha.jpg',
  'S905U9txM2WsuwTneSd8': '/covers/cuoc_song_dam_loan.jpg',
  'QTMywdfEbQJLVQP7wboP': '/covers/thoi_mien.jpg',
  'zXqsDoGbW3P2uvf93eIS': '/covers/cuong_ep_yeu.jpg',
  'Rr94841TlcKroz8iyzdv': '/covers/ke_thu.jpg',
  'lua-nhau': '/covers/lua_nhau.jpg',
  'me-ke-vua-mem-vua-ngot': '/me_ke_vua_mem_vua_ngot_cover.jpg',
  'e5H5oZGg1sGnFyHjdM5Z': '/me_ke_vua_mem_vua_ngot_cover.jpg',
  'yme8xnS09QjO5nYF8Jsz': '/me_ke_vua_mem_vua_ngot_cover.jpg',
};

/**
 * Find exact original cover based on ID or title keyword
 */
export function getOriginalCoverByNovel(novelId?: string | null, title?: string | null): string | null {
  if (novelId && NOVEL_ORIGINAL_COVERS[novelId]) {
    return NOVEL_ORIGINAL_COVERS[novelId];
  }

  const query = `${novelId || ''} ${title || ''}`.toLowerCase();

  if (query.includes('trúc mã alpha') || query.includes('truc-ma-alpha') || query.includes('truc_ma_alpha') || query.includes('truc ma alpha') || query.includes('wt9smt1plovfgoqzmrh6') || query.includes('s1zjuvan4umw3h7nxo9m')) {
    return '/covers/truc_ma_alpha.jpg';
  }
  if (query.includes('gấp đôi luân hãm') || query.includes('gap-doi') || query.includes('gap_doi') || query.includes('luân hãm') || query.includes('kr2dqtbmvfyrrzmewydo')) {
    return '/covers/gap_doi_luan_ham.jpg';
  }
  if (query.includes('cám dỗ vụng trộm') || query.includes('series ntr') || query.includes('ntr')) {
    return '/covers/series_ntr.jpg';
  }
  if (query.includes('tù đuôi') || query.includes('tu-duoi') || query.includes('tu_duoi')) {
    return '/covers/tu_duoi.jpg';
  }
  if (query.includes('cuộc sống dâm loạn') || query.includes('bộ lạc')) {
    return '/covers/cuoc_song_dam_loan.jpg';
  }
  if (query.includes('thôi miên') || query.includes('bạn cùng phòng')) {
    return '/covers/thoi_mien.jpg';
  }
  if (query.includes('cưỡng ép yêu') || query.includes('bị nam chính điên cuồng')) {
    return '/covers/cuong_ep_yeu.jpg';
  }
  if (query.includes('căng sữa') || query.includes('kẻ thù')) {
    return '/covers/ke_thu.jpg';
  }
  if (query.includes('lừa nhau') || query.includes('lua-nhau') || query.includes('lua nhau')) {
    return '/covers/lua_nhau.jpg';
  }
  if (query.includes('mẹ kế') || query.includes('me-ke')) {
    return '/me_ke_vua_mem_vua_ngot_cover.jpg';
  }

  return null;
}

/**
 * Retrieve custom cover image uploaded or set by user from safeStorage.
 * Keeps cover perfectly synchronized between NovelDetailView and NovelHomeView.
 */
export function getCustomCoverFromStorage(novelIdOrTitle?: string | null): string | null {
  if (!novelIdOrTitle) return null;
  try {
    const raw = novelIdOrTitle.trim();
    // 1. Direct ID check
    const byId = safeStorage.getItem(`cosmo_novel_custom_cover_${raw}`);
    if (byId && typeof byId === 'string' && byId.trim()) {
      return byId.trim();
    }

    // 2. Known alias IDs and titles
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
 * prioritizing original cover files and handling Google Drive sharing links.
 */
export function getDirectImageUrl(url: string | undefined | null, novelIdOrTitle?: string): string {
  // 0. Highest priority: if a custom cover exists in safeStorage (synced with NovelDetailView), always use it!
  const customCover = getCustomCoverFromStorage(novelIdOrTitle);
  if (customCover) {
    return customCover;
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
      if (trimmed.includes('lua_nhau') || trimmed.includes('1oqpUECsYtkmUUAYkXlRbq1cTUhUHFHGm')) {
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
        if (driveFileMatch[1] === '1nm6xF9zncDSSWiwHrpa0ppG14E0JcLFB') {
          return '/covers/gap_doi_luan_ham.jpg';
        }
        if (driveFileMatch[1] === '1oqpUECsYtkmUUAYkXlRbq1cTUhUHFHGm') {
          return '/covers/lua_nhau.jpg';
        }
        if (novelIdOrTitle) {
          const matched = getOriginalCoverByNovel(novelIdOrTitle, novelIdOrTitle);
          if (matched) return matched;
        }
        return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
      }

      const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (trimmed.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) {
        if (driveIdMatch[1] === '1nm6xF9zncDSSWiwHrpa0ppG14E0JcLFB') {
          return '/covers/gap_doi_luan_ham.jpg';
        }
        if (driveIdMatch[1] === '1oqpUECsYtkmUUAYkXlRbq1cTUhUHFHGm') {
          return '/covers/lua_nhau.jpg';
        }
        if (novelIdOrTitle) {
          const matched = getOriginalCoverByNovel(novelIdOrTitle, novelIdOrTitle);
          if (matched) return matched;
        }
        return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
      }

      // 4. Any other valid web link (https://... or /...)
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
 * preventing cross-contamination of covers between novels.
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

