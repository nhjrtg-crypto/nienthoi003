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
  Lock,
  KeyRound,
} from 'lucide-react';
import { Novel, NovelChapter, NovelComment } from '../types';
import {
  getNovelThemeStyles,
  NovelThemeId,
  NOVEL_THEME_OPTIONS,
  getExtraChapterBadgeStyle,
  isExtraChapter,
  getChapterDisplayParts,
} from '../utils/themeStyles';
import { safeStorage } from '../utils/safeStorage';
import { saveRecentRead } from '../utils/recentReads';
import { useHeaderScroll } from '../utils/useHeaderScroll';
import { formatCommentDate, normalizeCommentDate } from '../utils/dateUtils';
import {
  fetchSingleChuong,
  fetchChuongMetaList,
  recordChapterRead,
  subscribeBinhLuanList,
  addBinhLuan,
  likeBinhLuan,
  deleteBinhLuan,
  isBotComment,
} from '../services/firebase';
import { ChapterEditorModal } from './ChapterEditorModal';
import { ChapterPasswordModal, isChapterPasswordUnlocked } from './ChapterPasswordModal';
import { INITIAL_NOVELS } from '../data/novelData';

interface NovelReaderModalProps {
  novel: Novel | null;
  chapterNumber: number | null;
  onClose: () => void;
  onSelectChapter: (num: number) => void;
  onUpdateChapters?: (novelId: string, chapters: NovelChapter[]) => void;
  onUpdateNovel?: (novel: Novel) => void;
}

type ReaderFontFamily = 'open-sans' | 'source-sans' | 'times' | 'roboto' | 'lora';
type LineHeightOption = 1.5 | 1.8 | 2.1;
type PageMarginOption = 'narrow' | 'normal' | 'wide';

export const NovelReaderModal: React.FC<NovelReaderModalProps> = ({
  novel,
  chapterNumber,
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

  // 2. Kiểu phông chữ: Open Sans (mặc định), Source Sans 3, Times New Roman, Roboto, Lora
  const [fontFamily, setFontFamily] = useState<ReaderFontFamily>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_reader_font');
      if (saved && ['times', 'roboto', 'lora', 'open-sans', 'source-sans'].includes(saved)) {
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

  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const chapterMenuRef = useRef<HTMLDivElement>(null);

  // Sync theme with system
  const [readerTheme, setReaderTheme] = useState<NovelThemeId>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_novel_theme');
      if (saved && ['slate-haze', 'sage', 'notebook', 'mocha', 'amethyst-haze', 'cosmic'].includes(saved)) {
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

  // 18+ Chapter Password Gate (Nhập mật khẩu một lần, lưu vĩnh viễn)
  const [isChapterUnlocked, setIsChapterUnlocked] = useState<boolean>(() => isChapterPasswordUnlocked());
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(() => !isChapterPasswordUnlocked());

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
    try {
      const saved = safeStorage.getItem(`cosmo_novel_comments_${novel.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChapterComments(parsed.filter((c: NovelComment) => !isBotComment(c)));
        }
      }
    } catch {}

    const unsubscribe = subscribeBinhLuanList(
      novel.id,
      (firestoreComments) => {
        const clean = firestoreComments.filter((c) => !isBotComment(c));
        const base = (novel.comments || []).filter((c) => !isBotComment(c));
        const fsIds = new Set(clean.map((c) => c.id));
        const remaining = base.filter((c) => !fsIds.has(c.id));
        const merged = [...clean, ...remaining];
        setChapterComments(merged);
        try {
          safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(merged));
        } catch {}
        onUpdateNovel?.({ ...novel, comments: merged });
      },
      (err) => {
        console.warn('Realtime chapter comments subscription notice:', err);
      }
    );

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

    setIsSubmittingComment(true);
    const finalAuthor = authorNameInput.trim() || 'Bạn Đọc';
    const formattedDate = formatCommentDate();

    if (rememberName && authorNameInput.trim()) {
      try {
        safeStorage.setItem('cosmo_comment_author_name', authorNameInput.trim());
      } catch {}
    }

    const tempComment: NovelComment = {
      id: `cm-${Date.now()}`,
      truyenId: novel.id,
      author: finalAuthor,
      avatar: '',
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

    try {
      await addBinhLuan(novel.id, {
        author: finalAuthor,
        content: tempComment.content,
        createdAt: formattedDate,
        badge: 'Độc Giả',
        chapterNumber: chapterNumber,
        chapterTitle: currentChapter?.title || `Chương ${chapterNumber}`,
      });
    } catch (err) {
      console.warn('[Firebase] Failed to persist chapter comment to Firestore:', err);
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
    try {
      likeBinhLuan(novel.id, commentId);
    } catch (err) {
      console.warn('[Firebase] Failed to sync comment like:', err);
    }
  };

  const handleDeleteChapterComment = async (commentId: string) => {
    if (!novel) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) return;
    const updated = chapterComments.filter((c) => c.id !== commentId);
    setChapterComments(updated);
    try {
      safeStorage.setItem(`cosmo_novel_comments_${novel.id}`, JSON.stringify(updated));
    } catch {}
    onUpdateNovel?.({ ...novel, comments: updated });
    try {
      await deleteBinhLuan(novel.id, commentId);
    } catch (err) {
      console.warn('[Firebase] Failed to delete comment:', err);
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

    // Ghi nhận lượt đọc chỉ khi độc giả bấm vào chương truyện
    const chap = allChapters.find((c) => c.chapterNumber === chapterNumber);
    const chapTitle = chap?.title || `Chương ${chapterNumber}`;
    recordChapterRead(novel.id, novel.title, chapterNumber, chapTitle);

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

    // 2b. Lookup from INITIAL_NOVELS static source data
    const staticNovel = INITIAL_NOVELS.find((n) => n.id === novel.id || n.title.toLowerCase().trim() === novel.title.toLowerCase().trim());
    const staticChap = staticNovel?.chapters?.find((c) => c.chapterNumber === chapterNumber);
    if (staticChap?.content && staticChap.content.trim().length > 0) {
      contentCacheRef.current[chapterNumber] = staticChap.content;
      setFirestoreFetchedContent(staticChap.content);
      setIsLoadingChapterContent(false);
      return;
    }

    // 3. Otherwise fetch from Firestore on-demand
    setIsLoadingChapterContent(true);
    let isMounted = true;

    fetchSingleChuong(novel.id, chapterNumber)
      .then((res) => {
        if (!isMounted) return;
        if (res && res.noiDung && res.noiDung.trim().length > 0) {
          contentCacheRef.current[chapterNumber] = res.noiDung;
          setFirestoreFetchedContent(res.noiDung);
        } else if (localChap?.content && localChap.content.trim().length > 0) {
          setFirestoreFetchedContent(localChap.content);
        } else {
          setFirestoreFetchedContent('Chương này hiện chưa có nội dung hoặc đang được cập nhật.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching chapter content from Firestore:', err);
        if (localChap?.content && localChap.content.trim().length > 0) {
          setFirestoreFetchedContent(localChap.content);
        } else {
          setFirestoreFetchedContent('Không thể tải nội dung chương. Vui lòng kiểm tra lại kết nối!');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingChapterContent(false);
        }
      });

    return () => {
      isMounted = false;
    };
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
            className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
              hasPrev
                ? `${tStyles.carouselNavBtn} cursor-pointer`
                : 'opacity-30 cursor-not-allowed pointer-events-none border-zinc-500/20'
            }`}
            title={hasPrev ? 'Chương trước' : 'Đã ở chương đầu tiên'}
            aria-label="Chương trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* NÚT MỤC LỤC Ở TRÊN THANH HEADER NẰM GIỮA HAI NÚT MŨI TÊN CHUYỂN CHƯƠNG */}
          <div className="relative" ref={chapterMenuRef}>
            <button
              onClick={() => {
                setShowChapterList(!showChapterList);
                setShowSettings(false);
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs ${
                showChapterList ? tStyles.categoryTabActive : tStyles.carouselNavBtn
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
                        className={`w-full px-2 py-1 rounded-lg text-xs flex items-center justify-between transition-all group ${
                          isCurrent
                            ? `${tStyles.categoryTabActive} font-semibold shadow-2xs`
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
            className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
              hasNext
                ? `${tStyles.carouselNavBtn} cursor-pointer`
                : 'opacity-30 cursor-not-allowed pointer-events-none border-zinc-500/20'
            }`}
            title={hasNext ? 'Chương tiếp theo' : 'Đã ở chương cuối cùng'}
            aria-label="Chương tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Nút Bình Luận (Chỉ có icon MessageSquare) - Mở Popup bình luận nhanh */}
          <button
            type="button"
            onClick={() => {
              if (!isChapterUnlocked) {
                setShowPasswordModal(true);
                return;
              }
              setShowCommentsPopup(!showCommentsPopup);
              setShowChapterList(false);
              setShowSettings(false);
            }}
            className={`p-2 rounded-xl sm:rounded-full border transition-all cursor-pointer flex items-center justify-center shadow-xs ${
              showCommentsPopup ? tStyles.categoryTabActive : tStyles.carouselNavBtn
            }`}
            title="Bình luận chương nhanh (không cần cuộn)"
            aria-label="Bình luận chương nhanh"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Reading Display Settings (Cài Đặt) Popover -> Ô giống nút chọn giao diện theme */}
          <div className="relative" ref={settingsMenuRef}>
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowChapterList(false);
              }}
              className={`p-2 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs ${
                showSettings ? tStyles.categoryTabActive : tStyles.carouselNavBtn
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

                {/* Kiểu Phông Chữ: Source Sans 3, Open Sans, Times New Roman, Roboto, Lora */}
                <div className="space-y-1.5 px-1">
                  <span className="text-xs font-semibold block">Kiểu phông chữ</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'source-sans', label: 'Source Sans 3', font: 'font-source-sans' },
                      { id: 'open-sans', label: 'Open Sans', font: 'font-open-sans' },
                      { id: 'times', label: 'Times New Roman', font: 'font-times' },
                      { id: 'roboto', label: 'Roboto', font: 'font-roboto font-normal' },
                      { id: 'lora', label: 'Lora', font: 'font-lora' },
                    ].map((f, idx) => {
                      const isSelected = fontFamily === f.id;
                      const isLastOdd = idx === 4;
                      return (
                        <button
                          key={f.id}
                          onClick={() => handleSelectFontFamily(f.id as ReaderFontFamily)}
                          className={`px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer border text-center transition-all truncate ${f.font} ${
                            isLastOdd ? 'col-span-2' : ''
                          } ${
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
            {/* Chapter Text Body */}
            <article
          className={`${tStyles.readerText} ${fontClass} ${
            isJustified ? 'text-justify [text-justify:inter-word]' : 'text-left'
          }`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            textAlign: isJustified ? 'justify' : 'left',
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
            paragraphs.map((para, idx) => (
              <p
                key={idx}
                className={`${
                  paragraphSpacing === 'tight'
                    ? 'mb-1 sm:mb-1.5'
                    : paragraphSpacing === '2-lines'
                    ? 'mb-7 sm:mb-8'
                    : 'mb-3.5 sm:mb-4.5'
                } ${hasIndent ? 'indent-7 sm:indent-8' : ''} whitespace-pre-line`}
              >
                {para}
              </p>
            ))
          ) : (
            <p className="whitespace-pre-line">
              {activeContent || 'Nội dung chương đang được chuẩn bị hoặc trống...'}
            </p>
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
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setShowChapterList(true);
            }}
            className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border text-xs sm:text-sm font-bold cursor-pointer ${tStyles.carouselNavBtn}`}
          >
            Mục Lục ({chapterNumber}/{allChapters.length})
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
            onSubmit={handlePostChapterComment}
            className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-colors ${tStyles.card}`}
          >
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="w-full sm:w-1/3">
                <input
                  type="text"
                  placeholder="Tên của bạn (hoặc để trống là Bạn Đọc)"
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
              <div className={`p-8 text-center rounded-2xl border space-y-2 border-dashed ${tStyles.card}`}>
                <MessageSquare className="w-8 h-8 mx-auto opacity-30" />
                <p className={`text-xs sm:text-sm font-medium ${tStyles.cardAuthor}`}>
                  Chương {chapterNumber} chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nghĩ nhé!
                </p>
              </div>
            ) : (
              displayedComments.map((cm) => (
                <div
                  key={cm.id}
                  className={`p-4 rounded-2xl border space-y-2.5 transition-colors ${tStyles.card}`}
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
                            <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                              Chương {cm.chapterNumber}
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] block ${tStyles.cardAuthor}`}>
                          {normalizeCommentDate(cm.createdAt)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteChapterComment(cm.id)}
                      className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Xóa bình luận"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed pl-10.5 ${
                    isDarkEffective ? 'text-stone-200' : 'text-stone-700'
                  }`}>
                    {cm.content}
                  </p>

                  <div className="flex items-center gap-3 pl-10.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleLikeChapterComment(cm.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${tStyles.cardAuthor} hover:text-purple-500`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{cm.likes || 0} Thích</span>
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
                  className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 transition-colors ${tStyles.card}`}
                >
                  <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
                    <div className="w-full sm:w-1/2">
                      <input
                        type="text"
                        placeholder="Tên của bạn (hoặc để trống là Bạn Đọc)"
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
                    <div className={`p-6 text-center rounded-2xl border space-y-1.5 border-dashed ${tStyles.card}`}>
                      <MessageSquare className="w-6 h-6 mx-auto opacity-30" />
                      <p className={`text-xs font-medium ${tStyles.cardAuthor}`}>
                        Chương {chapterNumber} chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nghĩ nhé!
                      </p>
                    </div>
                  ) : (
                    displayedComments.map((cm) => (
                      <div
                        key={cm.id}
                        className={`p-3.5 rounded-2xl border space-y-2 transition-colors ${tStyles.card}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {cm.avatar && (cm.avatar.startsWith('http://') || cm.avatar.startsWith('https://')) ? (
                              <img
                                src={cm.avatar}
                                alt={cm.author}
                                className="w-7 h-7 rounded-full border object-cover shrink-0"
                              />
                            ) : (
                              <div
                                className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-xs select-none shadow-xs text-white ${getAvatarBgColor(
                                  cm.author
                                )}`}
                              >
                                {(cm.author?.trim().charAt(0) || 'Đ').toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className={`text-xs font-bold truncate block ${tStyles.cardTitle}`}>
                                {cm.author}
                              </span>
                              <span className={`text-[10px] block font-mono ${tStyles.cardAuthor}`}>
                                {normalizeCommentDate(cm.createdAt)}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteChapterComment(cm.id)}
                            className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Xóa bình luận"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className={`text-xs leading-relaxed pl-9 ${
                          isDarkEffective ? 'text-stone-200' : 'text-stone-700'
                        }`}>
                          {cm.content}
                        </p>

                        <div className="flex items-center gap-3 pl-9 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleLikeChapterComment(cm.id)}
                            className={`flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer transition-colors ${tStyles.cardAuthor} hover:text-purple-500`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{cm.likes || 0} Thích</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 18+ Chapter Password Gate Modal (Pop up xác thực mật khẩu chương truyện) */}
      <ChapterPasswordModal
        isOpen={!isChapterUnlocked || showPasswordModal}
        onSuccess={handleUnlockSuccess}
        onCancel={handleCancelPassword}
        isDarkMode={isDarkEffective}
      />
    </div>
  );
};
