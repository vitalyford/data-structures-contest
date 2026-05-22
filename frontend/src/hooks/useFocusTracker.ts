import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface FocusTrackerOptions {
  contestSessionId: number | null;
  enabled?: boolean;
  onViolation?: () => void;
}

const TAB_CLOSE_KEY = 'focus_tab_close_pending';

export function useFocusTracker({ contestSessionId, enabled = true, onViolation }: FocusTrackerOptions) {
  const { token } = useAuth();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFiredAt = useRef<number>(0);

  useEffect(() => {
    if (!contestSessionId || !token || !enabled) return;

    const report = () => {
      const now = Date.now();
      if (now - lastFiredAt.current < 3000) return; // deduplicate within 3s
      lastFiredAt.current = now;
      if (onViolation) onViolation();
      fetch('/api/focus-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contestSessionId }),
      }).catch(() => {});
    };

    // Detect tab close/refresh: if a flag was stored before the page unloaded, report it now
    try {
      const stored = localStorage.getItem(TAB_CLOSE_KEY);
      if (stored) {
        const pending = JSON.parse(stored) as { sessionId: number; t: number };
        if (pending.sessionId === contestSessionId && Date.now() - pending.t < 3_600_000) {
          report();
        }
        localStorage.removeItem(TAB_CLOSE_KEY);
      }
    } catch { /* ignore malformed storage */ }

    const debounced = () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(report, 300);
    };

    const handleVisibility = () => {
      if (document.hidden) debounced();
    };

    const handleBlur = () => debounced();

    // Store a flag before the page unloads so we can report it as a violation on the next mount
    const handleBeforeUnload = () => {
      localStorage.setItem(TAB_CLOSE_KEY, JSON.stringify({ sessionId: contestSessionId, t: Date.now() }));
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [contestSessionId, token, enabled]);
}
