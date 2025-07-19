interface Citation {
  id: number;
  title: string;
  source: string;
  law_type: string;
  article_number?: string;
  relevance_score: number;
}

interface CitationCardProps {
  citation: Citation;
}

export default function CitationCard({ citation }: CitationCardProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'constituição':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'código penal':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lei do trabalho':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'código civil':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'lei da família':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRelevanceText = (score: number) => {
    if (score >= 0.8) return 'Alta relevância';
    if (score >= 0.6) return 'Média relevância';
    if (score >= 0.4) return 'Baixa relevância';
    return 'Mencionado';
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm mb-1">
            {citation.title}
          </h4>
          <p className="text-xs text-gray-600 mb-2">
            {citation.source}
          </p>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(citation.law_type)}`}>
            {citation.law_type}
          </span>
          
          {citation.relevance_score && (
            <span className="text-xs text-gray-500">
              {getRelevanceText(citation.relevance_score)}
            </span>
          )}
        </div>
      </div>
      
      {citation.article_number && (
        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
          </svg>
          <span>Artigo(s): {citation.article_number}</span>
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Fonte verificada</span>
        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
