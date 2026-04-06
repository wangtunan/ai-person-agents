"use client";

import { cn } from "@/utils/cn";

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

export function AssistantAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-[#10a37f] text-white ring-2 ring-[var(--background)] sm:size-9",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="size-[17px] sm:size-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 3L4 7v5c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V7l-8-4z"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
