export const NOVEL_ORIGINAL_COVERS: Record<string, string> = {
  // By Novel ID
  'JyjZxRaIxFvvZ2Ijyxef': '/covers/series_ntr.jpg',
  'KR2dQTBMVfyRrzmewydO': '/covers/gap_doi_luan_ham.jpg',
  'efOQgOJqeFd1hoUzVrnT': '/covers/tu_duoi.jpg',
  's1zJUVAn4uMW3h7NXO9M': '/covers/truc_ma_alpha.jpg',
  'truc-ma-alpha': '/covers/truc_ma_alpha.jpg',
  'S905U9txM2WsuwTneSd8': '/covers/cuoc_song_dam_loan.jpg',
  'QTMywdfEbQJLVQP7wboP': '/covers/thoi_mien.jpg',
  'zXqsDoGbW3P2uvf93eIS': '/covers/cuong_ep_yeu.jpg',
  'Rr94841TlcKroz8iyzdv': '/covers/ke_thu.jpg',
  'lua-nhau': '/lua_nhau_user_cover.jpg',
  'me-ke-vua-mem-vua-ngot': '/me_ke_vua_mem_vua_ngot_cover.jpg',
  'e5H5oZGg1sGnFyHjdM5Z': '/me_ke_vua_mem_vua_ngot_cover.jpg',
};

/**
 * Find exact original cover based on ID or title keyword
 */
export function getOriginalCoverByNovel(novelId?: string | null, title?: string | null): string | null {
  if (novelId && NOVEL_ORIGINAL_COVERS[novelId]) {
    return NOVEL_ORIGINAL_COVERS[novelId];
  }

  if (title) {
    const t = title.toLowerCase();
    if (t.includes('cám dỗ vụng trộm') || t.includes('series ntr') || t.includes('ntr')) {
      return '/covers/series_ntr.jpg';
    }
    if (t.includes('gấp đôi luân hãm') || t.includes('luân hãm')) {
      return '/covers/gap_doi_luan_ham.jpg';
    }
    if (t.includes('tù đuôi')) {
      return '/covers/tu_duoi.jpg';
    }
    if (t.includes('trúc mã alpha')) {
      return '/covers/truc_ma_alpha.jpg';
    }
    if (t.includes('cuộc sống dâm loạn') || t.includes('bộ lạc')) {
      return '/covers/cuoc_song_dam_loan.jpg';
    }
    if (t.includes('thôi miên') || t.includes('bạn cùng phòng')) {
      return '/covers/thoi_mien.jpg';
    }
    if (t.includes('cưỡng ép yêu') || t.includes('bị nam chính điên cuồng')) {
      return '/covers/cuong_ep_yeu.jpg';
    }
    if (t.includes('căng sữa') || t.includes('kẻ thù')) {
      return '/covers/ke_thu.jpg';
    }
    if (t.includes('kẻ nhà giàu') || t.includes('lừa nhau')) {
      return '/lua_nhau_user_cover.jpg';
    }
    if (t.includes('mẹ kế')) {
      return '/me_ke_vua_mem_vua_ngot_cover.jpg';
    }
  }

  return null;
}

/**
 * Utility to resolve direct displayable image URLs from various sources,
 * prioritizing original cover files and handling Google Drive sharing links.
 */
export function getDirectImageUrl(url: string | undefined | null, novelIdOrTitle?: string): string {
  if (url && typeof url === 'string') {
    const trimmed = url.trim();
    if (trimmed) {
      // 1. If uploaded by user (data URL or blob), always use it directly!
      if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) {
        return trimmed;
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
    const original = getOriginalCoverByNovel(novelIdentifier, novelIdentifier);
    target.src = original || '/covers/gap_doi_luan_ham.jpg';
  }
}

