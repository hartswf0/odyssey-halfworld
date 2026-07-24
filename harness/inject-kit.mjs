/* inject-kit.mjs — inject/upgrade the SUITE KIT in every performance page.
   KIT v2: provider-aware MODEL panel (OpenAI-compatible / Anthropic / OpenRouter /
   Ollama / custom) with live TEST, window.kitLLM() shared client with JSON-schema
   response binding, gesture speech unlock, sibling rail carrying the clock.
   Re-runnable: strips any previous kit (marker → last </script>) then re-injects. */
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
const PROV={
  openai:{url:"https://api.openai.com/v1/chat/completions",models:["gpt-4o-mini","gpt-4o","gpt-4.1-mini","gpt-4.1","o4-mini"],needKey:true},
  anthropic:{url:"https://api.anthropic.com/v1/messages",models:["claude-haiku-4-5-20251001","claude-sonnet-5","claude-opus-4-8"],needKey:true},
  openrouter:{url:"https://openrouter.ai/api/v1/chat/completions",models:["openai/gpt-4o-mini","anthropic/claude-sonnet-5","meta-llama/llama-3.3-70b-instruct","google/gemini-2.0-flash-001"],needKey:true},
  ollama:{url:"http://localhost:11434/v1/chat/completions",models:["llama3.2","qwen2.5","mistral"],needKey:false},
  custom:{url:"",models:[],needKey:true}};
const provOf=c=>c.provider||((c.url||"").includes("anthropic")?"anthropic":(c.url||"").includes("openrouter")?"openrouter":(c.url||"").includes("11434")?"ollama":"openai");
/* ── shared model client: right wire format per provider, JSON bound to a schema ── */
window.kitLLM=async function(messages,opts){
  opts=opts||{};
  const c=KGET(),prov=provOf(c),P=PROV[prov]||PROV.openai;
  if(P.needKey&&!c.key)throw new Error("no key — open MODEL in the header");
  let url=c.url||P.url,req,parse;
  if(prov==="anthropic"){
    const sys=messages.filter(m=>m.role==="system").map(m=>m.content).join("\\n\\n");
    let rest=messages.filter(m=>m.role!=="system").map(m=>({role:m.role,content:m.content}));
    if(!rest.length)rest=[{role:"user",content:"Perform the turn now."}];
    req={method:"POST",headers:{"content-type":"application/json","x-api-key":c.key,
      "anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:c.model||"claude-haiku-4-5-20251001",max_tokens:opts.maxTokens||700,
        temperature:opts.temperature==null?.85:opts.temperature,system:sys||undefined,messages:rest})};
    parse=j=>(j.content||[]).map(b=>b.text||"").join("");
  }else{
    const body={model:c.model||"gpt-4o-mini",messages,max_tokens:opts.maxTokens||700,
      temperature:opts.temperature==null?.85:opts.temperature};
    if(opts.json)body.response_format=opts.schema
      ?{type:"json_schema",json_schema:{name:opts.schemaName||"result",strict:true,schema:opts.schema}}
      :{type:"json_object"};
    req={method:"POST",headers:{"content-type":"application/json",
      ...(c.key?{authorization:"Bearer "+c.key}:{})},body:JSON.stringify(body)};
    parse=j=>(j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||"";
  }
  let r;
  try{r=await fetch(url,req);}
  catch(e){throw new Error("network/CORS — "+url.split("/")[2]+" refused a browser call");}
  const raw=await r.text();
  if(!r.ok){
    if(opts.json&&opts.schema&&(r.status===400||r.status===422)&&!opts._retried)
      return window.kitLLM(messages,Object.assign({},opts,{schema:null,_retried:true}));
    let msg=raw.slice(0,220);try{const e=JSON.parse(raw);msg=(e.error&&(e.error.message||e.error.type))||msg;}catch(_){/**/}
    throw new Error("api "+r.status+" · "+msg);
  }
  let text;try{text=parse(JSON.parse(raw));}catch(e){throw new Error("unreadable api response");}
  if(opts.json){
    const m=String(text).match(/\\{[\\s\\S]*\\}/);
    if(!m)throw new Error("model returned no JSON");
    return JSON.parse(m[0]);
  }
  return String(text).trim();
};
window.kitLLMReady=()=>{const c=KGET(),P=PROV[provOf(c)]||PROV.openai;return !!(c.key||!P.needKey&&c.url||provOf(c)==="ollama");};
/* ── MODEL panel — provider, model, key, TEST ── */
const hdr=document.querySelector("header");
const b=document.createElement("button");b.type="button";b.id="kitModel";b.textContent="MODEL";
b.style.cssText="font-size:10px;letter-spacing:.08em;white-space:nowrap";
if(hdr)hdr.appendChild(b);
const p=document.createElement("div");
p.style.cssText="display:none;position:fixed;top:54px;right:8px;z-index:200;background:#fff;color:#000;border:2px solid #000;padding:10px;width:min(92vw,360px);box-shadow:6px 6px 0 rgba(0,0,0,.85);font:12px/1.4 ui-monospace,Menlo,monospace";
p.innerHTML='<div style="font-weight:900;font-size:11px;letter-spacing:.1em;margin-bottom:7px">PERFORMANCE MODEL · one key powers every page</div>'
+'<select data-k="prov" style="width:100%;box-sizing:border-box;margin-bottom:5px;padding:7px;border:1px solid #000;font:inherit;background:#fff">'
+'<option value="openai">OpenAI</option><option value="anthropic">Anthropic (Claude)</option>'
+'<option value="openrouter">OpenRouter (any model)</option><option value="ollama">Ollama · localhost, no key</option>'
+'<option value="custom">Custom endpoint (OpenAI format)</option></select>'
+'<input data-k="url" placeholder="endpoint url" style="width:100%;box-sizing:border-box;margin-bottom:5px;padding:7px;border:1px solid #000;font:inherit">'
+'<input data-k="model" list="kitModels" placeholder="model" style="width:100%;box-sizing:border-box;margin-bottom:5px;padding:7px;border:1px solid #000;font:inherit"><datalist id="kitModels"></datalist>'
+'<input data-k="key" type="password" placeholder="api key (stays in this browser)" style="width:100%;box-sizing:border-box;margin-bottom:7px;padding:7px;border:1px solid #000;font:inherit">'
+'<div style="display:flex;gap:6px;align-items:center"><button data-k="save" type="button" style="flex:1;padding:7px;border:2px solid #000;background:#000;color:#fff;font:inherit;font-weight:900;cursor:pointer">SAVE</button>'
+'<button data-k="test" type="button" style="padding:7px 10px;border:2px solid #000;background:#fff;font:inherit;font-weight:900;cursor:pointer">TEST</button>'
+'<button data-k="close" type="button" style="padding:7px 10px;border:1px solid #000;background:#fff;font:inherit;cursor:pointer">✕</button></div>'
+'<div data-k="state" style="font-size:10px;color:#5b5b5b;margin-top:6px;overflow-wrap:anywhere"></div>';
document.body.appendChild(p);
const q=k=>p.querySelector('[data-k="'+k+'"]');
const fillModels=prov=>{const dl=p.querySelector("#kitModels");dl.innerHTML="";
  (PROV[prov]||PROV.openai).models.forEach(m=>{const o=document.createElement("option");o.value=m;dl.appendChild(o);});};
const paint=()=>{const c=KGET(),prov=provOf(c);
  q("prov").value=prov;q("url").value=c.url||PROV[prov].url;
  q("model").value=c.model||"";q("key").value=c.key||"";fillModels(prov);
  q("state").textContent=window.kitLLMReady()?"READY — real calls on across SUITE · METIS · DRIVEN · FORMULA · AOIDOS · PERFORM":"no key — offline score-derived lines still play";
  b.style.background=window.kitLLMReady()?"#000":"";b.style.color=window.kitLLMReady()?"#fff":"";};
q("prov").onchange=()=>{const P=PROV[q("prov").value];q("url").value=P.url;
  q("model").value=P.models[0]||"";fillModels(q("prov").value);};
const grab=()=>({provider:q("prov").value,url:q("url").value.trim()||PROV[q("prov").value].url,
  model:q("model").value.trim(),key:q("key").value.trim()});
const openP=()=>{p.style.display="block";paint();};
b.onclick=()=>{p.style.display==="none"?openP():p.style.display="none";};
q("close").onclick=()=>p.style.display="none";
q("save").onclick=()=>{KSET(grab());paint();q("state").textContent+=" · SAVED";};
q("test").onclick=async()=>{KSET(grab());paint();
  q("state").textContent="TESTING — asking the model for one word…";
  try{const t0=performance.now();
    const out=await window.kitLLM([{role:"user",content:'Reply with exactly this JSON: {"ok":true}'}],{json:true,maxTokens:30,temperature:0});
    q("state").textContent=out&&out.ok?("MODEL OK · "+(grab().model||"default")+" · "+Math.round(performance.now()-t0)+"ms — lines will generate live"):"reached the api but got an odd reply — it may still work";
  }catch(err){q("state").textContent="TEST FAILED · "+err.message;}};
/* every page-local api/model button opens this one panel */
["apiBtn","perfApi"].forEach(id=>{const e=document.getElementById(id);if(e)e.onclick=openP;});
paint();
/* ── SPEECH UNLOCK — iOS/Chrome refuse to speak until a real gesture speaks first ── */
let primed=false;
const prime=()=>{if(primed||!window.speechSynthesis)return;primed=true;
  try{const u=new SpeechSynthesisUtterance("ready");u.volume=.01;u.rate=2;
  speechSynthesis.cancel();speechSynthesis.speak(u);speechSynthesis.resume();}catch(e){}};
["pointerdown","touchend","keydown"].forEach(ev=>document.addEventListener(ev,prime,{capture:true,once:true}));
/* ── SIBLING RAIL — every performance surface one tap away, clock carried via ?t= ── */
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
  const iMark = html.indexOf(MARK);
  const iEnd = html.lastIndexOf("</script>");
  if (iEnd < 0) { console.log("NO </script>:", f); continue; }
  if (iMark >= 0 && iMark < iEnd) html = html.slice(0, iMark) + html.slice(iEnd); // strip old kit
  const at = html.lastIndexOf("</script>");
  html = html.slice(0, at) + KIT + html.slice(at);
  await writeFile(path, html);
  console.log((iMark >= 0 ? "upgraded:" : "injected:"), f);
}
