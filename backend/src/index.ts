import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { initWss } from './websocket/broadcaster';
import authRoutes from './routes/auth';
import problemRoutes from './routes/problems';
import submissionRoutes from './routes/submissions';
import focusRoutes from './routes/focus';
import leaderboardRoutes from './routes/leaderboard';
import adminRoutes from './routes/admin';

const PORT = Number(process.env.PORT) || 3001;

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/focus-event', focusRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });
initWss(wss);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
