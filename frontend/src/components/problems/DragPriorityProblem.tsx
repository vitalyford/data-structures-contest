import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Problem } from '../../types/problems';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  problem: Problem;
  onSubmit: (answer: unknown) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  submitting?: boolean;
}

interface Patient { name: string; condition: string; urgency: number; }
interface QueueItem { id: string; priority: number; label: string; }
interface Data { items?: QueueItem[]; patients?: Patient[]; }

function normalizeItems(data: Data): QueueItem[] {
  if (data.items) return data.items;
  if (data.patients) return data.patients.map((p) => ({
    id: p.name,
    priority: p.urgency,
    label: p.name,
    sublabel: p.condition,
  }));
  return [];
}

function SortableRow({ item }: { item: QueueItem & { sublabel?: string } }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
      className="flex items-center gap-4 px-4 py-3 bg-white rounded-xl ring-1 ring-gray-200 shadow-sm cursor-grab active:cursor-grabbing select-none"
    >
      <span className="text-gray-400 text-sm">⠿</span>
      <span className="font-medium text-gray-800 flex-1">
        {item.label}
        {item.sublabel && <span className="ml-1 text-gray-500 font-normal text-xs">— {item.sublabel}</span>}
      </span>
      <span className="text-xs text-gray-400 font-mono">priority: {item.priority}</span>
    </div>
  );
}

export function DragPriorityProblem({ problem, onSubmit, submitted, isCorrect, submitting = false }: Props) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? problem.en : problem.zh;
  const data = content.data as unknown as Data;
  const [items, setItems] = useState(() => normalizeItems(data));
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const from = prev.findIndex((x) => x.id === active.id);
        const to = prev.findIndex((x) => x.id === over.id);
        return arrayMove(prev, from, to);
      });
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 max-w-sm">
            {items.map((item) => <SortableRow key={item.id} item={item} />)}
          </div>
        </SortableContext>
      </DndContext>

      {!submitted && (
        <button
          onClick={() => onSubmit(items.map((i) => i.id))}
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
