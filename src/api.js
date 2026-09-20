const API_URL = import.meta.env.VITE_API_URL;

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    // Session expired or was cleared: reloading re-runs /api/me and routes to /login.
    window.location.reload();
  }
  if (!res.ok) throw new Error(data.error ?? `Request failed: ${res.status}`);
  return data;
}

export const formatDate = (value) => (value ? new Date(value).toLocaleString() : "");
