import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Play, Pause } from 'lucide-react';
import { Novel } from '../types';
import { MetallicPaperClip } from './MetallicPaperClip';

// =========================================================================
// 1. CÁC HỌA TIẾT VI HÌNH HỌC (MICRO-DECORATION GLYPHS)
// =========================================================================

/** Ngôi sao 4 cánh (4-pointed Star) sắc nét */
export const MicroStar4: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-2.5 h-2.5',
  style,
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} style={style} aria-hidden="true">
    <path d="M12 2 Q12 12 22 12 Q12 12 12 22 Q12 12 12 22 Q12 12 2 12 Q12 12 12 2 Z" />
  </svg>
);

/** Chấm tròn đặc */
export const MicroDot: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-1.5 h-1.5',
  style,
}) => <span className={`inline-block rounded-full bg-current shrink-0 ${className}`} style={style} aria-hidden="true" />;

/** Hình vuông đổ màu đặc */
export const MicroSquareFilled: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-1.5 h-1.5',
  style,
}) => <span className={`inline-block bg-current shrink-0 ${className}`} style={style} aria-hidden="true" />;

/** Hình thoi rỗng xoay 45 độ */
export const MicroDiamond: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-1.5 h-1.5',
  style,
}) => <span className={`inline-block border border-current rotate-45 shrink-0 ${className}`} style={style} aria-hidden="true" />;

/** Hình tròn rỗng */
export const MicroCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-1.5 h-1.5',
  style,
}) => <span className={`inline-block rounded-full border border-current shrink-0 ${className}`} style={style} aria-hidden="true" />;

/** Bông tuyết 6 cánh nhỏ vây quanh quả cầu (6-pointed Snowflake) */
export const Snowflake6: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-3.5 h-3.5',
  style,
}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`inline-block shrink-0 ${className}`} style={style} aria-hidden="true">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="3.34" y1="7" x2="20.66" y2="17" />
    <line x1="3.34" y1="17" x2="20.66" y2="7" />
    <line x1="9" y1="5" x2="12" y2="7" />
    <line x1="15" y1="5" x2="12" y2="7" />
    <line x1="9" y1="19" x2="12" y2="17" />
    <line x1="15" y1="19" x2="12" y2="17" />
    <line x1="4.5" y1="10" x2="6.5" y2="9" />
    <line x1="7" y1="6" x2="6.5" y2="9" />
    <line x1="19.5" y1="14" x2="17.5" y2="15" />
    <line x1="17" y1="18" x2="17.5" y2="15" />
    <line x1="4.5" y1="14" x2="6.5" y2="15" />
    <line x1="7" y1="18" x2="6.5" y2="15" />
    <line x1="19.5" y1="10" x2="17.5" y2="9" />
    <line x1="17" y1="6" x2="17.5" y2="9" />
  </svg>
);

// =========================================================================
// 2. BỘ TẠO ÂM THANH WEB AUDIO SYNTHESIZER (TỰ TẠO SÓNG ÂM, KHÔNG CẦN MP3)
// =========================================================================
const playPaperTap = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {}
};

const playChime = (freq = 659.25) => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {}
};

// =========================================================================
// 3. ĐOÀN TÀU XỨ TUYẾT 6 TOA TRẮNG MUỐT - CHẠY NGAY TỨC THÌ (MOVING SNOW TRAIN)
// =========================================================================
export const MovingSnowTrain: React.FC<{
  onTrainClick?: () => void;
  isGlobeShaking?: boolean;
}> = ({ onTrainClick, isGlobeShaking = false }) => {
  // Khi mới mở trang, tàu xuất hiện ngay trên cầu chạy liền (không phải đợi lâu)
  const [hasFirstPassed, setHasFirstPassed] = useState(false);

  return (
    <div className="absolute -top-3.5 sm:-top-5 md:-top-6 left-0 right-0 h-5 sm:h-7 md:h-8 overflow-hidden pointer-events-none z-20">
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
        className="absolute top-0 left-0 flex items-end cursor-pointer pointer-events-auto select-none scale-75 sm:scale-90 md:scale-100 origin-bottom-left"
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
          <div className="relative w-12 sm:w-14 md:w-17 h-3.5 sm:h-4 md:h-5 rounded-l-lg rounded-r-xs bg-gradient-to-b from-[#ffffff] via-[#f4f7fa] to-[#e4e9ef] border border-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-between px-1">
            {/* Đèn pha chìm ở mũi tàu bo tròn */}
            <div className="absolute -left-1 top-1 sm:top-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] border border-slate-200" />

            {/* Luồng sáng trắng chiếu về trước */}
            <div
              className="absolute -left-12 sm:-left-14 md:-left-18 top-[-2px] w-12 sm:w-14 md:w-18 h-4 sm:h-5 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at right, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 45%, transparent 80%)',
                clipPath: 'polygon(100% 25%, 0% 0%, 0% 100%, 100% 75%)',
              }}
            />

            {/* Kính buồng lái */}
            <div className="w-2 sm:w-2.5 md:w-3 h-1.5 sm:h-2 md:h-2.5 rounded-xs bg-[#f8fafc] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_0_4px_rgba(255,255,255,0.9)] border border-slate-200/80" />
            {/* Ống khói */}
            <div className="absolute -top-1.5 right-2.5 w-1.5 h-1.5 bg-[#e2e8f0] border border-slate-300 rounded-t-xs" />
          </div>

          {/* Bánh xe */}
          <div className="flex justify-between w-9 sm:w-11 md:w-13 px-0.5 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
          </div>
        </div>

        {/* Khớp nối 1 */}
        <div className="w-0.5 sm:w-1 h-0.5 bg-slate-300 mb-1.5 shrink-0 shadow-xs" />

        {/* TOA 2 ĐẾN TOA 5: CÁC TOA HÀNH KHÁCH & TOA CAFE */}
        {[1, 2, 3, 4].map((carIndex) => (
          <React.Fragment key={carIndex}>
            <div className="relative flex flex-col items-center">
              <div className="relative w-10 sm:w-12 md:w-15 h-3 sm:h-3.5 md:h-4.5 rounded-xs bg-gradient-to-b from-[#ffffff] via-[#f4f7fa] to-[#e4e9ef] border border-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-around px-0.5 sm:px-1">
                <div className="w-2 sm:w-2.5 md:w-3.5 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
                <div className="w-2 sm:w-2.5 md:w-3.5 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
                <div className="w-2 sm:w-2.5 md:w-3.5 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
              </div>
              <div className="flex justify-between w-8 sm:w-9 md:w-11 px-0.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
              </div>
            </div>
            <div className="w-0.5 sm:w-1 h-0.5 bg-slate-300 mb-1.5 shrink-0 shadow-xs" />
          </React.Fragment>
        ))}

        {/* TOA 6: TOA ĐUÔI TÀU (Bo cong đuôi, đèn hậu trắng nhấp nháy) */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-9 sm:w-11 md:w-14 h-3 sm:h-3.5 md:h-4.5 rounded-r-md rounded-l-xs bg-gradient-to-b from-[#ffffff] via-[#f4f7fa] to-[#e4e9ef] border border-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-between px-0.5 sm:px-1">
            <div className="w-2 sm:w-2.5 md:w-3 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
            <div className="w-2 sm:w-2.5 md:w-3 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
            <div className="w-2 sm:w-2.5 md:w-3 h-1.5 sm:h-2 rounded-xs bg-[#f8fafc] border border-slate-200/80" />
            <div className="absolute -right-1 top-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
          </div>
          <div className="flex justify-between w-7 sm:w-8 md:w-10 px-0.5 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] border border-slate-300 shadow-xs" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// =========================================================================
// 4. ĐẾ PHA LÊ HOA TUYẾT NÂNG ĐỠ QUẢ CẦU (SNOWFLAKE PEDESTAL)
// =========================================================================
export const SnowflakePedestal: React.FC<{
  className?: string;
  gradId?: string;
  accentColor?: string;
}> = ({ className = '', gradId = 'pedestalGrad', accentColor = '#c5e3fb' }) => {
  return (
    <svg
      viewBox="0 0 600 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[560px] select-none pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="25%" stopColor={accentColor} stopOpacity="0.45" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="75%" stopColor={accentColor} stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Trục ngang trung tâm */}
      <line x1="30" y1="80" x2="570" y2="80" stroke={`url(#${gradId})`} strokeWidth="1.5" />

      {/* Hệ nan hoa tuyết đối xứng */}
      <g stroke={`url(#${gradId})`} strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
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
        <path d="M 230 65 Q 300 100 370 65" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" />
        <path d="M 250 80 Q 300 115 350 80" stroke={`url(#${gradId})`} strokeWidth="1.5" fill="none" />

        {/* Điểm nút pha lê kim cương */}
        <circle cx="300" cy="80" r="3" fill="#ffffff" />
        <circle cx="260" cy="72" r="2" fill={accentColor} />
        <circle cx="340" cy="72" r="2" fill={accentColor} />
        <circle cx="200" cy="55" r="2" fill={accentColor} />
        <circle cx="400" cy="55" r="2" fill={accentColor} />
        <circle cx="150" cy="80" r="2" fill={accentColor} />
        <circle cx="450" cy="80" r="2" fill={accentColor} />
      </g>
    </svg>
  );
};

// =========================================================================
// 5. BÀI THƠ 31 BÀI CHO 31 NGÀY TRONG THÁNG (POETRY LIST)
// =========================================================================
import { poetList, getSeasonDisplay, getSeasonName, PoetItem } from '../utils/libraryPoetry';
export { poetList, getSeasonDisplay, getSeasonName, type PoetItem };

// =========================================================================
// 6. CẤU HÌNH MÀU SẮC ĐỒNG BỘ 5 THEME Ở CHẾ ĐỘ SÁNG (THEME COLOR SCHEMES)
// =========================================================================
export interface WidgetThemeConfig {
  themeId: string;
  outerBorder: string;
  outerShadow: string;
  radialGradient: string;
  ambientOrbBg: string;
  glyphColor: string;
  barcodeColor: string;
  miniWidgetTitle: string;
  followText: string;
  topDivider: string;
  calContainerBg: string;
  calContainerBorder: string;
  calContainerShadow: string;
  calHeaderTitle: string;
  calCardBorder: string;
  calCardShadow: string;
  ringBorder: string;
  ringGradient: string;
  calDivider: string;
  calIconColor: string;
  calSelectedDayBg: string;
  calSelectedDayShadow: string;
  calDayHoverBg: string;
  calDayHoverText: string;
  poetContainerBorder: string;
  poetHeaderColor: string;
  poetAuthorColor: string;
  poetActiveDot: string;
  poetNextBtnBorder: string;
  poetNextBtnBg: string;
  poetNextBtnHoverBg: string;
  poetNextBtnText: string;
  anthesisSubtitle: string;
  starColor: string;
  bookCardBorder: string;
  bookCardShadow: string;
  gridLineColor: string;
  bookTagColor: string;
  progressTrackBg: string;
  progressBarBg: string;
  readMoreBtnColor: string;
  nienthoiText: string;
  axisDotBg: string;
  axisLineBg: string;
  axisText: string;
  globeSnowflake1: string;
  globeSnowflake2: string;
  globeSnowflake3: string;
  globeShadow: string;
  globeSkyGradient: string;
  globePedestalAccent: string;
  hillColor1: string;
  hillColor2: string;
  hillColor3: string;
  hillShadow: string;
  bridgePierFill: string;
  bridgePierStroke: string;
  bridgePierShadow: string;
  bridgeRailStroke: string;
  pineColor1: string;
  pineColor2: string;
  pineColor3: string;
  astroBorder: string;
  astroLabel: string;
  astroTime: string;
  audioDivider: string;
  audioPlayBtnBg: string;
  audioPlayBtnHoverBg: string;
  audioPlayBtnShadow: string;
  audioProgressTrackBg: string;
  audioProgressBarBg: string;
  audioSpeedBorder: string;
}

export const getThemeConfig = (themeId: string = 'slate-haze'): WidgetThemeConfig => {
  switch (themeId) {
    case 'amethyst-haze':
      return {
        themeId,
        outerBorder: 'border-purple-200',
        outerShadow: 'shadow-[0_20px_50px_rgba(216,180,254,0.4)]',
        radialGradient: 'bg-[radial-gradient(circle_at_30%_20%,rgba(243,232,255,0.6)_0%,rgba(255,255,255,0.98)_100%)]',
        ambientOrbBg: 'bg-purple-200/40',
        glyphColor: 'text-purple-600',
        barcodeColor: 'bg-purple-800',
        miniWidgetTitle: 'text-purple-800',
        followText: 'text-purple-700',
        topDivider: 'border-purple-200',
        calContainerBg: 'bg-[#faf5fd]',
        calContainerBorder: 'border-purple-200/90',
        calContainerShadow: 'shadow-[0_8px_25px_rgba(216,180,254,0.22)]',
        calHeaderTitle: 'text-purple-800',
        calCardBorder: 'border-purple-200',
        calCardShadow: 'shadow-purple-100',
        ringBorder: 'border-purple-300',
        ringGradient: 'from-purple-100 via-purple-300 to-slate-400',
        calDivider: 'border-purple-100',
        calIconColor: 'text-purple-600',
        calSelectedDayBg: 'bg-[#7e58a6]',
        calSelectedDayShadow: 'shadow-purple-500/40',
        calDayHoverBg: 'hover:bg-purple-50',
        calDayHoverText: 'hover:text-purple-900',
        poetContainerBorder: 'border-purple-200/90',
        poetHeaderColor: 'text-purple-700',
        poetAuthorColor: 'text-purple-700',
        poetActiveDot: 'bg-[#7e58a6]',
        poetNextBtnBorder: 'border-purple-200',
        poetNextBtnBg: 'bg-purple-50',
        poetNextBtnHoverBg: 'hover:bg-purple-100',
        poetNextBtnText: 'text-[#7e58a6]',
        anthesisSubtitle: 'text-purple-700',
        starColor: 'text-purple-600',
        bookCardBorder: 'border-purple-100/90',
        bookCardShadow: 'shadow-[0_12px_30px_rgba(168,130,200,0.18)]',
        gridLineColor: 'rgba(216, 180, 254, 0.35)',
        bookTagColor: 'text-purple-700',
        progressTrackBg: 'bg-purple-100',
        progressBarBg: 'bg-[#7e58a6]',
        readMoreBtnColor: 'text-purple-700 hover:text-purple-900',
        nienthoiText: 'text-purple-700',
        axisDotBg: 'bg-[#7e58a6]',
        axisLineBg: 'bg-purple-300',
        axisText: 'text-purple-900',
        globeSnowflake1: 'text-purple-400/80',
        globeSnowflake2: 'text-purple-500/75',
        globeSnowflake3: 'text-purple-300/85',
        globeShadow: 'shadow-[0_0_50px_rgba(216,180,254,0.4),inset_0_0_35px_rgba(255,255,255,0.5),inset_0_8px_18px_rgba(255,255,255,0.6)]',
        globeSkyGradient: 'from-[#dfccf2]/40 via-[#ecdcf9]/60 to-[#faf5fd]/90',
        globePedestalAccent: '#dfccf2',
        hillColor1: '#ecdcf9',
        hillColor2: '#f4ebfc',
        hillColor3: '#cbb6e5',
        hillShadow: '#bfa7dc',
        bridgePierFill: '#faf5fd',
        bridgePierStroke: '#d4bfea',
        bridgePierShadow: '#c4a8df',
        bridgeRailStroke: '#c9b0e2',
        pineColor1: '#baa3d9',
        pineColor2: '#9d83c4',
        pineColor3: '#8568b0',
        astroBorder: 'border-purple-200',
        astroLabel: 'text-purple-700',
        astroTime: 'text-[#7e58a6]',
        audioDivider: 'border-purple-100',
        audioPlayBtnBg: 'bg-[#7e58a6]',
        audioPlayBtnHoverBg: 'hover:bg-purple-700',
        audioPlayBtnShadow: 'shadow-purple-500/30',
        audioProgressTrackBg: 'bg-purple-100',
        audioProgressBarBg: 'bg-[#7e58a6]',
        audioSpeedBorder: 'border-purple-200',
      };

    case 'sage':
      return {
        themeId,
        outerBorder: 'border-emerald-200',
        outerShadow: 'shadow-[0_20px_50px_rgba(167,243,208,0.4)]',
        radialGradient: 'bg-[radial-gradient(circle_at_30%_20%,rgba(236,253,245,0.6)_0%,rgba(255,255,255,0.98)_100%)]',
        ambientOrbBg: 'bg-emerald-200/40',
        glyphColor: 'text-emerald-700',
        barcodeColor: 'bg-emerald-800',
        miniWidgetTitle: 'text-emerald-800',
        followText: 'text-emerald-700',
        topDivider: 'border-emerald-200',
        calContainerBg: 'bg-[#f4faf5]',
        calContainerBorder: 'border-emerald-200/90',
        calContainerShadow: 'shadow-[0_8px_25px_rgba(167,243,208,0.22)]',
        calHeaderTitle: 'text-emerald-800',
        calCardBorder: 'border-emerald-200',
        calCardShadow: 'shadow-emerald-100',
        ringBorder: 'border-emerald-300',
        ringGradient: 'from-emerald-100 via-emerald-300 to-slate-400',
        calDivider: 'border-emerald-100',
        calIconColor: 'text-emerald-700',
        calSelectedDayBg: 'bg-[#3f573d]',
        calSelectedDayShadow: 'shadow-emerald-600/40',
        calDayHoverBg: 'hover:bg-emerald-50',
        calDayHoverText: 'hover:text-emerald-900',
        poetContainerBorder: 'border-emerald-200/90',
        poetHeaderColor: 'text-emerald-700',
        poetAuthorColor: 'text-emerald-700',
        poetActiveDot: 'bg-[#3f573d]',
        poetNextBtnBorder: 'border-emerald-200',
        poetNextBtnBg: 'bg-emerald-50',
        poetNextBtnHoverBg: 'hover:bg-emerald-100',
        poetNextBtnText: 'text-[#3f573d]',
        anthesisSubtitle: 'text-emerald-700',
        starColor: 'text-emerald-700',
        bookCardBorder: 'border-emerald-100/90',
        bookCardShadow: 'shadow-[0_12px_30px_rgba(100,160,120,0.18)]',
        gridLineColor: 'rgba(167, 243, 208, 0.35)',
        bookTagColor: 'text-emerald-700',
        progressTrackBg: 'bg-emerald-100',
        progressBarBg: 'bg-[#3f573d]',
        readMoreBtnColor: 'text-emerald-700 hover:text-emerald-900',
        nienthoiText: 'text-emerald-700',
        axisDotBg: 'bg-[#3f573d]',
        axisLineBg: 'bg-emerald-300',
        axisText: 'text-emerald-900',
        globeSnowflake1: 'text-emerald-400/80',
        globeSnowflake2: 'text-emerald-500/75',
        globeSnowflake3: 'text-emerald-300/85',
        globeShadow: 'shadow-[0_0_50px_rgba(167,243,208,0.4),inset_0_0_35px_rgba(255,255,255,0.5),inset_0_8px_18px_rgba(255,255,255,0.6)]',
        globeSkyGradient: 'from-[#caebd0]/40 via-[#dcf2e1]/60 to-[#f4faf5]/90',
        globePedestalAccent: '#caebd0',
        hillColor1: '#d5edd9',
        hillColor2: '#e4f5e7',
        hillColor3: '#b2dfb9',
        hillShadow: '#9fcea7',
        bridgePierFill: '#f4faf5',
        bridgePierStroke: '#bce0c2',
        bridgePierShadow: '#a1cda8',
        bridgeRailStroke: '#aed4b4',
        pineColor1: '#9ccba2',
        pineColor2: '#7cb583',
        pineColor3: '#629e6a',
        astroBorder: 'border-emerald-200',
        astroLabel: 'text-emerald-700',
        astroTime: 'text-[#3f573d]',
        audioDivider: 'border-emerald-100',
        audioPlayBtnBg: 'bg-[#3f573d]',
        audioPlayBtnHoverBg: 'hover:bg-emerald-800',
        audioPlayBtnShadow: 'shadow-emerald-600/30',
        audioProgressTrackBg: 'bg-emerald-100',
        audioProgressBarBg: 'bg-[#3f573d]',
        audioSpeedBorder: 'border-emerald-200',
      };

    case 'mocha':
      return {
        themeId,
        outerBorder: 'border-[#e6dbcb]',
        outerShadow: 'shadow-[0_20px_50px_rgba(220,205,180,0.28)]',
        radialGradient: 'bg-[radial-gradient(circle_at_30%_20%,rgba(247,241,228,0.75)_0%,rgba(255,253,249,0.98)_100%)]',
        ambientOrbBg: 'bg-[#ece2cb]/35',
        glyphColor: 'text-amber-700',
        barcodeColor: 'bg-amber-800',
        miniWidgetTitle: 'text-amber-800',
        followText: 'text-amber-700',
        topDivider: 'border-amber-200',
        calContainerBg: 'bg-[#fcf7f2]',
        calContainerBorder: 'border-amber-200/90',
        calContainerShadow: 'shadow-[0_8px_25px_rgba(253,230,138,0.22)]',
        calHeaderTitle: 'text-amber-800',
        calCardBorder: 'border-amber-200',
        calCardShadow: 'shadow-amber-100',
        ringBorder: 'border-amber-300',
        ringGradient: 'from-amber-100 via-amber-300 to-slate-400',
        calDivider: 'border-amber-100',
        calIconColor: 'text-amber-700',
        calSelectedDayBg: 'bg-[#a37764]',
        calSelectedDayShadow: 'shadow-amber-600/40',
        calDayHoverBg: 'hover:bg-amber-50',
        calDayHoverText: 'hover:text-amber-900',
        poetContainerBorder: 'border-amber-200/90',
        poetHeaderColor: 'text-amber-700',
        poetAuthorColor: 'text-amber-700',
        poetActiveDot: 'bg-[#a37764]',
        poetNextBtnBorder: 'border-amber-200',
        poetNextBtnBg: 'bg-amber-50',
        poetNextBtnHoverBg: 'hover:bg-amber-100',
        poetNextBtnText: 'text-[#a37764]',
        anthesisSubtitle: 'text-amber-700',
        starColor: 'text-amber-700',
        bookCardBorder: 'border-amber-100/90',
        bookCardShadow: 'shadow-[0_12px_30px_rgba(160,120,90,0.18)]',
        gridLineColor: 'rgba(253, 230, 138, 0.35)',
        bookTagColor: 'text-amber-700',
        progressTrackBg: 'bg-amber-100',
        progressBarBg: 'bg-[#a37764]',
        readMoreBtnColor: 'text-amber-700 hover:text-amber-900',
        nienthoiText: 'text-amber-700',
        axisDotBg: 'bg-[#a37764]',
        axisLineBg: 'bg-amber-300',
        axisText: 'text-amber-900',
        globeSnowflake1: 'text-amber-400/80',
        globeSnowflake2: 'text-amber-500/75',
        globeSnowflake3: 'text-amber-300/85',
        globeShadow: 'shadow-[0_0_50px_rgba(253,230,138,0.4),inset_0_0_35px_rgba(255,255,255,0.5),inset_0_8px_18px_rgba(255,255,255,0.6)]',
        globeSkyGradient: 'from-[#fae3cf]/40 via-[#fbede1]/60 to-[#fcf7f2]/90',
        globePedestalAccent: '#fae3cf',
        hillColor1: '#f0e3d5',
        hillColor2: '#f8f0e7',
        hillColor3: '#dfc4a9',
        hillShadow: '#cca987',
        bridgePierFill: '#fcf7f2',
        bridgePierStroke: '#e2ccb8',
        bridgePierShadow: '#cfb199',
        bridgeRailStroke: '#d5bea8',
        pineColor1: '#d2b79e',
        pineColor2: '#bc9c80',
        pineColor3: '#a48265',
        astroBorder: 'border-amber-200',
        astroLabel: 'text-amber-700',
        astroTime: 'text-[#a37764]',
        audioDivider: 'border-amber-100',
        audioPlayBtnBg: 'bg-[#a37764]',
        audioPlayBtnHoverBg: 'hover:bg-amber-800',
        audioPlayBtnShadow: 'shadow-amber-600/30',
        audioProgressTrackBg: 'bg-amber-100',
        audioProgressBarBg: 'bg-[#a37764]',
        audioSpeedBorder: 'border-amber-200',
      };

    case 'notebook':
      return {
        themeId,
        outerBorder: 'border-slate-300',
        outerShadow: 'shadow-[0_20px_50px_rgba(148,163,184,0.35)]',
        radialGradient: 'bg-[radial-gradient(circle_at_30%_20%,rgba(241,245,249,0.6)_0%,rgba(255,255,255,0.98)_100%)]',
        ambientOrbBg: 'bg-slate-200/40',
        glyphColor: 'text-slate-600',
        barcodeColor: 'bg-slate-800',
        miniWidgetTitle: 'text-slate-800',
        followText: 'text-slate-700',
        topDivider: 'border-slate-300',
        calContainerBg: 'bg-[#f8fafc]',
        calContainerBorder: 'border-slate-300/90',
        calContainerShadow: 'shadow-[0_8px_25px_rgba(148,163,184,0.2)]',
        calHeaderTitle: 'text-slate-800',
        calCardBorder: 'border-slate-300',
        calCardShadow: 'shadow-slate-100',
        ringBorder: 'border-slate-400',
        ringGradient: 'from-slate-100 via-slate-300 to-slate-500',
        calDivider: 'border-slate-200',
        calIconColor: 'text-slate-600',
        calSelectedDayBg: 'bg-[#334155]',
        calSelectedDayShadow: 'shadow-slate-600/40',
        calDayHoverBg: 'hover:bg-slate-100',
        calDayHoverText: 'hover:text-slate-900',
        poetContainerBorder: 'border-slate-300/90',
        poetHeaderColor: 'text-slate-700',
        poetAuthorColor: 'text-slate-700',
        poetActiveDot: 'bg-[#334155]',
        poetNextBtnBorder: 'border-slate-300',
        poetNextBtnBg: 'bg-slate-100',
        poetNextBtnHoverBg: 'hover:bg-slate-200',
        poetNextBtnText: 'text-[#334155]',
        anthesisSubtitle: 'text-slate-700',
        starColor: 'text-slate-600',
        bookCardBorder: 'border-slate-200/90',
        bookCardShadow: 'shadow-[0_12px_30px_rgba(100,116,139,0.18)]',
        gridLineColor: 'rgba(148, 163, 184, 0.35)',
        bookTagColor: 'text-slate-700',
        progressTrackBg: 'bg-slate-200',
        progressBarBg: 'bg-[#334155]',
        readMoreBtnColor: 'text-slate-700 hover:text-slate-900',
        nienthoiText: 'text-slate-700',
        axisDotBg: 'bg-[#334155]',
        axisLineBg: 'bg-slate-300',
        axisText: 'text-slate-900',
        globeSnowflake1: 'text-slate-400/80',
        globeSnowflake2: 'text-slate-500/75',
        globeSnowflake3: 'text-slate-300/85',
        globeShadow: 'shadow-[0_0_50px_rgba(148,163,184,0.35),inset_0_0_35px_rgba(255,255,255,0.5),inset_0_8px_18px_rgba(255,255,255,0.6)]',
        globeSkyGradient: 'from-[#e2e8f0]/40 via-[#edf2f7]/60 to-[#f8fafc]/90',
        globePedestalAccent: '#cbd5e1',
        hillColor1: '#e2e8f0',
        hillColor2: '#edf2f7',
        hillColor3: '#cbd5e1',
        hillShadow: '#94a3b8',
        bridgePierFill: '#f8fafc',
        bridgePierStroke: '#cbd5e1',
        bridgePierShadow: '#94a3b8',
        bridgeRailStroke: '#94a3b8',
        pineColor1: '#94a3b8',
        pineColor2: '#64748b',
        pineColor3: '#475569',
        astroBorder: 'border-slate-300',
        astroLabel: 'text-slate-700',
        astroTime: 'text-[#334155]',
        audioDivider: 'border-slate-200',
        audioPlayBtnBg: 'bg-[#334155]',
        audioPlayBtnHoverBg: 'hover:bg-slate-800',
        audioPlayBtnShadow: 'shadow-slate-600/30',
        audioProgressTrackBg: 'bg-slate-200',
        audioProgressBarBg: 'bg-[#334155]',
        audioSpeedBorder: 'border-slate-300',
      };

    case 'slate-haze':
    default:
      // THEME FROST CHẾ ĐỘ SÁNG: GIỮ NGUYÊN 100% NHƯ CODE MẪU BẠN CUNG CẤP
      return {
        themeId: 'slate-haze',
        outerBorder: 'border-sky-200',
        outerShadow: 'shadow-[0_20px_50px_rgba(186,215,248,0.45)]',
        radialGradient: 'bg-[radial-gradient(circle_at_30%_20%,rgba(224,242,254,0.6)_0%,rgba(255,255,255,0.98)_100%)]',
        ambientOrbBg: 'bg-sky-200/40',
        glyphColor: 'text-sky-600',
        barcodeColor: 'bg-sky-800',
        miniWidgetTitle: 'text-sky-800',
        followText: 'text-sky-700',
        topDivider: 'border-sky-200',
        calContainerBg: 'bg-[#f4f9fd]',
        calContainerBorder: 'border-sky-200/90',
        calContainerShadow: 'shadow-[0_8px_25px_rgba(186,215,248,0.25)]',
        calHeaderTitle: 'text-sky-800',
        calCardBorder: 'border-sky-200',
        calCardShadow: 'shadow-sky-100',
        ringBorder: 'border-sky-300',
        ringGradient: 'from-sky-100 via-sky-300 to-slate-400',
        calDivider: 'border-sky-100',
        calIconColor: 'text-sky-600',
        calSelectedDayBg: 'bg-[#0284c7]',
        calSelectedDayShadow: 'shadow-sky-500/40',
        calDayHoverBg: 'hover:bg-sky-50',
        calDayHoverText: 'hover:text-sky-900',
        poetContainerBorder: 'border-sky-200/90',
        poetHeaderColor: 'text-sky-700',
        poetAuthorColor: 'text-sky-700',
        poetActiveDot: 'bg-[#0284c7]',
        poetNextBtnBorder: 'border-sky-200',
        poetNextBtnBg: 'bg-sky-50',
        poetNextBtnHoverBg: 'hover:bg-sky-100',
        poetNextBtnText: 'text-[#0284c7]',
        anthesisSubtitle: 'text-sky-700',
        starColor: 'text-sky-600',
        bookCardBorder: 'border-sky-100/90',
        bookCardShadow: 'shadow-[0_12px_30px_rgba(100,140,180,0.18)]',
        gridLineColor: 'rgba(147, 197, 253, 0.3)',
        bookTagColor: 'text-sky-700',
        progressTrackBg: 'bg-sky-100',
        progressBarBg: 'bg-[#0284c7]',
        readMoreBtnColor: 'text-sky-700 hover:text-sky-900',
        nienthoiText: 'text-sky-700',
        axisDotBg: 'bg-[#0284c7]',
        axisLineBg: 'bg-sky-300',
        axisText: 'text-sky-900',
        globeSnowflake1: 'text-sky-400/80',
        globeSnowflake2: 'text-sky-500/75',
        globeSnowflake3: 'text-sky-300/85',
        globeShadow: 'shadow-[0_0_50px_rgba(180,215,255,0.4),inset_0_0_35px_rgba(255,255,255,0.5),inset_0_8px_18px_rgba(255,255,255,0.6)]',
        globeSkyGradient: 'from-[#b8d7ee]/40 via-[#d3e7f7]/60 to-[#eef6fc]/90',
        globePedestalAccent: '#c5e3fb',
        hillColor1: '#d6e6f4',
        hillColor2: '#e2edf7',
        hillColor3: '#b6d0e5',
        hillShadow: '#a9c7de',
        bridgePierFill: '#f4f8fc',
        bridgePierStroke: '#b8d4e9',
        bridgePierShadow: '#adcfe6',
        bridgeRailStroke: '#a4c7e2',
        pineColor1: '#87b8dc',
        pineColor2: '#73a9d4',
        pineColor3: '#6fa5cd',
        astroBorder: 'border-sky-200',
        astroLabel: 'text-sky-700',
        astroTime: 'text-[#0284c7]',
        audioDivider: 'border-sky-100',
        audioPlayBtnBg: 'bg-[#0284c7]',
        audioPlayBtnHoverBg: 'hover:bg-sky-700',
        audioPlayBtnShadow: 'shadow-sky-500/30',
        audioProgressTrackBg: 'bg-sky-100',
        audioProgressBarBg: 'bg-[#0284c7]',
        audioSpeedBorder: 'border-sky-200',
      };
  }
};

// =========================================================================
// 7. TOÀN BỘ KHỐI MINI WIDGET CHẾ ĐỘ SÁNG HOÀN CHỈNH
// =========================================================================
export interface EntireWhiteLilyAzureWidgetProps {
  themeId?: string;
  recentNovel?: Novel | null;
  onSelectNovel?: (novel: Novel) => void;
  onOpenReading?: () => void;
}

export const EntireWhiteLilyAzureWidget: React.FC<EntireWhiteLilyAzureWidgetProps> = ({
  themeId = 'slate-haze',
  recentNovel,
  onSelectNovel,
  onOpenReading,
}) => {
  const c = getThemeConfig(themeId);

  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [activePoetIdx, setActivePoetIdx] = useState<number>(23); // 24 / 31 mặc định tương ứng ngày 24
  const [readingProgress, setReadingProgress] = useState<number>(78);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [timeStr, setTimeStr] = useState<string>('03:32:52 PM');
  const [isGlobeShaking, setIsGlobeShaking] = useState<boolean>(false);

  // 42 hạt tuyết bay lơ lửng bên trong quả cầu
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
    playChime(880);
    setIsGlobeShaking(true);
    setTimeout(() => setIsGlobeShaking(false), 2400);
  };

  // Cập nhật đồng hồ thời gian thực chuẩn như góc dưới ảnh
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const strHours = String(hours).padStart(2, '0');
      setTimeStr(`${strHours}:${minutes}:${seconds} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const barcodePattern = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 2, 4, 1, 2];
  const currentPoet = poetList[activePoetIdx % poetList.length];

  return (
    /* THẺ CHÍNH MINI WIDGET: BO GÓC 2XL/3XL, TỰ ĐỘNG CHUYỂN BẢNG MÀU CHO CẢ 5 THEME */
    <div className={`w-full max-w-4xl rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-10 border ${c.outerBorder} bg-white ${c.outerShadow} relative select-none overflow-hidden transition-all duration-500 font-sans antialiased text-slate-800`}>
      
      {/* -----------------------------------------------------------------
          A. NỀN QUẦNG SÁNG TỰ NHIÊN (AMBIENT BACKGROUND GLOW)
          ----------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
        <div className={`absolute inset-0 ${c.radialGradient}`} />
        <div className={`absolute top-1/4 right-1/4 w-80 h-80 ${c.ambientOrbBg} rounded-full blur-3xl`} />
      </div>

      {/* -----------------------------------------------------------------
          B. HỆ THỐNG TRANG TRÍ VI HÌNH HỌC RẢI RÁC TRONG KHỐI LỚN
          ----------------------------------------------------------------- */}
      <div className={`absolute inset-0 pointer-events-none select-none z-20 ${c.glyphColor}`}>
        <div className="absolute top-4 sm:top-5 left-4 sm:left-7 opacity-40"><MicroStar4 className="w-2 sm:w-2.5 h-2 sm:h-2.5" /></div>
        <div className="absolute top-4 sm:top-5 right-4 sm:right-7 opacity-35"><MicroDot className="w-1 sm:w-1.5 h-1 sm:h-1.5" /></div>
        <div className="absolute top-[30%] left-3 sm:left-6 opacity-35"><MicroSquareFilled className="w-1 sm:w-1.5 h-1 sm:h-1.5" /></div>
        <div className="absolute top-[34%] right-3 sm:right-6 opacity-35"><MicroDiamond className="w-1 sm:w-1.5 h-1 sm:h-1.5" /></div>
        <div className="absolute top-[56%] left-3 sm:left-6 opacity-35"><MicroCircle className="w-1 sm:w-1.5 h-1 sm:h-1.5" /></div>
        <div className="absolute top-[58%] right-3 sm:right-6 opacity-35"><MicroStar4 className="w-1.5 sm:w-2 h-1.5 sm:h-2" /></div>
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-7 opacity-35"><MicroStar4 className="w-2 sm:w-2.5 h-2 sm:h-2.5" /></div>
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-7 opacity-40"><MicroDot className="w-1 sm:w-1.5 h-1 sm:h-1.5" /></div>
      </div>

      {/* -----------------------------------------------------------------
          C. THANH TIÊU ĐỀ ĐỈNH: BARCODE + MINI WIDGET + FOLLOW
          ----------------------------------------------------------------- */}
      <div className={`relative z-10 flex items-center justify-between border-b ${c.topDivider} pb-2 sm:pb-3 mb-4 sm:mb-6`}>
        {/* Mã vạch Barcode */}
        <div className="flex items-center gap-[1.5px] sm:gap-[2px] h-3.5 sm:h-4 opacity-50">
          {barcodePattern.map((width, idx) => (
            <span key={idx} style={{ width: `${width}px` }} className={`h-full inline-block ${c.barcodeColor}`} />
          ))}
        </div>

        {/* Tiêu đề MINI WIDGET */}
        <span className={`text-[9px] sm:text-[11px] font-mono tracking-[0.25em] sm:tracking-[0.4em] uppercase ${c.miniWidgetTitle} font-semibold`}>
          M I N I &nbsp; W I D G E T
        </span>

        {/* Ký hiệu + FOLLOW */}
        <span className={`text-[8.5px] sm:text-[10px] font-mono ${c.followText}`}>+ FOLLOW</span>
      </div>

      {/* -----------------------------------------------------------------
          D. KHU VỰC 1: CALENDAR (LỊCH THÁNG 10 VÀ TUYỂN THƠ POETS - TRÊN ĐIỆN THOẠI CŨNG NẰM TRÊN CÙNG 1 DÒNG)
          ----------------------------------------------------------------- */}
      <div className={`relative z-10 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-6 border ${c.calContainerBorder} ${c.calContainerBg} ${c.calContainerShadow} mb-4 sm:mb-6 md:mb-8`}>
        <div className={`text-[8px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase border-b ${c.topDivider} pb-1.5 sm:pb-2 mb-2 sm:mb-4 ${c.calHeaderTitle}`}>
          <span>CALENDAR</span>
        </div>

        {/* Luôn nằm trên cùng 1 dòng trên cả điện thoại: grid-cols-2 */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 items-stretch">
          {/* Lịch tháng 10/2026 với 6 khuyên lò xo nổi */}
          <div className="flex flex-col justify-between gap-1 sm:gap-2 min-w-0">
            <div className={`relative w-full rounded-lg sm:rounded-xl border ${c.calCardBorder} bg-white ${c.calCardShadow} shadow-md pt-3 sm:pt-4 pb-2 sm:pb-3 px-1.5 sm:px-3`}>
              {/* Dãy 6 khuyên lò xo kim loại */}
              <div className="absolute -top-1.5 sm:-top-2 left-0 right-0 flex justify-between px-2 sm:px-6 pointer-events-none z-20">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 sm:w-2 h-3 sm:h-4 rounded-full border ${c.ringBorder} bg-gradient-to-b ${c.ringGradient} shadow-sm`}
                  />
                ))}
              </div>

              {/* Tiêu đề tháng */}
              <div className={`flex items-center justify-between border-b ${c.calDivider} pb-1 mb-1 sm:pb-1.5 sm:mb-1.5`}>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <CalendarIcon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${c.calIconColor}`} />
                  <span className="font-mono text-[7px] xs:text-[8.5px] sm:text-xs font-semibold tracking-wider text-slate-900 truncate">
                    OCTOBER // 2026
                  </span>
                </div>
              </div>

              {/* Thứ trong tuần */}
              <div className={`grid grid-cols-7 gap-0.5 text-center text-[5.5px] xs:text-[6.5px] sm:text-[9px] font-mono pb-0.5 sm:pb-1 border-b ${c.calDivider} text-slate-400`}>
                <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
              </div>

              {/* Lưới 31 ngày (Ngày được chọn màu chủ đạo) */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center font-mono text-[5.5px] xs:text-[7px] sm:text-[9px] pt-1">
                <span className="p-0.5 opacity-25">27</span>
                <span className="p-0.5 opacity-25">28</span>
                <span className="p-0.5 opacity-25">29</span>
                <span className="p-0.5 opacity-25">30</span>
                {Array.from({ length: 31 }, (_, idx) => {
                  const dayNum = idx + 1;
                  const isSelected = selectedDay === dayNum;
                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => {
                        playPaperTap();
                        setSelectedDay(dayNum);
                        setActivePoetIdx((dayNum - 1) % poetList.length);
                      }}
                      className={`p-0.5 sm:p-1 rounded-xs cursor-pointer transition-all aspect-square flex items-center justify-center ${
                        isSelected
                          ? `${c.calSelectedDayBg} text-white font-bold shadow-md ${c.calSelectedDayShadow} scale-105`
                          : `text-slate-700 ${c.calDayHoverText} ${c.calDayHoverBg}`
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dòng Memo */}
            <div className="flex items-center justify-between font-mono text-[6.5px] xs:text-[7.5px] sm:text-[9px] text-slate-500 px-0.5">
              <div>
                <p>MEMO · OCT {selectedDay}</p>
                <p className="opacity-75">FLORAL ANTHESIS</p>
              </div>
              <div className="text-right opacity-75">
                <p>MONTHLY CALENDAR</p>
              </div>
            </div>
          </div>

          {/* CỘT 2: KHUNG QUOTATIONS VỚI GHIM PAPER CLIP VÀ HỌA TIẾT LINED PAPER */}
          <div
            className={`relative overflow-visible flex flex-col justify-between h-full rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border ${c.poetContainerBorder} bg-white shadow-sm min-w-0`}
            style={{
              backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 19px, rgba(148, 163, 184, 0.16) 19px, rgba(148, 163, 184, 0.16) 20px)',
              backgroundPosition: '0 8px',
            }}
          >
            {/* CHIẾC GHIM PAPER CLIP NẰM Ở GÓC TRÊN BÊN PHẢI */}
            <MetallicPaperClip
              isDarkMode={false}
              themeId={c.themeId}
              className="absolute -top-3.5 sm:-top-4.5 right-3 sm:right-5 z-20 pointer-events-none"
            />

            <div>
              <div className={`flex items-center justify-between text-[7px] xs:text-[8px] sm:text-xs font-mono tracking-wider pb-1.5 sm:pb-2 border-b ${c.calDivider} ${c.poetHeaderColor}`}>
                <span className="font-semibold">Quotations</span>
              </div>

              {/* 4 dòng trích dẫn lãng mạn trên giấy kẻ dòng */}
              <div className="py-1.5 sm:py-3 space-y-0.5 sm:space-y-1 font-serif text-[7.5px] xs:text-[9px] sm:text-xs md:text-sm italic text-slate-800 leading-relaxed overflow-hidden">
                {currentPoet.lines.map((line, idx) => (
                  <p key={idx} className="line-clamp-1">{line}</p>
                ))}
              </div>
            </div>

            {/* Chấm phân trang & Nút NEXT ○ */}
            <div className={`pt-1.5 sm:pt-2 border-t ${c.calDivider} flex items-center justify-between`}>
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-hidden max-w-[50%]">
                {poetList.slice(0, 10).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full transition-transform shrink-0 ${
                      i === (activePoetIdx % 10) ? `${c.poetActiveDot} scale-125` : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  playChime(659.25);
                  const nextIdx = (activePoetIdx + 1) % poetList.length;
                  setActivePoetIdx(nextIdx);
                  setSelectedDay(nextIdx + 1);
                }}
                className={`inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${c.poetNextBtnBorder} ${c.poetNextBtnBg} ${c.poetNextBtnHoverBg} ${c.poetNextBtnText} text-[8px] sm:text-xs font-mono font-medium transition-all cursor-pointer shrink-0`}
              >
                <span>NEXT</span>
                <span className="text-[6.5px] sm:text-[8px]">○</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          E. KHU VỰC 3: ANTHESIS // THREE-DAY CYCLE & L I B R A R Y
          ----------------------------------------------------------------- */}
      <div className={`relative z-10 pt-2 mb-2 sm:mb-4 border-t ${c.topDivider}`}>
        <div className={`text-[8px] sm:text-[10px] font-mono tracking-widest uppercase ${c.anthesisSubtitle} mb-1 sm:mb-2`}>
          ANTHESIS // THREE-DAY CYCLE
        </div>

        {/* Chữ LIBRARY lớn với 4 ngôi sao 4 cánh quanh chữ */}
        <div className="relative inline-block my-1 sm:my-2 py-0.5 sm:py-1 pr-4 sm:pr-6">
          <span className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.25em] sm:tracking-[0.4em] uppercase text-slate-900 select-none">
            L I B R A R Y
          </span>

          {/* 4 Ngôi sao 4 cánh trang trí */}
          <div className={`pointer-events-none select-none ${c.starColor}`}>
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-4 opacity-60"><MicroStar4 className="w-2 sm:w-2.5 h-2 sm:h-2.5" /></div>
            <div className="absolute -top-1 left-[25%] opacity-65"><MicroStar4 className="w-2 sm:w-2.5 h-2 sm:h-2.5" /></div>
            <div className="absolute top-1 right-[-6px] sm:right-[-10px] opacity-70"><MicroStar4 className="w-2.5 sm:w-3 h-2.5 sm:h-3" /></div>
            <div className="absolute -bottom-1 left-[65%] opacity-55"><MicroStar4 className="w-1.5 sm:w-2 h-1.5 sm:h-2" /></div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          F. KHU VỰC 2: 3 CỘT (TRÊN ĐIỆN THOẠI CŨNG NẰM TRÊN CÙNG 1 DÒNG: COL-5, COL-2, COL-5)
          ----------------------------------------------------------------- */}
      <div className="relative z-10 grid grid-cols-12 gap-1.5 xs:gap-2 sm:gap-4 md:gap-6 items-center my-2 sm:my-4 py-1 sm:py-2">
        
        {/* CỘT TRÁI (col-span-5): THẺ SÁCH ĐỌC GẦN ĐÂY #GEOMETRY_03 */}
        <div className="col-span-5 flex flex-col gap-1.5 sm:gap-2.5 min-w-0">
          <motion.div
            whileHover={{ scale: 1.015 }}
            className={`relative rounded-sm p-2 xs:p-2.5 sm:p-4 bg-white/95 border ${c.bookCardBorder} text-slate-800 ${c.bookCardShadow} select-none transition-transform`}
          >
            {/* Băng keo Washi Tape trong suốt dán phẳng mép trên */}
            <div
              className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 w-14 xs:w-18 sm:w-24 h-3.5 sm:h-5 rounded-xs z-30 pointer-events-none"
              style={{
                background: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.7)',
                borderLeft: '2px dashed rgba(0, 0, 0, 0.08)',
                borderRight: '2px dashed rgba(0, 0, 0, 0.08)',
              }}
            />

            {/* Họa tiết ô ly kẻ tập học sinh */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none rounded-sm"
              style={{
                backgroundSize: '16px 16px',
                backgroundImage: `linear-gradient(to right, ${c.gridLineColor} 1px, transparent 1px), linear-gradient(to bottom, ${c.gridLineColor} 1px, transparent 1px)`,
              }}
            />

            <div className="relative z-10 space-y-0.5 sm:space-y-1">
              <div className={`text-[6.5px] xs:text-[7.5px] sm:text-[10px] font-mono tracking-[0.15em] sm:tracking-[0.2em] uppercase ${c.bookTagColor} font-semibold truncate`}>
                ĐỌC GẦN ĐÂY
              </div>

              <div>
                <h4 className="font-serif text-[8.5px] xs:text-[10px] sm:text-sm font-medium tracking-wider text-slate-900 truncate">
                  {recentNovel?.title || 'Dạ Khúc Bạch Hợp'}
                </h4>
                <p className="font-serif italic text-[6.5px] xs:text-[7.5px] sm:text-[10px] text-slate-600 truncate">
                  {recentNovel ? `Tác giả: ${typeof recentNovel.author === 'string' ? recentNovel.author : recentNovel.author?.name || 'Jouriee65'}` : 'Chương 42: Nở Rộ Trong Tĩnh Lặng'}
                </p>
              </div>

              {/* Tiến độ đọc truyện */}
              <div className={`space-y-0.5 sm:space-y-1 pt-1 sm:pt-1.5 border-t ${c.bookCardBorder}`}>
                <div className="flex items-center justify-between text-[5.5px] xs:text-[6.5px] sm:text-[8px] font-mono text-slate-600">
                  <span>Tiến độ</span>
                  <span className="font-medium text-slate-900">{readingProgress}%</span>
                </div>
                <div className={`w-full h-1 rounded-full overflow-hidden ${c.progressTrackBg}`}>
                  <div
                    className={`h-full rounded-full ${c.progressBarBg} transition-all duration-300`}
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[5.5px] xs:text-[6.5px] sm:text-[8px] font-mono pt-0.5 text-slate-500">
                  <span className="truncate">12p trước</span>
                  <button
                    type="button"
                    onClick={() => {
                      playPaperTap();
                      if (onOpenReading) {
                        onOpenReading();
                      } else {
                        setReadingProgress((p) => (p >= 98 ? 15 : p + 7));
                      }
                    }}
                    className={`underline cursor-pointer ${c.readMoreBtnColor} font-semibold shrink-0`}
                  >
                    Đọc tiếp →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Câu trích dẫn & Tiêu đề phụ NIÊN THỜI */}
          <div>
            <p className="font-serif italic text-[6px] xs:text-[7px] sm:text-xs tracking-wider leading-relaxed text-slate-600 line-clamp-2">
              May the little things in life bring you the kind of happiness that stays.
            </p>
            <p className={`text-[5.5px] xs:text-[6.5px] sm:text-[9px] font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-0.5 sm:mt-1 ${c.nienthoiText} font-semibold truncate`}>
              N I Ê N &nbsp; T H Ờ I
            </p>
          </div>
        </div>

        {/* CỘT GIỮA (col-span-2): TRỤC ĐỐI XỨNG THREE / DAYS / BLOOM - NẰM TRÊN CÙNG 1 DÒNG */}
        <div className={`col-span-2 flex flex-col items-center justify-center gap-1 sm:gap-2 font-mono text-[6px] xs:text-[7px] sm:text-[10px] ${c.axisText}`}>
          <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${c.axisDotBg}`} />
          <div className={`w-[1px] h-5 xs:h-6 sm:h-8 ${c.axisLineBg}`} />
          <div className={`flex flex-col items-center gap-0.5 tracking-widest font-medium uppercase text-[5.5px] xs:text-[6.5px] sm:text-[9px] ${c.axisText} font-semibold`}>
            <span>THREE</span>
            <span>DAYS</span>
            <span>BLOOM</span>
          </div>
          <div className={`w-[1px] h-5 xs:h-6 sm:h-8 ${c.axisLineBg}`} />
          <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${c.axisDotBg}`} />
        </div>

        {/* CỘT PHẢI (col-span-5): QUẢ CẦU TUYẾT 3D MỚI HOÀN TOÀN + BẢNG THIÊN VĂN */}
        <div className="col-span-5 flex flex-col justify-center items-center overflow-visible relative min-w-0">
          
          {/* 6 Bông tuyết 6 cánh nhỏ vây quanh quả cầu y như trong ảnh */}
          <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-visible">
            <div className={`absolute top-1 left-2 sm:left-4 ${c.globeSnowflake1} -rotate-12`}><Snowflake6 className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5" /></div>
            <div className={`absolute top-0 right-3 sm:right-6 ${c.globeSnowflake2} rotate-15`}><Snowflake6 className="w-3 sm:w-4 h-3 sm:h-4" /></div>
            <div className={`absolute top-[42%] -left-2 sm:-left-3 ${c.globeSnowflake3} rotate-45`}><Snowflake6 className="w-2 sm:w-2.5 h-2 sm:h-2.5" /></div>
            <div className={`absolute top-[48%] -right-2 sm:-right-3 ${c.globeSnowflake1} -rotate-15`}><Snowflake6 className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5" /></div>
            <div className={`absolute bottom-10 left-3 sm:left-6 ${c.globeSnowflake1} rotate-30`}><Snowflake6 className="w-2.5 sm:w-3 h-2.5 sm:h-3" /></div>
            <div className={`absolute bottom-12 right-3 sm:right-6 ${c.globeSnowflake3} -rotate-30`}><Snowflake6 className="w-2 sm:w-2.5 h-2 sm:h-2.5" /></div>
          </div>

          {/* KHỐI QUẢ CẦU 3D MỚI THEO MÃ BẠN CUNG CẤP CÓ ANIMATION RUNG LẮC */}
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
            className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full cursor-pointer group my-1"
            title="Nhấn vào để lắc quả cầu tuyết!"
          >
            {/* Lớp hào quang phát sáng mờ ảo xung quanh quả cầu (Ethereal Glow) */}
            <div className={`absolute -inset-2 sm:-inset-4 rounded-full ${c.ambientOrbBg} blur-xl sm:blur-2xl pointer-events-none`} />

            {/* VỎ CẦU THỦY TINH 3D (3D SPHERE GLASS CONTAINER) */}
            <div
              className={`relative w-full h-full rounded-full overflow-hidden border-[1.5px] sm:border-[2.5px] border-white/60 ${c.globeShadow} backdrop-blur-md`}
              style={{
                background:
                  'radial-gradient(circle at 45% 30%, rgba(255,255,255,0.25) 0%, rgba(200,225,250,0.15) 35%, rgba(160,195,230,0.2) 70%, rgba(130,170,210,0.35) 100%)',
              }}
            >
              {/* Lớp 1: Bầu trời mùa đông êm dịu */}
              <div className={`absolute inset-0 bg-gradient-to-b ${c.globeSkyGradient}`} />

              {/* Lớp 2: NHỮNG NGỌN ĐỒI TUYẾT THOẢI LƯỢN SÓNG (KHÔNG VIỀN, MẢNG CHUYỂN SẮC TRẮNG VÀ XÁM XANH NHẠT) */}
              <svg
                viewBox="0 0 300 220"
                className="absolute top-1 sm:top-2 md:top-4 left-0 right-0 w-full h-[76%] pointer-events-none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id={`farRollingHillGrad-${c.themeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="35%" stopColor={c.hillColor1} stopOpacity="0.9" />
                    <stop offset="70%" stopColor={c.hillColor3} stopOpacity="0.82" />
                    <stop offset="100%" stopColor={c.hillShadow} stopOpacity="0.75" />
                  </linearGradient>

                  <linearGradient id={`midRollingHillGrad-${c.themeId}`} x1="0%" y1="0%" x2="100%" y2="80%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                    <stop offset="40%" stopColor={c.hillColor2} stopOpacity="0.92" />
                    <stop offset="75%" stopColor={c.hillColor1} stopOpacity="0.88" />
                    <stop offset="100%" stopColor={c.hillShadow} stopOpacity="0.8" />
                  </linearGradient>

                  <linearGradient id={`snowValleyShadow-${c.themeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={c.hillShadow} stopOpacity="0.65" />
                    <stop offset="50%" stopColor={c.hillColor1} stopOpacity="0.75" />
                    <stop offset="100%" stopColor={c.hillColor2} stopOpacity="0.85" />
                  </linearGradient>

                  <linearGradient id={`pureSnowWaveGrad-${c.themeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                    <stop offset="60%" stopColor="#f3f8fc" stopOpacity="0.95" />
                    <stop offset="100%" stopColor={c.hillColor1} stopOpacity="0.88" />
                  </linearGradient>
                </defs>

                {/* Đồi xa */}
                <path
                  d="M 0 105 C 55 70, 115 65, 175 90 C 230 112, 265 80, 300 95 L 300 220 L 0 220 Z"
                  fill={`url(#farRollingHillGrad-${c.themeId})`}
                />
                {/* Sườn đổ bóng thung lũng */}
                <path
                  d="M 0 125 C 45 105, 95 110, 145 128 C 190 145, 240 135, 300 150 L 300 220 L 0 220 Z"
                  fill={`url(#snowValleyShadow-${c.themeId})`}
                />
                {/* Đồi giữa */}
                <path
                  d="M 300 88 C 245 82, 195 108, 130 118 C 75 126, 30 142, 0 152 L 0 220 L 300 220 Z"
                  fill={`url(#midRollingHillGrad-${c.themeId})`}
                />
                {/* Mảng tuyết sáng đón nắng */}
                <path
                  d="M 300 88 C 255 86, 205 105, 150 115 C 215 132, 265 124, 300 116 Z"
                  fill="#ffffff"
                  opacity="0.65"
                />
                {/* Triền đồi dưới */}
                <path
                  d="M 0 140 C 65 122, 125 126, 185 142 C 235 156, 270 146, 300 152 L 300 220 L 0 220 Z"
                  fill={`url(#pureSnowWaveGrad-${c.themeId})`}
                />
                {/* Mảng tuyết thoải trên cầu */}
                <path
                  d="M 0 158 C 75 145, 150 160, 220 148 C 265 140, 285 145, 300 150 L 300 220 L 0 220 Z"
                  fill="#ffffff"
                  opacity="0.9"
                />
              </svg>

              {/* Lớp 3: MẶT ĐẤT BÊN DƯỚI LÀ NỀN TUYẾT TRẮNG NHẤP NHÔ (UNDULATING SNOWBANKS) */}
              <svg
                viewBox="0 0 300 150"
                className="absolute bottom-0 left-0 right-0 w-full h-[52%] pointer-events-none z-0"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id={`groundSnowFarGrad-${c.themeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="40%" stopColor={c.hillColor2} stopOpacity="0.92" />
                    <stop offset="100%" stopColor={c.hillColor1} stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id={`groundSnowMidGrad-${c.themeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                    <stop offset="50%" stopColor="#edf5fc" stopOpacity="0.95" />
                    <stop offset="100%" stopColor={c.hillColor2} stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                <path
                  d="M 0 42 C 55 30, 115 50, 170 36 C 225 24, 265 40, 300 32 L 300 150 L 0 150 Z"
                  fill={`url(#groundSnowFarGrad-${c.themeId})`}
                />
                <path
                  d="M 0 65 C 60 50, 120 72, 180 56 C 235 44, 275 60, 300 52 L 300 150 L 0 150 Z"
                  fill={`url(#groundSnowMidGrad-${c.themeId})`}
                />
                <path
                  d="M 105 62 C 145 74, 195 58, 235 65 L 235 150 L 105 150 Z"
                  fill={c.hillColor1}
                  opacity="0.35"
                />
                <path
                  d="M 0 86 C 45 72, 95 88, 150 78 C 205 70, 255 86, 300 76 L 300 150 L 0 150 Z"
                  fill="#ffffff"
                  opacity="0.95"
                />
                <path
                  d="M 0 112 C 65 102, 135 116, 215 106 C 265 100, 288 108, 300 104 L 300 150 L 0 150 Z"
                  fill="#ffffff"
                />
              </svg>

              {/* Lớp 4: CÂY CẦU CẠN ĐƯỜNG SẮT VỚI CÁC TRỤ CẦU CÁCH ĐỀU NHAU (VIADUCT WITH EQUAL PIER SPACING) */}
              <div className="absolute top-[49%] sm:top-[51%] left-0 right-0 flex flex-col items-center pointer-events-none z-10">
                <div className="w-full relative">
                  {/* ĐOÀN TÀU LƯỚT TRÊN CẦU */}
                  <MovingSnowTrain isGlobeShaking={isGlobeShaking} />

                  {/* SVG CÂY CẦU CẠN VÀ 4 CỘT TRỤ CÁCH ĐỀU 75px */}
                  <svg
                    viewBox="0 0 300 90"
                    className="w-full h-14 sm:h-20 md:h-26 overflow-visible pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={`viaductPierGrad-${c.themeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="65%" stopColor={c.bridgePierFill} />
                        <stop offset="100%" stopColor={c.bridgePierShadow} />
                      </linearGradient>
                      <linearGradient id={`viaductDeckGrad-${c.themeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="50%" stopColor="#eff6fb" />
                        <stop offset="100%" stopColor={c.bridgePierShadow} />
                      </linearGradient>
                    </defs>

                    {/* 4 CỘT TRỤ CẦU CẠN: TÂM CÁCH NHAU ĐỀU ĐẶN ĐÚNG 75px */}
                    {[
                      { id: 1, left: 31 },
                      { id: 2, left: 106 },
                      { id: 3, left: 181 },
                      { id: 4, left: 256 },
                    ].map((pier) => (
                      <g key={pier.id}>
                        {/* Mũ đầu trụ */}
                        <rect
                          x={pier.left - 2}
                          y="11"
                          width="18"
                          height="3"
                          rx="0.5"
                          fill="#ffffff"
                          stroke={c.bridgePierStroke}
                          strokeWidth="0.5"
                        />
                        {/* Thân trụ */}
                        <rect
                          x={pier.left}
                          y="14"
                          width="14"
                          height="66"
                          fill={`url(#viaductPierGrad-${c.themeId})`}
                          stroke={c.bridgePierStroke}
                          strokeWidth="0.6"
                        />
                        {/* Đổ bóng 3D cạnh phải */}
                        <rect
                          x={pier.left + 10}
                          y="14"
                          width="4"
                          height="66"
                          fill={c.bridgePierShadow}
                          opacity="0.6"
                        />
                        {/* Gờ chỉ ngang trang trí */}
                        <line x1={pier.left} y1="28" x2={pier.left + 14} y2="28" stroke={c.bridgePierStroke} strokeWidth="0.8" />
                        <line x1={pier.left} y1="46" x2={pier.left + 14} y2="46" stroke={c.bridgePierStroke} strokeWidth="0.8" />
                        <line x1={pier.left} y1="64" x2={pier.left + 14} y2="64" stroke={c.bridgePierStroke} strokeWidth="0.8" />
                      </g>
                    ))}

                    {/* MẶT ĐƯỜNG RAY VÀ VẠCH SÁNG */}
                    <rect x="0" y="0" width="300" height="3" fill="#ffffff" stroke={c.bridgePierStroke} strokeWidth="0.5" />
                    <line x1="0" y1="0.5" x2="300" y2="0.5" stroke="#ffffff" strokeWidth="1" />

                    {/* DẦM TRÊN */}
                    <rect x="0" y="3" width="300" height="2.5" fill={`url(#viaductDeckGrad-${c.themeId})`} stroke={c.bridgePierStroke} strokeWidth="0.4" />

                    {/* GIÀN THÉP MẮT CÁO CHỮ X XUYÊN SUỐT CẦU */}
                    <g stroke="#ffffff" strokeWidth="1" opacity="0.95">
                      {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285].map((bx) => (
                        <g key={bx}>
                          <line x1={bx} y1="5.5" x2={bx + 15} y2="12" stroke={c.bridgeRailStroke} strokeWidth="0.8" />
                          <line x1={bx} y1="5.5" x2={bx + 15} y2="12" stroke="#ffffff" strokeWidth="0.9" />
                          <line x1={bx + 15} y1="5.5" x2={bx} y2="12" stroke={c.bridgeRailStroke} strokeWidth="0.9" />
                        </g>
                      ))}
                      <line x1="300" y1="5.5" x2="300" y2="12" stroke={c.bridgeRailStroke} strokeWidth="0.8" />
                    </g>

                    {/* DẦM DƯỚI */}
                    <rect x="0" y="11.5" width="300" height="2.5" fill={`url(#viaductDeckGrad-${c.themeId})`} stroke={c.bridgePierStroke} strokeWidth="0.5" />
                  </svg>
                </div>
              </div>

              {/* Lớp 5: CÁC CỤM CÂY THÔNG TUYẾT XANH BĂNG GIÁ (TIỀN CẢNH z-15) */}
              {/* Cụm thông 1: Nhịp trái */}
              <div className="absolute bottom-3 sm:bottom-5 md:bottom-7 left-[18%] sm:left-[21%] flex items-end -space-x-1 sm:-space-x-1.5 pointer-events-none z-15">
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[3.5px] sm:border-l-[5px] border-r-[3.5px] sm:border-r-[5px] border-b-[7px] sm:border-b-[10px] border-l-transparent border-r-transparent" style={{ borderBottomColor: c.pineColor1 }} />
                  <div className="w-0 h-0 border-l-[5px] sm:border-l-[7px] border-r-[5px] sm:border-r-[7px] border-b-[8px] sm:border-b-[12px] border-l-transparent border-r-transparent -mt-0.5 sm:-mt-1" style={{ borderBottomColor: c.pineColor2 }} />
                  <div className="w-0 h-0 border-l-[6.5px] sm:border-l-[9px] border-r-[6.5px] sm:border-r-[9px] border-b-[10px] sm:border-b-[14px] border-l-transparent border-r-transparent -mt-0.5 sm:-mt-1 shadow-sm" style={{ borderBottomColor: c.pineColor3 }} />
                  <div className="w-1 sm:w-1.5 h-1.5 sm:h-2.5 bg-white" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[5px] sm:border-l-[7px] border-r-[5px] sm:border-r-[7px] border-b-[9px] sm:border-b-[14px] border-l-transparent border-r-transparent" style={{ borderBottomColor: c.pineColor1 }} />
                  <div className="w-0 h-0 border-l-[7px] sm:border-l-[10px] border-r-[7px] sm:border-r-[10px] border-b-[12px] sm:border-b-[18px] border-l-transparent border-r-transparent -mt-1 sm:-mt-1.5" style={{ borderBottomColor: c.pineColor2 }} />
                  <div className="w-0 h-0 border-l-[8.5px] sm:border-l-[12px] border-r-[8.5px] sm:border-r-[12px] border-b-[14px] sm:border-b-[20px] border-l-transparent border-r-transparent -mt-1 sm:-mt-1.5 shadow-sm" style={{ borderBottomColor: c.pineColor3 }} />
                  <div className="w-1.5 sm:w-2 h-2.5 sm:h-4 bg-white" />
                </div>
              </div>

              {/* Cụm thông 2: Nhịp giữa */}
              <div className="absolute bottom-2 sm:bottom-3 md:bottom-5 left-[44%] sm:left-[47%] flex items-end -space-x-1 sm:-space-x-1.5 pointer-events-none z-15">
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-r-[4px] sm:border-r-[6px] border-b-[8px] sm:border-b-[11px] border-l-transparent border-r-transparent" style={{ borderBottomColor: c.pineColor1 }} />
                  <div className="w-0 h-0 border-l-[5.5px] sm:border-l-[8px] border-r-[5.5px] sm:border-r-[8px] border-b-[9px] sm:border-b-[13px] border-l-transparent border-r-transparent -mt-0.5 sm:-mt-1" style={{ borderBottomColor: c.pineColor2 }} />
                  <div className="w-0 h-0 border-l-[7px] sm:border-l-[10px] border-r-[7px] sm:border-r-[10px] border-b-[11px] sm:border-b-[15px] border-l-transparent border-r-transparent -mt-0.5 sm:-mt-1 shadow-sm" style={{ borderBottomColor: c.pineColor3 }} />
                  <div className="w-1 sm:w-1.5 h-1.5 sm:h-2.5 bg-white" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[5px] sm:border-l-[7px] border-r-[5px] sm:border-r-[7px] border-b-[9px] sm:border-b-[13px] border-l-transparent border-r-transparent" style={{ borderBottomColor: c.pineColor1 }} />
                  <div className="w-0 h-0 border-l-[6.5px] sm:border-l-[9px] border-r-[6.5px] sm:border-r-[9px] border-b-[11px] sm:border-b-[16px] border-l-transparent border-r-transparent -mt-0.5 sm:-mt-1" style={{ borderBottomColor: c.pineColor2 }} />
                  <div className="w-0 h-0 border-l-[8px] sm:border-l-[11px] border-r-[8px] sm:border-r-[11px] border-b-[12.5px] sm:border-b-[18px] border-l-transparent border-r-transparent -mt-0.5 sm:-mt-1 shadow-sm" style={{ borderBottomColor: c.pineColor3 }} />
                  <div className="w-1 sm:w-1.5 h-2 sm:h-3 bg-white" />
                </div>
              </div>

              {/* Cụm thông 3: Nhịp phải */}
              <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-[68%] sm:left-[72%] flex items-end -space-x-1 pointer-events-none z-15">
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-r-[4px] sm:border-r-[6px] border-b-[8px] sm:border-b-[12px] border-l-transparent border-r-transparent" style={{ borderBottomColor: c.pineColor1 }} />
                  <div className="w-0 h-0 border-l-[6px] sm:border-l-[9px] border-r-[6px] sm:border-r-[9px] border-b-[10px] sm:border-b-[15px] border-l-transparent border-r-transparent -mt-0.5 sm:-mt-1" style={{ borderBottomColor: c.pineColor2 }} />
                  <div className="w-0 h-0 border-l-[7.5px] sm:border-l-[11px] border-r-[7.5px] sm:border-r-[11px] border-b-[12px] sm:border-b-[18px] border-l-transparent border-r-transparent -mt-0.5 sm:-mt-1 shadow-sm" style={{ borderBottomColor: c.pineColor3 }} />
                  <div className="w-1 sm:w-1.5 h-2 sm:h-3 bg-white" />
                </div>
              </div>

              {/* Lớp 6: CÁC BÔNG TUYẾT BAY LƠ LỬNG BÊN TRONG CẦU (42 FLAKES) */}
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

              {/* Lớp 7: VỆT SÁNG PHẢN QUANG CỦA VỎ THỦY TINH */}
              <div
                className="absolute top-2 sm:top-3 left-4 sm:left-6 w-16 sm:w-28 md:w-36 h-8 sm:h-14 md:h-18 rounded-[50%] bg-gradient-to-b from-white/95 to-transparent pointer-events-none transform -rotate-35 blur-[0.8px]"
                style={{ opacity: 0.9 }}
              />
              <div className="absolute top-4 sm:top-6 left-8 sm:left-12 w-10 sm:w-16 md:w-20 h-5 sm:h-8 md:h-10 rounded-[50%] bg-white/70 pointer-events-none transform -rotate-30 blur-[1px]" />
              <div className="absolute bottom-1 sm:bottom-2 left-6 sm:left-10 right-6 sm:right-10 h-3 sm:h-6 rounded-[50%] bg-gradient-to-t from-white/80 to-transparent pointer-events-none blur-[1px]" />
            </div>
          </motion.div>

          {/* Lớp 8: ĐẾ HOA TUYẾT NÂNG ĐỠ NẰM PHÍA DƯỚI ĐÁY QUẢ CẦU */}
          <div className="-mt-6 xs:-mt-8 sm:-mt-12 md:-mt-14 relative z-0 flex justify-center w-full max-w-[200px] xs:max-w-[240px] sm:max-w-[400px]">
            <SnowflakePedestal
              gradId={`pedestalGrad-${c.themeId}`}
              accentColor={c.globePedestalAccent}
            />
          </div>

          {/* BẢNG THÔNG SỐ THIÊN VĂN BÊN DƯỚI (DATE / TIME / SEASON) */}
          <div className={`w-full mt-1 sm:mt-2 space-y-0.5 sm:space-y-1 font-mono text-[6px] xs:text-[7.5px] sm:text-xs border-t ${c.astroBorder} pt-1 sm:pt-2`}>
            <div className="flex items-center justify-between text-slate-800">
              <span className={`flex items-center gap-0.5 sm:gap-1 ${c.astroLabel}`}>
                <CalendarIcon className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                <span>DATE</span>
              </span>
              <span className="font-medium truncate">Oct 25, 2026</span>
            </div>

            <div className="flex items-center justify-between text-slate-800">
              <span className={`flex items-center gap-0.5 sm:gap-1 ${c.astroLabel}`}>
                <Clock className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                <span>TIME</span>
              </span>
              <span className={`font-bold ${c.astroTime} tabular-nums truncate`}>
                {timeStr}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-800">
              <span className={c.astroLabel}>SEASON</span>
              <span className="font-medium text-slate-600 truncate">{getSeasonDisplay()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          G. THANH PHÁT ÂM THANH Ở ĐÁY: NÚT PLAY TRÒN XANH + TIẾN TRÌNH + 1X
          ----------------------------------------------------------------- */}
      <div className={`relative z-10 mt-3 sm:mt-6 pt-2 flex items-center justify-between gap-2 sm:gap-4 border-t ${c.audioDivider}`}>
        {/* Nút Play tròn đặc trưng */}
        <button
          type="button"
          onClick={() => {
            playChime(isPlayingAudio ? 440 : 880);
            setIsPlayingAudio(!isPlayingAudio);
          }}
          className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full ${c.audioPlayBtnBg} ${c.audioPlayBtnHoverBg} text-white ${c.audioPlayBtnShadow} shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0`}
        >
          {isPlayingAudio ? (
            <Pause className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
          ) : (
            <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Dải tiến trình phát nhạc */}
        <div className="flex-1 flex flex-col gap-0.5 sm:gap-1 min-w-0">
          <div className="flex justify-between text-[6.5px] xs:text-[7.5px] sm:text-[10px] font-mono text-slate-500">
            <span>01:42</span>
            <span className="truncate mx-1">WHITE LILY // NOCTURNE</span>
            <span>03:00</span>
          </div>
          <div className={`w-full h-1 rounded-full overflow-hidden ${c.audioProgressTrackBg}`}>
            <div
              className={`h-full rounded-full ${c.audioProgressBarBg} ${isPlayingAudio ? 'animate-pulse w-3/5' : 'w-2/5'}`}
            />
          </div>
        </div>

        {/* Hộp nút tốc độ phát 1x */}
        <div className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded border ${c.audioSpeedBorder} bg-white text-slate-700 text-[8px] sm:text-xs font-mono shrink-0 shadow-2xs`}>
          1x
        </div>
      </div>
    </div>
  );
};

export const ScreenshotExactRecreation: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f0f6fc] text-slate-800 p-2 sm:p-6 md:p-12 flex items-center justify-center font-sans antialiased selection:bg-sky-200">
      <EntireWhiteLilyAzureWidget themeId="slate-haze" />
    </div>
  );
};

export default EntireWhiteLilyAzureWidget;
