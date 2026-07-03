import { useEffect, useState } from "react";
import { brand } from "@/content/content";

export const Preloader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(() => {
    return sessionStorage.getItem("preloaderShown") === "true";
  });

  useEffect(() => {
    if (isUnmounted) return;

    // Mark as shown so it doesn't appear on navigation/reload in same session
    sessionStorage.setItem("preloaderShown", "true");

    // Trigger the text fade-in immediately on mount
    const loadTimer = setTimeout(() => setIsLoaded(true), 50);
    
    // Start sliding the entire white background out after 1.2s
    const outTimer = setTimeout(() => setIsAnimatingOut(true), 1200);

    // Completely unmount the component from DOM after 2s
    const unmountTimer = setTimeout(() => setIsUnmounted(true), 2000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(outTimer);
      clearTimeout(unmountTimer);
    };
  }, [isUnmounted]);

  if (isUnmounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center font-['Instrument_Sans'] origin-top transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isAnimatingOut ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div 
        className={`flex flex-col items-center justify-center text-center transition-all duration-700 ease-out transform ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <img 
          src={brand.logoUrl} 
          alt="Parmar Properties" 
          className="w-[80vw] md:w-[765px] max-w-[90vw] object-contain"
        />
      </div>
    </div>
  );
};
