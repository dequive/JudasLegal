import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando Muzaia...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Muzaia - Assistente Jurídico Online</title>
        <meta name="description" content="Assistente jurídico online baseado em inteligência artificial, especialista em leis moçambicanas" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-md bg-white/5 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">⚖️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-blue-400 bg-clip-text text-transparent">
                    Muzaia
                  </h1>
                  <p className="text-blue-200 text-sm">Assistente Jurídico com Inteligência Artificial</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link href="/admin">
                  <button className="px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
                    Painel Admin
                  </button>
                </Link>
                <Link href="/auth">
                  <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                    Entrar
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30 mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
              <span className="text-emerald-300 text-sm font-medium">Sistema RAG com IA Gemini 2.0 Flash</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-emerald-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Muzaia
              </span>
              <br />
              <span className="text-white">Assistente Jurídico Online</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              Assistente jurídico online baseado em inteligência artificial, especialista em leis moçambicanas. 
              Responde às vossas questões legais com citações precisas e análise de complexidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl backdrop-blur-sm">
                  🤖 Iniciar Chat Jurídico
                </button>
              </Link>
              <Link href="/complexity-demo">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20">
                  📊 Analisar Complexidade
                </button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">RAG Inteligente</h3>
              <p className="text-blue-200">
                Sistema de recuperação de informação que busca documentos legais relevantes e gera respostas precisas com citações automáticas.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Upload de Leis</h3>
              <p className="text-blue-200">
                Interface administrativa para carregar novos documentos legais em PDF, DOCX ou TXT com processamento automático.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Análise de Complexidade</h3>
              <p className="text-blue-200">
                Classificação automática da complexidade jurídica das consultas em 4 níveis: Simples, Moderado, Complexo e Muito Complexo.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-semibold text-white text-center mb-8">Estado do Sistema</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">10</div>
                <div className="text-blue-200 text-sm">Documentos Legais</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">6</div>
                <div className="text-blue-200 text-sm">Chunks RAG</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">✅</div>
                <div className="text-blue-200 text-sm">IA Gemini Activa</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">🚀</div>
                <div className="text-blue-200 text-sm">Sistema Online</div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="backdrop-blur-md bg-white/5 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-blue-200">
                © 2025 Muzaia - Assistente Jurídico Online para Legislação Moçambicana
              </p>
              <p className="text-blue-300 text-sm mt-2">
                Powered by Google Gemini 2.0 Flash • RAG Technology • PostgreSQL
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
}