import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import { Coordinates } from './Coordinates';

const meta: Meta<typeof Coordinates> = {
  title: 'Organisms/Coordinates',
  component: Coordinates,
  // Print-only; force it visible so the catalog can show it.
  decorators: [
    (Story) => (
      <div data-print-preview>
        <Story />
      </div>
    ),
  ],
  args: {
    location: 'Denmark',
    website: 'https://example.com',
    github: 'https://github.com/example',
    linkedin: 'https://www.linkedin.com/in/example',
  },
};

export default meta;
type Story = StoryObj<typeof Coordinates>;

// The public print: links only (location left alone on row two).
export const PublicLinks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 2, name: /My coordinates/i }),
    ).toBeInTheDocument();
    // GitHub/LinkedIn show only the path, but link to the full URL.
    await expect(canvas.getByRole('link', { name: '/example' })).toHaveAttribute(
      'href',
      'https://github.com/example',
    );
    await expect(canvas.getByText('Denmark')).toBeInTheDocument();
    // No private details in the public print.
    await expect(canvas.queryByText('Email')).toBeNull();
    await expect(canvas.queryByText('Phone')).toBeNull();
  },
};

// The local print build: private email/phone added.
export const WithPrivateDetails: Story = {
  args: {
    email: 'me@example.com',
    phone: '+45 12 34 56 78',
    location: 'Denmark',
    website: 'https://example.com',
    github: 'https://github.com/example',
    linkedin: 'https://www.linkedin.com/in/example',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'me@example.com' })).toHaveAttribute(
      'href',
      'mailto:me@example.com',
    );
    await expect(canvas.getByRole('link', { name: '+45 12 34 56 78' })).toHaveAttribute(
      'href',
      'tel:+4512345678',
    );
  },
};

// Only one of the private fields (here email, no phone).
export const WithEmailOnly: Story = {
  args: {
    email: 'me@example.com',
    location: 'Denmark',
    website: 'https://example.com',
    github: 'https://github.com/example',
    linkedin: 'https://www.linkedin.com/in/example',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'me@example.com' })).toHaveAttribute(
      'href',
      'mailto:me@example.com',
    );
    await expect(canvas.queryByText('Phone')).toBeNull();
  },
};

export const EmptyBehavior: Story = {
  // Clear the defaults from meta so nothing renders.
  args: { location: undefined, website: undefined, github: undefined, linkedin: undefined },
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('section')).toBeNull();
  },
};
