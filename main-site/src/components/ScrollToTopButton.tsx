import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        const heroSection = document.getElementById("hero-section");
        const threshold = heroSection ? heroSection.offsetHeight - window.innerHeight : window.innerHeight;
        setIsVisible(window.scrollY >= threshold);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check on initial load
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9999] flex items-center justify-center w-11 h-11 rounded-full bg-black text-white shadow-xl transition-all duration-500 hover:bg-neutral-800 hover:-translate-y-2 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
};
