import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAdminStore } from '@/store/adminStore';
import DocumentUpload from '@/components/Admin/DocumentUpload';
import DocumentList from '@/components/Admin/DocumentList';
import AdminStats from '@/components/Admin/AdminStats';

const AdminDashboard = () => {
  const router = useRouter();
  const { isAuthenticated, userRole, username, logout, fetchDocuments, fetchStats } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !['ADMIN', 'SUPERADMIN'].includes(userRole || '')) {
      router.push('/admin/login');
      return;
    }

    // Carregar dados iniciais
    const loadData = async () => {
      try {
        await Promise.all([fetchDocuments(), fetchStats()]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, userRole, router, fetchDocuments, fetchStats]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleUploadComplete = () => {
    console.log('Upload concluído - dados atualizados automaticamente');
  };

  if (!isAuthenticated || !userRole) {
    return null; // Evita flash de conteúdo
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-50 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Painel Administrativo - Judas
              </h1>
              <p className="text-sm text-gray-500">
                Bem-vindo, {username} ({userRole})
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Estatísticas */}
          <div className="mb-8">
            <AdminStats />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload de Documentos */}
            <div>
              <DocumentUpload onUploadComplete={handleUploadComplete} />
            </div>

            {/* Navegação Rápida */}
            <div className="bg-gray-50 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => window.open('/', '_blank')}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <h4 className="font-medium text-gray-900">Testar Chatbot</h4>
                  <p className="text-sm text-gray-500">Abrir o chat principal para testar com documentos carregados</p>
                </button>
                
                <button 
                  onClick={fetchDocuments}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <h4 className="font-medium text-gray-900">Atualizar Lista</h4>
                  <p className="text-sm text-gray-500">Recarregar documentos e estatísticas</p>
                </button>
                
                <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-900">Tipos de Documento Suportados</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    PDF, DOCX e TXT até 50MB cada
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Documentos */}
          <div className="mt-8">
            <DocumentList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;