/* ensemble.the-sirens — bird-women singers on the shore rocks.
   ENSEMBLE asset. Two or three winged women (bird-women) perched STILL on the
   shore rocks, projecting irresistible radiating song toward a passing course.
   Built from ONE separable member template (drawSiren) instanced N times
   deterministically in a PERCHED-ROW across depth. Each member: a bird lower
   body with talons gripping the rock + folded/lifted wings + a human female
   torso, head thrown back mid-song. Bodies do NOT pursue — they stay planted;
   the SONG is the active element: directional wavefront arcs radiate from every
   mouth and converge on a bright ACCENT lure-point (the ship's course) that
   sits BEYOND their range. Exposes formation (perched-row | cluster), song
   intensity + lure-point projection channels, density, spread, and an optional
   lyre variant in place of a raised wing. Drawn in SOLID grays + hard contour;
   the engine dotify POST pass supplies the halftone. No named siren is baked in
   — the members are an interchangeable trio.
   Atlas OD-B12-S03 (plural singers, still bodies, irresistible vocal
   projection, no pursuit beyond range). */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

const params = {
  formation:"perched-row",   // perched-row | cluster
  count:3,                   // sirens (2 or 3)
  songIntensity:1.0,         // 0 = silent / mouths closed .. 1 = full irresistible song
  lure:{ x:0.90, y:0.40 },   // normalized point the song converges on (ship's course), BEYOND range
  withLyre:false,            // false = winged women; true = one wing lowered, a lyre held
  density:1.0,               // 0 = nearest singer only .. 1 = whole row
  spread:1.0,                // lateral width of the perched row
  showSea:true,
  showRange:true,            // faint arc marking the limit of the rocks (no pursuit past it)
};

/* member roster: separable template on a deterministic list.
   slot = position along the shore (0 = far/back-left .. count-1 = near/front-right).
   tilt = how far the head is thrown back in song (rad); flip = facing. */
const MEMBERS = [
  { slot:0, flip: 1, tilt:0.34, wing:"high" },   // back-left, singing upward
  { slot:1, flip: 1, tilt:0.20, wing:"open" },   // centre, wings half-open
  { slot:2, flip:-1, tilt:0.42, wing:"high" },   // near-right, head furthest back
];

/* ============================================================
   MEMBER TEMPLATE — one siren, drawn deterministically in solid grays.
   Bird lower body + talons on the rock, wings behind, human torso + head
   thrown back in song. Returns the mouth point so the stage can project song.
   ============================================================ */
function drawSiren(pen, g, cx, perchY, s, look){
  const F        = look.F;
  const feather  = toneSolid(inkLevel(look.featherLvl));
  const feather2 = toneSolid(inkLevel(Math.min(7, look.featherLvl+2)));
  const wingTone = toneSolid(inkLevel(look.wingLvl));
  const skin     = toneSolid(inkLevel(2));
  const drape    = toneSolid(inkLevel(look.drapeLvl));
  const hair     = toneSolid(inkLevel(6));
  const cw       = Math.max(2, s*0.02);

  const footY  = perchY;
  const hipY   = footY - s*0.30;              // top of the bird lower body
  const shoY   = hipY  - s*0.30;              // shoulders
  const shoW   = s*0.26;
  const headR  = s*0.115;
  const neckX  = cx + F*s*0.02;
  // head thrown back in song: pitch up + slightly away from facing
  const tilt   = look.tilt;
  const headCx = neckX + F*Math.sin(tilt)*s*0.10;
  const headCy = shoY - headR*1.05 - Math.cos(tilt)*s*0.02;

  // ---- ground shadow on the rock ----
  g.fillStyle = "rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, footY+s*0.015, s*0.24, s*0.045, 0,0,7); g.fill();

  // ---- FAR WING (behind everything) ----
  drawWing(pen,g, neckX - F*shoW*0.30, shoY - s*0.02, -F, s, look.wing==="open"?"open":"high", wingTone, cw, true);

  // ---- BIRD TAIL FEATHERS (splayed down/behind the perch) ----
  pen.paint(()=>{
    g.moveTo(cx - F*s*0.02, hipY + s*0.05);
    g.lineTo(cx - F*s*0.26, footY + s*0.10);
    g.lineTo(cx - F*s*0.12, footY + s*0.16);
    g.lineTo(cx + F*s*0.04, footY + s*0.12);
    g.lineTo(cx + F*s*0.10, hipY + s*0.10);
    g.closePath();
  }, feather, cw);
  // tail feather split lines
  g.strokeStyle=INK; g.globalAlpha=0.5; g.lineWidth=Math.max(1.5,s*0.012);
  for(let i=0;i<3;i++){ const t=i/2; g.beginPath();
    g.moveTo(cx - F*s*0.01, hipY + s*0.06);
    g.lineTo(cx + lerp(-F*s*0.22, F*s*0.06, t), footY + s*0.12); g.stroke(); }
  g.globalAlpha=1;

  // ---- BIRD LOWER BODY (feathered teardrop) ----
  pen.paint(()=>{
    g.moveTo(cx - s*0.12, hipY + s*0.02);
    g.quadraticCurveTo(cx - s*0.16, footY - s*0.06, cx - s*0.05, footY - s*0.01);
    g.lineTo(cx + s*0.05, footY - s*0.01);
    g.quadraticCurveTo(cx + s*0.16, footY - s*0.06, cx + s*0.12, hipY + s*0.02);
    g.closePath();
  }, feather, cw);
  // scalloped feather rows on the belly
  g.strokeStyle=INK; g.globalAlpha=0.42; g.lineWidth=Math.max(1.3,s*0.011);
  for(let r=0;r<3;r++){ const yy = lerp(hipY+s*0.03, footY-s*0.05, r/2.2);
    g.beginPath();
    for(let k=-2;k<=2;k++){ const xx=cx+k*s*0.05;
      if(k===-2) g.moveTo(xx, yy); else g.quadraticCurveTo(xx-s*0.025, yy+s*0.03, xx, yy); }
    g.stroke(); }
  g.globalAlpha=1;

  // ---- TALONS gripping the rock ----
  drawTalon(pen,g, cx - s*0.06, footY, -1, s, feather2, cw);
  drawTalon(pen,g, cx + s*0.06, footY,  1, s, feather2, cw);

  // ---- HUMAN TORSO (draped) rising from the feathered body ----
  pen.paint(()=>{
    g.moveTo(neckX - shoW/2, shoY);
    g.quadraticCurveTo(neckX - shoW*0.62, shoY+s*0.14, cx - s*0.11, hipY + s*0.02);
    g.lineTo(cx + s*0.11, hipY + s*0.02);
    g.quadraticCurveTo(neckX + shoW*0.62, shoY+s*0.14, neckX + shoW/2, shoY);
    g.closePath();
  }, drape, cw);
  // where feather meets skin: a soft transition seam
  pen.seam(()=>{ g.moveTo(cx - s*0.11, hipY + s*0.02);
                 g.quadraticCurveTo(cx, hipY - s*0.02, cx + s*0.11, hipY + s*0.02); }, cw*0.7);
  // drape fold
  pen.seam(()=>{ g.moveTo(neckX, shoY+s*0.03); g.lineTo(cx + F*s*0.02, hipY + s*0.02); }, cw*0.55);

  // ---- NEAR ARM raised toward the lure (beckoning) OR holding a lyre ----
  const sh = { x: neckX + F*shoW*0.42, y: shoY + s*0.02 };
  if (look.lyre){
    drawLyre(pen,g, sh, F, s, skin, cw);
  } else {
    // hand lifted, open toward the song's course — a still gesture, not a lunge
    const hand = { x: sh.x + F*s*0.24, y: shoY - s*0.14 };
    const el   = { x: sh.x + F*s*0.15, y: shoY + s*0.02 };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, skin, Math.max(3,s*0.05));
    pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(hand.x,hand.y); }, skin, Math.max(3,s*0.045));
    pen.paint(()=>{ g.arc(hand.x,hand.y, s*0.028, 0,7); }, skin, cw*0.7);
  }

  // ---- NECK + HEAD thrown back in song ----
  pen.limb(()=>{ g.moveTo(neckX, shoY+s*0.01); g.lineTo(headCx, headCy+headR*0.7); }, skin, s*0.055);
  // hair mass streaming down the back
  pen.paint(()=>{ g.ellipse(headCx - F*headR*0.25, headCy + headR*0.35, headR*1.15, headR*1.45, 0,0,7); }, hair, cw*0.85);
  // face oval
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0,0,7); }, skin, cw);
  const mouth = drawSingingFace(g, headCx, headCy, headR, F, look.sing);
  // hair over the crown
  pen.paint(()=>{
    g.moveTo(headCx - headR*1.0, headCy - headR*0.1);
    g.quadraticCurveTo(headCx, headCy - headR*1.5, headCx + headR*1.0, headCy - headR*0.1);
    g.quadraticCurveTo(headCx + headR*0.5, headCy - headR*0.55, headCx, headCy - headR*0.5);
    g.quadraticCurveTo(headCx - headR*0.5, headCy - headR*0.55, headCx - headR*1.0, headCy - headR*0.1);
  }, hair, cw*0.8);

  // ---- NEAR WING (over the torso, framing the singer) ----
  drawWing(pen,g, neckX + F*shoW*0.18, shoY - s*0.03, F, s,
           look.lyre ? "low" : look.wing, wingTone, cw, false);

  return { mouth, headTop:{x:headCx, y:headCy-headR}, perch:{x:cx,y:footY} };
}

/* a wing: a fan of feathers rising from the shoulder. mode high|open|low. */
function drawWing(pen, g, ox, oy, dir, s, mode, tone, cw, back){
  const lift = mode==="high" ? 1.0 : mode==="open" ? 0.55 : 0.15;
  const spread = mode==="open" ? 1.15 : 0.7;
  const tipx = ox + dir*s*0.30*spread;
  const tipy = oy - s*0.42*lift + (mode==="low"? s*0.10:0);
  // wing membrane
  pen.paint(()=>{
    g.moveTo(ox, oy);
    g.quadraticCurveTo(ox + dir*s*0.06, oy - s*0.30*lift, tipx, tipy);
    g.quadraticCurveTo(ox + dir*s*0.34*spread, oy - s*0.08*lift, ox + dir*s*0.24*spread, oy + s*0.12);
    g.quadraticCurveTo(ox + dir*s*0.10, oy + s*0.08, ox, oy);
    g.closePath();
  }, tone, cw*(back?0.8:1));
  // primary feather ribs
  g.strokeStyle=INK; g.globalAlpha=back?0.35:0.55; g.lineWidth=Math.max(1.3,s*0.011);
  for(let i=0;i<4;i++){ const t=i/3;
    g.beginPath();
    g.moveTo(ox + dir*s*0.02, oy + s*0.02);
    g.lineTo(lerp(tipx, ox + dir*s*0.24*spread, t), lerp(tipy, oy + s*0.10, t));
    g.stroke(); }
  g.globalAlpha=1;
}

/* three-toed talon gripping the rock edge */
function drawTalon(pen, g, x, y, side, s, tone, cw){
  pen.limb(()=>{ g.moveTo(x, y - s*0.02); g.lineTo(x + side*s*0.01, y + s*0.03); }, tone, Math.max(2.5,s*0.03));
  g.strokeStyle=INK; g.lineWidth=Math.max(1.6,s*0.014); g.lineCap="round";
  for(let i=-1;i<=1;i++){ g.beginPath();
    g.moveTo(x + side*s*0.005, y + s*0.02);
    g.lineTo(x + i*s*0.028, y + s*0.055); g.stroke(); }
}

/* a lyre held to one side (alternate to a raised wing) */
function drawLyre(pen, g, sh, F, s, skin, cw){
  const lx = sh.x + F*s*0.18, ly = sh.y + s*0.10;
  // forearm to the frame
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(lx - F*s*0.04, ly - s*0.02); }, skin, Math.max(3,s*0.045));
  // U-frame
  pen.paint(()=>{
    g.moveTo(lx - s*0.09, ly + s*0.14);
    g.quadraticCurveTo(lx - s*0.13, ly - s*0.14, lx - s*0.03, ly - s*0.16);
    g.lineTo(lx + s*0.03, ly - s*0.16);
    g.quadraticCurveTo(lx + s*0.13, ly - s*0.14, lx + s*0.09, ly + s*0.14);
    g.lineTo(lx + s*0.05, ly + s*0.15);
    g.quadraticCurveTo(lx, ly + s*0.02, lx - s*0.05, ly + s*0.15);
    g.closePath();
  }, toneSolid(inkLevel(5)), cw);
  // crossbar + strings
  g.strokeStyle=INK; g.lineWidth=Math.max(1.4,s*0.011);
  g.beginPath(); g.moveTo(lx - s*0.055, ly - s*0.15); g.lineTo(lx + s*0.055, ly - s*0.15); g.stroke();
  for(let i=-2;i<=2;i++){ g.beginPath();
    g.moveTo(lx + i*s*0.022, ly - s*0.14); g.lineTo(lx + i*s*0.015, ly + s*0.10); g.stroke(); }
}

/* face with the mouth open in song; returns the mouth point */
function drawSingingFace(g, hx, hy, headR, F, sing){
  // eye (half-closed / rapt) — a short lidded line
  g.strokeStyle=INK; g.lineWidth=Math.max(1.6,headR*0.14); g.lineCap="round";
  g.beginPath(); g.moveTo(hx + F*headR*0.12, hy-headR*0.06); g.lineTo(hx + F*headR*0.46, hy-headR*0.02); g.stroke();
  // nose
  g.lineWidth=Math.max(1.4,headR*0.10);
  g.beginPath(); g.moveTo(hx + F*headR*0.52, hy+headR*0.10); g.lineTo(hx + F*headR*0.78, hy+headR*0.34); g.stroke();
  // open singing mouth (an oval, darker; ACCENT rim when full song)
  const mx = hx + F*headR*0.44, my = hy + headR*0.52;
  const open = 0.4 + 0.6*clamp01(sing);
  g.fillStyle = inkLevel(6);
  g.beginPath(); g.ellipse(mx, my, headR*0.20, headR*0.30*open, F*0.2, 0,7); g.fill();
  if (sing>0.5){ g.strokeStyle=ACCENT; g.lineWidth=Math.max(1.4,headR*0.10);
    g.beginPath(); g.ellipse(mx, my, headR*0.22, headR*0.32*open, F*0.2, 0,7); g.stroke(); }
  return { x:mx, y:my };
}

/* ============================================================
   FORMATION — place each siren along the perched row (or a tight cluster);
   returns draw records back->front + the mouth points for song projection.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st, lure:{ ...(st.lure||params.lure) } };
  const N = clamp(Math.round(p.count)||3, 2, 3);
  const spread = clamp(p.spread, 0.6, 1.4);
  const density = clamp01(p.density);
  const sing = clamp01(p.songIntensity);
  const roster = MEMBERS.slice(0, N).map((m,i)=>({ ...m, i }));

  const recs = [];
  for (const m of roster){
    const t = N>1 ? m.slot/(N-1) : 0.5;          // 0 far-left .. 1 near-right
    if (density<1 && t < (1-density)*0.95) continue; // cull far singers first
    const depthT = t;                             // near sirens larger + lower
    let cx, perchY;
    if (p.formation==="cluster"){
      cx = lerp(W*0.34, W*0.56, t) + (m.slot%2? W*0.03 : -W*0.03);
      perchY = lerp(H*0.66, H*0.74, t);
    } else { // perched-row along the shore, receding left->right-near
      cx = lerp(W*0.16, W*0.60, t)*spread + W*(1-spread)*0.30;
      perchY = lerp(H*0.60, H*0.76, depthT);
    }
    const s = lerp(196, 268, depthT);
    const rec = { m, cx, perchY, s,
      look:{ F:m.flip, tilt:m.tilt, wing:m.wing, sing,
             lyre: p.withLyre && m.slot===1,
             featherLvl: depthT<0.5?3:4, wingLvl: depthT<0.5?2:3,
             drapeLvl: depthT<0.5?3:4 },
      depth:perchY };
    recs.push(rec);
  }
  recs.sort((a,b)=> a.perchY - b.perchY);          // back -> front
  return { recs, sing, lure:{ x:p.lure.x*W, y:p.lure.y*H },
           formation:p.formation, showSea:p.showSea, showRange:p.showRange };
}

/* ============================================================
   SONG PROJECTION — directional wavefront arcs from a mouth converging on the
   lure-point. The arcs are portions of circles centred on the mouth, stepping
   outward toward the lure; the whole fan tightens as it approaches so the song
   reads as focused on the ship's course rather than washing everywhere.
   ============================================================ */
function projectSong(g, mouth, lure, sing, W){
  if (sing<=0.02) return;
  const dx = lure.x - mouth.x, dy = lure.y - mouth.y;
  const dist = Math.hypot(dx,dy)||1;
  const ang = Math.atan2(dy,dx);
  const fan = lerp(0.60, 0.34, sing);              // narrower fan when more intense
  const rings = 6;
  for(let i=1;i<=rings;i++){
    const t = i/rings;
    const r = dist*t;
    const a = ang, half = fan*(1-0.45*t);          // fan tightens outward
    g.strokeStyle = INK;
    g.globalAlpha = clamp01((0.62 - t*0.34) * (0.5+0.5*sing));
    g.lineWidth = Math.max(1.8, W*0.009*(1-t*0.45));
    g.beginPath(); g.arc(mouth.x, mouth.y, r, a-half, a+half); g.stroke();
  }
  g.globalAlpha=1;
  // a bright ACCENT lure-beam: mouth -> lure-point, the irresistible line
  if (sing>0.35){
    g.strokeStyle=ACCENT; g.globalAlpha=0.85*sing; g.lineWidth=Math.max(2.4,W*0.009);
    g.beginPath(); g.moveTo(mouth.x, mouth.y);
    g.quadraticCurveTo(lerp(mouth.x,lure.x,0.5), lerp(mouth.y,lure.y,0.5)-W*0.03, lure.x, lure.y);
    g.stroke(); g.globalAlpha=1;
  }
}

/* ============================================================
   STAGE — sea + shore rocks + the perched sirens + the projected song
   converging on the lure-point (the ship's course), beyond the rocks.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const horizon = H*0.38;

  // ---- sky + sea backdrop ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  if (B.showSea){
    g.fillStyle = inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 3);   // waterline
    // a few faint swell lines on the water
    g.strokeStyle=INK; g.globalAlpha=0.28; g.lineWidth=Math.max(1.4,W*0.004);
    for(let i=0;i<4;i++){ const y=horizon+(i+1)*H*0.045; g.beginPath();
      for(let x=0;x<=W;x+=W*0.06){ const yy=y+Math.sin(x*0.03+i)*H*0.006;
        if(x===0) g.moveTo(x,yy); else g.lineTo(x,yy); } g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- shore rocks: a low dark ridge the sirens perch on ----
  drawRocks(pen, g, W, H, B);

  // ---- the lure-point marker (ship's course, BEYOND the rocks) ----
  if (B.sing>0.2){
    g.fillStyle=ACCENT; g.beginPath(); g.arc(B.lure.x, B.lure.y, Math.max(3,W*0.010), 0,7); g.fill();
    g.strokeStyle=ACCENT; g.globalAlpha=0.4; g.lineWidth=Math.max(1.4,W*0.004);
    g.beginPath(); g.arc(B.lure.x, B.lure.y, W*0.03, 0,7); g.stroke(); g.globalAlpha=1;
  }

  // ---- the sirens, back -> front, each projecting its song ----
  for (const r of B.recs){
    const out = drawSiren(pen, g, r.cx, r.perchY, r.s, r.look);
    projectSong(g, out.mouth, B.lure, B.sing, W);
  }

  // ---- range boundary: a faint arc past which the still bodies never go ----
  if (B.showRange){
    const rx = W*0.5, ry = H*0.55;
    g.setLineDash([W*0.014, W*0.012]);
    g.strokeStyle=INK; g.globalAlpha=0.30; g.lineWidth=Math.max(1.4,W*0.004);
    g.beginPath(); g.ellipse(rx, ry, W*0.44, H*0.20, 0, Math.PI*1.05, Math.PI*1.95); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
  }
}

/* a clustered shore-rock ridge across the lower stage */
function drawRocks(pen, g, W, H, B){
  const baseY = H*0.62;
  // the big rock mass
  pen.paint(()=>{
    g.moveTo(0, H);
    g.lineTo(0, baseY+H*0.05);
    g.lineTo(W*0.10, baseY);
    g.lineTo(W*0.24, baseY+H*0.03);
    g.lineTo(W*0.40, baseY-H*0.02);
    g.lineTo(W*0.58, baseY+H*0.02);
    g.lineTo(W*0.74, baseY-H*0.01);
    g.lineTo(W*0.90, baseY+H*0.04);
    g.lineTo(W, baseY+H*0.02);
    g.lineTo(W, H);
    g.closePath();
  }, toneSolid(inkLevel(2)), 5);
  // faceted rock shading blocks
  g.fillStyle=inkLevel(4);
  const facets=[[0.08,0.72,0.16,0.16],[0.30,0.70,0.14,0.20],[0.52,0.73,0.16,0.16],[0.78,0.71,0.16,0.20]];
  for(const [fx,fy,fw,fh] of facets){ g.beginPath();
    g.moveTo(W*fx, H*fy); g.lineTo(W*(fx+fw*0.5), H*(fy-0.02));
    g.lineTo(W*(fx+fw), H*fy); g.lineTo(W*(fx+fw), H*(fy+fh));
    g.lineTo(W*fx, H*(fy+fh)); g.closePath(); g.fill(); }
  // crack seams
  g.strokeStyle=INK; g.globalAlpha=0.45; g.lineWidth=Math.max(1.4,W*0.004);
  for(const [fx,fy,fw,fh] of facets){ g.beginPath();
    g.moveTo(W*(fx+fw*0.5), H*(fy-0.02)); g.lineTo(W*(fx+fw*0.5), H*(fy+fh)); g.stroke(); }
  g.globalAlpha=1;
}

export const asset = {
  id:"ensemble.the-sirens",
  type:"ENSEMBLE",
  name:"The Sirens",
  statusWord:"LURING",
  scene:"OD-B12-S03",

  params,
  // one member template + variants, instanced along the perched row across depth
  member:{ template:"drawSiren", roster:MEMBERS,
           variants:["winged","lyre"], wings:["high","open","low"] },
  // back -> front draw order the stage honors
  layers:["sky","sea","rocks","lure","sirens-back","song","sirens-front","range"],
  // normalized placement / focus anchors (NOT baked characters)
  anchors:{
    "perch:far":{x:.16,y:.60},   "perch:mid":{x:.38,y:.68},   "perch:near":{x:.60,y:.76},
    "mouth:far":{x:.20,y:.44},   "mouth:mid":{x:.42,y:.52},   "mouth:near":{x:.56,y:.58},
    "lure:course":{x:.90,y:.40}, "waterline":{x:.50,y:.38},
    "approach:sea":{x:.94,y:.50}, "camera:wide":{x:.48,y:.50},
  },
  // the rocks the sirens hold; the water no ship should enter
  zones:{ rocks:{ x0:.0,y0:.60,x1:1.0,y1:1.0 }, water:{ x0:.0,y0:.38,x1:1.0,y1:.60 } },
  channels:["formation","songIntensity","lure","density","spread"],
  states:{
    initial:"luring",
    nodes:{
      // S03: plural singers, still bodies, full irresistible song reaching the course
      "luring":  { preview:{ formation:"perched-row", count:3, songIntensity:1, status:"LURING" } },
      // two singers only (paired), song still projecting
      "paired":  { preview:{ formation:"perched-row", count:2, songIntensity:1, status:"PAIRED" } },
      // wings half-open, mid-song
      "rising":  { preview:{ formation:"perched-row", count:3, songIntensity:0.8, status:"RISING" } },
      // one holds a lyre in place of a raised wing
      "lyric":   { preview:{ formation:"perched-row", count:3, songIntensity:1, withLyre:true, status:"LYRIC" } },
      // song ceased — bodies still on the rocks, mouths closed, no pursuit
      "silent":  { preview:{ formation:"perched-row", count:3, songIntensity:0, showRange:true, status:"STILL" } },
      // tight cluster on a single crag
      "cluster": { preview:{ formation:"cluster", count:3, songIntensity:1, status:"MASSED" } },
    },
    edges:[
      ["luring","paired"],["luring","rising"],["luring","lyric"],["luring","silent"],
      ["luring","cluster"],["rising","luring"],["silent","luring"],
      ["paired","luring"],["lyric","luring"],["cluster","luring"],
    ],
  },

  // neutral preview = the trio mid-song, projecting on the ship's course
  preview:()=>({ formation:"perched-row", count:3, songIntensity:1,
                 lure:{ x:0.90, y:0.40 }, density:1, spread:1,
                 status:"LURING", progress:0.3 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
