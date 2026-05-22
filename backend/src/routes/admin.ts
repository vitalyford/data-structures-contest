import { Router, Request, Response } from 'express';
import db from '../db/database';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import { broadcast, buildLeaderboard } from '../websocket/broadcaster';
import crypto from 'crypto';

const router = Router();
router.use(authMiddleware, adminMiddleware);

// ── Groups ──────────────────────────────────────────────────

router.get('/groups', (_req: Request, res: Response): void => {
  const rows = db.prepare('SELECT * FROM groups ORDER BY created_at DESC').all();
  res.json(rows);
});

router.post('/groups', (req: Request, res: Response): void => {
  const { name } = req.body as { name: string };
  if (!name) { res.status(400).json({ error: 'name is required' }); return; }
  const join_code = crypto.randomBytes(3).toString('hex').toUpperCase();
  const result = db.prepare('INSERT INTO groups (name, join_code) VALUES (?, ?)').run(name, join_code);
  res.json({ id: result.lastInsertRowid, name, join_code });
});

router.delete('/groups/:id', (req: Request, res: Response): void => {
  db.prepare('DELETE FROM groups WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── Contest Sessions ─────────────────────────────────────────

router.get('/sessions', (_req: Request, res: Response): void => {
  // Auto-deactivate sessions whose duration has elapsed
  db.prepare(`
    UPDATE contest_sessions SET is_active = 0
    WHERE is_active = 1
      AND start_time IS NOT NULL
      AND datetime(start_time, '+' || duration_minutes || ' minutes') <= datetime('now')
  `).run();
  const rows = db.prepare(`
    SELECT cs.*, g.name AS group_name, g.join_code
    FROM contest_sessions cs
    JOIN groups g ON g.id = cs.group_id
    ORDER BY cs.created_at DESC
  `).all();
  res.json(rows);
});

router.post('/sessions', (req: Request, res: Response): void => {
  const { groupId, name, durationMinutes } = req.body as { groupId: number; name: string; durationMinutes: number };
  if (!groupId || !name || !durationMinutes) {
    res.status(400).json({ error: 'groupId, name, durationMinutes are required' });
    return;
  }
  const result = db.prepare(
    'INSERT INTO contest_sessions (group_id, name, duration_minutes) VALUES (?, ?, ?)'
  ).run(groupId, name, durationMinutes);
  res.json({ id: result.lastInsertRowid, groupId, name, durationMinutes, is_active: 0 });
});

router.post('/sessions/:id/start', (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const session = db.prepare('SELECT group_id FROM contest_sessions WHERE id = ?').get(id) as { group_id: number } | undefined;
  if (!session) { res.status(404).json({ error: 'Session not found' }); return; }
  // Deactivate any other active session in this group
  db.prepare('UPDATE contest_sessions SET is_active = 0 WHERE group_id = ? AND is_active = 1').run(session.group_id);
  db.prepare('UPDATE contest_sessions SET is_active = 1, start_time = ? WHERE id = ?').run(new Date().toISOString(), id);
  broadcast(id);
  res.json({ ok: true });
});

router.post('/sessions/:id/stop', (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  db.prepare('UPDATE contest_sessions SET is_active = 0 WHERE id = ?').run(id);
  broadcast(id);
  res.json({ ok: true });
});

router.delete('/sessions/:id', (req: Request, res: Response): void => {
  db.prepare('DELETE FROM contest_sessions WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── Leaderboard for any session ───────────────────────────────

router.get('/sessions/:id/leaderboard', (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  res.json(buildLeaderboard(id));
});

// ── Focus events per student ──────────────────────────────────

router.get('/sessions/:id/focus/:userId', (req: Request, res: Response): void => {
  const rows = db.prepare(
    'SELECT occurred_at FROM focus_events WHERE contest_session_id = ? AND user_id = ? ORDER BY occurred_at'
  ).all(req.params.id, req.params.userId);
  res.json(rows);
});

// ── Reset a submission ────────────────────────────────────────

router.delete('/submissions/:id', (req: Request, res: Response): void => {
  const sub = db.prepare('SELECT contest_session_id FROM submissions WHERE id = ?').get(req.params.id) as
    { contest_session_id: number } | undefined;
  if (!sub) { res.status(404).json({ error: 'Submission not found' }); return; }
  db.prepare('DELETE FROM submissions WHERE id = ?').run(req.params.id);
  broadcast(sub.contest_session_id);
  res.json({ ok: true });
});

// ── Students list ─────────────────────────────────────────────

router.get('/groups/:id/students', (req: Request, res: Response): void => {
  const rows = db.prepare(
    'SELECT id, username, created_at FROM users WHERE group_id = ? ORDER BY username'
  ).all(req.params.id);
  res.json(rows);
});

router.get('/sessions/:sessionId/submissions', (req: Request, res: Response): void => {
  const rows = db.prepare(`
    SELECT s.id, s.user_id, u.username, s.problem_id, s.is_correct, s.elapsed_seconds, s.submitted_at
    FROM submissions s JOIN users u ON u.id = s.user_id
    WHERE s.contest_session_id = ?
    ORDER BY s.submitted_at
  `).all(req.params.sessionId);
  res.json(rows);
});

export default router;
