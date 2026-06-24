import { useState, useRef } from "react";
import gsap from "gsap";

export type Testimonial = {
  quote: string;
  author: string;
  rating: number;
};

type Props = {
  testimonials: Testimonial[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

export const TestimonialCarousel = ({ testimonials, activeIndex, setActiveIndex }: Props) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (clientX: number) => {
    setTouchStart(clientX);
    // Stop any ongoing animations
    gsap.killTweensOf(contentRef.current);
  };

  const handleDragMove = (clientX: number) => {
    if (touchStart === null) return;
    const offset = clientX - touchStart;
    // Visually drag the content with some resistance
    gsap.set(contentRef.current, { x: offset * 0.8 });
  };

  const handleDragEnd = (clientX: number) => {
    if (touchStart === null) return;
    const distance = clientX - touchStart;
    let newIndex = activeIndex;

    // Swipe threshold
    if (distance > 70) {
      newIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
    } else if (distance < -70) {
      newIndex = (activeIndex + 1) % testimonials.length;
    }

    if (newIndex !== activeIndex) {
      // Animate out
      gsap.to(contentRef.current, {
        x: distance > 0 ? 200 : -200,
        opacity: 0,
        duration: 0.2,
        ease: "power1.in",
        onComplete: () => {
          setActiveIndex(newIndex);
          // Animate back in from the opposite side
          gsap.fromTo(
            contentRef.current,
            { x: distance > 0 ? -200 : 200, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
          );
        }
      });
    } else {
      // Snap back if threshold not met
      gsap.to(contentRef.current, { x: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
    }
    
    setTouchStart(null);
  };

  // Button navigation with proper animation direction
  const goToIndex = (index: number) => {
    if (index === activeIndex) return;
    const isNext = index > activeIndex;
    
    gsap.to(contentRef.current, {
      x: isNext ? -200 : 200,
      opacity: 0,
      duration: 0.2,
      ease: "power1.in",
      onComplete: () => {
        setActiveIndex(index);
        gsap.fromTo(
          contentRef.current,
          { x: isNext ? 200 : -200, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
        );
      }
    });
  };

  const t = testimonials[activeIndex];

  return (
    <div className="w-full flex flex-col pt-4 relative">
      {/* Top Divider */}
      <div className="w-full h-[1px] bg-black mb-8" />

      {/* Navigation & Quote Icon */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                index === activeIndex
                  ? "border-black text-black"
                  : "text-neutral-400 hover:text-black hover:border-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="text-4xl text-neutral-800 font-serif leading-none h-6 select-none">
          ”
        </div>
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="testimonial-content flex flex-col flex-1 min-h-[200px] cursor-grab active:cursor-grabbing select-none"
        onTouchStart={(e) => handleDragStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.targetTouches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleDragMove(e.clientX);
        }}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onMouseLeave={(e) => {
          if (touchStart !== null) handleDragEnd(e.clientX);
        }}
      >
        <p className="text-lg md:text-xl text-neutral-800 font-['Instrument_Sans'] mb-8 leading-relaxed">
          "{t.quote}"
        </p>
        
        <div className="flex items-center gap-4 mt-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-600">
            {t.author}
          </span>
          <span className="text-neutral-300">/</span>
          <div className="flex gap-1 text-black">
            {[...Array(t.rating)].map((_, i) => (
              <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
