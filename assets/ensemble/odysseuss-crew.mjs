/* ensemble.odysseuss-crew — Odysseus's crew at the rowing benches.
   ENSEMBLE asset. A galley bank of rowers built from ONE separable member
   template (drawRower: a seated oarsman hauling a single oar over the side).
   The template is instanced along a ROWING-BANK formation — a near bench of
   large rowers plus a smaller far bench for depth — and driven by three
   channels: EFFORT (how hard they haul on the drive), FEAR (the collective
   dread of the reversing sea) and DUCK (how many bow their heads below the
   crest). A reaction-wave sweeps those states down the bank from the sea/prow
   side. Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify POST pass supplies the halftone. No named character is baked in — the
   wave is a diagrammatic curling crest with a blue REVERSAL arrow driving the
   hull back.
   Atlas OD-B09-S11 — rowing, pleading, ducking, and struggling against a wave
   that reverses the ship. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };
const norm    = v => { const m=Math.hypot(v.x,v.y)||1; return { x:v.x/m, y:v.y/m }; };

const params = {
  formation:"rowing-bank",  // rowing-bank | huddle
  nearCount:5,              // rowers on the near bench (large, foreground)
  farCount:4,               // rowers on the far bench (small, behind the gunwale)
  effort:0.85,              // haul intensity on the drive (0 slack .. 1 straining)
  fear:0.7,                 // collective dread of the sea (0 calm .. 1 wide-eyed)
  duck:0.55,                // how many bow their heads below the crest (0..1)
  wave:0.8,                 // reversal-crest position sweeping the bank (0 far .. 1 over the prow)
  waveLag:0.6,              // per-member LAG spread of the reaction front
  oarSide:1,                // sea/prow side the oars reach (+1 right, -1 left)
  showWave:true,            // the curling reversal crest + blue arrow
  showHull:true,            // the galley hull + gunwale rail
  waterY:0.64,              // waterline as fraction of H
};

/* gunwale sheer: the seat/pivot line along the hull as a function of the
   normalized station t (0 stern .. 1 prow). Dips amidships, rises at the ends,
   the prow (sea side) lifted highest. Returns a y-fraction of H. */
function sheer(t){ return 0.475 + Math.sin(clamp01(t)*Math.PI)*0.050 - (clamp01(t)-0.5)*0.11; }

/* two-segment arm shoulder->elbow->wrist toward a target; elbow bows outward. */
function armTo(pen, sh, wr, tone, w, bow){
  const mx=(sh.x+wr.x)/2, my=(sh.y+wr.y)/2;
  const el={ x:mx + (bow||0), y:my + Math.abs(wr.x-sh.x)*0.06 + w*0.4 };
  pen.limb(()=>{ pen.ctx.moveTo(sh.x,sh.y); pen.ctx.lineTo(el.x,el.y); }, tone, w);
  pen.limb(()=>{ pen.ctx.moveTo(el.x,el.y); pen.ctx.lineTo(wr.x,wr.y); }, tone, w*0.86);
  return { el, wr };
}

/* ============================================================
   ONE member template — a rower at his bench, in profile, facing the sea.
   m: { cx, gun(px seat/pivot y), s(height), face(+1 sea side), role, eff,
        duckA, pleadA, fear, sh{tunic,skin,hair}, feat }
   Roles: "haul" (drive, leaning back on the oar), "plead" (an arm flung to the
   gods), "duck" (curled down, head bowed under the crest).
   ============================================================ */
function drawRower(pen, m){
  const g = pen.ctx, s = m.s, F = m.face;
  const tunic = toneSolid(inkLevel(m.sh.tunic));
  const skin  = toneSolid(inkLevel(m.sh.skin));
  const hair  = toneSolid(inkLevel(m.sh.hair));
  const oarT  = toneSolid(inkLevel(4));
  const lw    = Math.max(2, s*0.03);

  // waist sits just below the gunwale so the foreground rail can cover the hips
  const waist = { x:m.cx, y:m.gun + s*0.05 };
  const hipHalf = s*0.14, shoHalf = s*0.165;
  let torsoLen = s*0.42;

  // lean angle of the torso (radians from vertical, + = toward the sea/forward)
  let a, headTuck=0, kTorso=1;
  if (m.role==="duck"){ a = F*(0.45+0.35*m.duckA); kTorso = 0.82; headTuck = 1; }
  else if (m.role==="plead"){ a = -F*(0.06+0.10*m.pleadA); }
  else { a = -F*(0.22+0.42*m.eff); }   // haul: lean back away from the sea

  const sho = {
    x: waist.x + Math.sin(a)*torsoLen,
    y: waist.y - Math.cos(a)*torsoLen*kTorso,
  };
  const headR = s*0.125*m.feat.headS;
  // head: bowed and forward for duck, lifted for plead/haul
  const head = headTuck
    ? { x: sho.x + F*headR*0.75, y: sho.y + headR*0.30 }
    : { x: sho.x + Math.sin(a)*headR*0.5 + F*headR*0.12, y: sho.y - headR*0.95 };

  // shoulder joints across the torso top
  const shN = { x: sho.x + F*shoHalf*0.85, y: sho.y + s*0.01 };  // near (sea-side) shoulder
  const shF = { x: sho.x - F*shoHalf*0.85, y: sho.y + s*0.01 };  // far shoulder
  const armW = Math.max(3, s*0.058);

  // ---- OAR : handle (inboard, at the hands) -> pivot on the gunwale -> blade ----
  let handle;
  if (m.role==="haul")  handle = { x: sho.x + F*s*0.10, y: sho.y + s*0.17 };  // drawn to the lap
  else if (m.role==="plead") handle = { x: waist.x + F*s*0.06, y: waist.y - s*0.02 };
  else /* duck */       handle = { x: sho.x + F*s*0.12, y: sho.y + s*0.14 };
  const pivot = { x: m.cx + F*s*0.30, y: m.gun + s*0.03 };
  // the loom runs from the hands to the tholepin; the blade fans OUTBOARD over
  // the sea and dips to the water — not straight down through the hull.
  const bdir  = norm({ x:F*1.0, y:0.62 });
  const blade = { x: pivot.x + bdir.x*s*0.78, y: pivot.y + bdir.y*s*0.78 };
  const bn    = { x:-bdir.y, y:bdir.x };

  // oar loom (hands -> tholepin) then blade shaft (tholepin -> water), behind body
  pen.limb(()=>{ g.moveTo(handle.x,handle.y); g.lineTo(pivot.x,pivot.y); }, oarT, Math.max(3,s*0.05));
  pen.limb(()=>{ g.moveTo(pivot.x,pivot.y); g.lineTo(blade.x,blade.y); }, oarT, Math.max(3,s*0.055));
  // blade — a flat paddle at the outboard tip
  pen.paint(()=>{
    g.moveTo(blade.x - bdir.x*s*0.04 + bn.x*s*0.055, blade.y - bdir.y*s*0.04 + bn.y*s*0.055);
    g.lineTo(blade.x + bdir.x*s*0.16 + bn.x*s*0.075, blade.y + bdir.y*s*0.16 + bn.y*s*0.075);
    g.lineTo(blade.x + bdir.x*s*0.16 - bn.x*s*0.075, blade.y + bdir.y*s*0.16 - bn.y*s*0.075);
    g.lineTo(blade.x - bdir.x*s*0.04 - bn.x*s*0.055, blade.y - bdir.y*s*0.04 - bn.y*s*0.055);
    g.closePath();
  }, toneSolid(inkLevel(6)), lw*0.8);

  // ---- FAR arm first (behind the torso) ----
  if (m.role==="plead"){
    // far arm flung up to the sky (the plea)
    const up = { x: shF.x - F*headR*1.2, y: shF.y - torsoLen*0.95 - m.pleadA*headR*1.2 };
    armTo(pen, shF, up, skin, armW*0.9, -F*s*0.05);
    pen.paint(()=>{ g.arc(up.x, up.y, headR*0.26, 0,7); }, skin, lw*0.7);   // hand
  } else {
    armTo(pen, shF, handle, m.role==="duck"?tunic:skin, armW*0.9, F*s*0.03);
  }

  // ---- TORSO : rower's tunic, sheared by the lean ----
  pen.paint(()=>{
    g.moveTo(waist.x - hipHalf, waist.y);
    g.lineTo(waist.x + hipHalf, waist.y);
    g.lineTo(sho.x + shoHalf,  sho.y);
    g.lineTo(sho.x - shoHalf,  sho.y);
    g.closePath();
  }, tunic, lw);
  // a diagonal strain seam across the back
  pen.seam(()=>{ g.moveTo(sho.x - F*shoHalf*0.5, sho.y+s*0.02); g.lineTo(waist.x + F*hipHalf*0.5, waist.y); }, Math.max(2,s*0.016));

  // ---- neck ----
  pen.paint(()=>{ g.rect(head.x-headR*0.28, sho.y-headR*0.5, headR*0.56, headR*0.8); }, skin, Math.max(2,s*0.018));

  // ---- HEAD ----
  const bald = m.feat.hair==="bald";
  if (!bald) pen.paint(()=>{ g.ellipse(head.x, head.y+headR*0.10, headR*1.12, headR*1.18, 0,0,7); }, hair, Math.max(2,s*0.024));
  pen.paint(()=>{ g.ellipse(head.x, head.y, headR*0.94, headR, 0,0,7); }, skin, Math.max(2,s*0.026));

  // ---- FACE ----
  if (m.role==="duck"){
    // head bowed — we mostly see the crown/back; a hint of a clenched brow
    if (!bald) pen.paint(()=>{ g.ellipse(head.x - F*headR*0.1, head.y - headR*0.25, headR*0.95, headR*0.7, 0, Math.PI*0.9, Math.PI*2.1); }, hair, Math.max(2,s*0.02));
    g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.14); g.lineCap="round";
    g.beginPath(); g.moveTo(head.x+F*headR*0.2, head.y+headR*0.45); g.lineTo(head.x+F*headR*0.55, head.y+headR*0.5); g.stroke();
  } else {
    const prof = 0.55;                      // three-quarter-to-profile: bias the eye toward the sea
    const eyeY = head.y - headR*0.04;
    const eN = head.x + F*headR*0.34, eF = head.x - F*headR*0.06;
    const eyeR = headR*(0.12 + 0.06*m.fear);   // fear widens the eyes
    g.fillStyle="#fff"; g.beginPath(); g.ellipse(eN, eyeY, eyeR*1.15, eyeR*1.2, 0,0,7); g.fill();
    g.fillStyle=INK;    g.beginPath(); g.ellipse(eN, eyeY, eyeR*0.6, eyeR*0.7, 0,0,7); g.fill();
    // brow shot up with alarm / knotted with effort
    g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.15); g.lineCap="round";
    const browY = eyeY - headR*0.34 - m.fear*headR*0.12;
    g.beginPath(); g.moveTo(eN - F*headR*0.28, browY + headR*0.12); g.lineTo(eN + F*headR*0.24, browY - headR*0.04); g.stroke();
    // nose (profile bias toward the sea)
    g.lineWidth=Math.max(2,headR*0.12);
    g.beginPath(); g.moveTo(head.x + F*headR*0.55, eyeY+headR*0.1); g.lineTo(head.x + F*headR*0.7, eyeY+headR*0.42); g.stroke();
    // mouth — open cry when pleading/fearful, gritted line when hauling
    if (m.role==="plead" || m.fear>0.55){
      g.fillStyle=INK; g.beginPath(); g.ellipse(head.x + F*headR*0.28, head.y+headR*0.5, headR*0.14, headR*(0.12+0.14*m.fear), 0,0,7); g.fill();
    } else {
      g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.11);
      g.beginPath(); g.moveTo(head.x + F*headR*0.08, head.y+headR*0.5); g.lineTo(head.x + F*headR*0.5, head.y+headR*0.5); g.stroke();
    }
    // beard
    if (m.feat.beard) pen.paint(()=>{
      g.moveTo(head.x - F*headR*0.1, head.y+headR*0.3);
      g.quadraticCurveTo(head.x + F*headR*0.5, head.y+headR*1.3, head.x + F*headR*0.7, head.y+headR*0.3);
      g.quadraticCurveTo(head.x + F*headR*0.4, head.y+headR*0.6, head.x - F*headR*0.1, head.y+headR*0.3);
    }, hair, Math.max(2,s*0.016));
    // hair front cap
    if (!bald) pen.paint(()=>{
      g.moveTo(head.x-headR*0.9, head.y-headR*0.02);
      g.quadraticCurveTo(head.x, head.y-headR*1.3, head.x+headR*0.9, head.y-headR*0.02);
      g.quadraticCurveTo(head.x+headR*0.45, head.y-headR*0.5, head.x, head.y-headR*0.42);
      g.quadraticCurveTo(head.x-headR*0.45, head.y-headR*0.5, head.x-headR*0.9, head.y-headR*0.02);
    }, hair, Math.max(2,s*0.018));
  }

  // ---- NEAR arm on top, gripping the handle ----
  armTo(pen, shN, handle, m.role==="duck"?tunic:skin, armW, F*s*0.04);
  // both fists knuckled onto the oar handle
  pen.paint(()=>{ g.arc(handle.x, handle.y, headR*0.24, 0,7); }, skin, lw*0.7);

  return { head, headR, blade, role:m.role, act:m.act };
}

/* ============================================================
   THE REVERSING WAVE — a curling crest rearing over the prow, driving the
   hull back. A diagram, not a painting: nested contour crests + a foam lip +
   a blue REVERSAL arrow. `wave` slides the crest along the bank.
   ============================================================ */
function drawWave(pen, W, H, waterY, wave, fear){
  const g = pen.ctx;
  const cx = lerp(W*0.52, W*0.92, wave);       // crest marches toward the prow
  const crestY = H*0.12, baseY = waterY*H;
  const rw = W*0.40;

  // wave body (mid tone) — a rearing swell that curls left, back over the ship
  pen.paint(()=>{
    g.moveTo(cx+rw*1.1, baseY);
    g.quadraticCurveTo(cx+rw*1.15, crestY+ (baseY-crestY)*0.35, cx+rw*0.5, crestY);   // outer face rising
    g.quadraticCurveTo(cx+rw*0.05, crestY-H*0.03, cx-rw*0.30, crestY+H*0.05);          // the crest lip
    g.quadraticCurveTo(cx-rw*0.05, crestY+H*0.10, cx-rw*0.05, crestY+H*0.16);          // curl hook
    g.quadraticCurveTo(cx-rw*0.35, crestY+H*0.10, cx-rw*0.55, baseY);                  // inner face falling
    g.closePath();
  }, toneSolid(inkLevel(3)), 5);

  // nested inner crest contours (darker, toward the curl)
  for (let k=1;k<=3;k++){
    const t=k/4;
    pen.ink(()=>{
      g.moveTo(cx+rw*(0.9-t*0.5), lerp(baseY,crestY,0.2+t*0.2));
      g.quadraticCurveTo(cx+rw*0.1, crestY+H*0.02*k, cx-rw*(0.15+t*0.1), crestY+H*(0.06+0.03*k));
    }, Math.max(2, W*0.005*(1-t)));
  }

  // white foam lip along the breaking crest
  g.strokeStyle="#ffffff"; g.lineWidth=Math.max(3,W*0.009); g.lineCap="round";
  g.beginPath();
  g.moveTo(cx+rw*0.5, crestY);
  g.quadraticCurveTo(cx+rw*0.05, crestY-H*0.03, cx-rw*0.30, crestY+H*0.05);
  g.quadraticCurveTo(cx-rw*0.05, crestY+H*0.10, cx-rw*0.05, crestY+H*0.16);
  g.stroke();
  // scatter of foam flecks off the crest
  g.fillStyle="#ffffff";
  const R=rnd(7);
  for (let i=0;i<14;i++){ const fx=cx - rw*0.3 + (R()-0.3)*rw*0.7, fy=crestY - H*0.02 + R()*H*0.12;
    g.beginPath(); g.arc(fx, fy, Math.max(2,W*0.006*R()), 0,7); g.fill(); }

  // the blue REVERSAL arrow — the crest's force curving BACK over the hull
  g.strokeStyle=ACCENT; g.lineWidth=Math.max(4,W*0.012); g.lineCap="round"; g.lineJoin="round";
  g.beginPath();
  g.moveTo(cx-rw*0.02, crestY+H*0.14);
  g.quadraticCurveTo(cx-rw*0.6, crestY+H*0.02, cx-rw*1.05, crestY+H*0.16);
  g.stroke();
  const ax=cx-rw*1.05, ay=crestY+H*0.16;           // arrowhead pointing back toward the stern
  g.beginPath(); g.moveTo(ax,ay); g.lineTo(ax+W*0.03, ay-H*0.018);
  g.moveTo(ax,ay); g.lineTo(ax+W*0.026, ay+H*0.022); g.stroke();
}

/* the sea plane the oars dip into (light, so the hull + crew read against it) */
function drawSea(pen, W, H, waterY){
  const g = pen.ctx;
  const wy = waterY*H;
  g.fillStyle = inkLevel(2); g.fillRect(0, wy, W, H-wy);
  // faint swell rules
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.16;
  for (let k=0;k<=4;k++){ const y=wy + (H-wy)*(k/5)+ (H-wy)*0.05;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.05) (x===0?g.moveTo:g.lineTo).call(g, x, y + Math.sin(x/W*10 + k)*H*0.006);
    g.stroke();
  }
  g.globalAlpha=1;
}

/* the galley hull (drawn behind the crew) + a foreground gunwale rail with
   shield discs (drawn over the crew's hips so they read as sitting in it) */
function hullTop(W, x){ return H_sheer(W, x); }
let H_ref=880;
function H_sheer(W,x){ return sheer(x/W)*H_ref; }

function drawHullBack(pen, W, H){
  const g = pen.ctx;
  H_ref = H;
  const x0=W*0.05, x1=W*0.99, bottom=H*0.80;
  // hull body — a plank band, not a full slab (mid tone so it doesn't blob)
  pen.paint(()=>{
    g.moveTo(x0, sheer(x0/W)*H);
    for (let x=x0; x<=x1; x+=W*0.02) g.lineTo(x, sheer(x/W)*H);
    g.lineTo(x1, sheer(x1/W)*H);
    // curved waterline underside (bow deeper amidships)
    for (let x=x1; x>=x0; x-=W*0.02) g.lineTo(x, bottom - Math.sin(x/W*Math.PI)*H*0.02);
    g.closePath();
  }, toneSolid(inkLevel(4)), 5);
  // horizontal plank seams break the band up
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
  for (let k=1;k<=3;k++){
    g.beginPath();
    for (let x=x0; x<=x1; x+=W*0.03){ const y=lerp(sheer(x/W)*H, bottom, k/4); (x===x0?g.moveTo:g.lineTo).call(g,x,y); }
    g.stroke();
  }
  g.globalAlpha=1;
  // dark waterline strake
  pen.paint(()=>{
    for (let x=x0; x<=x1; x+=W*0.02) (x===x0?g.moveTo:g.lineTo).call(g, x, bottom - Math.sin(x/W*Math.PI)*H*0.02);
    for (let x=x1; x>=x0; x-=W*0.02) g.lineTo(x, bottom - Math.sin(x/W*Math.PI)*H*0.02 + H*0.028);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  // prow rising into the wave (right end sweeps up)
  pen.paint(()=>{
    const px=x1, py=sheer(1)*H;
    g.moveTo(px-W*0.03, py+H*0.02);
    g.quadraticCurveTo(px+W*0.04, py-H*0.12, px+W*0.005, py-H*0.19);
    g.quadraticCurveTo(px-W*0.02, py-H*0.08, px-W*0.08, py+H*0.02);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
}

function drawGunwaleRail(pen, W, H){
  const g = pen.ctx;
  const x0=W*0.06, x1=W*0.96;
  // the rail band riding the sheer line, over the rowers' hips
  pen.paint(()=>{
    g.moveTo(x0, sheer(x0/W)*H + H*0.02);
    for (let x=x0; x<=x1; x+=W*0.02) g.lineTo(x, sheer(x/W)*H + H*0.02);
    for (let x=x1; x>=x0; x-=W*0.02) g.lineTo(x, sheer(x/W)*H + H*0.075);
    g.closePath();
  }, toneSolid(inkLevel(4)), 4);
  // shield discs hung along the rail
  const n=9;
  for (let i=0;i<n;i++){
    const t=(i+0.5)/n, x=lerp(x0+W*0.02, x1-W*0.02, t), y=sheer(x/W)*H + H*0.047;
    pen.paint(()=>{ g.arc(x, y, W*0.026, 0,7); }, toneSolid(inkLevel(i%2?5:3)), 3);
    pen.seam(()=>{ g.arc(x, y, W*0.026*0.5, 0,7); }, 2);
  }
}

/* ============================================================
   build the bank : two benches of the member template, driven by the wave. */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const F = p.oarSide>=0 ? 1 : -1;
  const effort = clamp01(p.effort), fear=clamp01(p.fear), duck=clamp01(p.duck);
  const wave = clamp01(p.wave), lag = clamp01(p.waveLag);
  const spread = 0.15 + lag*0.9;

  const members = [];
  // far bench (small, behind), near bench (large, front)
  const benchDefs = [
    { count: Math.max(0,p.farCount|0),  depth:0.0, s:158, dy:-0.055, x0:0.24, x1:0.80, lvl:{tunic:4,skin:3,hair:6} },
    { count: Math.max(1,p.nearCount|0), depth:1.0, s:250, dy: 0.010, x0:0.16, x1:0.86, lvl:{tunic:3,skin:2,hair:5} },
  ];

  for (const B of benchDefs){
    const n=B.count; if (!n) continue;
    for (let i=0;i<n;i++){
      const t = n>1 ? i/(n-1) : 0.5;
      // sea/prow side is +F; the reversal reaches the prow-side rowers first.
      // px along the bank in "toward-the-sea" terms (1 = nearest the crest)
      const seaT = F>0 ? t : 1-t;
      const xFrac = lerp(B.x0, B.x1, t);
      const rng = rnd((B.depth>0?701:307) + i*137 + 11);
      const feat = { beard: rng()<0.55, hair: rng()<0.14?"bald":"full", headS:0.92+rng()*0.2 };

      // reaction-wave activation — dread reaches the sea-side benches first
      const a = clamp01(wave*(1+spread) - (1-seaT)*spread);
      // role: sea-most tend to duck, next plead, inland keep hauling
      const roll = rng();
      let role;
      if (a > 0.6 && roll < 0.5 + duck*0.4) role="duck";
      else if (a > 0.35 && roll < 0.4 + fear*0.4) role="plead";
      else role="haul";

      const gun = sheer(xFrac)*H + B.dy*H;
      members.push({
        cx: xFrac*W, gun, s:B.s, depth:B.depth, seaT, face:F,
        role, eff: effort*(0.5+0.5*(1-a)), duckA: duck*smooth(a), pleadA: (0.4+0.6*fear)*smooth(a),
        fear: fear*smooth(0.4+a*0.6), act:a, feat,
        sh:{ tunic:B.lvl.tunic + (i%2?1:0), skin:B.lvl.skin, hair:B.lvl.hair },
      });
    }
  }
  members.sort((a,b)=> a.depth-b.depth || a.cx-b.cx);
  return { members, wave, fear, waterY:p.waterY, showWave:p.showWave, showHull:p.showHull };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const B = buildMembers(W, H, st);

  drawSea(pen, W, H, B.waterY);
  if (B.showWave) drawWave(pen, W, H, B.waterY, B.wave, B.fear);
  if (B.showHull) drawHullBack(pen, W, H);

  // far bench first, then near bench (painter's order handled by the sort)
  const far  = B.members.filter(m=>m.depth<0.5);
  const near = B.members.filter(m=>m.depth>=0.5);
  far.forEach(m=>drawRower(pen, m));
  if (B.showHull) drawGunwaleRail(pen, W, H);   // rail sits between the two benches
  near.forEach(m=>drawRower(pen, m));

  // the reversal-wave FRONT marker sweeping the bank (matches the crew reaction)
  const g=ctx;
  const wx = lerp(W*0.20, W*0.90, B.wave);
  g.strokeStyle=ACCENT; g.globalAlpha=0.22; g.lineWidth=Math.max(2,W*0.006);
  g.setLineDash([W*0.012, W*0.02]);
  g.beginPath(); g.moveTo(wx, H*0.30); g.lineTo(wx, H*0.60); g.stroke();
  g.setLineDash([]); g.globalAlpha=1;
}

export const asset = {
  id:"ensemble.odysseuss-crew",
  type:"ENSEMBLE",
  name:"Odysseus's crew",
  statusWord:"STRAINING",
  scene:"OD-B09-S11",

  params,
  // ONE rower member template, instanced across two benches (near/far)
  member:{ template:"rower", roles:["haul","plead","duck"], formations:["rowing-bank","huddle"] },
  // back -> front draw order
  layers:["sea","wave","hull","far-bench","gunwale-rail","near-bench","wave-front"],
  // normalized 0..1 placement / camera / rig anchors (NOT baked characters)
  anchors:{
    "bench:near":{x:.50,y:.62}, "bench:far":{x:.50,y:.56},
    "prow:sea":{x:.90,y:.52}, "stern":{x:.10,y:.62},
    "wave:crest":{x:.80,y:.20}, "wave:reversal":{x:.55,y:.30},
    "oar:pivot":{x:.68,y:.60}, "waterline":{x:.50,y:.74},
    "camera:wide":{x:.50,y:.50}, "camera:bank":{x:.55,y:.56},
  },
  zones:{ deck:{ x0:.10,y0:.50,x1:.90,y1:.68 }, sea:{ x0:.00,y0:.74,x1:1.0,y1:1.0 } },
  states:{
    initial:"straining",
    nodes:{
      // the whole bank hauling hard on the drive
      rowing:   { preview:{ effort:0.9, fear:0.35, duck:0.1, wave:0.35, waveLag:0.5, status:"ROWING" } },
      // reversal cresting: sea-side rowers duck/plead, inland still haul
      straining:{ preview:{ effort:0.85, fear:0.7, duck:0.55, wave:0.8, waveLag:0.6, status:"STRAINING" } },
      // hands flung to the gods as the crest breaks over the prow
      pleading: { preview:{ effort:0.55, fear:0.95, duck:0.35, wave:1.0, waveLag:0.3, status:"PLEADING" } },
      // heads down, crew bowed under the reversing wave
      ducking:  { preview:{ effort:0.5, fear:0.85, duck:0.9, wave:1.0, waveLag:0.4, status:"DUCKING" } },
    },
    edges:[
      ["rowing","straining"],["straining","pleading"],["straining","ducking"],
      ["pleading","straining"],["ducking","straining"],
    ],
  },
  channels:["effort","fear","duck","wave","waveLag","formation"],

  // neutral preview = the reversal tableau: hauling, some pleading, some ducking
  preview:()=>({ effort:0.85, fear:0.7, duck:0.55, wave:0.8, waveLag:0.6, formation:"rowing-bank",
                 status:"STRAINING", progress:0.5 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
