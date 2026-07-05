import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/sections/Header/index";
import { Main } from "@/sections/Main/index";
import { Footer } from "@/sections/Footer/index";
import { BlogPage } from "@/pages/BlogPage";
import { BlogPostDetail } from "@/pages/BlogPostDetail";
import { AboutPage } from "@/pages/AboutPage";
import { LoginPage } from "@/pages/admin/LoginPage";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { PostEditor } from "@/pages/admin/PostEditor";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Agentation } from "agentation";
import { NewsletterConfirmedPage } from "@/pages/NewsletterConfirmedPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsAndConditionsPage } from "@/pages/TermsAndConditionsPage";
import { TestimonialVariationsPage } from "@/pages/TestimonialVariationsPage";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Preloader } from "@/components/Preloader";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const HomePage = () => (
  <>
    <SmoothScroll />
    <div id="main-content-wrapper" className="w-full flex flex-col text-black font-instrument_sans relative z-10 bg-white">
      <a href="#main-content" className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[9999] focus-visible:bg-white focus-visible:text-black focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-full focus-visible:shadow-md font-medium">
        Skip to main content
      </a>
      <Header />
      <Main />
      <Footer />
    </div>
  </>
);

import { useLocation } from "react-router-dom";

const GlobalPreloader = () => {
  const location = useLocation();
  if (location.pathname !== "/") return null;
  return <Preloader />;
};

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <GlobalPreloader />
        <FloatingWhatsApp />
        <ScrollToTopButton />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/About" element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsAndConditionsPage />} />
          <Route path="/newsletter-confirmed" element={<NewsletterConfirmedPage />} />
          <Route path="/testimonial-variations" element={<TestimonialVariationsPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/post/new"
            element={
              <ProtectedRoute>
                <PostEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/post/:slug"
            element={
              <ProtectedRoute>
                <PostEditor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      {import.meta.env.DEV && <Agentation />}
    </>
  );
};
