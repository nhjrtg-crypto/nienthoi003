import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookPlus, Image, FileText, CheckCircle2, AlertCircle, Link as LinkIcon, Shield } from 'lucide-react';
import { createTruyen, AdminUserLike } from '../services/firebase';

interface CreateFirestoreTruyenModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AdminUserLike | null;
  onSuccess?: (newTruyenId: string) => void;
}

export const CreateFirestoreTruyenModal: React.FC<CreateFirestoreTruyenModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [tenTruyen, setTenTruyen] = useState('');
  const [tacGia, setTacGia] = useState('');
  const [theLoai, setTheLoai] = useState('Đam Mỹ, Hiện Đại');
  const [anhBia, setAnhBia] = useState('');
  const [moTa, setMoTa] = useState('');
  const [trangThai, setTrangThai] = useState<'nhap' | 'daDang'>('daDang');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentUser) {
      setErrorMsg('Bạn cần đăng nhập tài khoản quản trị để tạo truyện!');
      return;
    }

    if (!tenTruyen.trim()) {
      setErrorMsg('Vui lòng nhập tên truyện!');
      return;
    }

    setIsSubmitting(true);
    try {
      const newId = await createTruyen({
        tenTruyen: tenTruyen.trim(),
        tacGia: tacGia.trim() || 'Chưa rõ',
        theLoai: theLoai.trim() || 'Tiểu Thuyết',
        anhBia: anhBia.trim(),
        moTa: moTa.trim(),
        trangThai,
        adminUser: currentUser,
        translator: 'Jouriee65',
        status: 'completed',
      });

      setSuccessMsg('Đã lưu truyện thành công vào Firestore collection truyen!');
      setTimeout(() => {
        onSuccess?.(newId);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Error creating novel:', err);
      setErrorMsg(err?.message || 'Lỗi khi lưu truyện vào Firestore. Vui lòng kiểm tra quyền!');
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl p-6 text-zinc-100"
        >
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
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Tạo Truyện Mới (Firestore)</h2>
              <p className="text-xs text-zinc-400">Lưu vào Firestore collection truyen</p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-700/50 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tên truyện */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-200">
                Tên truyện <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={tenTruyen}
                onChange={(e) => setTenTruyen(e.target.value)}
                placeholder="Nhập tên tiểu thuyết..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Tác giả & Thể loại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-200">Tác giả</label>
                <input
                  type="text"
                  value={tacGia}
                  onChange={(e) => setTacGia(e.target.value)}
                  placeholder="Ví dụ: Nhĩ Đóa"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-200">Thể loại</label>
                <input
                  type="text"
                  value={theLoai}
                  onChange={(e) => setTheLoai(e.target.value)}
                  placeholder="Đam Mỹ, Hiện Đại, Vườn Trường..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* URL ảnh bìa (Dán link có sẵn — KHÔNG dùng AI) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>URL ảnh bìa (Dán link có sẵn)</span>
                </label>
                <span className="text-[10px] text-amber-400/90 font-medium">
                  Không dùng AI tạo ảnh
                </span>
              </div>
              <input
                type="url"
                value={anhBia}
                onChange={(e) => setAnhBia(e.target.value)}
                placeholder="https://... hoặc /covers/chiem_huu_cuc_do_q1.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              <p className="text-[11px] text-zinc-400">
                Dán đường dẫn ảnh có sẵn trên internet hoặc link ảnh cục bộ đã lưu.
              </p>
              {anhBia && (
                <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-zinc-800/60 border border-zinc-700">
                  <img
                    src={anhBia}
                    alt="Bìa xem trước"
                    className="w-12 h-16 object-cover rounded-lg border border-zinc-600"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-zinc-300">Xem trước ảnh bìa</span>
                </div>
              )}
            </div>

            {/* Trạng thái phát hành: Luôn luôn là Hoàn thành / Công khai */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">Trạng thái phát hành</label>
              <div className="py-2.5 px-3 rounded-xl border border-emerald-500/60 bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Hoàn thành (Đã đăng - Công khai)</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Theo quy định, tất cả truyện mới được đăng lên web đều được để trạng thái &quot;Hoàn thành&quot;.
              </p>
            </div>

            {/* Mô tả / Giới thiệu */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-200">Mô tả / Tóm tắt truyện</label>
              <textarea
                rows={4}
                value={moTa}
                onChange={(e) => setMoTa(e.target.value)}
                placeholder="Nội dung tóm tắt hoặc văn án giới thiệu tác phẩm..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors resize-y"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <BookPlus className="w-4 h-4" />
                    <span>Lưu Truyện Vào Firestore</span>
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
