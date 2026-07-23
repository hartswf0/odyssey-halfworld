/* creature.wild-goats — a herd of wild mountain goats.
   CREATURE asset (quadruped, NOT humanoid): fully custom geometry on engine
   primitives. One reusable GOAT template drawn N times to make a small herd:
   slender agile body, four cloven legs (upper/lower segments + a split hoof),
   a short upturned tail, a wedge Roman-nosed head with an eye + ear, a hanging
   BEARD tuft under the chin, and a pair of long backward-sweeping ridged HORNS
   — the reads that separate a wild goat from the sacrificial bulls. Members are
   placed and posed deterministically so the herd is one composition, never a
   flattened illustration. States: graze / alarm / run / hunted / kill (a fallen
   goat with a spear) / carcass (a limp goat slung over a carry-pole). Legs carry
   simple foot targets so a frozen gallop reads in RUN. Drawn in SOLID grays +
   hard contour; the engine POST pass supplies the dot-matrix halftone — do NOT
   pre-dither.
   Atlas: OD-B09-S04 — herd grazing, alarm, running, hunting, kill, carried-carcass. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});

/* ---- tone levels (flat grays; POST turns them into dots).
   Goats read LIGHTER than the black bulls so the silhouette stays crisp and the
   dark horns/hooves pop. ---- */
const T_BODY   = ()=> toneSolid(inkLevel(3));   // tan hide
const T_BELLY  = ()=> toneSolid(inkLevel(2));   // pale underbelly
const T_NECK   = ()=> toneSolid(inkLevel(3));
const T_HEAD   = ()=> toneSolid(inkLevel(3));
const T_MUZZLE = ()=> toneSolid(inkLevel(2));
const T_NEARLEG= ()=> toneSolid(inkLevel(4));
const T_FARLEG = ()=> toneSolid(inkLevel(5));
const T_HOOF   = ()=> toneSolid(inkLevel(6));   // hard split hoof
const T_HORN   = ()=> toneSolid(inkLevel(5));   // dark ridged horn
const T_HORNFAR= ()=> toneSolid(inkLevel(4));
const T_BEARD  = ()=> toneSolid(inkLevel(5));
const T_EAR    = ()=> toneSolid(inkLevel(4));
const T_TAIL   = ()=> toneSolid(inkLevel(4));
const T_SPEAR  = ()=> toneSolid(inkLevel(6));
const T_POLE   = ()=> toneSolid(inkLevel(6));

/* one slender cloven leg: two segments + a split hoof block */
function drawLeg(pen, hip, knee, foot, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.80);
  // split (cloven) hoof: two small dark blocks
  pen.paint(()=>{ g.rect(foot.x - w*0.62, foot.y - w*0.10, w*0.52, w*0.50); }, T_HOOF(), 3);
  pen.paint(()=>{ g.rect(foot.x + w*0.10, foot.y - w*0.10, w*0.52, w*0.50); }, T_HOOF(), 3);
}

/* long backward-sweeping ridged horn (the wild-goat read). off nudges the pair
   apart; tone/lw distinguish near vs far horn. */
function drawHorn(pen, HC, hr, dir, off, tone, lw){
  const g = pen.ctx;
  const base = P(HC.x - dir*hr*0.10 + off, HC.y - hr*0.72);
  const tip  = P(HC.x - dir*hr*2.35 + off, HC.y - hr*0.85);
  pen.paint(()=>{
    g.moveTo(base.x + dir*hr*0.34, base.y);                                  // front of base
    g.quadraticCurveTo(HC.x - dir*hr*1.05 + off, HC.y - hr*1.95,             // arc up & back
                       tip.x, tip.y);                                        // to tip
    g.quadraticCurveTo(HC.x - dir*hr*1.30 + off, HC.y - hr*1.15,             // under-curve back
                       base.x - dir*hr*0.18, base.y - hr*0.10);              // to back of base
    g.quadraticCurveTo(HC.x - dir*hr*0.20 + off, HC.y - hr*0.42,            // base cap
                       base.x + dir*hr*0.34, base.y);
    g.closePath();
  }, tone, lw);
  // ridge ticks along the sweep
  pen.ink(()=>{
    for(let i=1;i<=4;i++){
      const f = i/5;
      const x = lerp(base.x, tip.x, f) - dir*hr*0.08;
      const y = lerp(base.y, HC.y - hr*1.7, Math.sin(f*Math.PI))*0 + lerp(base.y-hr*0.2, tip.y, f) - hr*0.35*Math.sin(f*Math.PI);
      g.moveTo(x - dir*hr*0.16, y);
      g.lineTo(x + dir*hr*0.16, y + hr*0.12);
    }
  }, 2);
}

/* the goat HEAD: wedge Roman-nosed skull, eye, ear, hanging beard, two horns.
   gaze tips the eye/ear for the alarm read. */
function drawHead(pen, HC, hr, dir, { gaze=0, alert=0 }={}){
  const g = pen.ctx;

  // ---- FAR horn first (behind skull) ----
  drawHorn(pen, HC, hr, dir, -dir*hr*0.16, T_HORNFAR(), 3.5);

  // ---- ear (swings up when alert, back when calm) ----
  const earA = lerp(0.5, -0.2, alert);
  pen.paint(()=>{
    const bx = HC.x - dir*hr*0.30, by = HC.y - hr*0.10;
    g.moveTo(bx, by);
    g.quadraticCurveTo(bx - dir*hr*0.9, by - hr*(0.2+earA*0.9), bx - dir*hr*0.95, by + hr*(0.35-earA*0.5));
    g.quadraticCurveTo(bx - dir*hr*0.4, by + hr*0.2, bx, by + hr*0.15);
    g.closePath();
  }, T_EAR(), 3);

  // ---- wedge head: forehead -> long straight muzzle -> jaw ----
  pen.paint(()=>{
    g.moveTo(HC.x - dir*hr*0.42, HC.y - hr*0.70);                  // poll (top back)
    g.quadraticCurveTo(HC.x + dir*hr*0.55, HC.y - hr*0.62,         // brow
                       HC.x + dir*hr*1.05, HC.y - hr*0.18);        // nose bridge
    g.quadraticCurveTo(HC.x + dir*hr*1.62, HC.y + hr*0.12,         // Roman-nose muzzle
                       HC.x + dir*hr*1.55, HC.y + hr*0.52);        // nose tip
    g.quadraticCurveTo(HC.x + dir*hr*1.40, HC.y + hr*0.78,         // lower lip
                       HC.x + dir*hr*0.95, HC.y + hr*0.80);        // chin
    g.quadraticCurveTo(HC.x + dir*hr*0.10, HC.y + hr*0.92,         // jaw line
                       HC.x - dir*hr*0.30, HC.y + hr*0.45);        // throat
    g.closePath();
  }, T_HEAD(), 4);

  // pale muzzle patch
  pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.85, HC.y - hr*0.05);
    g.quadraticCurveTo(HC.x + dir*hr*1.62, HC.y + hr*0.14, HC.x + dir*hr*1.55, HC.y + hr*0.52);
    g.quadraticCurveTo(HC.x + dir*hr*1.42, HC.y + hr*0.74, HC.x + dir*hr*1.02, HC.y + hr*0.62);
    g.quadraticCurveTo(HC.x + dir*hr*0.82, HC.y + hr*0.30, HC.x + dir*hr*0.85, HC.y - hr*0.05);
    g.closePath();
  }, T_MUZZLE(), 3);

  // ---- hanging BEARD tuft under the chin ----
  pen.paint(()=>{
    const bx = HC.x + dir*hr*0.80, by = HC.y + hr*0.74;
    g.moveTo(bx - dir*hr*0.22, by);
    g.lineTo(bx + dir*hr*0.20, by);
    g.quadraticCurveTo(bx + dir*hr*0.12, by + hr*1.05, bx - dir*hr*0.04, by + hr*1.15);
    g.quadraticCurveTo(bx - dir*hr*0.20, by + hr*0.7, bx - dir*hr*0.22, by);
    g.closePath();
  }, T_BEARD(), 3);

  // ---- NEAR horn (over skull, bolder) ----
  drawHorn(pen, HC, hr, dir, dir*hr*0.02, T_HORN(), 4);

  // ---- eye + nostril + mouth line ----
  const eye = P(HC.x + dir*hr*0.55, HC.y - hr*0.12 + gaze*hr*0.2);
  g.fillStyle = INK; g.beginPath(); g.ellipse(eye.x, eye.y, hr*0.12, hr*0.15, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(HC.x + dir*hr*1.48, HC.y + hr*0.40, hr*0.09, hr*0.07, 0.3*dir, 0, 7); g.fill();
  pen.ink(()=>{ g.moveTo(HC.x + dir*hr*1.50, HC.y + hr*0.55);
                g.lineTo(HC.x + dir*hr*1.15, HC.y + hr*0.66); }, 2.2);
}

/* ONE goat template. Poses via opts:
     headDrop 0..1  (0 head raised/alert, 1 grazing to ground)
     alert    0..1  (ear/gaze tension)
     gallop   0..1  (frozen bound: legs splayed fore/aft, body lifted)
     gsc            member scale
     t              phase (subtle idle sway)  */
function drawGoat(pen, cx, groundY, S, dir, opts={}){
  const g = pen.ctx;
  const gsc = opts.gsc ?? 1.0;
  const headDrop = opts.headDrop ?? 0;
  const alert = opts.alert ?? 0;
  const gallop = opts.gallop ?? 0;
  const t = opts.t || 0;

  const U = S*0.20*gsc;
  const back = S*0.155*gsc;                 // withers height above ground
  const lift = gallop*back*0.16;            // running goat clears the ground
  const gY = groundY - lift;

  const shoulderX = cx + dir*U*0.40;
  const hipX      = cx - dir*U*0.46;

  // idle breath / bob
  const bob = Math.sin(t*2 + cx*0.01)*back*0.01;

  // ---- ground shadow ----
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+4, U*0.78, U*0.13, 0, 0, 7); g.fill(); g.restore();

  // ---- short upturned TAIL ----
  const tb = P(hipX - dir*U*0.10, gY - back*0.92 + bob);
  const tt = P(hipX - dir*U*0.02, gY - back*1.12 + bob);   // flicks up
  pen.limb(()=>{ g.moveTo(tb.x,tb.y);
    g.quadraticCurveTo(hipX - dir*U*0.16, gY - back*1.02, tt.x, tt.y); }, T_TAIL(), U*0.06);

  // ---- leg foot targets (frozen gallop reaches fore/aft) ----
  const fFoot = gallop ? dir*U*0.62 : 0;    // front legs reach forward
  const rFoot = gallop ? -dir*U*0.58 : 0;   // rear legs reach back
  const kneeBend = gallop ? U*0.10 : 0;

  // ---- FAR legs (drawn first, deeper tone, slightly inset) ----
  const foff = dir*U*0.05;
  drawLeg(pen, P(shoulderX-foff, gY-back*0.62+bob), P(shoulderX-foff+dir*U*0.02+kneeBend, gY-back*0.30),
          P(shoulderX-foff+fFoot*0.8, gY), U*0.085, T_FARLEG());
  drawLeg(pen, P(hipX-foff, gY-back*0.62+bob), P(hipX-foff+dir*U*0.02-kneeBend, gY-back*0.30),
          P(hipX-foff+rFoot*0.8, gY), U*0.085, T_FARLEG());

  // ---- torso key points ----
  const wither = P(shoulderX + dir*U*0.02, gY - back*1.00 + bob);
  const croup  = P(hipX + dir*U*0.04,      gY - back*0.98 + bob);
  const rump   = P(hipX - dir*U*0.18,      gY - back*0.66 + bob);
  const bellyR = P(hipX + dir*U*0.06,      gY - back*0.42);
  const bellyF = P(shoulderX - dir*U*0.04, gY - back*0.40);
  const chest  = P(shoulderX + dir*U*0.28, gY - back*0.58);

  // ---- torso body ----
  pen.paint(()=>{
    g.moveTo(chest.x, chest.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.18, wither.y - back*0.02, wither.x, wither.y); // chest -> withers
    g.quadraticCurveTo(cx + dir*U*0.02, gY - back*1.02 + bob, croup.x, croup.y);          // level back
    g.quadraticCurveTo(hipX - dir*U*0.16, croup.y + back*0.04, rump.x, rump.y);           // croup -> rump
    g.quadraticCurveTo(hipX - dir*U*0.04, bellyR.y, bellyR.x, bellyR.y);                  // rump -> belly rear
    g.quadraticCurveTo(cx, bellyR.y + back*0.10, bellyF.x, bellyF.y);                     // deep tucked belly
    g.quadraticCurveTo(shoulderX + dir*U*0.12, bellyF.y - back*0.02, chest.x, chest.y);   // brisket -> chest
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- pale underbelly band ----
  pen.paint(()=>{ g.ellipse(cx + dir*U*0.02, gY - back*0.44, U*0.52, back*0.16, 0, 0, 7); }, T_BELLY(), 0);

  // ---- neck wedge (rises to the head) ----
  const HCraise = P(shoulderX + dir*U*0.55, gY - back*1.48 + bob);   // head up / alert
  const HCgraze = P(shoulderX + dir*U*0.72, gY - back*0.16);         // nose to ground
  const HC = P(lerp(HCraise.x, HCgraze.x, headDrop), lerp(HCraise.y, HCgraze.y, headDrop));
  const hr = U*0.30;
  pen.paint(()=>{
    g.moveTo(wither.x + dir*U*0.04, wither.y + back*0.02);                                 // crest at withers
    g.quadraticCurveTo(lerp(shoulderX,HC.x,0.5) + dir*U*0.10, lerp(wither.y,HC.y,0.5) - back*0.10,
                       HC.x - dir*hr*0.30, HC.y - hr*0.55);                                // crest -> poll
    g.lineTo(HC.x + dir*hr*0.20, HC.y + hr*0.55);                                          // throat at head
    g.quadraticCurveTo(chest.x + dir*U*0.10, chest.y - back*0.02, chest.x, chest.y);       // throat -> chest
    g.closePath();
  }, T_NECK(), 4.5);

  // ---- head ----
  drawHead(pen, HC, hr, dir, { gaze: alert*0.4 + headDrop*0.3, alert });

  // ---- NEAR legs (over body) ----
  drawLeg(pen, P(shoulderX, gY-back*0.62+bob), P(shoulderX+dir*U*0.03+kneeBend, gY-back*0.30),
          P(shoulderX+fFoot, gY), U*0.10, T_NEARLEG());
  drawLeg(pen, P(hipX, gY-back*0.62+bob), P(hipX+dir*U*0.02-kneeBend, gY-back*0.30),
          P(hipX+rFoot, gY), U*0.10, T_NEARLEG());
}

/* a slain goat lying on its side (KILL): body flat on the ground, four legs
   sticking outward, head down, horns to earth. A hunter's spear lies across it. */
function drawFallenGoat(pen, cx, groundY, S, dir, { spear=1, gsc=1.0 }={}){
  const g = pen.ctx;
  const U = S*0.20*gsc;
  const cy = groundY - U*0.30;

  g.save(); g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, groundY+3, U*1.05, U*0.16, 0, 0, 7); g.fill(); g.restore();

  // legs splayed (drawn under body)
  const leg=(bx,by,ex,ey,w)=>{
    pen.limb(()=>{ g.moveTo(bx,by); g.lineTo(ex,ey); }, T_FARLEG(), w);
    pen.paint(()=>{ g.rect(ex-w*0.5, ey-w*0.2, w*1.0, w*0.5); }, T_HOOF(), 2.5);
  };
  leg(cx+dir*U*0.34, cy+U*0.10, cx+dir*U*0.86, cy-U*0.34, U*0.085);   // upper foreleg
  leg(cx+dir*U*0.40, cy+U*0.16, cx+dir*U*0.72, cy+U*0.46, U*0.075);   // lower foreleg
  leg(cx-dir*U*0.40, cy+U*0.10, cx-dir*U*0.90, cy-U*0.28, U*0.085);   // upper hindleg
  leg(cx-dir*U*0.46, cy+U*0.16, cx-dir*U*0.76, cy+U*0.46, U*0.075);   // lower hindleg

  // limp horizontal body
  pen.paint(()=>{ g.ellipse(cx, cy, U*0.86, U*0.40, 0, 0, 7); }, T_BODY(), 4.5);
  pen.paint(()=>{ g.ellipse(cx, cy+U*0.06, U*0.62, U*0.22, 0, 0, 7); }, T_BELLY(), 0);

  // neck + head slumped to the ground on the front side
  const HC = P(cx + dir*U*0.98, groundY - U*0.14);
  pen.paint(()=>{
    g.moveTo(cx+dir*U*0.60, cy-U*0.16);
    g.quadraticCurveTo(cx+dir*U*0.90, cy+U*0.10, HC.x-dir*U*0.10, HC.y-U*0.10);
    g.lineTo(HC.x-dir*U*0.02, HC.y+U*0.14);
    g.quadraticCurveTo(cx+dir*U*0.66, cy+U*0.28, cx+dir*U*0.50, cy+U*0.14);
    g.closePath();
  }, T_NECK(), 4);
  const hr = U*0.26;
  // slumped head (rotated: muzzle to ground) — reuse a simplified wedge
  pen.paint(()=>{
    g.moveTo(HC.x - dir*hr*0.4, HC.y - hr*0.5);
    g.quadraticCurveTo(HC.x + dir*hr*1.2, HC.y - hr*0.2, HC.x + dir*hr*1.5, HC.y + hr*0.5);
    g.quadraticCurveTo(HC.x + dir*hr*0.9, HC.y + hr*0.9, HC.x - dir*hr*0.2, HC.y + hr*0.6);
    g.closePath();
  }, T_HEAD(), 4);
  // horns sweeping back to the earth
  drawHorn(pen, HC, hr, dir, -dir*hr*0.14, T_HORNFAR(), 3.5);
  drawHorn(pen, HC, hr, dir, dir*hr*0.02, T_HORN(), 4);
  // eye (closed → a short line)
  pen.ink(()=>{ g.moveTo(HC.x+dir*hr*0.35, HC.y-hr*0.05); g.lineTo(HC.x+dir*hr*0.7, HC.y-hr*0.02); }, 2.5);

  // the spear that felled it
  if (spear){
    drawSpear(pen, cx - dir*U*1.1, groundY - U*1.5, cx + dir*U*0.2, cy - U*0.1, U);
  }
}

/* a limp goat slung over a diagonal carry-pole (CARCASS carried off). */
function drawCarriedGoat(pen, cx, groundY, S, dir, { gsc=1.0 }={}){
  const g = pen.ctx;
  const U = S*0.20*gsc;
  const poleY = groundY - U*1.7;                       // shoulder height of an unseen bearer
  // carry pole (diagonal, over the shoulder off-frame)
  pen.limb(()=>{ g.moveTo(cx - dir*U*1.5, groundY - U*0.4);
                 g.lineTo(cx + dir*U*1.4, poleY - U*0.2); }, T_POLE(), U*0.07);

  const bx = cx, by = poleY;                           // body draped over pole midpoint
  // draped body (sagging ellipse)
  pen.paint(()=>{ g.ellipse(bx, by+U*0.18, U*0.78, U*0.42, 0.08*dir, 0, 7); }, T_BODY(), 4.5);
  pen.paint(()=>{ g.ellipse(bx, by+U*0.30, U*0.5, U*0.2, 0, 0, 7); }, T_BELLY(), 0);

  // legs dangling down on the near side (bound together)
  const dangleX = bx + dir*U*0.30;
  for(let i=0;i<2;i++){
    const dx = dangleX + i*dir*U*0.14;
    pen.limb(()=>{ g.moveTo(dx - dir*U*0.02, by+U*0.4);
      g.quadraticCurveTo(dx + dir*U*0.08, by+U*0.9, dx, by+U*1.15); }, T_FARLEG(), U*0.07);
    pen.paint(()=>{ g.rect(dx - U*0.05, by+U*1.12, U*0.10, U*0.14); }, T_HOOF(), 2.5);
  }
  // far-side legs dangling (dimmer)
  const dx2 = bx - dir*U*0.22;
  for(let i=0;i<2;i++){
    const dx = dx2 - i*dir*U*0.12;
    pen.limb(()=>{ g.moveTo(dx, by+U*0.36); g.lineTo(dx - dir*U*0.04, by+U*1.02); }, T_HORNFAR(), U*0.06);
  }
  // binding rope at the pole
  pen.ink(()=>{ for(let k=-1;k<=1;k++){ g.moveTo(bx+k*U*0.12, by-U*0.3); g.lineTo(bx+k*U*0.12, by+U*0.4); } }, 2);

  // head + neck hanging limp down the far side
  const HC = P(bx - dir*U*0.68, by + U*0.62);
  pen.paint(()=>{
    g.moveTo(bx - dir*U*0.30, by - U*0.10);
    g.quadraticCurveTo(bx - dir*U*0.55, by + U*0.25, HC.x + dir*U*0.06, HC.y - U*0.14);
    g.lineTo(HC.x + dir*U*0.18, HC.y + U*0.02);
    g.quadraticCurveTo(bx - dir*U*0.30, by + U*0.28, bx - dir*U*0.14, by + U*0.10);
    g.closePath();
  }, T_NECK(), 4);
  const hr = U*0.24;
  pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.4, HC.y - hr*0.5);
    g.quadraticCurveTo(HC.x - dir*hr*1.2, HC.y - hr*0.1, HC.x - dir*hr*1.5, HC.y + hr*0.6);
    g.quadraticCurveTo(HC.x - dir*hr*0.9, HC.y + hr*0.9, HC.x + dir*hr*0.2, HC.y + hr*0.6);
    g.closePath();
  }, T_HEAD(), 4);
  // horns falling back (here sweeping away, i.e. toward +dir since head is flipped)
  drawHorn(pen, HC, hr, -dir, dir*hr*0.02, T_HORN(), 3.5);
  pen.ink(()=>{ g.moveTo(HC.x-dir*hr*0.3, HC.y-hr*0.05); g.lineTo(HC.x-dir*hr*0.7, HC.y); }, 2.5);
  // beard hanging (now points down under the inverted chin)
  pen.paint(()=>{ g.ellipse(HC.x - dir*hr*0.7, HC.y + hr*0.9, hr*0.22, hr*0.6, 0, 0, 7); }, T_BEARD(), 2.5);
}

/* a thrown/embedded hunting spear: shaft + leaf blade + binding. */
function drawSpear(pen, x0, y0, x1, y1, U){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(x0,y0); g.lineTo(x1,y1); }, T_SPEAR(), U*0.045);
  const ang = Math.atan2(y1-y0, x1-x0);
  const bl = U*0.30;
  const bx = x1, by = y1;
  const px = Math.cos(ang), py = Math.sin(ang), nx = -py, ny = px;
  pen.paint(()=>{
    g.moveTo(bx + px*bl, by + py*bl);
    g.lineTo(bx + nx*bl*0.28, by + ny*bl*0.28);
    g.lineTo(bx - px*bl*0.2, by - py*bl*0.2);
    g.lineTo(bx - nx*bl*0.28, by - ny*bl*0.28);
    g.closePath();
  }, T_SPEAR(), 3);
  // binding ticks near the head
  pen.ink(()=>{ for(let i=1;i<=3;i++){ const f=1-i*0.08; g.moveTo(lerp(x0,x1,f)+nx*U*0.05, lerp(y0,y1,f)+ny*U*0.05);
    g.lineTo(lerp(x0,x1,f)-nx*U*0.05, lerp(y0,y1,f)-ny*U*0.05); } }, 2);
}

/* ================= SCENE ================= */
/* per-state herd layout. Each member: x (0..1), dir, headDrop, alert, gallop, gsc. */
function layoutFor(state){
  const pose = state.pose || "alarm";
  switch(pose){
    case "graze":
      return { goats:[
        {x:0.18, dir:+1, headDrop:1.0, gsc:1.0}, {x:0.44, dir:+1, headDrop:0.9, gsc:0.9},
        {x:0.66, dir:-1, headDrop:1.0, gsc:1.05}, {x:0.86, dir:-1, headDrop:0.8, gsc:0.85},
      ] };
    case "alarm":
      return { goats:[
        {x:0.20, dir:+1, headDrop:0.0, alert:1.0, gsc:1.05}, {x:0.45, dir:+1, headDrop:0.05, alert:0.9, gsc:0.95},
        {x:0.70, dir:-1, headDrop:0.0, alert:1.0, gsc:1.0}, {x:0.88, dir:-1, headDrop:0.1, alert:0.7, gsc:0.8},
      ] };
    case "run":
      return { goats:[
        {x:0.22, dir:+1, headDrop:0.15, gallop:1, gsc:1.05}, {x:0.50, dir:+1, headDrop:0.1, gallop:1, gsc:0.92},
        {x:0.76, dir:+1, headDrop:0.2, gallop:1, gsc:1.0},
      ] };
    case "hunted":
      return { goats:[
        {x:0.30, dir:+1, headDrop:0.15, gallop:1, gsc:1.05}, {x:0.58, dir:+1, headDrop:0.1, gallop:1, gsc:0.95},
        {x:0.82, dir:+1, headDrop:0.05, alert:1.0, gsc:0.9},
      ], spearIn:true };
    case "kill":
      return { goats:[
        {x:0.78, dir:+1, headDrop:0.1, gallop:1, gsc:0.8},   // one fleeing in the distance
      ], fallen:{x:0.36, dir:+1, gsc:1.1} };
    case "carcass":
      return { carried:{x:0.5, dir:+1, gsc:1.15} };
    default:
      return { goats:[ {x:0.30, dir:+1, headDrop:0.0, alert:1.0, gsc:1.1}, {x:0.66, dir:-1, headDrop:0.0, alert:0.9, gsc:1.0} ] };
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const S = Math.min(W, H) * 0.74;
  const groundY = H*0.58;
  const t = state.t || 0;
  const L = layoutFor(state);

  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, groundY+2); ctx.lineTo(W*0.97, groundY+2); ctx.stroke(); ctx.restore();

  // incoming hunting spear (behind the herd)
  if (L.spearIn){
    drawSpear(pen, W*0.02, groundY - S*0.10, W*0.24, groundY - S*0.30, S*0.20);
  }

  // grazing/standing/running herd (far members first for depth: sort by gsc asc)
  if (L.goats){
    const sorted = [...L.goats].sort((a,b)=>(a.gsc||1)-(b.gsc||1));
    for(const m of sorted){
      drawGoat(pen, W*m.x, groundY, S, m.dir, { headDrop:m.headDrop, alert:m.alert, gallop:m.gallop, gsc:m.gsc, t });
    }
  }
  if (L.fallen) drawFallenGoat(pen, W*L.fallen.x, groundY, S, L.fallen.dir, { gsc:L.fallen.gsc });
  if (L.carried) drawCarriedGoat(pen, W*L.carried.x, groundY, S, L.carried.dir, { gsc:L.carried.gsc });
}

export const asset = {
  id:"creature.wild-goats",
  type:"CREATURE",
  name:"Wild goats",
  statusWord:"WILD",
  scene:"OD-B09-S04",

  // procedural knobs
  params:{
    herd:4,               // members available in the herd
    hide:"#b8a884",       // tan goat hide
    hornSweep:1.0,        // 0..1 backward horn length
    beard:true,           // chin beard tuft
    cloven:true,          // split hooves
  },
  // back -> front draw order (per member, layered internally)
  layers:["ground","spear","shadow","tail","far-legs","body","belly","neck",
          "far-horn","ear","head","muzzle","beard","near-horn","eye","near-legs"],
  // normalized 0..1 attention / handling / placement anchors
  anchors:{
    "herd:center":{x:.50,y:.56}, "goat:lead-head":{x:.28,y:.34}, "goat:graze-head":{x:.30,y:.64},
    "goat:kill":{x:.36,y:.62}, "carcass:sling":{x:.50,y:.32}, "carcass:pole":{x:.62,y:.28},
    "hunter:mark":{x:.06,y:.62}, "flee:exit":{x:.96,y:.60}, "camera:herd":{x:.50,y:.52},
  },
  // grazing / pathing footprints for placement + collision
  zones:{
    "herd:graze":{ x0:.08,y0:.58,x1:.92,y1:.84 },
    walkable:{ x0:.04,y0:.62,x1:.96,y1:.90 },
    "cliff:ledge":{ x0:.10,y0:.56,x1:.90,y1:.66 },
  },
  states:{
    initial:"alarm",
    nodes:{
      graze:{   preview:{ pose:"graze",  t:0.3 } },   // herd cropping the ground
      alarm:{   preview:{ pose:"alarm",  t:0.2 } },   // heads up, ears alert
      run:{     preview:{ pose:"run",    t:0.6 } },   // herd bounding away
      hunted:{  preview:{ pose:"hunted", t:0.7 } },   // spear thrown at the fleeing herd
      kill:{    preview:{ pose:"kill",   t:0.9 } },   // a goat down, speared; the rest flee
      carcass:{ preview:{ pose:"carcass",t:0.4 } },   // the kill slung over a carry-pole
    },
    edges:[
      ["graze","alarm"],["alarm","run"],["run","hunted"],
      ["hunted","kill"],["kill","carcass"],["alarm","graze"],["run","graze"],
    ],
  },
  channels:["pose","gaze","alert","gait","headDrop"],

  preview:()=>({ pose:"alarm", t:0.2, status:"WILD", progress:.24 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
