import { useLanguage } from '../contexts/LanguageContext';

interface TimerProps {
  secondsLeft: number;
}

export function Timer({ secondsLeft }: TimerProps) {
  const { t } = useLanguage();
  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const ss = (secondsLeft % 60).toString().padStart(2, '0');

  const urgent = secondsLeft <= 300;

  return (
    <div
      className={`font-mono text-lg font-semibold tabular-nums px-3 py-1 rounded-lg ${
        urgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
      }`}
    >
      {t.timeLeft}: {mm}:{ss}
    </div>
  );
}
