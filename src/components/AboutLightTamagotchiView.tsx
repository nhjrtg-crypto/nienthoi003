import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Send, 
  Copy, 
  Check, 
  AlertTriangle, 
  Server, 
  MessageCircle, 
  Bookmark,
  X
} from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';
import {
  subscribeToIntroHearts,
  incrementIntroHearts,
  subscribeToIntroNotesStyle2,
  addIntroNoteStyle2,
  IntroReaderMessage,
} from '../services/firebase';

// Danh sách các trang nội dung bên trong Tamagotchi
export const TAMA_STEPS = [
  { id: 'welcome', name: 'Chào mừng', emoji: '🌸', title: 'Chào Mừng Bạn Đến Với Web' },
  { id: 'purpose', name: 'Mục đích', emoji: '🎀', title: 'Mục Đích Phi Thương Mại' },
  { id: 'warning', name: 'Cảnh báo 18+', emoji: '⚠️', title: 'Cảnh Báo Độ Tuổi & Đam Mỹ' },
  { id: 'server', name: 'Hạ tầng web', emoji: '🖥️', title: 'Hạ Tầng & Bảo Mật Dữ Liệu' },
  { id: 'comments', name: 'Bình luận', emoji: '💬', title: 'Quy Tắc Bình Luận Văn Minh' },
  { id: 'platforms', name: 'Nền tảng khác', emoji: '🌐', title: 'Wattpad & WordPress Chính Chủ' },
] as const;

export type TamaTabId = typeof TAMA_STEPS[number]['id'] | 'messages';

interface ReaderMessage {
  id: number;
  text: string;
  time: string;
  sender?: string;
}

interface AboutLightTamagotchiViewProps {
  onBackToNovels: () => void;
  currentOption?: 'style1' | 'style2';
  onChangeOption?: (opt: 'style1' | 'style2') => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

/**
 * Chuỗi dây treo móc khóa hạt cườm kẹo thạch 3D Jelly trên máy Tamagotchi
 */
export const TamagotchiCharmBeads: React.FC = () => {
  return (
    <div className="absolute -top-7 left-8 flex flex-col items-center select-none pointer-events-none z-20">
      {/* 1. Vòng khoen kim loại bóng loáng (Metallic Keyring Eyelet) */}
      <div className="w-5 h-5 rounded-full border-2 border-pink-200 bg-gradient-to-tr from-white via-pink-100 to-white shadow-xs flex items-center justify-center">
        {/* Lỗ khuyên rỗng ở giữa */}
        <div className="w-2.5 h-2.5 rounded-full border border-pink-300 bg-pink-50" />
      </div>

      {/* 2. Dây nối bạc ánh hồng (Metallic Silver-Pink Link Wire) */}
      <div className="w-[1.5px] h-3 bg-gradient-to-b from-pink-300 to-rose-400" />

      {/* 3. Bông hoa anh đào kẹo thạch 3D Jelly lắc lư đung đưa nhịp nhàng */}
      <motion.div
        animate={{ rotate: [-4, 5, -4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'top center' }}
        className="flex flex-col items-center"
      >
        {/* Bông hoa anh đào kẹo thạch 3D Jelly (Translucent Sakura Gumdrop) */}
        <div className="w-7 h-7 rounded-full border-2 border-white/90 bg-gradient-to-br from-[#ffffff] via-[#ffb4c8] to-[#f43f5e] flex items-center justify-center text-xs shadow-[0_3px_8px_rgba(244,63,94,0.35),inset_0_2px_4px_rgba(255,255,255,0.9)] relative overflow-hidden">
          {/* Vệt bóng cong lưỡi liềm phản chiếu mặt thạch */}
          <div className="jelly-crescent-sheen" />
          <span className="relative z-10">🌸</span>
        </div>
      </motion.div>
    </div>
  );
};

export const AboutLightTamagotchiView: React.FC<AboutLightTamagotchiViewProps> = ({
  onBackToNovels,
  currentOption = 'style2',
  onChangeOption,
}) => {
  // Trang giới thiệu Style 2 (Máy Trứng Tamagotchi Pastel) bỏ hoàn toàn chế độ darkmode, mặc định chỉ có chế độ sáng
  const isDarkEffective = false;

  // 1. Quản lý Tab & Nút bấm
  const [activeTab, setActiveTab] = useState<TamaTabId>('welcome');
  const [hasPressedA, setHasPressedA] = useState<boolean>(false);
  const [isVinylPlaying, setIsVinylPlaying] = useState<boolean>(true);

  // 2. Trạng thái sao chép Link
  const [copiedWattpad, setCopiedWattpad] = useState<boolean>(false);
  const [copiedWordpress, setCopiedWordpress] = useState<boolean>(false);

  const copyToClipboard = (text: string, type: 'wattpad' | 'wordpress') => {
    try {
      navigator.clipboard.writeText(text);
      if (type === 'wattpad') {
        setCopiedWattpad(true);
        setTimeout(() => setCopiedWattpad(false), 2000);
      } else {
        setCopiedWordpress(true);
        setTimeout(() => setCopiedWordpress(false), 2000);
      }
      showToast('Đã sao chép liên kết vào bộ nhớ tạm 🌸');
    } catch {
      // fallback
    }
  };

  // 3. Đồng hồ số thời gian thực ở thanh trạng thái
  const [deviceTime, setDeviceTime] = useState<string>(() => {
    try {
      const now = new Date();
      return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return '10:24 PM';
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const now = new Date();
        setDeviceTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      } catch {}
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // 4. Số lượng tim & Giới hạn mỗi trình duyệt chỉ thả tim 1 lần (Đồng bộ Firestore thực, khởi tạo 0)
  const [tamaHearts, setTamaHearts] = useState<number>(0);

  const [hasLiked, setHasLiked] = useState<boolean>(() => {
    try {
      return safeStorage.getItem('cosmo_has_liked_tama') === 'true';
    } catch {
      return false;
    }
  });

  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [isHeartFlashing, setIsHeartFlashing] = useState<boolean>(false);

  // 5. Thông báo Toast nổi trên màn hình
  const [cuteToastMessage, setCuteToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setCuteToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setCuteToastMessage(null);
      toastTimeoutRef.current = null;
    }, 2800);
  };

  // 6. Hòm thư lời nhắn & Form gửi (Khởi tạo rỗng, đồng bộ Firestore thời gian thực trên mọi thiết bị)
  const [chatInput, setChatInput] = useState<string>('');
  const [nicknameInput, setNicknameInput] = useState<string>('');
  const [sentSuccessMsg, setSentSuccessMsg] = useState<string | null>(null);
  const [recentMessages, setRecentMessages] = useState<IntroReaderMessage[]>([]);

  // Lắng nghe dữ liệu thời gian thực từ Firestore và xóa triệt để cache tin nhắn giả lập
  useEffect(() => {
    try {
      safeStorage.removeItem('cosmo_tama_messages');
      safeStorage.removeItem('cosmo_tama_hearts');
    } catch {}

    const unsubHearts = subscribeToIntroHearts('style2', (count) => {
      setTamaHearts(count);
    });
    const unsubNotes = subscribeToIntroNotesStyle2((messages) => {
      setRecentMessages(messages);
    });

    return () => {
      unsubHearts();
      unsubNotes();
    };
  }, []);

  const handleSendMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const sender = nicknameInput.trim() || `Độc giả #${Math.floor(100 + Math.random() * 900)}`;
    try {
      await addIntroNoteStyle2(sender, trimmed);

      if (!hasLiked) {
        setHasLiked(true);
        try {
          safeStorage.setItem('cosmo_has_liked_tama', 'true');
        } catch {}
        incrementIntroHearts('style2').catch(console.error);
      }

      const heartId = Date.now();
      setFloatingHearts((prev) => [...prev.slice(-6), { id: heartId, x: Math.random() * 80 - 40 }]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 1200);

      setSentSuccessMsg(`Đã gửi: "${trimmed}" 💌`);
      setChatInput('');
      setTimeout(() => {
        setSentSuccessMsg(null);
      }, 3500);
    } catch (err) {
      console.error('[AboutLightTamagotchiView] Error sending message:', err);
      showToast('Có lỗi khi gửi lời nhắn, vui lòng thử lại! 🌸');
    }
  };

  // Nút [A]: Lật tuần hoàn trang tiếp theo
  const handlePressA = () => {
    setHasPressedA(true);
    if (activeTab === 'messages') {
      setActiveTab('welcome');
      return;
    }
    const currentIdx = TAMA_STEPS.findIndex((s) => s.id === activeTab);
    const nextIdx = (currentIdx + 1) % TAMA_STEPS.length;
    setActiveTab(TAMA_STEPS[nextIdx].id);
  };

  // Nút [B]: Thả tim (Cộng dồn trên Firestore trên mọi thiết bị)
  const handlePressB = () => {
    if (hasLiked) {
      showToast('Bạn đã thả tim rồi nè, cảm ơn bạn rất nhiều! (｡♥‿♥｡)');
      return;
    }

    setHasLiked(true);
    try {
      safeStorage.setItem('cosmo_has_liked_tama', 'true');
    } catch {}
    incrementIntroHearts('style2').catch(console.error);

    const id = Date.now();
    const x = Math.random() * 80 - 40;
    setFloatingHearts((prev) => [...prev.slice(-6), { id, x }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1200);

    setIsHeartFlashing(true);
    setTimeout(() => {
      setIsHeartFlashing(false);
    }, 450);

    showToast('Cảm ơn bạn đã thả tim ủng hộ! (づ｡◕‿‿◕｡)づ');
  };

  // Nút [C]: Quay về trang đầu
  const handlePressC = () => {
    setActiveTab('welcome');
  };

  return (
    <div
      className={`relative min-h-screen text-stone-800 pb-28 pt-4 px-3 sm:px-6 transition-colors duration-500 overflow-x-hidden ${
        isDarkEffective ? 'bg-[#18131d] text-stone-200' : 'bg-[#fff8f9]'
      }`}
      style={{
        fontFamily: "'Itim', 'Comfortaa', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* NỀN KHĂN TRẢI BÀN CARO DÂU TÂY PASTEL */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 ${isDarkEffective ? 'opacity-15' : 'opacity-30'}`}
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(244, 114, 182, 0.12) 1.5px, transparent 1.5px),
            linear-gradient(rgba(244, 114, 182, 0.12) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '26px 26px',
        }}
      />

      {/* TOP HEADER BAR: Back Button & Style Switcher */}
      <header className="relative z-30 max-w-lg mx-auto mb-4 px-2">
        <div className={`p-2.5 rounded-full border shadow-sm backdrop-blur-md flex items-center justify-between transition-all ${
          isDarkEffective
            ? 'bg-[#241c2c]/90 border-pink-900/40 text-stone-200'
            : 'bg-white/90 border-[#FBCFE8] text-stone-800'
        }`}>
          {/* Close / Return Button */}
          <button
            type="button"
            onClick={onBackToNovels}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isDarkEffective
                ? 'bg-[#2e2338] hover:bg-[#3b2d49] border-pink-900/60 text-stone-300 hover:text-white'
                : 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-[#8A4C5D] hover:text-black'
            }`}
            title="Quay lại danh mục truyện"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Option Selector Pills: STYLE 1 (Sổ Kế Hoạch 2 Mặt) | STYLE 2 (Máy Trứng Tamagotchi) */}
          <div className="flex items-center gap-2 shrink-0">
            {onChangeOption && (
              <div className={`p-1 rounded-full border flex items-center shadow-inner text-xs ${
                isDarkEffective
                  ? 'bg-[#1b1422] border-pink-950/60'
                  : 'bg-[#FFE4EC]/70 border-[#FBCFE8]'
              }`}>
                <button
                  type="button"
                  onClick={() => onChangeOption('style1')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    currentOption === 'style1'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                      : isDarkEffective ? 'text-stone-400 hover:text-pink-200' : 'text-[#8A4C5D] hover:text-black'
                  }`}
                  title="Style 1: Sổ Kế Hoạch 2 Mặt Nền Trái Tim"
                >
                  Style 1
                </button>

                <button
                  type="button"
                  onClick={() => onChangeOption('style2')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    currentOption === 'style2'
                      ? isDarkEffective ? 'bg-[#c04b77] text-white shadow-xs' : 'bg-[#E14B7B] text-white shadow-xs'
                      : isDarkEffective ? 'text-stone-400 hover:text-pink-200' : 'text-[#8A4C5D] hover:text-black'
                  }`}
                  title="Style 2: Máy Trứng Tamagotchi Pastel"
                >
                  Style 2
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* TOAST NOTIFICATION THÔNG BÁO NỔI PHONG CÁCH TIỆM BÁNH (FONT ITIM, CỠ 12PX) - ĐỒNG BỘ STYLE 1 */}
      {cuteToastMessage && (
        <div className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 pointer-events-none">
          <div className="cute-toast-pill px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white text-[12px] shadow-[0_12px_32px_rgba(244,114,182,0.45)] border-2 border-white/70 flex items-center gap-2 select-none tracking-wide">
            <span className="text-sm select-none">🎀</span>
            <span className="font-itim text-[12px] leading-none">{cuteToastMessage}</span>
          </div>
        </div>
      )}

      {/* COMPONENT TAMAGOTCHI */}
      <div className="relative max-w-[490px] mx-auto mt-8 sm:mt-12 py-2 transition-all z-10">
        {/* VỎ MÁY QUẢ TRỨNG (Outer Shell): Hiệu ứng nổi khối 3D với góc bo tròn, viền dập nổi và đổ bóng nhẹ nhàng */}
        <div
          className={`rounded-[4.2rem] p-5 sm:p-8 border-[5px] sm:border-[6px] relative select-none ${
            isDarkEffective
              ? 'border-[#83425a] bg-[#291e2b] shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_3px_6px_rgba(255,255,255,0.2),inset_0_-8px_16px_rgba(0,0,0,0.4)]'
              : 'border-[#FBCFE8] bg-gradient-to-b from-[#FFF7FA] via-[#FFE6ED] to-[#FFD8E3] shadow-[0_20px_45px_-12px_rgba(244,114,182,0.20),0_10px_22px_-6px_rgba(0,0,0,0.06),0_4px_10px_rgba(244,114,182,0.10),inset_0_3px_6px_rgba(255,255,255,0.9),inset_0_-8px_18px_rgba(225,29,72,0.08),inset_0_0_0_2px_rgba(255,255,255,0.7)]'
          }`}
        >
          {/* Vệt phản quang vòm máy 3D lồi cong (Curved 3D Dome Highlight) */}
          <div className="absolute top-2 left-6 right-6 h-32 rounded-t-[3.8rem] bg-gradient-to-b from-white/75 via-white/20 to-transparent pointer-events-none select-none z-10" />

          {/* Vệt bóng sáng viền cạnh 3D (Subtle Side Rim Highlights) */}
          <div className="absolute inset-x-5 top-1 h-1.5 rounded-full bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none select-none z-10" />

          {/* Chuỗi dây treo móc khóa hạt cườm kẹo thạch 3D Jelly */}
          <TamagotchiCharmBeads />

          {/* Thẻ nhãn phong cách retro 3D dập nổi */}
          <div className="text-center pb-2 relative z-20">
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-mono font-black border ${
              isDarkEffective
                ? 'bg-[#3b2738] text-pink-300 border-pink-900/60 shadow-[2px_2px_6px_#17101a]'
                : 'bg-gradient-to-b from-white via-pink-50 to-pink-100 text-[#9d3b5d] border-white shadow-[0_3px_6px_rgba(244,63,94,0.18),inset_0_1px_2px_#ffffff,inset_0_-1px_2px_rgba(225,75,123,0.15)]'
            }`}>
              <span className="tracking-wider">MY SWEET PHONE</span>
            </div>
          </div>

          {/* CỤM LOA THOẠI & CAMERA TRƯỚC 3D KHẮC CHÌM */}
          <div className="flex items-center justify-center gap-3 pb-2.5 select-none relative z-20">
            {/* Loa thoại vát mép chìm */}
            <div className="w-14 sm:w-16 h-2 rounded-full bg-[#baa6b8] shadow-[inset_0_2px_3px_rgba(0,0,0,0.35),0_1px_2px_#ffffff] border border-pink-200/60" />
            {/* Camera trước dạng thấu kính 3D có giác lồi */}
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-[#8c748e] to-[#453147] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_1.5px_3px_#ffffff] border border-white/80 flex items-center justify-center relative">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_4px_rgba(34,211,238,0.9)]" />
              <div className="absolute top-0.5 left-0.5 w-1 h-0.5 bg-white/80 rounded-full" />
            </div>
          </div>

          {/* KHUNG VIỀN MÀN HÌNH NỔI 3D (Raised Outer Bezel) */}
          <div className="relative rounded-[2.2rem] p-1 bg-gradient-to-b from-white/95 via-pink-200/90 to-[#f9a8d4] shadow-[0_8px_20px_rgba(244,63,94,0.2),inset_0_2px_4px_#ffffff,inset_0_-2px_4px_rgba(225,29,72,0.16)] border border-white/80">
            {/* MÀN HÌNH MA TRẬN LCD LÕM 3D (Sunken LCD Screen with Real Glass Reflection) */}
            <div
              className={`rounded-3xl p-4 sm:p-6 space-y-4 relative overflow-hidden border tamagotchi-screen-lcd ${
                isDarkEffective
                  ? 'bg-[#201724] border-[#6b354b] text-[#ebd4e0] shadow-[inset_5px_5px_14px_#110c14,inset_-5px_-5px_14px_#2e2133]'
                  : 'bg-[#fffbfc] border-[#f7c2d2] text-[#543b49] shadow-[inset_5px_5px_14px_rgba(180,90,120,0.24),inset_-5px_-5px_14px_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(244,114,182,0.2)]'
              }`}
              style={{
                fontFamily: "'Be Vietnam Pro', 'JetBrains Mono', 'Comfortaa', -apple-system, BlinkMacSystemFont, sans-serif",
                backgroundImage: isDarkEffective
                  ? 'radial-gradient(rgba(244,114,182,0.08) 1px, transparent 0)'
                  : 'radial-gradient(rgba(180,90,130,0.06) 1px, transparent 0)',
                backgroundSize: '4px 4px',
              }}
            >
              {/* Vệt chói mặt kính nghiêng 3D (3D Diagonal Glass Glare Reflection) */}
              <div className="absolute -top-20 -left-20 w-[150%] h-48 bg-gradient-to-br from-white/40 via-white/10 to-transparent rotate-[-22deg] pointer-events-none select-none z-20" />
              {/* Viền sáng mép trên mặt kính */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none select-none z-20" />
            {/* THANH TRẠNG THÁI STATUS BAR */}
            <div className={`flex items-center justify-between px-1 text-[11px] sm:text-xs font-bold select-none border-b pb-2 ${
              isDarkEffective ? 'border-pink-900/40 text-[#ebd4e0]' : 'border-pink-100/80 text-[#543b49]'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className="text-xs select-none">🌸</span>
                <span className={`font-bold tracking-tight ${isDarkEffective ? 'text-pink-200' : 'text-[#4c3543]'}`}>
                  {deviceTime}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 text-[#f43f8e]">
                  <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="text-[11px] font-black tracking-tight">5G</span>
                </div>

                <div className={`flex items-center gap-1 ${isDarkEffective ? 'text-stone-400' : 'text-stone-500'}`}>
                  <span className="text-[11px] font-bold tracking-tight">99%</span>
                  <div className={`flex items-center justify-center border-[1.5px] rounded-[3px] px-1 py-[0.5px] h-3.5 relative ${
                    isDarkEffective
                      ? 'border-stone-400 bg-stone-800'
                      : 'border-stone-500 bg-stone-100/60'
                  }`}>
                    <span className="text-[8px] font-black leading-none text-stone-300">⚡</span>
                    <div className="w-[2px] h-1.5 bg-stone-400 absolute -right-[2.5px] top-1/2 -translate-y-1/2 rounded-r-[1px]" />
                  </div>
                </div>
              </div>
            </div>

            {/* KHUNG PHÁT NHẠC ĐĨA THAN VINYL (Ẩn hoàn toàn khi đang mở giao diện hòm thư) */}
            {activeTab !== 'messages' && (
              <div className={`py-2.5 px-3.5 rounded-2xl flex items-center justify-between gap-2.5 border select-none ${
                isDarkEffective
                  ? 'bg-[#2b1f30]/90 border-pink-900/40 shadow-sm'
                  : 'bg-white/95 border-pink-100 shadow-[0_4px_16px_rgba(244,114,182,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0 flex items-center justify-center">
                    {isVinylPlaying && (
                      <motion.div
                        animate={{
                          scale: [1, 1.16, 1],
                          opacity: [0.35, 0.7, 0.35],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: 'easeInOut',
                        }}
                        className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300 blur-sm pointer-events-none"
                      />
                    )}
                    <motion.div
                      animate={isVinylPlaying ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                      className="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-800 to-zinc-950 border border-white/40 shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer z-10"
                      onClick={() => setIsVinylPlaying((prev) => !prev)}
                      title={isVinylPlaying ? 'Chạm để tạm dừng xoay đĩa' : 'Chạm để tiếp tục xoay đĩa'}
                    >
                      <div className="absolute inset-1 rounded-full border border-white/10" />
                      <div className="absolute inset-2 rounded-full border border-white/10" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 border border-white/80 flex items-center justify-center z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-pink-500 text-sm font-black leading-none">♫</span>
                      <span
                        className={`text-base sm:text-lg font-bold tracking-wider truncate ${
                          isDarkEffective ? 'text-pink-100' : 'text-stone-800'
                        }`}
                        style={{ fontFamily: "'Handjet', 'Be Vietnam Pro', monospace" }}
                      >
                        Pocketful of Love
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[11px] font-sans truncate ${isDarkEffective ? 'text-stone-400' : 'text-stone-500'}`}>
                        Đang phát bài hát
                      </span>
                      <div className="flex items-end gap-[2px] h-3 px-0.5 shrink-0" title="Sóng nhịp điệu">
                        {[
                          { heights: [3, 7, 4, 8, 3], duration: 1.8 },
                          { heights: [5, 3, 8, 4, 5], duration: 1.6 },
                          { heights: [4, 8, 3, 7, 4], duration: 2.0 },
                          { heights: [6, 4, 7, 3, 6], duration: 1.7 },
                        ].map((bar, i) => (
                          <motion.div
                            key={i}
                            animate={isVinylPlaying ? { height: bar.heights } : { height: 3 }}
                            transition={{
                              repeat: Infinity,
                              repeatType: 'reverse',
                              duration: bar.duration,
                              ease: 'easeInOut',
                            }}
                            className="w-[2.5px] rounded-full bg-pink-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nút Bật/Tắt BGM */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setIsVinylPlaying((prev) => !prev)}
                  className={`rounded-full px-3 py-1.5 border flex items-center gap-1.5 cursor-pointer text-xs font-mono font-bold shrink-0 select-none transition-colors ${
                    isDarkEffective
                      ? 'bg-[#35253b] hover:bg-[#43304a] text-stone-200 border-pink-900/50'
                      : 'bg-[#fdfbfc] hover:bg-pink-50 text-stone-700 border-stone-200/80 shadow-[2px_2px_5px_#ebd8df,-2px_-2px_5px_#ffffff]'
                  }`}
                  title={isVinylPlaying ? 'Bấm để ngừng chuyển động BGM' : 'Bấm để bật chuyển động BGM'}
                >
                  {isVinylPlaying ? (
                    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" className="text-[#de5b8e] shrink-0">
                      <rect x="0.75" y="0.75" width="3.2" height="10.5" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
                      <rect x="6.8" y="0.75" width="3.2" height="10.5" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  ) : (
                    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" className="text-[#de5b8e] shrink-0">
                      <path d="M1.5 1.5L9.5 6L1.5 10.5V1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span>{isVinylPlaying ? 'Tắt BGM' : 'Bật BGM'}</span>
                </motion.button>
              </div>
            )}

            {/* KHU VỰC NỘI DUNG CUỘN CỦA MÀN HÌNH LCD */}
            <div className="space-y-3 max-h-[380px] sm:max-h-[440px] overflow-y-auto pr-1.5 text-left tamagotchi-scrollbar">
              
              {/* TRANG 1: CHÀO MỪNG & BÉ THỎ LEN PIXEL */}
              {activeTab === 'welcome' && (
                <div className="py-2 px-1 text-center space-y-4 select-none flex flex-col items-center justify-center min-h-[250px]">
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h2 className={`font-['VT323',monospace] text-2xl sm:text-3xl tracking-wider uppercase leading-none ${
                      isDarkEffective ? 'text-pink-300' : 'text-[#5b2234]'
                    }`}>
                      CHÀO MỪNG BẠN ĐẾN VỚI TRANG WEB CỦA MÌNH
                    </h2>
                    <p className={`text-xs sm:text-[13px] font-sans leading-relaxed ${
                      isDarkEffective ? 'text-stone-300' : 'text-stone-600'
                    }`}>
                      Chúc các bạn có khoảng thời gian vui vẻ.
                    </p>
                  </div>

                  {/* VẬT TRANG TRÍ: BÉ THỎ BÔNG LEN PIXEL */}
                  <div className="flex flex-col items-center justify-center my-4 select-none">
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                        rotate: [-2, 2, -2],
                        scaleX: [1, 0.98, 1.02, 1],
                        scaleY: [1, 1.04, 0.98, 1],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      whileHover={{ scale: 1.08, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex flex-col items-center cursor-pointer group"
                      title="Bé thỏ bông len pixel"
                    >
                      <svg
                        className="w-22 h-22 text-pink-500 drop-shadow-[0_8px_20px_rgba(244,114,182,0.32)] transition-transform"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        {/* Tai trái */}
                        <motion.g
                          animate={{ rotate: [-2, 3, -2] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ transformOrigin: '7.5px 8px' }}
                        >
                          <rect x="6" y="1" width="3" height="7" rx="1" />
                          <rect x="7" y="2" width="1" height="5" fill="#fecdd3" />
                        </motion.g>

                        {/* Tai phải */}
                        <motion.g
                          animate={{ rotate: [2, -3, 2] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                          style={{ transformOrigin: '16.5px 8px' }}
                        >
                          <rect x="15" y="1" width="3" height="7" rx="1" />
                          <rect x="16" y="2" width="1" height="5" fill="#fecdd3" />
                        </motion.g>

                        {/* Đầu thỏ */}
                        <rect x="5" y="7" width="14" height="8" rx="2" />

                        {/* Mắt thỏ chớp định kỳ */}
                        <motion.g
                          animate={{ scaleY: [1, 1, 1, 0.15, 1] }}
                          transition={{
                            duration: 3.8,
                            repeat: Infinity,
                            times: [0, 0.88, 0.93, 0.96, 1],
                            ease: 'easeInOut',
                          }}
                          style={{ transformOrigin: '12px 11px' }}
                        >
                          <rect x="8" y="10" width="2" height="2" fill="#4c0519" />
                          <rect x="8" y="10" width="1" height="1" fill="#ffffff" />
                          <rect x="14" y="10" width="2" height="2" fill="#4c0519" />
                          <rect x="14" y="10" width="1" height="1" fill="#ffffff" />
                        </motion.g>

                        {/* Mũi & má hồng */}
                        <rect x="11" y="11" width="2" height="1" fill="#be123c" />
                        <rect x="6" y="12" width="2" height="2" fill="#fb7185" />
                        <rect x="16" y="12" width="2" height="2" fill="#fb7185" />

                        {/* Thân */}
                        <rect x="6" y="14" width="12" height="7" rx="2" />

                        {/* Bông hoa nhỏ ôm trước ngực khẽ đung đưa */}
                        <motion.g
                          animate={{ rotate: [-3, 3, -3], scale: [1, 1.04, 1] }}
                          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ transformOrigin: '12px 17px' }}
                        >
                          <circle cx="12" cy="17" r="2.5" fill="#ffffff" />
                          <circle cx="12" cy="17" r="1" fill="#f43f5e" />
                        </motion.g>

                        {/* Tay thỏ ôm hoa */}
                        <rect x="5" y="15" width="3" height="3" rx="1" />
                        <rect x="16" y="15" width="3" height="3" rx="1" />

                        {/* Chân */}
                        <rect x="7" y="21" width="3" height="2" />
                        <rect x="14" y="21" width="3" height="2" />
                      </svg>
                    </motion.div>

                    {/* Bóng đổ pixel mờ dịu */}
                    <motion.div
                      animate={{
                        scaleX: [1, 0.88, 1.05, 1],
                        opacity: [0.35, 0.2, 0.4, 0.35],
                      }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-14 h-2 rounded-full bg-pink-300/40 blur-[2px] mt-1"
                    />
                  </div>
                </div>
              )}

              {/* TRANG 2: MỤC ĐÍCH HOẠT ĐỘNG */}
              {activeTab === 'purpose' && (
                <div className="space-y-3.5">
                  <div className={`p-4 rounded-2xl border space-y-3 shadow-2xs ${
                    isDarkEffective
                      ? 'bg-[#291d2d]/90 border-pink-900/40 text-stone-200'
                      : 'bg-white/90 border-pink-200'
                  }`}>
                    <div className="flex items-center border-b border-dashed border-pink-200 pb-2">
                      <span className="text-[11px] font-black text-rose-700 dark:text-rose-400 uppercase flex items-center gap-1 font-mono tracking-tight">
                        <span>🌸</span>
                        <span>MỤC ĐÍCH HOẠT ĐỘNG</span>
                      </span>
                    </div>

                    <div className={`p-3.5 rounded-xl border text-xs font-sans leading-relaxed space-y-2 ${
                      isDarkEffective
                        ? 'bg-[#352336] border-pink-900/60 text-pink-100'
                        : 'bg-pink-50 border-pink-200/80 text-pink-900'
                    }`}>
                      <p>
                        Web được thành lập hoàn toàn phi thương mại và phi lợi nhuận, nhằm mục đích đăng tải và lưu trữ những bộ truyện mình yêu thích và đã edit hoàn chỉnh.
                      </p>
                      <p className="pt-2 border-t border-pink-200/70 dark:border-pink-900/50">
                        💖 Toàn bộ tác phẩm được chia sẻ miễn phí 100% để phục vụ duy nhất mục đích giải trí.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TRANG 3: CẢNH BÁO 18+ */}
              {activeTab === 'warning' && (
                <div className={`p-4 rounded-2xl border-2 border-dashed space-y-3 shadow-2xs ${
                  isDarkEffective
                    ? 'bg-[#2e1823]/90 border-rose-800 text-rose-200'
                    : 'bg-rose-50/90 border-rose-300'
                }`}>
                  <div className="flex items-center justify-between border-b border-dashed border-rose-200 dark:border-rose-900/60 pb-2">
                    <span className="text-[11px] font-black text-rose-700 dark:text-rose-400 uppercase flex items-center gap-1 font-mono tracking-tight">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>CẢNH BÁO NỘI DUNG</span>
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-black animate-pulse">
                      18+ ONLY
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed font-sans ${isDarkEffective ? 'text-stone-200' : 'text-stone-800'}`}>
                    Trang web chứa các tác phẩm thuộc thể loại <strong>đam mỹ có yếu tố 18+, ngôn từ thô tục</strong>.
                  </p>

                  <div className={`p-3 rounded-xl border text-xs font-sans leading-relaxed space-y-1 ${
                    isDarkEffective
                      ? 'bg-[#211119] border-rose-900 text-rose-100'
                      : 'bg-white/90 border-rose-300 text-rose-950'
                  }`}>
                    <p className="font-bold text-rose-800 dark:text-rose-400">⚠️ LƯU Ý QUAN TRỌNG:</p>
                    <p>
                      Tất cả tình tiết, nhân vật và sự kiện hoàn toàn là <strong>HƯ CẤU</strong> và không phản ánh tiêu chuẩn đạo đức xã hội thực tế.
                    </p>
                  </div>

                  <p className="text-[11px] text-rose-700 dark:text-rose-400 font-bold font-sans">
                    Nếu bạn dưới 18 tuổi hoặc không phù hợp với thể loại truyện này, xin vui lòng rời khỏi web.
                  </p>
                </div>
              )}

              {/* TRANG 4: HẠ TẦNG WEB CLOUD */}
              {activeTab === 'server' && (
                <div className={`p-4 rounded-2xl border space-y-3 shadow-2xs ${
                  isDarkEffective
                    ? 'bg-[#182626]/90 border-teal-800 text-stone-200'
                    : 'bg-white/90 border-teal-200'
                }`}>
                  <div className="flex items-center justify-between border-b border-dashed border-teal-200 dark:border-teal-900/60 pb-2">
                    <span className="text-[11px] font-black text-teal-800 dark:text-teal-300 uppercase flex items-center gap-1 font-mono tracking-tight">
                      <Server className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>HẠ TẦNG MÁY CHỦ</span>
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/70 text-teal-800 dark:text-teal-300 font-bold">
                      CLOUD FREE TIER
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed font-sans ${isDarkEffective ? 'text-stone-300' : 'text-stone-700'}`}>
                    Trang web được vận hành và duy trì hoàn toàn bằng <strong>hạ tầng máy chủ đám mây miễn phí</strong> nhằm mục đích phi thương mại.
                  </p>

                  <div className={`p-2.5 rounded-xl border text-xs font-sans leading-relaxed ${
                    isDarkEffective
                      ? 'bg-[#152020] border-teal-900/70 text-teal-100'
                      : 'bg-teal-50 border-teal-200 text-stone-800'
                  }`}>
                    Hệ thống có giới hạn lượt đọc trong 1 ngày, trong vòng 24h vượt quá giới hạn sẽ tự động khóa web, sau 14h chiều sẽ mở lại bình thường.
                  </div>

                  <p className={`text-[11px] font-sans italic ${isDarkEffective ? 'text-teal-300' : 'text-teal-900'}`}>
                    Nếu web khóa, bạn có thể ghé Wattpad hoặc WordPress để tiếp tục đọc truyện nhé!
                  </p>
                </div>
              )}

              {/* TRANG 5: BÌNH LUẬN VĂN MINH */}
              {activeTab === 'comments' && (
                <div className={`p-4 rounded-2xl border space-y-3 shadow-2xs ${
                  isDarkEffective
                    ? 'bg-[#241a2f]/90 border-purple-900/60 text-stone-200'
                    : 'bg-white/90 border-purple-200'
                }`}>
                  <div className="flex items-center justify-between border-b border-dashed border-purple-200 dark:border-purple-900/60 pb-2">
                    <span className="text-[11px] font-black text-purple-800 dark:text-purple-300 uppercase flex items-center gap-1 font-mono tracking-tight">
                      <MessageCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>BÌNH LUẬN VĂN MINH</span>
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/70 text-purple-800 dark:text-purple-300 font-bold">
                      OPEN CHAT
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/80 text-stone-800 text-xs leading-relaxed font-sans">
                    Web mở cổng bình luận tự do, không cần đăng nhập tài khoản. Tuy nhiên, để giữ gìn một không gian đọc truyện văn minh, không bình luận mắng chửi, xúc phạm nhân vật trong truyện. Không nhắc đến tên của nhân vật và bộ truyện không liên quan.
                  </div>
                </div>
              )}

              {/* TRANG 6: NỀN TẢNG DỰ PHÒNG */}
              {activeTab === 'platforms' && (
                <div className={`p-4 rounded-2xl border space-y-3 shadow-2xs ${
                  isDarkEffective
                    ? 'bg-[#29221b]/90 border-amber-900/60 text-stone-200'
                    : 'bg-white/90 border-amber-200'
                }`}>
                  <div className="flex items-center justify-between border-b border-dashed border-amber-200 dark:border-amber-900/60 pb-2">
                    <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 uppercase flex items-center gap-1 font-mono tracking-tight">
                      <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>NỀN TẢNG KHÁC</span>
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-300 font-bold">
                      OFFICIAL LINKS
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed font-sans ${isDarkEffective ? 'text-stone-300' : 'text-stone-700'}`}>
                    Xem truyện tại các nền tảng chính chủ dự phòng:
                  </p>

                  <div className="space-y-2.5">
                    {/* Wattpad */}
                    <div className={`p-3 rounded-xl border space-y-1.5 font-sans ${
                      isDarkEffective ? 'bg-[#221a14] border-amber-900/60' : 'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-xs ${isDarkEffective ? 'text-amber-200' : 'text-amber-900'}`}>
                          Wattpad (Chỉ truyện mới)
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('https://www.wattpad.com/user/Qingxiya52', 'wattpad')}
                          className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer px-2 py-0.5 rounded-md border shadow-2xs ${
                            isDarkEffective
                              ? 'bg-[#2e231b] text-amber-300 border-amber-900/60 hover:bg-[#3d2f25]'
                              : 'bg-white text-amber-700 hover:text-amber-900 border-amber-200'
                          }`}
                        >
                          {copiedWattpad ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedWattpad ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                      <a
                        href="https://www.wattpad.com/user/Qingxiya52"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs underline block truncate font-mono ${
                          isDarkEffective ? 'text-amber-300 hover:text-amber-200' : 'text-stone-600 hover:text-amber-800'
                        }`}
                      >
                        https://www.wattpad.com/user/Qingxiya52
                      </a>
                    </div>

                    {/* WordPress */}
                    <div className={`p-3 rounded-xl border space-y-1.5 font-sans ${
                      isDarkEffective ? 'bg-[#15232b] border-sky-900/60' : 'bg-sky-50 border-sky-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-xs ${isDarkEffective ? 'text-sky-200' : 'text-sky-900'}`}>
                          WordPress (Kho truyện hoàn)
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('https://nienthoi003.wordpress.com/', 'wordpress')}
                          className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer px-2 py-0.5 rounded-md border shadow-2xs ${
                            isDarkEffective
                              ? 'bg-[#1b2f3a] text-sky-300 border-sky-900/60 hover:bg-[#253f4d]'
                              : 'bg-white text-sky-700 hover:text-sky-900 border-sky-200'
                          }`}
                        >
                          {copiedWordpress ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedWordpress ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                      <a
                        href="https://nienthoi003.wordpress.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs underline block truncate font-mono ${
                          isDarkEffective ? 'text-sky-300 hover:text-sky-200' : 'text-stone-600 hover:text-sky-800'
                        }`}
                      >
                        https://nienthoi003.wordpress.com/
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TRANG RIÊNG BIỆT: HÒM THƯ LỜI NHẮN */}
              {activeTab === 'messages' && (
                <div className={`p-4 rounded-2xl border space-y-3.5 shadow-2xs ${
                  isDarkEffective ? 'bg-[#291d2d]/95 border-pink-900/50' : 'bg-white/95 border-pink-200'
                }`}>
                  <div className="flex items-center justify-between border-b border-dashed border-pink-200 dark:border-pink-900/50 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">💌</span>
                      <div>
                        <span className={`text-xs font-black uppercase block tracking-tight font-mono ${
                          isDarkEffective ? 'text-pink-300' : 'text-rose-800'
                        }`}>
                          HÒM THƯ LỜI NHẮN
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('purpose')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0 ${
                        isDarkEffective
                          ? 'bg-[#35253b] hover:bg-[#43304a] text-pink-300 border-pink-900/50'
                          : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200'
                      }`}
                      title="Quay lại"
                    >
                      <span>◀</span>
                    </button>
                  </div>

                  {/* KHỐI 1: GỬI LỜI NHẮN */}
                  <div className={`p-3 rounded-xl border space-y-2 ${
                    isDarkEffective
                      ? 'bg-[#201524] border-pink-900/60'
                      : 'bg-gradient-to-br from-pink-50 to-rose-50/70 border-pink-200/90'
                  }`}>
                    <div className={`flex items-center justify-between text-[11px] font-bold ${
                      isDarkEffective ? 'text-pink-200' : 'text-rose-950'
                    }`}>
                      <span className="font-mono uppercase tracking-tight">GỬI LỜI NHẮN</span>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={nicknameInput}
                        onChange={(e) => setNicknameInput(e.target.value)}
                        placeholder="Biệt danh của bạn (tùy chọn)..."
                        className={`w-full text-xs px-3 py-1.5 rounded-xl border font-sans shadow-inner transition-all focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 ${
                          isDarkEffective
                            ? 'bg-[#18101b] border-pink-900/50 text-stone-200 placeholder-stone-500'
                            : 'bg-white border-pink-200 text-stone-800 placeholder-pink-300'
                        }`}
                        maxLength={30}
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Nhập lời nhắn gửi..."
                        className={`w-full text-xs px-3 py-2 rounded-xl border font-sans shadow-inner transition-all pr-14 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 ${
                          isDarkEffective
                            ? 'bg-[#18101b] border-pink-900/50 text-stone-200 placeholder-stone-500'
                            : 'bg-white border-pink-200 text-stone-800 placeholder-pink-300'
                        }`}
                        maxLength={120}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-pink-400">
                        {chatInput.length}/120
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <span className={`text-[10px] font-sans italic ${isDarkEffective ? 'text-pink-400' : 'text-pink-700'}`}>
                        Bấm gửi hoặc Enter để gửi lời nhắn
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={handleSendMessage}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold font-sans flex items-center justify-center cursor-pointer shadow-xs active:shadow-inner shrink-0"
                      >
                        <span>Gửi</span>
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {sentSuccessMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -4, height: 0 }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-sans font-bold flex items-center justify-between shadow-2xs overflow-hidden"
                        >
                          <span className="truncate">{sentSuccessMsg}</span>
                          <span className="text-[9px] text-emerald-600 shrink-0 font-normal">Cảm ơn bạn 🌸</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* KHỐI 2: DANH SÁCH LỜI NHẮN ĐỘC GIẢ */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-900 dark:text-purple-300 border-b border-purple-100 dark:border-purple-900/50 pb-1.5">
                      <span className="flex items-center gap-1">
                        <span>💬</span>
                        <span>LỜI NHẮN ĐỘC GIẢ ({recentMessages.length})</span>
                      </span>
                      <span className="text-[9px] text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full font-mono">
                        Mới nhất
                      </span>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1.5 tamagotchi-scrollbar">
                      {recentMessages.length === 0 ? (
                        <div className="py-8 px-3 text-center text-xs font-sans text-stone-400 dark:text-purple-300/60 leading-relaxed">
                          Chưa có lời nhắn nào. Hãy gửi lời nhắn đầu tiên cho góc nhỏ nhé! 💌
                        </div>
                      ) : (
                        recentMessages.map((msg, idx) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-2.5 rounded-xl border text-xs font-sans space-y-1 shadow-2xs ${
                              isDarkEffective
                                ? 'bg-[#211727] border-purple-900/60 text-stone-200'
                                : 'bg-purple-50/70 border-purple-200/90 text-stone-800'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[9px] text-purple-700 dark:text-purple-400 font-mono font-bold">
                              <span className="flex items-center gap-1">
                                <span>🌸 {msg.sender || `Độc giả #${recentMessages.length - idx}`}</span>
                              </span>
                              <span className={`px-1.5 py-0.5 rounded-md border text-purple-600 dark:text-purple-300 ${
                                isDarkEffective ? 'bg-[#2b1f33] border-purple-900/50' : 'bg-white border-purple-100'
                              }`}>
                                {msg.time}
                              </span>
                            </div>
                            <p className={`leading-relaxed font-sans pl-1 ${isDarkEffective ? 'text-stone-300' : 'text-stone-700'}`}>
                              {msg.text}
                            </p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>



            {/* 2 NÚT ĐIỀU KHIỂN DƯỚI MÀN HÌNH: THẢ TIM & MỞ HÒM THƯ (Ẩn hoàn toàn trong giao diện Chào mừng) */}
            {activeTab !== 'welcome' && (
              <div className="pt-2.5 border-t border-pink-200/90 dark:border-pink-900/50 flex items-center justify-between gap-2 select-none">
                {/* Nút Thả tim */}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  onClick={handlePressB}
                  className={`flex-1 py-2 px-3 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 select-none ${
                    isHeartFlashing
                      ? 'bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 text-stone-900 shadow-[0_6px_20px_rgba(244,114,182,0.4)] scale-[1.03] ring-2 ring-pink-400 border border-white/80 font-black'
                      : hasLiked
                      ? isDarkEffective
                        ? 'bg-[#3b2738] text-rose-300 border border-rose-900/60 shadow-2xs'
                        : 'bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 text-rose-800 border border-rose-300/80 shadow-2xs'
                      : isDarkEffective
                      ? 'bg-[#2f2032] hover:bg-[#3a283e] text-stone-300 border border-pink-900/50 shadow-2xs'
                      : 'bg-gradient-to-r from-rose-50 via-pink-50 to-rose-100 hover:from-rose-100 hover:to-pink-100 text-stone-700 border border-pink-200/80 shadow-2xs hover:shadow-[0_4px_14px_rgba(244,114,182,0.25)] hover:border-pink-300'
                  }`}
                  title={hasLiked ? 'Bạn đã thả tim rồi (giới hạn 1 lượt/trình duyệt)' : 'Bấm để thả tim cho góc nhỏ'}
                >
                  <motion.span
                    animate={isHeartFlashing ? { scale: [1, 1.45, 1] } : { scale: [1, 1.15, 1] }}
                    transition={{ duration: isHeartFlashing ? 0.35 : 1.6, repeat: isHeartFlashing ? 0 : Infinity }}
                    className={`text-base leading-none ${hasLiked ? 'text-rose-600 dark:text-rose-400' : 'text-rose-500'}`}
                  >
                    ♥
                  </motion.span>
                  <span
                    className={`text-sm tracking-wide ${
                      isHeartFlashing
                        ? 'text-stone-900 font-black'
                        : hasLiked
                        ? isDarkEffective ? 'text-rose-300 font-bold' : 'text-rose-900 font-bold'
                        : isDarkEffective ? 'text-stone-200' : 'text-stone-800'
                    }`}
                    style={{ fontFamily: "'Handjet', 'Be Vietnam Pro', sans-serif", fontWeight: 850 }}
                  >
                    {hasLiked ? 'Đã thả tim' : 'Thả tim'}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs border shadow-2xs ${
                      hasLiked
                        ? isDarkEffective ? 'bg-[#201524] text-rose-300 border-rose-900/60' : 'bg-white/95 text-rose-700 border-rose-200'
                        : isDarkEffective ? 'bg-[#201524] text-pink-300 border-pink-900/60' : 'bg-white/95 text-pink-700 border-pink-200'
                    }`}
                    style={{ fontFamily: "'Handjet', 'JetBrains Mono', monospace", fontWeight: 850 }}
                  >
                    {tamaHearts}
                  </span>
                </motion.button>

                {/* Nút Mở Hòm thư */}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  onClick={() => {
                    if (activeTab === 'messages') {
                      setActiveTab('welcome');
                      showToast('Đã đóng hòm thư lời nhắn 🌸');
                    } else {
                      setActiveTab('messages');
                      showToast('Đã mở hòm thư lời nhắn 💌');
                    }
                  }}
                  className={`flex-1 py-2 px-3 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 select-none ${
                    activeTab === 'messages'
                      ? 'bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 text-stone-900 shadow-[0_3px_0_#d946ef,0_8px_18px_rgba(217,70,239,0.35),inset_0_2px_3px_#ffffff] scale-[1.03] ring-2 ring-purple-400 border border-white font-black'
                      : isDarkEffective
                      ? 'bg-[#2f2032] hover:bg-[#3a283e] text-stone-300 border border-pink-900/50 shadow-[0_2px_0_#1a101d]'
                      : 'bg-gradient-to-r from-rose-50 via-pink-50 to-rose-100 hover:from-rose-100 hover:to-pink-100 text-stone-700 border border-pink-200/80 shadow-[0_3px_0_#f472b6,0_6px_12px_rgba(244,114,182,0.22),inset_0_2px_2px_#ffffff] hover:shadow-[0_4px_0_#f472b6,0_8px_16px_rgba(244,114,182,0.28)]'
                  }`}
                  title={activeTab === 'messages' ? 'Đang mở' : 'Bấm để mở hòm thư lời nhắn'}
                >
                  <span className="text-sm leading-none">💌</span>
                  <span
                    className={`text-sm tracking-wide ${
                      activeTab === 'messages'
                        ? 'text-stone-900 font-black'
                        : isDarkEffective ? 'text-stone-200' : 'text-stone-800'
                    }`}
                    style={{ fontFamily: "'Handjet', 'Be Vietnam Pro', sans-serif", fontWeight: 850 }}
                  >
                    {activeTab === 'messages' ? 'Đang mở ' : 'Mở hòm thư'}
                  </span>
                </motion.button>
              </div>
            )}
          </div>
          </div>

          {/* BƯỚC 3: CỤM 3 NÚT BẤM VẬT LÝ [A], [B], [C] ĐỐI XỨNG 3D */}
          <div className="pt-6 pb-2 relative z-20">
            <div className="grid grid-cols-3 items-start justify-items-center max-w-[280px] sm:max-w-[310px] mx-auto">
              
              {/* NÚT A: ĐỌC TIẾP */}
              <div className="flex flex-col items-center justify-center w-full relative">
                <AnimatePresence>
                  {!hasPressedA && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: [0, -3, 0] }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ y: { repeat: Infinity, duration: 1.2 } }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-rose-400 text-white text-[9px] font-bold shadow-md tracking-wider whitespace-nowrap z-10"
                      style={{ fontFamily: "'Be Vietnam Pro', 'JetBrains Mono', sans-serif" }}
                    >
                      <span>BẤM [A] ĐỌC TIẾP ▼</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Đế lồi/lõm 3D xung quanh nút A */}
                <div className="p-1 sm:p-1.5 rounded-full bg-gradient-to-b from-[#eec2cf] to-white/95 shadow-[inset_0_3px_5px_rgba(180,90,120,0.38),0_1.5px_2px_#ffffff] border border-pink-300/50 flex items-center justify-center">
                  <motion.button
                    whileTap={{ y: 4, scale: 0.96 }}
                    onClick={handlePressA}
                    className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full cursor-pointer flex items-center justify-center font-mono font-black text-base select-none border transition-all ${
                      isDarkEffective
                        ? 'bg-gradient-to-b from-[#462d3a] to-[#2e1d27] text-rose-300 border-pink-900/60 shadow-[0_4px_0_#1e1219,0_6px_12px_rgba(0,0,0,0.5)] active:shadow-[0_1px_0_#1e1219]'
                        : 'bg-gradient-to-b from-[#ffffff] via-[#ffe8ee] to-[#fca5b9] text-[#9f1239] border-t-2 border-white border-b border-rose-300 shadow-[0_5px_0_#db2777,0_8px_14px_rgba(219,39,119,0.35),inset_0_2px_3px_#ffffff,inset_0_-2px_3px_rgba(219,39,119,0.2)] active:shadow-[0_1px_0_#db2777,0_3px_6px_rgba(219,39,119,0.25)]'
                    }`}
                  >
                    A
                  </motion.button>
                </div>
                <span
                  className={`text-[10px] font-bold mt-1.5 whitespace-nowrap tracking-wide ${
                    isDarkEffective ? 'text-pink-300' : 'text-[#8d2a4a]'
                  }`}
                  style={{ fontFamily: "'Be Vietnam Pro', 'JetBrains Mono', sans-serif" }}
                >
                  ĐỌC TIẾP
                </span>
              </div>

              {/* NÚT B: THẢ TIM (Tím lavender) */}
              <div className="flex flex-col items-center justify-center w-full">
                {/* Đế lồi/lõm 3D xung quanh nút B */}
                <div className="p-1 sm:p-1.5 rounded-full bg-gradient-to-b from-[#eec2cf] to-white/95 shadow-[inset_0_3px_5px_rgba(180,90,120,0.38),0_1.5px_2px_#ffffff] border border-pink-300/50 flex items-center justify-center">
                  <motion.button
                    whileTap={{ y: 4, scale: 0.96 }}
                    onClick={handlePressB}
                    className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full cursor-pointer flex items-center justify-center font-mono font-black text-base select-none border transition-all ${
                      isDarkEffective
                        ? 'bg-gradient-to-b from-[#3a2846] to-[#25192e] text-purple-300 border-purple-900/60 shadow-[0_4px_0_#140d1a,0_6px_12px_rgba(0,0,0,0.5)] active:shadow-[0_1px_0_#140d1a]'
                        : 'bg-gradient-to-b from-[#ffffff] via-[#f5edff] to-[#d8b4fe] text-[#6b21a8] border-t-2 border-white border-b border-purple-300 shadow-[0_5px_0_#7e22ce,0_8px_14px_rgba(126,34,206,0.35),inset_0_2px_3px_#ffffff,inset_0_-2px_3px_rgba(126,34,206,0.2)] active:shadow-[0_1px_0_#7e22ce,0_3px_6px_rgba(126,34,206,0.25)]'
                    }`}
                    title="Nút B: Giai Điệu Yêu Thương (Thả Tim)"
                  >
                    B
                  </motion.button>
                </div>
                <span
                  className={`text-[10px] font-bold text-center mt-1.5 whitespace-nowrap tracking-wide ${
                    isDarkEffective ? 'text-purple-300' : 'text-[#5c1d8f]'
                  }`}
                  style={{ fontFamily: "'Be Vietnam Pro', 'JetBrains Mono', sans-serif" }}
                >
                  THẢ TIM
                </span>
              </div>

              {/* NÚT C: TRANG ĐẦU (Xanh mint) */}
              <div className="flex flex-col items-center justify-center w-full">
                {/* Đế lồi/lõm 3D xung quanh nút C */}
                <div className="p-1 sm:p-1.5 rounded-full bg-gradient-to-b from-[#eec2cf] to-white/95 shadow-[inset_0_3px_5px_rgba(180,90,120,0.38),0_1.5px_2px_#ffffff] border border-pink-300/50 flex items-center justify-center">
                  <motion.button
                    whileTap={{ y: 4, scale: 0.96 }}
                    onClick={handlePressC}
                    className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full cursor-pointer flex items-center justify-center font-mono font-black text-base select-none border transition-all ${
                      isDarkEffective
                        ? 'bg-gradient-to-b from-[#253d36] to-[#152520] text-emerald-300 border-emerald-900/60 shadow-[0_4px_0_#0a1612,0_6px_12px_rgba(0,0,0,0.5)] active:shadow-[0_1px_0_#0a1612]'
                        : 'bg-gradient-to-b from-[#ffffff] via-[#ecfdf5] to-[#86efac] text-[#065f46] border-t-2 border-white border-b border-emerald-300 shadow-[0_5px_0_#059669,0_8px_14px_rgba(5,150,105,0.35),inset_0_2px_3px_#ffffff,inset_0_-2px_3px_rgba(5,150,105,0.2)] active:shadow-[0_1px_0_#059669,0_3px_6px_rgba(5,150,105,0.25)]'
                    }`}
                  >
                    C
                  </motion.button>
                </div>
                <span
                  className={`text-[10px] font-bold mt-1.5 whitespace-nowrap tracking-wide ${
                    isDarkEffective ? 'text-emerald-300' : 'text-[#065f46]'
                  }`}
                  style={{ fontFamily: "'Be Vietnam Pro', 'JetBrains Mono', sans-serif" }}
                >
                  TRANG ĐẦU
                </span>
              </div>

            </div>
          </div>

          {/* HIỆU ỨNG TIM BAY KHI BẤM NÚT B */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3.8rem]">
            <AnimatePresence>
              {floatingHearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 1, y: 380, x: 230 + heart.x, scale: 0.8 }}
                  animate={{ opacity: 0, y: 140, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  className="absolute text-xl font-bold text-rose-500 select-none z-30"
                >
                  💖
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* Bóng đổ tiếp xúc mặt bàn nhẹ nhàng */}
        <div className="w-[80%] h-6 mx-auto -mt-1 bg-gradient-to-r from-transparent via-pink-300/20 to-transparent blur-md rounded-full pointer-events-none" />
      </div>
    </div>
  );
};
