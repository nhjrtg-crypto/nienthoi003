import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  Heart,
  Moon,
  Sun,
  ArrowLeft,
  ShieldAlert,
  Server,
  MessageSquare,
  Bookmark,
  CheckCircle2,
  Share2,
  Layers,
  ChevronDown
} from 'lucide-react';

interface AboutLightOption3ViewProps {
  onBackToNovels: () => void;
  currentOption: 'option2' | 'option3' | 'option4';
  onChangeOption: (opt: 'option2' | 'option3' | 'option4') => void;
}

export const AboutLightOption3View: React.FC<AboutLightOption3ViewProps> = ({
  onBackToNovels,
  currentOption,
  onChangeOption,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(platform);
    setTimeout(() => setCopiedLink(null), 2200);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F6] text-[#222222] font-sans selection:bg-[#E2E2DF] selection:text-[#111111] relative overflow-x-hidden">
      {/* Background: Fine Paper Grain & Subtle Dot Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: 'radial-gradient(#BBBBAE 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* TOP FLOATING NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#F7F7F6]/95 backdrop-blur-md border-b border-[#E3E3DE] px-4 sm:px-8 py-3 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          
          {/* Breadcrumbs / Page Identifier */}
          <div className="flex items-center gap-3">
            <h1 className="text-sm sm:text-base font-serif font-bold text-[#181816]">
              Giới thiệu trang web
            </h1>
          </div>

          {/* Option Selector Pills: KIỂU 2 | KIỂU 3 | KIỂU 4 */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-[#EAEAE6] border border-[#D5D5CE] flex items-center shadow-inner text-xs">
              <button
                type="button"
                onClick={() => onChangeOption('option2')}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  currentOption === 'option2' ? 'bg-white text-black shadow-xs font-bold' : 'text-[#666660] hover:text-black'
                }`}
                title="Chế độ sáng: Kiểu 2 (Bưu ảnh Đơn sắc Editorial)"
              >
                Kiểu 2
              </button>

              <button
                type="button"
                onClick={() => onChangeOption('option3')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  currentOption === 'option3'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                    : 'text-[#666660] hover:text-black'
                }`}
                title="Kiểu 3: Bảng Ghi Chú Pastel (Sweet Memo Board)"
              >
                Kiểu 3
              </button>

              <button
                type="button"
                onClick={() => onChangeOption('option4')}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  currentOption === 'option4' ? 'bg-[#A36577] text-white shadow-xs font-bold' : 'text-[#666660] hover:text-black'
                }`}
                title="Chế độ sáng: Kiểu 4 (Sổ tay lưu trữ nghệ thuật Collage)"
              >
                Kiểu 4
              </button>
            </div>

            {/* Back to reading home */}
            <button
              onClick={onBackToNovels}
              className="hv-11__btn--stack px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#1C1C1A] text-[#F7F7F5] border border-black/40 transition-all cursor-pointer flex items-center gap-1.5"
              style={{ ['--btn-stack-shadow' as any]: '#0a0a09' }}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Đọc truyện</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* ========================================================================= */}
        {/* HERO CARD: TODAY'S NOTE CARD (THEO CHÍNH XÁC ẢNH IMG_20260915_191910)     */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-[32px] sm:rounded-[38px] border border-[#E0E0DB] p-6 sm:p-10 shadow-[0_12px_45px_rgba(0,0,0,0.06)] overflow-hidden mb-12"
        >
          {/* Subtle Grid Lines in corner like photo */}
          <div 
            className="absolute top-0 right-0 w-36 sm:w-44 h-28 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #999 0, #999 1px, transparent 1px, transparent 8px)',
            }}
          />

          {/* Eight-pointed Star Doodles (như ảnh 3) */}
          <div className="absolute top-10 right-10 text-neutral-400 select-none pointer-events-none text-2xl font-serif">
            ✻
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* CỘT TRÁI: TYPOGRAPHY EDITORIAL THEO ẢNH */}
            <div className="md:col-span-6 space-y-4">
              
              {/* Category Eyebrow */}
              <div className="text-[11px] font-mono tracking-[0.25em] text-neutral-500 uppercase">
                TODAY'S NOTE
              </div>

              {/* Huge Serif Heading */}
              <h2 className="text-4xl sm:text-5xl font-serif font-normal text-neutral-900 leading-[1.1] tracking-tight">
                Things I <br />
                <span className="font-serif italic font-bold">Noticed</span>
              </h2>

              {/* Sub-label like image */}
              <div className="pt-1">
                <p className="text-xs sm:text-sm font-mono text-neutral-500 tracking-wide">
                  little things <br />
                  I almost missed
                </p>
              </div>

              {/* Star Divider: — ✻ — ✻ — ✻ — */}
              <div className="py-2 flex items-center gap-2 text-neutral-400 select-none">
                <span className="h-[1px] w-6 bg-neutral-300" />
                <span className="text-sm">✻</span>
                <span className="h-[1px] w-8 bg-neutral-300" />
                <span className="text-sm">✻</span>
                <span className="h-[1px] w-6 bg-neutral-300" />
              </div>

              {/* POSTAL STAMP CIRCLE (Con dấu tem tròn bưu chính nghiêng theo ảnh) */}
              <div className="pt-2 flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border border-dashed border-neutral-400 p-1 flex items-center justify-center -rotate-12 select-none shadow-xs">
                  <div className="w-full h-full rounded-full border border-neutral-300 flex flex-col items-center justify-center text-center p-1">
                    <span className="text-[7px] font-mono tracking-widest text-neutral-500 uppercase">
                      LATELY
                    </span>
                    <span className="text-base text-neutral-700 font-serif leading-none my-0.5">
                      ✻
                    </span>
                    <span className="text-[7px] font-mono tracking-widest text-neutral-500 uppercase">
                      NOTES
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-neutral-500">
                  <span>NO. 29 | </span>
                  <span className="font-bold text-neutral-700">JOURIEE65</span>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Edit hoàn thành</p>
                </div>
              </div>

            </div>

            {/* CỘT PHẢI: LAYERED PHOTOS (ẢNH ĐIỆN THOẠI NOTES + POLAROID DÁN WASHI TAPE) */}
            <div className="md:col-span-6 relative h-[310px] sm:h-[350px] flex items-center justify-center select-none">
              
              {/* Photo 1: Phone Notes Screen (như ảnh 3: "Notes / I Miss u... ♥") */}
              <div className="absolute left-2 sm:left-4 top-2 w-52 sm:w-60 bg-white p-2.5 rounded-2xl border border-neutral-300 shadow-[0_10px_30px_rgba(0,0,0,0.09)] -rotate-3 z-10">
                {/* Washi Tape at top of phone */}
                <div 
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 rounded-xs opacity-75 shadow-xs pointer-events-none"
                  style={{
                    background: 'rgba(215, 215, 210, 0.85)',
                  }}
                />

                {/* Phone mockup header */}
                <div className="bg-neutral-900 rounded-xl p-3 text-white font-mono text-[11px] space-y-2">
                  <div className="flex items-center justify-between text-[9px] text-neutral-400">
                    <span>20:27</span>
                    <span>41%</span>
                  </div>
                  <div className="border-b border-neutral-800 pb-1.5 flex items-center justify-between">
                    <span className="text-neutral-400">&lt; Notes</span>
                    <span className="font-bold text-neutral-200">Done</span>
                  </div>
                  <div className="py-2">
                    <p className="text-sm font-sans font-bold text-neutral-100 flex items-center gap-1">
                      Chào mừng bạn... <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                    </p>
                    <p className="text-[10px] text-neutral-400 font-sans mt-1 leading-snug">
                      Website được xây nhằm đăng tải những bộ truyện mình đã edit hoàn.
                    </p>
                  </div>
                  {/* Select menu bubble */}
                  <div className="bg-neutral-800 rounded-md px-2 py-1 text-[9px] text-neutral-300 flex justify-around">
                    <span>Select</span>
                    <span>Select All</span>
                    <span>Paste</span>
                  </div>
                </div>
              </div>

              {/* Photo 2: Mini Polaroid dán so le lệch phải (như ảnh 3) */}
              <div className="absolute right-0 sm:right-2 bottom-4 w-36 sm:w-44 bg-white p-2 pb-3 rounded-lg border border-neutral-300 shadow-[0_12px_32px_rgba(0,0,0,0.12)] rotate-6 z-20">
                {/* Washi tape on top right */}
                <div 
                  className="absolute -top-2 right-4 w-14 h-4 rounded-xs opacity-80 shadow-xs pointer-events-none"
                  style={{ background: 'rgba(200, 200, 195, 0.8)' }}
                />

                <div className="w-full aspect-[4/3] rounded-xs bg-[#ECECE8] flex flex-col items-center justify-center text-center p-2">
                  <span className="text-[9px] font-mono text-neutral-500 italic">
                    (en) maison bakery
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white shadow-xs my-1 flex items-center justify-center text-xs">
                    🤍
                  </div>
                  <span className="text-[10px] font-serif italic text-neutral-700">
                    Paris
                  </span>
                </div>

                <div className="pt-1.5 text-center text-[9px] font-mono text-neutral-500">
                  warm breeze
                </div>
              </div>

              {/* Mảnh giấy xé mép dán ở dưới cùng (như ảnh 3: "warm breeze / quiet heart") */}
              <div className="absolute left-16 bottom-0 z-30 px-4 py-2 bg-[#E8E8E4] rounded-sm shadow-md border border-[#D5D5CE] -rotate-1">
                <p className="text-xs font-mono text-neutral-800 tracking-wider">
                  warm breeze
                </p>
                <div className="w-12 h-[1px] bg-neutral-400 my-0.5" />
                <p className="text-xs font-mono text-neutral-800 tracking-wider">
                  quiet heart
                </p>
              </div>

            </div>

          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* NỘI DUNG CHÍNH: CÁC KHỐI NOTE TỐI GIẢN CHUẨN XÁC NỘI DUNG YÊU CẦU            */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          
          {/* CARD 1: LỜI CHÀO MỪNG */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E5E0] shadow-xs relative"
          >
            <div className="flex items-center gap-2 mb-3 text-neutral-400 font-mono text-xs">
              <span>01 / GREETING</span>
              <span className="flex-1 h-[1px] bg-neutral-200" />
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 mb-2">
              Chào mừng bạn đến với trang web của mình
            </h3>
            
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
              Website được xây nhằm đăng tải những bộ truyện mình đã edit hoàn, chỉ phục vụ duy nhất cho mục đích giải trí.
            </p>
          </motion.div>

          {/* CARD 2: CẢNH BÁO NỘI DUNG (Khung đen viền trắng tối giản nổi bật) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-2xl bg-[#1D1D1B] text-[#F5F5F2] border border-neutral-800 shadow-md relative overflow-hidden"
          >
            {/* Washi Tape Strip at top */}
            <div 
              className="absolute -top-2 left-10 w-24 h-4.5 opacity-60 rotate-[-1deg] pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.4)' }}
            />

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>

              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-serif font-bold tracking-wide text-white">
                    CẢNH BÁO NỘI DUNG
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono">
                    Hư cấu 18+
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Website được xây nhằm đăng tải những bộ truyện mình đã edit hoàn, chỉ phục vụ duy nhất cho mục đích giải trí.
                </p>

                <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 font-medium leading-relaxed">
                  Nếu bạn cảm thấy không thích bất kỳ thể loại truyện nào, xin vui lòng rời khỏi web.
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 3: HẠ TẦNG MÁY CHỦ & BÌNH LUẬN VĂN MINH (2 CỘT) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* HẠ TẦNG */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-[#E5E5E0] shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-neutral-600" />
                  <h4 className="text-sm sm:text-base font-serif font-bold text-neutral-900">
                    Hạ tầng máy chủ miễn phí
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Trang web được vận hành và duy trì hoàn toàn bằng hạ tầng máy chủ miễn phí nhằm mục đích phi thương mại. Do đó, hệ thống sẽ có một số giới hạn kỹ thuật nhất định: Đôi khi có thể bị chậm hoặc tạm dừng.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-neutral-200 text-[11px] text-neutral-500 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                <span>
                  Nếu không vào được web, các bạn có thể ghé qua nền tảng khác như WordPress để tiếp tục đọc truyện không bị gián đoạn.
                </span>
              </div>
            </motion.div>

            {/* BÌNH LUẬN VĂN MINH */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-[#E5E5E0] shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-neutral-600" />
                  <h4 className="text-sm sm:text-base font-serif font-bold text-neutral-900">
                    Cổng bình luận tự do
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Web mở cổng bình luận tự do không cần đăng nhập. Tuy nhiên, để giữ gìn một không gian văn minh, xin vui lòng tuân thủ:
                </p>

                <div className="p-2.5 rounded-xl bg-[#F2F2EE] border border-[#E0E0D8] text-xs text-neutral-800 leading-relaxed">
                  <strong>Tôn trọng nhân vật/người đăng truyện:</strong> Không buông lời xúc phạm cực đoan đối với nhân vật, tác giả hay editor.
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-neutral-200 text-[11px] text-neutral-500 flex items-center gap-1.5 font-mono">
                <Heart className="w-3.5 h-3.5 text-neutral-700" />
                <span>Không gian đọc truyện tôn trọng lẫn nhau</span>
              </div>
            </motion.div>

          </div>

          {/* CARD 4: XEM TRUYỆN TẠI CÁC NỀN TẢNG KHÁC */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E5E0] shadow-xs"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-neutral-700" />
                <h4 className="text-base font-serif font-bold text-neutral-900">
                  Xem truyện tại các nền tảng khác
                </h4>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Official Links
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Wattpad */}
              <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#E0E0D8] flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-900">Wattpad</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 font-mono">
                      Chỉ đăng truyện mới
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono break-all line-clamp-1">
                    https://www.wattpad.com/user/Qingxiya52
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://www.wattpad.com/user/Qingxiya52"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-black text-white flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Mở Wattpad</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy('https://www.wattpad.com/user/Qingxiya52', 'wattpad')}
                    className="p-1.5 rounded-lg border border-neutral-300 hover:bg-white text-neutral-700 transition-all cursor-pointer"
                    title="Sao chép liên kết"
                  >
                    {copiedLink === 'wattpad' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* WordPress */}
              <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#E0E0D8] flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-900">WordPress</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 font-mono">
                      Kho truyện hoàn
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono break-all line-clamp-1">
                    https://nienthoi003.wordpress.com/
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://nienthoi003.wordpress.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-black text-white flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Mở WordPress</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy('https://nienthoi003.wordpress.com/', 'wordpress')}
                    className="p-1.5 rounded-lg border border-neutral-300 hover:bg-white text-neutral-700 transition-all cursor-pointer"
                    title="Sao chép liên kết"
                  >
                    {copiedLink === 'wordpress' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          </motion.div>

          {/* CARD 5: LỜI CHÚC THƯ GIÃN */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white border border-[#E0E0DB] shadow-sm text-center relative"
          >
            <div className="max-w-md mx-auto space-y-3">
              {/* Thanh nối pastel với Trái tim nhịp đập phập phồng liên tục (Heartbeat / Pulse Loop) */}
              <div className="relative flex items-center justify-center w-full max-w-xs mx-auto mb-3.5">
                {/* Thanh nối pastel */}
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent" />
                </div>

                {/* Vòng hào quang nền (Glow Aura Badge) & Trái tim */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10 w-6 h-6 rounded-full bg-rose-400/20 backdrop-blur-xs flex items-center justify-center shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </motion.div>
              </div>

              <h3 className="text-2xl font-serif font-bold text-neutral-900">
                Chúc các bạn có những giây phút thư giãn!
              </h3>
              
              <p className="text-xs sm:text-sm text-neutral-600 font-sans">
                Hy vọng bạn sẽ tìm thấy những phút giây đọc truyện thật nhẹ nhàng và thoải mái tại đây.
              </p>

              <div className="pt-3 pb-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onBackToNovels}
                  className="hv-11__btn--stack px-5.5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-neutral-900 text-white border border-neutral-800 transition-all cursor-pointer flex items-center gap-2"
                  style={{ ['--btn-stack-shadow' as any]: '#171717' }}
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>Vào đọc truyện ngay</span>
                </button>
              </div>
            </div>
          </motion.div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-xs text-neutral-400 font-mono border-t border-neutral-200">
        <p>© 2026 Jouriee65 · Niên Thời</p>
      </footer>
    </div>
  );
};
