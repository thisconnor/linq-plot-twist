import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, X } from "lucide-react";
import type { Message } from "./state";
import { TRIP } from "./scenario";

type Feature = "reaction" | "map";

/** Two short editorial notes, triggered by the feature appearing in the thread. */
export function FeatureNote({ messages }: { messages: Message[] }) {
  const reaction = messages.some((message) => Boolean(message.reaction));
  const map = messages.some((message) => message.attachment === "map");
  const seen = useRef({ reaction, map });
  const [active, setActive] = useState<Feature | null>(null);
  useEffect(() => {
    if (map && !seen.current.map) {
      seen.current.map = true;
      setActive("map");
    } else if (reaction && !seen.current.reaction) {
      seen.current.reaction = true;
      setActive("reaction");
    }
  }, [reaction, map]);
  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => setActive(null), 9000);
    return () => window.clearTimeout(timer);
  }, [active]);
  return (
    <div className="feature-note-slot">
      <AnimatePresence mode="wait">
        {active && (
          <motion.aside
            className={`feature-note ${active}`}
            key={active}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
          >
            <div className="feature-symbol" aria-hidden="true">
              {active === "reaction" ? "👍" : <MapPin size={25} />}
            </div>
            <div>
              <small>WHY iMESSAGE?</small>
              <strong>
                {active === "reaction" ? "A familiar reply." : "See the way."}
              </strong>
              <p>
                {active === "reaction"
                  ? "Reactions, built in."
                  : `${TRIP.route.walkMinutes} min. A route you can keep.`}
              </p>
            </div>
            <button
              aria-label="Dismiss iMessage tip"
              onClick={() => setActive(null)}
            >
              <X size={14} />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
