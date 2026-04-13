import axios from 'axios';

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminAccessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const isLoginPage =
      typeof window !== 'undefined' &&
      window.location.pathname.includes('/admin/login');

    if (error.response?.status === 401 && !original._retry && !isLoginPage) {
      original._retry = true;
      try {
        const user = getAdminUser();
        const refreshToken = typeof window !== 'undefined'
          ? localStorage.getItem('adminRefreshToken')
          : null;

        if (!user?.id || !refreshToken) throw new Error('no refresh token');

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/refresh`,
          { adminId: user.id, refreshToken },
        );

        localStorage.setItem('adminAccessToken', data.accessToken);
        localStorage.setItem('adminRefreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return adminApi(original);
      } catch {
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

export async function adminLogin(email: string, password: string) {
  const { data } = await adminApi.post('/admin/auth/login', { email, password });
  localStorage.setItem('adminAccessToken', data.accessToken);
  localStorage.setItem('adminRefreshToken', data.refreshToken);
  localStorage.setItem('adminUser', JSON.stringify(data.user));
  return data;
}

export function adminLogout() {
  localStorage.removeItem('adminAccessToken');
  localStorage.removeItem('adminRefreshToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/admin/login';
}

export function isAdminAuthenticated() {
  return typeof window !== 'undefined' && !!localStorage.getItem('adminAccessToken');
}

export function getAdminUser() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('adminUser') ?? ''); } catch { return null; }
}

export async function downloadFullBackup() {
  const response = await adminApi.get('/admin/ops/backup/full', { responseType: 'blob' });
  const contentDisposition = response.headers['content-disposition'] as string | undefined;
  const fileNameMatch = contentDisposition?.match(/filename="?([^";]+)"?/i);
  const fileName = fileNameMatch?.[1] ?? `transrota-full-backup-${Date.now()}.zip`;

  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function uploadFullRestore(file: File): Promise<{ message: string; tenantsRestored: number }> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await adminApi.post('/admin/ops/restore/full', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export default adminApi;
