// Cloudflare Pages Function: /api/covers
// Quản lý lưu trữ & đồng bộ ảnh bìa truyện trực tiếp trên Cloudflare D1
// Chống mất ảnh, đồng bộ siêu nhanh toàn cầu mà không phụ thuộc vào Firebase

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
  const novelId = url.searchParams.get('novelId');

  const getHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  const db = getDb(env);
  if (!db) {
    return new Response(
      JSON.stringify({ success: true, source: 'fallback', covers: {} }),
      { headers: getHeaders }
    );
  }

  try {
    // Tự động khởi tạo bảng nếu chưa có
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS novel_covers (
        novel_id TEXT PRIMARY KEY,
        cover_url TEXT NOT NULL,
        novel_title TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run().catch(() => {});

    if (novelId) {
      const row = await db.prepare(
        'SELECT cover_url FROM novel_covers WHERE novel_id = ? OR novel_title = ?'
      )
        .bind(novelId, novelId)
        .first();

      return new Response(
        JSON.stringify({ success: true, novelId, coverUrl: row ? row.cover_url : null }),
        { headers: getHeaders }
      );
    }

    const { results } = await db.prepare(
      'SELECT novel_id, cover_url, novel_title FROM novel_covers'
    ).all();

    const covers: Record<string, string> = {};
    if (Array.isArray(results)) {
      for (const r of results) {
        if (r.novel_id && r.cover_url) {
          covers[r.novel_id] = r.cover_url;
        }
        if (r.novel_title && r.cover_url) {
          covers[r.novel_title] = r.cover_url;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, covers }),
      { headers: getHeaders }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;

  const db = getDb(env);
  if (!db) {
    return new Response(
      JSON.stringify({ success: true, source: 'fallback' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as any;
    const novelId = (body.novelId || '').trim();
    const coverUrl = (body.coverUrl || '').trim();
    const novelTitle = (body.novelTitle || '').trim();

    if (!novelId || !coverUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'Thiếu novelId hoặc coverUrl' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Tự động khởi tạo bảng nếu chưa có
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS novel_covers (
        novel_id TEXT PRIMARY KEY,
        cover_url TEXT NOT NULL,
        novel_title TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run().catch(() => {});

    // Ghi đè hoặc tạo mới ảnh bìa theo novelId
    await db.prepare(`
      INSERT INTO novel_covers (novel_id, cover_url, novel_title, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT (novel_id) DO UPDATE SET 
        cover_url = excluded.cover_url, 
        novel_title = excluded.novel_title, 
        updated_at = CURRENT_TIMESTAMP
    `).bind(novelId, coverUrl, novelTitle).run();

    // Đồng bộ thêm theo tên truyện nếu có
    if (novelTitle && novelTitle !== novelId) {
      await db.prepare(`
        INSERT INTO novel_covers (novel_id, cover_url, novel_title, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT (novel_id) DO UPDATE SET 
          cover_url = excluded.cover_url, 
          updated_at = CURRENT_TIMESTAMP
      `).bind(novelTitle, coverUrl, novelTitle).run().catch(() => {});
    }

    return new Response(
      JSON.stringify({ success: true, novelId, coverUrl }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
