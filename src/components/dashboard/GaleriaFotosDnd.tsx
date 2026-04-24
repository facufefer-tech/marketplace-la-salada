"use client";

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

function SortablePhoto({
  id,
  url,
  isMain,
  onSetMain,
  onRemove,
}: {
  id: string;
  url: string;
  isMain: boolean;
  onSetMain: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border ${
        isMain ? "border-orange-500 ring-2 ring-orange-500/40" : "border-zinc-600"
      }`}
    >
      <div {...attributes} {...listeners} className="absolute inset-0 z-10 cursor-grab" />
      <Image src={url} alt="" fill className="object-cover" sizes="80px" />
      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-between gap-0.5 bg-black/70 p-0.5 text-[10px] text-white">
        <button type="button" onClick={onSetMain} className="px-0.5 hover:text-orange-300">
          {isMain ? "★" : "portada"}
        </button>
        <button type="button" onClick={onRemove} className="px-0.5 text-rose-400">
          ×
        </button>
      </div>
    </div>
  );
}

type Props = {
  fotos: string[];
  principalIndex: number;
  onChange: (next: string[], principalIndex: number) => void;
  max?: number;
};

export function GaleriaFotosDnd({ fotos, principalIndex, onChange, max = 8 }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const safeIdx = fotos.length ? Math.min(fotos.length - 1, Math.max(0, principalIndex)) : 0;
  const mainUrl = fotos[safeIdx];

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oi = parseInt(String(active.id), 10);
    const ni = parseInt(String(over.id), 10);
    if (Number.isNaN(oi) || Number.isNaN(ni)) return;
    const nextP = arrayMove(fotos, oi, ni);
    const np = mainUrl != null ? Math.max(0, nextP.findIndex((u) => u === mainUrl)) : 0;
    onChange(nextP, nextP.length ? np : 0);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <p className="text-xs text-zinc-500 mb-2">
        Galería: {fotos.length} de {max} fotos (arrastrá para ordenar)
      </p>
      <SortableContext
        items={fotos.map((_, i) => String(i))}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex flex-wrap gap-2">
          {fotos.map((url, i) => (
            <SortablePhoto
              key={`${i}-${url.slice(-20)}`}
              id={String(i)}
              url={url}
              isMain={i === safeIdx}
              onSetMain={() => onChange(fotos, i)}
              onRemove={() => {
                const n = fotos.filter((_, j) => j !== i);
                onChange(n, n.length ? (i < safeIdx ? safeIdx - 1 : i === safeIdx ? 0 : safeIdx) : 0);
              }}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
