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
  hoverBorder: string;
  hoverBg: string;
  hoverText: string;
  synopsisScrollTrack: string;
  synopsisScrollThumb: string;
  synopsisScrollThumbHover: string;
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
    profileLineColor: 'rgba(100, 170, 235, 0.02)',

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
    synopsisGridLine: 'rgba(147, 197, 253, 0.03)',

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
    hoverBorder: 'rgba(59, 130, 246, 0.7)',
    hoverBg: 'linear-gradient(135deg, #ffffff 0%, #eef6fd 100%)',
    hoverText: '#1d4ed8',
    synopsisScrollTrack: 'rgba(200, 225, 250, 0.25)',
    synopsisScrollThumb: 'rgba(110, 165, 225, 0.65)',
    synopsisScrollThumbHover: 'rgba(65, 130, 200, 0.9)',
  },

  // 2. PURPLE / AMETHYST (Theme Tím Oải Hương / Thạch Anh Mộng Mơ - Tông đậm hơn một chút)
  'amethyst-haze': {
    id: 'amethyst-haze',
    name: 'Purple',
    pageBgClass: 'bg-gradient-to-br from-[#f6eefc] via-[#ecdff7] to-[#ffffff]',

    awningTopBarBg: 'linear-gradient(180deg, #d1bfe9 0%, #e0d1f4 50%, #f0eaf8 100%)',
    awningTopBarBorder: '1px solid #c2aee3',
    awningStripeColorGradient: {
      stop0: '#ffffff',
      stop25: '#f4edf9',
      stop65: '#d1bfe9',
      stop100: '#ab92dc',
    },
    awningStripeCreamGradient: {
      stop0: '#ffffff',
      stop45: '#f7f2fc',
      stop80: '#f0e9f8',
      stop100: '#e2d3f2',
    },
    awningBottomLine: '#c2aee3',

    signboardShadow: 'border-white shadow-[0_10px_28px_rgba(100,70,145,0.18),0_0_18px_rgba(185,160,225,0.50),inset_0_1.5px_1.5px_#ffffff]',
    signboardBoxShadow:
      '0 14px 34px -4px rgba(100,70,145,0.22), 0 6px 16px rgba(185,160,225,0.50), inset 0 1.5px 1.5px #ffffff',
    signboardBg: 'linear-gradient(180deg, #ffffff 0%, #f5eff9 45%, #e2d3f2 100%)',
    signboardSubText: 'text-[#5a4875]',
    signboardTitleText: 'text-[#2d2242]',
    signboardTextShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff, 0 2px 6px rgba(100,70,145,0.22)',
    signboardBtnText: 'text-[#382b52]',
    signboardRibbonHanger: 'linear-gradient(180deg, #ffffff 0%, #f5eff9 60%, #d1bfe9 100%)',
    signboardRibbonDotBg: '#e2d3f2',
    signboardBtnStyle: {
      background: 'linear-gradient(135deg, #f7f1fc 0%, #e2d3f2 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(205, 185, 235, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
      color: '#2d2242',
    },

    glowTopLeft: 'bg-gradient-to-br from-[#d1bfe9]/65 to-[#ffffff]/90',
    glowBottomRight: 'bg-gradient-to-tl from-[#e0d1f4]/70 via-[#f5eff9]/80 to-[#ffffff]/95',

    noticeBg: 'bg-[#f4edf9]/95',
    noticeBorder: 'border-[#d7c4ed]',
    noticeText: 'text-[#2d2242]',
    noticeHighlight: 'text-[#7e22ce]',
    noticeBtnText: 'text-[#2d2242]',

    catEarOuter: {
      stop0: '#ffffff',
      stop35: '#f4edf9',
      stop70: '#d1bfe9',
      stop100: '#ab92dc',
    },
    catEarInner: {
      stop0: '#f6eefc',
      stop50: '#e8daf6',
      stop100: '#d5bfe9',
    },

    ribbonText: 'text-[#2d2242]',
    ribbonIcon: 'text-[#7e22ce]',

    coverCardBorder: 'border-[#d7c4ed]',
    coverInnerBorder: 'border-[#e2d5f2]',
    heartIconColor: '#9333ea',
    titleText: 'text-[#2d2242]',
    authorTextMuted: 'text-[#5a4875]',
    translatorHighlight: 'text-[#2d2242]',
    actionBtnPrimaryText: 'text-[#2d2242]',
    actionBtnSecondaryText: 'text-[#382b52]',

    tocHeaderBg: 'bg-[#efe5f7]/90',
    tocHeaderBorder: 'border-[#d7c4ed]',
    tocHeaderText: 'text-[#2d2242]',
    folderIconColor: 'text-[#7e22ce]',
    tabActiveText: 'text-[#2d2242]',
    tabInactiveText: 'text-[#5a4875]',

    spineGradientMobile: 'from-purple-200/50 via-purple-200/25 to-purple-200/50',
    spineGradientDesktop: 'from-purple-200/40 via-purple-200/20 to-purple-200/40',
    spineBorderMobile: 'border-white/80',
    spineBorderDesktop: 'border-white/60',
    ringBorder: 'border-purple-300',
    ringGradient: 'from-white via-[#f6eefc] to-[#e0d1f4]',

    searchIconBg: 'from-purple-200/90 to-fuchsia-100/90',
    searchIconText: 'text-[#7e22ce]',
    searchPlaceholder: 'placeholder-[#8c74ad]',

    profileCardHeaderIcon: '#7e22ce',
    profileCardHeaderText: 'text-[#5a4875]',
    profileTitleText: 'text-[#2d2242]',
    tagPillBg: 'bg-[#efe5f7]',
    tagPillText: 'text-[#382b52]',
    tagPillBorder: 'border-[#d3bfe8]',
    profileLineColor: 'rgba(120, 95, 165, 0.016)',

    dDayHoleBg: '#efe5f7',
    dDayHoleBorder: '#bda5e2',
    dDayTitleText: 'text-[#5a4875]',
    dDayDashedBorder: 'border-[#c8b0ec]',
    dDayNumberText: 'text-[#2d2242]',
    dDayChaptersText: 'text-[#7355a8]',

    washiDividerBg: '#f4edf9',
    washiGridColor: 'rgba(130, 100, 180, 0.22)',
    washiTape1Bg: '#e2d3f2',
    washiTape1Border: 'border-purple-300/80',
    washiTape2Bg: '#ecdff7',
    washiTape2Border: 'border-purple-300/70',

    accentDot: 'text-[#7e22ce]',
    cardTitle: 'text-[#5a4875]',
    cardSubtext: 'text-[#675485]',
    cardBorder: 'border-[#dccaf2]/80',
    stripeBarGradient: 'from-[#d1bfe9] via-[#9370db] to-[#d1bfe9]',
    synopsisGridLine: 'rgba(160, 135, 205, 0.035)',

    chapterDotColor: 'bg-[#7e22ce]',
    chapterHoverBg: 'hover:bg-[#f4edf9]',
    chapterTitleText: 'text-[#2d2242]',
    chapterTitleHover: 'group-hover:text-[#6b21a8]',
    chapterExtraBadgeBg: 'bg-[#7e22ce]/12',
    chapterExtraBadgeText: 'text-[#5a4875]',
    chapterExtraBadgeBorder: 'border-[#c8b6e8]/70',
    chapterDateText: 'text-[#675485]',
    paginationActiveText: 'text-[#2d2242]',
    paginationActiveBg: 'bg-[#e5d4f5]',
    paginationActiveBorder: 'border-[#ccb0ed]',

    commentHeaderIcon: 'text-[#7e22ce]',
    commentHeaderText: 'text-[#2d2242]',
    commentInputBorder: 'border-[#d7c4ed]',
    commentInputBg: 'bg-white/80',
    commentInputText: 'text-[#2d2242]',
    commentPlaceholder: 'placeholder-[#8c74ad]',
    commentBtnText: 'text-[#2d2242]',
    commentItemTitleText: 'text-[#2d2242]',
    commentItemDateText: 'text-[#675485]',
    commentItemContentText: 'text-[#2d2242]',

    cardGlassBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(244, 237, 249, 0.92) 100%)',
    profileCardBg: '#ffffff',
    ddayCardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(242, 233, 248, 0.94) 100%)',
    washiStripeGradient: 'repeating-linear-gradient(45deg, rgba(140, 110, 195, 0.22) 0px, rgba(140, 110, 195, 0.22) 4px, transparent 4px, transparent 8px)',
    innerBorderColor: 'border-[#d7c4ed]',
    cartoonXGrad: { stop0: '#f6eefc', stop50: '#e2d3f2', stop100: '#c2aee3' },
    pixelHeartGrad: { stop0: '#f6eefc', stop30: '#e2d3f2', stop70: '#ab92dc', stop100: '#9333ea' },
    introStarGrad: { stop0: '#f6eefc', stop50: '#e2d3f2', stop100: '#c2aee3' },

    leftColumnBg: {
      backgroundColor: '#f7f2fb',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(140, 110, 195, 0.05) 0px, rgba(140, 110, 195, 0.05) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(-45deg, rgba(140, 110, 195, 0.05) 0px, rgba(140, 110, 195, 0.05) 8px, transparent 8px, transparent 16px)',
    },
    leftColumnShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 4px 16px rgba(100,70,145,0.08)',
    rightColumnGrid: {
      backgroundColor: '#ffffff',
      backgroundImage:
        'linear-gradient(rgba(185, 160, 225, 0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(185, 160, 225, 0.22) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    notebookOuterGlass: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(244, 237, 249, 0.90) 45%, rgba(230, 215, 245, 0.82) 100%)',
      boxShadow:
        '0 24px 55px -8px rgba(100, 70, 145, 0.16), 0 10px 24px -5px rgba(130, 100, 180, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.98), inset 0 -2px 6px rgba(205, 185, 235, 0.22)',
      border: '2px solid rgba(255, 255, 255, 0.92)',
    },
    notebookInnerGlass: {
      background: 'rgba(255, 255, 255, 0.80)',
      boxShadow: 'inset 0 2px 8px rgba(150, 120, 200, 0.12), 0 6px 20px rgba(120, 95, 165, 0.08)',
      border: '1.5px solid rgba(255, 255, 255, 0.96)',
    },
    cardGlassStyle: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(244, 237, 249, 0.92) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(200, 175, 235, 0.22), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    searchBarSoftStyle: {
      background: 'linear-gradient(135deg, #f2e7f8 0%, #f7f1fc 100%)',
      boxShadow:
        'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(205, 185, 235, 0.22), 0 4px 14px -3px rgba(120, 95, 165, 0.12)',
      border: '1.5px solid rgba(255, 255, 255, 0.9)',
    },
    btnCandyPrimary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f7f1fc 35%, #e2d3f2 75%, #c2aee3 100%)',
      boxShadow:
        '0 4px 14px -2px rgba(100, 70, 145, 0.22), 0 1px 3px rgba(100, 70, 145, 0.10), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(165, 140, 210, 0.22)',
      color: '#2d2242',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnCandySecondary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #fbf8fe 40%, #f4edf9 80%, #ebdff7 100%)',
      boxShadow:
        '0 3px 10px -2px rgba(100, 70, 145, 0.16), inset 0 1px 1.5px #ffffff, inset 0 -1.5px 3px rgba(205, 185, 235, 0.18)',
      color: '#382b52',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClayPrimary: {
      background: 'linear-gradient(135deg, #f7f1fc 0%, #e2d3f2 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(205, 185, 235, 0.24), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      color: '#2d2242',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
    },
    btnClaySecondary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f7f1fc 50%, #e2d3f2 100%)',
      boxShadow:
        '-2px -2px 7px rgba(255, 255, 255, 0.95), 2px 3px 9px rgba(205, 185, 235, 0.18), inset 0 1px 1px #ffffff',
      color: '#382b52',
      border: '1.5px solid rgba(255, 255, 255, 0.75)',
    },
    btnClayPill: {
      background: 'linear-gradient(135deg, #f7f1fc 0%, #e2d3f2 100%)',
      boxShadow: '-2.5px -2.5px 7px rgba(255, 255, 255, 0.95), 2.5px 2.5px 8px rgba(205, 185, 235, 0.20)',
      color: '#2d2242',
      border: '1px solid rgba(255, 255, 255, 0.55)',
    },
    tabActiveStyle: {
      background: 'linear-gradient(135deg, #e2d3f2 0%, #f7f1fc 100%)',
      boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(185, 160, 225, 0.26)',
      color: '#2d2242',
      border: '1px solid rgba(255, 255, 255, 0.45)',
    },
    tabInactiveStyle: {
      background: 'linear-gradient(135deg, #f7f1fc 0%, #ede3f7 100%)',
      color: '#5a4875',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    decorShadowXLeft: 'drop-shadow(0 6px 14px rgba(100,70,145,0.26))',
    decorShadowXRight: 'drop-shadow(0 6px 14px rgba(120,95,165,0.24))',
    decorShadowHeart: 'drop-shadow(0 10px 22px rgba(100,70,145,0.30))',
    decorShadowStar: 'drop-shadow(0 10px 22px rgba(100,70,145,0.28))',
    washiDividerFilter: 'drop-shadow(0 2px 4px rgba(100, 70, 145, 0.18))',
    polaroidFrameShadow: '0 8px 24px rgba(100,70,145,0.12)',
    musicPlayerBg: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(244, 237, 249, 0.92) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(200, 175, 235, 0.22)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    musicEqColor1: '#c2aee3',
    musicEqColor2: '#ab92dc',
    musicEqColor3: '#9333ea',
    musicVinylCenterBg: '#d7c4ed',
    defaultHeartIdx: 1,
    defaultStarIdx: 2,
    profileCardShadow:
      '0 8px 22px -3px rgba(100,70,145,0.08), inset 0 1px 2px rgba(255,255,255,0.98), inset 0 -1px 3px rgba(205,185,235,0.08)',
    dDayHoleShadow: 'inset 0 1.5px 3px rgba(100, 70, 145, 0.22), 0 1px 1px #ffffff',
    dDayGradientOverlay: 'rgba(244, 237, 249, 0.92)',
    chapterHeaderStripe:
      'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, rgba(205, 185, 235, 0.12) 8px, rgba(205, 185, 235, 0.12) 16px)',
    chapterDividerBorder: 'divide-[#f4edf9]',
    paginationBorder: 'border-[#d7c4ed]',
    cardDividerBorder: 'border-[#d7c4ed]/70',
    noticeShadow: '0 8px 24px rgba(100,70,145,0.12)',
    spineSeamVia: 'via-purple-300/20',
    spineShadowMobile: 'inset 0 2px 8px rgba(100,70,145,0.10), inset 0 -2px 8px rgba(100,70,145,0.10)',
    spineShadowDesktop: 'inset 0 2px 8px rgba(100,70,145,0.10)',
    mobileSpringShadow: 'drop-shadow(0 2px 4px rgba(120,95,165,0.18))',
    washi1Shadow: '0 1px 4px rgba(100,70,145,0.15)',
    washi2Shadow: '0 1px 4px rgba(120,95,165,0.15)',
    clayStarGrad: { stop0: '#f6eefc', stop50: '#e2d3f2', stop100: '#c2aee3' },
    hoverBorder: 'rgba(147, 51, 234, 0.8)',
    hoverBg: 'linear-gradient(135deg, #ffffff 0%, #f3e8ff 100%)',
    hoverText: '#7e22ce',
    synopsisScrollTrack: 'rgba(235, 220, 250, 0.35)',
    synopsisScrollThumb: 'rgba(168, 120, 225, 0.70)',
    synopsisScrollThumbHover: 'rgba(126, 34, 206, 0.9)',
  },

  // 3. WHITE / NOTEBOOK (Theme Trắng Ngọc / Bạc Thanh Tao - Tông Đậm Hơn Một Chút, Chuẩn Tone Bạc Slate, Không Ám Vàng)
  'notebook': {
    id: 'notebook',
    name: 'White',
    pageBgClass: 'bg-gradient-to-br from-[#edf2f7] via-[#e2e8f0] to-[#f8fafc]',

    awningTopBarBg: 'linear-gradient(180deg, #cbd5e1 0%, #d8e2ec 50%, #e8edf3 100%)',
    awningTopBarBorder: '1px solid #94a3b8',
    awningStripeColorGradient: {
      stop0: '#f8fafc',
      stop25: '#e8edf3',
      stop65: '#cbd5e1',
      stop100: '#94a3b8',
    },
    awningStripeCreamGradient: {
      stop0: '#ffffff',
      stop45: '#f8fafc',
      stop80: '#edf2f7',
      stop100: '#e2e8f0',
    },
    awningBottomLine: '#94a3b8',

    signboardShadow: 'border-white/90 shadow-[0_12px_32px_rgba(71,85,105,0.22),0_0_18px_rgba(148,163,184,0.40),inset_0_1.5px_1.5px_#ffffff]',
    signboardBoxShadow:
      '0 14px 34px -4px rgba(71,85,105,0.24), 0 6px 16px rgba(148,163,184,0.40), inset 0 1.5px 1.5px #ffffff',
    signboardBg: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 45%, #e2e8f0 100%)',
    signboardSubText: 'text-[#334155]',
    signboardTitleText: 'text-[#0f172a]',
    signboardTextShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff, 0 2px 6px rgba(51,65,85,0.25)',
    signboardBtnText: 'text-[#1e293b]',
    signboardRibbonHanger: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 60%, #cbd5e1 100%)',
    signboardRibbonDotBg: '#cbd5e1',
    signboardBtnStyle: {
      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(148, 163, 184, 0.28), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      border: '1.5px solid rgba(255, 255, 255, 0.9)',
      color: '#0f172a',
    },

    glowTopLeft: 'bg-gradient-to-br from-[#cbd5e1]/75 to-[#ffffff]/90',
    glowBottomRight: 'bg-gradient-to-tl from-[#e2e8f0]/80 via-[#f1f5f9]/85 to-[#ffffff]/95',

    noticeBg: 'bg-[#edf2f7]/95',
    noticeBorder: 'border-[#cbd5e1]',
    noticeText: 'text-[#0f172a]',
    noticeHighlight: 'text-[#1d4ed8]',
    noticeBtnText: 'text-[#0f172a]',

    catEarOuter: {
      stop0: '#ffffff',
      stop35: '#edf2f7',
      stop70: '#cbd5e1',
      stop100: '#94a3b8',
    },
    catEarInner: {
      stop0: '#f8fafc',
      stop50: '#edf2f7',
      stop100: '#cbd5e1',
    },

    ribbonText: 'text-[#0f172a]',
    ribbonIcon: 'text-[#475569]',

    coverCardBorder: 'border-[#cbd5e1]',
    coverInnerBorder: 'border-[#e2e8f0]',
    heartIconColor: '#475569',
    titleText: 'text-[#0f172a]',
    authorTextMuted: 'text-[#334155]',
    translatorHighlight: 'text-[#0f172a]',
    actionBtnPrimaryText: 'text-[#0f172a]',
    actionBtnSecondaryText: 'text-[#1e293b]',

    tocHeaderBg: 'bg-[#e2e8f0]/90',
    tocHeaderBorder: 'border-[#cbd5e1]',
    tocHeaderText: 'text-[#0f172a]',
    folderIconColor: 'text-[#475569]',
    tabActiveText: 'text-[#0f172a]',
    tabInactiveText: 'text-[#334155]',

    spineGradientMobile: 'from-slate-200/70 via-slate-300/45 to-slate-200/70',
    spineGradientDesktop: 'from-slate-200/50 via-slate-300/35 to-slate-200/50',
    spineBorderMobile: 'border-white/90',
    spineBorderDesktop: 'border-white/70',
    ringBorder: 'border-slate-400',
    ringGradient: 'from-white via-[#edf2f7] to-[#cbd5e1]',

    searchIconBg: 'from-slate-300/90 to-zinc-200/90',
    searchIconText: 'text-[#334155]',
    searchPlaceholder: 'placeholder-[#64748b]',

    profileCardHeaderIcon: '#475569',
    profileCardHeaderText: 'text-[#1e293b]',
    profileTitleText: 'text-[#0f172a]',
    tagPillBg: 'bg-[#e2e8f0]',
    tagPillText: 'text-[#0f172a]',
    tagPillBorder: 'border-[#cbd5e1]',
    profileLineColor: 'rgba(100, 116, 139, 0.016)',

    dDayHoleBg: '#e2e8f0',
    dDayHoleBorder: '#64748b',
    dDayTitleText: 'text-[#1e293b]',
    dDayDashedBorder: 'border-[#94a3b8]',
    dDayNumberText: 'text-[#0f172a]',
    dDayChaptersText: 'text-[#334155]',

    washiDividerBg: '#edf2f7',
    washiGridColor: 'rgba(100, 116, 139, 0.40)',
    washiTape1Bg: '#cbd5e1',
    washiTape1Border: 'border-slate-400/80',
    washiTape2Bg: '#e2e8f0',
    washiTape2Border: 'border-slate-300/90',

    accentDot: 'bg-[#475569]',
    cardTitle: 'text-[#1e293b]',
    cardSubtext: 'text-[#334155]',
    cardBorder: 'border-[#cbd5e1]',
    stripeBarGradient: 'from-[#94a3b8] via-[#64748b] to-[#94a3b8]',
    synopsisGridLine: 'rgba(100, 116, 139, 0.035)',

    chapterDotColor: 'bg-[#475569]',
    chapterHoverBg: 'hover:bg-[#f1f5f9]',
    chapterTitleText: 'text-[#0f172a]',
    chapterTitleHover: 'group-hover:text-[#1d4ed8]',
    chapterExtraBadgeBg: 'bg-[#2563eb]/15',
    chapterExtraBadgeText: 'text-[#1e40af]',
    chapterExtraBadgeBorder: 'border-[#3b82f6]/40',
    chapterDateText: 'text-[#475569]',
    paginationActiveText: 'text-[#0f172a]',
    paginationActiveBg: 'bg-[#e2e8f0]',
    paginationActiveBorder: 'border-[#cbd5e1]',

    commentHeaderIcon: 'text-[#475569]',
    commentHeaderText: 'text-[#0f172a]',
    commentInputBorder: 'border-[#cbd5e1]',
    commentInputBg: 'bg-white/85',
    commentInputText: 'text-[#0f172a]',
    commentPlaceholder: 'placeholder-[#64748b]',
    commentBtnText: 'text-[#0f172a]',
    commentItemTitleText: 'text-[#0f172a]',
    commentItemDateText: 'text-[#475569]',
    commentItemContentText: 'text-[#0f172a]',

    cardGlassBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.90) 100%)',
    profileCardBg: '#ffffff',
    ddayCardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(226, 232, 240, 0.92) 100%)',
    washiStripeGradient: 'repeating-linear-gradient(45deg, rgba(100, 116, 139, 0.35) 0px, rgba(100, 116, 139, 0.35) 4px, transparent 4px, transparent 8px)',
    innerBorderColor: 'border-[#cbd5e1]',
    cartoonXGrad: { stop0: '#edf2f7', stop50: '#cbd5e1', stop100: '#94a3b8' },
    pixelHeartGrad: { stop0: '#f8fafc', stop30: '#e2e8f0', stop70: '#cbd5e1', stop100: '#64748b' },
    introStarGrad: { stop0: '#edf2f7', stop50: '#cbd5e1', stop100: '#94a3b8' },

    leftColumnBg: {
      backgroundColor: '#f8fafc',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(100, 116, 139, 0.04) 0px, rgba(100, 116, 139, 0.04) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(-45deg, rgba(100, 116, 139, 0.04) 0px, rgba(100, 116, 139, 0.04) 8px, transparent 8px, transparent 16px)',
    },
    leftColumnShadow: 'inset 0 1px 3px rgba(255,255,255,0.9), 0 4px 16px rgba(71,85,105,0.12)',
    rightColumnGrid: {
      backgroundColor: '#ffffff',
      backgroundImage:
        'linear-gradient(rgba(148, 163, 184, 0.30) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.30) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    notebookOuterGlass: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.92) 45%, rgba(226, 232, 240, 0.85) 100%)',
      boxShadow:
        '0 26px 58px -8px rgba(71, 85, 105, 0.22), 0 12px 26px -5px rgba(100, 116, 139, 0.14), inset 0 2px 4px rgba(255, 255, 255, 0.98), inset 0 -2px 6px rgba(148, 163, 184, 0.26)',
      border: '2px solid rgba(255, 255, 255, 0.95)',
    },
    notebookInnerGlass: {
      background: 'rgba(255, 255, 255, 0.82)',
      boxShadow: 'inset 0 2px 8px rgba(100, 116, 139, 0.14), 0 6px 20px rgba(71, 85, 105, 0.10)',
      border: '1.5px solid rgba(255, 255, 255, 0.98)',
    },
    cardGlassStyle: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.90) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(148, 163, 184, 0.22), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.90)',
    },
    searchBarSoftStyle: {
      background: 'linear-gradient(135deg, #e2e8f0 0%, #edf2f7 100%)',
      boxShadow:
        'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(100, 116, 139, 0.25), 0 4px 14px -3px rgba(71, 85, 105, 0.14)',
      border: '1.5px solid rgba(255, 255, 255, 0.95)',
    },
    btnCandyPrimary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #edf2f7 35%, #cbd5e1 75%, #94a3b8 100%)',
      boxShadow:
        '0 4px 14px -2px rgba(71, 85, 105, 0.24), 0 1px 3px rgba(71, 85, 105, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.98), inset 0 -2px 4px rgba(100, 116, 139, 0.24)',
      color: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.9)',
    },
    btnCandySecondary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #e2e8f0 80%, #cbd5e1 100%)',
      boxShadow:
        '0 3px 10px -2px rgba(71, 85, 105, 0.18), inset 0 1px 1.5px #ffffff, inset 0 -1.5px 3px rgba(148, 163, 184, 0.20)',
      color: '#1e293b',
      border: '1px solid rgba(255, 255, 255, 0.9)',
    },
    btnClayPrimary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(148, 163, 184, 0.26), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      color: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.9)',
    },
    btnClaySecondary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)',
      boxShadow:
        '-2px -2px 7px rgba(255, 255, 255, 0.95), 2px 3px 9px rgba(148, 163, 184, 0.20), inset 0 1px 1px #ffffff',
      color: '#1e293b',
      border: '1px solid rgba(255, 255, 255, 0.85)',
    },
    btnClayPill: {
      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
      boxShadow: '-2.5px -2.5px 7px rgba(255, 255, 255, 0.95), 2.5px 2.5px 8px rgba(100, 116, 139, 0.22)',
      color: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.65)',
    },
    tabActiveStyle: {
      background: 'linear-gradient(135deg, #e2e8f0 0%, #edf2f7 100%)',
      boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.95), inset 2px 2px 5px rgba(100, 116, 139, 0.25)',
      color: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.60)',
    },
    tabInactiveStyle: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
      color: '#334155',
      border: '1px solid rgba(226, 232, 240, 0.85)',
    },
    decorShadowXLeft: 'drop-shadow(0 6px 14px rgba(71,85,105,0.38))',
    decorShadowXRight: 'drop-shadow(0 6px 14px rgba(100,116,139,0.36))',
    decorShadowHeart: 'drop-shadow(0 10px 22px rgba(71,85,105,0.42))',
    decorShadowStar: 'drop-shadow(0 10px 22px rgba(71,85,105,0.40))',
    washiDividerFilter: 'drop-shadow(0 2px 4px rgba(71, 85, 105, 0.22))',
    polaroidFrameShadow: '0 8px 24px rgba(71,85,105,0.18)',
    musicPlayerBg: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.90) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(148, 163, 184, 0.22)',
      border: '1px solid rgba(255, 255, 255, 0.90)',
    },
    musicEqColor1: '#64748b',
    musicEqColor2: '#475569',
    musicEqColor3: '#334155',
    musicVinylCenterBg: '#94a3b8',
    defaultHeartIdx: 0,
    defaultStarIdx: 4,
    profileCardShadow:
      '0 8px 22px -3px rgba(71,85,105,0.12), inset 0 1px 2px rgba(255,255,255,0.98), inset 0 -1px 3px rgba(148,163,184,0.12)',
    dDayHoleShadow: 'inset 0 1.5px 3px rgba(71, 85, 105, 0.32), 0 1px 1px #ffffff',
    dDayGradientOverlay: 'rgba(226, 232, 240, 0.92)',
    chapterHeaderStripe:
      'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, rgba(148, 163, 184, 0.18) 8px, rgba(148, 163, 184, 0.18) 16px)',
    chapterDividerBorder: 'divide-[#cbd5e1]',
    paginationBorder: 'border-[#94a3b8]',
    cardDividerBorder: 'border-[#cbd5e1]',
    noticeShadow: '0 8px 24px rgba(71,85,105,0.18)',
    spineSeamVia: 'via-slate-400/20',
    spineShadowMobile: 'inset 0 2px 8px rgba(71,85,105,0.16), inset 0 -2px 8px rgba(71,85,105,0.16)',
    spineShadowDesktop: 'inset 0 2px 8px rgba(71,85,105,0.16)',
    mobileSpringShadow: 'drop-shadow(0 2px 4px rgba(100,116,139,0.26))',
    washi1Shadow: '0 1px 4px rgba(71,85,105,0.22)',
    washi2Shadow: '0 1px 4px rgba(100,116,139,0.22)',
    clayStarGrad: { stop0: '#edf2f7', stop50: '#cbd5e1', stop100: '#94a3b8' },
    hoverBorder: 'rgba(71, 85, 105, 0.75)',
    hoverBg: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
    hoverText: '#0f172a',
    synopsisScrollTrack: 'rgba(226, 232, 240, 0.45)',
    synopsisScrollThumb: 'rgba(100, 116, 139, 0.65)',
    synopsisScrollThumbHover: 'rgba(51, 65, 85, 0.9)',
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
    profileLineColor: 'rgba(95, 143, 111, 0.015)',

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
    synopsisGridLine: 'rgba(120, 160, 135, 0.03)',

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
    profileCardBg: '#ffffff',
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
    hoverBorder: 'rgba(34, 197, 94, 0.7)',
    hoverBg: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
    hoverText: '#15803d',
    synopsisScrollTrack: 'rgba(215, 235, 220, 0.35)',
    synopsisScrollThumb: 'rgba(75, 140, 95, 0.65)',
    synopsisScrollThumbHover: 'rgba(34, 105, 55, 0.9)',
  },

  // 5. LINEN / MOCHA (Theme Vải Đay Linen Mộc Mạc / Cát Ấm Áp - Tông Đậm Hơn Một Chút)
  'mocha': {
    id: 'mocha',
    name: 'Linen',
    pageBgClass: 'bg-gradient-to-br from-[#f2e8de] via-[#ebdcd0] to-[#fbf7f4]',

    awningTopBarBg: 'linear-gradient(180deg, #d3c0b1 0%, #dfcfc2 50%, #ede1d6 100%)',
    awningTopBarBorder: '1px solid #c2ad9e',
    awningStripeColorGradient: {
      stop0: '#faf6f2',
      stop25: '#eee2d7',
      stop65: '#cdbcad',
      stop100: '#b09b8b',
    },
    awningStripeCreamGradient: {
      stop0: '#ffffff',
      stop45: '#f9f5f1',
      stop80: '#f0e5dc',
      stop100: '#dfd2c6',
    },
    awningBottomLine: '#c2ad9e',

    signboardShadow: 'border-white/90 shadow-[0_12px_32px_rgba(95,68,54,0.18),0_0_18px_rgba(200,175,155,0.50),inset_0_1.5px_1.5px_#ffffff]',
    signboardBoxShadow:
      '0 14px 34px -4px rgba(95,68,54,0.20), 0 6px 16px rgba(200,175,155,0.50), inset 0 1.5px 1.5px #ffffff',
    signboardBg: 'linear-gradient(180deg, #ffffff 0%, #f8f2ec 45%, #e4d5c8 100%)',
    signboardSubText: 'text-[#584438]',
    signboardTitleText: 'text-[#2e2018]',
    signboardTextShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff, 0 2px 6px rgba(95,68,54,0.22)',
    signboardBtnText: 'text-[#443228]',
    signboardRibbonHanger: 'linear-gradient(180deg, #ffffff 0%, #f7f0e8 60%, #d8c5b5 100%)',
    signboardRibbonDotBg: '#dfcfc2',
    signboardBtnStyle: {
      background: 'linear-gradient(135deg, #faf5f0 0%, #dfcfc2 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(195, 170, 155, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      border: '1.5px solid rgba(255, 255, 255, 0.9)',
      color: '#2e2018',
    },

    glowTopLeft: 'bg-gradient-to-br from-[#d8c5b5]/65 to-[#ffffff]/90',
    glowBottomRight: 'bg-gradient-to-tl from-[#dfcfc2]/70 via-[#f8f2ec]/80 to-[#ffffff]/95',

    noticeBg: 'bg-[#f5ece3]/95',
    noticeBorder: 'border-[#cdbcad]',
    noticeText: 'text-[#2e2018]',
    noticeHighlight: 'text-[#684735]',
    noticeBtnText: 'text-[#2e2018]',

    catEarOuter: {
      stop0: '#ffffff',
      stop35: '#f7f0e8',
      stop70: '#cebdae',
      stop100: '#af9988',
    },
    catEarInner: {
      stop0: '#f8f2ec',
      stop50: '#e5d5c7',
      stop100: '#cebdae',
    },

    ribbonText: 'text-[#2e2018]',
    ribbonIcon: 'text-[#795947]',

    coverCardBorder: 'border-[#cdbcad]',
    coverInnerBorder: 'border-[#dfcfc2]',
    heartIconColor: '#94725f',
    titleText: 'text-[#2e2018]',
    authorTextMuted: 'text-[#584438]',
    translatorHighlight: 'text-[#2e2018]',
    actionBtnPrimaryText: 'text-[#2e2018]',
    actionBtnSecondaryText: 'text-[#443228]',

    tocHeaderBg: 'bg-[#ebe0d4]/90',
    tocHeaderBorder: 'border-[#cdbcad]',
    tocHeaderText: 'text-[#2e2018]',
    folderIconColor: 'text-[#795947]',
    tabActiveText: 'text-[#2e2018]',
    tabInactiveText: 'text-[#584438]',

    spineGradientMobile: 'from-stone-200/50 via-stone-200/25 to-stone-200/50',
    spineGradientDesktop: 'from-stone-200/40 via-stone-200/20 to-stone-200/40',
    spineBorderMobile: 'border-white/80',
    spineBorderDesktop: 'border-white/60',
    ringBorder: 'border-stone-300',
    ringGradient: 'from-white via-[#f7f0e8] to-[#ded0c3]',

    searchIconBg: 'from-stone-200/90 to-amber-100/90',
    searchIconText: 'text-[#795947]',
    searchPlaceholder: 'placeholder-[#8b7264]',

    profileCardHeaderIcon: '#795947',
    profileCardHeaderText: 'text-[#584438]',
    profileTitleText: 'text-[#2e2018]',
    tagPillBg: 'bg-[#ebe0d4]',
    tagPillText: 'text-[#443228]',
    tagPillBorder: 'border-[#cdbcad]',
    profileLineColor: 'rgba(120, 90, 75, 0.016)',

    dDayHoleBg: '#ebe0d4',
    dDayHoleBorder: '#af9988',
    dDayTitleText: 'text-[#584438]',
    dDayDashedBorder: 'border-[#cdbcad]',
    dDayNumberText: 'text-[#2e2018]',
    dDayChaptersText: 'text-[#684735]',

    washiDividerBg: '#f7f0e8',
    washiGridColor: 'rgba(120, 90, 75, 0.22)',
    washiTape1Bg: '#dfcfc2',
    washiTape1Border: 'border-stone-300/80',
    washiTape2Bg: '#ebe0d4',
    washiTape2Border: 'border-stone-300/70',

    accentDot: 'bg-[#795947]',
    cardTitle: 'text-[#584438]',
    cardSubtext: 'text-[#6b564a]',
    cardBorder: 'border-[#dacbbe]/80',
    stripeBarGradient: 'from-[#cdbcad] via-[#a38c7d] to-[#cdbcad]',
    synopsisGridLine: 'rgba(120, 90, 75, 0.035)',

    chapterDotColor: 'bg-[#795947]',
    chapterHoverBg: 'hover:bg-[#f7f0e8]',
    chapterTitleText: 'text-[#2e2018]',
    chapterTitleHover: 'group-hover:text-[#684735]',
    chapterExtraBadgeBg: 'bg-[#795947]/15',
    chapterExtraBadgeText: 'text-[#584438]',
    chapterExtraBadgeBorder: 'border-[#af9988]/60',
    chapterDateText: 'text-[#6b564a]',
    paginationActiveText: 'text-[#2e2018]',
    paginationActiveBg: 'bg-[#dfcfc2]',
    paginationActiveBorder: 'border-[#cdbcad]',

    commentHeaderIcon: 'text-[#795947]',
    commentHeaderText: 'text-[#2e2018]',
    commentInputBorder: 'border-[#cdbcad]',
    commentInputBg: 'bg-white/80',
    commentInputText: 'text-[#2e2018]',
    commentPlaceholder: 'placeholder-[#8b7264]',
    commentBtnText: 'text-[#2e2018]',
    commentItemTitleText: 'text-[#2e2018]',
    commentItemDateText: 'text-[#6b564a]',
    commentItemContentText: 'text-[#2e2018]',

    cardGlassBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 242, 236, 0.90) 100%)',
    profileCardBg: '#ffffff',
    ddayCardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(244, 236, 228, 0.92) 100%)',
    washiStripeGradient: 'repeating-linear-gradient(45deg, rgba(120, 90, 75, 0.22) 0px, rgba(120, 90, 75, 0.22) 4px, transparent 4px, transparent 8px)',
    innerBorderColor: 'border-[#cdbcad]',
    cartoonXGrad: { stop0: '#f7f0e8', stop50: '#dfcfc2', stop100: '#cdbcad' },
    pixelHeartGrad: { stop0: '#f7f0e8', stop30: '#dfcfc2', stop70: '#af9988', stop100: '#94725f' },
    introStarGrad: { stop0: '#f7f0e8', stop50: '#dfcfc2', stop100: '#cdbcad' },

    leftColumnBg: {
      backgroundColor: '#fbf8f5',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(145, 120, 105, 0.05) 0px, rgba(145, 120, 105, 0.05) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(-45deg, rgba(145, 120, 105, 0.05) 0px, rgba(145, 120, 105, 0.05) 8px, transparent 8px, transparent 16px)',
    },
    leftColumnShadow: 'inset 0 1px 3px rgba(255,255,255,0.85), 0 4px 16px rgba(95,68,54,0.09)',
    rightColumnGrid: {
      backgroundColor: '#ffffff',
      backgroundImage:
        'linear-gradient(rgba(195, 170, 155, 0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(195, 170, 155, 0.24) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    notebookOuterGlass: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 242, 236, 0.90) 45%, rgba(236, 224, 214, 0.82) 100%)',
      boxShadow:
        '0 24px 55px -8px rgba(95, 68, 54, 0.16), 0 10px 24px -5px rgba(145, 115, 95, 0.10), inset 0 2px 4px rgba(255, 255, 255, 0.98), inset 0 -2px 6px rgba(210, 190, 175, 0.20)',
      border: '2px solid rgba(255, 255, 255, 0.94)',
    },
    notebookInnerGlass: {
      background: 'rgba(255, 255, 255, 0.78)',
      boxShadow: 'inset 0 2px 8px rgba(170, 140, 125, 0.10), 0 6px 20px rgba(145, 115, 95, 0.07)',
      border: '1.5px solid rgba(255, 255, 255, 0.96)',
    },
    cardGlassStyle: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 242, 236, 0.90) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(200, 180, 165, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.88)',
    },
    searchBarSoftStyle: {
      background: 'linear-gradient(135deg, #f2e7dd 0%, #f7f0e8 100%)',
      boxShadow:
        'inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95), inset 2.5px 2.5px 6px rgba(200, 180, 165, 0.20), 0 4px 14px -3px rgba(145, 115, 95, 0.10)',
      border: '1.5px solid rgba(255, 255, 255, 0.92)',
    },
    btnCandyPrimary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f7f0e8 35%, #e2d2c4 75%, #c4b0a0 100%)',
      boxShadow:
        '0 4px 14px -2px rgba(95, 68, 54, 0.18), 0 1px 3px rgba(95, 68, 54, 0.10), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(185, 160, 145, 0.20)',
      color: '#2e2018',
      border: '1px solid rgba(255, 255, 255, 0.88)',
    },
    btnCandySecondary: {
      background: 'linear-gradient(180deg, #ffffff 0%, #faf6f2 40%, #f0e4d8 80%, #dfcfc2 100%)',
      boxShadow:
        '0 3px 10px -2px rgba(95, 68, 54, 0.14), inset 0 1px 1.5px #ffffff, inset 0 -1.5px 3px rgba(200, 180, 165, 0.16)',
      color: '#443228',
      border: '1px solid rgba(255, 255, 255, 0.88)',
    },
    btnClayPrimary: {
      background: 'linear-gradient(135deg, #f7f0e8 0%, #dfcfc2 100%)',
      boxShadow:
        '-3px -3px 9px rgba(255, 255, 255, 0.95), 3px 4px 12px rgba(200, 180, 165, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
      color: '#2e2018',
      border: '1px solid rgba(255, 255, 255, 0.88)',
    },
    btnClaySecondary: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f7f0e8 50%, #dfcfc2 100%)',
      boxShadow:
        '-2px -2px 7px rgba(255, 255, 255, 0.95), 2px 3px 9px rgba(200, 180, 165, 0.16), inset 0 1px 1px #ffffff',
      color: '#443228',
      border: '1px solid rgba(255, 255, 255, 0.78)',
    },
    btnClayPill: {
      background: 'linear-gradient(135deg, #f7f0e8 0%, #dfcfc2 100%)',
      boxShadow: '-2.5px -2.5px 7px rgba(255, 255, 255, 0.95), 2.5px 2.5px 8px rgba(200, 180, 165, 0.18)',
      color: '#2e2018',
      border: '1px solid rgba(255, 255, 255, 0.60)',
    },
    tabActiveStyle: {
      background: 'linear-gradient(135deg, #dfcfc2 0%, #f7f0e8 100%)',
      boxShadow: 'inset -2px -2px 5px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(185, 160, 145, 0.22)',
      color: '#2e2018',
      border: '1px solid rgba(255, 255, 255, 0.50)',
    },
    tabInactiveStyle: {
      background: 'linear-gradient(135deg, #f7f0e8 0%, #ede1d6 100%)',
      color: '#584438',
      border: '1px solid rgba(255, 255, 255, 0.55)',
    },
    decorShadowXLeft: 'drop-shadow(0 6px 14px rgba(95,68,54,0.26))',
    decorShadowXRight: 'drop-shadow(0 6px 14px rgba(120,95,80,0.24))',
    decorShadowHeart: 'drop-shadow(0 10px 22px rgba(95,68,54,0.30))',
    decorShadowStar: 'drop-shadow(0 10px 22px rgba(95,68,54,0.28))',
    washiDividerFilter: 'drop-shadow(0 2px 4px rgba(95, 68, 54, 0.18))',
    polaroidFrameShadow: '0 8px 24px rgba(95,68,54,0.14)',
    musicPlayerBg: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 242, 236, 0.90) 100%)',
      boxShadow: '-3px -3px 12px rgba(255, 255, 255, 0.95), 3px 4px 14px rgba(200, 180, 165, 0.18)',
      border: '1px solid rgba(255, 255, 255, 0.88)',
    },
    musicEqColor1: '#b8a494',
    musicEqColor2: '#94725f',
    musicEqColor3: '#795947',
    musicVinylCenterBg: '#d4c4b5',
    defaultHeartIdx: 3,
    defaultStarIdx: 1,
    profileCardShadow:
      '0 8px 22px -3px rgba(95,68,54,0.09), inset 0 1px 2px rgba(255,255,255,0.98), inset 0 -1px 3px rgba(200,180,165,0.09)',
    dDayHoleShadow: 'inset 0 1.5px 3px rgba(95, 68, 54, 0.22), 0 1px 1px #ffffff',
    dDayGradientOverlay: 'rgba(247, 240, 232, 0.92)',
    chapterHeaderStripe:
      'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, rgba(195, 170, 155, 0.14) 8px, rgba(195, 170, 155, 0.14) 16px)',
    chapterDividerBorder: 'divide-[#ebdcd0]',
    paginationBorder: 'border-[#cdbcad]',
    cardDividerBorder: 'border-[#cdbcad]/80',
    noticeShadow: '0 8px 24px rgba(95,68,54,0.14)',
    spineSeamVia: 'via-stone-300/20',
    spineShadowMobile: 'inset 0 2px 8px rgba(95,68,54,0.12), inset 0 -2px 8px rgba(95,68,54,0.12)',
    spineShadowDesktop: 'inset 0 2px 8px rgba(95,68,54,0.12)',
    mobileSpringShadow: 'drop-shadow(0 2px 4px rgba(120,95,80,0.18))',
    washi1Shadow: '0 1px 4px rgba(95,68,54,0.16)',
    washi2Shadow: '0 1px 4px rgba(120,95,80,0.16)',
    clayStarGrad: { stop0: '#f7f0e8', stop50: '#dfcfc2', stop100: '#cdbcad' },
    hoverBorder: 'rgba(155, 120, 95, 0.8)',
    hoverBg: 'linear-gradient(135deg, #ffffff 0%, #f6ede3 100%)',
    hoverText: '#684735',
    synopsisScrollTrack: 'rgba(235, 225, 215, 0.40)',
    synopsisScrollThumb: 'rgba(160, 130, 110, 0.70)',
    synopsisScrollThumbHover: 'rgba(120, 90, 75, 0.9)',
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
    profileLineColor: 'rgba(236, 72, 153, 0.02)',

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
    synopsisGridLine: 'rgba(236, 72, 153, 0.035)',

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
    hoverBorder: 'rgba(244, 63, 94, 0.7)',
    hoverBg: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
    hoverText: '#9f1239',
    synopsisScrollTrack: 'rgba(252, 231, 243, 0.40)',
    synopsisScrollThumb: 'rgba(244, 114, 182, 0.70)',
    synopsisScrollThumbHover: 'rgba(219, 39, 119, 0.9)',
  },
};

export const getBinderTheme = (themeId?: string): BinderThemeConfig => {
  if (themeId && BINDER_THEMES[themeId]) {
    return BINDER_THEMES[themeId];
  }
  return BINDER_THEMES['slate-haze'];
};
