import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, XCircle, Clock, Activity, Zap } from 'lucide-react';

const LLMOrchestraStatus = () => {
  const [orchestraStatus, setOrchestraStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchOrchestraStatus();
    const interval = setInterval(fetchOrchestraStatus, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchOrchestraStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/orchestra/status');
      const data = await response.json();
      setOrchestraStatus(data);
    } catch (error) {
      console.error('Erro ao obter status do orquestrador:', error);
      setOrchestraStatus({ available: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testOrchestra = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/orchestra/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Como funciona o sistema jurídico moçambicano?"
        })
      });
      
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      console.error('Erro no teste do orquestrador:', error);
      setTestResult({ 
        test_successful: false, 
        error: error.message 
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center">
          <Clock className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-600">Carregando status do orquestrador...</span>
        </div>
      </div>
    );
  }

  if (!orchestraStatus?.available) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <XCircle className="w-6 h-6 text-red-500" />
          <h3 className="ml-3 text-lg font-semibold text-red-800">
            Orquestrador LLM Indisponível
          </h3>
        </div>
        <p className="text-red-700 mb-3">
          {orchestraStatus?.error || "Sistema de orquestração não está funcionando"}
        </p>
        <p className="text-red-600 text-sm">
          Fallback: {orchestraStatus?.fallback || "Usando Gemini directo"}
        </p>
      </div>
    );
  }

  const { status, available_providers, fallback_order } = orchestraStatus;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h3 className="ml-3 text-lg font-semibold text-green-800">
            Orquestrador LLM Activo
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded p-3">
            <div className="text-sm text-gray-600">Provedores Disponíveis</div>
            <div className="text-xl font-bold text-gray-900">
              {available_providers?.length || 0}
            </div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-sm text-gray-600">Ordem de Fallback</div>
            <div className="text-sm font-medium text-gray-900">
              {fallback_order?.join(' → ') || 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-sm text-gray-600">Status</div>
            <div className="text-xl font-bold text-green-600">Operacional</div>
          </div>
        </div>
      </div>

      {/* Providers Status */}
      {status?.providers && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Estado dos Provedores
          </h4>
          <div className="space-y-3">
            {Object.entries(status.providers).map(([provider, info]) => (
              <div 
                key={provider}
                className={`p-4 rounded-lg border ${
                  info.available 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className={`w-5 h-5 ${
                      info.available ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className="ml-3 font-medium text-gray-900">
                      {provider.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    info.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {info.available ? 'Disponível' : 'Indisponível'}
                  </div>
                </div>
                
                {info.model_info && (
                  <div className="mt-3 text-sm text-gray-600">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Modelo:</span> {info.model_info.model}
                      </div>
                      <div>
                        <span className="font-medium">Max Tokens:</span> {info.model_info.max_tokens}
                      </div>
                    </div>
                    {info.model_info.specialties && (
                      <div className="mt-2">
                        <span className="font-medium">Especialidades:</span>{' '}
                        {info.model_info.specialties.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {status?.metrics && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Métricas de Performance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded p-4">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="ml-2 text-sm text-blue-700 font-medium">
                  Total de Pedidos
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-900 mt-2">
                {status.metrics.total_requests || 0}
              </div>
            </div>
            
            <div className="bg-green-50 rounded p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="ml-2 text-sm text-green-700 font-medium">
                  Taxa de Sucesso
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900 mt-2">
                {status.metrics.success_rate || 0}%
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded p-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="ml-2 text-sm text-yellow-700 font-medium">
                  Tempo Médio
                </span>
              </div>
              <div className="text-2xl font-bold text-yellow-900 mt-2">
                {status.metrics.avg_response_time || 0}s
              </div>
            </div>
            
            <div className="bg-purple-50 rounded p-4">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-purple-500" />
                <span className="ml-2 text-sm text-purple-700 font-medium">
                  Fallbacks
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-900 mt-2">
                {status.metrics.fallback_activations || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Teste do Orquestrador
          </h4>
          <button
            onClick={testOrchestra}
            disabled={testing}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              testing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {testing ? (
              <>
                <Clock className="w-4 h-4 animate-spin inline mr-2" />
                Testando...
              </>
            ) : (
              'Executar Teste'
            )}
          </button>
        </div>

        {testResult && (
          <div className={`p-4 rounded-lg ${
            testResult.test_successful 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center mb-3">
              {testResult.test_successful ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`ml-2 font-medium ${
                testResult.test_successful ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.test_successful ? 'Teste Bem-Sucedido!' : 'Teste Falhado'}
              </span>
            </div>
            
            {testResult.test_successful && (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Provedor Usado:</span> {testResult.provider_used}
                </div>
                <div>
                  <span className="font-medium">Tempo de Resposta:</span> {testResult.response_time?.toFixed(2)}s
                </div>
                <div>
                  <span className="font-medium">Prévia da Resposta:</span>
                  <div className="mt-1 p-2 bg-white rounded text-gray-700 italic">
                    "{testResult.response_preview}"
                  </div>
                </div>
              </div>
            )}
            
            {testResult.error && (
              <div className="text-red-700 text-sm">
                <span className="font-medium">Erro:</span> {testResult.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LLMOrchestraStatus;