"use client";

import { api } from "@/lib/api";
import { AGENTS } from "@/constants/agents";
import { useMarkdownStreamChatTurn } from "@/hooks/use-markdown-stream-chat";
import type { AgentId, ChatTurn } from "@/types/chat";
import { callAgentApi } from "@/utils/chat-api";
import { scrollNodeToBottom } from "@/utils/scroll";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

const EMPTY_MESSAGES: ChatTurn[] = [];

export function useChatShell() {
  const groupLabelId = useId();
  const [activeAgentId, setActiveAgentId] = useState<AgentId>(AGENTS[0]!.id);
  const [messagesByAgent, setMessagesByAgent] = useState<
    Record<string, ChatTurn[]>
  >(() => Object.fromEntries(AGENTS.map((a) => [a.id, [] as ChatTurn[]])));
  const [draftByAgent, setDraftByAgent] = useState<Record<string, string>>(() =>
    Object.fromEntries(AGENTS.map((a) => [a.id, ""])),
  );
  const [loading, setLoading] = useState(false);
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  const runMarkdownStream = useMarkdownStreamChatTurn(
    setMessagesByAgent,
    setLoading,
  );

  const activeAgent = useMemo(
    () => AGENTS.find((a) => a.id === activeAgentId) ?? AGENTS[0]!,
    [activeAgentId],
  );

  const messages = messagesByAgent[activeAgentId] ?? EMPTY_MESSAGES;
  const draft = draftByAgent[activeAgentId] ?? "";

  const setDraft = useCallback(
    (value: string) => {
      setDraftByAgent((prev) => ({ ...prev, [activeAgentId]: value }));
    },
    [activeAgentId],
  );

  useEffect(() => {
    scrollNodeToBottom(messagesScrollRef.current);
  }, [messages, loading, activeAgentId]);

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

    if (activeAgentId === "weather" || activeAgentId === "vsix") {
      const assistantId = crypto.randomUUID();
      const assistantTurn: ChatTurn = {
        id: assistantId,
        role: "assistant",
        markdownText: "",
        streaming: true,
      };
      setMessagesByAgent((prev) => ({
        ...prev,
        [activeAgentId]: [...(prev[activeAgentId] ?? []), assistantTurn],
      }));

      await runMarkdownStream({
        activeAgentId,
        assistantId,
        getStreamBody:
          activeAgentId === "weather"
            ? () => api.weatherStream(text)
            : () => api.vsixStream(text),
      });
      return;
    }

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
  }, [activeAgentId, draft, loading, runMarkdownStream, setDraft]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void send();
      }
    },
    [send],
  );

  return {
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
  };
}
