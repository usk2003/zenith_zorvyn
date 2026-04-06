import React, { useState, useEffect } from 'react';

/**
 * A simple hook to simulate an initial data fetch delay for showing skeleton screens.
 * Refines the "pattern" of a real-world application.
 */
const useInitialLoading = (delay = 800) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isLoading;
};

export default useInitialLoading;
