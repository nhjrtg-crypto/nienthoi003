// Cloudflare Worker + Static Assets entrypoint for Niên Thời
// Tự động điều hướng các API /api/* đến Cloudflare D1
// Tất cả các request giao diện còn lại sẽ trả về file tĩnh React Vite (Single Page App)

export interface Env {
  DB?: any;
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ========================================================================
    // 1. API: /api/views (Lượt xem toàn web & từng truyện/chương)
    // ========================================================================
    if (url.pathname === '/api/views' || url.pathname.startsWith('/api/views/')) {
      if (request.method === 'GET') {
        const novelId = url.searchParams.get('novelId');
        const chapterNumber = url.searchParams.get('chapterNumber');

        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', totalViews: 3000, todayViews: 0 }),
            { headers: { 'Content-Type': 'application/json' } }
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
                { headers: { 'Content-Type': 'application/json' } }
              );
            } else {
              const row = await env.DB.prepare(
                'SELECT SUM(views) as totalNovelViews FROM novel_views WHERE novel_id = ?'
              ).bind(novelId).first();
              return new Response(
                JSON.stringify({ success: true, novelId, views: row && row.totalNovelViews ? row.totalNovelViews : 0 }),
                { headers: { 'Content-Type': 'application/json' } }
              );
            }
          }

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
            JSON.stringify({ success: true, totalViews: row.total_views, todayViews: row.today_views }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      if (request.method === 'POST') {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', incremented: true }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }

        try {
          const body = (await request.json().catch(() => ({}))) as any;
          const amount = typeof body.amount === 'number' && body.amount > 0 ? body.amount : 1;

          if (body.novelId) {
            const chapNum = typeof body.chapterNumber === 'number' ? body.chapterNumber : 0;
            await env.DB.prepare(
              `INSERT INTO novel_views (novel_id, chapter_number, views, updated_at) 
               VALUES (?, ?, ?, CURRENT_TIMESTAMP)
               ON CONFLICT(novel_id, chapter_number) 
               DO UPDATE SET views = views + ?, updated_at = CURRENT_TIMESTAMP`
            ).bind(body.novelId, chapNum, amount, amount).run();
          }

          await env.DB.prepare(
            `INSERT INTO site_stats (id, total_views, today_views, updated_at)
             VALUES ('global', 3000 + ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(id) 
             DO UPDATE SET total_views = total_views + ?, today_views = today_views + ?, updated_at = CURRENT_TIMESTAMP`
          ).bind(amount, amount, amount, amount).run();

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
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // ========================================================================
    // 2. API: /api/likes (Thả tim truyện & trang giới thiệu)
    // ========================================================================
    if (url.pathname === '/api/likes' || url.pathname.startsWith('/api/likes/')) {
      const targetId = url.searchParams.get('targetId') || 'global';

      if (request.method === 'GET') {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', targetId, likeCount: 520 }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }
        try {
          const row = await env.DB.prepare('SELECT like_count FROM likes WHERE target_id = ?')
            .bind(targetId)
            .first();
          return new Response(
            JSON.stringify({ success: true, targetId, likeCount: row ? row.like_count : 0 }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      if (request.method === 'POST') {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', likeCount: 521 }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }
        try {
          const body = (await request.json().catch(() => ({}))) as any;
          const target = body.targetId || targetId;
          const amount = typeof body.amount === 'number' ? body.amount : 1;

          await env.DB.prepare(
            `INSERT INTO likes (target_id, like_count, updated_at) 
             VALUES (?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(target_id) 
             DO UPDATE SET like_count = like_count + ?, updated_at = CURRENT_TIMESTAMP`
          ).bind(target, amount > 0 ? amount : 1, amount).run();

          const row = await env.DB.prepare('SELECT like_count FROM likes WHERE target_id = ?')
            .bind(target)
            .first();

          return new Response(
            JSON.stringify({ success: true, targetId: target, likeCount: row ? row.like_count : amount }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // ========================================================================
    // 3. API: /api/comments (Bình luận truyện & chương)
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
            { headers: { 'Content-Type': 'application/json' } }
          );
        }

        try {
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
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      if (request.method === 'POST') {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback' }),
            { headers: { 'Content-Type': 'application/json' } }
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
              { headers: { 'Content-Type': 'application/json' } }
            );
          }

          const id = body.id || `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const novelId = body.truyenId || body.novelId;
          if (!novelId || !body.content) {
            return new Response(
              JSON.stringify({ success: false, error: 'novelId và content là bắt buộc' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
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
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      if (request.method === 'DELETE') {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', deleted: true }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }
        try {
          const commentId = url.searchParams.get('id');
          if (!commentId) {
            return new Response(
              JSON.stringify({ success: false, error: 'Thiếu comment id' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
          }
          await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(commentId).run();
          return new Response(
            JSON.stringify({ success: true, commentId }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // ========================================================================
    // 4. API: /api/notes (Lưu bút bạn đọc)
    // ========================================================================
    if (url.pathname === '/api/notes' || url.pathname.startsWith('/api/notes/')) {
      const style = url.searchParams.get('style') || 'style1';

      if (request.method === 'GET') {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', notes: [] }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }
        try {
          const { results } = await env.DB.prepare(
            `SELECT id, style, author, content, time_string as time, created_at as createdAt
             FROM guest_notes
             WHERE style = ?
             ORDER BY created_at DESC
             LIMIT 50`
          ).bind(style).all();

          return new Response(
            JSON.stringify({ success: true, notes: results || [] }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      if (request.method === 'POST') {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }
        try {
          const body = (await request.json().catch(() => ({}))) as any;
          const id = body.id || `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          const author = (body.author || body.sender || 'Bạn đọc ẩn danh ♡').trim().slice(0, 50);
          const content = (body.content || body.text || '').trim().slice(0, 500);
          const timeString = body.time || new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          const createdAt = Date.now();

          await env.DB.prepare(
            `INSERT INTO guest_notes (id, style, author, content, time_string, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`
          ).bind(id, style, author, content, timeString, createdAt).run();

          return new Response(
            JSON.stringify({
              success: true,
              note: { id, style, author, content, time: timeString, createdAt },
            }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // ========================================================================
    // 5. API: /api/covers (Lưu trữ & đồng bộ ảnh bìa truyện trên Cloudflare D1)
    // ========================================================================
    if (url.pathname === '/api/covers' || url.pathname.startsWith('/api/covers/')) {
      if (request.method === 'GET') {
        const novelId = url.searchParams.get('novelId');

        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, source: 'fallback', covers: {} }),
            { headers: { 'Content-Type': 'application/json' } }
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
              { headers: { 'Content-Type': 'application/json' } }
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
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      if (request.method === 'POST') {
        if (!env.DB) {
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
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // ========================================================================
    // 6. STATIC ASSETS FALLTHROUGH (Vite React Frontend SPA)
    // ========================================================================
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
