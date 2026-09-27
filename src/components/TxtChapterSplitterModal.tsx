import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  UploadCloud,
  FileText,
  Layers,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  Plus,
} from 'lucide-react';
import {
  readTextFileWithEncoding,
  splitTextIntoChapters,
  ParsedChapter,
} from '../utils/txtChapterParser';
import { saveChaptersToFirestore } from '../services/firebase';

interface TxtChapterSplitterModalProps {
  isOpen: boolean;
  onClose: () => void;
  truyenId: string;
  truyenTitle: string;
  parentNovelMeta?: {
    tenTruyen?: string;
    moTa?: string;
    anhBia?: string;
    theLoai?: string;
    tacGia?: string;
  };
  onSaveSuccess?: (count: number) => void;
}

export const TxtChapterSplitterModal: React.FC<TxtChapterSplitterModalProps> = ({
  isOpen,
  onClose,
  truyenId,
  truyenTitle,
  parentNovelMeta,
  onSaveSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [rawFileText, setRawFileText] = useState<string>('');
  const [autoParagraphSpacing, setAutoParagraphSpacing] = useState<boolean>(true);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedChapters, setParsedChapters] = useState<ParsedChapter[]>([]);
  const [expandedChapterIndex, setExpandedChapterIndex] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setFileName(file.name);
    setFileSize(file.size);
    setIsReadingFile(true);

    try {
      // 1. Đọc file bằng FileReader và tự động convert encoding về UTF-8
      const text = await readTextFileWithEncoding(file);
      if (!text || text.trim().length === 0) {
        setErrorMsg('File .txt rỗng, vui lòng chọn file có nội dung!');
        setIsReadingFile(false);
        return;
      }

      setRawFileText(text);

      // 2. Tự động tách chương bằng regex định dạng "Chương [số]" kết hợp giãn cách đoạn văn
      const chapters = splitTextIntoChapters(text, autoParagraphSpacing);
      if (chapters.length === 0) {
        setErrorMsg('Không tìm thấy chương nào trong file. Đảm bảo file có các dòng tiêu đề định dạng "Chương [số]".');
      } else {
        setParsedChapters(chapters);
      }
    } catch (err: any) {
      console.error('Error reading/splitting file:', err);
      setErrorMsg('Lỗi khi đọc file .txt. Vui lòng kiểm tra định dạng file!');
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleToggleAutoSpacing = () => {
    const nextState = !autoParagraphSpacing;
    setAutoParagraphSpacing(nextState);
    if (rawFileText && rawFileText.trim().length > 0) {
      const reParsed = splitTextIntoChapters(rawFileText, nextState);
      setParsedChapters(reParsed);
    }
  };

  const handleUpdateTitle = (index: number, newTitle: string) => {
    setParsedChapters((prev) =>
      prev.map((c, i) => (i === index ? { ...c, tieuDe: newTitle } : c))
    );
  };

  const handleUpdateNumber = (index: number, newNum: number) => {
    setParsedChapters((prev) =>
      prev.map((c, i) => (i === index ? { ...c, soThuTu: newNum } : c))
    );
  };

  const handleDeleteChapter = (index: number) => {
    setParsedChapters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveToFirestore = async () => {
    if (parsedChapters.length === 0) {
      setErrorMsg('Chưa có chương nào để lưu!');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSaving(true);

    try {
      const savedCount = await saveChaptersToFirestore(
        truyenId,
        parsedChapters.map((c) => ({
          soThuTu: c.soThuTu,
          tieuDe: c.tieuDe,
          noiDung: c.noiDung,
        })),
        parentNovelMeta
      );

      setSuccessMsg(`Đã lưu thành công ${savedCount} chương vào Firestore sub-collection truyen/${truyenId}/chuong!`);
      setTimeout(() => {
        onSaveSuccess?.(savedCount);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Error saving chapters to Firestore:', err);
      setErrorMsg(err?.message || 'Lỗi khi lưu chương vào Firestore. Vui lòng thử lại!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
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
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl text-zinc-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Tách & Upload Chương từ File .txt</h2>
                <p className="text-xs text-zinc-400">
                  Truyện: <span className="text-purple-300 font-semibold">{truyenTitle}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-700/50 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* File Upload Trigger */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 hover:border-purple-500/80 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-zinc-800/30 hover:bg-zinc-800/60 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div className="text-sm font-bold text-white mb-1">
                {fileName ? `File đã chọn: ${fileName}` : 'Bấm vào đây để chọn file .txt từ máy tính'}
              </div>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Hệ thống tự động phát hiện mã UTF-8 tránh lỗi font tiếng Việt và tách chương tự động theo dòng có định dạng &quot;Chương [số]&quot;.
              </p>

              {fileSize > 0 && (
                <div className="mt-2 text-[11px] text-purple-300 font-mono">
                  Dung lượng: {(fileSize / 1024).toFixed(1)} KB
                </div>
              )}
            </div>

            {/* Tùy chọn xử lý khoảng cách đoạn cho file TXT dính dòng */}
            <div className="p-3.5 rounded-2xl bg-zinc-850/80 border border-zinc-750 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Tự động thêm dòng trống cách đoạn</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                    Khuyên Dùng
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Dành cho tệp .txt không có khoảng cách dòng giữa các đoạn. Hệ thống sẽ tự động chèn dòng trống để tính năng cách đoạn và thụt đầu dòng hiển thị chuẩn xác khi đọc.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleAutoSpacing}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  autoParagraphSpacing
                    ? 'bg-purple-950/70 text-purple-300 border-purple-600 shadow-sm shadow-purple-900/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                }`}
                title="Bấm để bật / tắt tự động cách đoạn"
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${autoParagraphSpacing ? 'text-purple-400' : 'text-zinc-500'}`} />
                <span>{autoParagraphSpacing ? 'Đang bật' : 'Tắt'}</span>
              </button>
            </div>

            {/* Loading Indicator */}
            {isReadingFile && (
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-center gap-3 text-purple-200 text-xs">
                <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                <span>Đang đọc file và tự động tách các chương...</span>
              </div>
            )}

            {/* Parsed Chapters Preview List */}
            {parsedChapters.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-white">
                      Danh Sách Xem Trước ({parsedChapters.length} chương đã tách)
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">
                    Bạn có thể chỉnh sửa lại tiêu đề hoặc số thứ tự trước khi lưu
                  </span>
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {parsedChapters.map((chap, idx) => {
                    const isExpanded = expandedChapterIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/80 hover:border-zinc-600 transition-colors space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          {/* Số thứ tự */}
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[11px] text-zinc-400">STT:</span>
                            <input
                              type="number"
                              value={chap.soThuTu}
                              onChange={(e) => handleUpdateNumber(idx, parseInt(e.target.value, 10) || 0)}
                              className="w-14 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-white text-center font-bold"
                            />
                          </div>

                          {/* Tiêu đề chương editable */}
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={chap.tieuDe}
                              onChange={(e) => handleUpdateTitle(idx, e.target.value)}
                              placeholder="Tiêu đề chương..."
                              className="w-full px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-white font-medium focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setExpandedChapterIndex(isExpanded ? null : idx)}
                              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700"
                              title={isExpanded ? 'Thu gọn nội dung' : 'Xem trước nội dung'}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteChapter(idx)}
                              className="p-1 rounded-md text-red-400 hover:text-red-300 hover:bg-red-950/40"
                              title="Xóa chương này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Preview snippet or full content */}
                        <div className="text-[11.5px] text-zinc-400 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800">
                          {isExpanded ? (
                            <div className="max-h-48 overflow-y-auto whitespace-pre-wrap font-serif text-zinc-300 leading-relaxed text-xs">
                              {chap.noiDung}
                            </div>
                          ) : (
                            <p className="line-clamp-2 leading-relaxed">
                              {chap.previewSnippet || '(Nội dung chương rỗng)'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between shrink-0">
            <div className="text-xs text-zinc-400">
              {parsedChapters.length > 0
                ? `Đã sẵn sàng lưu ${parsedChapters.length} chương vào Firestore`
                : 'Hãy chọn file .txt để xem trước các chương'}
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleSaveToFirestore}
                disabled={isSaving || parsedChapters.length === 0}
                className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Lưu {parsedChapters.length} Chương Vào Firestore</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
