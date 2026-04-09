import api from './api';

export interface LoginCredentials {
  tenantId: string;
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials) {
  localStorage.setItem('tenantId', credentials.tenantId);

  const { data } = await api.post('/auth/login', {
    email: credentials.email,
    password: credentials.password,
  });

  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', data.user.id);
  localStorage.setItem('userRole', data.user.role);
  localStorage.setItem('userName', data.user.email);

  return data;
}

export function logout() {
  api.post('/auth/logout').catch(() => {});
  localStorage.clear();
  window.location.href = '/login';
}

export function isAuthenticated() {
  return typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
}

export function getUserRole() {
  return typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
}
