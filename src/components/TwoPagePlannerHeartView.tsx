import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Feather,
  MessageCircle,
  PenTool,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import {
  subscribeLikes,
  incrementLike,
  subscribeGuestNotes,
  addGuestNote,
  D1GuestNote as IntroGuestNote,
} from '../services/d1Service';
import { safeStorage } from '../utils/safeStorage';

/**
 * =========================================================================
 * 1. HÀM TẠO SVG PATTERN NỀN NGÔI SAO 5 CÁNH TRẮNG XẾP SO LE, THƯA THOÁNG
 * =========================================================================
 * - Màu nền: Hồng pastel nhẹ nhàng (#FDF2F8)
 * - Họa tiết: Ngôi sao 5 cánh màu trắng (#FFFFFF)
 * - Bố cục: Xếp so le đan xen (staggered tile 68x68px), thưa thoáng, dịu mắt
 * - Điểm xuyết: Chấm tinh tú li ti mờ ảo
 */
export function createSweetStarsSvgPattern(width = 68, height = 68): string {
  const svgContent = `
    <g fill="#ffffff" opacity="0.92">
      <!-- Hàng 1: Ngôi sao 5 cánh ở giữa (34, 17) -->
      <g transform="translate(34, 17)">
        <polygon points="0,-7 2.1,-2.4 7,-2 3.3,1.5 4.3,6.5 0,3.9 -4.3,6.5 -3.3,1.5 -7,-2 -2.1,-2.4" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
      </g>

      <!-- Hàng 2: Ngôi sao 5 cánh so le ở 2 mép (0, 51) và (68, 51) -->
      <g transform="translate(0, 51)">
        <polygon points="0,-7 2.1,-2.4 7,-2 3.3,1.5 4.3,6.5 0,3.9 -4.3,6.5 -3.3,1.5 -7,-2 -2.1,-2.4" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
      </g>
      <g transform="translate(68, 51)">
        <polygon points="0,-7 2.1,-2.4 7,-2 3.3,1.5 4.3,6.5 0,3.9 -4.3,6.5 -3.3,1.5 -7,-2 -2.1,-2.4" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
      </g>

      <!-- Chấm tinh tú li ti thoáng đãng -->
      <circle cx="0" cy="17" r="1.2" opacity="0.45" />
      <circle cx="68" cy="17" r="1.2" opacity="0.45" />
      <circle cx="34" cy="51" r="1.2" opacity="0.45" />
    </g>
  `;
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(fullSvg)}")`;
}

// Giữ lại alias để tương thích ngược nếu có component khác gọi
export const createSweetHeartsSvgPattern = createSweetStarsSvgPattern;

/**
 * Icon ngôi sao 5 cánh bo tròn góc (Cute 5-Point Rounded Star SVG)
 */
export const RoundedStar5: React.FC<{ size?: number; className?: string }> = ({
  size = 12,
  className = '',
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 align-middle ${className}`}
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2.8 14.9 8.8 21.4 9.5 16.5 14 17.9 20.5 12 17.1 6.1 20.5 7.5 14 2.6 9.5 9.1 8.8 12 2.8" />
  </svg>
);

/**
 * Âm thanh đã được vô hiệu hóa hoàn toàn theo yêu cầu (Website không phát âm thanh)
 */
function playCuteChime(_type?: 'sparkle' | 'pop' | 'success') {
  // Hoàn toàn không phát âm thanh
}

export interface GuestNoteItem {
  id: string;
  author: string;
  content: string;
  time: string;
}

export interface TwoPagePlannerHeartViewProps {
  onBackToNovels?: () => void;
  initialHearts?: number;
  currentOption?: 'style1' | 'style2' | 'option2' | 'option3' | 'option4';
  onChangeOption?: (opt: 'style1' | 'style2') => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const TwoPagePlannerHeartView: React.FC<TwoPagePlannerHeartViewProps> = ({
  onBackToNovels,
  initialHearts = 0,
  currentOption = 'style1',
  onChangeOption,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  // Trạng thái thả tim (Mặc định bắt đầu từ 30, đồng bộ thời gian thực từ Cloudflare D1)
  const [heartsCount, setHeartsCount] = useState<number>(() => {
    try {
      const saved =
        safeStorage.getItem('cf_d1_like_intro_page') ||
        safeStorage.getItem('cf_d1_like_intro_style1') ||
        safeStorage.getItem('cf_d1_like_intro_style2');
      if (saved) {
        const p = parseInt(saved, 10);
        if (!isNaN(p) && p >= 30 && p !== 521) return p;
      }
    } catch {}
    return initialHearts > 0 ? initialHearts : 30;
  });

  const [hasLiked, setHasLiked] = useState<boolean>(() => {
    try {
      return (
        safeStorage.getItem('cosmo_has_liked_intro') === 'true' ||
        safeStorage.getItem('cosmo_has_liked_style1') === 'true' ||
        safeStorage.getItem('cosmo_has_liked_tama') === 'true'
      );
    } catch {
      return false;
    }
  });

  // Trạng thái sao chép link Wattpad & WordPress
  const [copiedWattpad, setCopiedWattpad] = useState<boolean>(false);
  const [copiedWordpress, setCopiedWordpress] = useState<boolean>(false);

  // Trạng thái Toast thông báo nổi
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 2400);
  };

  // Trạng thái danh sách lưu bút độc giả (Guestbook) - Khởi tạo rỗng, đồng bộ từ Firestore
  const [guestNotes, setGuestNotes] = useState<IntroGuestNote[]>([]);
  const [isSubmittingNote, setIsSubmittingNote] = useState<boolean>(false);

  // Lắng nghe dữ liệu thời gian thực từ Cloudflare D1 (Database 2 INTRO_DB)
  useEffect(() => {
    // Xóa bộ nhớ đệm cục bộ cũ nếu có
    try {
      safeStorage.removeItem('cosmo_style1_notes');
    } catch {}

    const unsubHearts = subscribeLikes('intro_page', (count) => {
      setHeartsCount(count);
    });
    const unsubNotes = subscribeGuestNotes('style1', (notes) => {
      setGuestNotes(notes);
    });

    return () => {
      unsubHearts();
      unsubNotes();
    };
  }, []);

  const [guestAuthorInput, setGuestAuthorInput] = useState<string>('');
  const [guestContentInput, setGuestContentInput] = useState<string>('');
  const [guestBookPage, setGuestBookPage] = useState<number>(1);

  // Xử lý thả tim (Giới hạn 1 trình duyệt chỉ thả tim được 1 lần - không phát âm thanh pop)
  const handleLike = () => {
    if (hasLiked) {
      showToast('Bạn đã thả tim rồi nè, cảm ơn bạn rất nhiều! (｡♥‿♥｡)');
      return;
    }

    setHasLiked(true);
    const nextHearts = Math.max(heartsCount + 1, 31);
    setHeartsCount(nextHearts);
    try {
      safeStorage.setItem('cf_d1_like_intro_page', String(nextHearts));
      safeStorage.setItem('cf_d1_like_intro_style1', String(nextHearts));
      safeStorage.setItem('cf_d1_like_intro_style2', String(nextHearts));
      safeStorage.setItem('cosmo_has_liked_intro', 'true');
      safeStorage.setItem('cosmo_has_liked_style1', 'true');
      safeStorage.setItem('cosmo_has_liked_tama', 'true');
    } catch {}

    incrementLike('intro_page', 1).catch(() => {});
    showToast('Cảm ơn bạn đã thả tim ủng hộ! (づ｡◕‿‿◕｡)づ 💖');
  };

  // Sao chép liên kết
  const handleCopy = (text: string, type: 'wattpad' | 'wordpress') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      playCuteChime('success');
      if (type === 'wattpad') {
        setCopiedWattpad(true);
        setTimeout(() => setCopiedWattpad(false), 2000);
        showToast('Đã sao chép liên kết Wattpad! 📋✨');
      } else {
        setCopiedWordpress(true);
        setTimeout(() => setCopiedWordpress(false), 2000);
        showToast('Đã sao chép liên kết WordPress! 📋✨');
      }
    }
  };

  // Thêm tin nhắn vào sổ (Lưu thật vào Cloudflare D1 - Database 2)
  const handleAddGuestNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestContentInput.trim()) {
      showToast('Bạn hãy nhập vài dòng lời nhắn trước khi gửi nhé! 🌸');
      return;
    }
    const author = guestAuthorInput.trim() || 'Bạn đọc ẩn danh ♡';
    const content = guestContentInput.trim();
    setIsSubmittingNote(true);
    try {
      await addGuestNote('style1', author, content);
      setGuestAuthorInput('');
      setGuestContentInput('');
      setGuestBookPage(1);
      playCuteChime('sparkle');
      showToast(`Đã lưu lời nhắn của "${author}" vào sổ! 💌✨`);
    } catch (err) {
      console.error('[TwoPagePlannerHeartView] Error saving note:', err);
      showToast('Không thể gửi lời nhắn, vui lòng thử lại! 🌸');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Phân trang tin nhắn: 4 tin/trang
  const NOTES_PER_PAGE = 4;
  const totalPages = Math.max(1, Math.ceil(guestNotes.length / NOTES_PER_PAGE));
  const safePage = Math.min(guestBookPage, totalPages);
  const currentNotes = guestNotes.slice(
    (safePage - 1) * NOTES_PER_PAGE,
    safePage * NOTES_PER_PAGE
  );

  return (
    <div
      className="planner-root-wrapper relative min-h-screen w-full font-vietnam antialiased text-stone-800 overflow-x-hidden p-3 sm:p-6 md:p-8 pt-4 sm:pt-6 pb-16 sm:pb-24"
      style={{
        backgroundColor: '#FDF2F8', // Nền hồng pastel nhạt hơn, dịu êm thanh thoát
      }}
    >
      {/* ========================================================================= */}
      {/* 1. LỚP NỀN NGÔI SAO 5 CÁNH TRẮNG XẾP SO LE, THƯA THOÁNG                    */}
      {/* ========================================================================= */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-80"
        style={{
          backgroundImage: createSweetStarsSvgPattern(68, 68),
          backgroundRepeat: 'repeat',
          backgroundPosition: '0 0',
        }}
      />

      {/* ========================================================================= */}
      {/* 2. TOAST NOTIFICATION THÔNG BÁO NỔI PHONG CÁCH TIỆM BÁNH (FONT ITIM, CỠ 12PX) */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none">
          <div className="cute-toast-pill px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white text-[12px] shadow-[0_12px_32px_rgba(244,114,182,0.45)] border-2 border-white/70 flex items-center gap-2 select-none tracking-wide">
            <span className="text-sm select-none">🎀</span>
            <span className="font-itim text-[12px] leading-none">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. THANH ĐIỀU HƯỚNG NHỎ TRÊN CÙNG (HEADER BAR)                           */}
      {/* ========================================================================= */}
      <header className="relative z-20 max-w-5xl mx-auto mb-6 sm:mb-8 md:mb-10">
        <div className="backdrop-blur-md bg-white/90 border-2 border-pink-200/90 rounded-full px-3 sm:px-4 py-2 shadow-sm flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              playCuteChime('sparkle');
              if (onBackToNovels) onBackToNovels();
              else showToast('Quay lại trang danh sách truyện');
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full text-pink-700 bg-pink-100 hover:bg-pink-200 border border-pink-300 transition-all cursor-pointer active:scale-95 shadow-xs shrink-0"
            title="Về đọc truyện"
            aria-label="Về đọc truyện"
          >
            <ArrowLeft className="w-4 h-4 text-pink-600" />
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {/* Chuyển đổi giữa Style 1 và Style 2 */}
            {onChangeOption && (
              <div className="p-1 rounded-full border border-pink-200 bg-pink-50 flex items-center shadow-inner text-xs">
                <button
                  type="button"
                  onClick={() => onChangeOption('style1')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    currentOption === 'style1' || !currentOption
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                      : 'text-pink-700 hover:text-pink-900'
                  }`}
                  title="Style 1: Sổ Kế Hoạch 2 Mặt Nền Ngôi Sao"
                >
                  Style 1
                </button>
                <button
                  type="button"
                  onClick={() => onChangeOption('style2')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    currentOption === 'style2'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                      : 'text-pink-700 hover:text-pink-900'
                  }`}
                  title="Style 2: Máy Trứng Tamagotchi Pastel"
                >
                  Style 2
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 4. CUỐN SỔ KẾ HOẠCH 2 MẶT (OPEN TWO-PAGE SPIRAL PLANNER SPREAD)           */}
      {/* ========================================================================= */}
      <main className="relative z-10 max-w-6xl mx-auto py-8 sm:py-12 md:py-16 my-2 sm:my-4">
        {/* BÌA CUỐN SỔ MỞ ĐÔI (OPEN BINDER LEATHER SPREAD) */}
        <div className="neumorph-pink-board relative rounded-[36px] sm:rounded-[48px] md:rounded-[56px] p-3 sm:p-5 md:p-6 lg:p-7 shadow-[0_28px_70px_rgba(244,114,182,0.28)]">
          {/* ĐƯỜNG RÃNH CHỈ DẬP NỔI 3D CHẠY QUANH BỀ MẶT BÌA SỔ */}
          <div className="absolute inset-1.5 sm:inset-2.5 rounded-[28px] sm:rounded-[40px] md:rounded-[44px] pointer-events-none border border-pink-300/60 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.95),0_1.5px_3px_rgba(244,114,182,0.18)] z-10 select-none" />

          {/* BỐ CỤC 2 MẶT CUỐN SỔ (TWO-PAGE OPEN SPREAD CONTAINER) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 lg:gap-8 items-stretch pb-4 sm:pb-6">
            
            {/* CỘT CÒNG XOẮN LÒ XO ĐÔI Ở CHÍNH GIỮA 2 TRANG SỔ (CENTRAL SPIRAL BINDING SPINE) */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-8 flex-col justify-between items-center pointer-events-none z-30 select-none">
              {Array.from({ length: 22 }).map((_, i) => (
                <div key={i} className="relative w-full h-4 flex items-center justify-between group">
                  {/* Lỗ đục trang trái - Debossed Inset */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#edd5db] border border-pink-200 shadow-[inset_1.5px_2px_4px_rgba(0,0,0,0.35)]" />
                  {/* Vòng còng xoắn kim loại rose-gold 3D bắc ngang qua 2 mép trang */}
                  <div
                    className="animate-cute-spiral flex-1 -mx-0.5 h-2 rounded-full bg-gradient-to-r from-rose-400 via-pink-100 to-amber-200 border border-rose-300 shadow-[0_3px_6px_rgba(0,0,0,0.18),inset_0_1px_1px_#ffffff]"
                    style={{
                      animationDelay: `${(i % 5) * 0.45}s`,
                    }}
                  />
                  {/* Lỗ đục trang phải - Debossed Inset */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#edd5db] border border-pink-200 shadow-[inset_1.5px_2px_4px_rgba(0,0,0,0.35)]" />
                </div>
              ))}
            </div>

            {/* =================================================================== */}
            {/* MẶT TRÁI (LEFT PAGE): LỜI CHÀO, CẢNH BÁO 18+ & HẠ TẦNG KỸ THUẬT   */}
            {/* =================================================================== */}
            <div className="relative flex-1 flex flex-col justify-between">
              {/* Lớp giấy xếp chồng tầng 2 (Sub-layer 2) */}
              <div className="absolute -bottom-3 inset-x-4 sm:inset-x-6 top-6 bg-[#F8D1E0] rounded-[24px] sm:rounded-[32px] border-b-2 border-black/15 shadow-[0_4px_8px_rgba(0,0,0,0.06)] pointer-events-none z-0" />
              {/* Lớp giấy xếp chồng tầng 1 (Sub-layer 1) */}
              <div className="absolute -bottom-1.5 inset-x-2 sm:inset-x-3 top-3 bg-[#FCE6EE] rounded-[26px] sm:rounded-[34px] border-b-2 border-black/10 shadow-[0_2px_4px_rgba(0,0,0,0.04)] pointer-events-none z-0" />

              {/* Lớp giấy chính (Main Paper Block) */}
              <div
                className="neumorph-pink-paper rounded-[28px] sm:rounded-[36px] border-2 border-pink-200/90 p-4 sm:p-5 md:px-5.5 md:py-4 space-y-4 sm:space-y-5 md:space-y-3.5 flex flex-col justify-between relative overflow-hidden z-10 h-full"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgba(244, 114, 182, 0.08) 1px, transparent 1px), linear-gradient(rgba(244, 114, 182, 0.08) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              >
                {/* Header trang trái: Tem Planner & Thả tim */}
                <div className="flex items-center justify-between border-b-2 border-dashed border-pink-200/80 pb-2.5 md:pb-2">
                  <div className="flex items-center gap-2">
                    <span className="neumorph-pink-pill px-3 py-0.5 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 text-pink-700 hover:scale-105 transition-transform duration-200">
                      <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                      <span>PLANNER · TRANG 01</span>
                    </span>
                    <span className="text-[11px] text-pink-600/80 font-mono hidden sm:inline">
                      DATE: 2026
                    </span>
                  </div>

                  {/* Nút thả tim kèm hiệu ứng wiggle */}
                  <button
                    type="button"
                    onClick={handleLike}
                    className="neumorph-pink-btn flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer select-none text-rose-600 hover:scale-105 active:scale-95 transition-all group"
                    title="Thả tim cho trang"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform group-hover:scale-125 ${
                        hasLiked
                          ? 'text-rose-500 fill-rose-500 animate-cute-heart-wiggle'
                          : 'text-rose-500'
                      }`}
                    />
                    <span>{heartsCount}</span>
                  </button>
                </div>

                {/* TIÊU ĐỀ SỔ VIẾT TRỰC TIẾP LÊN MẶT GIẤY (KÈM BỤI SAO 5 CÁNH BO TRÒN XOAY 360 ĐỘ) */}
                <div className="text-center pt-1 pb-1 md:pt-0 md:pb-0.5">
                  <div className="relative inline-block">
                    <span className="absolute -inset-x-2 -bottom-1 top-2 bg-pink-200/50 -rotate-1 rounded-sm -z-0 pointer-events-none" />
                    
                    {/* Bụi sao lấp lánh đa tầng quanh tiêu đề */}
                    <span className="sparkle-text-wrapper relative z-10 text-xl sm:text-2xl md:text-[23px] font-bold text-stone-900 tracking-wide font-itim">
                      {/* Sao lớn xoay sau: Hồng nhạt pastel */}
                      <span
                        className="absolute -top-2 left-[25%] z-0 pointer-events-none select-none text-pink-300 star-anim-spin-a leading-none"
                        aria-hidden="true"
                      >
                        <RoundedStar5 size={13.5} />
                      </span>
                      {/* Sao vừa xoay tròn: Hồng đậm ngọt ngào */}
                      <span
                        className="absolute -bottom-1.5 right-[22%] z-0 pointer-events-none select-none text-pink-500 star-anim-spin-c leading-none"
                        aria-hidden="true"
                      >
                        <RoundedStar5 size={11} />
                      </span>

                      {/* Nội dung chữ gốc */}
                      <span className="relative z-10 font-itim">[ SỔ GHI CHÚ GIỚI THIỆU ]</span>

                      {/* Sao lớn xoay trước: Hồng nhạt */}
                      <span
                        className="absolute -top-2 -right-1.5 z-20 pointer-events-none select-none text-pink-300 star-anim-spin-b leading-none"
                        aria-hidden="true"
                      >
                        <RoundedStar5 size={14} />
                      </span>
                      {/* Sao nhỏ nhấp nháy mép trái */}
                      <span
                        className="absolute top-[20%] -left-2 z-20 pointer-events-none select-none text-rose-200 star-anim-twinkle-b leading-none"
                        aria-hidden="true"
                      >
                        <RoundedStar5 size={9.5} />
                      </span>
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 font-source-serif italic mt-1.5 md:mt-0.5 flex items-center justify-center gap-1">
                    <span>Chào mừng các bạn ghé thăm trang web</span>
                    <span className="inline-block text-pink-500">♡</span>
                  </p>
                </div>

                {/* CÁC NỘI DUNG TRÊN TRANG TRÁI */}
                <div className="space-y-4 pt-1 md:pt-0">
                  {/* MỤC 1: LỜI NGỎ TỪ EDITOR */}
                  <div className="space-y-2 py-1 px-1 md:py-0 md:space-y-1.5 md:-mt-3.5 md:mb-5">
                    <div className="flex items-center justify-between border-b border-pink-200/80 pb-1">
                      <div className="flex items-center gap-1.5 group cursor-default">
                        <Feather className="w-4 h-4 text-pink-600 group-hover:rotate-12 transition-transform duration-300" />
                        <h3 className="text-sm font-bold text-pink-950 font-source-serif tracking-wide">
                          Lời Ngỏ · Note 01
                        </h3>
                      </div>

                      {/* TEM TRÒN CON DẤU BƯU CHÍNH (CIRCULAR POSTAL STAMP) */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed p-1 flex items-center justify-center -rotate-12 select-none opacity-85 hover:opacity-100 hover:rotate-0 hover:scale-110 shrink-0 border-[#A36577]/75 shadow-[0_2px_6px_rgba(163,101,119,0.12)] transition-all duration-300 -my-2.5 sm:-my-3 cursor-default">
                        <div className="w-full h-full rounded-full border border-[#A36577]/50 flex flex-col items-center justify-center text-center">
                          <span className="text-[6px] sm:text-[6.5px] font-mono font-black tracking-widest uppercase text-[#854556] leading-none">
                            POST OFFICE
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-source-serif font-black leading-none my-0.5 text-[#854556]">
                            DIARY
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-source-serif font-bold leading-none text-[#854556]">
                            074.
                          </span>
                          <span className="text-[5.5px] sm:text-[6px] font-mono mt-0.5 text-[#854556]/85 tracking-wider uppercase leading-none">
                            NIÊN THỜI
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-1 px-1.5 space-y-2 md:space-y-1 text-sm sm:text-base md:text-[14.5px] text-stone-800 leading-relaxed md:leading-[1.55] font-livvic">
                      <p>
                        Trang web được xây dựng nhằm mục đích đăng tải và lưu giữ những bộ truyện mình đã edit hoàn tất.
                      </p>
                      <p className="text-stone-700">
                        Mọi tác phẩm trên web chỉ phục vụ duy nhất cho mục đích giải trí phi thương mại. Hy vọng nơi đây sẽ mang lại cho bạn những phút giây thư giãn!
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 md:pt-0.5 text-xs sm:text-sm">
                      <span className="text-xs font-mono text-pink-500 font-medium hover:text-pink-600 transition-colors">
                        #dammy #hoanthanh #nienthoi
                      </span>
                      <span className="font-source-serif italic font-bold text-pink-700 text-sm hover:scale-105 transition-transform inline-block">
                        — Jouriee65
                      </span>
                    </div>
                  </div>

                  {/* MỤC 2: CẢNH BÁO NỘI DUNG 18+ - MẨU NOTE HỒNG NHẠT SKEUOMORPHIC 3D */}
                  <div className="group/memo2 neumorph-memo-pale-pink relative p-4 sm:p-5 md:p-3.5 md:py-3 rounded-2xl md:mt-5 bg-[#fff5f8] border border-pink-200/90 text-stone-900 rotate-[-1deg] hover:rotate-0 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default space-y-2.5 md:space-y-2 font-itim">
                    {/* ĐINH GHIM TRÒN HỒNG NHẠT 3D SKEUOMORPHIC */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none select-none z-20 drop-shadow-[2px_5px_4px_rgba(0,0,0,0.22)] group-hover/memo2:rotate-12 transition-transform duration-300">
                      {/* Bóng đổ đầu kim loại */}
                      <div className="w-1.5 h-3 bg-stone-500/35 rounded-full blur-[0.6px] translate-x-1.5 translate-y-1.5 rotate-45" />
                      {/* Đầu đinh ghim tròn 3D */}
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-400 via-pink-200 to-pink-100 border border-white/90 shadow-[inset_0_2px_2px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(244,114,182,0.45)] relative -mt-3.5 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/95 absolute top-0.5 left-0.5 blur-[0.2px]" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-pink-200/80 pb-1.5 pt-0.5 md:pb-1 md:pt-0">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-pink-900 text-[10px] font-black uppercase tracking-wider border border-pink-200 shadow-[0_2px_4px_rgba(244,114,182,0.15),inset_0_1px_#ffffff] group-hover/memo2:scale-105 transition-transform font-itim">
                        MỤC 02 · CẢNH BÁO NỘI DUNG
                      </span>
                    </div>

                    <div className="space-y-2 md:space-y-1.5 text-sm sm:text-[15px] md:text-[14px] text-pink-950/90 leading-relaxed md:leading-snug font-medium font-itim">
                      <p>
                        Trang web chứa các tác phẩm{' '}
                        <strong className="text-pink-800 underline font-bold">
                          đam mỹ có yếu tố 18+, ngôn từ thô tục
                        </strong>
                        , chỉ dành cho độc giả đã đủ tuổi.
                      </p>
                      <p>
                        Mọi tình tiết hoàn toàn là hư cấu giải trí, không phản ánh tiêu chuẩn đạo đức xã hội ngoài đời.
                      </p>
                    </div>

                    <div className="neumorph-memo-inner p-3 md:py-2 md:px-3 rounded-xl bg-white/95 border border-pink-200 text-sm sm:text-[14.5px] md:text-[13px] font-bold text-pink-900 leading-normal hover:shadow-sm transition-shadow font-itim">
                      Nếu bạn không hợp bất kỳ thể loại nào, vui lòng rời khỏi trang web.
                    </div>
                  </div>

                  {/* MỤC 3: HẠ TẦNG KỸ THUẬT - MẨU NOTE TÍM NHẠT SKEUOMORPHIC 3D */}
                  <div className="group/memo3 neumorph-memo-purple relative p-4 sm:p-5 md:p-3.5 md:py-3 rounded-2xl mt-5 sm:mt-6 md:mt-9 bg-[#faf5ff] border border-purple-200/90 text-purple-950 rotate-[0.8deg] hover:rotate-0 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default space-y-2.5 md:space-y-2 font-itim">
                    {/* BĂNG WASHI TÍM NHẠT 3D CHUẨN SKEUOMORPHIC DÁN NGANG MÉP TRÊN */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-6 bg-purple-300/85 border-y border-dashed border-purple-400 rotate-[-1deg] group-hover/memo3:rotate-0 drop-shadow-[0_2.5px_4px_rgba(0,0,0,0.12)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] rounded-xs select-none z-10 transition-transform duration-300" />

                    <div className="flex items-center justify-between border-b border-purple-200/80 pb-1.5 pt-0.5 md:pb-1 md:pt-0">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-900 text-[10px] font-black uppercase tracking-wider border border-purple-200 shadow-[0_2px_4px_rgba(168,85,247,0.18),inset_0_1px_#ffffff] group-hover/memo3:scale-105 transition-transform font-itim">
                        MỤC 03 · LƯU Ý
                      </span>
                    </div>

                    <p className="text-sm sm:text-[15px] md:text-[14px] text-purple-950/90 leading-relaxed md:leading-snug font-medium font-itim">
                      Web được vận hành hoàn toàn bằng máy chủ miễn phí vì mục đích phi thương mại.
                    </p>

                    <p className="text-sm sm:text-[15px] md:text-[14px] text-purple-950/90 leading-relaxed md:leading-snug font-medium font-itim">
                      Vui lòng không sử dụng để đăng lại hoặc chuyển ver.
                    </p>

                    <div className="neumorph-memo-inner p-3 md:py-2 md:px-3 rounded-xl bg-white/95 border border-purple-200 text-sm sm:text-[14.5px] md:text-[13px] font-medium text-purple-900 hover:shadow-sm transition-shadow font-itim">
                      Bạn có thể ghé WordPress để đọc truyện không bị ngắt quãng.
                    </div>
                  </div>
                </div>

                {/* Chân trang mặt trái */}
                <div className="pt-2 md:pt-1.5 border-t border-dashed border-pink-200/80 text-center">
                  <span className="text-[10px] text-pink-600/90 font-mono italic inline-flex items-center gap-1.5">
                    <span>— Drift Upon A Lovestruck Cadence</span>
                    <span className="inline-block text-pink-400">♡</span>
                    <span>01 —</span>
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* MẶT PHẢI (RIGHT PAGE): QUY TẮC, KÊNH KHÁC & LƯU BÚT ĐỘC GIẢ        */}
            {/* =================================================================== */}
            <div className="relative flex-1 flex flex-col justify-between">
              {/* Lớp giấy xếp chồng tầng 2 */}
              <div className="absolute -bottom-3 inset-x-4 sm:inset-x-6 top-6 bg-[#F8D1E0] rounded-[24px] sm:rounded-[32px] border-b-2 border-black/15 shadow-[0_4px_8px_rgba(0,0,0,0.06)] pointer-events-none z-0" />
              {/* Lớp giấy xếp chồng tầng 1 */}
              <div className="absolute -bottom-1.5 inset-x-2 sm:inset-x-3 top-3 bg-[#FCE6EE] rounded-[26px] sm:rounded-[34px] border-b-2 border-black/10 shadow-[0_2px_4px_rgba(0,0,0,0.04)] pointer-events-none z-0" />

              {/* DẢI RUY BĂNG ĐÁNH DẤU TRANG THÊU CHARM TRÁI TIM (NẰM SAU TRANG GIẤY - CÓ CHUYỂN ĐỘNG ĐUNG ĐƯA DỄ THƯƠNG) */}
              <div
                className="animate-cute-ribbon absolute -bottom-12 sm:-bottom-14 right-16 sm:right-24 w-8 sm:w-9 h-28 sm:h-32 pointer-events-none z-0 select-none drop-shadow-[0_6px_12px_rgba(244,114,182,0.35)]"
              >
                <div
                  className="w-full h-full bg-gradient-to-b from-[#fbcfe8] via-[#f472b6] to-[#db2777] border-b-2 border-pink-700/60 relative flex flex-col justify-end shadow-md rounded-b-xl"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 14px), 0 100%)',
                  }}
                >
                  {/* Sợi chỉ satin lụa dệt viền phản quang */}
                  <div className="absolute inset-y-0 left-0.5 w-[1px] bg-white/60 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0.5 w-[1px] bg-pink-900/30 pointer-events-none" />

                  {/* Charm Trái Tim Thêu Nổi ở tâm phần đuôi ruy băng */}
                  <div className="pb-4 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-white fill-white drop-shadow-[0_1px_3px_rgba(190,24,93,0.6)]" />
                  </div>
                </div>
              </div>

              {/* Lớp giấy chính (Main Paper Block) */}
              <div
                className="neumorph-pink-paper rounded-[28px] sm:rounded-[36px] border-2 border-pink-200/90 p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 flex flex-col justify-between relative overflow-hidden z-10 h-full"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgba(244, 114, 182, 0.08) 1px, transparent 1px), linear-gradient(rgba(244, 114, 182, 0.08) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              >
                {/* Header trang phải: Tem Planner & Nút tương tác */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b-2 border-dashed border-pink-200/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="neumorph-pink-pill px-3 py-0.5 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 text-pink-700 hover:scale-105 transition-transform duration-200">
                        <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                        <span>PLANNER · TRANG 02</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playCuteChime('sparkle');
                        const el = document.getElementById('two-page-guest-form');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          const input = el.querySelector('textarea') || el.querySelector('input');
                          if (input) (input as HTMLElement).focus();
                        }
                      }}
                      className="neumorph-pink-btn flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer select-none hover:scale-105 active:scale-95 transition-all group"
                    >
                      <PenTool className="w-3 h-3 text-pink-600 group-hover:rotate-12 transition-transform" />
                      <span>Gửi tin nhắn</span>
                    </button>
                  </div>
                </div>

                {/* CÁC NỘI DUNG TRÊN TRANG PHẢI */}
                <div className="space-y-4 pt-1">
                  {/* MỤC 4: QUY ĐỊNH BÌNH LUẬN - VIẾT TRỰC TIẾP LÊN MẶT GIẤY SỔ */}
                  <div className="space-y-2 py-1 px-1">
                    <div className="flex items-center justify-between border-b border-purple-200/80 pb-1">
                      <div className="flex items-center gap-1.5 group cursor-default">
                        <MessageCircle className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                        <h3 className="text-sm font-bold text-purple-950 font-source-serif tracking-wide">
                          Quy Định Bình Luận
                        </h3>
                      </div>
                      {/* DẤU MỘC BƯU CHÍNH VINTAGE DẬP MỰC TÍM TRÊN TRANG SỔ */}
                      <div className="px-2 py-0.5 rounded-md border-2 border-dashed border-purple-300 rotate-2 hover:rotate-[-3deg] hover:scale-110 transition-all duration-300 text-[9px] font-mono font-black text-purple-600/90 tracking-wider select-none cursor-default shadow-xs">
                        ★ CUTIE ♡
                      </div>
                    </div>

                    <div className="notebook-ruled-lines py-1.5 px-1.5 space-y-2 text-sm sm:text-[15px] text-stone-800 leading-relaxed font-livvic">
                      <p className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold text-base inline-block">♡</span>
                        <span>
                          <strong className="text-purple-900 font-bold font-livvic">
                            Tôn trọng nhân vật:
                          </strong>{' '}
                          Vui lòng không công kích hay xúc phạm nhân vật trong truyện.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold text-base inline-block">♡</span>
                        <span>
                          Không nhắc đến tên của nhân vật và bộ truyện không liên quan.
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* MỤC 5: CÁC KÊNH ĐỌC DỰ PHÒNG - MẨU NOTE HỒNG PASTEL 3D SKEUOMORPHIC */}
                  <div className="group/memo5 neumorph-memo-pink relative p-4 sm:p-5 rounded-2xl bg-[#ffe4ea] border-2 border-dashed border-pink-300 text-pink-950 rotate-[0.7deg] hover:rotate-0 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default space-y-2.5 font-itim">
                    {/* BĂNG WASHI HỒNG DÂU 3D DÁN CHÉO ĐẦU NOTE */}
                    <div className="absolute -top-3.5 left-7 w-28 h-6 bg-pink-300/90 border-y border-dashed border-pink-500/80 rotate-[-2deg] group-hover/memo5:rotate-1 drop-shadow-[0_2.5px_4px_rgba(0,0,0,0.12)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] rounded-xs select-none transition-transform duration-300" />

                    <div className="flex items-center justify-between border-b border-pink-300/70 pb-1.5 pt-0.5">
                      <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-pink-200 to-rose-200 text-pink-950 text-[10px] font-black uppercase tracking-wider border border-pink-300/90 shadow-[0_2px_4px_rgba(244,63,94,0.18),inset_0_1px_1px_#ffffff] group-hover/memo5:scale-105 transition-transform font-itim">
                        MỤC 05 · CÁC WEB KHÁC
                      </span>
                    </div>

                    <p className="text-sm sm:text-[15px] text-pink-900/90 font-medium font-itim">
                      Kênh đọc truyện dự phòng khi web gián đoạn máy chủ:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                      {/* Nút Wattpad */}
                      <div className="neumorph-memo-inner p-3 rounded-xl bg-white/95 border border-pink-200 text-sm flex items-center justify-between gap-1.5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <div className="min-w-0">
                          <span className="text-[10px] font-black text-orange-600 uppercase block font-vietnam">Wattpad</span>
                          <span className="text-xs sm:text-[13px] font-mono text-stone-800 font-bold block truncate">@Qingxiya52</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopy('https://www.wattpad.com/user/Qingxiya52', 'wattpad')}
                            className="p-1.5 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-700 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                            title="Sao chép link Wattpad"
                          >
                            {copiedWattpad ? <Check className="w-4 h-4 text-emerald-600 animate-pulse" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <a
                            href="https://www.wattpad.com/user/Qingxiya52"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-transform hover:scale-110 active:scale-95"
                            title="Mở Wattpad"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* Nút WordPress */}
                      <div className="neumorph-memo-inner p-3 rounded-xl bg-white/95 border border-blue-200 text-sm flex items-center justify-between gap-1.5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <div className="min-w-0">
                          <span className="text-[10px] font-black text-blue-600 uppercase block font-vietnam">WordPress</span>
                          <span className="text-xs sm:text-[13px] font-mono text-stone-800 font-bold block truncate">nienthoi003.wordpress.com</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopy('https://nienthoi003.wordpress.com/', 'wordpress')}
                            className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                            title="Sao chép link WordPress"
                          >
                            {copiedWordpress ? <Check className="w-4 h-4 text-emerald-600 animate-pulse" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <a
                            href="https://nienthoi003.wordpress.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-transform hover:scale-110 active:scale-95"
                            title="Mở WordPress"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MỤC 6: SỔ LƯU TRỮ TIN NHẮN (GUESTBOOK) */}
                  <div id="two-page-guest-form" className="space-y-3 pt-1">
                    <div className="flex items-center justify-between border-b border-pink-200/80 pb-1">
                      <div className="flex items-center gap-1.5 group cursor-default">
                        <Heart className="w-4 h-4 text-pink-600 fill-pink-300" />
                        <h3 className="text-sm font-bold text-pink-950 font-source-serif tracking-wide">
                          Sổ Lưu Trữ Tin Nhắn ({guestNotes.length})
                        </h3>
                      </div>
                    </div>

                    {/* FORM GỬI TIN NHẮN THEO PHONG CÁCH MEMO SKEUOMORPHIC */}
                    <div className="group/guestmemo relative p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-pink-200 shadow-[0_4px_16px_rgba(244,114,182,0.12)] space-y-2.5">
                      {/* Đinh ghim tròn hồng 3D góc phải */}
                      <div className="absolute top-2.5 right-3.5 pointer-events-none select-none drop-shadow-[2px_5px_4px_rgba(244,114,182,0.28)] group-hover/guestmemo:rotate-12 transition-transform duration-300">
                        <div className="w-1.5 h-3 bg-stone-500/35 rounded-full blur-[0.6px] translate-x-1.5 translate-y-1.5 rotate-45" />
                        <div className="w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-pink-500 via-pink-300 to-pink-100 border border-white/90 shadow-[inset_0_2px_2px_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(244,114,182,0.45)] relative -mt-3 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-white/95 absolute top-0.5 left-0.5 blur-[0.2px]" />
                        </div>
                      </div>

                      <div className="pt-0.5 flex items-center justify-between">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-pink-900 text-[10px] font-black uppercase tracking-wider border border-pink-200 shadow-[0_2px_4px_rgba(244,114,182,0.18),inset_0_1px_1px_#ffffff] group-hover/guestmemo:scale-105 transition-transform font-itim">
                          GỬI GẮM LỜI NHẮN
                        </span>
                      </div>

                      <form onSubmit={handleAddGuestNote} className="space-y-2 pt-0.5 font-itim">
                        <input
                          type="text"
                          value={guestAuthorInput}
                          onChange={(e) => setGuestAuthorInput(e.target.value)}
                          placeholder="Tên hoặc biệt danh của bạn..."
                          maxLength={30}
                          className="neumorph-pink-inset w-full px-3 py-1.5 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-pink-300 font-medium font-itim"
                        />

                        <textarea
                          value={guestContentInput}
                          onChange={(e) => setGuestContentInput(e.target.value)}
                          placeholder="Viết đôi dòng lưu bút gửi editor hoặc bạn đọc..."
                          rows={2}
                          maxLength={180}
                          className="neumorph-pink-inset w-full px-3 py-1.5 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-pink-300 resize-none font-medium font-itim"
                        />

                        <button
                          type="submit"
                          className="neumorph-pastel-pink-action-btn w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer active:scale-98 hover:scale-[1.01] transition-all tracking-wide select-none font-itim"
                        >
                          <span>Gửi Tin Nhắn Vào Sổ</span>
                        </button>
                      </form>
                    </div>

                    {/* KHUNG TRẮNG BAO BỌC DANH SÁCH TIN NHẮN (THANH CUỘN 1PX MINI) */}
                    <div className="bg-white/95 rounded-2xl border border-pink-200/90 shadow-[0_3px_12px_rgba(244,114,182,0.08)] p-3 sm:p-3.5 space-y-2.5 transition-all">
                      <div className="flex items-center justify-between text-[11px] font-bold text-stone-800 pb-1.5 border-b border-pink-100/90 px-0.5">
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-pink-600" />
                          <span className="font-source-serif tracking-wide text-pink-950 font-bold">
                            Những Tin Nhắn Đã Gửi ({guestNotes.length})
                          </span>
                        </span>

                        {totalPages > 1 ? (
                          <button
                            type="button"
                            onClick={() => {
                              playCuteChime('sparkle');
                              setGuestBookPage((prev) => (prev >= totalPages ? 1 : prev + 1));
                            }}
                            className="px-3 py-1 rounded-full font-bold text-pink-700 bg-pink-100 hover:bg-pink-200/80 border border-pink-300/80 border-b-2 border-b-pink-400 shadow-[0_1.5px_4px_rgba(244,114,182,0.18)] active:scale-95 hover:scale-105 transition-all cursor-pointer flex items-center justify-center text-[10px]"
                          >
                            <span>Xem tiếp (Trang {safePage}/{totalPages})</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-pink-500 font-mono font-medium px-2 py-0.5 rounded-full bg-pink-50 border border-pink-100/80">
                            Mới nhất
                          </span>
                        )}
                      </div>

                      {/* Danh sách tin nhắn cuộn mini 1px */}
                      <div className="mini-scrollbar-1px space-y-2.5 max-h-[135px] overflow-y-auto pr-1.5 scroll-smooth">
                        {currentNotes.length === 0 ? (
                          <div className="py-6 px-2 text-center text-stone-500 font-itim text-[13px] leading-relaxed">
                            Chưa có tin nhắn nào. Hãy là người đầu tiên gửi gắm tâm tình vào sổ nhé! 🌸
                          </div>
                        ) : (
                          currentNotes.map((note) => (
                            <div
                              key={note.id}
                              className="py-1 space-y-0.5 hover:translate-x-1 transition-transform duration-200"
                            >
                              <div className="flex items-center justify-between text-xs pb-0.5">
                                <div className="flex items-center gap-1 min-w-0">
                                  <span className="text-xs shrink-0 select-none animate-cute-sparkle inline-block">🌸</span>
                                  <span className="font-bold text-stone-800 truncate font-vietnam">{note.author}</span>
                                </div>
                                <span className="text-[11px] text-stone-400 font-mono shrink-0">{note.time}</span>
                              </div>

                              <div className="notebook-ruled-lines px-1 py-0.5 rounded-xs">
                                <p className="text-[13px] leading-6 text-stone-700 font-medium italic font-livvic">
                                  "{note.content}"
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chân trang mặt phải: Nút Vào Đọc Truyện Ngay */}
                <div className="pt-2 border-t border-dashed border-pink-200/80 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      playCuteChime('sparkle');
                      if (onBackToNovels) onBackToNovels();
                      else showToast('Vào trang đọc truyện ngay! ✨');
                    }}
                    className="neumorph-pastel-pink-action-btn inline-flex items-center justify-center px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer select-none hover:scale-105 active:scale-95 transition-all group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      Vào Đọc Truyện Ngay
                    </span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 5. TOÀN BỘ PHÔNG CHỮ, MÀU SẮC, HIỆU ỨNG 3D, SCROLLBAR & KEYFRAMES        */}
      {/* ========================================================================= */}
      <style>{`
        /* IMPORT GOOGLE FONTS */
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Itim&family=Livvic:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap');

        .font-itim {
          font-family: 'Itim', cursive, sans-serif !important;
        }
        .font-livvic {
          font-family: 'Livvic', sans-serif !important;
        }
        .font-source-serif {
          font-family: 'Source Serif 4', Georgia, serif !important;
        }
        .font-vietnam {
          font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        /* 1. KHUNG BÌA CUỐN SỔ CÒNG NEUMORPHISM 3D */
        .neumorph-pink-board {
          background: linear-gradient(145deg, #ffffff 0%, #fff2f6 45%, #fde4ec 100%) !important;
          border: 6.5px solid #fce7f3 !important;
          border-bottom: 6.5px solid #fce7f3 !important;
          box-shadow: 
            -5px -5px 14px #ffffff,
            0 0 0 1.5px rgba(255, 255, 255, 0.95),
            0 0 0 3px rgba(244, 114, 182, 0.2),
            inset 0 2px 3px rgba(255, 255, 255, 0.98),
            inset 0 -2.5px 5px rgba(244, 114, 182, 0.2),
            inset 2.5px 2.5px 6px rgba(244, 114, 182, 0.16),
            inset -2.5px -2.5px 6px rgba(255, 255, 255, 0.95),
            0 28px 70px rgba(244, 114, 182, 0.28) !important;
        }
        @media (min-width: 640px) {
          .neumorph-pink-board {
            border-width: 15px !important;
            border-bottom-width: 15px !important;
            border-bottom-color: #fce7f3 !important;
            box-shadow: 
              -8px -8px 24px #ffffff,
              0 0 0 2.5px rgba(255, 255, 255, 0.95),
              0 0 0 5.5px rgba(244, 114, 182, 0.22),
              inset 0 3px 4px rgba(255, 255, 255, 0.98),
              inset 0 -4px 8px rgba(244, 114, 182, 0.22),
              inset 4px 4px 10px rgba(244, 114, 182, 0.20),
              inset -4px -4px 10px rgba(255, 255, 255, 0.95),
              0 28px 70px rgba(244, 114, 182, 0.28) !important;
          }
        }

        /* 2. MẶT GIẤY SỔ CÒNG CHÍNH (NEUMORPH PINK PAPER) */
        .neumorph-pink-paper {
          background-color: #fffefb !important;
          border: 1px solid rgba(244, 114, 182, 0.25) !important;
          border-bottom: 3px solid rgba(244, 114, 182, 0.3) !important;
          box-shadow: 
            0 8px 20px -4px rgba(244, 114, 182, 0.14),
            -3px -3px 10px rgba(255, 255, 255, 0.95),
            inset 0 2px 2px rgba(255, 255, 255, 0.9),
            inset 0 -2px 4px rgba(244, 114, 182, 0.08) !important;
        }

        /* 3. HUY HIỆU PILL PLANNER TRANG 01 / 02 */
        .neumorph-pink-pill {
          background: linear-gradient(180deg, #ffffff 0%, #fff5f8 100%) !important;
          border: 1px solid rgba(244, 114, 182, 0.25) !important;
          border-bottom: 2.5px solid #fbcfe8 !important;
          box-shadow: 
            0 3px 8px rgba(244, 114, 182, 0.12),
            -2px -2px 6px #ffffff,
            inset 0 1px 1.5px rgba(255, 255, 255, 0.95),
            inset 0 -1px 2px rgba(244, 114, 182, 0.06) !important;
        }

        /* 4. NÚT BẤM 3D MỀM MẠI NEUMORPH PINK BTN */
        .neumorph-pink-btn {
          background: linear-gradient(180deg, #ffffff 0%, #fff2f6 100%) !important;
          color: #831843 !important;
          border: 1px solid rgba(244, 114, 182, 0.32) !important;
          border-bottom: 3px solid #f9a8d4 !important;
          box-shadow: 
            0 3.5px 8px rgba(244, 114, 182, 0.16),
            -1.5px -1.5px 5px rgba(255, 255, 255, 0.95),
            inset 0 1.5px 1.5px #ffffff !important;
          transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .neumorph-pink-btn:hover {
          background: linear-gradient(180deg, #ffffff 0%, #ffeaf0 100%) !important;
          color: #700c35 !important;
          border-bottom: 3.5px solid #f472b6 !important;
          box-shadow: 
            0 6px 14px rgba(244, 114, 182, 0.22),
            -2px -2px 6px rgba(255, 255, 255, 1),
            inset 0 1.5px 1.5px #ffffff !important;
          transform: translateY(-1.5px);
        }
        .neumorph-pink-btn:active {
          background: #fdf2f6 !important;
          border-bottom-width: 1px !important;
          box-shadow: 
            inset 0 2px 4px rgba(244, 114, 182, 0.22),
            inset 0 -1px 2px rgba(255, 255, 255, 0.8) !important;
          transform: translateY(2px) scale(0.98);
        }

        /* Nút hồng pastel nhẹ hơn nhưng giữ nguyên 3D nổi */
        .neumorph-pink-btn-soft {
          background: linear-gradient(180deg, #fdf2f7 0%, #fce7f3 50%, #fbcfe8 100%) !important;
          color: #9d174d !important;
          font-weight: 700 !important;
          border: 1px solid rgba(244, 114, 182, 0.4) !important;
          border-bottom: 3px solid #f472b6 !important;
          box-shadow: 
            0 3.5px 10px rgba(244, 114, 182, 0.18),
            inset 0 1.5px 1.5px rgba(255, 255, 255, 0.95),
            inset 0 -1px 2px rgba(244, 114, 182, 0.15) !important;
          transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .neumorph-pink-btn-soft:hover {
          background: linear-gradient(180deg, #ffffff 0%, #fce7f3 50%, #f9a8d4 100%) !important;
          color: #831843 !important;
          border-color: rgba(244, 114, 182, 0.55) !important;
          border-bottom: 3.5px solid #ec4899 !important;
          box-shadow: 
            0 5px 14px rgba(244, 114, 182, 0.26),
            inset 0 2px 2px rgba(255, 255, 255, 1) !important;
          transform: translateY(-1.5px);
        }

        /* Nút nền hồng nhạt pastel cho "Vào Đọc Truyện Ngay" & "Gửi Tin Nhắn Vào Sổ" */
        .neumorph-pastel-pink-action-btn {
          background: #fce7f3 !important; /* Nền hồng nhạt pastel ngọt ngào */
          color: #831843 !important;
          font-weight: 700 !important;
          border: 1px solid rgba(244, 114, 182, 0.45) !important;
          border-bottom: 3px solid #f472b6 !important;
          box-shadow: 
            0 3.5px 10px rgba(244, 114, 182, 0.18),
            -1.5px -1.5px 5px rgba(255, 255, 255, 0.95),
            inset 0 1.5px 1.5px #ffffff,
            inset 0 -1.5px 2px rgba(244, 114, 182, 0.15) !important;
          transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .neumorph-pastel-pink-action-btn:hover {
          background: #fbcfe8 !important; /* Hồng phấn tươi hơn khi hover */
          color: #700c35 !important;
          border-color: rgba(244, 114, 182, 0.6) !important;
          border-bottom: 3.5px solid #ec4899 !important;
          box-shadow: 
            0 5px 14px rgba(244, 114, 182, 0.26),
            -2px -2px 6px rgba(255, 255, 255, 1),
            inset 0 2px 2px rgba(255, 255, 255, 1) !important;
          transform: translateY(-1.5px);
        }
        .neumorph-pastel-pink-action-btn:active {
          background: #f9a8d4 !important;
          border-bottom-width: 1px !important;
          box-shadow: 
            inset 0 2px 4px rgba(244, 114, 182, 0.28) !important;
          transform: translateY(2px) scale(0.98);
        }

        /* Ô nhập liệu Inset 3D */
        .neumorph-pink-inset {
          background-color: #fff8fa !important;
          border: 1px solid rgba(244, 114, 182, 0.25) !important;
          box-shadow: 
            inset 2px 2px 4px rgba(244, 114, 182, 0.12),
            inset -2px -2px 4px rgba(255, 255, 255, 0.95) !important;
        }

        /* 5. CÁC MẪU MEMO NOTE SKEUOMORPHIC 3D */
        .neumorph-memo-pale-pink {
          box-shadow: 
            0 10px 24px -4px rgba(251, 182, 206, 0.16),
            0 4px 8px -2px rgba(251, 182, 206, 0.08),
            -4px -4px 12px #ffffff,
            inset 0 2px 2px rgba(255, 255, 255, 0.98),
            inset 0 -2.5px 5px rgba(251, 182, 206, 0.08) !important;
          border-bottom: 3px solid #fce7f3 !important;
          transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .neumorph-memo-purple {
          box-shadow: 
            0 10px 24px -4px rgba(168, 85, 247, 0.18),
            0 4px 8px -2px rgba(168, 85, 247, 0.08),
            -4px -4px 12px #ffffff,
            inset 0 2px 2px rgba(255, 255, 255, 0.98),
            inset 0 -2.5px 5px rgba(168, 85, 247, 0.10) !important;
          border-bottom: 3.5px solid #ddd6fe !important;
          transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .neumorph-memo-pink {
          box-shadow: 
            0 10px 24px -4px rgba(244, 114, 182, 0.22),
            0 4px 8px -2px rgba(244, 114, 182, 0.10),
            -4px -4px 12px #ffffff,
            inset 0 2px 2px rgba(255, 255, 255, 0.98),
            inset 0 -2.5px 5px rgba(244, 114, 182, 0.12) !important;
          border-bottom: 3.5px solid #fbcfe8 !important;
          transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .neumorph-memo-inner {
          box-shadow: 
            0 3px 8px rgba(244, 114, 182, 0.10),
            -2px -2px 6px #ffffff,
            inset 0 1.5px 1.5px rgba(255, 255, 255, 0.95),
            inset 0 -1.5px 2px rgba(244, 114, 182, 0.05) !important;
        }

        /* 6. ĐƯỜNG KẺ NGANG TRANG SỔ TAY (NOTEBOOK RULED LINES) */
        .notebook-ruled-lines {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 23px,
            rgba(215, 140, 160, 0.18) 23px,
            rgba(215, 140, 160, 0.18) 24px
          ) !important;
          background-size: 100% 24px !important;
        }

        /* 7. THANH CUỘN MINI 1PX MƯỢT MÀ CHO KHUNG TIN NHẮN ĐÃ GỬI TRANG SỔ */
        .mini-scrollbar-1px {
          scrollbar-width: thin;
          scrollbar-color: rgba(244, 114, 182, 0.55) transparent;
          scroll-behavior: smooth;
        }
        .mini-scrollbar-1px::-webkit-scrollbar {
          width: 1px;
        }
        .mini-scrollbar-1px::-webkit-scrollbar-track {
          background: rgba(253, 232, 238, 0.35);
          border-radius: 9999px;
        }
        .mini-scrollbar-1px::-webkit-scrollbar-thumb {
          background: rgba(244, 114, 182, 0.7);
          border-radius: 9999px;
        }
        .mini-scrollbar-1px::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.9);
        }
        .mini-scrollbar-1px::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* 8. ANIMATIONS CHO CUỐN SỔ KẾ HOẠCH */
        @keyframes cute-spiral-shimmer {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 2px 3px rgba(244, 114, 182, 0.2));
          }
          50% {
            filter: brightness(1.22) drop-shadow(0 3px 6px rgba(251, 191, 36, 0.45));
          }
        }
        .animate-cute-spiral {
          animation: cute-spiral-shimmer 3.5s ease-in-out infinite;
        }

        @keyframes cute-ribbon-sway {
          0%, 100% {
            transform: rotate(3deg) translateY(0px);
          }
          50% {
            transform: rotate(5.5deg) translateY(2px);
          }
        }
        .animate-cute-ribbon {
          animation: cute-ribbon-sway 4.5s ease-in-out infinite;
          transform-origin: top center;
        }

        @keyframes cute-heart-wiggle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.15) rotate(-6deg);
          }
          75% {
            transform: scale(1.15) rotate(6deg);
          }
        }
        .animate-cute-heart-wiggle {
          animation: cute-heart-wiggle 3s ease-in-out infinite;
        }

        @keyframes cute-sparkle-spin {
          0% {
            transform: rotate(0deg) scale(0.9);
            opacity: 0.7;
          }
          50% {
            transform: rotate(180deg) scale(1.15);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) scale(0.9);
            opacity: 0.7;
          }
        }
        .animate-cute-sparkle {
          animation: cute-sparkle-spin 6s linear infinite;
        }

        /* 9. BỤI SAO 5 CÁNH BO TRÒN XOAY 360 ĐỘ QUANH TIÊU ĐỀ */
        .sparkle-text-wrapper {
          position: relative;
          display: inline-block;
          vertical-align: baseline;
          isolation: isolate;
        }
        @keyframes star-spin-large-a {
          0% {
            transform: rotate(0deg) scale(0.94);
            opacity: 0.85;
            filter: drop-shadow(0 0 2px rgba(244, 114, 182, 0.65));
          }
          50% {
            transform: rotate(180deg) scale(1.15);
            opacity: 1;
            filter: drop-shadow(0 0 4.5px rgba(244, 114, 182, 0.8));
          }
          100% {
            transform: rotate(360deg) scale(0.94);
            opacity: 0.85;
            filter: drop-shadow(0 0 2px rgba(244, 114, 182, 0.65));
          }
        }
        .star-anim-spin-a {
          animation: star-spin-large-a 5.5s linear infinite;
          transform-origin: center center;
          display: inline-block;
        }

        @keyframes star-spin-large-b {
          0% {
            transform: rotate(0deg) scale(0.94);
            opacity: 0.85;
            filter: drop-shadow(0 0 2px rgba(249, 168, 212, 0.65));
          }
          50% {
            transform: rotate(-180deg) scale(1.16);
            opacity: 1;
            filter: drop-shadow(0 0 4.5px rgba(244, 114, 182, 0.8));
          }
          100% {
            transform: rotate(-360deg) scale(0.94);
            opacity: 0.85;
            filter: drop-shadow(0 0 2px rgba(249, 168, 212, 0.65));
          }
        }
        .star-anim-spin-b {
          animation: star-spin-large-b 6.5s linear infinite;
          transform-origin: center center;
          display: inline-block;
        }

        @keyframes star-spin-medium-c {
          0% {
            transform: rotate(0deg) scale(0.95);
            opacity: 0.9;
            filter: drop-shadow(0 0 2.5px rgba(236, 72, 153, 0.7));
          }
          50% {
            transform: rotate(180deg) scale(1.18);
            opacity: 1;
            filter: drop-shadow(0 0 4.5px rgba(236, 72, 153, 0.9));
          }
          100% {
            transform: rotate(360deg) scale(0.95);
            opacity: 0.9;
            filter: drop-shadow(0 0 2.5px rgba(236, 72, 153, 0.7));
          }
        }
        .star-anim-spin-c {
          animation: star-spin-medium-c 5s linear infinite;
          transform-origin: center center;
          display: inline-block;
        }

        @keyframes star-twinkle-pulse-b {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.55);
          }
          50% {
            opacity: 1;
            transform: scale(1.28);
            filter: drop-shadow(0 0 3.5px rgba(249, 168, 212, 0.85));
          }
        }
        .star-anim-twinkle-b {
          animation: star-twinkle-pulse-b 2.2s ease-in-out infinite 0.4s;
          display: inline-block;
        }

        /* 10. TOAST NOTIFICATION POP-IN */
        @keyframes toast-pop-in {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .cute-toast-pill {
          animation: toast-pop-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default TwoPagePlannerHeartView;
