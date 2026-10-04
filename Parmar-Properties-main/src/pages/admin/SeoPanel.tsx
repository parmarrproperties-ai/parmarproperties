// ============================================================
// SeoPanel — per-post SEO / AEO / GEO fields for the admin editor.
// Shows a search-result preview and a checklist for the post.
// ============================================================

import type { BlogPost, PostFaq, PostSource } from "@/lib/types";
import { postTitle, postDescription } from "@/seo/blog";
import { site } from "@/seo/site";

export type EditorSeo = {
  title: string;
  description: string;
  authorName: string;
  authorRole: string;
  ogImageUrl: string;
  faqs: PostFaq[];
  sources: PostSource[];
};

export const emptySeo = (): EditorSeo => ({
  title: "", description: "", authorName: "", authorRole: "", ogImageUrl: "", faqs: [], sources: [],
});

const label = "text-[10px] font-semibold uppercase tracking-wider text-black/35 block mb-1.5";
const input = "w-full text-sm bg-neutral-50 border border-black/10 rounded-xl px-3 py-2.5 outline-none focus:border-black/40 transition-colors";
const smallButton = "self-start text-xs font-medium text-black/50 hover:text-black transition-colors";

const Counter = ({ value, min, max }: { value: number; min: number; max: number }) => (
  <span className={`text-[10px] font-medium ${value === 0 ? "text-black/35" : value < min || value > max ? "text-amber-600" : "text-emerald-600"}`}>
    {value} chars · aim for {min}–{max}
  </span>
);

const wordCount = (post: BlogPost) =>
  [...(post.content?.intro ?? []), ...(post.content?.sections ?? []).flatMap((s) => [s.title ?? "", ...s.paragraphs, s.insight ?? ""])]
    .join(" ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

/** Checklist items: [passed, text]. */
function checklist(post: BlogPost, seo: EditorSeo): [boolean, string][] {
  const title = postTitle(post);
  const desc = postDescription(post);
  const words = wordCount(post);
  const sections = post.content?.sections ?? [];
  const questionHeadings = sections.filter((s) => s.title?.trim().endsWith("?")).length;
  const links = [...(post.content?.intro ?? []), ...sections.flatMap((s) => s.paragraphs)].join(" ").match(/<a\s/gi)?.length ?? 0;
  return [
    [title.length >= 30 && title.length <= 65, `Search title is ${title.length} characters (30–65 shows in full on Google)`],
    [desc.length >= 120 && desc.length <= 160, `Meta description is ${desc.length} characters (120–160 is ideal)`],
    [words >= 800, `${words} words — 800+ helps rank; 1,500+ for pillar guides`],
    [sections.filter((s) => s.title?.trim()).length >= 4, "At least 4 section headings (H2)"],
    [questionHeadings >= 2, `${questionHeadings} headings phrased as questions — 2+ helps featured snippets`],
    [seo.faqs.filter((f) => f.question && f.answer).length >= 3, "3+ FAQs (adds FAQ rich results and AI answers)"],
    [seo.sources.filter((x) => x.label && x.url).length >= 1 || links >= 1, "Cites at least one source with a link"],
    [Boolean(seo.authorName.trim()), "Named author (expertise signal for Google and AI engines)"],
    [Boolean(post.imageUrl || seo.ogImageUrl), "Has a share image"],
  ];
}

export const SeoPanel = ({ seo, onChange, post }: { seo: EditorSeo; onChange: (seo: EditorSeo) => void; post: BlogPost }) => {
  const set = <K extends keyof EditorSeo>(key: K, value: EditorSeo[K]) => onChange({ ...seo, [key]: value });
  const title = postTitle(post);
  const desc = postDescription(post);
  const checks = checklist(post, seo);
  const passed = checks.filter(([ok]) => ok).length;

  return (
    <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <div>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-black/35">SEO &amp; AEO</h2>
        <p className="text-xs text-black/35 mt-1">
          Optional. Empty fields fall back to the post title and excerpt. Changes go live after the next site build.
        </p>
      </div>

      {/* Search result preview */}
      <div className="rounded-xl border border-black/8 p-4 bg-neutral-50">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-black/35 mb-2">Google preview</p>
        <p className="text-[12px] text-[#4d5156] truncate">{site.url.replace("https://", "")} › blog › {post.slug || "post-slug"}</p>
        <p className="text-[18px] leading-snug text-[#1a0dab] truncate">{title}</p>
        <p className="text-[13px] leading-snug text-[#4d5156] line-clamp-2">{desc || "Add an excerpt or meta description."}</p>
      </div>

      {/* Checklist */}
      <div>
        <p className={label}>Checklist · {passed}/{checks.length}</p>
        <ul className="flex flex-col gap-1.5">
          {checks.map(([ok, text]) => (
            <li key={text} className="flex items-start gap-2 text-[12px]">
              <span aria-hidden="true" className={ok ? "text-emerald-600" : "text-amber-600"}>{ok ? "✓" : "•"}</span>
              <span className={ok ? "text-black/60" : "text-black/80"}>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <div className="flex justify-between items-baseline">
            <label className={label} htmlFor="seo-title">Search title</label>
            <Counter value={seo.title.length} min={30} max={60} />
          </div>
          <input id="seo-title" className={input} value={seo.title} placeholder={title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-baseline">
            <label className={label} htmlFor="seo-description">Meta description</label>
            <Counter value={seo.description.length} min={120} max={160} />
          </div>
          <textarea id="seo-description" rows={3} className={input} value={seo.description} placeholder={post.excerpt} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="seo-author">Author name</label>
            <input id="seo-author" className={input} value={seo.authorName} placeholder="e.g. Ankit Parmar" onChange={(e) => set("authorName", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="seo-author-role">Author role</label>
            <input id="seo-author-role" className={input} value={seo.authorRole} placeholder="e.g. Director, Parmar Properties" onChange={(e) => set("authorRole", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="seo-og">Share image URL (optional, 1200×630)</label>
          <input id="seo-og" className={input} value={seo.ogImageUrl} placeholder="Defaults to the cover image" onChange={(e) => set("ogImageUrl", e.target.value)} />
        </div>
      </div>

      {/* FAQs */}
      <div className="flex flex-col gap-3">
        <div>
          <p className={label}>FAQs</p>
          <p className="text-xs text-black/35">Shown at the end of the post and marked up for Google and AI answers. Keep answers to 40–60 words.</p>
        </div>
        {seo.faqs.map((faq, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl border border-black/8 p-3">
            <input className={input} value={faq.question} placeholder="Question" onChange={(e) => set("faqs", seo.faqs.map((f, j) => (j === i ? { ...f, question: e.target.value } : f)))} />
            <textarea rows={3} className={input} value={faq.answer} placeholder="Answer" onChange={(e) => set("faqs", seo.faqs.map((f, j) => (j === i ? { ...f, answer: e.target.value } : f)))} />
            <button type="button" className={smallButton} onClick={() => set("faqs", seo.faqs.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <button type="button" className={smallButton} onClick={() => set("faqs", [...seo.faqs, { question: "", answer: "" }])}>+ Add FAQ</button>
      </div>

      {/* Sources */}
      <div className="flex flex-col gap-3">
        <div>
          <p className={label}>Sources</p>
          <p className="text-xs text-black/35">Reports and data cited in the post (e.g. Knight Frank, CBRE). Linked at the end of the post.</p>
        </div>
        {seo.sources.map((source, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_auto] gap-2 items-center">
            <input className={input} value={source.label} placeholder="Source name" onChange={(e) => set("sources", seo.sources.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <input className={input} value={source.url} placeholder="https://…" onChange={(e) => set("sources", seo.sources.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
            <button type="button" className={smallButton} onClick={() => set("sources", seo.sources.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <button type="button" className={smallButton} onClick={() => set("sources", [...seo.sources, { label: "", url: "" }])}>+ Add source</button>
      </div>
    </div>
  );
};
