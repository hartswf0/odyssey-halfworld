/* creature.festival-livestock — the beasts driven up to the palace on the feast
   day of Apollo (Odyssey Book 20): Eumaeus' SWINE, Melanthius' GOATS and
   Philoetius' CATTLE, each drove arriving by its OWN ROUTE and converging on
   the court gate.

   CREATURE asset (quadruped, NOT humanoid): fully custom geometry on engine
   primitives. ONE articulated quadruped RIG — spine, four two-segment cloven
   legs, neck, skull — driven by a SPECIES table (`SP`) that reshapes the same
   skeleton into swine / goat / ox, and by per-animal channels:

     gait   0..1   walk-cycle amplitude, driven by `phase` (locomotion)
     bound  0..1   frozen gallop, feet off the ground (extreme locomotion)
     brace  0..1   balking: forefeet planted, weight thrown back (extreme)
     headDrop 0..1 head carried high -> nose in the dust (rooting / grazing)
     gaze  -1..1   eye + head attention swing
     jaw    0..1   mouth open — the squeal / bleat / bellow
     hull          collision volume (barrel + leg footprint), drawable in `survey`

   THE ROUTES are the composition: three tapering lanes, each with its own
   entry, converging on the dark gate mouth. Lanes run on the DIAGONAL and the
   court wall is broken into separate blocks, so nothing bars the frame.
   Counts are carried as SEVEN-SEGMENT geometry on three tally plates, never as
   small type. Hides print LIGHT (level 2) so the hard contour, the hooves, the
   horns and the black gate mouth are the only heavy marks and paper stays open.

   States: arriving (neutral) · massed · balking (extreme) · survey (rig diagram).
   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B20-S03 — pigs, goats and cattle arriving by separate routes for
   the suitors' feast. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* CONTOUR WEIGHT — set per beast in drawBeast(). A hard contour must be wider
   than one halftone cell or the POST pass eats it into a dotted line, so the
   weight scales with the animal instead of being a fixed number. */
let CW = 4;

/* ---- tone levels. Everything structural is LIGHT; only hoof, horn, coping,
   tally bars and the gate mouth are dark. ---- */
const T_HIDE  = ()=> toneSolid(inkLevel(2));   // hide plane
const T_BELLY = ()=> toneSolid(inkLevel(1));   // paler underline
const T_MASS  = ()=> toneSolid(inkLevel(3));   // shoulder / haunch mass
const T_HEAD  = ()=> toneSolid(inkLevel(2));
const T_MUZZ  = ()=> toneSolid(inkLevel(4));   // snout / muzzle block
const T_EARN  = ()=> toneSolid(inkLevel(3));   // near ear
const T_EARF  = ()=> toneSolid(inkLevel(2));   // far ear
const T_LEGN  = ()=> toneSolid(inkLevel(2));   // near legs
const T_LEGF  = ()=> toneSolid(inkLevel(1));   // far legs
const T_HOOF  = ()=> toneSolid(inkLevel(6));   // hard cloven hoof
const T_HORNN = ()=> toneSolid(inkLevel(5));   // near horn
const T_HORNF = ()=> toneSolid(inkLevel(4));   // far horn
const T_TAIL  = ()=> toneSolid(inkLevel(3));
const T_MOUTH = ()=> toneSolid(inkLevel(6));   // open jaw cavity

const T_LANE  = ()=> toneSolid(inkLevel(0));   // route band: PAPER, edges only —
                                               // a toned band would swallow the
                                               // light hides standing on it
const T_PRINT = ()=> toneSolid(inkLevel(3));   // hoof print
const T_WALL  = ()=> toneSolid(inkLevel(1));   // court wall block
const T_COPE  = ()=> toneSolid(inkLevel(5));   // coping cap (dark accent)
const T_PIER  = ()=> toneSolid(inkLevel(2));   // gate pier
const T_LINT  = ()=> toneSolid(inkLevel(3));   // lintel
const T_MOUTHG= ()=> toneSolid(inkLevel(5));   // the gate mouth — the one dark hole
const T_PLATE = ()=> toneSolid(inkLevel(1));   // tally plate
const T_BAR   = ()=> toneSolid(inkLevel(7));   // seven-segment bar

/* ============================================================
   SPECIES TABLE — one skeleton, three animals. Every number is in body
   units (U = half the barrel length) or in `back` (withers height).
   ============================================================ */
const SP = {
  swine: { hK:1.10, shX:0.34, hpX:0.46, croupY:1.00, sag:-0.02, rumpX:0.30, rumpY:0.66,
           chestX:0.30, chestY:0.66, bellyY:0.44, neckX:0.82, neckY:0.90, grazeY:0.22,
           hr:0.34, legW:0.150, tail:"curl", horns:"none", ear:"flop", dewlap:0,
           hull:{ w:2.30, h:1.30 } },
  goat:  { hK:1.20, shX:0.34, hpX:0.46, croupY:0.95, sag: 0.02, rumpX:0.22, rumpY:0.60,
           chestX:0.26, chestY:0.62, bellyY:0.44, neckX:0.74, neckY:1.44, grazeY:0.16,
           hr:0.29, legW:0.115, tail:"flag", horns:"curl", ear:"drop", dewlap:0,
           hull:{ w:2.10, h:1.85 } },
  ox:    { hK:1.27, shX:0.36, hpX:0.48, croupY:0.93, sag: 0.03, rumpX:0.24, rumpY:0.60,
           chestX:0.30, chestY:0.64, bellyY:0.46, neckX:0.82, neckY:1.24, grazeY:0.20,
           hr:0.33, legW:0.135, tail:"whisk", horns:"lyre", ear:"side", dewlap:1,
           hull:{ w:2.40, h:1.95 } },
};

/* ============================================================
   SKELETON — every drawing pass resolves through this, so a horn, a collar or
   a collision hull all land on the same body.
   ============================================================ */
function beastGeom(cx, groundY, U, dir, sp, o={}){
  const S = SP[sp];
  const headDrop = clamp01(o.headDrop ?? 0);
  const brace = clamp01(o.brace ?? 0);
  const bound = clamp01(o.bound ?? 0);

  const back = U*S.hK;
  const gY   = groundY - bound*back*0.16;         // a bounding beast clears the ground
  const shX  = cx + dir*U*S.shX;
  const hpX  = cx - dir*U*S.hpX;

  const wither = P(shX + dir*U*0.02, gY - back*(1 + brace*0.04));
  const croup  = P(hpX + dir*U*0.04, gY - back*(S.croupY - brace*0.06));
  const rump   = P(hpX - dir*U*S.rumpX, gY - back*S.rumpY);
  const chest  = P(shX + dir*U*S.chestX, gY - back*S.chestY);
  const bellyF = P(shX - dir*U*0.06, gY - back*S.bellyY);
  const bellyR = P(hpX + dir*U*0.08, gY - back*(S.bellyY + 0.05));

  const HCup   = P(shX + dir*U*(S.neckX + brace*0.06), gY - back*(S.neckY + brace*0.12));
  const HCdn   = P(shX + dir*U*(S.neckX*1.10),          gY - back*S.grazeY);
  const HC = P(lerp(HCup.x, HCdn.x, headDrop), lerp(HCup.y, HCdn.y, headDrop));
  const hr = U*S.hr;

  return { S, U, back, gY, shX, hpX, wither, croup, rump, chest, bellyF, bellyR, HC, hr,
           headDrop, brace, bound };
}

/* a tapered filled strip — the limb/neck primitive. Filled PLANE + thin hard
   contour, never a fat ink stroke: that is what keeps the beasts light. */
function strip(pen, a, b, wa, wb, tone, lw){
  const g = pen.ctx;
  const dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L;
  pen.paint(()=>{
    g.moveTo(a.x+nx*wa*0.5, a.y+ny*wa*0.5);
    g.lineTo(b.x+nx*wb*0.5, b.y+ny*wb*0.5);
    g.lineTo(b.x-nx*wb*0.5, b.y-ny*wb*0.5);
    g.lineTo(a.x-nx*wa*0.5, a.y-ny*wa*0.5);
    g.closePath();
  }, tone, lw);
}

/* a round-capped limb: light core, THIN hard contour. The round cap is what
   keeps a leg from cutting a straight seam across the belly it grows out of. */
function limbThin(pen, a, b, w, tone, ink=CW*0.78){
  const g = pen.ctx;
  g.lineCap="round"; g.lineJoin="round";
  g.strokeStyle=INK; g.lineWidth=w+ink*2;
  g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
  g.strokeStyle=tone.base; g.lineWidth=w;
  g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
}

/* one cloven leg: two tapering segments + a blocky hoof */
function drawLeg(pen, hip, foot, w, tone, dir, kick){
  const g = pen.ctx;
  const knee = P(lerp(hip.x, foot.x, 0.48) + dir*w*(0.45 + kick*0.5),
                 lerp(hip.y, foot.y, 0.54));
  limbThin(pen, hip, knee, w*0.98, tone);
  limbThin(pen, knee, foot, w*0.70, tone);
  // one blocky cloven hoof with a split seam (a single dark accent, not two)
  pen.paint(()=>{ g.rect(foot.x - w*0.44, foot.y - w*0.06, w*0.88, w*0.40); }, T_HOOF(), CW*0.5);
  pen.seam(()=>{ g.moveTo(foot.x, foot.y - w*0.02); g.lineTo(foot.x, foot.y + w*0.34); }, CW*0.42);
}

/* ---------------- horns ---------------- */
function hornCurl(pen, HC, hr, dir, off, tone, lw, len){   // goat: short back-curl
  const g = pen.ctx;
  const bx = HC.x - dir*hr*0.10 + off, by = HC.y - hr*0.70;
  const tx = bx - dir*hr*1.05*len,     ty = by - hr*0.40*len;
  pen.paint(()=>{
    g.moveTo(bx + dir*hr*0.30, by);
    g.quadraticCurveTo(bx - dir*hr*0.12*len, by - hr*1.00*len, tx, ty);
    g.quadraticCurveTo(bx - dir*hr*0.26*len, by - hr*0.46*len, bx - dir*hr*0.14, by + hr*0.02);
    g.closePath();
  }, tone, lw);
}
function hornLyre(pen, HC, hr, dir, side, tone, lw){       // ox: wide lyre sweep
  const g = pen.ctx;
  const bx = HC.x - dir*hr*0.22 + dir*hr*0.10*side, by = HC.y - hr*0.74;
  pen.paint(()=>{
    g.moveTo(bx - dir*hr*0.16, by + hr*0.10);
    g.quadraticCurveTo(bx - dir*hr*(0.85 + side*0.30), by - hr*(0.80 + side*0.18),
                       bx - dir*hr*(1.42 + side*0.34), by - hr*(0.34 + side*0.10));
    g.quadraticCurveTo(bx - dir*hr*(0.72 + side*0.22), by - hr*(0.44 + side*0.12),
                       bx + dir*hr*0.20, by + hr*0.16);
    g.closePath();
  }, tone, lw);
}

/* ---------------- ears ---------------- */
function earFlop(pen, HC, hr, dir, tone, alert){           // swine: big forward flap
  const g = pen.ctx;
  const sw = lerp(0, 0.45, alert);
  pen.paint(()=>{
    g.moveTo(HC.x - dir*hr*0.24, HC.y - hr*0.34);
    g.quadraticCurveTo(HC.x - dir*hr*0.10, HC.y - hr*(1.10 + sw*0.30),
                       HC.x + dir*hr*(0.46 + sw*0.30), HC.y - hr*(0.82 + sw*0.20));
    g.quadraticCurveTo(HC.x + dir*hr*0.22, HC.y - hr*0.30,
                       HC.x + dir*hr*0.02, HC.y - hr*0.16);
    g.closePath();
  }, tone, CW*0.78);
}
function earDrop(pen, HC, hr, dir, tone, alert, side){     // goat: pendulous drop ear
  const g = pen.ctx;
  const sw = lerp(0, 0.55, alert);
  const bx = HC.x - dir*hr*(0.10 + side*0.14), by = HC.y - hr*(0.32 - side*0.06);
  pen.paint(()=>{
    g.moveTo(bx + dir*hr*0.20, by - hr*0.10);
    g.quadraticCurveTo(bx - dir*hr*(0.80+sw*1.00), by + hr*(0.58-sw*0.66),
                       bx - dir*hr*(0.66+sw*1.70), by + hr*(1.54-sw*1.14));
    g.quadraticCurveTo(bx - dir*hr*(0.10+sw*0.80), by + hr*(1.44-sw*0.90),
                       bx + dir*hr*0.26, by + hr*0.44);
    g.closePath();
  }, tone, CW*0.78);
}
function earSide(pen, HC, hr, dir, tone, alert, side){     // ox: leaf ear out sideways
  const g = pen.ctx;
  const sw = lerp(0.10, 0.55, alert);
  const bx = HC.x - dir*hr*(0.28 + side*0.10), by = HC.y - hr*(0.18 + side*0.10);
  pen.paint(()=>{
    g.moveTo(bx + dir*hr*0.12, by - hr*0.18);
    g.quadraticCurveTo(bx - dir*hr*(0.70+sw), by - hr*(0.60+sw*0.30),
                       bx - dir*hr*(1.10+sw), by - hr*(0.10+sw*0.10));
    g.quadraticCurveTo(bx - dir*hr*(0.60+sw*0.5), by + hr*0.30, bx + dir*hr*0.10, by + hr*0.22);
    g.closePath();
  }, tone, CW*0.75);
}

/* ---------------- heads (one per species, same HC/hr frame) ---------------- */
function headSwine(pen, HC, hr, dir, o){
  const g = pen.ctx, jaw = o.jaw||0, gaze = o.gaze||0;
  earFlop(pen, HC, hr, dir, T_EARF(), o.alert||0);          // far ear behind skull
  // long wedge skull
  pen.paint(()=>{
    g.moveTo(HC.x - dir*hr*0.66, HC.y - hr*0.30);
    g.quadraticCurveTo(HC.x + dir*hr*0.20, HC.y - hr*0.72, HC.x + dir*hr*0.98, HC.y - hr*0.34);
    g.quadraticCurveTo(HC.x + dir*hr*1.22, HC.y + hr*0.04, HC.x + dir*hr*1.02, HC.y + hr*(0.40+jaw*0.50));
    g.quadraticCurveTo(HC.x + dir*hr*0.20, HC.y + hr*(0.86+jaw*0.30), HC.x - dir*hr*0.44, HC.y + hr*0.46);
    g.quadraticCurveTo(HC.x - dir*hr*0.90, HC.y + hr*0.06, HC.x - dir*hr*0.66, HC.y - hr*0.30);
    g.closePath();
  }, T_HEAD(), CW);
  // blunt snout disc + nostrils
  const sx = HC.x + dir*hr*1.10, sy = HC.y + hr*0.02;
  pen.paint(()=>{ g.ellipse(sx, sy, hr*0.28, hr*0.34, dir*0.18, 0, TAU); }, T_MUZZ(), CW*0.72);
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(sx + dir*hr*0.05, sy - hr*0.12, hr*0.06, hr*0.09, 0,0,TAU); g.fill();
  g.beginPath(); g.ellipse(sx + dir*hr*0.05, sy + hr*0.12, hr*0.06, hr*0.09, 0,0,TAU); g.fill();
  if (jaw > 0.05) pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.96, HC.y + hr*0.36);
    g.lineTo(HC.x + dir*hr*0.34, HC.y + hr*0.50);
    g.lineTo(HC.x + dir*hr*0.52, HC.y + hr*(0.52+jaw*0.46));
    g.lineTo(HC.x + dir*hr*0.90, HC.y + hr*(0.46+jaw*0.34));
    g.closePath();
  }, T_MOUTH(), CW*0.6);
  earFlop(pen, HC, hr, dir, T_EARN(), o.alert||0);          // near ear over the skull
  g.fillStyle = INK; g.beginPath();
  g.ellipse(HC.x + dir*hr*0.34, HC.y - hr*(0.10 - gaze*0.16), hr*0.13, hr*0.13, 0,0,TAU); g.fill();
}

function headGoat(pen, HC, hr, dir, o){
  const g = pen.ctx, jaw = o.jaw||0, gaze = o.gaze||0, alert = o.alert||0;
  hornCurl(pen, HC, hr, dir, -dir*hr*0.20, T_HORNF(), CW*0.7, 0.82);
  earDrop(pen, HC, hr, dir, T_EARF(), alert, 1);
  pen.paint(()=>{
    g.moveTo(HC.x - dir*hr*0.44, HC.y - hr*0.66);
    g.quadraticCurveTo(HC.x + dir*hr*0.50, HC.y - hr*0.64, HC.x + dir*hr*0.92, HC.y - hr*0.24);
    g.lineTo(HC.x + dir*hr*1.30, HC.y + hr*0.18);
    g.quadraticCurveTo(HC.x + dir*hr*1.32, HC.y + hr*0.46, HC.x + dir*hr*1.08, HC.y + hr*(0.60+jaw*0.52));
    g.quadraticCurveTo(HC.x + dir*hr*0.28, HC.y + hr*(0.86+jaw*0.40), HC.x - dir*hr*0.32, HC.y + hr*0.46);
    g.closePath();
  }, T_HEAD(), CW);
  pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.86, HC.y - hr*0.08);
    g.lineTo(HC.x + dir*hr*1.28, HC.y + hr*0.20);
    g.quadraticCurveTo(HC.x + dir*hr*1.28, HC.y + hr*0.46, HC.x + dir*hr*1.04, HC.y + hr*0.56);
    g.lineTo(HC.x + dir*hr*0.84, HC.y + hr*0.30);
    g.closePath();
  }, T_MUZZ(), CW*0.72);
  if (jaw > 0.05) pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*1.14, HC.y + hr*0.44);
    g.lineTo(HC.x + dir*hr*0.60, HC.y + hr*0.52);
    g.lineTo(HC.x + dir*hr*0.76, HC.y + hr*(0.52+jaw*0.50));
    g.lineTo(HC.x + dir*hr*1.04, HC.y + hr*(0.50+jaw*0.38));
    g.closePath();
  }, T_MOUTH(), CW*0.6);
  if (o.beard) pen.paint(()=>{
    const bx = HC.x + dir*hr*0.32, by = HC.y + hr*(0.78 + jaw*0.28);
    g.moveTo(bx - dir*hr*0.26, by - hr*0.06);
    g.lineTo(bx + dir*hr*0.22, by);
    g.quadraticCurveTo(bx + dir*hr*0.10, by + hr*0.92, bx - dir*hr*0.06, by + hr*1.04);
    g.quadraticCurveTo(bx - dir*hr*0.24, by + hr*0.58, bx - dir*hr*0.26, by - hr*0.06);
    g.closePath();
  }, T_MASS(), CW*0.66);
  hornCurl(pen, HC, hr, dir, dir*hr*0.02, T_HORNN(), CW*0.85, 1.0);
  earDrop(pen, HC, hr, dir, T_EARN(), alert, 0);
  g.fillStyle = INK; g.beginPath();
  g.ellipse(HC.x + dir*hr*0.48, HC.y - hr*(0.12 - gaze*0.16), hr*0.17, hr*0.13, 0,0,TAU); g.fill();
}

function headOx(pen, HC, hr, dir, o){
  const g = pen.ctx, jaw = o.jaw||0, gaze = o.gaze||0, alert = o.alert||0;
  hornLyre(pen, HC, hr, dir, 1, T_HORNF(), CW*0.7);
  earSide(pen, HC, hr, dir, T_EARF(), alert, 1);
  // broad blunt skull
  pen.paint(()=>{
    g.moveTo(HC.x - dir*hr*0.52, HC.y - hr*0.76);
    g.quadraticCurveTo(HC.x + dir*hr*0.46, HC.y - hr*0.74, HC.x + dir*hr*0.86, HC.y - hr*0.34);
    g.quadraticCurveTo(HC.x + dir*hr*1.14, HC.y + hr*0.02, HC.x + dir*hr*1.06, HC.y + hr*(0.42+jaw*0.46));
    g.quadraticCurveTo(HC.x + dir*hr*0.30, HC.y + hr*(0.92+jaw*0.34), HC.x - dir*hr*0.40, HC.y + hr*0.56);
    g.quadraticCurveTo(HC.x - dir*hr*0.82, HC.y - hr*0.10, HC.x - dir*hr*0.52, HC.y - hr*0.76);
    g.closePath();
  }, T_HEAD(), CW);
  // muzzle block
  pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.78, HC.y - hr*0.16);
    g.quadraticCurveTo(HC.x + dir*hr*1.16, HC.y + hr*0.02, HC.x + dir*hr*1.06, HC.y + hr*0.44);
    g.lineTo(HC.x + dir*hr*0.72, HC.y + hr*0.52);
    g.closePath();
  }, T_MUZZ(), CW*0.72);
  if (jaw > 0.05) pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*1.02, HC.y + hr*0.42);
    g.lineTo(HC.x + dir*hr*0.44, HC.y + hr*0.54);
    g.lineTo(HC.x + dir*hr*0.62, HC.y + hr*(0.56+jaw*0.52));
    g.lineTo(HC.x + dir*hr*0.96, HC.y + hr*(0.48+jaw*0.40));
    g.closePath();
  }, T_MOUTH(), CW*0.6);
  // forelock tuft between the horns
  pen.ink(()=>{ for(let i=-1;i<=1;i++){
    g.moveTo(HC.x - dir*hr*0.18 + i*hr*0.14, HC.y - hr*0.70);
    g.lineTo(HC.x - dir*hr*0.24 + i*hr*0.16, HC.y - hr*0.98); } }, CW*0.6);
  hornLyre(pen, HC, hr, dir, 0, T_HORNN(), CW*0.9);
  earSide(pen, HC, hr, dir, T_EARN(), alert, 0);
  g.fillStyle = INK; g.beginPath();
  g.ellipse(HC.x + dir*hr*0.42, HC.y - hr*(0.16 - gaze*0.18), hr*0.15, hr*0.15, 0,0,TAU); g.fill();
  g.beginPath(); g.ellipse(HC.x + dir*hr*1.00, HC.y + hr*0.16, hr*0.09, hr*0.07, 0,0,TAU); g.fill();
}

const HEADS = { swine:headSwine, goat:headGoat, ox:headOx };

/* ============================================================
   ONE BEAST — the whole rig. sp picks the species reshape; every other knob
   is an animation channel.
   ============================================================ */
function drawBeast(pen, sp, cx, groundY, U, dir, o={}){
  const g = pen.ctx;
  const G = beastGeom(cx, groundY, U, dir, sp, o);
  const { S, back, gY, shX, hpX, wither, croup, rump, chest, bellyF, bellyR, HC, hr } = G;
  const gait = o.gait ?? 0, ph = o.phase ?? 0, bound = o.bound ?? 0, brace = o.brace ?? 0;
  const legW = U*S.legW;
  CW = clamp(U*0.066, 3.2, 6.4);   // contour scales with the animal

  // ground shadow — an oval, never a bar
  g.save(); g.fillStyle="rgba(0,0,0,0.07)";
  g.beginPath(); g.ellipse(cx, groundY+2, U*0.85, U*0.11, 0,0,TAU); g.fill(); g.restore();

  /* foot targets: walk cycle + gallop + balk */
  const sw = U*0.26;
  const foot = (rootX, k, front)=>{
    const a = ph + k;
    let fx = rootX + dir*Math.sin(a)*sw*gait;
    let fy = groundY - Math.max(0, Math.sin(a))*U*0.10*gait;
    if (bound>0){                                   // frozen bound: fore out, hind back
      fx = rootX + dir*(front ? 1 : -1)*U*0.52*bound;
      fy = groundY - U*0.06*bound;
    }
    if (brace>0 && front){ fx = rootX + dir*U*0.42*brace; fy = groundY; }
    if (brace>0 && !front){ fx = rootX - dir*U*0.20*brace; fy = groundY; }
    return P(fx, fy);
  };
  const hipF = P(shX, bellyF.y), hipR = P(hpX, bellyR.y);

  // ---- FAR pair (behind the barrel) ----
  drawLeg(pen, P(hipF.x - dir*legW*0.5, hipF.y), foot(shX - dir*U*0.10, Math.PI, true),
          legW*0.88, T_LEGF(), dir, 0);
  drawLeg(pen, P(hipR.x - dir*legW*0.5, hipR.y), foot(hpX - dir*U*0.10, Math.PI*1.5, false),
          legW*0.88, T_LEGF(), -dir, 0);

  // ---- TAIL (behind the barrel) ----
  const tb = P(hpX - dir*U*0.16, gY - back*(S.croupY - 0.06));
  if (S.tail === "curl"){
    pen.ink(()=>{
      g.moveTo(tb.x, tb.y);
      g.bezierCurveTo(tb.x - dir*U*0.26, tb.y - U*0.10, tb.x - dir*U*0.02, tb.y - U*0.26,
                      tb.x - dir*U*0.20, tb.y - U*0.28);
      g.bezierCurveTo(tb.x - dir*U*0.32, tb.y - U*0.29, tb.x - dir*U*0.28, tb.y - U*0.13,
                      tb.x - dir*U*0.13, tb.y - U*0.15);
    }, Math.max(2.4, U*0.05));
  } else if (S.tail === "flag"){
    pen.ink(()=>{ g.moveTo(tb.x, tb.y);
      g.quadraticCurveTo(tb.x - dir*U*0.24, tb.y - U*0.20, tb.x - dir*U*0.32, tb.y - U*0.32); },
      Math.max(2.6, U*0.075));
  } else {                                          // whisk with a tuft
    const tipx = tb.x - dir*U*0.16, tipy = tb.y + back*0.70;
    pen.ink(()=>{ g.moveTo(tb.x, tb.y);
      g.quadraticCurveTo(tb.x - dir*U*0.20, tb.y + back*0.34, tipx, tipy); }, Math.max(2.6, U*0.062));
    pen.paint(()=>{ g.ellipse(tipx - dir*U*0.02, tipy + U*0.08, U*0.075, U*0.13, 0,0,TAU); },
      T_MASS(), CW*0.62);
  }

  // ---- NECK: chest -> head, a tapering plane. Drawn BEFORE the barrel so its
  //      root contour is buried under the body instead of cutting across it. ----
  strip(pen, P(chest.x - dir*U*0.10, chest.y + back*0.06),
             P(HC.x - dir*hr*0.34, HC.y + hr*0.26),
        hr*(sp==="ox" ? 1.70 : sp==="swine" ? 1.25 : 1.15),
        hr*(sp==="ox" ? 1.10 : sp==="swine" ? 0.95 : 0.82), T_HIDE(), CW*0.92);
  if (S.dewlap){                                    // hanging dewlap fold (ox)
    pen.paint(()=>{
      g.moveTo(chest.x, chest.y + back*0.02);
      g.quadraticCurveTo(lerp(chest.x, HC.x, 0.55) + dir*U*0.10, lerp(chest.y, HC.y, 0.45) + back*0.34,
                         HC.x - dir*hr*0.34, HC.y + hr*0.60);
      g.lineTo(HC.x - dir*hr*0.62, HC.y + hr*0.18);
      g.quadraticCurveTo(lerp(chest.x, HC.x, 0.5), lerp(chest.y, HC.y, 0.5),
                         chest.x - dir*U*0.04, chest.y - back*0.06);
      g.closePath();
    }, T_HIDE(), CW*0.75);
  }

  // ---- BARREL ----
  pen.paint(()=>{
    g.moveTo(rump.x, rump.y);
    g.quadraticCurveTo(croup.x - dir*U*0.12, croup.y - back*0.08, croup.x, croup.y);
    g.quadraticCurveTo(lerp(croup.x, wither.x, 0.5), lerp(croup.y, wither.y, 0.5) + back*S.sag,
                       wither.x, wither.y);
    g.quadraticCurveTo(wither.x + dir*U*0.24, wither.y + back*0.08, chest.x, chest.y);
    g.quadraticCurveTo(chest.x + dir*U*0.06, chest.y + back*0.22, bellyF.x, bellyF.y);
    g.quadraticCurveTo(lerp(bellyF.x, bellyR.x, 0.5), gY - back*(S.bellyY - 0.07), bellyR.x, bellyR.y);
    g.quadraticCurveTo(rump.x + dir*U*0.08, rump.y + back*0.14, rump.x, rump.y);
    g.closePath();
  }, T_HIDE(), CW*1.15);
  // haunch mass + pale underline — FILL ONLY (a stroke here would draw a false
  // seam across the barrel; ctx ignores lineWidth=0, so never rely on lw:0)
  pen.fillPath(()=>{ g.ellipse(hpX + dir*U*0.02, gY - back*0.70, U*0.30, back*0.22, 0,0,TAU); },
               inkLevel(3));
  pen.fillPath(()=>{ g.ellipse(cx + dir*U*0.06, gY - back*(S.bellyY + 0.09), U*0.58, back*0.11, 0,0,TAU); },
               inkLevel(1));

  // ---- HEAD ----
  HEADS[sp](pen, HC, hr, dir, o);

  // ---- NEAR pair (over the barrel) ----
  drawLeg(pen, P(hipF.x + dir*legW*0.5, hipF.y), foot(shX + dir*U*0.06, 0, true),
          legW, T_LEGN(), dir, gait*0.3);
  drawLeg(pen, P(hipR.x + dir*legW*0.5, hipR.y), foot(hpX + dir*U*0.06, Math.PI*0.5, false),
          legW, T_LEGN(), -dir, gait*0.3);

  return G;
}

/* ============================================================
   SEVEN-SEGMENT NUMERALS — counts are GEOMETRY, never small type.
   ============================================================ */
const SEG = { 0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
              4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1], 6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
              8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1] };
function segDigit(pen, d, x, y, w, h, t){
  const g = pen.ctx, s = SEG[d] || SEG[0], hh = h/2;
  const bar = (bx,by,bw,bh)=> pen.paint(()=>{ g.rect(bx,by,bw,bh); }, T_BAR(), 1.4);
  if (s[0]) bar(x, y, w, t);                    // a
  if (s[1]) bar(x+w-t, y, t, hh);               // b
  if (s[2]) bar(x+w-t, y+hh, t, hh);            // c
  if (s[3]) bar(x, y+h-t, w, t);                // d
  if (s[4]) bar(x, y+hh, t, hh);                // e
  if (s[5]) bar(x, y, t, hh);                   // f
  if (s[6]) bar(x, y+hh-t/2, w, t);             // g
}
function segNumber(pen, n, x, y, w, h, t, gap){
  const str = String(Math.max(0, n|0)).padStart(2,"0");
  [...str].forEach((c,i)=> segDigit(pen, +c, x + i*(w+gap), y, w, h, t));
}

/* a small bold species glyph — abstract, blocky, survives the dot lattice */
function speciesGlyph(pen, sp, cx, cy, r){
  const g = pen.ctx, tone = toneSolid(inkLevel(6));
  if (sp === "swine"){
    pen.paint(()=>{ g.ellipse(cx - r*0.16, cy, r*0.78, r*0.56, 0,0,TAU); }, tone, 2.4);
    pen.paint(()=>{ g.ellipse(cx + r*0.66, cy + r*0.08, r*0.26, r*0.30, 0,0,TAU); }, tone, 2.2);
    pen.paint(()=>{ g.moveTo(cx - r*0.10, cy - r*0.44); g.lineTo(cx + r*0.34, cy - r*0.88);
                    g.lineTo(cx + r*0.40, cy - r*0.34); g.closePath(); }, tone, 2.2);
  } else if (sp === "goat"){
    pen.paint(()=>{ g.moveTo(cx - r*0.70, cy - r*0.40); g.lineTo(cx + r*0.62, cy - r*0.28);
                    g.lineTo(cx + r*0.30, cy + r*0.80); g.lineTo(cx - r*0.46, cy + r*0.52);
                    g.closePath(); }, tone, 2.4);
    pen.ink(()=>{ g.moveTo(cx - r*0.46, cy - r*0.46); g.quadraticCurveTo(cx - r*1.00, cy - r*1.10, cx - r*0.20, cy - r*1.02);
                  g.moveTo(cx - r*0.02, cy - r*0.44); g.quadraticCurveTo(cx - r*0.60, cy - r*1.12, cx + r*0.20, cy - r*0.98); }, 3.2);
  } else {
    pen.paint(()=>{ g.rect(cx - r*0.66, cy - r*0.34, r*1.30, r*1.06); }, tone, 2.4);
    pen.ink(()=>{ g.moveTo(cx - r*0.62, cy - r*0.40); g.quadraticCurveTo(cx - r*1.20, cy - r*1.20, cx - r*0.30, cy - r*1.06);
                  g.moveTo(cx + r*0.62, cy - r*0.40); g.quadraticCurveTo(cx + r*1.20, cy - r*1.20, cx + r*0.30, cy - r*1.06); }, 3.4);
  }
}

/* ============================================================
   THE COURT — gate + broken wall blocks + tally plates.
   Every span is BROKEN: no rule crosses the frame.
   ============================================================ */
const GATE = { mouth:{x0:.465,x1:.535,y0:.122,y1:.262}, pierY0:.108, baseY:.262 };

function drawCourt(pen, W, H, tally){
  const g = pen.ctx;
  const R = (x0,y0,x1,y1)=>({ x:x0*W, y:y0*H, w:(x1-x0)*W, h:(y1-y0)*H });

  // ---- broken court wall, only LEFT of the gate (two separate blocks; the
  //      right-hand span is deliberately absent so nothing bars the frame) ----
  const blocks = [ [.300,.196,.408,.262], [.592,.184,.706,.262] ];
  blocks.forEach((b,i)=>{
    const r = R(b[0],b[1],b[2],b[3]);
    pen.paint(()=>{ g.rect(r.x, r.y, r.w, r.h); }, T_WALL(), 5);
    pen.paint(()=>{ g.rect(r.x - W*0.008, r.y - H*0.011, r.w + W*0.016, H*0.013); }, T_COPE(), 3.4);
    pen.seam(()=>{ g.moveTo(r.x + r.w*0.14, r.y + r.h*0.52);
                   g.lineTo(r.x + r.w*0.86, r.y + r.h*0.52); }, 2);
  });

  // ---- gate: two piers, a dark mouth, a lintel slab, a broken sill ----
  const mo = GATE.mouth;
  pen.paint(()=>{ g.rect(mo.x0*W, mo.y0*H, (mo.x1-mo.x0)*W, (mo.y1-mo.y0)*H); }, T_MOUTHG(), 5);
  [[.408,.465],[.535,.592]].forEach(p=>{
    pen.paint(()=>{ g.rect(p[0]*W, GATE.pierY0*H, (p[1]-p[0])*W, (GATE.baseY-GATE.pierY0)*H); },
              T_PIER(), 5);
    pen.paint(()=>{ g.rect((p[0]-.011)*W, (GATE.pierY0-.015)*H, (p[1]-p[0]+.022)*W, H*0.016); },
              T_COPE(), 3.4);
  });
  pen.paint(()=>{ g.rect(.386*W, .074*H, .228*W, .030*H); }, T_LINT(), 5);
  // sill: two short blocks under the doorway, with a gap
  pen.paint(()=>{ g.rect(.396*W, .262*H, .086*W, .016*H); }, T_LINT(), 3.4);
  pen.paint(()=>{ g.rect(.500*W, .262*H, .098*W, .016*H); }, T_LINT(), 3.4);

  // ---- tally plates, top-right (the label owns the top-left corner) ----
  const dw = W*0.044, dh = H*0.038, dt = Math.max(8, W*0.013), dgap = W*0.014;
  ["swine","goat","ox"].forEach((sp,i)=>{
    const y = (0.072 + i*0.054)*H;
    pen.paint(()=>{ g.rect(0.742*W, y - H*0.008, 0.212*W, dh + H*0.016); }, T_PLATE(), 3.2);
    speciesGlyph(pen, sp, 0.782*W, y + dh*0.52, W*0.028);
    segNumber(pen, tally[sp], 0.834*W, y, dw, dh, dt, dgap);
  });
}

/* ============================================================
   ROUTES — three tapering lanes on the diagonal, each with its own entry,
   converging on the gate mouth. Lanes carry hoof prints.
   ============================================================ */
const LANES = {
  swine: { apex:P(.440,.262), base:P(.150,1.00), us:[.38,.82], dir:+1, u0:.090, u1:.155 },
  goat:  { apex:P(.490,.258), base:P(.545,1.04), us:[.26,.74], dir:-1, u0:.088, u1:.150 },
  ox:    { apex:P(.645,.262), base:P(.885,.850), us:[.48,.82], dir:-1, u0:.108, u1:.160 },
};
const laneAt = (L,u)=> P(lerp(L.apex.x,L.base.x,u), lerp(L.apex.y,L.base.y,u));
const laneU  = (L,u)=> lerp(L.u0, L.u1, u);

function drawLane(pen, W, H, L, seed){
  const g = pen.ctx;
  const a = P(L.apex.x*W, L.apex.y*H), b = P(L.base.x*W, L.base.y*H);
  const dx = b.x-a.x, dy = b.y-a.y, len = Math.hypot(dx,dy) || 1;
  const nx = -dy/len, ny = dx/len;
  const w0 = W*0.014, w1 = W*0.086;
  pen.paint(()=>{
    g.moveTo(a.x + nx*w0, a.y + ny*w0);
    g.lineTo(b.x + nx*w1, b.y + ny*w1);
    g.lineTo(b.x - nx*w1, b.y - ny*w1);
    g.lineTo(a.x - nx*w0, a.y - ny*w0);
    g.closePath();
  }, T_LANE(), 3.2);
  // dashed axis — only along the lower reach, so the convergence stays clear
  g.save(); g.setLineDash([H*0.013, H*0.036]);
  pen.ink(()=>{ g.moveTo(lerp(a.x,b.x,0.56), lerp(a.y,b.y,0.56)); g.lineTo(b.x,b.y); }, 2.0);
  g.setLineDash([]); g.restore();
  // cloven hoof prints tracking up the lane
  for (let i=0;i<5;i++){
    const u = 0.14 + i*0.185;
    const p = P(lerp(a.x,b.x,u), lerp(a.y,b.y,u));
    const hw = lerp(w0,w1,u)*0.46*((i+seed)%2 ? 1 : -1);
    const s = lerp(W*0.008, W*0.016, u);
    const px = p.x + nx*hw, py = p.y + ny*hw;
    pen.paint(()=>{ g.rect(px - s*0.9, py - s*0.5, s*0.72, s*1.0); }, T_PRINT(), 1.6);
    pen.paint(()=>{ g.rect(px + s*0.18, py - s*0.5, s*0.72, s*1.0); }, T_PRINT(), 1.6);
  }
}

/* ============================================================
   PLACEMENT — deterministic drove layout per state.
   ============================================================ */
function drove(state, W, H){
  const out = [];
  const push = (sp, L, u, o)=>{
    const p = laneAt(L,u);
    out.push({ sp, x:p.x*W, y:p.y*H, U:laneU(L,u)*W, dir:L.dir, ...o });
  };
  const walking = { gait:1 };

  if (state === "massed"){
    // every drove converged into one bunch inside the court
    const arc = [
      ["goat", .360,.470,.084,+1, 0.6, 0.55],
      ["ox",   .720,.520,.112,-1, 3.1, 0.00],
      ["swine",.220,.640,.112,+1, 5.1, 0.45],
      ["goat", .560,.700,.110,-1, 2.2, 0.15],
      ["ox",   .850,.800,.142,-1, 1.4, 0.10],
      ["swine",.330,.900,.132,+1, 2.7, 0.60],
      ["goat", .640,.960,.118,-1, 4.0, 0.00],
    ];
    arc.forEach(([sp,x,y,u,d,ph,hd],i)=> out.push({ sp, x:x*W, y:y*H, U:u*W, dir:d,
      gait:0.3, phase:ph, headDrop:hd, alert:0.6, beard:(i===3),
      gaze:(i%2?0.4:-0.3) }));
    return out;
  }

  const balk = state === "balking";
  const K = (i)=> balk
    ? { gait:0, brace:1, jaw:1, headDrop:0, alert:1, gaze:(i%2?0.6:-0.6), phase:0 }
    : { ...walking };

  push("swine", LANES.swine, .38, { ...K(0), phase:0.4, headDrop:balk?0:0.10, alert:balk?1:0.3 });
  push("swine", LANES.swine, .82, { ...K(1), phase:3.1, headDrop:balk?0:0.30, alert:balk?1:0.5,
                                    jaw:balk?1:0 });
  // one straggler rooting off-lane, in the gap between the swine and goat routes
  out.push({ sp:"swine", x:.372*W, y:.944*H, U:.066*W, dir:+1,
             gait:balk?0:0.3, phase:1.7, headDrop:balk?0:0.95, brace:balk?1:0,
             jaw:balk?1:0, alert:balk?1:0.2 });

  push("goat", LANES.goat, .26,{ ...K(2), phase:1.1, alert:balk?1:0.5 });
  push("goat", LANES.goat, .74, { ...K(3), phase:3.3, alert:balk?1:0.6, beard:true,
                                  jaw:balk?1:0.35 });

  push("ox", LANES.ox, .48, { ...K(4), phase:0.9, alert:balk?1:0.4, headDrop:balk?0:0.10 });
  push("ox", LANES.ox, .82, { ...K(5), phase:4.9, alert:balk?1:0.7, jaw:balk?1:0.5,
                              bound:balk?0.8:0 });
  return out;
}

/* dashed collision hull + anchor cross for the survey (rig) state */
function drawHull(pen, b){
  const g = pen.ctx, S = SP[b.sp];
  const w = b.U*S.hull.w, h = b.U*S.hull.h;
  g.save();
  g.setLineDash([7,6]); g.strokeStyle=INK; g.lineWidth=2;
  g.strokeRect(b.x - w/2, b.y - h, w, h);
  g.setLineDash([]);
  g.beginPath(); g.moveTo(b.x-9, b.y); g.lineTo(b.x+9, b.y);
  g.moveTo(b.x, b.y-9); g.lineTo(b.x, b.y+9); g.stroke();
  g.restore();
}

/* ============================================================
   THE DRAW
   ============================================================ */
function drawAll(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const st = state.pose || state.state || "arriving";
  const P0 = asset.params;

  // routes first (they are the ground)
  if (st !== "massed"){
    drawLane(pen, W, H, LANES.swine, 0);
    drawLane(pen, W, H, LANES.goat, 1);
    drawLane(pen, W, H, LANES.ox, 0);
  } else {
    // massed: a single short apron of prints under the gate, still broken
    drawLane(pen, W, H, { apex:P(.500,.268), base:P(.500,.500), u0:.05,u1:.09 }, 0);
  }

  // the court the droves are arriving at
  drawCourt(pen, W, H, P0.tally);

  // the beasts, far (high) first
  const beasts = drove(st, W, H).sort((a,b)=> a.y - b.y);
  for (const b of beasts){
    ctx.save();
    drawBeast(pen, b.sp, b.x, b.y, b.U, b.dir, b);
    ctx.restore();
  }

  if (st === "survey") beasts.forEach(b=> drawHull(pen, b));

  // ACCENT (semantic, prints as a dark mark): the beast picked out first for
  // the altar — the lead ox of the cattle route.
  if (P0.marked !== false){
    const lead = beasts.filter(b=>b.sp==="ox").sort((a,b)=> b.U - a.U)[0];
    if (lead){
      const g = ctx; g.save();
      g.beginPath(); g.moveTo(lead.x, lead.y - lead.U*1.62);
      g.lineTo(lead.x - lead.U*0.17, lead.y - lead.U*1.94);
      g.lineTo(lead.x + lead.U*0.17, lead.y - lead.U*1.94); g.closePath();
      g.fillStyle=ACCENT; g.fill();
      g.strokeStyle=ACCENT; g.lineWidth=3.2;
      g.beginPath(); g.moveTo(lead.x, lead.y - lead.U*1.94);
      g.lineTo(lead.x, lead.y - lead.U*2.24); g.stroke();
      g.restore();
    }
  }

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"creature.festival-livestock",
  type:"CREATURE",
  name:"Festival livestock",
  statusWord:"ARRIVING",
  scene:"OD-B20-S03",

  params:{
    species:["swine","goat","ox"],   // one rig, three species reshapes
    tally:{ swine:3, goat:12, ox:6 },// drove counts, drawn as seven-segment geometry
    seed:2003,
    routes:3,                        // three separate approaches to the one gate
    marked:true,                     // the lead ox carried to the altar first
    hides:"light",                   // hides print at ink level 2 — paper stays open
    hull:{ swine:{w:2.30,h:1.10}, goat:{w:2.10,h:1.75}, ox:{w:2.40,h:1.90} }, // body units
  },
  layers:["routes","hoof-prints","court-wall","gate-piers","gate-mouth","lintel",
          "tally-plates","beast-shadows","far-legs","tails","barrels","necks","heads",
          "near-legs","collision-hulls","mark"],
  anchors:{
    "gate:mouth":{x:.50,y:.33},
    "gate:lintel":{x:.50,y:.10},
    "route:swine":{x:.16,y:.98},
    "route:goat":{x:.55,y:.99},
    "route:ox":{x:.90,y:.86},
    "lead:swine":{x:.35,y:.52},
    "lead:goat":{x:.52,y:.49},
    "lead:ox":{x:.68,y:.47},
    "drover:swine":{x:.09,y:.90},
    "drover:goat":{x:.66,y:.94},
    "drover:ox":{x:.97,y:.78},
    "tally:plates":{x:.18,y:.13},
    "camera:court":{x:.50,y:.56},
  },
  zones:{
    "lane:swine":{ x0:.03,y0:.30,x1:.46,y1:1.0 },
    "lane:goat":{  x0:.42,y0:.29,x1:.68,y1:1.0 },
    "lane:ox":{    x0:.55,y0:.30,x1:1.0,y1:.96 },
    "gate:throat":{x0:.45,y0:.14,x1:.55,y1:.33 },
    walkable:{     x0:.03,y0:.33,x1:1.0,y1:1.0 },
  },
  states:{
    initial:"arriving",
    nodes:{
      arriving:{ preview:{ pose:"arriving", progress:.28 } },   // neutral: three files on three routes
      massed:{   preview:{ pose:"massed",   progress:.62 } },   // converged, bunched at the gate
      balking:{  preview:{ pose:"balking",  progress:.84 } },   // extreme: braced, heads up, jaws open
      survey:{   preview:{ pose:"survey",   progress:.14 } },   // the rig: collision hulls + anchors
    },
    edges:[
      ["arriving","massed"],["massed","arriving"],
      ["arriving","balking"],["balking","arriving"],
      ["massed","balking"],["balking","massed"],
      ["arriving","survey"],["survey","arriving"],
    ],
  },
  channels:["pose","gait","phase","bound","brace","headDrop","gaze","jaw","alert","route","t"],

  preview:()=>({ pose:"arriving", status:"ARRIVING", progress:.28 }),
  draw(ctx,W,H,state){ return drawAll(ctx,W,H,state); },
};
export default asset;
