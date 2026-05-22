import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface ContestSession {
  id: number;
  name: string;
  duration_minutes: number;
  start_time: string;
  is_active: number;
  group_id: number;
}

export function useContest() {
  const { token } = useAuth();
  const [session, setSession] = useState<ContestSession | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/leaderboard/session', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setSession(null); return; }
      const data = await res.json();
      setSession(data.session ?? null);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSession(); }, [token]);

  useEffect(() => {
    if (!session) return;
    const end = new Date(session.start_time).getTime() + session.duration_minutes * 60_000;
    const tick = () => {
      const diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session]);

  return { session, secondsLeft, loading, refetch: fetchSession };
}
