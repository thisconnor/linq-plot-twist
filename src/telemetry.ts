type LocalEvent = {
  name: string;
  at: number;
  properties?: Record<string, string | number | boolean | string[]>;
};
const events: LocalEvent[] = [];

export function track(name: string, properties?: LocalEvent['properties']) {
  events.push({ name, at: Date.now(), ...(properties ? { properties } : {}) });
}

// Inspect in DevTools. Events stay in memory and reset on reload. No network transport.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'plotTwistEvents', {
    get: () => events.map((event) => ({ ...event })),
  });
}
