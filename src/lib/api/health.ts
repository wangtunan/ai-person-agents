import { request } from "@/lib/http/client";

export function getHealth() {
  return request<{ status: string }>("/api/health");
}
