import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { FieldLabel } from './FieldLabel';

describe('FieldLabel', () => {
  it('renders a label with the for attribute', () => {
    const { container } = render(<FieldLabel for="contact-from">From</FieldLabel>);
    const label = container.querySelector('label');
    expect(label).not.toBeNull();
    expect(label).toHaveAttribute('for', 'contact-from');
    expect(label).toHaveTextContent('From');
  });

  it('defaults to the subtle tone and exposes it as a data attribute', () => {
    const { container } = render(<FieldLabel for="x">Hi</FieldLabel>);
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'subtle');
  });

  it('exposes an explicit tone via a data attribute', () => {
    const { container } = render(
      <FieldLabel for="x" tone="muted">
        Hi
      </FieldLabel>,
    );
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'muted');
  });
});
