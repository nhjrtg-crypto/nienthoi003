import React, { useState, useMemo, useEffect } from 'react';
import {
  Folder,
  Search,
  Star,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  MessageSquare,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react';
import { getBinderTheme } from '../utils/binderThemeConfig';

export interface NovelChapter {
  id: string;
  chapterNumber: number;
  title: string;
  publishedAt?: string;
  isExtra?: boolean;
}

export interface NovelComment {
  id: string;
  userName?: string;
  author?: string;
  content: string;
  createdAt: string;
  likes?: number;
}

export interface NovelData {
  id: string;
  title: string;
  author: { name: string };
  translator?: string;
  coverImage: string;
  genres: string[];
  status?: string;
  synopsis: string;
  worldLore?: string;
  uploaderNote?: string;
  chapters: NovelChapter[];
}

export interface NovelDiaryBinderViewProps {
  novel: NovelData;
  onReadChapter: (chapterNumber: number) => void;
  isDarkMode?: boolean;
  comments?: NovelComment[];
  onAddComment?: (content: string) => void;
  onPostComment?: (author: string, content: string) => void;
  theme?: string;
}

export const HEART_COLOR_PALETTES = [
  { name: 'Sky Lam Pastel', stop1: '#f0f8ff', stop2: '#bae0fd', stop3: '#60a5fa' },
  { name: 'Lavender Oải Hương', stop1: '#faf7fd', stop2: '#e5d8f3', stop3: '#baa4db' },
  { name: 'Sakura Hồng Phấn', stop1: '#fdf2f8', stop2: '#fbcfe8', stop3: '#f472b6' },
  { name: 'Linen Cát Ấm', stop1: '#fcf9f6', stop2: '#ede3da', stop3: '#c2b0a2' },
  { name: 'Sage Bạc Hà', stop1: '#f7faf8', stop2: '#dceee2', stop3: '#9ec2a8' },
  { name: 'Vanilla Kem Bơ', stop1: '#fffbeb', stop2: '#fef3c7', stop3: '#fcd34d' },
  { name: 'Berry Dâu Rừng', stop1: '#fff1f2', stop2: '#fecdd3', stop3: '#fb7185' },
  { name: 'Ocean Biển Sâu', stop1: '#e0f2fe', stop2: '#bae6fd', stop3: '#38bdf8' },
];

export const SEARCH_STAR_COLORS = [
  { name: 'Lam Pastel', fill: '#93c5fd' },
  { name: 'Linen Kem Mộc', fill: '#ded2c7' },
  { name: 'Tím Oải Hương', fill: '#dfd2f2' },
  { name: 'Hồng Sakura', fill: '#fbcfe8' },
  { name: 'Sage Bạc Hà', fill: '#cce0d2' },
];

export const NovelDiaryBinderView: React.FC<NovelDiaryBinderViewProps> = ({
  novel,
  onReadChapter,
  isDarkMode = false,
  comments: propComments,
  onPostComment: propOnPostComment,
  theme = 'slate-haze',
}) => {
  const bTheme = useMemo(() => getBinderTheme(theme), [theme]);
  // Kiểu cuốn sổ bỏ chế độ tối, luôn hiển thị chế độ sáng thuần túy
  const isDarkModeEffective = false;

  const [diaryTab, setDiaryTab] = useState<'home' | 'diary' | 'chapters' | 'guestbook'>('home');
  const [heartColorIdx, setHeartColorIdx] = useState(() => bTheme.defaultHeartIdx ?? 0);
  const [searchStarColorIdx, setSearchStarColorIdx] = useState(() => bTheme.defaultStarIdx ?? 0);

  useEffect(() => {
    setHeartColorIdx(bTheme.defaultHeartIdx ?? 0);
    setSearchStarColorIdx(bTheme.defaultStarIdx ?? 0);
  }, [theme, bTheme]);

  // Thông báo hướng dẫn đọc
  const [showGuideNotice, setShowGuideNotice] = useState<boolean>(() => {
    try {
      return localStorage.getItem('binder_guide_dismissed_v2') !== 'true';
    } catch {
      return true;
    }
  });

  const handleDismissGuide = () => {
    setShowGuideNotice(false);
    try {
      localStorage.setItem('binder_guide_dismissed_v2', 'true');
    } catch {}
  };

  // Trình phát nhạc Audio BGM Sugar Love Vinyl
  const ambientTracks = useMemo(() => [
    { title: 'Melody of Us ♡', artist: 'Sugar Love Acoustic' },
    { title: 'Sweet Cloud Pastel', artist: 'Lofi Piano Chill' },
    { title: 'Warm Tea Afternoon', artist: 'Acoustic Guitar' },
  ], []);

  const [activeAudioIndex, setActiveAudioIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  const handlePrevTrack = () => {
    setActiveAudioIndex((prev) => (prev > 0 ? prev - 1 : ambientTracks.length - 1));
  };

  const handleNextTrack = () => {
    setActiveAudioIndex((prev) => (prev < ambientTracks.length - 1 ? prev + 1 : 0));
  };

  const toggleAudio = () => {
    setIsPlayingAudio((prev) => !prev);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleVolumeChange = (val: number) => {
    setAudioVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleCycleHeartColor = () => {
    setHeartColorIdx((prev) => (prev + 1) % HEART_COLOR_PALETTES.length);
  };

  const dDayNumber = useMemo(() => {
    return novel.chapters.length > 0 ? novel.chapters.length * 3 + 12 : 36;
  }, [novel.chapters.length]);

  const readingChapter = 1;

  // Phân trang mục lục chương
  const [currentPage, setCurrentPage] = useState(1);
  const CHAPTERS_PER_PAGE = 12;
  const totalPages = Math.ceil(novel.chapters.length / CHAPTERS_PER_PAGE) || 1;
  const paginatedChapters = useMemo(() => {
    const start = (currentPage - 1) * CHAPTERS_PER_PAGE;
    return novel.chapters.slice(start, start + CHAPTERS_PER_PAGE);
  }, [novel.chapters, currentPage]);

  const isExtra = (chap: NovelChapter) => {
    return !!chap.isExtra || /ngoại truyện|phiên ngoại/i.test(chap.title);
  };

  // Bình luận người dùng
  const [localComments, setLocalComments] = useState<NovelComment[]>([]);
  const [userName, setUserName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const comments = propComments && propComments.length > 0 ? propComments : localComments;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const authorName = userName.trim() || 'Độc giả mến thương';
    if (propOnPostComment) {
      propOnPostComment(authorName, newCommentText.trim());
    } else {
      const newC: NovelComment = {
        id: Date.now().toString(),
        author: authorName,
        userName: authorName,
        content: newCommentText.trim(),
        createdAt: 'Vừa xong',
        likes: 0,
      };
      setLocalComments([newC, ...localComments]);
    }
    setNewCommentText('');
  };

  return (
    <div className="w-full flex flex-col items-center select-none font-sans relative">
      {/* 1. CÁC QUẦNG SÁNG MÂY LOANG MỜ Ở NỀN TRANG (AMBIENT GLOWS THEO THEME) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full blur-[100px] ${bTheme.glowTopLeft}`}
        />
        <div
          className={`absolute top-1/4 -right-32 w-[36rem] h-[36rem] rounded-full blur-[110px] ${bTheme.glowBottomRight}`}
        />
      </div>

      {/* 2. TOAST HƯỚNG DẪN ĐỌC */}
      {showGuideNotice && (
        <div className="fixed bottom-5 right-4 sm:right-6 max-w-[calc(100vw-2rem)] sm:max-w-md z-50">
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 ${bTheme.noticeBg} ${bTheme.noticeBorder} ${bTheme.noticeText}`}
            style={{ boxShadow: bTheme.noticeShadow }}
          >
            <p className="text-xs sm:text-[13px] leading-relaxed text-center sm:text-left">
              Để xem tiếp các nội dung như <strong className={bTheme.noticeHighlight}>Giới thiệu truyện</strong>, <strong className={bTheme.noticeHighlight}>Mục lục chương</strong> hay <strong className={bTheme.noticeHighlight}>Bình luận</strong>, bạn hãy bấm vào các nút tương ứng trong bảng <strong className="underline">DANH MỤC</strong> nhé!
            </p>
            <button
              onClick={handleDismissGuide}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold active:scale-95 ${bTheme.noticeBtnText} cursor-pointer`}
              style={bTheme.btnClayPrimary}
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* 3. VÙNG CUỐN SỔ CÒNG CHÍNH */}
      <div className="relative w-full max-w-5xl lg:max-w-6xl xl:max-w-[1250px] mx-auto pt-7 sm:pt-9">
        
        {/* ======================================================== */}
        {/* TAI MÈO 3D BẦU BĨNH CLAYMORPHISM CÓ HIỆU ỨNG VẪY GIẬT TAI */}
        {/* ======================================================== */}
        <div className="absolute -top-2 sm:-top-4 left-1/2 -translate-x-1/2 flex items-end justify-center gap-16 sm:gap-26 lg:gap-36 pointer-events-none z-0">
          {/* TAI TRÁI */}
          <div className="relative w-28 h-22 sm:w-36 sm:h-28 lg:w-44 lg:h-34 clay-glass-cat-ear animate-cat-ear-left">
            <svg viewBox="0 0 130 95" className="w-full h-full" fill="none">
              <defs>
                <linearGradient id={`catEarOuter_${theme}`} x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor={bTheme.catEarOuter.stop0} />
                  <stop offset="35%" stopColor={bTheme.catEarOuter.stop35} />
                  <stop offset="70%" stopColor={bTheme.catEarOuter.stop70} />
                  <stop offset="100%" stopColor={bTheme.catEarOuter.stop100} />
                </linearGradient>
                <linearGradient id={`catEarInner_${theme}`} x1="30%" y1="0%" x2="70%" y2="100%">
                  <stop offset="0%" stopColor={bTheme.catEarInner.stop0} />
                  <stop offset="50%" stopColor={bTheme.catEarInner.stop50} />
                  <stop offset="100%" stopColor={bTheme.catEarInner.stop100} />
                </linearGradient>
              </defs>
              <path
                d="M 8 90 C 12 55, 30 20, 56 10 C 64 6, 76 6, 84 10 C 106 20, 122 55, 124 90 C 114 94, 96 88, 66 88 C 36 88, 18 94, 8 90 Z"
                fill={`url(#catEarOuter_${theme})`}
                stroke="rgba(255, 255, 255, 0.95)"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path
                d="M 24 84 C 28 58, 42 30, 60 22 C 66 19, 74 19, 80 22 C 96 30, 106 58, 108 84 C 98 86, 84 82, 66 82 C 48 82, 34 86, 24 84 Z"
                fill={`url(#catEarInner_${theme})`}
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <ellipse cx="54" cy="32" rx="4.5" ry="11" transform="rotate(-20 54 32)" fill="white" opacity="0.85" />
              <circle cx="72" cy="24" r="3.2" fill="white" opacity="0.75" />
            </svg>
          </div>

          {/* HUY HIỆU NƠ TRUNG TÂM GIỮA 2 TAI */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
            <div
              className={`px-3.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-serif tracking-wider ${bTheme.ribbonText}`}
              style={bTheme.btnClayPill}
            >
              <span className={bTheme.ribbonIcon}>ʚĭɞ</span>
              <span className="font-semibold">Sugar Binder Diary ♡</span>
              <span className={bTheme.ribbonIcon}>୨୧</span>
            </div>
          </div>

          {/* TAI PHẢI */}
          <div className="relative w-28 h-22 sm:w-36 sm:h-28 lg:w-44 lg:h-34 clay-glass-cat-ear animate-cat-ear-right">
            <svg viewBox="0 0 130 95" className="w-full h-full" fill="none" style={{ transform: 'scaleX(-1)' }}>
              <path
                d="M 8 90 C 12 55, 30 20, 56 10 C 64 6, 76 6, 84 10 C 106 20, 122 55, 124 90 C 114 94, 96 88, 66 88 C 36 88, 18 94, 8 90 Z"
                fill={`url(#catEarOuter_${theme})`}
                stroke="rgba(255, 255, 255, 0.95)"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path
                d="M 24 84 C 28 58, 42 30, 60 22 C 66 19, 74 19, 80 22 C 96 30, 106 58, 108 84 C 98 86, 84 82, 66 82 C 48 82, 34 86, 24 84 Z"
                fill={`url(#catEarInner_${theme})`}
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <ellipse cx="54" cy="32" rx="4.5" ry="11" transform="rotate(-20 54 32)" fill="white" opacity="0.85" />
              <circle cx="72" cy="24" r="3.2" fill="white" opacity="0.75" />
            </svg>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VỎ SỔ NGOÀI GLASSMORPHISM & SOFT UI CÙNG CÁC ICON TRANG TRÍ */}
        {/* ======================================================== */}
        <div
          className={`relative z-10 w-full rounded-[32px] sm:rounded-[42px] p-2.5 sm:p-4 md:p-5 transition-all duration-300 ${bTheme.titleText}`}
          style={bTheme.notebookOuterGlass}
        >
          {/* 1. HÌNH CHỮ X TRÒN HOẠT HÌNH LẮC NHẸ BÊN TRÁI */}
          <div className="absolute -top-4 sm:-top-6 left-2 sm:left-24 w-11 h-11 sm:w-15 sm:h-15 pointer-events-none z-30 animate-sway-badge-left">
            <svg viewBox="0 0 80 80" className="w-full h-full" style={{ filter: bTheme.decorShadowXLeft }} fill="none">
              <defs>
                <linearGradient id={`cartoonXGrad_${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={bTheme.cartoonXGrad.stop0} />
                  <stop offset="50%" stopColor={bTheme.cartoonXGrad.stop50} />
                  <stop offset="100%" stopColor={bTheme.cartoonXGrad.stop100} />
                </linearGradient>
              </defs>
              <rect x="29" y="8" width="22" height="64" rx="11" transform="rotate(45 40 40)" fill={`url(#cartoonXGrad_${theme})`} stroke="white" strokeWidth="4.5" />
              <rect x="29" y="8" width="22" height="64" rx="11" transform="rotate(-45 40 40)" fill={`url(#cartoonXGrad_${theme})`} stroke="white" strokeWidth="4.5" />
            </svg>
          </div>

          {/* 2. HÌNH CHỮ X TRÒN HOẠT HÌNH LẮC NHẸ BÊN PHẢI */}
          <div className="absolute -top-4 sm:-top-6 right-2 sm:right-24 w-11 h-11 sm:w-15 sm:h-15 pointer-events-none z-30 animate-sway-badge-right">
            <svg viewBox="0 0 80 80" className="w-full h-full" style={{ filter: bTheme.decorShadowXRight }} fill="none">
              <rect x="29" y="8" width="22" height="64" rx="11" transform="rotate(45 40 40)" fill={`url(#cartoonXGrad_${theme})`} stroke="white" strokeWidth="4.5" />
              <rect x="29" y="8" width="22" height="64" rx="11" transform="rotate(-45 40 40)" fill={`url(#cartoonXGrad_${theme})`} stroke="white" strokeWidth="4.5" />
            </svg>
          </div>

          {/* 3. TRÁI TIM PIXEL 8-BIT CLAYMORPHISM LẮC LƯ GÓC DƯỚI TRÁI */}
          <div className="absolute -bottom-5 sm:-bottom-7 left-8 sm:left-20 w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 pointer-events-none z-30 animate-sway-heart">
            <svg viewBox="0 0 80 80" className="w-full h-full" style={{ filter: bTheme.decorShadowHeart }} fill="none">
              <defs>
                <linearGradient id={`pixelHeartGrad_${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={bTheme.pixelHeartGrad.stop0} />
                  <stop offset="30%" stopColor={bTheme.pixelHeartGrad.stop30} />
                  <stop offset="70%" stopColor={bTheme.pixelHeartGrad.stop70} />
                  <stop offset="100%" stopColor={bTheme.pixelHeartGrad.stop100} />
                </linearGradient>
              </defs>
              <path
                d="M 19 8 H 33 V 15 H 47 V 8 H 61 V 22 H 75 V 43 H 68 V 50 H 61 V 57 H 54 V 64 H 47 V 71 H 33 V 64 H 26 V 57 H 19 V 50 H 12 V 43 H 5 V 22 H 19 Z"
                fill={`url(#pixelHeartGrad_${theme})`}
                stroke="white"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <rect x="20" y="16" width="12" height="6" rx="1.5" fill="white" opacity="0.85" />
              <rect x="20" y="23" width="6" height="6" rx="1.5" fill="white" opacity="0.65" />
              <rect x="52" y="16" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
            </svg>
          </div>

          {/* 4. NGÔI SAO CLAYMORPHISM LẮC LƯ GÓC DƯỚI PHẢI */}
          <div className="absolute -bottom-5 sm:-bottom-7 right-6 sm:right-14 w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 pointer-events-none z-30 animate-sway-star-right-bottom">
            <svg viewBox="0 0 80 80" className="w-full h-full" style={{ filter: bTheme.decorShadowStar }} fill="none">
              <defs>
                <linearGradient id={`clayStarGrad_${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={bTheme.clayStarGrad.stop0} />
                  <stop offset="50%" stopColor={bTheme.clayStarGrad.stop50} />
                  <stop offset="100%" stopColor={bTheme.clayStarGrad.stop100} />
                </linearGradient>
              </defs>
              <path
                d="M 36.37 13.98 Q 40.00 8.00 43.63 13.98 L 48.25 21.59 Q 50.58 25.44 54.96 26.47 L 63.62 28.51 Q 70.43 30.11 65.86 35.41 L 60.06 42.15 Q 57.12 45.56 57.49 50.05 L 58.23 58.91 Q 58.81 65.89 52.35 63.18 L 44.15 59.74 Q 40.00 58.00 35.85 59.74 L 27.65 63.18 Q 21.19 65.89 21.77 58.91 L 22.51 50.05 Q 22.88 45.56 19.94 42.15 L 14.14 35.41 Q 9.57 30.11 16.38 28.51 L 25.04 26.47 Q 29.42 25.44 31.75 21.59 Z"
                fill={`url(#clayStarGrad_${theme})`}
                stroke="white"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <circle cx="40" cy="40" r="19" fill="white" opacity="0.15" />
              <ellipse cx="34" cy="22" rx="3.5" ry="8" transform="rotate(-25 34 22)" fill="white" opacity="0.85" />
              <circle cx="46" cy="20" r="2.2" fill="white" opacity="0.75" />
            </svg>
          </div>

          {/* 5. BĂNG KEO WASHI MÉP VIỀN DƯỚI PHẢI */}
          <div
            className={`absolute -bottom-3.5 right-24 sm:right-36 w-24 sm:w-28 h-6 sm:h-7 rounded-sm shadow-md border ${bTheme.washiTape1Border} pointer-events-none z-30 rotate-[-4deg] opacity-95`}
            style={{
              backgroundColor: bTheme.washiTape1Bg,
              backgroundImage: bTheme.washiStripeGradient,
            }}
          />

          {/* 6. NGÔI SAO HOẠT HÌNH LẮC LƯ MÉP BÊN TRÁI */}
          <div className="absolute top-[62%] -left-3 sm:-left-6 md:-left-7 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 pointer-events-none z-30 animate-sway-star-left">
            <svg viewBox="0 0 80 80" className="w-full h-full" style={{ filter: bTheme.decorShadowStar }} fill="none">
              <path
                d="M 36.37 13.98 Q 40.00 8.00 43.63 13.98 L 48.25 21.59 Q 50.58 25.44 54.96 26.47 L 63.62 28.51 Q 70.43 30.11 65.86 35.41 L 60.06 42.15 Q 57.12 45.56 57.49 50.05 L 58.23 58.91 Q 58.81 65.89 52.35 63.18 L 44.15 59.74 Q 40.00 58.00 35.85 59.74 L 27.65 63.18 Q 21.19 65.89 21.77 58.91 L 22.51 50.05 Q 22.88 45.56 19.94 42.15 L 14.14 35.41 Q 9.57 30.11 16.38 28.51 L 25.04 26.47 Q 29.42 25.44 31.75 21.59 Z"
                fill={`url(#clayStarGrad_${theme})`}
                stroke="white"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <ellipse cx="34" cy="22" rx="3.5" ry="8" transform="rotate(-25 34 22)" fill="white" opacity="0.85" />
            </svg>
          </div>

          {/* 7. HAI NGÔI SAO HOẠT HÌNH LẮC LƯ MÉP BÊN PHẢI */}
          <div className="absolute top-[35%] -translate-y-1/2 -right-4 sm:-right-7 md:-right-8 w-13 h-13 sm:w-17 sm:h-17 md:w-19 md:h-19 pointer-events-none z-30 animate-sway-star-right-top">
            <svg viewBox="0 0 80 80" className="w-full h-full" style={{ filter: bTheme.decorShadowStar }} fill="none">
              <path
                d="M 36.37 13.98 Q 40.00 8.00 43.63 13.98 L 48.25 21.59 Q 50.58 25.44 54.96 26.47 L 63.62 28.51 Q 70.43 30.11 65.86 35.41 L 60.06 42.15 Q 57.12 45.56 57.49 50.05 L 58.23 58.91 Q 58.81 65.89 52.35 63.18 L 44.15 59.74 Q 40.00 58.00 35.85 59.74 L 27.65 63.18 Q 21.19 65.89 21.77 58.91 L 22.51 50.05 Q 22.88 45.56 19.94 42.15 L 14.14 35.41 Q 9.57 30.11 16.38 28.51 L 25.04 26.47 Q 29.42 25.44 31.75 21.59 Z"
                fill={`url(#clayStarGrad_${theme})`}
                stroke="white"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <ellipse cx="34" cy="22" rx="3.5" ry="8" transform="rotate(-25 34 22)" fill="white" opacity="0.85" />
            </svg>
          </div>
          <div className="absolute top-[60%] -translate-y-1/2 -right-4 sm:-right-7 md:-right-8 w-11 h-11 sm:w-15 sm:h-15 md:w-17 md:h-17 pointer-events-none z-30 animate-sway-star-right-bottom">
            <svg viewBox="0 0 80 80" className="w-full h-full" style={{ filter: bTheme.decorShadowStar }} fill="none">
              <path
                d="M 36.37 13.98 Q 40.00 8.00 43.63 13.98 L 48.25 21.59 Q 50.58 25.44 54.96 26.47 L 63.62 28.51 Q 70.43 30.11 65.86 35.41 L 60.06 42.15 Q 57.12 45.56 57.49 50.05 L 58.23 58.91 Q 58.81 65.89 52.35 63.18 L 44.15 59.74 Q 40.00 58.00 35.85 59.74 L 27.65 63.18 Q 21.19 65.89 21.77 58.91 L 22.51 50.05 Q 22.88 45.56 19.94 42.15 L 14.14 35.41 Q 9.57 30.11 16.38 28.51 L 25.04 26.47 Q 29.42 25.44 31.75 21.59 Z"
                fill={`url(#clayStarGrad_${theme})`}
                stroke="white"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <ellipse cx="34" cy="22" rx="3.5" ry="8" transform="rotate(-25 34 22)" fill="white" opacity="0.85" />
            </svg>
          </div>

          {/* KHUNG LÒNG TRONG NÉT ĐÔI CỦA SỔ */}
          <div
            className={`w-full rounded-[24px] sm:rounded-[32px] p-2 sm:p-2.5 md:p-3 flex flex-col md:flex-row gap-0 transition-all ${bTheme.titleText}`}
            style={bTheme.notebookInnerGlass}
          >
            {/* ========================================================= */}
            {/* 4. CỘT TRÁI (TRANG 1): NỀN GIẤY CARO CHÉO GINGHAM PASTEL   */}
            {/* ========================================================= */}
            <div
              className="w-full md:w-64 lg:w-72 xl:w-76 shrink-0 flex flex-col gap-3 p-2.5 sm:p-3 rounded-2xl border mb-1.5 md:mb-0 transition-all border-white/90"
              style={{
                ...bTheme.leftColumnBg,
                boxShadow: bTheme.leftColumnShadow,
              }}
            >
              {/* Thẻ ảnh Polaroid bìa truyện */}
              <div
                className="rounded-2xl p-3 sm:p-3.5 text-center relative transition-all"
                style={bTheme.cardGlassStyle}
              >
                <div className="relative mx-auto w-full max-w-[170px] sm:max-w-[190px] md:max-w-[130px] pt-3 pb-2 mb-1">
                  {/* Băng dính Washi caro phía sau bìa */}
                  <div
                    className="absolute -left-2.5 top-6 w-5.5 h-[75%] pointer-events-none select-none z-0 rotate-[-2deg] opacity-90"
                    style={{
                      backgroundColor: bTheme.washiDividerBg,
                      backgroundImage: bTheme.washiStripeGradient,
                    }}
                  />

                  {/* Lớp ảnh Polaroid thứ 2 xếp chồng phía sau (nghiêng 3.5 độ) */}
                  <div className={`absolute inset-x-1.5 top-4.5 bottom-1 rounded-xl bg-white/70 border ${bTheme.coverCardBorder} shadow-xs rotate-[3.5deg] pointer-events-none`} />

                  {/* Khung ảnh Polaroid chính phía trước */}
                  <div
                    className={`relative rounded-xl bg-white/95 p-2 sm:p-2.5 pb-6 border ${bTheme.coverCardBorder} select-none`}
                    style={{ boxShadow: bTheme.polaroidFrameShadow }}
                  >
                    {/* Miếng băng keo trong suốt dán mép trên (Frosted tape) */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-4 bg-white/80 backdrop-blur-xs border border-white/90 shadow-xs z-30 pointer-events-none rounded-[2px]" />

                    <div className={`relative w-full aspect-[1/1.38] rounded-lg overflow-hidden bg-neutral-100 border ${bTheme.coverInnerBorder}`}>
                      <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Sticker tròn góc dưới phải có trái tim */}
                    <div className={`absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border ${bTheme.coverCardBorder} shadow-sm flex items-center justify-center z-30`}>
                      <Heart className="w-4 h-4" style={{ fill: bTheme.heartIconColor, color: bTheme.heartIconColor }} />
                    </div>
                  </div>
                </div>

                <h2 className={`mt-3 font-bold text-base sm:text-lg leading-snug line-clamp-2 ${bTheme.titleText}`}>
                  {novel.title}
                </h2>
                <p className={`mt-1 text-xs ${bTheme.authorTextMuted}`}>
                  Tác giả: <span className="font-bold">{novel.author.name}</span>
                </p>
                <p className={`text-[11px] ${bTheme.authorTextMuted} mt-0.5`}>
                  Người edit: <span className={`font-bold ${bTheme.translatorHighlight}`}>{novel.translator || 'Jouriee65'}</span>
                </p>

                {/* Nút kẹo Jelly Candy Glass: Đọc ngay & Đọc tiếp */}
                <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onReadChapter(1)}
                    className="group relative py-2.5 px-3 rounded-full text-xs font-bold active:scale-95 cursor-pointer flex items-center justify-center select-none"
                    style={bTheme.btnCandyPrimary}
                  >
                    {/* Vệt sáng bóng phản chiếu (Specular Highlight) ở nửa trên */}
                    <div
                      className="absolute inset-x-0 top-0 h-[48%] rounded-t-full pointer-events-none opacity-90 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.28) 50%, rgba(255, 255, 255, 0) 100%)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.85)',
                      }}
                    />
                    <span className={`relative z-10 tracking-wide ${bTheme.actionBtnPrimaryText}`}>Đọc ngay</span>
                  </button>

                  <button
                    onClick={() => onReadChapter(readingChapter)}
                    className="group relative py-2.5 px-3 rounded-full text-xs font-bold active:scale-95 cursor-pointer flex items-center justify-center select-none"
                    style={bTheme.btnCandySecondary}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-[48%] rounded-t-full pointer-events-none opacity-90 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.28) 50%, rgba(255, 255, 255, 0) 100%)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.85)',
                      }}
                    />
                    <span className={`relative z-10 tracking-wide ${bTheme.actionBtnSecondaryText}`}>Đọc tiếp</span>
                  </button>
                </div>
              </div>

              {/* Thẻ DANH MỤC 4 TAB */}
              <div
                className="rounded-2xl overflow-hidden relative"
                style={bTheme.cardGlassStyle}
              >
                <div className={`px-3.5 py-2.5 text-xs font-bold flex items-center justify-between border-b ${bTheme.tocHeaderBg} ${bTheme.tocHeaderText} ${bTheme.tocHeaderBorder}`}>
                  <div className="flex items-center gap-2">
                    <Folder className={`w-3.5 h-3.5 ${bTheme.folderIconColor}`} />
                    <span>DANH MỤC</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGuideNotice((prev) => !prev)}
                    className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold cursor-pointer shrink-0"
                    style={bTheme.btnClayPill}
                    title="Hướng dẫn điều hướng các trang"
                  >
                    Hướng dẫn
                  </button>
                </div>
                <div className="p-2 space-y-1.5 text-xs">
                  <button
                    onClick={() => setDiaryTab('home')}
                    className="w-full text-left px-3.5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer transition-all"
                    style={diaryTab === 'home' ? bTheme.tabActiveStyle : bTheme.tabInactiveStyle}
                  >
                    <span>★ Hồ sơ truyện</span>
                  </button>
                  <button
                    onClick={() => setDiaryTab('diary')}
                    className="w-full text-left px-3.5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer transition-all"
                    style={diaryTab === 'diary' ? bTheme.tabActiveStyle : bTheme.tabInactiveStyle}
                  >
                    <span>★ Giới thiệu truyện</span>
                  </button>
                  <button
                    onClick={() => {
                      setDiaryTab('chapters');
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer transition-all"
                    style={diaryTab === 'chapters' ? bTheme.tabActiveStyle : bTheme.tabInactiveStyle}
                  >
                    <span>★ Mục lục chương</span>
                  </button>
                  <button
                    onClick={() => setDiaryTab('guestbook')}
                    className="w-full text-left px-3.5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer transition-all"
                    style={diaryTab === 'guestbook' ? bTheme.tabActiveStyle : bTheme.tabInactiveStyle}
                  >
                    <span>★ Bình luận</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* 5. GÁY CÒNG LÒ XO TRÊN ĐIỆN THOẠI (LỚP NỀN TRẢI DÀI HẾT SỔ) */}
            {/* ========================================================= */}
            <div
              className={`flex md:hidden -mx-2 sm:-mx-2.5 w-[calc(100%+1rem)] sm:w-[calc(100%+1.25rem)] my-1.5 sm:my-2 relative select-none pointer-events-none z-20 flex-col justify-center bg-gradient-to-b ${bTheme.spineGradientMobile} border-y ${bTheme.spineBorderMobile} backdrop-blur-xs py-2 sm:py-2.5 overflow-hidden`}
              style={{ boxShadow: bTheme.spineShadowMobile }}
            >
              <svg
                width="0"
                height="0"
                style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
                aria-hidden="true"
              >
                <defs>
                  {/* Màu còng lò xo pastel nhạt dịu */}
                  <linearGradient id={`mobileWideSpringMetal_${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={bTheme.catEarOuter.stop70} />
                    <stop offset="25%" stopColor={bTheme.catEarOuter.stop35} />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="75%" stopColor={bTheme.catEarOuter.stop35} />
                    <stop offset="100%" stopColor={bTheme.catEarOuter.stop100} />
                  </linearGradient>
                  {/* Lỗ còng đục giấy pastel */}
                  <radialGradient id={`mobileWideSpringHole_${theme}`} cx="45%" cy="45%" r="55%">
                    <stop offset="0%" stopColor={bTheme.catEarInner.stop50} />
                    <stop offset="70%" stopColor={bTheme.catEarInner.stop0} />
                    <stop offset="100%" stopColor={bTheme.catEarInner.stop100} />
                  </radialGradient>
                </defs>
              </svg>

              {/* 10 còng lò xo đơn nằm trọn bên trong nền còng, khoảng cách đều nhau 100% */}
              <div className="w-full flex items-center justify-between px-3 sm:px-5 relative z-10">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((sIdx) => (
                  <div key={sIdx} className="flex items-center" style={{ filter: bTheme.mobileSpringShadow }}>
                    <svg viewBox="0 0 38 44" className="w-6.5 h-9 sm:w-7.5 sm:h-10.5" fill="none">
                      <circle cx="14" cy="7" r="4.6" fill={`url(#mobileWideSpringHole_${theme})`} stroke={bTheme.catEarOuter.stop70} strokeWidth="1.2" />
                      <circle cx="14" cy="37" r="4.6" fill={`url(#mobileWideSpringHole_${theme})`} stroke={bTheme.catEarOuter.stop70} strokeWidth="1.2" />
                      <path
                        d="M 14 7 C 14 -6, 33 -6, 33 22 C 33 50, 14 50, 14 37"
                        stroke={`url(#mobileWideSpringMetal_${theme})`}
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 13 7 C 13 -3, 30.5 -3, 30.5 22 C 30.5 47, 13 47, 13 37"
                        stroke="#ffffff"
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.65"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================================= */}
            {/* 6. GÁY SỔ CÒNG ĐỨNG TRÊN MÁY TÍNH (DẠNG DỌC KHOEN KHOÉT) */}
            {/* ========================================================= */}
            <div
              className={`hidden md:flex w-9 sm:w-10 shrink-0 self-stretch -my-2 sm:-my-3 flex-col items-center justify-between py-3 sm:py-4 relative select-none rounded-none bg-gradient-to-r ${bTheme.spineGradientDesktop} border-x ${bTheme.spineBorderDesktop} mx-1 backdrop-blur-xs`}
              style={{ boxShadow: bTheme.spineShadowDesktop }}
            >
              <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 bg-gradient-to-r from-transparent ${bTheme.spineSeamVia} to-transparent pointer-events-none`} />
              {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="relative z-10 flex items-center justify-center my-1.5">
                  <div
                    className={`w-4.5 h-4.5 rounded-full border-2 ${bTheme.ringBorder} bg-gradient-to-b ${bTheme.ringGradient} flex items-center justify-center relative shadow-xs`}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
              ))}
            </div>

            {/* ========================================================= */}
            {/* 7. CỘT PHẢI (TRANG 2): NỀN GIẤY KẺ Ô LI CYWORLD PASTEL    */}
            {/* ========================================================= */}
            <div
              className={`flex-1 min-w-0 rounded-2xl rounded-tr-3xl sm:rounded-tr-[32px] overflow-hidden border flex flex-col relative transition-all border-white/90 ${bTheme.titleText}`}
              style={bTheme.rightColumnGrid}
            >
              {/* Nẹp rèm ren lượn sóng đỉnh trang */}
              <div className="w-full h-6 sm:h-8.5 overflow-hidden rounded-tr-3xl sm:rounded-tr-[32px] z-20 pointer-events-none select-none shrink-0 -mt-0.5">
                <svg viewBox="0 0 800 44" className="w-full h-full text-white" preserveAspectRatio="none">
                  <path
                    d="M 0 0 L 800 0 L 800 18 Q 775 36 750 18 Q 725 36 700 18 Q 675 36 650 18 Q 625 36 600 18 Q 575 36 550 18 Q 525 36 500 18 Q 475 36 450 18 Q 425 36 400 18 Q 375 36 350 18 Q 325 36 300 18 Q 275 36 250 18 Q 225 36 200 18 Q 175 36 150 18 Q 125 36 100 18 Q 75 36 50 18 Q 25 36 0 18 Z"
                    fill="#ffffff"
                    stroke={bTheme.awningBottomLine}
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* KHUNG NỘI DUNG 4 TAB */}
              <div className="p-2.5 sm:p-3.5 md:p-4 pt-1 sm:pt-1.5 flex flex-col flex-1">
                
                {/* ---------------------------------------------------- */}
                {/* TAB 1: HỒ SƠ TRUYỆN                                  */}
                {/* ---------------------------------------------------- */}
                {diaryTab === 'home' && (
                  <div className="flex flex-col gap-2.5 sm:gap-3">
                    {/* PHẦN 2.3: Thanh Tìm Kiếm Dài Toàn Phần & Ngôi Sao May Mắn */}
                    <div className="w-full mb-1">
                      <div
                        className={`w-full px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full flex items-center justify-between gap-3 ${bTheme.titleText}`}
                        style={bTheme.searchBarSoftStyle}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${bTheme.searchIconBg} flex items-center justify-center shrink-0 ${bTheme.searchIconText} shadow-2xs border border-white/80`}>
                            <Search className="w-4 h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold truncate tracking-wide">{novel.title}</span>
                        </div>

                        {/* Ngôi sao may mắn bấm đổi màu: không viền, màu nhạt pastel */}
                        <button
                          type="button"
                          onClick={() => setSearchStarColorIdx((prev) => (prev + 1) % SEARCH_STAR_COLORS.length)}
                          className="p-1 cursor-pointer hover:scale-115 active:scale-90 transition-transform"
                          title="Ngôi sao may mắn (Bấm để đổi màu)"
                        >
                          <Star strokeWidth={0} stroke="none" className="w-5 h-5" style={{ fill: SEARCH_STAR_COLORS[searchStarColorIdx].fill }} />
                        </button>
                      </div>
                    </div>

                    {/* PHẦN 3: Mục PROFILE / HỒ SƠ TÁC PHẨM & D-DAY */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3">
                      {/* PHẦN 3.1: Mục PROFILE / HỒ SƠ TÁC PHẨM (Nền trơn thanh lịch, bỏ đường kẻ ngang) */}
                      <div
                        className="lg:col-span-8 rounded-2xl p-3 sm:p-3.5 relative flex flex-col justify-between border border-white/90 backdrop-blur-[16px]"
                        style={{
                          backgroundColor: bTheme.profileCardBg,
                          boxShadow: bTheme.profileCardShadow,
                        }}
                      >
                        <div>
                          <div className={`flex items-center gap-2 text-[13px] font-bold ${bTheme.profileCardHeaderText}`}>
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" style={{ fill: bTheme.profileCardHeaderIcon, color: bTheme.profileCardHeaderIcon }}>
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span>PROFILE / HỒ SƠ TÁC PHẨM</span>
                          </div>

                          <div className="mt-2 text-center space-y-1 font-sans">
                            <div className={`text-[14px] sm:text-[16px] font-bold font-novel-title ${bTheme.profileTitleText} leading-snug`}>
                              {novel.title} • {novel.author.name}
                            </div>
                            <p className={`text-[12px] sm:text-[13px] ${bTheme.authorTextMuted}`}>
                              Người edit: <span className="font-semibold">{novel.translator || 'Jouriee65 (Niên Thời)'}</span>
                            </p>
                            <p className={`text-[12px] sm:text-[13px] ${bTheme.authorTextMuted}`}>
                              Thể loại: {novel.genres.join(', ')} · Tình trạng: {novel.status === 'ongoing' ? 'Đang ra' : 'Hoàn thành'}
                            </p>
                            <p className={`text-[10px] ${bTheme.noticeHighlight} font-mono tracking-tight pt-0.5 italic`}>
                              https://nienthoi.nienthoi.workers.dev/
                            </p>
                          </div>
                        </div>

                        {/* Dải tags thể loại nhỏ dạng pill bo tròn */}
                        <div className={`mt-2.5 flex flex-wrap gap-1.5 justify-center pt-2 border-t ${bTheme.cardDividerBorder}`}>
                          {novel.genres.map((g) => (
                            <span key={g} className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${bTheme.tagPillBg} ${bTheme.tagPillText} border ${bTheme.tagPillBorder}`}>
                              #{g}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* PHẦN 3.2: Mục D-DAY & TIẾN ĐỘ (Đã khôi phục sọc chéo 45deg) */}
                      <div className="lg:col-span-4 rounded-2xl p-3 sm:p-3.5 text-center flex flex-col items-center justify-center relative overflow-hidden" style={{
                        background: bTheme.ddayCardBg,
                        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.92) 0%, ${bTheme.dDayGradientOverlay} 100%), ${bTheme.washiStripeGradient}`,
                        backdropFilter: 'blur(16px) saturate(140%)',
                      }}>
                        {/* Lỗ đục góc trên bên phải: đổ bóng lòng trong inset 3D */}
                        <div
                          className="absolute top-2.5 right-2.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full pointer-events-none z-10"
                          style={{
                            background: bTheme.dDayHoleBg,
                            boxShadow: bTheme.dDayHoleShadow,
                            border: `1.5px solid ${bTheme.dDayHoleBorder}`,
                          }}
                        />

                        {/* Lỗ đục góc dưới bên trái */}
                        <div
                          className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full pointer-events-none z-10"
                          style={{
                            background: bTheme.dDayHoleBg,
                            boxShadow: bTheme.dDayHoleShadow,
                            border: `1.5px solid ${bTheme.dDayHoleBorder}`,
                          }}
                        />

                        <div className="w-full flex flex-col items-center justify-center my-auto py-1">
                          <div className={`text-xs font-bold ${bTheme.dDayTitleText} tracking-wider`}>D-DAY / TIẾN ĐỘ</div>
                          <div className={`w-20 mx-auto my-1.5 border-b border-dashed ${bTheme.dDayDashedBorder}`} />
                          <div className={`text-[11px] ${bTheme.authorTextMuted}`}>
                            Cập nhật: {novel.chapters[novel.chapters.length - 1]?.publishedAt || '10 phút trước'}
                          </div>
                          <div className={`mt-0.5 font-novel-title font-black text-2xl sm:text-3xl ${bTheme.dDayNumberText}`}>D + {dDayNumber}</div>
                          <div className={`text-[11px] font-bold ${bTheme.dDayChaptersText} mt-0.5`}>
                            {novel.chapters.length} / {novel.chapters.length} CHƯƠNG ĐÃ ĐĂNG
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MIẾNG BĂNG KEO WASHI DÀI NẰM DƯỚI D-DAY & HỒ SƠ PROFILE */}
                    <div
                      className="relative py-2 flex items-center justify-center my-0.5"
                      style={{
                        filter: bTheme.washiDividerFilter,
                      }}
                    >
                      <div
                        className="w-[92%] sm:w-[96%] h-5 sm:h-5.5 pointer-events-none select-none opacity-95"
                        style={{
                          backgroundColor: bTheme.washiDividerBg,
                          backgroundImage: `
                            repeating-linear-gradient(0deg, ${bTheme.washiGridColor} 0px, ${bTheme.washiGridColor} 5px, transparent 5px, transparent 10px),
                            repeating-linear-gradient(90deg, ${bTheme.washiGridColor} 0px, ${bTheme.washiGridColor} 5px, transparent 5px, transparent 10px)
                          `,
                          clipPath:
                            'polygon(7px 0%, 0px 8.3%, 7px 16.7%, 0px 25%, 7px 33.3%, 0px 41.7%, 7px 50%, 0px 58.3%, 7px 66.7%, 0px 75%, 7px 83.3%, 0px 91.7%, 7px 100%, calc(100% - 7px) 100%, 100% 91.7%, calc(100% - 7px) 83.3%, 100% 75%, calc(100% - 7px) 66.7%, 100% 58.3%, calc(100% - 7px) 50%, 100% 41.7%, calc(100% - 7px) 33.3%, 100% 25%, calc(100% - 7px) 16.7%, 100% 8.3%, calc(100% - 7px) 0%)',
                        }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* PHẦN 4: Giới thiệu trích đoạn, Lời nhắn người đăng & Music Player */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                      {/* PHẦN 4.1: Lưu ý (Băng keo Washi dán góc & thẻ Glass) */}
                      <div
                        className="rounded-2xl p-3 sm:p-3.5 relative flex flex-col justify-between pt-4"
                        style={bTheme.cardGlassStyle}
                      >
                        {/* Băng dính Washi Tape pastel */}
                        <div
                          className={`absolute -top-2 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-3.5 sm:h-4 rounded-xs border ${bTheme.washiTape1Border} pointer-events-none z-20 rotate-[-1deg] opacity-95`}
                          style={{ backgroundColor: bTheme.washiTape1Bg, boxShadow: bTheme.washi1Shadow }}
                        />

                        <div className="relative z-10">
                          <div className={`flex items-center gap-2 text-xs font-bold ${bTheme.cardTitle}`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${bTheme.accentDot}`} />
                            <span>Lưu ý</span>
                          </div>
                          <p className={`mt-2 text-xs ${bTheme.titleText} leading-relaxed font-sans`}>
                            Bản edit phi thương mại, chỉ đăng tải tại website và wordpress. Vui lòng không reup hoặc chuyển ver!
                          </p>
                        </div>

                        <div className={`mt-2.5 pt-2 border-t ${bTheme.cardDividerBorder} flex items-center justify-between text-[11px] ${bTheme.cardSubtext}`}>
                          <span>Trạng thái: Hoàn thành</span>
                          <button
                            type="button"
                            onClick={() => setDiaryTab('diary')}
                            className="px-3 py-1 text-[11px] font-bold cursor-pointer rounded-full"
                            style={bTheme.btnClayPill}
                          >
                            Xem chi tiết &gt;
                          </button>
                        </div>
                      </div>

                      {/* PHẦN 4.2: Giới thiệu trích đoạn & Cụm 3 trái tim SVG vector đổi màu */}
                      <div
                        className="rounded-2xl p-3 sm:p-3.5 relative flex flex-col justify-between pt-4"
                        style={bTheme.cardGlassStyle}
                      >
                        {/* Băng keo dán nghiêng 1 độ */}
                        <div
                          className={`absolute -top-2 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-3.5 sm:h-4 rounded-xs border ${bTheme.washiTape2Border} pointer-events-none z-20 rotate-[1deg] opacity-95`}
                          style={{ backgroundColor: bTheme.washiTape2Bg, boxShadow: bTheme.washi2Shadow }}
                        />

                        {/* CỤM 3 TRÁI TIM SVG ĐỔI MÀU */}
                        <div
                          onClick={handleCycleHeartColor}
                          title={`3 trái tim cùng màu: ${HEART_COLOR_PALETTES[heartColorIdx].name} (Bấm để đổi màu)`}
                          className="absolute -top-3 right-3 sm:right-4 flex items-center -space-x-1 sm:-space-x-1.5 z-20 cursor-pointer group"
                        >
                          {[0, 1, 2].map((idx) => {
                            const palette = HEART_COLOR_PALETTES[heartColorIdx];
                            return (
                              <div key={idx} className="w-5 h-5 p-0.5 rounded-full flex items-center justify-center transition-transform group-hover:scale-115 active:scale-90">
                                <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                                  <defs>
                                    <linearGradient id={`heartGrad_${idx}_${heartColorIdx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor={palette.stop1} />
                                      <stop offset="50%" stopColor={palette.stop2} />
                                      <stop offset="100%" stopColor={palette.stop3} />
                                    </linearGradient>
                                  </defs>
                                  <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill={`url(#heartGrad_${idx}_${heartColorIdx})`}
                                    stroke="white"
                                    strokeWidth="1.4"
                                  />
                                  {/* Đốm sáng phản chiếu bóng bẩy */}
                                  <ellipse cx="7.5" cy="6.5" rx="1.8" ry="1.1" transform="rotate(-30 7.5 6.5)" fill="white" opacity="0.85" />
                                </svg>
                              </div>
                            );
                          })}
                        </div>

                        <div className="relative z-10">
                          <div className={`flex items-center gap-2 text-xs font-bold ${bTheme.cardTitle}`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${bTheme.accentDot}`} />
                            <span>Giới thiệu trích đoạn</span>
                          </div>
                          <p className={`mt-2 text-xs ${bTheme.titleText} leading-relaxed font-sans line-clamp-4`}>{novel.synopsis}</p>
                        </div>

                        {/* Đường kẻ và thông tin: Trích đoạn tiểu thuyết, nút Danh sách chương . trình bày giống mục Lưu ý */}
                        <div className={`mt-2.5 pt-2 border-t ${bTheme.cardDividerBorder} flex items-center justify-between text-[11px] ${bTheme.cardSubtext}`}>
                          <span>Trích đoạn tiểu thuyết</span>
                          <button
                            type="button"
                            onClick={() => setDiaryTab('chapters')}
                            className="px-3 py-1 text-[11px] font-bold cursor-pointer rounded-full"
                            style={bTheme.btnClayPill}
                          >
                            Danh sách chương &gt;
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* PHẦN 4.3: Thanh phát nhạc Sugar Love Vinyl BGM (Thiết kế ngang mỏng gọn) */}
                    <div
                      className="rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 relative flex items-center justify-between gap-2.5 sm:gap-4 overflow-hidden"
                      style={bTheme.musicPlayerBg || bTheme.cardGlassStyle}
                    >
                      {/* Khối bên trái: Đĩa than quay + Tên bài hát + Equalizer */}
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div
                          className={`relative w-9.5 h-9.5 rounded-full bg-gradient-to-tr from-[#141a24] via-[#243346] to-[#0f151e] shadow-[0_3px_10px_rgba(0,0,0,0.25)] flex items-center justify-center shrink-0 border border-white/10 overflow-hidden ${
                            isPlayingAudio ? 'animate-[spin_5s_linear_infinite]' : ''
                          }`}
                        >
                          {/* Các rãnh đĩa than */}
                          <div className="absolute inset-1 rounded-full border border-white/5 pointer-events-none" />
                          <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />

                          {/* Vệt phản quang conic-gradient quay cùng chiều */}
                          <div
                            className={`absolute inset-0 rounded-full pointer-events-none ${
                              isPlayingAudio ? 'animate-[spin_3.2s_linear_infinite]' : ''
                            }`}
                            style={{
                              background:
                                'conic-gradient(from 25deg, transparent 0deg, rgba(255,255,255,0.42) 30deg, transparent 65deg, transparent 180deg, rgba(255,255,255,0.32) 210deg, transparent 245deg, transparent 360deg)',
                              mixBlendMode: 'screen',
                            }}
                          />
                          {/* Tâm nhãn đĩa */}
                          <div
                            className="relative z-10 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white shadow-inner"
                            style={{ backgroundColor: bTheme.musicVinylCenterBg }}
                          >
                            <Heart className="w-2 h-2 fill-white text-white" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className={`flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider ${bTheme.cardSubtext}`}>
                            <span>MUSIC</span>
                            <span>·</span>
                            <span>BGM</span>
                            {isPlayingAudio && (
                              <span className="flex items-center gap-0.5 ml-1">
                                <span className="w-0.5 h-2 rounded-full animate-pulse" style={{ backgroundColor: bTheme.musicEqColor1 }} />
                                <span className="w-0.5 h-3 rounded-full animate-pulse delay-75" style={{ backgroundColor: bTheme.musicEqColor2 }} />
                                <span className="w-0.5 h-1.5 rounded-full animate-pulse delay-150" style={{ backgroundColor: bTheme.musicEqColor3 }} />
                              </span>
                            )}
                          </div>
                          <div className={`text-xs sm:text-[13px] font-bold ${bTheme.titleText} truncate mt-0.5`}>
                            {ambientTracks[activeAudioIndex].title}
                          </div>
                          <div className={`text-[10px] ${bTheme.authorTextMuted} truncate`}>{ambientTracks[activeAudioIndex].artist}</div>
                        </div>
                      </div>

                      {/* Khối bên phải: Bộ nút điều khiển và thanh âm lượng */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button
                          onClick={handlePrevTrack}
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${bTheme.actionBtnSecondaryText} hover:opacity-80 active:scale-90 transition-transform cursor-pointer`}
                          title="Bài trước"
                        >
                          <SkipBack className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={toggleAudio}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${bTheme.actionBtnPrimaryText} shadow-xs active:scale-95 transition-all cursor-pointer`}
                          style={bTheme.btnClayPrimary}
                          title={isPlayingAudio ? 'Tạm dừng' : 'Phát nhạc'}
                        >
                          {isPlayingAudio ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>
                        <button
                          onClick={handleNextTrack}
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${bTheme.actionBtnSecondaryText} hover:opacity-80 active:scale-90 transition-transform cursor-pointer`}
                          title="Bài tiếp theo"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>

                        <div className={`hidden sm:flex items-center gap-1.5 pl-2 border-l ${bTheme.innerBorderColor} ${bTheme.cardSubtext}`}>
                          <button onClick={handleToggleMute} className="p-1 cursor-pointer">
                            {isMuted || audioVolume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className={`w-3.5 h-3.5 ${bTheme.folderIconColor}`} />}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={isMuted ? 0 : audioVolume}
                            onChange={(e) => handleVolumeChange(Number(e.target.value))}
                            style={{ accentColor: bTheme.musicEqColor1 }}
                            className="w-14 md:w-20 h-1.5 cursor-pointer bg-black/10 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================== */}
                {/* PHẦN 1: MỤC GIỚI THIỆU TRUYỆN (diaryTab === 'diary') */}
                {/* ==================================================== */}
                {diaryTab === 'diary' && (
                  <div className="mt-4 space-y-4">
                    <div
                      className="rounded-2xl p-5 relative transition-all"
                      style={bTheme.cardGlassStyle}
                    >
                      {/* ======================================================== */}
                      {/* CỤM 3 NGÔI SAO NỔI BẬT MÉP TRÊN (KHÔNG ĐỔ BÓNG ĐEN, ĐỔI MÀU) */}
                      {/* ======================================================== */}
                      <div
                        onClick={handleCycleHeartColor}
                        title={`3 ngôi sao cùng màu: ${HEART_COLOR_PALETTES[heartColorIdx].name} (Bấm để đổi màu)`}
                        className="absolute -top-3.5 sm:-top-4 right-6 sm:right-8 flex items-center -space-x-1 sm:-space-x-1.5 z-30 select-none cursor-pointer group"
                      >
                        {[0, 1, 2].map((idx) => {
                          const palette = HEART_COLOR_PALETTES[heartColorIdx];
                          return (
                            <div
                              key={idx}
                              className="w-6 h-6 sm:w-7 sm:h-7 p-0.5 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-115 active:scale-90"
                            >
                              <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                                <defs>
                                  <linearGradient id={`introStarGrad_${idx}_${heartColorIdx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={palette.stop1} />
                                    <stop offset="50%" stopColor={palette.stop2} />
                                    <stop offset="100%" stopColor={palette.stop3} />
                                  </linearGradient>
                                </defs>
                                {/* Thân ngôi sao 5 cánh mềm mại */}
                                <path
                                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                  fill={`url(#introStarGrad_${idx}_${heartColorIdx})`}
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeLinejoin="round"
                                />
                                {/* Ánh sáng phản chiếu 3D mềm mại trên vai ngôi sao */}
                                <ellipse
                                  cx="10"
                                  cy="7.5"
                                  rx="2"
                                  ry="1.2"
                                  transform="rotate(-30 10 7.5)"
                                  fill="white"
                                  opacity="0.85"
                                />
                              </svg>
                            </div>
                          );
                        })}
                      </div>

                      {/* Header tiêu đề */}
                      <div className={`flex items-center justify-between pb-3 border-b ${bTheme.cardDividerBorder} relative z-10`}>
                        <div className="flex items-center gap-2">
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" style={{ fill: bTheme.profileCardHeaderIcon, color: bTheme.profileCardHeaderIcon }} aria-hidden="true">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <h3 className={`font-bold text-sm ${bTheme.titleText}`}>
                            Giới thiệu truyện
                          </h3>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4 relative z-10">
                        {/* 1. LỜI NHẮN GỬI ĐỘC GIẢ (Vạch sọc đứng mép trái) */}
                        <div>
                          <h4 className={`text-xs font-bold ${bTheme.cardTitle} uppercase tracking-wider`}>
                            • Lời nhắn gửi độc giả:
                          </h4>
                          <div className={`mt-1.5 p-3 sm:p-3.5 pl-4.5 sm:pl-5.5 rounded-xl border ${bTheme.cardBorder} bg-white/70 backdrop-blur-xs relative overflow-hidden`}>
                            {/* Đường sọc thẳng sát mép trái */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-b ${bTheme.stripeBarGradient} rounded-l-xl z-10`} />
                            <p className={`relative z-10 text-xs sm:text-[13px] ${bTheme.titleText} font-sans leading-5 sm:leading-6`}>
                              Đọc kỹ tất cả các tags và giới thiệu truyện, chúc mọi người có khoảng thời gian đọc truyện vui vẻ.
                            </p>
                          </div>
                        </div>

                        {/* 2. GIỚI THIỆU TÁC PHẨM (Nền kẻ sọc ngang mảnh 10px + thanh cuộn 1px) */}
                        <div>
                          <h4 className={`text-xs font-bold ${bTheme.cardTitle} uppercase tracking-wider`}>
                            • Giới thiệu tác phẩm:
                          </h4>
                          <div
                            className={`mt-1.5 h-[340px] sm:h-[360px] md:h-[220px] lg:h-[240px] overflow-y-auto p-4 pr-3 sugar-scrollbar-1px text-[13px] sm:text-[14px] ${bTheme.titleText} leading-relaxed space-y-2 whitespace-pre-line bg-white/80 rounded-xl border ${bTheme.cardBorder} backdrop-blur-xs`}
                            style={{
                              backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 9px, ${bTheme.synopsisGridLine} 9px, ${bTheme.synopsisGridLine} 10px)`,
                            }}
                          >
                            {novel.synopsis || 'Đang cập nhật nội dung văn án...'}
                          </div>
                        </div>

                        {/* 3. THIẾT LẬP NHÂN VẬT (Vạch sọc đứng mép phải) */}
                        <div>
                          <h4 className={`text-xs font-bold ${bTheme.cardTitle} uppercase tracking-wider`}>
                            • Thiết lập nhân vật:
                          </h4>
                          <div className={`mt-1.5 p-3 sm:p-3.5 pr-4.5 sm:pr-5.5 rounded-xl border ${bTheme.cardBorder} bg-white/70 backdrop-blur-xs relative overflow-hidden`}>
                            {/* Đường sọc thẳng sát mép phải */}
                            <div className={`absolute right-0 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-b ${bTheme.stripeBarGradient} rounded-r-xl z-10`} />
                            <p className={`relative z-10 text-xs sm:text-[13px] ${bTheme.titleText} font-sans leading-5 sm:leading-6 whitespace-pre-line`}>
                              {novel.worldLore?.replace(/^Thiết lập nhân vật:\s*/i, '').trim() ||
                                'Tô Chấp Duật X Phương Thời Ân\n\nMạnh miệng mềm lòng kiêu ngạo hẹp hòi dục vọng chiếm hữu X Ngốc nghếch xấu tính thích kiếm chuyện xinh đẹp'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================== */}
                {/* ==================================================== */}
                {/* PHẦN 2: MỤC MỤC LỤC CHƯƠNG (diaryTab === 'chapters') */}
                {/* ==================================================== */}
                {diaryTab === 'chapters' && (
                  <div className="mt-3.5 flex flex-col gap-4 animate-in fade-in duration-200">
                    <div
                      className="rounded-2xl overflow-hidden relative transition-all"
                      style={bTheme.cardGlassStyle}
                    >
                      {/* THANH TIÊU ĐỀ: NỀN HỌA TIẾT SỌC ĐỨNG 90 ĐỘ MỜ NHẸ */}
                      <div
                        className={`p-3 sm:px-4 sm:py-3 border-b ${bTheme.innerBorderColor} flex items-center justify-between`}
                        style={{
                          backgroundImage: bTheme.chapterHeaderStripe,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" style={{ fill: bTheme.profileCardHeaderIcon, color: bTheme.profileCardHeaderIcon }}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className={`text-xs sm:text-sm font-bold ${bTheme.chapterTitleText}`}>
                            MỤC LỤC CHƯƠNG
                          </span>
                          <span className={`text-[11px] font-semibold ${bTheme.cardSubtext}`}>
                            ({novel.chapters.length} chương)
                          </span>
                        </div>
                      </div>

                      {/* DANH SÁCH CÁC DÒNG CHƯƠNG */}
                      <div className={`divide-y ${bTheme.chapterDividerBorder}`}>
                        {paginatedChapters.length === 0 ? (
                          <div className={`py-8 text-center text-xs ${bTheme.cardSubtext}`}>
                            Không có chương nào trong danh mục này.
                          </div>
                        ) : (
                          paginatedChapters.map((chap) => {
                            const extra = isExtra(chap);
                            return (
                              <div
                                key={chap.id}
                                onClick={() => onReadChapter(chap.chapterNumber)}
                                className={`p-3 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 ${bTheme.chapterHoverBg} cursor-pointer transition-colors group`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {/* Chấm tròn đổi màu theo theme zoom nhẹ khi hover */}
                                  <span className={`w-2 h-2 rounded-full ${bTheme.chapterDotColor} group-hover:scale-125 transition-transform shrink-0`} />
                                  
                                  <span className={`font-sans text-xs sm:text-sm font-semibold ${bTheme.chapterTitleText} ${bTheme.chapterTitleHover} transition-colors truncate`}>
                                    {chap.title}
                                  </span>

                                  {/* Huy hiệu Ngoại truyện */}
                                  {extra && (
                                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${bTheme.chapterExtraBadgeBg} ${bTheme.chapterExtraBadgeText} border ${bTheme.chapterExtraBadgeBorder} shrink-0 shadow-2xs`}>
                                      Ngoại truyện
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0 ml-auto">
                                  <span className={`text-[9.5px] sm:text-[10px] ${bTheme.chapterDateText} font-mono tracking-tight text-right shrink-0`}>
                                    {chap.publishedAt || '2026-06-28'}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* THANH PHÂN TRANG (PAGINATION) */}
                      {totalPages > 1 && (
                        <div className={`p-3 border-t ${bTheme.paginationBorder} flex items-center justify-between`}>
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 cursor-pointer flex items-center gap-1 transition-all"
                            style={bTheme.btnClaySecondary}
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Trang trước</span>
                          </button>

                          <span className={`text-xs ${bTheme.paginationActiveText} font-bold px-3 py-1 rounded-full ${bTheme.paginationActiveBg} border ${bTheme.paginationActiveBorder}`}>
                            {currentPage}/{totalPages}
                          </span>

                          <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 cursor-pointer flex items-center gap-1 transition-all"
                            style={bTheme.btnClaySecondary}
                          >
                            <span>Trang sau</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ==================================================== */}
                {/* PHẦN 3: MỤC BÌNH LUẬN ĐỘC GIẢ (diaryTab === 'guestbook') */}
                {/* ==================================================== */}
                {diaryTab === 'guestbook' && (
                  <div className="mt-4 space-y-4">
                    {/* FORM GỬI BÌNH LUẬN */}
                    <form
                      onSubmit={handlePostComment}
                      className="rounded-2xl p-4 relative transition-all"
                      style={bTheme.cardGlassStyle}
                    >
                      <div className={`flex items-center gap-2 text-xs font-bold ${bTheme.commentHeaderText} pb-2 border-b ${bTheme.cardDividerBorder}`}>
                        <MessageSquare className={`w-3.5 h-3.5 ${bTheme.commentHeaderIcon}`} />
                        <span>BÌNH LUẬN</span>
                      </div>

                      <div className="mt-3">
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Tên của bạn (Tùy chọn)..."
                          className={`w-full sm:w-64 px-3 py-1.5 rounded-xl border ${bTheme.commentInputBorder} text-xs ${bTheme.commentInputBg} focus:outline-hidden ${bTheme.commentInputText} ${bTheme.commentPlaceholder}`}
                        />
                      </div>

                      <div className="mt-2">
                        <textarea
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Viết cảm nhận, nhận xét về truyện..."
                          rows={3}
                          className={`w-full p-2.5 rounded-xl border ${bTheme.commentInputBorder} text-xs ${bTheme.commentInputBg} focus:outline-hidden ${bTheme.commentInputText} ${bTheme.commentPlaceholder}`}
                        />
                      </div>

                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={!newCommentText.trim()}
                          className={`px-5 py-2 rounded-full disabled:opacity-40 ${bTheme.commentBtnText} text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 active:scale-95`}
                          style={bTheme.btnClayPrimary}
                        >
                          <Send className="w-3 h-3 text-current" />
                          <span>Đăng</span>
                        </button>
                      </div>
                    </form>

                    {/* DANH SÁCH CÁC BÌNH LUẬN ĐÃ ĐĂNG */}
                    <div className="space-y-2.5">
                      {comments.length === 0 ? (
                        <div
                          className={`p-6 text-center text-xs ${bTheme.cardSubtext} rounded-2xl`}
                          style={bTheme.cardGlassStyle}
                        >
                          Chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nhận!
                        </div>
                      ) : (
                        comments.map((cm) => (
                          <div
                            key={cm.id}
                            className="rounded-2xl p-3.5 flex flex-col justify-between transition-all"
                            style={bTheme.cardGlassStyle}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" style={{ fill: bTheme.profileCardHeaderIcon, color: bTheme.profileCardHeaderIcon }}>
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span className={`font-bold text-xs ${bTheme.commentItemTitleText}`}>
                                  {cm.author || cm.userName}
                                </span>
                              </div>
                              <span className={`text-[10px] ${bTheme.commentItemDateText} font-mono`}>
                                {cm.createdAt}
                              </span>
                            </div>

                            <p className={`mt-2 text-xs ${bTheme.commentItemContentText} leading-relaxed font-sans`}>
                              {cm.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
