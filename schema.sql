-- ============================================================================
-- CLOUDFLARE D1 DATABASE SCHEMA - NIÊN THỜI
-- Hướng dẫn: Copy toàn bộ nội dung file này và paste vào Cloudflare D1 Console
-- (dash.cloudflare.com -> Storage & Databases -> D1 -> Chọn database -> Console)
-- ============================================================================


-- 2. BẢNG LƯỢT XEM TỪNG BỘ TRUYỆN & CHƯƠNG
CREATE TABLE IF NOT EXISTS novel_views (
  novel_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (novel_id, chapter_number)
);

-- 3. BẢNG LƯỢT THẢ TIM (Yêu thích truyện, Thả tim trang giới thiệu, Thả tim chương)
CREATE TABLE IF NOT EXISTS likes (
  target_id TEXT PRIMARY KEY, -- ID truyện, hoặc 'intro_style1', 'intro_style2'
  like_count INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG BÌNH LUẬN (Bình luận truyện & Bình luận từng chương)
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  novel_id TEXT NOT NULL,
  chapter_number INTEGER DEFAULT NULL,
  chapter_title TEXT DEFAULT NULL,
  author TEXT NOT NULL DEFAULT 'Bạn Đọc',
  content TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  badge TEXT DEFAULT 'Độc Giả',
  rating INTEGER DEFAULT 5,
  likes INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  created_timestamp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_novel ON comments(novel_id, created_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_comments_chapter ON comments(novel_id, chapter_number, created_timestamp DESC);

-- 5. BẢNG LƯU BÚT / LỜI NHẮN ĐỘC GIẢ (Trang Giới Thiệu)
CREATE TABLE IF NOT EXISTS guest_notes (
  id TEXT PRIMARY KEY,
  style TEXT NOT NULL DEFAULT 'style1', -- 'style1' hoặc 'style2'
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  time_string TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guest_notes_style ON guest_notes(style, created_at DESC);

-- 6. BẢNG ẢNH BÌA TRUYỆN (LƯU TRỰC TIẾP TRÊN CLOUDFLARE D1)
CREATE TABLE IF NOT EXISTS novel_covers (
  novel_id TEXT PRIMARY KEY,
  cover_url TEXT NOT NULL,
  novel_title TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_novel_covers_title ON novel_covers(novel_title);
