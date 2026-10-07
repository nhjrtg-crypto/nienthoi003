import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { HeroSection } from './components/HeroSection';
import { WelcomeNoticeSection } from './components/WelcomeNoticeSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { ProjectModal } from './components/ProjectModal';
import { Footer } from './components/Footer';
import { CosmicBackground } from './components/CosmicBackground';
import { NovelHomeView } from './components/NovelHomeView';
import { NovelDetailView } from './components/NovelDetailView';
import { NovelReaderModal } from './components/NovelReaderModal';
import { PublishNovelModal } from './components/PublishNovelModal';
import { TwoPagePlannerHeartView } from './components/TwoPagePlannerHeartView';
import { AboutLightTamagotchiView } from './components/AboutLightTamagotchiView';
import { AdminAuthModal } from './components/AdminAuthModal';
import { CreateFirestoreTruyenModal } from './components/CreateFirestoreTruyenModal';
import { DailyLimitExceededModal } from './components/DailyLimitExceededModal';
import { ModernLoadingScreen } from './components/ModernLoadingScreen';
import { Novel, NovelChapter, Project } from './types';
import { INITIAL_NOVELS } from './data/novelData';
import { LUA_NHAU_NOVEL } from './data/luaNhauData';
import { safeStorage } from './utils/safeStorage';
import { isExtraChapter } from './utils/themeStyles';
import {
  auth,
  isUserAdmin,
  fetchTruyenList,
  subscribeTruyenList,
  getCachedTruyenList,
  createTruyen,
  updateTruyenStatus,
  updateTruyen,
  saveNovelSynopsisToFirebase,
  saveNovelTagsToFirebase,
  deleteTruyen,
  FirestoreTruyen,
  AdminUserLike,
  getStoredAdminSession,
  clearAdminSession,
  isBotComment,
  recordPageView,
} from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  getOriginalCoverByNovel,
  getCustomCoverFromStorage,
  saveCustomCoverToAllStores,
  getDirectImageUrl,
} from './utils/imageUtils';
import { incrementGlobalView, fetchNovelCoversFromD1, saveNovelCoverToD1, getDeletedCommentIds } from './services/d1Service';

interface SavedViewState {
  viewMode: 'portfolio' | 'novel-home' | 'novel-detail' | 'about-light';
  selectedNovel: Novel | null;
  readingChapterNumber: number | null;
  targetNovelId?: string | null;
}

export function normalizeNovelTitle(title?: string | null): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function findNovelByIdOrAlias(novels: Novel[], queryIdOrSlug?: string | null): Novel | undefined {
  if (!queryIdOrSlug) return undefined;
  const q = queryIdOrSlug.trim();
  const qLower = q.toLowerCase();

  // 1. Direct ID match
  const direct = novels.find((n) => n.id === q);
  if (direct) return direct;

  // 2. Known aliases (e.g. Mẹ Kế Vừa Mềm Vừa Ngọt Firestore ID <-> slug)
  if (qLower === 'me-ke-vua-mem-vua-ngot' || qLower === 'e5h5ozgg1sgnfyhjdm5z') {
    const found = novels.find((n) => n.id === 'e5H5oZGg1sGnFyHjdM5Z' || n.id === 'me-ke-vua-mem-vua-ngot');
    if (found) return found;
  }
  if (qLower === 'lua-nhau') {
    const found = novels.find((n) => n.id === 'lua-nhau');
    if (found) return found;
  }
  if (qLower === 'ke-nha-giau-ngu-xuan' || qLower === '2liaf62usgccmvld5xta') {
    const found = novels.find((n) => n.id === '2liAf62uSgCcMvld5xtA' || normalizeNovelTitle(n.title).includes('kenhagiaunguxuan'));
    if (found) return found;
  }
  if (qLower === 'truc-ma-alpha' || qLower === 's1zjuvan4umw3h7nxo9m' || qLower === 'wt9smt1plovfgoqzmrh6') {
    const found = novels.find((n) => n.id === 'truc-ma-alpha' || n.id === 's1zJUVAn4uMW3h7NXO9M' || n.id === 'Wt9SMT1pLOVFGoQZMrH6');
    if (found) return found;
  }

  // 3. Normalized title match
  const normQ = normalizeNovelTitle(q);
  const byTitle = novels.find((n) => normalizeNovelTitle(n.title) === normQ || normalizeNovelTitle(n.id) === normQ);
  if (byTitle) return byTitle;

  return undefined;
}

const LUA_NHAU_EXACT_COVER = '/covers/lua_nhau.jpg';

function convertFirestoreTruyenToNovel(ft: FirestoreTruyen): Novel {
  const genres = ft.theLoai
    ? ft.theLoai.split(',').map((g) => g.trim()).filter(Boolean)
    : ['Tiểu Thuyết'];
  const originalCover = getOriginalCoverByNovel(ft.id, ft.tenTruyen);

  // Check if a custom cover was set by user in memory/safeStorage/IndexedDB
  const customCover = getCustomCoverFromStorage(ft.id) || getCustomCoverFromStorage(ft.tenTruyen);

  // Ưu tiên cao nhất: Ảnh bìa người dùng tùy chỉnh hoặc ảnh bìa lưu trên Firestore/Cloudflare D1
  let finalCover: string;
  if (customCover && customCover.trim()) {
    finalCover = customCover.trim();
  } else if (ft.anhBia && ft.anhBia.trim() && !ft.anhBia.includes('images.unsplash.com')) {
    finalCover = getDirectImageUrl(ft.anhBia.trim(), ft.id || ft.tenTruyen);
  } else {
    finalCover = originalCover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop';
  }

  const normT = normalizeNovelTitle(ft.tenTruyen);
  const isLuaNhau = ft.id === 'lua-nhau' || normT.includes('luanhau');

  return {
    id: ft.id,
    title: ft.tenTruyen,
    coverImage: finalCover,
    coverImageUrl: finalCover,
    author: {
      id: 'admin',
      name: isLuaNhau ? LUA_NHAU_NOVEL.author.name : (ft.tacGia || 'Tác giả'),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
      title: 'Tác Giả',
      totalNovels: 1,
      followers: 120,
    },
    translator: ft.translator || 'Jouriee65',
    synopsis: isLuaNhau ? LUA_NHAU_NOVEL.synopsis : (ft.moTa || ''),
    genres: isLuaNhau ? LUA_NHAU_NOVEL.genres : genres,
    status: 'completed',
    rating: 5.0,
    ratingCount: 1,
    views: (ft as any).views ?? (ft as any).luotDoc ?? 0,
    bookmarks: 10,
    monthlyVotes: 10,
    totalWords: 0,
    totalChaptersCount: ft.soChuong || 0,
    chapters: [],
    comments: (() => {
      try {
        const saved = safeStorage.getItem(`cosmo_novel_comments_${ft.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const deletedSet = getDeletedCommentIds();
            return parsed.filter((c: any) => c && !deletedSet.has(String(c.id).trim()));
          }
        }
      } catch {}
      return [];
    })(),
    latestChapter: {
      number: ft.soChuong || 1,
      title: ft.soChuong > 0 ? `Chương ${ft.soChuong}` : 'Chưa có chương',
      updatedAt: ft.ngayCapNhat ? new Date(ft.ngayCapNhat).toLocaleDateString('vi-VN') : 'Mới cập nhật',
    },
    trangThai: ft.trangThai === 'nhap' ? 'nhap' : 'daDang',
    isFirestore: true,
    tags: (isLuaNhau ? LUA_NHAU_NOVEL.genres : genres).map((g) => (g.startsWith('#') ? g : `#${g}`)),
    adminUid: ft.adminUid,
    uploaderNote: isLuaNhau ? LUA_NHAU_NOVEL.uploaderNote : (ft.uploaderNote || 'Đọc kỹ tất cả các tags và giới thiệu truyện, chúc mọi người có khoảng thời gian đọc truyện vui vẻ.'),
    worldLore: isLuaNhau ? LUA_NHAU_NOVEL.worldLore : (ft.worldLore || undefined),
  };
}

function cleanNovelChapters(novel: Novel): Novel {
  if (!novel.chapters || novel.chapters.length === 0) return novel;

  const cleaned: NovelChapter[] = [];
  let hadModifications = false;

  for (const chap of novel.chapters) {
    const isExtra =
      chap.isExtra === true ||
      /^[\[(【]?\s*(?:Ngoại\s*truyện|Phiên\s*ngoại|Ngoại\s*văn|PN)/i.test(chap.title.trim()) ||
      isExtraChapter(chap);

    if (isExtra) {
      cleaned.push({ ...chap, isExtra: true });
      continue;
    }

    const trimmedTitle = chap.title.trim();
    const isValidChapterTitle =
      /^[\[(【]?\s*(?:(?:Q|Quyển|Tập)\s*\d+[\s:.-]+)?(?:Chương|Chapter|Hồi)\s*\d+/i.test(trimmedTitle) ||
      /^\d+[\s:.-]/.test(trimmedTitle);
    const isLongTextTitle = trimmedTitle.length > 55 && !isValidChapterTitle;

    if (!isValidChapterTitle || isLongTextTitle) {
      hadModifications = true;
      if (cleaned.length > 0) {
        const prev = cleaned[cleaned.length - 1];
        const mergedText =
          (prev.content ? prev.content.trim() : '') +
          '\n\n' +
          trimmedTitle +
          '\n\n' +
          (chap.content ? chap.content.trim() : '');
        cleaned[cleaned.length - 1] = {
          ...prev,
          content: mergedText,
          wordCount: mergedText.split(/\s+/).filter(Boolean).length,
        };
      }
      continue;
    }

    cleaned.push(chap);
  }

  if (!hadModifications) return novel;

  let nextMain = 1;
  const renumbered = cleaned.map((chap) => {
    const isExtra =
      chap.isExtra === true ||
      /^[\[(【]?\s*(?:Ngoại\s*truyện|Phiên\s*ngoại|Ngoại\s*văn|PN)/i.test(chap.title.trim()) ||
      isExtraChapter(chap);
    if (isExtra) return { ...chap, isExtra: true };
    return {
      ...chap,
      chapterNumber: nextMain++,
    };
  });

  return {
    ...novel,
    chapters: renumbered,
    totalChaptersCount: renumbered.length,
  };
}

export const BANNED_DUMMY_NOVEL_IDS = new Set([
  'anh-trang-khong-ngu',
  'co-giap-chi-vuong',
  'doan-van-ha-chi-hoa',
  'doan-van-ngot-ngao',
  'h-van-ngan-duoi-mua',
  'hoang-de-cung-nhiep-chinh-vuong',
  'ma-than-tinh-hai',
  'ma-ton-su-ton-song-tu',
  'sinh-ton-tinh-cau-hoang',
  'tinh-mon-chu-te',
  'truong-cong-chua-hac-hoa',
  'tuyet-dinh-dan-dao',
  'van-nguoi-me-tu-la-trang',
  'vong-du-tinh-cau-online',
  'xuyen-thanh-phao-hoi-h-van',
  'gio-thoi-mua-ha',
  'tinh-khong-tien-ton',
  'song-huong-cam-do',
  'my-nhan-van-nguoi-me',
  'doan-van-mua-ha',
  'ma-ton-song-tu',
  'anh-trang-dem-he',
  'nhiep-chinh-vuong-ghen',
  'xuyen-thanh-phao-hoi',
  'doan-van-dem-muon',
  'vuong-gia-co-giap',
  'toan-dan-sinh-ton',
  'than-ma-tinh-hai',
  'thien-the-truc-tuyen',
  'mua-roi-tren-khe-tay',
  '6thmisto9XhVCDATFAcS',
]);

export function isBannedOrDraftNovel(novel: { id: string; title?: string; tenTruyen?: string; trangThai?: string; status?: string }): boolean {
  if (!novel) return true;
  if (BANNED_DUMMY_NOVEL_IDS.has(novel.id)) return true;
  if ((novel.status as string) === 'nhap' || (novel as any).trangThai === 'nhap') return true;

  const rawTitle = (novel.title || (novel as any).tenTruyen || '').toLowerCase().trim();
  if (!rawTitle) return false;

  const bannedKeywords = [
    'dạ lan',
    'vương giả cơ giáp',
    'ánh trăng không ngủ',
    'ánh trăng đêm hè',
    'nhiếp chính vương hôm nay',
    'thần ma tinh hải',
    'ma tôn luôn muốn',
    'ma tôn song tu',
    'toàn dân sinh tồn',
    'tinh môn chúa tể',
    'trưởng công chúa hắc hóa',
    'tuyệt đỉnh đan đạo',
    'tu la tràng',
    'thiên thể trực tuyến',
    'pháo hôi tuyệt sắc',
    'mưa rơi trên khẽ tay',
    'gió thổi mùa hạ',
    'song hướng cám dỗ',
    'tinh không tiên tôn',
  ];

  return bannedKeywords.some((kw) => rawTitle.includes(kw));
}

function getInitialNovels(): Novel[] {
  try {
    const saved = safeStorage.getItem('cosmo_novels');
    if (saved) {
      const parsed: Novel[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out dummy/template novels and draft novels
        const filtered = parsed.filter((n) => !isBannedOrDraftNovel(n));
        const processed = filtered.map((n) => {
          const withCleanChapters = cleanNovelChapters(n);
          const withDefaults: Novel = {
            ...withCleanChapters,
            status: 'completed',
            translator: withCleanChapters.translator || 'Jouriee65',
            comments: (withCleanChapters.comments || []).filter((c) => !isBotComment(c)),
          };
          const customCover = getCustomCoverFromStorage(withDefaults.id) || getCustomCoverFromStorage(withDefaults.title);
          if (customCover) {
            withDefaults.coverImage = customCover;
            withDefaults.coverImageUrl = customCover;
          }

          if (withDefaults.id === 'lua-nhau' || normalizeNovelTitle(withDefaults.title).includes('luanhau')) {
            const preservedChapters =
              withDefaults.chapters && withDefaults.chapters.length > 0
                ? withDefaults.chapters
                : (LUA_NHAU_NOVEL.chapters || []);
            const res: Novel = {
              ...withDefaults,
              id: 'lua-nhau',
              title: 'Lừa Nhau',
              chapters: preservedChapters,
              totalChaptersCount: preservedChapters.length,
              comments: (withDefaults.comments || []).filter((c) => !isBotComment(c)),
              synopsis: LUA_NHAU_NOVEL.synopsis,
              worldLore: LUA_NHAU_NOVEL.worldLore,
              uploaderNote: LUA_NHAU_NOVEL.uploaderNote,
              genres: LUA_NHAU_NOVEL.genres,
              tags: LUA_NHAU_NOVEL.tags,
              author: LUA_NHAU_NOVEL.author,
              coverImage: customCover || withDefaults.coverImage || LUA_NHAU_EXACT_COVER,
              coverImageUrl: customCover || withDefaults.coverImageUrl || LUA_NHAU_EXACT_COVER,
              status: 'completed',
              translator: 'Jouriee65',
            };
            return res;
          }
          if (
            withDefaults.id === 's1zJUVAn4uMW3h7NXO9M' ||
            withDefaults.id === 'Wt9SMT1pLOVFGoQZMrH6' ||
            withDefaults.id === 'truc-ma-alpha' ||
            normalizeNovelTitle(withDefaults.title).includes('trucmaalpha')
          ) {
            const trucMaRes: Novel = {
              ...withDefaults,
              id: 's1zJUVAn4uMW3h7NXO9M',
              title: 'Trúc Mã Alpha Của Tôi Có Độc',
              coverImage: customCover || withDefaults.coverImage || '/covers/truc_ma_alpha.jpg',
              coverImageUrl: customCover || withDefaults.coverImageUrl || '/covers/truc_ma_alpha.jpg',
              bannerImage: customCover || withDefaults.bannerImage || '/covers/truc_ma_alpha.jpg',
              status: 'completed',
              translator: 'Jouriee65',
            };
            return trucMaRes;
          }
          return withDefaults;
        });

        // Khử trùng lặp triệt để tránh trường hợp bộ truyện bị nhân đôi
        const seen = new Set<string>();
        const deduplicated: Novel[] = [];
        for (const n of processed) {
          const normTitle = normalizeNovelTitle(n.title);
          const isMeKe = normTitle.includes('mekevuamemvuangot') || n.id === 'me-ke-vua-mem-vua-ngot' || n.id === 'e5H5oZGg1sGnFyHjdM5Z' || n.id === 'yme8xnS09QjO5nYF8Jsz';
          const isTrucMa = normTitle.includes('trucmaalpha') || n.id === 'truc-ma-alpha' || n.id === 's1zJUVAn4uMW3h7NXO9M' || n.id === 'Wt9SMT1pLOVFGoQZMrH6';
          const isLuaNhau = normTitle.includes('luanhau') || n.id === 'lua-nhau';
          const key = isMeKe ? 'me-ke-vua-mem-vua-ngot' : (isTrucMa ? 'truc-ma-alpha' : (isLuaNhau ? 'lua-nhau' : normTitle));

          if (seen.has(key)) {
            const idx = deduplicated.findIndex((d) => {
              const dNorm = normalizeNovelTitle(d.title);
              const dKey = (dNorm.includes('mekevuamemvuangot') || d.id === 'me-ke-vua-mem-vua-ngot' || d.id === 'e5H5oZGg1sGnFyHjdM5Z')
                ? 'me-ke-vua-mem-vua-ngot'
                : (dNorm.includes('trucmaalpha') || d.id === 'truc-ma-alpha' || d.id === 's1zJUVAn4uMW3h7NXO9M'
                  ? 'truc-ma-alpha'
                  : (dNorm.includes('luanhau') || d.id === 'lua-nhau' ? 'lua-nhau' : dNorm));
              return dKey === key;
            });
            if (idx !== -1 && (!deduplicated[idx].chapters || deduplicated[idx].chapters.length === 0) && n.chapters && n.chapters.length > 0) {
              deduplicated[idx] = {
                ...deduplicated[idx],
                chapters: n.chapters,
                totalChaptersCount: Math.max(deduplicated[idx].totalChaptersCount || 0, n.chapters.length),
              };
            }
            continue;
          }
          seen.add(key);
          deduplicated.push(n);
        }

        try {
          safeStorage.setItem('cosmo_novels', JSON.stringify(deduplicated));
        } catch {}
        return deduplicated;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved novels', e);
  }
  return INITIAL_NOVELS;
}

export function parseRouteFromLocation(): {
  viewMode?: 'portfolio' | 'novel-home' | 'novel-detail' | 'about-light';
  novelId?: string;
  chapterNumber?: number;
} {
  if (typeof window === 'undefined') return {};

  let raw = '';
  // Kiểm tra hash trước (nếu người dùng truy cập link cũ có dấu #)
  if (window.location.hash) {
    raw = window.location.hash.replace(/^#\/?/, '').trim();
  }
  // Sau đó kiểm tra pathname tiêu chuẩn (không có dấu #)
  if (!raw && window.location.pathname && window.location.pathname !== '/') {
    raw = window.location.pathname.replace(/^\/+|\/+$/g, '').trim();
  }

  if (!raw) return {};

  // Khớp định dạng: read/:novelId/:chapterNumber hoặc novel/:novelId/chapter/:chapterNumber
  const readMatch = raw.match(/^(?:read|novel)\/([^/]+)\/(?:chapter\/|ch\/)?(\d+)$/i);
  if (readMatch) {
    const chapterNum = parseInt(readMatch[2], 10);
    return {
      viewMode: 'novel-detail',
      novelId: readMatch[1],
      chapterNumber: isNaN(chapterNum) ? 1 : chapterNum,
    };
  }

  // Khớp định dạng: read/:novelId (mặc định mở chương 1)
  const readNoChap = raw.match(/^read\/([^/]+)$/i);
  if (readNoChap) {
    return {
      viewMode: 'novel-detail',
      novelId: readNoChap[1],
      chapterNumber: 1,
    };
  }

  // Khớp định dạng: novel/:novelId (trang thông tin truyện)
  const novelMatch = raw.match(/^novel\/([^/]+)$/i);
  if (novelMatch) {
    return {
      viewMode: 'novel-detail',
      novelId: novelMatch[1],
      chapterNumber: undefined,
    };
  }

  // Giới thiệu
  if (
    raw === 'about' ||
    raw === 'about-light' ||
    raw === 'gioi-thieu' ||
    raw === 'intro-light' ||
    raw === 'intro'
  ) {
    return { viewMode: 'about-light' };
  }

  if (raw === 'portfolio' || raw === 'skills' || raw === 'experience' || raw === 'projects' || raw === 'contact') {
    return { viewMode: 'portfolio' };
  }

  if (raw === 'novels' || raw === 'novel-home' || raw === 'truyen') {
    return { viewMode: 'novel-home' };
  }

  return {};
}

function parseSavedViewState(availableNovels: Novel[]): SavedViewState {
  // 1. Ưu tiên số 1: Phân tích đường dẫn URL thực tế (hỗ trợ cả link sạch không có # và link hash)
  const route = parseRouteFromLocation();
  if (route.viewMode) {
    if (route.viewMode === 'novel-detail' && route.novelId) {
      const found = findNovelByIdOrAlias(availableNovels, route.novelId);
      if (found) {
        return {
          viewMode: 'novel-detail',
          selectedNovel: found,
          readingChapterNumber: route.chapterNumber ?? null,
          targetNovelId: null,
        };
      }
      // Nếu danh mục Firestore đang tải bất đồng bộ khi vừa F5, không bị văng về trang chủ!
      return {
        viewMode: 'novel-detail',
        selectedNovel: null,
        readingChapterNumber: route.chapterNumber ?? 1,
        targetNovelId: route.novelId,
      };
    }

    if (route.viewMode === 'about-light') {
      return {
        viewMode: 'about-light',
        selectedNovel: null,
        readingChapterNumber: null,
      };
    }

    if (route.viewMode === 'portfolio') {
      return {
        viewMode: 'portfolio',
        selectedNovel: null,
        readingChapterNumber: null,
      };
    }

    if (route.viewMode === 'novel-home') {
      return {
        viewMode: 'novel-home',
        selectedNovel: null,
        readingChapterNumber: null,
      };
    }
  }

  // 2. Ưu tiên số 2: safeStorage 'cosmo_active_view'
  try {
    const saved = safeStorage.getItem('cosmo_active_view');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.viewMode === 'about-light') {
        return {
          viewMode: 'about-light',
          selectedNovel: null,
          readingChapterNumber: null,
        };
      }
      if (parsed.viewMode === 'novel-detail' && parsed.novelId) {
        const novel = findNovelByIdOrAlias(availableNovels, parsed.novelId);
        if (novel) {
          const chapNum = typeof parsed.readingChapterNumber === 'number' ? parsed.readingChapterNumber : null;
          return {
            viewMode: 'novel-detail',
            selectedNovel: novel,
            readingChapterNumber: chapNum,
          };
        }
        return {
          viewMode: 'novel-detail',
          selectedNovel: null,
          readingChapterNumber: typeof parsed.readingChapterNumber === 'number' ? parsed.readingChapterNumber : null,
          targetNovelId: parsed.novelId,
        };
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved active view', e);
  }

  // DEFAULT VIEW: Novel Platform Homepage (Trang chủ tiểu thuyết làm mặc định)
  return {
    viewMode: 'novel-home',
    selectedNovel: null,
    readingChapterNumber: null,
  };
}

export default function App() {
  const initialNovels = useMemo(() => getInitialNovels(), []);
  const initialView = useMemo(() => parseSavedViewState(initialNovels), [initialNovels]);

  // Navigation & View Mode: 'portfolio' (Landing) | 'novel-home' (Trang chủ tiểu thuyết) | 'novel-detail' (Chi tiết bộ truyện) | 'about-light' (Giới thiệu chế độ sáng)
  const [viewMode, setViewMode] = useState<'portfolio' | 'novel-home' | 'novel-detail' | 'about-light'>(initialView.viewMode);

  // Light Mode Intro Option: 'style1' (Sổ Kế Hoạch 2 Mặt) | 'style2' (Máy Trứng Tamagotchi)
  // Mặc định luôn là Style 1 khi mở trang giới thiệu theo yêu cầu
  const [lightIntroOption, setLightIntroOption] = useState<'style1' | 'style2'>('style1');

  // Novel Platform States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [novels, setNovels] = useState<Novel[]>(initialNovels);
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(initialView.selectedNovel);
  const [readingChapterNumber, setReadingChapterNumber] = useState<number | null>(initialView.readingChapterNumber);
  const [pendingNovelId, setPendingNovelId] = useState<string | null>(initialView.targetNovelId || null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Trạng thái màn hình tải trang hiện đại (ModernLoadingScreen)
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Fallback an toàn nếu màn hình loading chưa đóng sau 3.2s
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  // Admin & Firestore States
  const [currentUser, setCurrentUser] = useState<AdminUserLike | null>(() => getStoredAdminSession());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isUserAdmin(getStoredAdminSession()));
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isCreateFirestoreModalOpen, setIsCreateFirestoreModalOpen] = useState(false);
  const [firestoreTruyens, setFirestoreTruyens] = useState<FirestoreTruyen[]>(() => getCachedTruyenList());

  // Quản lý chế độ tối Dark Mode đồng bộ toàn trang (mặc định chế độ sáng: false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      if (safeStorage.getItem('cosmo_home_light_default_v1') !== 'true') {
        safeStorage.setItem('cosmo_home_light_default_v1', 'true');
        safeStorage.setItem('cosmo_darkmode', 'false');
        if (safeStorage.getItem('cosmo_novel_theme') === 'cosmic') {
          safeStorage.setItem('cosmo_novel_theme', 'amethyst-haze');
        }
        return false;
      }
      const savedTheme = safeStorage.getItem('cosmo_novel_theme');
      if (savedTheme === 'cosmic') return false;
      const saved = safeStorage.getItem('cosmo_darkmode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      safeStorage.setItem('cosmo_darkmode', JSON.stringify(next));
      return next;
    });
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAdmin(isUserAdmin(user));
      } else {
        const stored = getStoredAdminSession();
        if (stored) {
          setCurrentUser(stored);
          setIsAdmin(isUserAdmin(stored));
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      }
    });
    return () => unsub();
  }, []);

  // ĐÃ NGẮT KẾT NỐI HOÀN TOÀN KHỎI FIREBASE:
  // Dữ liệu truyện và chương được lưu và nạp 100% từ mã nguồn web (INITIAL_NOVELS).
  const loadFirestoreTruyens = useCallback(async (_force = false) => {}, []);

  // Tự động tải và đồng bộ ảnh bìa lưu trên Cloudflare D1 khi vào trang
  useEffect(() => {
    fetchNovelCoversFromD1().then((covers) => {
      if (covers && Object.keys(covers).length > 0) {
        setNovels((prev) =>
          prev.map((n) => {
            const d1Cover = covers[n.id] || covers[n.title] || covers[normalizeNovelTitle(n.title)];
            if (d1Cover && d1Cover.trim() && d1Cover.trim() !== n.coverImage) {
              return {
                ...n,
                coverImage: d1Cover.trim(),
                coverImageUrl: d1Cover.trim(),
              };
            }
            return n;
          })
        );
        setFirestoreTruyens((prev) =>
          prev.map((ft) => {
            const d1Cover = covers[ft.id] || covers[ft.tenTruyen] || covers[normalizeNovelTitle(ft.tenTruyen)];
            if (d1Cover && d1Cover.trim() && d1Cover.trim() !== ft.anhBia) {
              return {
                ...ft,
                anhBia: d1Cover.trim(),
              };
            }
            return ft;
          })
        );
      }
    }).catch(() => {});
  }, []);

  // Combined novels: firestore novels + local novels
  const allMergedNovels = useMemo(() => {
    const mapped = firestoreTruyens.map((ft) => {
      const converted = convertFirestoreTruyenToNovel(ft);
      const existingLocal =
        findNovelByIdOrAlias(novels, ft.id) ||
        novels.find((n) => normalizeNovelTitle(n.title) === normalizeNovelTitle(ft.tenTruyen));

      const customCover = getCustomCoverFromStorage(ft.id) || getCustomCoverFromStorage(ft.tenTruyen);

      if (existingLocal) {
        return {
          ...converted,
          ...existingLocal,
          id: ft.id,
          comments:
            existingLocal.comments && existingLocal.comments.length > 0
              ? existingLocal.comments
              : converted.comments,
          chapters:
            existingLocal.chapters && existingLocal.chapters.length > 0
              ? existingLocal.chapters
              : converted.chapters,
          totalChaptersCount: Math.max(ft.soChuong || 0, existingLocal.chapters?.length || 0),
          coverImage:
            customCover ||
            (ft.anhBia && !ft.anhBia.includes('images.unsplash.com') ? ft.anhBia : null) ||
            existingLocal.coverImage ||
            getOriginalCoverByNovel(ft.id, ft.tenTruyen) ||
            converted.coverImage,
          coverImageUrl:
            customCover ||
            (ft.anhBia && !ft.anhBia.includes('images.unsplash.com') ? ft.anhBia : null) ||
            existingLocal.coverImageUrl ||
            getOriginalCoverByNovel(ft.id, ft.tenTruyen) ||
            converted.coverImageUrl,
          synopsis: ft.moTa || existingLocal.synopsis || converted.synopsis,
          genres: ft.theLoai
            ? ft.theLoai.split(',').map((g) => g.trim()).filter(Boolean)
            : existingLocal.genres || converted.genres,
          tags: (ft.theLoai
            ? ft.theLoai.split(',').map((g) => g.trim()).filter(Boolean)
            : existingLocal.genres || converted.genres
          ).map((t) => (t.startsWith('#') ? t : `#${t}`)),
          worldLore: ft.worldLore || existingLocal.worldLore,
          uploaderNote: ft.uploaderNote || existingLocal.uploaderNote,
        };
      }
      return converted;
    });

    const fsIdSet = new Set(mapped.map((m) => m.id));
    const fsTitleSet = new Set(mapped.map((m) => normalizeNovelTitle(m.title)));

    const nonConflictingLocal = novels.filter((n) => {
      if (fsIdSet.has(n.id)) return false;
      if (fsTitleSet.has(normalizeNovelTitle(n.title))) return false;
      if (
        (n.id === 'me-ke-vua-mem-vua-ngot' || n.id === 'e5H5oZGg1sGnFyHjdM5Z') &&
        (fsIdSet.has('me-ke-vua-mem-vua-ngot') || fsIdSet.has('e5H5oZGg1sGnFyHjdM5Z'))
      ) {
        return false;
      }
      return true;
    });

    const combined = [...mapped, ...nonConflictingLocal].filter((n) => !isBannedOrDraftNovel(n));

    // Khử trùng lặp triệt để: Đảm bảo không bao giờ có 2 bộ truyện cùng tên (như "Mẹ Kế Vừa Mềm Vừa Ngọt")
    const seenTitles = new Set<string>();
    const seenIds = new Set<string>();
    const deduplicated: Novel[] = [];

    for (const novel of combined) {
      const normTitle = normalizeNovelTitle(novel.title);
      const isMeKe =
        normTitle.includes('mekevuamemvuangot') ||
        novel.id === 'me-ke-vua-mem-vua-ngot' ||
        novel.id === 'e5H5oZGg1sGnFyHjdM5Z';
      const dedupeKey = isMeKe ? 'me-ke-vua-mem-vua-ngot' : normTitle;

      if (seenTitles.has(dedupeKey) || seenIds.has(novel.id)) {
        const existingIdx = deduplicated.findIndex((d) => {
          const dKey =
            normalizeNovelTitle(d.title).includes('mekevuamemvuangot') ||
            d.id === 'me-ke-vua-mem-vua-ngot' ||
            d.id === 'e5H5oZGg1sGnFyHjdM5Z'
              ? 'me-ke-vua-mem-vua-ngot'
              : normalizeNovelTitle(d.title);
          return dKey === dedupeKey || d.id === novel.id;
        });
        if (existingIdx !== -1) {
          const existing = deduplicated[existingIdx];
          const customCover =
            getCustomCoverFromStorage(novel.id) ||
            getCustomCoverFromStorage(novel.title) ||
            getCustomCoverFromStorage(existing.id) ||
            getCustomCoverFromStorage(existing.title);
          const nextCover =
            customCover ||
            (novel.coverImage && !novel.coverImage.includes('unsplash') ? novel.coverImage : existing.coverImage);
          deduplicated[existingIdx] = {
            ...existing,
            coverImage: nextCover,
            coverImageUrl: nextCover,
            chapters: (existing.chapters && existing.chapters.length > 0) ? existing.chapters : (novel.chapters || []),
            totalChaptersCount: Math.max(existing.totalChaptersCount || 0, novel.chapters?.length || 0),
          };
        }
        continue;
      }

      seenTitles.add(dedupeKey);
      seenIds.add(novel.id);
      const customCover = getCustomCoverFromStorage(novel.id) || getCustomCoverFromStorage(novel.title);
      deduplicated.push({
        ...novel,
        coverImage: customCover || novel.coverImage,
        coverImageUrl: customCover || novel.coverImageUrl || novel.coverImage,
        status: 'completed' as const,
        translator: novel.translator || 'Jouriee65',
      });
    }

    return deduplicated;
  }, [firestoreTruyens, novels]);

  // Tự động phân giải pendingNovelId ngay khi danh mục truyện allMergedNovels được tải
  useEffect(() => {
    if (pendingNovelId) {
      const found = findNovelByIdOrAlias(allMergedNovels, pendingNovelId);
      if (found) {
        setSelectedNovel(found);
        setPendingNovelId(null);
      }
    }
  }, [allMergedNovels, pendingNovelId]);

  // Save novels to safeStorage whenever state updates
  useEffect(() => {
    try {
      safeStorage.setItem('cosmo_novels', JSON.stringify(novels));
    } catch (e) {
      console.warn('Could not save novels to storage', e);
    }
  }, [novels]);

  // ĐÃ NGẮT KẾT NỐI ĐỒNG BỘ FIRESTORE (Dữ liệu cố định trong mã nguồn)

  // Keep selectedNovel synchronized with latest novel data in allMergedNovels array
  useEffect(() => {
    if (selectedNovel) {
      const refreshed = findNovelByIdOrAlias(allMergedNovels, selectedNovel.id);
      if (refreshed) {
        if (refreshed !== selectedNovel || refreshed.totalChaptersCount !== selectedNovel.totalChaptersCount || refreshed.trangThai !== selectedNovel.trangThai) {
          setSelectedNovel(refreshed);
        }
      } else {
        if (novels.length > 0) {
          setSelectedNovel(null);
          setViewMode('novel-home');
        }
      }
    }
  }, [allMergedNovels, selectedNovel?.id]);

  // Persist active view state and synchronize clean URL without '#'
  useEffect(() => {
    try {
      safeStorage.setItem(
        'cosmo_active_view',
        JSON.stringify({
          viewMode,
          novelId: selectedNovel?.id ?? pendingNovelId ?? null,
          readingChapterNumber,
        })
      );
    } catch (e) {
      console.warn('Could not save active view state', e);
    }

    // Synchronize clean URL (Không dùng dấu # trên tên miền)
    if (typeof window !== 'undefined') {
      // Đang chờ nạp truyện từ Firestore, không ghi đè làm mất URL của người dùng
      if (pendingNovelId && !selectedNovel) return;

      let desiredPath = '/';
      if (viewMode === 'novel-detail' && selectedNovel) {
        if (readingChapterNumber !== null) {
          desiredPath = `/read/${selectedNovel.id}/${readingChapterNumber}`;
        } else {
          desiredPath = `/novel/${selectedNovel.id}`;
        }
      } else if (viewMode === 'novel-home') {
        desiredPath = '/';
      } else if (viewMode === 'portfolio') {
        desiredPath = '/portfolio';
      } else if (viewMode === 'about-light') {
        desiredPath = '/about';
      }

      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;

      // Cập nhật đường dẫn sạch, xóa bỏ hash cũ nếu có
      if (currentPath !== desiredPath || currentHash) {
        try {
          window.history.replaceState(null, '', desiredPath);
        } catch {
          try {
            window.location.hash = desiredPath === '/' ? '' : desiredPath.replace(/^\//, '#');
          } catch {
            // Ignored in sandboxed iframes
          }
        }
      }
    }
  }, [viewMode, selectedNovel?.id, readingChapterNumber, pendingNovelId]);

  // Ghi nhận lượt đọc vào bộ đếm Footer:
  // 1. Khi bấm vào xem trang giới thiệu (about-light hoặc portfolio) -> tính +1 lượt đọc
  // 2. Khi bấm vào xem trang thông tin truyện (novel-detail) -> tính +1 lượt đọc cho truyện và +1 vào footer
  // 3. KHÔNG tính khi nạp danh sách truyện (novel-home), đúng theo chỉ thị người dùng.
  useEffect(() => {
    if (viewMode === 'about-light' || viewMode === 'portfolio') {
      incrementGlobalView(1).catch(() => {});
      recordPageView('about', 'Trang giới thiệu');
    } else if (viewMode === 'novel-detail' && readingChapterNumber === null && selectedNovel) {
      incrementGlobalView(1).catch(() => {});
      recordPageView('novel-info', selectedNovel.title, selectedNovel.id);
    }
  }, [viewMode, selectedNovel?.id, readingChapterNumber]);

  // Phản hồi nút Back/Forward của trình duyệt (hỗ trợ cả popstate và hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const parsed = parseSavedViewState(allMergedNovels);
      setViewMode(parsed.viewMode);
      setSelectedNovel(parsed.selectedNovel);
      setReadingChapterNumber(parsed.readingChapterNumber);
      if (parsed.targetNovelId) {
        setPendingNovelId(parsed.targetNovelId);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [allMergedNovels]);

  const handleOpenNovelPlatform = () => {
    setSelectedNovel(null);
    setReadingChapterNumber(null);
    setViewMode('novel-home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNovel = (novel: Novel) => {
    const custom = getCustomCoverFromStorage(novel.id) || getCustomCoverFromStorage(novel.title);
    const resolvedCover = custom || novel.coverImage;
    const freshNovel: Novel = {
      ...novel,
      coverImage: resolvedCover,
      coverImageUrl: resolvedCover,
    };
    setSelectedNovel(freshNovel);
    setReadingChapterNumber(null);
    setViewMode('novel-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNovelToReadingPosition = (novel: Novel, chapterNumber: number) => {
    const custom = getCustomCoverFromStorage(novel.id) || getCustomCoverFromStorage(novel.title);
    const resolvedCover = custom || novel.coverImage;
    const freshNovel: Novel = {
      ...novel,
      coverImage: resolvedCover,
      coverImageUrl: resolvedCover,
    };
    setSelectedNovel(freshNovel);
    setReadingChapterNumber(chapterNumber);
    setViewMode('novel-detail');
  };

  const handlePublishNovel = async (newNovel: Novel) => {
    const standardized: Novel = {
      ...newNovel,
      status: 'completed',
      translator: 'Jouriee65',
    };

    const localId = `novel_${Date.now()}`;
    standardized.id = localId;
    setNovels((prev) => [standardized, ...prev.filter((n) => n.id !== localId && n.id !== newNovel.id)]);
  };

  const handleAddChapter = (novelId: string, chapter: NovelChapter) => {
    setNovels((prev) =>
      prev.map((n) => {
        if (n.id !== novelId) return n;
        const exists = n.chapters.some((c) => c.chapterNumber === chapter.chapterNumber);
        const nextChapters = exists
          ? n.chapters.map((c) => (c.chapterNumber === chapter.chapterNumber ? chapter : c))
          : [...n.chapters, chapter].sort((a, b) => a.chapterNumber - b.chapterNumber);
        const updatedNovel = {
          ...n,
          chapters: nextChapters,
          totalChaptersCount: nextChapters.length,
          latestChapter: {
            number: chapter.chapterNumber,
            title: chapter.title,
            updatedAt: 'Vừa xong',
          },
          totalWords: n.totalWords + chapter.wordCount,
        };
        if (selectedNovel && selectedNovel.id === novelId) {
          setSelectedNovel(updatedNovel);
        }
        return updatedNovel;
      })
    );
  };

  const handleUpdateNovelChapters = (novelId: string, updatedChapters: NovelChapter[]) => {

    let updatedNovelForSelected: Novel | null = null;
    setNovels((prev) => {
      const next = prev.map((n) => {
        if (n.id === novelId) {
          const totalWords = updatedChapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
          const lastChap = updatedChapters[updatedChapters.length - 1];
          const updatedNovel = {
            ...n,
            chapters: updatedChapters,
            totalChaptersCount: updatedChapters.length,
            totalWords,
            latestChapter: lastChap
              ? {
                  number: lastChap.chapterNumber,
                  title: lastChap.title,
                  updatedAt: 'Vừa cập nhật',
                }
              : n.latestChapter,
          };
          updatedNovelForSelected = updatedNovel;
          return updatedNovel;
        }
        return n;
      });
      try {
        safeStorage.setItem('cosmo_novels', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save updated chapters', e);
      }
      return next;
    });

    if (updatedNovelForSelected) {
      setSelectedNovel((current) => {
        if (current && current.id === novelId) {
          return updatedNovelForSelected;
        }
        return current;
      });
    }
  };

  const handleUpdateNovelCover = (novelId: string, newCoverUrl: string) => {
    const trimmedCover = (newCoverUrl || '').trim();
    if (!trimmedCover) return;

    const matched =
      novels.find((n) => n.id === novelId) ||
      allMergedNovels.find((n) => n.id === novelId) ||
      firestoreTruyens.find((ft) => ft.id === novelId);

    const title = (matched && 'title' in matched ? matched.title : (matched as any)?.tenTruyen) || '';
    const normTitle = normalizeNovelTitle(title);

    // 1. Lưu ngay vào mọi tầng lưu trữ (Memory, safeStorage, IndexedDB)
    saveCustomCoverToAllStores(novelId, title, trimmedCover);

    // 2. Lưu trực tiếp vào Cloudflare D1 (100% độc lập, ngắt kết nối hoàn toàn khỏi Firebase)
    try {
      saveNovelCoverToD1(novelId, trimmedCover, title);
    } catch (e) {
      console.warn('Failed to update novel cover on Cloudflare D1', e);
    }

    // 3. Cập nhật state firestoreTruyens
    setFirestoreTruyens((prev) =>
      prev.map((ft) =>
        ft.id === novelId ||
        (normTitle && normalizeNovelTitle(ft.tenTruyen) === normTitle) ||
        (novelId === 'me-ke-vua-mem-vua-ngot' && ft.id === 'e5H5oZGg1sGnFyHjdM5Z') ||
        (novelId === 'e5H5oZGg1sGnFyHjdM5Z' && ft.id === 'me-ke-vua-mem-vua-ngot') ||
        (novelId === 'lua-nhau' && ft.id === 'lua-nhau')
          ? { ...ft, anhBia: trimmedCover }
          : ft
      )
    );

    // 5. Cập nhật state novels
    setNovels((prev) => {
      const next = prev.map((n) => {
        if (
          n.id === novelId ||
          (normTitle && normalizeNovelTitle(n.title) === normTitle) ||
          (novelId === 'e5H5oZGg1sGnFyHjdM5Z' && n.id === 'me-ke-vua-mem-vua-ngot') ||
          (novelId === 'me-ke-vua-mem-vua-ngot' && n.id === 'e5H5oZGg1sGnFyHjdM5Z')
        ) {
          return {
            ...n,
            coverImage: trimmedCover,
            coverImageUrl: trimmedCover,
          };
        }
        return n;
      });
      try {
        safeStorage.setItem('cosmo_novels', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // 6. Cập nhật selectedNovel nếu đang xem truyện đó
    setSelectedNovel((curr) => {
      if (!curr) return null;
      if (
        curr.id === novelId ||
        (normTitle && normalizeNovelTitle(curr.title) === normTitle)
      ) {
        return {
          ...curr,
          coverImage: trimmedCover,
          coverImageUrl: trimmedCover,
        };
      }
      return curr;
    });
  };

  const handleUpdateNovel = (updatedNovel: Novel) => {
    // Persist to Firestore directly
    try {
      if (updatedNovel.synopsis) {
        saveNovelSynopsisToFirebase(
          updatedNovel.id,
          {
            moTa: updatedNovel.synopsis,
            worldLore: updatedNovel.worldLore,
            uploaderNote: updatedNovel.uploaderNote,
          },
          updatedNovel.title
        );
      }
      if (updatedNovel.genres && updatedNovel.genres.length > 0) {
        saveNovelTagsToFirebase(updatedNovel.id, updatedNovel.genres, updatedNovel.title);
      }
    } catch (e) {
      console.warn('Failed to update novel on Firestore', e);
    }

    setFirestoreTruyens((prev) =>
      prev.map((ft) =>
        ft.id === updatedNovel.id || ft.tenTruyen === updatedNovel.title
          ? {
              ...ft,
              moTa: updatedNovel.synopsis,
              gioiThieu: updatedNovel.synopsis,
              theLoai: updatedNovel.genres ? updatedNovel.genres.join(', ') : ft.theLoai,
              worldLore: updatedNovel.worldLore,
              uploaderNote: updatedNovel.uploaderNote,
              anhBia: updatedNovel.coverImage || ft.anhBia,
              ngayCapNhat: new Date().toISOString(),
            }
          : ft
      )
    );

    setNovels((prev) => {
      const next = prev.map((n) => (n.id === updatedNovel.id ? updatedNovel : n));
      try {
        safeStorage.setItem('cosmo_novels', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save updated novel', e);
      }
      return next;
    });
    setSelectedNovel((prev) => (prev?.id === updatedNovel.id ? updatedNovel : prev));
  };

  // Admin Actions for Firestore
  const handleToggleNovelStatus = async (novelId: string, currentStatus: 'nhap' | 'daDang') => {
    const nextStatus: 'nhap' | 'daDang' = currentStatus === 'nhap' ? 'daDang' : 'nhap';
    try {
      await updateTruyenStatus(novelId, nextStatus);
      await loadFirestoreTruyens(true);
      setNovels((prev) =>
        prev.map((n) => (n.id === novelId ? { ...n, trangThai: nextStatus } : n))
      );
      if (selectedNovel && selectedNovel.id === novelId) {
        setSelectedNovel((prev) => (prev ? { ...prev, trangThai: nextStatus } : prev));
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteFirestoreNovel = async (novelId: string) => {
    try {
      await deleteTruyen(novelId);
      await loadFirestoreTruyens(true);
      setNovels((prev) => prev.filter((n) => n.id !== novelId));
      if (selectedNovel && selectedNovel.id === novelId) {
        setSelectedNovel(null);
        setReadingChapterNumber(null);
        setViewMode('novel-home');
      }
    } catch (err) {
      console.error('Failed to delete novel:', err);
    }
  };

  const handleCreateFirestoreSuccess = async (newTruyenId: string) => {
    await loadFirestoreTruyens(true);
    setIsCreateFirestoreModalOpen(false);
    try {
      const fresh = await fetchTruyenList(true, true);
      setFirestoreTruyens(fresh);
      const found = fresh.find((t) => t.id === newTruyenId);
      if (found) {
        const novelObj = convertFirestoreTruyenToNovel(found);
        setSelectedNovel(novelObj);
        setReadingChapterNumber(null);
        setViewMode('novel-detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      console.error('Error navigating to new novel:', e);
    }
  };

  // Bỏ chế độ khóa trang web khi lượt xem 1 ngày đạt mốc 50.000 theo yêu cầu người dùng
  const isSystemLocked = false;

  return (
    <div className="min-h-screen bg-[#060713] text-slate-200 relative selection:bg-purple-500/30 selection:text-white font-jakarta">
      {/* GIAO DIỆN LOADING TẢI TRANG HIỆN ĐẠI (ModernLoadingScreen) */}
      {isPageLoading && (
        <ModernLoadingScreen
          isFullScreen={true}
          onClosePreview={() => setIsPageLoading(false)}
          showCloseButton={false}
          simulateAutoProgress={true}
        />
      )}

      {/* VIEW 1: PORTFOLIO LANDING PAGE */}
      {viewMode === 'portfolio' && (
        <>
          {/* Cosmic Starfield Canvas, Atmospheric Nebulae, Spatial Grid & Interactive Luna Moon */}
          <CosmicBackground />

          {/* Main Landing Sections */}
          <main className="relative z-10">
            {/* HERO SECTION with prominent banner link to novel platform */}
            <HeroSection
              onExploreProjects={() => {
                const el = document.getElementById('projects');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleOpenNovelPlatform();
                }
              }}
              onNavigateToNovels={handleOpenNovelPlatform}
            />

            {/* WELCOME & ANNOUNCEMENT NOTICE (Sau nút scroll) */}
            <WelcomeNoticeSection
              onNavigateToNovels={handleOpenNovelPlatform}
              onSwitchToLightModeIntro={() => {
                setSelectedNovel(null);
                setReadingChapterNumber(null);
                setLightIntroOption('style1');
                setViewMode('about-light');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* CURATED ARTIFACTS & PROJECTS: Featured Digital Products & Systems */}
            <ProjectsSection
              onSelectProject={(project) => {
                if (project.id === 'cosmo-novels') {
                  handleOpenNovelPlatform();
                } else {
                  setSelectedProject(project);
                }
              }}
            />

            {/* ENCRYPTED CONTACT & MESSAGE DISPATCH: TRANSMISSION TERMINAL */}
            <ContactSection />
          </main>

          {/* Cosmic Footer */}
          <Footer />

          {/* Project Details Modal */}
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </>
      )}

      {/* VIEW 2: NOVEL PUBLISHING & READER PLATFORM HOMEPAGE */}
      {viewMode === 'novel-home' && readingChapterNumber === null && (
        <div className="relative z-10 min-h-screen flex flex-col">
          <NovelHomeView
            novels={allMergedNovels}
            onSelectNovel={handleSelectNovel}
            onOpenNovelToReadingPosition={handleOpenNovelToReadingPosition}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            onBackToPortfolio={() => {
              setSelectedNovel(null);
              setReadingChapterNumber(null);
              setLightIntroOption('style1');
              setViewMode('about-light');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLightIntro={() => {
              setSelectedNovel(null);
              setReadingChapterNumber(null);
              setLightIntroOption('style1');
              setViewMode('about-light');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isAdmin={isAdmin}
            currentUser={currentUser}
            onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
            onOpenCreateFirestoreTruyen={() => setIsCreateFirestoreModalOpen(true)}
            onToggleNovelStatus={handleToggleNovelStatus}
            onDeleteFirestoreNovel={handleDeleteFirestoreNovel}
          />
        </div>
      )}

      {/* VIEW 3: NOVEL DETAIL INTERFACE */}
      {viewMode === 'novel-detail' && selectedNovel && readingChapterNumber === null && (
        <div className="relative z-10 min-h-screen flex flex-col">
          <NovelDetailView
            novel={selectedNovel}
            allNovels={allMergedNovels}
            onBack={() => {
              setSelectedNovel(null);
              setReadingChapterNumber(null);
              setViewMode('novel-home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReadChapter={(chapterNum) => {
              setReadingChapterNumber(chapterNum);
            }}
            onAddChapter={handleAddChapter}
            onUpdateChapters={handleUpdateNovelChapters}
            onUpdateCover={handleUpdateNovelCover}
            onUpdateNovel={handleUpdateNovel}
            onSelectNovel={handleSelectNovel}
            isAdmin={isAdmin}
            currentUser={currentUser}
            onToggleStatus={handleToggleNovelStatus}
            onDeleteNovel={handleDeleteFirestoreNovel}
          />
        </div>
      )}

      {/* VIEW 4: GIỚI THIỆU TRANG WEB (Style 1: Sổ Kế Hoạch 2 Mặt Nền Trái Tim | Style 2: Máy Trứng Tamagotchi) */}
      {viewMode === 'about-light' && readingChapterNumber === null && (
        <div className="relative z-10 min-h-screen flex flex-col">
          {lightIntroOption === 'style1' ? (
            <TwoPagePlannerHeartView
              onBackToNovels={() => {
                setSelectedNovel(null);
                setReadingChapterNumber(null);
                setViewMode('novel-home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              currentOption={lightIntroOption}
              onChangeOption={(opt) => {
                setLightIntroOption(opt);
                safeStorage.setItem('light_intro_option', opt);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          ) : (
            <AboutLightTamagotchiView
              onBackToNovels={() => {
                setSelectedNovel(null);
                setReadingChapterNumber(null);
                setViewMode('novel-home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              currentOption={lightIntroOption}
              onChangeOption={(opt) => {
                setLightIntroOption(opt);
                safeStorage.setItem('light_intro_option', opt);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}
        </div>
      )}

      {/* NOVEL READER (Sử dụng thanh cuộn mặc định) */}
      {readingChapterNumber !== null && selectedNovel && (
        <div className="relative z-10 min-h-screen flex flex-col">
          <NovelReaderModal
            novel={selectedNovel}
            chapterNumber={readingChapterNumber}
            isAdmin={isAdmin}
            onClose={() => {
              setReadingChapterNumber(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectChapter={(num) => setReadingChapterNumber(num)}
            onUpdateChapters={handleUpdateNovelChapters}
            onUpdateNovel={handleUpdateNovel}
          />
        </div>
      )}

      {/* PUBLISH NOVEL MODAL (Sáng tác & Đăng truyện mới) */}
      <PublishNovelModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handlePublishNovel}
      />

      {/* ADMIN AUTHENTICATION MODAL */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthStateChange={(user) => {
          setCurrentUser(user);
          setIsAdmin(isUserAdmin(user));
        }}
      />

      {/* CREATE FIRESTORE TRUYEN MODAL */}
      <CreateFirestoreTruyenModal
        isOpen={isCreateFirestoreModalOpen}
        onClose={() => setIsCreateFirestoreModalOpen(false)}
        currentUser={currentUser}
        onSuccess={handleCreateFirestoreSuccess}
      />
    </div>
  );
}

