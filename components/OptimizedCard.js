import React from 'react';

const OptimizedCard = ({ 
  children, 
  className = '', 
  hover = true,
  glass = false,
  ...props 
}) => {
  const baseClasses = 'card';
  const hoverClasses = hover ? 'hover:shadow-md hover:-translate-y-1' : '';
  const glassClasses = glass ? 'glass' : '';

  const classes = [
    baseClasses,
    hoverClasses,
    glassClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

OptimizedCard.Header = CardHeader;
OptimizedCard.Body = CardBody;
OptimizedCard.Footer = CardFooter;

export default OptimizedCard;