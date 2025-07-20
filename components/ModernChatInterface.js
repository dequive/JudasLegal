import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MoreHorizontal, Lightbulb, FileText, Scale, Map } from 'lucide-react';
import FeedbackSystem from './FeedbackSystem';
import ExportSystem from './ExportSystem';
import { useLegalHistory, useUserPreferences } from '../hooks/useLocalStorage';
import LegalDisclaimer, { AIResponseDisclaimer, useLegalDisclaimer } from './LegalDisclaimer';
import OptimizedButton from './OptimizedButton';
import OptimizedCard from './OptimizedCard';
import { LoadingSpinner, ChatMessageLoading } from './LoadingStates';

export default function ModernChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Novos hooks para funcionalidades avançadas
  const { addToHistory, history, getFavorites } = useLegalHistory();
  const { preferences } = useUserPreferences();
  const { shouldShowModal, markAsShown } = useLegalDisclaimer();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions = [
    { icon: <Lightbulb className="w-4 h-4" />, text: "Explicar direito laboral", subtitle: "Direitos e deveres do trabalhador" },
    { icon: <FileText className="w-4 h-4" />, text: "Resumir texto legal", subtitle: "Analisar documentos jurídicos" },
    { icon: <Scale className="w-4 h-4" />, text: "Ajuda legal", subtitle: "Questões sobre legislação moçambicana" },
    { icon: <Map className="w-4 h-4" />, text: "Fazer um plano", subtitle: "Estratégias para questões jurídicas" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simular resposta da IA por agora
      // Chamar API real do backend
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          session_id: 'web-session-' + Date.now()
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          citations: data.citations || []
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback para modo offline
        const assistantMessage = {
          role: 'assistant',
          content: `Compreendo a vossa questão sobre "${inputValue}". Como assistente jurídico especializado em legislação moçambicana, posso fornecer informações detalhadas sobre este tópico. 

Para vos ajudar melhor, preciso de alguns detalhes adicionais:
- Em que contexto específico surge esta questão?
- Há algum documento ou situação particular que gostariam de analisar?

**Informação Legal Relevante:**
- Artigo X da Constituição da República de Moçambique
- Lei nº Y/2023 sobre o tema em questão

*Esta informação é apenas educativa e não constitui aconselhamento jurídico formal.*`,
          citations: [
            { text: "Constituição da República de Moçambique", relevance: 95 },
            { text: "Código Civil Moçambicano", relevance: 87 }
          ]
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Adicionar ao histórico local para persistência
        addToHistory(userMessage.content, data.response, data.citations);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Erro no chat:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header com tema moçambicano */}
      <div className="glass-dark border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-mozambique rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gradient-legal">Muzaia</h1>
              <p className="text-sm text-gray-300">Assistente Jurídico</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sistema de Exportação */}
            {messages.length > 0 && (
              <ExportSystem 
                messages={messages} 
                sessionTitle={`Consulta Legal - ${new Date().toLocaleDateString('pt-PT')}`}
              />
            )}
            
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Contador de mensagens e estatísticas */}
        {messages.length > 0 && (
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>💬 {messages.length} mensagens</span>
            <span>📚 {history.length} no histórico</span>
            <span>⭐ {getFavorites().length} favoritos</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                Muzaia
              </h2>
              <p className="text-gray-400 text-lg max-w-md">
                Assistente jurídico especializado em legislação moçambicana
              </p>
            </div>
            
            {/* Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="flex items-start space-x-3 p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-all hover:scale-105 text-left"
                >
                  <div className="text-gray-400 mt-1">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{suggestion.text}</div>
                    <div className="text-sm text-gray-400 mt-1">{suggestion.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-800'} rounded-2xl px-6 py-4`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Scale className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-300">Muzaia</span>
                    </div>
                  )}
                  
                  <div className="prose prose-invert max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">{line}</p>
                    ))}
                  </div>

                  {message.citations && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Fontes Legais:</h4>
                      {message.citations.map((citation, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                          <span className="text-sm text-gray-300">{citation.text}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-600 rounded-full h-1">
                              <div 
                                className="h-1 bg-moz-green rounded-full" 
                                style={{width: `${citation.relevance}%`}}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-400">{citation.relevance}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Aviso Legal para respostas da IA */}
                  {message.role === 'assistant' && (
                    <AIResponseDisclaimer severity="high" />
                  )}
                  
                  {/* Sistema de Feedback para respostas do assistente */}
                  {message.role === 'assistant' && (
                    <FeedbackSystem 
                      messageId={`msg-${index}`}
                      initialResponse={message.content}
                    />
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Scale className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">Muzaia</span>
                  </div>
                  <div className="flex space-x-1 mt-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modal de Aviso Legal */}
      {shouldShowModal && (
        <LegalDisclaimer type="modal" />
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-blue-500 transition-colors">
            <div className="flex items-start space-x-3 p-4">
              <button
                type="button"
                className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Anexar ficheiro"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte sobre legislação moçambicana..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[24px] max-h-32"
                rows="1"
                style={{ resize: 'none' }}
              />
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Gravar áudio"
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
                  title="Enviar mensagem"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            Prima Enter para enviar, Shift+Enter para nova linha
          </p>
          
          {/* Footer Legal Disclaimer */}
          <div className="mt-4">
            <LegalDisclaimer type="footer" variant="warning" />
          </div>
        </form>
      </div>
    </div>
  );
}