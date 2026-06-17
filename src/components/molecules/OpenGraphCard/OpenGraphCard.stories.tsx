import type { Decorator, Meta, StoryObj } from '@storybook/preact-vite';
import { OpenGraphCard } from './OpenGraphCard';

const withForcedDarkTheme: Decorator = (Story) => (
  <div
    data-theme="dark"
    style={{
      padding: 'var(--space-3xl)',
      background: 'var(--color-surface-muted)',
      display: 'inline-block',
      borderRadius: 'var(--radius-md)',
    }}
  >
    <Story />
  </div>
);

const meta: Meta<typeof OpenGraphCard> = {
  title: 'Molecules/OpenGraphCard',
  component: OpenGraphCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [withForcedDarkTheme],
  argTypes: {
    name: { control: 'text' },
    role: { control: 'text' },
  },
  args: {
    name: 'Kian Andersson',
    role: 'Senior frontend engineer · freelance',
    skills: ['TypeScript', 'React', 'Astro', 'Node', 'Vite'],
  },
};

export default meta;
type Story = StoryObj<typeof OpenGraphCard>;

export const Default: Story = {};

export const SingleName: Story = {
  args: { name: 'Kian' },
};

export const ManySkills: Story = {
  args: {
    skills: ['TypeScript', 'React', 'Preact', 'Astro', 'Node', 'Vite', 'CSS', 'Vitest'],
  },
};
