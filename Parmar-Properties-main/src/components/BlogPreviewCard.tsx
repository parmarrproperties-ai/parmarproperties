// ============================================================
// src/components/BlogPreviewCard.tsx
// ONE shared card component used in three locations:
//   variant="row"     → BlogSection/index.tsx (homepage)
//   variant="grid"    → BlogPage.tsx (listing grid)
//   variant="article" → BlogPostDetail.tsx (More Articles)
// ============================================================

import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { BlogPost } from "@/lib/types";

interface BlogPreviewCardProps {
  post: BlogPost;
  variant: "row" | "grid" | "article";
  /** Stagger delay passed to ScrollReveal */
  delay?: number;
  /** For skeleton loading */
  loading?: boolean;
}

// ─── Arrow icon shared ────────────────────────────────────

const ArrowIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);

// ─── Skeleton shimmer ────────────────────────────────────

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-neutral-200 rounded ${className ?? ""}`}
  />
);

// ─── ROW variant (homepage BlogSection) ──────────────────

const RowCard = ({
  post,
  delay = 0,
  loading = false,
}: {
  post: BlogPost;
  delay?: number;
  loading?: boolean;
}) => (
  <ScrollReveal
    delay={delay}
    className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] gap-8 md:gap-20 py-10 md:py-14 items-stretch border-b border-black/[0.08] last:border-b-0"
  >
    <div className="flex h-full flex-col justify-between py-1">
      {loading ? (
        <Shimmer className="w-24 h-4" />
      ) : (
        <time
          dateTime={post.date}
          className="text-sm md:text-base font-medium text-black/90 tracking-tight"
        >
          {post.date}
        </time>
      )}
      <div className="pt-6 md:pt-10 flex flex-col gap-4 max-w-[540px]">
        {loading ? (
          <>
            <Shimmer className="w-full h-12" />
            <Shimmer className="w-4/5 h-5" />
            <Shimmer className="w-3/5 h-5" />
            <Shimmer className="w-32 h-12 rounded-full mt-4" />
          </>
        ) : (
          <>
            <h3 className="text-[32px] md:text-[46px] font-['Instrument_Sans'] font-semibold leading-[1.05] tracking-[-0.04em] text-black">
              {post.title}
            </h3>
            <p className="text-sm md:text-[15px] text-black/70 leading-[1.4] tracking-tight max-w-[460px] mt-1">
              {post.excerpt}
            </p>
            <Link
              to={post.href}
              className="mt-6 inline-flex items-center gap-3 w-fit rounded-full border border-black/15 bg-white/70 px-5 py-3 text-sm font-medium text-black shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all duration-300 hover:bg-black hover:text-white hover:border-black"
            >
              Read More
              <ArrowIcon size={14} />
            </Link>
          </>
        )}
      </div>
    </div>

    <div className="overflow-hidden rounded-none aspect-[16/10] md:aspect-[16/9]">
      {loading ? (
        <Shimmer className="w-full h-full" />
      ) : (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-102"
          loading="lazy"
        />
      )}
    </div>
  </ScrollReveal>
);

// ─── GRID variant (BlogPage listing) ─────────────────────

const GridCard = ({
  post,
  delay = 0,
  loading = false,
}: {
  post: BlogPost;
  delay?: number;
  loading?: boolean;
}) => (
  <ScrollReveal delay={delay} className="flex flex-col gap-3 group">
    <div className="overflow-hidden aspect-[4/3]">
      {loading ? (
        <Shimmer className="w-full h-full" />
      ) : (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      )}
    </div>
    <div className="flex flex-col gap-2 pt-1">
      {loading ? (
        <>
          <Shimmer className="w-20 h-3" />
          <Shimmer className="w-full h-6 mt-1" />
          <Shimmer className="w-4/5 h-4" />
          <Shimmer className="w-3/5 h-4" />
          <Shimmer className="w-24 h-8 rounded-full mt-1" />
        </>
      ) : (
        <>
          <time className="text-xs text-black/90 font-medium tracking-wide">
            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </time>
          <h3 className="text-lg md:text-xl font-['Instrument_Serif'] font-normal leading-snug tracking-tight group-hover:text-black/70 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-black/55 leading-relaxed">
            {post.excerpt}
          </p>
          <Link
            to={post.href}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/20 text-black text-xs font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300 w-fit mt-1"
          >
            Read More <ArrowIcon size={12} />
          </Link>
        </>
      )}
    </div>
  </ScrollReveal>
);

// ─── ARTICLE variant (More Articles section) ──────────────

const ArticleCard = ({
  post,
  delay = 0,
  loading = false,
}: {
  post: BlogPost;
  delay?: number;
  loading?: boolean;
}) => (
  <ScrollReveal delay={delay} className="flex flex-col gap-3 group">
    <Link
      to={post.href}
      className="overflow-hidden rounded-none aspect-[16/10] md:aspect-[16/9] block"
    >
      {loading ? (
        <Shimmer className="w-full h-full" />
      ) : (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
    </Link>
    <div className="flex flex-col gap-1 pt-2">
      {loading ? (
        <>
          <Shimmer className="w-20 h-3" />
          <Shimmer className="w-full h-7 mt-1" />
        </>
      ) : (
        <>
          <time className="text-[11px] font-medium text-black/90">
            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </time>
          <Link to={post.href}>
            <h3 className="text-[22px] md:text-[26px] font-['Instrument_Sans'] font-medium leading-[1.2] tracking-[-0.04em] text-black group-hover:text-black/70 transition-colors">
              {post.title}
            </h3>
          </Link>
        </>
      )}
    </div>
  </ScrollReveal>
);

// ─── Main export ─────────────────────────────────────────

export const BlogPreviewCard = ({
  post,
  variant,
  delay = 0,
  loading = false,
}: BlogPreviewCardProps) => {
  // When loading=true, post may be a dummy — safe because loading variants
  // never render post fields.
  if (variant === "row") return <RowCard post={post} delay={delay} loading={loading} />;
  if (variant === "grid") return <GridCard post={post} delay={delay} loading={loading} />;
  return <ArticleCard post={post} delay={delay} loading={loading} />;
};

// ─── Skeleton exports (convenience wrappers) ─────────────

/** Show N skeleton cards for the given variant while data loads */
export const BlogPreviewCardSkeleton = ({
  variant,
  count = 3,
}: {
  variant: "row" | "grid" | "article";
  count?: number;
}) => {
  const dummy: BlogPost = {
    id: "",
    slug: "",
    date: "",
    title: "",
    excerpt: "",
    imageUrl: "",
    href: "",
    category: null,
    featured: false,
    status: "published",
    gridOrder: 0,
    moreArticlesOverride: null,
  };
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <BlogPreviewCard
          key={i}
          post={dummy}
          variant={variant}
          delay={i * 80}
          loading
        />
      ))}
    </>
  );
};
