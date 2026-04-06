"use client";

import { AGENTS } from "@/constants/agents";
import type { AgentDef, AgentId } from "@/types/chat";
import { AgentSidebarIcon } from "./agent-sidebar-icon";

type Props = {
  groupLabelId: string;
  activeAgentId: AgentId;
  onSelectAgent: (id: AgentId) => void;
};

export function AgentSidebar({
  groupLabelId,
  activeAgentId,
  onSelectAgent,
}: Props) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border/50 bg-[var(--surface)] p-3 md:h-full md:min-h-0 md:w-[16.5rem] md:border-b-0 md:border-r md:border-border/50">
      <p
        id={groupLabelId}
        className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        Agents
      </p>
      <div
        className="flex flex-row gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0"
        role="radiogroup"
        aria-labelledby={groupLabelId}
      >
        {AGENTS.map((agent: AgentDef) => {
          const selected = agent.id === activeAgentId;
          return (
            <button
              key={agent.id}
              type="button"
              role="radio"
              aria-checked={selected}
              title={agent.hint}
              onClick={() => onSelectAgent(agent.id)}
              className={`flex min-w-40 items-start gap-3 rounded-xl border px-2.5 py-2.5 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out md:min-w-0 ${
                selected
                  ? "border-[#10a37f]/45 bg-[var(--surface-elevated)] shadow-[inset_0_0_0_1px_rgba(16,163,127,0.2)]"
                  : "border-transparent bg-transparent hover:border-border/60 hover:bg-[var(--surface-elevated)]/70"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] active:scale-[0.99]`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#10a37f]/10 ring-1 ring-[#10a37f]/15">
                <AgentSidebarIcon id={agent.id} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">
                  {agent.name}
                </span>
                <span className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
                  {agent.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
