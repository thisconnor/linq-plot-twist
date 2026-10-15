import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  captionPhrases,
  getScenario,
  getTurn,
  phraseDuration,
  TRIP,
} from './scenario';
import type { FlightId, Turn } from './scenario';
import { Playback, delay } from './playback';
import { initialState, reducer } from './state';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('Flight decisions and travel feasibility', () => {
  it.each([
    ['direct', 12, '5:37', 73, 'B12'],
    ['connection', 14, '5:39', 6, 'B16'],
  ] as const)('%s has a consistent gate route and boarding buffer', (id, minutes, arrival, buffer, gate) => {
    const scenario = getScenario(id);
    expect(scenario.minutes).toBe(minutes);
    expect(scenario.arrival).toBe(arrival);
    expect(scenario.buffer).toBe(buffer);
    expect(scenario.stops.at(-1)).toBe(`Gate ${gate}`);
    expect(TRIP.startMinutes + minutes + buffer).toBe(scenario.flight.boardingMinutes);
    expect(scenario.flight.arrivalMinutes).toBeGreaterThan(scenario.flight.departureMinutes);
  });
  it('rejects a nonexistent sample flight', () => {
    expect(() => getScenario('invalid' as FlightId)).toThrow();
  });
  it('offers the same two flights and recommendation before either decision', () => {
    expect(getTurn(getScenario('direct'), 1)).toEqual(getTurn(getScenario('connection'), 1));
    const script = getTurn(getScenario(), 1).flatMap(b => b.phrases).join(' ');
    expect(script).toContain('7:20'); expect(script).toContain('9:40');
    expect(script).toContain('6:15'); expect(script).toContain('8:55');
    expect(script).toContain('forty minutes'); expect(script).toContain('nonstop');
  });
});

describe('Both complete visitor paths', () => {
  it.each(['direct', 'connection'] as FlightId[])('%s reaches a retained plan with matching spoken facts', async (choice) => {
    vi.useFakeTimers();
    let state = initialState('choose');
    const playback = new Playback();
    for (const turn of [1, 2, 3] as Turn[]) {
      const scenario = getScenario(turn === 1 ? 'direct' : choice);
      state = reducer(state, { type: 'begin', run: turn, turn, scenario,
        user: turn === 1 ? TRIP.initialMessage : turn === 2 ? scenario.flight.choice : 'Thanks, Alex.', choice });
      const blocks = getTurn(scenario, turn);
      const task = playback.play(blocks, {
        onRead: () => { state = reducer(state, { type: 'read', run: turn }); },
        onTyping: value => { state = reducer(state, { type: 'typing', run: turn, value }); },
        onReaction: () => { state = reducer(state, { type: 'reaction', run: turn, emoji: turn === 3 ? '❤️' : '👀' }); },
        onBlock: (text, index, attachment) => { state = reducer(state, { type: 'block', run: turn, text, index, attachment }); },
        onPhrase: text => { state = reducer(state, { type: 'phrase', run: turn, text }); },
        onBlockEnd() {},
        onFinish: () => { state = reducer(state, { type: 'finish', run: turn }); },
      }, () => false);
      await vi.runAllTimersAsync(); await task;
      expect(state.phase).toBe(turn === 1 ? 'followup' : turn === 2 ? 'confirm' : 'finished');
      const spoken = getTurn(scenario, turn).flatMap(b => b.phrases).join(' ');
      expect(state.spoken.join(' ')).toContain(spoken);
    }
    expect(state.stage).toBe('complete'); expect(state.showMap).toBe(true);
    expect(state.identityShared).toBe(true); expect(state.typing).toBe(false);
    expect(state.messages.filter(m => m.attachment === 'flights')).toHaveLength(1);
    expect(state.messages.filter(m => m.attachment === 'map')).toHaveLength(1);
    expect(state.messages.filter(m => m.reaction)).toHaveLength(3);
    expect(new Set(state.messages.map(m => m.id)).size).toBe(state.messages.length);
    const transcript = state.messages.map(m => m.text).join(' ');
    const scenario = getScenario(choice);
    for (const fact of [scenario.flight.gate, scenario.flight.flight, scenario.arrival]) expect(transcript).toContain(fact);
    expect(transcript).not.toMatch(/booked|ticket issued|reserved/i);
    expect(state.choice).toBe(choice);
  });
  it('shows delivered, then read, then reaction, then typing, then a reply', async () => {
    vi.useFakeTimers();
    const events: string[] = [];
    const task = new Playback().play([{phrases:['A calm reply.']}], {
      onRead: () => events.push('read'), onReaction: () => events.push('reaction'),
      onTyping: value => {if(value) events.push('typing');},
      onBlock: () => events.push('reply'), onPhrase() {}, onBlockEnd() {}, onFinish() {},
    }, () => false);
    expect(events).toEqual([]);
    await vi.advanceTimersByTimeAsync(900); expect(events).toEqual(['read']);
    await vi.runAllTimersAsync(); await task;
    expect(events).toEqual(['read', 'reaction', 'typing', 'reply']);
  });
  it('ignores duplicate begins and stale activity across reset', () => {
    const begun = reducer(initialState(), {type:'begin', run:2, turn:1, scenario:getScenario(), user:TRIP.initialMessage});
    expect(reducer(begun, {type:'begin',run:2,turn:1,scenario:getScenario(),user:'duplicate'})).toBe(begun);
    const reset = reducer(begun, {type:'reset',run:3,stage:'choose'});
    for (const action of [{type:'read',run:2}, {type:'typing',run:2,value:true}, {type:'reaction',run:2,emoji:'❤️'}, {type:'finish',run:2}] as const) expect(reducer(reset,action)).toBe(reset);
  });
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
