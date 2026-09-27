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
} from 'lucide-react';
import { Novel, NovelGenre, DarkBackgroundOption, DARK_BG_OPTIONS } from '../types';
import { AdminUserLike } from '../services/firebase';
import { NOVEL_GENRES } from '../data/novelData';
import { NovelThemeId, NOVEL_THEME_OPTIONS, getNovelThemeStyles } from '../utils/themeStyles';
import { WebLogo } from './WebLogo';
import { RandomNovelPicker } from './RandomNovelPicker';
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

  // Purple theme dark mode background effects toggle (mặc định bật: true)
  const [purpleBgEffectsEnabled, setPurpleBgEffectsEnabled] = useState<boolean>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_purple_bg_effects');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
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
    // Ở theme cosmic giữ duy nhất 1 chế độ tối, khi bấm vào dark mode thì không thay đổi màu sắc gì hết
    if (theme === 'cosmic') {
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
            cardBorder: 'border-sky-500/25',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
            stackedMiddle: 'bg-[#0c121e]/95 border-sky-500/20 shadow-xs',
            stackedBottom: 'bg-[#080d16]/90 border-sky-500/15 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(56, 189, 248, 0.08) 24px, rgba(56, 189, 248, 0.08) 25px)',
            titleText: 'text-sky-100',
            novelTitle: 'text-sky-100',
            chevronColor: 'text-sky-400 group-hover:text-sky-300',
            badge: 'bg-sky-950/70 text-sky-200 border-sky-500/30',
            navBtn: 'bg-sky-950/70 hover:bg-sky-900/60 text-sky-200 border-sky-500/30 shadow-xs',
            timeSubtext: 'text-sky-300/70',
            timeIcon: 'text-sky-400/80',
            progressTrack: 'bg-sky-950/80 border border-sky-800/40',
            progressBar: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.4)]',
            progressThumb: 'bg-sky-300 border-sky-950 ring-2 ring-sky-400/40',
            pctText: 'text-sky-200',
            continueBtn: 'text-sky-200 hover:text-sky-100',
            divider: 'border-sky-500/15',
            coverBorder: 'border-sky-500/30',
            coverBg: 'bg-sky-950/50',
          };
        case 'sage':
          return {
            cardBg: 'bg-[#0f1a14]/95',
            cardBorder: 'border-emerald-500/25',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
            stackedMiddle: 'bg-[#0b1410]/95 border-emerald-500/20 shadow-xs',
            stackedBottom: 'bg-[#080e0b]/90 border-emerald-500/15 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(16, 185, 129, 0.05) 24px, rgba(16, 185, 129, 0.05) 25px)',
            titleText: 'text-emerald-100',
            novelTitle: 'text-emerald-100',
            chevronColor: 'text-emerald-300 group-hover:text-emerald-200',
            badge: 'bg-emerald-950/70 text-emerald-200 border-emerald-500/30',
            navBtn: 'bg-emerald-950/70 hover:bg-emerald-900/60 text-emerald-200 border-emerald-500/30 shadow-xs',
            timeSubtext: 'text-emerald-300/70',
            timeIcon: 'text-emerald-400/80',
            progressTrack: 'bg-white/10 border border-white/10',
            progressBar: 'bg-[#3e6041]',
            progressThumb: 'bg-[#8cb892] border-[#0c1510]',
            pctText: 'text-emerald-200',
            continueBtn: 'text-emerald-200 hover:text-emerald-100',
            divider: 'border-emerald-500/15',
            coverBorder: 'border-emerald-500/30',
            coverBg: 'bg-emerald-950/50',
          };
        case 'mocha':
          return {
            cardBg: 'bg-[#19130e]/95',
            cardBorder: 'border-amber-600/25',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
            stackedMiddle: 'bg-[#130e0a]/95 border-amber-600/20 shadow-xs',
            stackedBottom: 'bg-[#0e0906]/90 border-amber-600/15 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(217, 119, 6, 0.05) 24px, rgba(217, 119, 6, 0.05) 25px)',
            titleText: 'text-amber-100',
            novelTitle: 'text-amber-100',
            chevronColor: 'text-amber-300 group-hover:text-amber-200',
            badge: 'bg-amber-950/70 text-amber-200 border-amber-600/30',
            navBtn: 'bg-amber-950/70 hover:bg-amber-900/60 text-amber-200 border-amber-600/30 shadow-xs',
            timeSubtext: 'text-amber-300/70',
            timeIcon: 'text-amber-400/80',
            progressTrack: 'bg-white/10 border border-white/10',
            progressBar: 'bg-[#8c6046]',
            progressThumb: 'bg-[#cbb3a3] border-[#15100c]',
            pctText: 'text-amber-200',
            continueBtn: 'text-amber-200 hover:text-amber-100',
            divider: 'border-amber-600/15',
            coverBorder: 'border-amber-600/30',
            coverBg: 'bg-amber-950/50',
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
            cardBorder: 'border-purple-500/25',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
            stackedMiddle: 'bg-[#120d1c]/95 border-purple-500/20 shadow-xs',
            stackedBottom: 'bg-[#0e0a16]/90 border-purple-500/15 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(216, 180, 254, 0.08) 24px, rgba(216, 180, 254, 0.08) 25px)',
            titleText: 'text-purple-100',
            novelTitle: 'text-purple-100',
            chevronColor: 'text-purple-400 group-hover:text-purple-300',
            badge: 'bg-purple-950/70 text-purple-200 border-purple-500/30',
            navBtn: 'bg-purple-950/70 hover:bg-purple-900/60 text-purple-200 border-purple-500/30 shadow-xs',
            timeSubtext: 'text-purple-300/70',
            timeIcon: 'text-purple-400/80',
            progressTrack: 'bg-purple-950/80 border border-purple-800/40',
            progressBar: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.4)]',
            progressThumb: 'bg-purple-300 border-purple-950 ring-2 ring-purple-400/40',
            pctText: 'text-purple-200',
            continueBtn: 'text-purple-200 hover:text-purple-100',
            divider: 'border-purple-500/15',
            coverBorder: 'border-purple-500/30',
            coverBg: 'bg-purple-950/50',
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
          navBtn: 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-250 shadow-xs',
          timeSubtext: 'text-zinc-500',
          timeIcon: 'text-zinc-400',
          progressTrack: 'bg-zinc-200/80',
          progressBar: 'bg-zinc-700',
          progressThumb: 'bg-zinc-900 border-white ring-2 ring-zinc-300/60',
          pctText: 'text-zinc-800 font-semibold',
          continueBtn: 'text-zinc-800 hover:text-black font-semibold',
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
          navBtn: 'bg-white/90 hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs',
          timeSubtext: 'text-slate-500',
          timeIcon: 'text-slate-400',
          progressTrack: 'bg-slate-200/80',
          progressBar: 'bg-[#64748b]',
          progressThumb: 'bg-[#475569] border-white ring-2 ring-slate-300/60',
          pctText: 'text-slate-800 font-semibold',
          continueBtn: 'text-slate-700 hover:text-slate-950 font-semibold',
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
          navBtn: 'bg-white/90 hover:bg-stone-50 text-stone-700 border-stone-200 shadow-xs',
          timeSubtext: 'text-stone-500',
          timeIcon: 'text-stone-400',
          progressTrack: 'bg-stone-200/80',
          progressBar: 'bg-[#6a7f6c]',
          progressThumb: 'bg-[#566858] border-white ring-2 ring-stone-300/60',
          pctText: 'text-stone-800 font-semibold',
          continueBtn: 'text-stone-700 hover:text-stone-950 font-semibold',
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
          navBtn: 'bg-white/90 hover:bg-stone-50 text-stone-700 border-stone-200 shadow-xs',
          timeSubtext: 'text-stone-500',
          timeIcon: 'text-stone-400',
          progressTrack: 'bg-stone-200/80',
          progressBar: 'bg-[#8a7567]',
          progressThumb: 'bg-[#736053] border-white ring-2 ring-stone-300/60',
          pctText: 'text-stone-800 font-semibold',
          continueBtn: 'text-stone-700 hover:text-stone-950 font-semibold',
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
          navBtn: 'bg-white/90 hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs',
          timeSubtext: 'text-slate-500',
          timeIcon: 'text-slate-400',
          progressTrack: 'bg-slate-200/80',
          progressBar: 'bg-slate-600',
          progressThumb: 'bg-slate-700 border-white ring-2 ring-slate-300/60',
          pctText: 'text-slate-800 font-semibold',
          continueBtn: 'text-slate-700 hover:text-slate-950 font-semibold',
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
          navBtn: 'bg-white/95 hover:bg-[#f7f4fb] text-[#3d324f] border-[#ded8ea] shadow-xs',
          timeSubtext: 'text-[#7d7291]',
          timeIcon: 'text-[#9d92b0]',
          progressTrack: 'bg-[#e6e0ef]',
          progressBar: 'bg-[#7e739f]',
          progressThumb: 'bg-[#655985] border-white ring-2 ring-purple-200/60',
          pctText: 'text-[#413656] font-semibold',
          continueBtn: 'text-[#4e3f68] hover:text-[#2d243a] font-semibold',
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
          ? 'bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#90a1b9] shadow-[0_0_8px_rgba(56,189,248,0.45)]'
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
          ? 'bg-gradient-to-r from-[#c084fc] to-[#e879f9] shadow-[0_0_8px_rgba(192,132,252,0.45)]'
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
        return 'bg-gradient-to-r from-[#3e6041] to-[#588157]';
      case 'mocha':
        return 'bg-gradient-to-r from-[#8c6046] to-[#a67c65]';
      case 'amethyst-haze':
        return 'bg-gradient-to-r from-[#c084fc] to-[#e879f9] shadow-[0_0_12px_rgba(192,132,252,0.8)]';
      case 'slate-haze':
      default:
        // Thanh neon cyan phát sáng đặc trưng đúng như hình mẫu
        return 'bg-gradient-to-r from-[#00f2fe] to-[#38bdf8] shadow-[0_0_14px_rgba(0,242,254,0.9)]';
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
          ? `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-emerald-400/80 active:border-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`
          : `${basePhysics} bg-white/70 hover:bg-white active:bg-[#f0f7ef] border-[#cad8c6] hover:border-[#678564] active:border-[#4a6348] hover:shadow-md active:shadow-xs`;

      case 'mocha':
        return isDark
          ? `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-amber-400/80 active:border-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`
          : `${basePhysics} bg-[#f5f1e6] hover:bg-white active:bg-[#F8F4EE] border-[#E4D9BC] hover:border-[#A37764] active:border-[#A37764] hover:shadow-md active:shadow-xs`;

      case 'amethyst-haze':
        return isDark
          ? `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-purple-400/80 active:border-fuchsia-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.28),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`
          : `${basePhysics} bg-[#fbf9fc] hover:bg-white active:bg-[#f4edf9] border-[#d8d3e2] hover:border-[#7e739f] active:border-[#5f547d] hover:shadow-md active:shadow-xs`;

      case 'slate-haze':
      default:
        return isDark
          ? `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-sky-400/80 active:border-sky-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(56,189,248,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`
          : `${basePhysics} bg-[#f9fcff] hover:bg-white active:bg-[#f3f7fc] border-[#d8dfe9] hover:border-[#87909d]/60 active:border-[#87909d] hover:shadow-md active:shadow-xs`;
    }
  };

  // Helper styling for the "HOT" cover badge tailored to each theme (Không dùng Glassmorphism ở theme tối)
  const getHotBadgeStyle = (th: NovelThemeId, isDark: boolean) => {
    switch (th) {
      case 'slate-haze':
        return isDark
          ? 'bg-sky-600 text-white border border-sky-400/80 shadow-xs font-bold'
          : 'bg-[#87909d] text-white border-slate-400/30 shadow-sm';
      case 'sage':
        return isDark
          ? 'bg-emerald-600 text-white border border-emerald-400/80 shadow-xs font-bold'
          : 'bg-stone-900/80 text-stone-100 border-stone-400/30 shadow-sm';
      case 'mocha':
        return isDark
          ? 'bg-amber-600 text-white border border-amber-400/80 shadow-xs font-bold'
          : 'bg-stone-900/85 text-[#F8F4EE] border-[#A37764]/60 shadow-sm';
      case 'notebook':
        return isDark
          ? 'bg-neutral-800 text-[#F7F4EE] border border-neutral-600 shadow-xs font-bold'
          : 'bg-[#737373] text-white border-[#e5e5e5]/50 shadow-sm';
      case 'amethyst-haze':
        return isDark
          ? 'bg-purple-600 text-white border border-purple-400/80 shadow-xs font-bold'
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
              ? 'bg-sky-950 text-sky-200 border border-sky-600/50 shadow-xs'
              : 'bg-[#1e293b] text-white border border-[#0f172a] shadow-xs')
          : (isDark
              ? 'bg-slate-900 text-slate-300 border border-slate-700 shadow-xs'
              : 'bg-slate-100 text-slate-700 border border-slate-300 shadow-xs');
      case 'sage':
        return isOngoing
          ? (isDark
              ? 'bg-emerald-950 text-emerald-200 border border-emerald-600/50 shadow-xs'
              : 'bg-[#354b33] text-white border border-[#273826] shadow-xs')
          : (isDark
              ? 'bg-[#0d2217] text-emerald-300/80 border border-emerald-800/60 shadow-xs'
              : 'bg-[#edf3ec] text-[#344832] border border-[#cad8c6] shadow-xs');
      case 'mocha':
        return isOngoing
          ? (isDark
              ? 'bg-amber-950 text-amber-200 border border-amber-600/50 shadow-xs'
              : 'bg-[#805543] text-white border border-[#6b4535] shadow-xs')
          : (isDark
              ? 'bg-[#25150d] text-[#e0cbbe] border border-[#543b2f]/60 shadow-xs'
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
              ? 'bg-purple-950 text-purple-200 border border-purple-600/50 shadow-xs'
              : 'bg-[#594970] text-white border border-[#443657] shadow-xs')
          : (isDark
              ? 'bg-[#1e122d] text-purple-200/80 border border-purple-800/60 shadow-xs'
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
              ? 'bg-sky-950 text-sky-200 border border-sky-600/50 shadow-xs'
              : 'bg-slate-100 text-slate-800 border-slate-300 shadow-2xs font-semibold')
          : (isDark
              ? 'bg-slate-900 text-slate-200 border border-slate-700 shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 shadow-2xs');
      case 'sage':
        return isOngoing
          ? (isDark
              ? 'bg-emerald-950 text-emerald-200 border border-emerald-600/50 shadow-xs'
              : 'bg-stone-100 text-stone-800 border-stone-300 shadow-2xs font-semibold')
          : (isDark
              ? 'bg-[#0d2217] text-emerald-200 border border-emerald-800/60 shadow-xs'
              : 'bg-stone-50 text-stone-600 border-stone-200 shadow-2xs');
      case 'mocha':
        return isOngoing
          ? (isDark
              ? 'bg-amber-950 text-amber-200 border border-amber-600/50 shadow-xs'
              : 'bg-[#F8F4EE] text-[#A37764] border-[#A37764]/40 font-bold shadow-2xs')
          : (isDark
              ? 'bg-[#25150d] text-[#f5ede4] border border-[#543b2f]/60 shadow-xs'
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
              ? 'bg-purple-950 text-purple-200 border border-purple-600/50 shadow-xs'
              : 'bg-stone-100 text-stone-800 border-stone-300 shadow-2xs font-semibold')
          : (isDark
              ? 'bg-[#1e122d] text-purple-200 border border-purple-800/60 shadow-xs'
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
            ? 'bg-gradient-to-tr from-cyan-400 to-sky-300 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
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
            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-stone-950 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
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
            ? 'bg-gradient-to-tr from-purple-500 to-fuchsia-400 text-stone-950 shadow-[0_0_10px_rgba(192,132,252,0.4)]'
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

  // Helper styling for completed novel category filter tabs (Nút phân loại mục Tiểu Thuyết Đã Hoàn)
  // - Ở theme frost chế độ sáng: chuyển màu nút thành giống màu nút "BẤM CHỌN" (#87909d)
  // - Ở tất cả theme ở chế độ tối: màu nút giống màu chủ đạo của từng theme, không dùng gradient, phát sáng mạnh hơn ở hai bên trái phải (horizontal box-shadow)
  const getCompletedCategoryTabsStyles = (th: NovelThemeId, isDark: boolean) => {
    if (!isDark) {
      // Theme sáng: Nền sáng cho thanh container với đổ bóng chìm (shadow-inner) chuẩn theo ảnh 097.png, màu nút active là màu chủ đạo của theme
      switch (th) {
        case 'slate-haze':
          return {
            container: 'bg-[#f3f7fc] border-[#d8dfe9] shadow-inner',
            activePill: 'bg-[#87909d] border border-[#767f8c] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-[#64748b] hover:text-[#101723]',
          };
        case 'sage':
          return {
            container: 'bg-[#f0f4ef] border-[#cad8c6] shadow-inner',
            activePill: 'bg-[#466244] border border-[#384937] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-[#556953] hover:text-[#1c261b]',
          };
        case 'mocha':
          return {
            container: 'bg-[#f5f1e6] border-[#E4D9BC] shadow-inner',
            activePill: 'bg-[#A37764] border border-[#8c5f4d] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-[#7d675e] hover:text-[#2a1d17]',
          };
        case 'amethyst-haze':
          return {
            container: 'bg-[#f7f5fb] border-[#dcd6e8] shadow-inner',
            activePill: 'bg-[#6b5f82] border border-[#594d70] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-[#6b5e7d] hover:text-[#251d30]',
          };
        case 'notebook':
          return {
            container: 'bg-[#f5f5f5] border-[#e5e5e5] shadow-inner',
            activePill: 'bg-[#262626] border border-[#171717] shadow-xs',
            activeText: 'text-white font-bold',
            inactiveText: 'text-[#525252] hover:text-[#171717]',
          };
        case 'cosmic':
        default:
          return {
            container: 'bg-[#faf7ff] border-[#e9d5ff] shadow-inner',
            activePill: 'bg-[#7c3aed] border border-[#6d28d9] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-purple-700 hover:text-purple-950',
          };
      }
    }

    // Theme tối: Hiệu ứng Neumorphism tinh tế cho dãy nút, bỏ hoàn toàn phát sáng neon
    switch (th) {
      case 'slate-haze':
        return {
          container: 'bg-[#090d16] border-[#1e293b] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6),inset_-1px_-1px_3px_rgba(255,255,255,0.05)]',
          activePill: 'bg-[#0284c7] border border-sky-400/30 shadow-[3px_3px_8px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.08),inset_1px_1px_1px_rgba(255,255,255,0.15)]',
          activeText: 'text-white font-bold',
          inactiveText: 'text-slate-400 hover:text-cyan-200',
        };
      case 'sage':
        return {
          container: 'bg-[#04150f] border-[#064e3b]/70 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6),inset_-1px_-1px_3px_rgba(255,255,255,0.05)]',
          activePill: 'bg-[#15803d] border border-emerald-400/30 shadow-[3px_3px_8px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.08),inset_1px_1px_1px_rgba(255,255,255,0.15)]',
          activeText: 'text-white font-bold',
          inactiveText: 'text-emerald-300/60 hover:text-emerald-200',
        };
      case 'amethyst-haze':
        return {
          container: 'bg-[#110a1c] border-[#3b1754]/70 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6),inset_-1px_-1px_3px_rgba(255,255,255,0.05)]',
          activePill: 'bg-[#7e22ce] border border-purple-400/30 shadow-[3px_3px_8px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.08),inset_1px_1px_1px_rgba(255,255,255,0.15)]',
          activeText: 'text-white font-bold',
          inactiveText: 'text-purple-300/60 hover:text-purple-200',
        };
      case 'mocha':
        return {
          container: 'bg-[#140b07] border-[#3d2417]/70 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6),inset_-1px_-1px_3px_rgba(255,255,255,0.05)]',
          activePill: 'bg-[#b45309] border border-amber-400/30 shadow-[3px_3px_8px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.08),inset_1px_1px_1px_rgba(255,255,255,0.15)]',
          activeText: 'text-white font-bold',
          inactiveText: 'text-amber-300/60 hover:text-amber-200',
        };
      case 'notebook':
        return {
          container: 'bg-[#0a0d14] border-[#1e293b]/70 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6),inset_-1px_-1px_3px_rgba(255,255,255,0.05)]',
          activePill: 'bg-[#3f3f46] border border-zinc-500/40 shadow-[3px_3px_8px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.08),inset_1px_1px_1px_rgba(255,255,255,0.15)]',
          activeText: 'text-white font-bold',
          inactiveText: 'text-zinc-400 hover:text-zinc-200',
        };
      case 'cosmic':
      default:
        return {
          container: 'bg-[#0a0c24] border-[#1e1b4b]/70 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6),inset_-1px_-1px_3px_rgba(255,255,255,0.05)]',
          activePill: 'bg-[#7c3aed] border border-indigo-400/30 shadow-[3px_3px_8px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.08),inset_1px_1px_1px_rgba(255,255,255,0.15)]',
          activeText: 'text-white font-bold',
          inactiveText: 'text-purple-300/60 hover:text-purple-200',
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
            gridColor: 'rgba(56, 189, 248, 0.09)',
            heroRimBg: 'bg-[#0f1724]',
            outerBg: 'bg-[#0d1520]/95',
            outerBorder: 'border-sky-500/40',
            heroOuterBorder: 'border border-sky-500/40',
            heroInnerDashed: 'border border-dashed border-sky-400/35',
            heroGenreColor: 'text-sky-300/80',
            heroTitleColor: 'text-sky-100',
            heroMetaColor: 'text-sky-300/70',
            heroOrnamentColor: 'text-sky-400/80',
            cardBg: 'bg-[#0f1926]/95',
            cardBorder: 'border-sky-500/40',
            polaroidBg: 'bg-[#152233] border-sky-400/40 text-sky-100',
            starColor: 'text-sky-400/85',
            ornamentText: 'text-sky-300/70',
            bowColor: 'text-sky-300/70',
            tapeColor: 'bg-sky-950/70 border-sky-800/50 text-sky-300',
            pushpin: 'bg-zinc-800 border-sky-400',
            dotActive: 'bg-sky-400',
            dotInactive: 'bg-sky-900',
            arrowBtn: 'bg-[#162232] text-sky-100 border-sky-600/50 hover:bg-sky-900/60',
            badgeBg: 'bg-white/10 text-sky-200 border-white/10',
            heartColor: 'text-sky-400',
          };
        case 'mocha':
          return {
            dotColor: 'rgba(251, 191, 36, 0.08)',
            gridColor: 'rgba(251, 191, 36, 0.09)',
            heroRimBg: 'bg-[#1b1511]',
            outerBg: 'bg-[#171310]/95',
            outerBorder: 'border-amber-600/40',
            heroOuterBorder: 'border border-amber-600/40',
            heroInnerDashed: 'border border-dashed border-amber-500/35',
            heroGenreColor: 'text-amber-300/80',
            heroTitleColor: 'text-amber-100',
            heroMetaColor: 'text-amber-300/70',
            heroOrnamentColor: 'text-amber-400/80',
            cardBg: 'bg-[#1c1713]/95',
            cardBorder: 'border-amber-600/40',
            polaroidBg: 'bg-[#271f1a] border-amber-500/40 text-amber-100',
            starColor: 'text-amber-400/85',
            ornamentText: 'text-amber-300/70',
            bowColor: 'text-amber-300/70',
            tapeColor: 'bg-amber-950/70 border-amber-800/50 text-amber-300',
            pushpin: 'bg-zinc-800 border-amber-400',
            dotActive: 'bg-amber-400',
            dotInactive: 'bg-amber-900',
            arrowBtn: 'bg-[#261e19] text-amber-100 border-amber-600/50 hover:bg-amber-900/60',
            badgeBg: 'bg-white/10 text-amber-200 border-white/10',
            heartColor: 'text-amber-400',
          };
        case 'sage':
          return {
            dotColor: 'rgba(110, 231, 183, 0.08)',
            gridColor: 'rgba(52, 211, 153, 0.09)',
            heroRimBg: 'bg-[#111c14]',
            outerBg: 'bg-[#0e1711]/95',
            outerBorder: 'border-emerald-500/40',
            heroOuterBorder: 'border border-emerald-500/40',
            heroInnerDashed: 'border border-dashed border-emerald-400/35',
            heroGenreColor: 'text-emerald-300/80',
            heroTitleColor: 'text-emerald-100',
            heroMetaColor: 'text-emerald-300/70',
            heroOrnamentColor: 'text-emerald-400/80',
            cardBg: 'bg-[#111c15]/95',
            cardBorder: 'border-emerald-500/40',
            polaroidBg: 'bg-[#17261d] border-emerald-400/40 text-emerald-100',
            starColor: 'text-emerald-400/85',
            ornamentText: 'text-emerald-300/70',
            bowColor: 'text-emerald-300/70',
            tapeColor: 'bg-emerald-950/70 border-emerald-800/50 text-emerald-300',
            pushpin: 'bg-zinc-800 border-emerald-400',
            dotActive: 'bg-emerald-400',
            dotInactive: 'bg-emerald-900',
            arrowBtn: 'bg-[#18261e] text-emerald-100 border-emerald-600/50 hover:bg-emerald-900/60',
            badgeBg: 'bg-white/10 text-emerald-200 border-white/10',
            heartColor: 'text-emerald-400',
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
            gridColor: 'rgba(192, 132, 252, 0.09)',
            heroRimBg: 'bg-[#161322]',
            outerBg: 'bg-[#13111c]/95',
            outerBorder: 'border-purple-500/40',
            heroOuterBorder: 'border border-purple-500/45',
            heroInnerDashed: 'border border-dashed border-purple-400/35',
            heroGenreColor: 'text-purple-300/80',
            heroTitleColor: 'text-purple-100',
            heroMetaColor: 'text-purple-300/70',
            heroOrnamentColor: 'text-purple-400/80',
            cardBg: 'bg-[#161322]/95',
            cardBorder: 'border-purple-500/40',
            polaroidBg: 'bg-[#1e192c] border-purple-400/40 text-purple-100',
            starColor: 'text-purple-400/85',
            ornamentText: 'text-purple-300/60',
            bowColor: 'text-purple-300/70',
            tapeColor: 'bg-purple-950/70 border-purple-800/40 text-purple-300',
            pushpin: 'bg-zinc-800 border-purple-400',
            dotActive: 'bg-purple-400',
            dotInactive: 'bg-zinc-700',
            arrowBtn: 'bg-zinc-800/90 text-zinc-200 border-zinc-700 hover:bg-zinc-700',
            badgeBg: 'bg-white/10 text-zinc-200 border-white/10',
            heartColor: 'text-purple-400',
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
    // Tối đa 5 truyện cho mục Hero trang chủ theo yêu cầu của người dùng
    return novels.slice(0, 5);
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
  const isCosmic = theme === 'cosmic' || (theme === 'amethyst-haze' && isDarkMode);
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

  // Cấu hình phong cách cho nút "GIỚI THIỆU VỀ TRANG WEB" với đầy đủ 4 chuẩn hiệu ứng:
  // 1. Viền chuyển sắc động (Animated Gradient Flow Border - 4.2s cycle, 250% 250% size, shadow-xs -> group-hover:shadow-sm)
  // 2. Lớp đệm hào quang nhịp thở (Motion Halo Cushion - 1.6s cycle, scale 0.99->1.025)
  // 5. Phản hồi nén cơ học khi nhấn (Tactile Active Scale - 200ms active:scale-95)
  // 7. Thích ứng thông minh theo 6 Theme giao diện (Dark mode nền sâu dạ quang; Light mode viền pastel kem dịu, riêng theme white trung tính sạch)
  const introButtonStyles = useMemo(() => {
    if (isCosmic) {
      return {
        btnBg: '#1f0b3b',
        textColor: 'text-white',
        borderGradient: 'bg-gradient-to-r from-[#2e1065] via-[#a855f7] via-[#ec4899] to-[#06b6d4] animate-gradient-flow',
        borderShadow: 'shadow-[0_0_8px_rgba(168,85,247,0.45)] hover:shadow-[0_0_12px_rgba(236,72,153,0.7)] group-hover:shadow-[0_0_12px_rgba(236,72,153,0.7)]',
        innerShadow: 'shadow-xs',
        haloCushion: 'bg-gradient-to-r from-purple-600/40 via-fuchsia-500/30 to-cyan-500/40',
        dotColor: 'bg-cyan-300',
        dotPing: 'bg-pink-400',
      };
    }

    switch (theme) {
      case 'sage':
        return isDarkEffective
          ? {
              btnBg: '#04231b',
              textColor: 'text-emerald-50',
              borderGradient: 'bg-gradient-to-r from-[#064e3b] via-[#10b981] via-[#34d399] to-[#14b8a6] animate-gradient-flow',
              borderShadow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)] hover:shadow-[0_0_12px_rgba(52,211,153,0.65)] group-hover:shadow-[0_0_12px_rgba(52,211,153,0.65)]',
              innerShadow: 'shadow-xs',
              haloCushion: 'bg-gradient-to-r from-emerald-600/40 via-teal-500/30 to-green-500/40',
              dotColor: 'bg-emerald-300',
              dotPing: 'bg-emerald-400',
            }
          : {
              btnBg: '#f7faf7',
              textColor: 'text-[#2a442d]',
              borderGradient: 'bg-gradient-to-r from-[#c6d7c4] via-[#dce8db] to-[#bed0bd]',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-[#c6d7c4]/30',
              dotColor: 'bg-[#3b5e3d]',
              dotPing: 'bg-[#7ca37e]',
            };

      case 'notebook':
        return isDarkEffective
          ? {
              btnBg: '#18181b',
              textColor: 'text-zinc-100',
              borderGradient: 'bg-gradient-to-r from-[#27272a] via-[#71717a] via-[#a1a1aa] to-[#e4e4e7] animate-gradient-flow',
              borderShadow: 'shadow-[0_0_8px_rgba(212,212,216,0.35)] hover:shadow-[0_0_12px_rgba(244,244,245,0.6)] group-hover:shadow-[0_0_12px_rgba(244,244,245,0.6)]',
              innerShadow: 'shadow-xs',
              haloCushion: 'bg-gradient-to-r from-zinc-500/35 via-zinc-400/25 to-zinc-600/35',
              dotColor: 'bg-zinc-200',
              dotPing: 'bg-zinc-400',
            }
          : {
              btnBg: '#ffffff',
              textColor: 'text-neutral-700',
              borderGradient: 'bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-neutral-200/40',
              dotColor: 'bg-neutral-600',
              dotPing: 'bg-neutral-400',
            };

      case 'mocha':
        return isDarkEffective
          ? {
              btnBg: '#2a1104',
              textColor: 'text-amber-50',
              borderGradient: 'bg-gradient-to-r from-[#451a03] via-[#d97706] via-[#f59e0b] to-[#fbbf24] animate-gradient-flow',
              borderShadow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)] hover:shadow-[0_0_12px_rgba(251,191,36,0.65)] group-hover:shadow-[0_0_12px_rgba(251,191,36,0.65)]',
              innerShadow: 'shadow-xs',
              haloCushion: 'bg-gradient-to-r from-amber-600/40 via-orange-500/30 to-amber-400/40',
              dotColor: 'bg-amber-300',
              dotPing: 'bg-orange-400',
            }
          : {
              btnBg: '#faf8f5',
              textColor: 'text-[#473b33]',
              borderGradient: 'bg-gradient-to-r from-[#ded5cb] via-[#ebe4dc] to-[#d6cbbf]',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-[#ded5cb]/30',
              dotColor: 'bg-[#6d5648]',
              dotPing: 'bg-[#b39b8c]',
            };

      case 'amethyst-haze':
        return isDarkEffective
          ? {
              btnBg: '#23053d',
              textColor: 'text-purple-50',
              borderGradient: 'bg-gradient-to-r from-[#3b0764] via-[#9333ea] via-[#c084fc] to-[#e879f9] animate-gradient-flow',
              borderShadow: 'shadow-[0_0_8px_rgba(168,85,247,0.4)] hover:shadow-[0_0_12px_rgba(192,132,252,0.65)] group-hover:shadow-[0_0_12px_rgba(192,132,252,0.65)]',
              innerShadow: 'shadow-xs',
              haloCushion: 'bg-gradient-to-r from-purple-600/40 via-fuchsia-600/30 to-purple-400/40',
              dotColor: 'bg-purple-300',
              dotPing: 'bg-fuchsia-400',
            }
          : {
              btnBg: '#faf8fc',
              textColor: 'text-[#3f2e51]',
              borderGradient: 'bg-gradient-to-r from-[#dbd1e8] via-[#ebe3f4] to-[#d3c7e1]',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-[#dbd1e8]/30',
              dotColor: 'bg-[#6b5280]',
              dotPing: 'bg-[#ad97c2]',
            };

      case 'slate-haze':
      default:
        return isDarkEffective
          ? {
              btnBg: '#052233',
              textColor: 'text-sky-50',
              borderGradient: 'bg-gradient-to-r from-[#0c4a6e] via-[#0284c7] via-[#38bdf8] to-[#67e8f9] animate-gradient-flow',
              borderShadow: 'shadow-[0_0_8px_rgba(56,189,248,0.4)] hover:shadow-[0_0_12px_rgba(103,232,249,0.65)] group-hover:shadow-[0_0_12px_rgba(103,232,249,0.65)]',
              innerShadow: 'shadow-xs',
              haloCushion: 'bg-gradient-to-r from-sky-600/40 via-cyan-500/30 to-blue-400/40',
              dotColor: 'bg-sky-300',
              dotPing: 'bg-cyan-400',
            }
          : {
              btnBg: '#f8fafc',
              textColor: 'text-[#243a49]',
              borderGradient: 'bg-gradient-to-r from-[#cde0ec] via-[#deedf6] to-[#c4d7e4]',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-[#cde0ec]/30',
              dotColor: 'bg-[#3a6077]',
              dotPing: 'bg-[#7fa5be]',
            };
    }
  }, [theme, isDarkEffective, isCosmic]);

  // Cấu hình phong cách cho nút "XEM THÊM / THU GỌN" với cơ chế vật lý 3D chân thực (.hv-11__btn--stack)
  const expandButtonStyles = useMemo(() => {
    if (isCosmic) {
      return {
        btnBg: '#2a1154',
        btnBorder: 'border-purple-500/60 hover:border-purple-400',
        textColor: 'text-purple-100',
        shadowColor: '#120529',
      };
    }

    if (isDarkEffective) {
      switch (theme) {
        case 'sage':
          return {
            btnBg: '#064e3b',
            btnBorder: 'border-emerald-600/60 hover:border-emerald-500',
            textColor: 'text-emerald-100',
            shadowColor: '#02261d',
          };
        case 'mocha':
          return {
            btnBg: '#451a03',
            btnBorder: 'border-amber-700/60 hover:border-amber-600',
            textColor: 'text-amber-100',
            shadowColor: '#200b01',
          };
        case 'amethyst-haze':
          return {
            btnBg: '#3b0764',
            btnBorder: 'border-purple-700/60 hover:border-purple-600',
            textColor: 'text-purple-100',
            shadowColor: '#1c0330',
          };
        case 'notebook':
          return {
            btnBg: '#27272a',
            btnBorder: 'border-zinc-600 hover:border-zinc-500',
            textColor: 'text-zinc-100',
            shadowColor: '#121215',
          };
        case 'slate-haze':
        default:
          return {
            btnBg: '#0c4a6e',
            btnBorder: 'border-sky-700/60 hover:border-sky-600',
            textColor: 'text-sky-100',
            shadowColor: '#032438',
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
    () => getCompletedCategoryTabsStyles(theme, isDarkEffective),
    [theme, isDarkEffective]
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
            {/* Dark Mode Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs ${tStyles.buttonDarkMode}`}
              title={
                isDarkEffective
                  ? 'Tắt Dark Mode (Trở lại màu sáng)'
                  : 'Bật Dark Mode (Chuyển sang chế độ tối)'
              }
            >
              {isDarkEffective ? (
                <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              )}
            </button>

            {/* Theme Selector Popover (5 Themes) - Thu gọn lại, bỏ icon mũi tên chỉa xuống */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${tStyles.themeSelectorBtn}`}
                title="Thay đổi giao diện màu sắc"
                aria-label="Thay đổi giao diện màu sắc"
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{currentThemeOption.name}</span>
              </button>

              {isThemeMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-xl p-2 shadow-xl border z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isDarkEffective ? 'bg-[#181a20] border-zinc-700 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                >
                  <div className="px-2 py-1 border-b border-zinc-500/20 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Màu Giao Diện</span>
                    <span className="text-[9px] font-normal normal-case opacity-70">Sáng / Tối</span>
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

                  {/* Toggle tắt/bật Hiệu ứng nền của chế độ tối theme Purple */}
                  {(theme === 'amethyst-haze' || theme === 'cosmic') && isDarkEffective && (
                    <div className="mt-2 pt-2 border-t border-zinc-500/20">
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
                        title={purpleBgEffectsEnabled ? 'Nhấn để tắt hiệu ứng nền của chế độ tối theme Purple' : 'Nhấn để bật hiệu ứng nền của chế độ tối theme Purple'}
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-[11px] sm:text-xs">Hiệu ứng nền</span>
                        </div>
                        <div
                          className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
                            purpleBgEffectsEnabled ? 'bg-purple-600' : 'bg-zinc-700'
                          }`}
                        >
                          <div
                            className={`bg-white w-3.5 h-3.5 rounded-full shadow-xs transform transition-transform duration-200 ${
                              purpleBgEffectsEnabled ? 'translate-x-3.5' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </button>
                    </div>
                  )}
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
      {/* HERO FEATURED BANNER - EXACT REPLICA OF THE DESIGN & MULTI-THEME SUPPORT  */}
      {/* Desktop: Cover on the Right. Mobile: Cover at the very Top                */}
      {/* ========================================================================= */}
      {currentHeroNovel && (
        <section className="relative pt-4 sm:pt-6 pb-8 sm:pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Nút GIỚI THIỆU VỀ TRANG WEB nằm trên mục truyện nổi bật (Animated Gradient Flow Border, Halo Cushion, Tactile Active Scale & Adaptive Theming) */}
          <div className="mb-4 sm:mb-5 pt-1 pb-2 flex items-center justify-between">
            <div className="group relative inline-flex items-center">
              {/* 2. Hiệu ứng Lớp đệm hào quang nhịp thở (Motion Halo Cushion) */}
              <div 
                className={`absolute -inset-0.5 rounded-full pointer-events-none animate-halo-cushion blur-xs transition duration-500 ${introButtonStyles.haloCushion}`}
              />

              {/* 1. Nút với Khung viền chuyển sắc động 1px (Animated Gradient Flow Border) + 5. Phản hồi nén cơ học khi nhấn (Tactile Active Scale) */}
              <button
                id="btn-intro-about-website"
                onClick={() => {
                  if (onOpenLightIntro) {
                    onOpenLightIntro();
                  } else {
                    onBackToPortfolio();
                  }
                }}
                className={`relative z-10 p-[1px] rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer select-none ${introButtonStyles.borderGradient} ${introButtonStyles.borderShadow}`}
                title="Khám phá giới thiệu về trang web và hồ sơ tác giả sáng lập"
              >
                {/* Lớp ruột của nút mang màu nền theo theme + lớp đổ bóng shadow-xs -> group-hover:shadow-sm */}
                <span
                  className={`relative flex items-center gap-2.5 px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wide overflow-hidden ${introButtonStyles.textColor} ${introButtonStyles.innerShadow}`}
                  style={{
                    backgroundColor: introButtonStyles.btnBg,
                  }}
                >
                  {/* Hiệu ứng Vệt sáng lướt ngang (Soft Shimmer Sweep) */}
                  <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none z-20">
                    <span className="absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer-sweep" />
                  </span>

                  {/* Chấm tròn phát tín hiệu Live Ping Dot (2 lớp mượt mà) */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0 z-30">
                    <span
                      className={`animate-ping-smooth absolute inline-flex h-full w-full rounded-full opacity-75 ${introButtonStyles.dotPing}`}
                    />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 shadow-xs ${introButtonStyles.dotColor}`} />
                  </span>

                  {/* Tiêu đề nút */}
                  <span className="relative z-30 font-bold tracking-wider uppercase">
                    GIỚI THIỆU VỀ TRANG WEB
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Khung Hero Section: Mobile giữ nguyên kích thước, Máy tính kéo rộng tối đa */}
          <div className="relative w-full max-w-4xl md:max-w-none mx-auto px-2 sm:px-4 md:px-0">
            {/* Nút mũi tên điều hướng Trái */}
            <button
              id="hero-prev-btn"
              onClick={handlePrevFeatured}
              aria-label="Truyện trước"
              className={`absolute -left-2 sm:-left-6 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 border ${getThemePastelPalette(theme, isDarkEffective).arrowBtn}`}
              style={{
                boxShadow: isDarkEffective
                  ? '4px 6px 16px rgba(0, 0, 0, 0.4), -3px -3px 10px rgba(255, 255, 255, 0.04)'
                  : '4px 6px 14px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.95)',
              }}
              title="Truyện trước"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Nút mũi tên điều hướng Phải */}
            <button
              id="hero-next-btn"
              onClick={handleNextFeatured}
              aria-label="Truyện tiếp theo"
              className={`absolute -right-2 sm:-right-6 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 border ${getThemePastelPalette(theme, isDarkEffective).arrowBtn}`}
              style={{
                boxShadow: isDarkEffective
                  ? '4px 6px 16px rgba(0, 0, 0, 0.4), -3px -3px 10px rgba(255, 255, 255, 0.04)'
                  : '4px 6px 14px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.95)',
              }}
              title="Truyện tiếp theo"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Container chính của Hero Card: Nền giữa viền ngoài và viền nét đứt linh hoạt theo theme (sáng: trắng, tối: màu tối theo theme), hiệu ứng Neumorphism nhẹ */}
            <div
              className={`relative rounded-[28px] sm:rounded-[36px] p-2 sm:p-2.5 md:p-3.5 lg:p-4 transition-all duration-300 ${getThemePastelPalette(theme, isDarkEffective).heroRimBg} ${getThemePastelPalette(theme, isDarkEffective).heroOuterBorder}`}
              style={{
                boxShadow: isDarkEffective
                  ? '10px 16px 36px -4px rgba(0, 0, 0, 0.5), -6px -6px 20px rgba(255, 255, 255, 0.04), inset 1px 1px 1px rgba(255, 255, 255, 0.08)'
                  : '10px 18px 36px -4px rgba(0, 0, 0, 0.07), -10px -10px 28px rgba(255, 255, 255, 0.95), inset 1px 1px 2px rgba(255, 255, 255, 0.9)',
              }}
            >
              {/* Khung viền đứt đoạn ở bên trong đường viền nét liền, cách đều, có họa tiết dấu chấm mờ */}
              <div
                className={`relative rounded-[20px] sm:rounded-[28px] p-4 sm:p-6 md:p-8 lg:p-10 ${getThemePastelPalette(theme, isDarkEffective).outerBg} ${getThemePastelPalette(theme, isDarkEffective).heroInnerDashed}`}
                style={{
                  backgroundImage: `linear-gradient(to right, ${getThemePastelPalette(theme, isDarkEffective).gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${getThemePastelPalette(theme, isDarkEffective).gridColor} 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  boxShadow: isDarkEffective
                    ? 'inset 2px 2px 8px rgba(0, 0, 0, 0.3)'
                    : 'inset 2px 2px 8px rgba(0, 0, 0, 0.03), inset -2px -2px 8px rgba(255, 255, 255, 0.6)',
                }}
              >
                {/* 4 Ngôi sao trang trí ở 4 góc như ảnh mẫu */}
                <span className={`absolute top-2.5 left-3 text-xs sm:text-sm select-none pointer-events-none ${getThemePastelPalette(theme, isDarkEffective).ornamentText}`}>✧</span>
                <span className={`absolute top-2.5 right-3 text-xs sm:text-sm select-none pointer-events-none ${getThemePastelPalette(theme, isDarkEffective).ornamentText}`}>✧</span>
                <span className={`absolute bottom-2.5 left-3 text-xs sm:text-sm select-none pointer-events-none ${getThemePastelPalette(theme, isDarkEffective).ornamentText}`}>✧</span>
                <span className={`absolute bottom-2.5 right-3 text-xs sm:text-sm select-none pointer-events-none ${getThemePastelPalette(theme, isDarkEffective).ornamentText}`}>✧</span>

                {/* Cánh bướm trang trí 2 bên mép */}
                <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-xs select-none pointer-events-none hidden sm:inline ${getThemePastelPalette(theme, isDarkEffective).ornamentText}`}>ʚïɞ</span>
                <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-xs select-none pointer-events-none hidden sm:inline ${getThemePastelPalette(theme, isDarkEffective).ornamentText}`}>ʚïɞ</span>

                {/* Bố cục: Trên điện thoại xếp dọc (bìa trên, nội dung dưới), trên máy tính bìa bên trái, nội dung dời sang phải */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-around lg:justify-between gap-5 sm:gap-7 md:gap-8 lg:gap-12">
                  
                  {/* Khung bìa dạng Polaroid / Ảnh chụp kỷ niệm */}
                  <div className="w-full md:w-auto max-w-[280px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] mx-auto md:mx-0 flex flex-col items-center shrink-0">
                    {/* Icon nơ ୨୧ nằm hẳn ở phía trên bìa, không đụng vào bìa, bỏ màu bao bọc, giữ lại icon */}
                    <div className="mb-2 sm:mb-2.5 flex items-center justify-center select-none pointer-events-none">
                      <span className={`text-base sm:text-lg font-serif tracking-widest ${getThemePastelPalette(theme, isDarkEffective).heroOrnamentColor}`}>
                        ୨୧
                      </span>
                    </div>

                    <div
                      onClick={() => onSelectNovel(currentHeroNovel)}
                      className={`group relative w-full rounded-[22px] sm:rounded-[26px] p-2.5 sm:p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border transition-all duration-300 cursor-pointer ${getThemePastelPalette(theme, isDarkEffective).polaroidBg}`}
                      title={`Đọc truyện: ${currentHeroNovel.title}`}
                    >
                      {/* Badge Ngày ở góc trên bên phải khung ảnh */}
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-medium shadow-xs border ${getThemePastelPalette(theme, isDarkEffective).badgeBg}`}>
                          {heroDateFormatted}
                        </span>
                      </div>

                      {/* Ảnh bìa truyện */}
                      <div className="relative aspect-square w-full rounded-[16px] sm:rounded-[20px] overflow-hidden bg-neutral-100 dark:bg-zinc-800 border border-black/5 dark:border-white/10">
                        <img
                          src={getDirectImageUrl(currentHeroNovel.coverImage, currentHeroNovel.id || currentHeroNovel.title)}
                          onError={(e) => handleCoverImageError(e, currentHeroNovel.id || currentHeroNovel.title)}
                          alt={currentHeroNovel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Họa tiết tim dưới đáy khung ảnh: ♡ · ♡ · ♡ */}
                      <div className={`text-center text-[10px] tracking-widest mt-2 select-none font-mono ${getThemePastelPalette(theme, isDarkEffective).ornamentText}`}>
                        ♡ · ♡ · ♡
                      </div>
                    </div>
                  </div>

                  {/* Phần nội dung chi tiết: Tên truyện căn giữa, khoảng cách phía trên và phía dưới rút ngắn lại nhiều hơn nữa */}
                  <div className="w-full md:flex-1 flex flex-col items-center justify-center text-center py-1 sm:py-2 px-1 sm:px-3 md:px-6 lg:px-10">
                    
                    {/* Mục trên: Dòng thể loại: ✧ GIAM CẦM ✧ */}
                    <div className={`font-lora !font-normal text-[10px] sm:text-[11px] tracking-[0.25em] uppercase select-none opacity-90 ${getThemePastelPalette(theme, isDarkEffective).heroGenreColor}`}>
                      ✧ {(currentHeroNovel.genres[0] || 'PHƯƠNG TÂY').toUpperCase()} ✧
                    </div>

                    {/* Tên truyện: NẰM CĂN GIỮA, KHOẢNG CÁCH TRÊN VÀ DƯỚI RÚT NGẮN LẠI NGẮN HƠN NỮA */}
                    <h2
                      onClick={() => onSelectNovel(currentHeroNovel)}
                      className={`font-lora !font-medium text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[35px] tracking-normal cursor-pointer hover:opacity-85 transition-opacity leading-snug my-1 sm:my-1.5 ${getThemePastelPalette(theme, isDarkEffective).heroTitleColor}`}
                    >
                      {currentHeroNovel.title}
                    </h2>

                    {/* Mục dưới: Thông tin tác giả, hoàn thành và hoa văn ♡ ୨୧ ♡ */}
                    <div className="space-y-1 sm:space-y-1.5">
                      {/* Tác giả: Phông Source Sans 3, font weight normal */}
                      <div className={`font-source-sans !font-normal text-[10px] sm:text-[11px] tracking-[0.14em] uppercase opacity-85 ${getThemePastelPalette(theme, isDarkEffective).heroMetaColor} select-none`}>
                        TÁC GIẢ: {String(typeof currentHeroNovel.author === 'string' ? currentHeroNovel.author : currentHeroNovel.author?.name || 'HẢI KINH LẠC').toUpperCase()}
                      </div>

                      {/* Hoàn thành & Số chương: Phông Source Sans 3, font weight normal */}
                      <div className={`font-source-sans !font-normal text-[10px] sm:text-[11px] tracking-[0.14em] uppercase opacity-85 ${getThemePastelPalette(theme, isDarkEffective).heroMetaColor} select-none`}>
                        HOÀN THÀNH  •  {currentHeroNovel.totalChaptersCount || currentHeroNovel.totalChapters || currentHeroNovel.chapters?.length || 0} CHƯƠNG
                      </div>

                      {/* Biểu tượng trang trí dưới cùng: ♡  ୨୧  ♡ */}
                      <div className={`text-base sm:text-lg tracking-widest pt-1 sm:pt-1.5 select-none flex items-center justify-center gap-2 ${getThemePastelPalette(theme, isDarkEffective).heroOrnamentColor}`}>
                        <span>♡</span>
                        <span className="text-sm sm:text-base">୨୧</span>
                        <span>♡</span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Chấm tròn chỉ số Carousel bên dưới (tối đa 5 truyện) */}
                <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
                  {featuredNovels.map((_, idx) => {
                    const isActive = featuredIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setFeaturedIndex(idx)}
                        className={`transition-all duration-300 cursor-pointer ${
                          isActive
                            ? `w-6 sm:w-7 h-2 rounded-full ${getThemePastelPalette(theme, isDarkEffective).dotActive}`
                            : `w-2 h-2 rounded-full ${getThemePastelPalette(theme, isDarkEffective).dotInactive}`
                        }`}
                        aria-label={`Chuyển sang truyện ${idx + 1}`}
                      />
                    );
                  })}
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content: Novel Grid + Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left 3 Cols: Novel Catalog */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* MỤC: TRUYỆN ĐỌC GẦN ĐÂY - THIẾT KẾ CHUẨN THEO ẢNH MẪU IMG_20260916_124252 */}
          {activeRecentReads.length > 0 && (() => {
            const currentRecent = activeRecentReads[recentIndex] || activeRecentReads[0];
            const estimate = getReadingEstimate(currentRecent.novel, currentRecent.record);
            const recentCardTheme = getRecentReadingCardTheme(theme, isDarkEffective);

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
                  {/* Hàng trên cùng: Đang đọc > và Chỉ số trang + Nút điều hướng (không lấy icon bảng màu) */}
                  <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
                    {/* Bên trái: Đang đọc > */}
                    <div
                      onClick={() => handleOpenReading(currentRecent.novel, currentRecent.record.chapterNumber)}
                      className="flex items-center gap-1.5 cursor-pointer select-none group"
                      title="Xem chi tiết truyện đang đọc"
                    >
                      <h3 className={`font-bold text-base sm:text-lg md:text-xl transition-opacity group-hover:opacity-80 ${recentCardTheme.titleText}`}>
                        Đang đọc
                      </h3>
                      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${recentCardTheme.chevronColor}`} />
                    </div>

                    {/* Bên phải: 1/5 và Nút điều hướng < > (KHÔNG có icon bảng màu) */}
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
                  </div>

                  {/* Hiệu ứng Chuyển cảnh Tuần tự (Sequential / Without Overlap - Chế độ mode="wait") */}
                  {/* Nguyên lý: "Thoát hoàn tất rồi mới Xuất hiện" (Exit first, then enter) */}
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
                  className={`inline-flex items-center p-1 sm:p-1.5 rounded-full border transition-all duration-300 ${completedCategoryTabsStyles.container}`}
                >
                  {NOVEL_CATEGORY_TABS.map((tab) => {
                    const isActive = selectedCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        id={`btn-tab-${tab.id}`}
                        onClick={() => {
                          setSelectedCategory(tab.id);
                        }}
                        className={`relative px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap rounded-full select-none ${
                          isActive
                            ? `${completedCategoryTabsStyles.activeText} font-bold`
                            : `${completedCategoryTabsStyles.inactiveText} font-medium`
                        }`}
                      >
                        {isActive && (
                          <div
                            className={`absolute inset-0 rounded-full z-0 ${completedCategoryTabsStyles.activePill}`}
                          />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                      </button>
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
                    className={`hv-11__btn--stack relative px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border select-none ${expandButtonStyles.btnBorder} ${expandButtonStyles.textColor}`}
                    style={{
                      backgroundColor: expandButtonStyles.btnBg,
                      ['--btn-stack-shadow' as any]: expandButtonStyles.shadowColor,
                    }}
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

                {/* Tiêu đề mục: TRUYỆN VỪA MỚI ĐĂNG (Kích thước nhỏ lại, phông Lora in nghiêng thanh lịch) */}
                <div className="text-center mb-5 sm:mb-8 relative z-10">
                  <h3 className={`font-lora italic !font-normal text-xs sm:text-[13px] md:text-sm tracking-[0.18em] uppercase ${tStyles.cardTitle}`}>
                    TRUYỆN VỪA MỚI ĐĂNG
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
                    className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none active:translate-y-[1px] ${
                      isDarkEffective
                        ? 'bg-[#221b2f] text-purple-200 border border-white/[0.08] shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40'
                        : 'bg-[#f7f5fb] text-[#4d3d63] border border-white/90 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.09)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.18),inset_0_-1px_1px_rgba(255,255,255,0.45)] active:border-black/[0.04]'
                    }`}
                    title="Trang trước"
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Nút "Đổi Bìa" */}
                  <button
                    type="button"
                    onClick={() => setPolaroidPage((prev) => (prev + 1) % totalPages)}
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all cursor-pointer select-none active:translate-y-[1px] ${
                      isDarkEffective
                        ? 'bg-[#221b2f] text-purple-200 border border-white/[0.08] shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40'
                        : 'bg-[#f7f5fb] text-[#4d3d63] border border-white/90 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.09)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.18),inset_0_-1px_1px_rgba(255,255,255,0.45)] active:border-black/[0.04]'
                    }`}
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
                    className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none active:translate-y-[1px] ${
                      isDarkEffective
                        ? 'bg-[#221b2f] text-purple-200 border border-white/[0.08] shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40'
                        : 'bg-[#f7f5fb] text-[#4d3d63] border border-white/90 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.09)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.18),inset_0_-1px_1px_rgba(255,255,255,0.45)] active:border-black/[0.04]'
                    }`}
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

        {/* Right 1 Col: Leaderboards & Community Ticker */}
        <div className="space-y-6">
          
          {/* Mục "Chọn Truyện Ngẫu Nhiên" / "Hôm Nay Đọc Gì" */}
          <RandomNovelPicker
            novels={novels}
            onSelectNovel={onSelectNovel}
            tStyles={tStyles}
            theme={theme}
            isDarkMode={isDarkEffective}
          />

          {/* Leaderboard Card */}
          <div className={`p-6 rounded-3xl space-y-4 transition-colors duration-200 ${tStyles.sideCard}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-bold ${themeFontHeading} flex items-center gap-2 ${tStyles.cardTitle}`}>
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Bảng Xếp Hạng Truyện</span>
              </h3>
            </div>

            {/* Top ranked items */}
            <div className="space-y-2.5">
              {rankedNovels.slice(0, 5).map((n, idx) => {
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      onSelectNovel(n);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-2.5 rounded-2xl flex items-center gap-3 group ${getHoverPressLiftBorderRevealStyle(
                      theme,
                      isDarkEffective
                    )}`}
                  >
                    {/* Rank Badge */}
                    <div
                      className={`w-6 h-6 rounded-lg font-mono font-black text-xs flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 group-active:scale-95 ${getRankMedalStyle(
                        idx,
                        theme,
                        isDarkEffective,
                        tStyles.leaderboardRankBadge
                      )}`}
                    >
                      {idx + 1}
                    </div>

                    <img
                      src={getDirectImageUrl(n.coverImage, n.id || n.title)}
                      onError={(e) => handleCoverImageError(e, n.id || n.title)}
                      alt={n.title}
                      className="w-10 h-14 rounded-lg object-cover shrink-0 transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-novel-title transition-colors truncate ${tStyles.cardTitle} ${tStyles.cardTitleHover}`}>
                        {n.title}
                      </h4>
                      <span className={`text-[10px] block truncate ${tStyles.cardAuthor}`}>
                        {n.author.name}
                      </span>
                      <div className={`text-[10px] font-sans font-medium flex items-center gap-1.5 opacity-80 ${tStyles.badgeText}`}>
                        <span>Hoàn thành</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
      />

    </div>
  );
};
