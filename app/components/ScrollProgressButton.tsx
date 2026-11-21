"use client";

import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";

export interface ScrollProgressButtonProps {
  onScrollAction?: (direction: "down" | "up") => void;
}

export interface ScrollProgressButtonRef {
  updateProgress: (progress: number) => void;
}

const CIRCUMFERENCE = 144.51; // 2 * PI * 23

const ScrollProgressButtonComponent = forwardRef<
  ScrollProgressButtonRef,
  ScrollProgressButtonProps
>(function ScrollProgressButton({ onScrollAction }, ref) {
  const circleRef = useRef<SVGCircleElement | null>(null);
  const percentTextRef = useRef<HTMLSpanElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [isNearBottom, setIsNearBottom] = useState<boolean>(false);
  const isNearBottomRef = useRef<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Imperative 60 FPS update method called by ScrollTrigger.onUpdate
  useImperativeHandle(ref, () => ({
    updateProgress: (progress: number) => {
      // 1. Direct SVG stroke dash offset update for circular rounded border
      if (circleRef.current) {
        const offset = CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, progress)));
        circleRef.current.style.strokeDashoffset = String(offset);
      }

      // 2. Direct DOM update for numeric percentage
      if (percentTextRef.current) {
        const pct = Math.round(progress * 100);
        percentTextRef.current.textContent = `${pct}%`;
      }

      // 3. Direction state toggle (only changes state once when crossing 85% threshold)
      const nearBottom = progress >= 0.85;
      if (nearBottom !== isNearBottomRef.current) {
        isNearBottomRef.current = nearBottom;
        setIsNearBottom(nearBottom);
      }
    },
  }));

  const handleClick = () => {
    const direction = isNearBottomRef.current ? "up" : "down";
    onScrollAction?.(direction);
  };

  return (
    <div className="fixed bottom-7 right-7 sm:bottom-9 sm:right-9 z-40 pointer-events-auto select-none">
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-2xl border border-white/15 hover:border-white/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer focus:outline-none"
        title={isNearBottom ? "Scroll back to top" : "Scroll down to next section"}
        aria-label="Scroll position and navigation controller"
      >
        {/* Circular Rounded Progress Border (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1"
          viewBox="0 0 52 52"
        >
          {/* Background Track Circle */}
          <circle
            cx="26"
            cy="26"
            r="23"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="2"
          />
          {/* Animated Glowing Fill Circle */}
          <circle
            ref={circleRef}
            cx="26"
            cy="26"
            r="23"
            fill="none"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: CIRCUMFERENCE,
              transition: "stroke-dashoffset 0.08s ease-out",
            }}
          />
        </svg>

        {/* Center Content: Numeric Percentage or Directional Chevron on Hover */}
        <div className="relative flex flex-col items-center justify-center">
          {isHovered ? (
            <div className="flex flex-col items-center justify-center animate-fadeIn">
              {isNearBottom ? (
                // Up arrow (Back to Top)
                <svg
                  className="w-4 h-4 text-white -translate-y-0.5 group-hover:-translate-y-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                // Down arrow (Scroll Down)
                <svg
                  className="w-4 h-4 text-white translate-y-0.5 group-hover:translate-y-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
            </div>
          ) : (
            <span
              ref={percentTextRef}
              className="font-mono text-[11px] font-medium tracking-tight text-white tabular-nums"
            >
              0%
            </span>
          )}
        </div>
      </button>
    </div>
  );
});

export const ScrollProgressButton = memo(ScrollProgressButtonComponent);
export default ScrollProgressButton;

