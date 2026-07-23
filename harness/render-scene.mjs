/* render-scene.mjs — headless render + validation of a scene composition module.
   Usage: node harness/render-scene.mjs scenes/OD-B01-S01.mjs [--t 8] [--pipeline MESH] */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const RENDERS = resolve(ROOT, "renders"); if(!existsSync(RENDERS)) mkdirSync(RENDERS,{recursive:true});
const MIME = { ".html":"text/html",".mjs":"text/javascript",".js":"text/javascript",".json":"application/json",".png":"image/png",".css":"text/css" };

function startServer(){ return new Promise(res=>{ const srv=createServer(async(req,resp)=>{
  try{ let p=decodeURIComponent(req.url.split("?")[0]); if(p==="/")p="/harness/render-scene-harness.html";
    const f=resolve(ROOT,"."+p); if(!f.startsWith(ROOT)){resp.writeHead(403);return resp.end();}
    const body=await readFile(f); resp.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"}); resp.end(body);
  }catch(e){ resp.writeHead(404); resp.end("404 "+e.message); }
}); srv.listen(0,"127.0.0.1",()=>res({srv,port:srv.address().port})); }); }

async function main(){
  const args=process.argv.slice(2);
  const t=args.includes("--t")?args[args.indexOf("--t")+1]:"8";
  const pipeline=args.includes("--pipeline")?args[args.indexOf("--pipeline")+1]:"MESH";
  const files=args.filter(a=>!a.startsWith("--")&&a!==t&&a!==pipeline);
  if(!files.length){ console.error("no scene file"); process.exit(2); }
  const {srv,port}=await startServer(); const base=`http://127.0.0.1:${port}`;
  const browser=await chromium.launch(); const page=await browser.newPage({deviceScaleFactor:1});
  page.on("console",m=>{ if(m.type()==="error") console.error("  [page error]",m.text()); });
  const report=[];
  for(const rel of files){
    const modUrl="/"+rel.replace(/^\/+/,"");
    const url=`${base}/harness/render-scene-harness.html?mod=${encodeURIComponent(modUrl)}&pipeline=${pipeline}&t=${t}`;
    await page.goto(url,{waitUntil:"load"});
    await page.waitForFunction("window.__DONE__===true",{timeout:20000}).catch(()=>{});
    const r=await page.evaluate("window.__RESULT__||{ok:false,errors:['no result']}");
    let png=null;
    if(r.dataURL){ const id=modUrl.split("/").pop().replace(/\.mjs$/,""); png=resolve(RENDERS,`scene__${id}.png`); writeFileSync(png,Buffer.from(r.dataURL.split(",")[1],"base64")); }
    report.push({mod:rel,ok:r.ok,errors:r.errors,warnings:r.warnings,png:png?relative(ROOT,png):null});
    console.error(`[${r.ok?"OK  ":"FAIL"}] ${rel}${r.errors&&r.errors.length?"  · "+r.errors.slice(0,2).join(" | "):""}`);
  }
  await browser.close(); srv.close();
  console.log(JSON.stringify({t,pipeline,results:report},null,2));
}
main().catch(e=>{ console.error(e); process.exit(1); });
