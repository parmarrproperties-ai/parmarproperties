import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/sections/Header/index";
import { Main } from "@/sections/Main/index";
import { Footer } from "@/sections/Footer/index";
import { BlogPage } from "@/pages/BlogPage";
import { BlogPostDetail } from "@/pages/BlogPostDetail";
import { AboutPage } from "@/pages/AboutPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Agentation } from "agentation";
import { NewsletterConfirmedPage } from "@/pages/NewsletterConfirmedPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsAndConditionsPage } from "@/pages/TermsAndConditionsPage";
import { ContactPage } from "@/pages/ContactPage";
import { FaqPage } from "@/pages/FaqPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Preloader } from "@/components/Preloader";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Seo } from "@/seo/Seo";
import { pages } from "@/seo/pages";
import { organizationSchema, websiteSchema, webPageSchema } from "@/seo/schema";

const HomePage = () => (
  <>
    <Seo
      {...pages.home}
      jsonLd={[organizationSchema(), websiteSchema(), webPageSchema({ path: "/", title: pages.home.title, description: pages.home.description })]}
    />
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

// Admin pages load on demand: they are not needed by visitors, and the rich-text
// editor (react-quill) cannot be imported during the build-time server render.
const LoginPage = lazy(() => import("@/pages/admin/LoginPage").then((m) => ({ default: m.LoginPage })));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const PostEditor = lazy(() => import("@/pages/admin/PostEditor").then((m) => ({ default: m.PostEditor })));
const AdminFallback = () => <div className="min-h-screen flex items-center justify-center text-black/40">Loading…</div>;
const admin = (node: ReactNode) => <Suspense fallback={<AdminFallback />}>{node}</Suspense>;

const GlobalPreloader = () => {
  const location = useLocation();
  if (location.pathname !== "/") return null;
  return <Preloader />;
};

/** The route tree, shared by the browser app and the build-time prerender (entry-server.tsx). */
export const AppRoutes = () => (
  <>
    <GlobalPreloader />
    <FloatingWhatsApp />
    <ScrollToTopButton />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostDetail />} />
      {/* /About is kept for old links; its canonical URL is /about */}
      <Route path="/About" element={<AboutPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:slug" element={<ServiceDetailPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsAndConditionsPage />} />
      <Route path="/newsletter-confirmed" element={<NewsletterConfirmedPage />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={admin(<LoginPage />)} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {admin(<AdminDashboard />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/post/new"
        element={
          <ProtectedRoute>
            {admin(<PostEditor />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/post/:slug"
        element={
          <ProtectedRoute>
            {admin(<PostEditor />)}
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
);

export const App = () => {
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
        <AppRoutes />
      </BrowserRouter>
      {import.meta.env.DEV && <Agentation />}
    </>
  );
};
