"use client";

import { api } from "@/lib/api";
import { AGENTS } from "@/constants/agents";
import type { AgentId, ChatTurn } from "@/types/chat";
import { callAgentApi } from "@/utils/chat-api";
import { foldWeatherChunk, parseWeatherStream } from "@/utils/weather-stream";
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

    if (activeAgentId === "weather") {
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

      try {
        const body = await api.weatherStream(text);
        let acc = "";
        for await (const chunk of parseWeatherStream(body)) {
          acc = foldWeatherChunk(acc, chunk);
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
  }, [activeAgentId, draft, loading, setDraft]);

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
