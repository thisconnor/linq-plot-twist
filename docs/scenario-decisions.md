# Version 2 scenario decisions

Connor approved this revision after reviewing version 1. The newer direction supersedes the brief’s constraint picker and exact sentence parity: one memorable story, two flight decisions, equally capable channels, and channel-appropriate wording.

## Canonical sample facts

The traveler is at fictional Harbor City Airport, Terminal 2, at 5:25 PM. Plot Air PT204 has been canceled. Their ex is in Lisbon; they are getting home with their shared dog, Pickles. Pickles is already cleared to travel on both sample options.

| Choice | Flight | Departure | Boarding | Home tonight | Connection | Gate |
|---|---|---|---|---|---|---|
| Simpler trip | PT218 | 7:20 PM | 6:50 PM | 9:40 PM | Nonstop | B12 |
| Earlier arrival | PT306 | 6:15 PM | 5:45 PM | 8:55 PM | 40 minutes in Meadow City | B16 |

All clocks use one fictional local time zone. The fixed scenario clock does not advance during browser animation. Flight options are illustrative; choosing a plan does not issue a ticket.

Pet relief is beside B10: three minutes from the starting point, five minutes for the stop. B12 is four minutes from pet relief; B16 is six minutes away. Thus the nonstop route takes 12 minutes, arriving at 5:37 with 73 minutes before boarding. The connection route takes 14 minutes, arriving at 5:39 with six minutes before boarding. The connection reply asks the traveler to keep the stop short.

The SVG route follows corridor centerlines and terminates at the selected gate marker. Geometry is illustrative, not a routing engine.

## Walkthrough

1. Reviewer: explore the five-stage proposed growth funnel. A visible shortcut skips to the traveler setup.
2. Developer: see a mock Linq invitation offering an iMessage preview of their existing voice assistant. A branching question graphic sets up relevance, customer value, and meeting interest.
3. Traveler: enter the Pickles story. The existing voice agent and proposed iMessage channel receive the same request.
4. Turn one: Alex offers both flights and recommends the nonstop for fewer plane changes. Both channels share the same options and recommendation.
5. Turn two: choose either flight. Alex provides its gate, boarding, departure, and pet route.
6. Turn three: thank Alex. The selected itinerary remains in Messages. The closing returns to the developer’s perspective and growth funnel before the prototype meeting CTA.

Voice speaks naturally; Messages uses short bursts and visual attachments. Facts come from `src/scenario.ts`. Read, reaction, typing, and reply are distinct timed events. Messages and voice advance independently within a turn; the next decision becomes available when both finish. No long timer forces the visitor to leave the plan screen.

## Assets and scope

Alex’s portrait is a generated fictional person, labeled as an AI travel assistant in the call and contact-sharing card. The same configurable portrait appears in both channels. Plot Air branding and the airport diagram are original code-based graphics. No real airline or airport affiliation is suggested.

No microphone, messaging provider, live travel data, booking, analytics transport, or meeting router is connected. Existing-caption accessibility, optional browser audio fallback, reduced motion, and cancellation on reset are retained.
