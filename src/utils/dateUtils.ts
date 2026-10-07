/**
 * Tiện ích định dạng ngày tháng hiển thị cho bình luận và nội dung
 * Định dạng chuẩn: ngày/tháng/năm kèm giờ bình luận (HH:mm DD/MM/YYYY)
 */

export function formatCommentDate(input?: Date | string | number): string {
  const dateObj = input ? (input instanceof Date ? input : new Date(input)) : new Date();
  if (isNaN(dateObj.getTime())) {
    const fallback = new Date();
    const d = String(fallback.getDate()).padStart(2, '0');
    const m = String(fallback.getMonth() + 1).padStart(2, '0');
    const y = fallback.getFullYear();
    const hh = String(fallback.getHours()).padStart(2, '0');
    const mm = String(fallback.getMinutes()).padStart(2, '0');
    return `${hh}:${mm} ${d}/${m}/${y}`;
  }
  const d = String(dateObj.getDate()).padStart(2, '0');
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const y = dateObj.getFullYear();
  const hh = String(dateObj.getHours()).padStart(2, '0');
  const mm = String(dateObj.getMinutes()).padStart(2, '0');
  return `${hh}:${mm} ${d}/${m}/${y}`;
}

export function normalizeCommentDate(rawDate?: string): string {
  if (!rawDate) return formatCommentDate();
  const trimmed = rawDate.trim();
  const lower = trimmed.toLowerCase();

  // Đã có giờ và ngày tháng năm: HH:mm DD/MM/YYYY
  if (/^\d{1,2}:\d{2}\s+\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  // Định dạng ngày có giờ phân cách bởi dấu gạch hoặc phẩy: ví dụ "14:30 - 07/10/2026" hoặc "07/10/2026 14:30"
  if (/^\d{1,2}\/\d{1,2}\/\d{4}\s+(\d{1,2}:\d{2})/.test(trimmed)) {
    const match = trimmed.match(/^(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2})/);
    if (match) {
      return `${match[2]} ${match[1]}`;
    }
  }

  // Nếu chỉ có ngày tháng năm DD/MM/YYYY mà chưa có giờ, giữ ngày và bổ sung giờ hoặc trả về ngày/tháng/năm
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
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

  // Nếu là ISO string (2026-09-14T...) hoặc parse được thành Date
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return formatCommentDate(parsed);
  }

  return trimmed;
}
