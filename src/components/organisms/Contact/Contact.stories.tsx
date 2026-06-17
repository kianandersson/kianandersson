import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Contact } from './Contact';

const ONE_DAY = 24 * 60 * 60 * 1000;

type Args = {
  recipientName: string;
  showAvailability: boolean;
  availableFrom: number;
};

function ContactDemo({ recipientName, showAvailability, availableFrom }: Args) {
  return (
    <Contact
      recipientName={recipientName}
      availableFrom={showAvailability ? new Date(availableFrom) : undefined}
    />
  );
}

const meta: Meta<typeof ContactDemo> = {
  title: 'Organisms/Contact',
  component: ContactDemo,
  argTypes: {
    recipientName: { control: 'text' },
    showAvailability: {
      control: 'boolean',
      description: 'Toggle off to render the labelled "Get in touch" pill instead.',
    },
    availableFrom: { control: 'date', if: { arg: 'showAvailability', truthy: true } },
  },
  args: {
    recipientName: 'Kian Andersson',
    showAvailability: true,
    availableFrom: Date.now() - 30 * ONE_DAY,
  },
};

export default meta;
type Story = StoryObj<typeof ContactDemo>;

export const AvailableNow: Story = {
  args: { showAvailability: true, availableFrom: Date.now() - 30 * ONE_DAY },
};

export const AvailableFromFuture: Story = {
  args: { showAvailability: true, availableFrom: Date.now() + 60 * ONE_DAY },
};

export const NoAvailability: Story = {
  name: 'No availability (labelled pill)',
  args: { showAvailability: false },
};
