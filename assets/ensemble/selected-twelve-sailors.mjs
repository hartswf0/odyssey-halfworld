/* ensemble.selected-twelve-sailors — Odysseus's picked expedition band.
   ENSEMBLE asset. Twelve sailors built from ONE separable member template
   (a laden walking sailor + a carry rig) instanced along a receding path so
   the band reads as a FOLLOWING-FILE trailing one ship across the channel.
   Exposes formation (following-file | carry-line | gather), density,
   attention (heads turned to the ship/Odysseus), spread, and a "trudge"
   reaction-wave that ripples the stride down the file. Drawn in SOLID grays
   + hard contour into the offscreen ctx; the engine dotify POST pass supplies
   the halftone. Do NOT bake named characters in.
   Atlas OD-B09-S04 — a small expedition group carrying provisions and
   following one ship across the channel. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* ---- the loads the picked band carries (the separable prop rigs) ---- */
const LOADS = ["sack","jar","skin","bundle","staff"];

/* ---- FORMATIONS: the same member template arranged three ways.
   Each roster entry = { load, t(0 front..1 far/back), lat(-1..1 lateral),
   flip(+1 toward ship / -1 turned back) }. Twelve members each. */
const FORMATIONS = {
  // the crossing: a following file receding toward the leading ship
  "following-file": [
    { load:"staff",  t:0.06, lat: 0.2, flip:1 },
    { load:"sack",   t:0.13, lat:-0.7, flip:1 },
    { load:"jar",    t:0.20, lat: 0.6, flip:1 },
    { load:"skin",   t:0.27, lat:-0.5, flip:1 },
    { load:"bundle", t:0.34, lat: 0.5, flip:1 },
    { load:"sack",   t:0.41, lat:-0.4, flip:1 },
    { load:"jar",    t:0.48, lat: 0.4, flip:1 },
    { load:"skin",   t:0.55, lat:-0.35,flip:1 },
    { load:"bundle", t:0.62, lat: 0.3, flip:1 },
    { load:"sack",   t:0.69, lat:-0.3, flip:1 },
    { load:"jar",    t:0.76, lat: 0.25,flip:1 },
    { load:"staff",  t:0.83, lat:-0.2, flip:1 },
  ],
  // provisions passed hand-to-hand up the strand (a supply line, tighter)
  "carry-line": [
    { load:"sack",   t:0.10, lat:-0.9, flip:1 },
    { load:"jar",    t:0.14, lat: 0.8, flip:1 },
    { load:"sack",   t:0.22, lat:-0.8, flip:1 },
    { load:"skin",   t:0.26, lat: 0.7, flip:1 },
    { load:"jar",    t:0.35, lat:-0.7, flip:1 },
    { load:"bundle", t:0.39, lat: 0.6, flip:1 },
    { load:"sack",   t:0.48, lat:-0.6, flip:1 },
    { load:"jar",    t:0.52, lat: 0.5, flip:1 },
    { load:"skin",   t:0.61, lat:-0.5, flip:1 },
    { load:"sack",   t:0.65, lat: 0.4, flip:1 },
    { load:"jar",    t:0.74, lat:-0.4, flip:1 },
    { load:"bundle", t:0.78, lat: 0.3, flip:1 },
  ],
  // mustered on the strand before embarking (a clustered knot, mixed facing)
  "gather": [
    { load:"staff",  t:0.10, lat:-0.9, flip: 1 },
    { load:"sack",   t:0.16, lat: 0.6, flip:-1 },
    { load:"jar",    t:0.14, lat:-0.2, flip: 1 },
    { load:"skin",   t:0.22, lat: 0.9, flip:-1 },
    { load:"bundle", t:0.20, lat:-0.6, flip: 1 },
    { load:"sack",   t:0.28, lat: 0.3, flip:-1 },
    { load:"jar",    t:0.26, lat:-0.9, flip: 1 },
    { load:"skin",   t:0.34, lat: 0.7, flip:-1 },
    { load:"bundle", t:0.32, lat:-0.3, flip: 1 },
    { load:"sack",   t:0.40, lat: 0.5, flip:-1 },
    { load:"jar",    t:0.38, lat:-0.7, flip: 1 },
    { load:"staff",  t:0.46, lat: 0.2, flip: 1 },
  ],
};

const params = {
  formation:"following-file",
  count: 12,                 // the picked twelve
  waterLevel:0.50,           // the channel (water line) as fraction of H
  ship:{ x:0.86, tCross:0.5 },// the one ship leading, out on the channel
  attention:0.6,             // 0 heads-down under the load .. 1 turned to the ship
  spread:1.0,                // lateral spread of the file about its path
  density:1.0,               // 0 near members only .. 1 all twelve
  trudge:0.0,                // reaction-wave: stride pulse position 0..1 along file
};

/* the receding march path (front-left strand -> the water's edge under the ship) */
function pathPoint(t, lat, spread, W, H){
  const x0=0.15, y0=0.95, x1=0.66, y1=0.585;
  const x = lerp(x0,x1,t) + lat*spread*0.105*(1-t*0.4);
  const y = lerp(y0,y1,t);
  return { x:x*W, y:y*H };
}
const scaleAt = t => lerp(190, 82, t);          // near big .. far small
const lvlAt   = t => Math.round(lerp(3, 2, t)); // distant a touch lighter

/* ============================================================
   MEMBER TEMPLATE — one laden sailor, drawn deterministically.
   cx/footY/s in px; load selects the carry rig; F flip (facing dir).
   opt carries { lvl, phase(0..1 stride), headTurn(px), trudge(0..1) }.
   ============================================================ */
function sailor(pen, g, cx, footY, s, load, F, opt){
  const lvl   = opt.lvl ?? 3;
  const cloth = toneSolid(inkLevel(lvl));
  const legT  = toneSolid(inkLevel(Math.min(5, lvl+2)));
  const skin  = toneSolid(inkLevel(1));
  const hair  = toneSolid(inkLevel(5));
  const prop  = toneSolid(inkLevel(Math.min(5, lvl+2)));
  const propMid = toneSolid(inkLevel(Math.min(4, lvl+1)));
  const cw = Math.max(2, s*0.02);

  // stride: a walk phase, deepened where the trudge wave passes
  const sw = Math.sin(opt.phase*6.283) * (0.9 + 0.5*(opt.trudge||0));
  const footFrontX = cx + F*s*(0.12 + 0.05*sw);
  const footBackX  = cx - F*s*(0.12 - 0.05*sw);
  const hipY   = footY - s*0.40;
  const lean   = F*s*(0.06 + 0.03*(opt.trudge||0));   // forward lean under the load
  const shoulderY = hipY - s*0.30;
  const shoulderW = s*0.26;
  const hipW      = s*0.30;
  const headR     = s*0.118;
  const headCy    = shoulderY - headR*1.12;
  const hx = cx + lean + (opt.headTurn||0);
  const hy = headCy;

  // ground shadow
  g.fillStyle = "rgba(0,0,0,0.11)";
  g.beginPath(); g.ellipse(cx, footY+s*0.015, s*0.24, s*0.04, 0,0,7); g.fill();

  // --- LEGS (mid-stride), behind torso ---
  pen.limb(()=>{ g.moveTo(cx-F*s*0.01, hipY); g.lineTo((cx+footBackX)/2, hipY+s*0.19); g.lineTo(footBackX, footY); }, legT, s*0.075);
  pen.paint(()=>{ g.ellipse(footBackX-F*s*0.01, footY, s*0.075, s*0.032, 0,0,7); }, toneSolid(inkLevel(5)), cw*0.8);
  pen.limb(()=>{ g.moveTo(cx+F*s*0.01, hipY); g.lineTo((cx+footFrontX)/2, hipY+s*0.19); g.lineTo(footFrontX, footY); }, legT, s*0.078);
  pen.paint(()=>{ g.ellipse(footFrontX+F*s*0.02, footY, s*0.08, s*0.034, 0,0,7); }, toneSolid(inkLevel(5)), cw*0.8);

  // --- BACK LOAD drawn behind the torso for depth (sack/bundle ride the back) ---
  if (load==="sack" || load==="bundle") drawBackLoad(pen,g,cx,shoulderY,s,F,lean,load,prop,propMid,cw);

  // --- TORSO tunic (blocky trapezoid, sheared forward by the lean) ---
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hipW/2, hipY);
    g.lineTo(cx-hipW/2, hipY);
    g.closePath();
  }, cloth, cw);
  // belt + a fold seam
  pen.seam(()=>{ g.moveTo(cx-hipW*0.48, hipY-s*0.01); g.lineTo(cx+hipW*0.48, hipY-s*0.01); }, cw*0.8);
  pen.seam(()=>{ g.moveTo(cx+lean*0.5, shoulderY+s*0.05); g.lineTo(cx, hipY-s*0.02); }, cw*0.6);

  // --- NECK + HEAD ---
  pen.limb(()=>{ g.moveTo(cx+lean, shoulderY+s*0.01); g.lineTo(hx, hy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0,7); }, skin, cw);
  // hair cap over crown + nape
  pen.paint(()=>{ g.arc(hx, hy-headR*0.05, headR*1.04, Math.PI*0.98, Math.PI*2.02); }, hair, cw*0.8);

  // --- CARRY RIG (front arm + prop / strap) ---
  drawCarry(pen,g,{cx,shoulderY,shoulderW,hipY,footY,s,F,lean,load,prop,propMid,skin,cloth,hair,cw});
}

/* the back-borne loads (sack, bundle) — a mass slung high on the shoulders */
function drawBackLoad(pen,g,cx,shoulderY,s,F,lean,load,prop,propMid,cw){
  const bx = cx - F*s*0.15 + lean, by = shoulderY - s*0.05;
  if (load==="sack"){
    pen.paint(()=>{ g.ellipse(bx, by, s*0.145, s*0.17, F*0.12, 0,7); }, prop, cw);
    // cinched neck of the sack
    pen.seam(()=>{ g.moveTo(bx-s*0.05, by-s*0.14); g.lineTo(bx+s*0.05, by-s*0.16); }, cw*0.8);
  } else { // bundle — a lashed rectangular pack
    pen.paint(()=>{ g.rect(bx-s*0.14, by-s*0.15, s*0.26, s*0.30); }, prop, cw);
    pen.seam(()=>{ g.moveTo(bx-s*0.14, by); g.lineTo(bx+s*0.12, by); }, cw*0.7);      // lashing
    pen.seam(()=>{ g.moveTo(bx-s*0.02, by-s*0.15); g.lineTo(bx-s*0.02, by+s*0.15); }, cw*0.7);
  }
}

/* the front carry rig — arm(s) + the visible prop / strap for each load */
function drawCarry(pen,g,C){
  const { cx,shoulderY,shoulderW,hipY,s,F,lean,load,prop,propMid,skin,cloth,cw } = C;
  const sh = { x:cx + F*shoulderW*0.42 + lean, y:shoulderY + s*0.03 };

  if (load==="sack" || load==="bundle"){
    // a strap crossing the chest to the back load; a hand tucked under it
    pen.ink(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(cx - F*s*0.10 + lean, hipY - s*0.06); }, cw*0.9);
    const wr = { x:cx - F*s*0.02, y:hipY - s*0.10 };
    pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(cx+F*s*0.10, shoulderY+s*0.14); g.lineTo(wr.x, wr.y); }, cloth, s*0.05);
    pen.paint(()=>{ g.arc(wr.x, wr.y, s*0.03, 0,7); }, skin, cw*0.7);
    return;
  }

  if (load==="jar"){
    // an amphora shouldered on the near side; arm up under the belly to steady it
    const jx = cx + F*s*0.15, jy = shoulderY - s*0.04;
    const wr = { x:jx, y:jy + s*0.05 };
    pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(cx+F*s*0.13, shoulderY+s*0.03); g.lineTo(wr.x, wr.y); }, cloth, s*0.05);
    pen.paint(()=>{ g.ellipse(jx, jy-s*0.05, s*0.095, s*0.15, 0,0,7); }, prop, cw);        // belly
    pen.paint(()=>{ g.rect(jx-s*0.028, jy-s*0.27, s*0.056, s*0.12); }, propMid, cw);        // neck
    pen.paint(()=>{ g.ellipse(jx, jy-s*0.29, s*0.05, s*0.028, 0,0,7); }, prop, cw);          // mouth
    pen.seam(()=>{ g.moveTo(jx-s*0.085,jy-s*0.15); g.quadraticCurveTo(jx-s*0.13,jy-s*0.24,jx-s*0.035,jy-s*0.25); }, cw*0.7); // handle
    pen.paint(()=>{ g.arc(wr.x, wr.y, s*0.028, 0,7); }, skin, cw*0.7);
    return;
  }

  if (load==="skin"){
    // a bulging waterskin slung from the shoulder, swinging at the hip
    const kx = cx - F*s*0.06, ky = hipY + s*0.02;
    pen.ink(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(kx, ky - s*0.10); }, cw*0.9);              // sling
    pen.paint(()=>{ g.ellipse(kx, ky, s*0.10, s*0.13, -F*0.2, 0,7); }, prop, cw);           // skin belly
    pen.paint(()=>{ g.rect(kx+F*s*0.02, ky-s*0.15, s*0.04, s*0.06); }, propMid, cw);         // stopper neck
    // the free front arm swinging forward
    const wr = { x:cx + F*s*0.16, y:hipY - s*0.04 };
    pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(wr.x, wr.y); }, cloth, s*0.05);
    pen.paint(()=>{ g.arc(wr.x, wr.y, s*0.03, 0,7); }, skin, cw*0.7);
    return;
  }

  // staff — a scout leading with a long staff planted forward
  const grip = { x:cx + F*s*0.14, y:shoulderY + s*0.10 };
  const staffTop = { x:cx + F*s*0.20, y:shoulderY - s*0.42 };
  const staffFoot= { x:cx + F*s*0.24, y:C.footY + s*0.02 };
  pen.ink(()=>{ g.moveTo(staffTop.x, staffTop.y); g.lineTo(staffFoot.x, staffFoot.y); }, cw*1.3);
  pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(grip.x, grip.y); }, cloth, s*0.05);
  pen.paint(()=>{ g.arc(grip.x, grip.y, s*0.03, 0,7); }, skin, cw*0.7);
}

/* the one leading ship, crossing the channel out ahead of the file */
function drawShip(pen, g, W, H, st){
  const water = (st.waterLevel ?? params.waterLevel) * H;
  const sx = (st.ship?.x ?? params.ship.x) * W;
  const cross = st.ship?.tCross ?? params.ship.tCross;
  const sy = water - H*0.008;
  const hw = W*0.14, hh = H*0.05;
  // hull (a black-ship crescent)
  pen.paint(()=>{
    g.moveTo(sx-hw, sy);
    g.quadraticCurveTo(sx-hw*0.9, sy+hh, sx, sy+hh*1.05);
    g.quadraticCurveTo(sx+hw*0.9, sy+hh, sx+hw, sy);
    g.lineTo(sx+hw*0.78, sy);
    g.quadraticCurveTo(sx, sy+hh*0.45, sx-hw*0.78, sy);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
  // stem/stern posts
  pen.ink(()=>{ g.moveTo(sx-hw, sy); g.lineTo(sx-hw*1.05, sy-hh*0.9); }, 4);
  pen.ink(()=>{ g.moveTo(sx+hw, sy); g.lineTo(sx+hw*1.02, sy-hh*0.7); }, 4);
  // mast + yard + a furled sail block
  pen.paint(()=>{ g.rect(sx-W*0.006, sy-H*0.16, W*0.012, H*0.16); }, toneSolid(inkLevel(7)), 3);
  pen.paint(()=>{ g.rect(sx-hw*0.5, sy-H*0.145, hw, H*0.010); }, toneSolid(inkLevel(6)), 3);
  pen.paint(()=>{ g.rect(sx-hw*0.34, sy-H*0.14, hw*0.68, H*0.055); }, toneSolid(inkLevel(4)), 3); // sail
  // a rank of oars raking the water
  g.strokeStyle=INK; g.lineWidth=2;
  for(let i=-3;i<=3;i++){ g.beginPath(); g.moveTo(sx+i*hw*0.22, sy+hh*0.4); g.lineTo(sx+i*hw*0.22 - hw*0.10, water+H*0.03); g.stroke(); }
  // a faint wake behind the crossing ship
  g.strokeStyle=INK; g.lineWidth=1.5; g.globalAlpha=0.4;
  const wake = sx - lerp(-1,1,cross)*W*0.05;
  g.beginPath(); g.moveTo(wake-hw*1.2, water+H*0.02); g.lineTo(wake-hw*2.4, water+H*0.05); g.stroke();
  g.globalAlpha=1;
}

/* ============================================================
   STAGE — channel context (sky, water, the leading ship), then N members.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const water = (st.waterLevel ?? params.waterLevel) * H;
  const attention = st.attention ?? params.attention;
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const trudge    = st.trudge ?? params.trudge;
  const formation = st.formation || params.formation;
  const roster0   = FORMATIONS[formation] || FORMATIONS["following-file"];
  const shipX     = (st.ship?.x ?? params.ship.x) * W;
  const shipY     = water - H*0.01;

  // ---- SKY (lightest) ----
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,water);
  // a low far shore across the channel
  g.fillStyle=inkLevel(2);
  g.beginPath();
  g.moveTo(0, water);
  for(let x=0;x<=W;x+=W*0.05){ g.lineTo(x, water - H*0.03 - Math.abs(Math.sin(x*0.012))*H*0.02); }
  g.lineTo(W, water); g.closePath(); g.fill();

  // ---- CHANNEL water band (mid tone) with wave rules ----
  g.fillStyle=inkLevel(3); g.fillRect(0,water,W,H-water);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
  for(let j=1;j<=5;j++){
    const y=water+(H-water)*(j/6);
    g.beginPath();
    for(let x=0;x<=W;x+=W*0.04){ const yy=y+Math.sin(x*0.05+j)*3; if(x===0) g.moveTo(x,yy); else g.lineTo(x,yy); }
    g.stroke();
  }
  g.globalAlpha=1;

  // ---- the one LEADING ship out on the channel ----
  drawShip(pen, g, W, H, st);

  // ---- the twelve, drawn far -> near (painter's order) ----
  const roster = roster0
    .map((m,i)=>({ m, i }))
    .filter(({m})=> density>=1 ? true : m.t <= density*0.9 + 0.1)
    .sort((a,b)=> b.m.t - a.m.t);

  roster.forEach(({ m, i })=>{
    const p  = pathPoint(m.t, m.lat, spread, W, H);
    const s  = scaleAt(m.t);
    const lvl= lvlAt(m.t);
    const F  = m.flip;
    // attention: turn the head toward the ship / Odysseus (bounded)
    const headTurn = clamp((shipX - p.x)*0.06*attention, -s*0.08, s*0.08);
    // stride phase staggered down the file
    const phase = (i*0.37 + m.t*0.6) % 1;
    // reaction-wave: a "trudge" pulse sweeping the file by t
    const local = clamp01(1 - Math.abs(trudge - m.t)*3.5);
    sailor(pen, g, p.x, p.y, s, m.load, F, { lvl, phase, headTurn, trudge: local });
  });
}

export const asset = {
  id:"ensemble.selected-twelve-sailors",
  type:"ENSEMBLE",
  name:"Selected twelve sailors",
  statusWord:"LADEN",
  scene:"OD-B09-S04",

  params,
  // ONE member template + carry rig, instanced along the march path
  member:{ template:"sailor", loads:LOADS, formations:Object.keys(FORMATIONS) },
  // far -> near draw order
  layers:["sky","far-shore","water","ship","file-far","file-mid","file-near"],
  // normalized placement / camera anchors (NOT baked characters)
  anchors:{
    "ship:lead":{x:.86,y:.49},
    "file:head":{x:.66,y:.61},        // the sailor nearest the ship
    "file:tail":{x:.16,y:.94},        // the last sailor on the strand
    "leader:odysseus":{x:.78,y:.55},  // Odysseus's place, ahead of the band
    "station:carry":{x:.42,y:.78},
    "waters-edge":{x:.60,y:.52},
    "camera:wide":{x:.50,y:.55},
    "entrance:strand":{x:.06,y:.94}, "exit:embark":{x:.72,y:.58},
  },
  // walkable strand the file trudges along (for scene pathing/placement)
  zones:{ strand:{ x0:.06,y0:.56,x1:.94,y1:.98 }, waterline:{ x0:.50,y0:.48,x1:.94,y1:.56 } },
  states:{
    initial:"following-file",
    nodes:{
      "following-file":{ preview:{ formation:"following-file", attention:0.6,  spread:1.0, density:1.0, trudge:0.0 } },
      "carry-line":{     preview:{ formation:"carry-line",     attention:0.45, spread:1.0, density:1.0, trudge:0.4 } },
      "gather":{         preview:{ formation:"gather",         attention:0.8,  spread:1.1, density:1.0, trudge:0.0 } },
    },
    edges:[["gather","following-file"],["following-file","carry-line"],["carry-line","following-file"]],
  },
  channels:["formation","attention","trudge","density","spread"],

  preview:()=>({ formation:"following-file", attention:0.6, spread:1.0, density:1.0, trudge:0.0, status:"LADEN", progress:.22 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
