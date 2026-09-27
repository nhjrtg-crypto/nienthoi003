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
  saveChaptersToFirestore,
  updateTruyenStatus,
  updateTruyen,
  saveNovelCoverToFirebase,
  saveNovelSynopsisToFirebase,
  saveNovelTagsToFirebase,
  deleteTruyen,
  FirestoreTruyen,
  AdminUserLike,
  getStoredAdminSession,
  clearAdminSession,
  subscribeFirestoreReadStats,
  getFirestoreReadStats,
  FirestoreReadStats,
  isBotComment,
  recordPageView,
  recordWebsiteVisit,
} from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getOriginalCoverByNovel } from './utils/imageUtils';

interface SavedViewState {
  viewMode: 'portfolio' | 'novel-home' | 'novel-detail' | 'about-light';
  selectedNovel: Novel | null;
  readingChapterNumber: number | null;
}

const LUA_NHAU_EXACT_COVER =
  'https://drive.google.com/file/d/1oqpUECsYtkmUUAYkXlRbq1cTUhUHFHGm/view?usp=drivesdk';

function convertFirestoreTruyenToNovel(ft: FirestoreTruyen): Novel {
  const genres = ft.theLoai
    ? ft.theLoai.split(',').map((g) => g.trim()).filter(Boolean)
    : ['Tiểu Thuyết'];
  const originalCover = getOriginalCoverByNovel(ft.id, ft.tenTruyen);
  const resolvedCover = ft.anhBia || originalCover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop';
  return {
    id: ft.id,
    title: ft.tenTruyen,
    coverImage: resolvedCover,
    coverImageUrl: resolvedCover,
    author: {
      id: 'admin',
      name: ft.tacGia || 'Tác giả',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
      title: 'Tác Giả',
      totalNovels: 1,
      followers: 120,
    },
    translator: ft.translator || 'Jouriee65',
    synopsis: ft.moTa || '',
    genres,
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
        if (saved) return JSON.parse(saved);
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
    tags: genres.map((g) => (g.startsWith('#') ? g : `#${g}`)),
    adminUid: ft.adminUid,
    uploaderNote: ft.uploaderNote || 'Đọc kỹ tất cả các tags và giới thiệu truyện, chúc mọi người có khoảng thời gian đọc truyện vui vẻ.',
    worldLore: ft.worldLore || undefined,
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
          if (withDefaults.id === 'lua-nhau') {
            const preservedChapters =
              withDefaults.chapters && withDefaults.chapters.length > 0
                ? withDefaults.chapters
                : (LUA_NHAU_NOVEL.chapters || []);
            const res: Novel = {
              ...withDefaults,
              chapters: preservedChapters,
              totalChaptersCount: preservedChapters.length,
              comments: (withDefaults.comments || []).filter((c) => !isBotComment(c)),
              worldLore: LUA_NHAU_NOVEL.worldLore,
              uploaderNote: LUA_NHAU_NOVEL.uploaderNote,
              coverImage: LUA_NHAU_EXACT_COVER,
              coverImageUrl: LUA_NHAU_EXACT_COVER,
              status: 'completed',
              translator: 'Jouriee65',
            };
            return res;
          }
          return withDefaults;
        });
        try {
          safeStorage.setItem('cosmo_novels', JSON.stringify(processed));
        } catch {}
        return processed;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved novels', e);
  }
  return INITIAL_NOVELS;
}

function parseSavedViewState(availableNovels: Novel[]): SavedViewState {
  // 1. First priority: check URL hash if present
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash.replace(/^#\/?/, '');

    // Format: read/:novelId/:chapterNumber or novel/:novelId/chapter/:chapterNumber
    const readMatch = hash.match(/^(?:read|novel)\/([^/]+)\/(?:chapter\/|ch\/)?(\d+)$/i);
    if (readMatch) {
      const novelId = readMatch[1];
      const chapterNum = parseInt(readMatch[2], 10);
      const novel = availableNovels.find((n) => n.id === novelId);
      if (novel) {
        return {
          viewMode: 'novel-detail',
          selectedNovel: novel,
          readingChapterNumber: isNaN(chapterNum) ? 1 : chapterNum,
        };
      }
    }

    // Format: novel/:novelId
    const novelMatch = hash.match(/^novel\/([^/]+)$/i);
    if (novelMatch) {
      const novelId = novelMatch[1];
      const novel = availableNovels.find((n) => n.id === novelId);
      if (novel) {
        return {
          viewMode: 'novel-detail',
          selectedNovel: novel,
          readingChapterNumber: null,
        };
      }
    }

    // Format: about, intro, gioi-thieu (Bỏ trang giới thiệu phong cách cosmic, chuyển thẳng vào about-light)
    if (
      hash === 'about' ||
      hash === 'about-light' ||
      hash === 'gioi-thieu' ||
      hash === 'intro-light' ||
      hash === 'intro' ||
      hash === 'portfolio' ||
      hash === 'skills' ||
      hash === 'experience' ||
      hash === 'projects' ||
      hash === 'contact'
    ) {
      return {
        viewMode: 'about-light',
        selectedNovel: null,
        readingChapterNumber: null,
      };
    }

    // Format: novels or novel-home
    if (hash === 'novels' || hash === 'novel-home' || hash === 'truyen') {
      return {
        viewMode: 'novel-home',
        selectedNovel: null,
        readingChapterNumber: null,
      };
    }
  }

  // 2. Second priority: safeStorage 'cosmo_active_view'
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
        const novel = availableNovels.find((n) => n.id === parsed.novelId);
        if (novel) {
          const chapNum = typeof parsed.readingChapterNumber === 'number' ? parsed.readingChapterNumber : null;
          return {
            viewMode: 'novel-detail',
            selectedNovel: novel,
            readingChapterNumber: chapNum,
          };
        }
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
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Admin & Firestore States
  const [currentUser, setCurrentUser] = useState<AdminUserLike | null>(() => getStoredAdminSession());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isUserAdmin(getStoredAdminSession()));
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isCreateFirestoreModalOpen, setIsCreateFirestoreModalOpen] = useState(false);
  const [firestoreTruyens, setFirestoreTruyens] = useState<FirestoreTruyen[]>(() => getCachedTruyenList());

  // Thống kê lượt đọc Firestore toàn cầu & Hạn mức 50.000 đọc trong ngày
  const [firestoreStats, setFirestoreStats] = useState<FirestoreReadStats>(() => getFirestoreReadStats());

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

  useEffect(() => {
    const unsub = subscribeFirestoreReadStats((stats) => {
      setFirestoreStats(stats);
    });
    return () => unsub();
  }, []);

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

  // Tải danh mục truyện từ Firestore 1 lần khi mở web
  // Tối ưu hóa: Sử dụng bộ nhớ đệm cache, không tự động re-fetch khi chuyển trang hay quay về trang chủ
  const hasLoadedCatalogRef = useRef(false);

  const loadFirestoreTruyens = useCallback(async (force = false) => {
    try {
      const list = await fetchTruyenList(isAdmin, force);
      if (list && list.length > 0) {
        setFirestoreTruyens(list);
      }
    } catch (err) {
      console.warn('Notice fetching firestore truyens:', err);
    }
  }, [isAdmin]);

  // Chỉ gọi fetch 1 lần duy nhất khi khởi động ứng dụng (force = true để lấy danh mục mới nhất)
  useEffect(() => {
    if (!hasLoadedCatalogRef.current) {
      hasLoadedCatalogRef.current = true;
      loadFirestoreTruyens(true);
    }
  }, [loadFirestoreTruyens]);

  // Đồng bộ danh mục truyện thời gian thực từ Firestore
  useEffect(() => {
    const unsub = subscribeTruyenList(isAdmin, (list) => {
      if (list && list.length > 0) {
        setFirestoreTruyens(list);
      }
    });
    return () => unsub();
  }, [isAdmin]);

  // Combined novels: firestore novels + local novels
  const allMergedNovels = useMemo(() => {
    const mapped = firestoreTruyens.map((ft) => {
      const converted = convertFirestoreTruyenToNovel(ft);
      const existingLocal = novels.find((n) => n.id === ft.id);
      if (existingLocal) {
        return {
          ...converted,
          ...existingLocal,
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
            ft.anhBia ||
            existingLocal.coverImage ||
            getOriginalCoverByNovel(ft.id, ft.tenTruyen) ||
            converted.coverImage,
          coverImageUrl:
            ft.anhBia ||
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
    const nonConflictingLocal = novels.filter((n) => !fsIdSet.has(n.id));
    const all = [...mapped, ...nonConflictingLocal].filter((n) => !isBannedOrDraftNovel(n));
    return all.map((novel) => ({
      ...novel,
      status: 'completed' as const,
      translator: novel.translator || 'Jouriee65',
    }));
  }, [firestoreTruyens, novels]);

  // Save novels to safeStorage whenever state updates
  useEffect(() => {
    try {
      safeStorage.setItem('cosmo_novels', JSON.stringify(novels));
    } catch (e) {
      console.warn('Could not save novels to storage', e);
    }
  }, [novels]);

  // Tự động kiểm tra và đồng bộ bất kỳ truyện nào người dùng đã sáng tác/đăng trên máy này nhưng chưa kịp đưa lên Firestore
  const hasAutoSyncedRef = useRef(false);
  useEffect(() => {
    if (hasAutoSyncedRef.current || firestoreTruyens.length === 0) return;

    const syncUnsyncedNovels = async () => {
      hasAutoSyncedRef.current = true;
      try {
        const savedNovelsStr = safeStorage.getItem('cosmo_novels');
        if (!savedNovelsStr) return;
        const localList: Novel[] = JSON.parse(savedNovelsStr);
        if (!Array.isArray(localList) || localList.length === 0) return;

        const builtInIds = new Set(['lua-nhau', 'truc-ma-alpha', 'me-ke-vua-mem-vua-ngot', 'c-lua-nhau']);

        for (const local of localList) {
          if (!local || !local.title || !local.title.trim()) continue;
          if (isBannedOrDraftNovel(local)) continue;
          if (builtInIds.has(local.id)) continue;

          // Check if already in firestore by ID or exact title
          const existsInFirestore = firestoreTruyens.some(
            (ft) => ft.id === local.id || ft.tenTruyen.toLowerCase().trim() === local.title.toLowerCase().trim()
          );

          if (!existsInFirestore) {
            console.log('[AutoSync] Uploading local novel to Firestore:', local.title);
            const newId = await createTruyen({
              tenTruyen: local.title.trim(),
              moTa: local.synopsis || '',
              anhBia: local.coverImage || '',
              theLoai: local.genres ? local.genres.join(', ') : 'Tiểu Thuyết',
              tacGia: local.author?.name || 'Tác Giả',
              trangThai: 'daDang',
              status: 'completed',
              translator: 'Jouriee65',
              adminUser: currentUser || { uid: 'admin-nhjrtg', email: 'nhjrtg@gmail.com' },
              worldLore: local.worldLore || '',
              uploaderNote: local.uploaderNote || '',
            });

            if (local.chapters && local.chapters.length > 0) {
              await saveChaptersToFirestore(
                newId,
                local.chapters.map((c) => ({
                  soThuTu: c.chapterNumber,
                  tieuDe: c.title,
                  noiDung: c.content,
                }))
              );
            }

            // Update local novel id to match new Firestore doc id
            setNovels((prev) =>
              prev.map((n) => (n.id === local.id ? { ...n, id: newId, status: 'completed', translator: 'Jouriee65' } : n))
            );
            await loadFirestoreTruyens(true);
          }
        }
      } catch (syncErr) {
        console.warn('Notice auto-syncing unsynced novels to Firestore:', syncErr);
      }
    };

    syncUnsyncedNovels();
  }, [firestoreTruyens, currentUser, loadFirestoreTruyens]);

  // Keep selectedNovel synchronized with latest novel data in allMergedNovels array
  useEffect(() => {
    if (selectedNovel) {
      const refreshed = allMergedNovels.find((n) => n.id === selectedNovel.id);
      if (refreshed) {
        if (refreshed !== selectedNovel || refreshed.totalChaptersCount !== selectedNovel.totalChaptersCount || refreshed.trangThai !== selectedNovel.trangThai) {
          setSelectedNovel(refreshed);
        }
      } else {
        // Novel was deleted or is banned
        setSelectedNovel(null);
        setViewMode('novel-home');
      }
    }
  }, [allMergedNovels, selectedNovel?.id]);

  // Persist active view state and synchronize URL hash
  useEffect(() => {
    try {
      safeStorage.setItem(
        'cosmo_active_view',
        JSON.stringify({
          viewMode,
          novelId: selectedNovel?.id ?? null,
          readingChapterNumber,
        })
      );
    } catch (e) {
      console.warn('Could not save active view state', e);
    }

    // Synchronize URL hash
    if (typeof window !== 'undefined') {
      let desiredHash = '';
      if (viewMode === 'novel-detail' && selectedNovel) {
        if (readingChapterNumber !== null) {
          desiredHash = `#read/${selectedNovel.id}/${readingChapterNumber}`;
        } else {
          desiredHash = `#novel/${selectedNovel.id}`;
        }
      } else if (viewMode === 'novel-home') {
        desiredHash = '';
      } else if (viewMode === 'portfolio') {
        desiredHash = '#portfolio';
      } else if (viewMode === 'about-light') {
        desiredHash = '#about-light';
      }

      if (window.location.hash !== desiredHash) {
        try {
          window.history.replaceState(null, '', desiredHash || window.location.pathname);
        } catch {
          try {
            window.location.hash = desiredHash;
          } catch {
            // Ignored in sandboxed iframes
          }
        }
      }
    }
  }, [viewMode, selectedNovel?.id, readingChapterNumber]);

  // Ghi nhận LƯỢT XEM WEB phiên truy cập (Tối ưu hóa: chỉ tính 1 lượt xem cho cả phiên, chống F5/spam)
  useEffect(() => {
    recordWebsiteVisit();
  }, []);

  // Ghi nhận lượt xem cho truyện khi vào xem trang chi tiết truyện
  useEffect(() => {
    if (viewMode === 'novel-detail' && readingChapterNumber === null && selectedNovel) {
      recordPageView('novel-info', selectedNovel.title, selectedNovel.id);
    }
  }, [viewMode, selectedNovel?.id, readingChapterNumber]);

  // Respond to browser back/forward buttons (hashchange)
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseSavedViewState(allMergedNovels);
      setViewMode(parsed.viewMode);
      setSelectedNovel(parsed.selectedNovel);
      setReadingChapterNumber(parsed.readingChapterNumber);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [allMergedNovels]);

  const handleOpenNovelPlatform = () => {
    setSelectedNovel(null);
    setReadingChapterNumber(null);
    setIsDarkMode(false);
    safeStorage.setItem('cosmo_darkmode', 'false');
    setViewMode('novel-home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNovel = (novel: Novel) => {
    setSelectedNovel(novel);
    setReadingChapterNumber(null);
    setViewMode('novel-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNovelToReadingPosition = (novel: Novel, chapterNumber: number) => {
    setSelectedNovel(novel);
    setReadingChapterNumber(chapterNumber);
    setViewMode('novel-detail');
  };

  const handlePublishNovel = async (newNovel: Novel) => {
    const standardized: Novel = {
      ...newNovel,
      status: 'completed',
      translator: 'Jouriee65',
    };

    let firestoreId = newNovel.id;
    try {
      firestoreId = await createTruyen({
        tenTruyen: standardized.title,
        moTa: standardized.synopsis,
        anhBia: standardized.coverImage,
        theLoai: standardized.genres.join(', '),
        tacGia: standardized.author?.name || 'Tác Giả',
        trangThai: 'daDang',
        adminUser: currentUser || { uid: 'admin-nhjrtg', email: 'nhjrtg@gmail.com' },
        translator: 'Jouriee65',
        status: 'completed',
        worldLore: standardized.worldLore || '',
        uploaderNote: standardized.uploaderNote || '',
      });

      if (standardized.chapters && standardized.chapters.length > 0) {
        await saveChaptersToFirestore(
          firestoreId,
          standardized.chapters.map((c) => ({
            soThuTu: c.chapterNumber,
            tieuDe: c.title,
            noiDung: c.content,
          }))
        );
      }

      standardized.id = firestoreId;
      await loadFirestoreTruyens(true);
    } catch (fsErr) {
      console.warn('Error saving novel to Firestore:', fsErr);
    }

    setNovels((prev) => [standardized, ...prev.filter((n) => n.id !== firestoreId && n.id !== newNovel.id)]);
  };

  const handleAddChapter = (novelId: string, chapter: NovelChapter) => {
    // Persist to Firestore subcollection chuong
    try {
      saveChaptersToFirestore(novelId, [
        {
          soThuTu: chapter.chapterNumber,
          tieuDe: chapter.title,
          noiDung: chapter.content,
        },
      ]).catch((err) => console.warn('Notice saving added chapter to Firestore:', err));
    } catch (e) {
      console.warn('Error saving chapter to Firestore:', e);
    }

    setNovels((prev) =>
      prev.map((n) => {
        if (n.id === novelId) {
          const updatedChapters = [...n.chapters, chapter];
          const updatedNovel = {
            ...n,
            chapters: updatedChapters,
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
        }
        return n;
      })
    );
  };

  const handleUpdateNovelChapters = (novelId: string, updatedChapters: NovelChapter[]) => {
    // Persist chapters to Firestore so other devices see them
    try {
      if (updatedChapters.length > 0) {
        saveChaptersToFirestore(
          novelId,
          updatedChapters.map((c) => ({
            soThuTu: c.chapterNumber,
            tieuDe: c.title,
            noiDung: c.content,
          }))
        ).catch((err) => console.warn('Notice saving updated chapters to Firestore:', err));
      }
    } catch (e) {
      console.warn('Error syncing updated chapters to Firestore:', e);
    }

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
    // Persist to Firestore
    try {
      saveNovelCoverToFirebase(novelId, newCoverUrl);
    } catch (e) {
      console.warn('Failed to update novel cover on Firestore', e);
    }

    setFirestoreTruyens((prev) =>
      prev.map((ft) => (ft.id === novelId ? { ...ft, anhBia: newCoverUrl } : ft))
    );

    setNovels((prev) => {
      const next = prev.map((n) => {
        if (n.id === novelId) {
          const updatedNovel = {
            ...n,
            coverImage: newCoverUrl,
            coverImageUrl: newCoverUrl,
          };
          if (selectedNovel && selectedNovel.id === novelId) {
            setSelectedNovel(updatedNovel);
          }
          return updatedNovel;
        }
        return n;
      });
      try {
        safeStorage.setItem('cosmo_novels', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save novel cover', e);
      }
      return next;
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

  const isSystemLocked = firestoreStats.todayReads >= 50000 && !isAdmin;

  if (isSystemLocked) {
    return (
      <div className="min-h-screen bg-[#060713] text-slate-200 relative selection:bg-purple-500/30 selection:text-white font-jakarta">
        {/* POPUP KHÓA TOÀN BỘ WEB KHI ĐẠT MỐC 50.000 LƯỢT ĐỌC */}
        <DailyLimitExceededModal stats={firestoreStats} isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060713] text-slate-200 relative selection:bg-purple-500/30 selection:text-white font-jakarta">
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
              setIsDarkMode(false);
              safeStorage.setItem('cosmo_darkmode', 'false');
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
                setIsDarkMode(false);
                safeStorage.setItem('cosmo_darkmode', 'false');
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
                setIsDarkMode(false);
                safeStorage.setItem('cosmo_darkmode', 'false');
                setViewMode('novel-home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              currentOption={lightIntroOption}
              onChangeOption={(opt) => {
                setLightIntroOption(opt);
                safeStorage.setItem('light_intro_option', opt);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isDarkMode={false}
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

      {/* POPUP KHÓA TOÀN BỘ WEB KHI ĐẠT MỐC 50.000 LƯỢT ĐỌC HOẶC HẾT HẠN MỨC */}
      {firestoreStats.todayReads >= 50000 && !isAdmin && (
        <DailyLimitExceededModal stats={firestoreStats} isDarkMode={isDarkMode} />
      )}
    </div>
  );
}

