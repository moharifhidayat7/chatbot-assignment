import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { LoginForm } from '@/features/auth';
import { AuthLayout } from '@/layouts';

export function LoginPage() {
  const { user } = useAuthStore();
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue.">
      <LoginForm />
    </AuthLayout>
  );
}
