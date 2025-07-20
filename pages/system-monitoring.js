import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Activity, Database, Zap } from 'lucide-react';

export default function SystemMonitoring() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [cacheTest, setCacheTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      
      // Buscar status do sistema
      const statusResponse = await fetch('http://localhost:8000/api/improvements/status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setSystemStatus(statusData);
      }

      // Testar cache
      const cacheResponse = await fetch('http://localhost:8000/api/improvements/test-cache', {
        method: 'POST'
      });
      if (cacheResponse.ok) {
        const cacheData = await cacheResponse.json();
        setCacheTest(cacheData);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao buscar status do sistema:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatusBadge = ({ status, label }) => (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
      status ? 'bg-green-100 text-green-800 border border-green-200' : 
               'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {status ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {label}
    </div>
  );

  const MetricCard = ({ icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          {icon}
        </div>
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
    </div>
  );

  if (loading && !systemStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">A carregar dados do sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Monitorização do Sistema Muzaia</h1>
              <p className="text-gray-600">Estado em tempo real da infraestrutura</p>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdate && (
                <span className="text-sm text-gray-500">
                  Última actualização: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchSystemStatus}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Geral */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado Geral dos Módulos</h2>
          
          {systemStatus && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatusBadge 
                status={systemStatus.improvements_available} 
                label="Melhorias Activas" 
              />
              <StatusBadge 
                status={systemStatus.modules?.config} 
                label="Configuração" 
              />
              <StatusBadge 
                status={systemStatus.modules?.rate_limiting} 
                label="Rate Limiting" 
              />
              <StatusBadge 
                status={systemStatus.modules?.cache_service} 
                label="Cache Service" 
              />
              <StatusBadge 
                status={!systemStatus.errors || Object.keys(systemStatus.errors).length === 0} 
                label="Sem Erros" 
              />
            </div>
          )}
        </div>

        {/* Métricas Principais */}
        {systemStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={<Database className="w-5 h-5 text-blue-600" />}
              title="Provedores de IA"
              value={systemStatus.features?.config?.ai_providers_available || 0}
              subtitle="Gemini e Claude configurados"
              color="blue"
            />
            
            <MetricCard
              icon={<Activity className="w-5 h-5 text-green-600" />}
              title="Clientes Activos"
              value={systemStatus.features?.rate_limiting?.active_clients || 0}
              subtitle="Rate limiting monitorizado"
              color="green"
            />
            
            <MetricCard
              icon={<Zap className="w-5 h-5 text-purple-600" />}
              title="Cache Hit Ratio"
              value={`${systemStatus.features?.cache_service?.hit_ratio || 0}%`}
              subtitle="Eficiência do cache"
              color="purple"
            />
            
            <MetricCard
              icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
              title="Cache Entries"
              value={systemStatus.features?.cache_service?.memory_cache_size || 0}
              subtitle="Entradas em memória"
              color="emerald"
            />
          </div>
        )}

        {/* Teste de Cache */}
        {cacheTest && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resultado do Teste de Cache</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Dados em Cache</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700">
                    {JSON.stringify(cacheTest.cached_data, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Estatísticas do Cache</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hits:</span>
                    <span className="font-medium">{cacheTest.cache_stats?.hits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Misses:</span>
                    <span className="font-medium">{cacheTest.cache_stats?.misses || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sets:</span>
                    <span className="font-medium">{cacheTest.cache_stats?.sets || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hit Ratio:</span>
                    <span className="font-medium text-green-600">
                      {cacheTest.cache_stats?.hit_ratio || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Redis:</span>
                    <span className={`font-medium ${
                      cacheTest.cache_stats?.redis_available ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {cacheTest.cache_stats?.redis_available ? 'Disponível' : 'Fallback Memory'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rate Limiting Details */}
        {systemStatus?.features?.rate_limiting && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuração Rate Limiting</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {systemStatus.features.rate_limiting.per_minute_limit}
                </div>
                <div className="text-sm text-blue-700">Requests/Minuto</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {systemStatus.features.rate_limiting.per_hour_limit}
                </div>
                <div className="text-sm text-green-700">Requests/Hora</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {systemStatus.features.rate_limiting.active_clients}
                </div>
                <div className="text-sm text-purple-700">Clientes Activos</div>
              </div>
            </div>
          </div>
        )}

        {/* Erros do Sistema */}
        {systemStatus?.errors && Object.keys(systemStatus.errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-4">Erros Detectados</h2>
            
            <div className="space-y-2">
              {Object.entries(systemStatus.errors).map(([module, error]) => (
                <div key={module} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-900">{module}</div>
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}