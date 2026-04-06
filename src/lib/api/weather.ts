import { getApiBaseUrl, request } from "@/lib/http/client";
import { fetchReadableStreamBody } from "@/lib/http/stream-fetch";

export function getWeather(city: string) {
  return request(`/api/weather?city=${encodeURIComponent(city)}`);
}

export function getWeatherStream(city: string, signal?: AbortSignal) {
  const url = `${getApiBaseUrl()}/api/weather/stream?city=${encodeURIComponent(city)}`;
  return fetchReadableStreamBody(url, { method: "GET", signal });
}
