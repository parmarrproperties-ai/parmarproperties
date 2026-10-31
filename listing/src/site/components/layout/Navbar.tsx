'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, X, PhoneCall, CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import { submitLead } from '@/site/lib/supabase/leads';

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get('tab') : null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [advisoryModalOpen, setAdvisoryModalOpen] = useState(false);
  const [advisorySubmitted, setAdvisorySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [advisoryForm, setAdvisoryForm] = useState({
    name: '',
    phone: '',
    email: '',
    assetType: 'Residential Luxury',
    message: '',
  });

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', id: 'home', label: 'Home' },
    { href: '/properties?tab=buy', id: 'buy', label: 'Buy' },
    { href: '/properties?tab=new-launches', id: 'new-launches', label: 'New Launches' },
    { href: '/properties?tab=luxury-collection', id: 'luxury-collection', label: 'Luxury Collection' },
    { href: '/commercials', id: 'commercials', label: 'Commercials' },
    { href: '/locations', id: 'locations', label: 'Location' },
    { href: '/market-intelligence', id: 'intelligence', label: 'Insights' },
  ];

  const isLinkActive = (id: string) => {
    if (!pathname) return false;
    if (id === 'home') {
      return pathname === '/';
    }
    if (pathname.startsWith('/properties')) {
      if (id === 'new-launches') {
        return currentTab === 'new-launches';
      }
      if (id === 'luxury-collection') {
        return currentTab === 'luxury-collection';
      }
      if (id === 'buy') {
        return !currentTab || currentTab === 'buy';
      }
      return false;
    }
    if (id === 'commercials') {
      return pathname.startsWith('/commercials');
    }
    if (id === 'locations') {
      return pathname.startsWith('/locations');
    }
    if (id === 'intelligence') {
      return pathname.startsWith('/market-intelligence');
    }
    return false;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[0]) => {
    setMobileMenuOpen(false);
    if (link.id === 'home' && pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAdvisorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await submitLead({
        fullName: advisoryForm.name,
        phone: advisoryForm.phone,
        email: advisoryForm.email,
        assetClass: advisoryForm.assetType,
        message: advisoryForm.message,
        sourceSlug: 'navbar_advisory',
      });
      if (!res.success) {
        console.error('Navbar lead submission rejected by database:', res.error);
      }
    } catch (err) {
      console.error('Navbar lead submit exception:', err);
    } finally {
      setIsSubmitting(false);
      setAdvisorySubmitted(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#EDEEE9]/95 backdrop-blur-md text-[#15181A] border-b border-[#CFD1CA] shadow-xs transition-colors duration-200 py-[4px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center group cursor-pointer py-0.5 shrink-0 mr-3"
          >
            <Image
              src="/logo_without_bg.png"
              alt="Parmar Properties - Building Relationships"
              width={240}
              height={85}
              className="h-10 sm:h-12 md:h-14 lg:h-15 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation Links: HOME, BUY, NEW LAUNCHES, LUXURY COLLECTION, COMMERCIALS, LOCATION, INSIGHTS */}
          <nav className="hidden xl:flex items-center space-x-5 2xl:space-x-6">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.id);
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`relative text-xs font-sans tracking-[0.1em] uppercase py-1.5 transition-colors duration-300 group whitespace-nowrap ${
                    isActive ? 'text-[#C5282F] font-bold' : 'text-[#5B605F] hover:text-[#C5282F]'
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Active Red Underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#C5282F] transition-all duration-300 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Mobile & Tablet Navigation Toggle */}
          <div className="flex xl:hidden items-center shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 focus:outline-none text-[#15181A] hover:text-[#C5282F] transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <div className="w-5 flex flex-col justify-center gap-[4.5px]" aria-hidden="true">
                  <span
                    className="w-full bg-[#15181A] block shrink-0"
                    style={{ height: '1.5px', minHeight: '1.5px', maxHeight: '1.5px' }}
                  />
                  <span
                    className="w-full bg-[#15181A] block shrink-0"
                    style={{ height: '1.5px', minHeight: '1.5px', maxHeight: '1.5px' }}
                  />
                  <span
                    className="w-full bg-[#15181A] block shrink-0"
                    style={{ height: '1.5px', minHeight: '1.5px', maxHeight: '1.5px' }}
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 xl:hidden bg-[#15181A]/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-[52px] sm:top-[64px] right-0 bottom-0 w-[85%] max-w-xs sm:max-w-sm bg-[#EDEEE9] border-l border-[#CFD1CA] p-5 sm:p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-1">
              <nav className="flex flex-col space-y-1.5">
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.id);
                  return (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      className={`text-sm tracking-wide flex items-center justify-between py-2.5 px-3.5 transition-all duration-200 rounded-xs border-l-2 ${
                        isActive
                          ? 'bg-[#C5282F]/10 text-[#C5282F] font-bold border-[#C5282F] pl-4'
                          : 'text-[#15181A] hover:bg-[#C5282F]/10 hover:text-[#C5282F] border-transparent hover:pl-4'
                      }`}
                    >
                      <span className="uppercase tracking-wider text-xs">{link.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-[#C5282F]" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-5 border-t border-[#CFD1CA] space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAdvisorySubmitted(false);
                  setAdvisoryModalOpen(true);
                }}
                className="w-full py-3 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>TALK TO OUR ADVISORY</span>
              </button>
              <div className="text-[11px] text-[#8E9291] text-center">
                MahaRERA: A51900018442
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TALK TO OUR ADVISORY MODAL */}
      {advisoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#F7F7F4] border border-[#CFD1CA] shadow-2xl p-5 sm:p-8 text-[#15181A] max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setAdvisoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#5B605F] hover:text-[#15181A] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {advisorySubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-[#C5282F]/10 border border-[#C5282F]/20 text-[#C5282F] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#15181A] font-light">
                  Consultation Scheduled
                </h3>
                <p className="text-xs sm:text-sm text-[#5B605F] max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{advisoryForm.name}</strong>. Our Senior Real Estate Advisory Director will reach out to you directly at <strong>{advisoryForm.phone}</strong> for a discreet private consultation.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setAdvisoryModalOpen(false)}
                    className="px-6 py-2.5 bg-[#15181A] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C5282F] transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#C5282F]/10 text-[#C5282F] text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
                    <ShieldCheck className="w-3 h-3" /> Private Advisory Desk
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#15181A] font-light">
                    TALK TO OUR ADVISORY
                  </h3>
                  <p className="text-xs text-[#5B605F] mt-1 font-sans">
                    Connect directly with Parmar Properties’ senior promoters for off-market access, capital valuations, or portfolio structuring in Mumbai.
                  </p>
                </div>

                <form onSubmit={handleAdvisorySubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#15181A] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={advisoryForm.name}
                      onChange={(e) => setAdvisoryForm({ ...advisoryForm, name: e.target.value })}
                      placeholder="e.g. Rahul Singhania"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CFD1CA] focus:border-[#C5282F] focus:outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase tracking-wider font-semibold text-[#15181A] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={advisoryForm.phone}
                        onChange={(e) => setAdvisoryForm({ ...advisoryForm, phone: e.target.value })}
                        placeholder="+91 98200 00000"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#CFD1CA] focus:border-[#C5282F] focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider font-semibold text-[#15181A] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={advisoryForm.email}
                        onChange={(e) => setAdvisoryForm({ ...advisoryForm, email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#CFD1CA] focus:border-[#C5282F] focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#15181A] mb-1">
                      Interest / Asset Class
                    </label>
                    <select
                      value={advisoryForm.assetType}
                      onChange={(e) => setAdvisoryForm({ ...advisoryForm, assetType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CFD1CA] focus:border-[#C5282F] focus:outline-none text-xs"
                    >
                      <option value="Residential Luxury">Luxury Residential (Worli, Bandra, Juhu, Malabar Hill)</option>
                      <option value="New Launches">Pre-Launch &amp; Upcoming Towers</option>
                      <option value="Commercial Acquisition">Commercial Grade-A (BKC, Lower Parel, Retail)</option>
                      <option value="Private Off-Market">Confidential Off-Market Trophy Assets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#15181A] mb-1">
                      Message / Requirements (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={advisoryForm.message}
                      onChange={(e) => setAdvisoryForm({ ...advisoryForm, message: e.target.value })}
                      placeholder="Preferred carpet area, target budget, or specific enclaves of interest..."
                      className="w-full px-3.5 py-2 bg-white border border-[#CFD1CA] focus:border-[#C5282F] focus:outline-none text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#C5282F] hover:bg-[#A31D23] disabled:opacity-60 text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'CONNECTING ADVISORY...' : 'REQUEST PRIVATE CONSULTATION'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export const Navbar: React.FC = () => {
  return (
    <Suspense
      fallback={
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#EDEEE9]/95 backdrop-blur-md text-[#15181A] border-b border-[#CFD1CA] py-[5px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="h-14 w-40" />
          </div>
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
};
