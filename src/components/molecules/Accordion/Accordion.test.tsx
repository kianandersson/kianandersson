import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion } from './Accordion';

const noop = () => {};

describe('Accordion', () => {
  it('renders the title on the trigger', () => {
    render(
      <Accordion title="Programming Languages" isOpen={false} onToggle={noop}>
        <p>panel content</p>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: /Programming Languages/i })).toBeInTheDocument();
  });

  it('reflects the collapsed state via aria-expanded and inert', () => {
    const { container } = render(
      <Accordion title="Programming Languages" isOpen={false} onToggle={noop}>
        <p>panel content</p>
      </Accordion>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const panelId = trigger.getAttribute('aria-controls');
    expect(container.querySelector(`#${panelId}`)).toHaveAttribute('inert');
  });

  it('reflects the expanded state via aria-expanded and no inert', () => {
    const { container } = render(
      <Accordion title="Programming Languages" isOpen={true} onToggle={noop}>
        <p>panel content</p>
      </Accordion>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panelId = trigger.getAttribute('aria-controls');
    expect(container.querySelector(`#${panelId}`)).not.toHaveAttribute('inert');
  });

  it('calls onToggle when the trigger is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <Accordion title="Programming Languages" isOpen={false} onToggle={onToggle}>
        <p>panel content</p>
      </Accordion>,
    );
    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('links the trigger to the panel via aria-controls', () => {
    const { container } = render(
      <Accordion title="Programming Languages" isOpen={false} onToggle={noop}>
        <p>panel content</p>
      </Accordion>,
    );
    const trigger = screen.getByRole('button');
    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(container.querySelector(`#${panelId}`)).not.toBeNull();
  });

  it('keeps panel content in the DOM even when collapsed', () => {
    const { container } = render(
      <Accordion title="Programming Languages" isOpen={false} onToggle={noop}>
        <p>panel content</p>
      </Accordion>,
    );
    expect(container.textContent).toContain('panel content');
  });

  it('shows the optional count next to the title', () => {
    render(
      <Accordion title="Programming Languages" count={5} isOpen={false} onToggle={noop}>
        <p>panel content</p>
      </Accordion>,
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
