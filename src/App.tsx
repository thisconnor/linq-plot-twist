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
  Check,
  ChevronDown,
  ChevronLeft,
  Grid2X2,
  Mail,
  MicOff,
  Phone,
  Plane,
  Plus,
  RotateCcw,
  Signal,
  Video,
  Volume2,
  VolumeX,
  Wifi,
  X,
} from 'lucide-react';
import { Funnel, DeveloperQuestions } from './Funnel';
import { AirportMap } from './AirportMap';
import { Playback } from './playback';
import {
  BRAND,
  FLIGHTS,
  getScenario,
  getTurn,
  timeLabel,
  TRIP,
} from './scenario';
import type { FlightId, Scenario, Turn } from './scenario';
import { initialState, reducer } from './state';
import type { DemoState, Stage } from './state';
import { track } from './telemetry';


function Avatar({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`avatar ${small ? 'avatar-small' : ''}`}
      aria-hidden="true"
    >
      <img src={BRAND.avatar} alt="" />
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

function Outreach({ onContinue }: { onContinue(): void }) {
  return (
    <div className="outreach-layout">
      <div className="context-copy">
        <div className="eyebrow">01 / YOU’RE THE DEVELOPER</div>
        <h1 tabIndex={-1}>
          Your voice agent.<br /><span>Now in iMessage.</span>
        </h1>
        <p>
          You’re a developer at <strong>Plot Twist Travel</strong>, whose
          AI travel assistant already helps customers by phone.
        </p>
        <p>
          Linq sent a preview of how that same agent could help in iMessage. You can explore it without connecting your product or supplying customer data.
        </p>
        <DeveloperQuestions />
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
            Your travel assistant.<br />One more way to reach it.
          </h2>
          <p>
            Your voice assistant already helps when travel plans go sideways. We made a preview of what that experience could look like in iMessage.
          </p>
          <p>
            A canceled flight. A dog named Pickles. Two ways home. Try it as your customer, then see whether this fits Plot Twist.
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

function Choose({ onStart }: { onStart(): void }) {
  return <div className="story-layout">
    <div className="story-copy"><div className="eyebrow">02 / YOU’RE THE TRAVELER NOW</div>
      <h1 tabIndex={-1}>The flight is canceled.<br />The ex is in Lisbon.<br /><span>You have Pickles.</span></h1>
      <p>You’ve seen the invitation. Now experience it as one of Plot Twist’s travelers.</p>
      <div className="story-brief"><span>YOUR SITUATION</span><p>It’s 5:25 PM at Harbor City Airport. You’re trying to get home with the dog you share. Pickles is cleared to travel; your original flight has just been canceled.</p></div>
      <button className="button button-primary" onClick={onStart}>Ask Alex for a way home <ArrowRight size={17}/></button>
    </div>
    <div className="story-art"><div className="story-airline"><Plane size={23}/><strong>PLOT AIR</strong><span>PT204</span></div><div className="cancelled-ticket"><small>HARBOR CITY → HOME</small><strong>CANCELED</strong><span>Well. That’s a plot twist.</span></div><div className="pickles-tag"><span className="pickles-emoji" aria-hidden="true">🐶</span><div><small>EXTRA CARRY-ON ENERGY</small><strong>Pickles</strong><span>Very good dog. Very long day.</span></div></div><div className="story-handoff"><Phone size={17}/><span>Your existing voice assistant</span><ArrowRight size={18}/><span className="new-channel">+ iMessage</span></div><p className="story-art-note">Same Alex. Same options. Another way to make a plan.</p></div>
  </div>;
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
      <PhoneStatus />
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

function FlightOptions() {
  return <div className="flight-options" aria-label="Two sample flight options">{FLIGHTS.map(f => <div className="flight-option" key={f.id}><div className="flight-option-top"><Plane size={13}/><strong>{f.flight} · {f.stops}</strong>{f.id === 'direct' && <span>Alex’s pick</span>}</div><div className="flight-option-times"><span>{timeLabel(f.departureMinutes)} <small>PM</small></span><ArrowRight size={15}/><span>{timeLabel(f.arrivalMinutes)} <small>PM</small></span></div><p>{f.layover} · Home tonight</p></div>)}</div>;
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
        <span>{scenario.flight.flight} · Your way home</span>
        <Check size={15} />
      </div>
      <div className="itinerary-facts">
        <div>
          <small>GATE</small>
          <strong>{scenario.flight.gate}</strong>
        </div>
        <div>
          <small>BOARDING</small>
          <strong>{timeLabel(scenario.flight.boardingMinutes)}</strong>
        </div>
        <div>
          <small>DEPARTURE</small>
          <strong>{timeLabel(scenario.flight.departureMinutes)}</strong>
        </div>
      </div>
      <div className="itinerary-arrival"><span>HOME TONIGHT</span><strong>{timeLabel(scenario.flight.arrivalMinutes)} PM</strong><small>{scenario.flight.layover}</small></div>
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
  }, [state.messages, state.typing, state.showMap, state.phase, reduced]);
  const lastUser = state.messages
    .map((message) => message.role)
    .lastIndexOf('user');
  return (
    <div className="phone message-phone">
      <PhoneStatus />
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
                  aria-label={`Alex reacted ${message.reaction} to your message`}
                >
                  {message.reaction}
                </span>
              )}
            </motion.div>
            {message.role === 'user' && index === lastUser && (
              <div className="read-marker">
                {state.read ? 'Read · 5:25 PM' : 'Delivered'}
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
            {message.attachment === 'flights' && <FlightOptions />}
            {message.attachment === 'map' && state.scenario && (
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

  useEffect(() => {
    if (state.stage === 'demo' && state.phase !== 'responding') {
      page.current?.querySelector<HTMLElement>('.followup-button, .confirmation-area button')?.focus({ preventScroll: true });
    }
  }, [state.phase, state.stage]);

  function go(stage: Stage) {
    locked.current = false;
    setMode('messages');
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

  function play(turn: Turn, choice: FlightId = state.choice) {
    if (locked.current) return;
    if (turn > 1 && (state.phase === 'responding' || state.turn !== turn - 1))
      return;
    const scenario = turn <= 2 ? getScenario(choice) : state.scenario!;
    locked.current = true;
    const user =
      turn === 1
        ? scenario.initialMessage
        : turn === 2
          ? scenario.flight.choice
          : 'Thanks, Alex. Pickles and I are on our way.';
    const id = ++run.current;
    clearTimeout(fadeTimer.current);
    dispatch({ type: 'begin', run: id, turn, scenario, user, choice });
    if (turn === 1) {
      track('scenario_started', { story: 'pickles' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (turn === 2) track('flight_chosen', { flight: choice });
    void playback.current.play(
      getTurn(scenario, turn),
      {
        onRead: () => dispatch({ type: 'read', run: id }),
        onBlock: (text, index, attachment) =>
          dispatch({ type: 'block', run: id, text, index, attachment }),
        onTyping: (value) => dispatch({ type: 'typing', run: id, value }),
        onReaction: () => dispatch({ type: 'reaction', run: id, emoji: turn === 1 ? '👀' : turn === 2 ? '👍' : '❤️' }),
        onPhrase: (text) => dispatch({ type: 'phrase', run: id, text }),
        onBlockEnd: () => {},
        onFinish: () => {
          locked.current = false;
          dispatch({ type: 'finish', run: id });
          track('turn_completed', { turn });
          fadeTimer.current = setTimeout(
            () => dispatch({ type: 'fade', run: id }),
            2600,
          );
          if (turn === 3)
            track('scenario_completed', { flight: scenario.key });
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
                <Funnel onContinue={() => go('outreach')} onSkip={() => go('choose')} />
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
                  <Choose onStart={() => play(1)} />
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
                          : 'Your voice agent. Now in iMessage.'}
                      </h1>
                      <p>
                        {state.stage === 'complete'
                          ? 'Gate details, directions, and the plan you agreed on are ready when you need them.'
                          : 'Alex already helps by phone. Try the same decision in a conversation you can return to.'}
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
                  <p className="mobile-guidance">Both views follow your choice. {mode === 'messages' ? 'Try Voice to hear the same options.' : 'Switch to iMessage to compare the options and keep your plan.'}</p>
                  <div className={`phone-pair mode-${mode}`}>
                    <section
                      className="channel voice-channel"
                      aria-label="Voice agent"
                    >
                      <div className="channel-heading">
                        <span className="channel-number">A</span>
                        <h2>Existing voice agent</h2>
                        <span className="channel-note">Speak your choice</span>
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
                        <span className="powered"><BrandMark /> Powered by <strong>linq</strong></span>
                      </div>
                      <MessagePhone state={state} onMap={openMap} />
                    </section>
                  </div>
                  <div className="channel-insight"><span className="status-dot" />{state.turn === 1 ? 'Compare both options without asking again.' : 'Your plan stays in the conversation.'}<span>{state.turn === 1 ? 'Same options. Same recommendation.' : 'Read it when you need it. Reply when you can.'}</span></div>
                  <div className="interaction-area" aria-live="polite">
                    {state.phase === 'responding' && (
                      <div className="responding">
                        <span className="responding-dot" />
                        <span>
                          {state.turn === 1
                            ? 'Alex is putting your plan together.'
                            : state.turn === 2
                              ? 'Alex is mapping your way to the gate.'
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
                          SAY YOUR CHOICE ON THE CALL · SEND IT IN IMESSAGE
                        </span>
                        <div className="followup-buttons">
                          {FLIGHTS.map((flight) => (
                            <button
                              key={flight.id}
                              className="followup-button"
                              onClick={() => play(2, flight.id)}
                            >
                              <span><small>{flight.label}</small>{flight.choice}</span> <ArrowUpRight size={16} />
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
                          <p>A quick reply. Then you and Pickles can get moving.</p>
                        </div>
                        <button
                          className="button button-dark"
                          onClick={() => play(3, state.choice)}
                        >
                          Thanks, Alex. We’re on our way. <Check size={17} />
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
                            Try the other flight
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {state.stage === 'complete' && <div className="funnel-return"><DeveloperQuestions answered /><div><span className="eyebrow">FROM EXPERIENCE TO CONVERSATION</span><p>You’ve tried the value. Now the meeting ask has context.</p><span className="return-flow">Qualified account <ArrowRight size={14}/> Personalized preview <ArrowRight size={14}/> Your experience <ArrowRight size={14}/><strong>Discuss the fit</strong></span></div></div>}
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
              title={`Your route to ${state.scenario.flight.gate}`}
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
                  <strong>{timeLabel(state.scenario.flight.boardingMinutes)} PM</strong>
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
                  Try the other flight <ArrowUpRight size={14} />
                </button>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
