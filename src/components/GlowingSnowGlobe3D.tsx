import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// =========================================================================
// 1. ĐẾ PHA LÊ HOA TUYẾT NÂNG ĐỠ QUẢ CẦU (SNOWFLAKE PEDESTAL)
// =========================================================================
export const SnowflakePedestal: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 600 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[560px] select-none pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="25%" stopColor="#c5e3fb" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#c5e3fb" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Trục ngang trung tâm */}
      <line x1="30" y1="80" x2="570" y2="80" stroke="url(#pedestalGrad)" strokeWidth="1.5" />

      {/* Hệ nan hoa tuyết đối xứng */}
      <g stroke="url(#pedestalGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
        {/* Cánh trái */}
        <line x1="120" y1="80" x2="220" y2="35" />
        <line x1="120" y1="80" x2="220" y2="125" />
        <line x1="180" y1="80" x2="250" y2="50" />
        <line x1="180" y1="80" x2="250" y2="110" />
        <line x1="60" y1="80" x2="140" y2="60" />
        <line x1="60" y1="80" x2="140" y2="100" />

        {/* Cánh phải */}
        <line x1="480" y1="80" x2="380" y2="35" />
        <line x1="480" y1="80" x2="380" y2="125" />
        <line x1="420" y1="80" x2="350" y2="50" />
        <line x1="420" y1="80" x2="350" y2="110" />
        <line x1="540" y1="80" x2="460" y2="60" />
        <line x1="540" y1="80" x2="460" y2="100" />

        {/* Vòm đỡ quả cầu ở giữa */}
        <path d="M 230 65 Q 300 100 370 65" stroke="url(#pedestalGrad)" strokeWidth="2" fill="none" />
        <path d="M 250 80 Q 300 115 350 80" stroke="url(#pedestalGrad)" strokeWidth="1.5" fill="none" />

        {/* Điểm nút pha lê kim cương */}
        <circle cx="300" cy="80" r="3" fill="#ffffff" />
        <circle cx="260" cy="72" r="2" fill="#d9effd" />
        <circle cx="340" cy="72" r="2" fill="#d9effd" />
        <circle cx="200" cy="55" r="2" fill="#d9effd" />
        <circle cx="400" cy="55" r="2" fill="#d9effd" />
        <circle cx="150" cy="80" r="2" fill="#d9effd" />
        <circle cx="450" cy="80" r="2" fill="#d9effd" />
      </g>
    </svg>
  );
};

// =========================================================================
// 2. ĐOÀN TÀU XỨ TUYẾT 6 TOA TRẮNG MUỐT - CHẠY NGAY TỨC THÌ (MOVING SNOW TRAIN)
// =========================================================================
export const MovingSnowTrain: React.FC<{
  onTrainClick?: () => void;
  isGlobeShaking?: boolean;
}> = ({ onTrainClick, isGlobeShaking = false }) => {
  // Khi mới mở trang, tàu xuất hiện ngay trên cầu chạy liền (không phải đợi lâu)
  const [hasFirstPassed, setHasFirstPassed] = useState(false);

  return (
    <div className="absolute -top-[24px] sm:-top-[28px] left-0 right-0 h-7 sm:h-8 overflow-hidden pointer-events-none z-20">
      <motion.div
        animate={
          hasFirstPassed
            ? { x: ['82%', '-115%'] }
            : { x: ['15%', '-115%'] }
        }
        transition={
          hasFirstPassed
            ? { duration: isGlobeShaking ? 7.5 : 15, repeat: Infinity, ease: 'linear' }
            : { duration: isGlobeShaking ? 4.5 : 8.5, repeat: 0, ease: 'linear' }
        }
        onAnimationComplete={() => {
          if (!hasFirstPassed) setHasFirstPassed(true);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onTrainClick) onTrainClick();
        }}
        className="absolute top-0 left-0 flex items-end cursor-pointer pointer-events-auto select-none"
        title="Đoàn tàu tuyết trắng Xứ Tuyết (雪国列车) - Bấm để nghe tiếng còi tàu"
      >
        {/* TOA 1: ĐẦU MÁY XE LỬA (Mũi bo tròn, đèn pha rọi sáng sang trái, không nêm thừa) */}
        <div className="relative flex flex-col items-center">
          {/* Làn khói tuyết bốc lên bay về phía sau */}
          <motion.div
            animate={{ y: [-1, -12], x: [1, 8], opacity: [0.85, 0], scale: [0.5, 1.4] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
            className="absolute -top-3 right-2 w-2 h-2 rounded-full bg-white shadow-[0_0_4px_#ffffff] blur-[0.5px] pointer-events-none"
          />

          {/* Thân đầu máy: Trắng & xám nhạt */}
          <div className="relative w-14 sm:w-17 h-4 sm:h-5 rounded-l-lg rounded-r-xs bg-gradient-to-b from-[#ffffff] via-[#f4f7fa] to-[#e4e9ef] border border-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-between px-1">
            {/* Đèn pha chìm ở mũi tàu bo tròn */}
            <div className="absolute -left-1 top-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] border border-slate-200" />

            {/* Luồng sáng trắng chiếu về trước */}
            <div
              className="absolute -left-14 sm:-left-18 top-[-2px] w-14 sm:w-18 h-5 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at right, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 45%, transparent 80%)',
                clipPath: 'polygon(100% 25%, 0% 0%, 0% 100%, 100% 75%)',
              }}
            />

            {/* Kính buồng lái */}
            <div className="w-2.5 sm:w-3 h-2 sm:h-2.5 rounded-xs bg-[#f8fafc] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_0_4px_rgba(255,255,255,0.9)] border border-slate-200/80" />
            {/* Ống khói */}
            <div className="absolute -top-1.5 right-2.5 w-1.5 h-1.5 bg-[#e2e8f0] border border-slate-300 rounded-t-xs" />
          </div>

          {/* Bánh xe */}
          <div className="flex justify-between w-11 sm:w-13 px-0.5 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
          </div>
        </div>

        {/* Khớp nối 1 */}
        <div className="w-1 h-0.5 bg-slate-300 mb-1.5 shrink-0 shadow-xs" />

        {/* TOA 2 ĐẾN TOA 5: CÁC TOA HÀNH KHÁCH & TOA CAFE (TRẮNG VÀ XÁM NHẠT) */}
        {[1, 2, 3, 4].map((carIndex) => (
          <React.Fragment key={carIndex}>
            <div className="relative flex flex-col items-center">
              <div className="relative w-12 sm:w-15 h-3.5 sm:h-4.5 rounded-xs bg-gradient-to-b from-[#ffffff] via-[#f4f7fa] to-[#e4e9ef] border border-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-around px-1">
                <div className="w-2.5 sm:w-3.5 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
                <div className="w-2.5 sm:w-3.5 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
                <div className="w-2.5 sm:w-3.5 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
              </div>
              <div className="flex justify-between w-9 sm:w-11 px-0.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
              </div>
            </div>
            <div className="w-1 h-0.5 bg-slate-300 mb-1.5 shrink-0 shadow-xs" />
          </React.Fragment>
        ))}

        {/* TOA 6: TOA ĐUÔI TÀU (Bo cong đuôi, đèn hậu trắng nhấp nháy) */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-11 sm:w-14 h-3.5 sm:h-4.5 rounded-r-md rounded-l-xs bg-gradient-to-b from-[#ffffff] via-[#f4f7fa] to-[#e4e9ef] border border-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-between px-1">
            <div className="w-2.5 sm:w-3 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
            <div className="w-2.5 sm:w-3 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
            <div className="w-2.5 sm:w-3 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
            <div className="absolute -right-1 top-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
          </div>
          <div className="flex justify-between w-8 sm:w-10 px-0.5 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// =========================================================================
// 3. TOÀN BỘ QUẢ CẦU THỦY TINH 3D PHÁT SÁNG (GLOWING 3D SNOW GLOBE SCENE)
// =========================================================================
export const GlowingSnowGlobe3D: React.FC = () => {
  const [isGlobeShaking, setIsGlobeShaking] = useState(false);

  // Tạo các bông tuyết bay bên trong quả cầu
  const globeFlakes = React.useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: Math.random() * 2.5 + 1.2,
      speed: Math.random() * 4 + 2.5,
    }));
  }, []);

  const handleGlobeClick = () => {
    if (isGlobeShaking) return;
    setIsGlobeShaking(true);
    setTimeout(() => setIsGlobeShaking(false), 2400);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 select-none">
      {/* VÙNG CHỨA QUẢ CẦU VÀ CHÂN ĐẾ */}
      <div className="relative flex flex-col items-center">
        {/* Khối quả cầu tương tác có animation rung lắc */}
        <motion.div
          animate={
            isGlobeShaking
              ? {
                  rotate: [0, -4, 4, -3, 3, -1, 1, 0],
                  x: [0, -6, 6, -4, 4, -2, 2, 0],
                  y: [0, -3, 3, -2, 2, 0],
                }
              : { rotate: 0, x: 0, y: 0 }
          }
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          onClick={handleGlobeClick}
          className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-92 md:h-92 rounded-full cursor-pointer group"
          title="Nhấn vào để lắc quả cầu tuyết!"
        >
          {/* Lớp hào quang phát sáng mờ ảo xung quanh quả cầu (Ethereal Glow) */}
          <div className="absolute -inset-4 rounded-full bg-sky-300/15 blur-2xl pointer-events-none" />

          {/* VỎ CẦU THỦY TINH 3D (3D SPHERE GLASS CONTAINER) */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden border-[2.5px] border-white/60 shadow-[0_0_50px_rgba(180,215,255,0.4),inset_0_0_35px_rgba(255,255,255,0.5),inset_0_8px_18px_rgba(255,255,255,0.6)] backdrop-blur-md"
            style={{
              background:
                'radial-gradient(circle at 45% 30%, rgba(255,255,255,0.25) 0%, rgba(200,225,250,0.15) 35%, rgba(160,195,230,0.2) 70%, rgba(130,170,210,0.35) 100%)',
            }}
          >
            {/* Lớp 1: Bầu trời đã được loại bỏ theo yêu cầu */}
            {/* Lớp 2: Các ngọn đồi đã được loại bỏ theo yêu cầu */}
            {/* Lớp 3: Mặt đất tuyết đã được loại bỏ theo yêu cầu */}


            {/* Lớp 4: CÂY CẦU CẠN ĐƯỜNG SẮT VỚI CÁC TRỤ CẦU CÁCH ĐỀU NHAU (VIADUCT WITH EQUAL PIER SPACING) */}
            <div className="absolute top-[49%] sm:top-[51%] left-0 right-0 flex flex-col items-center pointer-events-none z-10">
              <div className="w-full relative">
                {/* ĐOÀN TÀU LƯỚT TRÊN CẦU */}
                <MovingSnowTrain isGlobeShaking={isGlobeShaking} />

                {/* SVG CÂU CẦU CẠN VÀ 4 CỘT TRỤ CÁCH ĐỀU 75px */}
                <svg
                  viewBox="0 0 300 90"
                  className="w-full h-20 sm:h-26 overflow-visible pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="viaductPierGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="65%" stopColor="#f4f8fc" />
                      <stop offset="100%" stopColor="#c8def0" />
                    </linearGradient>
                    <linearGradient id="viaductCapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#d5e8f6" />
                    </linearGradient>
                    <linearGradient id="viaductDeckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#eff6fb" />
                      <stop offset="100%" stopColor="#c4dcf0" />
                    </linearGradient>
                  </defs>

                  {/* 4 CỘT TRỤ CẦU CẠN: TÂM CÁCH NHAU ĐỀU ĐẶN ĐÚNG 75px, KHOẢNG LỌT LÒNG ĐỀU ĐẶN 61px */}
                  {[
                    { id: 1, left: 31 },  // tâm 38
                    { id: 2, left: 106 }, // tâm 113 (+75px)
                    { id: 3, left: 181 }, // tâm 188 (+75px)
                    { id: 4, left: 256 }, // tâm 263 (+75px)
                  ].map((pier) => (
                    <g key={pier.id}>
                      {/* Mũ đầu trụ */}
                      <rect
                        x={pier.left - 2}
                        y="11"
                        width="18"
                        height="3"
                        rx="0.5"
                        fill="url(#viaductCapGrad)"
                        stroke="#b8d4e9"
                        strokeWidth="0.5"
                      />
                      {/* Thân trụ cắm sâu vào tuyết */}
                      <rect
                        x={pier.left}
                        y="14"
                        width="14"
                        height="66"
                        fill="url(#viaductPierGrad)"
                        stroke="#a8cbe4"
                        strokeWidth="0.6"
                      />
                      {/* Đổ bóng 3D cạnh phải */}
                      <rect
                        x={pier.left + 10}
                        y="14"
                        width="4"
                        height="66"
                        fill="#adcfe6"
                        opacity="0.6"
                      />
                      {/* Gờ chỉ ngang trang trí */}
                      <line x1={pier.left} y1="28" x2={pier.left + 14} y2="28" stroke="#a0c5df" strokeWidth="0.8" />
                      <line x1={pier.left} y1="46" x2={pier.left + 14} y2="46" stroke="#a0c5df" strokeWidth="0.8" />
                      <line x1={pier.left} y1="64" x2={pier.left + 14} y2="64" stroke="#a0c5df" strokeWidth="0.8" />
                    </g>
                  ))}

                  {/* MẶT ĐƯỜNG RAY VÀ VẠCH SÁNG */}
                  <rect x="0" y="0" width="300" height="3" fill="#ffffff" stroke="#c2dbef" strokeWidth="0.5" />
                  <line x1="0" y1="0.5" x2="300" y2="0.5" stroke="#ffffff" strokeWidth="1" />

                  {/* DẦM TRÊN */}
                  <rect x="0" y="3" width="300" height="2.5" fill="url(#viaductDeckGrad)" stroke="#b0d0e8" strokeWidth="0.4" />

                  {/* GIÀN THÉP MẮT CÁO CHỮ X XUYÊN SUỐT CẦU */}
                  <g stroke="#ffffff" strokeWidth="1" opacity="0.95">
                    {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285].map((bx) => (
                      <g key={bx}>
                        <line x1={bx} y1="5.5" x2={bx} y2="12" stroke="#a4c7e2" strokeWidth="0.8" />
                        <line x1={bx} y1="5.5" x2={bx + 15} y2="12" stroke="#ffffff" strokeWidth="0.9" />
                        <line x1={bx + 15} y1="5.5" x2={bx} y2="12" stroke="#b6d4ea" strokeWidth="0.9" />
                      </g>
                    ))}
                    <line x1="300" y1="5.5" x2="300" y2="12" stroke="#a4c7e2" strokeWidth="0.8" />
                  </g>

                  {/* DẦM DƯỚI */}
                  <rect x="0" y="11.5" width="300" height="2.5" fill="url(#viaductDeckGrad)" stroke="#9bc0dd" strokeWidth="0.5" />
                </svg>
              </div>
            </div>

            {/* Lớp 5: CÁC CỤM CÂY THÔNG TUYẾT XANH BĂNG GIÁ (ĐẶT Ở z-15 TIỀN CẢNH, KHÔNG BỊ TRỤ CHE) */}
            {/* Cụm thông 1: Nhịp trái (lọt lòng giữa trụ 1 và trụ 2) */}
            <div className="absolute bottom-5 sm:bottom-7 left-[20%] sm:left-[21%] flex items-end -space-x-1.5 pointer-events-none z-15">
              <div className="flex flex-col items-center">
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#a8cee8]" />
                <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[12px] border-l-transparent border-r-transparent border-b-[#87b8dc] -mt-1" />
                <div className="w-0 h-0 border-l-[9px] border-r-[9px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#6fa5cd] -mt-1 shadow-sm" />
                <div className="w-1.5 h-2.5 bg-white" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#b0d4ed]" />
                <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-[#8fbce0] -mt-1.5" />
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#73a9d4] -mt-1.5 shadow-sm" />
                <div className="w-2 h-4 bg-white" />
              </div>
            </div>

            {/* Cụm thông 2: Nhịp giữa (lọt lòng giữa trụ 2 và trụ 3) */}
            <div className="absolute bottom-3 sm:bottom-5 left-[45%] sm:left-[47%] flex items-end -space-x-1.5 pointer-events-none z-15">
              <div className="flex flex-col items-center">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[11px] border-l-transparent border-r-transparent border-b-[#a8cee8]" />
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[13px] border-l-transparent border-r-transparent border-b-[#87b8dc] -mt-1" />
                <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[15px] border-l-transparent border-r-transparent border-b-[#6fa5cd] -mt-1 shadow-sm" />
                <div className="w-1.5 h-2.5 bg-white" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[13px] border-l-transparent border-r-transparent border-b-[#b5d8f0]" />
                <div className="w-0 h-0 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-[#92bfe2] -mt-1" />
                <div className="w-0 h-0 border-l-[11px] border-r-[11px] border-b-[18px] border-l-transparent border-r-transparent border-b-[#78aed7] -mt-1 shadow-sm" />
                <div className="w-1.5 h-3 bg-white" />
              </div>
            </div>

            {/* Cụm thông 3: Nhịp phải (lọt lòng giữa trụ 3 và trụ 4) */}
            <div className="absolute bottom-6 sm:bottom-8 left-[70%] sm:left-[72%] flex items-end -space-x-1 pointer-events-none z-15">
              <div className="flex flex-col items-center">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-[#a2c8e5]" />
                <div className="w-0 h-0 border-l-[9px] border-r-[9px] border-b-[15px] border-l-transparent border-r-transparent border-b-[#80b1d8] -mt-1" />
                <div className="w-0 h-0 border-l-[11px] border-r-[11px] border-b-[18px] border-l-transparent border-r-transparent border-b-[#699fc9] -mt-1 shadow-sm" />
                <div className="w-1.5 h-3 bg-white" />
              </div>
            </div>

            {/* Lớp 6: CÁC BÔNG TUYẾT BAY LƠ LỬNG BÊN TRONG CẦU (SWIRLING FLURRY) */}
            {globeFlakes.map((gf) => (
              <motion.div
                key={gf.id}
                animate={
                  isGlobeShaking
                    ? {
                        x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, 0],
                        y: [0, (Math.random() - 0.5) * 90, (Math.random() - 0.5) * 50, 0],
                        scale: [1, 1.8, 1],
                        opacity: [0.6, 1, 0.7],
                      }
                    : {
                        y: [0, 30, 0],
                        x: [0, Math.sin(gf.id) * 10, 0],
                        opacity: [0.4, 0.9, 0.4],
                      }
                }
                transition={{
                  duration: isGlobeShaking ? 1.5 : gf.speed,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute rounded-full bg-white shadow-[0_0_3px_#ffffff] pointer-events-none"
                style={{
                  left: `${gf.x}%`,
                  top: `${gf.y}%`,
                  width: gf.size,
                  height: gf.size,
                }}
              />
            ))}

            {/* Lớp 7: VỆT SÁNG PHẢN QUANG CỦA VỎ THỦY TINH (SPECULAR HIGHLIGHT ARCS) */}
            {/* Vệt phản xạ chính góc trên bên trái */}
            <div
              className="absolute top-3 left-6 w-24 sm:w-36 h-12 sm:h-18 rounded-[50%] bg-gradient-to-b from-white/95 to-transparent pointer-events-none transform -rotate-35 blur-[0.8px]"
              style={{ opacity: 0.9 }}
            />
            {/* Vệt sáng phụ phía trong */}
            <div className="absolute top-6 left-12 w-14 sm:w-20 h-7 sm:h-10 rounded-[50%] bg-white/70 pointer-events-none transform -rotate-30 blur-[1px]" />
            {/* Khúc xạ ánh sáng hắt ngược ở vành đáy cầu */}
            <div className="absolute bottom-2 left-10 right-10 h-6 rounded-[50%] bg-gradient-to-t from-white/80 to-transparent pointer-events-none blur-[1px]" />
          </div>
        </motion.div>

        {/* Lớp 8: ĐẾ HOA TUYẾT NÂNG ĐỠ NẰM PHÍA DƯỚI ĐÁY QUẢ CẦU */}
        <div className="-mt-10 sm:-mt-14 relative z-0 flex justify-center w-full">
          <SnowflakePedestal />
        </div>
      </div>
    </div>
  );
};
