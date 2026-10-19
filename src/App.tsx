import { useEffect, useReducer, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  Accessibility,
  Archive,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  Grid2X2,
  Inbox,
  Mail,
  MessageCircle,
  MicOff,
  MoreHorizontal,
  Phone,
  Plus,
  RotateCcw,
  Signal,
  Star,
  UserRound,
  Video,
  Volume2,
  VolumeX,
  Wifi,
  X,
} from "lucide-react";
import { LinqLogo, PlotLogo } from "./Brands";
import {
  ATTACHMENTS,
  BRAND,
  STORY,
  MESSAGE_STEPS,
  timeLabel,
  TRIP,
} from "./scenario";
import type { Attachment, MessageStep } from "./scenario";
import { initialState, reducer } from "./state";
import type { DemoState, Screen } from "./state";
import { MessagePlayback, VoicePlayback } from "./playback";
import type { NarrationClips } from "./playback";
import narration from "./data/narration.json";
import { track } from "./telemetry";
import { FeatureNote } from "./FeatureNote";

const CLIPS = narration.clips as NarrationClips;
const HAS_AUDIO = STORY.every((beat) => CLIPS[beat.id]);
export function Avatar({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className="avatar" aria-hidden="true">
      {hidden ? <UserRound size={22} /> : <img src={BRAND.avatar} alt="" />}
    </span>
  );
}
export function StatusBar({ clock }: { clock: number }) {
  return (
    <div className="phone-status" aria-hidden="true">
      <span>{timeLabel(clock)}</span>
      <span className="island" />
      <span className="phone-signals">
        <Signal size={12} />
        <Wifi size={13} />
        <i />
      </span>
    </div>
  );
}
function Campaign({
  onExample,
  onSkip,
}: {
  onExample(): void;
  onSkip(): void;
}) {
  return (
    <section className="campaign">
      <div className="campaign-hero">
        <div className="campaign-copy">
          <h1 tabIndex={-1}>
            Let them try it first.
            <br />
            Win the meeting.
          </h1>
          <p>
            We email qualified voice-AI builders a personalized demo number, so
            they can try a customer workflow in iMessage before we ask for a
            meeting.
          </p>
          <p className="campaign-context">
            AI builds a lightweight demo for each company, selected for product
            fit and public signals.
          </p>
          <div className="campaign-actions">
            <button className="button primary" onClick={onExample}>
              See the example
            </button>
            <button className="button secondary" onClick={onSkip}>
              Try the demo
            </button>
          </div>
        </div>
        <figure
          className="hero-preview"
          aria-label="Plot Twist Travel’s AI assistant sharing flight results in iMessage"
        >
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
              alt="Sample flight-search results shared by Alex in Messages."
            />
          </div>
          <span className="preview-home" aria-hidden="true" />
        </figure>
      </div>
      <ol className="campaign-flow" aria-label="How the campaign works">
        <li>
          <span>1.</span> Build their demo
        </li>
        <li>
          <span>2.</span> Email their number
        </li>
        <li>
          <span>3.</span> Earn a meeting
        </li>
      </ol>
    </section>
  );
}

export function Invitation({ onContinue }: { onContinue(): void }) {
  return (
    <section className="invitation">
      <div className="email-role-intro">
        <h1
          tabIndex={-1}
          aria-label="You’re the lead developer at Plot Twist Travel."
        >
          <span>You’re the lead developer at</span>
          <PlotLogo compact />
        </h1>
      </div>
      <div className="email-client">
        <div className="email-toolbar" aria-hidden="true">
          <span className="mail-client-label">
            <Mail size={18} /> Mail
          </span>
          <ChevronLeft size={17} />
          <Archive size={16} />
          <MoreHorizontal size={20} />
          <span className="toolbar-filler" />
          <span>1 of 1</span>
        </div>
        <div className="email-client-body">
          <aside className="email-sidebar" aria-hidden="true">
            <span className="inbox-active">
              <Inbox size={15} /> Inbox <b>1</b>
            </span>
            <span>
              <Star size={15} /> Starred
            </span>
            <span>
              <Mail size={15} /> Sent
            </span>
          </aside>
          <article className="email-message">
            <div className="email-subject">
              <h2>A textable version of your travel assistant</h2>
              <span>Inbox</span>
            </div>
            <div className="email-sender">
              <div className="sender-logo">
                <LinqLogo />
              </div>
              <div>
                <strong>
                  Linq team <small>&lt;hello@linq.example&gt;</small>
                </strong>
                <span>to Plot Twist team</span>
              </div>
              <small>9:41 AM</small>
            </div>
            <div className="email-body">
              <p>Hi Plot Twist team,</p>
              <p>
                Your assistant already helps travelers by phone. We made a small
                iMessage demo of a canceled-flight workflow for Plot Twist,
                including directions a traveler can keep handy.
              </p>
              <img
                className="email-preview"
                src="./demo/email-preview.png"
                alt="Illustrative Plot Twist message preview: a traveler asks about a canceled flight, Alex replies with two options."
              />
              <p>
                Text <strong>{TRIP.keyword}</strong> to{" "}
                <strong className="display-number">{TRIP.demoNumber}</strong>{" "}
                and try it as your customer.
              </p>
              <button className="button email-cta" onClick={onContinue}>
                Try your customer’s experience <ArrowUpRight size={19} />
              </button>
              <p className="email-signoff">The Linq team</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
function Handoff({ onContinue }: { onContinue(): void }) {
  return (
    <section className="handoff">
      <p className="role-bridge">
        You opened the email as Plot Twist’s developer.
      </p>
      <h1 tabIndex={-1}>
        Now be the customer
        <br />
        who needs your assistant.
      </h1>
      <p className="traveler-situation">
        Imagine you’re at the airport. Your flight just got canceled. You and{" "}
        <strong>Pickles, your dog,</strong> need a way home tonight.
      </p>
      <div className="meet-alex">
        <Avatar />
        <span>
          <strong>Alex is your AI travel assistant.</strong>
        </span>
      </div>
      <button className="button plum journey-cta" onClick={onContinue}>
        Start as the traveler <ArrowRight size={20} />
      </button>
      <p className="handoff-note">
        First, hear Alex by phone. Then try the same task in iMessage.
      </p>
    </section>
  );
}
function VoicePhone({
  state,
  keepCaptions,
  muted,
  onMute,
  onStart,
  onEnd,
  onMessages,
  audioUnavailable,
}: {
  state: DemoState;
  keepCaptions: boolean;
  muted: boolean;
  onMute(): void;
  onStart(): void;
  onEnd(): void;
  onMessages(): void;
  audioUnavailable: boolean;
}) {
  const running = state.voiceStatus === "running";
  return (
    <div className="phone voice-phone">
      <StatusBar clock={STORY[state.voiceBeat].clock} />
      <div className="call-person">
        <Avatar />
        <h2>Alex</h2>
        <p>Plot Twist Travel</p>
        <span>AI travel assistant</span>
      </div>
      <div className="call-content">
        <div
          className={`waveform ${running && state.speaker === "alex" ? "speaking" : ""}`}
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
        <div
          className={`call-captions ${keepCaptions ? "persistent" : ""}`}
          aria-live="off"
          tabIndex={keepCaptions ? 0 : undefined}
          aria-label="Voice captions"
        >
          {keepCaptions && state.transcript.length ? (
            state.transcript.map((text, i) => <p key={i}>{text}</p>)
          ) : running ? (
            <>
              <small>
                {state.speaker === "you"
                  ? "YOU · THE TRAVELER"
                  : "ALEX · AI ASSISTANT"}
              </small>
              <p key={state.caption}>{state.caption}</p>
            </>
          ) : state.voiceStatus === "done" ? (
            <>
              <small>CALL COMPLETE</small>
              <p>
                A way home.
                <br />A gate to remember.
              </p>
            </>
          ) : (
            <>
              <small>YOU ASK</small>
              <p>“{STORY[0].caller}”</p>
            </>
          )}
        </div>
        {audioUnavailable && (
          <span className="audio-status">Audio unavailable · captions on</span>
        )}
      </div>
      <div className="call-bottom">
        {running ? (
          <>
            <div className="call-tools" aria-hidden="true">
              <span>
                <MicOff size={21} />
                <small>mute</small>
              </span>
              <span>
                <Grid2X2 size={21} />
                <small>keypad</small>
              </span>
              <span>
                <Volume2 size={21} />
                <small>speaker</small>
              </span>
            </div>
            <button
              className="call-circle end-call"
              onClick={onEnd}
              aria-label="End voice example"
            >
              <Phone size={23} fill="currentColor" />
            </button>
          </>
        ) : state.voiceStatus === "ready" ? (
          <button className="start-call" onClick={onStart}>
            <span className="call-circle">
              <Phone size={25} fill="currentColor" />
            </span>
            Start voice example
          </button>
        ) : (
          <button className="button call-next" onClick={onMessages}>
            Now try iMessage <ArrowRight size={19} />
          </button>
        )}
      </div>
      <button
        className="call-mute"
        onClick={onMute}
        aria-label={muted ? "Unmute narration" : "Mute narration"}
        aria-pressed={muted}
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
      <span className="home-indicator" />
    </div>
  );
}
export function MessagePhone({
  state,
  onSend,
  onAttachment,
  scrollDriven = false,
}: {
  state: DemoState;
  onSend(): void;
  onAttachment(attachment: Attachment): void;
  scrollDriven?: boolean;
}) {
  const thread = useRef<HTMLDivElement>(null);
  const follow = useRef(true);
  const userScrolling = useRef(false);
  const [away, setAway] = useState(false);
  const lastUser = state.messages.map((m) => m.role).lastIndexOf("user");
  useEffect(() => {
    if (follow.current && thread.current)
      thread.current.scrollTop = thread.current.scrollHeight;
  }, [state.messages, state.typing, state.sharedIdentity]);
  useEffect(() => {
    const node = thread.current;
    if (!node) return;
    const observer = new ResizeObserver(() => {
      if (follow.current) node.scrollTop = node.scrollHeight;
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const identity = state.sharedIdentity;
  const clock = state.step >= 3 ? TRIP.updateMinutes : TRIP.startMinutes;
  return (
    <div className="phone message-phone">
      <StatusBar clock={clock} />
      <div className="messages-contact">
        <ChevronLeft className="contact-back" size={26} aria-hidden="true" />
        <div>
          <Avatar hidden={!identity} />
          <h2>
            {identity ? "Alex" : TRIP.demoNumber}
            <ChevronRight size={9} />
          </h2>
          <span>{identity ? "Plot Twist · AI assistant" : "iMessage"}</span>
        </div>
        <Video className="contact-video" size={24} aria-hidden="true" />
      </div>
      <div
        className="message-thread"
        ref={thread}
        role="log"
        aria-label="iMessage conversation"
        aria-live={scrollDriven ? "off" : "polite"}
        aria-relevant="additions"
        tabIndex={scrollDriven ? undefined : 0}
        onWheel={() => {
          if (scrollDriven) return;
          userScrolling.current = true;
        }}
        onTouchMove={() => {
          if (scrollDriven) return;
          userScrolling.current = true;
        }}
        onPointerDown={(event) => {
          if (scrollDriven) return;
          if (event.target === thread.current) userScrolling.current = true;
        }}
        onScroll={() => {
          if (!userScrolling.current) return;
          const node = thread.current!;
          const up =
            node.scrollHeight - node.scrollTop - node.clientHeight > 60;
          follow.current = !up;
          setAway(up);
          if (!up) userScrolling.current = false;
        }}
      >
        <div className="thread-time">
          iMessage
          <br />
          <strong>Today {timeLabel(TRIP.startMinutes)} PM</strong>
        </div>
        {state.messages.length === 0 && (
          <div className="empty-thread">
            <MessageCircle size={24} />
            <p>Start by texting “{TRIP.keyword.toLowerCase()}”.</p>
            <small>
              {scrollDriven
                ? "Scroll to meet Alex."
                : "Alex will introduce himself. Tap Send."}
            </small>
          </div>
        )}
        {state.messages.map((message, index) => (
          <div className={`message-group ${message.role}`} key={message.id}>
            {message.beat === 3 && message.role === "user" && (
              <div className="time-jump">
                Eight minutes later · {timeLabel(TRIP.updateMinutes)} PM
              </div>
            )}
            <div
              className={`bubble ${message.role === "user" ? "outgoing" : "incoming"}`}
            >
              {message.text}
              {message.reaction && (
                <span
                  className="tapback"
                  aria-label={`Alex reacted ${message.reaction}`}
                >
                  {message.reaction}
                </span>
              )}
            </div>
            {message.role === "user" && index === lastUser && (
              <span className="read-marker">
                {message.read ? "Read" : "Delivered"}
              </span>
            )}
            {message.id.endsWith("reply-0") &&
              message.beat === 0 &&
              state.sharedIdentity && (
                <div className="contact-offer">
                  <Avatar />
                  <span>
                    <strong>Alex shared a name and photo</strong>
                    <small>Plot Twist Travel · AI assistant</small>
                  </span>
                  <Check size={13} aria-label="Contact shown automatically" />
                </div>
              )}
            {message.attachment &&
              (() => {
                const attachment = message.attachment;
                const image = (
                  <img
                    src={ATTACHMENTS[attachment].src}
                    alt={ATTACHMENTS[attachment].alt}
                    onLoad={() => {
                      if (follow.current && thread.current)
                        thread.current.scrollTop = thread.current.scrollHeight;
                    }}
                  />
                );
                return attachment === "map" ? (
                  <a
                    className="image-attachment"
                    href="./travel-preview.html?view=map"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open walking route to ${TRIP.selected.gate}`}
                  >
                    {image}
                    <span>
                      <ArrowUpRight size={12} /> Open walking route
                    </span>
                  </a>
                ) : (
                  <button
                    className="image-attachment"
                    onClick={() => onAttachment(attachment)}
                    aria-label={`Enlarge ${ATTACHMENTS[attachment].title}`}
                  >
                    {image}
                    <span>
                      <Expand size={12} /> View image
                    </span>
                  </button>
                );
              })()}
          </div>
        ))}
        {state.typing && (
          <span className="typing" aria-label="Alex is typing">
            <i />
            <i />
            <i />
          </span>
        )}
      </div>
      {away && (
        <button
          className="latest"
          onClick={() => {
            follow.current = true;
            userScrolling.current = false;
            setAway(false);
            thread.current?.scrollTo({
              top: thread.current.scrollHeight,
              behavior: "smooth",
            });
          }}
        >
          Latest message <ArrowUp size={11} className="down-arrow" />
        </button>
      )}
      <div className="composer">
        <Plus size={24} aria-hidden="true" />
        {state.step < MESSAGE_STEPS.length ? (
          <>
            <textarea
              aria-label="Prepared traveler message"
              rows={2}
              readOnly
              value={state.busy ? "" : MESSAGE_STEPS[state.step].draft}
              placeholder={state.busy ? "Alex is replying…" : "iMessage"}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  follow.current = true;
                  userScrolling.current = false;
                  setAway(false);
                  onSend();
                }
              }}
            />
            <button
              className="send"
              onClick={() => {
                follow.current = true;
                userScrolling.current = false;
                setAway(false);
                onSend();
              }}
              disabled={state.busy}
              aria-label="Send message"
            >
              <ArrowUp size={21} />
            </button>
          </>
        ) : (
          <span className="composer-complete">
            <Check size={14} /> Your updated plan stays here.
          </span>
        )}
      </div>
      <span className="home-indicator" />
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
  preserveScroll = false,
}: {
  title: string;
  children: ReactNode;
  onClose(): void;
  preserveScroll?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") close.current();
      if (event.key !== "Tab") return;
      const nodes = ref.current?.querySelectorAll<HTMLElement>(
        'button,a[href],[tabindex="0"]',
      );
      if (!nodes?.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === ref.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === ref.current)
      ) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus({ preventScroll: preserveScroll });
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export default function App() {
  const [state, dispatch] = useReducer(
    reducer,
    location.hash.startsWith("#/preview") ? "email" : "campaign",
    initialState,
  );
  const [dialog, setDialog] = useState<
    Attachment | "cta" | "about" | "accessibility" | null
  >(null);
  const [muted, setMuted] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(!HAS_AUDIO);
  const [keepCaptions, setKeepCaptions] = useState(() => {
    try {
      return sessionStorage.getItem("plot-twist-captions") === "true";
    } catch {
      return false;
    }
  });
  const audioNode = useRef<HTMLAudioElement>(null);
  const voice = useRef(
    new VoicePlayback((src) => {
      const node = audioNode.current ?? new Audio();
      node.src = src;
      node.load();
      return node;
    }),
  );
  const chat = useRef(new MessagePlayback());
  const run = useRef(0);
  const locked = useRef(false);
  const page = useRef<HTMLElement>(null);
  const fast =
    import.meta.env.DEV &&
    new URLSearchParams(location.search).get("qa") === "1";
  const experience = state.screen === "voice" || state.screen === "messages";
  const traveler = experience || state.screen === "handoff";
  useEffect(
    () => () => {
      voice.current.cancel();
      chat.current.cancel();
    },
    [],
  );
  useEffect(() => {
    page.current
      ?.querySelector<HTMLElement>("h1")
      ?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [state.screen]);
  function stop() {
    voice.current.cancel();
    chat.current.cancel();
    const node = audioNode.current;
    if (node) {
      node.pause();
      node.currentTime = 0;
    }
    locked.current = false;
  }
  function go(screen: Screen) {
    stop();
    dispatch({ type: "navigate", screen, run: ++run.current });
    history.replaceState(
      null,
      "",
      `${location.pathname}${location.search}${screen === "email" ? "#/preview" : "#/"}`,
    );
    track("screen_viewed", { screen });
  }
  function reset() {
    stop();
    dispatch({ type: "reset", run: ++run.current });
    history.replaceState(null, "", `${location.pathname}${location.search}#/`);
  }
  function send() {
    if (
      locked.current ||
      state.busy ||
      state.screen !== "messages" ||
      state.step >= MESSAGE_STEPS.length
    )
      return;
    locked.current = true;
    const id = ++run.current;
    dispatch({ type: "send", run: id });
    track("prepared_message_sent", { beat: state.step + 1 });
    void chat.current.play(
      state.step as MessageStep,
      {
        onRead: () => dispatch({ type: "read", run: id }),
        onReaction: () => dispatch({ type: "reaction", run: id }),
        onTyping: (value) => dispatch({ type: "typing", run: id, value }),
        onReply: (index) => dispatch({ type: "reply", run: id, index }),
        onShare: () => dispatch({ type: "share", run: id }),
        onFinish: () => {
          locked.current = false;
          dispatch({ type: "finish", run: id });
        },
      },
      fast ? 0.02 : 1,
    );
  }
  function startVoice() {
    if (state.voiceStatus === "running") return;
    stop();
    const id = ++run.current;
    dispatch({ type: "voice-start", run: id });
    voice.current.setMuted(muted);
    void voice.current.play(
      fast ? {} : CLIPS,
      {
        onCue: (beat, text, speaker) =>
          dispatch({ type: "cue", run: id, beat, text, speaker }),
        onAudioUnavailable: () => setAudioUnavailable(true),
        onFinish: () => dispatch({ type: "voice-finish", run: id }),
      },
      fast ? 0.02 : 1,
    );
    track("voice_started");
  }
  function endVoice() {
    stop();
    dispatch({ type: "voice-finish", run: state.run });
  }
  function toggleMute() {
    voice.current.setMuted(!muted);
    setMuted(!muted);
  }
  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`site ${traveler ? "traveler" : state.screen === "email" || state.screen === "complete" ? "developer" : ""} ${experience ? "experience-site" : ""}`}
      >
        <audio ref={audioNode} preload="metadata" aria-hidden="true" />
        <header className="site-header">
          <button
            className="wordmark"
            onClick={reset}
            aria-label="Return to introduction"
          >
            {traveler ? <PlotLogo compact /> : <LinqLogo />}
          </button>
          {state.screen !== "campaign" && (
            <button className="restart" onClick={reset}>
              <RotateCcw size={13} />
              <span>Restart walkthrough</span>
            </button>
          )}
        </header>
        <main ref={page} className={experience ? "experience-main" : ""}>
          <AnimatePresence mode="wait">
            <motion.div
              key={experience ? "experience" : state.screen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onAnimationComplete={() =>
                page.current
                  ?.querySelector<HTMLElement>("h1")
                  ?.focus({ preventScroll: true })
              }
              className={experience ? "experience-shell" : ""}
            >
              {state.screen === "campaign" && (
                <Campaign
                  onExample={() => go("email")}
                  onSkip={() => go("handoff")}
                />
              )}
              {state.screen === "email" && (
                <Invitation onContinue={() => go("handoff")} />
              )}
              {state.screen === "handoff" && (
                <Handoff onContinue={() => go("voice")} />
              )}
              {experience && (
                <section className="experience">
                  <div className="experience-heading">
                    <div>
                      <h1 tabIndex={-1}>
                        {state.screen === "voice"
                          ? "Call Alex for help"
                          : "Text Alex in iMessage"}
                      </h1>
                      {state.screen === "messages" ? (
                        <span className="powered">
                          Powered by <LinqLogo />
                        </span>
                      ) : (
                        <p>
                          {STORY[state.voiceBeat].label}
                          {state.voiceBeat === 2
                            ? ` · ${timeLabel(TRIP.updateMinutes)} PM`
                            : ""}
                        </p>
                      )}
                    </div>
                    <div
                      className="channel-switch"
                      role="group"
                      aria-label="Compare channels"
                    >
                      <button
                        aria-pressed={state.screen === "voice"}
                        onClick={() => go("voice")}
                      >
                        <Phone size={16} /> Voice
                      </button>
                      <button
                        aria-pressed={state.screen === "messages"}
                        onClick={() => go("messages")}
                      >
                        <MessageCircle size={16} /> iMessage
                      </button>
                    </div>
                  </div>
                  <div className="phone-stage">
                    {state.screen === "voice" ? (
                      <VoicePhone
                        state={state}
                        keepCaptions={keepCaptions}
                        muted={muted}
                        onMute={toggleMute}
                        onStart={startVoice}
                        onEnd={endVoice}
                        onMessages={() => go("messages")}
                        audioUnavailable={audioUnavailable}
                      />
                    ) : (
                      <MessagePhone
                        state={state}
                        onSend={send}
                        onAttachment={setDialog}
                      />
                    )}
                    {state.screen === "messages" && (
                      <FeatureNote messages={state.messages} />
                    )}
                  </div>
                  <div className="experience-next">
                    {state.screen === "voice" &&
                    state.voiceStatus !== "done" ? (
                      <button
                        className="button plum next-channel"
                        onClick={() => go("messages")}
                      >
                        Now try iMessage <ArrowRight size={18} />
                      </button>
                    ) : state.screen === "messages" &&
                      state.step >= MESSAGE_STEPS.length ? (
                      <button
                        className="button plum compact"
                        onClick={() => go("complete")}
                      >
                        See this for your product <ArrowRight size={18} />
                      </button>
                    ) : null}
                  </div>
                </section>
              )}
              {state.screen === "complete" && (
                <section className="completion">
                  <h1 tabIndex={-1}>
                    Give your voice agent a place in iMessage.
                  </h1>
                  <div className="partnership">
                    <PlotLogo />
                    <span>×</span>
                    <LinqLogo />
                  </div>
                  <p>
                    Your customers already text. Put your assistant in the
                    conversation, with the photos, plans, and directions they
                    need to act.
                  </p>
                  <button
                    className="button plum"
                    onClick={() => {
                      track("cta_clicked");
                      setDialog("cta");
                    }}
                  >
                    Build your iMessage pilot
                  </button>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="site-footer">
          <div>
            <button onClick={() => setDialog("about")}>About this demo</button>
            <button
              onClick={() => setDialog("accessibility")}
              aria-label="Accessibility options"
            >
              <Accessibility size={14} />
              <span>Accessibility</span>
            </button>
          </div>
        </footer>
        {fast && (
          <span className="qa-indicator">Local QA · accelerated playback</span>
        )}
        {dialog && (
          <Modal
            title={
              dialog === "cta"
                ? "Let’s put your assistant in iMessage."
                : dialog === "about"
                  ? "About this demo"
                  : dialog === "accessibility"
                    ? "Accessibility"
                    : ATTACHMENTS[dialog].title
            }
            onClose={() => setDialog(null)}
          >
            {dialog === "cta" ? (
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
                <button className="button plum" onClick={() => setDialog(null)}>
                  Back to the demo
                </button>
              </>
            ) : dialog === "about" ? (
              <>
                <p>
                  The proposed campaign sends qualified voice-AI builders a
                  personalized invitation, a visual, and a real provisioned
                  number to text. This website shows Nate how that campaign
                  could work.
                </p>
                <p>
                  Plot Twist Travel, Alex, the airport and flights are
                  fictional. Alex’s narration uses a locally generated Kokoro
                  stock voice. Traveler replies are prepared for this
                  walkthrough. The displayed number is illustrative. No
                  messages, calls, bookings, or meeting requests are sent.
                </p>
                <p>
                  Flight results and maps are screenshots of purpose-built
                  sample travel pages, not live provider data or native booking
                  widgets. The route opens an interactive fictional airport
                  preview. Alex’s name and photo appear automatically in this
                  walkthrough. Live contact sharing and read receipts depend on
                  platform behavior and recipient settings.
                </p>
                <p>
                  Voice and texting use the same facts. Real voice products may
                  offer written follow-up. Demo events stay in this browser’s
                  memory.
                </p>
              </>
            ) : dialog === "accessibility" ? (
              <>
                <label className="caption-option">
                  <input
                    type="checkbox"
                    checked={keepCaptions}
                    onChange={(event) => {
                      setKeepCaptions(event.target.checked);
                      try {
                        sessionStorage.setItem(
                          "plot-twist-captions",
                          String(event.target.checked),
                        );
                      } catch {
                        /* Preference is optional. */
                      }
                    }}
                  />
                  <span>
                    <strong>Keep voice captions visible</strong>
                    <small>
                      Retain the call’s spoken text in its caption area.
                    </small>
                  </span>
                </label>
                <p>
                  Keyboard controls, image descriptions, a screen-reader message
                  log, and your device’s reduced-motion preference are
                  supported.
                </p>
              </>
            ) : (
              <>
                <img
                  className="expanded-image"
                  src={ATTACHMENTS[dialog].src}
                  alt={ATTACHMENTS[dialog].alt}
                />
                {dialog === "map" && (
                  <a
                    className="button plum route-link"
                    href="./travel-preview.html?view=map"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open walking route <ArrowUpRight size={18} />
                  </a>
                )}
              </>
            )}
          </Modal>
        )}
      </div>
    </MotionConfig>
  );
}
