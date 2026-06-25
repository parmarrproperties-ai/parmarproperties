import { Link } from "react-router-dom";
import { blog } from "@/content/content";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { BlogPreviewCard, BlogPreviewCardSkeleton } from "@/components/BlogPreviewCard";

export const BlogSection = () => {
  const { posts, loading } = useBlogPosts();
  const previewPosts = posts.slice(0, 3);

  return (
    <section className="bg-[#f3f1ed] text-black py-16 md:py-[100px] w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] gap-10 md:gap-16 items-start pb-10 md:pb-12">

          <ScrollReveal direction="up" delay={0}>
            <h2 className="font-['Instrument_Sans'] text-[58px] md:text-[78px] font-semibold tracking-[-0.06em] leading-[0.92] text-balance">
              <ScrollScrubRevealText
                text={blog.heading.main}
                className="inline"
                baseColorClass="text-neutral-300"
                revealColorClass="text-black"
                scrubStart="top 90%"
                scrubEnd="center 60%"
              />
              {" "}
              <ScrollScrubRevealText
                text={blog.heading.accent}
                className="inline"
                baseColorClass="text-neutral-300/55"
                revealColorClass="text-neutral-400"
                scrubStart="top 85%"
                scrubEnd="center 55%"
              />
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <div className="max-w-[640px] md:pt-1 md:justify-self-start md:pl-4">
              <p className="text-[20px] md:text-[25px] font-medium tracking-[-0.05em] leading-[1.18] max-w-[590px]">
                {blog.subheading}
              </p>
              <Link
                to="/blog"
                className="mt-8 inline-flex items-center gap-3 bg-black text-white text-sm md:text-base font-medium leading-none px-6 py-3.5 rounded-full hover:bg-black/85 transition-colors duration-300 shadow-sm"
              >
                <span>{blog.ctaButton.label}</span>
                <span className="flex items-center justify-center w-5 h-5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <div className="flex flex-col">
          {loading ? (
            <BlogPreviewCardSkeleton variant="row" count={3} />
          ) : (
            previewPosts.map((post, index) => (
              <BlogPreviewCard
                key={post.id}
                post={post}
                variant="row"
                delay={index * 100}
              />
            ))
          )}
        </div>

      </div>
    </section>
  );
};
