import React from 'react';
import { Scale, BookOpen, Shield, Users, ArrowRight, Sparkles, Zap, Globe, Star, CheckCircle } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="relative group">
                <Scale className="h-10 w-10 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Judas
                </span>
                <p className="text-xs text-gray-300">Assistente Jurídico IA</p>
              </div>
            </div>
            <div>
              <a
                href="/api/login"
                className="group relative inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white font-semibold rounded-full hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
              >
                <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                Entrar
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-8">
            <Star className="h-4 w-4 text-yellow-400 mr-2" />
            Powered by Google Gemini AI
            <Zap className="h-4 w-4 text-yellow-400 ml-2" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Assistente Jurídico
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Inteligente
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Obtenha respostas precisas sobre legislação moçambicana com{' '}
            <span className="text-emerald-400 font-semibold">citações de fontes oficiais</span>.
            <br />
            Seu assistente inteligente para consultas jurídicas complexas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href="/api/login"
              className="group relative inline-flex items-center px-12 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold text-lg rounded-full hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
            >
              <Sparkles className="h-5 w-5 mr-3 group-hover:animate-spin" />
              Começar Agora
              <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform" />
            </a>
            <button className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
              <Globe className="h-5 w-5 mr-2" />
              Ver Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
              Legislação Atualizada
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
              Citações Oficiais
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
              Linguagem Acessível
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Recursos Avançados
            </h2>
            <p className="text-xl text-gray-400">
              Tecnologia de ponta para assistência jurídica inteligente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Legislação Completa
              </h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Base de dados abrangente com leis, decretos e regulamentos atualizados de Moçambique.
                Cobertura completa do sistema jurídico nacional.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                IA Especializada
              </h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Inteligência artificial treinada especificamente para direito moçambicano.
                Respostas precisas com citações de fontes oficiais.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Interface Intuitiva
              </h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Linguagem clara e acessível para todos os usuários.
                Interface moderna com tooltips educativos para termos jurídicos.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já usam o Judas para consultas jurídicas inteligentes.
            </p>
            <a
              href="/api/login"
              className="group inline-flex items-center px-12 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold text-lg rounded-full hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
            >
              <Sparkles className="h-5 w-5 mr-3 group-hover:animate-pulse" />
              Acessar Agora
              <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Scale className="h-6 w-6 text-emerald-400 mr-2" />
              <span className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Judas Legal Assistant
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Judas. Assistente jurídico inteligente para Moçambique.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;