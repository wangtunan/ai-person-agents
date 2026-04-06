"use client";

export function ThinkingIndicator() {
  return (
    <div
      className="flex items-center gap-2.5 py-0.5 text-[15px] text-muted-foreground"
      role="status"
      aria-live="polite"
      aria-label="正在思考"
    >
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-[#10a37f]/85 motion-safe:animate-bounce"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
      <span className="text-[15px] motion-safe:animate-pulse">正在思考…</span>
    </div>
  );
}
