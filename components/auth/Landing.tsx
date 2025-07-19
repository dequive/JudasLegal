import React from 'react';
import { Scale, BookOpen, Shield, Users } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50">
      {/* Header */}
      <header className="bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Judas</span>
              <span className="ml-1 text-sm text-gray-500">Legal Assistant</span>
            </div>
            <a
              href="/api/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Entrar
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Assistente Jurídico
            <span className="block text-blue-600">para Moçambique</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Obtenha respostas precisas sobre legislação moçambicana com citações de fontes oficiais. 
            Seu assistente inteligente para consultas jurídicas.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <a
              href="/api/login"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
            >
              Começar agora
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Legislação Moçambicana</h3>
              <p className="mt-2 text-base text-gray-500">
                Base de dados abrangente com leis e regulamentos atualizados de Moçambique.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Respostas Precisas</h3>
              <p className="mt-2 text-base text-gray-500">
                IA treinada especificamente para direito moçambicano com citações de fontes oficiais.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Linguagem Acessível</h3>
              <p className="mt-2 text-base text-gray-500">
                Explicações claras em português com tooltips para termos jurídicos complexos.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Como funciona</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Faça sua pergunta</h3>
              <p className="text-gray-500">
                Digite sua consulta jurídica em português, de forma natural.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Análise inteligente</h3>
              <p className="text-gray-500">
                Nosso sistema analisa documentos legais relevantes para sua consulta.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Resposta completa</h3>
              <p className="text-gray-500">
                Receba uma resposta detalhada com citações das fontes legais.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>© 2025 Judas Legal Assistant. Assistente jurídico para Moçambique.</p>
            <p className="mt-2 text-sm">
              Este sistema fornece informações legais gerais. Para consultas específicas, 
              consulte sempre um advogado qualificado.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;