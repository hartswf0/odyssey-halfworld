/* prop.defender-armor-set — the four panoplies of the doorway.
   PROP asset. Book XXII: with the suitors already dying and Antinous face
   down in the food, Telemachus runs to the storeroom and comes back with
   "four shields, eight spears, and four helmets of bronze" — one set each
   for Odysseus, Telemachus, Eumaeus and Philoetius. That kit is this asset.

   It is deliberately NOT `prop.palace-weapons` (the arms hanging on the hall
   beam) and NOT `prop.palace-weapon-collection` (the sixteen-piece inventory
   ledger of the night carry). This is the fighting issue: FOUR sets, held by
   four named men, consumed and damaged over the course of one battle. The
   armature is therefore a 2x2 quad — one bay per defender, identified by pip
   count (1 Odysseus · 2 Telemachus · 3 Eumaeus · 4 Philoetius) — and every
   state is read by what has changed inside the bays and on the eight-notch
   spear ledger along the bottom.

   States (all six the scene calls for):
     carry    — the armful out of the storeroom: eight shafts raked as one
                sheaf, four shields nested edge-on, four helmets threaded
     equip    — issued: four complete bays, helmet up, shield face-on,
                two spears standing.  THE CARD SIGNATURE
     throw    — two shafts launched out of bays 1 and 3, streaks behind them,
                one spear left standing in each; ledger drops to six
     recover  — shafts pulled back out of the dead and returned along a
                hooked lane; one comes back kinked and is set aside
     block    — the shield wall: every shield raised across the helmet,
                spears held low, two incoming points stopped on the bosses
     damage   — the audit: split shield with a shaft through it, dented
                helmet, snapped shaft; two notches crossed off the ledger

   Ink discipline: light planes (level 1–2), dark accents (level 6) on the
   points, bosses and crests only, so most of the paper stays paper. No span
   crosses the full frame — every rule is broken. All numerals are drawn as
   seven-segment GEOMETRY, never as type.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B22-S03. */
import { makePen, toneSolid, inkLevel, INK } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared parameters ---------------- */

const params = {
  shields:4, helmets:4, spears:8, sets:4,
  bearers:["odysseus","telemachus","eumaeus","philoetius"],
  scale:{ shieldDia_m:0.92, spearLen_m:2.15, helmetH_m:0.31 },  // declared world scale
  // the 2x2 bay armature, normalized
  // rows are spaced so the lower bay's crest can never reach the upper bay's
  // base rule — the bearer pips sit in that break and must stay legible
  bays:[ {cx:.275, cy:.350, pips:1}, {cx:.725, cy:.350, pips:2},
         {cx:.275, cy:.682, pips:3}, {cx:.725, cy:.682, pips:4} ],
  unit:0.150,        // bay unit s, fraction of H
  headY:0.062,       // header register top, fraction of H
  digitH:0.058,      // seven-segment digit height (≈51px at 880 — never type)
  ledgerY:0.872,     // eight-notch spear ledger
  body:1, plane:2, bronze:3, leather:2, accent:6,   // ink levels
};

/* ---------------- numerals as GEOMETRY (seven segment) ---------------- */

const SEG = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc", 5:"afgcd",
              6:"afgedc", 7:"abc", 8:"abcdefg", 9:"abcdfg" };

function segDigit(g, x, y, h, d){
  const w = h*0.56, t = h*0.170, half = h/2;
  const S = {
    a:[x+t*.55, y,            w-t*1.10, t],
    g:[x+t*.55, y+half-t/2,   w-t*1.10, t],
    d:[x+t*.55, y+h-t,        w-t*1.10, t],
    f:[x,       y+t*.55,      t, half-t*.85],
    b:[x+w-t,   y+t*.55,      t, half-t*.85],
    e:[x,       y+half+t*.30, t, half-t*.85],
    c:[x+w-t,   y+half+t*.30, t, half-t*.85],
  };
  g.fillStyle = INK;
  for (const s of (SEG[d]||"")) { const r=S[s]; g.fillRect(r[0], r[1], r[2], r[3]); }
  return w;
}
function segNumber(g, x, y, h, value, digits=2){
  const str = String(Math.max(0, value|0)).padStart(digits,"0");
  const w = h*0.56, gap = h*0.22;
  let cx = x;
  for (const ch of str){ segDigit(g, cx, y, h, +ch); cx += w+gap; }
  return cx - gap - x;
}

/* ---------------- item glyphs — light plane, one dark accent each ------------- */

/* Bossed round shield, face-on. r in px.
   plain=true drops the interior rings — what a shield BEHIND another one in a
   stack must be, or the concentric circles cross-hatch into one lozenge. */
function shieldFace(pen, g, cx, cy, r, plain=false){
  if (plain){
    pen.paint(()=>{ g.arc(cx, cy, r, 0, 7); }, toneSolid(inkLevel(params.leather)), 4);
    pen.paint(()=>{ g.arc(cx, cy, r*.80, 0, 7); }, toneSolid(inkLevel(params.body)), 3);
    pen.paint(()=>{ g.arc(cx, cy, r*.19, 0, 7); }, toneSolid(inkLevel(params.accent)), 2.4);
    return;
  }
  pen.paint(()=>{ g.arc(cx, cy, r, 0, 7); }, toneSolid(inkLevel(params.leather)), 4);
  pen.paint(()=>{ g.arc(cx, cy, r*.78, 0, 7); }, toneSolid(inkLevel(params.body)), 3);
  pen.seam(()=>{ g.arc(cx, cy, r*.52, 0, 7); }, 2.4);
  pen.paint(()=>{ g.arc(cx, cy, r*.21, 0, 7); }, toneSolid(inkLevel(params.accent)), 2.6);
  g.fillStyle = INK;
  for (let i=0;i<8;i++){ const a=i/8*Math.PI*2+.39;
    g.beginPath(); g.arc(cx+Math.cos(a)*r*.89, cy+Math.sin(a)*r*.89, r*.052, 0, 7); g.fill(); }
}

/* Shield seen tilted / edge-on — the carried and blocking attitude. */
function shieldEdge(pen, g, cx, cy, r, tilt=0, squash=.34){
  g.save(); g.translate(cx, cy); g.rotate(tilt);
  pen.paint(()=>{ g.ellipse(0, 0, r, r*squash, 0, 0, 7); }, toneSolid(inkLevel(params.leather)), 4);
  pen.paint(()=>{ g.ellipse(0, -r*squash*.26, r*.74, r*squash*.60, 0, 0, 7); },
            toneSolid(inkLevel(params.body)), 2.6);
  pen.paint(()=>{ g.ellipse(0, -r*squash*.26, r*.19, r*squash*.19, 0, 0, 7); },
            toneSolid(inkLevel(params.accent)), 2.2);
  g.restore();
}

/* Bronze helmet: dome, cheek pieces with the face notch, nasal, crest stub. */
function helmet(pen, g, cx, cy, s, { crest=true, tilt=0, dent=false }={}){
  const w = s*.80;
  g.save(); g.translate(cx, cy); g.rotate(tilt);
  if (crest){
    // horsehair: a light plane read by its hatch, not a black cap
    pen.paint(()=>{
      g.moveTo(-w*.34, -s*.40);
      g.quadraticCurveTo(-w*.06, -s*.98, w*.30, -s*.88);
      g.quadraticCurveTo(w*.44, -s*.80, w*.36, -s*.36);
      g.quadraticCurveTo(w*.10, -s*.60, -w*.34, -s*.40);
      g.closePath();
    }, toneSolid(inkLevel(params.plane)), 3);
    g.strokeStyle = INK; g.lineWidth = Math.max(1.6, s*.045); g.lineCap = "round";
    for (let i=0;i<4;i++){ const u=i/3;
      g.beginPath();
      g.moveTo(-w*.26 + u*w*.54, -s*.46 - u*s*.10);
      g.lineTo(-w*.14 + u*w*.48, -s*.76 - u*s*.06);
      g.stroke(); }
  }
  pen.paint(()=>{
    g.moveTo(-w*.50, s*.06);
    g.bezierCurveTo(-w*.54, -s*.62, w*.54, -s*.62, w*.50, s*.06);
    g.lineTo(w*.46, s*.30);
    g.quadraticCurveTo(w*.40, s*.56, w*.20, s*.54);
    g.lineTo(w*.12, s*.20);
    g.lineTo(-w*.12, s*.20);
    g.lineTo(-w*.20, s*.54);
    g.quadraticCurveTo(-w*.40, s*.56, -w*.46, s*.30);
    g.closePath();
  }, toneSolid(inkLevel(params.body)), 3.4);
  pen.seam(()=>{ g.moveTo(-w*.48, s*.03); g.lineTo(w*.48, s*.03); }, 2.4);
  for (const es of [-1,1])
    pen.paint(()=>{ g.ellipse(es*w*.25, s*.16, w*.15, s*.055, 0, 0, 7); },
              toneSolid(inkLevel(params.accent)), 2);
  pen.paint(()=>{ g.rect(-w*.055, s*.20, w*.11, s*.30); }, toneSolid(inkLevel(params.bronze)), 2);
  if (dent){
    // a bronze bowl driven in: notch out of the crown + two split lines
    pen.paint(()=>{
      g.moveTo(-w*.30, -s*.40); g.lineTo(-w*.06, -s*.16);
      g.lineTo(w*.16, -s*.42); g.lineTo(w*.02, -s*.52); g.closePath();
    }, toneSolid(inkLevel(params.accent)), 2.6);
    pen.ink(()=>{ g.moveTo(-w*.06, -s*.16); g.lineTo(-w*.14, s*.04);
                  g.moveTo(-w*.06, -s*.16); g.lineTo(w*.12, s*.00); }, 3);
  }
  g.restore();
}

/* Ash spear: butt at the origin end, point at the far end.
   Drawn from (x,y) as the BUTT, running length `len` along -y, rotated by ang. */
function spear(pen, g, x, y, ang, len, w, { broken=false, bent=false, bloodied=false }={}){
  g.save(); g.translate(x, y); g.rotate(ang);
  // the blade is sized off the SHAFT, not the length — scaling it with len
  // turns a spearhead into a leaf on the long carried shafts
  const head = Math.min(len*.20, w*4.0), top = -(len-head);
  if (bent){
    // a shaft that came back out of a body crooked: two segments with a kink
    const k = -len*.45, up = len*.55;
    pen.paint(()=>{ g.rect(-w/2, k, w, -k); }, toneSolid(inkLevel(params.body)), 3);
    g.save(); g.translate(0, k); g.rotate(-0.55);
    pen.paint(()=>{ g.rect(-w/2, -(up-head), w, up-head); },
              toneSolid(inkLevel(params.body)), 3);
    pen.paint(()=>{
      g.moveTo(0, -up);
      g.quadraticCurveTo( w*1.85, -up+head*.58,  w*.52, -(up-head));
      g.lineTo(-w*.52, -(up-head));
      g.quadraticCurveTo(-w*1.85, -up+head*.58, 0, -up);
    }, toneSolid(inkLevel(params.accent)), 2.6);
    g.restore();
    // hard ink ticks at the kink — the reason it is set aside
    pen.ink(()=>{ g.moveTo(-w*1.5, k+w*.6); g.lineTo(-w*.5, k);
                  g.moveTo( w*1.5, k+w*.2); g.lineTo( w*.5, k); }, 3);
    g.restore(); return;
  }
  const shaftLen = broken ? (len-head)*.55 : (len-head);
  pen.paint(()=>{ g.rect(-w/2, -shaftLen, w, shaftLen); }, toneSolid(inkLevel(params.body)), 3);
  // grip whipping — two short bronze ferrules, the only dark on the shaft
  pen.paint(()=>{ g.rect(-w*.86, -shaftLen*.42, w*1.72, len*.030); },
            toneSolid(inkLevel(params.bronze)), 2);
  pen.paint(()=>{ g.rect(-w*.80, -len*.030, w*1.60, len*.030); },
            toneSolid(inkLevel(params.bronze)), 2);
  if (broken){
    // splintered stump, and the head half lying free just beyond it
    pen.ink(()=>{ g.moveTo(-w*.5, -shaftLen); g.lineTo(-w*.14, -shaftLen-len*.045);
                  g.lineTo(w*.16, -shaftLen+len*.012); g.lineTo(w*.5, -shaftLen-len*.035); }, 3);
    g.save(); g.translate(w*2.1, -shaftLen-len*.055); g.rotate(0.72);
    pen.paint(()=>{ g.rect(-w/2, -(len*.30-head), w, len*.30-head); },
              toneSolid(inkLevel(params.body)), 3);
    pen.paint(()=>{
      g.moveTo(0, -len*.30);
      g.quadraticCurveTo( w*1.75, -len*.30+head*.58,  w*.52, -(len*.30-head));
      g.lineTo(-w*.52, -(len*.30-head));
      g.quadraticCurveTo(-w*1.75, -len*.30+head*.58, 0, -len*.30);
    }, toneSolid(inkLevel(params.accent)), 2.6);
    g.restore(); g.restore(); return;
  }
  pen.paint(()=>{
    g.moveTo(0, -len);
    g.quadraticCurveTo( w*1.85, -len+head*.58,  w*.52, -shaftLen);
    g.lineTo(-w*.52, -shaftLen);
    g.quadraticCurveTo(-w*1.85, -len+head*.58, 0, -len);
  }, toneSolid(inkLevel(params.accent)), 2.8);
  pen.seam(()=>{ g.moveTo(0, -len+w*1.1); g.lineTo(0, -shaftLen-2); }, 2);
  if (bloodied){
    g.fillStyle = INK;
    for (let i=0;i<4;i++){
      g.beginPath(); g.arc(w*(i%2?.36:-.34), -shaftLen-len*.020-i*len*.030, w*.30, 0, 7); g.fill();
    }
  }
  g.restore();
}

/* Motion streaks trailing a moving piece. */
function streaks(g, x, y, ang, n=3, len=70, gap=12){
  g.save(); g.translate(x,y); g.rotate(ang);
  g.strokeStyle = "rgba(0,0,0,0.30)"; g.lineCap="round";
  for (let i=0;i<n;i++){ g.lineWidth = 6-i*1.3;
    g.beginPath(); g.moveTo(i*gap - (n-1)*gap/2, 0); g.lineTo(i*gap-(n-1)*gap/2, len-i*len*.16); g.stroke(); }
  g.restore();
}

/* A BROKEN base rule under a bay, with the bearer's pip count seated in the
   break — never a full-width bar, and the identity number is geometry, not
   type. n = 1 Odysseus · 2 Telemachus · 3 Eumaeus · 4 Philoetius. */
function baseTick(pen, g, cx, y, half, n, r){
  pen.ink(()=>{ g.moveTo(cx-half, y); g.lineTo(cx-half*.34, y);
                g.moveTo(cx+half*.34, y); g.lineTo(cx+half, y); }, 4);
  g.fillStyle = INK;
  const step = r*2.7, x0 = cx - step*(n-1)/2;
  for (let i=0;i<n;i++){ g.beginPath(); g.arc(x0+i*step, y, r, 0, 7); g.fill(); }
}

/* ---------------- the bay: one man's panoply ---------------- */
/* opts: { spearsLeft, shield:"face"|"raised"|"split"|null, helmetDent,
           snapped, incoming, launched, returning, bent } */
function bay(pen, g, W, H, B, s, opts={}){
  const cx = W*B.cx, cy = H*B.cy;
  const sh = opts.shield === undefined ? "face" : opts.shield;
  const nSpear = opts.spearsLeft === undefined ? 2 : opts.spearsLeft;
  const spW = s*.055, spLen = s*1.52;
  const butY = cy + s*.74;

  // ── standing spears behind, splayed ──
  const slots = [[-1,-0.135],[1,0.135]];
  for (let i=0;i<nSpear;i++){
    const [sd, ang] = slots[i] || slots[0];
    spear(pen, g, cx + sd*s*.50, butY, ang, spLen, spW,
          { bloodied: !!opts.bloodied });
  }
  if (opts.snapped){
    spear(pen, g, cx + s*.50, butY, 0.085, spLen, spW, { broken:true });
  }
  if (opts.bent){
    spear(pen, g, cx + s*.62, butY, 0.16, spLen*.92, spW, { bent:true });
  }

  // ── helmet above ──
  if (sh !== "raised") helmet(pen, g, cx, cy - s*.72, s*.46, { dent:!!opts.helmetDent });
  else helmet(pen, g, cx, cy - s*.80, s*.46, { dent:!!opts.helmetDent });

  // ── shield ──
  const r = s*.44;
  if (sh === "face") shieldFace(pen, g, cx, cy + s*.06, r);
  else if (sh === "raised"){
    // brought up across the face: the wall attitude
    shieldFace(pen, g, cx, cy - s*.30, r*1.06);
  } else if (sh === "split"){
    shieldFace(pen, g, cx, cy + s*.06, r);
    // the split: a hard wedge out of the rim and two crack lines
    pen.paint(()=>{
      g.moveTo(cx - r*.10, cy + s*.06);
      g.lineTo(cx - r*.62, cy + s*.06 - r*.80);
      g.lineTo(cx - r*.22, cy + s*.06 - r*.96);
      g.closePath();
    }, toneSolid(inkLevel(0)), 3.4);
    pen.ink(()=>{ g.moveTo(cx - r*.16, cy + s*.06); g.lineTo(cx + r*.52, cy + s*.06 + r*.72);
                  g.moveTo(cx - r*.16, cy + s*.06); g.lineTo(cx + r*.74, cy + s*.06 - r*.30); }, 3.2);
    // the shaft that did it, still standing through the boss (kept inside the
    // bay so it never crosses the base rule)
    spear(pen, g, cx + r*1.02, cy + s*.70, -0.40, s*.92, spW, { bloodied:true });
  }

  // ── an incoming point stopped on the boss ──
  // it arrives from the frame's outside on left-hand bays and from the centre
  // aisle on right-hand bays, so the shaft is never clipped by the edge
  if (opts.incoming){
    const sgn = B.cx < .5 ? 1 : -1;
    const iy = cy - s*.30, ix = cx + sgn*r*1.02;
    spear(pen, g, ix + sgn*s*.95, iy + s*.30, -sgn*1.24, s*.98, spW*.92);
    // deflection ticks radiating off the boss
    g.strokeStyle = INK; g.lineWidth = 4.4; g.lineCap="round";
    for (const a of [-0.95,-0.45,0.05,0.55]){
      g.save(); g.translate(ix, iy); g.rotate(a + (sgn<0?Math.PI:0));
      g.beginPath(); g.moveTo(s*.06, 0); g.lineTo(s*.20, 0); g.stroke(); g.restore();
    }
    // the skid: a short arc off the rim
    g.strokeStyle = "rgba(0,0,0,0.34)"; g.lineWidth = 4.4;
    g.beginPath();
    if (sgn>0) g.arc(cx, iy, r*1.30, -0.85, 0.30);
    else       g.arc(cx, iy, r*1.30, Math.PI-0.30, Math.PI+0.85);
    g.stroke();
  }

  // ── a shaft leaving the bay ──
  // it flies out into the centre aisle, where there is open paper — throwing it
  // over the bay's own helmet only piles ink on ink
  if (opts.launched){
    const lx = cx + s*.55, ly = cy + s*.10;
    streaks(g, lx, ly, 0.90, 3, s*.66, s*.10);
    spear(pen, g, lx, ly, 0.90, spLen*.72, spW);   // stops inside the open aisle
  }
  // ── a shaft coming back into the bay along a hooked lane ──
  if (opts.returning){
    g.strokeStyle = INK; g.lineWidth = 4.4; g.lineCap = "butt";
    g.setLineDash([11,9]);
    g.beginPath();
    g.moveTo(cx + s*1.02, cy - s*.88);
    g.quadraticCurveTo(cx + s*1.30, cy + s*.16, cx + s*.74, cy + s*.46);
    g.stroke(); g.setLineDash([]); g.lineCap = "round";
    // arrowhead pointing back into the bay
    g.fillStyle = INK; g.beginPath();
    g.moveTo(cx + s*.62, cy + s*.52); g.lineTo(cx + s*.84, cy + s*.36);
    g.lineTo(cx + s*.86, cy + s*.58); g.closePath(); g.fill();
  }

}

/* Every bay's base rule + bearer pips, drawn in ONE pass after all four bays
   so a neighbour's crest can never paint over another bay's identity. */
function feet(pen, g, W, H, s){
  for (const B of params.bays)
    baseTick(pen, g, W*B.cx, H*B.cy + s*.86, s*.80, B.pips, s*.046);
}

/* ---------------- header register: the live count, as geometry ---------------- */
/* Left group = shields serviceable, right group = spears in hand.
   The rule between them is BROKEN in three places so nothing stripes. */
function header(pen, g, W, H, { shields, spears }){
  const y = H*params.headY, dh = H*params.digitH;
  // shield pictogram + count, left
  const sx = W*.075;
  pen.paint(()=>{ g.arc(sx, y+dh*.5, dh*.36, 0, 7); }, toneSolid(inkLevel(params.body)), 3);
  pen.paint(()=>{ g.arc(sx, y+dh*.5, dh*.13, 0, 7); }, toneSolid(inkLevel(params.accent)), 2.2);
  segNumber(g, sx + dh*.62, y, dh, shields, 2);
  // spear pictogram + count, right
  const px = W*.915;
  g.save(); g.translate(px, y+dh*.5);
  pen.paint(()=>{ g.rect(-dh*.115, -dh*.10, dh*.23, dh*.72); },
            toneSolid(inkLevel(params.body)), 3.4);
  pen.paint(()=>{
    g.moveTo(0, -dh*.76);
    g.lineTo( dh*.30, -dh*.10);
    g.lineTo(-dh*.30, -dh*.10);
    g.closePath();
  }, toneSolid(inkLevel(params.accent)), 2.8);
  g.restore();
  const wNum = dh*.56*2 + dh*.22;
  segNumber(g, px - dh*.72 - wNum, y, dh, spears, 2);
  // broken rule under the header
  const ry = y + dh*1.34;
  pen.ink(()=>{
    g.moveTo(W*.045, ry); g.lineTo(W*.300, ry);
    g.moveTo(W*.385, ry); g.lineTo(W*.470, ry);
    g.moveTo(W*.560, ry); g.lineTo(W*.640, ry);
    g.moveTo(W*.720, ry); g.lineTo(W*.955, ry);
  }, 3.4);
}

/* ---------------- the eight-notch spear ledger ---------------- */
/* One notch per spear. filled = in hand · hollow = away (thrown/lost) ·
   crossed = broken. Split into two groups of four so it never spans. */
function ledger(pen, g, W, H, marks){
  const y = H*params.ledgerY, h = H*.036, w = W*.062, gap = W*.020;
  const groupW = w*4 + gap*3;
  const starts = [W*.5 - groupW - W*.045, W*.5 + W*.045];
  for (let gi=0; gi<2; gi++){
    let x = starts[gi];
    for (let i=0;i<4;i++){
      const m = marks[gi*4+i] || "in";
      pen.paint(()=>{ g.rect(x, y, w, h); }, toneSolid(inkLevel(params.body)), 3.2);
      if (m === "in")   // in hand: a solid bead seated in the light notch
        pen.paint(()=>{ g.rect(x+w*.26, y+h*.20, w*.48, h*.60); },
                  toneSolid(inkLevel(params.accent)), 2.2);
      if (m === "broken"){
        pen.ink(()=>{ g.moveTo(x+w*.12, y+h*.16); g.lineTo(x+w*.88, y+h*.84);
                      g.moveTo(x+w*.88, y+h*.16); g.lineTo(x+w*.12, y+h*.84); }, 4);
      }
      x += w + gap;
    }
    // a short rule under each group only
    pen.ink(()=>{ g.moveTo(starts[gi], y+h*1.42); g.lineTo(starts[gi]+groupW, y+h*1.42); }, 3);
  }
}

/* ---------------- state renderers ---------------- */

function drawEquip(pen, g, W, H){
  const s = H*params.unit;
  header(pen, g, W, H, { shields:4, spears:8 });
  for (const B of params.bays) bay(pen, g, W, H, B, s, { spearsLeft:2, shield:"face" });
  feet(pen, g, W, H, s);
  ledger(pen, g, W, H, Array(8).fill("in"));
}

/* CARRY — the one armful out of the storeroom. Three legible registers hung
   off a single diagonal axis so the load never collapses into a mass:
     the sheaf of eight shafts on the axis (fanned so eight points separate),
     the four shields stacked edge-on OFF the axis to the left,
     the four helmets threaded OFF the axis to the right. */
function drawCarry(pen, g, W, H){
  header(pen, g, W, H, { shields:4, spears:8 });
  const ang = 0.62;
  const dir = { x:Math.sin(ang), y:-Math.cos(ang) };   // along the shafts
  const per = { x:Math.cos(ang), y: Math.sin(ang) };   // across them
  const cx = W*.420, cy = H*.730, LEN = H*.420, step = W*.030;
  const P = (u,q)=>({ x: cx + dir.x*LEN*u + per.x*q,
                      y: cy + dir.y*LEN*u + per.y*q });

  // drag streaks trailing the butt end of the load
  streaks(g, cx - dir.x*LEN*.05, cy - dir.y*LEN*.05, ang, 3, W*.10, 12);

  // eight shafts, fanned so every point is countable
  for (let i=0;i<8;i++){
    const b = P(0, step*(i-3.5));
    spear(pen, g, b.x, b.y, ang + (i-3.5)*0.026, LEN*(0.90 + (i%3)*0.035), W*.013);
  }
  // two cord bindings across the sheaf (broken hatch, not a bar)
  for (const u of [.16,.52]){
    const c = P(u, 0);
    g.save(); g.translate(c.x, c.y); g.rotate(ang);
    pen.paint(()=>{ g.rect(-step*3.9, -H*.010, step*7.8, H*.020); },
              toneSolid(inkLevel(params.leather)), 3.2);
    g.strokeStyle = INK; g.lineWidth = 2.2;
    for (let x=-step*3.4; x<step*3.6; x+=step*.9){
      g.beginPath(); g.moveTo(x, -H*.010); g.lineTo(x+step*.42, H*.010); g.stroke(); }
    g.restore();
  }
  // four shields carried FACE-ON as a nested stack under the arm — circles are
  // unmistakable at this size, where edge-on ellipses read as foliage
  // stacked up-left away from the ledger; only the front face carries rings,
  // so four discs still count as four
  for (let j=3;j>=0;j--)
    shieldFace(pen, g, W*(.150+j*.055), H*(.640-j*.044), W*.075, j>0);
  // four helmets slung above, threaded on their crests
  for (let j=0;j<4;j++)
    helmet(pen, g, W*(.560+j*.098), H*(.300+(j%2)*.028), H*.058, { tilt:-0.10+j*.06 });

  // a broken bracket that reads the three groups as ONE load
  const B = { x0:W*.055, y0:H*.150, x1:W*.945, y1:H*.815 }, m = W*.075;
  pen.ink(()=>{
    g.moveTo(B.x0, B.y0+m); g.lineTo(B.x0, B.y0); g.lineTo(B.x0+m, B.y0);
    g.moveTo(B.x1-m, B.y0); g.lineTo(B.x1, B.y0); g.lineTo(B.x1, B.y0+m);
    g.moveTo(B.x0, B.y1-m); g.lineTo(B.x0, B.y1); g.lineTo(B.x0+m, B.y1);
    g.moveTo(B.x1-m, B.y1); g.lineTo(B.x1, B.y1); g.lineTo(B.x1, B.y1-m);
  }, 4);
  ledger(pen, g, W, H, Array(8).fill("in"));
}

function drawThrow(pen, g, W, H){
  const s = H*params.unit;
  header(pen, g, W, H, { shields:4, spears:6 });
  const O = params.bays;
  bay(pen, g, W, H, O[0], s, { spearsLeft:1, shield:"raised", launched:true });
  bay(pen, g, W, H, O[1], s, { spearsLeft:2, shield:"raised" });
  bay(pen, g, W, H, O[2], s, { spearsLeft:1, shield:"raised", launched:true });
  bay(pen, g, W, H, O[3], s, { spearsLeft:2, shield:"face" });
  feet(pen, g, W, H, s);
  ledger(pen, g, W, H, ["in","away","in","in","in","away","in","in"]);
}

function drawRecover(pen, g, W, H){
  const s = H*params.unit;
  header(pen, g, W, H, { shields:4, spears:7 });
  const O = params.bays;
  bay(pen, g, W, H, O[0], s, { spearsLeft:2, shield:"face", returning:true, bloodied:true });
  bay(pen, g, W, H, O[1], s, { spearsLeft:2, shield:"face" });
  bay(pen, g, W, H, O[2], s, { spearsLeft:1, shield:"face", returning:true, bent:true });
  bay(pen, g, W, H, O[3], s, { spearsLeft:2, shield:"face", bloodied:true });
  feet(pen, g, W, H, s);
  ledger(pen, g, W, H, ["in","in","in","in","in","in","in","broken"]);
}

function drawBlock(pen, g, W, H){
  const s = H*params.unit;
  header(pen, g, W, H, { shields:4, spears:8 });
  const O = params.bays;
  bay(pen, g, W, H, O[0], s, { spearsLeft:2, shield:"raised", incoming:true });
  bay(pen, g, W, H, O[1], s, { spearsLeft:2, shield:"raised" });
  bay(pen, g, W, H, O[2], s, { spearsLeft:2, shield:"raised" });
  bay(pen, g, W, H, O[3], s, { spearsLeft:2, shield:"raised", incoming:true });
  feet(pen, g, W, H, s);
  ledger(pen, g, W, H, Array(8).fill("in"));
}

function drawDamage(pen, g, W, H){
  const s = H*params.unit;
  header(pen, g, W, H, { shields:3, spears:5 });
  const O = params.bays;
  bay(pen, g, W, H, O[0], s, { spearsLeft:1, shield:"split", bloodied:true });
  bay(pen, g, W, H, O[1], s, { spearsLeft:1, shield:"face", helmetDent:true });
  bay(pen, g, W, H, O[2], s, { spearsLeft:1, shield:"face", snapped:true });
  bay(pen, g, W, H, O[3], s, { spearsLeft:2, shield:"face" });
  feet(pen, g, W, H, s);
  ledger(pen, g, W, H, ["in","broken","in","away","in","broken","in","in"]);
}

const MODES = { carry:drawCarry, equip:drawEquip, throw:drawThrow,
                recover:drawRecover, block:drawBlock, damage:drawDamage };

function draw(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  (MODES[st.mode] || drawEquip)(pen, ctx, W, H);
}

export const asset = {
  id:"prop.defender-armor-set",
  type:"PROP",
  name:"Defender Armor Set",
  statusWord:"ISSUED",
  scene:"OD-B22-S03",

  params,
  // back -> front draw order the module honors
  layers:["motion","spears","helmets","shields","impact","damage",
          "base-ticks","bearer-pips","header-count","ledger"],

  // normalized 0..1 attachment / contact anchors, measured in the EQUIP state
  anchors:{
    "grip:spear":    {x:.175, y:.400},   // a hand closing on the left shaft of bay 1
    "grip:spear:alt":{x:.375, y:.400},   // that bay's right-hand shaft
    "grip:shield":   {x:.275, y:.359},   // the porpax / arm-band behind the boss
    "grip:helmet":   {x:.275, y:.221},   // lifted by the crest
    carry:           {x:.300, y:.640},   // balance point of the whole armful
    "issue:1":       {x:.275, y:.350},   // Odysseus' set
    "issue:2":       {x:.725, y:.350},   // Telemachus' set
    "issue:3":       {x:.275, y:.682},   // Eumaeus' set
    "issue:4":       {x:.725, y:.682},   // Philoetius' set
    "contact:strike":{x:.363, y:.305},   // where a thrown point is stopped on the boss
    "contact:floor": {x:.500, y:.793},   // where the spear butts stand
    "support:wall":  {x:.500, y:.098},   // the count register / rack line
    "ledger:count":  {x:.500, y:.890},   // the eight-notch tally, addressable
  },
  // collision: the footprint of the whole issued kit
  collision:{ kind:"box", a:{x:.045, y:.055}, b:{x:.955, y:.950} },
  ownership:"house-of-odysseus · fetched from the storeroom by Telemachus · issued one set each to Odysseus, Telemachus, Eumaeus, Philoetius",

  states:{
    initial:"carry",
    nodes:{
      carry:  { preview:{ mode:"carry",   status:"CARRIED",  progress:0.10 } },
      equip:  { preview:{ mode:"equip",   status:"ISSUED",   progress:0.28 } },
      throw:  { preview:{ mode:"throw",   status:"LOOSED",   progress:0.48 } },
      block:  { preview:{ mode:"block",   status:"BLOCKING", progress:0.66 } },
      recover:{ preview:{ mode:"recover", status:"RECOVERED",progress:0.82 } },
      damage: { preview:{ mode:"damage",  status:"DAMAGED",  progress:1.00 } },
    },
    edges:[
      ["carry","equip"],["equip","throw"],["throw","block"],["block","throw"],
      ["throw","recover"],["recover","throw"],["block","damage"],["throw","damage"],
      ["recover","damage"],["damage","recover"],["equip","block"],["damage","equip"],
    ],
  },
  channels:["mode","spearsLeft","shieldsIntact","t","progress"],

  // CARD SIGNATURE — ISSUED: four complete bays, one per defender, pip-numbered
  // 1..4. Helmet up, shield face-on, two ash spears standing. Eight notches all
  // filled. Everything after this state is subtraction.
  preview:()=>({ mode:"equip", status:"ISSUED", progress:0.28, t:0 }),

  draw(ctx, W, H, state){
    draw(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
