import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Upload, Brain, BarChart3, BookOpen, Shield, Zap, Globe, Settings } from 'lucide-react';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    documents: 11,
    chunks: 47,
    status: 'Online'
  });

  useEffect(() => {
    setIsLoaded(true);
    
    // Fetch real stats from backend
    fetch('http://localhost:8000/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'healthy') {
          setStats(prev => ({ ...prev, status: 'Online' }));
        }
      })
      .catch(() => {
        setStats(prev => ({ ...prev, status: 'Offline' }));
      });
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "IA Jurídica Avançada",
      description: "Powered by Google Gemini 2.0 Flash para respostas inteligentes sobre legislação moçambicana",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Base Legal Completa",
      description: "Acesso a leis, códigos e regulamentos actualizados de Moçambique",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload de Documentos",
      description: "Sistema administrativo para adicionar novas leis e regulamentos",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Análise de Complexidade",
      description: "Classificação automática da dificuldade de questões jurídicas",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const quickActions = [
    {
      title: "Iniciar Chat Jurídico",
      description: "Converse com o assistente IA",
      href: "/chat",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Painel Administrativo",
      description: "Gerir documentos legais",
      href: "/admin",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      title: "Melhorias Moçambicanas",
      description: "Funcionalidades culturais implementadas",
      href: "/melhorias-mozambique",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-gradient-to-r from-moz-green to-moz-red hover:scale-105"
    },
    {
      title: "Analisar Complexidade",
      description: "Teste o sistema de análise",
      href: "/complexity-demo",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Glossário Jurídico",
      description: "Termos legais explicados",
      href: "/glossario",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "LLM Orchestra",
      description: "Sistema multi-IA com Claude 3 + Gemini",
      href: "/orchestra-demo",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      title: "Melhorias Sistema",
      description: "Infraestrutura e optimizações",
      href: "/system-improvements",
      icon: <Settings className="w-6 h-6" />,
      color: "bg-slate-600 hover:bg-slate-700"
    },
    {
      title: "Painel de Segurança",
      description: "Monitorização e administração",
      href: "/security-simple",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-red-600 hover:bg-red-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="glass-dark border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Muzaia</h1>
                  <p className="text-sm text-gray-300">Assistente Jurídico Inteligente</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${stats.status === 'Online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-sm text-gray-300">{stats.status}</span>
                </div>
                <Link href="/chat">
                  <button className="btn-primary">
                    Iniciar Chat
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                  Muzaia
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Assistente jurídico online baseado em inteligência artificial, 
                especialista em <span className="text-blue-400 font-semibold">legislação moçambicana</span>
              </p>
              
              {/* Stats */}
              <div className="flex justify-center space-x-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{stats.documents}</div>
                  <div className="text-sm text-gray-400">Documentos Legais</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{stats.chunks}</div>
                  <div className="text-sm text-gray-400">Chunks RAG</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">AI</div>
                  <div className="text-sm text-gray-400">Gemini 2.0 Flash</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className={`card-glass hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <h3 className="text-white font-semibold mb-2">{action.title}</h3>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Funcionalidades Avançadas
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Tecnologia de ponta para democratizar o acesso à informação jurídica em Moçambique
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`card-glass hover:scale-105 transition-all duration-300 ${isLoaded ? 'animate-fade-in' : ''}`}
                  style={{animationDelay: `${index * 200}ms`}}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card-glass">
              <div className="flex items-center justify-center mb-6">
                <Zap className="w-12 h-12 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Experimente o assistente jurídico mais avançado de Moçambique
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chat">
                  <button className="btn-primary text-lg px-8 py-3">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Iniciar Conversa
                  </button>
                </Link>
                <Link href="/admin">
                  <button className="btn-secondary text-lg px-8 py-3">
                    <Shield className="w-5 h-5 mr-2" />
                    Área Administrativa
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">Powered by Google Gemini AI, Supabase & Vercel</span>
            </div>
            <p className="text-gray-400">
              © 2025 Muzaia. Assistente jurídico inteligente para Moçambique.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}