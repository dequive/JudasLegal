import { useState, useEffect } from 'react';
import { Shield, Users, AlertTriangle, Lock, Activity, Eye } from 'lucide-react';

export default function SecurityDashboard() {
  const [authToken, setAuthToken] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [securityStats, setSecurityStats] = useState(null);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.access_token);
        localStorage.setItem('muzaia_admin_token', data.access_token);
        await loadSecurityData(data.access_token);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Erro no login');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityData = async (token) => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${token}` };

      // Carregar estatísticas
      const statsResponse = await fetch('http://localhost:8000/api/security/stats', { headers });
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setSecurityStats(stats);
      }

      // Carregar eventos
      const eventsResponse = await fetch('http://localhost:8000/api/security/events?limit=20', { headers });
      if (eventsResponse.ok) {
        const events = await eventsResponse.json();
        setSecurityEvents(events);
      }

      // Carregar IPs bloqueados
      const ipsResponse = await fetch('http://localhost:8000/api/security/blocked-ips', { headers });
      if (ipsResponse.ok) {
        const ips = await ipsResponse.json();
        setBlockedIPs(ips);
      }

    } catch (err) {
      setError('Erro ao carregar dados de segurança');
    } finally {
      setLoading(false);
    }
  };

  const unblockIP = async (ipAddress) => {
    try {
      const response = await fetch(`http://localhost:8000/api/security/unblock-ip/${ipAddress}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (response.ok) {
        await loadSecurityData(authToken);
      } else {
        setError('Erro ao desbloquear IP');
      }
    } catch (err) {
      setError('Erro de conexão');
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('muzaia_admin_token');
    if (savedToken) {
      setAuthToken(savedToken);
      loadSecurityData(savedToken);
    }
  }, []);

  if (!authToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Painel de Segurança Muzaia
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Acesso administrativo necessário
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Utilizador</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin123"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'A autenticar...' : 'Entrar'}
            </button>
          </form>
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
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Painel de Segurança</h1>
            </div>
            <button
              onClick={() => {
                setAuthToken(null);
                localStorage.removeItem('muzaia_admin_token');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="mb-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">A carregar...</span>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Estatísticas de Segurança */}
        {securityStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-6 h-6 text-blue-600" />
                <h3 className="font-medium text-gray-900">Requests Totais</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900">{securityStats.total_requests}</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="font-medium text-gray-900">Requests Bloqueados</h3>
              </div>
              <div className="text-2xl font-bold text-red-600">{securityStats.blocked_requests}</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-6 h-6 text-orange-600" />
                <h3 className="font-medium text-gray-900">Tentativas Falhadas</h3>
              </div>
              <div className="text-2xl font-bold text-orange-600">{securityStats.failed_login_attempts}</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-green-600" />
                <h3 className="font-medium text-gray-900">Sessões Activas</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">{securityStats.active_sessions}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* IPs Bloqueados */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">IPs Bloqueados</h2>
            
            {blockedIPs.length === 0 ? (
              <p className="text-gray-500">Nenhum IP bloqueado</p>
            ) : (
              <div className="space-y-3">
                {blockedIPs.map((ip, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{ip.ip_address}</div>
                      <div className="text-sm text-gray-600">{ip.reason}</div>
                      {ip.expires_at && (
                        <div className="text-xs text-gray-500">
                          Expira: {new Date(ip.expires_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => unblockIP(ip.ip_address)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Desbloquear
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Eventos de Segurança */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Eventos Recentes</h2>
            
            {securityEvents.length === 0 ? (
              <p className="text-gray-500">Nenhum evento de segurança</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {securityEvents.map((event, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900">{event.event_type}</div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        event.severity === 'high' ? 'bg-red-100 text-red-800' :
                        event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.severity}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">IP: {event.ip_address}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estado do Sistema */}
        {securityStats && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado do Sistema</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${
                  securityStats.system_health === 'healthy' ? 'text-green-600' :
                  securityStats.system_health === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {securityStats.system_health}
                </div>
                <div className="text-sm text-gray-600">Estado Geral</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {securityStats.security_events}
                </div>
                <div className="text-sm text-blue-700">Eventos de Segurança (24h)</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  Activo
                </div>
                <div className="text-sm text-green-700">Sistema de Protecção</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}