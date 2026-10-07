// Cloudflare Pages Function: /api/likes
// Quản lý lượt thả tim truyện & trang giới thiệu qua Cloudflare D1
// Hỗ trợ Database thứ 2 chuyên biệt (INTRO_DB) cho lượt thả tim và bình luận lưu bút

interface Env {
  DB?: any;
  INTRO_DB?: any;
}

interface EventContext {
  request: Request;
  env: Env;
}

// Helper tìm D1 database cho intro/likes (hỗ trợ mọi tên biến binding có thể)
function getIntroDatabase(env: any): any {
  return (
    env.INTRO_DB ||
    env.intro_db ||
    env.nienthoi_intro_db ||
    env['nienthoi-intro-db'] ||
    env.NIENTHOI_INTRO_DB ||
    env.INTRO_D1 ||
    env.intro_d1 ||
    env.DB ||
    env.db
  );
}

export const onRequestGet = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const rawTarget = url.searchParams.get('targetId') || 'global';
  const targetId = rawTarget.startsWith('intro_') || rawTarget === 'intro' ? 'intro_page' : rawTarget;

  const getHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=5, s-maxage=10, stale-while-revalidate=30',
  };

  // Ưu tiên INTRO_DB (Database thứ 2 dành riêng cho giới thiệu/thả tim) nếu có, fallback về DB
  const db = (targetId === 'intro_page') ? getIntroDatabase(env) : (getIntroDatabase(env) || env.DB);

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

    const row = await db.prepare(
      'SELECT like_count FROM likes WHERE target_id = ?'
    )
      .bind(targetId)
      .first();

    let count = row ? row.like_count : 0;
    // Khởi tạo tối thiểu từ số 30 cho trang giới thiệu nếu chưa có
    if (targetId === 'intro_page') {
      if (!row || count < 30) {
        count = 30;
        await db.prepare(
          `INSERT INTO likes (target_id, like_count, updated_at) 
           VALUES (?, 30, CURRENT_TIMESTAMP)
           ON CONFLICT(target_id) 
           DO UPDATE SET like_count = CASE WHEN like_count < 30 THEN 30 ELSE like_count END, updated_at = CURRENT_TIMESTAMP`
        ).bind(targetId).run().catch(() => {});
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        targetId,
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

    // Ưu tiên INTRO_DB (Database thứ 2) nếu có
    const db = (targetId === 'intro_page') ? getIntroDatabase(env) : (getIntroDatabase(env) || env.DB);

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

    const baseCount = targetId === 'intro_page' ? 30 : 0;

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
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
