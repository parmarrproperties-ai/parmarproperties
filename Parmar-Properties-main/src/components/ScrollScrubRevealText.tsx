import React, { ElementType, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type TextSegment = {
  text: string;
  revealColorClass?: string;
  baseColorClass?: string;
};

interface ScrollScrubRevealTextProps {
  text?: string;
  segments?: TextSegment[];
  className?: string;
  as?: ElementType;
  baseColorClass?: string;
  revealColorClass?: string;
  scrubStart?: string;
  scrubEnd?: string;
}

export const ScrollScrubRevealText = ({
  text,
  segments,
  className = "",
  as: Component = "h2",
  baseColorClass = "text-neutral-200", // lightest grey base
  revealColorClass = "text-black",
  scrubStart = "top 85%",
  scrubEnd = "center 50%",
}: ScrollScrubRevealTextProps) => {
  const containerRef = useRef<HTMLElement>(null);

  const parsedSegments = useMemo(() => {
    if (segments) return segments;
    if (text) return [{ text, revealColorClass, baseColorClass }];
    return [];
  }, [segments, text, revealColorClass, baseColorClass]);

  const wordsList = useMemo(() => {
    return parsedSegments.flatMap((segment) => {
      const words = segment.text.split(" ").filter(Boolean);
      return words.map((word) => ({
        word,
        revealClass: segment.revealColorClass || revealColorClass,
        baseClass: segment.baseColorClass || baseColorClass,
      }));
    });
  }, [parsedSegments, revealColorClass, baseColorClass]);

  useEffect(() => {
    if (!containerRef.current) return;

    const wordEls = containerRef.current.querySelectorAll(".reveal-word-fg");
    if (!wordEls.length) return;
    
    // Create ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: scrubStart,
        once: true, // Only trigger once, never reverse
      }
    });

    // Staggered clip-path animation left-to-right filling each word
    // using a low stagger value (e.g. 0.05) to make it smooth and buttery
    tl.fromTo(wordEls, 
      { clipPath: "inset(0% 100% 0% 0%)" }, 
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1, stagger: 0.05, ease: "sine.inOut" }
    );

    return () => {
      // Clean up the specific scroll trigger attached to this component
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [scrubStart, scrubEnd, wordsList]);

  return (
    <Component ref={containerRef} className={className}>
      {wordsList.map((item, index) => (
        <span
          key={index}
          className="relative inline-block whitespace-nowrap"
          style={{ marginRight: "0.25em", marginBottom: "0.1em" }}
        >
          {/* Base Layer (Lightest Gray) */}
          <span className={`inline-block text-transparent ${item.baseClass}`}>
            {item.word}
          </span>
          {/* Reveal Overlay Layer (Black or Gray) */}
          <span 
            className={`reveal-word-fg absolute top-0 left-0 inline-block ${item.revealClass}`}
            style={{ clipPath: "inset(0% 100% 0% 0%)" }}
            aria-hidden="true"
          >
            {item.word}
          </span>
        </span>
      ))}
    </Component>
  );
};
