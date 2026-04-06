export type AgentId = "health" | "weather" | "vsix";

export type AgentDef = {
  id: AgentId;
  name: string;
  /** 列表副标题（无 URL） */
  description: string;
  /** 悬停提示 */
  hint: string;
  inputPlaceholder: string;
  /** 是否允许空输入时发送（仅 health 无需参数） */
  allowEmptySend: boolean;
};

export type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  userText?: string;
  payload?: unknown;
  /** 天气流式：Markdown 正文 */
  markdownText?: string;
  streaming?: boolean;
  errorText?: string;
};
