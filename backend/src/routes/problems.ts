import { Router, Response } from 'express';
import db from '../db/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { getProblems } from '../data/problems';

const router = Router();

function getSessionProblemSet(groupId: number | undefined): 'A' | 'B' {
  if (!groupId) return 'A';
  const session = db.prepare(
    'SELECT problem_set FROM contest_sessions WHERE group_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 1'
  ).get(groupId) as { problem_set: string } | undefined;
  return session?.problem_set === 'B' ? 'B' : 'A';
}

router.get('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  const set = getSessionProblemSet(req.groupId);
  const problems = getProblems(set);
  const list = problems.map(p => {
    const { answer, ...safe } = p;
    void answer;
    return safe;
  });
  res.json(list);
});

router.get('/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  const set = getSessionProblemSet(req.groupId);
  const problems = getProblems(set);
  const problem = problems.find(p => p.id === req.params.id);
  if (!problem) { res.status(404).json({ error: 'Problem not found' }); return; }
  // Send everything except the answer
  const { answer, ...safe } = problem;
  void answer; // unused intentionally
  res.json(safe);
});

export default router;
