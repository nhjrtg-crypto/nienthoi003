import { Novel, NovelComment } from '../types';
import { fetchIntroNotesStyle1, IntroGuestNote } from './firebase';
import { fetchGuestNotes, fetchLikes, D1GuestNote } from './d1Service';
import { safeStorage } from '../utils/safeStorage';

export type NotificationType = 'like' | 'comment' | 'note';

export interface AdminNotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  author: string;
  targetTitle?: string;
  targetId?: string;
  chapterNumber?: number;
  time: string;
  timestamp: number;
  isRead: boolean;
  avatar?: string;
}

const STORAGE_LAST_READ_KEY = 'admin_notifs_last_read_timestamp';
const STORAGE_LIKES_SNAPSHOT_KEY = 'admin_notifs_likes_snapshot';

/**
 * Đọc mốc thời gian lần cuối Admin xem thông báo
 */
export function getLastReadTimestamp(): number {
  try {
    const raw = safeStorage.getItem(STORAGE_LAST_READ_KEY);
    if (raw) {
      const val = parseInt(raw, 10);
      if (!isNaN(val) && val > 0) return val;
    }
  } catch {}
  // Mặc định: nếu chưa xem bao giờ thì coi như mốc là 24h trước
  return Date.now() - 24 * 60 * 60 * 1000;
}

/**
 * Đánh dấu toàn bộ thông báo đã đọc
 */
export function markAllNotificationsAsRead(): void {
  try {
    safeStorage.setItem(STORAGE_LAST_READ_KEY, Date.now().toString());
  } catch {}
}

/**
 * Chuyển đổi ngày tháng dạng chuỗi thành timestamp mili-giây
 */
function parseDateToTimestamp(dateStr?: string): number {
  if (!dateStr) return Date.now();
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.getTime();

  // Parse định dạng Việt Nam: "HH:mm DD/MM/YYYY" hoặc "DD/MM/YYYY"
  const match = dateStr.match(/(\d{1,2})[:h](\d{2})?\s*[-/,]?\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const hour = parseInt(match[1], 10) || 0;
    const minute = parseInt(match[2], 10) || 0;
    const day = parseInt(match[3], 10) || 1;
    const month = parseInt(match[4], 10) - 1;
    const year = parseInt(match[5], 10) || 2026;
    return new Date(year, month, day, hour, minute).getTime();
  }

  return Date.now();
}

/**
 * Tải toàn bộ danh sách thông báo quản trị (Bình luận, Lưu bút, Thả tim)
 * Cơ chế tối ưu tài nguyên:
 * - Chỉ tải 1 lần khi Admin mở xem hoặc bấm làm mới.
 * - Tận dụng dữ liệu danh sách truyện đã nạp sẵn trong app.
 * - Không gây phát sinh chi phí hay vượt hạn mức Firestore / Cloudflare D1.
 */
export async function fetchAdminNotifications(allNovels: Novel[] = []): Promise<AdminNotificationItem[]> {
  const lastRead = getLastReadTimestamp();
  const notifs: AdminNotificationItem[] = [];

  // =========================================================================
  // 1. THU THẬP BÌNH LUẬN MỚI TỪ TẤT CẢ CÁC TRUYỆN
  // =========================================================================
  allNovels.forEach((novel) => {
    if (Array.isArray(novel.comments)) {
      novel.comments.forEach((cm) => {
        const timestamp = cm.ngayTao ? new Date(cm.ngayTao).getTime() : parseDateToTimestamp(cm.createdAt);
        notifs.push({
          id: `comment_${cm.id || timestamp}`,
          type: 'comment',
          title: `Bình luận mới từ ${cm.author || 'Bạn Đọc'}`,
          description: cm.content || 'Đã để lại cảm nhận về truyện',
          author: cm.author || 'Bạn Đọc',
          targetTitle: novel.title,
          targetId: novel.id,
          chapterNumber: typeof cm.chapterNumber === 'number' ? cm.chapterNumber : undefined,
          time: cm.createdAt || 'Gần đây',
          timestamp: isNaN(timestamp) ? Date.now() : timestamp,
          isRead: timestamp <= lastRead,
          avatar: cm.avatar,
        });
      });
    }
  });

  // =========================================================================
  // 2. THU THẬP LƯU BÚT MỚI TỪ TRANG GIỚI THIỆU (FIRESTORE & CLOUDFLARE D1)
  // =========================================================================
  try {
    const [firestoreNotes, d1Style1Notes, d1Style2Notes] = await Promise.all([
      fetchIntroNotesStyle1().catch(() => [] as IntroGuestNote[]),
      fetchGuestNotes('style1').catch(() => [] as D1GuestNote[]),
      fetchGuestNotes('style2').catch(() => [] as D1GuestNote[]),
    ]);

    const seenNoteIds = new Set<string>();

    firestoreNotes.forEach((fn) => {
      const id = fn.id || `fn_${fn.createdAt}`;
      if (!seenNoteIds.has(id)) {
        seenNoteIds.add(id);
        const timestamp = fn.createdAt || Date.now();
        notifs.push({
          id: `note_${id}`,
          type: 'note',
          title: `Lưu bút mới từ ${fn.author || 'Độc Giả'}`,
          description: fn.content || 'Đã gửi lời nhắn trong trang sổ lưu bút',
          author: fn.author || 'Độc Giả',
          targetTitle: 'Trang Giới Thiệu (Nhật Ký / Sổ Tay)',
          time: fn.time || 'Gần đây',
          timestamp,
          isRead: timestamp <= lastRead,
        });
      }
    });

    [...d1Style1Notes, ...d1Style2Notes].forEach((dn) => {
      const id = dn.id || `dn_${dn.createdAt}`;
      if (!seenNoteIds.has(id)) {
        seenNoteIds.add(id);
        const timestamp = dn.createdAt || Date.now();
        notifs.push({
          id: `note_${id}`,
          type: 'note',
          title: `Lưu bút mới từ ${dn.author || 'Độc Giả'}`,
          description: dn.content || 'Đã gửi lời nhắn lưu bút',
          author: dn.author || 'Độc Giả',
          targetTitle: dn.style === 'style2' ? 'Trang Giới Thiệu (Máy Tamagotchi)' : 'Trang Giới Thiệu (Sổ Tay)',
          time: dn.time || 'Gần đây',
          timestamp,
          isRead: timestamp <= lastRead,
        });
      }
    });
  } catch {}

  // =========================================================================
  // 3. THU THẬP THỐNG KÊ LƯỢT THẢ TIM MỚI (CLOUD FLARE D1 / FIRESTORE)
  // =========================================================================
  try {
    // Đọc ảnh chụp lượt tim lần trước
    let prevLikesMap: Record<string, number> = {};
    const rawPrev = safeStorage.getItem(STORAGE_LIKES_SNAPSHOT_KEY);
    if (rawPrev) {
      try {
        prevLikesMap = JSON.parse(rawPrev);
      } catch {}
    }

    const currentLikesMap: Record<string, number> = {};

    // Kiểm tra tim trang giới thiệu & từng truyện
    const likeKeys = [
      { key: 'intro_style1', label: 'Trang Giới Thiệu (Sổ Tay Cực Quang)' },
      { key: 'intro_style2', label: 'Trang Giới Thiệu (Máy Tamagotchi)' },
      ...allNovels.map((n) => ({ key: `novel_${n.id}`, label: `Truyện "${n.title}"`, novelId: n.id })),
    ];

    await Promise.all(
      likeKeys.map(async (item) => {
        try {
          const count = await fetchLikes(item.key);
          currentLikesMap[item.key] = count;
          const prev = prevLikesMap[item.key] ?? count;
          const diff = count - prev;

          // Nếu có lượt tăng tim mới hoặc mốc tim đáng chú ý
          if (diff > 0) {
            notifs.push({
              id: `like_${item.key}_${count}`,
              type: 'like',
              title: `Nhận thêm +${diff} lượt thả tim!`,
              description: `${item.label} vừa được độc giả yêu thích (Tổng hiện tại: ${count.toLocaleString('vi-VN')} tim)`,
              author: 'Độc giả yêu quý',
              targetTitle: item.label,
              targetId: 'novelId' in item ? (item as any).novelId : undefined,
              time: 'Vừa cập nhật',
              timestamp: Date.now(),
              isRead: false,
            });
          } else if (count > 0 && Object.keys(prevLikesMap).length === 0) {
            // Lần đầu mở thông báo: hiển thị tổng quan tim hiện tại
            notifs.push({
              id: `like_init_${item.key}`,
              type: 'like',
              title: `Tổng cộng ${count.toLocaleString('vi-VN')} lượt thả tim`,
              description: `${item.label} đang nhận được nhiều tình cảm từ độc giả`,
              author: 'Cộng đồng đọc truyện',
              targetTitle: item.label,
              targetId: 'novelId' in item ? (item as any).novelId : undefined,
              time: 'Gần đây',
              timestamp: Date.now() - 3600000,
              isRead: true,
            });
          }
        } catch {}
      })
    );

    // Lưu snapshot hiện tại
    if (Object.keys(currentLikesMap).length > 0) {
      safeStorage.setItem(STORAGE_LIKES_SNAPSHOT_KEY, JSON.stringify(currentLikesMap));
    }
  } catch {}

  // =========================================================================
  // 4. SẮP XẾP THEO THỜI GIAN MỚI NHẤT LÊN ĐẦU
  // =========================================================================
  notifs.sort((a, b) => b.timestamp - a.timestamp);

  return notifs;
}
