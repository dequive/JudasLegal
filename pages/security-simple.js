import { useState } from 'react';
import { Shield, Users, AlertTriangle, Lock, Activity, CheckCircle } from 'lucide-react';

export default function SecuritySimple() {
  const [showDemo, setShowDemo] = useState(false);

  // Dados de demonstração das funcionalidades de segurança implementadas
  const securityFeatures = [
    {
      title: "Autenticação JWT",
      description: "Sistema de tokens seguros com 8 horas de duração",
      status: "Implementado",
      icon: <Lock className="w-6 h-6" />,
      color: "bg-green-500",
      details: ["Tokens JWT com algoritmo HS256", "Hash de passwords com bcrypt", "Utilizadores demo: admin/admin123"]
    },
    {
      title: "Middleware de Segurança",
      description: "Protecção contra ameaças comuns",
      status: "Activo",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-blue-500",
      details: ["Detecção SQL injection, XSS", "Headers de segurança automáticos", "Rate limiting integrado"]
    },
    {
      title: "Monitorização do Sistema",
      description: "Métricas em tempo real",
      status: "Operacional",
      icon: <Activity className="w-6 h-6" />,
      color: "bg-purple-500",
      details: ["CPU, memória, disco, rede", "Alertas automáticos", "Retenção de histórico configurável"]
    },
    {
      title: "Logging Estruturado",
      description: "Logs JSON para observabilidade",
      status: "Funcional",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "bg-orange-500",
      details: ["Formato JSON estruturado", "Correlação de requests", "Logs categorizados por módulo"]
    }
  ];

  const systemStats = {
    total_requests: 1247,
    blocked_requests: 12,
    failed_login_attempts: 3,
    active_sessions: 8,
    system_health: "healthy",
    security_events: 15
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-400" />
                <h1 className="text-2xl font-bold text-white">Painel de Segurança Muzaia</h1>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-500 rounded hover:border-gray-300 transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Estado do Sistema */}
          <div className="mb-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Estado do Sistema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">Saudável</div>
                <div className="text-sm text-green-300">Estado Geral</div>
              </div>
              <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">{systemStats.security_events}</div>
                <div className="text-sm text-blue-300">Eventos (24h)</div>
              </div>
              <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">Activo</div>
                <div className="text-sm text-purple-300">Sistema de Protecção</div>
              </div>
            </div>
          </div>

          {/* Estatísticas de Segurança */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-6 h-6 text-blue-400" />
                <h3 className="font-medium text-white">Requests Totais</h3>
              </div>
              <div className="text-2xl font-bold text-white">{systemStats.total_requests}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="font-medium text-white">Requests Bloqueados</h3>
              </div>
              <div className="text-2xl font-bold text-red-400">{systemStats.blocked_requests}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-6 h-6 text-orange-400" />
                <h3 className="font-medium text-white">Tentativas Falhadas</h3>
              </div>
              <div className="text-2xl font-bold text-orange-400">{systemStats.failed_login_attempts}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-green-400" />
                <h3 className="font-medium text-white">Sessões Activas</h3>
              </div>
              <div className="text-2xl font-bold text-green-400">{systemStats.active_sessions}</div>
            </div>
          </div>

          {/* Funcionalidades de Segurança */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Funcionalidades de Segurança Implementadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                          {feature.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{feature.description}</p>
                      <ul className="space-y-1">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demonstração Interactiva */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Demonstração do Sistema</h2>
            
            {!showDemo ? (
              <div className="text-center py-8">
                <p className="text-gray-300 mb-6">
                  As medidas de prioridade média foram implementadas com sucesso!<br />
                  Sistema robusto de segurança e monitorização operacional.
                </p>
                <button
                  onClick={() => setShowDemo(true)}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                >
                  Ver Demonstração
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2">✓ Sistema de Autenticação</h3>
                  <p className="text-green-300 text-sm">
                    JWT com tokens seguros, hash bcrypt, utilizadores demo configurados
                  </p>
                </div>
                
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-blue-400 font-semibold mb-2">✓ Middleware de Segurança</h3>
                  <p className="text-blue-300 text-sm">
                    Protecção contra SQL injection, XSS, rate limiting automático
                  </p>
                </div>
                
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="text-purple-400 font-semibold mb-2">✓ Monitorização Completa</h3>
                  <p className="text-purple-300 text-sm">
                    Métricas de sistema, health checks, alertas configuráveis
                  </p>
                </div>
                
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                  <h3 className="text-orange-400 font-semibold mb-2">✓ Logging Estruturado</h3>
                  <p className="text-orange-300 text-sm">
                    JSON logs, correlação de requests, auditoria completa
                  </p>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-gray-300 font-semibold">
                    🎉 Todas as funcionalidades de prioridade média implementadas!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}