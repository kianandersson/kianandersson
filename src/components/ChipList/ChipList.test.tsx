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

  it('starts collapsed, showing only `limit` items', () => {
    render(<ChipList label="Stack" items={stack} limit={4} variant="stack" />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.queryByText('Redis')).not.toBeInTheDocument();
    expect(screen.queryByText('Docker')).not.toBeInTheDocument();
  });

  it('reveals every item after the user clicks "show more"', async () => {
    const user = userEvent.setup();
    render(<ChipList label="Stack" items={stack} limit={4} variant="stack" />);
    await user.click(screen.getByRole('button', { name: /more/i }));
    expect(screen.getByText('Redis')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('collapses back when the user clicks "show less"', async () => {
    const user = userEvent.setup();
    render(<ChipList label="Stack" items={stack} limit={4} variant="stack" />);
    await user.click(screen.getByRole('button', { name: /more/i }));
    await user.click(screen.getByRole('button', { name: /less/i }));
    expect(screen.queryByText('Redis')).not.toBeInTheDocument();
    expect(screen.queryByText('Docker')).not.toBeInTheDocument();
  });

  it('reports the count of hidden items in the collapsed toggle label', () => {
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
