export type NovelThemeId = string;

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
    dots: ['#6e5d8a', '#baa4db', '#dfd2f2'],
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
    dots: ['#8c6d5d', '#ded2c7', '#f5efe8'],
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
  commentCard?: string;
  commentForm?: string;
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
      logoTextHover: 'text-[#d8ceeb] group-hover:text-[#e4daf5] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]',
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
      commentCard: 'bg-white/[0.03] backdrop-blur-md border border-white/10 text-purple-100 shadow-2xs',
      commentForm: 'bg-white/[0.04] backdrop-blur-md border border-white/12 text-purple-100 shadow-xs',
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
        logoTextHover: 'text-[#cddbe8] group-hover:text-[#dee8f2] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]',
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
        sectionTitle: 'text-white font-bold',
        sectionIcon: 'text-[#8bb0cf]',
        sectionSub: 'text-[#8ba0b5]',
        statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        statusFilterActive: 'bg-gradient-to-r from-[#3e566d] to-[#4d6a85] text-white shadow-xs',
        statusFilterInactive: 'text-[#8ba0b5] hover:text-white',
        emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
        emptyIcon: 'text-[#8bb0cf]/60',
        card: 'bg-gradient-to-br from-white/[0.08] via-[#141e2a]/50 to-[#0b1118]/65 backdrop-blur-md border border-white/15 hover:border-[#5d7e9d]/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_20px_48px_rgba(77,106,133,0.25),inset_0_1px_0_rgba(255,255,255,0.35)]',
        commentCard: 'bg-[#121c27]/60 backdrop-blur-md border border-white/10 text-[#edf4fa] shadow-2xs',
        commentForm: 'bg-[#121c27]/80 backdrop-blur-md border border-white/12 text-[#edf4fa] shadow-xs',
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
      pageBg: 'bg-[#f3f7fc] text-[#334e68]',
      headerBg: 'bg-[#ebf3fa]/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(16,23,35,0.06)]',
      headerBorder: 'border-[#d8dfe9]/80',
      footerBg: 'bg-[#ebf3fa] border-t border-[#d8dfe9]/80',
      logoBg: 'bg-[#87909d] text-white shadow-xs',
      logoBadge: 'bg-[#f9fcff] text-[#101723] border-[#d8dfe9]',
      logoTextHover: 'text-[#244b73] group-hover:text-[#0284c7]',
      searchContainer: '',
      searchIcon: 'text-[#64748b]',
      input: 'bg-[#e9f1f7] border-[#c4d2e2] text-[#101723] placeholder-[#7d8e9e] focus:border-[#87909d] focus:bg-[#dfeaf3]',
      buttonNeutral: 'frost-light-btn !py-1.5 !px-3 font-medium',
      buttonPrimary: 'frost-light-btn-active !py-1.5 !px-3 font-bold',
      buttonDarkMode: 'frost-light-btn !p-2',
      themeSelectorBtn: 'frost-light-btn !p-2 sm:!px-3 sm:!py-1.5 font-bold',
      heroOuter: 'bg-[#f9fcff] border border-[#d8dfe9]',
      heroInner: 'bg-gradient-to-b from-[#ffffff] via-[#f9fcff] to-[#f3f7fc] border-[#d8dfe9]',
      heroGridColor: '#d8dfe9',
      heroGlowBg: 'bg-[#d8dfe9]/40',
      heroCoverBorder: 'border-2 border-white shadow-[0_16px_38px_rgba(16,23,35,0.18),0_4px_12px_rgba(16,23,35,0.08)] group-hover:shadow-[0_22px_45px_rgba(16,23,35,0.25)]',
      heroBadge1: 'frost-light-novel-tag font-bold',
      heroBadge2: 'frost-light-novel-tag',
      heroBadge3: 'frost-light-novel-tag',
      heroTitle: 'text-[#101723]',
      heroTitleHover: 'hover:text-[#87909d]',
      heroAuthorMuted: 'text-[#64748b]',
      heroAuthorValue: 'text-[#101723]',
      heroSynopsis: 'text-[#334155]',
      heroTag: 'frost-light-novel-tag',
      heroBtnRead: 'frost-light-btn-active font-bold !px-5 !py-2.5 shadow-sm',
      heroBtnBookmark: 'frost-light-btn !px-4 !py-2.5',
      heroBookmarkActive: 'fill-[#0284c7] text-[#0284c7]',
      carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#0284c7] shadow-xs',
      carouselDotInactive: 'w-2 h-2 rounded-full bg-transparent border border-[#d8dfe9] hover:bg-[#d8dfe9]',
      carouselNavBtn: 'frost-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
      categoryTabActive: 'frost-light-btn-active font-bold',
      categoryTabInactive: 'frost-light-btn font-medium',
      sectionHeaderBorder: 'border-[#d8dfe9]',
      sectionTitle: 'text-[#101723]',
      sectionIcon: 'text-[#0284c7]',
      sectionSub: 'text-[#64748b]',
      statusFilterWrap: 'frost-light-tabs-container p-1 rounded-full',
      statusFilterActive: 'frost-light-btn-active font-bold',
      statusFilterInactive: 'frost-light-btn font-medium',
      emptyCard: 'bg-white border-[#d8dfe9]',
      emptyIcon: 'text-[#64748b]',
      card: 'frost-light-novel-card',
      commentCard: 'bg-[#f8fafd]/90 border border-[#e2effa] text-[#0f172a] shadow-2xs',
      commentForm: 'bg-[#f4f8fd]/90 border border-[#d2e4f6] text-[#0f172a] shadow-2xs',
      cardCoverBorder: 'border-[#bae6fe]/60 shadow-xs',
      cardTag: 'frost-light-novel-tag',
      cardTitle: 'text-[#0f172a]',
      cardTitleHover: 'group-hover:text-[#0284c7]',
      cardSynopsis: 'text-[#475569]',
      cardFooterBorder: 'frost-light-novel-divider border-[#bae6fe]/60',
      cardAuthor: 'text-[#475569]',
      cardChapterBtn: 'text-[#0284c7]',
      recruitmentBanner: 'bg-[#f9fcff] border border-[#d8dfe9]',
      recruitmentSubtitle: 'text-[#87909d]',
      recruitmentTitle: 'text-[#101723]',
      recruitmentDesc: 'text-[#475569]',
      recruitmentBtn: 'frost-light-btn font-bold hover:!text-[#0284c7] cursor-pointer',
      sideCard: 'bg-white border-[1.5px] border-[#d8dfe9] shadow-xs',
      sideCardTitle: 'text-[#101723]',
      sideCardTabWrap: 'frost-light-tabs-container p-1 rounded-full',
      sideCardTabActive: 'frost-light-btn-active font-bold',
      sideCardTabInactive: 'frost-light-btn font-medium',
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
      readerText: 'text-[#334e68]',
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
        logoTextHover: 'text-[#e0d6ec] group-hover:text-[#ede4f8] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]',
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
        sectionTitle: 'text-white font-bold',
        sectionIcon: 'text-[#bdaed3]',
        sectionSub: 'text-[#9789ad]',
        statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        statusFilterActive: 'bg-[#6d5588] text-white shadow-xs',
        statusFilterInactive: 'text-[#9789ad] hover:text-white',
        emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
        emptyIcon: 'text-[#bdaed3]/60',
        card: 'bg-gradient-to-br from-white/[0.08] via-[#19122a]/50 to-[#110a1c]/65 backdrop-blur-2xl border border-white/15 hover:border-[#8e7aa8]/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_20px_48px_rgba(115,90,143,0.2),inset_0_1px_0_rgba(255,255,255,0.25)]',
        commentCard: 'bg-white/[0.03] backdrop-blur-md border border-white/10 text-[#f0edf7] shadow-2xs',
        commentForm: 'bg-white/[0.04] backdrop-blur-md border border-white/12 text-[#f0edf7] shadow-xs',
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
      logoTextHover: 'text-[#58397a] group-hover:text-[#7e58a6]',
      searchContainer: '',
      searchIcon: 'text-[#7e739f]',
      input: 'bg-[#f1ebf7] border-[#c0b9ce] text-[#211c2f] placeholder-[#8d82a6] focus:border-[#7e739f] focus:bg-[#eae3f2]',
      buttonNeutral: 'amethyst-light-btn !py-1.5 !px-3 font-medium',
      buttonPrimary: 'amethyst-light-btn-active !py-1.5 !px-3 font-bold',
      buttonDarkMode: 'amethyst-light-btn !p-2',
      themeSelectorBtn: 'amethyst-light-btn !p-2 sm:!px-3 sm:!py-1.5 font-bold',
      heroOuter: 'bg-white border border-[#ded8ea]',
      heroInner: 'bg-gradient-to-b from-[#ffffff] via-[#f7f4fb] to-[#ebe5f3] border-[#d4cee2]',
      heroGridColor: '#9f94b8',
      heroGlowBg: 'bg-[#dad7e7]',
      heroCoverBorder: 'border-white shadow-[0_12px_35px_rgba(40,25,60,0.18)] group-hover:shadow-[0_16px_40px_rgba(40,25,60,0.25)]',
      heroBadge1: 'amethyst-light-novel-tag font-bold',
      heroBadge2: 'amethyst-light-novel-tag',
      heroBadge3: 'amethyst-light-novel-tag',
      heroTitle: 'text-[#211c2f]',
      heroTitleHover: 'hover:text-[#7e739f]',
      heroAuthorMuted: 'text-[#756e87]',
      heroAuthorValue: 'text-[#211c2f]',
      heroSynopsis: 'text-[#423956]',
      heroTag: 'amethyst-light-novel-tag',
      heroBtnRead: 'amethyst-light-btn-active font-bold !px-5 !py-2.5 shadow-sm',
      heroBtnBookmark: 'amethyst-light-btn !px-4 !py-2.5',
      heroBookmarkActive: 'fill-[#d59aa7] text-[#d59aa7]',
      carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#7e739f] shadow-xs',
      carouselDotInactive: 'w-2 h-2 rounded-full bg-[#cac6d6] hover:bg-[#a69cbd]',
      carouselNavBtn: 'amethyst-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
      categoryTabActive: 'amethyst-light-btn-active font-bold',
      categoryTabInactive: 'amethyst-light-btn font-medium',
      sectionHeaderBorder: 'border-[#cac6d6]',
      sectionTitle: 'text-[#211c2f]',
      sectionIcon: 'text-[#d59aa7]',
      sectionSub: 'text-[#756e87]',
      statusFilterWrap: 'amethyst-light-tabs-container p-1 rounded-full',
      statusFilterActive: 'amethyst-light-btn-active font-bold',
      statusFilterInactive: 'amethyst-light-btn font-medium',
      emptyCard: 'bg-white/50 border-[#cac6d6]',
      emptyIcon: 'text-[#a499be]',
      card: 'amethyst-light-novel-card',
      commentCard: 'bg-[#fcfaff]/90 border border-[#f3ebfc] text-[#211c2f] shadow-2xs',
      commentForm: 'bg-[#faf7fd]/90 border border-[#ebdff8] text-[#211c2f] shadow-2xs',
      cardCoverBorder: 'border-[#dfdae8]',
      cardTag: 'amethyst-light-novel-tag',
      cardTitle: 'text-[#211c2f]',
      cardTitleHover: 'group-hover:text-[#7e739f]',
      cardSynopsis: 'text-[#544a6b]',
      cardFooterBorder: 'amethyst-light-novel-divider border-[#dfdae8]',
      cardAuthor: 'text-[#756e87]',
      cardChapterBtn: 'text-[#7e739f]',
      recruitmentBanner: 'bg-white border border-[#ded8ea]',
      recruitmentSubtitle: 'text-[#d59aa7]',
      recruitmentTitle: 'text-[#211c2f]',
      recruitmentDesc: 'text-[#544a6b]',
      recruitmentBtn: 'amethyst-light-btn font-bold hover:!text-[#7e58a6] cursor-pointer',
      sideCard: 'bg-white border border-[#ded8ea]',
      sideCardTitle: 'text-[#211c2f]',
      sideCardTabWrap: 'amethyst-light-tabs-container p-1 rounded-full',
      sideCardTabActive: 'amethyst-light-btn-active font-bold',
      sideCardTabInactive: 'amethyst-light-btn font-medium',
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
        logoTextHover: 'text-[#dcdce0] group-hover:text-[#ffffff] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]',
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
        sectionTitle: 'text-white font-bold',
        sectionIcon: 'text-[#B8B2A5]',
        sectionSub: 'text-[#a3a3a3]',
        statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        statusFilterActive: 'bg-[#737373] text-white shadow-xs font-semibold',
        statusFilterInactive: 'text-[#a3a3a3] hover:text-white',
        emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
        emptyIcon: 'text-[#737373]',
        card: 'bg-gradient-to-br from-white/[0.08] via-[#1c1815]/50 to-[#100e0c]/65 backdrop-blur-2xl border border-white/15 hover:border-white/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_20px_48px_rgba(255,255,255,0.22),inset_0_1px_0_rgba(255,255,255,0.35)]',
        commentCard: 'bg-[#181818]/60 backdrop-blur-md border border-white/10 text-[#F7F4EE] shadow-2xs',
        commentForm: 'bg-[#181818]/80 backdrop-blur-md border border-white/12 text-[#F7F4EE] shadow-xs',
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
      logoTextHover: 'text-[#1c1917] group-hover:text-[#57534e]',
      searchContainer: '',
      searchIcon: 'text-neutral-400',
      input: 'bg-neutral-100/90 border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-neutral-500 focus:bg-neutral-200/70',
      buttonNeutral: 'notebook-light-btn !py-1.5 !px-3 font-medium',
      buttonPrimary: 'notebook-light-btn-active !py-1.5 !px-3 font-bold',
      buttonDarkMode: 'notebook-light-btn !p-2',
      themeSelectorBtn: 'notebook-light-btn !p-2 sm:!px-3 sm:!py-1.5 font-bold',
      heroOuter: 'bg-white border border-[#e5e5e5]',
      heroInner: 'bg-gradient-to-b from-[#ffffff] via-[#fafafa] to-[#f5f5f5] border-[#e5e5e5]',
      heroGridColor: '#e5e5e5',
      heroGlowBg: 'bg-[#e5e5e5]/40',
      heroCoverBorder: 'border-white shadow-[0_12px_32px_rgba(0,0,0,0.08)]',
      heroBadge1: 'notebook-light-novel-tag font-bold',
      heroBadge2: 'notebook-light-novel-tag',
      heroBadge3: 'notebook-light-novel-tag',
      heroTitle: 'text-[#171717]',
      heroTitleHover: 'hover:text-[#737373]',
      heroAuthorMuted: 'text-[#737373]',
      heroAuthorValue: 'text-[#171717]',
      heroSynopsis: 'text-[#525252]',
      heroTag: 'notebook-light-novel-tag',
      heroBtnRead: 'notebook-light-btn-active font-bold !px-5 !py-2.5 shadow-sm',
      heroBtnBookmark: 'notebook-light-btn !px-4 !py-2.5',
      heroBookmarkActive: 'fill-[#737373] text-[#737373]',
      carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#737373] shadow-sm',
      carouselDotInactive: 'w-2 h-2 rounded-full bg-[#e5e5e5] hover:bg-[#a3a3a3]',
      carouselNavBtn: 'notebook-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
      categoryTabActive: 'notebook-light-btn-active font-bold',
      categoryTabInactive: 'notebook-light-btn font-medium',
      sectionHeaderBorder: 'border-[#e5e5e5]',
      sectionTitle: 'text-[#171717]',
      sectionIcon: 'text-[#737373]',
      sectionSub: 'text-[#737373]',
      statusFilterWrap: 'notebook-light-tabs-container p-1 rounded-full',
      statusFilterActive: 'notebook-light-btn-active font-bold',
      statusFilterInactive: 'notebook-light-btn font-medium',
      emptyCard: 'bg-white border-[#e5e5e5]',
      emptyIcon: 'text-[#737373]',
      card: 'notebook-light-novel-card',
      commentCard: 'bg-[#fafafa]/90 border border-[#e5e5e5] text-[#171717] shadow-2xs',
      commentForm: 'bg-[#f8fafc]/90 border border-[#e2e8f0] text-[#171717] shadow-2xs',
      cardCoverBorder: 'border-[#e5e5e5]',
      cardTag: 'notebook-light-novel-tag',
      cardTitle: 'text-[#171717]',
      cardTitleHover: 'group-hover:text-[#737373]',
      cardSynopsis: 'text-[#525252]',
      cardFooterBorder: 'notebook-light-novel-divider border-[#e5e5e5]',
      cardAuthor: 'text-[#737373]',
      cardChapterBtn: 'text-[#737373]',
      recruitmentBanner: 'bg-white border border-[#e5e5e5]',
      recruitmentSubtitle: 'text-[#737373]',
      recruitmentTitle: 'text-[#171717]',
      recruitmentDesc: 'text-[#525252]',
      recruitmentBtn: 'notebook-light-btn font-bold hover:!text-[#171717] cursor-pointer',
      sideCard: 'bg-white border border-[#e5e5e5]',
      sideCardTitle: 'text-[#171717]',
      sideCardTabWrap: 'notebook-light-tabs-container p-1 rounded-full',
      sideCardTabActive: 'notebook-light-btn-active font-bold',
      sideCardTabInactive: 'notebook-light-btn font-medium',
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
        logoTextHover: 'text-[#dfd4cc] group-hover:text-[#ede4dd] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]',
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
        sectionTitle: 'text-white font-bold',
        sectionIcon: 'text-[#d4a38c]',
        sectionSub: 'text-[#9e8b7d]',
        statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
        statusFilterActive: 'bg-gradient-to-r from-[#775243] to-[#8c6150] text-white shadow-xs',
        statusFilterInactive: 'text-[#9e8b7d] hover:text-white',
        emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
        emptyIcon: 'text-[#d4a38c]/60',
        card: 'bg-gradient-to-br from-white/[0.08] via-[#231812]/50 to-[#15100c]/65 backdrop-blur-md border border-white/15 hover:border-[#9f7260]/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_20px_48px_rgba(140,97,80,0.22),inset_0_1px_0_rgba(255,255,255,0.35)]',
        commentCard: 'bg-[#1e1510]/60 backdrop-blur-md border border-white/10 text-[#f0e6de] shadow-2xs',
        commentForm: 'bg-[#1e1510]/80 backdrop-blur-md border border-white/12 text-[#f0e6de] shadow-xs',
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
      logoTextHover: 'text-[#6e4632] group-hover:text-[#a37764]',
      searchContainer: '',
      searchIcon: 'text-[#8C7A6E]',
      input: 'bg-[#efe6db] border-[#d8cbb0] text-[#3A2A2A] placeholder-[#8C7A6E] focus:border-[#A37764] focus:bg-[#e8decb]',
      buttonNeutral: 'mocha-light-btn !py-1.5 !px-3 font-medium',
      buttonPrimary: 'mocha-light-btn-active !py-1.5 !px-3 font-bold',
      buttonDarkMode: 'mocha-light-btn !p-2',
      themeSelectorBtn: 'mocha-light-btn !p-2 sm:!px-3 sm:!py-1.5 font-bold',
      heroOuter: 'bg-[#F8F4EE] border border-[#E4D9BC]',
      heroInner: 'bg-gradient-to-b from-[#f5f1e6] via-[#F8F4EE] to-[#F8F4EE] border-[#E4D9BC]',
      heroGridColor: '#E4D9BC',
      heroGlowBg: 'bg-[#A37764]/15',
      heroCoverBorder: 'border-white shadow-[0_12px_32px_rgba(163,119,100,0.18)]',
      heroBadge1: 'mocha-light-novel-tag font-bold',
      heroBadge2: 'mocha-light-novel-tag',
      heroBadge3: 'mocha-light-novel-tag',
      heroTitle: 'text-[#3A2A2A]',
      heroTitleHover: 'hover:text-[#A37764]',
      heroAuthorMuted: 'text-[#8C7A6E]',
      heroAuthorValue: 'text-[#3A2A2A]',
      heroSynopsis: 'text-[#8C7A6E]',
      heroTag: 'mocha-light-novel-tag',
      heroBtnRead: 'mocha-light-btn-active font-bold !px-5 !py-2.5 shadow-sm',
      heroBtnBookmark: 'mocha-light-btn !px-4 !py-2.5',
      heroBookmarkActive: 'fill-[#A37764] text-[#A37764]',
      carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#A37764] shadow-sm',
      carouselDotInactive: 'w-2 h-2 rounded-full bg-transparent border border-[#E4D9BC] hover:bg-[#E4D9BC]',
      carouselNavBtn: 'mocha-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
      categoryTabActive: 'mocha-light-btn-active font-bold',
      categoryTabInactive: 'mocha-light-btn font-medium',
      sectionHeaderBorder: 'border-[#E4D9BC]',
      sectionTitle: 'text-[#3A2A2A]',
      sectionIcon: 'text-[#A37764]',
      sectionSub: 'text-[#8C7A6E]',
      statusFilterWrap: 'mocha-light-tabs-container p-1 rounded-full',
      statusFilterActive: 'mocha-light-btn-active font-bold',
      statusFilterInactive: 'mocha-light-btn font-medium',
      emptyCard: 'bg-white border-[#E4D9BC]',
      emptyIcon: 'text-[#8C7A6E]',
      card: 'mocha-light-novel-card',
      commentCard: 'bg-[#fcf9f5]/90 border border-[#f3e9e0] text-[#3A2A2A] shadow-2xs',
      commentForm: 'bg-[#faf6f1]/90 border border-[#ecdccf] text-[#3A2A2A] shadow-2xs',
      cardCoverBorder: 'border-[#E4D9BC]',
      cardTag: 'mocha-light-novel-tag',
      cardTitle: 'text-[#3A2A2A]',
      cardTitleHover: 'group-hover:text-[#A37764]',
      cardSynopsis: 'text-[#8C7A6E]',
      cardFooterBorder: 'mocha-light-novel-divider border-[#E4D9BC]',
      cardAuthor: 'text-[#8C7A6E]',
      cardChapterBtn: 'text-[#A37764]',
      recruitmentBanner: 'bg-[#F8F4EE] border border-[#E4D9BC]',
      recruitmentSubtitle: 'text-[#A37764]',
      recruitmentTitle: 'text-[#3A2A2A]',
      recruitmentDesc: 'text-[#8C7A6E]',
      recruitmentBtn: 'mocha-light-btn font-bold hover:!text-[#a37764] cursor-pointer',
      sideCard: 'bg-white border border-[#E4D9BC]',
      sideCardTitle: 'text-[#3A2A2A]',
      sideCardTabWrap: 'mocha-light-tabs-container p-1 rounded-full',
      sideCardTabActive: 'mocha-light-btn-active font-bold',
      sideCardTabInactive: 'mocha-light-btn font-medium',
      sideCardItem: 'bg-[#fdfbf7] hover:bg-white border-[#ebe3d3] hover:border-[#A37764] transition-all',
      sideCardRankBadge: (idx) => idx < 3 ? '' : 'bg-[#E4D9BC] text-[#3A2A2A]',
      sideCardItemTitleHover: 'group-hover:text-[#A37764]',
      sideCardItemAuthor: 'text-[#8C7A6E]',
      sideCardItemMetric: 'text-[#A37764]',
      sideCardUpdateTitle: 'text-[#3A2A2A]',
      sideCardUpdateItem: 'bg-[#fdfbf7] hover:bg-white border-[#ebe3d3]',
      sideCardUpdateTime: 'text-[#A37764]',
      badgeText: 'text-[#A37764]',
      leaderboardItem: 'bg-[#fdfbf7] hover:bg-white border-[#ebe3d3] hover:border-[#A37764]',
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
      logoTextHover: 'text-[#d0ded3] group-hover:text-[#e2eee4] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]',
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
      sectionTitle: 'text-white font-bold',
      sectionIcon: 'text-[#8cb391]',
      sectionSub: 'text-[#7d9b80]',
      statusFilterWrap: 'bg-black/30 backdrop-blur-md border border-white/15',
      statusFilterActive: 'bg-gradient-to-r from-[#3e5b43] to-[#4d6f53] text-white shadow-xs',
      statusFilterInactive: 'text-[#7d9b80] hover:text-white',
      emptyCard: 'bg-white/[0.04] backdrop-blur-md border border-white/10',
      emptyIcon: 'text-[#8cb391]/60',
      card: 'bg-gradient-to-br from-white/[0.08] via-[#142318]/50 to-[#0c1510]/65 backdrop-blur-md border border-white/15 hover:border-[#5e8264]/40 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_20px_48px_rgba(77,111,83,0.22),inset_0_1px_0_rgba(255,255,255,0.35)]',
      commentCard: 'bg-[#132015]/60 backdrop-blur-md border border-white/10 text-[#e5f0e7] shadow-2xs',
      commentForm: 'bg-[#132015]/80 backdrop-blur-md border border-white/12 text-[#e5f0e7] shadow-xs',
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
    logoTextHover: 'text-[#2a5530] group-hover:text-[#3d7a46]',
    searchContainer: '',
    searchIcon: 'text-[#678064]',
    input: 'bg-[#edf3ec] border-[#b9ccb6] text-[#1c2a1e] placeholder-[#7d937b] focus:border-[#425d40] focus:bg-[#e4ece2]',
    buttonNeutral: 'sage-light-btn !py-1.5 !px-3 font-medium',
    buttonPrimary: 'sage-light-btn-active !py-1.5 !px-3 font-bold',
    buttonDarkMode: 'sage-light-btn !p-2',
    themeSelectorBtn: 'sage-light-btn !p-2 sm:!px-3 sm:!py-1.5 font-bold',
    heroOuter: 'bg-white border border-[#d6e2d4]',
    heroInner: 'bg-gradient-to-b from-[#f4f8f2] via-[#ebf3e8] to-[#e4eee1] border-[#d4e0d1]',
    heroGridColor: '#5c7959',
    heroGlowBg: 'bg-[#98b894]',
    heroCoverBorder: 'border-white shadow-[0_12px_35px_rgba(30,50,30,0.18)] group-hover:shadow-[0_16px_40px_rgba(30,50,30,0.25)]',
    heroBadge1: 'sage-light-novel-tag font-bold',
    heroBadge2: 'sage-light-novel-tag',
    heroBadge3: 'sage-light-novel-tag',
    heroTitle: 'text-[#1c2b1e]',
    heroTitleHover: 'hover:text-[#436240]',
    heroAuthorMuted: 'text-[#586c5a]',
    heroAuthorValue: 'text-[#1c2b1e]',
    heroSynopsis: 'text-[#394a3b]',
    heroTag: 'sage-light-novel-tag',
    heroBtnRead: 'sage-light-btn-active font-bold !px-5 !py-2.5 shadow-sm',
    heroBtnBookmark: 'sage-light-btn !px-4 !py-2.5',
    heroBookmarkActive: 'fill-[#4d664a] text-[#4d664a]',
    carouselDotActive: 'w-7 sm:w-8 h-2 rounded-full bg-[#466244] shadow-xs',
    carouselDotInactive: 'w-2 h-2 rounded-full bg-[#bdcfbc] hover:bg-[#97af95]',
    carouselNavBtn: 'sage-light-btn !w-8 !h-8 !rounded-full !p-0 flex items-center justify-center',
    categoryTabActive: 'sage-light-btn-active font-bold',
    categoryTabInactive: 'sage-light-btn font-medium',
    sectionHeaderBorder: 'border-[#cad8c6]',
    sectionTitle: 'text-[#1c2b1e]',
    sectionIcon: 'text-[#486645]',
    sectionSub: 'text-[#5b6f5d]',
    statusFilterWrap: 'sage-light-tabs-container p-1 rounded-full',
    statusFilterActive: 'sage-light-btn-active font-bold',
    statusFilterInactive: 'sage-light-btn font-medium',
    emptyCard: 'bg-white border-[#cad8c6]',
    emptyIcon: 'text-[#7d937c]',
    card: 'sage-light-novel-card',
    commentCard: 'bg-[#f8fcf8]/90 border border-[#e3f2e4] text-[#1c2b1e] shadow-2xs',
    commentForm: 'bg-[#f5faf5]/90 border border-[#d5ead7] text-[#1c2b1e] shadow-2xs',
    cardCoverBorder: 'border-[#cad8c6]',
    cardTag: 'sage-light-novel-tag',
    cardTitle: 'text-[#1c2b1e]',
    cardTitleHover: 'group-hover:text-[#436240]',
    cardSynopsis: 'text-[#485b4b]',
    cardFooterBorder: 'sage-light-novel-divider border-[#cad8c6]',
    cardAuthor: 'text-[#586c5a]',
    cardChapterBtn: 'text-[#3f5a3d]',
    recruitmentBanner: 'bg-white border border-[#d6e2d4]',
    recruitmentSubtitle: 'text-[#466244]',
    recruitmentTitle: 'text-[#1c2b1e]',
    recruitmentDesc: 'text-[#485b4b]',
    recruitmentBtn: 'sage-light-btn font-bold hover:!text-[#274225] cursor-pointer',
    sideCard: 'bg-white border border-[#d6e2d4]',
    sideCardTitle: 'text-[#1c2b1e]',
    sideCardTabWrap: 'sage-light-tabs-container p-1 rounded-full',
    sideCardTabActive: 'sage-light-btn-active font-bold',
    sideCardTabInactive: 'sage-light-btn font-medium',
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

/**
 * Lấy style màu nhãn số chương hiển thị trong danh sách bình luận thích ứng theo từng theme và chế độ sáng/tối
 */
export function getCommentChapterBadgeStyle(theme: NovelThemeId, isDarkMode: boolean): string {
  if (isDarkMode) {
    switch (theme) {
      case 'sage':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35';
      case 'mocha':
        return 'bg-amber-600/20 text-amber-200 border border-amber-500/35';
      case 'slate-haze':
        return 'bg-sky-500/20 text-sky-200 border border-sky-400/35';
      case 'notebook':
        return 'bg-zinc-700/40 text-zinc-200 border border-zinc-600/50';

      case 'amethyst-haze':
      case 'cosmic':
      default:
        return 'bg-purple-500/20 text-purple-200 border border-purple-500/35';
    }
  } else {
    switch (theme) {
      case 'sage':
        return 'bg-[#dcead9] text-[#244b23] border border-[#bcd2b8]';
      case 'mocha':
        return 'bg-[#f0e2d3] text-[#6d4c38] border border-[#dbc6b2]';
      case 'slate-haze':
        return 'bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]';
      case 'notebook':
        return 'bg-zinc-200/90 text-zinc-800 border border-zinc-300';

      case 'amethyst-haze':
      case 'cosmic':
      default:
        return 'bg-purple-100 text-purple-800 border border-purple-200';
    }
  }
}
