import { safeStorage } from './safeStorage';

export type HighlightColor = 'yellow' | 'pink' | 'mint' | 'purple' | 'sky';
export type HighlightStyle = 'classic' | 'one_third' | 'underline' | 'sketch';

export interface UserBookHighlight {
  id: string;
  novelId: string;
  chapterNumber: number;
  paragraphIndex: number;
  selectedText: string;
  color: HighlightColor;
  style?: HighlightStyle;
  createdAt: number;
  personalNote?: string;
}

export interface HighlightColorDef {
  id: HighlightColor;
  name: string;
  hex: string;
  dotColor: string;
  markLight: string;
  markDark: string;
  underlineColor: string;
}

export const HIGHLIGHT_COLORS: HighlightColorDef[] = [
  {
    id: 'yellow' as HighlightColor,
    name: 'Vàng Pastel',
    // Vệt bút dạ quang nhạt hơn, nằm thấp xuống (từ 22% đến 90%), có kẽ hở giữa các dòng
    markLight:
      '[background:linear-gradient(180deg,transparent_22%,rgba(254,240,138,0.48)_22%,rgba(253,224,71,0.38)_90%,transparent_90%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    markDark:
      '[background:linear-gradient(180deg,transparent_22%,rgba(250,204,21,0.22)_22%,rgba(234,179,8,0.18)_90%,transparent_90%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    underlineColor: 'decoration-amber-300/80 underline underline-offset-4 decoration-2',
    dotColor: '#fde047',
    hex: '#fde047',
  },
  {
    id: 'pink' as HighlightColor,
    name: 'Hồng Pastel',
    markLight:
      '[background:linear-gradient(180deg,transparent_22%,rgba(251,207,232,0.48)_22%,rgba(244,114,182,0.38)_90%,transparent_90%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    markDark:
      '[background:linear-gradient(180deg,transparent_22%,rgba(244,114,182,0.22)_22%,rgba(236,72,153,0.18)_90%,transparent_90%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    underlineColor: 'decoration-pink-300/80 underline underline-offset-4 decoration-2',
    dotColor: '#f9a8d4',
    hex: '#f472b6',
  },
  {
    id: 'mint' as HighlightColor,
    name: 'Xanh Bạc Hà',
    markLight:
      '[background:linear-gradient(180deg,transparent_22%,rgba(187,247,208,0.48)_22%,rgba(110,231,183,0.38)_90%,transparent_90%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    markDark:
      '[background:linear-gradient(180deg,transparent_22%,rgba(74,222,128,0.22)_22%,rgba(52,211,153,0.18)_90%,transparent_90%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    underlineColor: 'decoration-emerald-300/80 underline underline-offset-4 decoration-2',
    dotColor: '#86efac',
    hex: '#6ee7b7',
  },
  {
    id: 'purple' as HighlightColor,
    name: 'Tím Pastel',
    markLight:
      '[background:linear-gradient(180deg,transparent_22%,rgba(233,213,255,0.48)_22%,rgba(192,132,252,0.38)_90%,transparent_90%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    markDark:
      '[background:linear-gradient(180deg,transparent_22%,rgba(192,132,252,0.22)_22%,rgba(168,85,247,0.18)_90%,transparent_90%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    underlineColor: 'decoration-purple-300/80 underline underline-offset-4 decoration-2',
    dotColor: '#d8b4fe',
    hex: '#c084fc',
  },
  {
    id: 'sky' as HighlightColor,
    name: 'Xanh Lam',
    markLight:
      '[background:linear-gradient(180deg,transparent_22%,rgba(186,230,253,0.48)_22%,rgba(125,211,252,0.38)_90%,transparent_90%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    markDark:
      '[background:linear-gradient(180deg,transparent_22%,rgba(56,189,248,0.22)_22%,rgba(14,165,233,0.18)_90%,transparent_90%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    underlineColor: 'decoration-sky-300/80 underline underline-offset-4 decoration-2',
    dotColor: '#7dd3fc',
    hex: '#38bdf8',
  },
];

export const HIGHLIGHT_COLOR_VALUES: Record<HighlightColor, { name: string; hex: string; dot: string }> = {
  yellow: { name: 'Vàng Pastel', hex: '#fde047', dot: '#fde047' },
  pink: { name: 'Hồng Pastel', hex: '#f472b6', dot: '#f9a8d4' },
  mint: { name: 'Bạc Hà', hex: '#6ee7b7', dot: '#86efac' },
  purple: { name: 'Tím Pastel', hex: '#c084fc', dot: '#d8b4fe' },
  sky: { name: 'Xanh Lam', hex: '#38bdf8', dot: '#7dd3fc' },
};

export interface HighlightStyleDef {
  id: HighlightStyle;
  name: string;
  description: string;
}

export const HIGHLIGHT_STYLES: HighlightStyleDef[] = [
  { id: 'classic', name: 'Dạ Quang Cổ Điển', description: 'Vệt bút dạ quang rộng bao phủ dòng chữ' },
  { id: 'one_third', name: 'Vệt Dưới 1/3', description: 'Vệt bút mảnh thanh thoát nâng đỡ dòng chữ' },
  { id: 'underline', name: 'Gạch Chân Liền', description: 'Đường kẻ chân pastel thanh lịch đa dòng' },
  { id: 'sketch', name: 'Nét Sóng Uốn Lượn', description: 'Đồ họa vector SVG sóng Bézier tự nhiên' },
];

export function getHighlightRenderClasses(
  color: HighlightColor,
  style: HighlightStyle = 'classic',
  isDark: boolean = false
): string {
  const colorDef = HIGHLIGHT_COLORS.find((c) => c.id === color) || HIGHLIGHT_COLORS[0];

  if (style === 'one_third') {
    if (isDark) {
      switch (color) {
        case 'pink':
          return '[background:linear-gradient(180deg,transparent_65%,rgba(244,114,182,0.32)_65%,rgba(236,72,153,0.28)_92%,transparent_92%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
        case 'mint':
          return '[background:linear-gradient(180deg,transparent_65%,rgba(74,222,128,0.32)_65%,rgba(52,211,153,0.28)_92%,transparent_92%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
        case 'purple':
          return '[background:linear-gradient(180deg,transparent_65%,rgba(192,132,252,0.32)_65%,rgba(168,85,247,0.28)_92%,transparent_92%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
        case 'sky':
          return '[background:linear-gradient(180deg,transparent_65%,rgba(56,189,248,0.32)_65%,rgba(14,165,233,0.28)_92%,transparent_92%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
        default:
          return '[background:linear-gradient(180deg,transparent_65%,rgba(250,204,21,0.32)_65%,rgba(234,179,8,0.28)_92%,transparent_92%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
      }
    } else {
      switch (color) {
        case 'pink':
          return '[background:linear-gradient(180deg,transparent_65%,rgba(244,114,182,0.18)_65%,rgba(244,114,182,0.11)_92%,transparent_92%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
        case 'mint':
          return '[background:linear-gradient(180deg,transparent_65%,rgba(52,211,153,0.18)_65%,rgba(52,211,153,0.11)_92%,transparent_92%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
        case 'purple':
          return '[background:linear-gradient(180deg,transparent_65%,rgba(192,132,252,0.18)_65%,rgba(192,132,252,0.11)_92%,transparent_92%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
        case 'sky':
          return '[background:linear-gradient(180deg,transparent_65%,rgba(56,189,248,0.18)_65%,rgba(56,189,248,0.11)_92%,transparent_92%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
        default:
          return '[background:linear-gradient(180deg,transparent_65%,rgba(253,224,71,0.20)_65%,rgba(253,224,71,0.13)_92%,transparent_92%)] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
      }
    }
  }

  if (style === 'underline') {
    return isDark
      ? `highlight-underline-base highlight-underline-${color}-dark`
      : `highlight-underline-base highlight-underline-${color}-light`;
  }

  if (style === 'sketch') {
    return isDark
      ? `highlight-sketch-base highlight-sketch-${color}-dark`
      : `highlight-sketch-base highlight-sketch-${color}-light`;
  }

  // Classic
  return isDark ? colorDef.markDark : colorDef.markLight;
}

// Storage helpers
export function getChapterHighlightsStorageKey(novelId: string, chapterNumber: number): string {
  return `cosmo_highlights_${novelId}_ch${chapterNumber}`;
}

export function loadChapterHighlights(novelId: string, chapterNumber: number): UserBookHighlight[] {
  try {
    const raw = safeStorage.getItem(getChapterHighlightsStorageKey(novelId, chapterNumber));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Khử trùng lặp triệt để: loại bỏ các bản ghi trùng lặp văn bản trong cùng đoạn văn
    const uniqueMap = new Map<string, UserBookHighlight>();
    for (const hl of parsed) {
      if (!hl || !hl.selectedText) continue;
      const key = `${hl.paragraphIndex}_${hl.selectedText.trim()}`;
      uniqueMap.set(key, hl);
    }
    return Array.from(uniqueMap.values());
  } catch {
    return [];
  }
}

export function saveChapterHighlights(novelId: string, chapterNumber: number, list: UserBookHighlight[]): void {
  try {
    // Luôn khử trùng lặp trước khi lưu để đảm bảo không lưu đè highlight cũ
    const uniqueMap = new Map<string, UserBookHighlight>();
    for (const hl of list) {
      if (!hl || !hl.selectedText) continue;
      const key = `${hl.paragraphIndex}_${hl.selectedText.trim()}`;
      uniqueMap.set(key, hl);
    }
    const cleanList = Array.from(uniqueMap.values());
    safeStorage.setItem(getChapterHighlightsStorageKey(novelId, chapterNumber), JSON.stringify(cleanList));
  } catch {}
}

export interface ParsedCommentQuote {
  hasQuote: boolean;
  quoteText: string;
  commentBody: string;
}

export function parseCommentContent(content: string): ParsedCommentQuote {
  if (!content) return { hasQuote: false, quoteText: '', commentBody: '' };
  
  const text = content.trim();

  // Pattern 1: Starts with “... quotes
  if (text.startsWith('“')) {
    const endIdx = text.indexOf('”');
    if (endIdx !== -1) {
      const quote = text.substring(1, endIdx).trim();
      const rest = text.substring(endIdx + 1).trim();
      return {
        hasQuote: true,
        quoteText: quote,
        commentBody: rest,
      };
    }
  }

  // Pattern 2: Starts with "..." quotes
  if (text.startsWith('"')) {
    const endIdx = text.indexOf('"', 1);
    if (endIdx !== -1) {
      const quote = text.substring(1, endIdx).trim();
      const rest = text.substring(endIdx + 1).trim();
      return {
        hasQuote: true,
        quoteText: quote,
        commentBody: rest,
      };
    }
  }

  return {
    hasQuote: false,
    quoteText: '',
    commentBody: text,
  };
}
