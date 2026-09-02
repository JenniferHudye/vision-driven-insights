import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Frameworks from "./pages/Frameworks";
import Books from "./pages/Books";
import Courses from "./pages/Courses";
import Speaking from "./pages/Speaking";
import Press from "./pages/Press";
import Testimonials from "./pages/Testimonials";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import Awards from "./pages/Awards";
import TrustedBy from "./pages/TrustedBy";
import FAQ from "./pages/FAQ";
import Articles from "./pages/Articles";
import PillarPage from "./pages/PillarPage";
import ArticleDetail from "./pages/ArticleDetail";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import staticRoutes from "../config/static-routes.json";
import pillars from "../data/pillars.json";

// Static routes + pillar topic pages are the ONLY bare-path links allowed in
// article bodies. Every other internal link must be /articles/<slug> where
// the slug exists in data/blog/posts.json. See scripts/check-internal-links.cjs,
// which reads the same config/static-routes.json and data/pillars.json.
export const STATIC_ROUTES = [
  ...staticRoutes,
  ...pillars.map((p) => `/topics/${p.slug}`),
];

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/frameworks" element={<Frameworks />} />
        <Route path="/books" element={<Books />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/speaking" element={<Speaking />} />
        <Route path="/press" element={<Press />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/trusted-by" element={<TrustedBy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/topics/:slug" element={<PillarPage />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
