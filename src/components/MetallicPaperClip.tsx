import React from 'react';

export interface MetallicPaperClipProps {
  isDarkMode?: boolean;
  themeId?: string;
  className?: string;
}

/**
 * Chiếc ghim Paper Clip kim loại tinh xảo
 * Đặt ở góc trên bên phải khung Quotations, kẹp nhẹ qua mép viền.
 * Ánh kim loại chrome / bạc sáng bóng nhạt, thanh thoát và không bị quá đậm.
 */
export const MetallicPaperClip: React.FC<MetallicPaperClipProps> = ({
  isDarkMode = false,
  themeId = 'slate-haze',
  className = '',
}) => {
  // Xác định màu sắc kim loại chrome / bạc sáng bóng nhạt, thanh nhã
  const getClipColors = () => {
    if (!isDarkMode) {
      // CHẾ ĐỘ SÁNG: Chrome / Bạc sáng bóng nhạt thanh thoát
      switch (themeId) {
        case 'mocha': // Linen: ánh bạc sáng pha vàng kim champagne rất nhạt
          return {
            gradientId: 'clip-grad-linen-light',
            stops: [
              { offset: '0%', color: '#ffffff' },
              { offset: '25%', color: '#fcfaf6' },
              { offset: '55%', color: '#e8ded2' },
              { offset: '75%', color: '#ffffff' },
              { offset: '100%', color: '#ded4c6' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.08)',
            dropShadow: 'drop-shadow(0.5px 1.5px 1.5px rgba(160, 140, 120, 0.18))',
          };
        case 'sage': // Sage: ánh bạc sáng pha ngọc bích sương mờ rất nhạt
          return {
            gradientId: 'clip-grad-sage-light',
            stops: [
              { offset: '0%', color: '#ffffff' },
              { offset: '25%', color: '#f6faf7' },
              { offset: '55%', color: '#d9e9dc' },
              { offset: '75%', color: '#ffffff' },
              { offset: '100%', color: '#cedfd2' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.08)',
            dropShadow: 'drop-shadow(0.5px 1.5px 1.5px rgba(100, 130, 110, 0.16))',
          };
        case 'amethyst-haze': // Purple: ánh bạc sáng pha thạch anh rất nhạt
          return {
            gradientId: 'clip-grad-purple-light',
            stops: [
              { offset: '0%', color: '#ffffff' },
              { offset: '25%', color: '#fbf8fe' },
              { offset: '55%', color: '#e7ddf3' },
              { offset: '75%', color: '#ffffff' },
              { offset: '100%', color: '#ddd2ec' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.08)',
            dropShadow: 'drop-shadow(0.5px 1.5px 1.5px rgba(120, 100, 145, 0.16))',
          };
        case 'slate-haze':
        case 'notebook':
        default: // Frost / White: Chrome thép sáng bạc thuần khiết, siêu nhạt và bóng
          return {
            gradientId: 'clip-grad-silver-light',
            stops: [
              { offset: '0%', color: '#ffffff' },
              { offset: '25%', color: '#f8fafc' },
              { offset: '55%', color: '#e2e8f0' },
              { offset: '75%', color: '#ffffff' },
              { offset: '100%', color: '#cbd5e1' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.08)',
            dropShadow: 'drop-shadow(0.5px 1.5px 1.5px rgba(80, 100, 120, 0.16))',
          };
      }
    } else {
      // CHẾ ĐỘ TỐI: Chrome / Bạc bạch kim sáng bóng nhạt, phản chiếu tinh tế
      return {
        gradientId: 'clip-grad-silver-dark',
        stops: [
          { offset: '0%', color: '#ffffff' },
          { offset: '20%', color: '#f1f5f9' },
          { offset: '50%', color: '#cbd5e1' },
          { offset: '75%', color: '#ffffff' },
          { offset: '100%', color: '#94a3b8' },
        ],
        strokeShadow: 'rgba(0, 0, 0, 0.25)',
        dropShadow: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.35)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.35))',
      };
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

        {/* Đổ bóng mảnh nhẹ của sợi dây kim loại xuống mặt giấy */}
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
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0.6, 1)"
        />

        {/* Sợi dây kim loại chính với gradient chrome/bạc sáng bóng nhạt */}
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
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Vệt phản chiếu ánh sáng (Specular Highlight) siêu mảnh trên đỉnh uốn cong */}
        <path
          d="M 10 5.2 C 13.5 4.3, 17.5 4.6, 18.5 7.8"
          stroke="rgba(255, 255, 255, 0.95)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
