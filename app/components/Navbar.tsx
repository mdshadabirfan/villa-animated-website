"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";
import { useTheme } from "../hooks/useTheme";

export interface NavbarProps {
  totalFrames?: number;
  initialFrame?: number;
  onNavigateToSection?: (sectionId: string) => void;
  onNavigateToSpace?: (frameIndex: number) => void;
}

export interface NavbarRef {
  updateProgress: (progress: number, frame: number) => void;
  setActiveSection: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: "#experience", label: "Experience" },
  { id: "#philosophy", label: "Philosophy" },
  { id: "#spaces", label: "Spaces" },
  { id: "#materiality", label: "Materiality" },
  { id: "#engineering", label: "Engineering" },
];

const NavbarComponent = forwardRef<NavbarRef, NavbarProps>(function Navbar(
  {
    onNavigateToSection,
  },
  ref
) {
  const headerRef = useRef<HTMLElement | null>(null);
  const heroIndicatorRef = useRef<HTMLDivElement | null>(null);

  const isScrolledRef = useRef<boolean>(false);
  const isAtHeroRef = useRef<boolean>(true);

  const [activeSection, setActiveSection] = useState<string>("#experience");
  const activeSectionRef = useRef<string>("#experience");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Theme management hook (Dark / Light)
  const { theme, toggleTheme } = useTheme();

  // Imperative 60 FPS update method called by ScrollTrigger.onUpdate
  useImperativeHandle(ref, () => ({
    setActiveSection: (sectionId: string) => {
      if (sectionId !== activeSectionRef.current) {
        activeSectionRef.current = sectionId;
        setActiveSection(sectionId);
      }
    },
    updateProgress: (progress: number) => {
      // 1. Toggle Header Blur and Background
      const scrolled = progress > 0.008;
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        if (headerRef.current) {
          if (scrolled) {
            headerRef.current.classList.remove(
              "bg-transparent",
              "backdrop-blur-none",
              "border-transparent",
              "py-6",
              "sm:py-7"
            );
            headerRef.current.classList.add(
              "bg-black/65",
              "backdrop-blur-2xl",
              "border-white/10",
              "shadow-[0_20px_40px_rgba(0,0,0,0.7)]",
              "py-3.5",
              "sm:py-4"
            );
          } else {
            headerRef.current.classList.remove(
              "bg-black/65",
              "backdrop-blur-2xl",
              "border-white/10",
              "shadow-[0_20px_40px_rgba(0,0,0,0.7)]",
              "py-3.5",
              "sm:py-4"
            );
            headerRef.current.classList.add(
              "bg-transparent",
              "backdrop-blur-none",
              "border-transparent",
              "py-6",
              "sm:py-7"
            );
          }
        }
      }

      // 2. Toggle Hero Scroll Indicator
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

  // Automatic section detection on scroll via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["experience", "philosophy", "spaces", "materiality", "engineering", "inquire"];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = `#${entry.target.id}`;
            if (currentId !== activeSectionRef.current) {
              activeSectionRef.current = currentId;
              setActiveSection(currentId);
            }
          }
        });
      },
      {
        rootMargin: "-25% 0px -40% 0px",
        threshold: [0, 0.2, 0.5],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (target: string) => {
    activeSectionRef.current = target;
    setActiveSection(target);
    setMobileMenuOpen(false);
    onNavigateToSection?.(target);
  };

  return (
    <>
      {/* Top Fixed Header Bar */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 md:px-14 transition-all duration-500 ease-out pointer-events-none bg-transparent backdrop-blur-none border-b border-transparent py-6 sm:py-7"
      >
        {/* Top Left: Architectural Monogram & Identification */}
        <button
          onClick={() => handleNavClick("#experience")}
          className="flex items-center gap-3.5 pointer-events-auto group cursor-pointer text-left focus:outline-none"
        >
          {/* Architectural Geometric Mark */}
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
            <span className="font-mono text-xs sm:text-sm font-medium tracking-[0.28em] text-white uppercase transition-colors duration-300 group-hover:text-zinc-200">
              VILLA HORIZON
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-400 uppercase">
              Pacific Coastline · 34°N
            </span>
          </div>
        </button>

        {/* Top Center / Right: Desktop Navigation Links with Cool Modern Active Capsule State */}
        <nav className="hidden lg:flex items-center p-1.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 text-xs font-mono tracking-wider pointer-events-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.16em] transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-white/12 text-white font-medium border border-white/25 shadow-[0_0_15px_rgba(255,255,255,0.12)] backdrop-blur-md"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {/* Active Indicator Glowing Pulse Dot */}
                {isActive && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white shadow-[0_0_6px_rgba(255,255,255,1)]"></span>
                  </span>
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Top Right: Theme Toggle & Inquire CTA (Frames Container Completely Removed) */}
        <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
          {/* Luxury Architectural Theme Toggle Button (Light/Dark Mode) */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "Alabaster Light" : "Obsidian Dark"} mode`}
            title={`Switch to ${theme === "dark" ? "Alabaster Light" : "Obsidian Dark"} mode`}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/35 backdrop-blur-md transition-all duration-300 font-mono text-xs text-zinc-300 hover:text-white cursor-pointer group shadow-[0_4px_15px_rgba(0,0,0,0.3)] focus:outline-none"
          >
            <span className="relative w-3.5 h-3.5 flex items-center justify-center">
              {theme === "dark" ? (
                // Moon icon
                <svg
                  className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                // Sun icon
                <svg
                  className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-400 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </span>
            <span className="text-[11px] font-mono tracking-wider text-zinc-300 group-hover:text-white uppercase">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>

          {/* Inquire CTA Button */}
          <button
            onClick={() => handleNavClick("#inquire")}
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black hover:bg-zinc-200 border border-white font-mono text-xs tracking-wider font-medium transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.18)] cursor-pointer"
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

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white pointer-events-auto"
          >
            <span
              className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-[2.5px]" : "mb-1"
              }`}
            />
            <span
              className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[2.5px]" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-30 bg-black/95 backdrop-blur-3xl lg:hidden flex flex-col justify-between px-8 py-24 transition-all duration-500 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-6">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-[0.3em] mb-8">
            Navigation Index
          </p>
          <div className="flex flex-col gap-4 text-xl font-light tracking-wide text-white">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left flex items-center justify-between py-2 border-b border-white/10 transition-colors ${
                    isActive ? "text-white font-medium" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>
                    0{idx + 1} · {item.label}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
                  )}
                </button>
              );
            })}
            <button
              onClick={() => handleNavClick("#inquire")}
              className="text-left text-white font-medium hover:text-zinc-300 transition-colors pt-4"
            >
              06 · Private Acquisition
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase">
              Location
            </p>
            <p className="font-mono text-xs text-zinc-300 tracking-wider">
              PACIFIC PALISADES · 34°02&apos;N
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white"
          >
            <span>{theme === "dark" ? "Mode: Dark" : "Mode: Light"}</span>
          </button>
        </div>
      </div>

      {/* Bottom Center: Animated Scroll Indicator */}
      <div
        ref={heroIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2.5 pointer-events-none transition-all duration-500 ease-out opacity-100 translate-y-0"
      >
        <span className="font-mono text-[9px] tracking-[0.35em] text-white/50 uppercase">
          Scroll To Experience
        </span>

        <div className="w-[18px] h-[30px] rounded-full border border-white/20 flex justify-center p-[3px] bg-black/30 backdrop-blur-sm">
          <div className="w-[2px] h-[6px] bg-white rounded-full animate-bounce opacity-80" />
        </div>
      </div>
    </>
  );
});

export const Navbar = memo(NavbarComponent);
export default Navbar;
