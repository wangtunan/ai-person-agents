/** 将可滚动节点滚到底部（用于消息列表，避免 scrollIntoView 带动整页） */
export function scrollNodeToBottom(el: HTMLElement | null): void {
  if (!el) return;
  requestAnimationFrame(() => {
    el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  });
}
