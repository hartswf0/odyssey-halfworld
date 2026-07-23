/* ensemble.palace-working-women — fifty serving-women at synchronized labor.
   ENSEMBLE asset. A repeatable group built from TWO separable member
   templates (a WEAVER at an upright warp-weighted loom, a GRINDER kneeling
   at a rotary quern) instanced N times deterministically inside the hall.
   The scene is a hall of coordinated skilled labor: a back LOOM-LINE of
   weavers beating the weft in unison + a front QUERN-LINE of grinders
   turning their mills. Exposes formation (both | loom-line | quern-line),
   synchrony (0 staggered individual rhythm .. 1 perfectly in phase),
   density (0 front row only .. 1 whole hall, with a faint far loom row that
   sells the crowd of "fifty"), spread, and an attention focus. Drawn in
   SOLID grays + hard contour; the engine dotify POST pass supplies the
   halftone. No named character is baked in.
   Atlas OD-B07-S02 — weavers and grinders performing synchronized skilled
   labor inside the architecture. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const TAU = Math.PI*2;

/* the two labor templates the hall requires */
const ROLES = ["weaver","grinder"];

const params = {
  formation:"both",      // both | loom-line | quern-line
  synchrony:0.9,         // 0 = each at her own rhythm .. 1 = one shared beat
  density:1.0,           // 0 = front row only .. 1 = whole hall + far row
  spread:1.0,            // lateral width of each line about centre
  attention:0.25,        // 0 heads-down at work .. 1 turned to the focus
  focus:{ x:0.5, y:0.30 },
  floorLevel:0.50,       // horizon fraction of H
  farRow:true,           // faint distant loom silhouettes (the rest of the 50)
};

/* member roster: two separable templates on a deterministic list.
   band 0 = back LOOM-LINE (weavers, standing) .. 1 = front QUERN-LINE
   (grinders, kneeling). nx normalized 0..1 across the hall. ph = the
   member's own rhythm phase offset (used when synchrony < 1). */
const MEMBERS = [
  // ---- back row: LOOM-LINE (weavers) ----
  { role:"weaver",  band:0, nx:0.11, ph:0.00, flip: 1 },
  { role:"weaver",  band:0, nx:0.27, ph:1.90, flip: 1 },
  { role:"weaver",  band:0, nx:0.43, ph:3.60, flip: 1 },
  { role:"weaver",  band:0, nx:0.59, ph:0.90, flip: 1 },
  { role:"weaver",  band:0, nx:0.75, ph:2.70, flip: 1 },
  { role:"weaver",  band:0, nx:0.90, ph:4.40, flip: 1 },
  // ---- front row: QUERN-LINE (grinders) ----
  { role:"grinder", band:1, nx:0.15, ph:0.40, flip: 1 },
  { role:"grinder", band:1, nx:0.33, ph:2.20, flip:-1 },
  { role:"grinder", band:1, nx:0.50, ph:4.00, flip: 1 },
  { role:"grinder", band:1, nx:0.67, ph:1.30, flip:-1 },
  { role:"grinder", band:1, nx:0.85, ph:3.10, flip: 1 },
];

const BAND_Y   = [0.585, 0.905];   // footline per band
const BAND_S   = [196, 250];       // member height px per band
const BAND_LVL = [3, 3];           // garment ink level (mid — no black blobs)

/* ============================================================
   small shared parts — arms/legs/heads in solid grays + contour
   ============================================================ */
function arm2(pen,g, sh, hand, sleeve, skin, thick, cw){
  // two-segment arm shoulder->elbow->hand with a slight forward elbow
  const dx=hand.x-sh.x, dy=hand.y-sh.y;
  const el={ x: sh.x+dx*0.5 - dy*0.10, y: sh.y+dy*0.5 + dx*0.10 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, sleeve, thick);
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(hand.x,hand.y); }, skin, thick*0.8);
  pen.paint(()=>{ g.arc(hand.x,hand.y, thick*0.55, 0,7); }, skin, cw*0.7);
}
function leg2(pen,g, hip, foot, bend, cloth, thick, cw){
  const knee={ x:(hip.x+foot.x)/2 + bend, y:(hip.y+foot.y)/2 };
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, cloth, thick);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, cloth, thick*0.9);
  pen.paint(()=>{ g.ellipse(foot.x,foot.y, thick*0.75, thick*0.38, 0,0,7); }, toneSolid(inkLevel(5)), cw*0.7);
}
function headBlob(pen,g, hx, hy, headR, skin, hair, cw, F){
  // hair back mass, face, and a bound bun turned with the head
  pen.paint(()=>{ g.ellipse(hx - F*headR*0.10, hy+headR*0.10, headR*1.06, headR*1.16, 0,0,7); }, hair, cw*0.85);
  pen.paint(()=>{ g.ellipse(hx, hy, headR*0.86, headR, 0,0,7); }, skin, cw);
  // bun at the nape
  pen.paint(()=>{ g.arc(hx - F*headR*0.9, hy+headR*0.15, headR*0.34, 0,7); }, hair, cw*0.7);
  // face marks
  g.fillStyle=INK;
  g.beginPath(); g.ellipse(hx+F*headR*0.30, hy-headR*0.04, headR*0.11, headR*0.14, 0,0,7); g.fill();
  g.strokeStyle=INK; g.lineWidth=Math.max(1.3,headR*0.10); g.lineCap="round";
  g.beginPath(); g.moveTo(hx+F*headR*0.5, hy+headR*0.10); g.lineTo(hx+F*headR*0.74, hy+headR*0.34); g.stroke();
}

/* ============================================================
   WEAVER — stands at an upright warp-weighted loom, both hands high at
   the fell line beating the weft. `beat` (0..1) raises/lowers the beat.
   ============================================================ */
function drawWeaver(pen,g, cx, footY, s, beat, lvl, opt){
  const cloth = toneSolid(inkLevel(lvl));
  const cloth2= toneSolid(inkLevel(Math.min(6,lvl+1)));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const wood  = toneSolid(inkLevel(4));
  const woven = toneSolid(inkLevel(2));      // finished cloth on the beam (light)
  const cw    = Math.max(2, s*0.016);
  const F     = opt.F || 1;

  const loomW = s*0.56, loomH = s*1.18;
  const topY  = footY - loomH;               // cloth beam
  const weightY = footY - s*0.16;            // where the warp weights hang
  const postL = cx - loomW/2, postR = cx + loomW/2;

  // ---- LOOM (behind the weaver) ----
  // uprights
  pen.paint(()=>{ g.rect(postL-cw*1.4, topY, cw*2.8, loomH*0.98); }, wood, cw);
  pen.paint(()=>{ g.rect(postR-cw*1.4, topY, cw*2.8, loomH*0.98); }, wood, cw);
  // top cloth beam
  pen.paint(()=>{ g.rect(postL-cw*2, topY-cw*3, loomW+cw*4, cw*5); }, cloth2, cw);
  // finished woven cloth wound over the top (a light band)
  pen.paint(()=>{ g.rect(postL+cw, topY+cw*2, loomW-cw*2, s*0.16); }, woven, cw*0.8);
  // warp threads descending to the weights
  g.strokeStyle=INK; g.lineWidth=Math.max(1,cw*0.35); g.globalAlpha=0.5;
  const nWarp=9;
  for(let i=0;i<nWarp;i++){
    const wx = lerp(postL+cw*2, postR-cw*2, i/(nWarp-1));
    g.beginPath(); g.moveTo(wx, topY+s*0.16+cw*2); g.lineTo(wx, weightY); g.stroke();
  }
  g.globalAlpha=1;
  // loom weights (a row of small stones at the warp ends)
  for(let i=0;i<nWarp;i++){
    const wx = lerp(postL+cw*2, postR-cw*2, i/(nWarp-1));
    pen.paint(()=>{ g.moveTo(wx-cw*1.4,weightY); g.lineTo(wx+cw*1.4,weightY); g.lineTo(wx,weightY+cw*3.4); g.closePath(); }, wood, cw*0.6);
  }

  // ---- WEAVER standing in front of the warp ----
  const hipY = footY - s*0.30;
  const shoY = hipY - s*0.30;
  const shoW = s*0.26, hemW = s*0.40;
  const headR= s*0.118;
  const neckX= cx + opt.lean*s;
  const headCy = shoY - headR*1.05;
  const hx = neckX + (opt.headDX||0);
  const hy = headCy - (opt.headUp||0);

  // ground shadow
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY+s*0.01, hemW*0.7, s*0.035, 0,0,7); g.fill();

  // legs (standing, feet slightly apart under the hem)
  const hemY = footY;
  leg2(pen,g, {x:cx-shoW*0.28,y:hipY}, {x:cx-shoW*0.34,y:footY}, -s*0.02, cloth, Math.max(3,s*0.05), cw);
  leg2(pen,g, {x:cx+shoW*0.28,y:hipY}, {x:cx+shoW*0.36,y:footY},  s*0.02, cloth, Math.max(3,s*0.055), cw);

  // gown (shoulders -> flared hem)
  pen.paint(()=>{
    g.moveTo(neckX-shoW/2, shoY); g.lineTo(neckX+shoW/2, shoY);
    g.lineTo(cx+hemW/2, hemY); g.lineTo(cx-hemW/2, hemY); g.closePath();
  }, cloth, cw);
  pen.seam(()=>{ g.moveTo(neckX-shoW*0.5, shoY+s*0.20); g.lineTo(neckX+shoW*0.5, shoY+s*0.20); }, cw*0.8);
  pen.seam(()=>{ g.moveTo(neckX, shoY+s*0.22); g.lineTo(cx, hemY); }, cw*0.6);

  // neck + head
  pen.limb(()=>{ g.moveTo(neckX, shoY+s*0.005); g.lineTo(hx, hy+headR*0.65); }, skin, s*0.048);
  headBlob(pen,g, hx, hy, headR, skin, hair, cw, F);

  // ---- BOTH ARMS raised to the fell line, beating the weft ----
  // beat: 1 = struck high at the cloth line, 0 = lowered for the next pass
  const fellY = topY + s*0.20;                 // just under the finished cloth
  const handY = lerp(shoY - s*0.02, fellY, clamp01(beat));
  const shL = { x:neckX-shoW*0.46, y:shoY+s*0.02 };
  const shR = { x:neckX+shoW*0.46, y:shoY+s*0.02 };
  arm2(pen,g, shL, {x:cx-loomW*0.16, y:handY}, cloth2, skin, Math.max(3,s*0.05), cw);
  arm2(pen,g, shR, {x:cx+loomW*0.16, y:handY}, cloth2, skin, Math.max(3,s*0.05), cw);
  // the beater / weft bar held across between the hands
  pen.paint(()=>{ g.rect(cx-loomW*0.20, handY-cw*1.2, loomW*0.40, cw*2.4); }, wood, cw*0.7);
}

/* ============================================================
   GRINDER — kneels at a rotary quern, one hand on the turning handle
   sweeping a circle. `turn` (radians) = handle angle.
   ============================================================ */
function drawGrinder(pen,g, cx, footY, s, turn, lvl, opt){
  const cloth = toneSolid(inkLevel(lvl));
  const cloth2= toneSolid(inkLevel(Math.min(6,lvl+1)));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const stone = toneSolid(inkLevel(4));
  const stone2= toneSolid(inkLevel(5));
  const cw    = Math.max(2, s*0.016);
  const F     = opt.F || 1;

  // the quern sits in front of her, on the ground
  const qx = cx + F*s*0.20, qy = footY - s*0.02;
  const qr = s*0.22;

  // kneeling body: hips low over the heels
  const hipY = footY - s*0.20;
  const shoY = hipY - s*0.30;
  const shoW = s*0.28, hemW = s*0.52;
  const headR= s*0.115;
  const neckX= cx + opt.lean*s + F*s*0.05;    // leaning toward the quern
  const headCy = shoY - headR*1.05;
  const hx = neckX + (opt.headDX||0) + F*s*0.03;
  const hy = headCy - (opt.headUp||0);

  // ground shadow
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx+F*s*0.06, footY+s*0.01, hemW*0.7, s*0.04, 0,0,7); g.fill();

  // ---- lower millstone (drawn first, body kneels behind it) ----
  pen.paint(()=>{ g.ellipse(qx, qy, qr, qr*0.42, 0,0,7); }, stone2, cw);

  // ---- folded kneeling legs (a low draped mass) ----
  pen.paint(()=>{
    g.moveTo(cx-hemW*0.5, footY); g.lineTo(cx+hemW*0.5, footY);
    g.quadraticCurveTo(cx+hemW*0.5, hipY+s*0.02, cx+shoW*0.5, hipY);
    g.lineTo(cx-shoW*0.5, hipY);
    g.quadraticCurveTo(cx-hemW*0.5, hipY+s*0.02, cx-hemW*0.5, footY);
    g.closePath();
  }, cloth, cw);

  // ---- torso (shoulders -> waist), leaning toward the quern ----
  pen.paint(()=>{
    g.moveTo(neckX-shoW/2, shoY); g.lineTo(neckX+shoW/2, shoY);
    g.lineTo(cx+shoW*0.6, hipY); g.lineTo(cx-shoW*0.6, hipY); g.closePath();
  }, cloth2, cw);
  pen.seam(()=>{ g.moveTo(neckX-shoW*0.5, shoY+s*0.16); g.lineTo(neckX+shoW*0.5, shoY+s*0.16); }, cw*0.7);

  // neck + head
  pen.limb(()=>{ g.moveTo(neckX, shoY+s*0.005); g.lineTo(hx, hy+headR*0.65); }, skin, s*0.048);
  headBlob(pen,g, hx, hy, headR, skin, hair, cw, F);

  // ---- the turning handle + hand sweeping the circle ----
  const hr = qr*0.62;                          // handle radius on the stone
  const handle = { x: qx + Math.cos(turn)*hr, y: qy + Math.sin(turn)*hr*0.42 - s*0.04 };
  // far/steadying hand rests on the rim
  const shBack = { x:neckX-F*shoW*0.42, y:shoY+s*0.03 };
  arm2(pen,g, shBack, {x:qx-F*qr*0.5, y:qy-s*0.05}, cloth2, skin, Math.max(3,s*0.05), cw);

  // ---- upper millstone (the runner) over the flour bed ----
  pen.paint(()=>{ g.ellipse(qx, qy-s*0.05, qr*0.82, qr*0.36, 0,0,7); }, stone, cw);
  // central hopper hole
  g.fillStyle=inkLevel(1); g.beginPath(); g.ellipse(qx, qy-s*0.05, qr*0.14, qr*0.07, 0,0,7); g.fill();
  // the vertical handle peg
  pen.paint(()=>{ g.rect(handle.x-cw*1.1, handle.y, cw*2.2, s*0.10); }, toneSolid(inkLevel(6)), cw*0.7);

  // ---- driving hand + arm on the handle ----
  const shFront = { x:neckX+F*shoW*0.42, y:shoY+s*0.03 };
  arm2(pen,g, shFront, {x:handle.x, y:handle.y+s*0.01}, cloth2, skin, Math.max(3,s*0.05), cw);

  // a little ground flour scatter around the quern
  g.fillStyle=inkLevel(2);
  for(let i=0;i<5;i++){ const a=i*1.3+F; g.beginPath(); g.ellipse(qx+Math.cos(a)*qr*1.05, qy+qr*0.3+Math.sin(a)*qr*0.2, cw*1.6, cw*0.9, 0,0,7); g.fill(); }
}

/* ============================================================
   STAGE — hall context (back wall + floor + a faint far loom row that
   sells the "fifty"), then the two labor lines back -> front.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const p = { ...params, ...st, focus:{ ...params.focus, ...(st.focus||{}) } };
  const horizon = H*p.floorLevel;
  const formation = p.formation || "both";
  const synchrony = clamp01(p.synchrony);
  const density   = clamp01(p.density);
  const spread    = clamp(p.spread, 0.6, 1.5);
  const attention = clamp01(p.attention);
  const focusX    = p.focus.x*W;
  const t         = st.t || 0;

  // ---- back wall (mid-light) with a doorway + wall courses ----
  g.fillStyle=inkLevel(2); g.fillRect(0,0,W,horizon);
  pen.paint(()=>{ g.rect(W*0.03, horizon-H*0.30, W*0.94, H*0.30); }, toneSolid(inkLevel(3)), 4);
  pen.ink(()=>{ g.moveTo(W*0.03,horizon-H*0.30); g.lineTo(W*0.97,horizon-H*0.30); }, 3);
  // masonry courses
  g.strokeStyle=INK; g.globalAlpha=0.22; g.lineWidth=2;
  for(let j=1;j<=3;j++){ const y=horizon-H*0.30+H*0.30*(j/4); g.beginPath(); g.moveTo(W*0.03,y); g.lineTo(W*0.97,y); g.stroke(); }
  g.globalAlpha=1;
  // wall pilasters (framing the hall)
  for(const fx of [0.09,0.91]){
    pen.paint(()=>{ g.rect(W*fx-W*0.016, horizon-H*0.30, W*0.032, H*0.30); }, toneSolid(inkLevel(4)), 3);
  }
  // a hall doorway centre-back (dark threshold)
  pen.paint(()=>{ g.rect(W*0.455, horizon-H*0.24, W*0.09, H*0.24); }, toneSolid(inkLevel(2)), 3);
  g.fillStyle=inkLevel(1); g.fillRect(W*0.465, horizon-H*0.225, W*0.07, H*0.225);

  // ---- FAR loom row (faint distant weavers — the rest of the fifty) ----
  if (p.farRow && density>0.55 && formation!=="quern-line"){
    for(let i=0;i<8;i++){
      const fx = lerp(W*0.10, W*0.90, i/7);
      const fh = H*0.10, fy = horizon-H*0.02;
      pen.paint(()=>{ g.rect(fx-W*0.008, fy-fh, W*0.016, fh); }, toneSolid(inkLevel(3)), 2); // loom post
      pen.paint(()=>{ g.rect(fx+W*0.018-W*0.008, fy-fh, W*0.016, fh); }, toneSolid(inkLevel(3)), 2);
      pen.paint(()=>{ g.ellipse(fx+W*0.009, fy-fh*0.55, W*0.012, fh*0.16, 0,0,7); }, toneSolid(inkLevel(4)), 2); // a tiny worker
    }
  }

  // ---- floor (lightest, receding) ----
  g.fillStyle=inkLevel(1); g.fillRect(0,horizon,W,H-horizon);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.32;
  for(let i=-5;i<=5;i++){ g.beginPath(); g.moveTo(W*0.5,horizon); g.lineTo(W*0.5+i*W*0.17,H); g.stroke(); }
  for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // ---- members: filter by formation + density, then back -> front ----
  const roster = MEMBERS
    .map((m,i)=>({ ...m, i }))
    .filter(m => formation==="both" ? true : (formation==="loom-line" ? m.role==="weaver" : m.role==="grinder"))
    .filter(m => density>=1 ? true : m.band>=Math.round((1-density)*(BAND_Y.length-1)))
    .sort((a,b)=> BAND_Y[a.band]-BAND_Y[b.band]);

  for(const m of roster){
    const footY = BAND_Y[m.band]*H;
    const s     = BAND_S[m.band];
    const lvl   = BAND_LVL[m.band];
    const nx    = clamp(0.5 + (m.nx-0.5)*spread, 0.06, 0.94);
    const cx    = nx*W;
    // synchrony: shared beat when 1, own phase offset when 0
    const phase = t*2.2 + (1-synchrony)*m.ph;
    // attention: turn a head up toward the focus
    const headDX = clamp((focusX-cx)*0.06*attention, -s*0.06, s*0.06);
    const headUp = attention*s*0.02;
    const opt = { F:m.flip, lean:0, headDX, headUp };

    if (m.role==="weaver"){
      const beat = 0.5 + 0.5*Math.sin(phase);          // 0..1 beat cycle
      drawWeaver(pen,g, cx, footY, s, beat, lvl, opt);
    } else {
      const turn = phase + m.nx*TAU;                    // handle angle
      drawGrinder(pen,g, cx, footY, s, turn, lvl, opt);
    }
  }
}

export const asset = {
  id:"ensemble.palace-working-women",
  type:"ENSEMBLE",
  name:"Palace working women",
  statusWord:"LABORING",
  scene:"OD-B07-S02",

  params,
  // two separable member templates instanced across two depth lines
  member:{ templates:["weaver","grinder"], roles:ROLES, roster:MEMBERS },
  // back -> front draw order the stage honors
  layers:["backwall","pilasters","doorway","far-loom-row","floor","loom-line","quern-line"],
  // normalized placement / camera / focus anchors (NOT baked characters)
  anchors:{
    "line:loom":{x:.50,y:.585},
    "line:quern":{x:.50,y:.905},
    "station:loom-left":{x:.11,y:.585},
    "station:loom-right":{x:.90,y:.585},
    "station:quern-left":{x:.15,y:.905},
    "station:quern-right":{x:.85,y:.905},
    "focus:overseer":{x:.50,y:.30},
    "door:hall":{x:.50,y:.44},
    "entrance:left":{x:.06,y:.95}, "exit:right":{x:.94,y:.95},
    "camera:wide":{x:.50,y:.55},
  },
  // walkable service floor between the two labor lines
  zones:{ walkable:{ x0:.06,y0:.52,x1:.94,y1:.98 }, "loom-aisle":{ x0:.06,y0:.55,x1:.94,y1:.66 }, "quern-aisle":{ x0:.06,y0:.82,x1:.94,y1:.97 } },
  channels:["synchrony","formation","density","spread","attention"],
  states:{
    initial:"synchronized",
    nodes:{
      // OD-B07-S02: the whole hall beating and grinding in unison
      "synchronized":{ preview:{ formation:"both", synchrony:0.95, density:1.0, attention:0.2 } },
      // the same labor but each woman at her own rhythm
      "staggered":   { preview:{ formation:"both", synchrony:0.15, density:1.0, attention:0.3 } },
      // isolate the back weavers' loom-line
      "loom-line":   { preview:{ formation:"loom-line", synchrony:0.9, density:1.0, attention:0.2 } },
      // isolate the front grinders' quern-line
      "quern-line":  { preview:{ formation:"quern-line", synchrony:0.9, density:1.0, attention:0.2 } },
      // heads lift toward an overseer / arrival
      "attentive":   { preview:{ formation:"both", synchrony:0.7, density:1.0, attention:1.0 } },
    },
    edges:[
      ["synchronized","staggered"],["staggered","synchronized"],
      ["synchronized","attentive"],["attentive","synchronized"],
      ["synchronized","loom-line"],["synchronized","quern-line"],
    ],
  },

  // neutral preview = the full hall in synchronized skilled labor
  preview:()=>({ formation:"both", synchrony:0.95, density:1.0, attention:0.2, spread:1.0, t:0.6, status:"LABORING", progress:0.24 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
