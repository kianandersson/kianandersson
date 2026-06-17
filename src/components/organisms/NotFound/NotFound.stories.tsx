import type { Meta, StoryObj } from '@storybook/preact-vite';
import { NotFound } from './NotFound';

const meta: Meta<typeof NotFound> = {
  title: 'Organisms/NotFound',
  component: NotFound,
  argTypes: {
    requestedUrl: { control: 'text' },
    homeHref: { control: 'text' },
  },
  args: {
    requestedUrl: 'https://example.com/blog/article-that-moved',
    /* Inert in Storybook — production callers pass the real site root.
       `javascript:void(0)` is fully no-op (doesn't update the URL hash). */
    homeHref: 'javascript:void(0)',
  },
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Default: Story = {};
