import { useEffect, useState} from"react";
import { useParams, Link} from"react-router-dom";
import { Header} from"@/sections/Header/index";
import { Footer} from"@/sections/Footer/index";
import { ScrollReveal} from"@/components/ScrollReveal";
import { ScrollScrubRevealText} from"@/components/ScrollScrubRevealText";
import { fetchPostBySlug, fetchMoreArticles} from"@/hooks/useBlogPosts";
import { BlogPreviewCard, BlogPreviewCardSkeleton} from"@/components/BlogPreviewCard";
import type { BlogPost} from"@/lib/types";
import { getInitialData} from"@/lib/initialData";
import { Seo} from"@/seo/Seo";
import { pages} from"@/seo/pages";
import { postSeoProps, postAuthor} from"@/seo/blog";

const ArrowIcon = ({ size = 16}: { size?: number}) => (
 <svg width={size} height={size} viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <path d="M5 12h14m-7-7 7 7-7 7"/>
 </svg>
);

const formatDate = (date: string) =>
 new Date(date).toLocaleDateString("en-IN", { month:"long", day:"numeric", year:"numeric", timeZone:"Asia/Kolkata"});

/** Pre-rendered pages embed the post, so the first render already shows the article. */
const initialPost = (slug?: string) => {
 const data = getInitialData();
 return data.post && data.post.slug === slug ? data.post : undefined;
};

export const BlogPostDetail = () => {
 const { slug} = useParams();
 const [post, setPost] = useState<BlogPost | null | undefined>(() => initialPost(slug)); // undefined=loading, null=not found
 const [moreArticles, setMoreArticles] = useState<BlogPost[]>(() => (initialPost(slug) ? getInitialData().moreArticles ?? [] : []));
 const [moreLoading, setMoreLoading] = useState(() => !initialPost(slug));

 useEffect(() => {
 window.scrollTo(0, 0);
}, [slug]);

 useEffect(() => {
 if (!slug) { setPost(null); return;}
 const prerendered = initialPost(slug);
 if (!prerendered) {
 setPost(undefined);
 setMoreLoading(true);
}

 fetchPostBySlug(slug).then(async (found) => {
 // Keep the pre-rendered article if the live fetch fails (e.g. offline).
 if (!found && prerendered) { setMoreLoading(false); return;}
 setPost(found);
 if (found) {
 const more = await fetchMoreArticles(found);
 setMoreArticles(more);
}
 setMoreLoading(false);
});
}, [slug]);

 // ─── Loading state ────────────────────────────────────────
 if (post === undefined) {
 return (
 <div className="min-h-screen bg-[#f3f1ed] text-black overflow-x-clip selection:bg-black selection:text-white">
 <Header />
 <main className="pt-[100px] md:pt-[140px] pb-20">
 <div className="max-w-[1920px] mx-auto px-6 md:px-16">
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-start">
 <div className="lg:sticky lg:top-[140px] flex flex-col gap-8 animate-pulse">
 <div className="h-4 w-32 bg-black/10 rounded"/>
 <div className="h-20 w-3/4 bg-black/10 rounded"/>
 <div className="h-16 w-full bg-black/10 rounded"/>
 <div className="flex gap-4 mt-12">
 <div className="w-12 h-12 rounded-full bg-black/10"/>
 <div className="w-12 h-12 rounded-full bg-black/10"/>
 </div>
 </div>
 <div className="flex flex-col gap-12 animate-pulse">
 <div className="h-5 w-full bg-black/10 rounded"/>
 <div className="h-5 w-4/5 bg-black/10 rounded"/>
 <div className="h-5 w-3/5 bg-black/10 rounded"/>
 </div>
 </div>
 </div>
 </main>
 <Footer />
 </div>
);
}

 // ─── Not found state ──────────────────────────────────────
 if (!post) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <Seo {...pages.notFound} path={`/blog/${slug ??""}`} noindex />
 <div className="text-center">
 <h1 className="text-4xl mb-4">Post not found</h1>
 <Link to="/blog"className="text-black hover:underline">Back to Blog</Link>
 </div>
 </div>
);
}

 const author = postAuthor(post);
 const faqs = post.seo?.faqs ?? [];
 const sources = post.seo?.sources ?? [];
 const updated = post.updatedAt && post.updatedAt.slice(0, 10) > post.date ? post.updatedAt : null;

 return (
 <>
 <Seo {...postSeoProps(post)} />
 <div id="main-content-wrapper"className="min-h-screen bg-[#f3f1ed] text-black overflow-x-clip selection:bg-black selection:text-white relative z-10">
 <Header />

 <main className="pt-[100px] md:pt-[140px] pb-20">
 <article className="max-w-[1920px] mx-auto px-6 md:px-16">
 {/* Breadcrumbs */}
 <nav aria-label="Breadcrumb" className="mb-8 text-[12px] font-medium uppercase tracking-widest text-black/40">
 <ol className="flex flex-wrap items-center gap-2">
 <li><Link to="/" className="hover:text-black">Home</Link></li>
 <li aria-hidden="true">/</li>
 <li><Link to="/blog" className="hover:text-black">Blog</Link></li>
 {post.category && (<><li aria-hidden="true">/</li><li className="text-black/60">{post.category}</li></>)}
 </ol>
 </nav>

 <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-start">

 {/* Left Column: Meta */}
 <header className="lg:sticky lg:top-[140px] flex flex-col gap-8">
 <ScrollReveal direction="up"delay={0}>
 <time dateTime={post.date} className="text-xs md:text-sm font-semibold tracking-[0.15em] uppercase text-black/40 mb-6 block">
 {formatDate(post.date)}
 </time>
 <h1 className="text-[32px] md:text-[42px] lg:text-[52px] font-normal tracking-[-0.04em] leading-[1.1] text-black">
 <ScrollScrubRevealText
 text={post.title}
 as="span"
 baseColorClass="text-black/30"
 revealColorClass="text-black"
 scrubStart="top 90%"
 scrubEnd="center 60%"
 />
 </h1>
 {/* Byline */}
 <p className="mt-8 text-[14px] leading-[1.6] text-black/60">
 By{" "}
 <Link to="/about" rel="author" className="font-semibold text-black hover:underline">{author.name}</Link>
 <span className="block text-black/40">{author.role}</span>
 {updated && (
 <span className="block mt-2 text-black/40">
 Updated <time dateTime={updated}>{formatDate(updated)}</time>
 </span>
)}
 </p>
 </ScrollReveal>

 </header>

 {/* Right Column: Content */}
 <div className="flex flex-col gap-12">
 <ScrollReveal direction="up"delay={100} className="flex flex-col gap-8 pb-8 border-b border-black/20">
 {/* Right side title and optional sub-tags (from design) */}
 <div className="flex flex-col gap-2 mb-2">
 <p aria-hidden="true" className="text-[32px] md:text-[42px] font-semibold leading-tight tracking-[-0.04em]">
 {post.title}
 </p>
 {post.category && (
 <p className="text-[12px] font-medium text-black/50 uppercase tracking-widest">
 {post.category}
 </p>
)}
 </div>

 {post.content?.intro.map((para, i) => (
 <div
 key={i}
 data-speakable={i === 0 ? true : undefined}
 className="text-[14px] md:text-[15px] leading-[1.7] text-black/90 font-medium prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0 prose-ol:my-0"
 dangerouslySetInnerHTML={{ __html: para}}
 />
))}
 </ScrollReveal>

 {post.content?.sections.map((section, idx) => (
 <ScrollReveal key={section.id} direction="up"delay={150 + idx * 50} className="flex flex-col gap-6 pb-8 border-b border-black/10">
 {section.title && (
 <h2 className="text-[24px] md:text-[28px] text-black mb-2">
 {section.title}
 </h2>
)}
 {section.paragraphs.map((para, i) => (
 <div
 key={i}
 className="text-[14px] md:text-[15px] leading-[1.7] text-black/80 prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0 prose-ol:my-0"
 dangerouslySetInnerHTML={{ __html: para}}
 />
))}
 {section.insight && (
 <div className="pt-4 mt-2">
 <div className="text-[14px] md:text-[15px] leading-[1.7] text-black font-medium prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0 prose-ol:my-0">
 <span className="font-bold block mb-1">Insight: </span>
 <div dangerouslySetInnerHTML={{ __html: section.insight}} />
 </div>
 </div>
)}
 </ScrollReveal>
))}

 {faqs.length > 0 && (
 <ScrollReveal direction="up"delay={200} className="flex flex-col gap-6 pb-8 border-b border-black/10">
 <h2 className="text-[24px] md:text-[28px] text-black mb-2">Frequently Asked Questions</h2>
 <dl className="flex flex-col gap-6">
 {faqs.map((faq, i) => (
 <div key={i} className="flex flex-col gap-2">
 <dt className="text-[16px] md:text-[18px] font-semibold text-black">{faq.question}</dt>
 <dd className="text-[14px] md:text-[15px] leading-[1.7] text-black/80">{faq.answer}</dd>
 </div>
))}
 </dl>
 </ScrollReveal>
)}

 {sources.length > 0 && (
 <ScrollReveal direction="up"delay={250} className="flex flex-col gap-4 pb-8 border-b border-black/10">
 <h2 className="text-[20px] md:text-[22px] text-black">Sources</h2>
 <ul className="flex flex-col gap-2 list-disc pl-5 text-[14px] text-black/70">
 {sources.map((source, i) => (
 <li key={i}>
 <a href={source.url} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-black">{source.label}</a>
 </li>
))}
 </ul>
 </ScrollReveal>
)}

 {post.content?.downloads && post.content.downloads.length > 0 && (
 <ScrollReveal direction="up"delay={300} className="mt-8 pt-12">
 <h2 className="text-[24px] md:text-[32px] font-semibold mb-6 tracking-tight">
 Download the Full Reports
 </h2>
 <p className="text-black/60 mb-8">For a deeper breakdown of the data, download the full reports below:</p>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
 {post.content.downloads.map((link, i) => (
 <a key={i} href={link.href} className="text-[#0099ff] hover:underline flex items-center gap-2 text-[16px] md:text-[18px]">
 {link.label}
 </a>
))}
 </div>
 </ScrollReveal>
)}

 {/* Advisor call-to-action */}
 <ScrollReveal direction="up"delay={300} className="flex flex-col gap-4 rounded-none bg-white p-8">
 <h2 className="text-[22px] md:text-[26px] text-black">Talk to a South Mumbai property advisor</h2>
 <p className="text-[14px] md:text-[15px] leading-[1.7] text-black/70">
 Parmar Properties has advised buyers, sellers and investors in South Mumbai since 1981. Tell us what you are looking for and we will share options that fit.
 </p>
 <div className="flex flex-wrap gap-3">
 <Link to="/contact" className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-3 rounded-full hover:bg-black/85 transition-colors">
 Contact us <ArrowIcon size={14} />
 </Link>
 <Link to="/services" className="inline-flex items-center gap-2 border border-black/20 text-black text-sm font-medium px-5 py-3 rounded-full hover:bg-black hover:text-white transition-colors">
 Our services
 </Link>
 </div>
 </ScrollReveal>
 </div>
 </div>
 </article>

 {/* More Articles Section */}
 <section className="mt-32 pt-20">
 <div className="max-w-[1920px] mx-auto px-6 md:px-16">
 <ScrollReveal direction="up"delay={0} className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
 <h2 className="text-[32px] md:text-[42px] font-normal leading-[1.1] tracking-tight text-black">
 <ScrollScrubRevealText
 text="More Articles"
 as="span"
 baseColorClass="text-black/30"
 revealColorClass="text-black"
 scrubStart="top 90%"
 scrubEnd="center 60%"
 />
 </h2>
 <Link
 to="/blog"
 className="inline-flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black transition-colors duration-200 shrink-0 mb-4 md:mb-6 group"
 >
 See All Blogs
 <span className="transition-transform duration-200 group-hover:translate-x-1">
 <ArrowIcon size={14} />
 </span>
 </Link>
 </ScrollReveal>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
 {moreLoading ? (
 <BlogPreviewCardSkeleton variant="article"count={3} />
) : (
 moreArticles.map((other, index) => (
 <BlogPreviewCard
 key={other.id}
 post={other}
 variant="article"
 delay={index * 100}
 />
))
)}
 </div>
 </div>
 </section>
 </main>
 </div>
 <Footer />
 </>
);
};
