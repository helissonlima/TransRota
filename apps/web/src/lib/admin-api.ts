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
  (error) => {
    const isLoginPage =
      typeof window !== 'undefined' &&
      window.location.pathname.includes('/admin/login');
    if (error.response?.status === 401 && !isLoginPage) {
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  },
);

export async function adminLogin(email: string, password: string) {
  const { data } = await adminApi.post('/admin/auth/login', { email, password });
  localStorage.setItem('adminAccessToken', data.accessToken);
  localStorage.setItem('adminUser', JSON.stringify(data.user));
  return data;
}

export function adminLogout() {
  localStorage.removeItem('adminAccessToken');
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

export default adminApi;
