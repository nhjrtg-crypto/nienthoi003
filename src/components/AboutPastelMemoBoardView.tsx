import React, { useState, useEffect } from 'react';
import {
  Pin,
  Sparkles,
  Paperclip,
  Heart,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  Palette,
  Sun,
  Moon,
  AlertTriangle,
  ArrowRight,
  Share2
} from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

interface CustomNoteItem {
  id: string;
  title: string;
  content: string;
  color: string;
  darkColor: string;
  borderColor: string;
  darkBorderColor: string;
  tapeColor: string;
  tapeDarkColor: string;
  tapeText: string;
  pinColor: string;
  rotation: string;
  createdAt: number;
}

interface AboutPastelMemoBoardViewProps {
  onBackToNovels: () => void;
  currentOption: 'style1' | 'style2' | 'option2' | 'option3' | 'option4';
  onChangeOption: (opt: 'style1' | 'style2') => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const AboutPastelMemoBoardView: React.FC<AboutPastelMemoBoardViewProps> = ({
  onBackToNovels,
  currentOption,
  onChangeOption,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [internalDarkMode, setInternalDarkMode] = useState<boolean>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_darkmode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const isDarkEffective = isDarkMode !== undefined ? isDarkMode : internalDarkMode;

  const toggleDarkMode = () => {
    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else {
      setInternalDarkMode((prev) => {
        const next = !prev;
        safeStorage.setItem('cosmo_darkmode', JSON.stringify(next));
        return next;
      });
    }
  };

  // State cho mẩu lưu bút người dùng tự ghim thêm
  const [customNotes, setCustomNotes] = useState<CustomNoteItem[]>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_pastel_custom_notes_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Lưu danh sách custom notes vào safeStorage
  useEffect(() => {
    try {
      safeStorage.setItem('cosmo_pastel_custom_notes_v1', JSON.stringify(customNotes));
    } catch {}
  }, [customNotes]);

  // Thả tim cổ vũ ở ruy băng cuối bảng
  const [cheerCount, setCheerCount] = useState<number>(() => {
    try {
      const saved = safeStorage.getItem('cosmo_pastel_cheer_count_v1');
      return saved ? parseInt(saved, 10) : 386;
    } catch {
      return 386;
    }
  });
  const [hasCheered, setHasCheered] = useState<boolean>(() => {
    try {
      return safeStorage.getItem('cosmo_pastel_has_cheered_v1') === 'true';
    } catch {
      return false;
    }
  });

  const handleCheer = () => {
    if (hasCheered) return;
    const next = cheerCount + 1;
    setCheerCount(next);
    setHasCheered(true);
    safeStorage.setItem('cosmo_pastel_cheer_count_v1', next.toString());
    safeStorage.setItem('cosmo_pastel_has_cheered_v1', 'true');
  };

  const handleCopyLink = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Thêm mẩu note độc giả
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const pastelPalettes = [
      {
        color: 'bg-[#fff0f3]',
        darkColor: 'bg-[#261720]',
        borderColor: 'border-pink-200',
        darkBorderColor: 'border-pink-900/60',
        tapeColor: 'bg-pink-300/85 border-pink-400/80 text-pink-900',
        tapeDarkColor: 'bg-pink-950/90 border-pink-500/60 text-pink-200',
        tapeText: '✿ LƯU BÚT ĐỘC GIẢ ✿',
        pinColor: 'bg-rose-500',
      },
      {
        color: 'bg-[#fefce8]',
        darkColor: 'bg-[#292212]',
        borderColor: 'border-yellow-200',
        darkBorderColor: 'border-amber-900/60',
        tapeColor: 'bg-yellow-200/90 border-yellow-400/80 text-amber-900',
        tapeDarkColor: 'bg-amber-950/90 border-amber-500/60 text-amber-200',
        tapeText: '♥ LỜI NHẮN YÊU THƯƠNG ♥',
        pinColor: 'bg-amber-500',
      },
      {
        color: 'bg-[#e8fbf3]',
        darkColor: 'bg-[#132620]',
        borderColor: 'border-teal-200',
        darkBorderColor: 'border-teal-900/60',
        tapeColor: 'bg-teal-200/90 border-teal-400/80 text-teal-900',
        tapeDarkColor: 'bg-teal-950/90 border-teal-500/60 text-teal-200',
        tapeText: '🌿 GÓC CHIA SẺ 🌿',
        pinColor: 'bg-teal-500',
      },
      {
        color: 'bg-[#faf5ff]',
        darkColor: 'bg-[#23172e]',
        borderColor: 'border-purple-200',
        darkBorderColor: 'border-purple-900/60',
        tapeColor: 'bg-purple-200/90 border-purple-400/80 text-purple-900',
        tapeDarkColor: 'bg-purple-950/90 border-purple-500/60 text-purple-200',
        tapeText: '♡ THƯ GIÃN CÙNG TRUYỆN ♡',
        pinColor: 'bg-purple-500',
      },
      {
        color: 'bg-[#eff6ff]',
        darkColor: 'bg-[#142030]',
        borderColor: 'border-sky-200',
        darkBorderColor: 'border-sky-900/60',
        tapeColor: 'bg-sky-200/90 border-sky-400/60 text-sky-900',
        tapeDarkColor: 'bg-sky-950/90 border-sky-500/60 text-sky-200',
        tapeText: '✦ MEMO BẠN ĐỌC ✦',
        pinColor: 'bg-sky-500',
      },
    ];

    const pick = pastelPalettes[Math.floor(Math.random() * pastelPalettes.length)];
    const rot = Math.random() > 0.5 ? 'rotate-[1.2deg]' : 'rotate-[-1.2deg]';

    const newNote: CustomNoteItem = {
      id: `custom-note-${Date.now()}`,
      title: newTitle.trim() || 'Lưu Bút Bạn Đọc ✿',
      content: newContent.trim(),
      color: pick.color,
      darkColor: pick.darkColor,
      borderColor: pick.borderColor,
      darkBorderColor: pick.darkBorderColor,
      tapeColor: pick.tapeColor,
      tapeDarkColor: pick.tapeDarkColor,
      tapeText: pick.tapeText,
      pinColor: pick.pinColor,
      rotation: rot,
      createdAt: Date.now(),
    };

    setCustomNotes([newNote, ...customNotes]);
    setNewTitle('');
    setNewContent('');
  };

  const handleDeleteCustomNote = (id: string) => {
    setCustomNotes(customNotes.filter((n) => n.id !== id));
  };

  return (
    <div className={`min-h-screen ${isDarkEffective ? 'dark bg-[#121016] text-[#f2edf7]' : 'bg-[#faf6f0] text-[#2c2825]'} font-sans selection:bg-pink-200 selection:text-pink-900 relative overflow-x-hidden`}>
      {/* Background Subtle Pastel Grid */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 ${isDarkEffective ? 'opacity-20' : 'opacity-40'}`}
        style={{
          backgroundImage: isDarkEffective
            ? 'radial-gradient(#ec4899 0.75px, transparent 0.75px), radial-gradient(#6b7280 0.75px, transparent 0.75px)'
            : 'radial-gradient(#f472b6 0.75px, transparent 0.75px), radial-gradient(#d1d5db 0.75px, transparent 0.75px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* ================= TOP FLOATING NAVIGATION BAR ================= */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-8 py-3 transition-all ${
        isDarkEffective
          ? 'bg-[#181420]/95 border-pink-950/60'
          : 'bg-[#faf6f0]/95 border-pink-200/60'
      }`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          
          {/* Header Left: Nút Dark Mode */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                isDarkEffective
                  ? 'bg-[#221c2b] border-pink-900/60 text-amber-300 hover:bg-[#2c2436] hover:text-amber-200'
                  : 'bg-white border-pink-200/80 text-amber-500 hover:bg-pink-50 hover:text-amber-600 shadow-xs'
              }`}
              title={isDarkEffective ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {isDarkEffective ? (
                <Sun className="w-4 h-4 text-amber-300 fill-amber-300/20" />
              ) : (
                <Moon className="w-4 h-4 text-pink-700 fill-pink-500/20" />
              )}
            </button>
          </div>

          {/* Option Selector Pills: STYLE 1 (Bảng Ghi Chú Pastel) | STYLE 2 (Sổ Tay Collage) & Nút Về Trang Chủ */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={`p-1 rounded-full border flex items-center shadow-inner text-xs ${
              isDarkEffective
                ? 'bg-[#221c2b] border-pink-950/60'
                : 'bg-pink-100/70 border-pink-200'
            }`}>
              <button
                type="button"
                onClick={() => onChangeOption('style1')}
                className={`px-3.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  currentOption === 'style1' || currentOption === 'option3'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                    : isDarkEffective ? 'text-stone-400 hover:text-pink-200' : 'text-stone-600 hover:text-black'
                }`}
                title="Style 1: Bảng Ghi Chú Pastel (Sweet Memo Board)"
              >
                Style 1
              </button>

              <button
                type="button"
                onClick={() => onChangeOption('style2')}
                className={`px-3.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  currentOption === 'style2' || currentOption === 'option4'
                    ? isDarkEffective ? 'bg-[#92475a] text-white shadow-xs' : 'bg-[#A36577] text-white shadow-xs'
                    : isDarkEffective ? 'text-stone-400 hover:text-pink-200' : 'text-stone-600 hover:text-black'
                }`}
                title="Style 2: Sổ tay lưu trữ nghệ thuật Collage"
              >
                Style 2
              </button>
            </div>

            {/* Nút quay lại trang chủ đọc truyện */}
            <button
              onClick={onBackToNovels}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs hover:shadow-sm transition-all cursor-pointer ${
                isDarkEffective
                  ? 'bg-[#221c2b] border-pink-950/60 text-pink-200 hover:bg-[#2c2436]'
                  : 'bg-white border-pink-200 text-stone-700 hover:text-pink-600'
              }`}
              title="Về trang chủ đọc truyện"
            >
              <BookOpen className="w-3.5 h-3.5 text-pink-500" />
              <span>Về Trang Chủ</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
        
        {/* Tiêu đề Bảng Ghim */}
        <div className="text-center mb-8 space-y-2 max-w-2xl">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border shadow-xs ${
            isDarkEffective
              ? 'text-pink-300 bg-[#25182a] border-pink-900/60'
              : 'text-pink-700 bg-pink-100/90 border-pink-300/70'
          }`}>
            <Pin className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>BẢNG GHIM PASTEL · SWEET MEMO BOARD</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight ${
            isDarkEffective ? 'text-pink-100' : 'text-stone-800'
          }`}>
            Chào mừng bạn đến với trang web của mình ✿
          </h2>
          <p className={`text-xs sm:text-sm leading-relaxed max-w-xl mx-auto ${
            isDarkEffective ? 'text-stone-300' : 'text-stone-600'
          }`}>
            Website được xây nhằm mục đích đăng tải những bộ truyện mình đã edit hoàn, chỉ phục vụ duy nhất cho mục đích giải trí.
          </p>
        </div>

        {/* ================= THẢM BẢNG LƯU BÚT ẤM ÁP (DESK MAT) ================= */}
        {/* Mặt bảng màu kem ấm (#fbf9f4), họa tiết chấm bi nhẹ nhàng, khung viền gỗ kem pastel thanh lịch và đổ bóng phẳng tự nhiên */}
        <div
          className={`w-full relative rounded-3xl sm:rounded-[36px] p-5 sm:p-8 lg:p-10 border-4 transition-all ${
            isDarkEffective
              ? 'bg-[#1a1622] border-[#382640] shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
              : 'bg-[#fbf9f4] border-[#e8ded3] shadow-[0_16px_50px_rgba(180,160,140,0.18)]'
          }`}
          style={{
            backgroundImage: isDarkEffective
              ? 'radial-gradient(rgba(244, 114, 182, 0.12) 1.2px, transparent 1.2px)'
              : 'radial-gradient(rgba(200, 180, 160, 0.35) 1.2px, transparent 1.2px)',
            backgroundSize: '20px 20px',
          }}
        >
          
          {/* Header Bàn Làm Việc: Form viết giấy note mới */}
          <div className={`mb-8 p-4 sm:p-5 rounded-2xl border shadow-xs transition-colors ${
            isDarkEffective
              ? 'bg-[#221c2b] border-pink-900/50 text-stone-100'
              : 'bg-white/90 border-pink-200 text-stone-800'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-pink-500" />
                <h3 className="text-xs sm:text-sm font-bold">
                  Ghim thêm mẩu lưu bút của bạn lên bảng ✿
                </h3>
              </div>
              <span className={`text-[11px] ${isDarkEffective ? 'text-pink-300/70' : 'text-pink-600/70'} font-medium`}>
                Đính kèm tự do
              </span>
            </div>

            <form onSubmit={handleAddNote} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Tiêu đề mẩu note..."
                className={`w-full sm:w-56 px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-300 transition-colors ${
                  isDarkEffective
                    ? 'bg-[#16121d] border-pink-900/60 text-pink-100 placeholder:text-stone-500'
                    : 'bg-pink-50/50 border-pink-200 text-stone-900 placeholder:text-stone-400'
                }`}
              />
              <input
                type="text"
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Viết lời nhắn gửi hoặc cảm nghĩ của bạn hôm nay..."
                className={`flex-1 w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-300 transition-colors ${
                  isDarkEffective
                    ? 'bg-[#16121d] border-pink-900/60 text-pink-100 placeholder:text-stone-500'
                    : 'bg-pink-50/50 border-pink-200 text-stone-900 placeholder:text-stone-400'
                }`}
              />
              <button
                type="submit"
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-pink-400 to-rose-400 text-white cursor-pointer hover:opacity-90 flex items-center justify-center gap-1.5 shrink-0 transition-transform active:scale-95 ${
                  isDarkEffective ? 'shadow-none' : 'shadow-md shadow-pink-200/50'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Ghim Note</span>
              </button>
            </form>
          </div>

          {/* ================= LƯỚI CÁC MẪU GIẤY NOTE PASTEL CHÍNH ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8">
            
            {/* ---------------- 1. NOTE HỒNG PHẤN DÂU (Lời Chào & Mục Đích Hoạt Động) ---------------- */}
            <div
              className={`relative p-6 sm:p-7 rounded-2xl ${
                isDarkEffective
                  ? 'bg-[#271620] border-pink-900/60 text-pink-100'
                  : 'bg-[#fff0f3] border-pink-200 text-stone-900'
              } shadow-md border rotate-[-1deg] transition-transform duration-300 hover:rotate-0 hover:shadow-xl`}
            >
              {/* Băng dính Washi hoa văn viền nét đứt ở mép trên */}
              <div className={`absolute -top-3.5 left-10 w-44 h-6.5 ${
                isDarkEffective
                  ? 'bg-pink-950/90 border-pink-500/70 text-pink-200'
                  : 'bg-pink-300/85 border-pink-400/80 text-pink-900'
              } border-y border-dashed rotate-[1.5deg] select-none flex items-center justify-center text-[10px] font-bold font-mono tracking-wider shadow-2xs`}>
                ✿ WELCOME NOTE ✿
              </div>

              {/* Chiếc đinh ghim tròn pastel góc phải */}
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-md select-none" />

              {/* Nội dung bên trong note */}
              <div className="space-y-3 pt-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isDarkEffective ? 'bg-pink-900/50 text-pink-300' : 'bg-pink-200 text-pink-800'
                }`}>
                  Lời Chào & Mục Đích Hoạt Động
                </span>
                
                <h3 className={`text-lg sm:text-xl font-serif font-black leading-snug ${
                  isDarkEffective ? 'text-pink-100' : 'text-stone-900'
                }`}>
                  Chào mừng bạn đến với trang web của mình
                </h3>
                
                <p className={`text-xs sm:text-sm font-sans leading-relaxed pl-3 border-l-2 ${
                  isDarkEffective ? 'border-pink-500 text-stone-200' : 'border-pink-400 text-stone-700'
                }`}>
                  Website được xây nhằm mục đích đăng tải những bộ truyện mình đã edit hoàn, chỉ phục vụ duy nhất cho mục đích giải trí.
                </p>

                {/* Mẩu note nhỏ dán đè lời nhắn gửi yêu thương từ Editor */}
                <div className={`mt-3 p-3 rounded-xl border shadow-2xs rotate-[0.8deg] transition-transform hover:rotate-0 ${
                  isDarkEffective
                    ? 'bg-[#1e1119] border-pink-900/70 text-pink-200'
                    : 'bg-white/95 border-pink-200 text-pink-900'
                }`}>
                  <p className="text-xs font-sans leading-relaxed flex items-start gap-1.5">
                    <span className="text-sm leading-none shrink-0">💌</span>
                    <span>
                      <strong className="font-bold">Lời nhắn từ Editor Jouriee65:</strong> Cảm ơn các bạn đã ghé thăm góc nhỏ của mình. Chúc các bạn luôn có những giây phút thư giãn thật trọn vẹn và thoải mái bên từng trang truyện!
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ---------------- 2. NOTE CAM ĐÀO PASTEL (CẢNH BÁO NỘI DUNG 18+) ---------------- */}
            <div
              className={`relative p-6 sm:p-7 rounded-2xl ${
                isDarkEffective
                  ? 'bg-[#2a1b14] border-orange-900/60 text-orange-100'
                  : 'bg-[#fff7ed] border-orange-200 text-stone-900'
              } shadow-md border rotate-[1.2deg] transition-transform duration-300 hover:rotate-0 hover:shadow-xl`}
            >
              {/* Băng dính Washi vàng cam cảnh báo viền nét đứt */}
              <div className={`absolute -top-3.5 right-10 w-48 h-6.5 ${
                isDarkEffective
                  ? 'bg-amber-950/90 border-amber-500/70 text-amber-200'
                  : 'bg-amber-200/90 border-y border-dashed border-amber-400/80 text-amber-900'
              } border-y border-dashed rotate-[-1.5deg] select-none flex items-center justify-center text-[10px] font-bold font-mono tracking-wider shadow-2xs`}>
                ⚠️ CONTENT WARNING ⚠️
              </div>

              {/* Đinh ghim đỏ cam góc trái */}
              <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-md select-none" />

              <div className="space-y-3 pt-2">
                {/* Nhãn dán tag 18+, ĐAM MỸ */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    isDarkEffective ? 'bg-rose-950/60 text-rose-300' : 'bg-rose-100 text-rose-700'
                  }`}>
                    Cảnh Báo Nội Dung
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                    isDarkEffective ? 'bg-amber-950/50 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    18+
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                    isDarkEffective ? 'bg-orange-950/50 text-orange-300 border-orange-800' : 'bg-orange-100 text-orange-800 border-orange-200'
                  }`}>
                    ĐAM MỸ
                  </span>
                </div>

                <h3 className={`text-lg sm:text-xl font-serif font-black ${
                  isDarkEffective ? 'text-orange-100' : 'text-stone-900'
                }`}>
                  CẢNH BÁO NỘI DUNG
                </h3>

                <p className={`text-xs sm:text-sm font-sans leading-relaxed pl-3 border-l-2 ${
                  isDarkEffective ? 'border-orange-500 text-stone-200' : 'border-orange-400 text-stone-700'
                }`}>
                  Trang web chứa các tác phẩm thuộc thể loại đam mỹ có yếu tố 18+, ngôn từ thô tục. Tất cả tình tiết chỉ để giải trí, hoàn toàn là hư cấu và không phản ánh tiêu chuẩn đạo đức xã hội thực tế.
                </p>

                {/* Khung khuyến nghị nổi bật dán đè */}
                <div className={`mt-3 p-3 rounded-xl border shadow-2xs rotate-[-0.6deg] ${
                  isDarkEffective
                    ? 'bg-[#1f120c] border-orange-900/70 text-rose-300'
                    : 'bg-white/95 border-orange-300 text-rose-700'
                }`}>
                  <p className="text-xs font-sans font-bold leading-relaxed flex items-start gap-1.5">
                    <span className="text-base leading-none shrink-0">⚠️</span>
                    <span>
                      Nếu bạn cảm thấy không thích bất kỳ thể loại truyện nào, xin vui lòng rời khỏi web.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ---------------- 3. NOTE XANH BẠC HÀ / BƠ PASTEL (Hạ Tầng & Giới Hạn Máy Chủ) ---------------- */}
            <div
              className={`relative p-6 sm:p-7 rounded-2xl ${
                isDarkEffective
                  ? 'bg-[#132620] border-teal-900/60 text-teal-100'
                  : 'bg-[#e8fbf3] border-teal-200 text-stone-900'
              } shadow-md border rotate-[-0.8deg] transition-transform duration-300 hover:rotate-0 hover:shadow-xl`}
            >
              {/* Kẹp giấy kim loại ở góc trên bên trái */}
              <div className="absolute -top-3 left-6 text-teal-600 dark:text-teal-400 select-none">
                <Paperclip className="w-6 h-6 drop-shadow-xs" />
              </div>

              {/* Băng dính Washi hoa văn viền nét đứt */}
              <div className={`absolute -top-3.5 right-12 w-44 h-6.5 ${
                isDarkEffective
                  ? 'bg-teal-950/90 border-teal-500/70 text-teal-200'
                  : 'bg-teal-200/90 border-teal-400/80 text-teal-900'
              } border-y border-dashed rotate-[1.2deg] select-none flex items-center justify-center text-[10px] font-bold font-mono tracking-wider shadow-2xs`}>
                🌿 INFRASTRUCTURE 🌿
              </div>

              {/* Ghim đinh xanh ngọc góc phải */}
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow-md select-none" />

              <div className="space-y-3 pt-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isDarkEffective ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-800'
                }`}>
                  🌿 Hạ Tầng & Vận Hành
                </span>

                <h3 className={`text-lg sm:text-xl font-serif font-black ${
                  isDarkEffective ? 'text-teal-100' : 'text-stone-900'
                }`}>
                  Vận Hành Phi Thương Mại & Giới Hạn Máy Chủ
                </h3>

                <p className={`text-xs sm:text-sm font-sans leading-relaxed pl-3 border-l-2 ${
                  isDarkEffective ? 'border-teal-500 text-stone-200' : 'border-teal-400 text-stone-700'
                }`}>
                  Trang web được vận hành và duy trì hoàn toàn bằng hạ tầng máy chủ miễn phí nhằm mục đích phi thương mại. Do đó, hệ thống sẽ có một số giới hạn kỹ thuật nhất định: Đôi khi có thể bị chậm hoặc tạm dừng. Nếu không vào được web, các bạn có thể ghé qua các link nền tảng phía trên để tiếp tục đọc truyện không bị gián đoạn.
                </p>

                {/* Hộp ghi chú pastel dịu mắt */}
                <div className={`mt-3 p-3 rounded-xl border text-xs space-y-1 ${
                  isDarkEffective
                    ? 'bg-[#0e1d18] border-teal-900/60 text-teal-200'
                    : 'bg-teal-50/90 border-teal-200 text-teal-950'
                }`}>
                  <p>• Hệ thống phi thương mại đôi khi có thể bị chậm hoặc tạm dừng tải dữ liệu.</p>
                  <p>• Bạn có thể dùng các link nền tảng khác để đọc truyện tiếp tục không bị gián đoạn.</p>
                </div>
              </div>
            </div>

            {/* ---------------- 4. NOTE TÍM LAVENDER PASTEL (Quy Định Bình Luận & Không Gian Văn Minh) ---------------- */}
            <div
              className={`relative p-6 sm:p-7 rounded-2xl ${
                isDarkEffective
                  ? 'bg-[#23172e] border-purple-900/60 text-purple-100'
                  : 'bg-[#faf5ff] border-purple-200 text-stone-900'
              } shadow-md border rotate-[1.1deg] transition-transform duration-300 hover:rotate-0 hover:shadow-xl`}
            >
              {/* Băng dính Washi tím pastel viền nét đứt */}
              <div className={`absolute -top-3.5 left-12 w-40 h-6.5 ${
                isDarkEffective
                  ? 'bg-purple-950/90 border-purple-500/70 text-purple-200'
                  : 'bg-purple-200/90 border-purple-400/80 text-purple-900'
              } border-y border-dashed rotate-[-1.5deg] select-none flex items-center justify-center text-[10px] font-bold font-mono tracking-wider shadow-2xs`}>
                ✿ GUESTBOOK ✿
              </div>

              {/* Đinh ghim tím góc trái */}
              <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-md select-none" />

              <div className="space-y-3 pt-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isDarkEffective ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                }`}>
                  ✿ Quy Định Bình Luận & Không Gian Văn Minh
                </span>

                <h3 className={`text-lg sm:text-xl font-serif font-black ${
                  isDarkEffective ? 'text-purple-100' : 'text-stone-900'
                }`}>
                  Cổng Bình Luận Tự Do
                </h3>

                <p className={`text-xs sm:text-sm font-sans leading-relaxed pl-3 border-l-2 ${
                  isDarkEffective ? 'border-purple-500 text-stone-200' : 'border-purple-400 text-stone-700'
                }`}>
                  Web mở cổng bình luận tự do (không cần đăng nhập). Tuy nhiên, để giữ gìn một không gian văn minh, xin vui lòng tuân thủ:
                </p>

                {/* Khung quy định nổi bật */}
                <div className={`mt-3 p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  isDarkEffective
                    ? 'bg-[#1b1024] border-purple-900/60 text-purple-200'
                    : 'bg-purple-50/90 border-purple-200 text-purple-950'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span>Tôn trọng nhân vật / tác giả:</span>
                  </div>
                  <p className={`leading-relaxed pl-5 ${
                    isDarkEffective ? 'text-stone-300' : 'text-stone-700'
                  }`}>
                    Không bình luận mắng chửi, xúc phạm nhân vật trong truyện, tác giả hay editor.
                  </p>
                </div>
              </div>
            </div>

            {/* ---------------- 5. NOTE XANH DƯƠNG BABY PASTEL (Xem Truyện Tại Các Nền Tảng Khác) ---------------- */}
            <div
              className={`relative p-6 sm:p-7 rounded-2xl md:col-span-2 ${
                isDarkEffective
                  ? 'bg-[#142030] border-sky-900/60 text-sky-100'
                  : 'bg-[#eff6ff] border-sky-200 text-stone-900'
              } shadow-md border rotate-[-0.6deg] transition-transform duration-300 hover:rotate-0 hover:shadow-xl`}
            >
              {/* Băng dính Washi hoa văn viền nét đứt */}
              <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-44 h-6.5 ${
                isDarkEffective
                  ? 'bg-sky-950/90 border-sky-500/70 text-sky-200'
                  : 'bg-sky-200/90 border-sky-400/80 text-sky-900'
              } border-y border-dashed rotate-[1.2deg] select-none flex items-center justify-center text-[10px] font-bold font-mono tracking-wider shadow-2xs`}>
                ♥ PLATFORMS ♥
              </div>

              {/* Ghim đinh xanh baby góc phải */}
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-md select-none" />

              <div className="space-y-3 pt-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isDarkEffective ? 'bg-sky-900/50 text-sky-300' : 'bg-sky-100 text-sky-800'
                }`}>
                  ♥ Liên Kết Nền Tảng Khác
                </span>

                <h3 className={`text-lg sm:text-xl font-serif font-black ${
                  isDarkEffective ? 'text-sky-100' : 'text-stone-900'
                }`}>
                  Xem truyện tại các nền tảng khác
                </h3>

                <p className={`text-xs sm:text-sm font-sans leading-relaxed pl-3 border-l-2 ${
                  isDarkEffective ? 'border-sky-500 text-stone-200' : 'border-sky-400 text-stone-700'
                }`}>
                  Nếu bạn muốn lưu thư viện hoặc theo dõi tiện lợi trên các ứng dụng di động, các bạn có thể ghé qua các nền tảng chính thức bên dưới:
                </p>

                {/* Hai khối liên kết Wattpad & WordPress có nút mở tab mới và sao chép */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  
                  {/* Khối Wattpad */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                    isDarkEffective
                      ? 'bg-[#0f1724] border-sky-900/60'
                      : 'bg-white/90 border-sky-200 shadow-2xs'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs sm:text-sm text-sky-800 dark:text-sky-200">
                          Wattpad
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-medium">
                          Chỉ đăng truyện mới
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono truncate">
                        https://www.wattpad.com/user/Qingxiya52
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://www.wattpad.com/user/Qingxiya52"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Mở Tab Mới</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyLink('https://www.wattpad.com/user/Qingxiya52', 'Wattpad')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                          isDarkEffective
                            ? 'bg-[#182638] border-sky-800 text-sky-200 hover:bg-[#20334a]'
                            : 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
                        }`}
                        title="Sao chép liên kết Wattpad"
                      >
                        {copiedLink === 'Wattpad' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Khối WordPress */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                    isDarkEffective
                      ? 'bg-[#0f1724] border-sky-900/60'
                      : 'bg-white/90 border-sky-200 shadow-2xs'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs sm:text-sm text-sky-800 dark:text-sky-200">
                          WordPress
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 font-medium">
                          Kho truyện đầy đủ
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono truncate">
                        https://nienthoi003.wordpress.com/
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://nienthoi003.wordpress.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Mở Tab Mới</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyLink('https://nienthoi003.wordpress.com/', 'WordPress')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                          isDarkEffective
                            ? 'bg-[#182638] border-sky-800 text-sky-200 hover:bg-[#20334a]'
                            : 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
                        }`}
                        title="Sao chép liên kết WordPress"
                      >
                        {copiedLink === 'WordPress' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Các mẩu note người dùng tạo thêm (nếu có) */}
            {customNotes.map((note) => (
              <div
                key={note.id}
                className={`relative p-6 sm:p-7 rounded-2xl ${
                  isDarkEffective ? `${note.darkColor} ${note.darkBorderColor} text-pink-100` : `${note.color} ${note.borderColor} text-stone-900`
                } shadow-md border ${note.rotation} transition-transform duration-300 hover:rotate-0 hover:shadow-xl`}
              >
                {/* Băng dính Washi */}
                <div className={`absolute -top-3.5 left-10 w-44 h-6.5 ${
                  isDarkEffective ? note.tapeDarkColor : note.tapeColor
                } border-y border-dashed rotate-[1.5deg] select-none flex items-center justify-center text-[10px] font-bold font-mono tracking-wider shadow-2xs`}>
                  {note.tapeText}
                </div>

                {/* Đinh ghim */}
                <div className={`absolute top-3 right-3 w-4 h-4 rounded-full ${note.pinColor} border-2 border-white shadow-md select-none`} />

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pr-6">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10 text-[10px] font-bold uppercase tracking-wider">
                      ♥ LƯU BÚT ĐỘC GIẢ
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomNote(note.id)}
                      className="text-stone-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                      title="Gỡ mẩu note này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-black leading-snug">
                    {note.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-sans leading-relaxed pl-3 border-l-2 border-pink-400 whitespace-pre-line">
                    {note.content}
                  </p>
                </div>
              </div>
            ))}

          </div>

          {/* ================= RUY BĂNG KẸP GIẤY CUỐI BẢNG ================= */}
          {/* Thẻ dán kẹp ghim với thông điệp: "Chúc các bạn có những giây phút thư giãn!" cùng nút thả tim cổ vũ và nút chuyển nhanh về đọc truyện */}
          <div className="mt-10 pt-4 flex justify-center">
            <div className={`relative w-full max-w-2xl p-5 sm:p-6 rounded-2xl border-2 shadow-lg transition-all ${
              isDarkEffective
                ? 'bg-[#221828] border-pink-900/60 text-pink-100'
                : 'bg-white border-pink-200 text-stone-800'
            }`}>
              
              {/* Kẹp giấy kim loại trang trí ở mép trên thẻ */}
              <div className="absolute -top-3 left-8 text-rose-500 select-none">
                <Paperclip className="w-7 h-7 drop-shadow-xs rotate-[-15deg]" />
              </div>

              {/* Băng dính Washi nhỏ dán lệch mép phải */}
              <div className={`absolute -top-3 right-8 w-28 h-5.5 ${
                isDarkEffective
                  ? 'bg-rose-950/90 border-rose-500/70 text-rose-200'
                  : 'bg-rose-200/90 border-rose-400/80 text-rose-900'
              } border-y border-dashed rotate-[2deg] select-none flex items-center justify-center text-[9px] font-bold font-mono tracking-wider shadow-2xs`}>
                ♥ THANK YOU ♥
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                
                {/* Thông điệp thư giãn */}
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-rose-500">
                    <Heart className="w-4 h-4 fill-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Thông Điệp Yêu Thương</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-black text-rose-600 dark:text-rose-300">
                    "Chúc các bạn có những giây phút thư giãn!"
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">
                    Cảm ơn bạn đã luôn ghé thăm và đồng hành cùng các bộ truyện nhỏ của Editor Jouriee65 ✿
                  </p>
                </div>

                {/* Các nút hành động: Thả tim cổ vũ & Chuyển nhanh về đọc truyện */}
                <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
                  
                  {/* Nút Thả tim cổ vũ */}
                  <button
                    type="button"
                    onClick={handleCheer}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 ${
                      hasCheered
                        ? 'bg-rose-500 text-white border-rose-500 shadow-rose-500/30'
                        : isDarkEffective
                        ? 'bg-[#2d1b28] border-pink-800 text-pink-200 hover:bg-rose-600 hover:text-white'
                        : 'bg-pink-50 border-pink-300 text-rose-700 hover:bg-rose-500 hover:text-white'
                    }`}
                    title={hasCheered ? 'Cảm ơn bạn đã thả tim!' : 'Thả tim cổ vũ Editor'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasCheered ? 'fill-white text-white animate-pulse' : 'text-rose-500 fill-rose-500/30'}`} />
                    <span>{hasCheered ? 'Đã Cổ Vũ' : 'Thả Tim'}</span>
                    <span className="font-mono font-black ml-0.5">({cheerCount})</span>
                  </button>

                  {/* Nút Chuyển nhanh về đọc truyện */}
                  <button
                    type="button"
                    onClick={onBackToNovels}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-500/25 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                    title="Quay về trang danh sách tiểu thuyết để đọc truyện"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Đọc Truyện Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Chân trang bảng ghim */}
        <div className={`mt-8 text-center space-y-3 text-xs ${
          isDarkEffective ? 'text-stone-400' : 'text-stone-500'
        }`}>
          <p className="text-[11px] font-mono opacity-70">
            Website phi thương mại · Editor Jouriee65 · Tôn trọng tác phẩm & quyền riêng tư
          </p>
        </div>
      </main>
    </div>
  );
};
