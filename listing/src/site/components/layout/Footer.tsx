import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#15181A] text-white border-t border-[#23272A] pt-10 pb-8 sm:py-14 text-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Brand & Verification Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-[#23272A] gap-6">
          <div>
            {/* Highlighted PARMAR PROPERTIES Brand */}
            <div>
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-[0.12em] uppercase font-bold text-white block">
                <span className="text-[#C5282F] font-black drop-shadow-sm">PARMAR</span> PROPERTIES
              </span>
              <div className="mt-2 mb-2 flex items-center gap-3">
                <span className="whitespace-nowrap shrink-0 px-2.5 py-0.5 bg-[#C5282F] text-white text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-extrabold shadow-sm inline-block">
                  EST. 1981
                </span>
                <div className="h-0.5 w-20 sm:w-28 bg-[#C5282F]" />
              </div>
              <p className="text-xs text-[#CFD1CA] tracking-wider uppercase font-medium">
                Mumbai &bull; Prime Residential Real Estate Advisory
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 text-xs w-full sm:w-auto">
            <a
              href="https://www.parmarproperties.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[#CFD1CA] border border-[#33383D] text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5282F]" />
              <span>MahaRERA: A51900018442</span>
            </div>
          </div>
        </div>

        {/* 2. Portfolio Sections (No 'Navigation' Header - Clean, Uncluttered Directory) */}
        <div className="py-4 sm:py-5 border-b border-[#23272A]">
          <nav aria-label="Portfolio Directory" className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs font-medium text-[#CFD1CA]">
            <Link href="/" className="hover:text-[#C5282F] transition-colors">Home</Link>
            <span className="text-[#33383D] select-none">&bull;</span>
            <Link href="/properties?tab=buy" className="hover:text-[#C5282F] transition-colors">Buy</Link>
            <span className="text-[#33383D] select-none">&bull;</span>
            <Link href="/properties?tab=new-launches" className="hover:text-[#C5282F] transition-colors">New Launches</Link>
            <span className="text-[#33383D] select-none">&bull;</span>
            <Link href="/properties?tab=luxury-collection" className="hover:text-[#C5282F] transition-colors">Luxury Collection</Link>
            <span className="text-[#33383D] select-none">&bull;</span>
            <Link href="/commercials" className="hover:text-[#C5282F] transition-colors">Commercials</Link>
            <span className="text-[#33383D] select-none">&bull;</span>
            <Link href="/locations" className="hover:text-[#C5282F] transition-colors">Locations</Link>
            <span className="text-[#33383D] select-none">&bull;</span>
            <Link href="/market-intelligence" className="hover:text-[#C5282F] transition-colors">Insights</Link>
          </nav>
        </div>

        {/* 3. Office & Direct Advisory Info (Clean 2-Column Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 sm:py-8 border-b border-[#23272A] text-xs text-[#CFD1CA]">
          {/* Mumbai Office */}
          <div className="space-y-1">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5282F]" />
              <span>Mumbai Corporate Office</span>
            </h4>
            <p className="text-white/90">Peninsula Center, 208, Doctor SS Rao Marg, Parel, Mumbai 400012</p>
            <p className="text-[11px] text-white/50">Hours: Mon – Sun: 10:00 AM – 6:30 PM IST</p>
          </div>

          {/* Direct Advisory Contact */}
          <div className="space-y-1 md:text-right">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-2 md:justify-end flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C5282F]" />
              <span>Direct Advisory Desk</span>
            </h4>
            <div className="flex flex-col md:items-end gap-1">
              <a
                href="tel:+912266669733"
                className="hover:text-white transition-colors font-semibold text-sm text-white"
              >
                +91 (022) 6666 9733
              </a>
              <a
                href="mailto:contact@parmarproperties.com"
                className="hover:text-white transition-colors text-xs text-[#CFD1CA] flex items-center gap-1.5"
              >
                <Mail className="w-3 h-3 text-[#C5282F]" />
                <span>contact@parmarproperties.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4. Bottom Copyright & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5B605F]">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()}{' '}
            <strong className="text-white font-bold tracking-wider">
              <span className="text-[#C5282F]">PARMAR</span> PROPERTIES
            </strong>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://www.parmarproperties.in/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#CFD1CA] hover:text-[#C5282F] transition-colors"
            >
              Terms &amp; Conditions
            </a>
            <span className="text-[#33383D]">&bull;</span>
            <a
              href="https://www.parmarproperties.in/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#CFD1CA] hover:text-[#C5282F] transition-colors"
            >
              Privacy Policy
            </a>
          </div>

          <p className="text-center sm:text-right">MahaRERA Registration No. A51900018442</p>
        </div>
      </div>
    </footer>
  );
};
