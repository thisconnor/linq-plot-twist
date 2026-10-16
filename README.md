# Plot Twist Travel — version 4

A guided Linq product preview: the same fictional AI travel assistant through a voice call and iMessage. The opening explains a proposed growth tactic: select companies by customer profile and relevant signals, have AI custom-build a lightweight demo for each company, review it, then send a cold email invitation before asking for a meeting.

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

- Linq introduction, a subtly branded developer inbox, then a cream/plum/coral Plot Twist customer experience with its own logo.
- A focused landing, three sequential explanation screens, a developer invitation, then clear introductions to Alex and Pickles.
- One canceled-flight story with Pickles, two flight-choice paths, a pet stop, a gate change, and a three-way dinner decision. All six flight-and-food combinations complete.
- Six user-controlled interaction stages, with natural voice wording, short message bursts, fading captions, and persistent Messages history.
- Generated fictional contact portrait, simulated contact sharing, and distinct delivered/read/reaction/typing events.
- Original and updated SVG routes, historical map snapshots, and a retained itinerary.
- Smaller, paired voice/iMessage notes, with one hide/reopen control that persists across beats.
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
- `src/App.tsx`: screens, simulated interfaces, flight cards, and controls.
- `src/Brands.tsx`: fictional Plot Twist logo and official Linq lockup.
- `src/Funnel.tsx`: landing and sequential growth explanation.
- `src/WhyMessage.tsx`: paired event-triggered channel notes.
- `public/alex-avatar.jpg`: generated fictional contact portrait.
- `src/AirportMap.tsx`: illustrative diagram.
- `src/styles.css`: visual tokens and responsive behavior.
- `src/telemetry.ts`: local-only demo events.

Keep both channel renderers on the same canonical facts. Channel wording can differ; the options, recommendation, selected flight, and route must agree. The scenario starts at 5:25 PM, then explicitly advances to 5:33 after the pet stop. Playback duration does not advance travel time.

After the gate change, the nonstop reaches B18 at 5:39 PM; the connection reaches B20 at 5:41 PM. Earlier maps remain historical snapshots. See [scenario decisions](docs/scenario-decisions.md).

## Testing and deployment

The 28-test automated suite checks all six flight-and-food paths, food feasibility, original and updated route arithmetic, historical snapshot preservation, shared flight-option facts, message-event ordering, stale callbacks, cancellation, caption pacing, and audio success/failure/missing-callback behavior. The deploy script runs the suite and production build before publishing.

For browser QA only, the development server accepts `?qa=1`, which accelerates captions without audio. This flag is gated by `import.meta.env.DEV` and has no effect in the production build. Use the normal URL for pacing and audio review.

GitHub Pages serves the prebuilt `gh-pages` branch. Run `npm run deploy` from a clean, committed checkout to test, build, and publish it. The deploy script preserves the branch history and records the source commit in `version.json`. The current GitHub credential can publish branches but cannot upload Actions workflows, so this deployment does not require a new credential scope.

To connect a verified meeting destination later, set `BRAND.meetingUrl` in `src/scenario.ts`; leave it blank to retain the prototype modal.

## Design references

- [Hallmark](https://github.com/nutlope/hallmark) for hierarchy, restraint, and avoiding generic layouts. Simulated phone chrome is intentional because it is the demonstration itself.
- [No AI Slop](https://github.com/petergyang/no-ai-slop) for concrete, edited copy.
- [Linq](https://linqapp.com/) for restrained brand context.
- [Linq contact cards](https://docs.linqapp.com/channel/imessage/guides/contact-cards/), [messaging](https://docs.linqapp.com/channel/imessage/guides/messaging/), and [typing indicators](https://docs.linqapp.com/channel/imessage/guides/chats/typing-indicators/) for feature presentation.

Manrope is bundled locally through Fontsource under its open font license. Icons are from Lucide. No remote fonts or stock photography are required.

Linq logo asset: official homepage lockup, retrieved October 15, 2026 from https://res.cloudinary.com/linq/image/upload/v1775832022/website/homepage/Logo_lock_up_0-00-00-00_yya5pq.png. The Plot Twist logo is an original fictional mark for this demo.
