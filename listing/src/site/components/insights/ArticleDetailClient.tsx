'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Share2,
  CheckCircle2,
  User,
  PhoneCall,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { submitLead } from '@/site/lib/supabase/leads';
import {
  fetchArticleBySlug,
  fetchInsightsArticles,
  type InsightArticle,
} from '@/site/lib/supabase/insights';

interface ArticleDetailClientProps {
  slug: string;
  /** Server-fetched data; `undefined` means "not provided, fetch in the browser". */
  initialArticle?: InsightArticle | null;
  initialAllArticles?: InsightArticle[];
}

export default function ArticleDetailClient({ slug, initialArticle, initialAllArticles }: ArticleDetailClientProps) {
  const serverRendered = initialArticle !== undefined;

  const [copied, setCopied] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '₹15 Cr – ₹30 Cr',
    note: '',
  });

  const [article, setArticle] = useState<InsightArticle | null>(initialArticle ?? null);
  const [allArticles, setAllArticles] = useState<InsightArticle[]>(initialAllArticles ?? []);
  const [loading, setLoading] = useState(!serverRendered);

  React.useEffect(() => {
    // Server already rendered this article; only fetch in the browser as a fallback.
    if (serverRendered) return;
    let isMounted = true;
    setLoading(true);
    setArticle(null);

    const load = async () => {
      if (slug) {
        const res = await fetchArticleBySlug(slug);
        if (isMounted) setArticle(res);
      } else if (isMounted) {
        setArticle(null);
      }

      const list = await fetchInsightsArticles();
      if (isMounted) setAllArticles(list);
      if (isMounted) setLoading(false);
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [slug, serverRendered]);

  const relatedArticles = article
    ? allArticles
        .filter((a) => a.id !== article.id && a.slug !== article.slug)
        .slice(0, 3)
    : [];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;
    setConsultationSubmitted(true);

    try {
      await submitLead({
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email,
        budgetRange: formData.budget,
        sourceSlug: 'article_consultation_modal',
        message: `Consultation on article "${article.title}": ${formData.note || 'No additional note'}`,
      });
    } catch (err) {
      console.warn('Article consultation lead submit error:', err);
    }

    setTimeout(() => {
      setShowConsultationModal(false);
      setConsultationSubmitted(false);
      setFormData({ name: '', phone: '', email: '', budget: '₹15 Cr – ₹30 Cr', note: '' });
    }, 2500);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#EDEEE9] text-[#15181A] pt-24 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-sm text-[#5B605F]">Loading research article…</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full min-h-screen bg-[#EDEEE9] text-[#15181A] pt-24 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4">
          <h1 className="font-serif text-3xl font-light text-[#15181A]">
            Article unavailable
          </h1>
          <p className="text-sm text-[#5B605F] font-sans leading-relaxed">
            This research article is not published or could not be found.
          </p>
          <Link
            href="/market-intelligence"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5282F] hover:text-[#15181A]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Intelligence Reports</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#EDEEE9] text-[#15181A] pt-24 font-sans selection:bg-[#C5282F] selection:text-white">
      {/* Hero / Header Section */}
      <section className="bg-[#15181A] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#CFD1CA] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(#CFD1CA_1px,transparent_1px)] bg-size-[24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 mb-6 font-sans flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/market-intelligence" className="hover:text-white transition-colors">
              Market Intelligence
            </Link>
            <span>/</span>
            <span className="text-[#C5282F] font-semibold truncate max-w-[200px] sm:max-w-none">
              {article.tag}
            </span>
          </div>

          {/* Back link */}
          <Link
            href="/market-intelligence"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white mb-6 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Intelligence Reports</span>
          </Link>

          {/* Category Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5282F]/20 border border-[#C5282F]/40 text-[10px] uppercase tracking-[0.25em] font-bold text-[#E5484D] mb-4">
            <span>{article.category}</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight mb-4 leading-[1.15]">
            {article.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/80 font-sans leading-relaxed mb-8 max-w-3xl">
            {article.subtitle || article.description}
          </p>

          {/* Meta & Author bar */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#202528] border border-white/20 flex items-center justify-center text-[#C5282F]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{article.author.name}</p>
                <p className="text-xs text-white/60">{article.author.role} · {article.author.desk}</p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-xs text-white/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5282F]" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C5282F]" />
                <span>{article.readTime}</span>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Link</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Executive Key Takeaways Box */}
        <div className="bg-white border-l-4 border-l-[#C5282F] border-y border-r border-[#CFD1CA] p-6 sm:p-8 mb-12 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#C5282F]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#15181A]">
              Executive Takeaways &amp; Strategic Summary
            </span>
          </div>
          <div className="space-y-3">
            {article.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-[#15181A]/90 leading-relaxed font-sans">
                <span className="w-2 h-2 rounded-full bg-[#C5282F] mt-2 shrink-0" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Article Body Sections */}
        <article className="space-y-12">
          {article.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#15181A] tracking-tight border-b border-[#CFD1CA] pb-3">
                {section.heading}
              </h2>

              <div className="space-y-4">
                {section.content.map((para, pIdx) => (
                  <p key={pIdx} className="text-base sm:text-[17px] text-[#2C3033] leading-relaxed font-sans">
                    {para}
                  </p>
                ))}
              </div>

              {/* Data Table if available */}
              {section.tableData && (
                <div className="my-8 overflow-x-auto border border-[#CFD1CA] bg-white shadow-xs">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#15181A] text-white">
                        {section.tableData.headers.map((h, hIdx) => (
                          <th key={hIdx} className="py-3 px-4 text-xs uppercase tracking-wider font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CFD1CA]">
                      {section.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-[#F7F7F4]'}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`py-3 px-4 text-xs sm:text-sm text-[#15181A] ${cIdx === 0 ? 'font-semibold' : ''}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Highlight callout quote if available */}
              {section.highlight && (
                <div className="my-6 p-5 bg-[#F7F7F4] border-l-2 border-[#15181A] text-[#15181A] italic text-base leading-relaxed">
                  "{section.highlight}"
                </div>
              )}
            </div>
          ))}
        </article>

        {/* Advisory Consultation Prompt */}
        <div className="mt-16 bg-[#15181A] text-white p-8 sm:p-12 border border-[#CFD1CA] relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C5282F] block mb-2">
              CONFIDENTIAL TRANSACTION CONSULTATION
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-white mb-3">
              Require specific portfolio evaluation on this topic?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed mb-6">
              Our partners prepare bespoke valuation memos, off-market inventory matches, and title diligence for private family offices and ultra-high-net-worth acquisitions.
            </p>
            <button
              type="button"
              onClick={() => setShowConsultationModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C5282F] hover:bg-[#A82026] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>TALK TO OUR ADVISORY</span>
            </button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-12 border-t border-[#CFD1CA]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl font-bold text-[#15181A]">
              Related Intelligence Reports
            </h3>
            <Link
              href="/market-intelligence"
              className="text-xs uppercase tracking-wider font-semibold text-[#C5282F] hover:text-[#15181A] inline-flex items-center gap-1 transition-colors"
            >
              <span>View All Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/market-intelligence/${rel.slug}`}
                className="group bg-white border border-[#CFD1CA] p-6 hover:border-[#15181A] transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#5B605F] group-hover:text-[#C5282F] transition-colors block mb-2">
                    {rel.category}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#15181A] group-hover:text-[#C5282F] transition-colors line-clamp-2 mb-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#5B605F] line-clamp-2 font-sans mb-4">
                    {rel.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#CFD1CA]/60 flex items-center justify-between text-[11px] text-[#5B605F] font-semibold">
                  <span>{rel.readTime}</span>
                  <span className="inline-flex items-center gap-1 text-[#15181A] group-hover:text-[#C5282F] transition-colors">
                    Read Report &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Modal */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#15181A] text-white border border-[#CFD1CA]/40 max-w-lg w-full p-5 sm:p-8 relative shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowConsultationModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {consultationSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#C5282F]/20 border border-[#C5282F] text-[#C5282F] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-light text-white">Advisory Request Received</h3>
                <p className="text-xs text-white/70 max-w-sm mx-auto">
                  A senior managing director from the Parmar Properties Research &amp; Advisory Desk will contact you within 2 business hours.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C5282F] block mb-2">
                  CONFIDENTIAL ADVISORY DESK
                </span>
                <h3 className="font-serif text-2xl font-light text-white mb-2">
                  Talk to Our Advisory
                </h3>
                <p className="text-xs text-white/70 mb-6">
                  Regarding: <span className="text-white font-medium">{article.title}</span>
                </p>

                <form onSubmit={handleConsultationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/80 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Anand Mahindra"
                      className="w-full bg-[#202528] border border-white/20 text-white px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#C5282F]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/80 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98200 00000"
                        className="w-full bg-[#202528] border border-white/20 text-white px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#C5282F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/80 mb-1">
                        Work / Personal Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="anand@office.com"
                        className="w-full bg-[#202528] border border-white/20 text-white px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#C5282F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/80 mb-1">
                      Target Investment Band
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-[#202528] border border-white/20 text-white px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#C5282F]"
                    >
                      <option value="₹5 Cr – ₹15 Cr">₹5 Cr – ₹15 Cr</option>
                      <option value="₹15 Cr – ₹30 Cr">₹15 Cr – ₹30 Cr</option>
                      <option value="₹30 Cr – ₹60 Cr">₹30 Cr – ₹60 Cr</option>
                      <option value="₹60 Cr+">₹60 Cr+ (Ultra Prime Trophy)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-[#C5282F] hover:bg-[#A82026] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
                  >
                    SUBMIT CONFIDENTIAL REQUEST
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
