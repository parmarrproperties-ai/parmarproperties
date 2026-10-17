'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Copy, ExternalLink, Check } from 'lucide-react';
import type { Property } from '@/site/types/property';
import { fetchPropertyCards } from '@/site/lib/supabase/properties';

// Google fills these ValueTrack placeholders in at click time.
const VALUETRACK = 'utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}';
const DEFAULT_DOMAIN = 'https://parmarproperties.in';
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brick';
const BTN = `inline-flex items-center justify-center gap-1.5 min-h-10 px-4 text-sm font-semibold ${FOCUS}`;

type Status = 'loading' | 'ready' | 'error';

/** Returns the site origin, adding https:// when missing, or null when it is not a valid URL. */
function normalizeDomain(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    return new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`).origin;
  } catch {
    return null;
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // navigator.clipboard is missing on non-HTTPS origins (e.g. a LAN IP); fall back to a hidden textarea.
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      document.body.removeChild(el);
    }
  }
}

function CopyButton({ text, label, forName, primary }: { text: string; label: string; forName: string; primary?: boolean }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    setState((await copyText(text)) ? 'done' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2000);
  };

  const look = primary
    ? 'bg-ink text-white hover:bg-brick'
    : 'border border-slateText bg-white text-ink hover:bg-mineral';
  return (
    <button type="button" onClick={onClick} aria-label={`${label} for ${forName}`} aria-live="polite" className={`${BTN} ${look}`}>
      {state === 'done' ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
      {state === 'done' ? 'Copied' : state === 'failed' ? 'Copy failed, select the text and copy by hand' : label}
    </button>
  );
}

/** Builds one Google Ads final URL per published property. Read-only: it saves nothing to the database. */
export function AdsManager() {
  const [domain, setDomain] = useState(DEFAULT_DOMAIN);
  const [campaign, setCampaign] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [suffixCopied, setSuffixCopied] = useState(false);

  const load = useCallback(() => {
    setStatus('loading');
    fetchPropertyCards()
      .then((list) => {
        setProperties(list);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(load, [load]);

  // Remember the two inputs between visits (per browser only).
  useEffect(() => {
    try {
      setDomain(localStorage.getItem('ads-manager:domain') || DEFAULT_DOMAIN);
      setCampaign(localStorage.getItem('ads-manager:campaign') || '');
    } catch {
      // storage blocked: defaults are fine
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('ads-manager:domain', domain);
      localStorage.setItem('ads-manager:campaign', campaign);
    } catch {
      // ignore
    }
  }, [domain, campaign]);

  const base = normalizeDomain(domain);
  const slug = campaign.trim().toLowerCase().replace(/\s+/g, '-');
  const suffix = slug ? VALUETRACK.replace('{campaignid}', encodeURIComponent(slug)) : VALUETRACK;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 text-ink font-sans">
      <h1 className="text-2xl sm:text-3xl font-semibold">Ads Manager</h1>
      <ol className="mt-3 mb-8 list-decimal pl-5 space-y-1 text-sm text-slateText max-w-prose">
        <li>Check the live website domain and, if you like, the campaign name.</li>
        <li>
          In Google Ads, set the ad&apos;s <strong>Final URL</strong> to the plain link for a property below.
        </li>
        <li>
          Paste the tracking suffix into the campaign&apos;s <strong>Final URL suffix</strong>. Google replaces{' '}
          <code>{'{keyword}'}</code>, <code>{'{campaignid}'}</code> and <code>{'{creative}'}</code> on every click.
        </li>
      </ol>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <label className="text-sm font-semibold">
          Live website domain
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!base}
            aria-describedby="domain-hint"
            className={`mt-1 w-full min-h-10 px-3 border border-slateText bg-white text-sm font-normal ${FOCUS}`}
          />
          <span id="domain-hint" className={`mt-1 block text-sm font-normal ${base ? 'text-slateText' : 'text-brick'}`}>
            {base ? `Links will start with ${base}` : 'Enter a web address such as parmarproperties.in'}
          </span>
        </label>
        <label className="text-sm font-semibold">
          Campaign name (optional)
          <input
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="Leave empty to use Google's campaign ID"
            autoComplete="off"
            aria-describedby="campaign-hint"
            className={`mt-1 w-full min-h-10 px-3 border border-slateText bg-white text-sm font-normal ${FOCUS}`}
          />
          <span id="campaign-hint" className="mt-1 block text-sm font-normal text-slateText">
            {slug ? `Sent as utm_campaign=${slug}. Use the same name in Google Ads so reports match.` : 'Sent as Google\'s campaign ID.'}
          </span>
        </label>
      </div>

      <div className="mb-8 border border-line bg-surface p-4">
        <h2 className="text-sm font-semibold">Tracking suffix (same for every property)</h2>
        <p className="mt-2 font-mono text-sm break-all text-ink">{suffix}</p>
        <div className="mt-3">
          <button
            type="button"
            aria-live="polite"
            className={`${BTN} border border-slateText bg-white text-ink hover:bg-mineral`}
            onClick={async () => {
              if (await copyText(suffix)) {
                setSuffixCopied(true);
                setTimeout(() => setSuffixCopied(false), 2000);
              }
            }}
          >
            {suffixCopied ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
            {suffixCopied ? 'Copied' : 'Copy tracking suffix'}
          </button>
        </div>
      </div>

      <div role="status">
        {status === 'loading' ? <p className="text-sm text-slateText">Loading properties…</p> : null}
      </div>
      {status === 'error' ? (
        <div role="alert" className="border border-brick bg-surface p-4 text-sm">
          <p>The property list could not be loaded.</p>
          <button type="button" onClick={load} className={`${BTN} mt-3 bg-ink text-white hover:bg-brick`}>
            Try again
          </button>
        </div>
      ) : null}
      {status === 'ready' && properties.length === 0 ? (
        <div className="border border-line bg-surface p-4 text-sm text-slateText">
          <p>No published properties were found. Either none are published yet (a draft has no landing page), or the list could not be loaded.</p>
          <button type="button" onClick={load} className={`${BTN} mt-3 border border-slateText bg-white text-ink hover:bg-mineral`}>
            Check again
          </button>
        </div>
      ) : null}

      {status === 'ready' && properties.length > 0 ? (
        <>
          <p className="mb-3 text-sm text-slateText">{properties.length} published {properties.length === 1 ? 'property' : 'properties'}</p>
          <ul className="space-y-3">
            {properties.map((p) => {
              const path = `/${encodeURIComponent(p.slug)}/project`;
              const finalUrl = base ? `${base}${path}` : path;
              return (
                <li key={p.id} className="border border-line bg-surface p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-base font-semibold">{p.title}</h2>
                    <span className="text-sm text-slateText">
                      {p.location} · {p.priceFormatted}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-mono break-all text-ink">{finalUrl}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <CopyButton text={finalUrl} label="Copy Final URL" forName={p.title} primary />
                    <CopyButton text={`${finalUrl}?${suffix}`} label="Copy URL with tracking" forName={p.title} />
                    <a
                      href={path}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 min-h-10 text-sm font-semibold text-ink underline underline-offset-4 ${FOCUS}`}
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden /> Preview on this site<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      <p className="mt-10 text-sm text-slateText max-w-prose">
        Landing pages are hidden from search engines and use the same data as the main property page.
      </p>
    </div>
  );
}
