/* ensemble.doliuss-sons — the six sons of Dolius, the old Sicilian steward, coming
   up out of Laertes's vine rows at the end of the day's work (Book XXIV,
   OD-B24-S05): a working file with mattock, hoe, pruning hook, fork, spade and
   rake on their shoulders; the recognition running down the line when they see
   who is standing in the yard; tools going into the dirt and both arms coming
   up; and then — the same six bodies, the same six hafts — a helmeted rank with
   spears and shields, the farm family become an armed unit.

   ENSEMBLE asset. ONE separable member template (`drawSon`) instanced N times
   deterministically over a formation curve. The SHAPE of the group is the beat:
   a receding FILE for the walk in, a crescent GREET-ARC bowed around an open
   front-centre, a BROKEN RANK (two files of three, never one flat stripe) for
   the arming, a SCATTER for the fields.

   The transformation is three continuous per-member scalars — halt (walking ->
   stopped), hail (tool down, arms up) and armed (tool -> spear, straw hat ->
   helmet, free hand -> shield) — so every phase is the same body differently
   aimed. `armed` SNAPS the head-gear and the tool head at 0.5, exactly like the
   guise channel elsewhere in the atlas; everything else interpolates.

   Exposed ENSEMBLE controls: formation, density (count x density), attention
   (how hard the heads come round onto the focus), the reaction-wave pair
   (wave front + waveLag, radiating outward from the focus so whoever is nearest
   recognizes first) and foreground/background (`layer`) so a scene can split the
   family around its principals.

   NOTHING is baked into the middle. Odysseus, Laertes and Dolius are their own
   modules; this asset only ever draws the sons. The greeting ground is an open
   ANCHOR on bare paper. `showYard:false` drops the backdrop when
   `location.laertess-orchard` or `location.farmhouse-feast` is under it.

   Tonally: LIGHT planes (near-paper tunics, pale skin, pale shields) held by a
   HARD black contour. Black is spent only on hair, tool heads, hafts, helmet
   crests, belts and boots. Plenty of paper shows. */
import { makePen, toneSolid, inkLevel, INK, clamp, clamp01, lerp, smooth, rnd }
  from "../../engine/halfworld-engine.mjs";

/* the six sons — a separable roster, one template, deterministic variation.
   Same head shape and hairline on all six (they are brothers); build, head
   scale, beard and straw hat are the only signatures, plus the tool. */
const MEMBERS = [
  { tool:"mattock", hat:true,  beard:true,  build:1.06, headS:1.00 },
  { tool:"hoe",     hat:false, beard:false, build:0.95, headS:1.04 },
  { tool:"hook",    hat:false, beard:true,  build:1.02, headS:0.98 },
  { tool:"fork",    hat:true,  beard:false, build:1.00, headS:1.01 },
  { tool:"spade",   hat:false, beard:false, build:0.93, headS:1.05 },
  { tool:"rake",    hat:false, beard:true,  build:1.08, headS:0.99 },
];

export const TOOLS = MEMBERS.map(m=>m.tool);
export const FORMATIONS = ["file","greet-arc","rank","scatter"];

/* what the wave carries: the member state BEFORE the front reaches it and
   AFTER it has passed. Every phase is a pair; `a` (0..1) blends them. */
const PHASES = {
  returning:   { pre:{ halt:0.00, hail:0.00, armed:0 }, post:{ halt:0.00, hail:0.00, armed:0 } },
  recognition: { pre:{ halt:0.00, hail:0.00, armed:0 }, post:{ halt:1.00, hail:0.22, armed:0 } },
  greeting:    { pre:{ halt:0.15, hail:0.00, armed:0 }, post:{ halt:1.00, hail:1.00, armed:0 } },
  arming:      { pre:{ halt:1.00, hail:0.65, armed:0 }, post:{ halt:1.00, hail:0.00, armed:1 } },
  ranked:      { pre:{ halt:1.00, hail:0.00, armed:1 }, post:{ halt:1.00, hail:0.00, armed:1 } },
};

const params = {
  formation:"greet-arc", // file | greet-arc | rank | scatter
  phase:"greeting",      // returning | recognition | greeting | arming | ranked
  count:6,               // the six sons
  density:1.0,           // 0.34 = two of them .. 1 = the whole family
  attention:0.85,        // 0 = eyes on the work .. 1 = every head on the focus
  wave:0.62,             // reaction-wave FRONT, 0 = nothing yet .. 1 = all passed
  waveLag:0.75,          // spread of the wave across the family
  layer:"full",          // full | background | foreground (depth split for scenes)
  spread:1.0,            // the formation breathing wider / tighter
  focus:{ x:0.50, y:0.955 },  // the greeting ground — OPEN, never drawn
  showYard:true,         // orchard line + broken field wall + gate
  showFocus:true,        // the ground tick the family is aimed at
  showDropped:true,      // tools left lying where they were dropped
  centreX:0.500, centreY:0.980, radiusX:0.340, radiusY:0.395,
  seed:2405,
};

/* ============================================================
   ONE member: a son of Dolius.
   m = { cx, footY, s, F, u, feat, lvl, halt, hail, armed, turn, tool, Fh }
   Every measure keys off s, so the same template serves the 130px back of the
   file and the 235px cropped near end of the arc.
   ============================================================ */

function armTo(pen, sh, wr, tone, w, bow){
  const g = pen.ctx;
  const dx = wr.x-sh.x, dy = wr.y-sh.y, L = Math.hypot(dx,dy)||1;
  const el = { x:(sh.x+wr.x)/2 + (-dy/L)*L*bow, y:(sh.y+wr.y)/2 + (dx/L)*L*bow };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(wr.x,wr.y); }, tone, w*0.86);
  return el;
}

/* the working head of a tool, in a frame where +x runs out along the haft.
   Blocky, ~0.2s across, mid plane + hard contour: this is where the group's
   dark accents live. */
function toolHead(pen, kind, x, y, ang, s, metal, lw){
  const g = pen.ctx;
  g.save(); g.translate(x,y); g.rotate(ang);
  const U = s;
  switch(kind){
    case "mattock":
      pen.paint(()=>{ g.rect(-U*0.030, -U*0.115, U*0.055, U*0.230); }, metal, lw);
      pen.paint(()=>{ g.moveTo(U*0.025,-U*0.048); g.lineTo(U*0.150,-U*0.020);
                      g.lineTo(U*0.150, U*0.020); g.lineTo(U*0.025, U*0.048); g.closePath(); }, metal, lw);
      break;
    case "hoe":
      pen.paint(()=>{ g.moveTo(-U*0.010,-U*0.030); g.lineTo(U*0.105,-U*0.105);
                      g.lineTo(U*0.145, U*0.010); g.lineTo(U*0.020, U*0.045); g.closePath(); }, metal, lw);
      break;
    case "hook":
      pen.ink(()=>{ g.arc(U*0.020, U*0.075, U*0.098, -Math.PI*0.62, Math.PI*0.30); }, Math.max(2.4,U*0.030));
      pen.ink(()=>{ g.moveTo(U*0.100, U*0.006); g.lineTo(U*0.150,-U*0.048); }, Math.max(2.2,U*0.022));
      break;
    case "fork":
      for(const o of [-U*0.062, 0, U*0.062])
        pen.paint(()=>{ g.rect(U*0.010, o-U*0.013, U*0.150, U*0.026); }, metal, lw*0.8);
      pen.paint(()=>{ g.rect(-U*0.022,-U*0.085, U*0.036, U*0.170); }, metal, lw*0.8);
      break;
    case "spade":
      pen.paint(()=>{ g.moveTo(-U*0.005,-U*0.088); g.lineTo(U*0.130,-U*0.070);
                      g.lineTo(U*0.130, U*0.070); g.lineTo(-U*0.005, U*0.088); g.closePath(); }, metal, lw);
      break;
    default: /* rake */
      pen.paint(()=>{ g.rect(U*0.020,-U*0.115, U*0.034, U*0.230); }, metal, lw*0.8);
      for(let k=-2;k<=2;k++)
        pen.ink(()=>{ g.moveTo(U*0.052, k*U*0.052); g.lineTo(U*0.120, k*U*0.052); }, Math.max(2,U*0.018));
      break;
  }
  g.restore();
}

function spearHead(pen, x, y, s, metal, lw){
  const g = pen.ctx;
  pen.paint(()=>{ g.moveTo(x, y - s*0.095);
                  g.quadraticCurveTo(x + s*0.034, y - s*0.030, x, y + s*0.020);
                  g.quadraticCurveTo(x - s*0.034, y - s*0.030, x, y - s*0.095); g.closePath(); }, metal, lw*0.9);
}

function drawSon(pen, m){
  const g = pen.ctx, s = m.s, F = m.F;
  const lw   = Math.max(2.4, s*0.025);
  const L    = m.lvl;
  const tunic= toneSolid(inkLevel(L.tunic));
  const skin = toneSolid(inkLevel(L.skin));
  const dark = toneSolid(inkLevel(L.hair));
  const metal= toneSolid(inkLevel(L.metal));
  const boot = toneSolid(inkLevel(L.boot));
  const halt = m.halt, hail = m.hail, armed = m.armed;
  const cx   = m.cx, footY = m.footY;

  const headR  = s*0.095*m.feat.headS;
  const hipY   = footY - s*0.435;
  const shY    = hipY  - s*0.315;
  const shHalf = s*0.138*m.feat.build;
  const hipHalf= s*0.100;
  const lean   = F*s*0.032*(1-halt);

  /* ---- ground shadow (faint, never a mass) ---- */
  g.fillStyle="rgba(0,0,0,0.085)";
  g.beginPath(); g.ellipse(cx, footY+s*0.014, s*0.19, s*0.032, 0,0,7); g.fill();

  /* ---- legs: striding on the way in, planted once halted ---- */
  const stride = lerp(s*0.150, s*0.058, halt);
  const kB = { x: cx - F*stride*0.42, y: hipY + (footY-hipY)*0.50 };
  const kF = { x: cx + F*stride*0.60, y: hipY + (footY-hipY)*0.52 };
  const fB = cx - F*stride*0.78, fF = cx + F*stride;
  pen.limb(()=>{ g.moveTo(cx-hipHalf*0.46, hipY); g.lineTo(kB.x,kB.y); g.lineTo(fB, footY-s*0.022); }, skin, s*0.068);
  pen.paint(()=>{ g.ellipse(fB, footY-s*0.006, s*0.048, s*0.019, 0,0,7); }, boot, lw*0.8);
  pen.limb(()=>{ g.moveTo(cx+hipHalf*0.46, hipY); g.lineTo(kF.x,kF.y); g.lineTo(fF, footY-s*0.022); }, skin, s*0.074);
  pen.paint(()=>{ g.ellipse(fF, footY-s*0.006, s*0.054, s*0.021, 0,0,7); }, boot, lw*0.8);

  /* ---- far arm (behind the torso) ---- */
  const farSh = { x: cx - F*shHalf*0.80 + lean, y: shY + s*0.028 };
  let farWr;
  if (armed > 0.5)      farWr = { x: cx + F*s*0.140, y: hipY - s*0.095 };
  else if (hail > 0.55) farWr = { x: cx - F*s*0.190, y: shY - s*0.050*hail };
  else                  farWr = { x: cx - F*(s*0.055 + s*0.130*(1-halt)), y: hipY + s*0.030 };
  armTo(pen, farSh, farWr, skin, s*0.070, -F*0.10);

  /* ---- torso: a blocky work tunic, light plane, hard contour ---- */
  pen.paint(()=>{
    g.moveTo(cx - shHalf + lean, shY);
    g.lineTo(cx + shHalf + lean, shY);
    g.lineTo(cx + hipHalf*1.16, hipY + s*0.045);
    g.lineTo(cx - hipHalf*1.16, hipY + s*0.045);
    g.closePath();
  }, tunic, lw);
  /* belt — a short bar, deliberately shy of both edges */
  pen.paint(()=>{ g.rect(cx - hipHalf*0.80, hipY - s*0.008, hipHalf*1.60, s*0.021); }, toneSolid(inkLevel(5)), lw*0.55);
  pen.seam(()=>{ g.moveTo(cx + lean*0.4, shY + s*0.045); g.lineTo(cx + F*s*0.010, hipY - s*0.030); }, lw*0.55);

  /* ---- the tool / the spear ---- */
  const haftW = Math.max(2.4, s*0.026);
  let grip = null;
  if (armed > 0.5){
    // butted behind the leading foot, so the shield hand can come forward
    const hx = cx - F*s*0.130;
    pen.ink(()=>{ g.moveTo(hx, footY + s*0.010); g.lineTo(hx + F*s*0.030, footY - s*1.09); }, haftW*1.05);
    spearHead(pen, hx + F*s*0.031, footY - s*1.125, s, metal, lw);
    grip = { x: hx + F*s*0.019, y: shY + s*0.020 };
  } else if (hail > 0.55){
    // dropped in the dirt where he stood
    if (m.showDropped){
      const ax = cx + F*s*0.250, ay = footY + s*0.062;
      const bx = cx + F*s*0.610, by = footY + s*0.014;
      pen.ink(()=>{ g.moveTo(ax,ay); g.lineTo(bx,by); }, haftW);
      toolHead(pen, m.tool, bx, by, Math.atan2(by-ay, bx-ax), s*0.86, metal, lw*0.85);
    }
  } else if (halt > 0.5){
    // butted in the ground, head up
    const hx = cx + F*s*0.255;
    pen.ink(()=>{ g.moveTo(hx, footY + s*0.006); g.lineTo(hx - F*s*0.020, footY - s*1.02); }, haftW);
    toolHead(pen, m.tool, hx - F*s*0.021, footY - s*1.045, -Math.PI/2, s, metal, lw*0.9);
    grip = { x: hx - F*s*0.012, y: shY - s*0.010 };
  } else {
    // shouldered, head up and back — the walk in from the vine rows
    const A = { x: cx - F*s*0.215, y: shY - s*0.255 };   // head end
    const B = { x: cx + F*s*0.215, y: shY + s*0.245 };   // butt
    pen.ink(()=>{ g.moveTo(A.x,A.y); g.lineTo(B.x,B.y); }, haftW);
    toolHead(pen, m.tool, A.x, A.y, Math.atan2(A.y-B.y, A.x-B.x), s, metal, lw*0.9);
    grip = { x: lerp(A.x,B.x,0.44), y: lerp(A.y,B.y,0.44) };
  }

  /* ---- near arm ---- */
  const nearSh = { x: cx + F*shHalf*0.78 + lean, y: shY + s*0.030 };
  let nearWr;
  if (hail > 0.55 && armed <= 0.5){
    nearWr = { x: cx + F*s*0.390, y: shY - s*0.215*hail };
  } else if (grip){
    nearWr = grip;
  } else {
    nearWr = { x: cx + F*s*0.120, y: hipY + s*0.020 };
  }
  armTo(pen, nearSh, nearWr, skin, s*0.072, F*0.12);
  pen.paint(()=>{ g.arc(nearWr.x, nearWr.y, s*0.038, 0, 7); }, skin, lw*0.7);

  /* ---- neck + head ---- */
  const Fh = m.Fh;
  const hx = cx + lean*0.6 + m.turn*Fh*headR*0.36;
  const hy = shY - headR*1.02 - s*0.016;
  pen.limb(()=>{ g.moveTo(cx+lean, shY + s*0.006); g.lineTo(hx, hy + headR*0.72); }, skin, s*0.058);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0, 7); }, skin, lw);
  // the family hairline: the same cap on all six — a shallow crown, not a mask
  pen.paint(()=>{ g.arc(hx, hy - headR*0.30, headR*1.00,
                        Math.PI*(1.10 + 0.05*Fh), Math.PI*(1.90 + 0.05*Fh)); }, dark, lw*0.75);
  if (m.feat.beard){
    pen.paint(()=>{ g.moveTo(hx - headR*0.50, hy + headR*0.52);
                    g.quadraticCurveTo(hx, hy + headR*1.34, hx + headR*0.50, hy + headR*0.52);
                    g.closePath(); }, dark, lw*0.7);
  }
  // eye tick + the calling mouth
  g.fillStyle = INK;
  g.beginPath(); g.arc(hx + Fh*headR*0.36, hy - headR*0.02, Math.max(1.6, headR*0.11), 0, 7); g.fill();
  if (hail > 0.5 && armed <= 0.5){
    g.beginPath(); g.ellipse(hx + Fh*headR*0.30, hy + headR*0.46,
                             headR*0.17, headR*0.13*(0.6+0.6*hail), 0,0,7); g.fill();
  }
  // straw hat (farm) — SNAPS to a helmet at armed 0.5
  if (armed > 0.5){
    pen.paint(()=>{ g.arc(hx, hy - headR*0.10, headR*1.12, Math.PI*0.99, Math.PI*2.01); }, toneSolid(inkLevel(L.helm)), lw*0.8);
    pen.ink(()=>{ g.moveTo(hx + Fh*headR*0.06, hy - headR*0.10); g.lineTo(hx + Fh*headR*0.06, hy + headR*0.42); }, Math.max(1.8, s*0.012));
    for(let k=-2;k<=2;k++){
      const ang = Math.PI*(1.30 + k*0.085);
      pen.ink(()=>{ g.moveTo(hx + Math.cos(ang)*headR*1.10, hy - headR*0.10 + Math.sin(ang)*headR*1.10);
                    g.lineTo(hx + Math.cos(ang)*headR*1.58, hy - headR*0.10 + Math.sin(ang)*headR*1.58); },
              Math.max(1.8, s*0.014));
    }
  } else if (m.feat.hat){
    pen.paint(()=>{ g.ellipse(hx, hy - headR*0.34, headR*1.66, headR*0.34, 0,0,7); }, toneSolid(inkLevel(L.hat)), lw*0.8);
    pen.paint(()=>{ g.arc(hx, hy - headR*0.36, headR*0.86, Math.PI*1.03, Math.PI*1.97); }, toneSolid(inkLevel(L.hat)), lw*0.8);
  }

  /* ---- shield in the free hand, brought across the front, once armed ---- */
  if (armed > 0.6){
    const sx = cx + F*s*0.225, sy = hipY - s*0.085, r = s*0.150;
    pen.paint(()=>{ g.arc(sx, sy, r, 0, 7); }, toneSolid(inkLevel(L.shield)), lw*1.1);
    pen.seam(()=>{ g.arc(sx, sy, r*0.74, 0, 7); }, lw*0.6);
    pen.paint(()=>{ g.arc(sx, sy, r*0.24, 0, 7); }, dark, lw*0.7);
  }
}

/* ============================================================
   FORMATIONS — normalized 0..1 slots. Nothing spans the frame edge to edge.
   ============================================================ */
function slots(B, n, jit){
  const out = [];
  for(let i=0;i<n;i++){
    const t = n===1 ? 0.5 : i/(n-1);
    let nx, ny, F, u, sMul = 1.0;
    if (B.formation === "file"){
      nx = lerp(0.190, 0.780, t) + (jit[i]-0.5)*0.030;
      ny = lerp(0.565, 0.880, Math.pow(t,1.18)) + (jit[(i+3)%8]-0.5)*0.014;
      F  = 1;  sMul = 1.00;
      u  = 1 - t;                       // the head of the file, nearest the yard, first
    } else if (B.formation === "rank"){
      // two files with a real gap between them — never one flat stripe — and a
      // three-step depth stagger that runs differently in each file
      const half = Math.ceil(n/2);
      const grp  = i < half ? 0 : 1;
      const cnt  = grp ? n-half : half;
      const k    = grp ? i-half : i;
      const kn   = cnt > 1 ? k/(cnt-1) : 0.5;
      nx = (grp ? lerp(0.622, 0.888, kn) : lerp(0.112, 0.378, kn)) + (jit[i]-0.5)*0.016;
      ny = 0.700 + [0, 0.100, 0.168][(i + grp*2) % 3] + (jit[(i+5)%8]-0.5)*0.014;
      F  = -1; sMul = 0.78;            // six abreast: smaller bodies, or they mash
      u  = t;                           // the order runs down the line
    } else if (B.formation === "scatter"){
      nx = 0.500 + (jit[i]-0.5)*0.80;
      ny = lerp(0.570, 0.870, jit[(i+2)%8]);
      F  = jit[(i+4)%8] > 0.5 ? 1 : -1; sMul = 0.92;
      u  = 1 - clamp01(Math.abs(nx-B.focus.x)/0.45); // nearest the yard first
    } else { // greet-arc — a crescent bowed around the open front-centre
      // the sine term pushes the two far men apart so the crown of the
      // crescent never collapses into one overlapping knot
      const tt = clamp01(t - 0.095*Math.sin(Math.PI*2*t));
      const a = lerp(-Math.PI*0.905, -Math.PI*0.095, tt);
      nx = B.centreX + Math.cos(a)*B.radiusX*B.spread + (jit[i]-0.5)*0.026;
      ny = B.centreY + Math.sin(a)*B.radiusY + (jit[(i+4)%8]-0.5)*0.024;
      F  = nx < B.focus.x ? 1 : -1; sMul = 1.00;
      // the two ends stand nearest the open yard: they know first, and the
      // recognition runs UP both horns of the crescent to the men still
      // walking. The +t bias makes the far horn lag, so the crescent never
      // resolves into a mirrored heraldic pair.
      u  = (1 - Math.abs(2*t - 1)) + 0.30*t;
    }
    out.push({ i, nx: clamp(nx,0.165,0.835), ny: clamp(ny,0.545,0.880), F, sMul, u: clamp01(u) });
  }
  return out;
}

/* ============================================================
   THE YARD — a broken field wall, an orchard line, the gate the family
   comes through. Light, high, and cut into segments so nothing stripes.
   ============================================================ */
function drawYard(pen, g, W, H, B){
  const wallY = H*0.252;
  const pale  = toneSolid(inkLevel(1));
  const trunk = toneSolid(inkLevel(3));

  // orchard: small blocky canopies on short trunks, standing off behind the wall
  const TREES = [0.085, 0.205, 0.335, 0.590, 0.720, 0.885];
  TREES.forEach((tx, k)=>{
    const x = tx*W, base = wallY - H*0.002 - (k%2)*H*0.008;
    const cw = W*(0.030 + (k%3)*0.007), ch = H*(0.030 + (k%2)*0.008);
    pen.paint(()=>{ g.rect(x - W*0.005, base - ch*0.62, W*0.010, ch*0.66); }, trunk, 2.4);
    pen.paint(()=>{ g.ellipse(x, base - ch*1.02, cw, ch*0.66, 0,0,7); }, pale, 3);
    pen.paint(()=>{ g.ellipse(x - cw*0.60, base - ch*0.72, cw*0.52, ch*0.40, 0,0,7); }, pale, 2.6);
    pen.paint(()=>{ g.ellipse(x + cw*0.62, base - ch*0.76, cw*0.48, ch*0.38, 0,0,7); }, pale, 2.6);
  });

  // the field wall — four low segments with real gaps in them
  const SEGS = [[0.055,0.230],[0.295,0.440],[0.560,0.700],[0.775,0.945]];
  SEGS.forEach(([a,b], k)=>{
    const y = wallY + (k%2)*H*0.005;
    pen.paint(()=>{ g.rect(a*W, y, (b-a)*W, H*0.024); }, pale, 2.4);
    for(let x=a+0.038; x<b-0.014; x+=0.046)
      pen.seam(()=>{ g.moveTo(x*W, y); g.lineTo(x*W, y + H*0.024); }, 1.6);
  });

  // the field gate the family comes up through, back left
  const gx = 0.135*W, gy = wallY + H*0.016;
  pen.paint(()=>{ g.rect(gx - W*0.048, gy - H*0.042, W*0.010, H*0.042); }, trunk, 2.6);
  pen.paint(()=>{ g.rect(gx + W*0.038, gy - H*0.042, W*0.010, H*0.042); }, trunk, 2.6);
  pen.ink(()=>{ g.moveTo(gx - W*0.048, gy - H*0.038); g.lineTo(gx + W*0.048, gy - H*0.038); }, 2.4);
  pen.ink(()=>{ g.moveTo(gx - W*0.038, gy - H*0.004); g.lineTo(gx + W*0.038, gy - H*0.030); }, 2.2);

  // vine rows: BROKEN dashes running away toward the gate, never full lines
  g.strokeStyle = INK; g.lineCap="butt"; g.globalAlpha = 0.24;
  for(let r=0;r<5;r++){
    const y = wallY + H*0.036 + r*H*0.036 + (r*r)*H*0.008;
    g.lineWidth = Math.max(1.4, 1.2 + r*0.45);
    const x0 = lerp(0.12, -0.04, r/5), x1 = lerp(0.60, 1.00, r/5);
    for(let x=x0; x<x1; x+=0.078){
      const a = clamp(x,0.03,0.96), b = clamp(x+0.040,0.03,0.96);
      if (b<=a) continue;
      g.beginPath(); g.moveTo(a*W, y); g.lineTo(b*W, y + H*0.004); g.stroke();
    }
  }
  g.globalAlpha = 1;
}

/* ============================================================
   STAGE
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = { ...params, ...st, focus: (st && st.focus) || params.focus };
  const ph = PHASES[B.phase] || PHASES.greeting;

  const R = rnd(B.seed);
  const jit = []; for(let i=0;i<8;i++) jit.push(R());

  const n = clamp(Math.round((B.count ?? 6) * clamp01(B.density ?? 1)), 1, MEMBERS.length);
  const raw = slots(B, n, jit);
  // normalize the wave order so the front of the wave always sweeps the whole
  // roster between wave 0 and wave 1, whatever the formation or the count
  const uMax = Math.max(1e-6, ...raw.map(sl=>sl.u));
  raw.forEach(sl=>{ sl.u = sl.u/uMax; });

  if (B.showYard !== false) drawYard(pen, g, W, H, B);

  const fx = B.focus.x*W, fy = B.focus.y*H;

  // the focus tick: a broken ground bracket, never a figure
  if (B.showFocus !== false){
    g.strokeStyle = INK; g.globalAlpha = 0.34; g.lineWidth = 3; g.lineCap="round";
    for(const sgn of [-1,1]){
      g.beginPath();
      g.moveTo(fx + sgn*W*0.100, fy - H*0.030); g.lineTo(fx + sgn*W*0.100, fy - H*0.006);
      g.lineTo(fx + sgn*W*0.058, fy - H*0.006); g.stroke();
    }
    g.globalAlpha = 1;
  }

  // reaction wave: the formation supplies the ORDER (slots(): u), so the news
  // always travels away from whoever stands nearest the open yard
  const built = raw.map((sl)=>{
    const u  = sl.u;
    const lag= clamp01(B.waveLag ?? 0.75);
    const a  = smooth(clamp01(((B.wave ?? 0.6)*(1+lag) - u*lag) / 0.20));
    const halt = lerp(ph.pre.halt, ph.post.halt, a);
    const hail = lerp(ph.pre.hail, ph.post.hail, a);
    const armed= lerp(ph.pre.armed, ph.post.armed, a);
    const depth= clamp01((sl.ny - 0.545)/(0.880 - 0.545));
    const s    = lerp(186, 262, depth) * (sl.sMul ?? 1);
    const near = depth > 0.5;
    const mem  = MEMBERS[sl.i % MEMBERS.length];
    const Fh   = (B.focus.x*W - sl.nx*W) >= 0 ? 1 : -1;
    return {
      cx: sl.nx*W, footY: sl.ny*H, s, F: sl.F, u, depth,
      Fh: lerp(sl.F, Fh, clamp01(B.attention ?? 0.85)*a) >= 0 ? 1 : -1,
      turn: clamp01(B.attention ?? 0.85) * (0.35 + 0.65*a),
      tool: mem.tool, feat: mem, halt, hail, armed,
      showDropped: B.showDropped !== false,
      lvl: {
        tunic: near ? (sl.i%2 ? 2 : 1) : 1,
        skin:  near ? 2 : 1,
        hair:  near ? 6 : 5,
        metal: near ? 5 : 4,
        boot:  near ? 4 : 3,
        helm:  near ? 4 : 3,
        hat:   near ? 2 : 1,
        shield:1,
      },
    };
  });

  const keep = B.layer === "background" ? built.filter(m=>m.depth <= 0.55)
             : B.layer === "foreground" ? built.filter(m=>m.depth >  0.55)
             : built;

  keep.sort((a,b)=> a.footY - b.footY).forEach(m=> drawSon(pen, m));

  // the call going up: two short arcs over each head the wave has reached
  if ((B.phase==="greeting" || B.phase==="recognition")){
    g.strokeStyle = INK; g.lineCap="round";
    keep.forEach(m=>{
      if (m.hail < 0.45) return;
      const r = m.s*0.110*m.feat.headS;
      const hxx = m.cx + m.turn*m.Fh*r*0.36, hyy = m.footY - m.s*0.44 - m.s*0.29 - r*1.02 - m.s*0.016;
      g.globalAlpha = 0.30*m.hail; g.lineWidth = Math.max(1.8, r*0.15);
      for(let q=1;q<=2;q++){
        g.beginPath(); g.arc(hxx + m.Fh*r*0.5, hyy + r*0.4, r*(1.0+0.55*q), -1.35, -0.05); g.stroke();
      }
      g.globalAlpha = 1;
    });
  }
}

export const asset = {
  id:"ensemble.doliuss-sons",
  type:"ENSEMBLE",
  name:"Dolius's sons",
  statusWord:"RETURNING",
  scene:"OD-B24-S05",

  params,
  // ONE separable member template, instanced N times over a formation curve
  member:{ template:"drawSon", roster:MEMBERS, tools:TOOLS, formations:FORMATIONS,
           scalars:["halt","hail","armed","turn"] },
  // back -> front draw order the stage honors
  layers:["orchard","field-wall","gate","vine-rows","focus-ground","back-band","mid-band","front-band","call-marks"],
  // normalized placement / camera / focus anchors — no baked figures
  anchors:{
    "entrance:field-gate":{x:.128,y:.545},
    "focus:host":{x:.50,y:.955},
    "greet:centre":{x:.50,y:.905},
    "wing:left":{x:.115,y:.885}, "wing:right":{x:.885,y:.885},
    "file:tail":{x:.155,y:.600}, "file:head":{x:.790,y:.900},
    "rank:left":{x:.265,y:.800}, "rank:right":{x:.725,y:.800},
    "threat:road":{x:.045,y:.885},
    "tools:drop-line":{x:.50,y:.930},
    "exit:farmhouse":{x:.935,y:.915},
    "camera:wide":{x:.50,y:.640},
  },
  // walkable yard, the open greeting ground, and the vine rows behind
  zones:{
    walkable:{ x0:.05,y0:.56,x1:.95,y1:.94 },
    open:{     x0:.34,y0:.90,x1:.66,y1:.99 },   // the host's ground — keep it clear
    orchard:{  x0:.00,y0:.28,x1:1.0,y1:.50 },
  },
  states:{
    initial:"returning",
    nodes:{
      // up out of the vine rows in a file, tools on the shoulder
      returning:  { preview:{ formation:"file",      phase:"returning",   wave:1.0,  waveLag:0.6,  attention:0.20, status:"RETURNING" } },
      // the recognition runs down the line from the man nearest the yard
      recognition:{ preview:{ formation:"file",      phase:"recognition", wave:0.55, waveLag:0.85, attention:0.90, status:"RECOGNIZING" } },
      // tools in the dirt, both arms up, the shout going round the crescent
      greeting:   { preview:{ formation:"greet-arc", phase:"greeting",    wave:0.68, waveLag:0.75, attention:0.95, status:"GREETING" } },
      // hafts become spears, straw hats become helmets — mid-transformation
      arming:     { preview:{ formation:"greet-arc", phase:"arming",      wave:0.55, waveLag:0.80, attention:0.70, status:"ARMING" } },
      // the farm family as a unit: two files of three, spears up, facing the road
      ranked:     { preview:{ formation:"rank",      phase:"ranked",      wave:1.0,  waveLag:0.5,  attention:0.85, status:"RANKED" } },
    },
    edges:[
      ["returning","recognition"],["recognition","greeting"],["greeting","arming"],
      ["arming","ranked"],["ranked","returning"],["greeting","returning"],
    ],
  },
  channels:["formation","phase","wave","waveLag","attention","density","layer","spread","focus"],

  // neutral preview: the crescent mid-wave — the far end still walking in with
  // tools shouldered, the near end already halted with arms up. The whole
  // system legible in one frame.
  preview:()=>({ formation:"greet-arc", phase:"greeting", wave:0.45, waveLag:0.85,
                 attention:0.90, density:1.0, layer:"full", spread:1.0,
                 status:"GREETING", progress:0.46 }),

  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
