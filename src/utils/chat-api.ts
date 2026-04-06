import { api } from "@/lib/api";
import type { AgentId } from "@/types/chat";

export async function callAgentApi(
  agentId: AgentId,
  input: string,
): Promise<unknown> {
  switch (agentId) {
    case "health":
      return api.health();
    case "weather":
      return api.weather(input);
    case "vsix":
      return api.vsix(input);
    case "translate":
      return api.translateStream(input);
    default: {
      const _exhaustive: never = agentId;
      return _exhaustive;
    }
  }
}
