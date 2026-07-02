import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { testimonials } from "@/content/content";

interface TestimonialItem {
  quote: string;
  author: string;
  rating: number;
  imageUrl: string;
}

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? "text-white" : "text-white/30"}>★</span>
    ))}
  </div>
);

export const TestimonialsImageBackground = () => {
  const [active, setActive] = useState(0);
  const current = testimonials.items[active] as TestimonialItem;

  return (
    <section className="relative py-32 px-6 md:px-16 overflow-hidden min-h-[600px]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          key={current.imageUrl}
          src={current.imageUrl}
          alt="Testimonial background"
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center text-white flex flex-col items-center">
        <ScrollReveal direction="up">
          <StarRating count={current.rating} />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <p className="text-2xl md:text-4xl leading-relaxed font-light mt-10 mb-12 italic">
            "{current.quote}"
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <p className="font-semibold tracking-[0.2em] uppercase text-sm">{current.author}</p>
        </ScrollReveal>

        {/* Pagination dots */}
        <div className="flex gap-3 mt-12">
          {testimonials.items.map((_: TestimonialItem, index: number) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`h-1 rounded-full transition-all duration-300 ${active === index ? "w-12 bg-white" : "w-4 bg-white/30 hover:bg-white/60"}`}
              aria-label={`Testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
