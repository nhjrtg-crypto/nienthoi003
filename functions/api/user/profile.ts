// Cloudflare Pages Function: /api/user/profile
// Quản lý đồng bộ hồ sơ người dùng (biệt danh, theme, email) trên Cloudflare D1

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
  const userId = url.searchParams.get('userId');

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  if (!userId) {
    return new Response(JSON.stringify({ success: false, error: 'Thiếu userId' }), {
      status: 400,
      headers,
    });
  }

  const db = getDb(env);
  if (!db) {
    return new Response(JSON.stringify({ success: true, source: 'fallback', profile: null }), { headers });
  }

  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id TEXT PRIMARY KEY,
        email TEXT,
        display_name TEXT,
        nickname TEXT,
        avatar_url TEXT,
        theme_preference TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run().catch(() => {});

    const row = await db.prepare(
      'SELECT user_id, email, display_name, nickname, avatar_url, theme_preference FROM user_profiles WHERE user_id = ?'
    )
      .bind(userId)
      .first();

    if (!row) {
      return new Response(JSON.stringify({ success: true, profile: null }), { headers });
    }

    return new Response(
      JSON.stringify({
        success: true,
        profile: {
          userId: row.user_id,
          email: row.email,
          displayName: row.display_name,
          nickname: row.nickname,
          avatarUrl: row.avatar_url,
          themePreference: row.theme_preference,
        },
      }),
      { headers }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers,
    });
  }
};

export const onRequestPost = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;
  const headers = { 'Content-Type': 'application/json' };

  const db = getDb(env);
  if (!db) {
    return new Response(JSON.stringify({ success: true, source: 'fallback' }), { headers });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as any;
    const userId = (body.userId || '').trim();
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'Thiếu userId' }), {
        status: 400,
        headers,
      });
    }

    const email = (body.email || '').trim();
    const displayName = (body.displayName || '').trim();
    const nickname = (body.nickname || displayName || 'Bạn đọc').trim();
    const avatarUrl = (body.avatarUrl || '').trim();
    const themePreference = (body.themePreference || '').trim();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id TEXT PRIMARY KEY,
        email TEXT,
        display_name TEXT,
        nickname TEXT,
        avatar_url TEXT,
        theme_preference TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run().catch(() => {});

    await db.prepare(`
      INSERT INTO user_profiles (user_id, email, display_name, nickname, avatar_url, theme_preference, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        email = excluded.email,
        display_name = excluded.display_name,
        nickname = excluded.nickname,
        avatar_url = excluded.avatar_url,
        theme_preference = excluded.theme_preference,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(userId, email, displayName, nickname, avatarUrl, themePreference)
      .run();

    return new Response(JSON.stringify({ success: true }), { headers });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers,
    });
  }
};
