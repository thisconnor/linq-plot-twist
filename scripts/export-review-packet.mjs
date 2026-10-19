import { build } from "esbuild";
import fs from "node:fs/promises";
const bundle = await build({
  entryPoints: ["src/scenario.ts"],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const { TRIP, ROUTE, STORY, MESSAGE_STEPS, ATTACHMENTS } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundle.outputFiles[0].text).toString("base64")
);
await fs.writeFile(
  "docs/final-scenario.json",
  JSON.stringify(
    {
      status:
        "Fictional, scripted interviewer simulation. No live integrations.",
      trip: TRIP,
      route: ROUTE,
      story: STORY,
      messageSteps: MESSAGE_STEPS,
      attachments: ATTACHMENTS,
    },
    null,
    2,
  ) + "\n",
);
