import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TokenDocs } from "@/components/realtime/token-docs";

const meta = {
  title: "Design/Tokens",
  component: TokenDocs,
  tags: ["autodocs"],
  render: () => (
    <div className="site-canvas min-h-screen p-6">
      <div className="mx-auto max-w-[var(--layout-content)]">
        <div className="mb-6">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-white/70">
            Semantic token registry
          </p>
          <h2 className="mt-3 font-display text-5xl text-white">
            TypeScript tokens drive the visual contract.
          </h2>
        </div>
        <TokenDocs />
      </div>
    </div>
  ),
} satisfies Meta<typeof TokenDocs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
