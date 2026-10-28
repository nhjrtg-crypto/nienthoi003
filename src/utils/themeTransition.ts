/**
 * Theme toggle handler: trực tiếp chuyển đổi chế độ Sáng / Tối tức thì,
 * đã loại bỏ hiệu ứng lan truyền chậm theo yêu cầu người dùng.
 */

export interface TransitionOrigin {
  x?: number;
  y?: number;
}

export function triggerThemeTransition(
  updateThemeFn: () => void,
  _originCoords?: TransitionOrigin,
  _isGoingDark: boolean = false
) {
  // Thực thi chuyển đổi theme ngay lập tức
  updateThemeFn();
}
