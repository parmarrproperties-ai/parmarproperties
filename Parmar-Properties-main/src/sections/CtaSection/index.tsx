import { SplitTextReveal } from "@/components/SplitTextReveal";
import { ScrollReveal } from "@/components/ScrollReveal";

export const CtaSection = () => {
  return (
    <section className="relative flex items-center justify-center text-white h-[400px] md:h-[600px]">
      <div className="absolute inset-0 overflow-hidden bg-neutral-900/80">
        <img
          alt=""
          src="https://c.animaapp.com/mq3zczchi8fb7N/assets/14.webp"
          className="w-full h-full object-cover scale-[1.0102] mix-blend-overlay"
        />
      </div>
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-16 text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.3px] md:tracking-[-0.48px] leading-tight">
          <SplitTextReveal 
            text="Parmar Properties. South Mumbai's Trusted Luxury Real Estate Advisory."
            className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.3px] md:tracking-[-0.48px] leading-tight"
          />
        </div>
        <ScrollReveal delay={300} className="mt-8 md:mt-[30px] flex items-center justify-center gap-4">
          <div>
            <a
              href="https://parmarproperties.in/contact"
              className="inline-flex items-center justify-center bg-white text-neutral-900 text-base md:text-sm font-medium leading-6 px-6 py-3.5 md:px-5 md:py-3 rounded-[100px] transition-transform hover:scale-105"
            >
              <span className="mr-3">
                Let's Get Started
              </span>
              <span className="flex items-center justify-center w-6 h-6 md:w-4 md:h-4">
                <img
                  src="https://c.animaapp.com/mq3zczchi8fb7N/assets/icon-9.svg"
                  alt="Icon"
                  className="w-full h-full"
                />
              </span>
            </a>
          </div>
          <div>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#25D366] text-white w-12 h-12 md:w-11 md:h-11 rounded-full transition-transform hover:scale-105 shadow-md"
              title="Chat on WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.41 9.86-9.85.002-2.634-1.02-5.11-2.877-6.97C16.595 1.953 14.116.93 11.48.928c-5.44.002-9.864 4.417-9.866 9.859-.001 1.701.443 3.328 1.288 4.774l-1.018 3.719 3.821-.998c1.385.756 2.93 1.156 4.942 1.096zm12.333-6.685c-.328-.164-1.94-.959-2.242-1.07-.302-.11-.522-.164-.741.164-.219.329-.85.85-1.042 1.07-.192.219-.384.246-.712.083-.328-.164-1.384-.51-2.637-1.627-.975-.87-1.633-1.946-1.824-2.274-.192-.329-.02-.507.144-.671.148-.148.328-.384.493-.575.164-.192.219-.329.328-.548.11-.219.055-.411-.027-.575-.082-.164-.74-1.78-.1013-2.438-.266-.639-.52-.589-.712-.589l-.603-.008c-.219 0-.575.082-.876.411-.301.329-1.15 1.123-1.15 2.739 0 1.616 1.177 3.177 1.341 3.396.164.22 2.317 3.538 5.613 4.961.784.339 1.396.541 1.873.692.788.251 1.505.215 2.072.13.632-.096 1.94-.794 2.214-1.56.274-.767.274-1.424.192-1.56-.083-.137-.302-.219-.63-.383z" />
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};