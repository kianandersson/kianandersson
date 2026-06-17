import type { Decorator, Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import { OpenGraphCard } from './OpenGraphCard';

const withForcedDarkTheme: Decorator = (Story) => (
  <div data-theme="dark">
    <Story />
  </div>
);

const meta: Meta<typeof OpenGraphCard> = {
  title: 'Molecules/OpenGraphCard',
  component: OpenGraphCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [withForcedDarkTheme],
  argTypes: {
    firstName: { control: 'text' },
    lastName: { control: 'text' },
    role: { control: 'text' },
  },
  args: {
    firstName: 'Kian',
    lastName: 'Andersson',
    role: 'Senior frontend engineer · freelance',
    skills: ['TypeScript', 'React', 'Astro', 'Node', 'Vite'],
  },
};

export default meta;
type Story = StoryObj<typeof OpenGraphCard>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { level: 1 });
    await expect(heading).toHaveTextContent(`${args.firstName}${args.lastName}`);
    await expect(canvas.getByText(args.role as string)).toBeInTheDocument();
    for (const label of args.skills as string[]) {
      await expect(canvas.getByText(label)).toBeInTheDocument();
    }
  },
};

export const ManySkills: Story = {
  args: {
    skills: ['TypeScript', 'React', 'Preact', 'Astro', 'Node', 'Vite', 'CSS', 'Vitest'],
  },
};
