import { useState, useEffect } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular checagem de autenticação
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Carregando Judas Legal Assistant...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Landing Page inspirada no design da Lexia
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#fafafa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
      }}>
        {/* Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1e40af'
            }}>
              Judas
            </div>
            <button 
              onClick={handleLogin}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target).style.background = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                (e.target).style.background = '#2563eb';
              }}
            >
              Iniciar Sessão
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section style={{
          padding: '4rem 0 6rem 0',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: '800',
              color: '#111827',
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              letterSpacing: '-0.025em'
            }}>
              Simplifique a sua advocacia com{' '}
              <span style={{ color: '#2563eb' }}>
                Inteligência Artificial
              </span>
            </h1>
            
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '3rem',
              fontWeight: '400'
            }}>
              O Judas é o seu assistente jurídico virtual que automatiza tarefas, 
              otimiza processos e eleva a sua produtividade especializado em 
              legislação moçambicana.
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '4rem'
            }}>
              <button 
                onClick={() => window.location.href = '/chat'}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  const target = e.target;
                  target.style.background = '#1d4ed8';
                  target.style.transform = 'translateY(-1px)';
                  target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target;
                  target.style.background = '#2563eb';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                Experimentar Chat Jurídico
              </button>
              
              <button 
                onClick={() => window.location.href = '/glossario'}
                style={{
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target;
                  target.style.background = '#f9fafb';
                  target.style.transform = 'translateY(-1px)';
                  target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target;
                  target.style.background = 'white';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                Explorar Glossário
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{
          padding: '6rem 0',
          background: 'white'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '4rem'
            }}>
              <h2 style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Funcionalidades‑chave do Judas
              </h2>
              <p style={{
                fontSize: '1.125rem',
                color: '#6b7280',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Descubra como o Judas pode revolucionar o seu dia a dia jurídico.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                background: 'white'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#dbeafe',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '24px'
                }}>
                  🤖
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.75rem'
                }}>
                  Assistente Jurídico 24/7
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  Chatbot especializado que responde a perguntas sobre legislação 
                  moçambicana com base em documentos oficiais e jurisprudência aplicável.
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                background: 'white'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#dcfce7',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '24px'
                }}>
                  📚
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.75rem'
                }}>
                  Base Legal Moçambicana
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  Documentos legais atualizados e especializados para Moçambique, 
                  organizados e pesquisáveis de forma intuitiva.
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                background: 'white'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#fef3c7',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '24px'
                }}>
                  💡
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.75rem'
                }}>
                  Explicações Contextuais
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  Glossário interativo com explicações simples de termos jurídicos 
                  complexos, facilitando a compreensão para todos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section style={{
          padding: '6rem 0',
          background: '#f9fafb'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '4rem'
            }}>
              <h2 style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Como o Judas simplifica o seu dia
              </h2>
              <p style={{
                fontSize: '1.125rem',
                color: '#6b7280',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Um fluxo de trabalho otimizado que valoriza o seu tempo e conhecimento.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {[
                {
                  step: '1',
                  title: 'Faça sua pergunta',
                  description: 'Digite qualquer questão jurídica em linguagem natural, sobre qualquer área do direito moçambicano.'
                },
                {
                  step: '2',
                  title: 'A IA processa',
                  description: 'O sistema analisa documentos legais relevantes e formula uma resposta fundamentada e precisa.'
                },
                {
                  step: '3',
                  title: 'Receba orientação',
                  description: 'Obtenha respostas claras com citações das fontes legais aplicáveis ao seu caso específico.'
                }
              ].map((item, index) => (
                <div key={index} style={{
                  padding: '2rem',
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#2563eb',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.75rem'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    lineHeight: '1.6'
                  }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          padding: '3rem 0',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1e40af',
              marginBottom: '1rem'
            }}>
              Judas Legal Assistant
            </div>
            <p style={{
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Assistente jurídico inteligente especializado em legislação moçambicana.
            </p>
          </div>
        </footer>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Dashboard para usuários logados (implementar depois)
  return (
    <div>Dashboard do usuário logado</div>
  );
}