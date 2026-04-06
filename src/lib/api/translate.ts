import { getApiBaseUrl } from "@/lib/http/client";
import { fetchReadableStreamBody } from "@/lib/http/stream-fetch";

export function postTranslateStream(text: string, signal?: AbortSignal) {
  const streamUrl = `${getApiBaseUrl()}/api/translate/stream`;
  return fetchReadableStreamBody(streamUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    signal,
  });
}
