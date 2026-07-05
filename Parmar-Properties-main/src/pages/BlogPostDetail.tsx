import { useEffect, useState} from"react";
import { useParams, Link} from"react-router-dom";
import { Header} from"@/sections/Header/index";
import { Footer} from"@/sections/Footer/index";
import { ScrollReveal} from"@/components/ScrollReveal";
import { ScrollScrubRevealText} from"@/components/ScrollScrubRevealText";
import { fetchPostBySlug, fetchMoreArticles} from"@/hooks/useBlogPosts";
import { BlogPreviewCard, BlogPreviewCardSkeleton} from"@/components/BlogPreviewCard";
import type { BlogPost} from"@/lib/types";

const ArrowIcon = ({ size = 16}: { size?: number}) => (
 <svg width={size} height={size} viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <path d="M5 12h14m-7-7 7 7-7 7"/>
 </svg>
);

export const BlogPostDetail = () => {
 const { slug} = useParams();
 const [post, setPost] = useState<BlogPost | null | undefined>(undefined); // undefined=loading, null=not found
 const [moreArticles, setMoreArticles] = useState<BlogPost[]>([]);
 const [moreLoading, setMoreLoading] = useState(true);

 useEffect(() => {
 window.scrollTo(0, 0);
}, [slug]);

 useEffect(() => {
 if (!slug) { setPost(null); return;}
 setPost(undefined);
 setMoreLoading(true);

 fetchPostBySlug(slug).then(async (found) => {
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
 <div className="text-center">
 <h1 className="text-4xl mb-4">Post not found</h1>
 <Link to="/blog"className="text-black hover:underline">Back to Blog</Link>
 </div>
 </div>
);
}

 return (
 <>
 <div id="main-content-wrapper"className="min-h-screen bg-[#f3f1ed] text-black overflow-x-clip selection:bg-black selection:text-white relative z-10">
 <Header />

 <main className="pt-[100px] md:pt-[140px] pb-20">
 <div className="max-w-[1920px] mx-auto px-6 md:px-16">
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-start">

 {/* Left Column: Meta */}
 <div className="lg:sticky lg:top-[140px] flex flex-col gap-8">
 <ScrollReveal direction="up"delay={0}>
 <time className="text-xs md:text-sm font-semibold tracking-[0.15em] uppercase text-black/40 mb-6 block">
 {new Date(post.date).toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric"})}
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
 </ScrollReveal>

 </div>

 {/* Right Column: Content */}
 <div className="flex flex-col gap-12">
 <ScrollReveal direction="up"delay={100} className="flex flex-col gap-8 pb-8 border-b border-black/20">
 {/* Right side title and optional sub-tags (from design) */}
 <div className="flex flex-col gap-2 mb-2">
 <h2 className="text-[32px] md:text-[42px] font-semibold leading-tight tracking-[-0.04em]">
 {post.title}
 </h2>
 {post.category && (
 <p className="text-[12px] font-medium text-black/50 uppercase tracking-widest">
 {post.category}
 </p>
)}
 </div>

 {post.content?.intro.map((para, i) => (
 <div 
 key={i} 
 className="text-[14px] md:text-[15px] leading-[1.7] text-black/90 font-medium prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0 prose-ol:my-0"
 dangerouslySetInnerHTML={{ __html: para}} 
 />
))}
 </ScrollReveal>

 {post.content?.sections.map((section, idx) => (
 <ScrollReveal key={section.id} direction="up"delay={150 + idx * 50} className={`flex flex-col gap-6 pb-8 ${(idx !== (post.content?.sections.length || 0) - 1) || (post.content?.downloads && post.content.downloads.length > 0) ?"border-b border-black/10":""}`}>
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

 {post.content?.downloads && post.content.downloads.length > 0 && (
 <ScrollReveal direction="up"delay={300} className="mt-8 pt-12">
 <h3 className="text-[24px] md:text-[32px] font-semibold mb-6 tracking-tight">
 Download the Full Reports
 </h3>
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
 </div>
 </div>
 </div>

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
 {/*"See All Blogs"link — new per implementation plan */}
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
