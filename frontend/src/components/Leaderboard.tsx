import type { LeaderboardData } from '../hooks/useLeaderboard';
import { useLanguage } from '../contexts/LanguageContext';

interface LeaderboardProps {
  data: LeaderboardData;
}

export function Leaderboard({ data }: LeaderboardProps) {
  const { t } = useLanguage();
  const { rows, problemIds } = data;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
            <th className="px-4 py-3 w-12">{t.rank}</th>
            <th className="px-4 py-3">{t.student}</th>
            <th className="px-4 py-3 text-center">{t.solved}</th>
            <th className="px-4 py-3 text-center">{t.totalTime}</th>
            <th className="px-4 py-3 text-center">{t.focusViolations}</th>
            {problemIds.map((pid) => (
              <th key={pid} className="px-2 py-3 text-center text-xs text-gray-400 font-normal">
                {pid.replace(/-(\d)$/, ' $1').toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.userId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 text-center font-semibold text-gray-700">
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{row.username}</td>
              <td className="px-4 py-3 text-center font-semibold text-blue-600">{row.solved}</td>
              <td className="px-4 py-3 text-center text-gray-600">{formatTime(row.totalTime)}</td>
              <td className="px-4 py-3 text-center text-gray-500">
                {row.focusViolations > 0 ? (
                  <span className="text-amber-600 font-medium">{row.focusViolations}</span>
                ) : (
                  <span className="text-gray-300">0</span>
                )}
              </td>
              {problemIds.map((pid) => {
                const pp = row.perProblem[pid];
                const color = !pp || !pp.submitted
                  ? 'bg-gray-300'
                  : pp.isCorrect
                  ? 'bg-blue-600'
                  : 'bg-amber-500';
                const label = !pp || !pp.submitted
                  ? t.unattempted
                  : pp.isCorrect ? t.correct : t.wrong;
                return (
                  <td key={pid} className="px-2 py-3 text-center">
                    <span className={`inline-block w-4 h-4 rounded-full ${color}`} title={label} />
                  </td>
                );
              })}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5 + problemIds.length} className="px-4 py-10 text-center text-gray-400">
                No students yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
