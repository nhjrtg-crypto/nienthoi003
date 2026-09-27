import React, { useState, useEffect } from 'react';
import {
  X,
  Edit3,
  Trash2,
  Save,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { NovelChapter } from '../types';
import { updateChuong, renameChuong, deleteChuong } from '../services/firebase';

interface ChapterEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  novelId: string;
  chapter: NovelChapter | null;
  currentContent?: string;
  onChapterUpdated: (updatedChapter: NovelChapter) => void;
  onChapterDeleted: (chapterNumber: number) => void;
  isDark?: boolean;
}

type TabMode = 'rename' | 'content' | 'delete';

export const ChapterEditorModal: React.FC<ChapterEditorModalProps> = ({
  isOpen,
  onClose,
  novelId,
  chapter,
  currentContent = '',
  onChapterUpdated,
  onChapterDeleted,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('rename');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (chapter && isOpen) {
      setTitle(chapter.title || `Chương ${chapter.chapterNumber}`);
      setContent(currentContent || chapter.content || '');
      setConfirmDelete(false);
      setMessage(null);
    }
  }, [chapter, currentContent, isOpen]);

  if (!isOpen || !chapter) return null;

  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = content.length;

  const handleSaveTitle = async () => {
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Tên chương không được để trống!' });
      return;
    }
    setIsSaving(true);
    setMessage(null);
    try {
      const ok = await renameChuong(novelId, chapter.chapterNumber, title.trim());
      if (ok) {
        const isExtra = /ngoại\s*truyện|phiên\s*ngoại/i.test(title.trim());
        const updated: NovelChapter = {
          ...chapter,
          title: title.trim(),
          isExtra,
        };
        onChapterUpdated(updated);
        setMessage({ type: 'success', text: 'Đã đổi tên và lưu vào hệ thống thành công!' });
      } else {
        setMessage({ type: 'error', text: 'Không thể cập nhật tên chương vào hệ thống. Vui lòng thử lại!' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Lỗi khi lưu tên chương!' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContent = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const ok = await updateChuong(novelId, chapter.chapterNumber, {
        tieuDe: title.trim(),
        noiDung: content,
      });
      if (ok) {
        const updated: NovelChapter = {
          ...chapter,
          title: title.trim(),
          content: content,
          wordCount,
        };
        onChapterUpdated(updated);
        setMessage({ type: 'success', text: 'Đã lưu toàn bộ nội dung chương vào hệ thống!' });
      } else {
        setMessage({ type: 'error', text: 'Lưu nội dung thất bại. Vui lòng kiểm tra lại kết nối!' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Lỗi khi lưu nội dung chương!' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    setMessage(null);
    try {
      const ok = await deleteChuong(novelId, chapter.chapterNumber);
      if (ok) {
        onChapterDeleted(chapter.chapterNumber);
        onClose();
      } else {
        setMessage({ type: 'error', text: 'Không thể xóa chương khỏi hệ thống. Vui lòng thử lại!' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Lỗi khi xóa chương!' });
    } finally {
      setIsDeleting(false);
    }
  };

  const quickTitles = [
    `Chương ${chapter.chapterNumber}`,
    `Ngoại truyện 1`,
    `Ngoại truyện 2`,
    `Ngoại truyện 3`,
    `Phiên ngoại`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${
          isDark
            ? 'bg-zinc-900 border-zinc-700 text-zinc-100 shadow-black/80'
            : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-400/40'
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">Quản Lý & Chỉnh Sửa Chương</h3>
              <p className="text-xs opacity-60">Chương số #{chapter.chapterNumber}: {chapter.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-500/20 px-5 pt-2 gap-2 bg-zinc-500/5">
          <button
            onClick={() => {
              setActiveTab('rename');
              setMessage(null);
            }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'rename'
                ? 'border-purple-500 text-purple-400 font-bold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Đổi Tên Chương</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('content');
              setMessage(null);
            }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'border-purple-500 text-purple-400 font-bold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sửa Nội Dung ({wordCount.toLocaleString()} chữ)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('delete');
              setMessage(null);
            }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'delete'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent opacity-60 hover:opacity-100 text-red-400/80'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa Chương</span>
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`mx-5 mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
              message.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/15 border-red-500/30 text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'rename' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 opacity-80">
                  Tên tiêu đề chương hiện tại:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Chương 1, Ngoại truyện 1,..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${
                    isDark
                      ? 'bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-500'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2 opacity-70 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Gợi ý đặt tên nhanh:
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickTitles.map((qt) => (
                    <button
                      key={qt}
                      type="button"
                      onClick={() => setTitle(qt)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        title === qt
                          ? 'bg-purple-500 text-white border-purple-500 shadow-xs'
                          : isDark
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                          : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {qt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-500/20 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium opacity-70 hover:opacity-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Lưu Tên Mới</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs opacity-75">
                <span>Nội dung chi tiết chương:</span>
                <span>
                  {wordCount.toLocaleString()} chữ • {charCount.toLocaleString()} ký tự
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập hoặc dán nội dung chương truyện tại đây..."
                rows={14}
                className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm font-sans leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-y ${
                  isDark
                    ? 'bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-500'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                }`}
              />

              <div className="pt-2 border-t border-zinc-500/20 flex items-center justify-between">
                <span className="text-[11px] opacity-60">
                  Dữ liệu được lưu trực tiếp vào cơ sở dữ liệu hệ thống.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-medium opacity-70 hover:opacity-100 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Lưu Nội Dung Vào Hệ Thống</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delete' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Cảnh báo xóa chương vĩnh viễn</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed">
                  Bạn đang chuẩn bị xóa <strong>{chapter.title}</strong> (Chương số #{chapter.chapterNumber}).
                  Hành động này sẽ xóa vĩnh viễn chương này khỏi cơ sở dữ liệu hệ thống và không thể hoàn tác!
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-500/20 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDelete(false);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium opacity-70 hover:opacity-100 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50 ${
                    confirmDelete
                      ? 'bg-red-600 hover:bg-red-500 ring-2 ring-red-400 shadow-red-600/30'
                      : 'bg-red-700 hover:bg-red-600'
                  }`}
                >
                  {isDeleting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>{confirmDelete ? 'Tôi Chắc Chắn Muốn Xóa' : 'Xác Nhận Xóa Chương Này'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
