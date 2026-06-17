import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ChipList } from './ChipList';

const stack = ['TypeScript', 'React', 'Node', 'PostgreSQL', 'Redis', 'Docker'];

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

  it('marks overflow items with data-hidden when collapsed', () => {
    render(<ChipList label="Stack" items={stack} limit={4} variant="stack" />);
    expect(screen.getByText('TypeScript')).not.toHaveAttribute('data-hidden');
    expect(screen.getByText('Redis')).toHaveAttribute('data-hidden', 'true');
    expect(screen.getByText('Docker')).toHaveAttribute('data-hidden', 'true');
  });

  it('clears data-hidden on every item once expanded', async () => {
    const user = userEvent.setup();
    render(<ChipList label="Stack" items={stack} limit={4} variant="stack" />);
    await user.click(screen.getByRole('button', { name: /more/i }));
    for (const item of stack) {
      expect(screen.getByText(item)).not.toHaveAttribute('data-hidden');
    }
  });

  it('restores data-hidden after collapsing again', async () => {
    const user = userEvent.setup();
    render(<ChipList label="Stack" items={stack} limit={4} variant="stack" />);
    await user.click(screen.getByRole('button', { name: /more/i }));
    await user.click(screen.getByRole('button', { name: /less/i }));
    expect(screen.getByText('Redis')).toHaveAttribute('data-hidden', 'true');
    expect(screen.getByText('Docker')).toHaveAttribute('data-hidden', 'true');
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

  it('renders no toggle when the items fit within the limit', () => {
    render(<ChipList label="Methods" items={['Pair programming']} limit={4} variant="methods" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
