const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data?.detail) return String(data.detail);
    if (data?.message) return String(data.message);
  } catch {
    // ignore JSON parse errors
  }
  return `Request failed with status ${response.status}`;
}

export async function backendPost<TRequest, TResponse>(
  path: string,
  payload: TRequest
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as TResponse;
}

