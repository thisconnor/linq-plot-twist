# Version 7 verification

October 19, 2026. Scope: flip the campaign headline, simplify the email role cue, separate the text keyword/welcome from the flight request, and show Alex’s contact automatically.

## Automated checks

`npm test`: 22 tests pass. The text path now exercises all four sends, while voice still has three scenes. Added/updated assertions cover: `home` alone; a greeting with no flight attachment; the exact next prepared flight request; automatic identity reveal after the greeting; no reveal before the greeting; rollback of an interrupted welcome; complete four-send history with one reaction and three image attachments. Existing audio/caption, timing, stale callback and cancellation tests remain passing.

`npm run build`: TypeScript and production Vite build pass. Existing Motion dependency warnings are unchanged. `git diff --check` passes.

## Browser verification

The production preview shows the flipped headline and compact lead-developer line beside the Plot Twist logo. The normal-speed text walkthrough confirms that the first send is home alone; the greeting automatically changes the contact header to Alex and queues the separate flight request before any flight image appears. The Use button is absent. Remaining flight, confirmation, reaction, gate-update, map and commercial steps are exercised to completion. At 375×812 the compact email cue and welcome remain readable. At 320×568 there is no document overflow, the short request fits its composer, and Send remains visible. Switching away during an unfinished welcome rolls it back; retry shows one greeting and reveals Alex automatically. Switching to voice after a completed welcome preserves it; real audio advances, then stops and resets to zero when returning to text. No browser console errors were observed.

Travel data, narration and images are unchanged. This remains a scripted simulation; automatic contact reveal is demo behavior, not a guarantee of native iMessage settings.

---

# Version 6 verification baseline

October 19, 2026. This revision changes the headline, role handoff, controls, Alex portrait, flight/map visuals, two short feature notes, and commercial CTA. It preserves the linear three-send story and existing male narration.

## Automated checks

- `npm test`: 21 tests pass. They cover canonical facts, route arithmetic, the complete three-send path, reactions, read/typing ordering, duplicate and stale-event protection, cancellation, identity sharing, PNG files and descriptions, narration cue/script alignment, WAV durations, audio-clock behavior, mute, cancellation and audio-failure fallback.
- `npm run build`: TypeScript and Vite production build pass. Motion's ignored `use client` directives remain dependency warnings.
- `git diff --check`: pass.
- Screenshot provenance manifest confirms flight/map PNGs match the captured sample website source. Portrait is delivered as a 49 KB WebP.

## Browser checks performed for this revision

- Desktop campaign, developer invitation, readable traveler handoff, voice, all three normal-speed prepared messages, and commercial ending completed in the production preview.
- Production narration starts only after an intentional click. The actual audio clock advanced in options and gate-change WAVs, and the full call reached Call complete. Mute toggled the active audio without pausing it. Switching to iMessage left audio paused at zero and removed voice nodes.
- Contact header begins with the illustrative number. The optional Use control changes it to Alex / Plot Twist · AI assistant. Viewer and assistant roles remain explicitly labeled above both channel views.
- Flight website screenshot opens at full image size with the correct two flight options and accessible description.
- The reaction note appears when the actual thumbs-up is added; its close button removes it. The map note appears when the route attachment arrives and expires automatically. Neither appears as permanent page copy.
- The map attachment opens `/travel-preview.html?view=map` in a separate tab, preserving the completed thread. The target has matching A/B endpoints, six-minute estimate, three directions and working zoom. Zoom-in changed the map transform to scale 1.2; zoom-out returned to default.
- Mobile developer invitation, traveler handoff, voice start, all three prepared sends and final plan exercised at 375×812. The handoff action remains visible, around 590px from the top.
- At 375×812 and 320×568, active feature notes sit below the phone, not over its composer or messages. The smallest viewport's Send action stays visible and its prepared draft fits without text scrolling.
- DOM geometry checked at 1440×900, 1366×768, 1280×720, 768×1024, 375×812 and 320×568: one phone, no horizontal document overflow, and the next action remains inside the viewport. Screenshot viewport settings were aligned separately for correctly proportioned mobile captures.
- The new commercial CTA and modal are readable at 375×812. Shift+Tab remains in the modal. Escape closes it and restores focus to Build your iMessage pilot.

The production release is built by `npm run deploy` after committing the source. Public deployment is verified against fresh `version.json`, new assets, and the live UI; final source/deploy metadata and screenshots are included in the local review packet.

## Limits

This is a scripted interviewer simulation. Browser-rendered travel screenshots use fictional airports, flights and availability. The map opens a matching fictional route preview, not Google navigation. No physical iPhone/native Messages behavior, real Linq connection, live booking, contact-card delivery, microphone or outreach is validated. The illustrative number has no SMS/phone link. The pilot modal sends nothing. Browser playback checks do not establish subjective voice quality, and no usability study is claimed.
