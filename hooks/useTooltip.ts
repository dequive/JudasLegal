import { useState, useRef, useEffect, useCallback } from 'react';

interface TooltipPosition {
  top: number;
  left: number;
}

export const useTooltip = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleTooltipClick = useCallback((term: string, event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    if (activeTooltip === term) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip(term);
      
      // Calcular posição do tooltip
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let top = rect.bottom + window.scrollY + 8;
      let left = rect.left + rect.width / 2;
      
      // Ajustar se sair da viewport
      if (left > viewportWidth - 160) {
        left = viewportWidth - 320 - 16;
      } else {
        left = Math.max(16, left - 160);
      }
      
      if (top + 200 > viewportHeight + window.scrollY) {
        top = rect.top + window.scrollY - 200 - 8;
      }
      
      setTooltipPosition({ top, left });
    }
  }, [activeTooltip]);

  const closeTooltip = useCallback(() => {
    setActiveTooltip(null);
  }, []);

  const handleKeyDown = useCallback((term: string, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleTooltipClick(term, event);
    } else if (event.key === 'Escape') {
      closeTooltip();
    }
  }, [handleTooltipClick, closeTooltip]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setActiveTooltip(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveTooltip(null);
      }
    };

    if (activeTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeTooltip]);

  return {
    activeTooltip,
    tooltipPosition,
    tooltipRef,
    handleTooltipClick,
    handleKeyDown,
    closeTooltip
  };
};