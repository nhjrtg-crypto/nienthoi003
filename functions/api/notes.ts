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
  const limitParam = parseInt(url.searchParams.get('limit') || '30', 10);
  const limit = Math.min(Math.max(limitParam, 1), 60);

  if (!env.DB) {
    return new Response(
      JSON.stringify({
        success: true,
        source: 'fallback',
        notes: [],
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { results } = await env.DB.prepare(
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
      { headers: { 'Content-Type': 'application/json' } }
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

  if (!env.DB) {
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
    const timeString = body.time || new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const createdAt = Date.now();

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nội dung lưu bút không được để trống' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await env.DB.prepare(
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
