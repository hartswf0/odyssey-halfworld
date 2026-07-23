/* creature.helioss-cattle-and-sheep — the immortal radiant herds of the Sun.
   CREATURE asset (quadruped, NOT humanoid): fully custom geometry on engine
   primitives — no figure rig. A small MIXED herd drawn deterministically from
   two templates:
     · CATTLE  — noble broad-horned kine: sturdy hoofed body (upper/lower leg
                 segments + hoof blocks), thick crested neck, broad blunt head
                 with jaw + gaze eye, and a wide pale LYRE of horns. Radiant,
                 unaging, so the hide reads a warm mid-light (not black).
     · SHEEP   — woolly beasts: a scalloped FLEECE blob (lifted top lobe +
                 shaded underside), four short cloven legs, a wedge head with
                 ear + eye. Hornless, a touch smaller.
   Over the whole herd hangs a faint sacred SUN-GLOW — an outlined bright disk
   with radiating rays that pulse/turn over state.t (the god's ownership mark).
   The herds are IMMORTAL and UNAGING with a persistent count (divine property
   of Helios); slaughtering them is the crew's doom. States (channels drive):
     · graze     — heads down cropping the meadow, glow low
     · observe   — heads UP, alert, the herd watching (the crew arrives), glow mid
     · slaughter — one beast taken down (a laid hide) among an alarmed herd,
                   glow flaring
     · omen      — the divine sign: flayed hides on the ground + a fierce
                   radiant sun-burst (the meat that lowed on the spits)
   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B12-S05 — immortal unaging herds with count persistence, divine
   ownership, graze / observe / slaughter / omen states. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- tone levels (flat grays; POST turns them into dots).
   Radiant immortal beasts read a warm MID-LIGHT so internal contour + the dot
   texture survive and they glow against the paper; the pale bone horns pop. --- */
const T_HIDE    = ()=> toneSolid(inkLevel(3));   // radiant cattle hide (light mid-gray)
const T_HIDE_D  = ()=> toneSolid(inkLevel(4));   // shaded belly / crest
const T_HUMP    = ()=> toneSolid(inkLevel(4));   // withers crest
const T_NEARLEG = ()=> toneSolid(inkLevel(4));
const T_FARLEG  = ()=> toneSolid(inkLevel(3));
const T_HOOF    = ()=> toneSolid(inkLevel(6));   // hard dark hoof
const T_HORN    = ()=> toneSolid(inkLevel(6));   // dark broad lyre-horn (near) — pops on the light radiant hide
const T_HORNF   = ()=> toneSolid(inkLevel(5));   // far horn (behind)
const T_EAR     = ()=> toneSolid(inkLevel(4));
const T_MUZZLE  = ()=> toneSolid(inkLevel(2));   // light blunt muzzle plane
const T_TAIL    = ()=> toneSolid(inkLevel(3));
const T_TUFT    = ()=> toneSolid(inkLevel(5));

const T_FLEECE  = ()=> toneSolid(inkLevel(4));   // woolly sheep body
const T_FLEECE_H= ()=> toneSolid(inkLevel(3));   // lifted top lobe (form)
const T_FLEECE_D= ()=> toneSolid(inkLevel(5));   // shaded underside
const T_SFACE   = ()=> toneSolid(inkLevel(5));   // sheep wedge face
const T_SLEG    = ()=> toneSolid(inkLevel(5));

const T_GLOWDISK= ()=> toneSolid(inkLevel(1));   // bright sun disk (near paper)
const T_RAY     = ()=> toneSolid(inkLevel(2));   // faint radiating ray
const T_HIDE_DN = ()=> toneSolid(inkLevel(5));   // a flayed hide laid on the ground

/* ============================================================
   SACRED SUN-GLOW — an outlined bright disk with radiating rays.
   Drawn light so it reads as radiance, not shadow; rays pulse + turn over t.
   intensity 0..1 scales ray length + count-brightness; drawn BEHIND the herd.
   ============================================================ */
function drawSunGlow(pen, cx, cy, R, intensity, t){
  const g = pen.ctx;
  const n = 16;
  const spin = t*0.20;
  // ---- radiating rays (thin tapered wedges; no heavy contour) ----
  for(let i=0;i<n;i++){
    const a = (i/n)*TAU + spin;
    const puls = 0.80 + 0.30*Math.sin(t*2.2 + i*0.7);
    const inR = R*0.92;
    const outR = R*(1.35 + 0.85*intensity)*puls;
    const w = R*0.055*(0.6+intensity);
    const nx = Math.cos(a+Math.PI/2), ny = Math.sin(a+Math.PI/2);
    g.beginPath();
    g.moveTo(cx+Math.cos(a)*inR - nx*w, cy+Math.sin(a)*inR - ny*w);
    g.lineTo(cx+Math.cos(a)*inR + nx*w, cy+Math.sin(a)*inR + ny*w);
    g.lineTo(cx+Math.cos(a)*outR, cy+Math.sin(a)*outR);
    g.closePath();
    g.fillStyle = inkLevel(2);
    g.fill();
  }
  // ---- corona ring (faint mid tone just outside the disk) ----
  g.fillStyle = inkLevel(2);
  g.beginPath(); g.arc(cx,cy,R*1.02,0,TAU); g.arc(cx,cy,R*0.86,0,TAU,true); g.fill();
  // ---- bright disk (outlined, near-paper fill: reads as radiant light) ----
  pen.paint(()=>{ g.arc(cx,cy,R*0.86,0,TAU); }, T_GLOWDISK(), 4);
  // a few concentric contour rings inside for the sacred-mark read
  pen.ink(()=>{ g.arc(cx,cy,R*0.60,0,TAU); }, 2);
  pen.ink(()=>{ g.arc(cx,cy,R*0.34,0,TAU); }, 2);
}

/* ============================================================
   CATTLE — noble broad-horned kine
   ============================================================ */
/* one sturdy hoofed leg: two segments + a blocky hoof */
function drawCowLeg(pen, hip, knee, foot, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.86);
  pen.paint(()=>{
    g.moveTo(foot.x - w*0.60, foot.y - w*0.28);
    g.lineTo(foot.x + w*0.60, foot.y - w*0.28);
    g.lineTo(foot.x + w*0.50, foot.y + w*0.34);
    g.lineTo(foot.x - w*0.50, foot.y + w*0.34);
    g.closePath();
  }, T_HOOF(), 3.2);
}

/* broad kine head: skull, blunt muzzle/jaw, a WIDE LYRE of horns, ear, eye.
   The lyre horns sweep OUT then up (noble/broad), pale bone against the hide. */
function drawCowHead(pen, HC, hr, dir, { gaze=0 }={}){
  const g = pen.ctx;
  const rx = hr, ry = hr*0.84;

  // a bold tapered HORN sweeping up & outward from the poll (two segments so it
  // curves). The pair (one back, one forward) spreads into a broad LYRE.
  //   sway = horizontal sweep direction/reach; len scales the height.
  const horn = (sway, tone, wbase, len)=>{
    const poll = P(HC.x + dir*rx*0.06, HC.y - ry*0.50);
    const mid  = P(poll.x + sway*rx*0.72, poll.y - ry*len*0.60);
    const tip  = P(mid.x  + sway*rx*0.10, mid.y  - ry*len*0.62);
    pen.limb(()=>{ g.moveTo(poll.x,poll.y);
      g.quadraticCurveTo(poll.x + sway*rx*0.60, poll.y - ry*len*0.52, mid.x, mid.y); }, tone, wbase);
    pen.limb(()=>{ g.moveTo(mid.x,mid.y);
      g.quadraticCurveTo(mid.x + sway*rx*0.24, mid.y - ry*len*0.42, tip.x, tip.y); }, tone, wbase*0.52);
  };
  // far horn (sweeps back, dimmer, behind the skull)
  horn(-dir*0.95, T_HORNF(), rx*0.30, 1.55);

  // ---- blunt muzzle / jaw (front of head) ----
  const mTip = P(HC.x + dir*rx*0.78, HC.y + ry*0.32);
  pen.paint(()=>{
    g.moveTo(HC.x + dir*rx*0.28, HC.y - ry*0.34);
    g.quadraticCurveTo(HC.x + dir*rx*0.96, HC.y - ry*0.16, mTip.x, mTip.y - ry*0.06);
    g.quadraticCurveTo(mTip.x + dir*rx*0.12, mTip.y + ry*0.30, mTip.x - dir*rx*0.04, mTip.y + ry*0.48);
    g.quadraticCurveTo(HC.x + dir*rx*0.58, HC.y + ry*0.88, HC.x + dir*rx*0.02, HC.y + ry*0.80);
    g.closePath();
  }, T_MUZZLE(), 4);

  // ---- skull (broad) ----
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, rx, ry, 0, 0, TAU); }, T_HIDE(), 4);
  // forelock between the horns
  pen.paint(()=>{ g.ellipse(HC.x, HC.y - ry*0.62, rx*0.34, ry*0.28, 0,0,TAU); }, T_HUMP(), 3);

  // ---- ear (out to the side, under the near horn) ----
  pen.paint(()=>{
    g.moveTo(HC.x - dir*rx*0.08, HC.y - ry*0.18);
    g.quadraticCurveTo(HC.x - dir*rx*0.74, HC.y - ry*0.26, HC.x - dir*rx*0.68, HC.y + ry*0.16);
    g.quadraticCurveTo(HC.x - dir*rx*0.40, HC.y + ry*0.06, HC.x - dir*rx*0.06, HC.y + ry*0.10);
    g.closePath();
  }, T_EAR(), 3.2);

  // ---- NEAR horn (sweeps forward, bold) — completes the broad lyre ----
  horn(dir*0.92, T_HORN(), rx*0.34, 1.72);

  // ---- eye (gaze), nostril, mouth ----
  const eye = P(HC.x + dir*rx*0.42, HC.y - ry*0.04 + gaze*ry*0.30);
  g.fillStyle = INK; g.beginPath(); g.ellipse(eye.x, eye.y, rx*0.12, rx*0.09, 0,0,TAU); g.fill();
  g.beginPath(); g.ellipse(mTip.x - dir*rx*0.02, mTip.y + ry*0.16, rx*0.09, rx*0.06, 0.4*dir, 0, TAU); g.fill();
  pen.ink(()=>{ g.moveTo(mTip.x - dir*rx*0.04, mTip.y + ry*0.44); g.lineTo(HC.x + dir*rx*0.24, HC.y + ry*0.60); }, 2.4);
}

/* one radiant cow. headDrop 0=head raised(observe), 1=grazing to the ground. */
function drawCow(pen, cx, groundY, S, dir, { headDrop=0, t=0, scale=1 }={}){
  const g = pen.ctx;
  const U = S*0.25*scale;
  const back = S*0.175*scale;                    // withers height above ground
  const shoulderX = cx + dir*U*0.40;
  const hipX      = cx - dir*U*0.46;
  const bob = Math.sin(t*1.6 + cx*0.01)*U*0.012;

  // ---- ground shadow ----
  g.save(); g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, groundY+5, U*0.94, U*0.16, 0,0,TAU); g.fill(); g.restore();

  // ---- tail (thin, with a tuft) ----
  const tb = P(hipX - dir*U*0.18, groundY - back*0.90);
  const tt = P(hipX - dir*U*0.30, groundY - back*0.16);
  pen.limb(()=>{ g.moveTo(tb.x,tb.y); g.quadraticCurveTo(hipX - dir*U*0.42, groundY - back*0.52, tt.x, tt.y); }, T_TAIL(), U*0.055);
  pen.paint(()=>{ g.ellipse(tt.x, tt.y + back*0.04, U*0.08, back*0.15, 0.2*dir, 0, TAU); }, T_TUFT(), 3);

  // ---- FAR legs ----
  const foff = dir*U*0.06;
  drawCowLeg(pen, P(shoulderX-foff, groundY-back*0.70), P(shoulderX-foff+dir*U*0.02, groundY-back*0.36),
             P(shoulderX-foff+dir*U*0.03, groundY), U*0.12, T_FARLEG());
  drawCowLeg(pen, P(hipX-foff, groundY-back*0.68), P(hipX-foff+dir*U*0.03, groundY-back*0.36),
             P(hipX-foff+dir*U*0.02, groundY), U*0.12, T_FARLEG());

  // ---- torso key points ----
  const wither = P(shoulderX + dir*U*0.06, groundY - back*1.04);
  const croup  = P(hipX + dir*U*0.06,      groundY - back*0.98);
  const rump   = P(hipX - dir*U*0.16,      groundY - back*0.62);
  const bellyR = P(hipX + dir*U*0.06,      groundY - back*0.40);
  const bellyF = P(shoulderX - dir*U*0.02, groundY - back*0.36);
  const chest  = P(shoulderX + dir*U*0.30, groundY - back*0.56);

  pen.paint(()=>{
    g.moveTo(chest.x, chest.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.22, wither.y - back*0.02, wither.x, wither.y);
    g.quadraticCurveTo(cx + dir*U*0.02, groundY - back*0.96, croup.x, croup.y);
    g.quadraticCurveTo(hipX - dir*U*0.16, croup.y + back*0.02, rump.x, rump.y);
    g.quadraticCurveTo(hipX - dir*U*0.06, bellyR.y, bellyR.x, bellyR.y);
    g.quadraticCurveTo(cx, bellyR.y + back*0.10, bellyF.x, bellyF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.14, bellyF.y - back*0.02, chest.x, chest.y);
    g.closePath();
  }, T_HIDE(), 4.5);
  // belly shade
  pen.paint(()=>{ g.ellipse(cx, groundY - back*0.40, U*0.62, back*0.20, 0,0,TAU); }, T_HIDE_D(), 0);
  // withers crest lump
  pen.paint(()=>{ g.ellipse(wither.x - dir*U*0.02, wither.y + back*0.10, U*0.20, back*0.20, -0.3*dir, 0, TAU); }, T_HUMP(), 3);

  // ---- neck wedge -> head (raised head clears the backline, horns vs. paper) ----
  const HCraise = P(shoulderX + dir*U*0.60, groundY - back*1.56);
  const HCgraze = P(shoulderX + dir*U*0.70, groundY - back*0.28);
  const HC = P(lerp(HCraise.x, HCgraze.x, headDrop), lerp(HCraise.y, HCgraze.y, headDrop) + bob*(1-headDrop));
  const hr = U*0.31;
  pen.paint(()=>{
    g.moveTo(wither.x + dir*U*0.02, wither.y + back*0.04);
    g.quadraticCurveTo(HC.x - dir*hr*0.6, HC.y - hr*0.5, HC.x - dir*hr*0.1, HC.y - hr*0.35);
    g.lineTo(HC.x + dir*hr*0.5, HC.y + hr*0.55);
    g.quadraticCurveTo(chest.x + dir*U*0.10, chest.y - back*0.04, chest.x, chest.y);
    g.closePath();
  }, T_HIDE(), 4.5);
  // dewlap fold
  pen.ink(()=>{ g.moveTo(HC.x + dir*hr*0.4, HC.y + hr*0.5);
    g.quadraticCurveTo(chest.x + dir*U*0.18, chest.y + back*0.06, chest.x + dir*U*0.02, chest.y + back*0.02); }, 2.4);

  drawCowHead(pen, HC, hr, dir, { gaze: headDrop*0.5 });

  // ---- NEAR legs ----
  drawCowLeg(pen, P(shoulderX, groundY-back*0.70), P(shoulderX+dir*U*0.03, groundY-back*0.36),
             P(shoulderX+dir*U*0.04, groundY), U*0.14, T_NEARLEG());
  drawCowLeg(pen, P(hipX, groundY-back*0.68), P(hipX+dir*U*0.04, groundY-back*0.36),
             P(hipX+dir*U*0.03, groundY), U*0.14, T_NEARLEG());
  return { HC, hr };
}

/* ============================================================
   SHEEP — woolly beasts
   ============================================================ */
/* a scalloped WOOL blob (bumpy closed outline) — the woolly read */
function woolBlob(g, cx, cy, rx, ry, bumps, depth=0.22, seed=0){
  const pts=[];
  for(let i=0;i<bumps;i++){
    const a=(i/bumps)*TAU;
    const j = 1 + (((i*7+seed*13)%5)-2)*0.035;
    pts.push({x:cx+Math.cos(a)*rx*j, y:cy+Math.sin(a)*ry*j});
  }
  g.moveTo(pts[0].x, pts[0].y);
  for(let i=0;i<bumps;i++){
    const q=pts[(i+1)%bumps];
    const a2 = (i+0.5)/bumps*TAU;
    const b = Math.min(rx,ry)*depth;
    g.quadraticCurveTo(cx+Math.cos(a2)*(rx+b), cy+Math.sin(a2)*(ry+b), q.x, q.y);
  }
  g.closePath();
}
function drawSheepLeg(pen, hip, foot, w, tone, dir){
  const g = pen.ctx;
  const kx = lerp(hip.x, foot.x, 0.5) + dir*w*0.2;
  const ky = lerp(hip.y, foot.y, 0.52);
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(kx,ky); }, tone, w);
  pen.limb(()=>{ g.moveTo(kx,ky); g.lineTo(foot.x,foot.y); }, tone, w*0.82);
  pen.paint(()=>{ g.rect(foot.x - w*0.55, foot.y - w*0.06, w*0.46, w*0.46); }, T_HOOF(), 2.2);
  pen.paint(()=>{ g.rect(foot.x + w*0.08, foot.y - w*0.06, w*0.46, w*0.46); }, T_HOOF(), 2.2);
}
function drawSheepHead(pen, HC, hr, dir, { gaze=0 }={}){
  const g = pen.ctx;
  // far ear
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.26, HC.y-hr*0.14);
    g.quadraticCurveTo(HC.x-dir*hr*0.96, HC.y, HC.x-dir*hr*0.90, HC.y+hr*0.40);
    g.quadraticCurveTo(HC.x-dir*hr*0.46, HC.y+hr*0.16, HC.x-dir*hr*0.24, HC.y+hr*0.06);
    g.closePath();
  }, T_EAR(), 3);
  // wedge face (Roman nose)
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.38, HC.y-hr*0.66);
    g.quadraticCurveTo(HC.x+dir*hr*0.52, HC.y-hr*0.60, HC.x+dir*hr*0.98, HC.y-hr*0.14);
    g.quadraticCurveTo(HC.x+dir*hr*1.44, HC.y+hr*0.14, HC.x+dir*hr*1.34, HC.y+hr*0.50);
    g.quadraticCurveTo(HC.x+dir*hr*1.14, HC.y+hr*0.74, HC.x+dir*hr*0.76, HC.y+hr*0.76);
    g.quadraticCurveTo(HC.x+dir*hr*0.05, HC.y+hr*0.88, HC.x-dir*hr*0.26, HC.y+hr*0.40);
    g.closePath();
  }, T_SFACE(), 3.5);
  pen.paint(()=>{ g.ellipse(HC.x+dir*hr*1.04, HC.y+hr*0.24, hr*0.32, hr*0.22, 0.2*dir,0,TAU); }, T_MUZZLE(), 0);
  // near floppy ear
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.02, HC.y-hr*0.16);
    g.quadraticCurveTo(HC.x+dir*hr*0.62, HC.y+hr*0.06, HC.x+dir*hr*0.54, HC.y+hr*0.48);
    g.quadraticCurveTo(HC.x+dir*hr*0.26, HC.y+hr*0.22, HC.x+dir*hr*0.05, HC.y+hr*0.04);
    g.closePath();
  }, T_EAR(), 3);
  // eye + nostril + mouth
  const ex = HC.x+dir*hr*0.42, ey = HC.y-hr*0.04 + gaze*hr*0.2;
  g.fillStyle="#efefe8"; g.beginPath(); g.ellipse(ex, ey, hr*0.12, hr*0.14, 0,0,TAU); g.fill();
  g.fillStyle=INK; g.beginPath(); g.ellipse(ex+dir*hr*0.02, ey, hr*0.06, hr*0.08, 0,0,TAU); g.fill();
  g.beginPath(); g.ellipse(HC.x+dir*hr*1.26, HC.y+hr*0.34, hr*0.07, hr*0.055, 0.3*dir, 0,TAU); g.fill();
  pen.ink(()=>{ g.moveTo(HC.x+dir*hr*1.30, HC.y+hr*0.50); g.lineTo(HC.x+dir*hr*0.96, HC.y+hr*0.60); }, 2);
}
/* one woolly sheep, feet on groundY. headDrop 0=head up, 1=grazing. */
function drawSheep(pen, cx, groundY, U, dir, { headDrop=0, t=0, scale=1 }={}){
  const g = pen.ctx;
  const s = scale;
  const bodyRx=U*1.02*s, bodyRy=U*0.70*s;
  const legLen=U*0.56*s;
  const bob = Math.sin(t*2 + cx*0.011)*U*0.010;
  const cy = groundY - legLen - bodyRy*0.50 + bob;

  g.save(); g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, groundY+5, bodyRx*0.94, U*0.13, 0,0,TAU); g.fill(); g.restore();

  const legTopY = cy+bodyRy*0.30;
  const foreX = cx+dir*bodyRx*0.50, hindX = cx-dir*bodyRx*0.54;

  // far legs
  drawSheepLeg(pen, P(foreX-dir*U*0.10, legTopY), P(foreX-dir*U*0.10, groundY), U*0.135*s, T_FARLEG(), dir);
  drawSheepLeg(pen, P(hindX-dir*U*0.10, legTopY), P(hindX-dir*U*0.10, groundY), U*0.135*s, T_FARLEG(), dir);

  // woolly body
  pen.paint(()=>{ woolBlob(g, cx, cy, bodyRx, bodyRy, 16, 0.22, Math.round(cx)); }, T_FLEECE(), 4.5);
  pen.paint(()=>{ g.ellipse(cx-dir*bodyRx*0.10, cy-bodyRy*0.34, bodyRx*0.60, bodyRy*0.32, 0,0,TAU); }, T_FLEECE_H(), 0);
  pen.paint(()=>{ g.ellipse(cx, cy+bodyRy*0.48, bodyRx*0.74, bodyRy*0.30, 0,0,TAU); }, T_FLEECE_D(), 0);
  pen.seam(()=>{ g.moveTo(cx-bodyRx*0.5, cy-bodyRy*0.08); g.quadraticCurveTo(cx, cy, cx+bodyRx*0.5, cy-bodyRy*0.10); }, 2);

  // short woolly tail
  pen.paint(()=>{ g.ellipse(cx-dir*bodyRx*0.90, cy+bodyRy*0.14, U*0.10, U*0.15, 0.2*dir,0,TAU); }, T_TAIL(), 3);

  // neck + head
  const headR = U*0.38*s;
  const HCraise = P(cx+dir*(bodyRx*0.94), cy-bodyRy*0.30+bob);
  const HCgraze = P(cx+dir*(bodyRx*1.02), groundY-headR*0.48);
  const HC = P(lerp(HCraise.x, HCgraze.x, headDrop), lerp(HCraise.y, HCgraze.y, headDrop));
  pen.paint(()=>{
    g.moveTo(cx+dir*bodyRx*0.42, cy-bodyRy*0.38);
    g.quadraticCurveTo(lerp(cx,HC.x,0.55)+dir*U*0.04, lerp(cy-bodyRy,HC.y,0.5), HC.x-dir*headR*0.28, HC.y-headR*0.50);
    g.lineTo(HC.x-dir*headR*0.02, HC.y+headR*0.60);
    g.quadraticCurveTo(cx+dir*bodyRx*0.58, cy+bodyRy*0.10, cx+dir*bodyRx*0.38, cy-bodyRy*0.02);
    g.closePath();
  }, T_FLEECE(), 4);
  drawSheepHead(pen, HC, headR, dir, { gaze: headDrop*0.3 });

  // near legs
  drawSheepLeg(pen, P(foreX, legTopY), P(foreX, groundY), U*0.16*s, T_SLEG(), dir);
  drawSheepLeg(pen, P(hindX, legTopY), P(hindX, groundY), U*0.16*s, T_SLEG(), dir);
}

/* a flayed HIDE laid on the ground (slaughter / omen): a low folded blob with
   two stiff legs sticking out — the beast taken down. */
function drawDownHide(pen, cx, groundY, U, dir, woolly){
  const g = pen.ctx;
  const bodyRx = U*1.16, bodyRy = U*0.46;
  const cy = groundY - bodyRy*0.66;
  g.save(); g.fillStyle="rgba(0,0,0,0.11)";
  g.beginPath(); g.ellipse(cx, groundY+3, bodyRx*1.0, U*0.11, 0,0,TAU); g.fill(); g.restore();
  // two stiff legs
  for(const sgn of [-0.4, 0.2]){
    const hx = cx + dir*bodyRx*sgn, hy = cy+bodyRy*0.2;
    const fx = hx + dir*U*0.42, fy = hy - U*0.30;
    pen.limb(()=>{ g.moveTo(hx,hy); g.lineTo(fx,fy); }, T_HIDE_DN(), U*0.12);
    pen.paint(()=>{ g.rect(fx-U*0.05, fy-U*0.05, U*0.11, U*0.12); }, T_HOOF(), 2);
  }
  // the laid body / hide
  if (woolly) pen.paint(()=>{ woolBlob(g, cx, cy, bodyRx, bodyRy, 15, 0.18, Math.round(cx)); }, T_HIDE_DN(), 4.5);
  else pen.paint(()=>{ g.ellipse(cx, cy, bodyRx, bodyRy, 0,0,TAU); }, T_HIDE_DN(), 4.5);
  pen.paint(()=>{ g.ellipse(cx, cy+bodyRy*0.36, bodyRx*0.78, bodyRy*0.30, 0,0,TAU); }, toneSolid(inkLevel(6)), 0);
  // slack head laid forward
  pen.paint(()=>{ g.ellipse(cx+dir*bodyRx*0.98, groundY-U*0.14, U*0.26, U*0.18, 0.2*dir,0,TAU); }, T_HIDE_DN(), 3.5);
  pen.limb(()=>{ g.moveTo(cx+dir*bodyRx*0.7, cy+bodyRy*0.1); g.lineTo(cx+dir*bodyRx*1.0, groundY-U*0.12); }, T_HIDE_DN(), U*0.16);
}

/* ================= SCENE ================= */
/* per-state herd layout: mixed cattle + sheep, glow intensity, downed hides */
function layoutFor(state){
  const pose = state.pose || "observe";
  switch(pose){
    case "graze":
      return { glow:0.28, members:[
        {kind:"cow",   x:0.17, headDrop:1.0, scale:1.0},
        {kind:"sheep", x:0.42, headDrop:0.9, scale:0.92},
        {kind:"cow",   x:0.66, headDrop:0.95,scale:1.05},
        {kind:"sheep", x:0.88, headDrop:1.0, scale:0.85},
      ], hides:[] };
    case "slaughter":
      return { glow:0.78, members:[
        {kind:"cow",   x:0.18, headDrop:0.10, scale:1.0},
        {kind:"sheep", x:0.42, headDrop:0.05, scale:0.92},
        {kind:"cow",   x:0.88, headDrop:0.12, scale:1.0},
      ], hides:[{x:0.65, dir:+1, woolly:false}] };
    case "omen":
      return { glow:1.0, members:[
        {kind:"cow",   x:0.17, headDrop:0.15, scale:0.98},
        {kind:"sheep", x:0.88, headDrop:0.10, scale:0.86},
      ], hides:[{x:0.42, dir:-1, woolly:true},{x:0.67, dir:+1, woolly:false}] };
    default: // "observe" — heads up, the herd watching, glow mid
      return { glow:0.52, members:[
        {kind:"cow",   x:0.15, headDrop:0.10, scale:0.98},
        {kind:"sheep", x:0.44, headDrop:0.06, scale:0.90},
        {kind:"cow",   x:0.68, headDrop:0.12, scale:1.05},
        {kind:"sheep", x:0.90, headDrop:0.08, scale:0.84},
      ], hides:[] };
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const t = state.t || 0;
  const S = Math.min(W, H) * 0.58;
  const U = Math.min(W, H) * 0.150;
  const groundY = H*0.72;
  const L = layoutFor(state);

  // ---- sacred SUN-GLOW behind the herd (drawn first, deepest back) ----
  drawSunGlow(pen, W*0.50, H*0.28, W*0.16, L.glow, t);

  // ---- faint meadow ground line ----
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, groundY+2); ctx.lineTo(W*0.97, groundY+2); ctx.stroke(); ctx.restore();

  // ---- downed hides (behind the standing herd) ----
  for(const hd of L.hides) drawDownHide(pen, W*hd.x, groundY, U, hd.dir, hd.woolly);

  // ---- the mixed herd, all facing +x ----
  for(const m of L.members){
    if (m.kind==="cow") drawCow(pen, W*m.x, groundY, S, +1, { headDrop:m.headDrop, t, scale:m.scale });
    else                drawSheep(pen, W*m.x, groundY, U, +1, { headDrop:m.headDrop, t, scale:m.scale });
  }
}

export const asset = {
  id:"creature.helioss-cattle-and-sheep",
  type:"CREATURE",
  name:"Helios's cattle and sheep",
  statusWord:"IMMORTAL",
  scene:"OD-B12-S05",

  // procedural knobs — divine ownership + persistent, unaging counts
  params:{
    owner:"Helios",          // divine ownership
    immortal:true,           // unaging herds
    persistent:true,         // count persists across scenes
    cattleHerds:7, perCattleHerd:50,   // 350 kine (Homer's tally)
    sheepFlocks:7, perSheepFlock:50,   // 350 sheep
    cattleHide:"#c9c4b6",    // radiant warm hide (light)
    hornBone:"#efeadd",      // pale broad lyre-horn
    fleece:"#b7b2a4",        // woolly sheep
    glow:0.52,               // 0..1 sacred sun-glow intensity
    mixRatio:0.5,            // cattle:sheep in the drawn sample
    collision:true,          // hoof footprints exposed for placement
  },
  // back -> front draw order (glow behind; hides; each beast layered internally)
  layers:["glow-rays","glow-disk","ground","hides","shadow","tail","far-legs",
          "body","hump","neck","far-horn","head","ear","near-horn","eye","near-legs","fleece"],
  // normalized 0..1 attention / contact / ownership anchors
  anchors:{
    "sun:core":{x:.50,y:.28}, "sun:vent":{x:.50,y:.10},
    "herd:center":{x:.50,y:.58},
    "cow:a-head":{x:.28,y:.46}, "sheep:a-head":{x:.48,y:.52},
    "cow:b-head":{x:.72,y:.46}, "sheep:b-head":{x:.90,y:.52},
    "hide:down":{x:.60,y:.66},          // a slaughtered beast laid out
    "camera:meadow":{x:.50,y:.55},
  },
  // hoofprint footprints for placement / pathing / collision
  zones:{
    "herd:graze":{ x0:.08,y0:.58,x1:.94,y1:.86 },
    "meadow":{ x0:.04,y0:.70,x1:.96,y1:.92 },
    walkable:{ x0:.04,y0:.70,x1:.96,y1:.92 },
  },
  states:{
    initial:"observe",
    nodes:{
      graze:{     preview:{ pose:"graze",     t:0.3 } },  // heads down, glow low
      observe:{   preview:{ pose:"observe",   t:0.4 } },  // heads UP, watching
      slaughter:{ preview:{ pose:"slaughter", t:0.7 } },  // one beast down, glow flaring
      omen:{      preview:{ pose:"omen",       t:1.1 } },  // hides on the ground, sun-burst
    },
    edges:[
      ["graze","observe"],["observe","graze"],["observe","slaughter"],
      ["slaughter","omen"],["graze","slaughter"],
    ],
  },
  channels:["pose","glow","headDrop","gaze","t"],

  preview:()=>({ pose:"observe", t:0.4, status:"IMMORTAL", progress:.28 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
