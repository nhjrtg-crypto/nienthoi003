import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Flame,
  Trophy,
  Star,
  Search,
  PlusCircle,
  Clock,
  Compass,
  TrendingUp,
  Bookmark,
  Layers,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Send,
  Eye,
  Rocket,
  Cpu,
  Shield,
  ShieldCheck,
  Trash2,
  Zap,
  Palette,
  Check,
  Sun,
  Moon,
  Sparkles as SparklesIcon,
  Wallpaper,
  Shuffle,
  CircleDot,
  ArrowRight,
  Users,
} from 'lucide-react';
import { Novel, NovelGenre, DarkBackgroundOption, DARK_BG_OPTIONS } from '../types';
import { AdminUserLike } from '../services/firebase';
import { cosmicAudio } from '../utils/audioSynth';
import { NOVEL_GENRES } from '../data/novelData';
import { NovelThemeId, NOVEL_THEME_OPTIONS, getNovelThemeStyles } from '../utils/themeStyles';
import { ClayThemeToggle } from './ClayThemeToggle';
import { WebLogo } from './WebLogo';
import { RandomNovelPicker } from './RandomNovelPicker';
import { IntroAboutButton, ClassicIntroAboutButton } from './IntroAboutButton';
import { useHeaderScroll } from '../utils/useHeaderScroll';
import { Footer } from './Footer';
import { CosmicStarsBackground } from './CosmicStarsBackground';
import { safeStorage } from '../utils/safeStorage';
import { getRecentReads, RecentReadRecord } from '../utils/recentReads';
import { getDirectImageUrl, handleCoverImageError } from '../utils/imageUtils';

const NOVEL_CATEGORY_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'h-van', label: 'H văn' },
  { id: 'h-van-np', label: 'H văn np' },
  { id: 'h-van-ngan', label: 'H văn ngắn' },
  { id: 'dam-my', label: 'Đam mỹ' },
] as const;

type NovelCategoryTabId = (typeof NOVEL_CATEGORY_TABS)[number]['id'];

/**
 * Chuẩn hóa tiêu đề để so khớp bộ lọc thể loại chính xác, hỗ trợ cả không dấu và ký tự đặc biệt
 */
const normalizeTitleForFilter = (str: string): string => {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Kiểm tra truyện có thuộc danh mục được chỉ định trong mục Tiểu Thuyết Đã Hoàn hay không:
 * - H văn: (Q1) Chiếm Hữu Cực Độ, (Q2) Chiếm Hữu Cực Độ, Bị Nam Chính Điên Cuồng Cưỡng Ép Yêu, Sau Khi Xuyên Sách Bị Ngưng Đọng Thời Gian, Vợ Đẹp Ngày Nào Cũng Tìm Cách Quyến Rũ Tôi
 * - H văn np: Gấp Đôi Luân Hãm, Kẻ Nhà Giàu Ngu Xuẩn, Mẹ Kế Vừa Mềm Vừa Ngọt, Cuộc Sống Dâm Loạn Ở Bộ Lạc
 * - H văn ngắn: Thái Hậu Xinh Đẹp Đang Mang Thai, Tù Đuôi, Dâm Loạn Giữa Ban Ngày, Sau Khi Beta Bình Thường Phân Hóa Lần Thứ Hai, Sau Khi Bị Kẻ Thù Phát Hiện Có Cặp Vú Đang Căng Sữa, Hệ Thống Thôi Miên Dụ Bạn Cùng Phòng Lên Giường, Series NTR: Cám Dỗ Vụng Trộm
 * - Đam mỹ: Lừa Nhau, Trúc Mã Alpha Của Tôi Có Độc
 */
const isNovelInCompletedCategory = (novel: Novel, categoryId: NovelCategoryTabId): boolean => {
  if (categoryId === 'all') return true;

  const t = normalizeTitleForFilter(novel.title);
  const nid = (novel.id || '').toLowerCase();

  if (categoryId === 'h-van') {
    // (Q1) Chiếm Hữu Cực Độ, (Q2) Chiếm Hữu Cực Độ, Bị Nam Chính Điên Cuồng Cưỡng Ép Yêu, Sau Khi Xuyên Sách Bị Ngưng Đọng Thời Gian, Vợ Đẹp Ngày Nào Cũng Tìm Cách Quyến Rũ Tôi
    if (t.includes('chiem huu cuc do') || nid.includes('chiem-huu')) return true;
    if (t.includes('bi nam chinh dien cuong cuong ep yeu') || t.includes('nam chinh dien cuong cuong ep yeu') || nid.includes('cuong-ep-yeu')) return true;
    if (t.includes('sau khi xuyen sach bi ngung dong thoi gian') || t.includes('ngung dong thoi gian') || nid.includes('ngung-dong')) return true;
    if (t.includes('vo dep ngay nao cung tim cach quyen ru toi') || t.includes('vo dep ngay nao') || nid.includes('vo-dep')) return true;
    return false;
  }

  if (categoryId === 'h-van-np') {
    // Gấp Đôi Luân Hãm, Kẻ Nhà Giàu Ngu Xuẩn, Mẹ Kế Vừa Mềm Vừa Ngọt, Cuộc Sống Dâm Loạn Ở Bộ Lạc
    if (t.includes('gap doi luan ham') || nid.includes('gap-doi-luan-ham')) return true;
    if (t.includes('ke nha giau ngu xuan') || nid.includes('ke-nha-giau')) return true;
    if (t.includes('me ke vua mem vua ngot') || nid === 'me-ke-vua-mem-vua-ngot') return true;
    if (t.includes('cuoc song dam loan o bo lac') || (t.includes('dam loan') && t.includes('bo lac')) || nid.includes('bo-lac')) return true;
    return false;
  }

  if (categoryId === 'h-van-ngan') {
    // Thái Hậu Xinh Đẹp Đang Mang Thai, Tù Đuôi, Dâm Loạn Giữa Ban Ngày, Sau Khi Beta Bình Thường Phân Hóa Lần Thứ Hai, Sau Khi Bị Kẻ Thù Phát Hiện Có Cặp Vú Đang Căng Sữa, Hệ Thống Thôi Miên Dụ Bạn Cùng Phòng Lên Giường, Series NTR: Cám Dỗ Vụng Trộm
    if (t.includes('thai hau xinh dep dang mang thai') || t.includes('thai hau xinh dep') || nid.includes('thai-hau')) return true;
    if (t === 'tu duoi' || t.includes('tu duoi') || nid.includes('tu-duoi')) return true;
    if (t.includes('dam loan giua ban ngay') || nid.includes('dam-loan-giua-ban-ngay')) return true;
    if (t.includes('sau khi beta binh thuong phan hoa lan thu hai') || t.includes('beta binh thuong phan hoa') || nid.includes('beta-binh-thuong')) return true;
    if (t.includes('sau khi bi ke thu phat hien co cap vu dang cang sua') || t.includes('cap vu dang cang sua') || (t.includes('ke thu phat hien') && t.includes('cang sua')) || nid.includes('cang-sua')) return true;
    if (t.includes('he thong thoi mien du ban cung phong len giuong') || t.includes('thoi mien du ban cung phong') || nid.includes('thoi-mien')) return true;
    if (t.includes('cam do vung trom') || t.includes('series ntr') || nid.includes('ntr') || nid.includes('cam-do')) return true;
    return false;
  }

  if (categoryId === 'dam-my') {
    // Lừa Nhau, Trúc Mã Alpha Của Tôi Có Độc
    if (t === 'lua nhau' || t.includes('lua nhau') || nid === 'lua-nhau') return true;
    if (t.includes('truc ma alpha cua toi co doc') || t.includes('truc ma alpha') || nid === 'truc-ma-alpha') return true;
    return false;
  }

  return true;
};


/**
 * Định dạng số lượt xem ngắn gọn theo yêu cầu:
 * 1000 = 1N, 100N, 1 triệu, 1,5 triệu...
 */
const formatCompactViews = (num: number): string => {
  if (!num || isNaN(num)) return '0';
  if (num >= 1_000_000) {
    const millions = num / 1_000_000;
    const formatted = millions >= 10 || num % 1_000_000 === 0
      ? Math.round(millions).toString()
      : (Math.round(millions * 10) / 10).toString().replace('.', ',');
    return `${formatted} triệu`;
  }
  if (num >= 1_000) {
    const thousands = num / 1_000;
    const formatted = thousands >= 100 || num % 1_000 === 0
      ? Math.round(thousands).toString()
      : (Math.round(thousands * 10) / 10).toString().replace('.', ',');
    return `${formatted}N`;
  }
  return `${num}`;
};

interface NovelHomeViewProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onOpenNovelToReadingPosition?: (novel: Novel, chapterNumber: number) => void;
  onOpenPublishModal: () => void;
  onBackToPortfolio: () => void;
  onOpenLightIntro?: () => void;
  onOpenAboutView?: () => void;
  isAdmin?: boolean;
  currentUser?: AdminUserLike | null;
  onOpenAdminAuth?: () => void;
  onOpenCreateFirestoreTruyen?: () => void;
  onToggleNovelStatus?: (novelId: string, currentStatus: 'nhap' | 'daDang') => void;
  onDeleteFirestoreNovel?: (novelId: string) => void;
}

export const NovelHomeView: React.FC<NovelHomeViewProps> = ({
  novels,
  onSelectNovel,
  onOpenNovelToReadingPosition,
  onOpenPublishModal,
  onBackToPortfolio,
  onOpenLightIntro,
  onOpenAboutView,
  isAdmin = false,
  currentUser = null,
  onOpenAdminAuth,
  onOpenCreateFirestoreTruyen,
  onToggleNovelStatus,
  onDeleteFirestoreNovel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<NovelCategoryTabId>('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  
  // Visual Theme (5 themes supported: 'slate-haze' | 'sage' | 'notebook' | 'mocha' | 'amethyst-haze'; cosmic functions as dark mode for amethyst-haze)
  const [theme, setTheme] = useState<NovelThemeId>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_novel_theme');
      if (saved === 'cosmic') {
        safeStorage.setItem('cosmo_novel_theme', 'amethyst-haze');
        safeStorage.setItem('cosmo_darkmode', 'false');
        return 'amethyst-haze';
      }
      if (saved && ['slate-haze', 'sage', 'notebook', 'mocha', 'amethyst-haze'].includes(saved)) {
        return saved as NovelThemeId;
      }
    } catch {}
    return 'amethyst-haze';
  });

  // Dark Mode: Đồng bộ và ghi nhớ chế độ tối theo lựa chọn của người dùng
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_darkmode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Tự động đồng bộ chế độ tối khi quay về trang chủ
  useEffect(() => {
    try {
      const saved = safeStorage.getItem('cosmo_darkmode');
      if (saved !== null) {
        setIsDarkMode(saved === 'true');
      }
    } catch {}
  }, []);

  // Dark Background Option for non-white, non-cosmic dark themes
  const [darkBgOption, setDarkBgOption] = useState<DarkBackgroundOption>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_dark_bg_option');
      if (saved === 'clay-spheres') return 'horizon-vaults';
      if (saved && DARK_BG_OPTIONS.some((o) => o.id === saved)) {
        return saved as DarkBackgroundOption;
      }
    } catch {}
    return 'horizon-vaults';
  });

  // Seed for randomized orb/sphere layout
  const [bgSeed, setBgSeed] = useState<number>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_dark_bg_seed');
      return saved ? parseInt(saved, 10) : 42;
    } catch {
      return 42;
    }
  });

  const [isBgMenuOpen, setIsBgMenuOpen] = useState(false);
  const bgMenuRef = useRef<HTMLDivElement>(null);

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Purple theme dark mode background effects toggle (mặc định tắt: false theo yêu cầu)
  const [purpleBgEffectsEnabled, setPurpleBgEffectsEnabled] = useState<boolean>(() => {
    try {
      if (safeStorage.getItem('cosmo_purple_bg_default_off_v2') !== 'true') {
        safeStorage.setItem('cosmo_purple_bg_default_off_v2', 'true');
        safeStorage.setItem('cosmo_purple_bg_effects', 'false');
        return false;
      }
      const saved = safeStorage.getItem('cosmo_purple_bg_effects');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const togglePurpleBgEffects = () => {
    setPurpleBgEffectsEnabled((prev) => {
      const next = !prev;
      safeStorage.setItem('cosmo_purple_bg_effects', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (bgMenuRef.current && !bgMenuRef.current.contains(event.target as Node)) {
        setIsBgMenuOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    // Nếu đang ở theme cosmic thì chuyển sang amethyst-haze sáng
    if (theme === 'cosmic') {
      setTheme('amethyst-haze');
      setIsDarkMode(false);
      safeStorage.setItem('cosmo_novel_theme', 'amethyst-haze');
      safeStorage.setItem('cosmo_darkmode', JSON.stringify(false));
      return;
    }
    setIsDarkMode((prev) => {
      const next = !prev;
      safeStorage.setItem('cosmo_darkmode', JSON.stringify(next));
      return next;
    });
  };
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (novelId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(novelId) ? prev.filter((id) => id !== novelId) : [...prev, novelId];
      safeStorage.setItem('cosmo_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  // Danh sách truyện đọc gần đây (tối đa 10 bộ truyện theo yêu cầu)
  const [recentReads, setRecentReads] = useState<{ novel: Novel; record: RecentReadRecord }[]>(() =>
    getRecentReads(novels)
  );
  const [recentIndex, setRecentIndex] = useState(0);

  // Trang hiện tại cho mục "TRUYỆN VỪA MỚI ĐĂNG" (hiển thị 3 truyện theo phong cách Polaroid)
  const [polaroidPage, setPolaroidPage] = useState(0);
  const [isRealtimeUpdatesOpen, setIsRealtimeUpdatesOpen] = useState(true);

  const activeRecentReads = useMemo(() => recentReads.slice(0, 10), [recentReads]);

  useEffect(() => {
    if (recentIndex >= activeRecentReads.length && activeRecentReads.length > 0) {
      setRecentIndex(activeRecentReads.length - 1);
    }
  }, [activeRecentReads.length, recentIndex]);

  useEffect(() => {
    setRecentReads(getRecentReads(novels));

    const handleUpdate = () => {
      setRecentReads(getRecentReads(novels));
    };

    window.addEventListener('cosmo_recent_reads_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cosmo_recent_reads_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [novels]);

  // Tự động di chuyển đến vị trí đang đọc dở khi bấm vào tên truyện hoặc bìa truyện
  const handleOpenReading = (novel: Novel, chapterNumber: number) => {
    if (onOpenNovelToReadingPosition) {
      onOpenNovelToReadingPosition(novel, chapterNumber);
    } else {
      onSelectNovel(novel);
    }
  };

  // Điều hướng chuyển truyện đọc gần đây (trái/phải)
  const handlePrevRecent = () => {
    if (activeRecentReads.length <= 1) return;
    setRecentIndex((prev) => (prev > 0 ? prev - 1 : activeRecentReads.length - 1));
  };

  const handleNextRecent = () => {
    if (activeRecentReads.length <= 1) return;
    setRecentIndex((prev) => (prev < activeRecentReads.length - 1 ? prev + 1 : 0));
  };

  // Tính toán thời gian đọc ước tính tương tự như ảnh mẫu IMG_20260916_124252
  const getReadingEstimate = (novel: Novel, record: RecentReadRecord) => {
    const totalChaps = novel.totalChaptersCount || novel.totalChapters || novel.chapters?.length || 10;
    const currentChap = Math.max(1, record.chapterNumber || 1);
    const remainingChaps = Math.max(0, totalChaps - currentChap);
    const pct = Math.min(100, Math.max(1, record.progressPercent || 1));

    // Thời gian đọc ước tính còn lại
    const remainingMinutes = Math.max(8, Math.round(remainingChaps * 7.5 * (1 - (pct % 100) / 100) + 18));
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMinsRem = remainingMinutes % 60;
    const remainingStr = remainingHours > 0
      ? `Còn lại ${remainingHours} giờ ${remainingMinsRem} phút`
      : `Còn lại ${remainingMinutes} phút`;

    // Thời gian đã đọc
    const readMinutes = Math.max(15, Math.round(currentChap * 7 + (pct / 100) * 12 + 20));
    const readHours = Math.floor(readMinutes / 60);
    const readMinsRem = readMinutes % 60;
    const readStr = readHours > 0
      ? `Đã đọc ${readHours} giờ ${readMinsRem} phút`
      : `Đã đọc ${readMinutes} phút`;

    return { remainingStr, readStr, pct };
  };

  // Cấu hình bảng màu & họa tiết Letterpress Lines & Hiệu ứng Stacked Layers cho Thẻ Truyện Đọc Gần Đây
  const getRecentReadingCardTheme = (th: NovelThemeId, isDark: boolean) => {
    if (isDark) {
      switch (th) {
        case 'notebook':
          return {
            cardBg: 'bg-[#16171b]/95',
            cardBorder: 'border-zinc-700/60',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
            stackedMiddle: 'bg-[#121316]/95 border-zinc-700/50 shadow-xs',
            stackedBottom: 'bg-[#0d0e10]/90 border-zinc-700/40 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(255, 255, 255, 0.05) 24px, rgba(255, 255, 255, 0.05) 25px)',
            titleText: 'text-zinc-100',
            novelTitle: 'text-zinc-100',
            chevronColor: 'text-zinc-400 group-hover:text-zinc-200',
            badge: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
            navBtn: 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60 shadow-xs',
            timeSubtext: 'text-zinc-400',
            timeIcon: 'text-zinc-400',
            progressTrack: 'bg-zinc-800/80 border border-zinc-700/50',
            progressBar: 'bg-zinc-300',
            progressThumb: 'bg-zinc-100 border-zinc-900 ring-2 ring-zinc-400/30',
            pctText: 'text-zinc-200',
            continueBtn: 'text-zinc-200 hover:text-zinc-100',
            divider: 'border-zinc-700/50',
            coverBorder: 'border-zinc-700/60',
            coverBg: 'bg-zinc-800',
          };
        case 'slate-haze':
          return {
            cardBg: 'bg-[#101726]/95',
            cardBorder: 'border-[#4d6a85]/35',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
            stackedMiddle: 'bg-[#0c121e]/95 border-[#4d6a85]/25 shadow-xs',
            stackedBottom: 'bg-[#080d16]/90 border-[#4d6a85]/20 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(77, 106, 133, 0.08) 24px, rgba(77, 106, 133, 0.08) 25px)',
            titleText: 'text-[#edf4fa]',
            novelTitle: 'text-[#edf4fa]',
            chevronColor: 'text-[#8bb0cf] group-hover:text-[#b8d4ec]',
            badge: 'bg-[#162332] text-[#dce7f0] border border-[#4d6a85]/40',
            navBtn: 'bg-[#162332] hover:bg-[#1e2f42] text-[#dce7f0] border-[#4d6a85]/40 shadow-xs',
            timeSubtext: 'text-[#8ba0b5]',
            timeIcon: 'text-[#8bb0cf]',
            progressTrack: 'bg-[#121c27] border border-[#2d455d]/40',
            progressBar: 'bg-[#5d7e9d] shadow-[0_0_6px_rgba(77,106,133,0.3)]',
            progressThumb: 'bg-[#a3c2dc] border-[#101726] ring-2 ring-[#5d7e9d]/40',
            pctText: 'text-[#dce7f0]',
            continueBtn: 'text-[#8bb0cf] hover:text-[#dce7f0]',
            divider: 'border-[#4d6a85]/20',
            coverBorder: 'border-[#4d6a85]/35',
            coverBg: 'bg-[#141e2a]/50',
          };
        case 'sage':
          return {
            cardBg: 'bg-[#0f1a14]/95',
            cardBorder: 'border-[#4d6f53]/25',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
            stackedMiddle: 'bg-[#0b1410]/95 border-[#4d6f53]/20 shadow-xs',
            stackedBottom: 'bg-[#080e0b]/90 border-[#4d6f53]/15 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(77, 111, 83, 0.05) 24px, rgba(77, 111, 83, 0.05) 25px)',
            titleText: 'text-[#eaf2eb]',
            novelTitle: 'text-[#eaf2eb]',
            chevronColor: 'text-[#8cb391] group-hover:text-[#bde0c2]',
            badge: 'bg-[#152317]/80 text-[#d7e6d9] border-[#4d6f53]/35',
            navBtn: 'bg-[#152317]/80 hover:bg-[#1d3020]/80 text-[#d7e6d9] border-[#4d6f53]/35 shadow-xs',
            timeSubtext: 'text-[#9db6a1]',
            timeIcon: 'text-[#8cb391]',
            progressTrack: 'bg-white/10 border border-white/10',
            progressBar: 'bg-[#4d6f53]',
            progressThumb: 'bg-[#98b89a] border-[#0c1510]',
            pctText: 'text-[#d7e6d9]',
            continueBtn: 'text-[#d7e6d9] hover:text-[#ffffff]',
            divider: 'border-[#4d6f53]/15',
            coverBorder: 'border-[#4d6f53]/30',
            coverBg: 'bg-[#152317]/50',
          };
        case 'mocha':
          return {
            cardBg: 'bg-[#19130e]/95',
            cardBorder: 'border-[#8c6150]/25',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
            stackedMiddle: 'bg-[#130e0a]/95 border-[#8c6150]/20 shadow-xs',
            stackedBottom: 'bg-[#0e0906]/90 border-[#8c6150]/15 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(140, 97, 80, 0.05) 24px, rgba(140, 97, 80, 0.05) 25px)',
            titleText: 'text-[#f5ece6]',
            novelTitle: 'text-[#f5ece6]',
            chevronColor: 'text-[#d4a38c] group-hover:text-[#f0d8cc]',
            badge: 'bg-[#2a1a14]/80 text-[#e4cec0] border-[#8c6150]/35',
            navBtn: 'bg-[#2a1a14]/80 hover:bg-[#38231b]/80 text-[#e4cec0] border-[#8c6150]/35 shadow-xs',
            timeSubtext: 'text-[#c2b0a2]',
            timeIcon: 'text-[#d4a38c]',
            progressTrack: 'bg-white/10 border border-white/10',
            progressBar: 'bg-[#8c6150]',
            progressThumb: 'bg-[#d8c2b5] border-[#15100c]',
            pctText: 'text-[#e4cec0]',
            continueBtn: 'text-[#e4cec0] hover:text-[#ffffff]',
            divider: 'border-[#8c6150]/15',
            coverBorder: 'border-[#8c6150]/30',
            coverBg: 'bg-[#241712]/50',
          };
        case 'cosmic':
          return {
            cardBg: 'bg-[#101228]/95',
            cardBorder: 'border-indigo-500/30',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.5)]',
            stackedMiddle: 'bg-[#0c0d20]/95 border-indigo-500/25 shadow-xs',
            stackedBottom: 'bg-[#080918]/90 border-indigo-500/20 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(165, 180, 252, 0.08) 24px, rgba(165, 180, 252, 0.08) 25px)',
            titleText: 'text-indigo-100',
            novelTitle: 'text-indigo-100',
            chevronColor: 'text-indigo-400 group-hover:text-pink-300',
            badge: 'bg-indigo-950/70 text-indigo-200 border-indigo-500/30',
            navBtn: 'bg-indigo-950/70 hover:bg-indigo-900/60 text-indigo-200 border-indigo-500/30 shadow-xs',
            timeSubtext: 'text-indigo-300/70',
            timeIcon: 'text-indigo-400/80',
            progressTrack: 'bg-indigo-950/80 border border-indigo-800/40',
            progressBar: 'bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]',
            progressThumb: 'bg-pink-300 border-indigo-950 ring-2 ring-pink-400/40',
            pctText: 'text-indigo-200',
            continueBtn: 'text-pink-300 hover:text-pink-200',
            divider: 'border-indigo-500/15',
            coverBorder: 'border-indigo-500/30',
            coverBg: 'bg-indigo-950/50',
          };
        case 'amethyst-haze':
        default:
          return {
            cardBg: 'bg-[#171223]/95',
            cardBorder: 'border-[#6e5585]/35',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
            stackedMiddle: 'bg-[#120d1c]/95 border-[#6e5585]/25 shadow-xs',
            stackedBottom: 'bg-[#0e0a16]/90 border-[#6e5585]/20 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(167, 149, 190, 0.08) 24px, rgba(167, 149, 190, 0.08) 25px)',
            titleText: 'text-[#f0edf7]',
            novelTitle: 'text-[#f0edf7]',
            chevronColor: 'text-[#bdaed3] group-hover:text-[#ded6e8]',
            badge: 'bg-[#251a33] text-[#ded6e8] border border-[#6e5585]/40',
            navBtn: 'bg-[#251a33] hover:bg-[#342445] text-[#ded6e8] border border-[#6e5585]/40 shadow-xs',
            timeSubtext: 'text-[#a795be]',
            timeIcon: 'text-[#bdaed3]',
            progressTrack: 'bg-[#191124] border border-[#3b284f]/40',
            progressBar: 'bg-[#7a6493] shadow-[0_0_6px_rgba(122,100,147,0.25)]',
            progressThumb: 'bg-[#cfc2de] border-[#120d1c] ring-2 ring-[#7a6493]/40',
            pctText: 'text-[#ded6e8]',
            continueBtn: 'text-[#bdaed3] hover:text-[#ded6e8]',
            divider: 'border-[#6e5585]/20',
            coverBorder: 'border-[#6e5585]/35',
            coverBg: 'bg-[#211630]/50',
          };
      }
    }

    // Light Mode: Màu sắc trung tính dịu nhẹ, thanh lịch và êm mắt phù hợp với từng theme
    switch (th) {
      case 'notebook': // White Theme
        return {
          cardBg: 'bg-[#ffffff]',
          cardBorder: 'border-zinc-200/90',
          cardShadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.04)]',
          stackedMiddle: 'bg-[#f4f4f5] border-zinc-200 shadow-xs',
          stackedBottom: 'bg-[#e4e4e7] border-zinc-200/80 shadow-xs',
          letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.08) 24px, rgba(255, 255, 255, 0.9) 25px)',
          titleText: 'text-zinc-800',
          novelTitle: 'text-zinc-900',
          chevronColor: 'text-zinc-400 group-hover:text-zinc-700',
          badge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          navBtn: 'notebook-light-btn !w-7 !h-7 sm:!w-8 sm:!h-8 !rounded-full !p-0 flex items-center justify-center hover:!text-[#171717]',
          timeSubtext: 'text-zinc-500',
          timeIcon: 'text-zinc-400',
          progressTrack: 'bg-zinc-200/80',
          progressBar: 'bg-zinc-700',
          progressThumb: 'bg-zinc-900 border-white ring-2 ring-zinc-300/60',
          pctText: 'text-zinc-800 font-semibold',
          continueBtn: 'notebook-light-btn px-3 py-1.5 rounded-full text-xs font-semibold hover:!text-[#171717]',
          divider: 'border-zinc-200',
          coverBorder: 'border-zinc-250',
          coverBg: 'bg-zinc-100',
        };
      case 'slate-haze': // Frost Theme
        return {
          cardBg: 'bg-[#f8fafc]',
          cardBorder: 'border-slate-200/90',
          cardShadow: 'shadow-[0_10px_30px_rgba(100,116,139,0.05)]',
          stackedMiddle: 'bg-[#f1f5f9] border-slate-200/90 shadow-xs',
          stackedBottom: 'bg-[#e2e8f0] border-slate-200/80 shadow-xs',
          letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(70, 95, 125, 0.08) 24px, rgba(255, 255, 255, 0.9) 25px)',
          titleText: 'text-slate-800',
          novelTitle: 'text-slate-900',
          chevronColor: 'text-slate-400 group-hover:text-slate-600',
          badge: 'bg-slate-100/90 text-slate-700 border-slate-200',
          navBtn: 'frost-light-btn !w-7 !h-7 sm:!w-8 sm:!h-8 !rounded-full !p-0 flex items-center justify-center hover:!text-[#0284c7]',
          timeSubtext: 'text-slate-500',
          timeIcon: 'text-slate-400',
          progressTrack: 'bg-slate-200/80',
          progressBar: 'bg-[#64748b]',
          progressThumb: 'bg-[#475569] border-white ring-2 ring-slate-300/60',
          pctText: 'text-slate-800 font-semibold',
          continueBtn: 'frost-light-btn px-3 py-1.5 rounded-full text-xs font-semibold hover:!text-[#0284c7]',
          divider: 'border-slate-200/80',
          coverBorder: 'border-slate-200/80',
          coverBg: 'bg-slate-100/70',
        };
      case 'sage':
        return {
          cardBg: 'bg-[#f9faf9]',
          cardBorder: 'border-emerald-200/70',
          cardShadow: 'shadow-[0_10px_30px_rgba(82,106,86,0.05)]',
          stackedMiddle: 'bg-[#f0f3f0] border-emerald-100 shadow-xs',
          stackedBottom: 'bg-[#e4ebe4] border-emerald-100/80 shadow-xs',
          letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(65, 95, 70, 0.08) 24px, rgba(255, 255, 255, 0.9) 25px)',
          titleText: 'text-stone-800',
          novelTitle: 'text-stone-900',
          chevronColor: 'text-stone-400 group-hover:text-stone-600',
          badge: 'bg-stone-100/90 text-stone-700 border-stone-200',
          navBtn: 'sage-light-btn !w-7 !h-7 sm:!w-8 sm:!h-8 !rounded-full !p-0 flex items-center justify-center hover:!text-[#274225]',
          timeSubtext: 'text-stone-500',
          timeIcon: 'text-stone-400',
          progressTrack: 'bg-stone-200/80',
          progressBar: 'bg-[#6a7f6c]',
          progressThumb: 'bg-[#566858] border-white ring-2 ring-stone-300/60',
          pctText: 'text-stone-800 font-semibold',
          continueBtn: 'sage-light-btn px-3 py-1.5 rounded-full text-xs font-semibold hover:!text-[#274225]',
          divider: 'border-stone-200/80',
          coverBorder: 'border-stone-200/80',
          coverBg: 'bg-stone-100/70',
        };
      case 'mocha':
        return {
          cardBg: 'bg-[#faf8f6]',
          cardBorder: 'border-stone-200/85',
          cardShadow: 'shadow-[0_10px_30px_rgba(120,95,80,0.05)]',
          stackedMiddle: 'bg-[#f2ece5] border-stone-200/90 shadow-xs',
          stackedBottom: 'bg-[#e7dfd6] border-stone-200/80 shadow-xs',
          letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(120, 90, 70, 0.08) 24px, rgba(255, 255, 255, 0.9) 25px)',
          titleText: 'text-stone-800',
          novelTitle: 'text-stone-900',
          chevronColor: 'text-stone-400 group-hover:text-stone-600',
          badge: 'bg-stone-100/90 text-stone-700 border-stone-200',
          navBtn: 'mocha-light-btn !w-7 !h-7 sm:!w-8 sm:!h-8 !rounded-full !p-0 flex items-center justify-center hover:!text-[#a37764]',
          timeSubtext: 'text-stone-500',
          timeIcon: 'text-stone-400',
          progressTrack: 'bg-stone-200/80',
          progressBar: 'bg-[#8a7567]',
          progressThumb: 'bg-[#736053] border-white ring-2 ring-stone-300/60',
          pctText: 'text-stone-800 font-semibold',
          continueBtn: 'mocha-light-btn px-3 py-1.5 rounded-full text-xs font-semibold hover:!text-[#a37764]',
          divider: 'border-stone-200/80',
          coverBorder: 'border-stone-200/80',
          coverBg: 'bg-stone-100/70',
        };
      case 'cosmic':
        return {
          cardBg: 'bg-[#f8f9fa]',
          cardBorder: 'border-slate-200/85',
          cardShadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.05)]',
          stackedMiddle: 'bg-[#f1f3f5] border-slate-200/90 shadow-xs',
          stackedBottom: 'bg-[#e5e7eb] border-slate-200/80 shadow-xs',
          letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(80, 70, 110, 0.08) 24px, rgba(255, 255, 255, 0.9) 25px)',
          titleText: 'text-slate-800',
          novelTitle: 'text-slate-900',
          chevronColor: 'text-slate-400 group-hover:text-slate-600',
          badge: 'bg-slate-100/90 text-slate-700 border-slate-200',
          navBtn: 'amethyst-light-btn !w-7 !h-7 sm:!w-8 sm:!h-8 !rounded-full !p-0 flex items-center justify-center hover:!text-[#7e58a6]',
          timeSubtext: 'text-slate-500',
          timeIcon: 'text-slate-400',
          progressTrack: 'bg-slate-200/80',
          progressBar: 'bg-slate-600',
          progressThumb: 'bg-slate-700 border-white ring-2 ring-slate-300/60',
          pctText: 'text-slate-800 font-semibold',
          continueBtn: 'amethyst-light-btn px-3 py-1.5 rounded-full text-xs font-semibold hover:!text-[#7e58a6]',
          divider: 'border-slate-200/80',
          coverBorder: 'border-slate-200/80',
          coverBg: 'bg-slate-100/70',
        };
      case 'amethyst-haze': // Purple Theme
      default:
        return {
          cardBg: 'bg-[#fbf9fc]',
          cardBorder: 'border-[#ded8ea]',
          cardShadow: 'shadow-[0_10px_30px_rgba(126,115,159,0.06)]',
          stackedMiddle: 'bg-[#f3eff7] border-[#ded8ea] shadow-xs',
          stackedBottom: 'bg-[#ebe4f2] border-[#ded8ea]/80 shadow-xs',
          letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(110, 95, 140, 0.08) 24px, rgba(255, 255, 255, 0.9) 25px)',
          titleText: 'text-[#2d243a]',
          novelTitle: 'text-[#21182e]',
          chevronColor: 'text-[#8e81a3] group-hover:text-[#6a5b8a]',
          badge: 'bg-[#f1edf7] text-[#605177] border-[#ded8ea]',
          navBtn: 'amethyst-light-btn !w-7 !h-7 sm:!w-8 sm:!h-8 !rounded-full !p-0 flex items-center justify-center hover:!text-[#7e58a6]',
          timeSubtext: 'text-[#7d7291]',
          timeIcon: 'text-[#9d92b0]',
          progressTrack: 'bg-[#e6e0ef]',
          progressBar: 'bg-[#7e739f]',
          progressThumb: 'bg-[#655985] border-white ring-2 ring-purple-200/60',
          pctText: 'text-[#413656] font-semibold',
          continueBtn: 'amethyst-light-btn px-3 py-1.5 rounded-full text-xs font-semibold hover:!text-[#7e58a6]',
          divider: 'border-[#eae5f2]',
          coverBorder: 'border-[#ded8ea]',
          coverBg: 'bg-[#f5f1fa]',
        };
    }
  };

  const getThemeProgressBar = (th: NovelThemeId, isDark: boolean) => {
    switch (th) {
      case 'cosmic':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'slate-haze':
        return isDark
          ? 'bg-gradient-to-r from-[#44627d] via-[#567a9c] to-[#7595b3] shadow-[0_0_6px_rgba(77,106,133,0.25)]'
          : 'bg-gradient-to-r from-[#64748b] via-[#7b92ad] to-[#90a1b9]';
      case 'sage':
        return isDark
          ? 'bg-gradient-to-r from-[#3e6041] to-[#588157]'
          : 'bg-gradient-to-r from-[#4d664a] to-[#789d73]';
      case 'mocha':
        return isDark
          ? 'bg-gradient-to-r from-[#8c6046] to-[#a67c65]'
          : 'bg-gradient-to-r from-[#A37764] to-[#c49f8f]';
      case 'notebook':
        return isDark
          ? 'bg-gradient-to-r from-[#B8B2A5] to-[#F7F4EE]'
          : 'bg-gradient-to-r from-[#737373] to-[#a3a3a3]';
      case 'amethyst-haze':
        return isDark
          ? 'bg-gradient-to-r from-[#624b7a] via-[#785f94] to-[#967fae] shadow-[0_0_6px_rgba(115,90,143,0.25)]'
          : 'bg-gradient-to-r from-[#8a5b9e] to-[#ba89cf]';
      default:
        return 'bg-gradient-to-r from-[#64748b] to-[#90a1b9]';
    }
  };

  // Thanh màu chỉ báo nổi bật: phát sáng rực rỡ ở chế độ Dark Mode, thanh màu phẳng chuẩn mực mang sắc thái header/footer ở Light Mode
  // Riêng theme cosmic: giữ duy nhất 1 chế độ tối (luôn phát sáng neon và không bao giờ đổi màu)
  const getThemeAccentBar = (th: NovelThemeId, isDark: boolean) => {
    // Theme Cosmic: giữ duy nhất 1 chế độ tối
    if (th === 'cosmic') {
      return 'bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#06b6d4] shadow-[0_0_14px_rgba(236,72,153,0.8)]';
    }

    if (!isDark) {
      // Chế độ sáng (Light Mode): thanh màu phẳng không phát sáng, mang màu sắc đồng điệu với header/footer của từng theme
      // Riêng theme notebook: màu sắc nhạt hơn nhiều (tone be xám giấy cổ thanh thoát #B8B2A5 thay vì màu đen đặc #181614)
      switch (th) {
        case 'notebook':
          return 'bg-[#737373]';
        case 'sage':
          return 'bg-[#678564]';
        case 'mocha':
          return 'bg-[#A37764]';
        case 'amethyst-haze':
          return 'bg-[#7e739f]';
        case 'slate-haze':
        default:
          return 'bg-[#90a1b9]';
      }
    }

    // Chế độ tối (Dark Mode): giữ nguyên thanh màu nổi bật bo tròn phát sáng neon đúng như ảnh mẫu
    switch (th) {
      case 'notebook':
        return 'bg-[#F7F4EE] shadow-[0_0_12px_rgba(247,244,238,0.65)]';
      case 'sage':
        return 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264] shadow-[0_0_12px_rgba(77,111,83,0.5)]';
      case 'mocha':
        return 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260] shadow-[0_0_12px_rgba(140,97,80,0.5)]';
      case 'amethyst-haze':
        return 'bg-gradient-to-r from-[#735a8f] via-[#856b9e] to-[#9c84b5] shadow-[0_0_8px_rgba(133,107,158,0.4)]';
      case 'slate-haze':
      default:
        return 'bg-gradient-to-r from-[#4d6a85] via-[#5d7e9d] to-[#7b9cb8] shadow-[0_0_8px_rgba(93,126,157,0.4)]';
    }
  };

  // Đường ray cơ sở ngang bên dưới thanh chỉ báo
  const getThemeTrackLine = (th: NovelThemeId, isDark: boolean) => {
    if (isDark) {
      return 'bg-white/10';
    }
    switch (th) {
      case 'notebook':
        return 'bg-[#e5e5e5]';
      case 'sage':
        return 'bg-[#dce5db]';
      case 'mocha':
        return 'bg-[#E4D9BC]';
      case 'amethyst-haze':
        return 'bg-[#e7d8f0]';
      case 'slate-haze':
      default:
        return 'bg-[#D6D3D1]/80';
    }
  };

  // Hiệu ứng "Hover/press lift effect with border reveal" dành riêng cho các khối Bảng Xếp Hạng & Vừa Cập Nhật (Tối ưu 60fps)
  const getHoverPressLiftBorderRevealStyle = (th: NovelThemeId, isDark: boolean) => {
    // Nâng khối khi lia chuột (hover lift), nén phản hồi xúc giác khi bấm giữ (active press), viền nổi bật bừng sáng (border reveal)
    const basePhysics =
      'transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out will-change-transform transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] select-none cursor-pointer border';

    if (th === 'cosmic') {
      return `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-pink-400/70 active:border-purple-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(236,72,153,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`;
    }

    switch (th) {
      case 'notebook':
        return isDark
          ? `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-white/50 active:border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`
          : `${basePhysics} bg-white hover:bg-[#fafafa] active:bg-[#f5f5f5] border-[#e5e5e5] hover:border-[#737373] active:border-[#525252] hover:shadow-md active:shadow-xs`;

      case 'sage':
        return isDark
          ? `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-[#5e8264]/80 active:border-[#4d6f53] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(77,111,83,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`
          : `${basePhysics} bg-white/70 hover:bg-white active:bg-[#f0f7ef] border-[#cad8c6] hover:border-[#678564] active:border-[#4a6348] hover:shadow-md active:shadow-xs`;

      case 'mocha':
        return isDark
          ? `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-[#9f7260]/80 active:border-[#8c6150] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(140,97,80,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`
          : `${basePhysics} bg-[#f5f1e6] hover:bg-white active:bg-[#F8F4EE] border-[#E4D9BC] hover:border-[#A37764] active:border-[#A37764] hover:shadow-md active:shadow-xs`;

      case 'amethyst-haze':
        return isDark
          ? `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-[#856b9e]/70 active:border-[#6f5487] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(115,90,143,0.22),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`
          : `${basePhysics} bg-[#fbf9fc] hover:bg-white active:bg-[#f4edf9] border-[#d8d3e2] hover:border-[#7e739f] active:border-[#5f547d] hover:shadow-md active:shadow-xs`;

      case 'slate-haze':
      default:
        return isDark
          ? `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-[#5d7e9d]/70 active:border-[#476685] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(77,106,133,0.22),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`
          : `${basePhysics} bg-[#f9fcff] hover:bg-white active:bg-[#f3f7fc] border-[#d8dfe9] hover:border-[#87909d]/60 active:border-[#87909d] hover:shadow-md active:shadow-xs`;
    }
  };

  // Helper styling for the "HOT" cover badge tailored to each theme (Không dùng Glassmorphism ở theme tối)
  const getHotBadgeStyle = (th: NovelThemeId, isDark: boolean) => {
    switch (th) {
      case 'slate-haze':
        return isDark
          ? 'bg-[#3e566d] text-white border border-[#5d7e9d]/70 shadow-xs font-bold'
          : 'bg-[#87909d] text-white border-slate-400/30 shadow-sm';
      case 'sage':
        return isDark
          ? 'bg-[#4d6f53] text-white border border-[#5e8264]/80 shadow-xs font-bold'
          : 'bg-stone-900/80 text-stone-100 border-stone-400/30 shadow-sm';
      case 'mocha':
        return isDark
          ? 'bg-[#8c6150] text-white border border-[#9f7260]/80 shadow-xs font-bold'
          : 'bg-stone-900/85 text-[#F8F4EE] border-[#A37764]/60 shadow-sm';
      case 'notebook':
        return isDark
          ? 'bg-neutral-800 text-[#F7F4EE] border border-neutral-600 shadow-xs font-bold'
          : 'bg-[#737373] text-white border-[#e5e5e5]/50 shadow-sm';
      case 'amethyst-haze':
        return isDark
          ? 'bg-[#624b7a] text-white border border-[#856b9e]/70 shadow-xs font-bold'
          : 'bg-stone-900/80 text-stone-100 border-stone-400/30 shadow-sm';
      case 'cosmic':
      default:
        return isDark
          ? 'bg-fuchsia-600 text-white border border-fuchsia-400/80 shadow-xs font-bold'
          : 'bg-fuchsia-700 text-white border border-fuchsia-500/80 shadow-xs font-bold';
    }
  };

  // Helper styling for "Đang ra" & "Hoàn thành" badges on book covers (Không sử dụng Glassmorphism)
  const getStatusBadgeStyle = (status: string, th: NovelThemeId, isDark: boolean) => {
    const isOngoing = status === 'ongoing';
    switch (th) {
      case 'slate-haze':
        return isOngoing
          ? (isDark
              ? 'bg-[#182635] text-[#cfdce8] border border-[#4d6a85]/40 shadow-xs'
              : 'bg-[#1e293b] text-white border border-[#0f172a] shadow-xs')
          : (isDark
              ? 'bg-[#101924] text-[#a6c2d8] border border-[#3b546b]/40 shadow-xs'
              : 'bg-slate-100 text-slate-700 border border-slate-300 shadow-xs');
      case 'sage':
        return isOngoing
          ? (isDark
              ? 'bg-[#152317] text-[#d7e6d9] border border-[#4d6f53]/50 shadow-xs'
              : 'bg-[#354b33] text-white border border-[#273826] shadow-xs')
          : (isDark
              ? 'bg-[#0d1710] text-[#9db6a1] border border-[#4d6f53]/40 shadow-xs'
              : 'bg-[#edf3ec] text-[#344832] border border-[#cad8c6] shadow-xs');
      case 'mocha':
        return isOngoing
          ? (isDark
              ? 'bg-[#2a1a14] text-[#ebdcd3] border border-[#8c6150]/50 shadow-xs'
              : 'bg-[#805543] text-white border border-[#6b4535] shadow-xs')
          : (isDark
              ? 'bg-[#1a120d] text-[#c2b0a2] border border-[#8c6150]/40 shadow-xs'
              : 'bg-[#f5eee6] text-[#63493c] border border-[#dccdc5] shadow-xs');
      case 'notebook':
        return isOngoing
          ? (isDark
              ? 'bg-neutral-800 text-neutral-200 border border-neutral-700 shadow-xs'
              : 'bg-[#4b4b4b] text-white border border-[#333333] shadow-xs')
          : (isDark
              ? 'bg-neutral-900 text-neutral-300 border border-neutral-700 shadow-xs'
              : 'bg-[#eeeeee] text-[#424242] border border-[#d4d4d4] shadow-xs');
      case 'amethyst-haze':
        return isOngoing
          ? (isDark
              ? 'bg-[#251a33] text-[#ded6e8] border border-[#6e5585]/40 shadow-xs'
              : 'bg-[#594970] text-white border border-[#443657] shadow-xs')
          : (isDark
              ? 'bg-[#1a1226] text-[#bdaed3] border border-[#523d66]/40 shadow-xs'
              : 'bg-[#f0ecf7] text-[#4d3d63] border border-[#d5cce3] shadow-xs');
      case 'cosmic':
      default:
        return isOngoing
          ? (isDark
              ? 'bg-[#0e172e] text-cyan-200 border border-cyan-500/50 shadow-xs'
              : 'bg-purple-900 text-white border border-purple-950 shadow-xs')
          : (isDark
              ? 'bg-[#21092e] text-pink-200 border border-pink-700/60 shadow-xs'
              : 'bg-pink-100 text-pink-900 border border-pink-300 shadow-xs');
    }
  };

  // Helper styling for the Hero section status badge (Không sử dụng Glassmorphism)
  const getHeroStatusBadgeStyle = (status: string, th: NovelThemeId, isDark: boolean) => {
    const isOngoing = status === 'ongoing';
    switch (th) {
      case 'slate-haze':
        return isOngoing
          ? (isDark
              ? 'bg-[#182635] text-[#cfdce8] border border-[#4d6a85]/40 shadow-xs'
              : 'bg-slate-100 text-slate-800 border-slate-300 shadow-2xs font-semibold')
          : (isDark
              ? 'bg-[#101924] text-[#a6c2d8] border border-[#3b546b]/40 shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 shadow-2xs');
      case 'sage':
        return isOngoing
          ? (isDark
              ? 'bg-[#152317] text-[#d7e6d9] border border-[#4d6f53]/50 shadow-xs'
              : 'bg-stone-100 text-stone-800 border-stone-300 shadow-2xs font-semibold')
          : (isDark
              ? 'bg-[#0d1710] text-[#d7e6d9] border border-[#4d6f53]/40 shadow-xs'
              : 'bg-stone-50 text-stone-600 border-stone-200 shadow-2xs');
      case 'mocha':
        return isOngoing
          ? (isDark
              ? 'bg-[#2a1a14] text-[#ebdcd3] border border-[#8c6150]/50 shadow-xs'
              : 'bg-[#F8F4EE] text-[#A37764] border-[#A37764]/40 font-bold shadow-2xs')
          : (isDark
              ? 'bg-[#1a120d] text-[#f5ede4] border border-[#8c6150]/40 shadow-xs'
              : 'bg-[#f5f1e6] text-[#8C7A6E] border-[#E4D9BC] shadow-2xs');
      case 'notebook':
        return isOngoing
          ? (isDark
              ? 'bg-neutral-800 text-[#F7F4EE] border border-neutral-700 shadow-xs'
              : 'bg-[#737373] text-white border-[#e5e5e5] shadow-2xs')
          : (isDark
              ? 'bg-neutral-900 text-[#D9D4C9] border border-neutral-700 shadow-xs'
              : 'bg-neutral-100 text-[#525252] border-[#e5e5e5] shadow-2xs');
      case 'amethyst-haze':
        return isOngoing
          ? (isDark
              ? 'bg-[#251a33] text-[#ded6e8] border border-[#6e5585]/40 shadow-xs'
              : 'bg-stone-100 text-stone-800 border-stone-300 shadow-2xs font-semibold')
          : (isDark
              ? 'bg-[#1a1226] text-[#ded6e8] border border-[#523d66]/40 shadow-xs'
              : 'bg-stone-50 text-stone-600 border-stone-200 shadow-2xs');
      case 'cosmic':
      default:
        return isOngoing
          ? (isDark
              ? 'bg-[#0e172e] text-cyan-200 border border-cyan-500/50 shadow-xs'
              : 'bg-cyan-900 text-cyan-100 border border-cyan-700 shadow-xs')
          : (isDark
              ? 'bg-[#21092e] text-pink-200 border border-pink-700/60 shadow-xs'
              : 'bg-pink-100 text-pink-900 border border-pink-300 shadow-xs');
    }
  };

  // Helper styling for Leaderboard top 1, 2, 3 rank buttons matching theme
  const getRankMedalStyle = (idx: number, th: NovelThemeId, isDark: boolean, defaultClass: string) => {
    if (idx >= 3) return defaultClass;
    switch (th) {
      case 'slate-haze':
        if (idx === 0) {
          return isDark
            ? 'bg-gradient-to-tr from-[#4d6a85] to-[#6d8fae] text-white shadow-[0_0_8px_rgba(77,106,133,0.35)]'
            : 'bg-gradient-to-tr from-[#87909d] to-[#6c7684] text-white shadow-sm ring-1 ring-[#d8dfe9]';
        }
        if (idx === 1) {
          return isDark
            ? 'bg-gradient-to-tr from-slate-300 to-slate-400 text-slate-950 shadow-sm'
            : 'bg-gradient-to-tr from-[#9aa3af] to-[#87909d] text-white shadow-sm ring-1 ring-[#d8dfe9]';
        }
        return isDark
          ? 'bg-gradient-to-tr from-[#3a506b] to-[#4f6d91] text-white shadow-sm'
          : 'bg-gradient-to-tr from-[#d8dfe9] to-[#cbd5e1] text-[#87909d] shadow-xs font-bold ring-1 ring-[#d8dfe9]';

      case 'sage':
        if (idx === 0) {
          return isDark
            ? 'bg-gradient-to-tr from-[#3e5b43] to-[#5e8264] text-white shadow-[0_0_10px_rgba(77,111,83,0.4)]'
            : 'bg-gradient-to-tr from-[#52634f] to-[#3e4d3c] text-white shadow-sm ring-1 ring-stone-400/30';
        }
        if (idx === 1) {
          return isDark
            ? 'bg-gradient-to-tr from-stone-300 to-stone-400 text-stone-950 shadow-sm'
            : 'bg-gradient-to-tr from-[#8a9f87] to-[#576b55] text-white shadow-sm ring-1 ring-stone-300/30';
        }
        return isDark
          ? 'bg-gradient-to-tr from-[#384937] to-[#4e644c] text-white shadow-sm'
          : 'bg-gradient-to-tr from-[#d2ddd0] to-[#a8bda5] text-stone-800 shadow-xs font-bold ring-1 ring-stone-300/30';

      case 'mocha':
        if (idx === 0) return 'bg-gradient-to-tr from-[#A37764] to-[#c29887] text-white shadow-sm';
        if (idx === 1) return 'bg-gradient-to-tr from-[#c29887] to-[#e4d9bc] text-stone-900 shadow-sm';
        return 'bg-gradient-to-tr from-[#E4D9BC] to-[#F8F4EE] text-stone-800 shadow-xs border border-[#E4D9BC]';

      case 'notebook':
        if (idx === 0) {
          return isDark
            ? 'bg-gradient-to-tr from-[#F7F4EE] to-[#D9D4C9] text-[#181614] shadow-sm'
            : 'bg-gradient-to-tr from-[#737373] to-[#525252] text-white shadow-sm ring-1 ring-[#e5e5e5]';
        }
        if (idx === 1) return 'bg-gradient-to-tr from-[#a3a3a3] to-[#737373] text-white shadow-sm ring-1 ring-[#e5e5e5]';
        return 'bg-gradient-to-tr from-[#e5e5e5] to-[#d4d4d4] text-[#525252] shadow-xs font-bold ring-1 ring-[#e5e5e5]';

      case 'amethyst-haze':
        if (idx === 0) {
          return isDark
            ? 'bg-gradient-to-tr from-[#735a8f] to-[#9980b8] text-white shadow-[0_0_8px_rgba(115,90,143,0.35)]'
            : 'bg-gradient-to-tr from-[#6b5f82] to-[#4f4464] text-white shadow-sm ring-1 ring-stone-400/30';
        }
        if (idx === 1) {
          return isDark
            ? 'bg-gradient-to-tr from-stone-300 to-stone-400 text-stone-950 shadow-sm'
            : 'bg-gradient-to-tr from-[#998dae] to-[#6b5f82] text-white shadow-sm ring-1 ring-stone-300/30';
        }
        return isDark
          ? 'bg-gradient-to-tr from-[#3b2d4c] to-[#524168] text-white shadow-sm'
          : 'bg-gradient-to-tr from-[#ddd7e7] to-[#b3a8c7] text-stone-800 shadow-xs font-bold ring-1 ring-stone-300/30';

      case 'cosmic':
      default:
        if (idx === 0) return 'bg-gradient-to-tr from-pink-500 to-purple-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]';
        if (idx === 1) return 'bg-gradient-to-tr from-purple-500 to-cyan-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]';
        return 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]';
    }
  };

  // Helper styling cho nút "Giới thiệu về trang web" trên hero banner ở chế độ sáng giống kiểu tags trong Tiểu Thuyết Đã Hoàn
  const getLightTagButtonClass = (th: NovelThemeId): string => {
    switch (th) {
      case 'slate-haze':
        return 'frost-light-btn';
      case 'sage':
        return 'sage-light-btn';
      case 'mocha':
        return 'mocha-light-btn';
      case 'notebook':
        return 'notebook-light-btn';
      case 'amethyst-haze':
      case 'cosmic':
      default:
        return 'amethyst-light-btn';
    }
  };

  // Helper styling for completed novel category filter tabs (Nút phân loại mục Tiểu Thuyết Đã Hoàn)
  // - Ở theme sáng: Khôi phục lại như cũ trước khi áp dụng 5 hiệu ứng (nền thanh container sáng với shadow-inner, màu nút active chuẩn của theme) - GIỮ NGUYÊN
  // - Ở theme tối: Chuyển sắc rõ ràng, mỗi nút mang một sắc thái riêng biệt nổi bật, toàn bộ thanh biến chuyển màu sắc hài hòa khi bấm nút khác nhau
  const getCompletedCategoryTabsStyles = (
    th: NovelThemeId,
    isDark: boolean,
    activeCat: NovelCategoryTabId = 'all'
  ) => {
    if (!isDark) {
      // Theme sáng: Nền sáng cho thanh container với đổ bóng chìm (shadow-inner), màu nút active là màu chủ đạo của theme (GIỮ NGUYÊN)
      switch (th) {
        case 'slate-haze':
          return {
            container: 'bg-[#eaf2f9] border border-[#cde0f3] shadow-inner',
            activePill: 'bg-white border border-[#bfe0fa] shadow-sm',
            activeText: 'text-[#0284c7]',
            inactiveText: 'text-[#526982] hover:text-[#0284c7]',
            getActivePill: () => ({ gradient: '', glow: '' }),
            getInactiveText: () => 'text-[#526982] hover:text-[#0284c7]',
          };
        case 'sage':
          return {
            container: 'bg-[#f0f4ef] border border-[#cad8c6] shadow-inner',
            activePill: 'bg-[#466244] border border-[#384937] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-[#556953] hover:text-[#1c261b]',
            getActivePill: () => ({ gradient: '', glow: '' }),
            getInactiveText: () => 'text-[#556953] hover:text-[#1c261b]',
          };
        case 'mocha':
          return {
            container: 'bg-[#f5f1e6] border border-[#E4D9BC] shadow-inner',
            activePill: 'bg-[#A37764] border border-[#8c5f4d] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-[#7d675e] hover:text-[#2a1d17]',
            getActivePill: () => ({ gradient: '', glow: '' }),
            getInactiveText: () => 'text-[#7d675e] hover:text-[#2a1d17]',
          };
        case 'amethyst-haze':
          return {
            container: 'bg-[#f7f5fb] border border-[#dcd6e8] shadow-inner',
            activePill: 'bg-[#6b5f82] border border-[#594d70] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-[#6b5e7d] hover:text-[#251d30]',
            getActivePill: () => ({ gradient: '', glow: '' }),
            getInactiveText: () => 'text-[#6b5e7d] hover:text-[#251d30]',
          };
        case 'notebook':
          return {
            container: 'bg-[#f5f5f5] border border-[#e5e5e5] shadow-inner',
            activePill: 'bg-[#262626] border border-[#171717] shadow-xs',
            activeText: 'text-white font-bold',
            inactiveText: 'text-[#525252] hover:text-[#171717]',
            getActivePill: () => ({ gradient: '', glow: '' }),
            getInactiveText: () => 'text-[#525252] hover:text-[#171717]',
          };
        case 'cosmic':
        default:
          return {
            container: 'bg-[#faf7ff] border border-[#e9d5ff] shadow-inner',
            activePill: 'bg-[#7c3aed] border border-[#6d28d9] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-purple-700 hover:text-purple-950',
            getActivePill: () => ({ gradient: '', glow: '' }),
            getInactiveText: () => 'text-purple-700 hover:text-purple-950',
          };
      }
    }

    // Theme tối: BỎ HOÀN TOÀN đường viền ngoài (border-0)
    // SẮC THÁI DỊU NHẸ, TRUNG TÍNH, KHÔNG CHÓI MẮT NHƯNG VẪN CÓ SỰ CHUYỂN SẮC TINH TẾ THEO TỪNG THEME:
    let containerBase = 'bg-[#151518]/90 border-0';
    const containerAura = 'shadow-md ring-1 ring-white/5';

    switch (th) {
      case 'sage':
        containerBase = 'bg-[#131a15]/90 border-0';
        break;
      case 'slate-haze':
        containerBase = 'bg-[#121822]/90 border-0';
        break;
      case 'mocha':
        containerBase = 'bg-[#1a1512]/90 border-0';
        break;
      case 'notebook':
        containerBase = 'bg-[#161619]/90 border-0';
        break;
      case 'amethyst-haze':
      case 'cosmic':
      default:
        containerBase = th === 'cosmic' ? 'bg-[#0f0c24]/90 border-0' : 'bg-[#16121f]/90 border-0';
        break;
    }

    // Dải màu gradient viên thuốc nổi bật, chuyển sắc sống động và bóng đổ 3D chiều sâu theo từng theme tối
    const getActivePill = (catId: NovelCategoryTabId) => {
      // 1. THEME SAGE (Xanh thảo mộc / Sage: Bạc hà ngọc bích #34d399 sang trà xanh xô thơm tươi mát #2dd4bf)
      if (th === 'sage') {
        const sageGlow = 'shadow-[0_4px_16px_rgba(52,211,153,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.5),inset_0_-1.5px_2px_rgba(0,0,0,0.2)]';
        switch (catId) {
          case 'h-van':
            return {
              gradient: 'bg-gradient-to-r from-[#4ade80] to-[#2dd4bf]',
              glow: sageGlow,
            };
          case 'h-van-np':
            return {
              gradient: 'bg-gradient-to-r from-[#4ade80] to-[#34d399]',
              glow: sageGlow,
            };
          case 'h-van-ngan':
            return {
              gradient: 'bg-gradient-to-r from-[#2dd4bf] to-[#34d399]',
              glow: sageGlow,
            };
          case 'dam-my':
            return {
              gradient: 'bg-gradient-to-r from-[#34d399] via-[#2dd4bf] to-[#6ee7b7]',
              glow: sageGlow,
            };
          case 'all':
          default:
            return {
              gradient: 'bg-gradient-to-r from-[#34d399] to-[#2dd4bf]',
              glow: sageGlow,
            };
        }
      }

      // 2. THEME SLATE-HAZE (Frost / Xanh băng tuyết: Xanh da trời baby #38bdf8 sang lam băng mát lạnh #60a5fa)
      if (th === 'slate-haze') {
        const frostGlow = 'shadow-[0_4px_16px_rgba(56,189,248,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.5),inset_0_-1.5px_2px_rgba(0,0,0,0.2)]';
        switch (catId) {
          case 'h-van':
            return {
              gradient: 'bg-gradient-to-r from-[#22d3ee] to-[#38bdf8]',
              glow: frostGlow,
            };
          case 'h-van-np':
            return {
              gradient: 'bg-gradient-to-r from-[#0284c7] to-[#38bdf8]',
              glow: frostGlow,
            };
          case 'h-van-ngan':
            return {
              gradient: 'bg-gradient-to-r from-[#60a5fa] to-[#38bdf8]',
              glow: frostGlow,
            };
          case 'dam-my':
            return {
              gradient: 'bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#818cf8]',
              glow: frostGlow,
            };
          case 'all':
          default:
            return {
              gradient: 'bg-gradient-to-r from-[#38bdf8] to-[#60a5fa]',
              glow: frostGlow,
            };
        }
      }

      // 3. THEME MOCHA (Caramel / Hổ phách: Cam đào ấm #fb923c sang caramel vàng mật ong rực rỡ #f59e0b)
      if (th === 'mocha') {
        const mochaGlow = 'shadow-[0_4px_16px_rgba(251,146,60,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.5),inset_0_-1.5px_2px_rgba(0,0,0,0.2)]';
        switch (catId) {
          case 'h-van':
            return {
              gradient: 'bg-gradient-to-r from-[#f97316] to-[#fbbf24]',
              glow: mochaGlow,
            };
          case 'h-van-np':
            return {
              gradient: 'bg-gradient-to-r from-[#fb923c] to-[#f472b6]',
              glow: mochaGlow,
            };
          case 'h-van-ngan':
            return {
              gradient: 'bg-gradient-to-r from-[#f59e0b] to-[#fb923c]',
              glow: mochaGlow,
            };
          case 'dam-my':
            return {
              gradient: 'bg-gradient-to-r from-[#fb923c] via-[#f59e0b] to-[#fcd34d]',
              glow: mochaGlow,
            };
          case 'all':
          default:
            return {
              gradient: 'bg-gradient-to-r from-[#fb923c] to-[#f59e0b]',
              glow: mochaGlow,
            };
        }
      }

      // 4. THEME NOTEBOOK (Monochrome / Bạc titan: Xám bạc ánh kim #94a3b8 sang bạch kim ngọc trai #cbd5e1)
      if (th === 'notebook') {
        const silverGlow = 'shadow-[0_4px_16px_rgba(148,163,184,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.6),inset_0_-1.5px_2px_rgba(0,0,0,0.2)]';
        switch (catId) {
          case 'h-van':
            return {
              gradient: 'bg-gradient-to-r from-[#64748b] to-[#94a3b8]',
              glow: silverGlow,
            };
          case 'h-van-np':
            return {
              gradient: 'bg-gradient-to-r from-[#475569] to-[#94a3b8]',
              glow: silverGlow,
            };
          case 'h-van-ngan':
            return {
              gradient: 'bg-gradient-to-r from-[#64748b] to-[#cbd5e1]',
              glow: silverGlow,
            };
          case 'dam-my':
            return {
              gradient: 'bg-gradient-to-r from-[#94a3b8] via-[#cbd5e1] to-[#e2e8f0]',
              glow: silverGlow,
            };
          case 'all':
          default:
            return {
              gradient: 'bg-gradient-to-r from-[#94a3b8] to-[#cbd5e1]',
              glow: silverGlow,
            };
        }
      }

      // 5. THEME COSMIC (Cực quang ngân hà: Lam tím cực quang #818cf8 qua tím #c084fc sang hồng rực #e879f9)
      if (th === 'cosmic') {
        const cosmicGlow = 'shadow-[0_4px_16px_rgba(168,85,247,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.5),inset_0_-1.5px_2px_rgba(0,0,0,0.2)]';
        switch (catId) {
          case 'h-van':
            return {
              gradient: 'bg-gradient-to-r from-[#a855f7] to-[#f472b6]',
              glow: cosmicGlow,
            };
          case 'h-van-np':
            return {
              gradient: 'bg-gradient-to-r from-[#c084fc] to-[#f43f5e]',
              glow: cosmicGlow,
            };
          case 'h-van-ngan':
            return {
              gradient: 'bg-gradient-to-r from-[#818cf8] to-[#c084fc]',
              glow: cosmicGlow,
            };
          case 'dam-my':
            return {
              gradient: 'bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899]',
              glow: cosmicGlow,
            };
          case 'all':
          default:
            return {
              gradient: 'bg-gradient-to-r from-[#818cf8] via-[#c084fc] to-[#e879f9]',
              glow: cosmicGlow,
            };
        }
      }

      // 6. THEME AMETHYST-HAZE / PURPLE (Chuẩn công thức: Tím tử đinh hương #c084fc sang hồng tím hoa cà #e879f9)
      const purpleGlow = 'shadow-[0_4px_16px_rgba(192,132,252,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.5),inset_0_-1.5px_2px_rgba(0,0,0,0.2)]';
      switch (catId) {
        case 'h-van':
          return {
            gradient: 'bg-gradient-to-r from-[#d946ef] to-[#c084fc]',
            glow: purpleGlow,
          };
        case 'h-van-np':
          return {
            gradient: 'bg-gradient-to-r from-[#c084fc] to-[#f472b6]',
            glow: purpleGlow,
          };
        case 'h-van-ngan':
          return {
            gradient: 'bg-gradient-to-r from-[#a855f7] to-[#e879f9]',
            glow: purpleGlow,
          };
        case 'dam-my':
          return {
            gradient: 'bg-gradient-to-r from-[#c084fc] via-[#d946ef] to-[#e879f9]',
            glow: purpleGlow,
          };
        case 'all':
        default:
          return {
            gradient: 'bg-gradient-to-r from-[#c084fc] to-[#e879f9]',
            glow: purpleGlow,
          };
      }
    };

    // Màu sắc chữ hover khi chưa active: Tone màu trung tính sáng nhẹ, thanh thoát
    const getInactiveText = (catId: NovelCategoryTabId) => {
      if (th === 'notebook') {
        return 'text-zinc-400 hover:text-zinc-100';
      }
      return 'text-stone-400 hover:text-stone-100';
    };

    return {
      container: `${containerBase} ${containerAura}`,
      activeText: th === 'notebook' ? 'text-zinc-950 font-bold' : 'text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]',
      inactiveText: 'text-stone-400 hover:text-stone-100',
      getActivePill,
      getInactiveText,
    };
  };

  // Helper styling for Khối Truyện Vừa Mới Đăng (Kiểu Neumorphism + Glassmorphism 2 đường viền đồng bộ cho tất cả themes)
  const getRecentUpdatesCardStyles = (th: NovelThemeId, isDark: boolean) => {
    if (!isDark) {
      switch (th) {
        case 'sage':
          return {
            outerStyle: {
              border: '1.5px solid transparent',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 248, 242, 0.8) 100%) padding-box, linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.35) 12%, transparent 26%) border-box, linear-gradient(to top, rgba(162, 198, 172, 0.92) 0%, rgba(182, 215, 192, 0.58) 7%, rgba(205, 230, 212, 0.22) 15%, transparent 24%) border-box',
              boxShadow: '0 12px 32px rgba(140, 180, 155, 0.18), 0 2px 6px rgba(0, 0, 0, 0.02)',
            },
            innerStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(246, 252, 248, 0.92) 100%) padding-box, linear-gradient(to bottom, rgba(180, 226, 196, 0.6) 0%, rgba(165, 214, 184, 0.5) 45%, rgba(150, 204, 172, 0.55) 100%) border-box',
              boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(160, 200, 175, 0.15)',
            },
            iconBtnStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(243,251,246,0.85) 100%) padding-box, linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(205,236,216,0.6) 45%, rgba(158,206,174,0.8) 100%) border-box',
              boxShadow: '0 2px 5px rgba(150,190,165,0.18), inset 0 1px 1px rgba(255,255,255,0.95)',
            },
            iconColor: 'text-[#3b6848]',
            titleColor: 'text-[#223929]',
            subtitleColor: 'text-[#74907d]',
            chevronColor: 'text-[#556953]',
            dividerClass: 'border-[#e3efe6]',
            itemHoverClass: 'hover:bg-emerald-50/60',
            itemTitleHoverClass: 'group-hover:text-emerald-700',
            itemDateClass: 'text-emerald-600',
          };
        case 'mocha':
          return {
            outerStyle: {
              border: '1.5px solid transparent',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 247, 240, 0.8) 100%) padding-box, linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.35) 12%, transparent 26%) border-box, linear-gradient(to top, rgba(215, 185, 165, 0.92) 0%, rgba(230, 205, 188, 0.58) 7%, rgba(242, 225, 212, 0.22) 15%, transparent 24%) border-box',
              boxShadow: '0 12px 32px rgba(195, 160, 135, 0.18), 0 2px 6px rgba(0, 0, 0, 0.02)',
            },
            innerStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 251, 247, 0.92) 100%) padding-box, linear-gradient(to bottom, rgba(240, 208, 185, 0.6) 0%, rgba(232, 195, 170, 0.5) 45%, rgba(224, 182, 155, 0.55) 100%) border-box',
              boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(210, 175, 150, 0.15)',
            },
            iconBtnStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,248,242,0.85) 100%) padding-box, linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(245,220,200,0.6) 45%, rgba(220,185,160,0.8) 100%) border-box',
              boxShadow: '0 2px 5px rgba(190,155,130,0.18), inset 0 1px 1px rgba(255,255,255,0.95)',
            },
            iconColor: 'text-[#8c5e47]',
            titleColor: 'text-[#3d271e]',
            subtitleColor: 'text-[#9d7d6f]',
            chevronColor: 'text-[#7d675e]',
            dividerClass: 'border-[#f2e4dc]',
            itemHoverClass: 'hover:bg-amber-50/60',
            itemTitleHoverClass: 'group-hover:text-amber-700',
            itemDateClass: 'text-amber-600',
          };
        case 'amethyst-haze':
          return {
            outerStyle: {
              border: '1.5px solid transparent',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 245, 253, 0.8) 100%) padding-box, linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.35) 12%, transparent 26%) border-box, linear-gradient(to top, rgba(200, 185, 220, 0.92) 0%, rgba(215, 202, 232, 0.58) 7%, rgba(232, 222, 245, 0.22) 15%, transparent 24%) border-box',
              boxShadow: '0 12px 32px rgba(180, 160, 205, 0.18), 0 2px 6px rgba(0, 0, 0, 0.02)',
            },
            innerStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(252, 250, 255, 0.92) 100%) padding-box, linear-gradient(to bottom, rgba(225, 205, 245, 0.6) 0%, rgba(215, 192, 238, 0.5) 45%, rgba(205, 180, 232, 0.55) 100%) border-box',
              boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 218, 0.15)',
            },
            iconBtnStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(250,246,255,0.85) 100%) padding-box, linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(235,220,250,0.6) 45%, rgba(205,185,230,0.8) 100%) border-box',
              boxShadow: '0 2px 5px rgba(175,150,205,0.18), inset 0 1px 1px rgba(255,255,255,0.95)',
            },
            iconColor: 'text-[#6b5887]',
            titleColor: 'text-[#322345]',
            subtitleColor: 'text-[#9382ab]',
            chevronColor: 'text-[#6b5e7d]',
            dividerClass: 'border-[#ede5f7]',
            itemHoverClass: 'hover:bg-purple-50/60',
            itemTitleHoverClass: 'group-hover:text-purple-700',
            itemDateClass: 'text-purple-600',
          };
        case 'cosmic':
          return {
            outerStyle: {
              border: '1.5px solid transparent',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(246, 247, 255, 0.8) 100%) padding-box, linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.35) 12%, transparent 26%) border-box, linear-gradient(to top, rgba(190, 195, 230, 0.92) 0%, rgba(205, 210, 240, 0.58) 7%, rgba(225, 230, 248, 0.22) 15%, transparent 24%) border-box',
              boxShadow: '0 12px 32px rgba(170, 175, 220, 0.18), 0 2px 6px rgba(0, 0, 0, 0.02)',
            },
            innerStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(250, 251, 255, 0.92) 100%) padding-box, linear-gradient(to bottom, rgba(210, 218, 252, 0.6) 0%, rgba(198, 208, 248, 0.5) 45%, rgba(188, 198, 245, 0.55) 100%) border-box',
              boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(185, 192, 230, 0.15)',
            },
            iconBtnStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(247,248,255,0.85) 100%) padding-box, linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(220,228,255,0.6) 45%, rgba(190,200,245,0.8) 100%) border-box',
              boxShadow: '0 2px 5px rgba(165,175,220,0.18), inset 0 1px 1px rgba(255,255,255,0.95)',
            },
            iconColor: 'text-[#5b589e]',
            titleColor: 'text-[#282548]',
            subtitleColor: 'text-[#8a87b5]',
            chevronColor: 'text-[#65538e]',
            dividerClass: 'border-[#e8eaf7]',
            itemHoverClass: 'hover:bg-indigo-50/60',
            itemTitleHoverClass: 'group-hover:text-indigo-700',
            itemDateClass: 'text-indigo-600',
          };
        case 'notebook':
          return {
            outerStyle: {
              border: '1.5px solid transparent',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.85) 100%) padding-box, linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.4) 12%, transparent 26%) border-box, linear-gradient(to top, rgba(212, 212, 216, 0.9) 0%, rgba(228, 228, 231, 0.6) 7%, rgba(244, 244, 245, 0.25) 15%, transparent 24%) border-box',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.02)',
            },
            innerStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(175deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 252, 252, 0.92) 100%) padding-box, linear-gradient(to bottom, rgba(228, 228, 231, 0.7) 0%, rgba(212, 212, 216, 0.5) 45%, rgba(228, 228, 231, 0.6) 100%) border-box',
              boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.98), inset 0 -1px 2px rgba(200, 200, 205, 0.12)',
            },
            iconBtnStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.85) 100%) padding-box, linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(228,228,231,0.6) 45%, rgba(212,212,216,0.8) 100%) border-box',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255,255,255,0.95)',
            },
            iconColor: 'text-[#525252]',
            titleColor: 'text-[#171717]',
            subtitleColor: 'text-[#737373]',
            chevronColor: 'text-[#525252]',
            dividerClass: 'border-[#e5e5e5]',
            itemHoverClass: 'hover:bg-zinc-100/70',
            itemTitleHoverClass: 'group-hover:text-[#171717]',
            itemDateClass: 'text-[#737373]',
          };
        case 'slate-haze':
        default:
          return {
            outerStyle: {
              border: '1.5px solid transparent',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(238, 246, 255, 0.75) 100%) padding-box, linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.35) 12%, transparent 26%) border-box, linear-gradient(to top, rgba(155, 180, 208, 0.92) 0%, rgba(175, 200, 224, 0.58) 7%, rgba(195, 218, 238, 0.22) 15%, transparent 24%) border-box',
              boxShadow: '0 12px 32px rgba(160, 185, 215, 0.18), 0 2px 6px rgba(0, 0, 0, 0.02)',
            },
            innerStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 252, 255, 0.92) 100%) padding-box, linear-gradient(to bottom, rgba(195, 225, 252, 0.6) 0%, rgba(182, 216, 248, 0.5) 45%, rgba(172, 210, 246, 0.55) 100%) border-box',
              boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(180, 204, 228, 0.12)',
            },
            iconBtnStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(246,250,255,0.85) 100%) padding-box, linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(225,238,250,0.6) 45%, rgba(175,198,222,0.8) 100%) border-box',
              boxShadow: '0 2px 5px rgba(165,188,212,0.18), inset 0 1px 1px rgba(255,255,255,0.95)',
            },
            iconColor: 'text-[#526982]',
            titleColor: 'text-[#2b3a4a]',
            subtitleColor: 'text-[#8798ac]',
            chevronColor: 'text-slate-500',
            dividerClass: 'border-[#e5eff8]',
            itemHoverClass: 'hover:bg-sky-50/60',
            itemTitleHoverClass: 'group-hover:text-sky-600',
            itemDateClass: 'text-sky-600',
          };
      }
    }

    // Theme tối (isDark === true): Áp dụng chuẩn đổ màu cho khối êm dịu, bớt đường viền con vụn vặt, giữ viền ngoài thanh mảnh
    switch (th) {
      case 'sage':
        return {
          outerStyle: {
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(20, 35, 24, 0.55) 45%, rgba(12, 21, 16, 0.75) 100%)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          },
          innerStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          },
          iconBtnStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.08)',
            boxShadow: 'none',
          },
          iconColor: 'text-[#8cb391]',
          titleColor: 'text-[#e5f0e7]',
          subtitleColor: 'text-[#8cb391]',
          chevronColor: 'text-[#8cb391]',
          dividerClass: 'border-white/[0.08]',
          itemHoverClass: 'bg-white/[0.04] hover:bg-white/[0.08] transition-colors',
          itemTitleHoverClass: 'group-hover:text-[#8cb391]',
          itemDateClass: 'text-[#8cb391]',
        };
      case 'mocha':
        return {
          outerStyle: {
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(35, 24, 18, 0.55) 45%, rgba(21, 16, 12, 0.75) 100%)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          },
          innerStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          },
          iconBtnStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.08)',
            boxShadow: 'none',
          },
          iconColor: 'text-[#c49f8f]',
          titleColor: 'text-[#f5ece6]',
          subtitleColor: 'text-[#c49f8f]',
          chevronColor: 'text-[#c49f8f]',
          dividerClass: 'border-white/[0.08]',
          itemHoverClass: 'bg-white/[0.04] hover:bg-white/[0.08] transition-colors',
          itemTitleHoverClass: 'group-hover:text-[#c49f8f]',
          itemDateClass: 'text-[#c49f8f]',
        };
      case 'amethyst-haze':
        return {
          outerStyle: {
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(25, 18, 42, 0.55) 45%, rgba(17, 10, 28, 0.75) 100%)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          },
          innerStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          },
          iconBtnStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.08)',
            boxShadow: 'none',
          },
          iconColor: 'text-purple-300',
          titleColor: 'text-purple-100',
          subtitleColor: 'text-purple-300',
          chevronColor: 'text-purple-300',
          dividerClass: 'border-white/[0.08]',
          itemHoverClass: 'bg-white/[0.04] hover:bg-white/[0.08] transition-colors',
          itemTitleHoverClass: 'group-hover:text-purple-300',
          itemDateClass: 'text-purple-300',
        };
      case 'cosmic':
        return {
          outerStyle: {
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(19, 17, 53, 0.55) 45%, rgba(10, 12, 36, 0.75) 100%)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          },
          innerStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          },
          iconBtnStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.08)',
            boxShadow: 'none',
          },
          iconColor: 'text-pink-400',
          titleColor: 'text-purple-100',
          subtitleColor: 'text-pink-300',
          chevronColor: 'text-pink-300',
          dividerClass: 'border-white/[0.08]',
          itemHoverClass: 'bg-white/[0.04] hover:bg-white/[0.08] transition-colors',
          itemTitleHoverClass: 'group-hover:text-pink-300',
          itemDateClass: 'text-pink-400',
        };
      case 'notebook':
        return {
          outerStyle: {
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(28, 24, 21, 0.55) 45%, rgba(16, 14, 12, 0.75) 100%)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          },
          innerStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          },
          iconBtnStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.08)',
            boxShadow: 'none',
          },
          iconColor: 'text-zinc-300',
          titleColor: 'text-zinc-100',
          subtitleColor: 'text-zinc-400',
          chevronColor: 'text-zinc-400',
          dividerClass: 'border-white/[0.08]',
          itemHoverClass: 'bg-white/[0.04] hover:bg-white/[0.08] transition-colors',
          itemTitleHoverClass: 'group-hover:text-zinc-100',
          itemDateClass: 'text-zinc-400',
        };
      case 'slate-haze':
      default:
        return {
          outerStyle: {
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(20, 30, 42, 0.55) 45%, rgba(11, 17, 24, 0.75) 100%)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          },
          innerStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          },
          iconBtnStyle: {
            border: 'none',
            background: 'rgba(255, 255, 255, 0.08)',
            boxShadow: 'none',
          },
          iconColor: 'text-[#8bb0cf]',
          titleColor: 'text-[#edf4fa]',
          subtitleColor: 'text-[#8bb0cf]',
          chevronColor: 'text-[#8bb0cf]',
          dividerClass: 'border-white/[0.08]',
          itemHoverClass: 'bg-white/[0.04] hover:bg-white/[0.08] transition-colors',
          itemTitleHoverClass: 'group-hover:text-[#8bb0cf]',
          itemDateClass: 'text-[#8bb0cf]',
        };
    }
  };

  // Helper styling for Theme-Appropriate Pastel & Dot-Grid (Áp dụng cho Hero & Mục Polaroid theo ảnh mẫu)
  const getThemePastelPalette = (th: NovelThemeId, isDark: boolean) => {
    if (isDark) {
      switch (th) {
        case 'notebook':
          return {
            dotColor: 'rgba(212, 212, 216, 0.08)',
            gridColor: 'rgba(255, 255, 255, 0.07)',
            heroRimBg: 'bg-[#18181c]',
            outerBg: 'bg-[#141416]/95',
            outerBorder: 'border-zinc-700/80',
            heroOuterBorder: 'border border-zinc-700/80',
            heroInnerDashed: 'border border-dashed border-zinc-600/70',
            heroGenreColor: 'text-zinc-400',
            heroTitleColor: 'text-zinc-100',
            heroMetaColor: 'text-zinc-300',
            heroOrnamentColor: 'text-zinc-400',
            cardBg: 'bg-[#18181b]/95',
            cardBorder: 'border-zinc-700/80',
            polaroidBg: 'bg-[#202024] border-zinc-600/80 text-zinc-100',
            starColor: 'text-zinc-300/90',
            ornamentText: 'text-zinc-400',
            bowColor: 'text-zinc-400',
            tapeColor: 'bg-zinc-800/80 border-zinc-600/50 text-zinc-300',
            pushpin: 'bg-zinc-800 border-zinc-500',
            dotActive: 'bg-zinc-300',
            dotInactive: 'bg-zinc-700',
            arrowBtn: 'bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700',
            badgeBg: 'bg-white/10 text-zinc-100 border-white/10',
            heartColor: 'text-zinc-400',
          };
        case 'slate-haze':
          return {
            dotColor: 'rgba(186, 230, 253, 0.08)',
            gridColor: 'rgba(77, 106, 133, 0.08)',
            heroRimBg: 'bg-[#0f1724]',
            outerBg: 'bg-[#0d1520]/95',
            outerBorder: 'border-[#4d6a85]/35',
            heroOuterBorder: 'border border-[#4d6a85]/35',
            heroInnerDashed: 'border border-dashed border-[#5d7e9d]/30',
            heroGenreColor: 'text-[#8ba0b5]',
            heroTitleColor: 'text-[#edf4fa]',
            heroMetaColor: 'text-[#8ba0b5]',
            heroOrnamentColor: 'text-[#7a9bb8]',
            cardBg: 'bg-[#0f1926]/95',
            cardBorder: 'border-[#4d6a85]/30',
            polaroidBg: 'bg-[#152233] border-[#4d6a85]/35 text-[#edf4fa]',
            starColor: 'text-[#7a9bb8]/75',
            ornamentText: 'text-[#8ba0b5]/70',
            bowColor: 'text-[#8ba0b5]/70',
            tapeColor: 'bg-[#1a2838]/80 border-[#4d6a85]/40 text-[#8ba0b5]',
            pushpin: 'bg-zinc-800 border-[#5d7e9d]',
            dotActive: 'bg-[#5d7e9d]',
            dotInactive: 'bg-[#1c2c3d]',
            arrowBtn: 'bg-[#162332] text-[#dce7f0] border-[#4d6a85]/40 hover:bg-[#1e2f42]',
            badgeBg: 'bg-white/10 text-[#dce7f0] border-white/10',
            heartColor: 'text-[#7a9bb8]',
          };
        case 'mocha':
          return {
            dotColor: 'rgba(212, 163, 140, 0.08)',
            gridColor: 'rgba(140, 97, 80, 0.09)',
            heroRimBg: 'bg-[#1b1511]',
            outerBg: 'bg-[#171310]/95',
            outerBorder: 'border-[#8c6150]/40',
            heroOuterBorder: 'border border-[#8c6150]/40',
            heroInnerDashed: 'border border-dashed border-[#8c6150]/35',
            heroGenreColor: 'text-[#d4a38c]',
            heroTitleColor: 'text-[#f5ece6]',
            heroMetaColor: 'text-[#c2b0a2]',
            heroOrnamentColor: 'text-[#d4a38c]',
            cardBg: 'bg-[#1c1713]/95',
            cardBorder: 'border-[#8c6150]/40',
            polaroidBg: 'bg-[#271f1a] border-[#8c6150]/40 text-[#f5ece6]',
            starColor: 'text-[#d4a38c]',
            ornamentText: 'text-[#c2b0a2]',
            bowColor: 'text-[#c2b0a2]',
            tapeColor: 'bg-[#2a1a14]/80 border-[#8c6150]/50 text-[#d4a38c]',
            pushpin: 'bg-zinc-800 border-[#8c6150]',
            dotActive: 'bg-[#8c6150]',
            dotInactive: 'bg-[#38231b]',
            arrowBtn: 'bg-[#261e19] text-[#f5ece6] border-[#8c6150]/50 hover:bg-[#38231b]/80',
            badgeBg: 'bg-white/10 text-[#ebdcd3] border-white/10',
            heartColor: 'text-[#d4a38c]',
          };
        case 'sage':
          return {
            dotColor: 'rgba(140, 179, 145, 0.08)',
            gridColor: 'rgba(77, 111, 83, 0.09)',
            heroRimBg: 'bg-[#111c14]',
            outerBg: 'bg-[#0e1711]/95',
            outerBorder: 'border-[#4d6f53]/40',
            heroOuterBorder: 'border border-[#4d6f53]/40',
            heroInnerDashed: 'border border-dashed border-[#4d6f53]/35',
            heroGenreColor: 'text-[#8cb391]',
            heroTitleColor: 'text-[#eaf2eb]',
            heroMetaColor: 'text-[#9db6a1]',
            heroOrnamentColor: 'text-[#8cb391]',
            cardBg: 'bg-[#111c15]/95',
            cardBorder: 'border-[#4d6f53]/40',
            polaroidBg: 'bg-[#17261d] border-[#4d6f53]/40 text-[#eaf2eb]',
            starColor: 'text-[#8cb391]',
            ornamentText: 'text-[#9db6a1]',
            bowColor: 'text-[#9db6a1]',
            tapeColor: 'bg-[#152317]/80 border-[#4d6f53]/50 text-[#8cb391]',
            pushpin: 'bg-zinc-800 border-[#4d6f53]',
            dotActive: 'bg-[#4d6f53]',
            dotInactive: 'bg-[#1d3020]',
            arrowBtn: 'bg-[#18261e] text-[#eaf2eb] border-[#4d6f53]/50 hover:bg-[#1d3020]/80',
            badgeBg: 'bg-white/10 text-[#d7e6d9] border-white/10',
            heartColor: 'text-[#8cb391]',
          };
        case 'cosmic':
          return {
            dotColor: 'rgba(199, 210, 254, 0.08)',
            gridColor: 'rgba(129, 140, 248, 0.10)',
            heroRimBg: 'bg-[#101229]',
            outerBg: 'bg-[#0d0f22]/95',
            outerBorder: 'border-indigo-500/40',
            heroOuterBorder: 'border border-indigo-500/45',
            heroInnerDashed: 'border border-dashed border-indigo-400/35',
            heroGenreColor: 'text-indigo-300/85',
            heroTitleColor: 'text-indigo-100',
            heroMetaColor: 'text-indigo-300/75',
            heroOrnamentColor: 'text-indigo-400/80',
            cardBg: 'bg-[#101229]/95',
            cardBorder: 'border-indigo-500/40',
            polaroidBg: 'bg-[#181a3a] border-indigo-400/40 text-indigo-100',
            starColor: 'text-indigo-400/85',
            ornamentText: 'text-indigo-300/70',
            bowColor: 'text-indigo-300/70',
            tapeColor: 'bg-indigo-950/70 border-indigo-800/50 text-indigo-300',
            pushpin: 'bg-zinc-800 border-indigo-400',
            dotActive: 'bg-indigo-400',
            dotInactive: 'bg-indigo-950',
            arrowBtn: 'bg-[#191c3c] text-indigo-100 border-indigo-600/50 hover:bg-indigo-900/60',
            badgeBg: 'bg-white/10 text-indigo-200 border-white/10',
            heartColor: 'text-indigo-400',
          };
        case 'amethyst-haze':
        default:
          return {
            dotColor: 'rgba(216, 180, 254, 0.08)',
            gridColor: 'rgba(133, 107, 158, 0.08)',
            heroRimBg: 'bg-[#161322]',
            outerBg: 'bg-[#13111c]/95',
            outerBorder: 'border-[#6e5585]/35',
            heroOuterBorder: 'border border-[#6e5585]/35',
            heroInnerDashed: 'border border-dashed border-[#82699c]/30',
            heroGenreColor: 'text-[#9c89b2]',
            heroTitleColor: 'text-[#f2f0f7]',
            heroMetaColor: 'text-[#9c89b2]',
            heroOrnamentColor: 'text-[#a795be]',
            cardBg: 'bg-[#161322]/95',
            cardBorder: 'border-[#6e5585]/30',
            polaroidBg: 'bg-[#1e192c] border-[#6e5585]/35 text-[#f2f0f7]',
            starColor: 'text-[#a795be]/75',
            ornamentText: 'text-[#9c89b2]/70',
            bowColor: 'text-[#9c89b2]/70',
            tapeColor: 'bg-[#21192e]/80 border-[#6e5585]/40 text-[#9c89b2]',
            pushpin: 'bg-zinc-800 border-[#82699c]',
            dotActive: 'bg-[#82699c]',
            dotInactive: 'bg-[#291e38]',
            arrowBtn: 'bg-[#1e172a] text-[#ded6e8] border-[#6e5585]/40 hover:bg-[#282038]',
            badgeBg: 'bg-white/10 text-[#ded6e8] border-white/10',
            heartColor: 'text-[#a795be]',
          };
      }
    }
    switch (th) {
      case 'amethyst-haze':
        return {
          dotColor: 'rgba(216, 180, 254, 0.22)',
          gridColor: 'rgba(126, 87, 160, 0.065)',
          heroRimBg: 'bg-white',
          outerBg: 'bg-[#f7f3fb]/90',
          outerBorder: 'border-[#dfd7ea]',
          heroOuterBorder: 'border border-[#dfd7ea]',
          heroInnerDashed: 'border border-dashed border-[#c6b6da]',
          heroGenreColor: 'text-[#5c4974]',
          heroTitleColor: 'text-[#2b1649]',
          heroMetaColor: 'text-[#65527f]',
          heroOrnamentColor: 'text-[#7a6a97]',
          cardBg: 'bg-white',
          cardBorder: 'border-[#ded7eb]',
          polaroidBg: 'bg-white border-[#e6e0f0] text-[#2c2242]',
          starColor: 'text-[#9d8bbd]',
          ornamentText: 'text-[#7e739f]',
          bowColor: 'text-[#7e739f]',
          tapeColor: 'bg-[#ede5f8] border-[#dfd2f2] text-[#6a5b8a]',
          pushpin: 'bg-white border-[#9d8bbd]',
          dotActive: 'bg-[#7e739f]',
          dotInactive: 'bg-[#ded7ea]',
          arrowBtn: 'bg-white text-[#43355b] border-[#ded7eb] hover:bg-purple-50/60 shadow-sm',
          badgeBg: 'bg-white/95 text-[#43355b] border-[#e2dced]',
          heartColor: 'text-[#8d7ca8]',
        };
      case 'notebook':
        return {
          dotColor: 'rgba(161, 161, 170, 0.20)',
          gridColor: 'rgba(0, 0, 0, 0.045)',
          heroRimBg: 'bg-white',
          outerBg: 'bg-[#fafafa]',
          outerBorder: 'border-[#e5e5e5]',
          heroOuterBorder: 'border border-[#e5e5e5]',
          heroInnerDashed: 'border border-dashed border-[#d4d4d8]',
          heroGenreColor: 'text-[#525252]',
          heroTitleColor: 'text-[#171717]',
          heroMetaColor: 'text-[#737373]',
          heroOrnamentColor: 'text-[#737373]',
          cardBg: 'bg-white',
          cardBorder: 'border-[#e5e5e5]',
          polaroidBg: 'bg-white border-[#e5e5e5] text-[#171717]',
          starColor: 'text-[#a1a1aa]',
          ornamentText: 'text-[#737373]',
          bowColor: 'text-[#737373]',
          tapeColor: 'bg-[#f4f4f5] border-[#e4e4e7] text-[#525252]',
          pushpin: 'bg-white border-[#737373]',
          dotActive: 'bg-[#737373]',
          dotInactive: 'bg-[#e5e5e5]',
          arrowBtn: 'bg-white text-[#171717] border-[#e5e5e5] hover:bg-neutral-100 shadow-sm',
          badgeBg: 'bg-white text-[#171717] border-[#e5e5e5]',
          heartColor: 'text-[#737373]',
        };
      case 'slate-haze':
        return {
          dotColor: 'rgba(148, 163, 184, 0.20)',
          gridColor: 'rgba(14, 116, 144, 0.055)',
          heroRimBg: 'bg-white',
          outerBg: 'bg-[#f4f8fc]',
          outerBorder: 'border-[#d8dfe9]',
          heroOuterBorder: 'border border-[#d8dfe9]',
          heroInnerDashed: 'border border-dashed border-[#cbd5e1]',
          heroGenreColor: 'text-[#486581]',
          heroTitleColor: 'text-[#1e293b]',
          heroMetaColor: 'text-[#627d98]',
          heroOrnamentColor: 'text-[#627d98]',
          cardBg: 'bg-white',
          cardBorder: 'border-[#d8dfe9]',
          polaroidBg: 'bg-white border-[#d8dfe9] text-[#1e293b]',
          starColor: 'text-[#879bb0]',
          ornamentText: 'text-[#627d98]',
          bowColor: 'text-[#627d98]',
          tapeColor: 'bg-[#e5eff8] border-[#d0e0ed] text-[#486581]',
          pushpin: 'bg-white border-[#879bb0]',
          dotActive: 'bg-[#87909d]',
          dotInactive: 'bg-[#d8dfe9]',
          arrowBtn: 'bg-white text-[#1e293b] border-[#d8dfe9] hover:bg-blue-50/50 shadow-sm',
          badgeBg: 'bg-white text-[#1e293b] border-[#d8dfe9]',
          heartColor: 'text-[#627d98]',
        };
      case 'mocha':
        return {
          dotColor: 'rgba(197, 160, 140, 0.22)',
          gridColor: 'rgba(180, 83, 9, 0.055)',
          heroRimBg: 'bg-white',
          outerBg: 'bg-[#fbf7f0]',
          outerBorder: 'border-[#E4D9BC]',
          heroOuterBorder: 'border border-[#E4D9BC]',
          heroInnerDashed: 'border border-dashed border-[#d8c7a8]',
          heroGenreColor: 'text-[#825c4c]',
          heroTitleColor: 'text-[#3A2A2A]',
          heroMetaColor: 'text-[#A37764]',
          heroOrnamentColor: 'text-[#A37764]',
          cardBg: 'bg-white',
          cardBorder: 'border-[#E4D9BC]',
          polaroidBg: 'bg-white border-[#E4D9BC] text-[#3A2A2A]',
          starColor: 'text-[#b09787]',
          ornamentText: 'text-[#A37764]',
          bowColor: 'text-[#A37764]',
          tapeColor: 'bg-[#f5ebe4] border-[#e5d5cb] text-[#825c4c]',
          pushpin: 'bg-white border-[#A37764]',
          dotActive: 'bg-[#A37764]',
          dotInactive: 'bg-[#E4D9BC]',
          arrowBtn: 'bg-white text-[#3A2A2A] border-[#E4D9BC] hover:bg-amber-50/50 shadow-sm',
          badgeBg: 'bg-white text-[#3A2A2A] border-[#E4D9BC]',
          heartColor: 'text-[#A37764]',
        };
      case 'sage':
      default:
        return {
          dotColor: 'rgba(134, 239, 172, 0.22)',
          gridColor: 'rgba(16, 185, 129, 0.055)',
          heroRimBg: 'bg-white',
          outerBg: 'bg-[#f3f8f1]',
          outerBorder: 'border-[#cad8c6]',
          heroOuterBorder: 'border border-[#cad8c6]',
          heroInnerDashed: 'border border-dashed border-[#b8cab4]',
          heroGenreColor: 'text-[#3c563a]',
          heroTitleColor: 'text-[#1c291e]',
          heroMetaColor: 'text-[#4d664a]',
          heroOrnamentColor: 'text-[#4d664a]',
          cardBg: 'bg-white',
          cardBorder: 'border-[#cad8c6]',
          polaroidBg: 'bg-white border-[#cad8c6] text-[#1c291e]',
          starColor: 'text-[#7e9e7b]',
          ornamentText: 'text-[#4d664a]',
          bowColor: 'text-[#4d664a]',
          tapeColor: 'bg-[#e8f2e6] border-[#d4e5d1] text-[#3c563a]',
          pushpin: 'bg-white border-[#4d664a]',
          dotActive: 'bg-[#4d664a]',
          dotInactive: 'bg-[#cad8c6]',
          arrowBtn: 'bg-white text-[#1c291e] border-[#cad8c6] hover:bg-emerald-50/50 shadow-sm',
          badgeBg: 'bg-white text-[#1c291e] border-[#cad8c6]',
          heartColor: 'text-[#4d664a]',
        };
    }
  };

  const featuredNovels = useMemo(() => {
    // Mục hero chỉ dành cho những bộ truyện có lượt xem cao nhất web (tối đa 5 truyện)
    const sorted = [...novels].sort((a, b) => {
      const viewsA = Number(a.views ?? (a as any).luotDoc ?? 0);
      const viewsB = Number(b.views ?? (b as any).luotDoc ?? 0);
      if (viewsB !== viewsA) {
        return viewsB - viewsA;
      }
      return 0;
    });
    return sorted.slice(0, 5);
  }, [novels]);

  const currentHeroNovel = featuredNovels[featuredIndex] || novels[0];

  const heroDateFormatted = useMemo(() => {
    if (!currentHeroNovel) return '16/09/2026';
    const dateStr =
      currentHeroNovel.latestChapter?.updatedAt ||
      currentHeroNovel.updatedAt ||
      currentHeroNovel.createdAt;
    if (!dateStr) return '16/09/2026';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '16/09/2026';
      return d.toLocaleDateString('vi-VN');
    } catch {
      return '16/09/2026';
    }
  }, [currentHeroNovel]);

  const handlePrevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + featuredNovels.length) % featuredNovels.length);
  };

  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredNovels.length);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsSearchFocused(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Tự động chuyển tab danh mục về 'all' để toàn bộ kết quả tìm kiếm hiển thị
    if (selectedCategory !== 'all') {
      setSelectedCategory('all');
    }

    // Cuộn mượt màn hình tới khu vực danh sách truyện để người dùng xem kết quả ngay
    const targetElement = document.getElementById('completed-novels-section');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return novels
      .filter((n) => {
        if (n.trangThai === 'nhap' || (n.status as string) === 'nhap') return false;
        return (
          n.title.toLowerCase().includes(q) ||
          n.author.name.toLowerCase().includes(q) ||
          n.genres.some((g) => g.toLowerCase().includes(q)) ||
          (n.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          (n.translator || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 5);
  }, [novels, searchQuery]);

  const filteredNovels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return novels.filter((n) => {
      // Không hiển thị bất kỳ truyện bản nháp nào
      if (n.trangThai === 'nhap' || (n.status as string) === 'nhap') {
        return false;
      }

      const matchSearch =
        q === '' ||
        n.title.toLowerCase().includes(q) ||
        n.author.name.toLowerCase().includes(q) ||
        n.genres.some((g) => g.toLowerCase().includes(q)) ||
        (n.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (n.translator || '').toLowerCase().includes(q);

      // Nếu đang tìm kiếm có từ khóa, tìm kiếm trên toàn bộ truyện để không bị chặn bởi thể loại/danh mục
      const matchGenre =
        q !== '' || selectedGenre === 'all'
          ? true
          : n.genres.some((g) => {
              const genreObj = NOVEL_GENRES.find((item) => item.id === selectedGenre);
              return genreObj ? g.includes(genreObj.name) : true;
            });

      const matchCategory = isNovelInCompletedCategory(n, selectedCategory);

      return matchSearch && matchGenre && matchCategory;
    });
  }, [novels, searchQuery, selectedGenre, selectedCategory]);

  const rankedNovels = useMemo(() => {
    return [...novels];
  }, [novels]);

  // Track responsive grid column count: 2 on mobile (< 768px), 3 on md+
  const [gridColumns, setGridColumns] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? 3 : 2;
    }
    return 3;
  });

  useEffect(() => {
    const handleResize = () => {
      setGridColumns(window.innerWidth >= 768 ? 3 : 2);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 5 rows limit state: initially collapsed, expands on clicking "Xem Thêm"
  const [isGridExpanded, setIsGridExpanded] = useState<boolean>(false);

  useEffect(() => {
    setIsGridExpanded(false);
  }, [selectedCategory, selectedGenre, searchQuery]);

  const maxNovelsFor5Rows = gridColumns * 5;

  const displayedNovels = useMemo(() => {
    if (isGridExpanded) return filteredNovels;
    return filteredNovels.slice(0, maxNovelsFor5Rows);
  }, [filteredNovels, isGridExpanded, maxNovelsFor5Rows]);

  const getGenreIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket':
        return <Rocket className="w-3.5 h-3.5" />;
      case 'Compass':
        return <Compass className="w-3.5 h-3.5" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'Flame':
        return <Flame className="w-3.5 h-3.5" />;
      case 'Shield':
        return <Shield className="w-3.5 h-3.5" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const isCurrentBookmarked = bookmarkedIds.includes(currentHeroNovel?.id);

  // Centralized Theme Color & Typography Styles
  const isCosmic = theme === 'cosmic';
  const isDarkEffective = isCosmic || isDarkMode;
  const tStyles = useMemo(() => getNovelThemeStyles(theme, isDarkEffective), [theme, isDarkEffective]);

  // Cấu hình bảng màu kết quả tìm kiếm theo từng theme (trung tính, dịu nhẹ ở theme sáng)
  const searchDropdownStyles = useMemo(() => {
    if (isDarkEffective) {
      return {
        container: 'bg-[#181513]/95 border-white/15 text-stone-200 shadow-2xl',
        header: 'border-white/10 text-stone-400',
        itemHover: 'hover:bg-white/10',
        titleText: 'text-stone-100',
        subText: 'text-stone-400',
        badge: 'text-emerald-400',
        viewAllBtn: 'border-white/10 hover:bg-white/10 text-purple-300',
        noticeHighlight: 'text-purple-300',
      };
    }

    switch (theme) {
      case 'sage':
        return {
          container: 'bg-[#f8faf7]/98 border-[#d7e4d5] text-[#243725] shadow-[0_12px_36px_rgba(30,60,35,0.08)]',
          header: 'border-[#e2ede0] text-[#557557]',
          itemHover: 'hover:bg-[#edf5ec]',
          titleText: 'text-[#1c2c1e]',
          subText: 'text-[#557557]',
          badge: 'text-emerald-700',
          viewAllBtn: 'border-[#e2ede0] hover:bg-[#edf5ec] text-[#3b5e3d]',
          noticeHighlight: 'text-[#3b5e3d]',
        };
      case 'mocha':
        return {
          container: 'bg-[#faf7f3]/98 border-[#ebe1d7] text-[#3b2f27] shadow-[0_12px_36px_rgba(60,40,30,0.08)]',
          header: 'border-[#eee6dd] text-[#786355]',
          itemHover: 'hover:bg-[#f4ede6]',
          titleText: 'text-[#2e231c]',
          subText: 'text-[#786355]',
          badge: 'text-amber-800',
          viewAllBtn: 'border-[#eee6dd] hover:bg-[#f4ede6] text-[#7a5843]',
          noticeHighlight: 'text-[#7a5843]',
        };
      case 'amethyst-haze':
        return {
          container: 'bg-[#faf7fd]/98 border-[#e6dcee] text-[#312240] shadow-[0_12px_36px_rgba(50,30,70,0.08)]',
          header: 'border-[#ece4f3] text-[#715c85]',
          itemHover: 'hover:bg-[#f3edf8]',
          titleText: 'text-[#251733]',
          subText: 'text-[#715c85]',
          badge: 'text-purple-700',
          viewAllBtn: 'border-[#ece4f3] hover:bg-[#f3edf8] text-[#6d4978]',
          noticeHighlight: 'text-[#6d4978]',
        };
      case 'slate-haze':
        return {
          container: 'bg-[#f8fafc]/98 border-[#dbe6ef] text-[#1f2f3d] shadow-[0_12px_36px_rgba(30,50,70,0.08)]',
          header: 'border-[#e4edf5] text-[#5c7285]',
          itemHover: 'hover:bg-[#edf4f8]',
          titleText: 'text-[#14222d]',
          subText: 'text-[#5c7285]',
          badge: 'text-sky-700',
          viewAllBtn: 'border-[#e4edf5] hover:bg-[#edf4f8] text-[#2c5373]',
          noticeHighlight: 'text-[#2c5373]',
        };
      case 'notebook':
      default:
        return {
          container: 'bg-white/98 border-neutral-200 text-neutral-800 shadow-[0_12px_36px_rgba(0,0,0,0.08)]',
          header: 'border-neutral-100 text-neutral-500',
          itemHover: 'hover:bg-neutral-100/80',
          titleText: 'text-neutral-900',
          subText: 'text-neutral-500',
          badge: 'text-neutral-700',
          viewAllBtn: 'border-neutral-100 hover:bg-neutral-100 text-neutral-700',
          noticeHighlight: 'text-neutral-800',
        };
    }
  }, [theme, isDarkEffective]);

  // Cấu hình phong cách cho nút "GIỚI THIỆU VỀ TRANG WEB"
  const introButtonStyles = useMemo(() => {
    if (isCosmic) {
      return isDarkEffective
        ? {
            gradientBorder: 'bg-[linear-gradient(90deg,#2e1065,#a855f7,#ec4899,#06b6d4,#2e1065)]',
            glowShadow: 'shadow-[0_0_8px_rgba(168,85,247,0.35)]',
            glowShadowHover: 'group-hover:shadow-[0_0_12px_rgba(236,72,153,0.45)]',
            pulseHaloBg: 'bg-indigo-600/20',
            btnInnerBg: 'bg-[#2e1065] hover:bg-[#3b1580]',
            textColor: 'text-white font-bold',
            dotColor: 'bg-cyan-200',
            dotPing: 'bg-pink-400',
            // Fallback compatibility properties
            btnBg: '',
            btnGradient: 'bg-gradient-to-r from-[#818cf8] via-[#c084fc] to-[#e879f9]',
            btnGlow: 'shadow-[0_4px_16px_rgba(168,85,247,0.45)]',
            borderShadow: 'shadow-none',
            innerShadow: 'shadow-xs',
            haloCushion: 'bg-gradient-to-r from-[#818cf8]/40 via-[#c084fc]/30 to-[#e879f9]/40',
          }
        : {
            gradientBorder: 'bg-transparent',
            glowShadow: 'shadow-xs',
            glowShadowHover: 'group-hover:shadow-sm',
            pulseHaloBg: 'opacity-0',
            btnInnerBg: 'bg-purple-50/90 hover:bg-purple-100/90 border border-purple-200 hover:border-purple-300 shadow-xs',
            textColor: 'text-purple-800 font-bold',
            dotColor: 'bg-purple-500',
            dotPing: 'bg-purple-300',
            // Fallback compatibility properties
            btnBg: '#faf8fc',
            btnGradient: '',
            btnGlow: '',
            borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
            innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
            haloCushion: 'bg-[#dbd1e8]/30',
          };
    }

    switch (theme) {
      case 'sage':
        return isDarkEffective
          ? {
              gradientBorder: 'bg-[linear-gradient(90deg,#064e3b,#10b981,#34d399,#6ee7b7,#064e3b)]',
              glowShadow: 'shadow-[0_0_8px_rgba(52,211,153,0.35)]',
              glowShadowHover: 'group-hover:shadow-[0_0_12px_rgba(16,185,129,0.45)]',
              pulseHaloBg: 'bg-emerald-600/20',
              btnInnerBg: 'bg-[#064e3b] hover:bg-[#065f46]',
              textColor: 'text-white font-bold',
              dotColor: 'bg-emerald-200',
              dotPing: 'bg-teal-400',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#34d399] to-[#2dd4bf]',
              btnGlow: 'shadow-[0_4px_16px_rgba(52,211,153,0.45)]',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'bg-gradient-to-r from-[#34d399]/40 to-[#2dd4bf]/40',
            }
          : {
              gradientBorder: 'bg-transparent',
              glowShadow: 'shadow-xs',
              glowShadowHover: 'group-hover:shadow-sm',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200 hover:border-emerald-300 shadow-xs',
              textColor: 'text-emerald-800 font-bold',
              dotColor: 'bg-emerald-600',
              dotPing: 'bg-emerald-400',
              btnBg: '#f7faf7',
              btnGradient: '',
              btnGlow: '',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-[#c6d7c4]/30',
            };

      case 'notebook':
        return isDarkEffective
          ? {
              gradientBorder: 'bg-[linear-gradient(90deg,#27272a,#71717a,#a1a1aa,#e4e4e7,#27272a)]',
              glowShadow: 'shadow-[0_0_8px_rgba(161,161,170,0.3)]',
              glowShadowHover: 'group-hover:shadow-[0_0_12px_rgba(228,228,231,0.4)]',
              pulseHaloBg: 'bg-zinc-600/20',
              btnInnerBg: 'bg-[#27272a] hover:bg-[#3f3f46]',
              textColor: 'text-white font-bold',
              dotColor: 'bg-zinc-200',
              dotPing: 'bg-zinc-400',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#94a3b8] to-[#cbd5e1]',
              btnGlow: 'shadow-[0_4px_16px_rgba(148,163,184,0.4)]',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'bg-gradient-to-r from-zinc-400/40 via-zinc-300/30 to-zinc-400/40',
            }
          : {
              gradientBorder: 'bg-transparent',
              glowShadow: 'shadow-xs',
              glowShadowHover: 'group-hover:shadow-sm',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-zinc-50/90 hover:bg-zinc-100/90 border border-zinc-200 hover:border-zinc-300 shadow-xs',
              textColor: 'text-zinc-800 font-bold',
              dotColor: 'bg-zinc-600',
              dotPing: 'bg-zinc-400',
              btnBg: '#ffffff',
              btnGradient: '',
              btnGlow: '',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-neutral-200/40',
            };

      case 'mocha':
        return isDarkEffective
          ? {
              gradientBorder: 'bg-[linear-gradient(90deg,#451a03,#d97706,#f59e0b,#fbbf24,#451a03)]',
              glowShadow: 'shadow-[0_0_8px_rgba(245,158,11,0.35)]',
              glowShadowHover: 'group-hover:shadow-[0_0_12px_rgba(251,191,36,0.45)]',
              pulseHaloBg: 'bg-amber-600/20',
              btnInnerBg: 'bg-[#451a03] hover:bg-[#5b2204]',
              textColor: 'text-white font-bold',
              dotColor: 'bg-amber-200',
              dotPing: 'bg-orange-400',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#fb923c] to-[#f59e0b]',
              btnGlow: 'shadow-[0_4px_16px_rgba(251,146,60,0.45)]',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'bg-gradient-to-r from-[#fb923c]/40 to-[#f59e0b]/40',
            }
          : {
              gradientBorder: 'bg-transparent',
              glowShadow: 'shadow-xs',
              glowShadowHover: 'group-hover:shadow-sm',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-amber-50/90 hover:bg-amber-100/90 border border-amber-200 hover:border-amber-300 shadow-xs',
              textColor: 'text-amber-900 font-bold',
              dotColor: 'bg-amber-600',
              dotPing: 'bg-amber-400',
              btnBg: '#faf8f5',
              btnGradient: '',
              btnGlow: '',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-[#ded5cb]/30',
            };

      case 'slate-haze':
        return isDarkEffective
          ? {
              gradientBorder: 'bg-[linear-gradient(90deg,#0c4a6e,#0284c7,#38bdf8,#7dd3fc,#0c4a6e)]',
              glowShadow: 'shadow-[0_0_8px_rgba(56,189,248,0.35)]',
              glowShadowHover: 'group-hover:shadow-[0_0_12px_rgba(125,211,252,0.45)]',
              pulseHaloBg: 'bg-sky-600/20',
              btnInnerBg: 'bg-[#0c4a6e] hover:bg-[#075985]',
              textColor: 'text-white font-bold',
              dotColor: 'bg-sky-200',
              dotPing: 'bg-blue-400',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#38bdf8] to-[#60a5fa]',
              btnGlow: 'shadow-[0_4px_16px_rgba(56,189,248,0.45)]',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'bg-gradient-to-r from-[#38bdf8]/40 to-[#60a5fa]/40',
            }
          : {
              gradientBorder: 'bg-transparent',
              glowShadow: 'shadow-xs',
              glowShadowHover: 'group-hover:shadow-sm',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-sky-50/90 hover:bg-sky-100/90 border border-sky-200 hover:border-sky-300 shadow-xs',
              textColor: 'text-sky-900 font-bold',
              dotColor: 'bg-sky-600',
              dotPing: 'bg-sky-400',
              btnBg: '#f8fafc',
              btnGradient: '',
              btnGlow: '',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-[#cde0ec]/30',
            };

      case 'amethyst-haze':
      default:
        return isDarkEffective
          ? {
              gradientBorder: 'bg-[linear-gradient(90deg,#2e1065,#a855f7,#ec4899,#06b6d4,#2e1065)]',
              glowShadow: 'shadow-[0_0_8px_rgba(168,85,247,0.35)]',
              glowShadowHover: 'group-hover:shadow-[0_0_12px_rgba(236,72,153,0.45)]',
              pulseHaloBg: 'bg-indigo-600/20',
              btnInnerBg: 'bg-[#2e1065] hover:bg-[#3b1580]',
              textColor: 'text-white font-bold',
              dotColor: 'bg-cyan-200',
              dotPing: 'bg-pink-400',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#c084fc] to-[#e879f9]',
              btnGlow: 'shadow-[0_4px_16px_rgba(192,132,252,0.45)]',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'bg-gradient-to-r from-[#c084fc]/40 to-[#e879f9]/40',
            }
          : {
              gradientBorder: 'bg-transparent',
              glowShadow: 'shadow-xs',
              glowShadowHover: 'group-hover:shadow-sm',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-purple-50/90 hover:bg-purple-100/90 border border-purple-200 hover:border-purple-300 shadow-xs',
              textColor: 'text-purple-800 font-bold',
              dotColor: 'bg-purple-500',
              dotPing: 'bg-purple-300',
              btnBg: '#faf8fc',
              btnGradient: '',
              btnGlow: '',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-[#dbd1e8]/30',
            };
    }
  }, [theme, isDarkEffective, isCosmic]);

  // Cấu hình giao diện vé máy bay / tàu hỏa (Boarding Pass Ticket) đồng bộ theo Theme và Chế độ Sáng / Tối
  const ticketTheme = useMemo(() => {
    if (isDarkEffective) {
      switch (theme) {
        case 'sage':
          return {
            outer: 'border-[#2d4734]/50 bg-gradient-to-br from-[#142318] via-[#0f1b13] to-[#0a130d] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
            inner: 'border-[#2d4734]/40 bg-white/[0.02] shadow-inner',
            divider: 'border-[#2d4734]/40',
            dashedDivider: 'border-[#43634b]/60',
            cutout: 'bg-[#0f1b13] border border-[#43634b]/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]',
            kicker: 'text-[#8cb391]',
            title: 'text-[#eaf2eb] hover:text-[#a3d4a9]',
            meta: 'text-[#9db6a1]',
            author: 'text-[#eaf2eb]',
            synopsis: 'text-[#b8cebc]',
            btnPrimary: 'border border-[#43634b]/60 bg-gradient-to-r from-[#2d4432] via-[#39563f] to-[#46694e] hover:from-[#344f3a] hover:to-[#507859] shadow-lg shadow-black/40 text-white font-bold',
            btnSecondary: 'border border-[#2d4734]/50 bg-white/[0.08] hover:bg-white/[0.16] text-[#cee0d1] shadow-xs',
            dotActive: 'bg-[#8cb391] shadow-xs',
            dotInactive: 'bg-white/15',
            barcode: 'bg-[#46694e]',
            coverBorder: 'border border-[#2d4734]/50 bg-[#0d1710]',
            borderHeroLine: 'border-[#3e6147]/50',
            fullBadge: 'border border-emerald-500/30 bg-emerald-500/25 text-emerald-200 font-black',
          };
        case 'mocha':
          return {
            outer: 'border-[#4f362a]/50 bg-gradient-to-br from-[#241913] via-[#1a120e] to-[#120b08] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
            inner: 'border-[#4f362a]/40 bg-white/[0.02] shadow-inner',
            divider: 'border-[#4f362a]/40',
            dashedDivider: 'border-[#6a493a]/60',
            cutout: 'bg-[#1a120e] border border-[#7a5543]/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]',
            kicker: 'text-[#d4a38c]',
            title: 'text-[#f5ece6] hover:text-[#e8b9a2]',
            meta: 'text-[#c2b0a2]',
            author: 'text-[#f5ece6]',
            synopsis: 'text-[#d6c7bc]',
            btnPrimary: 'border border-[#6a493a]/60 bg-gradient-to-r from-[#4d362b] via-[#5c4134] to-[#6d4d3d] hover:from-[#573d31] hover:to-[#7a5745] shadow-lg shadow-black/40 text-white font-bold',
            btnSecondary: 'border border-[#4f362a]/50 bg-white/[0.08] hover:bg-white/[0.16] text-[#e0d3c9] shadow-xs',
            dotActive: 'bg-[#d4a38c] shadow-xs',
            dotInactive: 'bg-white/15',
            barcode: 'bg-[#825c48]',
            coverBorder: 'border border-[#4f362a]/50 bg-[#17100b]',
            borderHeroLine: 'border-[#6a493a]/50',
            fullBadge: 'border border-amber-500/30 bg-amber-500/25 text-amber-200 font-black',
          };
        case 'slate-haze':
          return {
            outer: 'border-[#263c55]/50 bg-gradient-to-br from-[#142132] via-[#0d1624] to-[#080e18] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
            inner: 'border-[#263c55]/40 bg-white/[0.02] shadow-inner',
            divider: 'border-[#263c55]/40',
            dashedDivider: 'border-[#395677]/60',
            cutout: 'bg-[#0d1624] border border-[#456991]/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]',
            kicker: 'text-[#8ba0b5]',
            title: 'text-[#edf4fa] hover:text-[#b4d2ed]',
            meta: 'text-[#8ba0b5]',
            author: 'text-[#edf4fa]',
            synopsis: 'text-[#b9cddf]',
            btnPrimary: 'border border-[#395677]/60 bg-gradient-to-r from-[#2c435c] via-[#355170] to-[#406287] hover:from-[#324d69] hover:to-[#4a729c] shadow-lg shadow-black/40 text-white font-bold',
            btnSecondary: 'border border-[#263c55]/50 bg-white/[0.08] hover:bg-white/[0.16] text-[#cee0d1] shadow-xs',
            dotActive: 'bg-[#7bb0e0] shadow-xs',
            dotInactive: 'bg-white/15',
            barcode: 'bg-[#406287]',
            coverBorder: 'border border-[#263c55]/50 bg-[#0d1624]',
            borderHeroLine: 'border-[#395677]/50',
            fullBadge: 'border border-sky-500/30 bg-sky-500/25 text-sky-200 font-black',
          };
        case 'notebook':
          return {
            outer: 'border-neutral-700/50 bg-gradient-to-br from-[#222226] via-[#18181c] to-[#101013] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
            inner: 'border-neutral-700/40 bg-white/[0.02] shadow-inner',
            divider: 'border-neutral-700/40',
            dashedDivider: 'border-neutral-600/60',
            cutout: 'bg-[#18181c] border border-neutral-500/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]',
            kicker: 'text-neutral-400',
            title: 'text-neutral-100 hover:text-white',
            meta: 'text-neutral-400',
            author: 'text-neutral-200',
            synopsis: 'text-neutral-300',
            btnPrimary: 'border border-neutral-600/60 bg-gradient-to-r from-[#38383f] via-[#44444c] to-[#52525c] hover:from-[#404047] hover:to-[#5e5e69] shadow-lg shadow-black/40 text-white font-bold',
            btnSecondary: 'border border-neutral-700/50 bg-white/[0.08] hover:bg-white/[0.16] text-stone-200 shadow-xs',
            dotActive: 'bg-neutral-200 shadow-xs',
            dotInactive: 'bg-white/15',
            barcode: 'bg-[#52525c]',
            coverBorder: 'border border-neutral-700/50 bg-[#161619]',
            borderHeroLine: 'border-neutral-700/60',
            fullBadge: 'border border-zinc-600/40 bg-zinc-600/40 text-zinc-200 font-black',
          };
        case 'cosmic':
          return {
            outer: 'border-indigo-700/40 bg-gradient-to-br from-[#1d1648] via-[#120d30] to-[#09061c] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
            inner: 'border-indigo-700/30 bg-white/[0.02] shadow-inner',
            divider: 'border-indigo-700/30',
            dashedDivider: 'border-indigo-500/50',
            cutout: 'bg-[#120d30] border border-indigo-500/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]',
            kicker: 'text-indigo-300',
            title: 'text-neutral-100 hover:text-indigo-300',
            meta: 'text-indigo-300',
            author: 'text-neutral-100',
            synopsis: 'text-indigo-200/90',
            btnPrimary: 'border border-indigo-500/50 bg-gradient-to-r from-[#4d2d78] via-[#5e3793] to-[#7142b0] hover:from-[#573387] hover:to-[#7f4bc7] shadow-lg shadow-black/40 text-white font-bold',
            btnSecondary: 'border border-indigo-700/40 bg-white/[0.08] hover:bg-white/[0.16] text-indigo-200 shadow-xs',
            dotActive: 'bg-[#a78bfa] shadow-xs',
            dotInactive: 'bg-white/15',
            barcode: 'bg-[#7142b0]',
            coverBorder: 'border border-indigo-700/40 bg-[#120d30]',
            borderHeroLine: 'border-indigo-500/40',
            fullBadge: 'border border-indigo-500/30 bg-indigo-500/25 text-indigo-200 font-black',
          };
        case 'amethyst-haze':
        default:
          return {
            outer: 'border-[#4c3167]/50 bg-gradient-to-br from-[#1d1330] via-[#140b22] to-[#0c0615] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
            inner: 'border-[#4c3167]/40 bg-white/[0.02] shadow-inner',
            divider: 'border-[#4c3167]/40',
            dashedDivider: 'border-[#6e4694]/55',
            cutout: 'bg-[#140b22] border border-[#7f51ab]/65 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]',
            kicker: 'text-purple-300',
            title: 'text-neutral-100 hover:text-purple-300',
            meta: 'text-purple-300',
            author: 'text-neutral-100',
            synopsis: 'text-purple-200/90',
            btnPrimary: 'border border-[#6e4694]/50 bg-gradient-to-r from-[#452d5e] via-[#533671] to-[#634187] hover:from-[#4c3167] hover:to-[#704998] shadow-lg shadow-black/40 text-white font-bold',
            btnSecondary: 'border border-[#4c3167]/40 bg-white/[0.08] hover:bg-white/[0.16] text-purple-200 shadow-xs',
            dotActive: 'bg-[#a78bfa] shadow-xs',
            dotInactive: 'bg-white/15',
            barcode: 'bg-[#634187]',
            coverBorder: 'border border-[#4c3167]/40 bg-[#140b22]',
            borderHeroLine: 'border-[#6e4694]/45',
            fullBadge: 'border border-purple-500/30 bg-purple-500/25 text-purple-200 font-black',
          };
      }
    }

    // Light mode (ở chế độ sáng vẫn giữ nguyên)
    switch (theme) {
      case 'sage':
        return {
          outer: 'border-[#c8d8c6] bg-[#f0f4ef]/90 shadow-lg',
          inner: 'bg-white border-[#dce6d9] shadow-md',
          divider: 'border-stone-200',
          dashedDivider: 'border-stone-300',
          cutout: 'bg-[#e3ede1] border border-[#b2c6ad] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]',
          kicker: 'text-[#6b8268]',
          title: 'text-[#1c291e] hover:text-[#3e5b43]',
          meta: 'text-[#4d664a]',
          author: 'text-[#1c291e]',
          synopsis: 'text-[#394a3b]',
          btnPrimary: 'sage-light-btn font-bold !text-[#466244] hover:!text-[#274225]',
          btnSecondary: 'sage-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#466244] ring-1 ring-[#466244]/30 shadow-xs',
          dotInactive: 'bg-[#cad8c6]',
          barcode: 'bg-neutral-800',
          coverBorder: 'border-black/10 bg-white',
          borderHeroLine: 'border-stone-200/80',
          fullBadge: 'sage-light-novel-tag font-bold',
        };
      case 'mocha':
        return {
          outer: 'border-[#e4d9bc] bg-[#f8f4ee]/90 shadow-lg',
          inner: 'bg-[#fdfcf9] border-[#e8ddc2] shadow-md',
          divider: 'border-stone-200',
          dashedDivider: 'border-stone-300',
          cutout: 'bg-[#ede5d8] border border-[#d5c7ab] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]',
          kicker: 'text-[#a37764]',
          title: 'text-[#3a2a2a] hover:text-[#8c6150]',
          meta: 'text-[#8c7a6e]',
          author: 'text-[#3a2a2a]',
          synopsis: 'text-[#614b43]',
          btnPrimary: 'mocha-light-btn font-bold !text-[#7a6256] hover:!text-[#a37764]',
          btnSecondary: 'mocha-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#A37764] ring-1 ring-[#A37764]/30 shadow-xs',
          dotInactive: 'bg-[#e4d9bc]',
          barcode: 'bg-neutral-800',
          coverBorder: 'border-black/10 bg-white',
          borderHeroLine: 'border-stone-200/80',
          fullBadge: 'mocha-light-novel-tag font-bold',
        };
      case 'slate-haze':
        return {
          outer: 'border-[#c8d6e5] bg-[#f2f6fa]/90 shadow-lg',
          inner: 'bg-white border-[#d8e3ed] shadow-md',
          divider: 'border-stone-200',
          dashedDivider: 'border-stone-300',
          cutout: 'bg-[#e2ebf4] border border-[#b8c9dc] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]',
          kicker: 'text-[#5d7e9d]',
          title: 'text-[#192635] hover:text-[#3b5979]',
          meta: 'text-[#58738e]',
          author: 'text-[#192635]',
          synopsis: 'text-[#38516b]',
          btnPrimary: 'frost-light-btn font-bold !text-[#526982] hover:!text-[#0284c7]',
          btnSecondary: 'frost-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#0284c7] ring-1 ring-[#0284c7]/30 shadow-xs',
          dotInactive: 'bg-[#c8d6e5]',
          barcode: 'bg-neutral-800',
          coverBorder: 'border-black/10 bg-white',
          borderHeroLine: 'border-stone-200/80',
          fullBadge: 'frost-light-novel-tag font-bold',
        };
      case 'notebook':
        return {
          outer: 'border-stone-200 bg-stone-100/70 shadow-lg',
          inner: 'bg-white border-stone-200/80 shadow-md',
          divider: 'border-stone-200',
          dashedDivider: 'border-stone-300',
          cutout: 'bg-[#e8e6e3] border border-stone-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]',
          kicker: 'text-neutral-400',
          title: 'text-neutral-900 hover:text-rose-600',
          meta: 'text-neutral-500',
          author: 'text-neutral-800',
          synopsis: 'text-neutral-600',
          btnPrimary: 'notebook-light-btn font-bold !text-[#525252] hover:!text-[#171717]',
          btnSecondary: 'notebook-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#262626] ring-1 ring-black/20 shadow-xs',
          dotInactive: 'bg-neutral-300',
          barcode: 'bg-neutral-800',
          coverBorder: 'border-black/10 bg-white',
          borderHeroLine: 'border-stone-200/80',
          fullBadge: 'notebook-light-novel-tag font-bold',
        };
      case 'amethyst-haze':
      default:
        return {
          outer: 'border-[#ded8ea] bg-[#f7f3fb]/90 shadow-lg',
          inner: 'bg-white border-[#e9e3f3] shadow-md',
          divider: 'border-[#ded8ea]',
          dashedDivider: 'border-stone-300',
          cutout: 'bg-[#ede8f4] border border-[#cbbfe0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]',
          kicker: 'text-neutral-400 dark:text-neutral-500',
          title: 'text-stone-900 dark:text-stone-100 hover:text-purple-700 dark:hover:text-purple-400',
          meta: 'text-neutral-600 dark:text-neutral-400',
          author: 'text-stone-900 dark:text-stone-100 font-semibold',
          synopsis: 'text-stone-700 dark:text-stone-300',
          btnPrimary: 'amethyst-light-btn font-bold !text-[#6b5887] hover:!text-[#7e58a6]',
          btnSecondary: 'amethyst-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#6b5f82] ring-1 ring-[#6b5f82]/30 shadow-xs',
          dotInactive: 'bg-stone-300 dark:bg-stone-700',
          barcode: 'bg-neutral-800',
          coverBorder: 'border-black/10 bg-white',
          borderHeroLine: 'border-stone-200/80',
          fullBadge: 'amethyst-light-novel-tag font-bold',
        };
    }
  }, [theme, isDarkEffective]);

  // Màu sắc cho 3 nút chuyển trang & đổi bìa của mục "TRUYỆN VỪA MỚI ĐĂNG" đồng bộ theo theme
  const getPolaroidNavBtnClass = (th: NovelThemeId, isDark: boolean) => {
    if (isDark) {
      switch (th) {
        case 'slate-haze':
          return 'bg-[#1e2f42] text-[#dce7f0] border border-[#4d6a85]/50 shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:bg-[#283e56] hover:text-white hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
        case 'sage':
          return 'bg-[#1e3325] text-[#eaf2eb] border border-[#4d6f53]/55 shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:bg-[#274230] hover:text-white hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
        case 'mocha':
          return 'bg-[#2d211b] text-[#f5ece6] border border-[#8c6150]/55 shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:bg-[#3d2c24] hover:text-white hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
        case 'notebook':
          return 'bg-[#28282e] text-zinc-100 border border-zinc-500/50 shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:bg-[#34343d] hover:text-white hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
        case 'cosmic':
          return 'bg-[#251b42] text-indigo-100 border border-indigo-500/50 shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:bg-[#322459] hover:text-white hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
        case 'amethyst-haze':
        default:
          return 'bg-[#2a1e3b] text-[#ded6e8] border border-[#6e5585]/50 shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:bg-[#37274e] hover:text-white hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
      }
    }
    switch (th) {
      case 'slate-haze':
        return 'frost-light-btn hover:!text-[#0284c7]';
      case 'sage':
        return 'sage-light-btn hover:!text-[#274225]';
      case 'mocha':
        return 'mocha-light-btn hover:!text-[#a37764]';
      case 'notebook':
        return 'notebook-light-btn hover:!text-[#171717]';
      case 'amethyst-haze':
      default:
        return 'amethyst-light-btn hover:!text-[#7e58a6]';
    }
  };

  // Kiểu nút Neumorphism + Glassmorphism cho chế độ sáng theo phong cách theme Frost áp dụng cho tất cả các theme
  const getLightModeNeumorphicBtnStyles = (th: NovelThemeId) => {
    switch (th) {
      case 'slate-haze':
        return {
          btn: 'frost-light-btn',
          text: 'text-[#526982] hover:text-[#0284c7]',
          expand: 'frost-light-btn !text-[#526982] hover:!text-[#0284c7]',
        };
      case 'sage':
        return {
          btn: 'sage-light-btn',
          text: 'text-[#466244] hover:text-[#274225]',
          expand: 'sage-light-btn !text-[#466244] hover:!text-[#274225]',
        };
      case 'mocha':
        return {
          btn: 'mocha-light-btn',
          text: 'text-[#7a6256] hover:text-[#a37764]',
          expand: 'mocha-light-btn !text-[#7a6256] hover:!text-[#a37764]',
        };
      case 'notebook':
        return {
          btn: 'notebook-light-btn',
          text: 'text-[#525252] hover:text-[#171717]',
          expand: 'notebook-light-btn !text-[#525252] hover:!text-[#171717]',
        };
      case 'amethyst-haze':
      case 'cosmic':
      default:
        return {
          btn: 'amethyst-light-btn',
          text: 'text-[#6b5887] hover:text-[#7e58a6]',
          expand: 'amethyst-light-btn !text-[#6b5887] hover:!text-[#7e58a6]',
        };
    }
  };

  // Cấu hình đổ màu khối mềm mại không viền (Filled Block) cho chế độ tối
  const getDarkModeFilledBlockStyles = (th: NovelThemeId) => {
    switch (th) {
      case 'sage':
        return {
          cardBg: 'bg-gradient-to-br from-[#142318] via-[#0f1b13] to-[#0a130d] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
          itemBg: 'bg-white/[0.04] hover:bg-white/[0.08]',
          iconBg: 'bg-emerald-500/20 text-emerald-300',
          badgeBg: 'bg-emerald-500/20 text-emerald-300',
          title: 'text-[#eaf2eb] group-hover:text-emerald-300',
          subtitle: 'text-emerald-400',
          chevron: 'text-emerald-300 bg-white/[0.05] hover:bg-white/[0.1]',
        };
      case 'mocha':
        return {
          cardBg: 'bg-gradient-to-br from-[#241913] via-[#1a120e] to-[#120b08] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
          itemBg: 'bg-white/[0.04] hover:bg-white/[0.08]',
          iconBg: 'bg-amber-500/20 text-amber-300',
          badgeBg: 'bg-amber-500/20 text-amber-300',
          title: 'text-[#f5ece6] group-hover:text-amber-300',
          subtitle: 'text-amber-400',
          chevron: 'text-amber-300 bg-white/[0.05] hover:bg-white/[0.1]',
        };
      case 'amethyst-haze':
        return {
          cardBg: 'bg-gradient-to-br from-[#1d1330] via-[#140b22] to-[#0c0615] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
          itemBg: 'bg-white/[0.04] hover:bg-white/[0.08]',
          iconBg: 'bg-purple-500/20 text-purple-300',
          badgeBg: 'bg-purple-500/20 text-purple-300',
          title: 'text-purple-100 group-hover:text-purple-300',
          subtitle: 'text-purple-300',
          chevron: 'text-purple-300 bg-white/[0.05] hover:bg-white/[0.1]',
        };
      case 'cosmic':
        return {
          cardBg: 'bg-gradient-to-br from-[#1d1648] via-[#120d30] to-[#09061c] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
          itemBg: 'bg-white/[0.04] hover:bg-white/[0.08]',
          iconBg: 'bg-indigo-500/20 text-indigo-300',
          badgeBg: 'bg-indigo-500/20 text-indigo-300',
          title: 'text-purple-100 group-hover:text-indigo-300',
          subtitle: 'text-pink-400',
          chevron: 'text-indigo-300 bg-white/[0.05] hover:bg-white/[0.1]',
        };
      case 'notebook':
        return {
          cardBg: 'bg-gradient-to-br from-[#222226] via-[#18181c] to-[#101013] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
          itemBg: 'bg-white/[0.04] hover:bg-white/[0.08]',
          iconBg: 'bg-zinc-700/60 text-zinc-200',
          badgeBg: 'bg-zinc-700/50 text-zinc-200',
          title: 'text-zinc-100 group-hover:text-white',
          subtitle: 'text-zinc-400',
          chevron: 'text-zinc-300 bg-white/[0.05] hover:bg-white/[0.1]',
        };
      case 'slate-haze':
      default:
        return {
          cardBg: 'bg-gradient-to-br from-[#142132] via-[#0d1624] to-[#080e18] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
          itemBg: 'bg-white/[0.04] hover:bg-white/[0.08]',
          iconBg: 'bg-sky-500/20 text-sky-300',
          badgeBg: 'bg-sky-500/20 text-sky-300',
          title: 'text-[#edf4fa] group-hover:text-sky-300',
          subtitle: 'text-sky-400',
          chevron: 'text-sky-300 bg-white/[0.05] hover:bg-white/[0.1]',
        };
    }
  };

  // Cấu hình phong cách cho nút "XEM THÊM / THU GỌN" với cơ chế vật lý 3D chân thực (.hv-11__btn--stack)
  const expandButtonStyles = useMemo(() => {
    if (isCosmic) {
      return {
        btnBg: '#4e287e',
        btnBorder: 'border-0 border-transparent',
        textColor: 'text-white',
        shadowColor: '#240d42',
      };
    }

    if (isDarkEffective) {
      switch (theme) {
        case 'sage':
          return {
            btnBg: '#3b5c43',
            btnBorder: 'border-0 border-transparent',
            textColor: 'text-white',
            shadowColor: '#1e3324',
          };
        case 'mocha':
          return {
            btnBg: '#5c3e30',
            btnBorder: 'border-0 border-transparent',
            textColor: 'text-white',
            shadowColor: '#2e1c14',
          };
        case 'amethyst-haze':
          return {
            btnBg: '#4e287e',
            btnBorder: 'border-0 border-transparent',
            textColor: 'text-white',
            shadowColor: '#2b1c3d',
          };
        case 'notebook':
          return {
            btnBg: '#44444c',
            btnBorder: 'border-0 border-transparent',
            textColor: 'text-white',
            shadowColor: '#202026',
          };
        case 'slate-haze':
        default:
          return {
            btnBg: '#344e68',
            btnBorder: 'border-0 border-transparent',
            textColor: 'text-white',
            shadowColor: '#1c2d3d',
          };
      }
    } else {
      // Light mode: trung tính, dịu nhẹ, thanh lịch hài hòa với theme
      switch (theme) {
        case 'sage':
          return {
            btnBg: '#f6f9f5',
            btnBorder: 'border-[#c8d8c6] hover:border-[#b0c6ad]',
            textColor: 'text-[#2e402c]',
            shadowColor: '#b4c7b1',
          };
        case 'notebook':
          return {
            btnBg: '#ffffff',
            btnBorder: 'border-zinc-200 hover:border-zinc-300',
            textColor: 'text-zinc-800',
            shadowColor: '#e4e4e7',
          };
        case 'mocha':
          return {
            btnBg: '#f8f4f0',
            btnBorder: 'border-[#e0d3c7] hover:border-[#cdbdae]',
            textColor: 'text-[#48372d]',
            shadowColor: '#c9b7a7',
          };
        case 'amethyst-haze':
          return {
            btnBg: '#f7f5fa',
            btnBorder: 'border-[#dcd4e8] hover:border-[#c8bdd8]',
            textColor: 'text-[#423356]',
            shadowColor: '#c3b6d3',
          };
        case 'slate-haze':
        default:
          return {
            btnBg: '#f8fafc',
            btnBorder: 'border-slate-300 hover:border-slate-400',
            textColor: 'text-slate-700',
            shadowColor: '#cbd5e1',
          };
      }
    }
  }, [theme, isDarkEffective, isCosmic]);
  const currentThemeOption = NOVEL_THEME_OPTIONS.find((t) => t.id === theme) || NOVEL_THEME_OPTIONS[0];
  const completedCategoryTabsStyles = useMemo(
    () => getCompletedCategoryTabsStyles(theme, isDarkEffective, selectedCategory),
    [theme, isDarkEffective, selectedCategory]
  );
  // All novel titles use Source Serif 4 typography
  const themeFontHeading = 'font-source-serif';

  // Auto-hide header when scrolling down, reveal when scrolling up
  const isHeaderVisible = useHeaderScroll({ threshold: 40, delta: 6 });
  const shouldShowHeader = isHeaderVisible || isThemeMenuOpen;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${tStyles.pageBg} relative`}>
      {/* Trang trí nền: Cosmic hiển thị sao & khí quyển; các theme tối hiển thị hiệu ứng nền chọn lọc làm nổi bật Glassmorphism */}
      <CosmicStarsBackground
        theme={theme}
        isDarkMode={isDarkEffective}
        darkBgOption={darkBgOption}
        bgSeed={bgSeed}
        purpleBgEffectsEnabled={purpleBgEffectsEnabled}
      />

      {/* Novel Platform Top Bar */}
      <header
        className={`sticky top-0 z-40 glass-header border-b px-4 sm:px-8 py-3.5 transition-[transform,opacity] duration-300 transform ${
          shouldShowHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        } ${tStyles.headerBg} ${tStyles.headerBorder}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Portal back to Portfolio */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group cursor-pointer text-left focus:outline-hidden"
              title="Niên Thời - Về đầu trang"
            >
              <WebLogo
                theme={theme}
                isDarkMode={isDarkEffective}
                size="md"
              />
              <div>
                <span className={`font-brand-title text-lg sm:text-xl tracking-tight leading-none transition-colors ${tStyles.logoTextHover}`}>
                  Niên Thời
                </span>
              </div>
            </button>
          </div>

          {/* Center Search Input */}
          <div ref={searchContainerRef} className="flex-1 max-w-md hidden md:block relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <button
                type="submit"
                className={`absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 rounded-full hover:opacity-100 ${tStyles.searchIcon}`}
                title="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(e);
                  }
                }}
                placeholder="Tìm kiếm tiểu thuyết, tác giả, thể loại..."
                className={`w-full pl-9 pr-8 py-2 rounded-full border text-xs font-sans transition-colors focus:outline-hidden ${tStyles.input}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold hover:opacity-100 cursor-pointer ${tStyles.searchIcon}`}
                  title="Xóa tìm kiếm"
                >
                  ×
                </button>
              )}
            </form>

            {/* Quick Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl border z-50 overflow-hidden backdrop-blur-xl transition-all ${
                searchDropdownStyles.container
              }`}>
                <div className={`px-3.5 py-2 border-b flex items-center justify-between text-[11px] font-medium opacity-75 ${searchDropdownStyles.header}`}>
                  <span>Gợi ý ({searchSuggestions.length})</span>
                  <span>Nhấn Enter để tìm</span>
                </div>
                {searchSuggestions.length === 0 ? (
                  <div className="p-4 text-center text-xs opacity-75">
                    Không tìm thấy truyện nào khớp với "{searchQuery}"
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto py-1">
                    {searchSuggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setIsSearchFocused(false);
                          onSelectNovel(item);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors ${
                          searchDropdownStyles.itemHover
                        }`}
                      >
                        <img
                          src={getDirectImageUrl(item.coverImage, item.id || item.title)}
                          alt={item.title}
                          onError={(e) => handleCoverImageError(e, item.id || item.title)}
                          className="w-8 h-11 rounded object-cover shrink-0 border border-black/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className={`text-xs font-bold truncate ${searchDropdownStyles.titleText}`}>{item.title}</h5>
                          <p className={`text-[11px] opacity-75 truncate ${searchDropdownStyles.subText}`}>{item.author.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] opacity-70">
                            <span>{item.totalChaptersCount || item.chapters.length} chương</span>
                            <span>•</span>
                            <span className={`font-semibold ${searchDropdownStyles.badge}`}>Hoàn thành</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className={`w-full p-2.5 text-center text-xs font-bold border-t cursor-pointer transition-colors ${
                        searchDropdownStyles.viewAllBtn
                      }`}
                    >
                      Xem tất cả kết quả cho "{searchQuery}" →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons & Theme Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Theme Selector Popover (5 Themes) - Tích hợp nút toggle chế độ sáng/tối vào trong bảng màu */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${tStyles.themeSelectorBtn}`}
                title="Thay đổi giao diện màu sắc & chế độ sáng tối"
                aria-label="Thay đổi giao diện màu sắc & chế độ sáng tối"
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{currentThemeOption.name}</span>
              </button>

              {isThemeMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-2xl p-2.5 shadow-2xl border z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isDarkEffective
                      ? 'bg-[#181a20] border-zinc-700 text-zinc-100 shadow-[0_10px_35px_rgba(0,0,0,0.6)]'
                      : 'bg-white border-zinc-200 text-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.15)]'
                  }`}
                >
                  <div className="px-2 py-1 border-b border-zinc-500/20 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Màu Giao Diện</span>
                    <span className="text-[9px] font-normal normal-case opacity-70">5 Gam Màu</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {NOVEL_THEME_OPTIONS.map((opt) => {
                      const isSelected = theme === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setTheme(opt.id);
                            safeStorage.setItem('cosmo_novel_theme', opt.id);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                            isSelected
                              ? isDarkEffective
                                ? 'bg-zinc-800 text-white font-bold'
                                : 'bg-zinc-100 text-zinc-900 font-bold ring-1 ring-zinc-300'
                              : isDarkEffective
                              ? 'hover:bg-zinc-800/60 text-zinc-300'
                              : 'hover:bg-zinc-50 text-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex items-center -space-x-1 shrink-0">
                              {opt.dots.map((d, i) => (
                                <span
                                  key={i}
                                  className="w-3 h-3 rounded-full border border-black/20 shadow-xs"
                                  style={{ backgroundColor: d }}
                                />
                              ))}
                            </div>
                            <div className="font-semibold text-[11px] sm:text-xs">
                              <span>{opt.name}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tắt/bật Hiệu ứng nền của chế độ tối theme Purple (Thay nút toggle bằng Bật/Tắt) */}
                  {(theme === 'amethyst-haze' || theme === 'cosmic') && isDarkEffective && (
                    <div className="mt-1.5 pt-1.5 border-t border-zinc-500/20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePurpleBgEffects();
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                          isDarkEffective
                            ? 'hover:bg-zinc-800/60 text-zinc-200'
                            : 'hover:bg-zinc-100 text-zinc-800'
                        }`}
                        title={purpleBgEffectsEnabled ? 'Nhấn để tắt hiệu ứng nền' : 'Nhấn để bật hiệu ứng nền'}
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-[11px] sm:text-xs">Hiệu ứng nền</span>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all select-none ${
                            purpleBgEffectsEnabled
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {purpleBgEffectsEnabled ? 'Bật' : 'Tắt'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* NÚT TOGGLE CHUYỂN CHẾ ĐỘ TỐI Ở DƯỚI CÙNG (Không nền hồng bao bọc, không icon minh họa, không dòng nền tối dịu mắt) */}
                  <div className="mt-2 pt-2 border-t border-zinc-500/20 flex items-center justify-between px-2 py-1">
                    <span className="text-xs font-semibold select-none">
                      Chế độ tối
                    </span>
                    <ClayThemeToggle
                      id="clay-toggle-home"
                      isOn={isDarkEffective}
                      onToggle={toggleDarkMode}
                      theme={theme}
                      title={isDarkEffective ? 'Gạt để chuyển sang chế độ sáng' : 'Gạt để chuyển sang chế độ tối'}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Admin Login / Account Button */}
            <button
              id="btn-admin-auth"
              onClick={onOpenAdminAuth}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                isAdmin
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                  : tStyles.themeSelectorBtn
              }`}
              title={isAdmin ? `Quản trị viên: ${currentUser?.email}` : 'Đăng nhập tài khoản quản trị'}
            >
              {isAdmin ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Shield className="w-3.5 h-3.5 opacity-70 shrink-0" />
              )}
              <span className="hidden sm:inline">{isAdmin ? 'Admin' : 'Quản Trị'}</span>
            </button>

            {/* Publish Novel Button (Chỉ hiển thị khi đã đăng nhập Admin) */}
            {isAdmin && (
              <button
                id="btn-create-novel-admin"
                onClick={() => {
                  onOpenCreateFirestoreTruyen?.();
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${tStyles.buttonPrimary}`}
                title="Tạo truyện mới lưu vào Firestore"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Thêm Truyện Mới</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {/* Mobile Search Bar */}
        <div ref={mobileSearchContainerRef} className="px-4 py-2 md:hidden relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <button
              type="submit"
              className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 cursor-pointer ${tStyles.searchIcon}`}
              title="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(e);
                }
              }}
              placeholder="Tìm kiếm tiểu thuyết, tác giả, thể loại..."
              className={`w-full pl-9 pr-8 py-2 rounded-xl border text-xs font-sans focus:outline-hidden ${tStyles.input}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(false);
                }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold hover:opacity-100 cursor-pointer ${tStyles.searchIcon}`}
                title="Xóa tìm kiếm"
              >
                ×
              </button>
            )}
          </form>

          {/* Quick Suggestions Dropdown on Mobile */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className={`absolute left-4 right-4 top-full mt-1.5 rounded-2xl border z-50 overflow-hidden backdrop-blur-xl transition-all ${
              searchDropdownStyles.container
            }`}>
              <div className={`px-3.5 py-2 border-b flex items-center justify-between text-[11px] font-medium opacity-75 ${searchDropdownStyles.header}`}>
                <span>Gợi ý ({searchSuggestions.length})</span>
                <span>Bấm Enter để xem</span>
              </div>
              {searchSuggestions.length === 0 ? (
                <div className="p-4 text-center text-xs opacity-75">
                  Không tìm thấy truyện nào khớp với "{searchQuery}"
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto py-1">
                  {searchSuggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setIsSearchFocused(false);
                        onSelectNovel(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors ${
                        searchDropdownStyles.itemHover
                      }`}
                    >
                      <img
                        src={getDirectImageUrl(item.coverImage, item.id || item.title)}
                        alt={item.title}
                        onError={(e) => handleCoverImageError(e, item.id || item.title)}
                        className="w-8 h-11 rounded object-cover shrink-0 border border-black/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className={`text-xs font-bold truncate ${searchDropdownStyles.titleText}`}>{item.title}</h5>
                        <p className={`text-[11px] opacity-75 truncate ${searchDropdownStyles.subText}`}>{item.author.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] opacity-70">
                          <span>{item.totalChaptersCount || item.chapters.length} chương</span>
                          <span>•</span>
                          <span className={`font-semibold ${searchDropdownStyles.badge}`}>Hoàn thành</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className={`w-full p-2.5 text-center text-xs font-bold border-t cursor-pointer transition-colors ${
                      searchDropdownStyles.viewAllBtn
                    }`}
                  >
                    Xem tất cả kết quả cho "{searchQuery}" →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      {/* ========================================================================= */}
      {/* HERO FEATURED BANNER - BOARDING PASS / TICKET STYLE (THEME ADAPTIVE)       */}
      {/* ========================================================================= */}
      {currentHeroNovel && (
        <section className="relative pt-4 sm:pt-6 pb-8 sm:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Nút GIỚI THIỆU VỀ TRANG WEB nằm trên mục truyện nổi bật */}
          <div className="mb-4 sm:mb-5 pt-1 pb-2 flex items-center justify-between">
            {!isDarkEffective ? (
              /* CHẾ ĐỘ SÁNG: MÀU SẮC VÀ HIỆU ỨNG GIỐNG KIỂU TAGS TRONG TIỂU THUYẾT ĐÃ HOÀN */
              <button
                id="btn-intro-about-website"
                onClick={() => {
                  cosmicAudio.playChime('sparkle');
                  if (onOpenAboutView) {
                    onOpenAboutView();
                  } else if (onOpenLightIntro) {
                    onOpenLightIntro();
                  } else {
                    onBackToPortfolio();
                  }
                }}
                className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wide cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 select-none ${getLightTagButtonClass(theme)}`}
                title="Khám phá giới thiệu về trang web - Dư Thủ Ký Visual Journal"
              >
                {/* Sóng radar phát xung */}
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping-smooth absolute inline-flex h-full w-full rounded-full opacity-60 bg-current" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                </span>
                <span className="font-bold tracking-wide">
                  GIỚI THIỆU VỀ TRANG WEB
                </span>
              </button>
            ) : (
              <div className="relative inline-flex items-center group">
                {/* 1. Lớp đệm hào quang chuyển động (Motion Halo Cushion) */}
                <span
                  className={`absolute -inset-0.5 rounded-full pointer-events-none animate-halo-cushion transition-all duration-300 ${introButtonStyles.pulseHaloBg}`}
                />

                {/* 2. Khung viền chuyển sắc & đổ bóng */}
                <div
                  className={`relative p-[1px] rounded-full overflow-hidden animate-gradient-flow transition-all duration-300 ${introButtonStyles.gradientBorder} ${introButtonStyles.glowShadow} ${introButtonStyles.glowShadowHover}`}
                >
                  {/* 3. Thẻ button chính */}
                  <button
                    id="btn-intro-about-website"
                    onClick={() => {
                      cosmicAudio.playChime('sparkle');
                      if (onOpenAboutView) {
                        onOpenAboutView();
                      } else if (onOpenLightIntro) {
                        onOpenLightIntro();
                      } else {
                        onBackToPortfolio();
                      }
                    }}
                    className={`relative z-10 flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer active:scale-95 overflow-hidden select-none ${introButtonStyles.btnInnerBg} ${introButtonStyles.textColor}`}
                    title="Khám phá giới thiệu về trang web - Dư Thủ Ký Visual Journal"
                  >
                    {/* 4. Hiệu ứng vệt sáng lướt ngang (Soft Shimmer Sweep) */}
                    <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none z-20">
                      <span className="absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] animate-shimmer-sweep" />
                    </span>

                    {/* 5. Chấm tròn phát tín hiệu (Live Ping Dot - 2 lớp) */}
                    <span className="relative flex h-2.5 w-2.5 shrink-0 z-30">
                      <span
                        className={`animate-ping-smooth absolute inline-flex h-full w-full rounded-full opacity-75 ${introButtonStyles.dotPing}`}
                      />
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 shadow-xs ${introButtonStyles.dotColor}`} />
                    </span>

                    {/* 6. Tiêu đề nút */}
                    <span className="relative z-30 font-bold tracking-wide">
                      GIỚI THIỆU VỀ TRANG WEB
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* KHUNG BAO NGOÀI PHONG CÁCH VÉ LÊN MÁY BAY / TÀU HỎA */}
          <div className={`relative p-1.5 sm:p-2.5 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${ticketTheme.outer}`}>
            
            {/* KHỐI THẺ CHÍNH (Desktop: 2 cột ngang, Mobile: Xếp dọc ảnh trên thông tin dưới) */}
            <div className={`relative rounded-xl sm:rounded-2xl border overflow-hidden flex flex-col md:flex-row items-stretch transition-all duration-300 ${ticketTheme.inner}`}>
              
              {/* ================================================================= */}
              {/* CỘT TRÁI (Desktop) / PHẦN TRÊN (Mobile): BÌA TRUYỆN + NÚT SLIDER */}
              {/* ================================================================= */}
              <div className="order-1 md:w-[280px] lg:w-[320px] xl:w-[350px] shrink-0 p-3.5 sm:p-4 md:p-5 flex flex-col items-center justify-center bg-black/[0.02] dark:bg-white/[0.02] relative">
                
                {/* Khung Bìa Truyện */}
                <div
                  onClick={() => onSelectNovel(currentHeroNovel)}
                  className={`group relative cursor-pointer w-full aspect-square sm:aspect-4/3 md:aspect-square rounded-lg overflow-hidden border p-1 shadow-xs transition-colors duration-300 ${ticketTheme.coverBorder}`}
                >
                  <div className="relative w-full h-full overflow-hidden rounded">
                    <img
                      src={getDirectImageUrl(currentHeroNovel.coverImage, currentHeroNovel.id || currentHeroNovel.title)}
                      onError={(e) => handleCoverImageError(e, currentHeroNovel.id || currentHeroNovel.title)}
                      alt={currentHeroNovel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Badge FULL góc trên bên trái bìa đồng bộ màu theo theme */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-black tracking-wider uppercase shadow-xs ${ticketTheme.fullBadge}`}>
                        FULL
                      </span>
                    </div>

                    {/* Lớp phủ Gradient tối dưới chân ảnh */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                  </div>
                </div>

                {/* Cụm điều khiển Slider (Nút Lùi + Chấm tròn Dots + Nút Tiến) */}
                <div className="flex items-center justify-between w-full mt-3 px-1">
                  {/* Nút Prev */}
                  <button
                    onClick={handlePrevFeatured}
                    aria-label="Truyện trước đó"
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${ticketTheme.btnSecondary}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Chấm tròn chỉ số (Dots) */}
                  <div className="flex items-center gap-1.5">
                    {featuredNovels.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setFeaturedIndex(idx)}
                        className={`transition-all duration-300 cursor-pointer rounded-full ${
                          featuredIndex === idx
                            ? `w-5 h-1.5 ${ticketTheme.dotActive}`
                            : `w-1.5 h-1.5 ${ticketTheme.dotInactive}`
                        }`}
                        aria-label={`Chuyển tới truyện ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Nút Next */}
                  <button
                    onClick={handleNextFeatured}
                    aria-label="Truyện tiếp theo"
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${ticketTheme.btnSecondary}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* VẾT CẮT KHUYẾT VÉ TRÊN DESKTOP (2 hình bán nguyệt trên - dưới có đường viền) */}
                <div className={`hidden md:block absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full z-30 pointer-events-none ${ticketTheme.cutout}`} />
                <div className={`hidden md:block absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full z-30 pointer-events-none ${ticketTheme.cutout}`} />
              </div>

              {/* ================================================================= */}
              {/* ĐƯỜNG PHÂN CÁCH VÉ: ĐƯỜNG NÉT ĐỨT Ở GIỮA HAI HÌNH BÁN NGUYỆT      */}
              {/* ================================================================= */}
              <div className="relative order-1 md:order-2 flex items-center justify-center">
                {/* Đường nét đứt dọc desktop ở giữa hai hình bán nguyệt */}
                <div className={`hidden md:block h-full w-0 border-r-2 border-dashed ${ticketTheme.dashedDivider}`} />
                
                {/* Đường nét đứt ngang mobile kèm vết cắt 2 bên */}
                <div className={`md:hidden relative w-full border-b-2 border-dashed ${ticketTheme.dashedDivider} my-0`}>
                  <div className={`absolute -left-3.5 -top-3 w-6 h-6 rounded-full z-30 pointer-events-none ${ticketTheme.cutout}`} />
                  <div className={`absolute -right-3.5 -top-3 w-6 h-6 rounded-full z-30 pointer-events-none ${ticketTheme.cutout}`} />
                </div>
              </div>

              {/* ================================================================= */}
              {/* CỘT PHẢI: THÔNG TIN CHI TIẾT VÉ, TÁC GIẢ, NÚT BẤM VÀ MÃ VẠCH     */}
              {/* ================================================================= */}
              <div className="order-2 flex-1 p-4 sm:p-6 md:p-7 lg:p-8 flex flex-col justify-between space-y-4 bg-transparent">
                
                <div className="space-y-3.5">
                  {/* Dòng Kicker phong cách Stories Ticket */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-mono text-xs sm:text-[13px] tracking-[0.22em] uppercase font-medium ${ticketTheme.kicker}`}>
                      STORIES · M-05-I6W
                    </span>
                    <span className={`text-[11px] font-mono ${ticketTheme.kicker}`}>
                      GATE 01
                    </span>
                  </div>

                  {/* Tên truyện chữ nghiêng đậm to rõ */}
                  <h1
                    onClick={() => onSelectNovel(currentHeroNovel)}
                    className={`font-bold italic text-2xl sm:text-3xl md:text-3xl lg:text-[34px] tracking-tight leading-snug cursor-pointer transition-colors ${ticketTheme.title}`}
                  >
                    {currentHeroNovel.title}
                  </h1>

                  {/* Dòng metadata 1: Tác giả · Số chương */}
                  <div className={`text-xs sm:text-sm font-medium tracking-wide ${ticketTheme.meta}`}>
                    <span className={`font-semibold ${ticketTheme.author}`}>
                      {typeof currentHeroNovel.author === 'string' ? currentHeroNovel.author : currentHeroNovel.author?.name || 'Hải Kinh Lạc'}
                    </span>
                    <span className="mx-2">·</span>
                    <span>{currentHeroNovel.totalChaptersCount || currentHeroNovel.totalChapters || currentHeroNovel.chapters?.length || 0} Chương</span>
                  </div>

                  {/* Dòng metadata 2: Nhóm dịch / Tags */}
                  <div className={`flex items-center gap-1.5 text-xs sm:text-sm ${ticketTheme.meta}`}>
                    <Users className="w-4 h-4 opacity-75 shrink-0" />
                    <span>
                      {currentHeroNovel.translator ? `Editor: ${currentHeroNovel.translator}` : 'Editor: Jouriee65'}
                      <span className="mx-1.5">·</span>
                      {currentHeroNovel.tags && currentHeroNovel.tags.length > 0
                        ? currentHeroNovel.tags.slice(0, 3).join(' · ')
                        : 'Ngôn Tình · Hiện Đại · Ngọt Sủng'}
                    </span>
                  </div>

                  {/* Tóm tắt nội dung (giới hạn 2 dòng) */}
                  <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed max-w-2xl pt-1 ${ticketTheme.synopsis}`}>
                    {currentHeroNovel.synopsis}
                  </p>
                </div>

                {/* DÒNG CUỐI: NÚT CTA ĐỌC TRUYỆN NGAY + MÃ VẠCH (HOÀN TOÀN KHÔNG CÓ NỀN) */}
                <div className={`pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t ${ticketTheme.borderHeroLine} bg-transparent`}>
                  
                  <div className="flex flex-wrap items-center gap-3.5 bg-transparent">
                    {/* Nút bấm chính: Đọc Truyện Ngay (Đồng bộ màu sắc với nút Tất cả) */}
                    <button
                      type="button"
                      onClick={() => onSelectNovel(currentHeroNovel)}
                      className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 select-none active:scale-95 ${ticketTheme.btnPrimary}`}
                    >
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span>Đọc Truyện Ngay</span>
                    </button>
                  </div>

                  {/* MÃ VẠCH BARCODE VỚI CÁC ĐƯỜNG CÓ ĐỘ RỘNG BẰNG NHAU (KHÔNG NỀN) */}
                  <div className="hidden sm:flex items-center gap-2 pr-1 select-none bg-transparent">
                    <div className="flex flex-col gap-[2.5px] items-center bg-transparent">
                      {[
                        'w-11 h-[2px]', 'w-11 h-[1px]', 'w-11 h-[3px]', 'w-11 h-[1px]',
                        'w-11 h-[3.5px]', 'w-11 h-[1px]', 'w-11 h-[2px]', 'w-11 h-[2px]',
                        'w-11 h-[3px]', 'w-11 h-[1px]', 'w-11 h-[4px]', 'w-11 h-[1.5px]',
                        'w-11 h-[2px]', 'w-11 h-[1px]', 'w-11 h-[3px]', 'w-11 h-[2px]',
                        'w-11 h-[3.5px]', 'w-11 h-[1px]', 'w-11 h-[2px]', 'w-11 h-[2.5px]',
                      ].map((barClass, bIdx) => (
                        <span key={bIdx} className={`${barClass} ${ticketTheme.barcode} block rounded-[0.5px]`} />
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* Main Content: Novel Grid + Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_29%] gap-8">
        
        {/* Left: Novel Catalog (Main Content) */}
        <div className="min-w-0 space-y-8">
          
          {/* MỤC: TRUYỆN ĐỌC GẦN ĐÂY - THIẾT KẾ CHUẨN THEO ẢNH MẪU IMG_20260916_124252 */}
          {(() => {
            const recentCardTheme = getRecentReadingCardTheme(theme, isDarkEffective);
            const hasRecentReads = activeRecentReads.length > 0;
            const currentRecent = hasRecentReads ? (activeRecentReads[recentIndex] || activeRecentReads[0]) : null;
            const estimate = currentRecent ? getReadingEstimate(currentRecent.novel, currentRecent.record) : null;

            return (
              <section
                id="recent-reading-section"
                className="relative isolate mb-10 sm:mb-14 select-none"
              >
                {/* Lớp xếp chồng đáy thứ 2 (Dưới cùng nhất, thụt vào hai bên nhiều nhất) */}
                <div
                  className={`absolute -bottom-3 sm:-bottom-3.5 inset-x-6 sm:inset-x-8 h-9 sm:h-11 rounded-[22px] sm:rounded-[26px] border -z-20 transition-all duration-300 pointer-events-none ${recentCardTheme.stackedBottom}`}
                  aria-hidden="true"
                />

                {/* Lớp xếp chồng đáy thứ 1 (Ở giữa, ngay dưới thẻ chính, thụt vào vừa phải) */}
                <div
                  className={`absolute -bottom-1.5 sm:-bottom-2 inset-x-3 sm:inset-x-4 h-9 sm:h-11 rounded-[25px] sm:rounded-[29px] border -z-10 transition-all duration-300 pointer-events-none ${recentCardTheme.stackedMiddle}`}
                  aria-hidden="true"
                />

                {/* Thẻ chính với họa tiết Letterpress Lines và màu sắc theo từng theme */}
                <div
                  className={`relative z-0 rounded-[26px] sm:rounded-[32px] p-4 sm:p-6 md:p-7 border transition-all overflow-hidden ${recentCardTheme.cardBg} ${recentCardTheme.cardBorder} ${recentCardTheme.cardShadow}`}
                  style={{
                    backgroundImage: recentCardTheme.letterpressLines,
                    backgroundSize: '100% 25px',
                    backgroundRepeat: 'repeat-y',
                  }}
                >
                  {/* Hàng trên cùng: Đang đọc > và Chỉ số trang + Nút điều hướng */}
                  <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
                    {/* Bên trái: Đang đọc */}
                    <div
                      onClick={() => {
                        if (currentRecent) {
                          handleOpenReading(currentRecent.novel, currentRecent.record.chapterNumber);
                        }
                      }}
                      className={`flex items-center gap-1.5 select-none ${currentRecent ? 'cursor-pointer group' : ''}`}
                      title={currentRecent ? 'Xem chi tiết truyện đang đọc' : 'Đang đọc'}
                    >
                      <h3 className={`font-bold text-base sm:text-lg md:text-xl transition-opacity ${currentRecent ? 'group-hover:opacity-80' : ''} ${recentCardTheme.titleText}`}>
                        Đang đọc
                      </h3>
                      {currentRecent && (
                        <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${recentCardTheme.chevronColor}`} />
                      )}
                    </div>

                    {/* Bên phải: 1/5 và Nút điều hướng < > (Chỉ hiện khi có truyện đang đọc) */}
                    {hasRecentReads && (
                      <div className="flex items-center gap-2 select-none">
                        {/* Badge chỉ số trang (tối đa 10 bộ) */}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${recentCardTheme.badge}`}>
                          {recentIndex + 1}/{activeRecentReads.length}
                        </span>

                        {/* Nút lùi truyện < */}
                        <button
                          onClick={handlePrevRecent}
                          disabled={activeRecentReads.length <= 1}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${recentCardTheme.navBtn}`}
                          title="Truyện trước"
                          aria-label="Truyện trước"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Nút tiến truyện > */}
                        <button
                          onClick={handleNextRecent}
                          disabled={activeRecentReads.length <= 1}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${recentCardTheme.navBtn}`}
                          title="Truyện tiếp theo"
                          aria-label="Truyện tiếp theo"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* NỘI DUNG MỤC ĐANG ĐỌC */}
                  {!hasRecentReads || !currentRecent || !estimate ? (
                    /* Dành cho ai lần đầu tiên bấm vào trang web thì mục sẽ để trống, không hiện truyện */
                    <div className="py-7 sm:py-9 flex flex-col items-center justify-center text-center px-4">
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl mb-3 flex items-center justify-center border shadow-2xs ${
                          isDarkEffective ? 'bg-white/5 border-white/10 text-zinc-400' : 'bg-black/5 border-black/10 text-stone-500'
                        }`}
                      >
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 opacity-60" />
                      </div>
                      <p className={`text-sm sm:text-base font-medium ${recentCardTheme.novelTitle}`}>
                        Chưa có tiến độ đọc truyện trên trình duyệt
                      </p>
                    </div>
                  ) : (
                    /* Hiển thị truyện khi đã có tiến độ đọc */
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentRecent.novel.id || `recent-${recentIndex}`}
                        initial={{ opacity: 0, y: 7 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -7 }}
                        transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                      >
                        {/* Phần thân: Ảnh bìa bên trái + Tiêu đề, Thời gian còn lại, Thanh tiến độ bên phải */}
                        <div className="flex items-center gap-4 sm:gap-6">
                          {/* Bìa truyện bo tròn thanh lịch */}
                          <div
                            onClick={() => handleOpenReading(currentRecent.novel, currentRecent.record.chapterNumber)}
                            className={`w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-38 shrink-0 rounded-[18px] sm:rounded-[22px] overflow-hidden shadow-md border cursor-pointer group/cover relative ${recentCardTheme.coverBorder} ${recentCardTheme.coverBg}`}
                            title={`Đọc tiếp: ${currentRecent.novel.title}`}
                          >
                            <img
                              src={getDirectImageUrl(currentRecent.novel.coverImage, currentRecent.novel.id || currentRecent.novel.title)}
                              onError={(e) => handleCoverImageError(e, currentRecent.novel.id || currentRecent.novel.title)}
                              alt={currentRecent.novel.title}
                              className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Khung thông tin truyện */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2 sm:space-y-3">
                            {/* Tiêu đề truyện */}
                            <h4
                              onClick={() => handleOpenReading(currentRecent.novel, currentRecent.record.chapterNumber)}
                              className={`text-base sm:text-lg md:text-xl font-bold font-lora line-clamp-1 cursor-pointer hover:opacity-80 transition-opacity leading-snug ${recentCardTheme.novelTitle}`}
                              title={currentRecent.novel.title}
                            >
                              {currentRecent.novel.title}
                            </h4>

                            {/* Thời gian còn lại và Tỷ lệ phần trăm % */}
                            <div className={`flex items-center justify-between text-xs sm:text-sm font-medium ${recentCardTheme.timeSubtext}`}>
                              <span>{estimate.remainingStr}</span>
                              <span className={`font-semibold ${recentCardTheme.pctText}`}>{estimate.pct}%</span>
                            </div>

                            {/* Thanh tiến độ có núm tròn định vị */}
                            <div
                              onClick={() => handleOpenReading(currentRecent.novel, currentRecent.record.chapterNumber)}
                              className={`relative w-full h-2 sm:h-2.5 rounded-full cursor-pointer select-none ${recentCardTheme.progressTrack}`}
                              title={`Tiến độ: ${estimate.pct}% (Chương ${currentRecent.record.chapterNumber})`}
                            >
                              {/* Phần trăm đã đi qua */}
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${recentCardTheme.progressBar}`}
                                style={{ width: `${estimate.pct}%` }}
                              />
                              {/* Nốt chấm tròn thanh trượt */}
                              <div
                                className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shadow-md border-2 transition-all pointer-events-none ${recentCardTheme.progressThumb}`}
                                style={{ left: `calc(${estimate.pct}% - 7px)` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Hàng dưới cùng: Đã đọc X giờ Y phút (bên trái) và Tiếp tục đọc → (bên phải) */}
                        <div className={`pt-3.5 sm:pt-4 mt-4 sm:mt-5 border-t flex items-center justify-between ${recentCardTheme.divider}`}>
                          {/* Đã đọc ... */}
                          <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium ${recentCardTheme.timeSubtext}`}>
                            <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${recentCardTheme.timeIcon}`} />
                            <span>{estimate.readStr}</span>
                          </div>

                          {/* Nút bấm Tiếp tục đọc → */}
                          <button
                            onClick={() => handleOpenReading(currentRecent.novel, currentRecent.record.chapterNumber)}
                            className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold group/btn cursor-pointer transition-colors ${recentCardTheme.continueBtn}`}
                          >
                            <span>Tiếp tục đọc</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </section>
            );
          })()}

          {/* Section Header with Status Filters */}
          <div id="completed-novels-section" className="space-y-3 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h2 className={`text-xl sm:text-2xl ${themeFontHeading} font-bold ${tStyles.sectionTitle}`}>
                  <span>Tiểu Thuyết Đã Hoàn</span>
                </h2>
              </div>

              {/* Category Filter Tabs: Thiết kế nút Segmented Pill Control chuẩn theo ảnh mẫu (Theme sáng & tối) */}
              <div className="max-w-full overflow-x-auto scrollbar-none py-1">
                <div
                  id="completed-novels-segmented-tabs"
                  className={`inline-flex items-center p-1 sm:p-1.5 rounded-full transition-all duration-500 ${
                    isDarkEffective ? 'backdrop-blur-xl' : ''
                  } ${completedCategoryTabsStyles.container}`}
                >
                  {NOVEL_CATEGORY_TABS.map((tab) => {
                    const isActive = selectedCategory === tab.id;
                    const pillStyle = completedCategoryTabsStyles.getActivePill(tab.id);
                    const inactiveClass =
                      isDarkEffective && completedCategoryTabsStyles.getInactiveText
                        ? completedCategoryTabsStyles.getInactiveText(tab.id)
                        : completedCategoryTabsStyles.inactiveText;
                    return (
                      <motion.button
                        key={tab.id}
                        id={`btn-tab-${tab.id}`}
                        whileHover={isDarkEffective ? { scale: 1.04 } : { scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 26 }}
                        onClick={() => {
                          setSelectedCategory(tab.id);
                        }}
                        className={`relative px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap rounded-full select-none ${
                          isActive
                            ? `${completedCategoryTabsStyles.activeText} font-bold`
                            : `${inactiveClass} font-medium`
                        }`}
                      >
                        {isActive && (
                          isDarkEffective ? (
                            <motion.div
                              layoutId="activeCompletedCategoryPill"
                              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                              className={`absolute inset-0 rounded-full z-0 overflow-hidden ${pillStyle.gradient} ring-1 ring-white/20 ${pillStyle.glow}`}
                            >
                              {/* Vệt sáng cong hình vòm bán nguyệt nhẹ nhàng mô phỏng bề mặt cong bóng láng 3D */}
                              <div className="absolute top-0.5 inset-x-1.5 h-[38%] rounded-t-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
                            </motion.div>
                          ) : (
                            <motion.div
                              layoutId="activeCompletedCategoryPillLight"
                              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                              className={`absolute inset-0 rounded-full z-0 ${completedCategoryTabsStyles.activePill}`}
                            />
                          )
                        )}
                        <span className="relative z-10 drop-shadow-xs inline-flex items-center gap-1.5">
                          {isDarkEffective && isActive && (
                            <motion.span
                              initial={{ scale: 0, rotate: -45, opacity: 0 }}
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="text-white/90 text-xs select-none"
                            >
                              ✦
                            </motion.span>
                          )}
                          <span>{tab.label}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Thanh thông báo kết quả tìm kiếm khi có từ khóa */}
            {searchQuery.trim() && (
              <div className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm transition-all ${
                !isDarkEffective ? searchDropdownStyles.container : tStyles.card
              }`}>
                <div className="flex items-center gap-2 min-w-0">
                  <Search className={`w-4 h-4 shrink-0 ${!isDarkEffective ? searchDropdownStyles.noticeHighlight : tStyles.sectionIcon}`} />
                  <span className="truncate">
                    Kết quả tìm kiếm cho: <strong className={`font-bold underline decoration-dotted ${searchDropdownStyles.noticeHighlight}`}>{searchQuery.trim()}</strong>{' '}
                    <span className="opacity-75">({filteredNovels.length} truyện)</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`px-3 py-1 rounded-full border text-xs font-semibold shrink-0 cursor-pointer transition-colors ${tStyles.buttonNeutral}`}
                >
                  Xóa tìm kiếm
                </button>
              </div>
            )}
          </div>

          {/* Grid of Novel Cards (2 items per row on mobile, 3 on desktop) */}
          {filteredNovels.length === 0 ? (
            <div className={`py-16 text-center rounded-3xl border space-y-3 ${tStyles.card}`}>
              <Compass className={`w-10 h-10 mx-auto ${tStyles.sectionIcon}`} />
              <h4 className={`text-base font-bold ${tStyles.sectionTitle}`}>
                {searchQuery.trim()
                  ? `Không tìm thấy tiểu thuyết nào khớp với "${searchQuery}"`
                  : 'Không tìm thấy tiểu thuyết phù hợp'}
              </h4>
              <p className={`text-xs ${tStyles.sectionSub}`}>
                {searchQuery.trim()
                  ? 'Hãy thử kiểm tra lại chính tả hoặc tìm theo tên tác giả, thể loại khác.'
                  : 'Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang thể loại khác.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('all');
                  setSelectedCategory('all');
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer ${tStyles.buttonPrimary}`}
              >
                {searchQuery.trim() ? 'Xóa tìm kiếm & Xem tất cả truyện' : 'Đặt lại bộ lọc'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">
                {displayedNovels.map((novel) => (
                  <div
                    key={novel.id}
                    onClick={() => {
                      onSelectNovel(novel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`group relative rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 transition-[background-color,border-color,box-shadow] duration-200 flex flex-col justify-between cursor-pointer ${tStyles.card}`}
                  >
                    {/* Card Top: Cover + Quick Info */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className={`relative aspect-3/4 rounded-lg sm:rounded-xl overflow-hidden border ${tStyles.cardCoverBorder}`}>
                        <img
                          src={getDirectImageUrl(novel.coverImage, novel.id || novel.title)}
                          onError={(e) => handleCoverImageError(e, novel.id || novel.title)}
                          alt={novel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Status Badge */}
                        <div className={`absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-sans font-bold border shadow-xs ${getStatusBadgeStyle(novel.status, theme, isDarkEffective)}`}>
                          Hoàn thành
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {novel.genres.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-sans font-semibold border ${tStyles.cardTag}`}
                          >
                            #{g}
                          </span>
                        ))}
                      </div>

                      {/* Title & Synopsis grouped closely */}
                      <div className="space-y-1">
                        {/* Title */}
                        <h3 className={`text-xs sm:text-sm font-novel-title transition-colors line-clamp-2 leading-snug sm:leading-snug min-h-[2.4em] ${tStyles.cardTitle} ${tStyles.cardTitleHover}`}>
                          {novel.title}
                        </h3>

                        {/* Synopsis snippet - narrowed gap and slightly larger font */}
                        <p className={`text-[12px] sm:text-[13px] line-clamp-2 leading-relaxed font-sans ${tStyles.cardSynopsis}`}>
                          {novel.synopsis}
                        </p>
                      </div>
                    </div>

                    {/* Card Bottom: Author & Latest chapter */}
                    <div className={`pt-2 sm:pt-3 mt-2 sm:mt-3 border-t flex items-center justify-between text-[10px] sm:text-xs font-sans ${tStyles.cardFooterBorder}`}>
                      <span className={`truncate max-w-[70px] sm:max-w-[120px] font-semibold ${tStyles.cardAuthor}`}>
                        {novel.author.name}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] font-sans font-bold group-hover:translate-x-0.5 transition-transform truncate max-w-[65px] sm:max-w-none ${tStyles.cardChapterBtn}`}>
                        {novel.latestChapter.title.split(':')[0]} →
                      </span>
                    </div>

                    {/* Admin Action Controls */}
                    {isAdmin && novel.isFirestore && (
                      <div
                        className="mt-2.5 pt-2 border-t border-purple-500/20 flex items-center justify-end gap-1 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Bạn có chắc chắn muốn xóa bộ truyện "${novel.title}" không?`)) {
                              onDeleteFirestoreNovel?.(novel.id);
                            }
                          }}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                          title="Xóa truyện khỏi Firestore"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa truyện</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Nút Xem Thêm / Thu Gọn với cơ chế vật lý 3D chân thực (.hv-11__btn--stack) */}
              {filteredNovels.length > maxNovelsFor5Rows && (
                <div className="flex justify-center pt-3 pb-4">
                  <button
                    id="btn-expand-more-novels"
                    onClick={() => {
                      setIsGridExpanded(!isGridExpanded);
                    }}
                    className={`relative px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer select-none ${
                      !isDarkEffective
                        ? getLightModeNeumorphicBtnStyles(theme).expand
                        : `hv-11__btn--stack border-0 border-transparent ${expandButtonStyles.textColor}`
                    }`}
                    style={
                      !isDarkEffective
                        ? undefined
                        : {
                            backgroundColor: expandButtonStyles.btnBg,
                            ['--btn-stack-shadow' as any]: expandButtonStyles.shadowColor,
                          }
                    }
                  >
                    {isGridExpanded ? (
                      <>
                        <span>Thu Gọn</span>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Xem Thêm ({filteredNovels.length - maxNovelsFor5Rows} truyện)</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MỤC TRUYỆN VỪA MỚI ĐĂNG (IMG_20260916_011957 & IMG_20260916_014617) */}
          {/* Họa tiết dấu chấm mờ, hiển thị 3 cột giống ảnh trên cả điện thoại và máy tính */}
          {/* ========================================================================= */}
          {novels && novels.length > 0 && (() => {
            const sorted = [...novels].sort((a, b) => {
              const timeA = a.latestChapter?.updatedAt ? new Date(a.latestChapter.updatedAt).getTime() : 0;
              const timeB = b.latestChapter?.updatedAt ? new Date(b.latestChapter.updatedAt).getTime() : 0;
              return timeB - timeA;
            });
            const totalPages = Math.max(1, Math.ceil(sorted.length / 3));
            const safePage = polaroidPage % totalPages;
            const startIndex = safePage * 3;
            const novelCol1 = sorted[startIndex] || sorted[0];
            const novelCol2 = sorted[startIndex + 1] || sorted[1] || sorted[0];
            const novelCol3 = sorted[startIndex + 2] || sorted[2] || sorted[1] || sorted[0];

            return (
              <section
                id="showcase-polaroid-section"
                className={`relative rounded-[28px] sm:rounded-[36px] p-4 sm:p-7 md:p-9 border overflow-hidden transition-all duration-300 mt-8 ${
                  getThemePastelPalette(theme, isDarkEffective).cardBg
                } ${
                  isDarkEffective
                    ? 'border-white/[0.07]'
                    : 'border-black/[0.04]'
                }`}
                style={{
                  backgroundImage: `radial-gradient(${getThemePastelPalette(theme, isDarkEffective).dotColor} 1.2px, transparent 1.2px)`,
                  backgroundSize: '18px 18px',
                  boxShadow: isDarkEffective
                    ? '0 6px 20px rgba(0, 0, 0, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.12), inset 0 -1px 2px rgba(0, 0, 0, 0.22)'
                    : '0 6px 20px rgba(0, 0, 0, 0.045), inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(0, 0, 0, 0.02)',
                }}
              >
                {/* 4 Ngôi sao ở 4 góc: 5 góc bo tròn lớn (strokeLinejoin='round'), 2 ngôi sao lớn & 2 ngôi sao nhỏ, nằm xiêu vẹo ngẫu nhiên */}
                {/* 1. Top-Left: Ngôi sao LỚN, xiêu vẹo 18 độ */}
                <div
                  className={`absolute top-3 left-3 sm:top-4 sm:left-4 select-none pointer-events-none rotate-[18deg] ${getThemePastelPalette(theme, isDarkEffective).starColor}`}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5.5 h-5.5 sm:w-7 sm:h-7"
                  >
                    <polygon points="12 2.8 14.8 8.8 21.4 9.4 16.4 13.9 17.9 20.3 12 16.8 6.1 20.3 7.6 13.9 2.6 9.4 9.2 8.8" />
                  </svg>
                </div>

                {/* 2. Top-Right: Ngôi sao NHỎ, xiêu vẹo -26 độ */}
                <div
                  className={`absolute top-3 right-3 sm:top-4 sm:right-4 select-none pointer-events-none -rotate-[26deg] ${getThemePastelPalette(theme, isDarkEffective).starColor}`}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5"
                  >
                    <polygon points="12 2.8 14.8 8.8 21.4 9.4 16.4 13.9 17.9 20.3 12 16.8 6.1 20.3 7.6 13.9 2.6 9.4 9.2 8.8" />
                  </svg>
                </div>

                {/* 3. Bottom-Left: Ngôi sao NHỎ, xiêu vẹo -16 độ */}
                <div
                  className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 select-none pointer-events-none -rotate-[16deg] ${getThemePastelPalette(theme, isDarkEffective).starColor}`}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5"
                  >
                    <polygon points="12 2.8 14.8 8.8 21.4 9.4 16.4 13.9 17.9 20.3 12 16.8 6.1 20.3 7.6 13.9 2.6 9.4 9.2 8.8" />
                  </svg>
                </div>

                {/* 4. Bottom-Right: Ngôi sao LỚN, xiêu vẹo 34 độ */}
                <div
                  className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 select-none pointer-events-none rotate-[34deg] ${getThemePastelPalette(theme, isDarkEffective).starColor}`}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5.5 h-5.5 sm:w-7 sm:h-7"
                  >
                    <polygon points="12 2.8 14.8 8.8 21.4 9.4 16.4 13.9 17.9 20.3 12 16.8 6.1 20.3 7.6 13.9 2.6 9.4 9.2 8.8" />
                  </svg>
                </div>

                {/* Tiêu đề mục: BẢNG TRUYỆN (Kích thước nhỏ lại, phông Lora in nghiêng thanh lịch) */}
                <div className="text-center mb-5 sm:mb-8 relative z-10">
                  <h3 className={`font-lora italic !font-normal text-xs sm:text-[13px] md:text-sm tracking-[0.18em] uppercase ${tStyles.cardTitle}`}>
                    BẢNG TRUYỆN
                  </h3>
                </div>

                {/* 3 Khung ảnh hiển thị 3 cột ngang hàng trên cả điện thoại và máy tính như ảnh mẫu */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 relative z-10 items-end max-w-2xl sm:max-w-3xl mx-auto pt-2 pb-1">
                  
                  {/* Khung 1 (Nghiêng trái nhẹ, có băng dính washi hồng pastel dán trên đầu) */}
                  {novelCol1 && (
                    <div className="relative group/p1 -rotate-2 sm:-rotate-3 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300">
                      {/* Miếng băng dính washi dán góc trên */}
                      <div
                        className="absolute -top-2.5 sm:-top-3.5 left-1/2 -translate-x-1/2 w-12 sm:w-20 h-4 sm:h-6 rounded-xs bg-[#f8b4cb]/90 border border-[#f09bb7]/50 shadow-2xs -rotate-2 select-none z-20 pointer-events-none"
                      />
                      <div
                        onClick={() => {
                          onSelectNovel(novelCol1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`rounded-2xl sm:rounded-3xl p-1.5 sm:p-3 pb-2.5 sm:pb-4 border transition-all duration-300 cursor-pointer ${
                          getThemePastelPalette(theme, isDarkEffective).polaroidBg
                        } ${
                          isDarkEffective
                            ? 'border-white/[0.07] shadow-[0_4px_14px_rgba(0,0,0,0.38),inset_0_1px_1px_rgba(255,255,255,0.07)] group-hover/p1:shadow-[0_8px_20px_rgba(0,0,0,0.52),inset_0_1px_1px_rgba(255,255,255,0.12)]'
                            : 'border-black/[0.03] shadow-[0_4px_14px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] group-hover/p1:shadow-[0_8px_20px_rgba(0,0,0,0.11),0_2px_6px_rgba(0,0,0,0.04)]'
                        }`}
                        title={novelCol1.title}
                      >
                        {/* Khung ô chứa ảnh: Hiệu ứng lõm lòng thẻ (Inset shadow) */}
                        <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden mb-1.5 sm:mb-2.5 bg-neutral-100 dark:bg-zinc-800">
                          <img
                            src={getDirectImageUrl(novelCol1.coverImage, novelCol1.id || novelCol1.title)}
                            onError={(e) => handleCoverImageError(e, novelCol1.id || novelCol1.title)}
                            alt={novelCol1.title}
                            className="w-full h-full object-cover group-hover/p1:scale-105 transition-transform duration-300"
                          />
                          {/* Inset Hốc ảnh cổ điển */}
                          <div
                            className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl border border-black/10 dark:border-white/10 shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.22),inset_0_-1px_2px_rgba(255,255,255,0.55)] dark:shadow-[inset_0_2.5px_6px_rgba(0,0,0,0.65),inset_0_-1px_1.5px_rgba(255,255,255,0.14)]"
                            aria-hidden="true"
                          />
                        </div>
                        <h4 className={`font-lora italic !font-normal text-center text-[10px] sm:text-xs md:text-sm line-clamp-2 leading-snug px-0.5 mt-1 sm:mt-1.5 ${getThemePastelPalette(theme, isDarkEffective).heroTitleColor}`}>
                          {novelCol1.title}
                        </h4>
                      </div>
                    </div>
                  )}

                  {/* Khung 2 (Ở giữa, vòm cong tròn, có đinh ghim tròn 3D thiên trắng nhỏ gọn chuẩn mẫu) */}
                  {novelCol2 && (
                    <div className="relative group/p2 rotate-0 sm:-translate-y-2 hover:-translate-y-3.5 hover:scale-[1.02] transition-all duration-300">
                      {/* Đinh ghim tròn 3D thiên trắng nhỏ gọn, bóng tối dưới chân ghim & đốm sáng trắng lồi ở đỉnh ghim */}
                      <div
                        className={`absolute -top-2.5 sm:-top-3.5 left-1/2 -translate-x-1/2 w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-full border border-white/95 select-none z-20 flex items-center justify-center pointer-events-none ${
                          isDarkEffective
                            ? 'shadow-[0_3px_8px_rgba(0,0,0,0.45),0_1px_3px_rgba(0,0,0,0.25)]'
                            : 'shadow-[0_3px_6px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.10)]'
                        }`}
                        style={{
                          background: isDarkEffective
                            ? 'radial-gradient(circle at 35% 30%, #f6f5fa 0%, #e1deec 42%, #9e97af 75%, #665e7a 100%)'
                            : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #ffffff 42%, #f0f2f6 72%, #d6dbe4 100%)',
                        }}
                      >
                        {/* Đốm sáng highlight phản quang ở đỉnh ghim góc 10h */}
                        <div className="absolute top-0.5 left-1 w-1.5 h-0.5 sm:w-2 sm:h-0.8 rounded-full bg-white/95 blur-[0.15px] -rotate-45 shadow-[0_0_2px_rgba(255,255,255,0.85)]" />
                      </div>
                      <div
                        onClick={() => {
                          onSelectNovel(novelCol2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`rounded-t-[32px] sm:rounded-t-[46px] rounded-b-2xl sm:rounded-b-3xl p-1.5 sm:p-3 pb-2.5 sm:pb-4 border transition-all duration-300 cursor-pointer ${
                          getThemePastelPalette(theme, isDarkEffective).polaroidBg
                        } ${
                          isDarkEffective
                            ? 'border-white/[0.07] shadow-[0_4px_14px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.07)] group-hover/p2:shadow-[0_8px_20px_rgba(0,0,0,0.56),inset_0_1px_1px_rgba(255,255,255,0.12)]'
                            : 'border-black/[0.03] shadow-[0_4px_14px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04)] group-hover/p2:shadow-[0_8px_20px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)]'
                        }`}
                        title={novelCol2.title}
                      >
                        {/* Khung ô chứa ảnh vòm cong: Hiệu ứng lõm lòng thẻ (Inset shadow) */}
                        <div className="relative aspect-square w-full rounded-t-[26px] sm:rounded-t-[38px] rounded-b-xl sm:rounded-b-2xl overflow-hidden mb-1.5 sm:mb-2.5 bg-neutral-100 dark:bg-zinc-800">
                          <img
                            src={getDirectImageUrl(novelCol2.coverImage, novelCol2.id || novelCol2.title)}
                            onError={(e) => handleCoverImageError(e, novelCol2.id || novelCol2.title)}
                            alt={novelCol2.title}
                            className="w-full h-full object-cover group-hover/p2:scale-105 transition-transform duration-300"
                          />
                          {/* Inset Hốc ảnh cổ điển */}
                          <div
                            className="absolute inset-0 pointer-events-none rounded-t-[26px] sm:rounded-t-[38px] rounded-b-xl sm:rounded-b-2xl border border-black/10 dark:border-white/10 shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.22),inset_0_-1px_2px_rgba(255,255,255,0.55)] dark:shadow-[inset_0_2.5px_6px_rgba(0,0,0,0.65),inset_0_-1px_1.5px_rgba(255,255,255,0.14)]"
                            aria-hidden="true"
                          />
                        </div>
                        <h4 className={`font-lora italic !font-normal text-center text-[10px] sm:text-xs md:text-sm line-clamp-2 leading-snug px-0.5 mt-1 sm:mt-1.5 ${getThemePastelPalette(theme, isDarkEffective).heroTitleColor}`}>
                          {novelCol2.title}
                        </h4>
                      </div>
                    </div>
                  )}

                  {/* Khung 3 (Nghiêng phải nhẹ, có băng dính washi xanh pastel dán trên đầu) */}
                  {novelCol3 && (
                    <div className="relative group/p3 rotate-2 sm:rotate-3 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300">
                      {/* Miếng băng dính washi pastel dán góc trên */}
                      <div
                        className="absolute -top-2.5 sm:-top-3.5 left-1/2 -translate-x-1/2 w-12 sm:w-20 h-4 sm:h-6 rounded-xs bg-[#9be0f7]/90 border border-[#7ecbf3]/50 shadow-2xs rotate-2 select-none z-20 pointer-events-none"
                      />
                      <div
                        onClick={() => {
                          onSelectNovel(novelCol3);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`rounded-2xl sm:rounded-3xl p-1.5 sm:p-3 pb-2.5 sm:pb-4 border transition-all duration-300 cursor-pointer ${
                          getThemePastelPalette(theme, isDarkEffective).polaroidBg
                        } ${
                          isDarkEffective
                            ? 'border-white/[0.07] shadow-[0_4px_14px_rgba(0,0,0,0.38),inset_0_1px_1px_rgba(255,255,255,0.07)] group-hover/p3:shadow-[0_8px_20px_rgba(0,0,0,0.52),inset_0_1px_1px_rgba(255,255,255,0.12)]'
                            : 'border-black/[0.03] shadow-[0_4px_14px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] group-hover/p3:shadow-[0_8px_20px_rgba(0,0,0,0.11),0_2px_6px_rgba(0,0,0,0.04)]'
                        }`}
                        title={novelCol3.title}
                      >
                        {/* Khung ô chứa ảnh: Hiệu ứng lõm lòng thẻ (Inset shadow) */}
                        <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden mb-1.5 sm:mb-2.5 bg-neutral-100 dark:bg-zinc-800">
                          <img
                            src={getDirectImageUrl(novelCol3.coverImage, novelCol3.id || novelCol3.title)}
                            onError={(e) => handleCoverImageError(e, novelCol3.id || novelCol3.title)}
                            alt={novelCol3.title}
                            className="w-full h-full object-cover group-hover/p3:scale-105 transition-transform duration-300"
                          />
                          {/* Inset Hốc ảnh cổ điển */}
                          <div
                            className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl border border-black/10 dark:border-white/10 shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.22),inset_0_-1px_2px_rgba(255,255,255,0.55)] dark:shadow-[inset_0_2.5px_6px_rgba(0,0,0,0.65),inset_0_-1px_1.5px_rgba(255,255,255,0.14)]"
                            aria-hidden="true"
                          />
                        </div>
                        <h4 className={`font-lora italic !font-normal text-center text-[10px] sm:text-xs md:text-sm line-clamp-2 leading-snug px-0.5 mt-1 sm:mt-1.5 ${getThemePastelPalette(theme, isDarkEffective).heroTitleColor}`}>
                          {novelCol3.title}
                        </h4>
                      </div>
                    </div>
                  )}

                </div>

                {/* 4. Nút Chuyển Trang (< >) & Nút "Đổi Bìa" — Phản Hồi Xúc Giác Khi Bấm */}
                <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mt-4 sm:mt-6 relative z-20">
                  {/* Nút lùi trang (<) */}
                  <button
                    type="button"
                    onClick={() => setPolaroidPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))}
                    className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none active:translate-y-[1px] ${getPolaroidNavBtnClass(theme, isDarkEffective)}`}
                    title="Trang trước"
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Nút "Đổi Bìa" */}
                  <button
                    type="button"
                    onClick={() => setPolaroidPage((prev) => (prev + 1) % totalPages)}
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all cursor-pointer select-none active:translate-y-[1px] ${getPolaroidNavBtnClass(theme, isDarkEffective)}`}
                    title="Đổi bộ bìa truyện khác"
                  >
                    <Shuffle className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80" />
                    <span>Đổi bìa</span>
                    {totalPages > 1 && (
                      <span className="opacity-60 text-[10px]">
                        ({safePage + 1}/{totalPages})
                      </span>
                    )}
                  </button>

                  {/* Nút tiến trang (>) */}
                  <button
                    type="button"
                    onClick={() => setPolaroidPage((prev) => (prev + 1) % totalPages)}
                    className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none active:translate-y-[1px] ${getPolaroidNavBtnClass(theme, isDarkEffective)}`}
                    title="Trang tiếp"
                    aria-label="Trang tiếp"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </section>
            );
          })()}



        </div>

        {/* Right Sidebar: Thanh bên chứa Chọn truyện ngẫu nhiên & Truyện vừa mới đăng (29%) */}
        <div className="min-w-0 space-y-6">
          
          {/* Mục "Chọn Truyện Ngẫu Nhiên" / "Hôm Nay Đọc Gì" */}
          <RandomNovelPicker
            novels={novels}
            onSelectNovel={onSelectNovel}
            tStyles={tStyles}
            theme={theme}
            isDarkMode={isDarkEffective}
          />

          {/* Khối Truyện Vừa Mới Đăng (Ở chế độ tối: áp dụng Glassmorphism đồng bộ với danh mục truyện trong Tiểu thuyết đã hoàn; Ở chế độ sáng: Neumorphism pha Glassmorphism 2 đường viền) */}
          {(() => {
            const recentStyles = getRecentUpdatesCardStyles(theme, isDarkEffective);

            // Chế độ tối: Áp dụng chuẩn đổ màu cho khối êm dịu, bớt đường viền con vụn vặt, giữ viền ngoài thanh mảnh
            if (isDarkEffective) {
              return (
                <div
                  className="rounded-[26px] sm:rounded-[30px] p-4 sm:p-5 space-y-3.5 transition-all duration-300 relative overflow-hidden backdrop-blur-2xl"
                  style={recentStyles.outerStyle}
                >
                  {/* 1. HEADER: Nút tròn bên trái, Tiêu đề + Phụ đề ở giữa, Mũi tên dropdown bên phải */}
                  <div
                    className="flex items-center justify-between gap-3 cursor-pointer select-none"
                    onClick={() => setIsRealtimeUpdatesOpen(!isRealtimeUpdatesOpen)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Nút tròn biểu tượng đổ màu khối mềm, bỏ viền gắt */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 select-none bg-white/[0.08] backdrop-blur-md ${recentStyles.iconColor}`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>

                      {/* Tiêu đề & Phụ đề */}
                      <div className="min-w-0">
                        <h3 className={`text-sm sm:text-base font-bold truncate ${recentStyles.titleColor}`}>
                          Truyện Vừa Mới Đăng
                        </h3>
                        <p className={`text-[10px] font-mono tracking-wider uppercase truncate font-semibold ${recentStyles.subtitleColor}`}>
                          CHƯƠNG MỚI
                        </p>
                      </div>
                    </div>

                    {/* Mũi tên dropdown bên phải đổ màu khối mềm, bỏ viền gắt */}
                    <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-md ${isRealtimeUpdatesOpen ? 'rotate-0' : '-rotate-90'} ${recentStyles.chevronColor}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 2. ĐƯỜNG PHÂN CÁCH NÉT MẢNH (GIỮ NƠI PHÙ HỢP) */}
                  <div className={`border-b ${recentStyles.dividerClass} -mx-4 sm:-mx-5 my-2.5`} />

                  {/* 3. DANH SÁCH TRUYỆN MỚI CẬP NHẬT (ĐỔ MÀU KHỐI, BỚT ĐƯỜNG VIỀN) */}
                  {isRealtimeUpdatesOpen && (
                    <div className="space-y-1.5">
                      {novels.slice(0, 4).map((n) => {
                        const lastChap = n.chapters && n.chapters.length > 0 ? n.chapters[n.chapters.length - 1] : null;
                        const rawDate = lastChap?.publishedAt || n.chapters?.[0]?.publishedAt || n.updatedAt || n.createdAt;
                        let displayDate = '13/09/2026';
                        if (rawDate) {
                          if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(rawDate)) {
                            displayDate = rawDate;
                          } else if (/^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
                            const parts = rawDate.split('T')[0].split('-');
                            if (parts.length === 3) displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                          } else {
                            const d = new Date(rawDate);
                            if (!isNaN(d.getTime())) displayDate = d.toLocaleDateString('vi-VN');
                          }
                        }

                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              onSelectNovel(n);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 group transition-all duration-200 cursor-pointer ${recentStyles.itemHoverClass}`}
                          >
                            {/* Ảnh bìa giữ viền mỏng tinh tế ở nơi phù hợp để tách biệt nền */}
                            <img
                              src={getDirectImageUrl(n.coverImage, n.id || n.title)}
                              onError={(e) => handleCoverImageError(e, n.id || n.title)}
                              alt={n.title}
                              className="w-9 h-12 sm:w-10 sm:h-13 rounded-lg sm:rounded-xl object-cover shrink-0 border border-white/10 shadow-xs group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-xs sm:text-[13px] font-semibold truncate transition-colors ${recentStyles.titleColor} ${recentStyles.itemTitleHoverClass}`}>
                                {n.title}
                              </h4>
                              <div className="flex items-center justify-between gap-1.5 mt-0.5 sm:mt-1">
                                <span className={`text-[10px] sm:text-[11px] truncate max-w-[130px] sm:max-w-[160px] lg:max-w-[210px] opacity-75 ${recentStyles.subtitleColor}`}>
                                  {n.latestChapter?.title || 'Chương mới'}
                                </span>
                                {/* Badge ngày tháng: đổ màu khối nhẹ, bỏ viền chằng chịt */}
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-medium shrink-0 bg-white/[0.06] text-stone-300">
                                  {displayDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Chế độ sáng: Giữ nguyên Neumorphism pha Glassmorphism 2 đường viền đồng bộ
            return (
              <div
                className="p-[2.5px] sm:p-[3px] rounded-[28px] sm:rounded-[30px] transition-all duration-300"
                style={recentStyles.outerStyle}
              >
                {/* ĐƯỜNG VIỀN THỨ 2 BÊN TRONG: Kế tiếp là một đường viền màu nhạt dịu mát */}
                <div
                  className="p-4 sm:p-5 rounded-[25px] sm:rounded-[27px] space-y-3 backdrop-blur-xl transition-all duration-300"
                  style={recentStyles.innerStyle}
                >
                  {/* 1. HEADER: Nút tròn bên trái, Tiêu đề + Phụ đề ở giữa, Mũi tên dropdown bên phải */}
                  <div
                    className="flex items-center justify-between gap-3 cursor-pointer select-none"
                    onClick={() => setIsRealtimeUpdatesOpen(!isRealtimeUpdatesOpen)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Nút tròn biểu tượng Neumorphism */}
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 select-none backdrop-blur-md"
                        style={recentStyles.iconBtnStyle}
                      >
                        <Clock className={`w-4 h-4 ${recentStyles.iconColor}`} />
                      </div>

                      {/* Tiêu đề & Phụ đề */}
                      <div className="min-w-0">
                        <h3 className={`text-sm sm:text-base font-bold truncate ${recentStyles.titleColor}`}>
                          Truyện Vừa Mới Đăng
                        </h3>
                        <p className={`text-[10px] font-mono tracking-wider uppercase truncate ${recentStyles.subtitleColor}`}>
                          CHƯƠNG MỚI
                        </p>
                      </div>
                    </div>

                    {/* Mũi tên dropdown bên phải */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isRealtimeUpdatesOpen ? 'rotate-0' : '-rotate-90'} ${recentStyles.chevronColor}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 2. ĐƯỜNG PHÂN CÁCH NÉT MẢNH */}
                  <div className={`border-b ${recentStyles.dividerClass} -mx-4 sm:-mx-5 my-2.5`} />

                  {/* 3. DANH SÁCH TRUYỆN MỚI CẬP NHẬT */}
                  {isRealtimeUpdatesOpen && (
                    <div className="space-y-1.5">
                      {novels.slice(0, 4).map((n) => {
                        // Lấy chính xác ngày đăng chương
                        const lastChap = n.chapters && n.chapters.length > 0 ? n.chapters[n.chapters.length - 1] : null;
                        const rawDate = lastChap?.publishedAt || n.chapters?.[0]?.publishedAt || n.updatedAt || n.createdAt;
                        let displayDate = '13/09/2026';
                        if (rawDate) {
                          if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(rawDate)) {
                            displayDate = rawDate;
                          } else if (/^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
                            const parts = rawDate.split('T')[0].split('-');
                            if (parts.length === 3) displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                          } else {
                            const d = new Date(rawDate);
                            if (!isNaN(d.getTime())) displayDate = d.toLocaleDateString('vi-VN');
                          }
                        }

                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              onSelectNovel(n);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`p-2 rounded-xl flex items-center gap-2.5 sm:gap-3 group transition-all duration-200 cursor-pointer ${recentStyles.itemHoverClass}`}
                          >
                            <img
                              src={getDirectImageUrl(n.coverImage, n.id || n.title)}
                              onError={(e) => handleCoverImageError(e, n.id || n.title)}
                              alt={n.title}
                              className="w-9 h-12 rounded-lg object-cover shrink-0 border border-white/60 dark:border-white/10 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-xs font-semibold truncate transition-colors ${recentStyles.itemTitleHoverClass}`}>
                                {n.title}
                              </h4>
                              <div className="flex items-center justify-between gap-1 mt-0.5">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px] sm:max-w-[160px] lg:max-w-[210px]">
                                  {n.latestChapter?.title || 'Chương mới'}
                                </span>
                                <span className={`text-[9px] font-mono font-medium shrink-0 ${recentStyles.itemDateClass}`}>
                                  {displayDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

        </div>

      </div>
      </main>

      {/* Themed Footer preserving theme background */}
      <Footer
        isNovelPlatform={true}
        borderClass={tStyles.headerBorder}
        bgClass={tStyles.footerBg}
        theme={theme}
        isDarkMode={isDarkEffective}
        isHomePage={true}
        onOpenIntro={() => {
          if (onOpenLightIntro) {
            onOpenLightIntro();
          } else {
            onBackToPortfolio();
          }
        }}
      />

    </div>
  );
};
