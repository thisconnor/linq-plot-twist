import { useEffect, useReducer, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from 'motion/react';
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BatteryLow,
  Check,
  ChevronDown,
  ChevronLeft,
  Dog,
  Grid2X2,
  Mail,
  MapPin,
  MicOff,
  Phone,
  Plane,
  Plus,
  RotateCcw,
  Signal,
  Utensils,
  Video,
  Volume2,
  VolumeX,
  Wifi,
  X,
} from 'lucide-react';
import { AirportMap } from './AirportMap';
import { Playback } from './playback';
import {
  BRAND,
  CONSTRAINTS,
  getScenario,
  getTurn,
  timeLabel,
  TRIP,
} from './scenario';
import type { Constraint, FollowupId, Scenario, Turn } from './scenario';
import { initialState, reducer } from './state';
import type { DemoState, Stage } from './state';
import { track } from './telemetry';

const constraintIcons = { dog: Dog, battery: BatteryLow, food: Utensils };

function Avatar({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`avatar ${small ? 'avatar-small' : ''}`}
      aria-hidden="true"
    >
      <Plane strokeWidth={1.5} />
    </span>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 30 30">
        <path d="m15 3 11 6v12l-11 6-11-6V9l11-6Z M4 9l11 6 11-6 M15 15v12 M9 6l11 6v12" />
      </svg>
    </span>
  );
}

function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose(): void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') close.current();
      if (event.key !== 'Tab') return;
      const elements = ref.current?.querySelectorAll<HTMLElement>(
        'button, a[href], input, [tabindex="0"]',
      );
      if (!elements?.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
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
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', keydown);
      previous?.focus();
    };
  }, []);
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`modal ${wide ? 'modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={ref}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Intro({ onContinue }: { onContinue(): void }) {
  return (
    <div className="intro-layout">
      <div className="intro-copy">
        <div className="eyebrow">
          <span className="status-dot" /> THE FIRST EXECUTION ARTIFACT
        </div>
        <h1 tabIndex={-1}>
          A personalized preview before the <span>meeting ask.</span>
        </h1>
        <p className="intro-lead">
          Let a qualified prospect experience what their product could feel like
          in iMessage. Give them something useful to explore, then start the
          conversation.
        </p>
        <p className="intro-context">
          Plot Twist Travel is a fictional example. This take-home simulates the
          product experience; the validation below is proposed.
        </p>
        <div className="intro-actions">
          <button className="button button-primary" onClick={onContinue}>
            Try the prospect experience <ArrowRight size={17} />
          </button>
          <button className="text-button" onClick={onContinue}>
            Skip introduction <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
      <div
        className="intro-art"
        aria-label="Preview of a fictional travel assistant retaining your gate details"
      >
        <div className="art-heading">
          <span>THE PRODUCT, IN THEIR HANDS</span>
          <ArrowUpRight size={17} />
        </div>
        <div className="travel-ticket">
          <div className="ticket-brand">
            <Plane size={21} />
            <strong>
              plot twist<span>TRAVEL</span>
            </strong>
            <span className="ticket-flight">PT204</span>
          </div>
          <div className="ticket-route">
            <div>
              <small>PLANS CHANGED</small>
              <span>
                4:55 <ArrowRight size={25} /> <strong>6:20</strong>
              </span>
            </div>
            <Plane size={34} strokeWidth={1.1} />
          </div>
          <div className="ticket-bottom">
            <div>
              <small>NEW GATE</small>
              <strong>B12</strong>
            </div>
            <div>
              <small>BOARDING</small>
              <strong>
                5:50 <em>PM</em>
              </strong>
            </div>
            <div className="ticket-stamp">
              A little
              <br />
              plot twist.
            </div>
          </div>
          <div className="ticket-perforation" />
        </div>
        <div className="art-message">
          <div className="art-message-sender">
            <Avatar small />
            <div>
              <strong>{BRAND.assistant}</strong>
              <span>{BRAND.company} · AI assistant</span>
            </div>
            <span className="message-now">now</span>
          </div>
          <p>
            Your gate is B12. Boarding starts at 5:50.
            <br />
            Your route is here when you need it.
          </p>
          <div className="mini-route">
            <span className="mini-route-dot" /> You{' '}
            <span className="mini-route-line" />
            <span className="mini-route-gate">
              B12 <ArrowUpRight size={13} />
            </span>
          </div>
        </div>
        <div className="art-caption">
          <span className="tiny-cross">+</span> A useful first experience.
          <br />
          <span>Prepared before the first meeting.</span>
        </div>
      </div>
      <div className="process-strip">
        <div>
          <span>01</span>
          <section>
            <h2>Learn the product.</h2>
            <p>
              Find a concrete workflow in public product information, and a
              reason messaging might matter.
            </p>
          </section>
        </div>
        <div>
          <span>02</span>
          <section>
            <h2>Prepare and check a preview.</h2>
            <p>
              Adapt a reusable scenario. Review its relevance, facts, and fit
              before offering it.
            </p>
          </section>
        </div>
        <div>
          <span>03</span>
          <section>
            <h2>Offer a useful first experience.</h2>
            <p>
              Let the prospect try the idea before asking them to spend time in
              a meeting.
            </p>
          </section>
        </div>
      </div>
      <details className="validation">
        <summary>
          Proposed validation process <Plus size={17} />
        </summary>
        <div className="validation-content">
          <p>
            <strong>First, find the friction.</strong> If Linq can recruit
            willing customers, begin with about five usability testers. Aim for
            four of five to finish unassisted and explain the benefit. This
            feedback has not happened yet.
          </p>
          <p>
            <strong>Then, test production effort.</strong> Compare 5-, 10-, and
            15-minute adaptation and review budgets against the same quality
            checklist. Initial template development is a separate cost.
          </p>
          <p>
            <strong>Finally, test the invitation.</strong> Compare a
            personalized-preview invitation with a standard meeting invitation
            among comparable qualified accounts. Track qualified meetings and
            costs, with booked and held meetings separate. Small samples are
            directional.
          </p>
        </div>
      </details>
    </div>
  );
}

function Outreach({ onContinue }: { onContinue(): void }) {
  return (
    <div className="outreach-layout">
      <div className="context-copy">
        <div className="eyebrow">01 / THE INVITATION</div>
        <h1 tabIndex={-1}>
          Your product.
          <br />A new way to
          <br />
          <span>experience it.</span>
        </h1>
        <p>
          You’re a developer at <strong>Plot Twist Travel</strong>, building an
          AI travel assistant.
        </p>
        <p>
          You received this preview without connecting your product or supplying
          customer data. Next, step into the traveler’s shoes.
        </p>
        <div className="context-footnote">
          <Mail size={17} />
          <span>
            An example of the invitation a qualified prospect could receive.
          </span>
        </div>
      </div>
      <div className="email">
        <div className="email-topline">
          <span>IN YOUR INBOX</span>
          <Mail size={18} />
        </div>
        <div className="email-sender">
          <div className="email-avatar">
            <BrandMark />
          </div>
          <div>
            <strong>Linq team</strong>
            <span>To: Plot Twist Travel</span>
          </div>
          <span className="email-time">9:41 AM</span>
        </div>
        <div className="email-body">
          <h2>
            A travel disruption,
            <br />
            handled in iMessage
          </h2>
          <p>
            We put together a short preview of how a Plot Twist Travel assistant
            could help when a traveler’s plans change.
          </p>
          <p>
            Explore the example, then see whether this could fit your product.
          </p>
          <button className="button button-dark" onClick={onContinue}>
            Explore the preview <ArrowUpRight size={17} />
          </button>
          <div className="email-signoff">The Linq team</div>
        </div>
        <div className="email-bottom">
          <span className="status-dot" /> A BROWSER WALKTHROUGH · ABOUT 2
          MINUTES
        </div>
      </div>
    </div>
  );
}

function Choose({
  selected,
  onSelect,
  onStart,
}: {
  selected: Constraint[];
  onSelect(id: Constraint): void;
  onStart(): void;
}) {
  return (
    <div className="choose-layout">
      <div className="choose-heading">
        <div className="eyebrow">02 / YOU’RE THE TRAVELER NOW</div>
        <h1 tabIndex={-1}>
          Your flight changed.
          <br />
          <span>What else should your assistant know?</span>
        </h1>
        <p>
          Your departure moved from 4:55 to 6:20 PM, and your gate changed too.
          <br className="desktop-break" /> Add a little real life to the
          situation.
        </p>
      </div>
      <div className="selection-workbench">
        <div className="constraint-picker">
          <div className="picker-label">
            <span>SELECT ONE OR TWO</span>
            <span aria-live="polite">{selected.length} / 2 selected</span>
          </div>
          <div className="constraint-list">
            {CONSTRAINTS.map(({ id, title, detail }) => {
              const Icon = constraintIcons[id];
              const checked = selected.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  className={`constraint ${checked ? 'selected' : ''}`}
                  aria-pressed={checked}
                  disabled={selected.length === 2 && !checked}
                  onClick={() => onSelect(id)}
                >
                  <span className="constraint-icon">
                    <Icon size={23} strokeWidth={1.5} />
                  </span>
                  <span className="constraint-copy">
                    <strong>{title}</strong>
                    <span>{detail}</span>
                  </span>
                  <span className="checkbox">
                    {checked && <Check size={15} strokeWidth={2.5} />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="picker-bottom">
            <p>
              {selected.length === 2
                ? 'Two is plenty. Let’s make a plan.'
                : 'Choose what matters to you.'}
            </p>
            <button
              className="button button-primary"
              disabled={selected.length === 0}
              onClick={onStart}
            >
              Ask the assistant <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <div className="flight-board">
          <div className="flight-board-top">
            <Plane size={22} />
            <span>
              {TRIP.airline} · {TRIP.flight}
            </span>
            <span className="delayed-label">Delayed</span>
          </div>
          <div className="board-airport">HARBOR CITY AIRPORT</div>
          <div className="board-time">
            <span>{TRIP.originalDeparture}</span>
            <ArrowRight size={24} />
            <strong>{timeLabel(TRIP.departureMinutes)}</strong>
            <small>PM</small>
          </div>
          <div className="board-divider" />
          <div className="board-details">
            <div>
              <small>GATE UPDATE</small>
              <span>
                <s>{TRIP.oldGate}</s> <ArrowRight size={15} />{' '}
                <strong>{TRIP.gate}</strong>
              </span>
            </div>
            <div>
              <small>BOARDING</small>
              <strong>{timeLabel(TRIP.boardingMinutes)} PM</strong>
            </div>
          </div>
          <div className="board-location">
            <MapPin size={14} />
            <span>
              You’re in the Terminal 2 central concourse.
              <br />
              It’s 5:25 PM. There’s time to make a plan.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneStatus({ low = false }: { low?: boolean }) {
  return (
    <div className="phone-status" aria-hidden="true">
      <span>5:25</span>
      <span className="island" />
      <span className="status-icons">
        <Signal size={13} fill="currentColor" />
        <Wifi size={14} />
        <span className={`battery-symbol ${low ? 'battery-empty' : ''}`} />
      </span>
    </div>
  );
}

function VoicePhone({
  state,
  keepCaptions,
}: {
  state: DemoState;
  keepCaptions: boolean;
}) {
  const speaking = state.phase === 'responding' && !!state.current;
  return (
    <div className="phone voice-phone">
      <PhoneStatus low={state.selected.includes('battery')} />
      <div className="call-person">
        <Avatar />
        <h3>{BRAND.assistant}</h3>
        <p>{BRAND.company}</p>
        <span>AI travel assistant</span>
      </div>
      <div className="voice-middle">
        <div
          className={`waveform ${speaking ? 'speaking' : ''}`}
          aria-hidden="true"
        >
          {Array.from({ length: 27 }, (_, i) => (
            <i
              key={i}
              style={
                {
                  '--bar': `${8 + ((i * 17 + 9) % 35)}px`,
                  '--delay': `${i * -0.08}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div
          className={`call-captions ${keepCaptions ? 'persistent-captions' : ''}`}
          aria-hidden={!keepCaptions}
          tabIndex={keepCaptions ? 0 : undefined}
          aria-label={keepCaptions ? 'Visible voice captions' : undefined}
        >
          {keepCaptions ? (
            <div>
              {state.spoken.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
              {!state.spoken.length && (
                <p className="caption-placeholder">
                  Connecting your assistant…
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="previous-caption" key={state.previous}>{state.previous}</div>
              <p className="current-caption" key={state.current || 'empty'}>
                {state.current ||
                  (state.phase === 'responding' && !state.previous
                    ? 'Alex is listening…'
                    : '')}
              </p>
            </>
          )}
        </div>
        <div className="sr-only" aria-hidden={keepCaptions}>Spoken content: {state.spoken.join(' ')}</div>
      </div>
      <div className="call-bottom">
        <span className="call-state">
          <span />
          {state.stage === 'complete'
            ? 'Call complete'
            : speaking
              ? 'Alex is speaking'
              : state.phase === 'responding'
                ? 'Connected'
                : 'Your turn'}
        </span>
        <div className="call-controls" aria-hidden="true">
          <span>
            <MicOff size={18} />
            <small>mute</small>
          </span>
          <span>
            <Grid2X2 size={18} />
            <small>keypad</small>
          </span>
          <span>
            <Volume2 size={18} />
            <small>speaker</small>
          </span>
          <span>
            <Plus size={18} />
            <small>add call</small>
          </span>
          <span>
            <Video size={18} />
            <small>video</small>
          </span>
          <span>
            <span className="contact-glyph">○</span>
            <small>contacts</small>
          </span>
        </div>
        <span className="end-call" aria-hidden="true">
          <Phone size={24} fill="currentColor" />
        </span>
      </div>
    </div>
  );
}

function Itinerary({
  scenario,
  compact = false,
}: {
  scenario: Scenario;
  compact?: boolean;
}) {
  return (
    <div className={`itinerary ${compact ? 'itinerary-compact' : ''}`}>
      <div className="itinerary-heading">
        <Plane size={16} />
        <span>{TRIP.flight} · Your next step</span>
        <Check size={15} />
      </div>
      <div className="itinerary-facts">
        <div>
          <small>GATE</small>
          <strong>{TRIP.gate}</strong>
        </div>
        <div>
          <small>BOARDING</small>
          <strong>{timeLabel(TRIP.boardingMinutes)}</strong>
        </div>
        <div>
          <small>DEPARTURE</small>
          <strong>{timeLabel(TRIP.departureMinutes)}</strong>
        </div>
      </div>
      <p>
        {scenario.routeLabel} · Arrive around {scenario.arrival}
      </p>
    </div>
  );
}

function MessagePhone({ state, onMap }: { state: DemoState; onMap(): void }) {
  const scroll = useRef<HTMLDivElement>(null);
  const [scrolledUp, setScrolledUp] = useState(false);
  const follow = useRef(true);
  const userScrolling = useRef(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = scroll.current;
    if (!node) return;
    const observer = new ResizeObserver(() => {
      if (follow.current)
        node.scrollTo({ top: node.scrollHeight, behavior: 'auto' });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (follow.current && scroll.current)
      scroll.current.scrollTo({
        top: scroll.current.scrollHeight,
        behavior: reduced ? 'auto' : 'smooth',
      });
  }, [state.messages.length, state.showMap, state.phase, reduced]);
  const lastUser = state.messages
    .map((message) => message.role)
    .lastIndexOf('user');
  const secondAssistant = state.messages
    .map((message, index) => (message.role === 'assistant' ? index : -1))
    .filter((index) => index >= 0)[1];
  return (
    <div className="phone message-phone">
      <PhoneStatus low={state.selected.includes('battery')} />
      <div className="messages-person">
        <ChevronLeft className="messages-back" size={27} aria-hidden="true" />
        <Avatar small />
        <h3>
          {state.identityShared ? BRAND.assistant : 'New conversation'}{' '}
          <span>›</span>
        </h3>
        <p>{state.identityShared ? BRAND.company : 'AI travel assistant'}</p>
        <Video className="messages-video" size={22} aria-hidden="true" />
      </div>
      <div
        className="message-thread"
        ref={scroll}
        role="log"
        tabIndex={0}
        aria-label="iMessage conversation"
        aria-live="off"
        onWheel={() => {
          userScrolling.current = true;
        }}
        onTouchMove={() => {
          userScrolling.current = true;
        }}
        onPointerDown={(event) => {
          if (event.target === scroll.current) userScrolling.current = true;
        }}
        onScroll={() => {
          if (!userScrolling.current) return;
          const node = scroll.current!;
          const up =
            node.scrollHeight - node.scrollTop - node.clientHeight > 95;
          follow.current = !up;
          setScrolledUp(up);
          if (!up) userScrolling.current = false;
        }}
      >
        <div className="thread-time">
          iMessage
          <br />
          <strong>Today 5:25 PM</strong>
        </div>
        {state.messages.map((message, index) => (
          <div key={message.id} className="message-group">
            <motion.div
              className={`bubble ${message.role === 'user' ? 'outgoing' : 'incoming'}`}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {message.text}
              {message.reaction && (
                <span
                  className="tapback"
                  aria-label="You acknowledged this plan with a thumbs-up"
                >
                  👍
                </span>
              )}
            </motion.div>
            {message.role === 'user' && index === lastUser && (
              <div className="read-marker">
                {state.read ? 'Read 5:25 PM' : 'Delivered'}
              </div>
            )}
            {state.showContact && index === 1 && (
              <div className="contact-shared">
                <Avatar small />
                <span>
                  <strong>{BRAND.assistant} shared a name and photo</strong>
                  <span>{BRAND.company} · AI assistant</span>
                </span>
                <Check size={13} />
              </div>
            )}
            {state.showMap && index === secondAssistant && state.scenario && (
              <AirportMap scenario={state.scenario} onOpen={onMap} />
            )}
          </div>
        ))}
        {state.typing && (
          <div className="typing-bubble" aria-label="Alex is typing">
            <i />
            <i />
            <i />
          </div>
        )}
        {state.stage === 'complete' && state.scenario && (
          <Itinerary scenario={state.scenario} compact />
        )}
      </div>
      {scrolledUp && (
        <button
          className="latest-message"
          onClick={() => {
            userScrolling.current = false;
            follow.current = true;
            setScrolledUp(false);
            scroll.current?.scrollTo({
              top: scroll.current.scrollHeight,
              behavior: 'smooth',
            });
          }}
        >
          Latest message <ChevronDown size={13} />
        </button>
      )}
      <div className="message-compose" aria-hidden="true">
        <span className="compose-plus">
          <Plus size={21} />
        </span>
        <span className="compose-field">
          iMessage <MicOff size={16} />
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(
    reducer,
    location.hash.startsWith('#/preview') ? 'outreach' : 'intro',
    initialState,
  );
  const [mode, setMode] = useState<'voice' | 'messages'>('messages');
  const [audio, setAudio] = useState(false);
  const [keepCaptions, setKeepCaptions] = useState(() => {
    try {
      return sessionStorage.getItem('plot-twist-captions') === 'true';
    } catch {
      return false;
    }
  });
  const [dialog, setDialog] = useState<'map' | 'cta' | null>(null);
  const playback = useRef(new Playback());
  const run = useRef(0);
  const locked = useRef(false);
  const audioRef = useRef(audio);
  audioRef.current = audio;
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const page = useRef<HTMLElement>(null);
  const fastPreview =
    import.meta.env.DEV &&
    new URLSearchParams(location.search).get('qa') === '1';
  useEffect(() => {
    track(
      state.stage === 'intro'
        ? 'reviewer_intro_viewed'
        : 'prospect_setup_started',
    );
    return () => {
      playback.current.cancel();
      clearTimeout(fadeTimer.current);
    };
  }, []);
  useEffect(() => {
    if (!['demo', 'complete'].includes(state.stage)) {
      page.current
        ?.querySelector<HTMLElement>('h1')
        ?.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    }
  }, [state.stage]);

  function go(stage: Stage) {
    locked.current = false;
    playback.current.cancel();
    clearTimeout(fadeTimer.current);
    dispatch({ type: 'reset', stage, run: ++run.current });
    if (stage === 'outreach') track('prospect_setup_started');
    if (stage === 'intro') track('reviewer_intro_viewed');
    history.replaceState(
      null,
      '',
      `${location.pathname}${location.search}${stage === 'outreach' ? '#/preview' : '#/'}`,
    );
  }

  function play(turn: Turn, followup: FollowupId = 'time') {
    if (locked.current) return;
    if (turn > 1 && (state.phase === 'responding' || state.turn !== turn - 1))
      return;
    const scenario = turn === 1 ? getScenario(state.selected) : state.scenario!;
    locked.current = true;
    const user =
      turn === 1
        ? scenario.initialMessage
        : turn === 2
          ? scenario.followups.find((item) => item.id === followup)!.label
          : 'That works. I’ll head over now.';
    const id = ++run.current;
    clearTimeout(fadeTimer.current);
    dispatch({ type: 'begin', run: id, turn, scenario, user, followup });
    if (turn === 1) {
      track('scenario_started', { constraints: scenario.constraints });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    void playback.current.play(
      getTurn(scenario, turn, followup),
      {
        onRead: () => dispatch({ type: 'read', run: id }),
        onBlock: (text, index) =>
          dispatch({ type: 'block', run: id, text, index }),
        onPhrase: (text) => dispatch({ type: 'phrase', run: id, text }),
        onBlockEnd: (index) => {
          if (turn === 1 && index === 1) dispatch({ type: 'map', run: id });
        },
        onFinish: () => {
          locked.current = false;
          dispatch({ type: 'finish', run: id });
          track('turn_completed', { turn });
          fadeTimer.current = setTimeout(
            () => dispatch({ type: 'fade', run: id }),
            2600,
          );
          if (turn === 3)
            track('scenario_completed', { constraints: scenario.constraints });
        },
      },
      () => audioRef.current,
      fastPreview ? 0.015 : 1,
    );
  }

  function toggleAudio() {
    if (audio && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setAudio(!audio);
  }
  function openMap() {
    track('diagram_opened');
    setDialog('map');
  }
  const comparison = state.stage === 'demo' || state.stage === 'complete';

  return (
    <MotionConfig reducedMotion="user">
      <div className={`site ${comparison ? 'site-comparison' : ''}`}>
        <header className="site-header">
          <button
            className="wordmark"
            onClick={() => go('intro')}
            aria-label="Return to introduction"
          >
            <BrandMark />
            <span>linq</span>
            <span className="wordmark-divider" />
            <span className="wordmark-project">plot twist travel</span>
          </button>
          <div className="header-right">
            <span className="header-label">A GROWTH EXPERIMENT</span>
            {state.stage !== 'intro' && (
              <button className="restart-button" onClick={() => go('choose')}>
                <RotateCcw size={14} /> Start over
              </button>
            )}
          </div>
        </header>
        <main ref={page}>
          <AnimatePresence mode="wait">
            <motion.div
              key={comparison ? 'comparison' : state.stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              onAnimationComplete={() => {
                if (state.stage !== 'complete')
                  page.current
                    ?.querySelector<HTMLElement>('h1')
                    ?.focus({ preventScroll: true });
              }}
            >
              {state.stage === 'intro' && (
                <Intro onContinue={() => go('outreach')} />
              )}
              {state.stage === 'outreach' && (
                <Outreach
                  onContinue={() => {
                    dispatch({ type: 'stage', stage: 'choose' });
                    history.replaceState(
                      null,
                      '',
                      `${location.pathname}${location.search}#/preview`,
                    );
                  }}
                />
              )}
              {state.stage === 'choose' && (
                <>
                  <button className="back-link" onClick={() => go('outreach')}>
                    <ArrowLeft size={14} /> Back to the invitation
                  </button>
                  <Choose
                    selected={state.selected}
                    onSelect={(id) => dispatch({ type: 'select', id })}
                    onStart={() => {
                      if (state.selected.length) play(1);
                    }}
                  />
                </>
              )}
              {comparison && (
                <div
                  className={`comparison ${state.stage === 'complete' ? 'is-complete' : ''}`}
                >
                  <div className="comparison-heading">
                    <div>
                      <div className="eyebrow">
                        {state.stage === 'complete'
                          ? 'THE PLAN, READY WHEN YOU NEED IT'
                          : '03 / A LITTLE HELP WHEN PLANS CHANGE'}
                      </div>
                      <h1 tabIndex={-1}>
                        {state.stage === 'complete'
                          ? 'Your next step, still in the conversation.'
                          : 'Same assistant. Your choice of channel.'}
                      </h1>
                      <p>
                        {state.stage === 'complete'
                          ? 'Gate details, directions, and the plan you agreed on are ready when you need them.'
                          : 'Choose what to ask. Follow the plan through voice and iMessage.'}
                      </p>
                    </div>
                    <button
                      className={`audio-toggle ${audio ? 'audio-enabled' : ''}`}
                      aria-pressed={audio}
                      onClick={toggleAudio}
                    >
                      {audio ? <Volume2 size={17} /> : <VolumeX size={17} />}
                      <span>
                        {audio ? 'Voice audio on' : 'Enable voice audio'}
                      </span>
                    </button>
                  </div>
                  <div
                    className="mobile-mode"
                    role="group"
                    aria-label="View channel"
                  >
                    <button
                      aria-pressed={mode === 'voice'}
                      onClick={() => setMode('voice')}
                    >
                      Voice agent{' '}
                      <span>
                        {state.stage === 'complete'
                          ? 'Complete'
                          : state.phase === 'responding'
                            ? 'Speaking'
                            : 'Your turn'}
                      </span>
                    </button>
                    <button
                      aria-pressed={mode === 'messages'}
                      onClick={() => setMode('messages')}
                    >
                      iMessage <span>{state.messages.length} messages</span>
                    </button>
                  </div>
                  <div className={`phone-pair mode-${mode}`}>
                    <section
                      className="channel voice-channel"
                      aria-label="Voice agent"
                    >
                      <div className="channel-heading">
                        <span className="channel-number">A</span>
                        <h2>Voice agent</h2>
                        <span className="channel-note">{BRAND.company}</span>
                      </div>
                      <VoicePhone state={state} keepCaptions={keepCaptions} />
                    </section>
                    <div className="comparison-bridge" aria-hidden="true">
                      <span />
                      <i>
                        same
                        <br />
                        plan
                      </i>
                      <span />
                    </div>
                    <section
                      className="channel message-channel"
                      aria-label="iMessage"
                    >
                      <div className="channel-heading">
                        <span className="channel-number">B</span>
                        <h2>iMessage</h2>
                        <span className="powered">
                          Powered by <strong>linq</strong>
                        </span>
                      </div>
                      <MessagePhone state={state} onMap={openMap} />
                    </section>
                  </div>
                  <div className="interaction-area" aria-live="polite">
                    {state.phase === 'responding' && (
                      <div className="responding">
                        <span className="responding-dot" />
                        <span>
                          {state.turn === 1
                            ? 'Alex is putting your plan together.'
                            : state.turn === 2
                              ? 'Alex is answering your question.'
                              : 'Your plan is coming together.'}
                        </span>
                        <span className="turn-counter">
                          TURN {state.turn} OF 3
                        </span>
                      </div>
                    )}
                    {state.phase === 'followup' && (
                      <div className="followup-area">
                        <span className="interaction-label">
                          WHAT WOULD YOU LIKE TO ASK?
                        </span>
                        <div className="followup-buttons">
                          {state.scenario!.followups.map((followup) => (
                            <button
                              key={followup.id}
                              className="followup-button"
                              onClick={() => play(2, followup.id)}
                            >
                              {followup.label} <ArrowUpRight size={16} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {state.phase === 'confirm' && (
                      <div className="confirmation-area">
                        <div>
                          <span className="interaction-label">
                            THE PLAN WORKS FOR YOU
                          </span>
                          <p>Acknowledge the plan and head to your gate.</p>
                        </div>
                        <button
                          className="button button-dark"
                          onClick={() => play(3, state.followup)}
                        >
                          That works. I’ll head over now. <Check size={17} />
                        </button>
                      </div>
                    )}
                    {state.stage === 'complete' && (
                      <div className="completion-area">
                        <div className="completion-copy">
                          <span className="completion-check">
                            <Check size={18} />
                          </span>
                          <div>
                            <strong>A plan you can come back to.</strong>
                            <p>
                              Explore what this could look like for your
                              customers.
                            </p>
                          </div>
                        </div>
                        <div className="completion-actions">
                          <button
                            className="button button-primary"
                            onClick={() => {
                              track('cta_clicked');
                              if (BRAND.meetingUrl)
                                window.open(
                                  BRAND.meetingUrl,
                                  '_blank',
                                  'noopener,noreferrer',
                                );
                              else setDialog('cta');
                            }}
                          >
                            Discuss this for your product{' '}
                            <ArrowUpRight size={17} />
                          </button>
                          <button
                            className="text-button"
                            onClick={() => go('choose')}
                          >
                            Try another combination
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="site-footer">
          <span>Interactive simulation · Fictional travel data</span>
          <div className="footer-controls">
            <details className="methodology">
              <summary>
                About this demo <Plus size={12} />
              </summary>
              <div>
                <strong>A product preview</strong>
                <p>
                  This browser simulation uses scripted responses and a
                  fictional airport. It does not make calls, send iMessages,
                  place orders, or book meetings.
                </p>
                <p>
                  The call illustrates spoken interaction. Real voice products
                  may also offer written follow-up. Contact-card display and
                  read receipts depend on platform behavior and settings.
                </p>
                <p>
                  The same scenario facts power both channels. The airport
                  diagram is illustrative. Local demo events stay in this
                  browser’s memory and reset on reload.
                </p>
              </div>
            </details>
            <details className="accessibility-menu">
              <summary>
                <Accessibility size={14} /> Accessibility
              </summary>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={keepCaptions}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setKeepCaptions(checked);
                      try {
                        sessionStorage.setItem(
                          'plot-twist-captions',
                          String(checked),
                        );
                      } catch {
                        /* Preference is optional. */
                      }
                      track('accessibility_mode_changed', {
                        keepCaptions: checked,
                      });
                    }}
                  />
                  <span>
                    <strong>Keep captions visible</strong>
                    <small>Preserve spoken text for this walkthrough.</small>
                  </span>
                </label>
                <p>
                  Keyboard navigation and your device’s reduced-motion
                  preference are supported.
                </p>
              </div>
            </details>
          </div>
        </footer>
        {fastPreview && (
          <span className="qa-indicator">Local QA · accelerated playback</span>
        )}
        <AnimatePresence>
          {dialog === 'map' && state.scenario && (
            <Modal
              title="Your route to B12"
              onClose={() => setDialog(null)}
              wide
            >
              <p className="modal-intro">
                {TRIP.airport} · {TRIP.terminal}
              </p>
              <AirportMap scenario={state.scenario} large />
              <div className="map-modal-facts">
                <div>
                  <small>ALLOW</small>
                  <strong>{state.scenario.minutes} minutes</strong>
                </div>
                <div>
                  <small>ARRIVE AROUND</small>
                  <strong>{state.scenario.arrival} PM</strong>
                </div>
                <div>
                  <small>BOARDING</small>
                  <strong>5:50 PM</strong>
                </div>
              </div>
              <p className="modal-note">
                {state.scenario.stops.join(' → ')}. Times include the planned
                stops. Keep an eye on airport updates.
              </p>
              <button
                className="button button-dark"
                onClick={() => setDialog(null)}
              >
                Back to the conversation <ArrowRight size={16} />
              </button>
            </Modal>
          )}
          {dialog === 'cta' && (
            <Modal
              title="Imagine this for your product."
              onClose={() => setDialog(null)}
            >
              <div className="cta-modal-mark">
                <BrandMark />
              </div>
              <p className="modal-lead">
                In the live campaign, this would connect a qualified prospect
                with Linq.
              </p>
              <p className="modal-intro">
                Meeting routing is not connected in this prototype. The next
                conversation would explore the customer workflow, integration
                needs, and whether Linq is a fit.
              </p>
              <div className="modal-actions">
                <button
                  className="button button-dark"
                  onClick={() => setDialog(null)}
                >
                  Close <X size={16} />
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    setDialog(null);
                    go('choose');
                  }}
                >
                  Try another combination <ArrowUpRight size={14} />
                </button>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
