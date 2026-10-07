// Cloudflare Pages Function: /api/views
// Quản lý lượt xem toàn web cộng dồn & lượt xem từng truyện/chương qua Cloudflare D1

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
  const novelId = url.searchParams.get('novelId');
  const chapterNumber = url.searchParams.get('chapterNumber');

  const getHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=5, s-maxage=10, stale-while-revalidate=30',
  };

  // Fallback nếu chưa kết nối D1
  if (!env.DB) {
    return new Response(
      JSON.stringify({
        success: true,
        source: 'fallback',
        totalViews: 3000,
        todayViews: 0,
      }),
      { headers: getHeaders }
    );
  }

  try {
    if (novelId) {
      if (chapterNumber !== null) {
        const chapNum = parseInt(chapterNumber, 10);
        const row = await env.DB.prepare(
          'SELECT views FROM novel_views WHERE novel_id = ? AND chapter_number = ?'
        )
          .bind(novelId, chapNum)
          .first();
        return new Response(
          JSON.stringify({
            success: true,
            novelId,
            chapterNumber: chapNum,
            views: row ? row.views : 0,
          }),
          { headers: getHeaders }
        );
      } else {
        const row = await env.DB.prepare(
          'SELECT SUM(views) as totalNovelViews FROM novel_views WHERE novel_id = ?'
        )
          .bind(novelId)
          .first();
        return new Response(
          JSON.stringify({
            success: true,
            novelId,
            views: row && row.totalNovelViews ? row.totalNovelViews : 0,
          }),
          { headers: getHeaders }
        );
      }
    }

    // Lượt xem toàn trang
    let row = await env.DB.prepare(
      'SELECT total_views, today_views FROM site_stats WHERE id = "global"'
    ).first();

    if (!row) {
      await env.DB.prepare(
        'INSERT INTO site_stats (id, total_views, today_views) VALUES ("global", 3000, 0)'
      ).run();
      row = { total_views: 3000, today_views: 0 };
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalViews: row.total_views,
        todayViews: row.today_views,
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

  if (!env.DB) {
    return new Response(
      JSON.stringify({ success: true, source: 'fallback', incremented: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      type?: string;
      amount?: number;
      novelId?: string;
      chapterNumber?: number;
    };

    const amount = typeof body.amount === 'number' && body.amount > 0 ? body.amount : 1;

    // 1. Tăng lượt xem từng chương truyện nếu có
    if (body.novelId) {
      const chapNum = typeof body.chapterNumber === 'number' ? body.chapterNumber : 0;
      await env.DB.prepare(
        `INSERT INTO novel_views (novel_id, chapter_number, views, updated_at) 
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(novel_id, chapter_number) 
         DO UPDATE SET views = views + ?, updated_at = CURRENT_TIMESTAMP`
      )
        .bind(body.novelId, chapNum, amount, amount)
        .run();
    }

    // 2. Tăng lượt xem toàn trang cộng dồn (Global Website Views)
    await env.DB.prepare(
      `INSERT INTO site_stats (id, total_views, today_views, updated_at)
       VALUES ('global', 3000 + ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) 
       DO UPDATE SET total_views = total_views + ?, today_views = today_views + ?, updated_at = CURRENT_TIMESTAMP`
    )
      .bind(amount, amount, amount, amount)
      .run();

    const row = await env.DB.prepare(
      'SELECT total_views, today_views FROM site_stats WHERE id = "global"'
    ).first();

    return new Response(
      JSON.stringify({
        success: true,
        totalViews: row ? row.total_views : 3000,
        todayViews: row ? row.today_views : 0,
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
