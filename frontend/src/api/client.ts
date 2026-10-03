import { readUser } from '../lib/storage';

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/** Base URL is '' (same origin). In dev, Vite proxies /api and /media to the backend on :8080. */
export const BASE_URL = '';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Plain objects are sent as JSON; FormData is passed through. */
  body?: unknown;
}

export async function api<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = opts;
  const h = new Headers(headers);
  const user = readUser();
  if (user) h.set('X-Cafe-User', user);
  let payload: BodyInit | undefined;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) {
    h.set('Content-Type', 'application/json');
    payload = JSON.stringify(body);
  }
  const res = await fetch(BASE_URL + path, { ...rest, headers: h, body: payload });
  const ct = res.headers.get('content-type') || '';
  const data: unknown = res.status === 204 ? null : ct.includes('json') ? await res.json().catch(() => null) : await res.text();
  if (!res.ok) {
    const detail = (data && typeof data === 'object' && 'detail' in data ? String((data as { detail: unknown }).detail) : null) || res.statusText || 'Request failed';
    throw new ApiError(res.status, detail, data);
  }
  return data as T;
}

export const get = <T = unknown>(path: string) => api<T>(path);
export const post = <T = unknown>(path: string, body?: unknown) => api<T>(path, { method: 'POST', body });
export const put = <T = unknown>(path: string, body?: unknown) => api<T>(path, { method: 'PUT', body });
export const patch = <T = unknown>(path: string, body?: unknown) => api<T>(path, { method: 'PATCH', body });
export const del = <T = unknown>(path: string) => api<T>(path, { method: 'DELETE' });
