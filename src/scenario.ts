export type FlightId = 'direct' | 'connection';
export type FoodChoice = 'both' | 'pickles' | 'gate';
export const FOOD_CHOICES: { id: FoodChoice; label: string; note: string }[] = [
  { id: 'both', label: 'Feed both of us', note: 'My sandwich is apparently not his dinner.' },
  { id: 'pickles', label: 'Pickles first', note: 'He has retained a very small lawyer.' },
  { id: 'gate', label: 'Straight to the gate', note: 'Dinner can wait. Boarding won’t.' },
];
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
  key: FlightId; food?: FoodChoice; flight: Flight; updated: boolean; originalGate: string;
  minutes: number; arrival: string; buffer: number; routeLabel: string;
  stops: string[]; initialMessage: string;
}
export function getScenario(id: FlightId = 'direct', updated = false, food?: FoodChoice): Scenario {
  const original = FLIGHTS.find(f => f.id === id);
  if (!original) throw new Error('Choose one of the available sample flights.');
  const flight = updated ? { ...original, gate: original.updatedGate, petToGate: original.petToGate + 2 } : original;
  const minutes = updated ? flight.petToGate : TRIP.petWalk + TRIP.petStop + flight.petToGate;
  const start = updated ? TRIP.updateMinutes : TRIP.startMinutes;
  return { key: id, food, flight, updated, originalGate: original.gate, minutes,
    arrival: timeLabel(start + minutes), buffer: flight.boardingMinutes - start - minutes,
    routeLabel: updated ? `From pet relief to ${flight.gate}` : `Pet stop, then ${flight.gate}`,
    stops: ['Pet relief · B10', `Gate ${flight.gate}`], initialMessage: TRIP.initialMessage };
}
export function getDinnerPlan(scenario: Scenario) {
  const choice = scenario.food ?? 'both';
  const tight = scenario.buffer < 10;
  const extraMinutes = choice === 'gate' ? 0 : tight ? 2 : choice === 'both' ? 15 : 5;
  const arrivalMinutes = TRIP.updateMinutes + scenario.minutes + extraMinutes;
  const steps = choice === 'gate' ? [`Straight to ${scenario.flight.gate}`, 'Eat after boarding']
    : tight ? ['Head straight to the gate', '2 min for Pickles’ packed food at the gate', 'Your dinner after boarding']
    : choice === 'both' ? ['B14 deli · 10 min for takeaway', '5 min for Pickles’ packed food', `Gate ${scenario.flight.gate}`]
    : ['5 min for Pickles’ packed food', `Gate ${scenario.flight.gate}`, 'Your dinner later'];
  const reply = choice === 'gate' ? 'Gate first. A sensible choice, although Pickles has requested a written appeal.'
    : tight ? 'Boarding is too close for the deli. Head to the gate first. You can allow two minutes there for Pickles’ usual food from your bag; save your dinner until after boarding.'
    : choice === 'both' ? 'Two dinners, one detour. The deli by B14 is on your way. Budget ten minutes for your takeaway and five for Pickles’ usual food from your bag. No mystery airport dog menu.'
    : 'Pickles wins the dinner negotiations. Allow five minutes for his usual food from your bag, then head to the gate. Your dinner can wait.';
  return { choice, extraMinutes, steps, reply, arrival: timeLabel(arrivalMinutes), buffer: scenario.flight.boardingMinutes - arrivalMinutes };
}
export function travelerMessage(turn: Turn, scenario: Scenario): string {
  if (turn === 1) return TRIP.initialMessage;
  if (turn === 2) return scenario.flight.choice;
  if (turn === 3) return 'Before we go: Pickles needs a pet stop. He’s giving me the look.';
  if (turn === 4) return 'We made it to pet relief. Pickles is ready to move. Anything changed?';
  if (turn === 5) return scenario.food === 'gate' ? 'Dinner can wait. Get us straight to the gate.' : scenario.food === 'pickles' ? 'Pickles needs his usual food from my bag. I can eat later. Is there time?' : 'I need dinner. Pickles needs his usual food from my bag. Apparently my sandwich doesn’t count. Can we fit both in?';
  return 'Got it. We’ll follow that plan. Pickles would like to award you one imaginary biscuit.';
}
export const NEXT_BEAT: Record<2 | 3 | 4 | 5 | 6, { context: string; label: string }> = {
  2: { context: 'Choose what works for you and your dog.', label: 'Choose your flight' },
  3: { context: 'One small problem before you head to the gate…', label: 'Ask about a pet stop' },
  4: { context: 'Eight minutes later · You’re at pet relief with Pickles.', label: 'Check for updates' },
  5: { context: 'One last plot twist: two hungry travelers. Two very different dinners.', label: 'Make a dinner plan' },
  6: { context: 'A plan for the gate. A plan for the hungry duo.', label: 'Thank Alex and follow the plan' },
};
export interface ScriptBlock {
  phrases: string[]; message?: string; attachment?: 'flights' | 'map' | 'update' | 'plan' | 'food';
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
  if (turn === 5) {
    const dinner = getDinnerPlan(scenario);
    return [
      { phrases: [dinner.reply], message: dinner.reply, attachment: 'food' },
      { phrases: [`${dinner.steps.join('. ')}. You’ll be ready at the gate around ${dinner.arrival}, ${dinner.buffer} minutes before boarding at ${timeLabel(f.boardingMinutes)}.`],
        message: `${dinner.steps.join(' → ')}. Ready at ${f.gate} around ${dinner.arrival} PM · ${dinner.buffer} min before boarding.` },
    ];
  }
  return [
    { phrases: [`You’re welcome. Head to ${f.gate}, and keep an eye on airport updates. Have a good trip home, both of you.`],
      message: `Imaginary biscuit accepted. 🐾 Your flight and dinner plan are here. Safe trip home, both of you.`, attachment: 'plan' },
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
