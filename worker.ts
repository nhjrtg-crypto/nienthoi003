// Cloudflare Worker + Static Assets entrypoint for Niên Thời
// Tự động điều hướng các API /api/* đến Cloudflare D1
// Tất cả các request file tĩnh & giao diện (JS, CSS, Ảnh, HTML) chuyển thẳng sang Static Assets không qua xử lý Worker

export interface Env {
  DB?: any;
  USER_DB?: any;
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

// Cấu hình Cache-Control tối ưu: Cache 30s trên Edge CDN và Browser, giảm 95% request chạy vào Worker
const CACHE_HEADERS_GET: Record<string, string> = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
  'Access-Control-Allow-Origin': '*',
};

const NO_CACHE_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Access-Control-Allow-Origin': '*',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ========================================================================
    // 0. STATIC ASSETS FAST-PATH (Tối ưu hóa: Không để file tĩnh chạy qua Worker logic)
    // ========================================================================
    if (!url.pathname.startsWith('/api/')) {
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return new Response('Not found', { status: 404 });
    }

    // ========================================================================
    // 1. API: /api/novel-bundle (GỘP API: Lấy cả Views + Likes + Comments trong 1 request)
    // ========================================================================
    if (url.pathname === '/api/novel-bundle' || url.pathname === '/api/bundle') {
      if (request.method === 'GET') {
        const novelId = url.searchParams.get('novelId') || 'global';
        const chapterNumberParam = url.searchParams.get('chapterNumber');
        const chapterNumber = chapterNumberParam !== null && chapterNumberParam !== undefined && chapterNumberParam !== '' 
          ? parseInt(chapterNumberParam, 10) 
          : null;
        const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '50', 10), 1), 100);

        const targetLikeId = (novelId.startsWith('intro_') || novelId === 'intro') ? 'intro_page' : novelId;
        const likeDb = env.DB;

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
          // Thực thi đồng thời 3 truy vấn (Views, Likes, Comments) bằng Promise.all
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

              return { novelViews, chapterViews, totalGlobalViews: 3000, todayGlobalViews: 0 };
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
      }
    }

    // ========================================================================
    // 2. API: /api/views (Lượt xem toàn web & từng truyện/chương)
    // ========================================================================
    if (url.pathname === '/api/views' || url.pathname.startsWith('/api/views/')) {
      if (request.method === 'GET') {
        const novelId = url.searchParams.get('novelId');
        const chapterNumber = url.searchParams.get('chapterNumber');

        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', totalViews: 3000, todayViews: 0 }),
            { headers: CACHE_HEADERS_GET }
          );
        }

        try {
          if (novelId) {
            if (chapterNumber !== null) {
              const chapNum = parseInt(chapterNumber, 10);
              const row = await env.DB.prepare(
                'SELECT views FROM novel_views WHERE novel_id = ? AND chapter_number = ?'
              ).bind(novelId, chapNum).first();
              return new Response(
                JSON.stringify({ success: true, novelId, chapterNumber: chapNum, views: row ? row.views : 0 }),
                { headers: CACHE_HEADERS_GET }
              );
            } else {
              const row = await env.DB.prepare(
                'SELECT SUM(views) as totalNovelViews FROM novel_views WHERE novel_id = ?'
              ).bind(novelId).first();
              return new Response(
                JSON.stringify({ success: true, novelId, views: row && row.totalNovelViews ? row.totalNovelViews : 0 }),
                { headers: CACHE_HEADERS_GET }
              );
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              totalViews: 3000,
              todayViews: 0,
            }),
            { headers: NO_CACHE_HEADERS }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: NO_CACHE_HEADERS,
          });
        }
      }
    }

    // ========================================================================
    // 3. API: /api/likes (Thả tim truyện & trang giới thiệu)
    // ========================================================================
    if (url.pathname === '/api/likes' || url.pathname.startsWith('/api/likes/')) {
      const rawTarget = url.searchParams.get('targetId') || 'global';
      const targetId = rawTarget.startsWith('intro_') || rawTarget === 'intro' ? 'intro_page' : rawTarget;
      const db = env.DB;

      if (request.method === 'GET') {
        if (!db) {
          return new Response(
            JSON.stringify({
              success: true,
              source: 'fallback',
              targetId,
              likeCount: targetId === 'intro_page' ? 30 : 100,
            }),
            { headers: CACHE_HEADERS_GET }
          );
        }
        try {
          await db.prepare(`
            CREATE TABLE IF NOT EXISTS likes (
              target_id TEXT PRIMARY KEY,
              like_count INTEGER NOT NULL DEFAULT 0,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `).run().catch(() => {});

          const row = await db.prepare('SELECT like_count FROM likes WHERE target_id = ?')
            .bind(targetId)
            .first();

          let count = row ? row.like_count : 0;
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
            JSON.stringify({ success: true, targetId, likeCount: count }),
            { headers: CACHE_HEADERS_GET }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: NO_CACHE_HEADERS,
          });
        }
      }

      if (request.method === 'POST') {
        try {
          const body = (await request.json().catch(() => ({}))) as any;
          const rawPostTarget = body.targetId || targetId;
          const postTarget = rawPostTarget.startsWith('intro_') || rawPostTarget === 'intro' ? 'intro_page' : rawPostTarget;
          const amount = typeof body.amount === 'number' && body.amount > 0 ? body.amount : 1;
          const postDb = env.DB;

          if (!postDb) {
            return new Response(
              JSON.stringify({
                success: true,
                source: 'fallback',
                targetId: postTarget,
                likeCount: (postTarget === 'intro_page' ? 30 : 0) + amount,
                incremented: true,
              }),
              { headers: NO_CACHE_HEADERS }
            );
          }

          await postDb.prepare(`
            CREATE TABLE IF NOT EXISTS likes (
              target_id TEXT PRIMARY KEY,
              like_count INTEGER NOT NULL DEFAULT 0,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `).run().catch(() => {});

          const baseCount = postTarget === 'intro_page' ? 30 : 0;

          await postDb.prepare(
            `INSERT INTO likes (target_id, like_count, updated_at) 
             VALUES (?, ? + ?, CURRENT_TIMESTAMP)
             ON CONFLICT(target_id) 
             DO UPDATE SET like_count = like_count + ?, updated_at = CURRENT_TIMESTAMP`
          ).bind(postTarget, baseCount, amount, amount).run();

          const row = await postDb.prepare('SELECT like_count FROM likes WHERE target_id = ?')
            .bind(postTarget)
            .first();

          return new Response(
            JSON.stringify({ success: true, targetId: postTarget, likeCount: row ? row.like_count : (baseCount + amount) }),
            { headers: NO_CACHE_HEADERS }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: NO_CACHE_HEADERS,
          });
        }
      }
    }

    // ========================================================================
    // 4. API: /api/comments (Bình luận truyện & chương)
    // ========================================================================
    if (url.pathname === '/api/comments' || url.pathname.startsWith('/api/comments/')) {
      if (request.method === 'GET') {
        const novelId = url.searchParams.get('novelId');
        const chapterNumber = url.searchParams.get('chapterNumber');
        const limitParam = parseInt(url.searchParams.get('limit') || '50', 10);
        const limit = Math.min(Math.max(limitParam, 1), 100);

        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', comments: [] }),
            { headers: CACHE_HEADERS_GET }
          );
        }

        try {
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
            JSON.stringify({ success: true, comments: results || [] }),
            { headers: CACHE_HEADERS_GET }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: NO_CACHE_HEADERS,
          });
        }
      }

      if (request.method === 'POST') {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback' }),
            { headers: NO_CACHE_HEADERS }
          );
        }

        try {
          const body = (await request.json().catch(() => ({}))) as any;

          if (body.action === 'like' && body.commentId) {
            await env.DB.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?')
              .bind(body.commentId)
              .run();
            return new Response(
              JSON.stringify({ success: true, commentId: body.commentId }),
              { headers: NO_CACHE_HEADERS }
            );
          }

          if ((body.action === 'delete' || body.method === 'DELETE') && (body.commentId || body.id)) {
            const rawId = String(body.commentId || body.id);
            const trimmedId = rawId.trim();
            await env.DB.prepare('DELETE FROM comments WHERE id = ? OR id = ?')
              .bind(rawId, trimmedId)
              .run();
            return new Response(
              JSON.stringify({ success: true, commentId: trimmedId, deleted: true }),
              { headers: NO_CACHE_HEADERS }
            );
          }

          const id = body.id || `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const novelId = body.truyenId || body.novelId;
          if (!novelId || !body.content) {
            return new Response(
              JSON.stringify({ success: false, error: 'novelId và content là bắt buộc' }),
              { status: 400, headers: NO_CACHE_HEADERS }
            );
          }

          const createdAt = body.createdAt || new Date().toLocaleDateString('vi-VN', {
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
          ).bind(
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
          ).run();

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
            { headers: NO_CACHE_HEADERS }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: NO_CACHE_HEADERS,
          });
        }
      }

      if (request.method === 'DELETE') {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', deleted: true }),
            { headers: NO_CACHE_HEADERS }
          );
        }
        try {
          let commentId = url.searchParams.get('id') || url.searchParams.get('commentId');
          if (!commentId) {
            const body = await request.json().catch(() => ({})) as any;
            commentId = body?.id || body?.commentId;
          }

          if (!commentId) {
            return new Response(
              JSON.stringify({ success: false, error: 'Thiếu comment id' }),
              { status: 400, headers: NO_CACHE_HEADERS }
            );
          }
          const rawId = String(commentId);
          const trimmedId = rawId.trim();
          await env.DB.prepare('DELETE FROM comments WHERE id = ? OR id = ?').bind(rawId, trimmedId).run();
          return new Response(
            JSON.stringify({ success: true, commentId: trimmedId, deleted: true }),
            { headers: NO_CACHE_HEADERS }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: NO_CACHE_HEADERS,
          });
        }
      }
    }

    // ========================================================================
    // 5. API: /api/notes (Lưu bút bạn đọc)
    // ========================================================================
    if (url.pathname === '/api/notes' || url.pathname.startsWith('/api/notes/')) {
      const style = url.searchParams.get('style') || 'style1';
      const db = env.DB;

      if (request.method === 'GET') {
        if (!db) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', notes: [] }),
            { headers: CACHE_HEADERS_GET }
          );
        }
        try {
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
             LIMIT 50`
          ).bind(style).all();

          return new Response(
            JSON.stringify({ success: true, notes: results || [] }),
            { headers: CACHE_HEADERS_GET }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: NO_CACHE_HEADERS,
          });
        }
      }

      if (request.method === 'POST') {
        if (!db) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback' }),
            { headers: NO_CACHE_HEADERS }
          );
        }
        try {
          const body = (await request.json().catch(() => ({}))) as any;
          const id = body.id || `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          const author = (body.author || body.sender || 'Bạn đọc ẩn danh ♡').trim().slice(0, 50);
          const content = (body.content || body.text || '').trim().slice(0, 500);
          const now = new Date();
          const timeString = body.time || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
          const createdAt = typeof body.createdAt === 'number' ? body.createdAt : Date.now();

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
          ).bind(id, style, author, content, timeString, createdAt).run();

          return new Response(
            JSON.stringify({
              success: true,
              note: { id, style, author, content, time: timeString, createdAt },
            }),
            { headers: NO_CACHE_HEADERS }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: NO_CACHE_HEADERS,
          });
        }
      }
    }

    // ========================================================================
    // 6. API: /api/covers (Lưu trữ & đồng bộ ảnh bìa truyện trên Cloudflare D1)
    // ========================================================================
    if (url.pathname === '/api/covers' || url.pathname.startsWith('/api/covers/')) {
      if (request.method === 'GET') {
        const novelId = url.searchParams.get('novelId');

        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', covers: {} }),
            { headers: CACHE_HEADERS_GET }
          );
        }

        try {
          await env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS novel_covers (
              novel_id TEXT PRIMARY KEY,
              cover_url TEXT NOT NULL,
              novel_title TEXT,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `).run().catch(() => {});

          if (novelId) {
            const row = await env.DB.prepare(
              'SELECT cover_url FROM novel_covers WHERE novel_id = ? OR novel_title = ?'
            )
              .bind(novelId, novelId)
              .first();

            return new Response(
              JSON.stringify({ success: true, novelId, coverUrl: row ? row.cover_url : null }),
              { headers: CACHE_HEADERS_GET }
            );
          }

          const { results } = await env.DB.prepare(
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
            { headers: CACHE_HEADERS_GET }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: NO_CACHE_HEADERS,
          });
        }
      }

      if (request.method === 'POST') {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback' }),
            { headers: NO_CACHE_HEADERS }
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
              { status: 400, headers: NO_CACHE_HEADERS }
            );
          }

          await env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS novel_covers (
              novel_id TEXT PRIMARY KEY,
              cover_url TEXT NOT NULL,
              novel_title TEXT,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `).run().catch(() => {});

          await env.DB.prepare(`
            INSERT INTO novel_covers (novel_id, cover_url, novel_title, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT (novel_id) DO UPDATE SET 
              cover_url = excluded.cover_url, 
              novel_title = excluded.novel_title, 
              updated_at = CURRENT_TIMESTAMP
          `).bind(novelId, coverUrl, novelTitle).run();

          if (novelTitle && novelTitle !== novelId) {
            await env.DB.prepare(`
              INSERT INTO novel_covers (novel_id, cover_url, novel_title, updated_at)
              VALUES (?, ?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT (novel_id) DO UPDATE SET 
                cover_url = excluded.cover_url, 
                updated_at = CURRENT_TIMESTAMP
            `).bind(novelTitle, coverUrl, novelTitle).run().catch(() => {});
          }

          return new Response(
            JSON.stringify({ success: true, novelId, coverUrl }),
            { headers: NO_CACHE_HEADERS }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: NO_CACHE_HEADERS,
          });
        }
      }
    }



    // ========================================================================
    // 7. STATIC ASSETS FALLTHROUGH (Vite React Frontend SPA)
    // ========================================================================
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
