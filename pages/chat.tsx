import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  citations?: Array<{
    title: string;
    source: string;
    relevance: number;
  }>;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o Judas Legal Assistant, seu assistente jurídico especializado em legislação moçambicana. Como posso ajudá-lo hoje?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = async (userMessage: string): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simula delay da API
    
    const responses = [
      {
        text: `Baseado na sua pergunta sobre "${userMessage}", posso explicar que na legislação moçambicana este aspecto é regulamentado pelo Código Civil. Aqui está a informação relevante: [resposta detalhada seria gerada pelo Gemini AI]`,
        citations: [
          {
            title: 'Código Civil de Moçambique',
            source: 'Artigo 123 - Disposições Gerais',
            relevance: 0.95
          },
          {
            title: 'Lei do Trabalho',
            source: 'Capítulo III - Contratos',
            relevance: 0.78
          }
        ]
      },
      {
        text: `Sua questão sobre "${userMessage}" é muito importante. De acordo com a legislação moçambicana vigente, especificamente na Constituição da República, encontramos as seguintes disposições: [resposta contextual seria fornecida pelo sistema RAG]`,
        citations: [
          {
            title: 'Constituição da República de Moçambique',
            source: 'Artigo 56 - Direitos Fundamentais',
            relevance: 0.92
          }
        ]
      }
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      text: randomResponse.text,
      isUser: false,
      timestamp: new Date(),
      citations: randomResponse.citations
    };
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await simulateAIResponse(currentMessage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #4338ca 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              background: 'linear-gradient(45deg, #10b981, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              marginRight: '1rem'
            }}>
              Judas Legal Assistant
            </h1>
            <span style={{ 
              backgroundColor: 'rgba(16,185,129,0.2)', 
              color: '#10b981',
              padding: '0.25rem 0.75rem', 
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}>
              🤖 Online
            </span>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ← Voltar
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        padding: '1rem'
      }}>
        {/* Messages */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                marginBottom: '1rem'
              }}
            >
              <div style={{ maxWidth: '80%' }}>
                <div
                  style={{
                    background: message.isUser 
                      ? 'linear-gradient(45deg, #10b981, #059669)'
                      : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: message.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                    lineHeight: '1.5'
                  }}
                >
                  <p style={{ margin: 0 }}>{message.text}</p>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    opacity: 0.7, 
                    marginTop: '0.5rem',
                    textAlign: message.isUser ? 'right' : 'left'
                  }}>
                    {message.timestamp.toLocaleTimeString('pt-PT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {message.citations.map((citation, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          fontSize: '0.85rem'
                        }}
                      >
                        <div style={{ 
                          color: '#60a5fa', 
                          fontWeight: '600',
                          marginBottom: '0.25rem'
                        }}>
                          {citation.title}
                        </div>
                        <div style={{ 
                          color: '#cbd5e1',
                          fontSize: '0.8rem',
                          marginBottom: '0.5rem'
                        }}>
                          {citation.source}
                        </div>
                        <div style={{ 
                          background: 'rgba(59, 130, 246, 0.2)',
                          height: '4px',
                          borderRadius: '2px',
                          width: `${citation.relevance * 100}%`,
                          minWidth: '20px'
                        }} />
                        <div style={{ 
                          color: '#94a3b8',
                          fontSize: '0.75rem',
                          marginTop: '0.25rem'
                        }}>
                          Relevância: {(citation.relevance * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                padding: '1rem',
                borderRadius: '18px 18px 18px 4px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  marginRight: '4px',
                  animation: 'bounce 1.4s ease-in-out infinite both'
                }} />
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  marginRight: '4px',
                  animation: 'bounce 1.4s ease-in-out 0.16s infinite both'
                }} />
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'bounce 1.4s ease-in-out 0.32s infinite both'
                }} />
                <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                  Judas está pensando...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '1rem',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '1rem'
        }}>
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta jurídica..."
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1rem',
              resize: 'none',
              outline: 'none',
              minHeight: '24px',
              maxHeight: '120px',
              lineHeight: '1.5'
            }}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isLoading}
            style={{
              background: currentMessage.trim() && !isLoading
                ? 'linear-gradient(45deg, #10b981, #059669)'
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '12px',
              cursor: currentMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '48px',
              transition: 'all 0.2s ease'
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
              '→'
            )}
          </button>
        </div>
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
  );
}