# Alex narration script

Use one licensed stock voice or approved original recording. Do not clone a real person. Calm, capable, conversational delivery. Read B12 as “B twelve,” B18 as “B eighteen,” PT218 as “P T two eighteen.” Times are PM. No browser speech-synthesis fallback.

## Clip 1: options

I can help. There are two flights home tonight. Pickles can travel on either one.

The nonstop leaves at seven twenty and arrives at nine forty.

The connection leaves at six fifteen and arrives at eight fifty-five, with forty minutes in Meadow City.

I’d take the nonstop. One less plane change for Pickles.

## Clip 2: confirmation

P T two eighteen, the nonstop. Gate B twelve. Boarding at six fifty, departure at seven twenty.

Stop at pet relief beside B ten first. You have time.

## Clip 3: gate-change

One update: P T two eighteen now boards at B eighteen, instead of B twelve. Boarding is still six fifty.

From pet relief, walk along the B concourse to B eighteen. It takes six minutes.

You’ll arrive around five thirty-nine, with over an hour before boarding.

## Delivery contract

Bundled delivery uses three 24 kHz PCM WAV clips for browser compatibility, plus phrase start/end seconds. The app uses actual audio time for captions. The prepared traveler prompts are shown as captions between Alex’s responses; they are not recorded in Alex’s voice. Full scripts and exact numeric display facts are maintained in src/scenario.ts and src/data/trip.json.

The user authorized open-source voice tooling on October 19, 2026. These lines were generated locally with Kokoro-82M v1.0 stock voice am_fenrir through kokoro-onnx 0.6.1. No paid service, credential, cloned voice or third-party script upload was used. Source and license notices are recorded in docs/asset-sources.md. Sentence cue boundaries come from the actual generated audio lengths; the app uses audio.currentTime, not a guessed reading speed.
