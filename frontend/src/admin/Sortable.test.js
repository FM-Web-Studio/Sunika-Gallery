import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SortableList, reorderAfterDrop } from './Sortable';

afterEach(cleanup);

const items = [{ id: 'a', title: 'Alpha' }, { id: 'b', title: 'Beta' }, { id: 'c', title: 'Gamma' }];

const List = ({ onReorder, onEdit }) => (
  <SortableList items={items} getId={(a) => a.id} onReorder={onReorder}>
    {(a, i, handle) => (
      <>
        <div {...handle} aria-label={`Drag ${a.title}`}>{a.title}</div>
        <button type="button" onClick={() => onEdit(a.id)}>Edit {a.title}</button>
      </>
    )}
  </SortableList>
);

describe('SortableList', () => {
  it('keeps buttons inside a row clickable', () => {
    const onEdit = vi.fn();
    const onReorder = vi.fn();
    render(<List onReorder={onReorder} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Edit Beta'));
    expect(onEdit).toHaveBeenCalledWith('b');
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('only makes the drag area draggable, not the buttons', () => {
    render(<List onReorder={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByLabelText('Drag Alpha').getAttribute('aria-roledescription')).toBe('sortable');
    expect(screen.getByText('Edit Alpha').getAttribute('aria-roledescription')).toBeNull();
  });

  it('renders the rows in the given order', () => {
    render(<List onReorder={vi.fn()} onEdit={vi.fn()} />);
    const handles = screen.getAllByLabelText(/^Drag /).map((el) => el.textContent);
    expect(handles).toEqual(['Alpha', 'Beta', 'Gamma']);
  });
});

describe('reorderAfterDrop', () => {
  const ids = ['a', 'b', 'c'];

  it('moves a piece down and up', () => {
    expect(reorderAfterDrop(items, ids, 'a', 'c').map((x) => x.id)).toEqual(['b', 'c', 'a']);
    expect(reorderAfterDrop(items, ids, 'c', 'a').map((x) => x.id)).toEqual(['c', 'a', 'b']);
  });

  it('does nothing when dropped on itself or outside the list', () => {
    expect(reorderAfterDrop(items, ids, 'b', 'b')).toBeNull();
    expect(reorderAfterDrop(items, ids, 'b', undefined)).toBeNull();
    expect(reorderAfterDrop(items, ids, 'b', 'zzz')).toBeNull();
  });

  it('does not change the original list', () => {
    reorderAfterDrop(items, ids, 'a', 'c');
    expect(items.map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });
});
