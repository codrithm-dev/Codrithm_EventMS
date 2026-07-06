const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

class ApiClientError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access_token) {
      try {
        const payload = JSON.parse(atob(data.access_token.split(".")[1]));
        const maxAge = payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 1800;
        document.cookie = `access_token=${data.access_token}; path=/; max-age=${maxAge}; sameSite=lax`;
      } catch {}
    }
    return true;
  } catch {
    return false;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, skipAuth = false } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: "include",
  };

  if (body !== undefined && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  let res = await fetch(`${BASE_URL}${endpoint}`, config);

  // Auto-refresh on 401
  if (res.status === 401 && !skipAuth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      res = await fetch(`${BASE_URL}${endpoint}`, config);
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new ApiClientError(401, "Session expired");
    }
  }

  if (!res.ok) {
    let detail = "An error occurred";
    try {
      const errBody = await res.json();
      if (typeof errBody.detail === "string") {
        detail = errBody.detail;
      } else if (Array.isArray(errBody.detail)) {
        detail = errBody.detail.map((d: Record<string, unknown>) => d.msg || String(d)).join(", ");
      } else if (errBody.detail && typeof errBody.detail === "object") {
        detail = JSON.stringify(errBody.detail);
      } else {
        detail = res.statusText || detail;
      }
    } catch {
      detail = res.statusText || detail;
    }
    throw new ApiClientError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get<T>(endpoint: string, skipAuth?: boolean): Promise<T> {
    return request<T>(endpoint, { method: "GET", skipAuth });
  },
  post<T>(endpoint: string, body?: unknown, skipAuth?: boolean): Promise<T> {
    return request<T>(endpoint, { method: "POST", body, skipAuth });
  },
  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, { method: "PUT", body });
  },
  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, { method: "PATCH", body });
  },
  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: "DELETE" });
  },
};

export { ApiClientError };
