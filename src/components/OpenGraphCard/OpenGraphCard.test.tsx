import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { OpenGraphCard } from './OpenGraphCard';

const PAST = new Date(Date.now() - 24 * 60 * 60 * 1000);
const FUTURE = new Date('2099-09-01T00:00:00Z');

const baseProps = {
  name: 'Kian Andersson',
  role: 'Senior Full-stack Engineer',
  skills: ['TypeScript', 'React', 'AWS'],
};

describe('OpenGraphCard', () => {
  it('shows the name and role', () => {
    render(<OpenGraphCard {...baseProps} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('KianAndersson');
    expect(screen.getByText('Senior Full-stack Engineer')).toBeInTheDocument();
  });

  it('shows the immediate availability pill when availableFrom is in the past', () => {
    render(<OpenGraphCard {...baseProps} availableFrom={PAST} />);
    expect(screen.getByText('Available for new projects')).toBeInTheDocument();
  });

  it('announces a future start date when availableFrom is in the future', () => {
    const { container } = render(<OpenGraphCard {...baseProps} availableFrom={FUTURE} />);
    expect(container.textContent).toContain('Available from 01.09.2099');
  });

  it('hides the pill when availableFrom is undefined', () => {
    render(<OpenGraphCard {...baseProps} />);
    expect(screen.queryByText(/available/i)).not.toBeInTheDocument();
  });

  it('renders the given skills as chips', () => {
    render(<OpenGraphCard {...baseProps} />);
    for (const label of baseProps.skills) {
      expect(screen.getByText(label)).toHaveAttribute('data-variant', 'stack');
    }
  });
});
