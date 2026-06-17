import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { FieldLabel } from './FieldLabel';

describe('FieldLabel', () => {
  it('renders a label with the for attribute when one is supplied', () => {
    const { container } = render(<FieldLabel for="contact-from">From</FieldLabel>);
    const label = container.querySelector('label');
    expect(label).not.toBeNull();
    expect(label).toHaveAttribute('for', 'contact-from');
    expect(label).toHaveTextContent('From');
  });

  it('falls back to a span when no for is supplied', () => {
    const { container } = render(<FieldLabel>To</FieldLabel>);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });

  it('exposes the tone via a data attribute', () => {
    const { container } = render(<FieldLabel tone="muted">Languages</FieldLabel>);
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'muted');
  });
});
