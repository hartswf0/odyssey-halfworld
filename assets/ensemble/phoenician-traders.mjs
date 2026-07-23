/* ensemble.phoenician-traders — the foreign merchant-sailors of Sidon.
   ENSEMBLE asset. A trading company built from ONE separable member template
   (a robed, tall-capped merchant + a task rig) instanced deterministically
   around their beached round-ship: BARTERING trinkets (the year-long
   seduction), SECRETLY LOADING stores + a stolen child up the gangway, the
   VOYAGE under sail, and the SLAVE-SALE of a captive on the block. Exposes
   FORMATION (barter | load | voyage | sale | full-trade), density, a SLY
   attention channel (sidelong merchant glances), reaction-wave, spread, and
   depth bands. A faint back-rank implies the wider crew.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify POST pass supplies the halftone. No named characters are baked in
   (the seduced nurse is a scene actor, not part of this ensemble).
   Atlas OD-B15-S04 — Phoenician merchants: seduction, secret loading of goods
   and a child, the voyage, the slave-sale. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* one merchant does one of these; "carry" varies by cargo (jar|chest|child) */
const TASKS = ["barter","carry","sail","sell"];

/* ---- FORMATIONS: the same trader template arranged around the ship.
   entry = { task, band(0 far..2 near), x(0..1), flip(+1 faces R / -1 L),
             cargo?, kind? }  kind:"captive" swaps in the bound-slave template. */
const FORMATIONS = {
  // hero view of OD-B15-S04: seduction + secret loading + the sale, at once
  "full-trade": [
    { task:"barter", band:2, x:0.12, flip: 1 },                 // dangling a necklace, sly
    { task:"carry",  band:1, x:0.52, flip: 1, cargo:"chest" },  // stores up the gangway
    { task:"carry",  band:2, x:0.30, flip: 1, cargo:"child" },  // the stolen child, hidden
    { kind:"captive",band:2, x:0.71, flip: 1 },                 // the slave on the block
    { task:"sell",   band:2, x:0.89, flip:-1 },                 // presenting the captive
    { task:"sell",   band:1, x:0.66, flip:-1, cargo:"coin" },   // taking the buyer's coin
  ],
  // the seduction: merchants fanned out displaying trinkets, all sly glances
  "barter": [
    { task:"barter", band:2, x:0.16, flip: 1 },
    { task:"barter", band:2, x:0.40, flip: 1 },
    { task:"barter", band:1, x:0.28, flip: 1 },
    { task:"barter", band:1, x:0.60, flip:-1 },
    { task:"barter", band:2, x:0.78, flip:-1 },
    { task:"sail",   band:0, x:0.50, flip: 1 },                 // one keeping the ship
  ],
  // secret loading: a carry-line up the gangway — goods, then the child
  "load": [
    { task:"carry", band:2, x:0.18, flip: 1, cargo:"jar"  },
    { task:"carry", band:2, x:0.36, flip: 1, cargo:"chest"},
    { task:"carry", band:1, x:0.30, flip: 1, cargo:"child"},    // the abduction, mid-line
    { task:"carry", band:1, x:0.52, flip: 1, cargo:"jar"  },
    { task:"sail",  band:0, x:0.66, flip:-1 },                  // hand at the gangway head
    { task:"barter",band:2, x:0.82, flip:-1 },                  // a lookout, glancing back
  ],
  // the voyage: aboard, hauling the halyard, the ship at sea (env swaps to sea)
  "voyage": [
    { task:"sail", band:1, x:0.36, flip: 1 },
    { task:"sail", band:1, x:0.52, flip:-1 },
    { task:"sail", band:2, x:0.28, flip: 1 },
    { task:"sail", band:2, x:0.66, flip:-1 },
    { task:"barter", band:2, x:0.50, flip: 1, cargo:"child" },  // watching over the cargo-child
  ],
  // the slave-sale: the captive on the block ringed by seller + buyers
  "sale": [
    { kind:"captive", band:1, x:0.50, flip: 1 },
    { task:"sell",  band:1, x:0.30, flip: 1 },
    { task:"sell",  band:2, x:0.18, flip: 1, cargo:"coin" },
    { task:"barter",band:2, x:0.72, flip:-1 },                 // a buyer inspecting
    { task:"sell",  band:2, x:0.86, flip:-1 },
  ],
};

const params = {
  formation:"full-trade",
  bands:3,
  count:20,                  // the trading company this cast represents
  crowd:10,                  // faint back-rank silhouettes implying the wider crew
  shoreLevel:0.60,           // strand / waterline as fraction of H
  ship:{ prowX:0.86, sternX:0.30, mastX:0.58, mastTopY:0.14 },
  attention:0.6,             // SLY: 0 heads-down at trade .. 1 turned in a sidelong glance
  spread:1.0,
  density:1.0,
  wave:0.0,                  // reaction-wave position across the width
};

const BAND_Y   = [0.630, 0.790, 0.945];
const BAND_S   = [150, 196, 246];
const BAND_LVL = [3, 4, 3];

/* ============================================================
   MEMBER TEMPLATE — one Phoenician merchant, drawn deterministically.
   Long exotic robe + sash + tall forward-flopped cap (Phrygian/Phoenician),
   a short foreign beard, and a single sidelong "sly" eye.
   ============================================================ */
function trader(pen, g, cx, footY, s, task, lvl, m, opt){
  const robe = toneSolid(inkLevel(lvl));
  const skin = toneSolid(inkLevel(2));
  const cap  = toneSolid(inkLevel(6));
  const beardT = toneSolid(inkLevel(5));
  const sash = toneSolid(inkLevel(Math.min(7, lvl+3)));
  const cw   = Math.max(2, s*0.02);
  const F    = m.flip;

  let lean = 0;
  if (task==="sail"){ lean = -F*s*0.09; }
  else if (task==="carry"){ lean = F*s*0.015; }
  else if (task==="barter"){ lean = F*s*0.02; }

  const hipY = footY - s*0.36;
  const shoulderY = hipY - s*0.30;
  const shoulderW = s*0.26, hemW = s*0.46;   // strong A-line robe (reads as gown, not a box)
  const headR = s*0.100;
  const hx = cx + lean;
  const headCy = shoulderY - headR*1.28;

  // ground shadow
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY+s*0.012, s*0.21, s*0.032, 0,0,7); g.fill();

  // feet peeking beneath the hem
  pen.paint(()=>{ g.ellipse(cx-s*0.07, footY, s*0.05, s*0.022, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);
  pen.paint(()=>{ g.ellipse(cx+s*0.07, footY, s*0.05, s*0.022, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);

  // BACK ARM (behind robe) toward the task target
  drawBackArm(pen, g, { x:cx-F*shoulderW*0.40+lean, y:shoulderY+s*0.03 }, task, s, F, robe, skin, cw);

  // ROBE — full-length flaring gown (distinct foreign silhouette)
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hemW/2, footY-s*0.006);
    g.lineTo(cx-hemW/2, footY-s*0.006);
    g.closePath();
  }, robe, cw);
  // centre pleat + a hem fold
  pen.seam(()=>{ g.moveTo(cx+lean*0.6, shoulderY+s*0.06); g.lineTo(cx, footY-s*0.02); }, cw*0.55);
  pen.seam(()=>{ g.moveTo(cx-hemW*0.28, footY-s*0.05); g.lineTo(cx-hemW*0.30, footY-s*0.01); }, cw*0.5);
  // woven sash at the waist (darkest band)
  pen.paint(()=>{ g.rect(cx-shoulderW*0.5+lean, hipY-s*0.018, shoulderW, s*0.045); }, sash, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.5+lean, hipY+s*0.005); g.lineTo(cx+shoulderW*0.5+lean, hipY+s*0.005); }, cw*0.5);

  // NECK + HEAD
  pen.limb(()=>{ g.moveTo(cx+lean, shoulderY+s*0.004); g.lineTo(hx, headCy+headR*0.75); }, skin, s*0.046);
  pen.paint(()=>{ g.arc(hx, headCy, headR, 0,7); }, skin, cw);
  // short foreign beard
  pen.paint(()=>{
    g.moveTo(hx-headR*0.78, headCy+headR*0.10);
    g.quadraticCurveTo(hx, headCy+headR*1.55, hx+headR*0.78, headCy+headR*0.10);
    g.quadraticCurveTo(hx, headCy+headR*0.72, hx-headR*0.78, headCy+headR*0.10);
    g.closePath();
  }, beardT, cw*0.7);
  // TALL forward-flopped cap
  drawCap(pen, g, hx, headCy, headR, F, cap, cw);
  // a single SLY sidelong eye (attention turns the glance)
  const gd = opt.glanceDX || 0;
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(hx + F*headR*0.34 + gd, headCy - headR*0.02, headR*0.13, headR*0.10, 0,0,7); g.fill();
  // brow slash over it (a shrewd look)
  pen.ink(()=>{ g.moveTo(hx+F*headR*0.10+gd, headCy-headR*0.24); g.lineTo(hx+F*headR*0.62+gd, headCy-headR*0.14); }, cw*0.7);

  // FRONT ARM + the visible task
  drawTask(pen, g, { cx, shoulderY, shoulderW, hipY, footY, s, F, lean, skin, robe, cw, opt, task });
}

/* the tall Phrygian-style cap, tip flopped toward the facing direction */
function drawCap(pen, g, hx, cy, r, F, cap, cw){
  pen.paint(()=>{
    g.moveTo(hx - r*0.98, cy - r*0.30);
    g.quadraticCurveTo(hx - r*0.55, cy - r*1.95, hx + F*r*1.35, cy - r*2.05); // up to forward tip
    g.quadraticCurveTo(hx + F*r*0.65, cy - r*1.35, hx + r*0.55, cy - r*0.70);
    g.quadraticCurveTo(hx + r*0.95, cy - r*0.45, hx + r*0.98, cy - r*0.30);   // down the front
    g.quadraticCurveTo(hx, cy - r*0.62, hx - r*0.98, cy - r*0.30);            // brim underside
    g.closePath();
  }, cap, cw);
  // brim band
  pen.seam(()=>{ g.moveTo(hx-r*0.98, cy-r*0.34); g.quadraticCurveTo(hx, cy-r*0.66, hx+r*0.98, cy-r*0.34); }, cw*0.7);
}

function drawBackArm(pen, g, sh, task, s, F, robe, skin, cw){
  let d = { x:F*0.25, y:0.95 };
  if (task==="sail")        d = { x:-F*0.35, y:-0.92 };  // up the halyard
  else if (task==="carry")  d = { x: F*0.30, y:0.55 };   // steadying the load
  else if (task==="barter") d = { x: F*0.20, y:0.9 };
  else if (task==="sell")   d = { x:-F*0.30, y:0.85 };
  const n = Math.hypot(d.x,d.y)||1; d = { x:d.x/n, y:d.y/n };
  const L = s*0.24;
  const wr = { x:sh.x+d.x*L, y:sh.y+d.y*L };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(wr.x,wr.y); }, robe, s*0.048);
  pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.026,0,7); }, skin, cw*0.7);
}

function drawTask(pen, g, C){
  const { cx, shoulderY, shoulderW, hipY, footY, s, F, lean, skin, robe, cw, opt, task } = C;
  const sh = { x:cx + F*shoulderW*0.42 + lean, y:shoulderY + s*0.03 };
  const prop = toneSolid(inkLevel(6));

  if (task==="barter"){
    // arm extended, a strand of beads / a trinket dangled out to seduce
    const wr = { x:cx + F*s*0.26, y:shoulderY + s*0.10 };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.15+lean, shoulderY+s*0.07); g.lineTo(wr.x,wr.y); }, robe, s*0.05);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skin, cw*0.7);
    // dangling necklace of beads with a pendant
    pen.ink(()=>{ g.moveTo(wr.x, wr.y+s*0.01);
      g.quadraticCurveTo(wr.x+F*s*0.04, wr.y+s*0.10, wr.x+F*s*0.005, wr.y+s*0.16); }, cw*0.7);
    g.fillStyle = inkLevel(6);
    for(let i=1;i<=4;i++){ const t=i/5; const bx=wr.x+F*s*0.03*Math.sin(t*3), by=wr.y+s*0.03+t*s*0.13;
      g.beginPath(); g.arc(bx,by,s*0.011,0,7); g.fill(); }
    pen.paint(()=>{ g.ellipse(wr.x+F*s*0.005, wr.y+s*0.175, s*0.020, s*0.028, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6); // pendant
  }

  else if (task==="carry"){
    const cargo = opt.cargo || "jar";
    if (cargo==="child"){
      // a small child cradled low against the chest — hidden, the abduction
      const wr = { x:cx + F*s*0.10, y:hipY - s*0.02 };
      pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.13+lean, shoulderY+s*0.10); g.lineTo(wr.x,wr.y); }, robe, s*0.05);
      // bundle / swaddle
      pen.paint(()=>{ g.ellipse(cx+F*s*0.02, hipY-s*0.05, s*0.13, s*0.085, F*0.25,0,7); }, toneSolid(inkLevel(4)), cw);
      // child head peeking
      pen.paint(()=>{ g.arc(cx+F*s*0.11, hipY-s*0.09, s*0.045, 0,7); }, skin, cw*0.8);
      pen.paint(()=>{ g.arc(cx+F*s*0.11, hipY-s*0.115, s*0.047, Math.PI*1.05, Math.PI*1.95); }, toneSolid(inkLevel(6)), cw*0.6); // child hair
      pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.026,0,7); }, skin, cw*0.7); // cradling hand
    } else {
      // a chest or a jar of stores shouldered
      const jx = cx + F*s*0.13, jy = shoulderY - s*0.03;
      const wr = { x:jx, y:jy + s*0.09 };
      pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.12, shoulderY+s*0.02); g.lineTo(wr.x,wr.y); }, robe, s*0.05);
      if (cargo==="chest"){
        pen.paint(()=>{ g.rect(jx-s*0.11, jy-s*0.10, s*0.22, s*0.15); }, prop, cw);      // chest body
        pen.paint(()=>{ g.rect(jx-s*0.12, jy-s*0.13, s*0.24, s*0.04); }, toneSolid(inkLevel(7)), cw); // lid
        pen.seam(()=>{ g.moveTo(jx-s*0.11, jy-s*0.03); g.lineTo(jx+s*0.11, jy-s*0.03); }, cw*0.6);     // band
        g.fillStyle=inkLevel(1); g.beginPath(); g.arc(jx, jy-s*0.02, s*0.014, 0,7); g.fill();          // clasp
      } else {
        pen.paint(()=>{ g.ellipse(jx, jy-s*0.03, s*0.09, s*0.135, 0,0,7); }, prop, cw);   // jar belly
        pen.paint(()=>{ g.rect(jx-s*0.026, jy-s*0.24, s*0.052, s*0.10); }, toneSolid(inkLevel(5)), cw);// neck
        pen.paint(()=>{ g.ellipse(jx, jy-s*0.25, s*0.046, s*0.026, 0,0,7); }, prop, cw);  // mouth
      }
      pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.026,0,7); }, skin, cw*0.7);
    }
  }

  else if (task==="sail"){
    // both hands high on the halyard running up to the mast head
    const mast = opt.mast;
    const grip = { x:cx + F*s*0.10 + lean*0.5, y:shoulderY - s*0.24 };
    if (mast) pen.ink(()=>{ g.moveTo(mast.x, mast.topY); g.lineTo(grip.x, grip.y); g.lineTo(grip.x-F*s*0.05, hipY-s*0.02); }, cw*0.8);
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.13+lean, shoulderY-s*0.02); g.lineTo(grip.x,grip.y); }, robe, s*0.05);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.03,0,7); }, skin, cw*0.7);
  }

  else if (task==="sell"){
    if (opt.cargo==="coin"){
      // one hand cupped out, taking the buyer's coin
      const wr = { x:cx + F*s*0.24, y:shoulderY + s*0.14 };
      pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.15+lean, shoulderY+s*0.10); g.lineTo(wr.x,wr.y); }, robe, s*0.05);
      pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.030,0,7); }, skin, cw*0.7);
      g.fillStyle=inkLevel(7); g.beginPath(); g.arc(wr.x+F*s*0.01, wr.y-s*0.02, s*0.018,0,7); g.fill(); // coin
    } else {
      // arm swept up and out, presenting the captive for sale
      const wr = { x:cx + F*s*0.30, y:shoulderY - s*0.08 };
      pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.16+lean, shoulderY-s*0.02); g.lineTo(wr.x,wr.y); }, robe, s*0.05);
      pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.026,0,7); }, skin, cw*0.7);
    }
  }
}

/* ============================================================
   CAPTIVE TEMPLATE — the bound slave on the block. Plain, bareheaded,
   wrists roped, head bowed; stands on a low auction block.
   ============================================================ */
function captive(pen, g, cx, footY, s, opt){
  const tunic = toneSolid(inkLevel(2));
  const skin  = toneSolid(inkLevel(2));
  const cw = Math.max(2, s*0.02);

  // auction block
  const bh = s*0.14, bw = s*0.34;
  pen.paint(()=>{ g.rect(cx-bw/2, footY-bh, bw, bh); }, toneSolid(inkLevel(5)), cw);
  pen.seam(()=>{ g.moveTo(cx-bw/2, footY-bh*0.5); g.lineTo(cx+bw/2, footY-bh*0.5); }, cw*0.6);
  const top = footY - bh;

  // shadow on the block
  g.fillStyle="rgba(0,0,0,0.10)"; g.beginPath(); g.ellipse(cx, top+s*0.006, s*0.13, s*0.02, 0,0,7); g.fill();

  const hipY = top - s*0.30;
  const shoulderY = hipY - s*0.26;
  const shoulderW = s*0.22, hemW = s*0.20;
  const headR = s*0.092;
  const headCy = shoulderY - headR*1.15;
  const bow = s*0.03; // head bowed forward

  // feet
  pen.paint(()=>{ g.ellipse(cx-s*0.055, top, s*0.045, s*0.02, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);
  pen.paint(()=>{ g.ellipse(cx+s*0.055, top, s*0.045, s*0.02, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);

  // short tunic
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2, shoulderY);
    g.lineTo(cx+shoulderW/2, shoulderY);
    g.lineTo(cx+hemW/2, hipY+s*0.02);
    g.lineTo(cx-hemW/2, hipY+s*0.02);
    g.closePath();
  }, tunic, cw);
  // bare legs below the hem
  pen.limb(()=>{ g.moveTo(cx-hemW*0.32, hipY+s*0.02); g.lineTo(cx-s*0.05, top); }, skin, s*0.05);
  pen.limb(()=>{ g.moveTo(cx+hemW*0.32, hipY+s*0.02); g.lineTo(cx+s*0.05, top); }, skin, s*0.05);

  // neck + bowed head
  pen.limb(()=>{ g.moveTo(cx, shoulderY); g.lineTo(cx+bow, headCy+headR*0.7); }, skin, s*0.044);
  pen.paint(()=>{ g.arc(cx+bow, headCy, headR, 0,7); }, skin, cw);
  pen.paint(()=>{ g.arc(cx+bow, headCy-headR*0.05, headR*1.03, Math.PI*0.98, Math.PI*2.02); }, toneSolid(inkLevel(6)), cw*0.7); // hair

  // BOUND wrists in front, a rope leading off toward the seller
  const wrx = cx + bow, wry = hipY - s*0.02;
  pen.limb(()=>{ g.moveTo(cx-shoulderW*0.40, shoulderY+s*0.03); g.lineTo(wrx-s*0.02, wry); }, tunic, s*0.05);
  pen.limb(()=>{ g.moveTo(cx+shoulderW*0.40, shoulderY+s*0.03); g.lineTo(wrx+s*0.02, wry); }, tunic, s*0.05);
  pen.paint(()=>{ g.ellipse(wrx, wry, s*0.05, s*0.035, 0,0,7); }, skin, cw*0.7);
  // wrist-rope binding + tether
  pen.ink(()=>{ g.ellipse(wrx, wry, s*0.055, s*0.03, 0,0,7); }, cw*0.9);
  const tug = (opt.tetherDX ?? 1);
  pen.ink(()=>{ g.moveTo(wrx+tug*s*0.05, wry); g.lineTo(wrx+tug*s*0.30, wry+s*0.06); }, cw*0.8);
}

/* ============================================================
   SHIP — the beached (or sailing) Phoenician round-ship, drawn behind the
   cast. A deep-bellied trader with a curled horse-head stem and one mast.
   ============================================================ */
function drawShip(pen, g, W, H, sea){
  const sp = params.ship;
  const px = sp.prowX*W, sx = sp.sternX*W, midX = (px+sx)/2;
  const yShift = sea ? H*0.10 : 0;
  const prowTop = 0.40*H + yShift, sternTop = 0.42*H + yShift;
  const sheerMid = 0.500*H + yShift, keelMid = 0.640*H + yShift, endBot = 0.560*H + yShift;

  if (!sea){
    // launch rollers under a beached keel
    for(let i=0;i<4;i++){
      const rx = lerp(sx+W*0.05, px-W*0.05, i/3);
      pen.paint(()=>{ g.ellipse(rx, keelMid+H*0.012, W*0.026, H*0.011, 0,0,7); }, toneSolid(inkLevel(6)), 3);
    }
  }

  // deep hull belly (round-ship: fuller than a warship)
  pen.paint(()=>{
    g.moveTo(px, prowTop);
    g.quadraticCurveTo(midX, sheerMid-H*0.01, sx, sternTop);
    g.quadraticCurveTo(sx-W*0.03, (sternTop+endBot)/2, sx+W*0.02, endBot);
    g.quadraticCurveTo(midX, keelMid+H*0.04, px-W*0.02, endBot);
    g.quadraticCurveTo(px+W*0.03, (prowTop+endBot)/2, px, prowTop);
    g.closePath();
  }, toneSolid(inkLevel(3)), 5);

  // planking seams
  for(let k=1;k<=3;k++){
    const dy=k*H*0.028;
    pen.seam(()=>{ g.moveTo(sx+W*0.02, sternTop+dy); g.quadraticCurveTo(midX, sheerMid-H*0.01+dy, px-W*0.02, prowTop+dy); }, 3);
  }
  // gunwale rail (dark top strake)
  pen.ink(()=>{ g.moveTo(px, prowTop); g.quadraticCurveTo(midX, sheerMid-H*0.01, sx, sternTop); }, 5);

  // curled horse-head STEMPOST at the prow (the "hippos" of a Phoenician trader)
  pen.paint(()=>{
    g.moveTo(px, prowTop);
    g.quadraticCurveTo(px+W*0.06, prowTop-H*0.06, px+W*0.02, prowTop-H*0.11);
    g.quadraticCurveTo(px-W*0.005, prowTop-H*0.135, px-W*0.05, prowTop-H*0.115);
    g.quadraticCurveTo(px-W*0.02, prowTop-H*0.085, px-W*0.005, prowTop-H*0.075);
    g.quadraticCurveTo(px+W*0.015, prowTop-H*0.055, px+W*0.005, prowTop-H*0.02);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
  // horse eye
  g.fillStyle=inkLevel(1); g.beginPath(); g.arc(px-W*0.005, prowTop-H*0.095, W*0.008,0,7); g.fill();
  // high sternpost curl
  pen.paint(()=>{ g.moveTo(sx, sternTop);
    g.quadraticCurveTo(sx-W*0.05, sternTop-H*0.09, sx+W*0.005, sternTop-H*0.11);
    g.quadraticCurveTo(sx+W*0.03, sternTop-H*0.05, sx+W*0.01, sternTop-H*0.02); g.closePath();
  }, toneSolid(inkLevel(6)), 4);

  // MAST + broad trader's sail + stays
  const mastX = sp.mastX*W, mastTopY = sp.mastTopY*H + yShift, deckY = sheerMid;
  pen.paint(()=>{ g.rect(mastX-W*0.009, mastTopY, W*0.018, deckY-mastTopY); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.rect(mastX-W*0.19, mastTopY+H*0.02, W*0.38, H*0.014); }, toneSolid(inkLevel(6)), 4); // yard
  if (sea){
    // a full broad sail bellying with the wind
    pen.paint(()=>{
      g.moveTo(mastX-W*0.185, mastTopY+H*0.03);
      g.lineTo(mastX+W*0.185, mastTopY+H*0.03);
      g.quadraticCurveTo(mastX+W*0.235, mastTopY+H*0.14, mastX+W*0.14, mastTopY+H*0.20);
      g.lineTo(mastX-W*0.14, mastTopY+H*0.20);
      g.quadraticCurveTo(mastX-W*0.235, mastTopY+H*0.14, mastX-W*0.185, mastTopY+H*0.03);
      g.closePath();
    }, toneSolid(inkLevel(2)), 4);
    // sail brails
    for(let i=1;i<=4;i++){ const bx=mastX-W*0.185+ (W*0.37)*(i/5);
      pen.seam(()=>{ g.moveTo(bx, mastTopY+H*0.03); g.lineTo(bx, mastTopY+H*0.20); }, 2); }
  } else {
    // furled sail lashed to the yard
    pen.paint(()=>{ g.rect(mastX-W*0.17, mastTopY+H*0.028, W*0.34, H*0.02); }, toneSolid(inkLevel(5)), 3);
  }
  pen.paint(()=>{ g.rect(mastX-W*0.02, mastTopY-H*0.008, W*0.04, H*0.024); }, toneSolid(inkLevel(7)), 4); // masthead
  pen.ink(()=>{ g.moveTo(mastX, mastTopY+H*0.008); g.lineTo(px-W*0.02, prowTop); }, 3);
  pen.ink(()=>{ g.moveTo(mastX, mastTopY+H*0.008); g.lineTo(sx+W*0.02, sternTop); }, 3);

  return {
    mast:{ x:mastX, topY:mastTopY+H*0.008 },
    prow:{ x:px, y:prowTop },
    stern:{ x:sx, y:sternTop },
    gangwayTop:{ x:sx+W*0.06, y:sternTop+H*0.02 },
    sheer:sheerMid, keel:keelMid,
  };
}

/* ============================================================
   STAGE — shore/sea + ship, gangway, wares mat, back-rank, the cast.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const formation = st.formation || params.formation;
  const sea = formation==="voyage";
  const shore   = (st.shoreLevel ?? params.shoreLevel) * H;
  const attention = st.attention ?? params.attention;
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const wave      = st.wave ?? params.wave;
  const roster0   = FORMATIONS[formation] || FORMATIONS["full-trade"];

  // ---- SKY (lightest) ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,shore);

  // ---- faint back-rank of the wider company ----
  if (!sea){
    const crowdN = st.crowd ?? params.crowd;
    for(let i=0;i<crowdN;i++){
      const t=(i+0.5)/crowdN;
      const cx=lerp(W*0.08,W*0.92,t)+(i%2?W*0.008:-W*0.008);
      const cy=shore - H*0.070 - Math.abs(Math.sin(t*6))*H*0.014;
      const r=W*0.015;
      g.fillStyle=inkLevel(3);
      g.beginPath(); g.arc(cx,cy,r,0,7); g.fill();
      // hint of the tall cap on the crowd too
      g.beginPath(); g.moveTo(cx-r*0.6,cy-r*0.4); g.lineTo(cx+r*1.1,cy-r*2.0); g.lineTo(cx+r*0.7,cy-r*0.2); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(cx-r*1.5,cy+r*3.0); g.quadraticCurveTo(cx,cy+r*0.6,cx+r*1.5,cy+r*3.0); g.closePath(); g.fill();
    }
  }

  // ---- GROUND: strand (mid) or open SEA ----
  if (sea){
    g.fillStyle=inkLevel(2); g.fillRect(0,shore,W,H-shore);
    // swell lines
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
    for(let j=1;j<=6;j++){ const y=shore+(H-shore)*(j/7);
      g.beginPath();
      for(let x=0;x<=W;x+=W*0.03){ const yy=y+Math.sin(x*0.05+j*1.3)*4; if(x===0)g.moveTo(x,yy); else g.lineTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  } else {
    g.fillStyle=inkLevel(2); g.fillRect(0,shore,W,H-shore);
    // waterline at the very back of the strand
    g.fillStyle=inkLevel(3); g.fillRect(0,shore,W,H*0.02);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.22;
    for(let j=1;j<=4;j++){ const y=shore+(H-shore)*(j/5);
      g.beginPath();
      for(let x=0;x<=W;x+=W*0.05){ const yy=y+Math.sin(x*0.04+j)*2.2; if(x===0)g.moveTo(x,yy); else g.lineTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- SHIP (behind the cast) ----
  const rig = drawShip(pen, g, W, H, sea);

  // ---- GANGWAY plank from the stern down to the strand (loading route) ----
  if (!sea){
    pen.paint(()=>{
      const gx=rig.gangwayTop.x, gy=rig.gangwayTop.y;
      g.moveTo(gx, gy); g.lineTo(gx-W*0.02, gy);
      g.lineTo(W*0.50, BAND_Y[1]*H); g.lineTo(W*0.53, BAND_Y[1]*H);
      g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    // cross-cleats
    for(let i=1;i<=4;i++){ const t=i/5;
      const ax=lerp(rig.gangwayTop.x, W*0.515, t), ay=lerp(rig.gangwayTop.y, BAND_Y[1]*H, t);
      pen.seam(()=>{ g.moveTo(ax-W*0.012, ay); g.lineTo(ax+W*0.012, ay); }, 2.5); }
  }

  // ---- WARES MAT (the trinkets spread for the seduction) ----
  if (formation==="full-trade" || formation==="barter"){
    const mx = (formation==="barter"? W*0.30 : W*0.14), my = BAND_Y[2]*H - (BAND_S[2]*0.02);
    pen.paint(()=>{ g.ellipse(mx, my, W*0.11, H*0.026, 0,0,7); }, toneSolid(inkLevel(2)), 3);
    pen.seam(()=>{ g.ellipse(mx, my, W*0.10, H*0.022, 0,0,7); }, 2);
    g.fillStyle=inkLevel(6);
    for(let i=0;i<7;i++){ const a=i/7*Math.PI*2; const rx=mx+Math.cos(a)*W*0.06, ry=my+Math.sin(a)*H*0.013;
      g.beginPath(); g.arc(rx,ry,W*0.010,0,7); g.fill(); }
    g.fillStyle=inkLevel(7); g.beginPath(); g.arc(mx,my,W*0.014,0,7); g.fill();
  }

  // ---- the cast, drawn far band -> near band (painter's order) ----
  const roster = roster0
    .map((m,i)=>({ m, i }))
    .filter(({m})=> density>=1 ? true : m.band >= Math.round((1-density)*(params.bands-1)))
    .sort((a,b)=> a.m.band - b.m.band);

  roster.forEach(({m})=>{
    let footY = BAND_Y[m.band]*H;
    const s = BAND_S[m.band];
    const lvl = BAND_LVL[m.band];
    const nx = 0.5 + (m.x-0.5)*spread;
    const cx = clamp(nx,0.05,0.95)*W;
    if (sea) footY = rig.sheer + (m.band-0.2)*H*0.045;  // stand on the deck at sea
    if (m.kind==="captive"){
      captive(pen, g, cx, footY, s, { tetherDX:m.flip });
      return;
    }
    // SLY glance: turn the eye toward the ship / the mark, scaled by attention
    const glanceDX = clamp((rig.mast.x-cx)*0.05*attention, -s*0.09, s*0.09);
    // reaction-wave: a ripple of turned heads across the width
    const local = clamp01(1 - Math.abs(wave - m.x)*4);
    trader(pen, g, cx, footY, s, m.task, lvl, m, {
      glanceDX: glanceDX + local*m.flip*s*0.04,
      cargo:m.cargo, mast:rig.mast,
    });
  });
}

export const asset = {
  id:"ensemble.phoenician-traders",
  type:"ENSEMBLE",
  name:"Phoenician traders",
  statusWord:"CUNNING",
  scene:"OD-B15-S04",

  params,
  // ONE merchant template (+ a bound-captive variant) instanced across bands
  member:{ template:"trader", variants:["captive"], tasks:TASKS,
           cargo:["jar","chest","child","coin"], formations:Object.keys(FORMATIONS) },
  // far -> near draw order the stage honors
  layers:["sky","crowd","ground","ship","gangway","wares","band-far","band-mid","band-near"],
  // normalized placement / rigging / camera anchors (NOT baked characters)
  anchors:{
    "ship:prow":{x:.86,y:.40}, "ship:stern":{x:.30,y:.42}, "ship:mast":{x:.58,y:.14},
    "ship:hold":{x:.58,y:.50}, "gangway:head":{x:.36,y:.44}, "gangway:foot":{x:.51,y:.79},
    "station:wares":{x:.14,y:.90}, "station:block":{x:.72,y:.90}, "station:barter":{x:.20,y:.86},
    "seat:child-cargo":{x:.37,y:.83},
    "camera:wide":{x:.50,y:.50}, "camera:sale":{x:.72,y:.80}, "camera:deck":{x:.58,y:.50},
    "entrance:strand":{x:.06,y:.62}, "exit:seaward":{x:.90,y:.60},
  },
  // walkable strand / working ground for scene pathing/placement
  zones:{ strand:{ x0:.05,y0:.62,x1:.95,y1:.82 }, foreshore:{ x0:.05,y0:.84,x1:.95,y1:.98 } },
  states:{
    initial:"full-trade",
    nodes:{
      "full-trade":{ preview:{ formation:"full-trade", attention:0.6, spread:1.0, density:1.0, wave:0.0 } },
      "barter":{     preview:{ formation:"barter",     attention:0.8, spread:1.0, density:1.0, wave:0.3 } },
      "load":{       preview:{ formation:"load",       attention:0.5, spread:1.0, density:1.0, wave:0.0 } },
      "voyage":{     preview:{ formation:"voyage",     attention:0.4, spread:1.0, density:1.0, wave:0.2 } },
      "sale":{       preview:{ formation:"sale",       attention:0.7, spread:1.0, density:1.0, wave:0.0 } },
    },
    edges:[["full-trade","barter"],["barter","load"],["load","voyage"],["voyage","sale"],
           ["full-trade","load"],["full-trade","sale"]],
  },
  channels:["formation","attention","wave","density","spread"],

  preview:()=>({ formation:"full-trade", attention:0.6, spread:1.0, density:1.0, wave:0.0, status:"CUNNING", progress:.24 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
