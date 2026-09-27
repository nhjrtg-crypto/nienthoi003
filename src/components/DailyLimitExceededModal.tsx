import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ExternalLink } from 'lucide-react';
import { FirestoreReadStats } from '../services/firebase';
import { safeStorage } from '../utils/safeStorage';

interface DailyLimitExceededModalProps {
  stats?: FirestoreReadStats;
  isDarkMode?: boolean;
}

export const DailyLimitExceededModal: React.FC<DailyLimitExceededModalProps> = ({
  isDarkMode,
}) => {
  const [internalDarkMode] = useState<boolean>(() => {
    try {
      return safeStorage.getItem('cosmo_darkmode') === 'true';
    } catch {
      return false;
    }
  });

  const isDarkEffective = isDarkMode !== undefined ? isDarkMode : internalDarkMode;

  // Khóa cứng thanh cuộn toàn trang khi xuất hiện thông báo
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      <div
        id="daily-limit-exceeded-modal"
        className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="limit-modal-title"
      >
        {/* Backdrop khóa cứng - Tuyệt đối không có nút đóng và không thể đóng bằng cách bấm ra ngoài */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Card - Thiết kế đơn giản giống popup khóa chương đặt pass, màu sắc đỏ trầm trung tính */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`relative w-full max-w-md rounded-2xl sm:rounded-3xl border shadow-2xl p-6 sm:p-8 z-10 transition-colors ${
            isDarkEffective
              ? 'bg-[#181920] border-zinc-700/80 text-zinc-100 shadow-black/80'
              : 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon Badge với màu đỏ trầm trung tính */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#822a33]/10 border border-[#822a33]/25 flex items-center justify-center text-[#822a33] dark:bg-[#822a33]/20 dark:border-[#822a33]/40 dark:text-[#e89098] mb-4 shadow-xs">
              <Bell className="w-6 h-6" />
            </div>

            {/* Tiêu đề */}
            <h3
              id="limit-modal-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#822a33] dark:text-[#e89098]"
            >
              THÔNG BÁO
            </h3>

            {/* Lời nhắn nội dung theo đúng yêu cầu */}
            <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              Lượt đọc trong ngày đã vượt mốc giới hạn của hệ thống, xin vui lòng quay lại vào 14 giờ ngày hôm sau. Trong thời gian đó có thể ghé qua WordPress để đọc truyện tiếp.
            </p>

            {/* Khung hiển thị Link WordPress trực quan */}
            <div
              className={`mt-4 w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-mono ${
                isDarkEffective
                  ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-200'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-800'
              }`}
            >
              <a
                id="wordpress-redirect-link"
                href="https://nienthoi003.wordpress.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold tracking-wider text-[#822a33] dark:text-[#e89098] hover:underline flex items-center gap-1.5 break-all select-all transition-colors"
              >
                <span>https://nienthoi003.wordpress.com/</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
