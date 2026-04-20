import axios from "axios";
import { clearUserSessionStorage } from "./session-storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function uploadPhoto(
  file: File,
  entity: "client" | "supplier" | "driver" | "vehicle",
) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(`/upload/photo?entity=${entity}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data as {
    key: string;
    photoUrl: string;
    contentType: string;
    size: number;
    width: number;
    height: number;
  };
}

// Injeta token e tenant em todas as requisições
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    const tenantId = localStorage.getItem("tenantId");

    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (tenantId) config.headers["X-Tenant-ID"] = tenantId;
  }
  return config;
});

// Refresh automático de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const requestUrl = String(original?.url ?? "");
    const isAuthRoute =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/admin/auth/login") ||
      requestUrl.includes("/admin/auth/refresh");

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;
      try {
        const userId = localStorage.getItem("userId");
        const refreshToken = localStorage.getItem("refreshToken");
        const tenantId = localStorage.getItem("tenantId");

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { userId, refreshToken },
          { headers: { "X-Tenant-ID": tenantId } },
        );

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        clearUserSessionStorage();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
