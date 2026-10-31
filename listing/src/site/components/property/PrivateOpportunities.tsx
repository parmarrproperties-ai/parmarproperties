'use client';

import React, { useState } from 'react';
import { Lock, Shield, CheckCircle2, X, Phone, User, Mail, KeyRound, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/site/components/ui/ScrollReveal';

import { HOME_PAGE_CONTENT } from '@/site/data/content/home.content';
import { submitLead } from '@/site/lib/supabase/leads';

interface PrivateOpportunitiesProps {
  minimal?: boolean;
}

export function PrivateOpportunities({ minimal = true }: PrivateOpportunitiesProps) {
  const privContent = HOME_PAGE_CONTENT.privateOpportunities;
  const [modalOpen, setModalOpen] = useState(false);
  const [, setSelectedProperty] = useState<string>('General Private Portfolio Access');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp' | 'details'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (propertyName?: string) => {
    if (propertyName) setSelectedProperty(propertyName);
    setSubmitted(false);
    setOtpStep('phone');
    setOtpCode('');
    setModalOpen(true);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep('otp');
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep('details');
    }, 400);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    setLoading(true);

    try {
      await submitLead({
        fullName,
        phone,
        email,
        sourceSlug: 'private_opportunities_otp',
        message: 'Requested confidential off-market private portfolio access',
      });
    } catch (err) {
      console.warn('Private opportunities lead submit error:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section id={privContent.sectionId || 'private-opportunities'} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#CFD1CA]">
      <ScrollReveal animation="fade-up">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 border-b border-[#CFD1CA] gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 border border-black/10 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#5B605F] mb-3">
              <Lock className="w-3 h-3 text-[#C5282F]" />
              <span>{privContent.badge}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#15181A] tracking-tight mb-4">
              {privContent.heading}
            </h2>

            <div className="space-y-1.5 text-xs sm:text-sm text-[#5B605F] font-sans leading-relaxed">
              {privContent.paragraphs.map((p, idx) => (
                <p key={idx} className={idx === privContent.paragraphs.length - 1 ? 'text-[#15181A]/85 font-medium' : ''}>
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-start lg:items-end gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenModal('General Private Portfolio Access')}
              className="px-7 py-3.5 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2.5 cursor-pointer active:scale-98"
            >
              <Shield className="w-4 h-4 text-white" />
              <span>{privContent.ctaButton.text}</span>
            </button>
            <span className="text-[11px] text-[#8E9291] font-sans">
              {privContent.ctaButton.disclaimer}
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* POPUP CONTACT MODAL FOR LEAD CONVERSION */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#F7F7F4] border border-[#CFD1CA] shadow-2xl p-5 sm:p-8 text-[#15181A] max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#5B605F] hover:text-[#15181A] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-[#C5282F]/10 border border-[#C5282F]/20 text-[#C5282F] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#15181A] font-light">
                  Request Received
                </h3>
                <p className="text-xs sm:text-sm text-[#5B605F] max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{fullName}</strong>. Your request for private access to our confidential listings has been registered. Our Senior Portfolio Director will contact you discreetly at <strong>{phone}</strong>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-2.5 bg-[#15181A] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C5282F] transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#C5282F]/10 text-[#C5282F] text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
                    <Lock className="w-3 h-3" /> Private Client Advisory
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#15181A] font-light">
                    REQUEST PRIVATE ACCESS
                  </h3>
                  <p className="text-xs text-[#5B605F] mt-1 font-sans">
                    Not every property is listed online. Enter your details to unlock off-market opportunities and private residences across Mumbai.
                  </p>
                </div>

                {/* 3-Step OTP Lead Conversion Form */}
                {otpStep === 'phone' && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#15181A] mb-1.5">
                        Enter Mobile Number *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3.5 text-xs bg-[#EDEEE9] border border-r-0 border-[#CFD1CA] text-[#5B605F] font-semibold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98200 00000"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#CFD1CA] focus:border-[#C5282F] focus:outline-none text-xs text-[#15181A]"
                        />
                      </div>
                      <p className="text-[10px] text-[#5B605F] mt-1.5">
                        We will send a quick verification code to your mobile number.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || phone.length < 10}
                      className="w-full py-3 bg-[#C5282F] hover:bg-[#A31D23] disabled:opacity-50 text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{loading ? 'SENDING CODE...' : 'GET OTP'}</span>
                    </button>
                  </form>
                )}

                {otpStep === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="bg-[#EDEEE9]/60 p-3 border border-[#CFD1CA] mb-2 text-xs">
                      <p className="text-[#15181A] font-medium">Enter OTP sent to +91 {phone}</p>
                      <p className="text-[11px] text-[#C5282F] font-sans font-bold mt-0.5">Demo OTP: 4821</p>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#15181A] mb-1.5">
                        4-Digit Verification Code *
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="4821"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#CFD1CA] focus:border-[#C5282F] focus:outline-none text-base tracking-[0.3em] font-sans font-bold tabular-nums text-center text-[#15181A]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOtpStep('phone')}
                        className="w-1/3 py-2.5 bg-[#EDEEE9] hover:bg-[#CFD1CA] text-[#15181A] text-xs uppercase tracking-wider font-semibold border border-[#CFD1CA] cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading || otpCode.length < 4}
                        className="w-2/3 py-2.5 bg-[#C5282F] hover:bg-[#A31D23] disabled:opacity-50 text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{loading ? 'VERIFYING...' : 'VERIFY OTP'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {otpStep === 'details' && (
                  <form onSubmit={handleFinalSubmit} className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Mobile Verified (+91 {phone}). Please complete your details:</span>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#15181A] mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#5B605F] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Singhania"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#CFD1CA] focus:border-[#C5282F] focus:outline-none text-xs text-[#15181A] placeholder:text-[#5B605F]/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#15181A] mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#5B605F] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rahul@example.com"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#CFD1CA] focus:border-[#C5282F] focus:outline-none text-xs text-[#15181A] placeholder:text-[#5B605F]/50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#C5282F] hover:bg-[#A31D23] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3"
                    >
                      <span>{loading ? 'SUBMITTING...' : 'CONFIRM & REQUEST ACCESS'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
