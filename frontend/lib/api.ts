import type { ApiResponse } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip JSON.stringify + Content-Type header, e.g. when body is already a string. */
  raw?: boolean;
  /** Next.js data cache controls, only meaningful for Server Component calls. */
  next?: NextFetchRequestConfig;
}

/**
 * Talks to the Express API and unwraps the { ok, status, data, error }
 * envelope every route returns.
 *
 * `credentials: "include"` matters here: frontend and backend are on
 * separate origins in production, so Better Auth's session cookie is only
 * ever attached when this code runs *in the browser* and calls the backend
 * directly. Calling this from a Server Component is fine for public GETs
 * (events, reviews) — for authenticated writes, call it from a Client
 * Component instead, so the browser sends the cookie.
 */
export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, raw, headers, next, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(raw || body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : raw ? (body as BodyInit) : JSON.stringify(body),
    next,
  });

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError("Unexpected response from server.", res.status);
  }

  if (!json.ok) {
    throw new ApiError(json.error ?? "Something went wrong.", json.status ?? res.status);
  }

  return json.data as T;
}

export function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
