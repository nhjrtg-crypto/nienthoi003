import React, { useId, useState, useEffect } from 'react';
import { NovelThemeId } from '../utils/themeStyles';

export type LightLogoOptionId =
  | 'celestial-saturn'    // 🪐 Tinh Cầu Vành Đai Sa Thổ (Ringed Saturnian Orb - Mặc định)
  | 'celestial-crystal'   // 🔮 Tinh Cầu Thủy Tinh Ngân Hà (Crystal Galaxy Sphere)
  | 'celestial-sun'       // ☀️ Tinh Cầu Thái Dương Vũ Trụ (Solar Radiant Star)
  | 'celestial-ocean'     // 🌍 Tinh Cầu Sinh Mệnh & Vệ Tinh (Celestial Earth & Satellite)
  | 'celestial-chrono'    // ⌛ Tinh Cầu La Bàn Niên Thời (Chrono Astrolabe Orb)
  | 'celestial-eclipse'   // 🌌 Tinh Cầu Nhật Thực Kim Cương (Eclipse Corona Orb)
  | 'arch-panoramic'      // 🌉 Vòm Cầu Vồng Vắt Ngang Trời (Classic Rainbow)
  | 'morning-sun'         // Legacy alias
  | 'open-book'           // Legacy alias
  | 'feather-quill'       // Legacy alias
  | 'time-ring'           // Legacy alias
  | 'stardust-arc'        // Legacy alias
  | string;

export type LogoMotionStyle =
  | 'cloud-chroma-glow' // ✨ Mây Trôi & Hào Quang Biến Sắc (Default)
  | 'cloud-traverse'    // ☁️ Đám Mây Bay Qua Bay Lại (Mây lướt ngang qua lại + Hào quang + Sao chớp tắt)
  | 'gentle-glow'       // 💫 Hào Quang Tinh Khôi (Tĩnh tại thanh nhã, hào quang đổi màu êm dịu)
  | 'cloud-drift'       // 🌬️ Mây Trôi Bồng Bềnh (Các cụm mây nhấp nhô trôi êm ả quanh dải logo)
  | 'pure-static'       // 🍃 Tĩnh Tại Thanh Khiết (Logo & mây tĩnh tại, không chuyển động)
  | string;

export interface LogoOptionMeta {
  id: LightLogoOptionId;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  badge?: string;
  concept: string;
}

export interface LogoMotionOptionMeta {
  id: LogoMotionStyle;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
}

// CÁC TÙY CHỌN QUẢ TINH CẦU VŨ TRỤ CHO THEME SÁNG (GIỮ NGUYÊN MÂY, SAO, HÀO QUANG & HIỆU ỨNG)
export const LIGHT_LOGO_OPTIONS: LogoOptionMeta[] = [
  {
    id: 'celestial-saturn',
    name: 'Tinh Cầu Vành Đai Sa Thổ',
    subtitle: 'Hành tinh vũ trụ với vành đai ánh sáng 3D vắt ngang kiêu sa',
    description:
      'Quả tinh cầu vũ trụ chuyển sắc pastel huyền ảo, được bao bọc bởi vành đai ánh sáng Sa Thổ 3D uốn lượn vắt ngang qua hành tinh, lơ lửng bồng bềnh trên biển mây trắng và muôn vì sao.',
    icon: '🪐',
    badge: 'Gợi ý #1 • Đề xuất',
    concept: 'Sa Thổ Vũ Trụ',
  },
  {
    id: 'celestial-crystal',
    name: 'Tinh Cầu Thủy Tinh Ngân Hà',
    subtitle: 'Quả cầu pha lê trong suốt chứa trọn dải ngân hà bụi sao xoáy tròn',
    description:
      'Quả tinh cầu thủy tinh với hiệu ứng phản quang specular 3D trong trẻo, bên trong chứa đựng một dải ngân hà thu nhỏ xoáy tròn cùng những hạt bụi sao hoàng kim lấp lánh.',
    icon: '🔮',
    badge: 'Gợi ý #2',
    concept: 'Pha Lê Ngân Hà',
  },
  {
    id: 'celestial-sun',
    name: 'Tinh Cầu Thái Dương Vũ Trụ',
    subtitle: 'Ngôi sao nguyên sơ tỏa nhật quyển và năng lượng ánh sáng ban mai',
    description:
      'Tinh cầu mặt trời năng lượng rực rỡ với quầng nhật miện đa tầng và các cánh hoa lửa plasma uốn lượn mềm mại mọc lên từ biển mây, đón trọn hào quang biến sắc rực rỡ.',
    icon: '☀️',
    badge: 'Gợi ý #3',
    concept: 'Thái Dương Ban Mai',
  },
  {
    id: 'celestial-ocean',
    name: 'Tinh Cầu Sinh Mệnh & Vệ Tinh',
    subtitle: 'Hành tinh lam ngọc đại dương và vệ tinh nhỏ xoay quanh quỹ đạo',
    description:
      'Tinh cầu ngọc bích tuyệt mỹ với các dải lục địa và mây khí quyển xoáy tròn mềm mại, đi kèm một quả vệ tinh mini lấp lánh quay quanh quỹ đạo elip phát sáng.',
    icon: '🌍',
    badge: 'Gợi ý #4',
    concept: 'Địa Cầu & Vệ Tinh',
  },
  {
    id: 'celestial-chrono',
    name: 'Tinh Cầu La Bàn Niên Thời',
    subtitle: 'Vòng kinh vĩ thiên văn và bánh xe thời gian mang ý niệm Niên Thời',
    description:
      'Tinh cầu trung tâm được lồng ghép với các vòng xích đạo hoàng đạo và khung la bàn thiên văn cổ điển, khắc họa trọn vẹn ý niệm "Niên Thời" trong vũ trụ bao la.',
    icon: '⌛',
    badge: 'Gợi ý #5',
    concept: 'Niên Thời Bất Tận',
  },
  {
    id: 'celestial-eclipse',
    name: 'Tinh Cầu Nhật Thực Kim Cương',
    subtitle: 'Vầng nhật miện kim cương bừng sáng rực rỡ từ phía sau tinh cầu',
    description:
      'Quả tinh cầu huyền ảo với viền sáng rìa sắc nét, góc trên bừng sáng vệt "nhẫn kim cương" chói lọi 4 cánh, tạo chiều sâu thị giác cực kỳ cuốn hút trên nền trời mây.',
    icon: '🌌',
    badge: 'Gợi ý #6',
    concept: 'Nhẫn Kim Cương',
  },
  {
    id: 'arch-panoramic',
    name: 'Vòm Cầu Vồng Vắt Ngang Trời',
    subtitle: 'Dải ngũ sắc liền mạch vắt trọn vẹn từ bờ mây trái sang bờ mây phải',
    description:
      'Tùy chọn cầu vồng cổ điển với cung vòm ngũ sắc vắt ngang trời liền mạch không viền trắng, dành cho ai yêu thích vẻ đẹp truyền thống ban đầu.',
    icon: '🌉',
    badge: 'Cầu Vồng',
    concept: 'Cổ Điển',
  },
];

// CÁC KIỂU CHUYỂN ĐỘNG THANH LỊCH (MẶC ĐỊNH MÂY TRÔI & HÀO QUANG BIẾN SẮC)
export const LOGO_MOTION_OPTIONS: LogoMotionOptionMeta[] = [
  {
    id: 'cloud-chroma-glow',
    name: 'Mây Trôi & Hào Quang Biến Sắc (Default)',
    subtitle: 'Kết hợp mây trôi bồng bềnh cùng hào quang đổi màu lung linh',
    description:
      'Dải cầu vồng tỏa hào quang luân chuyển biến sắc (hồng ngọc, hoàng kim, ngọc bích, lam biếc, tử sắc), các cụm mây trắng lướt trôi bồng bềnh và muôn vì sao chớp tắt.',
    icon: '✨',
    badge: 'Mặc Định',
  },
  {
    id: 'cloud-traverse',
    name: 'Đám Mây Bay Qua Bay Lại (Cloud Flight)',
    subtitle: 'Bổ sung đám mây lướt ngang qua lại giữa bầu trời thơ mộng',
    description:
      'Có đám mây trắng êm ả lượn bay qua bay lại ngang vòm cầu vồng, kết hợp hào quang biến sắc và sao chớp tắt.',
    icon: '☁️',
    badge: 'Sinh Động',
  },
  {
    id: 'gentle-glow',
    name: 'Hào Quang Tinh Khôi (Gentle Glow)',
    subtitle: 'Hào quang đổi màu êm dịu, sao chớp tắt, mây tĩnh tại',
    description:
      'Không dao động cơ học, chỉ có hào quang luân chuyển biến sắc và ánh sao lung linh bừng nở êm ái.',
    icon: '💫',
    badge: 'Tối Giản',
  },
  {
    id: 'cloud-drift',
    name: 'Mây Trôi Bồng Bềnh (Cloud Drift)',
    subtitle: 'Các cụm mây nhấp nhô lướt êm ả quanh dải cầu vồng',
    description:
      'Dải cầu vồng giữ nguyên tĩnh tại, các áng mây xung quanh thở nhẹ và trôi bồng bềnh thư thái.',
    icon: '🌬️',
    badge: 'Thanh Nhã',
  },
  {
    id: 'pure-static',
    name: 'Tĩnh Tại Thanh Khiết (Pure Static)',
    subtitle: 'Cầu vồng và mây tĩnh lặng tuyệt đối, không hiệu ứng động',
    description:
      'Biểu tượng logo giữ nguyên trạng thái tĩnh hoàn toàn, thanh khiết và trang nhã.',
    icon: '🍃',
    badge: 'Tĩnh Lặng',
  },
];

export interface WebLogoProps {
  theme?: NovelThemeId;
  isDarkMode?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  lightOptionId?: LightLogoOptionId;
  motionStyle?: LogoMotionStyle;
  showTraverseCloud?: boolean;
  showTwinkleStars?: boolean;
  onClick?: () => void;
}

export const WebLogo: React.FC<WebLogoProps> = ({
  theme = 'amethyst-haze',
  isDarkMode = false,
  size = 'md',
  className = '',
  lightOptionId,
  motionStyle,
  showTraverseCloud,
  showTwinkleStars,
  onClick,
}) => {
  const uniqueId = useId().replace(/:/g, '_');
  const isCosmic = theme === 'cosmic';
  // Ở theme cosmic, chuyển logo của theme cosmic sang giống logo của theme sáng, các theme còn lại không thay đổi logo
  const isDarkEffective = !isCosmic && isDarkMode;

  // Lựa chọn concept cho theme sáng (chốt cố định: Tinh Cầu Vành Đai Sa Thổ)
  const [selectedLightOption, setSelectedLightOption] = useState<LightLogoOptionId>(() => {
    if (lightOptionId) return lightOptionId;
    return 'celestial-saturn';
  });

  // Lựa chọn kiểu chuyển động (mặc định 'cloud-chroma-glow' - kết hợp mây trôi và hào quang biến sắc)
  const [selectedMotionStyle, setSelectedMotionStyle] = useState<LogoMotionStyle>(() => {
    if (motionStyle) return motionStyle;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nienthoi_logo_motion_style');
      if (
        saved &&
        ['cloud-chroma-glow', 'cloud-traverse', 'cloud-drift', 'gentle-glow', 'pure-static'].includes(
          saved
        )
      ) {
        return saved as LogoMotionStyle;
      }
      if (saved === 'stream-flow' || saved === 'cloud-drift') return 'cloud-chroma-glow';
    }
    return 'cloud-chroma-glow';
  });

  // Tùy chọn đám mây bay qua bay lại (Traverse Cloud)
  const [isTraverseCloudActive, setIsTraverseCloudActive] = useState<boolean>(() => {
    if (typeof showTraverseCloud === 'boolean') return showTraverseCloud;
    if (motionStyle === 'cloud-traverse') return true;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nienthoi_logo_traverse_cloud');
      if (saved !== null) return saved === 'true';
    }
    return false;
  });

  // Tùy chọn ngôi sao chớp tắt (Twinkle Stars - Mặc định BẬT)
  const [isTwinkleStarsActive, setIsTwinkleStarsActive] = useState<boolean>(() => {
    if (typeof showTwinkleStars === 'boolean') return showTwinkleStars;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nienthoi_logo_twinkle_stars');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  useEffect(() => {
    if (lightOptionId) setSelectedLightOption(lightOptionId);
    if (motionStyle) setSelectedMotionStyle(motionStyle);
    if (typeof showTraverseCloud === 'boolean') setIsTraverseCloudActive(showTraverseCloud);
    if (typeof showTwinkleStars === 'boolean') setIsTwinkleStarsActive(showTwinkleStars);

    const handleLogoChange = (e: Event) => {
      const customEvent = e as CustomEvent<LightLogoOptionId>;
      if (customEvent.detail) setSelectedLightOption(customEvent.detail);
    };

    const handleMotionChange = (e: Event) => {
      const customEvent = e as CustomEvent<LogoMotionStyle>;
      if (customEvent.detail) setSelectedMotionStyle(customEvent.detail);
    };

    const handleTraverseChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (typeof customEvent.detail === 'boolean') setIsTraverseCloudActive(customEvent.detail);
    };

    const handleStarsChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (typeof customEvent.detail === 'boolean') setIsTwinkleStarsActive(customEvent.detail);
    };

    window.addEventListener('nienthoi_light_logo_changed', handleLogoChange);
    window.addEventListener('nienthoi_logo_motion_changed', handleMotionChange);
    window.addEventListener('nienthoi_logo_traverse_cloud_changed', handleTraverseChange);
    window.addEventListener('nienthoi_logo_twinkle_stars_changed', handleStarsChange);

    return () => {
      window.removeEventListener('nienthoi_light_logo_changed', handleLogoChange);
      window.removeEventListener('nienthoi_logo_motion_changed', handleMotionChange);
      window.removeEventListener('nienthoi_logo_traverse_cloud_changed', handleTraverseChange);
      window.removeEventListener('nienthoi_logo_twinkle_stars_changed', handleStarsChange);
    };
  }, [lightOptionId, motionStyle, showTraverseCloud, showTwinkleStars]);

  // Kích thước hiển thị to và rõ ràng
  const sizeConfig = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-13 h-13 sm:w-15 sm:h-15',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
  }[size];

  // Bảng màu cho Theme Tối (Trầm ấm, dịu mắt, nhẹ nhàng, cùng tông màu với nút Đọc truyện ngay)
  const getDarkPalette = () => {
    switch (theme) {
      case 'sage':
        return {
          ringStroke: '#4d6f53',
          ringInner: '#2d4432',
          ringGlow: 'drop-shadow(0 0 2px rgba(77, 111, 83, 0.20))',
          skyGradStart: '#1b2a1f',
          skyGradEnd: '#0d1610',
          celestial: '#d2e3d5',
          celestialGlow: '#4d6f53',
          cloudFront: '#39563f',
          cloudMid: '#2d4432',
          star: '#e2ede4',
        };
      case 'mocha':
        return {
          ringStroke: '#7a5543',
          ringInner: '#4d362b',
          ringGlow: 'drop-shadow(0 0 2px rgba(122, 85, 67, 0.20))',
          skyGradStart: '#271a13',
          skyGradEnd: '#130c08',
          celestial: '#e8ded6',
          celestialGlow: '#7a5543',
          cloudFront: '#5c4134',
          cloudMid: '#4d362b',
          star: '#f2eae3',
        };
      case 'notebook':
        return {
          ringStroke: '#61616c',
          ringInner: '#38383f',
          ringGlow: 'drop-shadow(0 0 2px rgba(97, 97, 108, 0.15))',
          skyGradStart: '#202025',
          skyGradEnd: '#101013',
          celestial: '#dedee4',
          celestialGlow: '#61616c',
          cloudFront: '#44444c',
          cloudMid: '#38383f',
          star: '#eaeaf0',
        };
      case 'amethyst-haze':
        return {
          ringStroke: '#6e4694',
          ringInner: '#452d5e',
          ringGlow: 'drop-shadow(0 0 2px rgba(110, 70, 148, 0.20))',
          skyGradStart: '#211433',
          skyGradEnd: '#0f081a',
          celestial: '#dfd2ee',
          celestialGlow: '#6e4694',
          cloudFront: '#533671',
          cloudMid: '#452d5e',
          star: '#eae0f7',
        };
      case 'slate-haze':
        return {
          ringStroke: '#48698e',
          ringInner: '#2c435c',
          ringGlow: 'drop-shadow(0 0 2px rgba(72, 105, 142, 0.20))',
          skyGradStart: '#142130',
          skyGradEnd: '#080e16',
          celestial: '#d2e1ef',
          celestialGlow: '#48698e',
          cloudFront: '#355170',
          cloudMid: '#2c435c',
          star: '#e2edf7',
        };
      case 'cosmic':
      default:
        return {
          ringStroke: '#634292',
          ringInner: '#3e2463',
          ringGlow: 'drop-shadow(0 0 2px rgba(99, 66, 146, 0.20))',
          skyGradStart: '#1d1238',
          skyGradEnd: '#0d061c',
          celestial: '#ded2ef',
          celestialGlow: '#634292',
          cloudFront: '#502e7e',
          cloudMid: '#3b1f60',
          star: '#ede2fa',
        };
    }
  };

  const darkPalette = getDarkPalette();
  const clipId = `dark-clip-${uniqueId}`;
  const bgGradId = `dark-bg-grad-${uniqueId}`;

  const showTraverse = isTraverseCloudActive || selectedMotionStyle === 'cloud-traverse';
  const showStars = isTwinkleStarsActive;

  // Lớp motion cho dải cầu vồng
  const getRainbowMotionClass = () => {
    switch (selectedMotionStyle) {
      case 'cloud-chroma-glow':
      case 'cloud-traverse':
      case 'gentle-glow':
        return 'animate-rainbow-chroma-aura';
      case 'pure-static':
      case 'cloud-drift':
      default:
        return '';
    }
  };

  // Lớp motion cho các cụm mây (hỗ trợ cả mây trôi bồng bềnh trong cloud-chroma-glow & cloud-traverse)
  const getCloudMotionClass = (direction: 'left' | 'right' | 'float') => {
    if (selectedMotionStyle === 'pure-static') return '';
    if (
      selectedMotionStyle === 'cloud-chroma-glow' ||
      selectedMotionStyle === 'cloud-traverse' ||
      selectedMotionStyle === 'cloud-drift'
    ) {
      if (direction === 'left') return 'animate-cloud-drift-1';
      if (direction === 'right') return 'animate-cloud-drift-2';
      return 'animate-sakura-flutter-gentle';
    }
    // Mặc định thở êm ái
    if (direction === 'left') return 'animate-cloud-gentle-l';
    if (direction === 'right') return 'animate-cloud-gentle-r';
    return '';
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none overflow-visible ${sizeConfig} ${className}`}
      aria-label="Niên Thời Logo"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients cho Theme Tối */}
          {isDarkEffective && (
            <>
              <clipPath id={clipId}>
                <circle cx="50" cy="50" r="41" />
              </clipPath>
              <linearGradient id={bgGradId} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={darkPalette.skyGradStart} stopOpacity="0.88" />
                <stop offset="100%" stopColor={darkPalette.skyGradEnd} stopOpacity="0.96" />
              </linearGradient>
            </>
          )}

          {/* Gradients cho Dải Cầu Vồng & Mây Trắng Ngũ Sắc */}
          {!isDarkEffective && (
            <>
              {/* Gradient mây trắng ngọc ngà tầng trước */}
              <linearGradient id={`cloud-front-grad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>

              {/* Gradient mây tầng sau (tạo chiều sâu không gian) */}
              <linearGradient id={`cloud-back-grad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.85" />
              </linearGradient>

              {/* Gradient dải lụa quang phổ liên tục (Full Rainbow Gradient) */}
              <linearGradient id={`rainbow-ribbon-grad-${uniqueId}`} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />   {/* Hồng đỏ */}
                <stop offset="25%" stopColor="#fb923c" />  {/* Cam ấm */}
                <stop offset="50%" stopColor="#facc15" />  {/* Vàng tươi */}
                <stop offset="75%" stopColor="#10b981" />  {/* Ngọc lục */}
                <stop offset="100%" stopColor="#38bdf8" /> {/* Lam biếc */}
              </linearGradient>

              {/* Gradient dải quang phổ nằm ngang cho Arch và Wave */}
              <linearGradient id={`rainbow-horiz-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="25%" stopColor="#fb923c" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="75%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Gradients cho Vầng Thái Dương Bình Minh */}
              <linearGradient id={`sun-core-grad-${uniqueId}`} x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="35%" stopColor="#fb923c" />
                <stop offset="75%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>

              <radialGradient id={`sun-inner-grad-${uniqueId}`} cx="50%" cy="100%" r="90%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>

              <linearGradient id={`sun-halo-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="30%" stopColor="#f43f5e" />
                <stop offset="70%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Gradients cho Cuốn Sách Mở Thần Kỳ */}
              <linearGradient id={`book-page-grad-l-${uniqueId}`} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#f0f9ff" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>

              <linearGradient id={`book-page-grad-r-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#fdf4ff" />
                <stop offset="100%" stopColor="#f5d0fe" />
              </linearGradient>

              <radialGradient id={`book-aura-grad-${uniqueId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>

              {/* Gradients cho Ngọn Bút Lông Vũ */}
              <linearGradient id={`quill-vane-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="45%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>

              <linearGradient id={`quill-vane-grad-2-${uniqueId}`} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Gradients cho Vòng Tròn Thời Gian (Niên Thời) */}
              <linearGradient id={`astrolabe-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="35%" stopColor="#ec4899" />
                <stop offset="70%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              <linearGradient id={`astrolabe-orbit-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              {/* Gradients cho Dải Ngân Hà Sao Băng */}
              <linearGradient id={`stardust-ribbon-grad-${uniqueId}`} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="25%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="75%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#facc15" />
              </linearGradient>

              {/* =============================================================== */}
              {/* GRADIENTS CHO CÁC OPTION TINH CẦU VŨ TRỤ (CELESTIAL SPHERES) */}
              {/* =============================================================== */}

              {/* 1. Tinh Cầu Vành Đai Sa Thổ */}
              <linearGradient id={`saturn-body-grad-${uniqueId}`} x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#fef08a" />   {/* Ánh kim hoàng đạo */}
                <stop offset="35%" stopColor="#fbcfe8" />  {/* Hồng phấn vũ trụ */}
                <stop offset="70%" stopColor="#c084fc" />  {/* Tử sắc ngân hà */}
                <stop offset="100%" stopColor="#38bdf8" /> {/* Lam ngọc */}
              </linearGradient>

              <linearGradient id={`saturn-ring-grad-${uniqueId}`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#fb923c" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="75%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
              </linearGradient>

              <radialGradient id={`saturn-halo-grad-${uniqueId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.65" />
                <stop offset="55%" stopColor="#ec4899" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>

              {/* 2. Tinh Cầu Thủy Tinh Ngân Hà */}
              <radialGradient id={`crystal-core-grad-${uniqueId}`} cx="42%" cy="38%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fed7aa" />
                <stop offset="55%" stopColor="#c084fc" />
                <stop offset="85%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>

              <linearGradient id={`crystal-glass-sheen-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="35%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
              </linearGradient>

              <radialGradient id={`crystal-halo-grad-${uniqueId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
              </radialGradient>

              {/* 3. Tinh Cầu Thái Dương Vũ Trụ */}
              <radialGradient id={`solar-star-grad-${uniqueId}`} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </radialGradient>

              <radialGradient id={`solar-corona-grad-${uniqueId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#facc15" stopOpacity="0.8" />
                <stop offset="45%" stopColor="#fb923c" stopOpacity="0.4" />
                <stop offset="80%" stopColor="#f43f5e" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>

              {/* 4. Tinh Cầu Sinh Mệnh & Vệ Tinh */}
              <radialGradient id={`ocean-globe-grad-${uniqueId}`} cx="38%" cy="32%" r="65%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="30%" stopColor="#38bdf8" />
                <stop offset="75%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </radialGradient>

              <radialGradient id={`ocean-halo-grad-${uniqueId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>

              <linearGradient id={`satellite-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              {/* 5. Tinh Cầu La Bàn Niên Thời */}
              <linearGradient id={`chrono-brass-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>

              <radialGradient id={`chrono-core-grad-${uniqueId}`} cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fde047" />
                <stop offset="85%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>

              {/* 6. Tinh Cầu Nhật Thực Kim Cương */}
              <radialGradient id={`eclipse-body-grad-${uniqueId}`} cx="65%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="45%" stopColor="#1e293b" />
                <stop offset="85%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>

              <radialGradient id={`diamond-flare-grad-${uniqueId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="25%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>
            </>
          )}
        </defs>

        {/* =========================================================================
            1. THEME TỐI: CỐ ĐỊNH OPTION 4 (TINH VÂN DẠ NGUYỆT)
            ========================================================================= */}
        {isDarkEffective ? (
          <>
            <circle cx="50" cy="50" r="41" fill={`url(#${bgGradId})`} />

            <g clipPath={`url(#${clipId})`}>
              {/* Trăng khuyết thanh mảnh */}
              <path
                d="M 62, 22
                   C 55, 22, 48, 28, 48, 36
                   C 48, 44, 55, 50, 62, 50
                   C 58, 47, 56, 42, 56, 36
                   C 56, 30, 58, 25, 62, 22 Z"
                fill={darkPalette.celestial}
                style={{ filter: `drop-shadow(0 0 5px ${darkPalette.celestialGlow})` }}
                opacity="0.95"
              />

              {/* Các ngôi sao 4 cánh lấp lánh */}
              <g className="animate-celestial-star">
                <polygon
                  points="34,26 35.5,29 38.5,30.5 35.5,32 34,35 32.5,32 29.5,30.5 32.5,29"
                  fill={darkPalette.star}
                  opacity="0.9"
                />
                <circle cx="44" cy="20" r="1.2" fill={darkPalette.star} opacity="0.8" />
                <polygon
                  points="72,48 73,50 75,51 73,52 72,54 71,52 69,51 71,50"
                  fill={darkPalette.star}
                  opacity="0.85"
                />
              </g>

              {/* Mây tầng xa lướt trôi */}
              <g className="animate-cloud-drift-1">
                <path
                  d="M 5, 52 C 5, 45, 12, 40, 21, 41 C 24, 34, 34, 31, 43, 34 C 48, 29, 58, 30, 63, 38 C 70, 39, 75, 45, 73, 52 C 73, 53, 5, 53, 5, 52 Z"
                  fill={darkPalette.cloudMid}
                  opacity="0.65"
                  transform="translate(6, 4)"
                />
              </g>

              {/* Mây tiền cảnh lướt trôi */}
              <g className="animate-cloud-drift-2">
                <path
                  d="M 15, 62 C 15, 53, 23, 47, 33, 48 C 36, 40, 46, 36, 56, 39 C 62, 33, 75, 34, 80, 44 C 88, 45, 93, 53, 91, 62 Z"
                  fill={darkPalette.cloudFront}
                  opacity="0.85"
                  transform="translate(-8, 5)"
                />
                <path
                  d="M 12, 60 C 25, 55, 45, 54, 60, 58 C 75, 54, 90, 57, 98, 62"
                  stroke={darkPalette.celestial}
                  strokeWidth="1"
                  fill="none"
                  opacity="0.75"
                />
              </g>
            </g>

            {/* Vành tròn Neon cho Theme Tối */}
            <g style={{ filter: darkPalette.ringGlow }}>
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={darkPalette.ringStroke}
                strokeWidth="2.4"
                className="animate-portal-pulse"
              />
              <circle
                cx="50"
                cy="50"
                r="38.5"
                fill="none"
                stroke={darkPalette.ringInner}
                strokeWidth="0.8"
                opacity="0.6"
              />
              <circle cx="50" cy="8" r="1.4" fill={darkPalette.ringStroke} />
              <circle cx="50" cy="92" r="1.4" fill={darkPalette.ringStroke} />
              <circle cx="8" cy="50" r="1.4" fill={darkPalette.ringStroke} />
              <circle cx="92" cy="50" r="1.4" fill={darkPalette.ringStroke} />
            </g>
          </>
        ) : (
          /* =========================================================================
              2. THEME SÁNG: VÒM CẦU VỒNG VẮT NGANG TRỜI (CHÍNH THỨC)
              - Chốt vòm cầu vồng ngũ sắc toàn cảnh vắt ngang trời
              - Tiếp giáp liền mạch tuyệt đối, KHÔNG viền trắng
              - ĐÃ BỎ hoàn toàn đám mây ở giữa cầu vồng để vòm cung thông thoáng
              - BỔ SUNG hiệu ứng ngôi sao chớp tắt lung linh
              - BỔ SUNG option đám mây bay qua bay lại (Traverse Cloud)
             ========================================================================= */
          <g>
            {/* 2.1 Hiệu ứng ngôi sao chớp tắt (Twinkling Stars) */}
            {showStars && (
              <g opacity={selectedMotionStyle === 'pure-static' ? 0.7 : 1}>
                {/* Star 1 - Vàng kim góc trên trái đỉnh vòm */}
                <g className={selectedMotionStyle === 'pure-static' ? '' : 'animate-star-twinkle-1'}>
                  <path
                    d="M 28, 22 Q 28, 25 31, 25 Q 28, 25 28, 28 Q 28, 25 25, 25 Q 28, 25 28, 22 Z"
                    fill="#facc15"
                  />
                  <circle cx="28" cy="25" r="0.75" fill="#ffffff" />
                </g>

                {/* Star 2 - Ngôi sao lớn trung tâm đỉnh vòm */}
                <g className={selectedMotionStyle === 'pure-static' ? '' : 'animate-star-twinkle-2'}>
                  <path
                    d="M 50, 13 Q 50, 17 54, 17 Q 50, 17 50, 21 Q 50, 17 46, 17 Q 50, 17 50, 13 Z"
                    fill="#ffffff"
                    style={{ filter: 'drop-shadow(0 0 3px rgba(254, 240, 138, 0.9))' }}
                  />
                  <circle cx="50" cy="17" r="1.1" fill="#fef08a" />
                </g>

                {/* Star 3 - Lam biếc sườn phải */}
                <g className={selectedMotionStyle === 'pure-static' ? '' : 'animate-star-twinkle-3'}>
                  <path
                    d="M 73, 22 Q 73, 25 76, 25 Q 73, 25 73, 28 Q 73, 25 70, 25 Q 73, 25 73, 22 Z"
                    fill="#38bdf8"
                  />
                  <circle cx="73" cy="25" r="0.75" fill="#ffffff" />
                </g>

                {/* Star 4 - Ánh cam tinh túy sườn mây bên trái */}
                <g className={selectedMotionStyle === 'pure-static' ? '' : 'animate-star-twinkle-4'}>
                  <path
                    d="M 20, 42 Q 20, 44.5 22.5, 44.5 Q 20, 44.5 20, 47 Q 20, 44.5 17.5, 44.5 Q 20, 44.5 20, 42 Z"
                    fill="#fb923c"
                  />
                  <circle cx="20" cy="44.5" r="0.7" fill="#ffffff" />
                </g>

                {/* Star 5 - Ánh hồng ngọc sườn mây bên phải */}
                <g className={selectedMotionStyle === 'pure-static' ? '' : 'animate-star-twinkle-5'}>
                  <path
                    d="M 80, 42 Q 80, 44.5 82.5, 44.5 Q 80, 44.5 80, 47 Q 80, 44.5 77.5, 44.5 Q 80, 44.5 80, 42 Z"
                    fill="#f472b6"
                  />
                  <circle cx="80" cy="44.5" r="0.7" fill="#ffffff" />
                </g>

                {/* Star 6 - Đốm sáng chớp tắt xa xa bên trái */}
                <g className={selectedMotionStyle === 'pure-static' ? '' : 'animate-star-twinkle-2'}>
                  <circle cx="15" cy="38" r="1.3" fill="#fde047" opacity="0.9" />
                  <circle cx="15" cy="38" r="0.6" fill="#ffffff" />
                </g>

                {/* Star 7 - Đốm sáng chớp tắt xa xa bên phải */}
                <g className={selectedMotionStyle === 'pure-static' ? '' : 'animate-star-twinkle-4'}>
                  <circle cx="85" cy="36" r="1.3" fill="#67e8f9" opacity="0.9" />
                  <circle cx="85" cy="36" r="0.6" fill="#ffffff" />
                </g>
              </g>
            )}

            {/* =========================================================================
                2.2 BIỂU TƯỢNG TRUNG TÂM THEME SÁNG: CÁC OPTION QUẢ TINH CẦU VŨ TRỤ
                ========================================================================= */}

            {/* OPTION 1: TINH CẦU VÀNH ĐAI SA THỔ (MẶC ĐỊNH) */}
            {(selectedLightOption === 'celestial-saturn' ||
              (![
                'celestial-crystal',
                'celestial-sun',
                'celestial-ocean',
                'celestial-chrono',
                'celestial-eclipse',
                'arch-panoramic',
                'morning-sun',
                'open-book',
                'feather-quill',
                'time-ring',
                'stardust-arc',
              ].includes(selectedLightOption))) && (
              <g className={getRainbowMotionClass()}>
                {/* Vầng hào quang sa thổ tỏa sáng */}
                <circle
                  cx="50"
                  cy="46"
                  r="33"
                  fill={`url(#saturn-halo-grad-${uniqueId})`}
                />

                {/* Nhóm Hành Tinh Sa Thổ & Vành Đai 3D nghiêng -24 độ */}
                <g transform="translate(50, 46) rotate(-24)">
                  {/* TẦNG 1: Nửa sau của Vành Đai Sa Thổ (nằm phía sau hành tinh) */}
                  <path
                    d="M -42, 0 A 42 13 0 0 1 42, 0 L 29, 0 A 29 9 0 0 0 -29, 0 Z"
                    fill={`url(#saturn-ring-grad-${uniqueId})`}
                    opacity="0.88"
                  />
                  <path
                    d="M -38, 0 A 38 11.8 0 0 1 38, 0"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.7"
                  />

                  {/* TẦNG 2: Quả Tinh Cầu Tròn (Thân hành tinh chính) */}
                  <circle
                    cx="0"
                    cy="0"
                    r="22"
                    fill={`url(#saturn-body-grad-${uniqueId})`}
                    style={{ filter: 'drop-shadow(0 4px 10px rgba(192, 132, 252, 0.35))' }}
                  />

                  {/* Vệt bóng đổ của vành đai lên bề mặt tinh cầu */}
                  <path
                    d="M -22 -1 Q 0 4 22 -1 L 22 2 Q 0 7 -22 2 Z"
                    fill="#0f172a"
                    opacity="0.22"
                  />

                  {/* Các dải mây khí quyển chuyển màu mềm mại trên bề mặt */}
                  <path
                    d="M -21 -8 Q 0 -4 21 -8"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    opacity="0.65"
                    fill="none"
                  />
                  <path
                    d="M -22 0 Q 0 5 22 0"
                    stroke="#fbcfe8"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    opacity="0.6"
                    fill="none"
                  />
                  <path
                    d="M -21 7 Q 0 12 21 7"
                    stroke="#fed7aa"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    opacity="0.6"
                    fill="none"
                  />
                  <path
                    d="M -18 14 Q 0 18 18 14"
                    stroke="#bae6fd"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    opacity="0.55"
                    fill="none"
                  />

                  {/* Vệt sáng specular 3D góc trên bên trái */}
                  <path
                    d="M -14 -14 A 18 18 0 0 1 6 -19"
                    stroke="#ffffff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    opacity="0.85"
                    fill="none"
                  />
                  <circle cx="-10" cy="-14" r="1.6" fill="#ffffff" opacity="0.95" />

                  {/* TẦNG 3: Nửa trước của Vành Đai Sa Thổ (uốn lượn vắt qua mặt trước tinh cầu) */}
                  <path
                    d="M 42, 0 A 42 13 0 0 1 -42, 0 L -29, 0 A 29 9 0 0 0 29, 0 Z"
                    fill={`url(#saturn-ring-grad-${uniqueId})`}
                    style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.18))' }}
                  />
                  {/* Rãnh chia vành đai sáng & đường chỉ hoàng kim */}
                  <path
                    d="M 37, 0 A 37 11.5 0 0 1 -37, 0"
                    stroke="#ffffff"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.85"
                    fill="none"
                  />
                  <path
                    d="M 40, 0 A 40 12.4 0 0 1 -40, 0"
                    stroke="#fef08a"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                    opacity="0.8"
                    fill="none"
                  />

                  {/* Ngôi sao lấp lánh ở chóp vành đai */}
                  <circle cx="41" cy="0" r="1.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #fde047)' }} />
                  <circle cx="-41" cy="0" r="1.3" fill="#ffffff" opacity="0.9" />
                </g>
              </g>
            )}

            {/* OPTION 2: TINH CẦU THỦY TINH NGÂN HÀ */}
            {selectedLightOption === 'celestial-crystal' && (
              <g className={getRainbowMotionClass()}>
                {/* Hào quang ngân hà mờ ảo */}
                <circle
                  cx="50"
                  cy="46"
                  r="34"
                  fill={`url(#crystal-halo-grad-${uniqueId})`}
                />
                {/* Vòng thiên hà đứt đoạn */}
                <circle
                  cx="50"
                  cy="46"
                  r="29"
                  fill="none"
                  stroke={`url(#saturn-ring-grad-${uniqueId})`}
                  strokeWidth="1.2"
                  strokeDasharray="2.5 3.5"
                  opacity="0.75"
                />

                {/* Quả cầu pha lê cốt lõi vũ trụ */}
                <circle
                  cx="50"
                  cy="46"
                  r="22"
                  fill={`url(#crystal-core-grad-${uniqueId})`}
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(168, 85, 247, 0.45))' }}
                />

                {/* Cánh xoắn dải ngân hà bên trong quả cầu */}
                <path
                  d="M 36 53 C 34 42, 44 37, 53 39 C 61 41, 64 50, 61 56 C 58 62, 49 63, 44 58"
                  fill="none"
                  stroke="#fbcfe8"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M 40 44 C 44 36, 56 36, 61 44 C 64 51, 55 58, 48 56"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.9"
                />

                {/* Nhân ngân hà phát sáng rực rỡ */}
                <circle cx="50" cy="46" r="3.4" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 6px #fef08a)' }} />
                <circle cx="50" cy="46" r="1.6" fill="#fde047" />

                {/* Bụi sao tinh tú xoáy tròn */}
                <circle cx="43" cy="42" r="1.3" fill="#ffffff" opacity="0.95" />
                <circle cx="58" cy="42" r="1.2" fill="#fde047" opacity="0.9" />
                <circle cx="44" cy="53" r="1.2" fill="#67e8f9" opacity="0.9" />
                <circle cx="59" cy="51" r="1.4" fill="#f472b6" opacity="0.9" />

                {/* Lớp vỏ thủy tinh 3D bóng bẩy */}
                <circle
                  cx="50"
                  cy="46"
                  r="22"
                  fill={`url(#crystal-glass-sheen-${uniqueId})`}
                />
                <circle
                  cx="50"
                  cy="46"
                  r="21.3"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  opacity="0.75"
                />

                {/* Vệt phản quang mặt kính cong hình trăng khuyết */}
                <path
                  d="M 36 34 A 18 18 0 0 1 58 29 A 20 20 0 0 0 34 46 A 18 18 0 0 1 36 34 Z"
                  fill="#ffffff"
                  opacity="0.85"
                />
                <path
                  d="M 42 63 A 19 19 0 0 0 63 56"
                  fill="none"
                  stroke="#bae6fd"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.65"
                />
              </g>
            )}

            {/* OPTION 3: TINH CẦU THÁI DƯƠNG VŨ TRỤ */}
            {(selectedLightOption === 'celestial-sun' || selectedLightOption === 'morning-sun') && (
              <g className={getRainbowMotionClass()}>
                {/* Vầng nhật quyển thái dương tỏa rộng */}
                <circle
                  cx="50"
                  cy="46"
                  r="34"
                  fill={`url(#solar-corona-grad-${uniqueId})`}
                />

                {/* Vòng tia quang phổ đứt đoạn */}
                <circle
                  cx="50"
                  cy="46"
                  r="29"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="1.4"
                  strokeDasharray="3 3"
                  opacity="0.75"
                />

                {/* Các cánh hoa lửa plasma nhật miện uốn lượn xung quanh */}
                <g stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
                  <path d="M 50 20 Q 53 23 50 26" fill="none" />
                  <path d="M 68 28 Q 67 33 63 34" fill="none" />
                  <path d="M 76 46 Q 73 49 70 46" fill="none" />
                  <path d="M 68 64 Q 65 61 63 58" fill="none" />
                  <path d="M 50 72 Q 47 69 50 66" fill="none" />
                  <path d="M 32 64 Q 35 61 37 58" fill="none" />
                  <path d="M 24 46 Q 27 43 30 46" fill="none" />
                  <path d="M 32 28 Q 33 33 37 34" fill="none" />
                </g>

                {/* Quả tinh cầu thái dương năng lượng */}
                <circle
                  cx="50"
                  cy="46"
                  r="22"
                  fill={`url(#solar-star-grad-${uniqueId})`}
                  style={{ filter: 'drop-shadow(0 0 14px rgba(245, 158, 11, 0.85))' }}
                />

                {/* Vệt plasma uốn lượn trên bề mặt */}
                <path
                  d="M 36 40 Q 42 34 49 38"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.8"
                  fill="none"
                />
                <path
                  d="M 44 53 Q 54 57 62 48"
                  stroke="#fef08a"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  opacity="0.75"
                  fill="none"
                />

                {/* Lõi dương quang rực sáng */}
                <circle
                  cx="48"
                  cy="44"
                  r="8.5"
                  fill="#ffffff"
                  opacity="0.95"
                  style={{ filter: 'drop-shadow(0 0 6px #fde047)' }}
                />
                <circle cx="48" cy="44" r="4" fill="#ffffff" />
              </g>
            )}

            {/* OPTION 4: TINH CẦU SINH MỆNH & VỆ TINH */}
            {selectedLightOption === 'celestial-ocean' && (
              <g className={getRainbowMotionClass()}>
                {/* Hào quang lam ngọc đại dương */}
                <circle
                  cx="50"
                  cy="46"
                  r="33"
                  fill={`url(#ocean-halo-grad-${uniqueId})`}
                />

                {/* Quỹ đạo elip phát sáng của vệ tinh */}
                <ellipse
                  cx="50"
                  cy="46"
                  rx="36"
                  ry="13"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  opacity="0.65"
                  transform="rotate(-28 50 46)"
                />

                {/* Quả tinh cầu đại dương xanh biếc */}
                <circle
                  cx="50"
                  cy="46"
                  r="22"
                  fill={`url(#ocean-globe-grad-${uniqueId})`}
                  style={{ filter: 'drop-shadow(0 4px 10px rgba(2, 132, 199, 0.45))' }}
                />

                {/* Các dải lục địa ngọc bích mềm mại */}
                <path
                  d="M 37 36 C 41 32, 49 33, 52 38 C 47 43, 42 44, 38 41 Z"
                  fill="#10b981"
                  opacity="0.9"
                />
                <path
                  d="M 46 47 C 52 44, 62 45, 65 52 C 58 56, 50 55, 45 51 Z"
                  fill="#34d399"
                  opacity="0.9"
                />
                <path
                  d="M 31 48 C 35 46, 38 51, 35 56 C 30 55, 29 51, 31 48 Z"
                  fill="#10b981"
                  opacity="0.85"
                />

                {/* Dải mây khí quyển trắng lướt qua bề mặt */}
                <path
                  d="M 31 38 Q 45 43 59 36"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.75"
                  fill="none"
                />
                <path
                  d="M 39 56 Q 52 51 68 56"
                  stroke="#ffffff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  opacity="0.8"
                  fill="none"
                />

                {/* Điểm phản quang 3D */}
                <circle cx="42" cy="36" r="1.8" fill="#ffffff" opacity="0.85" />

                {/* Vệ tinh nhỏ lấp lánh trên quỹ đạo */}
                <g style={{ filter: 'drop-shadow(0 0 5px rgba(254, 240, 138, 0.9))' }}>
                  <circle cx="75" cy="32" r="4.2" fill={`url(#satellite-grad-${uniqueId})`} />
                  <circle cx="74" cy="31" r="1.3" fill="#ffffff" />
                  <polygon
                    points="75,27 76,30 79,31 76,32 75,35 74,32 71,31 74,30"
                    fill="#fde047"
                  />
                </g>
              </g>
            )}

            {/* OPTION 5: TINH CẦU LA BÀN NIÊN THỜI */}
            {(selectedLightOption === 'celestial-chrono' || selectedLightOption === 'time-ring') && (
              <g className={getRainbowMotionClass()}>
                {/* Vành thiên văn ngoài hoàng đồng */}
                <circle
                  cx="50"
                  cy="46"
                  r="31"
                  fill="none"
                  stroke={`url(#chrono-brass-grad-${uniqueId})`}
                  strokeWidth="2.2"
                />
                <circle
                  cx="50"
                  cy="46"
                  r="27"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeDasharray="2.5 2.5"
                  opacity="0.75"
                />

                {/* Vành quỹ đạo hoàng đạo nghiêng 3D */}
                <ellipse
                  cx="50"
                  cy="46"
                  rx="36"
                  ry="13"
                  fill="none"
                  stroke={`url(#saturn-ring-grad-${uniqueId})`}
                  strokeWidth="2"
                  transform="rotate(-25 50 46)"
                />

                {/* 4 Điểm sao phương vị thiên văn */}
                <circle cx="50" cy="15" r="2.4" fill="#facc15" style={{ filter: 'drop-shadow(0 0 4px #f59e0b)' }} />
                <circle cx="50" cy="77" r="2" fill="#facc15" opacity="0.85" />
                <circle cx="19" cy="46" r="2" fill="#38bdf8" opacity="0.85" />
                <circle cx="81" cy="46" r="2" fill="#ec4899" opacity="0.85" />

                {/* Vạch khắc thiên văn */}
                <line x1="50" y1="17" x2="50" y2="21" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="68" y1="28" x2="65" y2="31" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
                <line x1="32" y1="28" x2="35" y2="31" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />

                {/* Quả tinh cầu trung tâm: La Bàn Niên Thời */}
                <circle
                  cx="50"
                  cy="46"
                  r="16"
                  fill={`url(#chrono-core-grad-${uniqueId})`}
                  opacity="0.92"
                  style={{ filter: 'drop-shadow(0 0 9px rgba(251, 191, 36, 0.8))' }}
                />
                <circle cx="50" cy="46" r="5" fill="#ffffff" opacity="0.95" />
                {/* Ngôi sao La Bàn 8 cánh */}
                <polygon
                  points="50,32 52.5,42 62,46 52.5,50 50,60 47.5,50 38,46 47.5,42"
                  fill="#ffffff"
                  style={{ filter: 'drop-shadow(0 0 3px #fde047)' }}
                />
                <polygon
                  points="50,37 51.8,43.5 58,46 51.8,48.5 50,55 48.2,48.5 42,46 48.2,43.5"
                  fill="#facc15"
                />
              </g>
            )}

            {/* OPTION 6: TINH CẦU NHẬT THỰC KIM CƯƠNG */}
            {selectedLightOption === 'celestial-eclipse' && (
              <g className={getRainbowMotionClass()}>
                {/* Vệt nhật miện kim cương bừng sáng rực rỡ tại góc trên phải */}
                <circle
                  cx="66"
                  cy="30"
                  r="19"
                  fill={`url(#diamond-flare-grad-${uniqueId})`}
                />
                {/* Ngôi sao nhẫn kim cương 4 cánh sắc nét */}
                <polygon
                  points="66,16 68.5,28 81,30 68.5,32 66,44 63.5,32 51,30 63.5,28"
                  fill="#ffffff"
                  style={{ filter: 'drop-shadow(0 0 7px #fef08a)' }}
                />
                <circle cx="66" cy="30" r="3.2" fill="#ffffff" />
                <circle cx="66" cy="30" r="1.5" fill="#facc15" />

                {/* Quả tinh cầu nhật thực kỳ bí */}
                <circle
                  cx="50"
                  cy="46"
                  r="22"
                  fill={`url(#eclipse-body-grad-${uniqueId})`}
                  style={{ filter: 'drop-shadow(0 4px 14px rgba(15, 23, 42, 0.55))' }}
                />

                {/* Viền sáng rìa kim loại (Rim Lighting) sắc bén */}
                <path
                  d="M 32 34 A 22 22 0 0 1 70 38"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <path
                  d="M 68 36 A 22 22 0 0 1 72 48"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* Tinh tú li ti trên nền tinh cầu */}
                <circle cx="43" cy="48" r="1.2" fill="#ffffff" opacity="0.65" />
                <circle cx="55" cy="54" r="1" fill="#bae6fd" opacity="0.55" />
              </g>
            )}

            {/* OPTION 7: VÒM CẦU VỒNG CỔ ĐIỂN */}
            {selectedLightOption === 'arch-panoramic' && (
              <g className={getRainbowMotionClass()}>
                <path d="M 11, 75 A 39 39 0 0 1 89, 75" stroke="#f43f5e" strokeWidth="4.6" strokeLinecap="round" fill="none" />
                <path d="M 15, 75 A 35 35 0 0 1 85, 75" stroke="#fb923c" strokeWidth="4.6" strokeLinecap="round" fill="none" />
                <path d="M 19, 75 A 31 31 0 0 1 81, 75" stroke="#facc15" strokeWidth="4.6" strokeLinecap="round" fill="none" />
                <path d="M 23, 75 A 27 27 0 0 1 77, 75" stroke="#10b981" strokeWidth="4.6" strokeLinecap="round" fill="none" />
                <path d="M 27, 75 A 23 23 0 0 1 73, 75" stroke="#38bdf8" strokeWidth="4.6" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* LEGACY ALIAS: CUỐN SÁCH MỞ THẦN KỲ */}
            {selectedLightOption === 'open-book' && (
              <g className={getRainbowMotionClass()}>
                <ellipse cx="50" cy="52" rx="30" ry="18" fill={`url(#book-aura-grad-${uniqueId})`} />
                <path d="M 20 74 C 25 56, 38 52, 48 54" fill="none" stroke={`url(#rainbow-ribbon-grad-${uniqueId})`} strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
                <path d="M 80 74 C 75 56, 62 52, 52 54" fill="none" stroke={`url(#rainbow-ribbon-grad-${uniqueId})`} strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
                <path d="M 49 48 C 34 43, 19 48, 16 61 C 27 58, 39 57, 49 60 Z" fill={`url(#book-page-grad-l-${uniqueId})`} stroke="#38bdf8" strokeWidth="0.9" />
                <path d="M 51 48 C 66 43, 81 48, 84 61 C 73 58, 61 57, 51 60 Z" fill={`url(#book-page-grad-r-${uniqueId})`} stroke="#ec4899" strokeWidth="0.9" />
                <path d="M 50 47 L 50 63" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="50" cy="47" r="2.2" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 3px #facc15)' }} />
              </g>
            )}

            {/* LEGACY ALIAS: NGỌN BÚT LÔNG VŨ */}
            {selectedLightOption === 'feather-quill' && (
              <g className={getRainbowMotionClass()}>
                <path d="M 37 68 C 42 56, 55 44, 69 45 C 79 46, 85 56, 86 72" fill="none" stroke={`url(#rainbow-horiz-grad-${uniqueId})`} strokeWidth="3.4" strokeLinecap="round" />
                <path d="M 65 19 Q 53 42 37 68" fill="none" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
                <path d="M 65 19 C 58 23, 46 31, 39 46 C 44 45, 48 43, 52 40 C 46 45, 41 50, 38 58 C 43 56, 47 54, 50 51 L 37 68 C 45 52, 55 35, 65 19 Z" fill={`url(#quill-vane-grad-${uniqueId})`} opacity="0.92" />
                <polygon points="37,68 33,74 38,72 40,66" fill="#f59e0b" />
                <circle cx="33" cy="74" r="2.2" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #facc15)' }} />
              </g>
            )}

            {/* LEGACY ALIAS: DẢI NGÂN HÀ SAO BĂNG */}
            {selectedLightOption === 'stardust-arc' && (
              <g className={getRainbowMotionClass()}>
                <path d="M 12 75 C 18 50, 36 30, 60 26 C 74 24, 82 34, 88 75" fill="none" stroke={`url(#stardust-ribbon-grad-${uniqueId})`} strokeWidth="5.2" strokeLinecap="round" />
                <polygon points="60,16 63,23 70,26 63,29 60,36 57,29 50,26 57,23" fill="#ffffff" />
                <circle cx="60" cy="26" r="2.2" fill="#fef08a" />
                <circle cx="48" cy="31" r="1.3" fill="#ffffff" opacity="0.95" />
                <circle cx="36" cy="38" r="1.5" fill="#fef08a" opacity="0.9" />
              </g>
            )}

            {/* 2.3 Đám Mây Bay Qua Bay Lại (Option Traverse Cloud) */}
            {showTraverse && (
              <g className="animate-cloud-traverse">
                <path
                  d="M 40, 31 C 37, 31 35, 27 38, 24 C 40, 20 45, 19 49, 21 C 52, 16 59, 16 62, 20 C 66, 20 68, 24 66, 28 C 68, 32 65, 35 60, 34 C 57, 35 43, 35 40, 31 Z"
                  fill={`url(#cloud-front-grad-${uniqueId})`}
                  style={{ filter: 'drop-shadow(0 2.5px 5px rgba(0,0,0,0.12))' }}
                  opacity="0.95"
                />
                <circle cx="50" cy="23" r="1.2" fill="#bae6fd" opacity="0.85" />
                <circle cx="56" cy="26" r="1" fill="#fbcfe8" opacity="0.85" />
              </g>
            )}

            {/* 2.4 Hai bờ mây trắng nâng đỡ hai chân vòm cầu vồng (ĐÃ BỎ MÂY Ở GIỮA VÒM) */}
            {/* Mây chân trái */}
            <g className={getCloudMotionClass('left')}>
              <path
                d="M 4, 82 C 1, 82 -1, 76 2, 71 C 3, 66 9, 64 13, 65 C 16, 58 25, 57 29, 62 C 34, 61 39, 65 38, 71 C 42, 74 41, 81 35, 82 Z"
                fill={`url(#cloud-front-grad-${uniqueId})`}
                style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.12))' }}
              />
              <circle cx="16" cy="74" r="2" fill="#fbcfe8" opacity="0.8" />
            </g>

            {/* Mây chân phải */}
            <g className={getCloudMotionClass('right')}>
              <path
                d="M 64, 82 C 61, 82 59, 75 63, 71 C 64, 65 71, 63 75, 65 C 78, 57 88, 58 92, 63 C 97, 64 100, 70 98, 75 C 101, 79 97, 83 91, 82 Z"
                fill={`url(#cloud-front-grad-${uniqueId})`}
                style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.12))' }}
              />
              <circle cx="84" cy="74" r="2" fill="#bae6fd" opacity="0.8" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
