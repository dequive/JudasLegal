import { useState } from 'react';

const legalGlossary = [
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
  }
];

const categoryColors = {
  "Direito Constitucional": "#3b82f6",
  "Direito Civil": "#06b6d4",
  "Direito do Trabalho": "#8b5cf6",
  "Direito Penal": "#ef4444",
  "Direito Comercial": "#f59e0b",
  "Direito Administrativo": "#10b981"
};

export default function GlossarioPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(null);

  const categories = ['Todos', ...new Set(legalGlossary.map(term => term.category))];

  const filteredTerms = legalGlossary.filter(term => {
    const matchesCategory = selectedCategory === 'Todos' || term.category === selectedCategory;
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
                ← Voltar ao Chat
              </a>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-2xl font-semibold text-gray-900">Glossário Jurídico</h1>
            </div>
            <div className="text-sm text-gray-500">
              {filteredTerms.length} termo{filteredTerms.length !== 1 ? 's' : ''} encontrado{filteredTerms.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar termo
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite para buscar..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categoria
                </label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredTerms.map(term => (
                <div
                  key={term.term}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTerm(selectedTerm === term.term ? null : term.term)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{term.term}</h3>
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full text-white"
                          style={{ backgroundColor: categoryColors[term.category] || '#6b7280' }}
                        >
                          {term.category}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{term.definition}</p>
                    </div>
                    <div className="ml-4 text-gray-400">
                      {selectedTerm === term.term ? '−' : '+'}
                    </div>
                  </div>

                  {selectedTerm === term.term && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {term.examples && term.examples.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Exemplos:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {term.examples.map((example, index) => (
                              <li key={index} className="text-sm text-gray-600">{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {term.relatedTerms && term.relatedTerms.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Termos relacionados:</h4>
                          <div className="flex flex-wrap gap-2">
                            {term.relatedTerms.map((relatedTerm, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
                              >
                                {relatedTerm}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredTerms.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">📚</div>
                <h3 className="text-gray-900 font-medium mb-1">Nenhum termo encontrado</h3>
                <p className="text-gray-500">Tente ajustar os filtros ou termo de busca.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}