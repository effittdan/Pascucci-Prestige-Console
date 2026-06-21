import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { CommandCenterRoot } from "./CommandCenterRoot";
import { PublicConciergeSite } from "./PublicConciergeSite";
import "./styles.css";

registerSW({ immediate: true });

const RootApp = window.location.pathname.startsWith("/command") ? CommandCenterRoot : PublicConciergeSite;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);
