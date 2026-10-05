-- ============================================================================
-- CLOUDFLARE D1 DATABASE 2 SCHEMA - NIÊN THỜI (DÀNH RIÊNG CHO TRANG GIỚI THIỆU)
-- Tên database đề xuất: nienthoi-intro-db
-- Binding name trong Cloudflare Pages / Workers: INTRO_DB
-- 
-- Tách riêng Database thứ 2 này để:
-- 1. Giải phóng hoàn toàn dung lượng cho Database 1 (tránh chạm giới hạn 500MB).
-- 2. Ngắt kết nối Firebase với lượt thả tim và lưu bút, chuyển 100% sang Cloudflare D1.
-- 3. Độc lập, tốc độ cực nhanh, không lo nghẽn mạng hay giới hạn lượt đọc/ghi.
-- ============================================================================

-- 1. BẢNG LƯỢT THẢ TIM TRANG GIỚI THIỆU
CREATE TABLE IF NOT EXISTS likes (
  target_id TEXT PRIMARY KEY, -- 'intro_style1', 'intro_style2'
  like_count INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Khởi tạo số tim mặc định ban đầu nếu chưa có
INSERT OR IGNORE INTO likes (target_id, like_count) VALUES ('intro_style1', 520);
INSERT OR IGNORE INTO likes (target_id, like_count) VALUES ('intro_style2', 680);

-- 2. BẢNG LƯU BÚT / LỜI NHẮN ĐỘC GIẢ (Sổ Kế Hoạch Style 1 & Máy Trứng Style 2)
CREATE TABLE IF NOT EXISTS guest_notes (
  id TEXT PRIMARY KEY,
  style TEXT NOT NULL DEFAULT 'style1', -- 'style1' hoặc 'style2'
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  time_string TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guest_notes_style ON guest_notes(style, created_at DESC);
