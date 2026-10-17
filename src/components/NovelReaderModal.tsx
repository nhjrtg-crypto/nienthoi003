import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Type,
  List,
  Sun,
  Moon,
  X,
  Check,
  Sliders,
  AlignJustify,
  Trash2,
  MessageSquare,
  Send,
  ThumbsUp,
  Reply,
  Lock,
  KeyRound,
  Highlighter,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Novel, NovelChapter, NovelComment } from '../types';
import { cosmicAudio } from '../utils/audioSynth';
import {
  HighlightColor,
  HighlightStyle,
  UserBookHighlight,
  HIGHLIGHT_COLORS,
  HIGHLIGHT_STYLES,
  HIGHLIGHT_COLOR_VALUES,
  getHighlightRenderClasses,
  loadChapterHighlights,
  saveChapterHighlights,
  parseCommentContent,
} from '../utils/chapterHighlights';
import { HighlightToolbarPopup } from './HighlightToolbarPopup';
import { HighlightCommentModal } from './HighlightCommentModal';
import {
  getNovelThemeStyles,
  NovelThemeId,
  NOVEL_THEME_OPTIONS,
  getExtraChapterBadgeStyle,
  isExtraChapter,
  getChapterDisplayParts,
  getCommentChapterBadgeStyle,
} from '../utils/themeStyles';
import { safeStorage } from '../utils/safeStorage';
import { saveRecentRead } from '../utils/recentReads';
import { useHeaderScroll } from '../utils/useHeaderScroll';
import { formatCommentDate, normalizeCommentDate } from '../utils/dateUtils';
import {
  isBotComment,
  auth,
  signInWithGoogle,
} from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  recordChapterView,
  subscribeComments as subscribeD1Comments,
  addComment as addD1Comment,
  likeComment as likeD1Comment,
  deleteComment as deleteD1Comment,
  getDeletedCommentIds,
  markCommentAsDeleted,
} from '../services/d1Service';
import { ChapterEditorModal } from './ChapterEditorModal';
import { ChapterPasswordModal, isChapterPasswordUnlocked } from './ChapterPasswordModal';
import { INITIAL_NOVELS } from '../data/novelData';

interface NovelReaderModalProps {
  novel: Novel | null;
  chapterNumber: number | null;
  isAdmin?: boolean;
  onClose: () => void;
  onSelectChapter: (num: number) => void;
  onUpdateChapters?: (novelId: string, chapters: NovelChapter[]) => void;
  onUpdateNovel?: (novel: Novel) => void;
}

type ReaderFontFamily = 'open-sans' | 'source-sans' | 'times' | 'roboto' | 'lora' | 'alegreya';
type LineHeightOption = 1.5 | 1.8 | 2.1;
type PageMarginOption = 'narrow' | 'normal' | 'wide';

export const NovelReaderModal: React.FC<NovelReaderModalProps> = ({
  novel,
  chapterNumber,
  isAdmin = false,
  onClose,
  onSelectChapter,
  onUpdateChapters,
  onUpdateNovel,
}) => {
  // 1. Font Size
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_reader_fontsize');
      if (saved) return parseInt(saved, 10) || 18;
    } catch {}
    return 18;
  });

  // 2. Kiểu phông chữ: Open Sans (mặc định), Source Sans 3, Times New Roman, Roboto, Lora, Alegreya
  const [fontFamily, setFontFamily] = useState<ReaderFontFamily>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_reader_font');
      if (saved && ['times', 'roboto', 'lora', 'open-sans', 'source-sans', 'alegreya'].includes(saved)) {
        return saved as ReaderFontFamily;
      }
    } catch {}
    return 'open-sans';
  });

  // 3. Giãn dòng: 1.5x, 1.8x, 2.1x
  const [lineHeight, setLineHeight] = useState<LineHeightOption>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_reader_lineheight');
      if (saved) {
        const val = parseFloat(saved);
        if (val === 1.5 || val === 1.8 || val === 2.1) return val as LineHeightOption;
      }
    } catch {}
    return 1.8;
  });

  // 4. Căn đều: Bật / Tắt
  const [isJustified, setIsJustified] = useState<boolean>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_reader_justified');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // 5. Căn lề trang: Hẹp, Vừa (chuẩn), Rộng
  const [pageMargin, setPageMargin] = useState<PageMarginOption>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_reader_margin');
      if (saved && ['narrow', 'normal', 'wide'].includes(saved)) {
        return saved as PageMarginOption;
      }
    } catch {}
    return 'normal';
  });

  const handleSelectPageMargin = (margin: PageMarginOption) => {
    setPageMargin(margin);
    safeStorage.setItem('cosmo_reader_margin', margin);
  };

  // 6. Khoảng cách giữa các đoạn: '1-line' (1 ô chuẩn), '2-lines' (2 ô rộng), 'tight' (liền dòng)
  const [paragraphSpacing, setParagraphSpacing] = useState<'1-line' | '2-lines' | 'tight'>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_reader_paragraph_spacing');
      if (saved === '2-lines' || saved === 'tight') return saved;
      return '1-line';
    } catch {
      return '1-line';
    }
  });

  const handleSelectParagraphSpacing = (spacing: '1-line' | '2-lines' | 'tight') => {
    setParagraphSpacing(spacing);
    safeStorage.setItem('cosmo_reader_paragraph_spacing', spacing);
  };

  // 6.1 Tùy chọn nhận diện tách đoạn: 'auto' (Tự động thông minh), 'single-line' (Từng dòng = 1 đoạn), 'double-line' (Chỉ ngắt khi có dòng trống)
  const [paragraphSplitMode, setParagraphSplitMode] = useState<'auto' | 'single-line' | 'double-line'>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_reader_paragraph_split_mode');
      if (saved === 'single-line' || saved === 'double-line') return saved;
      return 'auto';
    } catch {
      return 'auto';
    }
  });

  const handleSelectParagraphSplitMode = (mode: 'auto' | 'single-line' | 'double-line') => {
    setParagraphSplitMode(mode);
    safeStorage.setItem('cosmo_reader_paragraph_split_mode', mode);
  };

  // 7. Thụt đầu dòng đoạn văn: Bật / Tắt (Thụt lề 2 ô như sách in)
  const [hasIndent, setHasIndent] = useState<boolean>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_reader_indent');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const toggleIndent = () => {
    setHasIndent((prev) => {
      const next = !prev;
      safeStorage.setItem('cosmo_reader_indent', JSON.stringify(next));
      return next;
    });
  };

  const [showSettings, setShowSettings] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showCommentsPopup, setShowCommentsPopup] = useState(false);
  const [chapterPage, setChapterPage] = useState(1);

  // Highlight feature states
  const [isHighlighterMode, setIsHighlighterMode] = useState(false);
  const [isHighlightsHidden, setIsHighlightsHidden] = useState(false);
  const [activeHighlightColor, setActiveHighlightColor] = useState<HighlightColor | null>(null);
  const [activeHighlightStyle, setActiveHighlightStyle] = useState<HighlightStyle | null>(null);
  const [showHighlightIntroTooltip, setShowHighlightIntroTooltip] = useState(false);
  const [chapterHighlights, setChapterHighlights] = useState<UserBookHighlight[]>(() => {
    if (novel?.id && chapterNumber !== null) {
      return loadChapterHighlights(novel.id, chapterNumber);
    }
    return [];
  });
  const [floatingSelection, setFloatingSelection] = useState<{ paragraphIndex: number; selectedText: string } | null>(null);
  const lastSelectionRef = useRef<{ paragraphIndex: number; selectedText: string } | null>(null);
  const [clickedHighlightId, setClickedHighlightId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState('');
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3000);
  };
  const [quoteCommentModal, setQuoteCommentModal] = useState<{ isOpen: boolean; quoteText: string }>({
    isOpen: false,
    quoteText: '',
  });
  const setIsCommentsDrawerOpen = setShowCommentsPopup;

  // Sync chapter highlights when novel or chapter changes
  useEffect(() => {
    if (novel?.id && chapterNumber !== null) {
      setChapterHighlights(loadChapterHighlights(novel.id, chapterNumber));
      setFloatingSelection(null);
      lastSelectionRef.current = null;
      setClickedHighlightId(null);
    }
  }, [novel?.id, chapterNumber]);

  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const chapterMenuRef = useRef<HTMLDivElement>(null);

  // Sync theme with system
  const [readerTheme, setReaderTheme] = useState<NovelThemeId>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_novel_theme');
      if (saved === 'cake' || saved === 'lululemon') {
        safeStorage.setItem('cosmo_novel_theme', 'lululemon');
        return 'lululemon';
      }
      if (saved && ['slate-haze', 'sage', 'notebook', 'mocha', 'amethyst-haze', 'cosmic', 'lululemon'].includes(saved)) {
        return saved as NovelThemeId;
      }
    } catch {}
    return 'amethyst-haze';
  });

  // Sync dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_darkmode');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Header visibility using window scroll
  const isHeaderVisible = useHeaderScroll({ threshold: 40, delta: 6 });
  const shouldShowHeader = isHeaderVisible || showSettings || showChapterList || showCommentsPopup;

  // 18+ Chapter Password Gate (Nhập mật khẩu một lần theo truyện hoặc toàn cục)
  const [isChapterUnlocked, setIsChapterUnlocked] = useState<boolean>(() => isChapterPasswordUnlocked(novel));
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(() => !isChapterPasswordUnlocked(novel));

  // Đồng bộ trạng thái khóa khi mở sang bộ truyện khác
  useEffect(() => {
    const unlocked = isChapterPasswordUnlocked(novel);
    setIsChapterUnlocked(unlocked);
    setShowPasswordModal(!unlocked);
  }, [novel?.id]);

  const handleUnlockSuccess = () => {
    setIsChapterUnlocked(true);
    setShowPasswordModal(false);
  };

  const handleCancelPassword = () => {
    setShowPasswordModal(false);
    onClose();
  };

  // Close settings and chapter dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (chapterMenuRef.current && !chapterMenuRef.current.contains(event.target as Node)) {
        setShowChapterList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key listener to close modal or dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSettings(false);
        setShowChapterList(false);
        setShowCommentsPopup(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save font size preference
  const handleSetFontSize = (size: number) => {
    setFontSize(size);
    safeStorage.setItem('cosmo_reader_fontsize', size.toString());
  };

  // Save font family preference
  const handleSelectFontFamily = (font: ReaderFontFamily) => {
    setFontFamily(font);
    safeStorage.setItem('cosmo_reader_font', font);
  };

  // Save line height preference
  const handleSelectLineHeight = (val: LineHeightOption) => {
    setLineHeight(val);
    safeStorage.setItem('cosmo_reader_lineheight', val.toString());
  };

  // Toggle justify preference
  const toggleJustify = () => {
    setIsJustified((prev) => {
      const next = !prev;
      safeStorage.setItem('cosmo_reader_justified', JSON.stringify(next));
      return next;
    });
  };

  // In-memory cache of chapter content to ensure 0ms instant loading with zero lag
  const contentCacheRef = useRef<Record<number, string>>({});

  // Local synchronized chapters state
  const [localChapters, setLocalChapters] = useState<NovelChapter[]>(() => {
    if (novel?.chapters && novel.chapters.length > 0) return novel.chapters;
    if (novel?.totalChaptersCount && novel.totalChaptersCount > 0) {
      return Array.from({ length: novel.totalChaptersCount }, (_, i) => ({
        id: `c_${i + 1}`,
        novelId: novel.id,
        chapterNumber: i + 1,
        title: `Chương ${i + 1}`,
        publishedAt: 'Mới cập nhật',
        wordCount: 0,
        views: 0,
        content: '',
        isExtra: false,
      }));
    }
    return [];
  });

  // Sync with novel.chapters prop when it updates
  useEffect(() => {
    if (novel?.chapters && novel.chapters.length > 0) {
      setLocalChapters(novel.chapters);
      novel.chapters.forEach((c) => {
        if (c.content && c.content.trim().length > 0) {
          contentCacheRef.current[c.chapterNumber] = c.content;
        }
      });
    } else if (novel?.totalChaptersCount && novel.totalChaptersCount > 0) {
      setLocalChapters((prev) => {
        if (prev.length === novel.totalChaptersCount) return prev;
        return Array.from({ length: novel.totalChaptersCount }, (_, i) => ({
          id: `c_${i + 1}`,
          novelId: novel.id,
          chapterNumber: i + 1,
          title: `Chương ${i + 1}`,
          publishedAt: 'Mới cập nhật',
          wordCount: 0,
          views: 0,
          content: '',
          isExtra: false,
        }));
      });
    }
  }, [novel?.chapters, novel?.totalChaptersCount, novel?.id]);

  const allChapters: NovelChapter[] = localChapters;

  // Automatically save reading history for this novel whenever a chapter is viewed
  useEffect(() => {
    if (novel && chapterNumber !== null) {
      try {
        safeStorage.setItem(
          `novel_history_${novel.id}`,
          JSON.stringify({
            lastReadChapterNumber: chapterNumber,
            lastReadAt: Date.now(),
          })
        );
        const totalChapters = allChapters.length || novel.chapters.length || novel.totalChaptersCount || 1;
        const initialPercent = Math.min(
          100,
          Math.max(1, Math.round(((chapterNumber - 0.5) / totalChapters) * 100))
        );
        const savedScroll = safeStorage.getItem(`novel_scroll_${novel.id}_${chapterNumber}`);
        const scrollYVal = savedScroll ? parseFloat(savedScroll) : 0;
        saveRecentRead(novel.id, chapterNumber, initialPercent, scrollYVal);
      } catch (e) {
        console.warn('Could not save novel reading history', e);
      }
    }
  }, [novel?.id, chapterNumber, allChapters.length, novel?.chapters.length, novel?.totalChaptersCount]);

  // Restore scroll position using native window scroll
  useEffect(() => {
    if (!novel || chapterNumber === null) return;
    try {
      const savedScroll = safeStorage.getItem(`novel_scroll_${novel.id}_${chapterNumber}`);
      if (savedScroll) {
        const top = parseFloat(savedScroll);
        if (!isNaN(top) && top > 0) {
          const timer = setTimeout(() => {
            window.scrollTo({ top, behavior: 'instant' });
          }, 60);
          return () => clearTimeout(timer);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } catch {}
  }, [novel?.id, chapterNumber]);

  // Window scroll handler to track reading progress and save scroll position
  useEffect(() => {
    const handleWindowScroll = () => {
      const currentScrollY = window.scrollY;
      if (novel && chapterNumber !== null) {
        try {
          safeStorage.setItem(`novel_scroll_${novel.id}_${chapterNumber}`, currentScrollY.toString());
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const inChapterRatio = scrollHeight > 0 ? Math.min(1, Math.max(0, currentScrollY / scrollHeight)) : 0;
          const totalChapters = allChapters.length || novel.chapters.length || novel.totalChaptersCount || 1;
          const overallPercent = Math.min(
            100,
            Math.max(1, Math.round(((chapterNumber - 1 + inChapterRatio) / totalChapters) * 100))
          );
          saveRecentRead(novel.id, chapterNumber, overallPercent, currentScrollY);
        } catch {}
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [novel?.id, chapterNumber, allChapters.length, novel?.chapters.length, novel?.totalChaptersCount]);

  const isCosmic = readerTheme === 'cosmic';
  const isDarkEffective = isCosmic || isDarkMode;
  const tStyles = useMemo(() => getNovelThemeStyles(readerTheme, isDarkEffective), [readerTheme, isDarkEffective]);

  // Màu nền khung bình luận phía dưới cùng của chương nhạt hơn theo từng theme
  const chapterCommentBoxClass = useMemo(() => {
    if (isDarkEffective) {
      return 'bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-xs';
    }
    switch (readerTheme) {
      case 'sage':
        return 'bg-[#f7faf7]/95 border border-[#e2ede3] shadow-2xs text-[#1c2b1e]';
      case 'mocha':
        return 'bg-[#fdfaf7]/95 border border-[#f0e7dd] shadow-2xs text-[#3A2A2A]';
      case 'slate-haze':
        return 'bg-[#f8fafd]/95 border border-[#e0ecf7] shadow-2xs text-[#101723]';
      case 'amethyst-haze':
        return 'bg-[#fdfaff]/95 border border-[#f1e8f9] shadow-2xs text-[#211c2f]';
      case 'notebook':
      default:
        return 'bg-white/90 border border-slate-200/80 shadow-2xs text-stone-800';
    }
  }, [readerTheme, isDarkEffective]);

  const chapterCommentItemClass = useMemo(() => {
    if (isDarkEffective) {
      return 'bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-2xs';
    }
    switch (readerTheme) {
      case 'sage':
        return 'bg-white/85 border border-[#e4efe5] text-[#1c2b1e] shadow-2xs';
      case 'mocha':
        return 'bg-white/85 border border-[#f2eae1] text-[#3A2A2A] shadow-2xs';
      case 'slate-haze':
        return 'bg-white/85 border border-[#e4eef8] text-[#101723] shadow-2xs';
      case 'amethyst-haze':
        return 'bg-white/85 border border-[#f3ebfa] text-[#211c2f] shadow-2xs';
      case 'notebook':
      default:
        return 'bg-white/95 border border-slate-200/70 text-stone-800 shadow-2xs';
    }
  }, [readerTheme, isDarkEffective]);

  const toggleDarkMode = () => {
    if (readerTheme === 'cosmic') {
      return;
    }
    setIsDarkMode((prev) => {
      const next = !prev;
      safeStorage.setItem('cosmo_darkmode', JSON.stringify(next));
      return next;
    });
  };

  const handleSelectTheme = (newTheme: NovelThemeId) => {
    setReaderTheme(newTheme);
    safeStorage.setItem('cosmo_novel_theme', newTheme);
  };

  const CHAPTERS_PER_PAGE = 20;

  // Màu nền của số chương được chọn trong mục lục: đổ màu trầm hợp theme, bỏ hiệu ứng (không shadow, không gradient chói)
  const getReaderActiveChapterStyle = (th: NovelThemeId, isDark: boolean): string => {
    if (isDark) {
      switch (th) {
        case 'slate-haze':
          return 'bg-[#223547] text-[#e2ecf5]';
        case 'sage':
          return 'bg-[#233a28] text-[#e2ede4]';
        case 'mocha':
          return 'bg-[#38281f] text-[#f4ece5]';
        case 'notebook':
          return 'bg-[#303034] text-[#f4f4f5]';
        case 'lululemon':
          return 'bg-[#3b1c26] text-[#f4ebee]';
        case 'amethyst-haze':
        case 'cosmic':
        default:
          return 'bg-[#35254d] text-[#f3e8ff]';
      }
    } else {
      switch (th) {
        case 'slate-haze':
          return 'bg-[#435c77] text-white';
        case 'sage':
          return 'bg-[#446247] text-white';
        case 'mocha':
          return 'bg-[#6b4e3e] text-white';
        case 'notebook':
          return 'bg-[#3f3f46] text-white';
        case 'lululemon':
          return 'bg-[#84334b] text-white';
        case 'amethyst-haze':
        case 'cosmic':
        default:
          return 'bg-[#614b7b] text-white';
      }
    }
  };

  useEffect(() => {
    if (chapterNumber) {
      setChapterPage(Math.ceil(chapterNumber / CHAPTERS_PER_PAGE));
    }
  }, [chapterNumber]);

  const totalChapterPages = Math.max(1, Math.ceil(allChapters.length / CHAPTERS_PER_PAGE));

  const displayedChapters = useMemo(() => {
    if (!novel || allChapters.length === 0) return [];
    if (allChapters.length <= CHAPTERS_PER_PAGE) return allChapters;
    const start = (chapterPage - 1) * CHAPTERS_PER_PAGE;
    return allChapters.slice(start, start + CHAPTERS_PER_PAGE);
  }, [novel, allChapters, chapterPage]);

  // Color matching active theme, soft neutral for light mode (as requested)
  const paginationStyles = useMemo(() => {
    if (isDarkMode) {
      switch (readerTheme) {
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
      switch (readerTheme) {
        case 'amethyst-haze':
          return {
            active: 'bg-[#b07d8f] text-white border border-[#b07d8f] shadow-xs',
            inactive: 'bg-[#fcfafc] text-[#735d68] border border-[#e8dfec] hover:bg-[#f5eff7]',
            arrow: 'bg-[#fcfafc] text-[#85707b] border border-[#e8dfec] hover:bg-[#f5eff7] hover:text-[#523d47]',
          };
        case 'sage':
          return {
            active: 'bg-[#637d6d] text-white border border-[#637d6d] shadow-xs',
            inactive: 'bg-[#fafcfb] text-[#4d5e53] border border-[#dce5df] hover:bg-[#eff4f1]',
            arrow: 'bg-[#fafcfb] text-[#607366] border border-[#dce5df] hover:bg-[#eff4f1] hover:text-[#38483e]',
          };
        case 'mocha':
          return {
            active: 'bg-[#826a5b] text-white border border-[#826a5b] shadow-xs',
            inactive: 'bg-[#fdfbfa] text-[#635043] border border-[#e3dacf] hover:bg-[#f6f0ea]',
            arrow: 'bg-[#fdfbfa] text-[#786457] border border-[#e3dacf] hover:bg-[#f6f0ea] hover:text-[#4d3c31]',
          };
        case 'notebook':
          return {
            active: 'bg-[#737373] text-white border border-[#737373] shadow-xs',
            inactive: 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50',
            arrow: 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50 hover:text-stone-800',
          };
        case 'cosmic':
        default:
          return {
            active: 'bg-[#6b7280] text-white border border-[#6b7280] shadow-xs',
            inactive: 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50',
            arrow: 'bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800',
          };
      }
    }
  }, [readerTheme, isDarkMode]);

  // Chapter Editor Modal State & Handlers
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingChapterTarget, setEditingChapterTarget] = useState<NovelChapter | null>(null);

  // -------------------------------------------------------------
  // TÍNH NĂNG BÌNH LUẬN CHO TỪNG CHƯƠNG TRUYỆN (ĐỒNG BỘ VỚI TRANG TRUYỆN)
  // -------------------------------------------------------------
  const [chapterComments, setChapterComments] = useState<NovelComment[]>(() => {
    try {
      const saved = safeStorage.getItem(`cosmo_novel_comments_${novel?.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((c: NovelComment) => !isBotComment(c));
        }
      }
    } catch {}
    return (novel?.comments || []).filter((c) => !isBotComment(c));
  });
  const [newCommentContent, setNewCommentContent] = useState('');
  const [authorNameInput, setAuthorNameInput] = useState(() => {
    try {
      return safeStorage.getItem('cosmo_comment_author_name') || '';
    } catch {
      return '';
    }
  });

  const [rememberName, setRememberName] = useState(() => {
    try {
      return safeStorage.getItem('cosmo_remember_author_name') !== 'false';
    } catch {
      return true;
    }
  });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleAuthorNameChange = (val: string) => {
    setAuthorNameInput(val);
    if (rememberName) {
      try {
        safeStorage.setItem('cosmo_comment_author_name', val);
      } catch {}
    }
  };

  const handleToggleRememberName = (checked: boolean) => {
    setRememberName(checked);
    try {
      safeStorage.setItem('cosmo_remember_author_name', checked ? 'true' : 'false');
      if (checked) {
        if (authorNameInput.trim()) {
          safeStorage.setItem('cosmo_comment_author_name', authorNameInput.trim());
        }
      } else {
        safeStorage.removeItem('cosmo_comment_author_name');
      }
    } catch {}
  };

  useEffect(() => {
    if (!novel?.id) return;
    const deletedSet = getDeletedCommentIds();
    try {
      const saved = safeStorage.getItem(`cosmo_novel_comments_${novel.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChapterComments(parsed.filter((c: NovelComment) => !isBotComment(c) && !deletedSet.has(String(c.id).trim())));
        }
      }
    } catch {}

    // Lắng nghe bình luận chương 100% thời gian thực từ Cloudflare D1 (Ngắt kết nối hoàn toàn khỏi Firebase)
    const unsubscribe = subscribeD1Comments(novel.id, null, (d1Comments) => {
      const currentDeletedSet = getDeletedCommentIds();
      const mappedFromD1: NovelComment[] = d1Comments
        .filter((c) => !currentDeletedSet.has(String(c.id).trim()))
        .map((c) => ({
          id: c.id,
          truyenId: c.truyenId,
          author: c.author,
          avatar: c.avatar || '',
          content: c.content,
          createdAt: c.createdAt,
          ngayTao: new Date(c.createdTimestamp || Date.now()).toISOString(),
          likes: c.likes || 0,
          badge: c.badge || 'Độc Giả',
          chapterNumber: c.chapterNumber,
          chapterTitle: c.chapterTitle,
        }));

      setChapterComments(mappedFromD1);
      try {
        safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(mappedFromD1));
      } catch {}
      onUpdateNovel?.({ ...novel, comments: mappedFromD1 });
    });

    return () => {
      unsubscribe();
    };
  }, [novel?.id]);

  const currentChapterComments = useMemo(() => {
    if (chapterNumber === null) return [];
    return chapterComments.filter((c) => c.chapterNumber === chapterNumber);
  }, [chapterComments, chapterNumber]);

  const displayedComments = currentChapterComments;

  const handlePostChapterComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim() || !novel || chapterNumber === null) return;

    const finalAuthor = authorNameInput.trim();
    if (!finalAuthor || finalAuthor.length <= 1) {
      window.alert('Vui lòng nhập tên của bạn (tối thiểu 2 ký tự) để bình luận!');
      setIsSubmittingComment(false);
      return;
    }
    const finalAvatar = '';
    const formattedDate = formatCommentDate();

    if (rememberName && finalAuthor) {
      try {
        safeStorage.setItem('cosmo_comment_author_name', finalAuthor);
      } catch {}
    }

    const tempComment: NovelComment = {
      id: `cm-${Date.now()}`,
      truyenId: novel.id,
      author: finalAuthor,
      avatar: finalAvatar,
      content: newCommentContent.trim(),
      createdAt: formattedDate,
      ngayTao: new Date().toISOString(),
      likes: 0,
      badge: 'Độc Giả',
      chapterNumber: chapterNumber,
      chapterTitle: currentChapter?.title || `Chương ${chapterNumber}`,
    };

    const updated = [tempComment, ...chapterComments.filter((c) => c.id !== tempComment.id)];
    setChapterComments(updated);
    try {
      safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(updated));
    } catch {}
    onUpdateNovel?.({ ...novel, comments: updated });
    setNewCommentContent('');
    showToast('Bình luận thành công!');

    try {
      await addD1Comment({
        id: tempComment.id,
        truyenId: novel.id,
        author: finalAuthor,
        avatar: finalAvatar,
        content: tempComment.content,
        badge: 'Độc Giả',
        chapterNumber: chapterNumber,
        chapterTitle: currentChapter?.title || `Chương ${chapterNumber}`,
      });
    } catch (err) {
      console.warn('[D1] Failed to persist chapter comment to Cloudflare D1:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikeChapterComment = (commentId: string) => {
    if (!novel) return;
    const updated = chapterComments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
    setChapterComments(updated);
    try {
      safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(updated));
    } catch {}
    onUpdateNovel?.({ ...novel, comments: updated });
    likeD1Comment(commentId, novel.id, chapterNumber ?? undefined).catch(() => {});
  };

  const handleDeleteChapterComment = async (commentId: string) => {
    if (!isAdmin || !novel) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) return;
    const targetId = String(commentId).trim();

    // 1. Đánh dấu vĩnh viễn đã xóa
    markCommentAsDeleted(targetId);

    // 2. Cập nhật state cục bộ ngay lập tức
    const updated = chapterComments.filter((c) => String(c.id).trim() !== targetId);
    setChapterComments(updated);
    try {
      safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(updated));
    } catch {}

    // 3. Đồng bộ vào novel.comments trong state cha
    const cleanNovelComments = (novel.comments || []).filter((c) => String(c.id).trim() !== targetId);
    onUpdateNovel?.({ ...novel, comments: cleanNovelComments });

    // 4. Xóa thật sự trong cơ sở dữ liệu Cloudflare D1
    try {
      await deleteD1Comment(targetId, novel.id, chapterNumber ?? undefined);
    } catch (e) {
      console.warn('Lỗi khi xóa bình luận trên Cloudflare D1:', e);
    }
  };

  const getAvatarBgColor = (name: string): string => {
    const palette = [
      'bg-[#b07d8f]',
      'bg-[#5f7d6a]',
      'bg-[#826b5b]',
      'bg-[#6366f1]',
      'bg-[#0ea5e9]',
      'bg-[#10b981]',
      'bg-[#d97706]',
      'bg-[#ec4899]',
      'bg-[#8b5cf6]',
    ];
    if (!name) return palette[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    return palette[Math.abs(hash) % palette.length];
  };

  // On-demand Firestore chapter content state & content cache
  const [firestoreFetchedContent, setFirestoreFetchedContent] = useState<string | null>(null);
  const [isLoadingChapterContent, setIsLoadingChapterContent] = useState<boolean>(false);

  useEffect(() => {
    if (!novel || chapterNumber === null) return;

    // Ghi nhận lượt đọc chỉ khi độc giả bấm vào chương truyện trên Cloudflare D1
    const chap = allChapters.find((c) => c.chapterNumber === chapterNumber);
    recordChapterView(novel.id, chapterNumber);

    // 1. Instant load from in-memory cache if available (0ms delay)
    const cached = contentCacheRef.current[chapterNumber];
    if (cached && cached.trim().length > 0) {
      setFirestoreFetchedContent(cached);
      setIsLoadingChapterContent(false);
      return;
    }

    // 2. Instant load from local chapter data if available
    const localChap = allChapters.find((c) => c.chapterNumber === chapterNumber);
    if (localChap?.content && localChap.content.trim().length > 0) {
      contentCacheRef.current[chapterNumber] = localChap.content;
      setFirestoreFetchedContent(localChap.content);
      setIsLoadingChapterContent(false);
      return;
    }

    // 2b. Lookup from INITIAL_NOVELS static source data (Ưu tiên 100% mã nguồn, không chạm Firestore)
    const staticNovel = INITIAL_NOVELS.find((n) => n.id === novel.id || n.title.toLowerCase().trim() === novel.title.toLowerCase().trim());
    if (staticNovel) {
      const staticChap = staticNovel?.chapters?.find((c) => c.chapterNumber === chapterNumber);
      const content = (staticChap?.content && staticChap.content.trim().length > 0)
        ? staticChap.content
        : (localChap?.content && localChap.content.trim().length > 0)
        ? localChap.content
        : 'Chương này hiện chưa có nội dung hoặc đang được cập nhật.';
      contentCacheRef.current[chapterNumber] = content;
      setFirestoreFetchedContent(content);
      setIsLoadingChapterContent(false);
      return;
    }

    // 3. Fallback if not found in local or static
    const fallbackContent = localChap?.content && localChap.content.trim().length > 0
      ? localChap.content
      : 'Chương này hiện chưa có nội dung hoặc đang được cập nhật.';
    contentCacheRef.current[chapterNumber] = fallbackContent;
    setFirestoreFetchedContent(fallbackContent);
    setIsLoadingChapterContent(false);
  }, [novel?.id, chapterNumber]);

  if (!novel || chapterNumber === null) return null;

  const currentChapter = useMemo(() => {
    const found = allChapters.find((c) => c.chapterNumber === chapterNumber);
    if (found) return found;
    return (
      allChapters[0] || {
        id: `c_${chapterNumber}`,
        novelId: novel.id,
        chapterNumber: chapterNumber,
        title: `Chương ${chapterNumber}`,
        publishedAt: 'Mới cập nhật',
        wordCount: 0,
        content: '',
      }
    );
  }, [allChapters, chapterNumber, novel.id]);

  const handleOpenEditor = (target?: NovelChapter | null) => {
    setEditingChapterTarget(target || currentChapter);
    setIsEditorModalOpen(true);
  };

  const handleChapterUpdated = (updatedChapter: NovelChapter) => {
    // 1. Update in in-memory cache
    if (updatedChapter.content) {
      contentCacheRef.current[updatedChapter.chapterNumber] = updatedChapter.content;
    }
    // 2. If it's the currently open chapter, immediately update the display
    if (updatedChapter.chapterNumber === chapterNumber) {
      if (updatedChapter.content) {
        setFirestoreFetchedContent(updatedChapter.content);
      }
    }
    // 3. Update localChapters state & notify parent
    const next = localChapters.map((c) =>
      c.chapterNumber === updatedChapter.chapterNumber ? { ...c, ...updatedChapter } : c
    );
    setLocalChapters(next);
    onUpdateChapters?.(novel.id, next);
  };

  const handleChapterDeleted = (deletedChapterNumber: number) => {
    // 1. Remove from in-memory cache
    delete contentCacheRef.current[deletedChapterNumber];
    // 2. Remove from localChapters state & notify parent
    const nextChapters = localChapters.filter((c) => c.chapterNumber !== deletedChapterNumber);
    setLocalChapters(nextChapters);
    onUpdateChapters?.(novel.id, nextChapters);

    // 3. Navigate if the deleted chapter was the currently open one
    if (chapterNumber === deletedChapterNumber) {
      if (nextChapters.length > 0) {
        const nextTarget =
          nextChapters.find((c) => c.chapterNumber >= deletedChapterNumber) ||
          nextChapters[nextChapters.length - 1];
        onSelectChapter(nextTarget.chapterNumber);
      } else {
        onClose();
      }
    }
  };

  const activeContent =
    firestoreFetchedContent && firestoreFetchedContent.trim().length > 0
      ? firestoreFetchedContent
      : currentChapter?.content && currentChapter.content.trim().length > 0
      ? currentChapter.content
      : '';

  const activeWordCount = useMemo(() => {
    if (activeContent && activeContent.trim().length > 0) {
      return activeContent.trim().split(/\s+/).filter(Boolean).length;
    }
    return currentChapter?.wordCount || 0;
  }, [activeContent, currentChapter?.wordCount]);

  // Memoized paragraphs with cleaned line breaks and smart detection for single-spaced files
  const paragraphs = useMemo(() => {
    if (!activeContent) return [];
    const normalized = activeContent
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/^[ \t]+$/gm, '');

    const rawLines = normalized
      .split('\n')
      .map((p) => p.replace(/^[ \t\u3000]+/, '').trim())
      .filter(Boolean);

    if (paragraphSplitMode === 'single-line') {
      return rawLines;
    }

    const doubleBlocks = normalized
      .split(/\n{2,}/)
      .map((p) => p.replace(/^[ \t\u3000]+/, '').trim())
      .filter(Boolean);

    if (paragraphSplitMode === 'double-line') {
      return doubleBlocks;
    }

    // Default: 'auto'
    // Tự động nhận diện: Nếu tệp .txt dính liền dòng không có dòng trống ngăn cách,
    // hoặc số khối \n\n quá ít so với tổng số dòng (dưới 15%), tự động coi mỗi dòng là 1 đoạn văn.
    const doubleCount = (normalized.match(/\n\s*\n/g) || []).length;
    const singleCount = (normalized.match(/\n/g) || []).length;

    const isSingleLineDelimited =
      (doubleBlocks.length <= 1 && rawLines.length > 1) ||
      (rawLines.length >= 6 && doubleCount < singleCount * 0.15);

    if (isSingleLineDelimited) {
      return rawLines;
    }

    return doubleBlocks;
  }, [activeContent, paragraphSplitMode]);

  const currentChapterIndex = useMemo(() => {
    if (allChapters.length === 0) return chapterNumber - 1;
    const idx = allChapters.findIndex((c) => c.chapterNumber === chapterNumber);
    return idx !== -1 ? idx : chapterNumber - 1;
  }, [allChapters, chapterNumber]);

  const totalKnownChapters = Math.max(
    allChapters.length,
    novel?.chapters?.length || 0,
    novel?.totalChaptersCount || 0,
    chapterNumber
  );

  const hasPrev = chapterNumber > 1;
  const hasNext = chapterNumber < totalKnownChapters;

  const handlePrev = () => {
    if (hasPrev) {
      onSelectChapter(chapterNumber - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onSelectChapter(chapterNumber + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  const fontClass =
    fontFamily === 'times'
      ? 'font-times'
      : fontFamily === 'roboto'
      ? 'font-roboto font-normal'
      : fontFamily === 'lora'
      ? 'font-lora'
      : fontFamily === 'alegreya'
      ? 'font-alegreya'
      : fontFamily === 'source-sans'
      ? 'font-source-sans'
      : 'font-open-sans';

  const marginContainerClass =
    pageMargin === 'narrow'
      ? 'max-w-4xl px-3 sm:px-5'
      : pageMargin === 'wide'
      ? 'max-w-2xl px-6 sm:px-12'
      : 'max-w-3xl px-4 sm:px-6';

  const handleScrollToComments = () => {
    const el = document.getElementById('chapter-comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Bắt Sự Kiện Bôi Đen Văn Bản trên Trang Sách
  const handleTextSelectionCheck = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString().trim();
    if (text.length < 1) return;

    // Xác định đoạn văn (paragraphIndex) chứa văn bản được bôi đen
    let pIdx = -1;
    const anchorEl = sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode?.parentElement;
    let paraEl = anchorEl?.closest('[data-paragraph-index]');
    if (paraEl) {
      pIdx = parseInt(paraEl.getAttribute('data-paragraph-index') || '-1', 10);
    }

    if (pIdx < 0 || !paragraphs[pIdx]?.includes(text)) {
      const foundIdx = paragraphs.findIndex((p) => p.includes(text));
      if (foundIdx !== -1) pIdx = foundIdx;
    }

    const selData = { paragraphIndex: pIdx, selectedText: text };
    setFloatingSelection(selData);
    lastSelectionRef.current = selData;

  };

  // Lắng nghe sự kiện mouseup và touchend trên tài liệu
  useEffect(() => {
    const handleDocSelection = () => setTimeout(() => handleTextSelectionCheck(), 30);
    document.addEventListener('mouseup', handleDocSelection);
    document.addEventListener('touchend', handleDocSelection);
    return () => {
      document.removeEventListener('mouseup', handleDocSelection);
      document.removeEventListener('touchend', handleDocSelection);
    };
  }, [paragraphs]);

  // Xử lý gửi trích dẫn & bình luận
  const handleSubmitQuoteComment = async (commentText: string, quote: string, customAuthor?: string) => {
    if (!novel || chapterNumber === null) return;

    let author = customAuthor?.trim() || authorNameInput.trim();
    if (!author || author.length <= 1) {
      window.alert('Vui lòng nhập tên của bạn (tối thiểu 2 ký tự) để bình luận!');
      return;
    }

    if (author !== authorNameInput) {
      setAuthorNameInput(author);
      try {
        safeStorage.setItem('cosmo_comment_author_name', author);
      } catch {}
    }

    const fullContent = commentText.trim()
      ? `“${quote}”\n\n${commentText.trim()}`
      : `“${quote}”`;

    const formattedDate = formatCommentDate();
    const tempComment: NovelComment = {
      id: `cm-${Date.now()}`,
      truyenId: novel.id,
      author: author,
      avatar: '',
      content: fullContent,
      createdAt: formattedDate,
      ngayTao: new Date().toISOString(),
      likes: 0,
      badge: 'Độc Giả',
      chapterNumber: chapterNumber,
      chapterTitle: currentChapter?.title || `Chương ${chapterNumber}`,
    };

    const updated = [tempComment, ...chapterComments.filter((c) => c.id !== tempComment.id)];
    setChapterComments(updated);
    try {
      safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(updated));
    } catch {}
    showToast('Bình luận thành công!');

    // Chuyển việc cập nhật nặng xuống background non-blocking để màn hình không bị giật/đơ
    setTimeout(() => {
      try {
        onUpdateNovel?.({ ...novel, comments: updated });
      } catch {}
      addD1Comment({
        id: tempComment.id,
        truyenId: novel.id,
        author: author,
        avatar: '',
        content: fullContent,
        badge: 'Độc Giả',
        chapterNumber: chapterNumber,
        chapterTitle: currentChapter?.title || `Chương ${chapterNumber}`,
      }).catch(() => {});
    }, 50);
  };

  // Hành động Highlight
  const handleQuickHighlight = (color: HighlightColor, style: HighlightStyle = activeHighlightStyle || 'classic') => {
    const currentSel = floatingSelection || lastSelectionRef.current;
    if (!currentSel || !currentSel.selectedText || !novel || chapterNumber === null) {
      showToast('Vui lòng dùng chuột hoặc chạm để bôi đen một cụm từ trên trang trước khi bấm Highlight nhé!');
      return;
    }

    cosmicAudio.playChime('sparkle');
    const newHl: UserBookHighlight = {
      id: `hl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      novelId: novel.id,
      chapterNumber,
      paragraphIndex: currentSel.paragraphIndex,
      selectedText: currentSel.selectedText,
      color,
      style,
      createdAt: Date.now(),
    };

    // Lọc bỏ highlight cũ bị trùng/đè nội dung trong cùng đoạn văn (tránh tạo 2 bản ghi chồng lên nhau)
    const updated = chapterHighlights.filter((h) => {
      if (h.paragraphIndex !== currentSel.paragraphIndex) return true;
      if (h.selectedText === currentSel.selectedText) return false;
      if (h.selectedText.includes(currentSel.selectedText) || currentSel.selectedText.includes(h.selectedText)) return false;
      return true;
    });
    updated.push(newHl);
    setChapterHighlights(updated);
    saveChapterHighlights(novel.id, chapterNumber, updated);

    try {
      window.getSelection()?.removeAllRanges();
    } catch {}
    setFloatingSelection(null);
    lastSelectionRef.current = null;
    showToast('Đã lưu highlight thành công!');
  };

  // Hành động Highlight & B.luận
  const handleHighlightAndComment = () => {
    const currentSel = floatingSelection || lastSelectionRef.current;
    if (!currentSel || !currentSel.selectedText) {
      showToast('Vui lòng dùng chuột hoặc chạm để bôi đen một cụm từ trên trang trước khi bấm Highlight nhé!');
      return;
    }
    const colorToUse = activeHighlightColor || 'yellow';
    const styleToUse = activeHighlightStyle || 'classic';
    const text = currentSel.selectedText;
    handleQuickHighlight(colorToUse, styleToUse);
    setNewCommentContent(`“${text}”\n\n`);
    setShowCommentsPopup(true);
  };

  // Render Vệt Bút Highlight trên Từng Đoạn Văn
  const renderHighlightedParagraph = (
    text: string,
    paraIndex: number,
    myHighlights: UserBookHighlight[],
    isOtherPerspectiveMode: boolean = false
  ) => {
    if (isOtherPerspectiveMode || isHighlightsHidden || myHighlights.length === 0) {
      return text;
    }

    // Lọc và sắp xếp các segment highlight trong đoạn văn
    type Segment = { start: number; end: number; hl: UserBookHighlight };
    const segments: Segment[] = [];
    for (const hl of myHighlights) {
      if (!hl.selectedText) continue;
      let startIndex = 0;
      while (true) {
        const idx = text.indexOf(hl.selectedText, startIndex);
        if (idx === -1) break;
        segments.push({ start: idx, end: idx + hl.selectedText.length, hl });
        startIndex = idx + hl.selectedText.length;
      }
    }

    if (segments.length === 0) return text;
    segments.sort((a, b) => a.start - b.start);

    // Loại bỏ các đoạn trùng lặp và render các thẻ <mark>
    const nodes: React.ReactNode[] = [];
    let currentPos = 0;

    segments.forEach((seg, i) => {
      if (seg.start < currentPos) return;

      if (seg.start > currentPos) {
        nodes.push(text.slice(currentPos, seg.start));
      }
      const strokeClass = getHighlightRenderClasses(seg.hl.color, seg.hl.style || 'classic', isDarkEffective);

      nodes.push(
        <mark
          key={`mark-${seg.hl.id}-${i}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsHighlighterMode(true);
            setFloatingSelection({
              paragraphIndex: paraIndex,
              selectedText: seg.hl.selectedText,
            });
            lastSelectionRef.current = {
              paragraphIndex: paraIndex,
              selectedText: seg.hl.selectedText,
            };
            setActiveHighlightColor(null);
            setActiveHighlightStyle(null);
            setClickedHighlightId(seg.hl.id);
          }}
          className={`book-marker-streak select-text font-inherit text-inherit cursor-pointer transition-all ${strokeClass}`}
          title="Nhấn để đổi màu hoặc xóa highlight"
        >
          {text.slice(seg.start, seg.end)}
        </mark>
      );
      currentPos = seg.end;
    });

    if (currentPos < text.length) {
      nodes.push(text.slice(currentPos));
    }

    return nodes;
  };

  const handleDeleteHighlight = (id: string | null, textMatch?: string, paraIndex?: number) => {
    if (!novel || chapterNumber === null) return;
    const target = id ? chapterHighlights.find((h) => h.id === id) : null;
    const textToMatch = textMatch || target?.selectedText;
    const targetPara = paraIndex !== undefined ? paraIndex : target?.paragraphIndex;

    const updated = chapterHighlights.filter((h) => {
      // Nếu khớp ID -> xóa
      if (id && h.id === id) return false;
      // Nếu khớp cùng đoạn văn và cùng đoạn text highlight -> xóa (chống lưu đè highlight cũ)
      if (textToMatch && h.selectedText === textToMatch) {
        if (targetPara === undefined || h.paragraphIndex === targetPara) return false;
      }
      return true;
    });

    setChapterHighlights(updated);
    saveChapterHighlights(novel.id, chapterNumber, updated);
    setClickedHighlightId(null);
  };

  const handleSaveHighlightNote = (id: string, note: string) => {
    if (!novel || chapterNumber === null) return;
    const updated = chapterHighlights.map((h) => (h.id === id ? { ...h, personalNote: note } : h));
    setChapterHighlights(updated);
    saveChapterHighlights(novel.id, chapterNumber, updated);
  };

  const handleChangeHighlightColor = (id: string, color: HighlightColor, style?: HighlightStyle) => {
    if (!novel || chapterNumber === null) return;
    const target = chapterHighlights.find((h) => h.id === id);
    const updated = chapterHighlights
      .filter((h) => {
        if (h.id === id) return true;
        if (target && h.paragraphIndex === target.paragraphIndex && h.selectedText === target.selectedText) {
          return false;
        }
        return true;
      })
      .map((h) =>
        h.id === id ? { ...h, color, style: style || h.style || 'classic' } : h
      );
    setChapterHighlights(updated);
    saveChapterHighlights(novel.id, chapterNumber, updated);
  };

  const readerSettingsScrollbarColor = useMemo(() => {
    if (isDarkEffective) {
      switch (readerTheme) {
        case 'amethyst-haze':
        case 'cosmic':
          return '#c084fc';
        case 'sage':
          return '#4ade80';
        case 'mocha':
          return '#d6a27e';
        case 'slate-haze':
          return '#38bdf8';
        case 'notebook':
        default:
          return '#a1a1aa';
      }
    } else {
      switch (readerTheme) {
        case 'amethyst-haze':
          return '#9333ea';
        case 'sage':
          return '#466244';
        case 'mocha':
          return '#A37764';
        case 'slate-haze':
          return '#87909d';
        case 'notebook':
        default:
          return '#737373';
      }
    }
  }, [readerTheme, isDarkEffective]);

  const floatingToolbarTheme = useMemo(() => {
    if (isDarkEffective) {
      switch (readerTheme) {
        case 'amethyst-haze':
          return {
            container: 'bg-[#181324]/90 border-purple-800/40 shadow-purple-950/30 divide-purple-900/40',
            btn: 'text-purple-200 hover:bg-purple-900/30',
            btnActive: 'bg-purple-900/50 text-purple-100 font-bold',
            tooltip: 'bg-[#181324] text-purple-200 border border-purple-800/40',
          };
        case 'sage':
          return {
            container: 'bg-[#111c15]/90 border-emerald-800/40 shadow-emerald-950/30 divide-emerald-900/40',
            btn: 'text-emerald-200 hover:bg-emerald-900/30',
            btnActive: 'bg-emerald-900/50 text-emerald-100 font-bold',
            tooltip: 'bg-[#111c15] text-emerald-200 border border-emerald-800/40',
          };
        case 'mocha':
          return {
            container: 'bg-[#1c1512]/90 border-amber-900/40 shadow-stone-950/30 divide-amber-900/40',
            btn: 'text-amber-200 hover:bg-amber-950/40',
            btnActive: 'bg-amber-950/60 text-amber-100 font-bold',
            tooltip: 'bg-[#1c1512] text-amber-200 border border-amber-900/40',
          };
        case 'notebook':
        case 'white':
          return {
            container: 'bg-[#161618]/95 border-zinc-800 shadow-black/40 divide-zinc-800',
            btn: 'text-zinc-300 hover:bg-zinc-800/80',
            btnActive: 'bg-zinc-800 text-white font-bold',
            tooltip: 'bg-[#161618] text-zinc-200 border border-zinc-800',
          };
        case 'slate':
          return {
            container: 'bg-[#18181b]/95 border-zinc-800 shadow-black/40 divide-zinc-800',
            btn: 'text-zinc-300 hover:bg-zinc-800',
            btnActive: 'bg-zinc-800 text-white font-bold',
            tooltip: 'bg-[#18181b] text-zinc-200 border border-zinc-800',
          };
        case 'cosmic':
        default:
          return {
            container: 'bg-[#0f172a]/95 border-slate-700/80 shadow-slate-950/50 divide-slate-800',
            btn: 'text-slate-300 hover:bg-slate-800/80',
            btnActive: 'bg-indigo-950/80 text-indigo-200 font-bold',
            tooltip: 'bg-[#0f172a] text-slate-200 border border-slate-700',
          };
      }
    } else {
      switch (readerTheme) {
        case 'amethyst-haze':
          return {
            container: 'bg-[#fbf8fe]/95 border-purple-100 shadow-purple-900/5 divide-purple-100/60',
            btn: 'text-purple-900 hover:bg-purple-50',
            btnActive: 'bg-purple-50 text-purple-950 font-bold',
            tooltip: 'bg-white text-purple-950 border border-purple-100',
          };
        case 'sage':
          return {
            container: 'bg-[#f7fbf8]/95 border-emerald-100 shadow-emerald-900/5 divide-emerald-100/60',
            btn: 'text-emerald-900 hover:bg-emerald-50',
            btnActive: 'bg-emerald-50 text-emerald-950 font-bold',
            tooltip: 'bg-white text-emerald-950 border border-emerald-100',
          };
        case 'mocha':
          return {
            container: 'bg-[#fdfbf7]/95 border-amber-100 shadow-stone-900/5 divide-amber-100/60',
            btn: 'text-amber-950 hover:bg-amber-50',
            btnActive: 'bg-amber-50 text-amber-950 font-bold',
            tooltip: 'bg-white text-amber-950 border border-amber-100',
          };
        case 'notebook':
        case 'white':
          return {
            container: 'bg-white/95 border-zinc-200 shadow-zinc-900/10 divide-zinc-100',
            btn: 'text-zinc-800 hover:bg-zinc-100',
            btnActive: 'bg-zinc-100 text-zinc-950 font-bold',
            tooltip: 'bg-white text-zinc-900 border border-zinc-200',
          };
        case 'slate':
          return {
            container: 'bg-white/95 border-zinc-200 shadow-zinc-900/10 divide-zinc-100',
            btn: 'text-zinc-800 hover:bg-zinc-100',
            btnActive: 'bg-zinc-200 text-zinc-900 font-bold',
            tooltip: 'bg-zinc-900 text-white border border-zinc-700',
          };
        case 'cosmic':
        default:
          return {
            container: 'bg-white/95 border-slate-200 shadow-slate-900/10 divide-slate-100',
            btn: 'text-slate-800 hover:bg-slate-100',
            btnActive: 'bg-indigo-50 text-indigo-900 font-bold',
            tooltip: 'bg-slate-900 text-white border border-slate-700',
          };
      }
    }
  }, [readerTheme, isDarkEffective]);

  const paraCommentBadgeStyle = useMemo(() => {
    if (isDarkEffective) {
      switch (readerTheme) {
        case 'amethyst-haze':
          return 'bg-purple-950/40 border-purple-800/40 text-purple-200 hover:bg-purple-900/50';
        case 'sage':
          return 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200 hover:bg-emerald-900/50';
        case 'mocha':
          return 'bg-amber-950/40 border-amber-900/40 text-amber-200 hover:bg-amber-900/50';
        case 'notebook':
        case 'white':
          return 'bg-zinc-800/80 border-zinc-700 text-zinc-200 hover:bg-zinc-700/80';
        case 'slate':
        case 'slate-haze':
          return 'bg-zinc-800/80 border-zinc-700 text-zinc-200 hover:bg-zinc-700/80';
        case 'cosmic':
        default:
          return 'bg-indigo-950/60 border-indigo-800/60 text-indigo-200 hover:bg-indigo-900/60';
      }
    } else {
      switch (readerTheme) {
        case 'amethyst-haze':
          return 'bg-purple-50/90 hover:bg-purple-100/80 border-purple-100 text-purple-800';
        case 'sage':
          return 'bg-emerald-50/90 hover:bg-emerald-100/80 border-emerald-100 text-emerald-800';
        case 'mocha':
          return 'bg-amber-50/90 hover:bg-amber-100/80 border-amber-100 text-amber-900';
        case 'notebook':
        case 'white':
          return 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-900';
        case 'slate':
        case 'slate-haze':
          return 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-800';
        case 'cosmic':
        default:
          return 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900';
      }
    }
  }, [readerTheme, isDarkEffective]);

  return (
    <div className={`min-h-screen w-full ${tStyles.pageBg} transition-colors duration-300 relative flex flex-col`}>
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-30 border-b glass-header px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all duration-300 transform ${
          shouldShowHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        } ${tStyles.headerBg} ${tStyles.headerBorder}`}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Back button: Giữ icon ChevronLeft, không có chữ */}
          <button
            onClick={onClose}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${tStyles.carouselNavBtn}`}
            title="Quay lại tác phẩm"
            aria-label="Quay lại tác phẩm"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {novel && (
            <div className="hidden sm:block min-w-0">
              <h3 className={`text-xs font-bold truncate max-w-[180px] md:max-w-xs ${tStyles.cardTitle}`}>{novel.title}</h3>
              <span className={`text-[11px] block truncate opacity-75 ${tStyles.cardAuthor}`}>
                {currentChapter ? `Chương ${currentChapter.chapterNumber}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Reader Tools: Nút chuyển chương trước, Nút Mục Lục (ở giữa), Nút chuyển chương tiếp theo, và Cài Đặt */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Nút chuyển chương trước */}
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
              hasPrev
                ? isDarkEffective
                  ? 'bg-white/[0.08] hover:bg-white/[0.16] border-white/20 text-white cursor-pointer shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 cursor-pointer shadow-xs'
                : 'opacity-30 cursor-not-allowed pointer-events-none border-zinc-500/20'
            }`}
            title={hasPrev ? 'Chương trước' : 'Đã ở chương đầu tiên'}
            aria-label="Chương trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* NÚT MỤC LỤC Ở TRÊN THANH HEADER NẰM GIỮA HAI NÚT MŨI TÊN CHUYỂN CHƯƠNG - Giữ nguyên kích cỡ to, không bị thu nhỏ */}
          <div className="relative" ref={chapterMenuRef}>
            <button
              onClick={() => {
                setShowChapterList(!showChapterList);
                setShowSettings(false);
              }}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs ${
                showChapterList
                  ? tStyles.categoryTabActive
                  : isDarkEffective
                  ? 'bg-white/[0.08] hover:bg-white/[0.16] border-white/20 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
              title="Mục lục các chương"
            >
              <List className="w-4 h-4" />
              <span>Mục Lục</span>
            </button>

            {/* Dropdown Menu Mục Lục - Phiên bản thu nhỏ tinh gọn */}
            {showChapterList && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-24px)] flex flex-col rounded-2xl shadow-xl border z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden ${
                  isDarkEffective
                    ? 'bg-[#181a20] border-zinc-700 text-zinc-100 shadow-black/60'
                    : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-400/30'
                }`}
              >
                {/* Header Dropdown: Thu nhỏ */}
                <div className="px-3 py-2 border-b border-zinc-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <List className={`w-3.5 h-3.5 ${tStyles.sectionIcon}`} />
                    <span className="text-xs font-bold font-source-serif">Mục Lục</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border font-semibold ${tStyles.cardTag}`}>
                      {allChapters.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowChapterList(false)}
                    className="text-[11px] hover:underline opacity-70 cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>

                {/* Danh sách chương thu nhỏ - hiển thị toàn bộ không chia trang */}
                <div className="p-1.5 space-y-0.5 overflow-y-auto flex-1 max-h-[55vh]">
                  {allChapters.map((chap) => {
                    const isCurrent = chap.chapterNumber === chapterNumber;
                    const { chapterLabel, isExtra, restTitle } = getChapterDisplayParts(chap);
                    return (
                      <div
                        key={chap.id || `chap-${chap.chapterNumber}`}
                        className={`w-full px-2 py-1 rounded-lg text-xs flex items-center justify-between group ${
                          isCurrent
                            ? `${getReaderActiveChapterStyle(readerTheme, isDarkEffective)} font-semibold`
                            : isDarkEffective
                            ? 'hover:bg-zinc-800/70 text-zinc-300 hover:text-white'
                            : 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900'
                        }`}
                      >
                        <button
                          onClick={() => {
                            onSelectChapter(chap.chapterNumber);
                            setShowChapterList(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex-1 font-medium text-left cursor-pointer text-[11.5px] flex items-center gap-1.5 min-w-0 overflow-hidden py-0.5"
                        >
                          <span className="font-semibold shrink-0">{chapterLabel}</span>
                          {restTitle && (
                            <span className="truncate opacity-85">{restTitle}</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Nút chuyển chương tiếp theo */}
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
              hasNext
                ? isDarkEffective
                  ? 'bg-white/[0.08] hover:bg-white/[0.16] border-white/20 text-white cursor-pointer shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 cursor-pointer shadow-xs'
                : 'opacity-30 cursor-not-allowed pointer-events-none border-zinc-500/20'
            }`}
            title={hasNext ? 'Chương tiếp theo' : 'Đã ở chương cuối cùng'}
            aria-label="Chương tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>


          {/* Reading Display Settings (Cài Đặt) Popover -> Không thay đổi hình dạng khi bấm */}
          <div className="relative" ref={settingsMenuRef}>
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowChapterList(false);
              }}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs ${
                showSettings
                  ? tStyles.categoryTabActive
                  : isDarkEffective
                  ? 'bg-white/[0.08] hover:bg-white/[0.16] border-white/20 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
              title="Tùy chỉnh giao diện đọc"
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">Cài Đặt</span>
            </button>

            {/* Popover Box giống nút chọn giao diện theme */}
            {showSettings && (
              <div
                className={`absolute right-0 mt-2 w-80 sm:w-92 max-h-[85vh] overflow-y-auto rounded-2xl p-3.5 shadow-2xl border z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5 reader-settings-scrollbar ${
                  isDarkEffective
                    ? 'bg-[#181a20] border-zinc-700 text-zinc-100 shadow-black/60'
                    : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-400/30'
                }`}
                style={{
                  '--scrollbar-thumb': readerSettingsScrollbarColor,
                } as React.CSSProperties}
              >
                {/* Header */}
                <div className="px-1 pb-2 border-b border-zinc-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Cài Đặt Giao Diện Đọc</span>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-[11px] hover:underline opacity-70 cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>

                {/* 1. Cỡ Chữ */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold">Cỡ chữ</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        handleSetFontSize(Math.max(14, fontSize - 1));
                      }}
                      className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                        isDarkEffective ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
                      }`}
                      title="Giảm cỡ chữ"
                    >
                      A-
                    </button>
                    <span className="text-xs font-mono font-bold min-w-[32px] text-center">
                      {fontSize}px
                    </span>
                    <button
                      onClick={() => {
                        handleSetFontSize(Math.min(28, fontSize + 1));
                      }}
                      className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                        isDarkEffective ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
                      }`}
                      title="Tăng cỡ chữ"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* 2. Giãn dòng: 1.5x, 1.8x, 2.1x */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold">Giãn dòng</span>
                  <div className="flex items-center gap-1.5">
                    {([1.5, 1.8, 2.1] as LineHeightOption[]).map((lh) => {
                      const isSelected = lineHeight === lh;
                      return (
                        <button
                          key={lh}
                          onClick={() => handleSelectLineHeight(lh)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer border transition-all ${
                            isSelected
                              ? isDarkEffective
                                ? 'bg-zinc-800 text-white border-zinc-500 ring-1 ring-zinc-500'
                                : 'bg-zinc-100 text-zinc-900 border-zinc-400 ring-1 ring-zinc-300'
                              : isDarkEffective
                              ? 'border-zinc-800 hover:bg-zinc-800/60 text-zinc-400'
                              : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                          }`}
                        >
                          {lh}x
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Căn đều: nút chọn bật căn đều */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold">Căn đều</span>
                  <button
                    onClick={toggleJustify}
                    className={`px-3 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                      isJustified
                        ? isDarkEffective
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : isDarkEffective
                        ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}
                    title={isJustified ? 'Đang bật căn đều hai bên' : 'Bấm để bật căn đều hai bên'}
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                    <span>{isJustified ? 'Đã bật' : 'Bật căn đều'}</span>
                  </button>
                </div>

                {/* 4. Căn lề trang: Hẹp, Vừa (chuẩn), Rộng */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold">Căn lề trang</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'narrow', label: 'Hẹp', desc: 'Khung rộng' },
                      { id: 'normal', label: 'Vừa', desc: 'Chuẩn' },
                      { id: 'wide', label: 'Rộng', desc: 'Khung gọn' },
                    ].map((m) => {
                      const isSelected = pageMargin === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => handleSelectPageMargin(m.id as PageMarginOption)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                            isSelected
                              ? isDarkEffective
                                ? 'bg-zinc-800 text-white border-zinc-500 ring-1 ring-zinc-500'
                                : 'bg-zinc-100 text-zinc-900 border-zinc-400 ring-1 ring-zinc-300'
                              : isDarkEffective
                              ? 'border-zinc-800 hover:bg-zinc-800/60 text-zinc-400'
                              : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                          }`}
                          title={`Căn lề trang: ${m.label} (${m.desc})`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Khoảng cách giữa các đoạn: 1 ô (chuẩn), 2 ô (rộng), Liền */}
                <div className="flex items-center justify-between px-1">
                  <div>
                    <span className="text-xs font-semibold block">Cách đoạn</span>
                    <span className="text-[10px] opacity-60">Khoảng trống giữa 2 đoạn</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: '1-line', label: '1 ô', title: '1 ô (Chuẩn - cách 1 dòng trống)' },
                      { id: '2-lines', label: '2 ô', title: '2 ô (Rộng - cách 2 dòng trống)' },
                      { id: 'tight', label: 'Liền', title: 'Liền mạch (không dòng trống)' },
                    ].map((sp) => {
                      const isSelected = paragraphSpacing === sp.id;
                      return (
                        <button
                          key={sp.id}
                          onClick={() => handleSelectParagraphSpacing(sp.id as '1-line' | '2-lines' | 'tight')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                            isSelected
                              ? isDarkEffective
                                ? 'bg-zinc-800 text-white border-zinc-500 ring-1 ring-zinc-500'
                                : 'bg-zinc-100 text-zinc-900 border-zinc-400 ring-1 ring-zinc-300'
                              : isDarkEffective
                              ? 'border-zinc-800 hover:bg-zinc-800/60 text-zinc-400'
                              : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                          }`}
                          title={sp.title}
                        >
                          {sp.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Kiểu Phông Chữ: Source Sans 3, Open Sans, Times New Roman, Roboto, Lora, Alegreya */}
                <div className="space-y-1.5 px-1">
                  <span className="text-xs font-semibold block">Kiểu phông chữ</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'source-sans', label: 'Source Sans 3', font: 'font-source-sans' },
                      { id: 'open-sans', label: 'Open Sans', font: 'font-open-sans' },
                      { id: 'times', label: 'Times New Roman', font: 'font-times' },
                      { id: 'roboto', label: 'Roboto', font: 'font-roboto font-normal' },
                      { id: 'lora', label: 'Lora', font: 'font-lora' },
                      { id: 'alegreya', label: 'Alegreya', font: 'font-alegreya' },
                    ].map((f) => {
                      const isSelected = fontFamily === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => handleSelectFontFamily(f.id as ReaderFontFamily)}
                          className={`px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer border text-center transition-all truncate ${f.font} ${
                            isSelected
                              ? isDarkEffective
                                ? 'bg-zinc-800 text-white font-bold border-zinc-500 ring-1 ring-zinc-500'
                                : 'bg-zinc-100 text-zinc-900 font-bold border-zinc-400 ring-1 ring-zinc-300'
                              : isDarkEffective
                              ? 'border-zinc-800 hover:bg-zinc-800/60 text-zinc-300'
                              : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                          }`}
                          title={f.label}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Giao Diện Theme (Giống hệt ô chọn theme ngoài trang chủ) */}
                <div className="space-y-1.5 px-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Màu nền giao diện</span>
                    <span className="text-[10px] font-normal opacity-60">
                      {NOVEL_THEME_OPTIONS.find((t) => t.id === readerTheme)?.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {NOVEL_THEME_OPTIONS.map((opt) => {
                      const isSelected = readerTheme === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectTheme(opt.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                            isSelected
                              ? isDarkEffective
                                ? 'bg-zinc-800 text-white font-bold border-zinc-500 ring-1 ring-zinc-500'
                                : 'bg-zinc-100 text-zinc-900 font-bold border-zinc-400 ring-1 ring-zinc-300'
                              : isDarkEffective
                              ? 'border-zinc-800 hover:bg-zinc-800/60 text-zinc-300'
                              : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className="flex items-center -space-x-1 shrink-0">
                              {opt.dots.map((d, i) => (
                                <span
                                  key={i}
                                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                                  style={{ backgroundColor: d }}
                                />
                              ))}
                            </div>
                            <span className="truncate text-[11px] font-medium">{opt.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Chế Độ Tối (Dark Mode) */}
                <div className="pt-2 border-t border-zinc-500/20 flex items-center justify-between px-1">
                  <span className="text-xs font-medium">Chế độ tối (Dark Mode)</span>
                  <button
                    onClick={toggleDarkMode}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                      isDarkEffective
                        ? 'bg-zinc-800 text-amber-300 border-zinc-600'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {isDarkEffective ? <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{isDarkEffective ? 'Bật' : 'Tắt'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Reading Area (Cuộn bằng thanh cuộn mặc định của trình duyệt) */}
      <main className={`${marginContainerClass} mx-auto py-10 sm:py-14 w-full flex-1 transition-all duration-300`}>
        {/* Chapter Title Banner */}
        <div className={`text-center mb-10 pb-6 border-b ${tStyles.sectionHeaderBorder}`}>
          <span className={`inline-block text-xs font-novel-title px-3 py-1 rounded-full border ${tStyles.heroTag}`}>
            {novel.title}
          </span>
          {(() => {
            const currentDisplay = getChapterDisplayParts(currentChapter || {
              chapterNumber: chapterNumber || 1,
              title: `Chương ${chapterNumber || 1}`
            });
            return (
              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-novel-title mt-4 tracking-tight flex items-center justify-center gap-2 flex-wrap ${tStyles.heroTitle}`}>
                <span>{currentDisplay.chapterLabel}</span>
                {currentDisplay.restTitle && (
                  <span>{currentDisplay.restTitle}</span>
                )}
              </h1>
            );
          })()}
          <div className={`flex items-center justify-center gap-4 text-xs font-mono mt-3 ${tStyles.heroAuthorMuted}`}>
            <span>Độ dài: ~{activeWordCount.toLocaleString()} chữ</span>
            <span>•</span>
            <span>Cập nhật: {currentChapter?.publishedAt}</span>
          </div>
        </div>

        {!isChapterUnlocked ? (
          /* Màn hình khóa khi chưa nhập pass 18+ */
          <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#822a33]/10 border border-[#822a33]/25 flex items-center justify-center text-[#822a33] dark:bg-[#822a33]/20 dark:border-[#822a33]/40 dark:text-[#e89098] mb-4 shadow-xs">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className={`text-xl font-bold tracking-tight ${tStyles.heroTitle}`}>
              Nội dung giới hạn độ tuổi (18+)
            </h3>
            <p className={`mt-2.5 text-xs sm:text-sm ${tStyles.heroAuthorMuted} leading-relaxed`}>
              Chương truyện yêu cầu mật khẩu xác nhận độ tuổi. Vui lòng nhập mật khẩu để mở khóa và đọc toàn bộ tác phẩm.
            </p>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#822a33] hover:bg-[#6e232b] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md shadow-[#822a33]/20 transition-all flex items-center gap-2 hover:scale-102 active:scale-98"
            >
              <KeyRound className="w-4 h-4" />
              <span>Nhập mật khẩu (Pass)</span>
            </button>
          </div>
        ) : (
          <>
            {/* Chapter Text Body - Chống copy nhưng vẫn cho phép bôi đen (chọn văn bản) */}
            <article
              onCopy={(e) => {
                e.preventDefault();
              }}
              onCut={(e) => {
                e.preventDefault();
              }}
              onContextMenu={(e) => {
                e.preventDefault();
              }}
              onDragStart={(e) => {
                e.preventDefault();
              }}
              className={`select-text ${tStyles.readerText} ${fontClass} ${
                isJustified ? 'text-justify [text-justify:inter-word]' : 'text-left'
              }`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                textAlign: isJustified ? 'justify' : 'left',
                userSelect: 'text',
                WebkitUserSelect: 'text',
                MozUserSelect: 'text',
                msUserSelect: 'text',
              }}
            >
          {isLoadingChapterContent && !activeContent ? (
            <div className="py-12 space-y-4 animate-pulse">
              <div className="flex items-center justify-center gap-2 pb-4 text-xs font-sans text-stone-400">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span>Đang tải nội dung chương từ hệ thống...</span>
              </div>
              <div className="h-4 bg-stone-500/15 rounded-md w-full" />
              <div className="h-4 bg-stone-500/15 rounded-md w-11/12" />
              <div className="h-4 bg-stone-500/15 rounded-md w-4/5" />
              <div className="h-4 bg-stone-500/15 rounded-md w-full pt-4" />
              <div className="h-4 bg-stone-500/15 rounded-md w-10/12" />
              <div className="h-4 bg-stone-500/15 rounded-md w-3/4" />
            </div>
          ) : paragraphs.length > 0 ? (
            paragraphs.map((para, idx) => {
              const paraHighlights = chapterHighlights.filter(
                (h) => h.paragraphIndex === idx || (h.selectedText && para.includes(h.selectedText))
              );
              const paraCommentsCount = currentChapterComments.filter((cm) => {
                return paraHighlights.some((h) => h.selectedText && cm.content.includes(h.selectedText));
              }).length;

              return (
                <div
                  key={idx}
                  data-paragraph-index={idx}
                  className={`${
                    paragraphSpacing === 'tight'
                      ? 'mb-1 sm:mb-1.5'
                      : paragraphSpacing === '2-lines'
                      ? 'mb-7 sm:mb-8'
                      : 'mb-3.5 sm:mb-4.5'
                  }`}
                >
                  <p className={`${hasIndent ? 'indent-7 sm:indent-8' : ''} whitespace-pre-line`}>
                    {renderHighlightedParagraph(para, idx, chapterHighlights, false)}
                  </p>

                  {/* Số lượng bình luận nằm dưới cùng của đoạn highlight có bình luận (ví dụ: 💬 2 ) */}
                  {paraCommentsCount > 0 && (
                    <div className="flex items-center justify-end pt-1 not-italic select-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const targetQuote = paraHighlights[0]?.selectedText || '';
                          setQuoteCommentModal({
                            isOpen: true,
                            quoteText: targetQuote,
                          });
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95 ${paraCommentBadgeStyle}`}
                        title={`Có ${paraCommentsCount} bình luận về đoạn này (bấm để xem)`}
                      >
                        <span>💬 {paraCommentsCount}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            (() => {
              const paraHighlights = chapterHighlights;
              const paraCommentsCount = currentChapterComments.filter((cm) => {
                return paraHighlights.some((h) => h.selectedText && cm.content.includes(h.selectedText));
              }).length;

              return (
                <div data-paragraph-index={0}>
                  <p className="whitespace-pre-line">
                    {renderHighlightedParagraph(activeContent || 'Nội dung chương đang được chuẩn bị hoặc trống...', 0, chapterHighlights, false)}
                  </p>
                  {paraCommentsCount > 0 && (
                    <div className="flex items-center justify-end pt-1 not-italic select-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const targetQuote = paraHighlights[0]?.selectedText || '';
                          setQuoteCommentModal({
                            isOpen: true,
                            quoteText: targetQuote,
                          });
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95 ${paraCommentBadgeStyle}`}
                        title={`Có ${paraCommentsCount} bình luận về đoạn này (bấm để xem)`}
                      >
                        <span>💬 {paraCommentsCount}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </article>

        {/* Chapter Navigation Bottom */}
        <div className={`mt-14 pt-6 border-t flex items-center justify-between gap-3 sm:gap-4 ${tStyles.sectionHeaderBorder}`}>
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              hasPrev
                ? tStyles.heroBtnRead
                : 'opacity-40 cursor-not-allowed border border-current'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Chương Trước</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              hasNext
                ? tStyles.heroBtnRead
                : 'opacity-40 cursor-not-allowed border border-current'
            }`}
          >
            <span>Chương Tiếp</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PHẦN BÌNH LUẬN CHO TỪNG CHƯƠNG TRUYỆN */}
        {/* Tự động lưu và đồng bộ real-time với mục bình luận ngoài trang thông tin truyện */}
        {/* ========================================================================= */}
        <section id="chapter-comments-section" className={`mt-14 pt-8 border-t space-y-6 ${tStyles.sectionHeaderBorder}`}>
          {/* Header bình luận */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className={`text-base sm:text-lg font-bold ${tStyles.sectionTitle}`}>
                Bình Luận Chương {chapterNumber}
              </h3>
            </div>
          </div>

          {/* Form viết bình luận */}
          <form
            id="chapter-comment-form"
            onSubmit={handlePostChapterComment}
            className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-colors ${chapterCommentBoxClass}`}
          >
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="w-full sm:w-1/3">
                <input
                  type="text"
                  placeholder="Tên của bạn"
                  value={authorNameInput}
                  onChange={(e) => handleAuthorNameChange(e.target.value)}
                  maxLength={40}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${
                    isDarkEffective
                      ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                      : 'bg-white border-zinc-300 text-zinc-800 placeholder-zinc-400'
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none opacity-80 hover:opacity-100 transition-opacity">
                  <input
                    type="checkbox"
                    checked={rememberName}
                    onChange={(e) => handleToggleRememberName(e.target.checked)}
                    className="rounded border-zinc-400 text-purple-600 focus:ring-purple-500/30 w-3.5 h-3.5 cursor-pointer accent-purple-600"
                  />
                  <span>Ghi nhớ tên</span>
                </label>
              </div>
              <div className="flex-1 flex items-center justify-between sm:justify-end text-xs opacity-75">
                <span>Đang bình luận tại: <strong className="font-semibold">Chương {chapterNumber}</strong></span>
              </div>
            </div>

            <div>
              <textarea
                rows={3}
                placeholder={`Bạn nghĩ gì về chương ${chapterNumber}? Hãy chia sẻ cảm nhận với mọi người...`}
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                maxLength={1000}
                required
                className={`w-full p-3.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none ${
                  isDarkEffective
                    ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                    : 'bg-white border-zinc-300 text-zinc-800 placeholder-zinc-400'
                }`}
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] opacity-60">
                {newCommentContent.length}/1000 ký tự
              </span>
              <button
                type="submit"
                disabled={!newCommentContent.trim() || isSubmittingComment}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                  !newCommentContent.trim() || isSubmittingComment
                    ? 'opacity-40 cursor-not-allowed'
                    : `${tStyles.buttonPrimary} hover:scale-102 active:scale-98`
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingComment ? 'Đang gửi...' : 'Gửi Bình Luận'}</span>
              </button>
            </div>
          </form>

          {/* Danh sách bình luận */}
          <div className="space-y-3">
            {displayedComments.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border space-y-2 border-dashed ${chapterCommentItemClass}`}>
                <MessageSquare className="w-8 h-8 mx-auto opacity-30" />
                <p className={`text-xs sm:text-sm font-medium ${tStyles.cardAuthor}`}>
                  Chương {chapterNumber} chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nghĩ nhé!
                </p>
              </div>
            ) : (
              displayedComments.map((cm) => (
                <div
                  key={cm.id}
                  className={`p-4 rounded-2xl border space-y-2.5 transition-colors ${chapterCommentItemClass}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {cm.avatar && (cm.avatar.startsWith('http://') || cm.avatar.startsWith('https://')) ? (
                        <img
                          src={cm.avatar}
                          alt={cm.author}
                          className="w-8 h-8 rounded-full border object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs select-none shadow-xs text-white ${getAvatarBgColor(
                            cm.author
                          )}`}
                        >
                          {(cm.author?.trim().charAt(0) || 'Đ').toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs sm:text-sm font-bold truncate ${tStyles.cardTitle}`}>
                            {cm.author}
                          </span>
                          {typeof cm.chapterNumber === 'number' && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCommentChapterBadgeStyle(readerTheme, isDarkEffective)}`}>
                              Chương {cm.chapterNumber}
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] block ${tStyles.cardAuthor}`}>
                          {normalizeCommentDate(cm.createdAt)}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteChapterComment(cm.id)}
                        className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Xóa bình luận"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed pl-10.5 ${
                    isDarkEffective ? 'text-stone-200' : 'text-stone-700'
                  }`}>
                    {cm.content}
                  </p>

                  <div className="flex items-center gap-3 pl-10.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        const mention = `@${cm.author} `;
                        if (!newCommentContent.includes(mention)) {
                          setNewCommentContent((prev) => `${mention}${prev}`);
                        }
                        const el = document.getElementById('chapter-comment-form');
                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${tStyles.cardAuthor} hover:text-purple-500`}
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Trả lời</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
          </>
        )}
      </main>

      {/* Chapter Editor Modal (Chỉnh sửa, đổi tên, xóa chương và lưu vĩnh viễn vào Firestore) */}
      <ChapterEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        novelId={novel.id}
        chapter={editingChapterTarget || currentChapter}
        currentContent={
          (editingChapterTarget?.chapterNumber === chapterNumber
            ? activeContent
            : contentCacheRef.current[editingChapterTarget?.chapterNumber || 0]) ||
          editingChapterTarget?.content ||
          ''
        }
        onChapterUpdated={handleChapterUpdated}
        onChapterDeleted={handleChapterDeleted}
        isDark={isDarkEffective}
      />

      {/* POPUP BÌNH LUẬN NHANH TRONG TRÌNH ĐỌC TRUYỆN (KHÔNG CẦN CUỘN) */}
      <AnimatePresence>
        {showCommentsPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            {/* Click-outside backdrop */}
            <div
              className="absolute inset-0"
              onClick={() => setShowCommentsPopup(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.16 }}
              className={`relative w-full max-w-lg md:max-w-xl max-h-[85vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl z-10 ${
                isDarkEffective
                  ? 'bg-[#16181f] border-zinc-700 text-zinc-100 shadow-black/80'
                  : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-500/25'
              }`}
            >
              {/* Header của Popup */}
              <div className="px-5 py-3.5 border-b border-zinc-500/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-purple-500/15 text-purple-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
                      <span>Bình Luận Chương {chapterNumber}</span>
                      <span className={`text-[11px] px-2 py-0.2 rounded-full border font-mono font-semibold ${tStyles.cardTag}`}>
                        {currentChapterComments.length}
                      </span>
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCommentsPopup(false)}
                  className="p-1.5 rounded-xl border border-transparent hover:border-zinc-500/30 hover:bg-zinc-500/10 opacity-70 hover:opacity-100 transition-all cursor-pointer"
                  title="Đóng popup (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Thân cuộn của Popup: Form nhập và danh sách bình luận (sử dụng scrollbar 1px theo theme) */}
              <div
                className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 reader-settings-scrollbar"
                style={{
                  '--scrollbar-thumb': readerSettingsScrollbarColor,
                } as React.CSSProperties}
              >
                {/* Form bình luận nhanh */}
                <form
                  onSubmit={handlePostChapterComment}
                  className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 transition-colors ${tStyles.commentForm || tStyles.card}`}
                >
                  <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
                    <div className="w-full sm:w-1/2">
                      <input
                        type="text"
                        placeholder="Tên của bạn"
                        value={authorNameInput}
                        onChange={(e) => handleAuthorNameChange(e.target.value)}
                        maxLength={40}
                        className={`w-full px-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${
                          isDarkEffective
                            ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                            : 'bg-white border-zinc-300 text-zinc-800 placeholder-zinc-400'
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] select-none opacity-80 hover:opacity-100 transition-opacity">
                        <input
                          type="checkbox"
                          checked={rememberName}
                          onChange={(e) => handleToggleRememberName(e.target.checked)}
                          className="rounded border-zinc-400 text-purple-600 focus:ring-purple-500/30 w-3 h-3 cursor-pointer accent-purple-600"
                        />
                        <span>Ghi nhớ tên</span>
                      </label>
                    </div>
                    <div className="flex-1 flex items-center justify-between sm:justify-end text-[11px] opacity-75">
                      <span>Bình luận tại <strong className="font-semibold">Chương {chapterNumber}</strong></span>
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      placeholder={`Bạn nghĩ gì về chương ${chapterNumber}? Chia sẻ cảm nhận nhanh...`}
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      maxLength={1000}
                      required
                      className={`w-full p-3 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none ${
                        isDarkEffective
                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                          : 'bg-white border-zinc-300 text-zinc-800 placeholder-zinc-400'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-0.5">
                    <span className="text-[10px] opacity-60">
                      {newCommentContent.length}/1000 ký tự
                    </span>
                    <button
                      type="submit"
                      disabled={!newCommentContent.trim() || isSubmittingComment}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        !newCommentContent.trim() || isSubmittingComment
                          ? 'opacity-40 cursor-not-allowed'
                          : `${tStyles.buttonPrimary} hover:scale-102 active:scale-98`
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{isSubmittingComment ? 'Đang gửi...' : 'Gửi Bình Luận'}</span>
                    </button>
                  </div>
                </form>

                {/* Danh sách bình luận */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                      Tất cả cảm nghĩ ({displayedComments.length})
                    </span>
                  </div>

                  {displayedComments.length === 0 ? (
                    <div className={`p-6 text-center rounded-2xl border space-y-1.5 border-dashed ${tStyles.commentCard || tStyles.card}`}>
                      <MessageSquare className="w-6 h-6 mx-auto opacity-30" />
                      <p className={`text-xs font-medium ${tStyles.cardAuthor}`}>
                        Chương {chapterNumber} chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nghĩ nhé!
                      </p>
                    </div>
                  ) : (
                    displayedComments.map((cm) => {
                      const parsed = parseCommentContent(cm.content);
                      return (
                        <div
                          key={cm.id}
                          className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 transition-colors ${tStyles.commentCard || tStyles.card}`}
                        >
                          {/* 1. Nếu là bình luận trích dẫn: Hiển thị khung trích dẫn ở trên cùng theo ảnh */}
                          {parsed.hasQuote && (
                            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#fef9ee] dark:bg-[#252016] border border-amber-200/80 dark:border-amber-900/50 shadow-xs">
                              <p className="font-serif italic text-xs sm:text-[13px] text-stone-800 dark:text-amber-100/90 leading-relaxed">
                                “{parsed.quoteText}”
                              </p>
                            </div>
                          )}

                          {/* 2. Dòng thông tin tác giả & Thời gian */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {cm.avatar && (cm.avatar.startsWith('http://') || cm.avatar.startsWith('https://')) ? (
                                <img
                                  src={cm.avatar}
                                  alt={cm.author}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border object-cover shrink-0"
                                />
                              ) : (
                                <div
                                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs select-none shadow-xs text-white ${getAvatarBgColor(
                                    cm.author
                                  )}`}
                                >
                                  {(cm.author?.trim().charAt(0) || 'Đ').toUpperCase()}
                                </div>
                              )}
                              <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                                <span className={`text-xs sm:text-sm font-bold truncate block ${tStyles.cardTitle}`}>
                                  {cm.author}
                                </span>
                                {typeof cm.chapterNumber === 'number' && (
                                  <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold ${getCommentChapterBadgeStyle(readerTheme, isDarkEffective)}`}>
                                    Chương {cm.chapterNumber}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[11px] font-normal opacity-70 ${tStyles.cardAuthor}`}>
                                {normalizeCommentDate(cm.createdAt)}
                              </span>
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteChapterComment(cm.id)}
                                  className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  title="Xóa bình luận"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* 3. Nội dung bình luận của độc giả */}
                          <p className={`text-xs sm:text-sm leading-relaxed pl-1 ${
                            isDarkEffective ? 'text-stone-200' : 'text-stone-700'
                          }`}>
                            {parsed.hasQuote ? (parsed.commentBody || '') : cm.content}
                          </p>

                          <div className="flex items-center gap-3 pl-1 pt-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                const mention = `@${cm.author} `;
                                if (!newCommentContent.includes(mention)) {
                                  setNewCommentContent((prev) => `${mention}${prev}`);
                                }
                              }}
                              className={`flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer transition-colors ${tStyles.cardAuthor} hover:text-purple-500`}
                            >
                              <Reply className="w-3 h-3" />
                              <span>Trả lời</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toolbar ở góc dưới bên phải: 1 khối hình chữ nhật dọc, nền màu trắng, icon 2 nút màu đen tối giản */}
      <div
        className={`fixed right-4 sm:right-7 z-30 transition-all duration-300 ease-out transform ${
          isHighlighterMode ? 'bottom-28 sm:bottom-32' : 'bottom-6 sm:bottom-8'
        } ${
          shouldShowHeader && !showSettings
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative">
          {/* Khối hình chữ nhật dọc chứa 2 nút đổi màu theo theme sáng/tối */}
          <div className={`flex flex-col items-center rounded-2xl shadow-xl border overflow-hidden backdrop-blur-md transition-colors divide-y ${floatingToolbarTheme.container}`}>
            
            {/* 1. NÚT BÚT HIGHLIGHT */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => {
                  cosmicAudio.playChime('sparkle');
                  setShowSettings(false);
                  setShowChapterList(false);
                  const hasSeenIntro = safeStorage.getItem('cosmo_highlight_intro_seen');
                  if (!hasSeenIntro) {
                    setShowHighlightIntroTooltip(true);
                    safeStorage.setItem('cosmo_highlight_intro_seen', 'true');
                    setIsHighlighterMode(true);
                    setActiveHighlightColor(null);
                    setActiveHighlightStyle(null);
                    setClickedHighlightId(null);
                  } else {
                    setIsHighlighterMode((prev) => {
                      const next = !prev;
                      if (!next) {
                        setFloatingSelection(null);
                        lastSelectionRef.current = null;
                        setClickedHighlightId(null);
                      }
                      return next;
                    });
                    setActiveHighlightColor(null);
                    setActiveHighlightStyle(null);
                    setClickedHighlightId(null);
                  }
                }}
                className={`w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 relative ${
                  isHighlighterMode ? floatingToolbarTheme.btnActive : floatingToolbarTheme.btn
                }`}
                title={
                  isHighlighterMode
                    ? 'Đang bật Bút Highlight (nhấn để tắt)'
                    : 'Bật Bút Highlight (Tô câu chữ và trích dẫn trên trang sách)'
                }
              >
                <Highlighter className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover:scale-105" />
              </button>

              {/* Tooltip hover sang trái trên desktop */}
              <div className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2.5 py-1 rounded-xl text-[11px] font-medium shadow-lg pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block z-40 ${floatingToolbarTheme.tooltip}`}>
                {isHighlighterMode ? 'Đang bật Highlight' : 'Bút Highlight'}
              </div>
            </div>

            {/* 2. NÚT BÌNH LUẬN CHƯƠNG */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => {
                  setIsCommentsDrawerOpen(true);
                  setShowSettings(false);
                  setShowChapterList(false);
                }}
                className={`w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 relative ${floatingToolbarTheme.btn}`}
                title={`Xem danh sách bình luận của chương`}
              >
                <MessageSquare className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover:scale-105" />
              </button>

              {/* Tooltip hover sang trái trên desktop */}
              <div className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2.5 py-1 rounded-xl text-[11px] font-medium shadow-lg pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block z-40 ${floatingToolbarTheme.tooltip}`}>
                Bình luận
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Thanh Công Cụ Highlight: Chỉ khi bấm vào nút highlight mới hiện thanh công cụ, cố định ở phía dưới cùng */}
      {isHighlighterMode && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
          <HighlightToolbarPopup
            selectedText={floatingSelection?.selectedText || lastSelectionRef.current?.selectedText || ''}
            activeColor={activeHighlightColor}
            activeStyle={activeHighlightStyle}
            isDark={isDarkEffective}
            theme={readerTheme}
            isHighlightsHidden={isHighlightsHidden}
            isEditingExisting={!!clickedHighlightId}
            onToggleHide={() => setIsHighlightsHidden((prev) => !prev)}
            onClose={() => {
              setIsHighlighterMode(false);
              setFloatingSelection(null);
              setClickedHighlightId(null);
              setActiveHighlightColor(null);
              setActiveHighlightStyle(null);
            }}
            onSelectColor={(c) => {
              setActiveHighlightColor((prev) => (prev === c ? null : c));
            }}
            onSelectStyle={(s) => {
              setActiveHighlightStyle((prev) => (prev === s ? null : s));
            }}
            onApplyHighlight={() => {
              const currentSel = floatingSelection || lastSelectionRef.current;
              if (!currentSel?.selectedText) {
                showToast('Vui lòng dùng chuột hoặc chạm để bôi đen một cụm từ trên trang trước khi bấm Highlight nhé!');
                return;
              }
              if (!activeHighlightColor && !activeHighlightStyle) {
                showToast('Vui lòng chọn màu bút và dạng vệt bút!');
                return;
              }
              if (!activeHighlightColor) {
                showToast('Vui lòng chọn màu bút highlight!');
                return;
              }
              if (!activeHighlightStyle) {
                showToast('Vui lòng chọn dạng vệt bút highlight!');
                return;
              }
              handleQuickHighlight(activeHighlightColor, activeHighlightStyle);
              setClickedHighlightId(null);
            }}
            onSaveExistingHighlight={() => {
              if (clickedHighlightId) {
                const target = chapterHighlights.find((h) => h.id === clickedHighlightId);
                const colorToUse = activeHighlightColor || target?.color;
                const styleToUse = activeHighlightStyle || target?.style || 'classic';
                if (!activeHighlightColor && !activeHighlightStyle) {
                  showToast('Vui lòng chọn màu bút hoặc dạng vệt bút mới để lưu!');
                  return;
                }
                handleChangeHighlightColor(clickedHighlightId, colorToUse || 'yellow', styleToUse);
                setClickedHighlightId(null);
                showToast('Đã lưu thay đổi highlight thành công!');
              }
            }}
            onOpenCommentModal={() => {
              const currentSel = floatingSelection || lastSelectionRef.current;
              let quote = currentSel?.selectedText || '';
              if (!quote && clickedHighlightId) {
                const found = chapterHighlights.find((h) => h.id === clickedHighlightId);
                if (found) quote = found.selectedText;
              }
              if (quote && !clickedHighlightId) {
                if (activeHighlightColor && activeHighlightStyle) {
                  handleQuickHighlight(activeHighlightColor, activeHighlightStyle);
                }
              }
              // Luôn mở trực tiếp modal Trích Dẫn & Bình Luận
              setQuoteCommentModal({
                isOpen: true,
                quoteText: quote,
              });
              setClickedHighlightId(null);
            }}
            onRemoveHighlight={() => {
              const currentSel = floatingSelection || lastSelectionRef.current;
              let targetId = clickedHighlightId;
              let targetText = currentSel?.selectedText || '';
              let targetPara = currentSel?.paragraphIndex;

              if (!targetId && targetText) {
                const found = chapterHighlights.find(
                  (h) =>
                    h.selectedText === targetText ||
                    h.selectedText.includes(targetText) ||
                    targetText.includes(h.selectedText)
                );
                if (found) {
                  targetId = found.id;
                  targetPara = found.paragraphIndex;
                  targetText = found.selectedText;
                }
              }

              if (targetId || targetText) {
                handleDeleteHighlight(targetId, targetText, targetPara);
                setClickedHighlightId(null);
                setFloatingSelection(null);
                lastSelectionRef.current = null;
                try {
                  window.getSelection()?.removeAllRanges();
                } catch {}
                showToast('Đã xóa highlight thành công!');
              }
            }}
          />
        </div>
      )}

      {/* Intro Tooltip Bút Highlight */}
      <AnimatePresence>
        {showHighlightIntroTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed bottom-24 sm:bottom-28 right-4 sm:right-7 z-50 max-w-xs p-3.5 rounded-2xl bg-stone-900 text-white shadow-2xl border border-stone-700 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <Highlighter className="w-3.5 h-3.5" />
                Bút Highlight Sẵn Sàng!
              </span>
              <button
                type="button"
                onClick={() => setShowHighlightIntroTooltip(false)}
                className="p-1 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Bạn hãy dùng chuột hoặc ngón tay bôi đen câu chữ yêu thích trên trang sách, sau đó nhấn nút <b>Highlight</b> để tô màu và lưu lại nhé.
            </p>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowHighlightIntroTooltip(false)}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-[11px] cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Modal Trích Dẫn & Bình Luận */}
      <HighlightCommentModal
        isOpen={quoteCommentModal.isOpen}
        onClose={() => setQuoteCommentModal({ isOpen: false, quoteText: '' })}
        quoteText={quoteCommentModal.quoteText}
        initialAuthor={authorNameInput}
        theme={readerTheme}
        isDark={isDarkEffective}
        comments={chapterComments}
        chapterNumber={chapterNumber}
        onSubmit={handleSubmitQuoteComment}
      />

      {/* 18+ Chapter Password Gate Modal (Pop up xác thực mật khẩu chương truyện) */}
      <ChapterPasswordModal
        isOpen={!isChapterUnlocked || showPasswordModal}
        novel={novel}
        onSuccess={handleUnlockSuccess}
        onCancel={handleCancelPassword}
        isDarkMode={isDarkEffective}
      />

      {/* Toast Notification ở phía trên màn hình */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-5 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 text-white shadow-2xl shadow-emerald-950/30 text-xs sm:text-sm font-bold pointer-events-none"
          >
            <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
            <span>{toastNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
