# Plot Twist Travel — version 8

An interviewer-facing simulation of a proposed Linq campaign: qualify voice-AI builders, prepare a relevant live iMessage demo for each company, then email a short personalized invitation with a visual and a number to text. The website shows Nate that experience; prospects would text a real provisioned number rather than complete this website.

## Run

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Node.js 24 and npm are used for the static React/TypeScript/Vite build. Relative assets support the existing GitHub Pages repository path.

## Walkthrough

1. A focused campaign introduction, one Messages preview, and a simple three-step funnel.
2. Recognizable example email, an original message-preview image, and a clearly illustrative number.
3. Explicit developer-to-traveler handoff using Plot Twist's established identity.
4. One phone at a time: a short call, then the same task in iMessage. Start the call intentionally; the compact channel switch cancels the inactive channel.
5. Four prepared messages sent from the iMessage composer: home, customer request, nonstop confirmation, gate change and directions. There are no flight/food branches. Two brief notes highlight reactions and visual directions.
6. Explicit return to the developer, Plot Twist × Linq partnership CTA, and non-sending prototype modal.

`/` opens the campaign explanation. `/#/preview` opens the example email. Reload resets to the matching entry point. Optional persistent captions are retained in session storage. The development-only `?qa=1` accelerates caption/message timers and skips narration playback for repeated tests. It does not affect production.

The phone's message history scrolls independently. Flight results, gate details and map are PNG attachments with accessible descriptions. Flight/gate images enlarge; the map opens its matching fictional route website. Alex’s name/photo appear automatically with the first greeting in this walkthrough. No Use button is required. Read/typing states and one acknowledgment reaction are simulated. No ticket is purchased.

## Narration

Three WAV clips are generated locally using [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), stock voice `am_fenrir`, through [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx). User authorized open-source voice tooling on October 19, 2026. No account, subscription, API key or voice cloning was used. WAV output totals about 2.2 MB; model weights and Python dependencies stay ignored in `.local/` and are not deployed.

Caption cue boundaries follow each generated sentence's actual duration; playback uses the HTML audio clock. Muting preserves timing. Switching channels, ending the call, restarting and unmounting pause and reset audio and cancel pending timers. Failed/blocked audio falls back to timed captions. Browser speech synthesis is not used.

Exact script: [docs/audio-script.md](docs/audio-script.md). Audio manifests are in `src/data/narration.json`. Licenses and attribution: [docs/asset-sources.md](docs/asset-sources.md).

## Source map

- `src/data/trip.json`: canonical fictional airport, flight, clock and route facts.
- `src/scenario.ts`: four prepared text messages, three voice scenes, shared travel facts and image descriptions.
- `src/state.ts`: linear progression, stale-run guards, interrupted-response rollback and identity state.
- `src/playback.ts`: independent message and voice controllers.
- `src/App.tsx`: campaign, email, role handoff, single-phone interfaces, accessible modals and CTA.
- `src/Brands.tsx`: retained original Plot Twist identity and official Linq asset.
- `src/styles.css`: native phone interfaces, viewport layout and reduced motion.
- `src/brand.css`: Linq-aligned charcoal/lime site shell, licensed Geist typography, responsive layouts and quiet Plot Twist customer scenes.
- `src/telemetry.ts`: in-memory events only; no network transport.

Gate/email asset generation: `scripts/render-demo-assets.mjs`, using installed Sharp through `DEMO_SHARP_MODULE`. Flight/map website source: `scripts/render-travel-preview.mjs`; browser capture steps and provenance: `docs/asset-sources.md` and `docs/asset-captures.json`. Narration reproduction: `scripts/prepare-voice-input.mjs` then `scripts/generate-narration.py` in the isolated voice environment. Audio-generation dependencies are separate from the website's dependencies.

## Verification and delivery

See [verification](docs/verification.md), [screen copy](docs/screen-copy.md), [canonical scenario export](docs/final-scenario.json), and [video scene list](docs/video-scenes.md). The ten-second comprehension target requires a fresh human viewer; automated checks cannot establish it.

GitHub Pages serves the prebuilt `gh-pages` branch. `npm run deploy` requires a clean committed checkout, reruns tests/build, preserves branch history, and writes the source commit to `version.json`. No Actions workflow is needed.

## Simulation boundaries

No live agent, Linq CLI, number, microphone, flight service, booking, food order, meeting routing, outreach or analytics transport is connected. `+1 (202) 555-0147` is illustrative and has no `sms:` or `tel:` link. The final modal explicitly states that pilot booking is not connected. All airport imagery is fictional; no provider integration or real reservation is implied.

## References

- [Linq attachments](https://docs.linqapp.com/channel/imessage/guides/messaging/attachments/), [contact sharing](https://docs.linqapp.com/channel/imessage/guides/chats/share-contact-card/), [typing](https://docs.linqapp.com/channel/imessage/guides/chats/typing-indicators/) and [reactions](https://docs.linqapp.com/channel/imessage/guides/messaging/reactions/).
- [Apple Messages](https://support.apple.com/en-ca/guide/iphone/iph82fb73ba3/ios) for familiar interaction patterns.
- [Hallmark](https://github.com/nutlope/hallmark) and [No AI Slop](https://github.com/petergyang/no-ai-slop) for restraint and concrete copy.

Version 6 clarified both roles, strengthens the opening and pilot CTA, enlarges channel controls, adds two brief feature notes, and replaces flight/map diagrams with browser screenshots of `public/travel-preview.html`. Its route opens a matching fictional map with working zoom. See `docs/asset-sources.md` for capture steps and the portrait prompt.

Version 7 flips the campaign headline, replaces the large email intro with a compact lead-developer line and logo, and separates the home keyword/greeting from the flight request. Voice playback retains its three scenes.

Version 8 removes repeated growth-experiment labels, decorative hero cards, duplicate role banners and the persistent simulation stamp. Linq-facing screens follow the official site’s charcoal, white and lime palette with monospace controls. Plot Twist retains its own customer identity. The About dialog keeps the simulation boundaries in one place. See [brand audit](docs/brand-audit.md) for source observations and design decisions.
