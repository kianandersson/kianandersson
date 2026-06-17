import type { Meta, StoryObj } from '@storybook/preact-vite';
import { ContactButton } from './ContactButton';

const meta: Meta<typeof ContactButton> = {
  title: 'Molecules/ContactButton',
  component: ContactButton,
  argTypes: {
    variant: { control: { type: 'inline-radio' }, options: ['icon', 'labelled'] },
    isOpen: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  args: {
    variant: 'labelled',
    isOpen: false,
    ariaLabel: 'Get in touch',
    controlsId: 'contact-region',
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ContactButton>;

export const Default: Story = {};

export const IconVariant: Story = {
  name: 'Icon variant',
  args: { variant: 'icon' },
};
