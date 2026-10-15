export type FlightId = 'direct' | 'connection';
export type Turn = 1 | 2 | 3 | 4 | 5 | 6;
export const TURNS: Turn[] = [1, 2, 3, 4, 5, 6];
export const BRAND = {
  company: 'Plot Twist Travel', assistant: 'Alex', avatar: './alex-avatar.jpg', meetingUrl: '',
};
export const TRIP = {
  airline: 'Plot Air', airport: 'Harbor City Airport', terminal: 'Terminal 2',
  cancelledFlight: 'PT204', startMinutes: 17 * 60 + 25, updateMinutes: 17 * 60 + 33,
  petWalk: 3, petStop: 5,
  initialMessage: 'My flight home just got canceled. I’m at Harbor City Airport with my dog, Pickles. He packed absolutely no patience. Can you help?',
};
export interface Flight {
  id: FlightId; flight: string; departureMinutes: number; boardingMinutes: number;
  arrivalMinutes: number; gate: string; updatedGate: string; stops: string;
  layover: string; petToGate: number; label: string; choice: string;
}
export const FLIGHTS: Flight[] = [
  { id: 'direct', flight: 'PT218', departureMinutes: 19 * 60 + 20,
    boardingMinutes: 18 * 60 + 50, arrivalMinutes: 21 * 60 + 40,
    gate: 'B12', updatedGate: 'B18', stops: 'Nonstop', layover: 'No plane change', petToGate: 4,
    label: 'Keep it simple', choice: 'The nonstop. Pickles has had enough plot twists.' },
  { id: 'connection', flight: 'PT306', departureMinutes: 18 * 60 + 15,
    boardingMinutes: 17 * 60 + 45, arrivalMinutes: 20 * 60 + 55,
    gate: 'B16', updatedGate: 'B20', stops: 'One stop', layover: '40 min in Meadow City', petToGate: 6,
    label: 'Get home earlier', choice: 'The connection. I’d like to get home earlier.' },
];
export function timeLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 12 || 12;
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`;
}
export interface Scenario {
  key: FlightId; flight: Flight; updated: boolean; originalGate: string;
  minutes: number; arrival: string; buffer: number; routeLabel: string;
  stops: string[]; initialMessage: string;
}
export function getScenario(id: FlightId = 'direct', updated = false): Scenario {
  const original = FLIGHTS.find(f => f.id === id);
  if (!original) throw new Error('Choose one of the available sample flights.');
  const flight = updated ? { ...original, gate: original.updatedGate, petToGate: original.petToGate + 2 } : original;
  const minutes = updated ? flight.petToGate : TRIP.petWalk + TRIP.petStop + flight.petToGate;
  const start = updated ? TRIP.updateMinutes : TRIP.startMinutes;
  return { key: id, flight, updated, originalGate: original.gate, minutes,
    arrival: timeLabel(start + minutes), buffer: flight.boardingMinutes - start - minutes,
    routeLabel: updated ? `From pet relief to ${flight.gate}` : `Pet stop, then ${flight.gate}`,
    stops: ['Pet relief · B10', `Gate ${flight.gate}`], initialMessage: TRIP.initialMessage };
}
export function travelerMessage(turn: Turn, scenario: Scenario): string {
  if (turn === 1) return TRIP.initialMessage;
  if (turn === 2) return scenario.flight.choice;
  if (turn === 3) return 'Before we go: Pickles needs a pet stop. He’s giving me the look.';
  if (turn === 4) return 'We made it to pet relief. Pickles is ready to move. Anything changed?';
  if (turn === 5) return 'Leash in one hand, suitcase in the other. Which gate and boarding time again?';
  return 'Got it. Pickles and I are on our way. Thanks, Alex!';
}
export const NEXT_BEAT: Record<2 | 3 | 4 | 5 | 6, { context: string; label: string }> = {
  2: { context: 'Choose what works for you and your dog.', label: 'Choose your flight' },
  3: { context: 'One small problem before you head to the gate…', label: 'Ask about a pet stop' },
  4: { context: 'Eight minutes later · You’re at pet relief with Pickles.', label: 'Check for updates' },
  5: { context: 'You’re moving again. The airport signs are not helping.', label: 'Check the gate and boarding time' },
  6: { context: 'Now you have what you need. Leash, suitcase, very good dog.', label: 'Thank Alex and head to the gate' },
};
export interface ScriptBlock {
  phrases: string[]; message?: string; attachment?: 'flights' | 'map' | 'update' | 'plan';
}
export function getTurn(scenario: Scenario, turn: Turn): ScriptBlock[] {
  const f = scenario.flight;
  const [direct, connection] = FLIGHTS;
  const bufferText = scenario.buffer >= 60 ? 'over an hour before boarding' : `${scenario.buffer} minutes before boarding`;
  if (turn === 1) return [
    { phrases: ['I can help. Let’s get you and Pickles home.'], message: 'Let’s get you and Pickles home. 🐾' },
    { phrases: ['There are two replacement options. Pickles is cleared to travel on either one.'] },
    { phrases: [`The nonstop leaves at ${timeLabel(direct.departureMinutes)} and gets you home at ${timeLabel(direct.arrivalMinutes)} tonight.`,
      `The connection leaves at ${timeLabel(connection.departureMinutes)}, with forty minutes in Meadow City. You get home at ${timeLabel(connection.arrivalMinutes)} tonight.`],
      message: 'Earlier arrival, or one less plane change?', attachment: 'flights' },
    { phrases: ['I’d take the nonstop for a simpler trip with Pickles. Which would you prefer?'],
      message: 'I’d take the nonstop. One less plane change for Pickles. Your call.' },
  ];
  if (turn === 2) return [
    { phrases: [`${f.stops === 'Nonstop' ? 'The nonstop' : 'The connection'} it is. ${f.flight}, gate ${f.gate}. Departure is ${timeLabel(f.departureMinutes)}, boarding at ${timeLabel(f.boardingMinutes)}.`],
      message: `${f.stops === 'Nonstop' ? 'Nonstop' : 'Connection'} it is. ${f.flight} · ${timeLabel(f.departureMinutes)} PM · ${f.gate}. Boarding ${timeLabel(f.boardingMinutes)} PM.`, attachment: 'plan' },
    { phrases: ['Anything you and Pickles need before heading over?'], message: 'Anything Pickles needs before you head over? Water? A small union break?' },
  ];
  if (turn === 3) return [
    { phrases: [`Pet relief is beside B10, a ${TRIP.petWalk}-minute walk. Allow ${TRIP.petStop} minutes for the stop, then ${f.petToGate} minutes to ${f.gate}.`],
      message: `The look is legally binding. 🐶 Pet relief by B10: ${TRIP.petWalk} min there, ${TRIP.petStop} min stop, then ${f.petToGate} min to ${f.gate}.`, attachment: 'map' },
    { phrases: [`Leave now and you’ll reach the gate around ${scenario.arrival}, ${bufferText}.`],
      message: `You’ll reach ${f.gate} around ${scenario.arrival}. ${scenario.buffer >= 60 ? 'Plenty of time before boarding.' : `${scenario.buffer} min before boarding. Keep the stop short.`}` },
  ];
  if (turn === 4) return [
    { phrases: [`There’s a gate change. ${f.flight} now boards at ${f.gate}, instead of ${scenario.originalGate}. Boarding is still ${timeLabel(f.boardingMinutes)}.`],
      message: `One more plot twist: new gate ${f.gate}, replacing ${scenario.originalGate}. Boarding is still ${timeLabel(f.boardingMinutes)} PM.`, attachment: 'update' },
    { phrases: [`From pet relief, follow the concourse to ${f.gate}. It’s ${f.petToGate} minutes. You’ll arrive around ${scenario.arrival}, ${bufferText}.${scenario.buffer < 10 ? ' Head straight there now.' : ''}`],
      message: `Updated route: ${f.petToGate} min from pet relief → ${f.gate}. Arrive around ${scenario.arrival}.${scenario.buffer < 10 ? ' Head straight there now; that’s 4 min before boarding.' : ' You still have over an hour before boarding.'}`, attachment: 'map' },
  ];
  if (turn === 5) return [
    { phrases: [`Gate ${f.gate}. Boarding at ${timeLabel(f.boardingMinutes)}, departure at ${timeLabel(f.departureMinutes)}. Your arrival home is ${timeLabel(f.arrivalMinutes)} tonight.`],
      message: `${f.gate} · Boarding ${timeLabel(f.boardingMinutes)} PM. Your latest plan is here. 👇`, attachment: 'plan' },
    { phrases: [`The route from pet relief is ${f.petToGate} minutes. Follow the concourse signs for ${f.gate}.`],
      message: `Follow the concourse signs for ${f.gate}. ${f.petToGate} min from pet relief. You can check this card again whenever you need.` },
  ];
  return [
    { phrases: [`You’re welcome. Head to ${f.gate}, and keep an eye on airport updates. Have a good trip home, both of you.`],
      message: `Safe trip home, both of you. 🐾 And Pickles? Excellent crisis management.`, attachment: 'plan' },
  ];
}
export function captionPhrases(sentence: string): string[] {
  const words = sentence.trim().split(/\s+/);
  if (!sentence.trim()) return [];
  const chunkSize = Math.ceil(words.length / Math.ceil(words.length / 13));
  const result: string[] = [];
  while (words.length > 0) result.push(words.splice(0, chunkSize).join(' '));
  return result;
}
export function phraseDuration(text: string): number {
  return Math.max(1700, text.split(/\s+/).length * 360 + (/[.!?]$/.test(text) ? 450 : 150));
}
