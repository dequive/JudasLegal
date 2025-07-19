import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';
import Landing from '@/components/auth/Landing';
import Home from '@/components/auth/Home';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

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

      {isAuthenticated ? <Home /> : <Landing />}
    </>
  );
}