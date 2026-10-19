import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharpPath = process.env.DEMO_SHARP_MODULE;
if (!sharpPath)
  throw new Error(
    "Set DEMO_SHARP_MODULE to the installed sharp package. No network service is used.",
  );
const sharp = require(sharpPath);
const trip = JSON.parse(
  await fs.readFile(new URL("../src/data/trip.json", import.meta.url), "utf8"),
);
const destination = new URL("../public/demo/", import.meta.url);
const time = (m) =>
  `${Math.floor(m / 60) % 12 || 12}:${String(m % 60).padStart(2, "0")}`;
const escape = (text) =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const t = (x, y, text, size = 22, fill = "#272b33", weight = 400, extra = "") =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" ${extra}>${escape(text)}</text>`;
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const selected = trip.selected,
  alternative = trip.alternative;
const gate = svg(
  720,
  365,
  `<rect width="720" height="365" rx="22" fill="#fff"/><rect width="720" height="57" rx="22" fill="#fff0db"/><path d="M0 36H720V57H0Z" fill="#fff0db"/>${t(28, 36, "GATE CHANGE", 18, "#967044", 700)}${t(692, 36, `${time(trip.updateMinutes)} PM`, 17, "#967044", 400, 'text-anchor="end"')}${t(30, 105, `${trip.airline} · ${selected.flight}`, 24, "#5d6370", 600)}${t(30, 188, selected.oldGate, 52, "#a1a7b0")}<path d="M30 171H137" stroke="#a1a7b0" stroke-width="3"/>${t(174, 182, "→", 39, "#a3a1ab")}${t(252, 188, selected.gate, 68, "#56364d", 700)}<path d="M30 220H690" stroke="#e5e5e9"/>${t(30, 255, "BOARDING", 14, "#8c929e", 600)}${t(270, 255, "DEPARTURE", 14, "#8c929e", 600)}${t(510, 255, "HOME", 14, "#8c929e", 600)}${t(30, 295, `${time(selected.boarding)} PM`, 27, "#343745", 600)}${t(270, 295, `${time(selected.departure)} PM`, 27, "#343745", 600)}${t(510, 295, `${time(selected.arrival)} PM`, 27, "#343745", 600)}${t(30, 340, "Sample itinerary · no ticket issued", 15, "#a0a4ac")}`,
);
const preview = svg(
  720,
  410,
  `<rect width="720" height="410" rx="24" fill="#f0e7df"/>${t(38, 63, "plot twist", 30, "#57374e", 700)}${t(38, 91, "YOUR TRIP, UNTANGLED.", 12, "#aa7e71", 600)}${t(38, 163, "A useful plan.", 39, "#57374e", 600)}${t(38, 211, "Right in Messages.", 39, "#57374e", 600)}${t(38, 288, `Text ${trip.keyword}`, 22, "#735f6e", 600)}${t(38, 325, "Try it as your customer.", 20, "#93808c")}
<rect x="421" y="20" width="254" height="430" rx="35" fill="#29292e"/><rect x="430" y="29" width="236" height="414" rx="29" fill="#fff"/><rect x="501" y="36" width="93" height="20" rx="10" fill="#101015"/>${t(548, 100, "Alex", 20, "#30333e", 600, 'text-anchor="middle"')}${t(548, 122, "Plot Twist Travel", 11, "#9b9da6", 400, 'text-anchor="middle"')}<path d="M430 138H666" stroke="#ececf0"/>
<rect x="486" y="160" width="163" height="55" rx="19" fill="#1682f9"/>${t(499, 184, "My flight was", 14, "#fff")}${t(499, 203, "canceled. Help?", 14, "#fff")}
<rect x="442" y="231" width="180" height="62" rx="19" fill="#ededf0"/>${t(455, 255, "Let’s get you home.", 14, "#30333e")}${t(455, 276, "Two flights tonight.", 14, "#30333e")}
<rect x="442" y="307" width="207" height="79" rx="13" fill="#f7f8fa" stroke="#dfe3e9"/>${t(455, 333, selected.flight + " · NONSTOP", 11, "#6b7180", 600)}${t(455, 361, `${time(selected.departure)} – ${time(selected.arrival)}`, 24, "#353b49", 600)}${t(455, 378, "PM · Sample flight", 10, "#969daa")}`,
);
await fs.mkdir(destination, { recursive: true });
for (const [name, source] of Object.entries({
  gate,
  "email-preview": preview,
})) {
  await fs.writeFile(new URL(`${name}.svg`, destination), source);
  await sharp(Buffer.from(source))
    .png()
    .toFile(new URL(`${name}.png`, destination).pathname);
}
console.log("Rendered gate and email images from canonical trip data.");
