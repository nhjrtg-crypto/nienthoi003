import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getBinderTheme } from '../utils/binderThemeConfig';

export interface NovelSimple {
  id: string;
  title: string;
}

interface NovelAwningHeaderProps {
  novel: NovelSimple;
  allNovels?: NovelSimple[];
  onSelectNovel?: (novel: NovelSimple) => void;
  onBack: () => void;
  onReadChapter?: (chapterNumber: number) => void;
  isDarkMode?: boolean;
  theme?: string;
}

export const NovelAwningHeader: React.FC<NovelAwningHeaderProps> = ({
  novel,
  allNovels = [],
  onSelectNovel,
  onBack,
  onReadChapter,
  isDarkMode = false,
  theme = 'slate-haze',
}) => {
  const bTheme = useMemo(() => getBinderTheme(theme), [theme]);

  const currentIndex = useMemo(() => {
    if (!allNovels || allNovels.length === 0) return -1;
    return allNovels.findIndex((n) => n.id === novel.id);
  }, [allNovels, novel.id]);

  const prevNovel = useMemo(() => {
    if (!allNovels || allNovels.length <= 1) return null;
    return currentIndex > 0 ? allNovels[currentIndex - 1] : allNovels[allNovels.length - 1];
  }, [allNovels, currentIndex]);

  const nextNovel = useMemo(() => {
    if (!allNovels || allNovels.length <= 1) return null;
    return currentIndex >= 0 && currentIndex < allNovels.length - 1
      ? allNovels[currentIndex + 1]
      : allNovels[0];
  }, [allNovels, currentIndex]);

  const handlePrev = () => {
    if (prevNovel && onSelectNovel) onSelectNovel(prevNovel);
    else onBack();
  };

  const handleNext = () => {
    if (nextNovel && onSelectNovel) onSelectNovel(nextNovel);
    else if (onReadChapter) onReadChapter(1);
  };

  // Gradient IDs unique per theme
  const colorGradId = `paper-awning-color-${theme}`;
  const creamGradId = `paper-awning-cream-${theme}`;

  return (
    <div className="relative w-full max-w-full overflow-hidden select-none z-20 pt-0 mb-6 sm:mb-8">
      {/* 0. ĐỔ MÀU PHỦ KÍN KHOẢNG TRỐNG PHÍA TRÊN MÁI VÒM THEO TỪNG THEME */}
      <div
        className="w-full min-w-full h-3 sm:h-5 -mt-2 sm:-mt-3"
        style={{
          background: bTheme.awningTopBarBg,
          borderBottom: bTheme.awningTopBarBorder,
        }}
      />

      {/* 1. MÁI HIÊN RÈM REN LƯỢN SÓNG SO LE SUGAR LOVE - TRẢI DÀI TỐI ĐA HẾT CHIỀU RỘNG TRANG WEB */}
      <div className="relative w-full min-w-full h-[58px] sm:h-[70px] overflow-visible">
        <svg
          className="w-full min-w-full h-full block"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 74"
          style={{
            filter: 'drop-shadow(0 8px 18px rgba(0, 0, 0, 0.07))',
          }}
        >
          <defs>
            <linearGradient id={colorGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={bTheme.awningStripeColorGradient.stop0} />
              <stop offset="25%" stopColor={bTheme.awningStripeColorGradient.stop25} />
              <stop offset="65%" stopColor={bTheme.awningStripeColorGradient.stop65} />
              <stop offset="100%" stopColor={bTheme.awningStripeColorGradient.stop100} />
            </linearGradient>

            <linearGradient id={creamGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={bTheme.awningStripeCreamGradient.stop0} />
              <stop offset="45%" stopColor={bTheme.awningStripeCreamGradient.stop45} />
              <stop offset="80%" stopColor={bTheme.awningStripeCreamGradient.stop80} />
              <stop offset="100%" stopColor={bTheme.awningStripeCreamGradient.stop100} />
            </linearGradient>
          </defs>

          {/* Dãy 16 múi vòm lượn sóng trải dài toàn trang */}
          <g>
            {Array.from({ length: 16 }).map((_, idx) => {
              const w = 75;
              const x = idx * w;
              const midX = x + w / 2;
              const rightX = x + w;
              const bottomY = 62;
              const shoulderY = bottomY - 26;
              const isColorStripe = idx % 2 === 0;

              return (
                <g key={idx}>
                  <path
                    d={`M ${x} 0 L ${rightX} 0 L ${rightX} ${shoulderY} Q ${rightX} ${bottomY} ${midX} ${bottomY} Q ${x} ${bottomY} ${x} ${shoulderY} Z`}
                    fill={isColorStripe ? `url(#${colorGradId})` : `url(#${creamGradId})`}
                    stroke="rgba(255, 255, 255, 0.95)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d={`M ${x + 3} 0 L ${x + 8} 0 L ${x + 8} ${shoulderY - 2} Q ${x + 8} ${bottomY - 4} ${midX} ${bottomY - 4} Q ${x + 6} ${bottomY - 4} ${x + 3} ${shoulderY - 2} Z`}
                    fill="#ffffff"
                    opacity={isColorStripe ? 0.45 : 0.7}
                  />
                </g>
              );
            })}
          </g>

          <rect x="0" y="0" width="1200" height="12" fill="#ffffff" opacity="0.9" />
          <line x1="0" y1="10" x2="1200" y2="10" stroke={bTheme.awningBottomLine} strokeWidth="1.2" opacity="0.75" />
        </svg>
      </div>

      {/* 2. DÂY QUAI TREO & BẢNG TÊN TRUYỆN DẠNG VIÊN THUỐC PHÔNG BALOO 2 */}
      <div className="relative max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 -mt-1.5 sm:-mt-2 pb-9 sm:pb-12 overflow-visible">
        <div className="relative w-full flex justify-between px-10 sm:px-14 pointer-events-none z-20 -mb-3 sm:-mb-3.5">
          {[0, 1].map((i) => (
            <div key={i} className="relative flex flex-col items-center">
              <div
                className="w-3 sm:w-3.5 h-8 sm:h-9.5 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.12),inset_0_1px_1px_#ffffff] border border-white/90"
                style={{
                  background: bTheme.signboardRibbonHanger,
                }}
              />
              <div
                className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 -mt-2.5 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.12)] flex items-center justify-center"
                style={{ backgroundColor: bTheme.signboardRibbonDotBg }}
              >
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Tấm biển hiệu dạng viên thuốc */}
        <div
          className="relative rounded-full py-2 sm:py-2.5 px-3.5 sm:px-4 flex items-center justify-between border-2 transition-all duration-300 z-20 overflow-visible"
          style={{
            background: bTheme.signboardBg,
            boxShadow: bTheme.signboardBoxShadow,
            borderColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <button
            onClick={handlePrev}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:scale-105 ${bTheme.signboardBtnText}`}
            style={bTheme.signboardBtnStyle}
            title="Truyện trước / Quay lại"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.8]" />
          </button>

          <div className="flex-1 min-w-0 mx-2 sm:mx-3 flex flex-col items-center justify-center text-center">
            <span className={`text-[10px] sm:text-[11px] font-baloo font-bold tracking-widest uppercase ${bTheme.signboardSubText}`}>
              Information
            </span>
            <div className="mt-0.5 flex items-center justify-center max-w-full">
              <span
                className={`font-baloo font-extrabold text-[16px] sm:text-[19px] md:text-[21px] leading-tight truncate ${bTheme.signboardTitleText} tracking-wide`}
                style={{
                  fontFamily: "'Baloo 2', cursive, sans-serif",
                  textShadow: bTheme.signboardTextShadow,
                }}
              >
                {novel.title}
              </span>
            </div>
          </div>

          <button
            onClick={handleNext}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:scale-105 ${bTheme.signboardBtnText}`}
            style={bTheme.signboardBtnStyle}
            title="Truyện tiếp theo / Bắt đầu đọc"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.8]" />
          </button>
        </div>
      </div>
    </div>
  );
};

