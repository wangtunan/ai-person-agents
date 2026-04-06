import { getApiBaseUrl, request } from "@/lib/http/client";

export function getWeather(city: string) {
  return request(`/api/weather?city=${encodeURIComponent(city)}`);
}

export function getWeatherStream(city: string, signal?: AbortSignal) {
  const url = `${getApiBaseUrl()}/api/weather/stream?city=${encodeURIComponent(city)}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "text/event-stream, application/x-ndjson, application/json",
    },
    signal,
  })
    .then((res) => {
      if (!res.ok) {
        const hint =
          res.status === 502 || res.status === 503
            ? "（请确认 BACKEND_ORIGIN 指向的后端已启动）"
            : "";
        throw new Error(`请求失败 HTTP ${res.status}${hint}`);
      }
      if (!res.body) {
        throw new Error("No response body");
      }
      return res.body;
    })
    .catch((e: unknown) => {
      if (e instanceof TypeError) {
        throw new Error(
          "无法连接后端。若使用本地服务，请启动后端进程；本地开发可将 NEXT_PUBLIC_API_BASE_URL 留空并配置 BACKEND_ORIGIN，由 Next 转发 /api。",
        );
      }
      throw e;
    });
}
