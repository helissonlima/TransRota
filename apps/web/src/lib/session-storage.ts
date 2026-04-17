const USER_SESSION_KEYS = [
  "tenantId",
  "accessToken",
  "refreshToken",
  "userId",
  "userRole",
  "userName",
  "userEmail",
] as const;

const ADMIN_SESSION_KEYS = [
  "adminAccessToken",
  "adminRefreshToken",
  "adminUser",
] as const;

function removeKeys(keys: readonly string[]) {
  if (typeof window === "undefined") return;

  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

export function clearUserSessionStorage() {
  removeKeys(USER_SESSION_KEYS);
}

export function clearAdminSessionStorage() {
  removeKeys(ADMIN_SESSION_KEYS);
}
