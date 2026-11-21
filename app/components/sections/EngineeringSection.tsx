"use client";

import React, { memo } from "react";

function EngineeringSectionComponent() {
  const metrics = [
    { value: "94%", label: "ENERGY AUTONOMY", detail: "Annual solar micro-grid yield" },
    { value: "96 kWh", label: "STORAGE CAPACITY", detail: "Subterranean LFP battery reserve" },
    { value: "180,000L", label: "CISTERN VOLUME", detail: "Atmospheric & fog rainwater reclamation" },
    { value: "STC 65", label: "ACOUSTIC ISOLATION", detail: "Triple laminated structural glass" },
  ];

  const systems = [
    {
      code: "SYS-01",
      title: "Geothermal Closed-Loop HVAC",
      description:
        "Fourteen deep-bore geothermal heat exchangers plunge 120 meters into coastal bedrock. Utilizing the earth’s constant 14°C thermal mass, the system circulates chilled or heated fluid beneath the Roman travertine floor slabs, providing silent, draft-free radiant climate control without visible vents or mechanical fan noise.",
      specs: ["14 Boreholes @ 120m", "Hydronic Radiant Slabs", "Zero Exterior Noise"],
    },
    {
      code: "SYS-02",
      title: "Building-Integrated Photovoltaics (BIPV)",
      description:
        "High-transmittance photovoltaic cells are laminated directly inside the zenithal skylight glass assemblies. Generating up to 42 kW peak output while filtering 99% of damaging ultraviolet radiation, the array charges an isolated 96 kWh subterranean battery room for uninterrupted off-grid capability.",
      specs: ["42 kW Peak Output", "99% UV Attenuation", "96 kWh Battery Reserve"],
    },
    {
      code: "SYS-03",
      title: "Atmospheric Fog & Rainwater Harvesting",
      description:
        "Capitalizing on heavy Pacific coastal marine inversions, hidden condenser louvers and gravity-fed roof scuppers divert water into a 180,000-liter subterranean stone cistern. Tri-stage ceramic and ultraviolet filtration supplies all estate irrigation and infinity pool replenishment without drawing from municipal water infrastructure.",
      specs: ["180,000L Cistern", "Tri-Stage UV Filtration", "Zero Municipal Runoff"],
    },
    {
      code: "SYS-04",
      title: "Seismic Caissons & Marine Metallurgy",
      description:
        "The residence is anchored to the cliff face via thirty-two 1.2-meter diameter post-tensioned reinforced concrete caissons socketed into granite bedrock. All exposed steel is forged from 316L architectural alloy treated with passivated titanium coatings, engineered to withstand over a century of direct salt-mist exposure.",
      specs: ["32 Post-Tensioned Caissons", "316L Marine Alloy", "8.5 Magnitude Rated"],
    },
  ];

  return (
    <section
      id="engineering"
      className="relative z-10 bg-black px-6 sm:px-12 md:px-20 lg:px-28 py-32 sm:py-44 border-t border-zinc-900"
    >
      <div className="max-w-6xl mx-auto space-y-28">
        {/* Section Header */}
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-white/60" />
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-[0.3em]">
              04 / Climate Engineering & Infrastructure
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
            Off-Grid Ecological Resilience Disguised as Invisible Elegance
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            Beneath the quiet beauty of board-formed concrete and travertine lies a sophisticated
            closed-loop infrastructure designed for complete energetic and hydrological autonomy.
          </p>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 sm:p-12 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 font-mono">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-2">
              <span className="text-3xl sm:text-5xl font-light text-white tracking-tight block">
                {m.value}
              </span>
              <span className="text-xs text-zinc-400 uppercase tracking-widest block font-medium">
                {m.label}
              </span>
              <span className="text-[11px] text-zinc-500 block font-normal">
                {m.detail}
              </span>
            </div>
          ))}
        </div>

        {/* 4 Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {systems.map((sys) => (
            <div
              key={sys.code}
              className="p-8 sm:p-10 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                    {sys.code}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                </div>

                <h3 className="text-2xl font-light text-white tracking-wide">
                  {sys.title}
                </h3>

                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  {sys.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/60 flex flex-wrap gap-2">
                {sys.specs.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-zinc-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const EngineeringSection = memo(EngineeringSectionComponent);
export default EngineeringSection;

