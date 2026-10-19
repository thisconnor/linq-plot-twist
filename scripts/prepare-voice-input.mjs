import { build } from "esbuild";
import fs from "node:fs/promises";
const bundle = await build({
  entryPoints: ["src/scenario.ts"],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const { STORY } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundle.outputFiles[0].text).toString("base64")
);
const words = {
  "7:20": "seven twenty",
  "9:40": "nine forty",
  "6:15": "six fifteen",
  "8:55": "eight fifty-five",
  "6:50": "six fifty",
  "5:39": "five thirty-nine",
};
const spoken = (text) =>
  text
    .replaceAll("PT218", "P T two eighteen")
    .replaceAll("B12", "B twelve")
    .replaceAll("B18", "B eighteen")
    .replaceAll("B10", "B ten")
    .replace(/\b\d{1,2}:\d{2}\b/g, (x) => words[x] ?? x)
    .replaceAll("40 minutes", "forty minutes")
    .replaceAll("6 minutes", "six minutes");
await fs.writeFile(
  ".local/voice-lines.json",
  JSON.stringify(
    STORY.map((beat) => ({
      id: beat.id,
      lines: beat.narration.map((text) => ({ text, spoken: spoken(text) })),
    })),
    null,
    2,
  ),
);
