import { useState } from 'react';
import TextWithTooltips from '../components/TextWithTooltips';
import LegalTooltip from '../components/LegalTooltip';
import LegalGlossaryPanel from '../components/LegalGlossaryPanel';
import { legalGlossary, categoryColors, complexityLevels } from '../data/legal-glossary';

export default function TooltipsDemo() {
  const [showGlossary, setShowGlossary] = useState(false);
  const [selectedExample, setSelectedExample] = useState(0);

  const examples = [
    {
      title: "Direito Civil Básico",
      text: "O contrato de trabalho é regulado pelo código civil moçambicano. A responsabilidade civil obriga à reparação de danos causados. A propriedade é um direito real fundamental protegido pela constituição.",
      category: "Direito Civil"
    },
    {
      title: "Processo Judicial",
      text: "O tribunal exerce jurisdição sobre o território nacional. A competência determina qual tribunal deve julgar o caso. O recurso permite impugnar a decisão judicial. O acórdão é a decisão do tribunal colectivo baseada na jurisprudência estabelecida.",
      category: "Direito Processual"
    },
    {
      title: "Direito Penal",
      text: "O código penal define os crimes e suas penas. A presunção de inocência protege o arguido. O habeas corpus garante a liberdade contra prisões ilegais.",
      category: "Direito Penal"
    },
    {
      title: "Direito da Família",
      text: "O casamento civil celebra-se perante o conservador. O poder paternal inclui direitos e deveres dos pais. A sucessão pode ser legítima ou testamentária, sendo a legítima uma porção protegida por lei.",
      category: "Direito da Família"
    },
    {
      title: "Direito Administrativo",
      text: "O acto administrativo é uma decisão unilateral da administração pública. O contencioso administrativo permite impugnar decisões administrativas ilegais perante tribunais especializados.",
      category: "Direito Administrativo"
    }
  ];

  const getRandomTerms = (count = 8) => {
    const shuffled = [...legalGlossary].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const randomTerms = getRandomTerms();

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
              Demonstração de Tooltips
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
              📚 Abrir Glossário Completo
            </button>
            <button 
              onClick={() => window.location.href = '/chat'}
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
              ← Voltar ao Chat
            </button>
          </div>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Introduction */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 1rem 0'
          }}>
            Sistema de Tooltips Jurídicos Contextuais
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '1.6',
            margin: '0 0 1.5rem 0'
          }}>
            Esta funcionalidade detecta automaticamente termos jurídicos no texto e fornece explicações contextuais. 
            Passe o rato sobre os termos sublinhados para ver as definições detalhadas.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>📚</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                {legalGlossary.length} Termos
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                No glossário jurídico
              </div>
            </div>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>⚖️</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                {Object.keys(categoryColors).length} Categorias
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Áreas do direito
              </div>
            </div>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>🎯</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Detecção Automática
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Contextual inteligente
              </div>
            </div>
          </div>
        </div>

        {/* Example Selector */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 1rem 0'
          }}>
            Exemplos Práticos por Área Jurídica
          </h3>
          
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setSelectedExample(index)}
                style={{
                  background: selectedExample === index ? '#2563eb' : '#f3f4f6',
                  color: selectedExample === index ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  borderColor: selectedExample === index ? '#2563eb' : '#d1d5db',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedExample !== index) {
                    e.target.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedExample !== index) {
                    e.target.style.background = '#f3f4f6';
                  }
                }}
              >
                {example.title}
              </button>
            ))}
          </div>

          <div style={{
            background: '#f8fafc',
            border: '2px dashed #cbd5e1',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 1rem 0'
            }}>
              {examples[selectedExample].title}
            </h4>
            <div style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#111827',
              textAlign: 'left',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <TextWithTooltips text={examples[selectedExample].text} />
            </div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '1rem',
              fontStyle: 'italic'
            }}>
              Passe o rato sobre os termos sublinhados para ver as explicações
            </div>
          </div>
        </div>

        {/* Individual Terms Showcase */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 1rem 0'
          }}>
            Termos Jurídicos Destacados
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Selecção aleatória de termos do glossário jurídico com tooltips interactivos
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {randomTerms.map((term, index) => {
              const categoryColor = categoryColors[term.category] || '#6b7280';
              const complexityInfo = complexityLevels[term.complexity] || complexityLevels.moderate;
              
              return (
                <div
                  key={index}
                  style={{
                    background: '#fafafa',
                    border: `1px solid ${categoryColor}40`,
                    borderLeft: `4px solid ${categoryColor}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <LegalTooltip term={term.term}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: categoryColor,
                        cursor: 'help'
                      }}>
                        {term.term}
                      </span>
                    </LegalTooltip>
                    <span style={{ fontSize: '16px' }}>
                      {complexityInfo.icon}
                    </span>
                  </div>
                  
                  <div style={{
                    background: categoryColor,
                    color: 'white',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    display: 'inline-block',
                    marginBottom: '0.5rem'
                  }}>
                    {term.category}
                  </div>
                  
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    {term.definition.substring(0, 80)}...
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Overview */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 1rem 0'
          }}>
            Categorias do Direito Moçambicano
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(categoryColors).map(([category, color], index) => {
              const termCount = legalGlossary.filter(term => term.category === category).length;
              
              return (
                <div
                  key={index}
                  style={{
                    background: '#fafafa',
                    border: `1px solid ${color}40`,
                    borderLeft: `4px solid ${color}`,
                    borderRadius: '8px',
                    padding: '1rem'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: 0
                    }}>
                      {category}
                    </h4>
                    <span style={{
                      background: color,
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {termCount} termos
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legal Glossary Panel */}
      <LegalGlossaryPanel 
        isOpen={showGlossary} 
        onClose={() => setShowGlossary(false)} 
      />
    </div>
  );
}