# Version 5 verification

October 19, 2026. This release replaces the branching side-by-side demo with a short campaign explanation, example email, explicit role change, sequential voice/iMessage comparison, three composer sends, and commercial handoff.

## Automated checks

`npm test`: 21 tests pass. Coverage includes:

- Canonical flight options, selected flight, old/new gates, boarding time and six-minute route arithmetic.
- All three prepared messages through completion, retained images, one acknowledgment reaction and unique message IDs.
- Actual PNG signatures, accessible descriptions, WAV file signatures, cue order, cue/script agreement and cues inside generated audio duration.
- Delivered/read/reaction/typing ordering, duplicate sends/replies, stale callbacks, interrupted-response rollback and reset.
- Identity sharing/acceptance, including clearing an accepted identity when the incomplete first exchange is rolled back.
- Actual-clock audio cue selection in the player, mute preserving position, immediate cancellation, blocked/error/watchdog fallback and caption-only cancellation.
- Voice revisit resetting its story clock and captions.

`npm run build`: TypeScript and production Vite build pass. Motion's ignored `use client` directives remain dependency warnings.

## Actual browser checks

- Full campaign, email, explicit traveler handoff, voice, iMessage and commercial ending exercised.
- Development acceleration completes all three voice beats and all three prepared sends; production build separately completes real narration and normal-speed messages.
- Production audio uses the bundled options, confirmation and gate-change WAVs. Playback begins only after Start voice example; all clips reach Call complete. Actual HTML audio properties confirm playback and completion.
- Muting sets the active audio's muted state while playback continues. Switching to iMessage pauses audio and resets currentTime to zero. Only one phone remains and the voice caption node is removed.
- Switching away during an unfinished message response cancels its timers, rolls it back to its prepared draft and allows another send. Unit tests also cover preserving earlier completed history.
- Before accepting the identity offer, the Messages header shows the illustrative number. After Use, it shows Alex.
- Three sends retain the flight image, new gate image and six-minute terminal route. Image enlargement opens the correct map and text description.
- Auto-follow returns to the latest reply when the reader has not scrolled; a real user scroll can inspect history. An image-load timing issue found during QA was corrected.
- CTA modal Shift+Tab remains inside the dialog. Escape closes it and restores focus to Discuss this for your product.
- The compact email layout at 1280×720 keeps its CTA visible. The role handoff's primary action is also visible on a 375×812 phone.
- Phone and next action fit within 1280×720, 1366×768, 1440×900, 768×1024, 375×812 and 320×568 viewports. In each, document width equals viewport width and phone-view document height equals viewport height. One phone is rendered.
- Persistent captions retain the full accelerated call history. Reduced-motion emulation suppresses waveform animation; the emulation and caption preference were restored afterward.
- Full 375×812 walkthrough completes; its message thread reaches the latest response with no document overflow. The 320×568 prepared draft fits without its own text scrolling and Send stays visible.

Local production and public release checks are distinct. The release is published using the existing Pages workflow, then its version.json and public walkthrough are checked. Final public screenshots and release metadata are delivered in the review packet.

## Audio files

Kokoro-82M stock voice am_fenrir generated three 24 kHz PCM WAVs locally: options 19.24 seconds, confirmation 11.13 seconds, gate change 16.86 seconds. Peak absolute sample values are below 0.84 and no samples reach clipping. Captions use sentence boundaries from actual generated durations and the browser audio clock. Browser playback verification is not a human judgment of vocal quality.

## Limits

This remains a scripted interviewer simulation. No physical iPhone/native Messages behavior, Linq integration, real flight availability, ticketing, contact-card delivery or outreach has been validated. The displayed number is illustrative and has no SMS/phone link. Read/contact/typing behavior is conditional in real systems. Meeting routing stays disconnected. No paid speech service, credential, real-person clone or external script upload was used.

The roughly ten-second campaign-comprehension goal still requires a fresh human reviewer; it is not claimed as achieved. Only performed checks are reported; passing code tests does not establish a usability study.
