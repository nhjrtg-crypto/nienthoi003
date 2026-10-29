import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Persistent JSON storage file for AI Studio preview environment
const STORAGE_FILE = path.join(__dirname, 'server_storage.json');

let dbData = {
  stats: {
    likes: {
      intro_page: 30,
    },
    views: {
      total: 3000,
    },
  },
  comments: [],
  notes: {
    style1: [],
    style2: [],
  },
  covers: {},
  profiles: {},
  progress: {},
};

try {
  if (fs.existsSync(STORAGE_FILE)) {
    const raw = fs.readFileSync(STORAGE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      dbData = { ...dbData, ...parsed };
      if (!dbData.stats) dbData.stats = { likes: { intro_page: 30 }, views: { total: 3000 } };
      if (!dbData.comments) dbData.comments = [];
      if (!dbData.notes) dbData.notes = { style1: [], style2: [] };
      if (!dbData.covers) dbData.covers = {};
      if (!dbData.profiles) dbData.profiles = {};
      if (!dbData.progress) dbData.progress = {};
    }
  }
} catch (e) {
  console.warn('Could not load server_storage.json:', e);
}

function saveDb() {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not save server_storage.json:', e);
  }
}

app.get('/api/likes', (req, res) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });
  const targetId = req.query.targetId === 'intro_page' || String(req.query.targetId || '').startsWith('intro')
    ? 'intro_page'
    : String(req.query.targetId || 'global');
  const count = dbData.stats.likes[targetId] ?? (targetId === 'intro_page' ? 30 : 0);
  res.json({ success: true, targetId, likeCount: count });
});

app.post('/api/likes', (req, res) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });
  const rawTarget = req.body?.targetId || 'global';
  const targetId = rawTarget === 'intro_page' || String(rawTarget).startsWith('intro')
    ? 'intro_page'
    : String(rawTarget);
  const amount = typeof req.body?.amount === 'number' && req.body.amount > 0 ? req.body.amount : 1;
  const current = dbData.stats.likes[targetId] ?? (targetId === 'intro_page' ? 30 : 0);
  const next = current + amount;
  dbData.stats.likes[targetId] = next;
  saveDb();
  res.json({ success: true, targetId, likeCount: next });
});

app.get('/api/views', (req, res) => {
  res.json({ success: true, totalViews: dbData.stats.views.total, todayViews: 0 });
});

app.post('/api/views', (req, res) => {
  const amount = typeof req.body?.amount === 'number' && req.body.amount > 0 ? req.body.amount : 1;
  dbData.stats.views.total += amount;
  saveDb();
  res.json({ success: true, totalViews: dbData.stats.views.total, todayViews: 0 });
});

app.get('/api/comments', (req, res) => {
  const novelId = req.query.novelId;
  const chapterNumber = req.query.chapterNumber ? parseInt(req.query.chapterNumber, 10) : null;
  let results = dbData.comments;
  if (novelId) {
    results = results.filter((c) => c.truyenId === novelId || c.novelId === novelId);
  }
  if (chapterNumber !== null && !isNaN(chapterNumber)) {
    results = results.filter((c) => c.chapterNumber === chapterNumber);
  }
  res.json({ success: true, comments: results });
});

app.post('/api/comments', (req, res) => {
  const body = req.body || {};
  if (body.action === 'like' && body.commentId) {
    const item = dbData.comments.find((c) => c.id === body.commentId);
    if (item) item.likes = (item.likes || 0) + 1;
    saveDb();
    return res.json({ success: true, commentId: body.commentId });
  }

  if (body.action === 'delete') {
    const rawId = String(body.commentId || body.id || '').trim();
    if (rawId) {
      let idx = dbData.comments.findIndex((c) => String(c.id).trim() === rawId);
      while (idx !== -1) {
        dbData.comments.splice(idx, 1);
        idx = dbData.comments.findIndex((c) => String(c.id).trim() === rawId);
      }
      saveDb();
      return res.json({ success: true, commentId: rawId, deleted: true });
    }
  }

  const newComment = {
    id: body.id || `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    truyenId: body.truyenId || body.novelId,
    chapterNumber: typeof body.chapterNumber === 'number' ? body.chapterNumber : null,
    chapterTitle: body.chapterTitle || null,
    author: (body.author || 'Bạn Đọc').trim().slice(0, 50),
    content: (body.content || '').trim(),
    avatar: body.avatar || '',
    badge: body.badge || 'Độc Giả',
    rating: typeof body.rating === 'number' ? body.rating : 5,
    likes: 0,
    createdAt: body.createdAt || new Date().toLocaleDateString('vi-VN'),
    createdTimestamp: body.createdTimestamp || Date.now(),
    userId: body.userId || '',
    reply: body.reply || null,
  };

  dbData.comments.unshift(newComment);
  saveDb();
  res.json({ success: true, comment: newComment });
});

app.delete('/api/comments', (req, res) => {
  const rawId = String(req.query.id || req.body?.id || '').trim();
  if (!rawId) {
    return res.status(400).json({ success: false, error: 'Thiếu comment id' });
  }
  let idx = dbData.comments.findIndex((c) => String(c.id).trim() === rawId);
  while (idx !== -1) {
    dbData.comments.splice(idx, 1);
    idx = dbData.comments.findIndex((c) => String(c.id).trim() === rawId);
  }
  saveDb();
  res.json({ success: true, commentId: rawId, deleted: true });
});

app.get('/api/notes', (req, res) => {
  const style = req.query.style === 'style2' ? 'style2' : 'style1';
  res.json({ success: true, notes: dbData.notes[style] || [] });
});

app.post('/api/notes', (req, res) => {
  const body = req.body || {};
  const style = body.style === 'style2' ? 'style2' : 'style1';
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const note = {
    id: body.id || `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    style,
    author: (body.author || 'Bạn đọc ẩn danh ♡').trim(),
    content: (body.content || '').trim(),
    time: body.time || timeStr,
    createdAt: body.createdAt || Date.now(),
  };
  if (!dbData.notes[style]) dbData.notes[style] = [];
  dbData.notes[style].unshift(note);
  saveDb();
  res.json({ success: true, note });
});

app.get('/api/novel-bundle', (req, res) => {
  const novelId = req.query.novelId || 'global';
  const chapterNumber = req.query.chapterNumber ? parseInt(req.query.chapterNumber, 10) : null;
  const targetLikeId = (novelId.startsWith('intro_') || novelId === 'intro') ? 'intro_page' : novelId;
  const likeCount = dbData.stats.likes[targetLikeId] ?? (targetLikeId === 'intro_page' ? 30 : 0);
  let comments = dbData.comments;
  if (novelId && novelId !== 'global') {
    comments = comments.filter((c) => c.truyenId === novelId || c.novelId === novelId);
  }
  if (chapterNumber !== null && !isNaN(chapterNumber)) {
    comments = comments.filter((c) => c.chapterNumber === chapterNumber);
  }
  res.json({
    success: true,
    novelId,
    chapterNumber,
    views: {
      novelViews: 0,
      chapterViews: 0,
      totalGlobalViews: dbData.stats.views.total,
      todayGlobalViews: 0,
    },
    likes: likeCount,
    comments,
  });
});

app.get('/api/covers', (req, res) => {
  const novelId = req.query.novelId;
  if (novelId) {
    const coverUrl = dbData.covers[novelId] || null;
    return res.json({ success: true, novelId, coverUrl });
  }
  res.json({ success: true, covers: dbData.covers });
});

app.post('/api/covers', (req, res) => {
  const body = req.body || {};
  const novelId = (body.novelId || '').trim();
  const coverUrl = (body.coverUrl || '').trim();
  const novelTitle = (body.novelTitle || '').trim();

  if (!novelId || !coverUrl) {
    return res.status(400).json({ success: false, error: 'Thiếu novelId hoặc coverUrl' });
  }

  dbData.covers[novelId] = coverUrl;
  if (novelTitle) {
    dbData.covers[novelTitle] = coverUrl;
  }
  saveDb();

  res.json({ success: true, novelId, coverUrl });
});

app.get('/api/user/profile', (req, res) => {
  const userId = req.query.userId;
  console.log('[Server API GET /api/user/profile] requested userId:', userId);
  if (!userId) {
    return res.status(400).json({ success: false, error: 'Thiếu userId' });
  }
  const profile = dbData.profiles[userId] || null;
  console.log('[Server API GET /api/user/profile] found profile:', profile);
  res.json({ success: true, profile });
});

app.post('/api/user/profile', (req, res) => {
  const body = req.body || {};
  console.log('[Server API POST /api/user/profile] payload:', body);
  const userId = (body.userId || '').trim();
  if (!userId) {
    return res.status(400).json({ success: false, error: 'Thiếu userId' });
  }
  dbData.profiles[userId] = {
    userId,
    email: body.email || '',
    displayName: body.displayName || '',
    nickname: body.nickname || body.displayName || 'Bạn đọc',
    avatarUrl: body.avatarUrl || '',
    themePreference: body.themePreference || '',
  };
  saveDb();
  console.log('[Server API POST /api/user/profile] saved profile successfully for userId:', userId);
  res.json({ success: true });
});

app.get('/api/user/progress', (req, res) => {
  const userId = req.query.userId;
  console.log('[Server API GET /api/user/progress] requested userId:', userId);
  if (!userId) {
    return res.status(400).json({ success: false, error: 'Thiếu userId' });
  }
  const items = dbData.progress[userId] || [];
  console.log('[Server API GET /api/user/progress] found progress items count:', items.length);
  res.json({ success: true, items });
});

app.post('/api/user/progress', (req, res) => {
  const body = req.body || {};
  console.log('[Server API POST /api/user/progress] payload:', body);
  const userId = (body.userId || '').trim();
  const novelId = (body.novelId || '').trim();
  if (!userId || !novelId) {
    return res.status(400).json({ success: false, error: 'Thiếu userId hoặc novelId' });
  }
  if (!dbData.progress[userId]) {
    dbData.progress[userId] = [];
  }
  const list = dbData.progress[userId];
  const idx = list.findIndex((item) => item.novelId === novelId);
  const newItem = {
    userId,
    novelId,
    novelTitle: body.novelTitle || '',
    chapterNumber: typeof body.chapterNumber === 'number' ? body.chapterNumber : 1,
    chapterTitle: body.chapterTitle || '',
    progressPercent: typeof body.progressPercent === 'number' ? body.progressPercent : 0,
    scrollY: typeof body.scrollY === 'number' ? body.scrollY : 0,
    readingTimeMinutes: typeof body.readingTimeMinutes === 'number' ? body.readingTimeMinutes : 0,
    updatedAt: typeof body.updatedAt === 'number' ? body.updatedAt : Date.now(),
  };
  if (idx !== -1) {
    list[idx] = newItem;
  } else {
    list.unshift(newItem);
  }
  saveDb();
  console.log('[Server API POST /api/user/progress] saved progress successfully for userId:', userId, 'novelId:', novelId);
  res.json({ success: true });
});

const distPath = path.join(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.send('Application is starting or building...');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT} with persistent storage support`);
});
