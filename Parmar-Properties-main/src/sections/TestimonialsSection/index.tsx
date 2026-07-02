import { useState } from "react";
import { TestimonialCarousel } from "./components/TestimonialCarousel";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { testimonials as testimonialsContent } from "@/content/content";


export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = testimonialsContent.items[activeIndex].imageUrl;

  return (
    <section className="bg-[#f8f7f4] py-16 md:py-24 w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16">

        {/* Header */}
        <ScrollReveal className="mb-12 md:mb-16">
          <ScrollScrubRevealText 
            as="h2"
            text="Don't Take Our Word for It."
            className="text-4xl md:text-5xl lg:text-6xl font-['Instrument_Sans'] font-semibold tracking-tight"
            baseColorClass="text-neutral-300"
            revealColorClass="text-black"
            scrubStart="top 95%"
            scrubEnd="center 60%"
            segments={testimonialsContent.headingSegments}
          />
        </ScrollReveal>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-stretch">

          {/* Left: Large Image */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal className="w-full overflow-hidden relative bg-neutral-200" direction="right">
              <img
                key={activeImage}
                src={activeImage}
                alt="Client testimonial"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover object-center grayscale animate-fade-in"
              />
            </ScrollReveal>
          </div>

          {/* Right: Testimonial Carousel */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <ScrollReveal delay={200} direction="left">
              <TestimonialCarousel 
                testimonials={testimonialsContent.items as any} 
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
