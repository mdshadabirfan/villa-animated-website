"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface UseLenisOptions {
  /**
   * Duration of the smooth scroll animation in seconds.
   * Default: 1.2
   */
  duration?: number;
  /**
   * Custom easing function.
   * Default: exponential deceleration curve
   */
  easing?: (t: number) => number;
  /**
   * Scroll orientation: 'vertical' or 'horizontal'.
   * Default: 'vertical'
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Gesture orientation.
   * Default: 'vertical'
   */
  gestureOrientation?: "vertical" | "horizontal" | "both";
  /**
   * Enable smooth scrolling on mouse wheel events.
   * Default: true
   */
  smoothWheel?: boolean;
  /**
   * Multiplier for mouse wheel scroll distance.
   * Default: 1.0
   */
  wheelMultiplier?: number;
  /**
   * Multiplier for touch swipe gestures.
   * Default: 1.5
   */
  touchMultiplier?: number;
  /**
   * Whether to link Lenis scroll directly to GSAP's ScrollTrigger ticker.
   * Default: true
   */
  syncScrollTrigger?: boolean;
  /**
   * Whether to automatically start Lenis upon initialization.
   * Default: true
   */
  autoStart?: boolean;
}

export interface UseLenisReturn {
  lenis: Lenis | null;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      immediate?: boolean;
      duration?: number;
      easing?: (t: number) => number;
      onComplete?: () => void;
    }
  ) => void;
  stop: () => void;
  start: () => void;
  isReady: boolean;
}

/**
 * Custom React hook that initializes Lenis smooth scrolling,
 * replaces native browser scrolling, synchronizes with GSAP ScrollTrigger's ticker,
 * and handles clean lifecycle destruction on unmount.
 *
 * NOTE: Initialized strictly ONCE on mount to prevent re-render cascades and maximum update depth errors.
 */
export function useLenis(options: UseLenisOptions = {}): UseLenisReturn {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisState, setLenisState] = useState<Lenis | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Store options in a stable ref so inline objects or callbacks don't trigger re-renders
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    const currentOpts = optionsRef.current;
    const {
      duration = 1.2,
      easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation = "vertical",
      gestureOrientation = "vertical",
      smoothWheel = true,
      wheelMultiplier = 1.0,
      touchMultiplier = 1.5,
      syncScrollTrigger = true,
      autoStart = true,
    } = currentOpts;

    // Register GSAP ScrollTrigger plugin
    if (syncScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Instantiate Lenis
    const lenisInstance = new Lenis({
      duration,
      easing,
      orientation,
      gestureOrientation,
      smoothWheel,
      wheelMultiplier,
      touchMultiplier,
      autoRaf: false, // Driven via GSAP ticker
    });

    lenisRef.current = lenisInstance;
    setLenisState(lenisInstance);
    setIsReady(true);

    if (!autoStart) {
      lenisInstance.stop();
    }

    let onLenisScroll: (() => void) | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    if (syncScrollTrigger) {
      // 1. Sync ScrollTrigger on each Lenis scroll
      onLenisScroll = () => {
        ScrollTrigger.update();
      };
      lenisInstance.on("scroll", onLenisScroll);

      // 2. Drive Lenis updates directly from GSAP's ticker (unified RAF loop)
      tickerCallback = (time: number) => {
        lenisInstance.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);

      // 3. Disable GSAP lag smoothing to eliminate artificial momentum jumps
      gsap.ticker.lagSmoothing(0);
    } else {
      let rafId: number;
      const step = (time: number) => {
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);

      tickerCallback = () => {
        cancelAnimationFrame(rafId);
      };
    }

    // Lifecycle cleanup function: destroys instance, removes listeners, prevents memory leaks
    // NEVER call setState (like setIsReady or setLenisState) inside unmount cleanup!
    return () => {
      if (syncScrollTrigger && tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      } else if (tickerCallback) {
        tickerCallback(0);
      }

      if (onLenisScroll) {
        lenisInstance.off("scroll", onLenisScroll);
      }

      lenisInstance.destroy();
      lenisRef.current = null;
    };
  }, []); // Strictly empty dependency array: Lenis is initialized once per component lifecycle

  const scrollTo = useCallback(
    (
      target: string | number | HTMLElement,
      scrollOptions?: {
        offset?: number;
        immediate?: boolean;
        duration?: number;
        easing?: (t: number) => number;
        onComplete?: () => void;
      }
    ) => {
      lenisRef.current?.scrollTo(target, scrollOptions);
    },
    []
  );

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  return {
    lenis: lenisState,
    scrollTo,
    stop,
    start,
    isReady,
  };
}

export default useLenis;
