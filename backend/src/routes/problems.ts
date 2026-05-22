import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { problems } from '../data/problems';

const router = Router();

router.get('/', authMiddleware, (_req: AuthRequest, res: Response): void => {
  const list = problems.map(p => {
    const { answer, ...safe } = p;
    void answer;
    return safe;
  });
  res.json(list);
});

router.get('/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  const problem = problems.find(p => p.id === req.params.id);
  if (!problem) { res.status(404).json({ error: 'Problem not found' }); return; }
  // Send everything except the answer
  const { answer, ...safe } = problem;
  void answer; // unused intentionally
  res.json(safe);
});

export default router;
