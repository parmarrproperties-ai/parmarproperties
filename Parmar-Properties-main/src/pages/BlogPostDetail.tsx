import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { blog } from "@/content/content";
import { Header } from "@/sections/Header/index";
import { Footer } from "@/sections/Footer/index";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollScrubRevealText } from "@/components/ScrollScrubRevealText";

const ArrowIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 3.656 10.99 8.792 12.75v-9.022H5.568v-3.728h3.224V7.226c0-3.18 1.89-4.944 4.798-4.944 1.393 0 2.852.248 2.852.248v3.136h-1.607c-1.576 0-2.067.978-2.067 1.983v2.38h3.533l-.565 3.728h-2.968v9.022c5.136-1.76 8.792-6.76 8.792-12.75z"/>
  </svg>
);

export const BlogPostDetail = () => {
  const { slug } = useParams();
  const post = blog.posts.find((p) => p.href === `/blog/${slug}`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-['Instrument_Serif'] mb-4">Post not found</h1>
          <Link to="/blog" className="text-black hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const otherPosts = blog.posts.filter((p) => p.href !== post.href).slice(0, 3);

  return (
    <div className="min-h-screen bg-white font-['Instrument_Sans']">
      <Header />
      
      <main className="pt-[100px] md:pt-[140px] pb-20">
        <div className="max-w-[1920px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-start">
            
            {/* Left Column: Meta */}
            <div className="lg:sticky lg:top-[140px] flex flex-col gap-8">
              <ScrollReveal direction="up" delay={0}>
                <time className="text-sm font-medium text-black/60 block mb-6 uppercase tracking-widest">
                  {post.date}
                </time>
                <h1 className="text-[56px] md:text-[84px] font-['Instrument_Sans'] font-semibold leading-[0.95] tracking-[-0.06em] text-black">
                  <ScrollScrubRevealText
                    text={post.title}
                    as="span"
                    baseColorClass="text-neutral-200"
                    revealColorClass="text-black"
                    scrubStart="top 90%"
                    scrubEnd="center 60%"
                  />
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={200} className="mt-12 flex gap-4">
                <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-black/60">
                  <XIcon />
                </button>
                <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-black/60">
                  <FacebookIcon />
                </button>
              </ScrollReveal>
            </div>

            {/* Right Column: Content */}
            <div className="flex flex-col gap-12">
              <ScrollReveal direction="up" delay={100} className="flex flex-col gap-8">
                {post.content?.intro.map((para, i) => (
                  <p key={i} className="text-[18px] md:text-[21px] leading-[1.5] text-black/90 font-medium">
                    {para}
                  </p>
                ))}
              </ScrollReveal>

              {post.content?.sections.map((section, idx) => (
                <ScrollReveal key={idx} direction="up" delay={150 + idx * 50} className="flex flex-col gap-8">
                  {section.title && (
                    <h2 className="text-[32px] md:text-[42px] font-['Instrument_Sans'] font-semibold leading-tight tracking-[-0.04em]">
                      {section.title}
                    </h2>
                  )}
                  {section.paragraphs.map((para, i) => (
                    <p key={i} className="text-[16px] md:text-[18px] leading-[1.6] text-black/80">
                      {para}
                    </p>
                  ))}
                  {section.insight && (
                    <div className="pt-4">
                      <p className="text-[16px] md:text-[18px] leading-[1.6] text-black font-medium">
                        <span className="font-bold">Insight: </span>
                        {section.insight}
                      </p>
                    </div>
                  )}
                </ScrollReveal>
              ))}

              {post.content?.downloads && (
                <ScrollReveal direction="up" delay={300} className="mt-8 pt-12">
                  <h3 className="text-[24px] md:text-[32px] font-['Instrument_Sans'] font-semibold mb-6 tracking-tight">
                    Download the Full Q1 Reports
                  </h3>
                  <p className="text-black/60 mb-8">For a deeper, borough-by-borough breakdown of sales and rental data, download the full reports below:</p>
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
            <ScrollReveal direction="up" delay={0} className="mb-12">
              <h2 className="text-[58px] md:text-[78px] font-['Instrument_Sans'] font-semibold tracking-[-0.06em] leading-[0.92]">
                <ScrollScrubRevealText
                  text="More Articles"
                  as="span"
                  baseColorClass="text-neutral-300"
                  revealColorClass="text-black"
                  scrubStart="top 90%"
                  scrubEnd="center 60%"
                />
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {otherPosts.map((other, index) => (
                <ScrollReveal key={other.title} delay={index * 100} className="flex flex-col gap-3 group">
                  <Link to={other.href} className="overflow-hidden rounded-none aspect-[16/10] md:aspect-[16/9]">
                    <img
                      src={other.imageUrl}
                      alt={other.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-col gap-1 pt-2">
                    <time className="text-[11px] font-medium text-black/40 uppercase tracking-wider">{other.date}</time>
                    <Link to={other.href}>
                      <h3 className="text-[22px] md:text-[26px] font-['Instrument_Sans'] font-medium leading-[1.2] tracking-[-0.04em] text-black group-hover:text-black/70 transition-colors">
                        {other.title}
                      </h3>
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
