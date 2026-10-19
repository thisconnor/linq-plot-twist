# Stable scenes for the separate video session

Version 5, October 19, 2026. Record the website; do not create a live agent, use the illustrative number, or imply real bookings. The video is a separate deliverable and does not block the website.

| Scene | Entry and action | Stable content | Suggested recording |
|---|---|---|---|
| 1. Campaign in one glance | Open `/` | Headline, personalized email, demo number, Messages preview | Brief static wide shot; readable main sentence |
| 2. Invitation | Click See the example, or open `/#/preview` | Mock email with normal sender/recipient/subject, original preview image and illustrative number | Show email before advancing; no real inbox footage |
| 3. Role change | Click Try the example | You received this as the developer. Now try it as your traveler. | Hold this bridge; Plot Twist identity makes the role change visible |
| 4. Voice today | Click First, the voice experience, then Start voice example | One iPhone call, Alex, three fixed response segments | Narration starts after the click; never composite it as simultaneous texting |
| 5. Same task in Messages | Click Try the same task in iMessage | One phone, initial number, first prepared HOME message | Tap Send. Optionally accept name/photo with Use; two flight options appear as an image |
| 6. Confirm, then update | Send prepared nonstop reply, then prepared update question | One reaction, explicit eight-minute story jump, B12 changes to B18 | Show retained gate information; avoid implying a ticket purchase |
| 7. Directions retained | Tap View image on the map attachment | Fictional terminal route, six minutes, 5:39 PM arrival | Image enlargement is the only attachment interaction. Original diagram is not a Google Maps screenshot |
| 8. Commercial handoff | Close image; click Back to your product | Could this fit your product? Plot Twist × Linq | End on Discuss this for your product; modal explicitly says routing is not connected |

## Narration and continuity

Use `public/audio/options.wav`, `confirmation.wav`, and `gate-change.wav` if approved for the separate video edit. The audio is generated stock narration, not a cloned person. Sentence cue times are in `src/data/narration.json`. Full copy is in `docs/screen-copy.md`; canonical scenario export is `docs/final-scenario.json`.

Do not use `?qa=1` for a finished recording. It is a development-only acceleration flag, bypasses narration, and displays a QA label. Production ignores it. For repeatable recording, reload or use Restart walkthrough; the only optional session preference is persistent captions.

Actual audio plus interstitial traveler captions lasts roughly one minute. Allow additional time for three intentional sends and viewing images. No unverified thirty-second completion claim is made.

The iMessage prepared-draft behavior belongs to the guided simulation. Keep that framing in any narration or captions; native Messages does not limit customers to these replies.
