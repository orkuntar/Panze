import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

type JwtPayload = {
  userId: string;
};

export interface AuthRequest extends Request {
  userId?: string;
  currentUser?: any;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = payload.userId;
    const user = await prisma.user.findUnique({ select: { id: true, name: true, email: true, role: true }, where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.currentUser = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
