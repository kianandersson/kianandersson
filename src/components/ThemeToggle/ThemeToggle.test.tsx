import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('renders a labelled toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });

  it('reports aria-pressed true when the current theme is dark', () => {
    document.documentElement.dataset.theme = 'dark';
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports aria-pressed false when the current theme is light', () => {
    document.documentElement.dataset.theme = 'light';
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('flips the html element theme on click', async () => {
    document.documentElement.dataset.theme = 'light';
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole('button'));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('persists the choice to localStorage on click', async () => {
    document.documentElement.dataset.theme = 'light';
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole('button'));
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('round-trips back to light on a second click', async () => {
    document.documentElement.dataset.theme = 'light';
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    await user.click(button);
    await user.click(button);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('keeps aria-pressed in sync without remount after toggling', async () => {
    document.documentElement.dataset.theme = 'light';
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
