export type FlightId = 'direct' | 'connection';
export type Turn = 1 | 2 | 3;
export const BRAND = {
  company: 'Plot Twist Travel', assistant: 'Alex', avatar: './alex-avatar.jpg', meetingUrl: '',
};
export const TRIP = {
  airline: 'Plot Air', airport: 'Harbor City Airport', terminal: 'Terminal 2',
  cancelledFlight: 'PT204', startMinutes: 17 * 60 + 25,
  petWalk: 3, petStop: 5,
  initialMessage: 'My flight just got canceled. My ex has already left for Lisbon. Somehow I’m at the airport with our dog, Pickles. Can you get us home?',
};
export interface Flight {
  id: FlightId; flight: string; destination: string; departureMinutes: number;
  boardingMinutes: number; arrivalMinutes: number; arrivalDay: string;
  gate: string; stops: string; layover: string; petToGate: number;
  label: string; choice: string;
}
export const FLIGHTS: Flight[] = [
  { id: 'direct', flight: 'PT218', destination: 'Home · Northport', departureMinutes: 19 * 60 + 20,
    boardingMinutes: 18 * 60 + 50, arrivalMinutes: 21 * 60 + 40, arrivalDay: 'tonight', gate: 'B12',
    stops: 'Nonstop', layover: 'No plane change', petToGate: 4,
    label: 'Keep it simple', choice: 'The nonstop. Pickles has had enough plot twists.' },
  { id: 'connection', flight: 'PT306', destination: 'Home via Meadow City', departureMinutes: 18 * 60 + 15,
    boardingMinutes: 17 * 60 + 45, arrivalMinutes: 20 * 60 + 55, arrivalDay: 'tonight', gate: 'B16',
    stops: 'One stop', layover: '40 min in Meadow City', petToGate: 6,
    label: 'Get home earlier', choice: 'The connection. I’d like to get home earlier.' },
];
export function timeLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 12 || 12;
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`;
}
export interface Scenario {
  key: FlightId; flight: Flight; minutes: number; arrival: string; buffer: number;
  routeLabel: string; stops: string[]; initialMessage: string;
}
export function getScenario(id: FlightId = 'direct'): Scenario {
  const flight = FLIGHTS.find(f => f.id === id);
  if (!flight) throw new Error('Choose one of the available sample flights.');
  const minutes = TRIP.petWalk + TRIP.petStop + flight.petToGate;
  return { key: id, flight, minutes, arrival: timeLabel(TRIP.startMinutes + minutes),
    buffer: flight.boardingMinutes - TRIP.startMinutes - minutes,
    routeLabel: `Pet stop, then ${flight.gate}`, stops: ['Pet relief · B10', `Gate ${flight.gate}`], initialMessage: TRIP.initialMessage };
}
export interface ScriptBlock {
  phrases: string[];
  message?: string;
  attachment?: 'flights' | 'map';
}
export function getTurn(scenario: Scenario, turn: Turn): ScriptBlock[] {
  const f = scenario.flight;
  const [direct, connection] = FLIGHTS;
  const bufferText = scenario.buffer >= 60 ? 'over an hour before boarding' : `${scenario.buffer} minutes before boarding`;
  const messageBuffer = scenario.buffer >= 60 ? 'Over an hour before boarding.' : `${scenario.buffer} min before boarding.`;
  if (turn === 1) return [
    { phrases: ['Okay. Let’s get you and Pickles home.'], message: 'Okay. Let’s get you and Pickles home. 🐾' },
    { phrases: ['There are two options. Pickles is already cleared to travel on either one.'] },
    { phrases: [`The nonstop leaves at ${timeLabel(direct.departureMinutes)} and gets you home at ${timeLabel(direct.arrivalMinutes)} tonight.`,
      `The connection leaves at ${timeLabel(connection.departureMinutes)}, with forty minutes in Meadow City. You get home at ${timeLabel(connection.arrivalMinutes)} tonight.`],
      message: 'Two ways home. Earlier arrival, or one less plane change?', attachment: 'flights' },
    { phrases: ['I’d take the nonstop for a simpler trip with Pickles. Which would you prefer?'],
      message: 'I’d take the nonstop. One less plane change for Pickles. Your call.' },
  ];
  if (turn === 2) return [
    { phrases: [`${f.stops === 'Nonstop' ? 'The nonstop' : 'The connection'} it is. ${f.flight} leaves at ${timeLabel(f.departureMinutes)} from ${f.gate}. Boarding starts at ${timeLabel(f.boardingMinutes)}.`],
      message: `${f.stops === 'Nonstop' ? 'Nonstop' : 'Connection'} it is. ${f.flight} · ${timeLabel(f.departureMinutes)} PM · ${f.gate}. Boarding ${timeLabel(f.boardingMinutes)} PM.` },
    { phrases: [`Pet relief is beside B10, a ${TRIP.petWalk}-minute walk. Allow ${TRIP.petStop} minutes for Pickles, then ${f.petToGate} minutes to ${f.gate}.`],
      message: `Pickles first. 🐶 Pet relief by B10: ${TRIP.petWalk} min there, ${TRIP.petStop} min stop, then ${f.petToGate} min to ${f.gate}.`, attachment: 'map' },
    { phrases: [`Leave now and you’ll reach the gate around ${scenario.arrival}, ${bufferText}.`],
      message: `Leave now → ${f.gate} around ${scenario.arrival}. ${messageBuffer}${scenario.buffer < 10 ? ' Keep the stop short.' : ''}` },
  ];
  return [
    { phrases: [`You and Pickles have a plan. Gate ${f.gate}, boarding at ${timeLabel(f.boardingMinutes)}, departure at ${timeLabel(f.departureMinutes)}.`],
      message: 'You and Pickles have a plan. 🐾' },
    { phrases: [`Pet stop, then ${f.gate}. Keep an eye on airport updates.`],
      message: `Pet stop → ${f.gate}. Your route and flight details are right here. Keep an eye on airport updates.` },
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
