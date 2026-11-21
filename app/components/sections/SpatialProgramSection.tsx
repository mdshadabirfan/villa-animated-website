"use client";

import React, { memo } from "react";
import { INTERIOR_SPACES } from "../InteriorTimeline";

export interface SpatialProgramSectionProps {
  onNavigateToSpace?: (frameIndex: number) => void;
}

function SpatialProgramSectionComponent({
  onNavigateToSpace,
}: SpatialProgramSectionProps) {
  const levels = [
    {
      level: "LEVEL 03",
      title: "Sky Sanctuaries & Master Retreat",
      elevation: "+8.4M",
      area: "3,850 SQ FT",
      description:
        "Dedicated to acoustic solitude and sunset vistas. Features motorized Belgian linen louvers, cantilevered private terraces, and the zenithal skylit ensuite spa.",
      highlights: [
        "Master Ocean Suite with Dual Dressing Chambers",
        "Basalt Soak Tub Under Frameless Zenithal Oculi",
        "Private Cedar Sun Deck with Outdoor Fire Hearth",
        "Integrated Acoustic Attenuation (STC 65)",
      ],
    },
    {
      level: "LEVEL 02",
      title: "The Oceanic Social Pavilion",
      elevation: "+4.2M",
      area: "5,200 SQ FT",
      description:
        "The ceremonial heart of the residence. A 3.5m blackened steel pivot door introduces double-height concrete galleries flowing into the sunken travertine lounge and monolithic kitchen.",
      highlights: [
        "Double-Height 6.2m Board-Formed Concrete Atrium",
        "180° Frameless Motorized Retractable Glazing",
        "Hand-Selected Nero Marquina Marble Kitchen Atelier",
        "Concealed Butler's Preparation Galley & Cellar Access",
      ],
    },
    {
      level: "LEVEL 01",
      title: "Terrace, Pool & Wellness Haven",
      elevation: "0.0M",
      area: "3,350 SQ FT",
      description:
        "Seamlessly anchored into coastal stone. Suspends an Olympic-proportion 25-meter cantilever infinity pool over the Pacific cliffside alongside full hydrotherapy wellness facilities.",
      highlights: [
        "25-Meter Perimeter Overflow Cantilevered Pool",
        "Thermal Basque Cedar Sauna & Basalt Cold Plunge",
        "Temperature-Regulated 1,200-Bottle Wine Vault",
        "Native Ancient Olive Grove with Sunken Fire Pit",
      ],
    },
  ];

  return (
    <section
      id="spaces"
      className="relative z-10 bg-black px-6 sm:px-12 md:px-20 lg:px-28 py-32 sm:py-44 border-t border-zinc-900"
    >
      <div className="max-w-6xl mx-auto space-y-28">
        {/* Section Header */}
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-white/60" />
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-[0.3em]">
              02 / Spatial Program & Blueprints
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
            An Orchestration of Private Sanctuaries and Grand Oceanic Pavilions
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            Spanning 12,400 interior square feet across three cascading topographic tiers,
            Villa Horizon organizes living spaces along an axis of rising privacy—from the
            open entertainment terrace to the secluded upper suites.
          </p>
        </div>

        {/* 3 Architectural Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {levels.map((item, idx) => (
            <div
              key={idx}
              className="p-8 sm:p-10 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                  <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                    {item.level}
                  </span>
                  <span className="font-mono text-xs text-zinc-500 tabular-nums">
                    {item.elevation} · {item.area}
                  </span>
                </div>

                <h3 className="text-2xl font-light text-white tracking-wide">
                  {item.title}
                </h3>

                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-900">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] block">
                  Key Specifications
                </span>
                <ul className="space-y-2.5">
                  {item.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="text-xs text-zinc-300 font-light flex items-center gap-2.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-zinc-500 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed 6 Sequence Spaces Cards */}
        <div className="space-y-8 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                Curated Sequence
              </span>
              <h3 className="text-2xl font-light text-white tracking-wide mt-1">
                The 6 Architectural Episodes
              </h3>
            </div>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Scrub Sequence Frames 0001 — 1902
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTERIOR_SPACES.map((space) => {
              const targetFrame = Math.round(
                (space.startFrame + space.endFrame) / 2
              );

              return (
                <div
                  key={space.id}
                  className="group relative p-7 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 hover:border-white/30 transition-all duration-300 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>{space.number} · {space.name}</span>
                      <span className="text-zinc-400">
                        FR {String(space.startFrame).padStart(4, "0")}–{String(space.endFrame).padStart(4, "0")}
                      </span>
                    </div>

                    <h4 className="text-lg font-medium text-white group-hover:text-zinc-100 transition-colors">
                      {space.title}
                    </h4>

                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {space.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-800/60">
                    <div className="flex flex-wrap gap-1.5">
                      {space.specs.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-zinc-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onNavigateToSpace?.(targetFrame)}
                      className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-white pt-2 border-t border-white/[0.06] transition-colors cursor-pointer group-hover:text-white"
                    >
                      <span>Jump to 3D Sequence</span>
                      <span className="text-zinc-600 group-hover:text-white transition-colors">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export const SpatialProgramSection = memo(SpatialProgramSectionComponent);
export default SpatialProgramSection;

