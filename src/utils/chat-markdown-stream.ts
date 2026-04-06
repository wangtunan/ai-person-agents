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
  try {
    const body = await getStreamBody();
    let acc = "";
    for await (const chunk of parseMarkdownStream(body)) {
      acc = foldMarkdownStreamChunk(acc, chunk);
      setMessagesByAgent((prev) => {
        const list = [...(prev[activeAgentId] ?? [])];
        const idx = list.findIndex((m) => m.id === assistantId);
        if (idx === -1) return prev;
        list[idx] = { ...list[idx]!, markdownText: acc, streaming: true };
        return { ...prev, [activeAgentId]: list };
      });
      if (chunk.type === "done") break;
    }
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "请求失败，请稍后重试。";
    setMessagesByAgent((prev) => {
      const list = [...(prev[activeAgentId] ?? [])];
      const idx = list.findIndex((m) => m.id === assistantId);
      if (idx === -1) return prev;
      list[idx] = {
        ...list[idx]!,
        errorText: message,
        streaming: false,
      };
      return { ...prev, [activeAgentId]: list };
    });
  } finally {
    setMessagesByAgent((prev) => {
      const list = [...(prev[activeAgentId] ?? [])];
      const idx = list.findIndex((m) => m.id === assistantId);
      if (idx === -1) return prev;
      if (list[idx]!.streaming) {
        list[idx] = { ...list[idx]!, streaming: false };
        return { ...prev, [activeAgentId]: list };
      }
      return prev;
    });
    setLoading(false);
  }
}
