import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Brain, ArrowLeft, Settings, Activity, Zap, CheckCircle, XCircle } from 'lucide-react';
import LLMOrchestraStatus from '../components/LLMOrchestraStatus';

export default function OrchestraDemo() {
  const [activeTab, setActiveTab] = useState('status');
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const predefinedQuestions = [
    "Como funciona o direito constitucional moçambicano?",
    "Quais são os princípios fundamentais do direito do trabalho em Moçambique?",
    "Explique o processo de registo de empresas em Moçambique",
    "Quais são os direitos fundamentais na Constituição moçambicana?",
    "Como se processa um divórcio em Moçambique?"
  ];

  const testOrchestra = async (message) => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/orchestra/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      console.error('Erro no teste:', error);
      setTestResult({ 
        test_successful: false, 
        error: error.message 
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmitTest = (e) => {
    e.preventDefault();
    if (testMessage.trim()) {
      testOrchestra(testMessage.trim());
    }
  };

  return (
    <>
      <Head>
        <title>Demonstração LLM Orchestra - Muzaia</title>
        <meta name="description" content="Sistema de orquestração de múltiplos LLMs" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <header className="relative bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center text-white hover:text-blue-300 transition-colors">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar
                </Link>
                <div className="ml-6 flex items-center">
                  <Brain className="w-8 h-8 text-blue-400" />
                  <span className="ml-3 text-xl font-bold text-white">
                    LLM Orchestra Demo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg mb-8">
            <nav className="flex space-x-1 p-1">
              {[
                { id: 'status', label: 'Status do Sistema', icon: Activity },
                { id: 'test', label: 'Teste Interactivo', icon: Zap },
                { id: 'config', label: 'Configuração', icon: Settings }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'status' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Estado do Orquestrador LLM
              </h2>
              <LLMOrchestraStatus />
            </div>
          )}

          {activeTab === 'test' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Teste Interactivo do Orquestrador
              </h2>
              
              {/* Test Form */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Testar com Pergunta Personalizada
                </h3>
                <form onSubmit={handleSubmitTest} className="space-y-4">
                  <div>
                    <textarea
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      placeholder="Digite vossa pergunta jurídica..."
                      className="w-full p-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={testing || !testMessage.trim()}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      testing || !testMessage.trim()
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {testing ? 'Testando...' : 'Executar Teste'}
                  </button>
                </form>
              </div>

              {/* Predefined Questions */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Perguntas Pré-definidas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {predefinedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => testOrchestra(question)}
                      disabled={testing}
                      className={`p-3 text-left rounded-lg border border-white/20 transition-all ${
                        testing
                          ? 'bg-gray-500/20 text-gray-300 cursor-not-allowed'
                          : 'bg-white/10 text-white hover:bg-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">Pergunta {index + 1}</div>
                      <div className="text-xs text-white/70">{question}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Results */}
              {testResult && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    {testResult.test_successful ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <h3 className={`ml-3 text-lg font-semibold ${
                      testResult.test_successful ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testResult.test_successful ? 'Teste Bem-Sucedido!' : 'Teste Falhado'}
                    </h3>
                  </div>

                  {testResult.test_successful ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded p-3">
                          <div className="text-sm text-blue-600 font-medium">Provedor Usado</div>
                          <div className="text-lg font-bold text-blue-900">
                            {testResult.provider_used?.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded p-3">
                          <div className="text-sm text-green-600 font-medium">Tempo de Resposta</div>
                          <div className="text-lg font-bold text-green-900">
                            {testResult.response_time?.toFixed(2)}s
                          </div>
                        </div>
                        <div className="bg-purple-50 rounded p-3">
                          <div className="text-sm text-purple-600 font-medium">Sucesso</div>
                          <div className="text-lg font-bold text-purple-900">
                            {testResult.test_successful ? 'Sim' : 'Não'}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Resposta Gerada:</h4>
                        <div className="bg-white rounded p-3 text-gray-700 italic border-l-4 border-blue-500">
                          {testResult.response_preview}
                        </div>
                      </div>

                      {testResult.metrics && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Métricas do Sistema:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Total de Pedidos:</span>
                              <div className="font-bold">{testResult.metrics.total_requests}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Taxa de Sucesso:</span>
                              <div className="font-bold">{testResult.metrics.success_rate}%</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Tempo Médio:</span>
                              <div className="font-bold">{testResult.metrics.avg_response_time}s</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Fallbacks:</span>
                              <div className="font-bold">{testResult.metrics.fallback_activations}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-red-700">
                        <span className="font-medium">Erro:</span> {testResult.error}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Configuração do Orquestrador
              </h2>
              
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Configuração de Provedores LLM
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Claude 3 (Anthropic)</h4>
                    <p className="text-white/70 text-sm mb-3">
                      Para activar o Claude 3, é necessário configurar a chave API da Anthropic
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-yellow-800 text-sm">
                        <strong>Configuração necessária:</strong> Configure a variável de ambiente 
                        <code className="bg-yellow-100 px-1 rounded mx-1">ANTHROPIC_API_KEY</code>
                        com vossa chave da Anthropic
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Gemini 2.0 Flash (Google)</h4>
                    <p className="text-white/70 text-sm mb-3">
                      Actualmente configurado e funcionando
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-green-800 text-sm">
                        <strong>Status:</strong> ✅ Configurado e operacional
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Ordem de Fallback</h4>
                    <p className="text-white/70 text-sm mb-3">
                      Ordem actual de tentativa dos provedores:
                    </p>
                    <ol className="list-decimal list-inside text-white text-sm space-y-1">
                      <li>Claude 3 Sonnet (se disponível)</li>
                      <li>Gemini 2.0 Flash</li>
                      <li>Claude 3 Haiku (fallback final)</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}