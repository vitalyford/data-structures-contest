import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.userRole !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  next();
}
