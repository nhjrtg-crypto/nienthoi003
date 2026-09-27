import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sun,
  Moon,
  ExternalLink,
  Copy,
  Check,
  Heart,
  Play,
  Pause,
  X,
  FileText,
  AlertTriangle,
  Paperclip,
} from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

interface AboutLightOption4ViewProps {
  onBackToNovels: () => void;
  currentOption?: 'style1' | 'style2' | 'option2' | 'option3' | 'option4';
  onChangeOption?: (opt: 'style1' | 'style2') => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const AboutLightOption4View: React.FC<AboutLightOption4ViewProps> = ({
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

  const [activeTab, setActiveTab] = useState<'01' | '02' | '03' | '04'>('01');
  const [isPlayingVinyl, setIsPlayingVinyl] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(48);
  const [hasLiked, setHasLiked] = useState(false);

  // Typewriter effect for "GIỚI THIỆU" with pulsing purple cursor
  const [displayedIntroText, setDisplayedIntroText] = useState('');

  useEffect(() => {
    const fullText = 'GIỚI THIỆU';
    let currentIdx = 0;
    let isDeleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!isDeleting) {
        currentIdx++;
        setDisplayedIntroText(fullText.slice(0, currentIdx));
        if (currentIdx === fullText.length) {
          timer = setTimeout(() => {
            isDeleting = true;
            tick();
          }, 2600);
          return;
        }
        timer = setTimeout(tick, 140);
      } else {
        currentIdx--;
        setDisplayedIntroText(fullText.slice(0, currentIdx));
        if (currentIdx === 0) {
          isDeleting = false;
          timer = setTimeout(tick, 700);
          return;
        }
        timer = setTimeout(tick, 80);
      }
    };

    timer = setTimeout(tick, 250);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(platform);
    setTimeout(() => setCopiedLink(null), 2200);
  };

  const handleToggleLike = () => {
    if (!hasLiked) {
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikeCount((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const tabsConfig = [
    {
      id: '01' as const,
      noteNumber: 'NOTE #01',
      color: 'bg-[#FAF0F2] border-[#E8CCD5] text-[#8A4C5D]',
      colorDark: 'bg-[#281c22] border-[#593441] text-[#f2a8bc]',
      label: 'Lời mở đầu',
    },
    {
      id: '02' as const,
      noteNumber: 'NOTE #02',
      color: 'bg-[#FDF0EB] border-[#ECCDC2] text-[#9A4E3D]',
      colorDark: 'bg-[#291b17] border-[#5e342a] text-[#f5a796]',
      label: 'Cảnh báo 18+',
    },
    {
      id: '03' as const,
      noteNumber: 'NOTE #03',
      color: 'bg-[#F7F2E7] border-[#E2D5BE] text-[#755F3B]',
      colorDark: 'bg-[#262016] border-[#54442b] text-[#edd29b]',
      label: 'Vài lưu ý',
    },
    {
      id: '04' as const,
      noteNumber: 'NOTE #04',
      color: 'bg-[#F4EFF5] border-[#DFD0E1] text-[#6E4B6E]',
      colorDark: 'bg-[#231826] border-[#52335c] text-[#dfb2f2]',
      label: 'Bình luận & Nơi đọc',
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkEffective ? 'dark bg-[#141217] text-[#EDE7F2]' : 'bg-[#FAF8F5] text-[#282523]'} font-sans selection:bg-[#EBD5DD] selection:text-[#3B1925] relative overflow-x-hidden pb-16`}>
      {/* Background linen texture */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 ${isDarkEffective ? 'opacity-15' : 'opacity-40'}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v1H0zm0 3h12v1H0zm0 3h12v1H0zm0 3h12v1H0z' fill='${isDarkEffective ? '%23ECE6F0' : '%239E988E'}' fill-opacity='0.18'/%3E%3Cpath d='M0 0v12h1V0zm3 0v12h1V0zm3 0v12h1V0zm3 0v12h1V0z' fill='${isDarkEffective ? '%23ECE6F0' : '%239E988E'}' fill-opacity='0.18'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* TOP FLOATING NAVIGATION BAR */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-8 py-3 transition-all ${
        isDarkEffective
          ? 'bg-[#191520]/95 border-pink-950/60'
          : 'bg-[#FAF8F5]/90 border-[#E8E2D8]'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Header Left: Nút Dark Mode (Đã bỏ chữ 'Giới thiệu về trang web' và mũi tên theo yêu cầu) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                isDarkEffective
                  ? 'bg-[#221c2b] border-pink-900/60 text-amber-300 hover:bg-[#2c2436] hover:text-amber-200'
                  : 'bg-white border-[#DDD5C7] text-amber-500 hover:bg-stone-50 hover:text-amber-600 shadow-xs'
              }`}
              title={isDarkEffective ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {isDarkEffective ? (
                <Sun className="w-4 h-4 text-amber-300 fill-amber-300/20" />
              ) : (
                <Moon className="w-4 h-4 text-[#8A4C5D] fill-[#8A4C5D]/20" />
              )}
            </button>
          </div>

          {/* Option Selector Pills: STYLE 1 (Sổ Tay Collage) | STYLE 2 (Máy Trứng Tamagotchi) & Close/Return Button */}
          <div className="flex items-center gap-2 shrink-0">
            {onChangeOption ? (
              <div className={`p-1 rounded-full border flex items-center shadow-inner text-xs ${
                isDarkEffective
                  ? 'bg-[#221c2b] border-pink-950/60'
                  : 'bg-[#EFEBE3] border-[#DDD5C7]'
              }`}>
                <button
                  type="button"
                  onClick={() => onChangeOption('style1')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    currentOption === 'style1'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                      : isDarkEffective ? 'text-stone-400 hover:text-pink-200' : 'text-[#6E675D] hover:text-black'
                  }`}
                  title="Style 1: Sổ tay lưu trữ nghệ thuật Collage"
                >
                  Style 1
                </button>

                <button
                  type="button"
                  onClick={() => onChangeOption('style2')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    currentOption === 'style2'
                      ? isDarkEffective ? 'bg-[#92475a] text-white shadow-xs' : 'bg-[#A36577] text-white shadow-xs'
                      : isDarkEffective ? 'text-stone-400 hover:text-pink-200' : 'text-[#6E675D] hover:text-black'
                  }`}
                  title="Style 2: Máy Trứng Tamagotchi Pastel"
                >
                  Style 2
                </button>
              </div>
            ) : (
              <div className={`px-3.5 py-1 rounded-full border text-xs font-bold shadow-xs select-none ${
                isDarkEffective
                  ? 'bg-[#92475a] text-white border-pink-900/60'
                  : 'bg-[#A36577] text-white border-[#8c4f60]'
              }`}>
                Style 1
              </div>
            )}

            {/* Close / Return Button */}
            <button
              type="button"
              onClick={onBackToNovels}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                isDarkEffective
                  ? 'bg-[#221c2b] hover:bg-[#2c2436] border-pink-950/60 text-stone-300 hover:text-white'
                  : 'bg-[#EFEBE3] hover:bg-[#E4DED3] border-[#DDD5C7] text-[#554E45] hover:text-black'
              }`}
              title="Đóng trang giới thiệu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="relative z-10 max-w-2xl mx-auto px-3.5 sm:px-6 pt-5 sm:pt-7">
        
        {/* MASTHEAD HEADER (GIỚI THIỆU VỚI HIỆU ỨNG MÁY ĐÁNH CHỮ & CON TRỎ TÍM NHẤP NHÁY) */}
        <div className={`flex items-end justify-between border-b pb-3 mb-4 ${
          isDarkEffective ? 'border-pink-900/50' : 'border-[#282523]'
        }`}>
          <div>
            <div className={`text-[10px] sm:text-[11px] font-mono tracking-widest uppercase mb-0.5 ${
              isDarkEffective ? 'text-pink-300/80' : 'text-[#7C7468]'
            }`}>
              GHI CHÉP / LƯU TRỮ CÁ NHÂN
            </div>
            <h1 className={`text-2xl sm:text-3xl font-serif font-black tracking-wide flex items-center min-h-[2rem] sm:min-h-[2.25rem] ${
              isDarkEffective ? 'text-[#F3EDF7]' : 'text-[#282523]'
            }`}>
              <span>{displayedIntroText}</span>
              <span className="inline-block w-[3px] sm:w-[3.5px] h-6 sm:h-7 bg-purple-600 animate-pulse ml-1 rounded-xs shrink-0" />
            </h1>
            <div className={`text-[10px] sm:text-[11px] font-mono mt-0.5 ${
              isDarkEffective ? 'text-pink-400/60' : 'text-[#8C8477]'
            }`}>
              JOURIEE65 · NIÊN THỜI
            </div>
          </div>

          {/* Circular Postmark Ring (giống Kiểu 6) thay cho DIARY 074 */}
          <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-dashed p-1 flex items-center justify-center -rotate-12 select-none opacity-85 shrink-0 ${
            isDarkEffective ? 'border-pink-400/50' : 'border-[#A36577]/70'
          }`}>
            <div className={`w-full h-full rounded-full border flex flex-col items-center justify-center text-center ${
              isDarkEffective ? 'border-pink-400/30' : 'border-[#A36577]/50'
            }`}>
              <span className={`text-[6px] sm:text-[7px] font-mono font-black tracking-widest uppercase ${
                isDarkEffective ? 'text-pink-300' : 'text-[#854556]'
              }`}>
                POST OFFICE
              </span>
              <span className={`text-[10px] sm:text-xs font-serif font-black leading-none my-0.5 ${
                isDarkEffective ? 'text-pink-200' : 'text-[#854556]'
              }`}>
                DIARY
              </span>
              <span className={`text-[10px] sm:text-[11px] font-serif font-bold leading-none ${
                isDarkEffective ? 'text-pink-200' : 'text-[#854556]'
              }`}>
                074.
              </span>
              <span className={`text-[6px] font-mono mt-0.5 ${
                isDarkEffective ? 'text-pink-300/80' : 'text-[#854556]/80'
              }`}>
                NIÊN THỜI
              </span>
            </div>
          </div>
        </div>

        {/* STICKY INDEX FLAGS / THẺ ĐÁNH DẤU TRANG GHI CHÚ (Kiểu 5) */}
        <div className="mb-6">
          <div className={`text-[10px] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
            isDarkEffective ? 'text-stone-400' : 'text-[#8A8174]'
          }`}>
            <FileText className={`w-3.5 h-3.5 ${isDarkEffective ? 'text-pink-400' : 'text-[#8F5567]'}`} />
            <span>MỤC LỤC TỜ GHI CHÚ · STICKY NOTE TABS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {tabsConfig.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    const el = document.getElementById(`section-${tab.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`p-2.5 rounded text-left border transition-all cursor-pointer relative overflow-hidden shadow-xs hover:-translate-y-0.5 ${
                    isDarkEffective ? tab.colorDark : tab.color
                  } ${isActive ? 'ring-2 ring-pink-500 shadow-md font-bold' : 'opacity-85 hover:opacity-100'}`}
                >
                  {/* Faux Tape Sticker at top */}
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2.5 shadow-2xs rotate-[-1deg] ${
                    isDarkEffective ? 'bg-white/20 border border-white/10' : 'bg-white/60 border border-white/40'
                  }`} />
                  <div className="text-[9px] font-mono tracking-wider uppercase mb-0.5">
                    {tab.noteNumber}
                  </div>
                  <div className="text-xs sm:text-sm font-serif font-bold truncate">
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* TRACE DATE STAMP & FLOATING LIKE PILL */}
        <div className={`flex items-center justify-between text-[10px] sm:text-[11px] font-mono mb-4 px-1 ${
          isDarkEffective ? 'text-stone-400' : 'text-[#6B6358]'
        }`}>
          <div className={`px-2.5 py-1 rounded-sm text-[10px] tracking-wider ${
            isDarkEffective ? 'bg-[#251c2e] text-pink-200 border border-pink-900/50' : 'bg-[#2E2927] text-white'
          }`}>
            DATE · 2026/09/18 · JOURIEE65
          </div>

          <button
            type="button"
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer ${
              hasLiked
                ? isDarkEffective
                  ? 'bg-pink-950/80 border-pink-700 text-pink-200 shadow-xs'
                  : 'bg-pink-50 border-pink-300 text-pink-700 shadow-xs'
                : isDarkEffective
                  ? 'bg-[#1e1724] border-pink-950/60 text-stone-300 hover:border-pink-500 hover:text-pink-300'
                  : 'bg-white border-[#DDD5C7] text-[#5C5449] hover:border-pink-300 hover:text-pink-600'
            }`}
            title="Thả tim yêu thích sổ tay lưu trữ"
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-pink-500 text-pink-500' : isDarkEffective ? 'text-stone-400' : 'text-[#8A8174]'}`} />
            <span className="font-sans font-bold text-xs">{likeCount}</span>
          </button>
        </div>

        {/* DOUBLE BORDER JOURNAL BOARD CANVAS (Khung kép phong cách Visual Journal / Private Archive) */}
        <div className={`relative border-2 p-2 sm:p-2.5 rounded-sm transition-colors ${
          isDarkEffective
            ? 'border-pink-950/80 bg-[#191421] shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
            : 'border-[#282523] bg-[#FAF8F5] shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
        }`}>
          {/* Inner hairline border with clean background */}
          <div className={`border p-3 sm:p-5 relative transition-colors ${
            isDarkEffective ? 'border-pink-900/40 bg-[#16111d]' : 'border-[#282523] bg-[#FAF8F5]'
          }`}>
            
            {/* Chấm tròn (dot) canh chuẩn xác trên đường viền tại 4 góc, sát mép viền không bị lệch */}
            <span className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 ${
              isDarkEffective ? 'bg-[#92475a] ring-2 ring-[#16111d]' : 'bg-[#282523] ring-2 ring-[#FAF8F5]'
            }`} />
            <span className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 ${
              isDarkEffective ? 'bg-[#92475a] ring-2 ring-[#16111d]' : 'bg-[#282523] ring-2 ring-[#FAF8F5]'
            }`} />
            <span className={`absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full z-10 ${
              isDarkEffective ? 'bg-[#92475a] ring-2 ring-[#16111d]' : 'bg-[#282523] ring-2 ring-[#FAF8F5]'
            }`} />
            <span className={`absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full z-10 ${
              isDarkEffective ? 'bg-[#92475a] ring-2 ring-[#16111d]' : 'bg-[#282523] ring-2 ring-[#FAF8F5]'
            }`} />

            {/* BOARD MASTHEAD */}
            <div className={`flex items-center justify-between border-b pb-2.5 mb-5 ${
              isDarkEffective ? 'border-pink-900/40 text-[#F3EDF7]' : 'border-[#282523] text-[#282523]'
            }`}>
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-base font-serif font-black tracking-wider">
                  PLATFORM NO. 1
                </span>
              </div>
              <div className={`px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded-xs ${
                isDarkEffective ? 'bg-[#2c1d33] text-pink-200 border border-pink-900/50' : 'bg-[#282523] text-white'
              }`}>
                DIARY
              </div>
            </div>

            {/* ========================================================
                CARD 1: CHÀO MỪNG & ĐĨA THAN TÂM TÌNH (NOW PLAYING · 01 心情唱片)
                ======================================================== */}
            <div id="section-01" className="mb-6 scroll-mt-20">
              <div className={`relative rounded-sm border p-4 sm:p-5 shadow-xs overflow-hidden transition-colors ${
                isDarkEffective ? 'border-pink-950/70 bg-[#1d1624]' : 'border-[#E0D7CB] bg-[#F7F2EB]'
              }`}>
                {/* Dotted texture stamp in corner */}
                <div
                  className="absolute top-2 right-2 w-16 h-16 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(${isDarkEffective ? '#f472b6' : '#A36577'} 1.5px, transparent 1.5px)`,
                    backgroundSize: '6px 6px',
                  }}
                />
                <div className="absolute top-3 right-3 text-pink-400/40 text-lg font-mono pointer-events-none">+</div>

                {/* Ruled lines pattern giống 心情唱片 · Lời Chào Đầu ở Kiểu 5 */}
                <div
                  className="absolute inset-x-4 inset-y-12 sm:inset-x-5 sm:inset-y-14 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 27px, ${isDarkEffective ? '#f472b6' : '#A36577'} 28px)`,
                  }}
                />

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 relative z-10">
                  {/* CỔ ĐIỂN: ĐĨA THAN XOAY (VINYL RECORD) */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div
                      onClick={() => setIsPlayingVinyl(!isPlayingVinyl)}
                      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full cursor-pointer select-none group"
                      title={isPlayingVinyl ? 'Nhấn để tạm dừng đĩa than' : 'Nhấn để quay đĩa than'}
                    >
                      {/* Đĩa than đen nhiều rãnh đồng tâm */}
                      <div
                        className={`w-full h-full rounded-full bg-[#1A1817] shadow-lg border-2 border-[#2E2B29] p-1.5 flex items-center justify-center transition-all ${
                          isPlayingVinyl ? 'animate-spin' : ''
                        }`}
                        style={{ animationDuration: '6s' }}
                      >
                        {/* Các rãnh đĩa rọi ánh sáng nhẹ */}
                        <div className="w-full h-full rounded-full border border-white/10 p-1 flex items-center justify-center">
                          <div className="w-full h-full rounded-full border border-white/15 p-1.5 flex items-center justify-center">
                            <div className="w-full h-full rounded-full border border-white/10 p-1.5 flex items-center justify-center">
                              {/* Nhãn tâm đĩa màu hồng đất (Mauve Label) */}
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#A36577] border border-pink-200/50 flex flex-col items-center justify-center text-white text-center shadow-inner">
                                <span className="text-[6px] font-mono tracking-tighter uppercase font-bold text-pink-100">
                                  MOOD
                                </span>
                                <span className="text-[7px] font-serif font-black leading-none text-white">
                                  TRACK
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Play/Pause overlay indicator */}
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isPlayingVinyl ? (
                          <Pause className="w-5 h-5 text-white drop-shadow" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5 drop-shadow" />
                        )}
                      </div>
                    </div>

                    {/* Sóng âm thanh nhỏ phía dưới */}
                    <div className="flex items-center gap-1 mt-2 text-[#A36577]">
                      <span className={`w-0.5 h-3 bg-[#A36577] rounded-full ${isPlayingVinyl ? 'animate-pulse' : ''}`} />
                      <span className={`w-0.5 h-4 bg-[#A36577] rounded-full ${isPlayingVinyl ? 'animate-pulse delay-75' : ''}`} />
                      <span className={`w-0.5 h-2 bg-[#A36577] rounded-full ${isPlayingVinyl ? 'animate-pulse delay-150' : ''}`} />
                      <span className={`w-0.5 h-5 bg-[#A36577] rounded-full ${isPlayingVinyl ? 'animate-pulse delay-100' : ''}`} />
                      <span className={`w-0.5 h-3 bg-[#A36577] rounded-full ${isPlayingVinyl ? 'animate-pulse delay-200' : ''}`} />
                    </div>
                  </div>

                  {/* THÔNG TIN LỜI CHÀO & MỤC ĐÍCH */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider mb-1.5 ${
                      isDarkEffective ? 'bg-[#281b30] border border-pink-900/50 text-pink-300' : 'bg-[#F4EFEA] border-[#E2DAD0] text-[#8A8174]'
                    }`}>
                      NOW PLAYING · 01 / GHI CHÉP BAN ĐẦU
                    </div>
                    
                    <h2 className={`text-xl sm:text-2xl font-serif font-bold mb-2 flex items-center justify-center sm:justify-start ${
                      isDarkEffective ? 'text-pink-100' : 'text-[#282523]'
                    }`}>
                      <span>Lời Mở Đầu</span>
                    </h2>

                    <div className={`space-y-1.5 text-sm sm:text-base leading-relaxed ${
                      isDarkEffective ? 'text-stone-200' : 'text-[#423C36]'
                    }`}>
                      <p className={`font-medium ${isDarkEffective ? 'text-white' : 'text-[#282523]'}`}>
                        Chào mừng bạn đến với trang web
                      </p>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDarkEffective ? 'text-stone-300' : 'text-[#5C544B]'}`}>
                        Website được xây nhằm đăng tải những bộ truyện mình đã edit hoàn, chỉ phục vụ duy nhất cho mục đích giải trí.
                      </p>
                    </div>

                    {/* Audio track seek bar */}
                    <div className={`mt-3.5 pt-2 border-t flex items-center gap-3 text-[10px] font-mono ${
                      isDarkEffective ? 'border-pink-900/30 text-stone-400' : 'border-[#E8DFC0]/70 text-[#8C8477]'
                    }`}>
                      <span>01:28</span>
                      <div className={`flex-1 h-1.5 rounded-full overflow-hidden relative ${
                        isDarkEffective ? 'bg-pink-950/60' : 'bg-[#E2D8C7]'
                      }`}>
                        <div className="h-full bg-[#A36577] rounded-full w-2/5" />
                      </div>
                      <span>04:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                CARD 2: CẢNH BÁO NỘI DUNG (WEATHER SIGNAL · 02 · Góc vát than chì)
                ======================================================== */}
            <div id="section-02" className="mb-6 scroll-mt-20">
              <div
                className="relative bg-[#2C2729] text-white p-4 sm:p-5 rounded-xs shadow-md border border-[#3E383A]"
                style={{
                  clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                }}
              >
                {/* Header signal strip */}
                <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-pink-300" />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-stone-300">
                      WARNING · CẢNH BÁO
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-serif font-black italic tracking-tight text-white/90">
                    18+
                  </div>
                </div>

                {/* Tiêu đề cảnh báo */}
                <h3 className="text-base sm:text-lg font-serif font-black tracking-wide text-pink-200 uppercase mb-2">
                  CẢNH BÁO NỘI DUNG
                </h3>

                {/* Nội dung cảnh báo */}
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-serif">
                  Trang web chứa các tác phẩm thuộc thể loại đam mỹ có yếu tổ 18+, ngôn từ thô tục. Tất cả tình tiết chỉ để giải trí, hoàn toàn là hư cấu và không phản ánh tiêu chuẩn đạo đức xã hội thực tế.
                </p>

                {/* Footer metadata */}
                <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono tracking-wider text-stone-400 uppercase">
                  <span>NOTICE</span>
                  <span className="text-pink-300">DISCRETION ADVISED</span>
                </div>
              </div>
            </div>

            {/* ========================================================
                CARD 3: HẠ TẦNG & MÁY CHỦ (NOTE / GHI CHÚ 03 · Phong cách trích dẫn)
                ======================================================== */}
            <div id="section-03" className="mb-4 scroll-mt-20">
              <div className={`relative border-t-2 pt-4 pb-2 ${
                isDarkEffective ? 'border-pink-900/50' : 'border-[#282523]'
              }`}>
                
                {/* Header tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono tracking-widest uppercase font-bold ${
                    isDarkEffective ? 'text-pink-300/80' : 'text-[#8A8174]'
                  }`}>
                    NOTE #03 · VÀI LƯU Ý
                  </span>
                  <div className="text-2xl font-serif text-[#C47B91] leading-none select-none">
                    “
                  </div>
                </div>

                {/* Thân trích dẫn có thanh dọc màu hồng đất bên trái */}
                <div className="border-l-4 border-[#A36577] pl-3.5 sm:pl-4 py-1 space-y-2.5">
                  <p className={`text-sm sm:text-base font-medium leading-relaxed ${
                    isDarkEffective ? 'text-stone-100' : 'text-[#282523]'
                  }`}>
                    Trang web được vận hành và duy trì hoàn toàn bằng hạ tầng máy chủ miễn phí nhằm mục đích phi thương mại.
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isDarkEffective ? 'text-stone-300' : 'text-[#574F46]'
                  }`}>
                    Do đó, hệ thống sẽ có một số giới hạn kỹ thuật nhất định: Đôi khi có thể bị chậm hoặc tạm dừng. Nếu không vào được web, các bạn có thể ghé qua nền tảng khác như WordPress để tiếp tục đọc truyện không bị gián đoạn.
                  </p>
                </div>

                {/* Đường nét đứt & Ghi chú chân trang */}
                <div className={`mt-4 border-b border-dashed pb-2 flex justify-end ${
                  isDarkEffective ? 'border-pink-950/60' : 'border-[#CFC5B4]'
                }`}>
                  <span className={`text-[10px] font-mono italic ${
                    isDarkEffective ? 'text-stone-400' : 'text-[#91877A]'
                  }`}>
                    Lời nhắn gửi
                  </span>
                </div>
              </div>
            </div>

            {/* CON TEM BƯU CHÍNH HÌNH CHỮ NHẬT PHONG CÁCH KIỂU 6 VỚI VIỀN RĂNG CƯA, DẤU TIM VÀ TEM CƯỚC 18¢ (KHÔNG CÓ ĐƯỜNG NÉT ĐỨT KẾT NỐI) */}
            <div className="relative my-3.5 z-20 flex items-center justify-center">
              <div className={`border-2 border-dashed rounded-xs px-4 py-2 shadow-sm flex items-center gap-3 rotate-[-1.5deg] select-none hover:rotate-0 transition-transform ${
                isDarkEffective ? 'bg-[#201826] border-[#C47B91]' : 'bg-[#FFFDF9] border-[#A36577]'
              }`}>
                <div className="w-6 h-6 rounded-full bg-[#A36577]/15 border border-[#A36577]/30 flex items-center justify-center text-[#A36577]">
                  <Heart className="w-3.5 h-3.5 fill-[#A36577]/30 text-[#A36577]" />
                </div>
                <div className="text-left">
                  <div className={`flex items-center gap-1.5 text-[8px] font-mono font-bold uppercase tracking-wider ${
                    isDarkEffective ? 'text-pink-300' : 'text-[#8A4A41]'
                  }`}>
                    <span>POSTAGE</span>
                    <span>•</span>
                    <span>18¢</span>
                  </div>
                  <div className={`text-[9px] font-serif font-black tracking-widest uppercase leading-none mt-0.5 ${
                    isDarkEffective ? 'text-pink-100' : 'text-[#282523]'
                  }`}>
                    JOURIEE · NIÊN THỜI
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                CARD 4: QUY TẮC BÌNH LUẬN (PRIVATE LOG · 04 · Tấm giấy kẹp ghim kim loại)
                ======================================================== */}
            <div id="section-04" className="mb-6 scroll-mt-20">
              <div className="relative pt-3">
                {/* Kẹp ghim kim loại theo phong cách INFRASTRUCTURE với màu sắc phù hợp Style 2 */}
                <div className="absolute -top-1.5 right-6 z-20 text-[#A36577] dark:text-[#C47B91] select-none pointer-events-none drop-shadow-xs rotate-[12deg]">
                  <Paperclip className="w-6 h-6 drop-shadow-xs" />
                </div>

                {/* Tờ giấy nhật ký màu kem với họa tiết Letterpress lines */}
                <div className={`relative border p-4 sm:p-5 rounded-sm shadow-[0_4px_16px_rgba(0,0,0,0.04)] rotate-[-0.4deg] transition-transform hover:rotate-0 overflow-hidden ${
                  isDarkEffective ? 'bg-[#1c1523] border-pink-950/70 text-stone-200' : 'bg-[#F6F1E7] border-[#DDD3C1] text-[#473F38]'
                }`}>
                  {/* Họa tiết letterpress lines trong nền */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-15"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(40, 37, 35, 0.25) 3px, rgba(40, 37, 35, 0.25) 4px)',
                    }}
                  />

                  <div className="relative z-10">
                    <div className={`text-[10px] font-mono tracking-widest uppercase mb-1 ${
                      isDarkEffective ? 'text-pink-300/80' : 'text-[#877E71]'
                    }`}>
                      PRIVATE LOG · 04 / QUY TẮC CỘNG ĐỒNG
                    </div>

                    <h3 className={`text-lg sm:text-xl font-serif font-bold mb-2 flex items-center gap-2 ${
                      isDarkEffective ? 'text-pink-100' : 'text-[#282523]'
                    }`}>
                      <span>COMMENT</span>
                      <span className={`text-sm font-normal font-sans ${isDarkEffective ? 'text-stone-400' : 'text-[#6B6358]'}`}>· Sổ Tay Bình Luận</span>
                    </h3>

                    <div className={`space-y-2 text-xs sm:text-sm leading-relaxed ${
                      isDarkEffective ? 'text-stone-300' : 'text-[#473F38]'
                    }`}>
                      <p>
                        Web mở cổng bình luận tự do không cần đăng nhập. Tuy nhiên, để giữ gìn một không gian văn minh, xin vui lòng tuân thủ:
                      </p>
                      <div className={`p-3 border rounded-xs font-serif ${
                        isDarkEffective ? 'bg-[#251b2d] border-pink-900/40 text-stone-200' : 'bg-white/75 border-[#DDD5C5] text-[#2B2520]'
                      }`}>
                        <strong className="text-[#A36577] block mb-1">Tôn trọng nhân vật/tác giả:</strong>
                        <span>Không bình luận mắng chửi, xúc phạm nhân vật trong truyện, tác giả hay editor.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                CARD 5: NỀN TẢNG KHÁC (READING · WEBSITE · Tem vé cắt khuyết)
                ======================================================== */}
            <div className="mb-6">
              <div className={`relative border-2 border-dashed p-4 sm:p-5 rounded-sm ${
                isDarkEffective ? 'bg-[#1a1421] border-pink-950/70' : 'bg-[#FAF5ED] border-[#D6CBB8]'
              }`}>
                
                {/* Khung thông tin nền tảng khác */}

                <div className={`text-[10px] font-mono tracking-widest uppercase mb-1 ${
                  isDarkEffective ? 'text-pink-300/80' : 'text-[#8A8174]'
                }`}>
                  READING · WEBSITE
                </div>

                <h3 className={`text-base sm:text-lg font-serif font-bold mb-3 flex items-center gap-2 ${
                  isDarkEffective ? 'text-pink-100' : 'text-[#282523]'
                }`}>
                  <span>Another</span>
                  <span className={`text-xs sm:text-sm font-normal font-sans ${isDarkEffective ? 'text-stone-400' : 'text-[#696156]'}`}>· Đọc truyện tại các nơi khác</span>
                </h3>

                <div className="space-y-3">
                  {/* Platform 1: Wattpad */}
                  <div className={`p-3 sm:p-3.5 border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    isDarkEffective ? 'bg-[#22182b] border-pink-900/50' : 'bg-white border-[#DDD5C7]'
                  }`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs sm:text-sm ${isDarkEffective ? 'text-pink-100' : 'text-[#282523]'}`}>Wattpad</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Chỉ đăng truyện mới
                        </span>
                      </div>
                      <p className={`text-xs font-mono truncate mt-0.5 ${isDarkEffective ? 'text-stone-400' : 'text-[#756E63]'}`}>
                        https://www.wattpad.com/user/Qingxiya52
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy('https://www.wattpad.com/user/Qingxiya52', 'wattpad')}
                        className={`px-2.5 py-1.5 text-xs font-mono rounded flex items-center gap-1 transition-colors cursor-pointer ${
                          isDarkEffective
                            ? 'bg-[#2c1e36] hover:bg-[#382645] text-pink-200'
                            : 'bg-[#F2EDE4] hover:bg-[#E7E0D3] text-[#474037]'
                        }`}
                        title="Sao chép liên kết Wattpad"
                      >
                        {copiedLink === 'wattpad' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>

                      <a
                        href="https://www.wattpad.com/user/Qingxiya52"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-2.5 py-1.5 text-xs font-mono font-bold rounded flex items-center gap-1 transition-colors ${
                          isDarkEffective ? 'bg-pink-900 hover:bg-pink-800 text-white' : 'bg-[#282523] hover:bg-black text-white'
                        }`}
                      >
                        <span>Mở web</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Platform 2: WordPress */}
                  <div className={`p-3 sm:p-3.5 border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    isDarkEffective ? 'bg-[#22182b] border-pink-900/50' : 'bg-white border-[#DDD5C7]'
                  }`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs sm:text-sm ${isDarkEffective ? 'text-pink-100' : 'text-[#282523]'}`}>WordPress</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                          Web chính thức
                        </span>
                      </div>
                      <p className={`text-xs font-mono truncate mt-0.5 ${isDarkEffective ? 'text-stone-400' : 'text-[#756E63]'}`}>
                        https://nienthoi003.wordpress.com/
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy('https://nienthoi003.wordpress.com/', 'wordpress')}
                        className={`px-2.5 py-1.5 text-xs font-mono rounded flex items-center gap-1 transition-colors cursor-pointer ${
                          isDarkEffective
                            ? 'bg-[#2c1e36] hover:bg-[#382645] text-pink-200'
                            : 'bg-[#F2EDE4] hover:bg-[#E7E0D3] text-[#474037]'
                        }`}
                        title="Sao chép liên kết WordPress"
                      >
                        {copiedLink === 'wordpress' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>

                      <a
                        href="https://nienthoi003.wordpress.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-2.5 py-1.5 text-xs font-mono font-bold rounded flex items-center gap-1 transition-colors ${
                          isDarkEffective ? 'bg-pink-900 hover:bg-pink-800 text-white' : 'bg-[#282523] hover:bg-black text-white'
                        }`}
                      >
                        <span>Mở web</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                CARD 6: LỜI KẾT & CASSETTE TRACK (CLOSING MEMO · Chúc các bạn thư giãn)
                ======================================================== */}
            <div className="mb-4">
              <div className="bg-[#242122] text-white p-4 sm:p-5 rounded-xs border border-[#3A3537] shadow-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400">
                    CLOSING MEMO
                  </span>
                  {/* Short Barcode thay cho 06 */}
                  <div className="flex items-center gap-[2px] h-5 px-1.5 py-0.5 bg-white/10 rounded-xs" title="Barcode">
                    <span className="w-0.5 h-full bg-white/80" />
                    <span className="w-1 h-full bg-white/80" />
                    <span className="w-0.5 h-full bg-white/40" />
                    <span className="w-1.5 h-full bg-white/90" />
                    <span className="w-0.5 h-full bg-white/60" />
                    <span className="w-1 h-full bg-white/80" />
                    <span className="w-0.5 h-full bg-white/40" />
                    <span className="w-1.5 h-full bg-white/90" />
                    <span className="w-0.5 h-full bg-white/80" />
                    <span className="w-1 h-full bg-white/70" />
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-10 h-10 rounded-full bg-pink-900/40 border border-pink-500/40 flex items-center justify-center shrink-0 text-pink-300 shadow-xs"
                  >
                    <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
                  </motion.div>

                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-serif font-bold text-pink-100 flex items-center gap-2 flex-wrap">
                      <span>Chúc các bạn có khoảng thời gian thư giãn!</span>
                    </h4>
                  </div>
                </div>

                {/* Cassette mini controls & Heart interaction */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
                  <div className="flex items-center gap-2 text-stone-300">
                    <button
                      type="button"
                      onClick={() => setIsPlayingVinyl(!isPlayingVinyl)}
                      className="p-1.5 rounded hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                      title="Phát / Dừng"
                    >
                      {isPlayingVinyl ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex items-center gap-0.5 text-pink-400">
                      <span className="w-1 h-3 bg-pink-400 rounded-xs" />
                      <span className="w-1 h-4 bg-pink-400 rounded-xs" />
                      <span className="w-1 h-2 bg-pink-400 rounded-xs" />
                      <span className="w-1 h-5 bg-pink-400 rounded-xs" />
                    </div>
                    <span className="text-[10px] text-stone-400">JOURIEE65 / NIÊN THỜI</span>
                  </div>

                  <button
                    type="button"
                    onClick={onBackToNovels}
                    className="hv-11__btn--stack px-4 sm:px-5 py-2 rounded-full bg-[#8A4A41] hover:bg-[#783E36] border border-[#6E352D] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    style={{ ['--btn-stack-shadow' as any]: '#4D221B' }}
                    title="Vào đọc truyện ngay"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Vào đọc truyện ngay</span>
                  </button>
                </div>
              </div>
            </div>

            {/* BOARD FOOTER */}
            <div className={`pt-4 mt-6 border-t border-dashed flex items-center justify-center text-[11px] font-mono tracking-wider ${
              isDarkEffective ? 'border-pink-950/60 text-stone-400' : 'border-[#DDD3C1] text-[#787165]'
            }`}>
              <span>DRIFT UPON A LOVESTRUCK CADENCE</span>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};
