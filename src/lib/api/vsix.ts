import { getApiBaseUrl, request } from "@/lib/http/client";
import { fetchReadableStreamBody } from "@/lib/http/stream-fetch";

export function postVsix(url: string) {
  return request("/api/vsix", {
    method: "POST",
    body: JSON.stringify({ url: encodeURIComponent(url) }),
  });
}

export function postVsixStream(url: string, signal?: AbortSignal) {
  const streamUrl = `${getApiBaseUrl()}/api/vsix/stream`;
  return fetchReadableStreamBody(streamUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: encodeURIComponent(url) }),
    signal,
  });
}
