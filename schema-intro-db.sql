-- ============================================================================
-- Niên Thời: Schema cho Cơ sở dữ liệu Cloudflare D1: nienthoi-intro-db
-- Dùng để lưu trữ và đồng bộ 100% hồ sơ người dùng & tiến độ đọc truyện đa thiết bị
-- ============================================================================

-- 1. Bảng Hồ Sơ Người Dùng (User Profiles)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  nickname TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'slate-haze',
  created_at INTEGER,
  updated_at INTEGER
);

-- 2. Bảng Tiến Độ Đọc Truyện Đa Thiết Bị (User Reading Progress)
-- Lưu chương đang đọc, phần trăm hoàn thành, thời gian đọc
CREATE TABLE IF NOT EXISTS user_reading_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  novel_id TEXT NOT NULL,
  novel_title TEXT,
  chapter_number INTEGER DEFAULT 1,
  chapter_title TEXT,
  progress_percent REAL DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 0,
  updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON user_reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_updated ON user_reading_progress(updated_at DESC);
