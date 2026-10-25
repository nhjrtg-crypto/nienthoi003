import React from 'react';

export interface DiagonalStripedWashiTapeProps {
  isDarkMode?: boolean;
  themeId?: string;
  className?: string;
}

/**
 * Dải băng keo họa tiết đường kẻ sọc chéo (Diagonal Striped Washi Tape)
 * Thiết kế nằm tách rời phía trên khung Quotations.
 * Độ rộng đường kẻ vừa phải (6px/12px lặp), đổi màu phù hợp cho chế độ sáng & tối của cả 5 theme.
 */
export const DiagonalStripedWashiTape: React.FC<DiagonalStripedWashiTapeProps> = ({
  isDarkMode = false,
  themeId = 'slate-haze',
  className = '',
}) => {
  // Xác định màu sắc đường kẻ sọc chéo theo từng theme & chế độ sáng/tối
  const getTapeStyle = () => {
    if (!isDarkMode) {
      // CHẾ ĐỘ SÁNG (LIGHT MODE)
      switch (themeId) {
        case 'amethyst-haze':
          return {
            stripe1: 'rgba(233, 213, 255, 0.85)', // lavender-200
            stripe2: 'rgba(250, 245, 255, 0.95)',
            border: 'rgba(192, 132, 252, 0.4)',
            shadow: '0 2px 5px rgba(168, 85, 247, 0.18)',
          };
        case 'sage':
          return {
            stripe1: 'rgba(209, 250, 229, 0.85)', // emerald-100
            stripe2: 'rgba(244, 253, 247, 0.95)',
            border: 'rgba(110, 231, 183, 0.45)',
            shadow: '0 2px 5px rgba(16, 185, 129, 0.16)',
          };
        case 'mocha': // Linen: tone vàng trầm nhẹ nhàng
          return {
            stripe1: 'rgba(243, 233, 218, 0.9)', // vàng trầm linen dịu nhẹ
            stripe2: 'rgba(255, 252, 248, 0.98)',
            border: 'rgba(220, 203, 180, 0.5)',
            shadow: '0 2px 5px rgba(200, 180, 150, 0.18)',
          };
        case 'notebook':
          return {
            stripe1: 'rgba(226, 232, 240, 0.85)', // slate-200
            stripe2: 'rgba(255, 255, 255, 0.95)',
            border: 'rgba(203, 213, 225, 0.5)',
            shadow: '0 2px 5px rgba(148, 163, 184, 0.16)',
          };
        case 'slate-haze':
        default:
          return {
            stripe1: 'rgba(186, 230, 253, 0.85)', // sky-200 tuyết trắng
            stripe2: 'rgba(255, 255, 255, 0.95)',
            border: 'rgba(125, 211, 252, 0.45)',
            shadow: '0 2px 5px rgba(14, 165, 233, 0.18)',
          };
      }
    } else {
      // CHẾ ĐỘ TỐI (DARK MODE)
      switch (themeId) {
        case 'amethyst-haze':
          return {
            stripe1: 'rgba(168, 85, 247, 0.35)',
            stripe2: 'rgba(25, 10, 38, 0.75)',
            border: 'rgba(192, 132, 252, 0.35)',
            shadow: '0 2px 8px rgba(168, 85, 247, 0.22)',
          };
        case 'sage':
          return {
            stripe1: 'rgba(52, 211, 153, 0.35)',
            stripe2: 'rgba(6, 35, 22, 0.75)',
            border: 'rgba(52, 211, 153, 0.35)',
            shadow: '0 2px 8px rgba(52, 211, 153, 0.22)',
          };
        case 'mocha':
          return {
            stripe1: 'rgba(245, 158, 11, 0.32)',
            stripe2: 'rgba(40, 22, 8, 0.75)',
            border: 'rgba(251, 191, 36, 0.35)',
            shadow: '0 2px 8px rgba(245, 158, 11, 0.22)',
          };
        case 'notebook':
          return {
            stripe1: 'rgba(148, 163, 184, 0.35)',
            stripe2: 'rgba(20, 28, 42, 0.75)',
            border: 'rgba(203, 213, 225, 0.35)',
            shadow: '0 2px 8px rgba(148, 163, 184, 0.2)',
          };
        case 'slate-haze':
        default:
          return {
            stripe1: 'rgba(56, 189, 248, 0.35)', // xanh băng phát quang
            stripe2: 'rgba(8, 20, 36, 0.75)',
            border: 'rgba(56, 189, 248, 0.35)',
            shadow: '0 2px 8px rgba(56, 189, 248, 0.22)',
          };
      }
    }
  };

  const styleConfig = getTapeStyle();

  return (
    <div
      className={`relative select-none pointer-events-none flex items-center justify-center ${className}`}
      title="Washi Tape"
    >
      {/* Thân dải băng keo với họa tiết sọc chéo lặp 6px / 12px */}
      <div
        className="w-24 xs:w-28 sm:w-36 md:w-44 h-3 sm:h-3.5 md:h-4 rounded-xs sm:rounded-sm transition-all duration-300 -rotate-1"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            ${styleConfig.stripe1},
            ${styleConfig.stripe1} 6px,
            ${styleConfig.stripe2} 6px,
            ${styleConfig.stripe2} 12px
          )`,
          border: `1px solid ${styleConfig.border}`,
          boxShadow: styleConfig.shadow,
          backdropFilter: 'blur(3px)',
        }}
      >
        {/* Vệt bóng kính mờ nhẹ phản chiếu trên bề mặt băng keo */}
        <div
          className="w-full h-1/2 opacity-40 rounded-t-xs"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
          }}
        />
      </div>
    </div>
  );
};
