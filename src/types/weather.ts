/** 天气流式解析后的统一块（用于合并 Markdown） */
export type WeatherStreamChunk = {
  type: "forecast" | "delta" | "done";
  text: string;
};
