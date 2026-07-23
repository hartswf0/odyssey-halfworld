/* divine_fx.neoptolemus-at-troy-memory — a father's PROUD recollection of his
   son. DIVINE_FX. Scene function (OD-B11-S07): in the underworld Odysseus tells
   the shade of Achilles how his boy Neoptolemus shone at Troy, and the pride
   surfaces as one glowing sequential tableau — four memory-cells stacked and
   threaded by a downward time-line: COUNCIL (the young warrior stands and
   speaks first among the elders), HORSE (he waits armed inside the wooden
   horse), COMBAT (he cuts an enemy down at the walls), DEPARTURE (he sails home
   whole and unwounded, the prize untouched).

   Procedural DIVINE_FX: SOURCE (the father's remembering) -> FIELD (four faint
   stacked ghost-cells + a time-thread numbering them I..IIII) -> TRANSFORM (the
   cell the mind dwells in brightens, swept over state.t) -> visible CONSEQUENCE
   (the son's whole proud course from council to unharmed departure, re-lit for
   Achilles). Solid grays + hard contour into the offscreen ctx; the engine POST
   pass supplies the halftone — do NOT pre-dither. Cells stay ghostly (mid ink)
   so the whole reads as memory; only the active cell carries a bold frame. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);

const params = {
  period:  8.0,      // seconds to sweep council -> horse -> combat -> departure
  panelX0: 0.165,    // left edge of the cells (leaves a time-thread gutter)
  panelX1: 0.950,
  regs: [            // the four stacked memory-cells, y as frac of H
    { key:"council",   y0:0.070, y1:0.288 },
    { key:"horse",     y0:0.303, y1:0.521 },
    { key:"combat",    y0:0.536, y1:0.754 },
    { key:"departure", y0:0.769, y1:0.945 },
  ],
  ghost: 0.5,        // base glow floor so every cell stays legible (ghostly)
};

/* ---- a blocky silhouette FIGURE from round-capped limbs + a head.
   Local unit = height h; origin at the feet midpoint (ox, gy). dir flips
   facing. Poses: gesture / seated / stand / strike / fall / walk. ---- */
function fig(pen, g, ox, gy, h, tone, dir, pose, lw){
  const P = (lx,ly)=>({ x: ox + lx*h*dir, y: gy - ly*h });
  let J;
  if (pose==="gesture"){        // standing tall, near arm raised speaking
    J = {
      hip:P(0,.46), sh:P(.02,.80), neck:P(.02,.86), head:P(.03,.965), hr:h*.105,
      hipL:P(-.08,.46), kneeB:P(-.09,.23), footB:P(-.12,0),
      hipR:P(.08,.46), kneeF:P(.10,.23), footF:P(.14,0),
      shA:P(.14,.80), elA:P(.26,.99), wrA:P(.30,1.18),   // raised speaking arm
      shB:P(-.12,.80), elB:P(-.20,.64), wrB:P(-.17,.48),
    };
  } else if (pose==="seated"){  // an elder on the bench, hands at knees
    J = {
      hip:P(0,.30), sh:P(-.03,.60), neck:P(-.03,.66), head:P(-.03,.78), hr:h*.105,
      hipL:P(-.08,.30), kneeB:P(.20,.30), footB:P(.34,.02),
      hipR:P(.08,.30), kneeF:P(.26,.28), footF:P(.42,.02),
      shA:P(.06,.60), elA:P(.20,.44), wrA:P(.30,.32),
      shB:P(-.09,.60), elB:P(-.14,.44), wrB:P(.02,.32),
    };
  } else if (pose==="stand"){
    J = {
      hip:P(0,.46), sh:P(0,.80), neck:P(0,.86), head:P(0,.965), hr:h*.10,
      hipL:P(-.08,.46), kneeB:P(-.08,.23), footB:P(-.09,0),
      hipR:P(.08,.46), kneeF:P(.08,.23), footF:P(.09,0),
      shA:P(.14,.80), elA:P(.17,.62), wrA:P(.17,.44),
      shB:P(-.14,.80), elB:P(-.17,.62), wrB:P(-.17,.44),
    };
  } else if (pose==="strike"){  // raised weapon over a foe
    J = {
      hip:P(-.05,.46), sh:P(.12,.80), neck:P(.10,.86), head:P(.09,.965), hr:h*.105,
      hipL:P(-.11,.46), kneeB:P(-.11,.23), footB:P(-.22,0),
      hipR:P(.03,.46), kneeF:P(.16,.22), footF:P(.27,0),
      shA:P(.14,.80), elA:P(.05,.99), wrA:P(.15,1.13), bladeTip:P(.31,1.32),
      shB:P(.10,.80), elB:P(.25,.70), wrB:P(.37,.62), shield:true,
    };
  } else if (pose==="fall"){    // struck down
    J = {
      hip:P(.04,.28), sh:P(.24,.31), neck:P(.31,.25), head:P(.42,.16), hr:h*.10,
      hipL:P(.0,.28), kneeB:P(-.10,.17), footB:P(-.25,.05),
      hipR:P(.07,.28), kneeF:P(-.02,.12), footF:P(-.15,.005),
      shA:P(.24,.31), elA:P(.41,.29), wrA:P(.55,.23),
      shB:P(.24,.29), elB:P(.31,.15), wrB:P(.41,.06),
    };
  } else {                      // walk — departing, a spear as a staff
    J = {
      hip:P(0,.46), sh:P(.05,.80), neck:P(.05,.86), head:P(.05,.965), hr:h*.10,
      hipL:P(-.06,.46), kneeB:P(-.13,.22), footB:P(-.21,.02),
      hipR:P(.10,.46), kneeF:P(.16,.24), footF:P(.25,0),
      shA:P(.06,.80), elA:P(.16,.63), wrA:P(.23,.53), staff:true,
      shB:P(.04,.80), elB:P(-.12,.62), wrB:P(-.20,.52),
    };
  }
  const L = lw;
  // back leg + far arm (behind torso for depth)
  pen.limb(()=>{ g.moveTo(J.hipL.x,J.hipL.y); g.lineTo(J.kneeB.x,J.kneeB.y); g.lineTo(J.footB.x,J.footB.y); }, tone, L*0.92);
  pen.limb(()=>{ g.moveTo(J.shB.x,J.shB.y); g.lineTo(J.elB.x,J.elB.y); g.lineTo(J.wrB.x,J.wrB.y); }, tone, L*0.7);
  // torso
  pen.limb(()=>{ g.moveTo(J.hip.x,J.hip.y); g.lineTo(J.sh.x,J.sh.y); }, tone, L*1.55);
  // front leg
  pen.limb(()=>{ g.moveTo(J.hipR.x,J.hipR.y); g.lineTo(J.kneeF.x,J.kneeF.y); g.lineTo(J.footF.x,J.footF.y); }, tone, L*0.97);
  // neck + head
  pen.limb(()=>{ g.moveTo(J.sh.x,J.sh.y); g.lineTo(J.neck.x,J.neck.y); }, tone, L*0.7);
  pen.paint(()=>{ g.arc(J.head.x,J.head.y,J.hr,0,TAU); }, tone, 4);
  // near arm
  pen.limb(()=>{ g.moveTo(J.shA.x,J.shA.y); g.lineTo(J.elA.x,J.elA.y); g.lineTo(J.wrA.x,J.wrA.y); }, tone, L*0.76);
  // spear / weapon
  if (J.bladeTip){
    pen.ink(()=>{ g.moveTo(J.wrA.x,J.wrA.y); g.lineTo(J.bladeTip.x,J.bladeTip.y); }, Math.max(3,L*0.5));
    pen.ink(()=>{ g.moveTo(J.wrA.x-L*0.7*dir, J.wrA.y-L*0.2); g.lineTo(J.wrA.x+L*0.7*dir, J.wrA.y+L*0.2); }, Math.max(2,L*0.4));
  }
  if (J.shield){ pen.paint(()=>{ g.arc(J.wrB.x, J.wrB.y, h*0.19, 0, TAU); }, tone, Math.max(2,L*0.4)); }
  if (J.staff){ const sx=J.wrA.x; pen.ink(()=>{ g.moveTo(sx, gy+h*0.02); g.lineTo(sx, gy-h*1.14); }, Math.max(3,L*0.42)); }
}

/* ---- COUNCIL setting: a low bench / dais the elders sit on ---- */
function drawBench(pen,g,x0,x1,gy,ht){
  pen.paint(()=>{ g.rect(x0, gy-ht, x1-x0, ht*0.44); }, toneSolid(inkLevel(3)), 4);   // seat slab
  pen.paint(()=>{ g.rect(x0, gy-ht*0.66, (x1-x0)*0.07, ht*0.66); }, toneSolid(inkLevel(4)), 3);
  pen.paint(()=>{ g.rect(x1-(x1-x0)*0.07, gy-ht*0.66, (x1-x0)*0.07, ht*0.66); }, toneSolid(inkLevel(4)), 3);
}

/* ---- the WOODEN HORSE: compact planked barrel on wheels, pillar legs, arched
   neck + squared head. The son waits armed inside (a small hatch opening). ---- */
function drawHorse(pen,g,cx,gy,s,fillL){
  const cy = gy - s*1.65;
  const rx = s*1.55, ry = s*0.60;
  const body = toneSolid(inkLevel(fillL));
  const dk = toneSolid(inkLevel(clamp(fillL+1,2,7)));
  // wheels
  for(const wx of [cx-s*0.85, cx+s*0.85]){
    pen.paint(()=> g.arc(wx, gy, s*0.22, 0, TAU), toneSolid(inkLevel(clamp(fillL-1,2,6))), 2);
  }
  // four pillar legs
  for(const lx of [cx-rx*0.72, cx-rx*0.26, cx+rx*0.26, cx+rx*0.72]){
    pen.paint(()=> g.rect(lx-s*0.10, cy+ry*0.28, s*0.20, gy-(cy+ry*0.28)), body, 2);
  }
  // planked barrel body
  pen.paint(()=> g.ellipse(cx, cy, rx, ry, 0, 0, TAU), body, 2.6);
  // a couple plank seams
  g.strokeStyle=inkLevel(clamp(fillL+2,2,7)); g.lineWidth=1.2;
  for(const yk of [-0.35,0.25]){ g.beginPath();
    g.ellipse(cx, cy+ry*yk, rx*Math.sqrt(1-yk*yk*0.7), ry*0.13, 0, 0, TAU); g.stroke(); }
  // arched neck + squared head, facing right
  pen.paint(()=>{
    g.moveTo(cx+rx*0.48, cy-ry*0.2);
    g.quadraticCurveTo(cx+rx*0.95, cy-ry*0.95, cx+rx*0.98, cy-ry*1.75);
    g.lineTo(cx+rx*1.30, cy-ry*1.58);
    g.lineTo(cx+rx*1.33, cy-ry*1.26);
    g.lineTo(cx+rx*0.78, cy-ry*1.22);
    g.quadraticCurveTo(cx+rx*0.62, cy-ry*0.6, cx+rx*0.30, cy-ry*0.22);
    g.closePath();
  }, body, 2);
  // ear
  pen.paint(()=>{ g.moveTo(cx+rx*0.86, cy-ry*1.78); g.lineTo(cx+rx*0.94, cy-ry*2.02);
    g.lineTo(cx+rx*1.03, cy-ry*1.74); g.closePath(); }, body, 1.6);
  // eye
  g.fillStyle=inkLevel(1); g.beginPath();
  g.ellipse(cx+rx*1.10, cy-ry*1.48, s*0.05, s*0.045, 0, 0, TAU); g.fill();
  // dark belly-hatch (the son waits armed inside)
  g.fillStyle=inkLevel(1); g.beginPath();
  g.rect(cx-s*0.34, cy+ry*0.10, s*0.68, ry*0.7); g.fill();
  g.strokeStyle=inkLevel(clamp(fillL+2,2,7)); g.lineWidth=1.6; g.stroke();
  // a faint helmed head just visible in the hatch
  pen.paint(()=>{ g.arc(cx, cy+ry*0.42, s*0.12, 0, TAU); }, dk, 1.6);
}

/* ---- the SHIP PROW he sails home on, unharmed (departure cell) ---- */
function drawProw(pen,g,x,gy,w,ht){
  pen.paint(()=>{
    g.moveTo(x, gy);
    g.lineTo(x+w, gy);
    g.lineTo(x+w, gy-ht*0.34);
    g.quadraticCurveTo(x+w*0.44, gy-ht*0.42, x+w*0.20, gy-ht);
    g.quadraticCurveTo(x+w*0.14, gy-ht*0.44, x, gy-ht*0.26);
    g.closePath();
  }, toneSolid(inkLevel(4)), 3);
  // waterline
  pen.ink(()=>{ g.moveTo(x-w*0.1, gy); g.lineTo(x+w*1.05, gy); }, 2.4);
}

/* ---- one memory-cell: field, setting, figures, frame, glow ---- */
function drawRegister(pen,g,W,H,reg,glow){
  const x0=W*params.panelX0, x1=W*params.panelX1, pw=x1-x0;
  const ry0=H*reg.y0, ry1=H*reg.y1, rh=ry1-ry0;
  const gy = ry1 - H*0.016;
  const h  = rh*0.66;
  const lvl = clamp(Math.round(4 + glow*2.2), 3, 7);
  const tone = toneSolid(inkLevel(lvl));
  const hero = toneSolid(inkLevel(clamp(lvl,4,7)));           // the son reads a touch bolder
  const other= toneSolid(inkLevel(clamp(lvl-1,3,6)));
  const lw = h*0.058;

  g.save();
  g.beginPath(); g.rect(x0, ry0, pw, rh); g.clip();

  // faint ghost field inside the cell
  g.fillStyle=inkLevel(1); g.fillRect(x0, ry0, pw, rh);
  // ground line
  pen.ink(()=>{ g.moveTo(x0+pw*0.03, gy); g.lineTo(x1-pw*0.03, gy); }, 3);

  if (reg.key==="council"){
    // a bench with two seated elders; the young warrior stands and speaks first
    drawBench(pen,g, x0+pw*0.50, x1-pw*0.05, gy, h*0.30);
    fig(pen,g, x0+pw*0.66, gy, h*0.82, other, -1, "seated", lw*0.9);
    fig(pen,g, x0+pw*0.86, gy, h*0.82, other, -1, "seated", lw*0.9);
    fig(pen,g, x0+pw*0.24, gy, h,      hero,  1, "gesture", lw);   // Neoptolemus speaking
  } else if (reg.key==="horse"){
    drawHorse(pen,g, x0+pw*0.56, gy, h*0.30, lvl);
    fig(pen,g, x0+pw*0.18, gy, h*0.92, hero, 1, "stand", lw);       // the son, armed, beside it
  } else if (reg.key==="combat"){
    fig(pen,g, x0+pw*0.66, gy, h, other, -1, "fall",   lw);         // the foe cut down
    fig(pen,g, x0+pw*0.36, gy, h, hero,   1, "strike", lw);         // Neoptolemus striking
  } else { // departure — sails home whole, prize untouched
    drawProw(pen,g, x0+pw*0.60, gy, pw*0.36, h*0.72);
    fig(pen,g, x0+pw*0.34, gy, h, hero, 1, "walk", lw);             // unharmed, walking aboard
  }
  g.restore();

  // cell frame — bold when this memory is the one being dwelt in
  const active = glow > 0.85;
  g.strokeStyle=INK; g.lineWidth = active?3.5:2; g.lineCap="butt";
  if (!active){ g.globalAlpha=0.55; g.setLineDash([H*0.014, H*0.010]); }
  g.strokeRect(x0, ry0, pw, rh);
  g.setLineDash([]); g.globalAlpha=1;
}

/* ---- the time-thread down the gutter: the son's course, numbered I..IIII, with
   a dwell dot on the state the father's pride is resting in. ---- */
function drawThread(pen,g,W,H,glow){
  const gx=W*0.092;
  const y0=H*params.regs[0].y0, yN=H*params.regs[3].y1;
  g.strokeStyle=INK; g.lineWidth=2.5; g.globalAlpha=0.7; g.setLineDash([H*0.02,H*0.014]);
  g.beginPath(); g.moveTo(gx,y0); g.lineTo(gx,yN); g.stroke();
  g.setLineDash([]); g.globalAlpha=1;
  params.regs.forEach((reg,i)=>{
    const cy=H*(reg.y0+reg.y1)/2;
    // downward chevron between cells (the ongoing course)
    if (i<3){ const ay=H*(reg.y1); g.strokeStyle=INK; g.lineWidth=3; g.beginPath();
      g.moveTo(gx-W*0.014, ay-H*0.008); g.lineTo(gx, ay+H*0.006); g.lineTo(gx+W*0.014, ay-H*0.008); g.stroke(); }
    // tally numeral I / II / III / IIII
    const n=i+1; g.strokeStyle=INK; g.lineWidth=Math.max(3, W*0.005); g.lineCap="round";
    for(let k=0;k<n;k++){ const tx=gx-(n-1)*W*0.009 + k*W*0.018;
      g.beginPath(); g.moveTo(tx, cy-H*0.016); g.lineTo(tx, cy+H*0.016); g.stroke(); }
    // dwell dot when this state is the active memory
    if (glow[i] > 0.85){ g.fillStyle=INK; g.beginPath(); g.arc(gx, cy+H*0.040, W*0.011, 0, TAU); g.fill(); }
  });
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t || 0;

  // glow per cell: caller may pass an explicit array; else sweep over t
  let glow = st.glow;
  if (!Array.isArray(glow)){
    const ph = frac(t/params.period);
    const active = Math.min(3, Math.floor(ph*4));
    glow = [0,1,2,3].map(i => i===active ? 1 : params.ghost);
  }

  const layers = st.layers || ["thread","council","horse","combat","departure"];
  const has = l => layers.includes(l);

  params.regs.forEach((reg,i)=>{ if (has(reg.key)) drawRegister(pen,g,W,H,reg,glow[i]); });
  if (has("thread")) drawThread(pen,g,W,H,glow);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.neoptolemus-at-troy-memory",
  type:"DIVINE_FX",
  name:"Neoptolemus-at-Troy memory",
  statusWord:"PROUD",
  scene:"OD-B11-S07",

  params,
  // back -> front; scene state may pass a subset (reveal one cell at a time)
  layers:["thread","council","horse","combat","departure"],
  // normalized 0..1 anchors: the four states + actors + the time-thread
  anchors:{
    "state:council":{x:.52,y:.179},
    "state:horse":{x:.52,y:.412},
    "state:combat":{x:.52,y:.645},
    "state:departure":{x:.52,y:.857},
    "actor:neoptolemus-council":{x:.35,y:.24},
    "actor:elders":{x:.72,y:.24},
    "prop:wooden-horse":{x:.60,y:.47},
    "actor:neoptolemus-strike":{x:.42,y:.70},
    "actor:foe-fall":{x:.66,y:.70},
    "vehicle:ship-prow":{x:.68,y:.90},
    "thread:time":{x:.09,y:.50},
    "camera:wide":{x:.50,y:.50},
  },
  // affected regions (per memory-cell) for scene placement / reveal
  zones:{
    council:{ x0:.165,y0:.070,x1:.95,y1:.288 },
    horse:{ x0:.165,y0:.303,x1:.95,y1:.521 },
    combat:{ x0:.165,y0:.536,x1:.95,y1:.754 },
    departure:{ x0:.165,y0:.769,x1:.95,y1:.945 },
  },

  // DIVINE_FX state machine: source memory -> which cell of the son's course the
  // father's pride dwells in, over a duration.
  states:{
    initial:"tableau",
    nodes:{
      // all four cells present at once — the whole proud course (neutral)
      tableau:{ preview:{ glow:[0.7,0.62,0.62,0.7], status:"PROUD", progress:.5,
        layers:["thread","council","horse","combat","departure"] } },
      // dwelling on the boy speaking first in council (early t)
      council:{ preview:{ t:0.6, status:"FOREMOST", progress:.14 } },
      // dwelling on him waiting armed in the horse (mid-early t)
      horse:{ preview:{ t:2.4, status:"UNAFRAID", progress:.40 } },
      // dwelling on him cutting the enemy down (mid-late t)
      combat:{ preview:{ t:4.4, status:"UNMATCHED", progress:.66 } },
      // dwelling on his whole, unharmed departure (late t)
      departure:{ preview:{ t:6.6, status:"UNHARMED", progress:.92 } },
    },
    edges:[["tableau","council"],["council","horse"],["horse","combat"],
           ["combat","departure"],["departure","tableau"],["tableau","combat"]],
  },
  duration:8.0,
  channels:["t","glow","reveal","emphasis"],

  preview:()=>({ t:0.6, status:"PROUD", progress:.5,
                 layers:["thread","council","horse","combat","departure"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
