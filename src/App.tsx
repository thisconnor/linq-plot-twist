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
import { ATTACHMENTS, BRAND, STORY, timeLabel, TRIP } from "./scenario";
import type { Attachment, Beat } from "./scenario";
import { initialState, reducer } from "./state";
import type { DemoState, Screen } from "./state";
import { MessagePlayback, VoicePlayback } from "./playback";
import type { NarrationClips } from "./playback";
import narration from "./data/narration.json";
import { track } from "./telemetry";
import { FeatureNote } from "./FeatureNote";

const CLIPS = narration.clips as NarrationClips;
const HAS_AUDIO = STORY.every((beat) => CLIPS[beat.id]);
function Avatar({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className="avatar" aria-hidden="true">
      {hidden ? <UserRound size={22} /> : <img src={BRAND.avatar} alt="" />}
    </span>
  );
}
function StatusBar({ clock }: { clock: number }) {
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
      <div className="campaign-copy">
        <span className="eyebrow">THE GROWTH EXPERIMENT</span>
        <h1 tabIndex={-1}>
          Win the meeting.
          <br />
          <span>Let them try it first.</span>
        </h1>
        <p>
          We email qualified voice-AI builders a personalized demo number, so
          they can try a customer workflow in iMessage before we ask for a
          meeting.
        </p>
        <div className="campaign-actions">
          <button className="button primary" onClick={onExample}>
            See the example <ArrowRight size={17} />
          </button>
          <button className="text-button" onClick={onSkip}>
            Skip to the experience
          </button>
        </div>
        <p className="qualification">
          Selected profiles. Public signals. A lightweight demo built with AI
          for each company before outreach.
        </p>
      </div>
      <div
        className="campaign-visual"
        aria-label="Proposed campaign: email a personalized number, try the assistant in Messages, then discuss fit"
      >
        <div className="visual-email">
          <div className="visual-email-top">
            <Mail size={16} />
            <span>FROM LINQ</span>
          </div>
          <strong>
            We made this for
            <br />
            Plot Twist Travel.
          </strong>
          <p>
            Text HOME. Try your assistant
            <br />
            as your customer.
          </p>
          <span className="visual-number">{TRIP.demoNumber}</span>
        </div>
        <div className="visual-connector">
          <span />
          <ArrowRight size={16} />
          <span />
        </div>
        <div className="mini-messages">
          <div className="mini-contact">
            <span className="mini-avatar">
              <img src={BRAND.avatar} alt="" />
            </span>
            <strong>Alex</strong>
            <small>AI travel assistant</small>
          </div>
          <div className="mini-thread">
            <span className="mini-blue">
              My flight was canceled.
              <br />
              Can you help?
            </span>
            <span className="mini-gray">Let’s get you home.</span>
            <div className="mini-flight">
              <span>{TRIP.selected.flight} · NONSTOP</span>
              <strong>
                {timeLabel(TRIP.selected.departure)} <small>PM</small>
              </strong>
              <span>Home tonight · {timeLabel(TRIP.selected.arrival)} PM</span>
            </div>
          </div>
        </div>
        <div className="visual-summary">
          <span>1. Personalized email</span>
          <span>2. Text the number</span>
          <span>3. Discuss the fit</span>
        </div>
        <small className="visual-disclosure">
          Example company and number. This website simulates the experience for
          Nate.
        </small>
      </div>
    </section>
  );
}
function Invitation({ onContinue }: { onContinue(): void }) {
  return (
    <section className="invitation">
      <div className="screen-intro">
        <span className="eyebrow">
          YOU’RE THE DEVELOPER AT PLOT TWIST TRAVEL
        </span>
        <h1 tabIndex={-1}>You build the assistant. We send you the demo.</h1>
        <p>
          You’re the developer behind Plot Twist Travel. Your voice assistant
          already helps customers by phone. This email invites you to try it in
          iMessage.
        </p>
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
              <span className="example-note">
                Example invitation · Illustrative number · Button opens this
                simulation
              </span>
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
          <small>You’re the traveler. Alex helps you make a new plan.</small>
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
        <span className="audio-status">
          {audioUnavailable
            ? "Caption preview · narration unavailable"
            : muted
              ? "Sound muted · captions on"
              : "Sound on · captions on"}
        </span>
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
function MessagePhone({
  state,
  onSend,
  onAttachment,
  onAcceptIdentity,
}: {
  state: DemoState;
  onSend(): void;
  onAttachment(attachment: Attachment): void;
  onAcceptIdentity(): void;
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
  const identity = state.identityAccepted;
  const clock = state.step >= 2 ? TRIP.updateMinutes : TRIP.startMinutes;
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
        aria-live="polite"
        aria-relevant="additions"
        tabIndex={0}
        onWheel={() => {
          userScrolling.current = true;
        }}
        onTouchMove={() => {
          userScrolling.current = true;
        }}
        onPointerDown={(event) => {
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
            <p>You’re the traveler. Text Alex for help.</p>
            <small>Your first message is ready. Tap Send.</small>
          </div>
        )}
        {state.messages.map((message, index) => (
          <div className={`message-group ${message.role}`} key={message.id}>
            {message.beat === 2 && message.role === "user" && (
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
                  {!identity && <button onClick={onAcceptIdentity}>Use</button>}
                  {identity && <Check size={13} />}
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
        {state.step < 3 ? (
          <>
            <textarea
              aria-label="Prepared traveler message"
              rows={2}
              readOnly
              value={state.busy ? "" : STORY[state.step].draft}
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
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose(): void;
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
      previous?.focus();
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
      state.step >= 3
    )
      return;
    locked.current = true;
    const id = ++run.current;
    dispatch({ type: "send", run: id });
    track("prepared_message_sent", { beat: state.step + 1 });
    void chat.current.play(
      state.step as Beat,
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
            {traveler || state.screen === "complete" ? (
              <PlotLogo compact />
            ) : (
              <LinqLogo />
            )}
          </button>
          <span className="header-context">
            {traveler
              ? "YOU’RE THE TRAVELER"
              : state.screen === "email" || state.screen === "complete"
                ? "YOU’RE THE DEVELOPER"
                : "A LINQ GROWTH EXPERIMENT"}
          </span>
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
                  <div className="traveler-role">
                    YOU ARE THE TRAVELER <span>·</span> ALEX IS THE AI ASSISTANT
                  </div>
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
                        onAcceptIdentity={() =>
                          dispatch({ type: "identity-accept", run: state.run })
                        }
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
                    ) : state.screen === "messages" && state.step >= 3 ? (
                      <button
                        className="button plum compact"
                        onClick={() => go("complete")}
                      >
                        See this for your product <ArrowRight size={18} />
                      </button>
                    ) : state.screen === "messages" ? (
                      <p>
                        Guided walkthrough: tap <strong>Send</strong> to
                        continue. Prepared messages are demo controls.
                      </p>
                    ) : (
                      <p>
                        Same assistant. Same facts. Now a different way to use
                        them.
                      </p>
                    )}
                  </div>
                </section>
              )}
              {state.screen === "complete" && (
                <section className="completion">
                  <span className="eyebrow">BACK IN THE DEVELOPER’S SHOES</span>
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
                    Build your iMessage pilot <ArrowUpRight size={19} />
                  </button>
                  <button className="text-button" onClick={reset}>
                    Restart walkthrough
                  </button>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="site-footer">
          <span>Interactive simulation · Fictional travel data</span>
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
                  Prototype preview: a live campaign would book a pilot
                  conversation here. This demo does not send a request.
                </p>
                <button className="button plum" onClick={() => setDialog(null)}>
                  Got it — back to the walkthrough <Check size={16} />
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
                  stock voice. The displayed number is illustrative. No
                  messages, calls, bookings, or meeting requests are sent.
                </p>
                <p>
                  Flight results and maps are screenshots of purpose-built
                  sample travel pages, not live provider data or native booking
                  widgets. The route opens an interactive fictional airport
                  preview. Contact sharing and read receipts depend on platform
                  behavior and recipient settings.
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
                <p className="image-description">{ATTACHMENTS[dialog].alt}</p>
              </>
            )}
          </Modal>
        )}
      </div>
    </MotionConfig>
  );
}
