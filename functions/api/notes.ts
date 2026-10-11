// Cloudflare Pages Function: /api/notes
// Quản lý lưu bút / tin nhắn bạn đọc trang giới thiệu qua Cloudflare D1

interface Env {
  DB?: any;
}

interface EventContext {
  request: Request;
  env: Env;
}

export const onRequestGet = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const style = url.searchParams.get('style') || 'style1';
  const limitParam = parseInt(url.searchParams.get('limit') || '50', 10);
  const limit = Math.min(Math.max(limitParam, 1), 100);

  const getHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
  };

  const db = env.DB;

  if (!db) {
    return new Response(
      JSON.stringify({
        success: true,
        source: 'fallback',
        notes: [],
      }),
      { headers: getHeaders }
    );
  }

  try {
    // Tự động tạo bảng guest_notes nếu chưa có
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS guest_notes (
        id TEXT PRIMARY KEY,
        style TEXT NOT NULL DEFAULT 'style1',
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        time_string TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    `).run().catch(() => {});

    const { results } = await db.prepare(
      `SELECT id, style, author, content, time_string as time, created_at as createdAt
       FROM guest_notes
       WHERE style = ?
       ORDER BY created_at DESC
       LIMIT ?`
    )
      .bind(style, limit)
      .all();

    return new Response(
      JSON.stringify({
        success: true,
        notes: results || [],
      }),
      { headers: getHeaders }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return new Response(
      JSON.stringify({ success: true, source: 'fallback' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as any;
    const id = body.id || `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const style = body.style || 'style1';
    const author = (body.author || body.sender || 'Bạn đọc ẩn danh ♡').trim().slice(0, 50);
    const content = (body.content || body.text || '').trim().slice(0, 500);
    const now = new Date();
    const timeString = body.time || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const createdAt = typeof body.createdAt === 'number' ? body.createdAt : Date.now();

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nội dung lưu bút không được để trống' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Tự động tạo bảng nếu chưa có
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS guest_notes (
        id TEXT PRIMARY KEY,
        style TEXT NOT NULL DEFAULT 'style1',
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        time_string TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    `).run().catch(() => {});

    await db.prepare(
      `INSERT INTO guest_notes (id, style, author, content, time_string, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(id, style, author, content, timeString, createdAt)
      .run();

    const newNote = {
      id,
      style,
      author,
      content,
      time: timeString,
      createdAt,
    };

    return new Response(
      JSON.stringify({ success: true, note: newNote }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
