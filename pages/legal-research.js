import { useState, useEffect } from 'react';
import Head from 'next/head';
import AuthGuard from '../components/AuthGuard';

export default function LegalResearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    documentType: '',
    legalArea: '',
    dateRange: '',
    relevanceThreshold: 0.7
  });
  const [documentTypes, setDocumentTypes] = useState({});
  const [legalAreas, setLegalAreas] = useState({});

  useEffect(() => {
    // Carregar hierarquia legal
    fetch('http://localhost:8000/api/legal/hierarchy')
      .then(res => res.json())
      .then(data => {
        setDocumentTypes(data.document_types || {});
        setLegalAreas(data.legal_areas || {});
      })
      .catch(console.error);
  }, []);

  const handleAdvancedSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:8000/api/legal/advanced-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          filters: filters,
          max_results: 10
        })
      });
      
      const results = await response.json();
      setSearchResults(results.documents || []);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AuthGuard>
      <Head>
        <title>Pesquisa Legal Avançada - Muzaia</title>
        <meta name="description" content="Ferramenta de pesquisa avançada em documentos legais moçambicanos" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Header */}
        <header style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '1rem 2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              margin: 0
            }}>
              🔍 Pesquisa Legal Avançada
            </h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => window.location.href = '/chat'}
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                💬 Chat Legal
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                🏠 Dashboard
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: '350px 1fr',
          gap: '2rem'
        }}>
          {/* Painel de Filtros */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            height: 'fit-content'
          }}>
            <h3 style={{
              color: 'white',
              marginBottom: '1.5rem',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              🎯 Filtros Avançados
            </h3>

            {/* Tipo de Documento */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                📋 Tipo de Documento
              </label>
              <select
                value={filters.documentType}
                onChange={(e) => handleFilterChange('documentType', e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">Todos os tipos</option>
                {Object.entries(documentTypes).map(([key, value]) => (
                  <option key={key} value={key} style={{ background: '#1e293b' }}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            {/* Área Legal */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                ⚖️ Área Legal
              </label>
              <select
                value={filters.legalArea}
                onChange={(e) => handleFilterChange('legalArea', e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">Todas as áreas</option>
                {Object.entries(legalAreas).map(([key, value]) => (
                  <option key={key} value={key} style={{ background: '#1e293b' }}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            {/* Nível de Relevância */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                🎯 Relevância Mínima: {Math.round(filters.relevanceThreshold * 100)}%
              </label>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.1"
                value={filters.relevanceThreshold}
                onChange={(e) => handleFilterChange('relevanceThreshold', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#10b981'
                }}
              />
            </div>
          </div>

          {/* Área de Pesquisa e Resultados */}
          <div>
            {/* Barra de Pesquisa */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdvancedSearch()}
                  placeholder="Pesquisar documentos legais... (ex: direitos do trabalhador, propriedade intelectual)"
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem'
                  }}
                />
                <button
                  onClick={handleAdvancedSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  style={{
                    background: isSearching ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isSearching ? 'not-allowed' : 'pointer',
                    minWidth: '120px'
                  }}
                >
                  {isSearching ? '🔄 A pesquisar...' : '🔍 Pesquisar'}
                </button>
              </div>
            </div>

            {/* Resultados da Pesquisa */}
            <div>
              {searchResults.length > 0 && (
                <div style={{
                  marginBottom: '1rem',
                  color: '#e2e8f0',
                  fontSize: '0.9rem'
                }}>
                  📊 {searchResults.length} documento(s) encontrado(s)
                </div>
              )}

              {searchResults.map((doc, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    marginBottom: '1rem',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      margin: 0,
                      flex: 1
                    }}>
                      {doc.title}
                    </h4>
                    <div style={{
                      background: `linear-gradient(135deg, ${doc.relevance_score > 0.8 ? '#10b981' : doc.relevance_score > 0.6 ? '#f59e0b' : '#ef4444'}, ${doc.relevance_score > 0.8 ? '#059669' : doc.relevance_score > 0.6 ? '#d97706' : '#dc2626'})`,
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      marginLeft: '1rem'
                    }}>
                      {Math.round(doc.relevance_score * 100)}% relevância
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <span style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#3b82f6',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      📋 {documentTypes[doc.document_type] || 'N/A'}
                    </span>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      ⚖️ {legalAreas[doc.legal_area] || 'N/A'}
                    </span>
                  </div>

                  <p style={{
                    color: '#cbd5e1',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    margin: '0 0 1rem 0'
                  }}>
                    {doc.description || 'Descrição não disponível'}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      color: '#94a3b8',
                      fontSize: '0.8rem'
                    }}>
                      📅 {doc.date_published ? new Date(doc.date_published).toLocaleDateString('pt-PT') : 'Data não disponível'}
                    </div>
                    <button
                      onClick={() => {
                        // Abrir detalhes do documento ou chat com contexto
                        window.location.href = `/chat?document_id=${doc.id}`;
                      }}
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      💬 Discutir este documento
                    </button>
                  </div>
                </div>
              ))}

              {searchResults.length === 0 && searchQuery && !isSearching && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#fca5a5'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>Nenhum documento encontrado</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    Tente alterar os vossos critérios de pesquisa ou filtros.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}