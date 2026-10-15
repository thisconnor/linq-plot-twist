import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  captionPhrases,
  getScenario,
  getTurn,
  phraseDuration,
  TRIP,
} from './scenario';
import type { Constraint, FollowupId, Turn } from './scenario';
import { Playback, delay } from './playback';
import { initialState, reducer } from './state';

const cases: [Constraint[], number, string, number][] = [
  [['battery'], 6, '5:31', 19],
  [['dog'], 12, '5:37', 13],
  [['food'], 13, '5:38', 12],
  [['dog', 'battery'], 12, '5:37', 13],
  [['battery', 'food'], 13, '5:38', 12],
  [['dog', 'food'], 19, '5:44', 6],
];

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Travel feasibility', () => {
  it.each(cases)(
    '%j arrives before boarding',
    (constraints, minutes, arrival, buffer) => {
      const scenario = getScenario(constraints);
      expect(scenario.minutes).toBe(minutes);
      expect(scenario.arrival).toBe(arrival);
      expect(scenario.buffer).toBe(buffer);
      expect(TRIP.startMinutes + minutes + buffer).toBe(TRIP.boardingMinutes);
      expect(scenario.stops.at(-1)).toBe('Gate B12');
      expect(getScenario([...constraints].reverse())).toEqual(scenario);
    },
  );

  it('rejects empty, duplicate, or three-constraint inputs', () => {
    for (const input of [
      [],
      ['dog', 'dog'],
      ['dog', 'food', 'battery'],
    ] as Constraint[][]) {
      expect(() => getScenario(input)).toThrow();
    }
    let state = initialState('choose');
    for (const id of ['dog', 'food', 'battery'] as Constraint[])
      state = reducer(state, { type: 'select', id });
    expect(state.selected).toEqual(['dog', 'food']);
  });
});

describe('Every complete visitor path', () => {
  const paths = cases.flatMap(([constraints]) =>
    (['time', 'route'] as FollowupId[]).map((choice) => ({
      constraints,
      choice,
    })),
  );
  it.each(paths)(
    '$constraints with the $choice follow-up reaches the final plan',
    async ({ constraints, choice }) => {
      vi.useFakeTimers();
      const scenario = getScenario(constraints);
      let state = initialState('choose');
      const playback = new Playback();
      for (const turn of [1, 2, 3] as Turn[]) {
        state = reducer(state, {
          type: 'begin',
          run: turn,
          turn,
          scenario,
          user:
            turn === 1
              ? scenario.initialMessage
              : turn === 2
                ? scenario.followups.find((f) => f.id === choice)!.label
                : 'That works. I’ll head over now.',
          followup: choice,
        });
        const task = playback.play(
          getTurn(scenario, turn, choice),
          {
            onRead: () => {
              state = reducer(state, { type: 'read', run: turn });
            },
            onBlock: (text, index) => {
              state = reducer(state, { type: 'block', run: turn, text, index });
            },
            onPhrase: (text) => {
              state = reducer(state, { type: 'phrase', run: turn, text });
            },
            onBlockEnd: (index) => {
              if (turn === 1 && index === 1)
                state = reducer(state, { type: 'map', run: turn });
            },
            onFinish: () => {
              state = reducer(state, { type: 'finish', run: turn });
            },
          },
          () => false,
        );
        await vi.runAllTimersAsync();
        await task;
        expect(state.phase).toBe(
          turn === 1 ? 'followup' : turn === 2 ? 'confirm' : 'finished',
        );
      }
      expect(state.stage).toBe('complete');
      expect(state.showMap).toBe(true);
      expect(state.identityShared).toBe(true);
      expect(state.messages).toHaveLength(7);
      expect(new Set(state.messages.map((m) => m.id)).size).toBe(7);
      expect(state.messages.filter((m) => m.reaction)).toHaveLength(1);
      const transcript = state.messages
        .map((message) => message.text)
        .join(' ');
      expect(transcript).toContain('6:20');
      expect(transcript).toContain('5:50');
      expect(transcript).toContain('B12');
      expect(transcript).not.toMatch(
        /order (is|was) placed|booked|reserved a charger/i,
      );
      if (constraints.includes('battery'))
        expect(transcript).toMatch(/aren’t guaranteed|availability is unknown/);
      expect(state.spoken.join(' ')).toBe(
        state.messages
          .filter((message) => message.role === 'assistant')
          .map((message) => message.text)
          .join(' '),
      );
    },
  );
});

describe('Playback resilience', () => {
  it('cancels an in-flight response and rejects stale callbacks after reset', async () => {
    vi.useFakeTimers();
    const playback = new Playback();
    const seen: string[] = [];
    const callbacks = {
      onRead: vi.fn(),
      onBlock: (text: string) => seen.push(text),
      onPhrase: vi.fn(),
      onBlockEnd: vi.fn(),
      onFinish: vi.fn(),
    };
    const old = playback.play(
      [{ phrases: ['This old reply must never appear.'] }],
      callbacks,
      () => false,
    );
    await vi.advanceTimersByTimeAsync(300);
    playback.cancel();
    const next = playback.play(
      [{ phrases: ['The new plan is ready.'] }],
      callbacks,
      () => false,
    );
    await vi.runAllTimersAsync();
    await Promise.all([old, next]);
    expect(seen).toEqual(['The new plan is ready.']);
    expect(callbacks.onFinish).toHaveBeenCalledTimes(1);
    const reset = reducer(initialState('demo'), {
      type: 'reset',
      stage: 'choose',
      run: 12,
    });
    expect(
      reducer(reset, { type: 'block', run: 11, text: 'Stale reply', index: 0 }),
    ).toBe(reset);
  });

  it.each(['error', 'missing callback', 'success'])(
    'audio %s still completes',
    async (mode) => {
      vi.useFakeTimers();
      class Utterance {
        text: string;
        lang = '';
        rate = 1;
        voice = null;
        onend: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor(text: string) {
          this.text = text;
        }
      }
      vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
      vi.stubGlobal('window', {
        speechSynthesis: {
          cancel: vi.fn(),
          getVoices: () => [],
          speak: (utterance: Utterance) => {
            if (mode === 'error') setTimeout(() => utterance.onerror?.(), 5);
            if (mode === 'success') setTimeout(() => utterance.onend?.(), 1500);
          },
        },
      });
      const finish = vi.fn();
      const task = new Playback().play(
        [{ phrases: ['Your flight leaves at six twenty.'] }],
        {
          onRead() {},
          onBlock() {},
          onPhrase() {},
          onBlockEnd() {},
          onFinish: finish,
        },
        () => true,
      );
      await vi.runAllTimersAsync();
      await task;
      expect(finish).toHaveBeenCalledTimes(1);
    },
  );

  it('can change the audio preference between phrases', async () => {
    vi.useFakeTimers();
    let audio = false;
    const speak = vi.fn((text: string, signal: AbortSignal) =>
      delay(phraseDuration(text), signal),
    );
    const task = new Playback(speak).play(
      [{ phrases: ['First phrase is silent.', 'Second phrase has audio.'] }],
      {
        onRead() {},
        onBlock() {},
        onPhrase: (text) => {
          if (text.startsWith('Second')) audio = true;
        },
        onBlockEnd() {},
        onFinish() {},
      },
      () => audio,
    );
    await vi.runAllTimersAsync();
    await task;
    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak.mock.calls[0][0]).toBe('Second phrase has audio.');
  });

  it('continues with captions if the browser audio implementation throws', async () => {
    vi.useFakeTimers();
    const finish = vi.fn();
    const task = new Playback(async () => { throw new Error('Audio unavailable'); }).play(
      [{ phrases: ['The gate is B12.'] }],
      { onRead() {}, onBlock() {}, onPhrase() {}, onBlockEnd() {}, onFinish: finish },
      () => true,
    );
    await vi.runAllTimersAsync(); await task;
    expect(finish).toHaveBeenCalledTimes(1);
  });

  it('gives captions reading time and preserves all words', () => {
    const sentence =
      'Pick up food at the concourse kiosk first, then make a short pet stop beside B10.';
    const phrases = captionPhrases(sentence);
    expect(phrases.join(' ')).toBe(sentence);
    expect(phrases.every((phrase) => phraseDuration(phrase) >= 1700)).toBe(
      true,
    );
    expect(phrases.every((phrase) => phrase.split(' ').length <= 13)).toBe(
      true,
    );
  });
});
