import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json(req.currentUser);
});

export default router;
