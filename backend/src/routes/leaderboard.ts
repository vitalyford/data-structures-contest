import { Router, Response } from 'express';
import db from '../db/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { buildLeaderboard } from '../websocket/broadcaster';

const router = Router();

// Student: get active session info for their group
router.get('/session', authMiddleware, (req: AuthRequest, res: Response): void => {
  const groupId = req.groupId;
  if (!groupId) {
    res.json({ session: null });
    return;
  }
  const session = db.prepare(
    'SELECT * FROM contest_sessions WHERE group_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 1'
  ).get(groupId) as { id: number; name: string; group_id: number; duration_minutes: number; start_time: string; is_active: number } | undefined;

  res.json({ session: session ?? null });
});

// Student: get leaderboard for their active session
router.get('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  const groupId = req.groupId;
  if (!groupId) {
    res.status(400).json({ error: 'Not in a group' });
    return;
  }
  const session = db.prepare(
    'SELECT id FROM contest_sessions WHERE group_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 1'
  ).get(groupId) as { id: number } | undefined;

  if (!session) {
    res.json({ session: null, rows: [] });
    return;
  }

  res.json(buildLeaderboard(session.id));
});

export default router;
