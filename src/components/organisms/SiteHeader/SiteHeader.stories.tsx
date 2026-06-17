import type { Meta, StoryObj } from '@storybook/preact-vite';
import { SiteHeader } from './SiteHeader';

const meta: Meta<typeof SiteHeader> = {
  title: 'Organisms/SiteHeader',
  component: SiteHeader,
  argTypes: {
    githubHref: { control: 'text' },
    showPrint: { control: 'boolean' },
  },
  args: {
    githubHref: 'https://github.com/kianandersson/kianandersson',
    showPrint: true,
  },
};

export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const WithPrint: Story = { args: { showPrint: true } };
export const WithoutPrint: Story = { args: { showPrint: false } };
