import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Tag,
  Sparkles,
  RotateCcw,
  Compass,
  Snowflake,
  Hourglass,
  Heart,
} from 'lucide-react';
import { Novel } from '../types';
import { NovelThemeId, NovelThemeStyles } from '../utils/themeStyles';
import { getDirectImageUrl, handleCoverImageError } from '../utils/imageUtils';
import { getSugarThemeConfig } from './SugarTodayWidget';

interface RandomNovelPickerProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  tStyles: NovelThemeStyles;
  theme: NovelThemeId;
  isDarkMode: boolean;
}

// 3 Khung cảnh theo yêu cầu:
// 1: 'idle' - Chưa bấm (Khung ảnh 1: Gradient with light rays and sparkles theo theme, Subtitle: "Nếu hôm nay bạn chưa biết đọc gì.", Nút "BẮT ĐẦU" không icon)
// 2: 'waiting' - Chờ chọn (Khung ảnh 2: Layout giống ảnh mẫu, bỏ 2 nút góc phải, 1 theme 1 icon; Tiêu đề: "Đang tìm truyện cho bạn", loading icon chuyển động, "Sắp xong...")
// 3: 'picked' - Đã chọn xong (Bỏ "Duyên phận đã chọn", bỏ "Truyện Dịch •", "Chọn truyện khác", "Quay lại")
export type PickerScene = 'idle' | 'waiting' | 'picked';

export type CenterVisualOption =
  | 'stargate'
  | 'hourglass'
  | 'tarot'
  | 'astrolabe'
  | 'pouring-cup'
  | 'snowflake'
  | 'eclipse'
  | 'pixel-hourglass'
  | 'vinyl-player'
  | 'cassette'
  | 'liquid-heart'
  | 'snowflake-kaleidoscope'
  | 'lululemon-zen';

// 1 theme sử dụng 1 icon theo yêu cầu
export const getThemeVisualOption = (themeId: NovelThemeId): CenterVisualOption => {
  switch (themeId) {
    case 'cosmic':
      return 'stargate'; // Theme Cosmic: Cổng Thời Không
    case 'amethyst-haze':
      return 'cassette'; // Theme Purple / Amethyst: Băng Cassette Retro quay mượt
    case 'mocha':
      return 'vinyl-player'; // Theme Linen: Bàn máy phát đĩa than Vinyl quay 360 độ
    case 'notebook':
      return 'pixel-hourglass'; // Theme White: Đồng Hồ Cát Trái Tim Pixel (Pixel Heart Hourglass)
    case 'sage':
      return 'liquid-heart'; // Theme Sage: Bình thủy tinh hình trái tim chất lỏng xanh sage tươi mát
    case 'lululemon':
      return 'snowflake-kaleidoscope'; // Theme Berry: Kính vạn hoa hoa tuyết hai chiều (Snowflake Kaleidoscope)
    case 'slate-haze':
    default:
      return 'snowflake'; // Theme Frost: Bông tuyết ❄️ xoay chuyển động mượt mà liên tục
  }
};

// Cấu hình bảng màu riêng biệt cho Khung ảnh 1 theo từng theme & chế độ sáng / tối
interface BannerThemePalette {
  bgGradient: string;
  ambientCenter: string;
  ambientTopRight: string;
  rayColor: string;
  starPrimary: string;
  starSecondary: string;
  starGlow: string;
  iconBadgeBg: string;
}

export const getBannerThemePalette = (
  themeId: NovelThemeId,
  isDark: boolean
): BannerThemePalette => {
  if (isDark) {
    switch (themeId) {
      case 'cosmic':
        return {
          bgGradient: 'from-[#6366f1]/45 via-[#4f46e5]/40 to-[#312e81]/60',
          ambientCenter: 'bg-indigo-300/25',
          ambientTopRight: 'bg-purple-300/25',
          rayColor: 'text-indigo-200/50',
          starPrimary: 'text-[#e0e7ff]',
          starSecondary: 'text-[#c7d2fe]',
          starGlow: 'bg-[#e0e7ff] shadow-[0_0_8px_#818cf8]',
          iconBadgeBg: 'bg-white/15 backdrop-blur-md border-white/25 text-amber-200 shadow-md',
        };
      case 'amethyst-haze':
        return {
          bgGradient: 'from-[#8b5cf6]/45 via-[#7c3aed]/40 to-[#4c1d95]/60',
          ambientCenter: 'bg-fuchsia-300/25',
          ambientTopRight: 'bg-purple-300/25',
          rayColor: 'text-purple-200/50',
          starPrimary: 'text-[#fae8ff]',
          starSecondary: 'text-[#e9d5ff]',
          starGlow: 'bg-[#fae8ff] shadow-[0_0_8px_#c084fc]',
          iconBadgeBg: 'bg-white/15 backdrop-blur-md border-white/25 text-fuchsia-200 shadow-md',
        };
      case 'slate-haze':
        return {
          bgGradient: 'from-[#0ea5e9]/40 via-[#0284c7]/38 to-[#0c4a6e]/60',
          ambientCenter: 'bg-sky-300/25',
          ambientTopRight: 'bg-cyan-300/25',
          rayColor: 'text-sky-200/50',
          starPrimary: 'text-[#e0f2fe]',
          starSecondary: 'text-[#bae6fd]',
          starGlow: 'bg-[#e0f2fe] shadow-[0_0_8px_#38bdf8]',
          iconBadgeBg: 'bg-white/15 backdrop-blur-md border-white/25 text-sky-200 shadow-md',
        };
      case 'sage':
        return {
          bgGradient: 'from-[#10b981]/40 via-[#059669]/38 to-[#064e3b]/60',
          ambientCenter: 'bg-emerald-300/25',
          ambientTopRight: 'bg-teal-300/25',
          rayColor: 'text-emerald-200/50',
          starPrimary: 'text-[#dcfce7]',
          starSecondary: 'text-[#a7f3d0]',
          starGlow: 'bg-[#dcfce7] shadow-[0_0_8px_#34d399]',
          iconBadgeBg: 'bg-white/15 backdrop-blur-md border-white/25 text-emerald-200 shadow-md',
        };
      case 'mocha':
        return {
          bgGradient: 'from-[#b08968]/35 via-[#9c6644]/32 to-[#4a3528]/55',
          ambientCenter: 'bg-[#d4b996]/20',
          ambientTopRight: 'bg-[#e6ccb2]/20',
          rayColor: 'text-stone-200/50',
          starPrimary: 'text-[#ede0d4]',
          starSecondary: 'text-[#ddb892]',
          starGlow: 'bg-[#ede0d4] shadow-[0_0_8px_#b08968]',
          iconBadgeBg: 'bg-white/15 backdrop-blur-md border-white/25 text-[#ddb892] shadow-md',
        };
      case 'lululemon':
        return {
          bgGradient: 'from-[#84334b]/45 via-[#a64462]/40 to-[#24151a]/60',
          ambientCenter: 'bg-[#ead4d7]/25',
          ambientTopRight: 'bg-[#ba3859]/25',
          rayColor: 'text-[#ead4d7]/40',
          starPrimary: 'text-[#f4ebee]',
          starSecondary: 'text-[#ead4d7]',
          starGlow: 'bg-[#ead4d7] shadow-[0_0_8px_#84334b]',
          iconBadgeBg: 'bg-white/15 backdrop-blur-md border-white/25 text-white shadow-md',
        };
      case 'notebook':
      default:
        return {
          bgGradient: 'from-[#64748b]/40 via-[#475569]/38 to-[#1e293b]/60',
          ambientCenter: 'bg-slate-300/25',
          ambientTopRight: 'bg-zinc-300/25',
          rayColor: 'text-slate-200/50',
          starPrimary: 'text-[#f1f5f9]',
          starSecondary: 'text-[#e2e8f0]',
          starGlow: 'bg-[#f1f5f9] shadow-[0_0_8px_#94a3b8]',
          iconBadgeBg: 'bg-white/15 backdrop-blur-md border-white/25 text-white shadow-md',
        };
    }
  } else {
    // Light mode - Nửa trên màu sắc theo theme, nửa dưới chuyển mượt sang màu trắng
    switch (themeId) {
      case 'cosmic':
        return {
          bgGradient: 'from-[#ead6fc] via-[#f7f0fe] to-[#ffffff]',
          ambientCenter: 'bg-purple-400/25',
          ambientTopRight: 'bg-cyan-300/30',
          rayColor: 'text-purple-300/60',
          starPrimary: 'text-purple-600/80',
          starSecondary: 'text-indigo-500/75',
          starGlow: 'bg-purple-500/80 shadow-[0_0_4px_#a855f7]',
          iconBadgeBg: 'bg-white/85 border-purple-200 text-purple-700 shadow-purple-100',
        };
      case 'amethyst-haze':
        return {
          bgGradient: 'from-[#f1ddf9] via-[#faf2fd] to-[#ffffff]',
          ambientCenter: 'bg-fuchsia-400/25',
          ambientTopRight: 'bg-pink-300/30',
          rayColor: 'text-fuchsia-300/60',
          starPrimary: 'text-fuchsia-600/80',
          starSecondary: 'text-pink-500/75',
          starGlow: 'bg-fuchsia-500/80 shadow-[0_0_4px_#d946ef]',
          iconBadgeBg: 'bg-white/85 border-fuchsia-200 text-fuchsia-700 shadow-fuchsia-100',
        };
      case 'slate-haze':
        return {
          bgGradient: 'from-[#d9e9f9] via-[#eef5fc] to-[#ffffff]',
          ambientCenter: 'bg-sky-400/25',
          ambientTopRight: 'bg-teal-300/30',
          rayColor: 'text-sky-300/60',
          starPrimary: 'text-sky-600/80',
          starSecondary: 'text-teal-600/75',
          starGlow: 'bg-sky-500/80 shadow-[0_0_4px_#0ea5e9]',
          iconBadgeBg: 'bg-white/85 border-sky-200 text-sky-700 shadow-sky-100',
        };
      case 'sage':
        return {
          bgGradient: 'from-[#d8ebd9] via-[#eff7f0] to-[#ffffff]',
          ambientCenter: 'bg-emerald-400/25',
          ambientTopRight: 'bg-lime-300/30',
          rayColor: 'text-emerald-300/60',
          starPrimary: 'text-emerald-700/80',
          starSecondary: 'text-lime-600/75',
          starGlow: 'bg-emerald-600/80 shadow-[0_0_4px_#10b981]',
          iconBadgeBg: 'bg-white/85 border-emerald-200 text-emerald-700 shadow-emerald-100',
        };
      case 'mocha':
        return {
          bgGradient: 'from-[#f0e2d5] via-[#f9f3ec] to-[#ffffff]',
          ambientCenter: 'bg-amber-400/25',
          ambientTopRight: 'bg-yellow-300/30',
          rayColor: 'text-amber-300/60',
          starPrimary: 'text-amber-700/80',
          starSecondary: 'text-orange-600/75',
          starGlow: 'bg-amber-600/80 shadow-[0_0_4px_#f59e0b]',
          iconBadgeBg: 'bg-white/85 border-amber-200 text-amber-800 shadow-amber-100',
        };
      case 'lululemon':
        return {
          bgGradient: 'from-[#cc7b8f] via-[#de9fb0] to-[#eed3dc]',
          ambientCenter: 'bg-[#cc7b8f]/30',
          ambientTopRight: 'bg-[#eed3dc]/40',
          rayColor: 'text-[#cc7b8f]/40',
          starPrimary: 'text-white/95',
          starSecondary: 'text-white/85',
          starGlow: 'bg-white shadow-[0_0_6px_#eed3dc]',
          iconBadgeBg: 'bg-white/90 border-[#f0d8e0] text-[#ad4862] shadow-xs',
        };
      case 'notebook':
      default:
        return {
          bgGradient: 'from-[#e3e5ea] via-[#f3f4f6] to-[#ffffff]',
          ambientCenter: 'bg-neutral-300/40',
          ambientTopRight: 'bg-indigo-200/30',
          rayColor: 'text-neutral-300/60',
          starPrimary: 'text-neutral-700/80',
          starSecondary: 'text-indigo-600/75',
          starGlow: 'bg-neutral-600/80 shadow-[0_0_4px_#52525b]',
          iconBadgeBg: 'bg-white/85 border-neutral-200 text-neutral-800 shadow-neutral-100',
        };
    }
  }
};

export interface HangingCordStyles {
  anchorBg: string;
  anchorBorder: string;
  cordGradient: string;
  cordStroke: string;
  ringBg: string;
  ringBorder: string;
  ringHole: string;
  knotBg: string;
  glowColor: string;
}

export const getHangingCordStyles = (
  themeId: NovelThemeId,
  isDark: boolean
): HangingCordStyles => {
  if (isDark) {
    switch (themeId) {
      case 'cosmic':
        return {
          anchorBg: '#38bdf8',
          anchorBorder: '#0284c7',
          cordGradient: 'linear-gradient(180deg, #38bdf8 0%, #c084fc 60%, #e879f9 100%)',
          cordStroke: '#c084fc',
          ringBg: '#1e1035',
          ringBorder: '#38bdf8',
          ringHole: '#38bdf8',
          knotBg: '#c084fc',
          glowColor: 'rgba(56, 189, 248, 0.45)',
        };
      case 'amethyst-haze':
        return {
          anchorBg: '#c084fc',
          anchorBorder: '#9333ea',
          cordGradient: 'linear-gradient(180deg, #e879f9 0%, #c084fc 50%, #d59aa7 100%)',
          cordStroke: '#c084fc',
          ringBg: '#231238',
          ringBorder: '#c084fc',
          ringHole: '#e879f9',
          knotBg: '#d59aa7',
          glowColor: 'rgba(192, 132, 252, 0.45)',
        };
      case 'slate-haze':
        return {
          anchorBg: '#38bdf8',
          anchorBorder: '#0284c7',
          cordGradient: 'linear-gradient(180deg, #7dd3fc 0%, #38bdf8 60%, #0ea5e9 100%)',
          cordStroke: '#38bdf8',
          ringBg: '#0f172a',
          ringBorder: '#38bdf8',
          ringHole: '#7dd3fc',
          knotBg: '#0284c7',
          glowColor: 'rgba(56, 189, 248, 0.45)',
        };
      case 'sage':
        return {
          anchorBg: '#34d399',
          anchorBorder: '#059669',
          cordGradient: 'linear-gradient(180deg, #6ee7b7 0%, #34d399 60%, #10b981 100%)',
          cordStroke: '#34d399',
          ringBg: '#062817',
          ringBorder: '#34d399',
          ringHole: '#6ee7b7',
          knotBg: '#059669',
          glowColor: 'rgba(52, 211, 153, 0.45)',
        };
      case 'mocha':
        return {
          anchorBg: '#fbbf24',
          anchorBorder: '#b45309',
          cordGradient: 'linear-gradient(180deg, #fde68a 0%, #f59e0b 60%, #d97706 100%)',
          cordStroke: '#f59e0b',
          ringBg: '#27170e',
          ringBorder: '#fbbf24',
          ringHole: '#fde68a',
          knotBg: '#b45309',
          glowColor: 'rgba(245, 158, 11, 0.45)',
        };
      case 'lululemon':
        return {
          anchorBg: '#ead4d7',
          anchorBorder: '#84334b',
          cordGradient: 'linear-gradient(180deg, #ba3859 0%, #a64462 50%, #84334b 100%)',
          cordStroke: '#ead4d7',
          ringBg: '#1c1115',
          ringBorder: '#ead4d7',
          ringHole: '#ba3859',
          knotBg: '#84334b',
          glowColor: 'rgba(132, 51, 75, 0.45)',
        };
      case 'notebook':
      default:
        return {
          anchorBg: '#cbd5e1',
          anchorBorder: '#64748b',
          cordGradient: 'linear-gradient(180deg, #f1f5f9 0%, #cbd5e1 50%, #94a3b8 100%)',
          cordStroke: '#cbd5e1',
          ringBg: '#1e293b',
          ringBorder: '#cbd5e1',
          ringHole: '#f1f5f9',
          knotBg: '#94a3b8',
          glowColor: 'rgba(203, 213, 225, 0.35)',
        };
    }
  } else {
    // Chế độ sáng (Light mode) - Đồng bộ tinh tế theo màu theme
    switch (themeId) {
      case 'cosmic':
        return {
          anchorBg: '#9333ea',
          anchorBorder: '#7e22ce',
          cordGradient: 'linear-gradient(180deg, #a855f7 0%, #9333ea 60%, #7e22ce 100%)',
          cordStroke: '#9333ea',
          ringBg: '#ffffff',
          ringBorder: '#a855f7',
          ringHole: '#9333ea',
          knotBg: '#7e22ce',
          glowColor: 'rgba(147, 51, 234, 0.25)',
        };
      case 'amethyst-haze':
        return {
          anchorBg: '#8b5cf6',
          anchorBorder: '#7c3aed',
          cordGradient: 'linear-gradient(180deg, #b3a8cb 0%, #9d8bb8 50%, #7e58a6 100%)',
          cordStroke: '#7e58a6',
          ringBg: '#ffffff',
          ringBorder: '#9d8bb8',
          ringHole: '#7e58a6',
          knotBg: '#7e58a6',
          glowColor: 'rgba(126, 88, 166, 0.25)',
        };
      case 'slate-haze':
        return {
          anchorBg: '#0284c7',
          anchorBorder: '#0369a1',
          cordGradient: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 60%, #0369a1 100%)',
          cordStroke: '#0284c7',
          ringBg: '#ffffff',
          ringBorder: '#38bdf8',
          ringHole: '#0284c7',
          knotBg: '#0369a1',
          glowColor: 'rgba(2, 132, 199, 0.25)',
        };
      case 'sage':
        return {
          anchorBg: '#059669',
          anchorBorder: '#047857',
          cordGradient: 'linear-gradient(180deg, #34d399 0%, #059669 60%, #047857 100%)',
          cordStroke: '#059669',
          ringBg: '#ffffff',
          ringBorder: '#34d399',
          ringHole: '#059669',
          knotBg: '#047857',
          glowColor: 'rgba(5, 150, 105, 0.25)',
        };
      case 'mocha':
        return {
          anchorBg: '#b45309',
          anchorBorder: '#92400e',
          cordGradient: 'linear-gradient(180deg, #d97706 0%, #b45309 60%, #92400e 100%)',
          cordStroke: '#b45309',
          ringBg: '#ffffff',
          ringBorder: '#d97706',
          ringHole: '#b45309',
          knotBg: '#92400e',
          glowColor: 'rgba(180, 83, 9, 0.25)',
        };
      case 'lululemon':
        return {
          anchorBg: '#cc7b8f',
          anchorBorder: '#b86277',
          cordGradient: 'linear-gradient(180deg, #eed3dc 0%, #de9fb0 50%, #cc7b8f 100%)',
          cordStroke: '#cc7b8f',
          ringBg: '#ffffff',
          ringBorder: '#eed3dc',
          ringHole: '#cc7b8f',
          knotBg: '#b86277',
          glowColor: 'rgba(204, 123, 143, 0.20)',
        };
      case 'notebook':
      default:
        return {
          anchorBg: '#6366f1',
          anchorBorder: '#4f46e5',
          cordGradient: 'linear-gradient(180deg, #818cf8 0%, #6366f1 60%, #4338ca 100%)',
          cordStroke: '#6366f1',
          ringBg: '#ffffff',
          ringBorder: '#818cf8',
          ringHole: '#6366f1',
          knotBg: '#4338ca',
          glowColor: 'rgba(99, 102, 241, 0.25)',
        };
    }
  }
};

interface ThemePickerStyles {
  primaryBtn: string;
  rerollIcon: string;
  loadingDots: [string, string, string];
  metaIcon: string;
  titleHover: string;
}

const getThemePickerStyles = (themeId: NovelThemeId, isDark: boolean): ThemePickerStyles => {
  switch (themeId) {
    case 'cosmic':
      return {
        primaryBtn: isDark
          ? 'border border-indigo-500/50 bg-gradient-to-r from-[#4d2d78] via-[#5e3793] to-[#7142b0] hover:from-[#573387] hover:to-[#7f4bc7] shadow-lg shadow-black/40 text-white font-bold active:scale-95 transition-all'
          : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-sm hover:shadow-md border border-purple-400/40 active:scale-95 transition-all',
        rerollIcon: 'text-fuchsia-400',
        loadingDots: ['bg-purple-500', 'bg-fuchsia-400', 'bg-pink-300'],
        metaIcon: 'text-fuchsia-300',
        titleHover: 'hover:text-fuchsia-300',
      };
    case 'amethyst-haze':
      return {
        primaryBtn: isDark
          ? 'border border-[#6e4694]/50 bg-gradient-to-r from-[#452d5e] via-[#533671] to-[#634187] hover:from-[#4c3167] hover:to-[#704998] shadow-lg shadow-black/40 text-white font-bold active:scale-95 transition-all'
          : 'amethyst-light-btn font-bold !text-[#6b5887] hover:!text-[#7e58a6] active:scale-95 transition-all cursor-pointer',
        rerollIcon: isDark ? 'text-purple-300' : 'text-[#7e58a6]',
        loadingDots: ['bg-[#7e739f]', 'bg-[#b3a8cb]', 'bg-[#d59aa7]'],
        metaIcon: isDark ? 'text-purple-300' : 'text-purple-400',
        titleHover: 'hover:text-purple-300',
      };
    case 'slate-haze':
      return {
        primaryBtn: isDark
          ? 'border border-[#395677]/60 bg-gradient-to-r from-[#2c435c] via-[#355170] to-[#406287] hover:from-[#324d69] hover:to-[#4a729c] shadow-lg shadow-black/40 text-white font-bold active:scale-95 transition-all'
          : 'frost-light-btn font-bold !text-[#526982] hover:!text-[#0284c7] active:scale-95 transition-all cursor-pointer',
        rerollIcon: isDark ? 'text-sky-300' : 'text-[#0284c7]',
        loadingDots: ['bg-sky-500', 'bg-cyan-400', 'bg-blue-300'],
        metaIcon: isDark ? 'text-sky-300' : 'text-sky-400',
        titleHover: 'hover:text-sky-300',
      };
    case 'sage':
      return {
        primaryBtn: isDark
          ? 'border border-[#43634b]/60 bg-gradient-to-r from-[#2d4432] via-[#39563f] to-[#46694e] hover:from-[#344f3a] hover:to-[#507859] shadow-lg shadow-black/40 text-white font-bold active:scale-95 transition-all'
          : 'sage-light-btn font-bold !text-[#466244] hover:!text-[#274225] active:scale-95 transition-all cursor-pointer',
        rerollIcon: isDark ? 'text-emerald-300' : 'text-[#274225]',
        loadingDots: ['bg-emerald-500', 'bg-teal-400', 'bg-lime-300'],
        metaIcon: isDark ? 'text-emerald-300' : 'text-emerald-400',
        titleHover: 'hover:text-emerald-300',
      };
    case 'mocha':
      return {
        primaryBtn: isDark
          ? 'border border-[#6a493a]/60 bg-gradient-to-r from-[#4d362b] via-[#5c4134] to-[#6d4d3d] hover:from-[#573d31] hover:to-[#7a5745] shadow-lg shadow-black/40 text-white font-bold active:scale-95 transition-all'
          : 'mocha-light-btn font-bold !text-[#7a6256] hover:!text-[#a37764] active:scale-95 transition-all cursor-pointer',
        rerollIcon: isDark ? 'text-amber-300' : 'text-[#a37764]',
        loadingDots: ['bg-amber-500', 'bg-yellow-400', 'bg-orange-300'],
        metaIcon: isDark ? 'text-amber-300' : 'text-amber-400',
        titleHover: 'hover:text-amber-300',
      };
    case 'lululemon':
      return {
        primaryBtn: isDark
          ? 'border border-[#84334b]/50 bg-gradient-to-r from-[#84334b] via-[#9e3d5a] to-[#ba3859] hover:from-[#943853] hover:to-[#c74164] shadow-lg shadow-black/40 text-white font-bold active:scale-95 transition-all'
          : 'lulu-light-btn font-bold !text-[#ad4862] hover:!text-[#9c3e55] active:scale-95 transition-all cursor-pointer',
        rerollIcon: isDark ? 'text-[#d4a3af]' : 'text-[#ad4862]',
        loadingDots: isDark
          ? ['bg-[#a64462]', 'bg-[#ead4d7]', 'bg-[#ba3859]']
          : ['bg-[#cc7b8f]', 'bg-[#de9fb0]', 'bg-[#eed3dc]'],
        metaIcon: isDark ? 'text-[#d4a3af]' : 'text-[#ad4862]',
        titleHover: 'hover:text-[#ad4862]',
      };
    case 'notebook':
    default:
      return {
        primaryBtn: isDark
          ? 'border border-neutral-600/60 bg-gradient-to-r from-[#38383f] via-[#44444c] to-[#52525c] hover:from-[#404047] hover:to-[#5e5e69] shadow-lg shadow-black/40 text-white font-bold active:scale-95 transition-all'
          : 'notebook-light-btn font-bold !text-[#525252] hover:!text-[#171717] active:scale-95 transition-all cursor-pointer',
        rerollIcon: isDark ? 'text-neutral-300' : 'text-neutral-900',
        loadingDots: isDark
          ? ['bg-neutral-200', 'bg-neutral-400', 'bg-neutral-500']
          : ['bg-neutral-800', 'bg-neutral-600', 'bg-neutral-400'],
        metaIcon: isDark ? 'text-neutral-300' : 'text-neutral-400',
        titleHover: 'hover:text-neutral-200',
      };
  }
};

// Bảng màu nền dập nổi Neumorphic thích ứng theo từng theme
export const getRandomPickerCardBg = (themeId: NovelThemeId, isDark: boolean): string => {
  if (isDark) {
    switch (themeId) {
      case 'cosmic':
        return 'bg-[#140b24]/95 text-purple-100';
      case 'amethyst-haze':
        return 'bg-[#1a1528]/95 text-purple-100';
      case 'slate-haze':
        return 'bg-[#0f1926]/95 text-sky-100';
      case 'sage':
        return 'bg-[#131d14]/95 text-emerald-100';
      case 'mocha':
        return 'bg-[#1c1815]/95 text-amber-100';
      case 'lululemon':
        return 'bg-[#1c1115]/95 text-[#f4ebee]';
      case 'notebook':
      default:
        return 'bg-[#18181b]/95 text-zinc-100';
    }
  } else {
    switch (themeId) {
      case 'amethyst-haze':
        return 'bg-[#FAF7FD] text-[#2d2238]';
      case 'slate-haze':
        return 'bg-[#F4F8FA] text-[#1c2c38]';
      case 'sage':
        return 'bg-[#F5F8F4] text-[#223522]';
      case 'mocha':
        return 'bg-[#FAF7F2] text-[#332b26]';
      case 'lululemon':
        return 'bg-[#f2ebef] text-[#382329]';
      case 'notebook':
      default:
        return 'bg-[#fcfbf9] text-neutral-900';
    }
  }
};

// Màu hoa văn chấm dot-grid tương tự mục Truyện Vừa Mới Đăng
export const getPickerDotColor = (themeId: NovelThemeId, isDark: boolean): string => {
  if (isDark) {
    switch (themeId) {
      case 'slate-haze':
        return 'rgba(186, 230, 253, 0.08)';
      case 'sage':
        return 'rgba(167, 243, 208, 0.08)';
      case 'mocha':
        return 'rgba(254, 215, 170, 0.08)';
      case 'lululemon':
        return 'rgba(234, 212, 215, 0.12)';
      case 'notebook':
        return 'rgba(212, 212, 216, 0.08)';
      default:
        return 'rgba(233, 213, 255, 0.08)';
    }
  } else {
    switch (themeId) {
      case 'slate-haze':
        return 'rgba(14, 116, 144, 0.06)';
      case 'sage':
        return 'rgba(21, 128, 61, 0.06)';
      case 'mocha':
        return 'rgba(180, 83, 9, 0.06)';
      case 'lululemon':
        return 'rgba(132, 51, 75, 0.08)';
      case 'notebook':
        return 'rgba(113, 113, 122, 0.06)';
      default:
        return 'rgba(126, 34, 206, 0.06)';
    }
  }
};

// Nút bấm Neumorphic có phản hồi xúc giác cơ học (Tactile feedback)
export const getTactileBtnStyles = (themeId: NovelThemeId, isDark: boolean): string => {
  if (isDark) {
    switch (themeId) {
      case 'cosmic':
      case 'amethyst-haze':
        return 'bg-[#221b2f] text-purple-200 border-white/[0.08] shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
      case 'slate-haze':
        return 'bg-[#142335] text-sky-200 border-white/[0.08] shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
      case 'sage':
        return 'bg-[#182619] text-emerald-200 border-white/[0.08] shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
      case 'mocha':
        return 'bg-[#251e1b] text-amber-200 border-white/[0.08] shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
      case 'lululemon':
        return 'bg-[#25161c] text-[#f4ebee] border-[#84334b]/20 shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_12px_rgba(132,51,75,0.30)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
      case 'notebook':
      default:
        return 'bg-[#222228] text-zinc-200 border-white/[0.08] shadow-[0_3px_8px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.50)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.70),inset_0_-1px_1px_rgba(255,255,255,0.06)] active:border-black/40';
    }
  } else {
    switch (themeId) {
      case 'cosmic':
      case 'amethyst-haze':
        return 'bg-[#f7f5fb] text-[#4d3d63] border-white/90 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.09)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.18),inset_0_-1px_1px_rgba(255,255,255,0.45)] active:border-black/[0.04]';
      case 'slate-haze':
        return 'bg-[#f2f7fa] text-[#274558] border-white/90 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.09)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.18),inset_0_-1px_1px_rgba(255,255,255,0.45)] active:border-black/[0.04]';
      case 'sage':
        return 'bg-[#f2f7f1] text-[#2c4b2a] border-white/90 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.09)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.18),inset_0_-1px_1px_rgba(255,255,255,0.45)] active:border-black/[0.04]';
      case 'mocha':
        return 'bg-[#f9f5f0] text-[#523e32] border-white/90 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.09)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.18),inset_0_-1px_1px_rgba(255,255,255,0.45)] active:border-black/[0.04]';
      case 'lululemon':
        return 'lulu-light-btn hover:!text-[#84334b]';
      case 'notebook':
      default:
        return 'bg-[#f7f7f9] text-[#333338] border-white/90 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.09)] active:shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.18),inset_0_-1px_1px_rgba(255,255,255,0.45)] active:border-black/[0.04]';
    }
  }
};

// =========================================================================
// VÒNG NGUYỆT QUẾ TIẾN ĐỘ NỞ HOA (SvgWreathProgressBloom) - THEME FROST
// Khung cảnh 2 của mục chọn truyện ngẫu nhiên: tính toán tiến độ mượt mà bằng requestAnimationFrame
// =========================================================================
export const SvgWreathProgressBloom: React.FC<{
  progress?: number;
  isAutoPlay?: boolean;
  size?: number;
  isDarkEffective?: boolean;
}> = ({ progress: propProgress, isAutoPlay = true, size = 240, isDarkEffective = false }) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const isPlaying = isAutoPlay;
  const playbackSpeed = 1;

  // Vòng lặp tính toán tiến độ chuyển động mượt mà
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setInternalProgress((prev) => {
        // 1 chu kỳ hoàn chỉnh kéo dài 3.2 giây ở tốc độ 1x
        const increment = (100 / 3.2) * playbackSpeed * delta;
        const next = prev + increment;
        if (next >= 100) return 0; // Tự động lặp lại từ đầu
        return next;
      });

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed]);

  const effectiveProgress = propProgress !== undefined ? propProgress : internalProgress;
  const p = Math.min(100, Math.max(0, effectiveProgress)) / 100;
  // Chu vi vòng tròn bán kính 100: 2 * PI * 100 = 628.3
  const circumference = 628.3;
  const strokeDash = circumference * p;

  // 12 đóa hoa phân bố đều quanh vòng tròn (cách nhau 30 độ)
  const WREATH_FLOWERS = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 360) / 12;
      const rad = ((angle - 90) * Math.PI) / 180;
      const x = 150 + 100 * Math.cos(rad);
      const y = 150 + 100 * Math.sin(rad);
      const trigger = i / 12; // Ngưỡng nở tương ứng từng vị trí
      return { x, y, angle, trigger };
    });
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none py-1">
      <svg
        width={size}
        height={size}
        viewBox="0 0 300 300"
        className="overflow-visible select-none max-w-full"
        style={{ filter: isDarkEffective ? 'drop-shadow(0 12px 30px rgba(56, 189, 248, 0.35))' : 'drop-shadow(0 12px 30px rgba(56, 189, 248, 0.2))' }}
      >
        <defs>
          <linearGradient id={isDarkEffective ? 'wp-ring-frost-dark' : 'wp-ring-frost'} x1="0%" y1="0%" x2="100%" y2="100%">
            {isDarkEffective ? (
              <>
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#BAE6FD" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="50%" stopColor="#7DD3FC" />
                <stop offset="100%" stopColor="#38BDF8" />
              </>
            )}
          </linearGradient>

          <linearGradient id={isDarkEffective ? 'wp-petal-frost-dark' : 'wp-petal-frost'} x1="0%" y1="100%" x2="0%" y2="0%">
            {isDarkEffective ? (
              <>
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#F0F9FF" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#7DD3FC" />
                <stop offset="70%" stopColor="#BAE6FD" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Quầng sáng mờ trung tâm */}
        <circle cx="150" cy="150" r={45 + p * 30} fill={isDarkEffective ? '#0284c7' : '#E0F2FE'} opacity={isDarkEffective ? 0.28 : 0.35} />

        {/* Vòng ray tĩnh mờ định hướng */}
        <circle
          cx="150"
          cy="150"
          r="100"
          fill="none"
          stroke={isDarkEffective ? '#1e293b' : '#E0F2FE'}
          strokeWidth="3"
          strokeDasharray="6 6"
          opacity={isDarkEffective ? 0.75 : 0.7}
        />

        {/* DÂY LEO VÒNG NGUYỆT QUẾ CHẠY THEO TIẾN ĐỘ TẢI (Clockwise from 12 o'clock) */}
        <circle
          cx="150"
          cy="150"
          r="100"
          fill="none"
          stroke={isDarkEffective ? 'url(#wp-ring-frost-dark)' : 'url(#wp-ring-frost)'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          transform="rotate(-90 150 150)"
          style={{ transition: isAutoPlay ? 'none' : 'stroke-dasharray 0.3s ease' }}
        />

        {/* DÂY XOẮN PHỤ CHẠY ĐAN XEN (Braided vine) */}
        <circle
          cx="150"
          cy="150"
          r="95"
          fill="none"
          stroke={isDarkEffective ? '#38bdf8' : '#BAE6FD'}
          strokeWidth="1.5"
          strokeDasharray={`${Math.max(0, strokeDash - 10)} ${circumference}`}
          transform="rotate(-85 150 150)"
          opacity={isDarkEffective ? 0.65 : 0.85}
        />

        {/* 16 KHÓM LÁ NGUYỆT QUẾ ĐÂM CHỒI DỌC VÒNG TRÒN */}
        {Array.from({ length: 16 }).map((_, i) => {
          const leafAngle = (i * 360) / 16;
          const trigger = i / 16;
          const leafP = Math.max(0, Math.min(1, (p - trigger) / 0.1));
          if (leafP <= 0) return null;
          const rad = ((leafAngle - 90) * Math.PI) / 180;
          const lx = 150 + 100 * Math.cos(rad);
          const ly = 150 + 100 * Math.sin(rad);
          const isOuter = i % 2 === 0;
          const leafRot = leafAngle + (isOuter ? 45 : -45);

          return (
            <g
              key={`wleaf-${i}`}
              transform={`translate(${lx}, ${ly}) rotate(${leafRot}) scale(${leafP * 0.9})`}
              style={{ transformOrigin: '0 0' }}
            >
              <path
                d="M 0 0 C 6 -10, 16 -8, 20 0 C 16 8, 6 10, 0 0 Z"
                fill={isDarkEffective ? '#0c4a6e' : '#BAE6FD'}
                stroke={isDarkEffective ? '#38bdf8' : '#7DD3FC'}
                strokeWidth={isDarkEffective ? '0.85' : '0.7'}
              />
            </g>
          );
        })}

        {/* 12 ĐÓA HOA BUNG NỞ NỐI TIẾP THEO CHIỀU KIM ĐỒNG HỒ */}
        {WREATH_FLOWERS.map((fl, i) => {
          const flP = Math.max(0, Math.min(1, (p - fl.trigger) / 0.12));
          if (flP <= 0) return null;
          const scale = 0.2 + flP * 0.8;
          const isMaster = i === 0 || i === 6; // Đóa hoa lớn tại đỉnh và đáy

          return (
            <g
              key={`wfl-${i}`}
              transform={`translate(${fl.x}, ${fl.y}) scale(${scale})`}
              style={{
                transformOrigin: '0 0',
                transition: isAutoPlay ? 'none' : 'transform 0.25s ease',
              }}
            >
              {/* 5 cánh hoa mềm mại */}
              {Array.from({ length: 5 }).map((_, pi) => {
                const pAngle = (pi * 360) / 5;
                return (
                  <circle
                    key={pi}
                    cx="0"
                    cy={isMaster ? -9 : -6}
                    r={isMaster ? 6.5 : 4.5}
                    fill={isDarkEffective ? 'url(#wp-petal-frost-dark)' : 'url(#wp-petal-frost)'}
                    stroke={isDarkEffective ? '#BAE6FD' : '#FFFFFF'}
                    strokeWidth="0.6"
                    transform={`rotate(${pAngle})`}
                  />
                );
              })}
              {/* Hạt ngọc nhụy hoa */}
              <circle
                cx="0"
                cy="0"
                r={isMaster ? 4 : 2.5}
                fill={isDarkEffective ? '#38bdf8' : '#FFFFFF'}
                stroke={isDarkEffective ? '#e0f2fe' : '#38BDF8'}
                strokeWidth="0.8"
              />
            </g>
          );
        })}

        {/* HOA SEN TRUNG TÂM NỞ BỪNG RỰC RỠ KÈM GÓC XOAY THEO TIẾN ĐỘ */}
        <g
          transform={`translate(150, 150) scale(${0.3 + p * 0.7}) rotate(${p * 45})`}
          style={{
            transformOrigin: '0 0',
            transition: isAutoPlay ? 'none' : 'transform 0.3s ease',
          }}
        >
          {/* Tầng cánh hoa ngoài */}
          {Array.from({ length: 8 }).map((_, pi) => (
            <ellipse
              key={`cp-${pi}`}
              cx="0"
              cy="-16"
              rx="8"
              ry="18"
              fill={isDarkEffective ? 'url(#wp-petal-frost-dark)' : 'url(#wp-petal-frost)'}
              stroke={isDarkEffective ? '#BAE6FD' : '#FFFFFF'}
              strokeWidth="0.8"
              transform={`rotate(${(pi * 360) / 8})`}
              opacity="0.95"
            />
          ))}
          {/* Tầng cánh hoa trong */}
          {Array.from({ length: 6 }).map((_, pi) => (
            <ellipse
              key={`cp2-${pi}`}
              cx="0"
              cy="-10"
              rx="6"
              ry="13"
              fill={isDarkEffective ? '#082f49' : '#FFFFFF'}
              stroke={isDarkEffective ? '#38bdf8' : '#BAE6FD'}
              strokeWidth="0.8"
              transform={`rotate(${(pi * 360) / 6 + 22.5})`}
            />
          ))}
          <circle cx="0" cy="0" r="7" fill="#38BDF8" stroke={isDarkEffective ? '#E0F2FE' : '#FFFFFF'} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill={isDarkEffective ? '#E0F2FE' : '#FFFFFF'} />
        </g>

        {/* CHỈ SỐ PHẦN TRĂM TIẾN ĐỘ TRONG TÂM VÒNG */}
        <text
          x="150"
          y="195"
          textAnchor="middle"
          fill={isDarkEffective ? '#7DD3FC' : '#0284C7'}
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
          opacity={0.9}
        >
          {Math.round(p * 100)}%
        </text>
      </svg>
    </div>
  );
};

// =========================================================================
// LOADING LỚN DẠNG XOẮN ỐC (SPIRAL VORTEX) - THEME LINEN (mocha)
// Dành riêng cho Khung cảnh 2 mục chọn truyện ngẫu nhiên Theme Linen (Sáng & Tối)
// =========================================================================
export const LinenSpiralVortexLoading: React.FC<{ isDarkEffective: boolean }> = ({ isDarkEffective }) => {
  const strokeColor = isDarkEffective ? '#d4a389' : '#8c6150';

  return (
    <div className="relative w-28 h-28 flex items-center justify-center select-none py-1">
      {/* Vầng hào quang mộc linen ấm áp phía sau */}
      <div
        className={`absolute -inset-2 rounded-full blur-xl pointer-events-none ${
          isDarkEffective
            ? 'bg-gradient-to-r from-[#8c6150]/30 via-[#b3826b]/25 to-[#6b4737]/35'
            : 'bg-gradient-to-r from-[#d6c7b2]/45 via-[#e8ded1]/50 to-[#c5b59e]/40'
        }`}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="vol-linen relative z-10"
        viewBox="0 0 64 64"
        width="104"
        height="104"
        fill="none"
        role="img"
        aria-label="Loading"
        style={{ color: strokeColor, ['--rate' as any]: 1 }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .vol-linen { --dur: 3.4s; }
              .vol-linen-ghost, .vol-linen-line { stroke: currentColor; fill: none; stroke-linecap: round; }
              .vol-linen-ghost { stroke-width: .8; opacity: ${isDarkEffective ? '0.22' : '0.18'}; }
              .vol-linen-rig {
                transform-box: view-box;
                transform-origin: center;
                animation: vol-linen-turn calc(var(--dur) * var(--rate, 1) * 2.4) linear infinite;
              }
              .vol-linen-line {
                stroke-width: 1.9;
                stroke-dasharray: 100 100;
                stroke-dashoffset: 100;
                animation: vol-linen-draw calc(var(--dur) * var(--rate, 1)) infinite;
              }
              @keyframes vol-linen-draw {
                0%   { stroke-dashoffset: 100;  animation-timing-function: cubic-bezier(.5, 0, .5, 1); }
                50%  { stroke-dashoffset: 0;    animation-timing-function: cubic-bezier(.5, 0, .5, 1); }
                100% { stroke-dashoffset: -100; }
              }
              @keyframes vol-linen-turn { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @media (prefers-reduced-motion: reduce) {
                .vol-linen-line { animation: none; stroke-dashoffset: 0; }
                .vol-linen-rig  { animation: none; }
              }
            `,
          }}
        />
        <path
          className="vol-linen-ghost"
          d="M32.0,30.8L32.2,30.6L32.4,30.5L32.7,30.4L33.0,30.3L33.3,30.3L33.7,30.4L34.0,30.6L34.4,30.8L34.7,31.0L35.0,31.4L35.2,31.8L35.4,32.2L35.5,32.7L35.6,33.2L35.5,33.8L35.4,34.4L35.2,34.9L34.9,35.5L34.5,36.0L34.0,36.5L33.4,36.9L32.8,37.2L32.1,37.5L31.3,37.6L30.5,37.6L29.7,37.5L28.8,37.3L28.0,37.0L27.3,36.6L26.5,36.0L25.9,35.3L25.3,34.5L24.9,33.6L24.5,32.6L24.3,31.6L24.3,30.5L24.4,29.4L24.6,28.3L25.0,27.3L25.6,26.2L26.3,25.3L27.2,24.4L28.2,23.7L29.3,23.0L30.5,22.6L31.8,22.3L33.1,22.2L34.5,22.2L35.9,22.5L37.2,22.9L38.5,23.6L39.7,24.4L40.8,25.4L41.8,26.6L42.6,27.9L43.3,29.4L43.7,30.9L43.9,32.5L43.9,34.1L43.7,35.8L43.3,37.4L42.6,39.0L41.7,40.5L40.5,41.9L39.2,43.1L37.7,44.2L36.1,45.0L34.3,45.6L32.4,46.0L30.5,46.1L28.6,45.9L26.6,45.5L24.8,44.8L23.0,43.9L21.3,42.7L19.8,41.2L18.5,39.6L17.4,37.8L16.6,35.8L16.1,33.7L15.8,31.5L15.8,29.3L16.2,27.0L16.8,24.9L17.8,22.8L19.0,20.8L20.5,19.0L22.3,17.4L24.3,16.1L26.5,15.0L28.8,14.2L31.2,13.8L33.7,13.6L36.3,13.9L38.7,14.4L41.1,15.4L43.4,16.6L45.5,18.2L47.4,20.0L49.1,22.1L50.4,24.5L51.5,27.0L52.2,29.7L52.5,32.4L52.4,35.2L52.0,38.0L51.1,40.8L49.9,43.4L48.3,45.8L46.4,48.0L44.2,50.0L41.8,51.7L39.1,53.0L36.2,53.9L33.2,54.5L30.1,54.6L27.0,54.3L24.0,53.6L21.0,52.5L18.2,51.0L15.6,49.1L13.3,46.8L11.3,44.2L9.7,41.4L8.5,38.3L7.6,35.1L7.3,31.7L7.3,28.4L7.9,25.0L8.9,21.7L10.3,18.6L12.2,15.6L14.5,13.0L17.1,10.6L20.1,8.6L23.3,7.1L26.7,5.9L30.3,5.3L34.0,5.1L37.6,5.4L41.3,6.3L44.7,7.6L48.0,9.4L51.1,11.7L53.8,14.3L56.2,17.4L58.1,20.7L59.6,24.3L60.5,28.1L61.0,32.0"
        />
        <g className="vol-linen-rig">
          <path
            className="vol-linen-line"
            d="M32.0,30.8L32.2,30.6L32.4,30.5L32.7,30.4L33.0,30.3L33.3,30.3L33.7,30.4L34.0,30.6L34.4,30.8L34.7,31.0L35.0,31.4L35.2,31.8L35.4,32.2L35.5,32.7L35.6,33.2L35.5,33.8L35.4,34.4L35.2,34.9L34.9,35.5L34.5,36.0L34.0,36.5L33.4,36.9L32.8,37.2L32.1,37.5L31.3,37.6L30.5,37.6L29.7,37.5L28.8,37.3L28.0,37.0L27.3,36.6L26.5,36.0L25.9,35.3L25.3,34.5L24.9,33.6L24.5,32.6L24.3,31.6L24.3,30.5L24.4,29.4L24.6,28.3L25.0,27.3L25.6,26.2L26.3,25.3L27.2,24.4L28.2,23.7L29.3,23.0L30.5,22.6L31.8,22.3L33.1,22.2L34.5,22.2L35.9,22.5L37.2,22.9L38.5,23.6L39.7,24.4L40.8,25.4L41.8,26.6L42.6,27.9L43.3,29.4L43.7,30.9L43.9,32.5L43.9,34.1L43.7,35.8L43.3,37.4L42.6,39.0L41.7,40.5L40.5,41.9L39.2,43.1L37.7,44.2L36.1,45.0L34.3,45.6L32.4,46.0L30.5,46.1L28.6,45.9L26.6,45.5L24.8,44.8L23.0,43.9L21.3,42.7L19.8,41.2L18.5,39.6L17.4,37.8L16.6,35.8L16.1,33.7L15.8,31.5L15.8,29.3L16.2,27.0L16.8,24.9L17.8,22.8L19.0,20.8L20.5,19.0L22.3,17.4L24.3,16.1L26.5,15.0L28.8,14.2L31.2,13.8L33.7,13.6L36.3,13.9L38.7,14.4L41.1,15.4L43.4,16.6L45.5,18.2L47.4,20.0L49.1,22.1L50.4,24.5L51.5,27.0L52.2,29.7L52.5,32.4L52.4,35.2L52.0,38.0L51.1,40.8L49.9,43.4L48.3,45.8L46.4,48.0L44.2,50.0L41.8,51.7L39.1,53.0L36.2,53.9L33.2,54.5L30.1,54.6L27.0,54.3L24.0,53.6L21.0,52.5L18.2,51.0L15.6,49.1L13.3,46.8L11.3,44.2L9.7,41.4L8.5,38.3L7.6,35.1L7.3,31.7L7.3,28.4L7.9,25.0L8.9,21.7L10.3,18.6L12.2,15.6L14.5,13.0L17.1,10.6L20.1,8.6L23.3,7.1L26.7,5.9L30.3,5.3L34.0,5.1L37.6,5.4L41.3,6.3L44.7,7.6L48.0,9.4L51.1,11.7L53.8,14.3L56.2,17.4L58.1,20.7L59.6,24.3L60.5,28.1L61.0,32.0"
            pathLength="100"
          />
        </g>
      </svg>
    </div>
  );
};

// =========================================================================
// VẬT TRANG TRÍ: ĐỒNG HỒ CÁT TRÁI TIM PIXEL (PIXEL HEART HOURGLASS)
// Dành riêng cho theme White (notebook) - Tương thích chuẩn xác chế độ sáng & tối
// Giữ lại duy nhất vật thể đồng hồ cát pixel chuyển động tinh tế
// =========================================================================
export const PixelHeartHourglass: React.FC<{ isDarkEffective: boolean }> = ({ isDarkEffective }) => {
  const [isHourglassFlipping, setIsHourglassFlipping] = useState(false);

  const handleFlipHourglass = () => {
    setIsHourglassFlipping(true);
    setTimeout(() => {
      setIsHourglassFlipping(false);
    }, 600);
  };

  return (
    <div className="relative w-28 h-28 flex items-center justify-center select-none">
      {/* Vầng hào quang mờ ảo phía sau */}
      <div
        className={`absolute -inset-2 rounded-full blur-xl pointer-events-none ${
          isDarkEffective ? 'bg-neutral-500/20' : 'bg-stone-300/30'
        }`}
      />

      {/* Vành nét đứt mảnh xoay mượt mà bao quanh đồng hồ */}
      <div
        className={`absolute w-22 h-22 rounded-full border border-dashed animate-[spin_12s_linear_infinite] pointer-events-none ${
          isDarkEffective ? 'border-neutral-500/30' : 'border-stone-400/40'
        }`}
      />

      {/* Thân Đồng Hồ Cát Pixel 8-Bit - Có hiệu ứng xoay lật 180 độ khi nhấn */}
      <motion.div
        animate={isHourglassFlipping ? { rotate: [0, 180], scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onClick={handleFlipHourglass}
        className="cursor-pointer select-none py-1 flex flex-col items-center relative z-10 group"
        title="Chạm vào để lật ngược đồng hồ cát! ⌛"
      >
        {/* Đỉnh đồng hồ bằng gỗ pixel */}
        <div
          className={`w-12 h-2 rounded-t-md shadow-2xs ${
            isDarkEffective
              ? 'bg-neutral-400 border border-neutral-300'
              : 'bg-stone-500 border border-stone-600'
          }`}
        />

        {/* Buồng kính pha lê hình nón đôi pixel */}
        <div
          className={`relative w-10 h-16 border-x-2 flex flex-col items-center justify-between py-1 overflow-hidden ${
            isDarkEffective
              ? 'border-neutral-700/80 bg-black/40'
              : 'border-stone-300/80 bg-white/80'
          }`}
        >
          {/* Buồng trên: Cát tim đang vơi dần */}
          <div
            className={`w-7 h-4 rounded-b-md flex items-center justify-center ${
              isDarkEffective
                ? 'bg-gradient-to-b from-neutral-300 to-neutral-500'
                : 'bg-gradient-to-b from-stone-600 to-stone-400'
            }`}
          >
            <span className="text-[7px] text-white font-mono leading-none">✦ ✦</span>
          </div>

          {/* Dòng hạt cát tim pixel rơi tí tách qua eo đồng hồ */}
          <div className="relative flex flex-col items-center h-4 my-0.5">
            <motion.div
              animate={{ y: [0, 14], opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className={`w-1.5 h-1.5 rounded-full ${
                isDarkEffective ? 'bg-neutral-200' : 'bg-stone-700'
              }`}
            />
            <motion.div
              animate={{ y: [0, 14], opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear', delay: 0.4 }}
              className={`w-1 h-1 rounded-full mt-1 ${
                isDarkEffective ? 'bg-neutral-400' : 'bg-stone-500'
              }`}
            />
          </div>

          {/* Buồng dưới: Đụn cát tim đang vun đầy */}
          <div
            className={`w-7 h-4 rounded-t-md flex items-center justify-center ${
              isDarkEffective
                ? 'bg-gradient-to-t from-neutral-300 to-neutral-500'
                : 'bg-gradient-to-t from-stone-600 to-stone-400'
            }`}
          >
            <Heart
              className={`w-2.5 h-2.5 ${
                isDarkEffective ? 'text-neutral-900 fill-neutral-900' : 'text-white fill-white'
              }`}
            />
          </div>
        </div>

        {/* Đáy đồng hồ bằng gỗ pixel */}
        <div
          className={`w-12 h-2 rounded-b-md shadow-2xs ${
            isDarkEffective
              ? 'bg-neutral-400 border border-neutral-300'
              : 'bg-stone-500 border border-stone-600'
          }`}
        />
      </motion.div>
    </div>
  );
};

// =========================================================================
// MÁY PHÁT ĐĨA THAN VINYL (BẢN GỐC HỒNG & BẢN THEME LINEN / MOCHA)
// =========================================================================

export const PinkVinylPlayer: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className="relative w-36 h-32 flex items-center justify-center select-none">
      {/* Vầng sáng hồng */}
      <div
        className={`absolute w-30 h-30 rounded-full blur-2xl pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-pink-600/30 via-rose-500/25 to-pink-600/30'
            : 'bg-gradient-to-r from-pink-200/50 via-rose-200/40 to-pink-200/50'
        }`}
      />

      {/* Bàn máy phát đĩa cố định */}
      <div
        className={`relative w-32 h-26 rounded-2xl border-2 p-2 shadow-xl flex items-center justify-center ${
          isDark
            ? 'bg-gradient-to-b from-[#2d1422] to-[#1c0a14] border-pink-500/40'
            : 'bg-gradient-to-b from-[#fff5f9] to-[#ffe5ef] border-pink-200 shadow-rose-100/70'
        }`}
      >
        {/* Đĩa vinyl xoay tròn 360 độ */}
        <div className="relative w-22 h-22 rounded-full shadow-2xl flex items-center justify-center overflow-hidden animate-[pink-spool-spin_3.5s_linear_infinite]">
          {/* Rãnh đĩa màu hồng dâu đậm */}
          <div
            className="w-full h-full rounded-full border border-pink-400/40 relative flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, #f43f5e 0%, #be123c 35%, #881337 70%, #4c0519 100%)',
            }}
          >
            {/* Các vòng rãnh âm thanh đồng tâm */}
            <div className="absolute inset-1 rounded-full border border-white/15" />
            <div className="absolute inset-2.5 rounded-full border border-white/15" />
            <div className="absolute inset-4 rounded-full border border-white/20" />
            <div className="absolute inset-6 rounded-full border border-white/20" />

            {/* Vệt phản quang quét qua đĩa vinyl */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-40"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.45) 45deg, transparent 90deg, transparent 180deg, rgba(255,255,255,0.45) 225deg, transparent 270deg)',
              }}
            />

            {/* Tem giấy tâm đĩa */}
            <div className="relative w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-pink-300 shadow-md flex items-center justify-center z-10">
              <div className="w-2 h-2 rounded-full bg-rose-500 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-white" />
              </div>
              <span className="absolute -top-0.5 text-[6px] text-pink-500 font-mono font-bold">♡</span>
            </div>
          </div>
        </div>

        {/* Cần kim phát nhạc (Tone arm) đặt trên rãnh đĩa */}
        <div className="absolute top-2 right-2 w-7 h-16 pointer-events-none flex flex-col items-end">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 via-rose-300 to-amber-400 border border-white shadow-xs z-20" />
          <div className="w-0.5 h-10 bg-gradient-to-b from-amber-300 to-rose-400 rotate-[-22deg] origin-top-right -mr-1.5 shadow-sm" />
          <div className="w-2 h-3 bg-rose-500 rounded-xs border border-white rotate-[-22deg] -mr-3 shadow-xs" />
        </div>
      </div>

      <div className="absolute -top-1 left-2 text-[10px] text-pink-400 animate-pulse">✦</div>
      <div className="absolute -bottom-1 right-4 text-[10px] text-rose-300 animate-pulse">♫</div>
    </div>
  );
};

// Áp dụng cho theme Linen (Mocha) - Màu sắc hợp theme Linen mộc mạc ấm áp, giữ nguyên chuyển động
export const LinenVinylPlayer: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className="relative w-36 h-32 flex items-center justify-center select-none">
      {/* Vầng sáng hổ phách ấm áp theo theme Linen */}
      <div
        className={`absolute w-30 h-30 rounded-full blur-2xl pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-amber-700/25 via-orange-800/20 to-amber-700/25'
            : 'bg-gradient-to-r from-amber-200/50 via-orange-100/40 to-amber-200/50'
        }`}
      />

      {/* Bàn máy phát đĩa cố định tone Mộc / Linen */}
      <div
        className={`relative w-32 h-26 rounded-2xl border-2 p-2 shadow-xl flex items-center justify-center ${
          isDark
            ? 'bg-gradient-to-b from-[#2a1d15] to-[#18100b] border-amber-600/40 shadow-stone-950/70'
            : 'bg-gradient-to-b from-[#fdfbf7] to-[#f4ede3] border-amber-200/90 shadow-amber-900/10'
        }`}
      >
        {/* Đĩa vinyl xoay tròn 360 độ */}
        <div className="relative w-22 h-22 rounded-full shadow-2xl flex items-center justify-center overflow-hidden animate-[pink-spool-spin_3.5s_linear_infinite]">
          {/* Rãnh đĩa màu espresso / hổ phách trầm sang trọng */}
          <div
            className="w-full h-full rounded-full border border-amber-500/40 relative flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, #b45309 0%, #78350f 35%, #451a03 70%, #1c0e07 100%)',
            }}
          >
            {/* Các vòng rãnh âm thanh đồng tâm */}
            <div className="absolute inset-1 rounded-full border border-white/15" />
            <div className="absolute inset-2.5 rounded-full border border-white/15" />
            <div className="absolute inset-4 rounded-full border border-white/20" />
            <div className="absolute inset-6 rounded-full border border-white/20" />

            {/* Vệt phản quang quét qua đĩa vinyl */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-40"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.45) 45deg, transparent 90deg, transparent 180deg, rgba(255,255,255,0.45) 225deg, transparent 270deg)',
              }}
            />

            {/* Tem giấy tâm đĩa */}
            <div className="relative w-8 h-8 rounded-full bg-white dark:bg-stone-900 border border-amber-300 shadow-md flex items-center justify-center z-10">
              <div className="w-2 h-2 rounded-full bg-amber-600 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-white" />
              </div>
              <span className="absolute -top-0.5 text-[6px] text-amber-600 dark:text-amber-400 font-mono font-bold">♡</span>
            </div>
          </div>
        </div>

        {/* Cần kim phát nhạc (Tone arm) đặt trên rãnh đĩa */}
        <div className="absolute top-2 right-2 w-7 h-16 pointer-events-none flex flex-col items-end">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-100 via-amber-300 to-amber-400 border border-white shadow-xs z-20" />
          <div className="w-0.5 h-10 bg-gradient-to-b from-amber-300 to-amber-500 rotate-[-22deg] origin-top-right -mr-1.5 shadow-sm" />
          <div className="w-2 h-3 bg-amber-600 rounded-xs border border-white rotate-[-22deg] -mr-3 shadow-xs" />
        </div>
      </div>

      <div className="absolute -top-1 left-2 text-[10px] text-amber-400 animate-pulse">✦</div>
      <div className="absolute -bottom-1 right-4 text-[10px] text-amber-500/80 animate-pulse">♫</div>
    </div>
  );
};

// =========================================================================
// BĂNG CASSETTE RETRO (BẢN GỐC HỒNG & BẢN THEME PURPLE / AMETHYST)
// =========================================================================

export const PinkRetroCassette: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className="relative w-36 h-32 flex items-center justify-center select-none">
      {/* Vầng sáng nền */}
      <div
        className={`absolute w-32 h-24 rounded-2xl blur-2xl pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-pink-600/30 via-rose-500/25 to-pink-600/30'
            : 'bg-gradient-to-r from-pink-200/50 via-rose-200/40 to-pink-200/50'
        }`}
      />

      {/* Thân băng cassette */}
      <div
        className={`relative w-32 h-22 rounded-xl border-2 p-1.5 shadow-xl flex flex-col justify-between overflow-hidden ${
          isDark
            ? 'bg-gradient-to-b from-[#301625] via-[#220d19] to-[#180811] border-pink-400/50 shadow-pink-950/60'
            : 'bg-gradient-to-b from-[#fff0f6] via-[#ffe4ef] to-[#ffd1e3] border-pink-300 shadow-rose-200/60'
        }`}
      >
        {/* Nhãn Mixtape phía trên */}
        <div
          className={`w-full h-4.5 rounded-t-md px-2 flex items-center justify-between text-[8px] font-mono tracking-wider border-b ${
            isDark
              ? 'bg-pink-950/60 border-pink-500/30 text-pink-300'
              : 'bg-white/85 border-pink-200 text-rose-600 font-bold'
          }`}
        >
          <span>MIXTAPE ♡</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>PLAY</span>
          </span>
        </div>

        {/* Ô kính trong suốt chứa 2 bánh răng quay */}
        <div
          className={`w-full h-11 rounded-md border flex items-center justify-around px-2 relative overflow-hidden ${
            isDark
              ? 'bg-black/60 border-pink-500/25'
              : 'bg-white/65 border-pink-200/80 shadow-inner'
          }`}
        >
          {/* Dây băng từ tính nối giữa 2 bánh răng */}
          <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-rose-900/60 via-pink-900/40 to-rose-900/60 rounded-sm" />

          {/* Bánh răng trái (Quay thuận chiều kim đồng hồ) */}
          <div className="relative w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border-2 border-pink-400 shadow-md flex items-center justify-center animate-[pink-spool-spin_2.4s_linear_infinite] z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <div className="absolute w-full h-0.5 bg-pink-400" />
            <div className="absolute w-full h-0.5 bg-pink-400 rotate-60" />
            <div className="absolute w-full h-0.5 bg-pink-400 rotate-120" />
          </div>

          {/* Đồng hồ số Tape Counter */}
          <div className="flex flex-col items-center z-10 opacity-70">
            <span className="text-[7px] font-mono font-bold text-pink-500 dark:text-pink-300">04:20</span>
            <div className="w-3 h-0.5 bg-pink-400 rounded-full mt-0.5" />
          </div>

          {/* Bánh răng phải (Quay ngược chiều) */}
          <div className="relative w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border-2 border-pink-400 shadow-md flex items-center justify-center animate-[pink-spool-spin-reverse_2.4s_linear_infinite] z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <div className="absolute w-full h-0.5 bg-pink-400" />
            <div className="absolute w-full h-0.5 bg-pink-400 rotate-60" />
            <div className="absolute w-full h-0.5 bg-pink-400 rotate-120" />
          </div>
        </div>

        {/* 2 lỗ trục quay nhỏ phía dưới */}
        <div className="w-full flex items-center justify-around px-5 pb-0.5">
          <div className="w-2 h-2 rounded-full border border-pink-400/50 bg-black/40 flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-pink-400" />
          </div>
          <div className="w-2 h-2 rounded-full border border-pink-400/50 bg-black/40 flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-pink-400" />
          </div>
        </div>
      </div>

      {/* Nốt nhạc / hạt lấp lánh trang trí trôi xung quanh */}
      <div className="absolute -top-1 left-2 text-[10px] text-pink-400 animate-pulse">♫</div>
      <div className="absolute -bottom-1 right-3 text-[10px] text-rose-300 animate-pulse">♡</div>
    </div>
  );
};

// Áp dụng cho theme Purple (Amethyst) - Màu sắc hợp theme Purple huyền ảo cổ điển, giữ nguyên chuyển động
export const PurpleRetroCassette: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className="relative w-36 h-32 flex items-center justify-center select-none">
      {/* Vầng sáng tím thạch anh huyền ảo */}
      <div
        className={`absolute w-32 h-24 rounded-2xl blur-2xl pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-purple-600/30 via-fuchsia-500/25 to-purple-600/30'
            : 'bg-gradient-to-r from-purple-200/50 via-fuchsia-200/40 to-purple-200/50'
        }`}
      />

      {/* Thân băng cassette tone tím cổ điển */}
      <div
        className={`relative w-32 h-22 rounded-xl border-2 p-1.5 shadow-xl flex flex-col justify-between overflow-hidden ${
          isDark
            ? 'bg-gradient-to-b from-[#261033] via-[#1a0b23] to-[#120719] border-purple-400/50 shadow-purple-950/60'
            : 'bg-gradient-to-b from-[#faf5ff] via-[#f3e8ff] to-[#eedcfc] border-purple-300 shadow-purple-200/60'
        }`}
      >
        {/* Nhãn Mixtape phía trên */}
        <div
          className={`w-full h-4.5 rounded-t-md px-2 flex items-center justify-between text-[8px] font-mono tracking-wider border-b ${
            isDark
              ? 'bg-purple-950/60 border-purple-500/30 text-purple-300'
              : 'bg-white/85 border-purple-200 text-purple-700 font-bold'
          }`}
        >
          <span>MIXTAPE ♡</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span>PLAY</span>
          </span>
        </div>

        {/* Ô kính trong suốt chứa 2 bánh răng quay */}
        <div
          className={`w-full h-11 rounded-md border flex items-center justify-around px-2 relative overflow-hidden ${
            isDark
              ? 'bg-black/60 border-purple-500/25'
              : 'bg-white/65 border-purple-200/80 shadow-inner'
          }`}
        >
          {/* Dây băng từ tính nối giữa 2 bánh răng */}
          <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-purple-900/60 via-fuchsia-900/40 to-purple-900/60 rounded-sm" />

          {/* Bánh răng trái (Quay thuận chiều kim đồng hồ) */}
          <div className="relative w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border-2 border-purple-400 shadow-md flex items-center justify-center animate-[pink-spool-spin_2.4s_linear_infinite] z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <div className="absolute w-full h-0.5 bg-purple-400" />
            <div className="absolute w-full h-0.5 bg-purple-400 rotate-60" />
            <div className="absolute w-full h-0.5 bg-purple-400 rotate-120" />
          </div>

          {/* Đồng hồ số Tape Counter */}
          <div className="flex flex-col items-center z-10 opacity-70">
            <span className="text-[7px] font-mono font-bold text-purple-600 dark:text-purple-300">04:20</span>
            <div className="w-3 h-0.5 bg-purple-400 rounded-full mt-0.5" />
          </div>

          {/* Bánh răng phải (Quay ngược chiều) */}
          <div className="relative w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border-2 border-purple-400 shadow-md flex items-center justify-center animate-[pink-spool-spin-reverse_2.4s_linear_infinite] z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <div className="absolute w-full h-0.5 bg-purple-400" />
            <div className="absolute w-full h-0.5 bg-purple-400 rotate-60" />
            <div className="absolute w-full h-0.5 bg-purple-400 rotate-120" />
          </div>
        </div>

        {/* 2 lỗ trục quay nhỏ phía dưới */}
        <div className="w-full flex items-center justify-around px-5 pb-0.5">
          <div className="w-2 h-2 rounded-full border border-purple-400/50 bg-black/40 flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-purple-400" />
          </div>
          <div className="w-2 h-2 rounded-full border border-purple-400/50 bg-black/40 flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-purple-400" />
          </div>
        </div>
      </div>

      {/* Nốt nhạc / hạt lấp lánh trang trí trôi xung quanh */}
      <div className="absolute -top-1 left-2 text-[10px] text-purple-400 animate-pulse">♫</div>
      <div className="absolute -bottom-1 right-3 text-[10px] text-fuchsia-300 animate-pulse">♡</div>
    </div>
  );
};

// =========================================================================
// BÌNH THỦY TINH TRÁI TIM CHẤT LỎNG (BẢN GỐC HỒNG & BẢN THEME SAGE)
// =========================================================================

export interface PinkLiquidHeartProps {
  loadingProgress?: number; // Từ 0 đến 100
  isDark?: boolean;
}

export const PinkLiquidHeart: React.FC<PinkLiquidHeartProps> = ({
  loadingProgress = 0,
  isDark = false,
}) => {
  // Mực chất lỏng dâng từ đáy (offset 60px) lên đỉnh (0px)
  const liquidFillOffset = 60 * (1 - Math.min(100, Math.max(0, loadingProgress)) / 100);
  return (
    <div className="relative w-36 h-32 flex items-center justify-center select-none">
      {/* Vầng sáng hồng phía sau */}
      <div
        className={`absolute w-28 h-28 rounded-full blur-2xl pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-pink-600/35 via-rose-500/30 to-fuchsia-600/35'
            : 'bg-gradient-to-r from-pink-300/50 via-rose-300/40 to-pink-200/50'
        }`}
      />

      {/* Bình thủy tinh hình trái tim cố định */}
      <div className="relative w-28 h-26 flex items-center justify-center">
        <svg viewBox="0 0 100 90" className="w-28 h-26 drop-shadow-xl overflow-visible">
          <defs>
            {/* Khung cắt hình trái tim */}
            <clipPath id="pinkHeartLiquidClip">
              <path d="M50 82 C50 82, 10 52, 10 28 A20 20 0 0 1 50 20 A20 20 0 0 1 90 28 C90 52, 50 82, 50 82 Z" />
            </clipPath>

            {/* Gradient màu tầng sóng trước */}
            <linearGradient id="pinkFrontWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff70a6" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>

            {/* Gradient màu tầng sóng sau */}
            <linearGradient id="pinkBackWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb5d5" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.85" />
            </linearGradient>

            {/* Viền ánh kim thủy tinh */}
            <linearGradient id="pinkHeartRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#f472b6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#db2777" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Đáy bình trái tim */}
          <path
            d="M50 82 C50 82, 10 52, 10 28 A20 20 0 0 1 50 20 A20 20 0 0 1 90 28 C90 52, 50 82, 50 82 Z"
            fill={isDark ? '#29101f' : '#fff0f6'}
          />

          {/* VÙNG CHẤT LỎNG DÂU ĐƯỢC CLIP BÊN TRONG */}
          <g clipPath="url(#pinkHeartLiquidClip)">
            <g
              style={{
                transform: `translateY(${liquidFillOffset}px)`,
                transition: 'transform 80ms linear',
              }}
            >
              <g className="animate-[pink-liquid-rise_3.6s_ease-in-out_infinite]">
                {/* Sóng sau (chạy sang phải) */}
                <path
                  d="M-100 16 Q-75 10, -50 16 T0 16 T50 16 T100 16 T150 16 T200 16 V120 H-100 Z"
                  fill="url(#pinkBackWaveGrad)"
                  className="animate-[pink-wave-reverse_3.2s_linear_infinite]"
                />

                {/* Sóng trước (chạy sang trái) */}
                <path
                  d="M-100 20 Q-75 14, -50 20 T0 20 T50 20 T100 20 T150 20 T200 20 V120 H-100 Z"
                  fill="url(#pinkFrontWaveGrad)"
                  className="animate-[pink-wave-horizontal_2.4s_linear_infinite]"
                />

                {/* Bọt khí dâu sữa bay lên */}
                <circle cx="36" cy="32" r="2.2" fill="#ffffff" className="animate-[pink-sparkle-rise_2.2s_infinite]" />
                <circle cx="50" cy="46" r="1.8" fill="#ffffff" className="animate-[pink-sparkle-rise_2.8s_infinite_400ms]" />
                <circle cx="64" cy="28" r="2" fill="#ffffff" className="animate-[pink-sparkle-rise_2s_infinite_800ms]" />
                <circle cx="44" cy="62" r="1.5" fill="#ffffff" className="animate-[pink-sparkle-rise_3s_infinite_1200ms]" />
                <circle cx="56" cy="38" r="2.2" fill="#ffffff" className="animate-[pink-sparkle-rise_2.5s_infinite_600ms]" />
              </g>
            </g>
          </g>

          {/* Vành thủy tinh 3D */}
          <path
            d="M50 82 C50 82, 10 52, 10 28 A20 20 0 0 1 50 20 A20 20 0 0 1 90 28 C90 52, 50 82, 50 82 Z"
            fill="none"
            stroke="url(#pinkHeartRimGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vết loé sáng bóng bẩy trên mặt kính */}
          <path
            d="M20 28 A12 12 0 0 1 42 22"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.85"
          />
          <circle cx="46" cy="23" r="1.5" fill="#ffffff" opacity="0.9" />
        </svg>

        <div className="absolute -top-1 right-1 text-[11px] text-pink-400 animate-pulse">✨</div>
        <div className="absolute -bottom-1 left-2 text-[10px] text-rose-300 animate-pulse">♡</div>
      </div>
    </div>
  );
};

// Áp dụng cho theme Sage - Bình thủy tinh hình trái tim chất lỏng xanh sage trung tính, nhẹ nhàng dịu mắt
export const SageLiquidHeart: React.FC<PinkLiquidHeartProps> = ({
  loadingProgress = 0,
  isDark = false,
}) => {
  // Mực chất lỏng dâng từ đáy (offset 60px) lên đỉnh (0px)
  const liquidFillOffset = 60 * (1 - Math.min(100, Math.max(0, loadingProgress)) / 100);
  return (
    <div className="relative w-36 h-32 flex items-center justify-center select-none">
      {/* Vầng sáng xanh sage trung tính, dịu êm phía sau */}
      <div
        className={`absolute w-28 h-28 rounded-full blur-2xl pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-[#466244]/25 via-[#354f34]/20 to-[#466244]/25'
            : 'bg-gradient-to-r from-[#cad8c6]/45 via-[#dbe7d7]/35 to-[#cad8c6]/45'
        }`}
      />

      {/* Bình thủy tinh hình trái tim cố định */}
      <div className="relative w-28 h-26 flex items-center justify-center">
        <svg viewBox="0 0 100 90" className="w-28 h-26 drop-shadow-xl overflow-visible">
          <defs>
            {/* Khung cắt hình trái tim */}
            <clipPath id="sageHeartLiquidClip">
              <path d="M50 82 C50 82, 10 52, 10 28 A20 20 0 0 1 50 20 A20 20 0 0 1 90 28 C90 52, 50 82, 50 82 Z" />
            </clipPath>

            {/* Gradient màu tầng sóng trước - Tông xanh sage trung tính, êm dịu */}
            <linearGradient id="sageFrontWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b5c7b3" />
              <stop offset="50%" stopColor="#98b894" />
              <stop offset="100%" stopColor="#557752" />
            </linearGradient>

            {/* Gradient màu tầng sóng sau - Xanh sage pastel nhẹ nhàng */}
            <linearGradient id="sageBackWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbe7d7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#b3c7b0" stopOpacity="0.85" />
            </linearGradient>

            {/* Viền ánh kim thủy tinh - Xanh sage ngọc mờ tao nhã */}
            <linearGradient id="sageHeartRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#cad8c6" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#678564" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Đáy bình trái tim - Màu sắc trung tính dịu nhẹ theo chế độ sáng/tối */}
          <path
            d="M50 82 C50 82, 10 52, 10 28 A20 20 0 0 1 50 20 A20 20 0 0 1 90 28 C90 52, 50 82, 50 82 Z"
            fill={isDark ? '#131e15' : '#f4f7f3'}
          />

          {/* VÙNG CHẤT LỎNG XANH SAGE ĐƯỢC CLIP BÊN TRONG */}
          <g clipPath="url(#sageHeartLiquidClip)">
            <g
              style={{
                transform: `translateY(${liquidFillOffset}px)`,
                transition: 'transform 80ms linear',
              }}
            >
              <g className="animate-[pink-liquid-rise_3.6s_ease-in-out_infinite]">
                {/* Sóng sau (chạy sang phải) */}
                <path
                  d="M-100 16 Q-75 10, -50 16 T0 16 T50 16 T100 16 T150 16 T200 16 V120 H-100 Z"
                  fill="url(#sageBackWaveGrad)"
                  className="animate-[pink-wave-reverse_3.2s_linear_infinite]"
                />

                {/* Sóng trước (chạy sang trái) */}
                <path
                  d="M-100 20 Q-75 14, -50 20 T0 20 T50 20 T100 20 T150 20 T200 20 V120 H-100 Z"
                  fill="url(#sageFrontWaveGrad)"
                  className="animate-[pink-wave-horizontal_2.4s_linear_infinite]"
                />

                {/* Bọt khí tinh khiết bay lên */}
                <circle cx="36" cy="32" r="2.2" fill="#ffffff" className="animate-[pink-sparkle-rise_2.2s_infinite]" />
                <circle cx="50" cy="46" r="1.8" fill="#ffffff" className="animate-[pink-sparkle-rise_2.8s_infinite_400ms]" />
                <circle cx="64" cy="28" r="2" fill="#ffffff" className="animate-[pink-sparkle-rise_2s_infinite_800ms]" />
                <circle cx="44" cy="62" r="1.5" fill="#ffffff" className="animate-[pink-sparkle-rise_3s_infinite_1200ms]" />
                <circle cx="56" cy="38" r="2.2" fill="#ffffff" className="animate-[pink-sparkle-rise_2.5s_infinite_600ms]" />
              </g>
            </g>
          </g>

          {/* Vành thủy tinh 3D */}
          <path
            d="M50 82 C50 82, 10 52, 10 28 A20 20 0 0 1 50 20 A20 20 0 0 1 90 28 C90 52, 50 82, 50 82 Z"
            fill="none"
            stroke="url(#sageHeartRimGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vết loé sáng bóng bẩy trên mặt kính */}
          <path
            d="M20 28 A12 12 0 0 1 42 22"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.85"
          />
          <circle cx="46" cy="23" r="1.5" fill="#ffffff" opacity="0.9" />
        </svg>

        <div className="absolute -top-1 right-1 text-[11px] text-[#98b894] animate-pulse">✨</div>
        <div className="absolute -bottom-1 left-2 text-[10px] text-[#7d9e7a] animate-pulse">♡</div>
      </div>
    </div>
  );
};

// THEME BERRY: Biểu tượng Kính Vạn Hoa Hoa Tuyết (Snowflake Kaleidoscope) với 2 tầng cánh xoay đảo chiều
export interface SnowflakeKaleidoscopeProps {
  isDarkEffective?: boolean;
}

export const SnowflakeKaleidoscopeLoading: React.FC<SnowflakeKaleidoscopeProps> = ({
  isDarkEffective = false,
}) => {
  // Sắc thái màu Theme Berry thích ứng chế độ Sáng / Tối
  const sf1Color = isDarkEffective ? '#ba3859' : '#cc7b8f';
  const sf2Color = isDarkEffective ? '#ead4d7' : '#de9fb0';
  const circleBg = isDarkEffective ? '#26101c' : '#fff5f9';
  const circleStroke = isDarkEffective ? '#ba3859' : '#cc7b8f';
  const dashStroke = isDarkEffective ? '#84334b' : '#f4d8df';
  const coreFill = isDarkEffective ? '#ba3859' : '#cc7b8f';

  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center select-none">
      {/* Vầng hào quang berry xung quanh */}
      <div
        className={`absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-500 ${
          isDarkEffective ? 'bg-[#ba3859]/25' : 'bg-[#ead4d7]/40'
        }`}
      />
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xs overflow-visible relative z-10"
      >
        <defs>
          {/* ❄️ CÁNH BÔNG TUYẾT 1 (Bông lớn bên ngoài): Trục dài vươn tới y=14, có hình thoi & chấm ngọc ở đỉnh */}
          <g id="miniSf1">
            {/* Trục thân cánh tuyết */}
            <line x1="50" y1="50" x2="50" y2="14" stroke={sf1Color} strokeWidth="2.2" strokeLinecap="round" />
            {/* Nhánh chữ V xòe ở thân */}
            <path d="M42 26 L50 33 L58 26" fill="none" stroke={sf1Color} strokeWidth="1.8" strokeLinecap="round" />
            {/* Mũi thoi kim cương ở đầu ngọn */}
            <polygon points="50,10 46,15 50,20 54,15" fill={sf1Color} />
            {/* Hạt ngọc trắng phát sáng trên đỉnh chóp */}
            <circle cx="50" cy="9" r="1.3" fill="#ffffff" />
          </g>

          {/* ❄️ CÁNH BÔNG TUYẾT 2 (Bông nhỏ lồng bên trong): Trục ngắn hơn tới y=24 */}
          <g id="miniSf2">
            {/* Trục thân cánh tuyết trong */}
            <line x1="50" y1="50" x2="50" y2="24" stroke={sf2Color} strokeWidth="1.8" strokeLinecap="round" />
            {/* Nhánh chữ V xòe ở tầng trong */}
            <path d="M44 32 L50 38 L56 32" fill="none" stroke={sf2Color} strokeWidth="1.6" strokeLinecap="round" />
            {/* Hạt ngọc trắng ở đầu ngọn */}
            <circle cx="50" cy="23" r="1.2" fill="#ffffff" />
          </g>
        </defs>

        {/* Vòng nền tròn thích ứng chế độ Sáng / Tối */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill={circleBg}
          stroke={circleStroke}
          strokeWidth="2.2"
        />
        {/* Vòng nét đứt trang trí bên trong */}
        <circle
          cx="50"
          cy="50"
          r="39"
          fill="none"
          stroke={dashStroke}
          strokeWidth="0.8"
          strokeDasharray="3 3"
        />

        {/* 1. BÔNG TUYẾT 1 (Xoay xuôi chiều kim đồng hồ 12s) */}
        <g className="animate-[pink-spool-spin_12s_linear_infinite] origin-[50px_50px]">
          <use href="#miniSf1" />
          <use href="#miniSf1" transform="rotate(60 50 50)" />
          <use href="#miniSf1" transform="rotate(120 50 50)" />
          <use href="#miniSf1" transform="rotate(180 50 50)" />
          <use href="#miniSf1" transform="rotate(240 50 50)" />
          <use href="#miniSf1" transform="rotate(300 50 50)" />
        </g>

        {/* 2. BÔNG TUYẾT 2 (Xoay ngược chiều kim đồng hồ 8s) */}
        <g className="animate-[pink-spool-spin-reverse_8s_linear_infinite] origin-[50px_50px]">
          <use href="#miniSf2" />
          <use href="#miniSf2" transform="rotate(60 50 50)" />
          <use href="#miniSf2" transform="rotate(120 50 50)" />
          <use href="#miniSf2" transform="rotate(180 50 50)" />
          <use href="#miniSf2" transform="rotate(240 50 50)" />
          <use href="#miniSf2" transform="rotate(300 50 50)" />
        </g>

        {/* 3. NHỤY TRUNG TÂM CỐ ĐỊNH (Điểm tựa thị giác) */}
        <circle
          cx="50"
          cy="50"
          r="2.8"
          fill={coreFill}
          stroke="#ffffff"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

export const RandomNovelPicker: React.FC<RandomNovelPickerProps> = ({
  novels,
  onSelectNovel,
  theme,
  isDarkMode,
}) => {
  const [scene, setScene] = useState<PickerScene>('idle');
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(() => {
    return novels && novels.length > 0 ? novels[0] : null;
  });
  const [loadingProgress, setLoadingProgress] = useState(0);

  const autoFinishTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isDarkEffective = theme === 'cosmic' || isDarkMode;
  const activeVisual = getThemeVisualOption(theme);
  const bannerPalette = getBannerThemePalette(theme, isDarkEffective);
  const themePickerStyles = getThemePickerStyles(theme, isDarkEffective);
  const cordStyles = getHangingCordStyles(theme, isDarkEffective);
  const sugarConfig = getSugarThemeConfig(theme, isDarkEffective);

  // Hiệu ứng dâng chất lỏng mượt mà trong lúc chờ chọn (~4.2s)
  useEffect(() => {
    if (scene !== 'waiting') {
      setLoadingProgress(0);
      return;
    }
    const startTime = Date.now();
    const duration = 4200;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setLoadingProgress(progress);
      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [scene]);

  // Dọn dẹp timer khi unmount
  useEffect(() => {
    return () => {
      if (autoFinishTimerRef.current) clearTimeout(autoFinishTimerRef.current);
    };
  }, []);

  const [isExitingPicked, setIsExitingPicked] = useState(false);
  const [isEnteringFromPicked, setIsEnteringFromPicked] = useState(false);

  // Bắt đầu quá trình chọn ngẫu nhiên (Chuyển sang Khung cảnh 2: Chờ chọn ~4.2 giây)
  const handleStartPicking = () => {
    setIsExitingPicked(false);
    setIsEnteringFromPicked(false);
    setScene('waiting');

    const WAIT_DURATION = 4200; // Đợi ~4.2s theo yêu cầu

    // Tự động kết thúc để chuyển sang Khung cảnh 3 (Đã chọn xong)
    if (autoFinishTimerRef.current) clearTimeout(autoFinishTimerRef.current);
    autoFinishTimerRef.current = setTimeout(() => {
      finalizeSelection();
    }, WAIT_DURATION);
  };

  // Hoàn tất chọn truyện -> chuyển sang Khung cảnh 3
  const finalizeSelection = () => {
    if (novels && novels.length > 0) {
      const randomIndex = Math.floor(Math.random() * novels.length);
      const picked = novels[randomIndex];
      setSelectedNovel(picked);
    }
    setScene('picked');
  };

  const handleOpenNovel = (novel: Novel) => {
    onSelectNovel(novel);
  };

  const handleReroll = () => {
    handleStartPicking();
  };

  // Chuyển mượt mà từ Khung cảnh 3 về Khung cảnh 1 bằng hiệu ứng Lật thẻ bài 3D (3D Tarot Flip)
  const handleResetToIdle = () => {
    if (autoFinishTimerRef.current) clearTimeout(autoFinishTimerRef.current);
    if (scene === 'picked') {
      setIsExitingPicked(true);
      setTimeout(() => {
        setScene('idle');
        setIsExitingPicked(false);
        setIsEnteringFromPicked(true);
        setTimeout(() => {
          setIsEnteringFromPicked(false);
        }, 500);
      }, 320);
    } else {
      setScene('idle');
    }
  };

  // -------------------------------------------------------------
  // RENDER ICON CHO KHUNG ẢNH 2 THEO TỪNG THEME:
  // 1 theme sử dụng 1 icon:
  // - Cosmic -> Cổng Thời Không (bỏ biểu tượng ngôi sao trong khối tròn)
  // - Amethyst -> Lá Bài Vận Mệnh (thêm flip animation)
  // - Mocha / Notebook -> Đồng Hồ Cát (cát phát sáng)
  // - Slate / Sage -> Thiên Cầu Tinh Tọa (các vành quỹ đạo kim hoàn)
  // Màu sắc phù hợp hoàn hảo với theme chế độ sáng tối
  // -------------------------------------------------------------
  const renderThemeIcon = () => {
    switch (activeVisual) {
      case 'snowflake-kaleidoscope':
      case 'lululemon-zen':
        // THEME BERRY: Kính vạn hoa hoa tuyết hai chiều (Snowflake Kaleidoscope)
        return <SnowflakeKaleidoscopeLoading isDarkEffective={isDarkEffective} />;

      case 'vinyl-player':
        // THEME LINEN (mocha): Loading lớn dạng xoắn ốc cho cả chế độ sáng và tối, đổi màu phù hợp theme linen
        return <LinenSpiralVortexLoading isDarkEffective={isDarkEffective} />;

      case 'cassette':
        // THEME PURPLE (amethyst-haze): Băng Cassette Retro với 2 bánh răng quay mượt, tone tím thạch anh
        return <PurpleRetroCassette isDark={isDarkEffective} />;

      case 'stargate':
        // CỔNG THỜI KHÔNG (Bỏ biểu tượng ngôi sao trong khối tròn)
        return (
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Lớp hào quang không gian sau cổng */}
            <div
              className={`absolute -inset-2 rounded-full blur-xl animate-pulse ${
                isDarkEffective
                  ? 'bg-gradient-to-tr from-cyan-500/30 via-indigo-600/40 to-fuchsia-500/30'
                  : 'bg-gradient-to-tr from-cyan-400/25 via-indigo-400/30 to-purple-400/25'
              }`}
            />

            {/* Vành cổng xoay tròn */}
            <div
              className={`absolute inset-1 rounded-full border-2 border-dashed animate-[spin_10s_linear_infinite] ${
                isDarkEffective ? 'border-cyan-400/60' : 'border-indigo-500/60'
              }`}
            />
            <div
              className={`absolute inset-2.5 rounded-full border animate-[spin_14s_linear_infinite_reverse] ${
                isDarkEffective ? 'border-purple-400/40' : 'border-purple-400/50'
              }`}
            />

            {/* Mấu năng lượng thời không */}
            <div className="absolute -top-0.5 w-3 h-1.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
            <div className="absolute -bottom-0.5 w-3 h-1.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
            <div className="absolute -left-0.5 h-3 w-1.5 bg-purple-400 rounded-xs shadow-[0_0_6px_#c084fc]" />
            <div className="absolute -right-0.5 h-3 w-1.5 bg-purple-400 rounded-xs shadow-[0_0_6px_#c084fc]" />

            {/* Khối tròn hố sâu không gian (Vortex sâu thẳm - ĐÃ BỎ NGÔI SAO THEO YÊU CẦU) */}
            <div
              className={`relative w-18 h-18 rounded-full p-1.5 flex items-center justify-center overflow-hidden shadow-lg ${
                isDarkEffective
                  ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-black shadow-cyan-500/30'
                  : 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 shadow-indigo-500/30'
              }`}
            >
              {/* Lớp xoáy năng lượng vặn xoắn đa chiều */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_20%,rgba(168,85,247,0.45)_60%,rgba(34,211,238,0.7)_100%)] animate-[spin_4s_linear_infinite]" />
              <div className="w-13 h-13 rounded-full border-t-2 border-r-2 border-cyan-300 border-b-transparent border-l-pink-400 animate-[spin_2.5s_linear_infinite]" />

              {/* Tâm hố đen ngưng đọng - thuần không gian ma thuật, không có ngôi sao */}
              <div className="absolute w-7 h-7 rounded-full bg-black border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-pulse" />
            </div>

            {/* Hạt bụi photon phát quang */}
            <div className="absolute -top-1 right-2 text-[9px] text-cyan-300 animate-ping">✦</div>
            <div className="absolute -bottom-1 left-2 text-[9px] text-purple-300 animate-pulse">✧</div>
          </div>
        );

      case 'hourglass':
        // ĐỒNG HỒ CÁT (Cát phát sáng, nhún nhảy nhịp nhàng)
        return (
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div
              className={`absolute -inset-2 rounded-full blur-xl animate-pulse ${
                isDarkEffective
                  ? 'bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-orange-500/30'
                  : 'bg-gradient-to-r from-amber-400/25 via-yellow-300/35 to-orange-300/25'
              }`}
            />

            <div className="relative z-10 animate-bounce transition-transform duration-500 flex items-center justify-center">
              {/* Vòng quay thời gian */}
              <div
                className={`absolute w-24 h-24 rounded-full border border-dashed animate-[spin_8s_linear_infinite] ${
                  isDarkEffective ? 'border-amber-400/40' : 'border-amber-500/40'
                }`}
              />

              <svg
                viewBox="0 0 80 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-20 drop-shadow-[0_4px_14px_rgba(245,158,11,0.45)]"
              >
                {/* Nắp trên và đế dưới */}
                <rect
                  x="18"
                  y="10"
                  width="44"
                  height="6"
                  rx="3"
                  fill={isDarkEffective ? '#f59e0b' : '#d97706'}
                  stroke={isDarkEffective ? '#b45309' : '#92400e'}
                  strokeWidth="1.5"
                />
                <rect
                  x="18"
                  y="84"
                  width="44"
                  height="6"
                  rx="3"
                  fill={isDarkEffective ? '#f59e0b' : '#d97706'}
                  stroke={isDarkEffective ? '#b45309' : '#92400e'}
                  strokeWidth="1.5"
                />
                {/* Trụ kim loại 2 bên */}
                <line x1="22" y1="16" x2="22" y2="84" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="58" y1="16" x2="58" y2="84" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />

                {/* Bầu thủy tinh */}
                <path
                  d="M26 16C26 38 37 46 37 50C37 54 26 62 26 84H54C54 62 43 54 43 50C43 46 54 38 54 16H26Z"
                  fill="url(#glassGradTheme)"
                  stroke={isDarkEffective ? '#fed7aa' : '#fbbf24'}
                  strokeWidth="1.5"
                  opacity="0.85"
                />

                {/* Cát bầu trên đang vơi */}
                <path d="M30 30C30 39 37 48 40 49C43 48 50 39 50 30H30Z" fill="#fde047" opacity="0.9" />

                {/* Dòng cát stardust đang rơi */}
                <line
                  x1="40"
                  y1="48"
                  x2="40"
                  y2="76"
                  stroke="#fef08a"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                  className="animate-pulse"
                />

                {/* Cát bầu dưới đang vun đầy */}
                <path d="M28 84C32 75 48 75 52 84H28Z" fill="#f59e0b" />

                <defs>
                  <linearGradient id="glassGradTheme" x1="20%" y1="10%" x2="80%" y2="90%">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity={isDarkEffective ? '0.3' : '0.2'} />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity={isDarkEffective ? '0.2' : '0.15'} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={isDarkEffective ? '0.35' : '0.2'} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        );

      case 'tarot':
        // LÁ BÀI VẬN MỆNH (Có Flip Animation 3D liên tục mượt mà)
        return (
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div
              className={`absolute -inset-2 rounded-full blur-xl animate-pulse ${
                isDarkEffective
                  ? 'bg-gradient-to-r from-purple-500/35 via-pink-500/35 to-indigo-500/35'
                  : 'bg-gradient-to-r from-purple-400/25 via-pink-300/30 to-indigo-300/25'
              }`}
            />

            {/* Vành ma pháp bao quanh lá bài */}
            <div
              className={`absolute w-24 h-24 rounded-full border border-dashed animate-[spin_10s_linear_infinite] ${
                isDarkEffective ? 'border-purple-400/40' : 'border-purple-500/40'
              }`}
            />

            {/* FLIP CARD CONTAINER (3D Flip Animation) */}
            <div className="relative z-10 w-16 h-22 [perspective:1000px]">
              <div
                className="w-full h-full relative [transform-style:preserve-3d] animate-[tarotFlip_3.6s_ease-in-out_infinite]"
                style={{
                  transformOrigin: 'center center',
                }}
              >
                {/* MẶT TRƯỚC LÁ BÀI (Front Face) */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-lg border-2 p-1.5 flex flex-col items-center justify-between shadow-xl [backface-visibility:hidden] ${
                    isDarkEffective
                      ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-black border-amber-300/90 shadow-purple-900/60'
                      : 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border-amber-300 shadow-indigo-400/40 text-white'
                  }`}
                >
                  <div className="w-full h-full rounded border border-amber-200/40 flex flex-col items-center justify-between p-1">
                    <div className="w-full flex items-center justify-between text-[7px] text-amber-300">
                      <span>✦</span>
                      <span>✧</span>
                    </div>

                    {/* Vầng trăng khuyết và sao vận mệnh */}
                    <div className="relative flex items-center justify-center">
                      <svg viewBox="0 0 40 40" className="w-7 h-7 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.9)]">
                        <path
                          d="M26 8C19 8 13 14 13 21C13 28 19 34 26 34C20 32 16 26 16 21C16 16 20 10 26 8Z"
                          fill="#fde047"
                        />
                        <polygon points="26,14 28,19 33,21 28,23 26,28 24,23 19,21 24,19" fill="#ffffff" />
                      </svg>
                    </div>

                    <div className="w-full flex items-center justify-between text-[7px] text-amber-300">
                      <span>✧</span>
                      <span>✦</span>
                    </div>
                  </div>
                </div>

                {/* MẶT SAU LÁ BÀI (Back Face - rotated 180deg) */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-lg border-2 p-1.5 flex flex-col items-center justify-center shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    isDarkEffective
                      ? 'bg-gradient-to-br from-purple-950 via-slate-900 to-black border-amber-400/80'
                      : 'bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 border-amber-400 text-white'
                  }`}
                >
                  <div className="w-full h-full rounded border border-amber-300/40 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.25)_0%,transparent_70%)]">
                    <div className="text-amber-300 text-center font-serif text-lg tracking-wider">
                      ✦
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'snowflake':
        // THEME FROST (slate-haze):
        // Đồng bộ loading lớn SvgWreathProgressBloom cho cả chế độ sáng và chế độ tối, đổi màu phù hợp
        return <SvgWreathProgressBloom size={240} isDarkEffective={isDarkEffective} />;

      case 'pixel-hourglass':
      case 'eclipse':
        // THEME WHITE (notebook): Vật Trang Trí: Đồng Hồ Cát Trái Tim Pixel (Pixel Heart Hourglass)
        return <PixelHeartHourglass isDarkEffective={isDarkEffective} />;

      case 'astrolabe':
      default:
        // THIÊN CẦU TINH TỌA (Các vòng quỹ đạo kim hoàn)
        return (
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div
              className={`absolute -inset-2 rounded-full blur-xl animate-pulse ${
                isDarkEffective
                  ? 'bg-gradient-to-r from-amber-500/30 via-teal-500/30 to-cyan-500/30'
                  : 'bg-gradient-to-r from-amber-400/25 via-teal-400/25 to-sky-400/25'
              }`}
            />

            <div className="relative z-10 w-24 h-24 flex items-center justify-center">
              {/* Vòng ngoài cùng */}
              <div
                className={`absolute inset-0 rounded-full border-2 animate-[spin_10s_linear_infinite] ${
                  isDarkEffective ? 'border-amber-400/70' : 'border-amber-500/70'
                }`}
              />

              {/* Vòng nghiêng 45 độ */}
              <div
                className={`absolute inset-2 rounded-full border border-dashed animate-[spin_7s_linear_infinite_reverse] rotate-45 ${
                  isDarkEffective ? 'border-teal-300/80' : 'border-teal-500/80'
                }`}
              />

              {/* Vòng elip trong */}
              <div
                className={`absolute inset-4 rounded-full border-2 -rotate-45 animate-[spin_5s_linear_infinite] ${
                  isDarkEffective ? 'border-amber-500/60' : 'border-amber-600/60'
                }`}
              />

              {/* Tinh cầu trung tâm */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full shadow-lg border border-white flex items-center justify-center animate-pulse ${
                  isDarkEffective
                    ? 'bg-gradient-to-tr from-amber-600 via-yellow-300 to-white shadow-amber-500/80'
                    : 'bg-gradient-to-tr from-amber-500 via-amber-200 to-white shadow-amber-500/60'
                }`}
              >
                <Compass className="w-4 h-4 text-amber-950 animate-spin" />
              </div>

              {/* Nốt hành tinh vệ tinh */}
              <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9] animate-ping" />
              <div className="absolute bottom-2 right-3 w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_6px_#f472b6] animate-pulse" />
            </div>
          </div>
        );

      case 'liquid-heart':
      case 'pouring-cup':
        // THEME SAGE: Bình thủy tinh hình trái tim chất lỏng dâng dần theo tiến độ
        return <SageLiquidHeart loadingProgress={loadingProgress} isDark={isDarkEffective} />;
    }
  };

  // -------------------------------------------------------------
  // KHUNG CẢNH 3: ĐÃ CHỌN XONG TRUYỆN (Ảnh 3: Tràn viền Full-Bleed)
  // - Bỏ "Duyên phận đã chọn"
  // - Bỏ "Truyện Dịch • "
  // - "Quay lại chọn cuốn khác" -> "Chọn truyện khác"
  // - "Về ban đầu" -> "Quay lại"
  // -------------------------------------------------------------
  if (scene === 'picked' && selectedNovel) {
    return (
      <div className={`w-full ${isExitingPicked ? 'anim-picker-flip-out' : 'animate-picker-fade-in'}`}>
        {/* Full-Bleed Card - Áp dụng Neumorphism sang trọng */}
        <div
          className={`relative w-full rounded-[28px] sm:rounded-[32px] overflow-hidden border transition-all duration-300 min-h-[460px] sm:min-h-[500px] flex flex-col justify-between ${
            isDarkEffective
              ? 'border-white/[0.08] bg-neutral-950'
              : 'border-black/[0.04] bg-neutral-900'
          }`}
          style={{
            boxShadow: isDarkEffective
              ? '0 6px 22px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.14), inset 0 -1px 2px rgba(0, 0, 0, 0.25)'
              : '0 6px 22px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Full-bleed Cover Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={getDirectImageUrl(selectedNovel.coverImage, selectedNovel.id || selectedNovel.title)}
              onError={(e) => handleCoverImageError(e, selectedNovel.id || selectedNovel.title)}
              alt={selectedNovel.title}
              className="w-full h-full object-cover object-center scale-105 filter brightness-[0.92]"
              referrerPolicy="no-referrer"
            />
            {/* Subtle top shade */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            {/* Deep dark gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/85 via-45% to-transparent pointer-events-none" />
          </div>

          {/* Top Header Row (Trống gọn gàng, đã loại bỏ nút tim) */}
          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-end h-10" />

          {/* Bottom Area (Title, Subtitle, Tags, Action Buttons) */}
          <div className="relative z-10 p-5 sm:p-6 space-y-3.5 pt-12">
            {/* Novel Title & Author (Chỉ hiển thị tác giả, không hiển thị thể loại/tags) */}
            <div className="space-y-1">
              <h3
                onClick={() => handleOpenNovel(selectedNovel)}
                className={`text-xl sm:text-2xl font-source-serif font-bold text-white tracking-tight leading-snug line-clamp-2 drop-shadow-md cursor-pointer transition-colors ${themePickerStyles.titleHover}`}
              >
                {selectedNovel.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 font-source-serif font-medium line-clamp-1 drop-shadow-sm">
                Tác giả: {selectedNovel.author.name}
              </p>
            </div>

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-xs font-medium text-neutral-200">
              <div className="inline-flex items-center gap-1.5">
                <Tag className={`w-3.5 h-3.5 ${themePickerStyles.metaIcon}`} />
                <span>
                  {selectedNovel.totalChaptersCount || selectedNovel.chapters?.length || '1,000+'} chương
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Compass className={`w-3.5 h-3.5 ${themePickerStyles.metaIcon}`} />
                <span>{selectedNovel.status === 'completed' ? 'Đã hoàn thành' : 'Đang cập nhật'}</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-1 space-y-2">
              <button
                onClick={() => handleOpenNovel(selectedNovel)}
                className={`w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base transition-all flex items-center justify-center cursor-pointer select-none active:translate-y-[1px] ${
                  themePickerStyles.primaryBtn
                } shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(0,0,0,0.2)] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.55),inset_0_-1px_1px_rgba(255,255,255,0.1)]`}
              >
                <span>ĐỌC TRUYỆN</span>
              </button>

              {/* Secondary Option: "Chọn truyện khác" & "Quay lại" */}
              <div className="flex items-center justify-between px-1 pt-1">
                <button
                  onClick={handleReroll}
                  className="text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer py-1.5 px-3 rounded-full hover:bg-white/10 active:translate-y-[0.5px] font-medium"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${themePickerStyles.rerollIcon}`} />
                  <span>Chọn truyện khác</span>
                </button>

                <button
                  onClick={handleResetToIdle}
                  className="text-xs text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer py-1.5 px-3 rounded-full hover:bg-white/10 active:translate-y-[0.5px]"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // KHUNG CẢNH 2: CHỜ CHỌN (Tạo chuẩn như hình mẫu người dùng gửi)
  // - Bỏ 2 nút bên phải (nút trăng & nút check)
  // - Màu sắc phù hợp theme chế độ sáng tối
  // - 1 theme dùng 1 icon (cổng thời không, đồng hồ cát, lá bài vận mệnh flip, thiên cầu tinh tọa)
  // - Tiêu đề: "Đang tìm truyện cho bạn"
  // - Dấu 3 chấm: bouncing-dots
  // - Trạng thái: "Sắp xong..."
  // -------------------------------------------------------------
  if (scene === 'waiting') {
    return (
      <div className="w-full">
        {/* Khung cảnh 2 - Áp dụng Neumorphism tương tự mục Truyện Vừa Mới Đăng */}
        <div
          className={`relative w-full rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[360px] sm:min-h-[400px] border ${
            getRandomPickerCardBg(theme, isDarkEffective)
          } ${
            isDarkEffective ? 'border-white/[0.07]' : 'border-black/[0.04]'
          }`}
          style={
            isDarkEffective
              ? {
                  boxShadow:
                    '0 6px 20px rgba(0, 0, 0, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.12), inset 0 -1px 2px rgba(0, 0, 0, 0.22)',
                }
              : {
                  backgroundImage: `radial-gradient(${getPickerDotColor(theme, isDarkEffective)} 1.2px, transparent 1.2px)`,
                  backgroundSize: '18px 18px',
                  boxShadow:
                    '0 6px 20px rgba(0, 0, 0, 0.045), inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(0, 0, 0, 0.02)',
                }
          }
        >
          {/* Vùng Icon minh họa của theme (Đã bỏ hiệu ứng Neumorphism theo yêu cầu) */}
          <div className="mb-2 flex items-center justify-center">
            {renderThemeIcon()}
          </div>

          {/* Nội dung bên dưới: Tiêu đề "Đang tìm truyện cho bạn" */}
          <div className="space-y-3 max-w-xs sm:max-w-sm mt-1">
            <h3
              className={`text-xl sm:text-2xl font-source-serif font-extrabold tracking-tight ${
                isDarkEffective ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Đang tìm truyện cho bạn
            </h3>

            {/* Vùng loading tùy biến theo từng theme:
                - Frost (slate-haze): icon ❄️ xoay chuyển động mượt mà liên tục
                - White (notebook): icon đồng hồ cát pixel & trái tim xoay chuyển động nhẹ nhàng
                - Các theme khác: bouncing dots thanh lịch
            */}
            <div className="flex items-center justify-center gap-2 py-1">
              {theme === 'slate-haze' ? (
                <div className="flex items-center justify-center gap-2 py-0.5">
                  <Snowflake className="w-5 h-5 text-sky-400 animate-[snowflake-smooth-spin_3.5s_linear_infinite]" />
                </div>
              ) : theme === 'notebook' ? (
                <div className="flex items-center justify-center gap-1.5 py-0.5">
                  <Hourglass
                    className={`w-4 h-4 animate-spin ${
                      isDarkEffective ? 'text-neutral-300' : 'text-stone-700'
                    }`}
                    style={{ animationDuration: '3s' }}
                  />
                  <Heart
                    className={`w-3.5 h-3.5 animate-pulse ${
                      isDarkEffective
                        ? 'text-neutral-400 fill-neutral-400'
                        : 'text-stone-600 fill-stone-600'
                    }`}
                  />
                </div>
              ) : theme === 'lululemon' ? (
                <div className="flex items-center justify-center gap-2 py-0.5">
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-t-[#84334b] border-r-[#ba3859] border-b-[#ead4d7] border-l-transparent animate-spin" />
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-[#ba3859] animate-pulse" />
                  </div>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${isDarkEffective ? 'bg-[#ba3859]' : 'bg-[#84334b]'} animate-[bounce_1.4s_infinite_ease-in-out_both]`}
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${isDarkEffective ? 'bg-[#ead4d7]' : 'bg-[#ba3859]'} animate-[bounce_1.4s_infinite_ease-in-out_both]`}
                    style={{ animationDelay: '180ms' }}
                  />
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${isDarkEffective ? 'bg-[#d4a3af]' : 'bg-[#ead4d7]'} animate-[bounce_1.4s_infinite_ease-in-out_both]`}
                    style={{ animationDelay: '360ms' }}
                  />
                </div>
              ) : (
                <>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${themePickerStyles.loadingDots[0]} animate-[bounce_1.4s_infinite_ease-in-out_both]`}
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${themePickerStyles.loadingDots[1]} animate-[bounce_1.4s_infinite_ease-in-out_both]`}
                    style={{ animationDelay: '180ms' }}
                  />
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${themePickerStyles.loadingDots[2]} animate-[bounce_1.4s_infinite_ease-in-out_both]`}
                    style={{ animationDelay: '360ms' }}
                  />
                </>
              )}
            </div>

            {/* "Sắp xong..." */}
            <p
              className={`text-xs sm:text-sm font-mono tracking-wide ${
                isDarkEffective ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Sắp xong...
            </p>
          </div>

          {/* Nút nhỏ bấm dừng/quay lại — Nút bấm Neumorphic với phản hồi xúc giác */}
          <div className="mt-5 pt-2">
            <button
              onClick={handleResetToIdle}
              className={`text-xs px-4 py-1.5 rounded-full border transition-all cursor-pointer select-none active:translate-y-[1px] ${getTactileBtnStyles(
                theme,
                isDarkEffective
              )}`}
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // KHUNG CẢNH 1: CHƯA BẤM VÀO (IDLE)
  // - Khung ảnh 1: Gradient background with light rays and sparkles theo theme sáng tối
  // - Tiêu đề: "Chọn Truyện Ngẫu Nhiên"
  // - Subtitle: "Nếu hôm nay bạn chưa biết đọc gì."
  // - Bỏ "Ngẫu nhiên 100%"
  // - Nút "BẮT ĐẦU" (không có icon phía trước)
  // -------------------------------------------------------------
  return (
    <div className={`w-full ${isEnteringFromPicked ? 'anim-picker-flip-in' : 'animate-picker-fade-in'}`}>
      {/* Khung cảnh 1 - Áp dụng màu sắc, hiệu ứng, đường viền của SugarTodayWidget ở chế độ sáng */}
      <div
        className={`relative w-full rounded-[2.2rem] overflow-hidden p-4 sm:p-5 transition-all duration-300 ${
          isDarkEffective
            ? `border ${getRandomPickerCardBg(theme, isDarkEffective)} border-white/[0.07]`
            : ''
        }`}
        style={
          !isDarkEffective
            ? sugarConfig.glassStyle
            : {
                boxShadow:
                  '0 6px 20px rgba(0, 0, 0, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.12), inset 0 -1px 2px rgba(0, 0, 0, 0.22)',
              }
        }
      >
        {/* 
          KHUNG ẢNH 1:
          - Gradient background (thích ứng chế độ sáng / tối & theme)
          - Subtle diagonal light rays (các vệt tia sáng xiên mờ ảo thanh nhã)
          - Sparse star particles (các hạt sao điểm xuyết thưa thớt, lấp lánh nhẹ)
          - Soft ambient glow (quầng sáng môi trường lan tỏa êm dịu)
          - Inset Shadow Neumorphic lõm lòng thẻ hốc ảnh
        */}
        <div
          className={`relative w-full rounded-[22px] sm:rounded-[24px] overflow-hidden select-none aspect-[16/10] sm:aspect-[16/9] min-h-[185px] sm:min-h-[200px] flex items-center justify-center bg-gradient-to-b ${bannerPalette.bgGradient}`}
        >
          {/* Lớp bóng Inset Hốc ảnh Neumorphic tương tự hốc ảnh Polaroid */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[22px] sm:rounded-[24px] border border-black/10 dark:border-white/10 shadow-[inset_0_2.5px_6px_rgba(0,0,0,0.22),inset_0_-1px_2px_rgba(255,255,255,0.55)] dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.25)] z-20"
            aria-hidden="true"
          />

          {/* 1. SOFT AMBIENT GLOW: Quầng sáng môi trường êm dịu lan tỏa theo theme */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-48 rounded-full blur-3xl pointer-events-none ${bannerPalette.ambientCenter}`}
          />
          {/* Nguồn sáng phát quang góc trên bên phải */}
          <div
            className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none ${bannerPalette.ambientTopRight}`}
          />

          {/* HIỆU ỨNG GRAIN: Lớp hạt nhiễu vi mô tự nhiên (Film grain texture) tạo cảm giác trong veo, có chất liệu nghệ thuật */}
          {isDarkEffective && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
              style={{
                opacity: 0.18,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
              aria-hidden="true"
            />
          )}

          {/* 2. SUBTLE DIAGONAL LIGHT RAYS: Chỉ hiển thị ở chế độ sáng; theme berry & theme tối đã bỏ đường sọc chéo theo yêu cầu */}
          {!isDarkEffective && theme !== 'lululemon' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <svg
                viewBox="0 0 400 220"
                preserveAspectRatio="none"
                className={`w-full h-full transition-opacity duration-700 opacity-20 ${bannerPalette.rayColor}`}
              >
                <defs>
                  {/* Bộ lọc làm mềm (Gaussian blur) nhẹ giúp các dải sáng có ranh giới mềm mại, không bị sắc cạnh */}
                  <filter id="softRayBlur" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="0.9" />
                  </filter>

                  {/* Mask dọc: Nửa trên sáng vừa phải mờ dần êm ái xuống ranh giới giữa (y=114), nửa dưới ẩn hoàn toàn */}
                  <linearGradient id="verticalRayFadeMaskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.72" />
                    <stop offset="45%" stopColor="#ffffff" stopOpacity="0.48" />
                    <stop offset="80%" stopColor="#ffffff" stopOpacity="0.16" />
                    <stop offset="96%" stopColor="#ffffff" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>

                  <mask id="verticalRayMask">
                    <rect x="0" y="0" width="400" height="114" fill="url(#verticalRayFadeMaskGrad)" />
                    <rect x="0" y="114" width="400" height="106" fill="#000000" />
                  </mask>

                  {/* Mask ngang: Chỉ làm mềm nhẹ sát 2 mép biên trái & phải (khoảng 5-6%), không che lấp các đường chéo */}
                  <linearGradient id="horizontalRayFadeMaskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="3%" stopColor="#ffffff" stopOpacity="0.55" />
                    <stop offset="7%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="93%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="97%" stopColor="#ffffff" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>

                  <mask id="horizontalRayMask">
                    <rect x="0" y="0" width="400" height="220" fill="url(#horizontalRayFadeMaskGrad)" />
                  </mask>
                </defs>

                {/* Nhóm các dải chéo thanh mảnh hơn, blur nhẹ tạo cảm giác dải sáng mờ ảo mềm mại */}
                <g mask="url(#verticalRayMask)">
                  <g mask="url(#horizontalRayMask)" filter="url(#softRayBlur)">
                    {Array.from({ length: 16 }).map((_, i) => {
                      const c = -30 + i * 38;
                      return (
                        <line
                          key={i}
                          x1={c}
                          y1={-15}
                          x2={c - 145}
                          y2={135}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </g>
                </g>
              </svg>
            </div>
          )}

          {/* 3. SPARSE STAR PARTICLES: Các hạt sao thưa thớt, lấp lánh nhẹ nhàng điểm xuyết */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Star 1: Gần góc phát quang trên phải (4 cánh thanh mảnh) */}
            <div className="absolute top-5 right-12 flex items-center justify-center animate-pulse" style={{ animationDuration: '3.5s' }}>
              <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${bannerPalette.starPrimary}`}>
                <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" fill="currentColor" />
              </svg>
            </div>

            {/* Star 2: Góc dưới bên trái (4 cánh nhỏ) */}
            <div
              className="absolute bottom-6 left-12 flex items-center justify-center animate-pulse"
              style={{ animationDuration: '4.2s', animationDelay: '1.2s' }}
            >
              <svg viewBox="0 0 24 24" className={`w-3 h-3 ${bannerPalette.starSecondary}`}>
                <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" fill="currentColor" />
              </svg>
            </div>

            {/* Star 3: Lệch trên trái */}
            <div
              className="absolute top-7 left-1/4 flex items-center justify-center animate-pulse"
              style={{ animationDuration: '5s', animationDelay: '2.4s' }}
            >
              <div className={`w-1 h-1 rounded-full ${bannerPalette.starGlow}`} />
            </div>

            {/* Star 4: Giữa dưới lệch phải */}
            <div
              className="absolute bottom-8 right-1/4 flex items-center justify-center animate-pulse"
              style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${bannerPalette.starGlow}`} />
            </div>

            {/* Star 5: Điểm sao vi mô góc xa */}
            <div
              className="absolute top-1/3 right-8 w-1 h-1 rounded-full bg-white/75 animate-pulse"
              style={{ animationDuration: '4.5s', animationDelay: '1.8s' }}
            />
          </div>

          {/* Biểu tượng trung tâm trang nhã: Ngôi sao ✷ khối nổi Neumorphic 3D */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 hover:scale-105 select-none ${
                isDarkEffective
                  ? 'bg-[#221b2f]/90 border-white/15 text-amber-300 shadow-[0_4px_14px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.35)]'
                  : theme === 'lululemon'
                  ? 'bg-[#ebd4dc] border-[#d8b5c1] text-[#ad4862] shadow-[0_4px_14px_rgba(204,123,143,0.14),inset_0_1px_1.5px_rgba(255,255,255,0.7),inset_0_-1px_1.5px_rgba(204,123,143,0.10)]'
                  : 'bg-white/95 border-white/95 text-neutral-800 shadow-[0_4px_14px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-2xl sm:text-3xl font-bold leading-none select-none animate-pulse">
                ✷
              </span>
            </div>
          </div>
        </div>

        {/* 
          PHẦN THÔNG TIN BÊN DƯỚI:
          - Title: Chọn Truyện Ngẫu Nhiên
          - Subtitle: Nếu hôm nay bạn chưa biết đọc gì.
          - Action: Nút "BẮT ĐẦU" Neumorphic + Nút Tim Tactile
        */}
        <div className="pt-4 space-y-3.5">
          {/* Title & Subtitle */}
          <div className="space-y-1">
            <h3
              style={{ color: !isDarkEffective ? sugarConfig.dayNum : undefined }}
              className={`text-sm sm:text-base font-source-serif font-bold tracking-tight leading-snug ${
                isDarkEffective ? 'text-neutral-50' : ''
              }`}
            >
              Chọn Truyện Ngẫu Nhiên
            </h3>
            <p
              style={{ color: !isDarkEffective ? sugarConfig.quoteText : undefined }}
              className={`text-xs sm:text-sm font-source-serif font-normal ${
                isDarkEffective ? 'text-neutral-400' : ''
              }`}
            >
              Nếu hôm nay bạn chưa biết đọc gì.
            </p>
          </div>

          {/* Action Row: Nút "BẮT ĐẦU" Neumorphic + Nút Tim Tactile */}
          <div className="flex items-center gap-2.5 pt-1">
            {/* Nút BẮT ĐẦU — Dập nổi 3D, có phản hồi xúc giác cơ học khi bấm */}
            <button
              onClick={handleStartPicking}
              className={`w-full py-3 px-5 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center cursor-pointer select-none active:translate-y-[1px] ${
                themePickerStyles.primaryBtn
              } ${
                !isDarkEffective && theme === 'lululemon'
                  ? 'shadow-xs hover:shadow-sm'
                  : 'shadow-[0_4px_14px_rgba(0,0,0,0.22),inset_0_1px_1.5px_rgba(255,255,255,0.45),inset_0_-1px_1.5px_rgba(0,0,0,0.2)] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.5),inset_0_-1px_1px_rgba(255,255,255,0.15)]'
              }`}
            >
              BẮT ĐẦU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
