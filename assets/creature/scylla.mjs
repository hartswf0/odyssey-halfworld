/* creature.scylla — the six-headed cliff monster of the strait.
   CREATURE asset (custom multi-part geometry, NOT humanoid): a hidden DEN
   cut into a sheer CLIFF, from which erupt SIX long telescoping serpent
   NECKS, each ending in a fanged dog/wolf HEAD that targets independently;
   a GIRDLE of barking dog-heads rings the waist at the den mouth.
   Built entirely from engine primitives:
     · CLIFF mass + jagged sea-face + a black arched DEN cavity
     · a NECK = a tapering ribbon tube (quadratic spine) with telescoping
       ring-seams, terminated by a WOLF HEAD oriented along the spine tangent
     · WOLF HEAD = skull + hinged open jaws with white fangs, pricked ear,
       bright gaze eye, nostril — the fanged read that names the monster
     · GIRDLE = a ring of small snapping dog-heads at the waist
   States (channels drive them):
     hidden    — necks withdrawn into the den, only the muzzles at the mouth
     necks-out — full telescoping extension, six heads fanned + snapping
     seize     — one neck darts to a victim, jaws clamped shut on it
     lift      — the seized victim hauled up toward the den
     devour    — the feeding neck retracted to the mouth, victim gone, chomping
     retract   — necks half-withdrawn, jaws slackening
   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B12-S04 — six-headed cliff monster, telescoping necks,
   independent targeting, seize / lift / devour / retract. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- tone levels (flat grays; the POST pass turns them into dots) ---- */
const T_SEA    = ()=> toneSolid(inkLevel(1));   // faint sky/sea field
const T_ROCK   = ()=> toneSolid(inkLevel(3));   // cliff rock
const T_ROCKD  = ()=> toneSolid(inkLevel(5));   // rock shadow / crevice
const T_DEN    = ()=> toneSolid(inkLevel(7));   // black den cavity
const T_NECK   = ()=> toneSolid(inkLevel(4));   // near necks
const T_NECKF  = ()=> toneSolid(inkLevel(3));   // far necks (behind, lighter)
const T_HEAD   = ()=> toneSolid(inkLevel(5));   // near heads
const T_HEADF  = ()=> toneSolid(inkLevel(4));   // far heads
const T_EAR    = ()=> toneSolid(inkLevel(6));
const T_GIRD   = ()=> toneSolid(inkLevel(6));   // dark girdle dog-heads
const T_VICTIM = ()=> toneSolid(inkLevel(4));
const FANG     = "#f2f2ec";                      // bone-white fangs
const EYEW     = "#f0f0ea";                      // bright eye

/* ============================================================
   WOLF HEAD — drawn in a LOCAL frame the caller has translated + rotated
   so +x points forward along the neck's reach and +y is "down" for the head.
   hr = head radius unit. jaw = 0 (clamped) .. ~0.9 (gaping). far dims tones.
   ============================================================ */
function drawWolfHead(pen, hr, { jaw=0.5, gaze=0, far=false }={}){
  const g = pen.ctx;
  const hTone = far ? T_HEADF() : T_HEAD();

  // ---- pricked EAR (behind the skull) ----
  pen.paint(()=>{
    g.moveTo(-hr*0.06,-hr*0.34);
    g.lineTo( hr*0.30,-hr*1.00);
    g.lineTo( hr*0.44,-hr*0.26);
    g.closePath();
  }, T_EAR(), 3);

  // ---- LOWER JAW (hinged at the back of the mouth, swings open by `jaw`) ----
  g.save();
  g.translate(hr*0.06, hr*0.06);
  g.rotate(jaw);
  pen.paint(()=>{
    g.moveTo(-hr*0.02, hr*0.02);
    g.lineTo( hr*1.16, hr*0.10);        // jaw tip
    g.lineTo( hr*1.02, hr*0.30);
    g.lineTo( hr*0.04, hr*0.30);
    g.closePath();
  }, hTone, 3.5);
  // lower fangs (bone-white, pointing UP out of the lower gum)
  const lfang=(x)=> pen.paint(()=>{
    g.moveTo(x-hr*0.06, hr*0.06); g.lineTo(x+hr*0.06, hr*0.06); g.lineTo(x, hr*0.06-hr*0.34); g.closePath();
  }, toneSolid(FANG), 1.6);
  lfang(hr*0.92); lfang(hr*0.46);
  g.restore();

  // ---- UPPER JAW / muzzle (over the lower jaw) ----
  pen.paint(()=>{
    g.moveTo(-hr*0.36,-hr*0.16);                       // back-top of skull
    g.quadraticCurveTo(hr*0.36,-hr*0.62, hr*1.28,-hr*0.30); // brow -> nose bridge
    g.lineTo( hr*1.44,-hr*0.04);                       // nose tip
    g.lineTo( hr*1.18, hr*0.05);                       // upper lip front
    g.lineTo( hr*0.10, hr*0.08);                       // gum line back
    g.quadraticCurveTo(-hr*0.30, hr*0.02, -hr*0.36,-hr*0.16);
    g.closePath();
  }, hTone, 4);
  // upper fangs (bone-white, pointing DOWN out of the upper gum)
  const ufang=(x)=> pen.paint(()=>{
    g.moveTo(x-hr*0.06, hr*0.05); g.lineTo(x+hr*0.06, hr*0.05); g.lineTo(x, hr*0.05+hr*0.36); g.closePath();
  }, toneSolid(FANG), 1.6);
  ufang(hr*1.04); ufang(hr*0.58);

  // ---- nostril + gaze eye ----
  g.fillStyle=INK; g.beginPath(); g.ellipse(hr*1.28,-hr*0.14, hr*0.06, hr*0.05, 0,0,TAU); g.fill();
  const ex=hr*0.46, ey=-hr*0.22 + gaze*hr*0.20;
  g.fillStyle=EYEW; g.beginPath(); g.ellipse(ex, ey, hr*0.16, hr*0.14, 0,0,TAU); g.fill();
  g.fillStyle=INK;  g.beginPath(); g.ellipse(ex+hr*0.03, ey, hr*0.07, hr*0.09, 0,0,TAU); g.fill();
  // brow crease over the eye (menace)
  pen.ink(()=>{ g.moveTo(ex-hr*0.20, ey-hr*0.22); g.lineTo(ex+hr*0.24, ey-hr*0.30); }, 2.4);
}

/* ============================================================
   NECK — a tapering ribbon along a quadratic spine B -> C -> T.
   Draws the tube in a solid tone with telescoping ring-seams, then the
   wolf head at the tip oriented along the terminal tangent. Returns the
   tip point (unused, but handy for anchors/scene wiring).
   ============================================================ */
function drawNeck(pen, B, C, T, w0, w1, tone, headOpts){
  const g = pen.ctx;
  const N = 20;
  const pts = [];
  for (let i=0;i<=N;i++){
    const t=i/N, u=1-t;
    const x=u*u*B.x + 2*u*t*C.x + t*t*T.x;
    const y=u*u*B.y + 2*u*t*C.y + t*t*T.y;
    let dx=2*u*(C.x-B.x)+2*t*(T.x-C.x);
    let dy=2*u*(C.y-B.y)+2*t*(T.y-C.y);
    const L=Math.hypot(dx,dy)||1; dx/=L; dy/=L;
    pts.push({ x,y, nx:-dy, ny:dx, tx:dx, ty:dy, w:lerp(w0,w1,t)/2 });
  }
  // ---- ribbon body (down one edge, back the other) ----
  pen.paint(()=>{
    for (let i=0;i<=N;i++){ const p=pts[i]; const X=p.x+p.nx*p.w, Y=p.y+p.ny*p.w;
      if(i===0) g.moveTo(X,Y); else g.lineTo(X,Y); }
    for (let i=N;i>=0;i--){ const p=pts[i]; g.lineTo(p.x-p.nx*p.w, p.y-p.ny*p.w); }
    g.closePath();
  }, tone, 4.5);
  // ---- telescoping ring-seams across the tube ----
  for (let i=3;i<N-1;i+=3){ const p=pts[i];
    pen.seam(()=>{ g.moveTo(p.x+p.nx*p.w*0.94, p.y+p.ny*p.w*0.94);
                   g.lineTo(p.x-p.nx*p.w*0.94, p.y-p.ny*p.w*0.94); }, 2.2);
  }
  // ---- wolf head at the tip, aligned to the terminal tangent ----
  const tip=pts[N];
  const ang=Math.atan2(tip.ty, tip.tx);
  g.save(); g.translate(tip.x, tip.y); g.rotate(ang);
  drawWolfHead(pen, w1*1.55, headOpts);
  g.restore();
  return tip;
}

/* one small barking dog-head of the waist GIRDLE, facing angle a */
function drawGirdleHead(pen, cx, cy, a, r, jaw){
  const g=pen.ctx;
  g.save(); g.translate(cx,cy); g.rotate(a);
  drawWolfHead(pen, r, { jaw, gaze:0.2, far:false });
  g.restore();
}

/* a snatched sailor clamped in the jaws — a small limp humanoid */
function drawVictim(pen, pos, U, dangle){
  const g=pen.ctx;
  const t=T_VICTIM();
  // torso
  pen.paint(()=>{ g.ellipse(pos.x, pos.y, U*0.16, U*0.26, 0.2, 0,TAU); }, t, 3.5);
  // head
  pen.paint(()=>{ g.ellipse(pos.x-U*0.14, pos.y-U*0.22, U*0.10, U*0.11, 0,0,TAU); }, t, 3);
  // dangling arms + legs
  const limb=(dx,dy)=> pen.limb(()=>{ g.moveTo(pos.x,pos.y); g.lineTo(pos.x+dx, pos.y+dy); }, t, U*0.07);
  limb(-U*0.06, U*0.30+dangle*U*0.14);
  limb( U*0.14, U*0.28+dangle*U*0.10);
  limb(-U*0.20, U*0.10);
}

/* ---- CLIFF + hidden DEN ---- */
function drawCliff(pen, W, H, DC, U){
  const g = pen.ctx;
  // faint sea/sky field behind everything
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  // low waterline band (context, kept light)
  pen.paint(()=>{ g.rect(0, H*0.86, W, H*0.14); }, T_SEA(), 0);
  g.strokeStyle="rgba(0,0,0,0.20)"; g.lineWidth=2; g.lineCap="round";
  for(let i=0;i<4;i++){ const yy=H*0.88+i*10; g.beginPath();
    g.moveTo(W*0.05,yy); g.lineTo(W*0.95,yy); g.stroke(); }

  // ---- cliff rock mass (left, with a jagged sea-face on the right) ----
  pen.paint(()=>{
    g.moveTo(0,0);
    g.lineTo(W*0.40,0);
    g.lineTo(W*0.34, H*0.10);
    g.lineTo(W*0.41, H*0.20);
    g.lineTo(W*0.33, H*0.31);
    g.lineTo(W*0.40, H*0.40);
    g.lineTo(W*0.30, H*0.50);          // notch at the den mouth
    g.lineTo(W*0.39, H*0.60);
    g.lineTo(W*0.31, H*0.71);
    g.lineTo(W*0.40, H*0.82);
    g.lineTo(W*0.30, H*0.92);
    g.lineTo(0, H*0.96);
    g.closePath();
  }, T_ROCK(), 5);
  // a few crevice shadows for rock form
  g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.45;
  for(const [x0,y0,x1,y1] of [
    [W*0.12,H*0.06,W*0.20,H*0.30],[W*0.06,H*0.34,W*0.15,H*0.62],
    [W*0.10,H*0.66,W*0.18,H*0.94]]){
    g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y1); g.stroke(); }
  g.globalAlpha=1;
  // a contained ring of darker rock hugging the den mouth (form, not a halo)
  pen.paint(()=>{ g.ellipse(DC.x, DC.y, U*0.90, U*1.02, 0,0,TAU); }, T_ROCKD(), 0);

  // ---- the hidden DEN: a black arched cavity the necks erupt from ----
  pen.paint(()=>{
    g.moveTo(DC.x-U*0.72, DC.y+U*0.86);
    g.quadraticCurveTo(DC.x-U*0.82, DC.y-U*0.90, DC.x, DC.y-U*0.90);
    g.quadraticCurveTo(DC.x+U*0.82, DC.y-U*0.90, DC.x+U*0.72, DC.y+U*0.86);
    g.quadraticCurveTo(DC.x, DC.y+U*1.05, DC.x-U*0.72, DC.y+U*0.86);
    g.closePath();
  }, T_DEN(), 5);
}

/* ---- the six neck definitions (angle from den, reach, curve bow, depth) ---- */
const NECKS = [
  { ang:-1.00, reach:0.94, bow:+1.1, far:true  },  // top
  { ang:-0.56, reach:1.08, bow:-0.9, far:true  },
  { ang:-0.14, reach:1.18, bow:+1.0, far:false },
  { ang: 0.30, reach:1.16, bow:-1.0, far:false },
  { ang: 0.66, reach:1.06, bow:+1.0, far:false },  // seize head (lower)
  { ang: 1.02, reach:0.96, bow:-1.2, far:false },  // bottom
];
const SEIZE_IDX = 4;

function poseFor(pose){
  switch(pose){
    case "hidden":    return { e:0.12, jaw:0.14, seize:false, lift:false, devour:false };
    case "necks-out": return { e:1.00, jaw:0.55, seize:false, lift:false, devour:false };
    case "seize":     return { e:1.00, jaw:0.50, seize:true,  lift:false, devour:false };
    case "lift":      return { e:1.00, jaw:0.42, seize:true,  lift:true,  devour:false };
    case "devour":    return { e:1.00, jaw:0.52, seize:false, lift:false, devour:true  };
    case "retract":   return { e:0.50, jaw:0.22, seize:false, lift:false, devour:false };
    default:          return { e:1.00, jaw:0.55, seize:false, lift:false, devour:false };
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const t = state.t || 0;
  const Pp = poseFor(state.pose || "necks-out");
  const U = Math.min(W,H) * 0.15;
  const DC = P(W*0.28, H*0.44);                 // den mouth / waist center

  drawCliff(pen, W, H, DC, U);

  const R = U*3.0;
  const w0 = U*0.46, w1 = U*0.27;               // neck base -> head-base width

  // resolve every neck's geometry first, then draw back-to-front by tip.y
  const built = NECKS.map((nk, i)=>{
    const ca=Math.cos(nk.ang), sa=Math.sin(nk.ang);
    const B = P(DC.x + ca*U*0.55, DC.y + sa*U*0.55);           // root on the waist ring
    const full = P(DC.x + ca*R*nk.reach, DC.y + sa*R*nk.reach);
    const tuck = P(DC.x + ca*U*0.85, DC.y + sa*U*0.85);        // pulled into the mouth

    let e = Pp.e;
    let jaw = Pp.jaw + 0.14*Math.sin(t*3 + i*1.7);             // independent snapping
    let target, headFar = nk.far;

    if (Pp.seize && i===SEIZE_IDX){
      target = Pp.lift ? P(W*0.60, H*0.26) : P(W*0.74, H*0.72); // dart to the victim
      jaw = 0.02; e = 1;                                         // clamped shut
    } else if (Pp.devour && i===SEIZE_IDX){
      e = 0.18; jaw = 0.10 + 0.20*Math.max(0,Math.sin(t*6));    // hauled in, chomping
      target = null;
    } else {
      target = P(lerp(tuck.x, full.x, e), lerp(tuck.y, full.y, e));
    }
    if (!target) target = P(lerp(tuck.x, full.x, e), lerp(tuck.y, full.y, e));

    // control point: bow perpendicular to the reach for a serpentine spine
    const mx=(B.x+target.x)/2, my=(B.y+target.y)/2;
    const px=-sa, py=ca;                                        // reach normal
    const C = P(mx + px*nk.bow*U*1.15*e, my + py*nk.bow*U*1.15*e);
    return { B, C, target, jaw, headFar, i, tip:target };
  });

  // painter's order: farther (higher on frame) necks first
  const order = built.map((b,i)=>i).sort((a,b)=> built[a].tip.y - built[b].tip.y);
  for (const idx of order){
    const b = built[idx];
    const tone = b.headFar ? T_NECKF() : T_NECK();
    drawNeck(pen, b.B, b.C, b.target, w0, w1, tone,
             { jaw:clamp(b.jaw,0,1), gaze: 0.2*Math.sin(t*2+idx), far:b.headFar });
  }

  // ---- victim clamped in the seizing jaws ----
  if (Pp.seize){
    const b = built[SEIZE_IDX];
    drawVictim(pen, P(b.target.x + U*0.15, b.target.y + U*0.30), U, Pp.lift?0.4:1.0);
  }

  // ---- GIRDLE of barking dog-heads ringing the waist at the den mouth ----
  const girdN = 6;
  for (let k=0;k<girdN;k++){
    const a = lerp(-0.35, 1.55, k/(girdN-1));                  // sea-facing front arc
    const rr = U*0.82;
    const gx = DC.x + Math.cos(a)*rr;
    const gy = DC.y + Math.sin(a)*rr;
    const jaw = 0.32 + 0.28*Math.max(0,Math.sin(t*5 + k*1.3)); // barking
    drawGirdleHead(pen, gx, gy, a, U*0.24, jaw);
  }
}

export const asset = {
  id:"creature.scylla",
  type:"CREATURE",
  name:"Scylla",
  statusWord:"RAVENOUS",
  scene:"OD-B12-S04",

  // procedural knobs
  params:{
    heads:6,               // six telescoping serpent necks + heads
    girdleHeads:7,         // barking dog-heads at the waist
    reach:1.0,             // neck extension multiplier (telescoping)
    denAnchor:{x:.28,y:.44},
    independentTargeting:true,
    collision:true,        // den mass + swept neck arcs used for scene collision
  },
  // back -> front draw order the scene honors
  layers:["sky","sea","cliff","den-shadow","den","far-necks","far-heads",
          "near-necks","near-heads","victim","girdle","fangs","eyes"],
  // normalized 0..1 attention / attachment / reach anchors (necks-out pose)
  anchors:{
    "den:mouth":{x:.28,y:.44},
    "waist:girdle":{x:.30,y:.52},
    "head:1":{x:.44,y:.10}, "head:2":{x:.62,y:.22},
    "head:3":{x:.72,y:.40}, "head:4":{x:.72,y:.58},
    "head:5":{x:.62,y:.74}, "head:6":{x:.46,y:.82},
    "target:ship":{x:.90,y:.72},     // the passing prey the necks reach for
    "camera:strait":{x:.55,y:.48},
    "camera:den":{x:.30,y:.44},
  },
  // den + swept-reach footprints for placement / collision
  zones:{
    "den:cavity":{ x0:.14,y0:.30,x1:.42,y1:.60 },
    "reach:arc":{ x0:.30,y0:.06,x1:.94,y1:.90 },   // the volume the six heads sweep
    "danger":{ x0:.60,y0:.10,x1:.96,y1:.88 },
  },
  states:{
    initial:"necks-out",
    nodes:{
      hidden:{     preview:{ pose:"hidden",    t:0.0 } },  // withdrawn into the den
      "necks-out":{preview:{ pose:"necks-out", t:0.4 } },  // six heads fanned + snapping
      seize:{      preview:{ pose:"seize",     t:0.2 } },  // one neck clamps a victim
      lift:{       preview:{ pose:"lift",      t:0.3 } },  // victim hauled up
      devour:{     preview:{ pose:"devour",    t:0.5 } },  // fed neck retracted, chomping
      retract:{    preview:{ pose:"retract",   t:0.2 } },  // half-withdrawn
    },
    edges:[
      ["hidden","necks-out"],["necks-out","seize"],["seize","lift"],
      ["lift","devour"],["devour","retract"],["retract","hidden"],
      ["necks-out","retract"],
    ],
  },
  channels:["pose","reach","jaw","gaze","target","t"],

  preview:()=>({ pose:"necks-out", t:0.4, status:"RAVENOUS", progress:.24 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
