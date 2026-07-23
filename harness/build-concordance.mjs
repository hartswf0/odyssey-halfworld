/* build-concordance.mjs — candidate-first concordance from METIS-L v1.
   Honest scope: TRANSLATION_DERIVED formula variants with Fagles PAGE anchors
   (no fabricated Greek line concordance). Emits the scene-runtime candidate
   file the concordance page loads first; the full/extended/parallels corpus
   files remain optional future datasets (the page degrades gracefully).
   Run: node harness/build-concordance.mjs */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const v1 = JSON.parse(await readFile(resolve(ROOT, "atlas/odyssey_metis_atlas_v1.json"), "utf8"));
const v2 = JSON.parse(await readFile(resolve(ROOT, "atlas/odyssey_metis_performance_atlas_v2.json"), "utf8"));

const formulas = {}, occurrences = {}, lines = {}, scenes = {};
const pageBook = {};                       // page → book (from v2 book page ranges)
const bookLineMax = { O: {} };
for (const b of v2.books) {
  const pp = b.sourcePdfPages || [];
  const lo = Math.min(...pp), hi = Math.max(...pp);
  if (isFinite(lo)) for (let p = lo; p <= hi; p++) pageBook[p] = b.book;
  bookLineMax.O[String(b.book)] = isFinite(hi) ? hi : 0;
}
for (const fam of v1.traditionPack.formulaFamilies) {
  (fam.variants || []).forEach((v, i) => {
    const fid = fam.id + ".V" + (i + 1);
    formulas[fid] = { id: fid, family: fam.id, en: v.surface,
      function: fam.semanticFunction, evidence: v.evidence,
      occurrences: v.occurrences || (v.sourcePages || []).length };
    occurrences[fid] = (v.sourcePages || []).map(p => "P" + p);
    for (const p of v.sourcePages || []) {
      const lid = "P" + p;
      if (!lines[lid]) lines[lid] = { id: lid, ref: "Fagles p." + p,
        book: pageBook[p] || null,
        text: "page-level anchor · Fagles p." + p + (pageBook[p] ? " · Book " + pageBook[p] : ""),
        note: "TRANSLATION_DERIVED page anchor — no line concordance generated" };
    }
  });
}
/* scene → its anchor pages + formula candidates whose pages fall in-book */
for (const a of v1.assemblies) {
  const anchor = a.sourceAnchor || {};
  const pages = anchor.pages || [];
  const cand = [];
  for (const [fid, occ] of Object.entries(occurrences)) {
    if (occ.some(l => pageBook[+l.slice(1)] === a.book)) cand.push(fid);
  }
  scenes[a.id] = { pages, confidence: anchor.confidence || "low",
    book: a.book, formulas: cand.slice(0, 24) };
}
const out = { meta: { built: new Date().toISOString(),
    scope: "TRANSLATION_DERIVED page-anchored candidates (METIS-L v1); Greek line corpus not generated",
    bookLineMax },
  formulas, occurrences, lines, scenes, registries: {} };
await mkdir(resolve(ROOT, "viewer/concordance"), { recursive: true });
await writeFile(resolve(ROOT, "viewer/concordance/odyssey-scene-runtime.json"), JSON.stringify(out));
console.log("scene-runtime:", Object.keys(formulas).length, "formulas ·",
  Object.keys(lines).length, "page anchors ·", Object.keys(scenes).length, "scenes");
