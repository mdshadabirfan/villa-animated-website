"use client";

import React, { useEffect, useRef, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function PhilosophySectionComponent() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header Elements Reveal (Eyebrow, H2, Paragraph)
      gsap.from(".ph-header > *", {
        scrollTrigger: {
          trigger: ".ph-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 1.0,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Architect Quote Card Reveal
      gsap.from(".ph-quote", {
        scrollTrigger: {
          trigger: ".ph-quote",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        scale: 0.98,
        duration: 1.2,
        ease: "power3.out",
      });

      // 3 Design Pillars Staggered Reveal
      gsap.from(".ph-pillar", {
        scrollTrigger: {
          trigger: ".ph-pillars-grid",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 45,
        opacity: 0,
        duration: 1.0,
        stagger: 0.16,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative z-10 bg-zinc-950 px-6 sm:px-12 md:px-20 lg:px-28 py-32 sm:py-44 border-t border-zinc-900 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Section Header */}
        <div className="ph-header space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-[0.3em]">
              01 / Architectural Monograph
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
            Where Monolithic Mass Dissolves into the Oceanic Horizon
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            Perched 142 meters above the breaking Pacific surf, Villa Horizon is conceived
            not as an object set upon the cliffside, but as an excavation of the headland itself.
            Cast in raw, board-formed concrete and wrapped in motorized low-iron structural glass,
            the architecture balances profound geological shelter with radical atmospheric exposure.
          </p>
        </div>

        {/* Featured Architect Quote Banner */}
        <div className="ph-quote relative p-8 sm:p-14 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md overflow-hidden hover:border-white/20 transition-all duration-500 before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="max-w-3xl space-y-6">
            <svg
              className="w-8 h-8 text-white/30"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-zinc-200 leading-relaxed italic">
              &ldquo;Architecture at this scale is not an imposition upon the coastline;
              it is an optical instrument through which the shifting light, the marine fog,
              and the Pacific tide are measured.&rdquo;
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="w-10 h-[1px] bg-zinc-600" />
              <div>
                <p className="text-sm text-white font-medium tracking-wide">
                  Julian Vance-Moreau
                </p>
                <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
                  Lead Design Principal · Horizon Studio
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Design Pillars */}
        <div className="ph-pillars-grid grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="ph-pillar p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/60 hover:border-white/30 hover:-translate-y-2 transition-all duration-500 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
              Pillar I
            </span>
            <h3 className="text-xl font-medium text-white tracking-wide">
              Topographic Anchoring
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Subterranean thermal caissons bore 28 meters into solid coastal granite.
              This anchors the residence structurally against seismic movement while utilizing
              the earth’s natural geothermal temperature mass for baseline climate control.
            </p>
          </div>

          <div className="ph-pillar p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/60 hover:border-white/30 hover:-translate-y-2 transition-all duration-500 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
              Pillar II
            </span>
            <h3 className="text-xl font-medium text-white tracking-wide">
              Zenithal Calibration
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Linear skylights and deep concrete reveals are mathematically positioned
              along solar equinox angles, transforming walls into living diurnal sundials
              that project moving shadow corridors throughout the daylight hours.
            </p>
          </div>

          <div className="ph-pillar p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/60 hover:border-white/30 hover:-translate-y-2 transition-all duration-500 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
              Pillar III
            </span>
            <h3 className="text-xl font-medium text-white tracking-wide">
              Threshold Dissolution
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              6-meter motorized Swiss structural glass panes slide invisibly into concrete
              wall pockets. With zero sill transitions, the indoor Roman travertine flooring
              continues uninterrupted onto the cantilevered oceanic terraces.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export const PhilosophySection = memo(PhilosophySectionComponent);
export default PhilosophySection;
