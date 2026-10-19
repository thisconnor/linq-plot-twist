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
const plane = (x, y, fill) =>
  `<path transform="translate(${x},${y})" d="m0 13 20-4V0l4-2 3 11 18 8-1 4-18-3-1 10 5 4-1 3-9-4-7 1 1-3 6-4-1-9-17 2Z" fill="${fill}"/>`;
const flightRow = (y, flight, start, end, detail, recommended) => `
  <rect x="24" y="${y}" width="672" height="165" rx="16" fill="#fff" stroke="#e0e3e8"/>
  ${plane(46, y + 40, recommended ? "#59445a" : "#778493")}
  ${t(112, y + 45, trip.airline, 20, "#4c5665", 600)}${t(674, y + 45, flight, 18, "#7b8290", 400, 'text-anchor="end"')}
  ${t(46, y + 100, time(start), 37, "#242733", 600)}${t(336, y + 100, time(end), 37, "#242733", 600)}
  ${t(258, y + 98, "—", 30, "#a1a8b4")}${t(46, y + 134, "PM departure", 15, "#838a96")}${t(336, y + 134, "PM arrival", 15, "#838a96")}
  ${t(674, y + 94, detail, 17, "#596172", 400, 'text-anchor="end"')}
  ${recommended ? `<rect x="504" y="${y + 116}" width="168" height="27" rx="13" fill="#ede5ee"/>${t(588, y + 135, "Alex’s pick", 14, "#654760", 600, 'text-anchor="middle"')}` : ""}`;
const flights = svg(
  720,
  470,
  `<rect width="720" height="470" rx="22" fill="#f5f6f8"/>${t(28, 44, "Flights home · tonight", 25, "#2e3140", 600)}${t(692, 43, "2 options", 16, "#8b919c", 400, 'text-anchor="end"')}${flightRow(67, selected.flight, selected.departure, selected.arrival, "Nonstop", true)}${flightRow(247, alternative.flight, alternative.departure, alternative.arrival, `${alternative.layoverMinutes} min layover`, false)}${t(28, 447, "Sample flight results · not a reservation", 15, "#9399a3")}`,
);
const gate = svg(
  720,
  365,
  `<rect width="720" height="365" rx="22" fill="#fff"/><rect width="720" height="57" rx="22" fill="#fff0db"/><path d="M0 36H720V57H0Z" fill="#fff0db"/>${t(28, 36, "GATE CHANGE", 18, "#967044", 700)}${t(692, 36, `${time(trip.updateMinutes)} PM`, 17, "#967044", 400, 'text-anchor="end"')}${t(30, 105, `${trip.airline} · ${selected.flight}`, 24, "#5d6370", 600)}${t(30, 188, selected.oldGate, 52, "#a1a7b0")}<path d="M30 171H137" stroke="#a1a7b0" stroke-width="3"/>${t(174, 182, "→", 39, "#a3a1ab")}${t(252, 188, selected.gate, 68, "#56364d", 700)}<path d="M30 220H690" stroke="#e5e5e9"/>${t(30, 255, "BOARDING", 14, "#8c929e", 600)}${t(270, 255, "DEPARTURE", 14, "#8c929e", 600)}${t(510, 255, "HOME", 14, "#8c929e", 600)}${t(30, 295, `${time(selected.boarding)} PM`, 27, "#343745", 600)}${t(270, 295, `${time(selected.departure)} PM`, 27, "#343745", 600)}${t(510, 295, `${time(selected.arrival)} PM`, 27, "#343745", 600)}${t(30, 340, "Sample itinerary · no ticket issued", 15, "#a0a4ac")}`,
);
const map = svg(
  720,
  580,
  `<rect width="720" height="580" rx="22" fill="#f1f3f4"/>${t(25, 39, trip.airport, 23, "#3f4855", 600)}${t(25, 67, `${trip.terminal} · fictional diagram`, 16, "#8a929a")}<path d="M0 94H720" stroke="#dce1e4"/>
<path d="M54 349H656 M130 349V240 M260 349V240 M390 349V240 M520 349V240 M650 349V240" stroke="#d8dde0" stroke-width="55" fill="none" stroke-linejoin="round"/>
${[130, 260, 390, 520, 650].map((x, i) => `<rect x="${x - 44}" y="157" width="88" height="85" rx="10" fill="${i === 4 ? "#d5e4f7" : "#e1e5e7"}" stroke="${i === 4 ? "#b4cae4" : "#d1d8dc"}"/>${t(x, 207, `B${10 + i * 2}`, 24, i === 4 ? "#255ba3" : "#8b969f", 600, 'text-anchor="middle"')}`).join("")}
<path d="M130 255V349H650V255" stroke="#fff" stroke-width="14" fill="none" stroke-linejoin="round"/><path d="M130 255V349H650V255" stroke="#4286d4" stroke-width="8" fill="none" stroke-linejoin="round"/>
<circle cx="130" cy="255" r="13" fill="#4286d4" stroke="#fff" stroke-width="5"/><circle cx="650" cy="255" r="11" fill="#fff" stroke="#4286d4" stroke-width="6"/>
${t(130, 119, "PET RELIEF", 13, "#668075", 700, 'text-anchor="middle"')}${t(130, 137, "You are here", 14, "#3e6b59", 400, 'text-anchor="middle"')}${t(395, 335, "B CONCOURSE", 14, "#a1abb2", 500, 'text-anchor="middle"')}${t(380, 406, `${trip.route.walkMinutes} min on foot`, 22, "#3471b7", 600, 'text-anchor="middle"')}
<rect x="0" y="450" width="720" height="130" fill="#fff"/>${t(27, 488, `Pet relief B10 → Gate ${selected.gate}`, 23, "#374554", 600)}${t(27, 523, `Leave ${time(trip.updateMinutes)} PM · arrive ${time(trip.updateMinutes + trip.route.walkMinutes)} PM`, 21, "#697988")}${t(27, 557, "Illustrative route · not to scale", 15, "#9ca5ad")}`,
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
  flights,
  gate,
  map,
  "email-preview": preview,
})) {
  await fs.writeFile(new URL(`${name}.svg`, destination), source);
  await sharp(Buffer.from(source))
    .png()
    .toFile(new URL(`${name}.png`, destination).pathname);
}
console.log(
  "Rendered four original, fictional demo attachments from canonical trip data.",
);
