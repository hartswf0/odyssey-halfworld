/* ensemble.telemachuss-crew — the experienced returning sailors of Telemachus.
   ENSEMBLE asset. A seasoned homecoming crew built from ONE separable member
   template (a sailor figure + a task rig) instanced along a moored ship: a
   carry-line shouldering guest-GIFTS up a gangplank, boarders swinging over the
   gunwale, oarsmen shipping their looms, and a caster-off heaving the mooring
   line free at the stern — a fast, practised departure. Exposes FORMATION
   (load | board | row), density, a BRISK-attention channel (every head snaps
   forward/seaward to the order, not idling), a reaction-wave ("bustle" pulse),
   and foreground/background depth bands. A faint back-rank of small silhouettes
   implies the fuller company on the strand.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify POST pass supplies the halftone. No named character is baked in.
   Atlas OD-B15-S03 — experienced returning sailors loading gifts and executing
   a fast departure. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* ---- the labours of a fast departure ---- */
const TASKS = ["load","board","row","castoff","urge"];

/* ---- FORMATIONS: the same sailor template arranged around the moored hull.
   roster entry = { task, band(0 far..2 near), x(0..1), flip(+1 faces R / -1 L) }. */
const FORMATIONS = {
  // the hero view: gifts going aboard AND the ship already shoving off
  "loading-departure": [
    { task:"urge",    band:0, x:0.18, flip: 1 },   // captain at the prow, urging haste
    { task:"row",     band:0, x:0.46, flip:-1 },   // oarsmen shipping looms on deck
    { task:"row",     band:0, x:0.58, flip:-1 },
    { task:"board",   band:0, x:0.70, flip:-1 },   // last men swinging aboard
    { task:"castoff", band:1, x:0.86, flip:-1 },   // caster-off at the stern
    { task:"board",   band:1, x:0.30, flip: 1 },   // boarding over the near rail
    { task:"load",    band:1, x:0.44, flip: 1 },   // carry-line up the gangplank
    { task:"load",    band:2, x:0.16, flip: 1 },   // foreground gift-gang on the strand
    { task:"load",    band:2, x:0.32, flip: 1 },
    { task:"load",    band:2, x:0.49, flip: 1 },
    { task:"board",   band:2, x:0.66, flip: 1 },
    { task:"castoff", band:2, x:0.84, flip:-1 },
  ],
  // load: a diagonal carry-line bearing the guest-gifts up to the deck
  "load": [
    { task:"load",  band:0, x:0.60, flip: 1 },
    { task:"load",  band:0, x:0.72, flip: 1 },
    { task:"load",  band:1, x:0.26, flip: 1 },
    { task:"load",  band:1, x:0.42, flip: 1 },
    { task:"load",  band:1, x:0.58, flip: 1 },
    { task:"load",  band:2, x:0.16, flip: 1 },
    { task:"load",  band:2, x:0.34, flip: 1 },
    { task:"load",  band:2, x:0.52, flip: 1 },
    { task:"urge",  band:2, x:0.82, flip:-1 },   // captain waving the line on
  ],
  // board: the whole gang swinging over the gunwale onto the benches
  "board": [
    { task:"board", band:0, x:0.42, flip: 1 },
    { task:"board", band:0, x:0.56, flip:-1 },
    { task:"board", band:0, x:0.68, flip:-1 },
    { task:"board", band:1, x:0.28, flip: 1 },
    { task:"board", band:1, x:0.60, flip:-1 },
    { task:"board", band:2, x:0.24, flip: 1 },
    { task:"board", band:2, x:0.46, flip: 1 },
    { task:"board", band:2, x:0.68, flip:-1 },
    { task:"urge",  band:2, x:0.86, flip:-1 },
  ],
  // row: settled to the oars, looms shipped, the fast ship poised to run
  "row": [
    { task:"row",     band:0, x:0.34, flip:-1 },
    { task:"row",     band:0, x:0.46, flip:-1 },
    { task:"row",     band:0, x:0.58, flip:-1 },
    { task:"row",     band:0, x:0.70, flip:-1 },
    { task:"row",     band:1, x:0.30, flip:-1 },
    { task:"row",     band:1, x:0.50, flip:-1 },
    { task:"row",     band:1, x:0.70, flip:-1 },
    { task:"castoff", band:2, x:0.16, flip: 1 },   // shoving off the strand
    { task:"urge",    band:2, x:0.84, flip:-1 },    // helm calling the stroke
  ],
};

const params = {
  formation:"loading-departure",
  bands:3,
  count:20,                  // Telemachus's practised homeward company
  crowd:11,                  // faint back-rank silhouettes on the strand
  strandLevel:0.66,          // strand / quay line as fraction of H
  hull:{ prowX:0.90, sternX:0.14, mastX:0.52, mastTopY:0.13, plankX:0.40 },
  attention:0.80,            // 0 heads-down at labour .. 1 all snapped brisk to the order
  spread:1.0,                // formation width multiplier about centre
  density:1.0,               // 0 sparse (near band only) .. 1 full company
  bustle:0.0,                // reaction-wave position 0..1 across the width
  haste:0.7,                 // departure urgency: lean + step-rate of the whole gang
};

const BAND_Y   = [0.585, 0.760, 0.930];   // footline per depth band
const BAND_S   = [140, 190, 250];          // sailor height px per band
const BAND_LVL = [3, 4, 3];                // tunic ink level per band

/* ============================================================
   MEMBER TEMPLATE — one sailor, drawn deterministically.
   cx/footY/s in px. task selects the rig + prop; lvl the tunic tone.
   opt carries {headDX, bustle, plank:{topX,topY,botX,botY}, prow:{x,y}, haste}.
   ============================================================ */
function sailor(pen, g, cx, footY, s, task, lvl, m, opt){
  const cloth = toneSolid(inkLevel(lvl));
  const legT  = toneSolid(inkLevel(Math.min(7, lvl+2)));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const prop  = toneSolid(inkLevel(Math.min(7, lvl+3)));
  const cw = Math.max(2, s*0.02);
  const F  = m.flip;
  const bustle = opt.bustle || 0;
  const haste  = opt.haste ?? 0.7;

  // stance + lean per labour (haste sharpens the lean)
  let lean = 0, crouch = 0, stance = s*0.10, stepUp = 0;
  if (task==="load"){    lean = F*s*(0.05+0.05*haste); crouch = s*0.03; stance = s*0.12; }
  else if (task==="board"){ lean = F*s*0.16; crouch = -s*0.02; stance = s*0.14; stepUp = s*(0.16+0.06*bustle); }
  else if (task==="row"){   lean = -F*s*0.05; stance = s*0.10; }
  else if (task==="castoff"){ lean = -F*s*(0.14+0.10*haste); crouch = s*0.04; stance = s*0.22; }
  else if (task==="urge"){  lean = 0; stance = s*0.09; }

  const hipY = footY - s*0.40 + crouch;
  const shoulderY = hipY - s*0.28;
  const hipW = s*0.19, shoulderW = s*0.26;
  const headR = s*0.108;
  const hx = cx + lean + (opt.headDX||0);
  const headCy = shoulderY - headR*1.15;

  // ground shadow
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY+s*0.015, s*0.22, s*0.035, 0,0,7); g.fill();

  // --- LEGS ---
  let backFoot, frontFoot, frontY = footY;
  if (task==="castoff"){                       // braced hard, heaving off
    backFoot  = cx + F*stance*0.2 - F*stance*1.2;
    frontFoot = cx - F*stance*0.9;
  } else if (task==="board"){                    // front leg raised onto the rail/plank
    backFoot  = cx - F*stance*0.7;
    frontFoot = cx + F*stance*0.9;
    frontY    = footY - stepUp;                  // stepping up
  } else {
    backFoot  = cx - stance;
    frontFoot = cx + stance*(task==="load"?1.2:1.0);
  }
  pen.limb(()=>{ g.moveTo(cx-hipW*0.35+lean*0.4, hipY); g.lineTo(backFoot,  footY);  }, legT, s*0.072);
  pen.limb(()=>{ g.moveTo(cx+hipW*0.35+lean*0.4, hipY); g.lineTo(frontFoot, frontY); }, legT, s*0.072);
  pen.paint(()=>{ g.ellipse(backFoot,  footY,  s*0.05, s*0.024, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);
  pen.paint(()=>{ g.ellipse(frontFoot, frontY, s*0.05, s*0.024, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);

  // --- BACK ARM (behind torso) ---
  drawBackArm(pen, g, { x:cx-F*shoulderW*0.42+lean, y:shoulderY+s*0.04 }, task, s, F, cloth, skin, cw);

  // --- TORSO tunic (blocky trapezoid sheared by lean) ---
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hipW/2+lean*0.5, hipY+s*0.02);
    g.lineTo(cx-hipW/2+lean*0.5, hipY+s*0.02);
    g.closePath();
  }, cloth, cw);
  // belt seam
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.42+lean*0.7, shoulderY+s*0.16); g.lineTo(cx+shoulderW*0.42+lean*0.7, shoulderY+s*0.16); }, cw*0.7);

  // --- NECK + HEAD ---
  pen.limb(()=>{ g.moveTo(cx+lean, shoulderY+s*0.005); g.lineTo(hx, headCy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, headCy, headR, 0,7); }, skin, cw);
  // hair cap
  pen.paint(()=>{ g.arc(hx, headCy-headR*0.05, headR*1.04, Math.PI*1.02, Math.PI*1.98); }, hair, cw*0.8);
  // weathered brow line (a level, seasoned face)
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.16); g.lineCap="round";
  g.beginPath(); g.moveTo(hx-headR*0.34, headCy-headR*0.02); g.lineTo(hx+headR*0.34, headCy-headR*0.02); g.stroke();

  // --- FRONT ARM + PROP (the visible labour) ---
  drawTask(pen, g, { cx, shoulderY, shoulderW, hipY, footY, s, F, lean, prop, skin, cloth, hair, cw, opt, task, haste });
}

/* back arm as a single two-point limb reaching toward the task target */
function drawBackArm(pen,g,sh,task,s,F,cloth,skin,cw){
  let d = { x:F*0.2, y:0.95 };
  if (task==="load") d = { x:-F*0.15, y:-0.85 };     // steadying the shouldered gift
  else if (task==="board") d = { x:F*0.55, y:-0.55 };// reaching up for the rail
  else if (task==="row") d = { x:F*0.5, y:-0.05 };   // out on the loom
  else if (task==="castoff") d = { x:F*0.5, y:-0.1 };// gripping the pole
  else if (task==="urge") d = { x:-F*0.3, y:0.9 };
  const n = Math.hypot(d.x,d.y)||1; d = { x:d.x/n, y:d.y/n };
  const L = s*0.26;
  const wr = { x:sh.x+d.x*L, y:sh.y+d.y*L };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(wr.x,wr.y); }, cloth, s*0.05);
  pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.026,0,7); }, skin, cw*0.7);
}

function drawTask(pen,g,C){
  const { cx,shoulderY,shoulderW,hipY,footY,s,F,lean,prop,skin,cloth,hair,cw,opt,task,haste } = C;
  const sh = { x:cx+F*shoulderW*0.40+lean, y:shoulderY+s*0.04 };

  if (task==="load"){
    // a guest-GIFT chest shouldered high; near arm braced up under it
    const bx = cx+F*s*0.05, by = shoulderY-s*0.10;
    const bw = s*0.30, bh = s*0.19;
    const wr = { x:bx+F*bw*0.35, y:by+bh*0.55 };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.12, shoulderY-s*0.02); g.lineTo(wr.x,wr.y); }, cloth, s*0.052);
    // the chest (a bound treasure box)
    pen.paint(()=>{ g.rect(bx-bw/2, by-bh/2, bw, bh); }, prop, cw);
    pen.seam(()=>{ g.moveTo(bx-bw/2, by); g.lineTo(bx+bw/2, by); }, cw*0.7);              // lid seam
    pen.seam(()=>{ g.moveTo(bx-bw*0.18, by-bh/2); g.lineTo(bx-bw*0.18, by+bh/2); }, cw*0.7); // strap
    pen.seam(()=>{ g.moveTo(bx+bw*0.18, by-bh/2); g.lineTo(bx+bw*0.18, by+bh/2); }, cw*0.7); // strap
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skin, cw*0.7);
  }

  else if (task==="board"){
    // near hand thrown high to seize the gunwale/stay as he swings aboard
    const grip = { x:cx+F*s*0.30+lean, y:shoulderY-s*0.30 };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.18+lean, shoulderY-s*0.14); g.lineTo(grip.x,grip.y); }, cloth, s*0.052);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.03,0,7); }, skin, cw*0.7);
  }

  else if (task==="row"){
    // an oarsman shipping his loom: a long oar held out over the sea-side
    const gripIn = { x:cx+F*s*0.14, y:shoulderY+s*0.10 };
    const gripOut= { x:cx+F*s*0.02, y:shoulderY-s*0.02 };
    const bladeEnd = { x:cx+F*s*0.72, y:shoulderY+s*0.34 };
    pen.limb(()=>{ g.moveTo(gripOut.x, gripOut.y); g.lineTo(bladeEnd.x, bladeEnd.y); }, toneSolid(inkLevel(4)), s*0.05);
    pen.paint(()=>{ // blade
      g.ellipse(bladeEnd.x, bladeEnd.y, s*0.05, s*0.11, F*0.5, 0,7);
    }, toneSolid(inkLevel(6)), cw*0.8);
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(gripIn.x, gripIn.y); }, cloth, s*0.052);
    pen.paint(()=>{ g.arc(gripIn.x, gripIn.y, s*0.03, 0,7); }, skin, cw*0.7);
    pen.paint(()=>{ g.arc(gripOut.x, gripOut.y, s*0.026, 0,7); }, skin, cw*0.7);
  }

  else if (task==="castoff"){
    // heaving on a long shove-pole planted to the strand — the fast departure
    const top = { x:cx-F*s*0.22, y:shoulderY-s*0.16 };
    const bot = { x:cx+F*s*0.30, y:footY+s*0.04 };
    pen.ink(()=>{ g.moveTo(top.x, top.y); g.lineTo(bot.x, bot.y); }, cw*1.2);         // the pole
    const wr = { x:lerp(top.x, bot.x, 0.32), y:lerp(top.y, bot.y, 0.32) };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.05, shoulderY+s*0.02); g.lineTo(wr.x,wr.y); }, cloth, s*0.052);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.03,0,7); }, skin, cw*0.7);
  }

  else if (task==="urge"){
    // the captain: near arm flung up seaward, ordering the brisk departure
    const wr = { x:cx+F*s*0.28, y:shoulderY-s*0.34 };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.16, shoulderY-s*0.18); g.lineTo(wr.x,wr.y); }, cloth, s*0.05);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.03,0,7); }, skin, cw*0.7);
    // a captain's staff planted
    const staffX = cx - F*s*0.16;
    pen.ink(()=>{ g.moveTo(staffX, shoulderY-s*0.12); g.lineTo(staffX-F*s*0.01, footY+s*0.02); }, cw*1.1);
  }
}

/* ============================================================
   HULL — the fast moored ship, prow to the open sea (right), stern to the
   quay (left), a gangplank down to the strand. Drawn behind the crew.
   ============================================================ */
function drawHull(pen, g, W, H){
  const hl = params.hull;
  const px = hl.prowX*W, sx = hl.sternX*W, midX = 0.5*W;
  const prowTop = 0.37*H, sternTop = 0.40*H;
  const sheerMid = 0.505*H, keelMid = 0.635*H, endBot = 0.555*H;

  // hull body (broadside crescent), mid tone
  pen.paint(()=>{
    g.moveTo(px, prowTop);
    g.quadraticCurveTo(midX, sheerMid, sx, sternTop);                       // sheer / gunwale
    g.quadraticCurveTo(sx-W*0.02, (sternTop+endBot)/2, sx+W*0.03, endBot);  // stern post
    g.quadraticCurveTo(midX, keelMid+H*0.02, px-W*0.03, endBot);            // keel
    g.quadraticCurveTo(px+W*0.02, (prowTop+endBot)/2, px, prowTop);         // prow post
    g.closePath();
  }, toneSolid(inkLevel(3)), 5);

  // planking seams following the sheer
  for(let k=1;k<=3;k++){
    const dy = k*H*0.026;
    pen.seam(()=>{ g.moveTo(px-W*0.02, prowTop+dy); g.quadraticCurveTo(midX, sheerMid+dy, sx+W*0.02, sternTop+dy); }, 3);
  }
  // gunwale rail (darker top strake)
  pen.ink(()=>{ g.moveTo(px, prowTop); g.quadraticCurveTo(midX, sheerMid, sx, sternTop); }, 5);

  // oar-ports row just under the rail
  g.fillStyle = inkLevel(7);
  for(let i=0;i<10;i++){
    const t = (i+0.5)/10;
    const ox = lerp(px-W*0.05, sx+W*0.05, t);
    const oy = lerp(prowTop, sternTop, t) + H*0.020 + Math.sin(t*Math.PI)*H*0.028;
    g.beginPath(); g.arc(ox, oy, W*0.006, 0,7); g.fill();
  }

  // prow curled stempost, sweeping seaward (right) — a swift ship's beak
  pen.paint(()=>{
    g.moveTo(px, prowTop);
    g.quadraticCurveTo(px+W*0.05, prowTop-H*0.06, px-W*0.005, prowTop-H*0.085);
    g.quadraticCurveTo(px-W*0.045, prowTop-H*0.10, px-W*0.03, prowTop-H*0.055);
    g.quadraticCurveTo(px-W*0.02, prowTop-H*0.03, px-W*0.03, prowTop);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
  // sternpost tip (quay side)
  pen.paint(()=>{ g.moveTo(sx, sternTop); g.quadraticCurveTo(sx-W*0.03, sternTop-H*0.05, sx+W*0.005, sternTop-H*0.07);
    g.quadraticCurveTo(sx+W*0.02, sternTop-H*0.02, sx+W*0.02, sternTop); g.closePath(); }, toneSolid(inkLevel(6)), 4);

  // MAST + yard + stays
  const mastX = hl.mastX*W, mastTopY = hl.mastTopY*H, deckY = sheerMid;
  pen.paint(()=>{ g.rect(mastX-W*0.009, mastTopY, W*0.018, deckY-mastTopY); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.rect(mastX-W*0.17, mastTopY+H*0.03, W*0.34, H*0.013); }, toneSolid(inkLevel(6)), 4);      // yard
  pen.paint(()=>{ g.rect(mastX-W*0.020, mastTopY-H*0.008, W*0.040, H*0.024); }, toneSolid(inkLevel(7)), 4);   // masthead
  pen.ink(()=>{ g.moveTo(mastX, mastTopY+H*0.01); g.lineTo(px-W*0.02, prowTop); }, 3);                        // forestay
  pen.ink(()=>{ g.moveTo(mastX, mastTopY+H*0.01); g.lineTo(sx+W*0.02, sternTop); }, 3);                       // backstay

  // GANGPLANK — from the deck (near the stern quarter) down to the strand
  const plankX = hl.plankX*W;
  const topX = plankX, topY = sheerMid + H*0.01;
  const botX = plankX - W*0.10, botY = params.strandLevel*H + H*0.03;
  pen.paint(()=>{
    g.moveTo(topX, topY - H*0.012); g.lineTo(botX, botY - H*0.012);
    g.lineTo(botX + W*0.05, botY + H*0.006); g.lineTo(topX + W*0.05, topY + H*0.006);
    g.closePath();
  }, toneSolid(inkLevel(4)), 4);
  // plank cleats
  for(let i=1;i<=4;i++){ const t=i/5; const rx=lerp(botX,topX,t)+W*0.025, ry=lerp(botY,topY,t)-H*0.003;
    pen.seam(()=>{ g.moveTo(rx-W*0.02, ry-H*0.006); g.lineTo(rx+W*0.02, ry+H*0.006); }, 2.5); }

  return { mast:{ x:mastX, topY:mastTopY+H*0.01 }, prow:{ x:px, y:prowTop },
           plank:{ topX, topY, botX, botY } };
}

/* a small stack of guest-gift chests waiting on the strand */
function drawGiftStack(pen, g, x, y, w){
  const h = w*0.62;
  // lower crate
  pen.paint(()=>{ g.rect(x-w/2, y-h, w, h); }, toneSolid(inkLevel(5)), 4);
  pen.seam(()=>{ g.moveTo(x-w/2, y-h*0.5); g.lineTo(x+w/2, y-h*0.5); }, 3);
  pen.seam(()=>{ g.moveTo(x-w*0.2, y-h); g.lineTo(x-w*0.2, y); }, 3);
  pen.seam(()=>{ g.moveTo(x+w*0.2, y-h); g.lineTo(x+w*0.2, y); }, 3);
  // upper smaller crate + a tripod cauldron (a classic guest-gift)
  pen.paint(()=>{ g.rect(x-w*0.34, y-h*1.66, w*0.68, h*0.66); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.ellipse(x+w*0.02, y-h*1.9, w*0.22, w*0.14, 0, Math.PI, 0); }, toneSolid(inkLevel(4)), 3); // cauldron bowl handle hint
}

/* ============================================================
   STAGE — quay strand + moored hull, gangplank, gift-stacks, the crew,
   back-rank company.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const strand    = (st.strandLevel ?? params.strandLevel) * H;
  const attention = st.attention ?? params.attention;
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const bustle    = st.bustle ?? params.bustle;
  const haste     = st.haste ?? params.haste;
  const formation = st.formation || params.formation;
  const roster0   = FORMATIONS[formation] || FORMATIONS["loading-departure"];

  // ---- SKY (lightest) ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,strand);

  // ---- faint back-rank of the wider company on the strand ----
  const crowdN = st.crowd ?? params.crowd;
  for(let i=0;i<crowdN;i++){
    const t = (i+0.5)/crowdN;
    const cx = lerp(W*0.08, W*0.92, t) + (i%2? W*0.01 : -W*0.01);
    const cy = strand - H*0.070 - Math.abs(Math.sin(t*7))*H*0.014;
    const r  = W*0.015;
    g.fillStyle = inkLevel(3);
    g.beginPath(); g.arc(cx, cy, r, 0,7); g.fill();                       // head
    g.beginPath(); g.moveTo(cx-r*1.6, cy+r*3.2); g.quadraticCurveTo(cx, cy+r*0.6, cx+r*1.6, cy+r*3.2); g.closePath(); g.fill(); // shoulders
  }

  // ---- STRAND / quay (mid tone) with wave-lines toward the sea ----
  g.fillStyle = inkLevel(2); g.fillRect(0,strand,W,H-strand);
  g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.26;
  for(let j=1;j<=4;j++){
    const y = strand + (H-strand)*(j/5);
    g.beginPath();
    for(let x=0;x<=W;x+=W*0.04){ const yy=y+Math.sin(x*0.045+j)*2.5; if(x===0) g.moveTo(x,yy); else g.lineTo(x,yy); }
    g.stroke();
  }
  g.globalAlpha = 1;

  // ---- HULL + mast + gangplank (behind the crew) ----
  const rig = drawHull(pen, g, W, H);

  // ---- a stack of guest-gifts waiting on the strand near the plank foot ----
  drawGiftStack(pen, g, rig.plank.botX - W*0.02, strand + H*0.05, W*0.085);
  drawGiftStack(pen, g, W*0.06, strand + H*0.075, W*0.070);

  // ---- members, drawn far band -> near band (painter's order) ----
  const roster = roster0
    .map((m,i)=>({ m, i }))
    .filter(({m})=> density>=1 ? true : m.band >= Math.round((1-density)*(params.bands-1)))
    .sort((a,b)=> a.m.band - b.m.band);

  roster.forEach(({m})=>{
    const footY = BAND_Y[m.band]*H;
    const s     = BAND_S[m.band];
    const lvl   = BAND_LVL[m.band];
    const nx = 0.5 + (m.x-0.5)*spread;
    const cx = clamp(nx,0.05,0.95)*W;
    // BRISK attention: heads snap toward the prow / open sea (the order)
    const headDX = clamp((rig.prow.x-cx)*0.10*attention, -s*0.10, s*0.10);
    // reaction-wave: a bustle pulse sweeping across the gang by x
    const local = clamp01(1 - Math.abs(bustle - m.x)*4);
    sailor(pen, g, cx, footY, s, m.task, lvl, m, { headDX, bustle: local, plank:rig.plank, prow:rig.prow, haste });
  });
}

export const asset = {
  id:"ensemble.telemachuss-crew",
  type:"ENSEMBLE",
  name:"Telemachus's crew",
  statusWord:"BRISK",
  scene:"OD-B15-S03",

  params,
  // ONE sailor template + task rig, instanced across depth bands around a hull
  member:{ template:"sailor", tasks:TASKS, formations:Object.keys(FORMATIONS) },
  // far -> near draw order
  layers:["sky","crowd","strand","hull","mast","gangplank","gifts","band-far","band-mid","band-near"],
  // normalized placement / rigging / camera anchors (NOT baked characters)
  anchors:{
    "hull:prow":{x:.90,y:.37}, "hull:stern":{x:.14,y:.40}, "hull:amidships":{x:.50,y:.55},
    "mast:head":{x:.52,y:.14}, "mast:foot":{x:.52,y:.505},
    "gangplank:top":{x:.40,y:.515}, "gangplank:foot":{x:.30,y:.69},
    "station:carry":{x:.34,y:.76}, "station:board":{x:.44,y:.76}, "station:castoff":{x:.86,y:.76},
    "gifts:strand":{x:.28,y:.71}, "camera:wide":{x:.50,y:.50}, "camera:hull":{x:.50,y:.52},
    "entrance:quay":{x:.06,y:.66}, "exit:seaward":{x:.94,y:.94},
  },
  // walkable quay / working ground for scene pathing/placement
  zones:{ strand:{ x0:.05,y0:.66,x1:.95,y1:.82 }, foreshore:{ x0:.05,y0:.84,x1:.95,y1:.98 } },
  states:{
    initial:"loading-departure",
    nodes:{
      "loading-departure":{ preview:{ formation:"loading-departure", attention:0.80, spread:1.0, density:1.0, bustle:0.0, haste:0.7 } },
      "load":{  preview:{ formation:"load",  attention:0.45, spread:1.0, density:1.0, bustle:0.4, haste:0.5 } },
      "board":{ preview:{ formation:"board", attention:0.65, spread:1.0, density:1.0, bustle:0.5, haste:0.8 } },
      "row":{   preview:{ formation:"row",   attention:0.90, spread:1.0, density:1.0, bustle:0.2, haste:0.9 } },
    },
    edges:[["loading-departure","load"],["loading-departure","board"],["loading-departure","row"],
           ["load","board"],["board","row"]],
  },
  channels:["formation","attention","bustle","density","spread","haste"],

  preview:()=>({ formation:"loading-departure", attention:0.80, spread:1.0, density:1.0, bustle:0.0, haste:0.7, status:"BRISK", progress:.24 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
