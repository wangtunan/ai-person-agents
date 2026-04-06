import type { WeatherStreamChunk } from "@/types/weather";

type ForecastRow = { date: string; temp: number; weather: string };

function formatForecastMarkdown(city: string, rows: ForecastRow[]): string {
  const title = city ? `### ${city}\n\n` : "";
  const table = [
    "| 日期 | 气温 | 天气 |",
    "| --- | --- | --- |",
    ...rows.map(
      (r) => `| ${r.date} | ${r.temp}°C | ${r.weather.replace(/\|/g, "\\|")} |`,
    ),
  ].join("\n");
  return `${title}${table}\n\n`;
}

export function foldWeatherChunk(
  acc: string,
  chunk: WeatherStreamChunk,
): string {
  switch (chunk.type) {
    case "forecast":
      return chunk.text;
    case "delta":
      return acc + chunk.text;
    case "done":
      return chunk.text ? acc + chunk.text : acc;
    default:
      return acc;
  }
}

/** 支持 NDJSON 与 SSE（`data: {...}`）混合格式 */
export async function* parseWeatherStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<WeatherStreamChunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, "\n");
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const chunk = parseStreamLine(line);
        if (chunk) yield chunk;
      }
    }
    if (buffer.trim()) {
      const chunk = parseStreamLine(buffer);
      if (chunk) yield chunk;
    }
  } finally {
    reader.releaseLock();
  }
}

function parseStreamLine(line: string): WeatherStreamChunk | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith(":")) return null;
  if (trimmed.startsWith("event:")) return null;

  let payload = trimmed;
  if (trimmed.startsWith("data:")) {
    payload = trimmed.slice(5).trim();
  }
  if (!payload || payload === "[DONE]") return null;

  return normalizeWeatherPayload(payload);
}

function normalizeWeatherPayload(raw: string): WeatherStreamChunk | null {
  try {
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const type = obj.type;
    if (type === "delta" && typeof obj.text === "string") {
      return { type: "delta", text: obj.text };
    }
    if (type === "done") {
      const t = obj.text;
      return {
        type: "done",
        text: typeof t === "string" ? t : "",
      };
    }
    if (type === "forecast") {
      if (typeof obj.text === "string") {
        return { type: "forecast", text: obj.text };
      }
      const city = typeof obj.city === "string" ? obj.city : "";
      const fc = obj.forecast;
      if (Array.isArray(fc) && fc.length > 0) {
        const rows = fc.filter(isForecastRow);
        if (rows.length > 0) {
          return {
            type: "forecast",
            text: formatForecastMarkdown(city, rows),
          };
        }
      }
      return { type: "forecast", text: "" };
    }
  } catch {
    return null;
  }
  return null;
}

function isForecastRow(x: unknown): x is ForecastRow {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.date === "string" &&
    typeof o.temp === "number" &&
    typeof o.weather === "string"
  );
}
