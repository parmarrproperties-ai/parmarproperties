import { useEffect } from "react";
import { Header } from "@/sections/Header/index";
import { Footer } from "@/sections/Footer/index";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmoothScroll } from "@/components/SmoothScroll";

export const PrivacyPolicyPage = () => {
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
              Privacy Policy for Parmar Properties
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={100} className="max-w-4xl flex flex-col gap-6 text-lg text-black/70 leading-relaxed">
            <p>
              This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
            </p>
            <p>
              We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the Privacy Policy Generator.
            </p>
            
            <h2 className="text-2xl font-medium text-black mt-6 mb-2">Interpretation and Definitions</h2>
            <h3 className="text-xl font-medium text-black mt-4 mb-2">Interpretation</h3>
            <p>
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3 className="text-xl font-medium text-black mt-4 mb-2">Definitions</h3>
            <p>For the purposes of this Privacy Policy:</p>
            <ul className="list-disc pl-6 space-y-3 mb-2">
              <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
              <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to PARMAR PROPERTIES & INFRASTRUCTURE PRIVATE LIMITED, 208, Peninsula Center, Dr. S S Rao Road, Parel. Mumbai, Maharashtra 400012, IN.</li>
              <li><strong>Country</strong> refers to: Maharashtra, India</li>
            </ul>

            <h2 className="text-2xl font-medium text-black mt-6 mb-2">Communication</h2>
            <p>
              Brand may reach out to you for sending information about the product over whatsapp SMS RCS and other digital communication channels.
            </p>

            <h2 className="text-2xl font-medium text-black mt-6 mb-2">Links to Other Websites</h2>
            <p>
              Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.
            </p>

            <h2 className="text-2xl font-medium text-black mt-6 mb-2">Changes to this Privacy Policy</h2>
            <p>
              We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
            </p>

            <h2 className="text-2xl font-medium text-black mt-6 mb-2">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, You can contact us:<br />
              By phone number: 022 6666 9733
            </p>
          </ScrollReveal>
        </main>
        
        <Footer />
      </div>
    </>
  );
};
