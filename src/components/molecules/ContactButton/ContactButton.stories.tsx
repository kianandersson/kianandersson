import type { Meta, StoryObj } from '@storybook/preact-vite';
import { ContactButton } from './ContactButton';

const meta: Meta<typeof ContactButton> = {
  title: 'Molecules/ContactButton',
  component: ContactButton,
  argTypes: {
    variant: { control: { type: 'inline-radio' }, options: ['icon', 'labelled'] },
    isOpen: { control: 'boolean' },
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

export const LabelledClosed: Story = {
  args: { variant: 'labelled', isOpen: false },
};

export const LabelledOpen: Story = {
  args: { variant: 'labelled', isOpen: true, ariaLabel: 'Close contact form' },
};

export const IconClosed: Story = {
  args: { variant: 'icon', isOpen: false },
};

export const IconOpen: Story = {
  args: { variant: 'icon', isOpen: true, ariaLabel: 'Close contact form' },
};
