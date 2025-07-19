import React, { createContext, useContext, ReactNode } from 'react';
import { useTooltip } from '@/hooks/useTooltip';

interface TooltipContextType {
  activeTooltip: string | null;
  tooltipPosition: { top: number; left: number };
  tooltipRef: React.RefObject<HTMLDivElement>;
  handleTooltipClick: (term: string, event: React.MouseEvent | React.KeyboardEvent) => void;
  handleKeyDown: (term: string, event: React.KeyboardEvent) => void;
  closeTooltip: () => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

interface TooltipProviderProps {
  children: ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  const tooltipState = useTooltip();
  
  return (
    <TooltipContext.Provider value={tooltipState}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltipContext = (): TooltipContextType => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltipContext deve ser usado dentro do TooltipProvider');
  }
  return context;
};