import React, { useState } from 'react';
import {
  BookOpen,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Layers,
  Check,
  Camera,
  StickyNote,
  Tag,
  Pin,
} from 'lucide-react';
import { Novel, NovelChapter } from '../types';

interface NovelDetailNoteCardProps {
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

export const NovelDetailNoteCard: React.FC<NovelDetailNoteCardProps> = ({
  novel,
  effectiveChapters,
  onReadChapter,
  voteCount,
  hasVoted,
  onVote,
  isBookmarked,
  onToggleBookmark,
  activeCoverImage,
  commentsCount,
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
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl border shadow-xl transition-all duration-300 overflow-hidden ${
        isDarkEffective
          ? 'bg-[#1E1F1A] border-amber-900/40 text-amber-100/90 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
          : 'bg-[#FEFCE8] border-amber-200 text-[#422006] shadow-[0_18px_45px_rgba(202,138,4,0.14)]'
      }`}
      style={{
        backgroundImage: isDarkEffective
          ? 'radial-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px)'
          : 'radial-gradient(rgba(180, 130, 40, 0.12) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* MIẾNG BĂNG DÍNH WASHI TAPE TRÊN ĐẦU THẺ */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-28 sm:w-36 h-6 sm:h-7 bg-amber-400/40 dark:bg-amber-500/20 backdrop-blur-xs border border-amber-300/60 dark:border-amber-500/30 rounded-xs shadow-xs rotate-[-1deg] pointer-events-none z-20 flex items-center justify-center">
        <span className="text-[9px] font-mono tracking-widest text-amber-900/60 dark:text-amber-200/60 uppercase select-none font-bold">
          ★ MEMO PAD ★
        </span>
      </div>

      {/* GHIM CẮM TRANG TRÍ Ở GÓC PHẢI */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 pointer-events-none z-20 flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-red-500/80 border border-red-300 shadow-sm flex items-center justify-center">
          <Pin className="w-2.5 h-2.5 text-white" />
        </div>
      </div>

      <div className="p-4 sm:p-7 md:p-9 relative z-10 pt-7 sm:pt-9">
        <div className="flex flex-col md:flex-row gap-5 sm:gap-7 lg:gap-9 items-start">
          {/* CỘT TRÁI: BÌA TRUYỆN DẠNG POLAROID KẸP NOTE */}
          <div className="w-full md:w-auto shrink-0 flex flex-col items-center">
            <div className="relative group">
              {/* Khung ảnh Polaroid với băng dính nhỏ */}
              <div
                className={`p-2.5 sm:p-3 pb-6 sm:pb-8 rounded-xl shadow-md border rotate-[-1.5deg] group-hover:rotate-0 transition-transform duration-300 ${
                  isDarkEffective ? 'bg-[#282922] border-amber-800/40' : 'bg-white border-amber-200'
                }`}
              >
                {/* Washi nhỏ góc ảnh bìa */}
                <div className="absolute -top-2 left-6 w-12 h-4 bg-amber-300/50 dark:bg-amber-600/30 rotate-[-8deg] pointer-events-none z-10 border border-amber-200/60" />
                
                <div className="relative w-36 h-52 sm:w-44 sm:h-64 rounded-lg overflow-hidden shadow-inner bg-amber-100/50">
                  <img
                    src={activeCoverImage}
                    alt={novel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {onOpenCoverModal && (
                    <button
                      type="button"
                      onClick={onOpenCoverModal}
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer shadow-xs"
                      title="Xem ảnh bìa đầy đủ"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <p className="text-[11px] font-mono font-bold tracking-wider text-amber-900/70 dark:text-amber-300/70 truncate max-w-[140px] sm:max-w-[170px] mx-auto">
                    {novel.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Tem mộc tròn "COMPLETED / ĐÃ XONG" */}
            <div className="mt-4 px-3 py-1 rounded-full border border-dashed border-amber-600/60 dark:border-amber-400/50 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-mono text-[11px] font-bold tracking-widest flex items-center gap-1.5">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>STATUS: HOÀN THÀNH</span>
            </div>
          </div>

          {/* CỘT PHẢI: NỘI DUNG GHI CHÚ */}
          <div className="flex-1 min-w-0 w-full space-y-4">
            {/* Header dòng kẻ của note */}
            <div className="border-b-2 border-dashed border-amber-300 dark:border-amber-700/60 pb-3 flex items-start justify-between gap-3 flex-wrap">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-amber-800/80 dark:text-amber-400/80">
                  <span className="flex items-center gap-1 font-bold">
                    <StickyNote className="w-3.5 h-3.5" />
                    GHI CHÚ ĐỌC TRUYỆN
                  </span>
                  <span>•</span>
                  <span>Ngày: {currentDate}</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-amber-950 dark:text-amber-100 leading-snug">
                  {novel.title}
                </h1>
              </div>

              {/* Tag Editor Jouriee65 */}
              <div className="px-3 py-1 rounded-md bg-amber-400/20 dark:bg-amber-500/20 border border-amber-400/40 text-amber-900 dark:text-amber-200 text-xs font-mono font-bold shrink-0">
                EDITOR: Jouriee65
              </div>
            </div>

            {/* Thông tin tác giả & số chương */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <div className="p-2.5 rounded-xl border border-amber-300/60 dark:border-amber-700/40 bg-white/60 dark:bg-amber-950/20">
                <span className="text-[10px] font-mono text-amber-800/70 dark:text-amber-400/70 block uppercase">
                  Tác giả
                </span>
                <span className="font-bold text-amber-950 dark:text-amber-100 truncate block">
                  {authorName}
                </span>
              </div>
              <div className="p-2.5 rounded-xl border border-amber-300/60 dark:border-amber-700/40 bg-white/60 dark:bg-amber-950/20 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono text-amber-800/70 dark:text-amber-400/70 block uppercase">
                  Dung lượng
                </span>
                <span className="font-bold text-amber-950 dark:text-amber-100 block">
                  {effectiveChapters.length} chương
                </span>
              </div>
            </div>

            {/* Thể loại dạng Tag sticker */}
            {novel.tags && novel.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <Tag className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                {novel.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md border border-amber-300 dark:border-amber-700 bg-amber-100/70 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 text-xs font-mono font-medium shadow-2xs"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Trích đoạn ghi chú tóm tắt */}
            <div className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-amber-100/40 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-sans line-clamp-3">
              <span className="font-bold text-amber-950 dark:text-amber-100">Ghi chú nhanh: </span>
              {novel.synopsis || 'Chưa có tóm tắt văn án cho bộ truyện này.'}
            </div>

            {/* Hàng nút bấm Đọc & Tương tác phong cách Note Pad */}
            <div className="pt-2 flex items-center justify-between gap-3 flex-wrap border-t border-dashed border-amber-300 dark:border-amber-700/60">
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => onReadChapter(1)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Đọc từ đầu</span>
                </button>

                {effectiveChapters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const latestNum = novel.latestChapter?.number || effectiveChapters[effectiveChapters.length - 1].chapterNumber;
                      onReadChapter(latestNum);
                    }}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-amber-400/80 dark:border-amber-700 bg-amber-100/80 dark:bg-amber-900/40 hover:bg-amber-200/80 text-amber-950 dark:text-amber-100 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Chương mới nhất</span>
                  </button>
                )}
              </div>

              {/* Tương tác: Lưu, Chia sẻ */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleBookmark}
                  className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                      : 'bg-white/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-white'
                  }`}
                  title={isBookmarked ? 'Đã lưu truyện' : 'Lưu truyện'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{isBookmarked ? 'Đã lưu' : 'Lưu'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickShare}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl border bg-white/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-white text-xs font-bold transition-all cursor-pointer"
                  title="Chia sẻ truyện"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isCopied ? 'Đã chép' : 'Chia sẻ'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
