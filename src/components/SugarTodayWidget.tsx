import React, { useMemo } from 'react';
import { Calendar, Heart } from 'lucide-react';
import { NovelThemeId } from '../utils/themeStyles';

export interface SugarThemeConfig {
  glassStyle: React.CSSProperties;
  insetStyle: React.CSSProperties;
  headerText: string;
  headerIcon: string;
  dayNum: string;
  monthText: string;
  quoteText: string;
  dividerStyle: React.CSSProperties;
  insetText: string;
  heartColor: string;
  heartFill: string;
  daysNum: string;
  footerText: string;
  baseGradient?: string;
  glowTopRight?: string;
  glowBottomLeft?: string;
}

export function getSugarThemeConfig(
  theme: NovelThemeId = 'slate-haze',
  isDarkMode = false
): SugarThemeConfig {
  if (!isDarkMode) {
    // -----------------------------------------------------------------
    // CHẾ ĐỘ SÁNG (LIGHT MODE) - Glassmorphism & Neumorphism theo từng Theme
    // -----------------------------------------------------------------
    switch (theme) {
      case 'sage':
        return {
          glassStyle: {
            backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(242, 248, 243, 0.85) 60%, rgba(228, 242, 230, 0.75) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '-4px -4px 16px rgba(255, 255, 255, 0.95), 4px 6px 18px rgba(160, 195, 165, 0.20)',
          },
          insetStyle: {
            backgroundImage: 'linear-gradient(135deg, #e4eee3 0%, #edf5ec 100%)',
            boxShadow: 'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(160, 195, 165, 0.22)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
          },
          headerText: '#486b4a',
          headerIcon: '#3f6141',
          dayNum: '#1b3a1d',
          monthText: '#3a5f3c',
          quoteText: '#2a4e2d',
          dividerStyle: { backgroundColor: '#cfe2ce' },
          insetText: '#486b4a',
          heartColor: '#4a754c',
          heartFill: 'rgba(74, 117, 76, 0.22)',
          daysNum: '#214324',
          footerText: 'rgba(82, 116, 84, 0.70)',
        };

      case 'mocha':
        return {
          glassStyle: {
            backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(253, 248, 243, 0.85) 60%, rgba(247, 237, 227, 0.75) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '-4px -4px 16px rgba(255, 255, 255, 0.95), 4px 6px 18px rgba(195, 175, 155, 0.20)',
          },
          insetStyle: {
            backgroundImage: 'linear-gradient(135deg, #f0e5d8 0%, #f7efe6 100%)',
            boxShadow: 'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(195, 175, 155, 0.22)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
          },
          headerText: '#8a634e',
          headerIcon: '#78533f',
          dayNum: '#422b1f',
          monthText: '#6d4d3c',
          quoteText: '#543829',
          dividerStyle: { backgroundColor: '#ebdacf' },
          insetText: '#8a634e',
          heartColor: '#8f644e',
          heartFill: 'rgba(143, 100, 78, 0.22)',
          daysNum: '#482e21',
          footerText: 'rgba(138, 109, 92, 0.70)',
        };

      case 'notebook':
        return {
          glassStyle: {
            backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(250, 250, 250, 0.88) 60%, rgba(242, 242, 242, 0.80) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '-4px -4px 16px rgba(255, 255, 255, 0.95), 4px 6px 18px rgba(0, 0, 0, 0.08)',
          },
          insetStyle: {
            backgroundImage: 'linear-gradient(135deg, #eaeaea 0%, #f4f4f4 100%)',
            boxShadow: 'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(160, 160, 160, 0.20)',
            border: '1px solid rgba(255, 255, 255, 0.70)',
          },
          headerText: '#525252',
          headerIcon: '#404040',
          dayNum: '#171717',
          monthText: '#404040',
          quoteText: '#262626',
          dividerStyle: { backgroundColor: '#e5e5e5' },
          insetText: '#525252',
          heartColor: '#404040',
          heartFill: 'rgba(64, 64, 64, 0.22)',
          daysNum: '#171717',
          footerText: 'rgba(115, 115, 115, 0.70)',
        };

      case 'amethyst-haze':
      case 'cosmic':
        return {
          glassStyle: {
            backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 245, 253, 0.85) 60%, rgba(238, 230, 250, 0.75) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '-4px -4px 16px rgba(255, 255, 255, 0.95), 4px 6px 18px rgba(185, 165, 215, 0.20)',
          },
          insetStyle: {
            backgroundImage: 'linear-gradient(135deg, #eee5f7 0%, #f5effc 100%)',
            boxShadow: 'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(185, 165, 215, 0.22)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
          },
          headerText: '#6e558c',
          headerIcon: '#60477e',
          dayNum: '#2d1c44',
          monthText: '#5b4277',
          quoteText: '#3f295d',
          dividerStyle: { backgroundColor: '#dfd2f0' },
          insetText: '#6e558c',
          heartColor: '#755598',
          heartFill: 'rgba(117, 85, 152, 0.22)',
          daysNum: '#371f54',
          footerText: 'rgba(122, 102, 147, 0.70)',
        };

      case 'lululemon':
        return {
          glassStyle: {
            backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(253, 243, 246, 0.85) 60%, rgba(250, 230, 237, 0.75) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '-4px -4px 16px rgba(255, 255, 255, 0.95), 4px 6px 18px rgba(205, 165, 185, 0.20)',
          },
          insetStyle: {
            backgroundImage: 'linear-gradient(135deg, #f5e2ea 0%, #fbeff3 100%)',
            boxShadow: 'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(205, 165, 185, 0.22)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
          },
          headerText: '#8a495d',
          headerIcon: '#7b3a4e',
          dayNum: '#421623',
          monthText: '#6e3344',
          quoteText: '#54202e',
          dividerStyle: { backgroundColor: '#ebd0db' },
          insetText: '#8a495d',
          heartColor: '#8f4459',
          heartFill: 'rgba(143, 68, 89, 0.22)',
          daysNum: '#481b27',
          footerText: 'rgba(143, 93, 108, 0.70)',
        };

      case 'slate-haze':
      default:
        return {
          glassStyle: {
            backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(240, 248, 255, 0.80) 60%, rgba(222, 241, 255, 0.70) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '-4px -4px 16px rgba(255, 255, 255, 0.95), 4px 6px 18px rgba(165, 195, 225, 0.18)',
          },
          insetStyle: {
            backgroundImage: 'linear-gradient(135deg, #e7f1f9 0%, #edf5fc 100%)',
            boxShadow: 'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(170, 198, 225, 0.20)',
            border: '1px solid rgba(255, 255, 255, 0.60)',
          },
          headerText: '#4d78a4',
          headerIcon: '#4274a9',
          dayNum: '#1a3c63',
          monthText: '#3e6b9a',
          quoteText: '#2d5480',
          dividerStyle: { backgroundColor: '#cde2f5' },
          insetText: '#4d78a4',
          heartColor: '#5284be',
          heartFill: 'rgba(82, 132, 190, 0.20)',
          daysNum: '#26507c',
          footerText: 'rgba(85, 128, 170, 0.60)',
        };
    }
  }

  // -----------------------------------------------------------------
  // CHẾ ĐỘ TỐI (DARK MODE) - Áp dụng màu nền và hiệu ứng của trang thông tin truyện kiểu chuẩn (khu vực bìa)
  // -----------------------------------------------------------------
  switch (theme) {
    case 'sage':
      return {
        glassStyle: {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255, 255, 255, 0.20)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
        },
        insetStyle: {
          backgroundImage: 'linear-gradient(135deg, rgba(26, 42, 30, 0.75) 0%, rgba(16, 28, 19, 0.85) 100%)',
          boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.08), inset 2px 2px 5px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
        },
        headerText: '#8eb893',
        headerIcon: '#a2caa7',
        dayNum: '#e6f5e8',
        monthText: '#98c29c',
        quoteText: '#c9e5cb',
        dividerStyle: { backgroundColor: 'rgba(255, 255, 255, 0.10)' },
        insetText: '#8eb893',
        heartColor: '#8eb893',
        heartFill: 'rgba(142, 184, 147, 0.25)',
        daysNum: '#e2f4e4',
        footerText: 'rgba(142, 184, 147, 0.70)',
        baseGradient: 'linear-gradient(135deg, rgba(20, 35, 24, 0.85) 0%, rgba(12, 21, 16, 0.95) 100%)',
        glowTopRight: 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(52, 175, 115, 0.30) 0%, rgba(30, 105, 65, 0.16) 45%, transparent 75%)',
        glowBottomLeft: 'radial-gradient(ellipse 75% 65% at 15% 85%, rgba(52, 175, 115, 0.30) 0%, rgba(30, 105, 65, 0.16) 45%, transparent 75%)',
      };

    case 'mocha':
      return {
        glassStyle: {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255, 255, 255, 0.20)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
        },
        insetStyle: {
          backgroundImage: 'linear-gradient(135deg, rgba(48, 35, 27, 0.75) 0%, rgba(32, 23, 18, 0.85) 100%)',
          boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.08), inset 2px 2px 5px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
        },
        headerText: '#cba58e',
        headerIcon: '#d8b59e',
        dayNum: '#faefe6',
        monthText: '#d6b49e',
        quoteText: '#ebd6c7',
        dividerStyle: { backgroundColor: 'rgba(255, 255, 255, 0.10)' },
        insetText: '#cba58e',
        heartColor: '#d4ab94',
        heartFill: 'rgba(212, 171, 148, 0.25)',
        daysNum: '#faede3',
        footerText: 'rgba(194, 154, 132, 0.70)',
        baseGradient: 'linear-gradient(135deg, rgba(30, 20, 14, 0.85) 0%, rgba(20, 13, 9, 0.95) 100%)',
        glowTopRight: 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(185, 120, 85, 0.32) 0%, rgba(125, 75, 48, 0.16) 45%, transparent 75%)',
        glowBottomLeft: 'radial-gradient(ellipse 75% 65% at 15% 85%, rgba(185, 120, 85, 0.32) 0%, rgba(125, 75, 48, 0.16) 45%, transparent 75%)',
      };

    case 'notebook':
      return {
        glassStyle: {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255, 255, 255, 0.20)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
        },
        insetStyle: {
          backgroundImage: 'linear-gradient(135deg, rgba(42, 42, 42, 0.75) 0%, rgba(26, 26, 26, 0.85) 100%)',
          boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.08), inset 2px 2px 5px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
        },
        headerText: '#a3a3a3',
        headerIcon: '#d4d4d4',
        dayNum: '#f5f5f5',
        monthText: '#a3a3a3',
        quoteText: '#e5e5e5',
        dividerStyle: { backgroundColor: 'rgba(255, 255, 255, 0.10)' },
        insetText: '#a3a3a3',
        heartColor: '#d4d4d4',
        heartFill: 'rgba(212, 212, 212, 0.22)',
        daysNum: '#f5f5f5',
        footerText: 'rgba(163, 163, 163, 0.70)',
        baseGradient: 'linear-gradient(135deg, rgba(28, 25, 23, 0.85) 0%, rgba(20, 18, 16, 0.95) 100%)',
        glowTopRight: 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(160, 160, 175, 0.28) 0%, rgba(85, 85, 95, 0.14) 45%, transparent 75%)',
        glowBottomLeft: 'radial-gradient(ellipse 75% 65% at 15% 85%, rgba(160, 160, 175, 0.28) 0%, rgba(85, 85, 95, 0.14) 45%, transparent 75%)',
      };

    case 'amethyst-haze':
    case 'cosmic':
      return {
        glassStyle: {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255, 255, 255, 0.20)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
        },
        insetStyle: {
          backgroundImage: 'linear-gradient(135deg, rgba(40, 28, 62, 0.75) 0%, rgba(24, 16, 38, 0.85) 100%)',
          boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.08), inset 2px 2px 5px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
        },
        headerText: '#b9a1dc',
        headerIcon: '#c9b4e8',
        dayNum: '#f4edfd',
        monthText: '#c6b0e8',
        quoteText: '#e4d5f8',
        dividerStyle: { backgroundColor: 'rgba(255, 255, 255, 0.10)' },
        insetText: '#b9a1dc',
        heartColor: '#c3abe6',
        heartFill: 'rgba(195, 171, 230, 0.25)',
        daysNum: '#f3eafd',
        footerText: 'rgba(176, 150, 212, 0.70)',
        baseGradient: 'linear-gradient(135deg, rgba(26, 18, 46, 0.88) 0%, rgba(12, 8, 23, 0.96) 100%)',
        glowTopRight: 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(155, 85, 225, 0.32) 0%, rgba(100, 45, 155, 0.16) 45%, transparent 75%)',
        glowBottomLeft: 'radial-gradient(ellipse 75% 65% at 15% 85%, rgba(155, 85, 225, 0.32) 0%, rgba(100, 45, 155, 0.16) 45%, transparent 75%)',
      };

    case 'lululemon':
      return {
        glassStyle: {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255, 255, 255, 0.20)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
        },
        insetStyle: {
          backgroundImage: 'linear-gradient(135deg, rgba(50, 22, 34, 0.75) 0%, rgba(32, 14, 22, 0.85) 100%)',
          boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.08), inset 2px 2px 5px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
        },
        headerText: '#d893a7',
        headerIcon: '#e7a5b7',
        dayNum: '#faedf1',
        monthText: '#dca2b3',
        quoteText: '#f3d5dd',
        dividerStyle: { backgroundColor: 'rgba(255, 255, 255, 0.10)' },
        insetText: '#d893a7',
        heartColor: '#e39fb2',
        heartFill: 'rgba(227, 159, 178, 0.25)',
        daysNum: '#faedf1',
        footerText: 'rgba(212, 139, 160, 0.70)',
        baseGradient: 'linear-gradient(135deg, rgba(36, 21, 26, 0.88) 0%, rgba(21, 13, 16, 0.96) 100%)',
        glowTopRight: 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(165, 45, 78, 0.35) 0%, rgba(125, 30, 56, 0.18) 45%, transparent 75%)',
        glowBottomLeft: 'radial-gradient(ellipse 75% 65% at 15% 85%, rgba(165, 45, 78, 0.35) 0%, rgba(125, 30, 56, 0.18) 45%, transparent 75%)',
      };

    case 'slate-haze':
    default:
      return {
        glassStyle: {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255, 255, 255, 0.20)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
        },
        insetStyle: {
          backgroundImage: 'linear-gradient(135deg, rgba(22, 34, 49, 0.75) 0%, rgba(14, 23, 34, 0.85) 100%)',
          boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.08), inset 2px 2px 5px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
        },
        headerText: '#8baecf',
        headerIcon: '#9dc2e3',
        dayNum: '#e6f1fb',
        monthText: '#96b8d9',
        quoteText: '#c5daf0',
        dividerStyle: { backgroundColor: 'rgba(255, 255, 255, 0.10)' },
        insetText: '#8baecf',
        heartColor: '#8bb0cf',
        heartFill: 'rgba(139, 176, 207, 0.25)',
        daysNum: '#e1eefc',
        footerText: 'rgba(139, 176, 207, 0.70)',
        baseGradient: 'linear-gradient(135deg, rgba(16, 25, 36, 0.85) 0%, rgba(11, 17, 24, 0.95) 100%)',
        glowTopRight: 'radial-gradient(ellipse 75% 65% at 85% 15%, rgba(85, 125, 160, 0.32) 0%, rgba(50, 75, 105, 0.16) 45%, transparent 75%)',
        glowBottomLeft: 'radial-gradient(ellipse 75% 65% at 15% 85%, rgba(85, 125, 160, 0.32) 0%, rgba(50, 75, 105, 0.16) 45%, transparent 75%)',
      };
  }
}

interface SugarTodayWidgetProps {
  theme?: NovelThemeId;
  isDarkMode?: boolean;
}

export default function SugarTodayWidget({
  theme = 'slate-haze',
  isDarkMode = false,
}: SugarTodayWidgetProps) {
  // Tự động tính toán ngày, tháng và thứ hiện tại theo thời gian thực
  const todayFormatted = useMemo(() => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[now.getMonth()];
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayOfWeek = daysOfWeek[now.getDay()];
    return { day, month, dayOfWeek };
  }, []);

  // Tính số ngày kể từ ngày thành lập web: 01.10.2026 (mỗi ngày qua đi tự động cộng thêm 1)
  const daysSinceStart = useMemo(() => {
    const startDate = new Date(2026, 9, 1); // 01.10.2026 (tháng 10 là index 9)
    const now = new Date();
    const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const diffTime = nowMidnight - startMidnight;
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  }, []);

  // Cấu hình màu sắc đồng bộ theo theme và chế độ sáng/tối
  const config = useMemo(() => getSugarThemeConfig(theme, isDarkMode), [theme, isDarkMode]);

  return (
    <div
      style={config.glassStyle}
      className="p-5 rounded-[2.2rem] flex flex-col gap-3.5 w-full relative overflow-hidden select-none transition-all duration-300"
    >
      {/* Nền hiệu ứng & khối màu loang chuẩn Novel Detail View (chỉ hiển thị ở chế độ tối) */}
      {isDarkMode && config.baseGradient && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: config.baseGradient }}
          />
          {config.glowTopRight && (
            <div
              className="absolute -top-14 -right-14 w-80 h-72 pointer-events-none rounded-[46%_54%_68%_32%/45%_55%_45%_55%] blur-2xl"
              style={{ backgroundImage: config.glowTopRight }}
            />
          )}
          {config.glowBottomLeft && (
            <div
              className="absolute -bottom-14 -left-14 w-80 h-72 pointer-events-none rounded-[54%_46%_32%_68%/55%_45%_55%_45%] blur-2xl"
              style={{ backgroundImage: config.glowBottomLeft }}
            />
          )}
        </div>
      )}

      {/* Header: TODAY & Thứ trong tuần */}
      <div
        style={{ color: config.headerText }}
        className="relative z-10 flex items-center justify-between text-[11px] font-source-serif font-serif tracking-widest uppercase transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" style={{ color: config.headerIcon }} strokeWidth={1.5} />
          <span>TODAY</span>
        </span>
        <span className="font-semibold">{todayFormatted.dayOfWeek}</span>
      </div>

      {/* Con số Ngày to bản phong cách Minimalist */}
      <div className="relative z-10 flex items-baseline gap-2">
        <span
          style={{ color: config.dayNum }}
          className="font-source-serif font-serif text-3xl font-light tracking-tight transition-colors"
        >
          {todayFormatted.day}
        </span>
        <span
          style={{ color: config.monthText }}
          className="font-source-serif font-serif text-sm tracking-widest uppercase font-medium transition-colors"
        >
          {todayFormatted.month}
        </span>
      </div>

      {/* Lời nhắn nhủ nhẹ nhàng, thanh tĩnh */}
      <div
        style={{ color: config.quoteText }}
        className="relative z-10 text-xs font-source-serif font-serif italic leading-relaxed transition-colors"
      >
        “Here's to another quiet, lovely day ♡”
      </div>

      {/* Đường kẻ ngang chia cắt phong cách thủy tinh trong */}
      <div style={config.dividerStyle} className="relative z-10 h-px my-0.5 transition-colors" />

      {/* Khối Kỷ niệm TOGETHER dạng dập chìm Inset */}
      <div
        style={config.insetStyle}
        className="relative z-10 px-4 py-3 rounded-2xl flex items-center justify-between text-[11px] font-source-serif font-serif transition-all"
      >
        <div className="flex items-center gap-2">
          <Heart
            className="w-3.5 h-3.5"
            style={{ color: config.heartColor, fill: config.heartFill }}
          />
          <span
            style={{ color: config.insetText }}
            className="uppercase tracking-widest font-semibold transition-colors"
          >
            TOGETHER
          </span>
        </div>
        <span style={{ color: config.daysNum }} className="font-bold transition-colors">
          {daysSinceStart} Ngày
        </span>
      </div>

      {/* Footer phụ nhỏ */}
      <div
        style={{ color: config.footerText }}
        className="relative z-10 flex items-center justify-between text-[10px] font-source-serif font-serif pt-0.5 px-1 transition-colors"
      >
        <span>our little calendar ✦</span>
        <span>01.10.2026</span>
      </div>
    </div>
  );
}

export { SugarTodayWidget };
