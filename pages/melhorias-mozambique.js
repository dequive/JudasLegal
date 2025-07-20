import { useState } from 'react';
import Link from 'next/link';
import { FeedbackStats } from '../components/FeedbackSystem';
import { useLegalHistory, useUserPreferences } from '../hooks/useLocalStorage';

export default function MelhoriasMozambique() {
  const { history, getFavorites, clearHistory } = useLegalHistory();
  const { preferences, updatePreference, resetPreferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '🇲🇿' },
    { id: 'theme', label: 'Tema Moçambicano', icon: '🎨' },
    { id: 'feedback', label: 'Sistema de Feedback', icon: '📊' },
    { id: 'export', label: 'Exportação', icon: '📄' },
    { id: 'history', label: 'Histórico', icon: '📚' },
    { id: 'preferences', label: 'Preferências', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pattern-mozambique">
      {/* Header */}
      <div className="card-mozambique border-b border-moz-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-mozambique">Melhorias Implementadas</h1>
              <p className="text-gray-300 mt-2">Sistema Muzaia optimizado para o contexto moçambicano</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="w-3 h-3 bg-moz-green rounded-full"></span>
                <span className="w-3 h-3 bg-moz-red rounded-full"></span>
                <span className="w-3 h-3 bg-moz-yellow rounded-full"></span>
                <span className="text-xs text-gray-400">República de Moçambique</span>
              </div>
            </div>
            <Link href="/chat">
              <button className="bg-mozambique-primary hover:scale-105 transform transition-all duration-200 text-white font-medium py-3 px-6 rounded-lg shadow-elegant">
                💬 Testar Chat
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-moz-green text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card-modern">
                <h3 className="text-xl font-bold text-white mb-3">🎨 Tema Cultural</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Design inspirado na bandeira e cultura moçambicana com cores oficiais e padrões culturais.
                </p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-moz-green rounded"></div>
                  <div className="w-8 h-8 bg-moz-red rounded"></div>
                  <div className="w-8 h-8 bg-moz-yellow rounded"></div>
                </div>
              </div>

              <div className="card-modern">
                <h3 className="text-xl font-bold text-white mb-3">📊 Sistema de Feedback</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Avaliação de respostas com estrelas e comentários para melhorar continuamente a qualidade.
                </p>
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <span key={i}>⭐</span>)}
                </div>
              </div>

              <div className="card-modern">
                <h3 className="text-xl font-bold text-white mb-3">📄 Exportação Profissional</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Salvar consultas em PDF ou texto, partilhar resultados com formatação legal adequada.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs bg-moz-red text-white px-2 py-1 rounded">PDF</span>
                  <span className="text-xs bg-moz-green text-white px-2 py-1 rounded">TXT</span>
                  <span className="text-xs bg-moz-yellow text-gray-900 px-2 py-1 rounded">Partilhar</span>
                </div>
              </div>

              <div className="card-modern">
                <h3 className="text-xl font-bold text-white mb-3">📚 Histórico Persistente</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Armazenamento local de consultas, sistema de favoritos e acesso offline.
                </p>
                <div className="text-gray-400 text-xs">
                  {history.length} consultas • {getFavorites().length} favoritos
                </div>
              </div>

              <div className="card-modern">
                <h3 className="text-xl font-bold text-white mb-3">♿ Acessibilidade</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Suporte para high contrast, reduced motion e navegação por teclado.
                </p>
                <div className="text-xs text-gray-400">
                  WCAG 2.1 AA • Contraste optimizado
                </div>
              </div>

              <div className="card-modern">
                <h3 className="text-xl font-bold text-white mb-3">🖨️ Impressão Legal</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Estilos de impressão especiais para documentos legais com disclaimers automáticos.
                </p>
                <div className="text-xs text-gray-400">
                  CSS @media print • Formatação jurídica
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="card-modern">
                <h3 className="text-xl font-bold text-white mb-4">Cores da Bandeira Moçambicana</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-moz-green rounded-lg p-4 text-white">
                    <div className="font-bold">Verde (#00A859)</div>
                    <div className="text-sm opacity-90">Riqueza natural e agricultura</div>
                  </div>
                  <div className="bg-moz-red rounded-lg p-4 text-white">
                    <div className="font-bold">Vermelho (#CE1126)</div>
                    <div className="text-sm opacity-90">Luta pela independência</div>
                  </div>
                  <div className="bg-moz-yellow rounded-lg p-4 text-gray-900">
                    <div className="font-bold">Amarelo (#FCD116)</div>
                    <div className="text-sm opacity-90">Recursos minerais</div>
                  </div>
                </div>
              </div>

              <div className="card-modern">
                <h3 className="text-xl font-bold text-white mb-4">Padrões Culturais</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-moz-green/20 via-moz-red/20 to-moz-yellow/20 p-4 rounded-lg">
                    <div className="text-white font-medium">Gradientes Moçambicanos</div>
                    <div className="text-gray-300 text-sm">Inspirados na bandeira nacional</div>
                  </div>
                  <div className="pattern-mozambique p-4 rounded-lg border border-moz-green/30">
                    <div className="text-white font-medium">Padrões Geométricos</div>
                    <div className="text-gray-300 text-sm">Baseados em arte tradicional</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <FeedbackStats />
              
              <div className="card-modern">
                <h3 className="text-xl font-bold text-white mb-4">Como Funciona o Feedback</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start gap-3">
                    <span className="text-moz-yellow text-xl">⭐</span>
                    <div>
                      <div className="font-medium">Avaliação por Estrelas</div>
                      <div className="text-sm text-gray-400">De 1 a 5 estrelas para cada resposta</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-moz-green text-xl">💬</span>
                    <div>
                      <div className="font-medium">Comentários Detalhados</div>
                      <div className="text-sm text-gray-400">Sugestões específicas para melhorias</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-moz-red text-xl">📊</span>
                    <div>
                      <div className="font-medium">Analytics Locais</div>
                      <div className="text-sm text-gray-400">Estatísticas armazenadas no dispositivo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="card-modern">
              <h3 className="text-xl font-bold text-white mb-4">Funcionalidades de Exportação</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-moz-red/20 border border-moz-red/30 rounded-lg p-4">
                  <div className="text-moz-red text-2xl mb-2">📄</div>
                  <div className="font-bold text-white">PDF Formatado</div>
                  <div className="text-sm text-gray-300 mt-2">
                    • Cabeçalho com branding Muzaia<br/>
                    • Formatação legal profissional<br/>
                    • Disclaimers automáticos<br/>
                    • Pronto para impressão
                  </div>
                </div>
                <div className="bg-moz-green/20 border border-moz-green/30 rounded-lg p-4">
                  <div className="text-moz-green text-2xl mb-2">📝</div>
                  <div className="font-bold text-white">Texto Simples</div>
                  <div className="text-sm text-gray-300 mt-2">
                    • Formato universal<br/>
                    • Fácil de copiar/colar<br/>
                    • Compatível com qualquer editor<br/>
                    • Versão resumida disponível
                  </div>
                </div>
                <div className="bg-moz-yellow/20 border border-moz-yellow/30 rounded-lg p-4">
                  <div className="text-moz-yellow text-2xl mb-2">📤</div>
                  <div className="font-bold text-white">Partilha Nativa</div>
                  <div className="text-sm text-gray-300 mt-2">
                    • API de partilha do browser<br/>
                    • WhatsApp, email, etc.<br/>
                    • Fallback para clipboard<br/>
                    • URL da consulta incluído
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="card-modern">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Histórico de Consultas</h3>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Limpar Histórico
                    </button>
                  )}
                </div>
                
                {history.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">📚</div>
                    <div>Nenhuma consulta no histórico ainda</div>
                    <Link href="/chat">
                      <button className="mt-4 bg-moz-green hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                        Fazer Primeira Consulta
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.slice(0, 10).map((entry) => (
                      <div key={entry.id} className="bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-white text-sm">{entry.query}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(entry.timestamp).toLocaleString('pt-PT')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {entry.favorite && <span className="text-yellow-400">⭐</span>}
                            <span className="text-xs text-gray-400">
                              {entry.citations?.length || 0} fontes
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="card-modern">
                <h3 className="text-xl font-bold text-white mb-4">Preferências do Utilizador</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Tema</div>
                      <div className="text-sm text-gray-400">Aparência da interface</div>
                    </div>
                    <select
                      value={preferences.theme}
                      onChange={(e) => updatePreference('theme', e.target.value)}
                      className="bg-gray-700 text-white rounded px-3 py-1"
                    >
                      <option value="dark">Escuro</option>
                      <option value="light">Claro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Alto Contraste</div>
                      <div className="text-sm text-gray-400">Para melhor visibilidade</div>
                    </div>
                    <button
                      onClick={() => updatePreference('highContrast', !preferences.highContrast)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.highContrast ? 'bg-moz-green' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.highContrast ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Movimento Reduzido</div>
                      <div className="text-sm text-gray-400">Menos animações</div>
                    </div>
                    <button
                      onClick={() => updatePreference('reducedMotion', !preferences.reducedMotion)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.reducedMotion ? 'bg-moz-green' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.reducedMotion ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Auto-Save</div>
                      <div className="text-sm text-gray-400">Salvar automaticamente</div>
                    </div>
                    <button
                      onClick={() => updatePreference('autoSave', !preferences.autoSave)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.autoSave ? 'bg-moz-green' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.autoSave ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <button
                    onClick={resetPreferences}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Repor Predefinições
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}