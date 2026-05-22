import { Router, Response } from 'express';
import db from '../db/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { broadcast } from '../websocket/broadcaster';
import { problems } from '../data/problems';

const router = Router();

router.post('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  const { contestSessionId } = req.body as { contestSessionId: number };
  const userId = req.userId!;

  if (!contestSessionId) {
    res.status(400).json({ error: 'contestSessionId is required' });
    return;
  }

  const session = db.prepare('SELECT id, is_active FROM contest_sessions WHERE id = ?').get(contestSessionId) as
    { id: number; is_active: number } | undefined;

  if (!session || !session.is_active) {
    res.status(400).json({ error: 'Session not active' });
    return;
  }

  // Don't count violations once all problems are submitted.
  const { cnt } = db.prepare(
    'SELECT COUNT(*) as cnt FROM submissions WHERE user_id = ? AND contest_session_id = ?'
  ).get(userId, contestSessionId) as { cnt: number };

  if (cnt >= problems.length) {
    res.json({ ok: true });
    return;
  }

  db.prepare('INSERT INTO focus_events (user_id, contest_session_id) VALUES (?, ?)').run(userId, contestSessionId);

  broadcast(contestSessionId);

  res.json({ ok: true });
});

export default router;
