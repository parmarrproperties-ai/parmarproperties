import { useEffect, useState } from "react";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near the bottom of the page (within 800px of the end)
      const isNearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 800;
      setIsVisible(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check on initial load
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9999] p-3 md:p-4 rounded-full bg-black text-white shadow-xl transition-all duration-500 hover:bg-neutral-800 hover:-translate-y-2 ${
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
        className="md:w-6 md:h-6"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
};
