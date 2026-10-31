'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up';
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    const currentEl = domRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, []);

  const getHiddenStyles = (): React.CSSProperties => {
    switch (animation) {
      case 'fade-up':
        return {
          opacity: 0,
          transform: 'translate3d(0, 44px, 0) scale(0.98)',
          filter: 'blur(4px)',
        };
      case 'slide-left':
        return {
          opacity: 0,
          transform: 'translate3d(-44px, 0, 0)',
          filter: 'blur(4px)',
        };
      case 'slide-right':
        return {
          opacity: 0,
          transform: 'translate3d(44px, 0, 0)',
          filter: 'blur(4px)',
        };
      case 'scale-up':
        return {
          opacity: 0,
          transform: 'scale(0.94) translate3d(0, 28px, 0)',
          filter: 'blur(4px)',
        };
      case 'fade-in':
      default:
        return {
          opacity: 0,
          filter: 'blur(6px)',
        };
    }
  };

  const getVisibleStyles = (): React.CSSProperties => {
    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) scale(1)',
      filter: 'blur(0px)',
    };
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform, filter',
        ...(isVisible ? getVisibleStyles() : getHiddenStyles()),
      }}
      className={className}
    >
      {children}
    </div>
  );
};
