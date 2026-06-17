import type { Meta, StoryObj } from '@storybook/preact-vite';
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

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    title: 'Key skills',
    action: <TextLink href="#skills">All skills →</TextLink>,
  },
};
