import { useState } from 'react';
import type { Problem } from '../../../../backend/src/data/problems';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  problem: Problem;
  onSubmit: (answer: unknown) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  submitting?: boolean;
}

interface Data { capacity: number; cells: string[]; }

export function ClickCellsProblem({ problem, onSubmit, submitted, isCorrect, submitting = false }: Props) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? problem.en : problem.zh;
  const data = content.data as unknown as Data;
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Capacity: {data.capacity}. Click cells to mark them.</p>
      <div className="flex gap-1 flex-wrap">
        {data.cells.map((label, i) => {
          const sel = selected.has(i);
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => toggle(i)}
              className={`flex flex-col items-center px-3 py-2 rounded-xl ring-1 text-sm font-medium min-w-13 transition-all ${
                sel
                  ? submitted
                    ? isCorrect ? 'ring-blue-600 bg-blue-100 text-blue-900' : 'ring-amber-400 bg-amber-50 text-amber-800'
                    : 'ring-blue-500 bg-blue-50 text-blue-800'
                  : 'ring-gray-200 bg-white text-gray-700 hover:ring-blue-300'
              }`}
            >
              <span className="text-xs text-gray-400">[{i}]</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={() => onSubmit([...selected])}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
          {submitting ? t.submitting : t.submit}
        </button>
      )}
      {submitted && (
        <div className={`text-sm font-medium ${isCorrect ? 'text-blue-800' : 'text-amber-600'}`}>
          {isCorrect ? t.correct : t.wrong}
        </div>
      )}
    </div>
  );
}
