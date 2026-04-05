"use client";

import { api } from "@/lib/api";
import { useCallback, useId, useMemo, useState } from "react";

export type AgentId = "health" | "weather" | "vsix";

type AgentDef = {
  id: AgentId;
  name: string;
  description: string;
  inputPlaceholder: string;
  /** 是否允许空输入时发送（仅 health 无需参数） */
  allowEmptySend: boolean;
};

const AGENTS: AgentDef[] = [
  {
    id: "health",
    name: "health",
    description: "GET /api/health",
    inputPlaceholder: "可留空，按 Enter 检查服务状态…",
    allowEmptySend: true,
  },
  {
    id: "weather",
    name: "weather",
    description: "GET /api/weather?city=…",
    inputPlaceholder: "例如：shanghai…",
    allowEmptySend: false,
  },
  {
    id: "vsix",
    name: "vsix",
    description: "POST /api/vsix",
    inputPlaceholder: "粘贴 VSIX 的 URL…",
    allowEmptySend: false,
  },
];

async function callAgentApi(agentId: AgentId, input: string): Promise<unknown> {
  switch (agentId) {
    case "health":
      return api.health();
    case "weather":
      return api.weather(input);
    case "vsix":
      return api.vsix(input);
    default: {
      const _exhaustive: never = agentId;
      return _exhaustive;
    }
  }
}

type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  userText?: string;
  payload?: unknown;
  errorText?: string;
};

function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function ChatShell() {
  const groupLabelId = useId();
  const [activeAgentId, setActiveAgentId] = useState(AGENTS[0]!.id);
  const [messagesByAgent, setMessagesByAgent] = useState<
    Record<string, ChatTurn[]>
  >(() =>
    Object.fromEntries(AGENTS.map((a) => [a.id, [] as ChatTurn[]])),
  );
  const [draftByAgent, setDraftByAgent] = useState<Record<string, string>>(
    () => Object.fromEntries(AGENTS.map((a) => [a.id, ""])),
  );
  const [loading, setLoading] = useState(false);

  const activeAgent = useMemo(
    () => AGENTS.find((a) => a.id === activeAgentId) ?? AGENTS[0]!,
    [activeAgentId],
  );

  const messages = messagesByAgent[activeAgentId] ?? [];
  const draft = draftByAgent[activeAgentId] ?? "";

  const setDraft = useCallback(
    (value: string) => {
      setDraftByAgent((prev) => ({ ...prev, [activeAgentId]: value }));
    },
    [activeAgentId],
  );

  const send = useCallback(async () => {
    const text = draft.trim();
    if (loading) return;
    const agent = AGENTS.find((a) => a.id === activeAgentId) ?? AGENTS[0]!;
    if (!agent.allowEmptySend && !text) return;

    const userTurn: ChatTurn = {
      id: crypto.randomUUID(),
      role: "user",
      userText: text || "（健康检查）",
    };

    setMessagesByAgent((prev) => ({
      ...prev,
      [activeAgentId]: [...(prev[activeAgentId] ?? []), userTurn],
    }));
    setDraft("");
    setLoading(true);

    try {
      const payload = await callAgentApi(activeAgentId, text);
      const assistantTurn: ChatTurn = {
        id: crypto.randomUUID(),
        role: "assistant",
        payload,
      };
      setMessagesByAgent((prev) => ({
        ...prev,
        [activeAgentId]: [...(prev[activeAgentId] ?? []), assistantTurn],
      }));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "请求失败，请稍后重试。";
      const assistantTurn: ChatTurn = {
        id: crypto.randomUUID(),
        role: "assistant",
        errorText: message,
      };
      setMessagesByAgent((prev) => ({
        ...prev,
        [activeAgentId]: [...(prev[activeAgentId] ?? []), assistantTurn],
      }));
    } finally {
      setLoading(false);
    }
  }, [activeAgentId, draft, loading, setDraft]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface-elevated px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent"
          aria-hidden="true"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 3L4 7v5c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V7l-8-4z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="min-w-0">
          <h1 className="text-balance text-lg font-semibold tracking-tight text-foreground">
            AI Person Agents
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            暗色主题 · 多 Agent 独立会话
          </p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-border bg-surface p-3 md:w-64 md:border-b-0 md:border-r">
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
            {AGENTS.map((agent) => {
              const selected = agent.id === activeAgentId;
              return (
                <button
                  key={agent.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setActiveAgentId(agent.id)}
                  className={`flex min-w-40 flex-col rounded-lg border px-3 py-2 text-left transition-[background-color,border-color,box-shadow] duration-150 ease-out md:min-w-0 ${
                    selected
                      ? "border-accent bg-surface-elevated shadow-[inset_0_0_0_1px_rgba(59,130,246,0.35)]"
                      : "border-transparent bg-surface hover:border-border hover:bg-surface-elevated"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
                >
                  <span className="text-sm font-medium text-foreground">
                    {agent.name}
                  </span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">
                    {agent.description}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main
          id="main-content"
          className="flex min-h-0 min-w-0 flex-1 flex-col"
        >
          <div
            className="min-h-0 flex-1 overflow-y-auto px-4 py-3"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                当前为「{activeAgent.name}」：按下方提示输入（health
                可无输入直接发送），Enter 发送，Shift+Enter 换行…
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {messages.map((m) => (
                  <li key={m.id} className="min-w-0">
                    {m.role === "user" ? (
                      <div className="rounded-lg border border-border bg-surface px-3 py-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          你
                        </p>
                        <p className="wrap-break-word whitespace-pre-wrap text-sm text-foreground">
                          {m.userText}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-border bg-background px-3 py-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          响应
                        </p>
                        {m.errorText ? (
                          <p className="text-sm text-danger">{m.errorText}</p>
                        ) : (
                          <pre
                            className="mt-1 max-h-[min(24rem,50vh)] overflow-auto rounded-md bg-surface p-3 font-mono text-xs leading-relaxed text-muted-foreground [scrollbar-color:var(--border)_transparent]"
                            spellCheck={false}
                          >
                            {formatJson(m.payload)}
                          </pre>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            className="shrink-0 border-t border-border bg-surface p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              {activeAgent.name} 输入
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <textarea
                id="chat-input"
                name="message"
                autoComplete="off"
                spellCheck={false}
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={activeAgent.inputPlaceholder}
                disabled={loading}
                className="min-h-20 min-w-0 flex-1 resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={
                  loading ||
                  (!activeAgent.allowEmptySend && !draft.trim())
                }
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? "Loading…" : "发送"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
