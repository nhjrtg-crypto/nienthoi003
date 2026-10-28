import React from 'react';
import { NovelThemeId } from '../utils/themeStyles';

interface ClayThemeToggleProps {
  id?: string;
  isOn: boolean;
  onToggle: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  theme?: NovelThemeId;
  title?: string;
  disabled?: boolean;
}

/**
 * Nút Toggle 3D Claymorphism chuyển chế độ Sáng / Tối
 * Tích hợp chuẩn trợ năng A11Y, rãnh gạt Neumorphic và núm tròn nổi Marshmallow
 */
export const ClayThemeToggle: React.FC<ClayThemeToggleProps> = ({
  id = 'clay-toggle',
  isOn,
  onToggle,
  theme = 'amethyst-haze',
  title = 'Gạt bật/tắt chế độ tối',
  disabled = false,
}) => {
  return (
    <div
      role="switch"
      aria-checked={isOn}
      tabIndex={disabled ? -1 : 0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) onToggle(e);
      }}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) onToggle(e);
        }
      }}
      className={`toggle-wrapper inline-flex items-center shrink-0 cursor-pointer ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Input checkbox ẩn để xử lý trạng thái bật/tắt & trợ năng (Accessibility) */}
      <input
        type="checkbox"
        id={id}
        className="cl-10__in pointer-events-none"
        checked={isOn}
        disabled={disabled}
        readOnly
        tabIndex={-1}
      />

      {/* Khung rãnh gạt và núm tròn */}
      <label
        htmlFor={id}
        className={`cl-10__switch theme-${theme} cursor-pointer pointer-events-none`}
        title={title}
      >
        <span className="cl-10__knob" aria-hidden="true" />
        <span className="cl-10__sr">Bật / Tắt</span>
      </label>
    </div>
  );
};
