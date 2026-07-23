/* creature.escape-ram-teams — the Cyclops-cave escape rig: rams lashed
   three-abreast with a withy rope harness, a man slung beneath the middle ram.
   CREATURE asset (quadruped, NOT humanoid): fully custom geometry on engine
   primitives. One reusable RAM template — a woolly scalloped-fleece body, short
   dark cloven legs, a blunt dark Roman-nosed face with a floppy ear, and the
   read that makes it a RAM not a ewe: a heavy SPIRAL CURL-HORN coiling beside the
   cheek. Three rams are bound side-by-side (a middle NEAR ram flanked by two set
   back left & right) by a lashed rope/withy harness running over their backs,
   with a belly sling under the middle beast. A hidden HUMAN clings to that middle
   ram's underside — head forward, arms and legs reaching up to grip the fleece
   over the flanks — the concealed anchor Odysseus rode out on. States:
   rope-bound (the empty three-abreast harness) / suspended-human (man slung and
   clinging) / slow-exit (the triplet edging carefully out, man tucked tight) /
   run (bounding clear, man still under) / release (man dropped to the ground,
   ropes loose, rams freed) / herd (the rams unbound, grazing as a flock).
   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B09-S10 — triplets of rams, rope harness, suspended human, slow exit,
   run, release, herd. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;

/* ---- tone levels (flat grays; the POST pass turns them into dots) ----
   Fleece reads LIGHT and cloudy so the dark face / legs / curl-horns / ropes
   pop against it and the silhouette stays crisp. */
const T_FLEECE  = ()=> toneSolid(inkLevel(2));   // woolly white fleece
const T_FLEECE2 = ()=> toneSolid(inkLevel(3));   // shaded underside of fleece
const T_FACE    = ()=> toneSolid(inkLevel(6));   // dark blunt sheep face
const T_MUZZLE  = ()=> toneSolid(inkLevel(5));
const T_EAR     = ()=> toneSolid(inkLevel(5));   // floppy ear
const T_LEGN    = ()=> toneSolid(inkLevel(6));   // near legs (bold)
const T_LEGF    = ()=> toneSolid(inkLevel(4));   // far legs (dimmer)
const T_HOOF    = ()=> toneSolid(inkLevel(7));   // hard cloven hoof
const T_HORN    = ()=> toneSolid(inkLevel(5));   // ram spiral curl-horn (near)
const T_HORNF   = ()=> toneSolid(inkLevel(4));   // far curl-horn
const T_ROPE    = ()=> toneSolid(inkLevel(6));   // withy / rope harness
const T_SKIN    = ()=> toneSolid(inkLevel(4));   // slung man's skin
const T_TUNIC   = ()=> toneSolid(inkLevel(6));   // man's tunic
const T_HAIR    = ()=> toneSolid(inkLevel(7));

/* ---- a woolly scalloped fleece blob (closed lumpy path) ---- */
function woolBlob(g, cx, cy, rx, ry, bumps, seed){
  const pt=[];
  for(let i=0;i<bumps;i++){
    const a = i/bumps*TAU - Math.PI/2;
    const rr = 1 + 0.06*Math.sin(a*3 + seed);
    pt.push(P(cx+Math.cos(a)*rx*rr, cy+Math.sin(a)*ry*rr));
  }
  const mid=(p,n)=>P((p.x+n.x)/2,(p.y+n.y)/2);
  let m0 = mid(pt[bumps-1], pt[0]);
  g.moveTo(m0.x, m0.y);
  for(let i=0;i<bumps;i++){
    const p=pt[i], n=pt[(i+1)%bumps];
    // push the vertex outward so each segment reads as a scalloped tuft
    const cxp = cx + (p.x-cx)*1.14, cyp = cy + (p.y-cy)*1.14;
    const m = mid(p,n);
    g.quadraticCurveTo(cxp, cyp, m.x, m.y);
  }
  g.closePath();
}

/* ---- one short cloven leg: two segments + a split hoof block ---- */
function drawLeg(pen, hip, knee, foot, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.82);
  pen.paint(()=>{ g.rect(foot.x - w*0.60, foot.y - w*0.06, w*0.50, w*0.52); }, T_HOOF(), 2.6);
  pen.paint(()=>{ g.rect(foot.x + w*0.10, foot.y - w*0.06, w*0.50, w*0.52); }, T_HOOF(), 2.6);
}

/* ---- the ram SPIRAL CURL-HORN: an open coil beside the cheek. Drawn as a
   manual double-stroke (thin black rim under a mid-gray band) so the coil reads
   as a clean horn, not a black blob. ---- */
function drawCurlHorn(pen, ox, oy, r0, dir, tone, w){
  const g = pen.ctx;
  const N = 40, turns = 1.02, sweep = TAU*turns, start = -Math.PI*0.05;
  const path = ()=>{
    for(let i=0;i<=N;i++){
      const f = i/N;
      const ang = start + dir*sweep*f;          // coil forward/down around the cheek
      const rad = r0*(1 - 0.55*f);
      const x = ox + Math.cos(ang)*rad;
      const y = oy + Math.sin(ang)*rad;
      if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
    }
  };
  g.lineCap="round"; g.lineJoin="round";
  g.strokeStyle=INK;       g.lineWidth=w+3; g.beginPath(); path(); g.stroke();
  g.strokeStyle=tone.base; g.lineWidth=w;   g.beginPath(); path(); g.stroke();
}

/* ---- the ram HEAD: blunt dark face, floppy ear, eye, and the two curl-horns.
   headDrop 0 (raised) .. 1 (grazing to the ground) is applied by the caller via
   HC position; here we just draw the skull + horns around HC. ---- */
function drawHead(pen, HC, hr, dir, { gaze=0 }={}){
  const g = pen.ctx;

  // FAR curl-horn behind the skull (dimmer, set back)
  drawCurlHorn(pen, HC.x - dir*hr*0.62, HC.y - hr*0.34, hr*0.80, -dir, T_HORNF(), hr*0.26);

  // floppy ear (drops back off the poll)
  pen.paint(()=>{
    const bx = HC.x - dir*hr*0.40, by = HC.y + hr*0.02;
    g.moveTo(bx, by);
    g.quadraticCurveTo(bx - dir*hr*0.78, by + hr*0.12, bx - dir*hr*0.66, by + hr*0.60);
    g.quadraticCurveTo(bx - dir*hr*0.24, by + hr*0.34, bx + dir*hr*0.04, by + hr*0.16);
    g.closePath();
  }, T_EAR(), 3);

  // blunt Roman-nosed face wedge
  pen.paint(()=>{
    g.moveTo(HC.x - dir*hr*0.48, HC.y - hr*0.62);                 // poll
    g.quadraticCurveTo(HC.x + dir*hr*0.62, HC.y - hr*0.58,        // brow / convex bridge
                       HC.x + dir*hr*1.02, HC.y - hr*0.02);
    g.quadraticCurveTo(HC.x + dir*hr*1.30, HC.y + hr*0.34,        // blunt muzzle front
                       HC.x + dir*hr*1.12, HC.y + hr*0.70);
    g.quadraticCurveTo(HC.x + dir*hr*0.90, HC.y + hr*0.86,        // lower lip / chin
                       HC.x + dir*hr*0.30, HC.y + hr*0.80);
    g.quadraticCurveTo(HC.x - dir*hr*0.26, HC.y + hr*0.62,        // jaw / throat
                       HC.x - dir*hr*0.44, HC.y + hr*0.16);
    g.closePath();
  }, T_FACE(), 4);

  // pale muzzle tip
  pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.78, HC.y + hr*0.06);
    g.quadraticCurveTo(HC.x + dir*hr*1.30, HC.y + hr*0.34, HC.x + dir*hr*1.10, HC.y + hr*0.68);
    g.quadraticCurveTo(HC.x + dir*hr*0.86, HC.y + hr*0.80, HC.x + dir*hr*0.72, HC.y + hr*0.44);
    g.closePath();
  }, T_MUZZLE(), 2.6);

  // NEAR curl-horn coiling forward over the cheek (bold)
  drawCurlHorn(pen, HC.x - dir*hr*0.20, HC.y - hr*0.18, hr*0.92, -dir, T_HORN(), hr*0.34);

  // eye + nostril + mouth crease
  const eye = P(HC.x + dir*hr*0.42, HC.y + hr*0.02 + gaze*hr*0.2);
  g.fillStyle = "#f4f4f0"; g.beginPath(); g.ellipse(eye.x, eye.y, hr*0.15, hr*0.11, 0, 0, 7); g.fill();
  g.fillStyle = INK; g.beginPath(); g.ellipse(eye.x, eye.y, hr*0.07, hr*0.07, 0, 0, 7); g.fill();
  g.fillStyle = INK; g.beginPath(); g.ellipse(HC.x + dir*hr*1.14, HC.y + hr*0.42, hr*0.07, hr*0.05, 0.3*dir, 0, 7); g.fill();
  pen.ink(()=>{ g.moveTo(HC.x + dir*hr*1.10, HC.y + hr*0.56);
                g.lineTo(HC.x + dir*hr*0.82, HC.y + hr*0.62); }, 2.2);
}

/* ---- ONE ram. opts:
     gsc      member scale
     headDrop 0 raised .. 1 grazing
     gallop   0..1 frozen bound (legs splay fore/aft, body clears ground)
     tuck     0..1 legs gathered under (the careful cave-mouth step)
     t        idle phase  */
function drawRam(pen, cx, groundY, S, dir, opts={}){
  const g = pen.ctx;
  const gsc = opts.gsc ?? 1.0;
  const headDrop = opts.headDrop ?? 0;
  const gallop = opts.gallop ?? 0;
  const tuck = opts.tuck ?? 0;
  const t = opts.t || 0;

  const U = S*0.19*gsc;
  const back = S*0.150*gsc;                 // withers height above ground
  const lift = gallop*back*0.14;
  const gY = groundY - lift;
  const bob = Math.sin(t*2 + cx*0.01)*back*0.012;

  const shoulderX = cx + dir*U*0.42;
  const hipX      = cx - dir*U*0.48;

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+4, U*0.86, U*0.13, 0, 0, 7); g.fill(); g.restore();

  // short tail tuft of wool
  pen.paint(()=>{ g.ellipse(hipX - dir*U*0.06, gY - back*0.72 + bob, U*0.12, U*0.14, 0, 0, 7); }, T_FLEECE2(), 3);

  // ---- leg foot targets ----
  const fFoot = gallop ? dir*U*0.52 : (tuck? dir*U*0.10 : 0);   // fores forward
  const rFoot = gallop ? -dir*U*0.50 : (tuck? -dir*U*0.08 : 0); // hinds back
  const kneeBend = gallop ? U*0.09 : tuck*U*0.06;
  const bellyY = gY - back*0.34;

  // ---- FAR legs (behind, dimmer) ----
  const foff = dir*U*0.05;
  drawLeg(pen, P(shoulderX-foff, bellyY+bob), P(shoulderX-foff+dir*U*0.02+kneeBend, gY-back*0.20),
          P(shoulderX-foff+fFoot*0.8, gY), U*0.085, T_LEGF());
  drawLeg(pen, P(hipX-foff, bellyY+bob), P(hipX-foff+dir*U*0.02-kneeBend, gY-back*0.20),
          P(hipX-foff+rFoot*0.8, gY), U*0.085, T_LEGF());

  // ---- fleece body (big scalloped wool blob) ----
  const bcx = cx + dir*U*0.02, bcy = gY - back*0.66 + bob;
  pen.paint(()=>{ woolBlob(g, bcx, bcy, U*0.82, back*0.56, 16, cx*0.03); }, T_FLEECE(), 4.5);
  // shaded belly line of fleece
  pen.paint(()=>{ g.ellipse(bcx, gY - back*0.40, U*0.62, back*0.18, 0, 0, 7); }, T_FLEECE2(), 0);

  // ---- neck + head ----
  const HCraise = P(shoulderX + dir*U*0.54, gY - back*0.92 + bob);
  const HCgraze = P(shoulderX + dir*U*0.72, gY - back*0.10);
  const HC = P(lerp(HCraise.x, HCgraze.x, headDrop), lerp(HCraise.y, HCgraze.y, headDrop));
  const hr = U*0.27;
  // woolly neck wedge from withers to head
  pen.paint(()=>{
    g.moveTo(shoulderX + dir*U*0.05, bcy - back*0.30);                                 // crest at fleece
    g.quadraticCurveTo(lerp(shoulderX,HC.x,0.5)+dir*U*0.06, lerp(bcy,HC.y,0.5)-back*0.06,
                       HC.x - dir*hr*0.34, HC.y - hr*0.52);                             // crest -> poll
    g.lineTo(HC.x + dir*hr*0.02, HC.y + hr*0.66);                                       // throat at head
    g.quadraticCurveTo(shoulderX + dir*U*0.22, gY - back*0.34, shoulderX + dir*U*0.06, gY - back*0.42); // throat -> chest
    g.closePath();
  }, T_FLEECE(), 4.5);

  drawHead(pen, HC, hr, dir, { gaze: headDrop*0.3 });

  // ---- NEAR legs (over body, bold) ----
  drawLeg(pen, P(shoulderX, bellyY+bob), P(shoulderX+dir*U*0.03+kneeBend, gY-back*0.20),
          P(shoulderX+fFoot, gY), U*0.10, T_LEGN());
  drawLeg(pen, P(hipX, bellyY+bob), P(hipX+dir*U*0.02-kneeBend, gY-back*0.20),
          P(hipX+rFoot, gY), U*0.10, T_LEGN());

  return { bcx, bcy, back, U, bellyY, gY, shoulderX, hipX };
}

/* ---- a binding WRAP over one ram's back: a strap crossing the withers with a
   couple of lashing ticks (the withy tie at each beast). ---- */
function ropeWrap(pen, r){
  const g = pen.ctx;
  const topY = r.bcy - r.back*0.52;
  pen.limb(()=>{
    g.moveTo(r.bcx - r.U*0.30, topY + r.back*0.18);
    g.quadraticCurveTo(r.bcx, topY - r.back*0.06, r.bcx + r.U*0.30, topY + r.back*0.18);
  }, T_ROPE(), r.U*0.06);
  pen.ink(()=>{ for(let k=-1;k<=1;k++){ const x=r.bcx+k*r.U*0.16;
    g.moveTo(x, topY + r.back*0.04); g.lineTo(x + r.U*0.05, topY + r.back*0.16); } }, 2.2);
}

/* ---- the connecting WITHY: one strong lashing line running over all three
   rams' backs, tying the triplet abreast. ---- */
function drawWithy(pen, rL, rM, rR){
  const g = pen.ctx;
  const yOf = r => r.bcy - r.back*0.50;
  pen.limb(()=>{
    g.moveTo(rL.bcx - rL.U*0.34, yOf(rL));
    g.quadraticCurveTo((rL.bcx+rM.bcx)/2, (yOf(rL)+yOf(rM))/2 - rM.back*0.10, rM.bcx, yOf(rM));
    g.quadraticCurveTo((rM.bcx+rR.bcx)/2, (yOf(rM)+yOf(rR))/2 - rM.back*0.10, rR.bcx + rR.U*0.34, yOf(rR));
  }, T_ROPE(), rM.U*0.055);
}

/* ---- the belly SLING loop under the middle ram (supports the man) ---- */
function bellySling(pen, r, dir){
  const g = pen.ctx;
  pen.limb(()=>{
    g.moveTo(r.bcx - r.U*0.55, r.gY - r.back*0.28);
    g.quadraticCurveTo(r.bcx, r.gY + r.back*0.02, r.bcx + r.U*0.55, r.gY - r.back*0.28);
  }, T_ROPE(), r.U*0.055);
}

/* ---- the hidden HUMAN clinging to the middle ram's underside. Horizontal, head
   toward +dir, back to the sling, arms & legs reaching up to grip the fleece over
   the flanks. tuck 0..1 gathers the limbs tighter (the careful exit). ---- */
function drawClingMan(pen, r, dir, { tuck=0.5, t=0 }={}){
  const g = pen.ctx;
  const U = r.U;
  const my = r.gY - r.back*0.02;                      // torso slung low under the belly, on the sling
  const mx = r.bcx + dir*U*0.02;
  const sway = Math.sin(t*2)*U*0.02;
  const gripY = r.bcy - r.back*0.10;                  // fleece-grip height (up on the flank)

  // FAR arm + leg (behind torso, dimmer tunic tone)
  pen.limb(()=>{ g.moveTo(mx + dir*U*0.28, my - U*0.04);
    g.quadraticCurveTo(mx + dir*U*0.42, my - r.back*0.30, mx + dir*U*0.22, gripY); }, T_TUNIC(), U*0.09);
  pen.limb(()=>{ g.moveTo(mx - dir*U*0.28, my - U*0.04);
    g.quadraticCurveTo(mx - dir*U*0.42, my - r.back*0.30, mx - dir*U*0.22, gripY); }, T_TUNIC(), U*0.09);

  // torso (a sagging skin-tone capsule slung under the belly, distinct from the
  // dark ram legs and light fleece)
  pen.limb(()=>{ g.moveTo(mx - dir*U*0.42, my - U*0.04 + sway);
    g.quadraticCurveTo(mx, my + U*0.18, mx + dir*U*0.46, my - U*0.02 + sway); }, T_SKIN(), U*0.26);
  // a tunic band across the hips
  pen.limb(()=>{ g.moveTo(mx - dir*U*0.20, my + U*0.06);
    g.quadraticCurveTo(mx, my + U*0.16, mx + dir*U*0.10, my + U*0.06); }, T_TUNIC(), U*0.20);

  // NEAR arm reaching up to grip the withers fleece
  pen.limb(()=>{ g.moveTo(mx + dir*U*0.36, my - U*0.02);
    g.quadraticCurveTo(mx + dir*U*0.48, my - r.back*0.34, mx + dir*U*0.30, gripY); }, T_SKIN(), U*0.09);
  pen.paint(()=>{ g.arc(mx + dir*U*0.30, gripY, U*0.08, 0, 7); }, T_SKIN(), 2.6); // gripping hand

  // NEAR leg reaching up to grip the rump fleece
  pen.limb(()=>{ g.moveTo(mx - dir*U*0.36, my - U*0.02);
    g.quadraticCurveTo(mx - dir*U*0.50, my - r.back*0.30, mx - dir*U*0.30, gripY); }, T_SKIN(), U*0.11);
  pen.paint(()=>{ g.arc(mx - dir*U*0.30, gripY, U*0.075, 0, 7); }, T_SKIN(), 2.6); // gripping foot

  // head hanging at the front, tucked up under the brisket
  const hx = mx + dir*U*0.56, hy = my - U*0.06;
  pen.paint(()=>{ g.arc(hx, hy, U*0.15, 0, 7); }, T_SKIN(), 3.5);
  pen.paint(()=>{ g.arc(hx - dir*U*0.02, hy - U*0.05, U*0.14, Math.PI*0.88, TAU*0.86); }, T_HAIR(), 2.6); // hair/beard cap
  g.fillStyle=INK; g.beginPath(); g.arc(hx + dir*U*0.05, hy + U*0.01, U*0.028, 0, 7); g.fill(); // eye
}

/* ---- the man RELEASED: dropped to the ground in a crouch, ropes loose ---- */
function drawCrouchMan(pen, cx, groundY, U, dir){
  const g = pen.ctx;
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+3, U*0.5, U*0.09, 0, 0, 7); g.fill(); g.restore();
  const hipY = groundY - U*0.42, shoY = groundY - U*0.78;
  // legs (crouched)
  pen.limb(()=>{ g.moveTo(cx, hipY); g.lineTo(cx + dir*U*0.28, groundY - U*0.02); g.lineTo(cx + dir*U*0.10, groundY); }, T_TUNIC(), U*0.13);
  pen.limb(()=>{ g.moveTo(cx, hipY); g.lineTo(cx - dir*U*0.22, groundY - U*0.02); g.lineTo(cx - dir*U*0.02, groundY); }, T_TUNIC(), U*0.13);
  // torso
  pen.limb(()=>{ g.moveTo(cx, hipY); g.lineTo(cx + dir*U*0.06, shoY); }, T_TUNIC(), U*0.26);
  // arms (one reaching up toward the released ram)
  pen.limb(()=>{ g.moveTo(cx + dir*U*0.04, shoY+U*0.04); g.lineTo(cx + dir*U*0.34, shoY - U*0.20); }, T_SKIN(), U*0.09);
  pen.limb(()=>{ g.moveTo(cx + dir*U*0.04, shoY+U*0.06); g.lineTo(cx - dir*U*0.22, shoY + U*0.10); }, T_SKIN(), U*0.09);
  // head
  const hx = cx + dir*U*0.10, hy = shoY - U*0.20;
  pen.paint(()=>{ g.arc(hx, hy, U*0.17, 0, 7); }, T_SKIN(), 3.5);
  pen.paint(()=>{ g.arc(hx, hy - U*0.05, U*0.16, Math.PI*0.95, TAU*0.9); }, T_HAIR(), 2.6);
  g.fillStyle=INK; g.beginPath(); g.arc(hx + dir*U*0.06, hy, U*0.03, 0, 7); g.fill();
  // a loose coil of rope on the ground beside him
  pen.limb(()=>{ g.moveTo(cx - dir*U*0.5, groundY - U*0.02);
    g.bezierCurveTo(cx - dir*U*0.2, groundY - U*0.14, cx - dir*U*0.7, groundY - U*0.10, cx - dir*U*0.4, groundY); }, T_ROPE(), U*0.05);
}

/* ================= SCENE ================= */
function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const S = Math.min(W, H) * 0.94;
  const groundY = H*0.58;
  const t = state.t || 0;
  const pose = state.pose || "suspended-human";
  const dir = +1;

  // faint shared ground line
  g.save(); g.strokeStyle="rgba(0,0,0,0.10)"; g.lineWidth=2;
  g.beginPath(); g.moveTo(W*0.03, groundY+2); g.lineTo(W*0.97, groundY+2); g.stroke(); g.restore();

  if (pose === "herd"){
    // unbound rams grazing as a small flock — no ropes, no man
    const flock = [
      {x:0.20, gsc:0.92, headDrop:1.0}, {x:0.42, gsc:1.05, headDrop:0.85},
      {x:0.66, gsc:1.0, headDrop:1.0},  {x:0.86, gsc:0.85, headDrop:0.7},
    ].sort((a,b)=>a.gsc-b.gsc);
    for(const m of flock) drawRam(pen, W*m.x, groundY, S, m.dir||dir, { gsc:m.gsc, headDrop:m.headDrop, t });
    return;
  }

  const gallop = pose==="run" ? 1 : 0;
  const tuck   = pose==="slow-exit" ? 1 : 0;
  const headDrop = pose==="slow-exit" ? 0.15 : (pose==="run" ? 0.2 : 0.0);

  // ---- three-abreast triplet: flanking rams set slightly BACK (left & right,
  //      smaller), middle ram NEAR and largest (drawn last so it fronts the
  //      group). Wider spacing so each silhouette reads with paper between. ----
  const rL = drawRam(pen, W*0.20, groundY - S*0.032, S, dir,
                     { gsc:0.80, headDrop, gallop, tuck, t:t+0.5 });
  const rR = drawRam(pen, W*0.80, groundY - S*0.032, S, dir,
                     { gsc:0.80, headDrop, gallop, tuck, t:t+0.9 });

  // the middle ram fronts the group; the man is drawn after it so his gripping
  // limbs stay visible against the belly (the concealed anchor read).
  const rM = drawRam(pen, W*0.50, groundY, S, dir,
                     { gsc:1.06, headDrop, gallop, tuck, t });

  // the withy harness: one connecting lashing over the three backs + a wrap at
  // each beast + a belly sling under the middle ram
  drawWithy(pen, rL, rM, rR);
  ropeWrap(pen, rL); ropeWrap(pen, rR); ropeWrap(pen, rM);
  bellySling(pen, rM, dir);

  if (pose === "rope-bound"){
    // empty harness — no man slung yet (the rig prepared)
    return;
  }
  if (pose === "release"){
    // man dropped to the ground just ahead of the freed middle ram
    drawCrouchMan(pen, W*0.51 + dir*S*0.26, groundY, S*0.19, dir);
    return;
  }
  // suspended-human / slow-exit / run : the man clings beneath the middle ram
  drawClingMan(pen, rM, dir, { tuck: pose==="slow-exit"?1:0.4, t });
}

export const asset = {
  id:"creature.escape-ram-teams",
  type:"CREATURE",
  name:"Escape ram teams",
  statusWord:"BOUND",
  scene:"OD-B09-S10",

  // procedural knobs
  params:{
    abreast:3,            // rams lashed side-by-side per team
    curlHorn:1.0,         // 0..1 ram spiral horn size
    fleece:1.0,           // wool fullness
    harness:true,         // withy / rope lashing + belly sling
    hiddenHuman:true,     // a man slung under the middle ram
  },
  // back -> front draw order the triplet honors
  layers:["ground","shadow","far-rams","lateral-rope","far-legs","fleece","neck",
          "far-horn","ear","face","near-horn","near-legs","back-rope","belly-sling","slung-man"],
  // normalized 0..1 attention / handling / rigging anchors
  anchors:{
    "team:center":{x:.51,y:.50}, "ram:middle-back":{x:.51,y:.40}, "ram:left":{x:.30,y:.44},
    "ram:right":{x:.72,y:.44}, "human:anchor":{x:.51,y:.58}, "human:head":{x:.60,y:.55},
    "sling:belly":{x:.51,y:.60}, "harness:back":{x:.51,y:.38},
    "exit:cave-mouth":{x:.96,y:.60}, "camera:team":{x:.51,y:.50},
  },
  // body / passage footprints for placement, pathing, collision
  zones:{
    "team:collision":{ x0:.16,y0:.40,x1:.88,y1:.82 },
    "human:collision":{ x0:.40,y0:.52,x1:.64,y1:.70 },
    walkable:{ x0:.04,y0:.60,x1:.96,y1:.90 },
    "cave:mouth":{ x0:.84,y0:.44,x1:.98,y1:.82 },
  },
  states:{
    initial:"suspended-human",
    nodes:{
      "rope-bound":{      preview:{ pose:"rope-bound", t:0.1 } },   // three-abreast harness, empty
      "suspended-human":{ preview:{ pose:"suspended-human", t:0.2 } }, // man slung & clinging
      "slow-exit":{       preview:{ pose:"slow-exit", t:0.3 } },    // edging carefully out, tucked
      "run":{             preview:{ pose:"run", t:0.6 } },          // bounding clear
      "release":{         preview:{ pose:"release", t:0.4 } },      // man dropped, ropes loose
      "herd":{            preview:{ pose:"herd", t:0.3 } },         // unbound rams grazing
    },
    edges:[
      ["rope-bound","suspended-human"],["suspended-human","slow-exit"],
      ["slow-exit","run"],["run","release"],["release","herd"],
      ["rope-bound","herd"],["herd","rope-bound"],
    ],
  },
  channels:["pose","headDrop","gait","tuck","cling","harness"],

  preview:()=>({ pose:"suspended-human", t:0.2, status:"BOUND", progress:.28 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
