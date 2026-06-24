import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/sections/Header/index";
import { Main } from "@/sections/Main/index";
import { Footer } from "@/sections/Footer/index";
import { BlogPage } from "@/pages/BlogPage";
import { BlogPostDetail } from "@/pages/BlogPostDetail";
import { Agentation } from "agentation";

const HomePage = () => (
  <div className="w-full flex flex-col text-black font-instrument_sans">
    <a href="#main-content" className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[9999] focus-visible:bg-white focus-visible:text-black focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-full focus-visible:shadow-md font-medium">
      Skip to main content
    </a>
    <Header />
    <Main />
    <Footer />
  </div>
);

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
        </Routes>
      </BrowserRouter>
      {import.meta.env.DEV && <Agentation />}
    </>
  );
};
