import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, arrayMove, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import styles from './Sortable.module.css';

export const Grip = () => (
  <svg className={styles.grip} viewBox="0 0 12 18" aria-hidden="true">
    {[3, 9, 15].map((y) => (
      <g key={y}><circle cx="3" cy={y} r="1.5" /><circle cx="9" cy={y} r="1.5" /></g>
    ))}
  </svg>
);

export const reorderAfterDrop = (items, ids, activeId, overId) => {
  if (!overId || activeId === overId) return null;
  const from = ids.indexOf(activeId);
  const to = ids.indexOf(overId);
  return from >= 0 && to >= 0 ? arrayMove(items, from, to) : null;
};

const Item = ({ id, className, render }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Translate.toString(transform), transition };
  const handle = { ref: setActivatorNodeRef, ...attributes, ...listeners, className: styles.handle };
  return (
    <li ref={setNodeRef} style={style} className={`${className || ''} ${isDragging ? styles.dragging : ''}`}>
      {render(handle)}
    </li>
  );
};

export const SortableList = ({ items, getId, onReorder, className, itemClassName, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const ids = items.map((item) => String(getId(item)));

  const onDragEnd = ({ active, over }) => {
    const next = reorderAfterDrop(items, ids, active.id, over?.id);
    if (next) onReorder(next);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ol className={className}>
          {items.map((item, i) => (
            <Item key={ids[i]} id={ids[i]} className={itemClassName} render={(handle) => children(item, i, handle)} />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
};
