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
        background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #4338ca 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Carregando Judas Legal Assistant...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Landing Page para usuários não logados
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #4338ca 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Esferas animadas de fundo */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            textAlign: 'center', 
            color: 'white',
            maxWidth: '800px'
          }}>
            {/* Logo/Title */}
            <div style={{ marginBottom: '3rem' }}>
              <h1 style={{ 
                fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
                marginBottom: '1rem',
                background: 'linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '800',
                letterSpacing: '-0.025em'
              }}>
                Judas Legal Assistant
              </h1>
              <p style={{ 
                fontSize: '1.5rem', 
                marginBottom: '2rem',
                opacity: 0.9,
                fontWeight: '300'
              }}>
                Assistente Jurídico Inteligente para Moçambique
              </p>
            </div>

            {/* Features Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  IA Avançada
                </h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.5' }}>
                  Powered by Google Gemini 2.0 Flash para respostas precisas e contextuais
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Base Legal Moçambicana
                </h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.5' }}>
                  Documentos legais atualizados e especializados para Moçambique
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💡</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Tooltips Educativos
                </h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.5' }}>
                  Explicações contextuais de termos jurídicos para fácil compreensão
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => window.location.href = '/chat'}
                style={{
                  background: 'linear-gradient(45deg, #10b981, #3b82f6)',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(16,185,129,0.3)',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  marginBottom: '1rem'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'scale(1.05)';
                  target.style.boxShadow = '0 15px 35px rgba(16,185,129,0.4)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'scale(1)';
                  target.style.boxShadow = '0 10px 25px rgba(16,185,129,0.3)';
                }}
              >
                💬 Experimente o Chat Jurídico
              </button>
              
              <button 
                onClick={() => window.location.href = '/glossario'}
                style={{
                  background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(139,92,246,0.3)',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  marginBottom: '1rem'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'scale(1.05)';
                  target.style.boxShadow = '0 15px 35px rgba(139,92,246,0.4)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'scale(1)';
                  target.style.boxShadow = '0 10px 25px rgba(139,92,246,0.3)';
                }}
              >
                📚 Explore o Glossário Jurídico
              </button>
              
              <button 
                onClick={handleLogin}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  marginBottom: '1rem'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'scale(1.05)';
                  target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'scale(1)';
                  target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                🚀 Login com Replit (Completo)
              </button>
            </div>

            <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '2rem' }}>
              <span style={{ 
                backgroundColor: 'rgba(16,185,129,0.2)', 
                padding: '0.5rem 1rem', 
                borderRadius: '20px',
                marginRight: '1rem'
              }}>
                Sistema Online
              </span>
              <span style={{ 
                backgroundColor: 'rgba(59,130,246,0.2)', 
                padding: '0.5rem 1rem', 
                borderRadius: '20px',
                marginRight: '1rem'
              }}>
                Gratuito
              </span>
              <span style={{ 
                backgroundColor: 'rgba(139,92,246,0.2)', 
                padding: '0.5rem 1rem', 
                borderRadius: '20px'
              }}>
                Sempre Atualizado
              </span>
            </div>
          </div>
        </div>

        {/* Animações CSS */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
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