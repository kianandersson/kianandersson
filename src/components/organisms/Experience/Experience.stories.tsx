import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import { Experience, type ExperienceEntry } from './Experience';

const ENTRIES: ExperienceEntry[] = [
  {
    id: 'a',
    company: 'Acme · Remote',
    role: 'Senior Frontend Engineer',
    period: '2023 — Present',
    description:
      'Led a team of four engineers on a design-system migration; cut JS shipped by 40% and Lighthouse Performance climbed to 99.',
    stack: ['TypeScript', 'React', 'Next.js', 'Vite', 'Vitest', 'Playwright'],
    domains: ['Design systems', 'Web performance', 'Accessibility'],
  },
  {
    id: 'b',
    company: 'Globex · Copenhagen',
    role: 'Frontend Engineer',
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
      if (entry.role) {
        await expect(canvas.getByText(entry.role)).toBeInTheDocument();
      }
      await expect(canvas.getByText(entry.company)).toBeInTheDocument();
      await expect(canvas.getByText(entry.period)).toBeInTheDocument();
      await expect(canvas.getByText(entry.description)).toBeInTheDocument();
    }
    for (const item of items) {
      await expect(within(item).getByText('Stack')).toBeInTheDocument();
      await expect(within(item).getByText('Domains')).toBeInTheDocument();
    }
  },
};

const WITH_PROJECTS: ExperienceEntry[] = [
  {
    id: 'c',
    company: 'Danske Bank',
    period: '2019 — 2023',
    description: 'A multi-year engagement spanning several delivery teams.',
    stack: [],
    domains: [],
    projects: [
      {
        id: 'c-0',
        title: 'Login Platform',
        role: 'Tech Lead',
        description: 'Designed and shipped the OAuth/OIDC platform used across the group.',
        stack: ['TypeScript', 'Node', 'OAuth'],
        domains: ['Authentication', 'API design'],
      },
      {
        id: 'c-1',
        title: 'Payments Gateway',
        role: 'Senior Engineer',
        description: 'Built the settlement pipeline and reconciliation tooling.',
        stack: ['Go', 'PostgreSQL'],
        domains: ['Distributed systems'],
      },
    ],
  },
];

export const WithProjects: Story = {
  args: { entries: WITH_PROJECTS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const entry = WITH_PROJECTS[0];

    // Company is the entry heading; the employment carries no role line here.
    await expect(
      canvas.getByRole('heading', { level: 3, name: entry.company }),
    ).toBeInTheDocument();
    await expect(canvas.getByText(entry.description)).toBeInTheDocument();

    for (const project of entry.projects ?? []) {
      await expect(
        canvas.getByRole('heading', { level: 4, name: project.title }),
      ).toBeInTheDocument();
      await expect(canvas.getByText(project.role)).toBeInTheDocument();
      await expect(canvas.getByText(project.description)).toBeInTheDocument();
    }

    // Each project carries its own Stack + Domains labels.
    await expect(canvas.getAllByText('Stack')).toHaveLength(2);
    await expect(canvas.getAllByText('Domains')).toHaveLength(2);
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
