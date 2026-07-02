import { useEffect } from "react";
import { Header } from "@/sections/Header/index";
import { Footer } from "@/sections/Footer/index";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmoothScroll } from "@/components/SmoothScroll";

export const TermsAndConditionsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <>
      <SmoothScroll />
      <div className="min-h-screen bg-[#f3f1ed] text-black font-['Instrument_Sans'] overflow-x-clip selection:bg-black selection:text-white relative z-10 flex flex-col">
        <Header />
        
        <main className="flex-1 pt-[120px] md:pt-[160px] pb-16 md:pb-24 px-6 md:px-16 w-full max-w-[1920px] mx-auto">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Instrument_Serif'] italic font-normal tracking-[-0.02em] mb-12">
              Terms and Conditions for Parmar Properties
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={100} className="max-w-4xl flex flex-col gap-6 text-lg text-black/70 leading-relaxed">
            
            <h2 className="text-2xl font-medium text-black mt-6 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the website.
            </p>

            <h2 className="text-2xl font-medium text-black mt-6 mb-2">2. About The Website</h2>
            <p>
              This website is operated by Parmar Properties & Infrastructure Private Limited and provides information regarding real estate properties for sale, purchase, lease, and investment purposes. The information published on this website is for general informational purposes only and does not constitute legal, financial, or real estate advice.
            </p>

            <h2 className="text-2xl font-medium text-black mt-6 mb-2">3. Property Listings Disclaimer</h2>
            <ul className="list-disc pl-6 space-y-3 mb-2">
              <li>Property details, prices, images, layouts, availability, and specifications are subject to change without prior notice.</li>
              <li>We strive to provide accurate information; however, we do not guarantee the completeness or accuracy of property listings.</li>
              <li>Users are advised to independently verify property details before making any decision.</li>
              <li>The website does not guarantee booking, availability, or final pricing unless confirmed in writing by the company.</li>
            </ul>

            <h2 className="text-2xl font-medium text-black mt-6 mb-2">4. User Responsibilities</h2>
            <p>By using this website, you agree:</p>
            <ul className="list-disc pl-6 space-y-3 mb-2">
              <li>To provide accurate and truthful information when submitting inquiries or forms.</li>
              <li>Not to misuse the website for fraudulent or illegal activities.</li>
              <li>Not to copy, reproduce, or distribute website content without written permission.</li>
              <li>Not to attempt unauthorized access to the website or server.</li>
            </ul>

            <h2 className="text-2xl font-medium text-black mt-6 mb-2">5. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-3 mb-2">
              <li>All content on this website including text, images, logos, graphics, design, and layout is the property of Parmar Properties and is protected under applicable intellectual property laws.</li>
              <li>Unauthorized use of website content is strictly prohibited.</li>
            </ul>

            <h2 className="text-2xl font-medium text-black mt-6 mb-2">6. Third-Party Links</h2>
            <p>
              The website may contain links to third-party websites (such as property portals or financial institutions). We are not responsible for the content, policies, or practices of such external websites.
            </p>
            
          </ScrollReveal>
        </main>
        
        <Footer />
      </div>
    </>
  );
};
