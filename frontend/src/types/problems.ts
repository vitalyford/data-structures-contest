export type ProblemType =
  | 'drag-order'
  | 'multi-choice'
  | 'checkbox-multi'
  | 'click-sequence'
  | 'click-bug'
  | 'drag-match'
  | 'fill-matrix'
  | 'click-edges'
  | 'drag-priority'
  | 'click-cells';

export interface ProblemContent {
  title: string;
  teaching?: string;
  description: string;
  data: Record<string, unknown>;
}

export interface Problem {
  id: string;
  topic: 'stacks' | 'queues' | 'graphs';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  type: ProblemType;
  en: ProblemContent;
  zh: ProblemContent;
  answer: unknown;
}
