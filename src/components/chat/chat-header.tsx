"use client";

export function ChatHeader() {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border/60 bg-[var(--surface)] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10a37f]/15 text-[#10a37f] ring-1 ring-[#10a37f]/25"
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
        <h1 className="text-pretty text-lg font-semibold tracking-tight text-foreground">
          AI Person Agents
        </h1>
        <p className="truncate text-xs text-muted-foreground">
          暗色 · 多 Agent 会话
        </p>
      </div>
    </header>
  );
}
