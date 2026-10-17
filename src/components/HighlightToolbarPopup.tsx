import React from 'react';
import { Highlighter, MessageSquare, Trash2, Eye, EyeOff, X, Check, Save } from 'lucide-react';
import { HighlightColor, HighlightStyle, HIGHLIGHT_COLORS } from '../utils/chapterHighlights';

export interface HighlightToolbarPopupProps {
  selectedText: string;
  activeColor: HighlightColor | null;
  activeStyle: HighlightStyle | null;
  onSelectColor: (color: HighlightColor) => void;
  onSelectStyle: (style: HighlightStyle) => void;
  onApplyHighlight: () => void;
  onSaveExistingHighlight?: () => void;
  onOpenCommentModal: () => void;
  onRemoveHighlight?: () => void;
  isHighlightsHidden?: boolean;
  onToggleHide?: () => void;
  onClose?: () => void;
  isDark?: boolean;
  theme?: string;
  isEditingExisting?: boolean;
}

export const HighlightToolbarPopup: React.FC<HighlightToolbarPopupProps> = ({
  selectedText,
  activeColor,
  activeStyle,
  onSelectColor,
  onSelectStyle,
  onApplyHighlight,
  onSaveExistingHighlight,
  onOpenCommentModal,
  onRemoveHighlight,
  isHighlightsHidden = false,
  onToggleHide,
  onClose,
  isDark = true,
  theme = 'cosmic',
  isEditingExisting = false,
}) => {
  // Theme-sensitive styling for container, buttons, and badges
  const getThemeStyles = () => {
    if (isDark) {
      switch (theme) {
        case 'amethyst-haze':
        case 'purple':
          return {
            container: 'bg-[#151122]/85 border-purple-900/25 text-purple-100 shadow-purple-950/25',
            divider: 'bg-purple-900/25',
            label: 'text-purple-300/75',
            styleActive: 'bg-purple-600/40 text-white border border-purple-400/50 font-semibold shadow-xs',
            styleInactive: 'bg-purple-950/25 text-purple-300/70 hover:bg-purple-900/35 border border-purple-900/25',
            primaryBtn: 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 border border-purple-400/20 shadow-2xs',
            saveBtn: 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 border border-purple-400/20 shadow-2xs',
            commentBtn: 'bg-purple-400/10 hover:bg-purple-400/20 text-purple-200 border border-purple-400/15 shadow-2xs',
            ringColor: 'ring-purple-400',
          };
        case 'sage':
          return {
            container: 'bg-[#0f1712]/85 border-emerald-900/25 text-emerald-100 shadow-emerald-950/25',
            divider: 'bg-emerald-900/25',
            label: 'text-emerald-300/75',
            styleActive: 'bg-emerald-600/40 text-white border border-emerald-400/50 font-semibold shadow-xs',
            styleInactive: 'bg-emerald-950/25 text-emerald-300/70 hover:bg-emerald-900/35 border border-emerald-900/25',
            primaryBtn: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-400/20 shadow-2xs',
            saveBtn: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-400/20 shadow-2xs',
            commentBtn: 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-200 border border-teal-400/15 shadow-2xs',
            ringColor: 'ring-emerald-400',
          };
        case 'mocha':
        case 'linen':
          return {
            container: 'bg-[#16110f]/85 border-amber-900/25 text-amber-100 shadow-stone-950/25',
            divider: 'bg-amber-900/25',
            label: 'text-amber-300/75',
            styleActive: 'bg-amber-600/40 text-white border border-amber-400/50 font-semibold shadow-xs',
            styleInactive: 'bg-amber-950/25 text-amber-300/70 hover:bg-amber-900/35 border border-amber-900/25',
            primaryBtn: 'bg-amber-600/15 hover:bg-amber-600/25 text-amber-200 border border-amber-400/20 shadow-2xs',
            saveBtn: 'bg-amber-600/15 hover:bg-amber-600/25 text-amber-200 border border-amber-400/20 shadow-2xs',
            commentBtn: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-400/15 shadow-2xs',
            ringColor: 'ring-amber-400',
          };
        case 'notebook':
        case 'white':
          return {
            container: 'bg-[#161618]/95 border-zinc-800 text-zinc-100 shadow-black/40',
            divider: 'bg-zinc-800/80',
            label: 'text-zinc-400',
            styleActive: 'bg-zinc-700 text-white border border-zinc-500 font-semibold shadow-xs',
            styleInactive: 'bg-zinc-900/40 text-zinc-400 hover:bg-zinc-800/60 border border-zinc-800/40',
            primaryBtn: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/60 shadow-2xs',
            saveBtn: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/60 shadow-2xs',
            commentBtn: 'bg-zinc-800/70 hover:bg-zinc-700/70 text-zinc-200 border border-zinc-700/50 shadow-2xs',
            ringColor: 'ring-zinc-400',
          };
        case 'slate':
          return {
            container: 'bg-[#14181f]/95 border-slate-800 text-slate-100 shadow-black/40',
            divider: 'bg-slate-800/80',
            label: 'text-slate-400',
            styleActive: 'bg-slate-700 text-white border border-slate-500 font-semibold shadow-xs',
            styleInactive: 'bg-slate-900/40 text-slate-400 hover:bg-slate-800/60 border border-slate-800/40',
            primaryBtn: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60 shadow-2xs',
            saveBtn: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60 shadow-2xs',
            commentBtn: 'bg-slate-800/70 hover:bg-slate-700/70 text-slate-200 border border-slate-700/50 shadow-2xs',
            ringColor: 'ring-slate-400',
          };
        case 'cosmic':
        default:
          return {
            container: 'bg-[#0f1422]/95 border-slate-800 text-slate-100 shadow-slate-950/40',
            divider: 'bg-slate-800/70',
            label: 'text-slate-400',
            styleActive: 'bg-indigo-900/90 text-white border border-indigo-500 font-semibold shadow-xs',
            styleInactive: 'bg-slate-900/40 text-slate-400 hover:bg-slate-800/60 border border-slate-800/40',
            primaryBtn: 'bg-indigo-900/50 hover:bg-indigo-900/70 text-indigo-100 border border-indigo-700/40 shadow-2xs',
            saveBtn: 'bg-indigo-900/50 hover:bg-indigo-900/70 text-indigo-100 border border-indigo-700/40 shadow-2xs',
            commentBtn: 'bg-slate-800/70 hover:bg-slate-700/70 text-indigo-200 border border-indigo-700/30 shadow-2xs',
            ringColor: 'ring-indigo-400',
          };
      }
    } else {
      // Light Mode
      switch (theme) {
        case 'amethyst-haze':
        case 'purple':
          return {
            container: 'bg-[#fbf9fe]/90 border-purple-100/60 text-purple-950 shadow-purple-900/5',
            divider: 'bg-purple-100/40',
            label: 'text-purple-700/70',
            styleActive: 'bg-purple-200 text-purple-950 border border-purple-300 font-semibold shadow-xs',
            styleInactive: 'bg-purple-50/40 text-purple-700/60 hover:bg-purple-100/50 border border-purple-100',
            primaryBtn: 'bg-purple-50 hover:bg-purple-100/70 text-purple-900 border border-purple-200/40 shadow-2xs',
            saveBtn: 'bg-purple-50 hover:bg-purple-100/70 text-purple-900 border border-purple-200/40 shadow-2xs',
            commentBtn: 'bg-purple-50/50 hover:bg-purple-100/60 text-purple-800 border border-purple-100/50 shadow-2xs',
            ringColor: 'ring-purple-400',
          };
        case 'sage':
          return {
            container: 'bg-[#f8fbf8]/90 border-emerald-100/60 text-emerald-950 shadow-emerald-900/5',
            divider: 'bg-emerald-100/40',
            label: 'text-emerald-700/70',
            styleActive: 'bg-emerald-200 text-emerald-950 border border-emerald-300 font-semibold shadow-xs',
            styleInactive: 'bg-emerald-50/40 text-emerald-800/60 hover:bg-emerald-100/50 border border-emerald-100',
            primaryBtn: 'bg-emerald-50 hover:bg-emerald-100/70 text-emerald-950 border border-emerald-200/40 shadow-2xs',
            saveBtn: 'bg-emerald-50 hover:bg-emerald-100/70 text-emerald-950 border border-emerald-200/40 shadow-2xs',
            commentBtn: 'bg-teal-50/50 hover:bg-teal-100/60 text-teal-900 border border-teal-100/50 shadow-2xs',
            ringColor: 'ring-emerald-400',
          };
        case 'mocha':
        case 'linen':
          return {
            container: 'bg-[#fdfbf8]/90 border-amber-100/60 text-amber-950 shadow-stone-900/5',
            divider: 'bg-amber-100/40',
            label: 'text-amber-800/70',
            styleActive: 'bg-amber-200 text-amber-950 border border-amber-300 font-semibold shadow-xs',
            styleInactive: 'bg-amber-50/40 text-amber-900/60 hover:bg-amber-100/50 border border-amber-100',
            primaryBtn: 'bg-amber-50 hover:bg-amber-100/70 text-amber-950 border border-amber-200/40 shadow-2xs',
            saveBtn: 'bg-amber-50 hover:bg-amber-100/70 text-amber-950 border border-amber-200/40 shadow-2xs',
            commentBtn: 'bg-stone-50 hover:bg-stone-100/70 text-stone-800 border border-stone-200/40 shadow-2xs',
            ringColor: 'ring-amber-400',
          };
        case 'notebook':
        case 'white':
          return {
            container: 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-900/10',
            divider: 'bg-zinc-100',
            label: 'text-zinc-600',
            styleActive: 'bg-zinc-200 text-zinc-950 border border-zinc-400 font-semibold shadow-xs',
            styleInactive: 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border border-zinc-200',
            primaryBtn: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 shadow-2xs',
            saveBtn: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 shadow-2xs',
            commentBtn: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 shadow-2xs',
            ringColor: 'ring-zinc-400',
          };
        case 'slate':
        case 'slate-haze':
          return {
            container: 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/10',
            divider: 'bg-slate-100',
            label: 'text-slate-600',
            styleActive: 'bg-slate-200 text-slate-950 border border-slate-400 font-semibold shadow-xs',
            styleInactive: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200',
            primaryBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 shadow-2xs',
            saveBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 shadow-2xs',
            commentBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-2xs',
            ringColor: 'ring-slate-400',
          };
        case 'cosmic':
        default:
          return {
            container: 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/10',
            divider: 'bg-slate-100',
            label: 'text-slate-600',
            styleActive: 'bg-indigo-200 text-indigo-950 border border-indigo-300 font-semibold shadow-xs',
            styleInactive: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200',
            primaryBtn: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 shadow-2xs',
            saveBtn: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 shadow-2xs',
            commentBtn: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs',
            ringColor: 'ring-indigo-400',
          };
      }
    }
  };

  const st = getThemeStyles();

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      className={`z-50 backdrop-blur-md rounded-2xl shadow-2xl p-3 sm:p-3.5 flex flex-col gap-2.5 w-[calc(100vw-32px)] max-w-[340px] sm:w-[350px] animate-in fade-in zoom-in-95 duration-150 border box-border ${st.container}`}
    >
      {/* 1. Header Row: Tiêu đề + Nút Ẩn/Hiện highlight + Nút Xóa (Tách riêng biệt) + Nút X để đóng */}
      <div className="flex items-center justify-between gap-2 pb-0.5">
        <div className="flex items-center gap-1.5 font-bold text-xs truncate">
          <Highlighter className="w-3.5 h-3.5 shrink-0 opacity-90" />
          <span>{isEditingExisting ? 'Đổi Màu / Vệt Bút' : 'Bút Highlight'}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Nút Ẩn / Hiện Highlight (Luôn tách riêng) */}
          {onToggleHide && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onToggleHide}
              className={`flex items-center gap-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                isHighlightsHidden
                  ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold'
                  : isDark
                  ? 'bg-zinc-800/70 hover:bg-zinc-700/70 text-zinc-300 border border-zinc-700/50'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
              }`}
              title={isHighlightsHidden ? 'Hiện các vệt highlight' : 'Tạm ẩn các vệt highlight'}
            >
              {isHighlightsHidden ? (
                <>
                  <Eye className="w-3 h-3" />
                  <span>Hiện</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 opacity-75" />
                  <span>Ẩn</span>
                </>
              )}
            </button>
          )}

          {/* Nút Xóa Highlight (Tách riêng biệt, ấn 1 lần là xóa sạch không hoàn tác highlight cũ) */}
          {onRemoveHighlight && (isEditingExisting || !!selectedText) && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onRemoveHighlight}
              className={`flex items-center gap-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
              }`}
              title="Xóa highlight này (xóa hoàn toàn)"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>Xóa</span>
            </button>
          )}

          {/* Nút X đóng thanh công cụ */}
          {onClose && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                  : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'
              }`}
              title="Đóng thanh highlight (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className={`h-[1px] w-full ${st.divider}`} />

      {/* Dòng hiển thị: Đang chọn: Mấy chữ đầu của câu.... khi người dùng bấm chọn lại đoạn highlight cũ */}
      {isEditingExisting && selectedText && (
        <>
          <div
            className={`text-[11px] px-2 py-1.5 rounded-xl flex items-center gap-1.5 min-w-0 ${
              isDark
                ? 'bg-white/5 border border-white/10 text-zinc-300'
                : 'bg-black/5 border border-black/10 text-zinc-700'
            }`}
          >
            <span className={`font-bold shrink-0 text-[10.5px] uppercase tracking-wide opacity-80 ${st.label}`}>
              Đang chọn:
            </span>
            <span className="truncate italic font-medium">
              “{selectedText.trim().length > 32 ? selectedText.trim().slice(0, 30).trim() + '...' : selectedText.trim()}”
            </span>
          </div>
          <div className={`h-[1px] w-full ${st.divider}`} />
        </>
      )}

      {/* 2. Hàng chọn màu dạ quang (5 màu) */}
      <div className="flex items-center justify-between px-0.5">
        <span className={`text-[11px] font-medium ${st.label}`}>
          Màu bút
        </span>
        <div className="flex items-center gap-2">
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelectColor(c.id)}
              className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center cursor-pointer shadow-xs ${
                activeColor === c.id
                  ? `scale-120 ring-2 ${st.ringColor} ring-offset-1 dark:ring-offset-zinc-900`
                  : 'hover:scale-110 opacity-90 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.dotColor }}
              title={c.name}
            >
              {activeColor === c.id && <Check className="w-3 h-3 text-zinc-900 stroke-[3]" />}
            </button>
          ))}
        </div>
      </div>

      <div className={`h-[1px] w-full ${st.divider}`} />

      {/* 3. Hàng chọn kiểu vệt bút (Dạ quang, Tô 1/3, Gạch chân, Nét sóng) */}
      <div className="grid grid-cols-4 gap-1.5 text-[11px]">
        {[
          { id: 'classic', label: 'Dạ Quang' },
          { id: 'one_third', label: 'Tô 1/3' },
          { id: 'underline', label: 'Gạch Chân' },
          { id: 'sketch', label: 'Nét Sóng' },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelectStyle(s.id as HighlightStyle)}
            className={`py-1.5 px-1 rounded-lg font-medium transition-all text-center cursor-pointer truncate ${
              activeStyle === s.id ? st.styleActive : st.styleInactive
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={`h-[1px] w-full ${st.divider}`} />

      {/* 4. Nút hành động chính: Nếu đang sửa highlight cũ thì hiện nút Lưu (không hiện nút Highlight), nếu mới thì hiện Highlight */}
      <div className="flex items-center gap-2 pt-0.5 w-full">
        {isEditingExisting ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onSaveExistingHighlight}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold active:scale-98 ${isDark ? 'shadow-md' : 'shadow-none'} transition-all cursor-pointer truncate ${st.saveBtn}`}
            title="Lưu màu sắc và kiểu vệt bút mới cho đoạn highlight này"
          >
            <Save className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Lưu mới</span>
          </button>
        ) : (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onApplyHighlight}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold active:scale-98 ${isDark ? 'shadow-md' : 'shadow-none'} transition-all cursor-pointer truncate ${st.primaryBtn}`}
            title="Tô màu highlight cho đoạn văn bản đã chọn"
          >
            <Highlighter className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Highlight</span>
          </button>
        )}

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onOpenCommentModal}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold active:scale-98 ${isDark ? 'shadow-md' : 'shadow-none'} transition-all cursor-pointer truncate ${st.commentBtn}`}
          title="Mở hộp thoại trích dẫn bình luận"
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Trích dẫn & B.luận</span>
        </button>
      </div>
    </div>
  );
};
