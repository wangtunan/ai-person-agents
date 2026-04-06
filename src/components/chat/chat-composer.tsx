"use client";

import type { AgentDef } from "@/types/chat";
import { cn } from "@/utils/cn";

type Props = {
  activeAgent: AgentDef;
  draft: string;
  loading: boolean;
  onDraftChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export function ChatComposer({
  activeAgent,
  draft,
  loading,
  onDraftChange,
  onSubmit,
  onKeyDown,
}: Props) {
  return (
    <form
      className="shrink-0 border-t border-border/40 bg-[var(--background)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      onSubmit={onSubmit}
    >
      <label htmlFor="chat-input" className="sr-only">
        {activeAgent.name} 输入
      </label>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
        <div
          className={cn(
            "flex min-h-[52px] items-end gap-2 rounded-[28px] border border-[var(--chat-input-border)] bg-[var(--chat-input-bg)] p-2 pl-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[box-shadow,border-color] duration-200 focus-within:border-[#10a37f]/50 focus-within:ring-2 focus-within:ring-[#10a37f]/25",
            loading && "opacity-90",
          )}
        >
          <textarea
            id="chat-input"
            name="message"
            autoComplete="off"
            spellCheck={false}
            rows={1}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={activeAgent.inputPlaceholder}
            disabled={loading}
            className="min-h-[44px] max-h-48 min-w-0 flex-1 resize-none bg-transparent py-2.5 pb-3 text-[15px] leading-relaxed text-foreground shadow-none outline-none ring-0 placeholder:text-muted-foreground focus-visible:ring-0 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={
              loading || (!activeAgent.allowEmptySend && !draft.trim())
            }
            aria-label={loading ? "正在发送…" : "发送消息"}
            className="mb-1.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#10a37f] text-white ring-1 ring-white/10 transition-[transform,background-color,opacity] duration-200 hover:bg-[#0d8f6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--chat-input-bg)] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            {loading ? (
              <svg
                className="size-4 motion-safe:animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="size-5 text-white/95"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M3.478 2.404a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            )}
          </button>
        </div>
        <p className="px-1 text-center text-[11px] text-muted-foreground/80">
          Enter 发送 · Shift+Enter 换行
        </p>
      </div>
    </form>
  );
}
