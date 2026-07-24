/* build-spoken-lines.mjs — merge authored per-book spoken-line chunks
   (atlas/spoken-lines/lines-*.json) into viewer/spoken-lines.json.
   Each chunk: {"<turnId>":{"line":"…","direction":"…"},…}
   Verifies coverage against viewer/performance-turns.json. */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(ROOT, "atlas/spoken-lines");
const lines = {};
for (const f of (await readdir(SRC)).filter(x => x.endsWith(".json")).sort()) {
  const j = JSON.parse(await readFile(resolve(SRC, f), "utf8"));
  for (const [id, v] of Object.entries(j)) {
    if (!v || typeof v.line !== "string") continue;
    lines[id] = { line: v.line, direction: v.direction || "" };
  }
}
const PT = JSON.parse(await readFile(resolve(ROOT, "viewer/performance-turns.json"), "utf8"));
let covered = 0, missing = [];
for (const [sid, turns] of Object.entries(PT.byScene))
  for (const t of turns) (lines[t.id] ? covered++ : missing.push(t.id));
await writeFile(resolve(ROOT, "viewer/spoken-lines.json"),
  JSON.stringify({ built: new Date().toISOString(),
    scope: "authored first-person spoken lines per METIS turn id — the words, not the direction",
    count: Object.keys(lines).length, lines }));
console.log("spoken-lines:", Object.keys(lines).length, "lines ·", covered, "turns covered ·",
  missing.length, "uncovered", missing.length ? "(first: " + missing.slice(0, 3).join(", ") + ")" : "");
