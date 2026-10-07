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
    const idToDelete = body.commentId || body.id;
    if (idToDelete) {
      const idx = inMemoryComments.findIndex((c) => c.id === idToDelete);
      if (idx !== -1) inMemoryComments.splice(idx, 1);
      return res.json({ success: true, commentId: idToDelete, deleted: true });
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
  const idToDelete = req.query.id;
  if (!idToDelete) {
    return res.status(400).json({ success: false, error: 'Thiếu comment id' });
  }
  const idx = inMemoryComments.findIndex((c) => c.id === idToDelete);
  if (idx !== -1) {
    inMemoryComments.splice(idx, 1);
  }
  res.json({ success: true, commentId: idToDelete, deleted: true });
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
