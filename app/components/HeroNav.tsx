"use client";

import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";

export interface HeroNavProps {
  totalFrames?: number;
  initialFrame?: number;
  onNavigateToSpace?: (frameIndex: number) => void;
  onNavigateToSpecs?: () => void;
}

export interface HeroNavRef {
  updateProgress: (progress: number, frame: number) => void;
}

const HeroNavComponent = forwardRef<HeroNavRef, HeroNavProps>(function HeroNav(
  {
    totalFrames = 1902,
    initialFrame = 1,
    onNavigateToSpace,
    onNavigateToSpecs,
  },
  ref
) {
  const headerRef = useRef<HTMLElement | null>(null);
  const frameSpanRef = useRef<HTMLSpanElement | null>(null);
  const heroIndicatorRef = useRef<HTMLDivElement | null>(null);

  const isScrolledRef = useRef<boolean>(false);
  const isAtHeroRef = useRef<boolean>(true);

  // Imperative 60 FPS update method called by ScrollTrigger.onUpdate
  // Directly updates DOM nodes without virtual DOM diffing or React re-renders
  useImperativeHandle(ref, () => ({
    updateProgress: (progress: number, frame: number) => {
      // 1. Update Frame Number Tracker
      if (frameSpanRef.current) {
        frameSpanRef.current.textContent = String(frame).padStart(4, "0");
      }

      // 2. Toggle Header Blur and Background
      const scrolled = progress > 0.01;
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        if (headerRef.current) {
          if (scrolled) {
            headerRef.current.classList.remove(
              "bg-transparent",
              "backdrop-blur-none",
              "border-transparent",
              "py-6",
              "sm:py-8"
            );
            headerRef.current.classList.add(
              "bg-black/50",
              "backdrop-blur-2xl",
              "border-white/10",
              "shadow-[0_15px_30px_rgba(0,0,0,0.6)]",
              "py-4",
              "sm:py-5"
            );
          } else {
            headerRef.current.classList.remove(
              "bg-black/50",
              "backdrop-blur-2xl",
              "border-white/10",
              "shadow-[0_15px_30px_rgba(0,0,0,0.6)]",
              "py-4",
              "sm:py-5"
            );
            headerRef.current.classList.add(
              "bg-transparent",
              "backdrop-blur-none",
              "border-transparent",
              "py-6",
              "sm:py-8"
            );
          }
        }
      }

      // 3. Toggle Hero Scroll Indicator
      const atHero = progress < 0.025;
      if (atHero !== isAtHeroRef.current) {
        isAtHeroRef.current = atHero;
        if (heroIndicatorRef.current) {
          if (atHero) {
            heroIndicatorRef.current.classList.remove(
              "opacity-0",
              "translate-y-3",
              "pointer-events-none"
            );
            heroIndicatorRef.current.classList.add(
              "opacity-100",
              "translate-y-0"
            );
          } else {
            heroIndicatorRef.current.classList.remove(
              "opacity-100",
              "translate-y-0"
            );
            heroIndicatorRef.current.classList.add(
              "opacity-0",
              "translate-y-3",
              "pointer-events-none"
            );
          }
        }
      }
    },
  }));

  return (
    <>
      {/* Top Header Bar: Transparent at top, adds luxury blur background when scrolling */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 transition-all duration-500 ease-out pointer-events-none bg-transparent backdrop-blur-none border-b border-transparent py-6 sm:py-8"
      >
        {/* Top Left: Elegant Monogram Logo */}
        <div className="flex items-center gap-3.5 pointer-events-auto group cursor-pointer">
          <div className="relative w-8 h-8 rounded-lg bg-white/[0.04] border border-white/15 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/[0.08]">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-white stroke-current fill-none stroke-[1.5]"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="8" y1="4" x2="8" y2="20" />
              <circle cx="16" cy="8" r="2" className="fill-white" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-xs sm:text-sm font-medium tracking-[0.28em] text-white uppercase transition-colors duration-300 group-hover:text-white">
              VILLA HORIZON
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-400 uppercase">
              Pacific Coastline · 34°N
            </span>
          </div>
        </div>

        {/* Top Right: Minimalist Navigation Bar */}
        <nav className="flex items-center gap-3 sm:gap-6 pointer-events-auto">
          {/* Nav Links Container */}
          <div className="hidden md:flex items-center gap-6 px-5 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-xs font-mono tracking-wider text-zinc-300">
            <button
              onClick={() => onNavigateToSpace?.(60)}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              SPACES
            </button>
            <span className="text-zinc-600">/</span>
            <button
              onClick={() => onNavigateToSpace?.(680)}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              ARCHITECTURE
            </button>
            <span className="text-zinc-600">/</span>
            <button
              onClick={onNavigateToSpecs}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              SPECS
            </button>
          </div>

          {/* Current Frame Tracker Pill */}
          <div className="hidden sm:flex items-center px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 font-mono text-[11px] text-zinc-300 tabular-nums">
            <span ref={frameSpanRef} className="text-white font-medium">
              {String(initialFrame).padStart(4, "0")}
            </span>
            <span className="text-zinc-500 mx-1">/</span>
            <span className="text-zinc-400">{totalFrames}</span>
          </div>

          {/* Inquire CTA Button */}
          <button
            onClick={onNavigateToSpecs}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 border border-white font-mono text-xs tracking-wider font-medium transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <span>INQUIRE</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                fillRule="evenodd"
                d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </header>

      {/* Bottom Center: Small Animated Scroll Indicator */}
      <div
        ref={heroIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2.5 pointer-events-none transition-all duration-500 ease-out opacity-100 translate-y-0"
      >
        <span className="font-mono text-[9px] tracking-[0.35em] text-white/50 uppercase">
          Scroll To Experience
        </span>

        {/* Minimal Scroll Pill with Animated Dash */}
        <div className="w-[18px] h-[30px] rounded-full border border-white/20 flex justify-center p-[3px] bg-black/30 backdrop-blur-sm">
          <div className="w-[2px] h-[6px] bg-white rounded-full animate-bounce opacity-80" />
        </div>
      </div>
    </>
  );
});

export const HeroNav = memo(HeroNavComponent);
export default HeroNav;
