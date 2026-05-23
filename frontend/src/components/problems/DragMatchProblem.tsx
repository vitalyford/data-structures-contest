import { useState } from 'react';
import type { Problem } from '../../types/problems';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  problem: Problem;
  onSubmit: (answer: unknown) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  submitting?: boolean;
}

interface MatchItem { id: string; text: string; }
interface Data { left: MatchItem[] | string[]; right: MatchItem[] | string[]; }

export function DragMatchProblem({ problem, onSubmit, submitted, isCorrect, submitting = false }: Props) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? problem.en : problem.zh;
  const rawData = content.data as unknown as Data;

  // Normalize to always have id/text
  const normalize = (arr: MatchItem[] | string[]): MatchItem[] =>
    arr.map((item) => typeof item === 'string' ? { id: item, text: item } : item);

  const leftItems = normalize(rawData.left);
  const rightItems = normalize(rawData.right);

  const [matches, setMatches] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);

  const handleDrop = (leftId: string) => {
    if (!dragging || submitted) return;
    setMatches((prev) => {
      const next = { ...prev };
      // Remove any previous mapping to dragging
      Object.keys(next).forEach((k) => { if (next[k] === dragging) delete next[k]; });
      next[leftId] = dragging;
      return next;
    });
    setDragging(null);
  };

  const matchedRight = new Set(Object.values(matches));

  return (
    <div className="space-y-4">
      <div className="flex gap-8 flex-wrap items-start">
        {/* Left column */}
        <div className="space-y-2">
          {leftItems.map((item) => (
            <div
              key={item.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ring-1 min-w-40 min-h-11 transition-colors ${
                matches[item.id] ? 'ring-blue-300 bg-blue-50' : 'ring-gray-200 bg-white'
              }`}
            >
              <span className="font-medium text-gray-800 text-sm">{item.text}</span>
              <span className="ml-auto text-lg">→</span>
              {matches[item.id] && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  {matches[item.id]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Right column (draggable) */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Drag to match</p>
          {rightItems.map((item) => (
            <div
              key={item.id}
              draggable={!submitted}
              onDragStart={() => setDragging(item.id)}
              onDragEnd={() => setDragging(null)}
              className={`px-4 py-3 rounded-xl ring-1 cursor-grab active:cursor-grabbing text-sm font-medium select-none transition-all ${
                matchedRight.has(item.id)
                  ? 'ring-gray-200 bg-gray-50 text-gray-400'
                  : 'ring-gray-200 bg-white text-gray-800 hover:ring-blue-300 hover:shadow-sm'
              } ${dragging === item.id ? 'opacity-50 scale-95' : ''}`}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {!submitted && (
        <button
          onClick={() => onSubmit(matches)}
          disabled={Object.keys(matches).length < leftItems.length || submitting}
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
