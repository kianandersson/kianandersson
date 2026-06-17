import type { Meta, StoryObj } from '@storybook/preact-vite';
import { AvailabilityStatus } from './AvailabilityStatus';

const ONE_DAY = 24 * 60 * 60 * 1000;

type Args = { availableFrom: number };

function AvailabilityStatusDemo({ availableFrom }: Args) {
  return <AvailabilityStatus availableFrom={new Date(availableFrom)} />;
}

const meta: Meta<typeof AvailabilityStatusDemo> = {
  title: 'Atoms/AvailabilityStatus',
  component: AvailabilityStatusDemo,
  argTypes: {
    availableFrom: { control: 'date' },
  },
  args: { availableFrom: Date.now() - 30 * ONE_DAY },
};

export default meta;
type Story = StoryObj<typeof AvailabilityStatusDemo>;

export const AvailableNow: Story = {
  args: { availableFrom: Date.now() - 30 * ONE_DAY },
};

export const AvailableFromFuture: Story = {
  args: { availableFrom: Date.now() + 60 * ONE_DAY },
};
