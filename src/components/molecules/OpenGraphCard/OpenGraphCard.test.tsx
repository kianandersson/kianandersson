import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { OpenGraphCard } from './OpenGraphCard';

const baseProps = {
  firstName: 'Kian',
  lastName: 'Andersson',
  role: 'Senior Full-stack Engineer',
  skills: ['TypeScript', 'React', 'AWS'],
};

describe('OpenGraphCard', () => {
  it('shows the name and role', () => {
    render(<OpenGraphCard {...baseProps} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('KianAndersson');
    expect(screen.getByText('Senior Full-stack Engineer')).toBeInTheDocument();
  });

  it('renders the given skills as chips', () => {
    render(<OpenGraphCard {...baseProps} />);
    for (const label of baseProps.skills) {
      expect(screen.getByText(label)).toHaveAttribute('data-variant', 'stack');
    }
  });
});
