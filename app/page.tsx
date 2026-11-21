"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import ImageSequenceCanvas, {
  ImageSequenceCanvasRef,
} from "./components/ImageSequenceCanvas";
import Navbar, { NavbarRef } from "./components/Navbar";
import InteriorTimeline, {
  InteriorTimelineRef,
} from "./components/InteriorTimeline";
import FloatingProgressNav, {
  FloatingProgressNavRef,
} from "./components/FloatingProgressNav";
import ScrollProgressButton, {
  ScrollProgressButtonRef,
} from "./components/ScrollProgressButton";
import CustomCursor from "./components/CustomCursor";
import AtmosphereOverlay from "./components/AtmosphereOverlay";
import PhilosophySection from "./components/sections/PhilosophySection";
import SpatialProgramSection from "./components/sections/SpatialProgramSection";
import MaterialitySection from "./components/sections/MaterialitySection";
import EngineeringSection from "./components/sections/EngineeringSection";
import InquirySection from "./components/sections/InquirySection";
import Footer from "./components/sections/Footer";
import { useLenis } from "./hooks/useLenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const TOTAL_FRAMES = 1902;
  const INITIAL_PRELOAD = 150;
  // Pinned virtual track length in pixels:
  // 20,000px (~10.5px per frame) provides slow, cinematic, luxurious scrubbing
  const SCROLL_DISTANCE = 20000;

  // State only toggled once when initial 150 frames are ready
  const [isReady, setIsReady] = useState<boolean>(false);

  const pinnedSectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<ImageSequenceCanvasRef | null>(null);
  const navbarRef = useRef<NavbarRef | null>(null);
  const interiorTimelineRef = useRef<InteriorTimelineRef | null>(null);
  const floatingNavRef = useRef<FloatingProgressNavRef | null>(null);
  const scrollProgressTrackRef = useRef<HTMLDivElement | null>(null);
  const scrollBtnRef = useRef<ScrollProgressButtonRef | null>(null);
  const currentFrameRef = useRef<number>(1);

  // Initialize Lenis smooth scroll hook with GSAP ticker sync
  const { lenis } = useLenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.75,
    touchMultiplier: 1.1,
    syncScrollTrigger: true,
  });

  // Handle when initial 150 frames are fully loaded
  const handleInitialReady = useCallback(() => {
    setIsReady(true);
    // Draw initial frame
    canvasRef.current?.renderFrameOnScroll(1);

    // Refresh dimensions for ScrollTrigger and Lenis
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      lenis?.resize();
    });
  }, [lenis]);

  // Navigate to specific frame via smooth scroll
  const handleNavigateToFrame = useCallback(
    (targetFrame: number) => {
      const normalized = Math.max(
        0,
        Math.min(1, (targetFrame - 1) / (TOTAL_FRAMES - 1))
      );
      const targetScroll = normalized * SCROLL_DISTANCE;
      lenis?.scrollTo(targetScroll, { duration: 1.8 });
    },
    [lenis, TOTAL_FRAMES, SCROLL_DISTANCE]
  );

  // Navigate to section anchor by ID
  const handleNavigateToSection = useCallback(
    (sectionId: string) => {
      if (sectionId === "#experience") {
        lenis?.scrollTo(0, { duration: 1.6 });
      } else {
        lenis?.scrollTo(sectionId, { duration: 1.6, offset: -80 });
      }
    },
    [lenis]
  );

  // Smart Top-to-Bottom / Bottom-to-Top scroll action controller
  const handleScrollAction = useCallback(
    (direction: "down" | "up") => {
      if (direction === "up") {
        lenis?.scrollTo(0, { duration: 1.8 });
      } else {
        const currentScroll = typeof window !== "undefined" ? window.scrollY : 0;
        if (currentScroll < SCROLL_DISTANCE - 500) {
          lenis?.scrollTo("#philosophy", { duration: 1.8, offset: -80 });
        } else {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          lenis?.scrollTo(maxScroll, { duration: 2.0 });
        }
      }
    },
    [lenis, SCROLL_DISTANCE]
  );

  // Total Page Scroll Progress Observer for the Fixed Bottom-Right Button
  useEffect(() => {
    const updateOverallScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      scrollBtnRef.current?.updateProgress(progress);
    };

    if (lenis) {
      lenis.on("scroll", updateOverallScroll);
    }
    window.addEventListener("scroll", updateOverallScroll, { passive: true });
    updateOverallScroll();

    return () => {
      if (lenis) {
        lenis.off("scroll", updateOverallScroll);
      }
      window.removeEventListener("scroll", updateOverallScroll);
    };
  }, [lenis]);

  // Setup GSAP ScrollTrigger for strict 60 FPS Apple-style pinned scrubbing
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const pinTarget = pinnedSectionRef.current;
    if (!pinTarget) return;

    const st = ScrollTrigger.create({
      trigger: pinTarget,
      start: "top top",
      end: `+=${SCROLL_DISTANCE}`,
      pin: true,
      scrub: true, // 1:1 direct synchronization with smooth scroll without lag
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(1, self.progress));

        // Map progress (0 to 1) directly to frame sequence (1 to TOTAL_FRAMES)
        const frameIndex = Math.min(
          TOTAL_FRAMES,
          Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1)
        );

        // 1. Direct 60 FPS imperative UI updates (ZERO React virtual DOM re-renders during scroll)
        navbarRef.current?.updateProgress(progress, frameIndex);
        interiorTimelineRef.current?.updateProgress(progress, frameIndex);
        floatingNavRef.current?.updateProgress(progress, frameIndex);

        if (scrollProgressTrackRef.current) {
          scrollProgressTrackRef.current.style.transform = `scaleX(${progress})`;
        }

        // 2. STRICT REDRAW CHECK: Canvas redraws ONLY when the calculated frame changes
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          canvasRef.current?.renderFrameOnScroll(frameIndex);
        }
      },
    });

    ScrollTrigger.refresh();

    // Comprehensive lifecycle cleanup: kill triggers, remove listeners, prevent memory leaks
    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === pinTarget) {
          trigger.kill();
        }
      });
    };
  }, [TOTAL_FRAMES, SCROLL_DISTANCE]);

  return (
    <main className="bg-black text-white selection:bg-white selection:text-black min-h-screen">
      {/* Luxury Custom Cursor (fluid magnetic trailing ring) */}
      <CustomCursor />

      {/* Cinematic Film Grain & Soft Vignette Atmosphere Overlays */}
      <AtmosphereOverlay />

      {/* Unified Global Navigation Bar with Section Links, Active Capsule State, Theme Toggle & Inquire CTA */}
      <Navbar
        ref={navbarRef}
        onNavigateToSection={handleNavigateToSection}
        onNavigateToSpace={handleNavigateToFrame}
      />

      {/* Fixed Bottom-Right Top-to-Bottom Scroll Progress Button with Rounded Border & Percentage */}
      <ScrollProgressButton
        ref={scrollBtnRef}
        onScrollAction={handleScrollAction}
      />

      {/* 
        Pinned ScrollTrigger Section (#experience):
        Houses the fullscreen 3D Canvas, the floating progress dock,
        and the interior timeline glassmorphic space cards.
      */}
      <div
        id="experience"
        ref={pinnedSectionRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Fullscreen HTML5 Canvas Image Sequence with Responsive & Retina Support */}
        <ImageSequenceCanvas
          ref={canvasRef}
          totalFrames={TOTAL_FRAMES}
          initialPreloadCount={INITIAL_PRELOAD}
          frameDirectory="/frames"
          framePrefix="frame_"
          frameExtension=".jpg"
          framePadding={4}
          backgroundConcurrency={6}
          aspectMode="cover"
          showBackgroundBadge={true}
          onInitialReady={handleInitialReady}
          className="absolute inset-0 w-full h-full"
        />

        {/* 
          Interior Scroll Timeline Overlays:
          Glassmorphism cards for Entrance, Living Room, Kitchen, Bedroom, Bathroom, Garden.
          Positioned neatly in the bottom corners with opacity, translateY, and blur animations.
        */}
        {isReady && (
          <InteriorTimeline
            ref={interiorTimelineRef}
            totalFrames={TOTAL_FRAMES}
            onSelectSpace={handleNavigateToFrame}
          />
        )}

        {/* Floating Right-Side Room Progress Navigation */}
        {isReady && (
          <FloatingProgressNav
            ref={floatingNavRef}
            totalFrames={TOTAL_FRAMES}
            onNavigateToSpace={handleNavigateToFrame}
          />
        )}

        {/* Minimal Scroll Progress Track at Viewport Base: GPU-accelerated scaleX */}
        {isReady && (
          <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/10 pointer-events-none">
            <div
              ref={scrollProgressTrackRef}
              className="h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-300 origin-left will-change-transform"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        )}
      </div>

      {/* 01 · Architectural Philosophy & Vision */}
      <PhilosophySection />

      {/* 02 · Spatial Program, 3 Architectural Tiers & 6 Sequenced Rooms */}
      <SpatialProgramSection onNavigateToSpace={handleNavigateToFrame} />

      {/* 03 · Noble Materials & Artisanal Provenance */}
      <MaterialitySection />

      {/* 04 · High-Performance Climate Engineering & Infrastructure */}
      <EngineeringSection />

      {/* 05 · Private Acquisition & Confidential Dossier Transmission */}
      <InquirySection />

      {/* Architectural Monograph Footer & Global Directory */}
      <Footer onNavigateToSection={handleNavigateToSection} />
    </main>
  );
}
