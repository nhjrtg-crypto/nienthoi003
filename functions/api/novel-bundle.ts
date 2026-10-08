// Cloudflare Pages Function: /api/novel-bundle
// Gộp API: Lấy cả Views + Likes + Comments trong 1 request duy nhất

interface Env {
  DB?: any;
  INTRO_DB?: any;
}

interface EventContext {
  request: Request;
  env: Env;
}

const CACHE_HEADERS_GET = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Access-Control-Allow-Origin': '*',
};

const NO_CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Access-Control-Allow-Origin': '*',
};

export const onRequestGet = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const novelId = url.searchParams.get('novelId') || 'global';
  const chapterNumberParam = url.searchParams.get('chapterNumber');
  const chapterNumber = chapterNumberParam !== null && chapterNumberParam !== undefined && chapterNumberParam !== '' 
    ? parseInt(chapterNumberParam, 10) 
    : null;
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '50', 10), 1), 100);

  const targetLikeId = (novelId.startsWith('intro_') || novelId === 'intro') ? 'intro_page' : novelId;
  const likeDb = (targetLikeId === 'intro_page' && env.INTRO_DB) ? env.INTRO_DB : (env.INTRO_DB || env.DB);

  if (!env.DB) {
    return new Response(
      JSON.stringify({
        success: true,
        source: 'fallback',
        novelId,
        chapterNumber,
        views: { novelViews: 0, chapterViews: 0, totalGlobalViews: 3000, todayGlobalViews: 0 },
        likes: targetLikeId === 'intro_page' ? 30 : 0,
        comments: [],
      }),
      { headers: CACHE_HEADERS_GET }
    );
  }

  try {
    const [viewsData, likesData, commentsData] = await Promise.all([
      // 1. Lấy dữ liệu views
      (async () => {
        let novelViews = 0;
        let chapterViews = 0;
        let totalGlobalViews = 3000;
        let todayGlobalViews = 0;

        try {
          if (novelId && novelId !== 'global') {
            const nRow = await env.DB.prepare(
              'SELECT SUM(views) as totalNovelViews FROM novel_views WHERE novel_id = ?'
            ).bind(novelId).first();
            if (nRow && typeof nRow.totalNovelViews === 'number') {
              novelViews = nRow.totalNovelViews;
            }

            if (chapterNumber !== null && !isNaN(chapterNumber)) {
              const cRow = await env.DB.prepare(
                'SELECT views FROM novel_views WHERE novel_id = ? AND chapter_number = ?'
              ).bind(novelId, chapterNumber).first();
              if (cRow && typeof cRow.views === 'number') {
                chapterViews = cRow.views;
              }
            }
          }

          const sRow = await env.DB.prepare(
            'SELECT total_views, today_views FROM site_stats WHERE id = "global"'
          ).first();
          if (sRow) {
            totalGlobalViews = sRow.total_views || 3000;
            todayGlobalViews = sRow.today_views || 0;
          }
        } catch {}

        return { novelViews, chapterViews, totalGlobalViews, todayGlobalViews };
      })(),

      // 2. Lấy số lượng Likes
      (async () => {
        let count = targetLikeId === 'intro_page' ? 30 : 0;
        if (likeDb) {
          try {
            const row = await likeDb.prepare('SELECT like_count FROM likes WHERE target_id = ?')
              .bind(targetLikeId)
              .first();
            if (row && typeof row.like_count === 'number') {
              count = row.like_count;
            }
          } catch {}
        }
        return count;
      })(),

      // 3. Lấy danh sách Comments
      (async () => {
        let results: any[] = [];
        try {
          let stmt;
          if (novelId && novelId !== 'global') {
            if (chapterNumber !== null && !isNaN(chapterNumber)) {
              stmt = env.DB.prepare(
                `SELECT id, novel_id as truyenId, chapter_number as chapterNumber, 
                        chapter_title as chapterTitle, author, content, avatar, 
                        badge, rating, likes, created_at as createdAt, created_timestamp as createdTimestamp
                 FROM comments 
                 WHERE novel_id = ? AND chapter_number = ?
                 ORDER BY created_timestamp DESC 
                 LIMIT ?`
              ).bind(novelId, chapterNumber, limit);
            } else {
              stmt = env.DB.prepare(
                `SELECT id, novel_id as truyenId, chapter_number as chapterNumber, 
                        chapter_title as chapterTitle, author, content, avatar, 
                        badge, rating, likes, created_at as createdAt, created_timestamp as createdTimestamp
                 FROM comments 
                 WHERE novel_id = ?
                 ORDER BY created_timestamp DESC 
                 LIMIT ?`
              ).bind(novelId, limit);
            }
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
          const res = await stmt.all();
          results = res.results || [];
        } catch {}
        return results;
      })(),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        novelId,
        chapterNumber,
        views: viewsData,
        likes: likesData,
        comments: commentsData,
      }),
      { headers: CACHE_HEADERS_GET }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: NO_CACHE_HEADERS,
    });
  }
};
