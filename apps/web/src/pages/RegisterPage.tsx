import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { RegisterForm } from '@/features/auth';
import { AuthLayout } from '@/layouts';

export function RegisterPage() {
  const { user } = useAuthStore();
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <AuthLayout title="Create an account" subtitle="Build and chat with your own AI agents.">
      <RegisterForm />
    </AuthLayout>
  );
}
