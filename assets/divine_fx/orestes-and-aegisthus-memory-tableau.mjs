/* divine_fx.orestes-and-aegisthus-memory-tableau — the revenge PARABLE that
   haunts the Odyssey, compressed into one ghostly memory image. DIVINE_FX.
   Scene function (OD-B03-S04): three faint tableau silhouettes stacked as
   memory-cells — MURDER (Aegisthus cuts Agamemnon down at the feast), RETURN
   (Orestes comes home to the hall of the man he must repay), REPAYMENT (the
   deed given back, mirrored — Orestes' sword over a falling Aegisthus).
   Procedural: source (the remembered deed) -> field (three stacked ghost cells
   + a downward time-thread) -> transform (which cell the memory is dwelling in
   glows, driven over state.t) -> visible consequence (the moral the poem keeps
   re-lighting for Telemachus). Solid grays + hard contour only; the engine POST
   pass supplies the halftone — do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);

const params = {
  period:   6.0,     // seconds for the memory to sweep murder->return->repayment
  panelX0:  0.165,   // left edge of the tableau cells (leaves a time-thread gutter)
  panelX1:  0.950,
  regs: [            // the three stacked memory-cells, y as frac of H
    { key:"murder",    y0:0.085, y1:0.352 },
    { key:"return",    y0:0.372, y1:0.640 },
    { key:"repayment", y0:0.660, y1:0.930 },
  ],
  ghost: 0.5,        // base glow floor so every cell stays legible (ghostly, not blank)
};

/* ---- a blocky silhouette FIGURE built from round-capped limbs + a head.
   Local unit = figure height h; origin at the feet midpoint (ox, gy). dir
   flips facing. Poses: strike / fall / walk / stand. ---- */
function fig(pen, g, ox, gy, h, tone, dir, pose, lw){
  const P = (lx,ly)=>({ x: ox + lx*h*dir, y: gy - ly*h });
  let J;
  if (pose==="strike"){
    J = {
      hip:P(-.05,.46), sh:P(.12,.80), neck:P(.10,.86), head:P(.09,.965), hr:h*.105,
      hipL:P(-.11,.46), hipR:P(.03,.46),
      kneeB:P(-.11,.23), footB:P(-.22,0),
      kneeF:P(.16,.22), footF:P(.27,0),
      shA:P(.14,.80), elA:P(.05,.99), wrA:P(.15,1.13), bladeTip:P(.31,1.30),
      shB:P(.10,.80), elB:P(.25,.70), wrB:P(.37,.62),
    };
  } else if (pose==="fall"){
    J = {
      hip:P(.04,.30), sh:P(.24,.33), neck:P(.31,.27), head:P(.42,.18), hr:h*.10,
      hipL:P(.0,.30), hipR:P(.07,.30),
      kneeB:P(-.10,.19), footB:P(-.25,.05),
      kneeF:P(-.02,.14), footF:P(-.15,.005),
      shA:P(.24,.33), elA:P(.41,.31), wrA:P(.55,.25),
      shB:P(.24,.31), elB:P(.31,.17), wrB:P(.41,.07),
    };
  } else if (pose==="walk"){
    J = {
      hip:P(0,.46), sh:P(.05,.80), neck:P(.05,.86), head:P(.05,.965), hr:h*.10,
      hipL:P(-.05,.46), hipR:P(.05,.46),
      kneeB:P(-.11,.22), footB:P(-.19,.02),
      kneeF:P(.12,.24), footF:P(.21,0),
      shA:P(.06,.80), elA:P(.15,.63), wrA:P(.22,.53), staff:true,
      shB:P(.05,.80), elB:P(-.12,.62), wrB:P(-.20,.52),
    };
  } else { // stand
    J = {
      hip:P(0,.46), sh:P(0,.80), neck:P(0,.86), head:P(0,.965), hr:h*.10,
      hipL:P(-.08,.46), hipR:P(.08,.46),
      kneeB:P(-.08,.23), footB:P(-.09,0),
      kneeF:P(.08,.23), footF:P(.09,0),
      shA:P(.14,.80), elA:P(.17,.62), wrA:P(.17,.44),
      shB:P(-.14,.80), elB:P(-.17,.62), wrB:P(-.17,.44),
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
  // weapon
  if (J.bladeTip){
    pen.ink(()=>{ g.moveTo(J.wrA.x,J.wrA.y); g.lineTo(J.bladeTip.x,J.bladeTip.y); }, Math.max(3,L*0.5));
    pen.ink(()=>{ g.moveTo(J.wrA.x-L*0.7*dir, J.wrA.y-L*0.2); g.lineTo(J.wrA.x+L*0.7*dir, J.wrA.y+L*0.2); }, Math.max(2,L*0.4)); // crossguard
  }
  if (J.staff){ const sx=J.wrA.x; pen.ink(()=>{ g.moveTo(sx, gy); g.lineTo(sx, gy-h*0.98); }, Math.max(3,L*0.45)); }
}

/* ---- feast couch / table the deed is done over (murder + repayment cells) ---- */
function drawCouch(pen,g,cx,gy,w,ht){
  pen.paint(()=>{ g.rect(cx-w/2, gy-ht, w, ht*0.42); }, toneSolid(inkLevel(3)), 4);   // slab
  pen.paint(()=>{ g.rect(cx-w/2, gy-ht*0.72, w*0.10, ht*0.72); }, toneSolid(inkLevel(4)), 3); // legs
  pen.paint(()=>{ g.rect(cx+w/2-w*0.10, gy-ht*0.72, w*0.10, ht*0.72); }, toneSolid(inkLevel(4)), 3);
}

/* ---- the hall doorway Orestes comes home to (return cell) ---- */
function drawDoorway(pen,g,x,gy,w,ht){
  const x0=x-w/2, x1=x+w/2, top=gy-ht;
  g.fillStyle=inkLevel(1); g.beginPath(); g.rect(x0,top+ht*0.14,w,ht*0.86); g.fill();  // faint interior
  pen.paint(()=>{ g.rect(x0-w*0.14, top+ht*0.12, w*0.14, ht*0.88); }, toneSolid(inkLevel(4)), 4); // left jamb
  pen.paint(()=>{ g.rect(x1, top+ht*0.12, w*0.14, ht*0.88); }, toneSolid(inkLevel(4)), 4);        // right jamb
  pen.paint(()=>{ g.moveTo(x0-w*0.14, top+ht*0.14); g.lineTo(x1+w*0.14, top+ht*0.14);
    g.lineTo(x1+w*0.14, top); g.lineTo(x0-w*0.14, top); g.closePath(); }, toneSolid(inkLevel(5)), 4); // lintel
}

/* ---- one memory-cell: field, setting, figures, frame, glow ---- */
function drawRegister(pen,g,W,H,reg,idx,glow){
  const x0=W*params.panelX0, x1=W*params.panelX1, pw=x1-x0;
  const ry0=H*reg.y0, ry1=H*reg.y1, rh=ry1-ry0;
  const gy = ry1 - H*0.018;
  const h  = rh*0.66;
  const lvl = clamp(Math.round(4 + glow*2.2), 3, 7);
  const tone = toneSolid(inkLevel(lvl));
  const lw = h*0.058;

  g.save();
  g.beginPath(); g.rect(x0, ry0, pw, rh); g.clip();

  // faint ghost field inside the cell
  g.fillStyle=inkLevel(1); g.fillRect(x0, ry0, pw, rh);
  // ground line
  pen.ink(()=>{ g.moveTo(x0+pw*0.03, gy); g.lineTo(x1-pw*0.03, gy); }, 3);

  if (reg.key==="murder"){
    drawCouch(pen,g, x0+pw*0.62, gy, pw*0.30, h*0.34);
    fig(pen,g, x0+pw*0.62, gy, h,  toneSolid(inkLevel(clamp(lvl-1,3,6))), 1, "fall", lw);   // Agamemnon
    fig(pen,g, x0+pw*0.30, gy, h,  tone, 1, "strike", lw);                                   // Aegisthus
  } else if (reg.key==="return"){
    drawDoorway(pen,g, x0+pw*0.84, gy, pw*0.16, h*0.92);
    fig(pen,g, x0+pw*0.82, gy, h*0.9, toneSolid(inkLevel(clamp(lvl-1,3,6))), -1, "stand", lw*0.9); // Aegisthus at home
    fig(pen,g, x0+pw*0.40, gy, h, tone, 1, "walk", lw);                                       // Orestes returning
  } else { // repayment — the deed mirrored back
    drawCouch(pen,g, x0+pw*0.40, gy, pw*0.30, h*0.34);
    fig(pen,g, x0+pw*0.40, gy, h,  toneSolid(inkLevel(clamp(lvl-1,3,6))), -1, "fall", lw);   // Aegisthus
    fig(pen,g, x0+pw*0.70, gy, h,  tone, -1, "strike", lw);                                   // Orestes
  }
  g.restore();

  // cell frame — solid + bold when this memory is the one being dwelt in
  const active = glow > 0.85;
  g.strokeStyle=INK; g.lineWidth = active?3.5:2; g.lineCap="butt";
  if (!active){ g.globalAlpha=0.55; g.setLineDash([H*0.014, H*0.010]); }
  g.strokeRect(x0, ry0, pw, rh);
  g.setLineDash([]); g.globalAlpha=1;
}

/* ---- the time-thread down the gutter: the causal chain the poem re-lights,
   with tally marks (I / II / III) numbering the three states + a dwell dot. ---- */
function drawThread(pen,g,W,H,glow){
  const gx=W*0.092;
  const y0=H*params.regs[0].y0, y2=H*(params.regs[2].y1);
  // dashed spine
  g.strokeStyle=INK; g.lineWidth=2.5; g.globalAlpha=0.7; g.setLineDash([H*0.02,H*0.014]);
  g.beginPath(); g.moveTo(gx,y0); g.lineTo(gx,y2); g.stroke();
  g.setLineDash([]); g.globalAlpha=1;
  params.regs.forEach((reg,i)=>{
    const cy=H*(reg.y0+reg.y1)/2;
    // downward chevron between cells (causal arrow)
    if (i<2){ const ay=H*(reg.y1); g.strokeStyle=INK; g.lineWidth=3; g.beginPath();
      g.moveTo(gx-W*0.014, ay-H*0.010); g.lineTo(gx, ay+H*0.006); g.lineTo(gx+W*0.014, ay-H*0.010); g.stroke(); }
    // tally numeral I / II / III
    const n=i+1; g.strokeStyle=INK; g.lineWidth=Math.max(3, W*0.006); g.lineCap="round";
    for(let k=0;k<n;k++){ const tx=gx-(n-1)*W*0.011 + k*W*0.022;
      g.beginPath(); g.moveTo(tx, cy-H*0.020); g.lineTo(tx, cy+H*0.020); g.stroke(); }
    // dwell dot when this state is the active memory
    if (glow[i] > 0.85){ g.fillStyle=INK; g.beginPath(); g.arc(gx, cy+H*0.045, W*0.011, 0, TAU); g.fill(); }
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
    const active = Math.min(2, Math.floor(ph*3));
    glow = [0,1,2].map(i => i===active ? 1 : params.ghost);
  }

  const layers = st.layers || ["thread","murder","return","repayment"];
  const has = l => layers.includes(l);

  params.regs.forEach((reg,i)=>{ if (has(reg.key)) drawRegister(pen,g,W,H,reg,i,glow[i]); });
  if (has("thread")) drawThread(pen,g,W,H,glow);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.orestes-and-aegisthus-memory-tableau",
  type:"DIVINE_FX",
  name:"Orestes and Aegisthus memory tableau",
  statusWord:"REMEMBERED",
  scene:"OD-B03-S04",

  params,
  // back -> front; scene state may pass a subset (e.g. reveal one cell at a time)
  layers:["thread","murder","return","repayment"],
  // normalized 0..1 anchors: the three states + the actors + the time-thread
  anchors:{
    "state:murder":{x:.52,y:.219},
    "state:return":{x:.52,y:.506},
    "state:repayment":{x:.52,y:.795},
    "actor:aegisthus-strike":{x:.35,y:.30},
    "actor:agamemnon-fall":{x:.66,y:.30},
    "actor:orestes-return":{x:.45,y:.57},
    "door:hall":{x:.85,y:.55},
    "actor:aegisthus-fall":{x:.40,y:.86},
    "actor:orestes-strike":{x:.68,y:.86},
    "thread:time":{x:.09,y:.50},
    "camera:wide":{x:.50,y:.50},
  },
  // affected regions (per memory-cell) for scene placement / reveal
  zones:{
    murder:{ x0:.165,y0:.085,x1:.95,y1:.352 },
    return:{ x0:.165,y0:.372,x1:.95,y1:.640 },
    repayment:{ x0:.165,y0:.660,x1:.95,y1:.930 },
  },

  // DIVINE_FX state machine: source deed -> which memory-cell the mind dwells in
  states:{
    initial:"tableau",
    nodes:{
      // all three cells present at once — the compressed parable (neutral)
      tableau:{ preview:{ glow:[0.72,0.6,0.72], status:"REMEMBERED", progress:.5 } },
      // dwelling on the treacherous murder (early t)
      murder:{ preview:{ t:0.6, status:"MURDERED", progress:.20 } },
      // dwelling on the homecoming (mid t)
      return:{ preview:{ t:3.0, status:"RETURNING", progress:.55 } },
      // dwelling on the repayment / vengeance (late t)
      repayment:{ preview:{ t:5.4, status:"REPAID", progress:.90 } },
    },
    edges:[["tableau","murder"],["murder","return"],["return","repayment"],
           ["repayment","tableau"],["tableau","return"]],
  },
  duration:6.0,
  channels:["t","glow","reveal","emphasis"],

  preview:()=>({ t:0.6, status:"REMEMBERED", progress:.5,
                 layers:["thread","murder","return","repayment"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
