'use client';

import React, { useState } from 'react';
import Image from '@/components/ui/image';
import { MapPin, Maximize2, Briefcase, CheckCircle2 } from 'lucide-react';
import { submitLead } from '@/site/lib/supabase/leads';
import type { CommercialProperty } from '@/site/data/commercials';
import { dealTypeLabel } from '@/lib/segments';

export function CommercialCard({ property }: { property: CommercialProperty }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ nameOrCompany: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="group bg-[#F7F7F4] border border-[#CFD1CA] hover:border-[#15181A] hover:-translate-y-2 hover:shadow-2xl transition-all duration-400 ease-out flex flex-col overflow-hidden will-change-transform relative">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C5282F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />

      {/* Image Container */}
      <div className="relative aspect-16/10 w-full bg-[#EDEEE9] overflow-hidden">
        <Image
          src={property.coverImage}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />



        {/* Buy / Pre-Lease / Rent */}
        <div className="absolute top-0 left-0 bg-[#C5282F] text-white px-3 py-1 z-10 text-[10px] uppercase tracking-[0.15em] font-semibold font-sans">
          {dealTypeLabel(property.dealType)}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-0 left-0 bg-[#15181A] text-white px-3.5 py-1.5 z-10">
          <span className="font-serif text-xs sm:text-sm font-medium tracking-wide">
            {property.priceFormatted}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#5B605F] mb-2 font-sans">
            <MapPin className="w-3.5 h-3.5 text-[#C5282F]" />
            <span>{property.subLocation}</span>
          </div>

          <h3 className="font-serif text-xl font-normal text-[#15181A] group-hover:text-[#C5282F] transition-colors line-clamp-1 mb-2">
            {property.title}
          </h3>

          <p className="text-xs text-[#5B605F] line-clamp-2 mb-5 font-sans leading-relaxed">
            {property.tagline}
          </p>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#CFD1CA] text-xs text-[#15181A]">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#5B605F]" />
              <span>{property.carpetArea > 0 ? `${property.carpetArea.toLocaleString()} sq.ft` : 'Area on request'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#5B605F]" />
              <span className="truncate">{property.floor}</span>
            </div>
            <div className="text-right text-[#5B605F] truncate text-[11px]">
              {property.possession}
            </div>
          </div>
        </div>

        <div className="pt-4 mt-auto border-t border-[#CFD1CA]/60 flex flex-col gap-2">
          {property.reraId ? (
            <div className="text-[10px] uppercase tracking-wider text-[#5B605F] font-mono flex items-center justify-between">
              <span>MahaRERA:</span>
              <span className="font-semibold text-[#15181A]">{property.reraId.split(/[,;]/)[0].trim()}</span>
            </div>
          ) : null}
          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-2.5 px-4 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs font-sans uppercase tracking-[0.12em] font-semibold text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
          >
            <span>INQUIRE COMMERCIAL</span>
          </button>
        </div>
      </div>

      {/* Commercial Inquiry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#F7F7F4] border border-[#CFD1CA] p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#5B605F] hover:text-[#15181A]"
            >
              ✕
            </button>
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#C5282F] mx-auto" />
                <h4 className="font-serif text-xl text-[#15181A]">Acquisition Dossier Requested</h4>
                <p className="text-xs text-[#5B605F]">
                  Our Commercial Advisory Director will contact your desk regarding <strong>{property.title}</strong> within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setModalOpen(false);
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#15181A] text-white text-xs uppercase font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="text-center space-y-3 mb-4">
                  <h3 className="font-serif text-2xl text-[#15181A]">Commercial Acquisition Desk</h3>
                  <p className="text-xs text-[#5B605F]">
                    Receive detailed lease schedules, capital cap rates &amp; architectural floor plans for <strong>{property.title}</strong>.
                  </p>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSubmitting(true);
                    try {
                      await submitLead({
                        fullName: leadForm.nameOrCompany,
                        companyName: leadForm.nameOrCompany,
                        phone: leadForm.phone,
                        commercialId: property.id,
                        sourceSlug: 'commercial_card_modal',
                        message: `Commercial inquiry for ${property.title} (${property.priceFormatted}) in ${property.location}`,
                      });
                    } catch (err) {
                      console.warn('Commercial lead submit error:', err);
                    } finally {
                      setSubmitting(false);
                      setSubmitted(true);
                    }
                  }}
                  className="space-y-3 text-left text-xs"
                >
                  <div>
                    <label className="block uppercase tracking-wider font-semibold mb-1">Company / Full Name</label>
                    <input
                      required
                      type="text"
                      value={leadForm.nameOrCompany}
                      onChange={(e) => setLeadForm({ ...leadForm, nameOrCompany: e.target.value })}
                      placeholder="e.g. Goldman Sachs Asset Desk"
                      className="w-full p-2.5 bg-white border border-[#CFD1CA] text-xs outline-none focus:border-[#C5282F]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider font-semibold mb-1">Official Mobile / Work Phone</label>
                    <input
                      required
                      type="tel"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="+91 98200 00000"
                      className="w-full p-2.5 bg-white border border-[#CFD1CA] text-xs outline-none focus:border-[#C5282F]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#C5282F] hover:bg-[#A31D23] disabled:opacity-60 text-white text-xs uppercase tracking-widest font-semibold cursor-pointer mt-2"
                  >
                    {submitting ? 'Submitting Inquiry...' : 'Request Commercial Dossier'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
