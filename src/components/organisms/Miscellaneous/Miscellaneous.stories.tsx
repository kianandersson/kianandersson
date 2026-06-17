import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Miscellaneous } from './Miscellaneous';

const meta: Meta<typeof Miscellaneous> = {
  title: 'Organisms/Miscellaneous',
  component: Miscellaneous,
  args: {
    languages: [
      { name: 'Danish', level: 'Native' },
      { name: 'English', level: 'Fluent' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Miscellaneous>;

export const Default: Story = {};
