import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { PublicConciergeSite } from "./PublicConciergeSite";
import "./styles.css";

const RootApp = window.location.pathname.startsWith("/command") ? App : PublicConciergeSite;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);
