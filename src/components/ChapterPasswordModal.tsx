import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Check, ArrowLeft, X, Lock } from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

export const CHAPTER_PASS_KEY = 'cosmo_chapter_pass_unlocked_18';
export const CORRECT_CHAPTER_PASS = 'NIENTHOIDOCTRUYEN';

export const isChapterPasswordUnlocked = (): boolean => {
  try {
    return safeStorage.getItem(CHAPTER_PASS_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setChapterPasswordUnlocked = (): void => {
  try {
    safeStorage.setItem(CHAPTER_PASS_KEY, 'true');
    localStorage.setItem(CHAPTER_PASS_KEY, 'true');
  } catch {
    // Ignore safe storage errors
  }
};

interface ChapterPasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

export const ChapterPasswordModal: React.FC<ChapterPasswordModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  isDarkMode = false,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setPasswordInput('');
      setErrorMsg('');
      setIsSuccessAnim(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanInput = passwordInput.trim().toUpperCase();

    if (!cleanInput) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      inputRef.current?.focus();
      return;
    }

    if (cleanInput === CORRECT_CHAPTER_PASS) {
      setErrorMsg('');
      setIsSuccessAnim(true);
      setChapterPasswordUnlocked();
      setTimeout(() => {
        onSuccess();
      }, 350);
    } else {
      setErrorMsg('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
      inputRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
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
          className={`relative w-full max-w-md rounded-2xl sm:rounded-3xl border shadow-2xl p-6 sm:p-8 z-10 transition-colors ${
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

            {/* Lời nhắn nội dung */}
            <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              Truyện dành cho người trên 18 tuổi. Bằng việc tiếp tục nhập pass, bạn xác nhận đã đủ 18 tuổi trở lên và chấp nhận xem nội dung này.
            </p>

            {/* Khung hiển thị Pass trực quan (đã bỏ nút sao chép) */}
            <div
              className={`mt-4 w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-mono ${
                isDarkMode
                  ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-200'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-800'
              }`}
            >
              <KeyRound className="w-4 h-4 text-[#822a33] dark:text-[#e89098] shrink-0" />
              <span className="font-semibold text-[#822a33] dark:text-[#e89098]">Pass:</span>
              <span className="font-bold tracking-wider select-all">{CORRECT_CHAPTER_PASS}</span>
            </div>
          </div>

          {/* Form nhập pass */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <div>
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
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-mono tracking-wider border outline-none transition-all ${
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
