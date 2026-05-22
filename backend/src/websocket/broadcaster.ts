import { WebSocket, WebSocketServer } from 'ws';
import db from '../db/database';
import { problems } from '../data/problems';

let wss: WebSocketServer | null = null;

// Map: contestSessionId -> Set of WebSocket clients
const sessionClients = new Map<number, Set<WebSocket>>();

export function initWss(server: WebSocketServer): void {
  wss = server;
  wss.on('connection', (ws: WebSocket, req) => {
    const url = new URL(req.url || '/', `http://localhost`);
    const sessionId = Number(url.searchParams.get('sessionId'));
    if (!sessionId) { ws.close(); return; }

    if (!sessionClients.has(sessionId)) sessionClients.set(sessionId, new Set());
    sessionClients.get(sessionId)!.add(ws);

    // Send initial leaderboard
    ws.send(JSON.stringify({ type: 'leaderboard', data: buildLeaderboard(sessionId) }));

    ws.on('close', () => {
      sessionClients.get(sessionId)?.delete(ws);
    });
  });
}

export function broadcast(sessionId: number): void {
  const clients = sessionClients.get(sessionId);
  if (!clients || clients.size === 0) return;
  const payload = JSON.stringify({ type: 'leaderboard', data: buildLeaderboard(sessionId) });
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  }
}

export function buildLeaderboard(sessionId: number): object {
  const session = db.prepare('SELECT * FROM contest_sessions WHERE id = ?').get(sessionId) as {
    id: number; name: string; group_id: number; duration_minutes: number; start_time: string; is_active: number
  } | undefined;
  if (!session) return { session: null, rows: [] };

  const students = db.prepare(
    'SELECT id, username FROM users WHERE group_id = ? AND role = ?'
  ).all(session.group_id, 'student') as { id: number; username: string }[];

  const subs = db.prepare(
    'SELECT user_id, problem_id, is_correct, elapsed_seconds FROM submissions WHERE contest_session_id = ?'
  ).all(sessionId) as { user_id: number; problem_id: string; is_correct: number; elapsed_seconds: number }[];

  const focusCounts = db.prepare(
    'SELECT user_id, COUNT(*) as cnt FROM focus_events WHERE contest_session_id = ? GROUP BY user_id'
  ).all(sessionId) as { user_id: number; cnt: number }[];

  const focusMap = new Map(focusCounts.map(f => [f.user_id, f.cnt]));

  const problemIds = problems.map(p => p.id);

  const rows = students.map(student => {
    const studentSubs = subs.filter(s => s.user_id === student.id);
    const subMap = new Map(studentSubs.map(s => [s.problem_id, s]));

    let solved = 0;
    let totalTime = 0;
    const problemStatus: Record<string, 'correct' | 'wrong' | 'unattempted'> = {};

    for (const pid of problemIds) {
      const sub = subMap.get(pid);
      if (!sub) { problemStatus[pid] = 'unattempted'; continue; }
      if (sub.is_correct) {
        problemStatus[pid] = 'correct';
        solved++;
        totalTime += sub.elapsed_seconds;
      } else {
        problemStatus[pid] = 'wrong';
      }
    }

    return {
      userId: student.id,
      username: student.username,
      solved,
      totalTime,
      perProblem: Object.fromEntries(
        problemIds.map(pid => [pid, {
          submitted: problemStatus[pid] !== 'unattempted',
          isCorrect: problemStatus[pid] === 'correct',
        }])
      ),
      focusViolations: focusMap.get(student.id) || 0,
    };
  });

  // Sort: solved DESC, totalTime ASC
  rows.sort((a, b) => b.solved - a.solved || a.totalTime - b.totalTime);

  return {
    session: {
      id: session.id,
      name: session.name,
      durationMinutes: session.duration_minutes,
      startTime: session.start_time,
      isActive: session.is_active === 1,
    },
    rows,
    problemIds,
  };
}
