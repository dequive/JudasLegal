import { useState, useRef, useEffect } from 'react';
import { legalGlossary, categoryColors, complexityLevels } from '../data/legal-glossary';

const LegalTooltip = ({ term, children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  // Find term definition in glossary
  const termData = legalGlossary.find(
    item => item.term.toLowerCase() === term.toLowerCase()
  );

  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current && tooltipRef.current && isVisible) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = triggerRect.bottom + 8;
        let left = triggerRect.left;

        // Adjust horizontal position if tooltip goes off-screen
        if (left + tooltipRect.width > viewportWidth - 20) {
          left = viewportWidth - tooltipRect.width - 20;
        }
        if (left < 20) {
          left = 20;
        }

        // Adjust vertical position if tooltip goes off-screen
        if (top + tooltipRect.height > viewportHeight - 20) {
          top = triggerRect.top - tooltipRect.height - 8;
        }

        setPosition({ top, left });
      }
    };

    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible]);

  const handleMouseEnter = () => {
    if (termData) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsVisible(!isVisible);
    } else if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  if (!termData) {
    return <span className={className}>{children || term}</span>;
  }

  const categoryColor = categoryColors[termData.category] || '#6b7280';
  const complexityInfo = complexityLevels[termData.complexity] || complexityLevels.moderate;

  return (
    <>
      <span
        ref={triggerRef}
        className={`legal-tooltip-trigger ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-describedby={`tooltip-${term}`}
        style={{
          borderBottom: `2px dotted ${categoryColor}`,
          cursor: 'help',
          position: 'relative',
          color: categoryColor,
          fontWeight: '500'
        }}
      >
        {children || term}
      </span>

      {isVisible && (
        <>
          {/* Backdrop for mobile */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.1)',
              zIndex: 998
            }}
            onClick={() => setIsVisible(false)}
          />
          
          {/* Tooltip */}
          <div
            ref={tooltipRef}
            id={`tooltip-${term}`}
            role="tooltip"
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: `${position.left}px`,
              background: 'white',
              border: `2px solid ${categoryColor}`,
              borderRadius: '12px',
              padding: '1rem',
              maxWidth: '320px',
              width: 'max-content',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              zIndex: 999,
              fontSize: '14px',
              lineHeight: '1.5',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <h4 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {termData.term}
                </h4>
                <span style={{
                  fontSize: '16px'
                }}>
                  {complexityInfo.icon}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  background: categoryColor,
                  color: 'white',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  {termData.category}
                </span>
                <span style={{
                  background: complexityInfo.color + '20',
                  color: complexityInfo.color,
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  border: `1px solid ${complexityInfo.color}40`
                }}>
                  {complexityInfo.label}
                </span>
              </div>
            </div>

            {/* Definition */}
            <p style={{
              margin: '0 0 0.75rem 0',
              color: '#374151',
              fontSize: '14px'
            }}>
              {termData.definition}
            </p>

            {/* Example */}
            {termData.example && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '0.75rem'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Exemplo:
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#4b5563',
                  fontStyle: 'italic'
                }}>
                  {termData.example}
                </div>
              </div>
            )}

            {/* Related Terms */}
            {termData.relatedTerms && termData.relatedTerms.length > 0 && (
              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Termos relacionados:
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.25rem'
                }}>
                  {termData.relatedTerms.map((relatedTerm, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#f3f4f6',
                        color: '#6b7280',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '6px',
                        fontSize: '11px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      {relatedTerm}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Close button for accessibility */}
            <button
              onClick={() => setIsVisible(false)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '16px',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
              aria-label="Fechar tooltip"
            >
              ×
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default LegalTooltip;