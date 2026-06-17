import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ChipList } from './ChipList';

const stack = ['TypeScript', 'React', 'Node', 'PostgreSQL', 'Redis', 'Docker'];

function overflow(container: Element) {
  return container.querySelector('[data-shown]');
}

describe('ChipList', () => {
  it('renders the label', () => {
    render(<ChipList label="Stack" items={stack} limit={4} variant="stack" />);
    expect(screen.getByText('Stack')).toBeInTheDocument();
  });

  it('renders every item into the DOM even when collapsed', () => {
    render(<ChipList label="Stack" items={stack} limit={4} variant="stack" />);
    for (const item of stack) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it('hides the overflow bucket when collapsed', () => {
    const { container } = render(
      <ChipList label="Stack" items={stack} limit={4} variant="stack" />,
    );
    const bucket = overflow(container);
    expect(bucket).not.toBeNull();
    expect(bucket).toHaveAttribute('data-shown', 'false');
    expect(bucket).toContainElement(screen.getByText('Redis'));
    expect(bucket).toContainElement(screen.getByText('Docker'));
  });

  it('reveals the overflow bucket once expanded', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ChipList label="Stack" items={stack} limit={4} variant="stack" />,
    );
    await user.click(screen.getByRole('button', { name: /more/i }));
    expect(overflow(container)).toHaveAttribute('data-shown', 'true');
  });

  it('hides the overflow bucket again after collapsing', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ChipList label="Stack" items={stack} limit={4} variant="stack" />,
    );
    await user.click(screen.getByRole('button', { name: /more/i }));
    await user.click(screen.getByRole('button', { name: /less/i }));
    expect(overflow(container)).toHaveAttribute('data-shown', 'false');
  });

  it('reports the count of overflow items in the collapsed toggle label', () => {
    render(<ChipList label="Stack" items={stack} limit={4} variant="stack" />);
    expect(screen.getByRole('button', { name: /2 more/i })).toBeInTheDocument();
  });

  it('reflects the expanded state via aria-expanded', async () => {
    const user = userEvent.setup();
    render(<ChipList label="Stack" items={stack} limit={4} variant="stack" />);
    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders neither toggle nor overflow bucket when items fit within the limit', () => {
    const { container } = render(
      <ChipList label="Methods" items={['Pair programming']} limit={4} variant="methods" />,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(overflow(container)).toBeNull();
  });
});
