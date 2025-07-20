import { useAuth } from '../hooks/useAuth';

const LandingPage = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    // Redirect to auth page for new authentication system
    window.location.href = '/auth';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
    }}>
      {/* Animated background patterns */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {/* Floating orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '20%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          animation: 'float 7s ease-in-out infinite'
        }} />
      </div>

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center'
      }}>
        {/* Hero section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '800px',
          width: '100%'
        }}>
          {/* Logo and title */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '4rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              margin: '0 0 1rem 0',
              lineHeight: '1.1'
            }}>
              Judas
            </h1>
            <p style={{
              fontSize: '1.5rem',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              fontWeight: '300'
            }}>
              Assistente Jurídico Inteligente para Moçambique
            </p>
          </div>

          {/* Features highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 0.5rem 0'
              }}>
                IA Gemini 2.0
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Respostas inteligentes baseadas na legislação moçambicana
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 0.5rem 0'
              }}>
                Glossário Jurídico
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Tooltips contextuais com explicações de termos legais
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 0.5rem 0'
              }}>
                Análise de Complexidade
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Classificação automática da dificuldade jurídica
              </p>
            </div>
          </div>

          {/* CTA section */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={handleLogin}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                transform: 'translateY(0)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
              }}
            >
              🚀 Entrar ou Registar
            </button>
          </div>

          {/* Additional info */}
          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Acesso com email, telemóvel ou Google. Sistema desenvolvido especificamente 
            para advogados, estudantes de direito e cidadãos moçambicanos.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ⚖️ Direito Moçambicano
            </span>
            <span style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🇲🇿 Português Europeu
            </span>
            <span style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔒 Seguro e Privado
            </span>
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.8rem',
            margin: 0
          }}>
            © 2024 Judas Legal Assistant. Desenvolvido para a comunidade jurídica moçambicana.
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;