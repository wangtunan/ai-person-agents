"use client";

import type { AgentDef } from "@/types/chat";
import { AgentSidebarIcon } from "./agent-sidebar-icon";

type Props = {
  activeAgent: AgentDef;
};

export function ChatEmptyState({ activeAgent }: Props) {
  return (
    <div className="flex min-h-[min(60vh,26rem)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-[#10a37f]/12 ring-1 ring-[#10a37f]/20">
          <AgentSidebarIcon id={activeAgent.id} className="size-8" />
        </div>
        <p className="text-sm font-medium text-foreground">
          与「{activeAgent.name}」对话
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {activeAgent.allowEmptySend
            ? "可直接发送，或按 Enter 使用默认提示。"
            : "在下方输入内容，Enter 发送，Shift+Enter 换行。"}
        </p>
      </div>
    </div>
  );
}
