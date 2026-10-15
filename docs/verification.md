# Verification

Verified October 15, 2026.

## Automated

`npm test`: 26 passing tests.

- All six selections have the expected route duration, arrival time, and boarding buffer.
- All twelve full journeys (two follow-ups for each selection) reach the final itinerary.
- Shared spoken and messaging text remains equivalent across the full conversation.
- Empty, duplicate, and three-constraint inputs are rejected.
- Cancellation prevents old playback from finishing after restart; stale state updates are ignored.
- Audio success, an error callback, a missing callback, and a throwing audio implementation all permit completion.
- Audio preference changes apply between phrases.
- Caption chunks retain every word and have a minimum reading duration.

`npm run build`: passing TypeScript check and production build.

Dependency audit at installation: zero known vulnerabilities after updating Vitest.

## Browser

Tested with the Codex in-app Chromium browser:

- All twelve complete journeys through the actual UI using development-only accelerated playback.
- Intro and comparison layouts at 320, 375, 768, and 1440 pixels without document horizontal overflow.
- Mobile channel switching preserves the current conversation and messages.
- Empty selection keeps the start action disabled; choosing two disables the remaining third option.
- Keyboard activation through setup and scenario selection.
- Expanded diagram, dialog focus trapping, Escape, and return of focus to the opener.
- Persistent captions preserve spoken content. The preference is session-only.
- Reduced-motion emulation: waveform animation reduced and the journey still completes. Emulation was reset afterward.
- CTA explanation opens and closes without claiming a meeting was booked.
- Browser console error check: none observed during the complete local path sweep.

GitHub Pages production was checked at normal playback speed through the dog/food route, including an audio-enabled follow-up and a return to muted captions. The live response uses the correct 19-minute route, 5:44 arrival, and six-minute boarding buffer. The published `version.json` identifies the source commit used to build the static site.

## Limits

This is a scripted browser preview. No physical iPhone, native iMessage conversation, live Linq line, real call, or booking integration was tested. Browser audio voices and availability vary by device; the completion checks do not establish consistent sound quality across devices. The proposed customer usability and outreach experiments have not been run.
