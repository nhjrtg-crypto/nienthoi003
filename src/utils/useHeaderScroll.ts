import { useState, useEffect, useRef } from 'react';

interface UseHeaderScrollOptions {
  threshold?: number;
  delta?: number;
}

/**
 * Auto-hiding header hook:
 * Hides header when scrolling down past threshold, reveals when scrolling up.
 * Uses an anchor-based directional accumulator so that even small, continuous
 * scroll events (mouse wheel, touchpad, mobile touch) accumulate distance and trigger reliably.
 */
export function useHeaderScroll(options: UseHeaderScrollOptions = {}) {
  const { threshold = 30, delta = 8 } = options;
  const [isVisible, setIsVisible] = useState(true);
  const prevScrollY = useRef(0);
  const anchorY = useRef(0);
  const currentDirection = useRef<'down' | 'up' | 'none'>('none');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(
        0,
        typeof window !== 'undefined'
          ? window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
          : 0
      );

      // Always show when near the top of the page
      if (currentScrollY <= threshold) {
        setIsVisible(true);
        prevScrollY.current = currentScrollY;
        anchorY.current = currentScrollY;
        currentDirection.current = 'none';
        return;
      }

      const diff = currentScrollY - prevScrollY.current;
      if (diff === 0) return;

      const newDir: 'down' | 'up' = diff > 0 ? 'down' : 'up';

      // If user flipped direction, reset our anchor point
      if (newDir !== currentDirection.current) {
        currentDirection.current = newDir;
        anchorY.current = currentScrollY;
      }

      // Check distance accumulated since the last direction turn
      if (currentDirection.current === 'down') {
        if (currentScrollY - anchorY.current >= delta) {
          setIsVisible(false);
        }
      } else if (currentDirection.current === 'up') {
        if (anchorY.current - currentScrollY >= delta) {
          setIsVisible(true);
        }
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, delta]);

  return isVisible;
}

