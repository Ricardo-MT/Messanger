import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./settings/firebaseConfig.ts";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
function viewportHandler(event: Event) {
  const viewport = event.target as VisualViewport;
  const html = document.documentElement;
  html.style.height = `calc(${viewport.height}px)`;
  html.style.setProperty("--vh", `${viewport.height / 100}px`);
  window.scroll(0, 0);
}

window.visualViewport.addEventListener("scroll", viewportHandler);
window.visualViewport.addEventListener("resize", viewportHandler);
