import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "./auth";

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
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    setTokens(data.access_token, data.refresh_token);
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

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body !== undefined && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  let res = await fetch(`${BASE_URL}${endpoint}`, config);

  if (res.status === 401 && !skipAuth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = getAccessToken();
      requestHeaders["Authorization"] = `Bearer ${newToken}`;
      config.headers = requestHeaders;
      res = await fetch(`${BASE_URL}${endpoint}`, config);
    } else {
      removeTokens();
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
