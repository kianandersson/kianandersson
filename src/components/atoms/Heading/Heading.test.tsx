import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders h1 for level 1', () => {
    render(
      <Heading level={1} size="display-xl">
        Title
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 1, name: /title/i })).toBeInTheDocument();
  });

  it('renders h2 for level 2', () => {
    render(
      <Heading level={2} size="m">
        Section
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 2, name: /section/i })).toBeInTheDocument();
  });

  it('renders h3 for level 3', () => {
    render(
      <Heading level={3} size="s">
        Subsection
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 3, name: /subsection/i })).toBeInTheDocument();
  });

  it('exposes the size as a data attribute for styling', () => {
    render(
      <Heading level={2} size="l">
        Heading
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('data-size', 'l');
  });

  it('forwards id to the heading element', () => {
    render(
      <Heading level={2} size="m" id="experience-heading">
        Experience
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'experience-heading');
  });
});
