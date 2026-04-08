import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LayoutShell } from "@/components/layout/layout-shell";
import { Panel } from "@/components/ui/panel";

const meta = {
  title: "Layouts/LayoutShell",
  component: LayoutShell,
  tags: ["autodocs"],
  render: () => (
    <LayoutShell
      hero={
        <Panel className="notebook-texture" tone="paper">
          <h2 className="font-display text-4xl leading-none text-text-primary">
            Hero shell
          </h2>
          <p className="mt-4 max-w-lg text-text-secondary">
            LayoutShell provides the split-screen stage used by the template
            demo and future app-specific ports.
          </p>
        </Panel>
      }
      realtime={
        <Panel tone="terminal">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent-highlight">
            Realtime panel
          </p>
          <p className="mt-4 font-mono text-sm text-white/78">
            Streams, snapshots, and task history sit here.
          </p>
        </Panel>
      }
    />
  ),
} satisfies Meta<typeof LayoutShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hero: null,
    realtime: null,
  },
};
