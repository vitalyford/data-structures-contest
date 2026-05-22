import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Problem } from '../../../../backend/src/data/problems';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  problem: Problem;
  onSubmit: (answer: unknown) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  submitting?: boolean;
}

interface Data {
  pool: string[];
  slots: number;
  slotLabels?: string[];
  layout?: 'vertical' | 'horizontal';
}

// Prefix IDs to distinguish slots from pool items in dnd-kit
const SLOT_PREFIX = 'slot__';
const POOL_PREFIX = 'pool__';

function DraggableChip({ id, label, inSlot }: { id: string; label: string; inSlot?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-4 py-2 rounded-xl ring-1 shadow-sm cursor-grab active:cursor-grabbing font-medium text-sm select-none ${
        inSlot
          ? 'bg-blue-50 ring-blue-300 text-blue-800'
          : 'bg-white ring-gray-200 text-gray-800'
      }`}
    >
      {label}
    </div>
  );
}

function EmptySlot({ id, wide }: { id: string; wide?: boolean }) {
  const { setNodeRef, isOver } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`px-4 py-2 rounded-xl ring-1 ring-dashed font-medium text-sm select-none min-h-10 ${
        wide ? 'min-w-24' : 'min-w-12'
      } ${isOver ? 'ring-blue-400 bg-blue-50' : 'ring-gray-300 bg-gray-50'}`}
    />
  );
}

export function DragOrderProblem({ problem, onSubmit, submitted, isCorrect, submitting = false }: Props) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? problem.en : problem.zh;
  const data = content.data as unknown as Data;

  // slots: array of length `data.slots`, each entry is a letter or null (empty)
  const [slots, setSlots] = useState<(string | null)[]>(Array(data.slots).fill(null));
  // pool: items not yet placed in slots
  const [pool, setPool] = useState<string[]>(data.pool);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Derive dnd-kit IDs: slots use "slot__0", "slot__1", etc.;
  // filled slots use "slot__<letter>"; pool items use "pool__<letter>"
  const slotIds = slots.map((v, i) => (v ? `${SLOT_PREFIX}${v}` : `${SLOT_PREFIX}empty${i}`));
  const poolIds = pool.map((v) => `${POOL_PREFIX}${v}`);

  const letterFromId = (id: string) => {
    if (id.startsWith(SLOT_PREFIX)) return id.slice(SLOT_PREFIX.length);
    if (id.startsWith(POOL_PREFIX)) return id.slice(POOL_PREFIX.length);
    return id;
  };

  const isSlotId = (id: string) => id.startsWith(SLOT_PREFIX);
  const isPoolId = (id: string) => id.startsWith(POOL_PREFIX);

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);
  const handleDragOver = (_e: DragOverEvent) => { /* no-op: we commit on drag end */ };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const fromId = active.id as string;
    const toId = over.id as string;

    const newSlots = [...slots];
    const newPool = [...pool];

    if (isSlotId(fromId) && isSlotId(toId)) {
      // Reorder within slots: swap the two slot positions
      const fromLetter = letterFromId(fromId);
      const toLetter = letterFromId(toId);
      const fromIdx = newSlots.findIndex((v, i) =>
        fromLetter.startsWith('empty') ? v === null && `${SLOT_PREFIX}empty${i}` === fromId : v === fromLetter
      );
      const toIdx = newSlots.findIndex((v, i) =>
        toLetter.startsWith('empty') ? v === null && `${SLOT_PREFIX}empty${i}` === toId : v === toLetter
      );
      if (fromIdx !== -1 && toIdx !== -1) {
        [newSlots[fromIdx], newSlots[toIdx]] = [newSlots[toIdx], newSlots[fromIdx]];
      }
    } else if (isPoolId(fromId) && isSlotId(toId)) {
      // Pool → slot: place pool item into target slot; displaced slot item goes back to pool
      const fromLetter = letterFromId(fromId);
      const toLetter = letterFromId(toId);
      const toIdx = newSlots.findIndex((v, i) =>
        toLetter.startsWith('empty') ? v === null && `${SLOT_PREFIX}empty${i}` === toId : v === toLetter
      );
      if (toIdx !== -1) {
        const displaced = newSlots[toIdx];
        newSlots[toIdx] = fromLetter;
        const poolIdx = newPool.indexOf(fromLetter);
        if (poolIdx !== -1) newPool.splice(poolIdx, 1);
        if (displaced !== null) newPool.push(displaced);
      }
    } else if (isSlotId(fromId) && isPoolId(toId)) {
      // Slot → pool: remove from slot, insert near target pool item
      const fromLetter = letterFromId(fromId);
      const toLetter = letterFromId(toId);
      const slotIdx = newSlots.findIndex((v) => v === fromLetter);
      if (slotIdx !== -1) {
        newSlots[slotIdx] = null;
        const targetPoolIdx = newPool.indexOf(toLetter);
        newPool.splice(targetPoolIdx >= 0 ? targetPoolIdx : newPool.length, 0, fromLetter);
      }
    } else if (isPoolId(fromId) && isPoolId(toId)) {
      // Reorder within pool
      const fromLetter = letterFromId(fromId);
      const toLetter = letterFromId(toId);
      const fi = newPool.indexOf(fromLetter);
      const ti = newPool.indexOf(toLetter);
      if (fi !== -1 && ti !== -1) {
        newPool.splice(fi, 1);
        newPool.splice(ti, 0, fromLetter);
      }
    }

    setSlots(newSlots);
    setPool(newPool);
  };

  const activeLabel = activeId ? letterFromId(activeId) : null;
  // submitted answer: only the filled slot values, in order (bottom → top)
  const slotAnswer = slots.map((v) => v ?? '');
  const isHorizontal = data.layout === 'horizontal';

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">{t.dragHint}</p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {isHorizontal ? (
            /* Horizontal slots — left to right */
            <SortableContext items={slotIds} strategy={horizontalListSortingStrategy}>
              <div className="flex flex-row flex-wrap gap-2 mb-4">
                {slots.map((item, i) => (
                  <div key={slotIds[i]} className="flex flex-col items-center gap-1">
                    {item ? (
                      <DraggableChip id={slotIds[i]} label={item} inSlot />
                    ) : (
                      <EmptySlot id={slotIds[i]} wide />
                    )}
                    {data.slotLabels?.[i] && (
                      <span className="text-xs text-gray-400">{data.slotLabels[i]}</span>
                    )}
                  </div>
                ))}
              </div>
            </SortableContext>
          ) : (
            /* Vertical stack slots — rendered bottom-to-top via flex-col-reverse */
            <SortableContext items={slotIds} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col-reverse gap-1 mb-4 w-fit min-w-30">
                {slots.map((item, i) => (
                  <div key={slotIds[i]} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-16 text-right">
                      {data.slotLabels?.[i] ?? `Slot ${i + 1}`}
                    </span>
                    {item ? (
                      <DraggableChip id={slotIds[i]} label={item} inSlot />
                    ) : (
                      <EmptySlot id={slotIds[i]} />
                    )}
                  </div>
                ))}
              </div>
            </SortableContext>
          )}

          {pool.length > 0 && (
            <>
              <hr className="my-2 border-gray-100" />
              <p className="text-xs text-gray-400 mb-2">Pool — drag items into slots above</p>
              <SortableContext items={poolIds} strategy={horizontalListSortingStrategy}>
                <div className="flex flex-wrap gap-2">
                  {pool.map((item) => (
                    <DraggableChip key={`${POOL_PREFIX}${item}`} id={`${POOL_PREFIX}${item}`} label={item} />
                  ))}
                </div>
              </SortableContext>
            </>
          )}

          <DragOverlay>
            {activeLabel && (
              <div className="px-4 py-2 bg-blue-50 rounded-xl ring-2 ring-blue-400 shadow-lg font-medium text-blue-700 text-sm">
                {activeLabel}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {!submitted && (
        <button
          onClick={() => onSubmit(slotAnswer)}
          disabled={slots.some((v) => v === null) || submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
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
