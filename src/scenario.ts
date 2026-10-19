import trip from "./data/trip.json";

export const TRIP = trip;
export const BRAND = {
  company: trip.company,
  assistant: trip.assistant,
  avatar: trip.avatar,
  meetingUrl: "",
};
export const timeLabel = (minutes: number) =>
  `${Math.floor(minutes / 60) % 12 || 12}:${String(minutes % 60).padStart(2, "0")}`;
export const ROUTE = {
  arrival: timeLabel(trip.updateMinutes + trip.route.walkMinutes),
  buffer: trip.selected.boarding - trip.updateMinutes - trip.route.walkMinutes,
};
export type Beat = 0 | 1 | 2;
export type Attachment = "flights" | "gate" | "map";
export interface Reply {
  text: string;
  attachment?: Attachment;
}
export interface StoryBeat {
  id: string;
  label: string;
  clock: number;
  draft: string;
  caller: string;
  narration: string[];
  replies: Reply[];
  reaction?: string;
}
const f = trip.selected;
const a = trip.alternative;
export const STORY: StoryBeat[] = [
  {
    id: "options",
    label: "A canceled flight",
    clock: trip.startMinutes,
    draft: `${trip.keyword} — my flight was canceled. Can you get me and Pickles home tonight?`,
    caller: "My flight was canceled. Can you get me and Pickles home tonight?",
    narration: [
      `I can help. There are two flights home tonight. Pickles can travel on either one.`,
      `The nonstop leaves at ${timeLabel(f.departure)} and arrives at ${timeLabel(f.arrival)}.`,
      `The connection leaves at ${timeLabel(a.departure)} and arrives at ${timeLabel(a.arrival)}, with ${a.layoverMinutes} minutes in ${a.connection}.`,
      `I’d take the nonstop. One less plane change for Pickles.`,
    ],
    replies: [
      {
        text: "Hi, I’m Alex, Plot Twist’s AI travel assistant. Let’s get you and Pickles home.",
      },
      {
        text: "Two flights tonight. Pickles can travel on either one.",
        attachment: "flights",
      },
      { text: "I’d take the nonstop. One less plane change for Pickles." },
    ],
  },
  {
    id: "confirmation",
    label: "One simple choice",
    clock: trip.startMinutes,
    draft:
      "The nonstop, please. We’re stopping at pet relief beside B10 first.",
    caller:
      "The nonstop, please. We’re stopping at pet relief beside B10 first.",
    narration: [
      `${f.flight}, the nonstop. Gate ${f.oldGate}. Boarding at ${timeLabel(f.boarding)}, departure at ${timeLabel(f.departure)}.`,
      `Stop at pet relief beside B10 first. You have time.`,
    ],
    replies: [
      {
        text: `The nonstop: ${f.flight} · ${timeLabel(f.departure)} PM. Gate ${f.oldGate}, boarding ${timeLabel(f.boarding)} PM.`,
      },
      { text: "Pet relief beside B10 works. Stop there first; you have time." },
    ],
    reaction: "👍",
  },
  {
    id: "gate-change",
    label: "Eight minutes later",
    clock: trip.updateMinutes,
    draft: "We’re at pet relief. Any updates before we head over?",
    caller: "We’re at pet relief. Any updates before we head over?",
    narration: [
      `One update: ${f.flight} now boards at ${f.gate}, instead of ${f.oldGate}. Boarding is still ${timeLabel(f.boarding)}.`,
      `From pet relief, walk along the B concourse to ${f.gate}. It takes ${trip.route.walkMinutes} minutes.`,
      `You’ll arrive around ${ROUTE.arrival}, with over an hour before boarding.`,
    ],
    replies: [
      {
        text: `New gate: ${f.gate}, replacing ${f.oldGate}. Boarding is still ${timeLabel(f.boarding)} PM.`,
        attachment: "gate",
      },
      {
        text: `${trip.route.from} to ${f.gate}: follow the B concourse. ${trip.route.walkMinutes} min on foot; arrive around ${ROUTE.arrival} PM.`,
        attachment: "map",
      },
      {
        text: "Your updated gate and route are here whenever you need them. Safe trip home, both of you.",
      },
    ],
  },
];
export const ATTACHMENTS: Record<
  Attachment,
  { src: string; alt: string; title: string }
> = {
  flights: {
    src: "./demo/flights.png",
    title: "Tonight’s flight options",
    alt: `${trip.airline} sample flights. ${f.flight}, nonstop, ${timeLabel(f.departure)} to ${timeLabel(f.arrival)} PM. ${a.flight}, one stop, ${timeLabel(a.departure)} to ${timeLabel(a.arrival)} PM, ${a.layoverMinutes} minutes in ${a.connection}. Neither option is a booked ticket.`,
  },
  gate: {
    src: "./demo/gate.png",
    title: "Updated flight details",
    alt: `${f.flight} gate change from ${f.oldGate} to ${f.gate}. Boarding ${timeLabel(f.boarding)} PM, departure ${timeLabel(f.departure)} PM, home at ${timeLabel(f.arrival)} PM. Sample flight data; no ticket issued.`,
  },
  map: {
    src: "./demo/map.png",
    title: `Directions to ${f.gate}`,
    alt: `Fictional ${trip.airport} terminal diagram. From pet relief beside B10 follow the B concourse to ${f.gate}, a ${trip.route.walkMinutes}-minute walk. At ${timeLabel(trip.updateMinutes)} PM, estimated arrival ${ROUTE.arrival} PM, ${ROUTE.buffer} minutes before boarding. Diagram is not to scale.`,
  },
};
export function captionPhrases(text: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const size = Math.ceil(
    words.length / Math.max(1, Math.ceil(words.length / 11)),
  );
  const result: string[] = [];
  while (words.length) result.push(words.splice(0, size).join(" "));
  return result;
}
export const phraseDuration = (text: string) =>
  Math.max(1800, text.split(/\s+/).length * 350 + 300);
