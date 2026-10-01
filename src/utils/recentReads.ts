import { Novel } from '../types';
import { safeStorage } from './safeStorage';

export interface RecentReadRecord {
  novelId: string;
  chapterNumber: number;
  progressPercent: number; // 1 - 100
  scrollY?: number;
  updatedAt: number;
}

const STORAGE_KEY = 'cosmo_recent_reads_v2';
const REAL_READ_KEY = 'cosmo_has_real_read_v1';

/**
 * Lấy danh sách truyện đọc gần đây.
 * Dành cho ai lần đầu tiên bấm vào trang web thì mục sẽ để trống, không hiện truyện.
 */
export function getRecentReads(availableNovels: Novel[]): { novel: Novel; record: RecentReadRecord }[] {
  if (!availableNovels || availableNovels.length === 0) return [];

  // Nếu người dùng chưa từng thực sự đọc truyện nào trong Reader, trả về mảng rỗng để mục Đang Đọc để trống
  const hasRealRead = safeStorage.getItem(REAL_READ_KEY);
  if (!hasRealRead) {
    return [];
  }

  let records: RecentReadRecord[] = [];

  try {
    const saved = safeStorage.getItem(STORAGE_KEY);
    if (saved) {
      records = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Không thể đọc lịch sử cosmo_recent_reads_v2', e);
  }

  // Quét thêm lịch sử lẻ từng truyện nếu có
  availableNovels.forEach((novel) => {
    try {
      const singleHistory = safeStorage.getItem(`novel_history_${novel.id}`);
      if (singleHistory) {
        const parsed = JSON.parse(singleHistory);
        const chapNum = parsed.lastReadChapterNumber || 1;
        const exists = records.some((r) => r.novelId === novel.id);
        if (!exists && parsed.lastReadChapterNumber) {
          const totalChapters = novel.chapters?.length || novel.totalChaptersCount || 1;
          const pct = Math.min(100, Math.max(1, Math.round((chapNum / totalChapters) * 100)));
          records.push({
            novelId: novel.id,
            chapterNumber: chapNum,
            progressPercent: pct,
            updatedAt: parsed.lastReadAt || Date.now(),
          });
        }
      }
    } catch {}
  });

  // Map sang danh sách Novel hợp lệ
  const result: { novel: Novel; record: RecentReadRecord }[] = [];
  records.forEach((rec) => {
    const novel = availableNovels.find((n) => n.id === rec.novelId);
    if (novel) {
      result.push({ novel, record: rec });
    }
  });

  // Sắp xếp theo thời gian đọc gần nhất
  return result.sort((a, b) => b.record.updatedAt - a.record.updatedAt);
}

/**
 * Lưu tiến độ đọc mới nhất cho một truyện
 */
export function saveRecentRead(
  novelId: string,
  chapterNumber: number,
  progressPercent: number,
  scrollY?: number
): void {
  try {
    // Đánh dấu người dùng đã có tiến độ đọc thực tế
    safeStorage.setItem(REAL_READ_KEY, 'true');

    let records: RecentReadRecord[] = [];
    const saved = safeStorage.getItem(STORAGE_KEY);
    if (saved) {
      records = JSON.parse(saved);
    }

    const clampedPercent = Math.min(100, Math.max(1, Math.round(progressPercent)));
    const updatedRecord: RecentReadRecord = {
      novelId,
      chapterNumber,
      progressPercent: clampedPercent,
      scrollY,
      updatedAt: Date.now(),
    };

    // Đưa lên đầu danh sách và loại bỏ trùng lặp cũ
    const filtered = records.filter((r) => r.novelId !== novelId);
    const newRecords = [updatedRecord, ...filtered].slice(0, 10);

    safeStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));

    // Bắn event để các component lắng nghe cập nhật UI ngay lập tức
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cosmo_recent_reads_updated'));
    }
  } catch (e) {
    console.warn('Lỗi khi lưu tiến độ đọc', e);
  }
}
