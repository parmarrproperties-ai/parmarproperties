'use client';

import { withBasePath } from "@/lib/base-path";
import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { Property } from '@/site/types/property';
import { submitLead } from '@/site/lib/supabase/leads';
import { CTA, FOCUS, PHONE_DISPLAY } from './kit';

/** The callback form. `inline` lays the fields out in one row on wide screens; `dark` is for dark grounds. */
export function EnquiryForm({
  property,
  inline,
  dark,
  id = 'enquire',
  title = 'Request a private viewing',
}: {
  property: Property;
  inline?: boolean;
  dark?: boolean;
  id?: string;
  title?: string;
}) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    // Keep ad attribution (utm_*, gclid) with the lead.
    const tracking = window.location.search.replace(/^\?/, '');
    const res = await submitLead({
      fullName: form.name,
      phone: form.phone,
      email: form.email,
      sourceSlug: 'google_ppc_landing',
      propertyId: property.id,
      message: `PPC landing enquiry for ${property.title}${tracking ? ` | ${tracking}` : ''}`,
    });
    setState(res.success ? 'done' : 'error');
  }

  const field = `mt-1 w-full min-h-11 px-3 border bg-white text-base text-ink ${dark ? 'border-white/40' : 'border-slateText'} ${FOCUS}`;
  const label = `block text-sm font-semibold ${dark ? 'text-white' : 'text-ink'}`;
  const muted = dark ? 'text-white/75' : 'text-slateText';

  return (
    <div id={id} className="scroll-mt-20">
      {title ? <h2 className="font-serif text-2xl sm:text-3xl">{title}</h2> : null}
      {state === 'done' ? (
        <p role="status" className="mt-4 text-base font-semibold flex gap-2">
          <ShieldCheck className="w-5 h-5 shrink-0" aria-hidden /> Thank you. We will call you shortly.
        </p>
      ) : (
        <form onSubmit={onSubmit} className={`mt-4 gap-4 ${inline ? 'grid md:grid-cols-[1fr_1fr_1fr_auto] items-end' : 'space-y-4'}`}>
          <label className={label}>
            Full name
            <input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
          </label>
          <label className={label}>
            Mobile number
            <input required type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
          </label>
          <label className={label}>
            Email <span className={`font-normal ${muted}`}>(optional)</span>
            <input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
          </label>
          <button disabled={state === 'sending'} className={`${CTA} ${inline ? 'md:min-w-52' : 'w-full'} disabled:opacity-60`}>
            {state === 'sending' ? 'Sending…' : 'Request callback'}
          </button>
          {state === 'error' ? (
            <p role="alert" className={`text-sm ${dark ? 'text-white' : 'text-brick'} md:col-span-full`}>
              We could not send your request. Please call {PHONE_DISPLAY}.
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}

export function Logo({ className = 'h-9 w-auto' }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={withBasePath("/logo_without_bg.png")} alt="Parmar Properties" className={className} />;
}
