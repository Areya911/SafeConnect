import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // keep this (can be minimal when using CDN tailwind)

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
