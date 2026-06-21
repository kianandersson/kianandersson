import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Hero } from './Hero';

const meta: Meta<typeof Hero> = {
  title: 'Organisms/Hero',
  component: Hero,
  argTypes: {
    name: { control: 'text' },
    tagline: { control: 'text' },
  },
  args: {
    name: 'Kian',
    tagline:
      'Senior frontend engineer who picks the right tool for the job. Currently freelance and looking for the next interesting problem.',
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {};
