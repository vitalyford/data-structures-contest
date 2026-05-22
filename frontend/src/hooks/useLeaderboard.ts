import { useState, useEffect, useCallback } from 'react';

export interface LeaderboardRow {
  userId: number;
  username: string;
  solved: number;
  totalTime: number;
  focusViolations: number;
  perProblem: Record<string, { submitted: boolean; isCorrect: boolean }>;
}

export interface LeaderboardData {
  session: { id: number; name: string } | null;
  rows: LeaderboardRow[];
  problemIds: string[];
}

export function useLeaderboard(sessionId: number | null, httpUrl: string, token?: string | null) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHttp = useCallback(async () => {
    if (!sessionId) { setLoading(false); return; }
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(httpUrl, { headers });
      if (res.ok) setData(await res.json());
    } catch {}
    finally { setLoading(false); }
  }, [sessionId, httpUrl, token]);

  useEffect(() => {
    if (!sessionId) return;
    fetchHttp();

    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${location.host}/ws?sessionId=${sessionId}`);

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === 'leaderboard') setData(msg.data);
      } catch {}
    };

    return () => ws.close();
  }, [sessionId]);

  return { data, loading, refetch: fetchHttp };
}
