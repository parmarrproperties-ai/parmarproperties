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
      <span key={i} className={i < count ? "text-black" : "text-gray-300"}>★</span>
    ))}
  </div>
);

export const TestimonialsGridCards = () => {
  return (
    <section className="bg-gray-50 py-24 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal direction="up">
          <h2 className="text-4xl md:text-5xl font-semibold text-black mb-16 text-center">
            What Our Clients Say
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.items.map((t: TestimonialItem, i: number) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-2xl flex flex-col h-full">
                <div className="mb-4">
                  <StarRating count={t.rating} />
                </div>
                <p className="text-gray-600 text-base leading-relaxed mb-8 italic flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <img src={t.imageUrl} alt={t.author} className="w-12 h-12 rounded-full object-cover" />
                  <p className="text-black font-semibold text-sm tracking-wider uppercase">{t.author}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
