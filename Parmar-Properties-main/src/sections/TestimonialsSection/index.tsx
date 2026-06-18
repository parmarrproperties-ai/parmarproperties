import { TestimonialCard } from "./components/TestimonialCard";
import { ScrollReveal } from "@/components/ScrollReveal";

const testimonials = [
  {
    title: "One Avighna Park IX",
    quote: "Successful advisory and sales execution for 70+ units in one of South Mumbai's most prestigious luxury developments.",
    author: "70+ Units Sold",
    rating: 5
  },
  {
    title: "Island City & L&T Gateway",
    quote: "Advising and securing 12 units at Island City (Bombay Realty) and 15 units at L&T The Gateway through our trusted HNI network.",
    author: "27 Units Placed",
    rating: 5
  },
  {
    title: "Bhoomi Simana & Salsette 27",
    quote: "Placement of 40+ units at Bhoomi Simana and 22+ units at Salsette 27 (Peninsula) through trust-first advisory and high-velocity execution.",
    author: "62+ Units Sold",
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="bg-zinc-100 py-20 md:py-32 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-lora font-bold text-neutral-900 mb-4">
            Track Record & Achievements
          </h2>
          <p className="text-neutral-600 font-instrument_sans max-w-2xl mx-auto text-lg">
            Presence across Worli, Parel, Mahalaxmi, Tardeo, Cuffe Parade, Malabar Hill — advising over 500+ HNI families.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <ScrollReveal
              key={i}
              delay={(i + 1) * 150}
              duration={1000}
            >
              <TestimonialCard
                title={t.title}
                quote={t.quote}
                author={t.author}
                rating={t.rating}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

