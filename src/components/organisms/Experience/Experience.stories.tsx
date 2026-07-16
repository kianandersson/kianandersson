import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Experience, type ExperienceEntry } from './Experience';

const ENTRIES: ExperienceEntry[] = [
  {
    id: 'a',
    role: 'Senior Frontend Engineer',
    meta: 'Acme · Remote',
    period: '2023 — Present',
    description:
      'Led a team of four engineers on a design-system migration; cut JS shipped by 40% and Lighthouse Performance climbed to 99.',
    stack: ['TypeScript', 'React', 'Next.js', 'Vite', 'Vitest', 'Playwright'],
    domains: ['Design systems', 'Web performance', 'Accessibility'],
  },
  {
    id: 'b',
    role: 'Frontend Engineer',
    meta: 'Globex · Copenhagen',
    period: '2020 — 2023',
    description:
      'Owned the public-facing booking flow end-to-end; introduced contract-tested integration tests and removed three flaky CI suites.',
    stack: ['TypeScript', 'React', 'Webpack', 'Node'],
    domains: ['Developer experience', 'Continuous delivery'],
  },
];

const meta: Meta<typeof Experience> = {
  title: 'Organisms/Experience',
  component: Experience,
  args: { entries: ENTRIES },
};

export default meta;
type Story = StoryObj<typeof Experience>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 2, name: /Experience/i }),
    ).toBeInTheDocument();
    const entries = args.entries as ExperienceEntry[];
    const items = canvas.getAllByRole('listitem');
    await expect(items).toHaveLength(entries.length);
    for (const entry of entries) {
      await expect(canvas.getByText(entry.role)).toBeInTheDocument();
      await expect(canvas.getByText(entry.meta)).toBeInTheDocument();
      await expect(canvas.getByText(entry.period)).toBeInTheDocument();
      await expect(canvas.getByText(entry.description)).toBeInTheDocument();
    }
    for (const item of items) {
      await expect(within(item).getByText('Stack')).toBeInTheDocument();
      await expect(within(item).getByText('Domains')).toBeInTheDocument();
    }
  },
};

const LONG_PARAGRAPHS = [
  'When the platform made login a cornerstone of its new strategy, the existing SaaS identity provider could no longer carry the ambition. It could not scale affordably, it fell short of the performance it had promised, and it constrained both the user experience and the protocols the product needed to support.',
  'I built the platform, and the six-person team behind it, from scratch. I set the technical direction, designed the architecture, and implemented the foundation the system is built on, with a high security bar from day one.',
  'The platform scaled to millions of users, replacing a SaaS contract worth millions a year at a fraction of the infrastructure cost, delivered through a zero-downtime migration of every existing account.',
].join('\n\n');

const LONG_ENTRY: ExperienceEntry[] = [
  {
    id: 'long',
    role: 'Tech Lead',
    meta: 'Acme · Copenhagen',
    period: '2022 — Present',
    description: LONG_PARAGRAPHS,
    stack: ['TypeScript', 'Node', 'React', 'OAuth', 'OpenID Connect'],
    domains: ['Identity', 'Platform engineering', 'Web performance'],
  },
];

// A long, multi-paragraph description clamps to a preview and toggles open via
// the pure-CSS checkbox; the label swaps between "Read more" and "Read less".
export const ReadMore: Story = {
  args: { entries: LONG_ENTRY },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Every paragraph is in the DOM regardless of the collapsed state.
    await expect(canvas.getByText(/cornerstone of its new strategy/)).toBeInTheDocument();
    await expect(canvas.getByText(/zero-downtime migration/)).toBeInTheDocument();

    const toggle = canvas.getByRole('checkbox');
    await expect(toggle).not.toBeChecked();

    await userEvent.click(canvas.getByText(/read more/i));
    await expect(toggle).toBeChecked();
  },
};

export const EmptyBehavior: Story = {
  args: { entries: [] },
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryAllByRole('listitem')).toHaveLength(0);
  },
};
