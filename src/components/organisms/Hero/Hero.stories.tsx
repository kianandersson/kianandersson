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

// The profile photo is print-only; force the print preview so the catalog can
// show the square photo in the top-right corner.
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
