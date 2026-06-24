import { useEffect, useRef, useState } from "react";
import heroBg from "assets/back.webp";
import heroBuilding from "assets/house.webp";
import heroCloud from "assets/cloud.webp";
import heroCloudScroll from "assets/smoke.webp";
import { hero } from "@/content/content";

const PARMAR_PATHS = [
  "M 202.734 26.709 L 210.4 0 L 227.441 0 L 227.441 71.094 L 214.844 71.094 L 214.844 50.049 L 215.43 16.797 L 206.104 47.656 L 199.316 47.656 L 190.967 18.115 L 191.553 50.049 L 191.553 71.094 L 178.955 71.094 L 178.955 0 L 195.996 0 L 202.734 26.709 Z M 132.861 44.531 L 132.861 71.094 L 119.141 71.094 L 119.141 0 L 142.969 0 Q 148.877 0 153.662 1.392 Q 158.447 2.783 161.865 5.469 Q 165.234 8.154 167.065 12.158 Q 168.896 16.162 168.896 21.436 Q 168.896 25.244 167.993 28.296 Q 167.09 31.348 165.43 33.74 Q 163.721 36.182 161.353 37.988 Q 158.984 39.795 156.055 41.113 L 171.338 70.459 L 171.338 71.094 L 156.641 71.094 L 143.262 44.531 L 132.861 44.531 Z M 312.891 44.531 L 312.891 71.094 L 299.17 71.094 L 299.17 0 L 322.998 0 Q 328.906 0 333.691 1.392 Q 338.477 2.783 341.895 5.469 Q 345.264 8.154 347.095 12.158 Q 348.926 16.162 348.926 21.436 Q 348.926 25.244 348.022 28.296 Q 347.119 31.348 345.459 33.74 Q 343.75 36.182 341.382 37.988 Q 339.014 39.795 336.084 41.113 L 351.367 70.459 L 351.367 71.094 L 336.67 71.094 L 323.291 44.531 L 312.891 44.531 Z M 72.754 56.25 L 68.555 71.094 L 54.102 71.094 L 77.393 0 L 89.844 0 L 112.695 71.094 L 98.242 71.094 L 94.092 56.25 L 72.754 56.25 Z M 252.783 56.25 L 248.584 71.094 L 234.131 71.094 L 257.422 0 L 269.873 0 L 292.725 71.094 L 278.271 71.094 L 274.121 56.25 L 252.783 56.25 Z M 13.721 71.094 L 0 71.094 L 0 0 L 24.316 0 Q 30.127 0 34.814 1.685 Q 39.502 3.369 42.822 6.348 Q 46.094 9.375 47.876 13.574 Q 49.658 17.774 49.658 22.901 Q 49.658 27.686 47.876 31.738 Q 46.094 35.791 42.822 38.721 Q 39.502 41.699 34.814 43.359 Q 30.127 45.02 24.316 45.02 L 13.721 45.02 L 13.721 71.094 Z M 24.316 33.887 L 13.721 33.887 L 13.721 11.133 L 24.316 11.133 Q 27.246 11.133 29.395 12.061 Q 31.543 12.988 33.008 14.6 Q 34.424 16.211 35.132 18.359 Q 35.84 20.508 35.84 22.998 Q 35.84 25.147 35.132 27.124 Q 34.424 29.102 33.008 30.615 Q 31.543 32.129 29.395 33.008 Q 27.246 33.887 24.316 33.887 Z M 143.018 33.399 L 132.861 33.399 L 132.861 11.133 L 142.969 11.133 Q 145.801 11.133 147.998 11.817 Q 150.195 12.5 151.709 13.77 Q 153.418 15.186 154.272 17.359 Q 155.127 19.531 155.127 22.363 Q 155.127 24.707 154.468 26.611 Q 153.809 28.516 152.539 29.883 Q 151.025 31.592 148.608 32.495 Q 146.192 33.398 143.018 33.399 Z M 323.047 33.399 L 312.891 33.399 L 312.891 11.133 L 322.998 11.133 Q 325.83 11.133 328.027 11.817 Q 330.225 12.5 331.738 13.77 Q 333.447 15.186 334.302 17.359 Q 335.156 19.531 335.156 22.363 Q 335.156 24.707 334.497 26.611 Q 333.838 28.516 332.568 29.883 Q 331.055 31.592 328.638 32.495 Q 326.221 33.398 323.048 33.399 Z M 90.869 44.58 L 76.123 44.58 L 83.594 18.408 L 90.869 44.58 Z M 270.898 44.58 L 256.152 44.58 L 263.623 18.408 L 270.898 44.58 Z"
];
const PROPS_PATHS = [
  "M 253.711 40.918 L 253.711 60.987 L 287.842 60.987 L 287.842 72.071 L 239.941 72.071 L 239.941 0.977 L 287.695 0.977 L 287.695 12.158 L 253.711 12.158 L 253.711 30.078 L 282.91 30.078 L 282.91 40.918 L 253.711 40.918 Z M 493.75 40.918 L 493.75 60.987 L 527.881 60.987 L 527.881 72.071 L 479.98 72.071 L 479.98 0.977 L 527.734 0.977 L 527.734 12.158 L 493.75 12.158 L 493.75 30.078 L 522.949 30.078 L 522.949 40.918 L 493.75 40.918 Z M 550.635 50 Q 550.732 53.223 551.758 55.518 Q 552.783 57.813 554.639 59.278 Q 556.445 60.742 559.009 61.426 Q 561.572 62.11 564.648 62.11 Q 567.383 62.11 569.507 61.475 Q 571.631 60.84 573.096 59.717 Q 574.561 58.594 575.342 57.007 Q 576.123 55.42 576.123 53.516 Q 576.123 51.612 575.464 49.951 Q 574.805 48.291 573.242 46.826 Q 571.631 45.41 569.067 44.214 Q 566.504 43.018 562.695 41.992 Q 556.787 40.381 552.319 38.086 Q 547.852 35.791 545.02 33.057 Q 542.188 30.323 540.747 27.002 Q 539.307 23.682 539.307 19.776 Q 539.307 15.283 541.211 11.621 Q 543.115 7.959 546.484 5.371 Q 549.854 2.783 554.443 1.392 Q 559.033 0 564.404 0 Q 569.971 0 574.585 1.612 Q 579.199 3.223 582.52 6.104 Q 585.84 9.033 587.695 13.037 Q 589.551 17.041 589.551 21.826 L 576.172 21.826 Q 576.074 19.434 575.317 17.432 Q 574.561 15.43 573.096 13.965 Q 571.582 12.549 569.36 11.743 Q 567.139 10.938 564.16 10.938 Q 561.426 10.938 559.302 11.597 Q 557.178 12.256 555.713 13.428 Q 554.248 14.649 553.491 16.284 Q 552.734 17.92 552.734 19.824 Q 552.734 21.826 553.735 23.438 Q 554.736 25.049 556.641 26.319 Q 558.545 27.637 561.255 28.711 Q 563.965 29.785 567.383 30.713 Q 571.045 31.739 574.365 33.203 Q 577.686 34.668 580.469 36.573 Q 584.668 39.698 587.158 43.848 Q 589.648 47.998 589.648 53.418 Q 589.648 58.106 587.769 61.743 Q 585.889 65.381 582.568 67.871 Q 579.248 70.41 574.658 71.704 Q 570.068 72.998 564.648 72.998 Q 559.326 72.998 554.126 71.411 Q 548.926 69.824 545.068 66.748 Q 541.406 63.721 539.282 59.619 Q 537.158 55.518 537.158 50 L 550.635 50 Z M 72.852 45.508 L 72.852 72.071 L 59.131 72.071 L 59.131 0.977 L 82.959 0.977 Q 88.867 0.977 93.652 2.368 Q 98.438 3.76 101.855 6.446 Q 105.225 9.131 107.056 13.135 Q 108.887 17.139 108.887 22.412 Q 108.887 26.221 107.983 29.273 Q 107.08 32.324 105.42 34.717 Q 103.711 37.158 101.343 38.965 Q 98.975 40.772 96.045 42.09 L 111.328 71.436 L 111.328 72.071 L 96.631 72.071 L 83.252 45.508 L 72.852 45.508 Z M 312.891 45.508 L 312.891 72.071 L 299.17 72.071 L 299.17 0.977 L 322.998 0.977 Q 328.906 0.977 333.691 2.368 Q 338.477 3.76 341.895 6.446 Q 345.264 9.131 347.095 13.135 Q 348.926 17.139 348.926 22.412 Q 348.926 26.221 348.022 29.273 Q 347.119 32.324 345.459 34.717 Q 343.75 37.158 341.382 38.965 Q 339.014 40.772 336.084 42.09 L 351.367 71.436 L 351.367 72.071 L 336.67 72.071 L 323.291 45.508 L 312.891 45.508 Z M 463.33 0.977 L 463.33 12.061 L 449.463 12.061 L 449.463 61.035 L 463.33 61.035 L 463.33 72.071 L 422.217 72.071 L 422.217 61.035 L 435.742 61.035 L 435.742 12.061 L 422.217 12.061 L 422.217 0.977 L 463.33 0.977 Z M 389.502 12.158 L 389.502 72.071 L 375.732 72.071 L 375.732 12.158 L 354.102 12.158 L 354.102 0.977 L 411.426 0.977 L 411.426 12.158 L 389.502 12.158 Z M 13.721 72.071 L 0 72.071 L 0 0.977 L 24.316 0.977 Q 30.127 0.977 34.814 2.661 Q 39.502 4.346 42.822 7.324 Q 46.094 10.352 47.876 14.551 Q 49.658 18.75 49.658 23.877 Q 49.658 28.662 47.876 32.715 Q 46.094 36.768 42.822 39.698 Q 39.502 42.676 34.814 44.336 Q 30.127 45.996 24.316 45.996 L 13.721 45.996 L 13.721 72.071 Z M 193.75 72.071 L 180.029 72.071 L 180.029 0.977 L 204.346 0.977 Q 210.156 0.977 214.844 2.661 Q 219.531 4.346 222.852 7.324 Q 226.123 10.352 227.905 14.551 Q 229.688 18.75 229.688 23.877 Q 229.688 28.662 227.905 32.715 Q 226.123 36.768 222.852 39.698 Q 219.531 42.676 214.844 44.336 Q 210.156 45.996 204.346 45.996 L 193.75 45.996 L 193.75 72.071 Z M 168.75 41.748 Q 168.75 46.338 167.92 50.464 Q 167.09 54.59 165.527 58.106 Q 163.867 61.621 161.426 64.551 Q 158.984 67.481 155.859 69.434 Q 153.027 71.143 149.634 72.095 Q 146.24 73.047 142.334 73.047 Q 138.184 73.047 134.668 71.973 Q 131.152 70.899 128.271 68.946 Q 125.439 66.895 123.193 63.989 Q 120.947 61.084 119.434 57.422 Q 118.066 54.053 117.358 50.098 Q 116.65 46.143 116.65 41.748 L 116.65 31.397 Q 116.65 26.709 117.456 22.51 Q 118.262 18.311 119.824 14.746 Q 121.338 11.377 123.511 8.643 Q 125.684 5.908 128.516 3.955 Q 131.299 2.051 134.766 1.026 Q 138.232 0 142.285 0 Q 146.387 0 149.976 1.05 Q 153.564 2.1 156.445 4.053 Q 159.326 5.908 161.499 8.545 Q 163.672 11.182 165.234 14.356 Q 166.943 17.969 167.847 22.266 Q 168.75 26.563 168.75 31.397 L 168.75 41.748 Z M 154.834 31.299 L 154.834 41.748 Q 154.834 44.385 154.565 46.826 Q 154.297 49.268 153.76 51.319 Q 153.076 53.955 151.929 56.031 Q 150.781 58.106 149.121 59.473 Q 147.803 60.596 146.094 61.182 Q 144.385 61.768 142.334 61.768 Q 140.186 61.768 138.501 61.133 Q 136.816 60.498 135.498 59.326 Q 134.082 58.008 133.032 55.884 Q 131.982 53.76 131.445 51.172 Q 130.957 49.121 130.762 46.729 Q 130.566 44.336 130.566 41.748 L 130.566 31.299 Q 130.566 28.565 130.786 26.074 Q 131.006 23.584 131.494 21.485 Q 132.129 18.75 133.276 16.699 Q 134.424 14.649 136.084 13.281 Q 137.305 12.354 138.843 11.865 Q 140.381 11.377 142.285 11.377 Q 144.287 11.377 145.923 11.914 Q 147.559 12.451 148.877 13.428 Q 150.537 14.746 151.758 16.822 Q 152.979 18.897 153.711 21.533 Q 154.297 23.633 154.565 26.099 Q 154.834 28.565 154.834 31.299 Z M 24.316 34.864 L 13.721 34.864 L 13.721 12.11 L 24.316 12.11 Q 27.246 12.11 29.395 13.037 Q 31.543 13.965 33.008 15.576 Q 34.424 17.188 35.132 19.336 Q 35.84 21.485 35.84 23.975 Q 35.84 26.123 35.132 28.101 Q 34.424 30.078 33.008 31.592 Q 31.543 33.106 29.395 33.985 Q 27.246 34.864 24.316 34.864 Z M 204.346 34.864 L 193.75 34.864 L 193.75 12.11 L 204.346 12.11 Q 207.275 12.11 209.424 13.037 Q 211.572 13.965 213.037 15.576 Q 214.453 17.188 215.161 19.336 Q 215.869 21.485 215.869 23.975 Q 215.869 26.123 215.161 28.101 Q 214.453 30.078 213.037 31.592 Q 211.572 33.106 209.424 33.985 Q 207.275 34.864 204.346 34.864 Z M 83.008 34.375 L 72.852 34.375 L 72.852 12.11 L 82.959 12.11 Q 85.791 12.11 87.988 12.793 Q 90.186 13.477 91.699 14.746 Q 93.408 16.162 94.263 18.335 Q 95.117 20.508 95.117 23.34 Q 95.117 25.684 94.458 27.588 Q 93.799 29.492 92.529 30.86 Q 91.016 32.569 88.599 33.472 Q 86.182 34.375 83.009 34.375 Z M 323.047 34.375 L 312.891 34.375 L 312.891 12.11 L 322.998 12.11 Q 325.83 12.11 328.027 12.793 Q 330.225 13.477 331.738 14.746 Q 333.447 16.162 334.302 18.335 Q 335.156 20.508 335.156 23.34 Q 335.156 25.684 334.497 27.588 Q 333.838 29.492 332.568 30.86 Q 331.055 32.569 328.638 33.472 Q 326.221 34.375 323.048 34.375 Z"
];

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportH, setViewportH] = useState(0);
  const [viewportW, setViewportW] = useState(0);
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
    setViewportW(document.documentElement.clientWidth);

    // 2. Responsive Scroll-Jack Height Setup
    const mQueryMobile = window.matchMedia("(max-width: 767px)");
    const updateScrollVh = (e: MediaQueryListEvent | MediaQueryList) => {
      setScrollVh(e.matches ? 600 : 1200); // Increased scroll height gives more ticks for all phases
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
        setViewportW(document.documentElement.clientWidth);
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

  // Compute real path lengths once mounted ([] = run once after first render)
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

    // Both paths start at same time, draw slowly across a wider scroll window
    // PARMAR + PROPERTIES: Draw slowly and finish right when the building starts fading out (Phase 5: 0.85)
    const starts = [0.10, 0.10];
    const ends = [0.85, 0.85];

    pathLengthsRef.current = lens;
    letterStartRef.current = starts;
    letterEndRef.current = ends;
    pathsInitRef.current = true;
  }, []);

  // Scroll progress
  useEffect(() => {
    let ticking = false;

    const handle = () => {
      if (prefersReducedMotion) {
        setScrollProgress(0);
        return;
      }
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const section = sectionRef.current;
          if (section) {
            const scrolled = window.scrollY - section.offsetTop;
            const range = section.offsetHeight - (viewportH || document.documentElement.clientHeight);
            setScrollProgress(range > 0 ? Math.max(0, Math.min(1, scrolled / range)) : 0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, [viewportH, prefersReducedMotion]);

  // The header's own scroll logic handles visibility.
  // Drive per-path dashoffsets — each path has its own scroll range
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !pathsInitRef.current) return;
    const pathEls = Array.from(svg.querySelectorAll<SVGPathElement>(".lp"));
    if (!pathEls.length) return;

    const lens = pathLengthsRef.current;
    const starts = letterStartRef.current;
    const ends = letterEndRef.current;

    pathEls.forEach((el, i) => {
      const len = lens[i] ?? 0;
      const s = starts[i] ?? 0;  // this path's scroll start
      const e = ends[i] ?? 1;  // this path's scroll end
      const t = Math.max(0, Math.min(1, (scrollProgress - s) / (e - s)));
      el.style.strokeDashoffset = String(len * (1 - t));
    });
  }, [scrollProgress]);

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeOut2 = (t: number) => 1 - Math.pow(1 - t, 2);

  // ─── Phase map ─────────────────────────────────────────────────────
  // Phase 1 : 0.00 → 0.40  building rises, text sinks behind it
  // Phase 2 : 0.40 → 0.75  SVG strokes draw ON building + image fill simultaneously
  //                          NO SMOKE during this phase — building stays fully visible
  // Phase 3 : 0.75 → 0.92  smoke/fog blazes in (AFTER SVG is complete)
  // Phase 4 : 0.92 → 1.00  white exit — next section begins
  // ───────────────────────────────────────────────────────────
  const p1 = Math.min(1, scrollProgress / 0.40);     // building rise (0→0.40)

  // Navigation Bar fade out: stays fully visible for the first 80%, then fades out quickly by 90%
  const navFadeProgress = Math.max(0, Math.min(1, (scrollProgress - 0.80) / 0.10));
  const navOpacity = Math.max(0, 1 - navFadeProgress);
  const p2 = Math.max(0, Math.min(1, (scrollProgress - 0.70) / 0.20));      // smoke (0.65→0.85)
  const p3 = Math.max(0, Math.min(1, (scrollProgress - 0.30) / 0.45));      // 0.30→0.75
  const p4 = Math.max(0, Math.min(1, (scrollProgress - 0.72) / 0.20));      // 0.72→0.92
  const p5 = Math.max(0, Math.min(1, (scrollProgress - 0.92) / 0.08));      // white exit

  const p1e = easeOut(p1);
  const p2e = easeOut(p2);
  const p3e = easeOut(p3);
  const p4e = easeOut(p4);

  // Sky zoom (very subtle)
  const skyScale = 1 + p1e * 0.06;

  // Mobile detection — gated on viewportW > 0 so first render (0) defaults to desktop behavior
  const isMobile = viewportW > 0 && viewportW < 768;

  // Building: anchored at top.
  // Desktop: starts with top-edge at 45% from viewport top so it doesn't clip the button.
  // Mobile:  starts at 175% to balance the entrance from below the screen.
  const buildingStartY = isMobile ? 175 : 45;
  const buildingY = buildingStartY - scrollProgress * 80;
  
  // Building POP effect: scales up to 15% larger as you scroll, creating a looming 3D effect
  const buildingScale = 1 + p1e * 0.15;

  // Fade IN the sky overlay as SVG nears completion (starts at 0.60, fully covers outside building by 0.70)
  const buildingFadeProgress = Math.max(0, Math.min(1, (scrollProgress - 0.60) / 0.10));
  const skyOverlayOpacity = easeOut(buildingFadeProgress);
  const buildingOpacity = 1; // z-25 building stays opaque permanently!

  // Hero content: sinks DOWN into the rising building
  const contentOpacity = Math.max(0, 1 - p1 * 2.0);
  const contentY = p1e * 120;

  // Content vertical offset:
  // Desktop → lift the text higher: -min(80px, 12vh) keeps text safely above the building.
  // Mobile adjusts text position — reduced negative offset to bring text further down
  const contentTranslateY = isMobile
    ? `${contentY - viewportH * 0.10}px`
    : `calc(${contentY}px - min(80px, 12vh))`;

  // On mobile, clouds drift left and right as you scroll down
  const cloudLeftX = isMobile ? -scrollProgress * 200 : 0;
  const cloudRightX = isMobile ? scrollProgress * 200 : 0;
  const cloudSideOpacity = 1;
  const cloudY = 0; // Clouds stay at a fixed vertical level
  const cloudWidth = isMobile ? "60%" : "44%"; // Reduced cloud size
  const cloudOffset = isMobile ? "-35%" : "-25%"; // Moved them a bit away
  const cloudTop = isMobile ? "60%" : "15%"; // Brought clouds up to 60% height

  // Smoke — attached to the building on mobile (shifted extremely high up), or rises late (0.75+) on desktop
  const smokeY = isMobile ? buildingY - 145 : 40 - p2e * 75;
  const smokeScaleY = isMobile ? 1.25 : 1.6; // Scaled down on mobile
  const smokeScaleX = isMobile ? 0.85 : 1.0;
  const smokeOpacity = 1; // Always 1

  // SVG text layer — appears right as building phase ends / SVG phase starts
  const textLayerOpacity = easeOut2(Math.max(0, Math.min(1, (scrollProgress - 0.10) / 0.04)));
  const maskScale = 0.65;
  // Building image scrolls from below (y=+30%) to above (y=-30%) inside letter cutouts during SVG+image phase
  const maskParallaxY = 30 - p4e * 60;

  // Strokes fade out perfectly in sync with the building fading out (0.60 → 0.70)
  const strokeOpacity = 1 - buildingFadeProgress;

  // Image fill: starts slightly after strokes begin (0.42), completes with strokes at 0.75
  const fillProgress = easeOut(p4);

  // Dark tint: only during building rise phase
  const darkOpacity = 0.10 * (1 - p1e);

  // Bottom gradient fades as SVG starts
  const bottomGradientOpacity = Math.max(0, 1 - p3e * 2);

  // White exit
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
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        @keyframes breathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @keyframes pulseSmoke {
          0% { transform: scale(1) translateY(0); opacity: 0.8; }
          50% { transform: scale(1.02) translateY(-1%); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 0.8; }
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
          will-change: transform, opacity;
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
        .animate-breathe {
          animation: breathe 22s ease-in-out infinite;
        }
        .animate-smoke-pulse {
          animation: pulseSmoke 8s ease-in-out infinite;
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

          {/* ── Layer 3: Building — full width, starts at 35% from top, rises on scroll ── */}
          <div className="absolute top-0 inset-x-0 pointer-events-none"
            style={{
              zIndex: 25,
              transform: `translateY(${buildingY}%) scale(${buildingScale})`,
              transformOrigin: "bottom center",
              opacity: buildingOpacity,
              willChange: "transform, opacity",
            }}>
            <div className="animate-layer-entrance" style={{ transformOrigin: "bottom center" }}>
              <img
                src={heroBuilding}
                alt="Luxury real estate building"
                className="block w-full"
                style={{
                  // Mobile: explicit height so object-fit: cover actually works. Reduced scale further.
                  // Desktop: height: auto keeps the original behaviour (image natural height).
                  height: isMobile ? "35vh" : "auto",
                  objectFit: "cover",
                  objectPosition: "center top", // show upper floors of the building
                }}
              />
            </div>
          </div>

          {/* ── Layer 4a: Left Cloud — z-32, above everything, middle-left ── */}
          <div className="absolute pointer-events-none"
            style={{ zIndex: 32, top: cloudTop, left: cloudOffset, width: cloudWidth, opacity: cloudSideOpacity, transform: `translate(${cloudLeftX}px, ${cloudY}vh)` }}>
            <div className="animate-layer-entrance">
              <div className="animate-cloud-drift">
                <img src={heroCloud} alt="" aria-hidden="true" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* ── Layer 4b: Right Cloud — z-32, above everything, middle-right ── */}
          <div className="absolute pointer-events-none"
            style={{ zIndex: 32, top: cloudTop, right: cloudOffset, width: cloudWidth, opacity: cloudSideOpacity, transform: `translate(${cloudRightX}px, ${cloudY}vh) scaleX(-1)` }}>
            <div className="animate-layer-entrance">
              <div className="animate-cloud-drift" style={{ animationDelay: "-14s" }}>
                <img src={heroCloud} alt="" aria-hidden="true" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* ── Layer 5: Bottom gradient ── */}
          <div className="absolute bottom-0 inset-x-0 pointer-events-none z-20"
            style={{ height: "40%", background: "linear-gradient(to top, rgba(255,255,255,0.65) 0%, transparent 100%)", opacity: bottomGradientOpacity }} />

          {/* ── Layer 6: SMOKE — rises to cover entire screen ── */}
          <div className="absolute pointer-events-none z-[34]"
            style={{
              bottom: "-10%",
              left: "-10%",
              width: "120%",
              opacity: smokeOpacity,
              transform: `translateY(${smokeY}%) scaleX(${smokeScaleX}) scaleY(${smokeScaleY})`,
              transformOrigin: "top center",
              willChange: "transform, opacity",
            }}>
            <div className="animate-smoke-pulse w-full h-full">
              <img src={heroCloudScroll} alt="" aria-hidden="true"
                className="w-full h-auto object-cover"
                style={{ minHeight: "70vh" }} />
            </div>
          </div>

          {/* ── Layer 7: PARMAR PROPERTIES — strokes + sky overlay ── */}
          <div className="absolute inset-0 pointer-events-none z-[29]"
            style={{
              opacity: textLayerOpacity,
              willChange: "opacity",
            }}>

            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 760 180"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                {/* Mask is white everywhere, but black exactly where the scaled text strokes are */}
                <mask id="inverted-text-mask">
                  <rect x="-5000" y="-5000" width="10000" height="10000" fill="white" />
                  <g style={{ transform: `scale(${maskScale})`, transformOrigin: "380px 90px" }}>
                    <g transform="translate(117, 10) scale(1.5)">
                      <path fill="black" fillRule="evenodd" clipRule="evenodd" d={PARMAR_PATHS[0]} />
                    </g>
                    <g transform="translate(144, 140) scale(0.80)">
                      <path fill="black" fillRule="evenodd" clipRule="evenodd" d={PROPS_PATHS[0]} />
                    </g>
                  </g>
                </mask>
              </defs>

              {/* Sky Overlay — covers the building OUTSIDE the text, fading in to simulate building fading out */}
              <g mask="url(#inverted-text-mask)" style={{ opacity: skyOverlayOpacity }}>
                <foreignObject x={380 - 3000} y={90 - 3000} width={6000} height={6000}>
                  <div style={{
                    // The SVG is scaled by viewportW / 760 (due to viewBox="0 0 760 180" and xMidYMid meet).
                    // To make this div exactly match the real screen size, we use 760 for width,
                    // and proportionally scale the height. This cancels the SVG scale perfectly!
                    width: "760px",
                    height: viewportW > 0 ? `${(viewportH * 760) / viewportW}px` : "1080px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%)`,
                  }}>
                    <div className="absolute inset-0" style={{ transform: `scale(${skyScale})`, transformOrigin: "center center" }}>
                      <img src={heroBg} className="w-full h-full object-cover" />
                    </div>
                    {/* Add the dark tint over the sky just like Layer 2 to perfectly match it */}
                    <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: darkOpacity }} />
                  </div>
                </foreignObject>
              </g>

              {/* Text strokes — scaled exactly like the mask cutout */}
              <g style={{ transform: `scale(${maskScale})`, transformOrigin: "380px 90px", opacity: strokeOpacity }}>
                {/* PARMAR strokes */}
                <g transform="translate(117, 10) scale(1.5)">
                  <path className="lp" d={PARMAR_PATHS[0]} fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                {/* PROPERTIES strokes */}
                <g transform="translate(144, 140) scale(0.80)">
                  <path className="lp" d={PROPS_PATHS[0]} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
            </svg>
          </div>

          {/* ── Layer 8: White exit cover ── */}
          <div className="absolute inset-0 bg-white pointer-events-none z-50" style={{ opacity: whiteOpacity }} />

          {/* ── Layer 9: Hero content — z-10, BELOW building (z-25) so building rises over text ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            style={{ zIndex: 10, opacity: contentOpacity, transform: `translateY(${contentTranslateY})`, pointerEvents: contentOpacity < 0.05 ? "none" : "auto" }}>
            <h1 className="text-black font-bold leading-[1.05] mb-1 pb-4 overflow-hidden flex flex-wrap justify-center"
              style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(46px, 8vw, 260px)", letterSpacing: "-0.02em", textShadow: "none" }}>
              <span className="animate-hero-letter" style={{ animationDelay: "300ms" }}>
                {hero.headline}
              </span>
            </h1>
            <p className="text-black/85 mb-3 max-w-[90vw] leading-relaxed animate-hero-strong"
              style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(13px, 1.4vw, 50px)", textAlign: "center", marginTop: "clamp(0px, 1vw, 20px)", marginBottom: "clamp(12px, 2vw, 40px)" }}>
              <strong className="font-semibold text-black">SOUTH MUMBAI'S TRUSTED LUXURY REAL ESTATE ADVISORY SINCE 1985</strong>
            </p>
            <a href="https://parmar-properties-listing.vercel.app/" target="_blank"
              className="group inline-flex items-center bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl animate-hero-button"
              style={{ 
                fontFamily: "'Instrument Sans', sans-serif", 
                fontSize: "clamp(14px, 1.1vw, 32px)",
                padding: "clamp(12px, 1vw, 32px) clamp(24px, 2vw, 64px)",
                gap: "clamp(8px, 0.5vw, 16px)"
              }}>
              Explore Opportunities 
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
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