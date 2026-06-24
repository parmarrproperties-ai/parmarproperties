import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blog } from "@/content/content";
import { Header } from "@/sections/Header/index";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";

const ArrowIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

export const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // Filter posts for the grid (all except featured)
  const allPosts = blog.posts;
  const featuredPost = allPosts[featuredIndex];
  const gridPosts = allPosts.filter((_, i) => i !== featuredIndex);

  const filtered = gridPosts.filter((post) => {
    const matchCat = activeCategory === "All" || post.category === activeCategory;
    const matchSearch =
      search.trim() === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div id="main-content" className="min-h-screen bg-white font-['Instrument_Sans']">
      <Header />

      <div className="pt-[64px] md:pt-[62px]">
        <div className="px-5 md:px-12 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] gap-8 md:gap-16 items-start">
          <ScrollReveal direction="up" delay={0}>
            <h1 className="font-['Instrument_Sans'] text-[58px] md:text-[78px] font-semibold tracking-[-0.06em] leading-[0.92]">
              <ScrollScrubRevealText
                text={blog.heading.main}
                className="inline"
                baseColorClass="text-neutral-300"
                revealColorClass="text-black"
                scrubStart="top 90%"
                scrubEnd="center 60%"
                as="span"
              />
              {" "}
              <ScrollScrubRevealText
                text={blog.heading.accent}
                className="inline"
                baseColorClass="text-neutral-300/55"
                revealColorClass="text-neutral-400"
                scrubStart="top 85%"
                scrubEnd="center 55%"
                as="span"
              />
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <div className="max-w-[640px] md:pt-1 md:justify-self-start md:pl-4">
              <p className="text-[20px] md:text-[25px] font-medium tracking-[-0.05em] leading-[1.18] max-w-[590px]">
                {blog.subheading}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
      </div>

      <ScrollReveal direction="up" delay={120}>
        <div className="px-5 md:px-12 pt-12 pb-8 flex items-center gap-3">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-black placeholder-black/40 bg-transparent outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-sm px-1"
          />
          <SearchIcon />
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={160}>
        <div className="px-5 md:px-12 py-4 flex flex-wrap gap-2">
          {blog.categories.map((cat, index) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black/20 hover:border-black/50"
              }`}
              style={{ transitionDelay: `${index * 40}ms` }}
            >
              {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="px-5 md:px-12 py-8 md:py-12">
        {search.trim() === "" && activeCategory === "All" && featuredPost && (
          <ScrollReveal direction="up" delay={0} className="relative grid grid-cols-1 md:grid-cols-2 gap-0 mb-10 md:mb-16 border border-black/10 rounded-none overflow-hidden">
            {/* Featured image */}
            <ScrollReveal direction="left" delay={0} className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={150} className="p-8 md:p-10 flex flex-col justify-center gap-4 bg-white">
              <time className="text-xs text-black/40 font-medium tracking-wide">{featuredPost.date}</time>
              <h2 className="text-2xl md:text-3xl font-['Instrument_Serif'] font-normal leading-snug tracking-tight text-balance">
                {featuredPost.title}
              </h2>
              <p className="text-sm text-black/60 leading-relaxed">{featuredPost.excerpt}</p>
              <Link
                to={featuredPost.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/20 text-black text-sm font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300 w-fit mt-2"
              >
                Read More <ArrowIcon size={14} />
              </Link>
            </ScrollReveal>
            <div className="absolute bottom-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => setFeaturedIndex((prev) => (prev - 1 + allPosts.length) % allPosts.length)}
                className="w-9 h-9 rounded-full border border-white/60 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                aria-label="Previous featured post"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5m7-7-7 7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => setFeaturedIndex((prev) => (prev + 1) % allPosts.length)}
                className="w-9 h-9 rounded-full border border-white/60 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                aria-label="Next featured post"
              >
                <ArrowIcon size={14} />
              </button>
            </div>
          </ScrollReveal>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((post, index) => (
              <ScrollReveal key={post.title} delay={index * 100} className="flex flex-col gap-3 group">
                <div className="overflow-hidden aspect-[4/3]">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <time className="text-xs text-black/40 font-medium tracking-wide">{post.date}</time>
                  <h3 className="text-lg md:text-xl font-['Instrument_Serif'] font-normal leading-snug tracking-tight group-hover:text-black/70 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-black/55 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    to={post.href}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/20 text-black text-xs font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300 w-fit mt-1"
                  >
                    Read More <ArrowIcon size={12} />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal direction="up" delay={0} className="text-center py-20 text-black/40">
            <p className="text-lg font-['Instrument_Serif']">No posts found.</p>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};
