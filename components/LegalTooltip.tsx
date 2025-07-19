import React, { useState, useRef, useEffect } from 'react';
import { findLegalTerm, categoryLabels, LegalTerm } from '@/utils/legalGlossary';

interface LegalTooltipProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

const LegalTooltip: React.FC<LegalTooltipProps> = ({ term, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const legalTerm = findLegalTerm(term);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let top = triggerRect.bottom + 8;
      let left = triggerRect.left;
      
      // Ajustar posição se sair da viewport
      if (left + tooltipRect.width > viewportWidth) {
        left = viewportWidth - tooltipRect.width - 16;
      }
      
      if (top + tooltipRect.height > viewportHeight) {
        top = triggerRect.top - tooltipRect.height - 8;
      }
      
      setPosition({ top, left });
    }
  }, [isVisible]);

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
        ref={triggerRef}
        className={`relative cursor-help border-b border-dotted border-blue-500 hover:border-blue-700 ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        role="button"
        aria-describedby={`tooltip-${term.replace(/\s+/g, '-')}`}
      >
        {children}
      </span>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          id={`tooltip-${term.replace(/\s+/g, '-')}`}
          className="fixed z-50 max-w-sm p-4 bg-white border border-gray-300 rounded-lg shadow-lg"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
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