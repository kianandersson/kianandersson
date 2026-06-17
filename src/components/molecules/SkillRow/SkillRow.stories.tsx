import type { Decorator, Meta, StoryObj } from '@storybook/preact-vite';
import { SkillRow } from './SkillRow';

const withSkillsGrid: Decorator = (Story) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto auto auto',
      columnGap: 'var(--space-m)',
      borderTop: '1px solid var(--color-divider)',
      maxWidth: 540,
    }}
  >
    <Story />
  </div>
);

const meta: Meta<typeof SkillRow> = {
  title: 'Molecules/SkillRow',
  component: SkillRow,
  decorators: [withSkillsGrid],
  argTypes: {
    name: { control: 'text' },
    level: { control: { type: 'range', min: 1, max: 5, step: 1 } },
    years: { control: { type: 'number', min: 0, max: 30, step: 1 } },
  },
  args: { name: 'TypeScript', level: 5, years: 6 },
};

export default meta;
type Story = StoryObj<typeof SkillRow>;

export const Default: Story = {};
