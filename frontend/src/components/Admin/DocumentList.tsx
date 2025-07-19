import React, { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DocumentList: React.FC = () => {
  const { uploadedDocuments, deleteDocument, fetchDocuments } = useAdminStore();
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteDocument(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erro ao remover documento:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Concluído</span>;
      case 'processing':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Processando</span>;
      case 'error':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Erro</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Pendente</span>;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getLawTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'constituicao': 'Constituição',
      'codigo_civil': 'Código Civil',
      'codigo_penal': 'Código Penal',
      'lei_trabalho': 'Lei do Trabalho',
      'codigo_comercial': 'Código Comercial',
      'lei_familiar': 'Lei da Família',
      'decreto': 'Decreto',
      'regulamento': 'Regulamento',
      'outros': 'Outros'
    };
    return types[type] || type;
  };

  if (uploadedDocuments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Documentos Carregados</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum documento carregado ainda.</p>
          <p className="text-sm text-gray-400 mt-2">
            Use o formulário acima para fazer upload do primeiro documento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Documentos Carregados</h3>
        <button
          onClick={fetchDocuments}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Atualizar
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chunks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uploadedDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                    <div className="text-sm text-gray-500">
                      {doc.original_filename} ({formatFileSize(doc.file_size)})
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{doc.source}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{getLawTypeLabel(doc.law_type)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(doc.processing_status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {doc.chunks_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(doc.uploaded_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  <div className="text-xs text-gray-400">por {doc.uploaded_by_username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {deleteConfirm === doc.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(doc.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remover
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;