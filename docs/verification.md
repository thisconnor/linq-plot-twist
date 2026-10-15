# Version 2 verification

Updated October 15, 2026. The agreed revision replaces the six constraint combinations with two complete flight decisions.

## Automated checks

`npm test` passes 15 tests covering:

- Both complete paths, with unique messages, retained flight/map attachments and selected itinerary.
- Route duration, arrival and boarding-buffer arithmetic for B12 and B16.
- Identical flight options and recommendation before the decision, regardless of later selection.
- Delivered → read → reaction → typing → reply event ordering.
- Invalid flights, duplicate begins and stale activity after reset.
- Cancellation, audio success/error/absent completion/throw, and changing the audio preference.
- Caption reading time and word preservation.

`npm run build` type-checks and builds the static Pages artifact. Motion’s ignored `use client` directives are build warnings from the dependency, not runtime errors.

## Browser QA

- Clicked all five funnel stages, opened the developer invitation, and entered the traveler setup.
- Both flight paths completed in the actual UI with accelerated development playback; B12 and B16 map/itinerary facts matched their selections.
- Funnel, developer, traveler, and comparison layouts checked at 320, 375, 768 and 1440 pixels with no document horizontal overflow.
- Mobile Voice/iMessage switching preserved all 12 message groups and progression.
- Enlarged map and CTA modal opened; keyboard focus stayed inside the modal, Escape closed it, and focus returned to the invoking button.
- Keyboard-only path completed under emulated reduced motion; animation duration was reduced and emulation was then reset.
- Persistent captions were enabled and retained multiple spoken phrases.
- Reset during an in-flight response returned to setup with no remaining messages.
- Production-build normal-speed journey: first turn muted, connection-plan turn with optional browser audio enabled, final turn muted. The audio-enabled turn reached confirmation.

Development-only `?qa=1` accelerates muted playback for path and reset testing. It has no effect in the production build. Audio success means the browser flow completed; voice quality on other devices is not established.

## Limits

This is a browser simulation with fictional travel facts. No physical iPhone, native Messages, Linq integration, live flight availability, tickets, human outreach, or usability experiment was tested. Browser speech synthesis depends on installed voices and device behavior; captions and the watchdog support completion when audio is unavailable. Local event logging is not a production analytics pipeline.
