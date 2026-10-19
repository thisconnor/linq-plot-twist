import { captionPhrases, phraseDuration, STORY } from "./scenario";
import type { Beat } from "./scenario";

export function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted)
      return reject(new DOMException("Cancelled", "AbortError"));
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    function abort() {
      clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    }
    signal.addEventListener("abort", abort, { once: true });
  });
}
export interface ChatCallbacks {
  onRead(): void;
  onReaction(): void;
  onTyping(value: boolean): void;
  onReply(index: number): void;
  onShare(): void;
  onFinish(): void;
}
export class MessagePlayback {
  private controller?: AbortController;
  cancel() {
    this.controller?.abort();
    this.controller = undefined;
  }
  async play(beat: Beat, callbacks: ChatCallbacks, pace = 1) {
    this.cancel();
    const controller = new AbortController();
    this.controller = controller;
    const { signal } = controller;
    try {
      await delay(650 * pace, signal);
      callbacks.onRead();
      if (STORY[beat].reaction) {
        await delay(400 * pace, signal);
        callbacks.onReaction();
      }
      for (let index = 0; index < STORY[beat].replies.length; index++) {
        callbacks.onTyping(true);
        await delay(
          Math.min(
            1900,
            Math.max(900, STORY[beat].replies[index].text.length * 14),
          ) * pace,
          signal,
        );
        callbacks.onReply(index);
        if (beat === 0 && index === 0) callbacks.onShare();
        await delay(
          (STORY[beat].replies[index].attachment ? 1100 : 550) * pace,
          signal,
        );
      }
      if (!signal.aborted) callbacks.onFinish();
    } catch (error) {
      if (!signal.aborted) throw error;
    }
  }
}
export interface AudioCue {
  start: number;
  end: number;
  text: string;
}
export interface AudioClip {
  src: string;
  cues: AudioCue[];
}
export type NarrationClips = Record<string, AudioClip | null>;
export interface VoiceCallbacks {
  onCue(beat: Beat, text: string, speaker: "you" | "alex"): void;
  onAudioUnavailable(): void;
  onFinish(): void;
}
export class VoicePlayback {
  private controller?: AbortController;
  private audio?: HTMLAudioElement;
  private muted = false;
  constructor(private createAudio = (src: string) => new Audio(src)) {}
  setMuted(value: boolean) {
    this.muted = value;
    if (this.audio) this.audio.muted = value;
  }
  cancel() {
    this.controller?.abort();
    this.controller = undefined;
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = undefined;
    }
  }
  private playClip(
    clip: AudioClip,
    signal: AbortSignal,
    cue: (text: string) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = this.createAudio(clip.src);
      this.audio = audio;
      audio.muted = this.muted;
      let previous = "";
      const update = () => {
        const current =
          clip.cues.find(
            (item) =>
              audio.currentTime >= item.start && audio.currentTime < item.end,
          )?.text ?? "";
        if (current !== previous) {
          previous = current;
          cue(current);
        }
      };
      const clean = () => {
        clearTimeout(watchdog);
        audio.removeEventListener("timeupdate", update);
        audio.removeEventListener("ended", finish);
        audio.removeEventListener("error", fail);
        signal.removeEventListener("abort", abort);
        audio.pause();
        if (this.audio === audio) this.audio = undefined;
      };
      const finish = () => {
        clean();
        resolve();
      };
      const fail = () => {
        clean();
        reject(new Error("Audio unavailable"));
      };
      const abort = () => {
        clean();
        audio.currentTime = 0;
        reject(new DOMException("Cancelled", "AbortError"));
      };
      const watchdog = setTimeout(
        fail,
        Math.max(15000, (clip.cues.at(-1)?.end ?? 30) * 1000 + 6000),
      );
      audio.addEventListener("timeupdate", update);
      audio.addEventListener("ended", finish);
      audio.addEventListener("error", fail);
      signal.addEventListener("abort", abort, { once: true });
      if (signal.aborted) return abort();
      try {
        void audio.play().catch(fail);
      } catch {
        fail();
      }
    });
  }
  async play(clips: NarrationClips, callbacks: VoiceCallbacks, pace = 1) {
    this.cancel();
    const controller = new AbortController();
    this.controller = controller;
    const { signal } = controller;
    try {
      for (let beat = 0; beat < STORY.length; beat++) {
        const current = STORY[beat];
        if (beat > 0) {
          callbacks.onCue(beat as Beat, current.caller, "you");
          await delay(
            Math.max(2500, current.caller.split(/\s+/).length * 230) * pace,
            signal,
          );
        }
        const clip = clips[current.id];
        let played = false;
        if (clip) {
          try {
            await this.playClip(clip, signal, (text) =>
              callbacks.onCue(beat as Beat, text, "alex"),
            );
            played = true;
          } catch (error) {
            if (signal.aborted) throw error;
            callbacks.onAudioUnavailable();
          }
        }
        if (!played)
          for (const phrase of current.narration.flatMap(captionPhrases)) {
            if (signal.aborted) return;
            callbacks.onCue(beat as Beat, phrase, "alex");
            await delay(phraseDuration(phrase) * pace, signal);
          }
        await delay(550 * pace, signal);
      }
      if (!signal.aborted) callbacks.onFinish();
    } catch (error) {
      if (!signal.aborted) throw error;
    }
  }
}
