import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
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

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 2, name: /Miscellaneous/i }),
    ).toBeInTheDocument();
    await expect(canvas.getByText('Languages')).toBeInTheDocument();
    const items = canvas.getAllByRole('listitem');
    const languages = args.languages as { name: string; level: string }[];
    await expect(items).toHaveLength(languages.length);
    for (let i = 0; i < languages.length; i++) {
      const lang = languages[i];
      await expect(within(items[i]).getByText(lang.name)).toBeInTheDocument();
      await expect(within(items[i]).getByText(lang.level)).toBeInTheDocument();
    }
  },
};

export const EmptyBehavior: Story = {
  args: { languages: [] },
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryAllByRole('listitem')).toHaveLength(0);
  },
};
