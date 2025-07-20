import { useState, useEffect } from 'react';
import Head from 'next/head';
import AuthGuard from '../components/AuthGuard';

export default function LegalAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    documentsByType: {},
    documentsByArea: {},
    temporalDistribution: {},
    complexityAnalysis: {},
    citationNetwork: [],
    trendingTopics: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/legal/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MetricCard = ({ title, value, subtitle, color, icon }) => (
    <div style={{
      background: `linear-gradient(135deg, ${color}20, ${color}10)`,
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: `1px solid ${color}30`,
      transition: 'transform 0.2s ease'
    }}
    onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '0.9rem',
          fontWeight: '500',
          margin: 0
        }}>
          {title}
        </h3>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <div style={{
        fontSize: '2rem',
        fontWeight: '700',
        color: color,
        marginBottom: '0.5rem'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.8rem',
        color: '#94a3b8'
      }}>
        {subtitle}
      </div>
    </div>
  );

  const DistributionChart = ({ data, title, color }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: '600',
          marginBottom: '1.5rem'
        }}>
          {title}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(data).map(([key, value]) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                    {key}
                  </span>
                  <span style={{ color: color, fontWeight: '600' }}>
                    {value} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${color}, ${color}80)`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TrendingTopics = ({ topics }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{
        color: 'white',
        fontSize: '1.1rem',
        fontWeight: '600',
        marginBottom: '1.5rem'
      }}>
        🔥 Tópicos em Tendência
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {topics.slice(0, 8).map((topic, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${topic.trend > 0 ? '#10b981' : '#ef4444'}, ${topic.trend > 0 ? '#059669' : '#dc2626'})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: 'white'
              }}>
                {index + 1}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: '500' }}>
                  {topic.name}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  {topic.mentions} menções
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                color: topic.trend > 0 ? '#10b981' : '#ef4444',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {topic.trend > 0 ? '↗' : '↘'} {Math.abs(topic.trend)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ComplexityDistribution = ({ data }) => {
    const complexityColors = {
      'Simples': '#10b981',
      'Moderado': '#f59e0b',
      'Complexo': '#ef4444',
      'Muito Complexo': '#7c3aed'
    };

    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: '600',
          marginBottom: '1.5rem'
        }}>
          🧠 Distribuição de Complexidade
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem'
        }}>
          {Object.entries(data).map(([level, count]) => (
            <div key={level} style={{
              padding: '1rem',
              background: `${complexityColors[level]}20`,
              border: `1px solid ${complexityColors[level]}30`,
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: complexityColors[level],
                marginBottom: '0.5rem'
              }}>
                {count}
              </div>
              <div style={{
                color: '#e2e8f0',
                fontSize: '0.9rem'
              }}>
                {level}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid #10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: 'white', fontSize: '1.1rem' }}>
              A carregar análises legais...
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Head>
        <title>Analytics Legais - Muzaia</title>
        <meta name="description" content="Análises avançadas e métricas da base de conhecimento legal" />
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
              📊 Analytics Legais
            </h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => window.location.href = '/legal-research'}
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
                🔍 Pesquisa Avançada
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

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          {/* Métricas Principais */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <MetricCard
              title="Total de Documentos"
              value={Object.values(analytics.documentsByType).reduce((a, b) => a + b, 0)}
              subtitle="Documentos na base legal"
              color="#10b981"
              icon="📚"
            />
            <MetricCard
              title="Áreas Legais Cobertas"
              value={Object.keys(analytics.documentsByArea).length}
              subtitle="Diferentes áreas do direito"
              color="#3b82f6"
              icon="⚖️"
            />
            <MetricCard
              title="Complexidade Média"
              value="Moderada"
              subtitle="Baseada em análise automática"
              color="#f59e0b"
              icon="🧠"
            />
            <MetricCard
              title="Última Actualização"
              value="Hoje"
              subtitle="Base de dados sincronizada"
              color="#8b5cf6"
              icon="🔄"
            />
          </div>

          {/* Gráficos de Distribuição */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <DistributionChart
              data={analytics.documentsByType}
              title="📋 Distribuição por Tipo de Documento"
              color="#10b981"
            />
            <DistributionChart
              data={analytics.documentsByArea}
              title="⚖️ Distribuição por Área Legal"
              color="#3b82f6"
            />
          </div>

          {/* Análises Avançadas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem'
          }}>
            <ComplexityDistribution data={analytics.complexityAnalysis} />
            <TrendingTopics topics={analytics.trendingTopics} />
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </AuthGuard>
  );
}