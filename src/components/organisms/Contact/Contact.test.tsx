import { hydrate } from 'preact';
import { act } from 'preact/test-utils';
import { renderToString } from 'preact-render-to-string';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Contact } from './Contact';

// The page is prerendered at build time and hydrated later. Preact's hydration
// patches text but not attributes, so availability must render from the build
// time first and only then switch to the visitor's clock — otherwise a build
// from before `availableFrom` keeps its warning tone after the date has passed.
// This needs real SSR + hydrate, which a Storybook play() cannot drive.
describe('Contact availability after hydration', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('switches to available when the build predates availableFrom', async () => {
    const availableFrom = new Date('2026-11-02T00:00:00Z');
    const buildTime = new Date('2026-10-23T12:00:00Z');
    const visitTime = new Date('2026-11-10T12:00:00Z');
    const onSend = async () => ({});

    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(buildTime);
    const renderedAt = Date.now();
    const props = { recipientName: 'Kian', availableFrom, renderedAt, onSend };
    const container = document.createElement('div');
    container.innerHTML = renderToString(<Contact {...props} />);
    document.body.append(container);

    vi.setSystemTime(visitTime);
    await act(() => {
      hydrate(<Contact {...props} />, container);
    });

    expect(container.querySelector('[data-tone]')?.getAttribute('data-tone')).toBe('success');
    expect(container.textContent).toContain('Available for work');
    expect(container.querySelector('button[aria-label]')?.getAttribute('aria-label')).toBe(
      'Get in touch',
    );
    container.remove();
  });
});
