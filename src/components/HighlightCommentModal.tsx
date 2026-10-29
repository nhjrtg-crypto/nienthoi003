import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Quote, X, Send } from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';
import { NovelComment } from '../types';
import { parseCommentContent } from '../utils/chapterHighlights';
import { getNovelThemeStyles, NovelThemeId } from '../utils/themeStyles';
import {
  auth,
  GoogleUserLike,
  getStoredGoogleUser,
  signInWithGoogle,
  signOutGoogleUser,
} from '../services/firebase';

export interface HighlightCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteText: string;
  initialAuthor?: string;
  theme?: string;
  isDark?: boolean;
  comments?: NovelComment[];
  chapterNumber?: number | null;
  onSubmit: (comment: string, quote: string, author?: string) => void;
}

// Avatar background generator matching reader
const getAvatarBgColor = (name: string): string => {
  const palette = [
    'bg-[#b07d8f]',
    'bg-[#5f7d6a]',
    'bg-[#826b5b]',
    'bg-[#6366f1]',
    'bg-[#0ea5e9]',
    'bg-[#10b981]',
    'bg-[#d97706]',
    'bg-[#ec4899]',
    'bg-[#8b5cf6]',
  ];
  if (!name) return palette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return palette[Math.abs(hash) % palette.length];
};

export const HighlightCommentModal: React.FC<HighlightCommentModalProps> = ({
  isOpen,
  onClose,
  quoteText,
  initialAuthor,
  theme = 'cosmic',
  isDark = true,
  comments = [],
  chapterNumber,
  onSubmit,
}) => {
  const [googleUser, setGoogleUser] = useState<GoogleUserLike | null>(() => {
    return (auth?.currentUser as GoogleUserLike | null) || getStoredGoogleUser();
  });
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);
  const [googleLoginError, setGoogleLoginError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<GoogleUserLike | null>;
      setGoogleUser(customEvent.detail || getStoredGoogleUser());
    };
    window.addEventListener('cosmo_auth_changed', handleAuthChange);
    return () => {
      window.removeEventListener('cosmo_auth_changed', handleAuthChange);
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingInGoogle(true);
    setGoogleLoginError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setGoogleUser(user);
      }
    } catch (err: any) {
      console.error('Google Sign-in failed in Highlight modal:', err);
      if (err?.code === 'auth/popup-blocked') {
        setGoogleLoginError('Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng cho phép popup để đăng nhập Google.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setGoogleLoginError('Tên miền ứng dụng chưa được ủy quyền trên Firebase Console.');
      } else {
        setGoogleLoginError(err?.message || 'Không thể đăng nhập Google. Vui lòng thử lại.');
      }
    } finally {
      setIsLoggingInGoogle(false);
    }
  };

  const [commentText, setCommentText] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<NovelComment[]>([]);

  // Theme-specific styles adapting container, quote box, form, inputs, buttons, and comments
  // Đồng bộ màu sắc 100% giống hệt popup Bình Luận Chương theo từng Theme & Chế độ sáng/tối
  const st = useMemo(() => {
    const tStyles = getNovelThemeStyles((theme || 'cosmic') as NovelThemeId, isDark);
    
    const getScrollbarColor = () => {
      if (isDark) {
        switch (theme) {
          case 'amethyst-haze':
          case 'cosmic':
            return '#c084fc';
          case 'slate-haze':
            return '#60a5fa';
          case 'sage':
            return '#4ade80';
          case 'mocha':
            return '#fb923c';
          case 'notebook':
          default:
            return '#a1a1aa';
        }
      } else {
        switch (theme) {
          case 'amethyst-haze':
            return '#9333ea';
          case 'slate-haze':
            return '#2563eb';
          case 'sage':
            return '#16a34a';
          case 'mocha':
            return '#ea580c';
          case 'notebook':
          default:
            return '#71717a';
        }
      }
    };

    return {
      modalCard: isDark
        ? 'bg-[#16181f] border-zinc-700 text-zinc-100 shadow-black/80'
        : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-500/25',
      headerBorder: 'border-zinc-500/20',
      headerIcon: 'bg-purple-500/15 text-purple-400',
      badge: tStyles.cardTag,
      quoteBox: isDark
        ? 'bg-[#252016] border-amber-900/50 text-amber-100/90 shadow-xs'
        : 'bg-[#fef9ee] border-amber-200/80 text-stone-800 shadow-xs',
      quoteIcon: isDark ? 'text-amber-400' : 'text-amber-600',
      formCard: tStyles.commentForm || tStyles.card,
      input: isDark
        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:ring-purple-500/30'
        : 'bg-white border-zinc-300 text-zinc-800 placeholder-zinc-400 focus:ring-purple-500/30',
      primaryBtn: tStyles.buttonPrimary,
      cancelBtn: isDark ? 'text-zinc-400 hover:bg-zinc-800/60' : 'text-zinc-600 hover:bg-zinc-100',
      commentCard: tStyles.commentCard || tStyles.card,
      commentQuoteBox: isDark
        ? 'bg-[#252016] border-amber-900/50 text-amber-100/90 shadow-xs'
        : 'bg-[#fef9ee] border-amber-200/80 text-stone-800 shadow-xs',
      scrollbar: getScrollbarColor(),
    };
  }, [theme, isDark]);

  // Lọc và khử trùng lặp bình luận (khắc phục triệt để lỗi hiển thị 2 bình luận giống nhau)
  const relevantComments = useMemo(() => {
    const list: NovelComment[] = [];
    const seenSignatures = new Set<string>();

    const getCommentSignature = (cm: NovelComment) => {
      if (!cm) return '';
      const parsed = parseCommentContent(cm.content || '');
      const q = (parsed.quoteText || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const txt = (parsed.commentBody || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const author = (cm.author || '').trim().toLowerCase();
      if (!parsed.hasQuote) {
        return `raw:${author}___${(cm.content || '').replace(/\s+/g, ' ').trim().toLowerCase()}`;
      }
      return `quote:${author}___q:${q}___c:${txt}`;
    };

    const addIfUnique = (cm: NovelComment) => {
      if (!cm) return;
      const sig = getCommentSignature(cm);
      if (seenSignatures.has(cm.id) || (sig && seenSignatures.has(sig))) return;
      seenSignatures.add(cm.id);
      if (sig) seenSignatures.add(sig);
      list.push(cm);
    };

    // Đưa bình luận cục bộ vừa tạo vào trước
    localComments.forEach(addIfUnique);
    // Sau đó đưa bình luận từ props vào (nếu trùng tác giả + trích dẫn + nội dung sẽ tự động bỏ qua)
    comments.forEach(addIfUnique);

    if (quoteText.trim()) {
      const qTrimmed = quoteText.trim();
      const matching = list.filter((c) => c.content.includes(qTrimmed));
      const others = list.filter((c) => !c.content.includes(qTrimmed) && c.content.startsWith('“'));
      return [...matching, ...others];
    }
    return list;
  }, [localComments, comments, quoteText]);

  useEffect(() => {
    if (isOpen) {
      setCommentText('');
      setJustSubmitted(false);
      setIsSubmitting(false);
      setLocalComments([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!googleUser) {
      handleGoogleLogin();
      return;
    }
    const trimmedAuthor = (googleUser.displayName || 'Bạn đọc').trim();

    setIsSubmitting(true);

    const fullContent = commentText.trim()
      ? `“${quoteText}”\n\n${commentText.trim()}`
      : `“${quoteText}”`;

    // 1. Tạo bình luận tạm thời và đưa ngay lập tức vào danh sách hiển thị trên popup
    const newLocalCm: NovelComment = {
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      truyenId: '',
      author: trimmedAuthor,
      avatar: googleUser.photoURL || '',
      content: fullContent,
      createdAt: 'Vừa xong',
      ngayTao: new Date().toISOString(),
      likes: 0,
      badge: 'Độc Giả',
      chapterNumber: chapterNumber ?? undefined,
    };

    setLocalComments((prev) => [newLocalCm, ...prev]);
    setCommentText('');
    setJustSubmitted(true);

    // 2. Gọi onSubmit qua setTimeout phi đồng bộ để tránh đơ màn hình / blocking event loop
    setTimeout(() => {
      try {
        onSubmit(commentText, quoteText, trimmedAuthor);
      } catch (err) {
        console.warn('Lỗi khi gửi bình luận trích dẫn:', err);
      } finally {
        setIsSubmitting(false);
      }
    }, 16);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        {/* Click-outside backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.16 }}
          className={`relative w-full max-w-lg md:max-w-xl max-h-[85vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl z-10 transition-colors ${st.modalCard}`}
        >
          {/* Header Popup giống Bình Luận Chương */}
          <div className={`px-5 py-3.5 border-b flex items-center justify-between shrink-0 ${st.headerBorder}`}>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-xl ${st.headerIcon}`}>
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <span>Trích Dẫn & Bình Luận</span>
                  {chapterNumber && (
                    <span className="text-xs font-normal opacity-70 hidden sm:inline">
                      • Chương {chapterNumber}
                    </span>
                  )}
                  <span className={`text-[11px] px-2 py-0.2 rounded-full border font-mono font-semibold ${st.badge}`}>
                    {relevantComments.length}
                  </span>
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-transparent hover:border-zinc-500/30 hover:bg-zinc-500/10 opacity-70 hover:opacity-100 transition-all cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Thân cuộn của Popup */}
          <div
            className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 reader-settings-scrollbar"
            style={{
              '--scrollbar-thumb': st.scrollbar,
            } as React.CSSProperties}
          >
            {/* 1. Khung Trích Dẫn Đoạn Văn - Đổi màu hợp từng theme */}
            {quoteText && (
              <div className={`p-3.5 sm:p-4 rounded-2xl border shadow-xs flex gap-3 transition-colors ${st.quoteBox}`}>
                <Quote className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 rotate-180 opacity-90 ${st.quoteIcon}`} />
                <p className="font-serif italic text-xs sm:text-[13px] leading-relaxed">
                  “{quoteText}”
                </p>
              </div>
            )}

            {/* 2. Form Nhập Bình Luận Trích Dẫn (Yêu cầu đăng nhập Google) */}
            {!googleUser ? (
              <div className={`p-4 rounded-2xl border text-center space-y-3 ${st.formCard}`}>
                <div className="w-10 h-10 mx-auto rounded-full bg-white shadow-xs border border-zinc-200 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">Đăng nhập Google để bình luận trích dẫn</h4>
                  <p className="text-[11px] opacity-70 mt-0.5">
                    Xác thực để gửi suy nghĩ về câu văn này
                  </p>
                </div>
                {googleLoginError && (
                  <div className="text-[11px] text-rose-500 bg-rose-500/10 py-1 px-2.5 rounded-lg border border-rose-500/20 text-left">
                    {googleLoginError}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingInGoogle}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold shadow-xs border border-zinc-200 hover:border-zinc-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isLoggingInGoogle ? (
                    <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-purple-600 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>{isLoggingInGoogle ? 'Đang mở cửa sổ đăng nhập...' : 'Tiếp tục với Google'}</span>
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 transition-colors ${st.formCard}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {googleUser.photoURL ? (
                      <img
                        src={googleUser.photoURL}
                        alt={googleUser.displayName || 'User'}
                        className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-purple-600/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                        {(googleUser.displayName || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold">{googleUser.displayName || 'Bạn đọc'}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/15 text-purple-400 font-medium border border-purple-500/30">
                        Google
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await signOutGoogleUser();
                      setGoogleUser(null);
                    }}
                    className="text-[10px] opacity-60 hover:opacity-100 hover:underline cursor-pointer"
                  >
                    Đổi tài khoản
                  </button>
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Chia sẻ suy nghĩ của bạn về đoạn trích này..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    maxLength={1000}
                    className={`w-full p-3 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 transition-all resize-none ${st.input}`}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px]">
                    {justSubmitted ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <span>✓ Đã đăng bình luận thành công</span>
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${st.cancelBtn}`}
                    >
                      Đóng
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 ${st.primaryBtn}`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Bình Luận</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 3. Danh Sách Bình Luận (Tiêu đề bỏ icon lấp lánh bên cạnh) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                  Bình Luận Về Trích Dẫn ({relevantComments.length})
                </span>
              </div>

              {relevantComments.length === 0 ? (
                <div
                  className={`p-6 text-center rounded-2xl border space-y-1.5 border-dashed ${
                    isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'
                  }`}
                >
                  <MessageSquare className="w-6 h-6 mx-auto opacity-30" />
                  <p className="text-xs font-medium">
                    Chưa có bình luận nào cho đoạn trích này. Hãy là người đầu tiên để lại cảm nghĩ nhé!
                  </p>
                </div>
              ) : (
                relevantComments.map((cm) => {
                  const parsed = parseCommentContent(cm.content);
                  return (
                    <div
                      key={cm.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 transition-colors ${st.commentCard}`}
                    >
                      {/* Khung trích dẫn theo màu theme */}
                      {parsed.hasQuote && (
                        <div className={`p-3 rounded-xl border shadow-2xs ${st.commentQuoteBox}`}>
                          <p className="font-serif italic text-xs leading-relaxed">
                            “{parsed.quoteText}”
                          </p>
                        </div>
                      )}

                      {/* Thông tin tác giả & Thời gian */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {cm.avatar &&
                          (cm.avatar.startsWith('http://') || cm.avatar.startsWith('https://')) ? (
                            <img
                              src={cm.avatar}
                              alt={cm.author}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border object-cover shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs select-none shadow-xs text-white ${getAvatarBgColor(
                                cm.author
                              )}`}
                            >
                              {(cm.author?.trim().charAt(0) || 'Đ').toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold truncate block">
                              {cm.author}
                            </span>
                            {typeof cm.chapterNumber === 'number' && (
                              <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold ${st.badge}`}>
                                Chương {cm.chapterNumber}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-[11px] font-normal opacity-60">
                          {cm.createdAt}
                        </span>
                      </div>

                      {/* Nội dung bình luận */}
                      <p className="text-xs sm:text-sm leading-relaxed pl-1 opacity-90">
                        {parsed.hasQuote ? (parsed.commentBody || '') : cm.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
