# Version 4 verification

Updated October 15, 2026. Scope: signal-based targeting and AI-built demos in the explanation; distinct developer/customer branding; paired channel notes; six beats with two flight options and three dinner choices; partnership ending.

## Automated checks

`npm test`: 28 tests pass. Coverage includes all six flight-and-food paths, dinner feasibility, original and updated route/boarding arithmetic, historical scenario snapshots, flight-option consistency, delivered/read/reaction/typing ordering, invalid flights, duplicate starts, stale callbacks, cancellation, audio success/error/missing completion/throw, preference changes, and caption pacing.

`npm run build`: TypeScript and static Vite build pass. Motion’s ignored `use client` directives remain dependency build warnings.

## Browser QA

The actual UI has been exercised from the landing through all three explanation screens, the developer invitation, the traveler handoff, and all six flight/dinner combinations through completion. Checked both panels’ notes, shared dismissal and reopening, and dismissal persisting across a later beat. Original and updated maps retain separate route facts. The partnership CTA displays both logos; Shift+Tab stays within its modal, Escape closes it and restores focus to the invoking button.

Landing, developer inbox and traveler setup checked at 320, 375, 768 and 1440 pixels. Comparison and paired-note geometry checked at 320, 375, 768, 1100, 1320 and 1440 pixels. No document horizontal overflow; note boundaries remain within the viewport. Notes sit beside the phones at 1440 and above, and below at smaller widths. Temporary viewport overrides are cleared after QA.

Development-only `?qa=1` accelerates muted playback for repeated path tests; it has no effect on production. A normal-speed production-build walkthrough is also checked separately. The route response completes with browser audio enabled; note dismissal remains in effect after changing beats. Audio completion does not establish voice quality on other devices.

## Limits

This is a scripted browser simulation. Physical iPhone/native Messages behavior, Linq integration, flight availability, ticketing, food ordering, outreach and human usability have not been tested. Browser audio quality depends on installed voices; timed captions and the watchdog support completion when speech is unavailable. Local events remain in memory, with no analytics transport. The final meeting destination is intentionally unconnected.
