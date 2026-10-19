import { MESSAGE_STEPS } from "./scenario";
import { initialState, reducer } from "./state";
import type { Action, DemoState } from "./state";

export const SCROLL_MOMENTS = [
  "intro",
  "invitation",
  "traveler",
  "voice",
  "welcome",
  "flights",
  "confirmation",
  "gate",
  "route",
  "pilot",
] as const;

export function scrollMoment(position: number) {
  return Math.max(
    0,
    Math.min(
      SCROLL_MOMENTS.length - 1,
      Math.floor((Number.isFinite(position) ? position : 0) + 0.25),
    ),
  );
}

// Replay the existing reducer rather than maintain a second copy of the story.
// Every frame depends only on scroll position, so reversing never duplicates replies.
const events: { at: number; action: Action }[] = [];
for (let step = 0; step < MESSAGE_STEPS.length; step++) {
  const run = step + 1;
  const base = 3.75 + step;
  const event = (offset: number, action: Action) =>
    events.push({ at: base + offset, action });
  event(0.12, { type: "send", run });
  event(0.22, { type: "read", run });
  if (MESSAGE_STEPS[step].reaction) event(0.28, { type: "reaction", run });
  event(0.32, { type: "typing", run, value: true });
  MESSAGE_STEPS[step].replies.forEach((_, index) => {
    const at = step === 3 ? [0.48, 1.16, 1.53][index] : 0.48 + index * 0.2;
    event(at, { type: "reply", run, index });
    if (index === 0 && MESSAGE_STEPS[step].shareIdentity)
      event(at, { type: "share", run });
  });
  event(step === 3 ? 1.68 : 0.82, { type: "finish", run });
}
events.sort((a, b) => a.at - b.at);

export function projectScrollMessages(position: number): DemoState {
  let state = initialState("messages");
  for (const event of events) {
    if (event.at > position || !Number.isFinite(position)) break;
    state = reducer(state, event.action);
  }
  return state;
}

/** Optional Send buttons advance the same scroll timeline; they never send a message. */
export function nextScrollSend(position: number) {
  return (
    events.find((event) => event.at > position && event.action.type === "send")
      ?.at ?? 8.5
  );
}
