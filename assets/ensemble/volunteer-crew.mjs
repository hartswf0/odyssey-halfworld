/* ensemble.volunteer-crew — Telemachus's volunteer ship's company.
   ENSEMBLE asset. A repeatable crew built from ONE separable member
   template (a crewman figure + a work rig) instanced N times across depth
   bands, with FORMATION (carry-line | rowing-bank | launch), density,
   attention, and a reaction-wave ("heave" pulse) that sweeps the labour.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify POST pass supplies the halftone. Do NOT bake named characters in.
   Atlas OD-B02-S07 — coordinated carriers and rowers handling stores, mast,
   halyards, oars, cups, libations for the black ship's night launch. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* ---- the labours the launch requires ---- */
const TASKS = ["carry-store","haul-halyard","row-oar","pour-libation"];

/* ---- FORMATIONS: the same member template arranged three ways.
   Each roster entry = { task, band(0 back..2 front), x(0..1), flip(+1 R/-1 L) }. */
const FORMATIONS = {
  // the general launch: every labour at once (the reusable "hero" view)
  launch: [
    { task:"haul-halyard", band:0, x:0.36, flip: 1 },
    { task:"haul-halyard", band:0, x:0.64, flip:-1 },
    { task:"carry-store",  band:1, x:0.20, flip: 1 },
    { task:"pour-libation",band:1, x:0.72, flip:-1 },
    { task:"row-oar",      band:2, x:0.24, flip: 1 },
    { task:"row-oar",      band:2, x:0.54, flip: 1 },
    { task:"row-oar",      band:2, x:0.84, flip: 1 },
  ],
  // stores brought aboard in a diagonal bucket-line
  "carry-line": [
    { task:"carry-store", band:0, x:0.24, flip: 1 },
    { task:"carry-store", band:0, x:0.46, flip: 1 },
    { task:"carry-store", band:1, x:0.40, flip: 1 },
    { task:"carry-store", band:1, x:0.64, flip: 1 },
    { task:"carry-store", band:2, x:0.58, flip: 1 },
    { task:"carry-store", band:2, x:0.82, flip: 1 },
    { task:"pour-libation",band:2, x:0.22, flip:-1 },
  ],
  // the rowers ranged along the thwarts
  "rowing-bank": [
    { task:"row-oar", band:1, x:0.18, flip:1 },
    { task:"row-oar", band:1, x:0.41, flip:1 },
    { task:"row-oar", band:1, x:0.64, flip:1 },
    { task:"row-oar", band:1, x:0.87, flip:1 },
    { task:"row-oar", band:2, x:0.16, flip:1 },
    { task:"row-oar", band:2, x:0.39, flip:1 },
    { task:"row-oar", band:2, x:0.62, flip:1 },
    { task:"row-oar", band:2, x:0.85, flip:1 },
  ],
};

const params = {
  formation:"launch",
  bands:3,
  count: FORMATIONS.launch.length,
  waterLevel:0.62,          // horizon (deck/water line) fraction of H
  mast:{ x:0.5, topY:0.11 },// mast head as fraction of H (base sits at back band)
  attention:0.55,           // 0 heads-down at labour .. 1 turned to the mast/hail
  spread:1.0,               // formation width multiplier about centre
  density:1.0,              // 0 sparse (front band only) .. 1 full company
  heave:0.0,                // reaction-wave position 0..1 across the width
};

const BAND_Y   = [0.60, 0.745, 0.925];   // footline / thwart line per band
const BAND_S   = [150, 196, 264];        // member height px per band
const BAND_LVL = [3, 3, 4];              // tunic ink level per band (kept mid so contour + oars survive)

/* ============================================================
   MEMBER TEMPLATE — one crewman, drawn deterministically.
   cx/footY/s in px. task selects the work rig + prop; lvl tunic tone.
   opt carries {headDX, heave, mast:{x,topY,baseY}}.
   ============================================================ */
function crewman(pen, g, cx, footY, s, task, lvl, m, opt){
  const cloth = toneSolid(inkLevel(lvl));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const prop  = toneSolid(inkLevel(Math.min(7, lvl+2)));
  const propMid = toneSolid(inkLevel(Math.min(6, lvl+1)));
  const cw = Math.max(3, s*0.018);
  const F  = m.flip;

  const seated = task==="row-oar";
  const hemY = seated ? footY - s*0.18 : footY;   // rowers sit on the thwart
  const torsoH = s*0.52;
  // haulers & rowers lean back into the pull; the heave pulse deepens it
  const leanDir = (task==="haul-halyard") ? -F : (seated ? F : 0);
  const lean = leanDir * s*(0.10 + 0.06*(opt.heave||0));
  const shoulderY = hemY - torsoH;
  const shoulderW = s*0.30;
  const hemW      = seated ? s*0.40 : s*0.42;
  const headR     = s*0.135;
  const headCy    = shoulderY - headR*1.05;
  const hx = cx + lean + (opt.headDX||0);
  const hy = headCy;

  // ground shadow (carriers/pourers stand on the strand)
  if (!seated){
    g.fillStyle = "rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(cx, hemY+s*0.02, hemW*0.62, s*0.045, 0,0,7); g.fill();
  }

  // --- BACK ARM (behind torso) — task-posed ---
  drawBackArm(pen,g,{x:cx-F*shoulderW*0.5+lean, y:shoulderY+s*0.05}, task, s, F, cloth, skin, cw, opt);

  // --- TORSO tunic (blocky trapezoid, sheared by lean at the shoulders) ---
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hemW/2, hemY);
    g.lineTo(cx-hemW/2, hemY);
    g.closePath();
  }, cloth, cw);
  // belt + a vertical fold seam
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.5+lean*0.6,shoulderY+torsoH*0.46); g.lineTo(cx+shoulderW*0.5+lean*0.6,shoulderY+torsoH*0.46); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx+lean*0.5, shoulderY+torsoH*0.5); g.lineTo(cx, hemY); }, cw*0.6);

  // --- NECK + HEAD ---
  pen.limb(()=>{ g.moveTo(cx+lean,shoulderY+s*0.01); g.lineTo(hx,hy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0,7); }, skin, cw);
  // hair cap over the crown
  pen.paint(()=>{ g.arc(hx, hy-headR*0.06, headR*1.02, Math.PI*1.02, Math.PI*1.98); }, hair, cw*0.8);

  // --- FRONT ARM + PROP (the visible labour) ---
  drawTask(pen,g,{cx,shoulderY,shoulderW,hemY,footY,s,F,lean,lvl,prop,propMid,skin,cloth,hair,cw,opt,task});
}

/* back arm as a two-segment limb reaching to a task target */
function drawBackArm(pen,g,sh,task,s,F,cloth,skin,cw,opt){
  let d={x:0,y:1};
  if (task==="haul-halyard") d={x:-F*0.4,y:-0.9};        // reaching up the rope
  else if (task==="row-oar") d={x:F*0.55,y:0.55};        // out to the loom
  else if (task==="carry-store") d={x:-F*0.2,y:0.95};    // steadying at side
  else if (task==="pour-libation") d={x:-F*0.35,y:0.9};
  const n=Math.hypot(d.x,d.y)||1; d={x:d.x/n,y:d.y/n};
  const L=s*0.28;
  const wr={x:sh.x+d.x*L, y:sh.y+d.y*L};
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(wr.x,wr.y); }, cloth, s*0.052);
  pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skin, cw*0.7);
}

function drawTask(pen,g,C){
  const { cx,shoulderY,shoulderW,hemY,footY,s,F,lean,prop,propMid,skin,cloth,hair,cw,opt,task } = C;
  const sh={x:cx+F*shoulderW*0.42+lean, y:shoulderY+s*0.05};

  if (task==="haul-halyard"){
    // both hands high on a taut rope running up to the mast head
    const mast = opt.mast;
    const grip={x:cx+F*s*0.10+lean*0.5, y:shoulderY-s*0.20};
    // the halyard: from mast head down through the fists (the line they raise)
    pen.ink(()=>{ g.moveTo(mast.x, mast.topY); g.lineTo(grip.x, grip.y); g.lineTo(grip.x-F*s*0.06, hemY-s*0.05); }, cw*0.8);
    // front arm up to the grip
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.16+lean,shoulderY-s*0.02); g.lineTo(grip.x,grip.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.032,0,7); }, skin, cw*0.7);
  }

  else if (task==="carry-store"){
    // an amphora of stores shouldered; near arm braced up to steady it
    const jx=cx+F*s*0.15, jy=shoulderY-s*0.02;
    // arm up under the jar
    const wr={x:jx, y:jy+s*0.06};
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.14,shoulderY+s*0.04); g.lineTo(wr.x,wr.y); }, cloth, s*0.055);
    // amphora body + neck + handles
    pen.paint(()=>{ g.ellipse(jx, jy-s*0.06, s*0.10, s*0.15, 0,0,7); }, prop, cw);            // belly
    pen.paint(()=>{ g.rect(jx-s*0.03, jy-s*0.28, s*0.06, s*0.12); }, propMid, cw);            // neck
    pen.paint(()=>{ g.ellipse(jx, jy-s*0.30, s*0.055, s*0.03, 0,0,7); }, prop, cw);           // mouth
    pen.seam(()=>{ g.moveTo(jx-s*0.09,jy-s*0.16); g.quadraticCurveTo(jx-s*0.14,jy-s*0.24,jx-s*0.04,jy-s*0.26); }, cw*0.7); // handle
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.03,0,7); }, skin, cw*0.7);                             // steadying hand
  }

  else if (task==="row-oar"){
    // seated at the thwart; both hands on the oar loom, the shaft angling
    // out over the gunwale and down to the water
    const grip={x:cx+F*s*0.14, y:shoulderY+s*0.22};
    const bladeInboard = { x:cx-F*s*0.08, y:shoulderY+s*0.10 };
    const bladeOutboard= { x:cx+F*s*0.72, y:footY-s*0.02 };
    // thwart / bench block under the rower (kept light so the figure reads over it)
    pen.paint(()=>{ g.rect(cx-s*0.26, hemY-s*0.01, s*0.52, s*0.08); }, toneSolid(inkLevel(2)), cw);
    // the oar shaft (loom -> blade), drawn behind the arms
    pen.ink(()=>{ g.moveTo(bladeInboard.x,bladeInboard.y); g.lineTo(bladeOutboard.x,bladeOutboard.y); }, cw*1.4);
    // oar blade
    pen.paint(()=>{
      g.ellipse(bladeOutboard.x+F*s*0.06, bladeOutboard.y+s*0.04, s*0.055, s*0.11, F*0.5, 0,7);
    }, prop, cw*0.8);
    // front arm out to the loom
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(grip.x,grip.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.03,0,7); }, skin, cw*0.7);
  }

  else if (task==="pour-libation"){
    // one arm raised, a shallow cup tilted; a thin libation streams down
    const wr={x:cx+F*s*0.24, y:shoulderY-s*0.12};
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.16,shoulderY-s*0.06); g.lineTo(wr.x,wr.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.03,0,7); }, skin, cw*0.7);
    // the cup (kylix): shallow bowl on a foot, tipped to pour
    pen.paint(()=>{
      g.moveTo(wr.x-s*0.02, wr.y+s*0.01);
      g.lineTo(wr.x+F*s*0.14, wr.y-s*0.02);
      g.lineTo(wr.x+F*s*0.11, wr.y+s*0.045);
      g.lineTo(wr.x+s*0.00, wr.y+s*0.05);
      g.closePath();
    }, prop, cw*0.8);
    // the streaming libation to the ground
    pen.ink(()=>{
      g.moveTo(wr.x+F*s*0.12, wr.y+s*0.02);
      g.lineTo(wr.x+F*s*0.05, hemY-s*0.02);
    }, cw*0.6);
  }
}

/* ============================================================
   STAGE — shore/water context + the black ship's mast, then N members.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const water = (st.waterLevel ?? params.waterLevel) * H;
  const attention = st.attention ?? params.attention;
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const heave     = st.heave ?? params.heave;
  const formation = st.formation || params.formation;
  const roster0   = FORMATIONS[formation] || FORMATIONS.launch;

  const mast = { x:(params.mast.x)*W, topY:params.mast.topY*H, baseY:BAND_Y[0]*H };

  // ---- SKY / strand (lightest) ----
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,water);

  // ---- MAST + spar + rigging of the black ship (drawn behind the crew) ----
  // hull sheer line low at the back band
  pen.ink(()=>{ g.moveTo(W*0.04, mast.baseY); g.quadraticCurveTo(W*0.5, mast.baseY+H*0.02, W*0.96, mast.baseY); }, 4);
  // the mast pole
  pen.paint(()=>{ g.rect(mast.x-W*0.010, mast.topY, W*0.020, mast.baseY-mast.topY); }, toneSolid(inkLevel(6)), 4);
  // the yard (spar) crossing near the head
  pen.paint(()=>{ g.rect(mast.x-W*0.20, mast.topY+H*0.03, W*0.40, H*0.014); }, toneSolid(inkLevel(6)), 4);
  // masthead block
  pen.paint(()=>{ g.rect(mast.x-W*0.022, mast.topY-H*0.01, W*0.044, H*0.026); }, toneSolid(inkLevel(7)), 4);
  // stays running to the sheer
  pen.ink(()=>{ g.moveTo(mast.x, mast.topY+H*0.01); g.lineTo(W*0.12, mast.baseY); }, 3);
  pen.ink(()=>{ g.moveTo(mast.x, mast.topY+H*0.01); g.lineTo(W*0.88, mast.baseY); }, 3);

  // ---- WATER band (mid tone) with wave rules ----
  g.fillStyle=inkLevel(2); g.fillRect(0,water,W,H-water);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
  for(let j=1;j<=4;j++){
    const y=water+(H-water)*(j/5);
    g.beginPath();
    for(let x=0;x<=W;x+=W*0.04){ const yy=y+Math.sin(x*0.05+j)*3; if(x===0) g.moveTo(x,yy); else g.lineTo(x,yy); }
    g.stroke();
  }
  g.globalAlpha=1;

  // ---- members, drawn back band -> front band (painter's order) ----
  const roster = roster0
    .map((m,i)=>({ m, i }))
    .filter(({m})=> density>=1 ? true : m.band >= Math.round((1-density)*(params.bands-1)))
    .sort((a,b)=> a.m.band - b.m.band);

  roster.forEach(({m})=>{
    const footY = BAND_Y[m.band]*H;
    const s     = BAND_S[m.band];
    const lvl   = BAND_LVL[m.band];
    // formation: spread members about centre by `spread`
    const nx = 0.5 + (m.x-0.5)*spread;
    const cx = clamp(nx,0.06,0.94)*W;
    // attention: turn head toward the mast head (bounded)
    const headDX = clamp((mast.x-cx)*0.10*attention, -s*0.09, s*0.09);
    // reaction-wave: a "heave" pulse that sweeps across the company by x
    const local = clamp01(1 - Math.abs(heave - m.x)*4);
    crewman(pen, g, cx, footY, s, m.task, lvl, m, { headDX, heave: local, mast });
  });
}

export const asset = {
  id:"ensemble.volunteer-crew",
  type:"ENSEMBLE",
  name:"Volunteer crew",
  statusWord:"MUSTERED",
  scene:"OD-B02-S07",

  params,
  // ONE member template + work rig, instanced across depth bands
  member:{ template:"crewman", tasks:TASKS, formations:Object.keys(FORMATIONS) },
  // back -> front draw order
  layers:["sky","rigging","mast","water","band-back","band-mid","band-front"],
  // normalized placement / camera / rigging anchors (NOT baked characters)
  anchors:{
    "mast:head":{x:.50,y:.11},
    "mast:foot":{x:.50,y:.60},
    "spar:port":{x:.30,y:.14},
    "spar:starboard":{x:.70,y:.14},
    "station:carry":{x:.50,y:.745},
    "station:thwarts":{x:.50,y:.925},
    "station:libation":{x:.50,y:.745},
    "camera:wide":{x:.50,y:.52},
    "entrance:strand":{x:.06,y:.62}, "exit:seaward":{x:.94,y:.90},
  },
  // walkable strand / working deck for scene pathing/placement
  zones:{ strand:{ x0:.06,y0:.58,x1:.94,y1:.80 }, thwarts:{ x0:.08,y0:.82,x1:.92,y1:.98 } },
  states:{
    initial:"launch",
    nodes:{
      launch:{      preview:{ formation:"launch",      attention:0.55, spread:1.0, density:1.0, heave:0.0 } },
      "carry-line":{preview:{ formation:"carry-line",  attention:0.45, spread:1.0, density:1.0, heave:0.35 } },
      "rowing-bank":{preview:{ formation:"rowing-bank", attention:0.7,  spread:1.0, density:1.0, heave:0.5 } },
    },
    edges:[["launch","carry-line"],["launch","rowing-bank"],["carry-line","rowing-bank"]],
  },
  channels:["formation","attention","heave","density","spread"],

  preview:()=>({ formation:"launch", attention:0.55, spread:1.0, density:1.0, heave:0.0, status:"MUSTERED", progress:.22 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
