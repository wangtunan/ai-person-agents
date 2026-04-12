import type { AgentId, ChatTurn } from "@/types/chat";
import {
  foldMarkdownStreamChunk,
  parseMarkdownStream,
} from "@/utils/markdown-stream";
import type { Dispatch, SetStateAction } from "react";

type SetMessagesByAgent = Dispatch<
  SetStateAction<Record<string, ChatTurn[]>>
>;

/** 将 NDJSON/SSE Markdown 流写入指定 assistant 气泡，并处理错误与 streaming 结束态 */
export async function runMarkdownStreamAssistant({
  activeAgentId,
  assistantId,
  getStreamBody,
  setMessagesByAgent,
  setLoading,
}: {
  activeAgentId: AgentId;
  assistantId: string;
  getStreamBody: () => Promise<ReadableStream<Uint8Array>>;
  setMessagesByAgent: SetMessagesByAgent;
  setLoading: Dispatch<SetStateAction<boolean>>;
}): Promise<void> {
  const updateAssistantTurn = (updater: (turn: ChatTurn) => ChatTurn) => {
    setMessagesByAgent((prev) => {
      const list = [...(prev[activeAgentId] ?? [])];
      const idx = list.findIndex((m) => m.id === assistantId);
      if (idx === -1) return prev;
      list[idx] = updater(list[idx]!);
      return { ...prev, [activeAgentId]: list };
    });
  };

  const setAssistantError = (message: string) => {
    updateAssistantTurn((turn) => ({
      ...turn,
      errorText: message,
      streaming: false,
    }));
  };

  try {
    const body = await getStreamBody();
    let acc = "";
    for await (const chunk of parseMarkdownStream(body)) {
      if (chunk.type === "error") {
        const message = chunk.text || "请求失败，请稍后重试。";
        setAssistantError(message);
        break;
      }

      acc = foldMarkdownStreamChunk(acc, chunk);
      updateAssistantTurn((turn) => ({
        ...turn,
        markdownText: acc,
        streaming: true,
      }));
      if (chunk.type === "done") break;
    }
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "请求失败，请稍后重试。";
    setAssistantError(message);
  } finally {
    updateAssistantTurn((turn) =>
      turn.streaming ? { ...turn, streaming: false } : turn,
    );
    setLoading(false);
  }
}
