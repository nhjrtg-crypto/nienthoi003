import { Novel } from '../types';
import { safeStorage } from './safeStorage';

export interface RecentReadRecord {
  novelId: string;
  chapterNumber: number;
  progressPercent: number; // 1 - 100
  scrollY?: number;
  updatedAt: number;
}

const STORAGE_KEY = 'cosmo_recent_reads';

/**
 * Lấy danh sách truyện đọc gần đây, kết hợp với dữ liệu tiểu thuyết hiện có.
 * Nếu chưa từng có lịch sử, khởi tạo 2-3 truyện mẫu với tiến độ dở dang để người dùng trải nghiệm ngay.
 */
export function getRecentReads(availableNovels: Novel[]): { novel: Novel; record: RecentReadRecord }[] {
  if (!availableNovels || availableNovels.length === 0) return [];

  let records: RecentReadRecord[] = [];

  try {
    const saved = safeStorage.getItem(STORAGE_KEY);
    if (saved) {
      records = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Không thể đọc lịch sử cosmo_recent_reads', e);
  }

  // Quét thêm lịch sử lẻ từng truyện (novel_history_${id}) nếu có
  availableNovels.forEach((novel) => {
    try {
      const singleHistory = safeStorage.getItem(`novel_history_${novel.id}`);
      if (singleHistory) {
        const parsed = JSON.parse(singleHistory);
        const chapNum = parsed.lastReadChapterNumber || 1;
        const exists = records.some((r) => r.novelId === novel.id);
        if (!exists) {
          const totalChapters = novel.chapters.length || novel.totalChaptersCount || 1;
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

  // Nếu vẫn chưa có truyện nào (người dùng mới tinh), khởi tạo 2 truyện mặc định với tiến độ dở dang
  if (records.length === 0 && availableNovels.length >= 2) {
    const first = availableNovels[0];
    const second = availableNovels[1];

    const defaultRecords: RecentReadRecord[] = [
      {
        novelId: first.id,
        chapterNumber: first.chapters.length > 1 ? 2 : 1,
        progressPercent: 45,
        scrollY: 480,
        updatedAt: Date.now() - 1000 * 60 * 30, // 30 phút trước
      },
      {
        novelId: second.id,
        chapterNumber: 1,
        progressPercent: 68,
        scrollY: 750,
        updatedAt: Date.now() - 1000 * 60 * 120, // 2 tiếng trước
      },
    ];

    if (availableNovels.length >= 3) {
      const third = availableNovels[2];
      defaultRecords.push({
        novelId: third.id,
        chapterNumber: 1,
        progressPercent: 25,
        scrollY: 320,
        updatedAt: Date.now() - 1000 * 60 * 240,
      });
    }

    if (availableNovels.length >= 4) {
      const fourth = availableNovels[3];
      defaultRecords.push({
        novelId: fourth.id,
        chapterNumber: fourth.chapters.length > 2 ? 3 : 1,
        progressPercent: 82,
        scrollY: 520,
        updatedAt: Date.now() - 1000 * 60 * 360,
      });
    }

    if (availableNovels.length >= 5) {
      const fifth = availableNovels[4];
      defaultRecords.push({
        novelId: fifth.id,
        chapterNumber: 1,
        progressPercent: 15,
        scrollY: 180,
        updatedAt: Date.now() - 1000 * 60 * 480,
      });
    }

    if (availableNovels.length >= 6) {
      const sixth = availableNovels[5];
      defaultRecords.push({
        novelId: sixth.id,
        chapterNumber: 2,
        progressPercent: 50,
        scrollY: 400,
        updatedAt: Date.now() - 1000 * 60 * 600,
      });
    }

    try {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRecords));
      // Lưu luôn vị trí scroll cho các truyện mặc định này để khi bấm vào sẽ cuộn đúng vị trí
      defaultRecords.forEach((rec) => {
        if (rec.scrollY) {
          safeStorage.setItem(`novel_scroll_${rec.novelId}_${rec.chapterNumber}`, rec.scrollY.toString());
          safeStorage.setItem(
            `novel_history_${rec.novelId}`,
            JSON.stringify({ lastReadChapterNumber: rec.chapterNumber, lastReadAt: rec.updatedAt })
          );
        }
      });
    } catch {}

    records = defaultRecords;
  }

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
