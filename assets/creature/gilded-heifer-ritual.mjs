/* creature.gilded-heifer-ritual — sacrificial heifer with gilded horns.
   CREATURE asset. A single bovine quadruped (NOT humanoid): fully custom
   geometry built from engine primitives — deep barrel body, four articulated
   legs (upper/lower + hoof), thick dewlapped neck, elongated head with muzzle
   and ears, and a pair of curved GILDED horns rendered near-paper-bright with
   a specular highlight so they read as polished gold against the dark hide.
   States drive the ritual: procession (adorned, standing, garlanded),
   sacrifice (head bowed to a low altar stone, forelegs braced), feast
   (recumbent, legs folded, the rite complete). Drawn in SOLID grays + hard
   contour; the engine POST pass supplies the dot-matrix halftone.
   Atlas: OD-B03-S05 — heifer with horn-gilding, procession / sacrifice / feast. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---- tone levels (flat grays; POST turns them into dots) ---- */
const T_HIDE    = ()=> toneSolid(inkLevel(4));
const T_BELLY   = ()=> toneSolid(inkLevel(3));
const T_NEARLEG = ()=> toneSolid(inkLevel(5));
const T_FARLEG  = ()=> toneSolid(inkLevel(6));
const T_HEAD    = ()=> toneSolid(inkLevel(4));
const T_MUZZLE  = ()=> toneSolid(inkLevel(5));
const T_EAR     = ()=> toneSolid(inkLevel(6));
const T_HORN    = ()=> toneSolid(inkLevel(4));   // gilded: solid metal body (bright specular sells the gold)
const T_HORNSH  = ()=> toneSolid(inkLevel(6));   // horn shadow/base band
const T_ALTAR   = ()=> toneSolid(inkLevel(2));
const T_ALTARTOP= ()=> toneSolid(inkLevel(4));
const T_GARLAND = ()=> toneSolid(inkLevel(6));

const P = (x,y)=>({x,y});

/* ---------- one leg: upper + lower segment + hoof ---------- */
function drawLeg(pen, hip, knee, hoof, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(hoof.x,hoof.y); }, tone, w*0.80);
  // hoof block (cloven hint)
  pen.paint(()=>{ g.ellipse(hoof.x, hoof.y, w*0.62, w*0.44, 0, 0, 7); }, T_FARLEG(), 3.5);
  pen.ink(()=>{ g.moveTo(hoof.x, hoof.y - w*0.30); g.lineTo(hoof.x, hoof.y + w*0.30); }, 2);
}

/* ---------- gilded horn: bold curved cornucopia, bright metal + specular ----
   Rendered light (few dots) with a HARD dark contour so the horn reads as a
   polished gilded volume; a dark root band + a paper-bright specular sell the
   gold. Sweeps outward-up then curls inward to a point (classic ox horn). */
function drawHorn(pen, base, dir, out, up, U, curlIn=0.6){
  const g = pen.ctx;
  const wB = U*0.135;                                   // base half-width (thick root)
  const wT = U*0.045;                                   // tip half-width (keep body, no vanishing)
  const mid = P(base.x + dir*out*0.85, base.y - up*0.52);
  const tip = P(base.x + dir*out*(0.85 - curlIn*1.05), base.y - up*1.02);
  // outer/inner control offsets (perpendicular-ish) so the horn keeps body
  pen.paint(()=>{
    g.moveTo(base.x - dir*wB*0.5, base.y + wB*0.5);
    g.quadraticCurveTo(mid.x - dir*wT*2.4, mid.y + wT*1.2, tip.x - dir*wT, tip.y + wT); // outer edge -> tip
    g.lineTo(tip.x + dir*wT, tip.y - wT);
    g.quadraticCurveTo(mid.x + dir*wT*2.8, mid.y - wT*1.4, base.x + dir*wB, base.y - wB*0.3); // inner edge back
    g.closePath();
  }, T_HORN(), 4);
  // dark root band (where horn meets the skull)
  pen.paint(()=>{ g.ellipse(base.x, base.y, wB*0.85, wB*0.55, 0, 0, 7); }, T_HORNSH(), 3);
  // specular highlight streak (paper-bright) riding the outer curve
  g.save();
  g.strokeStyle = inkLevel(0); g.lineWidth = Math.max(2, wB*0.42); g.lineCap="round";
  g.beginPath();
  g.moveTo(base.x - dir*wB*0.2, base.y - wB*0.2);
  g.quadraticCurveTo(mid.x - dir*wT*1.2, mid.y, tip.x, tip.y + wT*2);
  g.stroke();
  g.restore();
}

/* ---------- head: skull, muzzle, ear, eye, + two gilded horns ---------- */
function drawHead(pen, HC, rx, ry, dir, U, ang, { bow=0 }={}){
  const g = pen.ctx;
  g.save();
  g.translate(HC.x, HC.y); g.rotate(dir*ang); g.translate(-HC.x, -HC.y);

  // far ear (behind skull, jutting sideways/back)
  pen.paint(()=>{
    g.ellipse(HC.x - dir*rx*0.55, HC.y + ry*0.05, rx*0.46, ry*0.24, dir*0.15, 0, 7);
  }, toneSolid(inkLevel(5)), 3);

  // elongated muzzle / face (front of head)
  const mTip = P(HC.x + dir*rx*1.15, HC.y + ry*0.34);
  pen.paint(()=>{
    g.moveTo(HC.x + dir*rx*0.25, HC.y - ry*0.55);
    g.quadraticCurveTo(HC.x + dir*rx*1.05, HC.y - ry*0.35, mTip.x, mTip.y);       // bridge -> nose top
    g.quadraticCurveTo(mTip.x + dir*rx*0.06, HC.y + ry*0.75, HC.x + dir*rx*0.75, HC.y + ry*0.92); // nose -> lower lip
    g.quadraticCurveTo(HC.x + dir*rx*0.15, HC.y + ry*0.95, HC.x - dir*rx*0.10, HC.y + ry*0.55);   // jaw
    g.closePath();
  }, T_MUZZLE(), 4);

  // skull / forehead mass
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, rx, ry, 0, 0, 7); }, T_HEAD(), 4);

  // near ear (over skull, jutting sideways)
  pen.paint(()=>{
    g.ellipse(HC.x - dir*rx*0.42, HC.y + ry*0.14, rx*0.50, ry*0.26, dir*0.10, 0, 7);
  }, toneSolid(inkLevel(5)), 3);

  // eye + nostril
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(HC.x + dir*rx*0.42, HC.y - ry*0.02, rx*0.13, rx*0.11, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(mTip.x - dir*rx*0.06, HC.y + ry*0.42, rx*0.11, rx*0.08, 0, 0, 7); g.fill();
  // mouth line
  pen.ink(()=>{ g.moveTo(mTip.x, HC.y + ry*0.66); g.lineTo(HC.x + dir*rx*0.45, HC.y + ry*0.72); }, 2);

  // ---- GILDED HORNS (spring from the poll / forehead top) ----
  const hbF = P(HC.x - dir*rx*0.30, HC.y - ry*0.72);   // far horn base (back)
  const hbN = P(HC.x + dir*rx*0.05, HC.y - ry*0.86);   // near horn base (fore)
  drawHorn(pen, hbF, dir,  U*0.30, U*0.42, U, 0.35);   // far horn (draw first, back-sweep)
  drawHorn(pen, hbN, dir,  U*0.42, U*0.56, U, 0.55);   // near horn (bigger, fore-sweep)
  g.restore();
}

/* ---------- STANDING heifer (procession / sacrifice) ---------- */
function drawStanding(pen, cx, groundY, S, dir, { walk=0, bow=0, garland=0 }, t){
  const g = pen.ctx;
  const U = S*0.30;
  const back = S*0.30;                    // withers/back height above ground
  const shoulderX = cx + dir*U*0.44;
  const hipX      = cx - dir*U*0.52;

  // walk swing
  const ph = t*3;
  const sw  = walk ? Math.sin(ph)*U*0.10 : 0;
  const sw2 = walk ? Math.sin(ph+Math.PI)*U*0.10 : 0;

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+5, U*0.95, U*0.16, 0, 0, 7); g.fill(); g.restore();

  // ---- tail with tuft (behind rear) ----
  const tb = P(hipX - dir*U*0.10, groundY - back*0.92);
  const tt = P(hipX - dir*U*0.22, groundY - back*0.18);
  pen.limb(()=>{ g.moveTo(tb.x,tb.y); g.quadraticCurveTo(hipX - dir*U*0.30, groundY - back*0.55, tt.x, tt.y); }, T_HIDE(), U*0.06);
  pen.paint(()=>{ g.ellipse(tt.x, tt.y + U*0.04, U*0.07, U*0.12, dir*0.2, 0, 7); }, T_FARLEG(), 3);

  // ---- FAR legs (darker, drawn first) ----
  const off = dir*U*0.06;
  drawLeg(pen, P(shoulderX-off, groundY-back*0.82), P(shoulderX-off+dir*U*0.02, groundY-back*0.42),
          P(shoulderX-off+dir*U*0.04 - sw2, groundY), U*0.115, T_FARLEG());
  drawLeg(pen, P(hipX-off, groundY-back*0.82), P(hipX-off+dir*U*0.02, groundY-back*0.42),
          P(hipX-off+dir*U*0.02 - sw, groundY), U*0.115, T_FARLEG());

  // ---- deep barrel body ----
  const W  = P(shoulderX, groundY - back);                         // withers
  const R  = P(hipX,      groundY - back*0.98);                    // rump/croup (slightly lower)
  const CF = P(shoulderX + dir*U*0.30, groundY - back*0.52);       // chest front
  const RB = P(hipX - dir*U*0.22,      groundY - back*0.52);       // rear thigh
  const BF = P(shoulderX - dir*U*0.02, groundY - back*0.24);       // belly front
  const BR = P(hipX + dir*U*0.10,      groundY - back*0.22);       // belly rear
  pen.paint(()=>{
    g.moveTo(CF.x, CF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.18, W.y - back*0.06, W.x, W.y);   // chest -> withers
    g.quadraticCurveTo(cx, W.y - back*0.02, R.x, R.y);                        // long level back
    g.quadraticCurveTo(hipX - dir*U*0.20, R.y + back*0.10, RB.x, RB.y);       // croup -> rear thigh
    g.quadraticCurveTo(hipX + dir*U*0.02, BR.y - back*0.02, BR.x, BR.y);      // rear -> belly rear
    g.quadraticCurveTo(cx, BR.y + back*0.10, BF.x, BF.y);                     // deep belly
    g.quadraticCurveTo(shoulderX + dir*U*0.18, BF.y - back*0.02, CF.x, CF.y); // brisket -> chest
    g.closePath();
  }, T_HIDE(), 4.5);
  // belly shading undercut
  pen.paint(()=>{
    g.moveTo(BF.x, BF.y);
    g.quadraticCurveTo(cx, BR.y + back*0.10, BR.x, BR.y);
    g.lineTo(BR.x, BR.y + back*0.05);
    g.quadraticCurveTo(cx, BR.y + back*0.14, BF.x, BF.y + back*0.05);
    g.closePath();
  }, T_BELLY(), 3);

  // ---- neck + dewlap up to head ----
  const bowLift = lerp(0, back*0.72, bow);            // head bows down for sacrifice
  const HC = P(shoulderX + dir*U*0.62, groundY - back*1.14 + bowLift);
  const rx = U*0.24, ry = U*0.20;
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.06, groundY - back*0.96);                     // nape at withers
    g.quadraticCurveTo(HC.x - dir*rx*0.7, HC.y - ry*0.6, HC.x - dir*rx*0.1, HC.y - ry*0.3); // crest -> poll
    g.lineTo(HC.x + dir*rx*0.4, HC.y + ry*0.7);                                // throat top at head
    g.quadraticCurveTo(shoulderX + dir*U*0.50, groundY - back*0.44, CF.x + dir*U*0.02, CF.y); // dewlap -> brisket
    g.closePath();
  }, T_HIDE(), 4.5);

  // ---- garland / ritual ribbon across neck (procession) ----
  if (garland){
    pen.limb(()=>{
      g.moveTo(shoulderX + dir*U*0.10, groundY - back*0.90);
      g.quadraticCurveTo(HC.x - dir*rx*0.2, HC.y + ry*0.9, HC.x + dir*rx*0.2, HC.y + ry*1.1);
    }, T_GARLAND(), U*0.07);
    // hanging flower knots
    g.fillStyle = inkLevel(6);
    for (let i=0;i<3;i++){
      const tt2 = 0.35 + i*0.22;
      const x = lerp(shoulderX + dir*U*0.10, HC.x, tt2);
      const y = lerp(groundY - back*0.90, HC.y + ry*1.0, tt2) + U*0.05;
      g.beginPath(); g.arc(x, y, U*0.045, 0, 7); g.fill();
    }
  }

  // ---- head with gilded horns ----
  drawHead(pen, HC, rx, ry, dir, U, bow*0.5, { bow });

  // ---- NEAR legs (over body, lighter) ----
  drawLeg(pen, P(shoulderX, groundY-back*0.82), P(shoulderX+dir*U*0.02, groundY-back*0.42),
          P(shoulderX+dir*U*0.04 + sw, groundY), U*0.125, T_NEARLEG());
  drawLeg(pen, P(hipX, groundY-back*0.82), P(hipX+dir*U*0.02, groundY-back*0.42),
          P(hipX+dir*U*0.02 + sw2, groundY), U*0.125, T_NEARLEG());
}

/* ---------- RECUMBENT heifer (feast — the rite complete) ---------- */
function drawLying(pen, cx, groundY, S, dir, t){
  const g = pen.ctx;
  const U = S*0.30;
  const back = S*0.18;
  const shoulderX = cx + dir*U*0.46;
  const hipX      = cx - dir*U*0.54;

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, groundY+4, U*1.1, U*0.16, 0, 0, 7); g.fill(); g.restore();

  // folded far legs (tucked under)
  pen.paint(()=>{ g.ellipse(shoulderX + dir*U*0.10, groundY - back*0.14, U*0.24, U*0.12, dir*0.2, 0, 7); }, T_FARLEG(), 3.5);
  pen.paint(()=>{ g.ellipse(hipX + dir*U*0.06, groundY - back*0.14, U*0.26, U*0.13, -dir*0.15, 0, 7); }, T_FARLEG(), 3.5);

  // ---- long recumbent barrel (low, on the ground) ----
  const W  = P(shoulderX, groundY - back*1.02);
  const R  = P(hipX,      groundY - back*0.96);
  const CF = P(shoulderX + dir*U*0.34, groundY - back*0.30);
  const RB = P(hipX - dir*U*0.26,      groundY - back*0.30);
  pen.paint(()=>{
    g.moveTo(CF.x, CF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.18, W.y - back*0.06, W.x, W.y);
    g.quadraticCurveTo(cx, W.y - back*0.02, R.x, R.y);
    g.quadraticCurveTo(hipX - dir*U*0.24, R.y + back*0.16, RB.x, RB.y);
    g.quadraticCurveTo(hipX + dir*U*0.06, groundY - back*0.06, cx, groundY - back*0.05); // belly on ground
    g.quadraticCurveTo(shoulderX - dir*U*0.02, groundY - back*0.06, CF.x, CF.y);
    g.closePath();
  }, T_HIDE(), 4.5);

  // near folded legs (over body)
  pen.paint(()=>{ g.ellipse(shoulderX + dir*U*0.16, groundY - back*0.12, U*0.26, U*0.13, dir*0.2, 0, 7); }, T_NEARLEG(), 3.5);
  pen.ink(()=>{ g.moveTo(shoulderX + dir*U*0.30, groundY - back*0.02); g.lineTo(shoulderX + dir*U*0.42, groundY); }, 3); // extended foreleg hoof
  pen.paint(()=>{ g.ellipse(shoulderX + dir*U*0.46, groundY, U*0.08, U*0.05, 0, 0, 7); }, T_FARLEG(), 3);

  // ---- neck laid low, head resting near ground ----
  const HC = P(shoulderX + dir*U*0.78, groundY - back*0.42);
  const rx = U*0.23, ry = U*0.19;
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.04, groundY - back*0.98);
    g.quadraticCurveTo(HC.x - dir*rx*0.6, HC.y - ry*0.8, HC.x - dir*rx*0.1, HC.y - ry*0.4);
    g.lineTo(HC.x + dir*rx*0.4, HC.y + ry*0.7);
    g.quadraticCurveTo(shoulderX + dir*U*0.44, groundY - back*0.10, CF.x + dir*U*0.02, CF.y);
    g.closePath();
  }, T_HIDE(), 4.5);

  // head with gilded horns, tilted resting
  drawHead(pen, HC, rx, ry, dir, U, 0.35, { bow:0 });
}

/* ---------- low altar stone (ritual context) ---------- */
function drawAltar(pen, cx, groundY, S, dir){
  const g = pen.ctx;
  const aw = S*0.28, ah = S*0.11;
  const ax = cx + dir*S*0.30;                    // in front of the head
  pen.paint(()=>{ g.rect(ax - aw/2, groundY - ah, aw, ah + S*0.02); }, T_ALTAR(), 5);   // block
  pen.paint(()=>{ g.rect(ax - aw*0.58, groundY - ah - S*0.02, aw*1.16, S*0.03); }, T_ALTARTOP(), 4); // top slab
  // course seams
  pen.ink(()=>{ g.moveTo(ax - aw/2, groundY - ah*0.5); g.lineTo(ax + aw/2, groundY - ah*0.5); }, 2);
  pen.ink(()=>{ g.moveTo(ax, groundY - ah); g.lineTo(ax, groundY + S*0.02); }, 2);
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const S = Math.min(W, H) * 1.05;
  const groundY = H*0.70;
  const dir = state.faceDir || 1;
  const t = state.t || 0;
  const pose = state.pose || "procession";

  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.04, groundY+2); ctx.lineTo(W*0.96, groundY+2); ctx.stroke(); ctx.restore();

  const cx = W*0.46;
  if (pose === "sacrifice"){
    drawAltar(pen, cx, groundY, S, dir);
    drawStanding(pen, cx, groundY, S, dir, { walk:0, bow:1, garland:0.6 }, t);
  } else if (pose === "feast"){
    drawAltar(pen, cx, groundY, S, dir);
    drawLying(pen, cx, groundY, S, dir, t);
  } else { // procession
    drawStanding(pen, cx, groundY, S, dir, { walk:1, bow:0, garland:1 }, t);
  }
}

export const asset = {
  id:"creature.gilded-heifer-ritual",
  type:"CREATURE",
  name:"Gilded heifer ritual",
  statusWord:"CONSECRATED",
  scene:"OD-B03-S05",

  // procedural knobs
  params:{
    hornGild:1.0,        // 0..1 brightness of the gilded horns
    hornSpread:1.0,      // horn spread multiplier
    breedMass:1.0,       // barrel/body mass
    faceDir:+1,          // orient toward +x (altar)
    garland:1.0,         // ritual adornment
  },
  // back -> front draw order the heifer honors
  layers:["shadow","altar","tail","far-legs","body","belly","neck","garland","head","ears","muzzle","horns","near-legs","eye"],
  // normalized 0..1 attachment / ritual anchors
  anchors:{
    "poll:horns":{x:.72,y:.30}, "horn:near-tip":{x:.80,y:.16}, "horn:far-tip":{x:.66,y:.18},
    "head":{x:.70,y:.36}, "muzzle":{x:.80,y:.42}, "gaze":{x:.94,y:.42},
    "withers":{x:.50,y:.40}, "garland":{x:.62,y:.48},
    "altar":{x:.78,y:.66}, "hoof:front":{x:.60,y:.94}, "hoof:rear":{x:.32,y:.94},
    "handler:left":{x:.06,y:.86}, "camera:profile":{x:.50,y:.50},
  },
  // collision / placement footprint
  zones:{
    collision:{ x0:.20,y0:.34,x1:.72,y1:.92 },
    "altar:collision":{ x0:.64,y0:.56,x1:.92,y1:.92 },
    walkable:{ x0:.04,y0:.72,x1:.96,y1:.96 },
  },
  states:{
    initial:"procession",
    nodes:{
      procession:{ preview:{ pose:"procession", t:0.3 } }, // adorned, led forward (animate t)
      sacrifice:{  preview:{ pose:"sacrifice"  } },         // head bowed to the altar
      feast:{      preview:{ pose:"feast"      } },         // recumbent, the rite complete
    },
    edges:[["procession","sacrifice"],["sacrifice","feast"]],
  },
  channels:["pose","gait","bow","garland","horn-gild","gaze"],

  preview:()=>({ pose:"procession", t:0.3, status:"CONSECRATED", progress:.24 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
