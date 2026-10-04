import React, { useState, useMemo } from 'react';
import {
  Bell,
  Heart,
  MessageSquare,
  BookOpen,
  CheckCheck,
  RefreshCw,
  X,
  ExternalLink,
  Sparkles,
  Inbox,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { AdminNotificationItem, NotificationType } from '../services/adminNotificationService';
import { Novel } from '../types';

interface AdminNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AdminNotificationItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onMarkAllAsRead: () => void;
  onSelectNovel?: (novel: Novel) => void;
  allNovels?: Novel[];
  isDark?: boolean;
}

export const AdminNotificationModal: React.FC<AdminNotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  isLoading,
  onRefresh,
  onMarkAllAsRead,
  onSelectNovel,
  allNovels = [],
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | NotificationType>('all');

  // Lọc thông báo theo tab
  const filteredNotifs = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  // Đếm số lượng theo từng loại
  const counts = useMemo(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    const comments = notifications.filter((n) => n.type === 'comment').length;
    const notes = notifications.filter((n) => n.type === 'note').length;
    const likes = notifications.filter((n) => n.type === 'like').length;
    return { unread, total: notifications.length, comments, notes, likes };
  }, [notifications]);

  if (!isOpen) return null;

  const handleItemClick = (item: AdminNotificationItem) => {
    if (item.targetId && onSelectNovel && allNovels.length > 0) {
      const found = allNovels.find((n) => n.id === item.targetId);
      if (found) {
        onSelectNovel(found);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#0f0b1d]/95 border-purple-500/30 text-purple-100 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl'
            : 'bg-white/95 border-purple-200 text-stone-800 shadow-2xl backdrop-blur-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
            isDark ? 'border-purple-500/20 bg-white/[0.03]' : 'border-purple-100 bg-purple-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs relative ${
                isDark
                  ? 'bg-purple-900/40 border-purple-400/40 text-purple-300'
                  : 'bg-purple-100 border-purple-200 text-purple-700'
              }`}
            >
              <Bell className="w-5 h-5" />
              {counts.unread > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-[#0f0b1d] animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif">Thông Báo Quản Trị</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </span>
              </div>
              <p className="text-xs opacity-70">
                Lượt thả tim, bình luận và lưu bút mới nhất từ độc giả
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Nút Làm mới */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              title="Cập nhật thông báo mới"
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/[0.05] border-white/15 hover:bg-white/[0.1] text-purple-200'
                  : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
              } disabled:opacity-50`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>

            {/* Nút Đánh dấu đã đọc */}
            {counts.unread > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                title="Đánh dấu tất cả đã đọc"
                className={`p-2 sm:px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'bg-purple-600/30 border-purple-400/40 hover:bg-purple-600/50 text-purple-200'
                    : 'bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-800'
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5 text-purple-300" />
                <span className="hidden sm:inline">Đã đọc hết ({counts.unread})</span>
              </button>
            )}

            {/* Nút Đóng */}
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'hover:bg-white/10 text-stone-300' : 'hover:bg-stone-100 text-stone-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= TABS BỘ LỌC ================= */}
        <div
          className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 border-b overflow-x-auto select-none ${
            isDark ? 'border-purple-500/15 bg-black/20' : 'border-purple-100 bg-stone-50/70'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'all'
                ? isDark
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'bg-purple-600 text-white shadow-sm'
                : isDark
                ? 'bg-white/[0.04] text-purple-200/70 hover:bg-white/[0.08]'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>Tất cả</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comment')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'comment'
                ? isDark
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-indigo-600 text-white shadow-sm'
                : isDark
                ? 'bg-white/[0.04] text-indigo-200/70 hover:bg-white/[0.08]'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Bình luận</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {counts.comments}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('note')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'note'
                ? isDark
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                  : 'bg-amber-600 text-white shadow-sm'
                : isDark
                ? 'bg-white/[0.04] text-amber-200/70 hover:bg-white/[0.08]'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lưu bút</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {counts.notes}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('like')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'like'
                ? isDark
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                  : 'bg-rose-600 text-white shadow-sm'
                : isDark
                ? 'bg-white/[0.04] text-rose-200/70 hover:bg-white/[0.08]'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Thả tim</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {counts.likes}
            </span>
          </button>
        </div>

        {/* ================= DANH SÁCH THÔNG BÁO ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 min-h-[300px] max-h-[58vh]">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center space-y-3 opacity-60">
              <Inbox className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-sm">Chưa có thông báo nào trong mục này.</p>
              <p className="text-xs">Khi có lượt thả tim, bình luận hoặc lưu bút mới, bạn sẽ nhận được thông báo tại đây.</p>
            </div>
          ) : (
            filteredNotifs.map((item) => {
              const isComment = item.type === 'comment';
              const isNote = item.type === 'note';
              const isLike = item.type === 'like';

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 relative group ${
                    isDark
                      ? item.isRead
                        ? 'bg-white/[0.025] border-white/10 hover:bg-white/[0.05] hover:border-purple-400/30'
                        : 'bg-purple-950/25 border-purple-500/30 hover:bg-purple-950/40 hover:border-purple-400/50 shadow-sm'
                      : item.isRead
                      ? 'bg-white border-stone-200 hover:bg-stone-50'
                      : 'bg-purple-50/70 border-purple-300 hover:bg-purple-50 shadow-xs'
                  } ${item.targetId ? 'cursor-pointer' : ''}`}
                >
                  {/* Icon loại thông báo */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                      isComment
                        ? isDark
                          ? 'bg-indigo-950/50 text-indigo-300 border-indigo-500/30'
                          : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                        : isNote
                        ? isDark
                          ? 'bg-amber-950/50 text-amber-300 border-amber-500/30'
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                        : isDark
                        ? 'bg-rose-950/50 text-rose-300 border-rose-500/30'
                        : 'bg-rose-100 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isComment && <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {isNote && <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {isLike && <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
                  </div>

                  {/* Nội dung thông báo */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-inherit leading-snug">
                          {item.title}
                        </h4>
                        {typeof item.chapterNumber === 'number' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Chương {item.chapterNumber}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-[10px] sm:text-[11px] font-mono opacity-60">
                        <Clock className="w-3 h-3" />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    {/* Trích đoạn nội dung */}
                    <p className="text-xs sm:text-[13px] opacity-85 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Nhãn nguồn gốc (tên truyện hoặc trang) */}
                    {item.targetTitle && (
                      <div className="pt-1 flex items-center justify-between text-[11px] opacity-70">
                        <span className="truncate">
                          Vị trí: <strong>{item.targetTitle}</strong>
                        </span>
                        {item.targetId && (
                          <span className="text-purple-400 flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
                            <span>Mở xem</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Chấm tròn báo hiệu chưa đọc */}
                  {!item.isRead && (
                    <div
                      className="w-2 h-2 rounded-full bg-rose-500 shrink-0 self-center"
                      title="Chưa đọc"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div
          className={`p-3.5 sm:p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs ${
            isDark ? 'border-purple-500/15 bg-white/[0.02]' : 'border-purple-100 bg-stone-50'
          }`}
        >
          <div className="flex items-center gap-1.5 opacity-70 text-[11px] text-center sm:text-left">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>
              Tự động tổng hợp nhanh, không lưu nền lặp lại, không tiêu tốn dung lượng hay hạn mức máy chủ.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? 'bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/20'
                : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
            }`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
