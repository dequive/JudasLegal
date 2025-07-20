import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MoreHorizontal, Lightbulb, FileText, Scale, Map, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FeedbackSystem from './FeedbackSystem';
import ExportSystem from './ExportSystem';
import { useLegalHistory, useUserPreferences } from '../hooks/useLocalStorage';
import LegalDisclaimer, { AIResponseDisclaimer, useLegalDisclaimer } from './LegalDisclaimer';

// Análise de complexidade jurídica local
function analyzeComplexity(text) {
  const legalTerms = [
    'artigo', 'código', 'lei', 'decreto', 'regulamento', 'jurisprudência',
    'tribunal', 'processo', 'recurso', 'sentença', 'acórdão', 'parecer',
    'constitucional', 'civil', 'penal', 'comercial', 'administrativo'
  ];
  
  const complexTerms = [
    'constitucionalidade', 'hermenêutica', 'jurisprudencial', 'precedente',
    'discricionariedade', 'subsidiariedade', 'proporcionalidade'
  ];
  
  const textLower = text.toLowerCase();
  const legalCount = legalTerms.filter(term => textLower.includes(term)).length;
  const complexCount = complexTerms.filter(term => textLower.includes(term)).length;
  const wordCount = text.split(' ').length;
  
  let score = 0;
  score += legalCount * 10;
  score += complexCount * 20;
  score += Math.min(wordCount / 50, 20);
  
  if (score < 20) return { level: 'Simples', color: '#10b981', emoji: '🟢' };
  if (score < 40) return { level: 'Moderado', color: '#f59e0b', emoji: '🟡' };
  if (score < 60) return { level: 'Complexo', color: '#f97316', emoji: '🟠' };
  return { level: 'Muito Complexo', color: '#ef4444', emoji: '🔴' };
}

export default function ModernChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const { shouldShowModal } = useLegalDisclaimer();
  const { addToHistory } = useLegalHistory();
  const { preferences } = useUserPreferences();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Tentar backend real primeiro
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputValue,
          session_id: 'web-session-' + Date.now()
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = {
          role: 'assistant',
          content: data.response || data.message,
          citations: data.citations || [],
          complexity: data.complexity || analyzeComplexity(inputValue),
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);
        addToHistory(inputValue, assistantMessage.content);
      } else {
        throw new Error('Backend indisponível');
      }
    } catch (error) {
      // Fallback com simulação local
      const complexity = analyzeComplexity(inputValue);
      const simulatedResponse = {
        role: 'assistant',
        content: `Com base na vossa pergunta sobre "${inputValue}", posso ajudar-vos a compreender melhor este aspecto da legislação moçambicana. Esta questão tem complexidade ${complexity.level.toLowerCase()}.

Para uma resposta mais precisa e actualizada, recomendo consultar os documentos legais oficiais e, quando necessário, procurar aconselhamento jurídico profissional.`,
        citations: [
          {
            text: "Constituição da República de Moçambique - Artigo 40",
            relevance: 85,
            source: "Constituição Nacional"
          },
          {
            text: "Código Civil Moçambicano - Livro II",
            relevance: 72,
            source: "Legislação Civil"
          }
        ],
        complexity,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, simulatedResponse]);
      addToHistory(inputValue, simulatedResponse.content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestions = [
    {
      icon: <Scale className="w-5 h-5" />,
      text: "Como funciona o direito de propriedade em Moçambique?",
      subtitle: "Legislação sobre propriedade privada"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      text: "Quais são os direitos do trabalhador segundo a lei moçambicana?",
      subtitle: "Lei do Trabalho e direitos fundamentais"
    },
    {
      icon: <Map className="w-5 h-5" />,
      text: "Como registar uma empresa em Moçambique?",
      subtitle: "Procedimentos legais empresariais"
    }
  ];

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)',
    color: 'white'
  };

  const headerStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const messagesStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '100vh'
  };

  const inputStyle = {
    padding: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)'
  };

  const messageUserStyle = {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    borderRadius: '20px',
    padding: '16px 20px',
    marginBottom: '8px',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
  };

  const messageAssistantStyle = {
    alignSelf: 'flex-start',
    maxWidth: '90%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '16px'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
          </Link>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #00a859, #ce1126, #fcd116)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            M
          </div>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: 0,
              background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Muzaia
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>Assistente Jurídico</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            <span style={{ fontSize: '14px', color: '#cbd5e1' }}>Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={messagesStyle}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #00a859, #ce1126, #fcd116)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              margin: '0 auto 24px'
            }}>
              M
            </div>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Como posso ajudar-vos hoje?
            </h2>
            <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '32px' }}>
              Sou o vosso assistente jurídico especializado em legislação moçambicana
            </p>
            
            <div style={{ display: 'grid', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(suggestion.text)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: 'white'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {suggestion.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                        {suggestion.text}
                      </div>
                      <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
                        {suggestion.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={index} style={message.role === 'user' ? messageUserStyle : messageAssistantStyle}>
                {message.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Scale style={{ width: '12px', height: '12px', color: 'white' }} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#cbd5e1' }}>Muzaia</span>
                    {message.complexity && (
                      <div style={{
                        background: message.complexity.color,
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {message.complexity.emoji} {message.complexity.level}
                      </div>
                    )}
                  </div>
                )}
                
                <div style={{ lineHeight: '1.6', marginBottom: message.citations?.length ? '16px' : '0' }}>
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
                  ))}
                </div>

                {message.citations && message.citations.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}>
                      Fontes Legais:
                    </h4>
                    {message.citations.map((citation, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontSize: '14px', color: '#cbd5e1' }}>
                          {citation.text}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '48px', background: '#374151', borderRadius: '4px', height: '4px' }}>
                            <div 
                              style={{
                                height: '4px',
                                background: '#10b981',
                                borderRadius: '4px',
                                width: `${citation.relevance}%`
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                            {citation.relevance}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {message.role === 'assistant' && (
                  <div style={{ marginTop: '16px' }}>
                    <AIResponseDisclaimer severity="high" />
                    <FeedbackSystem 
                      messageId={`msg-${index}`}
                      initialResponse={message.content}
                    />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div style={messageAssistantStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Scale style={{ width: '12px', height: '12px', color: 'white' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#cbd5e1' }}>Muzaia</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#6b7280',
                    borderRadius: '50%',
                    animation: 'bounce 1.4s ease-in-out infinite both'
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#6b7280',
                    borderRadius: '50%',
                    animation: 'bounce 1.4s ease-in-out 0.16s infinite both'
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#6b7280',
                    borderRadius: '50%',
                    animation: 'bounce 1.4s ease-in-out 0.32s infinite both'
                  }} />
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
      <div style={inputStyle}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'end', padding: '16px', gap: '12px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escreva a vossa pergunta jurídica aqui..."
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontSize: '16px',
                    resize: 'none',
                    maxHeight: '120px',
                    minHeight: '24px',
                    lineHeight: '1.5'
                  }}
                  rows="1"
                />
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '8px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Paperclip style={{ width: '16px', height: '16px' }} />
                  </button>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Mic style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                style={{
                  background: inputValue.trim() && !isLoading 
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                    : '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff40',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send style={{ width: '16px', height: '16px' }} />
                    Enviar
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}