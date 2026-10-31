export interface TestimonialCardProps {
  title: string;
  quote: string;
  author: string;
  rating?: number;
}

export function TestimonialCard({ 
  title, 
  quote, 
  author, 
  rating = 5 
}: TestimonialCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-200 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl p-8 flex flex-col justify-between group h-full">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mb-6 h-10 w-10 text-neutral-300 group-hover:text-neutral-900 transition-colors duration-300"
        >
          <path
            fillRule="evenodd"
            d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
            clipRule="evenodd"
          />
          <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
        </svg>
        <h5 className="text-xl font-lora font-semibold text-neutral-900 mb-3">
          {title}
        </h5>
        <p className="text-sm text-neutral-600 font-instrument_sans leading-relaxed mb-8">
          {quote}
        </p>
      </div>
      <div className="pt-5 border-t border-neutral-100 flex items-center justify-between mt-auto">
        <div className="uppercase text-xs font-semibold tracking-wider font-lora text-neutral-900">
          {author}
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`h-4 w-4 transition-colors duration-300 ${
                i < rating ? "text-amber-400" : "text-neutral-200"
              }`}
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}

