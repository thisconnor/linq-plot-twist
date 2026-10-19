import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  ATTACHMENTS,
  captionPhrases,
  ROUTE,
  STORY,
  MESSAGE_STEPS,
  timeLabel,
  TRIP,
} from "./scenario";
import type { MessageStep } from "./scenario";
import { initialState, reducer } from "./state";
import { MessagePlayback, VoicePlayback } from "./playback";
import type { ChatCallbacks, NarrationClips } from "./playback";
import narration from "./data/narration.json";

afterEach(() => {
  vi.useRealTimers();
});
const noop = () => {};
const chatCallbacks = (): ChatCallbacks => ({
  onRead: noop,
  onReaction: noop,
  onTyping: noop,
  onReply: noop,
  onShare: noop,
  onFinish: noop,
});
const voiceCallbacks = () => ({
  onCue: vi.fn(),
  onAudioUnavailable: vi.fn(),
  onFinish: vi.fn(),
});

describe("One consistent sample story", () => {
  it("keeps options, selection, gate change and route facts consistent", () => {
    expect(STORY).toHaveLength(3);
    expect(TRIP.selected.boarding).toBeLessThan(TRIP.selected.departure);
    expect(TRIP.selected.departure).toBeLessThan(TRIP.selected.arrival);
    expect(ROUTE.arrival).toBe("5:39");
    expect(ROUTE.buffer).toBe(71);
    const text = STORY.flatMap((beat) =>
      beat.replies.map((reply) => reply.text),
    ).join(" ");
    const spoken = STORY.flatMap((beat) => beat.narration).join(" ");
    for (const fact of ["PT218", "B12", "B18", "6:50", "7:20", "5:39"]) {
      expect(text).toContain(fact);
      expect(spoken).toContain(fact);
    }
    expect(spoken).toContain("6:15");
    expect(spoken).toContain("8:55");
    expect(spoken).toContain("40 minutes");
    expect(TRIP.updateMinutes - TRIP.startMinutes).toBe(8);
    expect(TRIP.updateMinutes + TRIP.route.walkMinutes + ROUTE.buffer).toBe(
      TRIP.selected.boarding,
    );
    expect(text).not.toMatch(
      /ticket issued|booked|purchased|reservation confirmed/i,
    );
  });
  it("starts with the keyword, then a separate request, with one reaction and no branches", () => {
    expect(MESSAGE_STEPS).toHaveLength(4);
    expect(MESSAGE_STEPS[0].draft).toBe("home");
    expect(MESSAGE_STEPS[0].replies).toHaveLength(1);
    expect(MESSAGE_STEPS[0].replies[0].text).toContain("I’m Alex");
    expect(MESSAGE_STEPS[0].replies[0].attachment).toBeUndefined();
    expect(MESSAGE_STEPS[1].draft).toBe(
      "My flight was canceled. Can you help?",
    );
    expect(STORY.filter((beat) => beat.reaction)).toHaveLength(1);
    expect(STORY[1].draft).toContain("nonstop");
    expect(STORY[2].clock).toBe(TRIP.updateMinutes);
    expect(STORY.map((beat) => beat.id)).toEqual([
      "options",
      "confirmation",
      "gate-change",
    ]);
  });
  it("bundles real image files and accurate accessible descriptions", () => {
    for (const image of Object.values(ATTACHMENTS)) {
      const bytes = readFileSync("public/" + image.src.replace("./", ""));
      expect(bytes.subarray(1, 4).toString()).toBe("PNG");
      expect(image.alt.length).toBeGreaterThan(80);
    }
    expect(ATTACHMENTS.map.alt).toContain("6-minute");
    expect(ATTACHMENTS.map.alt).toContain("71 minutes");
    expect(ATTACHMENTS.gate.alt).toContain("B12 to B18");
  });
  it("keeps bundled voice phrases aligned with the script and actual WAV duration", () => {
    const clips = narration.clips as NarrationClips;
    for (const beat of STORY) {
      const clip = clips[beat.id]!;
      expect(clip).toBeTruthy();
      expect(clip.cues.map((cue) => cue.text)).toEqual(beat.narration);
      expect(existsSync("public/" + clip.src.replace("./", ""))).toBe(true);
      const bytes = readFileSync("public/" + clip.src.replace("./", ""));
      expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
      const byteRate = bytes.readUInt32LE(28);
      const duration = (bytes.length - 44) / byteRate;
      expect(clip.cues.at(-1)!.end).toBeLessThanOrEqual(duration + 0.02);
      for (let i = 0; i < clip.cues.length; i++) {
        expect(clip.cues[i].end).toBeGreaterThan(clip.cues[i].start);
        if (i)
          expect(clip.cues[i].start).toBeGreaterThanOrEqual(
            clip.cues[i - 1].end,
          );
      }
    }
  });
  it("preserves every word in silent caption fallback", () => {
    for (const line of STORY.flatMap((beat) => beat.narration))
      expect(captionPhrases(line).join(" ")).toBe(line);
    expect(captionPhrases("")).toEqual([]);
    expect(timeLabel(1160)).toBe("7:20");
  });
});

describe("Linear message state and cancellation", () => {
  it("completes the full four-send path with retained images and no duplicate IDs", async () => {
    vi.useFakeTimers();
    let state = initialState("messages");
    const player = new MessagePlayback();
    for (let beat = 0; beat < MESSAGE_STEPS.length; beat++) {
      const run = beat + 1;
      state = reducer(state, { type: "send", run });
      const task = player.play(beat as MessageStep, {
        onRead: () => {
          state = reducer(state, { type: "read", run });
        },
        onReaction: () => {
          state = reducer(state, { type: "reaction", run });
        },
        onTyping: (value) => {
          state = reducer(state, { type: "typing", run, value });
        },
        onReply: (index) => {
          state = reducer(state, { type: "reply", run, index });
        },
        onShare: () => {
          state = reducer(state, { type: "share", run });
        },
        onFinish: () => {
          state = reducer(state, { type: "finish", run });
        },
      });
      await vi.runAllTimersAsync();
      await task;
      expect(state.step).toBe(beat + 1);
      expect(state.busy).toBe(false);
    }
    expect(
      state.messages.filter((message) => message.role === "user"),
    ).toHaveLength(4);
    expect(state.messages.filter((message) => message.attachment)).toHaveLength(
      3,
    );
    expect(state.messages.filter((message) => message.reaction)).toHaveLength(
      1,
    );
    expect(new Set(state.messages.map((message) => message.id)).size).toBe(
      state.messages.length,
    );
    expect(state.sharedIdentity).toBe(true);
    const finished = state;
    expect(reducer(state, { type: "send", run: 5 })).toBe(finished);
  });
  it("shows delivered before read, one typing sequence per reply and optional reaction", async () => {
    vi.useFakeTimers();
    const events: string[] = [];
    const task = new MessagePlayback().play(2, {
      ...chatCallbacks(),
      onRead: () => events.push("read"),
      onReaction: () => events.push("reaction"),
      onTyping: (value) => {
        if (value) events.push("typing");
      },
      onReply: () => events.push("reply"),
    });
    expect(events).toEqual([]);
    await vi.advanceTimersByTimeAsync(650);
    expect(events).toEqual(["read"]);
    await vi.runAllTimersAsync();
    await task;
    expect(events).toEqual([
      "read",
      "reaction",
      "typing",
      "reply",
      "typing",
      "reply",
    ]);
  });
  it("rejects sends in the wrong channel, duplicate sends, duplicate replies and stale callbacks", () => {
    expect(
      reducer(initialState("voice"), { type: "send", run: 1 }).messages,
    ).toEqual([]);
    const sent = reducer(initialState("messages"), { type: "send", run: 1 });
    expect(reducer(sent, { type: "send", run: 2 })).toBe(sent);
    const reply = reducer(sent, { type: "reply", run: 1, index: 0 });
    expect(reducer(reply, { type: "reply", run: 1, index: 0 })).toBe(reply);
    const left = reducer(reply, { type: "navigate", screen: "voice", run: 3 });
    for (const type of ["read", "finish", "share", "reaction"] as const)
      expect(reducer(left, { type, run: 1 })).toBe(left);
    expect(left.messages).toHaveLength(0);
    expect(left.busy).toBe(false);
  });
  it("preserves completed chat beats while rolling back an interrupted response on switching", () => {
    let state = reducer(initialState("messages"), { type: "send", run: 1 });
    state = reducer(state, { type: "reply", run: 1, index: 0 });
    state = reducer(state, { type: "share", run: 1 });
    state = reducer(state, { type: "finish", run: 1 });
    state = reducer(state, { type: "send", run: 2 });
    state = reducer(state, { type: "reply", run: 2, index: 0 });
    const left = reducer(state, { type: "navigate", screen: "voice", run: 3 });
    expect(left.step).toBe(1);
    expect(left.messages.every((message) => message.beat === 0)).toBe(true);
    const back = reducer(left, {
      type: "navigate",
      screen: "messages",
      run: 4,
    });
    expect(back.busy).toBe(false);
    expect(reducer(back, { type: "send", run: 5 }).messages.at(-1)?.text).toBe(
      MESSAGE_STEPS[1].draft,
    );
  });
  it("reveals the contact automatically after Alex’s greeting, never before it", () => {
    let state = reducer(initialState("messages"), { type: "send", run: 1 });
    expect(state.messages[0].text).toBe("home");
    expect(state.sharedIdentity).toBe(false);
    expect(reducer(state, { type: "share", run: 1 })).toBe(state);
    state = reducer(state, { type: "reply", run: 1, index: 0 });
    expect(state.sharedIdentity).toBe(false);
    state = reducer(state, { type: "share", run: 1 });
    expect(state.sharedIdentity).toBe(true);
    state = reducer(state, { type: "finish", run: 1 });
    expect(MESSAGE_STEPS[state.step].draft).toBe(
      "My flight was canceled. Can you help?",
    );
    expect(state.messages.some((message) => message.attachment)).toBe(false);
  });
  it("clears the automatically shown identity when an incomplete welcome is rolled back", () => {
    let state = reducer(initialState("messages"), { type: "send", run: 1 });
    state = reducer(state, { type: "reply", run: 1, index: 0 });
    state = reducer(state, { type: "share", run: 1 });
    expect(state.sharedIdentity).toBe(true);
    const switched = reducer(state, {
      type: "navigate",
      screen: "voice",
      run: 2,
    });
    expect(switched.sharedIdentity).toBe(false);
    expect(switched.messages).toEqual([]);
    expect(switched.step).toBe(0);
  });
  it("finishes the welcome before queuing the flight request or showing flight images", async () => {
    vi.useFakeTimers();
    let state = reducer(initialState("messages"), { type: "send", run: 1 });
    await Promise.all([
      new MessagePlayback().play(0, {
        ...chatCallbacks(),
        onReply: (index) => {
          state = reducer(state, { type: "reply", run: 1, index });
        },
        onShare: () => {
          state = reducer(state, { type: "share", run: 1 });
        },
        onFinish: () => {
          state = reducer(state, { type: "finish", run: 1 });
        },
      }),
      vi.runAllTimersAsync(),
    ]);
    expect(state.step).toBe(1);
    expect(state.sharedIdentity).toBe(true);
    expect(state.messages.map((message) => message.role)).toEqual([
      "user",
      "assistant",
    ]);
    expect(state.messages.some((message) => message.attachment)).toBe(false);
    expect(reducer(state, { type: "send", run: 2 }).messages.at(-1)?.text).toBe(
      "My flight was canceled. Can you help?",
    );
  });
  it("cancels in-flight reply timers before a new channel begins", async () => {
    vi.useFakeTimers();
    const player = new MessagePlayback();
    const callbacks = {
      ...chatCallbacks(),
      onReply: vi.fn(),
      onFinish: vi.fn(),
    };
    const task = player.play(0, callbacks);
    await vi.advanceTimersByTimeAsync(700);
    player.cancel();
    await vi.runAllTimersAsync();
    await task;
    expect(callbacks.onReply).not.toHaveBeenCalled();
    expect(callbacks.onFinish).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("revisiting voice resets its story clock and captions without losing completed messages", () => {
    let state = reducer(initialState("voice"), { type: "voice-start", run: 1 });
    state = reducer(state, {
      type: "cue",
      run: 1,
      beat: 2,
      text: "New gate B18",
      speaker: "alex",
    });
    state = reducer(state, { type: "voice-finish", run: 1 });
    state = reducer(state, { type: "navigate", screen: "messages", run: 2 });
    state = reducer(state, { type: "navigate", screen: "voice", run: 3 });
    expect(state.voiceBeat).toBe(0);
    expect(state.voiceStatus).toBe("ready");
    expect(state.caption).toBe("");
  });
  it("reset returns to the campaign and ignores every earlier run", () => {
    const state = reducer(initialState("messages"), { type: "send", run: 3 });
    const reset = reducer(state, { type: "reset", run: 4 });
    expect(reset.messages).toEqual([]);
    expect(reset.screen).toBe("campaign");
    expect(reset.step).toBe(0);
    expect(reducer(reset, { type: "finish", run: 3 })).toBe(reset);
    expect(reducer(reset, { type: "reset", run: 2 })).toBe(reset);
  });
});

class FakeAudio extends EventTarget {
  currentTime = 0;
  muted = false;
  paused = true;
  playError = false;
  pause = vi.fn(() => {
    this.paused = true;
  });
  play = vi.fn(() => {
    this.paused = false;
    return this.playError
      ? Promise.reject(new Error("blocked"))
      : Promise.resolve();
  });
}
const oneClip: NarrationClips = {
  options: {
    src: "sample.wav",
    cues: [
      { start: 0, end: 1, text: "First phrase" },
      { start: 1, end: 2, text: "Second phrase" },
    ],
  },
};
describe("Voice plays alone and follows actual audio time", () => {
  it("uses audio clock cues and finishes after the active clip and later captions", async () => {
    vi.useFakeTimers();
    const sample = new FakeAudio();
    const callbacks = voiceCallbacks();
    const player = new VoicePlayback(
      () => sample as unknown as HTMLAudioElement,
    );
    const task = player.play(oneClip, callbacks);
    sample.currentTime = 0.25;
    sample.dispatchEvent(new Event("timeupdate"));
    expect(callbacks.onCue).toHaveBeenLastCalledWith(0, "First phrase", "alex");
    sample.currentTime = 1.25;
    sample.dispatchEvent(new Event("timeupdate"));
    expect(callbacks.onCue).toHaveBeenLastCalledWith(
      0,
      "Second phrase",
      "alex",
    );
    sample.dispatchEvent(new Event("ended"));
    await vi.runAllTimersAsync();
    await task;
    expect(callbacks.onFinish).toHaveBeenCalledOnce();
    expect(callbacks.onAudioUnavailable).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("mute updates the active audio without resetting its position", async () => {
    vi.useFakeTimers();
    const sample = new FakeAudio();
    const player = new VoicePlayback(
      () => sample as unknown as HTMLAudioElement,
    );
    const task = player.play(oneClip, voiceCallbacks());
    sample.currentTime = 0.7;
    player.setMuted(true);
    expect(sample.muted).toBe(true);
    expect(sample.currentTime).toBe(0.7);
    player.cancel();
    await task;
    expect(sample.currentTime).toBe(0);
    expect(sample.pause).toHaveBeenCalled();
  });
  it("stops audio, pending captions and callbacks immediately when canceled", async () => {
    vi.useFakeTimers();
    const sample = new FakeAudio();
    const player = new VoicePlayback(
      () => sample as unknown as HTMLAudioElement,
    );
    const callbacks = voiceCallbacks();
    const task = player.play(oneClip, callbacks);
    player.cancel();
    await vi.runAllTimersAsync();
    await task;
    sample.currentTime = 1.5;
    sample.dispatchEvent(new Event("timeupdate"));
    expect(callbacks.onCue).not.toHaveBeenCalled();
    expect(callbacks.onFinish).not.toHaveBeenCalled();
    expect(sample.paused).toBe(true);
  });
  it.each(["blocked", "error", "watchdog"] as const)(
    "finishes with readable captions if audio is %s",
    async (mode) => {
      vi.useFakeTimers();
      const sample = new FakeAudio();
      sample.playError = mode === "blocked";
      const callbacks = voiceCallbacks();
      const task = new VoicePlayback(
        () => sample as unknown as HTMLAudioElement,
      ).play(oneClip, callbacks);
      if (mode === "error") sample.dispatchEvent(new Event("error"));
      await vi.runAllTimersAsync();
      await task;
      expect(callbacks.onAudioUnavailable).toHaveBeenCalledOnce();
      expect(callbacks.onFinish).toHaveBeenCalledOnce();
      expect(callbacks.onCue).toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    },
  );
  it("caption-only mode needs no Audio API and cancels cleanly", async () => {
    vi.useFakeTimers();
    const player = new VoicePlayback(() => {
      throw new Error("No audio should be constructed");
    });
    const callbacks = voiceCallbacks();
    const task = player.play({}, callbacks);
    await vi.advanceTimersByTimeAsync(3000);
    player.cancel();
    await vi.runAllTimersAsync();
    await task;
    expect(callbacks.onCue).toHaveBeenCalled();
    expect(callbacks.onFinish).not.toHaveBeenCalled();
  });
});
