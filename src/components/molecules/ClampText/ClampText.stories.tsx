import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ClampText } from './ClampText';

const LONG =
  'Owned the customer login platform end-to-end. Designed and built an ' +
  'in-house OAuth/OIDC authorization server, then led the migration of ' +
  'millions of users away from a third-party SaaS identity provider without ' +
  'downtime, and established GDPR compliance across the board.';

const meta: Meta<typeof ClampText> = {
  title: 'Molecules/ClampText',
  component: ClampText,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
  args: { id: 'demo', text: LONG },
};

export default meta;
type Story = StoryObj<typeof ClampText>;

export const Collapsible: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Full text stays in the DOM even while collapsed (crawler-friendly).
    await expect(canvas.getByText(LONG)).toBeInTheDocument();

    // CSS-only disclosure: a labelled checkbox drives the expand state.
    const checkbox = canvas.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();

    await userEvent.click(canvas.getByText('Show more'));
    await expect(checkbox).toBeChecked();

    await userEvent.click(canvas.getByText('Show less'));
    await expect(checkbox).not.toBeChecked();
  },
};

export const Short: Story = {
  args: { text: 'A short, single-line description.' },
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('A short, single-line description.')).toBeInTheDocument();
    await expect(canvas.queryByRole('checkbox')).not.toBeInTheDocument();
  },
};
