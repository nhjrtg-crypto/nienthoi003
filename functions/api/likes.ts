// Cloudflare Pages Function: /api/likes
// Quản lý lượt thả tim truyện & trang giới thiệu qua Cloudflare D1

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
  const rawTarget = url.searchParams.get('targetId') || 'global';
  const targetId = rawTarget.startsWith('intro_') || rawTarget === 'intro' ? 'intro_page' : rawTarget;

  const getHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  };

  const db = getDb(env);

  if (!db) {
    return new Response(
      JSON.stringify({
        success: true,
        source: 'fallback',
        targetId,
        likeCount: targetId === 'intro_page' ? 30 : 100,
      }),
      { headers: getHeaders }
    );
  }

  try {
    // Tự động khởi tạo bảng likes nếu chưa có
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS likes (
        target_id TEXT PRIMARY KEY,
        like_count INTEGER NOT NULL DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run().catch(() => {});

    let row: any = null;
    if (targetId === 'intro_page') {
      row = await db.prepare(
        "SELECT MAX(like_count) as like_count FROM likes WHERE target_id IN ('intro_page', 'intro', 'intro_style1', 'intro_style2')"
      ).first().catch(() => null);
    } else {
      row = await db.prepare(
        'SELECT like_count FROM likes WHERE target_id = ?'
      )
        .bind(targetId)
        .first()
        .catch(() => null);
    }

    let count = row && typeof row.like_count === 'number' ? row.like_count : 0;
    // Khởi tạo tối thiểu từ số 30 cho trang giới thiệu nếu chưa có
    if (targetId === 'intro_page') {
      if (!row || count < 30) {
        count = 30;
        await db.prepare(
          `INSERT INTO likes (target_id, like_count, updated_at) 
           VALUES ('intro_page', 30, CURRENT_TIMESTAMP)
           ON CONFLICT(target_id) 
           DO UPDATE SET like_count = CASE WHEN like_count < 30 THEN 30 ELSE like_count END, updated_at = CURRENT_TIMESTAMP`
        ).run().catch(() => {});
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        targetId: 'intro_page',
        likeCount: count,
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

  try {
    const body = (await request.json().catch(() => ({}))) as {
      targetId?: string;
      amount?: number;
    };

    const rawTarget = body.targetId || 'intro_page';
    const targetId = rawTarget.startsWith('intro_') || rawTarget === 'intro' ? 'intro_page' : rawTarget;
    const amount = typeof body.amount === 'number' && body.amount > 0 ? body.amount : 1;

    const db = getDb(env);

    if (!db) {
      return new Response(
        JSON.stringify({ success: true, source: 'fallback', targetId, incremented: true }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Tự động tạo bảng nếu chưa có
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS likes (
        target_id TEXT PRIMARY KEY,
        like_count INTEGER NOT NULL DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run().catch(() => {});

    if (targetId === 'intro_page') {
      // Tìm số like hiện tại lớn nhất giữa các alias intro cũ và mới
      const existingRow: any = await db.prepare(
        "SELECT MAX(like_count) as max_likes FROM likes WHERE target_id IN ('intro_page', 'intro', 'intro_style1', 'intro_style2')"
      ).first().catch(() => null);

      const currentMax = existingRow && typeof existingRow.max_likes === 'number' && existingRow.max_likes > 0
        ? existingRow.max_likes
        : 30;

      const newCount = Math.max(currentMax + amount, 31);

      await db.prepare(
        `INSERT INTO likes (target_id, like_count, updated_at) 
         VALUES ('intro_page', ?, CURRENT_TIMESTAMP)
         ON CONFLICT(target_id) 
         DO UPDATE SET like_count = ?, updated_at = CURRENT_TIMESTAMP`
      )
        .bind(newCount, newCount)
        .run();

      // Đồng bộ luôn các alias cũ để tránh lệch dữ liệu nếu có câu lệnh truy vấn cũ
      await db.prepare(
        `UPDATE likes SET like_count = ?, updated_at = CURRENT_TIMESTAMP WHERE target_id IN ('intro', 'intro_style1', 'intro_style2')`
      ).bind(newCount).run().catch(() => {});

      return new Response(
        JSON.stringify({
          success: true,
          targetId: 'intro_page',
          likeCount: newCount,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const baseCount = 0;

    await db.prepare(
      `INSERT INTO likes (target_id, like_count, updated_at) 
       VALUES (?, ? + ?, CURRENT_TIMESTAMP)
       ON CONFLICT(target_id) 
       DO UPDATE SET like_count = like_count + ?, updated_at = CURRENT_TIMESTAMP`
    )
      .bind(targetId, baseCount, amount, amount)
      .run();

    const row = await db.prepare(
      'SELECT like_count FROM likes WHERE target_id = ?'
    )
      .bind(targetId)
      .first();

    return new Response(
      JSON.stringify({
        success: true,
        targetId,
        likeCount: row ? row.like_count : (baseCount + amount),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
