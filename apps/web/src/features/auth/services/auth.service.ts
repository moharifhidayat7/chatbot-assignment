import { apiClient } from '@/services';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth.types';

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  return apiClient<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export function logoutFromServer(refreshToken: string): Promise<void> {
  return apiClient<void>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}
