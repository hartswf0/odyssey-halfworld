/* ensemble.phaeacian-convoy-crew — the silent expert crew that ferries the
   sleeping passenger home.
   ENSEMBLE asset. A convoy company built from ONE separable member template
   (drawSailor: a lean seaman drawn in solid grays + contour) instanced across
   depth bands around a swift Phaeacian ship. Its signature is the SLEEPING
   PASSENGER — a wrapped figure borne on a litter by two bearers — the calm
   centrepiece the whole crew moves around: loaders bringing gifts up the strand,
   a rowing bank pulling her off, a helmsman navigating at the steering oar, all
   working WORDLESSLY. Formations select the labour on show (load | row |
   carry-sleeper | depart), and the crew reads as SILENT + EXPERT: heads level,
   no strain, "calm" high. Channels: FORMATION, CALM (0 busy strain .. 1 serene),
   ATTENTION (heads-down at task .. turned to the sleeper), CADENCE (rowing
   stroke phase), DENSITY, SPREAD.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   POST pass supplies the halftone. Do NOT bake named characters in.
   Atlas OD-B13-S01 — silent expert sailors loading gifts, rowing, navigating,
   lifting the sleeping passenger, departing. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const norm = v => { const m=Math.hypot(v.x,v.y)||1; return { x:v.x/m, y:v.y/m }; };
const TAU = Math.PI*2;

/* ---- the labours of the convoy. "sleeper" is a compound unit (two bearers
   + a wrapped body on a litter); every other task is one member template. ---- */
const TASKS = ["load","row","navigate","bear","sleeper"];

/* ---- FORMATIONS: the same sailor template arranged around the ship.
   roster entry = { task, band(0 far..2 near), x(0..1), flip(+1 faces R / -1 L) }.
   task "sleeper" ignores flip and expands to the borne-passenger unit. ---- */
const FORMATIONS = {
  // the hero view: the passenger borne in the foreground, gifts up the strand,
  // the benched bank and helmsman waiting in the ship behind
  "depart": [
    { task:"navigate", band:0, x:0.87, flip:-1 },  // helmsman at the stern oar
    { task:"row",      band:0, x:0.31, flip: 1 },  // oarsmen already benched
    { task:"row",      band:0, x:0.45, flip: 1 },
    { task:"row",      band:0, x:0.59, flip: 1 },
    { task:"load",     band:1, x:0.13, flip: 1 },  // gifts coming up the strand
    { task:"load",     band:1, x:0.88, flip:-1 },
    { task:"sleeper",  band:2, x:0.50, flip: 1 },  // the passenger, hero foreground
  ],
  // loading: a carry-line of gift-bearers filing the treasure aboard
  "load": [
    { task:"load", band:0, x:0.66, flip:-1 },
    { task:"load", band:0, x:0.78, flip:-1 },
    { task:"load", band:1, x:0.24, flip: 1 },
    { task:"load", band:1, x:0.40, flip: 1 },
    { task:"load", band:1, x:0.56, flip: 1 },
    { task:"load", band:2, x:0.18, flip: 1 },
    { task:"load", band:2, x:0.38, flip: 1 },
    { task:"load", band:2, x:0.58, flip: 1 },
    { task:"navigate", band:0, x:0.88, flip:-1 },
  ],
  // rowing: the bank pulling her out to sea, one shared cadence, helm astern
  "row": [
    { task:"row", band:0, x:0.24, flip: 1 },
    { task:"row", band:0, x:0.40, flip: 1 },
    { task:"row", band:0, x:0.56, flip: 1 },
    { task:"row", band:0, x:0.72, flip: 1 },
    { task:"row", band:2, x:0.20, flip: 1 },
    { task:"row", band:2, x:0.40, flip: 1 },
    { task:"row", band:2, x:0.60, flip: 1 },
    { task:"row", band:2, x:0.80, flip: 1 },
    { task:"navigate", band:0, x:0.90, flip:-1 },
  ],
  // the passenger: the bearers lowering the sleeping man aboard, attended
  "carry-sleeper": [
    { task:"sleeper", band:1, x:0.50, flip: 1 },  // the borne passenger, centred
    { task:"load",    band:0, x:0.20, flip: 1 },
    { task:"navigate",band:0, x:0.86, flip:-1 },
    { task:"bear",    band:2, x:0.16, flip: 1 },  // an attendant steadying the litter
    { task:"bear",    band:2, x:0.84, flip:-1 },
  ],
};

const params = {
  formation:"depart",
  bands:3,
  count:24,                  // the convoy company this crew represents
  crowd:11,                  // faint back-rank silhouettes implying the full company
  strandLevel:0.62,          // strand / keel line as fraction of H
  hull:{ prowX:0.10, sternX:0.92, mastX:0.52, mastTopY:0.11 },
  calm:0.8,                  // 0 straining .. 1 serene, expert, unhurried
  attention:0.35,            // 0 heads-down at labour .. 1 turned to the sleeper
  cadence:0.28,              // shared rowing stroke phase 0..1
  spread:1.0,                // formation width multiplier about centre
  density:1.0,               // 0 sparse (near band only) .. 1 full company
};

const BAND_Y   = [0.545, 0.730, 0.918];   // footline per depth band
const BAND_S   = [150, 200, 262];          // sailor height px per band
const BAND_LVL = [3, 4, 3];                // tunic ink level per band

/* ============================================================
   STANDING BODY — the shared skeleton for load / navigate / bear / bearers.
   Draws shadow, legs, torso, neck, head, hair in solid tone + contour.
   Returns the joint geometry so each task attaches its own arms + prop.
   ============================================================ */
function standingBody(pen, g, cx, footY, s, lvl, opt){
  const cloth = toneSolid(inkLevel(lvl));
  const legT  = toneSolid(inkLevel(Math.min(7, lvl+2)));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const cw = Math.max(2, s*0.02);
  const lean = opt.lean || 0;
  const stance = (opt.stance ?? 0.10) * s;

  const hipY = footY - s*0.40;
  const shoulderY = hipY - s*0.28;
  const hipW = s*0.18, shoulderW = s*0.25;
  const headR = s*0.106;
  const hx = cx + lean + (opt.headDX||0);
  const headCy = shoulderY - headR*1.18;

  // ground shadow
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY+s*0.012, s*0.21, s*0.033, 0,0,7); g.fill();

  // legs — an easy, planted stance (expert, unhurried)
  pen.limb(()=>{ g.moveTo(cx-hipW*0.34+lean*0.4, hipY); g.lineTo(cx-stance, footY); }, legT, s*0.070);
  pen.limb(()=>{ g.moveTo(cx+hipW*0.34+lean*0.4, hipY); g.lineTo(cx+stance, footY); }, legT, s*0.070);
  pen.paint(()=>{ g.ellipse(cx-stance, footY, s*0.05, s*0.022, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);
  pen.paint(()=>{ g.ellipse(cx+stance, footY, s*0.05, s*0.022, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);

  // torso tunic (blocky trapezoid, gently sheared by lean)
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hipW/2+lean*0.5, hipY+s*0.02);
    g.lineTo(cx-hipW/2+lean*0.5, hipY+s*0.02);
    g.closePath();
  }, cloth, cw);
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.40+lean*0.7, shoulderY+s*0.15); g.lineTo(cx+shoulderW*0.40+lean*0.7, shoulderY+s*0.15); }, cw*0.7);

  // neck + head
  pen.limb(()=>{ g.moveTo(cx+lean, shoulderY+s*0.004); g.lineTo(hx, headCy+headR*0.7); }, skin, s*0.048);
  pen.paint(()=>{ g.arc(hx, headCy, headR, 0,7); }, skin, cw);
  pen.paint(()=>{ g.arc(hx, headCy-headR*0.05, headR*1.04, Math.PI*1.02, Math.PI*1.98); }, hair, cw*0.8);
  // a level, quiet brow-line (silent, expert — no shouting mouths)
  g.strokeStyle=INK; g.lineWidth=Math.max(2, headR*0.14); g.lineCap="round";
  g.beginPath(); g.moveTo(hx-headR*0.42, headCy-headR*0.02); g.lineTo(hx+headR*0.42, headCy-headR*0.02); g.stroke();

  return { cx, lean, hipY, shoulderY, hipW, shoulderW, headR, hx, headCy, skin, cloth, hair, cw };
}

/* back-resting arm for a standing figure (drawn behind the torso) */
function restArm(pen, g, B, side, s){
  const sh = { x:B.cx - side*B.shoulderW*0.42 + B.lean, y:B.shoulderY + s*0.03 };
  const wr = { x:sh.x - side*s*0.02, y:B.hipY + s*0.02 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(wr.x,wr.y); }, B.cloth, s*0.05);
  pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.026,0,7); }, B.skin, B.cw*0.7);
}

/* ============================================================
   MEMBER TASKS (standing) — each attaches arms + a prop to a standingBody.
   ============================================================ */
function drawStandingTask(pen, g, cx, footY, s, lvl, m, opt){
  const task = m.task, F = m.flip;
  let lean = 0, stance = 0.10;
  if (task==="load"){ lean = F*s*0.05; stance = 0.11; }
  else if (task==="navigate"){ lean = -F*s*0.03; stance = 0.13; }
  else if (task==="bear"){ lean = 0; stance = 0.12; }

  const B = standingBody(pen, g, cx, footY, s, lvl, { lean, stance, headDX:opt.headDX });
  restArm(pen, g, B, -F, s);   // far arm behind
  const shN = { x:B.cx + F*B.shoulderW*0.40 + B.lean, y:B.shoulderY + s*0.03 };
  const skin = B.skin;

  if (task==="load"){
    // a gift borne in both arms at the waist: a chest / tripod cauldron of
    // treasure. Both hands come forward under it.
    const cxG = cx + F*s*0.20, cyG = B.hipY - s*0.04;
    // near arm forward under the load
    const wr = { x:cxG - F*s*0.06, y:cyG + s*0.02 };
    pen.limb(()=>{ g.moveTo(shN.x,shN.y); g.lineTo(cx+F*s*0.14+B.lean, B.shoulderY+s*0.08); g.lineTo(wr.x,wr.y); }, B.cloth, s*0.052);
    // the gift: a lidded chest with a gleaming band (metal = dark), or a tripod
    if ((opt.giftKind||0) % 2 === 0){
      pen.paint(()=>{ g.rect(cxG-s*0.11, cyG-s*0.09, s*0.22, s*0.16); }, toneSolid(inkLevel(5)), B.cw);       // chest body
      pen.paint(()=>{ g.rect(cxG-s*0.115, cyG-s*0.115, s*0.23, s*0.045); }, toneSolid(inkLevel(6)), B.cw);    // lid
      pen.seam(()=>{ g.moveTo(cxG, cyG-s*0.09); g.lineTo(cxG, cyG+s*0.07); }, B.cw*0.7);                      // clasp
      pen.paint(()=>{ g.arc(cxG, cyG-s*0.02, s*0.018, 0,7); }, toneSolid(inkLevel(7)), B.cw*0.6);            // lock
    } else {
      pen.paint(()=>{ g.ellipse(cxG, cyG-s*0.02, s*0.115, s*0.085, 0,0,7); }, toneSolid(inkLevel(6)), B.cw);  // cauldron bowl
      pen.paint(()=>{ g.rect(cxG-s*0.12, cyG-s*0.055, s*0.24, s*0.028); }, toneSolid(inkLevel(7)), B.cw*0.8); // rim
      pen.seam(()=>{ g.moveTo(cxG-s*0.10, cyG+s*0.02); g.lineTo(cxG-s*0.13, cyG+s*0.13); }, B.cw*0.7);        // a tripod leg
      pen.seam(()=>{ g.moveTo(cxG+s*0.10, cyG+s*0.02); g.lineTo(cxG+s*0.13, cyG+s*0.13); }, B.cw*0.7);
    }
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skin, B.cw*0.7);
  }

  else if (task==="navigate"){
    // the helmsman: a tall steering-oar (tiller) planted at the stern, one hand
    // high on the loom, gaze forward down the ship.
    const tillerTop = { x:cx + F*s*0.02, y:B.shoulderY - s*0.16 };
    const tillerBot = { x:cx + F*s*0.30, y:footY + s*0.20 };
    pen.limb(()=>{ g.moveTo(tillerTop.x,tillerTop.y); g.lineTo(tillerBot.x,tillerBot.y); }, toneSolid(inkLevel(5)), s*0.028);
    // steering blade at the water
    pen.paint(()=>{ g.ellipse(tillerBot.x, tillerBot.y, s*0.05, s*0.14, F*0.3,0,7); }, toneSolid(inkLevel(6)), B.cw*0.8);
    // near hand up on the loom
    const wr = { x:tillerTop.x + F*s*0.03, y:tillerTop.y + s*0.05 };
    pen.limb(()=>{ g.moveTo(shN.x,shN.y); g.lineTo(cx+F*s*0.10+B.lean, B.shoulderY); g.lineTo(wr.x,wr.y); }, B.cloth, s*0.05);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skin, B.cw*0.7);
  }

  else if (task==="bear"){
    // an attendant steadying the litter: near arm reaching in toward centre,
    // level. The litter itself belongs to the sleeper unit.
    const wr = { x:cx - F*s*0.24, y:B.shoulderY - s*0.02 };
    pen.limb(()=>{ g.moveTo(shN.x,shN.y); g.lineTo(cx-F*s*0.08+B.lean, B.shoulderY-s*0.02); g.lineTo(wr.x,wr.y); }, B.cloth, s*0.05);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.026,0,7); }, skin, B.cw*0.7);
  }
}

/* ============================================================
   ROWER — a seated oarsman in profile, on the shared cadence (calm unison).
   ============================================================ */
function drawRower(pen, g, cx, benchY, s, lvl, m, opt){
  const F = m.flip;
  const tunic = toneSolid(inkLevel(lvl));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const oarT  = toneSolid(inkLevel(4));
  const lw = Math.max(2, s*0.028);
  const dN = (opt.drive+1)/2;                 // 0 catch .. 1 finish

  const waist = { x:cx, y:benchY + s*0.05 };
  const hipHalf = s*0.13, shoHalf = s*0.155, torsoLen = s*0.40;
  // calm crew: modest lean amplitude even at full stroke
  const a = F * lerp(0.24, -0.26, dN) * (0.5 + 0.5*opt.amp);
  const sho = { x: waist.x + Math.sin(a)*torsoLen, y: waist.y - Math.cos(a)*torsoLen };
  const headR = s*0.115;
  const head = { x: sho.x + Math.sin(a)*headR*0.5 - F*opt.headTurn*headR*0.6, y: sho.y - headR*1.0 };

  const shN = { x: sho.x + F*shoHalf*0.8, y: sho.y + s*0.01 };
  const shF = { x: sho.x - F*shoHalf*0.8, y: sho.y + s*0.01 };
  const armW = Math.max(3, s*0.05);

  // oar: handle (inboard) -> tholepin -> blade (outboard over the sea)
  const handle = { x: sho.x + F*lerp(s*0.26, s*0.04, dN), y: sho.y + lerp(s*0.02, s*0.18, dN) };
  const pivot  = { x: cx + F*s*0.30, y: benchY - s*0.02 };
  const bdir   = norm({ x:F*1.0, y: lerp(0.72, 0.30, dN) });
  const bn     = { x:-bdir.y, y:bdir.x };
  const bladeLen = s*0.74;
  const blade  = { x: pivot.x + bdir.x*bladeLen, y: pivot.y + bdir.y*bladeLen };
  pen.limb(()=>{ g.moveTo(handle.x,handle.y); g.lineTo(pivot.x,pivot.y); }, oarT, Math.max(3,s*0.045));
  pen.limb(()=>{ g.moveTo(pivot.x,pivot.y); g.lineTo(blade.x,blade.y); }, oarT, Math.max(3,s*0.05));
  pen.paint(()=>{
    g.moveTo(blade.x - bdir.x*s*0.03 + bn.x*s*0.05, blade.y - bdir.y*s*0.03 + bn.y*s*0.05);
    g.lineTo(blade.x + bdir.x*s*0.15 + bn.x*s*0.072, blade.y + bdir.y*s*0.15 + bn.y*s*0.072);
    g.lineTo(blade.x + bdir.x*s*0.15 - bn.x*s*0.072, blade.y + bdir.y*s*0.15 - bn.y*s*0.072);
    g.lineTo(blade.x - bdir.x*s*0.03 - bn.x*s*0.05, blade.y - bdir.y*s*0.03 - bn.y*s*0.05);
    g.closePath();
  }, toneSolid(inkLevel(6)), lw*0.8);

  // far arm behind
  pen.limb(()=>{ g.moveTo(shF.x,shF.y); g.lineTo(handle.x,handle.y); }, skin, armW*0.85);
  // torso
  pen.paint(()=>{
    g.moveTo(waist.x - hipHalf, waist.y);
    g.lineTo(waist.x + hipHalf, waist.y);
    g.lineTo(sho.x + shoHalf, sho.y);
    g.lineTo(sho.x - shoHalf, sho.y);
    g.closePath();
  }, tunic, lw);
  // neck + head
  pen.paint(()=>{ g.rect(head.x-headR*0.26, sho.y-headR*0.5, headR*0.52, headR*0.8); }, skin, Math.max(2,s*0.016));
  pen.paint(()=>{ g.ellipse(head.x, head.y+headR*0.08, headR*1.1, headR*1.16, 0,0,7); }, hair, Math.max(2,s*0.02));
  pen.paint(()=>{ g.ellipse(head.x, head.y, headR*0.92, headR, 0,0,7); }, skin, Math.max(2,s*0.024));
  // level, silent face
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.13); g.lineCap="round";
  g.beginPath(); g.moveTo(head.x-F*headR*0.30, head.y-headR*0.02); g.lineTo(head.x+F*headR*0.20, head.y-headR*0.02); g.stroke();
  g.beginPath(); g.moveTo(head.x+F*headR*0.5, head.y+headR*0.12); g.lineTo(head.x+F*headR*0.62, head.y+headR*0.38); g.stroke(); // nose
  // near arm on the loom
  pen.limb(()=>{ g.moveTo(shN.x,shN.y); g.lineTo(handle.x,handle.y); }, skin, armW);
  pen.paint(()=>{ g.arc(handle.x,handle.y,headR*0.22,0,7); }, skin, lw*0.7);
}

/* ============================================================
   SLEEPER UNIT — the signature. A wrapped sleeping passenger on a litter,
   borne level by two bearers. The wrap is near-paper so the passenger reads
   as the calm bright centre; the crew stays quiet grays around him.
   ============================================================ */
function drawSleeperUnit(pen, g, cx, footY, s, lvl, opt){
  s = s*0.86;                                     // a touch smaller so it seats cleanly
  const litterY = footY - s*0.50;                 // borne at bearers' shoulder
  const halfLen = s*0.64;
  const xL = cx - halfLen, xR = cx + halfLen;
  const skin = toneSolid(inkLevel(2));
  const linen = toneSolid(inkLevel(2));           // pale linen wrap (still bright)
  const rug   = toneSolid(inkLevel(4));           // the darker rug he lies on

  // --- the two bearers, facing inward, drawn first (behind the litter) ---
  const bs = s*0.94;
  drawStandingTask(pen, g, xL - s*0.10, footY, bs, lvl, { task:"bear", flip: 1 }, { headDX: bs*0.05 });
  drawStandingTask(pen, g, xR + s*0.10, footY, bs, lvl, { task:"bear", flip:-1 }, { headDX:-bs*0.05 });

  // --- the litter: two carrying-poles the bearers shoulder ---
  const poleTop = litterY, poleBot = litterY + s*0.05;
  pen.paint(()=>{ g.rect(xL - s*0.12, poleTop, (xR-xL)+s*0.24, s*0.028); }, toneSolid(inkLevel(6)), Math.max(2,s*0.016));
  pen.paint(()=>{ g.rect(xL - s*0.12, poleBot, (xR-xL)+s*0.24, s*0.028); }, toneSolid(inkLevel(6)), Math.max(2,s*0.016));

  // --- the rug / bedding platform across the poles ---
  pen.paint(()=>{ g.rect(xL, litterY - s*0.06, xR-xL, s*0.11); }, rug, Math.max(2,s*0.018));
  pen.seam(()=>{ for(let i=1;i<5;i++){ const x=lerp(xL,xR,i/5); g.moveTo(x, litterY-s*0.05); g.lineTo(x, litterY+s*0.04); } }, Math.max(1.5,s*0.01));

  // --- the SLEEPING PASSENGER: a long wrapped mound with a resting head ---
  const bodyTop = litterY - s*0.06;
  pen.paint(()=>{
    // feet end (left) low, hips mound mid, chest to shoulders rising toward head (right)
    g.moveTo(xL + s*0.04, bodyTop);
    g.quadraticCurveTo(cx - s*0.20, bodyTop - s*0.12, cx, bodyTop - s*0.10);   // hip/chest swell
    g.quadraticCurveTo(cx + s*0.28, bodyTop - s*0.16, xR - s*0.14, bodyTop - s*0.06); // toward shoulders
    g.lineTo(xR - s*0.14, bodyTop);
    g.lineTo(xL + s*0.04, bodyTop);
    g.closePath();
  }, linen, Math.max(2,s*0.02));
  // a couple of fold lines in the linen wrap
  pen.seam(()=>{ g.moveTo(cx - s*0.28, bodyTop-s*0.03); g.quadraticCurveTo(cx-s*0.1, bodyTop-s*0.10, cx+s*0.06, bodyTop-s*0.05); }, Math.max(1.5,s*0.011));
  pen.seam(()=>{ g.moveTo(cx + s*0.04, bodyTop-s*0.02); g.quadraticCurveTo(cx+s*0.2, bodyTop-s*0.09, cx+s*0.34, bodyTop-s*0.02); }, Math.max(1.5,s*0.011));

  // the head resting at the right end — calm, eyes closed
  const hR = s*0.13, hx = xR - s*0.04, hy = bodyTop - s*0.14;
  pen.paint(()=>{ g.ellipse(hx, hy+hR*0.1, hR*1.12, hR*1.02, 0,0,7); }, toneSolid(inkLevel(6)), Math.max(2,s*0.018)); // hair/pillow
  pen.paint(()=>{ g.ellipse(hx, hy, hR*0.9, hR*0.98, 0,0,7); }, skin, Math.max(2,s*0.02));
  // closed eye + serene mouth (asleep)
  g.strokeStyle=INK; g.lineWidth=Math.max(2,hR*0.13); g.lineCap="round";
  g.beginPath(); g.moveTo(hx-hR*0.42, hy-hR*0.02); g.lineTo(hx-hR*0.02, hy-hR*0.02); g.stroke();       // closed lid
  g.lineWidth=Math.max(1.5,hR*0.1);
  g.beginPath(); g.moveTo(hx-hR*0.3, hy+hR*0.38); g.lineTo(hx+hR*0.02, hy+hR*0.38); g.stroke();         // mouth
  // a beard hint
  pen.paint(()=>{ g.moveTo(hx-hR*0.3, hy+hR*0.28); g.quadraticCurveTo(hx+hR*0.1, hy+hR*0.9, hx+hR*0.28, hy+hR*0.2);
    g.quadraticCurveTo(hx+hR*0.05, hy+hR*0.5, hx-hR*0.3, hy+hR*0.28); }, toneSolid(inkLevel(5)), Math.max(1.5,s*0.012));
}

/* ============================================================
   SHIP — the swift Phaeacian ship, drawn behind the crew (their destination).
   ============================================================ */
function drawShip(pen, g, W, H){
  const hl = params.hull;
  const px = hl.prowX*W, sx = hl.sternX*W, midX = 0.5*W;
  const prowTop = 0.33*H, sternTop = 0.36*H;
  const sheerMid = 0.470*H, keelMid = 0.585*H, endBot = 0.510*H;

  // hull body (broadside crescent)
  pen.paint(()=>{
    g.moveTo(px, prowTop);
    g.quadraticCurveTo(midX, sheerMid, sx, sternTop);
    g.quadraticCurveTo(sx+W*0.02, (sternTop+endBot)/2, sx-W*0.03, endBot);
    g.quadraticCurveTo(midX, keelMid+H*0.02, px+W*0.03, endBot);
    g.quadraticCurveTo(px-W*0.02, (prowTop+endBot)/2, px, prowTop);
    g.closePath();
  }, toneSolid(inkLevel(3)), 5);
  // planking seams
  for(let k=1;k<=3;k++){
    const dy = k*H*0.022;
    pen.seam(()=>{ g.moveTo(px+W*0.02, prowTop+dy); g.quadraticCurveTo(midX, sheerMid+dy, sx-W*0.02, sternTop+dy); }, 3);
  }
  // gunwale rail
  pen.ink(()=>{ g.moveTo(px, prowTop); g.quadraticCurveTo(midX, sheerMid, sx, sternTop); }, 5);
  // oar-port row
  g.fillStyle = inkLevel(7);
  for(let i=0;i<12;i++){
    const t=(i+0.5)/12, ox=lerp(px+W*0.05, sx-W*0.05, t);
    const oy=lerp(prowTop, sternTop, t)+H*0.018+Math.sin(t*Math.PI)*H*0.024;
    g.beginPath(); g.arc(ox, oy, W*0.006, 0,7); g.fill();
  }
  // curled stempost (prow)
  pen.paint(()=>{
    g.moveTo(px, prowTop);
    g.quadraticCurveTo(px-W*0.05, prowTop-H*0.06, px+W*0.005, prowTop-H*0.085);
    g.quadraticCurveTo(px+W*0.045, prowTop-H*0.10, px+W*0.03, prowTop-H*0.055);
    g.quadraticCurveTo(px+W*0.02, prowTop-H*0.03, px+W*0.03, prowTop);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
  // sternpost tip
  pen.paint(()=>{ g.moveTo(sx, sternTop); g.quadraticCurveTo(sx+W*0.03, sternTop-H*0.05, sx-W*0.005, sternTop-H*0.07);
    g.quadraticCurveTo(sx-W*0.02, sternTop-H*0.02, sx-W*0.02, sternTop); g.closePath(); }, toneSolid(inkLevel(6)), 4);

  // mast + yard + stays
  const mastX=hl.mastX*W, mastTopY=hl.mastTopY*H, deckY=sheerMid;
  pen.paint(()=>{ g.rect(mastX-W*0.008, mastTopY, W*0.016, deckY-mastTopY); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.rect(mastX-W*0.16, mastTopY+H*0.03, W*0.32, H*0.012); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.rect(mastX-W*0.018, mastTopY-H*0.008, W*0.036, H*0.022); }, toneSolid(inkLevel(7)), 4);
  pen.ink(()=>{ g.moveTo(mastX, mastTopY+H*0.01); g.lineTo(px+W*0.02, prowTop); }, 3);
  pen.ink(()=>{ g.moveTo(mastX, mastTopY+H*0.01); g.lineTo(sx-W*0.02, sternTop); }, 3);
  return { mast:{ x:mastX, topY:mastTopY+H*0.01 }, prow:{ x:px, y:prowTop }, stern:{ x:sx, y:sternTop } };
}

/* ============================================================
   STAGE — sea horizon, strand, ship, the convoy company, faint back-rank.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const strand    = (st.strandLevel ?? params.strandLevel) * H;
  const attention = clamp01(st.attention ?? params.attention);
  const calm      = clamp01(st.calm ?? params.calm);
  const cadence   = clamp01(st.cadence ?? params.cadence);
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const formation = st.formation || params.formation;
  const roster0   = FORMATIONS[formation] || FORMATIONS["depart"];

  // sky (lightest)
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,strand);

  // faint back-rank company (implies the full convoy)
  const crowdN = st.crowd ?? params.crowd;
  for(let i=0;i<crowdN;i++){
    const t=(i+0.5)/crowdN;
    const cx=lerp(W*0.08, W*0.92, t) + (i%2?W*0.01:-W*0.01);
    const cy=strand - H*0.070 - Math.abs(Math.sin(t*7))*H*0.012;
    const r=W*0.015;
    g.fillStyle=inkLevel(3);
    g.beginPath(); g.arc(cx, cy, r, 0,7); g.fill();
    g.beginPath(); g.moveTo(cx-r*1.6, cy+r*3.0); g.quadraticCurveTo(cx, cy+r*0.6, cx+r*1.6, cy+r*3.0); g.closePath(); g.fill();
  }

  // strand / foreshore with a launch furrow toward the sea
  g.fillStyle = inkLevel(2); g.fillRect(0,strand,W,H-strand);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.24;
  for(let j=1;j<=4;j++){
    const y=strand+(H-strand)*(j/5);
    g.beginPath();
    for(let x=0;x<=W;x+=W*0.04){ const yy=y+Math.sin(x*0.045+j)*2.5; (x===0?g.moveTo:g.lineTo).call(g,x,yy); }
    g.stroke();
  }
  g.globalAlpha=1;

  // the ship (behind the crew)
  const rig = drawShip(pen, g, W, H);

  // a mooring / boarding line from the prow across the foreground
  pen.ink(()=>{ g.moveTo(rig.prow.x, rig.prow.y); g.lineTo(W*0.20, BAND_Y[2]*H - 0.04*H); }, 3);

  // shared rowing stroke: one drive value for the whole bank -> unison cadence
  const drive = -Math.cos(cadence*TAU);
  const amp = lerp(0.7, 0.4, calm);     // calmer crew => smaller swing

  // members, far band -> near band (painter's order); density culls far ranks
  const roster = roster0
    .map((m,i)=>({ m, i }))
    .filter(({m})=> density>=1 ? true : m.band >= Math.round((1-density)*(params.bands-1)))
    .sort((a,b)=> a.m.band - b.m.band);

  roster.forEach(({m,i})=>{
    const footY = BAND_Y[m.band]*H;
    const s     = BAND_S[m.band];
    const lvl   = BAND_LVL[m.band];
    const nx    = 0.5 + (m.x-0.5)*spread;
    const cx    = clamp(nx,0.06,0.94)*W;
    // calm attention: heads mostly level, only turning toward the sleeper as
    // attention rises. Silent, expert crew => gentle, bounded turn.
    const sleeperX = 0.5*W;
    const headDX = clamp((sleeperX-cx)*0.10*attention, -s*0.09, s*0.09);
    const headTurn = attention*0.5;

    if (m.task==="sleeper"){
      drawSleeperUnit(pen, g, cx, footY, s, lvl, { });
    } else if (m.task==="row"){
      const benchY = footY - s*0.02;
      drawRower(pen, g, cx, benchY, s, lvl, m, { drive, amp, headTurn });
    } else {
      drawStandingTask(pen, g, cx, footY, s, lvl, m, { headDX, giftKind:i });
    }
  });
}

export const asset = {
  id:"ensemble.phaeacian-convoy-crew",
  type:"ENSEMBLE",
  name:"Phaeacian convoy crew",
  statusWord:"SILENT",
  scene:"OD-B13-S01",

  params,
  // ONE sailor member template (load/row/navigate/bear) + a compound sleeper
  // unit, instanced across depth bands around a swift ship
  member:{ template:"sailor", tasks:TASKS, formations:Object.keys(FORMATIONS) },
  // far -> near draw order
  layers:["sky","crowd","strand","ship","mast","mooring","band-far","band-mid","band-near","sleeper"],
  // normalized placement / rig / camera anchors (NOT baked characters)
  anchors:{
    "ship:prow":{x:.10,y:.33}, "ship:stern":{x:.92,y:.36}, "ship:amidships":{x:.52,y:.50},
    "mast:head":{x:.52,y:.12}, "mast:foot":{x:.52,y:.47},
    "station:oarbench":{x:.50,y:.56}, "station:load-line":{x:.30,y:.74},
    "station:sleeper":{x:.62,y:.735}, "station:helm":{x:.88,y:.56},
    "gift:stow":{x:.55,y:.50}, "passenger:head":{x:.66,y:.66},
    "entrance:strand":{x:.08,y:.62}, "exit:seaward":{x:.06,y:.94},
    "camera:wide":{x:.50,y:.50}, "camera:sleeper":{x:.55,y:.62},
  },
  // walkable strand / foreshore for scene pathing / placement
  zones:{ strand:{ x0:.05,y0:.62,x1:.95,y1:.80 }, foreshore:{ x0:.05,y0:.82,x1:.95,y1:.98 } },
  states:{
    initial:"depart",
    nodes:{
      // the hero departure: gifts, benched oars, the passenger borne aboard, helm
      "depart":{        preview:{ formation:"depart",        calm:0.8, attention:0.35, cadence:0.28, density:1.0, spread:1.0 } },
      // loading the treasure aboard in a quiet carry-line
      "loading-gifts":{ preview:{ formation:"load",          calm:0.85, attention:0.2, cadence:0.28, density:1.0, spread:1.0 } },
      // rowing her out — the bank on one calm cadence
      "rowing":{        preview:{ formation:"row",           calm:0.7,  attention:0.1, cadence:0.30, density:1.0, spread:1.0 } },
      // bearing the sleeping passenger aboard, the crew's attention on him
      "carry-sleeper":{ preview:{ formation:"carry-sleeper", calm:0.9,  attention:0.7, cadence:0.28, density:1.0, spread:1.0 } },
    },
    edges:[
      ["depart","loading-gifts"],["loading-gifts","carry-sleeper"],
      ["carry-sleeper","rowing"],["rowing","depart"],["depart","carry-sleeper"],
    ],
  },
  channels:["formation","calm","attention","cadence","density","spread"],

  preview:()=>({ formation:"depart", calm:0.8, attention:0.35, cadence:0.28, density:1.0, spread:1.0,
                 status:"SILENT", progress:.24 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
