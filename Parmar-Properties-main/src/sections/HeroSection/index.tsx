import { useEffect, useRef, useState } from "react";
import heroBg from "assets/back.webp";
import heroBuilding from "assets/house.webp";
import heroCloud from "assets/cloud.webp";
import heroCloudScroll from "assets/smoke.webp";

// Outlined SVG paths (Poppins Bold, 1200x420 viewBox) — getTotalLength() per letter
const PARMAR_PATHS = [
  "M 240.80,179.60 L 219.60,179.60 L 219.60,230.00 L 185.40,230.00 L 185.40,89.60 L 240.80,89.60 Q 257.60,89.60 280.80,101.20 Q 280.80,101.20 292.40,121.60 Q 292.40,121.60 292.40,134.80 Q 292.40,147.00 281.20,167.20 Q 281.20,167.20 258.00,179.60 Q 258.00,179.60 240.80,179.60 Z M 257.60,134.80 Q 257.60,126.40 248.00,117.20 Q 248.00,117.20 238.20,117.20 L 219.60,117.20 L 219.60,152.40 L 238.20,152.40 Q 248.00,152.40 257.60,143.20 Q 257.60,143.20 257.60,134.80 Z",
  "M 395.60,205.20 L 343.20,205.20 L 334.80,230.00 L 299.00,230.00 L 349.80,89.60 L 389.40,89.60 L 440.20,230.00 L 404.00,230.00 Z M 386.80,178.80 L 369.40,127.40 L 352.20,178.80 Z",
  "M 525.20,230.00 L 496.00,177.00 L 487.80,177.00 L 487.80,230.00 L 453.60,230.00 L 453.60,89.60 L 511.00,89.60 Q 527.60,89.60 551.00,101.20 Q 551.00,101.20 562.60,121.40 Q 562.60,121.40 562.60,133.80 Q 562.60,147.80 546.80,169.80 Q 546.80,169.80 531.40,174.40 L 563.80,230.00 Z M 487.80,152.80 L 509.00,152.80 Q 518.40,152.80 527.80,143.60 Q 527.80,143.60 527.80,135.20 Q 527.80,127.20 518.40,118.00 Q 518.40,118.00 509.00,118.00 L 487.80,118.00 Z",
  "M 741.00,89.60 L 741.00,230.00 L 706.80,230.00 L 706.80,145.80 L 675.40,230.00 L 647.80,230.00 L 616.20,145.60 L 616.20,230.00 L 582.00,230.00 L 582.00,89.60 L 622.40,89.60 L 661.80,186.80 L 700.80,89.60 Z",
  "M 851.00,205.20 L 798.60,205.20 L 790.20,230.00 L 754.40,230.00 L 805.20,89.60 L 844.80,89.60 L 895.60,230.00 L 859.40,230.00 Z M 842.20,178.80 L 824.80,127.40 L 807.60,178.80 Z",
  "M 980.60,230.00 L 951.40,177.00 L 943.20,177.00 L 943.20,230.00 L 909.00,230.00 L 909.00,89.60 L 966.40,89.60 Q 983.00,89.60 1006.40,101.20 Q 1006.40,101.20 1018.00,121.40 Q 1018.00,121.40 1018.00,133.80 Q 1018.00,147.80 1002.20,169.80 Q 1002.20,169.80 986.80,174.40 L 1019.20,230.00 Z M 943.20,152.80 L 964.40,152.80 Q 973.80,152.80 983.20,143.60 Q 983.20,143.60 983.20,135.20 Q 983.20,127.20 973.80,118.00 Q 973.80,118.00 964.40,118.00 L 943.20,118.00 Z",
];
const PROPS_PATHS = [
  "M 280.88,347.78 L 269.43,347.78 L 269.43,375.00 L 250.96,375.00 L 250.96,299.18 L 280.88,299.18 Q 289.95,299.18 302.48,305.45 Q 302.48,305.45 308.74,316.46 Q 308.74,316.46 308.74,323.59 Q 308.74,330.18 302.69,341.09 Q 302.69,341.09 290.17,347.78 Q 290.17,347.78 280.88,347.78 Z M 289.95,323.59 Q 289.95,319.06 284.77,314.09 Q 284.77,314.09 279.47,314.09 L 269.43,314.09 L 269.43,333.10 L 279.47,333.10 Q 284.77,333.10 289.95,328.13 Q 289.95,328.13 289.95,323.59 Z",
  "M 365.02,375.00 L 349.25,346.38 L 344.82,346.38 L 344.82,375.00 L 326.35,375.00 L 326.35,299.18 L 357.35,299.18 Q 366.31,299.18 378.95,305.45 Q 378.95,305.45 385.21,316.36 Q 385.21,316.36 385.21,323.05 Q 385.21,330.61 376.68,342.49 Q 376.68,342.49 368.37,344.98 L 385.86,375.00 Z M 344.82,333.31 L 356.27,333.31 Q 361.35,333.31 366.42,328.34 Q 366.42,328.34 366.42,323.81 Q 366.42,319.49 361.35,314.52 Q 361.35,314.52 356.27,314.52 L 344.82,314.52 Z",
  "M 401.64,336.88 Q 401.64,325.75 412.11,308.04 Q 412.11,308.04 429.93,298.10 Q 429.93,298.10 440.63,298.10 Q 451.32,298.10 469.14,308.04 Q 469.14,308.04 479.40,325.75 Q 479.40,325.75 479.40,336.88 Q 479.40,348.00 469.03,365.82 Q 469.03,365.82 451.32,375.76 Q 451.32,375.76 440.63,375.76 Q 429.93,375.76 412.11,365.82 Q 412.11,365.82 401.64,348.00 Q 401.64,348.00 401.64,336.88 Z M 460.61,336.88 Q 460.61,326.83 449.70,314.84 Q 449.70,314.84 440.63,314.84 Q 431.45,314.84 420.54,326.72 Q 420.54,326.72 420.54,336.88 Q 420.54,346.92 431.45,358.91 Q 431.45,358.91 440.63,358.91 Q 449.70,358.91 460.61,346.81 Q 460.61,346.81 460.61,336.88 Z",
  "M 527.57,347.78 L 516.13,347.78 L 516.13,375.00 L 497.66,375.00 L 497.66,299.18 L 527.57,299.18 Q 536.65,299.18 549.17,305.45 Q 549.17,305.45 555.44,316.46 Q 555.44,316.46 555.44,323.59 Q 555.44,330.18 549.39,341.09 Q 549.39,341.09 536.86,347.78 Q 536.86,347.78 527.57,347.78 Z M 536.65,323.59 Q 536.65,319.06 531.46,314.09 Q 531.46,314.09 526.17,314.09 L 516.13,314.09 L 516.13,333.10 L 526.17,333.10 Q 531.46,333.10 536.65,328.13 Q 536.65,328.13 536.65,323.59 Z",
  "M 591.52,313.98 L 591.52,329.32 L 616.25,329.32 L 616.25,343.57 L 591.52,343.57 L 591.52,360.20 L 619.49,360.20 L 619.49,375.00 L 573.05,375.00 L 573.05,299.18 L 619.49,299.18 L 619.49,313.98 Z",
  "M 678.14,375.00 L 662.37,346.38 L 657.95,346.38 L 657.95,375.00 L 639.48,375.00 L 639.48,299.18 L 670.47,299.18 Q 679.44,299.18 692.07,305.45 Q 692.07,305.45 698.34,316.36 Q 698.34,316.36 698.34,323.05 Q 698.34,330.61 689.81,342.49 Q 689.81,342.49 681.49,344.98 L 698.99,375.00 Z M 657.95,333.31 L 669.39,333.31 Q 674.47,333.31 679.55,328.34 Q 679.55,328.34 679.55,323.81 Q 679.55,319.49 674.47,314.52 Q 674.47,314.52 669.39,314.52 L 657.95,314.52 Z",
  "M 772.43,299.18 L 772.43,313.98 L 752.35,313.98 L 752.35,375.00 L 733.88,375.00 L 733.88,313.98 L 713.79,313.98 L 713.79,299.18 Z",
  "M 808.19,299.18 L 808.19,375.00 L 789.72,375.00 L 789.72,299.18 Z",
  "M 848.05,313.98 L 848.05,329.32 L 872.78,329.32 L 872.78,343.57 L 848.05,343.57 L 848.05,360.20 L 876.02,360.20 L 876.02,375.00 L 829.58,375.00 L 829.58,299.18 L 876.02,299.18 L 876.02,313.98 Z",
  "M 893.85,352.32 L 913.51,352.32 Q 913.94,356.53 918.91,360.96 Q 918.91,360.96 922.90,360.96 Q 927.01,360.96 931.76,357.18 Q 931.76,357.18 931.76,353.83 Q 931.76,351.02 927.98,347.35 Q 927.98,347.35 922.47,344.98 Q 922.47,344.98 917.39,343.46 Q 910.05,341.20 900.76,336.66 Q 900.76,336.66 894.07,327.80 Q 894.07,327.80 894.07,320.68 Q 894.07,310.09 909.40,298.10 Q 909.40,298.10 921.71,298.10 Q 934.24,298.10 949.58,310.09 Q 949.58,310.09 950.12,320.78 L 930.14,320.78 Q 929.92,317.11 924.95,312.90 Q 924.95,312.90 921.07,312.90 Q 917.72,312.90 913.61,316.46 Q 913.61,316.46 913.61,319.81 Q 913.61,323.48 920.53,327.59 Q 920.53,327.59 927.87,329.96 Q 935.21,332.45 944.39,336.98 Q 944.39,336.98 951.09,345.62 Q 951.09,345.62 951.09,352.43 Q 951.09,358.91 944.50,369.49 Q 944.50,369.49 931.97,375.76 Q 931.97,375.76 923.44,375.76 Q 915.13,375.76 901.95,370.36 Q 901.95,370.36 894.07,359.77 Q 894.07,359.77 893.85,352.32 Z",
];


export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportH, setViewportH] = useState(0);
  const [scrollVh, setScrollVh] = useState(500);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const pathLengthsRef = useRef<number[]>([]);
  const letterStartRef = useRef<number[]>([]);
  const letterEndRef = useRef<number[]>([]);
  const pathsInitRef = useRef(false);

  // Viewport height, responsive scroll-jack height, and prefers-reduced-motion tracking
  useEffect(() => {
    // 1. Viewport Height Setup
    setViewportH(document.documentElement.clientHeight);

    // 2. Responsive Scroll-Jack Height Setup
    const mQueryMobile = window.matchMedia("(max-width: 767px)");
    const updateScrollVh = (e: MediaQueryListEvent | MediaQueryList) => {
      setScrollVh(e.matches ? 220 : 500);
    };
    updateScrollVh(mQueryMobile);
    
    // 3. Prefers-Reduced-Motion Setup
    const mQueryMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
    };
    updateMotionPreference(mQueryMotion);

    // Add listeners
    if (mQueryMobile.addEventListener) {
      mQueryMobile.addEventListener("change", updateScrollVh);
      mQueryMotion.addEventListener("change", updateMotionPreference);
    } else {
      // fallback for older browsers
      mQueryMobile.addListener(updateScrollVh);
      mQueryMotion.addListener(updateMotionPreference);
    }

    // Debounced Resize Handler (~150ms)
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewportH(document.documentElement.clientHeight);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (mQueryMobile.removeEventListener) {
        mQueryMobile.removeEventListener("change", updateScrollVh);
        mQueryMotion.removeEventListener("change", updateMotionPreference);
      } else {
        mQueryMobile.addListener
          ? mQueryMobile.removeEventListener("change", updateScrollVh)
          : (mQueryMobile as any).removeListener(updateScrollVh);
        mQueryMotion.addListener
          ? mQueryMotion.removeEventListener("change", updateMotionPreference)
          : (mQueryMotion as any).removeListener(updateMotionPreference);
      }
      window.removeEventListener("resize", onResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Compute real path lengths once mounted
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || pathsInitRef.current) return;
    const pathEls = Array.from(svg.querySelectorAll<SVGPathElement>(".lp"));
    if (!pathEls.length) return;

    const lens = pathEls.map((el) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len); // hidden initially
      return len;
    });
    const total = lens.reduce((a, b) => a + b, 0);
    let cum = 0;
    const starts: number[] = [], ends: number[] = [];
    for (const l of lens) {
      starts.push(cum / total);
      cum += l;
      ends.push(cum / total);
    }
    pathLengthsRef.current = lens;
    letterStartRef.current = starts;
    letterEndRef.current = ends;
    pathsInitRef.current = true;
  });

  // Scroll progress
  useEffect(() => {
    const handle = () => {
      if (prefersReducedMotion) {
        setScrollProgress(0);
        return;
      }
      const section = sectionRef.current;
      if (!section) return;
      const scrolled = window.scrollY - section.offsetTop;
      const range = section.offsetHeight - (viewportH || document.documentElement.clientHeight);
      setScrollProgress(range > 0 ? Math.max(0, Math.min(1, scrolled / range)) : 0);
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, [viewportH, prefersReducedMotion]);

  // Sync <header> opacity
  useEffect(() => {
    const header = document.querySelector("header") as HTMLElement | null;
    if (!header) return;

    const updateHeaderStyle = () => {
      const isMenuOpen = header.getAttribute("data-mobile-menu-open") === "true";
      if (isMenuOpen) {
        // Reset styles so mobile menu is visible and interactive
        header.style.opacity = "";
        header.style.pointerEvents = "";
        header.style.transition = "";
      } else {
        const p1 = Math.min(1, scrollProgress / 0.30);
        const opacity = Math.max(0, 1 - p1 * 4);
        header.style.opacity = String(opacity);
        header.style.pointerEvents = opacity < 0.05 ? "none" : "";
        header.style.transition = "opacity 0.1s linear";
      }
    };

    // Run initially
    updateHeaderStyle();

    // Observe changes to attributes (specifically data-mobile-menu-open)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-mobile-menu-open") {
          updateHeaderStyle();
        }
      }
    });

    observer.observe(header, { attributes: true, attributeFilter: ["data-mobile-menu-open"] });

    return () => {
      observer.disconnect();
      header.style.opacity = header.style.pointerEvents = header.style.transition = "";
    };
  }, [scrollProgress]);

  // Drive per-letter dashoffsets
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !pathsInitRef.current) return;
    const pathEls = Array.from(svg.querySelectorAll<SVGPathElement>(".lp"));
    if (!pathEls.length) return;

    const lens = pathLengthsRef.current;
    const starts = letterStartRef.current;
    const ends = letterEndRef.current;

    // Phase 3: 0.60 → 0.85  (strokes draw in)
    const p3 = Math.max(0, Math.min(1, (scrollProgress - 0.60) / 0.25));
    const drawProgress = p3;

    pathEls.forEach((el, i) => {
      const len = lens[i] ?? 0;
      const start = starts[i] ?? 0;
      const end = ends[i] ?? 1;
      if (drawProgress <= start) {
        el.style.strokeDashoffset = String(len);
      } else if (drawProgress >= end) {
        el.style.strokeDashoffset = "0";
      } else {
        el.style.strokeDashoffset = String(len * (1 - (drawProgress - start) / (end - start)));
      }
    });
  }, [scrollProgress]);

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeOut2 = (t: number) => 1 - Math.pow(1 - t, 2);

  // ─── Phase map (all on a 0→1 scroll) ────────────────────────────
  // Phase 1 : 0.00 → 0.30  hero content fades, clouds slide apart
  // Phase 2 : 0.25 → 0.60  smoke cloud rises and FILLS the screen (white-out)
  // Phase 3 : 0.60 → 0.85  PARMAR PROPERTIES strokes draw in (on white mist)
  // Phase 4 : 0.75 → 0.95  image fill appears through letter cutouts
  // Phase 5 : 0.95 → 1.00  final white cover for section exit
  // ─────────────────────────────────────────────────────────────────

  const p1 = Math.min(1, scrollProgress / 0.30);
  const p2 = Math.max(0, Math.min(1, (scrollProgress - 0.25) / 0.35));   // cloud rise
  const p3 = Math.max(0, Math.min(1, (scrollProgress - 0.60) / 0.25));   // stroke draw
  const p4 = Math.max(0, Math.min(1, (scrollProgress - 0.75) / 0.20));   // image fill
  const p5 = Math.max(0, Math.min(1, (scrollProgress - 0.95) / 0.05));   // white exit

  const p1e = easeOut(p1);
  const p2e = easeOut(p2);
  const p3e = easeOut(p3);
  const p4e = easeOut(p4);

  // Sky zoom (very subtle)
  const skyScale = 1 + p1e * 0.06;

  // Building: rises in during p1, holds, then we keep it
  const buildingY = (1 - p1e) * 55;
  const buildingScale = 1;
  // Building fades slightly as cloud covers, then reappears through letters
  const buildingOpacity = Math.max(0.0, 1 - p2e * 0.7);

  // Hero content fades and lifts early
  const contentOpacity = Math.max(0, 1 - p1 * 2.5);
  const contentY = p1e * -50;

  // Decorative side clouds slide apart during p1
  const cloudLeftX = -p1e * 80;
  const cloudRightX = p1e * 80;
  const cloudSideOpacity = Math.max(0, 1 - p2e * 3);

  // Smoke cloud — KEY: rises from bottom to fully cover screen
  // Starts off-screen, rises to fill entire viewport
  // translateY: 40% → -20% (moves up past center)
  // scale: 1.0 → 2.5 (expands to cover)
  // opacity: fades in then stays
  const smokeY = 40 - p2e * 65;        // 40% → -25%
  const smokeScale = 1.0 + p2e * 1.8;      // 1.0 → 2.8
  const smokeOpacity = Math.min(1, p2 * 2.5); // fast fade-in, then stays at 1

  // Text layer — appears once cloud is covering (~p2 > 0.7)
  const textLayerOpacity = easeOut2(Math.max(0, (scrollProgress - 0.58) / 0.10));
  const maskScale = 0.85 + p3e * 0.15;
  const maskParallaxY = p4e * -4;

  // Stroke visibility: fades in with draw, fades out as image fill takes over
  const strokeOpacity = Math.max(
    0,
    Math.min(1, p3 * 8) - easeOut2(Math.max(0, (p4 - 0.50) / 0.50))
  );

  // Image fill through letter cutouts
  const fillProgress = easeOut(p4);

  // Dark tint over sky during phase 1 only
  const darkOpacity = 0.15 * (1 - p2e);

  // Bottom gradient fades as smoke covers
  const bottomGradientOpacity = Math.max(0, 1 - p2e * 2);

  // White exit cover
  const whiteOpacity = p5;

  return (
    <>
      <style>{`
        @keyframes layerEntrance {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroEntrance {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroLetterEntrance {
          from {
            opacity: 0;
            transform: translateY(40px);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
        @keyframes heroPopUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes cloudDrift {
          from {
            transform: translateX(-10%);
          }
          to {
            transform: translateX(10%);
          }
        }
        @keyframes buildingDrift {
          from {
            transform: translateX(-3%);
          }
          to {
            transform: translateX(3%);
          }
        }
        .animate-layer-entrance {
          animation: layerEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        .animate-hero-letter {
          display: inline-block;
          animation: heroLetterEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          will-change: transform, opacity, filter;
        }
        .animate-hero-paragraph {
          animation: heroEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 1200ms;
          opacity: 0;
        }
        .animate-hero-strong {
          animation: heroEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 1350ms;
          opacity: 0;
        }
        .animate-hero-button {
          animation: heroPopUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 1500ms;
          opacity: 0;
        }
        .animate-cloud-drift {
          width: 120%;
          max-w: none !important;
          margin-left: -10%;
          animation: cloudDrift 28s ease-in-out infinite alternate;
        }
        .animate-building-drift {
          width: 106%;
          max-w: none !important;
          margin-left: -3%;
          animation: buildingDrift 38s ease-in-out infinite alternate;
        }
      `}</style>
      {/* Dynamic scroll room so mobile devices have a shorter scroll distance */}
      <section ref={sectionRef} style={{ height: `${scrollVh}vh` }} className="relative w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* ── Layer 1: Sky ── */}
          <div className="absolute inset-0"
            style={{ transform: `scale(${skyScale})`, transformOrigin: "center center", willChange: "transform" }}>
            <div className="animate-layer-entrance w-full h-full">
              <img src={heroBg} alt="" aria-hidden="true" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* ── Layer 2: Dark tint (phase 1) ── */}
          <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: darkOpacity }} />

          {/* ── Layer 3: Building ── */}
          <div className="absolute bottom-0 inset-x-0 pointer-events-none z-10"
            style={{
              transform: `translateY(${buildingY}%) scale(${buildingScale})`,
              transformOrigin: "bottom center",
              opacity: buildingOpacity,
              willChange: "transform, opacity",
            }}>
            <div className="animate-layer-entrance w-full h-full">
              <div className="animate-building-drift w-full h-full">
                <img src={heroBuilding} alt="Luxury real estate building" className="w-full h-auto block" />
              </div>
            </div>
          </div>

          {/* ── Layer 4a: Left Cloud ── */}
          <div className="absolute pointer-events-none z-20"
            style={{ bottom: "10%", left: "-10%", width: "55%", opacity: cloudSideOpacity, transform: `translateX(${cloudLeftX}px)` }}>
            <div className="animate-layer-entrance w-full h-full">
              <div className="animate-cloud-drift w-full h-full">
                <img src={heroCloud} alt="" aria-hidden="true" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* ── Layer 4b: Right Cloud ── */}
          <div className="absolute pointer-events-none z-20"
            style={{ bottom: "15%", right: "-10%", width: "55%", opacity: cloudSideOpacity, transform: `translateX(${cloudRightX}px) scaleX(-1)` }}>
            <div className="animate-layer-entrance w-full h-full">
              <div className="animate-cloud-drift w-full h-full" style={{ animationDelay: "-14s" }}>
                <img src={heroCloud} alt="" aria-hidden="true" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* ── Layer 5: Bottom gradient ── */}
          <div className="absolute bottom-0 inset-x-0 pointer-events-none z-20"
            style={{ height: "40%", background: "linear-gradient(to top, rgba(255,255,255,0.65) 0%, transparent 100%)", opacity: bottomGradientOpacity }} />

          {/* ── Layer 6: SMOKE — rises to cover entire screen ── */}
          <div className="absolute pointer-events-none z-30"
            style={{
              bottom: "-20%",
              left: "-20%",
              width: "140%",
              opacity: smokeOpacity,
              transform: `translateY(${smokeY}%) scale(${smokeScale})`,
              willChange: "transform, opacity",
            }}>
            <img src={heroCloudScroll} alt="" aria-hidden="true"
              className="w-full h-auto object-cover"
              style={{ minHeight: "70vh" }} />
          </div>

          {/* ── Layer 7: PARMAR PROPERTIES — strokes + image fill ── */}
          <div className="absolute inset-0 pointer-events-none z-40"
            style={{
              opacity: textLayerOpacity,
              transform: `scale(${maskScale})`,
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}>

            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1200 420"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <mask id="parmar-mask">
                  <rect width="100%" height="100%" fill="black" />

                  <path fill="white" d="M 240.80,179.60 L 219.60,179.60 L 219.60,230.00 L 185.40,230.00 L 185.40,89.60 L 240.80,89.60 Q 257.60,89.60 280.80,101.20 Q 280.80,101.20 292.40,121.60 Q 292.40,121.60 292.40,134.80 Q 292.40,147.00 281.20,167.20 Q 281.20,167.20 258.00,179.60 Q 258.00,179.60 240.80,179.60 Z M 257.60,134.80 Q 257.60,126.40 248.00,117.20 Q 248.00,117.20 238.20,117.20 L 219.60,117.20 L 219.60,152.40 L 238.20,152.40 Q 248.00,152.40 257.60,143.20 Q 257.60,143.20 257.60,134.80 Z" />
                  <path fill="white" d="M 395.60,205.20 L 343.20,205.20 L 334.80,230.00 L 299.00,230.00 L 349.80,89.60 L 389.40,89.60 L 440.20,230.00 L 404.00,230.00 Z M 386.80,178.80 L 369.40,127.40 L 352.20,178.80 Z" />
                  <path fill="white" d="M 525.20,230.00 L 496.00,177.00 L 487.80,177.00 L 487.80,230.00 L 453.60,230.00 L 453.60,89.60 L 511.00,89.60 Q 527.60,89.60 551.00,101.20 Q 551.00,101.20 562.60,121.40 Q 562.60,121.40 562.60,133.80 Q 562.60,147.80 546.80,169.80 Q 546.80,169.80 531.40,174.40 L 563.80,230.00 Z M 487.80,152.80 L 509.00,152.80 Q 518.40,152.80 527.80,143.60 Q 527.80,143.60 527.80,135.20 Q 527.80,127.20 518.40,118.00 Q 518.40,118.00 509.00,118.00 L 487.80,118.00 Z" />
                  <path fill="white" d="M 741.00,89.60 L 741.00,230.00 L 706.80,230.00 L 706.80,145.80 L 675.40,230.00 L 647.80,230.00 L 616.20,145.60 L 616.20,230.00 L 582.00,230.00 L 582.00,89.60 L 622.40,89.60 L 661.80,186.80 L 700.80,89.60 Z" />
                  <path fill="white" d="M 851.00,205.20 L 798.60,205.20 L 790.20,230.00 L 754.40,230.00 L 805.20,89.60 L 844.80,89.60 L 895.60,230.00 L 859.40,230.00 Z M 842.20,178.80 L 824.80,127.40 L 807.60,178.80 Z" />
                  <path fill="white" d="M 980.60,230.00 L 951.40,177.00 L 943.20,177.00 L 943.20,230.00 L 909.00,230.00 L 909.00,89.60 L 966.40,89.60 Q 983.00,89.60 1006.40,101.20 Q 1006.40,101.20 1018.00,121.40 Q 1018.00,121.40 1018.00,133.80 Q 1018.00,147.80 1002.20,169.80 Q 1002.20,169.80 986.80,174.40 L 1019.20,230.00 Z M 943.20,152.80 L 964.40,152.80 Q 973.80,152.80 983.20,143.60 Q 983.20,143.60 983.20,135.20 Q 983.20,127.20 973.80,118.00 Q 973.80,118.00 964.40,118.00 L 943.20,118.00 Z" />
                  <path fill="white" d="M 280.88,347.78 L 269.43,347.78 L 269.43,375.00 L 250.96,375.00 L 250.96,299.18 L 280.88,299.18 Q 289.95,299.18 302.48,305.45 Q 302.48,305.45 308.74,316.46 Q 308.74,316.46 308.74,323.59 Q 308.74,330.18 302.69,341.09 Q 302.69,341.09 290.17,347.78 Q 290.17,347.78 280.88,347.78 Z M 289.95,323.59 Q 289.95,319.06 284.77,314.09 Q 284.77,314.09 279.47,314.09 L 269.43,314.09 L 269.43,333.10 L 279.47,333.10 Q 284.77,333.10 289.95,328.13 Q 289.95,328.13 289.95,323.59 Z" />
                  <path fill="white" d="M 365.02,375.00 L 349.25,346.38 L 344.82,346.38 L 344.82,375.00 L 326.35,375.00 L 326.35,299.18 L 357.35,299.18 Q 366.31,299.18 378.95,305.45 Q 378.95,305.45 385.21,316.36 Q 385.21,316.36 385.21,323.05 Q 385.21,330.61 376.68,342.49 Q 376.68,342.49 368.37,344.98 L 385.86,375.00 Z M 344.82,333.31 L 356.27,333.31 Q 361.35,333.31 366.42,328.34 Q 366.42,328.34 366.42,323.81 Q 366.42,319.49 361.35,314.52 Q 361.35,314.52 356.27,314.52 L 344.82,314.52 Z" />
                  <path fill="white" d="M 401.64,336.88 Q 401.64,325.75 412.11,308.04 Q 412.11,308.04 429.93,298.10 Q 429.93,298.10 440.63,298.10 Q 451.32,298.10 469.14,308.04 Q 469.14,308.04 479.40,325.75 Q 479.40,325.75 479.40,336.88 Q 479.40,348.00 469.03,365.82 Q 469.03,365.82 451.32,375.76 Q 451.32,375.76 440.63,375.76 Q 429.93,375.76 412.11,365.82 Q 412.11,365.82 401.64,348.00 Q 401.64,348.00 401.64,336.88 Z M 460.61,336.88 Q 460.61,326.83 449.70,314.84 Q 449.70,314.84 440.63,314.84 Q 431.45,314.84 420.54,326.72 Q 420.54,326.72 420.54,336.88 Q 420.54,346.92 431.45,358.91 Q 431.45,358.91 440.63,358.91 Q 449.70,358.91 460.61,346.81 Q 460.61,346.81 460.61,336.88 Z" />
                  <path fill="white" d="M 527.57,347.78 L 516.13,347.78 L 516.13,375.00 L 497.66,375.00 L 497.66,299.18 L 527.57,299.18 Q 536.65,299.18 549.17,305.45 Q 549.17,305.45 555.44,316.46 Q 555.44,316.46 555.44,323.59 Q 555.44,330.18 549.39,341.09 Q 549.39,341.09 536.86,347.78 Q 536.86,347.78 527.57,347.78 Z M 536.65,323.59 Q 536.65,319.06 531.46,314.09 Q 531.46,314.09 526.17,314.09 L 516.13,314.09 L 516.13,333.10 L 526.17,333.10 Q 531.46,333.10 536.65,328.13 Q 536.65,328.13 536.65,323.59 Z" />
                  <path fill="white" d="M 591.52,313.98 L 591.52,329.32 L 616.25,329.32 L 616.25,343.57 L 591.52,343.57 L 591.52,360.20 L 619.49,360.20 L 619.49,375.00 L 573.05,375.00 L 573.05,299.18 L 619.49,299.18 L 619.49,313.98 Z" />
                  <path fill="white" d="M 678.14,375.00 L 662.37,346.38 L 657.95,346.38 L 657.95,375.00 L 639.48,375.00 L 639.48,299.18 L 670.47,299.18 Q 679.44,299.18 692.07,305.45 Q 692.07,305.45 698.34,316.36 Q 698.34,316.36 698.34,323.05 Q 698.34,330.61 689.81,342.49 Q 689.81,342.49 681.49,344.98 L 698.99,375.00 Z M 657.95,333.31 L 669.39,333.31 Q 674.47,333.31 679.55,328.34 Q 679.55,328.34 679.55,323.81 Q 679.55,319.49 674.47,314.52 Q 674.47,314.52 669.39,314.52 L 657.95,314.52 Z" />
                  <path fill="white" d="M 772.43,299.18 L 772.43,313.98 L 752.35,313.98 L 752.35,375.00 L 733.88,375.00 L 733.88,313.98 L 713.79,313.98 L 713.79,299.18 Z" />
                  <path fill="white" d="M 808.19,299.18 L 808.19,375.00 L 789.72,375.00 L 789.72,299.18 Z" />
                  <path fill="white" d="M 848.05,313.98 L 848.05,329.32 L 872.78,329.32 L 872.78,343.57 L 848.05,343.57 L 848.05,360.20 L 876.02,360.20 L 876.02,375.00 L 829.58,375.00 L 829.58,299.18 L 876.02,299.18 L 876.02,313.98 Z" />
                  <path fill="white" d="M 893.85,352.32 L 913.51,352.32 Q 913.94,356.53 918.91,360.96 Q 918.91,360.96 922.90,360.96 Q 927.01,360.96 931.76,357.18 Q 931.76,357.18 931.76,353.83 Q 931.76,351.02 927.98,347.35 Q 927.98,347.35 922.47,344.98 Q 922.47,344.98 917.39,343.46 Q 910.05,341.20 900.76,336.66 Q 900.76,336.66 894.07,327.80 Q 894.07,327.80 894.07,320.68 Q 894.07,310.09 909.40,298.10 Q 909.40,298.10 921.71,298.10 Q 934.24,298.10 949.58,310.09 Q 949.58,310.09 950.12,320.78 L 930.14,320.78 Q 929.92,317.11 924.95,312.90 Q 924.95,312.90 921.07,312.90 Q 917.72,312.90 913.61,316.46 Q 913.61,316.46 913.61,319.81 Q 913.61,323.48 920.53,327.59 Q 920.53,327.59 927.87,329.96 Q 935.21,332.45 944.39,336.98 Q 944.39,336.98 951.09,345.62 Q 951.09,345.62 951.09,352.43 Q 951.09,358.91 944.50,369.49 Q 944.50,369.49 931.97,375.76 Q 931.97,375.76 923.44,375.76 Q 915.13,375.76 901.95,370.36 Q 901.95,370.36 894.07,359.77 Q 894.07,359.77 893.85,352.32 Z" />
                </mask>
              </defs>

              {/* Image fill through letter cutouts */}
              <g mask="url(#parmar-mask)" style={{ opacity: fillProgress }}>
                <image xlinkHref={heroBg}
                  x="0" y={`${maskParallaxY}%`} width="100%" height="110%"
                  preserveAspectRatio="xMidYMid slice" />
                <image xlinkHref={heroBuilding}
                  x="0" y={`${maskParallaxY * 0.6}%`} width="100%" height="100%"
                  preserveAspectRatio="xMidYMax slice" />
              </g>

              {/* PARMAR strokes — draw in per letter */}
              <path className="lp" d="M 240.80,179.60 L 219.60,179.60 L 219.60,230.00 L 185.40,230.00 L 185.40,89.60 L 240.80,89.60 Q 257.60,89.60 280.80,101.20 Q 280.80,101.20 292.40,121.60 Q 292.40,121.60 292.40,134.80 Q 292.40,147.00 281.20,167.20 Q 281.20,167.20 258.00,179.60 Q 258.00,179.60 240.80,179.60 Z M 257.60,134.80 Q 257.60,126.40 248.00,117.20 Q 248.00,117.20 238.20,117.20 L 219.60,117.20 L 219.60,152.40 L 238.20,152.40 Q 248.00,152.40 257.60,143.20 Q 257.60,143.20 257.60,134.80 Z" fill="none" stroke="rgba(60,55,50,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 395.60,205.20 L 343.20,205.20 L 334.80,230.00 L 299.00,230.00 L 349.80,89.60 L 389.40,89.60 L 440.20,230.00 L 404.00,230.00 Z M 386.80,178.80 L 369.40,127.40 L 352.20,178.80 Z" fill="none" stroke="rgba(60,55,50,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 525.20,230.00 L 496.00,177.00 L 487.80,177.00 L 487.80,230.00 L 453.60,230.00 L 453.60,89.60 L 511.00,89.60 Q 527.60,89.60 551.00,101.20 Q 551.00,101.20 562.60,121.40 Q 562.60,121.40 562.60,133.80 Q 562.60,147.80 546.80,169.80 Q 546.80,169.80 531.40,174.40 L 563.80,230.00 Z M 487.80,152.80 L 509.00,152.80 Q 518.40,152.80 527.80,143.60 Q 527.80,143.60 527.80,135.20 Q 527.80,127.20 518.40,118.00 Q 518.40,118.00 509.00,118.00 L 487.80,118.00 Z" fill="none" stroke="rgba(60,55,50,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 741.00,89.60 L 741.00,230.00 L 706.80,230.00 L 706.80,145.80 L 675.40,230.00 L 647.80,230.00 L 616.20,145.60 L 616.20,230.00 L 582.00,230.00 L 582.00,89.60 L 622.40,89.60 L 661.80,186.80 L 700.80,89.60 Z" fill="none" stroke="rgba(60,55,50,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 851.00,205.20 L 798.60,205.20 L 790.20,230.00 L 754.40,230.00 L 805.20,89.60 L 844.80,89.60 L 895.60,230.00 L 859.40,230.00 Z M 842.20,178.80 L 824.80,127.40 L 807.60,178.80 Z" fill="none" stroke="rgba(60,55,50,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 980.60,230.00 L 951.40,177.00 L 943.20,177.00 L 943.20,230.00 L 909.00,230.00 L 909.00,89.60 L 966.40,89.60 Q 983.00,89.60 1006.40,101.20 Q 1006.40,101.20 1018.00,121.40 Q 1018.00,121.40 1018.00,133.80 Q 1018.00,147.80 1002.20,169.80 Q 1002.20,169.80 986.80,174.40 L 1019.20,230.00 Z M 943.20,152.80 L 964.40,152.80 Q 973.80,152.80 983.20,143.60 Q 983.20,143.60 983.20,135.20 Q 983.20,127.20 973.80,118.00 Q 973.80,118.00 964.40,118.00 L 943.20,118.00 Z" fill="none" stroke="rgba(60,55,50,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              {/* PROPERTIES strokes */}
              <path className="lp" d="M 280.88,347.78 L 269.43,347.78 L 269.43,375.00 L 250.96,375.00 L 250.96,299.18 L 280.88,299.18 Q 289.95,299.18 302.48,305.45 Q 302.48,305.45 308.74,316.46 Q 308.74,316.46 308.74,323.59 Q 308.74,330.18 302.69,341.09 Q 302.69,341.09 290.17,347.78 Q 290.17,347.78 280.88,347.78 Z M 289.95,323.59 Q 289.95,319.06 284.77,314.09 Q 284.77,314.09 279.47,314.09 L 269.43,314.09 L 269.43,333.10 L 279.47,333.10 Q 284.77,333.10 289.95,328.13 Q 289.95,328.13 289.95,323.59 Z" fill="none" stroke="rgba(60,55,50,0.70)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 365.02,375.00 L 349.25,346.38 L 344.82,346.38 L 344.82,375.00 L 326.35,375.00 L 326.35,299.18 L 357.35,299.18 Q 366.31,299.18 378.95,305.45 Q 378.95,305.45 385.21,316.36 Q 385.21,316.36 385.21,323.05 Q 385.21,330.61 376.68,342.49 Q 376.68,342.49 368.37,344.98 L 385.86,375.00 Z M 344.82,333.31 L 356.27,333.31 Q 361.35,333.31 366.42,328.34 Q 366.42,328.34 366.42,323.81 Q 366.42,319.49 361.35,314.52 Q 361.35,314.52 356.27,314.52 L 344.82,314.52 Z" fill="none" stroke="rgba(60,55,50,0.70)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 401.64,336.88 Q 401.64,325.75 412.11,308.04 Q 412.11,308.04 429.93,298.10 Q 429.93,298.10 440.63,298.10 Q 451.32,298.10 469.14,308.04 Q 469.14,308.04 479.40,325.75 Q 479.40,325.75 479.40,336.88 Q 479.40,348.00 469.03,365.82 Q 469.03,365.82 451.32,375.76 Q 451.32,375.76 440.63,375.76 Q 429.93,375.76 412.11,365.82 Q 412.11,365.82 401.64,348.00 Q 401.64,348.00 401.64,336.88 Z M 460.61,336.88 Q 460.61,326.83 449.70,314.84 Q 449.70,314.84 440.63,314.84 Q 431.45,314.84 420.54,326.72 Q 420.54,326.72 420.54,336.88 Q 420.54,346.92 431.45,358.91 Q 431.45,358.91 440.63,358.91 Q 449.70,358.91 460.61,346.81 Q 460.61,346.81 460.61,336.88 Z" fill="none" stroke="rgba(60,55,50,0.70)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 527.57,347.78 L 516.13,347.78 L 516.13,375.00 L 497.66,375.00 L 497.66,299.18 L 527.57,299.18 Q 536.65,299.18 549.17,305.45 Q 549.17,305.45 555.44,316.46 Q 555.44,316.46 555.44,323.59 Q 555.44,330.18 549.39,341.09 Q 549.39,341.09 536.86,347.78 Q 536.86,347.78 527.57,347.78 Z M 536.65,323.59 Q 536.65,319.06 531.46,314.09 Q 531.46,314.09 526.17,314.09 L 516.13,314.09 L 516.13,333.10 L 526.17,333.10 Q 531.46,333.10 536.65,328.13 Q 536.65,328.13 536.65,323.59 Z" fill="none" stroke="rgba(60,55,50,0.70)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 591.52,313.98 L 591.52,329.32 L 616.25,329.32 L 616.25,343.57 L 591.52,343.57 L 591.52,360.20 L 619.49,360.20 L 619.49,375.00 L 573.05,375.00 L 573.05,299.18 L 619.49,299.18 L 619.49,313.98 Z" fill="none" stroke="rgba(60,55,50,0.70)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 678.14,375.00 L 662.37,346.38 L 657.95,346.38 L 657.95,375.00 L 639.48,375.00 L 639.48,299.18 L 670.47,299.18 Q 679.44,299.18 692.07,305.45 Q 692.07,305.45 698.34,316.36 Q 698.34,316.36 698.34,323.05 Q 698.34,330.61 689.81,342.49 Q 689.81,342.49 681.49,344.98 L 698.99,375.00 Z M 657.95,333.31 L 669.39,333.31 Q 674.47,333.31 679.55,328.34 Q 679.55,328.34 679.55,323.81 Q 679.55,319.49 674.47,314.52 Q 674.47,314.52 669.39,314.52 L 657.95,314.52 Z" fill="none" stroke="rgba(60,55,50,0.70)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 772.43,299.18 L 772.43,313.98 L 752.35,313.98 L 752.35,375.00 L 733.88,375.00 L 733.88,313.98 L 713.79,313.98 L 713.79,299.18 Z" fill="none" stroke="rgba(60,55,50,0.70)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 808.19,299.18 L 808.19,375.00 L 789.72,375.00 L 789.72,299.18 Z" fill="none" stroke="rgba(60,55,50,0.70)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 848.05,313.98 L 848.05,329.32 L 872.78,329.32 L 872.78,343.57 L 848.05,343.57 L 848.05,360.20 L 876.02,360.20 L 876.02,375.00 L 829.58,375.00 L 829.58,299.18 L 876.02,299.18 L 876.02,313.98 Z" fill="none" stroke="rgba(60,55,50,0.70)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
              <path className="lp" d="M 893.85,352.32 L 913.51,352.32 Q 913.94,356.53 918.91,360.96 Q 918.91,360.96 922.90,360.96 Q 927.01,360.96 931.76,357.18 Q 931.76,357.18 931.76,353.83 Q 931.76,351.02 927.98,347.35 Q 927.98,347.35 922.47,344.98 Q 922.47,344.98 917.39,343.46 Q 910.05,341.20 900.76,336.66 Q 900.76,336.66 894.07,327.80 Q 894.07,327.80 894.07,320.68 Q 894.07,310.09 909.40,298.10 Q 909.40,298.10 921.71,298.10 Q 934.24,298.10 949.58,310.09 Q 949.58,310.09 950.12,320.78 L 930.14,320.78 Q 929.92,317.11 924.95,312.90 Q 924.95,312.90 921.07,312.90 Q 917.72,312.90 913.61,316.46 Q 913.61,316.46 913.61,319.81 Q 913.61,323.48 920.53,327.59 Q 920.53,327.59 927.87,329.96 Q 935.21,332.45 944.39,336.98 Q 944.39,336.98 951.09,345.62 Q 951.09,345.62 951.09,352.43 Q 951.09,358.91 944.50,369.49 Q 944.50,369.49 931.97,375.76 Q 931.97,375.76 923.44,375.76 Q 915.13,375.76 901.95,370.36 Q 901.95,370.36 894.07,359.77 Q 894.07,359.77 893.85,352.32 Z" fill="none" stroke="rgba(60,55,50,0.70)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
            </svg>
          </div>

          {/* ── Layer 8: White exit cover ── */}
          <div className="absolute inset-0 bg-white pointer-events-none z-50" style={{ opacity: whiteOpacity }} />

          {/* ── Layer 9: Hero content ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-start z-30 text-center px-6"
            style={{ paddingTop: "18vh", opacity: contentOpacity, transform: `translateY(${contentY}px)`, pointerEvents: contentOpacity < 0.05 ? "none" : "auto" }}>
            <p className="text-white/70 text-xs font-semibold tracking-[0.25em] uppercase mb-4 animate-hero-paragraph"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              South Mumbai's Trusted Luxury Real Estate Advisory
            </p>
            <h1 className="text-white font-bold leading-[1.05] mb-5 overflow-hidden flex flex-wrap justify-center"
              style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(42px, 7.5vw, 110px)", letterSpacing: "-0.03em", textShadow: "0 2px 24px rgba(0,0,0,0.18)" }}>
              {"Parmar Properties".split("").map((char, index) => (
                <span
                  key={index}
                  className="animate-hero-letter"
                  style={{ animationDelay: `${300 + index * 60}ms` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
            <p className="text-white/85 mb-10 max-w-xl leading-relaxed animate-hero-strong"
              style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(15px, 1.4vw, 19px)" }}>
              <strong className="font-semibold text-white">Building Relationships</strong>
            </p>
            <a href="https://parmarproperties.in/contact"
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold rounded-full px-7 py-3.5 hover:bg-gray-800 transition-colors animate-hero-button"
              style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(14px, 1.1vw, 16px)" }}>
              Explore Properties <span>→</span>
            </a>
          </div>

          {/* ── Layer 10: Scroll hint ── */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none z-30"
            style={{ opacity: Math.max(0, 1 - p1 * 4) }}>
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}>Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
          </div>

        </div>
      </section>
    </>
  );
};