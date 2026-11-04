import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Loading from './Loading';

afterEach(cleanup);

describe('Loading', () => {
  it('announces its message in a live region', () => {
    render(<Loading message="Checking access" showVerse={false} />);
    expect(screen.getByRole('status').textContent).toContain('Checking access');
  });

  it('shows a verse unless asked not to', () => {
    const { unmount } = render(<Loading />);
    expect(screen.getByRole('status').querySelector('cite')).toBeTruthy();
    unmount();
    render(<Loading showVerse={false} />);
    expect(screen.getByRole('status').querySelector('cite')).toBeNull();
  });

  it('renders straight into the body so no parent can clip it', () => {
    const { container } = render(<Loading showVerse={false} />);
    expect(container.firstChild).toBeNull();
    expect(screen.getByRole('status').parentElement).toBe(document.body);
  });
});
