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

interface Option { id: string; text: string; }

export function MultiChoiceProblem({ problem, onSubmit, submitted, isCorrect, submitting = false }: Props) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? problem.en : problem.zh;
  const options = (content.data as { options: Option[] }).options;
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            disabled={submitted}
            onClick={() => !submitted && setSelected(opt.id)}
            className={`text-left px-4 py-3 rounded-xl ring-1 transition-all text-sm ${
              selected === opt.id
                ? submitted
                  ? isCorrect
                    ? 'ring-blue-600 bg-blue-100 text-blue-900'
                    : 'ring-amber-400 bg-amber-50 text-amber-800'
                  : 'ring-blue-500 bg-blue-50 text-blue-800'
                : 'ring-gray-200 bg-white text-gray-700 hover:ring-blue-300 hover:bg-blue-50/30'
            }`}
          >
            <span className="font-semibold mr-2">{opt.id}.</span> {opt.text}
          </button>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={() => selected && onSubmit(selected)}
          disabled={!selected || submitting}
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
