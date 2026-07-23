/* ensemble.palace-servants — busy hall attendants.
   ENSEMBLE asset. A repeatable group built from ONE separable member
   template (a servant figure + a task rig) instanced N times across depth
   bands with formation / density / attention / reaction-wave controls.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify POST pass supplies the halftone. Do NOT bake in named characters.
   Atlas OD-B01-S03 — attendants mixing wine, cleaning tables, carving meat,
   opening paths. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---- the four hall tasks the scene requires ---- */
const TASKS = ["pour-wine","clean-table","carve-meat","open-path"];

/* member roster: a separable template applied to a deterministic list.
   band 0=back(small,light) .. 2=front(large,dark). x is normalized 0..1. */
const MEMBERS = [
  { task:"open-path",   band:0, x:0.18, flip:1  },
  { task:"pour-wine",   band:0, x:0.82, flip:-1 },
  { task:"clean-table", band:1, x:0.31, flip:1  },
  { task:"carve-meat",  band:1, x:0.71, flip:-1 },
  { task:"carve-meat",  band:2, x:0.20, flip:1  },
  { task:"pour-wine",   band:2, x:0.50, flip:1  },
  { task:"clean-table", band:2, x:0.80, flip:-1 },
];

const params = {
  count: MEMBERS.length,
  bands: 3,                 // depth rows
  floorLevel: 0.44,         // horizon fraction of H
  focus: { x:0.5, y:0.40 }, // where attention turns (the high table)
  attention: 0.6,           // 0 heads-down at work .. 1 all turned to focus
  spread: 1.0,              // formation width multiplier about centre
  density: 1.0,             // 0 sparse (front band only) .. 1 full hall
};

const BAND_Y   = [0.575, 0.715, 0.905];   // footline per band
const BAND_S   = [150, 190, 258];         // member height px per band
const BAND_LVL = [3, 4, 4];               // garment ink level per band (kept mid so contour survives)

/* ============================================================
   MEMBER TEMPLATE — one servant, drawn deterministically.
   cx/footY/s in px; task selects the arm pose + prop; lvl garment tone.
   ============================================================ */
function servant(pen, g, cx, footY, s, task, lvl, m, opt){
  const cloth = toneSolid(inkLevel(lvl));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const prop  = toneSolid(inkLevel(Math.min(6, lvl+2)));
  const propMid = toneSolid(inkLevel(Math.min(5, lvl+1)));
  const cw = Math.max(3, s*0.018);   // contour weight scaled to member
  const F  = m.flip;                 // facing: +1 right, -1 left

  const hemY = footY;
  const torsoH   = s*0.54;
  const shoulderY= hemY - torsoH;
  const shoulderW= s*0.30;
  const hemW     = s*0.42;
  const headR    = s*0.135;
  const headCy   = shoulderY - headR*1.05;
  // attention: turn head toward focus; reaction-wave lifts it
  const hx = cx + (opt.headDX||0);
  const hy = headCy - (opt.headUp||0);

  // ground shadow
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, hemY+s*0.02, hemW*0.60, s*0.045, 0,0,7); g.fill();

  // --- BACK ARM (behind torso) — task-posed ---
  drawArm(pen,g,{x:cx-F*shoulderW*0.5,y:shoulderY+s*0.04}, task, s, F, lvl, "back", cloth, skin, cw);

  // --- TORSO tunic (blocky trapezoid) ---
  const lean = task==="clean-table"||task==="carve-meat" ? F*s*0.06 : 0; // bent to work
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hemW/2, hemY);
    g.lineTo(cx-hemW/2, hemY);
    g.closePath();
  }, cloth, cw);
  // belt + a vertical fold seam
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.5,shoulderY+torsoH*0.44); g.lineTo(cx+shoulderW*0.5,shoulderY+torsoH*0.44); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx, shoulderY+torsoH*0.5); g.lineTo(cx, hemY); }, cw*0.6);

  // --- NECK + HEAD ---
  pen.limb(()=>{ g.moveTo(cx+lean,shoulderY+s*0.01); g.lineTo(hx,hy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0,7); }, skin, cw);
  // hair cap over the crown, turned with the head
  pen.paint(()=>{ g.arc(hx, hy-headR*0.06, headR*1.02, Math.PI*(1.02+0.04*F), Math.PI*(1.98+0.04*F)); }, hair, cw*0.8);

  // --- FRONT ARM + PROP (the visible task) ---
  drawTask(pen,g,cx,shoulderY,shoulderW,hemY,s,task,F,lvl,prop,propMid,skin,cloth,cw,opt);
}

/* an arm as a two-segment limb reaching to a target offset from shoulder */
function drawArm(pen,g,sh,task,s,F,lvl,which,cloth,skin,cw){
  let d={x:0,y:1};   // default: hang down
  if (which==="back"){
    if (task==="clean-table"||task==="carve-meat") d={x:F*0.35,y:0.9};
    else if (task==="open-path") d={x:-F*0.25,y:0.85};
    else d={x:-F*0.15,y:1};
  }
  const n=Math.hypot(d.x,d.y)||1; d={x:d.x/n,y:d.y/n};
  const L=s*0.30;
  const wr={x:sh.x+d.x*L, y:sh.y+d.y*L};
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(wr.x,wr.y); }, cloth, s*0.055);
  pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.03,0,7); }, skin, cw*0.7);
}

function drawTask(pen,g,cx,shoulderY,shoulderW,hemY,s,task,F,lvl,prop,propMid,skin,cloth,cw,opt){
  const sh={x:cx+F*shoulderW*0.42, y:shoulderY+s*0.05};

  if (task==="pour-wine"){
    // krater bowl on a low stand, out to the front side; jug tilted pouring
    const bx=cx+F*s*0.34, by=hemY-s*0.02;
    pen.paint(()=>{ g.rect(bx-s*0.05, by-s*0.10, s*0.10, s*0.10); }, propMid, cw); // stand
    pen.paint(()=>{                                                                 // bowl
      g.moveTo(bx-s*0.13, by-s*0.10); g.lineTo(bx+s*0.13, by-s*0.10);
      g.lineTo(bx+s*0.08, by-s*0.20); g.lineTo(bx-s*0.08, by-s*0.20); g.closePath();
    }, prop, cw);
    // reaching arm to jug
    const wr={x:bx-F*s*0.02, y:by-s*0.30};
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.14,shoulderY+s*0.22); g.lineTo(wr.x,wr.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.03,0,7); }, skin, cw*0.7);
    // jug (amphora) tilted, and a wine stream
    pen.paint(()=>{ g.ellipse(wr.x+F*s*0.04, wr.y+s*0.02, s*0.05, s*0.075, F*0.5,0,7); }, propMid, cw);
    pen.ink(()=>{ g.moveTo(wr.x+F*s*0.07, wr.y+s*0.06); g.lineTo(bx-F*s*0.02, by-s*0.20); }, cw*0.7);
  }

  else if (task==="clean-table"){
    // long table in FRONT of the figure; both hands wiping with a cloth
    const tx=cx, ty=hemY-s*0.02, tw=s*0.66, th=s*0.06;
    // reaching arm onto the table top
    const wr={x:cx+F*s*0.22, y:ty-s*0.02};
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.10,shoulderY+s*0.24); g.lineTo(wr.x,wr.y); }, cloth, s*0.055);
    // table top + legs (drawn over the arm so figure reads as behind it)
    pen.paint(()=>{ g.rect(tx-tw/2, ty-th, tw, th); }, prop, cw);
    pen.paint(()=>{ g.rect(tx-tw*0.44, ty, s*0.05, s*0.16); }, propMid, cw);
    pen.paint(()=>{ g.rect(tx+tw*0.39, ty, s*0.05, s*0.16); }, propMid, cw);
    // hand + wiping cloth on the surface
    pen.paint(()=>{ g.arc(wr.x,wr.y-th*0.5,s*0.03,0,7); }, skin, cw*0.7);
    pen.paint(()=>{ g.rect(wr.x-s*0.07, ty-th-s*0.015, s*0.14, s*0.02); }, toneSolid(inkLevel(1)), cw*0.6);
  }

  else if (task==="carve-meat"){
    // carving block in front with a roast; knife-hand working over it
    const bx=cx, by=hemY-s*0.02, bw=s*0.34, bh=s*0.14;
    // roast on the block
    pen.paint(()=>{ g.ellipse(bx, by-bh-s*0.03, s*0.15, s*0.07, 0,0,7); }, propMid, cw);
    // reaching knife-arm
    const wr={x:cx+F*s*0.14, y:by-bh-s*0.06};
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.08,shoulderY+s*0.24); g.lineTo(wr.x,wr.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.03,0,7); }, skin, cw*0.7);
    // knife blade
    pen.paint(()=>{ g.moveTo(wr.x,wr.y); g.lineTo(wr.x+F*s*0.11,wr.y+s*0.02); g.lineTo(wr.x+F*s*0.11,wr.y+s*0.05); g.lineTo(wr.x,wr.y+s*0.03); g.closePath(); }, toneSolid(inkLevel(1)), cw*0.7);
    // block (foreground, dark) over the lower body
    pen.paint(()=>{ g.rect(bx-bw/2, by-bh, bw, bh); }, prop, cw);
    pen.paint(()=>{ g.rect(bx-bw*0.42, by, s*0.045, s*0.10); }, propMid, cw);
    pen.paint(()=>{ g.rect(bx+bw*0.34, by, s*0.045, s*0.10); }, propMid, cw);
  }

  else if (task==="open-path"){
    // a doorway / threshold beside, arm raised to draw the drape aside
    const dx=cx+F*s*0.30;
    pen.paint(()=>{ g.rect(dx-s*0.03, hemY-s*0.92, s*0.06, s*0.92); }, prop, cw);        // near post
    pen.paint(()=>{ g.rect(dx+F*s*0.34-s*0.03, hemY-s*0.92, s*0.06, s*0.92); }, propMid, cw); // far post
    pen.paint(()=>{ g.rect(dx-s*0.03, hemY-s*0.92, F*s*0.40, s*0.07); }, prop, cw);      // lintel
    // dark open doorway
    g.fillStyle=inkLevel(1); g.beginPath(); g.rect(Math.min(dx,dx+F*s*0.34), hemY-s*0.85, Math.abs(F*s*0.34), s*0.85); g.fill();
    // raised gesturing arm toward the door
    const wr={x:dx-F*s*0.04, y:shoulderY-s*0.10};
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.20,shoulderY-s*0.02); g.lineTo(wr.x,wr.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.03,0,7); }, skin, cw*0.7);
    // pulled-back drape fold
    pen.paint(()=>{ g.moveTo(dx,hemY-s*0.85); g.lineTo(dx+F*s*0.08,hemY-s*0.5); g.lineTo(dx,hemY-s*0.2); g.closePath(); }, propMid, cw*0.8);
  }
}

/* ============================================================
   STAGE — light hall context (back wall + floor) then N members.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const attention = st.attention ?? params.attention;
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const wave      = st.wave ?? 0;             // 0..1 reaction-wave sweep left->right
  const focusX    = (st.focus||params.focus).x * W;

  // ---- back wall (mid-light) ----
  g.fillStyle=inkLevel(2); g.fillRect(0,0,W,horizon);
  pen.paint(()=>{ g.rect(W*0.04, horizon-H*0.24, W*0.92, H*0.24); }, toneSolid(inkLevel(3)), 4);
  pen.ink(()=>{ g.moveTo(W*0.04,horizon-H*0.24); g.lineTo(W*0.96,horizon-H*0.24); }, 3);
  // faint wall pilasters for depth (kept light + to the sides)
  for(const fx of [0.14,0.86]){
    pen.paint(()=>{ g.rect(W*fx-W*0.014, horizon-H*0.24, W*0.028, H*0.24); }, toneSolid(inkLevel(3)), 3);
  }

  // ---- floor (lightest, receding) ----
  g.fillStyle=inkLevel(1); g.fillRect(0,horizon,W,H-horizon);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
  for(let i=-5;i<=5;i++){ g.beginPath(); g.moveTo(W*0.5,horizon); g.lineTo(W*0.5+i*W*0.16,H); g.stroke(); }
  for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // ---- members, drawn back band -> front band (painter's order) ----
  const roster = MEMBERS
    .map((m,i)=>({ m, i }))
    .filter(({m})=> density>=1 ? true : m.band >= Math.round((1-density)*(params.bands-1)))
    .sort((a,b)=> a.m.band - b.m.band);

  roster.forEach(({m,i})=>{
    const footY = BAND_Y[m.band]*H;
    const s     = BAND_S[m.band];
    const lvl   = BAND_LVL[m.band];
    // formation: spread members about centre by `spread`
    const nx = 0.5 + (m.x-0.5)*spread;
    const cx = clamp(nx,0.06,0.94)*W;
    // attention: turn head toward focus (bounded)
    const headDX = clamp((focusX-cx)*0.10*attention, -s*0.09, s*0.09);
    // reaction-wave: a lift that sweeps across the hall by member x
    const local = clamp(1 - Math.abs(wave - m.x)*4, 0, 1);
    const headUp = local * s*0.05 * (st.reacting?1:0.0);
    servant(pen, g, cx, footY, s, m.task, lvl, m, { headDX, headUp });
  });
}

export const asset = {
  id:"ensemble.palace-servants",
  type:"ENSEMBLE",
  name:"Palace servants",
  statusWord:"BUSY",
  scene:"OD-B01-S03",

  params,
  // one member template + task rig, instanced across depth bands
  member:{ template:"servant", tasks:TASKS, roster:MEMBERS },
  // back -> front draw order
  layers:["backwall","pilasters","floor","band-back","band-mid","band-front"],
  // normalized placement / camera / focus anchors (NOT baked characters)
  anchors:{
    "focus:high-table":{x:.50,y:.40},
    "path:door-left":{x:.18,y:.62},
    "station:wine":{x:.50,y:.86},
    "station:carving":{x:.20,y:.86},
    "station:table":{x:.80,y:.86},
    "camera:wide":{x:.50,y:.55},
    "entrance:left":{x:.06,y:.90}, "exit:right":{x:.94,y:.90},
  },
  // walkable service floor for scene pathing/placement
  zones:{ walkable:{ x0:.06,y0:.50,x1:.94,y1:.98 }, service:{ x0:.10,y0:.70,x1:.90,y1:.96 } },
  states:{
    initial:"serving",
    nodes:{
      serving:{  preview:{ attention:0.5, spread:1.0, density:1.0, reacting:false } },
      alerted:{  preview:{ attention:1.0, spread:1.0, density:1.0, reacting:true, wave:0.5 } },
      dispersing:{ preview:{ attention:0.2, spread:1.35, density:0.6, reacting:false } },
    },
    edges:[["serving","alerted"],["alerted","serving"],["serving","dispersing"]],
  },
  channels:["attention","reaction","formation","density","light"],

  preview:()=>({ attention:0.55, spread:1.0, density:1.0, reacting:false, status:"BUSY", progress:.22 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
