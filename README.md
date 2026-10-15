# Plot Twist Travel

A guided Linq product preview: the same fictional AI travel assistant through a voice call and iMessage. The opening explains a proposed growth tactic: offer a relevant product experience before asking a qualified prospect for a meeting.

## Run

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

The production build is static output in `dist/`. Asset URLs are relative, so it works under a GitHub Pages repository path.

## Entry points

- `/`: reviewer introduction, followed by the prospect walkthrough.
- `/#/preview`: begin at the mock outreach email.

Refreshing resets the walkthrough to its entry point. Only the optional caption preference is retained in session storage.

## What works

- All six one- or two-constraint combinations and both follow-ups for each.
- Three synchronized turns, fading voice captions, persistent Messages history.
- Simulated contact sharing, typing, read status, and a thumbs-up acknowledgement.
- Route-specific SVG diagram with an expanded view and retained itinerary.
- Mobile channel switching without restarting the conversation.
- Optional browser speech synthesis, with timed-caption fallback and a watchdog.
- Keyboard access, modal focus management, reduced motion, and persistent captions.
- Restart cancellation to prevent old replies or audio continuing into a new run.
- Local event logging, available as `window.plotTwistEvents` in DevTools.

Everything is scripted and all travel data is fictional. No Linq API, phone number, microphone, booking service, live model, or analytics transport is connected. The final CTA opens an explanatory modal. Events remain in memory and reset on reload. GitHub Pages may maintain its own standard hosting logs.

## Editing

- `src/scenario.ts`: shared facts, assistant identity, route calculations, scripts, and optional meeting URL.
- `src/state.ts`: explicit walkthrough state and transitions.
- `src/playback.ts`: cancellable phrase playback and browser audio fallback.
- `src/App.tsx`: screens, simulated interfaces, and controls.
- `src/AirportMap.tsx`: illustrative diagram.
- `src/styles.css`: visual tokens and responsive behavior.
- `src/telemetry.ts`: local-only demo events.

Keep both channel renderers on the same scenario and script. Do not add alternative facts to one interface. The scenario clock is fixed at 5:25 PM; browser animation time does not advance travel time.

The food route adds a two-minute walk to the kiosk, then five minutes for pickup and six to the gate. The combined food/pet route is 19 minutes. See [scenario decisions](docs/scenario-decisions.md).

## Testing and deployment

The automated suite checks all twelve complete paths, arrival arithmetic, invalid selections, cancellation, caption pacing, and audio success/failure/missing-callback behavior. The deploy script runs the suite and production build before publishing.

For browser QA only, the development server accepts `?qa=1`, which accelerates captions without audio. This flag is gated by `import.meta.env.DEV` and has no effect in the production build. Use the normal URL for pacing and audio review.

GitHub Pages serves the prebuilt `gh-pages` branch. Run `npm run deploy` from a clean, committed checkout to test, build, and publish it. The deploy script preserves the branch history and records the source commit in `version.json`. The current GitHub credential can publish branches but cannot upload Actions workflows, so this deployment does not require a new credential scope.

To connect a verified meeting destination later, set `BRAND.meetingUrl` in `src/scenario.ts`; leave it blank to retain the prototype modal.

## Design references

- [Hallmark](https://github.com/nutlope/hallmark) for hierarchy, restraint, and avoiding generic layouts. Simulated phone chrome is intentional because it is the demonstration itself.
- [No AI Slop](https://github.com/petergyang/no-ai-slop) for concrete, edited copy.
- [Linq](https://linqapp.com/) for restrained brand context.
- [Linq contact cards](https://docs.linqapp.com/channel/imessage/guides/contact-cards/), [messaging](https://docs.linqapp.com/channel/imessage/guides/messaging/), and [typing indicators](https://docs.linqapp.com/channel/imessage/guides/chats/typing-indicators/) for feature presentation.

Manrope is bundled locally through Fontsource under its open font license. Icons are from Lucide. No remote fonts or stock photography are required.
