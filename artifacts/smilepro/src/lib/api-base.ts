function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string | null {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL ?? "").trim();
  if (!fromEnv) return null;
  return normalizeBaseUrl(fromEnv);
}

export function toApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}