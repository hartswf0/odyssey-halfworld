/* ============================================================
   parse-atlas.mjs  ·  odyssey-halfworld
   Parse the two-view scene atlas markdown into structured jobs:
     · scenes[]        one per "## Scene N: ... (`OD-Bxx-Syy`)"
     · assetRegistry   deduped unique assets keyed by `type.slug(name)`,
                       carrying every scene it appears in + all its prompts.
   Usage: node harness/parse-atlas.mjs [path-to-atlas.md]
   Writes harness/atlas.json.
   ============================================================ */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ATLAS = process.argv[2] || "/Users/gaia/Downloads/odyssey_complete_two_view_scene_atlas.md";
const OUT   = resolve(__dirname, "atlas.json");

const slug = s => String(s).toLowerCase().replace(/['’`]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
const assetId = (type,name)=> `${slug(type)}.${slug(name)}`;

const src = readFileSync(ATLAS, "utf8");
const lines = src.split(/\r?\n/);

const scenes = [];
const registry = new Map();      // id -> asset record
let book = null, scene = null, mode = null;

function pushAsset(rec, sceneId){
  const id = assetId(rec.type, rec.name);
  let e = registry.get(id);
  if(!e){ e = { id, type:rec.type, name:rec.name, firstScene:sceneId, scenes:[], prompts:[], perfs:[] }; registry.set(id,e); }
  e.scenes.push(sceneId);
  if(rec.prompt && !e.prompts.includes(rec.prompt)) e.prompts.push(rec.prompt);
  if(rec.perf) e.perfs.push({ scene:sceneId, perf:rec.perf });
  return id;
}

for (let i=0;i<lines.length;i++){
  const L = lines[i];
  let m;
  if ((m = L.match(/^#\s+Book\s+(\d+):\s*(.+)$/))){ book = { n:+m[1], title:m[2].trim() }; continue; }
  if ((m = L.match(/^##\s+Scene\s+(\d+):\s*(.+?)\s*\(`([^`]+)`\)/))){
    scene = { n:+m[1], title:m[2].trim(), id:m[3].trim(), book:book?book.n:null, bookTitle:book?book.title:null,
              beats:[], composePrompt:"", assets:[], exitState:"" };
    scenes.push(scene); mode=null; continue;
  }
  if (!scene) continue;
  if (/^###\s+View 1/.test(L)){ mode="beats"; continue; }
  if (/^###\s+View 2/.test(L)){ mode="assets"; continue; }
  if (/^\*\*Whole-scene composition prompt\*\*/.test(L)){ mode="compose"; continue; }
  if (/^\*\*Scene exit state\*\*/.test(L)){ mode="exit"; continue; }

  if (mode==="beats" && /^-\s+/.test(L)){ scene.beats.push(L.replace(/^-\s+/,"").trim()); continue; }
  if (mode==="compose" && /^>\s?/.test(L)){ scene.composePrompt += (scene.composePrompt?" ":"") + L.replace(/^>\s?/,"").trim(); continue; }
  if (mode==="exit" && /^>\s?/.test(L)){ scene.exitState += (scene.exitState?" ":"") + L.replace(/^>\s?/,"").trim(); continue; }

  if (mode==="assets" && /^\|/.test(L) && !/^\|\s*-+/.test(L) && !/Needed asset/.test(L)){
    // | **Name** | `TYPE` | perf | prompt |
    const cells = L.split("|").slice(1,-1).map(c=>c.trim());
    if (cells.length>=4){
      const name = (cells[0].match(/\*\*(.+?)\*\*/)||[])[1];
      const type = (cells[1].match(/`([A-Z_]+)`/)||[])[1];
      if (name && type){
        const rec = { name:name.trim(), type, perf:cells[2], prompt:cells[3] };
        scene.assets.push({ id:assetId(type,name), name:rec.name, type });
        pushAsset(rec, scene.id);
      }
    }
  }
}

const registryArr = [...registry.values()].map(e=>({ ...e, uses:e.scenes.length }))
  .sort((a,b)=> b.uses - a.uses);

const byType = {};
for (const e of registryArr) byType[e.type] = (byType[e.type]||0)+1;

const out = {
  meta: {
    source: ATLAS,
    generated: "static",           // no Date.now — deterministic
    sceneCount: scenes.length,
    assetSlots: scenes.reduce((n,s)=>n+s.assets.length,0),
    uniqueAssets: registryArr.length,
    uniqueByType: byType,
  },
  scenes,
  assetRegistry: registryArr,
};
writeFileSync(OUT, JSON.stringify(out,null,2));
console.log(`atlas.json written: ${scenes.length} scenes, ${out.meta.assetSlots} slots, ${registryArr.length} unique assets`);
console.log("by type:", byType);
// Book 1 preview
const b1scenes = scenes.filter(s=>s.book===1);
const b1assets = new Set(); b1scenes.forEach(s=>s.assets.forEach(a=>b1assets.add(a.id)));
console.log(`\nBook 1: ${b1scenes.length} scenes, ${b1assets.size} unique assets:`);
console.log([...b1assets].join("\n"));
