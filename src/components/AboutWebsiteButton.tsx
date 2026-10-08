import React, { useState } from 'react';

export const AboutWebsiteButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ display: 'inline-block' }}>
      {/* 1. Tự động nhúng phông chữ Lexend Deca từ Google Fonts */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400;500;600;700&display=swap"
      />

      {/* 2. Nút Bấm Giới Thiệu Trang Web */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 border border-purple-200 dark:border-purple-800 bg-white dark:bg-zinc-900 text-purple-900 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/50"
        style={{ fontFamily: "'Lexend Deca', sans-serif" }}
        title="Bấm để xem giới thiệu về trang web"
      >
        {/* Chấm tròn hiệu ứng sáng */}
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        
        {/* Chữ trên nút */}
        <span>Giới Thiệu Website</span>

        {/* Mũi tên */}
        <span className="text-purple-400">→</span>
      </button>

      {/* 3. Bảng Giới Thiệu (Tự động mở khi bấm nút) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          style={{ fontFamily: "'Lexend Deca', sans-serif" }}
        >
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-purple-100 dark:border-zinc-800 shadow-2xl text-left">
            {/* Nút đóng (X) */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              ✕
            </button>

            {/* Tiêu đề popup */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">✨</span>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Về Trang Web Niên Thời
                </h3>
                <p className="text-xs text-zinc-500">
                  Không gian đọc tiểu thuyết trực tuyến
                </p>
              </div>
            </div>

            {/* Nội dung giới thiệu */}
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 mb-5">
              Niên Thời là nền tảng đọc truyện online giao diện tinh gọn, bảo vệ mắt và tự động lưu lại tiến trình đọc dở dang để bạn tiếp tục câu chuyện bất kỳ lúc nào.
            </p>

            {/* Nút hoàn tất */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-transform active:scale-98 cursor-pointer"
            >
              Bắt đầu đọc truyện
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutWebsiteButton;
