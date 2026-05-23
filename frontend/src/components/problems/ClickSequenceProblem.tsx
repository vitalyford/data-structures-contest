import { useState } from 'react';
import type { Problem } from '../../types/problems';
import { useLanguage } from '../../contexts/LanguageContext';
import { GraphCanvas } from './GraphCanvas';

interface Props {
  problem: Problem;
  onSubmit: (answer: unknown) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  submitting?: boolean;
}

interface NodeDef { id: string; x: number; y: number; }
interface EdgeDef { from: string; to: string; }

interface Data {
  nodes: NodeDef[];
  edges: EdgeDef[];
  directed: boolean;
}

export function ClickSequenceProblem({ problem, onSubmit, submitted, isCorrect, submitting = false }: Props) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? problem.en : problem.zh;
  const data = content.data as unknown as Data;
  const [sequence, setSequence] = useState<string[]>([]);

  const handleNodeClick = (id: string) => {
    if (submitted) return;
    setSequence((prev) => prev.includes(id) ? prev : [...prev, id]);
  };

  const reset = () => setSequence([]);

  return (
    <div className="space-y-4">
      <div className="flex gap-6 flex-wrap items-start">
        <div className="rounded-xl ring-1 ring-gray-200 bg-white p-4">
          <GraphCanvas
            nodes={data.nodes}
            edges={data.edges}
            directed={data.directed}
            onNodeClick={!submitted ? handleNodeClick : undefined}
            highlightedNodes={sequence}
          />
        </div>

        <div className="space-y-3 min-w-50">
          <p className="text-sm font-medium text-gray-700">Visit order:</p>
          <div className="flex flex-wrap gap-2">
            {sequence.map((id, i) => (
              <span key={`${id}-${i}`} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium ring-1 ring-blue-200">
                {i + 1}. {id}
              </span>
            ))}
          </div>
          {!submitted && (
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 underline">
              {t.resetSubmission}
            </button>
          )}
        </div>
      </div>

      {!submitted && (
        <button
          onClick={() => onSubmit(sequence)}
          disabled={sequence.length === 0 || submitting}
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
