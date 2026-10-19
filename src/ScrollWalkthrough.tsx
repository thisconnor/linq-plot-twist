import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight, MapPin, Pause, Play } from "lucide-react";
import { Avatar, Invitation, MessagePhone, Modal, StatusBar } from "./App";
import { LinqLogo, PlotLogo } from "./Brands";
import { ATTACHMENTS, STORY, TRIP, timeLabel } from "./scenario";
import type { Attachment, Beat } from "./scenario";
import { VoicePlayback } from "./playback";
import type { NarrationClips } from "./playback";
import narration from "./data/narration.json";
import {
  nextScrollSend,
  projectScrollMessages,
  SCROLL_MOMENTS,
  scrollMoment,
} from "./scroll-model";
import "./scroll.css";

const COPY = [
  {
    title: (
      <>
        Let them try it first.
        <br />
        Win the meeting.
      </>
    ),
    body: "We email qualified voice-AI builders a personalized demo number, so they can try a customer workflow in iMessage before we ask for a meeting.",
  },
  {
    title: (
      <>
        Made for their company.
        <br />
        Sent to their inbox.
      </>
    ),
    body: "You’re the lead developer at Plot Twist Travel. Linq has built a small demo of your assistant in iMessage. This is the email you receive.",
  },
  {
    title: (
      <>
        Now be the customer
        <br />
        who needs that assistant.
      </>
    ),
    body: "You’re at the airport. Your flight was canceled. You and Pickles, your dog, need a way home tonight. Alex is Plot Twist’s AI travel assistant.",
  },
  {
    title: (
      <>
        First, the voice agent
        <br />
        they already built.
      </>
    ),
    body: "Alex can find a flight, recommend the nonstop, and explain a gate change. Follow the same problem into iMessage.",
  },
  {
    title: (
      <>
        One word starts
        <br />
        the conversation.
      </>
    ),
    body: `Text “${TRIP.keyword.toLowerCase()}” to the demo number. Alex introduces himself, and his name and photo appear in the conversation.`,
  },
  {
    title: (
      <>
        The options are
        <br />
        right there.
      </>
    ),
    body: "Ask Alex for help with the canceled flight. He shares the flight results and recommends the nonstop. You can look at the details while deciding.",
  },
  {
    title: (
      <>
        A quick reply.
        <br />A familiar thumbs-up.
      </>
    ),
    body: "Choose the nonstop and tell Alex you’re taking Pickles to pet relief beside B10. He acknowledges your choice and keeps the plan in the conversation.",
  },
  {
    title: (
      <>
        Eight minutes later,
        <br />
        the gate changes.
      </>
    ),
    body: `You check in with Alex. ${TRIP.selected.flight} now boards at ${TRIP.selected.gate}, instead of ${TRIP.selected.oldGate}. Boarding is still ${timeLabel(TRIP.selected.boarding)} PM.`,
  },
  {
    title: (
      <>
        Directions you
        <br />
        can keep.
      </>
    ),
    body: `The walk from pet relief to ${TRIP.selected.gate} takes ${TRIP.route.walkMinutes} minutes. The route sits beside the gate update, ready when you need it.`,
  },
  {
    title: (
      <>
        Give your voice agent
        <br />a place in iMessage.
      </>
    ),
    body: "Your customers already text. Put your assistant in the conversation, with the photos, plans, and directions they need to act.",
  },
];

function PreviewPhone() {
  return (
    <div className="phone message-phone scroll-preview-phone">
      <StatusBar clock={TRIP.startMinutes} />
      <div className="preview-contact">
        <Avatar />
        <div>
          <strong>Alex</strong>
          <span>Plot Twist · AI travel assistant</span>
        </div>
      </div>
      <div className="preview-thread">
        <p className="preview-bubble outgoing">
          My flight was canceled. Can you help?
        </p>
        <p className="preview-bubble incoming">
          Two flights home tonight. I’d take the nonstop.
        </p>
        <img
          className="preview-attachment"
          src={ATTACHMENTS.flights.src}
          alt={ATTACHMENTS.flights.alt}
        />
      </div>
      <span className="home-indicator" />
    </div>
  );
}

export default function ScrollWalkthrough() {
  const track = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const voice = useRef(
    new VoicePlayback((src) => {
      const node = audio.current ?? new Audio();
      node.src = src;
      node.load();
      return node;
    }),
  );
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  const position = useTransform(
    scrollYProgress,
    (value) => value * (SCROLL_MOMENTS.length - 1),
  );
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(-1);
  useMotionValueEvent(position, "change", (value) => {
    const next = Math.round(value * 40) / 40;
    if (next !== frameRef.current) {
      frameRef.current = next;
      setFrame(next);
    }
  });
  const moment = scrollMoment(frame);
  const customer = moment >= 2 && moment <= 8;
  const state = useMemo(() => projectScrollMessages(frame), [frame]);
  const [dialog, setDialog] = useState<Attachment | "about" | "pilot" | null>(
    null,
  );
  const [playing, setPlaying] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const [cue, setCue] = useState({
    beat: 0 as Beat,
    text: "",
    speaker: "alex",
  });
  const kind =
    moment === 0
      ? "preview"
      : moment === 1
        ? "email"
        : moment <= 3
          ? "voice"
          : "messages";
  const shellWidth = useTransform(
    position,
    [0, 0.55, 1, 1.45, 2, 9],
    [320, 320, 560, 560, 320, 320],
  );
  const shellRadius = useTransform(position, [0, 1, 2], [40, 12, 40]);
  const shellBorder = useTransform(position, [0, 1, 2], [5, 1, 5]);
  const shellY = useTransform(position, [0, 1, 2, 8.75, 9], [12, 0, 0, 0, -28]);
  const shellOpacity = useTransform(position, [0, 8.75, 8.95], [1, 1, 0]);
  const partnershipOpacity = useTransform(position, [8.95, 9], [0, 1]);
  const previewOpacity = useTransform(position, [0, 0.55, 0.95], [1, 1, 0]);
  const emailOpacity = useTransform(
    position,
    [0.55, 1, 1.45, 1.95],
    [0, 1, 1, 0],
  );
  const voiceOpacity = useTransform(
    position,
    [1.45, 2, 3.45, 3.95],
    [0, 1, 1, 0],
  );
  const messagesOpacity = useTransform(position, [3.45, 3.95], [0, 1]);

  function seek(value: number) {
    if (!track.current) return;
    const top = window.scrollY + track.current.getBoundingClientRect().top;
    const distance = track.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (Math.max(0, Math.min(9, value)) / 9) * distance,
      behavior: reduced ? "instant" : "smooth",
    });
  }
  function stopVoice() {
    voice.current.cancel();
    setPlaying(false);
  }
  function playVoice() {
    if (playing) {
      stopVoice();
      return;
    }
    setAudioFailed(false);
    setPlaying(true);
    void voice.current.play(narration.clips as NarrationClips, {
      onCue: (beat, text, speaker) => setCue({ beat, text, speaker }),
      onAudioUnavailable: () => setAudioFailed(true),
      onFinish: () => setPlaying(false),
    });
  }
  useEffect(() => {
    if (moment !== 3) {
      voice.current.cancel();
      setPlaying(false);
    }
  }, [moment]);
  useEffect(() => {
    document.title = "Linq · The scroll walkthrough";
    return () => voice.current.cancel();
  }, []);
  const previewBeat = frame < 3.15 ? 0 : frame < 3.5 ? 1 : 2;
  const voiceCaption = playing
    ? cue.text
    : STORY[previewBeat].narration[previewBeat === 0 ? 1 : 0];
  const activeLayer = (name: string) => ({
    "aria-hidden": kind !== name || moment === 9,
    inert: kind !== name || moment === 9,
  });

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      <div
        className={`scroll-story ${customer ? "scroll-customer" : ""} moment-${moment} ${reduced ? "reduce-scroll-motion" : ""}`}
      >
        <motion.div
          className="scroll-backdrop"
          animate={{ backgroundColor: customer ? "#f8f8f6" : "#141414" }}
          initial={false}
          transition={{ duration: reduced ? 0 : 0.2 }}
        />
        <nav className="scroll-skip" aria-label="Jump through the walkthrough">
          <a href="#invitation">Invitation</a>
          <a href="#voice">Voice example</a>
          <a href="#welcome">iMessage</a>
          <a href="#pilot">Pilot</a>
        </nav>
        <header className="scroll-header">
          <a href="./?view=scroll" aria-label="Return to scroll introduction">
            {customer ? <PlotLogo compact /> : <LinqLogo />}
          </a>
          <a className="scroll-original" href="./">
            Original version <ArrowUpRight size={14} />
          </a>
        </header>
        <audio ref={audio} preload="metadata" aria-hidden="true" />
        <main className="scroll-track" ref={track}>
          {SCROLL_MOMENTS.map((name, index) => (
            <div
              key={name}
              id={name}
              className="scroll-anchor"
              style={{ top: `${index * 100}svh` }}
            />
          ))}
          <div className="scroll-canvas">
            <div className="scroll-composition">
              <div className="scroll-copy">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.section
                    key={moment}
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduced ? 0 : -10 }}
                    transition={{ duration: reduced ? 0 : 0.16 }}
                    aria-label={SCROLL_MOMENTS[moment]}
                  >
                    {moment === 0 ? (
                      <h1>{COPY[moment].title}</h1>
                    ) : (
                      <h2>{COPY[moment].title}</h2>
                    )}
                    <p>{COPY[moment].body}</p>
                    {moment === 0 && (
                      <>
                        <p className="scroll-context">
                          AI builds a lightweight demo for each company,
                          selected for product fit and public signals.
                        </p>
                        <a className="scroll-invitation-cue" href="#invitation">
                          Scroll to see the example <ArrowDown size={16} />
                        </a>
                        <ol className="scroll-funnel">
                          <li>Build their demo</li>
                          <li>Email their number</li>
                          <li>Earn a meeting</li>
                        </ol>
                      </>
                    )}
                    {moment === 1 && (
                      <div className="scroll-company">
                        <PlotLogo compact />
                      </div>
                    )}
                    {moment === 3 && (
                      <button
                        className="button plum scroll-listen"
                        onClick={playVoice}
                      >
                        {playing ? (
                          <Pause size={15} />
                        ) : (
                          <Play size={15} fill="currentColor" />
                        )}
                        {playing ? "Stop the call" : "Listen to the call"}
                      </button>
                    )}
                    {moment >= 4 && moment <= 8 && (
                      <span className="scroll-powered">
                        Powered by <LinqLogo />
                      </span>
                    )}
                    {moment === 6 && (
                      <span className="scroll-feature">
                        <span aria-hidden="true">👍</span> A quick thumbs-up.
                      </span>
                    )}
                    {moment === 8 && (
                      <a
                        className="scroll-route"
                        href="./travel-preview.html?view=map"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MapPin size={16} /> Open the walking route{" "}
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                    {moment === 9 && (
                      <button
                        className="button primary"
                        onClick={() => setDialog("pilot")}
                      >
                        Build your iMessage pilot
                      </button>
                    )}
                  </motion.section>
                </AnimatePresence>
              </div>
              <div className="scroll-visual">
                <motion.div
                  className={`scroll-shell kind-${kind}`}
                  style={{
                    width: reduced
                      ? kind === "email"
                        ? 560
                        : 320
                      : shellWidth,
                    borderRadius: reduced
                      ? kind === "email"
                        ? 12
                        : 40
                      : shellRadius,
                    borderWidth: reduced
                      ? kind === "email"
                        ? 1
                        : 5
                      : shellBorder,
                    y: reduced ? 0 : shellY,
                    opacity: reduced ? (moment === 9 ? 0 : 1) : shellOpacity,
                  }}
                  inert={moment === 9}
                  aria-hidden={moment === 9}
                >
                  <motion.div
                    className="scroll-layer"
                    {...activeLayer("preview")}
                    style={{
                      opacity: reduced
                        ? kind === "preview"
                          ? 1
                          : 0
                        : previewOpacity,
                    }}
                  >
                    <PreviewPhone />
                  </motion.div>
                  <motion.div
                    className="scroll-layer scroll-email"
                    {...activeLayer("email")}
                    style={{
                      opacity: reduced
                        ? kind === "email"
                          ? 1
                          : 0
                        : emailOpacity,
                    }}
                  >
                    <Invitation onContinue={() => seek(2)} />
                  </motion.div>
                  <motion.div
                    className="scroll-layer"
                    {...activeLayer("voice")}
                    style={{
                      opacity: reduced
                        ? kind === "voice"
                          ? 1
                          : 0
                        : voiceOpacity,
                    }}
                  >
                    <div className="phone voice-phone scroll-call-phone">
                      <StatusBar
                        clock={
                          moment === 2
                            ? TRIP.startMinutes
                            : STORY[playing ? cue.beat : previewBeat].clock
                        }
                      />
                      <div className="scroll-call-person">
                        <Avatar />
                        <h3>Alex</h3>
                        <p>Plot Twist Travel</p>
                        <span>AI travel assistant</span>
                      </div>
                      {moment === 2 ? (
                        <div className="scroll-canceled">
                          <span>Plot Air · {TRIP.canceledFlight}</span>
                          <strong>Flight canceled</strong>
                          <p>
                            Let’s find a way home.
                            <br />
                            Pickles is coming too.
                          </p>
                        </div>
                      ) : (
                        <div className="scroll-call-caption">
                          <div
                            className={`waveform ${playing ? "speaking" : ""}`}
                            aria-hidden="true"
                          >
                            {Array.from({ length: 21 }, (_, i) => (
                              <i
                                key={i}
                                style={{
                                  height: 10 + ((i * 17) % 29),
                                  animationDelay: `${i * -0.07}s`,
                                }}
                              />
                            ))}
                          </div>
                          <small>
                            {playing && cue.speaker === "you"
                              ? "YOU · THE TRAVELER"
                              : "ALEX · AI ASSISTANT"}
                          </small>
                          <p>{voiceCaption}</p>
                          {audioFailed && (
                            <small>Audio unavailable · captions on</small>
                          )}
                        </div>
                      )}
                      <span className="home-indicator" />
                    </div>
                  </motion.div>
                  <motion.div
                    className="scroll-layer scroll-messages"
                    {...activeLayer("messages")}
                    style={{
                      opacity: reduced
                        ? kind === "messages"
                          ? 1
                          : 0
                        : messagesOpacity,
                    }}
                  >
                    <MessagePhone
                      state={state}
                      onSend={() =>
                        seek(
                          state.step === 3 ? 8.5 : nextScrollSend(frame) + 0.72,
                        )
                      }
                      onAttachment={setDialog}
                      scrollDriven
                    />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="scroll-partnership"
                  style={{
                    opacity: reduced
                      ? moment === 9
                        ? 1
                        : 0
                      : partnershipOpacity,
                  }}
                  aria-hidden={moment !== 9}
                >
                  <PlotLogo />
                  <span>×</span>
                  <LinqLogo />
                </motion.div>
              </div>
            </div>
          </div>
        </main>
        <footer className="scroll-footer">
          <span>
            {moment === 9 ? (
              <button onClick={() => seek(0)}>Back to the start</button>
            ) : (
              <span aria-hidden="true">
                <ArrowDown size={13} /> Keep scrolling
              </span>
            )}
          </span>
          <button onClick={() => setDialog("about")}>About this demo</button>
        </footer>
        <motion.div
          className="scroll-progress"
          style={{ scaleX: scrollYProgress }}
          aria-hidden="true"
        />
        {dialog && (
          <Modal
            preserveScroll
            title={
              dialog === "pilot"
                ? "Let’s put your assistant in iMessage."
                : dialog === "about"
                  ? "About this demo"
                  : ATTACHMENTS[dialog].title
            }
            onClose={() => setDialog(null)}
          >
            {dialog === "pilot" ? (
              <>
                <div className="partnership small">
                  <PlotLogo />
                  <span>×</span>
                  <LinqLogo />
                </div>
                <p>
                  Start with one customer workflow. Bring your existing agent;
                  work with Linq on the messaging experience. Then test a small
                  pilot with your customers.
                </p>
                <p className="disclosure">
                  Pilot booking is not connected in this demo.
                </p>
                <button
                  className="button primary"
                  onClick={() => setDialog(null)}
                >
                  Back to the demo
                </button>
              </>
            ) : dialog === "about" ? (
              <>
                <p>
                  This alternate walkthrough follows your scroll position.
                  Scroll backward to rewind it. The original click-through
                  version is still available from the header.
                </p>
                <p>
                  Plot Twist Travel, Alex, the airport and flights are
                  fictional. Traveler messages are prepared and revealed by
                  scrolling. The number is illustrative. No messages, calls,
                  bookings or meeting requests are sent.
                </p>
                <p>
                  Alex uses locally generated Kokoro narration. Sound starts
                  only when you choose Listen to the call, and stops when you
                  leave that part of the story. Real voice products may offer
                  written follow-up.
                </p>
                <p>
                  The flight and map images are screenshots of a purpose-built
                  sample travel website. The map opens its matching fictional
                  route, with directions and zoom.
                </p>
              </>
            ) : (
              <img
                className="expanded-image"
                src={ATTACHMENTS[dialog].src}
                alt={ATTACHMENTS[dialog].alt}
              />
            )}
          </Modal>
        )}
      </div>
    </MotionConfig>
  );
}
