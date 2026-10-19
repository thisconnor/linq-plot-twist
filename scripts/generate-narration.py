"""Render the authorized fixed demo narration locally with Kokoro stock voice.
Model weights and Python environment stay in .local and are never published.
"""
import json
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
voice = 'am_fenrir'
engine = Kokoro(str(ROOT / '.local/kokoro-v1.0.onnx'), str(ROOT / '.local/voices-v1.0.bin'))
beats = json.loads((ROOT / '.local/voice-lines.json').read_text())
output = ROOT / 'public/audio'
output.mkdir(exist_ok=True)
clips = {}
for beat in beats:
    chunks, cues, elapsed = [], [], 0.0
    for line in beat['lines']:
        samples, rate = engine.create(line['spoken'], voice=voice, speed=1.02, lang='en-us')
        duration = len(samples) / rate
        cues.append({'start':round(elapsed,4), 'end':round(elapsed+duration,4), 'text':line['text']})
        chunks.append(samples)
        gap = np.zeros(round(rate * 0.14), dtype=np.float32)
        chunks.append(gap)
        elapsed += duration + len(gap)/rate
        print(beat['id'], round(duration,2), line['spoken'], flush=True)
    audio = np.concatenate(chunks)
    sf.write(output / f"{beat['id']}.wav", audio, rate, subtype='PCM_16')
    clips[beat['id']] = {'src':f"./audio/{beat['id']}.wav", 'cues':cues}
manifest = {'description':'Locally generated Kokoro-82M v1.0 stock voice am_fenrir; Apache-2.0 model, MIT inference wrapper. Approved by user October 19, 2026. Cue boundaries follow the actual generated sentence audio.', 'clips':clips}
(ROOT / 'src/data/narration.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Generated three local narration clips and synchronized caption cues.',flush=True)
