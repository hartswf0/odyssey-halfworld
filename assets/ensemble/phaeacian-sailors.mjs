/* ensemble.phaeacian-sailors — the fifty-two-man work-gang of Phaeacia.
   ENSEMBLE asset. A coordinated crew built from ONE separable member
   template (a worker figure + a task rig) instanced deterministically AROUND
   a central hull: launching (heaving on the hawser), masting (rigging the
   halyard), provisioning (a carry-line of jars), and inspecting (a captain
   at the prow). Exposes FORMATION (launch-line | rigging | carry), density,
   attention, reaction-wave ("heave" pulse), and foreground/background bands.
   A faint back-rank of small silhouettes implies the full fifty-two.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify POST pass supplies the halftone. Do NOT bake named characters in.
   Atlas OD-B08-S01 — fifty-two specialists launching, masting, provisioning,
   and inspecting a fast convoy ship. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* ---- the four labours of the launch ---- */
const TASKS = ["heave","rig","carry","inspect"];

/* ---- FORMATIONS: the same worker template arranged around the hull.
   roster entry = { task, band(0 far..2 near), x(0..1), flip(+1 faces R / -1 L) }. */
const FORMATIONS = {
  // the hero view: all four labours around the beached hull at once
  "full-launch": [
    { task:"inspect", band:0, x:0.15, flip: 1 },   // captain at the prow
    { task:"rig",     band:0, x:0.45, flip: 1 },   // masting party on deck
    { task:"rig",     band:0, x:0.57, flip:-1 },
    { task:"carry",   band:0, x:0.74, flip:-1 },   // stowing amidships
    { task:"carry",   band:1, x:0.28, flip: 1 },   // provisioning line up the strand
    { task:"carry",   band:1, x:0.40, flip: 1 },
    { task:"heave",   band:1, x:0.80, flip:-1 },   // shoulder to the stern
    { task:"heave",   band:1, x:0.90, flip:-1 },
    { task:"heave",   band:2, x:0.16, flip: 1 },   // foreground hawser gang
    { task:"heave",   band:2, x:0.31, flip: 1 },
    { task:"heave",   band:2, x:0.46, flip: 1 },
    { task:"carry",   band:2, x:0.66, flip: 1 },
    { task:"heave",   band:2, x:0.83, flip:-1 },
  ],
  // the launch-line: the whole gang ranged along the hawser, heaving her down
  "launch-line": [
    { task:"heave", band:1, x:0.20, flip: 1 },
    { task:"heave", band:1, x:0.36, flip: 1 },
    { task:"heave", band:1, x:0.52, flip: 1 },
    { task:"heave", band:1, x:0.70, flip: 1 },
    { task:"heave", band:2, x:0.14, flip: 1 },
    { task:"heave", band:2, x:0.31, flip: 1 },
    { task:"heave", band:2, x:0.48, flip: 1 },
    { task:"heave", band:2, x:0.65, flip: 1 },
    { task:"heave", band:2, x:0.82, flip: 1 },
    { task:"inspect", band:0, x:0.14, flip: 1 },
  ],
  // the masting party: clustered at the mast raising the yard on its halyard
  "rigging": [
    { task:"rig", band:0, x:0.40, flip: 1 },
    { task:"rig", band:0, x:0.52, flip:-1 },
    { task:"rig", band:0, x:0.62, flip:-1 },
    { task:"rig", band:1, x:0.32, flip: 1 },
    { task:"rig", band:1, x:0.68, flip:-1 },
    { task:"heave", band:2, x:0.30, flip: 1 },   // steadying stays fore
    { task:"heave", band:2, x:0.72, flip:-1 },   // and aft
    { task:"inspect", band:2, x:0.50, flip: 1 }, // shipwright checking the step
  ],
  // provisioning: a diagonal carry-line bringing jars aboard
  "carry": [
    { task:"carry", band:0, x:0.66, flip:-1 },
    { task:"carry", band:0, x:0.78, flip:-1 },
    { task:"carry", band:1, x:0.24, flip: 1 },
    { task:"carry", band:1, x:0.40, flip: 1 },
    { task:"carry", band:1, x:0.56, flip: 1 },
    { task:"carry", band:2, x:0.18, flip: 1 },
    { task:"carry", band:2, x:0.36, flip: 1 },
    { task:"carry", band:2, x:0.54, flip: 1 },
    { task:"inspect", band:2, x:0.82, flip:-1 },
  ],
};

const params = {
  formation:"full-launch",
  bands:3,
  count:52,                  // the specialists this gang represents
  crowd:14,                  // faint back-rank silhouettes implying the full company
  strandLevel:0.66,          // strand / keel line as fraction of H
  hull:{ prowX:0.13, sternX:0.87, mastX:0.50, mastTopY:0.12 },
  attention:0.55,            // 0 heads-down at labour .. 1 turned to the mast head
  spread:1.0,                // formation width multiplier about centre
  density:1.0,               // 0 sparse (near band only) .. 1 full company
  heave:0.0,                 // reaction-wave position 0..1 across the width
};

const BAND_Y   = [0.585, 0.760, 0.930];   // footline per depth band
const BAND_S   = [140, 190, 250];          // worker height px per band
const BAND_LVL = [3, 4, 3];                // tunic ink level per band

/* ============================================================
   MEMBER TEMPLATE — one worker, drawn deterministically.
   cx/footY/s in px. task selects the rig + prop; lvl the tunic tone.
   opt carries {headDX, heave, mast:{x,topY}, prow:{x,y}}.
   ============================================================ */
function worker(pen, g, cx, footY, s, task, lvl, m, opt){
  const cloth = toneSolid(inkLevel(lvl));
  const legT  = toneSolid(inkLevel(Math.min(7, lvl+2)));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const prop  = toneSolid(inkLevel(Math.min(7, lvl+3)));
  const cw = Math.max(2, s*0.02);
  const F  = m.flip;
  const heave = opt.heave || 0;

  // stance + lean per labour
  let lean = 0, crouch = 0, stance = s*0.10;
  if (task==="heave"){ lean = -F*s*(0.14+0.08*heave); crouch = s*0.03; stance = s*0.20; }
  else if (task==="carry"){ lean = F*s*0.03; stance = s*0.09; }
  else if (task==="rig"){ lean = 0; crouch = s*0.02; stance = s*0.11; }
  else if (task==="inspect"){ lean = 0; stance = s*0.08; }

  const hipY = footY - s*0.40 + crouch;
  const shoulderY = hipY - s*0.28;
  const hipW = s*0.19, shoulderW = s*0.26;
  const headR = s*0.108;
  const hx = cx + lean + (opt.headDX||0);
  const headCy = shoulderY - headR*1.15;

  // ground shadow
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY+s*0.015, s*0.22, s*0.035, 0,0,7); g.fill();

  // --- LEGS (braced stance) ---
  const backFoot  = task==="heave" ? cx + F*stance*0.2 - F*stance*1.1 : cx - stance;
  const frontFoot = task==="heave" ? cx - F*stance*0.9 : cx + stance;
  pen.limb(()=>{ g.moveTo(cx-hipW*0.35+lean*0.4, hipY); g.lineTo(backFoot,  footY); }, legT, s*0.072);
  pen.limb(()=>{ g.moveTo(cx+hipW*0.35+lean*0.4, hipY); g.lineTo(frontFoot, footY); }, legT, s*0.072);
  pen.paint(()=>{ g.ellipse(backFoot,  footY, s*0.05, s*0.024, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);
  pen.paint(()=>{ g.ellipse(frontFoot, footY, s*0.05, s*0.024, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);

  // --- BACK ARM (behind torso) ---
  drawBackArm(pen, g, { x:cx-F*shoulderW*0.42+lean, y:shoulderY+s*0.04 }, task, s, F, cloth, skin, cw);

  // --- TORSO tunic (blocky trapezoid sheared by lean) ---
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hipW/2+lean*0.5, hipY+s*0.02);
    g.lineTo(cx-hipW/2+lean*0.5, hipY+s*0.02);
    g.closePath();
  }, cloth, cw);
  // belt seam
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.42+lean*0.7, shoulderY+s*0.16); g.lineTo(cx+shoulderW*0.42+lean*0.7, shoulderY+s*0.16); }, cw*0.7);

  // --- NECK + HEAD ---
  pen.limb(()=>{ g.moveTo(cx+lean, shoulderY+s*0.005); g.lineTo(hx, headCy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, headCy, headR, 0,7); }, skin, cw);
  // hair cap
  pen.paint(()=>{ g.arc(hx, headCy-headR*0.05, headR*1.04, Math.PI*1.02, Math.PI*1.98); }, hair, cw*0.8);

  // --- FRONT ARM + PROP (the visible labour) ---
  drawTask(pen, g, { cx, shoulderY, shoulderW, hipY, footY, s, F, lean, prop, skin, cloth, hair, cw, opt, task });
}

/* back arm as a single two-point limb reaching toward the task target */
function drawBackArm(pen,g,sh,task,s,F,cloth,skin,cw){
  let d = { x:F*0.2, y:0.95 };
  if (task==="heave") d = { x:F*0.5, y:-0.2 };     // gripping the hawser ahead
  else if (task==="rig") d = { x:-F*0.35, y:-0.9 };// up the halyard
  else if (task==="carry") d = { x:-F*0.15, y:0.95 };
  else if (task==="inspect") d = { x:-F*0.3, y:0.9 };
  const n = Math.hypot(d.x,d.y)||1; d = { x:d.x/n, y:d.y/n };
  const L = s*0.26;
  const wr = { x:sh.x+d.x*L, y:sh.y+d.y*L };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(wr.x,wr.y); }, cloth, s*0.05);
  pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.026,0,7); }, skin, cw*0.7);
}

function drawTask(pen,g,C){
  const { cx,shoulderY,shoulderW,hipY,footY,s,F,lean,prop,skin,cloth,hair,cw,opt,task } = C;
  const sh = { x:cx+F*shoulderW*0.40+lean, y:shoulderY+s*0.04 };

  if (task==="heave"){
    // both hands out on the launch hawser, hauling low and back
    const grip = { x:cx+F*s*0.30, y:shoulderY+s*0.10 };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.18+lean, shoulderY+s*0.06); g.lineTo(grip.x,grip.y); }, cloth, s*0.052);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.032,0,7); }, skin, cw*0.7);
  }

  else if (task==="rig"){
    // both hands high on the halyard running up to the mast head
    const mast = opt.mast;
    const grip = { x:cx+F*s*0.10+lean*0.5, y:shoulderY-s*0.22 };
    if (mast) pen.ink(()=>{ g.moveTo(mast.x, mast.topY); g.lineTo(grip.x, grip.y); g.lineTo(grip.x-F*s*0.05, hipY-s*0.02); }, cw*0.8);
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.14+lean, shoulderY-s*0.02); g.lineTo(grip.x,grip.y); }, cloth, s*0.052);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.03,0,7); }, skin, cw*0.7);
  }

  else if (task==="carry"){
    // an amphora of stores shouldered; near arm braced up under it
    const jx = cx+F*s*0.14, jy = shoulderY-s*0.02;
    const wr = { x:jx, y:jy+s*0.07 };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.13, shoulderY+s*0.03); g.lineTo(wr.x,wr.y); }, cloth, s*0.052);
    pen.paint(()=>{ g.ellipse(jx, jy-s*0.05, s*0.095, s*0.14, 0,0,7); }, prop, cw);            // belly
    pen.paint(()=>{ g.rect(jx-s*0.028, jy-s*0.26, s*0.056, s*0.11); }, toneSolid(inkLevel(5)), cw); // neck
    pen.paint(()=>{ g.ellipse(jx, jy-s*0.27, s*0.05, s*0.028, 0,0,7); }, prop, cw);            // mouth
    pen.seam(()=>{ g.moveTo(jx-s*0.085,jy-s*0.15); g.quadraticCurveTo(jx-s*0.13,jy-s*0.22,jx-s*0.035,jy-s*0.24); }, cw*0.7); // handle
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skin, cw*0.7);
  }

  else if (task==="inspect"){
    // upright, a staff planted; near arm raised to point along the hull
    const staffX = cx + F*s*0.18;
    pen.ink(()=>{ g.moveTo(staffX, shoulderY-s*0.10); g.lineTo(staffX-F*s*0.02, footY+s*0.02); }, cw*1.1);
    const wr = { x:cx+F*s*0.24, y:shoulderY-s*0.06 };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.16, shoulderY-s*0.04); g.lineTo(wr.x,wr.y); }, cloth, s*0.05);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skin, cw*0.7);
  }
}

/* ============================================================
   HULL — the beached fast ship the gang works around (drawn behind them).
   ============================================================ */
function drawHull(pen, g, W, H){
  const hl = params.hull;
  const px = hl.prowX*W, sx = hl.sternX*W, midX = 0.5*W;
  const prowTop = 0.37*H, sternTop = 0.40*H;
  const sheerMid = 0.505*H, keelMid = 0.635*H, endBot = 0.555*H;

  // rollers under the keel (launch-ways)
  for(let i=0;i<5;i++){
    const rx = lerp(px+W*0.06, sx-W*0.06, i/4);
    pen.paint(()=>{ g.ellipse(rx, keelMid+H*0.012, W*0.028, H*0.012, 0,0,7); }, toneSolid(inkLevel(6)), 3);
  }

  // hull body (broadside crescent), mid tone
  pen.paint(()=>{
    g.moveTo(px, prowTop);
    g.quadraticCurveTo(midX, sheerMid, sx, sternTop);                       // sheer / gunwale (sags amidships)
    g.quadraticCurveTo(sx+W*0.02, (sternTop+endBot)/2, sx-W*0.03, endBot);  // stern post
    g.quadraticCurveTo(midX, keelMid+H*0.02, px+W*0.03, endBot);            // keel (belly down)
    g.quadraticCurveTo(px-W*0.02, (prowTop+endBot)/2, px, prowTop);         // prow post
    g.closePath();
  }, toneSolid(inkLevel(3)), 5);

  // planking seams following the sheer
  for(let k=1;k<=3;k++){
    const dy = k*H*0.026;
    pen.seam(()=>{ g.moveTo(px+W*0.02, prowTop+dy); g.quadraticCurveTo(midX, sheerMid+dy, sx-W*0.02, sternTop+dy); }, 3);
  }
  // a wale / gunwale rail (darker top strake)
  pen.ink(()=>{ g.moveTo(px, prowTop); g.quadraticCurveTo(midX, sheerMid, sx, sternTop); }, 5);

  // oar-ports / shield row just under the rail
  g.fillStyle = inkLevel(7);
  for(let i=0;i<11;i++){
    const t = (i+0.5)/11;
    const ox = lerp(px+W*0.05, sx-W*0.05, t);
    const oy = lerp(prowTop, sternTop, t) + H*0.020 + Math.sin(t*Math.PI)*H*0.028;
    g.beginPath(); g.arc(ox, oy, W*0.006, 0,7); g.fill();
  }

  // prow curled stempost (the swift Phaeacian ship's beak)
  pen.paint(()=>{
    g.moveTo(px, prowTop);
    g.quadraticCurveTo(px-W*0.05, prowTop-H*0.06, px+W*0.005, prowTop-H*0.085);
    g.quadraticCurveTo(px+W*0.045, prowTop-H*0.10, px+W*0.03, prowTop-H*0.055);
    g.quadraticCurveTo(px+W*0.02, prowTop-H*0.03, px+W*0.03, prowTop);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
  // sternpost tip
  pen.paint(()=>{ g.moveTo(sx, sternTop); g.quadraticCurveTo(sx+W*0.03, sternTop-H*0.05, sx-W*0.005, sternTop-H*0.07);
    g.quadraticCurveTo(sx-W*0.02, sternTop-H*0.02, sx-W*0.02, sternTop); g.closePath(); }, toneSolid(inkLevel(6)), 4);

  // MAST + yard + stays
  const mastX = hl.mastX*W, mastTopY = hl.mastTopY*H, deckY = sheerMid;
  pen.paint(()=>{ g.rect(mastX-W*0.009, mastTopY, W*0.018, deckY-mastTopY); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.rect(mastX-W*0.17, mastTopY+H*0.03, W*0.34, H*0.013); }, toneSolid(inkLevel(6)), 4);      // yard
  pen.paint(()=>{ g.rect(mastX-W*0.020, mastTopY-H*0.008, W*0.040, H*0.024); }, toneSolid(inkLevel(7)), 4);   // masthead
  pen.ink(()=>{ g.moveTo(mastX, mastTopY+H*0.01); g.lineTo(px+W*0.02, prowTop); }, 3);                        // forestay
  pen.ink(()=>{ g.moveTo(mastX, mastTopY+H*0.01); g.lineTo(sx-W*0.02, sternTop); }, 3);                       // backstay
  return { mast:{ x:mastX, topY:mastTopY+H*0.01 }, prow:{ x:px, y:prowTop } };
}

/* ============================================================
   STAGE — strand + hull, the launch hawser, the gang, back-rank crowd.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const strand    = (st.strandLevel ?? params.strandLevel) * H;
  const attention = st.attention ?? params.attention;
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const heave     = st.heave ?? params.heave;
  const formation = st.formation || params.formation;
  const roster0   = FORMATIONS[formation] || FORMATIONS["full-launch"];

  // ---- SKY (lightest) ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,strand);

  // ---- faint back-rank of the wider company (implies the full fifty-two) ----
  const crowdN = st.crowd ?? params.crowd;
  for(let i=0;i<crowdN;i++){
    const t = (i+0.5)/crowdN;
    const cx = lerp(W*0.06, W*0.94, t) + (i%2? W*0.01 : -W*0.01);
    const cy = strand - H*0.075 - Math.abs(Math.sin(t*7))*H*0.015;
    const r  = W*0.016;
    g.fillStyle = inkLevel(3);
    g.beginPath(); g.arc(cx, cy, r, 0,7); g.fill();                       // head
    g.beginPath(); g.moveTo(cx-r*1.6, cy+r*3.2); g.quadraticCurveTo(cx, cy+r*0.6, cx+r*1.6, cy+r*3.2); g.closePath(); g.fill(); // shoulders
  }

  // ---- STRAND (mid tone) with a launch furrow toward the sea ----
  g.fillStyle = inkLevel(2); g.fillRect(0,strand,W,H-strand);
  g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.28;
  for(let j=1;j<=4;j++){
    const y = strand + (H-strand)*(j/5);
    g.beginPath();
    for(let x=0;x<=W;x+=W*0.04){ const yy=y+Math.sin(x*0.045+j)*2.5; if(x===0) g.moveTo(x,yy); else g.lineTo(x,yy); }
    g.stroke();
  }
  g.globalAlpha = 1;

  // ---- HULL + mast (behind the crew) ----
  const rig = drawHull(pen, g, W, H);

  // ---- the launch HAWSER: from the prow down across the foreground ----
  pen.ink(()=>{ g.moveTo(rig.prow.x, rig.prow.y); g.lineTo(W*0.10, BAND_Y[2]*H - 0.03*H); g.lineTo(W*0.90, BAND_Y[2]*H - 0.02*H); }, 3.5);

  // ---- members, drawn far band -> near band (painter's order) ----
  const roster = roster0
    .map((m,i)=>({ m, i }))
    .filter(({m})=> density>=1 ? true : m.band >= Math.round((1-density)*(params.bands-1)))
    .sort((a,b)=> a.m.band - b.m.band);

  roster.forEach(({m})=>{
    const footY = BAND_Y[m.band]*H;
    const s     = BAND_S[m.band];
    const lvl   = BAND_LVL[m.band];
    const nx = 0.5 + (m.x-0.5)*spread;
    const cx = clamp(nx,0.05,0.95)*W;
    // attention: turn head toward the mast head (bounded)
    const headDX = clamp((rig.mast.x-cx)*0.12*attention, -s*0.10, s*0.10);
    // reaction-wave: a heave pulse sweeping across the gang by x
    const local = clamp01(1 - Math.abs(heave - m.x)*4);
    worker(pen, g, cx, footY, s, m.task, lvl, m, { headDX, heave: local, mast:rig.mast, prow:rig.prow });
  });
}

export const asset = {
  id:"ensemble.phaeacian-sailors",
  type:"ENSEMBLE",
  name:"Phaeacian sailors",
  statusWord:"CREWED",
  scene:"OD-B08-S01",

  params,
  // ONE worker template + task rig, instanced across depth bands around a hull
  member:{ template:"worker", tasks:TASKS, formations:Object.keys(FORMATIONS) },
  // far -> near draw order
  layers:["sky","crowd","strand","hull","mast","hawser","band-far","band-mid","band-near"],
  // normalized placement / rigging / camera anchors (NOT baked characters)
  anchors:{
    "hull:prow":{x:.13,y:.37}, "hull:stern":{x:.87,y:.40}, "hull:amidships":{x:.50,y:.55},
    "mast:head":{x:.50,y:.13}, "mast:foot":{x:.50,y:.505},
    "yard:port":{x:.33,y:.15}, "yard:starboard":{x:.67,y:.15},
    "station:hawser":{x:.30,y:.90}, "station:carry":{x:.34,y:.76}, "station:mast":{x:.50,y:.585},
    "camera:wide":{x:.50,y:.50}, "camera:hull":{x:.50,y:.52},
    "entrance:strand":{x:.06,y:.66}, "exit:seaward":{x:.06,y:.94},
  },
  // walkable strand / working ground for scene pathing/placement
  zones:{ strand:{ x0:.05,y0:.66,x1:.95,y1:.82 }, foreshore:{ x0:.05,y0:.84,x1:.95,y1:.98 } },
  states:{
    initial:"full-launch",
    nodes:{
      "full-launch":{ preview:{ formation:"full-launch", attention:0.55, spread:1.0, density:1.0, heave:0.0 } },
      "launch-line":{ preview:{ formation:"launch-line", attention:0.35, spread:1.0, density:1.0, heave:0.4 } },
      "rigging":{     preview:{ formation:"rigging",     attention:0.85, spread:1.0, density:1.0, heave:0.2 } },
      "carry":{       preview:{ formation:"carry",       attention:0.45, spread:1.0, density:1.0, heave:0.0 } },
    },
    edges:[["full-launch","launch-line"],["full-launch","rigging"],["full-launch","carry"],
           ["launch-line","rigging"],["rigging","carry"]],
  },
  channels:["formation","attention","heave","density","spread"],

  preview:()=>({ formation:"full-launch", attention:0.55, spread:1.0, density:1.0, heave:0.0, status:"CREWED", progress:.22 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
