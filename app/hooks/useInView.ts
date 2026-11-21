"use client";

import { useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Robust, high-performance IntersectionObserver hook for viewport entrance animations.
 * Decoupled from scroll offsets so 20,000px pinned sequences never break trigger positions.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px 0px -60px 0px", triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If already in viewport on mount, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsInView(true);
      if (triggerOnce) return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(el);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView] as const;
}

export default useInView;
