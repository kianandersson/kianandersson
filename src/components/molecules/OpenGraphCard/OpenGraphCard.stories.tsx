import type { Meta, StoryObj } from '@storybook/preact-vite';
import { OpenGraphCard } from './OpenGraphCard';

const meta: Meta<typeof OpenGraphCard> = {
  title: 'Molecules/OpenGraphCard',
  component: OpenGraphCard,
  parameters: {
    layout: 'centered',
  },
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
