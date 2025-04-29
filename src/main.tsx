import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./settings/firebaseConfig.ts";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const T = window.visualViewport!.height;
const root = document.getElementById("root")!;
root.setAttribute("data-is-fullscreen", "1");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
function viewportHandler(event: Event) {
  const viewport = event.target as VisualViewport;
  // const container = document.documentElement;
  const container = document.querySelector("#root") as HTMLElement;

  const h = viewport.height;

  container.style.height = `${h}px`;
  const isFullscreen = h >= T;

  container.setAttribute("data-is-fullscreen", isFullscreen ? "1" : "0");
  window.scroll(0, 0);
}

window.visualViewport?.addEventListener("scroll", viewportHandler);
window.visualViewport?.addEventListener("resize", viewportHandler);
