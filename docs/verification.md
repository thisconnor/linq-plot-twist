# Version 3 verification

Updated October 15, 2026. Current scope: simple landing, three explanation steps, developer/traveler setup, and two six-beat flight paths.

## Automated checks

`npm test`: 17 tests pass, covering both complete six-beat paths, original and updated route/boarding arithmetic, historical scenario snapshots, flight-option consistency, delivered/read/reaction/typing ordering, invalid choices, duplicate starts, stale callbacks, cancellation, audio success/error/missing completion/throw, audio preference changes, and caption pacing.

`npm run build`: TypeScript and static Vite build pass. Motion’s ignored `use client` directives remain dependency build warnings.

## Browser QA

The landing, Back/Next explanation, explicit Alex/Pickles introductions, desktop feature callouts, callout dismissal/reopening, and gate-change story have been checked in the actual UI. Both old and new map dialogs retain the correct gate and timing. Both flight paths are exercised through all six beats. Landing, explanation and comparison were checked at 320, 375, 768, 1100, 1320 and 1440 pixels. Setup was also checked at phone/tablet widths. No document horizontal overflow; the feature callouts stay inside the viewport. Sequential Back/Next navigation, callout dismissal/reopening and keyboard progression were exercised. Persistent captions retain spoken text; reduced-motion emulation worked and was cleared afterward. A reset returned to setup without retained messages.

Normal-speed production preview: muted flight-option and selection turns, followed by the pet-route response with browser audio enabled. The audio-enabled response reached the next action, with no browser warnings or errors. Browser audio completion does not establish voice quality on other devices.

Development-only `?qa=1` accelerates muted playback for repeated path tests. It has no effect on the production build.

## Limits

This is a scripted browser simulation. Physical iPhone/native Messages behavior, Linq integration, flight availability, ticketing, outreach and human usability have not been tested. Browser audio quality depends on installed voices; timed captions and the watchdog support completion when speech is unavailable. Local events remain in memory, with no analytics transport.
