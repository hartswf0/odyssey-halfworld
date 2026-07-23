/* ensemble.six-seized-sailors — six oarsmen plucked from the benches.
   ENSEMBLE asset. Scene function (OD-B12-S04): SIX individual sailors are
   SNATCHED UP from active rowing positions and hang screaming in the air, each
   clamped in a MAW at the end of one of Scylla's descending necks. They flail —
   legs kicking, arms flung DOWN toward the deck they can no longer reach — and
   cry Odysseus's name as they are hoisted. Built from ONE separable member
   template (drawVictim) instanced exactly SIX times deterministically along a
   LIFTED-ARC formation. Exposes formation (lifted-arc / rank), lift height, a
   TERROR channel (wide eyes, open screaming mouths) and a FLAIL channel (limb
   splay + body tilt), plus a reaction-wave so the snatch reads as sequential.
   Neither Scylla nor Odysseus is baked as a character — the necks are
   diagrammatic tapering columns from the top edge, the deck a rail + abandoned
   oars below. Drawn in SOLID grays + hard contour; the engine dotify pass
   supplies the halftone. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"lifted-arc",  // lifted-arc | rank
  count:6,                 // fixed six-member ensemble
  arcHeight:0.72,          // how high the middle victims ride (0=flat .. 1=high)
  lift:0.9,                // collective hoist off the deck (0=at benches .. 1=aloft)
  terror:0.9,              // wide-eye / open-mouth scream intensity
  flail:0.85,              // limb splay + body-tilt thrash
  wave:1.0,                // snatch FRONT across the six (0..1)
  waveLag:0.35,            // per-member lag spread of the wave
  showNecks:true,          // the descending maw-necks (Scylla, diagrammatic)
  showDeck:true,           // the abandoned rowing deck + oars below
  showStreaks:true,        // vertical yank streaks bench -> victim
  showCry:true,            // radiating cry marks at open mouths
  deckY:0.80,              // deck rail as fraction of H
};

/* two-segment limb a -> knee/elbow -> c; the joint bows out by `bend` (px, signed) */
function seg2(pen, a, c, tone, w, bend){
  const g = pen.ctx;
  const mx=(a.x+c.x)/2, my=(a.y+c.y)/2;
  const dx=c.x-a.x, dy=c.y-a.y, len=Math.hypot(dx,dy)||1;
  const nx=-dy/len, ny=dx/len;
  const b={ x:mx+nx*bend, y:my+ny*bend };
  pen.limb(()=>{ g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(b.x,b.y); g.lineTo(c.x,c.y); }, tone, w*0.86);
  return b;
}

/* an open, clawing hand: palm blob + splayed fingers pointing (dx,dy) */
function clawHand(pen, wr, dx, dy, r){
  const g = pen.ctx;
  const len=Math.hypot(dx,dy)||1, ux=dx/len, uy=dy/len, px=-uy, py=ux;
  pen.paint(()=>{ g.arc(wr.x, wr.y, r*0.55, 0, 7); }, toneSolid(inkLevel(3)), Math.max(2,r*0.35));
  g.strokeStyle=INK; g.lineCap="round"; g.lineWidth=Math.max(2,r*0.34);
  for (let k=-2;k<=2;k++){
    const sx = wr.x + px*k*r*0.34, sy = wr.y + py*k*r*0.34;
    g.beginPath(); g.moveTo(wr.x, wr.y);
    g.lineTo(sx + ux*r*0.95, sy + uy*r*0.95); g.stroke();
  }
}

/* ============================================================
   ONE member template — a seized, screaming oarsman, hoisted aloft.
   Keyed off `s` (member height). The pose packs: tilt (body thrash lean),
   flail (limb splay + phase), terror (eye width / mouth open), reachDown
   (how far the arms grab back toward the deck), and gp (the maw grip on the
   chest). `feat` carries deterministic identity (beard / hair / head size).
   ============================================================ */
function drawVictim(pen, m){
  const g = pen.ctx, s = m.s, ph = m.phase, fl = m.flail, ter = m.terror;
  const tunic = toneSolid(inkLevel(m.shade.tunic));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const leg   = toneSolid(inkLevel(m.shade.leg));
  const dark  = toneSolid(inkLevel(m.shade.hair));

  const torsoLen = s*0.34, hipHalf = s*0.105, shoHalf = s*0.165;
  const cx=m.cx, cy=m.cy;
  const shear = m.tilt*torsoLen;              // body-thrash lean
  const hipY  = cy + torsoLen*0.5;
  const shoY  = cy - torsoLen*0.5;
  const shoCx = cx + shear;
  const hipCx = cx - shear*0.35;
  const lw    = Math.max(2, s*0.03);

  // shoulders / hips
  const shL={ x:shoCx-shoHalf*0.94, y:shoY+s*0.012 };
  const shR={ x:shoCx+shoHalf*0.94, y:shoY+s*0.012 };
  const hpL={ x:hipCx-hipHalf, y:hipY };
  const hpR={ x:hipCx+hipHalf, y:hipY };

  // ---- LEGS : kicking / bicycling in the air (flail drives asymmetry) ----
  const legLen = s*0.46, legW = Math.max(3, s*0.075);
  for (const side of [-1,1]){
    const kick = Math.sin(ph + (side>0?0:1.9)) * fl;      // -1..1
    const outX = side*(hipHalf + s*0.14 + fl*s*0.20*Math.abs(Math.cos(ph+side)));
    const foot = { x:hipCx + outX,
                   y:hipY + legLen*(0.62 - kick*0.60) };  // a leg can kick UP (negative)
    const knee = seg2(pen, side<0?hpL:hpR, foot, leg, legW, side*s*0.10*(0.6+fl*0.8));
    pen.paint(()=>{ g.ellipse(foot.x+side*s*0.02, foot.y, s*0.07, s*0.032, 0,0,7); }, toneSolid(inkLevel(6)), lw*0.7);
  }

  // ---- FAR arm (behind torso) : flung down toward the deck ----
  const nearSide = m.tilt>=0 ? 1 : -1, farSide = -nearSide;
  const armW = Math.max(3, s*0.06);
  const reachY = hipY + m.reachDown*s*0.55;
  const wristFor = side => ({
    x: shoCx + side*(shoHalf + s*0.10 + fl*s*0.14*Math.abs(Math.sin(ph+side*0.7))),
    y: reachY + fl*s*0.10*Math.sin(ph+side),
  });
  {
    const wr = wristFor(farSide);
    seg2(pen, farSide<0?shL:shR, wr, tunic, armW*0.9, farSide*s*0.12);
    clawHand(pen, wr, wr.x-shoCx, 1, s*0.075);
  }

  // ---- TORSO : oarsman's tunic, sheared by the thrash ----
  pen.paint(()=>{
    g.moveTo(hpL.x, hipY);
    g.lineTo(hpR.x, hipY);
    g.lineTo(shR.x, shoY);
    g.lineTo(shL.x, shoY);
    g.closePath();
  }, tunic, lw);
  pen.seam(()=>{ g.moveTo(shoCx, shoY+s*0.02); g.lineTo(hipCx, hipY); }, Math.max(1.6,s*0.015));

  // ---- neck + HEAD : thrown BACK, screaming upward ----
  const headR = s*0.118*m.feat.headS;
  const headCx = shoCx + m.tilt*headR*1.0;
  const headCy = shoY - headR*0.98 - s*0.02;
  pen.paint(()=>{ g.rect(shoCx-headR*0.28, shoY-headR*0.5, headR*0.56, headR*0.8); }, skin, Math.max(2,s*0.018));

  if (m.feat.hair!=="bald")
    pen.paint(()=>{ g.ellipse(headCx, headCy+headR*0.1, headR*1.12, headR*1.2, 0,0,7); }, dark, Math.max(2,s*0.026));
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0,0,7); }, skin, Math.max(2,s*0.028));

  // face : wide terror eyes + high brows + a wide screaming mouth
  const eyeY = headCy - headR*0.10;
  const eyeR = headR*0.13 + headR*0.055*ter;
  const eL = headCx - headR*0.33, eR = headCx + headR*0.33;
  for (const ex of [eL, eR]){
    g.fillStyle="#fff"; g.beginPath(); g.ellipse(ex, eyeY, eyeR*1.15, eyeR*1.22, 0,0,7); g.fill();
    g.fillStyle=INK;    g.beginPath(); g.ellipse(ex, eyeY - eyeR*0.15, eyeR*0.6, eyeR*0.7, 0,0,7); g.fill();
  }
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.15); g.lineCap="round";
  const browY = eyeY - headR*0.42 - ter*headR*0.14;
  g.beginPath(); g.moveTo(headCx-headR*0.5, browY+headR*0.12); g.lineTo(headCx-headR*0.12, browY-headR*0.04); g.stroke();
  g.beginPath(); g.moveTo(headCx+headR*0.12, browY-headR*0.04); g.lineTo(headCx+headR*0.5, browY+headR*0.12); g.stroke();
  // nose
  g.lineWidth=Math.max(2,headR*0.11);
  g.beginPath(); g.moveTo(headCx, eyeY+headR*0.14); g.lineTo(headCx+m.tilt*headR*0.3, eyeY+headR*0.42); g.stroke();
  // screaming mouth (open oval, taller with terror)
  g.fillStyle=INK; g.beginPath();
  g.ellipse(headCx, headCy+headR*0.55, headR*0.20, headR*(0.16+0.20*ter), 0,0,7); g.fill();

  // hair cap + optional beard
  if (m.feat.hair!=="bald")
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.95, headCy-headR*0.02);
      g.quadraticCurveTo(headCx, headCy-headR*1.35, headCx+headR*0.95, headCy-headR*0.02);
      g.quadraticCurveTo(headCx+headR*0.5, headCy-headR*0.5, headCx, headCy-headR*0.45);
      g.quadraticCurveTo(headCx-headR*0.5, headCy-headR*0.5, headCx-headR*0.95, headCy-headR*0.02);
    }, dark, Math.max(2,s*0.02));
  if (m.feat.beard)
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.5, headCy+headR*0.32);
      g.quadraticCurveTo(headCx, headCy+headR*1.4, headCx+headR*0.5, headCy+headR*0.32);
      g.quadraticCurveTo(headCx, headCy+headR*0.7, headCx-headR*0.5, headCy+headR*0.32);
    }, dark, Math.max(2,s*0.018));

  // ---- NEAR arm on top : also flung down toward the deck ----
  {
    const wr = wristFor(nearSide);
    seg2(pen, nearSide<0?shL:shR, wr, tunic, armW, nearSide*s*0.12);
    clawHand(pen, wr, wr.x-shoCx, 1, s*0.08);
  }

  return { head:{ x:headCx, y:headCy }, r:headR, cx:shoCx, gy:cy - torsoLen*0.28, s, feat:m.feat };
}

/* -------- ONE descending maw-neck (Scylla, diagrammatic, NOT a character) ----
   A tapering column falling from the top edge to a MAW clamped on the victim's
   chest. Suckers stipple one flank; a ring of teeth marks the grip. */
function drawNeck(pen, topX, gp, s){
  const g = pen.ctx;
  const baseW = s*0.105, tipW = s*0.03;          // thin tapering tentacle
  const wob = (gp.x-topX)*0.28;                  // sideways bow of the neck
  const midX = lerp(topX, gp.x, 0.5) + wob;
  const midY = lerp(-6, gp.y, 0.52);
  const midW = (baseW+tipW)*0.5*1.15;
  // ribbon body (light-mid tone so victims read clearly in front of it)
  pen.paint(()=>{
    g.moveTo(topX-tipW, -10);
    g.quadraticCurveTo(midX-midW, midY, gp.x-baseW, gp.y);
    g.lineTo(gp.x+baseW, gp.y);
    g.quadraticCurveTo(midX+midW, midY, topX+tipW, -10);
    g.closePath();
  }, toneSolid(inkLevel(3)), Math.max(2,s*0.022));
  // suckers stipple the near flank
  g.fillStyle=inkLevel(5);
  for (let k=0;k<6;k++){
    const t=(k+1)/7;
    const cxn=lerp(topX, gp.x, t)+wob*Math.sin(t*Math.PI);
    const yn=lerp(0, gp.y-baseW, t);
    g.beginPath(); g.arc(cxn - lerp(tipW,baseW,t)*0.4, yn, s*0.016, 0, 7); g.fill();
  }
  // the MAW : a dark clamped ellipse over the chest with teeth
  pen.paint(()=>{ g.ellipse(gp.x, gp.y, baseW*1.35, s*0.12, 0,0,7); }, toneSolid(inkLevel(6)), Math.max(3,s*0.03));
  g.strokeStyle="#fff"; g.lineWidth=Math.max(1.5,s*0.013); g.lineCap="round";
  for (let k=-3;k<=3;k++){
    const tx=gp.x+k*baseW*0.42;
    g.beginPath(); g.moveTo(tx, gp.y-s*0.095); g.lineTo(tx, gp.y+s*0.095); g.stroke();
  }
}

/* -------- the abandoned ROWING DECK below : rail + empty benches + oars ------ */
function drawDeck(pen, W, H, deckY, count){
  const g = pen.ctx;
  const y = H*deckY;
  // hull rail band
  pen.paint(()=>{ g.rect(0, y, W, H-y); }, toneSolid(inkLevel(4)), 5);
  pen.ink(()=>{ g.moveTo(0,y); g.lineTo(W,y); }, 4);
  // deck planks + empty rowing benches with abandoned oars swinging free
  g.strokeStyle=INK; g.globalAlpha=0.4; g.lineWidth=2;
  for (let k=1;k<=3;k++){ const yy=y+(H-y)*k/4; g.beginPath(); g.moveTo(0,yy); g.lineTo(W,yy); g.stroke(); }
  g.globalAlpha=1;
  for (let i=0;i<count;i++){
    const bx = lerp(W*0.12, W*0.88, count>1? i/(count-1):0.5);
    // thole-pin / empty bench block
    pen.paint(()=>{ g.rect(bx-W*0.02, y-H*0.012, W*0.04, H*0.024); }, toneSolid(inkLevel(6)), 3);
    // abandoned oar, blade dropped outboard
    g.strokeStyle=INK; g.lineCap="round"; g.lineWidth=Math.max(3,W*0.008);
    const ang = (i%2? -1:1)*0.5 + 0.2;
    g.beginPath(); g.moveTo(bx, y);
    g.lineTo(bx + Math.cos(Math.PI*0.5+ang)*W*0.10, y + Math.sin(Math.PI*0.5+ang)*H*0.06 + H*0.02);
    g.stroke();
  }
}

/* ============================================================
   build the six members along the LIFTED-ARC (deterministic).
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const n = clamp(p.count|0 || 6, 1, 8);
  const arcH = clamp01(p.arcHeight);
  const lift = clamp01(p.lift);
  const terror = clamp01(p.terror);
  const flail = clamp01(p.flail);
  const wave = clamp01(p.wave);
  const lag = clamp01(p.waveLag);
  const rank = p.formation==="rank";
  const deckY = p.deckY;

  const members=[];
  for (let i=0;i<n;i++){
    const t = n>1 ? i/(n-1) : 0.5;                 // 0..1 across the width
    const px = lerp(0.13, 0.87, t);
    const rng = rnd((i*97+31)>>>0);
    const feat = { beard: rng()<0.5, hair: rng()<0.14?"bald":"full",
                   headS: 0.92+rng()*0.2, wob: rng()<0.5?-1:1 };

    // reaction-wave : the snatch reaches members left-to-right
    const spread = 0.2 + lag*0.8;
    const a = clamp01(wave*(1+spread) - t*spread);
    const e = smooth(a);

    // lifted-arc : middle victims ride highest; each rides up by its own `a`
    const arc = rank ? 0.5 : Math.sin(clamp01(t)*Math.PI);   // 0 at ends .. 1 mid
    const restY = H*(deckY-0.06);                            // just above the bench
    const topY  = H*lerp(0.42, 0.28, arc*arcH);              // hoisted height
    const cy    = lerp(restY, topY, e*lift);

    const s = lerp(198, 226, 0.5 + (arc-0.5)*0.25) * (rank?0.96:1);
    const tilt = ((rng()-0.5)*0.5 + feat.wob*0.12) * (0.4+flail*0.9);
    const phase = rng()*Math.PI*2;

    members.push({
      cx: W*px, cy, s, t, px, depth:i/Math.max(1,n-1),
      tilt, phase, flail: flail*(0.5+0.5*e), terror: terror*e,
      reachDown: 0.35 + 0.5*e, feat,
      grip:{ x:W*px, y:cy - s*0.34*0.28 }, topX:W*lerp(0.12,0.88,t),
      benchX:W*px,
      shade:{
        tunic: 2 + (i%3), skin: 2 + (i%2),
        leg: 3 + (i%2), hair: 5 + (i%2),
      },
    });
  }
  // draw smaller/higher first so lower/nearer overlap on top
  members.sort((a,b)=> a.cy - b.cy);
  return { members, n, deckY, lift,
           showNecks:p.showNecks, showDeck:p.showDeck, showStreaks:p.showStreaks, showCry:p.showCry,
           wave, arcH };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);

  // faint sky / air rules
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.10;
  for (let k=1;k<=4;k++){ const y=H*0.10*k; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // the abandoned rowing deck below (behind everything)
  if (B.showDeck) drawDeck(pen, W, H, B.deckY, B.n);

  // vertical YANK STREAKS : empty bench -> hoisted victim (the pull off the oar)
  if (B.showStreaks){
    g.strokeStyle=ACCENT; g.lineCap="round"; g.setLineDash([H*0.014, H*0.016]);
    for (const m of B.members){
      g.globalAlpha=0.36; g.lineWidth=Math.max(2,W*0.007);
      g.beginPath(); g.moveTo(m.benchX, H*B.deckY-H*0.01); g.lineTo(m.cx, m.cy+m.s*0.30); g.stroke();
    }
    g.setLineDash([]); g.globalAlpha=1;
  }

  // descending maw-necks behind the victims
  if (B.showNecks) for (const m of B.members) drawNeck(pen, m.topX, m.grip, m.s);

  // the six victims, sorted so nearer overlap
  const heads = B.members.map(m => drawVictim(pen, m));

  // radiating CRY marks at the open mouths (calling out)
  if (B.showCry){
    g.strokeStyle=INK; g.lineCap="round";
    heads.forEach((h,i)=>{
      const m=B.members[i]; if (m.terror<0.35) return;
      g.globalAlpha=0.28*m.terror; g.lineWidth=Math.max(1.5,h.r*0.10);
      const mx=h.head.x, my=h.head.y+h.r*0.55;
      for (let k=0;k<5;k++){ const ang=-Math.PI*0.5 + (k-2)*0.42;
        g.beginPath(); g.moveTo(mx+Math.cos(ang)*h.r*0.7, my+Math.sin(ang)*h.r*0.7);
        g.lineTo(mx+Math.cos(ang)*h.r*1.35, my+Math.sin(ang)*h.r*1.35); g.stroke(); }
    });
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"ensemble.six-seized-sailors",
  type:"ENSEMBLE",
  name:"Six seized sailors",
  statusWord:"SEIZED",
  scene:"OD-B12-S04",

  params,
  // back -> front draw order the ensemble honors
  layers:["air","deck","streaks","necks","victim-back","victim-front","cry"],
  // normalized 0..1 anchors: the six maw-grips, the empty benches, the deck line
  anchors:{
    "maw:1":{x:.13,y:.34}, "maw:2":{x:.28,y:.26}, "maw:3":{x:.43,y:.22},
    "maw:4":{x:.57,y:.22}, "maw:5":{x:.72,y:.26}, "maw:6":{x:.87,y:.34},
    "bench:row":{x:.50,y:.92}, "deck:line":{x:.50,y:.92},
    "camera:wide":{x:.50,y:.52},
  },
  zones:{ air:{ x0:.06,y0:.14,x1:.94,y1:.72 }, deck:{ x0:.00,y0:.90,x1:1.0,y1:1.0 } },
  states:{
    initial:"seized",
    nodes:{
      // all six aloft, thrashing, screaming — the frozen horror tableau
      seized:   { preview:{ lift:0.9, arcHeight:0.72, terror:0.95, flail:0.85, wave:1.0, waveLag:0.35, status:"SEIZED" } },
      // the snatch mid-sweep: some still rising off the benches
      snatching:{ preview:{ lift:0.7, arcHeight:0.6, terror:0.8, flail:0.7, wave:0.5, waveLag:0.85, status:"SNATCHING" } },
      // fully hoisted, arms flung down toward the lost deck
      dangling: { preview:{ lift:1.0, arcHeight:0.85, terror:0.9, flail:0.6, wave:1.0, waveLag:0.2, status:"DANGLING" } },
      // mouths wide, calling Odysseus by name
      calling:  { preview:{ lift:0.92, arcHeight:0.75, terror:1.0, flail:0.9, wave:1.0, waveLag:0.3, status:"CALLING" } },
    },
    edges:[
      ["snatching","seized"],["seized","dangling"],["seized","calling"],
      ["dangling","calling"],["calling","seized"],
    ],
  },
  channels:["terror","flail","lift","arcHeight","wave","waveLag","formation"],

  // neutral preview = the seized tableau: six aloft, thrashing, screaming
  preview:()=>({ lift:0.9, arcHeight:0.72, terror:0.95, flail:0.85, wave:1.0, waveLag:0.35,
                 formation:"lifted-arc", status:"SEIZED", progress:0.5 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
