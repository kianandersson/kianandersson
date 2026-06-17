import type { Decorator, Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
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

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.name as string)).toBeInTheDocument();
    await expect(canvas.getByText(/\+\d+ yrs?/)).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('[data-state="on"]').length).toBe(args.level);
    await expect(canvasElement.querySelectorAll('[data-state="off"]').length).toBe(
      5 - (args.level as number),
    );
    // Level and years sit side-by-side without a "·" separator.
    await expect(canvas.queryByText(/·/)).not.toBeInTheDocument();
  },
};

export const MidLevel: Story = {
  args: { level: 3, years: 4 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Experienced')).toBeInTheDocument();
  },
};

export const SingleYear: Story = {
  args: { years: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('+1 yr')).toBeInTheDocument();
  },
};
