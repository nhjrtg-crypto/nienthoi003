import React from 'react';
import { Play, Disc, Music, Eye, Heart, Bookmark, List, Sparkles, Volume2, Radio } from 'lucide-react';
import { Novel, NovelChapter } from '../types';
import { getDirectImageUrl, handleCoverImageError } from '../utils/imageUtils';

interface NovelDetailCassetteCardProps {
  novel: Novel;
  isDarkEffective: boolean;
  effectiveWorldLore?: string;
  onReadFirstChapter?: () => void;
  onReadLatestChapter?: () => void;
  onNavigateChapter?: (chapter: NovelChapter) => void;
  onBookmarkToggle?: () => void;
  isBookmarked?: boolean;
  onLikeToggle?: () => void;
  isLiked?: boolean;
  totalChaptersCount?: number;
  latestChapter?: NovelChapter | null;
}

export const NovelDetailCassetteCard: React.FC<NovelDetailCassetteCardProps> = ({
  novel,
  isDarkEffective,
  effectiveWorldLore,
  onReadFirstChapter,
  onReadLatestChapter,
  onBookmarkToggle,
  isBookmarked,
  onLikeToggle,
  isLiked,
  totalChaptersCount = 0,
}) => {
  const coverUrl = getDirectImageUrl(novel.coverImage, novel.id || novel.title);
  const authorName = typeof novel.author === 'string' ? novel.author : novel.author?.name || 'Tác giả';
  const genresList = novel.genres || [];

  return (
    <div
      className={`relative w-full rounded-3xl p-6 sm:p-8 md:p-10 border transition-all duration-300 overflow-hidden ${
        isDarkEffective
          ? 'bg-[#181519] border-[#382d3b] text-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
          : 'bg-[#FBF8F5] border-[#E5DACF] text-neutral-800 shadow-[0_16px_40px_rgba(120,80,60,0.12)]'
      }`}
    >
      {/* Vỏ nhựa mica bóng trên góc (hiệu ứng phản chiếu của hộp băng) */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none rounded-bl-full" />
      <div className="absolute top-4 left-6 flex items-center gap-1.5 opacity-60">
        <span className="w-2.5 h-2.5 rounded-full border border-current" />
        <span className="w-2.5 h-2.5 rounded-full border border-current" />
        <span className="text-[10px] font-mono tracking-widest uppercase ml-1">STEREO CASSETTE · CH-60 TYPE I</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 pt-6 relative z-10">
        {/* KHUNG BĂNG CASSETTE TRỰC QUAN */}
        <div className="w-full sm:w-80 md:w-96 shrink-0 flex flex-col items-center">
          <div
            className={`w-full aspect-[16/10] rounded-2xl border-2 p-3 sm:p-4 flex flex-col justify-between relative shadow-xl ${
              isDarkEffective
                ? 'bg-[#221B24] border-[#4A3B4F] shadow-purple-950/20'
                : 'bg-[#2D282E] border-[#453D47] text-white shadow-neutral-900/30'
            }`}
          >
            {/* Nhãn tem dán trên thân băng */}
            <div className="w-full bg-[#FAF3E0] text-neutral-900 rounded-lg p-2.5 sm:p-3 shadow-inner border border-neutral-300/80">
              <div className="flex items-center justify-between border-b border-dashed border-neutral-400 pb-1 mb-1.5">
                <span className="font-mono text-[10px] font-black uppercase tracking-wider text-rose-700">SIDE A · HI-FI TAPE</span>
                <span className="font-mono text-[10px] font-semibold text-neutral-600">NR [NOISE REDUCTION]</span>
              </div>
              <p className="font-mono text-xs sm:text-sm font-black truncate text-neutral-900">{novel.title}</p>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-600 mt-0.5">
                <span>Tác giả: {authorName}</span>
                <span>Edit: {novel.translator || 'Jouriee65'}</span>
              </div>
            </div>

            {/* CỬA SỔ BĂNG TỪ VỚI 2 BÁNH RĂNG XOAY (SPOOLS) */}
            <div className="my-auto py-2 flex items-center justify-center gap-6 relative">
              {/* Lõi bánh răng trái */}
              <div className="w-12 h-12 rounded-full border-4 border-amber-600/60 bg-neutral-900 flex items-center justify-center relative shadow-inner animate-[spin_12s_linear_infinite]">
                <div className="w-6 h-6 rounded-full border border-dashed border-amber-400/80 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-amber-600/40" />
                </div>
              </div>

              {/* Dải cuộn băng từ ở giữa & vạch thước đo thời lượng */}
              <div className="h-8 px-4 rounded bg-neutral-900/90 border border-neutral-700 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1">
                  {[40, 70, 90, 50, 85, 30, 95, 60, 45, 80].map((h, i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-rose-500 rounded-full animate-pulse"
                      style={{ height: `${(h / 100) * 18}px`, animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-neutral-400 mt-0.5 tracking-widest">COUNTER: 0048</span>
              </div>

              {/* Lõi bánh răng phải */}
              <div className="w-12 h-12 rounded-full border-4 border-amber-600/60 bg-neutral-900 flex items-center justify-center relative shadow-inner animate-[spin_12s_linear_infinite]">
                <div className="w-6 h-6 rounded-full border border-dashed border-amber-400/80 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-amber-600/40" />
                </div>
              </div>
            </div>

            {/* Chân cắm nam châm & ốc vít 4 góc */}
            <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 pt-1 border-t border-neutral-800">
              <span>● JAPAN MECHANISM</span>
              <span className="text-rose-400 font-bold">HOÀN THÀNH</span>
              <span>PLAYBACK EQ 120µS</span>
            </div>
          </div>

          {/* BẢNG ĐIỀU KHIỂN PHÁT CASSETTE DECK */}
          <div className="w-full mt-4 flex items-center justify-between gap-2 p-2 rounded-2xl bg-neutral-200 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-800 shadow-inner">
            <button
              type="button"
              onClick={onReadFirstChapter}
              className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>PLAY TAPE (ĐỌC ĐẦU)</span>
            </button>
            <button
              type="button"
              onClick={onReadLatestChapter}
              className="py-2 px-3 rounded-xl bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-400 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-mono text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Tua đến chương mới nhất"
            >
              <Disc className="w-3.5 h-3.5" />
              <span>LATEST</span>
            </button>
          </div>
        </div>

        {/* THÔNG TIN CHI TIẾT TÁC PHẨM DẠNG TRACKLIST & VĂN ÁN BĂNG NHẠC */}
        <div className="flex-1 flex flex-col justify-between w-full space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2.5 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold flex items-center gap-1">
                <Music className="w-3 h-3" />
                <span>ALBUM BĂNG TỪ #{novel.id}</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold">
                {totalChaptersCount} TRACKS (CHƯƠNG)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                HOÀN THÀNH
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              {novel.title}
            </h1>
            <p className="text-sm font-mono opacity-70 mt-1">
              Ca từ / Tác giả: <strong className="font-semibold">{authorName}</strong> · Phối khí / Editor: <strong className="font-semibold">{novel.translator || 'Jouriee65'}</strong>
            </p>

            {/* CÁC THỂ LOẠI NHƯ CÁC GENRE ÂM NHẠC */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {genresList.map((g, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-neutral-200 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                >
                  #{g}
                </span>
              ))}
            </div>

            {/* VĂN ÁN TÁC PHẨM (TRACK LINER NOTES) */}
            <div className="mt-4 p-4 rounded-2xl bg-neutral-100/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-sm sm:text-base leading-relaxed line-clamp-4 relative">
              <span className="font-mono text-[10px] uppercase font-bold text-rose-500 tracking-wider block mb-1">
                ♪ LINER NOTES & LỜI ĐỀ TỰA
              </span>
              <p className="opacity-90">{novel.synopsis}</p>
            </div>

            {/* THIẾT LẬP THẾ GIỚI NẾU CÓ */}
            {effectiveWorldLore && (
              <div className="mt-2.5 text-xs font-mono opacity-80 italic">
                ★ Thiết lập âm hưởng: {effectiveWorldLore.slice(0, 100)}...
              </div>
            )}
          </div>

          {/* CHỈ SỐ TƯƠNG TÁC & NÚT THAO TÁC NHANH */}
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-xs font-mono opacity-75">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">HOÀN THÀNH</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBookmarkToggle}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isBookmarked
                    ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-amber-400'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'ĐÃ LƯU TAPE' : 'LƯU VÀO GIÁ'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
