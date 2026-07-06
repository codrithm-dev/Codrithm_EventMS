const USER_KEY = "user";

export function getAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function getRefreshToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)refresh_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setTokens(_accessToken: string, _refreshToken: string): void {
  // Tokens are set as httpOnly cookies by the backend
  // This function is kept for backward compatibility but does nothing
}

export function setFrontendSessionCookie(token: string): void {
  if (typeof document === "undefined") return;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const maxAge = payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 1800;
    document.cookie = `access_token=${token}; path=/; max-age=${maxAge}; sameSite=lax`;
  } catch {}
}

export function removeTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export function setStoredUser(user: Record<string, unknown>): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser<T = Record<string, unknown>>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function logout(): void {
  fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
  localStorage.removeItem(USER_KEY);
  document.cookie = "access_token=; path=/; max-age=0";
  window.location.href = "/login";
}

export function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}
