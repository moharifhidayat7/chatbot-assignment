const BASE_URL = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL ?? 'http://localhost:3001';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- Silent refresh ---

let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error('Refresh failed');

  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  return data.accessToken;
}

function tryRefresh(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

function forceLogout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('auth_user');
  window.location.href = '/login';
}

// --- API client ---

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(getToken()),
      ...init?.headers,
    },
  });

  if (response.status === 401 && !path.startsWith('/auth/')) {
    try {
      const newToken = await tryRefresh();
      const retried = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(newToken),
          ...init?.headers,
        },
      });
      if (!retried.ok) {
        if (retried.status === 401) { forceLogout(); throw new Error('Session expired'); }
        const body = await retried.json().catch(() => ({})) as { message?: string };
        throw new Error(body.message ?? `API error ${retried.status}`);
      }
      if (retried.status === 204 || retried.headers.get('content-length') === '0') return undefined as T;
      return retried.json() as Promise<T>;
    } catch {
      forceLogout();
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `API error ${response.status}`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') return undefined as T;
  return response.json() as Promise<T>;
}

export async function apiStream(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(getToken()),
      ...init?.headers,
    },
  });

  if (response.status === 401 && !path.startsWith('/auth/')) {
    try {
      const newToken = await tryRefresh();
      const retried = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(newToken),
          ...init?.headers,
        },
      });
      if (!retried.ok) {
        if (retried.status === 401) { forceLogout(); throw new Error('Session expired'); }
        const body = await retried.json().catch(() => ({})) as { message?: string };
        throw new Error(body.message ?? `API error ${retried.status}`);
      }
      return retried;
    } catch {
      forceLogout();
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `API error ${response.status}`);
  }

  return response;
}
