/* ensemble.people-of-ithaca — the citizens of the Ithacan assembly.
   ENSEMBLE asset. Scene function (OD-B02-S01): the townsfolk file into the
   agora, make way down a cleared aisle, stand and LISTEN to the speaker on
   the bema, and shift as a body between PITY (a hand lifted to the face,
   heads bowing) and SILENCE (upright, rapt, still). Built as a repeatable
   group from ONE separable member template (drawCitizen) instanced N times
   deterministically. Exposes formation (assembly | aisle | filing), density,
   attention (how hard the heads turn to the bema), a reaction-WAVE of pity
   that ripples across the crowd, and foreground/background depth controls.
   Drawn in SOLID grays + hard contour; the engine dotify pass supplies the
   halftone. Do NOT bake the speaker in — the bema is an external focus pole;
   a single low foreground SPEAKER'S STONE marks where the attention converges. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

const params = {
  formation:"assembly", // assembly | aisle (making way) | filing (streaming in)
  rows:3,               // depth tiers (back..front)
  perRow:[9,7,5],       // members per tier (density)
  attention:0.8,        // 0 = heads wandering .. 1 = all turned rapt on the BEMA
  pity:0.4,             // 0 = silent & upright .. 1 = the crowd moved to pity
  wave:0.5,             // position 0..1 of the pity RIPPLE across the width
  waveSpread:0.18,      // how wide the pity band is
  density:1.0,          // 0 = sparse (front tier only) .. 1 = full agora
  showBema:true,        // draw the foreground speaker's stone (focus pole)
  seatY:0.74,           // front-row footline as fraction of H
  focusX:0.5,           // where the crowd's attention converges (the bema)
};

/* -------- ONE member template: a standing Ithacan citizen --------
   All geometry keyed off `s` (member height). headTurn in -1..1 aims the
   face toward the bema (the ATTENTION cue). pityAmt in 0..1 lifts a hand to
   the face and bows the head (the reaction-WAVE cue). `feat` carries
   deterministic identity (beard, hair, headcloth, staff, scale). */
function drawCitizen(pen, cx, baseY, s, shade, headTurn, pityAmt, feat){
  const g = pen.ctx;
  const robe = toneSolid(inkLevel(shade.robe));
  const skin = toneSolid(inkLevel(shade.skin));
  const dark = toneSolid(inkLevel(shade.hair));
  const cloakT = toneSolid(inkLevel(shade.cloak));
  const cw = Math.max(2, s*0.020);

  const bodyH   = s*0.60;
  const shoTop  = s*0.24;               // shoulder half-width
  const hemBot  = s*0.30;               // robe hem half-width (flares out)
  const shoulderY = baseY - bodyH;
  const headR   = s*0.150*feat.headS;
  const headBow = pityAmt*headR*0.55;   // pity dips the head forward+down
  const headCy  = shoulderY - headR*0.92 + headBow*0.5;

  // ground shadow
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, baseY+s*0.01, hemBot*1.15, s*0.035, 0,0,7); g.fill();

  // walking staff BEHIND the body (some elders lean on one)
  if (feat.staff){
    const stx = cx - shoTop*1.15*feat.flip;
    pen.limb(()=>{ g.moveTo(stx, shoulderY-s*0.02); g.lineTo(stx+ s*0.015*feat.flip, baseY+s*0.02); },
             toneSolid(inkLevel(6)), Math.max(2,s*0.02));
  }

  // feet peeking below the hem
  const footY = baseY - s*0.005;
  pen.paint(()=>{ g.ellipse(cx-hemBot*0.42, footY, hemBot*0.24, s*0.028, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  pen.paint(()=>{ g.ellipse(cx+hemBot*0.42, footY, hemBot*0.24, s*0.028, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);

  // robe: long chiton, shoulders -> flared hem
  pen.paint(()=>{
    g.moveTo(cx-shoTop, shoulderY);
    g.lineTo(cx+shoTop, shoulderY);
    g.lineTo(cx+hemBot, baseY);
    g.lineTo(cx-hemBot, baseY);
    g.closePath();
  }, robe, cw);
  // drapery fold seams
  pen.seam(()=>{ g.moveTo(cx, shoulderY+s*0.04); g.lineTo(cx-headTurn*s*0.04, baseY); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx-shoTop*0.5, shoulderY+s*0.05); g.lineTo(cx-hemBot*0.5, baseY); }, cw*0.55);
  pen.seam(()=>{ g.moveTo(cx+shoTop*0.5, shoulderY+s*0.05); g.lineTo(cx+hemBot*0.5, baseY); }, cw*0.55);

  // cloak/himation draped over one shoulder (some citizens)
  if (feat.cloak){
    const F = feat.flip;
    pen.paint(()=>{
      g.moveTo(cx-shoTop*F*0.2, shoulderY-headR*0.1);
      g.lineTo(cx+shoTop*1.05*F, shoulderY+s*0.04);
      g.lineTo(cx+hemBot*0.85*F, baseY-s*0.02);
      g.lineTo(cx+hemBot*0.10*F, baseY-s*0.04);
      g.closePath();
    }, cloakT, cw*0.9);
  }

  // neck
  pen.paint(()=>{ g.rect(cx-headR*0.30, shoulderY-headR*0.55, headR*0.60, headR*0.85); }, skin, cw*0.8);

  // hair / head BACK mass
  const hx = cx + headTurn*headR*0.26;
  if (feat.head==="hair" || feat.head==="cloth")
    pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.16, headR*1.12, headR*1.24, 0,0,7); },
              feat.head==="cloth"?cloakT:dark, cw*0.9);

  // head — turned toward the bema
  pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, cw);

  // face: eyes + brow + nose, all offset by headTurn (ATTENTION)
  const eyeY = headCy - headR*0.04 + headBow*0.2;
  const gx   = headTurn*headR*0.30;
  g.fillStyle = INK;
  const eyeR = headR*0.10;
  const eL = hx - headR*0.32 + gx, eR = hx + headR*0.32 + gx;
  if (headTurn > -0.5){ g.beginPath(); g.ellipse(eR, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  if (headTurn <  0.5){ g.beginPath(); g.ellipse(eL, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  // brow (steeper when moved to pity)
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.16); g.lineCap="round";
  g.beginPath();
  g.moveTo(hx-headR*0.46+gx, eyeY-headR*0.30 + pityAmt*headR*0.10);
  g.lineTo(hx+headR*0.46+gx, eyeY-headR*0.34);
  g.stroke();
  // nose (points the way the head faces)
  g.lineWidth=Math.max(2,headR*0.12);
  g.beginPath();
  g.moveTo(hx+gx*0.6, eyeY+headR*0.05);
  g.lineTo(hx + headTurn*headR*0.40, eyeY+headR*0.40); g.stroke();
  // mouth: a small down-set line, more pressed when pitying
  g.lineWidth=Math.max(2,headR*0.10);
  g.beginPath();
  g.moveTo(hx-headR*0.22+gx, headCy+headR*0.52);
  g.quadraticCurveTo(hx+gx, headCy+headR*0.52+pityAmt*headR*0.14, hx+headR*0.22+gx, headCy+headR*0.52);
  g.stroke();

  // hair FRONT cap / head-cloth drape / beard
  if (feat.head==="hair")
    pen.paint(()=>{
      g.moveTo(hx-headR*0.92, headCy-headR*0.02);
      g.quadraticCurveTo(hx, headCy-headR*1.32, hx+headR*0.92, headCy-headR*0.02);
      g.quadraticCurveTo(hx+headR*0.5, headCy-headR*0.5, hx, headCy-headR*0.45);
      g.quadraticCurveTo(hx-headR*0.5, headCy-headR*0.5, hx-headR*0.92, headCy-headR*0.02);
    }, dark, cw*0.8);
  else if (feat.head==="cloth")
    pen.paint(()=>{
      g.moveTo(hx-headR*1.02, headCy+headR*0.15);
      g.quadraticCurveTo(hx, headCy-headR*1.30, hx+headR*1.02, headCy+headR*0.15);
      g.quadraticCurveTo(hx+headR*0.7, headCy-headR*0.25, hx, headCy-headR*0.30);
      g.quadraticCurveTo(hx-headR*0.7, headCy-headR*0.25, hx-headR*1.02, headCy+headR*0.15);
    }, cloakT, cw*0.8);
  if (feat.beard)
    pen.paint(()=>{
      g.moveTo(hx-headR*0.58, headCy+headR*0.38);
      g.quadraticCurveTo(hx, headCy+headR*1.45, hx+headR*0.58, headCy+headR*0.38);
      g.quadraticCurveTo(hx, headCy+headR*0.78, hx-headR*0.58, headCy+headR*0.38);
    }, dark, cw*0.7);

  // PITY arm: near-side forearm lifted, hand toward the cheek/mouth.
  // Blends from a resting hang (pityAmt 0) to hand-at-face (pityAmt 1).
  if (pityAmt > 0.05){
    const F = feat.flip;
    const sh = { x: cx + F*shoTop*0.72, y: shoulderY + s*0.05 };
    // elbow swings in and up as pity rises
    const el = { x: lerp(sh.x, cx + F*hemBot*0.55, pityAmt),
                 y: lerp(sh.y + s*0.20, shoulderY + s*0.10, pityAmt) };
    // hand travels from hip up to the face
    const hand = { x: lerp(sh.x, hx - F*headR*0.28, pityAmt),
                   y: lerp(baseY - s*0.30, headCy + headR*0.55, pityAmt) };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, robe, s*0.055);
    pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(hand.x,hand.y); }, skin, s*0.045);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.032, 0,7); }, skin, cw*0.7);
  }

  return { head:{x:hx,y:headCy}, r:headR };
}

/* -------- BEMA: the speaker's stone the whole assembly faces (focus pole).
   A low stepped block with the herald's SCEPTER planted on it — the object a
   speaker holds to claim the floor. Lit brighter as attention converges. -- */
function drawBema(pen, cx, baseY, s, lit){
  const g = pen.ctx;
  const stone = toneSolid(inkLevel(lit?6:5));
  const step  = toneSolid(inkLevel(lit?5:4));
  // two-step stone platform
  pen.paint(()=>{ g.rect(cx-s*0.60, baseY-s*0.34, s*1.20, s*0.34); }, stone, 5);
  pen.paint(()=>{ g.rect(cx-s*0.78, baseY-s*0.14, s*1.56, s*0.14); }, step, 4);
  // planted scepter/staff with a knob
  g.strokeStyle=INK; g.lineWidth=Math.max(3,s*0.05); g.lineCap="round";
  g.beginPath(); g.moveTo(cx, baseY-s*1.15); g.lineTo(cx, baseY-s*0.34); g.stroke();
  pen.paint(()=>{ g.arc(cx, baseY-s*1.20, s*0.09, 0,7); }, toneSolid(inkLevel(lit?7:6)), 4);
}

/* -------- build the member set deterministically from params + state -------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const attention = clamp01(p.attention);
  const pity      = clamp01(p.pity);
  const wave      = clamp01(p.wave);
  const sigma     = Math.max(0.05, p.waveSpread);
  const density   = clamp01(p.density);
  const rows      = Math.max(1, p.rows|0);
  const perRow    = p.perRow || [9,7,5];
  const formation = p.formation || "assembly";
  const focusX    = (p.focusX ?? 0.5) * W;
  const focusY    = H*0.90;                      // bema sits low & forward

  const members = [];
  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 0;       // 0 = back .. 1 = front
    // density thins the deep rows first (keep the front tier populated)
    if (density < 1 && depth < (1-density)*0.9) continue;
    let n = perRow[Math.min(r, perRow.length-1)] || (9-2*r);
    n = Math.max(2, Math.round(n * (0.55 + 0.45*density)));

    const scale   = lerp(80, 152, depth);
    const rowY    = H*(0.40 + depth*(p.seatY-0.40));
    const marginX = lerp(0.16, 0.09, depth);
    const stagger = (r%2)*0.5;

    for (let i=0;i<n;i++){
      const t  = n>1 ? (i+stagger)/(n-1+stagger) : 0.5;
      let px   = lerp(marginX, 1-marginX, clamp01(t));
      let by   = rowY;
      let vis  = true;

      // FORMATION shaping -----------------------------------------------
      if (formation==="assembly"){
        // shallow bowl: the ends of each rank curl slightly forward
        by = rowY + Math.sin(clamp01(t)*Math.PI)*scale*0.10;
      }
      else if (formation==="aisle"){
        // making way: clear a central corridor, push ranks to the sides
        const corr = 0.12;
        if (px > 0.5-corr && px < 0.5+corr){
          px = px < 0.5 ? (0.5-corr) - (0.5-px)*0.35 : (0.5+corr) + (px-0.5)*0.35;
        }
        by = rowY + Math.sin(clamp01(t)*Math.PI)*scale*0.10;
      }
      else if (formation==="filing"){
        // streaming in from the left entrance: crowd massed right, a diagonal
        // file trailing down toward the lower-left doorway
        px = lerp(0.40, 0.93, clamp01(t));
        const lead = clamp01((0.40 - px)/0.40);   // 0 in the body, 1 at the tail
        by = rowY - depth*0 + (t<0.14 ? (t*7)*scale*0.0 : 0);
      }
      px = clamp(px, 0.05, 0.95);
      let cx = W*px;

      // FILING tail: peel the first slot of the back rank onto the entry path
      if (formation==="filing" && r < rows-1 && i < 2){
        const k = i;                              // 0,1 = two trailing walkers
        cx = W*lerp(0.10, 0.30, k/1.5);
        by = H*lerp(0.52, 0.66, k/1.5);
      }

      // ATTENTION: turn each head toward the bema (bounded to -1..1)
      const headTurn = clamp((focusX - cx)/(W*0.26) * attention, -1, 1);

      // reaction-WAVE: a moving band of pity. members inside the band lift a
      // hand to the face; outside it they stand silent.
      const d = (px - wave);
      const band = Math.exp(-(d*d)/(2*sigma*sigma));
      const pityAmt = clamp01(pity * band);

      // deterministic identity
      const rng  = rnd((r*211 + i*29 + 13)>>>0);
      const feat = {
        beard: rng() < 0.42,
        head:  (()=>{ const u=rng(); return u<0.20 ? "cloth" : u<0.92 ? "hair" : "bald"; })(),
        headS: 0.88 + rng()*0.26,
        cloak: rng() < 0.45,
        staff: rng() < 0.18,
        flip:  rng() < 0.5 ? -1 : 1,
      };
      const shade = {
        robe:  Math.round(lerp(3, 4, depth)) + (i%2),
        skin:  Math.round(lerp(2, 3, depth)),
        hair:  Math.round(lerp(5, 6, depth)),
        cloak: Math.round(lerp(4, 5, depth)),
      };

      members.push({ cx, baseY:by, s:scale, shade, headTurn, pityAmt, feat, depth, px });
    }
  }
  // painter's order: back (small) -> front (large)
  members.sort((a,b)=> a.baseY - b.baseY);
  return { members, focusX, focusY, attention, formation, showBema:p.showBema };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const { members, focusX, focusY, attention, formation, showBema } = buildMembers(W, H, st);

  // ---- ground of the agora (lightest, so it reads as open ground) ----
  const horizon = H*0.34;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  // distant Ithacan rooftops along the skyline (kept faint + low)
  g.fillStyle = inkLevel(2);
  for (let i=0;i<7;i++){
    const bx = W*(0.06 + i*0.135), bw = W*0.10, bh = H*(0.05+0.02*((i*3)%3));
    g.beginPath(); g.rect(bx, horizon-bh, bw, bh); g.fill();
    // roof peak
    g.beginPath(); g.moveTo(bx-W*0.01,horizon-bh); g.lineTo(bx+bw*0.5,horizon-bh-H*0.03); g.lineTo(bx+bw+W*0.01,horizon-bh); g.fill();
  }
  // horizon line
  pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 3);

  // ---- floor: radial paving converging on the bema (the shared focus) ----
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.22;
  for (let i=-6;i<=6;i++){ g.beginPath(); g.moveTo(focusX, focusY); g.lineTo(W*0.5+i*W*0.14, horizon); g.stroke(); }
  for (let j=1;j<=4;j++){ const y=horizon+(H-horizon)*(j/4)*(j/4); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // ---- making-way: a brighter cleared aisle down the centre ----
  if (formation==="aisle"){
    g.save();
    g.fillStyle=inkLevel(1);
    g.beginPath();
    g.moveTo(W*0.46, horizon); g.lineTo(W*0.54, horizon);
    g.lineTo(W*0.62, H*0.98); g.lineTo(W*0.38, H*0.98); g.closePath(); g.fill();
    g.strokeStyle=INK; g.globalAlpha=0.35; g.lineWidth=2;
    g.beginPath(); g.moveTo(W*0.46,horizon); g.lineTo(W*0.38,H*0.98); g.stroke();
    g.beginPath(); g.moveTo(W*0.54,horizon); g.lineTo(W*0.62,H*0.98); g.stroke();
    g.restore();
  }

  // ---- filing: an entrance threshold at the lower-left the file comes through ----
  if (formation==="filing"){
    const ex=W*0.05, ey=H*0.70, ew=W*0.10, eh=H*0.26;
    pen.paint(()=>{ g.rect(ex, ey-eh, ew, eh); }, toneSolid(inkLevel(3)), 4);
    g.fillStyle=inkLevel(1); g.beginPath(); g.rect(ex+ew*0.18, ey-eh*0.86, ew*0.64, eh*0.86); g.fill();
    pen.ink(()=>{ g.moveTo(ex, ey-eh); g.lineTo(ex+ew, ey-eh); }, 3);
  }

  // ---- the citizens, back -> front ----
  members.forEach(m => drawCitizen(pen, m.cx, m.baseY, m.s, m.shade, m.headTurn, m.pityAmt, m.feat));

  // ---- the BEMA (speaker's stone) in the foreground, the attention pole ----
  if (showBema){
    drawBema(pen, focusX, H*0.955, W*0.085, attention>=0.5);
  }
}

export const asset = {
  id:"ensemble.people-of-ithaca",
  type:"ENSEMBLE",
  name:"People of Ithaca",
  statusWord:"HUSHED",
  scene:"OD-B02-S01",

  params,
  // back -> front draw order the ensemble honors
  layers:["skyline","floor","aisle","entrance","back-row","mid-row","front-row","bema"],
  // normalized 0..1 anchors: the focus pole + placement / entry / camera handles
  anchors:{
    "focus:bema":{x:.50,y:.90},   "speaker:stone":{x:.50,y:.955},
    "row:back":{x:.50,y:.40},     "row:front":{x:.50,y:.74},
    "aisle:mouth":{x:.50,y:.34},  "aisle:foot":{x:.50,y:.98},
    "entrance:left":{x:.06,y:.70}, "exit:right":{x:.95,y:.72},
    "center":{x:.50,y:.58},        "camera:wide":{x:.50,y:.52},
  },
  // walkable ground region (for scene placement / pathing)
  zones:{ agora:{ x0:.05,y0:.36,x1:.95,y1:.98 }, aisle:{ x0:.38,y0:.34,x1:.62,y1:.98 } },
  states:{
    initial:"listening",
    nodes:{
      // filing into the agora from the left, not yet settled or attending
      "filing-in":  { preview:{ formation:"filing", attention:0.25, pity:0.0, density:0.85, status:"FILING" } },
      // making way: a corridor cleared down the middle for a speaker to pass
      "making-way": { preview:{ formation:"aisle", attention:0.5, pity:0.1, density:1.0, status:"MAKING WAY" } },
      // rapt, upright, silent — all heads turned to the bema
      "listening":  { preview:{ formation:"assembly", attention:0.95, pity:0.0, density:1.0, status:"LISTENING" } },
      // moved to pity — a ripple of lifted hands sweeps the ranks
      "pity":       { preview:{ formation:"assembly", attention:0.8, pity:0.9, wave:0.45, waveSpread:0.22, density:1.0, status:"MOVED" } },
      // the silence after — hands down, still, heavy
      "silence":    { preview:{ formation:"assembly", attention:0.7, pity:0.0, density:1.0, status:"SILENT" } },
    },
    edges:[
      ["filing-in","making-way"],["making-way","listening"],
      ["listening","pity"],["pity","silence"],["silence","listening"],
      ["silence","filing-in"],
    ],
  },
  channels:["attention","pity","wave","waveSpread","formation","density","depth"],

  // neutral preview = the hush caught mid-turn: rapt, with a wave of pity rising
  preview:()=>({ formation:"assembly", attention:0.85, pity:0.45, wave:0.5, waveSpread:0.18,
                 density:1.0, status:"HUSHED", progress:0.4 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
