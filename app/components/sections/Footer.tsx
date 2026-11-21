"use client";

import React, { useEffect, useState, memo } from "react";

export interface FooterProps {
  onNavigateToSection?: (sectionId: string) => void;
}

function FooterComponent({ onNavigateToSection }: FooterProps) {
  const [pacificTime, setPacificTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setPacificTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative z-10 bg-black text-white px-6 sm:px-12 md:px-20 lg:px-28 pt-24 pb-16 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Top: Large Architectural Wordmark & Coordinates */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-800 pb-16">
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-[0.22em] text-white uppercase">
              Villa Horizon
            </h2>
            <p className="font-mono text-xs text-zinc-400 tracking-[0.25em] uppercase">
              Pacific Coastline · California · 34°02&apos;38&quot;N 118°31&apos;45&quot;W
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-zinc-500">
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-zinc-600">
                Local Pacific Time
              </span>
              <span className="text-zinc-300 tabular-nums font-medium text-sm">
                {pacificTime || "12:00:00"} PST
              </span>
            </div>
            <div className="h-8 w-[1px] bg-zinc-800" />
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-zinc-600">
                Site Elevation
              </span>
              <span className="text-zinc-300 font-medium text-sm">
                142M AMSL
              </span>
            </div>
          </div>
        </div>

        {/* 4-Column Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 font-mono text-xs">
          {/* Column 1: Monograph Directory */}
          <div className="space-y-4">
            <span className="text-zinc-500 uppercase tracking-widest block text-[10px]">
              01 · Monograph Index
            </span>
            <ul className="space-y-2.5 text-zinc-400 font-light">
              <li>
                <button
                  onClick={() => onNavigateToSection?.("#experience")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  3D Sequence Tour
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection?.("#philosophy")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Design Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection?.("#spaces")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Spatial Blueprints
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection?.("#materiality")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Noble Materials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection?.("#engineering")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Climate Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection?.("#inquire")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Private Acquisition
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Architectural Collaborators */}
          <div className="space-y-4">
            <span className="text-zinc-500 uppercase tracking-widest block text-[10px]">
              02 · Project Collaborators
            </span>
            <ul className="space-y-2.5 text-zinc-400 font-light">
              <li>
                <span className="text-white block">Julian Vance-Moreau</span>
                <span className="text-[10px] text-zinc-500">Design Principal</span>
              </li>
              <li>
                <span className="text-white block">Studio Horizon Architecture</span>
                <span className="text-[10px] text-zinc-500">Architect of Record</span>
              </li>
              <li>
                <span className="text-white block">Buro Happold Engineering</span>
                <span className="text-[10px] text-zinc-500">Structural &amp; Marine Caissons</span>
              </li>
              <li>
                <span className="text-white block">Oudolf Coastal Landscapes</span>
                <span className="text-[10px] text-zinc-500">Biophilic Horticulture</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Residence Facts */}
          <div className="space-y-4">
            <span className="text-zinc-500 uppercase tracking-widest block text-[10px]">
              03 · Structural Dossier
            </span>
            <ul className="space-y-2 text-zinc-400 font-light">
              <li>
                <span className="text-zinc-500">Gross Interior:</span> 12,400 SF
              </li>
              <li>
                <span className="text-zinc-500">Cantilever Pool:</span> 25.0 Meters
              </li>
              <li>
                <span className="text-zinc-500">Residential Suites:</span> 6 Bedrooms
              </li>
              <li>
                <span className="text-zinc-500">Spa Bathrooms:</span> 8 Ensuite
              </li>
              <li>
                <span className="text-zinc-500">Wine Cellar:</span> 1,200 Bottles
              </li>
              <li>
                <span className="text-zinc-500">Subterranean Garage:</span> 6 Vehicles
              </li>
            </ul>
          </div>

          {/* Column 4: Private Desk & Back to Top */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-zinc-500 uppercase tracking-widest block text-[10px]">
                04 · Confidential Advisory
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Available exclusively through private family office presentation.
              </p>
              <p className="text-xs text-white">advisory@villahorizon.com</p>
            </div>

            <button
              onClick={() => onNavigateToSection?.("#experience")}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer group"
            >
              <span>Back to Top</span>
              <span className="group-hover:-translate-y-1 transition-transform">↑</span>
            </button>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-10 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-600">
          <p>© 2026 VILLA HORIZON. ALL ARCHITECTURAL RIGHTS RESERVED.</p>
          <div className="flex gap-6 uppercase tracking-wider">
            <span className="hover:text-zinc-400 transition-colors">Confidential Placement</span>
            <span className="hover:text-zinc-400 transition-colors">Architectural Portfolio</span>
            <span className="hover:text-zinc-400 transition-colors">Equal Housing Opportunity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterComponent);
export default Footer;
