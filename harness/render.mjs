/* ============================================================
   render.mjs  ·  odyssey-halfworld
   Headless render + structural validation of asset modules.
   Serves the project over http (module imports need a real origin),
   drives the render-harness page in Chromium, writes renders/<id>.png,
   and prints a JSON report of validity + warnings + PNG path.

   Usage:
     node harness/render.mjs <assetfile.mjs> [assetfile2.mjs ...]
     node harness/render.mjs --all-book01
     node harness/render.mjs <file> --pipeline GRID --state speaking
   ============================================================ */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const RENDERS = resolve(ROOT, "renders");
if (!existsSync(RENDERS)) mkdirSync(RENDERS, { recursive:true });

const MIME = { ".html":"text/html", ".mjs":"text/javascript", ".js":"text/javascript",
               ".json":"application/json", ".png":"image/png", ".css":"text/css" };

function startServer(){
  return new Promise(res=>{
    const srv = createServer(async (req,resp)=>{
      try{
        let p = decodeURIComponent(req.url.split("?")[0]);
        if (p==="/") p="/harness/render-harness.html";
        const f = resolve(ROOT, "."+p);
        if (!f.startsWith(ROOT)) { resp.writeHead(403); return resp.end(); }
        const body = await readFile(f);
        resp.writeHead(200, { "content-type": MIME[extname(f)]||"application/octet-stream" });
        resp.end(body);
      }catch(e){ resp.writeHead(404); resp.end("404 "+e.message); }
    });
    srv.listen(0, "127.0.0.1", ()=> res({ srv, port: srv.address().port }));
  });
}

// slug->type dir resolution for id-only args
function resolveAssetArg(arg){
  if (arg.endsWith(".mjs")) return arg.startsWith("/") ? relative(ROOT,arg) : arg;
  return arg; // assume already a project-relative path
}

async function main(){
  const args = process.argv.slice(2);
  const pipeline = (args.includes("--pipeline") ? args[args.indexOf("--pipeline")+1] : "MESH");
  const state = (args.includes("--state") ? args[args.indexOf("--state")+1] : "");
  let files = args.filter(a=>!a.startsWith("--") && a!==pipeline && a!==state);
  if (args.includes("--all-book01")){
    const dirs = ["character","creature","location","prop","ensemble","divine_fx","set_piece","environment","vehicle","sound_source","wearable"];
    files = [];
    for (const d of dirs){
      const dd = resolve(ROOT,"assets",d);
      if (existsSync(dd)) for (const f of readdirSync(dd)) if(f.endsWith(".mjs")) files.push(`assets/${d}/${f}`);
    }
  }
  if (!files.length){ console.error("no asset files given"); process.exit(2); }

  const { srv, port } = await startServer();
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor:1 });
  page.on("console", msg=>{ if(msg.type()==="error") console.error("  [page error]", msg.text()); });

  const report = [];
  for (const rel of files){
    const modUrl = "/"+resolveAssetArg(rel).replace(/^\/+/,"");
    const url = `${base}/harness/render-harness.html?mod=${encodeURIComponent(modUrl)}&pipeline=${pipeline}${state?`&state=${state}`:""}`;
    await page.goto(url, { waitUntil:"load" });
    await page.waitForFunction("window.__DONE__===true", { timeout: 15000 }).catch(()=>{});
    const r = await page.evaluate("window.__RESULT__ || {ok:false,errors:['no result'],warnings:[]}");
    // write PNG
    let png = null;
    if (r.dataURL){
      const id = modUrl.split("/").pop().replace(/\.mjs$/,"");
      const type = modUrl.split("/").slice(-2,-1)[0];
      png = resolve(RENDERS, `${type}__${id}${state?"__"+state:""}.png`);
      writeFileSync(png, Buffer.from(r.dataURL.split(",")[1], "base64"));
    }
    report.push({ mod:rel, ok:r.ok, errors:r.errors, warnings:r.warnings, png: png?relative(ROOT,png):null });
    const tag = r.ok ? "OK  " : "FAIL";
    console.error(`[${tag}] ${rel}${r.errors&&r.errors.length?"  · "+r.errors.slice(0,2).join(" | "):""}${r.warnings&&r.warnings.length?`  (${r.warnings.length} warn)`:""}`);
  }
  await browser.close(); srv.close();
  console.log(JSON.stringify({ pipeline, state, results:report }, null, 2));
}
main().catch(e=>{ console.error(e); process.exit(1); });
