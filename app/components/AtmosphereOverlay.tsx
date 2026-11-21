"use client";

import React, { memo } from "react";

function AtmosphereOverlayComponent() {
  return (
    <>
      {/* 
        Subtle 35mm Film Grain Overlay:
        Adds an organic architectural texture using SVG noise with mix-blend-overlay.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 opacity-[0.035] mix-blend-overlay select-none will-change-transform"
        style={{
          transform: "translateZ(0)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* 
        Soft Cinema Vignette:
        Subtly darkens perimeter edges to draw the viewer's focus directly into the 3D villa.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 select-none will-change-transform bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.45)_80%,rgba(0,0,0,0.85)_100%)]"
        style={{ transform: "translateZ(0)" }}
      />
    </>
  );
}

export const AtmosphereOverlay = memo(AtmosphereOverlayComponent);
export default AtmosphereOverlay;
