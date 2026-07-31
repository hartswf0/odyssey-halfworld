/* build-odyssey-studio-manifest.mjs — merge viewer/manifest.json (files on
   disk) with harness/atlas.json (names, books, scene casts) into
   viewer/odyssey-manifest.json for the Odyssey World Studio. */
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const man = JSON.parse(readFileSync(resolve(ROOT, "viewer/manifest.json"), "utf8"));
const atlas = JSON.parse(readFileSync(resolve(ROOT, "harness/atlas.json"), "utf8"));
const reg = new Map(atlas.assetRegistry.map(e => [e.id, e]));
const sceneReg = new Map(atlas.scenes.map(s => [s.id, s]));

const assets = man.assets.map(a => {
  const rid = a.type.replace(/_/g, "-") + "." + a.slug;
  const e = reg.get(rid);
  const books = e ? [...new Set(e.scenes.map(s => +(s.match(/B(\d+)/)?.[1] || 0)))].sort((x, y) => x - y) : [];
  return {
    id: rid,
    name: (e?.name || a.slug.replace(/-/g, " ")).toUpperCase(),
    type: a.type, path: a.path, books,
    uses: e?.uses || 0,
    scenes: e?.scenes || [],
    prompt: e?.prompts?.[0] || "",
    perfs: e?.perfs || [],
  };
});

const scenes = man.scenes.map(s => {
  const e = sceneReg.get(s.id);
  return {
    id: s.id,
    title: (e?.title || s.id).toUpperCase(),
    book: e?.book || +(s.id.match(/B(\d+)/)?.[1] || 0),
    bookTitle: e?.bookTitle || "",
    path: s.path,
    assets: e ? e.assets.map(a => a.id) : [],
    beats: e?.beats || [],
    composePrompt: e?.composePrompt || "",
    exitState: e?.exitState || "",
  };
});

const out = { generated: "static", assetCount: assets.length, sceneCount: scenes.length, assets, scenes };
writeFileSync(resolve(ROOT, "viewer/odyssey-manifest.json"), JSON.stringify(out, null, 1));
console.log(`odyssey-manifest: ${assets.length} assets, ${scenes.length} scenes`);

/* ── THE LITE MANIFEST ─────────────────────────────────────────────────────
   Most of the 850 KB above is prose — the per-asset atlas `prompt` and the
   per-scene `composePrompt` / `beats` / `exitState`. A page only needs those
   when the user INSPECTS something; every page needs the INDEX to boot. So
   write the index on its own, for the pages that never open an inspector.
   Same shape, same order, same ids — just without the prose. A page that
   reads beats or prompts must keep using the full manifest (or fetch it
   lazily when the inspector opens). */
const lite = {
  generated: "static",
  lite: true,
  of: "viewer/odyssey-manifest.json",
  drops: ["assets[].prompt", "assets[].perfs", "scenes[].beats",
          "scenes[].composePrompt", "scenes[].exitState"],
  assetCount: assets.length, sceneCount: scenes.length,
  assets: assets.map(a => ({ id:a.id, name:a.name, type:a.type, path:a.path,
                             books:a.books, uses:a.uses, scenes:a.scenes })),
  scenes: scenes.map(s => ({ id:s.id, title:s.title, book:s.book,
                             bookTitle:s.bookTitle, path:s.path, assets:s.assets })),
};
writeFileSync(resolve(ROOT, "viewer/manifest-lite.json"), JSON.stringify(lite));
const kb = p => (statSync(resolve(ROOT, p)).size / 1024).toFixed(1) + " KB";
console.log(`manifest-lite: ${kb("viewer/manifest-lite.json")} `
  + `(full is ${kb("viewer/odyssey-manifest.json")})`);
const byBook = {};
scenes.forEach(s => byBook[s.book] = (byBook[s.book] || 0) + 1);
console.log("scenes by book:", byBook);
