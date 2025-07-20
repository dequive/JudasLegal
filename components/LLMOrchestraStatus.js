import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Zap, AlertTriangle, RefreshCw } from 'lucide-react';

export default function LLMOrchestraStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/orchestra/status');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStatus(data);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erro ao obter status do orquestrador:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getProviderIcon = (providerName, isAvailable) => {
    if (!isAvailable) return <XCircle className="w-5 h-5 text-red-500" />;
    
    switch (providerName) {
      case 'claude_3_sonnet':
      case 'claude_3_haiku':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'gemini_2_flash':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'openai_gpt4':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getProviderColor = (providerName) => {
    switch (providerName) {
      case 'claude_3_sonnet':
      case 'claude_3_haiku':
        return 'border-purple-200 bg-purple-50';
      case 'gemini_2_flash':
        return 'border-blue-200 bg-blue-50';
      case 'openai_gpt4':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatProviderName = (name) => {
    const nameMap = {
      'claude_3_sonnet': 'Claude 3 Sonnet',
      'claude_3_haiku': 'Claude 3 Haiku',
      'gemini_2_flash': 'Gemini 2.0 Flash',
      'openai_gpt4': 'OpenAI GPT-4'
    };
    return nameMap[name] || name;
  };

  if (loading && !status) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="text-white">Carregando estado do orquestrador...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <XCircle className="w-6 h-6 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Erro de Conexão</h3>
        </div>
        <p className="text-red-300 mb-4">{error}</p>
        <button
          onClick={fetchStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Estado Geral do Sistema</h3>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-white/70">Estado</span>
            </div>
            <div className="text-xl font-bold text-white">
              {status?.orchestra_enabled ? 'Activo' : 'Inactivo'}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-white/70">Provedores</span>
            </div>
            <div className="text-xl font-bold text-white">
              {status?.available_providers?.length || 0}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-white/70">Tempo Médio</span>
            </div>
            <div className="text-xl font-bold text-white">
              {status?.metrics?.avg_response_time || 0}s
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-white/70">Taxa Sucesso</span>
            </div>
            <div className="text-xl font-bold text-white">
              {status?.metrics?.success_rate || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Provedores Disponíveis */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Provedores de IA</h3>
        
        {status?.available_providers?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {status.available_providers.map((provider, index) => (
              <div
                key={provider}
                className={`rounded-lg border p-4 ${getProviderColor(provider)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getProviderIcon(provider, true)}
                    <span className="font-medium text-gray-900">
                      {formatProviderName(provider)}
                    </span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Disponível
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  Ordem na hierarquia: #{index + 1}
                </div>
                
                {status.metrics?.provider_distribution && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">
                      Utilização: {status.metrics.provider_distribution[`${provider}_requests`] || 0} pedidos
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, ((status.metrics.provider_distribution[`${provider}_requests`] || 0) / Math.max(1, status.metrics.total_requests)) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-white/70">Nenhum provedor de IA disponível</p>
            <p className="text-sm text-white/50 mt-2">
              Configure as chaves API necessárias
            </p>
          </div>
        )}
      </div>

      {/* Métricas Detalhadas */}
      {status?.metrics && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Métricas Detalhadas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70 mb-1">Total de Pedidos</div>
              <div className="text-2xl font-bold text-white">
                {status.metrics.total_requests}
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70 mb-1">Pedidos Falhados</div>
              <div className="text-2xl font-bold text-white">
                {status.metrics.total_failures}
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70 mb-1">Activações Fallback</div>
              <div className="text-2xl font-bold text-white">
                {status.metrics.fallback_activations}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informações de Actualização */}
      {lastUpdate && (
        <div className="text-center">
          <p className="text-sm text-white/50">
            Última actualização: {lastUpdate.toLocaleTimeString('pt-PT')}
          </p>
        </div>
      )}
    </div>
  );
}