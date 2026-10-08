import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory stats for Express server
const inMemoryStats = {
  likes: {
    intro_page: 30,
  },
  views: {
    total: 3000,
  },
};

app.get('/api/likes', (req, res) => {
  const targetId = req.query.targetId === 'intro_page' || String(req.query.targetId || '').startsWith('intro')
    ? 'intro_page'
    : String(req.query.targetId || 'global');
  const count = inMemoryStats.likes[targetId] ?? (targetId === 'intro_page' ? 30 : 0);
  res.json({ success: true, targetId, likeCount: count });
});

app.post('/api/likes', (req, res) => {
  const rawTarget = req.body?.targetId || 'global';
  const targetId = rawTarget === 'intro_page' || String(rawTarget).startsWith('intro')
    ? 'intro_page'
    : String(rawTarget);
  const amount = typeof req.body?.amount === 'number' && req.body.amount > 0 ? req.body.amount : 1;
  const current = inMemoryStats.likes[targetId] ?? (targetId === 'intro_page' ? 30 : 0);
  const next = current + amount;
  inMemoryStats.likes[targetId] = next;
  res.json({ success: true, targetId, likeCount: next });
});

app.get('/api/views', (req, res) => {
  res.json({ success: true, totalViews: inMemoryStats.views.total, todayViews: 0 });
});

app.post('/api/views', (req, res) => {
  const amount = typeof req.body?.amount === 'number' && req.body.amount > 0 ? req.body.amount : 1;
  inMemoryStats.views.total += amount;
  res.json({ success: true, totalViews: inMemoryStats.views.total, todayViews: 0 });
});

// In-memory comments storage for server
const inMemoryComments = [];

app.get('/api/comments', (req, res) => {
  const novelId = req.query.novelId;
  const chapterNumber = req.query.chapterNumber ? parseInt(req.query.chapterNumber, 10) : null;
  let results = inMemoryComments;
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
    const item = inMemoryComments.find((c) => c.id === body.commentId);
    if (item) item.likes = (item.likes || 0) + 1;
    return res.json({ success: true, commentId: body.commentId });
  }

  if (body.action === 'delete') {
    const rawId = String(body.commentId || body.id || '').trim();
    if (rawId) {
      let idx = inMemoryComments.findIndex((c) => String(c.id).trim() === rawId);
      while (idx !== -1) {
        inMemoryComments.splice(idx, 1);
        idx = inMemoryComments.findIndex((c) => String(c.id).trim() === rawId);
      }
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
  };

  inMemoryComments.unshift(newComment);
  res.json({ success: true, comment: newComment });
});

app.delete('/api/comments', (req, res) => {
  const rawId = String(req.query.id || req.body?.id || '').trim();
  if (!rawId) {
    return res.status(400).json({ success: false, error: 'Thiếu comment id' });
  }
  let idx = inMemoryComments.findIndex((c) => String(c.id).trim() === rawId);
  while (idx !== -1) {
    inMemoryComments.splice(idx, 1);
    idx = inMemoryComments.findIndex((c) => String(c.id).trim() === rawId);
  }
  res.json({ success: true, commentId: rawId, deleted: true });
});

// In-memory notes storage for server
const inMemoryNotes = {
  style1: [],
  style2: [],
};

app.get('/api/notes', (req, res) => {
  const style = req.query.style === 'style2' ? 'style2' : 'style1';
  res.json({ success: true, notes: inMemoryNotes[style] || [] });
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
  if (!inMemoryNotes[style]) inMemoryNotes[style] = [];
  inMemoryNotes[style].unshift(note);
  res.json({ success: true, note });
});

app.get('/api/novel-bundle', (req, res) => {
  const novelId = req.query.novelId || 'global';
  const chapterNumber = req.query.chapterNumber ? parseInt(req.query.chapterNumber, 10) : null;
  const targetLikeId = (novelId.startsWith('intro_') || novelId === 'intro') ? 'intro_page' : novelId;
  const likeCount = inMemoryStats.likes[targetLikeId] ?? (targetLikeId === 'intro_page' ? 30 : 0);
  let comments = inMemoryComments;
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
      totalGlobalViews: inMemoryStats.views.total,
      todayGlobalViews: 0,
    },
    likes: likeCount,
    comments,
  });
});

// In-memory covers storage for server
const inMemoryCovers = {};

app.get('/api/covers', (req, res) => {
  const novelId = req.query.novelId;
  if (novelId) {
    const coverUrl = inMemoryCovers[novelId] || null;
    return res.json({ success: true, novelId, coverUrl });
  }
  res.json({ success: true, covers: inMemoryCovers });
});

app.post('/api/covers', (req, res) => {
  const body = req.body || {};
  const novelId = (body.novelId || '').trim();
  const coverUrl = (body.coverUrl || '').trim();
  const novelTitle = (body.novelTitle || '').trim();

  if (!novelId || !coverUrl) {
    return res.status(400).json({ success: false, error: 'Thiếu novelId hoặc coverUrl' });
  }

  inMemoryCovers[novelId] = coverUrl;
  if (novelTitle) {
    inMemoryCovers[novelTitle] = coverUrl;
  }

  res.json({ success: true, novelId, coverUrl });
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
  console.log(`Server listening on port ${PORT}`);
});
