import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  User as UserIcon,
  LogIn,
  LogOut,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import {
  isUserAdmin,
  ADMIN_EMAIL,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  saveAdminSession,
  clearAdminSession,
  AdminUserLike,
} from '../services/firebase';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AdminUserLike | null;
  onAuthStateChange?: (user: AdminUserLike | null) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthStateChange,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdmin = isUserAdmin(currentUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const enteredUsername = username.trim();
    const enteredPassword = password.trim();

    if (!enteredUsername || !enteredPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ tên quản trị và mật khẩu!');
      return;
    }

    setIsLoading(true);

    if (enteredUsername === ADMIN_USERNAME && enteredPassword === ADMIN_PASSWORD) {
      const adminSessionUser: AdminUserLike = {
        uid: 'admin-nhjrtg',
        email: ADMIN_EMAIL,
        displayName: 'Quản Trị Viên (nhjrtg2026)',
        isLocalAdmin: true,
      };

      saveAdminSession(adminSessionUser);
      onAuthStateChange?.(adminSessionUser);
      setSuccessMsg('Đăng nhập quyền quản trị thành công!');
      setIsLoading(false);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setIsLoading(false);
      setErrorMsg('Tên quản trị hoặc mật khẩu không chính xác!');
    }
  };

  const handleSignOut = () => {
    setIsLoading(true);
    clearAdminSession();
    setSuccessMsg('Đã đăng xuất tài khoản quản trị.');
    onAuthStateChange?.(null);
    setIsLoading(false);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl p-6 text-zinc-100 overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Đăng Nhập Quản Trị</h2>
              <p className="text-xs text-zinc-400">Dành riêng cho ban quản trị</p>
            </div>
          </div>

          {currentUser && isAdmin ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-purple-200">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Đang ở quyền Quản Trị Viên</span>
                </div>
                <div className="text-xs text-zinc-300">
                  <span className="text-zinc-400">Tên:</span> <strong className="text-white">{ADMIN_USERNAME}</strong>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  Toàn quyền: Thêm truyện, sửa, tách TXT, xoá
                </div>
              </div>

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-700/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Tên quản trị:</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên quản trị..."
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Mật khẩu:</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Đăng Nhập</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-zinc-400 pt-1">
                Độc giả bình thường không cần đăng nhập.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
