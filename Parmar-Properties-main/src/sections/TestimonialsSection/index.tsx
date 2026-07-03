import { ScrollReveal } from "@/components/ScrollReveal";
import { testimonials as testimonialsContent } from "@/content/content";
import { Link } from "react-router-dom";

export function TestimonialsSection() {
  const displayTestimonials = testimonialsContent.items.slice(0, 3);
  const mainImage = testimonialsContent.sideImageUrl;

  return (
    <section className="bg-[#f8f7f4] py-2 md:py-4 w-full px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto bg-transparent p-3 md:p-5">

        {/* Section Title - Moved above columns so image aligns with cards */}
        <ScrollReveal direction="up" className="mb-6 md:mb-8 self-start pl-2">
          <h2 className="text-3xl md:text-5xl font-['Instrument_Sans'] font-semibold tracking-tight text-black leading-[1.1]">
            Don't Take <span className="text-neutral-400">Our Word for It.</span>
          </h2>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-6">
          {/* Left Side: Image */}
          <div className="w-full lg:w-[50%] relative flex flex-col items-center lg:items-start justify-center">
            <ScrollReveal direction="right" className="w-full h-full relative z-0 flex items-stretch">
              <div className="w-full h-full min-h-[300px] max-h-[450px] lg:max-h-[none] rounded-[1.5rem] overflow-hidden relative bg-neutral-100 flex-1">
                <img
                  src={mainImage}
                  alt="Testimonials"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Right Side: Stacked Testimonials */}
          <div className="w-full lg:w-[50%] flex flex-col gap-4 pt-4 lg:pt-0 justify-center">
            {displayTestimonials.map((testimonial, idx) => {
              const isFirst = idx === 0;
              return (
                <ScrollReveal key={idx} delay={idx * 100} direction="left">
                  <div className={`p-6 rounded-[2rem] flex flex-col gap-3 relative overflow-hidden ${isFirst ? 'bg-black text-white' : 'bg-[#f8f7f4] text-black'}`}>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${isFirst ? 'text-white' : (i < testimonial.rating ? 'text-black' : 'text-neutral-300')}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className={`text-sm leading-relaxed ${isFirst ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className={`w-8 h-8 rounded-full overflow-hidden ${isFirst ? 'bg-black border border-neutral-700' : ''}`}>
                        <img
                          src={testimonial.imageUrl}
                          alt={testimonial.author}
                          className="w-full h-full object-cover grayscale scale-[1.35]"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-semibold text-xs ${isFirst ? 'text-white' : 'text-black'}`}>{testimonial.author}</span>
                        <span className={`text-[10px] ${isFirst ? 'text-neutral-400' : 'text-neutral-500'}`}>Client</span>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner */}
        <ScrollReveal direction="up" delay={300}>
          <div className="w-full bg-[#f1f0eb] rounded-[1.5rem] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <div className="w-full md:flex-1 min-w-0 md:pr-4 text-center md:text-left">
              <h3 className="text-lg md:text-xl lg:text-2xl font-['Instrument_Sans'] font-medium md:truncate w-full leading-snug">
                <span className="text-black block md:inline md:mr-2">
                  {testimonialsContent.bottomBanner?.heading || "Are you The Next One!"}
                </span>
                <span className="text-neutral-500 block md:inline mt-1 md:mt-0">
                  {testimonialsContent.bottomBanner?.subheading || "South Mumbai's Trusted Luxury Real Estate Advisory."}
                </span>
              </h3>
            </div>
            <Link to={testimonialsContent.bottomBanner?.cta.href || "/contact"} className="bg-black text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full font-medium text-xs md:text-sm hover:bg-black/80 transition-colors whitespace-nowrap shrink-0">
              {testimonialsContent.bottomBanner?.cta.label || "Let's Connect Now"}
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
