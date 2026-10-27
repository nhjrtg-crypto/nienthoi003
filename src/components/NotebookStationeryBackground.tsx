import React from 'react';

export interface NotebookStationeryBackgroundProps {
  theme?: string;
  isDark?: boolean;
}

interface StationeryThemeColors {
  bgBase: string;
  stripeColor: string;
  stripeAccent: string;
  lineColor: string;
  starColor: string;
  ginghamColor: string;
  ginghamDark: string;
}

const getStationeryColors = (theme: string): StationeryThemeColors => {
  switch (theme) {
    case 'slate-haze':
      // Theme Frost: Sắc xanh sương tuyết thanh lịch
      return {
        bgBase: '#f4f9fd',
        stripeColor: 'rgba(2, 132, 199, 0.12)',
        stripeAccent: 'rgba(56, 189, 248, 0.22)',
        lineColor: 'rgba(2, 132, 199, 0.13)',
        starColor: 'rgba(56, 189, 248, 0.24)',
        ginghamColor: 'rgba(2, 132, 199, 0.025)',
        ginghamDark: 'rgba(56, 189, 248, 0.05)',
      };

    case 'sage':
      // Theme Sage: Sắc xanh lá sage thanh mát
      return {
        bgBase: '#f5faf6',
        stripeColor: 'rgba(22, 163, 74, 0.11)',
        stripeAccent: 'rgba(74, 222, 128, 0.22)',
        lineColor: 'rgba(22, 163, 74, 0.12)',
        starColor: 'rgba(74, 222, 128, 0.24)',
        ginghamColor: 'rgba(22, 163, 74, 0.025)',
        ginghamDark: 'rgba(74, 222, 128, 0.05)',
      };

    case 'mocha':
      // Theme Mocha / Linen: Sắc nâu caramel ấm áp
      return {
        bgBase: '#faf7f2',
        stripeColor: 'rgba(217, 119, 6, 0.11)',
        stripeAccent: 'rgba(251, 191, 36, 0.22)',
        lineColor: 'rgba(217, 119, 6, 0.12)',
        starColor: 'rgba(251, 191, 36, 0.24)',
        ginghamColor: 'rgba(217, 119, 6, 0.025)',
        ginghamDark: 'rgba(251, 191, 36, 0.05)',
      };

    case 'lululemon':
      // Theme Berry: Sắc hồng dâu ngọt ngào
      return {
        bgBase: '#faf4f6',
        stripeColor: 'rgba(166, 68, 98, 0.11)',
        stripeAccent: 'rgba(244, 114, 182, 0.22)',
        lineColor: 'rgba(166, 68, 98, 0.12)',
        starColor: 'rgba(244, 114, 182, 0.24)',
        ginghamColor: 'rgba(166, 68, 98, 0.025)',
        ginghamDark: 'rgba(244, 114, 182, 0.05)',
      };

    case 'amethyst-haze':
    case 'cosmic':
      // Theme Purple / Amethyst: Sắc tím thạch anh mộng mơ
      return {
        bgBase: '#f9f5fd',
        stripeColor: 'rgba(147, 51, 234, 0.11)',
        stripeAccent: 'rgba(192, 132, 252, 0.22)',
        lineColor: 'rgba(147, 51, 234, 0.12)',
        starColor: 'rgba(192, 132, 252, 0.24)',
        ginghamColor: 'rgba(147, 51, 234, 0.025)',
        ginghamDark: 'rgba(192, 132, 252, 0.05)',
      };

    case 'notebook':
    default:
      // Theme Notebook: Sắc ghi chì tối giản
      return {
        bgBase: '#faf9f7',
        stripeColor: 'rgba(113, 113, 122, 0.11)',
        stripeAccent: 'rgba(161, 161, 170, 0.22)',
        lineColor: 'rgba(113, 113, 122, 0.12)',
        starColor: 'rgba(161, 161, 170, 0.24)',
        ginghamColor: 'rgba(113, 113, 122, 0.025)',
        ginghamDark: 'rgba(161, 161, 170, 0.05)',
      };
  }
};

export const NotebookStationeryBackground: React.FC<NotebookStationeryBackgroundProps> = ({
  theme = 'slate-haze',
}) => {
  const c = getStationeryColors(theme);
  const pId = `stationery_${theme}`;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
      style={{ backgroundColor: c.bgBase }}
    >
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          {/* 1. MẪU HOA VĂN SỌC DỌC TRÊN CÙNG (WALLPAPER STRIPES):
              Chiều cao pattern lớn (300px) để các dải sọc luôn có chiều dài bằng nhau tuyệt đối,
              không bị ngắt đoạn hay lồi lõm so le */}
          <pattern
            id={`${pId}_stripes`}
            width="24"
            height="300"
            patternUnits="userSpaceOnUse"
          >
            {/* Dải sọc chính */}
            <rect x="0" y="0" width="10" height="300" fill={c.stripeColor} />
            {/* Đường chỉ mảnh trang trí vải dán tường */}
            <line
              x1="5"
              y1="0"
              x2="5"
              y2="300"
              stroke={c.stripeAccent}
              strokeWidth="0.8"
            />
          </pattern>

          {/* 2. MẪU DÒNG KẺ VỞ & NGÔI SAO 5 CÁNH PHẦN THÂN:
              Đã khắc phục triệt để lỗi cắt xén ngôi sao (đặt ngôi sao căn giữa đường kẻ, cách đều mép trên dưới),
              bỏ chấm li ti theo đúng yêu cầu */}
          <pattern
            id={`${pId}_ruled_stars`}
            width="80"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            {/* Dòng kẻ ngang 1 (y = 14, cách mép trên 14px an toàn) */}
            <line
              x1="0"
              y1="14"
              x2="80"
              y2="14"
              stroke={c.lineColor}
              strokeWidth="1"
            />

            {/* Dòng kẻ ngang 2 (y = 42, cách dòng kẻ 1 28px, cách mép dưới 14px an toàn) */}
            <line
              x1="0"
              y1="42"
              x2="80"
              y2="42"
              stroke={c.lineColor}
              strokeWidth="1"
            />

            {/* Hàng 1 (trên dòng kẻ 14): Ngôi sao 5 cánh (không có chấm li ti) */}
            <g transform="translate(20, 14)">
              <polygon
                points="0,-4 1.2,-1.2 4.2,-1 2,1.2 2.6,4.2 0,2.6 -2.6,4.2 -2,1.2 -4.2,-1 -1.2,-1.2"
                fill={c.starColor}
              />
            </g>
            <g transform="translate(60, 14)">
              <polygon
                points="0,-4 1.2,-1.2 4.2,-1 2,1.2 2.6,4.2 0,2.6 -2.6,4.2 -2,1.2 -4.2,-1 -1.2,-1.2"
                fill={c.starColor}
              />
            </g>

            {/* Hàng 2 (trên dòng kẻ 42): Xếp SO LE, ngôi sao tại x=0 và x=80 liền mạch không bị cắt */}
            <g transform="translate(0, 42)">
              <polygon
                points="0,-4 1.2,-1.2 4.2,-1 2,1.2 2.6,4.2 0,2.6 -2.6,4.2 -2,1.2 -4.2,-1 -1.2,-1.2"
                fill={c.starColor}
              />
            </g>
            <g transform="translate(40, 42)">
              <polygon
                points="0,-4 1.2,-1.2 4.2,-1 2,1.2 2.6,4.2 0,2.6 -2.6,4.2 -2,1.2 -4.2,-1 -1.2,-1.2"
                fill={c.starColor}
              />
            </g>
            <g transform="translate(80, 42)">
              <polygon
                points="0,-4 1.2,-1.2 4.2,-1 2,1.2 2.6,4.2 0,2.6 -2.6,4.2 -2,1.2 -4.2,-1 -1.2,-1.2"
                fill={c.starColor}
              />
            </g>
          </pattern>

          {/* 3. MẪU HỌA TIẾT CARO GINGHAM (VICHY CHECK) CHO DẢI DƯỚI CÙNG THEO YÊU CẦU */}
          <pattern
            id={`${pId}_gingham`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            {/* Dải dọc */}
            <rect x="0" y="0" width="12" height="24" fill={c.ginghamColor} />
            {/* Dải ngang */}
            <rect x="0" y="0" width="24" height="12" fill={c.ginghamColor} />
            {/* Ô giao thoa đậm màu đặc trưng vải caro gingham */}
            <rect x="0" y="0" width="12" height="12" fill={c.ginghamDark} />
          </pattern>
        </defs>
      </svg>

      {/* =============================================================
          TẦNG 1: TRÊN CÙNG (KHOẢNG 20% CHIỀU CAO):
          Chỉ có các sọc dọc wallpaper, phía dưới có một dải mờ chuyển sang màu nền.
          ============================================================= */}
      <div className="absolute top-0 left-0 right-0 h-[20vh] min-h-[140px] max-h-[220px] overflow-hidden pointer-events-none z-1">
        <svg className="w-full h-full">
          <rect width="100%" height="100%" fill={`url(#${pId}_stripes)`} />
        </svg>

        {/* Dải mờ chuyển sang màu nền ở chân dải sọc */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 45%, ${c.bgBase} 98%)`,
          }}
        />
      </div>

      {/* =============================================================
          TẦNG 2: PHẦN THÂN:
          Các dòng kẻ ngang với các ngôi sao 5 cánh xếp so le, bỏ chấm li ti,
          đã sửa triệt để lỗi cắt xén ngôi sao.
          ============================================================= */}
      <div
        className="absolute left-0 right-0 overflow-hidden pointer-events-none z-1"
        style={{
          top: 'max(140px, min(20vh, 220px))',
          bottom: 'max(140px, min(20vh, 200px))',
        }}
      >
        <svg className="w-full h-full">
          <rect width="100%" height="100%" fill={`url(#${pId}_ruled_stars)`} />
        </svg>
      </div>

      {/* =============================================================
          TẦNG 3: DẢI DƯỚI CÙNG (KHOẢNG 20% DƯỚI CÙNG):
          Đổi sang họa tiết CARO GINGHAM theo yêu cầu, phối màu chuẩn theme.
          ============================================================= */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[20vh] min-h-[140px] max-h-[200px] overflow-hidden pointer-events-none z-1"
      >
        <svg className="w-full h-full">
          <rect width="100%" height="100%" fill={`url(#${pId}_gingham)`} />
        </svg>

        {/* Dải chuyển tiếp mờ nhẹ ở mép trên của dải caro gingham */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${c.bgBase} 0%, rgba(255,255,255,0) 28%)`,
          }}
        />
      </div>
    </div>
  );
};
