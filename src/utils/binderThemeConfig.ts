import React from 'react';

export interface BinderThemeConfig {
  id: string;
  name: string;

  // Background for page container
  pageBgClass: string;

  // Header Awning
  awningTopBarBg: string;
  awningTopBarBorder: string;
  awningStripeColorGradient: {
    stop0: string;
    stop25: string;
    stop65: string;
    stop100: string;
  };
  awningStripeCreamGradient: {
    stop0: string;
    stop45: string;
    stop80: string;
    stop100: string;
  };
  awningBottomLine: string;

  // Signboard Pill
  signboardShadow: string;
  signboardBoxShadow: string;
  signboardBg: string;
  signboardSubText: string;
  signboardTitleText: string;
  signboardTextShadow: string;
  signboardBtnText: string;
  signboardRibbonHanger: string;
  signboardRibbonDotBg: string;
  signboardBtnStyle: React.CSSProperties;

  // Background Glows
  glowTopLeft: string;
  glowBottomRight: string;

  // Notice Banner (Hướng dẫn đọc)
  noticeBg: string;
  noticeBorder: string;
  noticeText: string;
  noticeHighlight: string;
  noticeBtnText: string;

  // Cat Ears SVG Gradients
  catEarOuter: {
    stop0: string;
    stop35: string;
    stop70: string;
    stop100: string;
  };
  catEarInner: {
    stop0: string;
    stop50: string;
    stop100: string;
  };

  // Cat Ear Center Ribbon
  ribbonText: string;
  ribbonIcon: string;

  // Cover Card & Left Column
  coverCardBorder: string;
  coverInnerBorder: string;
  heartIconColor: string;
  titleText: string;
  authorTextMuted: string;
  translatorHighlight: string;
  actionBtnPrimaryText: string;
  actionBtnSecondaryText: string;

  // DANH MỤC Header & Tabs
  tocHeaderBg: string;
  tocHeaderBorder: string;
  tocHeaderText: string;
  folderIconColor: string;
  tabActiveText: string;
  tabInactiveText: string;

  // Rings / Spiral spine
  spineGradientMobile: string;
  spineGradientDesktop: string;
  spineBorderMobile: string;
  spineBorderDesktop: string;
  ringBorder: string;
  ringGradient: string;

  // Search & Star Bar
  searchIconBg: string;
  searchIconText: string;
  searchPlaceholder: string;

  // Profile Card (Right Column)
  profileCardHeaderIcon: string;
  profileCardHeaderText: string;
  profileTitleText: string;
  tagPillBg: string;
  tagPillText: string;
  tagPillBorder: string;
  profileLineColor: string;

  // D-DAY card
  dDayHoleBg: string;
  dDayHoleBorder: string;
  dDayTitleText: string;
  dDayDashedBorder: string;
  dDayNumberText: string;
  dDayChaptersText: string;

  // Washi Tapes
  washiDividerBg: string;
  washiGridColor: string;
  washiTape1Bg: string;
  washiTape1Border: string;
  washiTape2Bg: string;
  washiTape2Border: string;

  // Notice & Lore Cards (Tab Diary)
  accentDot: string;
  cardTitle: string;
  cardSubtext: string;
  cardBorder: string;
  stripeBarGradient: string; // Left/right vertical decorative bar
  synopsisGridLine: string;

  // Chapter List Tab
  chapterDotColor: string;
  chapterHoverBg: string;
  chapterTitleText: string;
  chapterTitleHover: string;
  chapterExtraBadgeBg: string;
  chapterExtraBadgeText: string;
  chapterExtraBadgeBorder: string;
  chapterDateText: string;
  paginationActiveText: string;
  paginationActiveBg: string;
  paginationActiveBorder: string;

  // Guestbook / Comments Tab
  commentHeaderIcon: string;
  commentHeaderText: string;
  commentInputBorder: string;
  commentInputBg: string;
  commentInputText: string;
  commentPlaceholder: string;
  commentBtnText: string;
  commentItemTitleText: string;
  commentItemDateText: string;
  commentItemContentText: string;

  // New Theme Properties for Notebook / Binder view & 45deg stripes
  cardGlassBg: string;
  profileCardBg: string;
  ddayCardBg: string;
  washiStripeGradient: string;
  innerBorderColor: string;
  cartoonXGrad: { stop0: string; stop50: string; stop100: string };
  pixelHeartGrad: { stop0: string; stop30: string; stop70: string; stop100: string };
  introStarGrad: { stop0: string; stop50: string; stop100: string };

  // Comprehensive theme styling for binder notebook
  leftColumnBg: React.CSSProperties;
  leftColumnShadow: string;
  rightColumnGrid: React.CSSProperties;
  notebookOuterGlass: React.CSSProperties;
  notebookInnerGlass: React.CSSProperties;
  cardGlassStyle: React.CSSProperties;
  searchBarSoftStyle: React.CSSProperties;
  btnCandyPrimary: React.CSSProperties;
  btnCandySecondary: React.CSSProperties;
  btnClayPrimary: React.CSSProperties;
  btnClaySecondary: React.CSSProperties;
  btnClayPill: React.CSSProperties;
  tabActiveStyle: React.CSSProperties;
  tabInactiveStyle: React.CSSProperties;
  decorShadowXLeft: string;
  decorShadowXRight: string;
  decorShadowHeart: string;
  decorShadowStar: string;
  washiDividerFilter: string;
  polaroidFrameShadow: string;
  musicPlayerBg: React.CSSProperties;
  musicEqColor1: string;
  musicEqColor2: string;
  musicEqColor3: string;
  musicVinylCenterBg: string;
  defaultHeartIdx: number;
  defaultStarIdx: number;
  profileCardShadow: string;
  dDayHoleShadow: string;
  dDayGradientOverlay: string;
  chapterHeaderStripe: string;
  chapterDividerBorder: string;
  paginationBorder: string;
  cardDividerBorder: string;
  noticeShadow: string;
  spineSeamVia: string;
  spineShadowMobile: string;
  spineShadowDesktop: string;
  mobileSpringShadow: string;
  washi1Shadow: string;
  washi2Shadow: string;
  clayStarGrad: { stop0: string; stop50: string; stop100: string };
}

export const BINDER_THEMES: Record<string, BinderThemeConfig> = {
  // 1. FROST (Theme Lam Khói / Băng Lam Pastel)
  'slate-haze': {
    id: 'slate-haze',
    name: 'Frost',
    pageBgClass: 'theme-soft-ui-bg',

    awningTopBarBg: 'linear-gradient(180deg, #cbe5fb 0%, #d8ecfd 50%, #e9f4fe 100%)',
    awningTopBarBorder: '1px solid #badaf8',
    awningStripeColorGradient: {
      stop0: '#ffffff',
      stop25: '#e8f3fc',
      stop65: '#badaf8',
      stop100: '#8fc5f2',
    },
    awningStripeCreamGradient: {
      stop0: '#ffffff',
      stop45: '#fcfdff',
      stop80: '#f0f7fe',
      stop100: '#dceefa',
    },
    awningBottomLine: '#b8d9f8',

    signboardShadow: 'border-white shadow-[0_10px_28px_rgba(50,110,195,0.18),0_0_18px_rgba(186,225,255,0.65),inset_0_1.5px_1.5px_#ffffff]',
    signboardBoxShadow:
      '0 14px 34px -4px rgba(50,110,195,0.22), 0 6px 16px rgba(186,225,255,0.55), inset 0 1.5px 1.5px #ffffff',
    signboardBg: 'linear-gradient(180deg, #ffffff 0%, #f0f7fe 45%, #deeffd 100%)',
    signboardSubText: 'text-[#3b6b9d]',
    signboardTitleText: 'text-[#183a62]',
    signboardTextShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff, 0 2px 6px rgba(45,100,170,0.22)',
    signboardBtnText: 'text-[#183a62]',
    signboardRibbonHanger: 'linear-gradient(180deg, #ffffff 0%, #f0f7fe 60%, #d8ecfc 100%)',
    signboardRibbonDotBg: '#e3f1fd',
    signboardBtnStyle: {
      background: 'linear-gradient(135deg, #f7fbff 0%, #e6f2fd 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(165, 195, 225, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
      color: '#1a3c63',
    },

    glowTopLeft: 'bg-gradient-to-br from-[#cbe5fb]/70 to-[#ffffff]/90',
    glowBottomRight: 'bg-gradient-to-tl from-[#d2ebfd]/75 via-[#eaf4fe]/85 to-[#ffffff]/95',

    noticeBg: 'bg-[#f0f7fe]/95',
    noticeBorder: 'border-[#cfe2f5]',
    noticeText: 'text-[#1a3c63]',
    noticeHighlight: 'text-[#2563eb]',
    noticeBtnText: 'text-[#1a3c63]',

    catEarOuter: {
      stop0: '#ffffff',
      stop35: '#dceefa',
      stop70: '#badaf8',
      stop100: '#87bef0',
    },
    catEarInner: {
      stop0: '#f0f7fe',
      stop50: '#d5e9f8',
      stop100: '#bedff8',
    },

    ribbonText: 'text-[#244c77]',
    ribbonIcon: 'text-[#487cb5]',

    coverCardBorder: 'border-[#cfe2f5]',
    coverInnerBorder: 'border-[#e5f0fb]',
    heartIconColor: '#38bdf8',
    titleText: 'text-[#1a3c63]',
    authorTextMuted: 'text-[#3b6594]',
    translatorHighlight: 'text-[#183a62]',
    actionBtnPrimaryText: 'text-[#1a3c63]',
    actionBtnSecondaryText: 'text-[#244c77]',

    tocHeaderBg: 'bg-[#e7f2fd]/85',
    tocHeaderBorder: 'border-[#cfe2f5]',
    tocHeaderText: 'text-[#1a3c63]',
    folderIconColor: 'text-[#3b82f6]',
    tabActiveText: 'text-[#183a62]',
    tabInactiveText: 'text-[#4873a0]',

    spineGradientMobile: 'from-sky-100/60 via-sky-200/35 to-sky-100/60',
    spineGradientDesktop: 'from-sky-100/40 via-sky-200/25 to-sky-100/40',
    spineBorderMobile: 'border-white/80',
    spineBorderDesktop: 'border-white/60',
    ringBorder: 'border-sky-300',
    ringGradient: 'from-white via-[#f0f7fe] to-[#d8ebfc]',

    searchIconBg: 'from-sky-200/90 to-blue-100/90',
    searchIconText: 'text-[#2563eb]',
    searchPlaceholder: 'placeholder-[#5e88b8]',

    profileCardHeaderIcon: '#3b82f6',
    profileCardHeaderText: 'text-[#2b598d]',
    profileTitleText: 'text-[#1a3c63]',
    tagPillBg: 'bg-[#eaf4fd]',
    tagPillText: 'text-[#1a3c63]',
    tagPillBorder: 'border-[#cfe2f5]',
    profileLineColor: 'rgba(100, 170, 235, 0.04)',

    dDayHoleBg: '#e8f3fc',
    dDayHoleBorder: '#9dc8f3',
    dDayTitleText: 'text-[#2b598d]',
    dDayDashedBorder: 'border-[#badaf8]',
    dDayNumberText: 'text-[#183a62]',
    dDayChaptersText: 'text-[#2563eb]',

    washiDividerBg: '#f0f7fe',
    washiGridColor: 'rgba(100, 170, 235, 0.38)',
    washiTape1Bg: '#d8ecfc',
    washiTape1Border: 'border-sky-300/80',
    washiTape2Bg: '#daf2fe',
    washiTape2Border: 'border-cyan-300/80',

    accentDot: 'bg-[#3b82f6]',
    cardTitle: 'text-[#265d97]',
    cardSubtext: 'text-[#4c78a6]',
    cardBorder: 'border-[#cbe2f8]/80',
    stripeBarGradient: 'from-[#9ac7f5] via-[#6ea8e5] to-[#9ac7f5]',
    synopsisGridLine: 'rgba(147, 197, 253, 0.10)',

    chapterDotColor: 'bg-[#4a88c7]',
    chapterHoverBg: 'hover:bg-[#f0f7fe]',
    chapterTitleText: 'text-[#1a3c63]',
    chapterTitleHover: 'group-hover:text-[#2563eb]',
    chapterExtraBadgeBg: 'bg-[#3b82f6]/15',
    chapterExtraBadgeText: 'text-[#1d4ed8]',
    chapterExtraBadgeBorder: 'border-[#60a5fa]/40',
    chapterDateText: 'text-[#6791bc]',
    paginationActiveText: 'text-[#1a3c63]',
    paginationActiveBg: 'bg-[#e3f0fb]',
    paginationActiveBorder: 'border-[#cbe2f8]',

    commentHeaderIcon: 'text-[#3884d8]',
    commentHeaderText: 'text-[#1a3c63]',
    commentInputBorder: 'border-[#cbe2f8]',
    commentInputBg: 'bg-white/70',
    commentInputText: 'text-[#1a3c63]',
    commentPlaceholder: 'placeholder-[#7ca4cc]',
    commentBtnText: 'text-[#1a3c63]',
    commentItemTitleText: 'text-[#1a3c63]',
    commentItemDateText: 'text-[#6791bc]',
    commentItemContentText: 'text-[#1a3c63]',

    cardGlassBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(244, 250, 255, 0.88) 100%)',
    profileCardBg: '#ffffff',
    ddayCardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(246, 250, 255, 0.90) 100%)',
    washiStripeGradient: 'repeating-linear-gradient(45deg, rgba(100, 170, 235, 0.35) 0px, rgba(100, 170, 235, 0.35) 4px, transparent 4px, transparent 8px)',
    innerBorderColor: 'border-[#cfe2f5]',
    cartoonXGrad: { stop0: '#f0f8ff', stop50: '#c5e2fd', stop100: '#8ec4f8' },
    pixelHeartGrad: { stop0: '#f0f8ff', stop30: '#d8ecfd', stop70: '#9ecdfa', stop100: '#5ea5ea' },
    introStarGrad: { stop0: '#f0f8ff', stop50: '#d8ecfd', stop100: '#8ec4f8' },

    leftColumnBg: {
      backgroundColor: '#f7fbff',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(160, 205, 245, 0.08) 0px, rgba(160, 205, 245, 0.08) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(-45deg, rgba(160, 205, 245, 0.08) 0px, rgba(160, 205, 245, 0.08) 8px, transparent 8px, transparent 16px)',
    },
    leftColumnShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 4px 16px rgba(70,130,200,0.10)',
    rightColumnGrid: {
      backgroundColor: '#ffffff',
      backgroundImage:
        'linear-gradient(rgba(175, 212, 245, 0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(175, 212, 245, 0.28) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    notebookOuterGlass: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(238, 246, 253, 0.82) 45%, rgba(220, 238, 253, 0.72) 100%)',
      boxShadow:
        '0 24px 55px -8px rgba(75, 130, 185, 0.18), 0 10px 24px -5px rgba(100, 160, 220, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.98), inset 0 -2px 6px rgba(165, 200, 235, 0.22)',
      border: '2px solid rgba(255, 255, 255, 0.92)',
    },
    notebookInnerGlass: {
      background: 'rgba(255, 255, 255, 0.72)',
      boxShadow: 'inset 0 2px 8px rgba(140, 180, 220, 0.12), 0 6px 20px rgba(110, 160, 210, 0.08)',
      border: '1.5px solid rgba(255, 255, 255, 0.96)',
    },
    cardGlassStyle: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(244, 250, 255, 0.88) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(165, 195, 225, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    searchBarSoftStyle: {
      background: 'linear-gradient(135deg, #eef6fd 0%, #f7fbff 100%)',
      boxShadow:
        'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(160, 195, 225, 0.22), 0 4px 14px -3px rgba(120, 165, 210, 0.12)',
      border: '1.5px solid rgba(255, 255, 255, 0.9)',
    },
    btnCandyPrimary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f2f8fe 35%, #deeffd 75%, #badcfb 100%)',
      boxShadow:
        '0 4px 14px -2px rgba(80, 140, 210, 0.22), 0 1px 3px rgba(80, 140, 210, 0.10), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(135, 185, 235, 0.22)',
      color: '#1a3c63',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnCandySecondary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fcff 40%, #ecf5fd 80%, #d8ebfb 100%)',
      boxShadow:
        '0 3px 10px -2px rgba(80, 140, 210, 0.16), inset 0 1px 1.5px #ffffff, inset 0 -1.5px 3px rgba(140, 190, 240, 0.16)',
      color: '#244c77',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClayPrimary: {
      background: 'linear-gradient(135deg, #f7fbff 0%, #e6f2fd 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(165, 195, 225, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      color: '#1a3c63',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
    },
    btnClaySecondary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f4f9fe 50%, #eaf3fc 100%)',
      boxShadow:
        '-2px -2px 7px rgba(255, 255, 255, 0.95), 2px 3px 9px rgba(165, 195, 225, 0.16), inset 0 1px 1px #ffffff',
      color: '#24466d',
      border: '1px solid rgba(255, 255, 255, 0.75)',
    },
    btnClayPill: {
      background: 'linear-gradient(135deg, #f8fcff 0%, #edf5fc 100%)',
      boxShadow: '-2.5px -2.5px 7px rgba(255, 255, 255, 0.95), 2.5px 2.5px 8px rgba(170, 200, 228, 0.16)',
      color: '#264e78',
      border: '1px solid rgba(255, 255, 255, 0.55)',
    },
    tabActiveStyle: {
      background: 'linear-gradient(135deg, #e4f0fa 0%, #ebf4fb 100%)',
      boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(155, 190, 225, 0.22)',
      color: '#183a62',
      border: '1px solid rgba(255, 255, 255, 0.45)',
    },
    tabInactiveStyle: {
      background: 'linear-gradient(135deg, #f7fbff 0%, #edf5fc 100%)',
      color: '#4873a0',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    decorShadowXLeft: 'drop-shadow(0 6px 14px rgba(70,140,215,0.38))',
    decorShadowXRight: 'drop-shadow(0 6px 14px rgba(56,189,248,0.35))',
    decorShadowHeart: 'drop-shadow(0 10px 22px rgba(60,130,215,0.45))',
    decorShadowStar: 'drop-shadow(0 10px 22px rgba(60,130,215,0.42))',
    washiDividerFilter: 'drop-shadow(0 2px 4px rgba(70, 130, 200, 0.22))',
    polaroidFrameShadow: '0 8px 24px rgba(50,110,180,0.16)',
    musicPlayerBg: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(244, 250, 255, 0.88) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(165, 195, 225, 0.16)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    musicEqColor1: '#38bdf8',
    musicEqColor2: '#60a5fa',
    musicEqColor3: '#93c5fd',
    musicVinylCenterBg: '#9bc2e8',
    defaultHeartIdx: 0,
    defaultStarIdx: 0,
    profileCardShadow:
      '0 8px 22px -3px rgba(80,135,195,0.08), inset 0 1px 2px rgba(255,255,255,0.98), inset 0 -1px 3px rgba(160,205,245,0.08)',
    dDayHoleShadow: 'inset 0 1.5px 3px rgba(45, 95, 160, 0.28), 0 1px 1px #ffffff',
    dDayGradientOverlay: 'rgba(245, 250, 255, 0.85)',
    chapterHeaderStripe:
      'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, rgba(186, 230, 253, 0.12) 8px, rgba(186, 230, 253, 0.12) 16px)',
    chapterDividerBorder: 'divide-[#e1eef9]',
    paginationBorder: 'border-[#e1eef9]',
    cardDividerBorder: 'border-[#e2eef9]/70',
    noticeShadow: '0 8px 24px rgba(60,120,195,0.16)',
    spineSeamVia: 'via-sky-300/10',
    spineShadowMobile: 'inset 0 2px 8px rgba(50,110,180,0.12), inset 0 -2px 8px rgba(50,110,180,0.12)',
    spineShadowDesktop: 'inset 0 2px 8px rgba(50,110,180,0.12)',
    mobileSpringShadow: 'drop-shadow(0 2px 4px rgba(100,165,235,0.22))',
    washi1Shadow: '0 1px 4px rgba(70,130,205,0.18)',
    washi2Shadow: '0 1px 4px rgba(56,189,248,0.18)',
    clayStarGrad: { stop0: '#f0f8ff', stop50: '#c5e2fd', stop100: '#8ec4f8' },
  },

  // 2. PURPLE / AMETHYST (Theme Tím Oải Hương / Thạch Anh Mộng Mơ - Dịu Nhẹ Mắt)
  'amethyst-haze': {
    id: 'amethyst-haze',
    name: 'Purple',
    pageBgClass: 'bg-gradient-to-br from-[#faf7fc] via-[#f4eef9] to-[#ffffff]',

    awningTopBarBg: 'linear-gradient(180deg, #dfd3f2 0%, #ece4f8 50%, #f7f3fb 100%)',
    awningTopBarBorder: '1px solid #d5c5ed',
    awningStripeColorGradient: {
      stop0: '#ffffff',
      stop25: '#f7f4fb',
      stop65: '#dfd2f2',
      stop100: '#c5b1e6',
    },
    awningStripeCreamGradient: {
      stop0: '#ffffff',
      stop45: '#fcfbfe',
      stop80: '#f8f5fc',
      stop100: '#ede6f7',
    },
    awningBottomLine: '#d5c5ed',

    signboardShadow: 'border-white shadow-[0_10px_28px_rgba(126,90,170,0.14),0_0_18px_rgba(220,205,245,0.50),inset_0_1.5px_1.5px_#ffffff]',
    signboardBoxShadow:
      '0 14px 34px -4px rgba(126,90,170,0.18), 0 6px 16px rgba(220,205,245,0.50), inset 0 1.5px 1.5px #ffffff',
    signboardBg: 'linear-gradient(180deg, #ffffff 0%, #f9f6fc 45%, #ede6f7 100%)',
    signboardSubText: 'text-[#6e5d8a]',
    signboardTitleText: 'text-[#382b52]',
    signboardTextShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff, 0 2px 6px rgba(126,90,170,0.18)',
    signboardBtnText: 'text-[#453660]',
    signboardRibbonHanger: 'linear-gradient(180deg, #ffffff 0%, #f9f6fc 60%, #dfd3f2 100%)',
    signboardRibbonDotBg: '#eee4f8',
    signboardBtnStyle: {
      background: 'linear-gradient(135deg, #faf6fd 0%, #eee4fa 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(215, 198, 242, 0.18), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
      color: '#382b52',
    },

    glowTopLeft: 'bg-gradient-to-br from-[#dfd3f2]/60 to-[#ffffff]/90',
    glowBottomRight: 'bg-gradient-to-tl from-[#ede4f8]/65 via-[#f9f6fc]/80 to-[#ffffff]/95',

    noticeBg: 'bg-[#faf7fc]/95',
    noticeBorder: 'border-[#e5d8f3]',
    noticeText: 'text-[#382b52]',
    noticeHighlight: 'text-[#7c5fae]',
    noticeBtnText: 'text-[#382b52]',

    catEarOuter: {
      stop0: '#ffffff',
      stop35: '#f7f3fc',
      stop70: '#dfd2f2',
      stop100: '#c5b1e6',
    },
    catEarInner: {
      stop0: '#faf7fc',
      stop50: '#f0e8f8',
      stop100: '#e1d5f2',
    },

    ribbonText: 'text-[#382b52]',
    ribbonIcon: 'text-[#8b72be]',

    coverCardBorder: 'border-[#e5d8f3]',
    coverInnerBorder: 'border-[#eee6f7]',
    heartIconColor: '#a78bfa',
    titleText: 'text-[#382b52]',
    authorTextMuted: 'text-[#68587d]',
    translatorHighlight: 'text-[#382b52]',
    actionBtnPrimaryText: 'text-[#382b52]',
    actionBtnSecondaryText: 'text-[#453660]',

    tocHeaderBg: 'bg-[#f5effb]/90',
    tocHeaderBorder: 'border-[#e5d8f3]',
    tocHeaderText: 'text-[#382b52]',
    folderIconColor: 'text-[#8b72be]',
    tabActiveText: 'text-[#382b52]',
    tabInactiveText: 'text-[#68587d]',

    spineGradientMobile: 'from-purple-100/40 via-purple-100/20 to-purple-100/40',
    spineGradientDesktop: 'from-purple-100/30 via-purple-100/15 to-purple-100/30',
    spineBorderMobile: 'border-white/80',
    spineBorderDesktop: 'border-white/60',
    ringBorder: 'border-purple-200',
    ringGradient: 'from-white via-[#faf7fd] to-[#ede5f8]',

    searchIconBg: 'from-purple-100/90 to-fuchsia-50/90',
    searchIconText: 'text-[#8b72be]',
    searchPlaceholder: 'placeholder-[#9e8cb8]',

    profileCardHeaderIcon: '#8b72be',
    profileCardHeaderText: 'text-[#68587d]',
    profileTitleText: 'text-[#382b52]',
    tagPillBg: 'bg-[#f5eefb]',
    tagPillText: 'text-[#453660]',
    tagPillBorder: 'border-[#e6d8f5]',
    profileLineColor: 'rgba(140, 115, 185, 0.04)',

    dDayHoleBg: '#f5effb',
    dDayHoleBorder: '#cfbfe8',
    dDayTitleText: 'text-[#68587d]',
    dDayDashedBorder: 'border-[#d8caee]',
    dDayNumberText: 'text-[#382b52]',
    dDayChaptersText: 'text-[#8066b0]',

    washiDividerBg: '#faf7fd',
    washiGridColor: 'rgba(150, 125, 195, 0.16)',
    washiTape1Bg: '#eee6f7',
    washiTape1Border: 'border-purple-200/80',
    washiTape2Bg: '#f5effa',
    washiTape2Border: 'border-purple-200/70',

    accentDot: 'bg-[#8b72be]',
    cardTitle: 'text-[#68587d]',
    cardSubtext: 'text-[#796a90]',
    cardBorder: 'border-[#e8ddf5]/80',
    stripeBarGradient: 'from-[#e2d5f2] via-[#baa4db] to-[#e2d5f2]',
    synopsisGridLine: 'rgba(180, 160, 215, 0.10)',

    chapterDotColor: 'bg-[#8b72be]',
    chapterHoverBg: 'hover:bg-[#faf7fd]',
    chapterTitleText: 'text-[#382b52]',
    chapterTitleHover: 'group-hover:text-[#785da8]',
    chapterExtraBadgeBg: 'bg-[#8b72be]/10',
    chapterExtraBadgeText: 'text-[#68587d]',
    chapterExtraBadgeBorder: 'border-[#d5c7ea]/60',
    chapterDateText: 'text-[#796a90]',
    paginationActiveText: 'text-[#382b52]',
    paginationActiveBg: 'bg-[#f3eaf9]',
    paginationActiveBorder: 'border-[#e2d4f2]',

    commentHeaderIcon: 'text-[#8b72be]',
    commentHeaderText: 'text-[#382b52]',
    commentInputBorder: 'border-[#e5d8f3]',
    commentInputBg: 'bg-white/70',
    commentInputText: 'text-[#382b52]',
    commentPlaceholder: 'placeholder-[#9e8cb8]',
    commentBtnText: 'text-[#382b52]',
    commentItemTitleText: 'text-[#382b52]',
    commentItemDateText: 'text-[#796a90]',
    commentItemContentText: 'text-[#382b52]',

    cardGlassBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 246, 254, 0.90) 100%)',
    profileCardBg: '#fbf8fe',
    ddayCardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(249, 245, 253, 0.92) 100%)',
    washiStripeGradient: 'repeating-linear-gradient(45deg, rgba(160, 135, 205, 0.18) 0px, rgba(160, 135, 205, 0.18) 4px, transparent 4px, transparent 8px)',
    innerBorderColor: 'border-[#e5d8f3]',
    cartoonXGrad: { stop0: '#faf7fd', stop50: '#eee4fa', stop100: '#d8caee' },
    pixelHeartGrad: { stop0: '#faf7fd', stop30: '#eee4fa', stop70: '#d5c7ea', stop100: '#baa4db' },
    introStarGrad: { stop0: '#faf7fd', stop50: '#eee4fa', stop100: '#d8caee' },

    leftColumnBg: {
      backgroundColor: '#faf7fd',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(175, 150, 215, 0.10) 0px, rgba(175, 150, 215, 0.10) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(-45deg, rgba(175, 150, 215, 0.10) 0px, rgba(175, 150, 215, 0.10) 8px, transparent 8px, transparent 16px)',
    },
    leftColumnShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 4px 16px rgba(120,90,165,0.06)',
    rightColumnGrid: {
      backgroundColor: '#ffffff',
      backgroundImage:
        'linear-gradient(rgba(205, 190, 230, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(205, 190, 230, 0.18) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    notebookOuterGlass: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(249, 245, 253, 0.88) 45%, rgba(240, 232, 250, 0.78) 100%)',
      boxShadow:
        '0 24px 55px -8px rgba(120, 90, 165, 0.12), 0 10px 24px -5px rgba(150, 125, 195, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.98), inset 0 -2px 6px rgba(220, 205, 245, 0.15)',
      border: '2px solid rgba(255, 255, 255, 0.92)',
    },
    notebookInnerGlass: {
      background: 'rgba(255, 255, 255, 0.75)',
      boxShadow: 'inset 0 2px 8px rgba(180, 155, 220, 0.08), 0 6px 20px rgba(150, 125, 195, 0.05)',
      border: '1.5px solid rgba(255, 255, 255, 0.96)',
    },
    cardGlassStyle: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 246, 254, 0.90) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(215, 198, 242, 0.14), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    searchBarSoftStyle: {
      background: 'linear-gradient(135deg, #f7f2fc 0%, #faf6fd 100%)',
      boxShadow:
        'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(215, 198, 242, 0.16), 0 4px 14px -3px rgba(150, 125, 195, 0.08)',
      border: '1.5px solid rgba(255, 255, 255, 0.9)',
    },
    btnCandyPrimary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #faf6fe 35%, #eee4fa 75%, #d8caee 100%)',
      boxShadow:
        '0 4px 14px -2px rgba(120, 90, 165, 0.15), 0 1px 3px rgba(120, 90, 165, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(195, 175, 230, 0.15)',
      color: '#382b52',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnCandySecondary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #fdfbff 40%, #f7f2fc 80%, #ebdff7 100%)',
      boxShadow:
        '0 3px 10px -2px rgba(120, 90, 165, 0.12), inset 0 1px 1.5px #ffffff, inset 0 -1.5px 3px rgba(215, 198, 242, 0.12)',
      color: '#453660',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClayPrimary: {
      background: 'linear-gradient(135deg, #faf6fd 0%, #eee4fa 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(215, 198, 242, 0.18), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      color: '#382b52',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
    },
    btnClaySecondary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #faf6fd 50%, #eee4fa 100%)',
      boxShadow:
        '-2px -2px 7px rgba(255, 255, 255, 0.95), 2px 3px 9px rgba(215, 198, 242, 0.12), inset 0 1px 1px #ffffff',
      color: '#453660',
      border: '1.5px solid rgba(255, 255, 255, 0.75)',
    },
    btnClayPill: {
      background: 'linear-gradient(135deg, #faf6fd 0%, #eee4fa 100%)',
      boxShadow: '-2.5px -2.5px 7px rgba(255, 255, 255, 0.95), 2.5px 2.5px 8px rgba(215, 198, 242, 0.14)',
      color: '#382b52',
      border: '1px solid rgba(255, 255, 255, 0.55)',
    },
    tabActiveStyle: {
      background: 'linear-gradient(135deg, #eee4fa 0%, #faf6fd 100%)',
      boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(215, 198, 242, 0.18)',
      color: '#382b52',
      border: '1px solid rgba(255, 255, 255, 0.45)',
    },
    tabInactiveStyle: {
      background: 'linear-gradient(135deg, #faf6fd 0%, #f5effa 100%)',
      color: '#68587d',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    decorShadowXLeft: 'drop-shadow(0 6px 14px rgba(130,100,175,0.22))',
    decorShadowXRight: 'drop-shadow(0 6px 14px rgba(145,115,190,0.20))',
    decorShadowHeart: 'drop-shadow(0 10px 22px rgba(130,100,175,0.25))',
    decorShadowStar: 'drop-shadow(0 10px 22px rgba(130,100,175,0.24))',
    washiDividerFilter: 'drop-shadow(0 2px 4px rgba(130, 100, 175, 0.14))',
    polaroidFrameShadow: '0 8px 24px rgba(130,100,175,0.10)',
    musicPlayerBg: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 246, 254, 0.90) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(215, 198, 242, 0.14)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    musicEqColor1: '#baa4db',
    musicEqColor2: '#a78bfa',
    musicEqColor3: '#8b72be',
    musicVinylCenterBg: '#e3d5f3',
    defaultHeartIdx: 1,
    defaultStarIdx: 2,
    profileCardShadow:
      '0 8px 22px -3px rgba(120,90,165,0.06), inset 0 1px 2px rgba(255,255,255,0.98), inset 0 -1px 3px rgba(215,198,242,0.06)',
    dDayHoleShadow: 'inset 0 1.5px 3px rgba(120, 90, 165, 0.18), 0 1px 1px #ffffff',
    dDayGradientOverlay: 'rgba(250, 246, 254, 0.92)',
    chapterHeaderStripe:
      'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, rgba(215, 198, 242, 0.10) 8px, rgba(215, 198, 242, 0.10) 16px)',
    chapterDividerBorder: 'divide-[#f5effb]',
    paginationBorder: 'border-[#e5d8f3]',
    cardDividerBorder: 'border-[#e5d8f3]/70',
    noticeShadow: '0 8px 24px rgba(120,90,165,0.10)',
    spineSeamVia: 'via-purple-200/15',
    spineShadowMobile: 'inset 0 2px 8px rgba(120,90,165,0.08), inset 0 -2px 8px rgba(120,90,165,0.08)',
    spineShadowDesktop: 'inset 0 2px 8px rgba(120,90,165,0.08)',
    mobileSpringShadow: 'drop-shadow(0 2px 4px rgba(145,115,190,0.15))',
    washi1Shadow: '0 1px 4px rgba(120,90,165,0.12)',
    washi2Shadow: '0 1px 4px rgba(145,115,190,0.12)',
    clayStarGrad: { stop0: '#faf6fd', stop50: '#eee4fa', stop100: '#d8caee' },
  },

  // 3. WHITE / NOTEBOOK (Theme Trắng Ngọc / Bạc Thanh Tao)
  'notebook': {
    id: 'notebook',
    name: 'White',
    pageBgClass: 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#ffffff]',

    awningTopBarBg: 'linear-gradient(180deg, #e2e8f0 0%, #f1f5f9 50%, #f8fafc 100%)',
    awningTopBarBorder: '1px solid #cbd5e1',
    awningStripeColorGradient: {
      stop0: '#ffffff',
      stop25: '#f8fafc',
      stop65: '#e2e8f0',
      stop100: '#cbd5e1',
    },
    awningStripeCreamGradient: {
      stop0: '#ffffff',
      stop45: '#ffffff',
      stop80: '#f8fafc',
      stop100: '#f1f5f9',
    },
    awningBottomLine: '#cbd5e1',

    signboardShadow: 'border-white shadow-[0_10px_28px_rgba(100,116,139,0.16),0_0_18px_rgba(226,232,240,0.65),inset_0_1.5px_1.5px_#ffffff]',
    signboardBoxShadow:
      '0 14px 34px -4px rgba(100,116,139,0.18), 0 6px 16px rgba(226,232,240,0.50), inset 0 1.5px 1.5px #ffffff',
    signboardBg: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 45%, #f1f5f9 100%)',
    signboardSubText: 'text-[#475569]',
    signboardTitleText: 'text-[#1e293b]',
    signboardTextShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff, 0 2px 6px rgba(71,85,105,0.2)',
    signboardBtnText: 'text-[#334155]',
    signboardRibbonHanger: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 60%, #e2e8f0 100%)',
    signboardRibbonDotBg: '#f1f5f9',
    signboardBtnStyle: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(203, 213, 225, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
      color: '#1e293b',
    },

    glowTopLeft: 'bg-gradient-to-br from-[#e2e8f0]/70 to-[#ffffff]/90',
    glowBottomRight: 'bg-gradient-to-tl from-[#f1f5f9]/75 via-[#f8fafc]/85 to-[#ffffff]/95',

    noticeBg: 'bg-[#f8fafc]/95',
    noticeBorder: 'border-[#e2e8f0]',
    noticeText: 'text-[#1e293b]',
    noticeHighlight: 'text-[#3b82f6]',
    noticeBtnText: 'text-[#1e293b]',

    catEarOuter: {
      stop0: '#ffffff',
      stop35: '#f8fafc',
      stop70: '#e2e8f0',
      stop100: '#cbd5e1',
    },
    catEarInner: {
      stop0: '#ffffff',
      stop50: '#f8fafc',
      stop100: '#e2e8f0',
    },

    ribbonText: 'text-[#1e293b]',
    ribbonIcon: 'text-[#64748b]',

    coverCardBorder: 'border-[#e2e8f0]',
    coverInnerBorder: 'border-[#f1f5f9]',
    heartIconColor: '#64748b',
    titleText: 'text-[#1e293b]',
    authorTextMuted: 'text-[#475569]',
    translatorHighlight: 'text-[#1e293b]',
    actionBtnPrimaryText: 'text-[#1e293b]',
    actionBtnSecondaryText: 'text-[#334155]',

    tocHeaderBg: 'bg-[#f1f5f9]/85',
    tocHeaderBorder: 'border-[#e2e8f0]',
    tocHeaderText: 'text-[#1e293b]',
    folderIconColor: 'text-[#64748b]',
    tabActiveText: 'text-[#1e293b]',
    tabInactiveText: 'text-[#475569]',

    spineGradientMobile: 'from-slate-100/60 via-slate-200/35 to-slate-100/60',
    spineGradientDesktop: 'from-slate-100/40 via-slate-200/25 to-slate-100/40',
    spineBorderMobile: 'border-white/80',
    spineBorderDesktop: 'border-white/60',
    ringBorder: 'border-slate-300',
    ringGradient: 'from-white via-[#f8fafc] to-[#e2e8f0]',

    searchIconBg: 'from-slate-200/90 to-zinc-100/90',
    searchIconText: 'text-[#475569]',
    searchPlaceholder: 'placeholder-[#94a3b8]',

    profileCardHeaderIcon: '#64748b',
    profileCardHeaderText: 'text-[#334155]',
    profileTitleText: 'text-[#1e293b]',
    tagPillBg: 'bg-[#f1f5f9]',
    tagPillText: 'text-[#1e293b]',
    tagPillBorder: 'border-[#e2e8f0]',
    profileLineColor: 'rgba(148, 163, 184, 0.04)',

    dDayHoleBg: '#f1f5f9',
    dDayHoleBorder: '#94a3b8',
    dDayTitleText: 'text-[#334155]',
    dDayDashedBorder: 'border-[#cbd5e1]',
    dDayNumberText: 'text-[#1e293b]',
    dDayChaptersText: 'text-[#475569]',

    washiDividerBg: '#f8fafc',
    washiGridColor: 'rgba(148, 163, 184, 0.35)',
    washiTape1Bg: '#e2e8f0',
    washiTape1Border: 'border-slate-300/80',
    washiTape2Bg: '#edf2f7',
    washiTape2Border: 'border-zinc-300/80',

    accentDot: 'bg-[#64748b]',
    cardTitle: 'text-[#334155]',
    cardSubtext: 'text-[#475569]',
    cardBorder: 'border-[#e2e8f0]/80',
    stripeBarGradient: 'from-[#cbd5e1] via-[#94a3b8] to-[#cbd5e1]',
    synopsisGridLine: 'rgba(148, 163, 184, 0.12)',

    chapterDotColor: 'bg-[#64748b]',
    chapterHoverBg: 'hover:bg-[#f8fafc]',
    chapterTitleText: 'text-[#1e293b]',
    chapterTitleHover: 'group-hover:text-[#2563eb]',
    chapterExtraBadgeBg: 'bg-[#3b82f6]/15',
    chapterExtraBadgeText: 'text-[#1d4ed8]',
    chapterExtraBadgeBorder: 'border-[#60a5fa]/40',
    chapterDateText: 'text-[#64748b]',
    paginationActiveText: 'text-[#1e293b]',
    paginationActiveBg: 'bg-[#f1f5f9]',
    paginationActiveBorder: 'border-[#e2e8f0]',

    commentHeaderIcon: 'text-[#64748b]',
    commentHeaderText: 'text-[#1e293b]',
    commentInputBorder: 'border-[#e2e8f0]',
    commentInputBg: 'bg-white/70',
    commentInputText: 'text-[#1e293b]',
    commentPlaceholder: 'placeholder-[#94a3b8]',
    commentBtnText: 'text-[#1e293b]',
    commentItemTitleText: 'text-[#1e293b]',
    commentItemDateText: 'text-[#64748b]',
    commentItemContentText: 'text-[#1e293b]',

    cardGlassBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 252, 0.88) 100%)',
    profileCardBg: '#f8fafc',
    ddayCardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.90) 100%)',
    washiStripeGradient: 'repeating-linear-gradient(45deg, rgba(148, 163, 184, 0.35) 0px, rgba(148, 163, 184, 0.35) 4px, transparent 4px, transparent 8px)',
    innerBorderColor: 'border-[#e2e8f0]',
    cartoonXGrad: { stop0: '#f8fafc', stop50: '#e2e8f0', stop100: '#cbd5e1' },
    pixelHeartGrad: { stop0: '#f8fafc', stop30: '#f1f5f9', stop70: '#e2e8f0', stop100: '#94a3b8' },
    introStarGrad: { stop0: '#f8fafc', stop50: '#e2e8f0', stop100: '#cbd5e1' },

    leftColumnBg: {
      backgroundColor: '#fcfdfe',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(-45deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 8px, transparent 8px, transparent 16px)',
    },
    leftColumnShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 4px 16px rgba(100,116,139,0.08)',
    rightColumnGrid: {
      backgroundColor: '#ffffff',
      backgroundImage:
        'linear-gradient(rgba(203, 213, 225, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(203, 213, 225, 0.25) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    notebookOuterGlass: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.90) 45%, rgba(241, 245, 249, 0.80) 100%)',
      boxShadow:
        '0 24px 55px -8px rgba(100, 116, 139, 0.15), 0 10px 24px -5px rgba(148, 163, 184, 0.10), inset 0 2px 4px rgba(255, 255, 255, 0.98), inset 0 -2px 6px rgba(203, 213, 225, 0.20)',
      border: '2px solid rgba(255, 255, 255, 0.92)',
    },
    notebookInnerGlass: {
      background: 'rgba(255, 255, 255, 0.75)',
      boxShadow: 'inset 0 2px 8px rgba(148, 163, 184, 0.10), 0 6px 20px rgba(100, 116, 139, 0.07)',
      border: '1.5px solid rgba(255, 255, 255, 0.96)',
    },
    cardGlassStyle: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 252, 0.88) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(203, 213, 225, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    searchBarSoftStyle: {
      background: 'linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%)',
      boxShadow:
        'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(203, 213, 225, 0.22), 0 4px 14px -3px rgba(100, 116, 139, 0.10)',
      border: '1.5px solid rgba(255, 255, 255, 0.9)',
    },
    btnCandyPrimary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 35%, #e2e8f0 75%, #cbd5e1 100%)',
      boxShadow:
        '0 4px 14px -2px rgba(100, 116, 139, 0.18), 0 1px 3px rgba(100, 116, 139, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(148, 163, 184, 0.20)',
      color: '#1e293b',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnCandySecondary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #f1f5f9 80%, #e2e8f0 100%)',
      boxShadow:
        '0 3px 10px -2px rgba(100, 116, 139, 0.14), inset 0 1px 1.5px #ffffff, inset 0 -1.5px 3px rgba(203, 213, 225, 0.16)',
      color: '#334155',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClayPrimary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(203, 213, 225, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      color: '#1e293b',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClaySecondary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
      boxShadow:
        '-2px -2px 7px rgba(255, 255, 255, 0.95), 2px 3px 9px rgba(203, 213, 225, 0.16), inset 0 1px 1px #ffffff',
      color: '#334155',
      border: '1px solid rgba(255, 255, 255, 0.75)',
    },
    btnClayPill: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
      boxShadow: '-2.5px -2.5px 7px rgba(255, 255, 255, 0.95), 2.5px 2.5px 8px rgba(203, 213, 225, 0.18)',
      color: '#1e293b',
      border: '1px solid rgba(255, 255, 255, 0.55)',
    },
    tabActiveStyle: {
      background: 'linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%)',
      boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(203, 213, 225, 0.22)',
      color: '#1e293b',
      border: '1px solid rgba(255, 255, 255, 0.45)',
    },
    tabInactiveStyle: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      color: '#475569',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    decorShadowXLeft: 'drop-shadow(0 6px 14px rgba(100,116,139,0.32))',
    decorShadowXRight: 'drop-shadow(0 6px 14px rgba(148,163,184,0.30))',
    decorShadowHeart: 'drop-shadow(0 10px 22px rgba(100,116,139,0.38))',
    decorShadowStar: 'drop-shadow(0 10px 22px rgba(100,116,139,0.36))',
    washiDividerFilter: 'drop-shadow(0 2px 4px rgba(100, 116, 139, 0.18))',
    polaroidFrameShadow: '0 8px 24px rgba(100,116,139,0.14)',
    musicPlayerBg: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 252, 0.88) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(203, 213, 225, 0.16)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    musicEqColor1: '#94a3b8',
    musicEqColor2: '#64748b',
    musicEqColor3: '#475569',
    musicVinylCenterBg: '#cbd5e1',
    defaultHeartIdx: 0,
    defaultStarIdx: 4,
    profileCardShadow:
      '0 8px 22px -3px rgba(100,116,139,0.08), inset 0 1px 2px rgba(255,255,255,0.98), inset 0 -1px 3px rgba(203,213,225,0.08)',
    dDayHoleShadow: 'inset 0 1.5px 3px rgba(100, 116, 139, 0.28), 0 1px 1px #ffffff',
    dDayGradientOverlay: 'rgba(241, 245, 249, 0.90)',
    chapterHeaderStripe:
      'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, rgba(203, 213, 225, 0.14) 8px, rgba(203, 213, 225, 0.14) 16px)',
    chapterDividerBorder: 'divide-[#e2e8f0]',
    paginationBorder: 'border-[#cbd5e1]',
    cardDividerBorder: 'border-[#e2e8f0]/80',
    noticeShadow: '0 8px 24px rgba(100,116,139,0.14)',
    spineSeamVia: 'via-slate-300/15',
    spineShadowMobile: 'inset 0 2px 8px rgba(100,116,139,0.12), inset 0 -2px 8px rgba(100,116,139,0.12)',
    spineShadowDesktop: 'inset 0 2px 8px rgba(100,116,139,0.12)',
    mobileSpringShadow: 'drop-shadow(0 2px 4px rgba(148,163,184,0.22))',
    washi1Shadow: '0 1px 4px rgba(100,116,139,0.18)',
    washi2Shadow: '0 1px 4px rgba(148,163,184,0.18)',
    clayStarGrad: { stop0: '#f8fafc', stop50: '#e2e8f0', stop100: '#cbd5e1' },
  },

  // 4. SAGE (Theme Thảo Mộc / Bạc Hà Thanh Mát - Dịu Nhẹ Mắt)
  'sage': {
    id: 'sage',
    name: 'Sage',
    pageBgClass: 'bg-gradient-to-br from-[#f5f9f6] via-[#edf4ef] to-[#ffffff]',

    awningTopBarBg: 'linear-gradient(180deg, #ccded2 0%, #dce9df 50%, #f0f6f2 100%)',
    awningTopBarBorder: '1px solid #bdd3c4',
    awningStripeColorGradient: {
      stop0: '#ffffff',
      stop25: '#f3f8f4',
      stop65: '#cce0d2',
      stop100: '#a8c7b1',
    },
    awningStripeCreamGradient: {
      stop0: '#ffffff',
      stop45: '#fcfdfc',
      stop80: '#f3f7f4',
      stop100: '#e0ece3',
    },
    awningBottomLine: '#bdd3c4',

    signboardShadow: 'border-white shadow-[0_10px_28px_rgba(45,85,60,0.14),0_0_18px_rgba(195,225,205,0.50),inset_0_1.5px_1.5px_#ffffff]',
    signboardBoxShadow:
      '0 14px 34px -4px rgba(45,85,60,0.16), 0 6px 16px rgba(195,225,205,0.50), inset 0 1.5px 1.5px #ffffff',
    signboardBg: 'linear-gradient(180deg, #ffffff 0%, #f6faf7 45%, #e3eee6 100%)',
    signboardSubText: 'text-[#456150]',
    signboardTitleText: 'text-[#233a2d]',
    signboardTextShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff, 0 2px 6px rgba(45,85,60,0.18)',
    signboardBtnText: 'text-[#314e3e]',
    signboardRibbonHanger: 'linear-gradient(180deg, #ffffff 0%, #f6faf7 60%, #ccded2 100%)',
    signboardRibbonDotBg: '#e2eee6',
    signboardBtnStyle: {
      background: 'linear-gradient(135deg, #f6faf7 0%, #e2eee6 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(195, 222, 205, 0.18), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
      color: '#233a2d',
    },

    glowTopLeft: 'bg-gradient-to-br from-[#ccded2]/60 to-[#ffffff]/90',
    glowBottomRight: 'bg-gradient-to-tl from-[#dce9df]/65 via-[#f6faf7]/80 to-[#ffffff]/95',

    noticeBg: 'bg-[#f5f9f6]/95',
    noticeBorder: 'border-[#cde0d3]',
    noticeText: 'text-[#233a2d]',
    noticeHighlight: 'text-[#3e6b4d]',
    noticeBtnText: 'text-[#233a2d]',

    catEarOuter: {
      stop0: '#ffffff',
      stop35: '#f3f8f5',
      stop70: '#cce0d3',
      stop100: '#a8c7b2',
    },
    catEarInner: {
      stop0: '#f7faf8',
      stop50: '#e5f0e8',
      stop100: '#cce0d3',
    },

    ribbonText: 'text-[#233a2d]',
    ribbonIcon: 'text-[#5f8f6f]',

    coverCardBorder: 'border-[#cde0d3]',
    coverInnerBorder: 'border-[#e3eee6]',
    heartIconColor: '#5f8f6f',
    titleText: 'text-[#233a2d]',
    authorTextMuted: 'text-[#4a6354]',
    translatorHighlight: 'text-[#233a2d]',
    actionBtnPrimaryText: 'text-[#233a2d]',
    actionBtnSecondaryText: 'text-[#314e3e]',

    tocHeaderBg: 'bg-[#edf4ef]/90',
    tocHeaderBorder: 'border-[#cde0d3]',
    tocHeaderText: 'text-[#233a2d]',
    folderIconColor: 'text-[#527d60]',
    tabActiveText: 'text-[#233a2d]',
    tabInactiveText: 'text-[#4a6354]',

    spineGradientMobile: 'from-emerald-100/40 via-emerald-100/20 to-emerald-100/40',
    spineGradientDesktop: 'from-emerald-100/30 via-emerald-100/15 to-emerald-100/30',
    spineBorderMobile: 'border-white/80',
    spineBorderDesktop: 'border-white/60',
    ringBorder: 'border-emerald-200',
    ringGradient: 'from-white via-[#f7faf8] to-[#e0ece3]',

    searchIconBg: 'from-emerald-100/90 to-teal-50/90',
    searchIconText: 'text-[#527d60]',
    searchPlaceholder: 'placeholder-[#7a9d86]',

    profileCardHeaderIcon: '#527d60',
    profileCardHeaderText: 'text-[#4a6354]',
    profileTitleText: 'text-[#233a2d]',
    tagPillBg: 'bg-[#edf4ef]',
    tagPillText: 'text-[#314e3e]',
    tagPillBorder: 'border-[#cde0d3]',
    profileLineColor: 'rgba(95, 143, 111, 0.04)',

    dDayHoleBg: '#edf4ef',
    dDayHoleBorder: '#bdd3c4',
    dDayTitleText: 'text-[#4a6354]',
    dDayDashedBorder: 'border-[#cce0d2]',
    dDayNumberText: 'text-[#233a2d]',
    dDayChaptersText: 'text-[#4a7258]',

    washiDividerBg: '#f7faf8',
    washiGridColor: 'rgba(95, 143, 111, 0.16)',
    washiTape1Bg: '#e2eee6',
    washiTape1Border: 'border-emerald-200/80',
    washiTape2Bg: '#edf4ef',
    washiTape2Border: 'border-emerald-200/70',

    accentDot: 'bg-[#5f8f6f]',
    cardTitle: 'text-[#4a6354]',
    cardSubtext: 'text-[#5a7665]',
    cardBorder: 'border-[#d4e4d9]/80',
    stripeBarGradient: 'from-[#cce0d2] via-[#9ec2a8] to-[#cce0d2]',
    synopsisGridLine: 'rgba(120, 160, 135, 0.10)',

    chapterDotColor: 'bg-[#5f8f6f]',
    chapterHoverBg: 'hover:bg-[#f7faf8]',
    chapterTitleText: 'text-[#233a2d]',
    chapterTitleHover: 'group-hover:text-[#426a51]',
    chapterExtraBadgeBg: 'bg-[#5f8f6f]/10',
    chapterExtraBadgeText: 'text-[#4a6354]',
    chapterExtraBadgeBorder: 'border-[#bdd3c4]/60',
    chapterDateText: 'text-[#5a7665]',
    paginationActiveText: 'text-[#233a2d]',
    paginationActiveBg: 'bg-[#e2eee6]',
    paginationActiveBorder: 'border-[#cde0d3]',

    commentHeaderIcon: 'text-[#527d60]',
    commentHeaderText: 'text-[#233a2d]',
    commentInputBorder: 'border-[#cde0d3]',
    commentInputBg: 'bg-white/70',
    commentInputText: 'text-[#233a2d]',
    commentPlaceholder: 'placeholder-[#7a9d86]',
    commentBtnText: 'text-[#233a2d]',
    commentItemTitleText: 'text-[#233a2d]',
    commentItemDateText: 'text-[#5a7665]',
    commentItemContentText: 'text-[#233a2d]',

    cardGlassBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(246, 251, 248, 0.90) 100%)',
    profileCardBg: '#f9fcf9',
    ddayCardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(244, 249, 246, 0.92) 100%)',
    washiStripeGradient: 'repeating-linear-gradient(45deg, rgba(120, 160, 135, 0.18) 0px, rgba(120, 160, 135, 0.18) 4px, transparent 4px, transparent 8px)',
    innerBorderColor: 'border-[#cde0d3]',
    cartoonXGrad: { stop0: '#f7faf8', stop50: '#e5f0e8', stop100: '#cce0d2' },
    pixelHeartGrad: { stop0: '#f7faf8', stop30: '#e5f0e8', stop70: '#bdd3c4', stop100: '#9ec2a8' },
    introStarGrad: { stop0: '#f7faf8', stop50: '#e5f0e8', stop100: '#cce0d2' },

    leftColumnBg: {
      backgroundColor: '#f7faf8',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(140, 180, 155, 0.10) 0px, rgba(140, 180, 155, 0.10) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(-45deg, rgba(140, 180, 155, 0.10) 0px, rgba(140, 180, 155, 0.10) 8px, transparent 8px, transparent 16px)',
    },
    leftColumnShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 4px 16px rgba(45,85,60,0.06)',
    rightColumnGrid: {
      backgroundColor: '#ffffff',
      backgroundImage:
        'linear-gradient(rgba(180, 210, 190, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(180, 210, 190, 0.18) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    notebookOuterGlass: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(246, 251, 248, 0.88) 45%, rgba(230, 242, 234, 0.78) 100%)',
      boxShadow:
        '0 24px 55px -8px rgba(45, 85, 60, 0.12), 0 10px 24px -5px rgba(80, 130, 100, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.98), inset 0 -2px 6px rgba(200, 225, 210, 0.15)',
      border: '2px solid rgba(255, 255, 255, 0.92)',
    },
    notebookInnerGlass: {
      background: 'rgba(255, 255, 255, 0.75)',
      boxShadow: 'inset 0 2px 8px rgba(160, 200, 175, 0.08), 0 6px 20px rgba(80, 130, 100, 0.05)',
      border: '1.5px solid rgba(255, 255, 255, 0.96)',
    },
    cardGlassStyle: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(246, 251, 248, 0.90) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(195, 222, 205, 0.14), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    searchBarSoftStyle: {
      background: 'linear-gradient(135deg, #f0f6f2 0%, #f6faf7 100%)',
      boxShadow:
        'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(195, 222, 205, 0.16), 0 4px 14px -3px rgba(80, 130, 100, 0.08)',
      border: '1.5px solid rgba(255, 255, 255, 0.9)',
    },
    btnCandyPrimary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f6faf7 35%, #e1eee5 75%, #bdd5c4 100%)',
      boxShadow:
        '0 4px 14px -2px rgba(45, 85, 60, 0.15), 0 1px 3px rgba(45, 85, 60, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(175, 210, 185, 0.15)',
      color: '#233a2d',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnCandySecondary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #fcfdfc 40%, #f1f7f3 80%, #e2eee6 100%)',
      boxShadow:
        '0 3px 10px -2px rgba(45, 85, 60, 0.12), inset 0 1px 1.5px #ffffff, inset 0 -1.5px 3px rgba(195, 222, 205, 0.12)',
      color: '#314e3e',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClayPrimary: {
      background: 'linear-gradient(135deg, #f6faf7 0%, #e2eee6 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(195, 222, 205, 0.18), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      color: '#233a2d',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClaySecondary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f6faf7 50%, #e2eee6 100%)',
      boxShadow:
        '-2px -2px 7px rgba(255, 255, 255, 0.95), 2px 3px 9px rgba(195, 222, 205, 0.12), inset 0 1px 1px #ffffff',
      color: '#314e3e',
      border: '1px solid rgba(255, 255, 255, 0.75)',
    },
    btnClayPill: {
      background: 'linear-gradient(135deg, #f6faf7 0%, #e2eee6 100%)',
      boxShadow: '-2.5px -2.5px 7px rgba(255, 255, 255, 0.95), 2.5px 2.5px 8px rgba(195, 222, 205, 0.14)',
      color: '#233a2d',
      border: '1px solid rgba(255, 255, 255, 0.55)',
    },
    tabActiveStyle: {
      background: 'linear-gradient(135deg, #e2eee6 0%, #f6faf7 100%)',
      boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(195, 222, 205, 0.18)',
      color: '#233a2d',
      border: '1px solid rgba(255, 255, 255, 0.45)',
    },
    tabInactiveStyle: {
      background: 'linear-gradient(135deg, #f6faf7 0%, #eff5f1 100%)',
      color: '#4a6354',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    decorShadowXLeft: 'drop-shadow(0 6px 14px rgba(45,85,60,0.22))',
    decorShadowXRight: 'drop-shadow(0 6px 14px rgba(65,105,80,0.20))',
    decorShadowHeart: 'drop-shadow(0 10px 22px rgba(45,85,60,0.25))',
    decorShadowStar: 'drop-shadow(0 10px 22px rgba(45,85,60,0.24))',
    washiDividerFilter: 'drop-shadow(0 2px 4px rgba(45, 85, 60, 0.14))',
    polaroidFrameShadow: '0 8px 24px rgba(45,85,60,0.10)',
    musicPlayerBg: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(246, 251, 248, 0.90) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(195, 222, 205, 0.14)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    musicEqColor1: '#a3c4ad',
    musicEqColor2: '#7ea98c',
    musicEqColor3: '#5f8f6f',
    musicVinylCenterBg: '#d2e5d7',
    defaultHeartIdx: 4,
    defaultStarIdx: 4,
    profileCardShadow:
      '0 8px 22px -3px rgba(45,85,60,0.06), inset 0 1px 2px rgba(255,255,255,0.98), inset 0 -1px 3px rgba(195,222,205,0.06)',
    dDayHoleShadow: 'inset 0 1.5px 3px rgba(45, 85, 60, 0.18), 0 1px 1px #ffffff',
    dDayGradientOverlay: 'rgba(244, 249, 246, 0.92)',
    chapterHeaderStripe:
      'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, rgba(195, 222, 205, 0.10) 8px, rgba(195, 222, 205, 0.10) 16px)',
    chapterDividerBorder: 'divide-[#edf4ef]',
    paginationBorder: 'border-[#cde0d3]',
    cardDividerBorder: 'border-[#cde0d3]/70',
    noticeShadow: '0 8px 24px rgba(45,85,60,0.10)',
    spineSeamVia: 'via-emerald-200/15',
    spineShadowMobile: 'inset 0 2px 8px rgba(45,85,60,0.08), inset 0 -2px 8px rgba(45,85,60,0.08)',
    spineShadowDesktop: 'inset 0 2px 8px rgba(45,85,60,0.08)',
    mobileSpringShadow: 'drop-shadow(0 2px 4px rgba(80,130,100,0.15))',
    washi1Shadow: '0 1px 4px rgba(45,85,60,0.12)',
    washi2Shadow: '0 1px 4px rgba(65,105,80,0.12)',
    clayStarGrad: { stop0: '#f7faf8', stop50: '#e5f0e8', stop100: '#cce0d2' },
  },

  // 5. LINEN / MOCHA (Theme Vải Đay Linen Mộc Mạc / Cát Ấm Áp - Dịu Nhẹ Mắt)
  'mocha': {
    id: 'mocha',
    name: 'Linen',
    pageBgClass: 'bg-gradient-to-br from-[#faf6f2] via-[#f3ebe4] to-[#ffffff]',

    awningTopBarBg: 'linear-gradient(180deg, #e4d7cd 0%, #eee4dc 50%, #f7f2ed 100%)',
    awningTopBarBorder: '1px solid #d8c8bc',
    awningStripeColorGradient: {
      stop0: '#ffffff',
      stop25: '#faf5f0',
      stop65: '#ded2c7',
      stop100: '#c2b0a2',
    },
    awningStripeCreamGradient: {
      stop0: '#ffffff',
      stop45: '#fdfbf9',
      stop80: '#f8f4f0',
      stop100: '#ebe1d8',
    },
    awningBottomLine: '#d8c8bc',

    signboardShadow: 'border-white shadow-[0_10px_28px_rgba(110,85,70,0.14),0_0_18px_rgba(225,210,195,0.50),inset_0_1.5px_1.5px_#ffffff]',
    signboardBoxShadow:
      '0 14px 34px -4px rgba(110,85,70,0.16), 0 6px 16px rgba(225,210,195,0.50), inset 0 1.5px 1.5px #ffffff',
    signboardBg: 'linear-gradient(180deg, #ffffff 0%, #fbf8f5 45%, #ede3dc 100%)',
    signboardSubText: 'text-[#6b584e]',
    signboardTitleText: 'text-[#3e3029]',
    signboardTextShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff, 0 2px 6px rgba(110,85,70,0.18)',
    signboardBtnText: 'text-[#554238]',
    signboardRibbonHanger: 'linear-gradient(180deg, #ffffff 0%, #fbf8f5 60%, #e4d7cd 100%)',
    signboardRibbonDotBg: '#eee3da',
    signboardBtnStyle: {
      background: 'linear-gradient(135deg, #fbf8f5 0%, #eee3da 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(220, 205, 195, 0.18), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
      color: '#3e3029',
    },

    glowTopLeft: 'bg-gradient-to-br from-[#e4d7cd]/60 to-[#ffffff]/90',
    glowBottomRight: 'bg-gradient-to-tl from-[#eee4dc]/65 via-[#fbf8f5]/80 to-[#ffffff]/95',

    noticeBg: 'bg-[#faf6f2]/95',
    noticeBorder: 'border-[#ded2c7]',
    noticeText: 'text-[#3e3029]',
    noticeHighlight: 'text-[#7d5e4f]',
    noticeBtnText: 'text-[#3e3029]',

    catEarOuter: {
      stop0: '#ffffff',
      stop35: '#faf5f0',
      stop70: '#ded2c7',
      stop100: '#c2b0a2',
    },
    catEarInner: {
      stop0: '#fcf9f6',
      stop50: '#efe6de',
      stop100: '#ded2c7',
    },

    ribbonText: 'text-[#3e3029]',
    ribbonIcon: 'text-[#8c6d5d]',

    coverCardBorder: 'border-[#ded2c7]',
    coverInnerBorder: 'border-[#ede3da]',
    heartIconColor: '#a88877',
    titleText: 'text-[#3e3029]',
    authorTextMuted: 'text-[#6a584e]',
    translatorHighlight: 'text-[#3e3029]',
    actionBtnPrimaryText: 'text-[#3e3029]',
    actionBtnSecondaryText: 'text-[#554238]',

    tocHeaderBg: 'bg-[#f3ebe4]/90',
    tocHeaderBorder: 'border-[#ded2c7]',
    tocHeaderText: 'text-[#3e3029]',
    folderIconColor: 'text-[#8c6d5d]',
    tabActiveText: 'text-[#3e3029]',
    tabInactiveText: 'text-[#6a584e]',

    spineGradientMobile: 'from-stone-100/40 via-stone-100/20 to-stone-100/40',
    spineGradientDesktop: 'from-stone-100/30 via-stone-100/15 to-stone-100/30',
    spineBorderMobile: 'border-white/80',
    spineBorderDesktop: 'border-white/60',
    ringBorder: 'border-stone-200',
    ringGradient: 'from-white via-[#faf6f2] to-[#ebe1d8]',

    searchIconBg: 'from-stone-100/90 to-orange-50/90',
    searchIconText: 'text-[#8c6d5d]',
    searchPlaceholder: 'placeholder-[#9c8578]',

    profileCardHeaderIcon: '#8c6d5d',
    profileCardHeaderText: 'text-[#6a584e]',
    profileTitleText: 'text-[#3e3029]',
    tagPillBg: 'bg-[#f3ebe4]',
    tagPillText: 'text-[#554238]',
    tagPillBorder: 'border-[#ded2c7]',
    profileLineColor: 'rgba(140, 110, 95, 0.04)',

    dDayHoleBg: '#f3ebe4',
    dDayHoleBorder: '#c2b0a2',
    dDayTitleText: 'text-[#6a584e]',
    dDayDashedBorder: 'border-[#ded2c7]',
    dDayNumberText: 'text-[#3e3029]',
    dDayChaptersText: 'text-[#7d5e4f]',

    washiDividerBg: '#fbf8f5',
    washiGridColor: 'rgba(140, 110, 95, 0.16)',
    washiTape1Bg: '#ede3dc',
    washiTape1Border: 'border-stone-200/80',
    washiTape2Bg: '#f3ebe4',
    washiTape2Border: 'border-stone-200/70',

    accentDot: 'bg-[#8c6d5d]',
    cardTitle: 'text-[#6a584e]',
    cardSubtext: 'text-[#7e6b60]',
    cardBorder: 'border-[#e4d8cf]/80',
    stripeBarGradient: 'from-[#ded2c7] via-[#b8a395] to-[#ded2c7]',
    synopsisGridLine: 'rgba(140, 110, 95, 0.10)',

    chapterDotColor: 'bg-[#8c6d5d]',
    chapterHoverBg: 'hover:bg-[#fbf8f5]',
    chapterTitleText: 'text-[#3e3029]',
    chapterTitleHover: 'group-hover:text-[#6a584e]',
    chapterExtraBadgeBg: 'bg-[#8c6d5d]/10',
    chapterExtraBadgeText: 'text-[#6a584e]',
    chapterExtraBadgeBorder: 'border-[#c2b0a2]/60',
    chapterDateText: 'text-[#7e6b60]',
    paginationActiveText: 'text-[#3e3029]',
    paginationActiveBg: 'bg-[#ede3dc]',
    paginationActiveBorder: 'border-[#ded2c7]',

    commentHeaderIcon: 'text-[#8c6d5d]',
    commentHeaderText: 'text-[#3e3029]',
    commentInputBorder: 'border-[#ded2c7]',
    commentInputBg: 'bg-white/70',
    commentInputText: 'text-[#3e3029]',
    commentPlaceholder: 'placeholder-[#9c8578]',
    commentBtnText: 'text-[#3e3029]',
    commentItemTitleText: 'text-[#3e3029]',
    commentItemDateText: 'text-[#7e6b60]',
    commentItemContentText: 'text-[#3e3029]',

    cardGlassBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(251, 248, 245, 0.90) 100%)',
    profileCardBg: '#fdfbfa',
    ddayCardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(249, 246, 243, 0.92) 100%)',
    washiStripeGradient: 'repeating-linear-gradient(45deg, rgba(140, 110, 95, 0.18) 0px, rgba(140, 110, 95, 0.18) 4px, transparent 4px, transparent 8px)',
    innerBorderColor: 'border-[#ded2c7]',
    cartoonXGrad: { stop0: '#fbf8f5', stop50: '#eee3da', stop100: '#ded2c7' },
    pixelHeartGrad: { stop0: '#fbf8f5', stop30: '#eee3da', stop70: '#c2b0a2', stop100: '#a88877' },
    introStarGrad: { stop0: '#fbf8f5', stop50: '#eee3da', stop100: '#ded2c7' },

    leftColumnBg: {
      backgroundColor: '#fbf8f5',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(165, 140, 125, 0.10) 0px, rgba(165, 140, 125, 0.10) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(-45deg, rgba(165, 140, 125, 0.10) 0px, rgba(165, 140, 125, 0.10) 8px, transparent 8px, transparent 16px)',
    },
    leftColumnShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 4px 16px rgba(110,85,70,0.06)',
    rightColumnGrid: {
      backgroundColor: '#ffffff',
      backgroundImage:
        'linear-gradient(rgba(215, 195, 180, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(215, 195, 180, 0.18) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    notebookOuterGlass: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(251, 248, 245, 0.88) 45%, rgba(242, 234, 227, 0.78) 100%)',
      boxShadow:
        '0 24px 55px -8px rgba(110, 85, 70, 0.12), 0 10px 24px -5px rgba(160, 135, 120, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.98), inset 0 -2px 6px rgba(225, 210, 195, 0.15)',
      border: '2px solid rgba(255, 255, 255, 0.92)',
    },
    notebookInnerGlass: {
      background: 'rgba(255, 255, 255, 0.75)',
      boxShadow: 'inset 0 2px 8px rgba(190, 165, 150, 0.08), 0 6px 20px rgba(160, 135, 120, 0.05)',
      border: '1.5px solid rgba(255, 255, 255, 0.96)',
    },
    cardGlassStyle: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(251, 248, 245, 0.90) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(220, 205, 195, 0.14), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    searchBarSoftStyle: {
      background: 'linear-gradient(135deg, #f7f2ed 0%, #fbf8f5 100%)',
      boxShadow:
        'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(220, 205, 195, 0.16), 0 4px 14px -3px rgba(160, 135, 120, 0.08)',
      border: '1.5px solid rgba(255, 255, 255, 0.9)',
    },
    btnCandyPrimary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #faf6f2 35%, #eee3da 75%, #d5c3b5 100%)',
      boxShadow:
        '0 4px 14px -2px rgba(110, 85, 70, 0.15), 0 1px 3px rgba(110, 85, 70, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(200, 180, 165, 0.15)',
      color: '#3e3029',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnCandySecondary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #fdfbf9 40%, #f7f1eb 80%, #ebe0d6 100%)',
      boxShadow:
        '0 3px 10px -2px rgba(110, 85, 70, 0.12), inset 0 1px 1.5px #ffffff, inset 0 -1.5px 3px rgba(220, 205, 195, 0.12)',
      color: '#554238',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClayPrimary: {
      background: 'linear-gradient(135deg, #fbf8f5 0%, #eee3da 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(220, 205, 195, 0.18), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      color: '#3e3029',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClaySecondary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #fbf8f5 50%, #eee3da 100%)',
      boxShadow:
        '-2px -2px 7px rgba(255, 255, 255, 0.95), 2px 3px 9px rgba(220, 205, 195, 0.12), inset 0 1px 1px #ffffff',
      color: '#554238',
      border: '1px solid rgba(255, 255, 255, 0.75)',
    },
    btnClayPill: {
      background: 'linear-gradient(135deg, #fbf8f5 0%, #eee3da 100%)',
      boxShadow: '-2.5px -2.5px 7px rgba(255, 255, 255, 0.95), 2.5px 2.5px 8px rgba(220, 205, 195, 0.14)',
      color: '#3e3029',
      border: '1px solid rgba(255, 255, 255, 0.55)',
    },
    tabActiveStyle: {
      background: 'linear-gradient(135deg, #eee3da 0%, #fbf8f5 100%)',
      boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(220, 205, 195, 0.18)',
      color: '#3e3029',
      border: '1px solid rgba(255, 255, 255, 0.45)',
    },
    tabInactiveStyle: {
      background: 'linear-gradient(135deg, #fbf8f5 0%, #f5efe8 100%)',
      color: '#6a584e',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    decorShadowXLeft: 'drop-shadow(0 6px 14px rgba(110,85,70,0.22))',
    decorShadowXRight: 'drop-shadow(0 6px 14px rgba(135,110,95,0.20))',
    decorShadowHeart: 'drop-shadow(0 10px 22px rgba(110,85,70,0.25))',
    decorShadowStar: 'drop-shadow(0 10px 22px rgba(110,85,70,0.24))',
    washiDividerFilter: 'drop-shadow(0 2px 4px rgba(110, 85, 70, 0.14))',
    polaroidFrameShadow: '0 8px 24px rgba(110,85,70,0.10)',
    musicPlayerBg: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(251, 248, 245, 0.90) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(220, 205, 195, 0.14)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    musicEqColor1: '#c7b5a7',
    musicEqColor2: '#a88877',
    musicEqColor3: '#8c6d5d',
    musicVinylCenterBg: '#e2d5cb',
    defaultHeartIdx: 3,
    defaultStarIdx: 1,
    profileCardShadow:
      '0 8px 22px -3px rgba(110,85,70,0.06), inset 0 1px 2px rgba(255,255,255,0.98), inset 0 -1px 3px rgba(220,205,195,0.06)',
    dDayHoleShadow: 'inset 0 1.5px 3px rgba(110, 85, 70, 0.18), 0 1px 1px #ffffff',
    dDayGradientOverlay: 'rgba(251, 248, 245, 0.92)',
    chapterHeaderStripe:
      'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, rgba(220, 205, 195, 0.10) 8px, rgba(220, 205, 195, 0.10) 16px)',
    chapterDividerBorder: 'divide-[#f3ebe4]',
    paginationBorder: 'border-[#ded2c7]',
    cardDividerBorder: 'border-[#ded2c7]/70',
    noticeShadow: '0 8px 24px rgba(110,85,70,0.10)',
    spineSeamVia: 'via-stone-200/15',
    spineShadowMobile: 'inset 0 2px 8px rgba(110,85,70,0.08), inset 0 -2px 8px rgba(110,85,70,0.08)',
    spineShadowDesktop: 'inset 0 2px 8px rgba(110,85,70,0.08)',
    mobileSpringShadow: 'drop-shadow(0 2px 4px rgba(135,110,95,0.15))',
    washi1Shadow: '0 1px 4px rgba(110,85,70,0.12)',
    washi2Shadow: '0 1px 4px rgba(135,110,95,0.12)',
    clayStarGrad: { stop0: '#fbf8f5', stop50: '#eee3da', stop100: '#ded2c7' },
  },

  // 6. LULULEMON (Theme Hồng Dâu / Phấn Hoa Mộng Mơ)
  'lululemon': {
    id: 'lululemon',
    name: 'Lululemon',
    pageBgClass: 'bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#fff5f7]',

    awningTopBarBg: 'linear-gradient(180deg, #fce7f3 0%, #fdf2f8 50%, #fff1f2 100%)',
    awningTopBarBorder: '1px solid #fbcfe8',
    awningStripeColorGradient: {
      stop0: '#ffffff',
      stop25: '#fdf2f8',
      stop65: '#fbcfe8',
      stop100: '#f472b6',
    },
    awningStripeCreamGradient: {
      stop0: '#ffffff',
      stop45: '#fff5f8',
      stop80: '#fdf2f8',
      stop100: '#fce7f3',
    },
    awningBottomLine: '#fbcfe8',

    signboardShadow: 'border-white shadow-[0_10px_28px_rgba(190,24,93,0.15),0_0_18px_rgba(251,207,232,0.65),inset_0_1.5px_1.5px_#ffffff]',
    signboardBoxShadow:
      '0 14px 34px -4px rgba(190,24,93,0.16), 0 6px 16px rgba(251,207,232,0.50), inset 0 1.5px 1.5px #ffffff',
    signboardBg: 'linear-gradient(180deg, #ffffff 0%, #fdf2f8 45%, #fce7f3 100%)',
    signboardSubText: 'text-[#be185d]',
    signboardTitleText: 'text-[#831843]',
    signboardTextShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff, 0 2px 6px rgba(190,24,93,0.2)',
    signboardBtnText: 'text-[#9d174d]',
    signboardRibbonHanger: 'linear-gradient(180deg, #ffffff 0%, #fdf2f8 60%, #fce7f3 100%)',
    signboardRibbonDotBg: '#fdf2f8',
    signboardBtnStyle: {
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(251, 207, 232, 0.25), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
      color: '#831843',
    },

    glowTopLeft: 'bg-gradient-to-br from-[#fce7f3]/70 to-[#ffffff]/90',
    glowBottomRight: 'bg-gradient-to-tl from-[#fdf2f8]/75 via-[#fff5f7]/85 to-[#ffffff]/95',

    noticeBg: 'bg-[#fdf2f8]/95',
    noticeBorder: 'border-[#fbcfe8]',
    noticeText: 'text-[#831843]',
    noticeHighlight: 'text-[#db2777]',
    noticeBtnText: 'text-[#831843]',

    catEarOuter: {
      stop0: '#ffffff',
      stop35: '#fdf2f8',
      stop70: '#fbcfe8',
      stop100: '#f472b6',
    },
    catEarInner: {
      stop0: '#fff5f7',
      stop50: '#fde8f2',
      stop100: '#fbcfe8',
    },

    ribbonText: 'text-[#831843]',
    ribbonIcon: 'text-[#db2777]',

    coverCardBorder: 'border-[#fbcfe8]',
    coverInnerBorder: 'border-[#fce7f3]',
    heartIconColor: '#ec4899',
    titleText: 'text-[#831843]',
    authorTextMuted: 'text-[#9d174d]',
    translatorHighlight: 'text-[#831843]',
    actionBtnPrimaryText: 'text-[#831843]',
    actionBtnSecondaryText: 'text-[#9d174d]',

    tocHeaderBg: 'bg-[#fce7f3]/85',
    tocHeaderBorder: 'border-[#fbcfe8]',
    tocHeaderText: 'text-[#831843]',
    folderIconColor: 'text-[#db2777]',
    tabActiveText: 'text-[#831843]',
    tabInactiveText: 'text-[#be185d]',

    spineGradientMobile: 'from-pink-100/60 via-pink-200/35 to-pink-100/60',
    spineGradientDesktop: 'from-pink-100/40 via-pink-200/25 to-pink-100/40',
    spineBorderMobile: 'border-white/80',
    spineBorderDesktop: 'border-white/60',
    ringBorder: 'border-pink-300',
    ringGradient: 'from-white via-[#fdf2f8] to-[#fce7f3]',

    searchIconBg: 'from-pink-200/90 to-rose-100/90',
    searchIconText: 'text-[#db2777]',
    searchPlaceholder: 'placeholder-[#f472b6]/70',

    profileCardHeaderIcon: '#db2777',
    profileCardHeaderText: 'text-[#be185d]',
    profileTitleText: 'text-[#831843]',
    tagPillBg: 'bg-[#fce7f3]',
    tagPillText: 'text-[#831843]',
    tagPillBorder: 'border-[#fbcfe8]',
    profileLineColor: 'rgba(236, 72, 153, 0.04)',

    dDayHoleBg: '#fce7f3',
    dDayHoleBorder: '#f472b6',
    dDayTitleText: 'text-[#be185d]',
    dDayDashedBorder: 'border-[#fbcfe8]',
    dDayNumberText: 'text-[#831843]',
    dDayChaptersText: 'text-[#db2777]',

    washiDividerBg: '#fdf2f8',
    washiGridColor: 'rgba(236, 72, 153, 0.35)',
    washiTape1Bg: '#fce7f3',
    washiTape1Border: 'border-pink-300/80',
    washiTape2Bg: '#ffe4e6',
    washiTape2Border: 'border-rose-300/80',

    accentDot: 'bg-[#db2777]',
    cardTitle: 'text-[#be185d]',
    cardSubtext: 'text-[#9d174d]',
    cardBorder: 'border-[#fbcfe8]/80',
    stripeBarGradient: 'from-[#fbcfe8] via-[#ec4899] to-[#fbcfe8]',
    synopsisGridLine: 'rgba(236, 72, 153, 0.12)',

    chapterDotColor: 'bg-[#db2777]',
    chapterHoverBg: 'hover:bg-[#fdf2f8]',
    chapterTitleText: 'text-[#831843]',
    chapterTitleHover: 'group-hover:text-[#db2777]',
    chapterExtraBadgeBg: 'bg-[#ec4899]/15',
    chapterExtraBadgeText: 'text-[#be185d]',
    chapterExtraBadgeBorder: 'border-[#f472b6]/40',
    chapterDateText: 'text-[#be185d]',
    paginationActiveText: 'text-[#831843]',
    paginationActiveBg: 'bg-[#fce7f3]',
    paginationActiveBorder: 'border-[#fbcfe8]',

    commentHeaderIcon: 'text-[#db2777]',
    commentHeaderText: 'text-[#831843]',
    commentInputBorder: 'border-[#fbcfe8]',
    commentInputBg: 'bg-white/70',
    commentInputText: 'text-[#831843]',
    commentPlaceholder: 'placeholder-[#f472b6]/70',
    commentBtnText: 'text-[#831843]',
    commentItemTitleText: 'text-[#831843]',
    commentItemDateText: 'text-[#be185d]',
    commentItemContentText: 'text-[#831843]',

    cardGlassBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(253, 242, 248, 0.88) 100%)',
    profileCardBg: '#fdf2f8',
    ddayCardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(252, 231, 243, 0.90) 100%)',
    washiStripeGradient: 'repeating-linear-gradient(45deg, rgba(236, 72, 153, 0.35) 0px, rgba(236, 72, 153, 0.35) 4px, transparent 4px, transparent 8px)',
    innerBorderColor: 'border-[#fbcfe8]',
    cartoonXGrad: { stop0: '#fdf2f8', stop50: '#fce7f3', stop100: '#fbcfe8' },
    pixelHeartGrad: { stop0: '#fdf2f8', stop30: '#fde8f2', stop70: '#fbcfe8', stop100: '#ec4899' },
    introStarGrad: { stop0: '#fdf2f8', stop50: '#fce7f3', stop100: '#fbcfe8' },

    leftColumnBg: {
      backgroundColor: '#fff7fa',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(236, 72, 153, 0.08) 0px, rgba(236, 72, 153, 0.08) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(-45deg, rgba(236, 72, 153, 0.08) 0px, rgba(236, 72, 153, 0.08) 8px, transparent 8px, transparent 16px)',
    },
    leftColumnShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 4px 16px rgba(190,24,93,0.10)',
    rightColumnGrid: {
      backgroundColor: '#ffffff',
      backgroundImage:
        'linear-gradient(rgba(251, 207, 232, 0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 207, 232, 0.28) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    notebookOuterGlass: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(253, 242, 248, 0.85) 45%, rgba(252, 231, 243, 0.75) 100%)',
      boxShadow:
        '0 24px 55px -8px rgba(190, 24, 93, 0.15), 0 10px 24px -5px rgba(236, 72, 153, 0.10), inset 0 2px 4px rgba(255, 255, 255, 0.98), inset 0 -2px 6px rgba(251, 207, 232, 0.22)',
      border: '2px solid rgba(255, 255, 255, 0.92)',
    },
    notebookInnerGlass: {
      background: 'rgba(255, 255, 255, 0.75)',
      boxShadow: 'inset 0 2px 8px rgba(244, 114, 182, 0.12), 0 6px 20px rgba(236, 72, 153, 0.08)',
      border: '1.5px solid rgba(255, 255, 255, 0.96)',
    },
    cardGlassStyle: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(253, 242, 248, 0.88) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(251, 207, 232, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    searchBarSoftStyle: {
      background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)',
      boxShadow:
        'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(251, 207, 232, 0.22), 0 4px 14px -3px rgba(236, 72, 153, 0.12)',
      border: '1.5px solid rgba(255, 255, 255, 0.9)',
    },
    btnCandyPrimary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #fdf2f8 35%, #fce7f3 75%, #f472b6 100%)',
      boxShadow:
        '0 4px 14px -2px rgba(190, 24, 93, 0.22), 0 1px 3px rgba(190, 24, 93, 0.10), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(244, 114, 182, 0.22)',
      color: '#831843',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnCandySecondary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #fff5f8 40%, #fdf2f8 80%, #fce7f3 100%)',
      boxShadow:
        '0 3px 10px -2px rgba(190, 24, 93, 0.16), inset 0 1px 1.5px #ffffff, inset 0 -1.5px 3px rgba(251, 207, 232, 0.16)',
      color: '#9d174d',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClayPrimary: {
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(251, 207, 232, 0.25), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      color: '#831843',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClaySecondary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #fce7f3 100%)',
      boxShadow:
        '-2px -2px 7px rgba(255, 255, 255, 0.95), 2px 3px 9px rgba(251, 207, 232, 0.16), inset 0 1px 1px #ffffff',
      color: '#9d174d',
      border: '1px solid rgba(255, 255, 255, 0.75)',
    },
    btnClayPill: {
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      boxShadow: '-2.5px -2.5px 7px rgba(255, 255, 255, 0.95), 2.5px 2.5px 8px rgba(251, 207, 232, 0.2)',
      color: '#831843',
      border: '1px solid rgba(255, 255, 255, 0.55)',
    },
    tabActiveStyle: {
      background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)',
      boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(251, 207, 232, 0.24)',
      color: '#831843',
      border: '1px solid rgba(255, 255, 255, 0.45)',
    },
    tabInactiveStyle: {
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fde8f2 100%)',
      color: '#be185d',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    decorShadowXLeft: 'drop-shadow(0 6px 14px rgba(190,24,93,0.30))',
    decorShadowXRight: 'drop-shadow(0 6px 14px rgba(236,72,153,0.28))',
    decorShadowHeart: 'drop-shadow(0 10px 22px rgba(190,24,93,0.38))',
    decorShadowStar: 'drop-shadow(0 10px 22px rgba(190,24,93,0.35))',
    washiDividerFilter: 'drop-shadow(0 2px 4px rgba(190, 24, 93, 0.20))',
    polaroidFrameShadow: '0 8px 24px rgba(190,24,93,0.14)',
    musicPlayerBg: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(253, 242, 248, 0.88) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(251, 207, 232, 0.18)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    musicEqColor1: '#f472b6',
    musicEqColor2: '#ec4899',
    musicEqColor3: '#db2777',
    musicVinylCenterBg: '#fbcfe8',
    defaultHeartIdx: 2,
    defaultStarIdx: 3,
    profileCardShadow:
      '0 8px 22px -3px rgba(190,24,93,0.08), inset 0 1px 2px rgba(255,255,255,0.98), inset 0 -1px 3px rgba(251,207,232,0.08)',
    dDayHoleShadow: 'inset 0 1.5px 3px rgba(190, 24, 93, 0.28), 0 1px 1px #ffffff',
    dDayGradientOverlay: 'rgba(252, 231, 243, 0.90)',
    chapterHeaderStripe:
      'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, rgba(251, 207, 232, 0.14) 8px, rgba(251, 207, 232, 0.14) 16px)',
    chapterDividerBorder: 'divide-[#fce7f3]',
    paginationBorder: 'border-[#fbcfe8]',
    cardDividerBorder: 'border-[#fbcfe8]/70',
    noticeShadow: '0 8px 24px rgba(190,24,93,0.14)',
    spineSeamVia: 'via-pink-300/15',
    spineShadowMobile: 'inset 0 2px 8px rgba(190,24,93,0.10), inset 0 -2px 8px rgba(190,24,93,0.10)',
    spineShadowDesktop: 'inset 0 2px 8px rgba(190,24,93,0.10)',
    mobileSpringShadow: 'drop-shadow(0 2px 4px rgba(236,72,153,0.22))',
    washi1Shadow: '0 1px 4px rgba(190,24,93,0.18)',
    washi2Shadow: '0 1px 4px rgba(236,72,153,0.18)',
    clayStarGrad: { stop0: '#fdf2f8', stop50: '#fce7f3', stop100: '#fbcfe8' },
  },
};

export const getBinderTheme = (themeId?: string): BinderThemeConfig => {
  if (themeId && BINDER_THEMES[themeId]) {
    return BINDER_THEMES[themeId];
  }
  return BINDER_THEMES['slate-haze'];
};
