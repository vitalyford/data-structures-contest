import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
  groupId?: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; role: string; groupId: number | null };
    req.userId = payload.id;
    req.userRole = payload.role;
    req.groupId = payload.groupId ?? undefined;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
