# Version 5 asset sources and use

Reviewed October 19, 2026.

| Asset | Source | Use and limits |
|---|---|---|
| Plot Twist logo | Original SVG in `src/Brands.tsx`, retained from v4 | Fictional company identity, not a real customer relationship |
| Alex portrait | Existing generated fictional portrait, `public/alex-avatar.jpg` | Labels Alex as an AI assistant; not a real person's identity |
| Linq lockup | Official Linq homepage asset, https://res.cloudinary.com/linq/image/upload/v1775832022/website/homepage/Logo_lock_up_0-00-00-00_yya5pq.png | Retained contextual product attribution; original source documented, no endorsement claimed |
| Flight, gate, map, email-preview PNGs | Original SVGs rendered by `scripts/render-demo-assets.mjs` from `src/data/trip.json` | Fictional images with familiar information hierarchy. No Google/Expedia branding, screenshots or live integrations. No fictional gates overlaid on an unrelated real airport |
| Manrope font | Existing bundled Fontsource font | Open Font License notice in `public/licenses/manrope.txt` |
| Lucide icons | Existing package | ISC notice in `public/licenses/lucide.txt` |
| Alex narration | Locally generated with Kokoro-82M v1.0 stock voice `am_fenrir` | Model: https://huggingface.co/hexgrad/Kokoro-82M, Apache-2.0. Inference wrapper: https://github.com/thewh1teagle/kokoro-onnx, MIT. No cloning or paid service. Notices in `public/licenses/kokoro-model.txt` and `kokoro-onnx.txt` |

Kokoro model and voice presets came from the wrapper's linked official release:

- https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.onnx
- https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin

Model files, downloaded voice presets, dependency environment and raw generation logs remain under ignored `.local/`. Only the generated WAV clips and cue manifest are distributed. Inference ran locally. No script, credentials, customer data or private transcript was sent to a speech service.

The model's published stock voice is used as supplied; this project did not train, clone or claim to reproduce a particular person's voice. The site's About disclosure identifies the narration as generated.

Image depiction follows Linq's documented attachment feature: https://docs.linqapp.com/channel/imessage/guides/messaging/attachments/. These images are not evidence of a native booking widget. Linq separately documents interactive apps and Experiences, but this demo does not pretend to configure them.
