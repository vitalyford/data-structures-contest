import { useState } from 'react';
import type { Problem } from '../../../../backend/src/data/problems';
import { useLanguage } from '../../contexts/LanguageContext';
import { GraphCanvas } from './GraphCanvas';

interface Props {
  problem: Problem;
  onSubmit: (answer: unknown) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  submitting?: boolean;
}

interface Option { id: string; text: string; }
interface NodeDef { id: string; x: number; y: number; }
interface EdgeDef { from: string; to: string; }
interface GraphDef { id: string; label: string; nodes: NodeDef[]; edges: EdgeDef[]; directed: boolean; }

export function CheckboxMultiProblem({ problem, onSubmit, submitted, isCorrect, submitting = false }: Props) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? problem.en : problem.zh;
  const data = content.data as {
    options: Option[];
    graphs?: GraphDef[];
    nodes?: NodeDef[];
    edges?: EdgeDef[];
    directed?: boolean;
  };
  const options = data.options;
  const graphs: GraphDef[] = data.graphs ?? [];
  const graphMap = Object.fromEntries(graphs.map((g) => [g.id, g]));
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Single inline graph (e.g. Graph Property Classifier)
  const hasInlineGraph = !!data.nodes;
  const inlineNodes: NodeDef[] = data.nodes ?? [];
  const inlineEdges: EdgeDef[] = data.edges ?? [];
  const inlineDirected: boolean = data.directed ?? false;
  const inlinePAD = 28;
  const inlineW = hasInlineGraph ? Math.max(...inlineNodes.map((n) => n.x)) + inlinePAD : 0;
  const inlineH = hasInlineGraph ? Math.max(...inlineNodes.map((n) => n.y)) + inlinePAD : 0;

  const toggle = (id: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Compute bounding box for a graph's nodes and add padding
  const getGraphDims = (g: GraphDef) => {
    const PAD = 28;
    const maxX = Math.max(...g.nodes.map((n) => n.x)) + PAD;
    const maxY = Math.max(...g.nodes.map((n) => n.y)) + PAD;
    return { w: maxX, h: maxY };
  };

  const hasGraphs = graphs.length > 0;

  return (
    <div className="space-y-4">
      {hasInlineGraph && (
        <div className="rounded-xl ring-1 ring-gray-200 bg-white p-4 inline-block">
          <GraphCanvas
            nodes={inlineNodes}
            edges={inlineEdges}
            directed={inlineDirected}
            width={inlineW}
            height={inlineH}
          />
        </div>
      )}
      <div className={`${hasGraphs ? 'grid grid-cols-2 gap-3 sm:grid-cols-3' : 'flex flex-col gap-2'}`}>
        {options.map((opt) => {
          const checked = selected.has(opt.id);
          const graph = graphMap[opt.id];
          const dims = graph ? getGraphDims(graph) : null;
          return (
            <button
              key={opt.id}
              disabled={submitted}
              onClick={() => toggle(opt.id)}
              className={`text-left px-4 py-3 rounded-xl ring-1 transition-all text-sm ${hasGraphs ? 'flex flex-col items-start gap-2' : 'flex items-center gap-3'} ${
                checked
                  ? submitted
                    ? isCorrect
                    ? 'ring-blue-600 bg-blue-100 text-blue-900'
                    : 'ring-amber-400 bg-amber-50 text-amber-800'
                    : 'ring-blue-500 bg-blue-50 text-blue-800'
                  : 'ring-gray-200 bg-white text-gray-700 hover:ring-blue-300'
              }`}
            >
              <span className={`flex items-center gap-2 ${hasGraphs ? 'w-full' : ''}`}>
                <span className={`w-4 h-4 rounded shrink-0 flex items-center justify-center ring-1 ${
                  checked ? 'bg-blue-600 ring-blue-600' : 'bg-white ring-gray-300'
                }`}>
                  {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                </span>
                {opt.text}
              </span>
              {graph && dims && (
                <div className="w-full pointer-events-none">
                  <GraphCanvas
                    nodes={graph.nodes}
                    edges={graph.edges}
                    directed={graph.directed}
                    width={dims.w}
                    height={dims.h}
                  />
                </div>
              )}
            </button>
          );
        })}
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
