/** NDJSON / SSE 流式响应：统一错误处理与 body 提取 */
export function fetchReadableStreamBody(
  url: string,
  init?: RequestInit,
): Promise<ReadableStream<Uint8Array>> {
  return fetch(url, {
    ...init,
    headers: {
      Accept: "text/event-stream, application/x-ndjson, application/json",
      ...init?.headers,
    },
  })
    .then((res) => {
      if (!res.ok) {
        const hint =
          res.status === 502 || res.status === 503
            ? "（请确认 NEXT_PUBLIC_API_BASE_URL 对应的后端已启动）"
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
          "无法连接后端。请确认后端已启动，且 NEXT_PUBLIC_API_BASE_URL 指向正确的 API 地址。",
        );
      }
      throw e;
    });
}
