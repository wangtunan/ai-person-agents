import { request } from "@/lib/http/client";

export function postVsix(url: string) {
  return request("/api/vsix", {
    method: "POST",
    body: JSON.stringify({ url: encodeURIComponent(url) }),
  });
}
