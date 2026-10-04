// Cloudflare Pages Function: /api/likes
// Quản lý lượt thả tim truyện & trang giới thiệu qua Cloudflare D1

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
  const targetId = url.searchParams.get('targetId') || 'global';

  if (!env.DB) {
    return new Response(
      JSON.stringify({
        success: true,
        source: 'fallback',
        targetId,
        likeCount: 520,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const row = await env.DB.prepare(
      'SELECT like_count FROM likes WHERE target_id = ?'
    )
      .bind(targetId)
      .first();

    return new Response(
      JSON.stringify({
        success: true,
        targetId,
        likeCount: row ? row.like_count : 0,
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
      JSON.stringify({ success: true, source: 'fallback', likeCount: 521 }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      targetId?: string;
      amount?: number;
    };

    const targetId = body.targetId || 'intro_style1';
    const amount = typeof body.amount === 'number' ? body.amount : 1;

    await env.DB.prepare(
      `INSERT INTO likes (target_id, like_count, updated_at) 
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(target_id) 
       DO UPDATE SET like_count = like_count + ?, updated_at = CURRENT_TIMESTAMP`
    )
      .bind(targetId, amount > 0 ? amount : 1, amount)
      .run();

    const row = await env.DB.prepare(
      'SELECT like_count FROM likes WHERE target_id = ?'
    )
      .bind(targetId)
      .first();

    return new Response(
      JSON.stringify({
        success: true,
        targetId,
        likeCount: row ? row.like_count : amount,
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
