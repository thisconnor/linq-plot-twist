# Version 6 asset sources and use

Reviewed October 19, 2026.

| Asset | Source | Use and limits |
|---|---|---|
| Plot Twist logo | Original SVG in `src/Brands.tsx` | Fictional company identity |
| Alex portrait | Built-in imagegen; `public/alex-travel-advisor.webp` | Fictional male AI travel assistant, airport and aircraft backdrop. Replaces the former portrait. Compressed to 640px WebP for delivery. |
| Linq lockup | Official Linq homepage asset, https://res.cloudinary.com/linq/image/upload/v1775832022/website/homepage/Logo_lock_up_0-00-00-00_yya5pq.png | Contextual product attribution; no endorsement claimed |
| Flight and map PNGs | Actual browser screenshots of `public/travel-preview.html`, generated from canonical trip data by `scripts/render-travel-preview.mjs` | Realistic sample travel website, not Google/airline screenshots, live search, or real navigation. Flight screenshot: 600×690; map: 1000×740. Original fictional indoor plan, not an unrelated airport map. |
| Gate and email-preview PNGs | Original SVGs rendered by `scripts/render-demo-assets.mjs` | Fictional itinerary and invitation visuals; no ticket issued |
| Manrope | Bundled Fontsource font | Open Font License, `public/licenses/manrope.txt` |
| Lucide | Existing package | ISC, `public/licenses/lucide.txt` |
| Alex narration | Local Kokoro-82M v1.0 stock voice `am_fenrir` | Model: https://huggingface.co/hexgrad/Kokoro-82M (Apache-2.0); wrapper: https://github.com/thewh1teagle/kokoro-onnx (MIT). No cloning or paid service. Notices in `public/licenses/`. |

## Screenshot capture

Open the dev server's `/travel-preview.html?view=flights` at 600×690 and `/travel-preview.html?view=map` at 1000×740. Capture with browser screenshot controls, then encode the captured image as PNG. These are rendered HTML/CSS/SVG website screenshots, not AI image-generation approximations of text or controls. The map link opens the same route website, where zoom controls work. The screenshot itself remains an ordinary image attachment.

Do not run an image generator for flight or map interfaces. Do not overwrite these screenshots with the old diagram assets. The small gate-change summary and email invitation visual intentionally remain original SVG renderings.

## Portrait generation prompt

Built-in imagegen, new generation, no reference face or cloned person:

> Use case: photorealistic-natural. Asset type: square profile photograph for Alex, a fictional male AI travel assistant in a travel-planning demo. Create a natural editorial head-and-shoulders portrait of an approachable man in his early thirties, short dark hair, light beard, friendly calm expression, wearing a smart casual navy overshirt. Scene: modern airport terminal lounge with large windows and an unmistakable passenger airplane on the apron behind him, departure planning context. Face large and centered, entire head inside central circle-safe area, upper chest visible, enough airport background to recognize travel even at a small circular crop. Natural daylight, believable skin texture, professional travel adviser, warm and competent. No text, no airline logos, no lanyard text, no watermarks. This is a fictional character, not a real person.

## Research and approach

- Official SFO indoor map and animal-relief locations were inspected: https://www.flysfo.com/maps and https://www.flysfo.com/passengers/services/animal-relief-areas. Because the story uses fictional Harbor City Airport and gates, the release does not place fictional gate data on a real airport screenshot.
- Google's documented Maps URLs support origin/destination links: https://developers.google.com/maps/documentation/urls/get-started. No Google link is fabricated for the fictional airport. The working route instead opens the matching sample map page.
- Linq's documented image-attachment feature: https://docs.linqapp.com/channel/imessage/guides/messaging/attachments/. These screenshots are not evidence of native booking widgets or a configured interactive app.

Kokoro model and presets remain in ignored `.local/`; generated WAVs and their cue manifest are distributed. Narration is unchanged in this revision.
