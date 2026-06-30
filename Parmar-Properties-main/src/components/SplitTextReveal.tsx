import React, { ElementType } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface SplitTextRevealProps {
  text: string;
  delayPerWord?: number;
  initialDelay?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
}

export const SplitTextReveal = ({
  text,
  delayPerWord = 5,
  initialDelay = 0,
  duration = 200,
  className = "",
  as: Component = "h2",
}: SplitTextRevealProps) => {
  const { ref, isVisible } = useScrollReveal();
  const words = text.split(" ");

  return (
    <Component ref={ref} className={className}>
      {words.map((word, index) => {
        if (word === "<br/>") {
          return <br key={index} />;
        }
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const activeDuration = isMobile ? duration * 0.5 : duration;
        const activeDelayPerWord = isMobile ? delayPerWord * 0.5 : delayPerWord;
        const activeInitialDelay = isMobile ? initialDelay * 0.5 : initialDelay;

        const style: React.CSSProperties = {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) rotate(0deg)" : "translateY(120%) rotate(4deg)",
          transition: `opacity ${activeDuration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${activeDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          transitionDelay: `${activeInitialDelay + index * activeDelayPerWord}ms`,
          willChange: "transform, opacity",
          display: "inline-block",
        };

        return (
          <span
            key={index}
            style={{
              overflow: "hidden",
              display: "inline-block",
              marginRight: "0.25em",
              paddingTop: "0.15em",
              paddingBottom: "0.15em",
              marginTop: "-0.15em",
              marginBottom: "-0.15em",
            }}
          >
            <span style={style}>{word}</span>
          </span>
        );
      })}
    </Component>
  );
};
