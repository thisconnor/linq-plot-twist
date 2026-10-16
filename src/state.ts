import type { FlightId, Scenario, Turn } from './scenario';
export type Stage = 'intro' | 'explain' | 'outreach' | 'choose' | 'demo' | 'complete';
export type Phase = 'responding' | 'followup' | 'continue' | 'finished';
export interface Message {
  id: string; role: 'user' | 'assistant'; text: string;
  reaction?: string; attachment?: 'flights' | 'map' | 'update' | 'plan' | 'food'; scenario?: Scenario;
}
export interface DemoState {
  stage: Stage; scenario?: Scenario; run: number; turn: Turn; phase: Phase;
  messages: Message[]; current: string; previous: string; spoken: string[];
  typing: boolean; read: boolean; identityShared: boolean; showContact: boolean;
  showMap: boolean; choice: FlightId;
}
export function initialState(stage: Stage = 'intro'): DemoState {
  return { stage, run: 0, turn: 1, phase: 'responding', messages: [], current: '',
    previous: '', spoken: [], typing: false, read: false, identityShared: false,
    showContact: false, showMap: false, choice: 'direct' };
}
export type Action =
  | { type: 'stage'; stage: Stage }
  | { type: 'reset'; run: number; stage: Stage }
  | { type: 'begin'; run: number; turn: Turn; scenario: Scenario; user: string; choice?: FlightId }
  | { type: 'read' | 'finish' | 'fade'; run: number }
  | { type: 'typing'; run: number; value: boolean }
  | { type: 'reaction'; run: number; emoji: string }
  | { type: 'phrase'; run: number; text: string }
  | { type: 'block'; run: number; text: string; index: number; attachment?: 'flights' | 'map' | 'update' | 'plan' | 'food' };
export function reducer(state: DemoState, action: Action): DemoState {
  if (action.type === 'reset') return { ...initialState(action.stage), run: action.run };
  if (action.type === 'stage') return { ...state, stage: action.stage };
  if (action.type === 'begin') {
    if (action.run <= state.run) return state;
    return { ...state, stage: 'demo', run: action.run, scenario: action.scenario,
      turn: action.turn, phase: 'responding', typing: false, read: false,
      current: '', previous: '', spoken: action.turn === 1 ? [] : state.spoken,
      choice: action.choice ?? state.choice,
      messages: [...(action.turn === 1 ? [] : state.messages),
        { id: `${action.run}-user`, role: 'user', text: action.user }] };
  }
  if (action.run !== state.run) return state;
  if (action.type === 'read') return { ...state, read: true };
  if (action.type === 'typing') return { ...state, typing: action.value };
  if (action.type === 'reaction') return { ...state, messages: state.messages.map(m =>
    m.id === `${action.run}-user` ? { ...m, reaction: action.emoji } : m) };
  if (action.type === 'phrase') return { ...state, previous: state.current,
    current: action.text, spoken: [...state.spoken, action.text] };
  if (action.type === 'block') return { ...state, typing: false, identityShared: true,
    showContact: true, showMap: state.showMap || action.attachment === 'map',
    messages: [...state.messages, { id: `${action.run}-assistant-${action.index}`,
      role: 'assistant', text: action.text, attachment: action.attachment, scenario: state.scenario }] };
  if (action.type === 'fade') return { ...state, current: '', previous: '' };
  if (action.type === 'finish') return { ...state,
    stage: state.turn === 6 ? 'complete' : 'demo',
    phase: state.turn === 1 ? 'followup' : state.turn === 6 ? 'finished' : 'continue',
    current: '', previous: state.current, typing: false };
  return state;
}
