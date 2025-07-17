import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import MessageBubble from './MessageBubble';
import CitationCard from './CitationCard';
import LoadingSpinner from '../Common/LoadingSpinner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

interface Citation {
  id: number;
  title: string;
  source: string;
  law_type: string;
  article_number?: string;
  relevance_score: number;
}

export default function ChatInterface() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    messages, 
    sessionId, 
    addMessage, 
    clearMessages,
    sendMessage 
  } = useChatStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      // Add user message immediately
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // Send message to backend
      const response = await sendMessage(userMessage, sessionId);
      
      if (response.success) {
        // Add assistant response
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.response,
          citations: response.citations,
          timestamp: new Date()
        });
      } else {
        // Add error message
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua consulta. Tente novamente.',
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Erro de conexão. Verifique sua internet e tente novamente.',
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedQuestions = [
    "Quais são os direitos fundamentais na Constituição moçambicana?",
    "Qual é a idade mínima para trabalhar em Moçambique?",
    "Como funciona o divórcio segundo a lei moçambicana?",
    "Quais são as penas para furto no Código Penal?",
    "Quais são as condições para o casamento em Moçambique?"
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Como posso ajudá-lo hoje?
              </h2>
              <p className="text-gray-600 mb-6">
                Faça perguntas sobre legislação moçambicana e receba respostas precisas com fontes verificadas.
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-4">
                Perguntas sugeridas:
              </p>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(question)}
                  className="block w-full p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
                >
                  <span className="text-gray-800">{question}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <MessageBubble message={msg} />
                {msg.citations && msg.citations.length > 0 && (
                  <div className="ml-12 space-y-2">
                    {msg.citations.map((citation, index) => (
                      <CitationCard key={index} citation={citation} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 max-w-xs">
                  <LoadingSpinner />
                  <span className="text-sm text-gray-600 ml-2">
                    Analisando sua consulta...
                  </span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua consulta jurídica..."
              className="w-full min-h-[48px] max-h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              Enter para enviar
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        
        {messages.length > 0 && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={clearMessages}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Limpar conversa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
