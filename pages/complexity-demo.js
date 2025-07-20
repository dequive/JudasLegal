import { useState } from 'react';

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

export default function ComplexityDemoPage() {
  const [inputText, setInputText] = useState('');
  const [complexity, setComplexity] = useState(null);

  // Sample texts for demonstration
  const sampleTexts = [
    {
      title: "Questão Simples",
      text: "Qual é a idade mínima para votar em Moçambique?",
      expected: "🟢 Simples"
    },
    {
      title: "Questão Moderada", 
      text: "Como funciona o contrato de trabalho segundo a legislação moçambicana?",
      expected: "🟡 Moderado"
    },
    {
      title: "Questão Complexa",
      text: "Qual é o procedimento para recurso de uma decisão judicial em processo civil, considerando a competência do tribunal e o interesse processual das partes?",
      expected: "🟠 Complexo"
    },
    {
      title: "Questão Muito Complexa",
      text: "Como se aplica a interpretação da jurisprudência do Tribunal Supremo em casos de responsabilidade civil por danos morais em contratos de sucessão, considerando as preliminares processuais e a conexão entre diferentes instâncias de apelação e cassação?",
      expected: "🔴 Muito Complexo"
    }
  ];

  const analyzeText = (text) => {
    const result = getComplexityRating(text);
    setComplexity(result);
    setInputText(text);
  };

  const handleAnalyze = () => {
    if (inputText.trim()) {
      analyzeText(inputText);
    }
  };

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
              Sistema de Classificação de Complexidade
            </h1>
          </div>
          <button 
            onClick={() => window.location.href = '/chat'}
            style={{
              background: '#2563eb',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#2563eb';
            }}
          >
            Ir para o Chat
          </button>
        </div>
      </header>

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Description */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Como Funciona o Sistema
          </h2>
          <p style={{
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            O sistema avalia automaticamente a complexidade de textos jurídicos baseado em:
          </p>
          <ul style={{
            color: '#6b7280',
            lineHeight: '1.6',
            paddingLeft: '1.5rem'
          }}>
            <li>Presença de termos jurídicos especializados</li>
            <li>Complexidade de conceitos legais mencionados</li>
            <li>Extensão e estrutura do texto</li>
            <li>Número de áreas do direito envolvidas</li>
          </ul>
        </div>

        {/* Input Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Teste o Sistema
          </h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite vossa questão jurídica aqui para analisar a complexidade..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'vertical',
              marginBottom: '1rem'
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
            style={{
              background: inputText.trim() ? '#2563eb' : '#9ca3af',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            Analisar Complexidade
          </button>

          {/* Result */}
          {complexity && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1.5rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: `2px solid ${complexity.color}20`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '24px' }}>{complexity.emoji}</span>
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: complexity.color
                  }}>
                    Nível de Complexidade: {complexity.label}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    Nível {complexity.level} de 4
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div style={{
                background: '#e5e7eb',
                height: '8px',
                borderRadius: '4px',
                position: 'relative'
              }}>
                <div style={{
                  background: complexity.color,
                  height: '100%',
                  borderRadius: '4px',
                  width: `${(complexity.level / 4) * 100}%`,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Sample Texts */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            Exemplos de Diferentes Níveis
          </h3>
          
          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            {sampleTexts.map((sample, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => analyzeText(sample.text)}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {sample.title}
                  </h4>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    {sample.expected}
                  </span>
                </div>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  "{sample.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}