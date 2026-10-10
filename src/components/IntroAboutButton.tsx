import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { cosmicAudio } from '../utils/audioSynth';

export interface IntroAboutButtonProps {
  onOpen?: () => void;
  isDarkEffective?: boolean;
  theme?: string;
  introButtonStyles?: any;
  label?: string;
  isStatic?: boolean;
}

export const IntroAboutButton: React.FC<IntroAboutButtonProps> = ({
  onOpen,
  isDarkEffective = false,
  theme = 'cosmic',
  label = '© 2026 Niên Thời - Jouriee65',
  isStatic = false,
}) => {
  // Bảng phối màu mềm mại, nhạt hơn và hơi trầm hơn theo từng theme
  const themeColors = useMemo(() => {
    switch (theme) {
      case 'sage':
        return isDarkEffective
          ? {
              pinGradient: 'bg-gradient-to-b from-[#cfe0d1] via-[#6e9170] to-[#1c3020]',
              pinBorder: 'border-[#3f5c42]',
              pinDot: 'bg-white/80',
              ropeBase: '#253828',
              ropeAccent: '#5e8261',
              ropeRingStroke: '#6e9170',
              starStroke: '#6e9170',
              starFill: '#152418',
              starSecondaryStroke: '#4d6d50',
              starSecondaryFill: '#101c12',
              cyberStarFill: '#5e8261',
              pixelHeartFill: '#6e9170',
              boardBg: 'bg-gradient-to-b from-[#18281b] via-[#132015] to-[#0e1910]',
              boardBorder: 'border-[#314c36]',
              boardShadow: 'shadow-[0_2.5px_0_#223626,0_5px_16px_rgba(0,0,0,0.45)]',
              caroBg: '#0e1910',
              caroPatternColor: 'rgba(94, 150, 102, 0.18)',
              caroBorder: 'border-[#223626]',
              dashedBorder: 'border-[#4d7053]/60',
              nailBorder: 'border-[#4d7053]',
              textColor: 'text-[#cfe0d1]',
              textShadow: 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]',
              blushFill: '#5e8261',
              mouthStroke: '#cfe0d1',
            }
          : {
              pinGradient: 'bg-gradient-to-b from-[#ffffff] via-[#f0f5f0] to-[#7d9e7f]',
              pinBorder: 'border-white',
              pinDot: 'bg-white/70',
              ropeBase: '#cfe0d1',
              ropeAccent: '#6e9170',
              ropeRingStroke: '#5e8261',
              starStroke: '#6e9170',
              starFill: '#f0f5f0',
              starSecondaryStroke: '#9ab89c',
              starSecondaryFill: '#ffffff',
              cyberStarFill: '#6e9170',
              pixelHeartFill: '#7d9e7f',
              boardBg: 'bg-gradient-to-b from-[#ffffff] via-[#f7f9f7] to-[#ecf2ec]',
              boardBorder: 'border-[#cfdccf]',
              boardShadow: 'shadow-[0_2.5px_0_#bfd0bf,0_5px_14px_rgba(34,84,40,0.08)]',
              caroBg: '#ffffff',
              caroPatternColor: 'rgba(90, 138, 95, 0.18)',
              caroBorder: 'border-[#dbe5db]',
              dashedBorder: 'border-[#adc1ad]/65',
              nailBorder: 'border-[#adc1ad]',
              textColor: 'text-[#244b27]',
              textShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]',
              blushFill: '#9ab89c',
              mouthStroke: '#2d5231',
            };

      case 'mocha':
        return isDarkEffective
          ? {
              pinGradient: 'bg-gradient-to-b from-[#decbc0] via-[#8c7161] to-[#2e221b]',
              pinBorder: 'border-[#523e34]',
              pinDot: 'bg-white/80',
              ropeBase: '#3a2b22',
              ropeAccent: '#7d6152',
              ropeRingStroke: '#7d6152',
              starStroke: '#8c7161',
              starFill: '#241a15',
              starSecondaryStroke: '#634b3e',
              starSecondaryFill: '#1a130f',
              cyberStarFill: '#7d6152',
              pixelHeartFill: '#8c7161',
              boardBg: 'bg-gradient-to-b from-[#291f1a] via-[#211914] to-[#19120e]',
              boardBorder: 'border-[#4a3930]',
              boardShadow: 'shadow-[0_2.5px_0_#362821,0_5px_16px_rgba(0,0,0,0.45)]',
              caroBg: '#19120e',
              caroPatternColor: 'rgba(166, 126, 101, 0.18)',
              caroBorder: 'border-[#362821]',
              dashedBorder: 'border-[#695245]/60',
              nailBorder: 'border-[#695245]',
              textColor: 'text-[#decbc0]',
              textShadow: 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]',
              blushFill: '#7d6152',
              mouthStroke: '#decbc0',
            }
          : {
              pinGradient: 'bg-gradient-to-b from-[#ffffff] via-[#f6f2ee] to-[#997f6f]',
              pinBorder: 'border-white',
              pinDot: 'bg-white/70',
              ropeBase: '#ded2c7',
              ropeAccent: '#8c7161',
              ropeRingStroke: '#7d6152',
              starStroke: '#8c7161',
              starFill: '#f6f2ee',
              starSecondaryStroke: '#ab9484',
              starSecondaryFill: '#ffffff',
              cyberStarFill: '#8c7161',
              pixelHeartFill: '#997f6f',
              boardBg: 'bg-gradient-to-b from-[#ffffff] via-[#faf8f6] to-[#f2ece6]',
              boardBorder: 'border-[#ddd4cc]',
              boardShadow: 'shadow-[0_2.5px_0_#cec3b9,0_5px_14px_rgba(100,60,30,0.08)]',
              caroBg: '#ffffff',
              caroPatternColor: 'rgba(148, 110, 85, 0.18)',
              caroBorder: 'border-[#e5ded7]',
              dashedBorder: 'border-[#baa9cb]/65',
              nailBorder: 'border-[#baa99c]',
              textColor: 'text-[#5e4130]',
              textShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]',
              blushFill: '#ab9484',
              mouthStroke: '#5e4130',
            };

      case 'slate-haze':
        return isDarkEffective
          ? {
              pinGradient: 'bg-gradient-to-b from-[#c9dbe9] via-[#6888a4] to-[#1b2b3a]',
              pinBorder: 'border-[#38536b]',
              pinDot: 'bg-white/80',
              ropeBase: '#223444',
              ropeAccent: '#547391',
              ropeRingStroke: '#547391',
              starStroke: '#6888a4',
              starFill: '#15212c',
              starSecondaryStroke: '#45627e',
              starSecondaryFill: '#0f1720',
              cyberStarFill: '#547391',
              pixelHeartFill: '#6888a4',
              boardBg: 'bg-gradient-to-b from-[#182430] via-[#131d27] to-[#0e161e]',
              boardBorder: 'border-[#2d4255]',
              boardShadow: 'shadow-[0_2.5px_0_#20303e,0_5px_16px_rgba(0,0,0,0.45)]',
              caroBg: '#0e161e',
              caroPatternColor: 'rgba(88, 136, 180, 0.18)',
              caroBorder: 'border-[#20303e]',
              dashedBorder: 'border-[#425d76]/60',
              nailBorder: 'border-[#425d76]',
              textColor: 'text-[#c9dbe9]',
              textShadow: 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]',
              blushFill: '#547391',
              mouthStroke: '#c9dbe9',
            }
          : {
              pinGradient: 'bg-gradient-to-b from-[#ffffff] via-[#f0f4f8] to-[#7595b1]',
              pinBorder: 'border-white',
              pinDot: 'bg-white/70',
              ropeBase: '#cce0f0',
              ropeAccent: '#5a80a2',
              ropeRingStroke: '#4a7091',
              starStroke: '#6888a4',
              starFill: '#f0f4f8',
              starSecondaryStroke: '#94adc2',
              starSecondaryFill: '#ffffff',
              cyberStarFill: '#6888a4',
              pixelHeartFill: '#7595b1',
              boardBg: 'bg-gradient-to-b from-[#ffffff] via-[#f7f9fb] to-[#ebf1f6]',
              boardBorder: 'border-[#cfdae4]',
              boardShadow: 'shadow-[0_2.5px_0_#becad6,0_5px_14px_rgba(30,70,110,0.08)]',
              caroBg: '#ffffff',
              caroPatternColor: 'rgba(88, 126, 160, 0.18)',
              caroBorder: 'border-[#dbe3eb]',
              dashedBorder: 'border-[#abbccb]/65',
              nailBorder: 'border-[#abbccb]',
              textColor: 'text-[#204a6e]',
              textShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]',
              blushFill: '#94adc2',
              mouthStroke: '#284f70',
            };

      case 'notebook':
        return isDarkEffective
          ? {
              pinGradient: 'bg-gradient-to-b from-[#d8d8d8] via-[#787878] to-[#252525]',
              pinBorder: 'border-[#4a4a4a]',
              pinDot: 'bg-white/80',
              ropeBase: '#333333',
              ropeAccent: '#6b6b6b',
              ropeRingStroke: '#6b6b6b',
              starStroke: '#787878',
              starFill: '#1c1c1c',
              starSecondaryStroke: '#545454',
              starSecondaryFill: '#141414',
              cyberStarFill: '#6b6b6b',
              pixelHeartFill: '#787878',
              boardBg: 'bg-gradient-to-b from-[#222222] via-[#1c1c1c] to-[#151515]',
              boardBorder: 'border-[#3d3d3d]',
              boardShadow: 'shadow-[0_2.5px_0_#2c2c2c,0_5px_16px_rgba(0,0,0,0.5)]',
              caroBg: '#151515',
              caroPatternColor: 'rgba(140, 140, 140, 0.18)',
              caroBorder: 'border-[#2c2c2c]',
              dashedBorder: 'border-[#555555]/60',
              nailBorder: 'border-[#555555]',
              textColor: 'text-[#d8d8d8]',
              textShadow: 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]',
              blushFill: '#6b6b6b',
              mouthStroke: '#d8d8d8',
            }
          : {
              pinGradient: 'bg-gradient-to-b from-[#ffffff] via-[#f5f5f5] to-[#8c8c8c]',
              pinBorder: 'border-white',
              pinDot: 'bg-white/70',
              ropeBase: '#dedede',
              ropeAccent: '#7d7d7d',
              ropeRingStroke: '#666666',
              starStroke: '#787878',
              starFill: '#f5f5f5',
              starSecondaryStroke: '#b0b0b0',
              starSecondaryFill: '#ffffff',
              cyberStarFill: '#787878',
              pixelHeartFill: '#8c8c8c',
              boardBg: 'bg-gradient-to-b from-[#ffffff] via-[#fafafa] to-[#f0f0f0]',
              boardBorder: 'border-[#dedede]',
              boardShadow: 'shadow-[0_2.5px_0_#cccccc,0_5px_14px_rgba(50,50,50,0.08)]',
              caroBg: '#ffffff',
              caroPatternColor: 'rgba(130, 130, 130, 0.18)',
              caroBorder: 'border-[#e5e5e5]',
              dashedBorder: 'border-[#b8b8b8]/65',
              nailBorder: 'border-[#b8b8b8]',
              textColor: 'text-[#2d2d2d]',
              textShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]',
              blushFill: '#b0b0b0',
              mouthStroke: '#383838',
            };

      case 'amethyst-haze':
      case 'cosmic':
      default:
        return isDarkEffective
          ? {
              pinGradient: 'bg-gradient-to-b from-[#ded5e7] via-[#82699a] to-[#281b37]',
              pinBorder: 'border-[#553f6a]',
              pinDot: 'bg-white/80',
              ropeBase: '#39264c',
              ropeAccent: '#82699a',
              ropeRingStroke: '#9d84b5',
              starStroke: '#9d84b5',
              starFill: '#1e1529',
              starSecondaryStroke: '#6d5483',
              starSecondaryFill: '#150f1d',
              cyberStarFill: '#82699a',
              pixelHeartFill: '#9d84b5',
              boardBg: 'bg-gradient-to-b from-[#241a33] via-[#1d142b] to-[#171022]',
              boardBorder: 'border-[#4e3c63]',
              boardShadow: 'shadow-[0_2.5px_0_#372948,0_5px_16px_rgba(0,0,0,0.45)]',
              caroBg: '#171022',
              caroPatternColor: 'rgba(167, 139, 250, 0.18)',
              caroBorder: 'border-[#332544]',
              dashedBorder: 'border-[#715c87]/60',
              nailBorder: 'border-[#715c87]',
              textColor: 'text-[#ded5e7]',
              textShadow: 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]',
              blushFill: '#82699a',
              mouthStroke: '#ded5e7',
            }
          : {
              pinGradient: 'bg-gradient-to-b from-[#ffffff] via-[#f3eef8] to-[#9d84b5]',
              pinBorder: 'border-white',
              pinDot: 'bg-white/70',
              ropeBase: '#dfd5ec',
              ropeAccent: '#9d84b5',
              ropeRingStroke: '#8b5cf6',
              starStroke: '#9d84b5',
              starFill: '#f3eef8',
              starSecondaryStroke: '#bdaecb',
              starSecondaryFill: '#ffffff',
              cyberStarFill: '#9d84b5',
              pixelHeartFill: '#9d84b5',
              boardBg: 'bg-gradient-to-b from-[#ffffff] via-[#faf7fc] to-[#f2ecf8]',
              boardBorder: 'border-[#ded5e7]',
              boardShadow: 'shadow-[0_2.5px_0_#d4c8df,0_5px_14px_rgba(107,33,168,0.08)]',
              caroBg: '#ffffff',
              caroPatternColor: 'rgba(147, 112, 180, 0.18)',
              caroBorder: 'border-[#e3dbe9]',
              dashedBorder: 'border-[#baa9cb]/60',
              nailBorder: 'border-[#baa9cb]',
              textColor: 'text-[#6b21a8]',
              textShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]',
              blushFill: '#bdaecb',
              mouthStroke: '#6b21a8',
            };
    }
  }, [theme, isDarkEffective]);

  return (
    <div className="flex items-center justify-center select-none">
      {/* ========================================================================= */}
      {/* BẢNG TREO DÂY THỪNG BỆN PASTEL: ĐUNG ĐƯA TỰ NHIÊN (TRANSFORM ORIGIN TOP)  */}
      {/* ========================================================================= */}
      <div className="relative inline-flex flex-col items-center group max-w-full">
        {/* KHUNG CONG TREO CÓ HIỆU ỨNG ĐUNG ĐƯA PENDULUM SWAY */}
        <motion.div
          animate={{
            rotate: [-1.6, 1.6, -1.6],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.8,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: 'top center' }}
          whileHover={{
            rotate: [-3, 3, -1.5, 1.5, 0],
            transition: { duration: 0.9, ease: 'easeOut' },
          }}
          whileTap={{
            scale: 0.96,
            transition: { duration: 0.15 },
          }}
          className="relative inline-flex flex-col items-center max-w-full pt-1"
        >
          {/* ===================================================================== */}
          {/* PHẦN DÂY THỪNG BỆN TAM GIÁC + ĐINH GHIM TRÒN CỐ ĐỊNH                 */}
          {/* ===================================================================== */}
          <div className="relative w-full h-5 sm:h-6 flex items-center justify-center pointer-events-none z-20">
            {/* Đinh ghim tròn treo ở trên cùng (điểm móc dây vào tường/trần) */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border shadow-xs z-30 ${themeColors.pinGradient} ${themeColors.pinBorder}`}
            >
              <span className={`absolute inset-0.5 rounded-full ${themeColors.pinDot}`} />
            </div>

            {/* Hai nhánh dây thừng bện hình tam giác rủ xuống 2 góc bảng */}
            <svg className="w-full h-full" viewBox="0 0 200 24" fill="none" preserveAspectRatio="none">
              {/* Dây thừng trái: lớp cốt màu cói be tự nhiên hợp theme + vân gạch bện màu hợp theme */}
              <path
                d="M100 3L35 24"
                stroke={themeColors.ropeBase}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="3 1.5"
              />
              <path
                d="M100 3L35 24"
                stroke={themeColors.ropeAccent}
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Dây thừng phải: lớp cốt màu cói be tự nhiên hợp theme + vân gạch bện màu hợp theme */}
              <path
                d="M100 3L165 24"
                stroke={themeColors.ropeBase}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="3 1.5"
              />
              <path
                d="M100 3L165 24"
                stroke={themeColors.ropeAccent}
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Khoen kim loại góc trái của bảng nối với dây thừng */}
              <circle cx="35" cy="23" r="3" fill="#ffffff" stroke={themeColors.ropeRingStroke} strokeWidth="1.4" />

              {/* Khoen kim loại góc phải của bảng nối với dây thừng */}
              <circle cx="165" cy="23" r="3" fill="#ffffff" stroke={themeColors.ropeRingStroke} strokeWidth="1.4" />
            </svg>
          </div>

          {/* ===================================================================== */}
          {/* TẤM BẢNG TREO CHÍNH (HANGING SIGNBOARD)                                */}
          {/* ===================================================================== */}
          <div className="relative inline-flex items-center">
            {/* CÁC NGÔI SAO LẤP LÁNH QUANH BẢNG TREO - Màu nhạt và trầm nhã */}
            {/* 1. Ngôi sao 5 cánh trên dải caro */}
            <motion.div
              animate={{ scale: [0.8, 1.25, 0.8], rotate: [0, 25, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="absolute -top-1 right-8 sm:right-10 pointer-events-none z-30 drop-shadow-xs"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill={themeColors.starSecondaryFill} stroke={themeColors.starStroke} strokeWidth="1.4">
                <path d="M12 2L15 9L22 9.5L17 14.5L18.5 22L12 18L5.5 22L7 14.5L2 9.5L9 9L12 2Z" />
              </svg>
            </motion.div>

            {/* 2. Sao 4 cánh Cyber nép góc trên phải */}
            <motion.div
              animate={{ scale: [0.75, 1.3, 0.75], rotate: [0, 45, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute top-2.5 right-2 sm:right-2.5 pointer-events-none z-30 drop-shadow-xs"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none">
                <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" fill={themeColors.cyberStarFill} />
                <circle cx="12" cy="12" r="2" fill="#ffffff" />
              </svg>
            </motion.div>

            {/* 3. Ngôi sao 5 cánh nép sườn trái */}
            <motion.div
              animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.55, 1, 0.55] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 0.4 }}
              className="absolute top-1/2 -translate-y-1/2 -left-1.5 pointer-events-none z-30 drop-shadow-xs"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill={themeColors.starFill} stroke={themeColors.starStroke} strokeWidth="1">
                <path d="M12 2L15 9L22 9.5L17 14.5L18.5 22L12 18L5.5 22L7 14.5L2 9.5L9 9L12 2Z" />
              </svg>
            </motion.div>

            {/* 4. Trái tim Pixel 8-bit nép góc dưới phải */}
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.49, 0.5, 0.99, 1], ease: 'linear' }}
              className="absolute -bottom-1 -right-1 pointer-events-none z-30 drop-shadow-xs"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill={themeColors.pixelHeartFill}>
                <rect x="2" y="2" width="4" height="2" />
                <rect x="10" y="2" width="4" height="2" />
                <rect x="0" y="4" width="8" height="4" />
                <rect x="8" y="4" width="8" height="4" />
                <rect x="2" y="8" width="12" height="2" />
                <rect x="4" y="10" width="8" height="2" />
                <rect x="6" y="12" width="4" height="2" />
                <rect x="7" y="14" width="2" height="1" />
              </svg>
            </motion.div>

            {/* 5. Ngôi sao 5 cánh nép đáy trái */}
            <motion.div
              animate={{ scale: [0.8, 1.15, 0.8], rotate: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.7 }}
              className="absolute -bottom-1 left-5 pointer-events-none z-30 drop-shadow-xs"
            >
              <svg className="w-2 h-2" viewBox="0 0 24 24" fill={themeColors.starSecondaryFill} stroke={themeColors.starSecondaryStroke} strokeWidth="1">
                <path d="M12 2L15 9L22 9.5L17 14.5L18.5 22L12 18L5.5 22L7 14.5L2 9.5L9 9L12 2Z" />
              </svg>
            </motion.div>

            {/* THÂN BẢNG TREO BẰNG GỖ PASTEL ĐỔI MÀU HỢP THEME */}
            <div
              id="btn-intro-about-website"
              onClick={() => {
                if (!isStatic && onOpen) {
                  cosmicAudio.playChime('sparkle');
                  onOpen();
                }
              }}
              role={isStatic ? 'img' : 'button'}
              aria-label={label || '© 2026 Niên Thời - Jouriee65'}
              className={`relative flex flex-col items-center justify-center px-4 xs:px-4.5 sm:px-5 pt-2 pb-2 ${
                isStatic ? 'cursor-default select-none' : 'cursor-pointer'
              } overflow-hidden transition-all duration-300 rounded-xl sm:rounded-2xl border-[1.5px] ${themeColors.boardBorder} ${themeColors.boardBg} ${themeColors.boardShadow}`}
              title={label || "© 2026 Niên Thời - Jouriee65"}
            >
              {/* DÃY HỌA TIẾT CARO (GINGHAM PATTERN) SÁT MÉP TRÊN BẢNG */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 sm:h-2 pointer-events-none z-15 border-b shadow-xs ${themeColors.caroBorder}`}
                style={{
                  backgroundColor: themeColors.caroBg,
                  backgroundImage: `
                    linear-gradient(90deg, ${themeColors.caroPatternColor} 50%, transparent 50%),
                    linear-gradient(${themeColors.caroPatternColor} 50%, transparent 50%)
                  `,
                  backgroundSize: '6px 6px',
                  opacity: 0.95,
                }}
              />

              {/* ĐƯỜNG CHỈ MAY VIỀN BẢNG GỖ PASTEL NÉT ĐỨT TINH XẢO */}
              <span className={`absolute inset-[2.5px] rounded-lg sm:rounded-xl border border-dashed pointer-events-none z-15 ${themeColors.dashedBorder}`} />

              {/* HAI ĐINH GỖ / KHOEN TREO Ở HAI GÓC TRÊN CỦA BẢNG */}
              <span className={`absolute top-2 left-2.5 w-1.5 h-1.5 rounded-full bg-white border shadow-xs pointer-events-none z-20 ${themeColors.nailBorder}`} />
              <span className={`absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-white border shadow-xs pointer-events-none z-20 ${themeColors.nailBorder}`} />

              {/* DÒNG CHỮ CHÍNH: NẰM TRỌN TRÊN 1 DÒNG DUY NHẤT ĐIỆN THOẠI, ĐỔI MÀU CHỮ HỢP THEME */}
              <span
                style={{ fontFamily: "'Baloo 2', 'Comfortaa', cursive, sans-serif" }}
                className={`font-signboard-cute font-extrabold text-[9px] xs:text-[10px] sm:text-[11px] tracking-[0.05em] sm:tracking-[0.07em] ${themeColors.textColor} ${themeColors.textShadow} select-none whitespace-nowrap leading-none relative z-20 mt-1`}
              >
                {label || '© 2026 Niên Thời - Jouriee65'}
              </span>

              {/* CHIẾC MIỆNG CƯỜI CHÚM CHÍM CHỮ W & 2 MÁ HỒNG PASTEL TRẦM DỊU */}
              <div className="flex items-center justify-center relative z-20 mt-0.5 leading-none">
                <svg className="w-6 sm:w-6.5 h-2 sm:h-2.5" viewBox="0 0 32 10" fill="none">
                  {/* Má hồng pastel ngọt ngào dịu mắt */}
                  <circle cx="7" cy="5" r="2" fill={themeColors.blushFill} fillOpacity="0.75" />
                  {/* Chiếc miệng cười chúm chím dễ thương hình chữ w */}
                  <path
                    d="M12.5 4.8C13.5 6.5 14.8 6.5 16 5C17.2 6.5 18.5 6.5 19.5 4.8"
                    stroke={themeColors.mouthStroke}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  {/* Má hồng pastel ngọt ngào dịu mắt */}
                  <circle cx="25" cy="5" r="2" fill={themeColors.blushFill} fillOpacity="0.75" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// =========================================================================
// NÚT GIỚI THIỆU VỀ TRANG WEB PHONG CÁCH CŨ (CLASSIC STYLE - BẢN GỐC KHÔI PHỤC)
// Nút dạng viên thuốc bo tròn (pill), viền gradient mềm mại, phông chữ Lexend Deca,
// hiệu ứng quầng sáng chuyển động (animate-halo-cushion), viền chuyển màu động (animate-gradient-flow),
// vệt sáng lướt ngang (animate-shimmer-sweep) và radar phát xung mượt mà (animate-ping-smooth).
// =========================================================================
export interface ClassicIntroAboutButtonProps {
  onOpen: () => void;
  introButtonStyles?: any;
  className?: string;
}

export const ClassicIntroAboutButton: React.FC<ClassicIntroAboutButtonProps> = ({
  onOpen,
  introButtonStyles,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center group select-none transition-transform duration-200 hover:scale-[1.025] active:scale-[0.97] ${className}`}>
      {/* 1. Nền quầng sáng chuyển động (Motion Halo Cushion Pulse) phía sau nút */}
      {introButtonStyles?.haloCushion && (
        <div
          className={`absolute -inset-1.5 rounded-full blur-md opacity-60 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none animate-halo-cushion ${introButtonStyles.haloCushion}`}
        />
      )}

      {/* 2. Viền gradient chuyển tiếp động (Animated Gradient Flow Border) bên ngoài */}
      <div
        className={`relative p-[1.5px] rounded-full transition-all duration-300 animate-gradient-flow ${
          introButtonStyles?.borderGradient || 'bg-transparent'
        } ${introButtonStyles?.borderShadow || ''}`}
      >
        <button
          id="btn-intro-about-website"
          onClick={() => {
            cosmicAudio.playChime('sparkle');
            onOpen();
          }}
          style={
            introButtonStyles?.btnBg
              ? { backgroundColor: introButtonStyles.btnBg }
              : undefined
          }
          className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full cursor-pointer transition-all duration-300 overflow-hidden ${
            introButtonStyles?.btnGradient || ''
          } ${introButtonStyles?.btnGlow || ''} ${
            introButtonStyles?.innerShadow || ''
          }`}
          title="Khám phá giới thiệu về trang web - Dư Thủ Ký"
        >
          {/* 3. Hiệu ứng Vệt sáng lướt ngang (Soft Shimmer Sweep Effect) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-full z-10">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/25 to-transparent animate-shimmer-sweep" />
          </div>

          {/* 4. Chấm tròn phát tín hiệu radar mượt mà (Smooth Pulsing Radar Ping Dot) */}
          <span className="relative flex h-2 w-2 shrink-0 z-20">
            <span
              className={`animate-ping-smooth absolute inline-flex h-full w-full rounded-full opacity-80 ${
                introButtonStyles?.dotPing || 'bg-white/80'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                introButtonStyles?.dotColor || 'bg-white'
              }`}
            />
          </span>

          {/* 5. Dòng chữ: GIỚI THIỆU VỀ TRANG WEB với phông chữ Lexend Deca thanh lịch chuẩn thiết kế */}
          <span
            style={{ fontFamily: "'Lexend Deca', sans-serif" }}
            className={`font-lexend font-bold text-xs sm:text-sm tracking-[0.06em] uppercase whitespace-nowrap select-none drop-shadow-xs relative z-20 ${
              introButtonStyles?.textColor || 'text-white'
            }`}
          >
            GIỚI THIỆU VỀ TRANG WEB
          </span>
        </button>
      </div>
    </div>
  );
};
