import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('renders a span by default', () => {
    const { container } = render(<Text>Hello</Text>);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });

  it('renders a paragraph when as="p"', () => {
    const { container } = render(<Text as="p">Paragraph</Text>);
    expect(container.firstElementChild?.tagName).toBe('P');
  });

  it('renders a div when as="div"', () => {
    const { container } = render(<Text as="div">Div</Text>);
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  it('exposes size, tone, font, and weight as data attributes', () => {
    const { container } = render(
      <Text size="caption-s" tone="muted" font="mono" weight="semibold">
        Meta
      </Text>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('data-size', 'caption-s');
    expect(el).toHaveAttribute('data-tone', 'muted');
    expect(el).toHaveAttribute('data-font', 'mono');
    expect(el).toHaveAttribute('data-weight', 'semibold');
  });

  it('uses sensible defaults', () => {
    const { container } = render(<Text>Default</Text>);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('data-size', 'body');
    expect(el).toHaveAttribute('data-tone', 'default');
    expect(el).toHaveAttribute('data-font', 'sans');
    expect(el).toHaveAttribute('data-weight', 'regular');
  });
});
