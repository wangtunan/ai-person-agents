/** NDJSON/SSE 解析后的块（合并为 Markdown 正文） */
export type MarkdownStreamChunk = {
  type: "forecast" | "delta" | "done";
  text: string;
};
