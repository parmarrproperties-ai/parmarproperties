import { Link } from "react-router-dom";
import { blog } from "@/content/content";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";

const previewPosts = blog.posts.slice(0, 3);

export const BlogSection = () => {
  return (
    <section className="bg-[#f3f1ed] text-black py-16 md:py-[100px] w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] gap-10 md:gap-16 items-start pb-10 md:pb-12">

          <ScrollReveal direction="up" delay={0}>
            <h2 className="font-['Instrument_Sans'] text-[58px] md:text-[78px] font-semibold tracking-[-0.06em] leading-[0.92]">
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
          {previewPosts.map((post, index) => (
            <ScrollReveal
              key={post.title}
              delay={index * 100}
              className="grid grid-cols-1 md:grid-cols-[minmax(0,1.02fr)_minmax(0,1.35fr)] gap-8 md:gap-14 py-10 md:py-14 items-stretch"
            >
              <div className="flex h-full flex-col justify-between">
                <time
                  dateTime={post.date}
                  className="text-[11px] md:text-sm font-medium text-black/90 tracking-normal"
                >
                  {post.date}
                </time>
                <div className="pt-10 md:pt-16 flex flex-col gap-5 max-w-[550px]">
                  <h3 className="text-[28px] md:text-[33px] font-['Instrument_Sans'] font-medium leading-[1.12] tracking-[-0.05em]">
                    {post.title}
                  </h3>
                  <p className="text-[13px] md:text-[14px] text-black/85 leading-[1.55] max-w-[510px]">
                    {post.excerpt}
                  </p>
                  <Link
                    to={post.href}
                    className="mt-4 inline-flex items-center gap-3 w-fit rounded-full border border-black/15 bg-white/70 px-5 py-3 text-sm font-medium text-black shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all duration-300 hover:bg-black hover:text-white hover:border-black"
                  >
                    Read More
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-none aspect-[16/10] md:aspect-[16/9]">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
