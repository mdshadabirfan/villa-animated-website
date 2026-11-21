"use client";

import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";
import { INTERIOR_SPACES } from "./InteriorTimeline";

export interface FloatingProgressNavProps {
  totalFrames?: number;
  onNavigateToSpace: (frameIndex: number) => void;
}

export interface FloatingProgressNavRef {
  updateProgress: (progress: number, currentFrame: number) => void;
}

const FloatingProgressNavComponent = forwardRef<
  FloatingProgressNavRef,
  FloatingProgressNavProps
>(function FloatingProgressNav(
  { onNavigateToSpace },
  ref
) {
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const [activeSpaceIndex, setActiveSpaceIndex] = useState<number>(-1);
  const activeSpaceIndexRef = useRef<number>(-1);

  // Imperative 60 FPS update method called by ScrollTrigger.onUpdate
  useImperativeHandle(ref, () => ({
    updateProgress: (progress: number, currentFrame: number) => {
      // 1. Direct DOM update for the glowing thumb track height (0 React re-renders)
      if (thumbRef.current) {
        const pct = Math.min(100, Math.max(0, progress * 100));
        thumbRef.current.style.height = `${pct}%`;
      }

      // 2. Identify active space and update state ONLY when the room actually changes (only 6 times total)
      const newIndex = INTERIOR_SPACES.findIndex(
        (space) => currentFrame >= space.startFrame && currentFrame <= space.endFrame
      );

      if (newIndex !== activeSpaceIndexRef.current) {
        activeSpaceIndexRef.current = newIndex;
        setActiveSpaceIndex(newIndex);
      }
    },
  }));

  return (
    <aside
      aria-label="Room Timeline Navigation"
      className="fixed right-5 sm:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Floating Glassmorphic Rail Dock */}
      <div className="relative flex flex-col items-end gap-6 py-5 px-3.5 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
        {/* Subtle Vertical Spine Track */}
        <div className="absolute right-[22px] top-6 bottom-6 w-[1px] bg-white/10 pointer-events-none" />

        {/* Dynamic Glowing Progress Indicator Thumb on Track */}
        <div
          ref={thumbRef}
          className="absolute right-[21.5px] top-6 w-[2px] bg-gradient-to-b from-white/30 via-white to-white/30 rounded-full transition-none pointer-events-none"
          style={{
            height: "0%",
            maxHeight: "calc(100% - 48px)",
          }}
        />

        {/* Space Navigation Items */}
        {INTERIOR_SPACES.map((space, index) => {
          const isActive = activeSpaceIndex === index;
          const targetFrame = Math.round((space.startFrame + space.endFrame) / 2);

          return (
            <button
              key={space.id}
              onClick={() => onNavigateToSpace(targetFrame)}
              className="group relative flex items-center justify-end gap-3.5 cursor-pointer py-1 text-right focus:outline-none"
              title={`Navigate to ${space.name}`}
            >
              {/* Expandable Space Name Tooltip/Label */}
              <div
                className={`flex items-center gap-2 pr-1 transition-all duration-300 ease-out ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                <span className="font-mono text-[9px] tracking-[0.25em] text-white/50 uppercase">
                  {space.number}
                </span>
                <span
                  className={`font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 ${
                    isActive
                      ? "text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                      : "text-zinc-400 group-hover:text-white"
                  }`}
                >
                  {space.name}
                </span>
              </div>

              {/* Minimal Line / Dash Indicator */}
              <div
                className={`h-[1.5px] rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    : "w-2 bg-zinc-700 group-hover:w-3.5 group-hover:bg-zinc-400"
                }`}
              />

              {/* Minimal Circular Node / Dot */}
              <div className="relative flex items-center justify-center">
                {/* Active Ripple Aura */}
                {isActive && (
                  <span className="absolute -inset-1 rounded-full bg-white/20 animate-ping opacity-75" />
                )}

                <span
                  className={`relative block rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-2.5 h-2.5 bg-white shadow-[0_0_10px_rgba(255,255,255,1)]"
                      : "w-1.5 h-1.5 bg-zinc-700 group-hover:bg-zinc-400 group-hover:scale-125"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
});

export const FloatingProgressNav = memo(FloatingProgressNavComponent);
export default FloatingProgressNav;
