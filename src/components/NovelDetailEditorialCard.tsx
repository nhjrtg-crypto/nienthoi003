import React, { useState } from 'react';
import {
  BookOpen,
  Heart,
  FileText,
  Share2,
  Bookmark,
  Layers,
  Check,
  Camera,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Novel, NovelChapter } from '../types';

interface NovelDetailEditorialCardProps {
  novel: Novel;
  effectiveChapters: NovelChapter[];
  onReadChapter: (chapterNumber: number) => void;
  voteCount: number;
  hasVoted: boolean;
  onVote: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  activeCoverImage: string;
  commentsCount: number;
  onOpenCoverModal?: () => void;
  onShare?: () => void;
  isDarkEffective: boolean;
  isAdmin?: boolean;
  activeTab: 'synopsis' | 'chapters' | 'comments' | 'author';
  onSelectTab: (tab: 'synopsis' | 'chapters' | 'comments' | 'author') => void;
  onScrollToTabs?: () => void;
}

export const NovelDetailEditorialCard: React.FC<NovelDetailEditorialCardProps> = ({
  novel,
  effectiveChapters,
  onReadChapter,
  voteCount,
  hasVoted,
  onVote,
  isBookmarked,
  onToggleBookmark,
  activeCoverImage,
  onOpenCoverModal,
  onShare,
  isDarkEffective,
  activeTab,
  onSelectTab,
  onScrollToTabs,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleQuickShare = () => {
    if (onShare) {
      onShare();
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const authorName = typeof novel.author === 'string' ? novel.author : novel.author?.name || 'Đang cập nhật';

  return (
    <div className="w-full max-w-5xl mx-auto my-3 sm:my-5 px-1 sm:px-2">
      {/* TẠP CHÍ VĂN HỌC HIỆN ĐẠI (CONTEMPORARY EDITORIAL MONOGRAPH) */}
      <div
        className={`relative rounded-3xl overflow-hidden border transition-all duration-300 ${
          isDarkEffective
            ? 'bg-[#121316] border-zinc-700/90 text-zinc-100 shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
            : 'bg-[#FDFCFA] border-stone-300 text-stone-900 shadow-[0_20px_50px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* BANNER ĐẦU TRANG TẠP CHÍ: HAIRLINE GRID VỚI MÃ ẤN PHẨM */}
        <div className="px-5 sm:px-8 py-3 sm:py-3.5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-stone-900 dark:bg-stone-100" />
            <span className="font-bold">VOL. 2026 · ISSUE N°01</span>
            <span className="opacity-40 hidden sm:inline">|</span>
            <span className="opacity-70 hidden sm:inline">CONTEMPORARY LITERARY MONOGRAPH</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="opacity-60 hidden md:inline">CURATED ARCHIVE</span>
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-black border-transparent font-bold'
                  : 'bg-transparent border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'BOOKMARKED' : 'BOOKMARK'}</span>
            </button>
          </div>
        </div>

        {/* NỘI DUNG CHÍNH TẠP CHÍ: 2 CỘT HIỆN ĐẠI */}
        <div className="p-5 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-7 sm:gap-10 items-start">
          {/* CỘT ẢNH BÌA TÁC PHẨM KIỂU ART PLATE */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div
              className={`relative w-full max-w-[220px] sm:max-w-[240px] p-2 rounded-2xl border shadow-lg transition-transform duration-300 hover:scale-[1.02] ${
                isDarkEffective ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-stone-200'
              }`}
            >
              <div className="aspect-[3/4.3] w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 relative group">
                <img
                  src={activeCoverImage}
                  alt={novel.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center grayscale-20 hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80';
                  }}
                />
                {onOpenCoverModal && (
                  <button
                    type="button"
                    onClick={onOpenCoverModal}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-medium gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>VIEW COVER PLATE</span>
                  </button>
                )}
              </div>

              {/* Nhãn chú thích hình ảnh tạp chí */}
              <div className="mt-2 pt-2 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between text-[10px] font-mono">
                <span className="opacity-50">PLATE 01 · ARTWORK</span>
                <span className="font-bold">EDITION JOURIEE65</span>
              </div>
            </div>

            {/* Cụm nhãn tối giản: Status & Editor */}
            <div className="flex items-center gap-2 mt-4 text-[11px] font-mono tracking-wide">
              <span className="px-2.5 py-1 rounded-sm bg-stone-100 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 font-semibold text-emerald-700 dark:text-emerald-400">
                ● HOÀN THÀNH
              </span>
              <span className="px-2.5 py-1 rounded-sm bg-stone-100 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 font-medium opacity-80">
                EDITOR: Jouriee65
              </span>
            </div>
          </div>

          {/* CỘT THÔNG TIN TẠP CHÍ & BÀI VIẾT */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-stone-500 dark:text-zinc-400 uppercase mb-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>MONOGRAPH SERIES · BẢN VĂN HỌC</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight">
                {novel.title}
              </h1>

              <div className="mt-2.5 flex items-center gap-3 text-xs sm:text-sm font-sans opacity-80 flex-wrap">
                <span>
                  Author:{' '}
                  <strong className="text-stone-900 dark:text-white font-serif">{authorName}</strong>
                </span>
                <span className="opacity-30">/</span>
                <span className="font-mono">{effectiveChapters.length} CHAPTERS</span>
                <span className="opacity-30">/</span>
                <span className="font-mono">HOÀN THÀNH</span>
              </div>

              {/* Các tags thể loại dạng capsule thanh mảnh */}
              <div className="flex items-center gap-1.5 flex-wrap mt-4">
                {(novel.genres && novel.genres.length > 0 ? novel.genres : ['Văn học']).map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-mono border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900/60 opacity-80"
                  >
                    #{genre}
                  </span>
                ))}
              </div>

              {/* Tuyên ngôn biên tập (Editorial Quote) */}
              <div className="mt-5 pt-3.5 border-t border-stone-200 dark:border-zinc-800">
                <p className="font-serif italic text-sm text-stone-600 dark:text-zinc-400">
                  “Every memorable story is a quiet sanctuary carved from words, preserved for time.”
                </p>
              </div>
            </div>

            {/* HÀNG NÚT THAO TÁC HIỆN ĐẠI (MONOCHROME EDITORIAL ACTIONS) */}
            <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Đọc từ chương 1 */}
                <button
                  type="button"
                  onClick={() => onReadChapter(1)}
                  className="px-5 py-2.5 rounded-xl font-sans font-bold text-xs sm:text-sm bg-stone-900 dark:bg-white text-white dark:text-black hover:bg-stone-800 dark:hover:bg-zinc-200 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>START CHAPTER 1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Mục lục */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('chapters');
                    onScrollToTabs?.();
                  }}
                  className={`px-3.5 py-2.5 rounded-xl font-sans font-semibold text-xs sm:text-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'chapters'
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-black border-transparent shadow-xs'
                      : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>INDEX ({effectiveChapters.length})</span>
                </button>

                {/* Văn án */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('synopsis');
                    onScrollToTabs?.();
                  }}
                  className={`px-3.5 py-2.5 rounded-xl font-sans font-semibold text-xs sm:text-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'synopsis'
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-black border-transparent shadow-xs'
                      : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>SYNOPSIS</span>
                </button>
              </div>

              {/* Chia sẻ */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleQuickShare}
                  className={`p-2 sm:px-3 py-2 rounded-xl border text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                    isCopied
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Share link"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isCopied ? 'COPIED' : 'SHARE'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
