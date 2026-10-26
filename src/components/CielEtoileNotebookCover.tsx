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
    setTimeout(() => {
      onOpenNotebook();
    }, 380);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.96,
        rotateY: -35,
        x: -40,
        transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[560px] md:max-w-[680px] lg:max-w-[820px] xl:max-w-[880px] mx-auto select-none my-4 sm:my-8 perspective-[1200px]"
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
          2.3 KHUNG BÌA SỔ CHÍNH (Chiều dài trên máy tính lớn hơn, dáng sổ dài thanh thoát)
          ------------------------------------------------------------- */}
      <div
        className={`relative z-10 w-full rounded-xl xs:rounded-2xl sm:rounded-[22px] transition-all duration-500 overflow-hidden flex flex-row backdrop-blur-2xl border-[1.5px] ${t.coverBg} ${t.coverBorder} ${t.coverShadow} min-h-[380px] sm:min-h-[420px] md:min-h-[clamp(460px,72vh,640px)]`}
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
          className={`w-12 xs:w-14 sm:w-20 shrink-0 relative flex flex-col items-center justify-between py-8 xs:py-10 sm:py-14 select-none z-10 backdrop-blur-md transition-colors border-r ${t.spineBg} ${t.spineBorder} ${t.spineShadow}`}
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
        <div className="flex-1 p-4 xs:p-6 sm:p-8 md:p-10 flex flex-col justify-between relative z-10">
          
          {/* Header Bìa: Nhãn Studio Archive & Ký hiệu ngôi sao */}
          <div className="flex items-start justify-between gap-2 border-b border-white/30 pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase border backdrop-blur-md shadow-xs ${t.badgeBg} ${t.badgeBorder} ${t.badgeText}`}>
                STUDIO ARCHIVE
              </span>
              <span className="text-[10px] sm:text-xs font-mono opacity-60">
                NO. 065
              </span>
            </div>

            <div className="flex items-center gap-1 opacity-70">
              <Star className="w-3.5 h-3.5 fill-current opacity-80" />
              <span className="text-[10px] font-mono tracking-widest">EDITION</span>
            </div>
          </div>

          {/* Khung Trung Tâm Bìa Sổ: NIÊN THỜI, Tên truyện & Tác giả & Nút mở sổ dịu nhẹ căn giữa */}
          <div className="my-auto py-4 sm:py-6 flex flex-col items-center text-center space-y-2.5 sm:space-y-3.5">
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

            {/* Nút mở sổ tay: Màu sắc nhẹ nhàng, dịu lại, bỏ icon ổ khóa, đặt sau tên tác giả & căn giữa, kích thước nhỏ lại */}
            <div className="pt-2 sm:pt-3 flex items-center justify-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleUnlockAndOpen}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 cursor-pointer font-sans text-xs sm:text-[13px] font-medium transition-all duration-200 select-none shadow-xs backdrop-blur-md ${t.lockBg} ${t.lockGlow}`}
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

          {/* Chân Trang Bìa */}
          <div className="pt-3 border-t border-white/30 flex items-center justify-between text-[10px] sm:text-[11px] font-mono opacity-70">
            <span>TRANG THÔNG TIN TRUYỆN</span>
            <span className="hidden xs:inline">ARCHIVE // NIÊN THỜI</span>
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
