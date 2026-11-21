"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";

export interface ImageSequenceCanvasProps {
  totalFrames?: number;
  initialPreloadCount?: number;
  frameDirectory?: string;
  framePrefix?: string;
  frameExtension?: string;
  framePadding?: number;
  backgroundConcurrency?: number;
  className?: string;
  aspectMode?: "cover" | "contain";
  showBackgroundBadge?: boolean;
  onInitialReady?: () => void;
  onBackgroundProgress?: (loaded: number, total: number) => void;
  onBackgroundComplete?: () => void;
}

export interface ImageSequenceCanvasRef {
  renderFrameOnScroll: (frameNumber: number) => void;
  getCurrentFrame: () => number;
  isInitialReady: () => boolean;
  isFullyCached: () => boolean;
  getRedrawCount: () => number;
  forceResize: () => void;
}

const ImageSequenceCanvasComponent = forwardRef<
  ImageSequenceCanvasRef,
  ImageSequenceCanvasProps
>(function ImageSequenceCanvas(
  {
    totalFrames = 1902,
    initialPreloadCount = 150,
    frameDirectory = "/frames",
    framePrefix = "frame_",
    frameExtension = ".jpg",
    framePadding = 4,
    backgroundConcurrency = 6,
    className = "",
    aspectMode = "cover",
    showBackgroundBadge = true,
    onInitialReady,
    onBackgroundProgress,
    onBackgroundComplete,
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Direct DOM references for preloader progress (0 React re-renders during load)
  const percentTextRef = useRef<HTMLSpanElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const counterTextRef = useRef<HTMLSpanElement | null>(null);
  const bgBadgeTextRef = useRef<HTMLSpanElement | null>(null);

  // In-memory cache for loaded frames: Map<frameNumber, HTMLImageElement>
  const framesCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());

  // Set of frame indices currently being fetched across all workers
  const fetchingSetRef = useRef<Set<number>>(new Set());

  // Priority queue for scrubbing: frames immediately needed around scroll position
  const priorityQueueRef = useRef<number[]>([]);

  // Active scroll target frame and last frame actually drawn to canvas
  const activeFrameRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(-1);
  const lastScrollDirectionRef = useRef<"forward" | "backward">("forward");

  // Redraw performance audit counter: strictly tracks actual canvas draw operations
  const redrawCountRef = useRef<number>(0);

  // Track initial preload completion
  const initialLoadedRef = useRef<number>(0);
  const isInitialReadyRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  // Stable callback refs
  const onInitialReadyRef = useRef(onInitialReady);
  const onBackgroundProgressRef = useRef(onBackgroundProgress);
  const onBackgroundCompleteRef = useRef(onBackgroundComplete);

  useEffect(() => {
    onInitialReadyRef.current = onInitialReady;
    onBackgroundProgressRef.current = onBackgroundProgress;
    onBackgroundCompleteRef.current = onBackgroundComplete;
  });

  // UI state only for coarse visibility transitions
  const [isPreloaderVisible, setIsPreloaderVisible] = useState<boolean>(true);
  const [isPreloaderFading, setIsPreloaderFading] = useState<boolean>(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState<boolean>(false);
  const [bgLoadedDisplay, setBgLoadedDisplay] = useState<number>(0);

  // Construct frame URL: e.g. /frames/frame_0001.jpg
  const getFrameUrl = useCallback(
    (index: number) => {
      const paddedNumber = String(index).padStart(framePadding, "0");
      const dir = frameDirectory.endsWith("/")
        ? frameDirectory.slice(0, -1)
        : frameDirectory;
      return `${dir}/${framePrefix}${paddedNumber}${frameExtension}`;
    },
    [frameDirectory, framePrefix, framePadding, frameExtension]
  );

  // Image loader with off-main-thread decoding, deduplication, and caching
  const loadImage = useCallback(
    (frameIndex: number): Promise<HTMLImageElement | null> => {
      if (framesCacheRef.current.has(frameIndex)) {
        return Promise.resolve(framesCacheRef.current.get(frameIndex)!);
      }

      if (fetchingSetRef.current.has(frameIndex)) {
        // In-flight: wait for cache insertion
        return new Promise((resolve) => {
          let attempts = 0;
          const check = () => {
            if (framesCacheRef.current.has(frameIndex)) {
              resolve(framesCacheRef.current.get(frameIndex)!);
            } else if (attempts++ > 60 || !fetchingSetRef.current.has(frameIndex)) {
              resolve(null);
            } else {
              setTimeout(check, 16);
            }
          };
          setTimeout(check, 16);
        });
      }

      fetchingSetRef.current.add(frameIndex);

      return new Promise((resolve) => {
        const img = new Image();
        let settled = false;

        const onFinish = async (success: boolean) => {
          if (settled) return;
          settled = true;
          fetchingSetRef.current.delete(frameIndex);

          if (success && img.naturalWidth > 0) {
            // Asynchronous off-main-thread bitmap decoding to eliminate 60 FPS jank
            if ("decode" in img) {
              try {
                await img.decode();
              } catch {
                // Decoding aborted or non-fatal, safe to proceed
              }
            }
            framesCacheRef.current.set(frameIndex, img);
            resolve(img);
          } else {
            resolve(null);
          }
        };

        img.onload = () => onFinish(true);
        img.onerror = () => onFinish(false);
        img.src = getFrameUrl(frameIndex);

        if (img.complete && img.naturalWidth > 0) {
          onFinish(true);
        }
      });
    },
    [getFrameUrl]
  );

  // Fast nearest-frame lookup with exact frame index return
  const getNearestLoadedFrame = useCallback(
    (
      targetFrame: number
    ): { img: HTMLImageElement; frameIndex: number } | null => {
      const cache = framesCacheRef.current;
      if (cache.has(targetFrame)) {
        return { img: cache.get(targetFrame)!, frameIndex: targetFrame };
      }

      // Search backwards first (smoother visual progression during forward scrub)
      for (let back = targetFrame - 1; back >= 1; back--) {
        if (cache.has(back)) {
          return { img: cache.get(back)!, frameIndex: back };
        }
      }

      // Search forwards
      for (let forward = targetFrame + 1; forward <= totalFrames; forward++) {
        if (cache.has(forward)) {
          return { img: cache.get(forward)!, frameIndex: forward };
        }
      }

      return null;
    },
    [totalFrames]
  );

  // Direct canvas render function: draws either exact or nearest loaded frame
  // Strictly checks lastDrawnFrameRef to ensure zero redundant redraws
  const drawFrameDirect = useCallback(
    (frameNumber: number) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const result = getNearestLoadedFrame(frameNumber);
      if (!result) return;

      const { img, frameIndex: actualDrawnIndex } = result;
      if (!img.naturalWidth || !img.naturalHeight) return;

      // REDRAW CHECK: If canvas already displays this exact frame, skip redraw
      if (actualDrawnIndex === lastDrawnFrameRef.current && actualDrawnIndex === frameNumber) {
        return;
      }

      // Auto-size canvas to devicePixelRatio (Retina support capped at 2x for memory efficiency)
      if (canvas.width === 0 || canvas.height === 0) {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round((rect.width || window.innerWidth) * dpr);
        canvas.height = Math.round((rect.height || window.innerHeight) * dpr);
      }

      const ctx = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true, // Lower latency, bypasses double-buffering compositing where supported
      });
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      if (aspectMode === "cover") {
        const scale = Math.max(cw / iw, ch / ih);
        const sw = Math.round(cw / scale);
        const sh = Math.round(ch / scale);
        const sx = Math.round((iw - sw) / 2);
        const sy = Math.round((ih - sh) / 2);

        // Integer coordinates prevent sub-pixel anti-aliasing CPU churn
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
      } else {
        const scale = Math.min(cw / iw, ch / ih);
        const dw = Math.round(iw * scale);
        const dh = Math.round(ih * scale);
        const dx = Math.round((cw - dw) / 2);
        const dy = Math.round((ch - dh) / 2);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
      }

      lastDrawnFrameRef.current = actualDrawnIndex;
      redrawCountRef.current += 1;
    },
    [aspectMode, getNearestLoadedFrame]
  );

  // Responsive & Retina Resize Handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      // Invalidate lastDrawnFrameRef on dimension change to force fresh crisp redraw
      lastDrawnFrameRef.current = -1;
      drawFrameDirect(activeFrameRef.current);
    }
  }, [drawFrameDirect]);

  // Comprehensive Resize and Screen Resolution Observers with complete unmount cleanup
  useEffect(() => {
    handleResize();

    const container = containerRef.current;
    if (!container) return;

    // 1. ResizeObserver for responsive container width/height changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container, { box: "content-box" });

    // 2. Window resize & orientation change listeners (passive for 60 FPS scrolling)
    const onResize = () => handleResize();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    // 3. Dynamic Retina / DevicePixelRatio media query listener
    let dprQuery: MediaQueryList | null = null;
    const onDprChange = () => handleResize();
    if (typeof window !== "undefined" && window.matchMedia) {
      dprQuery = window.matchMedia(
        `(resolution: ${window.devicePixelRatio || 1}dppx)`
      );
      try {
        dprQuery.addEventListener("change", onDprChange);
      } catch {
        // Fallback for older browsers
        dprQuery.addListener?.(onDprChange);
      }
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (dprQuery) {
        try {
          dprQuery.removeEventListener("change", onDprChange);
        } catch {
          dprQuery.removeListener?.(onDprChange);
        }
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [handleResize]);

  // Priority queue injector: schedules nearby frames when scrolling
  const schedulePriorityFrames = useCallback(
    (centerFrame: number) => {
      const windowSize = 30; // Pre-fetch 30 frames ahead in scroll direction
      const isFwd = lastScrollDirectionRef.current === "forward";

      const priorityList: number[] = [];
      priorityList.push(centerFrame);

      for (let i = 1; i <= windowSize; i++) {
        const next = isFwd ? centerFrame + i : centerFrame - i;
        if (next >= 1 && next <= totalFrames && !framesCacheRef.current.has(next)) {
          priorityList.push(next);
        }
        const opp = isFwd ? centerFrame - i : centerFrame + i;
        if (opp >= 1 && opp <= totalFrames && !framesCacheRef.current.has(opp)) {
          priorityList.push(opp);
        }
      }

      // Add to front of priority queue (deduped, bounded size)
      const existing = new Set(priorityQueueRef.current);
      const newItems = priorityList.filter((f) => !existing.has(f));
      priorityQueueRef.current = [...newItems, ...priorityQueueRef.current].slice(
        0,
        90
      );
    },
    [totalFrames]
  );

  // Imperative renderFrameOnScroll: Apple-style scroll scrubbing
  // Guarantees redraw occurs ONLY when calculated frame changes
  const renderFrameOnScroll = useCallback(
    (frameNumber: number) => {
      const clamped = Math.max(1, Math.min(totalFrames, Math.floor(frameNumber)));

      if (clamped > activeFrameRef.current) {
        lastScrollDirectionRef.current = "forward";
      } else if (clamped < activeFrameRef.current) {
        lastScrollDirectionRef.current = "backward";
      }
      activeFrameRef.current = clamped;

      // 1. Strict Guard: If frame is already in memory cache and rendered on canvas, RETURN IMMEDIATELY!
      if (clamped === lastDrawnFrameRef.current && framesCacheRef.current.has(clamped)) {
        return;
      }

      // 2. If frame is already in memory cache: draw directly and synchronously in the GSAP ticker frame
      if (framesCacheRef.current.has(clamped)) {
        drawFrameDirect(clamped);
        return;
      }

      // 3. If frame not yet in cache:
      // a) Draw nearest loaded frame immediately so canvas is never blank or black
      drawFrameDirect(clamped);

      // b) Prioritize loading this frame and its surrounding directional window
      schedulePriorityFrames(clamped);

      // c) Fetch the requested frame with top priority and draw immediately when ready
      loadImage(clamped).then((img) => {
        if (img && activeFrameRef.current === clamped) {
          drawFrameDirect(clamped);
        }
      });
    },
    [totalFrames, drawFrameDirect, schedulePriorityFrames, loadImage]
  );

  // Imperative handle for parent
  useImperativeHandle(ref, () => ({
    renderFrameOnScroll: (frame: number) => {
      renderFrameOnScroll(frame);
    },
    getCurrentFrame: () => activeFrameRef.current,
    isInitialReady: () => isInitialReadyRef.current,
    isFullyCached: () => isFullyLoaded,
    getRedrawCount: () => redrawCountRef.current,
    forceResize: () => handleResize(),
  }));

  // PHASE 1: Preload initial frames (1 to initialPreloadCount)
  // Strictly isolates DOM updates from React state to avoid any "Maximum update depth exceeded" error
  useEffect(() => {
    let isCancelled = false;
    const targetInitial = Math.min(initialPreloadCount, totalFrames);
    const initialBatchSize = 12;
    const initialQueue: number[] = Array.from(
      { length: targetInitial },
      (_, i) => i + 1
    );

    const updatePreloaderDOM = (loaded: number) => {
      const pct = Math.min(100, Math.round((loaded / targetInitial) * 100));
      if (percentTextRef.current) {
        percentTextRef.current.textContent = String(pct);
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      if (counterTextRef.current) {
        counterTextRef.current.textContent = `${loaded} / ${targetInitial} Frames`;
      }
    };

    const loadNextInitialBatch = async () => {
      while (initialQueue.length > 0 && !isCancelled) {
        const batch = initialQueue.splice(0, initialBatchSize);

        await Promise.all(
          batch.map(async (frameIndex) => {
            await loadImage(frameIndex);
            if (!isCancelled) {
              initialLoadedRef.current += 1;
              updatePreloaderDOM(initialLoadedRef.current);

              if (frameIndex === 1) {
                drawFrameDirect(1);
              }
            }
          })
        );
      }

      if (!isCancelled && initialLoadedRef.current >= targetInitial) {
        drawFrameDirect(1);
        isInitialReadyRef.current = true;
        onInitialReadyRef.current?.();

        setIsPreloaderFading(true);
        setTimeout(() => {
          if (!isCancelled) {
            setIsPreloaderVisible(false);
          }
        }, 500);
      }
    };

    loadNextInitialBatch();

    return () => {
      isCancelled = true;
    };
  }, [initialPreloadCount, totalFrames, loadImage, drawFrameDirect]);

  // PHASE 2: Background caching remaining frames (initialPreloadCount + 1 to totalFrames)
  // Prioritizes scrub window; throttles background updates; yields to main thread
  useEffect(() => {
    if (isPreloaderVisible) return;

    let isCancelled = false;
    const startFrame = initialPreloadCount + 1;
    if (startFrame > totalFrames) {
      setIsFullyLoaded(true);
      return;
    }

    const remainingSet = new Set<number>();
    for (let f = 1; f <= totalFrames; f++) {
      if (!framesCacheRef.current.has(f)) {
        remainingSet.add(f);
      }
    }

    let loadedCount = totalFrames - remainingSet.size;
    let lastReported = loadedCount;

    const runWorker = async () => {
      while (!isCancelled && remainingSet.size > 0) {
        // 1. Pick from priority queue first
        let nextFrame: number | undefined;
        while (priorityQueueRef.current.length > 0) {
          const candidate = priorityQueueRef.current.shift()!;
          if (remainingSet.has(candidate)) {
            nextFrame = candidate;
            break;
          }
        }

        // 2. If priority queue is empty, take next from remaining set
        if (nextFrame === undefined) {
          const iter = remainingSet.values().next();
          if (iter.done) break;
          nextFrame = iter.value;
        }

        remainingSet.delete(nextFrame);

        try {
          await loadImage(nextFrame);
        } catch {
          // Non-fatal
        }

        if (!isCancelled) {
          loadedCount = totalFrames - remainingSet.size;

          // If the newly loaded frame is what is currently active on screen, redraw immediately
          if (nextFrame === activeFrameRef.current) {
            drawFrameDirect(nextFrame);
          }

          // Throttle UI updates to avoid main-thread churn
          if (loadedCount - lastReported >= 30 || remainingSet.size === 0) {
            lastReported = loadedCount;
            setBgLoadedDisplay(loadedCount);
            if (bgBadgeTextRef.current) {
              const pct = Math.round((loadedCount / totalFrames) * 100);
              bgBadgeTextRef.current.textContent = `CACHING FRAMES: ${loadedCount} / ${totalFrames} (${pct}%)`;
            }
            onBackgroundProgressRef.current?.(loadedCount, totalFrames);
          }
        }

        // Yield between frames so user interaction and scrolling maintain strict 60 FPS
        await new Promise((res) => {
          if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(() => res(true), { timeout: 30 });
          } else {
            setTimeout(res, 4);
          }
        });
      }

      if (!isCancelled && remainingSet.size === 0) {
        setIsFullyLoaded(true);
        setBgLoadedDisplay(totalFrames);
        onBackgroundCompleteRef.current?.();
      }
    };

    // Run parallel background workers
    Array.from({ length: backgroundConcurrency }, () => runWorker());

    return () => {
      isCancelled = true;
    };
  }, [
    isPreloaderVisible,
    initialPreloadCount,
    totalFrames,
    backgroundConcurrency,
    loadImage,
    drawFrameDirect,
  ]);

  const preloadTarget = Math.min(initialPreloadCount, totalFrames);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-black select-none ${className}`}
    >
      {/* HTML5 Canvas with Retina Support */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-cover"
        style={{
          width: "100%",
          height: "100%",
          transform: "translateZ(0)", // Hardware composite layer promotion
        }}
      />

      {/* Background Cache Status Pill */}
      {showBackgroundBadge && !isPreloaderVisible && !isFullyLoaded && (
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-white/70 shadow-lg pointer-events-none transition-all duration-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span ref={bgBadgeTextRef}>
            CACHING FRAMES: {bgLoadedDisplay} / {totalFrames} (
            {Math.round((bgLoadedDisplay / totalFrames) * 100)}%)
          </span>
        </div>
      )}

      {/* Preloader Overlay (First 150 frames) */}
      {isPreloaderVisible && (
        <div
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black px-6 transition-all duration-500 ease-out ${
            isPreloaderFading
              ? "opacity-0 pointer-events-none scale-[1.02]"
              : "opacity-100 pointer-events-auto scale-100"
          }`}
        >
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

          <div className="relative w-full max-w-md flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-[1px] w-6 bg-zinc-600" />
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-zinc-400">
                Architectural Visualization
              </p>
              <span className="h-[1px] w-6 bg-zinc-600" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-light tracking-[0.2em] text-white uppercase mb-8">
              Villa Horizon
            </h1>

            {/* Percentage Display: updated directly via DOM ref */}
            <div className="relative mb-6">
              <span
                ref={percentTextRef}
                className="font-mono text-6xl sm:text-7xl font-extralight tracking-tighter text-white tabular-nums"
              >
                0
              </span>
              <span className="text-2xl font-light text-zinc-500 ml-1">%</span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-zinc-900/90 h-[3px] rounded-full overflow-hidden border border-zinc-800/80 mb-4 p-[0.5px]">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-zinc-300 via-white to-zinc-200 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                style={{ width: "0%" }}
              />
            </div>

            {/* Subtitle / Counter: updated directly via DOM ref */}
            <div className="flex justify-between w-full text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              <span>Initializing Sequence</span>
              <span ref={counterTextRef}>
                0 / {preloadTarget} Frames
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const ImageSequenceCanvas = memo(ImageSequenceCanvasComponent);
export default ImageSequenceCanvas;
