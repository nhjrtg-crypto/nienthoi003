// Cloudflare Pages Function: /api/comments
// Quản lý bình luận truyện và từng chương qua Cloudflare D1

interface Env {
  DB?: any;
  ADMIN_SECRET?: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

export const onRequestGet = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const novelId = url.searchParams.get('novelId');
  const chapterNumber = url.searchParams.get('chapterNumber');
  const limitParam = parseInt(url.searchParams.get('limit') || '50', 10);
  const limit = Math.min(Math.max(limitParam, 1), 100);

  if (!env.DB) {
    return new Response(
      JSON.stringify({
        success: true,
        source: 'fallback',
        comments: [],
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Tự động khởi tạo bảng comments nếu chưa có trên D1
    await env.DB.prepare(`
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
      )
    `).run().catch(() => {});

    let stmt;
    if (novelId && chapterNumber !== null && chapterNumber !== undefined && chapterNumber !== '') {
      const chapNum = parseInt(chapterNumber, 10);
      stmt = env.DB.prepare(
        `SELECT id, novel_id as truyenId, chapter_number as chapterNumber, 
                chapter_title as chapterTitle, author, content, avatar, 
                badge, rating, likes, created_at as createdAt, created_timestamp as createdTimestamp
         FROM comments 
         WHERE novel_id = ? AND chapter_number = ?
         ORDER BY created_timestamp DESC 
         LIMIT ?`
      ).bind(novelId, chapNum, limit);
    } else if (novelId) {
      stmt = env.DB.prepare(
        `SELECT id, novel_id as truyenId, chapter_number as chapterNumber, 
                chapter_title as chapterTitle, author, content, avatar, 
                badge, rating, likes, created_at as createdAt, created_timestamp as createdTimestamp
         FROM comments 
         WHERE novel_id = ?
         ORDER BY created_timestamp DESC 
         LIMIT ?`
      ).bind(novelId, limit);
    } else {
      stmt = env.DB.prepare(
        `SELECT id, novel_id as truyenId, chapter_number as chapterNumber, 
                chapter_title as chapterTitle, author, content, avatar, 
                badge, rating, likes, created_at as createdAt, created_timestamp as createdTimestamp
         FROM comments 
         ORDER BY created_timestamp DESC 
         LIMIT ?`
      ).bind(limit);
    }

    const { results } = await stmt.all();

    return new Response(
      JSON.stringify({
        success: true,
        comments: results || [],
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
      JSON.stringify({ success: true, source: 'fallback', message: 'D1 not bound' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as any;

    // 1. Thao tác Thích bình luận (Like comment)
    if (body.action === 'like' && body.commentId) {
      await env.DB.prepare(
        'UPDATE comments SET likes = likes + 1 WHERE id = ?'
      )
        .bind(body.commentId)
        .run();

      return new Response(
        JSON.stringify({ success: true, commentId: body.commentId }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1.1 Thao tác Xóa bình luận qua POST action (Đảm bảo hoạt động trên mọi mạng)
    if (body.action === 'delete' && (body.commentId || body.id)) {
      const commentId = String(body.commentId || body.id).trim();
      await env.DB.prepare('DELETE FROM comments WHERE id = ?')
        .bind(commentId)
        .run();

      return new Response(
        JSON.stringify({ success: true, commentId, deleted: true }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Thao tác Đăng bình luận mới
    const id = body.id || `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const novelId = body.truyenId || body.novelId;
    if (!novelId || !body.content) {
      return new Response(
        JSON.stringify({ success: false, error: 'novelId và content là bắt buộc' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const createdAt = body.createdAt || now.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const createdTimestamp = Date.now();
    const author = (body.author || 'Bạn Đọc').trim().slice(0, 50);
    const content = (body.content || '').trim().slice(0, 1000);
    const avatar = (body.avatar || '').trim().slice(0, 500);
    const badge = (body.badge || 'Độc Giả').trim().slice(0, 30);
    const rating = typeof body.rating === 'number' ? Math.min(Math.max(body.rating, 1), 5) : 5;
    const chapterNumber = typeof body.chapterNumber === 'number' ? body.chapterNumber : null;
    const chapterTitle = body.chapterTitle ? String(body.chapterTitle).slice(0, 100) : null;

    await env.DB.prepare(
      `INSERT INTO comments (id, novel_id, chapter_number, chapter_title, author, content, avatar, badge, rating, likes, created_at, created_timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
    )
      .bind(
        id,
        novelId,
        chapterNumber,
        chapterTitle,
        author,
        content,
        avatar,
        badge,
        rating,
        createdAt,
        createdTimestamp
      )
      .run();

    const newComment = {
      id,
      truyenId: novelId,
      chapterNumber,
      chapterTitle,
      author,
      content,
      avatar,
      badge,
      rating,
      likes: 0,
      createdAt,
      createdTimestamp,
    };

    return new Response(
      JSON.stringify({ success: true, comment: newComment }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestDelete = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(
      JSON.stringify({ success: true, source: 'fallback', deleted: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const url = new URL(request.url);
    const commentId = url.searchParams.get('id');
    if (!commentId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Thiếu comment id' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await env.DB.prepare('DELETE FROM comments WHERE id = ?')
      .bind(commentId)
      .run();

    return new Response(
      JSON.stringify({ success: true, commentId }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
