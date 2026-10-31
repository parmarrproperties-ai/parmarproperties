import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("app")!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Pre-rendered pages (scripts/prerender.mjs) already contain the page HTML:
// hydrate it instead of re-rendering, so content and animations show without
// waiting for JavaScript. The plain SPA shell (spa.html) has an empty container.
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
