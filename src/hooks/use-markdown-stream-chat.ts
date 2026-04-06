"use client";

import type { AgentId, ChatTurn } from "@/types/chat";
import { runMarkdownStreamAssistant } from "@/utils/chat-markdown-stream";
import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

type SetMessagesByAgent = Dispatch<
  SetStateAction<Record<string, ChatTurn[]>>
>;

/** 封装流式 Markdown 助手回合，供 `useChatShell` 等与天气/vsix/translate 共用 */
export function useMarkdownStreamChatTurn(
  setMessagesByAgent: SetMessagesByAgent,
  setLoading: Dispatch<SetStateAction<boolean>>,
) {
  return useCallback(
    async (args: {
      activeAgentId: AgentId;
      assistantId: string;
      getStreamBody: () => Promise<ReadableStream<Uint8Array>>;
    }) => {
      await runMarkdownStreamAssistant({
        ...args,
        setMessagesByAgent,
        setLoading,
      });
    },
    [setMessagesByAgent, setLoading],
  );
}
