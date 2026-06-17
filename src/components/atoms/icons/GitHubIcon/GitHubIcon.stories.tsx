import type { Meta, StoryObj } from '@storybook/preact-vite';
import { GitHubIcon } from './GitHubIcon';

const meta: Meta<typeof GitHubIcon> = {
  title: 'Atoms/Icons/GitHubIcon',
  component: GitHubIcon,
  argTypes: { size: { control: { type: 'number', min: 8, max: 64, step: 1 } } },
  args: { size: 17 },
};

export default meta;
type Story = StoryObj<typeof GitHubIcon>;

export const Default: Story = {};
