import React, { useEffect, useState } from 'react';

export interface ModernLoadingScreenProps {
  isFullScreen?: boolean;
  onClosePreview?: () => void;
  showCloseButton?: boolean;
  simulateAutoProgress?: boolean;
  initialProgress?: number;
}

export const ModernLoadingScreen: React.FC<ModernLoadingScreenProps> = ({
  isFullScreen = true,
  onClosePreview,
  showCloseButton = false,
  simulateAutoProgress = true,
  initialProgress = 15,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(initialProgress);

  // Bộ đếm % tự động giả lập thời gian thực và tự động hoàn tất
  useEffect(() => {
    if (!simulateAutoProgress) return;
    if (isReady) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 96) {
          const jump = Math.floor(Math.random() * 8) + 4;
          return Math.min(prev + jump, 96);
        } else {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [simulateAutoProgress, isReady]);

  // Khi đạt 100% (isReady = true), nếu có callback onClosePreview thì đóng loading mượt mà sau 550ms
  useEffect(() => {
    if (isReady && onClosePreview) {
      const exitTimer = setTimeout(() => {
        onClosePreview();
      }, 550);
      return () => clearTimeout(exitTimer);
    }
  }, [isReady, onClosePreview]);

  // Khóa cuộn trang khi đang ở màn hình loading toàn màn hình (chống trượt xuống thấy nội dung bên dưới)
  useEffect(() => {
    if (!isFullScreen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlTouchAction = document.documentElement.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.touchAction = 'none';

    // Ngăn chặn thao tác vuốt cuộn màn hình trên thiết bị cảm ứng / chuột
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.touchAction = originalHtmlTouchAction;
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [isFullScreen]);

  // Nút chuyển trạng thái xem thử giữa Đang tải và Hoàn tất
  const toggleReadyState = () => {
    setIsReady((prev) => {
      const next = !prev;
      setProgress(next ? 100 : 35);
      return next;
    });
  };

  return (
    <div
      className={`la-01 ${isReady ? 'is-ready' : ''} ${
        isFullScreen ? 'fixed inset-0 z-[99999]' : 'w-full py-5'
      }`}
      data-state={isReady ? 'ready' : 'loading'}
      data-fullscreen={isFullScreen ? 'true' : 'false'}
      style={{
        ['--la-01-p' as string]: progress,
      }}
    >
      <style>{`
        @property --la-01-p {
          syntax: '<integer>';
          inherits: false;
          initial-value: 0;
        }

        @property --la-01-spin {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .la-01 {
          --bg: #fff5f8;
          --surface: #ffffff;
          --ink: #1f1218;
          --muted: #9d7888;
          --line: #fce7f3;
          --acc: #ec4899;        /* Rose Pink rực rỡ */
          --acc-light: #fda4af;  /* Pastel Pink */
          --acc-ink: #ffffff;
          --ok: #f43f5e;         /* Rose Red-Pink */
          --ring: #ec4899;
          --shadow: rgba(236, 72, 153, 0.16);
          --dur: 4.8s;
          --sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          position: fixed;
          inset: 0;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: clamp(1rem, 3.5vw, 2.5rem);
          background: radial-gradient(120% 80% at 50% -20%, rgba(236, 72, 153, 0.15), transparent 60%),
                      radial-gradient(80% 60% at 100% 100%, rgba(244, 63, 94, 0.10), transparent 60%),
                      var(--bg);
          color: var(--ink);
          font-family: var(--sans);
          -webkit-font-smoothing: antialiased;
          user-select: none;
          z-index: 999999;
          overflow: hidden;
        }

        .la-01[data-fullscreen="true"] {
          position: fixed !important;
          inset: 0 !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          z-index: 999999 !important;
          overflow: hidden !important;
          touch-action: none !important;
        }

        .la-01[data-fullscreen="false"] {
          position: relative !important;
          width: 100% !important;
          height: auto !important;
          min-height: auto !important;
          padding: 1.25rem 1rem !important;
          background: transparent !important;
          z-index: auto !important;
        }

        .la-01,
        .la-01 *,
        .la-01 *::before,
        .la-01 *::after {
          box-sizing: border-box;
        }

        /* 1. KHUNG THẺ HÌNH VUÔNG CỐ ĐỊNH */
        .la-01__card {
          position: relative;
          inline-size: min(15rem, 85vw);
          block-size: min(15rem, 85vw);
          aspect-ratio: 1 / 1;
          box-sizing: border-box;
          padding: 1.25rem 1.15rem 1.1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          border-radius: 1.5rem;
          background: linear-gradient(180deg, color-mix(in oklab, var(--surface) 92%, var(--acc)), var(--surface));
          border: 1px solid var(--line);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset,
                      0 25px 45px -25px var(--shadow),
                      0 2px 6px -3px var(--shadow);
        }

        /* 2. VÒNG CONIC QUAY QUANH */
        .la-01__stage {
          position: relative;
          inline-size: 5rem;
          block-size: 5rem;
          display: grid;
          place-items: center;
        }

        .la-01__stage::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: conic-gradient(from var(--la-01-spin), #ec4899, transparent 42%, #ec4899);
          mask: radial-gradient(closest-side, transparent 76%, black 77%);
          -webkit-mask: radial-gradient(closest-side, transparent 76%, black 77%);
          animation: la-01-spin 3s linear infinite;
        }

        @keyframes la-01-spin {
          to {
            --la-01-spin: 360deg;
          }
        }

        /* 3. ICON TRÁI TIM ĐẬP NHẸ TẠI TÂM */
        .la-01__center-icon {
          position: absolute;
          inline-size: 2rem;
          block-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: linear-gradient(135deg, #fbcfe8, #f472b6);
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(236, 72, 153, 0.28);
          transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .la-01__center-icon svg {
          inline-size: 1rem;
          block-size: 1rem;
          fill: currentColor;
          animation: la-01-pulse-core 1.8s ease-in-out infinite;
        }

        @keyframes la-01-pulse-core {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        /* 4. DẤU TÍCH XÁC NHẬN KHI HOÀN TẤT */
        .la-01__seal {
          position: absolute;
          inline-size: 2.6rem;
          block-size: 2.6rem;
          fill: none;
          stroke: var(--ok);
          stroke-width: 3.4;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .la-01__tick {
          stroke-dasharray: 32;
          stroke-dashoffset: 32;
          transition: stroke-dashoffset 0.5s 0.12s ease;
        }

        /* 5. TIÊU ĐỀ & CHỮ TRẠNG THÁI */
        .la-01__copy {
          display: grid;
          gap: 0.15rem;
          justify-items: center;
          text-align: center;
        }

        .la-01__label {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: var(--ink);
        }

        .la-01__ready {
          display: none;
        }

        /* 6. THANH TIẾN TRÌNH */
        .la-01__track {
          inline-size: 84%;
          block-size: 0.38rem;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(236, 72, 153, 0.12);
        }

        .la-01__fill {
          display: block;
          block-size: 100%;
          border-radius: inherit;
          width: calc(var(--la-01-p, 68) * 1%);
          background: linear-gradient(90deg, #f472b6, #ec4899);
          transition: width 0.2s ease-out;
        }

        /* 7. PHẦN TRĂM % */
        .la-01__pct {
          margin: 0;
          font-family: var(--mono);
          font-size: 0.7rem;
          color: var(--muted);
          font-variant-numeric: tabular-nums;
          font-weight: 600;
        }

        /* TRẠNG THÁI KHI HOÀN TẤT */
        .la-01.is-ready .la-01__center-icon {
          opacity: 0;
          transform: scale(0.7);
        }

        .la-01.is-ready .la-01__seal {
          opacity: 1;
          transform: scale(1);
        }

        .la-01.is-ready .la-01__tick {
          stroke-dashoffset: 0;
        }

        .la-01.is-ready .la-01__stage::before {
          animation: none;
          opacity: 0.2;
        }

        .la-01.is-ready .la-01__load {
          display: none;
        }

        .la-01.is-ready .la-01__ready {
          display: inline;
          color: var(--ok);
        }

        .la-01.is-ready .la-01__fill {
          animation: none;
          width: 100% !important;
          background: var(--ok);
        }

        /* Nút phụ góc trên (Đóng / Toggle xem thử) */
        .la-01__chrome {
          position: absolute;
          inset-block-start: clamp(0.75rem, 2.5vw, 1.25rem);
          inset-inline-end: clamp(0.75rem, 2.5vw, 1.25rem);
          z-index: 20;
          display: flex;
          gap: 0.45rem;
        }

        .la-01__btn {
          inline-size: 2.35rem;
          block-size: 2.35rem;
          display: grid;
          place-items: center;
          cursor: pointer;
          padding: 0;
          border-radius: 999px;
          border: 1px solid rgba(236, 72, 153, 0.25);
          color: var(--ink);
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(10px);
          transition: background 0.25s ease, transform 0.25s ease, color 0.25s ease;
        }

        .la-01__btn:hover {
          background: #ffffff;
          transform: translateY(-1px);
        }

        .la-01__btn svg {
          inline-size: 1rem;
          block-size: 1rem;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .la-01__done[aria-pressed="true"] {
          background: var(--ok);
          border-color: transparent;
          color: #ffffff;
        }
      `}</style>

      {/* Nút bấm điều khiển góc trên */}
      <div className="la-01__chrome">
        {showCloseButton && onClosePreview && (
          <button
            onClick={onClosePreview}
            className="la-01__btn"
            type="button"
            title="Đóng xem thử"
            aria-label="Đóng xem thử"
          >
            <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}

        <button
          className="la-01__btn la-01__done"
          type="button"
          onClick={toggleReadyState}
          aria-pressed={isReady}
          aria-label={isReady ? 'Quay lại trạng thái đang tải' : 'Xem trạng thái hoàn tất'}
          title={isReady ? 'Quay lại trạng thái đang tải' : 'Xem trạng thái hoàn tất'}
        >
          <svg viewBox="0 0 24 24"><path d="m5 12.6 4.4 4.4L19 7.4" /></svg>
        </button>
      </div>

      {/* THẺ LOADING HÌNH VUÔNG CHÍNH */}
      <section className="la-01__card" role="status" aria-live="polite" aria-label="Đang tải dữ liệu">
        <div className="la-01__stage" aria-hidden="true">
          {/* Lõi trái tim đập nhịp */}
          <div className="la-01__center-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* Dấu tích tròn khi hoàn thành */}
          <svg className="la-01__seal" viewBox="0 0 64 64" focusable="false">
            <circle cx="32" cy="32" r="21" />
            <path className="la-01__tick" d="M22 33 29.6 40.4 43 24.6" />
          </svg>
        </div>

        {/* Tiêu đề */}
        <div className="la-01__copy">
          <p className="la-01__label">
            <span className="la-01__load">Đang tải dữ liệu...</span>
            <span className="la-01__ready">Đã tải hoàn tất!</span>
          </p>
        </div>

        {/* Thanh tiến trình % */}
        <div
          className="la-01__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={`${progress}% hoàn tất`}
        >
          <span className="la-01__fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Số % */}
        <p className="la-01__pct">{progress}%</p>
      </section>
    </div>
  );
};
export default ModernLoadingScreen;
