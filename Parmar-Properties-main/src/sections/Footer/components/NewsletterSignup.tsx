<<<<<<< HEAD
import { ScrollReveal } from "@/components/ScrollReveal";
import { footer } from "@/content/content";
import { config } from "@/content/config";

export const NewsletterSignup = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = config.newsletter.confirmationUrl;
  };

  return (
    <div className="flex flex-col gap-y-12 md:max-w-xl font-['Instrument_Sans']">
      <div>
        <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-6">
          {footer.newsletter.heading}
        </h3>
        <form onSubmit={handleSubmit} className="relative border-b border-white/40 pb-3 flex items-center group focus-within:border-white transition-colors duration-300">
          <input
            type="email"
            placeholder={footer.newsletter.placeholder}
            name="email"
            className="w-full bg-transparent text-base text-white placeholder-white/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm px-1"
            required
          />
          <button
            type="submit"
            aria-label="Submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-12 mt-6 md:mt-12">
        {footer.contact.map((item) => (
          <div key={item.label} className="flex flex-col">
            <div className="hidden md:block text-[11px] font-medium text-white/40 uppercase tracking-widest mb-4">
              {item.label}
            </div>
            <a
              href={item.href}
              className="text-base md:text-sm font-medium hover:text-white/70 transition-colors"
            >
              {item.value}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
=======
import { ScrollReveal } from "@/components/ScrollReveal";
import { footer } from "@/content/content";
import { config } from "@/content/config";

export const NewsletterSignup = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = config.newsletter.confirmationUrl;
  };

  const headOffice = footer.contact.find(c => c.label === "Head Office");
  const emailUs = footer.contact.find(c => c.label === "Email Us");
  const callUs = footer.contact.find(c => c.label === "Call Us");

  return (
    <div className="flex flex-col gap-y-8 md:max-w-xl font-['Instrument_Sans'] w-full">
      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-12">
        {headOffice && (
          <div className="flex flex-col order-2 md:order-none">
            <div className="hidden md:block text-[11px] font-medium text-white/40 uppercase tracking-widest mb-4">
              {headOffice.label}
            </div>
             <a
              href={headOffice.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base md:text-sm font-medium leading-relaxed hover:text-white/70 transition-colors"
            >
              {headOffice.value}
            </a>
          </div>
        )}
        
        {emailUs && (
          <div className="flex flex-col order-1 md:order-none">
            <div className="hidden md:block text-[11px] font-medium text-white/40 uppercase tracking-widest mb-4">
              {emailUs.label}
            </div>
            <a
              href={emailUs.href}
              className="text-xl md:text-sm font-medium hover:text-white/70 transition-colors underline md:no-underline"
            >
              {emailUs.value}
            </a>
          </div>
        )}
        
        {callUs && (
          <div className="flex flex-col order-3 md:order-none">
            <div className="hidden md:block text-[11px] font-medium text-white/40 uppercase tracking-widest mb-4">
              {callUs.label}
            </div>
            <a
              href={callUs.href}
              className="text-base md:text-sm font-medium hover:text-white/70 transition-colors"
            >
              {callUs.value}
            </a>
          </div>
        )}
      </div>

      <a 
        href="https://maps.app.goo.gl/52AoKTDBcBNvBDtx9" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block w-full h-48 md:h-56 rounded-xl overflow-hidden relative group -mt-[9px] border border-white/10"
      >
        <iframe 
          src="https://maps.google.com/maps?q=18.9959295,72.8360952&t=&z=16&ie=UTF8&iwloc=&output=embed" 
          className="w-full h-full border-0 pointer-events-none" 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-transparent group-hover:bg-black/20 transition-colors duration-300">
          <div className="bg-neutral-900/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white text-sm font-medium shadow-xl opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300">
            View on Google Maps
          </div>
        </div>
      </a>
    </div>
  );
};
>>>>>>> efc0caeafe50b585c1d6ed32850f70cc46c268aa
