import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
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

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(
      "This page couldn't be found.",
    );
    await expect(canvas.getByRole('link', { name: /back to home/i })).toHaveAttribute(
      'href',
      args.homeHref as string,
    );
    await expect(canvas.getByTestId('requested-url')).toHaveTextContent(
      args.requestedUrl as string,
    );
    await expect(canvas.getByText(/HTTP\/2 404 Not Found/)).toBeInTheDocument();
    await expect(canvas.getByText(/content-type:/)).toBeInTheDocument();
  },
};

export const FallbackToHomeBehavior: Story = {
  args: { requestedUrl: undefined, homeHref: '/' },
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('requested-url')).toHaveTextContent('/');
  },
};
