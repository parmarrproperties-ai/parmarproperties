import React, { ElementType } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: ElementType;
  triggerOnce?: boolean;
}

export const ScrollReveal = ({
  children,
  delay = 0,
  duration = 1600,
  direction = "up",
  distance = 80,
  className = "",
  style: customStyle = {},
  as: Component = "div",
  triggerOnce = true,
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal({ triggerOnce });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const activeDuration = isMobile ? duration * 0.5 : duration;
  const activeDelay = isMobile ? delay * 0.5 : delay;

  const getTransform = () => {
    switch (direction) {
      case "up":
        return `translateY(${distance}px) scale(0.96) skewY(1deg)`;
      case "down":
        return `translateY(-${distance}px) scale(0.96) skewY(-1deg)`;
      case "left":
        return `translateX(${distance}px) scale(0.98) skewX(-2deg)`;
      case "right":
        return `translateX(-${distance}px) scale(0.98) skewX(2deg)`;
      default:
        return "scale(0.96)";
    }
  };

  const style: React.CSSProperties = {
    ...customStyle,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translate(0) scale(1) skew(0)" : getTransform(),
    transition: `opacity ${activeDuration}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${activeDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    transitionDelay: `${activeDelay}ms`,
    willChange: "transform, opacity",
  };

  return (
    <Component ref={ref} style={style} className={className}>
      {children}
    </Component>
  );
};
