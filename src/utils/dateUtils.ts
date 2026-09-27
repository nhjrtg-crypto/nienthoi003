/**
 * Tiện ích định dạng ngày tháng hiển thị cho bình luận và nội dung
 */

export function formatCommentDate(input?: Date | string | number): string {
  const dateObj = input ? (input instanceof Date ? input : new Date(input)) : new Date();
  if (isNaN(dateObj.getTime())) {
    const fallback = new Date();
    const d = String(fallback.getDate()).padStart(2, '0');
    const m = String(fallback.getMonth() + 1).padStart(2, '0');
    const y = fallback.getFullYear();
    return `${d}/${m}/${y}`;
  }
  const d = String(dateObj.getDate()).padStart(2, '0');
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const y = dateObj.getFullYear();
  return `${d}/${m}/${y}`;
}

export function normalizeCommentDate(rawDate?: string): string {
  if (!rawDate) return formatCommentDate();
  const trimmed = rawDate.trim();
  const lower = trimmed.toLowerCase();

  // Đã là định dạng ngày tháng năm DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(trimmed)) {
    return trimmed;
  }

  // Xử lý các chuỗi thời gian tương đối cũ
  if (lower.includes('vừa xong') || lower.includes('phút trước') || lower.includes('giờ trước') || lower.includes('vua xong')) {
    return formatCommentDate();
  }

  if (lower.includes('hôm qua') || lower.includes('hom qua') || lower.includes('1 ngày trước') || lower.includes('1 ngay truoc')) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatCommentDate(yesterday);
  }

  if (lower.includes('2 ngày trước') || lower.includes('2 ngay truoc')) {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return formatCommentDate(twoDaysAgo);
  }

  if (lower.includes('3 ngày trước') || lower.includes('3 ngay truoc')) {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return formatCommentDate(threeDaysAgo);
  }

  // Nếu là ISO string (2026-09-14T...)
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return formatCommentDate(parsed);
  }

  return trimmed;
}
