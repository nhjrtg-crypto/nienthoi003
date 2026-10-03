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
  X,
  ArrowLeft,
  Pause,
  Play
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
 * Chuỗi dây treo móc khóa hạt cườm kẹo thạch 3D Claymorphism trên máy Tamagotchi
 */
export const TamagotchiCharmBeads: React.FC = () => {
  return (
    <div className="absolute -top-7 left-8 flex flex-col items-center select-none pointer-events-none z-20">
      {/* 1. Vòng khoen kim loại bóng loáng (Metallic Keyring Eyelet) */}
      <div className="w-5 h-5 rounded-full border-2 border-pink-200 bg-gradient-to-tr from-white via-pink-100 to-white shadow-[0_3px_6px_rgba(244,114,182,0.3),inset_0_1.5px_3px_#ffffff] flex items-center justify-center">
        {/* Lỗ khuyên rỗng ở giữa */}
        <div className="w-2.5 h-2.5 rounded-full border border-pink-300 bg-pink-50 shadow-[inset_0_1px_2px_rgba(180,90,120,0.3)]" />
      </div>

      {/* 2. Dây nối bạc ánh hồng (Metallic Silver-Pink Link Wire) */}
      <div className="w-[1.5px] h-3 bg-gradient-to-b from-pink-300 to-rose-400" />

      {/* 3. Bông hoa anh đào kẹo đất sét 3D Claymorphism lắc lư đung đưa nhịp nhàng */}
      <motion.div
        animate={{ rotate: [-4, 5, -4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'top center' }}
        className="flex flex-col items-center"
      >
        {/* Bông hoa anh đào đất sét 3D Claymorphism (Inflated Sakura Charm) */}
        <div className="w-7 h-7 rounded-full border-2 border-white/95 bg-gradient-to-br from-[#ffffff] via-[#ffb4c8] to-[#f43f5e] flex items-center justify-center text-xs shadow-[0_8px_18px_rgba(244,63,94,0.38),inset_0_3px_6px_rgba(255,255,255,0.95),inset_0_-4px_8px_rgba(225,29,72,0.25)] relative overflow-hidden">
          {/* Vệt bóng cong lưỡi liềm phản chiếu mặt thạch */}
          <div className="jelly-crescent-sheen" />
          <span className="relative z-10 drop-shadow-xs">🌸</span>
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
  const [isTamaShaking, setIsTamaShaking] = useState<boolean>(false);

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

  // Bảng màu rực rỡ & pastel cho icon LỜI NHẮN ĐỘC GIẢ (Người dùng có thể bấm vào icon để đổi màu theo ý thích)
  const READER_MSG_ICON_COLORS = [
    { text: 'text-purple-600 dark:text-purple-400', fill: 'fill-purple-200/70 dark:fill-purple-900/50', name: 'Tím Lavender' },
    { text: 'text-pink-600 dark:text-pink-400', fill: 'fill-pink-200/70 dark:fill-pink-900/50', name: 'Hồng Sakura' },
    { text: 'text-rose-600 dark:text-rose-400', fill: 'fill-rose-200/70 dark:fill-rose-900/50', name: 'Đỏ San Hô' },
    { text: 'text-amber-500 dark:text-amber-400', fill: 'fill-amber-200/70 dark:fill-amber-900/50', name: 'Vàng Nắng Mật' },
    { text: 'text-emerald-600 dark:text-emerald-400', fill: 'fill-emerald-200/70 dark:fill-emerald-900/50', name: 'Xanh Mint Bạc Hà' },
    { text: 'text-sky-600 dark:text-sky-400', fill: 'fill-sky-200/70 dark:fill-sky-900/50', name: 'Xanh Da Trời' },
    { text: 'text-violet-600 dark:text-violet-400', fill: 'fill-violet-200/70 dark:fill-violet-900/50', name: 'Tím Thạch Anh' },
  ];
  const [readerMsgIconColorIndex, setReaderMsgIconColorIndex] = useState<number>(0);
  const currentMsgIconColor = READER_MSG_ICON_COLORS[readerMsgIconColorIndex];

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

  // 💜 NÚT [B]: THẢ TIM (Màu Tím Hoa Cà)
  // Giới hạn 1 trình duyệt chỉ được thả tim 1 lần
  const handlePressB = () => {
    if (hasLiked) {
      showToast('Bạn đã thả tim rồi nè, cảm ơn bạn rất nhiều! (｡♥‿♥｡)');
      return;
    }

    setHasLiked(true);
    try {
      safeStorage.setItem('cosmo_has_liked_tama', 'true');
    } catch {}

    // 1. Rung nhẹ máy & phản hồi xúc giác
    setIsTamaShaking(true);
    setTimeout(() => setIsTamaShaking(false), 450);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([35, 25, 35]);
      } catch {}
    }

    // 2. Bay chùm tim hồng (5 trái tim hồng bay lên xòe cánh quạt)
    const baseId = Date.now();
    const cluster = [-50, -25, 0, 25, 50].map((offset, idx) => ({
      id: baseId + idx,
      x: offset + (Math.random() * 20 - 10),
    }));
    setFloatingHearts((prev) => [...prev.slice(-10), ...cluster]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !cluster.some((c) => c.id === h.id)));
    }, 1400);

    setIsHeartFlashing(true);
    setTimeout(() => {
      setIsHeartFlashing(false);
    }, 450);

    // 3. Cộng dồn điểm tương tác lên Firestore
    incrementIntroHearts('style2').catch(console.error);

    showToast('Cảm ơn bạn đã thả tim ủng hộ! (づ｡◕‿‿◕｡)づ 💖');
  };

  // 💖 NÚT [C]: TRANG ĐẦU (Quay về màn hình Welcome)
  const handlePressC = () => {
    setActiveTab('welcome');
  };

  return (
    <div
      className={`relative min-h-screen text-stone-800 pb-28 pt-10 sm:pt-14 px-3 sm:px-6 transition-colors duration-500 overflow-x-hidden ${
        isDarkEffective ? 'bg-[#18131d] text-stone-200' : 'bg-[#fff5f8]'
      }`}
      style={{
        fontFamily: "'Itim', 'Comfortaa', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* CẤU HÌNH HIỆU ỨNG CLAYMORPHISM NỔI KHỐI 3D MỀM DẺO PASTEL CHO STYLE 2 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap');

        /* 1. BẢNG MÀU CHUẨN (HỆ MÀU OKLCH & MÃ HEX TƯƠNG ĐƯƠNG) */
        :root {
          --cl-10-bg: oklch(0.942 0.038 348);        /* #fae4ed - Hồng nhạt pastel nền vỏ máy */
          --cl-10-clay: oklch(0.895 0.062 348);      /* #f7cbdc - Đất sét hồng phấn */
          --cl-10-accent: oklch(0.68 0.18 348);      /* #e84e85 / #f43f7e - Hồng dâu tươi rạng rỡ (Nút A) */
          --cl-10-accent-b: oklch(0.70 0.15 310);    /* #a855f7 / #b366f9 - Tím hoa cà mộng mơ (Nút B) */
          --cl-10-accent-c: oklch(0.55 0.24 350);    /* #db2777 / #be185d - Hồng đậm quyến rũ / Deep Rose (Nút C) */
          --cl-10-shade: oklch(0.58 0.095 348 / .42);/* rgba(186, 75, 118, 0.42) - Bóng đổ tối hồng phấn 3D */
          --cl-10-light: oklch(1 0.015 348 / .96);   /* rgba(255, 245, 250, 0.96) - Vệt sáng Highlight marshmallow */
          --cl-10-ink: oklch(0.30 0.065 348);        /* #4a2233 - Màu chữ nâu berry ngọt ngào */
        }

        /* 2. THÔNG SỐ HIỆU ỨNG VỎ TAMAGOTCHI (OUTER SHELL) CÓ VIỀN 1PX HỒNG BAO QUANH */
        /* A. Phong cách Claymorphism Gốc (.cl-10-egg-shell) */
        .cl-10-egg-shell {
          border-radius: 4rem;
          background: #fae4ed;
          background: color-mix(in oklch, var(--cl-10-bg) 96%, var(--cl-10-clay) 4%);
          border: 1px solid #f9a8d4 !important;
          box-shadow: 
            0 16px 36px -16px rgba(223, 177, 192, 0.55), /* Bóng đổ nổi khối ngoài vỏ nhạt hơn */
            inset 0 -18px 28px -14px var(--cl-10-shade), /* Bóng tối lòng đáy vỏ trứng */
            inset 0 18px 28px -12px var(--cl-10-light);  /* Vệt sáng phồng xốp marshmallow đỉnh vỏ */
          transition: box-shadow .4s cubic-bezier(.34,1.3,.5,1), translate .3s;
        }

        /* B. Phong cách Clay + Neu Viền 1px Hồng (.tama-clay-neu-shell) */
        .tama-clay-neu-shell {
          border-radius: 4rem;
          border: 1px solid #f9a8d4 !important;
          background: #fae4ed;
          background: color-mix(in oklch, var(--cl-10-bg) 96%, var(--cl-10-clay) 4%);
          box-shadow: 
            10px 10px 24px rgba(223, 177, 192, 0.45),   /* Bóng Neumorphic góc tối ngoài vỏ nhạt hơn */
            -6px -6px 18px rgba(255, 255, 255, 0.5),    /* Phản quang nhẹ góc sáng không gắt */
            0 16px 36px -16px rgba(223, 177, 192, 0.45), /* Khối nổi Claymorphism ngoài vỏ nhạt hơn */
            inset 0 -18px 28px -14px var(--cl-10-shade), /* Đáy trũng đất nặn */
            inset 0 18px 28px -12px var(--cl-10-light);  /* Đỉnh mềm marshmallow */
          transition: box-shadow .4s cubic-bezier(.34,1.3,.5,1), translate .3s;
        }

        /* HIỆU ỨNG RUNG NHẸ MÁY KHI THẢ TIM */
        @keyframes tama-jiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-1.5deg) scale(1.01); }
          50% { transform: rotate(1.5deg) scale(1.01); }
          75% { transform: rotate(-1deg) scale(1.005); }
        }
        .tama-shaking {
          animation: tama-jiggle 0.45s ease-in-out;
        }

        /* 3 & 4. BỘ 3 NÚT BẤM [A], [B], [C] & HỆ THỐNG BÓNG ĐỔ PHÍM SỎI (.cl-10-button-pebble & .tama-clay-neu-btn) */
        .cl-10-button-pebble,
        .tama-clay-neu-btn {
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          border: none;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-weight: 900;
          font-size: 1.25rem; /* text-xl */
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          outline: none;
          user-select: none;
          /* Trạng thái nghỉ (Nổi phồng 3D) */
          box-shadow: 
            6px 6px 14px #e0b4c2,                        /* Bóng Neumorphic tối */
            -6px -6px 14px #ffffff,                      /* Bóng Neumorphic sáng */
            0 10px 18px -7px var(--cl-10-shade),        /* Độ nâng chân phím sỏi */
            inset 0 -6px 12px -7px var(--cl-10-shade),  /* Bóng lòng viền dưới */
            inset 0 8px 12px -6px var(--cl-10-light);   /* Ánh sáng xốp viền trên */
          transition: transform .2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow .2s ease;
        }

        /* Hover (Rê chuột): translate: 0 -2px; scale: 1.03; (Phím tự phồng nảy nhẹ lên) */
        .cl-10-button-pebble:hover,
        .tama-clay-neu-btn:hover {
          transform: translateY(-2px) scale(1.03);
        }

        /* Active (Click bấm): translate: 0 2px; scale: 0.94; (Phím lún sâu 2px, nén thể tích 94%) */
        .cl-10-button-pebble:active,
        .tama-clay-neu-btn:active {
          transform: translateY(2px) scale(0.94);
          box-shadow: 
            inset 5px 5px 10px #e0b4c2,                 /* Lún sâu Neumorphic */
            inset -5px -5px 10px #ffffff,
            inset 0 8px 14px -6px var(--cl-10-shade),   /* Lòng thụt xuống */
            inset 0 -4px 8px -6px var(--cl-10-light);
        }

        /* 🍓 NÚT [A] — "ĐỌC TIẾP" (Màu Hồng Dâu) */
        .cl-10-btn-a {
          background: #fedbe7;
          background: color-mix(in oklch, var(--cl-10-accent) 26%, white);
          color: #e84e85;
          color: var(--cl-10-accent);
        }

        /* 💜 NÚT [B] — "THẢ TIM" (Màu Tím Hoa Cà) */
        .cl-10-btn-b {
          background: #f1e5fc;
          background: color-mix(in oklch, var(--cl-10-accent-b) 26%, white);
          color: #a855f7;
          color: var(--cl-10-accent-b);
        }

        /* 💖 NÚT [C] — "TRANG ĐẦU" (Màu Hồng Đậm Mới) */
        .cl-10-btn-c {
          background: #fae0ed;
          background: color-mix(in oklch, var(--cl-10-accent-c) 30%, white);
          color: #be185d;
          color: var(--cl-10-accent-c);
        }

        /* 2. THANH HEADER CLAYMORPHISM */
        .clay-header {
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            0 12px 28px rgba(244, 114, 182, 0.22),
            0 3px 6px rgba(0, 0, 0, 0.04),
            inset 0 4px 8px #ffffff,
            inset 0 -4px 8px rgba(244, 114, 182, 0.16);
        }

        /* 3. VIỀN MÀN HÌNH NỔI DẬP NỔI CLAY (Puffy Clay Screen Bezel) */
        .clay-screen-bezel {
          border-radius: 2.6rem;
          background: linear-gradient(180deg, #ffffff 0%, #fee4ed 40%, #fbcfe8 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            0 12px 24px rgba(244, 114, 182, 0.22),
            0 4px 8px rgba(0, 0, 0, 0.03),
            inset 0 6px 12px #ffffff,
            inset 0 -6px 12px rgba(225, 29, 72, 0.16);
        }

        /* 4. MÀN HÌNH LÕM CHÌM CLAY (Sunken Screen Cavity) */
        .clay-screen-sunken {
          border-radius: 2.2rem;
          background: #fffbfe;
          border: 2.5px solid #f9c5d5;
          box-shadow:
            inset 6px 6px 18px rgba(180, 90, 120, 0.24),
            inset -6px -6px 18px rgba(255, 255, 255, 0.98),
            inset 0 0 0 1.5px rgba(244, 114, 182, 0.22);
        }

        /* 5. THẺ NỘI DUNG CLAYMORPHISM (Squishy Clay Cards) */
        .clay-card {
          border-radius: 1.35rem;
          background: linear-gradient(180deg, #ffffff 0%, #fff7fa 100%);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            0 10px 22px rgba(244, 114, 182, 0.16),
            0 3px 6px rgba(0, 0, 0, 0.03),
            inset 0 4px 8px #ffffff,
            inset 0 -4px 8px rgba(244, 114, 182, 0.12);
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .clay-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 14px 28px rgba(244, 114, 182, 0.24),
            0 4px 8px rgba(0, 0, 0, 0.04),
            inset 0 4px 8px #ffffff,
            inset 0 -4px 8px rgba(244, 114, 182, 0.14);
        }

        /* 6. ĐẾ NÚT LÕM 3D (Concave Button Socket) */
        .clay-btn-socket {
          border-radius: 9999px;
          background: linear-gradient(180deg, #fce2ec 0%, #ffffff 100%);
          border: 2.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            inset 0 5px 10px rgba(180, 90, 120, 0.32),
            inset 0 -2px 5px #ffffff,
            0 3px 6px rgba(255, 255, 255, 0.95);
        }

        /* 7. NÚT A: ĐẤT SÉT DÂU TÂY (Strawberry Clay Button) */
        .clay-btn-a {
          border-radius: 9999px;
          background: linear-gradient(180deg, #ffffff 0%, #ffc0d3 40%, #fb7185 100%);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            0 10px 20px rgba(244, 63, 94, 0.42),
            0 3px 6px rgba(225, 29, 72, 0.25),
            inset 0 6px 8px #ffffff,
            inset 0 -6px 10px rgba(225, 29, 72, 0.38);
          transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .clay-btn-a:hover {
          transform: scale(1.06) translateY(-2px);
          box-shadow:
            0 14px 26px rgba(244, 63, 94, 0.50),
            0 4px 8px rgba(225, 29, 72, 0.26),
            inset 0 6px 10px #ffffff,
            inset 0 -6px 10px rgba(225, 29, 72, 0.38);
        }
        .clay-btn-a:active {
          transform: scale(0.95) translateY(4px);
          box-shadow:
            0 2px 6px rgba(244, 63, 94, 0.28),
            inset 0 4px 8px rgba(0, 0, 0, 0.22);
        }

        /* 8. NÚT B: ĐẤT SÉT TÍM LAVENDER (Lavender Clay Button) */
        .clay-btn-b {
          border-radius: 9999px;
          background: linear-gradient(180deg, #ffffff 0%, #e9d5ff 40%, #c084fc 100%);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            0 10px 20px rgba(192, 132, 252, 0.42),
            0 3px 6px rgba(147, 51, 234, 0.25),
            inset 0 6px 8px #ffffff,
            inset 0 -6px 10px rgba(147, 51, 234, 0.38);
          transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .clay-btn-b:hover {
          transform: scale(1.06) translateY(-2px);
          box-shadow:
            0 14px 26px rgba(192, 132, 252, 0.50),
            0 4px 8px rgba(147, 51, 234, 0.26),
            inset 0 6px 10px #ffffff,
            inset 0 -6px 10px rgba(147, 51, 234, 0.38);
        }
        .clay-btn-b:active {
          transform: scale(0.95) translateY(4px);
          box-shadow:
            0 2px 6px rgba(192, 132, 252, 0.28),
            inset 0 4px 8px rgba(0, 0, 0, 0.22);
        }

        /* 9. NÚT C: ĐẤT SÉT BẠC HÀ (Mint Clay Button) */
        .clay-btn-c {
          border-radius: 9999px;
          background: linear-gradient(180deg, #ffffff 0%, #a7f3d0 40%, #34d399 100%);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            0 10px 20px rgba(52, 211, 153, 0.42),
            0 3px 6px rgba(5, 150, 105, 0.25),
            inset 0 6px 8px #ffffff,
            inset 0 -6px 10px rgba(5, 150, 105, 0.38);
          transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .clay-btn-c:hover {
          transform: scale(1.06) translateY(-2px);
          box-shadow:
            0 14px 26px rgba(52, 211, 153, 0.50),
            0 4px 8px rgba(5, 150, 105, 0.26),
            inset 0 6px 10px #ffffff,
            inset 0 -6px 10px rgba(5, 150, 105, 0.38);
        }
        .clay-btn-c:active {
          transform: scale(0.95) translateY(4px);
          box-shadow:
            0 2px 6px rgba(52, 211, 153, 0.28),
            inset 0 4px 8px rgba(0, 0, 0, 0.22);
        }

        /* 10. NÚT HÀNH ĐỘNG DẠNG VIÊN THUỐC CLAY (Pill Clay Action Buttons) */
        .clay-action-pill {
          border-radius: 9999px;
          background: linear-gradient(180deg, #ffffff 0%, #fff0f5 100%);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            0 6px 16px rgba(244, 114, 182, 0.22),
            inset 0 3px 5px #ffffff,
            inset 0 -3px 5px rgba(225, 75, 123, 0.18);
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .clay-action-pill:hover {
          transform: translateY(-1.5px);
          box-shadow:
            0 10px 22px rgba(244, 114, 182, 0.30),
            inset 0 3px 5px #ffffff,
            inset 0 -3px 5px rgba(225, 75, 123, 0.18);
        }
        .clay-action-pill:active {
          transform: translateY(2px);
          box-shadow:
            0 2px 6px rgba(244, 114, 182, 0.20),
            inset 0 2px 4px rgba(0, 0, 0, 0.12);
        }

        /* 11. PHONG CÁCH SPLIT GLOSS GRADIENT THEO CÔNG THỨC CHUẨN (ĐỔ BÓNG CẮT NGANG Ở 48% - 50%) */
        /* Nút thả tim & hòm thư: Dải màu Split Gloss nhạt lại thêm một chút, mềm mại và thanh thoát */
        .split-gloss-btn {
          padding: 8px 4px;                /* py-2 px-1 */
          border-radius: 12px;             /* rounded-xl */
          border: 1px solid rgba(244, 114, 182, 0.32); /* border-pink-300/32 */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;

          /* Dải màu Split Gloss nhạt hơn, tông hồng sữa phấn êm ái */
          background: linear-gradient(
            to bottom,
            #fff4f9 0%,    /* Đỉnh nút: hồng sữa rất nhạt, trong trẻo */
            #fde0ee 48%,   /* Mép trên đường cắt ánh sáng: hồng pastel dịu */
            #fabdd8 50%,   /* Đường cắt gắt: hồng phấn ngọt ngào vừa độ */
            #faa5c9 100%   /* Đáy nút: hồng dâu dịu mát, nhạt hơn trước */
          );

          /* Hiệu ứng đổ bóng nổi khối */
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.9),   /* Viền bóng sáng mép trên */
            0 1px 2px rgba(225, 29, 72, 0.10);          /* Đổ bóng êm dịu */

          /* Chữ & Icon */
          color: #942b54 !important;                   /* Màu hồng quả mọng dịu hài hòa */
          font-size: 10px;
          font-weight: 700;                /* In đậm */
          text-transform: uppercase;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          user-select: none;
        }

        .split-gloss-btn:hover {
          transform: translateY(-1px);
          box-shadow: 
            inset 0 1px 1.5px rgba(255, 255, 255, 0.95),
            0 2px 5px rgba(244, 114, 182, 0.22);
        }

        .split-gloss-btn:active {
          transform: translateY(1px);
          box-shadow: 
            inset 0 1.5px 2px rgba(0, 0, 0, 0.10),
            0 1px 1px rgba(244, 114, 182, 0.12);
        }

        .jelly-glossy-btn,
        .jelly-glossy-btn-pink {
          padding: 8px 4px;                /* py-2 px-1 */
          border-radius: 12px;             /* rounded-xl */
          border: 1px solid rgba(244, 114, 182, 0.4); /* border-pink-300/40 */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;

          /* Dải màu Split Gloss Gradient */
          background: linear-gradient(
            to bottom,
            #ffd8e7 0%,    /* Đỉnh nút: hồng phấn rất nhạt */
            #fbb9d4 48%,   /* Mép trên đường cắt ánh sáng */
            #f896be 50%,   /* Đường cắt gắt: bắt đầu khối màu đáy */
            #f376a5 100%   /* Đáy nút: hồng dâu tây đậm */
          );

          /* Hiệu ứng đổ bóng nổi khối */
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.8),  /* Viền bóng sáng mép trên */
            0 1px 2px rgba(190, 18, 60, 0.15);         /* Đổ bóng nhẹ phía dưới */

          /* Chữ & Icon */
          color: #831e45 !important;                  /* Màu hồng mận chín đậm */
          font-size: 10px;
          font-weight: 700;                /* In đậm */
          text-transform: uppercase;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          user-select: none;
        }

        .jelly-glossy-btn:hover,
        .jelly-glossy-btn-pink:hover {
          transform: translateY(-1px);
          box-shadow: 
            inset 0 1px 1.5px rgba(255, 255, 255, 0.9),
            0 2px 5px rgba(190, 18, 60, 0.2);
        }

        .jelly-glossy-btn:active,
        .jelly-glossy-btn-pink:active {
          transform: translateY(1px);
          box-shadow: 
            inset 0 1.5px 2px rgba(0, 0, 0, 0.12),
            0 1px 1px rgba(190, 18, 60, 0.1);
        }

        /* 2. Trạng thái khi được chọn (Active - Dạng trắng sứ ngọc trai pha hồng nhẹ) */
        .split-gloss-btn-active,
        .split-gloss-active {
          padding: 8px 4px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;

          /* Dải màu nền trắng ngọc trai */
          background: linear-gradient(
            to bottom,
            #ffffff 0%,    /* Trắng tinh khiết */
            #fffbfd 50%,   /* Trắng pha hồng phấn siêu nhạt */
            #ffeef5 100%   /* Đáy hồng sữa pastel */
          ) !important;

          /* Viền & Đổ bóng nổi */
          border: 1px solid #f3b1ca !important;
          box-shadow: 
            0 2px 8px rgba(244, 114, 182, 0.35),       /* Hào quang hồng nhẹ */
            inset 0 1px 2px #ffffff !important;        /* Ánh gương bóng trên đỉnh */

          /* Chữ & Icon khi Active */
          color: #9e2a56 !important;                  /* Hồng quả mọng nổi bật */
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          user-select: none;
        }

        .split-gloss-btn-active:hover,
        .split-gloss-active:hover {
          transform: translateY(-1px);
          box-shadow: 
            0 3px 10px rgba(244, 114, 182, 0.42),
            inset 0 1px 2px #ffffff !important;
        }

        /* Biến thể Tím Lavender dịu nhạt cho nút Hòm Thư theo Split Gloss Gradient */
        .split-gloss-btn-purple,
        .jelly-glossy-btn-purple {
          padding: 8px 4px;
          border-radius: 12px;
          border: 1px solid rgba(192, 132, 252, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: linear-gradient(
            to bottom,
            #fbf5ff 0%,    /* Đỉnh nút: tím phấn rất nhạt */
            #ebdcfc 48%,   /* Mép trên đường cắt ánh sáng */
            #dcbbfb 50%,   /* Đường cắt gắt: bắt đầu khối màu đáy */
            #c497f5 100%   /* Đáy nút: tím hoa cà nhạt */
          );
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.8),
            0 1px 2px rgba(147, 51, 234, 0.15);
          color: #5b21b6 !important;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          user-select: none;
        }

        .split-gloss-btn-purple:hover,
        .jelly-glossy-btn-purple:hover {
          transform: translateY(-1px);
          box-shadow: 
            inset 0 1px 1.5px rgba(255, 255, 255, 0.9),
            0 2px 5px rgba(147, 51, 234, 0.2);
        }

        /* Biến thể Pearl / Ngang cho nút Tiện ích nhỏ (BGM, Copy, Back) */
        .jelly-glossy-btn-pearl {
          padding: 6px 10px;
          border-radius: 12px;
          border: 1px solid rgba(244, 114, 182, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: linear-gradient(
            to bottom,
            #ffffff 0%,
            #fff5f8 48%,
            #fedce6 50%,
            #fbbcd0 100%
          );
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.8),
            0 1px 2px rgba(190, 18, 60, 0.12);
          color: #831e45 !important;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          user-select: none;
        }
        .jelly-glossy-btn-pearl:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(244, 114, 182, 0.20), inset 0 1.5px 2px #ffffff;
        }
      `}</style>

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

      {/* TOP HEADER BAR: Back Button & Style Switcher (Claymorphism) */}
      <header className="relative z-30 max-w-lg mx-auto mb-6 sm:mb-8 px-2">
        <div className={`clay-header p-2.5 rounded-full flex items-center justify-between transition-all ${
          isDarkEffective
            ? 'bg-[#241c2c]/90 border-pink-900/40 text-stone-200'
            : 'text-stone-800'
        }`}>
          {/* Close / Return Button (Claymorphism) */}
          <button
            type="button"
            onClick={onBackToNovels}
            className="clay-action-pill w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-[#8A4C5D] hover:text-black"
            title="Quay lại danh mục truyện"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Option Selector Pills: STYLE 1 (Sổ Kế Hoạch 2 Mặt) | STYLE 2 (Máy Trứng Tamagotchi) */}
          <div className="flex items-center gap-2 shrink-0">
            {onChangeOption && (
              <div className="p-1 rounded-full border border-white/80 bg-white/60 shadow-[inset_0_2px_4px_rgba(244,114,182,0.15)] flex items-center text-xs">
                <button
                  type="button"
                  onClick={() => onChangeOption('style1')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    currentOption === 'style1'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-[0_3px_8px_rgba(244,63,94,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.6)]'
                      : 'text-[#8A4C5D] hover:text-black'
                  }`}
                  title="Style 1: Sổ Kế Hoạch 2 Mặt Nền Ngôi Sao"
                >
                  Style 1
                </button>

                <button
                  type="button"
                  onClick={() => onChangeOption('style2')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    currentOption === 'style2'
                      ? 'bg-[#E14B7B] text-white shadow-[0_3px_8px_rgba(225,75,123,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.6)]'
                      : 'text-[#8A4C5D] hover:text-black'
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
          <div className="cute-toast-pill px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white text-[12px] shadow-[0_12px_32px_rgba(244,114,182,0.45),inset_0_2px_4px_rgba(255,255,255,0.6)] border-2 border-white/80 flex items-center gap-2 select-none tracking-wide">
            <span className="text-sm select-none">🎀</span>
            <span className="font-itim text-[12px] leading-none">{cuteToastMessage}</span>
          </div>
        </div>
      )}

      {/* COMPONENT TAMAGOTCHI / ĐIỆN THOẠI PASTEL - Dời xuống dưới tạo khoảng cách thông thoáng */}
      <div className={`relative max-w-[490px] md:max-w-[445px] mx-auto mt-24 sm:mt-32 py-2 transition-all z-10 ${
        isTamaShaking ? 'tama-shaking' : ''
      }`}>
        {/* VỎ MÁY QUẢ TRỨNG (Outer Shell): Hiệu ứng nổi khối Claymorphism & Neumorphic viền 1px hồng chuẩn bảng màu OKLCH */}
        <div
          className={`tama-clay-neu-shell cl-10-egg-shell p-5 sm:p-8 relative select-none ${
            isDarkEffective
              ? 'bg-[#291e2b] shadow-[0_14px_28px_rgba(0,0,0,0.35),inset_0_3px_6px_rgba(255,255,255,0.2),inset_0_-8px_16px_rgba(0,0,0,0.4)]'
              : ''
          }`}
          style={{
            border: '1px solid #f9a8d4',
          }}
        >
          {/* Chuỗi dây treo móc khóa hạt cườm kẹo thạch 3D Claymorphism */}
          <TamagotchiCharmBeads />

          {/* Thẻ nhãn phong cách retro 3D dập nổi: ★MY SWEET PHONE★ */}
          <div className="text-center pb-2 relative z-20">
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-black border ${
              isDarkEffective
                ? 'bg-[#3b2738] text-pink-300 border-pink-900/60 shadow-[2px_2px_6px_#17101a]'
                : 'bg-gradient-to-b from-white via-pink-50 to-pink-100 text-[#9d3b5d] border-white shadow-[0_4px_10px_rgba(244,63,94,0.20),inset_0_2px_3px_#ffffff,inset_0_-2px_3px_rgba(225,75,123,0.18)]'
            }`}>
              <span
                className="tracking-wider"
                style={{
                  fontFamily: "'Pixelify Sans', cursive, monospace, sans-serif",
                  textShadow: '0 1px 0 rgba(255, 255, 255, 0.8), 0 -1px 0 rgba(190, 18, 60, 0.2)',
                }}
              >
                ★MY SWEET PHONE★
              </span>
            </div>
          </div>

          {/* CỤM LOA THOẠI & CAMERA TRƯỚC 3D KHẮC CHÌM */}
          <div className="flex items-center justify-center gap-3 pb-2.5 select-none relative z-20">
            {/* Loa thoại vát mép chìm */}
            <div className="w-14 sm:w-16 h-2 rounded-full bg-[#baa6b8] shadow-[inset_0_2px_4px_rgba(0,0,0,0.38),0_1px_2px_#ffffff] border border-pink-200/60" />
            {/* Camera trước dạng thấu kính 3D có giác lồi */}
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-[#8c748e] to-[#453147] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_1.5px_3px_#ffffff] border border-white/80 flex items-center justify-center relative">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_4px_rgba(34,211,238,0.9)]" />
              <div className="absolute top-0.5 left-0.5 w-1 h-0.5 bg-white/80 rounded-full" />
            </div>
          </div>

          {/* KHUNG VIỀN MÀN HÌNH NỔI 3D (Raised Outer Bezel - Giảm kích cỡ đường viền trắng) */}
          <div className="clay-screen-bezel relative p-1 sm:p-1.5">
            {/* MÀN HÌNH MA TRẬN LCD LÕM 3D (Sunken LCD Screen with Real Glass Reflection) */}
            <div
              className={`clay-screen-sunken p-4 sm:p-6 space-y-4 relative overflow-hidden tamagotchi-screen-lcd ${
                isDarkEffective
                  ? 'bg-[#201724] border-[#6b354b] text-[#ebd4e0] shadow-[inset_5px_5px_14px_#110c14,inset_-5px_-5px_14px_#2e2133]'
                  : ''
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

            {/* KHUNG PHÁT NHẠC ĐĨA THAN VINYL (Xuất hiện ở các trang Chào mừng, Mục đích hoạt động, Hạ tầng máy chủ và Bình luận văn minh) */}
            {(activeTab === 'welcome' || activeTab === 'purpose' || activeTab === 'server' || activeTab === 'comments') && (
              <div className="clay-card py-2.5 px-3.5 flex items-center justify-between gap-2.5 select-none">
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

                {/* Nút Bật/Tắt BGM theo phong cách Pearl Split Gloss Gradient (Đồng bộ màu sắc) */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setIsVinylPlaying((prev) => !prev)}
                  className="jelly-glossy-btn-pearl px-3 py-1.5 flex items-center gap-1.5 cursor-pointer text-[10px] font-bold shrink-0 select-none"
                  title={isVinylPlaying ? 'Bấm để ngừng chuyển động BGM' : 'Bấm để bật chuyển động BGM'}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isVinylPlaying ? (
                      <Pause className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                    ) : (
                      <Play className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                    )}
                    <span>{isVinylPlaying ? 'Tắt BGM' : 'Bật BGM'}</span>
                  </span>
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
                  <div className="clay-card p-4 space-y-3">
                    <div className="flex items-center border-b border-dashed border-pink-200 pb-2">
                      <span className="text-[11px] font-black text-rose-700 uppercase flex items-center gap-1 font-mono tracking-tight">
                        <span>🌸</span>
                        <span>MỤC ĐÍCH HOẠT ĐỘNG</span>
                      </span>
                    </div>

                    <div className="clay-card p-3.5 text-xs font-sans leading-relaxed space-y-2 text-pink-900 bg-pink-50/80 border border-pink-100">
                      <p>
                        Web được thành lập hoàn toàn phi thương mại và phi lợi nhuận, nhằm mục đích đăng tải và lưu trữ những bộ truyện mình yêu thích và đã edit hoàn chỉnh.
                      </p>
                      <p className="pt-2 border-t border-pink-200/70">
                        💖 Vui lòng không sử dụng để đăng lại hoặc chuyển ver.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TRANG 3: CẢNH BÁO 18+ */}
              {activeTab === 'warning' && (
                <div className="clay-card p-4 space-y-3 border-2 border-rose-200/90 bg-gradient-to-b from-white via-rose-50/70 to-rose-100/50">
                  <div className="flex items-center justify-between border-b border-dashed border-rose-200 pb-2">
                    <span className="text-[11px] font-black text-rose-700 uppercase flex items-center gap-1 font-mono tracking-tight">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>CẢNH BÁO NỘI DUNG</span>
                    </span>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black shadow-[0_2px_6px_rgba(244,63,94,0.35)] animate-pulse">
                      18+ ONLY
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed font-sans text-stone-800">
                    Trang web chứa các tác phẩm thuộc thể loại <strong>đam mỹ có yếu tố 18+, ngôn từ thô tục</strong>.
                  </p>

                  <div className="clay-card p-3 text-xs font-sans leading-relaxed space-y-1 bg-white/90 border-rose-200 text-rose-950">
                    <p className="font-bold text-rose-800">LƯU Ý QUAN TRỌNG:</p>
                    <p>
                      Tất cả tình tiết, nhân vật và sự kiện hoàn toàn là <strong>HƯ CẤU</strong> và không phản ánh tiêu chuẩn đạo đức xã hội thực tế.
                    </p>
                  </div>

                  <p className="text-[11px] text-rose-700 font-bold font-sans">
                    Nếu bạn dưới 18 tuổi hoặc không phù hợp với thể loại truyện này, xin vui lòng rời khỏi web.
                  </p>
                </div>
              )}

              {/* TRANG 4: HẠ TẦNG WEB CLOUD */}
              {activeTab === 'server' && (
                <div className="clay-card p-4 space-y-3 border-2 border-teal-200/90 bg-gradient-to-b from-white via-teal-50/70 to-teal-100/50">
                  <div className="flex items-center justify-between border-b border-dashed border-teal-200 pb-2">
                    <span className="text-[11px] font-black text-teal-800 uppercase flex items-center gap-1 font-mono tracking-tight">
                      <Server className="w-3.5 h-3.5 text-teal-600" />
                      <span>HẠ TẦNG MÁY CHỦ</span>
                    </span>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold border border-teal-200/70 shadow-2xs">
                      CLOUD FREE TIER
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed font-sans text-stone-700">
                    Trang web được vận hành và duy trì hoàn toàn bằng <strong>hạ tầng máy chủ đám mây miễn phí</strong> nhằm mục đích phi thương mại.
                  </p>

                  <p className="text-[11px] font-sans italic text-teal-900">
                    Nếu web bảo trì hoặc gián đoạn, bạn có thể ghé Wattpad hoặc WordPress để tiếp tục đọc truyện nhé!
                  </p>
                </div>
              )}

              {/* TRANG 5: BÌNH LUẬN VĂN MINH */}
              {activeTab === 'comments' && (
                <div className="clay-card p-4 space-y-3 border-2 border-purple-200/90 bg-gradient-to-b from-white via-purple-50/70 to-purple-100/50">
                  <div className="flex items-center justify-between border-b border-dashed border-purple-200 pb-2">
                    <span className="text-[11px] font-black text-purple-800 uppercase flex items-center gap-1 font-mono tracking-tight">
                      <MessageCircle className="w-3.5 h-3.5 text-purple-600" />
                      <span>BÌNH LUẬN VĂN MINH</span>
                    </span>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200/70 shadow-2xs">
                      OPEN CHAT
                    </span>
                  </div>

                  <div className="clay-card p-3 border border-purple-200 bg-purple-50/80 text-stone-800 text-xs leading-relaxed font-sans">
                    Web mở cổng bình luận tự do, không cần đăng nhập tài khoản. Tuy nhiên, mọi người lưu ý không không bình luận mẳng chửi, xúc phạm nhân vật trong truyện. Không nhắc đến tên của nhân vật và bộ truyện không liên quan.
                  </div>
                </div>
              )}

              {/* TRANG 6: NỀN TẢNG DỰ PHÒNG */}
              {activeTab === 'platforms' && (
                <div className="clay-card p-4 space-y-3 border-2 border-amber-200/90 bg-gradient-to-b from-white via-amber-50/70 to-amber-100/50">
                  <div className="flex items-center justify-between border-b border-dashed border-amber-200 pb-2">
                    <span className="text-[11px] font-black text-amber-800 uppercase flex items-center gap-1 font-mono tracking-tight">
                      <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                      <span>NỀN TẢNG KHÁC</span>
                    </span>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200/70 shadow-2xs">
                      OFFICIAL LINKS
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed font-sans text-stone-700">
                    Xem truyện tại các nền tảng chính chủ dự phòng:
                  </p>

                  <div className="space-y-2.5">
                    {/* Wattpad */}
                    <div className="clay-card p-3 space-y-1.5 font-sans bg-amber-50/80 border-amber-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-900">
                          Wattpad (Chỉ truyện mới)
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('https://www.wattpad.com/user/Qingxiya52', 'wattpad')}
                          className="jelly-glossy-btn-pearl p-1.5 flex items-center justify-center cursor-pointer rounded-full"
                          title={copiedWattpad ? 'Đã sao chép liên kết' : 'Sao chép liên kết'}
                        >
                          <span className="relative z-10">
                            {copiedWattpad ? <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600" /> : <Copy className="w-3.5 h-3.5 stroke-[2.2]" />}
                          </span>
                        </button>
                      </div>
                      <a
                        href="https://www.wattpad.com/user/Qingxiya52"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline block truncate font-mono text-stone-600 hover:text-amber-800"
                      >
                        https://www.wattpad.com/user/Qingxiya52
                      </a>
                    </div>

                    {/* WordPress */}
                    <div className="clay-card p-3 space-y-1.5 font-sans bg-sky-50/80 border-sky-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-sky-900">
                          WordPress (Kho truyện hoàn)
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('https://nienthoi003.wordpress.com/', 'wordpress')}
                          className="jelly-glossy-btn-pearl p-1.5 flex items-center justify-center cursor-pointer rounded-full"
                          title={copiedWordpress ? 'Đã sao chép liên kết' : 'Sao chép liên kết'}
                        >
                          <span className="relative z-10">
                            {copiedWordpress ? <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600" /> : <Copy className="w-3.5 h-3.5 stroke-[2.2]" />}
                          </span>
                        </button>
                      </div>
                      <a
                        href="https://nienthoi003.wordpress.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline block truncate font-mono text-stone-600 hover:text-sky-800"
                      >
                        https://nienthoi003.wordpress.com/
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TRANG RIÊNG BIỆT: HÒM THƯ */}
              {activeTab === 'messages' && (
                <div className="clay-card p-4 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-dashed border-pink-200 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-rose-600 dark:text-pink-400 fill-rose-100 dark:fill-rose-950/40 transition-colors duration-300 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="3" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <div>
                        <span className="text-xs font-black uppercase block tracking-tight font-mono text-rose-800 dark:text-pink-300">
                          HÒM THƯ
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('purpose')}
                      className="jelly-glossy-btn-pearl p-1.5 text-xs font-bold flex items-center justify-center cursor-pointer shrink-0 rounded-full"
                      title="Quay lại"
                    >
                      <span className="relative z-10">
                        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
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
                        className="jelly-glossy-btn-pink px-3.5 py-1.5 rounded-full text-xs font-bold font-sans flex items-center gap-1.5 justify-center cursor-pointer shrink-0"
                      >
                        <span className="relative z-10 flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                          <span>Gửi</span>
                        </span>
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
                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-900 dark:text-purple-200 border-b border-purple-100 dark:border-purple-900/50 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const nextIdx = (readerMsgIconColorIndex + 1) % READER_MSG_ICON_COLORS.length;
                            setReaderMsgIconColorIndex(nextIdx);
                            showToast(`Đã đổi màu icon: ${READER_MSG_ICON_COLORS[nextIdx].name} 🎨`);
                          }}
                          className="cursor-pointer p-0.5 rounded-md hover:bg-purple-100/70 dark:hover:bg-purple-900/40 active:scale-90 transition-all flex items-center justify-center group"
                          title="Bấm để đổi màu icon 🎨"
                        >
                          <MessageCircle
                            className={`w-3.5 h-3.5 ${currentMsgIconColor.text} ${currentMsgIconColor.fill} group-hover:scale-115 transition-all duration-300 shrink-0`}
                          />
                        </button>
                        <span>LỜI NHẮN ĐỘC GIẢ ({recentMessages.length})</span>
                      </span>
                      <span className="text-[9px] text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full font-mono">
                        Mới nhất
                      </span>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1.5 tamagotchi-scrollbar">
                      {recentMessages.length === 0 ? (
                        <div className="py-8 px-3 text-center text-xs font-sans text-stone-400 leading-relaxed">
                          Chưa có lời nhắn nào. Hãy gửi lời nhắn đầu tiên cho góc nhỏ nhé! 💌
                        </div>
                      ) : (
                        recentMessages.map((msg, idx) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="clay-card p-2.5 text-xs font-sans space-y-1 bg-purple-50/70 border border-purple-100 text-stone-800"
                          >
                            <div className="flex items-center justify-between text-[9px] text-purple-700 font-mono font-bold">
                              <span className="flex items-center gap-1">
                                <span>🌸 {msg.sender || `Độc giả #${recentMessages.length - idx}`}</span>
                              </span>
                              <span className="px-1.5 py-0.5 rounded-md border text-purple-600 bg-white border-purple-100 shadow-2xs">
                                {msg.time}
                              </span>
                            </div>
                            <p className="leading-relaxed font-sans pl-1 text-stone-700">
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



            {/* 2 NÚT ĐIỀU KHIỂN DƯỚI MÀN HÌNH: THẢ TIM & MỞ HÒM THƯ (Chữ và số lượng trên cùng một dòng, không xuống dòng, không icon) */}
            <div className="pt-2.5 border-t border-pink-200/90 dark:border-pink-900/50 flex items-center justify-between gap-2.5 select-none">
              {/* Nút Thả tim / Đã thả tim: Bỏ icon, chữ và số lượng nằm trên cùng một dòng */}
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handlePressB}
                className="split-gloss-btn flex-1 transition-all !flex-row !py-2.5 !px-2 whitespace-nowrap"
                title={hasLiked ? 'Bạn đã thả tim rồi (giới hạn 1 lượt/trình duyệt)' : 'Bấm để thả tim cho góc nhỏ'}
              >
                <div className="flex items-center justify-center gap-1.5 w-full whitespace-nowrap">
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    {hasLiked ? 'ĐÃ THẢ TIM' : 'THẢ TIM'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/85 text-[#942b54]">
                    {tamaHearts}
                  </span>
                </div>
              </motion.button>

              {/* Nút Hòm thư / Mở hòm thư: Bỏ icon, chữ và số lượng nằm trên cùng một dòng */}
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  if (activeTab === 'messages') {
                    setActiveTab('welcome');
                    showToast('Đã đóng hòm thư 🌸');
                  } else {
                    setActiveTab('messages');
                    showToast('Đã mở hòm thư 💌');
                  }
                }}
                className="split-gloss-btn flex-1 transition-all !flex-row !py-2.5 !px-2 whitespace-nowrap"
                title={activeTab === 'messages' ? 'Bấm để đóng hòm thư' : 'Bấm để mở hòm thư'}
              >
                <div className="flex items-center justify-center gap-1.5 w-full whitespace-nowrap">
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    {activeTab === 'messages' ? 'MỞ HÒM THƯ' : 'HÒM THƯ'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/85 text-[#942b54]">
                    {recentMessages.length}
                  </span>
                </div>
              </motion.button>
            </div>
          </div>
          </div>

          {/* BƯỚC 3: CỤM 3 NÚT BẤM VẬT LÝ [A], [B], [C] ĐỐI XỨNG 3D CLAY PEBBLE (.cl-10-button-pebble & .tama-clay-neu-btn) */}
          <div className="pt-6 pb-2 relative z-20">
            <div className="grid grid-cols-3 items-start justify-items-center max-w-[280px] sm:max-w-[310px] mx-auto">
              
              {/* 🍓 NÚT [A] — "ĐỌC TIẾP" (Màu Hồng Dâu) */}
              <div className="flex flex-col items-center justify-center w-full relative">
                <AnimatePresence>
                  {!hasPressedA && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: [0, -3, 0] }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ y: { repeat: Infinity, duration: 1.2 } }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#f43f7e] text-white text-[9px] font-mono font-black shadow-xs tracking-wider whitespace-nowrap z-10 border border-white/70"
                    >
                      <span>BẤM [A] ĐỌC TIẾP ▼</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Đế nút và Phím sỏi Nút [A] */}
                <div className="clay-btn-socket p-1 rounded-full flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handlePressA}
                    className="cl-10-button-pebble tama-clay-neu-btn cl-10-btn-a"
                    title="Nút [A] - Đọc tiếp"
                  >
                    A
                  </button>
                </div>
                <span
                  className="text-[10px] font-mono font-black mt-1.5 whitespace-nowrap tracking-wide text-[#8d2a4a]"
                >
                  ĐỌC TIẾP
                </span>
              </div>

              {/* 💜 NÚT [B] — "THẢ TIM" (Màu Tím Hoa Cà) */}
              <div className="flex flex-col items-center justify-center w-full">
                <div className="clay-btn-socket p-1 rounded-full flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handlePressB}
                    className="cl-10-button-pebble tama-clay-neu-btn cl-10-btn-b"
                    title="Nút [B] - Thả tim"
                  >
                    B
                  </button>
                </div>
                <span
                  className="text-[10px] font-mono font-black text-center mt-1.5 whitespace-nowrap tracking-wide text-[#5c1d8f]"
                >
                  THẢ TIM
                </span>
              </div>

              {/* 💖 NÚT [C] — "TRANG ĐẦU" (Màu Hồng Đậm Mới) */}
              <div className="flex flex-col items-center justify-center w-full">
                <div className="clay-btn-socket p-1 rounded-full flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handlePressC}
                    className="cl-10-button-pebble tama-clay-neu-btn cl-10-btn-c"
                    title="Nút [C] - Trang đầu"
                  >
                    C
                  </button>
                </div>
                <span
                  className="text-[10px] font-mono font-black mt-1.5 whitespace-nowrap tracking-wide text-[#9d174d]"
                >
                  TRANG ĐẦU
                </span>
              </div>

            </div>
          </div>

          {/* HIỆU ỨNG BAY CHÙM TIM HỒNG KHI BẤM NÚT B */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3.8rem]">
            <AnimatePresence>
              {floatingHearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 1, y: 390, x: 230 + heart.x, scale: 0.7 }}
                  animate={{
                    opacity: 0,
                    y: 110,
                    scale: [0.7, 1.4, 1.2],
                    x: 230 + heart.x + Math.sin(heart.id) * 32,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.3, ease: 'easeOut' }}
                  className="absolute text-2xl font-bold select-none z-30 drop-shadow-[0_2px_8px_rgba(244,63,94,0.45)]"
                >
                  {heart.id % 2 === 0 ? '💖' : '💕'}
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
