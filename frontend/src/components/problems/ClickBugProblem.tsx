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

interface Data { lines: number; bugLine: number; }

export function ClickBugProblem({ problem, onSubmit, submitted, isCorrect, submitting = false }: Props) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? problem.en : problem.zh;
  const data = content.data as unknown as Data;
  const [selected, setSelected] = useState<number | null>(null);

  const lines = Array.from({ length: data.lines }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Click the line number that contains the bug:</p>
      <div className="flex flex-wrap gap-2">
        {lines.map((line) => (
          <button
            key={line}
            disabled={submitted}
            onClick={() => !submitted && setSelected(line)}
            className={`w-10 h-10 rounded-xl text-sm font-semibold ring-1 transition-all ${
              selected === line
                ? submitted
                  ? isCorrect
                    ? 'bg-blue-700 text-white ring-blue-700'
                    : 'bg-amber-400 text-gray-900 ring-amber-400'
                  : 'bg-blue-600 text-white ring-blue-600'
                : 'bg-white text-gray-700 ring-gray-200 hover:ring-blue-400 hover:bg-blue-50'
            }`}
          >
            {line}
          </button>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={() => selected !== null && onSubmit(selected)}
          disabled={selected === null || submitting}
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
