import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import { SkillChipGroups } from './SkillChipGroups';

const meta: Meta<typeof SkillChipGroups> = {
  title: 'Molecules/SkillChipGroups',
  component: SkillChipGroups,
  args: {
    idPrefix: 'demo',
    stack: ['TypeScript', 'React', 'Node', 'PostgreSQL'],
    domains: ['Design systems', 'Web performance'],
  },
};

export default meta;
type Story = StoryObj<typeof SkillChipGroups>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Stack')).toBeInTheDocument();
    await expect(canvas.getByText('Domains')).toBeInTheDocument();
  },
};

export const StackOnly: Story = {
  args: { domains: [] },
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Stack')).toBeInTheDocument();
    await expect(canvas.queryByText('Domains')).not.toBeInTheDocument();
  },
};
