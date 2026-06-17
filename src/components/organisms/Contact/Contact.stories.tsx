import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Contact } from './Contact';

const ONE_DAY = 24 * 60 * 60 * 1000;

const meta: Meta<typeof Contact> = {
  title: 'Organisms/Contact',
  component: Contact,
  argTypes: {
    recipientName: { control: 'text' },
  },
  args: {
    recipientName: 'Kian Andersson',
  },
};

export default meta;
type Story = StoryObj<typeof Contact>;

export const NoAvailability: Story = {
  name: 'No availability (labelled pill)',
  args: { availableFrom: undefined },
};

export const AvailableNow: Story = {
  args: { availableFrom: new Date(Date.now() - 30 * ONE_DAY) },
};

export const AvailableFromFuture: Story = {
  args: { availableFrom: new Date(Date.now() + 60 * ONE_DAY) },
};
