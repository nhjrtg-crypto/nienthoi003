import { useState, useEffect, useRef } from 'react';

interface UseHeaderScrollOptions {
  threshold?: number;
  delta?: number;
}

/**
 * Auto-hiding header hook:
 * Hides header when scrolling down past threshold, reveals when scrolling up or near top.
 */
export function useHeaderScroll(options: UseHeaderScrollOptions = {}) {
  const { threshold = 40, delta = 6 } = options;
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when near the top of the page
      if (currentScrollY <= threshold) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + delta) {
        // Scrolling DOWN -> hide header
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - delta) {
        // Scrolling UP -> reveal header
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, delta]);

  return isVisible;
}
