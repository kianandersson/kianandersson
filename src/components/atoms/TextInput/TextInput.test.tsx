import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders a text input by default', () => {
    render(<TextInput id="username" placeholder="Username" />);
    const input = screen.getByPlaceholderText('Username');
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('honours an explicit type', () => {
    render(<TextInput type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
  });

  it('forwards required and disabled', () => {
    render(<TextInput id="x" required disabled />);
    const input = document.getElementById('x') as HTMLInputElement;
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it('reports typing via onInput', async () => {
    const user = userEvent.setup();
    const handle = (event: Event) => result.push((event.target as HTMLInputElement).value);
    const result: string[] = [];
    render(<TextInput id="t" onInput={handle} />);
    await user.type(document.getElementById('t') as HTMLInputElement, 'ab');
    expect(result.at(-1)).toBe('ab');
  });
});
