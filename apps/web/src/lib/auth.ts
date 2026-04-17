import api from "./api";
import { clearUserSessionStorage } from "./session-storage";

export interface LoginCredentials {
  tenantId: string;
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials) {
  localStorage.setItem("tenantId", credentials.tenantId);

  const { data } = await api.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("userId", data.user.id);
  localStorage.setItem("userRole", data.user.role);
  localStorage.setItem("userName", data.user.name ?? data.user.email);
  localStorage.setItem("userEmail", data.user.email);

  return data;
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isJwtActive(token: string) {
  const payload = parseJwtPayload(token);
  const exp = payload?.exp;

  if (typeof exp !== "number") return false;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return exp > nowInSeconds;
}

export function logout() {
  api.post("/auth/logout").catch(() => {});
  clearUserSessionStorage();
  window.location.href = "/login";
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  if (!isJwtActive(token)) {
    clearUserSessionStorage();
    return false;
  }

  return true;
}

export function getUserRole() {
  return typeof window !== "undefined"
    ? localStorage.getItem("userRole")
    : null;
}
