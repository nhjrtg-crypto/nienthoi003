import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Share2,
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  ArrowRight,
  Menu,
  Heart,
  Sun,
  Moon,
} from 'lucide-react';
import { Novel } from '../types';
import { cosmicAudio } from '../utils/audioSynth';
import { getRecentReads, RecentReadRecord } from '../utils/recentReads';
import { getDirectImageUrl, handleCoverImageError } from '../utils/imageUtils';
import { CherryBlossomTree } from './CherryBlossomTree';
import { useHeaderScroll } from '../utils/useHeaderScroll';
import {
  ScrapbookSvgDefs,
  RetroMessageDialog,
} from './HeroPhotoScrapbookDecorations';

interface InternalBeyondViewProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onOpenNovelToReadingPosition?: (novel: Novel, chapterNumber: number) => void;
  onBackToNovels: () => void;
  isAdmin?: boolean;
  onOpenAdminAuth?: () => void;
  onOpenLightIntro?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const RoundedStar: React.FC<{
  size?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  glow?: boolean;
  rotate?: number;
}> = ({
  size = 32,
  fill = '#FFE979',
  stroke = 'none',
  strokeWidth = 0,
  className = '',
  glow = false,
  rotate = 0,
}) => {
  const isOutline = fill === 'none';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} ${glow ? 'filter drop-shadow-[0_2px_8px_rgba(255,233,121,0.65)]' : ''}`}
      style={rotate ? { transform: `rotate(${rotate}deg)`, transformOrigin: 'center' } : undefined}
    >
      <path
        d="M11.35 3.35 C11.65 2.75 12.35 2.75 12.65 3.35 L14.7 7.7 C14.85 8.0 15.15 8.25 15.5 8.3 L20.15 8.8 C20.8 8.88 21.05 9.7 20.55 10.15 L17.05 13.3 C16.8 13.55 16.7 13.9 16.75 14.25 L17.7 18.9 C17.85 19.55 17.15 20.05 16.6 19.7 L12.55 17.35 C12.2 17.15 11.8 17.15 11.45 17.35 L7.4 19.7 C6.85 20.05 6.15 19.55 6.3 18.9 L7.25 14.25 C7.3 13.9 7.2 13.55 6.95 13.3 L3.45 10.15 C2.95 9.7 3.2 8.88 3.85 8.8 L8.5 8.3 C8.85 8.25 9.15 8.0 9.3 7.7 L11.35 3.35 Z"
        fill={isOutline ? 'none' : fill}
        stroke={isOutline ? stroke : fill}
        strokeWidth={isOutline ? strokeWidth || 2 : 1.2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export interface PetalProps {
  size?: number;        // Kích thước (mặc định 22px)
  rotate?: number;      // Góc nghiêng (độ)
  color?: string;       // Màu sắc tùy chọn
  className?: string;
}

export const Petal: React.FC<PetalProps> = ({
  size = 22,
  rotate = 0,
  color = 'rgba(183, 158, 212, 0.85)',
  className = '',
}) => {
  const height = (size * 14) / 22; // Giữ đúng tỉ lệ 22:14 ban đầu
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 22 14"
      fill="none"
      className={className}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      <path
        d="M1 7 C 5 1, 17 0, 21 7 C 17 14, 5 13, 1 7 Z"
        fill={color}
      />
    </svg>
  );
};

/**
 * 💠 HÌNH THOI LÀM TỪ CÁC CHẤM (DOT-MATRIX DIAMOND)
 * - Mặc định màu trắng tinh khôi, kích thước nhỏ gọn tinh tế
 */
export const DotMatrixDiamond: React.FC<{
  size?: number;
  className?: string;
  dotRadius?: number;
  color?: string;
}> = ({ size = 26, className = '', dotRadius = 0.95, color = '#FFFFFF' }) => {
  const coords: [number, number][] = [];
  for (let r = -3; r <= 3; r++) {
    const maxC = 3 - Math.abs(r);
    for (let c = -maxC; c <= maxC; c++) {
      coords.push([c, r]);
    }
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="-22 -22 44 44"
      fill={color}
      className={`pointer-events-none select-none ${className}`}
    >
      {coords.map(([x, y], idx) => (
        <circle
          key={idx}
          cx={x * 6}
          cy={y * 6}
          r={x === 0 && y === 0 ? dotRadius * 1.35 : dotRadius}
        />
      ))}
    </svg>
  );
};

export type BlossomColorKey = 'lilac' | 'sky' | 'peach' | 'white';

export const BLOSSOM_THEMES: Record<
  BlossomColorKey,
  { name: string; primary: string; secondary: string; center: string; tag: string }
> = {
  lilac: { name: 'Tím Oải Hương', primary: '#C084FC', secondary: '#DDD6FE', center: '#FDE047', tag: 'Tím' },
  sky: { name: 'Xanh Lưu Ly', primary: '#7DD3FC', secondary: '#BAE6FD', center: '#FEF08A', tag: 'Xanh' },
  peach: { name: 'Cam Đào', primary: '#FB923C', secondary: '#FED7AA', center: '#FEF08A', tag: 'Đào' },
  white: { name: 'Trắng Sứ Cúc', primary: '#FFFFFF', secondary: '#F1F5F9', center: '#FBBF24', tag: 'Trắng' },
};

const SvgBlossom: React.FC<{
  size?: number;
  className?: string;
  petalColor?: string;
  centerColor?: string;
}> = ({ size = 18, className = '', petalColor = '#C084FC', centerColor = '#FDE047' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <g fill={petalColor} fillOpacity="0.95">
      <circle cx="12" cy="6.6" r="3.7" />
      <circle cx="17.1" cy="10.2" r="3.7" />
      <circle cx="15.2" cy="16.4" r="3.7" />
      <circle cx="8.8" cy="16.4" r="3.7" />
      <circle cx="6.9" cy="10.2" r="3.7" />
    </g>
    <circle cx="12" cy="12" r="2.7" fill={centerColor} />
  </svg>
);

export type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonTheme {
  key: SeasonKey;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  activePillBg: string;
  activeTextColor: string;
  washiGradient: string;
  washiPattern: string;
  skyDay: string;
  skyNight: string;
  sunGlow: string;
  cloudsGradient: string;
  meadowColor: string;
  caption: string;
  captionIcon: string;
  blossomPrimary: string;
  blossomSecondary: string;
  blossomCenter: string;
}

export const SEASONS: Record<SeasonKey, SeasonTheme> = {
  spring: {
    key: 'spring',
    name: 'Xuân',
    subtitle: 'Mùa xuân đơm hoa',
    icon: '🌸',
    description: 'Xuân an nhiên: Gió xuân mơn man, hoa đào rơi và nắng hồng êm dịu',
    activePillBg: 'bg-gradient-to-r from-pink-200 to-rose-200 text-pink-900 shadow-sm',
    activeTextColor: 'text-pink-900 dark:text-pink-100 font-bold',
    washiGradient: 'linear-gradient(135deg, rgba(255, 210, 230, 0.85) 0%, rgba(245, 185, 215, 0.82) 100%)',
    washiPattern: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.7) 0, rgba(255,255,255,0.7) 3px, transparent 3px, transparent 6px)',
    skyDay: 'bg-gradient-to-b from-[#FFAEC9] via-[#F8D2E4] to-[#CDE8FE]',
    skyNight: 'bg-gradient-to-b from-[#4A2D48] via-[#633C60] to-[#8C5885]',
    sunGlow: 'text-rose-300 drop-shadow-[0_0_15px_rgba(251,113,133,0.85)]',
    cloudsGradient: 'linear-gradient(to top, #F3B5CD 0%, #FAD2E1 60%, rgba(250, 210, 225, 0) 100%)',
    meadowColor: '#87CC7A',
    caption: 'Spring Awakening',
    captionIcon: '🌸',
    blossomPrimary: '#F472B6',
    blossomSecondary: '#FBCFE8',
    blossomCenter: '#FEF08A',
  },
  summer: {
    key: 'summer',
    name: 'Hạ',
    subtitle: 'Nắng hạ rực rỡ',
    icon: '☀️',
    description: 'Hạ tươi mát: Bầu trời trong vắt, nắng vàng rực rỡ và thảo nguyên xanh biếc',
    activePillBg: 'bg-gradient-to-r from-sky-200 to-amber-200 text-sky-950 shadow-sm',
    activeTextColor: 'text-sky-950 dark:text-sky-100 font-bold',
    washiGradient: 'linear-gradient(135deg, rgba(230, 205, 238, 0.75) 0%, rgba(215, 185, 230, 0.72) 100%)',
    washiPattern: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.7) 0, rgba(255,255,255,0.7) 3px, transparent 3px, transparent 6px)',
    skyDay: 'bg-gradient-to-b from-[#60C0F5] via-[#85D2FC] to-[#C8EAFE]',
    skyNight: 'bg-gradient-to-b from-[#3D528F] via-[#4F69B0] to-[#7B90CC]',
    sunGlow: 'text-amber-300 drop-shadow-[0_0_15px_rgba(252,211,77,0.9)]',
    cloudsGradient: 'linear-gradient(to top, #A8B8E8 0%, #B9C6EE 60%, rgba(185, 198, 238, 0) 100%)',
    meadowColor: '#91B580',
    caption: 'To a brighter tomorrow',
    captionIcon: '✿',
    blossomPrimary: '#C084FC',
    blossomSecondary: '#DDD6FE',
    blossomCenter: '#FDE047',
  },
  autumn: {
    key: 'autumn',
    name: 'Thu',
    subtitle: 'Mùa thu lá vàng',
    icon: '🍁',
    description: 'Thu dịu êm: Lá phong bay bổng, ráng chiều mật ong ấm áp và gió heo may',
    activePillBg: 'bg-gradient-to-r from-amber-200 to-orange-200 text-amber-950 shadow-sm',
    activeTextColor: 'text-amber-950 dark:text-amber-100 font-bold',
    washiGradient: 'linear-gradient(135deg, rgba(248, 196, 140, 0.85) 0%, rgba(235, 160, 110, 0.82) 100%)',
    washiPattern: 'repeating-linear-gradient(45deg, rgba(255, 235, 205, 0.7) 0, rgba(255, 235, 205, 0.7) 3px, transparent 3px, transparent 6px)',
    skyDay: 'bg-gradient-to-b from-[#E76E2A] via-[#F59E42] to-[#FED7AA]',
    skyNight: 'bg-gradient-to-b from-[#4A1D34] via-[#662846] to-[#8C3D62]',
    sunGlow: 'text-amber-400 drop-shadow-[0_0_18px_rgba(245,158,11,0.95)]',
    cloudsGradient: 'linear-gradient(to top, #DE9A78 0%, #EDB89C 60%, rgba(237, 184, 156, 0) 100%)',
    meadowColor: '#C98A47',
    caption: 'Autumn Whispers',
    captionIcon: '🍁',
    blossomPrimary: '#FB923C',
    blossomSecondary: '#FED7AA',
    blossomCenter: '#FEF08A',
  },
  winter: {
    key: 'winter',
    name: 'Đông',
    subtitle: 'Mùa đông tuyết trắng',
    icon: '❄️',
    description: 'Đông cổ tích: Bông tuyết bay lượn, đồi tuyết trắng xoá và ánh sáng sương giá',
    activePillBg: 'bg-gradient-to-r from-sky-200 to-indigo-200 text-slate-900 shadow-sm',
    activeTextColor: 'text-slate-900 dark:text-sky-100 font-bold',
    washiGradient: 'linear-gradient(135deg, rgba(200, 225, 245, 0.85) 0%, rgba(180, 210, 235, 0.82) 100%)',
    washiPattern: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.85) 0, rgba(255, 255, 255, 0.85) 3px, transparent 3px, transparent 6px)',
    skyDay: 'bg-gradient-to-b from-[#7A9BB8] via-[#A0BCD4] to-[#DCE8F2]',
    skyNight: 'bg-gradient-to-b from-[#182338] via-[#263752] to-[#40567A]',
    sunGlow: 'text-sky-200 drop-shadow-[0_0_15px_rgba(186,230,253,0.95)]',
    cloudsGradient: 'linear-gradient(to top, #B4C8DC 0%, #D2E0EE 60%, rgba(210, 224, 238, 0) 100%)',
    meadowColor: '#EAF2F8',
    caption: 'Winter Wonderland',
    captionIcon: '❄️',
    blossomPrimary: '#E0F2FE',
    blossomSecondary: '#FFFFFF',
    blossomCenter: '#7DD3FC',
  },
};

export const InternalBeyondView: React.FC<InternalBeyondViewProps> = ({
  novels,
  onSelectNovel,
  onOpenNovelToReadingPosition,
  onBackToNovels,
  isAdmin,
  onOpenAdminAuth,
  onOpenLightIntro,
  isDarkMode: isDarkModeProp,
  onToggleDarkMode,
}) => {
  const [internalDarkMode, setInternalDarkMode] = useState(false);
  const isDarkMode = isDarkModeProp !== undefined ? isDarkModeProp : internalDarkMode;
  const isNightMode = isDarkMode;

  const toggleDark = () => {
    cosmicAudio.playChime(isDarkMode ? 'sparkle' : 'mid');
    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else {
      setInternalDarkMode((prev) => !prev);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const currentSeasonKey = (isDarkMode ? 'summer' : 'spring') as SeasonKey;
  const currentSeason = SEASONS[currentSeasonKey];
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPolaroidZoomed, setIsPolaroidZoomed] = useState(false);
  const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false);
  const libraryMenuRef = useRef<HTMLDivElement>(null);

  // Auto-hide header on scroll down, reveal on scroll up
  const isHeaderVisible = useHeaderScroll({ threshold: 40, delta: 6 });
  const shouldShowHeader = isHeaderVisible || isLibraryMenuOpen;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (libraryMenuRef.current && !libraryMenuRef.current.contains(event.target as Node)) {
        setIsLibraryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Đọc truyện gần đây (Mục Đang Đọc)
  const [recentIndex, setRecentIndex] = useState(0);
  const activeRecentReads = useMemo(() => getRecentReads(novels), [novels]);

  useEffect(() => {
    if (recentIndex >= activeRecentReads.length && activeRecentReads.length > 0) {
      setRecentIndex(0);
    }
  }, [activeRecentReads.length, recentIndex]);

  const handlePrevRecent = () => {
    if (activeRecentReads.length <= 1) return;
    setRecentIndex((prev) => (prev > 0 ? prev - 1 : activeRecentReads.length - 1));
  };

  const handleNextRecent = () => {
    if (activeRecentReads.length <= 1) return;
    setRecentIndex((prev) => (prev < activeRecentReads.length - 1 ? prev + 1 : 0));
  };

  const getReadingEstimate = (novel: Novel, record: RecentReadRecord) => {
    const totalChaps = novel.totalChaptersCount || novel.totalChapters || novel.chapters?.length || 10;
    const currentChap = Math.max(1, record.chapterNumber || 1);
    const remainingChaps = Math.max(0, totalChaps - currentChap);
    const pct = Math.min(100, Math.max(1, record.progressPercent || 1));

    const remainingMinutes = Math.max(8, Math.round(remainingChaps * 7.5 * (1 - (pct % 100) / 100) + 18));
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMinsRem = remainingMinutes % 60;
    const remainingStr = remainingHours > 0
      ? `Còn lại ${remainingHours} giờ ${remainingMinsRem} phút`
      : `Còn lại ${remainingMinutes} phút`;

    const readMinutes = Math.max(15, Math.round(currentChap * 7 + (pct / 100) * 12 + 20));
    const readHours = Math.floor(readMinutes / 60);
    const readMinsRem = readMinutes % 60;
    const readStr = readHours > 0
      ? `Đã đọc ${readHours} giờ ${readMinsRem} phút`
      : `Đã đọc ${readMinutes} phút`;

    return { remainingStr, readStr, pct };
  };

  const handleOpenReading = (novel: Novel, chapterNum: number) => {
    cosmicAudio.playChime('sparkle');
    if (onOpenNovelToReadingPosition) {
      onOpenNovelToReadingPosition(novel, chapterNum);
    } else {
      onSelectNovel(novel);
    }
  };

  const handleShare = () => {
    cosmicAudio.playChime('mid');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleEnterGarden = () => {
    cosmicAudio.playChime('sparkle');
    const target = document.getElementById('recent-reading-section') || document.getElementById('library-collection-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden transition-colors duration-700 selection:bg-[#B79ED4]/30 selection:text-[#3B2956] ${
        isDarkMode ? 'bg-[#121024] text-[#E5DCF2]' : 'bg-[#F8F5FC] text-[#3E2D58]'
      }`}
      style={{ fontFamily: "'Cormorant Garamond', 'Be Vietnam Pro', serif" }}
    >
      {/* =========================================================================
          TOP NAVIGATION BAR: Back to Novels, Share, Light/Night, Dropdown Menu
          ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between transition-all duration-300 transform border-b ${
          isDarkMode
            ? 'bg-[#181126]/90 border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] text-[#efeef6]'
            : 'bg-white/80 border-[#B79ED4]/20 shadow-xs text-[#3E2D58]'
        } ${shouldShowHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <button
          type="button"
          onClick={onBackToNovels}
          className={`p-2 sm:p-2.5 rounded-full text-xs font-sans font-semibold transition-all hover:scale-105 cursor-pointer ${
            isDarkMode
              ? 'bg-[#261A3D] border border-purple-400/30 text-[#EDE4FF] hover:bg-[#342452] shadow-xs'
              : 'amethyst-light-btn text-[#543F75]'
          }`}
          title="Quay lại"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-4 h-4 text-current" />
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Share Link */}
          <button
            type="button"
            onClick={handleShare}
            className={`p-2 rounded-full cursor-pointer transition-all ${
              isDarkMode
                ? 'bg-[#261A3D] border border-purple-400/30 text-[#EDE4FF] hover:bg-[#342452] shadow-xs'
                : 'amethyst-light-btn text-[#543F75]'
            }`}
            title="Chia sẻ liên kết"
            aria-label="Chia sẻ liên kết"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-current" />}
          </button>

          {/* Nút Light / Night trên header */}
          <button
            type="button"
            onClick={toggleDark}
            className={`p-2 rounded-full cursor-pointer transition-all ${
              isDarkMode
                ? 'bg-[#261A3D] border border-purple-400/30 hover:bg-[#342452] shadow-xs'
                : 'amethyst-light-btn'
            }`}
            title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.7)]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
            )}
          </button>

          {/* Dropdown Menu (Biểu tượng ☰ trên thanh header) mang từ theme purple sang */}
          <div className="relative" ref={libraryMenuRef}>
            <button
              type="button"
              onClick={() => setIsLibraryMenuOpen(!isLibraryMenuOpen)}
              className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isDarkMode
                  ? 'bg-[#261A3D] border border-purple-400/30 text-[#EDE4FF] hover:bg-[#342452]'
                  : 'amethyst-light-btn text-[#543F75]'
              }`}
              title="Menu điều hướng"
              aria-label="Menu điều hướng"
              aria-expanded={isLibraryMenuOpen}
            >
              <Menu className="w-4 h-4 shrink-0 text-current" />
              <span className="hidden sm:inline font-sans font-semibold text-current">Menu</span>
            </button>

            {isLibraryMenuOpen && (
              <div className="absolute right-0 mt-2 z-50">
                {/* Lớp mây loang nhạt phía sau dropdown menu */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-[#eddcf8]/90 via-white/85 to-[#e6d0f7]/75 dark:from-[#3a205a]/85 dark:via-[#271440]/90 dark:to-[#1c0d30]/85 blur-xl pointer-events-none -z-10"
                />
                <div className="sugar-column-amethyst dark:sugar-column-amethyst-dark flex flex-col justify-between w-60 sm:w-64 animate-in fade-in zoom-in-95 duration-150 relative z-10 !rounded-[1.35rem]">
                  <div className="space-y-2">
                    {/* 1. Trang chủ */}
                    <button
                      type="button"
                      onClick={() => {
                        cosmicAudio.playChime('sparkle');
                        setIsLibraryMenuOpen(false);
                        onBackToNovels();
                      }}
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer sugar-btn-convex-amethyst dark:sugar-btn-convex-amethyst-dark"
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 text-[11.5px] sm:text-[13px] font-serif tracking-wider">
                        <span>Trang chủ</span>
                      </div>
                    </button>

                    {/* 2. Thư viện (Đang xem) */}
                    <button
                      type="button"
                      onClick={() => {
                        cosmicAudio.playChime('sparkle');
                        setIsLibraryMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer sugar-btn-inset-amethyst dark:sugar-btn-inset-amethyst-dark"
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 text-[11.5px] sm:text-[13px] font-serif tracking-wider">
                        <span>Thư viện</span>
                        <span className="text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-sans font-medium bg-[#f0e4fc] dark:bg-[#2b1942] text-[#5c3a85] dark:text-[#d4b9f5] border border-white/40 shadow-xs">
                          Lịch sử đọc
                        </span>
                      </div>
                      <Heart
                        className="w-3.5 h-3.5 animate-pulse drop-shadow-xs shrink-0 pointer-events-none text-[#9333ea] dark:text-[#c084fc] fill-[#9333ea] dark:fill-[#c084fc]"
                      />
                    </button>

                    {/* 3. Giới thiệu về web */}
                    <button
                      type="button"
                      onClick={() => {
                        cosmicAudio.playChime('sparkle');
                        setIsLibraryMenuOpen(false);
                        if (onOpenLightIntro) {
                          onOpenLightIntro();
                        } else {
                          window.dispatchEvent(new CustomEvent('open-novel-intro'));
                        }
                      }}
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer sugar-btn-convex-amethyst dark:sugar-btn-convex-amethyst-dark"
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 text-[11.5px] sm:text-[13px] font-serif tracking-wider">
                        <span>Giới thiệu về web</span>
                      </div>
                    </button>

                    {/* 4. Quản trị */}
                    <button
                      type="button"
                      onClick={() => {
                        cosmicAudio.playChime('sparkle');
                        setIsLibraryMenuOpen(false);
                        onOpenAdminAuth?.();
                      }}
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer sugar-btn-convex-amethyst dark:sugar-btn-convex-amethyst-dark"
                      title={isAdmin ? 'Quản trị viên' : 'Đăng nhập tài khoản quản trị'}
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 text-[11.5px] sm:text-[13px] font-serif tracking-wider">
                        <span>{isAdmin ? 'Quản trị (Admin)' : 'Quản trị'}</span>
                      </div>
                      {isAdmin && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14 sm:h-16 pointer-events-none" aria-hidden="true" />

      {/* =========================================================================
          HERO SECTION: KIKI GARDEN HERO WITH POLAROID & 4 SEASONS
          ========================================================================= */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-8 pt-12 pb-14 sm:pt-16 sm:pb-20 select-none">
        {/* Nhúng SVG defs định nghĩa hoa văn caro, chấm bi washi và bóng đổ tự nhiên */}
        <ScrapbookSvgDefs />

        {/* Sky Background Gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{
            background: isDarkMode
              ? `
                radial-gradient(ellipse at 70% 30%, rgba(55, 38, 92, 0.9) 0%, rgba(24, 18, 48, 0.95) 50%, #100C22 100%),
                linear-gradient(to bottom, #15102A 0%, #1C153B 60%, #120D24 100%)
              `
              : `
                radial-gradient(ellipse at 70% 25%, rgba(246, 240, 255, 0.95) 0%, rgba(240, 228, 255, 0.85) 45%, rgba(228, 206, 254, 0.52) 85%, rgba(248, 244, 255, 0.95) 100%),
                linear-gradient(to bottom, #FAF6FF 0%, #F5EEFF 55%, #FCFAFE 100%)
              `,
          }}
        />

        {/* CÁC LỚP CỰC QUANG TÍM CHẾ ĐỘ SÁNG (PURPLE AURORA LIGHT MODE) */}
        {!isDarkMode && (
          <>
            {/* Đám mây phớt tím góc phải & góc dưới */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-[38rem] h-[38rem] rounded-full blur-3xl pointer-events-none opacity-70"
              style={{
                background: 'radial-gradient(circle, rgba(240, 226, 255, 0.7) 0%, rgba(228, 206, 254, 0.35) 50%, transparent 75%)',
              }}
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -right-16 w-[42rem] h-[30rem] rounded-full blur-2xl pointer-events-none opacity-80"
              style={{
                background: 'radial-gradient(circle, rgba(240, 226, 255, 0.7) 0%, rgba(228, 206, 254, 0.35) 50%, transparent 75%)',
              }}
            />

            {/* Vòm hào quang tím khuếch tán (Ambient Halo Dome) */}
            <div
              aria-hidden="true"
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[58rem] h-[34rem] rounded-full blur-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(228, 206, 254, 0.30) 0%, rgba(243, 232, 255, 0.15) 50%, transparent 75%)',
              }}
            />

            {/* Các dải sóng cực quang SVG (Không cần uốn lượn nhưng vẫn có dải sóng tĩnh) */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              <svg
                className="w-full h-full"
                viewBox="0 0 1440 900"
                fill="none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="auroraGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D8B4FE" stopOpacity="0.20" />
                    <stop offset="50%" stopColor="#B794F4" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="auroraGlow2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F0ABFC" stopOpacity="0.17" />
                    <stop offset="60%" stopColor="#9F67E8" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Dải sóng cực quang 1 (Tĩnh, có dải sóng đẹp mắt, không cần uốn lượn) */}
                <path
                  d="M-100 240 C 300 120, 600 360, 1000 190 C 1200 110, 1400 210, 1600 140 L 1600 0 L -100 0 Z"
                  fill="url(#auroraGlow1)"
                  filter="blur(28px)"
                />

                {/* Dải sóng cực quang 2 (Tĩnh, có dải sóng đẹp mắt, không cần uốn lượn) */}
                <path
                  d="M-50 330 C 350 200, 750 400, 1150 270 C 1350 220, 1500 300, 1600 240 L 1600 0 L -50 0 Z"
                  fill="url(#auroraGlow2)"
                  filter="blur(32px)"
                />
              </svg>


            </div>
          </>
        )}

        {/* FLOATING DRIFTING PETALS ANIMATION (CÁNH HOA RƠI TRONG NỀN TÍM) */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
          {[
            { left: '18%', top: '15%', delay: 0, rotate: 25, duration: 8 },
            { left: '38%', top: '22%', delay: 2, rotate: -35, duration: 9 },
            { left: '55%', top: '12%', delay: 4, rotate: 45, duration: 7 },
            { left: '72%', top: '28%', delay: 1, rotate: 15, duration: 8.5 },
            { left: '86%', top: '18%', delay: 3, rotate: -20, duration: 9.5 },
            { left: '32%', top: '65%', delay: 5, rotate: 55, duration: 7.5 },
            { left: '68%', top: '72%', delay: 2.5, rotate: -40, duration: 8 },
            { left: '82%', top: '55%', delay: 3.5, rotate: 30, duration: 8.2 },
          ].map((petal, pIdx) => (
            <motion.div
              key={pIdx}
              initial={{ y: -30, opacity: 0 }}
              animate={{
                // 1. Rơi từ trên xuống dưới
                y: [0, 45, 90, 140],
                // 2. Đung đưa lượn sóng ziczac sang trái / phải theo gió
                x: [0, pIdx % 2 === 0 ? 25 : -25, 0],
                // 3. Xoay tròn tự nhiên theo dòng không khí
                rotate: [petal.rotate, petal.rotate + 60, petal.rotate + 120],
                // 4. Mờ dần khi bắt đầu và biến mất êm dịu khi chạm đáy
                opacity: [0, 0.85, 0.85, 0],
              }}
              transition={{
                repeat: Infinity,        // Lặp lại vô tận
                duration: petal.duration, // Tốc độ rơi riêng của từng cánh (7s - 9.5s)
                delay: petal.delay,       // Độ trễ so le tránh rơi cùng lúc
                ease: 'easeInOut',        // Gia tốc mềm mại như gió thổi
              }}
              className="absolute"
              style={{ left: petal.left, top: petal.top }}
            >
              {/* Hình dáng SVG cánh hoa nguyên bản uốn cong thanh thoát */}
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
                <path
                  d="M1 7 C 5 1, 17 0, 21 7 C 17 14, 5 13, 1 7 Z"
                  fill={isNightMode ? 'rgba(195, 168, 225, 0.75)' : 'rgba(183, 158, 212, 0.85)'}
                />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* ICON CÁNH HOA TĨNH, BÔNG HOA TĨNH & HÌNH THOI CHẤM TRẮNG TRANG TRÍ NỀN TÍM (KHÔNG CHUYỂN ĐỘNG) */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-12 overflow-hidden">
          {/* 1. Các icon cánh hoa tĩnh không chuyển động (Màu tím thanh tao) */}
          <div className="absolute top-[12%] left-[8%] opacity-70 text-[#C084FC] dark:text-[#A855F7]/50">
            <Petal size={22} rotate={28} color="currentColor" />
          </div>
          <div className="absolute top-[26%] left-[24%] opacity-65 text-[#B794F4] dark:text-[#9F7AEA]/50">
            <Petal size={16} rotate={-38} color="currentColor" />
          </div>
          <div className="absolute top-[16%] right-[18%] opacity-70 text-[#C084FC] dark:text-[#A855F7]/50">
            <Petal size={24} rotate={-20} color="currentColor" />
          </div>
          <div className="absolute bottom-[24%] left-[10%] opacity-60 text-[#C084FC] dark:text-[#A855F7]/45">
            <Petal size={20} rotate={16} color="currentColor" />
          </div>
          <div className="absolute bottom-[16%] right-[22%] opacity-65 text-[#A855F7] dark:text-[#9333EA]/50">
            <Petal size={18} rotate={-32} color="currentColor" />
          </div>
        </div>

        <div className="relative z-20 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================================================================= */}
          {/* POLAROID COLUMN: POLAROID CARD + 4 SEASONS + 10 NIGHT STARS       */}
          {/* ================================================================= */}
          <div className="w-full lg:col-span-5 flex flex-col items-center justify-center relative overflow-visible">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -0.5 }}
              animate={{
                opacity: 1,
                scale: isPolaroidZoomed ? 1.05 : 1,
                rotate: isPolaroidZoomed ? 0 : -0.5,
              }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              onClick={() => setIsPolaroidZoomed(!isPolaroidZoomed)}
              className="relative cursor-pointer select-none group mx-auto overflow-visible"
              title="Nhấn để phóng to hoặc ngắm chi tiết khung ảnh"
            >
              {/* BỘ PHẦN TỬ TRANG TRÍ SCRAPBOOK XUNG QUANH BỨC ẢNH */}


              {/* Hộp thoại Retro Message (Nổi ở góc dưới bên phải - z-30) */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute -bottom-9 -right-4 sm:-bottom-11 sm:-right-6 z-30 pointer-events-auto"
              >
                <RetroMessageDialog isDarkMode={isDarkMode} delay={0.5} />
              </div>

              {/* HÌNH THOI CHẤM BI ĐỐI XỨNG MÀU TRẮNG - KÍCH THƯỚC NHỎ ĐẶT GẦN BỨC ẢNH */}
              <div className="absolute -top-3 sm:-top-4 -right-2 sm:-right-3 z-25 pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
                <DotMatrixDiamond size={20} dotRadius={0.80} color="#FFFFFF" />
              </div>

              {/* KHUNG CHỨA BỘ ẢNH XẾP CHỒNG (STACKED PHOTO CARDS) */}
              <div className="relative mx-auto w-[min(13.75rem,64vw)] sm:w-[min(19rem,80vw)] lg:w-[min(21rem,86vw)]">
                {/* 1. BỨC ẢNH PHỤ THỨ NHẤT LÓ RA BÊN TRÁI PHÍA SAU (-4.5 ĐỘ - HIỆU ỨNG XẾP CHỒNG - MÀU TRẮNG Ở CHẾ ĐỘ SÁNG) */}
                <div
                  className={`absolute inset-0 z-10 pointer-events-none rounded-sm transition-transform duration-500 origin-bottom-left rotate-[-4.5deg] -translate-x-3 -translate-y-2.5 sm:-translate-x-4 sm:-translate-y-3 p-3 sm:p-4 pb-6 sm:pb-8 shadow-md ${
                    isDarkMode
                      ? 'bg-[#181028] border border-purple-400/20 shadow-[0_12px_28px_rgba(0,0,0,0.65)]'
                      : 'bg-white border border-[#EBE6DF] shadow-[0_10px_24px_rgba(78,48,98,0.10)]'
                  }`}
                  style={{ filter: isDarkMode ? 'brightness(0.85)' : 'none' }}
                >
                  <div className={`w-full aspect-[4/4.75] rounded-xs overflow-hidden ${
                    isDarkMode ? 'bg-[#120B20]' : 'bg-[#FAF8F5]'
                  }`}>
                    <div className="w-full h-full opacity-35 bg-gradient-to-br from-purple-400/20 via-pink-300/15 to-transparent" />
                  </div>
                </div>

                {/* 2. BỨC ẢNH PHỤ THỨ HAI LÓ RA BÊN PHẢI PHÍA SAU (+3.8 ĐỘ - HIỆU ỨNG XẾP CHỒNG - MÀU TRẮNG Ở CHẾ ĐỘ SÁNG) */}
                <div
                  className={`absolute inset-0 z-11 pointer-events-none rounded-sm transition-transform duration-500 origin-bottom-right rotate-[3.8deg] translate-x-2.5 translate-y-2 sm:translate-x-3.5 sm:translate-y-2.5 p-3 sm:p-4 pb-6 sm:pb-8 shadow-md ${
                    isDarkMode
                      ? 'bg-[#160D24] border border-purple-400/25 shadow-[0_10px_24px_rgba(0,0,0,0.6)]'
                      : 'bg-white border border-[#EAE4DD] shadow-[0_10px_22px_rgba(78,48,98,0.08)]'
                  }`}
                  style={{ filter: isDarkMode ? 'brightness(0.9)' : 'none' }}
                >
                  <div className={`w-full aspect-[4/4.75] rounded-xs overflow-hidden ${
                    isDarkMode ? 'bg-[#140C22]' : 'bg-[#FAF8F5]'
                  }`}>
                    <div className="w-full h-full opacity-35 bg-gradient-to-tl from-indigo-400/20 via-purple-300/15 to-transparent" />
                  </div>
                </div>

                {/* Polaroid Frame Chính:
                    - Trên điện thoại: kích thước nhỏ hơn một chút (w-[min(13.75rem,64vw)])
                    - Trên máy tính: giữ nguyên (sm:w-[min(19rem,80vw)] lg:w-[min(21rem,86vw)]) */}
                <div className={`relative z-20 ${
                  isDarkMode
                    ? 'bg-[#1C152E] border border-purple-400/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
                    : 'bg-white shadow-[0_20px_45px_rgba(78,48,98,0.22)]'
                } p-3 sm:p-4 pb-6 sm:pb-8 rounded-sm w-full mx-auto transition-colors duration-500`}>
                {/* INNER ARTWORK: 4 SEASONS (XUÂN, HẠ, THU, ĐÔNG) */}
                <div className={`relative aspect-[4/4.75] rounded-xs overflow-hidden transition-all duration-700 flex flex-col justify-between ${
                  isDarkMode ? currentSeason.skyNight : currentSeason.skyDay
                }`}>

                  {/* Sky Background Elements */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Sky Gradient */}
                    <div className={`absolute inset-0 transition-all duration-700 ${
                      isDarkMode ? currentSeason.skyNight : currentSeason.skyDay
                    }`} />

                    {/* Lớp bóng Inset Hốc ảnh Neumorphic tương tự Chọn Truyện Ngẫu Nhiên */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-xs border border-black/10 dark:border-white/10 shadow-[inset_0_2.5px_6px_rgba(0,0,0,0.22),inset_0_-1px_2px_rgba(255,255,255,0.55)] dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.25)] z-25"
                      aria-hidden="true"
                    />

                    {/* 1. SOFT AMBIENT GLOW: Quầng sáng môi trường êm dịu lan tỏa */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-60 h-36 sm:h-44 rounded-full blur-3xl pointer-events-none bg-purple-400/20 dark:bg-purple-500/25"
                    />
                    <div
                      className="absolute -top-8 -right-8 w-36 h-36 rounded-full blur-2xl pointer-events-none bg-pink-300/20 dark:bg-indigo-400/25"
                    />

                    {/* HIỆU ỨNG GRAIN: Lớp hạt nhiễu vi mô tự nhiên ở chế độ tối */}
                    {isDarkMode && (
                      <div
                        className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                        style={{
                          opacity: 0.16,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        }}
                        aria-hidden="true"
                      />
                    )}

                    {/* 2. SUBTLE DIAGONAL LIGHT RAYS: Tia sáng xiên thanh mảnh mờ ảo ở chế độ sáng */}
                    {!isDarkMode && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                        <svg
                          viewBox="0 0 400 220"
                          preserveAspectRatio="none"
                          className="w-full h-full opacity-25 text-purple-300"
                        >
                          <defs>
                            <filter id="polaroidRayBlur" x="-10%" y="-10%" width="120%" height="120%">
                              <feGaussianBlur stdDeviation="0.9" />
                            </filter>
                            <linearGradient id="polaroidRayFadeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.45" />
                              <stop offset="85%" stopColor="#ffffff" stopOpacity="0.12" />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                            </linearGradient>
                            <mask id="polaroidRayMask">
                              <rect x="0" y="0" width="400" height="220" fill="url(#polaroidRayFadeGrad)" />
                            </mask>
                          </defs>
                          <g mask="url(#polaroidRayMask)" filter="url(#polaroidRayBlur)">
                            {Array.from({ length: 14 }).map((_, i) => {
                              const c = -20 + i * 36;
                              return (
                                <line
                                  key={i}
                                  x1={c}
                                  y1={-15}
                                  x2={c - 130}
                                  y2={160}
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              );
                            })}
                          </g>
                        </svg>
                      </div>
                    )}

                    {/* KHÔI PHỤC CHÍNH XÁC 10 NGÔI SAO 5 CÁNH MÀU VÀNG TRONG CHẾ ĐỘ TỐI (DỮ LIỆU GỐC) */}
                    {isDarkMode ? (
                      <div className="absolute inset-0 pointer-events-none z-15">
                        <motion.div
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: [0.2, 1.15, 1], opacity: [0, 1, 1] }}
                          transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
                          className="absolute top-[8%] right-[7%]"
                        >
                          <RoundedStar size={32} className="sm:w-[44px] sm:h-[44px]" fill="#FFE979" glow rotate={18} />
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: [0.2, 1.15, 1], opacity: [0, 1, 1] }}
                          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                          className="absolute top-[14%] left-[48%]"
                        >
                          <RoundedStar size={16} className="sm:w-[22px] sm:h-[22px]" fill="none" stroke="#FFE979" strokeWidth={2} rotate={-24} />
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: [0.2, 1.15, 1], opacity: [0, 1, 1] }}
                          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                          className="absolute top-[22%] left-[24%]"
                        >
                          <RoundedStar size={24} className="sm:w-[32px] sm:h-[32px]" fill="#FFE979" glow rotate={32} />
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: [0.2, 1.15, 1], opacity: [0, 1, 1] }}
                          transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                          className="absolute top-[35%] left-[54%]"
                        >
                          <RoundedStar size={28} className="sm:w-[38px] sm:h-[38px]" fill="#FFE979" glow rotate={-16} />
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: [0.2, 1.15, 1], opacity: [0, 1, 1] }}
                          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                          className="absolute top-[40%] left-[8%]"
                        >
                          <RoundedStar size={22} className="sm:w-[30px] sm:h-[30px]" fill="#FFE979" rotate={40} />
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: [0.2, 1.15, 1], opacity: [0, 1, 1] }}
                          transition={{ duration: 1.2, delay: 0.7, ease: 'easeOut' }}
                          className="absolute top-[48%] right-[10%]"
                        >
                          <RoundedStar size={16} className="sm:w-[22px] sm:h-[22px]" fill="none" stroke="#FFE979" strokeWidth={2} rotate={-35} />
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: [0.2, 1.15, 1], opacity: [0, 1, 1] }}
                          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                          className="absolute top-[58%] left-[28%]"
                        >
                          <RoundedStar size={20} className="sm:w-[28px] sm:h-[28px]" fill="#FFE979" rotate={-14} />
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: [0.2, 1.2, 1], opacity: [0, 1, 1] }}
                          transition={{ duration: 1.4, delay: 0.8, ease: 'easeOut' }}
                          className="absolute top-[64%] left-[62%]"
                        >
                          <RoundedStar size={18} className="sm:w-[24px] sm:h-[24px]" fill="none" stroke="#FFF7C2" strokeWidth={2} glow rotate={25} />
                        </motion.div>
                      </div>
                    ) : (
                      /* CHẾ ĐỘ SÁNG: CÁC HẠT SAO THANH NHÃ */
                      <div className="absolute inset-0 pointer-events-none z-15">
                        <div
                          className="absolute top-4 right-6 sm:top-5 sm:right-8 flex items-center justify-center animate-pulse"
                          style={{ animationDuration: '3.5s' }}
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white/90 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
                            <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" fill="currentColor" />
                          </svg>
                        </div>
                        <div
                          className="absolute bottom-16 left-6 sm:bottom-20 sm:left-8 flex items-center justify-center animate-pulse"
                          style={{ animationDuration: '4.2s', animationDelay: '1.2s' }}
                        >
                          <svg viewBox="0 0 24 24" className="w-3 h-3 text-white/85 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]">
                            <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" fill="currentColor" />
                          </svg>
                        </div>
                        <div
                          className="absolute top-7 left-1/4 flex items-center justify-center animate-pulse"
                          style={{ animationDuration: '5s', animationDelay: '2.4s' }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#c084fc]" />
                        </div>
                        <div
                          className="absolute bottom-24 right-1/4 flex items-center justify-center animate-pulse"
                          style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#c084fc]" />
                        </div>
                        <div
                          className="absolute top-1/3 right-6 w-1 h-1 rounded-full bg-white/85 animate-pulse"
                          style={{ animationDuration: '4.5s', animationDelay: '1.8s' }}
                        />
                      </div>
                    )}

                    {/* Celestial Icon: Moon for Night (static), Seasonal Sun for Day */}
                    {isDarkMode ? (
                      <div className="absolute top-5 sm:top-7 left-6 sm:left-8 text-white/85 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] z-20">
                        <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                        </svg>
                      </div>
                    ) : (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
                        className={`absolute top-4 sm:top-6 left-5 sm:left-7 transition-colors duration-700 ${currentSeason.sunGlow}`}
                      >
                        <svg width="24" height="24" className="sm:w-[30px] sm:h-[30px]" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="6" />
                          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                      </motion.div>
                    )}

                    {/* =========================================================================
                        HIỆU ỨNG ĐẶC TRƯNG TỪNG MÙA:
                        - XUÂN: Cánh hoa đào rơi & mây trắng trôi
                        - HẠ: Thanh kẹo Confetti pastel + 2 đám mây trắng trôi
                        - THU: Lá phong vàng đỏ rơi bay theo gió
                        - ĐÔNG: Bông tuyết trắng tinh khôi rơi chầm chậm
                        ========================================================================= */}
                    
                    {/* CHẾ ĐỘ XUÂN: CÁNH HOA ĐÀO RƠI & MÂY TRẮNG TRÔI */}
                    {currentSeasonKey === 'spring' && (
                      <>
                        {!isDarkMode && (
                          <>
                            <motion.div
                              animate={{ x: [-12, 14, -12] }}
                              transition={{ repeat: Infinity, duration: 13, ease: 'easeInOut' }}
                              className="absolute top-6 sm:top-9 right-6 sm:right-10 opacity-90 pointer-events-none z-15"
                            >
                              <div className="w-16 sm:w-20 h-5 sm:h-7 bg-white/95 rounded-full shadow-xs relative">
                                <div className="absolute -top-2.5 sm:-top-3 left-2.5 sm:left-3 w-6 sm:w-8 h-6 sm:h-8 bg-white/95 rounded-full" />
                                <div className="absolute -top-3 sm:-top-4 left-6 sm:left-8 w-8 sm:w-10 h-8 sm:h-10 bg-white/95 rounded-full" />
                              </div>
                            </motion.div>

                            <motion.div
                              animate={{ x: [10, -14, 10] }}
                              transition={{ repeat: Infinity, duration: 17, ease: 'easeInOut' }}
                              className="absolute top-18 sm:top-24 left-5 sm:left-8 opacity-80 pointer-events-none z-15"
                            >
                              <div className="w-13 sm:w-16 h-4.5 sm:h-6 bg-white/90 rounded-full shadow-xs relative">
                                <div className="absolute -top-2 sm:-top-2.5 left-2 sm:left-2.5 w-5.5 sm:w-7 h-5.5 sm:h-7 bg-white/90 rounded-full" />
                                <div className="absolute -top-2.5 sm:-top-3.5 left-5 sm:left-6 w-6.5 sm:w-8 h-6.5 sm:h-8 bg-white/90 rounded-full" />
                              </div>
                            </motion.div>
                          </>
                        )}

                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                          {[
                            { left: '16%', delay: 0, duration: 4.8, size: 14, rotate: 20 },
                            { left: '42%', delay: 1.6, duration: 5.4, size: 16, rotate: -35 },
                            { left: '68%', delay: 0.8, duration: 4.5, size: 13, rotate: 45 },
                            { left: '84%', delay: 2.4, duration: 5.0, size: 15, rotate: -20 },
                            { left: '28%', delay: 3.2, duration: 4.2, size: 12, rotate: 60 },
                          ].map((petal, idx) => (
                            <motion.div
                              key={`spring-petal-${idx}`}
                              initial={{ y: -20, x: 0, opacity: 0 }}
                              animate={{
                                y: [0, 80, 160, 240],
                                x: [0, (idx % 2 === 0 ? 1 : -1) * 22, (idx % 2 === 0 ? -1 : 1) * 16, 0],
                                rotate: [petal.rotate, petal.rotate + 90, petal.rotate + 180, petal.rotate + 270],
                                opacity: [0, 0.9, 0.9, 0],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: petal.duration,
                                delay: petal.delay,
                                ease: 'easeInOut',
                              }}
                              className="absolute"
                              style={{ left: petal.left, top: '-5%' }}
                            >
                              <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M12 2 C8 6, 4 12, 12 22 C20 12, 16 6, 12 2 Z"
                                  fill="rgba(251, 182, 206, 0.92)"
                                  stroke="rgba(244, 114, 182, 0.45)"
                                  strokeWidth="0.8"
                                />
                              </svg>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* CHẾ ĐỘ HẠ: CONFETTI PASTEL & 2 ĐÁM MÂY TRẮNG TRÔI */}
                    {currentSeasonKey === 'summer' && (
                      <>
                        <div className="absolute top-8 sm:top-12 right-10 sm:right-14 w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-pink-300 to-rose-200 opacity-80 rotate-[-28deg] shadow-xs" />
                        <div className="absolute top-26 sm:top-36 left-10 sm:left-16 w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-pink-300 to-purple-200 opacity-75 rotate-[-24deg]" />
                        <div className="absolute top-32 sm:top-44 right-12 sm:right-20 w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-purple-200 to-pink-300 opacity-75 rotate-[-26deg]" />
                        
                        {!isDarkMode && (
                          <>
                            <motion.div
                              animate={{ x: [-10, 10, -10] }}
                              transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
                              className="absolute top-7 sm:top-10 right-6 sm:right-10 opacity-85 pointer-events-none"
                            >
                              <div className="w-16 sm:w-20 h-5 sm:h-7 bg-white/90 rounded-full shadow-xs relative">
                                <div className="absolute -top-2.5 sm:-top-3 left-2.5 sm:left-3 w-6 sm:w-8 h-6 sm:h-8 bg-white/90 rounded-full" />
                                <div className="absolute -top-3 sm:-top-4 left-6 sm:left-8 w-8 sm:w-10 h-8 sm:h-10 bg-white/90 rounded-full" />
                              </div>
                            </motion.div>

                            <motion.div
                              animate={{ x: [10, -10, 10] }}
                              transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
                              className="absolute top-20 sm:top-28 left-6 sm:left-8 opacity-75 pointer-events-none"
                            >
                              <div className="w-13 sm:w-16 h-4.5 sm:h-6 bg-white/85 rounded-full shadow-xs relative">
                                <div className="absolute -top-2 sm:-top-2.5 left-2 sm:left-2.5 w-5.5 sm:w-7 h-5.5 sm:h-7 bg-white/85 rounded-full" />
                                <div className="absolute -top-2.5 sm:-top-3.5 left-5 sm:left-6 w-6.5 sm:w-8 h-6.5 sm:h-8 bg-white/85 rounded-full" />
                              </div>
                            </motion.div>
                          </>
                        )}
                      </>
                    )}

                    {/* CHẾ ĐỘ THU: LÁ PHONG VÀNG ĐỎ RƠI BỒNG BỀNH */}
                    {(currentSeasonKey as string) === 'autumn' && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                        {[
                          { left: '15%', delay: 0, duration: 5.2, color: '#EA580C', size: 16 },
                          { left: '46%', delay: 1.8, duration: 5.6, color: '#F59E0B', size: 18 },
                          { left: '76%', delay: 0.6, duration: 4.8, color: '#DC2626', size: 15 },
                          { left: '30%', delay: 2.6, duration: 5.0, color: '#D97706', size: 14 },
                          { left: '64%', delay: 3.4, duration: 4.4, color: '#B45309', size: 15 },
                        ].map((leaf, idx) => (
                          <motion.div
                            key={`autumn-leaf-${idx}`}
                            initial={{ y: -20, x: 0, opacity: 0 }}
                            animate={{
                              y: [0, 80, 160, 240],
                              x: [0, (idx % 2 === 0 ? 1 : -1) * 26, (idx % 2 === 0 ? -1 : 1) * 20, 0],
                              rotate: [0, 90, 180, 270],
                              opacity: [0, 0.95, 0.95, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: leaf.duration,
                              delay: leaf.delay,
                              ease: 'easeInOut',
                            }}
                            className="absolute"
                            style={{ left: leaf.left, top: '-5%' }}
                          >
                            <svg width={leaf.size} height={leaf.size} viewBox="0 0 24 24" fill={leaf.color}>
                              <path d="M12 2 L13.5 7 L17 5 L15.5 9.5 L20 10 L16.5 13 L19 16.5 L14.5 16 L14 20 L12 17 L10 20 L9.5 16 L5 16.5 L7.5 13 L4 10 L8.5 9.5 L7 5 L10.5 7 Z" />
                            </svg>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* CHẾ ĐỘ ĐÔNG: BÔNG TUYẾT TRẮNG RƠI CỔ TÍCH */}
                    {(currentSeasonKey as string) === 'winter' && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                        {[
                          { left: '12%', delay: 0, duration: 4.2, size: 14, icon: '❄' },
                          { left: '32%', delay: 1.4, duration: 5.5, size: 11, icon: '❅' },
                          { left: '54%', delay: 0.5, duration: 4.8, size: 15, icon: '❆' },
                          { left: '74%', delay: 2.1, duration: 5.0, size: 12, icon: '❄' },
                          { left: '88%', delay: 1.0, duration: 4.5, size: 14, icon: '❅' },
                          { left: '40%', delay: 3.0, duration: 5.2, size: 11, icon: '❆' },
                        ].map((flake, idx) => (
                          <motion.div
                            key={`winter-flake-${idx}`}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{
                              y: [0, 75, 150, 240],
                              x: [0, (idx % 2 === 0 ? 1 : -1) * 14, (idx % 2 === 0 ? -1 : 1) * 10, 0],
                              rotate: [0, 180, 360],
                              opacity: [0, 0.95, 0.95, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: flake.duration,
                              delay: flake.delay,
                              ease: 'linear',
                            }}
                            className="absolute text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] select-none pointer-events-none font-sans"
                            style={{ left: flake.left, top: '-5%', fontSize: `${flake.size}px` }}
                          >
                            {flake.icon}
                          </motion.div>
                        ))}
                      </div>
                    )}



                    {/* =========================================================================
                        GIỮ ĐỦ 100% CẢ 6 BÔNG HOA 5 CÁNH (MÀU SẮC BIẾN HOÁ THEO MÙA)
                        ========================================================================= */}
                    <div className="absolute top-[18%] left-[18%]">
                      <SvgBlossom
                        size={13}
                        className="sm:w-[16px] sm:h-[16px]"
                        petalColor={currentSeason.blossomPrimary}
                        centerColor={currentSeason.blossomCenter}
                      />
                    </div>
                    <div className="absolute top-[24%] right-[22%]">
                      <SvgBlossom
                        size={14}
                        className="sm:w-[18px] sm:h-[18px]"
                        petalColor={currentSeason.blossomSecondary}
                        centerColor={currentSeason.blossomCenter}
                      />
                    </div>
                    <div className="absolute top-[46%] left-[14%]">
                      <SvgBlossom
                        size={12}
                        className="sm:w-[15px] sm:h-[15px]"
                        petalColor={currentSeason.blossomPrimary}
                        centerColor={currentSeason.blossomCenter}
                      />
                    </div>
                    <div className="absolute top-[46%] left-[46%]">
                      <SvgBlossom
                        size={13}
                        className="sm:w-[17px] sm:h-[17px]"
                        petalColor={currentSeason.blossomSecondary}
                        centerColor={currentSeason.blossomCenter}
                      />
                    </div>
                    <div className="absolute top-[62%] right-[18%]">
                      <SvgBlossom
                        size={13}
                        className="sm:w-[16px] sm:h-[16px]"
                        petalColor={currentSeason.blossomPrimary}
                        centerColor={currentSeason.blossomCenter}
                      />
                    </div>
                    <div className="absolute top-[66%] left-[38%]">
                      <SvgBlossom
                        size={13}
                        className="sm:w-[16px] sm:h-[16px]"
                        petalColor={currentSeason.blossomSecondary}
                        centerColor={currentSeason.blossomCenter}
                      />
                    </div>

                    {/* =========================================================================
                        GIỮ ĐỦ 100% TẤT CẢ 14 ICON LẤP LÁNH PHÂN BỔ TRÊN KHUNG ẢNH
                        ========================================================================= */}
                    {[
                      { top: '12%', left: '12%', size: 'text-[8px] sm:text-[9px]', delay: 0 },
                      { top: '8%', left: '38%', size: 'text-[9px] sm:text-[10px]', delay: 1.2 },
                      { top: '16%', left: '68%', size: 'text-[7px] sm:text-[8px]', delay: 0.6 },
                      { top: '12%', right: '16%', size: 'text-[9px] sm:text-[11px]', delay: 1.8 },
                      { top: '30%', left: '10%', size: 'text-[8px] sm:text-[10px]', delay: 0.3 },
                      { top: '28%', left: '42%', size: 'text-[8px] sm:text-[9px]', delay: 2.1 },
                      { top: '32%', right: '12%', size: 'text-[7px] sm:text-[8px]', delay: 0.9 },
                      { top: '48%', left: '26%', size: 'text-[9px] sm:text-[11px]', delay: 1.5 },
                      { top: '50%', right: '28%', size: 'text-[8px] sm:text-[9px]', delay: 0.4 },
                      { top: '64%', left: '10%', size: 'text-[7px] sm:text-[8px]', delay: 1.7 },
                      { top: '68%', left: '48%', size: 'text-[9px] sm:text-[10px]', delay: 1.1 },
                      { top: '62%', right: '8%', size: 'text-[8px] sm:text-[9px]', delay: 2.0 },
                      { top: '76%', left: '32%', size: 'text-[7px] sm:text-[8px]', delay: 0.8 },
                      { top: '78%', right: '24%', size: 'text-[8px] sm:text-[10px]', delay: 1.4 },
                    ].map((sp, sIdx) => (
                      <motion.div
                        key={sIdx}
                        animate={{
                          scale: [0.8, 1.25, 0.8],
                          opacity: [0.45, 1, 0.45],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.5,
                          delay: sp.delay,
                          ease: 'easeInOut',
                        }}
                        className={`absolute text-white/85 ${sp.size} pointer-events-none select-none`}
                        style={{
                          top: sp.top,
                          left: sp.left,
                          right: sp.right,
                        }}
                      >
                        ✦
                      </motion.div>
                    ))}
                  </div>

                  {/* Cây Hoa Anh Đào (Cherry Blossom Tree) cho mùa Xuân */}
                  {currentSeasonKey === 'spring' && (
                    <CherryBlossomTree className="absolute inset-0 z-20 pointer-events-none" />
                  )}

                  {/* BOTTOM: Fluffy Clouds & Seasonal Meadow */}
                  <div className="relative mt-auto w-full z-10 pointer-events-none">
                    <div
                      className="w-full h-16 sm:h-24 rounded-t-[2.5rem] sm:rounded-t-[3.5rem] relative transition-all duration-700"
                      style={{
                        background: currentSeason.cloudsGradient,
                      }}
                    >
                      <div className="absolute -top-4 sm:-top-6 -left-3 sm:-left-4 w-22 sm:w-28 h-14 sm:h-20 bg-white/40 rounded-full blur-xs" />
                      <div className="absolute -top-6 sm:-top-8 -right-3 sm:-right-4 w-28 sm:w-36 h-18 sm:h-24 bg-white/35 rounded-full blur-xs" />
                    </div>
                    <div
                      className="absolute bottom-0 inset-x-0 h-10 sm:h-14 rounded-t-[50%] overflow-hidden transition-colors duration-700"
                      style={{
                        backgroundColor: currentSeason.meadowColor,
                        boxShadow: 'inset 0 4px 8px rgba(255, 255, 255, 0.25), inset 0 -4px 8px rgba(0, 0, 0, 0.08)',
                      }}
                    />
                  </div>

                  {/* Hiệu ứng Lau kính sương mờ (Misty Glass Wipe) - Chỉ hiển thị trong Chế độ sáng, bỏ trong Chế độ tối */}
                  {!isDarkMode && (
                    <motion.div
                      key={`mist-wipe-${currentSeasonKey}`}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{
                        duration: 1.8,       // 1.8 giây tan hoàn toàn
                        delay: 0.3,          // Chờ 0.3 giây trước khi tan
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 pointer-events-none z-35 backdrop-blur-md bg-white/85 flex flex-col items-center justify-center overflow-hidden"
                    >
                      {/* Vệt lau tròn tỏa quang từ tâm bung nở ra ngoài */}
                      <motion.div
                        initial={{ scale: 0.2, opacity: 0.95 }}
                        animate={{ scale: 3.5, opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          ease: [0.16, 1, 0.3, 1], // Gia tốc mượt mà tự nhiên
                        }}
                        className="w-24 h-24 rounded-full bg-transparent border-4 border-white shadow-[0_0_40px_rgba(255,255,255,1)]"
                      />
                    </motion.div>
                  )}
                </div>

                {/* POLAROID BOTTOM CAPTION */}
                <div className="pt-2 sm:pt-3.5 flex items-center justify-center gap-1.5 text-[#5B6D9C] dark:text-[#CBBCE5] select-none text-center">
                  <span
                    className="italic text-xs sm:text-base tracking-wide transition-all duration-500"
                    style={{ fontFamily: "'Pinyon Script', 'Alex Brush', cursive" }}
                  >
                    {currentSeason.caption}
                  </span>
                  <span className="text-[12px]">{currentSeason.captionIcon}</span>
                </div>
              </div>
            </div>
          </motion.div>

            {/* BOTTOM LABEL UNDER POLAROID */}
            <div className="w-full max-w-[16rem] sm:max-w-xs mt-3 sm:mt-6 px-4 flex items-center justify-between select-none mx-auto">
              <div className="font-sans text-[9px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] text-[#6E5B8E] dark:text-[#CBBCE5] font-semibold leading-relaxed">
                <div>2026</div>
                <div>JOURIEE65</div>
                <div>NIÊN THỜI</div>
              </div>
            </div>

          </div>

          {/* ================================================================= */}
          {/* TITLE & ORBIT COLUMN: KiKi Garden + Celestial Orbit & Inscriptions */}
          {/* ================================================================= */}
          <div className="w-full lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left justify-center relative pl-0 lg:pl-6">
            {/* =========================================================================
                1. SỐ HIỆU EDITORIAL: NO.0922
                ========================================================================= */}
            <div className="w-full text-center lg:text-right pr-0 lg:pr-14 mt-1 sm:mt-2">
              <span
                className="text-xs sm:text-base lg:text-lg tracking-[0.25em] sm:tracking-[0.3em] font-serif font-light text-[#59447A] dark:text-[#CBBCE5]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                NO.0922
              </span>
            </div>

            {/* DOTTED ELLIPTICAL ORBIT RING & DECORATIVE ICONS */}
            <div aria-hidden="true" className="absolute -inset-4 sm:-inset-8 lg:-inset-12 pointer-events-none overflow-visible select-none">
              <svg className="w-full h-full" viewBox="0 0 700 450" fill="none" preserveAspectRatio="none">
                <ellipse
                  cx="360"
                  cy="200"
                  rx="310"
                  ry="130"
                  stroke="#9884BA"
                  strokeOpacity="0.45"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                  transform="rotate(-11 360 200)"
                />
              </svg>

              {/* Big Star Glint (Top Right) */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="absolute top-4 sm:top-10 right-6 sm:right-24 text-white/85 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              >
                <svg width="32" height="32" className="sm:w-[46px] sm:h-[46px]" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M20 0 L23 16 L39 20 L23 24 L20 40 L17 24 L1 20 L17 16 Z" />
                  <path d="M20 9 L22 18 L31 20 L22 22 L20 31 L18 22 L9 20 L18 18 Z" opacity="0.6" />
                </svg>
              </motion.div>

              {/* Small lilac 5-petal flower icon (✿) */}
              <div className={`absolute top-10 sm:top-22 right-2 sm:right-4 ${isDarkMode ? 'text-purple-200/80' : 'text-[#9884BA]'} text-xs sm:text-sm opacity-85`}>✿</div>

              {/* Tiny sparkling star icon (✦) */}
              <div className="absolute top-6 sm:top-12 right-4 sm:right-6 text-white/85 text-xs sm:text-base opacity-85 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">✦</div>

              {/* Mid-left small lilac flower icon (✿) */}
              <div className={`absolute top-[48%] left-1 sm:left-4 ${isDarkMode ? 'text-purple-200/80' : 'text-[#9884BA]'} text-[10px] sm:text-xs opacity-75`}>✿</div>

              {/* Purple petal and Pale White Crescent Moon */}
              <div className="absolute bottom-10 sm:bottom-20 right-2 sm:right-4 flex items-center gap-1">
                <svg width="14" height="9" className="sm:w-[18px] sm:h-[12px] rotate-[25deg]" viewBox="0 0 22 14" fill={isDarkMode ? '#C4B2E5' : '#A88DCB'}>
                  <path d="M1 7 C 5 1, 17 0, 21 7 C 17 14, 5 13, 1 7 Z" />
                </svg>
                <svg width="16" height="16" className="sm:w-[22px] sm:h-[22px] rotate-[35deg] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.85)">
                  <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                </svg>
              </div>
            </div>

            {/* 1. HIỆU ỨNG CHỮ "Little" */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full text-center lg:text-left select-none"
            >
              <h1
                className={`text-6xl sm:text-8xl md:text-9xl lg:text-[7.2rem] font-normal leading-[0.85] tracking-tight ${
                  isDarkMode ? 'text-[#FAF5FF] drop-shadow-[0_0_24px_rgba(216,180,254,0.65)]' : 'text-[#483768]'
                }`}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  textShadow: isDarkMode
                    ? '0 0 28px rgba(233, 213, 255, 0.75), 0 0 60px rgba(192, 132, 252, 0.45), 0 2px 8px rgba(0,0,0,0.9)'
                    : '0 4px 22px rgba(82, 67, 118, 0.12)',
                }}
              >
                Little
              </h1>
            </motion.div>

            {/* 2. HIỆU ỨNG CHỮ "Library" */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="relative w-full text-center lg:text-left pl-0 lg:pl-24 -mt-2 sm:-mt-4 select-none"
            >
              <h2
                className={`text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] font-normal leading-none ${
                  isDarkMode ? 'text-[#F5EDFF] drop-shadow-[0_0_20px_rgba(192,132,252,0.65)]' : 'text-[#543F75]'
                }`}
                style={{
                  fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
                  fontStyle: 'italic',
                  textShadow: isDarkMode
                    ? '0 0 25px rgba(233, 213, 255, 0.8), 0 0 50px rgba(168, 85, 247, 0.4), 0 2px 6px rgba(0,0,0,0.85)'
                    : undefined,
                }}
              >
                Library
              </h2>
            </motion.div>

            {/* 3. DÒNG THÔNG ĐIỆP & NÚT VÀO VƯỜN */}
            <div className="relative z-25 mt-6 sm:mt-8 w-full flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* =========================================================================
                  2. KHỐI CHỮ "A LITTLE SPACE..." & ĐƯỜNG KẺ THẲNG NHỎ
                  ========================================================================= */}
              <div className="w-full sm:w-auto flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
                {/* Cách xếp 2 dòng chữ quote nghệ thuật */}
                <div className="font-sans text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.24em] uppercase text-[#614D82] dark:text-[#BFAFDC] font-semibold leading-relaxed">
                  <p>A LITTLE SPACE</p>
                  <p>BETWEEN THE PAGES</p>
                </div>

                {/* ĐƯỜNG KẺ THẲNG NHỎ (MINI SEPARATOR LINE) */}
                <div className="w-8 h-[1px] bg-[#9884BA]/60 dark:bg-purple-400/50 mx-auto lg:mx-0" />

                {/* NÚT VÀO VƯỜN: KHÔNG NỀN TRẮNG, KHÔNG ĐƯỜNG VIỀN */}
                <button
                  type="button"
                  onClick={handleEnterGarden}
                  className="group flex flex-col items-center lg:items-start text-center lg:text-left cursor-pointer transition-all bg-transparent border-0 p-0 shadow-none hover:opacity-85 active:scale-95 pt-1"
                >
                  <div className="flex items-center gap-1.5 text-base sm:text-lg font-serif font-bold text-[#483768] dark:text-[#E8DEF8] tracking-wider">
                    <span>READING LOG</span>
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-xs">↗</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lớp chuyển sắc làm mờ đường viền ở đáy nền tím, hòa sắc mượt mà với nền trang */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-32 sm:h-44 pointer-events-none z-10"
          style={{
            background: isDarkMode
              ? 'linear-gradient(to bottom, rgba(18, 16, 36, 0) 0%, rgba(18, 16, 36, 0.45) 40%, rgba(18, 16, 36, 0.9) 80%, #121024 100%)'
              : 'linear-gradient(to bottom, rgba(248, 245, 252, 0) 0%, rgba(248, 245, 252, 0.45) 40%, rgba(248, 245, 252, 0.9) 80%, #F8F5FC 100%)',
          }}
        />
      </section>

      {/* =========================================================================
          CONTENT SECTION: MỤC ĐANG ĐỌC & BỘ SƯU TẬP TIỂU THUYẾT
          ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-24 space-y-14">
        {/* TRUYỆN ĐANG ĐỌC (RECENT READS) SECTION */}
        {(() => {
          const hasRecentReads = activeRecentReads.length > 0;
          const currentRecent = hasRecentReads ? (activeRecentReads[recentIndex] || activeRecentReads[0]) : null;
          const estimate = currentRecent ? getReadingEstimate(currentRecent.novel, currentRecent.record) : null;

          return (
            <section
              id="recent-reading-section"
              className="relative isolate w-full lg:max-w-4xl mx-auto mt-4 sm:mt-6 mb-10 sm:mb-14 select-none text-left scroll-mt-24"
            >
              {/* Lớp xếp chồng đáy thứ 2 (Dưới cùng nhất) */}
              <div
                className={`absolute -bottom-3 sm:-bottom-3.5 inset-x-6 sm:inset-x-8 h-9 sm:h-11 rounded-[22px] sm:rounded-[26px] border -z-20 transition-all duration-300 pointer-events-none ${
                  isDarkMode
                    ? 'bg-[#120d20]/80 border-purple-500/20 shadow-md'
                    : 'bg-[#F2EDFA]/90 border-[#D8C7EB]/40 shadow-xs'
                }`}
              />

              {/* Lớp xếp chồng giữa thứ 1 */}
              <div
                className={`absolute -bottom-1.5 sm:-bottom-2 inset-x-3 sm:inset-x-4 h-9 sm:h-11 rounded-[22px] sm:rounded-[26px] border -z-10 transition-all duration-300 pointer-events-none ${
                  isDarkMode
                    ? 'bg-[#1a1230]/90 border-purple-500/25 shadow-md'
                    : 'bg-[#F6F1FC]/95 border-[#D8C7EB]/50 shadow-xs'
                }`}
              />

              {/* Khối thẻ chính - Hiệu ứng chuẩn SugarTodayWidget purple theme dark mode */}
              <div
                style={
                  isDarkMode
                    ? {
                        backgroundImage: 'linear-gradient(135deg, rgba(26, 18, 46, 0.92) 0%, rgba(12, 8, 23, 0.96) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1.5px solid rgba(255, 255, 255, 0.20)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
                      }
                    : undefined
                }
                className={`relative rounded-[24px] sm:rounded-[28px] border p-4 sm:p-6 transition-all duration-300 overflow-hidden ${
                  isDarkMode
                    ? 'border-white/20 text-[#f4edfd]'
                    : 'bg-white/95 border-[#D8C7EB]/70 text-[#3B2956] shadow-sm'
                }`}
              >
                {/* Nền hiệu ứng & khối màu loang chuẩn SugarTodayWidget purple theme dark mode */}
                {isDarkMode && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div
                      className="absolute -top-14 -right-14 w-80 h-72 pointer-events-none rounded-[46%_54%_68%_32%/45%_55%_45%_55%] blur-2xl"
                      style={{ backgroundImage: 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(155, 85, 225, 0.32) 0%, rgba(100, 45, 155, 0.16) 45%, transparent 75%)' }}
                    />
                    <div
                      className="absolute -bottom-14 -left-14 w-80 h-72 pointer-events-none rounded-[54%_46%_32%_68%/55%_45%_55%_45%] blur-2xl"
                      style={{ backgroundImage: 'radial-gradient(ellipse 75% 65% at 15% 85%, rgba(155, 85, 225, 0.32) 0%, rgba(100, 45, 155, 0.16) 45%, transparent 75%)' }}
                    />
                  </div>
                )}

                {/* Header thanh thẻ Đang đọc */}
                <div className={`relative z-10 flex items-center justify-between pb-3 mb-3 border-b ${
                  isDarkMode ? 'border-white/10' : 'border-black/5'
                }`}>
                  <div
                    onClick={() => {
                      if (currentRecent) {
                        handleOpenReading(currentRecent.novel, currentRecent.record.chapterNumber);
                      }
                    }}
                    className={`flex items-center gap-1.5 select-none ${currentRecent ? 'cursor-pointer group' : ''}`}
                    title={currentRecent ? 'Xem chi tiết truyện đang đọc' : 'Đang đọc'}
                  >
                    <h3
                      className={`font-bold text-base sm:text-lg md:text-xl transition-opacity ${currentRecent ? 'group-hover:opacity-80' : ''} ${isDarkMode ? 'text-[#f4edfd]' : 'text-[#3E2D58]'}`}
                      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                    >
                      Đang đọc
                    </h3>
                    {currentRecent && (
                      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${isDarkMode ? 'text-[#c9b4e8]' : 'text-[#6D5493]'}`} />
                    )}
                  </div>

                  {/* Bên phải: Chỉ số và nút điều hướng */}
                  {hasRecentReads && (
                    <div className="flex items-center gap-2 select-none">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
                        isDarkMode
                          ? 'bg-[#281c3e]/85 text-[#b9a1dc] border-purple-400/30'
                          : 'bg-[#F2EDFA] text-[#6D5493] border-[#D8C7EB]'
                      }`}>
                        {recentIndex + 1}/{activeRecentReads.length}
                      </span>

                      <button
                        onClick={handlePrevRecent}
                        disabled={activeRecentReads.length <= 1}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                          isDarkMode
                            ? 'bg-[#281c3e]/80 border-purple-400/30 text-[#e4d5f8] hover:bg-[#342452]'
                            : 'amethyst-light-btn text-[#6D5493]'
                        }`}
                        title="Truyện trước"
                        aria-label="Truyện trước"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleNextRecent}
                        disabled={activeRecentReads.length <= 1}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                          isDarkMode
                            ? 'bg-[#281c3e]/80 border-purple-400/30 text-[#e4d5f8] hover:bg-[#342452]'
                            : 'amethyst-light-btn text-[#6D5493]'
                        }`}
                        title="Truyện tiếp theo"
                        aria-label="Truyện tiếp theo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Nội dung mục Đang đọc */}
                {!hasRecentReads || !currentRecent || !estimate ? (
                  <div className="relative z-10 py-7 sm:py-9 flex flex-col items-center justify-center text-center px-4">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl mb-3 flex items-center justify-center border shadow-2xs ${
                        isDarkMode ? 'bg-[#281c3e]/60 border-purple-400/20 text-[#b9a1dc]' : 'bg-black/5 border-black/10 text-stone-500'
                      }`}
                    >
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
                    </div>
                    <p className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-[#e4d5f8]' : 'text-[#524376]'}`}>
                      Chưa có tiến độ đọc truyện trên trình duyệt
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentRecent.novel.id || `recent-${recentIndex}`}
                      initial={{ opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -7 }}
                      transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                      className="relative z-10"
                    >
                      <div className="flex items-center gap-4 sm:gap-6">
                        {/* Bìa truyện */}
                        <div
                          onClick={() => handleOpenReading(currentRecent.novel, currentRecent.record.chapterNumber)}
                          className={`w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-38 shrink-0 rounded-[18px] sm:rounded-[22px] overflow-hidden shadow-md border cursor-pointer group/cover relative ${
                            isDarkMode ? 'border-purple-400/30 bg-black/40' : 'border-[#D8C7EB]/50 bg-white'
                          }`}
                          title={`Đọc tiếp: ${currentRecent.novel.title}`}
                        >
                          <img
                            src={getDirectImageUrl(currentRecent.novel.coverImage, currentRecent.novel.id || currentRecent.novel.title)}
                            onError={(e) => handleCoverImageError(e, currentRecent.novel.id || currentRecent.novel.title)}
                            alt={currentRecent.novel.title}
                            className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Thông tin truyện */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2 sm:space-y-3">
                          <h4
                            onClick={() => handleOpenReading(currentRecent.novel, currentRecent.record.chapterNumber)}
                            className={`font-source-serif font-bold text-base sm:text-lg md:text-xl line-clamp-1 cursor-pointer transition-colors ${
                              isDarkMode ? 'text-[#f4edfd] hover:text-[#e4d5f8]' : 'text-[#3E2D58] hover:text-[#6D5493]'
                            }`}
                            title={currentRecent.novel.title}
                          >
                            {currentRecent.novel.title}
                          </h4>

                          {/* Hàng phần trăm đọc và thời gian còn lại (phông Source Sans 3, bỏ chữ Chương 1: Chương 1 • và bỏ chữ đã đọc) */}
                          <div
                            className="flex items-center gap-2 text-xs font-semibold"
                            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                          >
                            <span className={isDarkMode ? 'text-[#e4d5f8] font-bold' : 'text-[#6D5493] font-bold'}>
                              {estimate.pct}%
                            </span>
                            <span className={isDarkMode ? 'text-purple-300/60' : 'text-[#655288]/60'}>•</span>
                            <span className={`flex items-center gap-1 font-normal ${isDarkMode ? 'text-[#b9a1dc]' : 'text-[#655288]'}`}>
                              <Clock className="w-3.5 h-3.5" />
                              {estimate.remainingStr}
                            </span>
                          </div>

                          {/* Thanh tiến độ reading bar */}
                          <div className={`w-full h-2 rounded-full overflow-hidden border ${
                            isDarkMode ? 'bg-[#241638] border-purple-400/30' : 'bg-[#EFE8F7] border-[#D8C7EB]/60'
                          }`}>
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isDarkMode
                                  ? 'bg-gradient-to-r from-[#9b55e1] via-[#b9a1dc] to-[#c9b4e8] shadow-[0_0_12px_rgba(155,85,225,0.5)]'
                                  : 'bg-gradient-to-r from-[#9D7EC4] via-[#BA97E5] to-[#7E57AA]'
                              }`}
                              style={{ width: `${estimate.pct}%` }}
                            />
                          </div>

                          {/* Hàng dưới: chữ đã đọc nằm ở mép trái, nút đọc tiếp ở mép phải */}
                          <div className="pt-1.5 flex items-center justify-between gap-3">
                            <span
                              className={`text-xs font-medium ${isDarkMode ? 'text-[#b9a1dc]' : 'text-[#8471A5]'}`}
                              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                            >
                              {estimate.readStr}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleOpenReading(currentRecent.novel, currentRecent.record.chapterNumber)}
                              className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-sans font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-2 active:scale-95 shrink-0 ${
                                isDarkMode
                                  ? 'bg-gradient-to-r from-[#502e82] to-[#341b5a] text-[#f4edfd] border border-purple-400/40 shadow-[0_4px_14px_rgba(155,85,225,0.35)] hover:from-[#5d3698] hover:to-[#3e216a]'
                                  : 'amethyst-light-btn-active'
                              }`}
                            >
                              <span>Đọc tiếp</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </section>
          );
        })()}

        {/* =========================================================================
            BỘ SƯU TẬP TIỂU THUYẾT (ALL NOVELS EXPLORATION GRID) - GIỮ NGUYÊN HOÀN TOÀN
            ========================================================================= */}
        <section id="library-collection-section" className="space-y-6 scroll-mt-24">
          <div className={`flex items-center justify-between border-b pb-3 ${
            isDarkMode ? 'border-white/10' : 'border-[#B79ED4]/30'
          }`}>
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold italic ${isDarkMode ? 'text-[#f4edfd]' : 'text-[#3E2D58]'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                Bộ Sưu Tập Tiểu Thuyết
              </h2>
              <p className={`text-xs font-sans mt-0.5 ${isDarkMode ? 'text-[#CBBCE5]' : 'text-[#735E96]'}`}>
                Tổng cộng 18 tác phẩm hoàn thành
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {novels.map((n, idx) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => {
                  cosmicAudio.playChime('sparkle');
                  onSelectNovel(n);
                }}
                className={`group rounded-2xl p-4 transition-all duration-300 cursor-pointer flex gap-4 items-start ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-white/[0.08] via-[#19122a]/50 to-[#110a1c]/65 backdrop-blur-2xl border border-white/15 hover:border-[#8e7aa8]/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_20px_48px_rgba(115,90,143,0.2),inset_0_1px_0_rgba(255,255,255,0.25)]'
                    : 'bg-white/80 border border-[#B79ED4]/30 hover:border-[#6D5493] shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Book Thumbnail */}
                <div className={`relative w-24 aspect-[3/4.2] rounded-xl overflow-hidden shadow-sm shrink-0 group-hover:scale-105 transition-transform ${isDarkMode ? 'border border-white/15' : 'border border-[#D8C7EB]/50'}`}>
                  <img
                    src={n.coverImage}
                    alt={n.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white">
                    #{idx + 1}
                  </div>
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0 space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full border ${
                      isDarkMode
                        ? 'bg-[#735a8f]/20 backdrop-blur-md text-purple-200 border-[#856b9e]/30'
                        : 'bg-[#EFE8F7] text-[#524376] border-[#D8C7EB]/60'
                    }`}>
                      {n.genres[0] || 'Tiểu Thuyết'}
                    </span>
                  </div>

                  <h3 className={`font-bold text-sm sm:text-base font-source-serif line-clamp-1 transition-colors ${
                    isDarkMode ? 'text-[#f0edf7] group-hover:text-purple-300' : 'text-[#3E2D58] group-hover:text-[#6D5493]'
                  }`}>
                    {n.title}
                  </h3>

                  <p className={`text-[11px] font-sans truncate ${isDarkMode ? 'text-[#d6cde8]' : 'text-[#735E96]'}`}>
                    {n.author.name}
                  </p>

                  <p className={`text-[11px] font-sans line-clamp-2 leading-relaxed ${isDarkMode ? 'text-[#aba0c2]' : 'text-stone-500'}`}>
                    {n.synopsis}
                  </p>

                  <div className={`pt-1 flex items-center justify-between text-[11px] font-sans font-semibold ${isDarkMode ? 'text-purple-200' : 'text-[#524376]'}`}>
                    <span>{n.chapters.length} chương</span>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold group-hover:translate-x-0.5 transition-all ${
                      isDarkMode
                        ? 'bg-[#2E1E4D] text-[#E8DEF8] border border-purple-400/30 shadow-xs'
                        : 'amethyst-light-btn text-[#524376]'
                    }`}>
                      Đọc ngay <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#B79ED4]/30 dark:border-white/10 py-8 px-4 text-center font-sans text-xs text-[#735E96] dark:text-[#B5A1D6] space-y-2">
        <p className="tracking-[0.25em] uppercase font-bold text-[#524376] dark:text-[#D1C2E8]">
          © 2026 Niên Thời - Jouriee65
        </p>
        <p className="opacity-80">
          Trang web truyện phi thương mại.
        </p>
      </footer>
    </div>
  );
};
