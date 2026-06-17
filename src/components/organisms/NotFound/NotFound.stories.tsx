import type { Meta, StoryObj } from '@storybook/preact-vite';
import { NotFound } from './NotFound';

const meta: Meta<typeof NotFound> = {
  title: 'Organisms/NotFound',
  component: NotFound,
  argTypes: {
    requestedUrl: { control: 'text' },
  },
  args: { requestedUrl: 'https://example.com/blog/article-that-moved' },
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Default: Story = {};
