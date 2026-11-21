"use client";

import React, { useEffect, useRef, memo } from "react";
import gsap from "gsap";

function CustomCursorComponent() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(false);

  useEffect(() => {
    // Only initialize on devices with a fine pointer (mouse)
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const container = containerRef.current;
    if (!dot || !ring || !container) return;

    // Use GSAP quickTo for high-performance sub-millisecond cursor tracking
    const xDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });

    // Outer ring lags slightly with a smooth inertia spring
    const xRing = gsap.quickTo(ring, "x", { duration: 0.32, ease: "power2.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.32, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        container.style.opacity = "1";
      }

      const { clientX, clientY } = e;
      xDot(clientX);
      yDot(clientY);
      xRing(clientX);
      yRing(clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest(
        'button, a, input, [role="button"], .cursor-pointer, input[type="range"]'
      );

      if (isInteractive && !isHoveredRef.current) {
        isHoveredRef.current = true;
        gsap.to(ring, {
          scale: 1.8,
          borderColor: "rgba(255, 255, 255, 0.8)",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(2px)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(dot, {
          scale: 0.5,
          opacity: 0.7,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest(
        'button, a, input, [role="button"], .cursor-pointer, input[type="range"]'
      );

      if (isInteractive && isHoveredRef.current) {
        isHoveredRef.current = false;
        gsap.to(ring, {
          scale: 1.0,
          borderColor: "rgba(255, 255, 255, 0.35)",
          backgroundColor: "transparent",
          backdropFilter: "blur(0px)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(dot, {
          scale: 1.0,
          opacity: 1.0,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      container.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      container.style.opacity = "1";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.documentElement.addEventListener("mouseenter", handleMouseEnter, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className="hidden md:block pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
    >
      {/* Precision Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-[3px] -mt-[3px] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] will-change-transform"
      />

      {/* Luxury Trailing Halo Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border border-white/35 will-change-transform transition-colors duration-200"
      />
    </div>
  );
}

export const CustomCursor = memo(CustomCursorComponent);
export default CustomCursor;
