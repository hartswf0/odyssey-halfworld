/* inject-kit.mjs — append the SUITE KIT (one MODEL config panel, gesture speech
   unlock, sibling page rail with carried clock) into every performance page.
   Idempotent: skips files already carrying the marker. */
import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MARK = "/* ══ SUITE KIT ══ */";
const KIT = `
${MARK}
(()=>{try{
const KGET=()=>{try{return JSON.parse(localStorage.getItem("odyssey.chat.api"))||{}}catch(e){return{}}};
const KSET=o=>{try{localStorage.setItem("odyssey.chat.api",JSON.stringify(o))}catch(e){}};
/* MODEL — always visible in the header, one key for every page */
const hdr=document.querySelector("header");
const b=document.createElement("button");b.type="button";b.id="kitModel";b.textContent="MODEL";
b.style.cssText="font-size:10px;letter-spacing:.08em;white-space:nowrap";
if(hdr)hdr.appendChild(b);
const p=document.createElement("div");
p.style.cssText="display:none;position:fixed;top:54px;right:8px;z-index:200;background:#fff;color:#000;border:2px solid #000;padding:10px;width:min(92vw,340px);box-shadow:6px 6px 0 rgba(0,0,0,.85);font:12px/1.4 ui-monospace,Menlo,monospace";
p.innerHTML='<div style="font-weight:900;font-size:11px;letter-spacing:.1em;margin-bottom:7px">PERFORMANCE MODEL · one key powers every page</div>'
+'<input data-k="url" placeholder="https://api.openai.com/v1/chat/completions" style="width:100%;box-sizing:border-box;margin-bottom:5px;padding:7px;border:1px solid #000;font:inherit">'
+'<input data-k="model" placeholder="model — gpt-4o-mini / gpt-5.6 / sol-5.6" style="width:100%;box-sizing:border-box;margin-bottom:5px;padding:7px;border:1px solid #000;font:inherit">'
+'<input data-k="key" type="password" placeholder="api key (stays in this browser)" style="width:100%;box-sizing:border-box;margin-bottom:7px;padding:7px;border:1px solid #000;font:inherit">'
+'<div style="display:flex;gap:6px;align-items:center"><button data-k="save" type="button" style="flex:1;padding:7px;border:2px solid #000;background:#000;color:#fff;font:inherit;font-weight:900;cursor:pointer">SAVE</button><button data-k="close" type="button" style="padding:7px 10px;border:1px solid #000;background:#fff;font:inherit;cursor:pointer">✕</button></div>'
+'<div data-k="state" style="font-size:10px;color:#5b5b5b;margin-top:6px"></div>';
document.body.appendChild(p);
const q=k=>p.querySelector('[data-k="'+k+'"]');
const paint=()=>{const c=KGET();
  q("url").value=c.url||"https://api.openai.com/v1/chat/completions";
  q("model").value=c.model||"";q("key").value=c.key||"";
  q("state").textContent=c.key?"KEY SET — real talk on across SUITE · METIS · DRIVEN · FORMULA · AOIDOS · PERFORM":"no key — offline score-derived lines still play";
  b.style.background=c.key?"#000":"";b.style.color=c.key?"#fff":"";};
const openP=()=>{p.style.display="block";paint();};
b.onclick=()=>{p.style.display==="none"?openP():p.style.display="none";};
q("close").onclick=()=>p.style.display="none";
q("save").onclick=()=>{KSET({url:q("url").value.trim()||"https://api.openai.com/v1/chat/completions",model:q("model").value.trim(),key:q("key").value.trim()});paint();q("state").textContent+=" · SAVED";setTimeout(()=>{p.style.display="none"},800);};
/* every page-local api/model button opens this same panel */
["apiBtn","perfApi"].forEach(id=>{const e=document.getElementById(id);if(e)e.onclick=openP;});
paint();
/* SPEECH UNLOCK — iOS/Chrome refuse to speak until a real user gesture speaks first */
let primed=false;
const prime=()=>{if(primed||!window.speechSynthesis)return;primed=true;
  try{const u=new SpeechSynthesisUtterance("ready");u.volume=.01;u.rate=2;
  speechSynthesis.cancel();speechSynthesis.speak(u);speechSynthesis.resume();}catch(e){}};
["pointerdown","touchend","keydown"].forEach(ev=>document.addEventListener(ev,prime,{capture:true,once:true}));
/* SIBLING RAIL — every performance surface one tap away, clock carried via ?t= */
const PAGES=[["odyssey-suite.html","SUITE"],["odyssey-suite-metis-performance.html","METIS"],
["odyssey-suite-performance-driven.html","DRIVEN"],["odyssey-suite-concordance.html","FORMULA"],
["odyssey-suite-aoidos-live-performance.html","AOIDOS LIVE"],["odyssey-perform.html","PERFORM"]];
const here=(location.pathname.split("/").pop()||"").toLowerCase();
let rail=document.getElementById("lnStage")?document.getElementById("lnStage").parentElement:null;
if(!rail&&hdr){rail=document.createElement("div");
  rail.style.cssText="display:flex;gap:6px;overflow-x:auto;padding:6px 10px;border-bottom:2px solid #000;background:#fff;-webkit-overflow-scrolling:touch";
  hdr.insertAdjacentElement("afterend",rail);}
if(rail)PAGES.forEach(pair=>{const pg=pair[0],label=pair[1];
  if(pg.toLowerCase()===here)return;
  const a=document.createElement("a");a.className="btn";a.textContent=label+" \\u25b8";a.href=pg;
  a.style.cssText="white-space:nowrap;border:2px solid #000;padding:6px 9px;font-weight:700;text-decoration:none;color:inherit";
  a.onclick=()=>{try{const t=window.__suite&&window.__suite.now&&window.__suite.now();
    if(t>0)a.href=pg+"?t="+t.toFixed(1);}catch(e){}};
  rail.appendChild(a);});
}catch(err){console.warn("suite kit",err);}})();
`;

const FILES = [
  "odyssey-suite.html",
  "odyssey-suite-metis-performance.html",
  "odyssey-suite-performance-driven.html",
  "odyssey-suite-concordance.html",
  "odyssey-suite-aoidos-live-performance.html",
  "odyssey-perform.html",
];
for (const f of FILES) {
  const path = resolve(ROOT, f);
  let html = await readFile(path, "utf8");
  if (html.includes(MARK)) { console.log("skip (already injected):", f); continue; }
  const at = html.lastIndexOf("</script>");
  if (at < 0) { console.log("NO </script>:", f); continue; }
  html = html.slice(0, at) + KIT + html.slice(at);
  await writeFile(path, html);
  console.log("injected:", f);
}
