import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Check, ArrowLeft, X, Lock } from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';
import { Novel } from '../types';

export const GLOBAL_CHAPTER_PASS_KEY = 'cosmo_chapter_pass_unlocked_18';
export const DEFAULT_CORRECT_CHAPTER_PASS = 'NIENTHOIDOCTRUYEN';

export interface NovelPasswordConfig {
  instructions: string;
  hintLines: string[];
  cleanPassword: string;
  isSpecial: boolean;
}

/**
 * Lấy cấu hình mật khẩu theo truyện cụ thể:
 * 1. Series NTR: Cám Dỗ Vụng Trộm
 *    - 3 dòng:
 *        Tôi-thích-đọc-truyện-công-ngoại-tình
 *        Tôi-phân-biệt-được-giữa-truyện-và-đời-thực
 *        Tôi-sẽ-không-bình-luận-chê-bai
 *    - Gợi ý: Copy 3 dòng chữ, bỏ dấu gạch ngang giữa các chữ để xác nhận đọc truyện.
 *    - Mật khẩu đúng:
 *        Tôi thích đọc truyện công ngoại tình
 *        Tôi phân biệt được giữa truyện và đời thực
 *        Tôi sẽ không bình luận chê bai
 *
 * 2. (Q1) CHIẾM HỮU CỰC ĐỘ & THÁI HẬU XINH ĐẸP ĐANG MANG THAI
 *    - 3 dòng:
 *        Tôi-thích-thể-loại-này
 *        Tôi-phân-biệt-được-giữa-truyện-và-đời-thực
 *        Tôi-sẽ-không-bình-luận-chê-bai
 *    - Gợi ý: Copy 3 dòng chữ, bỏ dấu gạch ngang giữa các chữ để xác nhận đọc truyện.
 *    - Mật khẩu đúng:
 *        Tôi thích thể loại này
 *        Tôi phân biệt được giữa truyện và đời thực
 *        Tôi sẽ không bình luận chê bai
 *
 * 3. Các truyện khác: Mặc định NIENTHOIDOCTRUYEN
 */
export const getNovelPasswordConfig = (novel?: Novel | null): NovelPasswordConfig => {
  if (!novel) {
    return {
      instructions: 'Truyện dành cho người trên 18 tuổi. Bằng việc tiếp tục nhập pass, bạn xác nhận đã đủ 18 tuổi trở lên và chấp nhận xem nội dung này.',
      hintLines: [],
      cleanPassword: DEFAULT_CORRECT_CHAPTER_PASS,
      isSpecial: false,
    };
  }

  const rawTitle = (novel.title || '').trim().toLowerCase();
  const rawId = (novel.id || '').trim();

  // 1. Dành riêng cho truyện Series NTR: Cám Dỗ Vụng Trộm
  const isSeriesNTR =
    rawId === 'JyjZxRaIxFvvZ2Ijyxef' ||
    rawTitle.includes('series ntr') ||
    rawTitle.includes('cám dỗ vụng trộm') ||
    rawTitle.includes('cam do vung trom');

  if (isSeriesNTR) {
    return {
      instructions: '',
      hintLines: [
        'Tôi-thích-đọc-truyện-công-ngoại-tình',
        'Tôi-phân-biệt-được-giữa-truyện-và-đời-thực',
        'Tôi-sẽ-không-bình-luận-chê-bai',
      ],
      cleanPassword:
        'Tôi thích đọc truyện công ngoại tình\nTôi phân biệt được giữa truyện và đời thực\nTôi sẽ không bình luận chê bai',
      isSpecial: true,
    };
  }

  // 2. Dành riêng cho truyện: (Q1) CHIẾM HỮU CỰC ĐỘ & THÁI HẬU XINH ĐẸP ĐANG MANG THAI
  const isChiemHuuQ1OrThaiHau =
    rawId === 'EKfvFMUwotIWRM4SAu3d' || // Q1 Chiếm Hữu Cực Độ
    rawId === 'evpaORA3LE9lhj1qmvt1' || // Thái Hậu Xinh Đẹp Đang Mang Thai
    rawTitle.includes('thái hậu xinh đẹp') ||
    rawTitle.includes('thai hau xinh dep') ||
    rawTitle.includes('chiếm hữu cực độ') ||
    rawTitle.includes('chiem huu cuc do');

  if (isChiemHuuQ1OrThaiHau) {
    return {
      instructions: '',
      hintLines: [
        'Tôi-thích-thể-loại-này',
        'Tôi-phân-biệt-được-giữa-truyện-và-đời-thực',
        'Tôi-sẽ-không-bình-luận-chê-bai',
      ],
      cleanPassword:
        'Tôi thích thể loại này\nTôi phân biệt được giữa truyện và đời thực\nTôi sẽ không bình luận chê bai',
      isSpecial: true,
    };
  }

  // Mặc định
  return {
    instructions: 'Truyện dành cho người trên 18 tuổi. Bằng việc tiếp tục nhập pass, bạn xác nhận đã đủ 18 tuổi trở lên và chấp nhận xem nội dung này.',
    hintLines: [],
    cleanPassword: DEFAULT_CORRECT_CHAPTER_PASS,
    isSpecial: false,
  };
};

/**
 * Trả về Storage Key mở khóa: Mỗi bộ truyện đặc biệt lưu key riêng, các truyện khác dùng chung key
 */
export const getChapterPassStorageKey = (novel?: Novel | null): string => {
  if (!novel) return GLOBAL_CHAPTER_PASS_KEY;
  const cfg = getNovelPasswordConfig(novel);
  if (cfg.isSpecial) {
    return `cosmo_chapter_pass_unlocked_novel_${novel.id}`;
  }
  return GLOBAL_CHAPTER_PASS_KEY;
};

export const isChapterPasswordUnlocked = (novel?: Novel | null): boolean => {
  try {
    const key = getChapterPassStorageKey(novel);
    return safeStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
};

export const setChapterPasswordUnlocked = (novel?: Novel | null): void => {
  try {
    const key = getChapterPassStorageKey(novel);
    safeStorage.setItem(key, 'true');
    localStorage.setItem(key, 'true');
  } catch {
    // Ignore safe storage errors
  }
};

/**
 * Chuẩn hóa chuỗi mật khẩu để so sánh thông minh:
 * - Hỗ trợ nhập chính xác nhiều dòng (cho xuống dòng thoải mái)
 * - Tự động thay thế dấu gạch ngang giữa các từ nếu người dùng copy nguyên bản
 * - Bỏ khoảng trắng dư thừa ở đầu/cuối mỗi dòng và chuẩn hóa dấu cách
 * - Hỗ trợ cả định dạng 3 dòng có xuống dòng lẫn định dạng gộp 1 dòng
 * - Chuẩn hóa unicode tiếng Việt (NFC)
 */
const normalizeMultilinePassword = (str: string): { multiline: string; compact: string } => {
  if (!str) return { multiline: '', compact: '' };
  const nfc = str.normalize('NFC').replace(/-/g, ' ');
  const lines = nfc
    .split(/\r?\n/)
    .map((l) => l.trim().replace(/\s+/g, ' '))
    .filter((l) => l.length > 0);

  const multiline = lines.join('\n').toLowerCase();
  const compact = nfc.replace(/\s+/g, '').toLowerCase();

  return { multiline, compact };
};

const normalizeSinglePass = (str: string): string => {
  if (!str) return '';
  return str.normalize('NFC').trim().toUpperCase();
};

interface ChapterPasswordModalProps {
  isOpen: boolean;
  novel?: Novel | null;
  onSuccess: () => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

export const ChapterPasswordModal: React.FC<ChapterPasswordModalProps> = ({
  isOpen,
  novel,
  onSuccess,
  onCancel,
  isDarkMode = false,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const config = getNovelPasswordConfig(novel);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setPasswordInput('');
      setErrorMsg('');
      setIsSuccessAnim(false);
      const timer = setTimeout(() => {
        if (config.isSpecial) {
          textareaRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, novel?.id, config.isSpecial]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!passwordInput.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      if (config.isSpecial) textareaRef.current?.focus();
      else inputRef.current?.focus();
      return;
    }

    if (config.isSpecial) {
      const userNorm = normalizeMultilinePassword(passwordInput);
      const targetNorm = normalizeMultilinePassword(config.cleanPassword);

      const isMatch =
        (userNorm.multiline && userNorm.multiline === targetNorm.multiline) ||
        (userNorm.compact && userNorm.compact === targetNorm.compact);

      if (isMatch) {
        setErrorMsg('');
        setIsSuccessAnim(true);
        setChapterPasswordUnlocked(novel);
        setTimeout(() => {
          onSuccess();
        }, 350);
      } else {
        setErrorMsg('Mật khẩu chưa chính xác. Vui lòng kiểm tra lại 3 dòng chữ!');
        textareaRef.current?.focus();
      }
    } else {
      const cleanUser = normalizeSinglePass(passwordInput);
      const cleanTarget = normalizeSinglePass(config.cleanPassword);

      if (cleanUser === cleanTarget) {
        setErrorMsg('');
        setIsSuccessAnim(true);
        setChapterPasswordUnlocked(novel);
        setTimeout(() => {
          onSuccess();
        }, 350);
      } else {
        setErrorMsg('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
        inputRef.current?.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          onClick={onCancel}
        />

        {/* Modal Card - Thiết kế đơn giản, thanh lịch, tinh gọn với màu đỏ trầm trung tính */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`relative w-full max-w-lg rounded-2xl sm:rounded-3xl border shadow-2xl p-6 sm:p-8 z-10 transition-colors my-auto ${
            isDarkMode
              ? 'bg-[#181920] border-zinc-700/80 text-zinc-100 shadow-black/80'
              : 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút đóng góc phải */}
          <button
            type="button"
            onClick={onCancel}
            className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer transition-colors ${
              isDarkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
            }`}
            title="Đóng và quay lại"
            aria-label="Đóng và quay lại"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Badge 18+ với màu đỏ trầm trung tính */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#822a33]/10 border border-[#822a33]/25 flex items-center justify-center text-[#822a33] dark:bg-[#822a33]/20 dark:border-[#822a33]/40 dark:text-[#e89098] mb-4 shadow-xs">
              <span className="font-extrabold text-xl tracking-tight">18+</span>
            </div>

            {/* Tiêu đề cảnh báo */}
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#822a33] dark:text-[#e89098]">
              Cảnh báo nội dung 18+
            </h3>

            {/* Lời nhắn nội dung / Hướng dẫn pass */}
            {config.instructions && (
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                {config.instructions}
              </p>
            )}

            {/* Khung hiển thị gợi ý pass trực quan */}
            {config.isSpecial ? (
              <div
                className={`mt-3.5 w-full p-4 rounded-xl border text-left font-mono text-xs sm:text-sm ${
                  isDarkMode
                    ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-200'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-[#822a33] dark:text-[#e89098]">
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>3 dòng chữ:</span>
                </div>
                <div className="space-y-1 select-all font-mono leading-relaxed bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-zinc-300/40 dark:border-zinc-700/40">
                  {config.hintLines.map((line, idx) => (
                    <div key={idx} className="break-all font-medium text-xs sm:text-sm text-zinc-800 dark:text-zinc-100">
                      {line}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                  * Copy 3 dòng chữ dán vào khung bên dưới, bỏ các dấu gạch ngang giữa các chữ để xác nhận đọc truyện.
                </p>
              </div>
            ) : (
              <div
                className={`mt-4 w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-mono ${
                  isDarkMode
                    ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-200'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                }`}
              >
                <KeyRound className="w-4 h-4 text-[#822a33] dark:text-[#e89098] shrink-0" />
                <span className="font-semibold text-[#822a33] dark:text-[#e89098]">Pass:</span>
                <span className="font-bold tracking-wider select-all">{DEFAULT_CORRECT_CHAPTER_PASS}</span>
              </div>
            )}
          </div>

          {/* Form nhập pass */}
          <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3.5">
            <div>
              {config.isSpecial ? (
                /* Khung nhập mật khẩu cho phép ghi nhiều dòng và xuống dòng thoải mái */
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    rows={4}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    onKeyDown={(e) => {
                      // Nếu bấm Ctrl+Enter hoặc Cmd+Enter thì gửi form
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder="Nhập pass..."
                    className={`w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-mono leading-relaxed tracking-normal border outline-none transition-all resize-y min-h-[96px] ${
                      errorMsg
                        ? 'border-[#822a33] ring-2 ring-[#822a33]/20 bg-[#822a33]/5 text-[#822a33] dark:text-[#e89098]'
                        : isDarkMode
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600'
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200'
                    }`}
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              ) : (
                /* Khung nhập 1 dòng cho các truyện thông thường */
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Nhập pass..."
                    className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono tracking-wide border outline-none transition-all ${
                      errorMsg
                        ? 'border-[#822a33] ring-2 ring-[#822a33]/20 bg-[#822a33]/5 text-[#822a33] dark:text-[#e89098]'
                        : isDarkMode
                        ? 'bg-zinc-900 border-zinc-700 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600'
                        : 'bg-white border-zinc-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200'
                    }`}
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              )}

              {/* Thông báo lỗi */}
              {errorMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-[#822a33] dark:text-[#e89098] flex items-center gap-1 font-medium"
                >
                  <span>⚠️</span> {errorMsg}
                </motion.p>
              )}
            </div>

            {/* Nút hành động */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                  isDarkMode
                    ? 'border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300'
                    : 'border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>

              <button
                type="submit"
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md ${
                  isSuccessAnim
                    ? 'bg-emerald-600 shadow-emerald-500/20'
                    : 'bg-[#822a33] hover:bg-[#6e232b] active:scale-[0.98] shadow-[#822a33]/20'
                }`}
              >
                {isSuccessAnim ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Mở khóa thành công</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Xác nhận & Đọc</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
