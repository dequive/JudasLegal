import LegalTooltip from './LegalTooltip';
import { legalGlossary } from '../data/legal-glossary';

const TextWithTooltips = ({ text, className = "" }) => {
  if (!text || typeof text !== 'string') {
    return <span className={className}>{text}</span>;
  }

  // Create a map of terms for efficient lookup
  const termMap = new Map();
  legalGlossary.forEach(item => {
    termMap.set(item.term.toLowerCase(), item.term);
  });

  // Function to find and replace legal terms with tooltips
  const processText = (inputText) => {
    let processedText = inputText;
    const termPositions = [];

    // Find all legal terms in the text
    termMap.forEach((originalTerm, lowerTerm) => {
      const regex = new RegExp(`\\b${lowerTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(inputText)) !== null) {
        termPositions.push({
          start: match.index,
          end: match.index + match[0].length,
          term: originalTerm,
          matchedText: match[0]
        });
      }
    });

    // Sort by position to avoid conflicts
    termPositions.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (keep the first one)
    const filteredPositions = [];
    let lastEnd = -1;
    
    termPositions.forEach(pos => {
      if (pos.start >= lastEnd) {
        filteredPositions.push(pos);
        lastEnd = pos.end;
      }
    });

    if (filteredPositions.length === 0) {
      return [inputText];
    }

    // Build the result array with text and tooltip components
    const result = [];
    let currentIndex = 0;

    filteredPositions.forEach((pos, index) => {
      // Add text before the term
      if (pos.start > currentIndex) {
        result.push(inputText.slice(currentIndex, pos.start));
      }

      // Add the tooltip component
      result.push(
        <LegalTooltip 
          key={`tooltip-${index}-${pos.term}`} 
          term={pos.term}
        >
          {pos.matchedText}
        </LegalTooltip>
      );

      currentIndex = pos.end;
    });

    // Add remaining text
    if (currentIndex < inputText.length) {
      result.push(inputText.slice(currentIndex));
    }

    return result;
  };

  const processedContent = processText(text);

  return (
    <span className={className}>
      {processedContent.map((item, index) => 
        typeof item === 'string' ? item : <span key={index}>{item}</span>
      )}
    </span>
  );
};

export default TextWithTooltips;