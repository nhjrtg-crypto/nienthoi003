import React from 'react';
import { motion } from 'motion/react';

interface CrescentCelestialOrbProps {
  theme: string;
}

/**
 * 🌌 KHỐI MÀU LOANG TỎA ÁNH SÁNG MỀM MẠI (CRESCENT AMBIENT RADIANT BLOOM)
 * - Thiết kế riêng cho mục Crescent Dreams ở chế độ tối.
 * - Khối màu loang mềm, vùng tỏa sáng nhè nhẹ hòa trộn tự nhiên vào nền, không có viền cứng, không bị cắt ngang.
 * - Khử hiện tượng vệt màu (Color Banding) bằng dải quét Scanline mờ ảo + Hạt Dither Noise vi mô có mặt nạ viền mềm.
 * - Đồng bộ sắc thái theo từng theme (amethyst-haze, slate-haze, sage, mocha, notebook).
 */
export const CrescentCelestialOrb: React.FC<CrescentCelestialOrbProps> = ({ theme }) => {
  // Bảng phối màu loang mềm chuyển sắc mượt mà theo từng Theme tối
  const themeGradients = React.useMemo(() => {
    switch (theme) {
      case 'slate-haze':
        return {
          innerCore: 'radial-gradient(ellipse at center, rgba(186, 230, 253, 0.40) 0%, rgba(56, 189, 248, 0.24) 28%, rgba(14, 116, 144, 0.10) 50%, transparent 68%)',
          outerAura: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.30) 0%, rgba(30, 58, 138, 0.15) 38%, rgba(15, 23, 42, 0) 62%)',
          centerLight: 'radial-gradient(circle at center, rgba(240, 249, 255, 0.60) 0%, rgba(56, 189, 248, 0.22) 28%, transparent 55%)',
        };
      case 'sage':
        return {
          innerCore: 'radial-gradient(ellipse at center, rgba(209, 250, 229, 0.40) 0%, rgba(52, 211, 153, 0.24) 28%, rgba(5, 150, 105, 0.10) 50%, transparent 68%)',
          outerAura: 'radial-gradient(ellipse at center, rgba(52, 211, 153, 0.28) 0%, rgba(6, 78, 59, 0.15) 38%, rgba(2, 36, 27, 0) 62%)',
          centerLight: 'radial-gradient(circle at center, rgba(240, 253, 244, 0.60) 0%, rgba(52, 211, 153, 0.22) 28%, transparent 55%)',
        };
      case 'mocha':
        return {
          innerCore: 'radial-gradient(ellipse at center, rgba(254, 215, 170, 0.40) 0%, rgba(251, 146, 60, 0.24) 28%, rgba(194, 65, 12, 0.10) 50%, transparent 68%)',
          outerAura: 'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.28) 0%, rgba(124, 45, 18, 0.15) 38%, rgba(45, 16, 8, 0) 62%)',
          centerLight: 'radial-gradient(circle at center, rgba(255, 251, 235, 0.60) 0%, rgba(251, 146, 60, 0.22) 28%, transparent 55%)',
        };
      case 'notebook':
        return {
          innerCore: 'radial-gradient(ellipse at center, rgba(241, 245, 249, 0.40) 0%, rgba(203, 213, 225, 0.22) 28%, rgba(100, 116, 139, 0.10) 50%, transparent 68%)',
          outerAura: 'radial-gradient(ellipse at center, rgba(226, 232, 240, 0.26) 0%, rgba(51, 65, 85, 0.14) 38%, rgba(15, 23, 42, 0) 62%)',
          centerLight: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.60) 0%, rgba(203, 213, 225, 0.22) 28%, transparent 55%)',
        };
      case 'amethyst-haze':
      default:
        return {
          innerCore: 'radial-gradient(ellipse at center, rgba(233, 213, 255, 0.40) 0%, rgba(192, 132, 252, 0.25) 28%, rgba(147, 51, 234, 0.10) 50%, transparent 68%)',
          outerAura: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.30) 0%, rgba(88, 28, 135, 0.15) 38%, rgba(30, 8, 55, 0) 62%)',
          centerLight: 'radial-gradient(circle at center, rgba(250, 245, 255, 0.62) 0%, rgba(192, 132, 252, 0.24) 28%, transparent 55%)',
        };
    }
  }, [theme]);

  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 flex items-center justify-center overflow-visible w-[22rem] sm:w-[32rem] md:w-[42rem] h-[12rem] sm:h-[16rem] md:h-[20rem]"
      style={{
        maskImage:
          'radial-gradient(ellipse 48% 42% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 72%, transparent 95%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 48% 42% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 72%, transparent 95%)',
      }}
    >
      {/* =========================================================================
          LỚP 1: VÙNG MÀU LOANG KHUẾCH TÁN NGOÀI (DIFFUSED OUTER COLOR BLOOM)
          Hòa trộn êm dịu dần vào nền xung quanh, không viền cứng, không bị cắt ngang
          ========================================================================= */}
      <motion.div
        animate={{
          scale: [0.94, 1.05, 0.94],
          opacity: [0.72, 0.92, 0.72],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
        style={{
          background: themeGradients.outerAura,
        }}
      />

      {/* =========================================================================
          LỚP 2: KHỐI TỎA ÁNH SÁNG TRUNG TÂM (INNER RADIANT CORE)
          Êm ái, sáng nhẹ ngay phía sau dòng chữ Crescent Dreams
          ========================================================================= */}
      <motion.div
        animate={{
          scale: [0.97, 1.03, 0.97],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut',
        }}
        className="absolute w-[80%] h-[75%] rounded-full blur-2xl pointer-events-none"
        style={{
          background: themeGradients.innerCore,
        }}
      />

      {/* =========================================================================
          LỚP 3: ĐIỂM SÁNG PHẢN CHIẾU TINH KHÔI Ở TÂM (GENTLE CORE HIGHLIGHT)
          ========================================================================= */}
      <motion.div
        animate={{
          scale: [0.95, 1.08, 0.95],
          opacity: [0.65, 0.85, 0.65],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: 'easeInOut',
        }}
        className="absolute w-[45%] h-[45%] rounded-full blur-xl pointer-events-none"
        style={{
          background: themeGradients.centerLight,
        }}
      />

      {/* =========================================================================
          LỚP 4: KHỬ HIỆN TƯỢNG VỆT MÀU (ANTI COLOR BANDING) - DITHER NOISE & SCANLINE
          Có mặt nạ hình elip viền mềm để hạt nhiễu và scanline không bị vệt sắc cạnh
          ========================================================================= */}
      <div
        className="absolute w-[85%] h-[80%] pointer-events-none mix-blend-overlay opacity-30"
        style={{
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0.6) 55%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0.6) 55%, transparent 75%)',
        }}
      >
        {/* 1. Scanline Raster siêu mịn (Micro Scanlines) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 3px)',
          }}
        />

        {/* 2. Dither Noise tự nhiên khử gãy dải màu */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseDitherBloom'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseDitherBloom)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </div>
  );
};
