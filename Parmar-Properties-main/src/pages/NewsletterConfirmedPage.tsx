import { Header } from "@/sections/Header/index";
import { Footer } from "@/sections/Footer/index";

export const NewsletterConfirmedPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col text-black font-instrument_sans">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
            You're successfully subscribed
          </h1>
          <p className="text-lg text-neutral-600 mb-10">
            Thank you for subscribing to Parmar Properties. You'll receive our latest updates, market insights, and exclusive pre-launch inventory right in your inbox.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center bg-neutral-900 text-white font-medium px-8 py-4 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};
