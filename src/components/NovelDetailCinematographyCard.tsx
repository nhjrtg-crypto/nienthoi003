import React, { useState } from 'react';
import { Play, Eye, Heart, Bookmark, Clapperboard, Film, Camera, Sparkles, CheckCircle2, ChevronRight, Plus, Minus } from 'lucide-react';
import { Novel, NovelChapter } from '../types';
import { getDirectImageUrl, handleCoverImageError } from '../utils/imageUtils';

interface NovelDetailCinematographyCardProps {
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

export const NovelDetailCinematographyCard: React.FC<NovelDetailCinematographyCardProps> = ({
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
  latestChapter,
}) => {
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(true);
  const coverUrl = getDirectImageUrl(novel.coverImage, novel.id || novel.title);
  const authorName = typeof novel.author === 'string' ? novel.author : novel.author?.name || 'Tác giả';
  const genresList = novel.genres || [];

  // Tạo định dạng thời gian YYYY-MM-DD HH:MM AM/PM theo phong cách máy quay điện ảnh
  const formattedTimeRec = (() => {
    const rawDate = novel.updatedAt || novel.createdAt || new Date().toISOString();
    const d = new Date(rawDate);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hh = String(hours).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${minutes} ${ampm}`;
  })();

  // Trích xuất bối cảnh (Location) phù hợp từ thể loại
  const locationSetting = (() => {
    const genreStr = genresList.join(' ').toLowerCase();
    if (genreStr.includes('cổ đại') || genreStr.includes('cung đình')) return 'Kinh Thành Cổ Đại · Hoàng Cung Vương Triều';
    if (genreStr.includes('tiên hiệp') || genreStr.includes('tu chân') || genreStr.includes('huyền huyễn')) return 'Cửu Châu Tiên Giới · Tiên Tông Thánh Địa';
    if (genreStr.includes('tinh tế') || genreStr.includes('khoa huyễn')) return 'Đế Quốc Tinh Tế · Tinh Cầu Biên Giới';
    if (genreStr.includes('mạt thế') || genreStr.includes('vô hạn')) return 'Khu Vực Phế Tích · Mạt Thế Hậu Tận Thế';
    if (genreStr.includes('học đường') || genreStr.includes('thanh xuân')) return 'Khuôn Viên Đại Học · Thành Phố Thanh Xuân';
    return 'Đô Thị Hiện Đại · Trung Tâm Phồn Hoa';
  })();

  // Bầu không khí / Cảm xúc tác phẩm (Atmosphere)
  const atmosphereSetting = (() => {
    if (genresList.length > 0) {
      return `Âm hưởng điện ảnh: ${genresList.join(' · ')} · Nhịp điệu kịch tính, cảm xúc đong đầy`;
    }
    return 'Ánh sáng nghệ thuật điện ảnh, giai điệu tinh tế, câu chuyện lay động tâm can';
  })();

  // Trích xuất câu thoại hoặc đoạn văn tiêu biểu
  const synopsisParagraphs = (novel.synopsis || '').split('\n').filter(p => p.trim().length > 0);
  const firstParagraph = synopsisParagraphs[0] || 'Chào mừng bạn đến với tác phẩm kịch bản điện ảnh.';
  const remainingParagraphs = synopsisParagraphs.slice(1);

  // Tìm một câu trích đoạn phù hợp để hiển thị dạng hội thoại kịch bản
  const sampleDialogue = (() => {
    const quoteMatch = novel.synopsis?.match(/[“"「]([^”"」]+)[”"」]/);
    if (quoteMatch && quoteMatch[1]) {
      return quoteMatch[1];
    }
    if (synopsisParagraphs.length > 1) {
      return synopsisParagraphs[1].replace(/^[^\w\s]+/, '').slice(0, 120) + '...';
    }
    return `Nếu câu chuyện này là một thước phim, mỗi trang chữ đều là một khung hình đầy kỷ niệm.`;
  })();

  return (
    <div className="w-full flex justify-center my-6">
      {/* KHUNG THẺ KỊCH BẢN ĐIỆN ẢNH (CINEMATOGRAPHY CALL SHEET SLATE) */}
      <div
        className={`relative w-full max-w-4xl rounded-2xl sm:rounded-3xl border transition-all duration-300 shadow-2xl overflow-hidden ${
          isDarkEffective
            ? 'bg-[#18181A] border-[#2E2E32] text-neutral-100 shadow-[0_25px_60px_rgba(0,0,0,0.85)]'
            : 'bg-[#FAF9F5] border-[#E2DDD5] text-neutral-900 shadow-[0_20px_50px_rgba(30,25,20,0.12)]'
        }`}
      >
        {/* ================= PHẦN HEADER: CROP MARKS + SCENE/TAKE + CINEMATOGRAPHY + BARCODE ================= */}
        <div className="relative pt-6 px-6 sm:px-10 pb-4">
          {/* CROP MARK GÓC TRÊN BÊN TRÁI ┌ */}
          <div className="absolute top-4 left-4 sm:left-6 w-4 h-4 border-t-2 border-l-2 border-neutral-900 dark:border-neutral-200 pointer-events-none" />

          {/* CROP MARK GÓC TRÊN BÊN PHẢI ┐ */}
          <div className="absolute top-4 right-4 sm:right-6 w-4 h-4 border-t-2 border-r-2 border-neutral-900 dark:border-neutral-200 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* THÔNG SỐ SCENE / TAKE BÊN TRÁI */}
            <div className="flex flex-col items-start font-mono text-left select-none">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-wider text-neutral-900 dark:text-neutral-100">
                <span>SCENE</span>
                <span className="opacity-40">/</span>
                <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                  {totalChaptersCount > 0 ? String(totalChaptersCount).padStart(2, '0') : '01'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-wider text-neutral-900 dark:text-neutral-100">
                <span>TAKE</span>
                <span className="opacity-40">/</span>
                <span className="text-emerald-600 dark:text-emerald-400 uppercase">HOÀN THÀNH</span>
              </div>
            </div>

            {/* CHỮ THƯ PHÁP / CALLIGRAPHY ĐIỆN ẢNH CHÍNH GIỮA */}
            <div className="flex items-center justify-center select-none text-center">
              <div className="flex items-center gap-2">
                <span
                  className="text-3xl sm:text-4xl md:text-5xl tracking-wide italic font-serif text-neutral-900 dark:text-neutral-100 font-normal"
                  style={{
                    fontFamily: 'cursive, "Brush Script MT", "Playfair Display", "Times New Roman", serif',
                    letterSpacing: '1px',
                  }}
                >
                  Cinematography
                </span>
              </div>
            </div>

            {/* MÃ VẠCH (BARCODE) BÊN PHẢI */}
            <div className="flex flex-col items-center sm:items-end select-none">
              <div className="flex items-end h-8 gap-[2px] opacity-85 dark:invert">
                <span className="w-1 h-8 bg-neutral-900" />
                <span className="w-0.5 h-8 bg-neutral-900" />
                <span className="w-1.5 h-8 bg-neutral-900" />
                <span className="w-0.5 h-8 bg-neutral-900" />
                <span className="w-2 h-8 bg-neutral-900" />
                <span className="w-0.5 h-8 bg-neutral-900" />
                <span className="w-1 h-8 bg-neutral-900" />
                <span className="w-2 h-8 bg-neutral-900" />
                <span className="w-0.5 h-8 bg-neutral-900" />
                <span className="w-1 h-8 bg-neutral-900" />
                <span className="w-1.5 h-8 bg-neutral-900" />
                <span className="w-0.5 h-8 bg-neutral-900" />
                <span className="w-1 h-8 bg-neutral-900" />
                <span className="w-2 h-8 bg-neutral-900" />
                <span className="w-0.5 h-8 bg-neutral-900" />
                <span className="w-1 h-8 bg-neutral-900" />
                <span className="w-1.5 h-8 bg-neutral-900" />
                <span className="w-0.5 h-8 bg-neutral-900" />
                <span className="w-2 h-8 bg-neutral-900" />
              </div>
              <span className="text-[9px] font-mono tracking-widest opacity-60 mt-0.5">
                NOVEL-ID: {novel.id.slice(0, 10).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* ================= ĐƯỜNG RÃNH CẮT VÉ RĂNG CƯA + LỖ BẤM HAI ĐẦU (TEAR NOTCHES) ================= */}
        <div className="relative w-full flex items-center my-2 select-none">
          {/* Vết khoét bán nguyệt bên trái */}
          <div
            className={`w-4 sm:w-5 h-8 rounded-r-full shrink-0 border-y border-r ${
              isDarkEffective
                ? 'bg-neutral-950 border-[#2E2E32]'
                : 'bg-neutral-200/70 border-[#E2DDD5]'
            }`}
          />
          {/* Đường nét đứt xé kịch bản xuyên suốt */}
          <div className="flex-1 border-b border-dashed border-neutral-300 dark:border-neutral-700 mx-1" />
          {/* Vết khoét bán nguyệt bên phải */}
          <div
            className={`w-4 sm:w-5 h-8 rounded-l-full shrink-0 border-y border-l ${
              isDarkEffective
                ? 'bg-neutral-950 border-[#2E2E32]'
                : 'bg-neutral-200/70 border-[#E2DDD5]'
            }`}
          />
        </div>

        {/* ================= BẢNG THÔNG SỐ ĐIỆN ẢNH (SLATE METADATA TABLE) ================= */}
        <div className="px-6 sm:px-10 py-3 text-xs sm:text-sm font-mono space-y-3">
          {/* HÀNG 1: TIME REC & LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <span className="block text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 font-semibold mb-0.5">
                TIME REC
              </span>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">{formattedTimeRec}</p>
            </div>
            <div>
              <span className="block text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 font-semibold mb-0.5">
                LOCATION
              </span>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{locationSetting}</p>
            </div>
          </div>

          {/* HÀNG 2: SUBJECT (TÁC GIẢ, EDITOR, DIỄN VIÊN / NHÂN VẬT) */}
          <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <span className="block text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 font-semibold mb-0.5">
              SUBJECT
            </span>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              Tác giả: <span className="underline decoration-dotted underline-offset-2">{authorName}</span> · Người thực hiện (Editor): <span className="font-bold">{novel.translator || 'Jouriee65'}</span> · Tác phẩm: <span className="font-bold">{novel.title}</span>
            </p>
          </div>

          {/* HÀNG 3: ATMOSPHERE (BẦU KHÔNG KHÍ & THỂ LOẠI) */}
          <div className="pb-2">
            <span className="block text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 font-semibold mb-0.5">
              ATMOSPHERE
            </span>
            <p className="font-normal text-neutral-800 dark:text-neutral-200 leading-relaxed">
              {atmosphereSetting}
            </p>
          </div>
        </div>

        {/* ================= KHU VỰC THÂN KỊCH BẢN & BÌA PHIM (SCRIPT & PRODUCTION STILL) ================= */}
        <div className="relative px-6 sm:px-10 py-6 border-t border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {/* WATERMARK CHỮ VIẾT TAY "monology" NHẠT CHẠY CHÌM PHÍA DƯỚI (NHƯ ẢNH MẪU) */}
          <div
            className="absolute right-4 bottom-8 select-none pointer-events-none opacity-[0.04] dark:opacity-[0.05] text-8xl sm:text-9xl italic font-serif leading-none z-0"
            style={{ fontFamily: 'cursive, "Brush Script MT", "Times New Roman", serif' }}
          >
            monology
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
            {/* TẤM ẢNH BÌA TRUYỆN DẠNG PRODUCTION STILL ĐIỆN ẢNH CÓ KHUNG PHIM */}
            <div className="w-full md:w-56 lg:w-64 shrink-0 flex flex-col items-center">
              <div className="relative group w-44 sm:w-52 md:w-full aspect-[2/3] rounded-lg overflow-hidden border-2 border-neutral-800 dark:border-neutral-600 shadow-xl bg-neutral-950">
                {/* Dải phim đục lỗ trang trí trên đầu tấm ảnh */}
                <div className="absolute top-0 inset-x-0 h-4 bg-black/80 flex items-center justify-around px-2 z-10 select-none">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="w-2 h-2 rounded-[2px] bg-white/40" />
                  ))}
                </div>

                <img
                  src={coverUrl}
                  alt={novel.title}
                  onError={(e) => handleCoverImageError(e, novel.title)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Nhãn PRODUCTION STILL */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 bg-black/80 backdrop-blur-xs rounded text-[10px] font-mono text-neutral-200">
                  <span>STILL #01</span>
                  <span className="text-amber-400 font-bold uppercase">CINEMA 35MM</span>
                </div>
              </div>

              {/* THỂ LOẠI DẠNG TAG ĐIỆN ẢNH */}
              <div className="flex flex-wrap gap-1.5 justify-center mt-3 max-w-[240px]">
                {genresList.map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  >
                    #{genre}
                  </span>
                ))}
              </div>
            </div>

            {/* PHẦN KỊCH BẢN VĂN ÁN & ĐỘC THOẠI (SCRIPT FORMATTING) */}
            <div className="flex-1 space-y-4 text-sm sm:text-base leading-relaxed">
              {/* TIÊU ĐỀ HƯỚNG DẪN KỊCH BẢN (SCRIPT DIRECTIVE) */}
              <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400 tracking-wider">
                [KỊCH BẢN PHÂN CẢNH: TRÌNH BÀY VĂN ÁN & ĐỘC THOẠI NHÂN VẬT]
              </div>

              {/* TỰA ĐỀ TRUYỆN HOÀNH TRÁNG */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight font-serif">
                {novel.title}
              </h1>

              {/* ĐOẠN VĂN BẢN VĂN ÁN CHÍNH (CÓ TỪ KHÓA ĐƯỢC ĐÓNG KHUNG NHƯ ẢNH: 重点词 包裹) */}
              <p className="text-neutral-800 dark:text-neutral-200 font-serif leading-relaxed">
                {firstParagraph}
              </p>

              {/* TỪ KHÓA NHẤN MẠNH / ĐIỂM SÁNG TRUYỆN */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                <span className="text-neutral-500">Từ khóa phân cảnh:</span>
                <span className="bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded font-bold text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700">
                  {novel.status === 'completed' ? 'Hoàn thành trọn bộ' : 'Hoàn thành'}
                </span>
                <span className="bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded font-bold text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-800/60">
                  Editor: {novel.translator || 'Jouriee65'}
                </span>
              </div>

              {/* KHỐI ĐỐI THOẠI / ĐỘC THOẠI (DIALOGUE BLOCK VỚI VIỀN ĐEN DÀY & BADGE NHÂN VẬT NHƯ ẢNH MẪU) */}
              <div className="my-4 pl-4 border-l-4 border-neutral-900 dark:border-neutral-100 py-2 bg-neutral-100/50 dark:bg-neutral-900/40 rounded-r-lg">
                <div className="mb-2">
                  <span className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-2 py-0.5 text-[11px] font-mono font-bold tracking-wider rounded-xs uppercase">
                    TRÍCH ĐOẠN ĐẶC SẮC
                  </span>
                </div>
                <blockquote className="text-base sm:text-lg font-serif italic text-neutral-900 dark:text-neutral-100 leading-snug">
                  “{sampleDialogue}”
                </blockquote>
              </div>

              {/* CÁC ĐOẠN VĂN TIẾP THEO (NẾU CÓ) */}
              {remainingParagraphs.length > 0 && (
                <div className="space-y-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-serif leading-relaxed max-h-48 overflow-y-auto pr-2">
                  {remainingParagraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= PHẦN DƯỚI CÙNG (ATTACHMENT I : REAL-TIME STATUS) ================= */}
        <div className="px-6 sm:px-10 pb-6 pt-2">
          {/* NÚT / THANH ATTACHMENT I : REAL-TIME STATUS NHƯ ẢNH */}
          <div
            onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
            className={`w-full rounded-xl border p-3.5 flex items-center justify-between cursor-pointer transition-all ${
              isDarkEffective
                ? 'bg-[#202024] border-[#36363C] hover:border-neutral-500 text-neutral-200'
                : 'bg-[#F2EFE9] border-[#D9D3C7] hover:border-neutral-400 text-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ATTACHMENT I : REAL-TIME STATUS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono opacity-70 hidden sm:inline">
                {totalChaptersCount} CHƯƠNG · {novel.status === 'completed' ? 'HOÀN THÀNH' : 'HOÀN THÀNH'}
              </span>
              {isAttachmentOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {/* NỘI DUNG MỞ RỘNG CỦA ATTACHMENT: CÁC NÚT ĐIỀU KHIỂN ĐỌC TRUYỆN */}
          {isAttachmentOpen && (
            <div className="mt-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành
                </span>
              </div>

              {/* BỘ PHÍM BẮT ĐẦU ĐỌC / TƯƠNG TÁC */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onReadFirstChapter}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-mono font-bold uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 shadow-md transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>ĐỌC TỪ ĐẦU (SCENE 01)</span>
                </button>

                {latestChapter && (
                  <button
                    type="button"
                    onClick={onReadLatestChapter}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-mono font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer"
                    title={`Đọc chương mới nhất: Chương ${latestChapter.chapterNumber}`}
                  >
                    <span>MỚI NHẤT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onBookmarkToggle}
                  className={`p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-500 border-amber-600 text-white'
                      : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                  title={isBookmarked ? 'Đã lưu kịch bản' : 'Lưu vào tủ kịch bản'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
