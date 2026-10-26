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
  Heart,
  Share2,
  Menu,
  X,
} from 'lucide-react';
import { Novel, NovelGenre, DarkBackgroundOption, DARK_BG_OPTIONS } from '../types';
import { AdminUserLike } from '../services/firebase';
import { cosmicAudio } from '../utils/audioSynth';
import { NOVEL_GENRES } from '../data/novelData';
import { NovelThemeId, NOVEL_THEME_OPTIONS, getNovelThemeStyles, getRecentUpdatesCardStyles } from '../utils/themeStyles';
import { ClayThemeToggle } from './ClayThemeToggle';
import { WebLogo } from './WebLogo';
import { RandomNovelPicker } from './RandomNovelPicker';
import { CrescentCelestialOrb } from './CrescentCelestialOrb';
import { IntroAboutButton, ClassicIntroAboutButton } from './IntroAboutButton';
import { useHeaderScroll } from '../utils/useHeaderScroll';
import { Footer } from './Footer';
import { CosmicStarsBackground } from './CosmicStarsBackground';
import SugarTodayWidget from './SugarTodayWidget';
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

export const MENU_HEART_PALETTE = [
  { id: 'sky', name: 'Lam Sương', color: '#487cb5' },
  { id: 'rose', name: 'Hồng Đào', color: '#fb7185' },
  { id: 'amethyst', name: 'Tím Oải Hương', color: '#c084fc' },
  { id: 'mint', name: 'Xanh Bạc Hà', color: '#34d399' },
  { id: 'amber', name: 'Hổ Phách', color: '#fbbf24' },
  { id: 'coral', name: 'Cam San Hô', color: '#f97316' },
];

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

const CELESTIAL_REALMS = [
  {
    id: 'flower',
    name: 'Biên Giới Hoa',
    chinese: '花之界',
    subtitle: 'Floral Boundary',
    symbol: 'flower',
    tagline: 'Nơi đóa hoa mộc miên nở rộ giữa sương mai vĩnh cửu',
    poem: [
      'Gió thoảng qua ranh giới cõi mộng,',
      'Cánh hoa rơi khẽ chạm mặt hồ gương,',
      'Một đóa hoa thơm gửi người tri kỷ.',
    ],
    element: 'Mộc Miên · Thanh Khiết',
  },
  {
    id: 'moon',
    name: 'Trăng Vô Tận',
    chinese: '月之痕',
    subtitle: 'Eternal Crescent',
    symbol: 'moon',
    tagline: 'Ánh trăng huyền ảo dẫn lối tâm hồn vượt thoát thời gian',
    poem: [
      'Trăng khuyết treo lơ lửng đỉnh trời xa,',
      'Bóng đêm tan vào vạt áo sương ngà,',
      'Bước qua biên giới tìm về cố hương.',
    ],
    element: 'Nguyệt Quang · Tĩnh Lặng',
  },
  {
    id: 'waves',
    name: 'Biển Sóng Sao',
    chinese: '星之海',
    subtitle: 'Starry Tides',
    symbol: 'waves',
    tagline: 'Sóng biển đại dương hòa quyện cùng dòng chảy tinh hà',
    poem: [
      'Triều dâng cuốn theo ánh sao lung linh,',
      'Đáy biển sâu ngưng đọng những chân tình,',
      'Tiếng sóng thì thầm khúc ca tiền kiếp.',
    ],
    element: 'Thủy Triều · Tinh Tú',
  },
  {
    id: 'portal',
    name: 'Cổng Khởi Nguyên',
    chinese: '门之境',
    subtitle: 'Origin Portal',
    symbol: 'portal',
    tagline: 'Cánh cổng vòm nối liền thực tại và thế giới huyền huyễn',
    poem: [
      'Khép lại trần gian ngàn nỗi bận tâm,',
      'Mở ra chân trời lộng lẫy âm thầm,',
      'Mỗi trang sách là một lần hồi sinh.',
    ],
    element: 'Hư Không · Thời Không',
  },
  {
    id: 'lotus',
    name: 'Đầm Sen Sương',
    chinese: '莲之池',
    subtitle: 'Lotus Dewdrop',
    symbol: 'lotus',
    tagline: 'Búp sen ngát hương đọng giọt sương lành giữa tĩnh mịch',
    poem: [
      'Rễ cắm bùn sâu lòng vẫn trong veo,',
      'Sương đọng trên gương lá biếc dạt dào,',
      'Tâm an giữa vạn biến thiên trần thế.',
    ],
    element: 'Băng Sương · Tự Tại',
  },
  {
    id: 'aurora',
    name: 'Rừng Cực Quang',
    chinese: '极光林',
    subtitle: 'Aurora Canopy',
    symbol: 'aurora',
    tagline: 'Vệt sáng ngũ sắc nhảy múa trên ngọn thông tuyết mùa đông',
    poem: [
      'Dải lụa trời xanh thêu dệt mây ngàn,',
      'Tuyết trắng rơi êm giữa chốn nhân gian,',
      'Ánh sáng dẫn đường những linh hồn lạc.',
    ],
    element: 'Cực Quang · Huyền Ảo',
  },
];

interface NovelHomeViewProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onOpenNovelToReadingPosition?: (novel: Novel, chapterNumber: number) => void;
  onOpenPublishModal: () => void;
  onBackToPortfolio: () => void;
  onOpenLightIntro?: () => void;
  onOpenAboutView?: () => void;
  onOpenInternalBeyond?: () => void;
  isAdmin?: boolean;
  currentUser?: AdminUserLike | null;
  onOpenAdminAuth?: () => void;
  onOpenCreateFirestoreTruyen?: () => void;
  onToggleNovelStatus?: (novelId: string, currentStatus: 'nhap' | 'daDang') => void;
  onDeleteFirestoreNovel?: (novelId: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const NovelHomeView: React.FC<NovelHomeViewProps> = ({
  novels,
  onSelectNovel,
  onOpenNovelToReadingPosition,
  onOpenPublishModal,
  onBackToPortfolio,
  onOpenLightIntro,
  onOpenAboutView,
  onOpenInternalBeyond,
  isAdmin = false,
  currentUser = null,
  onOpenAdminAuth,
  onOpenCreateFirestoreTruyen,
  onToggleNovelStatus,
  onDeleteFirestoreNovel,
  isDarkMode: propIsDarkMode,
  onToggleDarkMode: propOnToggleDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  const [menuHeartColorIndex, setMenuHeartColorIndex] = useState<number>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_menu_heart_idx');
      return saved !== null ? parseInt(saved, 10) % MENU_HEART_PALETTE.length : 0;
    } catch {
      return 0;
    }
  });

  const currentMenuHeart = MENU_HEART_PALETTE[menuHeartColorIndex] || MENU_HEART_PALETTE[0];

  const cycleMenuHeartColor = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    cosmicAudio.playChime('sparkle');
    setMenuHeartColorIndex((prev) => {
      const next = (prev + 1) % MENU_HEART_PALETTE.length;
      safeStorage.setItem('cosmo_menu_heart_idx', next.toString());
      return next;
    });
  };
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<NovelCategoryTabId>('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [homeRealmId, setHomeRealmId] = useState<string>('flower');
  const [homeLikedRealm, setHomeLikedRealm] = useState<Record<string, boolean>>({});
  
  // Visual Theme (5 themes supported: 'slate-haze' | 'sage' | 'notebook' | 'mocha' | 'amethyst-haze'; cosmic functions as dark mode for amethyst-haze)
  const [theme, setTheme] = useState<NovelThemeId>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_novel_theme');
      if (saved === 'cosmic') {
        safeStorage.setItem('cosmo_novel_theme', 'amethyst-haze');
        safeStorage.setItem('cosmo_darkmode', 'false');
        return 'amethyst-haze';
      }
      if (saved === 'lululemon') {
        safeStorage.setItem('cosmo_novel_theme', 'lululemon');
        return 'lululemon';
      }
      if (saved && ['slate-haze', 'sage', 'notebook', 'mocha', 'amethyst-haze', 'lululemon'].includes(saved)) {
        return saved as NovelThemeId;
      }
    } catch {}
    return 'amethyst-haze';
  });

  // Dark Mode: Đồng bộ và ghi nhớ chế độ tối theo lựa chọn của người dùng
  const [localIsDarkMode, setLocalIsDarkMode] = useState<boolean>(() => {
    if (propIsDarkMode !== undefined) return propIsDarkMode;
    try {
      const saved = safeStorage.getItem('cosmo_darkmode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : localIsDarkMode;

  useEffect(() => {
    if (propIsDarkMode !== undefined) {
      setLocalIsDarkMode(propIsDarkMode);
    }
  }, [propIsDarkMode]);

  // Tự động đồng bộ chế độ tối khi quay về trang chủ hoặc từ các view khác
  useEffect(() => {
    const handleDarkChange = (e?: any) => {
      if (e && e.detail !== undefined) {
        setLocalIsDarkMode(Boolean(e.detail));
        return;
      }
      try {
        const saved = safeStorage.getItem('cosmo_darkmode');
        if (saved !== null) {
          const val = saved === 'true';
          setLocalIsDarkMode(val);
        }
      } catch {}
    };

    window.addEventListener('cosmo_darkmode_changed', handleDarkChange);
    window.addEventListener('storage', handleDarkChange);
    return () => {
      window.removeEventListener('cosmo_darkmode_changed', handleDarkChange);
      window.removeEventListener('storage', handleDarkChange);
    };
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

  const togglePurpleBgEffects = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const next = !purpleBgEffectsEnabled;
    setPurpleBgEffectsEnabled(next);
    try {
      safeStorage.setItem('cosmo_purple_bg_effects', JSON.stringify(next));
    } catch {}
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cosmo_bg_effects_changed', { detail: next }));
    }, 10);
  };

  useEffect(() => {
    const handleBgChange = (e: any) => {
      if (e.detail !== undefined) {
        const val = Boolean(e.detail);
        setPurpleBgEffectsEnabled((curr) => (curr !== val ? val : curr));
      } else {
        try {
          const saved = safeStorage.getItem('cosmo_purple_bg_effects');
          if (saved !== null) {
            const parsed = JSON.parse(saved);
            setPurpleBgEffectsEnabled((curr) => (curr !== parsed ? parsed : curr));
          }
        } catch {}
      }
    };
    window.addEventListener('cosmo_bg_effects_changed', handleBgChange);
    window.addEventListener('storage', handleBgChange);
    return () => {
      window.removeEventListener('cosmo_bg_effects_changed', handleBgChange);
      window.removeEventListener('storage', handleBgChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (bgMenuRef.current && !bgMenuRef.current.contains(event.target as Node)) {
        setIsBgMenuOpen(false);
      }
      if (mainMenuRef.current && !mainMenuRef.current.contains(event.target as Node)) {
        setIsMainMenuOpen(false);
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
      setLocalIsDarkMode(false);
      safeStorage.setItem('cosmo_novel_theme', 'amethyst-haze');
      safeStorage.setItem('cosmo_darkmode', 'false');
      document.documentElement.classList.remove('dark');
      window.dispatchEvent(new CustomEvent('cosmo_darkmode_changed', { detail: false }));
      window.dispatchEvent(new CustomEvent('cosmo_theme_changed', { detail: 'amethyst-haze' }));
      try { window.dispatchEvent(new Event('storage')); } catch {}
      propOnToggleDarkMode?.();
      return;
    }
    if (propOnToggleDarkMode) {
      propOnToggleDarkMode();
      return;
    }
    const next = !isDarkMode;
    setLocalIsDarkMode(next);
    safeStorage.setItem('cosmo_darkmode', JSON.stringify(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.dispatchEvent(new CustomEvent('cosmo_darkmode_changed', { detail: next }));
    try { window.dispatchEvent(new Event('storage')); } catch {}
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
        case 'lululemon':
          return {
            cardBg: 'bg-[#1c1115]/95',
            cardBorder: 'border-[#84334b]/35',
            cardShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.5)]',
            stackedMiddle: 'bg-[#150d10]/95 border-[#84334b]/25 shadow-xs',
            stackedBottom: 'bg-[#0e0a16]/90 border-[#84334b]/20 shadow-xs',
            letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0, 0, 0, 0.25) 23px, rgba(0, 0, 0, 0.25) 24px, rgba(132, 51, 75, 0.08) 24px, rgba(132, 51, 75, 0.08) 25px)',
            titleText: 'text-[#faf2f4]',
            novelTitle: 'text-[#faf2f4]',
            chevronColor: 'text-[#d4a3af] group-hover:text-[#fff0f3]',
            badge: 'bg-[#84334b]/25 text-[#f4ebee] border border-[#84334b]/40',
            navBtn: 'bg-[#84334b]/20 hover:bg-[#84334b]/35 text-[#f4ebee] border-[#84334b]/40 shadow-xs',
            timeSubtext: 'text-[#c296a2]',
            timeIcon: 'text-[#d4a3af]',
            progressTrack: 'bg-[#150d10] border border-[#84334b]/30',
            progressBar: 'bg-gradient-to-r from-[#84334b] to-[#ba3859] shadow-[0_0_8px_rgba(132,51,75,0.4)]',
            progressThumb: 'bg-[#ead4d7] border-[#150d10] ring-2 ring-[#84334b]/50',
            pctText: 'text-[#f4ebee]',
            continueBtn: 'text-[#d4a3af] hover:text-[#fff0f3]',
            divider: 'border-[#84334b]/25',
            coverBorder: 'border-[#84334b]/35',
            coverBg: 'bg-[#24151a]/50',
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
      case 'lululemon': // Lululemon Theme (Nền xám hồng đậm đà #f2ebef, Burgundy #84334b)
        return {
          cardBg: 'bg-[#f2ebef]',
          cardBorder: 'border-[#ded0d4]',
          cardShadow: 'shadow-[0_10px_30px_rgba(132,51,75,0.08)]',
          stackedMiddle: 'bg-[#ebdce0] border-[#ded0d4]/90 shadow-xs',
          stackedBottom: 'bg-[#e4d0d5] border-[#ded0d4]/80 shadow-xs',
          letterpressLines: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(132, 51, 75, 0.06) 24px, rgba(255, 255, 255, 0.9) 25px)',
          titleText: 'text-[#382329]',
          novelTitle: 'text-[#382329]',
          chevronColor: 'text-[#8c5a67] group-hover:text-[#84334b]',
          badge: 'bg-[#f2eef0] text-[#573740] border-[#e4d7db]',
          navBtn: 'lulu-light-btn !w-7 !h-7 sm:!w-8 sm:!h-8 !rounded-full !p-0 flex items-center justify-center hover:!text-[#84334b]',
          timeSubtext: 'text-[#8c5a67]',
          timeIcon: 'text-[#8c5a67]',
          progressTrack: 'bg-[#ebdce0]',
          progressBar: 'bg-[#84334b]',
          progressThumb: 'bg-[#84334b] border-white ring-2 ring-[#e4d7db]/80',
          pctText: 'text-[#382329] font-semibold',
          continueBtn: 'lulu-light-btn !text-[#84334b] hover:!text-[#632437] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xs active:scale-95',
          divider: 'border-[#e4d7db]',
          coverBorder: 'border-[#e4d7db]',
          coverBg: 'bg-[#f2eef0]',
        };
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
      case 'lululemon':
        return isDark
          ? 'bg-gradient-to-r from-[#84334b] via-[#a64462] to-[#ba3859] shadow-[0_0_8px_rgba(132,51,75,0.4)]'
          : 'bg-gradient-to-r from-[#84334b] to-[#a64462]';
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
        case 'lululemon':
          return 'bg-[#84334b]';
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
      case 'lululemon':
        return 'bg-gradient-to-r from-[#84334b] via-[#a64462] to-[#ba3859] shadow-[0_0_10px_rgba(132,51,75,0.5)]';
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
      case 'lululemon':
        return 'bg-[#e4d7db]';
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

      case 'lululemon':
        return isDark
          ? `${basePhysics} bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.08] border-white/15 hover:border-[#ba3859]/70 active:border-[#84334b] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(132,51,75,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-xs`
          : `${basePhysics} bg-[#f2ebef] hover:bg-white active:bg-[#ebdce0] border-[#ded0d4] hover:border-[#84334b]/70 active:border-[#84334b] hover:shadow-md active:shadow-xs`;

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
      case 'lululemon':
        return isDark
          ? 'bg-[#84334b] text-white border border-[#ba3859]/70 shadow-xs font-bold'
          : 'bg-[#84334b] text-white border-[#84334b]/40 shadow-sm';
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
      case 'lululemon':
        return isOngoing
          ? (isDark
              ? 'bg-[#26161c] text-[#f4ebee] border border-[#84334b]/45 shadow-xs'
              : 'bg-[#84334b] text-white border border-[#632437] shadow-xs')
          : (isDark
              ? 'bg-[#150d10] text-[#d4a3af] border border-[#84334b]/40 shadow-xs'
              : 'bg-[#f2eef0] text-[#573740] border border-[#e4d7db] shadow-xs');
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
      case 'lululemon':
        return isOngoing
          ? (isDark
              ? 'bg-[#26161c] text-[#f4ebee] border border-[#84334b]/45 shadow-xs'
              : 'bg-[#f2eef0] text-[#573740] border-[#e4d7db] shadow-2xs font-semibold')
          : (isDark
              ? 'bg-[#150d10] text-[#f4ebee] border border-[#84334b]/40 shadow-xs'
              : 'bg-[#f2ebef] text-[#8c5a67] border-[#ded0d4] shadow-2xs');
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

      case 'lululemon':
        if (idx === 0) {
          return isDark
            ? 'bg-gradient-to-tr from-[#84334b] to-[#ba3859] text-white shadow-[0_0_8px_rgba(132,51,75,0.4)]'
            : 'bg-gradient-to-tr from-[#84334b] to-[#a64462] text-white shadow-sm ring-1 ring-[#e4d7db]';
        }
        if (idx === 1) {
          return isDark
            ? 'bg-gradient-to-tr from-[#a64462] to-[#ead4d7] text-[#1c1115] shadow-sm'
            : 'bg-gradient-to-tr from-[#a64462] to-[#84334b] text-white shadow-sm ring-1 ring-[#e4d7db]';
        }
        return isDark
          ? 'bg-gradient-to-tr from-[#421b27] to-[#84334b] text-white shadow-sm'
          : 'bg-gradient-to-tr from-[#f2eef0] to-[#e4d7db] text-[#573740] shadow-xs font-bold ring-1 ring-[#e4d7db]';

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
      case 'lululemon':
        return 'lulu-light-btn';
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
        case 'lululemon':
          return {
            container: 'bg-[#f7f2f4] border border-[#e4d7db] shadow-inner',
            activePill: 'bg-[#84334b] border border-[#6f253b] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-[#8c5a67] hover:text-[#382329]',
            getActivePill: () => ({ gradient: '', glow: '' }),
            getInactiveText: () => 'text-[#8c5a67] hover:text-[#382329]',
          };
        case 'slate-haze':
          return {
            container: 'bg-[#eaf2f9] border border-[#cde0f3] shadow-inner',
            activePill: 'bg-[#3f658c] border border-[#2f4d6d] shadow-xs',
            activeText: 'text-white',
            inactiveText: 'text-[#526982] hover:text-[#192635]',
            getActivePill: () => ({ gradient: '', glow: '' }),
            getInactiveText: () => 'text-[#526982] hover:text-[#192635]',
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
      case 'lululemon':
        containerBase = 'bg-[#1c1115]/90 border-0';
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

      // 6. THEME LULULEMON (Rượu mận Burgundy #84334b sang mận sương #ba3859 và hồng sương #ead4d7)
      if (th === 'lululemon') {
        const luluGlow = 'shadow-[0_4px_16px_rgba(132,51,75,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.5),inset_0_-1.5px_2px_rgba(0,0,0,0.2)]';
        switch (catId) {
          case 'h-van':
            return {
              gradient: 'bg-gradient-to-r from-[#84334b] to-[#ba3859]',
              glow: luluGlow,
            };
          case 'h-van-np':
            return {
              gradient: 'bg-gradient-to-r from-[#943853] to-[#c74164]',
              glow: luluGlow,
            };
          case 'h-van-ngan':
            return {
              gradient: 'bg-gradient-to-r from-[#702b3f] to-[#aa4463]',
              glow: luluGlow,
            };
          case 'dam-my':
            return {
              gradient: 'bg-gradient-to-r from-[#84334b] via-[#a64462] to-[#c74164]',
              glow: luluGlow,
            };
          case 'all':
          default:
            return {
              gradient: 'bg-gradient-to-r from-[#84334b] to-[#ba3859]',
              glow: luluGlow,
            };
        }
      }

      // 7. THEME AMETHYST-HAZE / PURPLE (Chuẩn công thức: Tím tử đinh hương #c084fc sang hồng tím hoa cà #e879f9)
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
              border: '1px solid rgba(255, 255, 255, 0.45)',
              background: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 12px 32px rgba(140, 180, 155, 0.15), 0 2px 6px rgba(0, 0, 0, 0.02)',
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
              border: '1px solid rgba(255, 255, 255, 0.45)',
              background: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 12px 32px rgba(195, 160, 135, 0.15), 0 2px 6px rgba(0, 0, 0, 0.02)',
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
              border: '1px solid rgba(255, 255, 255, 0.45)',
              background: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 12px 32px rgba(180, 160, 205, 0.15), 0 2px 6px rgba(0, 0, 0, 0.02)',
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
            itemDateClass: 'text-purple-400',
          };
        case 'cosmic':
          return {
            outerStyle: {
              border: '1px solid rgba(255, 255, 255, 0.45)',
              background: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 12px 32px rgba(170, 175, 220, 0.15), 0 2px 6px rgba(0, 0, 0, 0.02)',
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
              border: '1px solid rgba(255, 255, 255, 0.45)',
              background: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.02)',
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
        case 'lululemon':
          return {
            outerStyle: {
              border: '1px solid rgba(255, 255, 255, 0.45)',
              background: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 12px 32px rgba(132, 51, 75, 0.1), 0 2px 6px rgba(0, 0, 0, 0.02)',
            },
            innerStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(175deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 249, 250, 0.92) 100%) padding-box, linear-gradient(to bottom, rgba(234, 212, 215, 0.7) 0%, rgba(228, 201, 205, 0.5) 45%, rgba(132, 51, 75, 0.6) 100%) border-box',
              boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.98), inset 0 -1px 2px rgba(228, 201, 205, 0.2)',
            },
            iconBtnStyle: {
              border: '1px solid transparent',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(249,246,247,0.85) 100%) padding-box, linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(234,212,215,0.6) 45%, rgba(132,51,75,0.7) 100%) border-box',
              boxShadow: '0 2px 5px rgba(132, 51, 75, 0.12), inset 0 1px 1px rgba(255,255,255,0.95)',
            },
            iconColor: 'text-[#84334b]',
            titleColor: 'text-[#382329]',
            subtitleColor: 'text-[#8c5a67]',
            chevronColor: 'text-[#84334b]',
            dividerClass: 'border-[#e4d7db]',
            itemHoverClass: 'hover:bg-rose-50/60',
            itemTitleHoverClass: 'group-hover:text-[#84334b]',
            itemDateClass: 'text-[#84334b]',
          };
        case 'slate-haze':
        default:
          return {
            outerStyle: {
              border: '1px solid rgba(255, 255, 255, 0.45)',
              background: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 12px 32px rgba(160, 185, 215, 0.15), 0 2px 6px rgba(0, 0, 0, 0.02)',
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
          titleColor: 'text-[#eaf2eb]',
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
      case 'lululemon':
        return {
          outerStyle: {
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(36, 21, 26, 0.55) 45%, rgba(21, 13, 16, 0.75) 100%)',
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
          iconColor: 'text-[#d4a3af]',
          titleColor: 'text-[#faf2f4]',
          subtitleColor: 'text-[#c296a2]',
          chevronColor: 'text-[#d4a3af]',
          dividerClass: 'border-white/[0.08]',
          itemHoverClass: 'bg-white/[0.04] hover:bg-[#84334b]/20 transition-colors',
          itemTitleHoverClass: 'group-hover:text-[#faf2f4]',
          itemDateClass: 'text-[#d4a3af]',
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
        case 'lululemon':
          return {
            dotColor: 'rgba(234, 212, 215, 0.08)',
            gridColor: 'rgba(132, 51, 75, 0.08)',
            heroRimBg: 'bg-[#150d10]',
            outerBg: 'bg-[#150d10]/95',
            outerBorder: 'border-[#84334b]/40',
            heroOuterBorder: 'border border-[#84334b]/40',
            heroInnerDashed: 'border border-dashed border-[#a64462]/35',
            heroGenreColor: 'text-[#d4a3af]',
            heroTitleColor: 'text-white',
            heroMetaColor: 'text-[#d4a3af]',
            heroOrnamentColor: 'text-[#ead4d7]',
            cardBg: 'bg-[#150d10]/95',
            cardBorder: 'border-[#84334b]/35',
            polaroidBg: 'bg-[#24151a] border-[#84334b]/40 text-[#f4ebee]',
            starColor: 'text-[#ead4d7]/85',
            ornamentText: 'text-[#d4a3af]/70',
            bowColor: 'text-[#d4a3af]/70',
            tapeColor: 'bg-[#2c1920]/80 border-[#84334b]/40 text-[#d4a3af]',
            pushpin: 'bg-zinc-800 border-[#a64462]',
            dotActive: 'bg-[#ba3859]',
            dotInactive: 'bg-[#2b161f]',
            arrowBtn: 'bg-[#24151a] text-[#f4ebee] border-[#84334b]/40 hover:bg-[#341b25]',
            badgeBg: 'bg-white/10 text-[#f4ebee] border-white/10',
            heartColor: 'text-[#ead4d7]',
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
      case 'lululemon':
        return {
          dotColor: 'rgba(132, 51, 75, 0.14)',
          gridColor: 'rgba(204, 123, 143, 0.05)',
          heroRimBg: 'bg-[#f2ebef]',
          outerBg: 'bg-[#f2ebef]',
          outerBorder: 'border-[#ded0d4]',
          heroOuterBorder: 'border border-[#ded0d4]',
          heroInnerDashed: 'border border-dashed border-[#d8c5ca]',
          heroGenreColor: 'text-[#cc7b8f]',
          heroTitleColor: 'text-[#382329]',
          heroMetaColor: 'text-[#8c5a67]',
          heroOrnamentColor: 'text-[#cc7b8f]',
          cardBg: 'bg-white',
          cardBorder: 'border-[#e4d7db]',
          polaroidBg: 'bg-white border-[#e4d7db] text-[#382329]',
          starColor: 'text-[#cc7b8f]',
          ornamentText: 'text-[#8c5a67]',
          bowColor: 'text-[#8c5a67]',
          tapeColor: 'bg-[#f2eef0] border-[#e4d7db] text-[#cc7b8f]',
          pushpin: 'bg-white border-[#cc7b8f]',
          dotActive: 'bg-[#cc7b8f]',
          dotInactive: 'bg-[#e4d7db]',
          arrowBtn: 'bg-white text-[#382329] border-[#e4d7db] hover:bg-rose-50/50 shadow-sm',
          badgeBg: 'bg-white text-[#382329] border-[#e4d7db]',
          heartColor: 'text-[#cc7b8f]',
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
      case 'lululemon':
        return {
          container: 'bg-[#f2ebef]/98 border-[#ded0d4] text-[#382329] shadow-[0_12px_36px_rgba(204,123,143,0.08)]',
          header: 'border-[#ded0d4] text-[#8c5a67]',
          itemHover: 'hover:bg-[#ebdce0]',
          titleText: 'text-[#382329]',
          subText: 'text-[#8c5a67]',
          badge: 'text-[#cc7b8f]',
          viewAllBtn: 'border-[#e4d7db] hover:bg-[#f2eef0] text-[#cc7b8f]',
          noticeHighlight: 'text-[#cc7b8f]',
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
            gradientBorder: 'bg-indigo-500/50',
            glowShadow: 'shadow-sm shadow-black/30',
            glowShadowHover: 'group-hover:shadow-md group-hover:shadow-black/40',
            pulseHaloBg: 'opacity-0',
            btnInnerBg: 'bg-gradient-to-r from-[#4d2d78] via-[#5e3793] to-[#7142b0] hover:from-[#573387] hover:to-[#7f4bc7]',
            textColor: 'text-indigo-100 font-semibold',
            dotColor: 'bg-indigo-300',
            dotPing: 'bg-indigo-400/40',
            // Fallback compatibility properties
            btnBg: '',
            btnGradient: 'bg-gradient-to-r from-[#4d2d78] to-[#7142b0]',
            btnGlow: 'shadow-none',
            borderShadow: 'shadow-none',
            innerShadow: 'shadow-xs',
            haloCushion: 'opacity-0',
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
              gradientBorder: 'bg-[#43634b]/60',
              glowShadow: 'shadow-sm shadow-black/30',
              glowShadowHover: 'group-hover:shadow-md group-hover:shadow-black/40',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-gradient-to-r from-[#2d4432] via-[#39563f] to-[#46694e] hover:from-[#344f3a] hover:to-[#507859]',
              textColor: 'text-[#eaf2eb] font-semibold',
              dotColor: 'bg-[#8cb391]',
              dotPing: 'bg-[#8cb391]/40',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#2d4432] to-[#46694e]',
              btnGlow: 'shadow-none',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'opacity-0',
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
              gradientBorder: 'bg-neutral-600/60',
              glowShadow: 'shadow-sm shadow-black/30',
              glowShadowHover: 'group-hover:shadow-md group-hover:shadow-black/40',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-gradient-to-r from-[#38383f] via-[#44444c] to-[#52525c] hover:from-[#404047] hover:to-[#5e5e69]',
              textColor: 'text-neutral-200 font-semibold',
              dotColor: 'bg-neutral-300',
              dotPing: 'bg-neutral-400/40',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#38383f] to-[#52525c]',
              btnGlow: 'shadow-none',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'opacity-0',
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
              gradientBorder: 'bg-[#6a493a]/60',
              glowShadow: 'shadow-sm shadow-black/30',
              glowShadowHover: 'group-hover:shadow-md group-hover:shadow-black/40',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-gradient-to-r from-[#4d362b] via-[#5c4134] to-[#6d4d3d] hover:from-[#573d31] hover:to-[#7a5745]',
              textColor: 'text-[#f5ece6] font-semibold',
              dotColor: 'bg-[#d4a38c]',
              dotPing: 'bg-[#d4a38c]/40',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#4d362b] to-[#6d4d3d]',
              btnGlow: 'shadow-none',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'opacity-0',
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
              gradientBorder: 'bg-[#395677]/60',
              glowShadow: 'shadow-sm shadow-black/30',
              glowShadowHover: 'group-hover:shadow-md group-hover:shadow-black/40',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-gradient-to-r from-[#2c435c] via-[#355170] to-[#406287] hover:from-[#324d69] hover:to-[#4a729c]',
              textColor: 'text-[#edf4fa] font-semibold',
              dotColor: 'bg-[#7bb0e0]',
              dotPing: 'bg-[#7bb0e0]/40',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#2c435c] to-[#406287]',
              btnGlow: 'shadow-none',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'opacity-0',
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

      case 'lululemon':
        return isDarkEffective
          ? {
              gradientBorder: 'bg-[#84334b]/60',
              glowShadow: 'shadow-sm shadow-black/30',
              glowShadowHover: 'group-hover:shadow-md group-hover:shadow-black/40',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-gradient-to-r from-[#5a2233] via-[#732c41] to-[#84334b] hover:from-[#6a283c] hover:to-[#9e3d5a]',
              textColor: 'text-[#f4ebee] font-semibold',
              dotColor: 'bg-[#ead4d7]',
              dotPing: 'bg-[#ead4d7]/40',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#5a2233] to-[#84334b]',
              btnGlow: 'shadow-none',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'opacity-0',
            }
          : {
              gradientBorder: 'bg-transparent',
              glowShadow: 'shadow-xs',
              glowShadowHover: 'group-hover:shadow-sm',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'lulu-light-btn-active !text-[#632437] shadow-xs',
              textColor: 'text-[#632437] font-bold',
              dotColor: 'bg-[#84334b]',
              dotPing: 'bg-[#84334b]/60',
              btnBg: '#f2ebef',
              btnGradient: '',
              btnGlow: '',
              borderShadow: 'shadow-xs group-hover:shadow-sm hover:shadow-sm transition-shadow duration-200',
              innerShadow: 'shadow-xs group-hover:shadow-sm transition-shadow duration-200',
              haloCushion: 'bg-[#ead4d7]/30',
            };

      case 'amethyst-haze':
      default:
        return isDarkEffective
          ? {
              gradientBorder: 'bg-[#6e4694]/50',
              glowShadow: 'shadow-sm shadow-black/30',
              glowShadowHover: 'group-hover:shadow-md group-hover:shadow-black/40',
              pulseHaloBg: 'opacity-0',
              btnInnerBg: 'bg-gradient-to-r from-[#452d5e] via-[#533671] to-[#634187] hover:from-[#4c3167] hover:to-[#704998]',
              textColor: 'text-purple-100 font-semibold',
              dotColor: 'bg-purple-300',
              dotPing: 'bg-purple-400/40',
              btnBg: '',
              btnGradient: 'bg-gradient-to-r from-[#452d5e] to-[#634187]',
              btnGlow: 'shadow-none',
              borderShadow: 'shadow-none',
              innerShadow: 'shadow-xs',
              haloCushion: 'opacity-0',
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
            fullBadge: 'bg-emerald-600 text-white font-black shadow-xs',
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
            fullBadge: 'bg-amber-700 text-white font-black shadow-xs',
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
            fullBadge: 'bg-sky-600 text-white font-black shadow-xs',
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
            fullBadge: 'bg-zinc-700 text-white font-black shadow-xs',
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
            fullBadge: 'bg-indigo-600 text-white font-black shadow-xs',
          };
        case 'lululemon':
          return {
            outer: 'border-[#84334b]/40 bg-gradient-to-br from-[#24151a] via-[#1c1115] to-[#150d10] shadow-[0_20px_50px_rgba(0,0,0,0.6)]',
            inner: 'border-[#84334b]/30 bg-white/[0.02] shadow-inner',
            divider: 'border-[#84334b]/30',
            dashedDivider: 'border-[#a64462]/50',
            cutout: 'bg-[#1c1115] border border-[#a64462]/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]',
            kicker: 'text-[#d4a3af]',
            title: 'text-[#faf2f4] hover:text-white',
            meta: 'text-[#c296a2]',
            author: 'text-[#faf2f4]',
            synopsis: 'text-[#d8b4bc]',
            btnPrimary: 'border border-[#ba3859]/50 bg-gradient-to-r from-[#84334b] via-[#9e3d5a] to-[#ba3859] hover:from-[#943853] hover:to-[#c74164] shadow-lg shadow-black/40 text-white font-bold',
            btnSecondary: 'border border-[#84334b]/40 bg-white/[0.08] hover:bg-white/[0.16] text-[#ead4d7] shadow-xs',
            dotActive: 'bg-[#ba3859] shadow-xs',
            dotInactive: 'bg-white/15',
            barcode: 'bg-[#84334b]',
            coverBorder: 'border border-[#84334b]/40 bg-[#1c1115]',
            borderHeroLine: 'border-[#84334b]/45',
            fullBadge: 'bg-[#84334b] text-white font-black shadow-xs',
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
            fullBadge: 'bg-purple-600 text-white font-black shadow-xs',
          };
      }
    }

    // Light mode (áp dụng kiểu dáng mượt mà, màu sắc đồng bộ chuẩn theo từng theme tương tự frost)
    switch (theme) {
      case 'sage':
        return {
          outer: 'border-[#c8d8c6] bg-[#f0f4ef]/90 shadow-lg',
          inner: 'bg-white border-[#dce6d9] shadow-md',
          divider: 'border-[#dce6d9]',
          dashedDivider: 'border-[#4d6f53]/40',
          cutout: 'bg-[#e3ede1] border border-[#b2c6ad] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]',
          kicker: 'text-[#4d664a]',
          title: 'text-[#1c291e] hover:text-[#0e1710]',
          meta: 'text-[#4d664a]',
          author: 'text-[#1c291e]',
          synopsis: 'text-[#355333]',
          btnPrimary: 'sage-light-btn font-bold !text-[#466244] hover:!text-[#274225]',
          btnSecondary: 'sage-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#274225] ring-1 ring-[#274225]/30 shadow-xs',
          dotInactive: 'bg-[#cad8c6]',
          barcode: 'bg-[#4d664a]',
          coverBorder: 'border-[#dce6d9] bg-white',
          borderHeroLine: 'border-[#4d6f53]/30',
          fullBadge: 'sage-light-novel-tag font-bold',
        };
      case 'mocha':
        return {
          outer: 'border-[#e4d9bc] bg-[#f8f4ee]/90 shadow-lg',
          inner: 'bg-white border-[#e8ddc2] shadow-md',
          divider: 'border-[#e8ddc2]',
          dashedDivider: 'border-[#8c6d5d]/40',
          cutout: 'bg-[#ede5d8] border border-[#d5c7ab] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]',
          kicker: 'text-[#8c6d5d]',
          title: 'text-[#3a2a2a] hover:text-[#201414]',
          meta: 'text-[#8c6d5d]',
          author: 'text-[#3a2a2a]',
          synopsis: 'text-[#5e4334]',
          btnPrimary: 'mocha-light-btn font-bold !text-[#7a6256] hover:!text-[#a37764]',
          btnSecondary: 'mocha-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#a37764] ring-1 ring-[#a37764]/30 shadow-xs',
          dotInactive: 'bg-[#e4d9bc]',
          barcode: 'bg-[#8c6d5d]',
          coverBorder: 'border-[#e8ddc2] bg-white',
          borderHeroLine: 'border-[#8c6d5d]/30',
          fullBadge: 'mocha-light-novel-tag font-bold',
        };
      case 'slate-haze':
        return {
          outer: 'border-[#c8d6e5] bg-[#f2f6fa]/90 shadow-lg',
          inner: 'bg-white border-[#d8e3ed] shadow-md',
          divider: 'border-[#d8e3ed]',
          dashedDivider: 'border-[#5d7e9d]/40',
          cutout: 'bg-[#e2ebf4] border border-[#b8c9dc] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]',
          kicker: 'text-[#5d7e9d]',
          title: 'text-[#1e293b] hover:text-[#0f172a]',
          meta: 'text-[#58738e]',
          author: 'text-[#192635]',
          synopsis: 'text-[#38516b]',
          btnPrimary: 'frost-light-btn font-bold !text-[#526982] hover:!text-[#0284c7]',
          btnSecondary: 'frost-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#0284c7] ring-1 ring-[#0284c7]/30 shadow-xs',
          dotInactive: 'bg-[#c8d6e5]',
          barcode: 'bg-[#5d7e9d]',
          coverBorder: 'border-[#d8e3ed] bg-white',
          borderHeroLine: 'border-[#5d7e9d]/30',
          fullBadge: 'frost-light-novel-tag font-bold',
        };
      case 'notebook':
        return {
          outer: 'border-neutral-250 bg-[#fafafa]/90 shadow-lg',
          inner: 'bg-white border-neutral-200 shadow-md',
          divider: 'border-neutral-200',
          dashedDivider: 'border-neutral-400/40',
          cutout: 'bg-[#eaeaea] border border-neutral-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]',
          kicker: 'text-neutral-500',
          title: 'text-neutral-800 hover:text-black',
          meta: 'text-neutral-500',
          author: 'text-neutral-800',
          synopsis: 'text-neutral-600',
          btnPrimary: 'notebook-light-btn font-bold !text-[#525252] hover:!text-[#171717]',
          btnSecondary: 'notebook-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#262626] ring-1 ring-black/20 shadow-xs',
          dotInactive: 'bg-neutral-300',
          barcode: 'bg-neutral-600',
          coverBorder: 'border-neutral-200 bg-white',
          borderHeroLine: 'border-neutral-300',
          fullBadge: 'notebook-light-novel-tag font-bold',
        };
      case 'lululemon':
        return {
          outer: 'border-[#ded0d4] bg-[#f2ebef]/95 shadow-lg',
          inner: 'bg-white border-[#ded0d4] shadow-md',
          divider: 'border-[#ded0d4]',
          dashedDivider: 'border-[#d8c5ca]',
          cutout: 'bg-[#ebdce0] border border-[#d8c5ca] shadow-[inset_0_2px_4px_rgba(204,123,143,0.08)]',
          kicker: 'text-[#8c5a67]',
          title: 'text-[#374151] hover:text-[#1f2937]',
          meta: 'text-[#8c5a67]',
          author: 'text-[#382329]',
          synopsis: 'text-[#573740]',
          btnPrimary: 'lulu-light-btn font-bold !text-[#ad4862] hover:!text-[#9c3e55]',
          btnSecondary: 'lulu-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#cc7b8f] ring-1 ring-[#cc7b8f]/30 shadow-xs',
          dotInactive: 'bg-[#e4d7db]',
          barcode: 'bg-[#cc7b8f]',
          coverBorder: 'border-[#e4d7db] bg-white',
          borderHeroLine: 'border-[#e4d7db]',
          fullBadge: 'lulu-light-novel-tag font-bold',
        };
      case 'amethyst-haze':
      default:
        return {
          outer: 'border-[#ded8ea] bg-[#f7f3fb]/90 shadow-lg',
          inner: 'bg-white border-[#e9e3f3] shadow-md',
          divider: 'border-[#e9e3f3]',
          dashedDivider: 'border-[#856b9e]/40',
          cutout: 'bg-[#ede8f4] border border-[#cbbfe0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]',
          kicker: 'text-[#6e5394]',
          title: 'text-[#2e1d47] hover:text-[#180d28]',
          meta: 'text-[#6e5394]',
          author: 'text-[#3e2363] font-semibold',
          synopsis: 'text-[#4e2f7b]',
          btnPrimary: 'amethyst-light-btn font-bold !text-[#6b5887] hover:!text-[#7e58a6]',
          btnSecondary: 'amethyst-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
          dotActive: 'bg-[#7e58a6] ring-1 ring-[#7e58a6]/30 shadow-xs',
          dotInactive: 'bg-[#ded8ea]',
          barcode: 'bg-[#6e5394]',
          coverBorder: 'border-[#e9e3f3] bg-white',
          borderHeroLine: 'border-[#856b9e]/30',
          fullBadge: 'amethyst-light-novel-tag font-bold',
        };
    }
  }, [theme, isDarkEffective]);

  // Màu nền trang chủ chế độ sáng cho từng theme mô phỏng phong cách mờ ảo của Frost
  const getThemeLightPageBackground = (th: NovelThemeId): string => {
    switch (th) {
      case 'slate-haze':
        return `
          radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(235, 243, 253, 0.85) 40%, rgba(226, 238, 252, 0.60) 70%, rgba(240, 245, 252, 0.90) 100%),
          linear-gradient(to bottom, #F4F8FD 0%, #EBF2FA 50%, #F5F1FA 100%)
        `;
      case 'sage':
        return `
          radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 238, 0.85) 40%, rgba(232, 242, 230, 0.60) 70%, rgba(244, 248, 243, 0.90) 100%),
          linear-gradient(to bottom, #F5F8F4 0%, #EBF3E9 50%, #F3F7F2 100%)
        `;
      case 'mocha':
        return `
          radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(252, 248, 242, 0.85) 40%, rgba(247, 240, 230, 0.60) 70%, rgba(253, 249, 244, 0.90) 100%),
          linear-gradient(to bottom, #FBF8F3 0%, #F4ECE1 50%, #FAF3EA 100%)
        `;
      case 'notebook':
        return `
          radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.98) 0%, rgba(248, 248, 250, 0.85) 40%, rgba(242, 242, 245, 0.60) 70%, rgba(250, 250, 252, 0.90) 100%),
          linear-gradient(to bottom, #FAFAFC 0%, #F1F1F4 50%, #F7F7FA 100%)
        `;
      case 'amethyst-haze':
      default:
        return `
          radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(248, 243, 253, 0.85) 40%, rgba(242, 235, 252, 0.60) 70%, rgba(250, 245, 253, 0.90) 100%),
          linear-gradient(to bottom, #F8F4FC 0%, #EFE8FA 50%, #F7F0FA 100%)
        `;
    }
  };

  // Cấu hình bảng màu Header Banner (Hero Title + 4 nút tròn) tương thích với tất cả theme và cả chế độ sáng / tối
  const heroTheme = useMemo(() => {
    if (isDarkEffective) {
      switch (theme) {
        case 'sage':
          return {
            dotColor: '#43634b',
            eyebrowColor: 'text-[#8cb391]/85',
            celestialColor: 'text-[#a3d4a9]',
            projectTextColor: 'text-[#8cb391]',
            projectLineBg: 'bg-[#43634b]/60',
            titleColor: 'text-[#eaf2eb]',
            titleShadow: '0 2px 25px rgba(163, 212, 169, 0.25)',
            barcodeColor: 'bg-[#43634b]/60',
            waveColor: 'text-[#43634b]',
            dividerCircleBorder: 'border-[#43634b]',
            dividerCircleBg: 'bg-[#0f1b13]',
            dividerLineBg: 'bg-gradient-to-r from-[#43634b]/40 via-[#8cb391]/70 to-[#43634b]/40',
            subTitleColor: 'text-[#b8cebc]',
            taglineColor: 'text-[#9db6a1]',
            buttonRowLine: 'bg-[#43634b]/40',
            buttonWrapper: 'bg-[#142318]/90 hover:bg-[#1a2f20] shadow-sm hover:shadow-md border border-white/10',
            buttonDashedRing: 'border-[#43634b]/50',
            buttonSolidRing: 'border-[#8cb391]/70',
            buttonIconText: 'text-[#cee0d1]',
          };
        case 'mocha':
          return {
            dotColor: '#6a493a',
            eyebrowColor: 'text-[#d4a38c]/85',
            celestialColor: 'text-[#e8b9a2]',
            projectTextColor: 'text-[#d4a38c]',
            projectLineBg: 'bg-[#6a493a]/60',
            titleColor: 'text-[#f5ece6]',
            titleShadow: '0 2px 25px rgba(232, 185, 162, 0.25)',
            barcodeColor: 'bg-[#6a493a]/60',
            waveColor: 'text-[#6a493a]',
            dividerCircleBorder: 'border-[#6a493a]',
            dividerCircleBg: 'bg-[#1a120e]',
            dividerLineBg: 'bg-gradient-to-r from-[#6a493a]/40 via-[#d4a38c]/70 to-[#6a493a]/40',
            subTitleColor: 'text-[#d6c7bc]',
            taglineColor: 'text-[#c2b0a2]',
            buttonRowLine: 'bg-[#6a493a]/40',
            buttonWrapper: 'bg-[#241913]/90 hover:bg-[#30221a] shadow-sm hover:shadow-md border border-white/10',
            buttonDashedRing: 'border-[#6a493a]/50',
            buttonSolidRing: 'border-[#d4a38c]/70',
            buttonIconText: 'text-[#e8d5cb]',
          };
        case 'notebook':
          return {
            dotColor: '#52525c',
            eyebrowColor: 'text-neutral-400/85',
            celestialColor: 'text-neutral-200',
            projectTextColor: 'text-neutral-400',
            projectLineBg: 'bg-neutral-600/60',
            titleColor: 'text-neutral-100',
            titleShadow: '0 2px 25px rgba(255, 255, 255, 0.2)',
            barcodeColor: 'bg-neutral-600/60',
            waveColor: 'text-neutral-600',
            dividerCircleBorder: 'border-neutral-600',
            dividerCircleBg: 'bg-[#18181c]',
            dividerLineBg: 'bg-gradient-to-r from-neutral-600/40 via-neutral-300/70 to-neutral-600/40',
            subTitleColor: 'text-neutral-200',
            taglineColor: 'text-neutral-400',
            buttonRowLine: 'bg-neutral-700/60',
            buttonWrapper: 'bg-[#222226]/90 hover:bg-[#2c2c31] shadow-sm hover:shadow-md border border-white/10',
            buttonDashedRing: 'border-neutral-600/60',
            buttonSolidRing: 'border-neutral-500/70',
            buttonIconText: 'text-neutral-200',
          };
        case 'slate-haze':
          return {
            dotColor: '#5d7e9d',
            eyebrowColor: 'text-[#8ba0b5]/85',
            celestialColor: 'text-[#7bb0e0]',
            projectTextColor: 'text-[#8ba0b5]',
            projectLineBg: 'bg-[#5d7e9d]/60',
            titleColor: 'text-[#edf4fa]',
            titleShadow: '0 2px 25px rgba(123, 176, 224, 0.25)',
            barcodeColor: 'bg-[#5d7e9d]/60',
            waveColor: 'text-[#5d7e9d]',
            dividerCircleBorder: 'border-[#5d7e9d]',
            dividerCircleBg: 'bg-[#0d1624]',
            dividerLineBg: 'bg-gradient-to-r from-[#5d7e9d]/40 via-[#7bb0e0]/70 to-[#5d7e9d]/40',
            subTitleColor: 'text-[#b9cddf]',
            taglineColor: 'text-[#8ba0b5]',
            buttonRowLine: 'bg-[#5d7e9d]/40',
            buttonWrapper: 'bg-[#142132]/90 hover:bg-[#1b2b40] shadow-sm hover:shadow-md border border-white/10',
            buttonDashedRing: 'border-[#5d7e9d]/50',
            buttonSolidRing: 'border-[#7bb0e0]/70',
            buttonIconText: 'text-[#cee0d1]',
          };
        case 'amethyst-haze':
        default:
          return {
            dotColor: '#6e4694',
            eyebrowColor: 'text-purple-300/85',
            celestialColor: 'text-purple-200',
            projectTextColor: 'text-purple-300',
            projectLineBg: 'bg-[#6e4694]/60',
            titleColor: 'text-neutral-100',
            titleShadow: '0 2px 25px rgba(167, 139, 250, 0.25)',
            barcodeColor: 'bg-[#6e4694]/60',
            waveColor: 'text-[#6e4694]',
            dividerCircleBorder: 'border-[#6e4694]',
            dividerCircleBg: 'bg-[#140b22]',
            dividerLineBg: 'bg-gradient-to-r from-[#4c3167]/40 via-purple-300/70 to-[#4c3167]/40',
            subTitleColor: 'text-purple-200',
            taglineColor: 'text-purple-300',
            buttonRowLine: 'bg-[#6e4694]/40',
            buttonWrapper: 'bg-[#1d1330]/90 hover:bg-[#281b42] shadow-sm hover:shadow-md border border-white/10',
            buttonDashedRing: 'border-[#6e4694]/50',
            buttonSolidRing: 'border-purple-400/70',
            buttonIconText: 'text-purple-200',
          };
      }
    }

    // Light Mode
    switch (theme) {
      case 'sage':
        return {
          dotColor: '#7ea17c',
          eyebrowColor: 'text-[#4d664a]/85',
          celestialColor: 'text-[#3c593a]',
          projectTextColor: 'text-[#4d664a]',
          projectLineBg: 'bg-[#7ea17c]/60',
          titleColor: 'text-[#274026]',
          titleShadow: '0 2px 18px rgba(39, 64, 38, 0.12)',
          barcodeColor: 'bg-[#4d664a]/60',
          waveColor: 'text-[#7ea17c]',
          dividerCircleBorder: 'border-[#7ea17c]',
          dividerCircleBg: 'bg-white',
          dividerLineBg: 'bg-gradient-to-r from-[#7ea17c]/80 via-[#7ea17c] to-[#7ea17c]/80',
          subTitleColor: 'text-[#355333]',
          taglineColor: 'text-[#4d664a]',
          buttonRowLine: 'bg-[#7ea17c]/50',
          buttonWrapper: 'bg-white/90 hover:bg-white shadow-sm hover:shadow-md',
          buttonDashedRing: 'border-[#7ea17c]/50',
          buttonSolidRing: 'border-[#7ea17c]/70',
          buttonIconText: 'text-[#355333]',
        };
      case 'mocha':
        return {
          dotColor: '#bfa595',
          eyebrowColor: 'text-[#8c6d5d]/85',
          celestialColor: 'text-[#7a5745]',
          projectTextColor: 'text-[#8c6d5d]',
          projectLineBg: 'bg-[#bfa595]/60',
          titleColor: 'text-[#4a3528]',
          titleShadow: '0 2px 18px rgba(74, 53, 40, 0.12)',
          barcodeColor: 'bg-[#8c6d5d]/60',
          waveColor: 'text-[#bfa595]',
          dividerCircleBorder: 'border-[#bfa595]',
          dividerCircleBg: 'bg-white',
          dividerLineBg: 'bg-gradient-to-r from-[#bfa595]/80 via-[#bfa595] to-[#bfa595]/80',
          subTitleColor: 'text-[#5e4334]',
          taglineColor: 'text-[#8c6d5d]',
          buttonRowLine: 'bg-[#bfa595]/50',
          buttonWrapper: 'bg-white/90 hover:bg-white shadow-sm hover:shadow-md',
          buttonDashedRing: 'border-[#bfa595]/50',
          buttonSolidRing: 'border-[#bfa595]/70',
          buttonIconText: 'text-[#5e4334]',
        };
      case 'notebook':
        return {
          dotColor: '#a1a1aa',
          eyebrowColor: 'text-neutral-500/85',
          celestialColor: 'text-neutral-700',
          projectTextColor: 'text-neutral-600',
          projectLineBg: 'bg-neutral-400/60',
          titleColor: 'text-neutral-800',
          titleShadow: '0 2px 18px rgba(38, 38, 38, 0.12)',
          barcodeColor: 'bg-neutral-500/60',
          waveColor: 'text-neutral-400',
          dividerCircleBorder: 'border-neutral-400',
          dividerCircleBg: 'bg-white',
          dividerLineBg: 'bg-gradient-to-r from-neutral-400/80 via-neutral-400 to-neutral-400/80',
          subTitleColor: 'text-neutral-700',
          taglineColor: 'text-neutral-500',
          buttonRowLine: 'bg-neutral-300',
          buttonWrapper: 'bg-white/90 hover:bg-white shadow-sm hover:shadow-md',
          buttonDashedRing: 'border-neutral-300',
          buttonSolidRing: 'border-neutral-400',
          buttonIconText: 'text-neutral-700',
        };
      case 'slate-haze':
        return {
          dotColor: '#8EA8C7',
          eyebrowColor: 'text-[#4A6B95]/85',
          celestialColor: 'text-[#3D5C84]',
          projectTextColor: 'text-[#4A6B95]',
          projectLineBg: 'bg-[#8EA8C7]/60',
          titleColor: 'text-[#234267]',
          titleShadow: '0 2px 18px rgba(35, 66, 103, 0.12)',
          barcodeColor: 'bg-[#4A6B95]/60',
          waveColor: 'text-[#8EA8C7]',
          dividerCircleBorder: 'border-[#8EA8C7]',
          dividerCircleBg: 'bg-white',
          dividerLineBg: 'bg-gradient-to-r from-[#8EA8C7]/80 via-[#8EA8C7] to-[#8EA8C7]/80',
          subTitleColor: 'text-[#345279]',
          taglineColor: 'text-[#55759C]',
          buttonRowLine: 'bg-[#8EA8C7]/50',
          buttonWrapper: 'bg-white/90 hover:bg-white shadow-sm hover:shadow-md',
          buttonDashedRing: 'border-[#8EA8C7]/50',
          buttonSolidRing: 'border-[#8EA8C7]/70',
          buttonIconText: 'text-[#385377]',
        };
      case 'amethyst-haze':
      default:
        return {
          dotColor: '#a892c7',
          eyebrowColor: 'text-[#6e5394]/85',
          celestialColor: 'text-[#5c3e85]',
          projectTextColor: 'text-[#6e5394]',
          projectLineBg: 'bg-[#a892c7]/60',
          titleColor: 'text-[#3e2363]',
          titleShadow: '0 2px 18px rgba(62, 35, 99, 0.12)',
          barcodeColor: 'bg-[#6e5394]/60',
          waveColor: 'text-[#a892c7]',
          dividerCircleBorder: 'border-[#a892c7]',
          dividerCircleBg: 'bg-white',
          dividerLineBg: 'bg-gradient-to-r from-[#a892c7]/80 via-[#a892c7] to-[#a892c7]/80',
          subTitleColor: 'text-[#4e2f7b]',
          taglineColor: 'text-[#6e5394]',
          buttonRowLine: 'bg-[#a892c7]/50',
          buttonWrapper: 'bg-white/90 hover:bg-white shadow-sm hover:shadow-md',
          buttonDashedRing: 'border-[#a892c7]/50',
          buttonSolidRing: 'border-[#a892c7]/70',
          buttonIconText: 'text-[#4e2f7b]',
        };
    }
  }, [theme, isDarkEffective]);



  // Kiểu nút Neumorphism + Glassmorphism cho chế độ sáng theo phong cách theme Frost áp dụng cho tất cả các theme
  const getLightModeNeumorphicBtnStyles = (th: NovelThemeId) => {
    switch (th) {
      case 'lululemon':
        return {
          btn: 'lulu-light-btn',
          text: 'text-[#cc7b8f] hover:text-[#b86277]',
          expand: 'lulu-light-btn !text-[#cc7b8f] hover:!text-[#b86277]',
        };
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
      case 'lululemon':
        return {
          cardBg: 'bg-gradient-to-br from-[#24151a] via-[#1c1115] to-[#150d10] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
          itemBg: 'bg-white/[0.04] hover:bg-white/[0.08]',
          iconBg: 'bg-[#84334b]/30 text-[#d4a3af]',
          badgeBg: 'bg-[#84334b]/30 text-[#d4a3af]',
          title: 'text-[#faf2f4] group-hover:text-[#d4a3af]',
          subtitle: 'text-[#c296a2]',
          chevron: 'text-[#d4a3af] bg-white/[0.05] hover:bg-white/[0.1]',
        };
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
        case 'lululemon':
          return {
            btnBg: '#84334b',
            btnBorder: 'border-0 border-transparent',
            textColor: 'text-white',
            shadowColor: '#421b27',
          };
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
        case 'lululemon':
          return {
            btnBg: '#f2ebef',
            btnBorder: 'border-[#ded0d4] hover:border-[#84334b]',
            textColor: 'text-[#382329]',
            shadowColor: '#ded0d4',
          };
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
  const shouldShowHeader = isHeaderVisible || isThemeMenuOpen || isMainMenuOpen;

  const themeIconColor = useMemo(() => {
    switch (theme) {
      case 'amethyst-haze': return 'text-[#9A74B8] dark:text-[#C5A7E6]';
      case 'slate-haze': return 'text-sky-500 dark:text-sky-400';
      case 'rosewater': return 'text-rose-500 dark:text-rose-400';
      case 'sage': return 'text-emerald-600 dark:text-emerald-400';
      case 'cosmic': default: return 'text-amber-400 dark:text-amber-300';
    }
  }, [theme]);

  // Dropdown Menu Neumorphism styles tailored for each theme (Frost, Purple, White, Sage, Linen)
  const menuThemeStyles = useMemo(() => {
    switch (theme) {
      case 'amethyst-haze':
        return {
          cloudGradient: isDarkEffective
            ? 'from-[#3a205a]/85 via-[#271440]/90 to-[#1c0d30]/85'
            : 'from-[#eddcf8]/90 via-white/85 to-[#e6d0f7]/75',
          columnClass: isDarkEffective ? 'sugar-column-amethyst-dark' : 'sugar-column-amethyst',
          btnConvex: isDarkEffective ? 'sugar-btn-convex-amethyst-dark' : 'sugar-btn-convex-amethyst',
          btnInset: isDarkEffective ? 'sugar-btn-inset-amethyst-dark' : 'sugar-btn-inset-amethyst',
          badge: isDarkEffective
            ? 'bg-[#2b1942] text-[#d4b9f5] border border-white/5'
            : 'bg-[#f0e4fc] text-[#5c3a85] border border-white/40 shadow-xs',
          heartColor: isDarkEffective ? '#c084fc' : '#9333ea',
        };
      case 'notebook':
        return {
          cloudGradient: isDarkEffective
            ? 'from-[#30333d]/85 via-[#22252c]/90 to-[#17191e]/85'
            : 'from-[#f1f3f7]/90 via-white/85 to-[#e5e7eb]/75',
          columnClass: isDarkEffective ? 'sugar-column-notebook-dark' : 'sugar-column-notebook',
          btnConvex: isDarkEffective ? 'sugar-btn-convex-notebook-dark' : 'sugar-btn-convex-notebook',
          btnInset: isDarkEffective ? 'sugar-btn-inset-notebook-dark' : 'sugar-btn-inset-notebook',
          badge: isDarkEffective
            ? 'bg-[#292c34] text-[#d1d5db] border border-white/5'
            : 'bg-[#e5e7eb] text-[#374151] border border-white/40 shadow-xs',
          heartColor: isDarkEffective ? '#e5e7eb' : '#4b5563',
        };
      case 'sage':
        return {
          cloudGradient: isDarkEffective
            ? 'from-[#233825]/85 via-[#18271a]/90 to-[#101c12]/85'
            : 'from-[#dce8db]/90 via-white/85 to-[#d1e2cf]/75',
          columnClass: isDarkEffective ? 'sugar-column-sage-dark' : 'sugar-column-sage',
          btnConvex: isDarkEffective ? 'sugar-btn-convex-sage-dark' : 'sugar-btn-convex-sage',
          btnInset: isDarkEffective ? 'sugar-btn-inset-sage-dark' : 'sugar-btn-inset-sage',
          badge: isDarkEffective
            ? 'bg-[#1b2b1d] text-[#b4d6b1] border border-white/5'
            : 'bg-[#deecdc] text-[#2c4e2a] border border-white/40 shadow-xs',
          heartColor: isDarkEffective ? '#86efac' : '#16a34a',
        };
      case 'mocha':
        return {
          cloudGradient: isDarkEffective
            ? 'from-[#3b2c23]/85 via-[#281e18]/90 to-[#1c1510]/85'
            : 'from-[#ebdcd1]/90 via-white/85 to-[#e2cebe]/75',
          columnClass: isDarkEffective ? 'sugar-column-mocha-dark' : 'sugar-column-mocha',
          btnConvex: isDarkEffective ? 'sugar-btn-convex-mocha-dark' : 'sugar-btn-convex-mocha',
          btnInset: isDarkEffective ? 'sugar-btn-inset-mocha-dark' : 'sugar-btn-inset-mocha',
          badge: isDarkEffective
            ? 'bg-[#31251e] text-[#e0c2b2] border border-white/5'
            : 'bg-[#eee1d6] text-[#5c4232] border border-white/40 shadow-xs',
          heartColor: isDarkEffective ? '#fcd34d' : '#b45309',
        };
      case 'slate-haze':
      default:
        return {
          cloudGradient: isDarkEffective
            ? 'from-[#38bdf8]/30 via-[#1d4ed8]/25 to-[#0b131e]/20'
            : 'from-[#cbe5fb]/90 via-white/85 to-[#dbeafc]/75',
          columnClass: isDarkEffective ? 'sugar-column-frost-dark' : 'sugar-column-frost',
          btnConvex: isDarkEffective ? 'sugar-btn-convex-frost-dark' : 'sugar-btn-convex',
          btnInset: isDarkEffective ? 'sugar-btn-inset-frost-dark' : 'sugar-btn-inset',
          badge: isDarkEffective
            ? 'bg-[#172435] text-[#8ea9c7] border border-white/5'
            : 'bg-[#dbeafc] text-[#1e4a78] border border-white/40 shadow-xs',
          heartColor: isDarkEffective ? '#38bdf8' : '#0284c7',
        };
    }
  }, [theme, isDarkEffective]);

  // Màu nền & đường viền của Truyện Vừa Mới Đăng dùng cho các Dropdown Menu
  const recentUpdatesStyles = useMemo(
    () => getRecentUpdatesCardStyles(theme, isDarkEffective),
    [theme, isDarkEffective]
  );

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${tStyles.pageBg} relative overflow-x-clip`}
      style={!isDarkEffective ? {
        background: getThemeLightPageBackground(theme)
      } : undefined}
    >
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
                <span className={`font-brand-title font-playfair text-lg sm:text-xl tracking-normal leading-none transition-colors ${tStyles.logoTextHover}`}>
                  Niên Thời
                </span>
              </div>
            </button>
          </div>

          {/* Center Search Input (Chỉ hiển thị khi bấm vào nút Tìm kiếm trong Menu Dropdown) */}
          {showSearchBar && (
            <div ref={searchContainerRef} className="flex-1 max-w-md hidden md:block relative animate-in fade-in zoom-in-95 duration-200">
              <form onSubmit={handleSearchSubmit} className="relative">
                <button
                  type="submit"
                  className={`absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 rounded-full hover:opacity-100 ${tStyles.searchIcon}`}
                  title="Tìm kiếm"
                >
                  <Search className="w-4 h-4" />
                </button>
                <input
                  ref={desktopSearchInputRef}
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
                  className={`w-full pl-9 pr-14 py-2 rounded-full border text-xs font-sans transition-colors focus:outline-hidden ${tStyles.input}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                      className={`text-xs font-bold hover:opacity-100 cursor-pointer ${tStyles.searchIcon}`}
                      title="Xóa tìm kiếm"
                    >
                      ×
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSearchBar(false);
                      setIsSearchFocused(false);
                    }}
                    className="p-0.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    title="Đóng tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Quick Suggestions Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {!isDarkEffective ? (
                    <div
                      className="p-[2.5px] rounded-2xl transition-all duration-300 shadow-2xl"
                      style={recentUpdatesStyles.outerStyle}
                    >
                      <div
                        className="rounded-[13.5px] overflow-hidden backdrop-blur-xl"
                        style={recentUpdatesStyles.innerStyle}
                      >
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
                                  window.scrollTo({ top: 0, behavior: 'instant' });
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
                    </div>
                  ) : (
                    <div
                      className="rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl"
                      style={recentUpdatesStyles.outerStyle}
                    >
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
                                window.scrollTo({ top: 0, behavior: 'instant' });
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
              )}
            </div>
          )}

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
                <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {!isDarkEffective ? (
                    <div
                      className="p-[2.5px] rounded-2xl transition-all duration-300"
                      style={recentUpdatesStyles.outerStyle}
                    >
                      <div
                        className="w-56 sm:w-64 p-2.5 rounded-[13.5px] backdrop-blur-xl text-zinc-900"
                        style={recentUpdatesStyles.innerStyle}
                      >
                        <div className="px-2 py-1 border-b border-zinc-500/20 flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
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
                                    ? 'bg-zinc-100 text-zinc-900 font-bold ring-1 ring-zinc-300'
                                    : 'hover:bg-zinc-50/80 text-zinc-700'
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

                        {/* Tắt/bật Hiệu ứng nền ở chế độ sáng */}
                        {/* NÚT TOGGLE CHUYỂN CHẾ ĐỘ TỐI Ở DƯỚI CÙNG */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            toggleDarkMode();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              cosmicAudio.playChime('sparkle');
                              toggleDarkMode();
                            }
                          }}
                          className="mt-2 pt-2 border-t border-zinc-500/20 flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-black/5 rounded-lg transition-colors select-none"
                          title="Nhấp để chuyển sang chế độ tối"
                        >
                          <span className="text-xs font-semibold select-none cursor-pointer">
                            Chế độ tối
                          </span>
                          <ClayThemeToggle
                            id="clay-toggle-home"
                            isOn={isDarkEffective}
                            onToggle={toggleDarkMode}
                            theme={theme}
                            title="Gạt để chuyển sang chế độ tối"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-56 sm:w-64 p-2.5 rounded-2xl text-zinc-100 shadow-2xl border border-white/20 opacity-100"
                      style={{ backgroundColor: '#0a0d14', background: '#0a0d14', backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
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
                                  ? 'bg-zinc-800 text-white font-bold'
                                  : 'hover:bg-zinc-800/60 text-zinc-300'
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

                      {/* Tắt/bật Hiệu ứng nền tuyết rơi của chế độ tối cho tất cả các theme */}
                      <div className="mt-1.5 pt-1.5 border-t border-zinc-500/20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            togglePurpleBgEffects(e);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer hover:bg-zinc-800/60 text-zinc-200"
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

                      {/* NÚT TOGGLE CHUYỂN CHẾ ĐỘ TỐI Ở DƯỚI CÙNG */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          cosmicAudio.playChime('sparkle');
                          toggleDarkMode();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            cosmicAudio.playChime('sparkle');
                            toggleDarkMode();
                          }
                        }}
                        className="mt-2 pt-2 border-t border-zinc-500/20 flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-white/5 rounded-lg transition-colors select-none"
                        title="Nhấp để chuyển sang chế độ sáng"
                      >
                        <span className="text-xs font-semibold select-none cursor-pointer">
                          Chế độ tối
                        </span>
                        <ClayThemeToggle
                          id="clay-toggle-home"
                          isOn={isDarkEffective}
                          onToggle={toggleDarkMode}
                          theme={theme}
                          title="Gạt để chuyển sang chế độ sáng"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dropdown Menu (Biểu tượng ☰ trên thanh header) */}
            <div className="relative" ref={mainMenuRef}>
              <button
                id="btn-header-main-menu"
                type="button"
                onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
                className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-xs ${tStyles.themeSelectorBtn}`}
                title="Menu điều hướng (Trang chủ, Thư viện, Tìm kiếm, Giới thiệu)"
                aria-label="Menu điều hướng"
                aria-expanded={isMainMenuOpen}
              >
                <Menu className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline font-sans font-semibold">Menu</span>
              </button>

              {isMainMenuOpen && (
                <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Lớp mây màu loang nhạt chỉ bao gọn sau khung menu dropdown, không phủ lan ra ngoài web */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 rounded-[1.35rem] bg-gradient-to-br ${menuThemeStyles.cloudGradient} blur-xl pointer-events-none -z-10`}
                  />

                  {/* Khung Menu với màu nền và đường viền của Truyện Vừa Mới Đăng */}
                  {!isDarkEffective ? (
                    <div
                      className="p-[2.5px] rounded-[1.35rem] transition-all duration-300 shadow-2xl"
                      style={recentUpdatesStyles.outerStyle}
                    >
                      <div
                        className="flex flex-col justify-between w-52 sm:w-64 p-3 sm:p-4 rounded-[1.2rem] backdrop-blur-xl relative z-10"
                        style={recentUpdatesStyles.innerStyle}
                      >
                        <div className="space-y-1.5 sm:space-y-2">
                          {/* 1. Trang chủ */}
                          <button
                            type="button"
                            onClick={() => {
                              cosmicAudio.playChime('sparkle');
                              setIsMainMenuOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                              !showSearchBar ? menuThemeStyles.btnInset : menuThemeStyles.btnConvex
                            }`}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                              <span>Trang chủ</span>
                            </div>
                            {!showSearchBar && (
                              <Heart
                                className="w-3.5 h-3.5 animate-pulse drop-shadow-xs shrink-0 pointer-events-none"
                                style={{
                                  color: menuThemeStyles.heartColor,
                                  fill: menuThemeStyles.heartColor,
                                }}
                              />
                            )}
                          </button>

                          {/* 2. Thư viện */}
                          <button
                            type="button"
                            onClick={() => {
                              cosmicAudio.playChime('sparkle');
                              setIsMainMenuOpen(false);
                              onOpenInternalBeyond?.();
                            }}
                            className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                              menuThemeStyles.btnConvex
                            }`}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                              <span>Thư viện</span>
                              <span className={`text-[7.5px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-sans font-medium ${menuThemeStyles.badge}`}>
                                Lịch sử đọc
                              </span>
                            </div>
                          </button>

                          {/* 3. Tìm kiếm */}
                          <button
                            type="button"
                            onClick={() => {
                              cosmicAudio.playChime('sparkle');
                              setIsMainMenuOpen(false);
                              setShowSearchBar(true);
                              setTimeout(() => {
                                desktopSearchInputRef.current?.focus();
                                mobileSearchInputRef.current?.focus();
                              }, 120);
                            }}
                            className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                              showSearchBar ? menuThemeStyles.btnInset : menuThemeStyles.btnConvex
                            }`}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                              <span>Tìm kiếm</span>
                            </div>
                            {showSearchBar && (
                              <Heart
                                className="w-3.5 h-3.5 animate-pulse drop-shadow-xs shrink-0 pointer-events-none"
                                style={{
                                  color: menuThemeStyles.heartColor,
                                  fill: menuThemeStyles.heartColor,
                                }}
                              />
                            )}
                          </button>

                          {/* 4. Giới thiệu về web */}
                          <button
                            type="button"
                            onClick={() => {
                              cosmicAudio.playChime('sparkle');
                              setIsMainMenuOpen(false);
                              if (onOpenLightIntro) {
                                onOpenLightIntro();
                              } else {
                                window.dispatchEvent(new CustomEvent('open-novel-intro'));
                              }
                            }}
                            className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                              menuThemeStyles.btnConvex
                            }`}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                              <span>Giới thiệu về web</span>
                            </div>
                          </button>

                          {/* 5. Quản trị viên (Tích hợp dưới cùng dropdown menu) */}
                          <button
                            type="button"
                            id="btn-admin-auth-menu"
                            onClick={() => {
                              cosmicAudio.playChime('sparkle');
                              setIsMainMenuOpen(false);
                              onOpenAdminAuth();
                            }}
                            className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                              menuThemeStyles.btnConvex
                            }`}
                            title={isAdmin ? `Quản trị viên: ${currentUser?.email}` : 'Đăng nhập tài khoản quản trị'}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                              <span>{isAdmin ? 'Quản trị (Admin)' : 'Quản trị'}</span>
                            </div>
                            {isAdmin && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col justify-between w-52 sm:w-64 p-3 sm:p-4 rounded-[1.35rem] relative z-10 shadow-2xl border border-white/20 opacity-100"
                      style={{ backgroundColor: '#0a0d14', background: '#0a0d14', backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
                    >
                      <div className="space-y-1.5 sm:space-y-2">
                        {/* 1. Trang chủ */}
                        <button
                          type="button"
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            setIsMainMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                            !showSearchBar ? menuThemeStyles.btnInset : menuThemeStyles.btnConvex
                          }`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                            <span>Trang chủ</span>
                          </div>
                          {!showSearchBar && (
                            <Heart
                              className="w-3.5 h-3.5 animate-pulse drop-shadow-xs shrink-0 pointer-events-none"
                              style={{
                                color: menuThemeStyles.heartColor,
                                fill: menuThemeStyles.heartColor,
                              }}
                            />
                          )}
                        </button>

                        {/* 2. Thư viện */}
                        <button
                          type="button"
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            setIsMainMenuOpen(false);
                            onOpenInternalBeyond?.();
                          }}
                          className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                            menuThemeStyles.btnConvex
                          }`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                            <span>Thư viện</span>
                            <span className={`text-[7.5px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-sans font-medium ${menuThemeStyles.badge}`}>
                              Lịch sử đọc
                            </span>
                          </div>
                        </button>

                        {/* 3. Tìm kiếm */}
                        <button
                          type="button"
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            setIsMainMenuOpen(false);
                            setShowSearchBar(true);
                            setTimeout(() => {
                              desktopSearchInputRef.current?.focus();
                              mobileSearchInputRef.current?.focus();
                            }, 120);
                          }}
                          className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                            showSearchBar ? menuThemeStyles.btnInset : menuThemeStyles.btnConvex
                          }`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                            <span>Tìm kiếm</span>
                          </div>
                          {showSearchBar && (
                            <Heart
                              className="w-3.5 h-3.5 animate-pulse drop-shadow-xs shrink-0 pointer-events-none"
                              style={{
                                color: menuThemeStyles.heartColor,
                                fill: menuThemeStyles.heartColor,
                              }}
                            />
                          )}
                        </button>

                        {/* 4. Giới thiệu về web */}
                        <button
                          type="button"
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            setIsMainMenuOpen(false);
                            if (onOpenLightIntro) {
                              onOpenLightIntro();
                            } else {
                              window.dispatchEvent(new CustomEvent('open-novel-intro'));
                            }
                          }}
                          className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                            menuThemeStyles.btnConvex
                          }`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                            <span>Giới thiệu về web</span>
                          </div>
                        </button>

                        {/* 5. Quản trị viên (Tích hợp dưới cùng dropdown menu) */}
                        <button
                          type="button"
                          id="btn-admin-auth-menu"
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            setIsMainMenuOpen(false);
                            onOpenAdminAuth();
                          }}
                          className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                            menuThemeStyles.btnConvex
                          }`}
                          title={isAdmin ? `Quản trị viên: ${currentUser?.email}` : 'Đăng nhập tài khoản quản trị'}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                            <span>{isAdmin ? 'Quản trị (Admin)' : 'Quản trị'}</span>
                          </div>
                          {isAdmin && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

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
        {/* Mobile Search Bar Section */}
        {showSearchBar ? (
          <div ref={mobileSearchContainerRef} className="px-4 py-2 md:hidden relative animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <button
                type="submit"
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 cursor-pointer ${tStyles.searchIcon}`}
                title="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
              <input
                ref={mobileSearchInputRef}
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
                className={`w-full pl-9 pr-14 py-2 rounded-xl border text-xs font-sans focus:outline-hidden ${tStyles.input}`}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className={`text-xs font-bold p-1 hover:opacity-100 cursor-pointer ${tStyles.searchIcon}`}
                    title="Xóa tìm kiếm"
                  >
                    ×
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchBar(false);
                    setIsSearchFocused(false);
                  }}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Đóng tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Suggestions Dropdown on Mobile */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-4 right-4 top-full mt-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {!isDarkEffective ? (
                  <div
                    className="p-[2.5px] rounded-2xl transition-all duration-300 shadow-2xl"
                    style={recentUpdatesStyles.outerStyle}
                  >
                    <div
                      className="rounded-[13.5px] overflow-hidden backdrop-blur-xl"
                      style={recentUpdatesStyles.innerStyle}
                    >
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
                                window.scrollTo({ top: 0, behavior: 'instant' });
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
                  </div>
                ) : (
                  <div
                    className="rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl"
                    style={recentUpdatesStyles.outerStyle}
                  >
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
                              window.scrollTo({ top: 0, behavior: 'instant' });
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
            )}
          </div>
        ) : (
          /* Giữ nguyên khoảng trống trên điện thoại khi thanh tìm kiếm chưa mở, không dời mục lên */
          <div aria-hidden="true" className="px-4 py-2 md:hidden relative h-[50px] pointer-events-none select-none" />
        )}

      {/* ========================================================================= */}
      {/* HERO FEATURED BANNER - BOARDING PASS / TICKET STYLE (THEME ADAPTIVE)       */}
      {/* ========================================================================= */}
      {currentHeroNovel && (
        <section className="relative w-full overflow-x-clip overflow-y-visible pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pt-14 lg:pb-20 select-none">
          {/* Lớp chấm bi họa tiết mờ (không có gradient nội bộ bị cắt khúc) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `radial-gradient(circle at 18% 28%, ${heroTheme.dotColor} 1px, transparent 1px), radial-gradient(circle at 82% 22%, ${heroTheme.dotColor} 1.2px, transparent 1.2px), radial-gradient(circle at 74% 65%, ${heroTheme.dotColor} 1px, transparent 1px), radial-gradient(circle at 28% 78%, ${heroTheme.dotColor} 1px, transparent 1px)`,
              backgroundSize: '160px 160px',
            }}
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center mb-8 sm:mb-12">
            {/* 1. TOP EYEBROW: + SIDE NOTES · ARCHIVE + */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`flex items-center gap-2 text-[10px] sm:text-xs font-sans tracking-[0.38em] uppercase ${heroTheme.eyebrowColor} font-medium mb-3 sm:mb-4`}
            >
              <span>+</span>
              <span>SIDE NOTES · ARCHIVE</span>
              <span>+</span>
            </motion.div>

            {/* 2. CELESTIAL ICONS & HERO TITLE */}
            <div className="relative w-full max-w-5xl flex items-center justify-center my-1 sm:my-2 px-2 sm:px-6">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.75, 1, 0.75],
                }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className={`absolute left-4 sm:left-10 md:left-14 lg:left-16 top-0 -translate-y-2 ${heroTheme.celestialColor}`}
                aria-hidden="true"
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0 C12 7 7 12 0 12 C7 12 12 17 12 24 C12 17 17 12 24 12 C17 12 12 7 12 0 Z" />
                </svg>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -3, 0],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className={`absolute right-4 sm:right-10 md:right-14 lg:right-16 top-0 -translate-y-2 flex items-center gap-1 ${heroTheme.celestialColor}`}
                aria-hidden="true"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                </svg>
                <span className="text-[10px]">✦</span>
              </motion.div>

              {/* KHỐI WEBSITE & SHELF 0922 (DỜI GẦN CHỮ CRESCENT DREAMS MỘT CHÚT) */}
              <div className="absolute left-2 sm:left-4 md:left-6 lg:left-8 bottom-4 sm:bottom-6 text-left hidden sm:flex flex-col items-start select-none z-10">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className={`italic text-xl sm:text-2xl ${heroTheme.celestialColor} font-pinyon`}>
                    W
                  </span>
                  <span className={`font-sans text-[9px] tracking-[0.24em] ${heroTheme.projectTextColor} uppercase`}>
                    EBSITE
                  </span>
                  <div className={`h-[1px] w-8 sm:w-12 ${heroTheme.projectLineBg} relative`}>
                    <span className={`absolute -right-1 -top-[7px] text-[10px] ${heroTheme.projectTextColor}`}>+</span>
                  </div>
                </div>
                <span className={`text-[7.5px] sm:text-[8.5px] tracking-[0.26em] ${heroTheme.taglineColor} uppercase font-sans mt-0.5`}>
                  SHELF 0922
                </span>
              </div>

              {/* KHỐI CẦU TỎA ÁNH SÁNG Ở CHẾ ĐỘ TỐI (KHỬ VỆT MÀU COLOR BANDING BẰNG SCANLINE / NOISE) */}
              {isDarkEffective && (
                <CrescentCelestialOrb theme={theme} />
              )}

              <motion.h1
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className={`relative z-10 font-pinyon text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-normal leading-tight italic font-normal py-2 px-6 sm:px-14 md:px-20 select-none whitespace-nowrap ${heroTheme.titleColor}`}
                style={{
                  fontFamily: "'Pinyon Script', cursive",
                  fontStyle: 'italic',
                  fontWeight: 400,
                  textShadow: heroTheme.titleShadow,
                }}
              >
                Crescent Dreams
              </motion.h1>

              {/* MÃ VẠCH (DỜI GẦN CHỮ CRESCENT DREAMS MỘT CHÚT) */}
              <div className="absolute right-2 sm:right-4 md:right-6 lg:right-8 bottom-3 sm:bottom-4 hidden sm:flex flex-col gap-[2px] items-end select-none z-10">
                {[
                  'w-6 h-[1.5px]', 'w-4 h-[1px]', 'w-6 h-[2px]', 'w-5 h-[1px]',
                  'w-6 h-[2.5px]', 'w-3 h-[1px]', 'w-6 h-[1.5px]', 'w-5 h-[1px]',
                  'w-6 h-[2px]', 'w-4 h-[1px]', 'w-6 h-[1.5px]', 'w-6 h-[1px]',
                ].map((cls, idx) => (
                  <span key={idx} className={`${cls} ${heroTheme.barcodeColor} block rounded-[0.5px]`} />
                ))}
              </div>
            </div>

            <div className="relative w-full max-w-xl h-6 sm:h-8 flex items-center justify-center overflow-hidden my-0.5 opacity-60">
              <svg className={`w-full h-full ${heroTheme.waveColor}`} viewBox="0 0 600 30" preserveAspectRatio="none" fill="none">
                <path d="M0 15 Q 75 0, 150 15 T 300 15 T 450 15 T 600 15" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" />
                <path d="M0 15 Q 75 30, 150 15 T 300 15 T 450 15 T 600 15" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" />
                <path d="M0 18 Q 75 6, 150 18 T 300 18 T 450 18 T 600 18" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1 4" />
              </svg>
            </div>

            <div className="w-full max-w-3xl flex items-center my-2 sm:my-3">
              <div className={`w-2 h-2 rounded-full border ${heroTheme.dividerCircleBorder} ${heroTheme.dividerCircleBg} shrink-0`} />
              <div className={`flex-1 h-[1px] ${heroTheme.dividerLineBg}`} />
              <div className={`w-2 h-2 rounded-full border ${heroTheme.dividerCircleBorder} ${heroTheme.dividerCircleBg} shrink-0`} />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className={`flex items-center gap-3 text-base sm:text-xl md:text-2xl tracking-[0.45em] ${heroTheme.subTitleColor} font-light mt-1 mb-2 select-none`}
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              <span>+</span>
              <span>Niên Thời</span>
              <span>+</span>
            </motion.div>

            <p className={`text-[8px] sm:text-[9.5px] md:text-[10px] tracking-[0.22em] ${heroTheme.taglineColor} uppercase font-sans text-center max-w-2xl px-2 mb-6 sm:mb-10`}>
              STARLIGHT — SOFTLY — SOME THINGS STAY BETWEEN THE LINES
            </p>

            {/* 4 NÚT TIÊU BIỂU: Giới Thiệu, Thư Viện, Wattpad, WordPress */}
            <div className="relative w-full max-w-2xl flex items-center justify-between px-3 sm:px-8">
              <div aria-hidden="true" className={`absolute left-6 right-6 top-[22px] sm:top-[28px] h-[1px] ${heroTheme.buttonRowLine} z-0`} />
              
              {/* 1. Giới Thiệu */}
              <button
                type="button"
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
                className="relative z-10 group cursor-pointer flex flex-col items-center focus:outline-hidden"
                title="Khám phá Giới Thiệu về trang web"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${heroTheme.buttonWrapper}`}
                >
                  <div className={`absolute inset-0.5 rounded-full border border-dashed ${heroTheme.buttonDashedRing}`} />
                  <div className={`absolute inset-1.5 rounded-full border ${heroTheme.buttonSolidRing}`} />
                  <div className={`relative z-10 ${heroTheme.buttonIconText} transition-transform group-hover:scale-110`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.25" />
                      <circle cx="12" cy="6.5" r="3" stroke="currentColor" />
                      <circle cx="17.2" cy="10.2" r="3" stroke="currentColor" />
                      <circle cx="15.2" cy="16.5" r="3" stroke="currentColor" />
                      <circle cx="8.8" cy="16.5" r="3" stroke="currentColor" />
                      <circle cx="6.8" cy="10.2" r="3" stroke="currentColor" />
                    </svg>
                  </div>
                </motion.div>
                <span className={`mt-2 text-[11px] sm:text-xs font-sans font-medium ${heroTheme.buttonIconText}`}>
                  Giới Thiệu
                </span>
              </button>

              {/* 2. Thư Viện */}
              <button
                type="button"
                onClick={() => {
                  cosmicAudio.playChime('sparkle');
                  onOpenInternalBeyond?.();
                }}
                className="relative z-10 group cursor-pointer flex flex-col items-center focus:outline-hidden"
                title="Khám phá Thư Viện"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${heroTheme.buttonWrapper}`}
                >
                  <div className={`absolute inset-0.5 rounded-full border border-dashed ${heroTheme.buttonDashedRing}`} />
                  <div className={`absolute inset-1.5 rounded-full border ${heroTheme.buttonSolidRing}`} />
                  <div className={`relative z-10 ${heroTheme.buttonIconText} transition-transform group-hover:scale-110`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                    </svg>
                  </div>
                </motion.div>
                <span className={`mt-2 text-[11px] sm:text-xs font-sans font-medium ${heroTheme.buttonIconText}`}>
                  Thư Viện
                </span>
              </button>

              {/* 3. Wattpad */}
              <a
                href="https://www.wattpad.com/user/Qingxiya52"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cosmicAudio.playChime('sparkle')}
                className="relative z-10 group cursor-pointer flex flex-col items-center focus:outline-hidden"
                title="Kênh đọc truyện Wattpad"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${heroTheme.buttonWrapper}`}
                >
                  <div className={`absolute inset-0.5 rounded-full border border-dashed ${heroTheme.buttonDashedRing}`} />
                  <div className={`absolute inset-1.5 rounded-full border ${heroTheme.buttonSolidRing}`} />
                  <div className={`relative z-10 ${heroTheme.buttonIconText} transition-transform group-hover:scale-110 flex items-center justify-center`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      <path d="M6 8h2" />
                      <path d="M6 12h2" />
                    </svg>
                  </div>
                </motion.div>
                <span className={`mt-2 text-[11px] sm:text-xs font-sans font-medium ${heroTheme.buttonIconText}`}>
                  Wattpad
                </span>
              </a>

              {/* 4. WordPress */}
              <a
                href="https://nienthoi003.wordpress.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cosmicAudio.playChime('sparkle')}
                className="relative z-10 group cursor-pointer flex flex-col items-center focus:outline-hidden"
                title="Website WordPress Niên Thời"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${heroTheme.buttonWrapper}`}
                >
                  <div className={`absolute inset-0.5 rounded-full border border-dashed ${heroTheme.buttonDashedRing}`} />
                  <div className={`absolute inset-1.5 rounded-full border ${heroTheme.buttonSolidRing}`} />
                  <div className={`relative z-10 ${heroTheme.buttonIconText} transition-transform group-hover:scale-110 flex items-center justify-center`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                </motion.div>
                <span className={`mt-2 text-[11px] sm:text-xs font-sans font-medium ${heroTheme.buttonIconText}`}>
                  WordPress
                </span>
              </a>
            </div>
          </div>

          <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 mt-16 sm:mt-0">
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
                      className={`font-source-serif font-bold italic text-2xl sm:text-3xl md:text-3xl lg:text-[34px] tracking-tight leading-snug cursor-pointer transition-colors ${ticketTheme.title}`}
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
                          ? currentHeroNovel.tags.slice(0, 2).join(' · ')
                          : 'Ngôn Tình · Hiện Đại'}
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
                        className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 select-none active:scale-95 ${ticketTheme.btnPrimary}`}
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
          </div>
        </section>
      )}
            





      {/* Main Content: Novel Grid + Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_29%] gap-8">
        
        {/* Left: Novel Catalog (Main Content) */}
        <div className="min-w-0 space-y-8">
          


          {/* Section Header with Status Filters */}
          <div id="completed-novels-section" className="space-y-3 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h2 className={`text-xl sm:text-2xl ${themeFontHeading} font-bold ${isDarkEffective ? '!text-white drop-shadow-sm' : tStyles.sectionTitle}`}>
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
                              className={`${theme === 'notebook' ? 'text-black' : 'text-white/90'} text-xs select-none`}
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
                  <span className="truncate font-source-serif">
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
              <h4 className={`text-base font-source-serif font-bold ${tStyles.sectionTitle}`}>
                {searchQuery.trim()
                  ? `Không tìm thấy tiểu thuyết nào khớp với "${searchQuery}"`
                  : 'Không tìm thấy tiểu thuyết phù hợp'}
              </h4>
              <p className={`text-xs font-source-serif ${tStyles.sectionSub}`}>
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
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5"
              >
                {displayedNovels.map((novel, idx) => (
                  <motion.div
                    key={novel.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 6) * 0.06, duration: 0.45 }}
                    onClick={() => {
                      onSelectNovel(novel);
                      window.scrollTo({ top: 0, behavior: 'instant' });
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
                        <h3 className={`text-xs sm:text-sm font-source-serif font-novel-title transition-colors line-clamp-2 leading-snug sm:leading-snug min-h-[2.4em] ${tStyles.cardTitle} ${tStyles.cardTitleHover}`}>
                          {novel.title}
                        </h3>

                        {/* Synopsis snippet - narrowed gap and slightly larger font */}
                        <p className={`text-[12px] sm:text-[13px] line-clamp-2 leading-relaxed font-source-sans ${tStyles.cardSynopsis}`}>
                          {novel.synopsis}
                        </p>
                      </div>
                    </div>

                    {/* Card Bottom: Author & Latest chapter */}
                    <div className={`pt-2 sm:pt-3 mt-2 sm:mt-3 border-t flex items-center justify-between text-[10px] sm:text-xs font-sans ${tStyles.cardFooterBorder}`}>
                      <span className={`truncate max-w-[70px] sm:max-w-[120px] font-semibold font-source-sans ${tStyles.cardAuthor}`}>
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
                  </motion.div>
                ))}
              </motion.div>

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

        </div>

        {/* Right Sidebar: Thanh bên chứa Chọn truyện ngẫu nhiên & Truyện vừa mới đăng (29%) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="min-w-0 space-y-6"
        >

          {/* Widget Ngày Mới & Kỷ Niệm (Hiển thị cho tất cả theme chế độ sáng & tối, đổi màu theo theme) */}
          <div className="w-full">
            <SugarTodayWidget theme={theme} isDarkMode={isDarkEffective} />
          </div>

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
                        <h3 className={`text-sm sm:text-base font-source-serif font-bold truncate ${recentStyles.titleColor}`}>
                          Truyện Vừa Mới Đăng
                        </h3>
                        <p className={`text-[10px] font-source-serif font-normal tracking-wider uppercase truncate ${recentStyles.subtitleColor}`}>
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
                              window.scrollTo({ top: 0, behavior: 'instant' });
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
                              <h4 className={`text-xs sm:text-[13px] font-source-serif font-semibold truncate transition-colors ${recentStyles.titleColor} ${recentStyles.itemTitleHoverClass}`}>
                                {n.title}
                              </h4>
                              <div className="flex items-center justify-between gap-1.5 mt-0.5 sm:mt-1">
                                <span className={`text-[10px] sm:text-[11px] font-source-serif truncate max-w-[130px] sm:max-w-[160px] lg:max-w-[210px] opacity-75 ${recentStyles.subtitleColor}`}>
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
                        <h3 className={`text-sm sm:text-base font-source-serif font-bold truncate ${recentStyles.titleColor}`}>
                          Truyện Vừa Mới Đăng
                        </h3>
                        <p className={`text-[10px] font-source-serif font-normal tracking-wider uppercase truncate ${recentStyles.subtitleColor}`}>
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
                              window.scrollTo({ top: 0, behavior: 'instant' });
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
                              <h4 className={`text-xs font-source-serif font-semibold truncate transition-colors ${recentStyles.itemTitleHoverClass}`}>
                                {n.title}
                              </h4>
                              <div className="flex items-center justify-between gap-1 mt-0.5">
                                <span className="text-[10px] font-source-serif text-slate-500 dark:text-slate-400 truncate max-w-[140px] sm:max-w-[160px] lg:max-w-[210px]">
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

        </motion.div>

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
