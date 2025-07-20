import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Upload, Brain, BarChart3, BookOpen, Shield, Zap, Globe, Settings } from 'lucide-react';
import LegalDisclaimer from '../components/LegalDisclaimer';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    documents: 11,
    chunks: 47,
    status: 'Online'
  });

  useEffect(() => {
    setIsLoaded(true);
    
    // Fetch real stats from backend
    fetch('http://localhost:8000/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'healthy') {
          setStats(prev => ({ ...prev, status: 'Online' }));
        }
      })
      .catch(() => {
        setStats(prev => ({ ...prev, status: 'Offline' }));
      });
  }, []);

  const modernButtonStyle = {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
  };

  const secondaryButtonStyle = {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '32px',
    transition: 'all 0.3s ease',
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      {/* Background Effects */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <div 
          style={{
            position: 'absolute',
            top: '-160px',
            right: '-160px',
            width: '320px',
            height: '320px',
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '-160px',
            left: '-160px',
            width: '320px',
            height: '320px',
            background: 'rgba(147, 51, 234, 0.2)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite 2s'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '384px',
            height: '384px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'pulse 4s ease-in-out infinite 4s'
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <header style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #00a859, #ce1126, #fcd116)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold'
              }}>
                M
              </div>
              <h1 style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                margin: 0,
                background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Muzaia
              </h1>
            </div>
            <p style={{ 
              fontSize: '24px', 
              color: '#e2e8f0', 
              margin: 0,
              fontWeight: '300'
            }}>
              Assistente Jurídico Inteligente
            </p>
          </div>
        </header>

        {/* Status Card */}
        <section style={{ padding: '0 24px 32px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{
              ...cardStyle,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '24px'
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '18px', opacity: 0.9 }}>
                  Assistente jurídico online baseado em inteligência artificial, especialista em legislação moçambicana
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.documents}</span>
                    <span style={{ opacity: 0.8 }}>Documentos Legais</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.chunks}</span>
                    <span style={{ opacity: 0.8 }}>Chunks RAG</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Brain style={{ width: '20px', height: '20px' }} />
                    <span style={{ opacity: 0.8 }}>Gemini 2.0 Flash</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: stats.status === 'Online' ? '#10b981' : '#ef4444',
                      animation: stats.status === 'Online' ? 'pulse 2s ease-in-out infinite' : 'none'
                    }} />
                    <span style={{ fontSize: '14px', opacity: 0.8 }}>{stats.status}</span>
                  </div>
                </div>
              </div>
              <Link href="/chat" style={modernButtonStyle}>
                Iniciar Chat
              </Link>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section style={{ padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
            <h2 style={{ 
              fontSize: '56px', 
              fontWeight: 'bold', 
              margin: '0 0 32px 0',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Navegue pela legislação moçambicana com inteligência artificial
            </h2>
            <p style={{ 
              fontSize: '24px', 
              color: '#cbd5e1', 
              marginBottom: '48px',
              lineHeight: '1.6'
            }}>
              Experimente o assistente jurídico mais avançado de Moçambique
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <Link href="/chat" style={modernButtonStyle}>
                <MessageCircle style={{ width: '20px', height: '20px' }} />
                Iniciar Conversa
              </Link>
              <Link href="/admin" style={secondaryButtonStyle}>
                <Shield style={{ width: '20px', height: '20px' }} />
                Área Administrativa
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section style={{ padding: '64px 24px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h3 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: '48px',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Funcionalidades Principais
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px' 
            }}>
              <div style={cardStyle}>
                <Brain style={{ width: '48px', height: '48px', color: '#3b82f6', marginBottom: '16px' }} />
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>IA Jurídica Avançada</h4>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                  Powered by Google Gemini 2.0 Flash para respostas inteligentes sobre legislação moçambicana
                </p>
              </div>
              <div style={cardStyle}>
                <BookOpen style={{ width: '48px', height: '48px', color: '#10b981', marginBottom: '16px' }} />
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Base Legal Completa</h4>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                  Acesso a leis, códigos e regulamentos actualizados de Moçambique
                </p>
              </div>
              <div style={cardStyle}>
                <Upload style={{ width: '48px', height: '48px', color: '#f59e0b', marginBottom: '16px' }} />
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Upload de Documentos</h4>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                  Sistema administrativo para adicionar novas leis e regulamentos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section style={{ padding: '64px 24px' }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              marginBottom: '48px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Acções Rápidas
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <Link href="/chat" style={{ ...cardStyle, textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <MessageCircle style={{ width: '32px', height: '32px', color: '#3b82f6', marginBottom: '16px' }} />
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Iniciar Chat Jurídico</h4>
                <p style={{ color: '#cbd5e1', margin: 0 }}>Converse com o assistente IA</p>
              </Link>
              <Link href="/admin" style={{ ...cardStyle, textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <Shield style={{ width: '32px', height: '32px', color: '#10b981', marginBottom: '16px' }} />
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Painel Administrativo</h4>
                <p style={{ color: '#cbd5e1', margin: 0 }}>Gerir documentos legais</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '48px 24px' }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <Globe style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              <span style={{ color: '#cbd5e1' }}>Powered by Google Gemini AI, Supabase & Vercel</span>
            </div>
            <p style={{ color: '#94a3b8', margin: '0 0 24px 0' }}>
              © 2025 Muzaia. Assistente jurídico inteligente para Moçambique.
            </p>
            
            {/* Footer Legal Disclaimer */}
            <div style={{ maxWidth: '768px', margin: '0 auto' }}>
              <LegalDisclaimer type="footer" variant="professional" />
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          h1 { font-size: 36px !important; }
          h2 { font-size: 32px !important; }
          h3 { font-size: 24px !important; }
        }
      `}</style>
    </div>
  );
}