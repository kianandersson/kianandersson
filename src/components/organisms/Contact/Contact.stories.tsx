import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Contact } from './Contact';

const ONE_DAY = 24 * 60 * 60 * 1000;

type Args = {
  recipientName: string;
  availableFrom?: number;
};

function ContactDemo({ recipientName, availableFrom }: Args) {
  return (
    <Contact
      recipientName={recipientName}
      availableFrom={availableFrom === undefined ? undefined : new Date(availableFrom)}
    />
  );
}

const meta: Meta<typeof ContactDemo> = {
  title: 'Organisms/ContactPanel',
  component: ContactDemo,
  argTypes: {
    recipientName: { control: 'text' },
    availableFrom: { control: 'date' },
  },
  args: {
    recipientName: 'Kian Andersson',
    availableFrom: Date.now() - 30 * ONE_DAY,
  },
};

export default meta;
type Story = StoryObj<typeof ContactDemo>;

export const AvailableNow: Story = {
  args: { availableFrom: Date.now() - 30 * ONE_DAY },
};

export const AvailableFromFuture: Story = {
  args: { availableFrom: Date.now() + 60 * ONE_DAY },
};

export const NoAvailability: Story = {
  name: 'No availability (labelled pill)',
  args: { availableFrom: undefined },
};
