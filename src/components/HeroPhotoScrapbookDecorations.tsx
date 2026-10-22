import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * 🌌 BỘ SƯU TẬP 13 CÂU NÓI TIẾNG ANH THIÊN HÀ & VÌ SAO (CELESTIAL QUOTES)
 * Được chọn ngẫu nhiên / đồng bộ theo từng ngày trong năm
 */
export const DAILY_CELESTIAL_MESSAGES: string[] = [
  'May the stars align in your favor.',
  'The moon does not fight the darkness; it simply shines through it.',
  'Trust the timing of the universe; even the eclipse must surrender to dawn.',
  'What is meant for you will orbit back across a thousand galaxies.',
  'Within your quiet heart lies an entire galaxy waiting to bloom.',
  'Let your soul be the compass when earthly constellations fade.',
  'Even the furthest star was once just a whisper in the cosmic dark.',
  'A single hope can ignite a galaxy; a single heartbeat can defy the void.',
  'Not all wanderers are lost; some are dancing to the celestial tide.',
  'Let the moonlight heal what the daylight burned.',
  'Behind the heavy clouds, your constellation has never stopped shining.',
  'Where you see an end, the cosmos is planting a brilliant supernova.',
  'Breathe in starlight, breathe out sorrow. Tomorrow holds a new orbit.',
];

/**
 * 🎨 SVG PATTERNS & DEFS: Gingham Cacao & Washi Tape
 */
export const ScrapbookSvgDefs: React.FC = () => (
  <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <defs>
      {/* 1. Hoa văn vải Kẻ Caro Gingham Nâu Cacao cho chân thẻ */}
      <pattern id="ginghamPlaidSnippet" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#F5ECE4" />
        <rect x="0" y="0" width="6" height="6" fill="#D7C0B2" opacity="0.65" />
        <rect x="6" y="6" width="6" height="6" fill="#D7C0B2" opacity="0.65" />
        <rect x="0" y="6" width="6" height="6" fill="#BAA091" opacity="0.45" />
        <rect x="6" y="0" width="6" height="6" fill="#BAA091" opacity="0.45" />
      </pattern>

      {/* 2. Hoa văn vải Ca-rô Nâu Cacao kích thước 16x16 */}
      <pattern id="ginghamCocoa" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#F5ECE4" />
        <rect x="0" y="0" width="8" height="8" fill="#D7C0B2" opacity="0.65" />
        <rect x="8" y="8" width="8" height="8" fill="#D7C0B2" opacity="0.65" />
        <rect x="0" y="8" width="8" height="8" fill="#BAA091" opacity="0.45" />
        <rect x="8" y="0" width="8" height="8" fill="#BAA091" opacity="0.45" />
        <line x1="0" y1="0" x2="16" y2="0" stroke="#FAF5EF" strokeWidth="0.8" />
        <line x1="0" y1="0" x2="0" y2="16" stroke="#FAF5EF" strokeWidth="0.8" />
      </pattern>

      {/* 3. Băng keo Washi chấm bi trắng nền hồng */}
      <pattern id="polkaDotPink" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#F4D3D7" />
        <circle cx="5" cy="5" r="1.6" fill="#FFFFFF" opacity="0.88" />
      </pattern>
    </defs>
  </svg>
);

/**
 * 1️⃣ CHIẾC NƠ LỤA 3D (SOFT SEASON SILK RIBBON BOW)
 * - Bỏ huy hiệu tròn, giữ lại chiếc nơ lụa mềm mại
 * - Đặt nằm nghiêng ở góc rìa bức ảnh Polaroid
 * - Chế độ sáng: Tone hồng pastel nguyên bản (#F3D1D5, #E8A2A8, #D98890)
 * - Chế độ tối: Chuyển màu tím lavender thạch anh lấp lánh (#9C72C3, #764F9D, #B993E4)
 */
export const SoftSeasonRibbonBadge: React.FC<{
  className?: string;
  isDarkMode?: boolean;
  delay?: number;
}> = ({ className = '', isDarkMode = false, delay = 0.2 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -22 }}
      animate={{ opacity: 1, scale: 1, rotate: -22 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.1, rotate: -16 }}
      className={`relative select-none cursor-grab active:cursor-grabbing pointer-events-auto ${className}`}
      style={{
        filter: isDarkMode
          ? 'drop-shadow(0 5px 12px rgba(0,0,0,0.65))'
          : 'drop-shadow(0 4px 10px rgba(78,48,98,0.22))',
      }}
      onClick={(e) => e.stopPropagation()}
      title="Soft Season Ribbon"
    >
      {/* Chiếc Nơ Lụa 3D Bằng SVG */}
      <div className="w-18 h-9 sm:w-22 sm:h-11 flex items-center justify-center">
        <svg viewBox="0 0 96 48" className="w-full h-full overflow-visible" fill="none">
          <defs>
            <filter id={`bowShadow-${isDarkMode ? 'dark' : 'light'}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="1.5"
                floodColor={isDarkMode ? '#0E0818' : '#3A2825'}
                floodOpacity={isDarkMode ? 0.5 : 0.22}
              />
            </filter>
          </defs>

          {/* Cánh nơ bên trái */}
          <path
            d="M 48 16 C 36 6 18 10 16 22 C 14 32 32 30 48 18 Z"
            fill={isDarkMode ? '#8E67B6' : '#F3D1D5'}
            stroke={isDarkMode ? '#B993E4' : '#E29DA3'}
            strokeWidth="1.2"
            filter={`url(#bowShadow-${isDarkMode ? 'dark' : 'light'})`}
          />
          <path
            d="M 46 16 C 36 12 24 16 24 22 C 24 27 36 24 46 18 Z"
            fill={isDarkMode ? '#A67DD0' : '#F8E5E7'}
          />

          {/* Cánh nơ bên phải */}
          <path
            d="M 48 16 C 60 6 78 10 80 22 C 82 32 64 30 48 18 Z"
            fill={isDarkMode ? '#8E67B6' : '#F3D1D5'}
            stroke={isDarkMode ? '#B993E4' : '#E29DA3'}
            strokeWidth="1.2"
            filter={`url(#bowShadow-${isDarkMode ? 'dark' : 'light'})`}
          />
          <path
            d="M 50 16 C 60 12 72 16 72 22 C 72 27 60 24 50 18 Z"
            fill={isDarkMode ? '#A67DD0' : '#F8E5E7'}
          />

          {/* Dải ruy băng rủ xuống bên trái */}
          <path
            d="M 44 20 C 38 32 30 42 24 46 L 32 44 L 38 48 C 42 38 46 28 46 20 Z"
            fill={isDarkMode ? '#764F9D' : '#E8A2A8'}
            stroke={isDarkMode ? '#A57CD1' : '#D98890'}
            strokeWidth="1"
          />

          {/* Dải ruy băng rủ xuống bên phải */}
          <path
            d="M 52 20 C 58 32 66 42 72 46 L 64 44 L 58 48 C 54 38 50 28 50 20 Z"
            fill={isDarkMode ? '#764F9D' : '#E8A2A8'}
            stroke={isDarkMode ? '#A57CD1' : '#D98890'}
            strokeWidth="1"
          />

          {/* Nút thắt nơ trung tâm */}
          <ellipse
            cx="48"
            cy="18"
            rx="5"
            ry="4"
            fill={isDarkMode ? '#68418E' : '#D98890'}
            stroke={isDarkMode ? '#E7D5FA' : '#FFFFFF'}
            strokeWidth="0.8"
          />
          <circle
            cx="48"
            cy="18"
            r="2.5"
            fill={isDarkMode ? '#9C72C3' : '#F3D1D5'}
          />
        </svg>
      </div>
    </motion.div>
  );
};

/**
 * 2️⃣ HỘP THOẠI RETRO (RETRO MESSAGE DIALOG)
 * - Khôi phục màu sắc ban đầu: Tone Cacao & Kem hoài niệm [#44322D], viền [#D9C6B8], nền [#FAF5EE], nút hồng [#F3CCD1]
 * - Đồng bộ theo chế độ tối: Nền espresso trầm [#251B18], viền [#543D36], thanh tiêu đề [#1C1311], chữ [#FAF5EE]
 * - Bỏ icon lấp lánh (Sparkles) chỗ câu thông điệp theo yêu cầu người dùng
 * - Giữ các cải tiến logic:
 *   + Mặc định ở chế độ thu gọn -> Nút "Message" (bỏ icon bông tuyết)
 *   + Khi click mở rộng: Titlebar "secrets.dialog", kẹp ghim giấy kim loại hồng
 *   + Prompt: "Fancy a glimpse into today’s message?"
 *   + Trước khi mở: Cặp nút [yes] và [later]
 *   + Sau khi bấm [yes]: Hiển thị câu trích dẫn tiếng Anh ngẫu nhiên theo ngày (13 câu) và nút chuyển thành [close]
 */
export const RetroMessageDialog: React.FC<{
  className?: string;
  isDarkMode?: boolean;
  delay?: number;
}> = ({ className = '', isDarkMode = false, delay = 0.5 }) => {
  // Mặc định luôn ở chế độ later (thu gọn), chỉ mở ra khi bấm vào
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasOpenedMessage, setHasOpenedMessage] = useState<boolean>(false);

  // Chọn thông điệp của ngày dựa theo ngày trong năm (ổn định theo ngày)
  const getTodayQuote = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    return DAILY_CELESTIAL_MESSAGES[dayOfYear % DAILY_CELESTIAL_MESSAGES.length];
  };

  const todayMessage = getTodayQuote();

  // Khi ở chế độ thu gọn (later button mode)
  if (!isExpanded) {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(true);
        }}
        className={`px-3 py-1.5 rounded-full border shadow-md flex items-center gap-1.5 cursor-pointer pointer-events-auto select-none font-mono text-[10.5px] tracking-wide transition-colors duration-300 ${
          isDarkMode
            ? 'bg-[#22133B]/90 border-[#653C93] text-[#F3E8FF] hover:bg-[#2F1A52] hover:border-[#965FE0]'
            : 'bg-[#FDFBF7] border-[#E5DFD6] text-[#3D2E28] hover:bg-white hover:border-[#D0C6BA]'
        } ${className}`}
        style={{
          filter: isDarkMode
            ? 'drop-shadow(0 6px 14px rgba(18,7,32,0.65))'
            : 'drop-shadow(0 6px 14px rgba(45,30,25,0.14))',
        }}
        title="Mở thông điệp hôm nay"
      >
        <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${isDarkMode ? 'bg-[#C084FC]' : 'bg-[#E58296]'}`} />
        <span className="font-semibold">Message</span>
      </motion.button>
    );
  }

  // Khi hộp thoại bung mở ra
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
      className={`w-56 sm:w-64 pointer-events-auto rounded-xl border-2 shadow-xl overflow-hidden select-none transition-colors duration-300 cursor-grab active:cursor-grabbing ${
        isDarkMode
          ? 'bg-[#1C112E]/95 border-[#5A3580] text-[#F3E8FF]'
          : 'bg-[#FAF8F5] border-[#E8E1D8] text-[#3D2E28]'
      } ${className}`}
      style={{
        filter: isDarkMode
          ? 'drop-shadow(0 10px 24px rgba(15,7,28,0.75))'
          : 'drop-shadow(0 10px 24px rgba(45,30,25,0.18))',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Titlebar màu tím ở dark mode kèm 3 chấm + Kẹp ghim giấy kim loại SVG */}
      <div
        className={`px-3 py-1.5 flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-[#140B22] text-[#F3E8FF]' : 'bg-[#44322D] text-[#FAF5EE]'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-[#C084FC]' : 'bg-[#E8A6AE]'}`} />
          <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-[#E9D5FF]' : 'bg-[#FAF5EE]'}`} />
          <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-[#7C3AED]' : 'bg-[#D7C0B2]'}`} />
        </div>
        <span className={`font-mono text-[8.5px] tracking-wider ${isDarkMode ? 'text-[#C4B5FD]' : 'text-[#D8BDB7]'}`}>
          secrets.dialog
        </span>

        {/* Kẹp ghim giấy kim loại kẹp qua mép */}
        <div className="w-3.5 h-6 -mt-2">
          <svg viewBox="0 0 16 32" className="w-full h-full" fill="none">
            <path
              d="M 4 8 L 4 24 C 4 28 12 28 12 24 L 12 4 C 12 1 6 1 6 4 L 6 20 C 6 22 10 22 10 20 L 10 8"
              stroke={isDarkMode ? '#C084FC' : '#D98890'}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Phần thân hỏi đáp */}
      <div className="p-3">
        <div className="flex items-start gap-2.5 mb-2.5">
          {/* Vòng tròn chấm than */}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-inner ${
            isDarkMode ? 'bg-[#6B21A8]/50 text-[#F5EEFD]' : 'bg-[#F3CCD1] text-[#B85360]'
          }`}>
            !
          </div>
          <p className="text-[10.5px] sm:text-[11.5px] font-sans font-medium leading-snug pt-0.5">
            Fancy a glimpse into today’s message?
          </p>
        </div>

        {/* Thông điệp tiếng Anh bung ra khi người dùng bấm [yes] */}
        <AnimatePresence>
          {hasOpenedMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-2.5 mb-2.5 rounded-lg border text-[10px] sm:text-[10.5px] font-serif italic leading-relaxed shadow-inner ${
                isDarkMode
                  ? 'bg-[#27153D] border-[#5E367E] text-[#F5EEFD]'
                  : 'bg-[#FCFAF8] border-[#E8E0D6] text-[#583942]'
              }`}
            >
              <span>&ldquo;{todayMessage}&rdquo;</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nút hành động */}
        <div
          className={`flex items-center justify-end gap-2 pt-2 border-t transition-colors ${
            isDarkMode ? 'border-[#3E215B]' : 'border-[#E8DDD4]'
          }`}
        >
          {hasOpenedMessage ? (
            /* Sau khi mở thông điệp: nút chuyển thành duy nhất 1 nút [close] */
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setHasOpenedMessage(false);
              }}
              className={`px-3.5 py-1 rounded-sm text-[10px] font-sans font-bold cursor-pointer shadow-xs transition-colors ${
                isDarkMode
                  ? 'bg-[#9333EA] text-white hover:bg-[#A855F7]'
                  : 'bg-[#F3CCD1] text-[#44322D] hover:bg-[#EAAEB6]'
              }`}
            >
              close
            </button>
          ) : (
            /* Trước khi mở: Cặp nút [yes] và [later] */
            <>
              <button
                type="button"
                onClick={() => setHasOpenedMessage(true)}
                className={`px-3.5 py-1 rounded-sm text-[9.5px] font-sans font-bold cursor-pointer shadow-xs transition-colors ${
                  isDarkMode
                    ? 'bg-[#9333EA] text-white hover:bg-[#A855F7]'
                    : 'bg-[#F3CCD1] text-[#44322D] hover:bg-[#EAAEB6]'
                }`}
              >
                yes
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className={`px-3 py-1 rounded-sm border text-[9.5px] font-sans font-medium cursor-pointer shadow-xs transition-colors ${
                  isDarkMode
                    ? 'bg-[#25153A] border-[#5E387D] text-[#D8B4FE] hover:bg-[#341E50]'
                    : 'bg-[#F6F2EC] border-[#DDD5CA] text-[#634E47] hover:bg-white'
                }`}
              >
                later
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * 💖 TRÁI TIM THUẦN TÚY KHÔNG VIỀN (BORDERLESS HEART)
 */
export const BorderlessHeart: React.FC<{ size?: number; color?: string; glow?: string }> = ({
  size = 16,
  color = '#F472B6',
  glow = 'rgba(244, 114, 182, 0.85)',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
      stroke="none"
      strokeWidth={0}
    />
  </svg>
);

/**
 * 🌟 CON DẤU TRÒN A LIBRARY OF DAYDREAMS
 * - Kích thước nhỏ gọn xinh xắn, hài hòa với bố cục ảnh
 * - Trái tim ở tâm xoay nhẹ nhàng đồng bộ cùng dòng chữ
 */
export const MakeAWishStamp: React.FC<{ onClick?: () => void; isDarkMode?: boolean }> = ({ onClick, isDarkMode }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-full border border-pink-400/40 flex items-center justify-center cursor-pointer hover:border-pink-300 hover:scale-105 transition-all shadow-[0_0_12px_rgba(244,114,182,0.22)] ${
        isDarkMode ? 'bg-[#21142c]/80' : 'bg-white/80 backdrop-blur-xs'
      }`}
      title="A Library of Daydreams"
    >
      {/* 1. DÒNG CHỮ CHẠY VÒNG TRÒN XOAY ĐỀU 360 ĐỘ */}
      <svg
        className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]"
        viewBox="0 0 100 100"
      >
        <defs>
          {/* Đường dẫn hình tròn bán kính r = 36.5 nằm tại tâm (50, 50) */}
          <path
            id="circlePathWish"
            d="M 50, 50 m -36.5, 0 a 36.5,36.5 0 1,1 73,0 a 36.5,36.5 0 1,1 -73,0"
          />
        </defs>
        <text className={`text-[7.2px] font-mono tracking-[0.12em] font-bold uppercase select-none ${
          isDarkMode ? 'fill-pink-200/90' : 'fill-pink-500/85'
        }`}>
          <textPath xlinkHref="#circlePathWish" startOffset="0%" textLength="225" lengthAdjust="spacing">
            ★ A LIBRARY OF DAYDREAMS ★
          </textPath>
        </text>
      </svg>

      {/* 2. TRÁI TIM Ở TÂM: XOAY NHẸ CÙNG VỚI DÒNG CHỮ */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: 'linear',
        }}
        className="flex items-center justify-center pointer-events-none"
      >
        <BorderlessHeart size={13} color="#F472B6" glow="rgba(244, 114, 182, 0.85)" />
      </motion.div>
    </button>
  );
};

