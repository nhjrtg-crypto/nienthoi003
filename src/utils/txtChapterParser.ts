export interface ParsedChapter {
  soThuTu: number;
  tieuDe: string;
  noiDung: string;
  previewSnippet: string;
}

/**
 * Đọc file .txt với khả năng tự động phát hiện encoding (UTF-8, UTF-16, Windows-1258)
 * để tránh lỗi font chữ tiếng Việt có dấu.
 */
export async function readTextFileWithEncoding(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // 1. Kiểm tra Byte Order Mark (BOM)
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(bytes.slice(3));
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(bytes.slice(2));
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder('utf-16be').decode(bytes.slice(2));
  }

  // 2. Thử decode bằng UTF-8 chuẩn (strict mode)
  try {
    const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
    return utf8Decoder.decode(bytes);
  } catch {
    // Nếu có lỗi byte UTF-8 không hợp lệ, thử Windows-1258 (tiếng Việt) hoặc ISO-8859-1
    try {
      return new TextDecoder('windows-1258').decode(bytes);
    } catch {
      // Fallback cuối cùng sang UTF-8 non-fatal
      return new TextDecoder('utf-8').decode(bytes);
    }
  }
}

/**
 * Tự động định dạng văn bản thành các đoạn văn có dòng trống ngăn cách
 * nếu file gốc dính liền dòng và không có khoảng cách đoạn.
 */
export function formatParagraphsText(rawLines: string[], autoAddSpacing = true): string {
  const cleanedLines = rawLines.map((l) => l.trim()).filter(Boolean);
  if (cleanedLines.length === 0) return '';

  if (!autoAddSpacing) {
    return rawLines.join('\n').trim();
  }

  // Đếm số dòng trống có sẵn trong rawLines
  let emptyCount = 0;
  for (const l of rawLines) {
    if (!l.trim()) emptyCount++;
  }

  // Nếu file gốc đã có nhiều dòng trống ngăn cách (>= 20% số dòng)
  // thì giữ nguyên ngắt dòng tự nhiên của file, chỉ chuẩn hóa các đoạn thừa
  if (emptyCount >= cleanedLines.length * 0.2) {
    return rawLines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // Nếu file gốc dính liền dòng (không có dòng trống), tự động nối mỗi dòng bằng \n\n
  return cleanedLines.join('\n\n');
}

/**
 * Tự động tách nội dung truyện thành các chương dựa vào dòng có định dạng "Chương [số]" (hoặc Chapter/Hồi)
 * Sử dụng regex không phân biệt hoa thường.
 */
export function splitTextIntoChapters(
  fullText: string,
  autoFormatParagraphs = true
): ParsedChapter[] {
  // Chuẩn hóa ngắt dòng, khoảng trắng lạ và BOM
  const normalized = fullText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');
  const lines = normalized.split('\n');

  // Regex phát hiện tiêu đề chương và ngoại truyện:
  // Hỗ trợ: "Chương 1", "Chương 1: Tiêu đề", "[Chương 68]", "(Chương 69)", "chuong 1", "Q1: Chương 1", "Hồi 1", "Chapter 1"
  // Hỗ trợ ngoại truyện: "Ngoại truyện 1", "Ngoại truyện 2", "[Ngoại truyện 1]", "Phiên ngoại 1", "PN 1", v.v.
  const chapterHeadingRegex =
    /^\s*[\[(【]?\s*(?:(?:Q|Quyển|Tập)\s*\d+[\s:.-]+)?(?:Chương|Chapter|Hồi)\s*(\d+)\s*[\])】]?(?:[\s:.-]+(.*))?$/i;
  const extraHeadingRegex =
    /^\s*[\[(【]?\s*(?:Ngoại\s*truyện|Phiên\s*ngoại|Ngoại\s*văn|PN)(?:\s*(\d+)|\s*[\])】]|\s*[:.-]|\s*\(|$)(?:.*)?$/i;

  const chapters: ParsedChapter[] = [];
  let currentChapterNum = 0;
  let lastSequentialNum = 0;
  let currentTitle = '';
  let currentContentLines: string[] = [];
  let prologueLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Bỏ qua nếu là dòng thoại hoặc quá dài
    const isQuoted = /^[“"']/.test(trimmed);
    const chapterMatch = !isQuoted && trimmed.length <= 120 ? trimmed.match(chapterHeadingRegex) : null;
    const extraMatch = !isQuoted && !chapterMatch && trimmed.length <= 120 ? trimmed.match(extraHeadingRegex) : null;

    if (chapterMatch || extraMatch) {
      // Đã gặp một tiêu đề chương mới hoặc ngoại truyện
      if (currentChapterNum > 0) {
        const content = formatParagraphsText(currentContentLines, autoFormatParagraphs);
        chapters.push({
          soThuTu: currentChapterNum,
          tieuDe: currentTitle,
          noiDung: content,
          previewSnippet: content.slice(0, 180).replace(/\n+/g, ' ') + (content.length > 180 ? '...' : ''),
        });
      } else if (currentContentLines.length > 0) {
        // Nội dung trước chương 1 (ví dụ văn án, giới thiệu)
        prologueLines = [...currentContentLines];
      }

      if (chapterMatch) {
        currentChapterNum = parseInt(chapterMatch[1], 10) || (lastSequentialNum + 1);
      } else {
        // Ngoại truyện tiếp nối số thứ tự chương
        currentChapterNum = lastSequentialNum + 1;
      }
      lastSequentialNum = currentChapterNum;
      currentTitle = trimmed;
      currentContentLines = [];
    } else {
      currentContentLines.push(line);
    }
  }

  // Đẩy chương cuối cùng vào danh sách
  if (currentChapterNum > 0) {
    const content = formatParagraphsText(currentContentLines, autoFormatParagraphs);
    chapters.push({
      soThuTu: currentChapterNum,
      tieuDe: currentTitle,
      noiDung: content,
      previewSnippet: content.slice(0, 180).replace(/\n+/g, ' ') + (content.length > 180 ? '...' : ''),
    });
  } else if (currentContentLines.length > 0) {
    // Trường hợp file không có từ khóa Chương nào, coi toàn bộ là 1 chương
    const content = formatParagraphsText(currentContentLines, autoFormatParagraphs);
    chapters.push({
      soThuTu: 1,
      tieuDe: 'Chương 1',
      noiDung: content,
      previewSnippet: content.slice(0, 180).replace(/\n+/g, ' ') + (content.length > 180 ? '...' : ''),
    });
  }

  // Nếu có phần giới thiệu / văn án ở đầu trước chương 1, có thể thêm làm Chương 0 hoặc giữ lại
  if (prologueLines.length > 0 && prologueLines.join('').trim().length > 20) {
    const prologueContent = formatParagraphsText(prologueLines, autoFormatParagraphs);
    chapters.unshift({
      soThuTu: 0,
      tieuDe: 'Lời Mở Đầu / Văn Án',
      noiDung: prologueContent,
      previewSnippet: prologueContent.slice(0, 180).replace(/\n+/g, ' ') + (prologueContent.length > 180 ? '...' : ''),
    });
  }

  return chapters;
}
