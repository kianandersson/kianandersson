import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import { EmailSignature, type SignatureTokens } from './EmailSignature';

// Live token references — the catalog previews the signature themed by the real
// design tokens. The CLI swaps these for values resolved to flat hex / px.
const tokens: SignatureTokens = {
  text: 'var(--color-text)',
  accent: 'var(--color-accent)',
  contact: 'var(--color-text-muted)',
  role: 'var(--color-text-muted)',
  divider: 'var(--color-divider)',
  topPad: 'var(--space-m)',
  markWidth: 'var(--space-6xl)',
  gap: 'var(--space-s)',
  rolePad: 'var(--space-2xs)',
  contactPad: 'var(--space-2xs)',
  markSize: 'var(--text-heading-m-size)',
  nameSize: 'var(--text-label-size)',
  metaSize: 'var(--text-caption-s-size)',
  tightLeading: 'var(--text-heading-m-leading)',
  contactLeading: 'var(--text-caption-m-leading)',
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
};

const meta: Meta<typeof EmailSignature> = {
  title: 'Artifacts/EmailSignature',
  component: EmailSignature,
  // Preview on white — the signature is always rendered on a mail client's
  // white canvas, not the catalog's surface colour.
  decorators: [
    (Story) => (
      <div style={{ background: '#ffffff', padding: 'var(--space-xl)' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    mark: 'ka',
    fullName: 'Kian Andersson',
    role: 'Senior Full-Stack Engineer & Tech Lead',
    website: 'https://kianandersson.com',
    websiteLabel: 'kianandersson.com',
    email: 'hi@kianandersson.dk',
    phone: '+45 12 34 56 78',
    tokens,
  },
};

export default meta;
type Story = StoryObj<typeof EmailSignature>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Kian Andersson')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /kianandersson\.com/ })).toHaveAttribute(
      'href',
      'https://kianandersson.com',
    );
    await expect(canvas.getByRole('link', { name: /hi@kianandersson\.dk/ })).toHaveAttribute(
      'href',
      'mailto:hi@kianandersson.dk',
    );
  },
};

export const WithoutPhone: Story = {
  args: { phone: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/\+45/)).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /hi@kianandersson\.dk/ })).toBeInTheDocument();
  },
};
