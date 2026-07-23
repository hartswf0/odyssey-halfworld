/* location.secret-ithacan-landing — the quiet rural Ithacan cove where Odysseus is
   secretly put ashore. LOCATION asset (OD-B15-S05). An EMPTY navigable set: open sky
   over a sea that carries a marked TOWNWARD SHIP-LANE out and away; a hidden scalloped
   waterline and a small flat DISEMBARK ledge (the landing rock); a dry cove strand in
   the foreground; and, rising inland on the right, low rural HILLS with olive terraces
   and a FARM PATH that winds up and off toward Eumaeus's steading. Deliberately no
   town, no harbour, no suitors in view — this is the secret, out-of-sight landfall.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify pass
   supplies the halftone. No characters are baked in; only placement / camera anchors.
   Atlas: OD-B15-S05 — rural shore, disembark point, farm path, townward ship-lane, no-suitor visibility. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  horizon:0.30,        // sea/sky meeting line as fraction of H
  shoreLevel:0.56,     // centre of the scalloped waterline band
  scallops:7,          // gentle foam-edge lobes (quiet water -> few)
  hillSide:1,          // rural hills + farm path rise on the RIGHT (inland)
  laneSide:-1,         // townward ship-lane runs off to sea on the LEFT
  olives:true,         // olive trees / terraces on the hillside (farm signal)
  landing:true,        // flat disembark ledge (the landing rock) on the shore
};

/* deterministic scalloped waterline y at fractional x (0..1) */
function shoreY(x, H, amp){
  return H*params.shoreLevel + Math.sin(x*Math.PI*params.scallops)*amp + Math.sin(x*Math.PI*1.7+0.6)*amp*0.5;
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const layers = st.layers || ["sky","sea","lane","hills","olives","surf","beach","landing","path","anchors"];
  const has = l => layers.includes(l);
  const amp = H*0.014;

  // ---- SKY (lightest tone -> sparse dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    // a couple of low, calm cloud banks
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.18+i*0.28), horizon*(0.40+0.14*(i%2)), W*0.12, H*0.020, 0,0,7); g.fill(); }
  }

  // ---- SEA (mid tone) from horizon down to the surf band ----
  if (has("sea")){
    const seaBot = H*params.shoreLevel + amp*2;
    pen.paint(()=>{ g.rect(0,horizon,W,seaBot-horizon); }, toneSolid(inkLevel(3)), 0);
    // darker near band just above the surf gives depth without a flat blob
    g.fillStyle=inkLevel(4); g.fillRect(0, seaBot-H*0.035, W, H*0.035);
    // horizon contour
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 4);
    // a few swell lines (darker), receding toward the horizon
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.24;
    for(let j=1;j<=4;j++){
      const y = lerp(horizon+H*0.03, seaBot-H*0.02, j/5);
      g.beginPath();
      for(let s=0;s<=20;s++){ const x=W*s/20; const yy=y+Math.sin(s*0.9+j)*H*0.005; s?g.lineTo(x,yy):g.moveTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- TOWNWARD SHIP-LANE: a marked wake-lane running off to sea toward the town ----
  if (has("lane")){
    const s = params.laneSide;
    const x0 = W*(0.5 + s*0.10), y0 = H*(params.shoreLevel-0.02);   // lane mouth off the cove
    const x1 = W*(0.5 + s*0.42), y1 = horizon+H*0.02;               // lane vanishing at the horizon
    // the lane reads as a LIGHT wake ribbon (pale water) carved through the dark sea
    const mid=(a,b,t)=>lerp(a,b,t);
    g.beginPath();
    g.moveTo(x0-W*0.055, y0);
    g.quadraticCurveTo(mid(x0,x1,0.5)-W*0.03, mid(y0,y1,0.5), x1-W*0.010, y1);
    g.lineTo(x1+W*0.010, y1);
    g.quadraticCurveTo(mid(x0,x1,0.5)+W*0.03, mid(y0,y1,0.5), x0+W*0.055, y0);
    g.closePath(); g.fillStyle=inkLevel(1); g.fill();
    // twin dark wake edges bounding the pale lane
    g.strokeStyle=INK; g.lineWidth=2;
    const edge=(w0,w1)=>{ g.beginPath();
      g.moveTo(x0+w0, y0); g.quadraticCurveTo(mid(x0,x1,0.5)+mid(w0,w1,0.5), mid(y0,y1,0.5), x1+w1, y1); g.stroke(); };
    edge(-W*0.055, -W*0.010); edge(W*0.055, W*0.010);
    // dark centre chevrons marking the outbound route
    for(let k=0;k<5;k++){ const t=(k+0.5)/5;
      const cx=lerp(x0,x1,t), cy=lerp(y0,y1,t), r=lerp(W*0.022,W*0.005,t);
      g.beginPath(); g.moveTo(cx-r, cy+r*0.5); g.lineTo(cx, cy); g.lineTo(cx+r, cy+r*0.5); g.stroke();
    }
    // a small outbound sail far down the lane (a ship leaving townward, no town shown)
    const sx=lerp(x0,x1,0.88), sy=lerp(y0,y1,0.88);
    pen.paint(()=>{ g.moveTo(sx,sy-H*0.030); g.lineTo(sx+W*0.018,sy); g.lineTo(sx-W*0.006,sy); g.closePath(); }, toneSolid(inkLevel(6)), 2);
    pen.ink(()=>{ g.moveTo(sx,sy); g.lineTo(sx,sy-H*0.032); }, 2);
  }

  // ---- RURAL HILLS rising inland on the hill side (above the horizon) ----
  if (has("hills")){
    const s = params.hillSide;
    const bx = s>0 ? W : 0;
    // far hill (lighter), then near hill (a touch darker) — layered ridgeline
    pen.paint(()=>{
      g.moveTo(bx, horizon+H*0.02);
      g.quadraticCurveTo(bx - s*W*0.22, horizon-H*0.12, bx - s*W*0.46, horizon+H*0.04);
      g.lineTo(bx - s*W*0.46, H*params.shoreLevel);
      g.lineTo(bx, H*params.shoreLevel); g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    pen.paint(()=>{
      g.moveTo(bx, horizon+H*0.06);
      g.quadraticCurveTo(bx - s*W*0.16, horizon-H*0.02, bx - s*W*0.34, horizon+H*0.10);
      g.quadraticCurveTo(bx - s*W*0.22, horizon+H*0.20, bx - s*W*0.30, H*(params.shoreLevel+0.10));
      g.lineTo(bx, H*(params.shoreLevel+0.10)); g.closePath();
    }, toneSolid(inkLevel(4)), 5);
    // a couple of dry-stone terrace lines scored across the near hill (farmland)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let j=1;j<=3;j++){ const y=lerp(horizon+H*0.11, H*(params.shoreLevel+0.02), j/3);
      g.beginPath();
      for(let t=0;t<=12;t++){ const x=lerp(bx, bx - s*W*0.32, t/12); const yy=y+Math.sin(t*0.8+j)*H*0.005; t?g.lineTo(x,yy):g.moveTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- OLIVE TREES on the hillside (rural / Eumaeus's steading is up this way) ----
  if (has("olives") && params.olives){
    const s = params.hillSide;
    const bx = s>0 ? W : 0;
    const spots=[ [0.10,0.02],[0.20,0.12],[0.30,0.06],[0.14,0.20] ];
    for(const [dx,dy] of spots){
      const tx = bx - s*W*dx, ty = H*(params.shoreLevel-0.06) + H*dy;
      // trunk
      pen.paint(()=>{ g.rect(tx-W*0.004, ty, W*0.008, H*0.03); }, toneSolid(inkLevel(6)), 2);
      // canopy (dark, olive-round)
      pen.paint(()=>{ g.ellipse(tx, ty-H*0.006, W*0.026, H*0.022, 0,0,7); }, toneSolid(inkLevel(5)), 3);
    }
  }

  // ---- HIDDEN WATERLINE (quiet surf): scalloped light band meeting the cove ----
  if (has("surf")){
    const topY = x=>shoreY(x,H,amp);
    // wet-sand band under the foam
    g.beginPath();
    g.moveTo(0,H*(params.shoreLevel+0.16)); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); }
    g.lineTo(W,H*(params.shoreLevel+0.16)); g.closePath();
    g.fillStyle=inkLevel(3); g.fill();
    // the foam itself: lightest tone, scalloped upper edge
    g.beginPath();
    g.moveTo(0, topY(0)+H*0.028);
    for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); }
    g.lineTo(W, topY(1)+H*0.028); g.closePath();
    g.fillStyle=inkLevel(1); g.fill();
    // hard contour of the seaward foam edge
    pen.ink(()=>{ g.moveTo(0,topY(0)); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } }, 4);
    // a few quiet foam bubbles
    g.fillStyle=inkLevel(1); g.strokeStyle=INK; g.lineWidth=2;
    for(let i=0;i<params.scallops;i++){
      const x=(i+0.5)/params.scallops; const y=topY(x)+H*0.010;
      g.beginPath(); g.arc(x*W, y, W*0.014, 0, 7); g.fill(); g.stroke();
    }
  }

  // ---- COVE STRAND (dry sand, foreground, light so it reads as ground) ----
  if (has("beach")){
    const topY = x=>shoreY(x,H,amp)+H*0.035;
    g.beginPath();
    g.moveTo(0,H); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } g.lineTo(W,H); g.closePath();
    g.fillStyle=inkLevel(2); g.fill();
    // faint drift lines in the sand
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.26;
    for(let j=1;j<=3;j++){ const y=lerp(H*(params.shoreLevel+0.12), H*0.96, j/3);
      g.beginPath(); for(let s=0;s<=20;s++){ const x=W*s/20; const yy=y+Math.sin(s*0.7+j)*H*0.006; s?g.lineTo(x,yy):g.moveTo(x,yy);} g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- DISEMBARK LEDGE: a low flat landing rock at the water's edge ----
  if (has("landing") && params.landing){
    const px = W*0.40, py = H*(params.shoreLevel+0.06);
    // wet scuff where a keel would nose in
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    g.beginPath(); g.ellipse(px, py+H*0.03, W*0.10, H*0.024, 0, 0, 7); g.stroke();
    g.globalAlpha=1;
    // the flat ledge slab (darkest -> reads as a solid disembark rock)
    pen.paint(()=>{
      g.moveTo(px-W*0.085, py+H*0.02);
      g.lineTo(px-W*0.065, py-H*0.014);
      g.lineTo(px+W*0.075, py-H*0.020);
      g.lineTo(px+W*0.095, py+H*0.02);
      g.closePath();
    }, toneSolid(inkLevel(6)), 5);
    // a low stepping stone beside it
    pen.paint(()=>{ g.ellipse(px+W*0.11, py+H*0.03, W*0.028, H*0.016, 0,0,7); }, toneSolid(inkLevel(5)), 4);
    // a bedding-mark line across the ledge top
    pen.ink(()=>{ g.moveTo(px-W*0.06, py-H*0.006); g.lineTo(px+W*0.07, py-H*0.010); }, 2);
  }

  // ---- FARM PATH winding up off the shore into the hills toward Eumaeus (exit top-right) ----
  if (has("path")){
    const s = params.hillSide;
    const x0 = W*0.52, y0 = H*0.88;                                  // path mouth on the strand
    const x1 = W*(0.5 + s*0.24), y1 = H*0.68;
    const x2 = (s>0?W:0) - s*W*0.08, y2 = H*(params.shoreLevel-0.02); // path leaves into the hills
    const edge = (off)=>{ g.beginPath(); g.moveTo(x0+off,y0); g.quadraticCurveTo(x1+off,y1,x2+off,y2); };
    g.strokeStyle=INK; g.lineWidth=3;
    edge(-W*0.045); g.stroke(); edge(W*0.045); g.stroke();
    // light ribbon down the middle
    g.strokeStyle=inkLevel(1); g.lineWidth=W*0.055; g.lineCap="round";
    edge(0); g.stroke(); g.lineCap="butt";
    // a plank/stile marker where the path meets the hillfoot
    pen.paint(()=>{ g.rect(x1+ s*W*0.05, y1-H*0.02, W*0.03, H*0.04); }, toneSolid(inkLevel(5)), 3);
  }
}

export const asset = {
  id:"location.secret-ithacan-landing",
  type:"LOCATION",
  name:"Secret Ithacan Landing",
  statusWord:"HIDDEN",
  scene:"OD-B15-S05",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","sea","lane","hills","olives","surf","beach","landing","path","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "landing:disembark":{x:.40,y:.62},     // the flat landing rock — where the boat noses in
    "entrance:water":{x:.35,y:.54},        // walk-off from the boat at the waterline
    "path:farm":{x:.52,y:.88},             // mouth of the farm path on the strand
    "exit:eumaeus":{x:.92,y:.28},          // where the path leaves inland toward the pig farm
    "lane:townward":{x:.18,y:.34},         // the ship-lane heading out to sea toward town
    "view:sea":{x:.24,y:.30},              // open sightline out to the empty sea
    "hill:crest":{x:.76,y:.20},            // rural hill crest inland
    "entrance:strand":{x:.06,y:.92},       // walk-on from the far end of the cove
    "camera:wide":{x:.50,y:.50}, "camera:landing":{x:.42,y:.58}, "camera:path":{x:.66,y:.56},
  },
  // walkable / interaction regions for scene placement + pathing
  zones:{
    strand:{ x0:.02,y0:.60,x1:.70,y1:.98 },   // dry cove sand (walkable)
    waterline:{ x0:.00,y0:.52,x1:1.0,y1:.62 },// wet sand / disembark approach
    farmPath:{ x0:.48,y0:.28,x1:.98,y1:.90 }, // the path + hillfoot inland
    sea:{ x0:.00,y0:.30,x1:1.0,y1:.54 },
  },
  states:{
    initial:"quiet",
    nodes:{
      quiet:{ preview:{ layers:["sky","sea","lane","hills","olives","surf","beach","landing","path"] } },
      "boat-away":{ preview:{ layers:["sky","sea","lane","hills","olives","surf","beach","landing","path"] } },
      "ashore":{ preview:{ layers:["sky","sea","hills","olives","surf","beach","landing","path"] } },
      bare:{ preview:{ layers:["sky","sea","hills","olives","surf","beach","path"] } },
    },
    edges:[["quiet","boat-away"],["quiet","ashore"],["ashore","bare"],["boat-away","ashore"]],
  },
  channels:["reveal","camera","tide","light"],

  preview:()=>({ layers:["sky","sea","lane","hills","olives","surf","beach","landing","path"], status:"HIDDEN", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
