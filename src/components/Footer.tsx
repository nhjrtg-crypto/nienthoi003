import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cherry, BookHeart, Cat, RotateCw } from 'lucide-react';
import { getGlobalViews, subscribeGlobalViews, incrementGlobalView, fetchGlobalViews } from '../services/d1Service';

// =========================================================================
// 1. FORMAT SỐ HIỂN THỊ (Phân tách hàng nghìn bằng dấu chấm, ví dụ: 128.504)
// =========================================================================
export function formatViewCount(count: number): string {
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// =========================================================================
// THEME PALETTE INTERFACE & MAPPINGS (Đồng bộ cả 5 Theme & Sáng / Tối)
// =========================================================================
interface TicketThemeStyles {
  // Ticket container
  containerBg: string;
  containerBorder: string;
  containerRing: string;
  containerShadow: string;
  frostedOverlay: string;
  reflectGradient: string;
  dashedBorder: string;
  tearLine: string;

  // Barcode
  barcodeBoxBg: string;
  barcodeBoxBorder: string;
  barcodeBars: string;
  barcodeText: string;

  // Views button
  reelsBtnBg: string;
  reelsBtnBorder: string;
  reelsBtnHoverShadow: string;
  viewsBadgeBg: string;
  viewsBadgeBorder: string;
  viewsBadgeText: string;
  reelsTrayBg: string;
  reelsTrayBorder: string;

  // Solari Split Flap Digit Card
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  cardTopBg: string;
  cardBottomBg: string;
  cardBorderMid: string;
  cardText: string;
  separatorStarFill: string;
  sparkleColor: string;
  splitLine: string;

  // Right action buttons
  btnBg: string;
  btnHoverBg: string;
  btnBorder: string;
  btnText: string;
  catIcon: string;
  catIconHover: string;
  cherryIcon: string;
  cherryIconHover: string;
  bookIcon: string;
  bookIconHover: string;

  // Copyright text
  copyrightText: string;
}

export function getTicketTheme(theme: string = 'amethyst-haze', isDarkMode: boolean = false): TicketThemeStyles {
  switch (theme) {
    case 'sage':
      return isDarkMode
        ? {
            containerBg: 'bg-gradient-to-r from-[#122316]/85 via-[#0d1a10]/85 to-[#101f14]/85',
            containerBorder: 'border-white/10',
            containerRing: 'ring-[#294a2f]/70',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(0,0,0,0.7),inset_0_-3px_10px_rgba(77,111,83,0.25)]',
            frostedOverlay: 'bg-[#0c1810]/55',
            reflectGradient: 'from-white/10 to-transparent',
            dashedBorder: 'border-[#294a2f]/70',
            tearLine: 'border-[#294a2f]/70',
            barcodeBoxBg: 'bg-[#132217]',
            barcodeBoxBorder: 'border-[#294a2f]',
            barcodeBars: 'bg-[#cfe0d1]',
            barcodeText: 'text-[#cfe0d1]',
            reelsBtnBg: 'bg-gradient-to-b from-[#182a1d] via-[#122016] to-[#0b150e]',
            reelsBtnBorder: 'border-[#2e5235]',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_18px_rgba(77,111,83,0.25)]',
            viewsBadgeBg: 'bg-[#142318]',
            viewsBadgeBorder: 'border-[#2e5235]',
            viewsBadgeText: 'text-[#8cb391]',
            reelsTrayBg: 'bg-[#0e1910]',
            reelsTrayBorder: 'border-[#223626]',
            cardBg: 'bg-[#132217]',
            cardBorder: 'border-[#314c36]/50',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.4)]',
            cardTopBg: 'bg-gradient-to-b from-[#1c3021] to-[#142419]',
            cardBottomBg: 'bg-gradient-to-b from-[#111e14] to-[#0a130d]',
            cardBorderMid: 'border-white/5',
            cardText: 'text-[#e0ede2]',
            separatorStarFill: 'fill-[#8cb391] text-[#8cb391]',
            sparkleColor: 'fill-[#8cb391] text-[#8cb391]',
            splitLine: 'bg-white/10',
            btnBg: 'bg-[#132217]',
            btnHoverBg: 'hover:bg-[#1a2d1f]',
            btnBorder: 'border-[#294a2f]',
            btnText: 'text-[#d7e6d9]',
            catIcon: 'text-[#8cb391]',
            catIconHover: 'group-hover:text-[#bde0c2]',
            cherryIcon: 'text-[#8cb391]',
            cherryIconHover: 'group-hover:text-[#bde0c2]',
            bookIcon: 'text-[#8cb391]',
            bookIconHover: 'group-hover:text-[#bde0c2]',
            copyrightText: 'text-[#cfe0d1]/60',
          }
        : {
            containerBg: 'bg-gradient-to-r from-emerald-100/70 via-white/85 to-teal-100/70',
            containerBorder: 'border-white/80',
            containerRing: 'ring-[#c2dfc6]/75',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(77,111,83,0.2),inset_0_-4px_12px_rgba(130,175,135,0.2)]',
            frostedOverlay: 'bg-white/40',
            reflectGradient: 'from-white/40 to-transparent',
            dashedBorder: 'border-[#b8d9bd]/80',
            tearLine: 'border-[#b8d9bd]/80',
            barcodeBoxBg: 'bg-white/95',
            barcodeBoxBorder: 'border-[#c2dfc6]',
            barcodeBars: 'bg-[#244b27]',
            barcodeText: 'text-[#244b27]',
            reelsBtnBg: 'bg-gradient-to-b from-[#f2f7f3] via-[#e2eee3] to-[#c5dfc7]',
            reelsBtnBorder: 'border-[#b8d9bd]',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_18px_rgba(88,129,87,0.3)]',
            viewsBadgeBg: 'bg-[#f0f7f1]',
            viewsBadgeBorder: 'border-[#8cb391]/60',
            viewsBadgeText: 'text-[#2e6834]',
            reelsTrayBg: 'bg-[#f6faf7]',
            reelsTrayBorder: 'border-[#c2dfc6]',
            cardBg: 'bg-[#f2f8f3]',
            cardBorder: 'border-[#8cb391]/35',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(88,129,87,0.12)]',
            cardTopBg: 'bg-gradient-to-b from-[#ffffff] to-[#e8f2e9]',
            cardBottomBg: 'bg-gradient-to-b from-[#dbeade] to-[#c8decb]',
            cardBorderMid: 'border-[#8cb391]/20',
            cardText: 'text-[#1e4622]',
            separatorStarFill: 'fill-[#2e6834] text-[#2e6834]',
            sparkleColor: 'fill-[#2e6834] text-[#2e6834]',
            splitLine: 'bg-[#4d6f53]/20',
            btnBg: 'bg-white/95',
            btnHoverBg: 'hover:bg-[#f0f7f1]',
            btnBorder: 'border-[#c2dfc6]',
            btnText: 'text-[#244b27]',
            catIcon: 'text-[#3e7e45]',
            catIconHover: 'group-hover:text-[#25572b]',
            cherryIcon: 'text-[#3e7e45]',
            cherryIconHover: 'group-hover:text-[#1e4622]',
            bookIcon: 'text-[#3e7e45]',
            bookIconHover: 'group-hover:text-[#25572b]',
            copyrightText: 'text-[#244b27]/70',
          };

    case 'mocha':
      return isDarkMode
        ? {
            containerBg: 'bg-gradient-to-r from-[#261b15]/85 via-[#1c130f]/85 to-[#221711]/85',
            containerBorder: 'border-white/10',
            containerRing: 'ring-[#4a3529]/70',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(0,0,0,0.7),inset_0_-3px_10px_rgba(163,119,100,0.22)]',
            frostedOverlay: 'bg-[#1a110c]/55',
            reflectGradient: 'from-white/10 to-transparent',
            dashedBorder: 'border-[#4a3529]/70',
            tearLine: 'border-[#4a3529]/70',
            barcodeBoxBg: 'bg-[#221711]',
            barcodeBoxBorder: 'border-[#4a3529]',
            barcodeBars: 'bg-[#e8d8ce]',
            barcodeText: 'text-[#e8d8ce]',
            reelsBtnBg: 'bg-gradient-to-b from-[#2d2019] via-[#201611] to-[#160f0c]',
            reelsBtnBorder: 'border-[#523c2e]',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_18px_rgba(163,119,100,0.25)]',
            viewsBadgeBg: 'bg-[#221611]',
            viewsBadgeBorder: 'border-[#523c2e]',
            viewsBadgeText: 'text-[#cbb3a3]',
            reelsTrayBg: 'bg-[#19120e]',
            reelsTrayBorder: 'border-[#362821]',
            cardBg: 'bg-[#241a15]',
            cardBorder: 'border-[#4a3930]/50',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.4)]',
            cardTopBg: 'bg-gradient-to-b from-[#33241c] to-[#251a14]',
            cardBottomBg: 'bg-gradient-to-b from-[#1f1510] to-[#140e0a]',
            cardBorderMid: 'border-white/5',
            cardText: 'text-[#f2e6dc]',
            separatorStarFill: 'fill-[#c49f8f] text-[#c49f8f]',
            sparkleColor: 'fill-[#c49f8f] text-[#c49f8f]',
            splitLine: 'bg-white/10',
            btnBg: 'bg-[#221711]',
            btnHoverBg: 'hover:bg-[#2e1f18]',
            btnBorder: 'border-[#4a3529]',
            btnText: 'text-[#e8d8ce]',
            catIcon: 'text-[#c49f8f]',
            catIconHover: 'group-hover:text-[#decbc0]',
            cherryIcon: 'text-[#c49f8f]',
            cherryIconHover: 'group-hover:text-[#decbc0]',
            bookIcon: 'text-[#c49f8f]',
            bookIconHover: 'group-hover:text-[#decbc0]',
            copyrightText: 'text-[#e8d8ce]/60',
          }
        : {
            containerBg: 'bg-gradient-to-r from-amber-100/70 via-white/85 to-stone-100/75',
            containerBorder: 'border-white/80',
            containerRing: 'ring-[#e4d4ca]/80',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(163,119,100,0.22),inset_0_-4px_12px_rgba(196,159,143,0.22)]',
            frostedOverlay: 'bg-white/40',
            reflectGradient: 'from-white/40 to-transparent',
            dashedBorder: 'border-[#ddccbf]/80',
            tearLine: 'border-[#ddccbf]/80',
            barcodeBoxBg: 'bg-white/95',
            barcodeBoxBorder: 'border-[#e4d4ca]',
            barcodeBars: 'bg-[#5c4033]',
            barcodeText: 'text-[#5c4033]',
            reelsBtnBg: 'bg-gradient-to-b from-[#faf6f2] via-[#f0e6dd] to-[#d8c3b4]',
            reelsBtnBorder: 'border-[#dfcec2]',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_18px_rgba(163,119,100,0.3)]',
            viewsBadgeBg: 'bg-[#f7f1eb]',
            viewsBadgeBorder: 'border-[#b09180]/60',
            viewsBadgeText: 'text-[#7c5440]',
            reelsTrayBg: 'bg-[#faf7f5]',
            reelsTrayBorder: 'border-[#e4d4ca]',
            cardBg: 'bg-[#f8f3ee]',
            cardBorder: 'border-[#c49f8f]/40',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(163,119,100,0.12)]',
            cardTopBg: 'bg-gradient-to-b from-[#ffffff] to-[#f4ebe3]',
            cardBottomBg: 'bg-gradient-to-b from-[#ebdacf] to-[#ddc7b9]',
            cardBorderMid: 'border-[#b09180]/20',
            cardText: 'text-[#4a3328]',
            separatorStarFill: 'fill-[#8c6046] text-[#8c6046]',
            sparkleColor: 'fill-[#8c6046] text-[#8c6046]',
            splitLine: 'bg-[#7d6152]/20',
            btnBg: 'bg-white/95',
            btnHoverBg: 'hover:bg-[#f6efe9]',
            btnBorder: 'border-[#e4d4ca]',
            btnText: 'text-[#553c30]',
            catIcon: 'text-[#966750]',
            catIconHover: 'group-hover:text-[#6a4837]',
            cherryIcon: 'text-[#966750]',
            cherryIconHover: 'group-hover:text-[#6a4837]',
            bookIcon: 'text-[#966750]',
            bookIconHover: 'group-hover:text-[#6a4837]',
            copyrightText: 'text-[#5c4033]/70',
          };

    case 'notebook':
      return isDarkMode
        ? {
            containerBg: 'bg-gradient-to-r from-[#201d18]/85 via-[#171512]/85 to-[#1c1915]/85',
            containerBorder: 'border-white/10',
            containerRing: 'ring-[#423c32]/70',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(0,0,0,0.7),inset_0_-3px_10px_rgba(184,178,165,0.2)]',
            frostedOverlay: 'bg-[#151310]/55',
            reflectGradient: 'from-white/10 to-transparent',
            dashedBorder: 'border-[#423c32]/70',
            tearLine: 'border-[#423c32]/70',
            barcodeBoxBg: 'bg-[#1f1b17]',
            barcodeBoxBorder: 'border-[#423c32]',
            barcodeBars: 'bg-[#e2dbce]',
            barcodeText: 'text-[#e2dbce]',
            reelsBtnBg: 'bg-gradient-to-b from-[#2b2620] via-[#1e1b17] to-[#141210]',
            reelsBtnBorder: 'border-[#474035]',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_18px_rgba(184,178,165,0.22)]',
            viewsBadgeBg: 'bg-[#221e19]',
            viewsBadgeBorder: 'border-[#474035]',
            viewsBadgeText: 'text-[#c9bead]',
            reelsTrayBg: 'bg-[#191612]',
            reelsTrayBorder: 'border-[#363026]',
            cardBg: 'bg-[#201c18]',
            cardBorder: 'border-[#474035]/50',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.4)]',
            cardTopBg: 'bg-gradient-to-b from-[#2d2822] to-[#211d18]',
            cardBottomBg: 'bg-gradient-to-b from-[#1c1814] to-[#13110e]',
            cardBorderMid: 'border-white/5',
            cardText: 'text-[#f2ece2]',
            separatorStarFill: 'fill-[#b8b2a5] text-[#b8b2a5]',
            sparkleColor: 'fill-[#b8b2a5] text-[#b8b2a5]',
            splitLine: 'bg-white/10',
            btnBg: 'bg-[#1f1b17]',
            btnHoverBg: 'hover:bg-[#2b2620]',
            btnBorder: 'border-[#423c32]',
            btnText: 'text-[#e2dbce]',
            catIcon: 'text-[#b8b2a5]',
            catIconHover: 'group-hover:text-[#f2ece2]',
            cherryIcon: 'text-[#b8b2a5]',
            cherryIconHover: 'group-hover:text-[#f2ece2]',
            bookIcon: 'text-[#b8b2a5]',
            bookIconHover: 'group-hover:text-[#f2ece2]',
            copyrightText: 'text-[#e2dbce]/60',
          }
        : {
            containerBg: 'bg-white/90',
            containerBorder: 'border-neutral-200',
            containerRing: 'ring-neutral-200/80',
            containerShadow: 'shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)]',
            frostedOverlay: 'bg-white/40',
            reflectGradient: 'from-white/40 to-transparent',
            dashedBorder: 'border-neutral-200',
            tearLine: 'border-neutral-200',
            barcodeBoxBg: 'bg-white',
            barcodeBoxBorder: 'border-neutral-200',
            barcodeBars: 'bg-neutral-800',
            barcodeText: 'text-neutral-800',
            reelsBtnBg: 'bg-gradient-to-b from-white via-neutral-50 to-neutral-200',
            reelsBtnBorder: 'border-neutral-300',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_18px_rgba(0,0,0,0.12)]',
            viewsBadgeBg: 'bg-white',
            viewsBadgeBorder: 'border-neutral-300',
            viewsBadgeText: 'text-neutral-800',
            reelsTrayBg: 'bg-neutral-50',
            reelsTrayBorder: 'border-neutral-200',
            cardBg: 'bg-white',
            cardBorder: 'border-neutral-200',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]',
            cardTopBg: 'bg-gradient-to-b from-white to-neutral-50',
            cardBottomBg: 'bg-gradient-to-b from-neutral-100 to-neutral-200',
            cardBorderMid: 'border-neutral-200',
            cardText: 'text-neutral-800',
            separatorStarFill: 'fill-neutral-700 text-neutral-700',
            sparkleColor: 'fill-neutral-600 text-neutral-600',
            splitLine: 'bg-neutral-300',
            btnBg: 'bg-white',
            btnHoverBg: 'hover:bg-neutral-50',
            btnBorder: 'border-neutral-300',
            btnText: 'text-neutral-800',
            catIcon: 'text-neutral-600',
            catIconHover: 'group-hover:text-neutral-900',
            cherryIcon: 'text-neutral-600',
            cherryIconHover: 'group-hover:text-neutral-900',
            bookIcon: 'text-neutral-600',
            bookIconHover: 'group-hover:text-neutral-900',
            copyrightText: 'text-neutral-600',
          };

    case 'slate-haze':
      return isDarkMode
        ? {
            containerBg: 'bg-gradient-to-r from-[#101924]/85 via-[#0b121c]/85 to-[#0e1621]/85',
            containerBorder: 'border-white/10',
            containerRing: 'ring-[#22364c]/70',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(0,0,0,0.7),inset_0_-3px_10px_rgba(86,122,156,0.22)]',
            frostedOverlay: 'bg-[#09111b]/55',
            reflectGradient: 'from-white/10 to-transparent',
            dashedBorder: 'border-[#22364c]/70',
            tearLine: 'border-[#22364c]/70',
            barcodeBoxBg: 'bg-[#121e2c]',
            barcodeBoxBorder: 'border-[#22364c]',
            barcodeBars: 'bg-[#cbd5e1]',
            barcodeText: 'text-[#cbd5e1]',
            reelsBtnBg: 'bg-gradient-to-b from-[#162434] via-[#101b28] to-[#0a121d]',
            reelsBtnBorder: 'border-[#29425e]',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_18px_rgba(117,149,179,0.25)]',
            viewsBadgeBg: 'bg-[#121f2d]',
            viewsBadgeBorder: 'border-[#29425e]',
            viewsBadgeText: 'text-[#7ea9d1]',
            reelsTrayBg: 'bg-[#0d1622]',
            reelsTrayBorder: 'border-[#1d2f44]',
            cardBg: 'bg-[#142131]',
            cardBorder: 'border-[#29425e]/50',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.4)]',
            cardTopBg: 'bg-gradient-to-b from-[#1a2c40] to-[#122030]',
            cardBottomBg: 'bg-gradient-to-b from-[#0f1b29] to-[#09111b]',
            cardBorderMid: 'border-white/5',
            cardText: 'text-[#e2e8f0]',
            separatorStarFill: 'fill-[#7595b3] text-[#7595b3]',
            sparkleColor: 'fill-[#7595b3] text-[#7595b3]',
            splitLine: 'bg-white/10',
            btnBg: 'bg-[#121e2c]',
            btnHoverBg: 'hover:bg-[#1a2a3e]',
            btnBorder: 'border-[#22364c]',
            btnText: 'text-[#cbd5e1]',
            catIcon: 'text-[#7595b3]',
            catIconHover: 'group-hover:text-[#a0bfdc]',
            cherryIcon: 'text-[#7595b3]',
            cherryIconHover: 'group-hover:text-[#a0bfdc]',
            bookIcon: 'text-[#7595b3]',
            bookIconHover: 'group-hover:text-[#a0bfdc]',
            copyrightText: 'text-[#cbd5e1]/60',
          }
        : {
            containerBg: 'bg-gradient-to-r from-sky-100/70 via-white/85 to-slate-100/75',
            containerBorder: 'border-white/80',
            containerRing: 'ring-[#c9d7e6]/80',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(100,116,139,0.22),inset_0_-4px_12px_rgba(148,163,184,0.22)]',
            frostedOverlay: 'bg-white/40',
            reflectGradient: 'from-white/40 to-transparent',
            dashedBorder: 'border-[#bfd0e2]/80',
            tearLine: 'border-[#bfd0e2]/80',
            barcodeBoxBg: 'bg-white/95',
            barcodeBoxBorder: 'border-[#c9d7e6]',
            barcodeBars: 'bg-[#334155]',
            barcodeText: 'text-[#334155]',
            reelsBtnBg: 'bg-gradient-to-b from-[#f3f7fa] via-[#e2ebf4] to-[#c2d5e7]',
            reelsBtnBorder: 'border-[#cad8e7]',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_18px_rgba(37,99,235,0.3)]',
            viewsBadgeBg: 'bg-[#f0f6fc]',
            viewsBadgeBorder: 'border-[#93c5fd]/60',
            viewsBadgeText: 'text-[#2563eb]',
            reelsTrayBg: 'bg-[#f5f9fc]',
            reelsTrayBorder: 'border-[#cad8e7]',
            cardBg: 'bg-[#edf4fa]',
            cardBorder: 'border-[#93c5fd]/40',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(37,99,235,0.12)]',
            cardTopBg: 'bg-gradient-to-b from-[#ffffff] to-[#e8f1f8]',
            cardBottomBg: 'bg-gradient-to-b from-[#d7e6f3] to-[#c3d7e8]',
            cardBorderMid: 'border-[#93c5fd]/20',
            cardText: 'text-[#1e3a5f]',
            separatorStarFill: 'fill-[#2563eb] text-[#2563eb]',
            sparkleColor: 'fill-[#60a5fa] text-[#60a5fa]',
            splitLine: 'bg-[#3b82f6]/20',
            btnBg: 'bg-white/95',
            btnHoverBg: 'hover:bg-[#f1f6fb]',
            btnBorder: 'border-[#c9d7e6]',
            btnText: 'text-[#334155]',
            catIcon: 'text-[#60a5fa]',
            catIconHover: 'group-hover:text-[#3b82f6]',
            cherryIcon: 'text-[#60a5fa]',
            cherryIconHover: 'group-hover:text-[#3b82f6]',
            bookIcon: 'text-[#60a5fa]',
            bookIconHover: 'group-hover:text-[#3b82f6]',
            copyrightText: 'text-[#334155]/70',
          };

    case 'lululemon':
      return isDarkMode
        ? {
            containerBg: 'bg-gradient-to-r from-[#1c1115]/85 via-[#160d10]/85 to-[#1a0f13]/85',
            containerBorder: 'border-white/10',
            containerRing: 'ring-[#84334b]/60',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(0,0,0,0.7),inset_0_-3px_10px_rgba(132,51,75,0.22)]',
            frostedOverlay: 'bg-[#140b0e]/55',
            reflectGradient: 'from-white/10 to-transparent',
            dashedBorder: 'border-[#84334b]/60',
            tearLine: 'border-[#84334b]/60',
            barcodeBoxBg: 'bg-[#201217]',
            barcodeBoxBorder: 'border-[#84334b]/60',
            barcodeBars: 'bg-[#ead4d7]',
            barcodeText: 'text-[#ead4d7]',
            reelsBtnBg: 'bg-gradient-to-b from-[#2b171e] via-[#1f1116] to-[#160b0f]',
            reelsBtnBorder: 'border-[#84334b]/70',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_18px_rgba(166,68,98,0.28)]',
            viewsBadgeBg: 'bg-[#241318]',
            viewsBadgeBorder: 'border-[#ba3859]/50',
            viewsBadgeText: 'text-[#ead4d7]',
            reelsTrayBg: 'bg-[#170c10]',
            reelsTrayBorder: 'border-[#5e2233]',
            cardBg: 'bg-[#201217]',
            cardBorder: 'border-[#84334b]/50',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.45)]',
            cardTopBg: 'bg-gradient-to-b from-[#2e1820] to-[#211117]',
            cardBottomBg: 'bg-gradient-to-b from-[#1a0d12] to-[#12080c]',
            cardBorderMid: 'border-white/10',
            cardText: 'text-[#f4ebee]',
            separatorStarFill: 'fill-[#ba3859] text-[#ba3859]',
            sparkleColor: 'fill-[#ba3859] text-[#ba3859]',
            splitLine: 'bg-white/15',
            btnBg: 'bg-[#201217]',
            btnHoverBg: 'hover:bg-[#2e1820]',
            btnBorder: 'border-[#84334b]/60',
            btnText: 'text-[#f4ebee]',
            catIcon: 'text-[#ba3859]',
            catIconHover: 'group-hover:text-[#ead4d7]',
            cherryIcon: 'text-[#ba3859]',
            cherryIconHover: 'group-hover:text-[#ead4d7]',
            bookIcon: 'text-[#ba3859]',
            bookIconHover: 'group-hover:text-[#ead4d7]',
            copyrightText: 'text-[#ead4d7]/60',
          }
        : {
            containerBg: 'bg-gradient-to-r from-[#faeef1]/85 via-white/90 to-[#faedf0]/85',
            containerBorder: 'border-[#e4d7db]/80',
            containerRing: 'ring-[#e4d7db]/70',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(204,123,143,0.12),inset_0_-4px_12px_rgba(204,123,143,0.08)]',
            frostedOverlay: 'bg-white/40',
            reflectGradient: 'from-white/40 to-transparent',
            dashedBorder: 'border-[#d8c5ca]',
            tearLine: 'border-[#d8c5ca]',
            barcodeBoxBg: 'bg-white/95',
            barcodeBoxBorder: 'border-[#e4d7db]',
            barcodeBars: 'bg-[#cc7b8f]',
            barcodeText: 'text-[#cc7b8f]',
            reelsBtnBg: 'bg-gradient-to-b from-[#ffffff] via-[#fdf7f9] to-[#f9edf1]',
            reelsBtnBorder: 'border-[#ecd4db]',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_16px_rgba(204,123,143,0.14)]',
            viewsBadgeBg: 'bg-[#ffffff]',
            viewsBadgeBorder: 'border-[#ecd4db]',
            viewsBadgeText: 'text-[#cc7b8f]',
            reelsTrayBg: 'bg-[#ffffff]',
            reelsTrayBorder: 'border-[#f2dbe2]',
            cardBg: 'bg-[#fef9fa]',
            cardBorder: 'border-[#e4c9d2]/60',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(204,123,143,0.08)]',
            cardTopBg: 'bg-gradient-to-b from-[#ffffff] to-[#fdf4f7]',
            cardBottomBg: 'bg-gradient-to-b from-[#faedf1] to-[#f4e0e7]',
            cardBorderMid: 'border-[#e4c9d2]/40',
            cardText: 'text-[#382329]',
            separatorStarFill: 'fill-[#cc7b8f] text-[#cc7b8f]',
            sparkleColor: 'fill-[#cc7b8f] text-[#cc7b8f]',
            splitLine: 'bg-[#cc7b8f]/20',
            btnBg: 'bg-white/95',
            btnHoverBg: 'hover:bg-[#faf2f4]',
            btnBorder: 'border-[#e4d7db]',
            btnText: 'text-[#cc7b8f]',
            catIcon: 'text-[#cc7b8f]',
            catIconHover: 'group-hover:text-[#b86277]',
            cherryIcon: 'text-[#cc7b8f]',
            cherryIconHover: 'group-hover:text-[#b86277]',
            bookIcon: 'text-[#cc7b8f]',
            bookIconHover: 'group-hover:text-[#b86277]',
            copyrightText: 'text-[#cc7b8f]/85',
          };

    case 'amethyst-haze':
    case 'cosmic':
    default:
      return isDarkMode
        ? {
            containerBg: 'bg-gradient-to-r from-[#1d1330]/85 via-[#140b22]/85 to-[#1a102b]/85',
            containerBorder: 'border-white/10',
            containerRing: 'ring-[#6e5585]/60',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(0,0,0,0.7),inset_0_-3px_10px_rgba(168,85,247,0.22)]',
            frostedOverlay: 'bg-[#120a1f]/55',
            reflectGradient: 'from-white/10 to-transparent',
            dashedBorder: 'border-[#6e5585]/60',
            tearLine: 'border-[#6e5585]/60',
            barcodeBoxBg: 'bg-[#1f1433]',
            barcodeBoxBorder: 'border-[#6e5585]/60',
            barcodeBars: 'bg-[#e9d5ff]',
            barcodeText: 'text-[#e9d5ff]',
            reelsBtnBg: 'bg-gradient-to-b from-[#2a1b44] via-[#1d1230] to-[#140b24]',
            reelsBtnBorder: 'border-[#6e5585]/70',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_18px_rgba(192,132,252,0.28)]',
            viewsBadgeBg: 'bg-[#25173d]',
            viewsBadgeBorder: 'border-[#8b5cf6]/50',
            viewsBadgeText: 'text-[#d8b4fe]',
            reelsTrayBg: 'bg-[#160d26]',
            reelsTrayBorder: 'border-[#583f70]',
            cardBg: 'bg-[#1f1335]',
            cardBorder: 'border-[#6e5585]/50',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.45)]',
            cardTopBg: 'bg-gradient-to-b from-[#2d1b4a] to-[#201235]',
            cardBottomBg: 'bg-gradient-to-b from-[#180d2a] to-[#10071e]',
            cardBorderMid: 'border-white/10',
            cardText: 'text-[#f3e8ff]',
            separatorStarFill: 'fill-[#c084fc] text-[#c084fc]',
            sparkleColor: 'fill-[#c084fc] text-[#c084fc]',
            splitLine: 'bg-white/15',
            btnBg: 'bg-[#1d1330]',
            btnHoverBg: 'hover:bg-[#2b1c47]',
            btnBorder: 'border-[#6e5585]/60',
            btnText: 'text-[#f3e8ff]',
            catIcon: 'text-[#c084fc]',
            catIconHover: 'group-hover:text-[#e9d5ff]',
            cherryIcon: 'text-[#c084fc]',
            cherryIconHover: 'group-hover:text-[#e9d5ff]',
            bookIcon: 'text-[#c084fc]',
            bookIconHover: 'group-hover:text-[#e9d5ff]',
            copyrightText: 'text-[#d8b4fe]/60',
          }
        : {
            containerBg: 'bg-gradient-to-r from-purple-100/75 via-white/85 to-pink-100/75',
            containerBorder: 'border-purple-200/80',
            containerRing: 'ring-purple-200/70',
            containerShadow: 'shadow-[inset_0_4px_16px_rgba(168,85,247,0.22),inset_0_-4px_12px_rgba(236,72,153,0.18)]',
            frostedOverlay: 'bg-white/40',
            reflectGradient: 'from-white/40 to-transparent',
            dashedBorder: 'border-purple-200/80',
            tearLine: 'border-purple-200/80',
            barcodeBoxBg: 'bg-white/95',
            barcodeBoxBorder: 'border-purple-200',
            barcodeBars: 'bg-[#581c87]',
            barcodeText: 'text-[#581c87]',
            reelsBtnBg: 'bg-gradient-to-b from-[#ffffff] via-[#faf6ff] to-[#f3e8fc]',
            reelsBtnBorder: 'border-purple-200/70',
            reelsBtnHoverShadow: 'hover:shadow-[0_4px_16px_rgba(168,85,247,0.16)]',
            viewsBadgeBg: 'bg-[#ffffff]',
            viewsBadgeBorder: 'border-purple-100',
            viewsBadgeText: 'text-[#7e22ce]',
            reelsTrayBg: 'bg-[#ffffff]',
            reelsTrayBorder: 'border-purple-100',
            cardBg: 'bg-[#fdfaff]',
            cardBorder: 'border-purple-200/50',
            cardShadow: 'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(168,85,247,0.08)]',
            cardTopBg: 'bg-gradient-to-b from-[#ffffff] to-[#faf5ff]',
            cardBottomBg: 'bg-gradient-to-b from-[#f6eeff] to-[#eddcfc]',
            cardBorderMid: 'border-purple-200/35',
            cardText: 'text-[#6b21a8]',
            separatorStarFill: 'fill-[#9333ea] text-[#9333ea]',
            sparkleColor: 'fill-[#a855f7] text-[#a855f7]',
            splitLine: 'bg-[#a855f7]/20',
            btnBg: 'bg-white/95',
            btnHoverBg: 'hover:bg-[#faf5ff]',
            btnBorder: 'border-purple-200',
            btnText: 'text-[#581c87]',
            catIcon: 'text-[#c084fc]',
            catIconHover: 'group-hover:text-[#a855f7]',
            cherryIcon: 'text-[#c084fc]',
            cherryIconHover: 'group-hover:text-[#a855f7]',
            bookIcon: 'text-[#c084fc]',
            bookIconHover: 'group-hover:text-[#a855f7]',
            copyrightText: 'text-[#581c87]/75',
          };
  }
}

// =========================================================================
// 2. Ô CHỮ SỐ LẬT CƠ HỌC 3D (Solari Split-Flap 3D Reel)
// =========================================================================
interface SplitFlapDigitProps {
  char: string;
  index: number;
  themeStyles: TicketThemeStyles;
}

export const SlotSplitFlapDigit: React.FC<SplitFlapDigitProps> = ({ char, themeStyles }) => {
  const isSeparator = char === '.' || char === ',';
  const [currentVal, setCurrentVal] = useState(char);
  const [prevVal, setPrevVal] = useState(char);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipKey, setFlipKey] = useState(0);

  // Chỉ khi số thực sự thay đổi giá trị mới kích hoạt animation lật thẻ
  useEffect(() => {
    if (isSeparator) return;
    if (char !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(char);
      setIsFlipping(true);
      setFlipKey((k) => k + 1);
    }
  }, [char, currentVal, isSeparator]);

  // Sau khi hoàn thành cú lật (460ms), đưa về trạng thái tĩnh hoàn toàn
  useEffect(() => {
    if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 460);
      return () => clearTimeout(timer);
    }
  }, [isFlipping, flipKey]);

  // Icon ngôi sao ngăn cách hàng nghìn
  if (isSeparator) {
    return (
      <div className="self-center px-0.5 flex items-center justify-center select-none shrink-0" title="★">
        <svg
          viewBox="0 0 24 24"
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${themeStyles.separatorStarFill}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col w-[18px] sm:w-[21px] h-[26px] sm:h-[30px] rounded-[3px] ${themeStyles.cardBg} ${themeStyles.cardShadow} border-[0.5px] ${themeStyles.cardBorder} overflow-hidden select-none shrink-0`}
      style={{ perspective: '320px' }}
    >
      {/* 2.1 NỬA TRÊN TĨNH: Nền số mới */}
      <div className={`absolute top-0 inset-x-0 h-1/2 overflow-hidden ${themeStyles.cardTopBg} border-b-[0.5px] ${themeStyles.cardBorderMid} flex items-end justify-center`}>
        <span className={`translate-y-[50%] font-mono font-black text-xs sm:text-[13px] ${themeStyles.cardText} leading-none select-none drop-shadow-xs`}>
          {currentVal}
        </span>
      </div>

      {/* 2.2 NỬA DƯỚI TĨNH: Khi lật giữ số cũ để lộ tự nhiên, khi tĩnh hiện số mới */}
      <div className={`absolute bottom-0 inset-x-0 h-1/2 overflow-hidden ${themeStyles.cardBottomBg} shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)] flex items-start justify-center`}>
        <span className={`-translate-y-[50%] font-mono font-black text-xs sm:text-[13px] ${themeStyles.cardText} leading-none select-none drop-shadow-xs`}>
          {isFlipping ? prevVal : currentVal}
        </span>
      </div>

      {/* 2.3 HIỆU ỨNG LẬP THẺ 3D (Chỉ kích hoạt trên số vừa thay đổi) */}
      <AnimatePresence>
        {isFlipping && (
          <>
            {/* Thẻ trên gập úp xuống (0° -> -90°) */}
            <motion.div
              key={`slot-top-flip-${flipKey}`}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.37, 0, 0.63, 1],
              }}
              style={{ transformOrigin: 'bottom', backfaceVisibility: 'hidden' }}
              className={`absolute top-0 inset-x-0 h-1/2 overflow-hidden ${themeStyles.cardTopBg} border-b-[0.5px] ${themeStyles.cardBorderMid} flex items-end justify-center z-20 pointer-events-none`}
            >
              <span className={`translate-y-[50%] font-mono font-black text-xs sm:text-[13px] ${themeStyles.cardText} leading-none select-none drop-shadow-xs`}>
                {prevVal}
              </span>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 bg-black/20 pointer-events-none"
              />
            </motion.div>

            {/* Thẻ dưới rơi tiếp đất (90° -> 0°) */}
            <motion.div
              key={`slot-bot-flip-${flipKey}`}
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.24,
                delay: 0.16,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{ transformOrigin: 'top', backfaceVisibility: 'hidden' }}
              className={`absolute bottom-0 inset-x-0 h-1/2 overflow-hidden ${themeStyles.cardBottomBg} shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)] flex items-start justify-center z-30 pointer-events-none`}
            >
              <span className={`-translate-y-[50%] font-mono font-black text-xs sm:text-[13px] ${themeStyles.cardText} leading-none select-none drop-shadow-xs`}>
                {currentVal}
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Rãnh cắt ngang giữa 2 nửa thẻ Solari */}
      <div className={`absolute top-1/2 inset-x-0 -translate-y-1/2 h-[0.5px] ${themeStyles.splitLine} z-40 pointer-events-none`} />
    </div>
  );
};

// =========================================================================
// 3. NÚT "MÁY QUAY BẢNG LẬT VIEWS" (Views Slot Machine Button)
// =========================================================================
interface LuckySlotReelsButtonProps {
  count: number;
  onClick?: () => void;
  onRefreshViews?: () => Promise<void> | void;
  themeStyles: TicketThemeStyles;
}

export const LuckySlotReelsButton: React.FC<LuckySlotReelsButtonProps> = ({
  count,
  onClick,
  onRefreshViews,
  themeStyles,
}) => {
  const formattedCount = formatViewCount(count);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (onRefreshViews) {
        await onRefreshViews();
      } else {
        await fetchGlobalViews(true);
      }
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 700);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {/* CÁC NGÔI SAO LẤP LÁNH & TIM PIXEL QUANH NÚT LƯỢT XEM */}
      {/* 1. Ngôi sao 5 cánh trên góc trái (sao 5 cánh) */}
      <motion.div
        animate={{ scale: [0.8, 1.25, 0.8], rotate: [0, 25, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="absolute -top-1.5 -left-1 sm:-left-2 pointer-events-none z-20 drop-shadow-xs"
      >
        <svg
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${themeStyles.sparkleColor}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M12 2L15 9L22 9.5L17 14.5L18.5 22L12 18L5.5 22L7 14.5L2 9.5L9 9L12 2Z" />
        </svg>
      </motion.div>

      {/* 2. Sao Cyber 4 cánh nép góc trên phải */}
      <motion.div
        animate={{ scale: [0.75, 1.3, 0.75], rotate: [0, 45, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute -top-1.5 right-6 sm:right-8 pointer-events-none z-20 drop-shadow-xs"
      >
        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z"
            className={themeStyles.sparkleColor}
            fill="currentColor"
          />
          <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
        </svg>
      </motion.div>

      {/* 3. Ngôi sao 5 cánh nép sườn phải */}
      <motion.div
        animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 0.35 }}
        className="absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-2.5 pointer-events-none z-20 drop-shadow-xs"
      >
        <svg
          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${themeStyles.sparkleColor}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M12 2L15 9L22 9.5L17 14.5L18.5 22L12 18L5.5 22L7 14.5L2 9.5L9 9L12 2Z" />
        </svg>
      </motion.div>

      {/* 4. Trái tim Pixel 8-bit nép góc dưới phải */}
      <motion.div
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.49, 0.5, 0.99, 1], ease: 'linear' }}
        className="absolute -bottom-1.5 right-1 sm:right-2 pointer-events-none z-20 drop-shadow-xs"
      >
        <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${themeStyles.sparkleColor}`} viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="4" height="2" />
          <rect x="10" y="2" width="4" height="2" />
          <rect x="0" y="4" width="8" height="4" />
          <rect x="8" y="4" width="8" height="4" />
          <rect x="2" y="8" width="12" height="2" />
          <rect x="4" y="10" width="8" height="2" />
          <rect x="6" y="12" width="4" height="2" />
          <rect x="7" y="14" width="2" height="1" />
        </svg>
      </motion.div>

      {/* 5. Ngôi sao 5 cánh nép đáy trái */}
      <motion.div
        animate={{ scale: [0.8, 1.15, 0.8], rotate: [-15, 15, -15] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.6 }}
        className="absolute -bottom-1 left-7 sm:left-9 pointer-events-none z-20 drop-shadow-xs"
      >
        <svg
          className={`w-2 h-2 ${themeStyles.sparkleColor}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M12 2L15 9L22 9.5L17 14.5L18.5 22L12 18L5.5 22L7 14.5L2 9.5L9 9L12 2Z" />
        </svg>
      </motion.div>

      <div
        onClick={onClick}
        className={`group flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 px-2.5 sm:px-3 rounded-2xl ${themeStyles.reelsBtnBg} border-2 ${themeStyles.reelsBtnBorder} shadow-sm ${themeStyles.reelsBtnHoverShadow} transition-all shrink-0 select-none relative z-10`}
      >
        {/* Nhãn Views */}
        <div className={`flex items-center justify-center px-2.5 py-1 sm:py-1.5 rounded-lg ${themeStyles.viewsBadgeBg} border ${themeStyles.viewsBadgeBorder} shadow-2xs shrink-0 select-none`}>
          <span className={`font-mono font-bold text-xs sm:text-[13px] tracking-wide ${themeStyles.viewsBadgeText}`}>
            Views
          </span>
        </div>

        {/* Dãy thẻ lật cơ học Solari */}
        <div className={`flex items-center gap-[2.5px] p-1 rounded-xl ${themeStyles.reelsTrayBg} border ${themeStyles.reelsTrayBorder} shadow-inner`}>
          {formattedCount.split('').map((char, idx) => (
            <SlotSplitFlapDigit key={idx} char={char} index={idx} themeStyles={themeStyles} />
          ))}
        </div>

        {/* Nút Load kế bên số lượt xem, nằm bên trong nút */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center justify-center p-1 sm:p-1.5 rounded-lg ${themeStyles.viewsBadgeBg} border ${themeStyles.viewsBadgeBorder} ${themeStyles.viewsBadgeText} hover:opacity-80 active:scale-90 transition-all cursor-pointer shadow-2xs`}
          title="Tải lại lượt xem"
          aria-label="Tải lại lượt xem"
        >
          <RotateCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 4. TOÀN BỘ KHUNG "CUỐNG VÉ XEM PHIM" - NỀN TRƠN (Plain Frosted Glass)
// =========================================================================
interface MovieTicketPlainFooterProps {
  views: number;
  onIncrementViews: () => void;
  onRefreshViews?: () => Promise<void> | void;
  onOpenIntro?: () => void;
  themeStyles: TicketThemeStyles;
  theme?: string;
  isDarkMode?: boolean;
}

const footerLightButtonStyles = `
.footer-btn-light-frost {
  border-radius: 12px !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1.5px solid transparent !important;
  background: 
    linear-gradient(135deg, 
      rgba(234, 242, 253, 0.85) 0%, 
      rgba(241, 246, 254, 0.80) 18%, 
      rgba(255, 255, 255, 0.92) 32%, 
      rgba(255, 255, 255, 0.92) 68%, 
      rgba(241, 246, 254, 0.80) 82%, 
      rgba(234, 242, 253, 0.85) 100%
    ) padding-box,
    linear-gradient(to bottom, 
      #ffffff 0%, 
      #ffffff 20%, 
      rgba(182, 205, 226, 0.45) 55%, 
      rgba(182, 205, 226, 0.88) 100%
    ) border-box !important;
  box-shadow: none !important;
  color: #3e566d !important;
  transition: all 0.25s ease !important;
}
.footer-btn-light-frost:hover {
  box-shadow: none !important;
  color: #1e3448 !important;
  opacity: 0.95;
}

.footer-btn-light-amethyst {
  border-radius: 12px !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1.5px solid transparent !important;
  background: 
    linear-gradient(135deg, 
      rgba(247, 242, 253, 0.85) 0%, 
      rgba(251, 247, 255, 0.80) 18%, 
      rgba(255, 255, 255, 0.92) 32%, 
      rgba(255, 255, 255, 0.92) 68%, 
      rgba(251, 247, 255, 0.80) 82%, 
      rgba(247, 242, 253, 0.85) 100%
    ) padding-box,
    linear-gradient(to bottom, 
      #ffffff 0%, 
      #ffffff 20%, 
      rgba(196, 178, 216, 0.45) 55%, 
      rgba(196, 178, 216, 0.88) 100%
    ) border-box !important;
  box-shadow: none !important;
  color: #4d3c63 !important;
  transition: all 0.25s ease !important;
}
.footer-btn-light-amethyst:hover {
  box-shadow: none !important;
  color: #332446 !important;
  opacity: 0.95;
}

.footer-btn-light-sage {
  border-radius: 12px !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1.5px solid transparent !important;
  background: 
    linear-gradient(135deg, 
      rgba(244, 250, 245, 0.90) 0%, 
      rgba(248, 253, 249, 0.88) 18%, 
      rgba(255, 255, 255, 0.96) 32%, 
      rgba(255, 255, 255, 0.96) 68%, 
      rgba(248, 253, 249, 0.88) 82%, 
      rgba(244, 250, 245, 0.90) 100%
    ) padding-box,
    linear-gradient(to bottom, 
      #ffffff 0%, 
      #ffffff 20%, 
      rgba(195, 220, 200, 0.40) 55%, 
      rgba(195, 220, 200, 0.68) 100%
    ) border-box !important;
  box-shadow: none !important;
  color: #355233 !important;
  transition: all 0.25s ease !important;
}
.footer-btn-light-sage:hover {
  box-shadow: none !important;
  color: #20381e !important;
  opacity: 0.95;
}

.footer-btn-light-mocha {
  border-radius: 12px !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1.5px solid transparent !important;
  background: 
    linear-gradient(135deg, 
      rgba(252, 246, 238, 0.85) 0%, 
      rgba(255, 250, 243, 0.80) 18%, 
      rgba(255, 255, 255, 0.92) 32%, 
      rgba(255, 255, 255, 0.92) 68%, 
      rgba(255, 250, 243, 0.80) 82%, 
      rgba(252, 246, 238, 0.85) 100%
    ) padding-box,
    linear-gradient(to bottom, 
      #ffffff 0%, 
      #ffffff 20%, 
      rgba(210, 186, 162, 0.45) 55%, 
      rgba(210, 186, 162, 0.88) 100%
    ) border-box !important;
  box-shadow: none !important;
  color: #5e473b !important;
  transition: all 0.25s ease !important;
}
.footer-btn-light-mocha:hover {
  box-shadow: none !important;
  color: #422e23 !important;
  opacity: 0.95;
}

.footer-btn-light-notebook {
  border-radius: 12px !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1.5px solid transparent !important;
  background: 
    linear-gradient(135deg, 
      rgba(248, 248, 248, 0.85) 0%, 
      rgba(252, 252, 252, 0.80) 18%, 
      rgba(255, 255, 255, 0.92) 32%, 
      rgba(255, 255, 255, 0.92) 68%, 
      rgba(252, 252, 252, 0.80) 82%, 
      rgba(248, 248, 248, 0.85) 100%
    ) padding-box,
    linear-gradient(to bottom, 
      #ffffff 0%, 
      #ffffff 20%, 
      rgba(198, 198, 198, 0.45) 55%, 
      rgba(198, 198, 198, 0.88) 100%
    ) border-box !important;
  box-shadow: none !important;
  color: #27272a !important;
  transition: all 0.25s ease !important;
}
.footer-btn-light-notebook:hover {
  box-shadow: none !important;
  color: #09090b !important;
  opacity: 0.95;
}

.footer-btn-light-lululemon {
  border-radius: 12px !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1.5px solid transparent !important;
  background: 
    linear-gradient(135deg, 
      rgba(249, 246, 247, 0.88) 0%, 
      rgba(252, 249, 250, 0.82) 18%, 
      rgba(255, 255, 255, 0.94) 32%, 
      rgba(255, 255, 255, 0.94) 68%, 
      rgba(252, 249, 250, 0.82) 82%, 
      rgba(249, 246, 247, 0.88) 100%
    ) padding-box,
    linear-gradient(to bottom, 
      #ffffff 0%, 
      #ffffff 20%, 
      rgba(238, 211, 220, 0.45) 55%, 
      rgba(204, 123, 143, 0.50) 100%
    ) border-box !important;
  box-shadow: none !important;
  color: #cc7b8f !important;
  transition: all 0.25s ease !important;
}
.footer-btn-light-lululemon:hover {
  box-shadow: none !important;
  color: #b86277 !important;
  opacity: 0.95;
}
`;

export const MovieTicketPlainFooter: React.FC<MovieTicketPlainFooterProps> = ({
  views,
  onIncrementViews,
  onRefreshViews,
  onOpenIntro,
  themeStyles,
  theme = 'amethyst-haze',
  isDarkMode = false,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto relative select-none font-sans">
      <style>{footerLightButtonStyles}</style>
      {/* BỎ KHUNG VIỀN & NỀN CỦA KHUNG CUỐNG VÉ: CÁC NÚT VÀ MÃ VẠCH VẪN GIỮ NGUYÊN NỀN BÊN TRONG */}
      <div className="relative overflow-hidden transition-all">
        {/* NỘI DUNG CUỐNG VÉ */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center p-2 sm:p-3 px-3 sm:px-6 gap-6 sm:gap-12">
          {/* PHẦN 1 (TRÁI): MÃ VẠCH BARCODE VINTAGE */}
          <div className="flex items-center gap-3.5 shrink-0 justify-center">
            <div
              className={`hidden xs:flex flex-col items-center justify-center ${themeStyles.barcodeBoxBg} px-2.5 py-1 rounded-lg border ${themeStyles.barcodeBoxBorder} shrink-0 shadow-2xs`}
            >
              <div className="flex items-end gap-[1.5px] h-6">
                <span className={`w-[1.5px] h-6 ${themeStyles.barcodeBars}`} />
                <span className={`w-[2.5px] h-6 ${themeStyles.barcodeBars}`} />
                <span className={`w-[1px] h-6 ${themeStyles.barcodeBars}`} />
                <span className={`w-[2px] h-6 ${themeStyles.barcodeBars}`} />
                <span className={`w-[1px] h-6 ${themeStyles.barcodeBars}`} />
                <span className={`w-[3px] h-6 ${themeStyles.barcodeBars}`} />
                <span className={`w-[1px] h-6 ${themeStyles.barcodeBars}`} />
                <span className={`w-[2px] h-6 ${themeStyles.barcodeBars}`} />
              </div>
              <span
                className={`text-[7.5px] font-mono ${themeStyles.barcodeText} tracking-tighter mt-0.5 flex items-center gap-0.5 font-bold`}
              >
                ★ 2026-VIP ★
              </span>
            </div>
          </div>

          {/* PHẦN 2: MÁY QUAY BẢNG LẬT VIEWS */}
          <div className="shrink-0 flex items-center justify-center">
            <LuckySlotReelsButton
              count={views}
              onClick={onIncrementViews}
              onRefreshViews={onRefreshViews}
              themeStyles={themeStyles}
            />
          </div>
        </div>
      </div>

      {/* DÒNG BẢN QUYỀN TRANG WEB */}
      <div className="w-full text-center pt-3 pb-1">
        <p className={`text-xs sm:text-[13px] font-medium tracking-wide ${themeStyles.copyrightText}`}>
          © 2026 Niên Thời - Jouriee65
        </p>
      </div>
    </div>
  );
};

// =========================================================================
// 5. COMPONENT FOOTER CHÍNH
// =========================================================================
export interface FooterProps {
  isNovelPlatform?: boolean;
  borderClass?: string;
  bgClass?: string;
  theme?: string;
  isDarkMode?: boolean;
  isHomePage?: boolean;
  onOpenIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  borderClass,
  bgClass,
  theme = 'amethyst-haze',
  isDarkMode = false,
  onOpenIntro,
}) => {
  const [views, setViews] = useState<number>(() => getGlobalViews());

  useEffect(() => {
    const unsub = subscribeGlobalViews((v) => setViews(v));
    return () => unsub();
  }, []);

  const handleIncrement = () => {
    // Không cộng lượt xem khi bấm nút theo yêu cầu
  };

  const handleRefreshViews = async () => {
    try {
      const latest = await fetchGlobalViews(true);
      setViews(latest);
    } catch {}
  };

  const themeStyles = useMemo(() => {
    return getTicketTheme(theme, isDarkMode);
  }, [theme, isDarkMode]);

  return (
    <footer
      className={`mt-auto w-full relative py-6 sm:py-8 border-t transition-colors z-10 ${
        borderClass || 'border-black/10 dark:border-white/10'
      } ${bgClass || 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <MovieTicketPlainFooter
          views={views}
          onIncrementViews={handleIncrement}
          onRefreshViews={handleRefreshViews}
          onOpenIntro={onOpenIntro}
          themeStyles={themeStyles}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      </div>
    </footer>
  );
};

export default Footer;
