import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
