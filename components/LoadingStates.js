import React from 'react';

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`spinner ${sizeClasses[size]} ${className}`} />
  );
};

// Loading Skeleton Component
export const LoadingSkeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  lines = 1 
}) => {
  const skeletons = Array.from({ length: lines }, (_, i) => (
    <div 
      key={i} 
      className={`loading-skeleton ${width} ${height} ${className} ${i > 0 ? 'mt-2' : ''}`} 
    />
  ));

  return lines === 1 ? skeletons[0] : <div>{skeletons}</div>;
};

// Loading Pulse Component
export const LoadingPulse = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}) => (
  <div className={`loading-pulse ${width} ${height} ${className}`} />
);

// Chat Message Loading
export const ChatMessageLoading = () => (
  <div className="message message-assistant">
    <div className="message-content">
      <LoadingSkeleton lines={3} height="h-3" className="mb-2" />
      <LoadingSkeleton width="w-3/4" height="h-3" />
    </div>
  </div>
);

// Card Loading
export const CardLoading = () => (
  <div className="card">
    <div className="card-body">
      <LoadingSkeleton height="h-6" className="mb-4" />
      <LoadingSkeleton lines={3} height="h-4" className="mb-2" />
      <LoadingSkeleton width="w-24" height="h-8" />
    </div>
  </div>
);

export default LoadingSpinner;