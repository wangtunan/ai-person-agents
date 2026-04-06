export function cn(
  ...parts: (string | undefined | boolean | null)[]
): string {
  return parts.filter(Boolean).join(" ");
}
