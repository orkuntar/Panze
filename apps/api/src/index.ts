import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import { prisma } from './prisma';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.APP_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, async () => {
  console.log(`API listening on http://localhost:${PORT}`);
  await prisma.$connect();
});
