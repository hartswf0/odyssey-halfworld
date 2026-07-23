/* contact.mjs — stitch renders into a contact sheet.
   node harness/contact.mjs <outName> <cols> <id1> <id2> ... */
import { chromium } from "playwright"; import { readFileSync } from "node:fs";
const [out, colsS, ...ids] = process.argv.slice(2); const cols=+colsS||4;
const b=await chromium.launch(); const p=await b.newPage();
const imgs=ids.map(id=>{try{return {id,d:"data:image/png;base64,"+readFileSync(`renders/${id}.png`).toString("base64")};}catch(e){return {id,d:null};}});
const html=`<html><body style="margin:0;background:#ccc;display:grid;grid-template-columns:repeat(${cols},1fr);gap:3px;width:${cols*360}px">`+
  imgs.map(x=>`<div style="background:#fff">${x.d?`<img src="${x.d}" style="width:100%;display:block">`:`<div style="padding:30px;color:#c00;font:12px monospace">MISS ${x.id}</div>`}</div>`).join("")+`</body></html>`;
await p.setViewportSize({width:cols*360,height:100}); await p.setContent(html,{waitUntil:"load"}); await p.waitForTimeout(500);
await (await p.$("body")).screenshot({path:`renders/${out}.png`}); console.log("wrote renders/"+out+".png"); await b.close();
