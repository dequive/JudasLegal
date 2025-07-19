import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAdminStore } from '@/store/adminStore';
import AdminLogin from '@/components/Admin/AdminLogin';

const AdminLoginPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAdminStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Evita flash de conteúdo
  }

  return (
    <AdminLogin 
      onLoginSuccess={() => {
        console.log('Login realizado com sucesso');
      }}
    />
  );
};

export default AdminLoginPage;