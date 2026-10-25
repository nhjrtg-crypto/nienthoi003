import React from 'react';

export interface MetallicPaperClipProps {
  isDarkMode?: boolean;
  themeId?: string;
  className?: string;
}

/**
 * Chiếc ghim Paper Clip kim loại tinh xảo
 * Đặt ở góc trên bên phải khung Quotations, kẹp nhẹ qua mép viền.
 * Chế độ sáng: Ánh kim loại chrome / bạc sáng bóng với độ đậm vừa vặn, sắc nét và có chiều sâu.
 * Chế độ tối: Ánh bạch kim dạ quang phản chiếu ánh sáng đêm thanh thoát.
 */
export const MetallicPaperClip: React.FC<MetallicPaperClipProps> = ({
  isDarkMode = false,
  themeId = 'slate-haze',
  className = '',
}) => {
  const getClipColors = () => {
    if (!isDarkMode) {
      // CHẾ ĐỘ SÁNG: Màu kim loại chrome / bạc đậm hơn vừa phải, rõ nét, có chiều sâu
      switch (themeId) {
        case 'mocha': // Linen: ánh bạc pha vàng kim champagne ấm áp, độ đậm vừa vặn
          return {
            gradientId: 'clip-grad-linen-light',
            stops: [
              { offset: '0%', color: '#ffffff' },
              { offset: '20%', color: '#f5efe6' },
              { offset: '45%', color: '#d6c7b2' },
              { offset: '70%', color: '#a8937d' },
              { offset: '85%', color: '#faf6f0' },
              { offset: '100%', color: '#baa895' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.16)',
            dropShadow: 'drop-shadow(0.8px 1.8px 2px rgba(130, 110, 90, 0.22))',
          };
        case 'sage': // Sage: ánh bạc ngọc bích sắc nét vừa phải
          return {
            gradientId: 'clip-grad-sage-light',
            stops: [
              { offset: '0%', color: '#ffffff' },
              { offset: '20%', color: '#eef6f0' },
              { offset: '45%', color: '#c5decb' },
              { offset: '70%', color: '#82a88a' },
              { offset: '85%', color: '#f4faf5' },
              { offset: '100%', color: '#9dbfa3' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.16)',
            dropShadow: 'drop-shadow(0.8px 1.8px 2px rgba(70, 100, 80, 0.22))',
          };
        case 'amethyst-haze': // Purple: ánh bạc pha thạch anh sắc nét vừa phải
          return {
            gradientId: 'clip-grad-purple-light',
            stops: [
              { offset: '0%', color: '#ffffff' },
              { offset: '20%', color: '#f5f0fa' },
              { offset: '45%', color: '#d5c2e8' },
              { offset: '70%', color: '#987bb5' },
              { offset: '85%', color: '#faf6fd' },
              { offset: '100%', color: '#b19ac7' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.16)',
            dropShadow: 'drop-shadow(0.8px 1.8px 2px rgba(90, 70, 115, 0.22))',
          };
        case 'slate-haze':
        case 'notebook':
        default: // Frost / White: Chrome thép sáng bóng, rõ nét kim loại, không quá nhạt cũng không quá đậm
          return {
            gradientId: 'clip-grad-silver-light',
            stops: [
              { offset: '0%', color: '#ffffff' },
              { offset: '20%', color: '#f1f5f9' },
              { offset: '45%', color: '#cbd5e1' },
              { offset: '70%', color: '#94a3b8' },
              { offset: '85%', color: '#f8fafc' },
              { offset: '100%', color: '#a1a1aa' },
            ],
            strokeShadow: 'rgba(0, 0, 0, 0.16)',
            dropShadow: 'drop-shadow(0.8px 1.8px 2px rgba(70, 80, 95, 0.22))',
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

        {/* Sợi dây kim loại chính với gradient chrome/bạc sắc nét vừa phải */}
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

        {/* Vệt phản chiếu ánh sáng (Specular Highlight) trên đỉnh uốn cong */}
        <path
          d="M 10 5.2 C 13.5 4.3, 17.5 4.6, 18.5 7.8"
          stroke="rgba(255, 255, 255, 0.95)"
          strokeWidth="1.0"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
