import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ProjectBranch, type ProjectBranchItem } from './ProjectBranch';

const LONG =
  'Designed and built a double-entry ledger and reconciliation engine handling ' +
  'multi-currency settlement for a payments startup. Led the migration from a ' +
  'monolithic app to an event-driven service, cutting reconciliation time from ' +
  'hours to minutes and giving finance a live, auditable view of every transaction.';

const PROJECTS: ProjectBranchItem[] = [
  {
    id: 'p0',
    title: 'Ledger Platform',
    role: 'Lead Engineer',
    description: LONG,
    stack: ['TypeScript', 'PostgreSQL', 'Kafka'],
    domains: ['Fintech', 'Payments'],
  },
  {
    id: 'p1',
    title: 'Scheduling Tool',
    role: 'Full-stack Engineer',
    description: 'A clinician scheduling and shift-swap tool used daily by a care team.',
    stack: ['React', 'Node'],
    domains: ['Healthcare'],
  },
];

const meta: Meta<typeof ProjectBranch> = {
  title: 'Molecules/ProjectBranch',
  component: ProjectBranch,
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', maxWidth: '360px', paddingLeft: '32px' }}>
        <Story />
      </div>
    ),
  ],
  args: { projects: PROJECTS },
};

export default meta;
type Story = StoryObj<typeof ProjectBranch>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const project of PROJECTS) {
      await expect(
        canvas.getByRole('heading', { level: 4, name: project.title }),
      ).toBeInTheDocument();
      await expect(canvas.getByText(project.role)).toBeInTheDocument();
    }
    await expect(canvas.getAllByText('Stack')).toHaveLength(2);
    await expect(canvas.getAllByText('Domains')).toHaveLength(2);

    // The long description collapses behind a CSS-only toggle; the short one does not.
    const checkbox = canvas.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(canvas.getByText('Show more'));
    await expect(checkbox).toBeChecked();
  },
};
