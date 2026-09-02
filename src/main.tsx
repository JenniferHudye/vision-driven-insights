import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing");

// createRoot (not hydrateRoot): the prerendered static HTML in #root is for
// crawlers. On mount React clears it and renders the identical SPA for humans.
createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </StrictMode>,
);
