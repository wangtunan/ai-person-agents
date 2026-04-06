"use client";

import type { AgentId, ChatTurn } from "@/types/chat";
import { cn } from "@/utils/cn";
import { formatJson } from "@/utils/format-json";
import { AssistantAvatar, UserAvatar } from "./avatars";
import { StreamedMarkdown } from "./streamed-markdown";
import { ThinkingIndicator } from "./thinking-indicator";

type Props = {
  agentId: AgentId;
  messages: ChatTurn[];
  loading: boolean;
};

export function ChatMessageList({ agentId, messages, loading }: Props) {
  return (
    <ul className="mx-auto flex w-full max-w-[52rem] flex-col gap-6 px-1 sm:px-0">
      {messages.map((m) => (
        <li
          key={m.id}
          className={cn(
            "flex w-full min-w-0 gap-2.5 sm:gap-3",
            m.role === "user"
              ? "items-end justify-end"
              : "items-start justify-start",
          )}
        >
          {m.role === "assistant" ? <AssistantAvatar agentId={agentId} /> : null}
          <div
            className={cn(
              "flex min-w-0 flex-col",
              m.role === "user"
                ? "max-w-[min(100%,42rem)] items-end"
                : "max-w-[min(100%,42rem)] flex-1 items-start pt-0.5",
            )}
          >
            {m.role === "user" ? (
              <div className="rounded-[1.35rem] rounded-tr-md bg-[var(--chat-user-bubble)] px-4 py-2.5 text-[15px] leading-relaxed text-[#ececec] ring-1 ring-white/[0.06]">
                <span className="sr-only">你的消息</span>
                <p className="wrap-break-word whitespace-pre-wrap break-words">
                  {m.userText}
                </p>
              </div>
            ) : (
              <div className="min-w-0 text-[15px] leading-relaxed text-foreground">
                <span className="sr-only">助手消息</span>
                {m.markdownText !== undefined ? (
                  <div className="min-w-0">
                    {m.markdownText === "" && m.streaming && !m.errorText ? (
                      <ThinkingIndicator />
                    ) : (
                      <>
                        <StreamedMarkdown content={m.markdownText} />
                        {m.streaming ? (
                          <span
                            className="ml-0.5 inline-block h-4 w-0.5 motion-safe:animate-pulse rounded-sm bg-[#10a37f] align-[-0.125em]"
                            aria-hidden="true"
                          />
                        ) : null}
                      </>
                    )}
                    {m.errorText ? (
                      <p className="mt-2 text-sm text-danger">{m.errorText}</p>
                    ) : null}
                  </div>
                ) : m.errorText ? (
                  <p className="text-sm text-danger">{m.errorText}</p>
                ) : (
                  <pre
                    className="max-h-[min(24rem,50vh)] overflow-auto rounded-lg bg-[#1a1a1a] p-3 font-mono text-xs leading-relaxed text-muted-foreground [scrollbar-color:var(--border)_transparent]"
                    spellCheck={false}
                  >
                    {formatJson(m.payload)}
                  </pre>
                )}
              </div>
            )}
          </div>
          {m.role === "user" ? <UserAvatar /> : null}
        </li>
      ))}
      {loading &&
      messages.length > 0 &&
      messages[messages.length - 1]!.role === "user" ? (
        <li className="flex w-full min-w-0 items-start justify-start gap-2.5 sm:gap-3">
          <AssistantAvatar agentId={agentId} />
          <div className="min-w-0 max-w-[min(100%,42rem)] flex-1 pt-0.5">
            <ThinkingIndicator />
          </div>
        </li>
      ) : null}
    </ul>
  );
}
