import { describe, expect, it } from "vitest";
import {
  nextScrollSend,
  projectScrollMessages,
  SCROLL_MOMENTS,
  scrollMoment,
} from "./scroll-model";
import { MESSAGE_STEPS } from "./scenario";

describe("scroll walkthrough", () => {
  it("keeps the keyword, greeting and contact ahead of the flight request", () => {
    expect(projectScrollMessages(3.75).messages).toEqual([]);
    const sent = projectScrollMessages(3.95);
    expect(sent.messages.map((message) => message.text)).toEqual(["help"]);
    expect(sent.sharedIdentity).toBe(false);
    const greeting = projectScrollMessages(4.3);
    expect(greeting.sharedIdentity).toBe(true);
    expect(greeting.messages.at(-1)?.text).toBe(
      MESSAGE_STEPS[0].replies[0].text,
    );
    expect(greeting.messages.some((message) => message.attachment)).toBe(false);
    const queued = projectScrollMessages(4.6);
    expect(queued.step).toBe(1);
    expect(queued.busy).toBe(false);
  });
  it("separates the gate reveal from the walking route", () => {
    const gate = projectScrollMessages(7.4);
    expect(gate.messages.some((message) => message.attachment === "gate")).toBe(
      true,
    );
    expect(gate.messages.some((message) => message.attachment === "map")).toBe(
      false,
    );
    const route = projectScrollMessages(8.7);
    expect(route.step).toBe(4);
    expect(
      route.messages.filter((message) => message.role === "user"),
    ).toHaveLength(4);
    expect(route.messages.filter((message) => message.reaction)).toHaveLength(
      1,
    );
    expect(
      route.messages.flatMap((message) => message.attachment ?? []),
    ).toEqual(["flights", "gate", "map"]);
  });
  it("rewinds deterministically without stale replies or duplicated contact cards", () => {
    const before = projectScrollMessages(5.6);
    projectScrollMessages(8.7);
    expect(projectScrollMessages(5.6)).toEqual(before);
    expect(projectScrollMessages(3.8).sharedIdentity).toBe(false);
    const complete = projectScrollMessages(10);
    expect(new Set(complete.messages.map((message) => message.id)).size).toBe(
      complete.messages.length,
    );
  });
  it("lets scrolling continue through Linq's invitation to the ending without changing the completed trip", () => {
    expect(SCROLL_MOMENTS[scrollMoment(8.7)]).toBe("route");
    expect(SCROLL_MOMENTS[scrollMoment(8.75)]).toBe("linq-invitation");
    expect(SCROLL_MOMENTS[scrollMoment(9.74)]).toBe("linq-invitation");
    expect(SCROLL_MOMENTS[scrollMoment(9.75)]).toBe("pilot");
    expect(SCROLL_MOMENTS[scrollMoment(10)]).toBe("pilot");

    const completedTrip = projectScrollMessages(8.7);
    expect(completedTrip.step).toBe(MESSAGE_STEPS.length);
    expect(completedTrip.busy).toBe(false);
    expect(projectScrollMessages(9)).toEqual(completedTrip);
    expect(projectScrollMessages(10)).toEqual(completedTrip);
  });
  it("clamps moment selection and lets the optional Send control advance the same timeline", () => {
    expect(scrollMoment(-4)).toBe(0);
    expect(scrollMoment(50)).toBe(10);
    expect(scrollMoment(NaN)).toBe(0);
    expect(nextScrollSend(4.6)).toBeCloseTo(4.87);
  });
});
