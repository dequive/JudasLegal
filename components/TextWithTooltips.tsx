import React from 'react';
import LegalTooltip from './LegalTooltip';
import { detectLegalTerms, findLegalTerm } from '@/utils/legalGlossary';

interface TextWithTooltipsProps {
  text: string;
  className?: string;
}

const TextWithTooltips: React.FC<TextWithTooltipsProps> = ({ text, className = '' }) => {
  // Detectar termos legais no texto
  const detectedTerms = detectLegalTerms(text);
  
  if (detectedTerms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Criar regex para encontrar todos os termos detectados
  const termsPattern = detectedTerms
    .sort((a, b) => b.length - a.length) // Ordenar por comprimento para evitar substituições parciais
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escapar caracteres especiais
    .join('|');
  
  const regex = new RegExp(`\\b(${termsPattern})\\b`, 'gi');
  
  // Dividir o texto em partes, mantendo os termos detectados
  const parts = text.split(regex);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        const matchedTerm = detectedTerms.find(term => 
          term.toLowerCase() === lowerPart || 
          findLegalTerm(term)?.relatedTerms?.some(related => 
            related.toLowerCase() === lowerPart
          )
        );
        
        if (matchedTerm && findLegalTerm(matchedTerm)) {
          return (
            <LegalTooltip key={index} term={matchedTerm}>
              {part}
            </LegalTooltip>
          );
        }
        
        return part;
      })}
    </span>
  );
};

export default TextWithTooltips;