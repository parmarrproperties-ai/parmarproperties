import { footer } from "@/content/content";

export const FooterContact = () => {
  const headOffice = footer.contact.find(c => c.label === "Head Office");
  const emailUs = footer.contact.find(c => c.label === "Email Us");
  const callUs = footer.contact.find(c => c.label === "Call Us");

  return (
    <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-12 font-['Instrument_Sans']">
      {headOffice && (
        <div className="flex flex-col order-2 md:order-none">
          <div className="hidden md:block text-[11px] font-medium text-white/40 uppercase tracking-widest mb-4">
            {headOffice.label}
          </div>
          <a
            href={headOffice.href}
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
  );
};
