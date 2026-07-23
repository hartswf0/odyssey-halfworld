/* gen-book-jobs.mjs — emit a per-book job list for the build workflow.
   For book N: collect its scenes, dedupe assets, split into NEW (no module
   file yet) vs EXISTING (already built in a prior book, reused as-is).
   Emits book<NN>/jobs.json = { book, jobs:[NEW assets], scenes:[all], existing:[ids] }.
   Usage: node harness/gen-book-jobs.mjs <bookNumber>
   Prints the new characters (which then get the expressiveness refine pass). */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const atlas = JSON.parse(readFileSync(resolve(ROOT,"harness","atlas.json"),"utf8"));
const reg = new Map(atlas.assetRegistry.map(e=>[e.id,e]));

const book = +process.argv[2];
if(!book){ console.error("usage: gen-book-jobs.mjs <bookNumber>"); process.exit(2); }
const scenesB = atlas.scenes.filter(s=>s.book===book);
if(!scenesB.length){ console.error("no scenes for book",book); process.exit(2); }

// alias: ensemble.suitors == ensemble.the-suitors (one asset)
const ALIAS = { "ensemble.suitors":"ensemble.the-suitors" };
const modPath = id => { const [type,...rest]=id.split("."); return resolve(ROOT,"assets",type.replace(/-/g,"_"),rest.join(".")+".mjs"); };
const fileExists = id => existsSync(modPath(id));

const seen = new Map();
for(const s of scenesB) for(const a of s.assets){ if(!seen.has(a.id)) seen.set(a.id, a); }

const jobs=[], existing=[];
for(const [id,a] of seen){
  const canonical = ALIAS[id] || id;
  if(fileExists(canonical) || fileExists(id)){ existing.push(id); continue; }   // reused from a prior book
  if(id!==canonical){ existing.push(id); continue; }                             // alias handled at scene level
  const e = reg.get(id)||{};
  const bperfs = (e.perfs||[]).filter(p=>scenesB.some(s=>s.id===p.scene)).map(p=>`${p.scene}: ${p.perf}`);
  // lean prompt: keep the "Scene function:" + "Construction:" essence, drop the
  // repeated visual-grammar/return boilerplate (the workflow supplies that).
  const raw=(e.prompts||[])[0]||"";
  const fn=(raw.match(/Scene function:\s*([^.]*(?:\.[^A-Z][^.]*)*?\.)\s*Visual grammar/)||[])[1]||"";
  const con=(raw.match(/Construction:\s*([^.]*(?:\.[^A-Z][^.]*)*?\.)\s*Return/)||[])[1]||"";
  const lean=`${a.name} (${a.type}). ${fn} ${con}`.replace(/\s+/g," ").trim();
  jobs.push({ id, type:a.type, name:a.name, prompt:lean, perfs:bperfs });
}
const scenes = scenesB.map(s=>({ id:s.id, n:s.n, title:s.title, beats:s.beats, composePrompt:s.composePrompt, exitState:s.exitState, assets:s.assets.map(a=>a.id) }));

const outDir = resolve(ROOT, `book${String(book).padStart(2,"0")}`);
if(!existsSync(outDir)) mkdirSync(outDir,{recursive:true});
writeFileSync(resolve(outDir,"jobs.json"), JSON.stringify({ book, jobs, scenes, existing }, null, 2));

const newChars = jobs.filter(j=>j.type==="CHARACTER").map(j=>j.id);
console.log(`Book ${book} (${atlas.scenes.find(s=>s.book===book).bookTitle||""}): ${scenes.length} scenes`);
console.log(`  NEW assets to build: ${jobs.length}`, jobs.reduce((o,j)=>{o[j.type]=(o[j.type]||0)+1;return o;},{}));
console.log(`  REUSED from prior books: ${existing.length}`);
console.log(`  NEW characters (get refine pass): ${newChars.join(", ")||"none"}`);
console.log(`  wrote ${resolve(outDir,"jobs.json")}`);
