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
  MessageCircle,
  Paperclip,
} from 'lucide-react';
import { Novel, NovelChapter } from '../types';

interface NovelDetailJournalCardProps {
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

export const NovelDetailJournalCard: React.FC<NovelDetailJournalCardProps> = ({
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

  // Format ngày tháng sổ tay: "2026 年 8 月 20 日 · 周四"
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dayOfWeekStr = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][now.getDay()];

  return (
    <div className="w-full max-w-5xl mx-auto my-3 sm:my-5 px-1 sm:px-2">
      {/* TRANG BÌA & HỒ SƠ TÁC PHẨM TRONG CUỐN SỔ TAY CÒNG (BINDER JOURNAL PROFILE SHEET) */}
      <div
        className={`relative rounded-[28px] sm:rounded-[36px] overflow-hidden border shadow-xl transition-all duration-300 ${
          isDarkEffective
            ? 'bg-[#18191E] border-zinc-700/80 text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
            : 'bg-[#FAF8F5] border-[#E8DFD8] text-[#3D3A37] shadow-[0_16px_40px_rgba(180,160,150,0.18)]'
        }`}
        style={{
          backgroundImage: isDarkEffective
            ? `repeating-linear-gradient(transparent, transparent 33px, rgba(255, 255, 255, 0.035) 33px, rgba(255, 255, 255, 0.035) 34px)`
            : `repeating-linear-gradient(transparent, transparent 33px, rgba(220, 205, 215, 0.3) 33px, rgba(220, 205, 215, 0.3) 34px)`,
          backgroundPosition: '0 48px',
        }}
      >
        {/* 3 LỖ ĐỤC CÒNG SỔ BÊN MÉP TRÁI (THEO ẢNH MẪU) */}
        <div className="absolute left-2.5 sm:left-3.5 top-12 bottom-12 flex flex-col justify-around pointer-events-none select-none z-10">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E8DFD8] dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-inner" />
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E8DFD8] dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-inner" />
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E8DFD8] dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-inner" />
        </div>

        {/* ĐƯỜNG CHỈ NẾP GẤP DỌC MÉP TRÁI SỔ (VERTICAL MARGIN FOLD) */}
        <div className="absolute left-8 sm:left-11 top-0 bottom-0 w-[1px] border-r border-dashed border-[#E5DCD6] dark:border-zinc-700/60 pointer-events-none" />

        {/* NỘI DUNG CHÍNH CỦA TRANG SỔ (LÙI SANG PHẢI ĐỂ CHỪA MÉP CÒNG) */}
        <div className="pl-10 sm:pl-14 pr-4 sm:pr-8 py-5 sm:py-7">
          {/* HEADER PHẦN ĐẦU (THEO ẢNH MẪU): ICON THOẠI 💬 + VẠCH SÓNG |||, TIÊU ĐỀ NỘI TÂM, KẸP GIẤY 📎 VÀ TRÁI TIM 🤍 */}
          <div className="flex items-center justify-between pb-4 border-b border-dashed border-stone-300/80 dark:border-zinc-700/80">
            {/* Cụm biểu tượng thoại & tiêu đề sổ */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-[#E5DCD6] dark:border-zinc-700 flex items-center justify-center text-stone-700 dark:text-zinc-200 shadow-2xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                {/* 3 vạch sóng nhỏ bên dưới như trong ảnh mẫu */}
                <div className="flex items-center gap-[2.5px] mt-1 opacity-60">
                  <span className="w-[1.5px] h-1.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                  <span className="w-[1.5px] h-2.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                  <span className="w-[1.5px] h-1.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-serif font-black tracking-tight leading-none text-stone-900 dark:text-white">
                    THÔNG TIN TRUYỆN
                  </h2>
                  <span className="text-[11px] font-mono text-[#9E5D72] dark:text-pink-400 font-bold hidden xs:inline">
                    · 作品档案
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase opacity-60 mt-0.5">
                  NOVEL PROFILE · SỔ TAY GHI CHÉP
                </p>
              </div>
            </div>

            {/* Cụm kẹp giấy & trái tim theo ảnh mẫu kèm ngày tháng */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Hộp ngày tháng bo góc */}
              <div
                className={`hidden md:flex items-center px-2.5 py-1 rounded-lg border text-xs font-mono font-medium tracking-wide ${
                  isDarkEffective
                    ? 'bg-zinc-800/80 border-zinc-600 text-zinc-300'
                    : 'bg-white/80 border-[#E5CBD7] text-[#6E5462] shadow-2xs'
                }`}
              >
                <span>{year} 年 {month} 月 {day} 日 · {dayOfWeekStr}</span>
              </div>

              {/* Kẹp giấy & Trái tim nghệ thuật như ảnh mẫu */}
              <div className="flex items-center gap-1.5 text-stone-400 dark:text-zinc-500">
                <Paperclip className="w-4 h-4 sm:w-4.5 sm:h-4.5 -rotate-45" />
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>

              {/* Nút tròn Lưu truyện nhanh */}
              <button
                type="button"
                onClick={onToggleBookmark}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#9E5D72] text-white border-[#8B4D61] shadow-xs'
                    : isDarkEffective
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                    : 'bg-white border-stone-300 text-stone-600 hover:bg-stone-50 shadow-2xs'
                }`}
                title={isBookmarked ? 'Đã lưu truyện vào sổ tay' : 'Lưu truyện'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* BỐ CỤC 2 CỘT: ẢNH BÌA POLAROID (+ 照片) VÀ THÔNG TIN BỘ TRUYỆN TRÊN DÒNG KẺ */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 items-start pt-5">
            {/* CỘT 1: ẢNH BÌA DẠNG POLAROID (+ 照片) */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div
                className={`relative w-full max-w-[210px] sm:max-w-[230px] p-2.5 sm:p-3 rounded-2xl border shadow-md transition-transform hover:-rotate-1 ${
                  isDarkEffective
                    ? 'bg-[#15161C] border-zinc-700'
                    : 'bg-white border-[#E5DCD6] shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
                }`}
              >
                {/* Băng dán washi tape góc trên trang trí (sọc chéo Washi Nhật Bản) */}
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 w-24 h-6 shadow-xs rotate-[-1deg] pointer-events-none rounded-2xs"
                  style={{
                    background: isDarkEffective
                      ? 'repeating-linear-gradient(45deg, #831843 0px, #831843 6px, #4c0519 6px, #4c0519 12px)'
                      : 'repeating-linear-gradient(45deg, #fbcfe8 0px, #fbcfe8 6px, #ffffff 6px, #ffffff 12px)',
                    opacity: 0.9,
                    border: isDarkEffective ? '1px solid rgba(251, 113, 133, 0.4)' : '1px solid rgba(244, 114, 182, 0.3)',
                  }}
                />

                <div className="aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 relative group">
                  <img
                    src={activeCoverImage}
                    alt={novel.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80';
                    }}
                  />
                  {onOpenCoverModal && (
                    <button
                      type="button"
                      onClick={onOpenCoverModal}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Xem ảnh bìa</span>
                    </button>
                  )}
                </div>

                {/* Khung nhãn ghi chú ảnh Polaroid */}
                <div className="mt-2.5 pt-2 border-t border-dashed border-stone-200 dark:border-zinc-700/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="opacity-60">+ 照片 · Ảnh bìa</span>
                  <span className="text-[#9E5D72] dark:text-pink-400 font-bold">Jouriee65</span>
                </div>
              </div>

              {/* Các huy hiệu cố định: Hoàn thành & Editor Jouriee65 */}
              <div className="flex items-center gap-1.5 mt-3 flex-wrap justify-center">
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1 ${
                    isDarkEffective
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                      : 'bg-[#EAF5EF] text-[#2D6A4F] border-[#C7E4D3]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Hoàn thành
                </span>

                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                    isDarkEffective
                      ? 'bg-purple-950/40 text-purple-300 border-purple-800/60'
                      : 'bg-[#F4EDF8] text-[#6B3F78] border-[#E1D1E9]'
                  }`}
                >
                  Editor: Jouriee65
                </span>
              </div>
            </div>

            {/* CỘT 2: THÔNG TIN BỘ TRUYỆN TRÊN CÁC DÒNG KẺ SỔ TAY */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-4">
              <div>
                {/* Dòng ghi chú prompt đầu trang */}
                <p className="text-xs sm:text-sm font-mono text-stone-400 dark:text-zinc-500 italic mb-1">
                  今天发生了什么… / Tác phẩm ghi chép:
                </p>

                {/* Tiêu đề truyện */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-snug text-stone-900 dark:text-white">
                  {novel.title}
                </h1>

                {/* Tác giả & Thông số tóm tắt */}
                <div className="flex items-center gap-2 sm:gap-3 mt-2 text-xs sm:text-sm font-sans opacity-85 flex-wrap">
                  <span className="font-medium">
                    Tác giả: <strong className="text-stone-900 dark:text-white">{authorName}</strong>
                  </span>
                  <span className="opacity-40">•</span>
                  <span>{effectiveChapters.length} Chương</span>
                  <span className="opacity-40">•</span>
                  <span>Hoàn thành</span>
                </div>

                {/* Các chip thể loại dạng tem dán sổ tay */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  {(novel.genres && novel.genres.length > 0 ? novel.genres : ['Tiểu thuyết']).map((genre, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-0.5 rounded-md text-xs border ${
                        isDarkEffective
                          ? 'bg-zinc-800/80 text-zinc-300 border-zinc-700'
                          : 'bg-white text-stone-700 border-[#E8DFD8] shadow-2xs'
                      }`}
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Dòng trích dẫn nghệ thuật & Sóng cảm xúc kết nối trực tiếp với ảnh mẫu */}
                <div className="mt-4 pt-3 border-t border-dashed border-stone-200/80 dark:border-zinc-700/80 flex items-center justify-between">
                  <span className="font-serif italic text-sm sm:text-base text-[#9E5D72] dark:text-pink-400 font-medium">
                    It is okay to be a little soft.
                  </span>

                  {/* Cụm trái tim và 5 cột sóng âm cảm xúc (.||||) ở góc phải như ảnh mẫu */}
                  <div className="flex items-center gap-1.5 opacity-60">
                    <Heart className="w-3.5 h-3.5 text-[#9E5D72] dark:text-pink-400" />
                    <div className="flex items-end gap-[2px] h-3.5">
                      <span className="w-[1.5px] h-1.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                      <span className="w-[1.5px] h-2.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                      <span className="w-[1.5px] h-3.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                      <span className="w-[1.5px] h-2.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                      <span className="w-[1.5px] h-1.5 bg-stone-500 dark:bg-zinc-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* HÀNG NÚT THAO TÁC SỔ TAY ĐỒNG BỘ */}
              <div className="pt-3 border-t border-dashed border-stone-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-2.5 flex-wrap">
                {/* Nút Đọc từ Chương 1 */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onReadChapter(1)}
                    className="px-5 py-2.5 rounded-xl font-sans font-bold text-xs sm:text-sm bg-[#9E5D72] hover:bg-[#8B4D61] text-white shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Đọc từ Chương 1</span>
                  </button>

                  {/* Nút Xem Mục Lục */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('chapters');
                      onScrollToTabs?.();
                    }}
                    className={`px-3.5 py-2.5 rounded-xl font-sans font-semibold text-xs sm:text-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'chapters'
                        ? 'bg-[#9E5D72] text-white border-[#9E5D72] shadow-xs'
                        : isDarkEffective
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                        : 'bg-white hover:bg-[#FDF9F7] text-[#5A4552] border-[#E8DFD8] shadow-2xs'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Mục lục ({effectiveChapters.length})</span>
                  </button>

                  {/* Nút Xem Giới Thiệu / Văn Án */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('synopsis');
                      onScrollToTabs?.();
                    }}
                    className={`px-3.5 py-2.5 rounded-xl font-sans font-semibold text-xs sm:text-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'synopsis'
                        ? 'bg-[#9E5D72] text-white border-[#9E5D72] shadow-xs'
                        : isDarkEffective
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                        : 'bg-white hover:bg-[#FDF9F7] text-[#5A4552] border-[#E8DFD8] shadow-2xs'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Văn án · 内心想法</span>
                  </button>
                </div>

                {/* Chia sẻ */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={handleQuickShare}
                    className={`p-2 sm:px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                      isCopied
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : isDarkEffective
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-2xs'
                    }`}
                    title="Sao chép liên kết truyện"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isCopied ? 'Đã chép' : 'Chia sẻ'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
