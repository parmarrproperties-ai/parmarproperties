import React, { useState } from 'react';

const testimonials = [
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

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-1 text-black">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? "text-black" : "text-gray-300"}>★</span>
    ))}
  </div>
);

// Variation 1: Split Layout with Large Image (Similar to screenshot)
export const TestimonialV1 = () => {
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  return (
    <section className="bg-[#f8f7f4] py-20 px-6 md:px-16 w-full">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-4xl md:text-6xl font-semibold mb-16 tracking-tight">
          Don't Take <span className="text-gray-400">Our Word for It.</span>
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          {/* Image Side */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-200">
              <img 
                src={current.image} 
                alt="Testimonial" 
                className="w-full h-full object-cover filter grayscale"
              />
            </div>
          </div>
          
          {/* Content Side */}
          <div className="w-full lg:w-1/2 flex flex-col pt-8">
            <div className="border-b border-gray-300 w-full mb-10"></div>
            
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-3">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors duration-300 ${active === idx ? 'bg-white border border-gray-200 shadow-sm font-medium' : 'text-gray-500 hover:bg-gray-100 border border-transparent'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <span className="text-6xl font-serif leading-none text-black">"</span>
            </div>
            
            <p className="text-xl md:text-2xl leading-relaxed text-gray-800 mb-12 min-h-[160px]">
              "{current.quote}"
            </p>
            
            <div className="flex items-center gap-4 text-sm font-semibold tracking-widest uppercase">
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

// Variation 2: Minimalist Centered Text (No Image)
export const TestimonialV2 = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-16 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-400 mb-12">Client Experiences</h2>
        <span className="block text-6xl text-gray-200 mb-6 font-serif">"</span>
        <p className="text-3xl md:text-5xl font-light leading-tight text-black mb-12">
          {testimonials[0].quote}
        </p>
        <div className="flex flex-col items-center gap-2">
          <p className="font-semibold tracking-wider text-sm uppercase">{testimonials[0].author}</p>
          <p className="text-gray-500 text-sm">{testimonials[0].role}</p>
        </div>
      </div>
    </section>
  );
};

// Variation 3: Grid Layout with Cards (No Images)
export const TestimonialV3 = () => {
  return (
    <section className="bg-neutral-900 py-24 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-4xl md:text-5xl font-semibold text-white mb-16 text-center">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-neutral-800 p-10 flex flex-col justify-between h-full border border-neutral-700 hover:border-neutral-500 transition-colors">
              <div>
                <div className="mb-6"><StarRating count={item.rating} /></div>
                <p className="text-neutral-300 text-lg leading-relaxed mb-8">"{item.quote}"</p>
              </div>
              <div>
                <p className="text-white font-medium uppercase tracking-wider text-sm">{item.author}</p>
                <p className="text-neutral-500 text-sm mt-1">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Variation 4: Grid Layout with Avatars (With Images)
export const TestimonialV4 = () => {
  return (
    <section className="bg-gray-50 py-24 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-4xl md:text-5xl font-semibold text-black mb-16 text-center">Trusted by the Best</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white p-8 shadow-sm border border-gray-100 rounded-2xl">
              <p className="text-gray-600 text-base leading-relaxed mb-8 italic">"{item.quote}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <img src={item.image} alt={item.author} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-black font-semibold text-sm">{item.author}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Variation 5: Large Quote Slider (With Background Image)
export const TestimonialV5 = () => {
  return (
    <section className="relative py-32 px-6 md:px-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Luxury Home" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center text-white flex flex-col items-center">
        <StarRating count={5} />
        <p className="text-2xl md:text-4xl leading-relaxed font-light mt-10 mb-12">
          "Finding a home in South Mumbai is as much about patience as it is about access. The team secured our dream duplex before it even hit the open market."
        </p>
        <p className="font-medium tracking-[0.2em] uppercase text-sm">Anonymous</p>
        <p className="text-white/60 text-sm mt-2">South Mumbai Resident</p>
        
        <div className="flex gap-2 mt-12">
          <div className="w-12 h-1 bg-white"></div>
          <div className="w-12 h-1 bg-white/30"></div>
          <div className="w-12 h-1 bg-white/30"></div>
        </div>
      </div>
    </section>
  );
};

// Variation 6: Side-by-Side Large Cards (No Images)
export const TestimonialV6 = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-black max-w-md leading-tight">
            Words from our clients
          </h2>
          <div className="hidden md:flex gap-4">
            <button className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              ←
            </button>
            <button className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              →
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.slice(0, 2).map((item) => (
            <div key={item.id} className="bg-[#f8f7f4] p-12 lg:p-16 flex flex-col justify-between min-h-[400px]">
              <p className="text-2xl leading-relaxed text-black font-light mb-12">
                "{item.quote}"
              </p>
              <div>
                <p className="text-black font-semibold text-sm tracking-wider uppercase mb-1">{item.author}</p>
                <p className="text-gray-500 text-sm">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function TestimonialVariations() {
  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="bg-black text-white p-10 text-center text-2xl font-bold tracking-widest uppercase">
        Testimonial Variations Library
      </div>
      <TestimonialV1 />
      <TestimonialV2 />
      <TestimonialV3 />
      <TestimonialV4 />
      <TestimonialV5 />
      <TestimonialV6 />
    </div>
  );
}
