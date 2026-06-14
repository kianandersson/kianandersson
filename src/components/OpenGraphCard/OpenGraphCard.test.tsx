import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { OpenGraphCard } from './OpenGraphCard';

const baseProps = {
  name: 'Kian Andersson',
  role: 'Senior Full-stack Engineer',
  skills: ['TypeScript', 'React', 'AWS'],
};

describe('OpenGraphCard', () => {
  it('shows the name, role and availability', () => {
    render(<OpenGraphCard {...baseProps} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('KianAndersson');
    expect(screen.getByText('Senior Full-stack Engineer')).toBeInTheDocument();
    expect(screen.getByText('Available for new projects')).toBeInTheDocument();
  });

  it('renders the given skills as chips', () => {
    render(<OpenGraphCard {...baseProps} />);
    for (const label of baseProps.skills) {
      expect(screen.getByText(label)).toHaveAttribute('data-variant', 'stack');
    }
  });
});
