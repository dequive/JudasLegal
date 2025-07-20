import { useState } from 'react';

interface LegalTerm {
  term: string;
  definition: string;
  category: string;
  examples: string[];
  relatedTerms: string[];
}

const legalGlossary: LegalTerm[] = [
  {
    term: "Habeas Corpus",
    definition: "Ação constitucional que protege o direito de locomoção, garantindo que ninguém seja privado de sua liberdade sem o devido processo legal.",
    category: "Direito Constitucional",
    examples: ["Prisão ilegal", "Constrangimento ilegal", "Ameaça à liberdade de locomoção"],
    relatedTerms: ["Devido Processo Legal", "Mandado de Segurança", "Liberdade Individual"]
  },
  {
    term: "Usucapião",
    definition: "Forma de aquisição da propriedade através da posse prolongada de um bem, exercida de forma mansa, pacífica e com animus domini.",
    category: "Direito Civil",
    examples: ["Posse de terreno por 15 anos", "Ocupação de imóvel abandonado", "Cultivo de terra rural"],
    relatedTerms: ["Posse", "Propriedade", "Prescrição Aquisitiva"]
  },
  {
    term: "Mandado de Segurança",
    definition: "Ação constitucional para proteger direito líquido e certo quando ameaçado ou violado por ato de autoridade pública.",
    category: "Direito Constitucional",
    examples: ["Ilegalidade em concurso público", "Cobrança indevida de taxa", "Violação de direito funcional"],
    relatedTerms: ["Direito Líquido e Certo", "Ato de Autoridade", "Habeas Corpus"]
  },
  {
    term: "Danos Morais",
    definition: "Lesão de aspectos não patrimoniais da esfera jurídica de uma pessoa, causando dor, sofrimento, humilhação ou abalo à reputação.",
    category: "Direito Civil",
    examples: ["Ofensas à honra", "Exposição vexatória", "Discriminação injusta"],
    relatedTerms: ["Responsabilidade Civil", "Danos Materiais", "Indenização"]
  },
  {
    term: "Rescisão do Contrato de Trabalho",
    definition: "Término da relação de emprego por iniciativa do empregador, com pagamento de todas as verbas rescisórias devidas ao trabalhador.",
    category: "Direito do Trabalho",
    examples: ["Demissão sem justa causa", "Demissão por justa causa", "Rescisão indireta"],
    relatedTerms: ["FGTS", "Aviso Prévio", "Seguro Desemprego"]
  },
  {
    term: "Legítima Defesa",
    definition: "Excludente de ilicitude que permite o uso da força necessária para repelir injusta agressão, atual ou iminente, a direito próprio ou de terceiro.",
    category: "Direito Penal",
    examples: ["Defesa contra assalto", "Proteção da família", "Defesa da propriedade"],
    relatedTerms: ["Estado de Necessidade", "Estrito Cumprimento do Dever Legal", "Exercício Regular de Direito"]
  },
  {
    term: "Sociedade Limitada",
    definition: "Tipo societário em que a responsabilidade dos sócios é limitada ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social.",
    category: "Direito Empresarial",
    examples: ["Empresa familiar", "Negócio entre amigos", "Startup iniciante"],
    relatedTerms: ["Capital Social", "Quotas", "Responsabilidade Limitada"]
  },
  {
    term: "Inventário",
    definition: "Procedimento judicial ou extrajudicial para apuração dos bens deixados pelo falecido e sua partilha entre os herdeiros.",
    category: "Direito das Sucessões",
    examples: ["Morte com testamento", "Morte sem testamento", "Herança com menores"],
    relatedTerms: ["Herança", "Testamento", "Meação"]
  }
];

const categories = Array.from(new Set(legalGlossary.map(term => term.category))).sort();
const categoryColors: { [key: string]: string } = {
  "Direito Constitucional": "#10b981",
  "Direito Civil": "#3b82f6", 
  "Direito Penal": "#ef4444",
  "Direito do Trabalho": "#f59e0b",
  "Direito Empresarial": "#8b5cf6",
  "Direito das Sucessões": "#06b6d4"
};

export default function GlossarioPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<LegalTerm | null>(null);

  const filteredTerms = legalGlossary.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #4338ca 100%)',
      padding: '2rem'
    }}>
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1 style={{ 
            color: 'white',
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(45deg, #10b981, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            📚 Glossário Jurídico Moçambicano
          </h1>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ← Voltar
          </button>
        </div>
        
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', margin: 0 }}>
          Termos jurídicos explicados em linguagem simples e acessível
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: selectedTerm ? '1fr 1fr' : '1fr',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Lista de Termos */}
        <div>
          {/* Filtros */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Pesquisar termo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: 'white',
                fontSize: '1rem',
                marginBottom: '1rem',
                outline: 'none'
              }}
            />

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedCategory('')}
                style={{
                  background: selectedCategory === '' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Todas
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    background: selectedCategory === category ? categoryColors[category] + '40' : 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${categoryColors[category] || 'rgba(255, 255, 255, 0.2)'}`,
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            <div style={{ 
              marginTop: '1rem', 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.9rem' 
            }}>
              {filteredTerms.length} {filteredTerms.length === 1 ? 'termo encontrado' : 'termos encontrados'}
            </div>
          </div>

          {/* Terms List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredTerms.map((term, index) => (
              <div
                key={index}
                onClick={() => setSelectedTerm(term)}
                style={{
                  background: selectedTerm?.term === term.term 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${selectedTerm?.term === term.term 
                    ? (categoryColors[term.category] || 'rgba(255, 255, 255, 0.3)')
                    : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: selectedTerm?.term === term.term ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                  <h3 style={{ 
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    {term.term}
                  </h3>
                  <span style={{
                    background: categoryColors[term.category] || '#6b7280',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}>
                    {term.category}
                  </span>
                </div>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {term.definition.length > 150 
                    ? term.definition.substring(0, 150) + '...' 
                    : term.definition}
                </p>
                {selectedTerm?.term !== term.term && (
                  <div style={{
                    marginTop: '0.75rem',
                    fontSize: '0.85rem',
                    color: categoryColors[term.category] || '#6b7280'
                  }}>
                    Clique para ver detalhes →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detalhes do Termo Selecionado */}
        {selectedTerm && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: `2px solid ${categoryColors[selectedTerm.category] || 'rgba(255, 255, 255, 0.2)'}`,
            borderRadius: '16px',
            padding: '2rem',
            position: 'sticky',
            top: '2rem',
            height: 'fit-content'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ 
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  margin: '0 0 0.5rem 0'
                }}>
                  {selectedTerm.term}
                </h2>
                <span style={{
                  background: categoryColors[selectedTerm.category] || '#6b7280',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '16px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {selectedTerm.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedTerm(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {/* Definition */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                📖 Definição
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                {selectedTerm.definition}
              </p>
            </div>

            {/* Examples */}
            {selectedTerm.examples.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                  💡 Exemplos de Aplicação
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {selectedTerm.examples.map((example, index) => (
                    <li key={index} style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '0.5rem',
                      lineHeight: '1.5'
                    }}>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Terms */}
            {selectedTerm.relatedTerms.length > 0 && (
              <div>
                <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                  🔗 Termos Relacionados
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedTerm.relatedTerms.map((relatedTerm, index) => {
                    const foundTerm = legalGlossary.find(t => t.term === relatedTerm);
                    return (
                      <button
                        key={index}
                        onClick={() => foundTerm && setSelectedTerm(foundTerm)}
                        style={{
                          background: foundTerm 
                            ? `${categoryColors[foundTerm.category] || '#6b7280'}20`
                            : 'rgba(255, 255, 255, 0.1)',
                          border: foundTerm 
                            ? `1px solid ${categoryColors[foundTerm.category] || '#6b7280'}`
                            : '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '16px',
                          cursor: foundTerm ? 'pointer' : 'default',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {relatedTerm}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}