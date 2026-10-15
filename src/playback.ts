import { captionPhrases, phraseDuration } from './scenario';
import type { ScriptBlock } from './scenario';

export interface PlaybackCallbacks {
  onRead(): void;
  onBlock(text: string, index: number, attachment?: 'flights' | 'map' | 'update' | 'plan'): void;
  onTyping?(value: boolean): void;
  onReaction?(): void;
  onPhrase(text: string): void;
  onBlockEnd(index: number): void;
  onFinish(): void;
}

export function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted)
      return reject(new DOMException('Cancelled', 'AbortError'));
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, ms);
    function abort() {
      clearTimeout(timer);
      reject(new DOMException('Cancelled', 'AbortError'));
    }
    signal.addEventListener('abort', abort, { once: true });
  });
}

function browserSpeech(text: string, signal: AbortSignal): Promise<void> {
  const duration = phraseDuration(text);
  if (typeof window === 'undefined' || !('speechSynthesis' in window))
    return delay(duration, signal);
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const utterance = new SpeechSynthesisUtterance(
      text.replace(/B(\d+)/g, 'B $1'),
    );
    utterance.lang = 'en-US';
    utterance.rate = 1;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((voice) => voice.lang === 'en-US' && voice.localService) ??
      voices.find((voice) => voice.lang.startsWith('en')) ??
      null;
    let settled = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    const watchdog = setTimeout(() => {
      window.speechSynthesis.cancel();
      finish();
    }, duration + 2500);
    function clean() {
      clearTimeout(watchdog);
      clearTimeout(fallbackTimer);
      signal.removeEventListener('abort', abort);
      utterance.onend = null;
      utterance.onerror = null;
    }
    function finish() {
      if (settled) return;
      settled = true;
      clean();
      resolve();
    }
    function fallback() {
      fallbackTimer = setTimeout(
        finish,
        Math.max(0, duration - (Date.now() - started)),
      );
    }
    function abort() {
      if (settled) return;
      settled = true;
      clean();
      window.speechSynthesis.cancel();
      reject(new DOMException('Cancelled', 'AbortError'));
    }
    utterance.onend = finish;
    utterance.onerror = fallback;
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) return abort();
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      fallback();
    }
  });
}

export class Playback {
  private controller?: AbortController;
  constructor(private speak = browserSpeech) {}

  cancel() {
    this.controller?.abort();
    this.controller = undefined;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window)
      window.speechSynthesis.cancel();
  }

  async play(
    blocks: ScriptBlock[],
    callbacks: PlaybackCallbacks,
    audio: () => boolean,
    pace = 1,
  ) {
    this.cancel();
    const controller = new AbortController();
    this.controller = controller;
    const { signal } = controller;
    try {
      await delay(900 * pace, signal);
      callbacks.onRead();
      await delay(750 * pace, signal);
      callbacks.onReaction?.();
      const messages = async () => {
        for (const [index, block] of blocks.entries()) {
          const text = block.message ?? block.phrases.join(' ');
          callbacks.onTyping?.(true);
          await delay(Math.min(2600, Math.max(1300, text.length * 20)) * pace, signal);
          callbacks.onBlock(text, index, block.attachment);
          await delay((block.attachment ? 2400 : 1300) * pace, signal);
        }
      };
      const voice = async () => {
        await delay(450 * pace, signal);
        for (const [index, block] of blocks.entries()) {
          for (const phrase of block.phrases.flatMap(captionPhrases)) {
            if (signal.aborted) return;
            callbacks.onPhrase(phrase);
            if (audio()) {
              try { await this.speak(phrase, signal); }
              catch (error) {
                if (signal.aborted) throw error;
                await delay(phraseDuration(phrase) * pace, signal);
              }
            } else await delay(phraseDuration(phrase) * pace, signal);
          }
          callbacks.onBlockEnd(index);
          if (index < blocks.length - 1) await delay(500 * pace, signal);
        }
      };
      await Promise.all([messages(), voice()]);
      await delay(600 * pace, signal);
      if (!signal.aborted) callbacks.onFinish();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        throw error;
    }
  }
}
