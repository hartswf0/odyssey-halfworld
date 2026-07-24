/* build-concordance.mjs — candidate-first concordance in the concordance
   page's COMPACT ARRAY schema, built honestly from METIS-L v1 formula
   families (TRANSLATION_DERIVED English surfaces, Fagles PAGE anchors —
   no fabricated Greek). Page displays its own computational-candidate
   caveats. Run: node harness/build-concordance.mjs */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const v1 = JSON.parse(await readFile(resolve(ROOT, "atlas/odyssey_metis_atlas_v1.json"), "utf8"));
const v2 = JSON.parse(await readFile(resolve(ROOT, "atlas/odyssey_metis_performance_atlas_v2.json"), "utf8"));

const pageBook = {}, bookLineMax = { O: {} };
for (const b of v2.books) {
  const pp = b.sourcePdfPages || [];
  const lo = Math.min(...pp), hi = Math.max(...pp);
  if (isFinite(lo)) for (let p = lo; p <= hi; p++) pageBook[p] = b.book;
  bookLineMax.O[String(b.book)] = isFinite(hi) ? hi : 1;
}
/* lines[pageId] = [corpus,book,line,ref,beta,greek,tokenCount,syl,quantity,scan,status,penalty,caesura] */
const lines = {}, formulas = {}, occurrences = {};
const lineFor = p => {
  const k = String(p);
  if (!lines[k]) lines[k] = ["O", pageBook[p] || 0, p, "Fagles p." + p, "",
    "page-level anchor · Fagles p." + p + (pageBook[p] ? " · Book " + pageBook[p] : "") +
    " · TRANSLATION_DERIVED (no Greek line concordance generated)",
    0, 0, "", "", "PAGE_ANCHOR", 0, ""];
  return k;
};
/* formulas[id] = [n,beta,greek,total,ody,iliad,lineCount,posEntropy,position,stablePos,funcRatio,classification,address,addrEntropy,stableAddr] */
for (const fam of v1.traditionPack.formulaFamilies) {
  (fam.variants || []).forEach((v, i) => {
    const fid = fam.id + ".V" + (i + 1);
    const pages = v.sourcePages || [];
    const nTok = String(v.surface || "").split(/\s+/).length;
    formulas[fid] = [nTok, "", v.surface || fid,
      v.occurrences || pages.length, v.occurrences || pages.length, 0,
      pages.length, 0, "—", 0, 0,
      "TRANSLATION_DERIVED · " + (fam.semanticFunction || "repeated phrase"),
      "p." + (pages[0] || "—"), 0, 0];
    occurrences[fid] = pages.map(p =>
      [+lineFor(p), 0, nTok, 0, 1, 0, 0, "—", 1, 6, "p." + p]);
  });
}
/* scenes[id] = {f:[fids], t:typeScript, p:[protocols], r:[refFields], m:caveat} */
const scenes = {};
const v2scene = {};
for (const b of v2.books) for (const s of b.scenes) v2scene[s.id] = s;
for (const a of v1.assemblies) {
  const anchor = a.sourceAnchor || {};
  const apages = anchor.pages || [];
  /* rank candidates: formulas that occur ON this scene's Fagles pages first,
     then the rest of the book's, by how often they land there */
  const scored = [];
  for (const [fid, occ] of Object.entries(occurrences)) {
    let onAnchor = 0, inBook = 0;
    for (const o of occ) {
      const l = lines[String(o[0])]; if (!l) continue;
      if (apages.includes(l[2])) onAnchor++;
      else if (l[1] === a.book) inBook++;
    }
    if (onAnchor || inBook) scored.push([fid, onAnchor * 4 + inBook]);
  }
  scored.sort((x, y) => y[1] - x[1]);
  const s2 = v2scene[a.id] || {};
  const ts = (s2.typeScriptInstances || [])[0];
  scenes[a.id] = {
    f: scored.slice(0, 18).map(x => x[0]),
    a: apages,
    t: ts && (ts.scriptId || ts.typeScript || ts.id) || null,
    p: (s2.activeProtocols || []).slice(0, 6),
    r: (s2.activeReferentialFields || []).slice(0, 6),
    m: "TRANSLATION_DERIVED candidates · Fagles page anchors (" +
       apages.join(",") + ") · confidence " + (anchor.confidence || "low") +
       " · no exact Greek spans asserted",
  };
}
const out = { meta: { built: new Date().toISOString(), bookLineMax,
    scope: "METIS-L v1 formula families · English surfaces in the greek display slot by design · page-anchored" },
  formulas, lines, occurrences, scenes,
  registries: { protocols: {}, typeScripts: {}, referents: {} } };
await mkdir(resolve(ROOT, "viewer/concordance"), { recursive: true });
await writeFile(resolve(ROOT, "viewer/concordance/odyssey-scene-runtime.json"), JSON.stringify(out));
const nf = Object.keys(formulas).length;
console.log("scene-runtime:", nf, "formulas ·", Object.keys(lines).length, "page-lines ·",
  Object.keys(scenes).length, "scenes ·",
  Object.values(scenes).filter(s => s.f.length).length, "scenes with candidates");
