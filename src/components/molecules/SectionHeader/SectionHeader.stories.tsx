import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import { TextLink } from '../../atoms/TextLink';
import { SectionHeader } from './SectionHeader';

const meta: Meta<typeof SectionHeader> = {
  title: 'Molecules/SectionHeader',
  component: SectionHeader,
  argTypes: {
    title: { control: 'text' },
    level: { control: { type: 'inline-radio' }, options: [1, 2, 3] },
    size: {
      control: { type: 'select' },
      options: ['display-xl', 'display-l', 'l', 'm', 's'],
    },
  },
  args: { title: 'Experience', level: 2, size: 'm' },
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
  args: { id: 'experience-heading' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { level: 2, name: /experience/i });
    await expect(heading).toHaveAttribute('id', 'experience-heading');
  },
};

export const WithAction: Story = {
  args: {
    title: 'Key skills',
    action: <TextLink href="#skills">All skills →</TextLink>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 2, name: /key skills/i }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /all skills/i })).toBeInTheDocument();
  },
};

export const SubLevel: Story = {
  args: { title: 'Sub', level: 3, size: 's' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 3, name: /sub/i })).toBeInTheDocument();
  },
};
