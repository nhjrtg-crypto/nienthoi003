import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Star } from 'lucide-react';
import { cosmicAudio } from '../utils/audioSynth';

// =========================================================================
// 1. COMPONENT KẸP GIẤY KIM LOẠI MẠ BẠC (SVG CHROME TROMBONE CLIP)
// =========================================================================
export const MetallicPaperclip: React.FC<{
  className?: string;
  rotation?: number;
  scale?: number;
  id?: string;
  onClick?: () => void;
}> = ({
  className = '',
  rotation = 0,
  scale = 1,
  id = 'c1',
  onClick,
}) => {
  const gradId = `silverMetallicGrad_${id}`;
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: scale * 1.08, rotate: rotation + 3, y: -2 }}
      whileTap={{ scale: scale * 0.95 }}
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: 'top center',
      }}
      className={`relative cursor-pointer select-none transition-transform duration-200 ${className}`}
      title="Kẹp giấy kim loại mạ bạc"
    >
      <svg
        width="26"
        height="68"
        viewBox="0 0 26 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Dải gradient kim loại mạ bạc đa tầng */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="16%" stopColor="#e2e8f0" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="52%" stopColor="#f8fafc" />
            <stop offset="72%" stopColor="#64748b" />
            <stop offset="88%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* 1. Bóng đổ rơi xuống bìa */}
        <path
          d="M 21.5 54 V 10.5 A 9 9 0 0 0 3.5 10.5 V 49 A 6.5 6.5 0 0 0 16.5 49 V 17 A 4 4 0 0 0 8.5 17 V 38"
          stroke="rgba(12, 34, 58, 0.32)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(1.2, 2.2)"
        />

        {/* 2. Đường viền kim loại tối tăng độ tương phản mép sợi dây */}
        <path
          d="M 21.5 54 V 10.5 A 9 9 0 0 0 3.5 10.5 V 49 A 6.5 6.5 0 0 0 16.5 49 V 17 A 4 4 0 0 0 8.5 17 V 38"
          stroke="#475569"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
        />

        {/* 3. Thân dây kim loại chrome chính */}
        <path
          d="M 21.5 54 V 10.5 A 9 9 0 0 0 3.5 10.5 V 49 A 6.5 6.5 0 0 0 16.5 49 V 17 A 4 4 0 0 0 8.5 17 V 38"
          stroke={`url(#${gradId})`}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4. Lõi phản quang sáng trắng siêu nét */}
        <path
          d="M 21.5 54 V 10.5 A 9 9 0 0 0 3.5 10.5 V 49 A 6.5 6.5 0 0 0 16.5 49 V 17 A 4 4 0 0 0 8.5 17 V 38"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </motion.div>
  );
};

// =========================================================================
// 2. CẤU HÌNH BẢNG MÀU THEO TỪNG THEME CHO BÌA SỔ (FROST GIỮ NGUYÊN CODE)
// =========================================================================
interface NotebookCoverThemeStyles {
  coverBg: string;
  coverBorder: string;
  coverShadow: string;
  spineBg: string;
  spineBorder: string;
  spineShadow: string;
  ringSlotBg: string;
  ringSlotBorder: string;
  ringSlotShadow: string;
  sheetShadow: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  titleColor: string;
  subtextColor: string;
  lockBg: string;
  lockBorder: string;
  lockText: string;
  lockGlow: string;
  sparkleColor: string;
}

const getNotebookCoverTheme = (themeId: string, isDark: boolean): NotebookCoverThemeStyles => {
  if (themeId === 'slate-haze') {
    // THEME FROST: GIỮ NGUYÊN 100% NHƯ CODE CỦA NGƯỜI DÙNG, NÚT DỊU NHẸ
    return {
      coverBg: isDark
        ? 'bg-gradient-to-br from-[#132c4a]/90 via-[#102742]/85 to-[#0d1f35]/90'
        : 'bg-gradient-to-br from-[#d4ecfb]/85 via-[#c0e3f8]/80 to-[#b2dbf5]/85',
      coverBorder: isDark ? 'border-white/20' : 'border-white/40',
      coverShadow: isDark
        ? 'shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.5)]'
        : 'shadow-[0_22px_55px_rgba(50,100,165,0.22),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(70,120,170,0.18)]',
      spineBg: isDark ? 'bg-white/20' : 'bg-white/50',
      spineBorder: isDark ? 'border-white/20' : 'border-white/40',
      spineShadow: isDark ? 'shadow-[inset_-2px_0_6px_rgba(255,255,255,0.1)]' : 'shadow-[inset_-2px_0_6px_rgba(0,0,0,0.04)]',
      ringSlotBg: isDark ? 'bg-black/30' : 'bg-white/80',
      ringSlotBorder: isDark ? 'border-white/20' : 'border-sky-200/60',
      ringSlotShadow: isDark ? 'shadow-black/40' : 'shadow-sky-900/10',
      sheetShadow: isDark
        ? '2px 0 0 #f1f5f9, 4px 0 0 rgba(255,255,255,0.08), 8px 0 0 rgba(255,255,255,0.04), 14px 4px 18px rgba(0,0,0,0.6)'
        : '2px 0 0 #ffffff, 4px 0 0 #f8fafc, 6px 0 0 #edf4fa, 9px 0 0 #e1edf6, 14px 4px 22px rgba(70,120,170,0.22)',
      badgeBg: isDark ? 'bg-sky-500/20' : 'bg-white/70',
      badgeBorder: isDark ? 'border-sky-400/40' : 'border-white/80',
      badgeText: isDark ? 'text-sky-300' : 'text-sky-800',
      titleColor: isDark ? 'text-white' : 'text-[#1e3a5f]',
      subtextColor: isDark ? 'text-sky-200/80' : 'text-[#416288]',
      lockBg: isDark
        ? 'bg-sky-950/70 hover:bg-sky-900/80 border-sky-400/30 text-sky-200'
        : 'bg-white/80 hover:bg-white text-sky-800 border-sky-200/80',
      lockBorder: 'border',
      lockText: '',
      lockGlow: 'shadow-[0_2px_8px_rgba(56,189,248,0.15)]',
      sparkleColor: '#38bdf8',
    };
  }

  if (themeId === 'amethyst-haze' || themeId === 'cosmic') {
    // THEME PURPLE (AMETHYST)
    return {
      coverBg: isDark
        ? 'bg-gradient-to-br from-[#27163f]/90 via-[#1c0f2f]/85 to-[#130922]/90'
        : 'bg-gradient-to-br from-[#f1e8fc]/85 via-[#e7d8f8]/80 to-[#ded0f7]/85',
      coverBorder: isDark ? 'border-white/20' : 'border-white/40',
      coverShadow: isDark
        ? 'shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.5)]'
        : 'shadow-[0_22px_55px_rgba(147,51,234,0.18),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(147,51,234,0.15)]',
      spineBg: isDark ? 'bg-white/20' : 'bg-white/50',
      spineBorder: isDark ? 'border-white/20' : 'border-white/40',
      spineShadow: isDark ? 'shadow-[inset_-2px_0_6px_rgba(255,255,255,0.1)]' : 'shadow-[inset_-2px_0_6px_rgba(0,0,0,0.04)]',
      ringSlotBg: isDark ? 'bg-black/30' : 'bg-white/80',
      ringSlotBorder: isDark ? 'border-white/20' : 'border-purple-200/60',
      ringSlotShadow: isDark ? 'shadow-black/40' : 'shadow-purple-900/10',
      sheetShadow: isDark
        ? '2px 0 0 #f5f3ff, 4px 0 0 rgba(255,255,255,0.08), 8px 0 0 rgba(255,255,255,0.04), 14px 4px 18px rgba(0,0,0,0.6)'
        : '2px 0 0 #ffffff, 4px 0 0 #faf5ff, 6px 0 0 #f3e8ff, 9px 0 0 #e9d5ff, 14px 4px 22px rgba(147,51,234,0.18)',
      badgeBg: isDark ? 'bg-purple-500/20' : 'bg-white/70',
      badgeBorder: isDark ? 'border-purple-400/40' : 'border-white/80',
      badgeText: isDark ? 'text-purple-300' : 'text-purple-800',
      titleColor: isDark ? 'text-white' : 'text-[#3b1959]',
      subtextColor: isDark ? 'text-purple-200/80' : 'text-[#6c4091]',
      lockBg: isDark
        ? 'bg-purple-950/70 hover:bg-purple-900/80 border-purple-400/30 text-purple-200'
        : 'bg-white/80 hover:bg-white text-purple-800 border-purple-200/80',
      lockBorder: 'border',
      lockText: '',
      lockGlow: 'shadow-[0_2px_8px_rgba(168,85,247,0.15)]',
      sparkleColor: '#c084fc',
    };
  }

  if (themeId === 'sage') {
    // THEME SAGE (GREEN)
    return {
      coverBg: isDark
        ? 'bg-gradient-to-br from-[#122b1c]/90 via-[#0d2015]/85 to-[#08160e]/90'
        : 'bg-gradient-to-br from-[#e4f7eb]/85 via-[#d4f2de]/80 to-[#c5edd2]/85',
      coverBorder: isDark ? 'border-white/20' : 'border-white/40',
      coverShadow: isDark
        ? 'shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.5)]'
        : 'shadow-[0_22px_55px_rgba(34,130,75,0.18),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(34,130,75,0.15)]',
      spineBg: isDark ? 'bg-white/20' : 'bg-white/50',
      spineBorder: isDark ? 'border-white/20' : 'border-white/40',
      spineShadow: isDark ? 'shadow-[inset_-2px_0_6px_rgba(255,255,255,0.1)]' : 'shadow-[inset_-2px_0_6px_rgba(0,0,0,0.04)]',
      ringSlotBg: isDark ? 'bg-black/30' : 'bg-white/80',
      ringSlotBorder: isDark ? 'border-white/20' : 'border-emerald-200/60',
      ringSlotShadow: isDark ? 'shadow-black/40' : 'shadow-emerald-900/10',
      sheetShadow: isDark
        ? '2px 0 0 #f0fdf4, 4px 0 0 rgba(255,255,255,0.08), 8px 0 0 rgba(255,255,255,0.04), 14px 4px 18px rgba(0,0,0,0.6)'
        : '2px 0 0 #ffffff, 4px 0 0 #f0fdf4, 6px 0 0 #dcfce7, 9px 0 0 #bbf7d0, 14px 4px 22px rgba(22,163,74,0.18)',
      badgeBg: isDark ? 'bg-emerald-500/20' : 'bg-white/70',
      badgeBorder: isDark ? 'border-emerald-400/40' : 'border-white/80',
      badgeText: isDark ? 'text-emerald-300' : 'text-emerald-800',
      titleColor: isDark ? 'text-white' : 'text-[#183d25]',
      subtextColor: isDark ? 'text-emerald-200/80' : 'text-[#386b49]',
      lockBg: isDark
        ? 'bg-emerald-950/70 hover:bg-emerald-900/80 border-emerald-400/30 text-emerald-200'
        : 'bg-white/80 hover:bg-white text-emerald-800 border-emerald-200/80',
      lockBorder: 'border',
      lockText: '',
      lockGlow: 'shadow-[0_2px_8px_rgba(16,185,129,0.15)]',
      sparkleColor: '#34d399',
    };
  }

  if (themeId === 'mocha') {
    // THEME MOCHA / LINEN (WARM AMBER / CARAMEL)
    return {
      coverBg: isDark
        ? 'bg-gradient-to-br from-[#352216]/90 via-[#26180f]/85 to-[#1a100a]/90'
        : 'bg-gradient-to-br from-[#fbf2e3]/85 via-[#f5e6d0]/80 to-[#eed9c0]/85',
      coverBorder: isDark ? 'border-white/20' : 'border-white/40',
      coverShadow: isDark
        ? 'shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.5)]'
        : 'shadow-[0_22px_55px_rgba(160,100,50,0.18),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(160,100,50,0.15)]',
      spineBg: isDark ? 'bg-white/20' : 'bg-white/50',
      spineBorder: isDark ? 'border-white/20' : 'border-white/40',
      spineShadow: isDark ? 'shadow-[inset_-2px_0_6px_rgba(255,255,255,0.1)]' : 'shadow-[inset_-2px_0_6px_rgba(0,0,0,0.04)]',
      ringSlotBg: isDark ? 'bg-black/30' : 'bg-white/80',
      ringSlotBorder: isDark ? 'border-white/20' : 'border-amber-200/60',
      ringSlotShadow: isDark ? 'shadow-black/40' : 'shadow-amber-900/10',
      sheetShadow: isDark
        ? '2px 0 0 #fffbeb, 4px 0 0 rgba(255,255,255,0.08), 8px 0 0 rgba(255,255,255,0.04), 14px 4px 18px rgba(0,0,0,0.6)'
        : '2px 0 0 #ffffff, 4px 0 0 #fffbeb, 6px 0 0 #fef3c7, 9px 0 0 #fde68a, 14px 4px 22px rgba(217,119,6,0.18)',
      badgeBg: isDark ? 'bg-amber-500/20' : 'bg-white/70',
      badgeBorder: isDark ? 'border-amber-400/40' : 'border-white/80',
      badgeText: isDark ? 'text-amber-300' : 'text-amber-800',
      titleColor: isDark ? 'text-white' : 'text-[#482c19]',
      subtextColor: isDark ? 'text-amber-200/80' : 'text-[#7e563b]',
      lockBg: isDark
        ? 'bg-amber-950/70 hover:bg-amber-900/80 border-amber-400/30 text-amber-200'
        : 'bg-white/80 hover:bg-white text-amber-900 border-amber-200/80',
      lockBorder: 'border',
      lockText: '',
      lockGlow: 'shadow-[0_2px_8px_rgba(217,119,6,0.15)]',
      sparkleColor: '#fbbf24',
    };
  }

  // THEME NOTEBOOK (WHITE MONOCHROME) & DEFAULT
  return {
    coverBg: isDark
      ? 'bg-gradient-to-br from-[#242428]/90 via-[#1b1b1e]/85 to-[#131316]/90'
      : 'bg-gradient-to-br from-[#f6f6f8]/85 via-[#ececf0]/80 to-[#e2e2e7]/85',
    coverBorder: isDark ? 'border-white/20' : 'border-white/40',
    coverShadow: isDark
      ? 'shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.5)]'
      : 'shadow-[0_22px_55px_rgba(100,100,110,0.18),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(100,100,110,0.15)]',
    spineBg: isDark ? 'bg-white/20' : 'bg-white/50',
    spineBorder: isDark ? 'border-white/20' : 'border-white/40',
    spineShadow: isDark ? 'shadow-[inset_-2px_0_6px_rgba(255,255,255,0.1)]' : 'shadow-[inset_-2px_0_6px_rgba(0,0,0,0.04)]',
    ringSlotBg: isDark ? 'bg-black/30' : 'bg-white/80',
    ringSlotBorder: isDark ? 'border-white/20' : 'border-zinc-300/60',
    ringSlotShadow: isDark ? 'shadow-black/40' : 'shadow-zinc-900/10',
    sheetShadow: isDark
      ? '2px 0 0 #f4f4f5, 4px 0 0 rgba(255,255,255,0.08), 8px 0 0 rgba(255,255,255,0.04), 14px 4px 18px rgba(0,0,0,0.6)'
      : '2px 0 0 #ffffff, 4px 0 0 #fafafa, 6px 0 0 #f4f4f5, 9px 0 0 #e4e4e7, 14px 4px 22px rgba(82,82,91,0.18)',
    badgeBg: isDark ? 'bg-zinc-500/20' : 'bg-white/70',
    badgeBorder: isDark ? 'border-zinc-400/40' : 'border-white/80',
    badgeText: isDark ? 'text-zinc-300' : 'text-zinc-800',
    titleColor: isDark ? 'text-white' : 'text-[#202024]',
    subtextColor: isDark ? 'text-zinc-300/80' : 'text-[#5b5b63]',
    lockBg: isDark
      ? 'bg-zinc-900/80 hover:bg-zinc-800/80 border-zinc-700/60 text-zinc-200'
      : 'bg-white/85 hover:bg-white text-zinc-800 border-zinc-200/80',
    lockBorder: 'border',
    lockText: '',
    lockGlow: 'shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
    sparkleColor: '#a1a1aa',
  };
};

// =========================================================================
// 2.2 CẤU HÌNH BẢNG MÀU CHO PHẦN MEMO & LUCKY NẰM DƯỚI CÙNG TRONG BÌA SỔ
// =========================================================================
interface MemoLuckyThemeStyles {
  memoText: string;
  dashedLine: string;
  cardBg: string;
  cardBorder: string;
  appleBoxBg: string;
  appleBoxBorder: string;
  barTop: string;
  barBottom: string;
  luckyBg: string;
  luckyBorder: string;
  luckyText: string;
  iconColor: string;
}

const getCoverMemoTheme = (theme: string, isDark: boolean): MemoLuckyThemeStyles => {
  switch (theme) {
    case 'slate-haze':
      return {
        memoText: isDark ? 'text-sky-300' : 'text-[#2b5a84]',
        dashedLine: isDark ? 'border-sky-400/40' : 'border-[#8cbfe6]/70',
        cardBg: isDark ? 'bg-sky-950/40 backdrop-blur-md' : 'bg-white/70 backdrop-blur-md',
        cardBorder: isDark ? 'border-sky-400/30' : 'border-[#bae0f7]/90',
        appleBoxBg: isDark ? 'bg-sky-900/50' : 'bg-sky-50/90',
        appleBoxBorder: isDark ? 'border-sky-500/40' : 'border-[#bae0f7]',
        barTop: isDark ? 'bg-sky-400/50' : 'bg-[#98cbed]/80',
        barBottom: isDark ? 'bg-sky-400/35' : 'bg-[#98cbed]/55',
        luckyBg: isDark ? 'bg-sky-900/60' : 'bg-white/90',
        luckyBorder: isDark ? 'border-sky-400/50' : 'border-[#7dbce4]',
        luckyText: isDark ? 'text-sky-200' : 'text-[#225782]',
        iconColor: isDark ? '#38bdf8' : '#0284c7',
      };

    case 'sage':
      return {
        memoText: isDark ? 'text-emerald-300' : 'text-[#386b49]',
        dashedLine: isDark ? 'border-emerald-400/40' : 'border-[#9bb999]/70',
        cardBg: isDark ? 'bg-emerald-950/40 backdrop-blur-md' : 'bg-[#f0f7f1]/80 backdrop-blur-md',
        cardBorder: isDark ? 'border-emerald-400/30' : 'border-[#b8d6b6]',
        appleBoxBg: isDark ? 'bg-emerald-900/50' : 'bg-white/90',
        appleBoxBorder: isDark ? 'border-emerald-500/40' : 'border-[#b8d6b6]',
        barTop: isDark ? 'bg-emerald-400/50' : 'bg-[#a3c9a1]/85',
        barBottom: isDark ? 'bg-emerald-400/35' : 'bg-[#a3c9a1]/60',
        luckyBg: isDark ? 'bg-emerald-900/60' : 'bg-white',
        luckyBorder: isDark ? 'border-emerald-400/50' : 'border-[#86b583]',
        luckyText: isDark ? 'text-emerald-200' : 'text-[#386b49]',
        iconColor: isDark ? '#34d399' : '#16a34a',
      };

    case 'mocha':
      return {
        memoText: isDark ? 'text-amber-300' : 'text-[#7e563b]',
        dashedLine: isDark ? 'border-amber-400/40' : 'border-[#d4b996]/70',
        cardBg: isDark ? 'bg-amber-950/40 backdrop-blur-md' : 'bg-[#fdf9f4]/85 backdrop-blur-md',
        cardBorder: isDark ? 'border-amber-400/30' : 'border-[#e6ccb2]',
        appleBoxBg: isDark ? 'bg-amber-900/50' : 'bg-white/90',
        appleBoxBorder: isDark ? 'border-amber-500/40' : 'border-[#e6ccb2]',
        barTop: isDark ? 'bg-amber-400/50' : 'bg-[#ddb892]/80',
        barBottom: isDark ? 'bg-amber-400/35' : 'bg-[#ddb892]/55',
        luckyBg: isDark ? 'bg-amber-900/60' : 'bg-white',
        luckyBorder: isDark ? 'border-amber-400/50' : 'border-[#b08968]',
        luckyText: isDark ? 'text-amber-200' : 'text-[#7e563b]',
        iconColor: isDark ? '#fbbf24' : '#d97706',
      };

    case 'lululemon':
      return {
        memoText: isDark ? 'text-rose-300' : 'text-[#84334b]',
        dashedLine: isDark ? 'border-rose-400/40' : 'border-[#d4a3af]/70',
        cardBg: isDark ? 'bg-rose-950/40 backdrop-blur-md' : 'bg-[#faf2f4]/85 backdrop-blur-md',
        cardBorder: isDark ? 'border-rose-400/30' : 'border-[#e4d7db]',
        appleBoxBg: isDark ? 'bg-rose-900/50' : 'bg-white/90',
        appleBoxBorder: isDark ? 'border-rose-500/40' : 'border-[#e4d7db]',
        barTop: isDark ? 'bg-rose-400/50' : 'bg-[#d8a8b5]/80',
        barBottom: isDark ? 'bg-rose-400/35' : 'bg-[#d8a8b5]/55',
        luckyBg: isDark ? 'bg-rose-900/60' : 'bg-white',
        luckyBorder: isDark ? 'border-rose-400/50' : 'border-[#a64462]',
        luckyText: isDark ? 'text-rose-200' : 'text-[#84334b]',
        iconColor: isDark ? '#fb7185' : '#ba3859',
      };

    case 'amethyst-haze':
    case 'cosmic':
      return {
        memoText: isDark ? 'text-purple-300' : 'text-[#6c4091]',
        dashedLine: isDark ? 'border-purple-400/40' : 'border-[#d2beec]/70',
        cardBg: isDark ? 'bg-purple-950/40 backdrop-blur-md' : 'bg-[#f8f3fe]/85 backdrop-blur-md',
        cardBorder: isDark ? 'border-purple-400/30' : 'border-[#d9c4f4]',
        appleBoxBg: isDark ? 'bg-purple-900/50' : 'bg-white/90',
        appleBoxBorder: isDark ? 'border-purple-500/40' : 'border-[#d9c4f4]',
        barTop: isDark ? 'bg-purple-400/50' : 'bg-[#c3a4e9]/80',
        barBottom: isDark ? 'bg-purple-400/35' : 'bg-[#c3a4e9]/55',
        luckyBg: isDark ? 'bg-purple-900/60' : 'bg-white',
        luckyBorder: isDark ? 'border-purple-400/50' : 'border-[#9c78cb]',
        luckyText: isDark ? 'text-purple-200' : 'text-[#6c4091]',
        iconColor: isDark ? '#c084fc' : '#9333ea',
      };

    case 'notebook':
    default:
      return {
        memoText: isDark ? 'text-zinc-300' : 'text-[#3f3f46]',
        dashedLine: isDark ? 'border-zinc-500/40' : 'border-zinc-300/80',
        cardBg: isDark ? 'bg-zinc-900/40 backdrop-blur-md' : 'bg-white/85 backdrop-blur-md',
        cardBorder: isDark ? 'border-zinc-600/40' : 'border-zinc-300/80',
        appleBoxBg: isDark ? 'bg-zinc-800/80' : 'bg-zinc-50',
        appleBoxBorder: isDark ? 'border-zinc-600' : 'border-zinc-300',
        barTop: isDark ? 'bg-zinc-500/60' : 'bg-zinc-300',
        barBottom: isDark ? 'bg-zinc-500/40' : 'bg-zinc-300/60',
        luckyBg: isDark ? 'bg-zinc-800' : 'bg-white',
        luckyBorder: isDark ? 'border-zinc-500' : 'border-zinc-400',
        luckyText: isDark ? 'text-zinc-200' : 'text-zinc-800',
        iconColor: isDark ? '#a1a1aa' : '#52525b',
      };
  }
};

// =========================================================================
// 3. COMPONENT BÌA SỔ CHÍNH (NOTEBOOK COVER CONTAINER)
// =========================================================================
export interface CielEtoileNotebookCoverProps {
  theme?: string;
  isDark?: boolean;
  novel?: {
    id: string;
    title: string;
    author: { name: string } | string;
    genres?: string[];
    coverImage?: string;
    totalChaptersCount?: number;
    chapters?: any[];
  };
  onOpenNotebook: () => void;
}

export const CielEtoileNotebookCover: React.FC<CielEtoileNotebookCoverProps> = ({
  theme = 'slate-haze',
  isDark = false,
  novel,
  onOpenNotebook,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [clipWiggle, setClipWiggle] = useState({ c1: -3, c2: 4 });
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const t = getNotebookCoverTheme(theme, isDark);
  const memoTheme = getCoverMemoTheme(theme, isDark);

  const authorName = typeof novel?.author === 'string'
    ? novel.author
    : novel?.author?.name || 'Jouriee65';

  const totalChapters = novel?.totalChaptersCount || novel?.chapters?.length || 10;

  // Hiệu ứng tia sao khi chạm vào bìa
  const handleCoverClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newSparkle = { id: Date.now(), x, y };
    setSparkles((prev) => [...prev.slice(-8), newSparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 1000);
  };

  const handleUnlockAndOpen = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    cosmicAudio.playPageFlip?.();
    setIsOpening(true);
    // Mở ngay tức thì, loại bỏ độ trễ gây cảm giác lag
    onOpenNotebook();
  };

  const claymorphismBtnClass = isDark
    ? 'shadow-[0_6px_16px_rgba(0,0,0,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.25),inset_0_-2px_3px_rgba(0,0,0,0.4)]'
    : 'shadow-[0_6px_14px_rgba(0,0,0,0.08),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.05)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[560px] md:max-w-[680px] lg:max-w-[820px] xl:max-w-[880px] mx-auto select-none my-4 sm:my-8"
      onClick={handleCoverClick}
    >
      {/* -------------------------------------------------------------
          2.1 HAI KẸP GIẤY KIM LOẠI MẠ BẠC (Đặt nhô ra ngoài bìa, không bị cắt đầu)
          ------------------------------------------------------------- */}
      <div className="absolute -top-3.5 sm:-top-4.5 left-13 xs:left-15 sm:left-20 z-40 flex items-start gap-1.5 sm:gap-2.5 pointer-events-auto">
        <MetallicPaperclip
          id="clip1"
          scale={0.92}
          rotation={clipWiggle.c1}
          onClick={() => {
            cosmicAudio.playTap?.();
            setClipWiggle((p) => ({ ...p, c1: p.c1 === -3 ? 5 : -3 }));
          }}
        />
        <MetallicPaperclip
          id="clip2"
          scale={0.84}
          rotation={clipWiggle.c2}
          className="mt-1"
          onClick={() => {
            cosmicAudio.playTap?.();
            setClipWiggle((p) => ({ ...p, c2: p.c2 === 4 ? -4 : 4 }));
          }}
        />
      </div>

      {/* -------------------------------------------------------------
          2.2 TẬP RUỘT GIẤY TRẮNG NHIỀU LỚP DƯỚI BÌA (Tạo chiều sâu gáy sách)
          ------------------------------------------------------------- */}
      <div
        aria-hidden="true"
        className="absolute top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 left-2 xs:left-3 sm:left-4 right-[-4px] sm:right-[-6px] pointer-events-none rounded-l-sm rounded-r-md sm:rounded-r-lg z-0"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: t.sheetShadow,
        }}
      />

      {/* -------------------------------------------------------------
          2.3 KHUNG BÌA SỔ CHÍNH (Chiều dài trên máy tính dài hơn thanh thoát, điện thoại giữ nguyên)
          ------------------------------------------------------------- */}
      <div
        className={`relative z-10 w-full rounded-xl xs:rounded-2xl sm:rounded-[22px] transition-all duration-500 overflow-hidden flex flex-row backdrop-blur-2xl border-[1.5px] ${t.coverBg} ${t.coverBorder} ${t.coverShadow} min-h-[380px] sm:min-h-[420px] md:min-h-[clamp(540px,76vh,720px)] lg:min-h-[clamp(620px,82vh,800px)] xl:min-h-[clamp(660px,86vh,860px)]`}
      >
        {/* Viền giấy trắng lót bên trong bìa */}
        <div
          aria-hidden="true"
          className="absolute top-2 sm:top-2.5 bottom-2 sm:bottom-2.5 left-2 xs:left-3 sm:left-4 right-2 sm:right-2.5 pointer-events-none rounded-l-sm rounded-r-md sm:rounded-r-lg bg-white/40 dark:bg-white/10 border border-white/45 dark:border-white/10 z-0"
        />

        {/* Vệt sáng lướt chéo qua mặt kính bìa */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent pointer-events-none z-1" />

        {/* -----------------------------------------------------------
            2.4 GÁY SỔ BÊN TRÁI: KÍNH TRẮNG TRONG SUỐT VỚI 7 LỖ CÒNG DẸT RỘNG
            ----------------------------------------------------------- */}
        <div
          className={`w-12 xs:w-14 sm:w-20 shrink-0 relative flex flex-col items-center justify-between py-8 xs:py-10 sm:py-14 md:py-18 lg:py-24 select-none z-10 backdrop-blur-md transition-colors border-r ${t.spineBg} ${t.spineBorder} ${t.spineShadow}`}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`w-6 xs:w-7 sm:w-9 h-2.5 xs:h-3 sm:h-3.5 rounded-full border shadow-inner transition-all flex items-center justify-center ${t.ringSlotBg} ${t.ringSlotBorder} ${t.ringSlotShadow}`}
            >
              <div className="w-full h-[1px] bg-white/40 rounded-full" />
            </div>
          ))}
        </div>

        {/* -----------------------------------------------------------
            2.5 NỘI DUNG MẶT BÌA SỔ
            ----------------------------------------------------------- */}
        <div className="flex-1 p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between relative z-10">
          
          {/* Header Bìa: Nhãn Studio Archive & Số No. sang bên phải theo yêu cầu */}
          <div className="flex items-start justify-between gap-2 border-b border-white/30 pb-3 sm:pb-4">
            <div className="flex items-center gap-1.5 opacity-70">
              <Star className="w-3.5 h-3.5 fill-current opacity-80" />
              <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase">EDITION</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono opacity-60">
                NO. 065
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase border backdrop-blur-md shadow-xs ${t.badgeBg} ${t.badgeBorder} ${t.badgeText}`}>
                STUDIO ARCHIVE
              </span>
            </div>
          </div>

          {/* Khung Trung Tâm Bìa Sổ: NIÊN THỜI, Tên truyện & Tác giả & Nút mở sổ dịu nhẹ căn giữa */}
          <div className="my-auto py-4 sm:py-6 md:py-8 lg:py-12 flex flex-col items-center text-center space-y-2.5 sm:space-y-3.5 md:space-y-5">
            {/* Nhãn NIÊN THỜI (bỏ icon lấp lánh theo yêu cầu) */}
            <div className="inline-flex items-center px-3.5 py-0.5 rounded-full bg-white/45 border border-white/55 backdrop-blur-md shadow-xs">
              <span className="text-[9.5px] xs:text-[10.5px] sm:text-[11px] font-mono font-semibold tracking-[0.25em] uppercase text-slate-700">
                NIÊN THỜI
              </span>
            </div>

            {/* Tiêu đề truyện kích thước vừa vặn, nhỏ lại thanh thoát */}
            <h1 className={`font-serif text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-snug sm:leading-snug ${t.titleColor} drop-shadow-xs max-w-md px-2`}>
              {novel?.title || 'Dạ Khúc Bạch Hợp'}
            </h1>

            {/* Tác giả & Người Edit (kích thước nhỏ lại theo yêu cầu) */}
            <div className="space-y-0.5 sm:space-y-1">
              <p className={`font-serif italic text-[11px] xs:text-xs sm:text-sm ${t.subtextColor}`}>
                Tác giả: <span className="font-semibold">{authorName}</span>
              </p>
              <p className="text-[9.5px] xs:text-[10px] sm:text-[11px] font-mono opacity-65">
                Người Edit: Jouriee65 · Hoàn thành ({totalChapters} chương)
              </p>
            </div>

            {/* Nút mở sổ tay: Hiệu ứng claymorphism nhẹ, đặt sau tên tác giả & căn giữa */}
            <div className="pt-2 sm:pt-3 flex items-center justify-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleUnlockAndOpen}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-2 cursor-pointer font-sans text-xs sm:text-[13px] font-semibold transition-all duration-200 select-none ${t.lockBg} ${claymorphismBtnClass}`}
                title="Nhấn để mở cuốn sổ"
              >
                <span>{isOpening ? 'Đang mở...' : 'Mở sổ tay'}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-65 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </div>

            {/* Dấu chấm hoa văn mỏng trang nhã */}
            <div className="pt-1 flex items-center justify-center gap-2 text-xs opacity-40">
              <span className="w-6 sm:w-10 h-[1px] bg-current" />
              <span className="text-[9px] tracking-widest font-mono">✦ ✦ ✦</span>
              <span className="w-6 sm:w-10 h-[1px] bg-current" />
            </div>
          </div>

          {/* -----------------------------------------------------------
              2.6 PHẦN MEMO & MORE NẰM DƯỚI CÙNG TRONG BÌA SỔ (THEO ẢNH MẪU ĐÍNH KÈM)
              ----------------------------------------------------------- */}
          <div className="pt-3 sm:pt-4 border-t border-white/30 flex flex-col gap-2.5 sm:gap-3 select-none">
            {/* 1. Phần MEMO : và các đường kẻ đứt đoạn */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] sm:text-[11.5px] font-mono font-black tracking-widest ${memoTheme.memoText}`}>
                  MEMO :
                </span>
                <div className={`flex-1 border-b border-dashed ${memoTheme.dashedLine}`} />
              </div>
              <div className={`w-full border-b border-dashed ${memoTheme.dashedLine}`} />
              <div className={`w-full border-b border-dashed ${memoTheme.dashedLine}`} />
              <div className={`w-full border-b border-dashed ${memoTheme.dashedLine}`} />
            </div>

            {/* 2. Khung thẻ MORE dưới cùng */}
            <div className={`w-full rounded-2xl sm:rounded-[1.4rem] border p-2 sm:p-2.5 flex items-center justify-between gap-2.5 sm:gap-3 transition-colors ${memoTheme.cardBg} ${memoTheme.cardBorder}`}>
              {/* Bên trái: Hộp vuông bo tròn chứa icon cuốn sổ mở (chỉ dùng SVG, không lấp lánh, không động vật) */}
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs ${memoTheme.appleBoxBg} ${memoTheme.appleBoxBorder}`}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
                  <path
                    d="M3 5.5C3 4.67 3.67 4 4.5 4H10C11.1 4 12 4.9 12 6V19.5C12 18.67 11.33 18 10.5 18H4.5C3.67 18 3 18.67 3 19.5V5.5Z"
                    stroke={memoTheme.iconColor}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 5.5C21 4.67 20.33 4 19.5 4H14C12.9 4 12 4.9 12 6V19.5C12 18.67 12.67 18 13.5 18H19.5C20.33 18 21 18.67 21 19.5V5.5Z"
                    stroke={memoTheme.iconColor}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 8H9"
                    stroke={memoTheme.iconColor}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 8H18"
                    stroke={memoTheme.iconColor}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 12H9"
                    stroke={memoTheme.iconColor}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 12H18"
                    stroke={memoTheme.iconColor}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Ở giữa: 2 thanh placeholder tròn bo viền */}
              <div className="flex-1 space-y-1.5 min-w-0 pr-1">
                <div className={`h-2 sm:h-2.5 w-[75%] max-w-[190px] rounded-full ${memoTheme.barTop}`} />
                <div className={`h-2 sm:h-2.5 w-[45%] max-w-[115px] rounded-full ${memoTheme.barBottom}`} />
              </div>

              {/* Bên phải: Nút / Huy hiệu MORE với icon dấu trang ribbon SVG thanh lịch */}
              <div className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border flex items-center gap-1.5 shrink-0 shadow-2xs select-none ${memoTheme.luckyBg} ${memoTheme.luckyBorder}`}>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none">
                  <path
                    d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z"
                    stroke={memoTheme.iconColor}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={`text-[10px] sm:text-xs font-mono font-bold tracking-wider ${memoTheme.luckyText}`}>
                  MORE
                </span>
              </div>
            </div>
          </div>

          {/* Tia sao tương tác khi chạm vào mặt kính */}
          {sparkles.map((sp) => (
            <motion.div
              key={sp.id}
              initial={{ scale: 0, opacity: 1, y: 0 }}
              animate={{ scale: [0, 1.4, 0], opacity: [1, 0.8, 0], y: -24 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="absolute pointer-events-none select-none text-base"
              style={{ left: sp.x, top: sp.y, color: t.sparkleColor }}
            >
              ✦
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
