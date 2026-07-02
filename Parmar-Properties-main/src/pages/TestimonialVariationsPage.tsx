import { useState } from "react";
import { Header } from "@/sections/Header/index";
import { SmoothScroll } from "@/components/SmoothScroll";

const demoTestimonials = [
  {
    id: 1,
    quote: "Finding a home in South Mumbai is as much about patience as it is about access. The team secured our dream duplex in Malabar Hill before it even hit the open market. Absolutely professional and highly connected!",
    author: "ANONYMOUS",
    rating: 5,
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    role: "CEO, Tech Corp"
  },
  {
    id: 2,
    quote: "Their market knowledge is unparalleled. They didn't just show us properties; they provided a comprehensive analysis of the neighborhood's investment potential. A truly advisory approach.",
    author: "PRIYA S.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    role: "Real Estate Investor"
  },
  {
    id: 3,
    quote: "From our first meeting to the final paperwork, the entire process was seamless. They understood our requirements perfectly and found us a home that exceeded our expectations.",
    author: "RAHUL M.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    role: "Entrepreneur"
  }
];

const StarRating = ({ count, dark = false }: { count: number; dark?: boolean }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? (dark ? "text-white" : "text-black") : (dark ? "text-white/30" : "text-gray-300")}>★</span>
    ))}
  </div>
);

const VariantLabel = ({ label, number }: { label: string; number: number }) => (
  <div className="bg-black text-white px-6 py-4 flex items-center gap-4 font-['Instrument_Sans']">
    <span className="text-white/40 text-sm font-mono">V{number}</span>
    <span className="text-sm font-medium tracking-widest uppercase">{label}</span>
  </div>
);

// V1: Split Layout with Large Image
const TestimonialV1 = () => {
  const [active, setActive] = useState(0);
  const current = demoTestimonials[active];
  return (
    <section className="bg-[#f8f7f4] py-20 px-6 md:px-16 w-full">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-4xl md:text-6xl font-semibold mb-16 tracking-tight font-['Instrument_Sans']">
          Don't Take <span className="text-gray-400">Our Word for It.</span>
        </h2>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-stretch">
          <div className="w-full lg:w-1/2">
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-200">
              <img src={current.image} alt="Testimonial" className="w-full h-full object-cover grayscale transition-all duration-500" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col pt-8">
            <div className="border-b border-gray-300 w-full mb-10"></div>
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-3">
                {demoTestimonials.map((_, idx) => (
                  <button key={idx} onClick={() => setActive(idx)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${active === idx ? 'bg-white border border-gray-300 shadow-sm font-semibold' : 'text-gray-400 hover:bg-gray-100 border border-transparent'}`}>
                    {idx + 1}
                  </button>
                ))}
              </div>
              <span className="text-6xl font-serif leading-none text-black">"</span>
            </div>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-800 mb-12 min-h-[160px] font-['Instrument_Sans']">
              "{current.quote}"
            </p>
            <div className="flex items-center gap-4 text-sm font-semibold tracking-widest uppercase font-['Instrument_Sans']">
              <span>{current.author}</span>
              <span className="text-gray-300">/</span>
              <StarRating count={current.rating} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// V2: Minimalist Centered Text (No Image)
const TestimonialV2 = () => (
  <section className="bg-white py-24 px-6 md:px-16 text-center">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400 mb-12 font-['Instrument_Sans']">Client Experiences</h2>
      <span className="block text-6xl text-gray-200 mb-4 font-serif">"</span>
      <p className="text-3xl md:text-5xl font-light leading-tight text-black mb-14 font-['Instrument_Serif'] italic">
        {demoTestimonials[0].quote}
      </p>
      <div className="flex flex-col items-center gap-2 font-['Instrument_Sans']">
        <p className="font-semibold tracking-wider text-sm uppercase">{demoTestimonials[0].author}</p>
        <p className="text-gray-400 text-sm">{demoTestimonials[0].role}</p>
      </div>
    </div>
  </section>
);

// V3: Dark Grid Cards (No Images)
const TestimonialV3 = () => (
  <section className="bg-neutral-900 py-24 px-6 md:px-16">
    <div className="max-w-[1400px] mx-auto">
      <h2 className="text-4xl md:text-5xl font-semibold text-white mb-16 text-center font-['Instrument_Sans']">What Our Clients Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoTestimonials.map((item) => (
          <div key={item.id} className="bg-neutral-800 p-10 flex flex-col justify-between border border-neutral-700 hover:border-neutral-400 transition-colors duration-300">
            <div>
              <div className="mb-6"><StarRating count={item.rating} dark /></div>
              <p className="text-neutral-300 text-lg leading-relaxed mb-8 font-['Instrument_Sans']">"{item.quote}"</p>
            </div>
            <div>
              <p className="text-white font-semibold uppercase tracking-wider text-sm font-['Instrument_Sans']">{item.author}</p>
              <p className="text-neutral-500 text-sm mt-1">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// V4: Light Grid Cards with Avatars (With Images)
const TestimonialV4 = () => (
  <section className="bg-[#f8f7f4] py-24 px-6 md:px-16">
    <div className="max-w-[1400px] mx-auto">
      <h2 className="text-4xl md:text-5xl font-semibold text-black mb-16 text-center font-['Instrument_Sans']">Trusted by the Best</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoTestimonials.map((item) => (
          <div key={item.id} className="bg-white p-8 shadow-sm border border-gray-100 rounded-2xl flex flex-col">
            <p className="text-gray-600 text-base leading-relaxed mb-8 italic flex-1 font-['Instrument_Sans']">"{item.quote}"</p>
            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
              <img src={item.image} alt={item.author} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="text-black font-semibold text-sm font-['Instrument_Sans']">{item.author}</p>
                <p className="text-gray-400 text-xs mt-0.5">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// V5: Full-Width Background Image
const TestimonialV5 = () => (
  <section className="relative py-36 px-6 md:px-16 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Luxury Home" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/72"></div>
    </div>
    <div className="relative z-10 max-w-5xl mx-auto text-center text-white flex flex-col items-center">
      <StarRating count={5} dark />
      <p className="text-2xl md:text-4xl leading-relaxed font-light mt-10 mb-12 italic font-['Instrument_Serif']">
        "Finding a home in South Mumbai is as much about patience as it is about access. The team secured our dream duplex before it even hit the open market."
      </p>
      <p className="font-semibold tracking-[0.2em] uppercase text-sm font-['Instrument_Sans']">Anonymous</p>
      <p className="text-white/50 text-sm mt-2">South Mumbai Resident</p>
      <div className="flex gap-2 mt-12">
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-4 h-1 bg-white/30 rounded-full"></div>
        <div className="w-4 h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  </section>
);

// V6: Side-by-Side Large Cards (No Images)
const TestimonialV6 = () => (
  <section className="bg-white py-24 px-6 md:px-16">
    <div className="max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold text-black max-w-md leading-tight font-['Instrument_Sans']">
          Words from our clients
        </h2>
        <div className="hidden md:flex gap-3">
          <button className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">←</button>
          <button className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">→</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoTestimonials.slice(0, 2).map((item) => (
          <div key={item.id} className="bg-[#f8f7f4] p-12 lg:p-16 flex flex-col justify-between min-h-[400px]">
            <p className="text-2xl leading-relaxed text-black font-light mb-12 font-['Instrument_Serif'] italic">
              "{item.quote}"
            </p>
            <div>
              <p className="text-black font-semibold text-sm tracking-wider uppercase mb-1 font-['Instrument_Sans']">{item.author}</p>
              <p className="text-gray-500 text-sm">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const TestimonialVariationsPage = () => {
  return (
    <>
      <SmoothScroll />
      <div className="min-h-screen font-['Instrument_Sans']">
        <Header />
        <div className="pt-[80px]">
          <div className="bg-black text-white px-6 md:px-16 py-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Testimonial Variations</h1>
            <p className="text-white/50 mt-2 text-sm">6 design variations — preview and pick your favourite</p>
          </div>

          <VariantLabel number={1} label="Split Layout · Large Image · Paginated (With Image)" />
          <TestimonialV1 />

          <VariantLabel number={2} label="Minimalist Centered · Large Typography (No Image)" />
          <TestimonialV2 />

          <VariantLabel number={3} label="Dark Grid Cards · 3 Columns (No Image)" />
          <TestimonialV3 />

          <VariantLabel number={4} label="Light Grid Cards · Avatar Portraits (With Image)" />
          <TestimonialV4 />

          <VariantLabel number={5} label="Fullscreen Background Image · Cinematic (With Image)" />
          <TestimonialV5 />

          <VariantLabel number={6} label="Side-by-Side Large Cards · Navigation Arrows (No Image)" />
          <TestimonialV6 />
        </div>
      </div>
    </>
  );
};
