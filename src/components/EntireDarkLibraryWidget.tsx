import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Play, Pause } from 'lucide-react';
import { Novel } from '../types';
import { MetallicPaperClip } from './MetallicPaperClip';

// =========================================================================
// 1. CÁC HỌA TIẾT VI HÌNH HỌC (MICRO-DECORATION GLYPHS)
// =========================================================================

/** Ngôi sao 4 cánh (4-pointed Star) phát quang */
export const MicroStar4: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-2.5 h-2.5',
  style,
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} style={style} aria-hidden="true">
    <path d="M12 2 Q12 12 22 12 Q12 12 12 22 Q12 12 12 2 12 Q12 12 2 Z" />
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

// =========================================================================
// 2. BỘ TẠO ÂM THANH XÚC GIÁC WEB AUDIO SYNTHESIZER
// =========================================================================
const playTap = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {}
};

const playChime = (freq = 523.25) => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } catch {}
};

// =========================================================================
// 3. RADAR THIÊN VĂN MẶT TRĂNG KIM CƯƠNG 60FPS (CELESTIAL DIAMOND MOON CANVAS)
// =========================================================================
export const CelestialDiamondMoonCanvas: React.FC<{
  className?: string;
  particleColor?: string;
  ringColor?: string;
}> = ({ className = '', particleColor = 'rgba(255, 255, 255, 1)', ringColor = 'rgba(255, 255, 255, 0.45)' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 160 hạt sao kim cương lấp lánh bên trong vầng trăng
  const moonParticles = useMemo(() => {
    return Array.from({ length: 160 }).map((_, i) => ({
      r: Math.sqrt(Math.random()) * 48,
      angle: Math.random() * Math.PI * 2,
      baseAlpha: Math.random() * 0.6 + 0.35,
      isOcta: i % 10 === 0,
      twinkleSpeed: Math.random() * 0.04 + 0.02,
      twinklePhase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // Các ngôi sao tròn nhỏ và sao 4 cánh nhấp nháy quanh thiên thể
  const surroundingStars = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      r: 65 + Math.random() * 70,
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() - 0.5) * 0.003,
      size: Math.random() * 1.6 + 1.0,
      isStar4: i % 3 === 0,
      blinkSpeed: Math.random() * 0.05 + 0.025,
      blinkPhase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const size = 520; // Tăng kích thước canvas để hoàn toàn chống cắt xén
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    let animId: number;
    let tick = 0;
    let gearAngleInner = 0;
    let gearAngleMid = 0;

    // Hạt mưa rơi với tốc độ hơi chậm lại một chút
    const raindrops = Array.from({ length: 4 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 240,
      y: -180 + (i * 320) / 4,
      speedY: Math.random() * 0.8 + 2.0, // Chậm lại một chút theo yêu cầu
      length: Math.random() * 20 + 35,
      alpha: Math.random() * 0.3 + 0.4,
    }));

    // Gợn sóng hoa sen dưới chân trăng
    let ripples: Array<{ x: number; y: number; rx: number; maxRx: number; alpha: number }> = [];

    const render = () => {
      tick++;
      gearAngleInner += 0.0022; // Bánh răng trong quay thuận chiều
      gearAngleMid -= 0.0012;   // Bánh răng giữa quay ngược chiều

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.translate(size / 2, size / 2);

      // --- A. HẠT MƯA RƠI & GỢN SÓNG HOA SEN DƯỚI ĐÁY ---
      raindrops.forEach((drop) => {
        drop.y += drop.speedY;
        const rainGrad = ctx.createLinearGradient(drop.x, drop.y - drop.length, drop.x, drop.y);
        rainGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        rainGrad.addColorStop(1, `rgba(255, 255, 255, ${drop.alpha})`);

        ctx.strokeStyle = rainGrad;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y - drop.length);
        ctx.lineTo(drop.x, drop.y);
        ctx.stroke();

        if (drop.y > 120) {
          ripples.push({ x: drop.x, y: 110, rx: 4, maxRx: 60, alpha: drop.alpha });
          drop.y = -180 - Math.random() * 30;
          drop.x = (Math.random() - 0.5) * 240;
        }
      });

      // Vẽ gợn sóng elip dưới chân trăng
      ripples = ripples.filter((rip) => {
        rip.rx += 0.7;
        const curA = rip.alpha * (1 - rip.rx / rip.maxRx);
        if (curA > 0.02 && rip.rx < rip.maxRx) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${curA * 0.8})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.ellipse(rip.x, rip.y, rip.rx, rip.rx * 0.25, 0, 0, Math.PI * 2);
          ctx.stroke();
          return true;
        }
        return false;
      });

      // --- B. VÀNH ĐAI ELIP NGHIÊNG & DÒNG CHẢY HẠT BỤI SAO ---
      const tilt = -0.34;
      ctx.save();
      ctx.rotate(tilt);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 0.9;
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = -tick * 0.6;
      ctx.beginPath();
      ctx.ellipse(0, 0, 175, 95, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 20 hạt bụi sao chuyển động tuần hoàn dọc theo vành đai
      const stardustCount = 20;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      for (let k = 0; k < stardustCount; k++) {
        const orbitRx = 175;
        const orbitRy = 95;
        const orbitSpeed = 0.0032;
        const pAngle = k * ((Math.PI * 2) / stardustCount) + tick * orbitSpeed;

        const ex = orbitRx * Math.cos(pAngle);
        const ey = orbitRy * Math.sin(pAngle);
        const px = ex * cosT - ey * sinT;
        const py = ex * sinT + ey * cosT;

        const alpha = 0.45 + 0.4 * Math.sin(tick * 0.04 + k);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, k % 3 === 0 ? 1.6 : 1.1, 0, Math.PI * 2);
        ctx.fill();

        if (k % 4 === 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(px - 3.5, py); ctx.lineTo(px + 3.5, py);
          ctx.moveTo(px, py - 3.5); ctx.lineTo(px, py + 3.5);
          ctx.stroke();
        }
      }

      // --- C. HỆ THỐNG BÁNH RĂNG THIÊN VĂN ĐỐI XỨNG ---
      // 1. Vòng trong nét đứt (quay thuận chiều)
      ctx.save();
      ctx.rotate(gearAngleInner);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, 68, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 2. Vòng giữa với 4 ngôi sao 4 phương chính (quay ngược chiều)
      ctx.save();
      ctx.rotate(gearAngleMid);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(0, 0, 86, 0, Math.PI * 2);
      ctx.stroke();

      for (let j = 0; j < 4; j++) {
        const ca = (j * Math.PI) / 2;
        const cxp = 86 * Math.cos(ca);
        const cyp = 86 * Math.sin(ca);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cxp, cyp, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.moveTo(cxp - 6, cyp); ctx.lineTo(cxp + 6, cyp);
        ctx.moveTo(cxp, cyp - 6); ctx.lineTo(cxp, cyp + 6);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Vòng ngoài cố định với 48 vạch chia độ chữ T (-|-)
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(0, 0, 104, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 48; i++) {
        const a = (i * Math.PI * 2) / 48;
        const isMajor = i % 4 === 0;
        const r1 = isMajor ? 96 : 99;
        const r2 = isMajor ? 112 : 109;
        ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = isMajor ? 1 : 0.7;
        ctx.beginPath();
        ctx.moveTo(r1 * Math.cos(a), r1 * Math.sin(a));
        ctx.lineTo(r2 * Math.cos(a), r2 * Math.sin(a));
        ctx.stroke();
      }

      // --- D. CÁC NGÔI SAO TRÒN NHỎ & SAO 4 CÁNH NHẤP NHÁY QUANH THIÊN THỂ ---
      surroundingStars.forEach((star) => {
        star.angle += star.speed;
        const sx = star.r * Math.cos(star.angle);
        const sy = star.r * Math.sin(star.angle);
        const alpha = 0.35 + 0.55 * Math.sin(tick * star.blinkSpeed + star.blinkPhase);

        if (star.isStar4) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(sx - 5.5, sy); ctx.lineTo(sx + 5.5, sy);
          ctx.moveTo(sx, sy - 5.5); ctx.lineTo(sx, sy + 5.5);
          ctx.stroke();

          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // --- E. VẦNG TRĂNG KIM CƯƠNG LƯỠI LIỀM PHÁT SÁNG Ở TÂM ---
      const cx1 = 9;
      const r1 = 44;
      const cx2 = 22;
      const r2 = 39;
      const cuspX = 31;
      const cuspYTop = -37;
      const cuspYBottom = 37;

      ctx.save();
      // Quầng sáng trắng tỏa ra từ mặt trăng
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 20;

      // Đường bao lưỡi liềm toán học chuẩn xác
      ctx.beginPath();
      const angleTopOuter = Math.atan2(cuspYTop, cuspX - cx1);
      const angleBottomOuter = Math.atan2(cuspYBottom, cuspX - cx1);
      ctx.arc(cx1, 0, r1, angleTopOuter, angleBottomOuter, true);

      const angleBottomInner = Math.atan2(cuspYBottom, cuspX - cx2);
      const angleTopInner = Math.atan2(cuspYTop, cuspX - cx2);
      ctx.arc(cx2, 0, r2, angleBottomInner, angleTopInner, false);
      ctx.closePath();

      // Đổ màu thân trăng trắng tuyết sáng chói
      const moonGrad = ctx.createLinearGradient(-35, -40, 35, 40);
      moonGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      moonGrad.addColorStop(0.5, 'rgba(245, 248, 255, 0.96)');
      moonGrad.addColorStop(1, 'rgba(255, 255, 255, 0.98)');
      ctx.fillStyle = moonGrad;
      ctx.fill();

      // Cắt mặt nạ clip để hạt sao kim cương nằm trọn vẹn trong trăng
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.clip();

      // Vệt sáng quét khúc xạ lấp lánh (Diamond Shimmer Sweep)
      const shimmerPhase = (Math.sin(tick * 0.02) + 1) / 2;
      const shimmerX = -45 + shimmerPhase * 90;
      const shimmerGrad = ctx.createLinearGradient(shimmerX - 20, -45, shimmerX + 20, 45);
      shimmerGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shimmerGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
      shimmerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shimmerGrad;
      ctx.fillRect(-50, -50, 100, 100);

      // Các hạt sao kim cương lấp lánh bên trong vầng trăng
      moonParticles.forEach((p) => {
        const alpha = p.baseAlpha + 0.25 * Math.sin(tick * p.twinkleSpeed + p.twinklePhase);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.r * Math.cos(p.angle), p.r * Math.sin(p.angle), 1, 0, Math.PI * 2);
        ctx.fill();

        if (p.isOcta) {
          const px = p.r * Math.cos(p.angle);
          const py = p.r * Math.sin(p.angle);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(px - 4, py); ctx.lineTo(px + 4, py);
          ctx.moveTo(px, py - 4); ctx.lineTo(px, py + 4);
          ctx.stroke();
        }
      });

      ctx.restore();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [moonParticles, surroundingStars, ringColor]);

  return <canvas ref={canvasRef} className={`select-none pointer-events-none w-36 h-36 xs:w-42 xs:h-42 sm:w-52 sm:h-52 md:w-64 md:h-64 ${className}`} />;
};

// =========================================================================
// 4. BỘ DỮ LIỆU 31 BÀI THƠ KINH ĐIỂN CHO 31 NGÀY (POETRY LIST)
// =========================================================================
import { poetList, getSeasonDisplay, getSeasonName, PoetItem } from '../utils/libraryPoetry';
export { poetList, getSeasonDisplay, getSeasonName, type PoetItem };

// =========================================================================
// 5. CẤU HÌNH MÀU SẮC CHẾ ĐỘ TỐI CHO CẢ 5 THEME
// Theme frost giữ nguyên như code cung cấp, các theme khác đổi màu đồng bộ
// =========================================================================
export interface DarkWidgetThemeConfig {
  themeId: string;
  auroraOrb1: string;
  auroraOrb2: string;
  auroraOrb3: string;
  cardBorder: string;
  cardBg: string;
  cardShadow: string;
  innerGlowOrb1: string;
  innerGlowOrb2: string;
  glyphColor: string;
  barcodeColor: string;
  miniWidgetTitle: string;
  followText: string;
  borderDivider: string;
  calContainerBorder: string;
  calContainerBg: string;
  calHeaderTitle: string;
  calCardBorder: string;
  calCardBg: string;
  ringBorder: string;
  ringGradient: string;
  calSelectedDayBg: string;
  calSelectedDayText: string;
  calSelectedDayShadow: string;
  calDayHoverText: string;
  calDayHoverBg: string;
  memoTextColor: string;
  poetContainerBorder: string;
  poetContainerBg: string;
  poetHeaderColor: string;
  poetTextColor: string;
  poetAuthorColor: string;
  poetActiveDot: string;
  poetNextBtnBorder: string;
  poetNextBtnBg: string;
  poetNextBtnHoverBg: string;
  poetNextBtnText: string;
  anthesisSubtitle: string;
  libraryTitleColor: string;
  libraryGlow: string;
  starColor: string;
  bookCardBorder: string;
  bookCardBg: string;
  bookCardShadow: string;
  washiTapeBg: string;
  washiTapeShadow: string;
  gridLineColor: string;
  bookTagColor: string;
  bookTitleColor: string;
  bookSubtitleColor: string;
  progressTrackBg: string;
  progressBarBg: string;
  readMoreBtnColor: string;
  quoteColor: string;
  nienthoiText: string;
  axisDotBg: string;
  axisLineBg: string;
  axisText: string;
  canvasRingColor: string;
  canvasParticleColor: string;
  astroBorder: string;
  astroLabel: string;
  astroTime: string;
  astroTimeGlow: string;
  audioDivider: string;
  audioPlayBtnBg: string;
  audioPlayBtnHoverBg: string;
  audioPlayBtnBorder: string;
  audioProgressTrackBg: string;
  audioProgressBarBg: string;
  audioSpeedBorder: string;
  audioSpeedBg: string;
  isWhiteCard?: boolean;
  linedPaperColor?: string;
}

export const getDarkThemeConfig = (themeId: string = 'slate-haze'): DarkWidgetThemeConfig => {
  switch (themeId) {
    case 'amethyst-haze':
      return {
        themeId,
        auroraOrb1: 'from-purple-900/20 via-fuchsia-950/15 to-transparent',
        auroraOrb2: 'from-indigo-950/25 via-purple-950/15 to-transparent',
        auroraOrb3: 'bg-purple-900/15',
        innerGlowOrb1: 'bg-purple-500/15',
        innerGlowOrb2: 'bg-fuchsia-500/10',
        canvasRingColor: 'rgba(216, 180, 254, 0.5)',
        cardBorder: 'border-white/15',
        cardBg: 'bg-stone-950/65',
        cardShadow: 'shadow-[0_30px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(255,255,255,0.12)]',
        glyphColor: 'text-stone-400',
        barcodeColor: 'bg-white',
        miniWidgetTitle: 'text-stone-300',
        followText: 'text-stone-500',
        borderDivider: 'border-white/10',
        calContainerBorder: 'border-white/10',
        calContainerBg: 'bg-white/[0.03]',
        calHeaderTitle: 'text-stone-300',
        calCardBorder: 'border-white/15',
        calCardBg: 'bg-white/[0.04]',
        ringBorder: 'border-stone-300/80',
        ringGradient: 'from-stone-100 via-stone-300 to-stone-500',
        calSelectedDayBg: 'bg-white',
        calSelectedDayText: 'text-black',
        calSelectedDayShadow: 'shadow-[0_0_14px_rgba(255,255,255,0.9)]',
        calDayHoverText: 'hover:text-white',
        calDayHoverBg: 'hover:bg-white/10',
        memoTextColor: 'text-stone-400',
        poetContainerBorder: 'border-white/15',
        poetContainerBg: 'bg-white/[0.03]',
        poetHeaderColor: 'text-stone-300',
        poetTextColor: 'text-stone-200',
        poetAuthorColor: 'text-stone-400',
        poetActiveDot: 'bg-white shadow-[0_0_6px_white]',
        poetNextBtnBorder: 'border-white/20',
        poetNextBtnBg: 'bg-white/10',
        poetNextBtnHoverBg: 'hover:bg-white/20',
        poetNextBtnText: 'text-stone-100',
        anthesisSubtitle: 'text-stone-300',
        libraryTitleColor: 'text-white',
        libraryGlow: 'drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]',
        starColor: 'text-stone-300',
        bookCardBorder: 'border-white/15',
        bookCardBg: 'bg-white/[0.04]',
        bookCardShadow: 'shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.1)]',
        washiTapeBg: 'rgba(255, 255, 255, 0.15)',
        washiTapeShadow: '0 1px 4px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.25)',
        gridLineColor: 'rgba(255, 255, 255, 0.3)',
        bookTagColor: 'text-stone-300',
        bookTitleColor: 'text-white',
        bookSubtitleColor: 'text-stone-400',
        progressTrackBg: 'bg-white/10',
        progressBarBg: 'bg-white',
        readMoreBtnColor: 'text-stone-300 hover:text-white',
        quoteColor: 'text-stone-300',
        nienthoiText: 'text-stone-400',
        axisDotBg: 'bg-white/70',
        axisLineBg: 'bg-white/20',
        axisText: 'text-stone-300',
        canvasParticleColor: '#ffffff',
        astroBorder: 'border-white/10',
        astroLabel: 'text-stone-400',
        astroTime: 'text-white',
        astroTimeGlow: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]',
        audioDivider: 'border-white/10',
        audioPlayBtnBg: 'bg-white/10',
        audioPlayBtnHoverBg: 'hover:bg-white/20',
        audioPlayBtnBorder: 'border-white/25',
        audioProgressTrackBg: 'bg-white/10',
        audioProgressBarBg: 'bg-white',
        audioSpeedBorder: 'border-white/20',
        audioSpeedBg: 'bg-white/[0.06]',
        isWhiteCard: false,
        linedPaperColor: 'rgba(255, 255, 255, 0.08)',
      };

    case 'sage':
      return {
        themeId,
        auroraOrb1: 'from-emerald-950/20 via-teal-950/15 to-transparent',
        auroraOrb2: 'from-teal-950/25 via-emerald-950/15 to-transparent',
        auroraOrb3: 'bg-emerald-950/15',
        innerGlowOrb1: 'bg-emerald-500/15',
        innerGlowOrb2: 'bg-teal-500/10',
        canvasRingColor: 'rgba(110, 231, 183, 0.5)',
        cardBorder: 'border-white/15',
        cardBg: 'bg-stone-950/65',
        cardShadow: 'shadow-[0_30px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(255,255,255,0.12)]',
        glyphColor: 'text-stone-400',
        barcodeColor: 'bg-white',
        miniWidgetTitle: 'text-stone-300',
        followText: 'text-stone-500',
        borderDivider: 'border-white/10',
        calContainerBorder: 'border-white/10',
        calContainerBg: 'bg-white/[0.03]',
        calHeaderTitle: 'text-stone-300',
        calCardBorder: 'border-white/15',
        calCardBg: 'bg-white/[0.04]',
        ringBorder: 'border-stone-300/80',
        ringGradient: 'from-stone-100 via-stone-300 to-stone-500',
        calSelectedDayBg: 'bg-white',
        calSelectedDayText: 'text-black',
        calSelectedDayShadow: 'shadow-[0_0_14px_rgba(255,255,255,0.9)]',
        calDayHoverText: 'hover:text-white',
        calDayHoverBg: 'hover:bg-white/10',
        memoTextColor: 'text-stone-400',
        poetContainerBorder: 'border-white/15',
        poetContainerBg: 'bg-white/[0.03]',
        poetHeaderColor: 'text-stone-300',
        poetTextColor: 'text-stone-200',
        poetAuthorColor: 'text-stone-400',
        poetActiveDot: 'bg-white shadow-[0_0_6px_white]',
        poetNextBtnBorder: 'border-white/20',
        poetNextBtnBg: 'bg-white/10',
        poetNextBtnHoverBg: 'hover:bg-white/20',
        poetNextBtnText: 'text-stone-100',
        anthesisSubtitle: 'text-stone-300',
        libraryTitleColor: 'text-white',
        libraryGlow: 'drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]',
        starColor: 'text-stone-300',
        bookCardBorder: 'border-white/15',
        bookCardBg: 'bg-white/[0.04]',
        bookCardShadow: 'shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.1)]',
        washiTapeBg: 'rgba(255, 255, 255, 0.15)',
        washiTapeShadow: '0 1px 4px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.25)',
        gridLineColor: 'rgba(255, 255, 255, 0.3)',
        bookTagColor: 'text-stone-300',
        bookTitleColor: 'text-white',
        bookSubtitleColor: 'text-stone-400',
        progressTrackBg: 'bg-white/10',
        progressBarBg: 'bg-white',
        readMoreBtnColor: 'text-stone-300 hover:text-white',
        quoteColor: 'text-stone-300',
        nienthoiText: 'text-stone-400',
        axisDotBg: 'bg-white/70',
        axisLineBg: 'bg-white/20',
        axisText: 'text-stone-300',
        canvasParticleColor: '#ffffff',
        astroBorder: 'border-white/10',
        astroLabel: 'text-stone-400',
        astroTime: 'text-white',
        astroTimeGlow: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]',
        audioDivider: 'border-white/10',
        audioPlayBtnBg: 'bg-white/10',
        audioPlayBtnHoverBg: 'hover:bg-white/20',
        audioPlayBtnBorder: 'border-white/25',
        audioProgressTrackBg: 'bg-white/10',
        audioProgressBarBg: 'bg-white',
        audioSpeedBorder: 'border-white/20',
        audioSpeedBg: 'bg-white/[0.06]',
        isWhiteCard: false,
        linedPaperColor: 'rgba(255, 255, 255, 0.08)',
      };

    case 'mocha':
      return {
        themeId,
        auroraOrb1: 'from-amber-950/35 via-orange-950/25 to-transparent',
        auroraOrb2: 'from-orange-950/40 via-amber-950/25 to-transparent',
        auroraOrb3: 'bg-amber-950/25',
        innerGlowOrb1: 'bg-amber-500/25',
        innerGlowOrb2: 'bg-orange-500/20',
        canvasRingColor: 'rgba(252, 211, 77, 0.5)',
        cardBorder: 'border-white/15',
        cardBg: 'bg-stone-950/65',
        cardShadow: 'shadow-[0_30px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(255,255,255,0.12)]',
        glyphColor: 'text-stone-400',
        barcodeColor: 'bg-white',
        miniWidgetTitle: 'text-stone-300',
        followText: 'text-stone-500',
        borderDivider: 'border-white/10',
        calContainerBorder: 'border-white/10',
        calContainerBg: 'bg-white/[0.03]',
        calHeaderTitle: 'text-stone-300',
        calCardBorder: 'border-white/15',
        calCardBg: 'bg-white/[0.04]',
        ringBorder: 'border-stone-300/80',
        ringGradient: 'from-stone-100 via-stone-300 to-stone-500',
        calSelectedDayBg: 'bg-white',
        calSelectedDayText: 'text-black',
        calSelectedDayShadow: 'shadow-[0_0_14px_rgba(255,255,255,0.9)]',
        calDayHoverText: 'hover:text-white',
        calDayHoverBg: 'hover:bg-white/10',
        memoTextColor: 'text-stone-400',
        poetContainerBorder: 'border-white/15',
        poetContainerBg: 'bg-white/[0.03]',
        poetHeaderColor: 'text-stone-300',
        poetTextColor: 'text-stone-200',
        poetAuthorColor: 'text-stone-400',
        poetActiveDot: 'bg-white shadow-[0_0_6px_white]',
        poetNextBtnBorder: 'border-white/20',
        poetNextBtnBg: 'bg-white/10',
        poetNextBtnHoverBg: 'hover:bg-white/20',
        poetNextBtnText: 'text-stone-100',
        anthesisSubtitle: 'text-stone-300',
        libraryTitleColor: 'text-white',
        libraryGlow: 'drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]',
        starColor: 'text-stone-300',
        bookCardBorder: 'border-white/15',
        bookCardBg: 'bg-white/[0.04]',
        bookCardShadow: 'shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.1)]',
        washiTapeBg: 'rgba(255, 255, 255, 0.15)',
        washiTapeShadow: '0 1px 4px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.25)',
        gridLineColor: 'rgba(255, 255, 255, 0.3)',
        bookTagColor: 'text-stone-300',
        bookTitleColor: 'text-white',
        bookSubtitleColor: 'text-stone-400',
        progressTrackBg: 'bg-white/10',
        progressBarBg: 'bg-white',
        readMoreBtnColor: 'text-stone-300 hover:text-white',
        quoteColor: 'text-stone-300',
        nienthoiText: 'text-stone-400',
        axisDotBg: 'bg-white/70',
        axisLineBg: 'bg-white/20',
        axisText: 'text-stone-300',
        canvasParticleColor: '#ffffff',
        astroBorder: 'border-white/10',
        astroLabel: 'text-stone-400',
        astroTime: 'text-white',
        astroTimeGlow: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]',
        audioDivider: 'border-white/10',
        audioPlayBtnBg: 'bg-white/10',
        audioPlayBtnHoverBg: 'hover:bg-white/20',
        audioPlayBtnBorder: 'border-white/25',
        audioProgressTrackBg: 'bg-white/10',
        audioProgressBarBg: 'bg-white',
        audioSpeedBorder: 'border-white/20',
        audioSpeedBg: 'bg-white/[0.06]',
        isWhiteCard: false,
        linedPaperColor: 'rgba(255, 255, 255, 0.08)',
      };

    case 'notebook':
      return {
        themeId,
        isWhiteCard: false,
        linedPaperColor: 'rgba(255, 255, 255, 0.08)',
        auroraOrb1: 'from-zinc-900/15 via-stone-900/10 to-transparent',
        auroraOrb2: 'from-stone-900/15 via-zinc-950/10 to-transparent',
        auroraOrb3: 'bg-zinc-900/12',
        cardBorder: 'border-white/15',
        cardBg: 'bg-zinc-950/75',
        cardShadow: 'shadow-[0_30px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(255,255,255,0.12)]',
        innerGlowOrb1: 'bg-white/6',
        innerGlowOrb2: 'bg-stone-500/5',
        glyphColor: 'text-zinc-400',
        barcodeColor: 'bg-white',
        miniWidgetTitle: 'text-zinc-300',
        followText: 'text-zinc-500',
        borderDivider: 'border-white/10',
        calContainerBorder: 'border-white/10',
        calContainerBg: 'bg-white/[0.03]',
        calHeaderTitle: 'text-zinc-300',
        calCardBorder: 'border-white/15',
        calCardBg: 'bg-white/[0.04]',
        ringBorder: 'border-zinc-300/80',
        ringGradient: 'from-zinc-100 via-zinc-300 to-zinc-500',
        calSelectedDayBg: 'bg-white',
        calSelectedDayText: 'text-black',
        calSelectedDayShadow: 'shadow-[0_0_14px_rgba(255,255,255,0.9)]',
        calDayHoverText: 'hover:text-white',
        calDayHoverBg: 'hover:bg-white/10',
        memoTextColor: 'text-zinc-400',
        poetContainerBorder: 'border-white/15',
        poetContainerBg: 'bg-white/[0.03]',
        poetHeaderColor: 'text-zinc-300',
        poetTextColor: 'text-zinc-200',
        poetAuthorColor: 'text-zinc-400',
        poetActiveDot: 'bg-white shadow-[0_0_6px_white]',
        poetNextBtnBorder: 'border-white/20',
        poetNextBtnBg: 'bg-white/10',
        poetNextBtnHoverBg: 'hover:bg-white/20',
        poetNextBtnText: 'text-zinc-100',
        anthesisSubtitle: 'text-zinc-300',
        libraryTitleColor: 'text-white',
        libraryGlow: 'drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]',
        starColor: 'text-zinc-300',
        bookCardBorder: 'border-white/15',
        bookCardBg: 'bg-white/[0.04]',
        bookCardShadow: 'shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.1)]',
        washiTapeBg: 'rgba(255, 255, 255, 0.15)',
        washiTapeShadow: '0 1px 4px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.25)',
        gridLineColor: 'rgba(255, 255, 255, 0.3)',
        bookTagColor: 'text-zinc-300',
        bookTitleColor: 'text-white',
        bookSubtitleColor: 'text-zinc-400',
        progressTrackBg: 'bg-white/10',
        progressBarBg: 'bg-white',
        readMoreBtnColor: 'text-zinc-300 hover:text-white',
        quoteColor: 'text-zinc-300',
        nienthoiText: 'text-zinc-400',
        axisDotBg: 'bg-white/70',
        axisLineBg: 'bg-white/20',
        axisText: 'text-zinc-300',
        canvasRingColor: 'rgba(255, 255, 255, 0.45)',
        canvasParticleColor: '#ffffff',
        astroBorder: 'border-white/10',
        astroLabel: 'text-zinc-400',
        astroTime: 'text-white',
        astroTimeGlow: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]',
        audioDivider: 'border-white/10',
        audioPlayBtnBg: 'bg-white/10',
        audioPlayBtnHoverBg: 'hover:bg-white/20',
        audioPlayBtnBorder: 'border-white/25',
        audioProgressTrackBg: 'bg-white/10',
        audioProgressBarBg: 'bg-white',
        audioSpeedBorder: 'border-white/20',
        audioSpeedBg: 'bg-white/[0.06]',
      };

    case 'slate-haze':
    default:
      // THEME FROST CHẾ ĐỘ TỐI: GIỮ NGUYÊN 100% THEO CODE GỐC CỦA NGƯỜI DÙNG
      return {
        themeId: 'slate-haze',
        isWhiteCard: false,
        linedPaperColor: 'rgba(255, 255, 255, 0.08)',
        auroraOrb1: 'from-indigo-900/20 via-purple-900/15 to-transparent',
        auroraOrb2: 'from-cyan-950/25 via-blue-950/15 to-transparent',
        auroraOrb3: 'bg-stone-900/20',
        cardBorder: 'border-white/15',
        cardBg: 'bg-stone-950/65',
        cardShadow: 'shadow-[0_30px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(255,255,255,0.12)]',
        innerGlowOrb1: 'bg-indigo-500/10',
        innerGlowOrb2: 'bg-cyan-500/10',
        glyphColor: 'text-stone-400',
        barcodeColor: 'bg-white',
        miniWidgetTitle: 'text-stone-300',
        followText: 'text-stone-500',
        borderDivider: 'border-white/10',
        calContainerBorder: 'border-white/10',
        calContainerBg: 'bg-white/[0.03]',
        calHeaderTitle: 'text-stone-300',
        calCardBorder: 'border-white/15',
        calCardBg: 'bg-white/[0.04]',
        ringBorder: 'border-stone-300/80',
        ringGradient: 'from-stone-100 via-stone-300 to-stone-500',
        calSelectedDayBg: 'bg-white',
        calSelectedDayText: 'text-black',
        calSelectedDayShadow: 'shadow-[0_0_14px_rgba(255,255,255,0.9)]',
        calDayHoverText: 'hover:text-white',
        calDayHoverBg: 'hover:bg-white/10',
        memoTextColor: 'text-stone-400',
        poetContainerBorder: 'border-white/15',
        poetContainerBg: 'bg-white/[0.03]',
        poetHeaderColor: 'text-stone-300',
        poetTextColor: 'text-stone-200',
        poetAuthorColor: 'text-stone-400',
        poetActiveDot: 'bg-white shadow-[0_0_6px_white]',
        poetNextBtnBorder: 'border-white/20',
        poetNextBtnBg: 'bg-white/10',
        poetNextBtnHoverBg: 'hover:bg-white/20',
        poetNextBtnText: 'text-stone-100',
        anthesisSubtitle: 'text-stone-300',
        libraryTitleColor: 'text-white',
        libraryGlow: 'drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]',
        starColor: 'text-stone-300',
        bookCardBorder: 'border-white/15',
        bookCardBg: 'bg-white/[0.04]',
        bookCardShadow: 'shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.1)]',
        washiTapeBg: 'rgba(255, 255, 255, 0.15)',
        washiTapeShadow: '0 1px 4px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.25)',
        gridLineColor: 'rgba(255, 255, 255, 0.3)',
        bookTagColor: 'text-stone-300',
        bookTitleColor: 'text-white',
        bookSubtitleColor: 'text-stone-400',
        progressTrackBg: 'bg-white/10',
        progressBarBg: 'bg-white',
        readMoreBtnColor: 'text-stone-300 hover:text-white',
        quoteColor: 'text-stone-300',
        nienthoiText: 'text-stone-400',
        axisDotBg: 'bg-white/70',
        axisLineBg: 'bg-white/20',
        axisText: 'text-stone-300',
        canvasRingColor: 'rgba(255, 255, 255, 0.45)',
        canvasParticleColor: '#ffffff',
        astroBorder: 'border-white/10',
        astroLabel: 'text-stone-400',
        astroTime: 'text-white',
        astroTimeGlow: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]',
        audioDivider: 'border-white/10',
        audioPlayBtnBg: 'bg-white/10',
        audioPlayBtnHoverBg: 'hover:bg-white/20',
        audioPlayBtnBorder: 'border-white/25',
        audioProgressTrackBg: 'bg-white/10',
        audioProgressBarBg: 'bg-white',
        audioSpeedBorder: 'border-white/20',
        audioSpeedBg: 'bg-white/[0.06]',
      };
  }
};

// =========================================================================
// 6. TOÀN BỘ KHỐI MINI WIDGET CHẾ ĐỘ TỐI (NOIR GLASSMORPHISM Y NHƯ ẢNH)
// =========================================================================
export interface EntireDarkLibraryWidgetProps {
  themeId?: string;
  recentNovel?: Novel | null;
  onSelectNovel?: (novel: Novel) => void;
  onOpenReading?: () => void;
}

export const EntireDarkLibraryWidget: React.FC<EntireDarkLibraryWidgetProps> = ({
  themeId = 'slate-haze',
  recentNovel,
  onSelectNovel,
  onOpenReading,
}) => {
  const c = getDarkThemeConfig(themeId);

  const now = useMemo(() => new Date(), []);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const todayDate = now.getDate();

  const [selectedDay, setSelectedDay] = useState<number>(todayDate);
  const [activePoetIdx, setActivePoetIdx] = useState<number>((todayDate - 1) % poetList.length);
  const [readingProgress, setReadingProgress] = useState<number>(78);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [timeStr, setTimeStr] = useState<string>('04:06:36 PM');

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
    /* THẺ CHÍNH MINI WIDGET: KÍNH HUN KHÓI (FROSTED SMOKED GLASS) */
    <div className={`w-full max-w-4xl rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-10 border ${c.cardBorder} ${c.cardBg} backdrop-blur-2xl ${c.cardShadow} relative select-none overflow-visible transition-all duration-500 z-10 font-sans antialiased ${c.isWhiteCard ? 'text-stone-900' : 'text-stone-100'}`}>
      
      {/* Quầng sáng nội tại của tấm kính */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
        <div className={`absolute inset-0 ${c.isWhiteCard ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.92)_0%,rgba(245,245,245,0.85)_100%)]' : 'bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0.85)_100%)]'}`} />
        <div className={`absolute top-1/4 right-1/4 w-80 h-80 ${c.innerGlowOrb1} rounded-full blur-3xl`} />
        <div className={`absolute bottom-1/4 left-1/4 w-80 h-80 ${c.innerGlowOrb2} rounded-full blur-3xl`} />
      </div>

      {/* -------------------------------------------------------------------
          C. HỆ THỐNG TRANG TRÍ VI HÌNH HỌC RẢI RÁC TRONG KHỐI LỚN
          ------------------------------------------------------------------- */}
      <div className={`absolute inset-0 pointer-events-none select-none z-20 ${c.glyphColor}`}>
        <div className="absolute top-4 sm:top-5 left-4 sm:left-7 opacity-30"><MicroStar4 className="w-2 sm:w-2.5 h-2 sm:h-2.5" /></div>
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-7 opacity-30"><MicroStar4 className="w-2 sm:w-2.5 h-2 sm:h-2.5" /></div>
      </div>

      {/* -------------------------------------------------------------------
          D. THANH TIÊU ĐỀ ĐỈNH: MÃ VẠCH + MINI WIDGET + FOLLOW
          ------------------------------------------------------------------- */}
      <div className={`relative z-10 flex items-center justify-between border-b ${c.borderDivider} pb-2 sm:pb-3 mb-4 sm:mb-6`}>
        {/* Mã vạch trắng bạc */}
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

      {/* -------------------------------------------------------------------
          E. KHU VỰC 1: CALENDAR (LỊCH THÁNG 10 VÀ TUYỂN THƠ POETS)
          TRÊN ĐIỆN THOẠI CŨNG NẰM TRÊN CÙNG 1 DÒNG (grid-cols-2)
          ------------------------------------------------------------------- */}
      <div className={`relative z-10 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-6 border ${c.calContainerBorder} ${c.calContainerBg} backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] mb-4 sm:mb-6 md:mb-8`}>
        <div className={`text-[8px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase border-b ${c.borderDivider} pb-1.5 sm:pb-2 mb-2 sm:mb-4 ${c.calHeaderTitle}`}>
          <span>CALENDAR</span>
        </div>

        {/* NẰM TRÊN CÙNG 1 DÒNG CẢ TRÊN ĐIỆN THOẠI: grid-cols-2 */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 items-stretch">
          {/* Lịch tháng 10/2026 với 6 khuyên lò xo bạc nổi */}
          <div className="flex flex-col justify-between gap-1 sm:gap-2 min-w-0">
            <div className={`relative w-full rounded-lg sm:rounded-xl border ${c.calCardBorder} ${c.calCardBg} backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.1)] pt-3 sm:pt-4 pb-2 sm:pb-3 px-1.5 sm:px-3`}>
              {/* Dãy 6 khuyên lò xo kim loại ánh bạc */}
              <div className="absolute -top-1.5 sm:-top-2 left-0 right-0 flex justify-between px-2 sm:px-6 pointer-events-none z-20">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 sm:w-2 h-3 sm:h-4 rounded-full border ${c.ringBorder} bg-gradient-to-b ${c.ringGradient} shadow-[0_1px_4px_rgba(0,0,0,0.5)]`}
                  />
                ))}
              </div>

              {/* Tiêu đề tháng */}
              <div className={`flex items-center justify-between border-b ${c.borderDivider} pb-1 mb-1 sm:pb-1.5 sm:mb-1.5`}>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <CalendarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-300" />
                  <span className="font-mono text-[7px] xs:text-[8.5px] sm:text-xs font-semibold tracking-wider text-white truncate">
                    OCTOBER // 2026
                  </span>
                </div>
              </div>

              {/* Thứ trong tuần */}
              <div className={`grid grid-cols-7 gap-0.5 text-center text-[5.5px] xs:text-[6.5px] sm:text-[9px] font-mono pb-0.5 sm:pb-1 border-b ${c.borderDivider} text-stone-400`}>
                <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
              </div>

              {/* Lưới 31 ngày (Ngày được chọn phát sáng rực rỡ) */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center font-mono text-[5.5px] xs:text-[7px] sm:text-[9px] pt-1">
                <span className="p-0.5 opacity-20">27</span>
                <span className="p-0.5 opacity-20">28</span>
                <span className="p-0.5 opacity-20">29</span>
                <span className="p-0.5 opacity-20">30</span>
                {Array.from({ length: 31 }, (_, idx) => {
                  const dayNum = idx + 1;
                  const isSelected = selectedDay === dayNum;
                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => {
                        playTap();
                        setSelectedDay(dayNum);
                        setActivePoetIdx((dayNum - 1) % poetList.length);
                      }}
                      className={`p-0.5 sm:p-1 rounded-xs cursor-pointer transition-all aspect-square flex items-center justify-center ${
                        isSelected
                          ? `${c.calSelectedDayBg} ${c.calSelectedDayText} font-bold ${c.calSelectedDayShadow} scale-105 z-10`
                          : `text-stone-300 ${c.calDayHoverText} ${c.calDayHoverBg}`
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dòng Memo */}
            <div className={`flex items-center justify-between font-mono text-[6.5px] xs:text-[7.5px] sm:text-[9px] ${c.memoTextColor} px-0.5`}>
              <div>
                <p>MEMO · {currentMonthName.slice(0, 3)} {selectedDay}</p>
                <p className="opacity-75">FLORAL ANTHESIS</p>
              </div>
              <div className="text-right opacity-75">
                <p>MONTHLY CALENDAR</p>
              </div>
            </div>
          </div>

          {/* CỘT 2: KHUNG QUOTATIONS VỚI GHIM PAPER CLIP VÀ HỌA TIẾT LINED PAPER */}
          <div
            className={`relative overflow-visible flex flex-col justify-between h-full rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border ${c.poetContainerBorder} ${c.poetContainerBg} backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.08)] min-w-0`}
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 19px, ${c.linedPaperColor || 'rgba(255, 255, 255, 0.08)'} 19px, ${c.linedPaperColor || 'rgba(255, 255, 255, 0.08)'} 20px)`,
              backgroundPosition: '0 8px',
            }}
          >
            {/* CHIẾC GHIM PAPER CLIP NẰM Ở GÓC TRÊN BÊN PHẢI */}
            <MetallicPaperClip
              isDarkMode={true}
              themeId={c.themeId}
              className="absolute -top-3.5 sm:-top-4.5 right-3 sm:right-5 z-20 pointer-events-none"
            />

            <div>
              <div className={`flex items-center justify-between text-[7px] xs:text-[8px] sm:text-xs font-mono tracking-wider pb-1.5 sm:pb-2 border-b ${c.borderDivider} ${c.poetHeaderColor}`}>
                <span className="font-semibold">Quotations</span>
              </div>

              {/* 4 dòng trích dẫn lãng mạn trên giấy kẻ dòng */}
              <div className={`py-1.5 sm:py-3 space-y-0.5 sm:space-y-1 font-serif text-[7.5px] xs:text-[9px] sm:text-xs md:text-sm italic ${c.poetTextColor} leading-relaxed overflow-hidden`}>
                {currentPoet.lines.map((line, idx) => (
                  <p key={idx} className="line-clamp-1">{line}</p>
                ))}
              </div>
            </div>

            {/* Chấm phân trang & Nút NEXT ○ */}
            <div className={`pt-1.5 sm:pt-2 border-t ${c.borderDivider} flex items-center justify-between`}>
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-hidden max-w-[50%]">
                {poetList.slice(0, 10).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full transition-transform shrink-0 ${
                      i === (activePoetIdx % 10) ? `${c.poetActiveDot} scale-125` : (c.isWhiteCard ? 'bg-stone-300' : 'bg-white/20')
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
                className={`inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${c.poetNextBtnBorder} ${c.poetNextBtnBg} ${c.poetNextBtnHoverBg} backdrop-blur-md ${c.poetNextBtnText} text-[8px] sm:text-xs font-mono font-medium transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] shrink-0`}
              >
                <span>NEXT</span>
                <span className="text-[6.5px] sm:text-[8px]">○</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          F. KHU VỰC 3: ANTHESIS // THREE-DAY CYCLE & L I B R A R Y
          ----------------------------------------------------------------- */}
      <div className={`relative z-10 pt-2 mb-2 sm:mb-4 border-t ${c.borderDivider}`}>
        <div className={`text-[8px] sm:text-[10px] font-mono tracking-widest uppercase ${c.anthesisSubtitle} mb-1 sm:mb-2`}>
          ANTHESIS // THREE-DAY CYCLE
        </div>

        {/* Chữ LIBRARY phát sáng với 4 ngôi sao 4 cánh quanh chữ */}
        <div className="relative inline-block my-1 sm:my-2 py-0.5 sm:py-1 pr-4 sm:pr-6">
          <span className={`font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.25em] sm:tracking-[0.4em] uppercase ${c.libraryTitleColor} ${c.libraryGlow} select-none`}>
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
          G. KHU VỰC 2: 3 CỘT (TRÊN ĐIỆN THOẠI CŨNG NẰM TRÊN CÙNG 1 DÒNG: COL-5, COL-2, COL-5)
          ----------------------------------------------------------------- */}
      <div className="relative z-10 grid grid-cols-12 gap-1.5 xs:gap-2 sm:gap-4 md:gap-6 items-center my-2 sm:my-4 py-1 sm:py-2">
        
        {/* CỘT TRÁI (col-span-5): THẺ SÁCH ĐỌC GẦN ĐÂY #GEOMETRY_03 */}
        <div className="col-span-5 flex flex-col gap-1.5 sm:gap-2.5 min-w-0">
          <motion.div
            whileHover={{ scale: 1.015 }}
            className={`relative rounded-sm p-2 xs:p-2.5 sm:p-4 border ${c.bookCardBorder} ${c.bookCardBg} backdrop-blur-xl ${c.bookSubtitleColor} ${c.bookCardShadow} select-none transition-transform`}
          >
            {/* Băng keo Washi trong suốt sương đêm dán đỉnh thẻ */}
            <div
              className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 w-14 xs:w-18 sm:w-24 h-3.5 sm:h-5 rounded-xs z-30 pointer-events-none"
              style={{
                background: c.washiTapeBg,
                backdropFilter: 'blur(6px)',
                boxShadow: c.washiTapeShadow,
              }}
            />

            {/* Họa tiết ô ly chìm mờ trên nền đen kính */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none rounded-sm"
              style={{
                backgroundSize: '16px 16px',
                backgroundImage: `linear-gradient(to right, ${c.gridLineColor} 1px, transparent 1px), linear-gradient(to bottom, ${c.gridLineColor} 1px, transparent 1px)`,
              }}
            />

            <div className="relative z-10 space-y-0.5 sm:space-y-1">
              <div className={`text-[6.5px] xs:text-[7.5px] sm:text-[10px] font-mono tracking-[0.15em] sm:tracking-[0.2em] uppercase ${c.bookTagColor} font-medium truncate`}>
                ĐỌC GẦN ĐÂY
              </div>

              <div>
                <h4 className={`font-serif text-[8.5px] xs:text-[10px] sm:text-sm font-medium tracking-wider ${c.bookTitleColor} truncate`}>
                  {recentNovel?.title || 'Dạ Khúc Bạch Hợp'}
                </h4>
                <p className={`font-serif italic text-[6.5px] xs:text-[7.5px] sm:text-[10px] ${c.bookSubtitleColor} truncate`}>
                  {recentNovel ? `Tác giả: ${typeof recentNovel.author === 'string' ? recentNovel.author : recentNovel.author?.name || 'Jouriee65'}` : 'Chương 42: Nở Rộ Trong Tĩnh Lặng'}
                </p>
              </div>

              {/* Thanh tiến độ đọc truyện */}
              <div className={`space-y-0.5 sm:space-y-1 pt-1 sm:pt-1.5 border-t ${c.borderDivider}`}>
                <div className={`flex items-center justify-between text-[5.5px] xs:text-[6.5px] sm:text-[8px] font-mono ${c.bookSubtitleColor}`}>
                  <span>Tiến độ</span>
                  <span className="font-medium text-stone-300">{readingProgress}%</span>
                </div>
                <div className={`w-full h-1 rounded-full overflow-hidden ${c.progressTrackBg}`}>
                  <div
                    className={`h-full rounded-full ${c.progressBarBg} transition-all duration-300`}
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[5.5px] xs:text-[6.5px] sm:text-[8px] font-mono pt-0.5 text-stone-500">
                  <span className="truncate">12p trước</span>
                  <button
                    type="button"
                    onClick={() => {
                      playTap();
                      if (onOpenReading) {
                        onOpenReading();
                      } else {
                        setReadingProgress((p) => (p >= 98 ? 15 : p + 7));
                      }
                    }}
                    className={`underline cursor-pointer ${c.readMoreBtnColor} shrink-0`}
                  >
                    Đọc tiếp →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Câu trích dẫn & Tiêu đề phụ NIÊN THỜI */}
          <div>
            <p className={`font-serif italic text-[6px] xs:text-[7px] sm:text-xs tracking-wider leading-relaxed ${c.quoteColor} line-clamp-2`}>
              May the little things in life bring you the kind of happiness that stays.
            </p>
            <p className={`text-[5.5px] xs:text-[6.5px] sm:text-[9px] font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-0.5 sm:mt-1 ${c.nienthoiText} truncate`}>
              N I Ê N &nbsp; T H Ờ I
            </p>
          </div>
        </div>

        {/* CỘT GIỮA (col-span-2): TRỤC ĐỐI XỨNG THREE / DAYS / BLOOM - NẰM TRÊN CÙNG 1 DÒNG */}
        <div className={`col-span-2 flex flex-col items-center justify-center gap-1 sm:gap-2 font-mono text-[6px] xs:text-[7px] sm:text-[10px] ${c.axisText}`}>
          <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${c.axisDotBg}`} />
          <div className={`w-[1px] h-5 xs:h-6 sm:h-8 ${c.axisLineBg}`} />
          <div className={`flex flex-col items-center gap-0.5 tracking-widest font-medium uppercase text-[5.5px] xs:text-[6.5px] sm:text-[9px] ${c.axisText}`}>
            <span>THREE</span>
            <span>DAYS</span>
            <span>BLOOM</span>
          </div>
          <div className={`w-[1px] h-5 xs:h-6 sm:h-8 ${c.axisLineBg}`} />
          <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${c.axisDotBg}`} />
        </div>

        {/* CỘT PHẢI (col-span-5): RADAR THIÊN VĂN MẶT TRĂNG KIM CƯƠNG 60FPS + BẢNG THÔNG SỐ */}
        <div className="col-span-5 flex flex-col justify-center items-center overflow-visible relative min-w-0">
          
          {/* CANVAS 2D: VẦNG TRĂNG LƯỠI LIỀM PHÁT SÁNG & BÁNH RĂNG THIÊN VĂN QUAY MƯỢT MÀ */}
          <CelestialDiamondMoonCanvas
            ringColor={c.canvasRingColor}
            particleColor={c.canvasParticleColor}
            className="my-0.5 sm:my-1"
          />

          {/* BẢNG THÔNG SỐ THIÊN VĂN (DATE / TIME / SEASON) */}
          <div className={`w-full mt-1 sm:mt-2 space-y-0.5 sm:space-y-1 font-mono text-[6px] xs:text-[7.5px] sm:text-xs border-t ${c.astroBorder} pt-1 sm:pt-2`}>
            <div className="flex items-center justify-between text-stone-300">
              <span className={`flex items-center gap-0.5 sm:gap-1 ${c.astroLabel}`}>
                <CalendarIcon className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                <span>DATE</span>
              </span>
              <span className="font-medium truncate">{now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            <div className="flex items-center justify-between text-stone-300">
              <span className={`flex items-center gap-0.5 sm:gap-1 ${c.astroLabel}`}>
                <Clock className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                <span>TIME</span>
              </span>
              <span className={`font-bold ${c.astroTime} tabular-nums ${c.astroTimeGlow} truncate`}>
                {timeStr}
              </span>
            </div>

            <div className="flex items-center justify-between text-stone-300">
              <span className={c.astroLabel}>SEASON</span>
              <span className="font-medium text-stone-400 truncate">{getSeasonDisplay()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          H. THANH PHÁT ÂM THANH Ở ĐÁY: NÚT PLAY KÍNH MỜ + TIẾN TRÌNH TRẮNG + 1X
          ----------------------------------------------------------------- */}
      <div className={`relative z-10 mt-3 sm:mt-6 pt-2 flex items-center justify-between gap-2 sm:gap-4 border-t ${c.audioDivider}`}>
        {/* Nút Play tròn viền kính mờ */}
        <button
          type="button"
          onClick={() => {
            playChime(isPlayingAudio ? 392 : 784);
            setIsPlayingAudio(!isPlayingAudio);
          }}
          className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full border ${c.audioPlayBtnBorder} ${c.audioPlayBtnBg} ${c.audioPlayBtnHoverBg} backdrop-blur-md text-white shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0`}
        >
          {isPlayingAudio ? (
            <Pause className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
          ) : (
            <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Dải tiến trình phát nhạc */}
        <div className="flex-1 flex flex-col gap-0.5 sm:gap-1 min-w-0">
          <div className="flex justify-between text-[6.5px] xs:text-[7.5px] sm:text-[10px] font-mono text-stone-300">
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
        <div className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded border ${c.audioSpeedBorder} ${c.audioSpeedBg} backdrop-blur-md text-stone-200 text-[8px] sm:text-xs font-mono shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`}>
          1x
        </div>
      </div>
    </div>
  );
};

export const ScreenshotExactDarkRecreation: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#060709] text-stone-100 p-2 sm:p-6 md:p-12 flex items-center justify-center font-sans antialiased selection:bg-white/20 overflow-hidden">
      <EntireDarkLibraryWidget themeId="slate-haze" />
    </div>
  );
};

export default EntireDarkLibraryWidget;
