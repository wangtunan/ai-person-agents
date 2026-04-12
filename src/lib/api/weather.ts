import { getApiBaseUrl } from "@/lib/http/client";
import { fetchReadableStreamBody } from "@/lib/http/stream-fetch";

export function getWeatherStream(city: string, signal?: AbortSignal) {
  const url = `${getApiBaseUrl()}/api/weather/stream?text=${encodeURIComponent(city)}`;
  return fetchReadableStreamBody(url, { method: "GET", signal });
}
