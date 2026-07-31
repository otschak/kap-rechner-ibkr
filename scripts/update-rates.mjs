#!/usr/bin/env node
// Aktualisiert die EZB-Kurse (USD->EUR) aus der Frankfurter-API (ECB-Referenzkurse)
// und schreibt sie in data/ecb-usd-eur.json UND in index.html (const RATES = {...}).
// Nutzung:  node scripts/update-rates.mjs 2019-01-01
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const start = process.argv[2] || "2024-01-01";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = `https://api.frankfurter.dev/v1/${start}..?symbols=USD`;

console.log("Lade", url);
const res = await fetch(url);
if (!res.ok) throw new Error("HTTP " + res.status);
const j = await res.json();
const usdeur = {};
for (const [d, o] of Object.entries(j.rates)) usdeur[d] = +(1 / o.USD).toFixed(6);
const sorted = Object.fromEntries(Object.entries(usdeur).sort());

writeFileSync(join(root, "data/ecb-usd-eur.json"),
  JSON.stringify({ base: "USD", quote: "EUR", source: "ECB via Frankfurter API", rates: sorted }, null, 0));

const blob = "{" + Object.entries(sorted).map(([d, v]) => `"${d}":${v}`).join(",") + "}";
const idx = join(root, "index.html");
let html = readFileSync(idx, "utf8");
html = html.replace(/const RATES = \{[\s\S]*?\};/, "const RATES = " + blob + ";");
writeFileSync(idx, html);
console.log("OK:", Object.keys(sorted).length, "Kurse eingebettet (", Object.keys(sorted)[0], "→", Object.keys(sorted).at(-1), ")");
