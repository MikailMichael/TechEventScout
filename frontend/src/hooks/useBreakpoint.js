import { useState, useEffect } from 'react';

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint(window.innerWidth));

  function getBreakpoint(width) {
    if (width >= 1536) return '2xl';
    if (width >= 1280) return 'xl';
    if (width >= 1024) return 'lg';
    if (width >= 768) return 'md';
    return 'sm';
  }

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

export default useBreakpoint;