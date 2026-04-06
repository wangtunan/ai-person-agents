import type { AgentDef } from "@/types/chat";

export const AGENTS: AgentDef[] = [
  {
    id: "weather",
    name: "weather",
    description: "城市天气与流式预报",
    hint: "输入城市拼音或英文名，例如 shanghai",
    inputPlaceholder: "例如：shanghai…",
    allowEmptySend: false,
  },
  {
    id: "vsix",
    name: "vsix",
    description: "VSIX 扩展包解析",
    hint: "粘贴 VSIX 下载地址，发送后由后端解析",
    inputPlaceholder: "粘贴 VSIX 的 URL…",
    allowEmptySend: false,
  },
  {
    id: "health",
    name: "health",
    description: "服务健康检查",
    hint: "无需参数，发送即可检查后端是否可用",
    inputPlaceholder: "可留空，按 Enter 检查服务状态…",
    allowEmptySend: true,
  },
];
