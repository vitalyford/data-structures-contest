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
interface EdgeDef { id?: string; from: string; to: string; weight?: number; }
interface Data {
  nodes: NodeDef[];
  edges: EdgeDef[];
  directed: boolean;
}

export function ClickEdgesProblem({ problem, onSubmit, submitted, isCorrect, submitting = false }: Props) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? problem.en : problem.zh;
  const data = content.data as unknown as Data;
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleEdge = (id: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const PAD = 32;
  const canvasWidth = Math.max(...data.nodes.map((n) => n.x)) + PAD;
  const canvasHeight = Math.max(...data.nodes.map((n) => n.y)) + PAD;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Click edges to select/deselect them.</p>
      <div className="rounded-xl ring-1 ring-gray-200 bg-white p-4 inline-block">
        <GraphCanvas
          nodes={data.nodes}
          edges={data.edges}
          directed={data.directed}
          width={canvasWidth}
          height={canvasHeight}
          onEdgeClick={!submitted ? toggleEdge : undefined}
          highlightedEdges={[...selected]}
        />
      </div>

      <div className="text-sm text-gray-600">
        Selected: {[...selected].length > 0 ? [...selected].join(', ') : <span className="text-gray-400">none</span>}
      </div>

      {!submitted && (
        <button
          onClick={() => onSubmit([...selected])}
          disabled={selected.size === 0 || submitting}
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
