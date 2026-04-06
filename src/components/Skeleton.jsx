import React from 'react';

/**
 * A reusable primitive for building pulse-animated loading states.
 */
const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-800 transition-colors";
  const roundedClass = variant === 'circle' ? 'rounded-full' : 'rounded-xl';
  
  return (
    <div className={`${baseClasses} ${roundedClass} ${className}`} aria-hidden="true" />
  );
};

export default Skeleton;
