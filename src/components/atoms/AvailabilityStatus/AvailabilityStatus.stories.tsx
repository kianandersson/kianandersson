import type { Meta, StoryObj } from '@storybook/preact-vite';
import { AvailabilityStatus } from './AvailabilityStatus';

const ONE_DAY = 24 * 60 * 60 * 1000;

const meta: Meta<typeof AvailabilityStatus> = {
  title: 'Atoms/AvailabilityStatus',
  component: AvailabilityStatus,
};

export default meta;
type Story = StoryObj<typeof AvailabilityStatus>;

export const AvailableNow: Story = {
  args: { availableFrom: new Date(Date.now() - 30 * ONE_DAY) },
};

export const AvailableFromFuture: Story = {
  args: { availableFrom: new Date(Date.now() + 60 * ONE_DAY) },
};
