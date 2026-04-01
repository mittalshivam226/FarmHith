const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (Array.isArray(data?.detail)) return data.detail.map((item: unknown) => String(item)).join(', ');
    if (data?.detail) return String(data.detail);
    if (data?.message) return String(data.message);
  } catch {
    // ignore JSON parse errors
  }
  return `Request failed with status ${response.status}`;
}

interface BackendRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
}

export async function backendRequest<TResponse>(
  path: string,
  options: BackendRequestOptions = {}
): Promise<TResponse> {
  const { method = 'GET', payload, token, headers = {} } = options;
  const requestHeaders: Record<string, string> = {
    ...headers,
  };
  if (payload !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export function backendGet<TResponse>(path: string, token?: string | null): Promise<TResponse> {
  return backendRequest<TResponse>(path, { method: 'GET', token });
}

export function backendPost<TRequest, TResponse>(path: string, payload: TRequest, token?: string | null): Promise<TResponse> {
  return backendRequest<TResponse>(path, { method: 'POST', payload, token });
}

export function backendPut<TRequest, TResponse>(path: string, payload: TRequest, token?: string | null): Promise<TResponse> {
  return backendRequest<TResponse>(path, { method: 'PUT', payload, token });
}

export function backendPatch<TRequest, TResponse>(path: string, payload: TRequest, token?: string | null): Promise<TResponse> {
  return backendRequest<TResponse>(path, { method: 'PATCH', payload, token });
}
