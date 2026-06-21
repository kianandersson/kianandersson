import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Hero } from './Hero';

const meta: Meta<typeof Hero> = {
  title: 'Organisms/Hero',
  component: Hero,
  argTypes: {
    name: { control: 'text' },
    tagline: { control: 'text' },
    showProfilePhoto: { control: 'boolean' },
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

// data-print-preview forces the print-only photo visible in the catalog.
export const WithProfilePhoto: Story = {
  args: { showProfilePhoto: true },
  decorators: [
    (Story) => (
      <div data-print-preview>
        <Story />
      </div>
    ),
  ],
};
