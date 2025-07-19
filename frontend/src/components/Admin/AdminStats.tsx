import React from 'react';
import { useAdminStore } from '@/store/adminStore';

const AdminStats: React.FC = () => {
  const { stats } = useAdminStore();

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total de Documentos',
      value: stats.total_documents,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Concluídos',
      value: stats.completed_documents,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Com Erro',
      value: stats.error_documents,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      label: 'Processando',
      value: stats.processing_documents,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Total de Chunks',
      value: stats.total_chunks,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Taxa de Sucesso',
      value: `${stats.success_rate.toFixed(1)}%`,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Estatísticas do Sistema</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className={`${item.bgColor} rounded-lg p-4`}>
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      
      {stats.total_documents > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Documentos processados com sucesso:</span>
            <span className="font-medium">
              {stats.completed_documents} de {stats.total_documents}
            </span>
          </div>
          
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.success_rate}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;