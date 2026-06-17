import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Organisms/Footer',
  component: Footer,
  argTypes: {
    name: { control: 'text' },
    year: { control: 'number' },
    sourceHref: { control: 'text' },
  },
  args: {
    name: 'Kian Andersson',
    year: new Date().getFullYear(),
    sourceHref: 'https://github.com/kianandersson/kianandersson',
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
