const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const token = authToken();
  if (token) headers.set("authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function authToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("lumen-api-token");
}
