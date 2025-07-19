import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ChatInterface from '@/components/Chat/ChatInterface';
import { Scale, User, BookOpen, MessageSquare, Brain, Zap, TrendingUp, Clock } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYWZhZmEiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative group">
                <Scale className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Judas
                </span>
                <p className="text-xs text-gray-500">Assistente Jurídico</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 rounded-lg">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Chat Ativo</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">IA Gemini</span>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName || user.email?.split('@')[0] || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email || 'usuario@exemplo.com'}
                    </p>
                  </div>
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-emerald-200 hover:border-emerald-300 transition-colors"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-semibold border-2 border-emerald-200">
                      {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              )}
              <a
                href="/api/logout"
                className="group flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <span className="text-lg">🚪</span>
                <span className="hidden sm:inline text-sm font-medium">Sair</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="relative z-10 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Bem-vindo{user?.firstName ? `, ${user.firstName}` : ''}! 👋
              </h1>
              <p className="text-emerald-100 text-lg">
                Pronto para consultar a legislação moçambicana com IA?
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">Gemini AI Ativo</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-emerald-300" />
                <span className="text-sm font-medium">9 Leis Carregadas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Usage Stats */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-emerald-600 mr-2" />
                Estatísticas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Consultas hoje</span>
                  <span className="text-lg font-bold text-emerald-600">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Leis consultadas</span>
                  <span className="text-lg font-bold text-blue-600">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tempo médio</span>
                  <span className="text-lg font-bold text-purple-600">2.3s</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-blue-600 mr-2" />
                Ações Rápidas
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200">
                  <div className="font-medium text-emerald-800">Código Civil</div>
                  <div className="text-sm text-emerald-600">Consultar artigos</div>
                </button>
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                  <div className="font-medium text-blue-800">Lei do Trabalho</div>
                  <div className="text-sm text-blue-600">Direitos laborais</div>
                </button>
                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
                  <div className="font-medium text-purple-800">Constituição</div>
                  <div className="text-sm text-purple-600">Direitos fundamentais</div>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                💡 Dica do Dia
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Use termos específicos como "artigo", "decreto" ou "lei" para obter respostas mais precisas sobre a legislação moçambicana.
              </p>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                    <h2 className="text-xl font-semibold text-white">Chat Jurídico</h2>
                    <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                      Gemini AI
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Disponível 24/7</span>
                  </div>
                </div>
              </div>

              {/* Chat Content */}
              <div className="h-[600px] flex flex-col">
                <ChatInterface />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Scale className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Judas Legal Assistant
              </span>
              <span className="text-xs text-gray-500">v1.0</span>
            </div>
            <div className="text-xs text-gray-500">
              Assistente jurídico alimentado por IA • Legislação moçambicana atualizada
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;