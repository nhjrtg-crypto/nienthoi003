import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Sparkles,
  Flame,
  Star,
  Eye,
  Calendar,
  Layers,
  FileText,
  MessageSquare,
  ThumbsUp,
  Send,
  PlusCircle,
  Shield,
  ShieldCheck,
  Archive,
  ArrowUpDown,
  Compass,
  CheckCircle2,
  Share2,
  Trophy,
  Palette,
  Sun,
  Moon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  Clock,
  Heart,
  Wallpaper,
  Shuffle,
  CircleDot,
  FileUp,
  Camera,
  UploadCloud,
  Upload,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
  Save,
  Link as LinkIcon,
  Loader2,
  Tag,
  MessageCircle,
  Paperclip,
  Award,
  StickyNote,
  Disc,
  Radio,
  Music,
  Cpu,
  Terminal,
  Zap,
  FastForward,
  Mail,
  Feather,
  Stamp,
  Pin,
  Clapperboard,
  Film,
} from 'lucide-react';
import { getDirectImageUrl, handleCoverImageError, getOriginalCoverByNovel } from '../utils/imageUtils';
import { Novel, NovelChapter, NovelComment, DarkBackgroundOption, DARK_BG_OPTIONS } from '../types';
import {
  NovelThemeId,
  NOVEL_THEME_OPTIONS,
  getNovelThemeStyles,
  getExtraChapterBadgeStyle,
  isExtraChapter,
  getChapterDisplayParts,
} from '../utils/themeStyles';
import { useHeaderScroll } from '../utils/useHeaderScroll';
import { Footer } from './Footer';
import { CosmicStarsBackground } from './CosmicStarsBackground';
import { SpiralNotebookView, getSpiralPlannerCaroGridStyle } from './SpiralNotebookView';
import { safeStorage } from '../utils/safeStorage';
import { TxtImportModal } from './TxtImportModal';
import { TxtChapterSplitterModal } from './TxtChapterSplitterModal';
import {
  fetchChuongMetaList,
  FirestoreChuongMeta,
  AdminUserLike,
  updateTruyen,
  saveNovelCoverToFirebase,
  saveNovelSynopsisToFirebase,
  saveNovelTagsToFirebase,
  updateChuong,
  deleteChuong,
  addSingleChuong,
  fetchSingleChuong,
  subscribeBinhLuanList,
  addBinhLuan,
  likeBinhLuan,
  deleteBinhLuan,
  isBotComment,
} from '../services/firebase';
import { formatCommentDate, normalizeCommentDate } from '../utils/dateUtils';
import { LUA_NHAU_NOVEL } from '../data/luaNhauData';

// =========================================================================
// HỌA TIẾT NỀN KHỐI MÀU GRADIENT & ICON MỜ CHO KHỐI BÌA TRUYỆN (KIỂU CHUẨN)
// Cấu hình: 2 khối/icon lớn và 1 khối/icon nhỏ, chỉ xoay nghiêng tự nhiên (không méo hình)
// =========================================================================
// HIỆU ỨNG LOANG MÀU GRADIENT TỎA VÀO NỀN CHO KHỐI BÌA TRUYỆN (KIỂU CHUẨN)
// Tán sắc mềm mại, dần dần hòa luôn vào nền trang, không để nguyên cục trơ trọi
// =========================================================================
export type CoverBgPatternId =
  | 'gradient-aurora'
  | 'gradient-sunset'
  | 'gradient-cosmic'
  | 'gradient-ocean'
  | 'gradient-pastel'
  | 'gradient-amber'
  | 'gradient-theme'
  | 'clean';

export interface CoverBgPatternOption {
  id: CoverBgPatternId;
  name: string;
  previewGradient: string;
  description: string;
}

export interface GradientLoangConfig {
  name: string;
  description: string;
  preview: string;
  // Lớp mesh tỏa màu bao phủ toàn bề mặt, tỏa từ góc vào trung tâm
  meshGradient: string;
  // Dải sáng loang rộng hữu cơ ở góc trên bên phải, kéo dài tỏa xuống giữa
  flowTop: string;
  // Dải sáng loang rộng hữu cơ ở góc dưới bên trái, hòa sắc ngược chiều lên trên
  flowBottom: string;
  // Dải loang trung tâm kết nối 2 luồng màu
  flowCenter: string;
}

export const GRADIENT_LOANG_CONFIGS: Record<string, GradientLoangConfig> = {
  'gradient-aurora': {
    name: 'Khối Cực Quang',
    description: 'Tím lavender, lam sương & ngọc bích loang mịn',
    preview: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 50%, #34d399 100%)',
    meshGradient:
      'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(168, 85, 247, 0.24) 0%, rgba(56, 189, 248, 0.12) 42%, rgba(52, 211, 153, 0.05) 68%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(52, 211, 153, 0.20) 0%, rgba(6, 182, 212, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(147, 51, 234, 0.08) 0%, transparent 72%)',
    flowTop:
      'radial-gradient(ellipse at 70% 30%, rgba(168, 85, 247, 0.30) 0%, rgba(56, 189, 248, 0.15) 38%, rgba(52, 211, 153, 0.05) 65%, transparent 85%)',
    flowBottom:
      'radial-gradient(ellipse at 30% 70%, rgba(6, 182, 212, 0.26) 0%, rgba(52, 211, 153, 0.14) 42%, rgba(147, 51, 234, 0.05) 68%, transparent 85%)',
    flowCenter:
      'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.18) 0%, rgba(168, 85, 247, 0.08) 48%, transparent 78%)',
  },
  'gradient-sunset': {
    name: 'Khối Hoàng Hôn',
    description: 'Cam san hô, hồng đào & ánh vàng ấm hòa quyện',
    preview: 'linear-gradient(135deg, #f43f5e 0%, #f97316 50%, #fbbf24 100%)',
    meshGradient:
      'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(244, 63, 94, 0.24) 0%, rgba(249, 115, 22, 0.12) 42%, rgba(251, 191, 36, 0.05) 68%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(249, 115, 22, 0.20) 0%, rgba(236, 72, 153, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(251, 191, 36, 0.08) 0%, transparent 72%)',
    flowTop:
      'radial-gradient(ellipse at 70% 30%, rgba(244, 63, 94, 0.30) 0%, rgba(249, 115, 22, 0.16) 38%, rgba(251, 191, 36, 0.05) 65%, transparent 85%)',
    flowBottom:
      'radial-gradient(ellipse at 30% 70%, rgba(249, 115, 22, 0.26) 0%, rgba(236, 72, 153, 0.14) 42%, rgba(251, 191, 36, 0.05) 68%, transparent 85%)',
    flowCenter:
      'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.18) 0%, rgba(244, 63, 94, 0.08) 48%, transparent 78%)',
  },
  'gradient-cosmic': {
    name: 'Khối Tím Vũ Trụ',
    description: 'Tím thạch anh, hồng neon & xanh đêm huyền ảo',
    preview: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #4f46e5 100%)',
    meshGradient:
      'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(124, 58, 237, 0.24) 0%, rgba(192, 38, 211, 0.12) 42%, rgba(79, 70, 229, 0.05) 68%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(192, 38, 211, 0.20) 0%, rgba(79, 70, 229, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(139, 92, 246, 0.08) 0%, transparent 72%)',
    flowTop:
      'radial-gradient(ellipse at 70% 30%, rgba(124, 58, 237, 0.30) 0%, rgba(192, 38, 211, 0.16) 38%, rgba(79, 70, 229, 0.05) 65%, transparent 85%)',
    flowBottom:
      'radial-gradient(ellipse at 30% 70%, rgba(236, 72, 153, 0.26) 0%, rgba(139, 92, 246, 0.14) 42%, rgba(59, 130, 246, 0.05) 68%, transparent 85%)',
    flowCenter:
      'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.18) 0%, rgba(79, 70, 229, 0.08) 48%, transparent 78%)',
  },
  'gradient-ocean': {
    name: 'Khối Đại Dương',
    description: 'Xanh ngọc bích, cyan lộng lẫy & biển sâu',
    preview: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #10b981 100%)',
    meshGradient:
      'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(2, 132, 199, 0.24) 0%, rgba(6, 182, 212, 0.12) 42%, rgba(16, 185, 129, 0.05) 68%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(37, 99, 235, 0.20) 0%, rgba(6, 182, 212, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(14, 165, 233, 0.08) 0%, transparent 72%)',
    flowTop:
      'radial-gradient(ellipse at 70% 30%, rgba(2, 132, 199, 0.30) 0%, rgba(6, 182, 212, 0.15) 38%, rgba(16, 185, 129, 0.05) 65%, transparent 85%)',
    flowBottom:
      'radial-gradient(ellipse at 30% 70%, rgba(37, 99, 235, 0.26) 0%, rgba(14, 165, 233, 0.14) 42%, rgba(45, 212, 191, 0.05) 68%, transparent 85%)',
    flowCenter:
      'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.18) 0%, rgba(37, 99, 235, 0.08) 48%, transparent 78%)',
  },
  'gradient-pastel': {
    name: 'Khối Kẹo Ngọt',
    description: 'Hồng pastel dịu dàng, tím sữa & vàng bơ thơ mộng',
    preview: 'linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #fcd34d 100%)',
    meshGradient:
      'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(244, 114, 182, 0.22) 0%, rgba(192, 132, 252, 0.12) 42%, rgba(252, 211, 77, 0.05) 68%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(251, 113, 133, 0.18) 0%, rgba(232, 121, 249, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(249, 168, 212, 0.08) 0%, transparent 72%)',
    flowTop:
      'radial-gradient(ellipse at 70% 30%, rgba(244, 114, 182, 0.28) 0%, rgba(192, 132, 252, 0.14) 38%, rgba(252, 211, 77, 0.05) 65%, transparent 85%)',
    flowBottom:
      'radial-gradient(ellipse at 30% 70%, rgba(251, 113, 133, 0.24) 0%, rgba(232, 121, 249, 0.12) 42%, rgba(253, 186, 116, 0.05) 68%, transparent 85%)',
    flowCenter:
      'radial-gradient(ellipse at center, rgba(216, 180, 254, 0.18) 0%, rgba(244, 114, 182, 0.08) 48%, transparent 78%)',
  },
  'gradient-amber': {
    name: 'Khối Hổ Phách',
    description: 'Hổ phách ấm áp, nâu đồng & mật ong quý phái',
    preview: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #ea580c 100%)',
    meshGradient:
      'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(217, 119, 6, 0.24) 0%, rgba(245, 158, 11, 0.12) 42%, rgba(234, 88, 12, 0.05) 68%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(180, 83, 9, 0.20) 0%, rgba(251, 191, 36, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(245, 158, 11, 0.08) 0%, transparent 72%)',
    flowTop:
      'radial-gradient(ellipse at 70% 30%, rgba(217, 119, 6, 0.30) 0%, rgba(245, 158, 11, 0.15) 38%, rgba(234, 88, 12, 0.05) 65%, transparent 85%)',
    flowBottom:
      'radial-gradient(ellipse at 30% 70%, rgba(180, 83, 9, 0.26) 0%, rgba(251, 191, 36, 0.14) 42%, rgba(217, 119, 6, 0.05) 68%, transparent 85%)',
    flowCenter:
      'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.08) 48%, transparent 78%)',
  },
};

export const getThemeLoangConfig = (theme: NovelThemeId, isDark: boolean): GradientLoangConfig => {
  switch (theme) {
    case 'amethyst-haze':
      return isDark
        ? {
            name: 'Theme Thạch Anh (Tối)',
            description: 'Tím thạch anh & oải hương dịu nhẹ huyền bí',
            preview: 'linear-gradient(135deg, #7c3aed, #c084fc)',
            meshGradient:
              'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(147, 51, 234, 0.28) 0%, rgba(168, 85, 247, 0.16) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(192, 38, 211, 0.22) 0%, rgba(124, 58, 237, 0.12) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(139, 92, 246, 0.10) 0%, transparent 72%)',
            flowTop:
              'radial-gradient(ellipse at 70% 30%, rgba(147, 51, 234, 0.35) 0%, rgba(168, 85, 247, 0.18) 40%, transparent 82%)',
            flowBottom:
              'radial-gradient(ellipse at 30% 70%, rgba(192, 38, 211, 0.30) 0%, rgba(124, 58, 237, 0.14) 40%, transparent 82%)',
            flowCenter:
              'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.20) 0%, transparent 78%)',
          }
        : {
            name: 'Theme Thạch Anh (Sáng)',
            description: 'Tím thạch anh & oải hương dịu nhẹ thanh tao',
            preview: 'linear-gradient(135deg, #c084fc, #e9d5ff)',
            meshGradient:
              'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(168, 85, 247, 0.24) 0%, rgba(216, 180, 254, 0.12) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(232, 121, 249, 0.20) 0%, rgba(192, 132, 252, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(216, 180, 254, 0.08) 0%, transparent 72%)',
            flowTop:
              'radial-gradient(ellipse at 70% 30%, rgba(168, 85, 247, 0.30) 0%, rgba(216, 180, 254, 0.15) 40%, transparent 82%)',
            flowBottom:
              'radial-gradient(ellipse at 30% 70%, rgba(232, 121, 249, 0.26) 0%, rgba(192, 132, 252, 0.12) 40%, transparent 82%)',
            flowCenter:
              'radial-gradient(ellipse at center, rgba(216, 180, 254, 0.18) 0%, rgba(243, 232, 255, 0.08) 45%, transparent 78%)',
          };
    case 'sage':
      return isDark
        ? {
            name: 'Theme Thảo Mộc (Tối)',
            description: 'Xanh ngọc bích & sương lá trà dịu nhẹ',
            preview: 'linear-gradient(135deg, #059669, #34d399)',
            meshGradient:
              'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(16, 185, 129, 0.26) 0%, rgba(5, 150, 105, 0.14) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(52, 211, 153, 0.22) 0%, rgba(13, 148, 136, 0.12) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(5, 150, 105, 0.10) 0%, transparent 72%)',
            flowTop:
              'radial-gradient(ellipse at 70% 30%, rgba(16, 185, 129, 0.32) 0%, rgba(5, 150, 105, 0.16) 40%, transparent 82%)',
            flowBottom:
              'radial-gradient(ellipse at 30% 70%, rgba(52, 211, 153, 0.28) 0%, rgba(13, 148, 136, 0.14) 40%, transparent 82%)',
            flowCenter:
              'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.18) 0%, transparent 78%)',
          }
        : {
            name: 'Theme Thảo Mộc (Sáng)',
            description: 'Xanh ngọc bích & lá trà thanh khiết tươi mới dịu nhẹ',
            preview: 'linear-gradient(135deg, #34d399, #a7f3d0)',
            meshGradient:
              'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(16, 185, 129, 0.24) 0%, rgba(110, 231, 183, 0.12) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(52, 211, 153, 0.20) 0%, rgba(45, 212, 191, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(110, 231, 183, 0.08) 0%, transparent 72%)',
            flowTop:
              'radial-gradient(ellipse at 70% 30%, rgba(16, 185, 129, 0.30) 0%, rgba(110, 231, 183, 0.15) 40%, transparent 82%)',
            flowBottom:
              'radial-gradient(ellipse at 30% 70%, rgba(52, 211, 153, 0.26) 0%, rgba(45, 212, 191, 0.12) 40%, transparent 82%)',
            flowCenter:
              'radial-gradient(ellipse at center, rgba(110, 231, 183, 0.18) 0%, rgba(167, 243, 208, 0.08) 45%, transparent 78%)',
          };
    case 'mocha':
      return isDark
        ? {
            name: 'Theme Cà Phê (Tối)',
            description: 'Hổ phách ấm & nâu mật ong dịu nhẹ',
            preview: 'linear-gradient(135deg, #d97706, #fbbf24)',
            meshGradient:
              'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(217, 119, 6, 0.26) 0%, rgba(180, 83, 9, 0.14) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(245, 158, 11, 0.22) 0%, rgba(194, 65, 12, 0.12) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(180, 83, 9, 0.10) 0%, transparent 72%)',
            flowTop:
              'radial-gradient(ellipse at 70% 30%, rgba(217, 119, 6, 0.32) 0%, rgba(180, 83, 9, 0.16) 40%, transparent 82%)',
            flowBottom:
              'radial-gradient(ellipse at 30% 70%, rgba(245, 158, 11, 0.28) 0%, rgba(194, 65, 12, 0.14) 40%, transparent 82%)',
            flowCenter:
              'radial-gradient(ellipse at center, rgba(217, 119, 6, 0.18) 0%, transparent 78%)',
          }
        : {
            name: 'Theme Cà Phê (Sáng)',
            description: 'Hổ phách ấm & nâu mật ong cổ điển dịu nhẹ',
            preview: 'linear-gradient(135deg, #fbbf24, #fde68a)',
            meshGradient:
              'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(217, 119, 6, 0.24) 0%, rgba(251, 191, 36, 0.12) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(245, 158, 11, 0.20) 0%, rgba(253, 186, 116, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(251, 191, 36, 0.08) 0%, transparent 72%)',
            flowTop:
              'radial-gradient(ellipse at 70% 30%, rgba(217, 119, 6, 0.30) 0%, rgba(251, 191, 36, 0.15) 40%, transparent 82%)',
            flowBottom:
              'radial-gradient(ellipse at 30% 70%, rgba(245, 158, 11, 0.26) 0%, rgba(253, 186, 116, 0.12) 40%, transparent 82%)',
            flowCenter:
              'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.18) 0%, rgba(254, 243, 199, 0.08) 45%, transparent 78%)',
          };
    case 'slate-haze':
      return isDark
        ? {
            name: 'Theme Lam Khói (Tối)',
            description: 'Xanh sương & xám bạc tĩnh lặng dịu nhẹ',
            preview: 'linear-gradient(135deg, #2563eb, #38bdf8)',
            meshGradient:
              'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(14, 165, 233, 0.26) 0%, rgba(37, 99, 235, 0.14) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(56, 189, 248, 0.22) 0%, rgba(6, 182, 212, 0.12) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(14, 165, 233, 0.10) 0%, transparent 72%)',
            flowTop:
              'radial-gradient(ellipse at 70% 30%, rgba(14, 165, 233, 0.32) 0%, rgba(37, 99, 235, 0.16) 40%, transparent 82%)',
            flowBottom:
              'radial-gradient(ellipse at 30% 70%, rgba(56, 189, 248, 0.26) 0%, rgba(6, 182, 212, 0.12) 40%, transparent 82%)',
            flowCenter:
              'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.18) 0%, transparent 78%)',
          }
        : {
            name: 'Theme Lam Khói (Sáng)',
            description: 'Xanh sương lam & lam ngọc thanh khiết dịu nhẹ',
            preview: 'linear-gradient(135deg, #38bdf8, #bae6fd)',
            meshGradient:
              'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(14, 165, 233, 0.24) 0%, rgba(125, 211, 252, 0.12) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(56, 189, 248, 0.20) 0%, rgba(14, 165, 233, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(125, 211, 252, 0.08) 0%, transparent 72%)',
            flowTop:
              'radial-gradient(ellipse at 70% 30%, rgba(14, 165, 233, 0.30) 0%, rgba(125, 211, 252, 0.15) 40%, transparent 82%)',
            flowBottom:
              'radial-gradient(ellipse at 30% 70%, rgba(56, 189, 248, 0.26) 0%, rgba(14, 165, 233, 0.12) 40%, transparent 82%)',
            flowCenter:
              'radial-gradient(ellipse at center, rgba(125, 211, 252, 0.18) 0%, rgba(224, 242, 254, 0.08) 45%, transparent 78%)',
          };
    case 'notebook':
      return {
        name: 'Theo Theme Giấy Cũ',
        description: 'Khói bạc tối giản & tro ấm mộc mạc dịu nhẹ',
        preview: 'linear-gradient(135deg, #a3a3a3, #d4d4d4)',
        meshGradient: isDark
          ? 'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(163, 163, 163, 0.22) 0%, rgba(115, 115, 115, 0.12) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(115, 115, 115, 0.18) 0%, rgba(64, 64, 64, 0.08) 45%, transparent 80%)'
          : 'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(163, 163, 163, 0.16) 0%, rgba(212, 212, 212, 0.08) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(212, 212, 212, 0.14) 0%, rgba(245, 245, 245, 0.06) 45%, transparent 80%)',
        flowTop: isDark
          ? 'radial-gradient(ellipse at 70% 30%, rgba(163, 163, 163, 0.28) 0%, rgba(115, 115, 115, 0.14) 40%, transparent 82%)'
          : 'radial-gradient(ellipse at 70% 30%, rgba(163, 163, 163, 0.20) 0%, rgba(212, 212, 212, 0.10) 40%, transparent 82%)',
        flowBottom: isDark
          ? 'radial-gradient(ellipse at 30% 70%, rgba(115, 115, 115, 0.25) 0%, rgba(64, 64, 64, 0.10) 40%, transparent 82%)'
          : 'radial-gradient(ellipse at 30% 70%, rgba(212, 212, 212, 0.18) 0%, rgba(245, 245, 245, 0.08) 40%, transparent 82%)',
        flowCenter:
          'radial-gradient(ellipse at center, rgba(163, 163, 163, 0.12) 0%, transparent 78%)',
      };
    case 'cosmic':
    default:
      return {
        name: 'Theo Theme Vũ Trụ',
        description: 'Tím mận & hồng neon huyền bí dịu nhẹ',
        preview: 'linear-gradient(135deg, #9333ea, #ec4899)',
        meshGradient: isDark
          ? 'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(147, 51, 234, 0.32) 0%, rgba(236, 72, 153, 0.18) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(236, 72, 153, 0.26) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(56, 189, 248, 0.10) 0%, transparent 72%)'
          : 'radial-gradient(ellipse 95% 75% at 95% 10%, rgba(192, 132, 252, 0.22) 0%, rgba(244, 114, 182, 0.12) 42%, transparent 85%), radial-gradient(ellipse 85% 65% at 5% 90%, rgba(244, 114, 182, 0.18) 0%, rgba(125, 211, 252, 0.10) 45%, transparent 80%), radial-gradient(ellipse 65% 50% at 50% 45%, rgba(125, 211, 252, 0.08) 0%, transparent 72%)',
        flowTop: isDark
          ? 'radial-gradient(ellipse at 70% 30%, rgba(147, 51, 234, 0.40) 0%, rgba(236, 72, 153, 0.20) 40%, transparent 82%)'
          : 'radial-gradient(ellipse at 70% 30%, rgba(192, 132, 252, 0.28) 0%, rgba(244, 114, 182, 0.15) 40%, transparent 82%)',
        flowBottom: isDark
          ? 'radial-gradient(ellipse at 30% 70%, rgba(236, 72, 153, 0.35) 0%, rgba(56, 189, 248, 0.16) 40%, transparent 82%)'
          : 'radial-gradient(ellipse at 30% 70%, rgba(244, 114, 182, 0.24) 0%, rgba(125, 211, 252, 0.12) 40%, transparent 82%)',
        flowCenter:
          'radial-gradient(ellipse at center, rgba(125, 211, 252, 0.16) 0%, transparent 78%)',
      };
  }
};

export const COVER_BG_PATTERNS: CoverBgPatternOption[] = [
  {
    id: 'gradient-theme',
    name: 'Theo Theme Truyện',
    previewGradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #38bdf8 100%)',
    description: 'Hòa sắc tự nhiên theo theme giao diện đang chọn',
  },
  {
    id: 'gradient-aurora',
    name: 'Khối Cực Quang',
    previewGradient: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 50%, #34d399 100%)',
    description: 'Tím lavender, lam sương & ngọc bích loang mềm',
  },
  {
    id: 'gradient-sunset',
    name: 'Khối Hoàng Hôn',
    previewGradient: 'linear-gradient(135deg, #f43f5e 0%, #f97316 50%, #fbbf24 100%)',
    description: 'Cam san hô, hồng đào & ánh vàng ấm',
  },
  {
    id: 'gradient-cosmic',
    name: 'Khối Tím Vũ Trụ',
    previewGradient: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #4f46e5 100%)',
    description: 'Tím thạch anh, hồng neon & xanh đêm',
  },
  {
    id: 'gradient-ocean',
    name: 'Khối Đại Dương',
    previewGradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #10b981 100%)',
    description: 'Xanh ngọc bích, cyan & lam sâu loang mềm',
  },
  {
    id: 'gradient-pastel',
    name: 'Khối Kẹo Ngọt',
    previewGradient: 'linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #fcd34d 100%)',
    description: 'Hồng pastel dịu dàng, tím sữa & vàng bơ',
  },
  {
    id: 'gradient-amber',
    name: 'Khối Hổ Phách',
    previewGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #ea580c 100%)',
    description: 'Hổ phách ấm áp, nâu đồng & mật ong',
  },
  {
    id: 'clean',
    name: 'Trơn Tối Giản',
    previewGradient: 'linear-gradient(135deg, #71717a 0%, #52525b 100%)',
    description: 'Không loang màu, nền chuyển sắc thuần túy',
  },
];

const CoverBgPatternOverlay: React.FC<{
  theme: NovelThemeId;
  isDark: boolean;
}> = ({ theme, isDark }) => {
  // Chế độ theme sáng: áp dụng mức độ loang màu dịu nhẹ thanh tao (0.20)
  // Chế độ theme tối: áp dụng mức độ loang màu dịu nhẹ huyền ảo (0.16)
  const opacity = isDark ? 0.16 : 0.20;
  const config = getThemeLoangConfig(theme, isDark);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-700 z-0 select-none"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
      }}
    >
      {/* 1. Lớp Mesh loang màu bao phủ toàn bề mặt (Tỏa đều và hòa dần vào nền từ các góc) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-out ${
          isDark ? 'mix-blend-screen' : 'mix-blend-normal'
        }`}
        style={{
          background: config.meshGradient,
          opacity: isDark ? opacity * 1.1 : opacity * 0.75,
        }}
      />

      {/* 2. Dải loang màu hữu cơ góc trên bên phải (Tán sắc siêu mịn, blur 95px, không có tâm cục tròn) */}
      <div
        className={`absolute -top-24 -right-24 sm:-top-32 sm:-right-32 md:-top-36 md:-right-36 w-80 h-80 sm:w-[32rem] sm:h-[32rem] md:w-[42rem] md:h-[40rem] pointer-events-none transition-all duration-1000 ease-out ${
          isDark ? 'mix-blend-screen' : 'mix-blend-normal'
        }`}
        style={{
          background: config.flowTop,
          filter: 'blur(95px)',
          borderRadius: '42% 58% 65% 35% / 45% 45% 55% 55%',
          opacity: isDark ? opacity * 1.05 : opacity * 0.7,
          transform: 'rotate(-12deg) scale(1.05)',
        }}
      />

      {/* 3. Dải loang màu hữu cơ góc dưới bên trái (Hòa quyện mềm mại từ dưới lên, blur 100px) */}
      <div
        className={`absolute -bottom-24 -left-24 sm:-bottom-32 sm:-left-32 md:-bottom-36 md:-left-36 w-72 h-72 sm:w-[30rem] sm:h-[30rem] md:w-[38rem] md:h-[36rem] pointer-events-none transition-all duration-1000 ease-out ${
          isDark ? 'mix-blend-screen' : 'mix-blend-normal'
        }`}
        style={{
          background: config.flowBottom,
          filter: 'blur(100px)',
          borderRadius: '55% 45% 40% 60% / 50% 55% 45% 50%',
          opacity: isDark ? opacity * 1.0 : opacity * 0.65,
          transform: 'rotate(15deg) scale(1.02)',
        }}
      />

      {/* 4. Dải loang trung tâm kết nối 2 luồng màu (Tán sắc cực rộng, blur 110px) */}
      <div
        className={`absolute top-[15%] left-[20%] sm:left-[30%] w-72 h-60 sm:w-[26rem] sm:h-[22rem] md:w-[32rem] md:h-[26rem] pointer-events-none transition-all duration-1000 ease-out ${
          isDark ? 'mix-blend-screen' : 'mix-blend-normal'
        }`}
        style={{
          background: config.flowCenter,
          filter: 'blur(110px)',
          borderRadius: '50%',
          opacity: isDark ? opacity * 0.85 : opacity * 0.55,
          transform: 'scale(1.05)',
        }}
      />
    </div>
  );
};

interface NovelDetailViewProps {
  novel: Novel;
  onBack: () => void;
  onReadChapter: (chapterNumber: number) => void;
  onAddChapter: (novelId: string, chapter: NovelChapter) => void;
  onUpdateChapters?: (novelId: string, chapters: NovelChapter[]) => void;
  onUpdateCover?: (novelId: string, newCoverUrl: string) => void;
  onUpdateNovel?: (updatedNovel: Novel) => void;
  allNovels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  isAdmin?: boolean;
  currentUser?: AdminUserLike | null;
  onToggleStatus?: (novelId: string, currentStatus: 'nhap' | 'daDang') => void;
  onDeleteNovel?: (novelId: string) => void;
}

export const NovelDetailView: React.FC<NovelDetailViewProps> = ({
  novel,
  onBack,
  onReadChapter,
  onAddChapter,
  onUpdateChapters,
  onUpdateCover,
  onUpdateNovel,
  allNovels,
  onSelectNovel,
  isAdmin = false,
  currentUser = null,
  onToggleStatus,
  onDeleteNovel,
}) => {
  const [activeTab, setActiveTab] = useState<'synopsis' | 'chapters' | 'comments' | 'author'>('synopsis');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [voteCount, setVoteCount] = useState(novel.monthlyVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [chapterSortAsc, setChapterSortAsc] = useState(true);
  const [chapterPage, setChapterPage] = useState(1);

  // Layout Option: 'option1' (Chuẩn) | 'spiral' (Sổ còng)
  // Luôn đặt kiểu chuẩn làm mặc định khi bấm vào trang thông tin chi tiết truyện
  const [detailLayoutOption, setDetailLayoutOption] = useState<'option1' | 'spiral'>('option1');

  // Reset về kiểu Chuẩn mỗi khi mở một truyện mới
  useEffect(() => {
    setDetailLayoutOption('option1');
  }, [novel.id]);

  // Firestore chapter metadata state (restored from cache or loaded on-demand, no automatic full read on mount)
  const [firestoreChapters, setFirestoreChapters] = useState<FirestoreChuongMeta[]>(() => {
    try {
      const saved = safeStorage.getItem(`cosmo_cached_chapters_meta_${novel.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isTxtSplitterOpen, setIsTxtSplitterOpen] = useState(false);

  // Manual refresh chapter list from Firestore on-demand ONLY (avoids reading all chapters on detail page load)
  const handleRefreshChaptersFromServer = useCallback(async () => {
    if (!novel?.id) return;
    setIsLoadingChapters(true);
    try {
      const metas = await fetchChuongMetaList(novel.id);
      if (metas && metas.length > 0) {
        setFirestoreChapters(metas);
        try {
          safeStorage.setItem(`cosmo_cached_chapters_meta_${novel.id}`, JSON.stringify(metas));
        } catch {}
        if (onUpdateChapters) {
          const localChaps = novel.chapters || [];
          const localMap = new Map(localChaps.map((c) => [c.chapterNumber, c]));
          const converted: NovelChapter[] = metas.map((fc) => {
            const local = localMap.get(fc.soThuTu);
            return {
              id: fc.id,
              novelId: novel.id,
              chapterNumber: fc.soThuTu,
              title: fc.tieuDe,
              publishedAt: fc.thoiGianDang
                ? new Date(fc.thoiGianDang).toLocaleDateString('vi-VN')
                : local?.publishedAt || 'Mới cập nhật',
              wordCount: local?.wordCount || 0,
              views: local?.views || 0,
              content: local?.content || '',
              isExtra: /ngoại\s*truyện|phiên\s*ngoại/i.test(fc.tieuDe),
            };
          });
          onUpdateChapters(novel.id, converted);
        }
      }
    } catch (err) {
      console.warn('Manual refresh chapters warning:', err);
    } finally {
      setIsLoadingChapters(false);
    }
  }, [novel?.id, novel?.chapters, onUpdateChapters]);

  const effectiveChapters: NovelChapter[] = useMemo(() => {
    // 1. Dùng mảng chương đã có sẵn trong novel (ví dụ dữ liệu Lừa Nhau hoặc cache đã có)
    if (novel.chapters && novel.chapters.length > 0) {
      return novel.chapters;
    }
    // 2. Dùng metadata chương từ Firestore nếu đã tải trước đó
    if (firestoreChapters.length > 0) {
      const localMap = new Map((novel.chapters || []).map((c) => [c.chapterNumber, c]));
      return firestoreChapters.map((fc) => {
        const local = localMap.get(fc.soThuTu);
        return {
          id: fc.id,
          novelId: novel.id,
          chapterNumber: fc.soThuTu,
          title: fc.tieuDe,
          publishedAt: fc.thoiGianDang
            ? new Date(fc.thoiGianDang).toLocaleDateString('vi-VN')
            : local?.publishedAt || 'Mới cập nhật',
          wordCount: local?.wordCount || 0,
          views: local?.views || 0,
          content: local?.content || '',
          isExtra: /ngoại\s*truyện|phiên\s*ngoại/i.test(fc.tieuDe),
        };
      });
    }
    // 3. Fallback: Nếu truyện có totalChaptersCount (ví dụ 67 chương) nhưng chưa tải nội dung, tạo mục lục hiển thị tức thì (0 lượt đọc)
    if (novel.totalChaptersCount && novel.totalChaptersCount > 0) {
      return Array.from({ length: novel.totalChaptersCount }, (_, i) => {
        const num = i + 1;
        return {
          id: `c_${num}`,
          novelId: novel.id,
          chapterNumber: num,
          title: `Chương ${num}`,
          publishedAt: novel.latestChapter?.updatedAt || 'Mới cập nhật',
          wordCount: 0,
          views: 0,
          content: '',
          isExtra: false,
        };
      });
    }
    return novel.chapters || [];
  }, [firestoreChapters, novel.chapters, novel.id, novel.latestChapter?.updatedAt, novel.totalChaptersCount]);

  // Cover image customization & explicit save state
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [inputCustomUrl, setInputCustomUrl] = useState('');
  const [customCoverUrl, setCustomCoverUrl] = useState<string | null>(() => {
    try {
      const stored = safeStorage.getItem(`cosmo_novel_custom_cover_${novel.id}`);
      if (novel.id === 'lua-nhau') {
        if (stored && !stored.includes('1oqpUECsYtkmUUAYkXlRbq1cTUhUHFHGm')) {
          safeStorage.removeItem(`cosmo_novel_custom_cover_${novel.id}`);
          return null;
        }
      }
      return stored;
    } catch {
      return null;
    }
  });
  const coverInputRef = useRef<HTMLInputElement>(null);

  const activeCoverImage = customCoverUrl || getDirectImageUrl(novel.coverImage, novel.id || novel.title);
  const [pendingCoverUrl, setPendingCoverUrl] = useState<string | null>(activeCoverImage);
  const [isUploadingToFirebase, setIsUploadingToFirebase] = useState<boolean>(false);

  // Global toast message state for NovelDetailView (Synopsis, Cover, Table of Contents)
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const triggerToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage((curr) => (curr?.title === title ? null : curr));
    }, 3500);
  };

  const handleApplyCover = async (newUrl: string) => {
    setCustomCoverUrl(newUrl);
    try {
      safeStorage.setItem(`cosmo_novel_custom_cover_${novel.id}`, newUrl);
    } catch {}
    onUpdateCover?.(novel.id, newUrl);
    try {
      await saveNovelCoverToFirebase(novel.id, newUrl, novel.title);
    } catch (e) {
      console.warn('Could not auto-save cover to Firebase:', e);
    }
  };

  // Helper nén ảnh khi tải trực tiếp từ máy để tối ưu bộ nhớ & lưu Firestore an toàn
  const compressImageFile = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          callback(compressedDataUrl);
        } else {
          callback(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Tự động tải tệp ảnh từ máy và lưu ngay vào Firebase Firestore
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingToFirebase(true);

    compressImageFile(file, async (dataUrl) => {
      setPendingCoverUrl(dataUrl);
      setCustomCoverUrl(dataUrl);

      try {
        const res = await saveNovelCoverToFirebase(novel.id, dataUrl, novel.title);
        if (res.success) {
          onUpdateCover?.(novel.id, dataUrl);
          onUpdateNovel?.({ ...novel, coverImage: dataUrl, coverImageUrl: dataUrl });
          try {
            safeStorage.setItem(`cosmo_novel_custom_cover_${novel.id}`, dataUrl);
            const savedNovelsStr = safeStorage.getItem('cosmo_novels');
            if (savedNovelsStr) {
              const parsed: Novel[] = JSON.parse(savedNovelsStr);
              const next = parsed.map((n) =>
                n.id === novel.id ? { ...n, coverImage: dataUrl, coverImageUrl: dataUrl } : n
              );
              safeStorage.setItem('cosmo_novels', JSON.stringify(next));
            }
          } catch {}
          triggerToast('Đã lưu ảnh bìa vào Firebase!', 'Ảnh bìa mới đã được tải lên và lưu trực tiếp vào cơ sở dữ liệu Firebase Cloud.');
        } else {
          triggerToast('Lỗi lưu Firebase', res.error || 'Vui lòng kiểm tra lại kết nối mạng.');
        }
      } catch (err: any) {
        console.error('Lỗi khi tải ảnh bìa lên Firebase:', err);
        triggerToast('Lỗi lưu Firebase', 'Không thể đồng bộ ảnh bìa mới với máy chủ.');
      } finally {
        setIsUploadingToFirebase(false);
      }
    });
  };

  // Nút Lưu trực tiếp ảnh bìa từ trang thông tin truyện
  const handleSaveCoverDirect = async () => {
    const currentCover = activeCoverImage;
    if (!currentCover) return;
    setIsUploadingToFirebase(true);

    try {
      const res = await saveNovelCoverToFirebase(novel.id, currentCover, novel.title);
      if (res.success) {
        onUpdateCover?.(novel.id, currentCover);
        onUpdateNovel?.({ ...novel, coverImage: currentCover, coverImageUrl: currentCover });
        try {
          safeStorage.setItem(`cosmo_novel_custom_cover_${novel.id}`, currentCover);
          const savedNovelsStr = safeStorage.getItem('cosmo_novels');
          if (savedNovelsStr) {
            const parsed: Novel[] = JSON.parse(savedNovelsStr);
            const next = parsed.map((n) =>
              n.id === novel.id ? { ...n, coverImage: currentCover, coverImageUrl: currentCover } : n
            );
            safeStorage.setItem('cosmo_novels', JSON.stringify(next));
          }
        } catch {}
        triggerToast('Đã lưu ảnh bìa vào Firebase!', 'Ảnh bìa đã được lưu trực tiếp vào cơ sở dữ liệu Firebase Cloud.');
      } else {
        triggerToast('Lỗi lưu Firebase', res.error || 'Không thể lưu lên đám mây.');
      }
    } catch (err) {
      console.warn('Failed to save cover to Firebase', err);
      triggerToast('Lỗi lưu Firebase', 'Không thể đồng bộ ảnh bìa.');
    } finally {
      setIsUploadingToFirebase(false);
    }
  };

  // Nút Lưu ảnh bìa từ Modal thay đổi ảnh bìa
  const handleConfirmSaveCoverModal = async () => {
    const coverToSave = pendingCoverUrl || activeCoverImage;
    if (!coverToSave) return;
    setIsUploadingToFirebase(true);
    setCustomCoverUrl(coverToSave);

    try {
      const res = await saveNovelCoverToFirebase(novel.id, coverToSave, novel.title);
      if (res.success) {
        onUpdateCover?.(novel.id, coverToSave);
        onUpdateNovel?.({ ...novel, coverImage: coverToSave, coverImageUrl: coverToSave });
        try {
          safeStorage.setItem(`cosmo_novel_custom_cover_${novel.id}`, coverToSave);
          const savedNovelsStr = safeStorage.getItem('cosmo_novels');
          if (savedNovelsStr) {
            const parsed: Novel[] = JSON.parse(savedNovelsStr);
            const next = parsed.map((n) =>
              n.id === novel.id ? { ...n, coverImage: coverToSave, coverImageUrl: coverToSave } : n
            );
            safeStorage.setItem('cosmo_novels', JSON.stringify(next));
          }
        } catch {}
        setIsCoverModalOpen(false);
        triggerToast('Đã lưu ảnh bìa vào Firebase thành công!', 'Ảnh bìa mới đã được lưu trực tiếp vào cơ sở dữ liệu Firebase Cloud.');
      } else {
        triggerToast('Lỗi lưu Firebase', res.error || 'Không thể lưu lên đám mây.');
      }
    } catch (err) {
      console.warn('Failed to save cover from modal to Firebase', err);
      triggerToast('Lỗi lưu Firebase', 'Không thể đồng bộ ảnh bìa với máy chủ.');
    } finally {
      setIsUploadingToFirebase(false);
    }
  };

  // Comment state with safeStorage persistence and Firestore real-time sync
  const [comments, setComments] = useState<NovelComment[]>(() => {
    try {
      const saved = safeStorage.getItem(`cosmo_novel_comments_${novel.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter((c: NovelComment) => !isBotComment(c));
          try {
            safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(cleaned));
          } catch {}
          return cleaned;
        }
      }
    } catch {}
    return (novel.comments || []).filter((c) => !isBotComment(c));
  });
  const [newCommentText, setNewCommentText] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [userName, setUserName] = useState('');

  // Synchronize and subscribe to comments in real-time from Firestore & safeStorage
  useEffect(() => {
    let initialList: NovelComment[] = (novel.comments || []).filter((c) => !isBotComment(c));
    try {
      const saved = safeStorage.getItem(`cosmo_novel_comments_${novel.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialList = parsed.filter((c: NovelComment) => !isBotComment(c));
        }
      }
    } catch {}
    setComments(initialList);
    try {
      safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(initialList));
    } catch {}

    // Only subscribe to comments from Firestore if user opens the comments tab
    if (activeTab !== 'comments') return;

    const unsubscribe = subscribeBinhLuanList(
      novel.id,
      (firestoreComments) => {
        const cleanFirestore = firestoreComments.filter((c) => !isBotComment(c));
        const baseComments = (novel.comments || []).filter((c) => !isBotComment(c));
        const fsIds = new Set(cleanFirestore.map((c) => c.id));
        const remainingBase = baseComments.filter((c) => !fsIds.has(c.id));
        const merged = [...cleanFirestore, ...remainingBase];

        setComments(merged);
        try {
          safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(merged));
        } catch {}
        onUpdateNovel?.({ ...novel, comments: merged });
      },
      (err) => {
        console.warn('Realtime comments subscription warning:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [novel.id, activeTab]);

  // Chapter editing state
  const [editingChapter, setEditingChapter] = useState<NovelChapter | null>(null);
  const [editChapTitle, setEditChapTitle] = useState('');
  const [editChapContent, setEditChapContent] = useState('');
  const [editChapIsExtra, setEditChapIsExtra] = useState(false);
  const [isEditChapterModalOpen, setIsEditChapterModalOpen] = useState(false);
  const [isLoadingEditContent, setIsLoadingEditContent] = useState(false);
  const [isSavingEditChapter, setIsSavingEditChapter] = useState(false);

  // Chapter deletion state
  const [chapterToDelete, setChapterToDelete] = useState<NovelChapter | null>(null);
  const [isDeleteChapterModalOpen, setIsDeleteChapterModalOpen] = useState(false);
  const [isDeletingChapter, setIsDeletingChapter] = useState(false);

  // Comment deletion state
  const [commentToDelete, setCommentToDelete] = useState<NovelComment | null>(null);
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] = useState(false);

  // Effective world lore with fallback for Lua Nhau
  const effectiveWorldLore = novel.worldLore || (novel.id === 'lua-nhau' ? LUA_NHAU_NOVEL.worldLore : '');

  // Tag / Genre editing state
  const [isEditTagsModalOpen, setIsEditTagsModalOpen] = useState(false);
  const [editingGenresList, setEditingGenresList] = useState<string[]>(novel.genres || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [isSavingTags, setIsSavingTags] = useState(false);

  // Novel Synopsis Editing State
  const [isEditingSynopsis, setIsEditingSynopsis] = useState(false);
  const [editSynopsis, setEditSynopsis] = useState(novel.synopsis || '');
  const [editWorldLore, setEditWorldLore] = useState(effectiveWorldLore || '');
  const [editUploaderNote, setEditUploaderNote] = useState(novel.uploaderNote || '');
  const [isSavingSynopsis, setIsSavingSynopsis] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [activeSynopsisSubTab, setActiveSynopsisSubTab] = useState<'edit' | 'preview'>('edit');
  const synopsisSectionRef = useRef<HTMLDivElement>(null);

  // Synchronize edit inputs when novel prop updates
  useEffect(() => {
    setEditSynopsis(novel.synopsis || '');
    setEditWorldLore(effectiveWorldLore || '');
    setEditUploaderNote(novel.uploaderNote || '');
  }, [novel.id, novel.synopsis, effectiveWorldLore, novel.uploaderNote]);

  // New chapter authoring modal for this novel
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapNumber, setNewChapNumber] = useState<number>(1);
  const [newChapTitle, setNewChapTitle] = useState('');
  const [newChapContent, setNewChapContent] = useState('');
  const [newChapIsExtra, setNewChapIsExtra] = useState(false);
  const [isPublishingChapter, setIsPublishingChapter] = useState(false);

  // TXT file import modal & chapter type filter
  const [isTxtModalOpen, setIsTxtModalOpen] = useState(false);
  const [chapterTypeFilter, setChapterTypeFilter] = useState<'all' | 'main' | 'extra'>('all');

  // Share link popover state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const shareUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${window.location.pathname}#novel/${novel.id}`;
    }
    return '';
  }, [novel.id]);

  const handleCopyShareUrl = () => {
    if (shareUrl) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        }).catch(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        });
      } else {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    }
  };

  // Theme support for Detail View (consistent with Home & Reader)
  const [theme, setTheme] = useState<NovelThemeId>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_novel_theme');
      if (saved && ['slate-haze', 'sage', 'notebook', 'mocha', 'amethyst-haze', 'cosmic'].includes(saved)) {
        return saved as NovelThemeId;
      }
    } catch {}
    return 'amethyst-haze';
  });

  // Dark Mode support
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_darkmode');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Dark Background Option for non-white, non-cosmic dark themes
  const [darkBgOption, setDarkBgOption] = useState<DarkBackgroundOption>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_dark_bg_option');
      if (saved && DARK_BG_OPTIONS.some((o) => o.id === saved)) {
        return saved as DarkBackgroundOption;
      }
    } catch {}
    return 'clay-spheres';
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

  const [isBgMenuOpen, setIsBgMenuOpen] = useState(false);
  const bgMenuRef = useRef<HTMLDivElement>(null);

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (bgMenuRef.current && !bgMenuRef.current.contains(event.target as Node)) {
        setIsBgMenuOpen(false);
      }
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
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

  const handleSelectTheme = (newTheme: NovelThemeId) => {
    setTheme(newTheme);
    safeStorage.setItem('cosmo_novel_theme', newTheme);
    setIsThemeMenuOpen(false);
  };

  // Centralized Theme Color Styles
  const isCosmic = theme === 'cosmic';
  const isDarkEffective = isCosmic || isDarkMode;
  const tStyles = useMemo(() => getNovelThemeStyles(theme, isDarkEffective), [theme, isDarkEffective]);
  const currentThemeOption = NOVEL_THEME_OPTIONS.find((t) => t.id === theme) || NOVEL_THEME_OPTIONS[0];
  // Uniform font-source-serif across all themes
  const themeFontHeading = 'font-source-serif';

  // Theme-adaptive styles matching the screenshot across all 6 themes & light/dark
  const detailThemeExtras = useMemo(() => {
    switch (theme) {
      case 'notebook':
        return {
          cardBg: isDarkEffective ? 'bg-gradient-to-br from-white/[0.08] via-[#24201c]/50 to-[#12100e]/65 backdrop-blur-2xl border border-white/20 text-[#F7F4EE] shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_20px_rgba(247,244,238,0.08)]' : 'bg-white border-[#e5e5e5] text-[#171717]',
          cardBgSolid: isDarkEffective ? 'bg-[#141210]' : 'bg-white',
          tabHeaderBg: isDarkEffective ? 'bg-black/35 backdrop-blur-md border-b border-white/15' : 'bg-white border-b border-[#e5e5e5]',
          innerBox: isDarkEffective ? 'bg-white/[0.04] backdrop-blur-xl border border-white/12 text-[#F7F4EE] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]' : 'bg-white border-[#e5e5e5] text-[#525252]',
          activeTabBorderClass: isDarkEffective ? 'border-[#F7F4EE]' : 'border-[#737373]',
          statusBadge: isDarkEffective ? 'bg-neutral-800 border border-neutral-700 text-[#F7F4EE] shadow-xs' : 'bg-[#737373] text-white',
          statBox: isDarkEffective ? 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-[#F7F4EE] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]' : 'bg-white border-[#e5e5e5] text-[#171717]',
          tagPill: isDarkEffective ? 'bg-white/[0.07] backdrop-blur-md text-[#D9D4C9] border border-white/15 hover:bg-white/[0.14]' : 'bg-white text-[#525252] border border-[#e5e5e5] hover:bg-[#fafafa]',
          authorBadge: isDarkEffective ? 'bg-white/[0.07] backdrop-blur-md text-[#F7F4EE] border border-white/15' : 'bg-white text-[#171717] border border-[#e5e5e5]',
          noteBox: isDarkEffective ? 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-[#D9D4C9] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-white border-[#e5e5e5] text-[#525252]',
          noteIcon: isDarkEffective ? 'text-[#d9d4c9]' : 'text-[#737373]',
          primaryBtn: isDarkEffective ? 'bg-[#F7F4EE] hover:bg-white text-[#141210] font-bold shadow-lg shadow-white/15' : 'bg-[#737373] hover:bg-[#525252] text-white font-semibold shadow-sm',
          secondaryBtn: isDarkEffective ? 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.15] text-[#F7F4EE] border border-white/20' : 'bg-white hover:bg-[#fafafa] text-[#171717] border border-[#e5e5e5]',
          outlineBtn: isDarkEffective ? 'bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.1] text-[#F7F4EE] border border-white/15' : 'bg-white hover:bg-[#fafafa] text-[#171717] border border-[#e5e5e5]',
          coverGradient: isDarkEffective
            ? 'bg-gradient-to-br from-[#2b221a] via-[#352a21] to-[#403328]'
            : 'bg-gradient-to-br from-[#f5f5f5] via-[#ffffff] to-[#e5e5e5]',
          circleTopLeft: isDarkEffective
            ? 'bg-gradient-to-br from-[#1c1611] to-[#281f18] border border-white/15'
            : 'bg-gradient-to-br from-[#737373]/15 to-[#a3a3a3]/10 border border-[#e5e5e5]',
          circleBehindCover: isDarkEffective
            ? 'bg-gradient-to-tr from-white/20 via-neutral-500/15 to-transparent border border-white/25 shadow-inner'
            : 'bg-gradient-to-tr from-[#737373]/10 via-[#e5e5e5]/40 to-white/40 border border-[#e5e5e5] shadow-inner',
          circleBottomRight: isDarkEffective
            ? 'bg-gradient-to-tl from-[#554233]/60 via-[#3a2d22]/35 to-transparent'
            : 'bg-gradient-to-tl from-white via-[#e5e5e5]/40 to-transparent',
          coverOverlay: isDarkEffective
            ? 'bg-gradient-to-t from-[#141210]/80 via-[#141210]/25 to-transparent'
            : 'bg-gradient-to-t from-white/80 via-transparent to-transparent',
          // Theme-aware poster styles (Đồng bộ chuẩn xác Paper: Nền #ffffff, Viền #e5e5e5, Chủ đạo #ffffff, Nút #737373)
          posterCardBorder: isDarkEffective ? 'border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_25px_rgba(255,255,255,0.1)]' : 'border border-[#e5e5e5]',
          posterGradient: isDarkEffective
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(36, 32, 28, 0.52) 35%, rgba(18, 16, 14, 0.65) 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #fafafa 35%, #f5f5f5 70%, #eeeeee 100%)',
          posterDiscLeftSeparate: isDarkEffective
            ? 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, rgba(36, 32, 28, 0.4) 65%, transparent 88%)'
            : 'radial-gradient(circle at 50% 50%, rgba(229, 229, 229, 0.7) 0%, rgba(229, 229, 229, 0.25) 65%, transparent 88%)',
          posterDiscTopRight: isDarkEffective
            ? 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, rgba(36, 32, 28, 0.35) 65%, transparent 88%)'
            : 'radial-gradient(circle at 50% 50%, rgba(229, 229, 229, 0.65) 0%, rgba(229, 229, 229, 0.2) 65%, transparent 88%)',
          posterArcBottomRight: isDarkEffective
            ? 'radial-gradient(circle at center, rgba(184, 178, 165, 0.25) 0%, rgba(184, 178, 165, 0.08) 45%, transparent 75%)'
            : 'radial-gradient(circle at center, rgba(229, 229, 229, 0.5) 0%, rgba(229, 229, 229, 0.15) 50%, transparent 75%)',
          posterStatusBadgeBg: isDarkEffective ? 'bg-neutral-800 border border-neutral-700 text-[#F7F4EE] shadow-xs' : 'bg-[#737373] text-white',
          posterPrimaryBtn: isDarkEffective
            ? 'bg-[#F7F4EE] hover:bg-white text-[#181614] font-bold shadow-lg shadow-white/15'
            : 'bg-[#737373] hover:bg-[#525252] text-white shadow-sm font-semibold',
          posterTextColor: isDarkEffective ? 'text-[#F7F4EE]' : 'text-[#171717]',
          posterSubTextColor: isDarkEffective ? 'text-[#D9D4C9]' : 'text-[#525252]',
          posterMutedText: isDarkEffective ? 'text-[#9A958C]' : 'text-[#737373]',
          posterTagClass: isDarkEffective
            ? 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] text-[#F7F4EE] border border-white/20'
            : 'bg-white hover:bg-[#fafafa] text-[#171717] border border-[#e5e5e5] shadow-2xs',
          posterNoteBox: isDarkEffective
            ? 'border border-white/15 bg-white/[0.05] backdrop-blur-md text-[#D9D4C9] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
            : 'border-[#e5e5e5] bg-white text-[#525252] shadow-xs',
          posterNoteTitle: isDarkEffective ? 'text-[#F7F4EE]' : 'text-[#171717]',
          posterNoteContent: isDarkEffective ? 'text-[#D9D4C9]' : 'text-[#525252]',
          posterReadNextBtn: isDarkEffective
            ? 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] border border-white/20 text-[#F7F4EE] shadow-md'
            : 'bg-white hover:bg-[#fafafa] text-[#171717] border border-[#e5e5e5] shadow-xs',
          gridPattern: {
            baseGradient: isDarkEffective
              ? 'linear-gradient(135deg, rgba(28, 25, 23, 0.85) 0%, rgba(20, 18, 16, 0.95) 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #fafafa 40%, #f4f4f2 100%)',
            glowGradient: isDarkEffective
              ? 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(247, 244, 238, 0.09) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(228, 228, 231, 0.65) 0%, transparent 70%)',
            gridLineColor: isDarkEffective
              ? 'rgba(247, 244, 238, 0.14)'
              : 'rgba(113, 113, 122, 0.2)',
            gridSubtleColor: isDarkEffective
              ? 'rgba(247, 244, 238, 0.05)'
              : 'rgba(113, 113, 122, 0.07)',
          },
        };
      case 'mocha':
        return {
          cardBg: isDarkEffective ? 'bg-gradient-to-br from-white/[0.08] via-[#231812]/50 to-[#15100c]/65 backdrop-blur-2xl border border-white/20 text-[#ece2da] shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]' : 'bg-[#f7f3eb] border-[#E4D9BC] text-[#3A2A2A]',
          cardBgSolid: isDarkEffective ? 'bg-[#15100c]' : 'bg-[#f7f3eb]',
          tabHeaderBg: isDarkEffective ? 'bg-black/35 backdrop-blur-md border-b border-white/15' : 'bg-white border-b border-[#E4D9BC]',
          innerBox: isDarkEffective ? 'bg-white/[0.04] backdrop-blur-xl border border-white/12 text-[#e4dbd4] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]' : 'bg-white border-[#E4D9BC] text-[#3A2A2A]',
          activeTabBorderClass: isDarkEffective ? 'border-amber-600' : 'border-[#A37764]',
          statusBadge: isDarkEffective ? 'bg-gradient-to-r from-amber-700 to-[#8c6046] text-white shadow-md shadow-amber-950/30' : 'bg-[#A37764] text-white',
          statBox: isDarkEffective ? 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-[#ece2da] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]' : 'bg-white border-[#E4D9BC] text-[#3A2A2A]',
          tagPill: isDarkEffective ? 'bg-amber-500/15 backdrop-blur-md text-amber-200 border border-amber-400/30 hover:bg-amber-500/25' : 'bg-[#f0e9dc] text-[#3A2A2A] border border-[#E4D9BC] hover:bg-white',
          authorBadge: isDarkEffective ? 'bg-amber-500/15 backdrop-blur-md text-amber-200 border border-amber-400/30' : 'bg-[#f0e9dc] text-[#3A2A2A] border border-[#E4D9BC]',
          noteBox: isDarkEffective ? 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-[#e4dbd4] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-[#F8F4EE] border-[#E4D9BC] text-[#8C7A6E]',
          noteIcon: isDarkEffective ? 'text-amber-400' : 'text-[#A37764]',
          primaryBtn: isDarkEffective ? 'bg-gradient-to-r from-amber-700 to-[#8c6046] hover:from-amber-600 hover:to-[#9c6d52] text-white font-semibold shadow-lg shadow-amber-950/35' : 'bg-[#A37764] hover:bg-[#8f6452] text-white font-semibold',
          secondaryBtn: isDarkEffective ? 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.15] text-[#e0d3c9] border border-white/20' : 'bg-[#f0e9dc] hover:bg-[#e7dfcf] text-[#3A2A2A] border border-[#E4D9BC]',
          outlineBtn: isDarkEffective ? 'bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.1] text-[#cfbaa9] border border-white/15' : 'bg-[#F8F4EE] hover:bg-[#f0e9dc] text-[#3A2A2A] border border-[#E4D9BC]',
          coverGradient: isDarkEffective
            ? 'bg-gradient-to-br from-[#24160f] via-[#2f1d13] to-[#3a2418]'
            : 'bg-gradient-to-br from-[#F8F4EE] via-[#f5f1e6] to-[#E4D9BC]',
          circleTopLeft: isDarkEffective
            ? 'bg-gradient-to-br from-[#190e09] to-[#27170f] border border-[#4a3224]/30'
            : 'bg-gradient-to-br from-[#A37764]/20 to-[#3A2A2A]/15 border border-[#A37764]/20',
          circleBehindCover: isDarkEffective
            ? 'bg-gradient-to-tr from-[#4a3224]/20 via-[#3d271c]/15 to-transparent border border-[#4a3224]/30 shadow-inner'
            : 'bg-gradient-to-tr from-[#A37764]/15 via-[#8C7A6E]/15 to-white/40 border border-[#A37764]/20 shadow-inner',
          circleBottomRight: isDarkEffective
            ? 'bg-gradient-to-tl from-[#3a2418]/40 via-[#281810]/25 to-transparent'
            : 'bg-gradient-to-tl from-[#F8F4EE]/60 via-[#E4D9BC]/40 to-transparent',
          coverOverlay: isDarkEffective
            ? 'bg-gradient-to-t from-[#120b08]/80 via-[#120b08]/25 to-transparent'
            : 'bg-gradient-to-t from-white/40 via-transparent to-transparent',
          // Theme-aware poster styles (Đồng bộ chuẩn xác màu sắc Linen dịu mắt)
          posterCardBorder: isDarkEffective ? 'border border-[#3d271c]/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)]' : 'border border-[#3A2A2A]/[0.08]',
          posterGradient: isDarkEffective
            ? 'linear-gradient(135deg, rgba(28, 18, 13, 0.9) 0%, rgba(20, 13, 9, 0.95) 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f5f1e6 35%, #F8F4EE 70%, #ede6d8 100%)',
          posterDiscLeftSeparate: isDarkEffective
            ? 'radial-gradient(circle at 50% 50%, rgba(120, 85, 65, 0.12) 0%, rgba(80, 55, 40, 0.04) 60%, transparent 85%)'
            : 'radial-gradient(circle at 50% 50%, rgba(228, 217, 188, 0.7) 0%, rgba(228, 217, 188, 0.25) 65%, transparent 88%)',
          posterDiscTopRight: isDarkEffective
            ? 'radial-gradient(circle at 50% 50%, rgba(120, 85, 65, 0.12) 0%, rgba(80, 55, 40, 0.04) 60%, transparent 85%)'
            : 'radial-gradient(circle at 50% 50%, rgba(228, 217, 188, 0.65) 0%, rgba(228, 217, 188, 0.2) 65%, transparent 88%)',
          posterArcBottomRight: isDarkEffective
            ? 'radial-gradient(circle at center, rgba(120, 85, 65, 0.1) 0%, rgba(80, 55, 40, 0.03) 50%, transparent 75%)'
            : 'radial-gradient(circle at center, rgba(228, 217, 188, 0.5) 0%, rgba(228, 217, 188, 0.15) 50%, transparent 75%)',
          posterStatusBadgeBg: isDarkEffective ? 'bg-[#4d3424] text-[#d6c2b4] border border-[#6b4c37]/40 shadow-xs' : 'bg-[#A37764] text-white',
          posterPrimaryBtn: isDarkEffective
            ? 'bg-[#4d3424] hover:bg-[#5c3e2e] text-[#d6c2b4] shadow-xs font-semibold'
            : 'bg-[#A37764] hover:bg-[#8f6452] text-white shadow-sm font-semibold',
          posterTextColor: isDarkEffective ? 'text-[#cbbbaf]' : 'text-[#3A2A2A]',
          posterSubTextColor: isDarkEffective ? 'text-[#9c897d]' : 'text-[#8C7A6E]',
          posterMutedText: isDarkEffective ? 'text-[#705e53]' : 'text-[#8C7A6E]',
          posterTagClass: isDarkEffective
            ? 'bg-[#2b1c14]/60 backdrop-blur-md border border-[#4a3224]/40 text-[#bda99b] hover:border-[#694834]/50'
            : 'bg-[#F8F4EE] hover:bg-white text-[#3A2A2A] border border-[#E4D9BC] shadow-2xs',
          posterNoteBox: isDarkEffective
            ? 'border border-[#3d271c]/50 bg-[#170f0b]/80 text-[#a89588]'
            : 'border-[#E4D9BC] bg-[#F8F4EE] text-[#8C7A6E] shadow-xs',
          posterNoteTitle: isDarkEffective ? 'text-[#cbbbaf]' : 'text-[#3A2A2A]',
          posterNoteContent: isDarkEffective ? 'text-[#a89588]' : 'text-[#8C7A6E]',
          posterReadNextBtn: isDarkEffective
            ? 'bg-[#1f140e]/70 backdrop-blur-md hover:bg-[#2b1c14]/80 border border-[#3d271c]/40 text-[#bda99b] shadow-xs'
            : 'bg-transparent hover:bg-[#F8F4EE] text-[#3A2A2A] border border-[#E4D9BC] shadow-xs',
          gridPattern: {
            baseGradient: isDarkEffective
              ? 'linear-gradient(135deg, rgba(30, 20, 14, 0.85) 0%, rgba(20, 13, 9, 0.95) 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f7f3ea 40%, #eee6d8 100%)',
            glowGradient: isDarkEffective
              ? 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(163, 119, 100, 0.16) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(228, 217, 188, 0.65) 0%, transparent 70%)',
            gridLineColor: isDarkEffective
              ? 'rgba(228, 217, 188, 0.16)'
              : 'rgba(163, 119, 100, 0.22)',
            gridSubtleColor: isDarkEffective
              ? 'rgba(228, 217, 188, 0.06)'
              : 'rgba(163, 119, 100, 0.08)',
          },
        };
      case 'slate-haze':
        return {
          cardBg: isDarkEffective ? 'bg-gradient-to-br from-white/[0.08] via-[#101b27]/50 to-[#080d14]/65 backdrop-blur-2xl border border-white/20 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_20px_rgba(56,189,248,0.1)]' : 'bg-white border-[#d8dfe9] text-[#101723]',
          cardBgSolid: isDarkEffective ? 'bg-[#090e16]' : 'bg-white',
          tabHeaderBg: isDarkEffective ? 'bg-black/35 backdrop-blur-md border-b border-white/15' : 'bg-white border-b border-[#d8dfe9]',
          innerBox: isDarkEffective ? 'bg-white/[0.04] backdrop-blur-xl border border-white/12 text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]' : 'bg-white border-[#d8dfe9] text-[#101723]',
          activeTabBorderClass: isDarkEffective ? 'border-sky-400' : 'border-[#87909d]',
          statusBadge: isDarkEffective ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/30' : 'bg-[#87909d] text-white',
          statBox: isDarkEffective ? 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]' : 'bg-white border-[#d8dfe9] text-[#101723]',
          tagPill: isDarkEffective ? 'bg-sky-500/15 backdrop-blur-md text-sky-200 border border-sky-400/30 hover:bg-sky-500/25' : 'bg-[#f3f7fc] text-[#101723] border border-[#d8dfe9] hover:bg-white',
          authorBadge: isDarkEffective ? 'bg-sky-500/15 backdrop-blur-md text-sky-200 border border-sky-400/30' : 'bg-[#f3f7fc] text-[#101723] border border-[#d8dfe9]',
          noteBox: isDarkEffective ? 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-white border-[#d8dfe9] text-[#475569]',
          noteIcon: isDarkEffective ? 'text-sky-400' : 'text-[#87909d]',
          primaryBtn: isDarkEffective ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-sky-600/35' : 'bg-[#87909d] hover:bg-[#767f8c] text-white font-semibold',
          secondaryBtn: isDarkEffective ? 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.15] text-[#abc3d7] border border-white/20' : 'bg-[#f9fcff] hover:bg-[#f3f7fc] text-[#101723] border border-[#d8dfe9]',
          outlineBtn: isDarkEffective ? 'bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.1] text-slate-300 border border-white/15' : 'bg-[#f9fcff] hover:bg-[#f3f7fc] text-[#101723] border border-[#d8dfe9]',
          coverGradient: isDarkEffective
            ? 'bg-gradient-to-br from-[#0c2236] via-[#0f2e46] to-[#123e59]'
            : 'bg-gradient-to-br from-[#d8dfe9] via-[#f3f7fc] to-[#f9fcff]',
          circleTopLeft: isDarkEffective
            ? 'bg-gradient-to-br from-[#071724] to-[#0d263b] border border-sky-400/20'
            : 'bg-gradient-to-br from-[#87909d]/15 to-[#475569]/10 border border-[#d8dfe9]',
          circleBehindCover: isDarkEffective
            ? 'bg-gradient-to-tr from-sky-600/30 via-blue-600/20 to-transparent border border-sky-400/30 shadow-inner'
            : 'bg-gradient-to-tr from-[#87909d]/10 via-[#d8dfe9]/40 to-white/40 border border-[#d8dfe9] shadow-inner',
          circleBottomRight: isDarkEffective
            ? 'bg-gradient-to-tl from-[#195a7a]/60 via-[#103e54]/35 to-transparent'
            : 'bg-gradient-to-tl from-[#f3f7fc] via-[#d8dfe9]/40 to-transparent',
          coverOverlay: isDarkEffective
            ? 'bg-gradient-to-t from-[#090e16]/80 via-[#090e16]/25 to-transparent'
            : 'bg-gradient-to-t from-[#f9fcff]/80 via-transparent to-transparent',
          // Theme-aware poster styles (Đồng bộ Frost nền #f3f7fc, viền #d8dfe9, chủ đạo #f9fcff, nút #87909d)
          posterCardBorder: isDarkEffective ? 'border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_25px_rgba(56,189,248,0.15)]' : 'border border-[#d8dfe9]',
          posterGradient: isDarkEffective
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(16, 27, 39, 0.52) 35%, rgba(8, 13, 20, 0.65) 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f9fcff 35%, #f3f7fc 70%, #e2eaf4 100%)',
          posterDiscLeftSeparate: isDarkEffective
            ? 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.4) 0%, rgba(37, 99, 235, 0.15) 60%, transparent 85%)'
            : 'radial-gradient(circle at 50% 50%, rgba(216, 223, 233, 0.6) 0%, rgba(216, 223, 233, 0.2) 65%, transparent 88%)',
          posterDiscTopRight: isDarkEffective
            ? 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.4) 0%, rgba(37, 99, 235, 0.15) 60%, transparent 85%)'
            : 'radial-gradient(circle at 50% 50%, rgba(216, 223, 233, 0.6) 0%, rgba(216, 223, 233, 0.18) 65%, transparent 88%)',
          posterArcBottomRight: isDarkEffective
            ? 'radial-gradient(circle at center, rgba(56, 189, 248, 0.35) 0%, rgba(37, 99, 235, 0.15) 50%, transparent 75%)'
            : 'radial-gradient(circle at center, rgba(216, 223, 233, 0.5) 0%, rgba(216, 223, 233, 0.15) 50%, transparent 75%)',
          posterStatusBadgeBg: isDarkEffective ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border border-sky-400/30 shadow-md shadow-sky-600/30' : 'bg-[#87909d] text-white',
          posterPrimaryBtn: isDarkEffective
            ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-lg shadow-sky-600/35 font-semibold'
            : 'bg-[#87909d] hover:bg-[#767f8c] text-white shadow-sm font-semibold',
          posterTextColor: isDarkEffective ? 'text-[#eaf0f6]' : 'text-[#101723]',
          posterSubTextColor: isDarkEffective ? 'text-[#c0d3e5]' : 'text-[#475569]',
          posterMutedText: isDarkEffective ? 'text-[#8299af]' : 'text-[#64748b]',
          posterTagClass: isDarkEffective
            ? 'bg-sky-500/15 backdrop-blur-md border border-sky-400/30 text-sky-200 hover:border-sky-400/50'
            : 'bg-[#f3f7fc] hover:bg-white text-[#101723] border border-[#d8dfe9] shadow-2xs',
          posterNoteBox: isDarkEffective
            ? 'border border-white/15 bg-white/[0.05] backdrop-blur-md text-[#adbfd0] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
            : 'border-[#d8dfe9] bg-white text-[#475569] shadow-xs',
          posterNoteTitle: isDarkEffective ? 'text-[#eaf0f6]' : 'text-[#101723]',
          posterNoteContent: isDarkEffective ? 'text-[#adbfd0]' : 'text-[#475569]',
          posterReadNextBtn: isDarkEffective
            ? 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] border border-white/20 text-[#cfdce8] shadow-md'
            : 'bg-[#f9fcff] hover:bg-[#f3f7fc] text-[#101723] border border-[#d8dfe9] shadow-xs',
          gridPattern: {
            baseGradient: isDarkEffective
              ? 'linear-gradient(135deg, rgba(16, 27, 39, 0.88) 0%, rgba(8, 13, 20, 0.96) 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f4f8fd 40%, #e6eef7 100%)',
            glowGradient: isDarkEffective
              ? 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(56, 189, 248, 0.16) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(216, 235, 255, 0.75) 0%, transparent 70%)',
            gridLineColor: isDarkEffective
              ? 'rgba(56, 189, 248, 0.18)'
              : 'rgba(56, 189, 248, 0.28)',
            gridSubtleColor: isDarkEffective
              ? 'rgba(56, 189, 248, 0.06)'
              : 'rgba(125, 143, 166, 0.12)',
          },
        };
      case 'amethyst-haze':
        return {
          cardBg: isDarkEffective ? 'bg-gradient-to-br from-white/[0.08] via-[#1a122e]/50 to-[#0c0817]/65 backdrop-blur-2xl border border-white/20 text-purple-100 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_20px_rgba(168,85,247,0.1)]' : 'bg-[#f8f6fc] border-[#ded7eb] text-[#211c2f]',
          cardBgSolid: isDarkEffective ? 'bg-[#0e0a1b]' : 'bg-[#f8f6fc]',
          tabHeaderBg: isDarkEffective ? 'bg-black/35 backdrop-blur-md border-b border-white/15' : 'bg-white border-b border-[#ded7eb]',
          innerBox: isDarkEffective ? 'bg-white/[0.04] backdrop-blur-xl border border-white/12 text-purple-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]' : 'bg-white border-[#ded7eb] text-[#211c2f]',
          activeTabBorderClass: isDarkEffective ? 'border-purple-400' : 'border-[#685d85]',
          statusBadge: isDarkEffective ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30' : 'bg-[#6a5b8a] text-white',
          statBox: isDarkEffective ? 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-purple-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]' : 'bg-white border-[#ded7eb] text-[#211c2f]',
          tagPill: isDarkEffective ? 'bg-purple-500/15 backdrop-blur-md text-purple-200 border border-purple-400/30 hover:bg-purple-500/25' : 'bg-[#ede9f5] text-[#34294a] hover:bg-[#e4ddf0] border border-[#ded7eb]',
          authorBadge: isDarkEffective ? 'bg-purple-500/15 backdrop-blur-md text-purple-200 border border-purple-400/30' : 'bg-[#ede9f5] text-[#211c2f] border border-[#ded7eb]',
          noteBox: isDarkEffective ? 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-purple-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-[#f7f4fb] border-[#ded7eb] text-[#423956]',
          noteIcon: isDarkEffective ? 'text-purple-400' : 'text-[#6a5b8a]',
          primaryBtn: isDarkEffective ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/35' : 'bg-[#6a5b8a] hover:bg-[#574972] text-white',
          secondaryBtn: isDarkEffective ? 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.15] text-[#bdaedc] border border-white/20' : 'bg-[#ede9f5] hover:bg-[#e2d9ec] text-[#211c2f] border border-[#cac6d6]',
          outlineBtn: isDarkEffective ? 'bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.1] text-stone-300 border border-white/15' : 'bg-[#f7f4fb] hover:bg-[#ede9f5] text-[#211c2f] border border-[#ded7eb]',
          coverGradient: isDarkEffective
            ? 'bg-gradient-to-br from-[#1d142d] via-[#281b3d] to-[#33224f]'
            : 'bg-gradient-to-br from-[#e0d4eb] via-[#cfbede] to-[#bba3cd]',
          circleTopLeft: isDarkEffective
            ? 'bg-gradient-to-br from-[#120b1d] to-[#1c122b] border border-purple-400/20'
            : 'bg-gradient-to-br from-[#684f85]/35 to-[#4a3562]/25 border border-[#4a3562]/20',
          circleBehindCover: isDarkEffective
            ? 'bg-gradient-to-tr from-purple-600/25 via-fuchsia-600/20 to-transparent border border-purple-400/30 shadow-inner'
            : 'bg-gradient-to-tr from-[#684f85]/20 via-[#8a6ea8]/15 to-white/40 border border-[#684f85]/25 shadow-inner',
          circleBottomRight: isDarkEffective
            ? 'bg-gradient-to-tl from-[#4a2e72]/60 via-[#321e50]/35 to-transparent'
            : 'bg-gradient-to-tl from-[#a385c2]/45 via-[#bb9fd7]/30 to-transparent',
          coverOverlay: isDarkEffective
            ? 'bg-gradient-to-t from-[#0e0a1b]/80 via-[#0e0a1b]/25 to-transparent'
            : 'bg-gradient-to-t from-white/40 via-transparent to-transparent',
          // Theme-aware poster styles (Đồng bộ chuẩn xác màu sắc trang chủ Amethyst Haze)
          posterCardBorder: isDarkEffective ? 'border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_25px_rgba(168,85,247,0.15)]' : 'border border-[#211c2f]/[0.08]',
          posterGradient: isDarkEffective
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(26, 18, 46, 0.52) 35%, rgba(12, 8, 23, 0.65) 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f7f4fb 35%, #ebe5f3 70%, #ded6e9 100%)',
          posterDiscLeftSeparate: isDarkEffective
            ? 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.4) 0%, rgba(99, 102, 241, 0.15) 60%, transparent 85%)'
            : 'radial-gradient(circle at 50% 50%, rgba(218, 215, 231, 0.65) 0%, rgba(192, 185, 212, 0.25) 65%, transparent 88%)',
          posterDiscTopRight: isDarkEffective
            ? 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.4) 0%, rgba(99, 102, 241, 0.15) 60%, transparent 85%)'
            : 'radial-gradient(circle at 50% 50%, rgba(218, 215, 231, 0.6) 0%, rgba(192, 185, 212, 0.22) 65%, transparent 88%)',
          posterArcBottomRight: isDarkEffective
            ? 'radial-gradient(circle at center, rgba(168, 85, 247, 0.35) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 75%)'
            : 'radial-gradient(circle at center, rgba(218, 215, 231, 0.5) 0%, rgba(218, 215, 231, 0.12) 50%, transparent 75%)',
          posterStatusBadgeBg: isDarkEffective ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400/30 shadow-md shadow-purple-600/30' : 'bg-[#7e739f] text-white',
          posterPrimaryBtn: isDarkEffective
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/35 font-semibold'
            : 'bg-[#7e739f] hover:bg-[#6c618c] text-white shadow-sm font-semibold',
          posterTextColor: isDarkEffective ? 'text-[#f0edf7]' : 'text-[#211c2f]',
          posterSubTextColor: isDarkEffective ? 'text-[#cfc4e5]' : 'text-[#544a6b]',
          posterMutedText: isDarkEffective ? 'text-[#9789ad]' : 'text-[#8d82a6]',
          posterTagClass: isDarkEffective
            ? 'bg-purple-500/15 backdrop-blur-md border border-purple-400/30 text-purple-200 hover:border-purple-400/50'
            : 'bg-[#ede9f5] hover:bg-white text-[#34294a] border border-[#d3cde1] shadow-2xs',
          posterNoteBox: isDarkEffective
            ? 'border border-white/15 bg-white/[0.05] backdrop-blur-md text-[#bfb2d4] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
            : 'border-[#ded8ea] bg-[#f7f4fb] text-[#423956] shadow-xs',
          posterNoteTitle: isDarkEffective ? 'text-[#f0edf7]' : 'text-[#211c2f]',
          posterNoteContent: isDarkEffective ? 'text-[#bfb2d4]' : 'text-[#423956]',
          posterReadNextBtn: isDarkEffective
            ? 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] border border-white/20 text-[#d6cde8] shadow-md'
            : 'bg-white hover:bg-[#f7f4fb] text-[#211c2f] border border-[#cac6d6] shadow-xs',
          gridPattern: {
            baseGradient: isDarkEffective
              ? 'linear-gradient(135deg, rgba(26, 18, 46, 0.88) 0%, rgba(12, 8, 23, 0.96) 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f7f4fb 40%, #ebe4f4 100%)',
            glowGradient: isDarkEffective
              ? 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(168, 85, 247, 0.18) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(233, 222, 248, 0.7) 0%, transparent 70%)',
            gridLineColor: isDarkEffective
              ? 'rgba(192, 132, 252, 0.17)'
              : 'rgba(147, 51, 234, 0.22)',
            gridSubtleColor: isDarkEffective
              ? 'rgba(192, 132, 252, 0.06)'
              : 'rgba(126, 115, 159, 0.08)',
          },
        };
      case 'cosmic':
        return {
          cardBg: 'bg-gradient-to-br from-white/[0.08] via-[#151239]/50 to-[#0a0c24]/65 backdrop-blur-2xl border border-white/20 text-purple-100 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_20px_rgba(168,85,247,0.12)]',
          cardBgSolid: 'bg-[#0a0c24]',
          tabHeaderBg: 'bg-black/35 backdrop-blur-md border-b border-white/15',
          innerBox: 'bg-white/[0.04] backdrop-blur-xl border border-white/12 text-purple-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]',
          activeTabBorderClass: 'border-pink-500',
          statusBadge: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-600/30',
          statBox: 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-purple-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
          tagPill: 'bg-purple-500/15 backdrop-blur-md text-purple-200 border border-purple-400/30 hover:bg-purple-500/25',
          authorBadge: 'bg-purple-500/15 backdrop-blur-md text-purple-200 border border-purple-400/30',
          noteBox: 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-purple-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
          noteIcon: 'text-pink-400',
          primaryBtn: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-md shadow-pink-600/30',
          secondaryBtn: 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.15] text-purple-200 border border-white/20',
          outlineBtn: 'bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.1] text-purple-200 border border-white/15',
          coverGradient: 'bg-gradient-to-br from-[#0a1232] via-[#111e50] to-[#0c364e]',
          circleTopLeft: 'bg-gradient-to-br from-[#050b20] to-[#0a1538] border border-cyan-400/25',
          circleBehindCover: 'bg-gradient-to-tr from-cyan-400/30 via-purple-500/25 to-pink-500/20 border border-cyan-300/35 shadow-inner',
          circleBottomRight: 'bg-gradient-to-tl from-[#00b4d8]/55 via-[#7209b7]/40 to-transparent',
          coverOverlay: 'bg-gradient-to-t from-[#0a0c24]/80 via-[#0a0c24]/25 to-transparent',
          // Theme-aware poster styles (Đồng bộ chuẩn xác màu sắc trang chủ Cosmic)
          posterCardBorder: 'border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_25px_rgba(168,85,247,0.15)]',
          posterGradient:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(26, 20, 58, 0.52) 35%, rgba(11, 13, 36, 0.65) 100%)',
          posterDiscLeftSeparate:
            'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.4) 0%, rgba(236, 72, 153, 0.15) 60%, transparent 85%)',
          posterDiscTopRight:
            'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.4) 0%, rgba(236, 72, 153, 0.15) 60%, transparent 85%)',
          posterArcBottomRight:
            'radial-gradient(circle at center, rgba(236, 72, 153, 0.35) 0%, rgba(147, 51, 234, 0.15) 50%, transparent 75%)',
          posterStatusBadgeBg: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border border-pink-400/30 shadow-md shadow-pink-600/30',
          posterPrimaryBtn:
            'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/35',
          posterTextColor: 'text-white',
          posterSubTextColor: 'text-purple-100/90',
          posterMutedText: 'text-purple-300/70',
          posterTagClass:
            'bg-purple-500/15 backdrop-blur-md border border-purple-400/30 text-purple-200 hover:border-pink-400/50',
          posterNoteBox: 'border border-white/15 bg-white/[0.05] backdrop-blur-md text-purple-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
          posterNoteTitle: 'text-white',
          posterNoteContent: 'text-purple-200/80',
          posterReadNextBtn:
            'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] border border-white/20 text-slate-200 shadow-md',
          gridPattern: {
            baseGradient: 'linear-gradient(135deg, rgba(21, 18, 57, 0.88) 0%, rgba(10, 12, 36, 0.96) 100%)',
            glowGradient: 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(168, 85, 247, 0.22) 0%, rgba(6, 182, 212, 0.1) 45%, transparent 70%)',
            gridLineColor: 'rgba(192, 132, 252, 0.22)',
            gridSubtleColor: 'rgba(6, 182, 212, 0.09)',
          },
        };
      case 'sage':
      default:
        return {
          cardBg: isDarkEffective ? 'bg-gradient-to-br from-white/[0.08] via-[#142318]/50 to-[#0c1510]/65 backdrop-blur-2xl border border-white/20 text-[#e0ede2] shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]' : 'bg-[#f2f7f1] border-[#cad8c6]/80 text-[#1c2b1e]',
          cardBgSolid: isDarkEffective ? 'bg-[#0c1510]' : 'bg-[#f2f7f1]',
          tabHeaderBg: isDarkEffective ? 'bg-black/35 backdrop-blur-md border-b border-white/15' : 'bg-white border-b border-[#cad8c6]/80',
          innerBox: isDarkEffective ? 'bg-white/[0.04] backdrop-blur-xl border border-white/12 text-[#d5e5d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]' : 'bg-white border-[#cad8c6] text-[#1c2b1e]',
          activeTabBorderClass: isDarkEffective ? 'border-emerald-600' : 'border-[#466244]',
          statusBadge: isDarkEffective ? 'bg-gradient-to-r from-emerald-700 to-green-700 text-white shadow-md shadow-emerald-900/30' : 'bg-[#466244] text-white',
          statBox: isDarkEffective ? 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-[#e0ede2] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]' : 'bg-white border-[#cad8c6] text-[#1c2b1e]',
          tagPill: isDarkEffective ? 'bg-emerald-500/15 backdrop-blur-md text-emerald-200 border border-emerald-400/30 hover:bg-emerald-500/25' : 'bg-[#eaf1e8] text-[#1c2b1e] hover:bg-[#dfebdc] border border-[#cad8c6]',
          authorBadge: isDarkEffective ? 'bg-emerald-500/15 backdrop-blur-md text-emerald-200 border border-emerald-400/30' : 'bg-[#eaf1e8] text-[#1c2b1e] border border-[#cad8c6]',
          noteBox: isDarkEffective ? 'bg-white/[0.05] backdrop-blur-md border border-white/15 text-[#d5e5d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-[#f4f8f2] border-[#cad8c6] text-[#394a3b]',
          noteIcon: isDarkEffective ? 'text-emerald-400' : 'text-[#466244]',
          primaryBtn: isDarkEffective ? 'bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 text-white font-semibold shadow-lg shadow-emerald-900/35' : 'bg-[#466244] hover:bg-[#395037] text-white font-semibold shadow-sm',
          secondaryBtn: isDarkEffective ? 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.15] text-[#cee0d1] border border-white/20' : 'bg-[#eaf1e8] hover:bg-[#deeada] text-[#1c2b1e] border border-[#cad8c6]/80',
          outlineBtn: isDarkEffective ? 'bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.1] text-[#a9c9ad] border border-white/15' : 'bg-[#f4f8f2] hover:bg-[#eaf1e8] text-[#1c2b1e] border border-[#cad8c6]',
          coverGradient: isDarkEffective
            ? 'bg-gradient-to-br from-[#0c1a0f] via-[#102214] to-[#142a19]'
            : 'bg-gradient-to-br from-[#c7ddc5] via-[#b3d1b1] to-[#9ec39b]',
          circleTopLeft: isDarkEffective
            ? 'bg-gradient-to-br from-[#07160b] to-[#0f2716] border border-[#2c4731]/30'
            : 'bg-gradient-to-br from-[#3b5e39]/35 to-[#274526]/25 border border-[#274526]/20',
          circleBehindCover: isDarkEffective
            ? 'bg-gradient-to-tr from-[#2c4731]/20 via-[#1f3323]/15 to-transparent border border-[#2c4731]/30 shadow-inner'
            : 'bg-gradient-to-tr from-[#3b5e39]/20 via-[#679164]/15 to-white/40 border border-[#3b5e39]/25 shadow-inner',
          circleBottomRight: isDarkEffective
            ? 'bg-gradient-to-tl from-[#19331e]/40 via-[#112415]/25 to-transparent'
            : 'bg-gradient-to-tl from-[#74a871]/45 via-[#8fbf8c]/30 to-transparent',
          coverOverlay: isDarkEffective
            ? 'bg-gradient-to-t from-[#0c140d]/80 via-[#0c140d]/25 to-transparent'
            : 'bg-gradient-to-t from-white/40 via-transparent to-transparent',
          // Theme-aware poster styles (Đồng bộ chuẩn xác màu sắc Sage dịu mắt)
          posterCardBorder: isDarkEffective ? 'border border-[#233827]/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)]' : 'border border-[#cad8c6]',
          posterGradient: isDarkEffective
            ? 'linear-gradient(135deg, rgba(16, 26, 18, 0.9) 0%, rgba(10, 18, 12, 0.95) 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f4f8f2 35%, #ebf3e8 70%, #dceadc 100%)',
          posterDiscLeftSeparate: isDarkEffective
            ? 'radial-gradient(circle at 50% 50%, rgba(50, 78, 52, 0.12) 0%, rgba(30, 48, 32, 0.04) 60%, transparent 85%)'
            : 'radial-gradient(circle at 50% 50%, rgba(152, 184, 148, 0.52) 0%, rgba(202, 216, 198, 0.22) 65%, transparent 88%)',
          posterDiscTopRight: isDarkEffective
            ? 'radial-gradient(circle at 50% 50%, rgba(50, 78, 52, 0.12) 0%, rgba(30, 48, 32, 0.04) 60%, transparent 85%)'
            : 'radial-gradient(circle at 50% 50%, rgba(152, 184, 148, 0.52) 0%, rgba(202, 216, 198, 0.2) 65%, transparent 88%)',
          posterArcBottomRight: isDarkEffective
            ? 'radial-gradient(circle at center, rgba(50, 78, 52, 0.1) 0%, rgba(30, 48, 32, 0.03) 50%, transparent 75%)'
            : 'radial-gradient(circle at center, rgba(152, 184, 148, 0.4) 0%, rgba(152, 184, 148, 0.12) 50%, transparent 75%)',
          posterStatusBadgeBg: isDarkEffective ? 'bg-[#253828] text-[#c2d4bf] border border-[#39563d]/40 shadow-xs' : 'bg-[#466244] text-white',
          posterPrimaryBtn: isDarkEffective
            ? 'bg-[#2a402d] hover:bg-[#34523a] text-[#c2d4bf] shadow-xs font-semibold'
            : 'bg-[#466244] hover:bg-[#395037] text-white shadow-sm font-semibold',
          posterTextColor: isDarkEffective ? 'text-[#b8cbb5]' : 'text-[#1c2b1e]',
          posterSubTextColor: isDarkEffective ? 'text-[#879e84]' : 'text-[#485b4b]',
          posterMutedText: isDarkEffective ? 'text-[#5d735a]' : 'text-[#7d937b]',
          posterTagClass: isDarkEffective
            ? 'bg-[#1a2b1d]/60 backdrop-blur-md border border-[#2c4731]/40 text-[#a1b89e] hover:border-[#3e6345]/50'
            : 'bg-white/85 hover:bg-white text-[#2c3e2e] border border-[#cbd7c8] shadow-2xs',
          posterNoteBox: isDarkEffective
            ? 'border border-[#233827]/50 bg-[#0f1911]/80 text-[#8ea38a]'
            : 'border-[#cad8c6] bg-[#f4f8f2] text-[#394a3b] shadow-xs',
          posterNoteTitle: isDarkEffective ? 'text-[#b8cbb5]' : 'text-[#1c2b1e]',
          posterNoteContent: isDarkEffective ? 'text-[#8ea38a]' : 'text-[#394a3b]',
          posterReadNextBtn: isDarkEffective
            ? 'bg-[#162318]/70 backdrop-blur-md hover:bg-[#1d3020]/80 border border-[#233827]/40 text-[#a1b89e] shadow-xs'
            : 'bg-white hover:bg-[#f4f8f2] text-[#1c2b1e] border border-[#cad8c6] shadow-xs',
          gridPattern: {
            baseGradient: isDarkEffective
              ? 'linear-gradient(135deg, rgba(20, 35, 24, 0.85) 0%, rgba(12, 21, 16, 0.95) 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f4f8f2 40%, #e5efe4 100%)',
            glowGradient: isDarkEffective
              ? 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(52, 211, 153, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(215, 235, 212, 0.65) 0%, transparent 70%)',
            gridLineColor: isDarkEffective
              ? 'rgba(52, 211, 153, 0.16)'
              : 'rgba(70, 98, 68, 0.22)',
            gridSubtleColor: isDarkEffective
              ? 'rgba(52, 211, 153, 0.05)'
              : 'rgba(70, 98, 68, 0.08)',
          },
        };
    }
  }, [theme, isDarkEffective]);

  const readingChapter = useMemo(() => {
    try {
      const history = safeStorage.getItem(`novel_history_${novel.id}`);
      if (history) {
        const parsed = JSON.parse(history);
        if (parsed.lastReadChapterNumber) return parsed.lastReadChapterNumber;
      }
    } catch {}
    return novel.chapters.length > 1 ? 2 : 1;
  }, [novel.id, novel.chapters.length]);

  const [likeCount, setLikeCount] = useState(novel.bookmarks || 12450);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikeCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleVote = () => {
    if (!hasVoted) {
      setVoteCount(voteCount + 1);
      setHasVoted(true);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const finalAuthor = userName.trim() || 'Bạn Đọc';
    const formattedDate = formatCommentDate();

    const tempComment: NovelComment = {
      id: `cm-${Date.now()}`,
      truyenId: novel.id,
      author: finalAuthor,
      avatar: '',
      content: newCommentText.trim(),
      createdAt: formattedDate,
      ngayTao: new Date().toISOString(),
      likes: 0,
      badge: 'Độc Giả',
      rating: userRating,
    };

    const updated = [tempComment, ...comments.filter((c) => c.id !== tempComment.id)];
    setComments(updated);
    try {
      safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(updated));
    } catch {}
    onUpdateNovel?.({ ...novel, comments: updated });
    setNewCommentText('');

    try {
      await addBinhLuan(novel.id, {
        author: finalAuthor,
        content: tempComment.content,
        createdAt: formattedDate,
        rating: userRating,
        badge: 'Độc Giả',
      });
    } catch (err) {
      console.warn('[Firebase] Failed to persist comment to Firestore:', err);
    }
  };

  const handleLikeComment = (commentId: string) => {
    const updated = comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
    setComments(updated);
    try {
      safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(updated));
    } catch {}
    onUpdateNovel?.({ ...novel, comments: updated });

    try {
      likeBinhLuan(novel.id, commentId);
    } catch (err) {
      console.warn('[Firebase] Failed to sync comment like:', err);
    }
  };

  const handleOpenDeleteComment = (comment: NovelComment) => {
    setCommentToDelete(comment);
    setIsDeleteCommentModalOpen(true);
  };

  const handleConfirmDeleteComment = async () => {
    if (!commentToDelete) return;

    const targetId = commentToDelete.id;
    const updated = comments.filter((c) => c.id !== targetId);
    setComments(updated);
    try {
      safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(updated));
    } catch {}
    onUpdateNovel?.({ ...novel, comments: updated });

    setIsDeleteCommentModalOpen(false);
    setCommentToDelete(null);

    try {
      await deleteBinhLuan(novel.id, targetId);
    } catch (err) {
      console.warn('[Firebase] Failed to delete comment from Firestore:', err);
    }
  };

  const handleOpenEditChapter = async (chap: NovelChapter) => {
    setEditingChapter(chap);
    setEditChapTitle(chap.title);
    setEditChapIsExtra(Boolean(chap.isExtra));
    setIsEditChapterModalOpen(true);

    if (chap.content && chap.content.trim()) {
      setEditChapContent(chap.content);
    } else {
      setIsLoadingEditContent(true);
      try {
        const fullChap = await fetchSingleChuong(novel.id, chap.chapterNumber);
        if (fullChap && fullChap.noiDung) {
          setEditChapContent(fullChap.noiDung);
        } else {
          const localMatch = (novel.chapters || []).find((c) => c.chapterNumber === chap.chapterNumber);
          setEditChapContent(localMatch?.content || '');
        }
      } catch (err) {
        console.warn('Could not fetch chapter content from firestore', err);
        const localMatch = (novel.chapters || []).find((c) => c.chapterNumber === chap.chapterNumber);
        setEditChapContent(localMatch?.content || '');
      } finally {
        setIsLoadingEditContent(false);
      }
    }
  };

  const handleSaveEditChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter) return;

    setIsSavingEditChapter(true);
    const trimmedTitle = editChapTitle.trim() || editingChapter.title;
    const trimmedContent = editChapContent.trim();
    const wordCount = trimmedContent ? trimmedContent.split(/\s+/).filter(Boolean).length : editingChapter.wordCount;

    // 1. Sync directly to Firestore
    try {
      await updateChuong(novel.id, editingChapter.chapterNumber, {
        tieuDe: trimmedTitle,
        noiDung: editChapContent,
        soThuTu: editingChapter.chapterNumber,
      });
    } catch (err) {
      console.warn('Failed to update chapter in firestore', err);
    }

    // 2. Update local state
    const updatedChapters = (novel.chapters || []).map((c) => {
      if (c.id === editingChapter.id || c.chapterNumber === editingChapter.chapterNumber) {
        return {
          ...c,
          title: trimmedTitle,
          content: editChapContent,
          isExtra: editChapIsExtra,
          wordCount: wordCount > 0 ? wordCount : c.wordCount,
        };
      }
      return c;
    });

    onUpdateChapters?.(novel.id, updatedChapters);
    setIsSavingEditChapter(false);
    setIsEditChapterModalOpen(false);
    setEditingChapter(null);
    triggerToast('Đã cập nhật chương thành công!', `Chương "${trimmedTitle}" đã được lưu trữ an toàn.`);
  };

  const handleOpenDeleteChapter = (chap: NovelChapter) => {
    setChapterToDelete(chap);
    setIsDeleteChapterModalOpen(true);
  };

  const handleConfirmDeleteChapter = async () => {
    if (!chapterToDelete) return;

    setIsDeletingChapter(true);
    const delChapterNum = chapterToDelete.chapterNumber;

    // 1. Delete from Firestore
    try {
      await deleteChuong(novel.id, delChapterNum);
    } catch (err) {
      console.warn('Failed to delete chapter in firestore', err);
    }

    // 2. Update local state
    const remainingChapters = (novel.chapters || []).filter(
      (c) => c.id !== chapterToDelete.id && c.chapterNumber !== delChapterNum
    );

    // Re-index remaining chapters
    const reindexedChapters = remainingChapters.map((c, idx) => ({
      ...c,
      chapterNumber: idx + 1,
    }));

    onUpdateChapters?.(novel.id, reindexedChapters);
    setIsDeletingChapter(false);
    setIsDeleteChapterModalOpen(false);
    setChapterToDelete(null);
    triggerToast('Đã xóa chương thành công!', `Chương ${delChapterNum} đã được gỡ bỏ khỏi hệ thống.`);
  };

  const handleOpenAddChapterModal = () => {
    const nextNum = (novel.chapters && novel.chapters.length > 0)
      ? Math.max(...novel.chapters.map((c) => c.chapterNumber)) + 1
      : (firestoreChapters.length > 0 ? Math.max(...firestoreChapters.map((f) => f.soThuTu)) + 1 : 1);
    setNewChapNumber(nextNum);
    setNewChapTitle(`Chương ${nextNum}: `);
    setNewChapContent('');
    setNewChapIsExtra(false);
    setShowAddChapterModal(true);
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapTitle.trim() || !newChapContent.trim()) return;

    setIsPublishingChapter(true);
    const finalChapNum = Number(newChapNumber) || (novel.chapters.length + 1);
    const finalTitle = newChapTitle.trim();
    const wordCount = newChapContent.trim().split(/\s+/).filter(Boolean).length;

    // 1. Push directly to Firestore
    try {
      await addSingleChuong(novel.id, {
        soThuTu: finalChapNum,
        tieuDe: finalTitle,
        noiDung: newChapContent,
        isExtra: newChapIsExtra,
      });
    } catch (err) {
      console.warn('Failed to save new chapter to firestore', err);
    }

    // 2. Add to local novel state
    const newChap: NovelChapter = {
      id: `c-${novel.id}-${finalChapNum}-${Date.now()}`,
      chapterNumber: finalChapNum,
      title: finalTitle,
      wordCount: wordCount,
      views: 0,
      publishedAt: new Date().toLocaleDateString('vi-VN'),
      content: newChapContent,
      isExtra: newChapIsExtra || /ngoại\s*truyện|phiên\s*ngoại/i.test(finalTitle),
    };

    onAddChapter(novel.id, newChap);
    setIsPublishingChapter(false);
    setShowAddChapterModal(false);
    setNewChapTitle('');
    setNewChapContent('');
    triggerToast('Đăng chương mới thành công!', `Chương "${finalTitle}" đã được đưa lên hệ thống.`);
  };

  const handleOpenEditTags = () => {
    setEditingGenresList(novel.genres && novel.genres.length > 0 ? [...novel.genres] : ['Tiểu Thuyết']);
    setNewTagInput('');
    setIsEditTagsModalOpen(true);
  };

  const handleAddTag = (tagToAdd?: string) => {
    const rawTag = (tagToAdd !== undefined ? tagToAdd : newTagInput).trim();
    if (!rawTag) return;
    const cleanTag = rawTag.replace(/^#+/, '').trim();
    if (!cleanTag) return;
    if (!editingGenresList.includes(cleanTag)) {
      setEditingGenresList([...editingGenresList, cleanTag]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditingGenresList(editingGenresList.filter((t) => t !== tagToRemove));
  };

  const handleSaveTags = async () => {
    if (editingGenresList.length === 0) {
      alert('Vui lòng để lại ít nhất 1 thể loại / tag cho truyện!');
      return;
    }

    setIsSavingTags(true);
    const updatedNovel: Novel = {
      ...novel,
      genres: editingGenresList,
      tags: editingGenresList.map((t) => (t.startsWith('#') ? t : `#${t}`)),
    };

    // 1. Save to Firestore
    try {
      await saveNovelTagsToFirebase(novel.id, editingGenresList, novel.title);
    } catch (err) {
      console.warn('Failed to update tags in firestore', err);
    }

    // 2. Update parent state
    onUpdateNovel?.(updatedNovel);

    // 3. Persist in safeStorage
    try {
      const savedNovelsStr = safeStorage.getItem('cosmo_novels');
      if (savedNovelsStr) {
        const parsed: Novel[] = JSON.parse(savedNovelsStr);
        const next = parsed.map((n) => (n.id === updatedNovel.id ? updatedNovel : n));
        safeStorage.setItem('cosmo_novels', JSON.stringify(next));
      }
    } catch (err) {
      console.warn('Failed to save tags to storage', err);
    }

    setIsSavingTags(false);
    setIsEditTagsModalOpen(false);
    triggerToast('Đã lưu tags vào Firebase!', `Danh sách thể loại / tag của "${novel.title}" đã được lưu trực tiếp vào Firebase Cloud.`);
  };

  const handleOpenEditSynopsis = () => {
    setEditSynopsis(novel.synopsis || '');
    setEditWorldLore(novel.worldLore || (novel.id === 'lua-nhau' ? LUA_NHAU_NOVEL.worldLore : ''));
    setEditUploaderNote(novel.uploaderNote || (novel.id === 'lua-nhau' ? LUA_NHAU_NOVEL.uploaderNote || '' : ''));
    setActiveTab('synopsis');
    setIsEditingSynopsis(true);
    setActiveSynopsisSubTab('edit');
    if (synopsisSectionRef.current) {
      synopsisSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEditSynopsis = () => {
    setIsEditingSynopsis(false);
    setEditSynopsis(novel.synopsis || '');
    setEditWorldLore(effectiveWorldLore || '');
    setEditUploaderNote(novel.uploaderNote || '');
    setActiveSynopsisSubTab('edit');
  };

  const handleSaveSynopsis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedSynopsis = editSynopsis.trim();
    if (!trimmedSynopsis) {
      alert('Vui lòng nhập nội dung giới thiệu truyện!');
      return;
    }

    setIsSavingSynopsis(true);

    const updatedNovel: Novel = {
      ...novel,
      synopsis: trimmedSynopsis,
      worldLore: editWorldLore.trim() || undefined,
      uploaderNote: editUploaderNote.trim() || undefined,
    };

    // 1. Save directly to Firebase Firestore
    try {
      await saveNovelSynopsisToFirebase(
        novel.id,
        {
          moTa: trimmedSynopsis,
          worldLore: editWorldLore.trim() || undefined,
          uploaderNote: editUploaderNote.trim() || undefined,
        },
        novel.title
      );
    } catch (err) {
      console.warn('Failed to update synopsis in firestore', err);
    }

    // 2. Update React parent state
    onUpdateNovel?.(updatedNovel);

    // 3. Persist in safeStorage
    try {
      const savedNovelsStr = safeStorage.getItem('cosmo_novels');
      if (savedNovelsStr) {
        const parsed: Novel[] = JSON.parse(savedNovelsStr);
        const next = parsed.map((n) => (n.id === updatedNovel.id ? updatedNovel : n));
        safeStorage.setItem('cosmo_novels', JSON.stringify(next));
      }
    } catch (err) {
      console.warn('Failed to save to storage', err);
    }

    setIsSavingSynopsis(false);
    setIsEditingSynopsis(false);
    setActiveSynopsisSubTab('edit');
    triggerToast('Đã lưu giới thiệu vào Firebase!', 'Văn án, thiết lập nhân vật và lời nhắn người đăng đã được lưu trực tiếp vào Firebase Cloud.');
  };

  // Nút Lưu mục lục danh sách chương của tác phẩm
  const handleSaveTableOfContents = () => {
    try {
      const savedNovelsStr = safeStorage.getItem('cosmo_novels');
      if (savedNovelsStr) {
        const parsed: Novel[] = JSON.parse(savedNovelsStr);
        const next = parsed.map((n) => (n.id === novel.id ? { ...n, chapters: [...novel.chapters] } : n));
        safeStorage.setItem('cosmo_novels', JSON.stringify(next));
      }
    } catch (err) {
      console.warn('Failed to save table of contents', err);
    }

    onUpdateChapters?.(novel.id, novel.chapters);
    onUpdateNovel?.({ ...novel, chapters: [...novel.chapters] });
    triggerToast(
      'Đã lưu mục lục truyện thành công!',
      `Toàn bộ ${novel.chapters.length} chương truyện (${mainChaptersCount} chính văn, ${extraChaptersCount} ngoại truyện) đã được lưu trữ.`
    );
  };

  const handleApplyTxtChapters = (importedChapters: NovelChapter[], mode: 'replace' | 'append') => {
    let finalChapters: NovelChapter[] = [];
    if (mode === 'replace') {
      finalChapters = importedChapters;
    } else {
      finalChapters = [...novel.chapters, ...importedChapters];
    }

    // Quy tắc: những chương không có tên là Chương [số] mà là đoạn văn bản dài
    // thì gộp nội dung vào chương phía trước nó, rồi xóa chương văn bản dài đi, không đụng vào ngoại truyện
    const sanitizedChapters: NovelChapter[] = [];
    for (const chap of finalChapters) {
      const extra =
        chap.isExtra === true ||
        /^[\[(【]?\s*(?:Ngoại\s*truyện|Phiên\s*ngoại|Ngoại\s*văn|PN)/i.test(chap.title.trim()) ||
        isExtraChapter(chap);

      if (extra) {
        sanitizedChapters.push({ ...chap, isExtra: true });
        continue;
      }
      const trimmedTitle = chap.title.trim();
      const isValidMain =
        /^[\[(【]?\s*(?:(?:Q|Quyển|Tập)\s*\d+[\s:.-]+)?(?:Chương|Chapter|Hồi)\s*\d+/i.test(trimmedTitle) ||
        /^\d+[\s:.-]/.test(trimmedTitle);
      const isLongTitle = trimmedTitle.length > 55 && !isValidMain;
      if (!isValidMain || isLongTitle) {
        if (sanitizedChapters.length > 0) {
          const prev = sanitizedChapters[sanitizedChapters.length - 1];
          const merged =
            (prev.content ? prev.content.trim() : '') +
            '\n\n' +
            trimmedTitle +
            '\n\n' +
            (chap.content ? chap.content.trim() : '');
          sanitizedChapters[sanitizedChapters.length - 1] = {
            ...prev,
            content: merged,
            wordCount: merged.split(/\s+/).filter(Boolean).length,
          };
        }
        continue;
      }
      sanitizedChapters.push(chap);
    }

    let mIdx = 1;
    const renumberedChapters = sanitizedChapters.map((c) => {
      const extra =
        c.isExtra === true ||
        /^[\[(【]?\s*(?:Ngoại\s*truyện|Phiên\s*ngoại|Ngoại\s*văn|PN)/i.test(c.title.trim()) ||
        isExtraChapter(c);
      return extra ? { ...c, isExtra: true } : { ...c, chapterNumber: mIdx++ };
    });

    if (onUpdateChapters) {
      onUpdateChapters(novel.id, renumberedChapters);
    }
  };

  const CHAPTERS_PER_PAGE = 20;

  const mainChaptersCount = useMemo(() => {
    return effectiveChapters.filter((c) => !isExtraChapter(c)).length;
  }, [effectiveChapters]);

  const extraChaptersCount = useMemo(() => {
    return effectiveChapters.filter((c) => isExtraChapter(c)).length;
  }, [effectiveChapters]);

  const filteredChapters = useMemo(() => {
    return effectiveChapters.filter((chap) => {
      const extra = isExtraChapter(chap);
      if (chapterTypeFilter === 'main') return !extra;
      if (chapterTypeFilter === 'extra') return extra;
      return true;
    });
  }, [effectiveChapters, chapterTypeFilter]);

  const sortedChapters = useMemo(() => {
    return [...filteredChapters].sort((a, b) =>
      chapterSortAsc
        ? a.chapterNumber - b.chapterNumber
        : b.chapterNumber - a.chapterNumber
    );
  }, [filteredChapters, chapterSortAsc]);

  const totalChapterPages = Math.ceil(sortedChapters.length / CHAPTERS_PER_PAGE);

  const displayedChapters = useMemo(() => {
    if (sortedChapters.length <= CHAPTERS_PER_PAGE) {
      return sortedChapters;
    }
    const startIndex = (chapterPage - 1) * CHAPTERS_PER_PAGE;
    return sortedChapters.slice(startIndex, startIndex + CHAPTERS_PER_PAGE);
  }, [sortedChapters, chapterPage]);

  // Color matching active theme, soft neutral for light mode (as requested)
  const paginationStyles = useMemo(() => {
    if (isDarkEffective) {
      switch (theme) {
        case 'amethyst-haze':
          return {
            active: 'bg-[#98647a] text-white border border-[#b07d8f]/70 shadow-xs',
            inactive: 'bg-purple-950/40 text-purple-200 border border-purple-900/50 hover:bg-purple-900/40',
            arrow: 'bg-purple-950/40 text-purple-300 border border-purple-900/50 hover:bg-purple-900/50 hover:text-white',
          };
        case 'sage':
          return {
            active: 'bg-[#435d4b] text-white border border-[#567661]/70 shadow-xs',
            inactive: 'bg-emerald-950/40 text-emerald-200 border border-emerald-900/50 hover:bg-emerald-900/40',
            arrow: 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/50 hover:bg-emerald-900/50 hover:text-white',
          };
        case 'mocha':
          return {
            active: 'bg-[#614d3f] text-white border border-[#826b5b]/70 shadow-xs',
            inactive: 'bg-stone-900/60 text-stone-200 border border-stone-800 hover:bg-stone-800/80',
            arrow: 'bg-stone-900/60 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-white',
          };
        case 'notebook':
          return {
            active: 'bg-zinc-600 text-white border border-zinc-500 shadow-xs',
            inactive: 'bg-zinc-900/60 text-zinc-300 border border-zinc-800 hover:bg-zinc-800/80',
            arrow: 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white',
          };
        case 'cosmic':
        default:
          return {
            active: 'bg-indigo-600 text-white border border-indigo-500/70 shadow-xs',
            inactive: 'bg-zinc-900/60 text-zinc-300 border border-zinc-800 hover:bg-zinc-800/80',
            arrow: 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white',
          };
      }
    } else {
      // Light mode: "theme sáng cần có màu trung tính, dịu nhẹ"
      switch (theme) {
        case 'amethyst-haze':
          return {
            // Muted dusty mauve / rose as in reference screenshot
            active: 'bg-[#b07d8f] text-white border border-[#b07d8f] shadow-xs',
            inactive: 'bg-[#fcfafc] text-[#735d68] border border-[#e8dfec] hover:bg-[#f5eff7]',
            arrow: 'bg-[#fcfafc] text-[#85707b] border border-[#e8dfec] hover:bg-[#f5eff7] hover:text-[#523d47]',
          };
        case 'sage':
          return {
            // Neutral soft sage
            active: 'bg-[#637d6d] text-white border border-[#637d6d] shadow-xs',
            inactive: 'bg-[#fafcfb] text-[#4d5e53] border border-[#dce5df] hover:bg-[#eff4f1]',
            arrow: 'bg-[#fafcfb] text-[#607366] border border-[#dce5df] hover:bg-[#eff4f1] hover:text-[#38483e]',
          };
        case 'mocha':
          return {
            // Neutral soft taupe
            active: 'bg-[#826a5b] text-white border border-[#826a5b] shadow-xs',
            inactive: 'bg-[#fdfbfa] text-[#635043] border border-[#e3dacf] hover:bg-[#f6f0ea]',
            arrow: 'bg-[#fdfbfa] text-[#786457] border border-[#e3dacf] hover:bg-[#f6f0ea] hover:text-[#4d3c31]',
          };
        case 'notebook':
          return {
            // Neutral soft gray
            active: 'bg-[#737373] text-white border border-[#737373] shadow-xs',
            inactive: 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50',
            arrow: 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50 hover:text-stone-800',
          };
        case 'slate-haze':
        default:
          return {
            // Neutral soft slate
            active: 'bg-[#6b7280] text-white border border-[#6b7280] shadow-xs',
            inactive: 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50',
            arrow: 'bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800',
          };
      }
    }
  }, [theme, isDarkEffective]);

  const getAvatarBgColor = (name: string) => {
    const palette = [
      'bg-[#b07d8f]', // Dusty mauve / rose (matched to reference screenshot)
      'bg-[#5f7d6a]', // Muted sage
      'bg-[#826b5b]', // Warm taupe mocha
      'bg-[#6366f1]', // Indigo
      'bg-[#0ea5e9]', // Sky blue
      'bg-[#10b981]', // Emerald
      'bg-[#d97706]', // Warm amber
      'bg-[#ec4899]', // Pink
      'bg-[#8b5cf6]', // Purple
      'bg-[#64748b]', // Slate
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
  };

  const relatedNovels = allNovels
    .filter((n) => n.id !== novel.id && n.genres.some((g) => novel.genres.includes(g)))
    .slice(0, 3);

  // Auto-hide header on scroll down, reveal on scroll up
  const isHeaderVisible = useHeaderScroll({ threshold: 40, delta: 6 });
  const shouldShowHeader = isHeaderVisible || isThemeMenuOpen || isShareOpen;

  // Check active layout style
  const isJournalStyle = false;
  const isSpiralStyle = detailLayoutOption === 'spiral';
  const isNoteStyle = false;
  const isCinemaStyle = false;
  const isCyberStyle = false;
  const isWaxSealStyle = false;
  const isEditorialStyle = false;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${tStyles.pageBg} relative`}>
      {/* Trang trí nền: Cosmic hiển thị sao & khí quyển; các theme tối khác hiển thị các khối tròn màu sắc thanh tao */}
      <CosmicStarsBackground
        theme={theme}
        isDarkMode={isDarkEffective}
        darkBgOption={darkBgOption}
        bgSeed={bgSeed}
        purpleBgEffectsEnabled={purpleBgEffectsEnabled}
      />
      
      {/* HỌA TIẾT NỀN: LƯỚI CARO SỔ CÒNG (PLANNER BINDER GRID) CHO CHẾ ĐỘ THEME SÁNG TRANG THÔNG TIN TRUYỆN */}
      {isSpiralStyle && !isDarkEffective && (
        <div
          id="spiral-page-planner-caro-bg"
          className="fixed inset-0 pointer-events-none z-0 transition-all duration-500"
          style={getSpiralPlannerCaroGridStyle(theme)}
          aria-hidden="true"
        />
      )}
      
      {/* Top Floating Navigation with Theme Controls */}
      <header
        className={`sticky top-0 z-40 glass-header border-b px-3 sm:px-8 py-3 flex items-center justify-between transition-[transform,opacity] duration-300 transform ${
          shouldShowHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        } ${tStyles.headerBg} ${tStyles.headerBorder}`}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => {
              onBack();
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer shrink-0 ${tStyles.buttonNeutral}`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Về Trang Chủ</span>
          </button>

          {/* Option Selector Pills: Chuẩn | Sổ còng */}
          <div className="p-0.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center shadow-inner text-xs">
            <button
              type="button"
              onClick={() => {
                setDetailLayoutOption('option1');
                safeStorage.setItem('cosmo_novel_detail_layout', 'option1');
              }}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                detailLayoutOption === 'option1'
                  ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="Kiểu tiêu chuẩn hiện đại"
            >
              Chuẩn
            </button>
            <button
              type="button"
              onClick={() => {
                setDetailLayoutOption('spiral');
                safeStorage.setItem('cosmo_novel_detail_layout', 'spiral');
              }}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                detailLayoutOption === 'spiral'
                  ? `${detailThemeExtras.statusBadge} shadow-xs font-bold`
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="Kiểu sổ còng nhật ký"
            >
              Sổ còng
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Selector Popover (Trình bày giống ngoài trang chủ) */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-xs ${tStyles.themeSelectorBtn}`}
              title="Thay đổi giao diện màu sắc"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentThemeOption.name}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isThemeMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isThemeMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-60 rounded-xl p-1.5 shadow-xl border z-50 animate-in fade-in zoom-in-95 duration-150 ${
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
                  <div className="mt-1.5 pt-1.5 border-t border-zinc-500/20">
                    <button
                      id="btn-detail-toggle-purple-bg"
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

          {/* Dark Mode Toggle Button (Ẩn ở theme cosmic theo yêu cầu) */}
          {!isCosmic && (
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full border transition-all cursor-pointer shadow-2xs ${tStyles.buttonDarkMode}`}
              title={
                isDarkEffective
                  ? 'Tắt Dark Mode (Trở lại màu sáng)'
                  : 'Bật Dark Mode (Chuyển theme sáng sang màu tối)'
              }
            >
              {isDarkEffective ? (
                <Moon className="w-4 h-4 text-amber-300 fill-amber-300/30" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              )}
            </button>
          )}

          {/* Share Button & Popover */}
          <div className="relative" ref={shareRef}>
            <button
              id="novel-share-btn"
              onClick={() => {
                setIsShareOpen((prev) => !prev);
              }}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isShareOpen
                  ? isDarkEffective
                    ? 'bg-white/15 text-white border-white/30'
                    : 'bg-black/10 text-black border-black/20'
                  : tStyles.buttonNeutral
              }`}
              title="Chia sẻ liên kết truyện"
              aria-expanded={isShareOpen}
              aria-label="Chia sẻ truyện"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Popover: Rút gọn lại chỉ còn link và nút sao chép */}
            <AnimatePresence>
              {isShareOpen && (
                <motion.div
                  id="novel-share-popover"
                  initial={{ opacity: 0, scale: 0.95, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-72 sm:w-84 rounded-2xl p-2 shadow-xl border z-50 ${
                    isDarkEffective
                      ? 'bg-[#181a20] border-zinc-700 text-zinc-100 shadow-black/50'
                      : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-400/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <input
                      id="novel-share-link-input"
                      type="text"
                      readOnly
                      value={shareUrl}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className={`flex-1 min-w-0 px-2.5 py-1.5 rounded-lg text-xs font-mono truncate select-all bg-transparent focus:outline-hidden ${
                        isDarkEffective ? 'text-zinc-200 placeholder-zinc-500' : 'text-zinc-800 placeholder-zinc-400'
                      }`}
                      placeholder="Đường dẫn truyện..."
                    />
                    <button
                      id="novel-share-copy-btn"
                      onClick={handleCopyShareUrl}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : `${tStyles.buttonPrimary} shadow-xs`
                      }`}
                      title="Sao chép liên kết"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content Frame */}
      <main className={`flex-1 w-full ${detailLayoutOption === 'spiral' ? 'max-w-6xl lg:max-w-7xl' : 'max-w-6xl'} mx-auto ${detailLayoutOption === 'spiral' ? 'px-1 sm:px-6' : 'px-3 sm:px-6'} pt-6 sm:pt-8 pb-16 relative z-10`}>
        {/* LỰA CHỌN HIỂN THỊ THÔNG TIN CHI TIẾT TRUYỆN: KIỂU SỔ CÒNG HOẶC KIỂU CHUẨN */}
        {detailLayoutOption === 'spiral' ? (
          <SpiralNotebookView
            novel={novel}
            effectiveChapters={effectiveChapters}
            comments={comments}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
            onReadChapter={onReadChapter}
            onPostComment={(author, content) => {
              const formattedDate = formatCommentDate();
              const tempComment: NovelComment = {
                id: `cm-${Date.now()}`,
                truyenId: novel.id,
                author: author.trim() || 'Bạn Độc Giả',
                avatar: '',
                content: content.trim(),
                createdAt: formattedDate,
                ngayTao: new Date().toISOString(),
                likes: 0,
                badge: 'Độc Giả',
                rating: 5,
              };
              const updated = [tempComment, ...comments.filter((c) => c.id !== tempComment.id)];
              setComments(updated);
              try {
                safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(updated));
              } catch {}
              onUpdateNovel?.({ ...novel, comments: updated });
              try {
                addBinhLuan(novel.id, {
                  author: tempComment.author,
                  avatar: '',
                  content: tempComment.content,
                  rating: 5,
                  badge: 'Độc Giả',
                  createdAt: formattedDate,
                });
              } catch (err) {
                console.warn('Could not post comment to Firestore:', err);
              }
              triggerToast('Đã lưu bình luận!', 'Cảm nghĩ của bạn đã được ghi chép vào trang sổ.');
            }}
            isDarkEffective={isDarkEffective}
            theme={theme}
            effectiveWorldLore={effectiveWorldLore}
            hasLiked={hasLiked}
            likeCount={likeCount}
            onToggleLike={handleLike}
            allNovels={allNovels}
            onSelectNovel={onSelectNovel}
          />
        ) : (
          /* Novel Detail Card (Kiểu chuẩn: Kết nối mục bìa truyện và 3 mục Giới thiệu, Mục lục, Bình luận thành chung một khối) */
          <div
            id="novel-main-unified-card"
            className={`relative rounded-3xl sm:rounded-[36px] border shadow-2xl overflow-hidden transition-all duration-300 ${
              isDarkEffective ? detailThemeExtras.cardBg : detailThemeExtras.posterCardBorder
            } ${detailThemeExtras.posterTextColor}`}
          >
            {/* Mục Bìa Truyện & Thông Tin */}
            <div className="relative p-5 sm:p-8 lg:p-10 overflow-hidden">
              {/* Nền thiết kế poster họa tiết lưới hình học (Grid Pattern) CHỈ CÓ ở góc trên bên phải */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* 1. Lớp màu nền chuyển sắc theo theme (phủ toàn khối) */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-500"
                  style={{
                    background: detailThemeExtras.gridPattern.baseGradient,
                  }}
                />

                {/* 2. Vùng sáng tỏa nhẹ (Atmospheric Glow) tập trung tại góc trên bên phải */}
                <div
                  className="absolute top-0 right-0 w-64 sm:w-96 md:w-[480px] h-48 sm:h-72 md:h-[360px] pointer-events-none transition-all duration-500"
                  style={{
                    background: detailThemeExtras.gridPattern.glowGradient,
                  }}
                />

                {/* 3. Hiệu ứng loang màu gradient hòa vào nền (Tự chọn màu theo từng theme, sáng: tiêu chuẩn, tối: dịu nhẹ) */}
                <CoverBgPatternOverlay
                  theme={theme}
                  isDark={isDarkEffective}
                />

                {/* 4. Hạt nhiễu vi mô tạo cảm giác chất liệu giấy tự nhiên */}
                {!isDarkEffective && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{
                      opacity: 0.18,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  />
                )}
              </div>

              <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto py-2">
                
                {/* Book Cover */}
                <div className="relative w-44 sm:w-52 md:w-56 aspect-3/4 rounded-2xl overflow-hidden shadow-lg shadow-black/10 dark:shadow-black/25 border-2 border-white/50 dark:border-white/10 group">
                  <img
                    src={getDirectImageUrl(activeCoverImage, novel.id || novel.title)}
                    onError={(e) => handleCoverImageError(e, novel.id || novel.title)}
                    alt={novel.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Admin Quick Hover Overlay to change cover */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setIsCoverModalOpen(true)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white cursor-pointer z-20 p-2 text-center backdrop-blur-xs"
                      title="Bấm để tải ảnh bìa lên hoặc thay đổi"
                    >
                      <div className="p-2.5 rounded-full bg-purple-600/90 text-white shadow-lg">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold shadow-xs">Thay đổi ảnh bìa</span>
                    </button>
                  )}
                  <div className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold shadow-xs z-10 ${
                    theme === 'slate-haze'
                      ? (novel.status === 'ongoing'
                          ? (isDarkEffective ? 'bg-[#121c27]/90 text-cyan-300 border border-cyan-400/40' : 'bg-slate-900/80 text-slate-100 border border-slate-400/30')
                          : (isDarkEffective ? 'bg-[#182432]/90 text-slate-300 border border-[#27384a]' : 'bg-slate-800/75 text-slate-300 border border-slate-500/30'))
                      : theme === 'sage'
                      ? (novel.status === 'ongoing'
                          ? (isDarkEffective ? 'bg-[#142018]/90 text-emerald-300 border border-emerald-400/40' : 'bg-stone-900/80 text-stone-100 border border-stone-400/30')
                          : (isDarkEffective ? 'bg-[#19271c]/90 text-teal-200 border border-teal-400/35' : 'bg-stone-900/70 text-stone-300 border border-stone-500/30'))
                      : theme === 'amethyst-haze'
                      ? (novel.status === 'ongoing'
                          ? (isDarkEffective ? 'bg-[#171126]/90 text-purple-300 border border-purple-400/40' : 'bg-stone-900/80 text-stone-100 border border-stone-400/30')
                          : (isDarkEffective ? 'bg-[#1f192e]/90 text-pink-300 border border-pink-400/35' : 'bg-stone-900/70 text-stone-300 border border-stone-500/30'))
                      : `${detailThemeExtras.posterStatusBadgeBg} border border-white/20`
                  } ${theme === 'notebook' && isDarkEffective ? '' : 'backdrop-blur-xs'}`}>
                    {novel.status === 'ongoing' ? 'Đang Ra' : 'Hoàn Thành'}
                  </div>
                </div>

                {/* Tên truyện: Nằm giữa, phông chữ Playfair Display, font weight đậm hơn một chút (font-bold) */}
                <h1 className={`mt-4 w-full max-w-3xl text-center text-xl sm:text-2xl md:text-3xl font-playfair font-bold tracking-wide leading-snug px-4 ${detailThemeExtras.posterTextColor}`}>
                  {novel.title}
                </h1>

                {/* Tác giả & Người Edit: Nằm trên 2 dòng riêng biệt */}
                <div className="flex flex-col items-center justify-center gap-1.5 mt-2.5 text-xs sm:text-sm font-source-sans">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 text-center max-w-full px-2">
                    <span className={detailThemeExtras.posterSubTextColor}>Tác giả:</span>
                    <span className={`font-bold break-words ${detailThemeExtras.posterTextColor}`}>{novel.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={detailThemeExtras.posterSubTextColor}>Người Edit:</span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold inline-flex items-center backdrop-blur-xs ${detailThemeExtras.posterTagClass}`}>
                      {novel.translator || 'Jouriee65'}
                    </span>
                  </div>
                </div>

                {/* Nút Đổi ảnh bìa cho Admin */}
                {isAdmin && (
                  <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsCoverModalOpen(true)}
                      className="py-1.5 px-3 rounded-xl border border-purple-500/40 bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 hover:text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm group"
                      title="Tải ảnh bìa mới từ máy hoặc dán link ảnh bìa truyện"
                    >
                      <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>Đổi Ảnh Bìa</span>
                    </button>
                  </div>
                )}

                {/* Admin Management Panel */}
                {isAdmin && (
                  <div className="mt-4 p-3.5 sm:p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 backdrop-blur-md space-y-3 w-full max-w-2xl text-left">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="text-xs font-bold text-purple-300">Quản Trị Tiểu Thuyết</span>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          novel.trangThai === 'daDang'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {novel.trangThai === 'daDang' ? 'Đã Công Khai (Độc giả thấy)' : 'Bản Nháp (Chỉ admin thấy)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Toggle Status */}
                        <button
                          type="button"
                          onClick={() => onToggleStatus?.(novel.id, novel.trangThai || 'daDang')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            novel.trangThai === 'daDang'
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                          }`}
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>{novel.trangThai === 'daDang' ? 'Chuyển Về Bản Nháp' : 'Công Khai Truyện'}</span>
                        </button>

                        {/* Upload TXT */}
                        <button
                          type="button"
                          onClick={() => setIsTxtSplitterOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload File .txt Tách Chương</span>
                        </button>

                        {/* Delete Novel if Firestore */}
                        {novel.isFirestore && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc chắn muốn xóa bộ truyện "${novel.title}" cùng toàn bộ các chương trong Firestore không?`)) {
                                onDeleteNovel?.(novel.id);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa Truyện</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* 3 Mục Dưới: Giới Thiệu (Văn Án), Mục Lục, Bình Luận - Nằm chung một khối với mục có Bìa Truyện */}
            <div
              id="novel-tabs-section"
              className={`border-t transition-all duration-300 relative ${
                isDarkEffective ? 'border-white/10' : 'border-stone-200/80'
              } ${
                !isDarkEffective
                  ? theme === 'amethyst-haze'
                    ? 'bg-[#f8f6fc]'
                    : theme === 'sage'
                    ? 'bg-[#f2f7f1]'
                    : theme === 'mocha'
                    ? 'bg-[#f7f3eb]'
                    : 'bg-white'
                  : ''
              }`}
            >
          {/* 3 LỖ ĐỤC CÒNG SỔ BÊN MÉP TRÁI VÀ ĐƯỜNG NẾP GẤP (KIỂU 2: SỔ TAY) */}
          {isJournalStyle && (
            <>
              <div className="absolute left-2.5 sm:left-3.5 top-12 bottom-12 flex flex-col justify-around pointer-events-none select-none z-10">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E8DFD8] dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-inner" />
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E8DFD8] dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-inner" />
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E8DFD8] dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-inner" />
              </div>
              <div className="absolute left-8 sm:left-11 top-0 bottom-0 w-[1px] border-r border-dashed border-[#E5DCD6] dark:border-zinc-700/60 pointer-events-none" />
            </>
          )}

          {/* BĂNG DÍNH WASHI TRANG TRÍ (KIỂU GIẤY NOTE) */}
          {isNoteStyle && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-4 bg-amber-200/70 dark:bg-amber-800/40 border border-amber-300/60 rounded-xs -rotate-1 pointer-events-none shadow-xs z-10" />
          )}

          {/* DẢI CLAPPERBOARD PHIM ĐIỆN ẢNH (CINEMATOGRAPHY) */}
          {isCinemaStyle && (
            <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#111,#111_12px,#eee_12px,#eee_24px)] opacity-90 pointer-events-none" />
          )}

          {/* SCANLINE VÀ DẢI NEON CYBER */}
          {isCyberStyle && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 pointer-events-none" />
          )}

          {/* DẢI BƯU CHÍNH AIR MAIL HOÀNG GIA (THƯ NIÊM SÁP) */}
          {isWaxSealStyle && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(45deg,#b91c1c,#b91c1c_10px,#ffffff_10px,#ffffff_20px,#1d4ed8_20px,#1d4ed8_30px,#ffffff_30px,#ffffff_40px)] opacity-75 pointer-events-none" />
          )}

          {/* DẢI ACCENT HAIRLINE (KIỂU 4: TẠP CHÍ) */}
          {isEditorialStyle && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-stone-900 dark:bg-white pointer-events-none" />
          )}

          {/* Tab Navigation Header Bar */}
          <div
            className={`flex items-center justify-center overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b ${
              isJournalStyle
                ? `pl-10 sm:pl-14 pr-4 sm:pr-8 pt-2 ${
                    isDarkEffective
                      ? 'border-zinc-700/80 bg-zinc-900/40'
                      : 'border-[#E8DFD8] bg-[#F4EDE5]/60'
                  }`
                : isNoteStyle
                ? `px-4 sm:px-8 ${
                    isDarkEffective
                      ? 'border-amber-900/40 bg-amber-950/20'
                      : 'border-amber-200/80 bg-amber-50/50'
                  }`
                : isCinemaStyle
                ? `px-4 sm:px-8 ${
                    isDarkEffective
                      ? 'border-neutral-700/80 bg-neutral-900/60'
                      : 'border-[#E2DDD5] bg-[#F2EDE4]/70'
                  }`
                : isCyberStyle
                ? `px-4 sm:px-8 ${
                    isDarkEffective
                      ? 'border-cyan-900/50 bg-cyan-950/20'
                      : 'border-cyan-200/80 bg-cyan-50/40'
                  }`
                : isWaxSealStyle
                ? `px-4 sm:px-8 ${
                    isDarkEffective
                      ? 'border-[#4A3831] bg-[#1E1714]/60'
                      : 'border-[#D8C7B5] bg-[#F4EDE3]/70'
                  }`
                : isEditorialStyle
                ? `px-4 sm:px-8 ${
                    isDarkEffective
                      ? 'border-zinc-800 bg-zinc-900/70'
                      : 'border-stone-200 bg-stone-100/60'
                  }`
                : `px-3 sm:px-6 ${isDarkEffective ? 'border-white/10' : 'border-stone-200'} ${
                    !isDarkEffective ? 'bg-white' : ''
                  }`
            }`}
          >
            <button
              onClick={() => {
                setActiveTab('synopsis');
              }}
              className={`py-3.5 px-4 sm:px-6 text-sm sm:text-base font-bold transition-all cursor-pointer border-b-2 -mb-[1px] flex items-center gap-1.5 ${
                activeTab === 'synopsis'
                  ? isJournalStyle
                    ? 'border-[#9E5D72] text-[#9E5D72] dark:border-pink-400 dark:text-pink-300 font-sans'
                    : isNoteStyle
                    ? 'border-amber-500 text-amber-700 dark:border-amber-400 dark:text-amber-300 font-sans'
                    : isCinemaStyle
                    ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-mono'
                    : isCyberStyle
                    ? 'border-cyan-400 text-cyan-500 dark:border-cyan-300 dark:text-cyan-300 font-mono'
                    : isWaxSealStyle
                    ? 'border-red-800 text-red-900 dark:border-red-400 dark:text-red-300 font-serif'
                    : isEditorialStyle
                    ? 'border-stone-900 text-stone-900 dark:border-white dark:text-white font-mono'
                    : `${detailThemeExtras.activeTabBorderClass} ${isDarkEffective ? 'text-white' : 'text-stone-900'} font-sans`
                  : `border-transparent ${
                      isNoteStyle
                        ? 'text-amber-800/60 hover:text-amber-900 dark:text-amber-300/60 dark:hover:text-amber-200 font-sans'
                        : isCinemaStyle
                        ? 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white font-mono'
                        : isCyberStyle
                        ? 'text-cyan-700/60 hover:text-cyan-900 dark:text-cyan-300/60 dark:hover:text-cyan-100 font-mono'
                        : isWaxSealStyle
                        ? 'text-[#5C4033]/60 hover:text-[#5C4033] dark:text-amber-300/60 dark:hover:text-amber-200 font-serif'
                        : isEditorialStyle
                        ? 'text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200 font-mono'
                        : isDarkEffective
                        ? 'text-stone-400 hover:text-stone-200 font-sans'
                        : 'text-stone-500 hover:text-stone-800 font-sans'
                    }`
              }`}
            >
              {isNoteStyle ? (
                <>
                  <StickyNote className="w-3.5 h-3.5 opacity-80 text-amber-500" />
                  <span>Ghi chép văn án</span>
                </>
              ) : isCinemaStyle ? (
                <>
                  <Clapperboard className="w-3.5 h-3.5 opacity-90 text-amber-500" />
                  <span>[01] Screenplay · Văn án</span>
                </>
              ) : isCyberStyle ? (
                <>
                  <Terminal className="w-3.5 h-3.5 opacity-90 text-cyan-400" />
                  <span>[01] Transmission · Văn án</span>
                </>
              ) : isWaxSealStyle ? (
                <>
                  <Feather className="w-3.5 h-3.5 opacity-90 text-red-700 dark:text-red-400" />
                  <span>Bức Thư Tay · Văn Án</span>
                </>
              ) : isEditorialStyle ? (
                <>
                  <FileText className="w-3.5 h-3.5 opacity-80" />
                  <span>[01] OVERVIEW · VĂN ÁN</span>
                </>
              ) : (
                <>
                  <span>Giới thiệu</span>
                  {isJournalStyle && <span className="text-xs font-mono opacity-50 hidden sm:inline">· 内心想法</span>}
                </>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('chapters');
              }}
              className={`py-3.5 px-4 sm:px-6 text-sm sm:text-base font-bold transition-all cursor-pointer border-b-2 -mb-[1px] flex items-center gap-1.5 ${
                activeTab === 'chapters'
                  ? isJournalStyle
                    ? 'border-[#9E5D72] text-[#9E5D72] dark:border-pink-400 dark:text-pink-300 font-sans'
                    : isNoteStyle
                    ? 'border-amber-500 text-amber-700 dark:border-amber-400 dark:text-amber-300 font-sans'
                    : isCinemaStyle
                    ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-mono'
                    : isCyberStyle
                    ? 'border-indigo-400 text-indigo-500 dark:border-indigo-300 dark:text-indigo-300 font-mono'
                    : isWaxSealStyle
                    ? 'border-amber-800 text-amber-900 dark:border-amber-400 dark:text-amber-300 font-serif'
                    : isEditorialStyle
                    ? 'border-stone-900 text-stone-900 dark:border-white dark:text-white font-mono'
                    : `${detailThemeExtras.activeTabBorderClass} ${isDarkEffective ? 'text-white' : 'text-stone-900'} font-sans`
                  : `border-transparent ${
                      isNoteStyle
                        ? 'text-amber-800/60 hover:text-amber-900 dark:text-amber-300/60 dark:hover:text-amber-200 font-sans'
                        : isCinemaStyle
                        ? 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white font-mono'
                        : isCyberStyle
                        ? 'text-cyan-700/60 hover:text-cyan-900 dark:text-cyan-300/60 dark:hover:text-cyan-100 font-mono'
                        : isWaxSealStyle
                        ? 'text-[#5C4033]/60 hover:text-[#5C4033] dark:text-amber-300/60 dark:hover:text-amber-200 font-serif'
                        : isEditorialStyle
                        ? 'text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200 font-mono'
                        : isDarkEffective
                        ? 'text-stone-400 hover:text-stone-200 font-sans'
                        : 'text-stone-500 hover:text-stone-800 font-sans'
                    }`
              }`}
            >
              {isNoteStyle ? (
                <>
                  <Tag className="w-3.5 h-3.5 opacity-80 text-amber-500" />
                  <span>Mục lục ({effectiveChapters.length})</span>
                </>
              ) : isCinemaStyle ? (
                <>
                  <Film className="w-3.5 h-3.5 opacity-90 text-neutral-800 dark:text-neutral-200" />
                  <span>[02] Scenes ({effectiveChapters.length})</span>
                </>
              ) : isCyberStyle ? (
                <>
                  <Cpu className="w-3.5 h-3.5 opacity-90 text-indigo-400" />
                  <span>[02] Sectors ({effectiveChapters.length})</span>
                </>
              ) : isWaxSealStyle ? (
                <>
                  <Mail className="w-3.5 h-3.5 opacity-90 text-amber-700 dark:text-amber-400" />
                  <span>Hồi Chương Thư ({effectiveChapters.length})</span>
                </>
              ) : isEditorialStyle ? (
                <>
                  <Compass className="w-3.5 h-3.5 opacity-80" />
                  <span>[02] CHAPTER INDEX ({effectiveChapters.length})</span>
                </>
              ) : (
                <>
                  <span>Mục lục ({effectiveChapters.length})</span>
                  {isJournalStyle && <span className="text-xs font-mono opacity-50 hidden sm:inline">· 目录</span>}
                </>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('comments');
              }}
              className={`py-3.5 px-4 sm:px-6 text-sm sm:text-base font-bold transition-all cursor-pointer border-b-2 -mb-[1px] flex items-center gap-1.5 ${
                activeTab === 'comments'
                  ? isJournalStyle
                    ? 'border-[#9E5D72] text-[#9E5D72] dark:border-pink-400 dark:text-pink-300 font-sans'
                    : isNoteStyle
                    ? 'border-amber-500 text-amber-700 dark:border-amber-400 dark:text-amber-300 font-sans'
                    : isCinemaStyle
                    ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-mono'
                    : isCyberStyle
                    ? 'border-emerald-400 text-emerald-500 dark:border-emerald-300 dark:text-emerald-300 font-mono'
                    : isWaxSealStyle
                    ? 'border-rose-800 text-rose-900 dark:border-rose-400 dark:text-rose-300 font-serif'
                    : isEditorialStyle
                    ? 'border-stone-900 text-stone-900 dark:border-white dark:text-white font-mono'
                    : `${detailThemeExtras.activeTabBorderClass} ${isDarkEffective ? 'text-white' : 'text-stone-900'} font-sans`
                  : `border-transparent ${
                      isNoteStyle
                        ? 'text-amber-800/60 hover:text-amber-900 dark:text-amber-300/60 dark:hover:text-amber-200 font-sans'
                        : isCinemaStyle
                        ? 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white font-mono'
                        : isCyberStyle
                        ? 'text-cyan-700/60 hover:text-cyan-900 dark:text-cyan-300/60 dark:hover:text-cyan-100 font-mono'
                        : isWaxSealStyle
                        ? 'text-[#5C4033]/60 hover:text-[#5C4033] dark:text-amber-300/60 dark:hover:text-amber-200 font-serif'
                        : isEditorialStyle
                        ? 'text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200 font-mono'
                        : isDarkEffective
                        ? 'text-stone-400 hover:text-stone-200 font-sans'
                        : 'text-stone-500 hover:text-stone-800 font-sans'
                    }`
              }`}
            >
              {isNoteStyle ? (
                <>
                  <MessageCircle className="w-3.5 h-3.5 opacity-80 text-amber-500" />
                  <span>Lời nhắn bạn đọc ({comments.length})</span>
                </>
              ) : isCinemaStyle ? (
                <>
                  <Camera className="w-3.5 h-3.5 opacity-90 text-neutral-800 dark:text-neutral-200" />
                  <span>[03] Production Logs ({comments.length})</span>
                </>
              ) : isCyberStyle ? (
                <>
                  <Zap className="w-3.5 h-3.5 opacity-90 text-emerald-400" />
                  <span>[03] Neural Logs ({comments.length})</span>
                </>
              ) : isWaxSealStyle ? (
                <>
                  <Stamp className="w-3.5 h-3.5 opacity-90 text-rose-700 dark:text-rose-400" />
                  <span>Lưu Bút Bạn Đọc ({comments.length})</span>
                </>
              ) : isEditorialStyle ? (
                <>
                  <MessageCircle className="w-3.5 h-3.5 opacity-80" />
                  <span>[03] READERS' CRITIQUE ({comments.length})</span>
                </>
              ) : (
                <>
                  <span>Bình luận ({comments.length})</span>
                  {isJournalStyle && <span className="text-xs font-mono opacity-50 hidden sm:inline">· 讨论</span>}
                </>
              )}
            </button>
          </div>

          {/* Tab Content Container */}
          <div
            className={`${isJournalStyle ? 'pl-10 sm:pl-14 pr-4 sm:pr-8 py-5 sm:py-7' : 'p-4 sm:p-6 lg:p-8'} ${
              !isDarkEffective ? 'bg-white' : ''
            }`}
          >
            {/* Tab 1: Giới thiệu */}
            {activeTab === 'synopsis' && (
              <motion.div
                ref={synopsisSectionRef}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* EDITING MODE CONTAINER */}
                {isEditingSynopsis ? (
                  <div
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                        e.preventDefault();
                        handleSaveSynopsis();
                      }
                    }}
                    className={`rounded-3xl border p-5 sm:p-7 space-y-6 ${detailThemeExtras.innerBox}`}
                  >
                    {/* Sub-tabs: Soạn thảo vs Xem trước */}
                    <div className="flex items-center justify-between border-b pb-3 gap-2 flex-wrap border-white/10">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveSynopsisSubTab('edit')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                            activeSynopsisSubTab === 'edit'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : isDarkEffective
                              ? 'text-stone-400 hover:text-white bg-white/5'
                              : 'text-stone-600 hover:text-stone-900 bg-stone-100'
                          }`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Soạn thảo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSynopsisSubTab('preview')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                            activeSynopsisSubTab === 'preview'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : isDarkEffective
                              ? 'text-stone-400 hover:text-white bg-white/5'
                              : 'text-stone-600 hover:text-stone-900 bg-stone-100'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Xem trước</span>
                        </button>
                      </div>

                      {/* Quick Formatting tools */}
                      {activeSynopsisSubTab === 'edit' && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Normalize paragraphs: collapse 3+ consecutive newlines to 2 newlines
                              const cleaned = editSynopsis
                                .split('\n')
                                .map((l) => l.trimEnd())
                                .join('\n')
                                .replace(/\n{3,}/g, '\n\n')
                                .trim();
                              setEditSynopsis(cleaned);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-purple-300 hover:bg-purple-500/15 border border-purple-500/20 cursor-pointer transition-colors"
                            title="Chuẩn hóa dòng trắng giữa các đoạn văn"
                          >
                            Chuẩn hóa đoạn văn
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Sub-tab 1: Form Soạn thảo */}
                    {activeSynopsisSubTab === 'edit' && (
                      <div className="space-y-5">
                        {/* Field 1: Giới thiệu cốt truyện */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${isDarkEffective ? 'text-white' : 'text-stone-900'}`}>
                              <span>Nội dung giới thiệu cốt truyện</span>
                              <span className="text-rose-400">*</span>
                            </label>
                            <span className="text-[11px] font-mono text-stone-400">
                              {editSynopsis.split(/\s+/).filter(Boolean).length} từ | {editSynopsis.length} ký tự
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400">
                            Các đoạn văn cách nhau bằng 1 dòng trống. Bạn có thể tự do chỉnh sửa hoặc viết mới.
                          </p>
                          <textarea
                            value={editSynopsis}
                            onChange={(e) => setEditSynopsis(e.target.value)}
                            placeholder="Nhập phần tóm tắt cốt truyện, văn án của tiểu thuyết tại đây..."
                            rows={10}
                            className={`w-full rounded-2xl p-4 text-sm sm:text-base font-source-sans leading-relaxed border outline-none transition-all resize-y min-h-[220px] focus:ring-2 focus:ring-purple-500/40 ${
                              isDarkEffective
                                ? 'bg-black/40 border-white/15 text-stone-100 placeholder:text-stone-500'
                                : 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400'
                            }`}
                          />
                        </div>

                        {/* Field 2: Thiết lập nhân vật & bối cảnh */}
                        <div className="space-y-1.5">
                          <label className={`text-xs sm:text-sm font-bold ${isDarkEffective ? 'text-white' : 'text-stone-900'}`}>
                            Thiết lập nhân vật / bối cảnh (World Lore - Không bắt buộc)
                          </label>
                          <p className="text-[11px] text-stone-400">
                            Ví dụ: Giảo hoạt cừu non x Phúc hắc thợ săn, Niên thượng, Hiện đại thực tế, HE...
                          </p>
                          <textarea
                            value={editWorldLore}
                            onChange={(e) => setEditWorldLore(e.target.value)}
                            placeholder="Nhập thông tin nhân vật, bối cảnh (nếu có)..."
                            rows={3}
                            className={`w-full rounded-2xl p-3.5 text-xs sm:text-sm font-source-sans leading-relaxed border outline-none transition-all resize-y min-h-[80px] focus:ring-2 focus:ring-purple-500/40 ${
                              isDarkEffective
                                ? 'bg-black/40 border-white/15 text-stone-100 placeholder:text-stone-500'
                                : 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400'
                            }`}
                          />
                        </div>

                        {/* Field 3: Lời nhắn của người đăng */}
                        <div className="space-y-1.5">
                          <label className={`text-xs sm:text-sm font-bold ${isDarkEffective ? 'text-white' : 'text-stone-900'}`}>
                            Lời nhắn của người đăng (Uploader Note)
                          </label>
                          <p className="text-[11px] text-stone-400">
                            Hiển thị trong khung thông báo đầu trang của tiểu thuyết.
                          </p>
                          <input
                            type="text"
                            value={editUploaderNote}
                            onChange={(e) => setEditUploaderNote(e.target.value)}
                            placeholder="Đọc kỹ tất cả các tags và giới thiệu truyện, chúc mọi người có khoảng thời gian đọc truyện vui vẻ."
                            className={`w-full rounded-2xl px-4 py-3 text-xs sm:text-sm font-source-sans border outline-none transition-all focus:ring-2 focus:ring-purple-500/40 ${
                              isDarkEffective
                                ? 'bg-black/40 border-white/15 text-stone-100 placeholder:text-stone-500'
                                : 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Sub-tab 2: Xem trước kết quả trực tiếp */}
                    {activeSynopsisSubTab === 'preview' && (
                      <div className="space-y-5">
                        <div className="p-4 sm:p-6 rounded-2xl border bg-black/20 border-white/10 space-y-4">
                          <div className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Xem trước giao diện người đọc</span>
                          </div>
                          <div className="space-y-4">
                            {editSynopsis.trim() ? (
                              editSynopsis.split('\n\n').map((para, idx) => (
                                <p
                                  key={idx}
                                  className={`font-source-sans text-[16px] sm:text-[18px] leading-relaxed tracking-normal whitespace-pre-line ${
                                    isDarkEffective ? 'text-stone-200' : 'text-stone-700'
                                  }`}
                                  style={{ lineHeight: '1.85' }}
                                >
                                  {para.trim()}
                                </p>
                              ))
                            ) : (
                              <p className="text-stone-400 italic text-sm">(Chưa có nội dung giới thiệu)</p>
                            )}
                          </div>

                          {editWorldLore.trim() && (
                            <div className={`mt-6 pt-5 border-t ${isDarkEffective ? 'border-white/10' : 'border-stone-200/80'}`}>
                              <h4 className={`text-[15px] sm:text-[17px] font-source-sans font-bold mb-1.5 ${isDarkEffective ? 'text-white' : 'text-stone-900'}`}>
                                Thiết lập nhân vật
                              </h4>
                              <p className={`font-source-sans text-[14px] sm:text-[16px] leading-relaxed ${isDarkEffective ? 'text-stone-300' : 'text-stone-600'}`}>
                                {editWorldLore}
                              </p>
                            </div>
                          )}

                          {editUploaderNote.trim() && (
                            <div className={`mt-4 p-3 rounded-xl border text-xs sm:text-sm font-source-sans ${detailThemeExtras.posterNoteBox}`}>
                              <span className="font-bold">Lời nhắn: </span>
                              <span>{editUploaderNote}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 border-white/10">
                      <span className="text-[11px] text-stone-400 font-mono">
                        Phím tắt: Nhấn <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-bold">Ctrl+S</kbd> hoặc nút <strong className="text-emerald-400 font-semibold">Lưu thay đổi</strong> để áp dụng.
                      </span>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={handleCancelEditSynopsis}
                          className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-sans font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                            isDarkEffective
                              ? 'border-white/10 bg-white/5 hover:bg-white/10 text-stone-300'
                              : 'border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          <span>Hủy</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSavingSynopsis}
                          onClick={() => handleSaveSynopsis()}
                          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-bold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white cursor-pointer shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-98"
                        >
                          {isSavingSynopsis ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Đang lưu Firebase...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Lưu vào Firebase</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : isJournalStyle ? (
                  /* READ ONLY SYNOPSIS CARD: SỔ TAY CÒNG 内心想法 THEO ẢNH MẪU */
                  <div
                    className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-7 md:p-9 relative transition-all duration-300 ${
                      isDarkEffective
                        ? 'bg-[#15161C] border-zinc-700/80 text-zinc-100 shadow-[0_12px_36px_rgba(0,0,0,0.5)]'
                        : 'bg-[#FFFDF7] border-[#E8DFD8] text-[#3D3A37] shadow-[0_10px_30px_rgba(180,160,150,0.12)]'
                    }`}
                    style={{
                      backgroundImage: isDarkEffective
                        ? `repeating-linear-gradient(transparent, transparent 33px, rgba(255, 255, 255, 0.04) 33px, rgba(255, 255, 255, 0.04) 34px)`
                        : `repeating-linear-gradient(transparent, transparent 33px, rgba(220, 205, 215, 0.35) 33px, rgba(220, 205, 215, 0.35) 34px)`,
                      backgroundPosition: '0 44px',
                    }}
                  >
                    {/* HEADER TỜ 内心想法 (THEO ẢNH MẪU): ICON THOẠI 💬 + VẠCH |||, TIÊU ĐỀ 内心想法, KẸP GIẤY 📎 VÀ TRÁI TIM 🤍 */}
                    <div className="flex items-start justify-between pb-4 border-b border-dashed border-stone-300/80 dark:border-zinc-700/80">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-[#E5DCD6] dark:border-zinc-700 flex items-center justify-center text-stone-700 dark:text-zinc-200 shadow-2xs">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          {/* 3 vạch sóng nhỏ dưới icon thoại theo ảnh mẫu */}
                          <div className="flex items-center gap-[2.5px] mt-1 opacity-60">
                            <span className="w-[1.5px] h-1.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                            <span className="w-[1.5px] h-2.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                            <span className="w-[1.5px] h-1.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                          </div>
                        </div>

                        <div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-black tracking-tight leading-none text-stone-900 dark:text-white">
                            内心想法
                          </h2>
                          <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase opacity-60 mt-0.5">
                            INNER THOUGHTS · VĂN ÁN & NỘI TÂM
                          </p>
                        </div>
                      </div>

                      {/* Cụm Kẹp giấy 📎 & Trái tim 🤍 theo ảnh mẫu + Nút Sửa văn án cho Admin */}
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={handleOpenEditSynopsis}
                            className="px-3 py-1.5 rounded-xl border border-[#9E5D72]/40 bg-[#9E5D72]/15 hover:bg-[#9E5D72]/25 text-[#9E5D72] dark:text-pink-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Chỉnh sửa văn án truyện"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Chỉnh sửa</span>
                          </button>
                        )}

                        <div className="flex items-center gap-1.5 text-stone-400 dark:text-zinc-500">
                          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45" />
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </div>
                    </div>

                    {/* NỘI DUNG VĂN ÁN NẰM TRÊN CÁC DÒNG KẺ SỔ TAY */}
                    <div className="pt-4 space-y-4">
                      {novel.synopsis.split('\n\n').map((para, idx) => (
                        <p
                          key={idx}
                          className="font-source-sans text-[16px] sm:text-[18px] leading-[34px] tracking-normal whitespace-pre-line text-stone-800 dark:text-stone-200"
                        >
                          {para.trim()}
                        </p>
                      ))}
                    </div>

                    {/* THIẾT LẬP NHÂN VẬT (NẾU CÓ) */}
                    {effectiveWorldLore && (
                      <div className="mt-8 pt-6 border-t border-dashed border-stone-300/80 dark:border-zinc-700/80">
                        <h3 className="text-[16px] sm:text-[18px] font-source-sans font-bold mb-2 text-[#9E5D72] dark:text-pink-300 flex items-center gap-2">
                          <span>Thiết lập nhân vật</span>
                          <span className="text-xs font-mono opacity-60">· 角色设定</span>
                        </h3>
                        <p className="font-source-sans text-[16px] sm:text-[18px] leading-[34px] whitespace-pre-line text-stone-700 dark:text-stone-300">
                          {effectiveWorldLore}
                        </p>
                      </div>
                    )}

                    {/* LỜI NHẮN NGƯỜI ĐĂNG (NẾU CÓ) */}
                    {novel.uploaderNote && (
                      <div className="mt-6 p-4 rounded-xl border border-dashed border-[#E5CBD7] dark:border-zinc-700 bg-[#FDF9F7] dark:bg-zinc-900/60 text-xs sm:text-sm font-source-sans text-stone-700 dark:text-stone-300 flex items-start gap-2">
                        <span className="font-bold text-[#9E5D72] dark:text-pink-400 shrink-0">Lời nhắn:</span>
                        <span className="leading-relaxed">{novel.uploaderNote}</span>
                      </div>
                    )}

                    {/* CỤM ĐUÔI THEO ẢNH MẪU: CHỮ NGHỆ THUẬT "It is okay to be a little soft." VÀ TRÁI TIM KÈM 5 VẠCH SÓNG ÂM (.||||) */}
                    <div className="mt-8 pt-4 border-t border-dashed border-stone-300/80 dark:border-zinc-700/80 flex items-end justify-between flex-wrap gap-2">
                      <div className="space-y-0.5">
                        <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#9E5D72] dark:text-pink-400 font-medium">
                          It is okay to be a little soft.
                        </p>
                        <p className="text-[11px] font-mono opacity-50">
                          Tác phẩm hoàn thành · Editor: Jouriee65
                        </p>
                      </div>

                      {/* Trái tim và 5 cột sóng âm cảm xúc (.||||) ở góc dưới phải như ảnh mẫu */}
                      <div className="flex flex-col items-end gap-1 opacity-70 select-none pb-1 ml-auto">
                        <Heart className="w-4 h-4 text-[#9E5D72] dark:text-pink-400" />
                        <div className="flex items-end gap-[2px] h-4">
                          <span className="w-[2px] h-1.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                          <span className="w-[2px] h-2.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                          <span className="w-[2px] h-4 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                          <span className="w-[2px] h-2.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                          <span className="w-[2px] h-1.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : isNoteStyle ? (
                  /* READ ONLY SYNOPSIS CARD (KIỂU GIẤY NOTE) */
                  <div
                    className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-8 md:p-10 relative transition-all duration-300 ${
                      isDarkEffective
                        ? 'bg-[#1A1813] border-amber-900/50 text-amber-100 shadow-[0_14px_40px_rgba(0,0,0,0.6)]'
                        : 'bg-[#FFFDF6] border-amber-200/90 text-[#3C321E] shadow-[0_12px_36px_rgba(245,158,11,0.1)]'
                    }`}
                  >
                    {/* Băng dính Washi mép trên */}
                    <div className="absolute -top-2 left-12 w-24 h-4 bg-amber-200/80 dark:bg-amber-800/40 border border-amber-300/60 rounded-xs -rotate-2 pointer-events-none shadow-xs" />

                    {/* HEADER GIẤY NOTE */}
                    <div className="flex items-start justify-between pb-5 border-b border-amber-200 dark:border-amber-900/40 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 dark:bg-amber-500/25 border border-amber-400/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
                          <StickyNote className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-sans font-bold tracking-tight text-amber-950 dark:text-amber-100">
                            Ghi Chép Văn Án
                          </h2>
                          <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                            MEMO SYNOPSIS · SỔ GHI CHÚ TÁC PHẨM
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 sm:gap-3">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={handleOpenEditSynopsis}
                            className="px-3 py-1.5 rounded-xl border border-amber-400/50 bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Chỉnh sửa văn án truyện"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Chỉnh sửa</span>
                          </button>
                        )}

                        <div className="px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-mono text-[10px] uppercase tracking-wider font-bold shadow-2xs">
                          MEMO NOTE
                        </div>
                      </div>
                    </div>

                    {/* NỘI DUNG VĂN ÁN */}
                    <div className="pt-6 space-y-4 relative z-10">
                      {novel.synopsis.split('\n\n').map((para, idx) => (
                        <p
                          key={idx}
                          className="font-sans text-[16px] sm:text-[18px] leading-[34px] whitespace-pre-line text-[#4A3E2A] dark:text-amber-100/90"
                        >
                          {para.trim()}
                        </p>
                      ))}
                    </div>

                    {/* THIẾT LẬP NHÂN VẬT TRÊN GIẤY NOTE */}
                    {effectiveWorldLore && (
                      <div className="mt-8 p-4 sm:p-5 rounded-2xl border border-dashed border-amber-300/80 dark:border-amber-800/60 bg-amber-100/30 dark:bg-amber-950/30 relative z-10">
                        <h3 className="text-[15px] sm:text-[17px] font-sans font-bold mb-2 text-amber-900 dark:text-amber-200 flex items-center gap-2">
                          <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>Ghi chú nhân vật & Thiết lập thế giới</span>
                          <span className="text-xs font-mono opacity-60">· 备忘录</span>
                        </h3>
                        <p className="font-sans text-[15px] sm:text-[17px] leading-[30px] whitespace-pre-line text-[#524430] dark:text-amber-200/90">
                          {effectiveWorldLore}
                        </p>
                      </div>
                    )}

                    {/* LỜI NHẮN */}
                    {novel.uploaderNote && (
                      <div className="mt-6 p-4 rounded-xl border border-dashed border-amber-300/70 bg-amber-50 dark:bg-amber-950/40 text-xs sm:text-sm font-sans text-amber-900 dark:text-amber-200 flex items-start gap-2 relative z-10">
                        <span className="font-bold text-amber-800 dark:text-amber-300 shrink-0">Lời nhắn:</span>
                        <span className="leading-relaxed">{novel.uploaderNote}</span>
                      </div>
                    )}

                    {/* CHÂN TRANG GIẤY NOTE */}
                    <div className="mt-8 pt-4 border-t border-amber-200 dark:border-amber-900/40 flex items-end justify-between flex-wrap gap-2 relative z-10">
                      <div className="space-y-0.5">
                        <p className="font-sans italic text-base sm:text-lg text-amber-800 dark:text-amber-300 font-medium">
                          Ghi chú hoàn tất — Tác phẩm đã hoàn thành.
                        </p>
                        <p className="text-[11px] font-mono opacity-70">
                          Hoàn thành · Editor: Jouriee65
                        </p>
                      </div>
                      <div className="text-xs font-mono tracking-widest text-amber-800 dark:text-amber-300 select-none opacity-80">
                        ★ NOTE MEMORANDUM ★
                      </div>
                    </div>
                  </div>
                ) : isCinemaStyle ? (
                  /* READ ONLY SYNOPSIS CARD (KIỂU 4: CINEMATOGRAPHY / KỊCH BẢN ĐIỆN ẢNH) */
                  <div
                    className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-8 md:p-10 relative transition-all duration-300 font-mono ${
                      isDarkEffective
                        ? 'bg-[#18181B] border-neutral-700/80 text-neutral-100 shadow-[0_14px_40px_rgba(0,0,0,0.7)]'
                        : 'bg-[#FAF9F5] border-[#E2DDD5] text-neutral-900 shadow-[0_12px_36px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    {/* Clapperboard stripes */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#111,#111_12px,#eee_12px,#eee_24px)] opacity-90 pointer-events-none" />

                    {/* HEADER CINEMATOGRAPHY SCREENPLAY */}
                    <div className="flex items-start justify-between pb-5 border-b border-dashed border-neutral-300 dark:border-neutral-700 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
                          <Clapperboard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-bold tracking-widest uppercase font-mono">
                              SCENE 01 · SCREENPLAY
                            </span>
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold font-mono">
                              35MM CINEMASCOPE
                            </span>
                          </div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
                            Screenplay Overview · Văn Án Tác Phẩm
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={handleOpenEditSynopsis}
                            className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-neutral-900 dark:text-neutral-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Chỉnh sửa văn án truyện"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Chỉnh sửa</span>
                          </button>
                        )}
                        <span className="px-2.5 py-1 rounded-md bg-black/10 dark:bg-white/10 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono">
                          TAKE 01 ● 24 FPS
                        </span>
                      </div>
                    </div>

                    {/* NỘI DUNG VĂN ÁN */}
                    <div className="pt-6 space-y-4 relative z-10 font-sans">
                      {novel.synopsis.split('\n\n').map((para, idx) => (
                        <p
                          key={idx}
                          className="text-[16px] sm:text-[18px] leading-[34px] whitespace-pre-line text-[#2E2A27] dark:text-neutral-200"
                        >
                          {para.trim()}
                        </p>
                      ))}
                    </div>

                    {/* THIẾT LẬP NHÂN VẬT / CASTING */}
                    {effectiveWorldLore && (
                      <div className="mt-8 p-4 sm:p-5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-850/50 relative z-10 font-sans">
                        <h3 className="text-[15px] sm:text-[17px] font-bold mb-2 text-neutral-900 dark:text-neutral-100 flex items-center gap-2 font-mono">
                          <Film className="w-4 h-4 text-amber-500" />
                          <span>Cast & World Lore · Thiết lập nhân vật & Bối cảnh</span>
                        </h3>
                        <p className="text-[15px] sm:text-[17px] leading-[30px] whitespace-pre-line text-neutral-800 dark:text-neutral-200">
                          {effectiveWorldLore}
                        </p>
                      </div>
                    )}

                    {/* LỜI NHẮN ĐẠO DIỄN / DIRECTOR NOTE */}
                    {novel.uploaderNote && (
                      <div className="mt-6 p-4 rounded-xl border border-dashed border-amber-300/70 bg-amber-50 dark:bg-amber-950/40 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2 relative z-10 font-sans">
                        <span className="font-bold text-amber-800 dark:text-amber-300 shrink-0 font-mono">Director's Note:</span>
                        <span className="leading-relaxed">{novel.uploaderNote}</span>
                      </div>
                    )}

                    {/* CHÂN TRANG CINEMA */}
                    <div className="mt-8 pt-4 border-t border-dashed border-neutral-300 dark:border-neutral-700 flex items-end justify-between flex-wrap gap-2 relative z-10 font-mono">
                      <div className="space-y-0.5 font-sans">
                        <p className="italic text-base sm:text-lg text-neutral-900 dark:text-neutral-200 font-medium">
                          Cut! That's a wrap — Cảm ơn bạn đã theo dõi thước phim.
                        </p>
                        <p className="text-[11px] font-mono opacity-70">
                          Hoàn thành trọn vẹn · Editor: Jouriee65
                        </p>
                      </div>
                      <div className="text-xs font-mono tracking-widest text-neutral-600 dark:text-neutral-400 select-none opacity-80">
                        🎬 CINEMATOGRAPHY PRODUCTION 🎬
                      </div>
                    </div>
                  </div>
                ) : isCyberStyle ? (
                  /* READ ONLY SYNOPSIS CARD (KIỂU 5: CYBER HUD TELEMETRY) */
                  <div
                    className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-8 md:p-10 relative transition-all duration-300 font-mono ${
                      isDarkEffective
                        ? 'bg-[#090E17] border-cyan-500/40 text-cyan-100 shadow-[0_14px_40px_rgba(0,0,0,0.8)]'
                        : 'bg-[#F2F9FB] border-cyan-600/30 text-[#092B38] shadow-[0_12px_36px_rgba(6,182,212,0.12)]'
                    }`}
                  >
                    {/* Đường neon quét trên cùng */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 pointer-events-none" />

                    {/* HEADER CYBER TERMINAL */}
                    <div className="flex items-start justify-between pb-5 border-b border-cyan-400/30 dark:border-cyan-500/30 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 dark:bg-cyan-500/25 border border-cyan-400/50 flex items-center justify-center text-cyan-600 dark:text-cyan-300 shadow-xs">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] text-cyan-600 dark:text-cyan-300 font-bold uppercase tracking-widest">
                              SYS://TRANSMISSION.01
                            </span>
                          </div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-cyan-100 mt-0.5">
                            Data Dossier · Văn Án Tác Phẩm
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={handleOpenEditSynopsis}
                            className="px-3 py-1.5 rounded-xl border border-cyan-400/50 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-900 dark:text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Chỉnh sửa văn án truyện"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">EDIT_PACKET</span>
                          </button>
                        )}
                        <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-[10px] font-bold text-cyan-600 dark:text-cyan-300 border border-cyan-400/40">
                          STATUS: 200_OK
                        </span>
                      </div>
                    </div>

                    {/* NỘI DUNG VĂN ÁN CYBER */}
                    <div className="pt-6 space-y-4 relative z-10 font-sans">
                      {novel.synopsis.split('\n\n').map((para, idx) => (
                        <p
                          key={idx}
                          className="text-[16px] sm:text-[18px] leading-[34px] whitespace-pre-line text-[#183946] dark:text-cyan-100/90"
                        >
                          {para.trim()}
                        </p>
                      ))}
                    </div>

                    {/* THIẾT LẬP THẾ GIỚI MATRIX */}
                    {effectiveWorldLore && (
                      <div className="mt-8 p-4 sm:p-5 rounded-2xl border border-cyan-400/40 dark:border-cyan-500/30 bg-cyan-500/5 relative z-10 font-sans">
                        <h3 className="text-[15px] sm:text-[17px] font-bold mb-2 text-cyan-900 dark:text-cyan-200 flex items-center gap-2 font-mono">
                          <Cpu className="w-4 h-4 text-cyan-500" />
                          <span>World Lore & Entity Matrix · Thiết lập thế giới</span>
                        </h3>
                        <p className="text-[15px] sm:text-[17px] leading-[30px] whitespace-pre-line text-[#163B4A] dark:text-cyan-200/90">
                          {effectiveWorldLore}
                        </p>
                      </div>
                    )}

                    {/* LỜI NHẮN OPERATOR */}
                    {novel.uploaderNote && (
                      <div className="mt-6 p-4 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-xs sm:text-sm text-cyan-950 dark:text-cyan-200 flex items-start gap-2 relative z-10 font-sans">
                        <span className="font-bold text-cyan-800 dark:text-cyan-300 shrink-0 font-mono">Operator Log:</span>
                        <span className="leading-relaxed">{novel.uploaderNote}</span>
                      </div>
                    )}

                    {/* CHÂN TRANG CYBER */}
                    <div className="mt-8 pt-4 border-t border-cyan-400/30 dark:border-cyan-500/30 flex items-end justify-between flex-wrap gap-2 relative z-10">
                      <div className="space-y-0.5 font-sans">
                        <p className="italic text-base sm:text-lg text-cyan-900 dark:text-cyan-200 font-medium">
                          Tải dữ liệu hoàn tất — Toàn bộ tệp truyện đã hoàn thành.
                        </p>
                        <p className="text-[11px] font-mono opacity-70">
                          Status: Completed · Editor: Jouriee65
                        </p>
                      </div>
                      <div className="text-xs font-mono tracking-widest text-cyan-700 dark:text-cyan-300 select-none opacity-80">
                        ⚡ CYBER TELEMETRY FEED ⚡
                      </div>
                    </div>
                  </div>
                ) : isWaxSealStyle ? (
                  /* READ ONLY SYNOPSIS CARD (KIỂU 6: THƯ HOÀNG GIA NIÊM SÁP) */
                  <div
                    className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-8 md:p-10 relative transition-all duration-300 font-serif ${
                      isDarkEffective
                        ? 'bg-[#1A1513] border-[#4A3831] text-[#EDE0D4] shadow-[0_14px_40px_rgba(0,0,0,0.8)]'
                        : 'bg-[#FBF5ED] border-[#DAC8B6] text-[#3A2A22] shadow-[0_12px_36px_rgba(150,110,80,0.12)]'
                    }`}
                  >
                    {/* Dải bưu chính Air Mail trang trí */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(45deg,#b91c1c,#b91c1c_10px,#ffffff_10px,#ffffff_20px,#1d4ed8_20px,#1d4ed8_30px,#ffffff_30px,#ffffff_40px)] opacity-70 pointer-events-none" />

                    {/* HEADER BỨC THƯ TAY */}
                    <div className="flex items-start justify-between pb-5 border-b border-dashed border-[#D2BFAC] dark:border-[#523F36] relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-800/15 dark:bg-red-800/25 border border-red-700/40 flex items-center justify-center text-red-700 dark:text-red-300 shadow-xs">
                          <Feather className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] text-red-800 dark:text-red-400 font-mono tracking-widest uppercase font-bold">
                            SEALED EPISTLE · THƯ TAY BẢO MẬT
                          </span>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#302119] dark:text-[#F3E7DC] mt-0.5">
                            Bức Thư Tay · Văn Án Tác Phẩm
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={handleOpenEditSynopsis}
                            className="px-3 py-1.5 rounded-xl border border-red-800/40 bg-red-800/10 hover:bg-red-800/20 text-red-900 dark:text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs font-sans"
                            title="Chỉnh sửa văn án truyện"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Khắc lại</span>
                          </button>
                        )}
                        <div className="w-7 h-7 rounded-full bg-red-800 flex items-center justify-center shadow-md border border-amber-300/40">
                          <Stamp className="w-3.5 h-3.5 text-amber-200" />
                        </div>
                      </div>
                    </div>

                    {/* NỘI DUNG VĂN ÁN DẠNG BỨC THƯ TAY */}
                    <div className="pt-6 space-y-4 relative z-10">
                      {novel.synopsis.split('\n\n').map((para, idx) => (
                        <p
                          key={idx}
                          className="text-[16px] sm:text-[18px] leading-[36px] whitespace-pre-line text-[#443228] dark:text-[#EDE0D4]"
                        >
                          {para.trim()}
                        </p>
                      ))}
                    </div>

                    {/* THIẾT LẬP NHÂN VẬT TRÊN GIẤY DA CỔ */}
                    {effectiveWorldLore && (
                      <div className="mt-8 p-4 sm:p-5 rounded-2xl border border-dashed border-[#D2BFAC] dark:border-[#523F36] bg-[#F4EDE3]/60 dark:bg-[#241C18]/60 relative z-10">
                        <h3 className="text-[15px] sm:text-[17px] font-bold mb-2 text-red-900 dark:text-red-300 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-red-700 dark:text-red-400" />
                          <span>Danh tính cố nhân & Thiết lập bối cảnh</span>
                        </h3>
                        <p className="text-[15px] sm:text-[17px] leading-[32px] whitespace-pre-line text-[#4A382E] dark:text-[#E0D2C4]">
                          {effectiveWorldLore}
                        </p>
                      </div>
                    )}

                    {/* LỜI NHẮN HẬU TỰ */}
                    {novel.uploaderNote && (
                      <div className="mt-6 p-4 rounded-xl border border-dashed border-red-800/30 bg-red-800/5 text-xs sm:text-sm text-red-950 dark:text-red-200 flex items-start gap-2 relative z-10 font-sans">
                        <span className="font-bold text-red-800 dark:text-red-300 shrink-0 font-serif">Hậu thư:</span>
                        <span className="leading-relaxed">{novel.uploaderNote}</span>
                      </div>
                    )}

                    {/* CHÂN TRANG NIÊM SÁP */}
                    <div className="mt-8 pt-4 border-t border-dashed border-[#D2BFAC] dark:border-[#523F36] flex items-end justify-between flex-wrap gap-2 relative z-10">
                      <div className="space-y-0.5">
                        <p className="italic text-base sm:text-lg text-red-900 dark:text-red-300 font-medium">
                          Bức thư kết thúc — Tác phẩm đã hoàn thành viên mãn.
                        </p>
                        <p className="text-[11px] font-mono opacity-70">
                          Hoàn thành · Người dịch: Jouriee65
                        </p>
                      </div>
                      <div className="text-xs font-mono tracking-widest text-red-800 dark:text-red-400 select-none opacity-80">
                        ⚜ ROYAL SEALED LETTER ⚜
                      </div>
                    </div>
                  </div>
                ) : isEditorialStyle ? (
                  /* READ ONLY SYNOPSIS CARD (KIỂU 4: TẠP CHÍ VĂN HỌC HIỆN ĐẠI) */
                  <div
                    className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-8 md:p-10 relative transition-all duration-300 ${
                      isDarkEffective
                        ? 'bg-[#121316] border-zinc-700 text-zinc-100 shadow-[0_16px_45px_rgba(0,0,0,0.7)]'
                        : 'bg-[#FDFCFA] border-stone-300 text-stone-900 shadow-[0_10px_35px_rgba(0,0,0,0.05)]'
                    }`}
                  >
                    {/* Dải hairline trên đầu */}
                    <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-stone-900 dark:bg-white" />

                    {/* HEADER TẠP CHÍ */}
                    <div className="flex items-start justify-between pb-5 border-b border-stone-200 dark:border-zinc-800">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-xs bg-stone-900 dark:bg-white text-white dark:text-black font-mono text-[10px] font-bold tracking-widest uppercase">
                            ARTICLE 01
                          </span>
                          <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                            ESSAY & SYNOPSIS
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-sans font-black tracking-tight uppercase text-stone-900 dark:text-white">
                          {novel.title}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={handleOpenEditSynopsis}
                            className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                            title="Chỉnh sửa văn án truyện"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>EDIT</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* NỘI DUNG VĂN ÁN VỚI TYPOGRAPHY EDITORIAL */}
                    <div className="pt-6 space-y-5">
                      {novel.synopsis.split('\n\n').map((para, idx) => (
                        <p
                          key={idx}
                          className="font-sans text-[16px] sm:text-[18px] leading-[34px] whitespace-pre-line text-stone-800 dark:text-stone-200"
                        >
                          {idx === 0 && para.trim().length > 0 ? (
                            <>
                              <span className="float-left text-4xl sm:text-5xl font-black leading-none pr-3 pt-1 text-stone-900 dark:text-white">
                                {para.trim().charAt(0)}
                              </span>
                              {para.trim().slice(1)}
                            </>
                          ) : (
                            para.trim()
                          )}
                        </p>
                      ))}
                    </div>

                    {/* THIẾT LẬP NHÂN VẬT DOSSIER */}
                    {effectiveWorldLore && (
                      <div className="mt-8 p-5 sm:p-6 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/70 dark:bg-zinc-900/50">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-widest mb-2 text-stone-500 dark:text-stone-400">
                          [DOSSIER] CHARACTER PROFILES & LORE
                        </h3>
                        <p className="font-sans text-[15px] sm:text-[17px] leading-[32px] whitespace-pre-line text-stone-700 dark:text-stone-300">
                          {effectiveWorldLore}
                        </p>
                      </div>
                    )}

                    {/* LỜI TỰA CURATORIAL STATEMENT */}
                    {novel.uploaderNote && (
                      <div className="mt-6 p-4 rounded-xl border-l-2 border-stone-900 dark:border-white bg-stone-100/60 dark:bg-zinc-900/60 text-xs sm:text-sm font-sans text-stone-700 dark:text-stone-300 flex items-start gap-2">
                        <span className="font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-white shrink-0">Note:</span>
                        <span className="leading-relaxed">{novel.uploaderNote}</span>
                      </div>
                    )}

                    {/* CHÂN TRANG TẠP CHÍ */}
                    <div className="mt-8 pt-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-stone-500 dark:text-stone-400">
                      <span>COMPLETED EDITION</span>
                      <span>CURATED BY JOURIEE65</span>
                    </div>
                  </div>
                ) : (
                  /* READ ONLY SYNOPSIS CARD (KIỂU 1: TIÊU CHUẨN) */
                  <div className={`rounded-3xl border p-6 sm:p-8 lg:p-10 ${detailThemeExtras.innerBox} relative group`}>
                    {/* Nút Chỉnh sửa cho Quản trị viên */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={handleOpenEditSynopsis}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3.5 py-1.5 rounded-xl border border-purple-500/40 bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 hover:text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs z-10"
                        title="Chỉnh sửa giới thiệu truyện"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>
                    )}

                    <div className="space-y-4">
                      {novel.synopsis.split('\n\n').map((para, idx) => (
                        <p
                          key={idx}
                          className={`font-source-sans text-[16px] sm:text-[18px] leading-relaxed tracking-normal whitespace-pre-line ${
                            isDarkEffective ? 'text-stone-200' : 'text-stone-700'
                          }`}
                          style={{ lineHeight: '1.85' }}
                        >
                          {para.trim()}
                        </p>
                      ))}
                    </div>

                    {effectiveWorldLore && (
                      <div className={`mt-8 pt-6 border-t ${isDarkEffective ? 'border-white/10' : 'border-stone-200/80'}`}>
                        <h3 className={`text-[16px] sm:text-[18px] font-source-sans font-bold mb-2 ${isDarkEffective ? 'text-white' : 'text-stone-900'}`}>
                          Thiết lập nhân vật
                        </h3>
                        <p className={`font-source-sans text-[16px] sm:text-[18px] leading-relaxed whitespace-pre-line ${isDarkEffective ? 'text-stone-300' : 'text-stone-600'}`} style={{ lineHeight: '1.85' }}>
                          {effectiveWorldLore}
                        </p>
                      </div>
                    )}

                    {/* Tags thể loại (Đẩy xuống phần giới thiệu) */}
                    <div className={`mt-8 pt-6 border-t flex flex-wrap items-center gap-2 ${isDarkEffective ? 'border-white/10' : 'border-stone-200/80'}`}>
                      <span className={`text-xs font-semibold ${detailThemeExtras.posterSubTextColor}`}>Thể loại:</span>
                      {novel.genres.map((genre) => (
                        <span
                          key={genre}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors backdrop-blur-xs ${detailThemeExtras.posterTagClass}`}
                        >
                          {genre}
                        </span>
                      ))}

                      {/* Nút chỉnh sửa tags dành cho quản trị viên */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={handleOpenEditTags}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-purple-300 hover:text-white bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/40 hover:border-purple-400 transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Chỉnh sửa hoặc thêm bớt các tags / thể loại của truyện"
                        >
                          <Tag className="w-3.5 h-3.5 text-purple-400" />
                          <span>Chỉnh sửa tag</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Lời nhắn của người đăng (Thay thế mục Cập nhật mới nhất đã bỏ) */}
                {novel.uploaderNote && (
                  <div className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 sm:gap-4 transition-all ${
                    isJournalStyle
                      ? isDarkEffective
                        ? 'bg-zinc-850/90 border-zinc-700/80 text-zinc-100'
                        : 'bg-white border-[#E8DFD8] text-[#3D3A37] shadow-2xs'
                      : isNoteStyle
                      ? isDarkEffective
                        ? 'bg-[#1D1B16] border-amber-900/40 text-amber-100 shadow-2xs'
                        : 'bg-white border-amber-200 text-[#3C321E] shadow-2xs'
                      : isCinemaStyle
                      ? isDarkEffective
                        ? 'bg-[#18181B] border-neutral-700/80 text-neutral-100 shadow-2xs'
                        : 'bg-white border-[#E2DDD5] text-neutral-900 shadow-2xs'
                      : isCyberStyle
                      ? isDarkEffective
                        ? 'bg-[#09111C] border-cyan-500/40 text-cyan-100 shadow-2xs'
                        : 'bg-white border-cyan-600/30 text-[#092B38] shadow-2xs'
                      : isWaxSealStyle
                      ? isDarkEffective
                        ? 'bg-[#1C1613] border-[#4A3831] text-[#EDE0D4] shadow-2xs'
                        : 'bg-white border-[#DAC8B6] text-[#3A2A22] shadow-2xs'
                      : isEditorialStyle
                      ? isDarkEffective
                        ? 'bg-[#15161A] border-zinc-700 text-zinc-100'
                        : 'bg-white border-stone-300 text-stone-900 shadow-2xs'
                      : `${detailThemeExtras.posterNoteBox} font-source-sans`
                  }`}>
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isDarkEffective ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-700'
                    }`}>
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0 font-source-sans">
                      <div className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 font-source-sans ${detailThemeExtras.posterNoteTitle}`}>
                        Lời nhắn của người đăng
                      </div>
                      <p className={`text-sm sm:text-base leading-relaxed font-source-sans ${detailThemeExtras.posterNoteContent}`}>
                        {novel.uploaderNote}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Tab 2: Mục lục */}
            {activeTab === 'chapters' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Control bar: Chapter count, sort toggle, manual refresh */}
                <div className={`p-3 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 flex-wrap ${
                  isJournalStyle
                    ? isDarkEffective
                      ? 'bg-zinc-850/90 border-zinc-700/80 text-zinc-100'
                      : 'bg-white/90 border-[#E8DFD8] text-[#5A4552] shadow-2xs'
                    : isNoteStyle
                    ? isDarkEffective
                      ? 'bg-[#1D1B16] border-amber-900/40 text-amber-100'
                      : 'bg-[#FFFDF7] border-amber-200 text-[#3C321E] shadow-2xs'
                    : isCinemaStyle
                    ? isDarkEffective
                      ? 'bg-[#1C1C1F] border-neutral-700/80 text-neutral-100 font-mono'
                      : 'bg-[#FAF8F5] border-[#DED7CE] text-neutral-900 shadow-2xs font-mono'
                    : isCyberStyle
                    ? isDarkEffective
                      ? 'bg-[#09111C] border-cyan-500/40 text-cyan-100'
                      : 'bg-[#F2F9FB] border-cyan-600/30 text-[#092B38] shadow-2xs'
                    : isWaxSealStyle
                    ? isDarkEffective
                      ? 'bg-[#1C1613] border-[#4A3831] text-[#EDE0D4]'
                      : 'bg-[#FBF5ED] border-[#DAC8B6] text-[#3A2A22] shadow-2xs'
                    : isEditorialStyle
                    ? isDarkEffective
                      ? 'bg-[#15161A] border-zinc-700 text-zinc-100'
                      : 'bg-stone-50 border-stone-300 text-stone-900 shadow-2xs'
                    : detailThemeExtras.statBox
                }`}>
                  <div className="flex items-center gap-2">
                    {isJournalStyle && <BookOpen className="w-4 h-4 text-[#9E5D72] dark:text-pink-400" />}
                    {isNoteStyle && <StickyNote className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    {isCinemaStyle && <Film className="w-4 h-4 text-amber-500" />}
                    {isCyberStyle && <Cpu className="w-4 h-4 text-cyan-500" />}
                    {isWaxSealStyle && <Mail className="w-4 h-4 text-red-700 dark:text-red-400" />}
                    {isEditorialStyle && <Compass className="w-4 h-4 text-stone-900 dark:text-white" />}
                    <span className={`text-xs sm:text-sm font-bold ${
                      isEditorialStyle
                        ? 'font-mono uppercase text-stone-900 dark:text-white'
                        : isDarkEffective
                        ? 'text-white'
                        : 'text-stone-900'
                    }`}>
                      {isJournalStyle
                        ? `Mục lục / Tổng số: ${effectiveChapters.length} chương`
                        : isNoteStyle
                        ? `Sổ mục lục / Tổng số: ${effectiveChapters.length} chương`
                        : isCinemaStyle
                        ? `SCENES INDEX / TỔNG CỘNG: ${effectiveChapters.length} SCENES`
                        : isCyberStyle
                        ? `SECTORS INDEX / TOTAL: ${effectiveChapters.length} SECTORS`
                        : isWaxSealStyle
                        ? `Mục Lục Hồi Thư / Tổng số: ${effectiveChapters.length} hồi`
                        : isEditorialStyle
                        ? `TABLE OF CONTENTS · ${effectiveChapters.length} CHAPTERS`
                        : `Tổng số: ${effectiveChapters.length} chương`}
                    </span>
                    {isLoadingChapters && (
                      <span className="text-xs text-purple-400 flex items-center gap-1 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> Đang tải...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChapterSortAsc(!chapterSortAsc)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isJournalStyle
                          ? isDarkEffective
                            ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                            : 'border-[#E8DFD8] bg-white text-[#5A4552] hover:bg-[#FDF9F7] shadow-2xs'
                          : isNoteStyle
                          ? isDarkEffective
                            ? 'border-amber-900/50 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40'
                            : 'border-amber-200 bg-white text-amber-900 hover:bg-amber-50 shadow-2xs'
                          : isCinemaStyle
                          ? isDarkEffective
                            ? 'border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 font-mono text-xs'
                            : 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100 shadow-2xs font-mono text-xs'
                          : isCyberStyle
                          ? isDarkEffective
                            ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40 font-mono'
                            : 'border-cyan-300 bg-white text-cyan-900 hover:bg-cyan-50 shadow-2xs font-mono'
                          : isWaxSealStyle
                          ? isDarkEffective
                            ? 'border-[#523F36] bg-[#221A16] text-[#EDE0D4] hover:bg-[#2E231E] font-serif'
                            : 'border-[#DAC8B6] bg-white text-[#3A2A22] hover:bg-[#FBF5ED] shadow-2xs font-serif'
                          : isEditorialStyle
                          ? isDarkEffective
                            ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 font-mono text-[11px]'
                            : 'border-stone-300 bg-white text-stone-900 hover:bg-stone-100 shadow-2xs font-mono text-[11px]'
                          : isDarkEffective
                          ? 'border-white/15 bg-white/5 text-stone-200 hover:bg-white/10'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100 shadow-xs'
                      }`}
                      title="Đảo thứ tự sắp xếp chương"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span>{chapterSortAsc ? 'Cũ nhất trước' : 'Mới nhất trước'}</span>
                    </button>
                  </div>
                </div>

                {/* Chapters Grid / Empty state */}
                {displayedChapters.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-purple-500/30 bg-purple-500/5 space-y-3">
                    <p className="text-[16px] text-stone-300">
                      {isLoadingChapters ? 'Đang tải danh sách chương...' : 'Bộ truyện hiện chưa có chương nào.'}
                    </p>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setIsTxtSplitterOpen(true)}
                        className="px-4 py-2 rounded-xl text-[14px] font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md inline-flex items-center gap-2 cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload File .txt Tách & Đăng Chương Ngay</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayedChapters.map((chap) => {
                    return (
                      <div
                        key={chap.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all text-left flex items-center justify-between gap-2.5 ${
                          isJournalStyle
                            ? isDarkEffective
                              ? 'bg-[#15161C] border-zinc-700/80 hover:border-zinc-600 shadow-xs'
                              : 'bg-[#FFFDF9] border-[#EAE3DC] hover:border-[#9E5D72]/60 hover:shadow-md text-[#3D3A37] shadow-2xs'
                            : isNoteStyle
                            ? isDarkEffective
                              ? 'bg-[#1D1B16] border-amber-900/40 hover:border-amber-700 text-amber-100 shadow-xs'
                              : 'bg-[#FFFDF7] border-amber-200/90 hover:border-amber-400 text-[#3C321E] shadow-2xs'
                            : isCinemaStyle
                            ? isDarkEffective
                              ? 'bg-[#18181A] border-[#2E2E32] hover:border-neutral-500 text-neutral-100 shadow-xs font-mono'
                              : 'bg-[#FAF9F5] border-[#E2DDD5] hover:border-neutral-800 text-neutral-900 shadow-2xs font-mono'
                            : isCyberStyle
                            ? isDarkEffective
                              ? 'bg-[#09111C] border-cyan-500/40 hover:border-cyan-400 text-cyan-100 shadow-xs font-mono'
                              : 'bg-[#F2F9FB] border-cyan-600/30 hover:border-cyan-500 text-[#092B38] shadow-2xs font-mono'
                            : isWaxSealStyle
                            ? isDarkEffective
                              ? 'bg-[#1C1613] border-[#4A3831] hover:border-amber-600 text-[#EDE0D4] shadow-xs font-serif'
                              : 'bg-[#FBF5ED] border-[#DAC8B6] hover:border-red-600 text-[#3A2A22] shadow-2xs font-serif'
                            : isEditorialStyle
                            ? isDarkEffective
                              ? 'bg-[#15161A] border-zinc-700/80 hover:border-white text-zinc-100 shadow-xs'
                              : 'bg-white border-stone-300 hover:border-stone-900 text-stone-900 shadow-2xs'
                            : tStyles.sideCardItem
                        }`}
                      >
                        <div
                          onClick={() => {
                            onReadChapter(chap.chapterNumber);
                          }}
                          className="space-y-1 min-w-0 flex-1 cursor-pointer group flex items-start gap-2.5"
                        >
                          {/* Dấu chấm đồng bộ với thiết kế */}
                          {isJournalStyle && (
                            <span className="w-2 h-2 rounded-full bg-[#9E5D72]/50 dark:bg-pink-400/50 border border-[#9E5D72]/60 dark:border-pink-400/60 shrink-0 mt-1.5 shadow-inner" />
                          )}
                          {isNoteStyle && (
                            <span className="text-xs text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 select-none">📌</span>
                          )}
                          {isCinemaStyle && (
                            <span className="text-xs text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5 select-none font-mono">🎬</span>
                          )}
                          {isCyberStyle && (
                            <span className="text-xs text-cyan-400 shrink-0 mt-0.5 select-none font-mono">&gt;</span>
                          )}
                          {isWaxSealStyle && (
                            <span className="text-xs text-red-700 dark:text-red-400 shrink-0 mt-0.5 select-none">📜</span>
                          )}
                          {isEditorialStyle && (
                            <span className="text-xs text-stone-400 dark:text-stone-500 shrink-0 mt-0.5 select-none font-mono">▸</span>
                          )}
                          <div className="min-w-0 flex-1">
                            {(() => {
                              const { chapterLabel, isExtra, restTitle } = getChapterDisplayParts(chap);
                              return (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`text-[14px] sm:text-[16px] md:text-[17px] font-bold shrink-0 transition-colors ${
                                      isJournalStyle
                                        ? 'font-sans text-stone-900 dark:text-zinc-100 group-hover:text-[#9E5D72] dark:group-hover:text-pink-300'
                                        : isNoteStyle
                                        ? 'font-sans text-[#3C321E] dark:text-amber-100 group-hover:text-amber-600 dark:group-hover:text-amber-300'
                                        : isCinemaStyle
                                        ? 'font-mono text-neutral-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400'
                                        : isCyberStyle
                                        ? 'font-mono text-cyan-900 dark:text-cyan-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-300'
                                        : isWaxSealStyle
                                        ? 'font-serif text-[#3A2A22] dark:text-[#F3E7DC] group-hover:text-red-700 dark:group-hover:text-red-400'
                                        : isEditorialStyle
                                        ? 'font-mono text-stone-900 dark:text-white group-hover:underline'
                                        : `${tStyles.cardTitle} ${tStyles.cardTitleHover} font-sans`
                                    }`}
                                  >
                                    {chapterLabel}
                                  </span>
                                  {isExtra && (
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold border shrink-0 transition-colors ${
                                        isJournalStyle
                                          ? isDarkEffective
                                            ? 'bg-purple-950/50 text-purple-300 border-purple-800/60 font-sans'
                                            : 'bg-[#F6EEF7] text-[#6B3F78] border-[#E6D4EC] font-sans'
                                          : isNoteStyle
                                          ? 'bg-amber-500/15 border-amber-400/40 text-amber-800 dark:text-amber-300 font-sans'
                                          : isCinemaStyle
                                          ? 'bg-neutral-800 text-neutral-200 border-neutral-700 font-mono text-[10px]'
                                          : isCyberStyle
                                          ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-800 dark:text-cyan-300 font-mono'
                                          : isWaxSealStyle
                                          ? 'bg-red-800/15 border-red-700/40 text-red-900 dark:text-red-300 font-serif'
                                          : isEditorialStyle
                                          ? 'bg-stone-200 dark:bg-zinc-800 border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 font-mono text-[10px]'
                                          : getExtraChapterBadgeStyle(theme, isDarkEffective)
                                      }`}
                                    >
                                      Ngoại truyện
                                    </span>
                                  )}
                                  {restTitle && (
                                    <span
                                      className={`text-[14px] sm:text-[16px] md:text-[17px] font-medium truncate transition-colors ${
                                        isJournalStyle
                                          ? 'font-sans text-stone-700 dark:text-zinc-300 group-hover:text-[#9E5D72] dark:group-hover:text-pink-300'
                                        : isNoteStyle
                                        ? 'font-sans text-[#524430] dark:text-amber-200/90 group-hover:text-amber-600 dark:group-hover:text-amber-300'
                                        : isCinemaStyle
                                        ? 'font-mono text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
                                        : isCyberStyle
                                        ? 'font-mono text-cyan-800/90 dark:text-cyan-200/90 group-hover:text-cyan-500 dark:group-hover:text-cyan-300'
                                        : isWaxSealStyle
                                        ? 'font-serif text-[#4A382E] dark:text-[#E0D2C4] group-hover:text-red-700 dark:group-hover:text-red-300'
                                        : isEditorialStyle
                                        ? 'font-sans text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white'
                                        : `${tStyles.cardTitle} ${tStyles.cardTitleHover} font-sans`
                                      }`}
                                    >
                                      {restTitle}
                                    </span>
                                  )}
                                </div>
                              );
                            })()}
                            {chap.publishedAt && (
                              <div
                                className={`flex items-center gap-2.5 text-[12px] sm:text-[13px] font-mono mt-0.5 ${
                                  isJournalStyle
                                    ? 'text-stone-500 dark:text-zinc-400'
                                    : isNoteStyle
                                    ? 'text-amber-700/80 dark:text-amber-400/80 font-mono text-[11px]'
                                    : isCinemaStyle
                                    ? 'text-neutral-500 dark:text-neutral-400 font-mono text-[11px]'
                                    : isCyberStyle
                                    ? 'text-cyan-700/80 dark:text-cyan-400/80 font-mono text-[11px]'
                                    : isWaxSealStyle
                                    ? 'text-[#6C5043]/80 dark:text-[#D4C4B4]/80 font-serif text-[11px]'
                                    : isEditorialStyle
                                    ? 'text-stone-400 dark:text-stone-500 font-mono text-[11px]'
                                    : tStyles.cardAuthor
                                }`}
                              >
                                <span>{chap.publishedAt}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action button: Đọc */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => onReadChapter(chap.chapterNumber)}
                            className={`px-3.5 py-1.5 rounded-xl text-[14px] font-bold cursor-pointer transition-all ${
                              isJournalStyle
                                ? 'bg-[#9E5D72] hover:bg-[#8B4D61] text-white shadow-2xs hover:shadow-xs font-sans'
                                : isNoteStyle
                                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-2xs hover:shadow-xs font-sans'
                                : isCinemaStyle
                                ? 'bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 shadow-2xs hover:shadow-xs font-mono text-xs uppercase'
                                : isCyberStyle
                                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-2xs hover:shadow-xs font-mono'
                                : isWaxSealStyle
                                ? 'bg-red-800 hover:bg-red-700 text-amber-100 shadow-2xs hover:shadow-xs font-serif'
                                : isEditorialStyle
                                ? 'bg-stone-900 hover:bg-black dark:bg-white dark:hover:bg-stone-200 text-white dark:text-black font-mono text-xs uppercase'
                                : tStyles.cardChapterBtn
                            }`}
                            title="Đọc chương này"
                          >
                            Đọc
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                )}

                {/* Dãy số trang chọn nếu có hơn 20 chương */}
                {totalChapterPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4 pb-2">
                    {/* Previous Page ‹ */}
                    <button
                      onClick={() => {
                        setChapterPage((p) => Math.max(1, p - 1));
                      }}
                      disabled={chapterPage === 1}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border flex items-center justify-center text-xs sm:text-[13px] font-semibold transition-all cursor-pointer select-none ${
                        isJournalStyle
                          ? isDarkEffective
                            ? 'bg-zinc-850 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                            : 'bg-white text-[#5A4552] border-[#E8DFD8] hover:bg-[#FDF9F7] shadow-2xs'
                          : isNoteStyle
                          ? isDarkEffective
                            ? 'bg-amber-950/40 text-amber-300 border-amber-900/50 hover:bg-amber-900/50'
                            : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50 shadow-2xs'
                          : isCinemaStyle
                          ? isDarkEffective
                            ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 font-mono'
                            : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-100 shadow-2xs font-mono'
                          : isCyberStyle
                          ? isDarkEffective
                            ? 'bg-cyan-950/40 text-cyan-300 border-cyan-900/50 hover:bg-cyan-900/50 font-mono'
                            : 'bg-white text-cyan-900 border-cyan-300 hover:bg-cyan-50 shadow-2xs font-mono'
                          : isWaxSealStyle
                          ? isDarkEffective
                            ? 'bg-[#221A16] text-[#EDE0D4] border-[#523F36] hover:bg-[#2C211C] font-serif'
                            : 'bg-white text-[#3A2A22] border-[#DAC8B6] hover:bg-[#FBF5ED] shadow-2xs font-serif'
                          : isEditorialStyle
                          ? isDarkEffective
                            ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100 shadow-2xs'
                          : paginationStyles.arrow
                      } ${chapterPage === 1 ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}`}
                      title="Trang trước"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalChapterPages }, (_, i) => i + 1).map((pageNum) => {
                      const isActive = pageNum === chapterPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setChapterPage(pageNum);
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border flex items-center justify-center text-xs sm:text-[13px] transition-all cursor-pointer select-none ${
                            isActive
                              ? isJournalStyle
                                ? 'bg-[#9E5D72] text-white border-[#9E5D72] shadow-2xs font-bold'
                                : isNoteStyle
                                ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-2xs'
                                : isCinemaStyle
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white font-bold shadow-2xs font-mono'
                                : isCyberStyle
                                ? 'bg-cyan-600 text-white border-cyan-600 font-bold shadow-2xs font-mono'
                                : isWaxSealStyle
                                ? 'bg-red-800 text-amber-100 border-red-800 font-bold shadow-2xs font-serif'
                                : isEditorialStyle
                                ? 'bg-stone-900 dark:bg-white text-white dark:text-black border-stone-900 dark:border-white font-mono font-bold shadow-2xs'
                                : `${paginationStyles.active} font-bold`
                              : isJournalStyle
                              ? isDarkEffective
                                ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500 font-medium'
                                : 'bg-white text-[#5A4552] border-[#E8DFD8] hover:border-[#9E5D72] shadow-2xs font-medium'
                              : isNoteStyle
                              ? isDarkEffective
                                ? 'bg-amber-950/20 text-amber-300 border-amber-900/40 hover:border-amber-600 font-sans'
                                : 'bg-white text-amber-900 border-amber-200 hover:border-amber-500 font-sans shadow-2xs'
                              : isCinemaStyle
                              ? isDarkEffective
                                ? 'bg-neutral-900/60 text-neutral-300 border-neutral-700 hover:border-neutral-500 font-mono'
                                : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-500 font-mono shadow-2xs'
                              : isCyberStyle
                              ? isDarkEffective
                                ? 'bg-cyan-950/20 text-cyan-300 border-cyan-900/40 hover:border-cyan-600 font-mono'
                                : 'bg-white text-cyan-900 border-cyan-300 hover:border-cyan-500 font-mono shadow-2xs'
                              : isWaxSealStyle
                              ? isDarkEffective
                                ? 'bg-[#221A16] text-[#EDE0D4] border-[#523F36] hover:border-amber-600 font-serif'
                                : 'bg-white text-[#3A2A22] border-[#DAC8B6] hover:border-red-600 font-serif shadow-2xs'
                              : isEditorialStyle
                              ? isDarkEffective
                                ? 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 font-mono'
                                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900 font-mono shadow-2xs'
                              : `${paginationStyles.inactive} font-medium`
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Page › */}
                    <button
                      onClick={() => {
                        setChapterPage((p) => Math.min(totalChapterPages, p + 1));
                      }}
                      disabled={chapterPage === totalChapterPages}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border flex items-center justify-center text-xs sm:text-[13px] font-semibold transition-all cursor-pointer select-none ${
                        isJournalStyle
                          ? isDarkEffective
                            ? 'bg-zinc-850 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                            : 'bg-white text-[#5A4552] border-[#E8DFD8] hover:bg-[#FDF9F7] shadow-2xs'
                          : isNoteStyle
                          ? isDarkEffective
                            ? 'bg-amber-950/40 text-amber-300 border-amber-900/50 hover:bg-amber-900/50'
                            : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50 shadow-2xs'
                          : isCinemaStyle
                          ? isDarkEffective
                            ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 font-mono'
                            : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-100 shadow-2xs font-mono'
                          : isCyberStyle
                          ? isDarkEffective
                            ? 'bg-cyan-950/40 text-cyan-300 border-cyan-900/50 hover:bg-cyan-900/50 font-mono'
                            : 'bg-white text-cyan-900 border-cyan-300 hover:bg-cyan-50 shadow-2xs font-mono'
                          : isWaxSealStyle
                          ? isDarkEffective
                            ? 'bg-[#221A16] text-[#EDE0D4] border-[#523F36] hover:bg-[#2C211C] font-serif'
                            : 'bg-white text-[#3A2A22] border-[#DAC8B6] hover:bg-[#FBF5ED] shadow-2xs font-serif'
                          : isEditorialStyle
                          ? isDarkEffective
                            ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100 shadow-2xs'
                          : paginationStyles.arrow
                      } ${chapterPage === totalChapterPages ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}`}
                      title="Trang tiếp theo"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Tab 3: Bình luận */}
            {activeTab === 'comments' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-4xl mx-auto"
              >
                {/* Submit Comment Form */}
                <form
                  onSubmit={handlePostComment}
                  className={`p-6 sm:p-7 rounded-3xl border shadow-xs space-y-4 ${
                    isJournalStyle
                      ? isDarkEffective
                        ? 'bg-[#15161C] border-zinc-700/80 text-zinc-100'
                        : 'bg-white border-[#E8DFD8] text-[#3D3A37] shadow-xs'
                      : isNoteStyle
                      ? isDarkEffective
                        ? 'bg-[#1D1B16] border-amber-900/50 text-amber-100'
                        : 'bg-[#FFFDF7] border-amber-200 text-[#3C321E] shadow-xs'
                      : isCinemaStyle
                      ? isDarkEffective
                        ? 'bg-[#18181B] border-neutral-700/80 text-neutral-100'
                        : 'bg-[#FAF9F5] border-[#E2DDD5] text-neutral-900 shadow-xs'
                      : isCyberStyle
                      ? isDarkEffective
                        ? 'bg-[#09111C] border-cyan-500/40 text-cyan-100'
                        : 'bg-[#F2F9FB] border-cyan-600/30 text-[#092B38] shadow-xs'
                      : isWaxSealStyle
                      ? isDarkEffective
                        ? 'bg-[#1C1613] border-[#4A3831] text-[#EDE0D4]'
                        : 'bg-[#FBF5ED] border-[#DAC8B6] text-[#3A2A22] shadow-xs'
                      : isEditorialStyle
                      ? isDarkEffective
                        ? 'bg-[#15161A] border-zinc-700 text-zinc-100'
                        : 'bg-white border-stone-300 text-stone-900 shadow-xs'
                      : detailThemeExtras.innerBox
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[14px] font-bold uppercase tracking-wider ${
                      isNoteStyle
                        ? 'font-sans text-amber-800 dark:text-amber-300'
                        : isCinemaStyle
                        ? 'font-mono text-neutral-900 dark:text-neutral-100'
                        : isCyberStyle
                        ? 'font-mono text-cyan-700 dark:text-cyan-300'
                        : isWaxSealStyle
                        ? 'font-serif text-[#523F36] dark:text-[#E0D2C4]'
                        : isEditorialStyle
                        ? 'font-mono text-stone-900 dark:text-white'
                        : isDarkEffective
                        ? 'text-white'
                        : 'text-stone-900'
                    }`}>
                      {isJournalStyle
                        ? 'Ghi chép bình luận · 评论'
                        : isNoteStyle
                        ? 'Ghi chép bình luận độc giả · 读者留言'
                        : isCinemaStyle
                        ? 'Khán giả & Giới phê bình điện ảnh · AUDIENCE REVIEWS'
                        : isCyberStyle
                        ? 'NET://USER_DATA_FEEDBACK_STREAM'
                        : isWaxSealStyle
                        ? 'Thư Tín & Cảm Tác Của Bạn Đọc'
                        : isEditorialStyle
                        ? 'LETTERS FROM READERS & CRITIQUE · THƯ BẠN ĐỌC'
                        : 'Bình Luận Về Bộ Truyện'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Tên của bạn"
                      className={`px-4 py-2.5 rounded-xl text-[14px] sm:text-[16px] font-sans focus:outline-hidden ${tStyles.input}`}
                    />
                  </div>

                  <textarea
                    rows={3}
                    required
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Chia sẻ cảm nhận, bình luận về tình tiết truyện..."
                    className={`w-full px-4 py-3 rounded-2xl text-[14px] sm:text-[16px] font-sans focus:outline-hidden resize-none ${tStyles.input}`}
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className={`px-5 py-2.5 rounded-full text-[14px] sm:text-[16px] font-bold cursor-pointer shadow-sm flex items-center gap-2 ${
                        isJournalStyle
                          ? 'bg-[#9E5D72] hover:bg-[#8B4D61] text-white shadow-xs font-sans'
                          : isNoteStyle
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs font-sans'
                          : isCinemaStyle
                          ? 'bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 shadow-xs font-mono text-xs uppercase'
                          : isCyberStyle
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs font-mono'
                          : isWaxSealStyle
                          ? 'bg-red-800 hover:bg-red-700 text-amber-100 shadow-xs font-serif'
                          : isEditorialStyle
                          ? 'bg-stone-900 hover:bg-black dark:bg-white dark:text-black text-white font-mono uppercase text-xs'
                          : detailThemeExtras.primaryBtn
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>{isWaxSealStyle ? 'Đóng Dấu Gửi Thư' : isCyberStyle ? 'TRANSMIT_LOG' : isCinemaStyle ? 'SUBMIT REVIEW' : 'Gửi Bình Luận'}</span>
                    </button>
                  </div>
                </form>

                {/* Comment List */}
                <div className="space-y-3.5">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-5 rounded-2xl border space-y-3 ${
                        isJournalStyle
                          ? isDarkEffective
                            ? 'bg-[#15161C]/90 border-zinc-700/70 text-zinc-200'
                            : 'bg-white border-[#E8DFD8] text-stone-800 shadow-2xs'
                          : isNoteStyle
                          ? isDarkEffective
                            ? 'bg-[#1D1B16]/95 border-amber-900/40 text-amber-100'
                            : 'bg-[#FFFDF7] border-amber-200 text-[#3C321E] shadow-2xs'
                          : isCinemaStyle
                          ? isDarkEffective
                            ? 'bg-[#18181B]/95 border-neutral-700/60 text-neutral-100 font-sans'
                            : 'bg-[#FAF9F5] border-[#E2DDD5] text-neutral-900 shadow-2xs font-sans'
                          : isCyberStyle
                          ? isDarkEffective
                            ? 'bg-[#09111C]/95 border-cyan-500/40 text-cyan-100 font-mono'
                            : 'bg-[#F2F9FB] border-cyan-600/30 text-[#092B38] shadow-2xs font-mono'
                          : isWaxSealStyle
                          ? isDarkEffective
                            ? 'bg-[#1C1613]/95 border-[#4A3831] text-[#EDE0D4] font-serif'
                            : 'bg-[#FBF5ED] border-[#DAC8B6] text-[#3A2A22] shadow-2xs font-serif'
                          : isEditorialStyle
                          ? isDarkEffective
                            ? 'bg-[#15161A] border-zinc-800 text-zinc-200'
                            : 'bg-white border-stone-300 text-stone-900 shadow-2xs'
                          : tStyles.card
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {comment.avatar && (comment.avatar.startsWith('http://') || comment.avatar.startsWith('https://')) ? (
                            <img
                              src={comment.avatar}
                              alt={comment.author}
                              className={`w-10 h-10 rounded-full border object-cover shrink-0 ${tStyles.cardCoverBorder}`}
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-[16px] select-none shadow-xs text-white ${getAvatarBgColor(
                                comment.author
                              )}`}
                              title={comment.author}
                            >
                              {(comment.author?.trim().charAt(0) || 'Đ').toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[14px] sm:text-[16px] font-sans font-bold truncate ${tStyles.cardTitle}`}>{comment.author}</span>
                              {typeof comment.chapterNumber === 'number' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                                  Chương {comment.chapterNumber}
                                </span>
                              )}
                            </div>
                            <span className={`text-[13px] sm:text-[14px] font-sans ${tStyles.cardAuthor}`}>{normalizeCommentDate(comment.createdAt)}</span>
                          </div>
                        </div>

                        {/* Nút xóa bình luận */}
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteComment(comment)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[14px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer shrink-0"
                          title="Xóa bình luận này"
                          aria-label="Xóa bình luận"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Xóa</span>
                        </button>
                      </div>

                      <p className={`text-[14px] sm:text-[16px] font-sans leading-relaxed ${isDarkEffective ? 'text-stone-200' : 'text-stone-700'}`} style={{ lineHeight: '1.75' }}>
                        {comment.content}
                      </p>

                      <div className="flex items-center gap-4 pt-1">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-2 text-[14px] sm:text-[15px] font-sans font-bold transition-colors cursor-pointer ${tStyles.cardAuthor} ${tStyles.heroTitleHover}`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{comment.likes} Thích</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab 4: Author & Related Novels */}
            {activeTab === 'author' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Author Extended Profile */}
                <div className={`p-8 rounded-3xl border flex flex-col sm:flex-row items-center gap-6 ${tStyles.card}`}>
                  <img
                    src={novel.author.avatar}
                    alt={novel.author.name}
                    className={`w-24 h-24 rounded-2xl border-2 object-cover shadow-lg ${tStyles.cardCoverBorder}`}
                  />
                  <div className="text-center sm:text-left space-y-2">
                    <h3 className={`text-xl font-bold font-serif ${tStyles.heroTitle}`}>{novel.author.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border ${tStyles.heroBadge1}`}>
                      {novel.author.title}
                    </span>
                    <p className={`text-xs max-w-xl ${tStyles.heroSynopsis}`}>
                      Tác giả gạo cội với hơn {novel.author.totalNovels} tác phẩm được đông đảo độc giả đánh giá cao trên toàn hệ thống.
                    </p>
                  </div>
                </div>

                {/* Related Novels Grid */}
                <div className="space-y-4">
                  <h3 className={`text-base font-bold flex items-center gap-2 font-serif ${tStyles.cardTitle}`}>
                    <Sparkles className={`w-4 h-4 ${tStyles.sectionIcon}`} />
                    <span>Tiểu Thuyết Cùng Thể Loại</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedNovels.map((rn) => (
                      <div
                        key={rn.id}
                        onClick={() => {
                          onSelectNovel(rn);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 group ${tStyles.card}`}
                      >
                        <img
                          src={getDirectImageUrl(rn.coverImage, rn.id || rn.title)}
                          onError={(e) => handleCoverImageError(e, rn.id || rn.title)}
                          alt={rn.title}
                          className={`w-16 h-22 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform border ${tStyles.cardCoverBorder}`}
                        />
                        <div className="space-y-1">
                          <h4 className={`text-xs line-clamp-2 transition-colors font-novel-title ${tStyles.cardTitle} ${tStyles.cardTitleHover}`}>
                            {rn.title}
                          </h4>
                          <span className={`text-[11px] block ${tStyles.cardAuthor}`}>{rn.author.name}</span>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-yellow-500">
                            <Star className="w-3 h-3 fill-yellow-500" />
                            <span>{rn.rating}</span>
                            <span className={tStyles.cardAuthor}>• {rn.chapters.length} chương</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      )}

      </main>

      {/* Add Chapter Modal */}
      <AnimatePresence>
        {showAddChapterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPublishingChapter && setShowAddChapterModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-2xl border rounded-3xl p-6 shadow-2xl z-10 space-y-4 ${tStyles.card}`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${tStyles.cardFooterBorder}`}>
                <span className={`text-xs font-mono font-bold ${tStyles.badgeText}`}>
                  ĐĂNG CHƯƠNG MỚI THỦ CÔNG CHO BỘ TRUYỆN
                </span>
                <button
                  type="button"
                  disabled={isPublishingChapter}
                  onClick={() => setShowAddChapterModal(false)}
                  className={`text-xs cursor-pointer ${tStyles.cardAuthor}`}
                >
                  Hủy
                </button>
              </div>

              <form onSubmit={handleCreateChapter} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={`block text-xs font-mono mb-1 ${tStyles.cardAuthor}`}>
                      Số thứ tự chương *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newChapNumber}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setNewChapNumber(val);
                        if (!newChapTitle || newChapTitle.startsWith('Chương ')) {
                          setNewChapTitle(`Chương ${val}: `);
                        }
                      }}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-hidden ${tStyles.input}`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={`block text-xs font-mono mb-1 ${tStyles.cardAuthor}`}>
                      Tiêu Đề Chương *
                    </label>
                    <input
                      type="text"
                      required
                      value={newChapTitle}
                      onChange={(e) => setNewChapTitle(e.target.value)}
                      placeholder="VD: Chương 68: Ngày mới bắt đầu"
                      className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-hidden ${tStyles.input}`}
                    />
                  </div>
                </div>

                {/* Đánh dấu ngoại truyện */}
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                  isDarkEffective ? 'bg-white/[0.04] border-white/10' : 'bg-stone-50 border-stone-200'
                }`}>
                  <input
                    type="checkbox"
                    id="newIsExtraCheckbox"
                    checked={newChapIsExtra}
                    onChange={(e) => setNewChapIsExtra(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                  <label htmlFor="newIsExtraCheckbox" className="text-xs sm:text-sm font-medium cursor-pointer select-none">
                    Đánh dấu đây là <strong className="text-purple-400">Ngoại truyện</strong> (thay vì Chính văn)
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`text-xs font-mono ${tStyles.cardAuthor}`}>
                      Nội Dung Chương *
                    </label>
                    <span className="text-[11px] text-stone-400 font-mono">
                      ~{newChapContent.trim() ? newChapContent.trim().split(/\s+/).filter(Boolean).length.toLocaleString('vi-VN') : 0} từ
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    required
                    value={newChapContent}
                    onChange={(e) => setNewChapContent(e.target.value)}
                    placeholder="Nhập hoặc dán nội dung chi tiết chương mới..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm placeholder-slate-400 focus:outline-hidden font-mono resize-y ${tStyles.input}`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    disabled={isPublishingChapter}
                    onClick={() => setShowAddChapterModal(false)}
                    className={`px-4 py-2 rounded-xl text-xs cursor-pointer ${tStyles.buttonNeutral}`}
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={isPublishingChapter}
                    className={`px-5 py-2 rounded-full text-xs font-bold cursor-pointer shadow-md flex items-center gap-1.5 ${tStyles.buttonPrimary} ${isPublishingChapter ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {isPublishingChapter ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang lưu lên hệ thống...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Xuất Bản Chương</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Txt Import Modal (Tải tệp TXT tự động chia chương & ngoại truyện) */}
      <TxtImportModal
        isOpen={isTxtModalOpen}
        onClose={() => setIsTxtModalOpen(false)}
        novelTitle={novel.title}
        onApplyChapters={handleApplyTxtChapters}
        existingChaptersCount={novel.chapters.length}
      />

      {/* Cover Image Customization Modal */}
      <AnimatePresence>
        {isCoverModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCoverModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-[#0f111a] border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl z-10 my-6 overflow-hidden text-slate-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Thay Đổi Ảnh Bìa</h3>
                    <p className="text-xs text-slate-400">Chọn ảnh từ máy tính hoặc áp dụng mẫu ảnh bìa có sẵn</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCoverModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="mt-5 space-y-5">
                {/* 1. Official Novel Cover (User provided Drive link) */}
                <div>
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                    1. Ảnh bìa chính thức của tác phẩm (Link Google Drive)
                  </label>
                  <div
                    onClick={() => setPendingCoverUrl(novel.coverImage)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 group ${
                      (pendingCoverUrl || activeCoverImage) === novel.coverImage
                        ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30'
                        : 'border-white/10 bg-white/5 hover:border-purple-400/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-14 h-18 rounded-xl overflow-hidden border border-white/20 shrink-0">
                      <img
                        src={getDirectImageUrl(novel.coverImage)}
                        onError={handleCoverImageError}
                        alt="Bìa chính thức"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white truncate">Ảnh bìa chuẩn của truyện</p>
                        {(pendingCoverUrl || activeCoverImage) === novel.coverImage && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3 text-emerald-400" />
                            Đang chọn
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-200 mt-0.5 truncate font-mono">
                        {novel.coverImage}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Ảnh gốc từ Google Drive cung cấp bởi tác giả/người đăng.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Custom URL Input */}
                <div>
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                    2. Hoặc dán liên kết ảnh mới (URL)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="url"
                        placeholder="Dán link ảnh (Google Drive, Imgur, v.v.)..."
                        value={inputCustomUrl}
                        onChange={(e) => setInputCustomUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (inputCustomUrl.trim()) {
                          setPendingCoverUrl(inputCustomUrl.trim());
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shrink-0 cursor-pointer"
                    >
                      Áp dụng link
                    </button>
                  </div>
                </div>

                {/* 3. Upload from device */}
                <div>
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                    3. Hoặc tải tệp ảnh từ thiết bị (Lưu trực tiếp vào Firebase)
                  </label>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => {
                      if (!isUploadingToFirebase) {
                        coverInputRef.current?.click();
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                      isUploadingToFirebase
                        ? 'border-emerald-500/60 bg-emerald-500/10 cursor-wait'
                        : 'border-purple-500/40 hover:border-purple-400/80 bg-purple-500/5 hover:bg-purple-500/10'
                    }`}
                  >
                    {isUploadingToFirebase ? (
                      <div className="flex flex-col items-center justify-center py-2">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                        <p className="text-sm font-bold text-emerald-300">Đang lưu ảnh bìa trực tiếp vào Firebase Cloud...</p>
                        <p className="text-xs text-emerald-400/80 mt-1">Hệ thống đang đồng bộ dữ liệu ảnh bìa với máy chủ đám mây.</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-7 h-7 text-purple-400 mx-auto mb-1.5" />
                        <p className="text-sm font-bold text-white">Bấm để tải tệp ảnh từ máy của bạn</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Tự động nén tối ưu và lưu vĩnh viễn trực tiếp vào cơ sở dữ liệu Firebase Cloud.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Preview selection note */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={getDirectImageUrl(pendingCoverUrl || activeCoverImage, novel.id || novel.title)}
                      onError={handleCoverImageError}
                      alt="Xem trước bìa"
                      className="w-9 h-12 rounded-md object-cover border border-white/20 shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate flex items-center gap-1.5">
                        <span>Ảnh bìa được chọn</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                          Firebase Sync
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {pendingCoverUrl?.startsWith('data:') ? 'Ảnh mới từ thiết bị' : 'Đường dẫn ảnh bìa'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const orig = getOriginalCoverByNovel(novel.id, novel.title) || novel.coverImage;
                      setPendingCoverUrl(orig);
                    }}
                    className="text-xs text-purple-300 hover:text-white underline cursor-pointer shrink-0"
                  >
                    Bìa gốc
                  </button>
                </div>

                {/* Footer action: cancel, reset, save */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      const orig = getOriginalCoverByNovel(novel.id, novel.title) || novel.coverImage;
                      setPendingCoverUrl(orig);
                    }}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Khôi phục ảnh bìa gốc
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCoverModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      disabled={isUploadingToFirebase}
                      onClick={handleConfirmSaveCoverModal}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-600/30 hover:scale-[1.02] active:scale-98"
                    >
                      {isUploadingToFirebase ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>{isUploadingToFirebase ? 'Đang lưu Firebase...' : 'Lưu vào Firebase'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CHỈNH SỬA TAGS / THỂ LOẠI TRUYỆN */}
      <AnimatePresence>
        {isEditTagsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditTagsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl z-10 my-6 overflow-hidden border border-purple-500/30 bg-[#161226] text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Chỉnh sửa Tags / Thể Loại</h3>
                    <p className="text-xs text-purple-200/70">Thêm, xóa hoặc chọn thể loại cho truyện "{novel.title}" (Lưu trực tiếp vào Firebase)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditTagsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mt-4 space-y-5">
                {/* 1. Danh sách tags hiện tại */}
                <div>
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                    Các Tags hiện có ({editingGenresList.length})
                  </label>
                  {editingGenresList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">Chưa có tag nào. Vui lòng thêm ít nhất 1 tag.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 min-h-[50px] items-center">
                      {editingGenresList.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/25 text-purple-200 border border-purple-400/40 shadow-xs group"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="w-4 h-4 rounded-full hover:bg-rose-500/40 hover:text-rose-200 flex items-center justify-center transition-colors cursor-pointer text-slate-300 ml-0.5"
                            title={`Xóa tag ${tag}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Thêm tag tùy chỉnh mới */}
                <div>
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                    Thêm Tag mới
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập tên tag mới (vd: Đam Mỹ, Ngọt Sủng, Cưới Trước Yêu Sau)..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag()}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                    >
                      Thêm Tag
                    </button>
                  </div>
                </div>

                {/* 3. Gợi ý các tag phổ biến để chọn nhanh */}
                <div>
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                    Gợi ý tags phổ biến (bấm để thêm nhanh)
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {[
                      'Đam Mỹ',
                      'Hiện Đại',
                      'Cổ Đại',
                      'Vừa Ngược Vừa Ngọt',
                      'Ngọt Sủng',
                      'Bao Nuôi',
                      'Cưới Trước Yêu Sau',
                      'Niên Thượng',
                      'Niên Hạ',
                      '1v1',
                      'HE',
                      'OE',
                      'BE',
                      'Trọng Sinh',
                      'Xuyên Nhanh',
                      'Xuyên Không',
                      'Giới Giải Trí',
                      'Hào Môn Thế Gia',
                      'Chủ Công',
                      'Chủ Thụ',
                      'Vườn Trường',
                      'ABO',
                      'Vô Hạn Lưu',
                      'Hài Hước',
                      'Điền Văn',
                    ].map((sug) => {
                      const isSelected = editingGenresList.includes(sug);
                      return (
                        <button
                          key={sug}
                          type="button"
                          disabled={isSelected}
                          onClick={() => handleAddTag(sug)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed opacity-60'
                              : 'bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-purple-200 border border-white/10 hover:border-purple-400/40'
                          }`}
                        >
                          {isSelected ? `✓ ${sug}` : `+ ${sug}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditTagsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTags}
                    disabled={isSavingTags}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-600/30 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
                  >
                    {isSavingTags ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang lưu Firebase...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu vào Firebase</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 1: CHỈNH SỬA CHƯƠNG TRUYỆN */}
      <AnimatePresence>
        {isEditChapterModalOpen && editingChapter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditChapterModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl z-10 my-6 overflow-hidden border ${
                isDarkEffective
                  ? 'bg-[#101222] border-white/15 text-slate-100'
                  : 'bg-white border-stone-200 text-stone-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">Chỉnh sửa chương truyện</h3>
                    <p className={`text-xs ${isDarkEffective ? 'text-stone-400' : 'text-stone-500'}`}>
                      Cập nhật tiêu đề, nội dung và loại chương
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditChapterModalOpen(false)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isDarkEffective ? 'text-stone-400 hover:text-white hover:bg-white/10' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveEditChapter} className="space-y-4 pt-4">
                <div>
                  <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${isDarkEffective ? 'text-stone-300' : 'text-stone-700'}`}>
                    Tiêu đề chương
                  </label>
                  <input
                    type="text"
                    required
                    value={editChapTitle}
                    onChange={(e) => setEditChapTitle(e.target.value)}
                    placeholder="Ví dụ: Chương 1: Gặp gỡ"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans focus:outline-hidden transition-all ${
                      isDarkEffective
                        ? 'bg-black/30 border-white/15 text-white focus:border-sky-400'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-sky-500'
                    }`}
                  />
                </div>

                {/* Phân loại: Chính văn hay Ngoại truyện */}
                <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${
                  isDarkEffective ? 'bg-white/[0.04] border-white/10' : 'bg-stone-50 border-stone-200'
                }`}>
                  <input
                    type="checkbox"
                    id="editIsExtraCheckbox"
                    checked={editChapIsExtra}
                    onChange={(e) => setEditChapIsExtra(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                  <label htmlFor="editIsExtraCheckbox" className="text-xs sm:text-sm font-medium cursor-pointer select-none">
                    Đánh dấu đây là <strong className="text-purple-400">Ngoại truyện</strong> (thay vì Chính văn)
                  </label>
                </div>

                {/* Nội dung chương */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDarkEffective ? 'text-stone-300' : 'text-stone-700'}`}>
                      Nội dung chương
                    </label>
                    <div className="flex items-center gap-2">
                      {isLoadingEditContent && (
                        <span className="text-xs text-sky-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Đang tải nội dung...
                        </span>
                      )}
                      <span className={`text-xs ${isDarkEffective ? 'text-stone-400' : 'text-stone-500'}`}>
                        ~{editChapContent.trim() ? editChapContent.trim().split(/\s+/).filter(Boolean).length.toLocaleString('vi-VN') : 0} từ
                      </span>
                    </div>
                  </div>
                  <textarea
                    rows={12}
                    required
                    disabled={isLoadingEditContent || isSavingEditChapter}
                    value={editChapContent}
                    onChange={(e) => setEditChapContent(e.target.value)}
                    placeholder={isLoadingEditContent ? "Đang tải nội dung chương từ hệ thống..." : "Nhập hoặc dán nội dung chi tiết chương truyện..."}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-hidden resize-y font-serif leading-relaxed ${
                      isDarkEffective
                        ? 'bg-black/30 border-white/15 text-stone-200 focus:border-sky-400'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-sky-500'
                    } ${isLoadingEditContent ? 'opacity-60' : ''}`}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    disabled={isSavingEditChapter}
                    onClick={() => setIsEditChapterModalOpen(false)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      isDarkEffective ? 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10' : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
                    }`}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEditChapter || isLoadingEditContent}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30 transition-all cursor-pointer flex items-center gap-1.5 ${isSavingEditChapter ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {isSavingEditChapter ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: XÁC NHẬN XÓA CHƯƠNG */}
      <AnimatePresence>
        {isDeleteChapterModalOpen && chapterToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isDeletingChapter) {
                  setIsDeleteChapterModalOpen(false);
                  setChapterToDelete(null);
                }
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl z-10 border space-y-4 ${
                isDarkEffective
                  ? 'bg-[#151322] border-rose-500/30 text-slate-100'
                  : 'bg-white border-rose-200 text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-500 shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Xóa chương truyện</h3>
                  <p className="text-xs text-rose-400 font-medium">Thao tác này sẽ xóa vĩnh viễn trên Firestore</p>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                isDarkEffective ? 'bg-black/30 border-white/10 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <p>
                  Bạn có chắc chắn muốn xóa <strong className={isDarkEffective ? 'text-white' : 'text-stone-900'}>"{chapterToDelete.title}"</strong> khỏi bộ truyện không?
                </p>
                <p className="text-xs text-stone-400">
                  ({chapterToDelete.wordCount.toLocaleString('vi-VN')} chữ • {chapterToDelete.isExtra ? 'Ngoại truyện' : 'Chính văn'})
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isDeletingChapter}
                  onClick={() => {
                    setIsDeleteChapterModalOpen(false);
                    setChapterToDelete(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    isDarkEffective ? 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10' : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
                  }`}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={isDeletingChapter}
                  onClick={handleConfirmDeleteChapter}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1.5 ${isDeletingChapter ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isDeletingChapter ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xóa...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xác nhận xóa</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: XÁC NHẬN XÓA BÌNH LUẬN */}
      <AnimatePresence>
        {isDeleteCommentModalOpen && commentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsDeleteCommentModalOpen(false);
                setCommentToDelete(null);
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl z-10 border space-y-4 ${
                isDarkEffective
                  ? 'bg-[#151322] border-rose-500/30 text-slate-100'
                  : 'bg-white border-rose-200 text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-500 shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Xóa bình luận</h3>
                  <p className="text-xs text-rose-400 font-medium">Xác nhận xóa bình luận của độc giả</p>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border text-[14px] sm:text-[16px] space-y-1.5 ${
                isDarkEffective ? 'bg-black/30 border-white/10 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <div className={`font-semibold flex items-center gap-2 ${isDarkEffective ? 'text-white' : 'text-stone-900'}`}>
                  <span>{commentToDelete.author}</span>
                  <span className="text-[13px] text-stone-400 font-normal">({normalizeCommentDate(commentToDelete.createdAt)})</span>
                </div>
                <p className="italic line-clamp-3">"{commentToDelete.content}"</p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteCommentModalOpen(false);
                    setCommentToDelete(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-[14px] sm:text-[15px] font-semibold transition-colors cursor-pointer ${
                    isDarkEffective ? 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10' : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
                  }`}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteComment}
                  className="px-4 py-2 rounded-xl text-[14px] sm:text-[15px] font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xác nhận xóa</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST: Thông báo lưu thành công (Giới thiệu, Ảnh bìa, Mục lục chương) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-600 text-white shadow-2xl shadow-emerald-950/60 border border-emerald-400/40 max-w-sm sm:max-w-md"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Save className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{toastMessage.title}</p>
              <p className="text-xs text-emerald-100 leading-tight mt-0.5">{toastMessage.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Txt Chapter Splitter Modal (Upload file .txt để tách chương vào Firestore) */}
      <TxtChapterSplitterModal
        isOpen={isTxtSplitterOpen}
        onClose={() => setIsTxtSplitterOpen(false)}
        truyenId={novel.id}
        truyenTitle={novel.title}
        parentNovelMeta={{
          tenTruyen: novel.title,
          moTa: novel.synopsis,
          anhBia: novel.coverImageUrl || novel.coverImage,
          theLoai: novel.genres ? novel.genres.join(', ') : 'Tiểu Thuyết',
          tacGia: novel.author?.name || 'Tác giả',
        }}
        onSaveSuccess={async () => {
          try {
            const metas = await fetchChuongMetaList(novel.id);
            if (metas && metas.length > 0) {
              setFirestoreChapters(metas);
            }
          } catch {}
        }}
      />

      {/* Themed Footer preserving theme background */}
      <Footer
        isNovelPlatform={true}
        borderClass={tStyles.headerBorder}
        bgClass={tStyles.footerBg}
        theme={theme}
        isDarkMode={isDarkEffective}
      />

    </div>
  );
};
