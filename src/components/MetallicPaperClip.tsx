import React from 'react';

export interface MetallicPaperClipProps {
  isDarkMode?: boolean;
  themeId?: string;
  className?: string;
}

/**
 * Chiếc ghim Paper Clip mang màu sắc theme nhẹ nhàng, không phản quang chói lóa.
 * Đặt ở góc trên bên phải khung Quotations, kẹp nhẹ qua mép viền.
 */
export const MetallicPaperClip: React.FC<MetallicPaperClipProps> = ({
  isDarkMode = false,
  themeId = 'slate-haze',
  className = '',
}) => {
  const getClipColors = () => {
    if (!isDarkMode) {
      // CHẾ ĐỘ SÁNG: Màu sắc theme nhẹ nhàng, êm dịu, không phản quang
      switch (themeId) {
        case 'mocha': // Linen: Tone be ấm áp, dịu dàng
          return {
            gradientId: 'clip-grad-linen-light',
            stops: [
              { offset: '0%', color: '#ded3c8' },
              { offset: '40%', color: '#c5b5a7' },
              { offset: '75%', color: '#b09e8f' },
              { offset: '100%', color: '#9e8b7d' },
            ],
            strokeShadow: 'rgba(140, 120, 105, 0.18)',
            dropShadow: 'drop-shadow(0.5px 1.5px 1.5px rgba(130, 110, 95, 0.18))',
          };
        case 'sage': // Sage: Tone xanh xô thơm pastel êm mắt
          return {
            gradientId: 'clip-grad-sage-light',
            stops: [
              { offset: '0%', color: '#cde0d2' },
              { offset: '40%', color: '#a6c5ad' },
              { offset: '75%', color: '#88ab90' },
              { offset: '100%', color: '#73987b' },
            ],
            strokeShadow: 'rgba(100, 130, 110, 0.18)',
            dropShadow: 'drop-shadow(0.5px 1.5px 1.5px rgba(85, 115, 95, 0.18))',
          };
        case 'amethyst-haze': // Purple: Tone tím lavender / tử đinh hương mềm mại
          return {
            gradientId: 'clip-grad-purple-light',
            stops: [
              { offset: '0%', color: '#dad0eb' },
              { offset: '40%', color: '#bcaed3' },
              { offset: '75%', color: '#9e8eb9' },
              { offset: '100%', color: '#8878a3' },
            ],
            strokeShadow: 'rgba(120, 105, 140, 0.18)',
            dropShadow: 'drop-shadow(0.5px 1.5px 1.5px rgba(110, 95, 130, 0.18))',
          };
        case 'notebook': // White: Tone xám bạc mờ thanh nhã
          return {
            gradientId: 'clip-grad-white-light',
            stops: [
              { offset: '0%', color: '#e4e4e7' },
              { offset: '40%', color: '#c4c4c9' },
              { offset: '75%', color: '#a1a1aa' },
              { offset: '100%', color: '#8b8b93' },
            ],
            strokeShadow: 'rgba(90, 90, 95, 0.18)',
            dropShadow: 'drop-shadow(0.5px 1.5px 1.5px rgba(90, 90, 95, 0.18))',
          };
        case 'slate-haze':
        default: // Frost: Tone xanh lam sương mờ pastel
          return {
            gradientId: 'clip-grad-frost-light',
            stops: [
              { offset: '0%', color: '#d0dceb' },
              { offset: '40%', color: '#adc2d8' },
              { offset: '75%', color: '#8da4be' },
              { offset: '100%', color: '#758fa9' },
            ],
            strokeShadow: 'rgba(90, 110, 130, 0.18)',
            dropShadow: 'drop-shadow(0.5px 1.5px 1.5px rgba(80, 100, 120, 0.18))',
          };
      }
    } else {
      // CHẾ ĐỘ TỐI: Màu sắc theme nhẹ nhàng, không phản quang, không lóe sáng
      switch (themeId) {
        case 'mocha': // Linen tối: Mộc mạc, ấm áp, nhã nhặn
          return {
            gradientId: 'clip-grad-linen-dark',
            stops: [
              { offset: '0%', color: '#b5a495' },
              { offset: '45%', color: '#9b8878' },
              { offset: '100%', color: '#7c6a5b' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.3)',
            dropShadow: 'drop-shadow(0.5px 1.5px 2px rgba(0, 0, 0, 0.35))',
          };
        case 'sage': // Sage tối: Xanh sage mờ thanh tao
          return {
            gradientId: 'clip-grad-sage-dark',
            stops: [
              { offset: '0%', color: '#8eab94' },
              { offset: '45%', color: '#73917a' },
              { offset: '100%', color: '#597460' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.3)',
            dropShadow: 'drop-shadow(0.5px 1.5px 2px rgba(0, 0, 0, 0.35))',
          };
        case 'amethyst-haze': // Purple tối: Tím nhạt trầm lắng, êm dịu
          return {
            gradientId: 'clip-grad-purple-dark',
            stops: [
              { offset: '0%', color: '#a18fb9' },
              { offset: '45%', color: '#87749f' },
              { offset: '100%', color: '#6d5a84' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.3)',
            dropShadow: 'drop-shadow(0.5px 1.5px 2px rgba(0, 0, 0, 0.35))',
          };
        case 'notebook': // White tối: Xám chì nhạt mờ
          return {
            gradientId: 'clip-grad-white-dark',
            stops: [
              { offset: '0%', color: '#9a9aa1' },
              { offset: '45%', color: '#7c7c83' },
              { offset: '100%', color: '#626268' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.3)',
            dropShadow: 'drop-shadow(0.5px 1.5px 2px rgba(0, 0, 0, 0.35))',
          };
        case 'slate-haze':
        default: // Frost tối: Xanh xám băng mờ nhẹ
          return {
            gradientId: 'clip-grad-frost-dark',
            stops: [
              { offset: '0%', color: '#8fa4bc' },
              { offset: '45%', color: '#738aa3' },
              { offset: '100%', color: '#596f87' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.3)',
            dropShadow: 'drop-shadow(0.5px 1.5px 2px rgba(0, 0, 0, 0.35))',
          };
      }
    }
  };

  const clip = getClipColors();

  return (
    <div
      className={`select-none pointer-events-none ${className}`}
      style={{ filter: clip.dropShadow }}
      title="Paperclip"
    >
      <svg
        viewBox="0 0 24 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 xs:w-4.5 sm:w-5.5 h-8 xs:h-9 sm:h-11 overflow-visible"
      >
        <defs>
          <linearGradient
            id={clip.gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            {clip.stops.map((s, idx) => (
              <stop key={idx} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>

        {/* Đổ bóng tự nhiên của sợi dây kim loại xuống mặt giấy */}
        <path
          d="M 16 14
             L 16 36
             C 16 41, 8 41, 8 36
             L 8 10
             C 8 4, 20 4, 20 10
             L 20 40
             C 20 47, 4 47, 4 40
             L 4 18"
          stroke={clip.strokeShadow}
          strokeWidth="2.0"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0.7, 1.2)"
        />

        {/* Sợi dây kẹp giấy mang màu sắc theme nhẹ nhàng, không phản quang */}
        <path
          d="M 16 14
             L 16 36
             C 16 41, 8 41, 8 36
             L 8 10
             C 8 4, 20 4, 20 10
             L 20 40
             C 20 47, 4 47, 4 40
             L 4 18"
          stroke={`url(#${clip.gradientId})`}
          strokeWidth="2.0"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
