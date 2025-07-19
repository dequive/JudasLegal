import React from 'react';
import { findLegalTerm, categoryLabels, LegalTerm } from '@/utils/legalGlossary';
import { useTooltipContext } from '@/contexts/TooltipContext';

interface LegalTooltipProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

const LegalTooltip: React.FC<LegalTooltipProps> = ({ term, children, className = '' }) => {
  const { 
    activeTooltip, 
    tooltipPosition, 
    tooltipRef, 
    handleTooltipClick, 
    handleKeyDown 
  } = useTooltipContext();
  
  const legalTerm = findLegalTerm(term);
  const isVisible = activeTooltip === term;



  if (!legalTerm) {
    return <>{children}</>;
  }

  const getCategoryColor = (category: LegalTerm['category']) => {
    const colors = {
      'civil': 'bg-blue-100 text-blue-800',
      'penal': 'bg-red-100 text-red-800',
      'trabalho': 'bg-green-100 text-green-800',
      'comercial': 'bg-purple-100 text-purple-800',
      'constitucional': 'bg-yellow-100 text-yellow-800',
      'processual': 'bg-indigo-100 text-indigo-800',
      'familiar': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <span
        className={`relative cursor-help border-b border-dotted border-blue-500 hover:border-blue-700 hover:bg-blue-50 px-1 rounded-sm transition-all duration-200 ${isVisible ? 'bg-blue-100 border-blue-700' : ''} ${className}`}
        onClick={(e) => handleTooltipClick(term, e)}
        onKeyDown={(e) => handleKeyDown(term, e)}
        tabIndex={0}
        role="button"
        aria-label={`Explicação do termo legal: ${term}`}
        aria-expanded={isVisible}
        aria-describedby={isVisible ? `tooltip-${term.replace(/\s+/g, '-')}` : undefined}
      >
        {children}
      </span>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          id={`tooltip-${term.replace(/\s+/g, '-')}`}
          className="fixed z-50 max-w-sm p-4 bg-white border border-gray-300 rounded-lg shadow-lg"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          role="tooltip"
        >
          <div className="space-y-3">
            {/* Cabeçalho do termo */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 capitalize">
                {legalTerm.term}
              </h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(legalTerm.category)}`}>
                {categoryLabels[legalTerm.category]}
              </span>
            </div>
            
            {/* Definição */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {legalTerm.definition}
            </p>
            
            {/* Exemplos */}
            {legalTerm.examples && legalTerm.examples.length > 0 && (
              <div className="space-y-1">
                <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Exemplos:
                </h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  {legalTerm.examples.map((example, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-1">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Termos relacionados */}
            {legalTerm.relatedTerms && legalTerm.relatedTerms.length > 0 && (
              <div className="space-y-1">
                <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Termos relacionados:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {legalTerm.relatedTerms.map((related, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                    >
                      {related}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Seta do tooltip */}
          <div className="absolute top-0 left-4 transform -translate-y-full">
            <div className="border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-300"></div>
            <div className="absolute top-1 left-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default LegalTooltip;