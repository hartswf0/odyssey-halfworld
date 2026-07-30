/* ensemble.revenge-militia — the armed relatives of the dead suitors, marching
   out of the town to Laertes's farm (Book XXIV, OD-B24-S08). Eupithes has them
   in a wedge with the point aimed at the farm gate; Laertes's cast takes the
   point out from under them; the shock runs backward through the ranks, the
   spears come up off the level and the shields go over the heads; and then the
   front of the wedge collides with the farm defenders coming the other way.

   ENSEMBLE asset. ONE separable member template (`drawRelative`) instanced N
   times deterministically over a formation curve. The SHAPE of the group is the
   beat: a WEDGE with a point for the advance, a COLUMN on the road, a BROKEN
   LINE (two clumps with a real gap, never one flat stripe) for the wavering,
   and a SCATTER for the rout.

   Everything a militia does here is four continuous per-member scalars —
   drive (stride + forward lean), recoil (weight thrown back), guard (shield
   off the hip and up over the head) and flee (turned around and running) —
   plus one angle, the spear's, which is the whole plot: level and forward at
   the advance, up off the level when the point is lost, level again and
   crossed at the collision, trailing in the dirt at the rout. `flee` SNAPS
   the facing at 0.5, exactly like the guise channel elsewhere in the atlas;
   everything else interpolates.

   Exposed ENSEMBLE controls: formation, density (count x density), attention
   (how hard the heads come round onto the farm gate), the reaction-wave pair
   (wave front + waveLag, radiating BACKWARD from the point of the wedge so the
   men nearest Eupithes break first) and foreground/background (`layer`) so a
   scene can split the militia around its principals.

   NOTHING is baked into the middle. Eupithes is his own module
   (`character.eupithes`) and so are Laertes, Odysseus and Telemachus. The
   point of the wedge is an ANCHOR ("lead"); with `leaderDown >= 0.5` that slot
   is VACATED and only his kit is left lying in the dirt — a helmet on its side,
   a shield flat, a spear across the track. That hole in the formation IS
   "losing Eupithes". The farm defenders are likewise never drawn: at the
   collision only their spear shafts and shield rims come in past the right
   frame edge (`showOpposition`).

   Tonally: LIGHT planes (near-paper tunics, pale skin, pale shields) held by a
   HARD black contour. Black is spent only on hair, spear heads, hafts, helmet
   crests, belts and boots. Plenty of paper shows. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, clamp01, lerp, smooth, rnd }
  from "../../engine/halfworld-engine.mjs";

/* the roster — a separable member set, one template, deterministic variation.
   Member 0 is the LEAD (crested helmet, cloak): the slot Eupithes occupies and
   the slot that empties. The rest are townsmen who took down whatever was on
   the wall — spear, axe, boar-spear. */
const MEMBERS = [
  { gear:"crest", weapon:"spear",     shield:true,  beard:true,  build:1.08, headS:1.00, cloak:true  },
  { gear:"helm",  weapon:"spear",     shield:true,  beard:true,  build:1.02, headS:0.99, cloak:false },
  { gear:"cap",   weapon:"axe",       shield:false, beard:false, build:0.96, headS:1.04, cloak:false },
  { gear:"helm",  weapon:"boarspear", shield:true,  beard:true,  build:1.05, headS:0.98, cloak:false },
  { gear:"bare",  weapon:"spear",     shield:false, beard:false, build:0.93, headS:1.05, cloak:false },
  { gear:"cap",   weapon:"spear",     shield:true,  beard:true,  build:1.00, headS:1.00, cloak:true  },
  { gear:"helm",  weapon:"axe",       shield:false, beard:false, build:1.07, headS:0.97, cloak:false },
  { gear:"bare",  weapon:"boarspear", shield:true,  beard:true,  build:0.95, headS:1.03, cloak:false },
  { gear:"cap",   weapon:"spear",     shield:false, beard:false, build:1.01, headS:1.01, cloak:false },
  { gear:"helm",  weapon:"spear",     shield:true,  beard:true,  build:0.98, headS:1.02, cloak:false },
];

export const WEAPONS    = ["spear","axe","boarspear"];
export const FORMATIONS = ["wedge","column","broken-line","clash","rout"];

/* what the reaction wave carries: the member state BEFORE the front reaches
   him and AFTER it has passed. `deg` is the spear angle off the level,
   negative = raised. `a` (0..1) blends the pair. */
const PHASES = {
  advance: { pre:{ drive:1.00, recoil:0.00, guard:0.14, flee:0, deg:-62 },
             post:{ drive:1.00, recoil:0.00, guard:0.20, flee:0, deg:-52 } },
  "leader-down":
           { pre:{ drive:0.88, recoil:0.00, guard:0.18, flee:0, deg:-56 },
             post:{ drive:0.08, recoil:0.86, guard:0.58, flee:0, deg:-78 } },
  waver:   { pre:{ drive:0.26, recoil:0.52, guard:0.46, flee:0, deg:-72 },
             post:{ drive:0.00, recoil:0.92, guard:0.90, flee:0, deg:-96 } },
  collide: { pre:{ drive:0.92, recoil:0.04, guard:0.36, flee:0, deg:-44 },
             post:{ drive:0.50, recoil:0.54, guard:1.00, flee:0, deg:-13 } },
  rout:    { pre:{ drive:0.18, recoil:0.80, guard:0.70, flee:0, deg:-84 },
             post:{ drive:0.94, recoil:0.00, guard:0.22, flee:1, deg:132 } },
};

const params = {
  formation:"wedge",     // wedge | column | broken-line | rout
  phase:"advance",       // advance | leader-down | waver | collide | rout
  count:9,               // men on the road
  density:1.0,           // 0.33 = a knot of three .. 1 = the whole party
  attention:0.86,        // 0 = eyes anywhere .. 1 = every head onto the farm gate
  wave:0.55,             // reaction-wave FRONT, 0 = nothing yet .. 1 = all passed
  waveLag:0.74,          // spread of the wave back through the ranks
  layer:"full",          // full | background | foreground (depth split for scenes)
  spread:1.0,            // the formation breathing wider / tighter
  leaderDown:0,          // 0 = the point is held .. 1 = his kit in the dirt
  showLead:true,         // false when character.eupithes is cast on the anchor
  showKit:true,          // the dropped helmet/shield/spear at the vacated point
  showOpposition:false,  // farm defenders' shafts + shield rims past the right edge
  showRoad:true,         // town roofs, broken field wall, the track
  focus:{ x:0.965, y:0.720 },   // the farm gate — OFF frame, never drawn
  seed:2408,
};

/* ============================================================
   small shared parts
   ============================================================ */
function armTo(pen, sh, wr, tone, w, bow){
  const g = pen.ctx;
  const mx=(sh.x+wr.x)/2, my=(sh.y+wr.y)/2;
  const el={ x: mx + (wr.y-sh.y)*(bow||0), y: my - (wr.x-sh.x)*(bow||0) + w*0.55 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(wr.x,wr.y); }, tone, w*0.86);
  return el;
}

/* weapon heads — drawn at (x,y) with the haft running in direction `ang`. */
function weaponHead(pen, kind, x, y, ang, s, metal, lw){
  const g = pen.ctx;
  g.save(); g.translate(x,y); g.rotate(ang);
  if (kind === "axe"){
    // a wedge blade set to one side of the haft top
    pen.paint(()=>{ g.moveTo(s*0.010,-s*0.016); g.lineTo(s*0.086,-s*0.098);
                    g.lineTo(s*0.104,-s*0.020); g.lineTo(s*0.030, s*0.020); g.closePath(); }, metal, lw*0.9);
    pen.ink(()=>{ g.moveTo(-s*0.020,-s*0.006); g.lineTo(s*0.062, s*0.006); }, Math.max(1.8, s*0.014));
  } else {
    // leaf blade (spear + boar-spear share it)
    pen.paint(()=>{ g.moveTo(s*0.108, 0);
                    g.quadraticCurveTo(s*0.034, -s*0.036, -s*0.012, 0);
                    g.quadraticCurveTo(s*0.034,  s*0.036, s*0.108, 0); g.closePath(); }, metal, lw*0.85);
    if (kind === "boarspear")
      pen.ink(()=>{ g.moveTo(-s*0.040,-s*0.052); g.lineTo(-s*0.040, s*0.052); }, Math.max(2, s*0.016));
  }
  g.restore();
}

/* ============================================================
   ONE member template — a townsman under arms.
   Every scalar arrives packed on `m`; nothing is decided in here.
   ============================================================ */
function drawRelative(pen, m){
  const g = pen.ctx, s = m.s;
  const lw = Math.max(2.4, s*0.025);
  const L  = m.lvl;
  const tunic = toneSolid(inkLevel(L.tunic));
  const skin  = toneSolid(inkLevel(L.skin));
  const dark  = toneSolid(inkLevel(L.hair));
  const metal = toneSolid(inkLevel(L.metal));
  const boot  = toneSolid(inkLevel(L.boot));
  const bronze= toneSolid(inkLevel(L.helm));
  const face  = toneSolid(inkLevel(L.shield));

  const F = m.F;                              // body facing after the flee snap
  const drive = m.drive, recoil = m.recoil, guard = m.guard;
  const cx = m.cx, footY = m.footY;

  const headR  = s*0.094*m.feat.headS;
  const hipY   = footY - s*0.462;
  const shY    = hipY  - s*0.298;
  const shHalf = s*0.136*m.feat.build;
  const hipHalf= s*0.099;
  const lean   = F*s*(0.046*drive - 0.062*recoil);
  const tiltS  = m.tilt*s;

  /* ---- ground shadow: faint, never a mass ---- */
  g.fillStyle = "rgba(0,0,0,0.075)";
  g.beginPath(); g.ellipse(cx, footY+s*0.013, s*0.185, s*0.030, 0,0,7); g.fill();

  /* ---- legs: long stride driving forward, heels dug in on the recoil ---- */
  const stride = lerp(s*0.058, s*0.132, clamp01(drive));
  const dig    = recoil*s*0.055;
  const kB = { x: cx - F*(stride*0.44 + dig), y: hipY + (footY-hipY)*0.50 };
  const kF = { x: cx + F*(stride*0.62 - dig*0.5), y: hipY + (footY-hipY)*0.52 };
  const fB = cx - F*(stride*0.80 + dig*1.6), fF = cx + F*(stride - dig*0.6);
  pen.limb(()=>{ g.moveTo(cx-hipHalf*0.46, hipY); g.lineTo(kB.x,kB.y); g.lineTo(fB, footY-s*0.022); }, skin, s*0.066);
  pen.paint(()=>{ g.ellipse(fB, footY-s*0.006, s*0.047, s*0.018, 0,0,7); }, boot, lw*0.75);
  pen.limb(()=>{ g.moveTo(cx+hipHalf*0.46, hipY); g.lineTo(kF.x,kF.y); g.lineTo(fF, footY-s*0.022); }, skin, s*0.072);
  pen.paint(()=>{ g.ellipse(fF, footY-s*0.006, s*0.053, s*0.020, 0,0,7); }, boot, lw*0.75);

  /* ---- the cloak, on the few who own one: a light plane behind the torso ---- */
  if (m.feat.cloak){
    const swing = F*s*(0.10 + 0.13*drive);
    pen.paint(()=>{
      g.moveTo(cx - F*shHalf*0.90 + lean, shY - s*0.012);
      g.lineTo(cx - F*shHalf*0.20 + lean, shY - s*0.020);
      g.lineTo(cx - F*s*0.055 - swing,    hipY + s*0.185);
      g.lineTo(cx - F*s*0.235 - swing,    hipY + s*0.120);
      g.closePath();
    }, toneSolid(inkLevel(L.cloak)), lw*0.9);
  }

  /* ---- far arm (behind the torso): carries the shield strap or hangs ---- */
  const farSh = { x: cx - F*shHalf*0.80 + lean, y: shY + s*0.028 + tiltS };
  const farWr = m.feat.shield
    ? { x: cx + F*s*(0.055 + 0.115*guard), y: hipY - s*(0.020 + 0.230*guard) }
    : { x: cx - F*s*(0.070 + 0.075*drive), y: hipY + s*0.035 };
  armTo(pen, farSh, farWr, skin, s*0.068, -F*0.10);

  /* ---- torso: a blocky tunic, light plane, hard contour.
     The shoulders are TILTED, per man, by the arm that carries the shaft —
     so no two shoulder edges in a rank are ever collinear and a row of them
     cannot fuse into one horizontal bar. ---- */
  pen.paint(()=>{
    g.moveTo(cx - shHalf + lean, shY + tiltS);
    g.lineTo(cx + shHalf + lean, shY - tiltS);
    g.lineTo(cx + hipHalf*1.14, hipY + s*0.044);
    g.lineTo(cx - hipHalf*1.14, hipY + s*0.044);
    g.closePath();
  }, tunic, lw);
  /* belt — a short bar, deliberately shy of both edges */
  pen.paint(()=>{ g.rect(cx - hipHalf*0.78, hipY - s*0.010, hipHalf*1.56, s*0.021); }, toneSolid(inkLevel(5)), lw*0.55);
  /* baldric — one diagonal across the light plane; it also breaks the tunic
     rectangles so a rank of them never reads as a row of blank cards */
  pen.seam(()=>{ g.moveTo(cx - F*shHalf*0.72 + lean, shY + s*0.020);
                 g.lineTo(cx + F*hipHalf*0.86, hipY - s*0.012); }, lw*0.70);

  /* ---- neck + head ---- */
  const Fh = m.Fh;
  const hx = cx + lean*0.62 + m.turn*Fh*headR*0.34;
  const hy = shY - headR*1.00 - s*0.016 + recoil*s*0.012 + tiltS*0.5;
  pen.limb(()=>{ g.moveTo(cx+lean, shY + s*0.006); g.lineTo(hx, hy + headR*0.72); }, skin, s*0.056);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0, 7); }, skin, lw);
  if (m.feat.gear === "bare" || m.feat.gear === "cap")
    pen.paint(()=>{ g.arc(hx, hy - headR*0.26, headR*1.02,
                          Math.PI*(1.06 + 0.05*Fh), Math.PI*(1.94 + 0.05*Fh)); }, dark, lw*0.72);
  if (m.feat.beard)
    pen.paint(()=>{ g.moveTo(hx - headR*0.50, hy + headR*0.50);
                    g.quadraticCurveTo(hx, hy + headR*1.34, hx + headR*0.50, hy + headR*0.50);
                    g.closePath(); }, dark, lw*0.66);
  // brow bar + eye tick — the face has to survive the dot lattice, so it is
  // GEOMETRY (a bar and a blob), never a fine line
  g.save();
  g.strokeStyle = INK; g.lineCap="round"; g.lineWidth = Math.max(2.2, headR*0.24);
  g.beginPath();
  g.moveTo(hx + Fh*headR*(-0.10), hy - headR*0.30);
  g.lineTo(hx + Fh*headR*( 0.72), hy - headR*0.22 - recoil*headR*0.14);
  g.stroke();
  g.restore();
  g.fillStyle = INK;
  g.beginPath(); g.arc(hx + Fh*headR*0.40, hy + headR*0.02, Math.max(2.0, headR*0.15), 0, 7); g.fill();
  const shout = Math.max(drive*0.45, recoil);
  if (shout > 0.4){
    g.beginPath(); g.ellipse(hx + Fh*headR*0.30, hy + headR*0.48,
                             headR*0.19, headR*0.13*(0.5+0.7*shout), 0,0,7); g.fill();
  }
  // head-gear: a DARK dome so the heads keep their silhouette in the dots;
  // the crest is the lead's signature and nobody else's
  if (m.feat.gear === "helm" || m.feat.gear === "crest"){
    pen.paint(()=>{ g.arc(hx, hy - headR*0.06, headR*1.12, Math.PI*0.97, Math.PI*2.03); }, bronze, lw*0.8);
    pen.paint(()=>{ g.rect(hx + Fh*headR*0.04, hy - headR*0.10, Math.max(2.4, headR*0.20), headR*0.56); },
              bronze, lw*0.5);
    if (m.feat.gear === "crest")
      for(let k=-2;k<=2;k++){
        const ang = Math.PI*(1.34 + k*0.080);
        pen.ink(()=>{ g.moveTo(hx + Math.cos(ang)*headR*1.10, hy - headR*0.06 + Math.sin(ang)*headR*1.10);
                      g.lineTo(hx + Math.cos(ang)*headR*1.70, hy - headR*0.06 + Math.sin(ang)*headR*1.70); },
                Math.max(2.0, s*0.016));
      }
  } else if (m.feat.gear === "cap"){
    pen.paint(()=>{ g.arc(hx, hy - headR*0.14, headR*0.98, Math.PI*1.00, Math.PI*2.00); },
              toneSolid(inkLevel(L.cap)), lw*0.75);
  }

  /* ---- the weapon: one shaft, one angle, the whole plot ---- */
  const rad  = m.deg * Math.PI/180;
  const dirX = F*Math.cos(rad), dirY = Math.sin(rad);
  const grip = { x: cx + F*s*0.150 + lean, y: shY + s*0.070 - guard*s*0.030 };
  const hLen = s*(m.feat.weapon === "axe" ? 0.62 : 0.80);
  const bLen = s*0.30;
  const tip  = { x: grip.x + dirX*hLen, y: grip.y + dirY*hLen };
  const butt = { x: grip.x - dirX*bLen, y: grip.y - dirY*bLen };
  pen.ink(()=>{ g.moveTo(butt.x, butt.y); g.lineTo(tip.x, tip.y); }, Math.max(2.4, s*0.026));
  weaponHead(pen, m.feat.weapon, tip.x, tip.y, Math.atan2(dirY, dirX), s, metal, lw);

  /* ---- near arm onto the grip ---- */
  const nearSh = { x: cx + F*shHalf*0.78 + lean, y: shY + s*0.030 - tiltS };
  armTo(pen, nearSh, grip, skin, s*0.070, F*0.12);
  pen.paint(()=>{ g.arc(grip.x, grip.y, s*0.037, 0, 7); }, skin, lw*0.7);

  /* ---- shield: off the hip on the march, up over the shoulder in a funk ---- */
  if (m.feat.shield){
    const sx = cx + F*s*(0.128 + 0.150*guard) + lean;
    const sy = hipY - s*(0.055 + 0.270*guard);
    const r  = s*0.162;
    pen.paint(()=>{ g.arc(sx, sy, r, 0, 7); }, face, lw*1.05);
    pen.seam(()=>{ g.arc(sx, sy, r*0.74, 0, 7); }, lw*0.6);
    pen.paint(()=>{ g.arc(sx, sy, r*0.23, 0, 7); }, dark, lw*0.68);
  }
}

/* ============================================================
   FORMATIONS — three separated depth BANDS (back / mid / front) so bodies
   never mash into one silhouette, and explicit x-slots inside each band so
   nothing ever lines up into a stripe. Entry 0 is always the POINT, the man
   nearest the farm gate, and the order of the table is the order the men are
   dropped as `density` falls. [ nx, band ].
   ============================================================ */
/* the bands are deliberately UNEVENLY spaced: at even spacing the mid band's
   hemline lands on the front band's shoulder line and the two contours fuse
   into one long horizontal rule across the frame. */
const BAND_Y = [0.588, 0.702, 0.854];
const BAND_S = [162, 200, 240];

const FORM_TABLE = {
  // an arrow of three echeloned ranks, the point out front-right at the gate
  wedge: [[0.740,2],[0.618,1],[0.545,2],[0.428,1],[0.352,2],[0.500,0],[0.238,1],[0.330,0],[0.158,0],[0.072,0]],
  // a file on the road: near-right coming forward, tail small and far up-left
  column:[[0.782,2],[0.640,1],[0.572,2],[0.470,1],[0.372,2],[0.418,0],[0.298,1],[0.268,0],[0.128,0],[0.180,2]],
  // two clumps with a real gap down the middle — never one flat line
  "broken-line":
         [[0.782,2],[0.690,1],[0.612,2],[0.836,1],[0.302,2],[0.208,1],[0.128,2],[0.352,0],[0.170,0],[0.712,0]],
  // pushed left and stalled: the front rank's spears reach the incoming shafts
  clash: [[0.552,2],[0.438,1],[0.358,2],[0.600,1],[0.190,2],[0.278,0],[0.236,1],[0.442,0],[0.126,0],[0.602,0]],
  // broken and running: wide, uneven, gaps everywhere
  rout:  [[0.628,2],[0.318,2],[0.792,1],[0.176,1],[0.462,1],[0.118,2],[0.548,0],[0.812,0],[0.292,0],[0.680,2]],
};

function slots(B, n, jit){
  const table = FORM_TABLE[B.formation] || FORM_TABLE.wedge;
  const sp = B.spread ?? 1;
  const out = [];
  for(let i=0;i<n;i++){
    const [bx, band] = table[i % table.length];
    const nx = clamp(0.500 + (bx - 0.500)*sp + (jit[i%12]-0.5)*0.018, 0.075, 0.845);
    // real depth jitter inside the band + a per-man height: no two belts,
    // shoulder lines or footlines ever agree, so nothing stripes the frame
    const ny = clamp(BAND_Y[band] + (jit[(i+5)%12]-0.5)*0.030, 0.560, 0.878);
    const s  = BAND_S[band] * (0.925 + 0.150*jit[(i+9)%12]);
    out.push({ i, nx, ny, band, s });
  }
  return out;
}

/* ============================================================
   THE ROAD OUT — town roofs standing off small and pale, a field wall cut
   into segments with real gaps, and a broken cart track running to the gate.
   Light and high: the militia owns the frame, not the backdrop.
   ============================================================ */
function drawRoad(pen, g, W, H){
  const pale = toneSolid(inkLevel(1));

  // the town they came out of — a few small blocky roofs, back left
  const ROOFS = [[0.078,0.034],[0.146,0.048],[0.222,0.028]];
  ROOFS.forEach(([rx, rh], k)=>{
    const x = rx*W, base = H*(0.268 + (k%2)*0.008), bw = W*(0.042 + (k%3)*0.006), bh = H*rh;
    pen.paint(()=>{ g.rect(x - bw/2, base - bh, bw, bh); }, pale, 2.2);
    pen.paint(()=>{ g.moveTo(x - bw*0.72, base - bh);
                    g.lineTo(x, base - bh - H*0.026);
                    g.lineTo(x + bw*0.72, base - bh); g.closePath(); }, toneSolid(inkLevel(3)), 2.2);
  });

  // the field wall — three SHORT low runs at different heights, wide gaps
  const SEGS = [[0.048,0.196,0.318],[0.386,0.518,0.300],[0.680,0.812,0.328]];
  SEGS.forEach(([a,b,wy])=>{
    const y = H*wy;
    pen.paint(()=>{ g.rect(a*W, y, (b-a)*W, H*0.019); }, pale, 2.2);
    for(let x=a+0.048; x<b-0.016; x+=0.058)
      pen.seam(()=>{ g.moveTo(x*W, y); g.lineTo(x*W, y + H*0.019); }, 1.5);
  });

  // scrub off the shoulder of the track — small, irregular, never a band
  const SCRUB = [[0.268,0.352],[0.585,0.310],[0.892,0.336],[0.472,0.378]];
  SCRUB.forEach(([sx, sy], k)=>{
    const x = sx*W, y = sy*H, r = W*(0.014 + (k%2)*0.006);
    pen.paint(()=>{ g.ellipse(x, y, r, r*0.58, 0,0,7); }, pale, 2.0);
    pen.paint(()=>{ g.ellipse(x + r*0.86, y + r*0.14, r*0.54, r*0.40, 0,0,7); }, pale, 1.9);
  });

  // the cart track to the gate: BROKEN dashes, never a full rule
  g.save();
  g.strokeStyle = INK; g.lineCap="butt"; g.globalAlpha = 0.15;
  for(let r=0;r<3;r++){
    const y  = H*(0.400 + r*0.042 + r*r*0.010);
    g.lineWidth = Math.max(1.2, 1.0 + r*0.40);
    const x0 = lerp(0.06, 0.00, r/3), x1 = lerp(0.60, 0.92, r/3);
    for(let x=x0; x<x1; x+=0.090){
      const a = clamp(x, 0.03, 0.95), b = clamp(x+0.044, 0.03, 0.95);
      if (b<=a) continue;
      g.beginPath(); g.moveTo(a*W, y); g.lineTo(b*W, y + H*0.005); g.stroke();
    }
  }
  g.restore();
}

/* the vacated point: what is left of the man who was leading.
   A helmet on its side, a shield flat in the dirt, a spear across the track. */
function drawKit(pen, g, x, y, s, down){
  const pale = toneSolid(inkLevel(1));
  const dark = toneSolid(inkLevel(6));
  const lw   = Math.max(2.4, s*0.024);
  const a    = clamp01(down);

  // the spear first, low and clear of everything: butt near, head pointing
  // back the way they came
  pen.ink(()=>{ g.moveTo(x + s*0.430, y + s*0.086); g.lineTo(x - s*0.300, y + s*0.030); }, Math.max(2.4, s*0.024));
  weaponHead(pen, "spear", x - s*0.305, y + s*0.028, Math.PI*1.06, s, toneSolid(inkLevel(6)), lw);

  // shield lying flat — an ellipse, not a disc: it reads as ON the ground
  pen.paint(()=>{ g.ellipse(x + s*0.150, y - s*0.030, s*0.205, s*0.082, -0.10, 0, 7); }, pale, lw);
  pen.seam(()=>{ g.ellipse(x + s*0.150, y - s*0.030, s*0.144, s*0.056, -0.10, 0, 7); }, lw*0.6);
  pen.paint(()=>{ g.ellipse(x + s*0.150, y - s*0.030, s*0.048, s*0.020, -0.10, 0, 7); }, dark, lw*0.6);

  // the crested helmet on its side, crest bent into the dirt
  const hx = x - s*0.240, hy = y - s*0.048, r = s*0.092;
  pen.paint(()=>{ g.arc(hx, hy, r, Math.PI*0.06, Math.PI*1.06); }, toneSolid(inkLevel(3)), lw*0.8);
  for(let k=-1;k<=1;k++){
    const ang = Math.PI*(0.56 + k*0.09);
    pen.ink(()=>{ g.moveTo(hx + Math.cos(ang)*r*1.02, hy + Math.sin(ang)*r*1.02);
                  g.lineTo(hx + Math.cos(ang)*r*1.60, hy + Math.sin(ang)*r*1.60 + s*0.014); },
            Math.max(1.8, s*0.014));
  }

  // the mark on the ground where he went down — semantic, and it prints dark
  g.save();
  g.strokeStyle = ACCENT; g.lineCap="round"; g.lineWidth = Math.max(2.4, s*0.020);
  g.globalAlpha = 0.55 + 0.45*a;
  for(const k of [-1,1]){
    g.beginPath();
    g.moveTo(x + k*s*0.400, y + s*0.150); g.lineTo(x + k*s*0.400, y + s*0.104);
    g.lineTo(x + k*s*0.318, y + s*0.104); g.stroke();
  }
  g.restore();
}

/* the farm defenders, never drawn as bodies: their shafts and shield rims
   come in past the right frame edge and cross the militia's front. */
function drawOpposition(pen, g, W, H, s){
  const pale = toneSolid(inkLevel(1));
  const lw   = Math.max(2.4, s*0.024);
  const SHAFTS = [[0.596, 0.780], [0.688, 0.712], [0.786, 0.824]];
  SHAFTS.forEach(([ty, tx], k)=>{
    const x0 = W*1.04, y0 = H*(ty + 0.086);
    const x1 = W*tx,   y1 = H*ty;
    pen.ink(()=>{ g.moveTo(x0, y0); g.lineTo(x1, y1); }, Math.max(2.4, s*0.025));
    weaponHead(pen, k===1 ? "boarspear" : "spear", x1, y1, Math.atan2(y1-y0, x1-x0), s, toneSolid(inkLevel(6)), lw);
  });
  // two shield rims cut by the frame edge
  [[0.632, 0.052], [0.808, 0.044]].forEach(([cy, r])=>{
    pen.ink(()=>{ g.arc(W*1.075, H*cy, H*r*1.9, Math.PI*0.74, Math.PI*1.26); }, lw*1.1);
    pen.ink(()=>{ g.arc(W*1.075, H*cy, H*r*1.34, Math.PI*0.80, Math.PI*1.20); }, lw*0.6);
  });
  // the clash: short jagged ticks where the two fronts meet
  g.save();
  g.strokeStyle = INK; g.lineCap="round"; g.lineWidth = Math.max(2.2, s*0.018); g.globalAlpha = 0.62;
  [[0.742,0.628],[0.800,0.706],[0.706,0.786]].forEach(([px,py])=>{
    g.beginPath();
    g.moveTo(W*px - s*0.075, H*py + s*0.030);
    g.lineTo(W*px - s*0.020, H*py - s*0.010);
    g.lineTo(W*px + s*0.020, H*py + s*0.026);
    g.lineTo(W*px + s*0.078, H*py - s*0.018);
    g.stroke();
  });
  g.restore();
}

/* ============================================================
   STAGE
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g   = ctx;
  const B   = { ...params, ...st, focus: (st && st.focus) || params.focus };
  const ph  = PHASES[B.phase] || PHASES.advance;

  const R = rnd(B.seed >>> 0);
  const jit = []; for(let i=0;i<12;i++) jit.push(R());

  const n   = clamp(Math.round((B.count ?? 9) * clamp01(B.density ?? 1)), 1, MEMBERS.length);
  const raw = slots(B, n, jit);
  const down = clamp01(B.leaderDown ?? 0);

  if (B.showRoad !== false) drawRoad(pen, g, W, H);

  /* the reaction wave runs BACKWARD from the point: the men nearest the front
     break first, and it takes time to reach the back of the wedge. */
  const pt = raw[0];
  let dmax = 1e-6;
  const dist = raw.map(sl=>{ const d = Math.hypot(sl.nx-pt.nx, (sl.ny-pt.ny)*0.85);
                             if (d>dmax) dmax=d; return d; });

  // the shock going out through the ranks — faint arcs, low ink
  if ((B.wave ?? 0) > 0.05 && B.phase !== "advance"){
    g.save(); g.strokeStyle = INK; g.lineCap="round";
    for(let q=1;q<=3;q++){
      const rr = (B.wave ?? 0) * dmax * W * (0.55 + 0.42*q);
      g.globalAlpha = 0.16 / q; g.lineWidth = Math.max(1.6, 3.2 - q*0.6);
      g.beginPath(); g.ellipse(pt.nx*W, pt.ny*H, rr, rr*0.52, 0, Math.PI*0.62, Math.PI*1.42); g.stroke();
    }
    g.restore();
  }

  const built = raw.map((sl, k)=>{
    const u   = clamp01(dist[k]/dmax);
    const lag = clamp01(B.waveLag ?? 0.74);
    const a   = smooth(clamp01(((B.wave ?? 0.55)*(1+lag) - u*lag) / 0.22));
    const drive = lerp(ph.pre.drive,  ph.post.drive,  a);
    const recoil= lerp(ph.pre.recoil, ph.post.recoil, a);
    const guard = lerp(ph.pre.guard,  ph.post.guard,  a);
    const flee  = lerp(ph.pre.flee,   ph.post.flee,   a);
    const deg   = lerp(ph.pre.deg,    ph.post.deg,    a) + (jit[(k+7)%12]-0.5)*28;
    const depth = sl.band/2;
    const s     = sl.s;
    const near  = sl.band === 2;
    const mem   = MEMBERS[(sl.i) % MEMBERS.length];
    // facing SNAPS at flee 0.5 — the one discontinuity, as designed
    const F     = flee > 0.5 ? -1 : 1;
    const toward= (B.focus.x - sl.nx) >= 0 ? 1 : -1;
    const att   = clamp01(B.attention ?? 0.86);
    return {
      lead: k===0, cx: sl.nx*W, footY: sl.ny*H, s, depth, u, F,
      Fh: (flee > 0.5 ? -toward : toward) >= 0 ? 1 : -1,
      turn: att * (0.30 + 0.70*a),
      // the shaft-carrying shoulder rides high, by a different amount per man
      tilt: (0.008 + 0.020*jit[(k+2)%12]) * (jit[(k+6)%12] > 0.35 ? 1 : -1),
      drive, recoil, guard, flee, deg, feat: mem,
      lvl: {
        tunic: near ? (sl.i%2 ? 2 : 1) : 1,
        skin:  near ? 2 : 1,
        hair:  near ? 6 : 5,
        metal: near ? 6 : 5,
        boot:  near ? 4 : 3,
        helm:  near ? 5 : 4,
        cap:   near ? 4 : 3,
        cloak: near ? 2 : 1,
        shield:1,
      },
    };
  });

  let keep = B.layer === "background" ? built.filter(m=>m.depth <= 0.55)
           : B.layer === "foreground" ? built.filter(m=>m.depth >  0.55)
           : built;
  // the point is vacated once he is down — the hole in the wedge IS the beat
  if (down >= 0.5 || B.showLead === false) keep = keep.filter(m=>!m.lead);

  keep.sort((a,b)=> a.footY - b.footY).forEach(m=> drawRelative(pen, m));

  // the kit lies in the front band, so it belongs to the foreground split
  if (down >= 0.5 && B.showKit !== false && B.layer !== "background")
    drawKit(pen, g, pt.nx*W, pt.ny*H, BAND_S[pt.band], down);

  if (B.showOpposition) drawOpposition(pen, g, W, H, BAND_S[2]);
}

export const asset = {
  id:"ensemble.revenge-militia",
  type:"ENSEMBLE",
  name:"Revenge militia",
  statusWord:"ADVANCING",
  scene:"OD-B24-S08",

  params,
  // ONE separable member template, instanced N times over a formation curve
  member:{ template:"drawRelative", roster:MEMBERS, weapons:WEAPONS, formations:FORMATIONS,
           scalars:["drive","recoil","guard","flee","deg","turn"] },
  // back -> front draw order the stage honors
  layers:["town","field-wall","scrub","cart-track","shock-rings",
          "back-band","mid-band","front-band","fallen-kit","opposition"],
  // normalized 0..1 anchors — the point is an ANCHOR, never a baked character
  anchors:{
    "lead":{x:.790,y:.762},           // Eupithes's slot / where his kit lands
    "wave:origin":{x:.790,y:.762},
    "contact:front":{x:.560,y:.716},  // where the two fronts meet
    "column:head":{x:.775,y:.870}, "column:tail":{x:.135,y:.585},
    "flank:left":{x:.300,y:.845}, "flank:right":{x:.640,y:.612},
    "gate":{x:.965,y:.720},           // the farm gate they are aimed at (off frame)
    "center":{x:.520,y:.735}, "camera:wide":{x:.500,y:.640},
  },
  zones:{
    militia:{ x0:.10,y0:.54,x1:.88,y1:.90 },
    contact:{ x0:.50,y0:.58,x1:.98,y1:.86 },
    road:{ x0:.02,y0:.30,x1:.98,y1:.55 },
  },
  states:{
    initial:"advancing",
    nodes:{
      // out of the town in a wedge, spears forward, every head on the gate
      advancing: { preview:{ phase:"advance", formation:"wedge", wave:0.35, waveLag:0.55,
                             attention:0.90, leaderDown:0, showOpposition:false,
                             status:"ADVANCING", progress:0.20 } },
      // the point goes down; the shock starts back through the ranks
      leaderless:{ preview:{ phase:"leader-down", formation:"wedge", wave:0.50, waveLag:0.80,
                             attention:0.70, leaderDown:1, showOpposition:false,
                             status:"LEADERLESS", progress:0.44 } },
      // spears off the level, shields up, the line broken into two clumps
      wavering:  { preview:{ phase:"waver", formation:"broken-line", wave:0.88, waveLag:0.60,
                             attention:0.45, leaderDown:1, showOpposition:false,
                             status:"WAVERING", progress:0.62 } },
      // the front meets the farm defenders coming the other way
      colliding: { preview:{ phase:"collide", formation:"clash", wave:0.72, waveLag:0.40,
                             attention:0.88, leaderDown:1, showOpposition:true,
                             status:"COLLIDING", progress:0.78 } },
      // turned around, spears trailing, scattering back down the track
      routed:    { preview:{ phase:"rout", formation:"rout", wave:0.95, waveLag:0.50,
                             attention:0.30, leaderDown:1, showOpposition:false,
                             status:"ROUTED", progress:0.94 } },
    },
    edges:[
      ["advancing","leaderless"],["leaderless","wavering"],["wavering","colliding"],
      ["colliding","routed"],["wavering","routed"],["leaderless","colliding"],
      ["wavering","advancing"],
    ],
  },
  channels:["formation","density","attention","wave","waveLag","layer","phase",
            "leaderDown","spread","showOpposition"],

  // neutral preview = the wedge on the road, point still held, spears forward
  preview:()=>({ phase:"advance", formation:"wedge", count:9, density:1.0,
                 wave:0.38, waveLag:0.58, attention:0.90, leaderDown:0,
                 showOpposition:false, showRoad:true,
                 status:"ADVANCING", progress:0.22 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
