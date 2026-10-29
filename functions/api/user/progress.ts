// Cloudflare Pages Function: /api/user/progress
// Quản lý đồng bộ tiến độ đọc truyện (lịch sử đọc) trên Cloudflare D1

interface Env {
  DB?: any;
  USER_DB?: any;
}

const getDb = (env: Env) => env.USER_DB || env.DB;

interface EventContext {
  request: Request;
  env: Env;
}

export const onRequestGet = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  if (!userId) {
    return new Response(JSON.stringify({ success: false, error: 'Thiếu userId' }), {
      status: 400,
      headers,
    });
  }

  const db = getDb(env);
  if (!db) {
    return new Response(JSON.stringify({ success: true, source: 'fallback', items: [] }), { headers });
  }

  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS user_reading_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        novel_id TEXT NOT NULL,
        novel_title TEXT,
        chapter_number INTEGER,
        chapter_title TEXT,
        progress_percent REAL,
        scroll_y REAL,
        reading_time_minutes INTEGER,
        updated_at INTEGER
      )
    `).run().catch(() => {});

    const { results } = await db.prepare(
      'SELECT novel_id, novel_title, chapter_number, chapter_title, progress_percent, scroll_y, reading_time_minutes, updated_at FROM user_reading_progress WHERE user_id = ? ORDER BY updated_at DESC'
    )
      .bind(userId)
      .all();

    const items = (results || []).map((r: any) => ({
      userId,
      novelId: r.novel_id,
      novelTitle: r.novel_title,
      chapterNumber: r.chapter_number,
      chapterTitle: r.chapter_title,
      progressPercent: r.progress_percent,
      scrollY: r.scroll_y,
      readingTimeMinutes: r.reading_time_minutes,
      updatedAt: r.updated_at,
    }));

    return new Response(JSON.stringify({ success: true, items }), { headers });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers,
    });
  }
};

export const onRequestPost = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;
  const headers = { 'Content-Type': 'application/json' };

  const db = getDb(env);
  if (!db) {
    return new Response(JSON.stringify({ success: true, source: 'fallback' }), { headers });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as any;
    const userId = (body.userId || '').trim();
    const novelId = (body.novelId || '').trim();
    if (!userId || !novelId) {
      return new Response(JSON.stringify({ success: false, error: 'Thiếu userId hoặc novelId' }), {
        status: 400,
        headers,
      });
    }

    const novelTitle = (body.novelTitle || '').trim();
    const chapterNumber = typeof body.chapterNumber === 'number' ? body.chapterNumber : 1;
    const chapterTitle = (body.chapterTitle || '').trim();
    const progressPercent = typeof body.progressPercent === 'number' ? body.progressPercent : 0;
    const scrollY = typeof body.scrollY === 'number' ? body.scrollY : 0;
    const readingTimeMinutes = typeof body.readingTimeMinutes === 'number' ? body.readingTimeMinutes : 0;
    const updatedAt = typeof body.updatedAt === 'number' ? body.updatedAt : Date.now();
    const recordId = `${userId}:${novelId}`;

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS user_reading_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        novel_id TEXT NOT NULL,
        novel_title TEXT,
        chapter_number INTEGER,
        chapter_title TEXT,
        progress_percent REAL,
        scroll_y REAL,
        reading_time_minutes INTEGER,
        updated_at INTEGER
      )
    `).run().catch(() => {});

    await db.prepare(`
      INSERT INTO user_reading_progress (id, user_id, novel_id, novel_title, chapter_number, chapter_title, progress_percent, scroll_y, reading_time_minutes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        novel_title = excluded.novel_title,
        chapter_number = excluded.chapter_number,
        chapter_title = excluded.chapter_title,
        progress_percent = excluded.progress_percent,
        scroll_y = excluded.scroll_y,
        reading_time_minutes = excluded.reading_time_minutes,
        updated_at = excluded.updated_at
    `)
      .bind(
        recordId,
        userId,
        novelId,
        novelTitle,
        chapterNumber,
        chapterTitle,
        progressPercent,
        scrollY,
        readingTimeMinutes,
        updatedAt
      )
      .run();

    return new Response(JSON.stringify({ success: true }), { headers });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers,
    });
  }
};
