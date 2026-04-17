const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);

function normalizeBaseUrl(url: unknown): string | null {
  if (typeof url !== "string") return null;

  const trimmed = url.trim();
  if (trimmed.length === 0) return null;

  return trimmed.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string | null {
  const fromEnv = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
  if (fromEnv) return fromEnv;

  if (!import.meta.env.DEV || typeof window === "undefined") {
    return null;
  }

  const host = window.location.hostname;
  if (!LOCAL_HOSTNAMES.has(host)) {
    return null;
  }

  return `http://${host}:8081`;
}

export function toApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
}
