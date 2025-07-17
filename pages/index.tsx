import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ChatInterface from '../components/Chat/ChatInterface';
import { useChatStore } from '../store/chatStore';

export default function Home() {
  const [isOnline, setIsOnline] = useState(true);
  const { initializeSession } = useChatStore();

  useEffect(() => {
    // Initialize chat session
    initializeSession();

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [initializeSession]);

  return (
    <>
      <Head>
        <title>Judas - Assistente Jurídico Moçambicano</title>
        <meta name="description" content="Assistente jurídico inteligente para consultas sobre legislação moçambicana" />
        <meta name="keywords" content="direito, moçambique, lei, assistente jurídico, consulta legal" />
        <meta property="og:title" content="Judas - Assistente Jurídico Moçambicano" />
        <meta property="og:description" content="Consulte a legislação moçambicana de forma inteligente" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header isOnline={isOnline} />
        
        <main className="flex-1 flex flex-col">
          {/* Offline indicator */}
          {!isOnline && (
            <div className="bg-accent-500 text-white text-center py-2 px-4">
              <span className="text-sm font-medium">
                📱 Modo offline ativo - Consulte leis essenciais
              </span>
            </div>
          )}

          {/* Welcome section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Assistente Jurídico Judas
              </h1>
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                Consultas inteligentes sobre legislação moçambicana
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  🇲🇿 Direito Moçambicano
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  💬 Respostas em Português
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📚 Fontes Verificadas
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📱 Funciona Offline
                </span>
              </div>
            </div>
          </div>

          {/* Chat interface */}
          <div className="flex-1 flex">
            <ChatInterface />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
