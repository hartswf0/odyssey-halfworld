/* location.wooden-horse-interior — the cramped timber cavity inside the horse.
   LOCATION asset (empty navigable set): a dark barrel of curved rib beams that
   recede toward a small stern back-wall, longitudinal plank seams admitting
   thin blades of daylight, a boarding ladder rising to a roof hatch, and low
   crowded bench ledges down both flanks where warriors crouch. Drawn in SOLID
   grays + hard contour into the offscreen ctx (the engine dotify pass supplies
   the halftone). Declares depth layers (fg/mid/bg), a tight walkable floor,
   seam/hatch thresholds, occlusion order, and placement/camera anchors. No
   baked figures.
   Atlas: OD-B04-S04. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  ribs:6,              // curved frame beams from near mouth to far stern
  vanishX:0.50,        // vanishing point (down the belly of the horse)
  vanishY:0.44,
  nearBaseY:0.90,      // near floor line (fraction of H)
  nearPeakY:0.05,      // near vault crown (fraction of H)
  nearHalf:0.42,       // near arch half-width (fraction of W)
  farHalf:0.085,       // stern arch half-width (fraction of W)
  hatch:true,          // roof trapdoor admitting the brightest light
  ladder:true,         // boarding ladder to the hatch
  lightSeams:[0.20,0.44,0.66, 0.83], // u-positions of planks that leak daylight
};

/* an elliptical timber frame (rib) at depth d in 0..1 (0 = near mouth,
   1 = far stern). Returns a sampler arch(u) over u in 0..1 (left base ->
   crown -> right base) plus its baseY. */
function ribAt(W,H,d){
  const cx = W*params.vanishX;
  const hw   = lerp(W*params.nearHalf,  W*params.farHalf, d);
  const baseY= lerp(H*params.nearBaseY, H*params.vanishY + H*0.02, d);
  const peakY= lerp(H*params.nearPeakY, H*params.vanishY - H*0.02, d);
  return {
    cx, hw, baseY, peakY,
    at(u){
      const x = cx - hw*Math.cos(Math.PI*u);
      const y = baseY - (baseY-peakY)*Math.sin(Math.PI*u);
      return { x, y };
    },
  };
}

/* trace an arch path (does not begin/fill) */
function archPath(g, rib, seg=40){
  for(let i=0;i<=seg;i++){ const p=rib.at(i/seg); i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y); }
}

/* draw a subset of layers so scene state can reveal/occlude depth */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const cx = W*params.vanishX;
  const near = ribAt(W,H,0);
  const stern= ribAt(W,H,1);
  const layers = st.layers || ["hull","planks","seams","stern","ribs","benches","ladder","hatch","floor"];
  const has = l => layers.includes(l);
  const daylight = st.daylight ?? 0.6;   // how bright the leaked seams read

  // ---- HULL: the whole timber cavity, filled mid-dark so it dotifies ----
  if (has("hull")){
    pen.paint(()=>{ archPath(g, near); g.lineTo(near.cx+near.hw, H); g.lineTo(near.cx-near.hw, H); g.closePath(); },
      toneSolid(inkLevel(4)), 5);
    // interior gets darker toward the stern (depth) — a nested darker arch band
    const midR = ribAt(W,H,0.5);
    pen.paint(()=>{ archPath(g, midR); g.lineTo(midR.cx+midR.hw, midR.baseY); g.lineTo(midR.cx-midR.hw, midR.baseY); g.closePath(); },
      toneSolid(inkLevel(5)), 0);
  }

  // ---- PLANKS: longitudinal boards running mouth->stern, converging ----
  if (has("planks")){
    // draw as tapering solid strips between neighbouring u-lines so they read
    // as timber, not just lines
    const us=[0.06,0.14,0.28,0.5,0.72,0.86,0.94];
    for(let k=0;k<us.length-1;k++){
      const uA=us[k], uB=us[k+1];
      const nA=near.at(uA), nB=near.at(uB), fA=stern.at(uA), fB=stern.at(uB);
      const tone = toneSolid(inkLevel(k%2 ? 3 : 4));
      pen.paint(()=>{ g.moveTo(nA.x,nA.y); g.lineTo(nB.x,nB.y); g.lineTo(fB.x,fB.y); g.lineTo(fA.x,fA.y); g.closePath(); },
        tone, 0);
    }
  }

  // ---- SEAMS: plank joints; a few leak thin blades of daylight ----
  if (has("seams")){
    const us=[0.06,0.14,0.20,0.28,0.36,0.44,0.5,0.58,0.66,0.72,0.79,0.83,0.86,0.94];
    for(const u of us){
      const n=near.at(u), f=stern.at(u);
      const lit = params.lightSeams.some(ls=>Math.abs(ls-u)<0.02);
      if (lit){
        // bright light blade: paper-white core with a thin dark lip
        pen.ink(()=>{ g.moveTo(n.x,n.y); g.lineTo(f.x,f.y); }, 4);
        g.strokeStyle = inkLevel(clamp(Math.round(1-daylight*1), 0, 1)); // ~paper
        g.lineWidth = 2.4; g.lineCap="round";
        g.beginPath(); g.moveTo(n.x,n.y); g.lineTo(lerp(n.x,f.x,0.72), lerp(n.y,f.y,0.72)); g.stroke();
      } else {
        pen.seam(()=>{ g.moveTo(n.x,n.y); g.lineTo(f.x,f.y); }, 2);
      }
    }
  }

  // ---- STERN: the small far back-wall the cavity closes onto ----
  if (has("stern")){
    pen.paint(()=>{ archPath(g, stern); g.lineTo(stern.cx+stern.hw, stern.baseY); g.lineTo(stern.cx-stern.hw, stern.baseY); g.closePath(); },
      toneSolid(inkLevel(6)), 4);
    // a couple of planks across the stern
    for(let i=1;i<=2;i++){ const y=lerp(stern.peakY,stern.baseY,i/3);
      pen.seam(()=>{ g.moveTo(stern.cx-stern.hw*0.9,y); g.lineTo(stern.cx+stern.hw*0.9,y); }, 2); }
  }

  // ---- RIBS: the curved frame beams, near (thick) -> far (thin) ----
  if (has("ribs")){
    for(let i=0;i<params.ribs;i++){
      const d = i/(params.ribs-1);
      const rib = ribAt(W,H, 0.04 + d*0.9);
      const lw  = lerp(9, 2.5, d);
      const tone= toneSolid(inkLevel(Math.round(lerp(6,4,d))));
      // beam: a solid grey arch with a hard contour lip so it reads as timber
      g.lineCap="round"; g.lineJoin="round";
      g.strokeStyle=INK; g.lineWidth=lw+3.5; g.beginPath(); archPath(g,rib); g.stroke();
      g.strokeStyle=tone.base; g.lineWidth=lw; g.beginPath(); archPath(g,rib); g.stroke();
      // pegged joints where beam meets the floor ledge
      if (d<0.55){ const l=rib.at(0.05), r=rib.at(0.95);
        g.fillStyle=inkLevel(7);
        g.beginPath(); g.arc(l.x,l.y,lw*0.30,0,7); g.fill();
        g.beginPath(); g.arc(r.x,r.y,lw*0.30,0,7); g.fill(); }
    }
  }

  // ---- BENCHES: low crowded seat ledges down both flanks (mid/fg) ----
  if (has("benches")){
    // ledge follows the floor line receding on each side; top light, face dark
    const drawLedge=(sign)=>{
      const uNear = sign<0 ? 0.10 : 0.90;   // near flank contact on the arch
      const uFar  = sign<0 ? 0.30 : 0.70;
      const nP=near.at(uNear), fP=stern.at(uFar);
      const seatDrop = H*0.055;
      // seat top surface (lighter, walk/crouch surface)
      pen.paint(()=>{
        g.moveTo(nP.x, nP.y - seatDrop);
        g.lineTo(fP.x, fP.y - seatDrop*0.5);
        g.lineTo(fP.x + sign*W*0.05, fP.y - seatDrop*0.5);
        g.lineTo(nP.x + sign*W*0.10, nP.y - seatDrop);
        g.closePath();
      }, toneSolid(inkLevel(3)), 4);
      // seat front face (darker)
      pen.paint(()=>{
        g.moveTo(nP.x, nP.y - seatDrop);
        g.lineTo(fP.x, fP.y - seatDrop*0.5);
        g.lineTo(fP.x, fP.y + seatDrop*0.2);
        g.lineTo(nP.x, nP.y + seatDrop*0.4);
        g.closePath();
      }, toneSolid(inkLevel(6)), 4);
      // support struts
      for(let t=0.2;t<0.9;t+=0.28){
        const sx=lerp(nP.x,fP.x,t), syTop=lerp(nP.y,fP.y,t)-seatDrop*lerp(1,0.5,t), syBot=lerp(nP.y,fP.y,t)+seatDrop*0.3;
        pen.seam(()=>{ g.moveTo(sx,syTop); g.lineTo(sx,syBot); }, 3);
      }
    };
    drawLedge(-1);
    drawLedge( 1);
  }

  // ---- LADDER: boarding ladder rising to the roof hatch ----
  if (has("ladder") && params.ladder){
    const lx = cx - W*0.055;                // slightly off-centre
    const topY = H*0.14, botY = H*0.86, rail = W*0.045;
    const railTone = toneSolid(inkLevel(6));
    // two rails, slight taper going up (perspective)
    pen.paint(()=>{ g.rect(lx-rail, botY-6, rail*0.42, -(botY-topY)); }, railTone, 4);
    pen.paint(()=>{ g.rect(lx+rail*0.6, botY-6, rail*0.42, -(botY-topY)); }, railTone, 4);
    // rungs
    g.strokeStyle=INK; g.lineWidth=6; g.lineCap="round";
    const nR=7;
    for(let i=0;i<=nR;i++){ const ry=lerp(botY,topY,i/nR);
      g.beginPath(); g.moveTo(lx-rail, ry); g.lineTo(lx+rail, ry); g.stroke(); }
  }

  // ---- HATCH: roof trapdoor — the brightest opening, admits a light shaft ----
  if (has("hatch") && params.hatch){
    const hx = cx, hy = H*0.145, hw = W*0.11, hh = H*0.04;
    // light shaft falling from the hatch into the cavity (soft narrow wedge)
    g.save(); g.globalAlpha = 0.28 * (st.daylight ?? 0.6);
    g.fillStyle = inkLevel(0);
    g.beginPath();
    g.moveTo(hx-hw*0.55, hy+hh*0.4); g.lineTo(hx+hw*0.55, hy+hh*0.4);
    g.lineTo(cx + W*0.055, H*0.86); g.lineTo(cx - W*0.055, H*0.86); g.closePath(); g.fill();
    g.restore();
    // the open hatch panel (bright rim of daylight)
    pen.paint(()=>{ g.ellipse(hx, hy, hw, hh, 0,0,7); }, toneSolid(inkLevel(0)), 5);
    // the propped-open lid — kept in frame, mid tone
    pen.paint(()=>{
      g.moveTo(hx-hw, hy); g.lineTo(hx-hw*1.05, hy-hh*1.4);
      g.lineTo(hx+hw*0.25, hy-hh*1.7); g.lineTo(hx+hw*0.55, hy-hh*0.25); g.closePath();
    }, toneSolid(inkLevel(5)), 4);
  }

  // ---- FLOOR: the tight walkable timber floor between the flanks ----
  if (has("floor")){
    pen.paint(()=>{
      g.moveTo(near.cx-near.hw*0.7, near.baseY);
      g.lineTo(near.cx+near.hw*0.7, near.baseY);
      g.lineTo(stern.cx+stern.hw*0.6, stern.baseY);
      g.lineTo(stern.cx-stern.hw*0.6, stern.baseY);
      g.closePath();
    }, toneSolid(inkLevel(3)), 4);
    // floor plank cross-rules (perspective, toward stern)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let j=1;j<=4;j++){ const t=(j/4)*(j/4);
      const y=lerp(near.baseY,stern.baseY,t), hwt=lerp(near.hw*0.7,stern.hw*0.6,t);
      g.beginPath(); g.moveTo(cx-hwt,y); g.lineTo(cx+hwt,y); g.stroke(); }
    // centre keel line
    g.beginPath(); g.moveTo(cx,near.baseY); g.lineTo(cx,stern.baseY); g.stroke();
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"location.wooden-horse-interior",
  type:"LOCATION",
  name:"Wooden Horse Interior",
  statusWord:"CONCEALED",
  scene:"OD-B04-S04",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["hull","planks","seams","stern","ribs","benches","ladder","hatch","floor"],
  // normalized 0..1 placement / camera anchors (NOT baked figures)
  anchors:{
    "hatch:roof":{x:.50,y:.10},              // trapdoor threshold to the outside
    "ladder:base":{x:.44,y:.85},             // foot of the boarding ladder
    "ladder:top":{x:.44,y:.14},
    "stern:backwall":{x:.50,y:.44},          // far closing wall of the cavity
    "bench:left-near":{x:.20,y:.80},
    "bench:left-mid":{x:.34,y:.62},
    "bench:right-near":{x:.80,y:.80},
    "bench:right-mid":{x:.66,y:.62},
    "seam:light-left":{x:.30,y:.55},         // a daylight seam threshold
    "seam:light-right":{x:.70,y:.55},
    "floor:centre":{x:.50,y:.86},
    "camera:wide":{x:.50,y:.50}, "camera:hatch":{x:.50,y:.30},
  },
  // walkable ground region (the tight timber floor) for scene placement / pathing
  zones:{
    walkable:{ x0:.34,y0:.60,x1:.66,y1:.92 },
    "bench-left":{ x0:.10,y0:.58,x1:.40,y1:.86 },
    "bench-right":{ x0:.60,y0:.58,x1:.90,y1:.86 },
    "ladder-well":{ x0:.38,y0:.14,x1:.50,y1:.88 },
  },
  states:{
    initial:"concealed",
    nodes:{
      // sealed and dark — warriors packed silent inside
      concealed:{ preview:{ layers:["hull","planks","seams","stern","ribs","benches","ladder","floor"], daylight:0.35 } },
      // hatch cracked — a shaft of daylight falls in
      "hatch-open":{ preview:{ layers:["hull","planks","seams","stern","ribs","benches","ladder","hatch","floor"], daylight:0.95 } },
      // bare set — no ledges/ladder, empty cavity shell
      empty:{ preview:{ layers:["hull","planks","seams","stern","ribs","floor"], daylight:0.45 } },
    },
    edges:[["concealed","hatch-open"],["hatch-open","concealed"],["concealed","empty"]],
  },
  channels:["reveal","daylight","hatch","camera","sound"],

  preview:()=>({ layers:["hull","planks","seams","stern","ribs","benches","ladder","hatch","floor"], daylight:0.6, status:"CONCEALED", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
