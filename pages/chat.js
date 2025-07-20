import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthGuard from '../components/AuthGuard';
import UserProfile from '../components/UserProfile';
import TextWithTooltips from '../components/TextWithTooltips';
import LegalGlossaryPanel from '../components/LegalGlossaryPanel';

// JavaScript component

// Legal complexity rating system
const getComplexityRating = (text) => {
  const legalTerms = [
    'constituição', 'código civil', 'código penal', 'código comercial',
    'habeas corpus', 'mandado de segurança', 'usucapião', 'prescrição',
    'jurisprudência', 'acórdão', 'recurso', 'apelação', 'cassação',
    'responsabilidade civil', 'danos morais', 'indenização',
    'contrato', 'obrigação', 'direito real', 'propriedade',
    'sucessão', 'herança', 'testamento', 'inventário',
    'processo civil', 'processo penal', 'processo administrativo'
  ];
  
  const complexWords = [
    'interpretação', 'aplicação', 'competência', 'jurisdição',
    'legitimidade', 'interesse processual', 'mérito',
    'preliminar', 'prejudicial', 'conexão', 'continência'
  ];
  
  const textLower = text.toLowerCase();
  let complexity = 0;
  
  // Count legal terms
  legalTerms.forEach(term => {
    if (textLower.includes(term)) complexity += 1;
  });
  
  // Count complex words (worth more)
  complexWords.forEach(word => {
    if (textLower.includes(word)) complexity += 2;
  });
  
  // Text length factor
  if (text.length > 500) complexity += 1;
  if (text.length > 1000) complexity += 2;
  
  // Return rating object
  if (complexity <= 2) {
    return { level: 1, emoji: '🟢', label: 'Simples', color: '#10b981' };
  } else if (complexity <= 5) {
    return { level: 2, emoji: '🟡', label: 'Moderado', color: '#f59e0b' };
  } else if (complexity <= 8) {
    return { level: 3, emoji: '🟠', label: 'Complexo', color: '#ef4444' };
  } else {
    return { level: 4, emoji: '🔴', label: 'Muito Complexo', color: '#dc2626' };
  }
};

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: `Olá! Sou o MuzaIA, o vosso assistente jurídico online baseado em inteligência artificial, especialista em leis moçambicanas. Como vos posso ajudar hoje?`,
      isUser: false,
      timestamp: new Date(),
      complexity: getComplexityRating('Olá! Sou o MuzaIA, o vosso assistente jurídico online baseado em inteligência artificial, especialista em leis moçambicanas. Como vos posso ajudar hoje?')
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage) => {
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userMessage })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        id: Date.now().toString(),
        text: data.text,
        isUser: false,
        timestamp: new Date(),
        citations: data.citations,
        complexity: data.complexity
      };
    } catch (error) {
      console.error('Erro ao chamar API:', error);
      
      // Fallback response se a API falhar
      const fallbackText = `Com base na vossa pergunta sobre "${userMessage}", posso explicar que na legislação moçambicana este aspecto é regulamentado pelos códigos legais aplicáveis. Para informações mais específicas, recomendo consultar os documentos oficiais.`;
      
      return {
        id: Date.now().toString(),
        text: fallbackText,
        isUser: false,
        timestamp: new Date(),
        citations: [
          {
            title: 'Legislação Moçambicana',
            source: 'Documentos oficiais',
            relevance: 0.8
          }
        ],
        complexity: getComplexityRating(fallbackText)
      };
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      isUser: true,
      timestamp: new Date(),
      complexity: getComplexityRating(currentMessage)
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(currentMessage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AuthGuard>
      <div style={{ 
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
      }}>
        {/* Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0'
        }}>
          <div style={{
            maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '700',
              color: '#1e40af',
              margin: 0,
              marginRight: '1rem'
            }}>
              Judas
            </h1>
            <span style={{ 
              background: '#dcfce7',
              color: '#166534',
              padding: '0.25rem 0.75rem', 
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Online
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => setShowGlossary(true)}
              style={{
                background: '#f0f9ff',
                border: '1px solid #0ea5e9',
                color: '#0369a1',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#e0f2fe';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f0f9ff';
              }}
            >
              📚 Glossário Jurídico
            </button>
            <button 
              onClick={() => window.location.href = '/tooltips-demo'}
              style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                color: '#92400e',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#fde68a';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fef3c7';
              }}
            >
              💡 Demo Tooltips
            </button>
            <button 
              onClick={() => window.location.href = '/complexity-demo'}
              style={{
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                color: '#374151',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f3f4f6';
              }}
            >
              📊 Complexidade
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                background: 'white',
                border: '1px solid #d1d5db',
                color: '#374151',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
              }}
            >
              ← Voltar
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem'
      }}>
        {/* Messages */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '2rem 0',
          marginBottom: '2rem'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                marginBottom: '2rem'
              }}
            >
              <div style={{ maxWidth: '85%' }}>
                <div
                  style={{
                    background: message.isUser ? '#2563eb' : 'white',
                    color: message.isUser ? 'white' : '#374151',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.6'
                  }}
                >
                  {/* Complexity Rating Badge */}
                  {message.complexity && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      padding: '0.375rem 0.75rem',
                      background: message.isUser ? 'rgba(255,255,255,0.1)' : '#f8fafc',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: message.isUser ? 'rgba(255,255,255,0.9)' : message.complexity.color,
                      border: message.isUser ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${message.complexity.color}20`
                    }}>
                      <span style={{ fontSize: '14px' }}>{message.complexity.emoji}</span>
                      <span>Complexidade: {message.complexity.label}</span>
                      <div style={{
                        width: '40px',
                        height: '4px',
                        background: message.isUser ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                        borderRadius: '2px',
                        marginLeft: '0.5rem',
                        position: 'relative'
                      }}>
                        <div style={{
                          background: message.isUser ? 'rgba(255,255,255,0.8)' : message.complexity.color,
                          height: '100%',
                          borderRadius: '2px',
                          width: `${(message.complexity.level / 4) * 100}%`,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  )}
                  
                  <div style={{ margin: 0, fontSize: '16px' }}>
                    <TextWithTooltips text={message.text} />
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.7, 
                    marginTop: '0.75rem',
                    textAlign: message.isUser ? 'right' : 'left',
                    color: message.isUser ? 'rgba(255,255,255,0.8)' : '#6b7280'
                  }}>
                    {message.timestamp.toLocaleTimeString('pt-PT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    {message.citations.map((citation, index) => (
                      <div
                        key={index}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '1rem',
                          marginBottom: '0.75rem',
                          fontSize: '14px'
                        }}
                      >
                        <div style={{ 
                          color: '#1e40af', 
                          fontWeight: '600',
                          marginBottom: '0.5rem'
                        }}>
                          {citation.title}
                        </div>
                        <div style={{ 
                          color: '#6b7280',
                          fontSize: '13px',
                          marginBottom: '0.75rem'
                        }}>
                          {citation.source}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <div style={{ 
                            background: '#e5e7eb',
                            height: '4px',
                            borderRadius: '2px',
                            flex: 1,
                            position: 'relative'
                          }}>
                            <div style={{
                              background: '#2563eb',
                              height: '100%',
                              borderRadius: '2px',
                              width: `${citation.relevance * 100}%`,
                              minWidth: '8px'
                            }} />
                          </div>
                          <span style={{ 
                            color: '#6b7280',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {(citation.relevance * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
              <div style={{
                background: 'white',
                color: '#374151',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  marginRight: '4px',
                  animation: 'bounce 1.4s ease-in-out infinite both'
                }} />
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  marginRight: '4px',
                  animation: 'bounce 1.4s ease-in-out 0.16s infinite both'
                }} />
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  animation: 'bounce 1.4s ease-in-out 0.32s infinite both'
                }} />
                <span style={{ marginLeft: '0.75rem', fontSize: '14px' }}>
                  Judas está a processar...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite a vossa pergunta jurídica aqui..."
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#374151',
              fontSize: '16px',
              resize: 'none',
              outline: 'none',
              minHeight: '24px',
              maxHeight: '120px',
              lineHeight: '1.5',
              fontFamily: 'inherit'
            }}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isLoading}
            style={{
              background: currentMessage.trim() && !isLoading ? '#2563eb' : '#e5e7eb',
              border: 'none',
              color: currentMessage.trim() && !isLoading ? 'white' : '#9ca3af',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: currentMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (currentMessage.trim() && !isLoading) {
                (e.target).style.background = '#1d4ed8';
              }
            }}
            onMouseLeave={(e) => {
              if (currentMessage.trim() && !isLoading) {
                (e.target).style.background = '#2563eb';
              }
            }}
          >
            {isLoading ? (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              'Enviar'
            )}
          </button>
        </div>

        {/* Legal Glossary Panel */}
        <LegalGlossaryPanel 
          isOpen={showGlossary} 
          onClose={() => setShowGlossary(false)} 
        />
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 40% {
            transform: scale(1);
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      </div>
    </AuthGuard>
  );
}