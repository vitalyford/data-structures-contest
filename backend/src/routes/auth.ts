import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database';
import { broadcast } from '../websocket/broadcaster';
import { problems } from '../data/problems';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

router.post('/register', (req: Request, res: Response): void => {
  const { username, password, joinCode } = req.body as { username: string; password: string; joinCode: string };
  if (!username || !password || !joinCode) {
    res.status(400).json({ error: 'Username, password, and join code are required' });
    return;
  }
  if (username.length < 2 || username.length > 32) {
    res.status(400).json({ error: 'Username must be 2–32 characters' });
    return;
  }
  if (password.length < 4) {
    res.status(400).json({ error: 'Password must be at least 4 characters' });
    return;
  }

  const group = db.prepare('SELECT id FROM groups WHERE join_code = ?').get(joinCode.toUpperCase()) as { id: number } | undefined;
  if (!group) {
    res.status(400).json({ error: 'Invalid join code' });
    return;
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    res.status(400).json({ error: 'Username already taken' });
    return;
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (username, password_hash, role, group_id) VALUES (?, ?, ?, ?)'
  ).run(username, hash, 'student', group.id);

  const newId = Number(result.lastInsertRowid);
  const token = jwt.sign({ id: newId, role: 'student', groupId: group.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: newId, username, role: 'student', groupId: group.id } });
});

router.post('/login', (req: Request, res: Response): void => {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  // Admin login
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ id: 0, role: 'admin', groupId: null }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: 0, username, role: 'admin', groupId: null } });
    return;
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as {
    id: number; username: string; password_hash: string; role: string; group_id: number | null
  } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: user.id, role: user.role, groupId: user.group_id }, JWT_SECRET, { expiresIn: '7d' });

  if (user.group_id) {
    const activeSession = db.prepare(
      'SELECT id FROM contest_sessions WHERE group_id = ? AND is_active = 1'
    ).get(user.group_id) as { id: number } | undefined;

    if (activeSession) {
      const previousLogin = db.prepare(
        'SELECT id FROM contest_logins WHERE user_id = ? AND contest_session_id = ?'
      ).get(user.id, activeSession.id);

      if (previousLogin) {
        const { cnt } = db.prepare(
          'SELECT COUNT(*) as cnt FROM submissions WHERE user_id = ? AND contest_session_id = ?'
        ).get(user.id, activeSession.id) as { cnt: number };

        if (cnt < problems.length) {
          db.prepare('INSERT INTO focus_events (user_id, contest_session_id) VALUES (?, ?)').run(user.id, activeSession.id);
          broadcast(activeSession.id);
        }
      }

      db.prepare('INSERT INTO contest_logins (user_id, contest_session_id) VALUES (?, ?)').run(user.id, activeSession.id);
    }
  }

  res.json({ token, user: { id: user.id, username: user.username, role: user.role, groupId: user.group_id } });
});

router.get('/me', (req: Request, res: Response): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as { id: number; role: string; groupId: number | null };
    if (payload.role === 'admin') {
      res.json({ id: 0, username: process.env.ADMIN_USERNAME || 'admin', role: 'admin', groupId: null });
      return;
    }
    const user = db.prepare('SELECT id, username, role, group_id FROM users WHERE id = ?').get(payload.id) as {
      id: number; username: string; role: string; group_id: number | null
    } | undefined;
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    res.json({ id: user.id, username: user.username, role: user.role, groupId: user.group_id });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
