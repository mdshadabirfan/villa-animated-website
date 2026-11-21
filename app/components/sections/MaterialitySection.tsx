"use client";

import React, { useEffect, useRef, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function MaterialitySectionComponent() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const materials = [
    {
      number: "01",
      name: "Roman Navona Travertine",
      provenance: "Tivoli Quarries · Rome, Italy",
      finish: "Cross-cut unpolished matte with organic open pores",
      description:
        "Harvested from the historic Roman strata in Tivoli, each 120x60cm slab is cross-cut to reveal geological sedimentation rings. Maintained with a natural matte unhoned finish, the stone remains cool under summer sun and naturally slip-resistant across outdoor cantilevered terraces.",
      properties: ["Thermal Mass Buffering", "Zero Chemical Sealants", "Vein-Matched Axis"],
    },
    {
      number: "02",
      name: "Board-Formed Concrete",
      provenance: "Custom Coastal Aggregates · Pacific Coast",
      finish: "Rough-sawn Douglas fir relief with pozzolanic micro-cement",
      description:
        "Structural walls were poured in place using horizontal rough-sawn Douglas fir boards. The grain of the wood transfers indelibly into the concrete surface, transforming cold structural mass into an expressive, shadow-reactive timber relief that weathers gracefully in coastal air.",
      properties: ["Class C Marine Durability", "55 MPa Compressive Strength", "Diurnal Shadow Texture"],
    },
    {
      number: "03",
      name: "Hand-Patinated Blackened Steel",
      provenance: "Artisanal Forge · Basque Country",
      finish: "Cold-oxidized gunmetal patina with beeswax burnishing",
      description:
        "Utilized for monumental structural portals, pivot doors, and linear fenestration. Every steel element is hand-patinated through iterative cold chemical oxidation and sealed with hot beeswax, ensuring deep velvet depth without synthetic varnish reflections.",
      properties: ["Invisible Flush Weldments", "Salt-Mist Resisting Micro-Coat", "Integrated Pivot Bearings"],
    },
    {
      number: "04",
      name: "Honed Volcanic Basalt",
      provenance: "Extrusive Magmatic Quarry · Auvergne, France",
      finish: "Diamond-honed velvety matte with micro-beveled edges",
      description:
        "Carved from monolithic basalt blocks to form the master ensuite soaking tub and monolithic wet walls. With an ultra-dense crystalline composition, basalt retains water warmth for hours while providing a deeply grounded, contemplative tactile presence.",
      properties: ["Thermal Heat Retention", "Dense Low-Porosity Grain", "Acoustic Dampening"],
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header Elements Reveal
      gsap.from(".mat-header > *", {
        scrollTrigger: {
          trigger: ".mat-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 1.0,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 4 Materials Cards Staggered Reveal
      gsap.from(".mat-card", {
        scrollTrigger: {
          trigger: ".mat-grid",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.16,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="materiality"
      ref={sectionRef}
      className="relative z-10 bg-zinc-950 px-6 sm:px-12 md:px-20 lg:px-28 py-32 sm:py-44 border-t border-zinc-900 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Section Header */}
        <div className="mat-header space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-[0.3em]">
              03 / Noble Materials & Craftsmanship
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
            Tactile Permanence: Materials Chosen to Age with Dignity
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            The material palette of Villa Horizon deliberately rejects transient decorative trends.
            Every surface is composed of raw, honest elements that gain character, patina,
            and depth through decades of sun, wind, and ocean mist.
          </p>
        </div>

        {/* 4 Materials Detailed Grid */}
        <div className="mat-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          {materials.map((mat) => (
            <div
              key={mat.number}
              className="mat-card p-8 sm:p-11 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 hover:border-white/30 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between space-y-8 shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800/70 pb-4">
                  <span className="font-mono text-xs text-white/50 tracking-widest">
                    MATERIAL {mat.number}
                  </span>
                  <span className="font-mono text-xs text-zinc-400 tracking-wider">
                    {mat.provenance}
                  </span>
                </div>

                <h3 className="text-2xl font-light text-white tracking-wide">
                  {mat.name}
                </h3>

                <p className="font-mono text-xs text-zinc-400">
                  <span className="text-zinc-500 uppercase tracking-wider block mb-1 text-[10px]">
                    Surface Finish
                  </span>
                  {mat.finish}
                </p>

                <p className="text-sm text-zinc-300 font-light leading-relaxed pt-1">
                  {mat.description}
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-800/60">
                <div className="flex flex-wrap gap-2">
                  {mat.properties.map((prop, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300 hover:border-white/30 transition-colors"
                    >
                      {prop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const MaterialitySection = memo(MaterialitySectionComponent);
export default MaterialitySection;
