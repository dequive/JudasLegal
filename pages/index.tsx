export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #4338ca 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center', 
        color: 'white',
        padding: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Judas Legal Assistant
        </h1>
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Assistente Jurídico Inteligente para Moçambique
        </p>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p>🤖 Powered by Google Gemini AI</p>
          <p>📚 Base Legal Moçambicana</p>
          <p>💡 Tooltips Educativos</p>
        </div>
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.7 }}>
          Sistema Online • Gratuito • Atualizado
        </div>
      </div>
    </div>
  );
}