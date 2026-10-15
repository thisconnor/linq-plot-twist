export type Constraint = 'dog' | 'battery' | 'food';
export type FollowupId = 'time' | 'route';
export type Turn = 1 | 2 | 3;

export const BRAND = {
  company: 'Plot Twist Travel',
  assistant: 'Alex',
  meetingUrl: '',
};

export const TRIP = {
  flight: 'PT204',
  airline: 'Plot Air',
  airport: 'Harbor City Airport',
  terminal: 'Terminal 2',
  startMinutes: 17 * 60 + 25,
  boardingMinutes: 17 * 60 + 50,
  departureMinutes: 18 * 60 + 20,
  originalDeparture: '4:55',
  oldGate: 'B8',
  gate: 'B12',
  directWalk: 6,
  petWalk: 3,
  petStop: 5,
  petToGate: 4,
  foodWalk: 2,
  foodPickup: 5,
  foodToGate: 6,
  foodToPet: 3,
} as const;

export const CONSTRAINTS: { id: Constraint; title: string; detail: string }[] =
  [
    {
      id: 'dog',
      title: 'I’m traveling with my dog.',
      detail: 'A quick pet stop would help.',
    },
    {
      id: 'battery',
      title: 'My phone battery is low.',
      detail: 'Keep it short. Get me to a charger.',
    },
    {
      id: 'food',
      title: 'I need something to eat.',
      detail: 'Something quick before boarding.',
    },
  ];

export function timeLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 12 || 12;
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`;
}

export interface Scenario {
  key: string;
  constraints: Constraint[];
  minutes: number;
  arrival: string;
  buffer: number;
  routeLabel: string;
  stops: string[];
  initialMessage: string;
  advice: string[];
  followups: { id: FollowupId; label: string; response: string[] }[];
  closing: string;
}

export function getScenario(input: Constraint[]): Scenario {
  const constraints = CONSTRAINTS.map((c) => c.id).filter((id) =>
    input.includes(id),
  );
  if (
    constraints.length < 1 ||
    constraints.length > 2 ||
    input.length !== constraints.length
  ) {
    throw new Error('Choose one or two different constraints.');
  }
  const dog = constraints.includes('dog');
  const food = constraints.includes('food');
  const battery = constraints.includes('battery');
  const minutes =
    dog && food
      ? TRIP.foodWalk +
        TRIP.foodPickup +
        TRIP.foodToPet +
        TRIP.petStop +
        TRIP.petToGate
      : dog
        ? TRIP.petWalk + TRIP.petStop + TRIP.petToGate
        : food
          ? TRIP.foodWalk + TRIP.foodPickup + TRIP.foodToGate
          : TRIP.directWalk;
  const arrival = timeLabel(TRIP.startMinutes + minutes);
  const buffer = TRIP.boardingMinutes - TRIP.startMinutes - minutes;
  const stops = [
    ...(food ? ['Food kiosk'] : []),
    ...(dog ? ['Pet relief · B10'] : []),
    'Gate B12',
  ];
  const routeLabel =
    dog && food
      ? 'Food, pet stop, then B12'
      : dog
        ? 'Pet stop, then B12'
        : food
          ? 'Food, then B12'
          : 'Straight to B12';
  const descriptions = [
    dog && 'I’m traveling with my dog',
    battery && 'my phone battery is low',
    food && 'I need something to eat',
  ].filter(Boolean) as string[];
  const initialMessage = `My flight was delayed. ${descriptions.map((v, i) => (i === 0 ? v[0].toUpperCase() + v.slice(1) : v)).join(' and ')}. What’s the plan?`;
  const advice =
    dog && food
      ? [
          'Pick up food at the concourse kiosk first, then make a short pet stop beside B10.',
          `Allow ${minutes} minutes for the route and stops. You’ll reach B12 around ${arrival}.`,
        ]
      : dog
        ? [
            'Pet relief is beside B10. Take a short stop, then head to B12.',
            `Allow ${minutes} minutes for the walk and stop. You’ll reach the gate around ${arrival}.`,
          ]
        : food
          ? [
              'The concourse kiosk is two minutes away. Allow five minutes for pickup, then six to B12.',
              `You’ll reach the gate around ${arrival}.`,
            ]
          : [
              'Head straight to B12. It’s a six-minute walk.',
              `You’ll arrive around ${arrival}. There’s charging at the gate seating; free ports aren’t guaranteed.`,
            ];
  if (battery && (dog || food)) {
    advice.splice(
      0,
      advice.length,
      dog
        ? `Short pet stop beside B10, then B12. Allow ${minutes} minutes; arrive around ${arrival}.`
        : `Food kiosk first, then B12. Allow ${minutes} minutes; arrive around ${arrival}.`,
      'Charge at the B12 seating. Free ports aren’t guaranteed.',
    );
  }
  const timeQuestion =
    dog && food
      ? 'Do I have time for both stops?'
      : dog
        ? 'Do I have time to stop now?'
        : food
          ? 'How much time will I have?'
          : 'Where can I charge?';
  const timeResponse =
    !dog && !food
      ? [
          'There’s charging at the B12 seating, but port availability is unknown.',
          `The direct walk gets you there around ${arrival}, ${buffer} minutes before boarding.`,
        ]
      : [
          `${dog ? 'Yes. ' : ''}Leaving now gets you to B12 around ${arrival}, ${buffer} minutes before boarding.`,
          ...(battery
            ? ['Keep the stop short, then look for charging at the gate.']
            : ['Keep an eye on airport updates.']),
        ];
  const routeResponse =
    dog && food
      ? [
          'Food first: two minutes to the kiosk, five for pickup, then three to pet relief beside B10.',
          'Take a five-minute pet stop, then walk four minutes to B12.',
        ]
      : dog
        ? [
            'Walk three minutes to pet relief beside B10. Allow five minutes for the stop.',
            'Then follow the concourse to B12, another four minutes away.',
          ]
        : food
          ? [
              'Walk two minutes to the concourse kiosk and allow five for pickup.',
              'Then continue to B12, a six-minute walk.',
            ]
          : [
              'Follow the Terminal 2 concourse directly to B12, about six minutes away.',
              'Charging is at the gate seating. Check for an available port when you arrive.',
            ];
  return {
    key: constraints.join('-'),
    constraints,
    minutes,
    arrival,
    buffer,
    routeLabel,
    stops,
    initialMessage,
    advice,
    followups: [
      { id: 'time', label: timeQuestion, response: timeResponse },
      {
        id: 'route',
        label:
          dog && food
            ? 'Which stop comes first?'
            : 'Remind me how to get there.',
        response: routeResponse,
      },
    ],
    closing: battery
      ? `${dog || food ? 'Head to B12 after your stop' : 'Head straight to B12'} and look for an available charging port.`
      : 'Follow your route to B12 and keep an eye on airport updates.',
  };
}

export interface ScriptBlock {
  phrases: string[];
}
export function getTurn(
  scenario: Scenario,
  turn: Turn,
  followup: FollowupId = 'time',
): ScriptBlock[] {
  if (turn === 1)
    return [
      {
        phrases: [
          `Your flight now leaves at ${timeLabel(TRIP.departureMinutes)} from ${TRIP.gate}.`,
          `Boarding starts at ${timeLabel(TRIP.boardingMinutes)}.`,
        ],
      },
      { phrases: scenario.advice },
    ];
  if (turn === 2)
    return [
      {
        phrases: scenario.followups.find((item) => item.id === followup)!
          .response,
      },
    ];
  return [
    {
      phrases: [
        `You’re set: gate ${TRIP.gate}, boarding at ${timeLabel(TRIP.boardingMinutes)}, departure at ${timeLabel(TRIP.departureMinutes)}.`,
        scenario.closing,
      ],
    },
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
  return Math.max(
    1700,
    text.split(/\s+/).length * 360 + (/[.!?]$/.test(text) ? 450 : 150),
  );
}
