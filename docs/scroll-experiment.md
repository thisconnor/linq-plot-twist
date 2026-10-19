# Scroll walkthrough experiment

October 19, 2026. This is an alternate presentation for comparison, not a replacement for version 8.

- Original: https://thisconnor.github.io/linq-plot-twist/
- Experiment: https://thisconnor.github.io/linq-plot-twist/?view=scroll

## Experience

One sticky viewport follows the viewer’s ordinary scroll. The product preview opens into the personalized email, contracts into the customer’s phone, moves from call to Messages, and ends with the Plot Twist × Linq pilot proposal. Scroll controls scene changes, message reveals, read/typing states, the contact reveal, reaction, gate card and route. The original page-to-page navigation is not required. The optional native-looking Send control advances this same timeline rather than sending anything.

The story has ten moments: campaign, developer invitation, traveler handoff, voice, home/greeting, flights, confirmation, gate change, route, and pilot. It retains the approved campaign paragraph, male Alex identity, Pickles context and canonical travel facts. The first text remains home alone, followed by the separate flight request. The gate card arrives before the route image. Scrolling backward rebuilds the earlier state without timers or stale replies.

The voice section can be read silently or played intentionally with Listen to the call. It uses the existing Kokoro WAV files and audio-clock captions. Moving out of the voice section cancels and resets playback. Audio failure uses the existing timed-caption fallback. No audio begins from scrolling alone.

The desktop visual’s width, corner radius, border and channel layers are linked to scroll position with the existing Motion package. The browser keeps native scrolling; wheel and touch input over the phone continue the document. The alternate thread does not create an inner scroll trap. Images still enlarge, and the map still opens the matching fictional route website.

Mobile uses a stacked layout, hides the introductory device preview to keep the campaign readable, and preserves space for the phone. On short screens, repeated explanatory paragraphs in the message scenes yield space to the thread, and attachments use compact clickable thumbnails. The complete message log remains available to assistive technology. Reduced-motion preferences disable morphing and sliding and react to preference changes. Keyboard users can Page Down/Up or use the focus-revealed chapter links; End reaches the pilot. The final modal remains non-sending.

## Isolation

The original URL, default App behavior and original styles are retained. `main.tsx` lazy-loads the alternate only for `view=scroll`. Shared components gain exports and an optional `scrollDriven` message presentation flag that defaults to false. The alternate modal opts into focus restoration without scrolling; the original keeps its default. `scroll-model.ts` replays the existing reducer, rather than forking the scenario or its text. All new presentation styles are scoped to the alternate.

## Checks

`npm test`: 26 tests pass, including all 22 original tests. Four additional timeline tests cover keyword/greeting/contact order, gate-before-map timing, four sends/one reaction/three attachments, deterministic rewind, duplicate prevention, chapter bounds and optional Send advancement. TypeScript and the production Vite build pass. The original stylesheet build hash is unchanged by the alternate.

Browser review covers ordinary forward scrolling, scrolling over the phone, backward history, responsive email fit, optional audio start and scroll cancellation, pilot focus trap and Escape focus restoration. Closing an alternate modal retains the scroll position it had when opened. The 320×568 and 375×812 layouts preserve the main content without horizontal overflow. Reduced-motion emulation is used only for QA and restored afterward. Production and public-release results are recorded in the local review evidence after deployment.

This remains an illustrative browser simulation. It does not send messages, place calls, provision a real number, book a flight, navigate a real airport or send a pilot request. Browser checks do not establish native iPhone behavior or subjective voice quality.

## Reference

[Motion’s official scroll-animation guide](https://motion.dev/docs/react-scroll-animations) documents the scroll-linked transforms and sticky-container pattern used here. No additional animation dependency or paid service is added.
