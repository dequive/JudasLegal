import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Judas - Assistente Jurídico Moçambicano</title>
        <meta name="description" content="Assistente jurídico inteligente para consultas sobre legislação moçambicana" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Padrão de fundo animado */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-50">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="relative z-10">
          {/* Header */}
          <nav className="backdrop-blur-md bg-white/10 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">J</span>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Judas Legal Assistant
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="relative px-4 py-24 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Assistente Jurídico
                  <br />
                  <span className="text-white">Inteligente</span>
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Consulte a legislação moçambicana de forma inteligente com IA avançada. 
                Obtenha respostas precisas e citações jurídicas em segundos.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl font-semibold text-white shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    🚀 Começar Consulta
                  </span>
                </button>
                <button className="px-8 py-4 border-2 border-white/30 rounded-xl font-semibold text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                  📖 Ver Demonstração
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-xl font-bold text-white mb-3">IA Avançada</h3>
                  <p className="text-gray-300">Powered by Google Gemini 2.0 Flash para respostas precisas sobre direito moçambicano</p>
                </div>

                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-xl font-bold text-white mb-3">Base Legal Completa</h3>
                  <p className="text-gray-300">Consulte leis, códigos e regulamentos atualizados com citações precisas</p>
                </div>

                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-xl font-bold text-white mb-3">Tooltips Educativos</h3>
                  <p className="text-gray-300">Aprenda terminologia jurídica com explicações contextuais inteligentes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Sistema Jurídico Online</span>
                  </div>
                  <div className="text-gray-300 text-sm">
                    Moçambique • Atualizado • Gratuito
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}