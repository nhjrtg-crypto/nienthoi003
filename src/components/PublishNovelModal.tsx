import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookPlus, Sparkles, Upload, FileText, CheckCircle2, Flame, Layers } from 'lucide-react';
import { Novel, NovelGenre } from '../types';
import { NOVEL_GENRES } from '../data/novelData';

interface PublishNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newNovel: Novel) => Promise<void> | void;
}

export const PublishNovelModal: React.FC<PublishNovelModalProps> = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    authorName: 'Alex Morgan (Tác Giả)',
    genres: ['Khoa Huyễn Vũ Trụ'],
    synopsis: '',
    worldLore: '',
    status: 'completed' as const,
    translator: 'Jouriee65',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    firstChapterTitle: 'Chương 1: Khởi Đầu Tinh Hệ Mới',
    firstChapterContent: '',
  });

  const [selectedCoverPreset, setSelectedCoverPreset] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const coverPresets = [
    { label: 'Hư Không', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cơ Giáp', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80' },
    { label: 'Tinh Vân', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
    { label: 'Thiên Thể', url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80' },
    { label: 'Thần Ma', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80' },
  ];

  if (!isOpen) return null;

  const handleToggleGenre = (genreName: string) => {
    if (formData.genres.includes(genreName)) {
      if (formData.genres.length > 1) {
        setFormData({ ...formData, genres: formData.genres.filter((g) => g !== genreName) });
      }
    } else {
      if (formData.genres.length < 3) {
        setFormData({ ...formData, genres: [...formData.genres, genreName] });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!formData.title.trim() || !formData.synopsis.trim() || !formData.firstChapterContent.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ Tên tiểu thuyết, Giới thiệu và Nội dung chương 1!');
      return;
    }

    setIsSubmitting(true);

    try {
      const newNovel: Novel = {
        id: `novel-${Date.now()}`,
        title: formData.title.trim(),
        coverImage: formData.coverUrl,
        bannerImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
        author: {
          id: `auth-${Date.now()}`,
          name: formData.authorName.trim(),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          title: 'Tác Giả Tinh Vân Mới',
          totalNovels: 1,
          followers: 120,
        },
        translator: 'Jouriee65',
        synopsis: formData.synopsis.trim(),
        worldLore: formData.worldLore?.trim() || 'Hệ thống vũ trụ lượng tử chưa được khám phá hết...',
        genres: formData.genres,
        status: 'completed',
        rating: 5.0,
        ratingCount: 1,
        views: 0,
        bookmarks: 10,
        monthlyVotes: 5,
        totalWords: formData.firstChapterContent.length,
        latestChapter: {
          number: 1,
          title: formData.firstChapterTitle.trim(),
          updatedAt: 'Vừa xong',
        },
        featured: false,
        rankingScore: 5000,
        chapters: [
          {
            id: `c-${Date.now()}-1`,
            chapterNumber: 1,
            title: formData.firstChapterTitle.trim(),
            wordCount: formData.firstChapterContent.trim().length,
            views: 0,
            publishedAt: new Date().toISOString().split('T')[0],
            content: formData.firstChapterContent.trim(),
          },
        ],
        comments: [],
      };

      await onPublish(newNovel);
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1200);
    } catch (err: any) {
      console.error('Publish novel error:', err);
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Có lỗi xảy ra khi lưu truyện lên hệ thống. Vui lòng thử lại!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#0B0D24] border border-indigo-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => {
              onClose();
            }}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-indigo-900/40 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#0B0D24] rounded-[14px] flex items-center justify-center text-pink-400">
                <BookPlus className="w-6 h-6" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300">
                SÁNG TÁC TINH VÂN
              </span>
              <h3 className="text-xl sm:text-2xl font-tektur font-bold text-white mt-1">
                Đăng Tác Phẩm Tiểu Thuyết Mới
              </h3>
            </div>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg text-white">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h4 className="text-2xl font-bold font-tektur text-white">
                Xuất Bản Tiểu Thuyết Thành Công!
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Tác phẩm của bạn đã chính thức hòa nhập vào Thư Viện Tinh Vân. Độc giả trên toàn hệ ngân hà hiện đã có thể bắt đầu đọc và đánh giá.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 cursor-pointer shadow-md"
              >
                Xem Tác Phẩm Trên Trang Chủ
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {/* Cover Selection */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">
                  1. CHỌN ẢNH BÌA TINH VÂN (HOẶC NHẬP URL) *
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {coverPresets.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setSelectedCoverPreset(idx);
                        setFormData({ ...formData, coverUrl: preset.url });
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-3/4 border-2 transition-all cursor-pointer ${
                        selectedCoverPreset === idx
                          ? 'border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.5)] scale-102'
                          : 'border-indigo-900/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 right-1 text-[10px] font-semibold text-center bg-black/70 text-white rounded-md py-0.5">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                  placeholder="Hoặc dán URL ảnh bìa tùy chọn (https://...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-900/60 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    2. TÊN TIỂU THUYẾT *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Nghịch Thiên Cơ Giáp Sư"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-900/60 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    BÚT DANH TÁC GIẢ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-900/60 text-sm text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Genres */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">
                  3. THỂ LOẠI (CHỌN TỐI ĐA 3 THỂ LOẠI) *
                </label>
                <div className="flex flex-wrap gap-2">
                  {NOVEL_GENRES.filter((g) => g.id !== 'all').map((g) => {
                    const isSelected = formData.genres.includes(g.name);
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => handleToggleGenre(g.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                            : 'bg-slate-900/80 border border-indigo-900/50 text-slate-400 hover:text-white'
                        }`}
                      >
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  4. GIỚI THIỆU TÓM TẮT CỐT TRUYỆN *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  placeholder="Tóm tắt bối cảnh, mâu thuẫn chính, bàn tay vàng / năng lực đặc biệt của nhân vật chính..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-900/60 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500 resize-none"
                />
              </div>

              {/* World Lore */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  5. THIẾT LẬP THẾ GIỚI / CẢNH GIỚI TU LUYỆN (TÙY CHỌN)
                </label>
                <input
                  type="text"
                  value={formData.worldLore}
                  onChange={(e) => setFormData({ ...formData, worldLore: e.target.value })}
                  placeholder="VD: Cảnh giới: Tinh Đồ, Tinh Túc, Hằng Tinh Cảnh, Hư Không Cảnh..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-900/60 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* First Chapter */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-900/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-pink-400 font-bold">
                  <FileText className="w-4 h-4" />
                  <span>6. NỘI DUNG CHƯƠNG 1 (MỞ ĐẦU) *</span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.firstChapterTitle}
                  onChange={(e) => setFormData({ ...formData, firstChapterTitle: e.target.value })}
                  placeholder="Tiêu đề chương 1"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0E1026] border border-indigo-900/60 text-xs sm:text-sm text-white focus:outline-hidden focus:border-pink-500"
                />
                <textarea
                  required
                  rows={5}
                  value={formData.firstChapterContent}
                  onChange={(e) => setFormData({ ...formData, firstChapterContent: e.target.value })}
                  placeholder="Viết nội dung chương 1 tại đây... Tiếng nổ bức xạ lượng tử xé toạc màn đêm..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1026] border border-indigo-900/60 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-pink-500 resize-none font-mono"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-indigo-900/40">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Đang Xuất Bản Lên Tinh Hải...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Xuất Bản Tác Phẩm</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
