import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea aria-label="Message" placeholder="Write…" />);
    const ta = screen.getByPlaceholderText('Write…');
    expect(ta.tagName).toBe('TEXTAREA');
  });

  it('forwards required and disabled', () => {
    render(<Textarea id="m" required disabled />);
    const ta = document.getElementById('m') as HTMLTextAreaElement;
    expect(ta).toBeRequired();
    expect(ta).toBeDisabled();
  });

  it('reports input via onInput', async () => {
    const result: string[] = [];
    const handle = (event: Event) => result.push((event.target as HTMLTextAreaElement).value);
    const user = userEvent.setup();
    render(<Textarea id="m" onInput={handle} />);
    await user.type(document.getElementById('m') as HTMLTextAreaElement, 'hi');
    expect(result.at(-1)).toBe('hi');
  });
});
