import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
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

// The print CV can override the "Hi, I'm ..." heading via `heroTitle` — e.g. an
// agency that wants its own CV title. It renders as plain text with no accent
// colour, since there's no name to pick out of it.
export const CustomTitle: Story = {
  args: {
    title: 'Curriculum Vitae',
  },
};

// A blank line (`\n\n`) in the tagline splits it into separate paragraphs —
// the same convention as experience descriptions. Used by the print CV's
// `heroTagline` override when an agency wants a longer, multi-paragraph intro.
export const MultipleParagraphs: Story = {
  args: {
    tagline:
      'Senior frontend engineer who picks the right tool for the job.\n\nCurrently freelance and looking for the next interesting problem.',
  },
};

// The Danish print CV greets in Danish; the name keeps its accent colour.
export const Danish: Story = {
  args: { locale: 'da' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Hej, jeg hedder Kian.' }),
    ).toBeInTheDocument();
  },
};
