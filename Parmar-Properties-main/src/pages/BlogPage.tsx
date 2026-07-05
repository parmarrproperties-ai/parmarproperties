import { useEffect, useState} from"react";
import { Link} from"react-router-dom";
import { blog} from"@/content/content";
import { Header} from"@/sections/Header/index";
import { ScrollReveal} from"@/components/ScrollReveal";
import { ScrollScrubRevealText} from"@/components/ScrollScrubRevealText";
import { useBlogPosts} from"@/hooks/useBlogPosts";
import { BlogPreviewCard, BlogPreviewCardSkeleton} from"@/components/BlogPreviewCard";
import type { BlogPost} from"@/lib/types";

const ArrowIcon = ({ size = 16}: { size?: number}) => (
 <svg width={size} height={size} viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <path d="M5 12h14m-7-7 7 7-7 7"/>
 </svg>
);

const SearchIcon = () => (
 <svg width="18"height="18"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="1.2"strokeLinecap="round"strokeLinejoin="round">
 <circle cx="11"cy="11"r="8"/><path d="m21 21-4.35-4.35"/>
 </svg>
);

export const BlogPage = () => {
 const { posts, loading} = useBlogPosts();
 const [activeCategory, setActiveCategory] = useState("All");
 const [search, setSearch] = useState("");
 const [featuredIndex, setFeaturedIndex] = useState(0);

 useEffect(() => {
 window.scrollTo({ top: 0, left: 0, behavior:"instant"as ScrollBehavior});
}, []);

 // Always put the DB-featured post first, then the rest in grid_order
 const sortedPosts: BlogPost[] = [
 ...posts.filter((p) => p.featured),
 ...posts.filter((p) => !p.featured),
 ];

 const featuredPost = sortedPosts[featuredIndex] ?? null;
 const gridPosts = sortedPosts.filter((_, i) => i !== featuredIndex);

 const filtered = gridPosts.filter((post) => {
 const matchCat = activeCategory ==="All"|| post.category === activeCategory;
 const matchSearch =
 search.trim() ===""||
 post.title.toLowerCase().includes(search.toLowerCase()) ||
 post.excerpt.toLowerCase().includes(search.toLowerCase());
 return matchCat && matchSearch;
});

 const categories = ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean))).sort()];

 return (
 <div id="main-content"className="min-h-screen bg-[#f3f1ed] text-black overflow-x-clip selection:bg-black selection:text-white">
 <Header />

 <div className="pt-[80px] md:pt-[100px] pb-6 md:pb-8">
 <div className="px-6 md:px-16 pt-8 pb-6 text-center max-w-[1920px] mx-auto">
 <ScrollReveal direction="up"delay={0}>
 <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-normal tracking-[-0.04em] leading-[1.1] text-black">
 Blog & Resources
 </h1>
 </ScrollReveal>
 </div>
 </div>

 <div className="px-6 md:px-16 max-w-[1920px] mx-auto">
 <ScrollReveal direction="up"delay={120}>
 <div className="group relative flex items-center pb-2 border-b border-black/10 focus-within:border-black/60 transition-colors duration-500">
 <input
 type="text"
 placeholder="Search"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="flex-1 text-[14px] md:text-[20px] text-black placeholder-black/30 bg-transparent outline-none py-1"
 />
 <div className="absolute right-0 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black/60 transition-colors duration-500">
 <SearchIcon />
 </div>
 </div>
 </ScrollReveal>

 <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-4">
 <ScrollReveal direction="up"delay={160} className="flex flex-wrap gap-2">
 {categories.map((cat, index) => (
 <button
 key={cat}
 onClick={() => setActiveCategory(cat)}
 className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 ${
 activeCategory === cat
 ?"bg-black text-white border-black"
 :"bg-white text-black border-black hover:bg-black/5"
}`}
 style={{ transitionDelay:`${index * 40}ms`}}
 >
 {cat}
 </button>
))}
 </ScrollReveal>

 {search.trim() ===""&& activeCategory ==="All"&& sortedPosts.length > 1 && (
 <ScrollReveal direction="up"delay={200} className="flex gap-2">
 <button
 onClick={() => setFeaturedIndex((prev) => (prev - 1 + sortedPosts.length) % sortedPosts.length)}
 className="w-6 h-6 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-black"
 aria-label="Previous featured post"
 >
 <svg width="12"height="12"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <path d="M19 12H5m7-7-7 7 7 7"/>
 </svg>
 </button>
 <button
 onClick={() => setFeaturedIndex((prev) => (prev + 1) % sortedPosts.length)}
 className="w-6 h-6 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-black"
 aria-label="Next featured post"
 >
 <ArrowIcon size={12} />
 </button>
 </ScrollReveal>
)}
 </div>
 </div>

 <div className="px-6 md:px-16 pb-12 max-w-[1920px] mx-auto">
 {/* Featured post — shown when not searching/filtering */}
 {search.trim() ===""&& activeCategory ==="All"&& (
 loading ? (
 <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 mb-10 md:mb-16 border border-transparent overflow-hidden animate-pulse">
 <div className="bg-neutral-200 aspect-[16/10] md:aspect-auto"/>
 <div className="p-8 md:p-10 bg-white flex flex-col gap-4 justify-center">
 <div className="h-3 w-24 bg-neutral-200 rounded"/>
 <div className="h-8 w-3/4 bg-neutral-200 rounded"/>
 <div className="h-4 w-full bg-neutral-200 rounded"/>
 <div className="h-4 w-4/5 bg-neutral-200 rounded"/>
 <div className="h-10 w-28 bg-neutral-200 rounded-full mt-2"/>
 </div>
 </div>
) : featuredPost && (
 <ScrollReveal direction="up"delay={0} className="relative grid grid-cols-1 md:grid-cols-2 gap-0 mb-10 md:mb-16 border border-transparent rounded-none overflow-hidden">
 <ScrollReveal direction="left"delay={0} className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
 <img
 src={featuredPost.imageUrl}
 alt={featuredPost.title}
 className="w-full h-full object-cover"
 />
 </ScrollReveal>
 <ScrollReveal direction="right"delay={150} className="p-8 md:p-10 flex flex-col justify-center gap-4 bg-[#f8f7f4]">
 <time className="text-xs text-black/40 font-medium tracking-wide">{featuredPost.date}</time>
 <h2 className="text-xl md:text-2xl font-normal leading-snug tracking-tight text-balance">
 {featuredPost.title}
 </h2>
 <p className="text-[14px] md:text-[15px] text-black/70 leading-[1.7] max-w-[500px]">{featuredPost.excerpt}</p>
 <Link
 to={featuredPost.href}
 className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/20 text-black text-sm font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300 w-fit mt-2"
 >
 Read More <ArrowIcon size={14} />
 </Link>
 </ScrollReveal>
 </ScrollReveal>
)
)}

 {/* Post grid */}
 {loading ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
 <BlogPreviewCardSkeleton variant="grid"count={6} />
 </div>
) : filtered.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
 {filtered.map((post, index) => (
 <BlogPreviewCard
 key={post.id}
 post={post}
 variant="grid"
 delay={index * 100}
 />
))}
 </div>
) : (
 <ScrollReveal direction="up"delay={0} className="text-center py-20 text-black/40">
 <p className="text-lg">No posts found.</p>
 </ScrollReveal>
)}
 </div>
 </div>
);
};
