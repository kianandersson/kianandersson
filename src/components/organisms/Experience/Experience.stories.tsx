import type { Meta, StoryObj } from '@storybook/preact-vite';
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
    methods: ['TDD', 'Atomic design', 'Pair programming'],
  },
  {
    id: 'b',
    role: 'Frontend Engineer',
    meta: 'Globex · Copenhagen',
    period: '2020 — 2023',
    description:
      'Owned the public-facing booking flow end-to-end; introduced contract-tested integration tests and removed three flaky CI suites.',
    stack: ['TypeScript', 'React', 'Webpack', 'Node'],
    methods: ['Trunk-based development', 'Contract testing'],
  },
];

const meta: Meta<typeof Experience> = {
  title: 'Organisms/Experience',
  component: Experience,
  args: { entries: ENTRIES },
};

export default meta;
type Story = StoryObj<typeof Experience>;

export const Default: Story = {};
