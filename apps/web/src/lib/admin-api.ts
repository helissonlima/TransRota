import axios from "axios";
import JSZip from "jszip";
import { clearAdminSessionStorage } from "./session-storage";

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

adminApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminAccessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const isLoginPage =
      typeof window !== "undefined" &&
      window.location.pathname.includes("/admin/login");

    if (error.response?.status === 401 && !original._retry && !isLoginPage) {
      original._retry = true;
      try {
        const user = getAdminUser();
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("adminRefreshToken")
            : null;

        if (!user?.id || !refreshToken) throw new Error("no refresh token");

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/refresh`,
          { adminId: user.id, refreshToken },
        );

        localStorage.setItem("adminAccessToken", data.accessToken);
        localStorage.setItem("adminRefreshToken", data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return adminApi(original);
      } catch {
        clearAdminSessionStorage();
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);

export async function adminLogin(email: string, password: string) {
  const { data } = await adminApi.post("/admin/auth/login", {
    email,
    password,
  });
  localStorage.setItem("adminAccessToken", data.accessToken);
  localStorage.setItem("adminRefreshToken", data.refreshToken);
  localStorage.setItem("adminUser", JSON.stringify(data.user));
  return data;
}

export function adminLogout() {
  clearAdminSessionStorage();
  window.location.href = "/admin/login";
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

export function isAdminAuthenticated() {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("adminAccessToken");
  if (!token) return false;

  if (!isJwtActive(token)) {
    clearAdminSessionStorage();
    return false;
  }

  return true;
}

export function getAdminUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("adminUser") ?? "");
  } catch {
    return null;
  }
}

export async function downloadFullBackup() {
  const response = await adminApi.get("/admin/ops/backup/full", {
    responseType: "blob",
  });
  const contentDisposition = response.headers["content-disposition"] as
    | string
    | undefined;
  const fileNameMatch = contentDisposition?.match(/filename="?([^";]+)"?/i);
  const fileName =
    fileNameMatch?.[1] ?? `transrota-full-backup-${Date.now()}.zip`;

  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/zip" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadCompanyBackup(companyId: string) {
  const response = await adminApi.get(
    `/admin/ops/backup/company/${companyId}`,
    { responseType: "blob" },
  );
  const contentDisposition = response.headers["content-disposition"] as
    | string
    | undefined;
  const fileNameMatch = contentDisposition?.match(/filename="?([^";]+)"?/i);
  const fileName =
    fileNameMatch?.[1] ?? `company-backup-${companyId}-${Date.now()}.zip`;

  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/zip" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function uploadFullRestore(file: File): Promise<{
  message: string;
  tenantsRestored: number;
  companiesRestored?: number;
}> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await adminApi.post("/admin/ops/restore/full", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function uploadCompanyRestore(
  file: File,
): Promise<{ message: string; companyId: string; schemaName: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await adminApi.post("/admin/ops/restore/company", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export type SmartRestoreResult =
  | {
      type: "company";
      data: { message: string; companyId: string; schemaName: string };
    }
  | {
      type: "full";
      data: {
        message: string;
        tenantsRestored: number;
        companiesRestored?: number;
      };
    };

async function detectBackupType(file: File): Promise<"company" | "full"> {
  try {
    const zip = await JSZip.loadAsync(file);
    const manifestEntry = zip.file("manifest.json");
    if (!manifestEntry) return "company";

    const manifestRaw = await manifestEntry.async("string");
    const manifest = JSON.parse(manifestRaw) as { type?: string };
    return manifest.type === "full" ? "full" : "company";
  } catch {
    // Se não conseguir ler o ZIP no cliente, deixa a API validar.
    return "company";
  }
}

export async function uploadSmartRestore(
  file: File,
): Promise<SmartRestoreResult> {
  const backupType = await detectBackupType(file);

  if (backupType === "full") {
    const data = await uploadFullRestore(file);
    return { type: "full", data };
  }

  const data = await uploadCompanyRestore(file);
  return { type: "company", data };
}

export default adminApi;
