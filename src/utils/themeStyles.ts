export type NovelThemeId = 'sage' | 'notebook' | 'mocha' | 'slate-haze' | 'amethyst-haze' | 'cosmic';

export interface ThemeOption {
  id: NovelThemeId;
  name: string;
  badge: string;
  fontHint: string;
  dots: [string, string, string]; // [primary, secondary, accent]
}

export const NOVEL_THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'amethyst-haze',
    name: 'Purple',
    badge: 'Mặc định',
    fontHint: 'Font Cổ Phong (Serif)',
    dots: ['#7e739f', '#9333ea', '#ec4899'],
  },
  {
    id: 'notebook',
    name: 'White',
    badge: 'White',
    fontHint: 'Font Cổ Phong (Serif)',
    dots: ['#737373', '#e5e5e5', '#ffffff'],
  },
  {
    id: 'slate-haze',
    name: 'Frost',
    badge: 'Frost',
    fontHint: 'Font Cổ Phong (Serif)',
    dots: ['#87909d', '#d8dfe9', '#f9fcff'],
  },
  {
    id: 'sage',
    name: 'Sage',
    badge: 'Sage',
    fontHint: 'Font Cổ Phong (Serif)',
    dots: ['#466244', '#cad8c6', '#98b894'],
  },
  {
    id: 'mocha',
    name: 'Linen',
    badge: 'Linen',
    fontHint: 'Font Cổ Phong (Serif)',
    dots: ['#A37764', '#F8F4EE', '#f5f1e6'],
  },
];

export interface NovelThemeStyles {
  pageBg: string;
  headerBg: string;
  headerBorder: string;
  footerBg: string;
  logoBg: string;
  logoBadge: string;
  logoTextHover: string;
  searchContainer: string;
  searchIcon: string;
  input: string;
  buttonNeutral: string;
  buttonPrimary: string;
  buttonDarkMode: string;
  themeSelectorBtn: string;
  heroOuter: string;
  heroInner: string;
  heroGridColor: string;
  heroGlowBg: string;
  heroCoverBorder: string;
  heroBadge1: string;
  heroBadge2: string;
  heroBadge3: string;
  heroTitle: string;
  heroTitleHover: string;
  heroAuthorMuted: string;
  heroAuthorValue: string;
  heroSynopsis: string;
  heroTag: string;
  heroBtnRead: string;
  heroBtnBookmark: string;
  heroBookmarkActive: string;
  carouselDotActive: string;
  carouselDotInactive: string;
  carouselNavBtn: string;
  categoryTabActive: string;
  categoryTabInactive: string;
  sectionHeaderBorder: string;
  sectionTitle: string;
  sectionIcon: string;
  sectionSub: string;
  statusFilterWrap: string;
  statusFilterActive: string;
  statusFilterInactive: string;
  emptyCard: string;
  emptyIcon: string;
  card: string;
  cardCoverBorder: string;
  cardTag: string;
  cardTitle: string;
  cardTitleHover: string;
  cardSynopsis: string;
  cardFooterBorder: string;
  cardAuthor: string;
  cardChapterBtn: string;
  recruitmentBanner: string;
  recruitmentSubtitle: string;
  recruitmentTitle: string;
  recruitmentDesc: string;
  recruitmentBtn: string;
  sideCard: string;
  sideCardTitle: string;
  sideCardTabWrap: string;
  sideCardTabActive: string;
  sideCardTabInactive: string;
  sideCardItem: string;
  sideCardRankBadge: (index: number) => string;
  sideCardItemTitleHover: string;
  sideCardItemAuthor: string;
  sideCardItemMetric: string;
  sideCardUpdateTitle: string;
  sideCardUpdateItem: string;
  sideCardUpdateTime: string;
  badgeText: string;
  leaderboardItem: string;
  leaderboardRankBadge: string;
  readerText: string;
}

export function getNovelThemeStyles(theme: NovelThemeId, isDarkMode: boolean): NovelThemeStyles {
  // 1. COSMIC THEME (Used for 'cosmic' and as Dark Mode for 'amethyst-haze' / Purple)
  if (theme === 'cosmic' || (theme === 'amethyst-haze' && isDarkMode)) {
    return {
      pageBg: 'bg-[#060818] text-purple-100',
      headerBg: 'bg-[#0a0c24]/50 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)]',
      headerBorder: 'border-white/15',
      footerBg: 'bg-[#060818]/85 backdrop-blur-xl border-t border-white/10',
      logoBg: 'bg-gradient-to-tr from-purple-600 to-pink-600 text-pink-300 shadow-md shadow-purple-600/30',
      logoBadge: 'bg-purple-500/20 text-purple-200 border-purple-400/30 backdrop-blur-md',
      logoTextHover: 'text-white group-hover:text-pink-300',
      searchContainer: '',
      searchIcon: 'text-purple-200 hover:text-white',
      input: 'bg-black/35 backdrop-blur-md border border-white/20 text-white placeholder-purple-300/60 focus:border-pink-400 focus:ring-1 focus:ring-pink-400/40 shadow-inner',
      buttonNeutral: 'bg-white/[0.07] backdrop-blur-md text-slate-200 border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
      buttonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.45)] hover:from-purple-500 hover:to-pink-500',
      buttonDarkMode: 'bg-white/[0.07] backdrop-blur-md text-amber-300 border border-white/20 hover:bg-white/[0.14]',
      themeSelectorBtn: 'bg-white/[0.07] backdrop-blur-md text-purple-200 border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
      heroOuter: 'bg-gradient-to-br from-white/[0.09] via-[#16123a]/50 to-[#0a0c24]/65 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_20px_rgba(168,85,247,0.12)]',
      heroInner: 'bg-gradient-to-b from-white/[0.07] via-[#1a143f]/40 to-[#0a0b20]/55 backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
      heroGridColor: '#6366f1',
      heroGlowBg: 'bg-purple-600',
      heroCoverBorder: 'border border-white/25 shadow-[0_12px_36px_rgba(0,0,0,0.7),0_0_25px_rgba(168,85,247,0.35)] group-hover:shadow-[0_16px_45px_rgba(236,72,153,0.5)]',
      heroBadge1: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border border-pink-400/30 shadow-md shadow-pink-600/30',
      heroBadge2: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-purple-200',
      heroBadge3: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-purple-200',
      heroTitle: 'text-white',
      heroTitleHover: 'hover:text-pink-300',
      heroAuthorMuted: 'text-slate-400',
      heroAuthorValue: 'text-purple-300',
      heroSynopsis: 'text-purple-100/90',
      heroTag: 'bg-purple-500/15 backdrop-blur-md border border-purple-400/30 text-purple-200 shadow-xs hover:border-pink-400/50',
      heroBtnRead: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/35',
      heroBtnBookmark: 'bg-white/[0.07] backdrop-blur-md border border-white/20 text-slate-200 hover:text-white hover:bg-white/[0.14]',
      heroBookmarkActive: 'fill-pink-400 text-pink-400',
      carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.6)]',
      carouselDotInactive: 'w-2 h-2 rounded-full bg-white/20 hover:bg-white/40',
      carouselNavBtn: 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] border border-white/20 text-slate-200 hover:text-white shadow-md',
      categoryTabActive: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_16px_rgba(236,72,153,0.45)]',
      categoryTabInactive: 'bg-white/[0.05] backdrop-blur-md hover:bg-white/[0.1] border border-white/12 text-purple-200/80 hover:text-white',
      sectionHeaderBorder: 'border-white/10',
      sectionTitle: 'text-white',
      sectionIcon: 'text-pink-400',
      sectionSub: 'text-purple-200/70',
      statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
      statusFilterActive: 'bg-purple-600 text-white shadow-xs',
      statusFilterInactive: 'text-purple-200/70 hover:text-white',
      emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
      emptyIcon: 'text-purple-400/50',
      card: 'bg-gradient-to-br from-white/[0.08] via-[#131135]/50 to-[#0a0c24]/65 backdrop-blur-md border border-white/15 hover:border-pink-400/50 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_20px_48px_rgba(236,72,153,0.3),inset_0_1px_0_rgba(255,255,255,0.35)]',
      cardCoverBorder: 'border border-white/15',
      cardTag: 'bg-purple-500/15 backdrop-blur-md text-purple-200 border border-purple-400/30',
      cardTitle: 'text-white',
      cardTitleHover: 'group-hover:text-pink-300',
      cardSynopsis: 'text-purple-200/75',
      cardFooterBorder: 'border-white/10',
      cardAuthor: 'text-purple-200/75',
      cardChapterBtn: 'text-pink-400',
      recruitmentBanner: 'bg-gradient-to-r from-purple-950/40 via-[#18123b]/50 to-pink-950/40 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]',
      recruitmentSubtitle: 'text-pink-400',
      recruitmentTitle: 'text-white',
      recruitmentDesc: 'text-purple-200/80',
      recruitmentBtn: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-pink-600/30',
      sideCard: 'bg-gradient-to-br from-white/[0.08] via-[#131135]/50 to-[#0a0c24]/65 backdrop-blur-md border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)]',
      sideCardTitle: 'text-white',
      sideCardTabWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
      sideCardTabActive: 'bg-purple-600 text-white',
      sideCardTabInactive: 'text-purple-200/70 hover:text-white',
      sideCardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-purple-500/15 border border-white/10 hover:border-pink-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all',
      sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-white/[0.08] text-purple-200 border border-white/15',
      sideCardItemTitleHover: 'group-hover:text-pink-300',
      sideCardItemAuthor: 'text-purple-200/70',
      sideCardItemMetric: 'text-pink-400',
      sideCardUpdateTitle: 'text-white',
      sideCardUpdateItem: 'bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] border border-white/10',
      sideCardUpdateTime: 'text-pink-400',
      badgeText: 'text-pink-400',
      leaderboardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-purple-500/15 border border-white/10 hover:border-pink-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
      leaderboardRankBadge: 'bg-white/[0.08] text-purple-200 border border-white/15',
      readerText: 'text-slate-200',
    };
  }

  // 2. SLATE HAZE THEME (From 0013.png)
  if (theme === 'slate-haze') {
    if (isDarkMode) {
      return {
        pageBg: 'bg-[#0b1118] text-[#dce7f0]',
        headerBg: 'bg-[#121924]/50 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)]',
        headerBorder: 'border-white/15',
        footerBg: 'bg-[#0b1118]/85 backdrop-blur-xl border-t border-white/10',
        logoBg: 'bg-gradient-to-tr from-[#3e566d] to-[#5d7e9d] text-white shadow-md shadow-[#0c141d]/40',
        logoBadge: 'bg-[#4d6a85]/20 text-[#dce7f0] border-[#4d6a85]/35 backdrop-blur-md',
        logoTextHover: 'text-[#dce7f0] group-hover:text-[#8bb0cf]',
        searchContainer: '',
        searchIcon: 'text-[#a6c2d8] hover:text-[#f0f5fa]',
        input: 'bg-black/35 backdrop-blur-md border border-white/20 text-white placeholder-[#8ba0b5]/60 focus:border-[#5d7e9d]/70 focus:ring-1 focus:ring-[#4d6a85]/30 shadow-inner',
        buttonNeutral: 'bg-white/[0.07] backdrop-blur-md text-[#dce7f0] border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
        buttonPrimary: 'bg-gradient-to-r from-[#3e566d] via-[#4d6a85] to-[#5d7e9d] text-white shadow-[0_0_10px_rgba(77,106,133,0.25)] hover:from-[#47627d] hover:via-[#577795] hover:to-[#688cae]',
        buttonDarkMode: 'bg-white/[0.07] backdrop-blur-md text-[#8bb0cf] border border-white/20 hover:bg-white/[0.14]',
        themeSelectorBtn: 'bg-white/[0.07] backdrop-blur-md text-[#dce7f0] border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
        heroOuter: 'bg-gradient-to-br from-white/[0.09] via-[#141e2a]/50 to-[#0b1118]/65 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]',
        heroInner: 'bg-gradient-to-b from-white/[0.07] via-[#192736]/40 to-[#090e14]/55 backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
        heroGridColor: '#4d6a85',
        heroGlowBg: 'bg-[#4d6a85]/15',
        heroCoverBorder: 'border border-white/25 shadow-[0_12px_36px_rgba(0,0,0,0.7)] group-hover:shadow-[0_16px_45px_rgba(77,106,133,0.25)]',
        heroBadge1: 'bg-gradient-to-r from-[#3e566d] to-[#4d6a85] text-white border border-[#5d7e9d]/30 shadow-md shadow-[#0c141d]/30',
        heroBadge2: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#cfdce8]',
        heroBadge3: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#cfdce8]',
        heroTitle: 'text-white',
        heroTitleHover: 'hover:text-[#dce7f0]',
        heroAuthorMuted: 'text-[#8ba0b5]',
        heroAuthorValue: 'text-[#dce7f0]',
        heroSynopsis: 'text-[#b0c4d6]',
        heroTag: 'bg-[#4d6a85]/20 backdrop-blur-md border border-[#4d6a85]/35 text-[#dce7f0] shadow-xs hover:border-[#5d7e9d]/60',
        heroBtnRead: 'bg-gradient-to-r from-[#3e566d] via-[#4d6a85] to-[#5d7e9d] hover:from-[#47627d] hover:via-[#577795] hover:to-[#688cae] text-white shadow-lg shadow-[#0c141d]/40 font-semibold',
        heroBtnBookmark: 'bg-white/[0.07] backdrop-blur-md border border-white/20 text-[#cfdce8] hover:text-white hover:bg-white/[0.14]',
        heroBookmarkActive: 'fill-[#8bb0cf] text-[#8bb0cf]',
        carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-gradient-to-r from-[#4d6a85] to-[#5d7e9d] shadow-[0_0_8px_rgba(77,106,133,0.25)]',
        carouselDotInactive: 'w-2 h-2 rounded-full bg-white/20 hover:bg-white/40',
        carouselNavBtn: 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] border border-white/20 text-[#cfdce8] hover:text-white shadow-md',
        categoryTabActive: 'bg-gradient-to-r from-[#3e566d] via-[#4d6a85] to-[#5d7e9d] text-white shadow-[0_0_10px_rgba(77,106,133,0.22)]',
        categoryTabInactive: 'bg-white/[0.05] backdrop-blur-md hover:bg-white/[0.1] border border-white/12 text-[#a6c2d8] hover:text-[#f0f5fa]',
        sectionHeaderBorder: 'border-white/10',
        sectionTitle: 'text-[#edf4fa]',
        sectionIcon: 'text-[#8bb0cf]',
        sectionSub: 'text-[#8ba0b5]',
        statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        statusFilterActive: 'bg-gradient-to-r from-[#3e566d] to-[#4d6a85] text-white shadow-xs',
        statusFilterInactive: 'text-[#8ba0b5] hover:text-white',
        emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
        emptyIcon: 'text-[#8bb0cf]/60',
        card: 'bg-gradient-to-br from-white/[0.08] via-[#141e2a]/50 to-[#0b1118]/65 backdrop-blur-md border border-white/15 hover:border-[#5d7e9d]/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_20px_48px_rgba(77,106,133,0.25),inset_0_1px_0_rgba(255,255,255,0.35)]',
        cardCoverBorder: 'border border-white/15',
        cardTag: 'bg-[#4d6a85]/20 backdrop-blur-md text-[#dce7f0] border border-[#4d6a85]/35',
        cardTitle: 'text-[#edf4fa]',
        cardTitleHover: 'group-hover:text-[#dce7f0]',
        cardSynopsis: 'text-[#a6c0d6]',
        cardFooterBorder: 'border-white/10',
        cardAuthor: 'text-[#8ba0b5]',
        cardChapterBtn: 'text-[#8bb0cf]',
        recruitmentBanner: 'bg-gradient-to-r from-slate-950/40 via-[#141e2a]/50 to-[#182838]/40 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]',
        recruitmentSubtitle: 'text-[#8bb0cf]',
        recruitmentTitle: 'text-[#edf4fa]',
        recruitmentDesc: 'text-[#a6c0d6]',
        recruitmentBtn: 'bg-gradient-to-r from-[#3e566d] via-[#4d6a85] to-[#5d7e9d] hover:from-[#47627d] hover:via-[#577795] hover:to-[#688cae] text-white shadow-md shadow-[#0c141d]/35 font-semibold',
        sideCard: 'bg-gradient-to-br from-white/[0.08] via-[#141e2a]/50 to-[#0b1118]/65 backdrop-blur-md border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)]',
        sideCardTitle: 'text-[#edf4fa]',
        sideCardTabWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        sideCardTabActive: 'bg-gradient-to-r from-[#3e566d] to-[#4d6a85] text-white',
        sideCardTabInactive: 'text-[#8ba0b5] hover:text-white',
        sideCardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-[#4d6a85]/15 border border-white/10 hover:border-[#5d7e9d]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all',
        sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-white/[0.08] text-[#b8cedf] border border-white/15',
        sideCardItemTitleHover: 'group-hover:text-[#dce7f0]',
        sideCardItemAuthor: 'text-[#8ba0b5]',
        sideCardItemMetric: 'text-[#8bb0cf]',
        sideCardUpdateTitle: 'text-[#edf4fa]',
        sideCardUpdateItem: 'bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] border border-white/10',
        sideCardUpdateTime: 'text-[#8bb0cf]',
        badgeText: 'text-[#8bb0cf]',
        leaderboardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-[#4d6a85]/15 border border-white/10 hover:border-[#5d7e9d]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
        leaderboardRankBadge: 'bg-white/[0.08] text-[#b8cedf] border border-white/15',
        readerText: 'text-[#e6edf4]',
      };
    }
    // Frost Light (User custom palette: Nền #f3f7fc, Viền #d8dfe9, Chủ đạo #f9fcff, Nút #87909d)
    return {
      pageBg: 'bg-[#f3f7fc] text-[#101723]',
      headerBg: 'bg-[#f3f7fc] backdrop-blur-xl shadow-[0_4px_24px_rgba(16,23,35,0.06)]',
      headerBorder: 'border-[#d8dfe9]/80',
      footerBg: 'bg-[#f3f7fc] border-t border-[#d8dfe9]/80',
      logoBg: 'bg-[#87909d] text-white shadow-xs',
      logoBadge: 'bg-[#f9fcff] text-[#101723] border-[#d8dfe9]',
      logoTextHover: 'text-[#101723] group-hover:text-[#87909d]',
      searchContainer: '',
      searchIcon: 'text-[#64748b]',
      input: 'bg-[#f9fcff] border-[#d8dfe9] text-[#101723] placeholder-[#7d8e9e] focus:border-[#87909d]',
      buttonNeutral: 'bg-[#f9fcff] text-[#101723] border-[#d8dfe9] hover:bg-[#f3f7fc]',
      buttonPrimary: 'bg-[#87909d] text-white font-semibold hover:bg-[#767f8c] shadow-sm',
      buttonDarkMode: 'bg-[#f9fcff] text-[#101723] border-[#d8dfe9] hover:bg-[#f3f7fc]',
      themeSelectorBtn: 'bg-[#f9fcff] text-[#101723] border-[#d8dfe9] hover:bg-[#f3f7fc]',
      heroOuter: 'bg-[#f9fcff] border border-[#d8dfe9]',
      heroInner: 'bg-gradient-to-b from-[#ffffff] via-[#f9fcff] to-[#f3f7fc] border-[#d8dfe9]',
      heroGridColor: '#d8dfe9',
      heroGlowBg: 'bg-[#d8dfe9]/40',
      heroCoverBorder: 'border-2 border-white shadow-[0_16px_38px_rgba(16,23,35,0.18),0_4px_12px_rgba(16,23,35,0.08)] group-hover:shadow-[0_22px_45px_rgba(16,23,35,0.25)]',
      heroBadge1: 'bg-[#87909d] text-white font-semibold shadow-xs',
      heroBadge2: 'bg-[#f9fcff] border-[#d8dfe9] text-[#101723]',
      heroBadge3: 'bg-[#f9fcff] border-[#d8dfe9] text-[#101723]',
      heroTitle: 'text-[#101723]',
      heroTitleHover: 'hover:text-[#87909d]',
      heroAuthorMuted: 'text-[#64748b]',
      heroAuthorValue: 'text-[#101723]',
      heroSynopsis: 'text-[#334155]',
      heroTag: 'bg-[#f3f7fc] border-[#d8dfe9] text-[#101723] hover:border-[#87909d]',
      heroBtnRead: 'bg-[#87909d] text-white font-semibold hover:bg-[#767f8c] shadow-sm',
      heroBtnBookmark: 'bg-[#f9fcff] text-[#101723] border border-[#d8dfe9] hover:bg-[#f3f7fc]',
      heroBookmarkActive: 'fill-[#87909d] text-[#87909d]',
      carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#87909d] shadow-xs',
      carouselDotInactive: 'w-2 h-2 rounded-full bg-transparent border border-[#d8dfe9] hover:bg-[#d8dfe9]',
      carouselNavBtn: 'bg-[#f9fcff] text-[#101723] border border-[#d8dfe9] hover:bg-[#f3f7fc]',
      categoryTabActive: 'bg-[#87909d] text-white font-semibold shadow-md',
      categoryTabInactive: 'bg-[#f9fcff] hover:bg-[#f3f7fc] border border-[#d8dfe9] text-[#334155]',
      sectionHeaderBorder: 'border-[#d8dfe9]',
      sectionTitle: 'text-[#101723]',
      sectionIcon: 'text-[#87909d]',
      sectionSub: 'text-[#64748b]',
      statusFilterWrap: 'bg-white border-[#d8dfe9]',
      statusFilterActive: 'bg-[#87909d] text-white font-semibold shadow-xs',
      statusFilterInactive: 'text-[#64748b] hover:text-[#101723]',
      emptyCard: 'bg-white border-[#d8dfe9]',
      emptyIcon: 'text-[#64748b]',
      card: 'bg-white border-[#d8dfe9] hover:border-[#87909d]/50 hover:shadow-[0_8px_25px_rgba(16,23,35,0.08)]',
      cardCoverBorder: 'border-[#d8dfe9]',
      cardTag: 'bg-[#f3f7fc] text-[#101723] border-[#d8dfe9]',
      cardTitle: 'text-[#101723]',
      cardTitleHover: 'group-hover:text-[#87909d]',
      cardSynopsis: 'text-[#475569]',
      cardFooterBorder: 'border-[#d8dfe9]',
      cardAuthor: 'text-[#64748b]',
      cardChapterBtn: 'text-[#87909d]',
      recruitmentBanner: 'bg-[#f9fcff] border border-[#d8dfe9]',
      recruitmentSubtitle: 'text-[#87909d]',
      recruitmentTitle: 'text-[#101723]',
      recruitmentDesc: 'text-[#475569]',
      recruitmentBtn: 'bg-[#87909d] text-white font-semibold hover:bg-[#767f8c] shadow-xs cursor-pointer',
      sideCard: 'bg-white border-[1.5px] border-[#d8dfe9] shadow-xs',
      sideCardTitle: 'text-[#101723]',
      sideCardTabWrap: 'bg-[#f3f7fc] border border-[#d8dfe9]',
      sideCardTabActive: 'bg-[#87909d] text-white font-semibold shadow-2xs',
      sideCardTabInactive: 'text-[#64748b] hover:text-[#101723]',
      sideCardItem: 'bg-[#f3f7fc] hover:bg-white border border-[#d8dfe9] hover:border-[#87909d]/50 transition-all',
      sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-[#d8dfe9] text-[#101723]',
      sideCardItemTitleHover: 'group-hover:text-[#87909d]',
      sideCardItemAuthor: 'text-[#64748b]',
      sideCardItemMetric: 'text-[#87909d]',
      sideCardUpdateTitle: 'text-[#101723]',
      sideCardUpdateItem: 'bg-[#f3f7fc] hover:bg-white border border-[#d8dfe9] transition-all',
      sideCardUpdateTime: 'text-[#87909d]',
      badgeText: 'text-[#87909d]',
      leaderboardItem: 'bg-[#f3f7fc] hover:bg-white border border-[#d8dfe9] hover:border-[#87909d]/50 transition-all',
      leaderboardRankBadge: 'bg-[#d8dfe9] text-[#101723]',
      readerText: 'text-[#101723]',
    };
  }

  // 3. AMETHYST HAZE THEME (From 0016.png)
  if (theme === 'amethyst-haze') {
    if (isDarkMode) {
      return {
        pageBg: 'bg-[#110a1c] text-[#efeef6]',
        headerBg: 'bg-[#171126]/50 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)]',
        headerBorder: 'border-white/15',
        footerBg: 'bg-[#110a1c]/85 backdrop-blur-xl border-t border-white/10',
        logoBg: 'bg-gradient-to-tr from-[#624b7a] to-[#8468a3] text-purple-200 shadow-md shadow-purple-950/40',
        logoBadge: 'bg-[#735a8f]/20 text-purple-200 border-[#856b9e]/30 backdrop-blur-md',
        logoTextHover: 'text-[#efeef6] group-hover:text-purple-300',
        searchContainer: '',
        searchIcon: 'text-purple-200 hover:text-white',
        input: 'bg-black/35 backdrop-blur-md border border-white/20 text-white placeholder-purple-300/60 focus:border-[#9684b0] focus:ring-1 focus:ring-[#735a8f]/40 shadow-inner',
        buttonNeutral: 'bg-white/[0.07] backdrop-blur-md text-[#d6cde8] border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
        buttonPrimary: 'bg-gradient-to-r from-[#624b7a] via-[#735a8f] to-[#8468a3] text-white shadow-[0_4px_16px_rgba(115,90,143,0.3)] hover:from-[#6d5488] hover:via-[#7e649c] hover:to-[#8f72af]',
        buttonDarkMode: 'bg-white/[0.07] backdrop-blur-md text-amber-300 border border-white/20 hover:bg-white/[0.14]',
        themeSelectorBtn: 'bg-white/[0.07] backdrop-blur-md text-[#d6cde8] border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
        heroOuter: 'bg-gradient-to-br from-white/[0.09] via-[#1a122e]/50 to-[#110a1c]/65 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_20px_rgba(133,107,158,0.1)]',
        heroInner: 'bg-gradient-to-b from-white/[0.07] via-[#23173d]/40 to-[#0e0717]/55 backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
        heroGridColor: '#5a4570',
        heroGlowBg: 'bg-[#5a4570]/30',
        heroCoverBorder: 'border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.7),0_0_16px_rgba(133,107,158,0.2)] group-hover:shadow-[0_16px_45px_rgba(163,146,188,0.3)]',
        heroBadge1: 'bg-gradient-to-r from-[#624b7a] to-[#785f94] text-white border border-[#9684b0]/30 shadow-md shadow-[#1a1228]/40',
        heroBadge2: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#d6cde8]',
        heroBadge3: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#d6cde8]',
        heroTitle: 'text-white',
        heroTitleHover: 'hover:text-purple-300',
        heroAuthorMuted: 'text-[#9789ad]',
        heroAuthorValue: 'text-[#efeef6]',
        heroSynopsis: 'text-[#bfb2d4]',
        heroTag: 'bg-[#735a8f]/20 backdrop-blur-md border border-[#856b9e]/30 text-purple-200 shadow-xs hover:border-[#9684b0]/50',
        heroBtnRead: 'bg-gradient-to-r from-[#624b7a] via-[#735a8f] to-[#8468a3] hover:from-[#6d5488] hover:via-[#7e649c] hover:to-[#8f72af] text-white shadow-lg shadow-[#1a1228]/40 font-semibold',
        heroBtnBookmark: 'bg-white/[0.07] backdrop-blur-md border border-white/20 text-[#d6cde8] hover:text-white hover:bg-white/[0.14]',
        heroBookmarkActive: 'fill-[#c4b5dc] text-[#c4b5dc]',
        carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-gradient-to-r from-[#806c9a] to-[#a392bc] shadow-[0_0_8px_rgba(163,146,188,0.35)]',
        carouselDotInactive: 'w-2 h-2 rounded-full bg-white/20 hover:bg-white/40',
        carouselNavBtn: 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] border border-white/20 text-[#d6cde8] hover:text-white shadow-md',
        categoryTabActive: 'bg-gradient-to-r from-[#624b7a] to-[#785f94] text-white shadow-[0_0_12px_rgba(115,90,143,0.3)]',
        categoryTabInactive: 'bg-white/[0.05] backdrop-blur-md hover:bg-white/[0.1] border border-white/12 text-[#c3b6dc] hover:text-white',
        sectionHeaderBorder: 'border-white/10',
        sectionTitle: 'text-[#f2f0f8]',
        sectionIcon: 'text-[#bdaed3]',
        sectionSub: 'text-[#9789ad]',
        statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        statusFilterActive: 'bg-[#6d5588] text-white shadow-xs',
        statusFilterInactive: 'text-[#9789ad] hover:text-white',
        emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
        emptyIcon: 'text-[#bdaed3]/60',
        card: 'bg-gradient-to-br from-white/[0.08] via-[#19122a]/50 to-[#110a1c]/65 backdrop-blur-2xl border border-white/15 hover:border-[#8e7aa8]/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_20px_48px_rgba(115,90,143,0.2),inset_0_1px_0_rgba(255,255,255,0.25)]',
        cardCoverBorder: 'border border-white/15',
        cardTag: 'bg-[#735a8f]/20 backdrop-blur-md text-purple-200 border border-[#856b9e]/30',
        cardTitle: 'text-[#f0edf7]',
        cardTitleHover: 'group-hover:text-purple-300',
        cardSynopsis: 'text-[#aba0c2]',
        cardFooterBorder: 'border-white/10',
        cardAuthor: 'text-[#9789ad]',
        cardChapterBtn: 'text-[#bdaed3]',
        recruitmentBanner: 'bg-gradient-to-r from-[#2a1b38]/50 via-[#1a122e]/50 to-[#221630]/50 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]',
        recruitmentSubtitle: 'text-[#bdaed3]',
        recruitmentTitle: 'text-[#f0edf7]',
        recruitmentDesc: 'text-[#aba0c2]',
        recruitmentBtn: 'bg-gradient-to-r from-[#624b7a] via-[#735a8f] to-[#8468a3] hover:from-[#6d5488] hover:to-[#8f72af] text-white shadow-md shadow-[#1a1228]/30',
        sideCard: 'bg-gradient-to-br from-white/[0.08] via-[#19122a]/50 to-[#110a1c]/65 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)]',
        sideCardTitle: 'text-[#f0edf7]',
        sideCardTabWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        sideCardTabActive: 'bg-[#6d5588] text-white',
        sideCardTabInactive: 'text-[#9789ad] hover:text-white',
        sideCardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-[#735a8f]/15 border border-white/10 hover:border-[#856b9e]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all',
        sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-white/[0.08] text-[#d6cde8] border border-white/15',
        sideCardItemTitleHover: 'group-hover:text-purple-300',
        sideCardItemAuthor: 'text-[#9789ad]',
        sideCardItemMetric: 'text-[#bdaed3]',
        sideCardUpdateTitle: 'text-[#f0edf7]',
        sideCardUpdateItem: 'bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] border border-white/10',
        sideCardUpdateTime: 'text-[#bdaed3]',
        badgeText: 'text-[#bdaed3]',
        leaderboardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-[#735a8f]/15 border border-white/10 hover:border-[#856b9e]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
        leaderboardRankBadge: 'bg-white/[0.08] text-[#d6cde8] border border-white/15',
        readerText: 'text-[#efeef6]',
      };
    }
    // Amethyst Haze Light (from image 0016.png)
    return {
      pageBg: 'bg-[#f8f7fa] text-[#211c2f]',
      headerBg: 'bg-[#efe9f7] backdrop-blur-xl shadow-[0_4px_24px_rgba(40,25,60,0.06)]',
      headerBorder: 'border-[#cac6d6]/80',
      footerBg: 'bg-[#efe9f7] border-t border-[#cac6d6]/80',
      logoBg: 'bg-gradient-to-tr from-[#6a5b8a] to-[#8d7ba8] text-white shadow-xs',
      logoBadge: 'bg-[#ece8f5] text-[#34294a] border-[#cac6d6]',
      logoTextHover: 'text-[#211c2f] group-hover:text-[#6a5b8a]',
      searchContainer: '',
      searchIcon: 'text-[#7e739f]',
      input: 'bg-[#faf7fd] border-[#cac6d6] text-[#211c2f] placeholder-[#8d82a6] focus:border-[#7e739f]',
      buttonNeutral: 'bg-white text-[#34294a] border-[#cac6d6] hover:bg-purple-50/50',
      buttonPrimary: 'bg-[#7e739f] text-white hover:bg-[#6c618c] shadow-sm',
      buttonDarkMode: 'bg-white text-[#211c2f] border-[#cac6d6] hover:bg-purple-50/50',
      themeSelectorBtn: 'bg-white text-[#211c2f] border-[#cac6d6] hover:bg-purple-50/50',
      heroOuter: 'bg-white border border-[#ded8ea]',
      heroInner: 'bg-gradient-to-b from-[#ffffff] via-[#f7f4fb] to-[#ebe5f3] border-[#d4cee2]',
      heroGridColor: '#9f94b8',
      heroGlowBg: 'bg-[#dad7e7]',
      heroCoverBorder: 'border-white shadow-[0_12px_35px_rgba(40,25,60,0.18)] group-hover:shadow-[0_16px_40px_rgba(40,25,60,0.25)]',
      heroBadge1: 'bg-[#7e739f] text-white shadow-xs',
      heroBadge2: 'bg-white/80 border-[#cac6d6] text-[#34294a]',
      heroBadge3: 'bg-white/80 border-[#cac6d6] text-[#34294a]',
      heroTitle: 'text-[#211c2f]',
      heroTitleHover: 'hover:text-[#7e739f]',
      heroAuthorMuted: 'text-[#756e87]',
      heroAuthorValue: 'text-[#211c2f]',
      heroSynopsis: 'text-[#423956]',
      heroTag: 'bg-[#ede9f5] border-[#d3cde1] text-[#34294a] hover:border-[#7e739f]',
      heroBtnRead: 'bg-white text-[#211c2f] border border-[#cac6d6] hover:bg-purple-50/50 shadow-[0_4px_15px_rgba(45,30,65,0.08)]',
      heroBtnBookmark: 'bg-white text-[#34294a] border border-[#cac6d6] hover:bg-[#f4effa]',
      heroBookmarkActive: 'fill-[#d59aa7] text-[#d59aa7]',
      carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#7e739f] shadow-xs',
      carouselDotInactive: 'w-2 h-2 rounded-full bg-[#cac6d6] hover:bg-[#a69cbd]',
      carouselNavBtn: 'bg-white text-[#34294a] border border-[#cac6d6] hover:bg-purple-50/50',
      categoryTabActive: 'bg-[#7e739f] text-white shadow-md',
      categoryTabInactive: 'bg-white hover:bg-purple-50/50 border border-[#cac6d6] text-[#413658]',
      sectionHeaderBorder: 'border-[#cac6d6]',
      sectionTitle: 'text-[#211c2f]',
      sectionIcon: 'text-[#d59aa7]',
      sectionSub: 'text-[#756e87]',
      statusFilterWrap: 'bg-white/80 border-[#cac6d6]',
      statusFilterActive: 'bg-[#7e739f] text-white shadow-xs',
      statusFilterInactive: 'text-[#756e87] hover:text-[#211c2f]',
      emptyCard: 'bg-white/50 border-[#cac6d6]',
      emptyIcon: 'text-[#a499be]',
      card: 'bg-[#fbfafc] border-[#cac6d6] hover:border-[#7e739f] hover:shadow-[0_8px_25px_rgba(45,30,65,0.1)]',
      cardCoverBorder: 'border-[#dfdae8]',
      cardTag: 'bg-[#f1edf7] text-[#34294a] border-[#cac6d6]',
      cardTitle: 'text-[#211c2f]',
      cardTitleHover: 'group-hover:text-[#7e739f]',
      cardSynopsis: 'text-[#544a6b]',
      cardFooterBorder: 'border-[#eae5f2]',
      cardAuthor: 'text-[#756e87]',
      cardChapterBtn: 'text-[#7e739f]',
      recruitmentBanner: 'bg-white border border-[#ded8ea]',
      recruitmentSubtitle: 'text-[#d59aa7]',
      recruitmentTitle: 'text-[#211c2f]',
      recruitmentDesc: 'text-[#544a6b]',
      recruitmentBtn: 'bg-[#7e739f] text-white hover:bg-[#6c618c] shadow-sm',
      sideCard: 'bg-white border border-[#ded8ea]',
      sideCardTitle: 'text-[#211c2f]',
      sideCardTabWrap: 'bg-[#f7f4fb] border-[#cac6d6]',
      sideCardTabActive: 'bg-[#7e739f] text-white shadow-2xs',
      sideCardTabInactive: 'text-[#756e87] hover:text-[#211c2f]',
      sideCardItem: 'bg-[#fbf9fc] hover:bg-white border-[#d8d3e2] hover:border-[#7e739f]',
      sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-[#e7e3f0] text-[#34294a]',
      sideCardItemTitleHover: 'group-hover:text-[#7e739f]',
      sideCardItemAuthor: 'text-[#756e87]',
      sideCardItemMetric: 'text-[#d59aa7]',
      sideCardUpdateTitle: 'text-[#211c2f]',
      sideCardUpdateItem: 'bg-[#fbf9fc] hover:bg-white border-[#d8d3e2]',
      sideCardUpdateTime: 'text-[#d59aa7]',
      badgeText: 'text-[#d59aa7]',
      leaderboardItem: 'bg-[#fbf9fc] hover:bg-white border-[#d8d3e2] hover:border-[#7e739f]',
      leaderboardRankBadge: 'bg-[#e7e3f0] text-[#34294a]',
      readerText: 'text-[#211c2f]',
    };
  }

  // 4. NOTEBOOK THEME (From 6774.png)
  if (theme === 'notebook') {
    if (isDarkMode) {
      return {
        pageBg: 'bg-[#100e0c] text-[#F7F4EE]',
        headerBg: 'bg-[#181614]/50 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)]',
        headerBorder: 'border-white/15',
        footerBg: 'bg-[#100e0c]/85 backdrop-blur-xl border-t border-white/10',
        logoBg: 'bg-gradient-to-tr from-[#525252] to-[#737373] text-white shadow-md shadow-black/40',
        logoBadge: 'bg-white/[0.1] text-[#F7F4EE] border-white/20 backdrop-blur-md',
        logoTextHover: 'text-[#F7F4EE] group-hover:text-[#B8B2A5]',
        searchContainer: '',
        searchIcon: 'text-neutral-100 hover:text-white',
        input: 'bg-black/35 backdrop-blur-md border border-white/20 text-white placeholder-stone-400/60 focus:border-[#F7F4EE] focus:ring-1 focus:ring-white/40 shadow-inner',
        buttonNeutral: 'bg-white/[0.07] backdrop-blur-md text-[#e5e5e5] border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
        buttonPrimary: 'bg-[#F7F4EE] text-[#181614] font-bold shadow-[0_0_20px_rgba(247,244,238,0.3)] hover:bg-white',
        buttonDarkMode: 'bg-white/[0.07] backdrop-blur-md text-amber-300 border border-white/20 hover:bg-white/[0.14]',
        themeSelectorBtn: 'bg-white/[0.07] backdrop-blur-md text-[#e5e5e5] border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
        heroOuter: 'bg-gradient-to-br from-white/[0.09] via-[#1c1815]/50 to-[#100e0c]/65 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_20px_rgba(247,244,238,0.08)]',
        heroInner: 'bg-gradient-to-b from-white/[0.07] via-[#241e1a]/40 to-[#0e0c0a]/55 backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
        heroGridColor: '#737373',
        heroGlowBg: 'bg-[#737373]',
        heroCoverBorder: 'border border-white/25 shadow-[0_12px_36px_rgba(0,0,0,0.7),0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-[0_16px_45px_rgba(255,255,255,0.3)]',
        heroBadge1: 'bg-[#F7F4EE] text-[#181614] font-bold border border-white/40 shadow-md shadow-black/30',
        heroBadge2: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#d4d4d4]',
        heroBadge3: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#d4d4d4]',
        heroTitle: 'text-[#F7F4EE]',
        heroTitleHover: 'hover:text-white',
        heroAuthorMuted: 'text-[#a3a3a3]',
        heroAuthorValue: 'text-[#F7F4EE]',
        heroSynopsis: 'text-[#d4d4d4]',
        heroTag: 'bg-white/[0.08] backdrop-blur-md border border-white/20 text-[#e5e5e5] shadow-xs hover:border-white/50',
        heroBtnRead: 'bg-[#F7F4EE] text-[#181614] font-bold hover:bg-white shadow-lg shadow-white/20',
        heroBtnBookmark: 'bg-white/[0.07] backdrop-blur-md border border-white/20 text-[#d4d4d4] hover:text-white hover:bg-white/[0.14]',
        heroBookmarkActive: 'fill-[#F7F4EE] text-[#F7F4EE]',
        carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#F7F4EE] shadow-[0_0_12px_rgba(247,244,238,0.7)]',
        carouselDotInactive: 'w-2 h-2 rounded-full bg-white/20 hover:bg-white/40',
        carouselNavBtn: 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] border border-white/20 text-[#e5e5e5] hover:text-white shadow-md',
        categoryTabActive: 'bg-[#F7F4EE] text-[#181614] font-bold shadow-[0_0_16px_rgba(247,244,238,0.4)]',
        categoryTabInactive: 'bg-white/[0.05] backdrop-blur-md hover:bg-white/[0.1] border border-white/12 text-[#a3a3a3] hover:text-white',
        sectionHeaderBorder: 'border-white/10',
        sectionTitle: 'text-[#F7F4EE]',
        sectionIcon: 'text-[#B8B2A5]',
        sectionSub: 'text-[#a3a3a3]',
        statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        statusFilterActive: 'bg-[#737373] text-white shadow-xs font-semibold',
        statusFilterInactive: 'text-[#a3a3a3] hover:text-white',
        emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
        emptyIcon: 'text-[#737373]',
        card: 'bg-gradient-to-br from-white/[0.08] via-[#1c1815]/50 to-[#100e0c]/65 backdrop-blur-2xl border border-white/15 hover:border-white/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_20px_48px_rgba(255,255,255,0.22),inset_0_1px_0_rgba(255,255,255,0.35)]',
        cardCoverBorder: 'border border-white/15',
        cardTag: 'bg-white/[0.08] backdrop-blur-md text-[#F7F4EE] border border-white/20',
        cardTitle: 'text-[#F7F4EE]',
        cardTitleHover: 'group-hover:text-white',
        cardSynopsis: 'text-[#a3a3a3]',
        cardFooterBorder: 'border-white/10',
        cardAuthor: 'text-[#a3a3a3]',
        cardChapterBtn: 'text-[#B8B2A5]',
        recruitmentBanner: 'bg-gradient-to-r from-stone-950/40 via-[#1c1815]/50 to-neutral-950/40 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]',
        recruitmentSubtitle: 'text-[#B8B2A5]',
        recruitmentTitle: 'text-[#F7F4EE]',
        recruitmentDesc: 'text-[#a3a3a3]',
        recruitmentBtn: 'bg-[#F7F4EE] text-[#181614] font-bold hover:bg-white shadow-md',
        sideCard: 'bg-gradient-to-br from-white/[0.08] via-[#1c1815]/50 to-[#100e0c]/65 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)]',
        sideCardTitle: 'text-[#F7F4EE]',
        sideCardTabWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        sideCardTabActive: 'bg-[#737373] text-white font-semibold',
        sideCardTabInactive: 'text-[#a3a3a3] hover:text-white',
        sideCardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.1] border border-white/10 hover:border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all',
        sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-white/[0.08] text-[#e5e5e5] border border-white/15',
        sideCardItemTitleHover: 'group-hover:text-white',
        sideCardItemAuthor: 'text-[#a3a3a3]',
        sideCardItemMetric: 'text-[#B8B2A5]',
        sideCardUpdateTitle: 'text-[#F7F4EE]',
        sideCardUpdateItem: 'bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] border border-white/10',
        sideCardUpdateTime: 'text-[#B8B2A5]',
        badgeText: 'text-[#B8B2A5]',
        leaderboardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.1] border border-white/10 hover:border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
        leaderboardRankBadge: 'bg-white/[0.08] text-[#e5e5e5] border border-white/15',
        readerText: 'text-[#F7F4EE]',
      };
    }
    // Paper (Notebook / White) Light (Theme white chế độ sáng: header và footer chuyển sang màu trắng)
    return {
      pageBg: 'bg-white text-[#171717]',
      headerBg: 'bg-white/95 backdrop-blur-md text-[#171717] shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
      headerBorder: 'border-neutral-200',
      footerBg: 'bg-white text-[#171717] border-t border-neutral-200',
      logoBg: 'bg-neutral-100 text-neutral-900 shadow-xs border border-neutral-300',
      logoBadge: 'bg-neutral-100 text-neutral-800 border-neutral-300',
      logoTextHover: 'text-[#171717] group-hover:text-neutral-600',
      searchContainer: '',
      searchIcon: 'text-neutral-400',
      input: 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:bg-white',
      buttonNeutral: 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100',
      buttonPrimary: 'bg-neutral-900 text-white font-semibold hover:bg-neutral-800 shadow-xs',
      buttonDarkMode: 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100',
      themeSelectorBtn: 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100',
      heroOuter: 'bg-white border border-[#e5e5e5]',
      heroInner: 'bg-gradient-to-b from-[#ffffff] via-[#fafafa] to-[#f5f5f5] border-[#e5e5e5]',
      heroGridColor: '#e5e5e5',
      heroGlowBg: 'bg-[#e5e5e5]/40',
      heroCoverBorder: 'border-white shadow-[0_12px_32px_rgba(0,0,0,0.08)]',
      heroBadge1: 'bg-[#737373] text-white shadow-xs font-semibold',
      heroBadge2: 'bg-white border-[#e5e5e5] text-[#171717]',
      heroBadge3: 'bg-white border-[#e5e5e5] text-[#171717]',
      heroTitle: 'text-[#171717]',
      heroTitleHover: 'hover:text-[#737373]',
      heroAuthorMuted: 'text-[#737373]',
      heroAuthorValue: 'text-[#171717]',
      heroSynopsis: 'text-[#525252]',
      heroTag: 'bg-white border-[#e5e5e5] text-[#171717] hover:border-[#737373]',
      heroBtnRead: 'bg-[#737373] text-white font-semibold hover:bg-[#525252] shadow-sm',
      heroBtnBookmark: 'bg-white text-[#171717] border-[#e5e5e5] hover:bg-[#fafafa]',
      heroBookmarkActive: 'fill-[#737373] text-[#737373]',
      carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#737373] shadow-sm',
      carouselDotInactive: 'w-2 h-2 rounded-full bg-[#e5e5e5] hover:bg-[#a3a3a3]',
      carouselNavBtn: 'bg-white text-[#171717] border-[#e5e5e5] hover:bg-[#fafafa]',
      categoryTabActive: 'bg-[#737373] text-white font-semibold shadow-sm',
      categoryTabInactive: 'bg-white hover:bg-[#fafafa] border-[#e5e5e5] text-[#525252]',
      sectionHeaderBorder: 'border-[#e5e5e5]',
      sectionTitle: 'text-[#171717]',
      sectionIcon: 'text-[#737373]',
      sectionSub: 'text-[#737373]',
      statusFilterWrap: 'bg-white border-[#e5e5e5]',
      statusFilterActive: 'bg-[#737373] text-white font-semibold shadow-xs',
      statusFilterInactive: 'text-[#737373] hover:text-[#171717]',
      emptyCard: 'bg-white border-[#e5e5e5]',
      emptyIcon: 'text-[#737373]',
      card: 'bg-white border-[#e5e5e5] hover:border-[#737373]/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)]',
      cardCoverBorder: 'border-[#e5e5e5]',
      cardTag: 'bg-white text-[#171717] border-[#e5e5e5]',
      cardTitle: 'text-[#171717]',
      cardTitleHover: 'group-hover:text-[#737373]',
      cardSynopsis: 'text-[#525252]',
      cardFooterBorder: 'border-[#e5e5e5]',
      cardAuthor: 'text-[#737373]',
      cardChapterBtn: 'text-[#737373]',
      recruitmentBanner: 'bg-white border border-[#e5e5e5]',
      recruitmentSubtitle: 'text-[#737373]',
      recruitmentTitle: 'text-[#171717]',
      recruitmentDesc: 'text-[#525252]',
      recruitmentBtn: 'bg-[#737373] text-white font-semibold hover:bg-[#525252] shadow-sm',
      sideCard: 'bg-white border border-[#e5e5e5]',
      sideCardTitle: 'text-[#171717]',
      sideCardTabWrap: 'bg-white border-[#e5e5e5]',
      sideCardTabActive: 'bg-[#737373] text-white font-semibold shadow-xs',
      sideCardTabInactive: 'text-[#737373] hover:text-[#171717]',
      sideCardItem: 'bg-white hover:bg-[#fafafa] border-[#e5e5e5] hover:border-[#737373]/60 transition-all',
      sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-[#e5e5e5] text-[#171717]',
      sideCardItemTitleHover: 'group-hover:text-[#737373]',
      sideCardItemAuthor: 'text-[#737373]',
      sideCardItemMetric: 'text-[#737373]',
      sideCardUpdateTitle: 'text-[#171717]',
      sideCardUpdateItem: 'bg-white hover:bg-[#fafafa] border-[#e5e5e5]',
      sideCardUpdateTime: 'text-[#737373]',
      badgeText: 'text-[#737373]',
      leaderboardItem: 'bg-white hover:bg-[#fafafa] border-[#e5e5e5] hover:border-[#737373]/60 transition-all',
      leaderboardRankBadge: 'bg-[#e5e5e5] text-[#171717]',
      readerText: 'text-[#171717]',
    };
  }

  // 5. MOCHA MOUSSE THEME (From 9854.png)
  if (theme === 'mocha') {
    if (isDarkMode) {
      return {
        pageBg: 'bg-[#15100c] text-[#ece2da]',
        headerBg: 'bg-[#1c140f]/50 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)]',
        headerBorder: 'border-white/15',
        footerBg: 'bg-[#15100c]/85 backdrop-blur-xl border-t border-white/10',
        logoBg: 'bg-gradient-to-tr from-[#6b4b3d] to-[#8c6150] text-white shadow-md shadow-[#231812]/40',
        logoBadge: 'bg-[#8c6150]/20 text-[#ebdcd3] border-[#8c6150]/35 backdrop-blur-md',
        logoTextHover: 'text-[#ece2da] group-hover:text-[#ebdcd3]',
        searchContainer: '',
        searchIcon: 'text-[#c2b0a2] hover:text-[#f3eae4]',
        input: 'bg-black/35 backdrop-blur-md border border-white/20 text-white placeholder-[#baa494]/60 focus:border-[#9f7260]/70 focus:ring-1 focus:ring-[#8c6150]/30 shadow-inner',
        buttonNeutral: 'bg-white/[0.07] backdrop-blur-md text-[#e4dbd4] border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
        buttonPrimary: 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260] text-white shadow-[0_0_16px_rgba(140,97,80,0.3)] hover:from-[#825b4b] hover:via-[#986b59] hover:to-[#a77a67]',
        buttonDarkMode: 'bg-white/[0.07] backdrop-blur-md text-[#d4a38c] border border-white/20 hover:bg-white/[0.14]',
        themeSelectorBtn: 'bg-white/[0.07] backdrop-blur-md text-[#e4dbd4] border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
        heroOuter: 'bg-gradient-to-br from-white/[0.09] via-[#231812]/50 to-[#15100c]/65 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]',
        heroInner: 'bg-gradient-to-b from-white/[0.07] via-[#281c15]/40 to-[#130e0a]/55 backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
        heroGridColor: '#a17a5e',
        heroGlowBg: 'bg-[#8c6150]/20',
        heroCoverBorder: 'border border-white/25 shadow-[0_12px_36px_rgba(0,0,0,0.7)] group-hover:shadow-[0_16px_45px_rgba(180,120,80,0.25)]',
        heroBadge1: 'bg-gradient-to-r from-[#775243] to-[#8c6150] text-white border border-[#9f7260]/30 shadow-md shadow-[#231812]/30',
        heroBadge2: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#e0d3c9]',
        heroBadge3: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#e0d3c9]',
        heroTitle: 'text-white',
        heroTitleHover: 'hover:text-[#ebdcd3]',
        heroAuthorMuted: 'text-[#9e8b7d]',
        heroAuthorValue: 'text-[#e6d0bf]',
        heroSynopsis: 'text-[#c7b5a7]',
        heroTag: 'bg-[#8c6150]/20 backdrop-blur-md border border-[#8c6150]/35 text-[#ebdcd3] shadow-xs hover:border-[#9f7260]/60',
        heroBtnRead: 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260] hover:from-[#825b4b] hover:via-[#986b59] hover:to-[#a77a67] text-white shadow-lg shadow-[#231812]/40 font-semibold',
        heroBtnBookmark: 'bg-white/[0.07] backdrop-blur-md border border-white/20 text-[#e0d3c9] hover:text-white hover:bg-white/[0.14]',
        heroBookmarkActive: 'fill-[#d4a38c] text-[#d4a38c]',
        carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-gradient-to-r from-[#8c6150] to-[#9f7260] shadow-[0_0_12px_rgba(140,97,80,0.4)]',
        carouselDotInactive: 'w-2 h-2 rounded-full bg-white/20 hover:bg-white/40',
        carouselNavBtn: 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] border border-white/20 text-[#e0d3c9] hover:text-white shadow-md',
        categoryTabActive: 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260] text-white shadow-[0_0_16px_rgba(140,97,80,0.3)]',
        categoryTabInactive: 'bg-white/[0.05] backdrop-blur-md hover:bg-white/[0.1] border border-white/12 text-[#c2b0a2] hover:text-[#f3eae4]',
        sectionHeaderBorder: 'border-white/10',
        sectionTitle: 'text-[#f0e6de]',
        sectionIcon: 'text-[#d4a38c]',
        sectionSub: 'text-[#9e8b7d]',
        statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        statusFilterActive: 'bg-gradient-to-r from-[#775243] to-[#8c6150] text-white shadow-xs',
        statusFilterInactive: 'text-[#9e8b7d] hover:text-white',
        emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
        emptyIcon: 'text-[#d4a38c]/60',
        card: 'bg-gradient-to-br from-white/[0.08] via-[#231812]/50 to-[#15100c]/65 backdrop-blur-md border border-white/15 hover:border-[#9f7260]/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_20px_48px_rgba(140,97,80,0.22),inset_0_1px_0_rgba(255,255,255,0.35)]',
        cardCoverBorder: 'border border-white/15',
        cardTag: 'bg-[#8c6150]/20 backdrop-blur-md text-[#ebdcd3] border border-[#8c6150]/35',
        cardTitle: 'text-[#f0e6de]',
        cardTitleHover: 'group-hover:text-[#ebdcd3]',
        cardSynopsis: 'text-[#b8a597]',
        cardFooterBorder: 'border-white/10',
        cardAuthor: 'text-[#9e8b7d]',
        cardChapterBtn: 'text-[#d4a38c]',
        recruitmentBanner: 'bg-gradient-to-r from-stone-950/40 via-[#231812]/50 to-[#2a1a14]/40 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]',
        recruitmentSubtitle: 'text-[#d4a38c]',
        recruitmentTitle: 'text-[#f0e6de]',
        recruitmentDesc: 'text-[#b8a597]',
        recruitmentBtn: 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260] hover:from-[#825b4b] hover:via-[#986b59] hover:to-[#a77a67] text-white shadow-md shadow-[#231812]/35 font-semibold',
        sideCard: 'bg-gradient-to-br from-white/[0.08] via-[#231812]/50 to-[#15100c]/65 backdrop-blur-md border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)]',
        sideCardTitle: 'text-[#f0e6de]',
        sideCardTabWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        sideCardTabActive: 'bg-gradient-to-r from-[#775243] to-[#8c6150] text-white',
        sideCardTabInactive: 'text-[#9e8b7d] hover:text-white',
        sideCardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-[#8c6150]/15 border border-white/10 hover:border-[#9f7260]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all',
        sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-white/[0.08] text-[#cfbaa9] border border-white/15',
        sideCardItemTitleHover: 'group-hover:text-[#ebdcd3]',
        sideCardItemAuthor: 'text-[#9e8b7d]',
        sideCardItemMetric: 'text-[#d4a38c]',
        sideCardUpdateTitle: 'text-[#f0e6de]',
        sideCardUpdateItem: 'bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] border border-white/10',
        sideCardUpdateTime: 'text-[#d4a38c]',
        badgeText: 'text-[#d4a38c]',
        leaderboardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-[#8c6150]/15 border border-white/10 hover:border-[#9f7260]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
        leaderboardRankBadge: 'bg-white/[0.08] text-[#cfbaa9] border border-white/15',
        readerText: 'text-[#ece2da]',
      };
    }
    // Linen Light (User custom palette: Nền #f5f1e6, Viền #E4D9BC, Chủ đạo #F8F4EE, Nút #A37764)
    return {
      pageBg: 'bg-[#f5f1e6] text-[#3A2A2A]',
      headerBg: 'bg-[#F8F4EE] backdrop-blur-xl shadow-[0_4px_24px_rgba(58,42,42,0.06)]',
      headerBorder: 'border-[#E4D9BC]/80',
      footerBg: 'bg-[#F8F4EE] border-t border-[#E4D9BC]/80',
      logoBg: 'bg-[#A37764] text-white shadow-sm',
      logoBadge: 'bg-[#F8F4EE] text-[#3A2A2A] border-[#E4D9BC]',
      logoTextHover: 'text-[#3A2A2A] group-hover:text-[#A37764]',
      searchContainer: '',
      searchIcon: 'text-[#8C7A6E]',
      input: 'bg-[#faf6f0] border-[#E4D9BC] text-[#3A2A2A] placeholder-[#8C7A6E] focus:border-[#A37764]',
      buttonNeutral: 'bg-transparent text-[#3A2A2A] border border-[#E4D9BC] hover:bg-[#F8F4EE]',
      buttonPrimary: 'bg-[#A37764] text-white hover:bg-[#8f6452] shadow-sm',
      buttonDarkMode: 'bg-transparent text-[#3A2A2A] border border-[#E4D9BC] hover:bg-[#F8F4EE]',
      themeSelectorBtn: 'bg-transparent text-[#3A2A2A] border border-[#E4D9BC] hover:bg-[#F8F4EE]',
      heroOuter: 'bg-[#F8F4EE] border border-[#E4D9BC]',
      heroInner: 'bg-gradient-to-b from-[#f5f1e6] via-[#F8F4EE] to-[#F8F4EE] border-[#E4D9BC]',
      heroGridColor: '#E4D9BC',
      heroGlowBg: 'bg-[#A37764]/15',
      heroCoverBorder: 'border-white shadow-[0_12px_32px_rgba(163,119,100,0.18)]',
      heroBadge1: 'bg-[#A37764] text-white shadow-xs',
      heroBadge2: 'bg-[#f5f1e6] border-[#E4D9BC] text-[#3A2A2A]',
      heroBadge3: 'bg-[#f5f1e6] border-[#E4D9BC] text-[#3A2A2A]',
      heroTitle: 'text-[#3A2A2A]',
      heroTitleHover: 'hover:text-[#A37764]',
      heroAuthorMuted: 'text-[#8C7A6E]',
      heroAuthorValue: 'text-[#3A2A2A]',
      heroSynopsis: 'text-[#8C7A6E]',
      heroTag: 'bg-[#f5f1e6] border-[#E4D9BC] text-[#3A2A2A] hover:border-[#A37764]',
      heroBtnRead: 'bg-[#A37764] text-white hover:bg-[#8f6452] shadow-sm',
      heroBtnBookmark: 'bg-transparent text-[#3A2A2A] border border-[#E4D9BC] hover:bg-[#F8F4EE]',
      heroBookmarkActive: 'fill-[#A37764] text-[#A37764]',
      carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#A37764] shadow-sm',
      carouselDotInactive: 'w-2 h-2 rounded-full bg-transparent border border-[#E4D9BC] hover:bg-[#E4D9BC]',
      carouselNavBtn: 'bg-transparent text-[#3A2A2A] border border-[#E4D9BC] hover:bg-[#F8F4EE]',
      categoryTabActive: 'bg-[#A37764] text-white shadow-sm',
      categoryTabInactive: 'bg-transparent hover:bg-[#F8F4EE] border border-[#E4D9BC] text-[#8C7A6E]',
      sectionHeaderBorder: 'border-[#E4D9BC]',
      sectionTitle: 'text-[#3A2A2A]',
      sectionIcon: 'text-[#A37764]',
      sectionSub: 'text-[#8C7A6E]',
      statusFilterWrap: 'bg-white border-[#E4D9BC]',
      statusFilterActive: 'bg-[#A37764] text-white shadow-xs',
      statusFilterInactive: 'text-[#8C7A6E] hover:text-[#3A2A2A]',
      emptyCard: 'bg-white border-[#E4D9BC]',
      emptyIcon: 'text-[#8C7A6E]',
      card: 'bg-[#fcfbf9] border-[#E4D9BC] hover:border-[#A37764] hover:shadow-[0_8px_25px_rgba(163,119,100,0.15)]',
      cardCoverBorder: 'border-[#E4D9BC]',
      cardTag: 'bg-[#f5f1e6] text-[#3A2A2A] border-[#E4D9BC]',
      cardTitle: 'text-[#3A2A2A]',
      cardTitleHover: 'group-hover:text-[#A37764]',
      cardSynopsis: 'text-[#8C7A6E]',
      cardFooterBorder: 'border-[#E4D9BC]/60',
      cardAuthor: 'text-[#8C7A6E]',
      cardChapterBtn: 'text-[#A37764]',
      recruitmentBanner: 'bg-[#F8F4EE] border border-[#E4D9BC]',
      recruitmentSubtitle: 'text-[#A37764]',
      recruitmentTitle: 'text-[#3A2A2A]',
      recruitmentDesc: 'text-[#8C7A6E]',
      recruitmentBtn: 'bg-[#A37764] text-white hover:bg-[#8f6452] shadow-sm',
      sideCard: 'bg-white border border-[#E4D9BC]',
      sideCardTitle: 'text-[#3A2A2A]',
      sideCardTabWrap: 'bg-[#f5f1e6] border-[#E4D9BC]',
      sideCardTabActive: 'bg-[#A37764] text-white shadow-xs',
      sideCardTabInactive: 'text-[#8C7A6E] hover:text-[#3A2A2A]',
      sideCardItem: 'bg-[#f5f1e6] hover:bg-white border-[#E4D9BC] hover:border-[#A37764]',
      sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-[#E4D9BC] text-[#3A2A2A]',
      sideCardItemTitleHover: 'group-hover:text-[#A37764]',
      sideCardItemAuthor: 'text-[#8C7A6E]',
      sideCardItemMetric: 'text-[#A37764]',
      sideCardUpdateTitle: 'text-[#3A2A2A]',
      sideCardUpdateItem: 'bg-[#f5f1e6] hover:bg-white border-[#E4D9BC]',
      sideCardUpdateTime: 'text-[#A37764]',
      badgeText: 'text-[#A37764]',
      leaderboardItem: 'bg-[#f5f1e6] hover:bg-white border-[#E4D9BC] hover:border-[#A37764]',
      leaderboardRankBadge: 'bg-[#E4D9BC] text-[#3A2A2A]',
      readerText: 'text-[#3A2A2A]',
    };
  }

  // 6. SAGE THEME (Default)
  if (isDarkMode) {
    return {
      pageBg: 'bg-[#0c1510] text-[#e0ede2]',
      headerBg: 'bg-[#101c14]/50 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)]',
      headerBorder: 'border-white/15',
      footerBg: 'bg-[#0c1510]/85 backdrop-blur-xl border-t border-white/10',
      logoBg: 'bg-gradient-to-tr from-[#3a523d] to-[#557759] text-white shadow-md shadow-[#0c1510]/40',
      logoBadge: 'bg-[#4d6f53]/20 text-[#d7e6d9] border-[#4d6f53]/35 backdrop-blur-md',
      logoTextHover: 'text-[#e5f0e7] group-hover:text-[#d7e6d9]',
      searchContainer: '',
      searchIcon: 'text-[#9db6a1] hover:text-[#e4efe5]',
      input: 'bg-black/35 backdrop-blur-md border border-white/20 text-white placeholder-[#8ca690]/60 focus:border-[#5e8264]/70 focus:ring-1 focus:ring-[#4d6f53]/30 shadow-inner',
      buttonNeutral: 'bg-white/[0.07] backdrop-blur-md text-[#d5e5d8] border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
      buttonPrimary: 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264] text-white shadow-[0_0_16px_rgba(77,111,83,0.3)] hover:from-[#46654b] hover:via-[#567a5c] hover:to-[#688e6e]',
      buttonDarkMode: 'bg-white/[0.07] backdrop-blur-md text-[#8cb391] border border-white/20 hover:bg-white/[0.14]',
      themeSelectorBtn: 'bg-white/[0.07] backdrop-blur-md text-[#d5e5d8] border border-white/20 hover:bg-white/[0.14] hover:border-white/30 shadow-xs',
      heroOuter: 'bg-gradient-to-br from-white/[0.09] via-[#142318]/50 to-[#0c1510]/65 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]',
      heroInner: 'bg-gradient-to-b from-white/[0.07] via-[#1a2c1f]/40 to-[#0b130e]/55 backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
      heroGridColor: '#34523a',
      heroGlowBg: 'bg-[#4d6f53]/20',
      heroCoverBorder: 'border border-white/25 shadow-[0_12px_36px_rgba(0,0,0,0.7)] group-hover:shadow-[0_16px_45px_rgba(42,64,45,0.25)]',
      heroBadge1: 'bg-gradient-to-r from-[#3e5b43] to-[#4d6f53] text-white border border-[#5e8264]/30 shadow-md shadow-[#0c1510]/30',
      heroBadge2: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#cee0d1]',
      heroBadge3: 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#cee0d1]',
      heroTitle: 'text-white',
      heroTitleHover: 'hover:text-[#d7e6d9]',
      heroAuthorMuted: 'text-[#7d9b80]',
      heroAuthorValue: 'text-[#b9d4bc]',
      heroSynopsis: 'text-[#acc6af]',
      heroTag: 'bg-[#4d6f53]/20 backdrop-blur-md border border-[#4d6f53]/35 text-[#d7e6d9] shadow-xs hover:border-[#5e8264]/60',
      heroBtnRead: 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264] hover:from-[#46654b] hover:via-[#567a5c] hover:to-[#688e6e] text-white shadow-lg shadow-[#0c1510]/40 font-semibold',
      heroBtnBookmark: 'bg-white/[0.07] backdrop-blur-md border border-white/20 text-[#cee0d1] hover:text-white hover:bg-white/[0.14]',
      heroBookmarkActive: 'fill-[#8cb391] text-[#8cb391]',
      carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-gradient-to-r from-[#4d6f53] to-[#5e8264] shadow-[0_0_12px_rgba(77,111,83,0.4)]',
      carouselDotInactive: 'w-2 h-2 rounded-full bg-white/20 hover:bg-white/40',
      carouselNavBtn: 'bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] border border-white/20 text-[#cee0d1] hover:text-white shadow-md',
      categoryTabActive: 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264] text-white shadow-[0_0_16px_rgba(77,111,83,0.3)]',
      categoryTabInactive: 'bg-white/[0.05] backdrop-blur-md hover:bg-white/[0.1] border border-white/12 text-[#9db6a1] hover:text-[#e4efe5]',
      sectionHeaderBorder: 'border-white/10',
      sectionTitle: 'text-[#e5f0e7]',
      sectionIcon: 'text-[#8cb391]',
      sectionSub: 'text-[#7d9b80]',
      statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
      statusFilterActive: 'bg-gradient-to-r from-[#3e5b43] to-[#4d6f53] text-white shadow-xs',
      statusFilterInactive: 'text-[#7d9b80] hover:text-white',
      emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
      emptyIcon: 'text-[#8cb391]/60',
      card: 'bg-gradient-to-br from-white/[0.08] via-[#142318]/50 to-[#0c1510]/65 backdrop-blur-md border border-white/15 hover:border-[#5e8264]/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_20px_48px_rgba(77,111,83,0.22),inset_0_1px_0_rgba(255,255,255,0.35)]',
      cardCoverBorder: 'border border-white/15',
      cardTag: 'bg-[#4d6f53]/20 backdrop-blur-md text-[#d7e6d9] border border-[#4d6f53]/35',
      cardTitle: 'text-[#e5f0e7]',
      cardTitleHover: 'group-hover:text-[#d7e6d9]',
      cardSynopsis: 'text-[#a2bba5]',
      cardFooterBorder: 'border-white/10',
      cardAuthor: 'text-[#7d9b80]',
      cardChapterBtn: 'text-[#8cb391]',
      recruitmentBanner: 'bg-gradient-to-r from-stone-950/40 via-[#142318]/50 to-[#102014]/40 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]',
      recruitmentSubtitle: 'text-[#8cb391]',
      recruitmentTitle: 'text-[#e5f0e7]',
      recruitmentDesc: 'text-[#a2bba5]',
      recruitmentBtn: 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264] hover:from-[#46654b] hover:via-[#567a5c] hover:to-[#688e6e] text-white shadow-md shadow-[#0c1510]/35 font-semibold',
      sideCard: 'bg-gradient-to-br from-white/[0.08] via-[#142318]/50 to-[#0c1510]/65 backdrop-blur-md border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)]',
      sideCardTitle: 'text-[#e5f0e7]',
      sideCardTabWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
      sideCardTabActive: 'bg-gradient-to-r from-[#3e5b43] to-[#4d6f53] text-white',
      sideCardTabInactive: 'text-[#7d9b80] hover:text-white',
      sideCardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-[#4d6f53]/15 border border-white/10 hover:border-[#5e8264]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all',
      sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-white/[0.08] text-[#a9c9ad] border border-white/15',
      sideCardItemTitleHover: 'group-hover:text-[#d7e6d9]',
      sideCardItemAuthor: 'text-[#7d9b80]',
      sideCardItemMetric: 'text-[#8cb391]',
      sideCardUpdateTitle: 'text-[#e5f0e7]',
      sideCardUpdateItem: 'bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] border border-white/10',
      sideCardUpdateTime: 'text-[#8cb391]',
      badgeText: 'text-[#8cb391]',
      leaderboardItem: 'bg-white/[0.04] backdrop-blur-md hover:bg-[#4d6f53]/15 border border-white/10 hover:border-[#5e8264]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
      leaderboardRankBadge: 'bg-white/[0.08] text-[#a9c9ad] border border-white/15',
      readerText: 'text-[#e0ede2]',
    };
  }

  // Sage Light (Màu nền dịu nhẹ, trung tính theo tông chủ đạo sage)
  return {
    pageBg: 'bg-[#f0f4ef] text-[#1c291e]',
    headerBg: 'bg-[#f0f4ef] backdrop-blur-xl shadow-[0_4px_24px_rgba(28,41,30,0.06)]',
    headerBorder: 'border-[#cad8c6]/80',
    footerBg: 'bg-[#f0f4ef] border-t border-[#cad8c6]/80',
    logoBg: 'bg-gradient-to-tr from-[#3f573d] to-[#678564] text-white',
    logoBadge: 'bg-[#dbe7d7] text-[#2c3d2d] border-[#cad8c6]',
    logoTextHover: 'text-[#1c2b1e] group-hover:text-[#435e41]',
    searchContainer: '',
    searchIcon: 'text-[#678064]',
    input: 'bg-[#f7faf6] border-[#c5d5c2] text-[#1c2a1e] placeholder-[#7d937b] focus:border-[#425d40]',
    buttonNeutral: 'bg-white text-[#2d3e2f] border-[#c8d7c5] hover:bg-[#f5f8f4]',
    buttonPrimary: 'bg-gradient-to-r from-[#3c563a] to-[#557752] text-white hover:from-[#324930] hover:to-[#496746]',
    buttonDarkMode: 'bg-white text-[#1f2f21] border-[#c0d3bd] hover:bg-stone-50',
    themeSelectorBtn: 'bg-white text-[#1f2f21] border-[#c0d3bd] hover:bg-stone-50',
    heroOuter: 'bg-white border border-[#d6e2d4]',
    heroInner: 'bg-gradient-to-b from-[#f4f8f2] via-[#ebf3e8] to-[#e4eee1] border-[#d4e0d1]',
    heroGridColor: '#5c7959',
    heroGlowBg: 'bg-[#98b894]',
    heroCoverBorder: 'border-white shadow-[0_12px_35px_rgba(30,50,30,0.18)] group-hover:shadow-[0_16px_40px_rgba(30,50,30,0.25)]',
    heroBadge1: 'bg-[#4d664a] text-white',
    heroBadge2: 'bg-white/80 border-[#cad6c7] text-[#2c3d2e]',
    heroBadge3: 'bg-white/80 border-[#cad6c7] text-[#2c3d2e]',
    heroTitle: 'text-[#1c2b1e]',
    heroTitleHover: 'hover:text-[#436240]',
    heroAuthorMuted: 'text-[#586c5a]',
    heroAuthorValue: 'text-[#1c2b1e]',
    heroSynopsis: 'text-[#394a3b]',
    heroTag: 'bg-white/85 border-[#cbd7c8] text-[#2c3e2e] shadow-2xs hover:border-[#4d664a]',
    heroBtnRead: 'bg-white text-[#1c2b1e] border border-[#cad8c6] hover:bg-[#f6faf4] shadow-[0_4px_15px_rgba(40,65,40,0.08)]',
    heroBtnBookmark: 'bg-white text-[#2c3d2d] border border-[#cad8c6] hover:bg-[#edf4eb] hover:border-[#446042]',
    heroBookmarkActive: 'fill-[#4d664a] text-[#4d664a]',
    carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#466244] shadow-xs',
    carouselDotInactive: 'w-2 h-2 rounded-full bg-[#bdcfbc] hover:bg-[#97af95]',
    carouselNavBtn: 'bg-white text-[#2c3d2d] border border-[#cad8c6] hover:bg-[#edf4eb] hover:border-[#446042]',
    categoryTabActive: 'bg-[#466244] text-white shadow-md',
    categoryTabInactive: 'bg-white/80 hover:bg-white border border-[#cad8c6] text-[#2f4031]',
    sectionHeaderBorder: 'border-[#cad8c6]',
    sectionTitle: 'text-[#1c2b1e]',
    sectionIcon: 'text-[#486645]',
    sectionSub: 'text-[#5b6f5d]',
    statusFilterWrap: 'bg-white border-[#cad8c6]',
    statusFilterActive: 'bg-[#466244] text-white shadow-xs',
    statusFilterInactive: 'text-[#4b5e4d] hover:text-[#1c2b1e]',
    emptyCard: 'bg-white border-[#cad8c6]',
    emptyIcon: 'text-[#7d937c]',
    card: 'bg-[#fafbfa] border-[#cbd7c8] hover:border-[#4d664a] hover:shadow-[0_8px_25px_rgba(40,65,40,0.1)]',
    cardCoverBorder: 'border-[#cad8c6]',
    cardTag: 'bg-[#f0f4ef] text-[#2c3e2e] border-[#c8d7c5]',
    cardTitle: 'text-[#1c2b1e]',
    cardTitleHover: 'group-hover:text-[#436240]',
    cardSynopsis: 'text-[#485b4b]',
    cardFooterBorder: 'border-[#d4e1d1]',
    cardAuthor: 'text-[#586c5a]',
    cardChapterBtn: 'text-[#3f5a3d]',
    recruitmentBanner: 'bg-white border border-[#d6e2d4]',
    recruitmentSubtitle: 'text-[#466244]',
    recruitmentTitle: 'text-[#1c2b1e]',
    recruitmentDesc: 'text-[#485b4b]',
    recruitmentBtn: 'bg-[#466244] hover:bg-[#374f35]',
    sideCard: 'bg-white border border-[#d6e2d4]',
    sideCardTitle: 'text-[#1c2b1e]',
    sideCardTabWrap: 'bg-white/80 border-[#cad8c6]',
    sideCardTabActive: 'bg-[#466244] text-white shadow-2xs',
    sideCardTabInactive: 'text-[#516553] hover:text-[#1c2b1e]',
    sideCardItem: 'bg-white hover:bg-[#fafcf9] border-[#cad8c6] hover:border-[#4d664a]',
    sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-[#d8e5d5] text-[#344735]',
    sideCardItemTitleHover: 'group-hover:text-[#466244]',
    sideCardItemAuthor: 'text-[#586c5a]',
    sideCardItemMetric: 'text-[#466244]',
    sideCardUpdateTitle: 'text-[#1c2b1e]',
    sideCardUpdateItem: 'bg-white hover:bg-[#fafcf9] border-[#cad8c6]',
    sideCardUpdateTime: 'text-[#466244]',
    badgeText: 'text-[#466244]',
    leaderboardItem: 'bg-white hover:bg-[#fafcf9] border-[#cad8c6] hover:border-[#4d664a]',
    leaderboardRankBadge: 'bg-[#d8e5d5] text-[#344735]',
    readerText: 'text-[#1c291e]',
  };
}

export function isExtraChapter(chap?: { title?: string; isExtra?: boolean; chapterNumber?: number } | null): boolean {
  if (!chap) return false;
  if (chap.isExtra === true) return true;
  const lower = (chap.title || '').toLowerCase().trim();
  return (
    lower.includes('ngoại truyện') ||
    lower.includes('phiên ngoại') ||
    lower.includes('ngoại văn') ||
    /(?:^|\b)(?:pn|extra)\b/i.test(lower) ||
    /\b(?:pn|extra)\s*\d+/i.test(lower) ||
    /^[\[(【]?\s*(?:ngoại\s*truyện|phiên\s*ngoại|ngoại\s*văn|pn)/i.test(lower)
  );
}

export function getExtraChapterBadgeStyle(theme: NovelThemeId, isDarkMode: boolean): string {
  const isDarkEffective = theme === 'cosmic' || isDarkMode;
  switch (theme) {
    case 'cosmic':
      return 'bg-purple-950/70 text-purple-300 border-purple-500/40 shadow-xs shadow-purple-950/50';
    case 'amethyst-haze':
      return isDarkEffective
        ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
        : 'bg-purple-100/90 text-purple-800 border-purple-300/90 shadow-2xs';
    case 'notebook':
      return isDarkEffective
        ? 'bg-neutral-800/90 text-neutral-200 border-neutral-600'
        : 'bg-neutral-100 text-neutral-800 border-neutral-300 shadow-2xs';
    case 'slate-haze':
      return isDarkEffective
        ? 'bg-sky-950/60 text-sky-300 border-sky-500/40'
        : 'bg-sky-100/90 text-sky-800 border-sky-300 shadow-2xs';
    case 'sage':
      return isDarkEffective
        ? 'bg-[#18261b] text-[#a1b89e] border border-[#2c4731]/50'
        : 'bg-emerald-100/90 text-emerald-800 border-emerald-300 shadow-2xs';
    case 'mocha':
      return isDarkEffective
        ? 'bg-[#241710] text-[#bda99b] border border-[#3d271c]/50'
        : 'bg-[#f4ebe1] text-[#6d4c38] border-[#dfcfbe] shadow-2xs';
    default:
      return isDarkEffective
        ? 'bg-purple-900/40 text-purple-300 border-purple-500/30'
        : 'bg-purple-100 text-purple-700 border-purple-200';
  }
}

export interface ChapterDisplayParts {
  chapterLabel: string;
  isExtra: boolean;
  restTitle: string;
  fullCleanTitle: string;
}

export function getChapterDisplayParts(
  chap?: { chapterNumber?: number; title?: string; isExtra?: boolean } | null
): ChapterDisplayParts {
  if (!chap) {
    return { chapterLabel: '', isExtra: false, restTitle: '', fullCleanTitle: '' };
  }

  const isExtra = isExtraChapter(chap);
  const rawTitle = (chap.title || '').trim();

  // Pattern 1: Title explicitly starts with "Chương \d+", "Chapter \d+", "Hồi \d+"
  const standardMatch = rawTitle.match(/^(Chương\s+\d+|Chapter\s+\d+|Hồi\s+\d+)([\s:\-–—].*|$)/i);
  if (standardMatch) {
    const chapterLabel = standardMatch[1].trim();
    let rest = (standardMatch[2] || '').trim();
    if (rest) {
      if (!/^[:\-–—]/.test(rest)) {
        rest = `: ${rest}`;
      } else {
        rest = rest.replace(/^([:\-–—])\s*/, '$1 ');
      }
    }
    return {
      chapterLabel,
      isExtra,
      restTitle: rest,
      fullCleanTitle: `${chapterLabel}${rest}`,
    };
  }

  // Pattern 2: Title does NOT start with "Chương \d+", but chapter has chapterNumber > 0
  if (chap.chapterNumber && chap.chapterNumber > 0) {
    const chapterLabel = `Chương ${chap.chapterNumber}`;
    let rest = rawTitle;
    if (rest) {
      if (!/^[:\-–—]/.test(rest)) {
        rest = `: ${rest}`;
      } else {
        rest = rest.replace(/^([:\-–—])\s*/, '$1 ');
      }
    }
    return {
      chapterLabel,
      isExtra,
      restTitle: rest,
      fullCleanTitle: `${chapterLabel}${rest}`,
    };
  }

  // Pattern 3: Fallback if neither exists
  return {
    chapterLabel: rawTitle || 'Chương',
    isExtra,
    restTitle: '',
    fullCleanTitle: rawTitle || 'Chương',
  };
}
