import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  ClipboardPaste,
  Download,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { NovelChapter } from '../types';
import { SAMPLE_LUA_NHAU_TXT } from '../data/sampleTxtContent';

interface TxtImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  novelTitle: string;
  onApplyChapters: (chapters: NovelChapter[], mode: 'replace' | 'append') => void;
  existingChaptersCount: number;
}

export interface ParsedChapterItem {
  number: number;
  title: string;
  isExtra: boolean;
  wordCount: number;
  content: string;
}

export type SpacingNormalization = '1-line' | '2-lines' | 'original';

export const cleanParagraphSpacing = (text: string, mode: SpacingNormalization = '1-line'): string => {
  if (mode === 'original') return text;

  // 1. Normalize line breaks (\r\n -> \n)
  let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Remove whitespace from lines that only have spaces/tabs
  normalized = normalized.replace(/^[ \t]+$/gm, '');

  // 3. Detect if the text lacks double newlines (paragraphs separated only by single \n)
  const doubleCount = (normalized.match(/\n\s*\n/g) || []).length;
  const singleCount = (normalized.match(/\n/g) || []).length;
  const isSingleSpaced = doubleCount === 0 || (singleCount > 5 && doubleCount < singleCount * 0.15);

  if (isSingleSpaced) {
    const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean);
    if (mode === '1-line') {
      return lines.join('\n\n');
    } else if (mode === '2-lines') {
      return lines.join('\n\n\n');
    }
  }

  if (mode === '1-line') {
    // Collapse 3 or more newlines down to 2 newlines (meaning exactly 1 blank line / 1 ô between paragraphs)
    normalized = normalized.replace(/\n{3,}/g, '\n\n').trim();
  } else if (mode === '2-lines') {
    // 2 blank lines (3 newlines)
    normalized = normalized.replace(/\n{2,}/g, '\n\n\n').trim();
  }

  return normalized;
};

export const parseTxtNovelContent = (
  rawText: string,
  startingChapterNum = 1,
  spacingMode: SpacingNormalization = '1-line'
): ParsedChapterItem[] => {
  if (!rawText || !rawText.trim()) return [];

  // Normalize line breaks
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Regex pattern matching Vietnamese novel chapters:
  // Examples:
  // "Chương 1: Tiêu đề"
  // "Chương 1. Tiêu đề"
  // "Chương 1"
  // Regex pattern matching Vietnamese novel chapters:
  // Chuẩn hóa ký tự khoảng trắng lạ, BOM, và ngắt dòng
  const normalizedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');

  // "Chương 1: Tiêu đề", "Chương 1", "Chương 01 - Tiêu đề", "[Chương 68]", "(Chương 69)", "【Chương 68】"
  // "Chapter 1: ...", "Hồi 1: ..."
  // "Ngoại truyện 1: Tiêu đề", "Phiên ngoại 1: ...", "PN 1", "[Ngoại truyện 1]"
  const chapterHeaderRegex =
    /(?:^|\n)[^\S\r\n]*[\[(【]?\s*(((?:(?:Q|Quyển|Tập)\s*\d+[\s:.-]+)?(?:Chương|Chapter|Hồi)\s*\d+|(?:Ngoại\s*truyện|Phiên\s*ngoại|Ngoại\s*văn|PN)(?:\s*\d+)?)\s*[\])】]?(?:[^\S\r\n]*[:.\-_–—]+[^\S\r\n]*([^\r\n]*))?)/gi;

  const matches: { index: number; fullMatch: string; headerText: string; isExtra: boolean; chapNum?: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = chapterHeaderRegex.exec(normalizedText)) !== null) {
    const rawHeader = match[1].trim();
    const isExtra =
      /^[\[(【]?\s*(?:Ngoại\s*truyện|Phiên\s*ngoại|Ngoại\s*văn|PN)/i.test(rawHeader) ||
      rawHeader.toLowerCase().includes('ngoại truyện') ||
      rawHeader.toLowerCase().includes('phiên ngoại');
    const numMatch = rawHeader.match(/\d+/);
    const numPart = numMatch ? parseInt(numMatch[0], 10) : undefined;

    matches.push({
      index: match.index + (match[0].startsWith('\n') ? 1 : 0),
      fullMatch: match[0],
      headerText: rawHeader,
      isExtra,
      chapNum: numPart,
    });
  }

  // If no chapter headers were detected with standard regex, try fallback line-by-line heuristic
  if (matches.length === 0) {
    // Fallback: split by large section separators like "---" or "====" or double line breaks with short titles
    const sections = normalizedText.split(/\n\s*[-=_*]{3,}\s*\n/);
    if (sections.length > 1) {
      return sections.map((sec, idx) => {
        const lines = sec.trim().split('\n');
        const firstLine = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        const isExtra = /ngoại\s*truyện|phiên\s*ngoại/i.test(firstLine);
        const cleanedContent = cleanParagraphSpacing(content, spacingMode);
        return {
          number: startingChapterNum + idx,
          title: firstLine || `Chương ${startingChapterNum + idx}`,
          isExtra,
          wordCount: cleanedContent.split(/\s+/).filter(Boolean).length,
          content: cleanedContent || firstLine,
        };
      });
    }

    // Default to single chapter if text exists
    const trimmed = normalizedText.trim();
    const cleanedTrimmed = cleanParagraphSpacing(trimmed, spacingMode);
    return [
      {
        number: startingChapterNum,
        title: `Chương ${startingChapterNum}: Mở đầu`,
        isExtra: false,
        wordCount: cleanedTrimmed.split(/\s+/).filter(Boolean).length,
        content: cleanedTrimmed,
      },
    ];
  }

  const parsedList: ParsedChapterItem[] = [];

  for (let i = 0; i < matches.length; i++) {
    const curr = matches[i];
    const startIndex = curr.index;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : normalizedText.length;

    const fullChapterSegment = normalizedText.slice(startIndex, endIndex).trim();
    const lines = fullChapterSegment.split('\n');
    const titleLine = lines[0].trim();
    const contentLines = lines.slice(1).join('\n').trim();
    const cleanedContent = cleanParagraphSpacing(contentLines, spacingMode);

    const words = cleanedContent.split(/\s+/).filter(Boolean).length;
    parsedList.push({
      number: startingChapterNum + i,
      title: titleLine,
      isExtra: curr.isExtra,
      wordCount: words,
      content: cleanedContent || '(Nội dung chương)',
    });
  }

  // User rule: những chương không có tên là: Chương [số] mà là một đoạn văn bản dài,
  // thì hãy gộp nội dung chương đó vào chương phía trước nó, rồi xóa chương có tên văn bản dài đi.
  // Đừng đụng gì vào ngoại truyện.
  const cleanedChapters: ParsedChapterItem[] = [];
  for (const item of parsedList) {
    const isExtra =
      item.isExtra === true ||
      /^[\[(【]?\s*(?:Ngoại\s*truyện|Phiên\s*ngoại|Ngoại\s*văn|PN)/i.test(item.title.trim()) ||
      item.title.toLowerCase().includes('ngoại truyện') ||
      item.title.toLowerCase().includes('phiên ngoại');

    if (isExtra) {
      cleanedChapters.push({ ...item, isExtra: true });
      continue;
    }

    const trimmedTitle = item.title.trim();
    const isValidChapterTitle =
      /^[\[(【]?\s*(?:(?:Q|Quyển|Tập)\s*\d+[\s:.-]+)?(?:Chương|Chapter|Hồi)\s*\d+/i.test(trimmedTitle) ||
      /^\d+[\s:.-]/.test(trimmedTitle);
    const isLongTextTitle = trimmedTitle.length > 55 && !isValidChapterTitle;

    if (!isValidChapterTitle || isLongTextTitle) {
      // Merge into previous chapter if available
      if (cleanedChapters.length > 0) {
        const prev = cleanedChapters[cleanedChapters.length - 1];
        const mergedText = prev.content + '\n\n' + item.title + '\n\n' + item.content;
        cleanedChapters[cleanedChapters.length - 1] = {
          ...prev,
          content: mergedText,
          wordCount: mergedText.split(/\s+/).filter(Boolean).length,
        };
      }
      // Omit item (deleted)
      continue;
    }

    cleanedChapters.push(item);
  }

  // Renumber main chapters cleanly, keeping extra chapters untouched
  let nextMainNum = startingChapterNum;
  return cleanedChapters.map((chap) => {
    if (chap.isExtra) return chap;
    return {
      ...chap,
      number: nextMainNum++,
    };
  });
};

export const TxtImportModal: React.FC<TxtImportModalProps> = ({
  isOpen,
  onClose,
  novelTitle,
  onApplyChapters,
  existingChaptersCount,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [rawLoadedText, setRawLoadedText] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedChapters, setParsedChapters] = useState<ParsedChapterItem[]>([]);
  const [mode, setMode] = useState<'replace' | 'append'>('replace');
  const [spacingMode, setSpacingMode] = useState<SpacingNormalization>('1-line');
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSpacingChange = (newMode: SpacingNormalization) => {
    setSpacingMode(newMode);
    if (rawLoadedText) {
      setParsedChapters(parseTxtNovelContent(rawLoadedText, 1, newMode));
    } else if (pastedText) {
      setParsedChapters(parseTxtNovelContent(pastedText, 1, newMode));
    }
  };

  const handleDownloadCleanedTxt = () => {
    if (parsedChapters.length === 0) return;
    const textToDownload = parsedChapters
      .map((c) => `${c.title}\n\n${c.content}`)
      .join('\n\n\n');

    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName ? fileName.replace(/\.txt$/i, '_1_o.txt') : `${novelTitle}_chuan_hoa_1_o.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawLoadedText(content);
        const parsed = parseTxtNovelContent(content, 1, spacingMode);
        setParsedChapters(parsed);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setIsProcessing(false);
      alert('Không thể đọc tệp TXT. Vui lòng kiểm tra lại định dạng tệp!');
    };
    reader.readAsText(file, 'utf-8');
  };

  const handlePasteProcess = () => {
    if (!pastedText.trim()) return;
    setRawLoadedText(pastedText);
    setIsProcessing(true);
    setTimeout(() => {
      const parsed = parseTxtNovelContent(pastedText, 1, spacingMode);
      setParsedChapters(parsed);
      setIsProcessing(false);
    }, 200);
  };

  const handleApply = () => {
    if (parsedChapters.length === 0) return;

    const formattedChapters: NovelChapter[] = parsedChapters.map((item, idx) => ({
      id: `c-imp-${Date.now()}-${idx + 1}`,
      chapterNumber: mode === 'append' ? existingChaptersCount + idx + 1 : idx + 1,
      title: item.title,
      wordCount: item.wordCount,
      views: 0,
      publishedAt: new Date().toISOString().split('T')[0],
      isExtra: item.isExtra,
      content: item.content,
    }));

    onApplyChapters(formattedChapters, mode);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
    }, 1200);
  };

  const mainChaptersCount = parsedChapters.filter((c) => !c.isExtra).length;
  const extraChaptersCount = parsedChapters.filter((c) => c.isExtra).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-[#0f111a] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl z-10 my-6 overflow-hidden text-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Nhập Chương Từ Tệp TXT</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono">
                    Tự động chia chương & ngoại truyện
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Bộ truyện: <span className="font-semibold text-slate-200">{novelTitle}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selector: Upload File or Paste Text */}
          <div className="flex items-center gap-2 mt-4 p-1 bg-white/5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Tải tệp tin (.txt)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ClipboardPaste className="w-4 h-4" />
              <span>Dán văn bản trực tiếp</span>
            </button>
          </div>

          {/* Body */}
          <div className="mt-4 space-y-4">
            {activeTab === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt,text/plain"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.name.endsWith('.txt')) {
                      setFileName(file.name);
                      setIsProcessing(true);
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        if (content) {
                          setRawLoadedText(content);
                          setParsedChapters(parseTxtNovelContent(content, 1, spacingMode));
                        }
                        setIsProcessing(false);
                      };
                      reader.readAsText(file, 'utf-8');
                    }
                  }}
                  className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400/80 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all"
                >
                  <Upload className="w-9 h-9 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">
                    {fileName ? `Đã chọn: ${fileName}` : 'Kéo thả tệp .txt vào đây hoặc bấm để chọn tệp'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Hệ thống sẽ tự động quét các tiêu đề như <span className="text-emerald-300">"Chương 1:"</span>,{' '}
                    <span className="text-emerald-300">"Ngoại truyện 1:"</span> để phân loại chính văn và ngoại truyện.
                  </p>
                </div>

                {/* Quick Sample Action */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setFileName('sample_lua_nhau.txt');
                      setRawLoadedText(SAMPLE_LUA_NHAU_TXT);
                      setIsProcessing(true);
                      setTimeout(() => {
                        const parsed = parseTxtNovelContent(SAMPLE_LUA_NHAU_TXT, 1, spacingMode);
                        setParsedChapters(parsed);
                        setIsProcessing(false);
                      }, 150);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-semibold cursor-pointer transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Nạp tệp TXT mẫu "Lừa Nhau" (10 Chương dịch chuẩn)</span>
                  </button>

                  <a
                    href="/sample_lua_nhau.txt"
                    download="lua_nhau_sample.txt"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tải tệp .txt mẫu</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Dán nội dung toàn bộ truyện (bao gồm các dòng Chương 1..., Chương 2..., Ngoại truyện 1...) vào đây..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-slate-200 focus:outline-hidden focus:border-emerald-500 resize-none font-mono"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handlePasteProcess}
                    disabled={!pastedText.trim() || isProcessing}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer transition-all"
                  >
                    Phân Tích Chương
                  </button>
                </div>
              </div>
            )}

            {/* Parsed Results Overview */}
            {parsedChapters.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Phân tích thành công: {parsedChapters.length} phần
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Chính văn: {mainChaptersCount}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Ngoại truyện: {extraChaptersCount}
                    </span>
                  </div>
                </div>

                {/* Paragraph Spacing Normalization Options */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">
                        Khoảng cách giữa các đoạn:
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {spacingMode === '1-line'
                          ? 'Đã tự động thu gọn 2 ô thừa về 1 ô chuẩn'
                          : spacingMode === '2-lines'
                          ? 'Đang giữ 2 dòng trống cách đoạn'
                          : 'Giữ nguyên khoảng trống từ tệp gốc'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {[
                        { id: '1-line', label: '1 ô (Chuẩn)', title: 'Thu gọn các đoạn cách nhau 2 ô về đúng 1 ô chuẩn' },
                        { id: '2-lines', label: '2 ô (Rộng)', title: 'Giữ cách 2 dòng trống giữa các đoạn' },
                        { id: 'original', label: 'Gốc', title: 'Giữ nguyên tệp TXT' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSpacingChange(item.id as SpacingNormalization)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                            spacingMode === item.id
                              ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                          }`}
                          title={item.title}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cleaned text download button */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px]">
                    <span className="text-slate-400">
                      Cần lưu tệp TXT sạch về máy tính?
                    </span>
                    <button
                      type="button"
                      onClick={handleDownloadCleanedTxt}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold cursor-pointer transition-all"
                      title="Tải về tệp .txt đã chuẩn hóa về máy"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải về tệp .txt đã chuẩn hóa (1 ô)</span>
                    </button>
                  </div>
                </div>

                {/* Import Mode Options */}
                <div className="flex items-center gap-4 text-xs pt-1 border-t border-white/10">
                  <span className="text-slate-400 font-medium">Chế độ nhập:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={mode === 'replace'}
                      onChange={() => setMode('replace')}
                      className="accent-emerald-500"
                    />
                    <span>Thay thế toàn bộ ({parsedChapters.length} chương mới)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={mode === 'append'}
                      onChange={() => setMode('append')}
                      className="accent-emerald-500"
                    />
                    <span>Nối tiếp vào sau ({existingChaptersCount} chương cũ)</span>
                  </label>
                </div>

                {/* Chapter List Preview (Scrollable) */}
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {parsedChapters.slice(0, 15).map((chap, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                            chap.isExtra
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {chap.isExtra ? 'Ngoại truyện' : `Chương ${chap.number}`}
                        </span>
                        <span className="truncate text-slate-200 font-medium">{chap.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">{chap.wordCount.toLocaleString()} chữ</span>
                    </div>
                  ))}
                  {parsedChapters.length > 15 && (
                    <p className="text-[11px] text-center text-slate-400 italic py-1">
                      ... và {parsedChapters.length - 15} chương khác
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Tutorial for Fixing TXT File directly on Computer */}
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Mẹo: Cách sửa tệp .txt trên máy tính từ 2 ô thành 1 ô (Notepad, Word, VS Code)</span>
                </span>
                {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showGuide && (
                <div className="p-3 text-xs text-slate-300 border-t border-white/10 bg-black/30 space-y-2">
                  <p className="font-semibold text-amber-300">
                    Nếu bạn muốn chỉnh sửa tệp .txt gốc trên máy tính của mình nhanh chóng:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
                      <p className="font-bold text-white">1. Dùng Microsoft Word</p>
                      <ol className="list-decimal list-inside space-y-1 text-slate-300">
                        <li>Mở tệp TXT bằng Word, nhấn <kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-[10px]">Ctrl + H</kbd>.</li>
                        <li>Ô <strong>Find what</strong> nhập: <code className="text-amber-300 font-mono">^p^p^p</code></li>
                        <li>Ô <strong>Replace with</strong> nhập: <code className="text-emerald-300 font-mono">^p^p</code></li>
                        <li>Bấm <strong>Replace All</strong> vài lần để gom hết dòng thừa.</li>
                      </ol>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
                      <p className="font-bold text-white">2. Dùng Notepad++ hoặc VS Code</p>
                      <ol className="list-decimal list-inside space-y-1 text-slate-300">
                        <li>Mở tệp, nhấn <kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-[10px]">Ctrl + H</kbd>.</li>
                        <li>Bật biểu tượng Regex <code className="text-amber-300 font-mono">.*</code>.</li>
                        <li>Ô <strong>Find</strong> nhập: <code className="text-amber-300 font-mono">\n&#123;3,&#125;</code></li>
                        <li>Ô <strong>Replace</strong> nhập: <code className="text-emerald-300 font-mono">\n\n</code></li>
                        <li>Bấm <strong>Replace All</strong> và lưu lại.</li>
                      </ol>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-300 italic">
                    💡 Bạn cũng có thể tải tệp lên đây và bấm "Tải về tệp .txt đã chuẩn hóa (1 ô)" để tải ngay tệp sạch về máy mà không cần làm thủ công!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="button"
              disabled={parsedChapters.length === 0 || isProcessing}
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              {appliedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Đã cập nhật thành công!</span>
                </>
              ) : (
                <>
                  <span>Cập nhật vào bộ truyện</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
