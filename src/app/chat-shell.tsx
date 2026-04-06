"use client";

import { AgentSidebar } from "@/components/chat/agent-sidebar";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessageList } from "@/components/chat/chat-message-list";
import { useChatShell } from "@/hooks/use-chat-shell";
import type { AgentId } from "@/types/chat";

export type { AgentId };

export function ChatShell() {
  const {
    groupLabelId,
    activeAgentId,
    setActiveAgentId,
    activeAgent,
    messages,
    draft,
    setDraft,
    loading,
    messagesScrollRef,
    send,
    onKeyDown,
  } = useChatShell();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-background">
      <ChatHeader />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
        <AgentSidebar
          groupLabelId={groupLabelId}
          activeAgentId={activeAgentId}
          onSelectAgent={setActiveAgentId}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden scroll-mt-2 outline-none"
          aria-busy={loading}
        >
          <div
            ref={messagesScrollRef}
            className="chat-pane-bg min-h-0 flex-1 basis-0 overflow-y-auto overscroll-y-contain px-3 py-5 sm:px-6"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.length === 0 ? (
              <ChatEmptyState activeAgent={activeAgent} />
            ) : (
              <ChatMessageList
                agentId={activeAgentId}
                messages={messages}
                loading={loading}
              />
            )}
          </div>

          <ChatComposer
            activeAgent={activeAgent}
            draft={draft}
            loading={loading}
            onDraftChange={setDraft}
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            onKeyDown={onKeyDown}
          />
        </main>
      </div>
    </div>
  );
}
