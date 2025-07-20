import React, { useState, useEffect } from 'react';
import { Shield, Zap, Database, Settings, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function SystemImprovements() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [runningTests, setRunningTests] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/improvements/status');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao obter status das melhorias:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    setRunningTests(true);
    const tests = ['cache', 'rate-limit', 'cached-function'];
    const results = {};

    for (const test of tests) {
      try {
        let response;
        
        switch (test) {
          case 'cache':
            response = await fetch('http://localhost:8000/api/improvements/test-cache', {
              method: 'POST'
            });
            break;
          case 'rate-limit':
            response = await fetch('http://localhost:8000/api/improvements/test-rate-limit');
            break;
          case 'cached-function':
            response = await fetch('http://localhost:8000/api/improvements/test-cached-function', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ input: 'teste das melhorias' })
            });
            break;
        }

        if (response.ok) {
          const data = await response.json();
          results[test] = { success: true, data };
        } else {
          const errorData = await response.text();
          results[test] = { success: false, error: errorData };
        }
      } catch (err) {
        results[test] = { success: false, error: err.message };
      }
    }

    setTestResults(results);
    setRunningTests(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getModuleIcon = (moduleName, isAvailable) => {
    const iconClass = "w-6 h-6";
    const color = isAvailable ? "text-green-500" : "text-red-500";
    
    switch (moduleName) {
      case 'config':
        return <Settings className={`${iconClass} ${color}`} />;
      case 'rate_limiting':
        return <Shield className={`${iconClass} ${color}`} />;
      case 'cache_service':
        return <Database className={`${iconClass} ${color}`} />;
      default:
        return <Zap className={`${iconClass} ${color}`} />;
    }
  };

  const getStatusBadge = (isAvailable) => {
    return isAvailable ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactivo
      </span>
    );
  };

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="text-white text-lg">Verificando melhorias do sistema...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Melhorias do Sistema
              </h1>
              <p className="text-gray-300 mt-2">
                Monitorização das melhorias de infraestrutura implementadas
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={fetchStatus}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={runTests}
                disabled={runningTests || !status?.improvements_available}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {runningTests ? 'Executando...' : 'Executar Testes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-red-300">Erro de Conexão</h3>
            </div>
            <p className="text-red-200 mt-2">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Status Geral */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Estado Geral</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Melhorias Disponíveis</span>
                    {getStatusBadge(status?.improvements_available)}
                  </div>
                  <div className="text-2xl font-bold">
                    {status?.improvements_available ? 'Sim' : 'Não'}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Módulos Carregados</span>
                    <span className="text-sm text-white/50">
                      {status?.modules ? Object.values(status.modules).filter(Boolean).length : 0}/3
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {status?.modules ? Object.values(status.modules).filter(Boolean).length : 0} módulos
                  </div>
                </div>
              </div>
            </div>

            {/* Módulos */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Módulos Implementados</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {status?.modules && Object.entries(status.modules).map(([moduleName, isAvailable]) => (
                  <div
                    key={moduleName}
                    className={`bg-white/10 rounded-lg p-4 border-l-4 ${
                      isAvailable ? 'border-green-500' : 'border-red-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getModuleIcon(moduleName, isAvailable)}
                        <span className="font-medium capitalize">
                          {moduleName.replace('_', ' ')}
                        </span>
                      </div>
                      {getStatusBadge(isAvailable)}
                    </div>
                    
                    {status.features?.[moduleName] && (
                      <div className="text-sm text-white/70 space-y-1">
                        {Object.entries(status.features[moduleName]).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace('_', ' ')}:</span>
                            <span className="font-mono text-xs">
                              {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resultados dos Testes */}
            {Object.keys(testResults).length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Resultados dos Testes</h2>
                <div className="space-y-4">
                  {Object.entries(testResults).map(([testName, result]) => (
                    <div
                      key={testName}
                      className={`bg-white/10 rounded-lg p-4 border-l-4 ${
                        result.success ? 'border-green-500' : 'border-red-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">
                          Teste: {testName.replace('-', ' ')}
                        </h3>
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      {result.success ? (
                        <div className="text-sm text-white/70">
                          <pre className="bg-black/20 rounded p-2 overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="text-red-300 text-sm">
                          Erro: {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Erros */}
            {status?.errors && Object.keys(status.errors).length > 0 && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-red-300">Erros Detectados</h2>
                <div className="space-y-2">
                  {Object.entries(status.errors).map(([module, error]) => (
                    <div key={module} className="bg-red-500/20 rounded p-3">
                      <div className="font-medium text-red-200 capitalize">{module}:</div>
                      <div className="text-red-300 text-sm mt-1">{error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}