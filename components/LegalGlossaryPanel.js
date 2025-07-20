import { useState, useMemo } from 'react';
import { legalGlossary, categoryColors, complexityLevels } from '../data/legal-glossary';
import LegalTooltip from './LegalTooltip';

const LegalGlossaryPanel = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedComplexity, setSelectedComplexity] = useState('Todos');

  // Get unique categories and complexity levels
  const categories = ['Todos', ...new Set(legalGlossary.map(term => term.category))];
  const complexities = ['Todos', ...Object.keys(complexityLevels)];

  // Filter terms based on search and filters
  const filteredTerms = useMemo(() => {
    return legalGlossary.filter(term => {
      const matchesSearch = 
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Todos' || term.category === selectedCategory;
      const matchesComplexity = selectedComplexity === 'Todos' || term.complexity === selectedComplexity;
      
      return matchesSearch && matchesCategory && matchesComplexity;
    });
  }, [searchTerm, selectedCategory, selectedComplexity]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998
        }}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '800px',
          height: '85%',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          background: '#fafafa'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827'
            }}>
              Glossário Jurídico Moçambicano
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '24px',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Fechar glossário"
            >
              ×
            </button>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Pesquisar termos jurídicos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
              }}
            />
          </div>

          {/* Filters */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Complexidade
              </label>
              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              >
                <option value="Todos">Todos</option>
                {Object.entries(complexityLevels).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.icon} {value.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div style={{
            marginTop: '1rem',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            {filteredTerms.length} termo{filteredTerms.length !== 1 ? 's' : ''} encontrado{filteredTerms.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Terms List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem'
        }}>
          {filteredTerms.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📚</div>
              <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '0.5rem' }}>
                Nenhum termo encontrado
              </div>
              <div style={{ fontSize: '14px' }}>
                Tente ajustar os filtros ou termo de pesquisa
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {filteredTerms.map((term, index) => {
                const categoryColor = categoryColors[term.category] || '#6b7280';
                const complexityInfo = complexityLevels[term.complexity] || complexityLevels.moderate;
                
                return (
                  <div
                    key={index}
                    style={{
                      background: 'white',
                      border: `1px solid ${categoryColor}20`,
                      borderLeft: `4px solid ${categoryColor}`,
                      borderRadius: '8px',
                      padding: '1.25rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      e.target.style.borderColor = categoryColor + '40';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = categoryColor + '20';
                    }}
                  >
                    {/* Term header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem'
                    }}>
                      <LegalTooltip term={term.term}>
                        <h3 style={{
                          margin: 0,
                          fontSize: '18px',
                          fontWeight: '600',
                          color: categoryColor,
                          cursor: 'help'
                        }}>
                          {term.term}
                        </h3>
                      </LegalTooltip>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{
                          background: complexityInfo.color + '20',
                          color: complexityInfo.color,
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {complexityInfo.icon} {complexityInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <div style={{
                      background: categoryColor,
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'inline-block',
                      marginBottom: '0.75rem'
                    }}>
                      {term.category}
                    </div>

                    {/* Definition */}
                    <p style={{
                      margin: '0 0 0.75rem 0',
                      color: '#374151',
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}>
                      {term.definition}
                    </p>

                    {/* Example */}
                    {term.example && (
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '0.75rem',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6b7280',
                          marginBottom: '0.25rem'
                        }}>
                          Exemplo:
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#4b5563',
                          fontStyle: 'italic'
                        }}>
                          {term.example}
                        </div>
                      </div>
                    )}

                    {/* Related terms */}
                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6b7280',
                          marginBottom: '0.5rem'
                        }}>
                          Termos relacionados:
                        </div>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.25rem'
                        }}>
                          {term.relatedTerms.map((relatedTerm, relIndex) => (
                            <span
                              key={relIndex}
                              style={{
                                background: '#f3f4f6',
                                color: '#6b7280',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '8px',
                                fontSize: '11px',
                                border: '1px solid #e5e7eb'
                              }}
                            >
                              {relatedTerm}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LegalGlossaryPanel;