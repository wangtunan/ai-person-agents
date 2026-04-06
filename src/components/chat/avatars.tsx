"use client";

import type { AgentId } from "@/types/chat";
import { cn } from "@/utils/cn";
import { AgentSidebarIcon } from "./agent-sidebar-icon";

export function UserAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-[#545454] text-[12px] font-semibold tracking-tight text-white ring-2 ring-[var(--background)] sm:size-9 sm:text-[13px]",
        className,
      )}
      aria-hidden="true"
    >
      我
    </div>
  );
}

/** 与左侧 Agent 列表同一套图标与容器样式 */
export function AssistantAvatar({
  agentId,
  className,
}: {
  agentId: AgentId;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#10a37f]/10 ring-1 ring-[#10a37f]/15",
        className,
      )}
      aria-hidden="true"
    >
      <AgentSidebarIcon id={agentId} />
    </div>
  );
}
