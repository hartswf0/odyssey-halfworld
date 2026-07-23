/* build-manifest.mjs — scan assets/ and scenes/ and emit viewer/manifest.json
   so the gallery can load everything that exists. Run after a build. */
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const typeDirs = ["character","creature","location","prop","ensemble","divine_fx","set_piece","environment","vehicle","sound_source","wearable"];
const assets = [];
for (const d of typeDirs){
  const dd = resolve(ROOT,"assets",d);
  if (!existsSync(dd)) continue;
  for (const f of readdirSync(dd)){
    if (!f.endsWith(".mjs")) continue;
    assets.push({ type:d, slug:f.replace(/\.mjs$/,""), path:`/assets/${d}/${f}` });
  }
}
const scenes = [];
const sd = resolve(ROOT,"scenes");
if (existsSync(sd)) for (const f of readdirSync(sd)){
  if (!f.endsWith(".mjs") || f.startsWith("_")) continue;
  scenes.push({ id:f.replace(/\.mjs$/,""), path:`/scenes/${f}` });
}
scenes.sort((a,b)=>a.id.localeCompare(b.id));
const manifest = { generated:"static", assetCount:assets.length, sceneCount:scenes.length, assets, scenes };
writeFileSync(resolve(ROOT,"viewer","manifest.json"), JSON.stringify(manifest,null,2));
console.log(`manifest: ${assets.length} assets, ${scenes.length} scenes`);
