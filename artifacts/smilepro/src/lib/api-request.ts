import { getApiBaseUrl, toApiUrl } from "@/lib/api-base";

const LOCAL_API_BASES = [
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://0.0.0.0:8081",
];

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

type ApiRequestResult<T> = {
  response: Response;
  data: T;
  url: string;
};

type ApiRequestErrorOptions = {
  status?: number;
  data?: unknown;
  url?: string | null;
  attempts: string[];
};

export class ApiRequestError extends Error {
  readonly status: number;
  readonly data: unknown;
  readonly url: string | null;
  readonly attempts: string[];

  constructor(message: string, options: ApiRequestErrorOptions) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = "ApiRequestError";
    this.status = options.status ?? 0;
    this.data = options.data ?? null;
    this.url = options.url ?? null;
    this.attempts = options.attempts;
  }
}

function normalizeApiPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function isApiPath(path: string): boolean {
  return path === "/api" || path.startsWith("/api/");
}

function shouldTryLocalFallback(): boolean {
  if (typeof window === "undefined") return true;
  return LOCAL_HOSTS.has(window.location.hostname.toLowerCase());
}

function isMissingApiBaseOnHostedClient(path: string): boolean {
  if (!isApiPath(path)) return false;
  if (shouldTryLocalFallback()) return false;
  return !getApiBaseUrl();
}

function buildCandidateUrls(path: string): string[] {
  const normalizedPath = normalizeApiPath(path);
  const localCandidates = shouldTryLocalFallback()
    ? LOCAL_API_BASES.map((base) => `${base}${normalizedPath}`)
    : [];

  const candidates = [
    toApiUrl(normalizedPath),
    normalizedPath,
    ...localCandidates,
  ];

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const candidate of candidates) {
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    unique.push(candidate);
  }

  return unique;
}

function isRetryableStatus(status: number): boolean {
  return status === 404 || status === 405 || status === 502 || status === 503 || status === 504;
}

function looksLikeHtmlDocument(value: string): boolean {
  const sample = value.trimStart().slice(0, 120).toLowerCase();
  return sample.startsWith("<!doctype html") || sample.startsWith("<html");
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return null;

  const raw = await response.text();
  if (!raw) return null;

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

function summarizeHttpFailure(status: number, url: string, data: unknown): string {
  const base = `HTTP ${status} from ${url}`;

  const extracted = extractApiErrorMessage(data);
  if (extracted) return `${base}: ${extracted}`;

  if (typeof data === "string" && looksLikeHtmlDocument(data) && url.includes("/api/")) {
    return `${base}: API returned HTML instead of JSON. Configure VITE_API_BASE_URL to your deployed backend URL.`;
  }

  if (typeof data === "string" && data.trim()) {
    return `${base}: ${data.trim().slice(0, 220)}`;
  }

  return base;
}

export function extractApiErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const candidate = payload as Record<string, unknown>;
  const value = candidate.error ?? candidate.message ?? candidate.detail;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function requestApiJson<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<ApiRequestResult<T>> {
  const normalizedPath = normalizeApiPath(path);

  if (isMissingApiBaseOnHostedClient(normalizedPath)) {
    throw new ApiRequestError(
      "API base URL is not configured for this deployed frontend. Set VITE_API_BASE_URL to your backend URL.",
      {
        status: 0,
        data: null,
        url: null,
        attempts: [],
      },
    );
  }

  const attempts = buildCandidateUrls(normalizedPath);
  let networkErrorMessage: string | null = null;
  let lastHttpFailure: { status: number; data: unknown; url: string } | null = null;

  for (const url of attempts) {
    try {
      const response = await fetch(url, init);
      const data = await parseResponseBody(response);

      if (response.ok) {
        return {
          response,
          data: data as T,
          url,
        };
      }

      lastHttpFailure = { status: response.status, data, url };

      if (!isRetryableStatus(response.status)) {
        throw new ApiRequestError(summarizeHttpFailure(response.status, url, data), {
          status: response.status,
          data,
          url,
          attempts,
        });
      }
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }

      networkErrorMessage = error instanceof Error ? error.message : String(error);
    }
  }

  if (lastHttpFailure) {
    throw new ApiRequestError(
      summarizeHttpFailure(lastHttpFailure.status, lastHttpFailure.url, lastHttpFailure.data),
      {
        status: lastHttpFailure.status,
        data: lastHttpFailure.data,
        url: lastHttpFailure.url,
        attempts,
      },
    );
  }

  throw new ApiRequestError(networkErrorMessage ?? "Failed to reach API", {
    status: 0,
    data: null,
    url: null,
    attempts,
  });
}