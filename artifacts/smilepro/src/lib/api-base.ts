const LOCALHOST_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string | null {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL ?? "").trim();
  if (fromEnv) {
    return normalizeBaseUrl(fromEnv);
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase();
    if (LOCALHOST_HOSTS.has(host)) {
      return "http://localhost:8081";
    }
  }

  return null;
}

export function toApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();

  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}