import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import App from "./App";
import "./styles.css";
import "./brand.css";

const ScrollWalkthrough = lazy(() => import("./ScrollWalkthrough"));
const scrollVersion =
  new URLSearchParams(location.search).get("view") === "scroll";

createRoot(document.getElementById("root")!).render(
  scrollVersion ? (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100svh",
            display: "grid",
            placeItems: "center",
            color: "#b3b3b3",
          }}
        >
          Loading the walkthrough…
        </div>
      }
    >
      <ScrollWalkthrough />
    </Suspense>
  ) : (
    <App />
  ),
);
