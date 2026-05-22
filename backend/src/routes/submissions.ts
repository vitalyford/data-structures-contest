import { Router, Response } from 'express';
import db from '../db/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { problems, validateAnswer } from '../data/problems';
import { broadcast } from '../websocket/broadcaster';

const router = Router();

// GET /api/submissions?contestSessionId=X  — returns the current user's past submissions
router.get('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  const { contestSessionId } = req.query as { contestSessionId?: string };
  const userId = req.userId!;

  if (!contestSessionId) {
    res.status(400).json({ error: 'contestSessionId is required' });
    return;
  }

  const rows = db.prepare(
    'SELECT problem_id, is_correct FROM submissions WHERE user_id = ? AND contest_session_id = ?'
  ).all(userId, Number(contestSessionId)) as { problem_id: string; is_correct: number }[];

  const result: Record<string, boolean> = {};
  for (const row of rows) {
    result[row.problem_id] = row.is_correct === 1;
  }

  res.json(result);
});

router.post('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  const { problemId, answer, contestSessionId } = req.body as {
    problemId: string;
    answer: unknown;
    contestSessionId: number;
  };
  const userId = req.userId!;

  if (!problemId || answer === undefined || !contestSessionId) {
    res.status(400).json({ error: 'problemId, answer, and contestSessionId are required' });
    return;
  }

  // Verify session is active
  const session = db.prepare(
    'SELECT id, start_time, duration_minutes, is_active FROM contest_sessions WHERE id = ?'
  ).get(contestSessionId) as { id: number; start_time: string; duration_minutes: number; is_active: number } | undefined;

  if (!session || !session.is_active) {
    res.status(400).json({ error: 'Contest session is not active' });
    return;
  }

  // One-attempt check
  const existing = db.prepare(
    'SELECT id FROM submissions WHERE user_id = ? AND problem_id = ? AND contest_session_id = ?'
  ).get(userId, problemId, contestSessionId);
  if (existing) {
    res.status(409).json({ error: 'Already submitted' });
    return;
  }

  const problem = problems.find(p => p.id === problemId);
  if (!problem) {
    res.status(404).json({ error: 'Problem not found' });
    return;
  }

  // Compute elapsed seconds
  const startMs = new Date(session.start_time).getTime();
  const elapsedSeconds = Math.floor((Date.now() - startMs) / 1000);

  const isCorrect = validateAnswer(problem, answer) ? 1 : 0;

  db.prepare(
    'INSERT INTO submissions (user_id, problem_id, contest_session_id, is_correct, elapsed_seconds) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, problemId, contestSessionId, isCorrect, elapsedSeconds);

  // Broadcast updated leaderboard
  broadcast(contestSessionId);

  res.json({ correct: isCorrect === 1, elapsedSeconds });
});

export default router;
