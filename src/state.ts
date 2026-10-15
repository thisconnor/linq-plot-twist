import type { Constraint, FollowupId, Scenario, Turn } from './scenario';

export type Stage = 'intro' | 'outreach' | 'choose' | 'demo' | 'complete';
export type Phase = 'responding' | 'followup' | 'confirm' | 'finished';
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  reaction?: boolean;
}
export interface DemoState {
  stage: Stage;
  selected: Constraint[];
  scenario?: Scenario;
  run: number;
  turn: Turn;
  phase: Phase;
  messages: Message[];
  current: string;
  previous: string;
  spoken: string[];
  typing: boolean;
  read: boolean;
  identityShared: boolean;
  showContact: boolean;
  showMap: boolean;
  followup: FollowupId;
}
export function initialState(stage: Stage = 'intro'): DemoState {
  return {
    stage,
    selected: [],
    run: 0,
    turn: 1,
    phase: 'responding',
    messages: [],
    current: '',
    previous: '',
    spoken: [],
    typing: false,
    read: false,
    identityShared: false,
    showContact: false,
    showMap: false,
    followup: 'time',
  };
}
export type Action =
  | { type: 'stage'; stage: Stage }
  | { type: 'select'; id: Constraint }
  | { type: 'reset'; run: number; stage: Stage }
  | {
      type: 'begin';
      run: number;
      turn: Turn;
      scenario: Scenario;
      user: string;
      followup?: FollowupId;
    }
  | { type: 'read' | 'map' | 'finish' | 'fade'; run: number }
  | { type: 'phrase'; run: number; text: string }
  | { type: 'block'; run: number; text: string; index: number };

export function reducer(state: DemoState, action: Action): DemoState {
  if (action.type === 'reset')
    return { ...initialState(action.stage), run: action.run };
  if (action.type === 'stage') return { ...state, stage: action.stage };
  if (action.type === 'select') {
    const selected = state.selected.includes(action.id)
      ? state.selected.filter((id) => id !== action.id)
      : state.selected.length < 2
        ? [...state.selected, action.id]
        : state.selected;
    return { ...state, selected };
  }
  if (action.type === 'begin') {
    const messages = action.turn === 1 ? [] : state.messages;
    return {
      ...state,
      stage: 'demo',
      run: action.run,
      scenario: action.scenario,
      turn: action.turn,
      phase: 'responding',
      typing: true,
      read: false,
      current: '',
      previous: '',
      spoken: action.turn === 1 ? [] : state.spoken,
      followup: action.followup ?? state.followup,
      messages: [
        ...messages.map((message, index) => ({
          ...message,
          ...(action.turn === 3 && index === messages.length - 1
            ? { reaction: true }
            : {}),
        })),
        { id: `${action.run}-user`, role: 'user', text: action.user },
      ],
    };
  }
  if (action.run !== state.run) return state;
  if (action.type === 'read') return { ...state, read: true };
  if (action.type === 'phrase')
    return {
      ...state,
      previous: state.current,
      current: action.text,
      spoken: [...state.spoken, action.text],
    };
  if (action.type === 'block')
    return {
      ...state,
      typing: false,
      messages: [
        ...state.messages,
        {
          id: `${action.run}-assistant-${action.index}`,
          role: 'assistant',
          text: action.text,
        },
      ],
      identityShared: true,
      showContact: state.turn === 1,
    };
  if (action.type === 'map')
    return { ...state, showMap: true, showContact: false };
  if (action.type === 'fade') return { ...state, current: '', previous: '' };
  if (action.type === 'finish')
    return {
      ...state,
      stage: state.turn === 3 ? 'complete' : 'demo',
      phase:
        state.turn === 1
          ? 'followup'
          : state.turn === 2
            ? 'confirm'
            : 'finished',
      current: '',
      previous: state.current,
      typing: false,
      showContact: false,
    };
  return state;
}
