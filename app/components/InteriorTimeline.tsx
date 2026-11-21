"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";
import gsap from "gsap";

export interface InteriorSpace {
  id: string;
  number: string;
  name: string;
  title: string;
  description: string;
  specs: string[];
  startFrame: number;
  endFrame: number;
  position: "bottom-left" | "bottom-right";
}

export const INTERIOR_SPACES: InteriorSpace[] = [
  {
    id: "entrance",
    number: "01",
    name: "ENTRANCE",
    title: "The Grand Threshold",
    description:
      "Monolithic board-formed concrete framing a 3.5m blackened steel pivot door with linear zenithal skylights.",
    specs: ["Blackened Steel", "Cast Concrete", "3.5m Pivot Door"],
    startFrame: 50,
    endFrame: 310,
    position: "bottom-left",
  },
  {
    id: "living",
    number: "02",
    name: "LIVING ROOM",
    title: "Panoramic Pavilion",
    description:
      "Double-height architectural glazing opens 180 degrees to coastal horizons with Roman travertine sunken seating.",
    specs: ["Ultra-Clear Glazing", "Roman Travertine", "Suspended Hearth"],
    startFrame: 360,
    endFrame: 620,
    position: "bottom-right",
  },
  {
    id: "kitchen",
    number: "03",
    name: "CULINARY ATELIER",
    title: "Sculptural Monolith",
    description:
      "Hand-selected Nero Marquina marble island seamlessly integrating concealed induction surfaces and smoked oak cabinetry.",
    specs: ["Nero Marquina", "Smoked Oak", "Concealed Induction"],
    startFrame: 670,
    endFrame: 930,
    position: "bottom-left",
  },
  {
    id: "bedroom",
    number: "04",
    name: "MASTER SUITE",
    title: "Private Sanctuary",
    description:
      "Acoustically isolated retreat oriented toward golden-hour sunsets with motorized linen solar louvers.",
    specs: ["Slatted Walnut", "Belgian Linen", "Sunset Orientation"],
    startFrame: 980,
    endFrame: 1240,
    position: "bottom-right",
  },
  {
    id: "bathroom",
    number: "05",
    name: "ENSUITE SPA",
    title: "Elemental Stone",
    description:
      "Carved freestanding basalt soak tub situated directly beneath a frameless zenithal rain skylight.",
    specs: ["Honed Basalt", "Rain Skylight", "Radiant Heated Slabs"],
    startFrame: 1290,
    endFrame: 1550,
    position: "bottom-left",
  },
  {
    id: "garden",
    number: "06",
    name: "HORIZON TERRACE & GARDEN",
    title: "Suspended Landscape",
    description:
      "Cantilevered ancient olive grove surrounding a 25m perimeter overflow infinity pool merging with the open Pacific.",
    specs: ["Centuries Olive Trees", "25m Infinity Pool", "Travertine Deck"],
    startFrame: 1600,
    endFrame: 1860,
    position: "bottom-right",
  },
];

export interface InteriorTimelineProps {
  totalFrames?: number;
  onSelectSpace?: (frameIndex: number) => void;
}

export interface InteriorTimelineRef {
  updateProgress: (progress: number, currentFrame: number) => void;
}

const InteriorTimelineComponent = forwardRef<
  InteriorTimelineRef,
  InteriorTimelineProps
>(function InteriorTimeline(
  { totalFrames = 1902 },
  ref
) {
  // DOM element references for card containers
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // DOM element references for inner cards (3D mouse parallax)
  const cardInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const activeSpaceIndexRef = useRef<number>(-1);

  // Imperative 60 FPS update method called by ScrollTrigger.onUpdate
  useImperativeHandle(ref, () => ({
    updateProgress: (progress: number, currentFrame: number) => {
      // 1. Scrub GSAP Timeline directly in the ticker frame
      if (timelineRef.current) {
        timelineRef.current.progress(progress);
      }

      // 2. Track current active space for mouse parallax without React state overhead
      const newActiveIndex = INTERIOR_SPACES.findIndex(
        (s) => currentFrame >= s.startFrame && currentFrame <= s.endFrame
      );
      activeSpaceIndexRef.current = newActiveIndex;
    },
  }));

  // Build the GSAP master timeline on mount
  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    INTERIOR_SPACES.forEach((space, index) => {
      const cardEl = cardRefs.current[index];
      if (!cardEl) return;

      const start = space.startFrame / totalFrames;
      const end = space.endFrame / totalFrames;
      const totalSpan = end - start;
      const fadeDuration = totalSpan * 0.22;

      // Initial off-screen state
      gsap.set(cardEl, {
        autoAlpha: 0,
        y: 28,
        filter: "blur(12px)",
        pointerEvents: "none",
      });

      // 1. Entrance animation (bidirectional autoAlpha and transform)
      tl.fromTo(
        cardEl,
        {
          autoAlpha: 0,
          y: 28,
          filter: "blur(12px)",
          pointerEvents: "none",
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          pointerEvents: "auto",
          ease: "power2.out",
          duration: fadeDuration,
        },
        start
      );

      // 2. Exit animation (bidirectional autoAlpha and transform)
      tl.to(
        cardEl,
        {
          autoAlpha: 0,
          y: -24,
          filter: "blur(12px)",
          pointerEvents: "none",
          ease: "power2.in",
          duration: fadeDuration,
        },
        end - fadeDuration
      );
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, [totalFrames]);

  // Subtle Mouse Parallax on the active glassmorphism card
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const activeIndex = activeSpaceIndexRef.current;
      if (activeIndex === -1) return;

      const activeCard = cardInnerRefs.current[activeIndex];
      if (!activeCard) return;

      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(activeCard, {
        x: normX * 10,
        y: normY * 8,
        rotateY: normX * 3.5,
        rotateX: -normY * 3.5,
        transformPerspective: 900,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      cardInnerRefs.current.forEach((card) => {
        if (card) {
          gsap.to(card, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      // Clean up all active card tweens
      const validCards = cardInnerRefs.current.filter((c): c is HTMLDivElement => c !== null);
      if (validCards.length > 0) {
        gsap.killTweensOf(validCards);
      }
    };
  }, []);

  return (
    <>
      {/* Glassmorphism Cards Container */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden p-6 sm:p-10 md:p-14">
        {INTERIOR_SPACES.map((space, index) => {
          const isLeft = space.position === "bottom-left";

          return (
            <div
              key={space.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`absolute bottom-16 sm:bottom-12 ${
                isLeft ? "left-6 sm:left-12" : "right-6 sm:right-12"
              } max-w-sm sm:max-w-md w-full will-change-transform`}
            >
              {/* Glassmorphic Card (with subtle 3D mouse parallax) */}
              <div
                ref={(el) => {
                  cardInnerRefs.current[index] = el;
                }}
                className="relative overflow-hidden rounded-2xl bg-black/45 backdrop-blur-2xl border border-white/10 p-6 sm:p-7 shadow-[0_25px_50px_rgba(0,0,0,0.7)] will-change-transform before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent"
              >
                {/* Header: Space Label & Frame Indicator */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                    <span className="font-mono text-[10px] tracking-[0.28em] text-white/60 uppercase font-medium">
                      {space.number} / {space.name}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] tracking-wider text-zinc-400 tabular-nums">
                    FRAMES {String(space.startFrame).padStart(4, "0")}–{String(space.endFrame).padStart(4, "0")}
                  </span>
                </div>

                {/* Space Title */}
                <h3 className="text-xl sm:text-2xl font-light tracking-wide text-white mb-2.5">
                  {space.title}
                </h3>

                {/* Narrative Architectural Text */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-zinc-300 font-light mb-4.5">
                  {space.description}
                </p>

                {/* Specification Badges */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.08]">
                  {space.specs.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[10px] tracking-wider text-zinc-300"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Active Indicator Hairline */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                  <div className="h-full bg-gradient-to-r from-zinc-500 to-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
});

export const InteriorTimeline = memo(InteriorTimelineComponent);
export default InteriorTimeline;
