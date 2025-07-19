import React, { useState } from 'react';
import { legalGlossary, getTermsByCategory, categoryLabels, LegalTerm } from '@/utils/legalGlossary';

interface LegalGlossaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalGlossaryPanel: React.FC<LegalGlossaryPanelProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<LegalTerm['category'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = legalGlossary.filter(term => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.relatedTerms?.some(related => related.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: LegalTerm['category']) => {
    const colors = {
      'civil': 'bg-blue-100 text-blue-800 border-blue-200',
      'penal': 'bg-red-100 text-red-800 border-red-200',
      'trabalho': 'bg-green-100 text-green-800 border-green-200',
      'comercial': 'bg-purple-100 text-purple-800 border-purple-200',
      'constitucional': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'processual': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'familiar': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Glossário Jurídico
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Explicações de termos legais moçambicanos
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filtros */}
          <div className="p-6 border-b border-gray-200 space-y-4">
            {/* Busca */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar termo
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite um termo jurídico..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtro por categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Todas
                </button>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as LegalTerm['category'])}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedCategory === key
                        ? getCategoryColor(key as LegalTerm['category'])
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de termos */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {filteredTerms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum termo encontrado.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Tente ajustar os filtros ou termo de busca.
                  </p>
                </div>
              ) : (
                filteredTerms.map((term, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {term.term}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(term.category)}`}>
                        {categoryLabels[term.category]}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {term.definition}
                    </p>
                    
                    {term.examples && term.examples.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                          Exemplos:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {term.examples.map((example, exIndex) => (
                            <li key={exIndex} className="flex items-start">
                              <span className="text-gray-400 mr-1">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                          Termos relacionados:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {term.relatedTerms.map((related, relIndex) => (
                            <span
                              key={relIndex}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                            >
                              {related}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Rodapé */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              {filteredTerms.length} de {legalGlossary.length} termos exibidos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalGlossaryPanel;