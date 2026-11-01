'use client';

import React, { useState, useEffect, useRef } from 'react';
import { withOnwards } from '@/site/lib/price';
import Image from "@/components/ui/image";
import Link from 'next/link';
import {
  MapPin,
  BedDouble,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Phone,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  Download,
  PhoneCall,
  Compass,
  FileText,
  Shield,
  Eye,
  Check,
  IndianRupee,
  QrCode,
} from 'lucide-react';
import { Property } from '@/site/types/property';
import { PropertyCard } from '@/site/components/property/PropertyCard';
import { ScrollReveal } from '@/site/components/ui/ScrollReveal';
import { ScrollProgressBar } from '@/site/components/ui/ScrollProgressBar';
import { submitLead } from '@/site/lib/supabase/leads';
import { useRecentStore } from '@/site/store/recent';

interface PropertyDetailClientProps {
  property: Property;
  similarProperties?: Property[];
}

interface LeadModalContext {
  title: string;
  subtitle: string;
  tag: string;
  type: 'map' | 'floorplan' | 'brochure' | 'viewing' | 'general' | 'price-breakdown';
}

export const PropertyDetailClient: React.FC<PropertyDetailClientProps> = ({
  property,
  similarProperties = [],
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeFloorPlan, setActiveFloorPlan] = useState(0);
  const [floorPlanTab, setFloorPlanTab] = useState<'master' | 'floor' | 'individual'>('floor');
  const [selectedLayoutVariant, setSelectedLayoutVariant] = useState<'2bhk' | '3bhk' | '4bhk' | '5bhk'>('3bhk');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  // Lead Generation Gate Modal State
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadModalContext, setLeadModalContext] = useState<LeadModalContext>({
    title: 'Register to Unlock Complete Details',
    subtitle: 'Please register your details to unlock confidential coordinates, architectural floor plans, and receive priority advisory.',
    tag: 'Confidential Access',
    type: 'general',
  });
  const [isVerifiedLead, setIsVerifiedLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [otpStep, setOtpStep] = useState<'phone' | 'otp' | 'details'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // Direct Inquiry Desk state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: `I am interested in arranging a private viewing for ${property.title} (${property.bhk} - ${withOnwards(property.priceFormatted)}).`,
  });

  // Stores
  const addRecent = useRecentStore((s) => s.addRecent);

  // Check verified status from localStorage on mount
  useEffect(() => {
    addRecent(property.slug);
    try {
      const savedLead = localStorage.getItem('parmar_verified_lead');
      if (savedLead) {
        setIsVerifiedLead(true);
        const parsed = JSON.parse(savedLead);
        if (parsed.name) {
          setLeadForm((prev) => ({ ...prev, name: parsed.name, phone: parsed.phone || '' }));
          setEnquiryForm((prev) => ({ ...prev, name: parsed.name, phone: parsed.phone || '' }));
        }
      }
    } catch {
      // Ignore local storage errors
    }
  }, [property.slug, addRecent]);

  const images = property.images && property.images.length > 0 ? property.images : [property.coverImage];

  const layoutVariants = (property.layoutVariants && property.layoutVariants.length > 0)
    ? property.layoutVariants
    : [
    {
      id: 'default',
      tabLabel: property.bhk,
      title: property.bhk,
      area: property.carpetArea ? `${property.carpetArea} sq.ft` : 'Area on request',
      carpetArea: property.carpetArea ? `${property.carpetArea} Sq.Ft` : 'Area on request',
      price: property.priceFormatted,
      tower: '—',
      image: '/placeholder.png',
    },
  ];

  const currentVariant = layoutVariants.find((v) => v.id === selectedLayoutVariant) || layoutVariants[0];

  // Touch swipe gestures for Lightbox
  const lightboxTouchStartX = useRef<number | null>(null);
  const lightboxTouchEndX = useRef<number | null>(null);

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchEndX.current = null;
    lightboxTouchStartX.current = e.targetTouches[0].clientX;
  };

  const handleLightboxTouchMove = (e: React.TouchEvent) => {
    lightboxTouchEndX.current = e.targetTouches[0].clientX;
  };

  const handleLightboxTouchEnd = () => {
    if (!lightboxTouchStartX.current || !lightboxTouchEndX.current) return;
    const distance = lightboxTouchStartX.current - lightboxTouchEndX.current;
    if (distance > 45) {
      setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    } else if (distance < -45) {
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }
  };

  // Open Lead Gate Modal with tailored context
  const openLeadGate = (
    title: string,
    subtitle: string,
    tag: string,
    type: 'map' | 'floorplan' | 'brochure' | 'viewing' | 'general' | 'price-breakdown'
  ) => {
    setLeadModalContext({ title, subtitle, tag, type });
    setLeadSuccess(false);
    setOtpStep('phone');
    setOtpCode('');
    setLeadModalOpen(true);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.phone || leadForm.phone.length < 10) return;
    setOtpStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) return;
    setOtpStep('details');
  };

  const handleFinalLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) return;

    try {
      localStorage.setItem('parmar_verified_lead', JSON.stringify(leadForm));
    } catch {
      // Storage unavailable
    }

    setIsVerifiedLead(true);
    setLeadSuccess(true);
    setEnquiryForm((prev) => ({
      ...prev,
      name: leadForm.name,
      phone: leadForm.phone,
      email: leadForm.email,
    }));

    // Submit lead directly to Supabase
    submitLead({
      fullName: leadForm.name,
      phone: leadForm.phone,
      email: leadForm.email,
      sourceSlug: 'property_gate_modal',
      gateType: leadModalContext.type,
      propertyId: property.id,
      message: `Unlocked ${leadModalContext.type} (${leadModalContext.title}) for ${property.title}`,
    }).catch((err) => console.warn('Gated lead submit failed:', err));

    setTimeout(() => {
      setLeadModalOpen(false);
    }, 2200);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifiedLead(true);
    try {
      localStorage.setItem(
        'parmar_verified_lead',
        JSON.stringify({ name: enquiryForm.name, phone: enquiryForm.phone, email: enquiryForm.email })
      );
    } catch {
      // Storage unavailable
    }
    setEnquirySubmitted(true);

    // Submit lead directly to Supabase
    submitLead({
      fullName: enquiryForm.name,
      phone: enquiryForm.phone,
      email: enquiryForm.email,
      sourceSlug: 'property_sidebar_inquiry',
      propertyId: property.id,
      message: `Direct inquiry for ${property.title} (${property.priceFormatted})`,
    }).catch((err) => console.warn('Sidebar lead submit failed:', err));
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#EDEEE9] text-[#15181A] font-sans">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Breadcrumbs */}
      <div className="text-xs uppercase tracking-widest text-[#5B605F] font-semibold mb-4">
        <Link href="/" className="hover:underline">Home</Link> &bull;{' '}
        <Link href="/properties" className="hover:underline">Properties</Link> &bull;{' '}
        <span>{property.location}</span>
      </div>

      {/* Title & Price Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-8 pb-6 border-b border-[#CFD1CA]">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5282F] mb-1.5 block">
            {property.propertyType} &bull; {property.location}
          </span>
          <h1 className="font-sans text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#15181A]">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[#5B605F] mt-2.5">
            <MapPin className="w-4 h-4 text-[#C5282F]" />
            <span className="font-medium">{property.subLocation}</span>
          </div>
        </div>

        <div className="lg:text-right">
          <span className="text-xs uppercase tracking-wider text-[#5B605F] block font-medium mb-0.5">
            Starting Price
          </span>
          <span className="font-sans text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#C5282F]">
            {withOnwards(property.priceFormatted)}
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12">
        <div
          onClick={() => {
            setLightboxIndex(0);
            setLightboxOpen(true);
          }}
          className="md:col-span-2 relative h-[250px] sm:h-[380px] md:h-[480px] bg-[#CFD1CA] cursor-pointer group overflow-hidden border border-[#CFD1CA]"
        >
          <Image
            src={images[0]}
            alt={property.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <span className="absolute bottom-4 left-4 px-3.5 py-1.5 bg-[#15181A]/90 text-white text-xs uppercase tracking-wider font-medium backdrop-blur-sm">
            Click to View High-Resolution Gallery
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-3 sm:gap-4">
          {images.slice(1, 3).map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                setLightboxIndex(idx + 1);
                setLightboxOpen(true);
              }}
              className="relative h-[120px] sm:h-[180px] md:h-[232px] bg-[#CFD1CA] cursor-pointer group overflow-hidden border border-[#CFD1CA]"
            >
              <Image
                src={img}
                alt={`${property.title} perspective ${idx + 2}`}
                fill
                priority
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Configuration & Variants Table */}
      <ScrollReveal animation="fade-up">
        <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-6 sm:p-8 mb-12 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CFD1CA] pb-4 mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C5282F] block mb-1">
                Unit Typologies &amp; Layout Options
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#15181A]">
                Configuration Matrix &amp; Details
              </h2>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#CFD1CA] text-xs font-semibold text-[#15181A]">
                <Calendar className="w-3.5 h-3.5 text-[#C5282F]" />
                <span>Construction Status:</span>
                <span className="text-[#C5282F] font-bold">{property.possession}</span>
                {property.possessionDate ? <span className="text-[#5B605F] font-normal">· {property.possessionDate}</span> : null}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <div className="sm:hidden text-[11px] text-[#5B605F] mb-2 font-mono flex items-center gap-1">
              <span>Scroll horizontally to view unit specifications &rarr;</span>
            </div>
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[620px] sm:min-w-[680px]">
              <thead>
                <tr className="border-b border-[#CFD1CA] bg-[#EDEEE9] text-[11px] uppercase tracking-wider text-[#5B605F] font-semibold">
                  <th className="py-3.5 px-5 text-left w-[30%]">Typology / Variant</th>
                  <th className="py-3.5 px-5 text-left w-[25%]">Carpet Area</th>
                  <th className="py-3.5 px-5 text-left w-[27%]">Price Range (Onwards)</th>
                  <th className="py-3.5 px-5 text-right w-[18%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CFD1CA]">
                {layoutVariants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-white/80 transition-colors">
                    <td className="py-4 px-5 font-bold text-[#15181A] text-left">
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-[#C5282F] shrink-0" />
                        <span>{variant.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-[#5B605F] font-medium font-mono text-left">
                      {variant.area}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#15181A] text-left">
                      <span>{withOnwards(variant.price)}</span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          openLeadGate(
                            `Detailed Price Breakdown - ${variant.title}`,
                            `Register your mobile number to unlock the official price breakdown, payment schedule & government levies for ${variant.title} at ${property.title}.`,
                            `${variant.tabLabel} Price Breakdown`,
                            'price-breakdown'
                          )
                        }
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#C5282F] hover:bg-[#A31D23] text-white text-[11px] uppercase tracking-wider font-extrabold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95 border border-[#A31D23]"
                      >
                        <IndianRupee className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>PRICE BREAKDOWN</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>

      {/* Narrative & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-8 space-y-12">
          {/* Narrative */}
          <ScrollReveal animation="fade-up">
            <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CFD1CA] pb-4">
                <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#15181A]">
                  Project Overview
                </h2>
                {isVerifiedLead && property.brochureUrl ? (
                  <a
                    href={property.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-wider font-semibold border border-[#C5282F] transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Brochure PDF</span>
                  </a>
                ) : (
                  <button
                    onClick={() =>
                      openLeadGate(
                        'Download Full Brochure & Specifications',
                        'Please register with your name and mobile number to receive the comprehensive PDF brochure with architectural specifications.',
                        'Brochure Download',
                        'brochure'
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#EDEEE9] hover:bg-[#CFD1CA] text-[#15181A] text-xs uppercase tracking-wider font-semibold border border-[#CFD1CA] transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5282F]" />
                    <span>Download Brochure</span>
                  </button>
                )}
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#5B605F] leading-relaxed font-sans">
                {Array.isArray((property as any).paragraphs) && (property as any).paragraphs.length > 0 ? (
                  (property as any).paragraphs.map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  (property.description || '')
                    .split(/\n\n+/)
                    .map((para, idx) => <p key={idx}>{para}</p>)
                )}
              </div>

              {Array.isArray((property as any).sections) && (property as any).sections.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[#CFD1CA]">
                  {(property as any).sections.map((sec: any, idx: number) => (
                    <div key={idx} className="space-y-2">
                      {sec.title && (
                        <h4 className="text-xs uppercase tracking-widest font-semibold text-[#15181A]">
                          {sec.title}
                        </h4>
                      )}
                      {Array.isArray(sec.content) ? (
                        sec.content.map((p: string, pIdx: number) => (
                          <p key={pIdx} className="text-sm text-[#5B605F] leading-relaxed">{p}</p>
                        ))
                      ) : (
                        <p className="text-sm text-[#5B605F] leading-relaxed">{sec.content || sec.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-[#CFD1CA]">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#15181A] mb-4">
                  Signature Architectural Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(property.highlights || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#15181A]">
                      <CheckCircle2 className="w-4 h-4 text-[#C5282F] shrink-0 mt-0.5" />
                      <span>{typeof item === 'string' ? item : (item as any).title || JSON.stringify(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* MahaRERA Registration & QR Code */}
              <div className="pt-4 border-t border-[#CFD1CA] space-y-4">
                <div className="p-4 bg-white border border-[#CFD1CA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* QR Code Box */}
                    <div className="w-16 h-16 bg-[#F7F7F4] border border-[#CFD1CA] p-1 flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden">
                      {property.reraQrImage ? (
                        <Image
                          src={property.reraQrImage}
                          alt={`MahaRERA QR Code for ${property.title}`}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <QrCode className="w-12 h-12 text-[#15181A]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#5B605F]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C5282F]" />
                        <span>MahaRERA Registration</span>
                      </div>
                      <div className="font-mono text-sm sm:text-base font-bold text-[#15181A] mt-0.5 tracking-wider">
                        {property.reraId || 'P51900028192'}
                      </div>
                      <p className="text-[10px] text-[#5B605F] mt-0.5 font-sans">
                        Scan QR code to verify statutory credentials on maharera.mahaonline.gov.in
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right sm:border-l sm:border-[#CFD1CA] sm:pl-5 shrink-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#5B605F] block font-medium">Construction Status</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200 mt-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {property.possession}
                    </span>
                  </div>
                </div>

                {/* Developer Information (if configured in CMS) */}
                {property.developerName && (
                  <div className="p-4 bg-white border border-[#CFD1CA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#5B605F] block">
                        Developer &amp; Architectural House
                      </span>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-[#15181A] mt-0.5">
                        {property.developerName}
                      </h4>
                      {property.developerDescription && (
                        <p className="text-xs text-[#5B605F] mt-1 font-sans leading-relaxed">
                          {property.developerDescription}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Gated Floor Plans Section */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#15181A]">
                    Floor Plan
                  </h2>
                  <p className="text-xs text-[#5B605F] mt-1">
                    Official architectural layouts, structural floor plates &amp; unit blueprints
                  </p>
                </div>

                {!isVerifiedLead && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#15181A] text-white text-[11px] uppercase tracking-wider font-medium">
                    <Lock className="w-3 h-3 text-[#C5282F]" />
                    <span>Registration Required</span>
                  </span>
                )}
              </div>

              {/* 3 Floor Plan Tabs: Master Plan, Floor Plan, Individual Layout */}
              <div className="flex gap-2 mb-4 border-b border-[#CFD1CA] pb-3 overflow-x-auto">
                {[
                  { id: 'master', label: 'Master Plan' },
                  { id: 'floor', label: 'Floor Plan' },
                  { id: 'individual', label: 'Individual Layout' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFloorPlanTab(tab.id as 'master' | 'floor' | 'individual')}
                    className={`px-5 py-2.5 text-xs uppercase tracking-wider font-bold transition-all shrink-0 cursor-pointer ${
                      floorPlanTab === tab.id
                        ? 'bg-[#C5282F] text-white shadow-xs'
                        : 'bg-[#EDEEE9] text-[#5B605F] hover:text-[#15181A] hover:bg-[#CFD1CA]/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sub-variants for Individual Layout */}
              {floorPlanTab === 'individual' && (
                <div className="flex flex-wrap items-center gap-2 mb-5 p-2.5 bg-[#EDEEE9] border border-[#CFD1CA]">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#5B605F] uppercase tracking-wider mr-1 sm:mr-2">
                    Select Typology:
                  </span>
                  {layoutVariants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedLayoutVariant(variant.id as any)}
                      className={`px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        selectedLayoutVariant === variant.id
                          ? 'bg-[#15181A] text-white shadow-xs'
                          : 'bg-white text-[#5B605F] hover:text-[#15181A] border border-[#CFD1CA]'
                      }`}
                    >
                      <span>{variant.tabLabel}</span>
                      <span className="opacity-75 font-normal ml-1">({variant.carpetArea})</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Floor Plan Blueprint Preview with Authentic Architectural CAD Layout */}
              <div className="relative overflow-hidden border border-[#CFD1CA] bg-[#121517] h-[400px] sm:h-[460px] flex items-center justify-center p-6 text-center select-none">
                {/* Real Architectural CAD Floor Plan Blueprint Image with Blur */}
                <Image
                  src={
                    floorPlanTab === 'master'
                      ? '/floorplans/master-plan.jpg'
                      : floorPlanTab === 'floor'
                      ? '/floorplans/floor-plate.jpg'
                      : currentVariant.image
                  }
                  alt={`${property.title} - ${floorPlanTab === 'individual' ? currentVariant.title : floorPlanTab}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain filter blur-[5px] scale-105 opacity-85 pointer-events-none select-none"
                />

                {/* Subtle dark backdrop overlay */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

                {/* Technical blueprint annotations */}
                <div className="absolute top-4 left-4 z-10 bg-black/75 px-3 py-1 text-[10px] font-mono text-white/90 uppercase tracking-widest border border-white/20">
                  {floorPlanTab === 'master'
                    ? 'Master Layout // Sanctioned Site Blueprint'
                    : floorPlanTab === 'floor'
                    ? 'Floor Plate // Tower Cluster Schematic'
                    : `Individual Unit Layout // ${currentVariant.title}`}
                </div>

                <div className="absolute top-4 right-4 z-10 bg-black/75 px-3 py-1 text-[10px] font-mono text-white/90 uppercase tracking-widest border border-white/20">
                  {floorPlanTab === 'master'
                    ? 'Total Master Plot'
                    : floorPlanTab === 'floor'
                    ? 'Typical Floor Plate'
                    : `Carpet: ${currentVariant.carpetArea}`}
                </div>

                {/* Simple VIEW PLAN Button (Triggers OTP Modal) */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      openLeadGate(
                        `Unlock ${
                          floorPlanTab === 'master'
                            ? 'Master Plan'
                            : floorPlanTab === 'floor'
                            ? 'Floor Plan'
                            : `${currentVariant.title} Floor Plan`
                        }`,
                        `Please verify your mobile number to unlock instant architectural blueprints and room-wise dimensional drawings for ${
                          floorPlanTab === 'individual' ? currentVariant.title : property.title
                        }.`,
                        `${
                          floorPlanTab === 'master'
                            ? 'Master Plan Gate'
                            : floorPlanTab === 'floor'
                            ? 'Floor Plan Gate'
                            : `${currentVariant.tabLabel} Gate`
                        }`,
                        'floorplan'
                      )
                    }
                    className="px-8 py-3.5 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs sm:text-sm uppercase tracking-widest font-extrabold transition-all duration-300 shadow-2xl hover:scale-105 flex items-center justify-center cursor-pointer active:scale-95 border-2 border-white/30"
                  >
                    <span>VIEW PLAN</span>
                  </button>
                  <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider mt-2.5 bg-black/70 px-3 py-1 backdrop-blur-sm border border-white/15">
                    Click to unlock high-resolution CAD drawings
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Beautified Amenities Section */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className={`bg-[#F7F7F4] border border-[#CFD1CA] p-6 sm:p-8 ${(property.amenities || []).length === 0 ? 'hidden' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-[#CFD1CA] pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C5282F] block mb-1">
                    World-Class Lifestyle
                  </span>
                  <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#15181A]">
                    Signature Amenities
                  </h2>
                </div>
                <span className="text-xs font-semibold text-[#5B605F] uppercase tracking-wider">
                  {(property.amenities || []).length} Curated Offerings
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(property.amenities || []).map((amenity, idx) => (
                  <div
                    key={idx}
                    className="group bg-white border border-[#CFD1CA] hover:border-[#C5282F] p-4 flex items-center gap-3.5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="w-10 h-10 rounded-sm bg-[#EDEEE9] group-hover:bg-[#C5282F] group-hover:text-white text-[#C5282F] flex items-center justify-center shrink-0 transition-colors duration-300">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#15181A] group-hover:text-[#C5282F] transition-colors block">
                        {amenity}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[#5B605F]">
                        Premium Lifestyle Amenity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Location Section with Blurred Map & ENQUIRE Button */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#15181A]">
                    Enclave Location &amp; Vicinity
                  </h2>
                  <p className="text-xs text-[#5B605F] mt-1">
                    Prime locality: {property.subLocation?.toLowerCase().includes(property.location.toLowerCase()) ? property.subLocation : [property.subLocation, property.location].filter(Boolean).join(', ')}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#15181A] text-white text-[11px] uppercase tracking-wider font-medium">
                  <Shield className="w-3 h-3 text-[#C5282F]" />
                  <span>Verified Geolocation</span>
                </span>
              </div>

              {/* Blurred Map Display with Centered ENQUIRE Button */}
              <div className="relative w-full h-80 sm:h-96 border border-[#CFD1CA] bg-[#121517] overflow-hidden flex items-center justify-center p-6 text-center select-none">
                {/* Blurred Real Estate Map Image */}
                <Image
                  src="/mumbai-map.jpg"
                  alt={`${property.location} Location Map`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover filter blur-[6px] scale-110 opacity-75 pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

                {/* Stylized Nautical / Topographic Radar Background */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#CFD1CA_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <div className="w-48 h-48 border border-white/20 rounded-full" />
                  <div className="absolute w-72 h-72 border border-dashed border-white/15 rounded-full" />
                  <div className="absolute w-96 h-96 border border-white/10 rounded-full" />
                  <div className="absolute w-full h-px bg-white/10" />
                  <div className="absolute h-full w-px bg-white/10" />
                </div>

                {/* Location Marker Radar Pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="relative flex h-8 w-8">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5282F] opacity-75" />
                    <span className="relative inline-flex rounded-full h-8 w-8 bg-[#C5282F] items-center justify-center text-white shadow-lg">
                      <MapPin className="w-4 h-4" />
                    </span>
                  </span>
                </div>

                {/* Floating ENQUIRE Button on Blurred Map (Triggers OTP Modal) */}
                <div className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() =>
                      openLeadGate(
                        'Unlock Location & Neighborhood Coordinates',
                        'Please verify your mobile number to unlock verified enclave coordinates, access corridors, and neighborhood infrastructure analytics.',
                        'Location Gate',
                        'map'
                      )
                    }
                    className="px-8 py-3.5 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-widest font-extrabold shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer border-2 border-white/30 active:scale-95"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>ENQUIRE</span>
                  </button>
                  <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider mt-2.5 bg-black/60 px-3 py-1 backdrop-blur-sm border border-white/15">
                    Click to unlock precise GPS coordinates
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Sticky Inquiry Card */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 bg-[#F7F7F4] border border-[#CFD1CA] p-6 space-y-6 shadow-xs">
            <div className="pb-4 border-b border-[#CFD1CA]">
              <span className="text-xs uppercase tracking-widest text-[#5B605F] block mb-1 font-medium">
                Direct Inquiry Desk
              </span>
              <p className="font-sans text-2xl font-bold tracking-tight text-[#15181A]">
                {withOnwards(property.priceFormatted)}
              </p>
              <span className="text-xs text-[#5B605F] font-mono block mt-1">
                MahaRERA: {property.reraId}
              </span>
            </div>

            {enquirySubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#C5282F] mx-auto" />
                <h3 className="font-sans text-lg font-bold text-[#15181A]">Inquiry Registered</h3>
                <p className="text-xs text-[#5B605F]">
                  An advisory partner will review your credentials and contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#CFD1CA] text-xs focus:outline-none focus:border-[#C5282F]"
                    placeholder="Aditya Birla"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#CFD1CA] text-xs focus:outline-none focus:border-[#C5282F]"
                    placeholder="+91 98200 00000"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#CFD1CA] text-xs focus:outline-none focus:border-[#C5282F]"
                    placeholder="aditya@example.com"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Private Viewing</span>
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-[#CFD1CA] space-y-2 text-xs text-[#5B605F]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5282F]" />
                <a href="tel:+912266669733" className="hover:text-[#15181A] font-medium">
                  +91 (022) 6666 9733
                </a>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Direct Developer Consultation</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Developer Overview Section (2-3 lines before Similar Residences) */}
      <ScrollReveal animation="fade-up">
        <div className="bg-[#F7F7F4] border border-[#CFD1CA] p-8 mb-16 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CFD1CA] pb-4 mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C5282F] block mb-1">
                Legacy of Architectural Excellence
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#15181A]">
                Developer Overview
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#15181A] bg-[#EDEEE9] px-3.5 py-1.5 border border-[#CFD1CA]">
              <ShieldCheck className="w-4 h-4 text-[#C5282F]" />
              <span>{property.developerName || 'Verified Tier-1 Developer'}</span>
            </div>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-[#5B605F] leading-relaxed font-sans">
            <p>
              {property.developerDescription ||
                "Crafted by one of Mumbai's most reputed architectural conglomerates, renowned for engineering excellence, timely structural handovers, and bespoke luxury benchmarks across prime micro-markets. Every development embodies earthquake-resistant RCC frameworks, IGBC green building certifications, and master-crafted spatial aesthetics designed for generations."}
            </p>
            <p>
              With an unwavering commitment to statutory compliance and transparency under MahaRERA governance, the group guarantees uncompromised quality standards from foundational excavation to final finishing touches. Every residence reflects thoughtful layout optimization, expansive natural illumination, and premium structural integrity.
            </p>
            <p>
              Dedicated to delivering sustainable urban landmarks, our development footprint integrates eco-conscious construction practices, advanced water management systems, and curated open-air wellness hubs, crafting sanctuaries where discerning families thrive for decades to come.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Similar Residences */}
      {similarProperties.length > 0 && (
        <div className="pt-16 border-t border-[#CFD1CA]">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#15181A] mb-8">
            Similar Mumbai Residences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProperties.map((p, idx) => (
              <ScrollReveal key={p.id} animation="fade-up" delay={idx * 100} className="h-full">
                <PropertyCard property={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* High-Converting Lead Generation Pop-up Modal */}
      {leadModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#15181A]/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLeadModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#F7F7F4] border border-[#CFD1CA] shadow-2xl p-5 sm:p-8 animate-fadeIn max-h-[92vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLeadModalOpen(false)}
              className="absolute top-4 right-4 text-[#5B605F] hover:text-[#15181A] p-1.5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {leadSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-[#EDEEE9] border border-[#CFD1CA] rounded-full flex items-center justify-center mx-auto text-[#C5282F]">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="font-sans text-xl font-bold text-[#15181A] tracking-tight">
                  Access Granted
                </h3>
                <p className="text-xs text-[#5B605F] leading-relaxed">
                  Thank you, <strong>{leadForm.name}</strong>. Full confidential coordinates, floor plans, and portfolio details are now unlocked for your session.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] text-[#C5282F] font-semibold">
                    An advisory partner will reach out at {leadForm.phone}.
                  </span>
                </div>
              </div>
            ) : (
              <div>
                {/* Brand Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#C5282F]" />
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#5B605F]">
                    Parmar Properties &bull; {leadModalContext.tag}
                  </span>
                </div>

                <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#15181A] mb-2">
                  {leadModalContext.title}
                </h3>
                <p className="text-xs text-[#5B605F] mb-6 leading-relaxed">
                  {leadModalContext.subtitle}
                </p>

                {/* 3-Step OTP Lead Form */}
                {otpStep === 'phone' && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-1.5">
                        Enter Mobile Number *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3.5 text-xs bg-[#EDEEE9] border border-r-0 border-[#CFD1CA] text-[#5B605F] font-semibold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                          placeholder="98200 00000"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#CFD1CA] text-xs focus:outline-none focus:border-[#C5282F]"
                        />
                      </div>
                      <p className="text-[10px] text-[#5B605F] mt-1.5">
                        We will send a quick verification code to your mobile number.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={leadForm.phone.length < 10}
                      className="w-full py-3.5 bg-[#C5282F] hover:bg-[#A31D23] disabled:opacity-50 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Get OTP</span>
                    </button>
                  </form>
                )}

                {otpStep === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="bg-[#EDEEE9]/60 p-3 border border-[#CFD1CA] mb-2 text-xs">
                      <p className="text-[#15181A] font-medium">Enter OTP sent to +91 {leadForm.phone}</p>
                      <p className="text-[11px] text-[#C5282F] font-sans font-bold mt-0.5">Demo OTP: 4821</p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-1.5">
                        4-Digit Verification Code *
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="4821"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#CFD1CA] text-base tracking-[0.3em] font-sans font-bold tabular-nums text-center focus:outline-none focus:border-[#C5282F]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOtpStep('phone')}
                        className="w-1/3 py-2.5 bg-[#EDEEE9] hover:bg-[#CFD1CA] text-[#15181A] text-xs uppercase tracking-wider font-semibold border border-[#CFD1CA]"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={otpCode.length < 4}
                        className="w-2/3 py-2.5 bg-[#C5282F] hover:bg-[#A31D23] disabled:opacity-50 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify OTP</span>
                      </button>
                    </div>
                  </form>
                )}

                {otpStep === 'details' && (
                  <form onSubmit={handleFinalLeadSubmit} className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Mobile Verified (+91 {leadForm.phone}). Please complete your details:</span>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        placeholder="Aditya Birla"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#CFD1CA] text-xs focus:outline-none focus:border-[#C5282F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#15181A] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        placeholder="aditya@example.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#CFD1CA] text-xs focus:outline-none focus:border-[#C5282F]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Confirm & Unlock Details</span>
                    </button>
                  </form>
                )}

                <div className="mt-5 pt-3.5 border-t border-[#CFD1CA] flex items-center justify-between text-[10px] text-[#5B605F]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#C5282F]" /> Zero spam guarantee
                  </span>
                  <span>MahaRERA Compliant</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal with Touch Swipe */}
      {lightboxOpen && (
        <div
          onTouchStart={handleLightboxTouchStart}
          onTouchMove={handleLightboxTouchMove}
          onTouchEnd={handleLightboxTouchEnd}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 select-none"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#C5282F] p-2 cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-5xl h-[55vh] sm:h-[70vh]">
            <Image
              src={images[lightboxIndex]}
              alt={`${property.title} full view`}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-6 mt-6 text-white">
            <button
              onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-sm font-sans tracking-widest">
              {lightboxIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <span className="text-xs text-white/50 mt-2 font-mono">
            Swipe left or right to browse photos
          </span>
        </div>
      )}
    </div>
  );
};
