import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  BookOpen,
  User,
  ShieldCheck,
  Palette,
  Check,
  LogOut,
  Sun,
  LogIn,
  X,
} from 'lucide-react';
import { Novel } from '../types';
import {
  auth,
  GoogleUserLike,
  getStoredGoogleUser,
  signInWithGoogle,
  signOutGoogleUser,
} from '../services/firebase';
import {
  NovelThemeId,
  NOVEL_THEME_OPTIONS,
  getNovelThemeStyles,
  getRecentUpdatesCardStyles,
} from '../utils/themeStyles';
import { ClayThemeToggle } from './ClayThemeToggle';
import { getRecentReads, RecentReadRecord } from '../utils/recentReads';
import { getDirectImageUrl, handleCoverImageError } from '../utils/imageUtils';
import { safeStorage } from '../utils/safeStorage';
import { cosmicAudio } from '../utils/audioSynth';
import { useHeaderScroll } from '../utils/useHeaderScroll';
import {
  syncUserProfileToD1,
  fetchUserProfileFromD1,
  fetchUserReadingProgressFromD1,
  syncReadingProgressToD1,
} from '../services/d1Service';

export interface UserProfileViewProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onOpenNovelToReadingPosition?: (novel: Novel, chapterNum: number) => void;
  onOpenLibrary?: () => void;
  onBackToNovels: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: (e?: any) => void;
  theme?: string;
  onSelectTheme?: (theme: NovelThemeId) => void;
  isAdmin?: boolean;
}

interface HighlightQuoteItem {
  id: string;
  bookTitle: string;
  chapterInfo: string;
  quoteText: string;
  saveTime: string;
}

interface CommentHistoryItem {
  id: string;
  sourceTitle: string;
  chapterOrTopic: string;
  timeStr: string;
  likesCount?: number;
  quotedText?: string;
  userComment: string;
  authorReply?: {
    authorName?: string;
    replyText: string;
  };
}

// Trích xuất highlight đã lưu thực tế trên thiết bị này, KHỬ TRÙNG LẶP TRIỆT ĐỂ:
// Nếu người dùng thay đổi màu hoặc vệt bút cho cùng một đoạn trích dẫn, CHỈ GIỮ 1 BẢN GHI MỚI NHẤT DUY NHẤT.
function loadDeviceHighlights(novels: Novel[]): HighlightQuoteItem[] {
  const rawList: (HighlightQuoteItem & { timestamp: number })[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cosmo_highlights_')) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const match = key.match(/^cosmo_highlights_(.+)_ch(\d+)$/);
          const novelId = match ? match[1] : '';
          const chapNum = match ? parseInt(match[2], 10) : 1;
          const novel = novels.find((n) => n.id === novelId);
          const bookTitle = novel ? novel.title : (novelId || 'Tiểu Thuyết');
          const chap = novel?.chapters?.find((c) => c.chapterNumber === chapNum);
          const chapterInfo = chap ? chap.title : `Chương ${chapNum}`;

          list.forEach((hl: any, idx: number) => {
            if (hl && hl.selectedText && hl.selectedText.trim()) {
              const d = hl.createdAt ? new Date(hl.createdAt) : new Date();
              const saveTime = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
              rawList.push({
                id: hl.id || `hl-${novelId}-${chapNum}-${idx}`,
                bookTitle,
                chapterInfo,
                quoteText: hl.selectedText.trim(),
                saveTime,
                timestamp: hl.createdAt || Date.now(),
              });
            }
          });
        }
      }
    }
  } catch {}

  // Sắp xếp các highlight theo thời gian mới nhất lên đầu
  rawList.sort((a, b) => b.timestamp - a.timestamp);

  // Khử trùng lặp: Nếu trùng câu trích dẫn (dù đổi màu hay đổi vệt bút), chỉ hiện 1 cái mới nhất duy nhất
  const seenQuotes = new Set<string>();
  const deduped: HighlightQuoteItem[] = [];

  for (const item of rawList) {
    const norm = item.quoteText.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seenQuotes.has(norm)) {
      seenQuotes.add(norm);
      deduped.push({
        id: item.id,
        bookTitle: item.bookTitle,
        chapterInfo: item.chapterInfo,
        quoteText: item.quoteText,
        saveTime: item.saveTime,
      });
    }
  }

  // Nếu thiết bị chưa có highlight nào, kiểm tra bản lưu cache highlight cũ và khử trùng lặp tương tự
  if (deduped.length === 0) {
    try {
      const cached = safeStorage.getItem('cosmo_profile_highlights_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cacheSeen = new Set<string>();
          for (const item of parsed) {
            const text = (item.quoteText || '').trim();
            const norm = text.toLowerCase().replace(/\s+/g, ' ');
            if (text && !cacheSeen.has(norm)) {
              cacheSeen.add(norm);
              deduped.push({
                id: item.id || `hl-${Date.now()}`,
                bookTitle: item.bookTitle || 'Tiểu Thuyết',
                chapterInfo: item.chapterInfo || 'Chương 01',
                quoteText: text,
                saveTime: item.saveTime || 'Mới lưu',
              });
            }
          }
        }
      }
    } catch {}
  }

  return deduped;
}

// Thu thập bình luận thực tế của người dùng đã đăng nhập Google
function loadUserComments(
  user: GoogleUserLike | null,
  userNickname: string,
  novels: Novel[]
): CommentHistoryItem[] {
  const list: CommentHistoryItem[] = [];
  const storedNick = safeStorage.getItem('cosmo_profile_nickname') || '';
  const userNick = (storedNick || userNickname || '').trim().toLowerCase();
  const userGoogleName = (user?.displayName || '').trim().toLowerCase();
  const userEmail = (user?.email || '').trim().toLowerCase();
  const userEmailPrefix = userEmail ? userEmail.split('@')[0] : '';
  const userUid = user?.uid;

  if (!user && !userNick) return [];

  // 1. Quét tất cả bình luận từ safeStorage của từng truyện (dữ liệu D1 mới nhất)
  novels.forEach((n) => {
    let allComments: any[] = n.comments || [];
    try {
      const saved = safeStorage.getItem(`cosmo_novel_comments_${n.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          allComments = parsed;
        }
      }
    } catch {}

    allComments.forEach((c: any) => {
      const cAuthor = (c.author || c.authorName || c.userName || c.user?.name || '').trim().toLowerCase();
      const cEmail = (c.userEmail || c.user?.email || '').trim().toLowerCase();
      const cUid = c.userId || c.user?.id || c.uid;

      const isMatch =
        (userNick && cAuthor === userNick) ||
        (userGoogleName && cAuthor === userGoogleName) ||
        (userEmailPrefix && cAuthor === userEmailPrefix) ||
        (userEmail && cEmail === userEmail) ||
        (userUid && cUid === userUid);

      if (isMatch) {
        if (!list.some((item) => item.id === String(c.id))) {
          list.push({
            id: String(c.id),
            sourceTitle: n.title,
            chapterOrTopic: c.chapterNumber ? `Chương ${c.chapterNumber}` : (c.chapterTitle || 'Bình luận truyện'),
            timeStr: c.createdAt || (c.createdTimestamp ? new Date(c.createdTimestamp).toLocaleDateString('vi-VN') : 'Mới đây'),
            likesCount: c.likes || 0,
            quotedText: c.quotedText || c.quote || undefined,
            userComment: c.content || c.text || '',
            authorReply: c.reply
              ? {
                  authorName: c.reply.authorName || 'Tác giả',
                  replyText: c.reply.content || c.reply.text || c.reply,
                }
              : undefined,
          });
        }
      }
    });
  });

  // 2. Quét bình luận đã lưu trong danh sách bình luận đã gửi của người dùng
  try {
    const raw = safeStorage.getItem('cosmo_user_posted_comments_list');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((c: any) => {
          if (!list.some((item) => item.id === c.id)) {
            list.push(c);
          }
        });
      }
    }
  } catch {}

  return list;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  novels,
  onSelectNovel,
  onOpenNovelToReadingPosition,
  onOpenLibrary,
  onBackToNovels,
  isDarkMode,
  onToggleDarkMode,
  theme = 'slate-haze',
  onSelectTheme,
}) => {
  // Theme resolution
  const activeTheme = (theme || 'slate-haze') as NovelThemeId;
  const isCosmic = activeTheme === 'cosmic';
  const isDarkEffective = isCosmic || isDarkMode;
  const tStyles = useMemo(() => getNovelThemeStyles(activeTheme, isDarkEffective), [activeTheme, isDarkEffective]);
  const recentUpdatesStyles = useMemo(() => getRecentUpdatesCardStyles(activeTheme, isDarkEffective), [activeTheme, isDarkEffective]);

  // Tự động ẩn Header khi lướt xuống, hiện Header khi lướt lên
  const isHeaderVisible = useHeaderScroll({ threshold: 30, delta: 6 });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const shouldShowHeader = isHeaderVisible || isThemeMenuOpen;

  // Google User Auth state
  const [googleUser, setGoogleUser] = useState<GoogleUserLike | null>(() => {
    return (auth?.currentUser as GoogleUserLike | null) || getStoredGoogleUser();
  });
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);
  const [googleLoginError, setGoogleLoginError] = useState<string | null>(null);

  // Custom Nickname (defaults to Google Name or fallback)
  const [nickname, setNickname] = useState<string>(() => {
    const stored = safeStorage.getItem('cosmo_profile_nickname');
    if (stored) return stored;
    const gUser = (auth?.currentUser as GoogleUserLike | null) || getStoredGoogleUser();
    return gUser?.displayName || 'Bạn đọc';
  });

  // Đổi biệt danh trực tiếp ngay tại khung tên (không hiện popup/modal)
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState(nickname);

  // Đồng hồ thời gian thực và lịch mini
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const isNight = currentTime.getHours() >= 18 || currentTime.getHours() < 6;
  const amPm = currentTime.getHours() >= 12 ? 'PM' : 'AM';
  const timeModeLabel = isNight ? `NIGHT · ${amPm}` : `DAY · ${amPm}`;

  // Năm và tháng lịch mini
  const year = currentTime.getFullYear();
  const monthNames = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'];
  const monthStr = monthNames[currentTime.getMonth()] || 'OCT';
  const calendarHeader = `${year} ${monthStr}`;

  // Tạo dải 5 ngày trong tuần hiển thị quanh ngày hôm nay
  const daysWindow = useMemo(() => {
    const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const list = [];
    for (let offset = -1; offset <= 3; offset++) {
      const d = new Date(currentTime);
      d.setDate(d.getDate() + offset);
      list.push({
        label: dayLabels[d.getDay()],
        dateNum: String(d.getDate()).padStart(2, '0'),
        isToday: offset === 0,
      });
    }
    return list;
  }, [currentTime.getDate(), currentTime.getMonth(), currentTime.getFullYear()]);

  // Lắng nghe thay đổi đăng nhập Google
  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<GoogleUserLike | null>;
      const user = customEvent.detail || getStoredGoogleUser();
      setGoogleUser(user);
      if (user?.displayName && !safeStorage.getItem('cosmo_profile_nickname')) {
        setNickname(user.displayName);
      }
    };
    window.addEventListener('cosmo_auth_changed', handleAuthChange);
    return () => {
      window.removeEventListener('cosmo_auth_changed', handleAuthChange);
    };
  }, []);

  // Tự động tải hồ sơ và lịch sử đọc từ Cloudflare D1 (nienthoi-intro-db) khi đăng nhập Google
  useEffect(() => {
    if (!googleUser?.uid) return;

    let isMounted = true;
    (async () => {
      try {
        const localCustomNick = safeStorage.getItem('cosmo_profile_nickname');

        // 1. Tải hồ sơ người dùng từ D1
        const d1Profile = await fetchUserProfileFromD1(googleUser.uid);
        if (isMounted) {
          const finalNick = localCustomNick || d1Profile?.nickname || googleUser.displayName || 'Bạn đọc';
          setNickname(finalNick);
          safeStorage.setItem('cosmo_profile_nickname', finalNick);

          // Đồng bộ lại profile lên D1 với biệt danh hiện tại (giữ nguyên biệt danh custom)
          syncUserProfileToD1({
            userId: googleUser.uid,
            email: googleUser.email || undefined,
            displayName: googleUser.displayName || undefined,
            nickname: finalNick,
            avatarUrl: googleUser.photoURL || undefined,
            themePreference: activeTheme,
          }).catch(() => {});
        }

        // 2. Tải lịch sử đọc truyện từ D1 và đồng bộ vào thiết bị này, đồng thời đẩy lịch sử local lên D1
        const d1Items = await fetchUserReadingProgressFromD1(googleUser.uid);
        if (isMounted) {
          const raw = safeStorage.getItem('cosmo_recent_reads_v2') || safeStorage.getItem('cosmo_recent_reads');
          let localList: RecentReadRecord[] = raw ? JSON.parse(raw) : [];
          let hasChange = false;

          // Đẩy lịch sử local lên D1
          localList.forEach((item) => {
            syncReadingProgressToD1({
              userId: googleUser.uid,
              novelId: item.novelId,
              novelTitle: item.novelId,
              chapterNumber: item.chapterNumber,
              chapterTitle: `Chương ${item.chapterNumber}`,
              progressPercent: item.progressPercent,
              scrollY: item.scrollY,
              updatedAt: item.updatedAt || Date.now(),
            }).catch(() => {});
          });

          // Nạp từ D1 về local
          d1Items.forEach((item) => {
            const existingIdx = localList.findIndex((r) => r.novelId === item.novelId);
            if (existingIdx === -1) {
              localList.push({
                novelId: item.novelId,
                chapterNumber: item.chapterNumber,
                progressPercent: item.progressPercent,
                updatedAt: item.updatedAt || Date.now(),
              });
              hasChange = true;
            } else if ((item.updatedAt || 0) > (localList[existingIdx].updatedAt || 0)) {
              localList[existingIdx] = {
                novelId: item.novelId,
                chapterNumber: item.chapterNumber,
                progressPercent: item.progressPercent,
                updatedAt: item.updatedAt || Date.now(),
              };
              hasChange = true;
            }
          });

          if (hasChange) {
            safeStorage.setItem('cosmo_recent_reads_v2', JSON.stringify(localList));
            window.dispatchEvent(new Event('cosmo_recent_reads_updated'));
          }
        }
      } catch (err) {
        console.warn('Lỗi khi nạp dữ liệu từ D1:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [googleUser?.uid]);

  const handleGoogleLogin = async () => {
    setIsLoggingInGoogle(true);
    setGoogleLoginError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setGoogleUser(user);
        const existingNick = safeStorage.getItem('cosmo_profile_nickname');
        const nickToUse = existingNick || user.displayName || 'Bạn đọc';
        setNickname(nickToUse);
        safeStorage.setItem('cosmo_profile_nickname', nickToUse);
        safeStorage.setItem('cosmo_comment_author_name', nickToUse);

        cosmicAudio.playChime('sparkle');
        showToast(`Đăng nhập thành công! Chào mừng ${user.displayName || 'bạn'}`);

        // Tự động lưu profile lên D1 nienthoi-intro-db
        syncUserProfileToD1({
          userId: user.uid,
          email: user.email || undefined,
          displayName: user.displayName || undefined,
          nickname: nickToUse,
          avatarUrl: user.photoURL || undefined,
          themePreference: activeTheme,
        }).catch(() => {});
      }
    } catch (err: any) {
      console.error('Google Sign-in failed in Profile:', err);
      if (err?.code === 'auth/popup-blocked') {
        setGoogleLoginError('Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng cho phép popup để đăng nhập Google.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setGoogleLoginError('Tên miền ứng dụng chưa được ủy quyền trên Firebase Console.');
      } else {
        setGoogleLoginError(err?.message || 'Không thể đăng nhập Google. Vui lòng thử lại.');
      }
    } finally {
      setIsLoggingInGoogle(false);
    }
  };

  const handleGoogleLogout = async () => {
    await signOutGoogleUser();
    setGoogleUser(null);
    cosmicAudio.playChime('sparkle');
    showToast('Đã đăng xuất tài khoản Google');
  };

  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    const handleDataUpdate = () => {
      setDataVersion((v) => v + 1);
    };
    window.addEventListener('cosmo_recent_reads_updated', handleDataUpdate);
    window.addEventListener('cosmo_comments_updated', handleDataUpdate);
    window.addEventListener('cosmo_nickname_changed', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);
    return () => {
      window.removeEventListener('cosmo_recent_reads_updated', handleDataUpdate);
      window.removeEventListener('cosmo_comments_updated', handleDataUpdate);
      window.removeEventListener('cosmo_nickname_changed', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  const handleSaveNickname = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = tempNickname.trim();
    if (clean) {
      setNickname(clean);
      safeStorage.setItem('cosmo_profile_nickname', clean);
      safeStorage.setItem('cosmo_comment_author_name', clean);
      window.dispatchEvent(new CustomEvent('cosmo_nickname_changed', { detail: clean }));
      showToast('Đã cập nhật biệt danh mới!');

      // Tự động đồng bộ lên Cloudflare D1 (nienthoi-intro-db)
      if (googleUser?.uid) {
        syncUserProfileToD1({
          userId: googleUser.uid,
          email: googleUser.email || undefined,
          displayName: googleUser.displayName || undefined,
          nickname: clean,
          avatarUrl: googleUser.photoURL || undefined,
          themePreference: activeTheme,
        }).catch(() => {});
      }
    }
    setIsEditingNickname(false);
    cosmicAudio.playChime('sparkle');
  };

  // Tabs: 'articles' (Lưu lịch sử đọc) | 'comments' (Lịch sử bình luận) | 'highlights' (Highlight truyện)
  const [activeTab, setActiveTab] = useState<'articles' | 'comments' | 'highlights'>('articles');

  // Lịch sử đọc thực tế của người dùng từ recentReads
  const recentReads = useMemo(() => {
    return getRecentReads(novels);
  }, [novels, dataVersion]);

  // Lấy tối đa 2 bộ gần nhất
  const top2RecentNovels = useMemo(() => {
    return recentReads.slice(0, 2);
  }, [recentReads]);

  // Highlights state: nạp từ thiết bị, khử trùng lặp
  const [highlights] = useState<HighlightQuoteItem[]>(() => {
    return loadDeviceHighlights(novels);
  });

  // Filter for highlights tab
  const [highlightFilter, setHighlightFilter] = useState<string>('ALL');

  const filteredHighlights = useMemo(() => {
    if (highlightFilter === 'ALL') return highlights;
    return highlights.filter((h) => h.bookTitle.includes(highlightFilter) || highlightFilter.includes(h.bookTitle));
  }, [highlights, highlightFilter]);

  // Danh mục tên các bộ truyện có highlight để làm bộ lọc
  const highlightBookTitles = useMemo(() => {
    const set = new Set<string>();
    highlights.forEach((h) => set.add(h.bookTitle));
    return Array.from(set);
  }, [highlights]);

  // Bình luận thực tế của người dùng
  const userComments = useMemo(() => {
    return loadUserComments(googleUser, nickname, novels);
  }, [googleUser, nickname, novels, dataVersion]);

  // Tính các chỉ số thực tế
  const commentsCount = googleUser ? userComments.length : 0;

  const readingHours = useMemo(() => {
    if (recentReads.length === 0) return 0;
    const totalChapters = recentReads.reduce((acc, curr) => acc + curr.record.chapterNumber, 0);
    return Math.max(1, Math.round(totalChapters * 0.35));
  }, [recentReads]);

  const storiesCount = recentReads.length;

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Theme dropdown click outside handler
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    if (isThemeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeMenuOpen]);

  // Màu khối trích dẫn: Chế độ sáng đổi vệt màu trắng ở giữa thành màu đồng nhất với 2 vệt bên
  const quoteCardStyle = useMemo(() => {
    if (!isDarkEffective) {
      if (activeTheme === 'slate-haze') {
        // Frost Light: tone xanh nhạt êm dịu đồng nhất, không có vệt trắng cắt ngang
        return 'bg-[#eef5fc] border border-[#d2e2f2] text-[#244b73] shadow-xs';
      }
      if (activeTheme === 'amethyst-haze') {
        return 'bg-[#f7f2fc] border border-purple-200 text-purple-950 shadow-xs';
      }
      if (activeTheme === 'rosewater') {
        return 'bg-[#fff1f4] border border-rose-200 text-rose-950 shadow-xs';
      }
      if (activeTheme === 'sage') {
        return 'bg-[#f0fbf4] border border-emerald-200 text-emerald-950 shadow-xs';
      }
      return 'bg-[#f4f7fb] border border-slate-200 text-slate-900 shadow-xs';
    } else {
      if (activeTheme === 'slate-haze') {
        return 'bg-[#0f1926]/90 border border-[#3b536e]/50 text-[#c8dceb] shadow-xs';
      }
      if (activeTheme === 'cosmic' || activeTheme === 'amethyst-haze') {
        return 'bg-[#161234]/90 border border-purple-500/35 text-purple-200 shadow-xs';
      }
      if (activeTheme === 'rosewater') {
        return 'bg-[#24131a]/90 border border-rose-500/35 text-rose-200 shadow-xs';
      }
      if (activeTheme === 'sage') {
        return 'bg-[#102217]/90 border border-emerald-500/35 text-emerald-200 shadow-xs';
      }
      return 'bg-white/[0.07] border border-white/20 text-slate-100 shadow-xs';
    }
  }, [activeTheme, isDarkEffective]);

  // Màu số giờ đồng hồ retro theo từng chủ đề
  const clockDigitStyle = useMemo(() => {
    if (!isDarkEffective) {
      return 'bg-white/90 border-black/10 text-zinc-900 shadow-xs';
    }
    switch (activeTheme) {
      case 'slate-haze':
        return 'bg-[#0f1a28] border-sky-400/50 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.25)]';
      case 'amethyst-haze':
      case 'cosmic':
        return 'bg-[#171132] border-purple-400/50 text-purple-200 shadow-[0_0_15px_rgba(192,132,252,0.25)]';
      case 'rosewater':
        return 'bg-[#221018] border-rose-400/50 text-rose-200 shadow-[0_0_15px_rgba(244,114,182,0.25)]';
      case 'sage':
        return 'bg-[#0e2115] border-emerald-400/50 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.25)]';
      default:
        return 'bg-[#101420] border-sky-400/50 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.25)]';
    }
  }, [activeTheme, isDarkEffective]);

  // Màu active state chỗ lịch:
  // - Chế độ sáng: đổi màu giống khối trích dẫn theo đúng yêu cầu người dùng
  // - Chế độ tối: không bị trùng nền, nổi bật, có viền phát sáng nhẹ theo theme
  const calendarActiveDayStyle = useMemo(() => {
    if (!isDarkEffective) {
      switch (activeTheme) {
        case 'slate-haze':
          return 'bg-[#eef5fc] border border-[#d2e2f2] text-[#244b73] shadow-xs font-bold';
        case 'amethyst-haze':
          return 'bg-[#f7f2fc] border border-purple-200 text-purple-950 shadow-xs font-bold';
        case 'rosewater':
        case 'lululemon':
          return 'bg-[#fff1f4] border border-rose-200 text-rose-950 shadow-xs font-bold';
        case 'sage':
          return 'bg-[#f0fbf4] border border-emerald-200 text-emerald-950 shadow-xs font-bold';
        case 'mocha':
          return 'bg-[#fcf8f4] border border-[#e8d7cd] text-[#633b28] shadow-xs font-bold';
        case 'notebook':
        default:
          return 'bg-zinc-100 border border-zinc-300 text-zinc-900 shadow-xs font-bold';
      }
    } else {
      switch (activeTheme) {
        case 'slate-haze':
          return 'bg-sky-500/30 border border-sky-400 text-sky-100 shadow-[0_0_12px_rgba(56,189,248,0.35)] font-bold';
        case 'amethyst-haze':
        case 'cosmic':
          return 'bg-purple-600/40 border border-purple-400 text-purple-100 shadow-[0_0_12px_rgba(168,85,247,0.4)] font-bold';
        case 'rosewater':
        case 'lululemon':
          return 'bg-rose-500/35 border border-rose-400 text-rose-100 shadow-[0_0_12px_rgba(244,114,182,0.35)] font-bold';
        case 'sage':
          return 'bg-emerald-500/35 border border-emerald-400 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.35)] font-bold';
        case 'mocha':
          return 'bg-amber-600/35 border border-amber-400 text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.35)] font-bold';
        case 'notebook':
        default:
          return 'bg-zinc-700/60 border border-zinc-400 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)] font-bold';
      }
    }
  }, [activeTheme, isDarkEffective]);

  // Chế độ tối, theme purple, hồ sơ: đổi màu các nút trong hồ sơ giống màu nút đọc truyện ngay trong trang chủ
  const profileActionButtonClass = useMemo(() => {
    if (isDarkEffective && (activeTheme === 'amethyst-haze' || activeTheme === 'cosmic')) {
      return 'border border-indigo-500/50 bg-gradient-to-r from-[#4d2d78] via-[#5e3793] to-[#7142b0] hover:from-[#573387] hover:to-[#7f4bc7] shadow-lg shadow-black/40 text-white font-bold';
    }
    return `${tStyles.buttonPrimary} shadow-xs font-bold border-transparent`;
  }, [isDarkEffective, activeTheme, tStyles.buttonPrimary]);

  // Màu đường kẻ phân cách đồng bộ và hài hòa với từng chủ đề trong cả chế độ sáng và chế độ tối
  const dividerBorderClass = useMemo(() => {
    if (!isDarkEffective) {
      switch (activeTheme) {
        case 'slate-haze': return 'border-[#d8dfe9]';
        case 'amethyst-haze': return 'border-[#ded8ea]';
        case 'rosewater':
        case 'lululemon': return 'border-[#e4d7db]';
        case 'sage': return 'border-[#cad8c6]';
        case 'mocha': return 'border-[#E4D9BC]';
        case 'notebook': default: return 'border-zinc-200';
      }
    } else {
      switch (activeTheme) {
        case 'slate-haze': return 'border-[#2d435d]/60';
        case 'amethyst-haze':
        case 'cosmic': return 'border-[#5a3f7a]/60';
        case 'rosewater':
        case 'lululemon': return 'border-[#84334b]/50';
        case 'sage': return 'border-[#38533d]/60';
        case 'mocha': return 'border-[#6e4e3d]/60';
        case 'notebook': default: return 'border-zinc-700/60';
      }
    }
  }, [activeTheme, isDarkEffective]);

  const dividerDivideClass = useMemo(() => {
    if (!isDarkEffective) {
      switch (activeTheme) {
        case 'slate-haze': return 'divide-[#d8dfe9]';
        case 'amethyst-haze': return 'divide-[#ded8ea]';
        case 'rosewater':
        case 'lululemon': return 'divide-[#e4d7db]';
        case 'sage': return 'divide-[#cad8c6]';
        case 'mocha': return 'divide-[#E4D9BC]';
        case 'notebook': default: return 'divide-zinc-200';
      }
    } else {
      switch (activeTheme) {
        case 'slate-haze': return 'divide-[#2d435d]/60';
        case 'amethyst-haze':
        case 'cosmic': return 'divide-[#5a3f7a]/60';
        case 'rosewater':
        case 'lululemon': return 'divide-[#84334b]/50';
        case 'sage': return 'divide-[#38533d]/60';
        case 'mocha': return 'divide-[#6e4e3d]/60';
        case 'notebook': default: return 'divide-zinc-700/60';
      }
    }
  }, [activeTheme, isDarkEffective]);

  // Đường viền của các khối bên trong widget: Chế độ tối có viền sáng rõ nét, không bị chìm hay trùng màu nền
  const widgetInnerBlockClass = useMemo(() => {
    if (!isDarkEffective) {
      return 'border border-black/10 bg-black/[0.02]';
    }
    return 'border border-white/25 bg-white/[0.06] shadow-xs';
  }, [isDarkEffective]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${tStyles.pageBg}`}>
      {/* 1. Header Trang Hồ Sơ: Tự động ẩn khi cuộn xuống, hiện khi cuộn lên, ĐÃ BỎ nút toggle riêng lẻ trên header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-[transform,opacity] duration-300 transform ${
          shouldShowHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        } ${tStyles.headerBg} ${tStyles.headerBorder}`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Back button to Home */}
          <button
            type="button"
            onClick={onBackToNovels}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all active:scale-95 ${tStyles.themeSelectorBtn}`}
            title="Quay lại Trang Chủ"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trang Chủ</span>
          </button>

          {/* Right: Theme Selector đồng bộ trang chủ (Chứa nút toggle bên trong bảng chọn) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Google Account quick indicator */}
            {googleUser ? (
              <button
                type="button"
                onClick={handleGoogleLogout}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all ${tStyles.themeSelectorBtn}`}
                title={`Đăng xuất tài khoản ${googleUser.email}`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoggingInGoogle}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold shadow-xs border border-zinc-200 hover:border-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Đăng nhập tài khoản Google"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>
            )}

            {/* Theme Selector Button đồng bộ 100% giống trang chủ */}
            <div className="relative" ref={themeMenuRef}>
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all ${
                  isThemeMenuOpen ? tStyles.buttonPrimary : tStyles.themeSelectorBtn
                }`}
                title="Đổi chủ đề màu sắc"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden md:inline">Giao diện</span>
              </button>

              <AnimatePresence>
                {isThemeMenuOpen && (
                  <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {!isDarkEffective ? (
                      <div
                        className="p-[2.5px] rounded-2xl transition-all duration-300 shadow-xl font-sans"
                        style={recentUpdatesStyles.outerStyle}
                      >
                        <div
                          className="w-56 sm:w-64 p-2.5 rounded-[13.5px] backdrop-blur-xl text-zinc-900 font-sans"
                          style={recentUpdatesStyles.innerStyle}
                        >
                          <div className="px-2 py-1 border-b border-zinc-500/20 flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                            <span>Màu Giao Diện</span>
                            <span className="text-[9px] font-normal normal-case opacity-70">5 Gam Màu</span>
                          </div>
                          <div className="mt-1 space-y-0.5">
                            {NOVEL_THEME_OPTIONS.map((opt) => {
                              const isSelected = activeTheme === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    onSelectTheme?.(opt.id as NovelThemeId);
                                    safeStorage.setItem('cosmo_novel_theme', opt.id);
                                    window.dispatchEvent(new CustomEvent('cosmo_theme_changed', { detail: opt.id }));
                                    setIsThemeMenuOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-zinc-100 text-zinc-900 font-bold ring-1 ring-zinc-300'
                                      : 'hover:bg-zinc-50/80 text-zinc-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center -space-x-1 shrink-0">
                                      {opt.dots.map((d, i) => (
                                        <span
                                          key={i}
                                          className="w-3 h-3 rounded-full border border-black/20 shadow-xs"
                                          style={{ backgroundColor: d }}
                                        />
                                      ))}
                                    </div>
                                    <div className="font-semibold text-[11px] sm:text-xs">
                                      <span>{opt.name}</span>
                                    </div>
                                  </div>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                                </button>
                              );
                            })}
                          </div>

                          {/* Toggle chuyển chế độ tối dưới cùng bảng chọn */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              cosmicAudio.playChime('sparkle');
                              onToggleDarkMode(e);
                            }}
                            className="mt-2 pt-2 border-t border-zinc-500/20 flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-black/5 rounded-lg transition-colors select-none"
                            title="Nhấp để chuyển sang chế độ tối"
                          >
                            <span className="text-xs font-semibold select-none cursor-pointer">
                              Chế độ tối
                            </span>
                            <ClayThemeToggle
                              id="clay-toggle-profile-menu-light"
                              isOn={isDarkEffective}
                              onToggle={(e?: any) => onToggleDarkMode(e)}
                              theme={activeTheme}
                              title="Gạt để chuyển sang chế độ tối"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-56 sm:w-64 p-2.5 rounded-2xl text-zinc-100 shadow-2xl border border-white/20 opacity-100 font-sans"
                        style={{ backgroundColor: '#0a0d14', background: '#0a0d14' }}
                      >
                        <div className="px-2 py-1 border-b border-zinc-500/20 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          <span>Màu Giao Diện</span>
                          <span className="text-[9px] font-normal normal-case opacity-70">5 Gam Màu</span>
                        </div>
                        <div className="mt-1 space-y-0.5">
                          {NOVEL_THEME_OPTIONS.map((opt) => {
                            const isSelected = activeTheme === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  onSelectTheme?.(opt.id as NovelThemeId);
                                  safeStorage.setItem('cosmo_novel_theme', opt.id);
                                  window.dispatchEvent(new CustomEvent('cosmo_theme_changed', { detail: opt.id }));
                                  setIsThemeMenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-zinc-800 text-white font-bold'
                                    : 'hover:bg-zinc-800/60 text-zinc-300'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center -space-x-1 shrink-0">
                                    {opt.dots.map((d, i) => (
                                      <span
                                        key={i}
                                        className="w-3 h-3 rounded-full border border-black/20 shadow-xs"
                                        style={{ backgroundColor: d }}
                                      />
                                    ))}
                                  </div>
                                  <div className="font-semibold text-[11px] sm:text-xs">
                                    <span>{opt.name}</span>
                                  </div>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Toggle chuyển chế độ tối dưới cùng bảng chọn */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            cosmicAudio.playChime('sparkle');
                            onToggleDarkMode(e);
                          }}
                          className="mt-2 pt-2 border-t border-zinc-500/20 flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-white/5 rounded-lg transition-colors select-none"
                          title="Nhấp để chuyển sang chế độ sáng"
                        >
                          <span className="text-xs font-semibold select-none cursor-pointer">
                            Chế độ tối
                          </span>
                          <ClayThemeToggle
                            id="clay-toggle-profile-menu-dark"
                            isOn={isDarkEffective}
                            onToggle={(e?: any) => onToggleDarkMode(e)}
                            theme={activeTheme}
                            title="Gạt để chuyển sang chế độ sáng"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pt-24 pb-8 space-y-6">
        {/* Toast Alert Feedback */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-zinc-900 text-white text-xs shadow-xl flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Top Profile Header: PROFILE / FORUM ID + User Info */}
        <section className="space-y-4 pt-2">
          <div className="text-[11px] font-mono tracking-widest uppercase opacity-60">
            PROFILE / FORUM ID
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar tròn với viền thanh mảnh */}
            <div className="relative shrink-0">
              {googleUser?.photoURL ? (
                <img
                  src={googleUser.photoURL}
                  alt={nickname}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-black/10 dark:border-white/20 shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-black/15 dark:border-white/20 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shadow-xs">
                  <User className="w-8 h-8 opacity-60" />
                </div>
              )}
            </div>

            {/* Name & Title & Inline Name Editing (Đổi biệt danh trực tiếp, KHÔNG hiện popup) */}
            <div className="space-y-1.5 flex-1 min-w-0">
              {isEditingNickname ? (
                <form onSubmit={handleSaveNickname} className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={tempNickname}
                    onChange={(e) => setTempNickname(e.target.value)}
                    className={`px-3 py-1 rounded-xl border text-base sm:text-lg font-serif font-bold outline-hidden ${tStyles.input}`}
                    autoFocus
                    placeholder="Nhập biệt danh mới..."
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="submit"
                      className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer shadow-xs ${profileActionButtonClass}`}
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingNickname(false)}
                      className="p-1 rounded-xl border border-black/15 dark:border-white/25 text-xs cursor-pointer opacity-70 hover:opacity-100"
                      title="Hủy đổi biệt danh"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                    {googleUser ? (nickname || googleUser.displayName || 'Bạn đọc') : 'Khách ghé thăm'}
                  </h1>

                  {/* Nút Đổi biệt danh (khi đã đăng nhập) - viền sáng rõ nét, không bị chìm ở chế độ tối */}
                  {googleUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setTempNickname(nickname);
                        setIsEditingNickname(true);
                      }}
                      className="px-2.5 py-0.5 rounded-full border border-black/20 dark:border-white/35 text-zinc-700 dark:text-zinc-100 dark:bg-white/10 dark:hover:bg-white/20 text-[11px] font-medium hover:bg-black/5 cursor-pointer transition-all shadow-xs"
                    >
                      Đổi biệt danh
                    </button>
                  )}

                  {googleUser && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Đã liên kết Google</span>
                    </span>
                  )}
                </div>
              )}

              {/* Nếu chưa đăng nhập: Nút đăng nhập Google to rõ ràng */}
              {!googleUser && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoggingInGoogle}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-bold shadow-xs border border-zinc-200 hover:border-zinc-300 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isLoggingInGoogle ? 'Đang kết nối...' : 'Đăng nhập bằng Google'}</span>
                  </button>
                  {googleLoginError && (
                    <p className="text-[11px] text-rose-500 mt-1">{googleLoginError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. Stats Row: COMMENTS (Bình luận) / HOURS (Giờ đọc) / STORIES (Truyện đã đọc) - Đường viền đồng điệu theo theme */}
        <section className={`border-y py-4 transition-colors ${dividerBorderClass}`}>
          <div className={`grid grid-cols-3 text-center divide-x ${dividerDivideClass}`}>
            <div className="px-2">
              <div className="text-xl sm:text-2xl font-serif font-bold">{commentsCount}</div>
              <div className="text-[10px] font-bold tracking-wider uppercase opacity-80 mt-0.5">COMMENTS</div>
              <div className="text-[10px] opacity-60">Bình luận</div>
            </div>

            <div className="px-2">
              <div className="text-xl sm:text-2xl font-serif font-bold">{readingHours}</div>
              <div className="text-[10px] font-bold tracking-wider uppercase opacity-80 mt-0.5">HOURS</div>
              <div className="text-[10px] opacity-60">Giờ đọc</div>
            </div>

            <div className="px-2">
              <div className="text-xl sm:text-2xl font-serif font-bold">{storiesCount}</div>
              <div className="text-[10px] font-bold tracking-wider uppercase opacity-80 mt-0.5">STORIES</div>
              <div className="text-[10px] opacity-60">Truyện đã đọc</div>
            </div>
          </div>
        </section>

        {/* 4. Cụm Widget 1: Trình bày như ảnh, KHÔNG XUỐNG DÒNG trên mobile, BỎ dấu chấm tròn ở day pm, số giờ hợp theme, ONLINE nổi bật */}
        <section className={`p-3 sm:p-5 rounded-3xl border transition-all ${tStyles.card} relative overflow-hidden`}>
          <div className="flex flex-row items-stretch gap-2.5 sm:gap-4 w-full">
            {/* Left: Đồng hồ điện tử retro (đổi màu số giờ hợp theme, huy hiệu ONLINE phát sáng, không chấm tròn ở day/pm) */}
            <div className="w-[38%] min-w-[125px] sm:w-[40%] p-2.5 sm:p-4 rounded-2xl border border-black/10 dark:border-white/25 bg-black/[0.03] dark:bg-black/60 shadow-xs flex flex-col items-center justify-between text-center space-y-2 shrink-0">
              {/* BỎ dấu chấm tròn ở DAY PM theo đúng yêu cầu */}
              <div className="text-[9px] sm:text-[10px] font-mono tracking-wider opacity-80">
                <span className="font-semibold tracking-wider">{timeModeLabel}</span>
              </div>

              {/* Hiển thị số giờ phút rõ ràng và đổi màu hợp chuẩn Theme trong cả chế độ sáng và chế độ tối */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 font-mono text-xl sm:text-3xl font-bold tracking-wider w-full">
                <span className={`flex-1 py-1 sm:py-1.5 rounded-xl border text-center transition-all ${clockDigitStyle}`}>
                  {hours}
                </span>
                <span className="opacity-60 dark:text-sky-300 animate-pulse">:</span>
                <span className={`flex-1 py-1 sm:py-1.5 rounded-xl border text-center transition-all ${clockDigitStyle}`}>
                  {minutes}
                </span>
              </div>

              {/* Huy hiệu ONLINE rõ nét, không bị chìm trong nền ở chế độ tối */}
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full border border-black/15 dark:border-emerald-400/50 bg-black/[0.02] dark:bg-emerald-500/20 text-[8.5px] sm:text-[10px] font-mono text-zinc-700 dark:text-emerald-300 font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Right: Stacked Mini Calendar + Lời chúc */}
            <div className="flex-1 min-w-0 flex flex-col justify-between gap-2 sm:gap-3">
              {/* Mini Calendar Card: đường viền rõ nét ở chế độ tối */}
              <div className={`p-2 sm:p-3 rounded-2xl space-y-1.5 ${widgetInnerBlockClass}`}>
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono opacity-80 px-0.5">
                  <span className="font-bold tracking-wider">{calendarHeader}</span>
                  <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70" />
                </div>

                {/* Days Row: Active state đổi màu giống khối trích dẫn ở light mode, sáng rõ nổi bật ở dark mode */}
                <div className="grid grid-cols-5 gap-1 text-center">
                  {daysWindow.map((day, i) => (
                    <div
                      key={i}
                      className={`p-1 sm:p-2 rounded-xl transition-all ${
                        day.isToday
                          ? calendarActiveDayStyle
                          : 'border border-black/10 dark:border-white/20 dark:bg-white/[0.03] opacity-75'
                      }`}
                    >
                      <div className="text-[7.5px] sm:text-[9px] font-mono uppercase">{day.label}</div>
                      <div className="text-xs sm:text-sm font-bold">{day.dateNum}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Greeting Box: đường viền rõ nét ở chế độ tối */}
              <div className={`p-2 sm:p-3 rounded-2xl flex items-center justify-between gap-2 ${widgetInnerBlockClass}`}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-75" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-[11px] sm:text-sm font-bold truncate">
                      Chào mừng bạn ghé thăm
                    </div>
                    <div className="text-[9.5px] sm:text-xs opacity-70 truncate">
                      Chúc bạn có một ngày vui vẻ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Navigation Tabs Bar: Màu nút tab hợp theme */}
        <section className="pt-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 cursor-pointer transition-all ${
                activeTab === 'articles'
                  ? profileActionButtonClass
                  : `${tStyles.themeSelectorBtn} opacity-75 hover:opacity-100`
              }`}
            >
              Lưu lịch sử đọc
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'comments'
                  ? profileActionButtonClass
                  : `${tStyles.themeSelectorBtn} opacity-75 hover:opacity-100`
              }`}
            >
              <span>Lịch sử bình luận ({commentsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('highlights')}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'highlights'
                  ? profileActionButtonClass
                  : `${tStyles.themeSelectorBtn} opacity-75 hover:opacity-100`
              }`}
            >
              <span>Highlight truyện ({highlights.length})</span>
            </button>
          </div>
        </section>

        {/* 6. TAB 1: LƯU LỊCH SỬ ĐỌC (READING HISTORY - Bỏ viền trắng nút Đến Thư Viện, font Open Sans cho đang đọc/tiến độ) */}
        {activeTab === 'articles' && (
          <section className="space-y-6 pt-2">
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase opacity-60">
                READING HISTORY
              </div>
              <div className={`flex items-baseline justify-between border-b pb-1 mt-1 ${dividerBorderClass}`}>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                  Lưu trữ
                </h2>
                <span className="text-2xl sm:text-3xl font-serif italic font-bold opacity-40">
                  {String(top2RecentNovels.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Danh sách 2 bộ gần nhất */}
            <div className="space-y-4">
              {top2RecentNovels.length > 0 ? (
                top2RecentNovels.map((item, idx) => {
                  const novel = item.novel;
                  const rec = item.record;
                  const coverUrl = getDirectImageUrl(novel.coverImage, novel.id || novel.title);
                  return (
                    <div
                      key={novel.id}
                      onClick={() => {
                        if (onOpenNovelToReadingPosition) {
                          onOpenNovelToReadingPosition(novel, rec.chapterNumber);
                        } else {
                          onSelectNovel(novel);
                        }
                      }}
                      className="flex gap-3 sm:gap-5 group p-3 sm:p-4 rounded-2xl border border-black/10 dark:border-white/20 hover:border-purple-500/50 cursor-pointer transition-all items-center"
                    >
                      <div className="text-xl sm:text-3xl font-serif italic font-bold opacity-30 select-none pt-0.5 w-6 sm:w-8 shrink-0 text-right">
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      <img
                        src={coverUrl}
                        alt={novel.title}
                        onError={(e) => handleCoverImageError(e, novel.id || novel.title)}
                        className="w-12 h-16 sm:w-16 sm:h-22 rounded-xl object-cover shrink-0 border border-black/10 dark:border-white/10 shadow-xs"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="text-xs sm:text-sm font-bold truncate group-hover:text-purple-500 transition-colors">
                          《{novel.title}》
                        </h3>

                        <p className="text-[10px] sm:text-[11px] opacity-70 truncate font-['Open_Sans',sans-serif]">
                          Tác giả: {typeof novel.author === 'string' ? novel.author : (novel.author?.name || 'Đang cập nhật')}
                        </p>

                        {/* Phông chữ Open Sans cho đang đọc và tiến độ, kích cỡ nhỏ gọn */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[9.5px] sm:text-xs opacity-75 font-['Open_Sans',sans-serif]">
                          <span>Đang đọc: Chương {rec.chapterNumber}</span>
                          <span>•</span>
                          <span>Tiến độ: {rec.progressPercent}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-black/15 dark:border-white/20 text-center space-y-2 opacity-75">
                  <BookOpen className="w-8 h-8 mx-auto opacity-50" />
                  <p className="text-xs">Chưa có lịch sử đọc trên thiết bị này.</p>
                </div>
              )}
            </div>

            {/* Nút bấm dẫn đến thư viện - ĐÃ BỎ ĐƯỜNG VIỀN TRẮNG theo yêu cầu người dùng */}
            <div className="pt-2 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => {
                  if (onOpenLibrary) {
                    onOpenLibrary();
                  } else {
                    onBackToNovels();
                  }
                }}
                className={`px-5 py-2.5 rounded-2xl border-0 border-transparent text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${profileActionButtonClass}`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Đến Thư Viện</span>
              </button>
            </div>
          </section>
        )}

        {/* 7. TAB 2: LỊCH SỬ BÌNH LUẬN (COMMENT HISTORY) */}
        {activeTab === 'comments' && (
          <section className="space-y-6 pt-2">
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase opacity-60">
                COMMENT HISTORY
              </div>
              <div className={`flex items-baseline justify-between border-b pb-1 mt-1 ${dividerBorderClass}`}>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                  Lịch sử bình luận
                </h2>
                <span className="text-2xl sm:text-3xl font-serif italic font-bold opacity-40">
                  {String(commentsCount).padStart(2, '0')}
                </span>
              </div>
              <div className="text-xs opacity-70 mt-2">
                Ghi lại các bình luận và trả lời
              </div>
            </div>

            {/* Nếu chưa đăng nhập: Cập nhật dòng chữ theo đúng yêu cầu người dùng */}
            {!googleUser ? (
              <div className="p-8 rounded-2xl border border-dashed border-black/15 dark:border-white/20 text-center space-y-3">
                <User className="w-10 h-10 mx-auto opacity-40" />
                <h3 className="text-sm font-bold">Chưa Đăng Nhập Google</h3>
                <p className="text-xs opacity-70 max-w-md mx-auto">
                  Vui lòng đăng nhập bằng tài khoản Google để xem lịch sử bình luận và các phản hồi bình luận.
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoggingInGoogle}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-bold shadow-xs border border-zinc-200 hover:border-zinc-300 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng nhập Google ngay</span>
                  </button>
                </div>
              </div>
            ) : userComments.length === 0 ? (
              /* Đã đăng nhập nhưng chưa có bình luận nào */
              <div className="p-8 rounded-2xl border border-dashed border-black/15 dark:border-white/20 text-center space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 opacity-50" />
                </div>
                <h3 className="text-sm font-bold">Chưa có bình luận nào</h3>
                <p className="text-xs opacity-70 max-w-md mx-auto">
                  Bạn chưa gửi bình luận nào. Hãy ghé thăm các chương truyện và để lại cảm nhận của bạn nhé!
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={onBackToNovels}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${tStyles.buttonPrimary}`}
                  >
                    Khám phá truyện ngay
                  </button>
                </div>
              </div>
            ) : (
              /* Danh sách bình luận thực tế của người dùng */
              <div className="space-y-6">
                {userComments.map((cmt, idx) => (
                  <div key={cmt.id} className="flex gap-4 sm:gap-6 group">
                    {/* Big Italic Number 01, 02 */}
                    <div className="text-2xl sm:text-3xl font-serif italic font-bold opacity-30 select-none pt-0.5 w-8 shrink-0 text-right">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* Comment Details */}
                    <div className="flex-1 space-y-2.5 min-w-0">
                      {/* Header line: Book/Topic + Chapter + Time */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 opacity-80 flex-wrap">
                          <span className="font-bold">《{cmt.sourceTitle}》</span>
                          <span className="opacity-50">·</span>
                          <span>{cmt.chapterOrTopic}</span>
                          <span className="opacity-50">·</span>
                          <span className="font-mono text-[11px] opacity-70">{cmt.timeStr}</span>
                        </div>
                      </div>

                      {/* Quoted text if available */}
                      {cmt.quotedText && (
                        <div className="p-3 rounded-xl border border-black/10 dark:border-white/20 bg-black/3 dark:bg-white/5 font-serif italic text-xs leading-relaxed opacity-90">
                          “ {cmt.quotedText} ”
                        </div>
                      )}

                      {/* User Comment Body */}
                      <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                        {cmt.userComment}
                      </p>

                      {/* Author Reply Box (Phản hồi) */}
                      {cmt.authorReply && (
                        <div className="mt-2 p-3 rounded-xl border border-black/10 dark:border-white/20 bg-black/2 dark:bg-white/5 space-y-1 text-xs">
                          <div className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                            <span>↳</span>
                            <span>Phản hồi:</span>
                          </div>
                          <p className="font-serif italic pl-4 opacity-85">
                            {cmt.authorReply.replyText}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 8. TAB 3: HIGHLIGHT TRUYỆN (Đã khử trùng lặp, khối trích dẫn đổi vệt màu trắng ở giữa thành màu đồng nhất theo theme) */}
        {activeTab === 'highlights' && (
          <section className="space-y-6 pt-2">
            <div>
              <div className={`flex items-baseline justify-between border-b pb-1 ${dividerBorderClass}`}>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                  Highlight truyện
                </h2>
                <span className="text-2xl sm:text-3xl font-serif italic font-bold opacity-40">
                  {String(filteredHighlights.length).padStart(2, '0')}
                </span>
              </div>
              <div className="text-[11px] opacity-60 mt-1.5 italic">
                Chỉ lưu duy nhất trên thiết bị
              </div>

              {/* Filter category pills */}
              {highlightBookTitles.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setHighlightFilter('ALL')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                      highlightFilter === 'ALL'
                        ? profileActionButtonClass
                        : `${tStyles.themeSelectorBtn} opacity-75 hover:opacity-100`
                    }`}
                  >
                    Tất cả ({highlights.length})
                  </button>

                  {highlightBookTitles.map((title) => (
                    <button
                      key={title}
                      type="button"
                      onClick={() => setHighlightFilter(title)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                        highlightFilter === title
                          ? profileActionButtonClass
                          : `${tStyles.themeSelectorBtn} opacity-75 hover:opacity-100`
                      }`}
                    >
                      《{title}》
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Highlights List: Khối trích dẫn đồng nhất màu sắc, không có vệt trắng ở giữa trong chế độ sáng */}
            {filteredHighlights.length > 0 ? (
              <div className="space-y-6">
                {filteredHighlights.map((hl, idx) => (
                  <div key={hl.id} className="flex gap-4 sm:gap-6 group">
                    {/* Big Italic Number 01, 02, 03... */}
                    <div className="text-2xl sm:text-3xl font-serif italic font-bold opacity-30 select-none pt-0.5 w-8 shrink-0 text-right">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* Highlight Quote Content */}
                    <div className="flex-1 space-y-2.5 min-w-0">
                      {/* Header line: Title + Chapter */}
                      <div className="flex items-center gap-1.5 opacity-80 flex-wrap text-xs">
                        <span className="font-bold">《{hl.bookTitle}》</span>
                        <span className="opacity-50">·</span>
                        <span>{hl.chapterInfo}</span>
                      </div>

                      {/* Khối trích dẫn màu đồng nhất êm dịu, không có vệt trắng ở giữa */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl font-serif italic text-xs sm:text-sm leading-relaxed transition-all ${quoteCardStyle}`}
                      >
                        “ {hl.quoteText} ”
                      </div>

                      {/* Save Time */}
                      <div className="font-mono text-[10px] opacity-60">
                        Thời gian lưu: {hl.saveTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-black/15 dark:border-white/20 text-center space-y-2 opacity-75">
                <BookOpen className="w-8 h-8 mx-auto opacity-50" />
                <p className="text-xs">
                  Chưa có đoạn highlight nào được lưu trên thiết bị này. Bạn có thể sử dụng bút dạ quang khi đọc truyện để lưu giữ các câu văn yêu thích.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};
