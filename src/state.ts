import { STORY } from "./scenario";
import type { Attachment, Beat } from "./scenario";
export type Screen =
  | "campaign"
  | "email"
  | "handoff"
  | "voice"
  | "messages"
  | "complete";
export interface Message {
  id: string;
  beat: Beat;
  role: "user" | "assistant";
  text: string;
  attachment?: Attachment;
  reaction?: string;
  read?: boolean;
}
export interface DemoState {
  screen: Screen;
  run: number;
  step: number;
  busy: boolean;
  messages: Message[];
  typing: boolean;
  sharedIdentity: boolean;
  identityAccepted: boolean;
  voiceStatus: "ready" | "running" | "done";
  voiceBeat: Beat;
  caption: string;
  speaker: "you" | "alex";
  transcript: string[];
}
export function initialState(screen: Screen = "campaign"): DemoState {
  return {
    screen,
    run: 0,
    step: 0,
    busy: false,
    messages: [],
    typing: false,
    sharedIdentity: false,
    identityAccepted: false,
    voiceStatus: "ready",
    voiceBeat: 0,
    caption: "",
    speaker: "alex",
    transcript: [],
  };
}
export type Action =
  | { type: "navigate"; screen: Screen; run: number }
  | { type: "reset"; run: number }
  | { type: "send"; run: number }
  | {
      type: "read" | "reaction" | "share" | "finish" | "identity-accept";
      run: number;
    }
  | { type: "typing"; run: number; value: boolean }
  | { type: "reply"; run: number; index: number }
  | { type: "voice-start"; run: number }
  | {
      type: "cue";
      run: number;
      beat: Beat;
      text: string;
      speaker: "you" | "alex";
    }
  | { type: "voice-finish"; run: number };
export function reducer(state: DemoState, action: Action): DemoState {
  if (action.type === "reset")
    return action.run > state.run
      ? { ...initialState(), run: action.run }
      : state;
  if (action.type === "navigate") {
    if (action.run <= state.run) return state;
    const messages = state.busy
      ? state.messages.filter((m) => m.beat < state.step)
      : state.messages;
    return {
      ...state,
      screen: action.screen,
      run: action.run,
      messages,
      busy: false,
      typing: false,
      sharedIdentity: messages.some((m) => m.role === "assistant"),
      identityAccepted:
        state.identityAccepted && messages.some((m) => m.role === "assistant"),
      voiceStatus: "ready",
      voiceBeat: 0,
      caption: "",
      transcript: [],
    };
  }
  if (action.type === "send") {
    if (
      state.screen !== "messages" ||
      state.busy ||
      state.step >= STORY.length ||
      action.run <= state.run
    )
      return state;
    return {
      ...state,
      run: action.run,
      busy: true,
      messages: [
        ...state.messages,
        {
          id: `${action.run}-user`,
          beat: state.step as Beat,
          role: "user",
          text: STORY[state.step].draft,
        },
      ],
    };
  }
  if (action.type === "voice-start") {
    if (
      state.screen !== "voice" ||
      state.voiceStatus === "running" ||
      action.run <= state.run
    )
      return state;
    return {
      ...state,
      run: action.run,
      voiceStatus: "running",
      voiceBeat: 0,
      caption: "",
      transcript: [],
    };
  }
  if (action.run !== state.run) return state;
  if (action.type === "cue")
    return state.screen === "voice" && state.voiceStatus === "running"
      ? {
          ...state,
          voiceBeat: action.beat,
          caption: action.text,
          speaker: action.speaker,
          transcript: action.text
            ? [
                ...state.transcript,
                `${action.speaker === "you" ? "You" : "Alex"}: ${action.text}`,
              ]
            : state.transcript,
        }
      : state;
  if (action.type === "voice-finish")
    return state.screen === "voice"
      ? { ...state, voiceStatus: "done", caption: "" }
      : state;
  if (action.type === "identity-accept")
    return state.sharedIdentity ? { ...state, identityAccepted: true } : state;
  if (state.screen !== "messages" || !state.busy) return state;
  if (action.type === "read")
    return {
      ...state,
      messages: state.messages.map((m) =>
        m.id === `${action.run}-user` ? { ...m, read: true } : m,
      ),
    };
  if (action.type === "reaction")
    return {
      ...state,
      messages: state.messages.map((m) =>
        m.id === `${action.run}-user`
          ? { ...m, reaction: STORY[state.step].reaction }
          : m,
      ),
    };
  if (action.type === "share") return { ...state, sharedIdentity: true };
  if (action.type === "typing") return { ...state, typing: action.value };
  if (action.type === "reply") {
    const reply = STORY[state.step].replies[action.index];
    const id = `${action.run}-reply-${action.index}`;
    if (!reply || state.messages.some((m) => m.id === id)) return state;
    return {
      ...state,
      typing: false,
      messages: [
        ...state.messages,
        { id, beat: state.step as Beat, role: "assistant", ...reply },
      ],
    };
  }
  if (action.type === "finish")
    return { ...state, busy: false, typing: false, step: state.step + 1 };
  return state;
}
