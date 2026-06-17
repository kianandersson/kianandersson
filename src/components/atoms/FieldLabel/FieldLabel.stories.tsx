import type { Meta, StoryObj } from '@storybook/preact-vite';
import { FieldLabel } from './FieldLabel';

const meta: Meta<typeof FieldLabel> = {
  title: 'Atoms/FieldLabel',
  component: FieldLabel,
  argTypes: {
    for: { control: 'text' },
    tone: { control: { type: 'inline-radio' }, options: ['subtle', 'muted'] },
    children: { control: 'text' },
  },
  args: {
    for: 'email',
    tone: 'subtle',
    children: 'From',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FieldLabel {...args} />
      <input id={args.for as string} type="text" />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof FieldLabel>;

export const Subtle: Story = { args: { tone: 'subtle' } };
export const Muted: Story = { args: { tone: 'muted', children: 'Subject' } };
