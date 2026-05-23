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

interface Data { nodes: string[]; edges?: unknown[]; directed?: boolean; graphLayout?: unknown[] }

export function FillMatrixProblem({ problem, onSubmit, submitted, isCorrect, submitting = false }: Props) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? problem.en : problem.zh;
  const data = content.data as unknown as Data;
  const n = data.nodes.length;
  const [matrix, setMatrix] = useState<number[][]>(
    Array.from({ length: n }, () => Array(n).fill(0))
  );

  const toggle = (r: number, c: number) => {
    if (submitted || r === c) return;
    setMatrix((prev) => prev.map((row, ri) =>
      row.map((cell, ci) => ri === r && ci === c ? (cell === 0 ? 1 : 0) : cell)
    ));
  };

  const getSelectedPairs = () => {
    const pairs: number[][] = [];
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        if (matrix[r][c] === 1) pairs.push([r, c]);
    return pairs;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Click cells to toggle 0/1. Diagonal cells are always 0.</p>
      <div className="overflow-x-auto">
        <table className="border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-10 h-10" />
              {data.nodes.map((n) => (
                <th key={n} className="w-10 h-10 text-center font-semibold text-gray-600">{n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, r) => (
              <tr key={r}>
                <td className="w-10 h-10 text-center font-semibold text-gray-600">{data.nodes[r]}</td>
                {row.map((cell, c) => (
                  <td
                    key={c}
                    onClick={() => toggle(r, c)}
                    className={`w-10 h-10 text-center border border-gray-200 transition-colors ${
                      r === c
                        ? 'bg-gray-100 text-gray-300 cursor-default'
                        : cell === 1
                          ? submitted
                            ? isCorrect ? 'bg-blue-600 text-white cursor-default' : 'bg-amber-400 text-gray-900 cursor-default'
                            : 'bg-blue-500 text-white cursor-pointer'
                          : 'bg-white hover:bg-blue-50 cursor-pointer text-gray-700'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!submitted && (
        <button
          onClick={() => onSubmit(getSelectedPairs())}
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
