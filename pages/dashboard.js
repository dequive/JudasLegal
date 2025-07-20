import { useAuth } from '../hooks/useAuth';
import AuthGuard from '../components/AuthGuard';
import UserProfile from '../components/UserProfile';

const Dashboard = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getUserName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilizador';
  };

  return (
    <AuthGuard>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
      }}>
        {/* Header */}
        <header style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '1rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                margin: 0
              }}>
                Muzaia
              </h1>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'pulse 2s infinite'
                }} />
                Online
              </span>
            </div>
            
            <UserProfile />
          </div>
        </header>

        {/* Main content */}
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          {/* Welcome banner */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '16px',
            padding: '2rem',
            color: 'white',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              opacity: 0.6
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                margin: '0 0 0.5rem 0'
              }}>
                {getGreeting()}, {getUserName()}! 👋
              </h2>
              <p style={{
                fontSize: '1rem',
                opacity: 0.9,
                margin: 0,
                lineHeight: '1.6'
              }}>
                Bem-vindo ao vosso assistente jurídico pessoal. Estou aqui para vos ajudar 
                com questões legais baseadas na legislação moçambicana.
              </p>
            </div>
          </div>

          {/* Quick actions grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Chat action */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
            onClick={() => window.location.href = '/chat'}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                fontSize: '1.5rem'
              }}>
                💬
              </div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                Iniciar Conversa
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Faça perguntas jurídicas e receba respostas baseadas na legislação moçambicana
              </p>
            </div>

            {/* Glossary action */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
            onClick={() => window.location.href = '/tooltips-demo'}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                fontSize: '1.5rem'
              }}>
                📚
              </div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                Glossário Jurídico
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Explore termos legais com explicações contextuais e exemplos práticos
              </p>
            </div>

            {/* Complexity demo action */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
            onClick={() => window.location.href = '/complexity-demo'}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                fontSize: '1.5rem'
              }}>
                📊
              </div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                Análise de Complexidade
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Veja como o sistema classifica a dificuldade de questões jurídicas
              </p>
            </div>
          </div>

          {/* System status */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 1rem 0'
            }}>
              Estado do Sistema
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10b981'
                }} />
                <span style={{
                  fontSize: '0.9rem',
                  color: '#374151'
                }}>
                  IA Gemini 2.0 Flash - Ativo
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10b981'
                }} />
                <span style={{
                  fontSize: '0.9rem',
                  color: '#374151'
                }}>
                  Base de Dados - Conectada
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#3b82f6'
                }} />
                <span style={{
                  fontSize: '0.9rem',
                  color: '#374151'
                }}>
                  Documentos Legais - 9 Carregados
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* CSS animations */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;