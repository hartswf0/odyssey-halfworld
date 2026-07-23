/* ensemble.laestrygonian-giants — the cannibal giant population of Telepylos.
   ENSEMBLE asset. Scene function (OD-B10-S02): when Odysseus' ships crowd into
   the narrow rock-walled harbour, the citywide population of huge Laestrygonian
   giants swarms the CLIFF LEDGES above and, converging inward, HURLS boulders
   down onto the packed boats, SPEARS the swimming sailors "like fish", and HAULS
   the speared victims up the rock for a horrid meal.

   Built as a repeatable group from ONE separable member template (drawGiant)
   instanced N times deterministically along a CLIFF-LINE arc that CONVERGES on
   the harbour throat. Each giant is HUGE, brutish, TWO-EYED (the read that sets
   them apart from the one-eyed Cyclopes) and performs one of three attack
   actions — hurl | spear | haul — aimed at the water below. Exposes: formation
   (cliff-line | converge), converge (0 = strung loose along the rim .. 1 = the
   whole population leaning in over the throat), ferocity (attack intensity /
   lean / boulders in the air), density, and reaction. Drawn in SOLID grays +
   hard contour; the engine dotify pass supplies the halftone. The Achaean crews
   are NOT baked in as reusable characters — only the harbour they are trapped
   in, a few tiny hulls, and the speared victim-tokens the attack produces. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"converge",   // cliff-line | converge
  converge:0.85,          // 0 = strung loose along the rim .. 1 = massed, leaning over the throat
  ferocity:0.8,           // 0 = poised / few in the air .. 1 = full assault, boulders raining
  count:6,                // number of giant silhouettes lining the rim
  density:1.0,            // scales boulders-in-air / victim tokens
  showHarbour:true,       // the narrow rock-walled cove they trap the ships in
  showBoats:true,         // a few tiny crowded hulls on the water
  harbourX:0.50,          // the harbour throat the population converges on (fraction of W)
  harbourY:0.80,
};

/* ============================================================
   ONE member template — a huge Laestrygonian giant.
   Brutish, top-heavy, planted on a rock ledge. Drawn as a stack of solid masses
   in one body tone + hard contour so it reads as a single dark shape. The
   signature is TWO deep-set eyes under one heavy shelf-brow (NOT a Cyclops).
   `action` selects the attack: hurl (boulder raised overhead), spear (long
   harpoon thrust down at the water), haul (a speared victim lifted up the rock).
   `target` is the harbour point every action aims at. `s` = giant height in px.
   ============================================================ */
function drawGiant(pen, m){
  const g = pen.ctx, s = m.s, dir = m.dir;
  const body = toneSolid(inkLevel(m.sh.body));
  const dark = toneSolid(inkLevel(Math.min(7, m.sh.body+1)));
  const skin = toneSolid(inkLevel(Math.max(2, m.sh.body-2)));
  const cw   = Math.max(1.8, s*0.02);

  const footY   = m.baseY;
  const hipY    = footY - s*0.42;
  const shoY    = footY - s*0.74;
  const hipHalf = s*0.19;
  const shoHalf = s*0.30*(0.9 + m.feat.bulk*0.2);   // broad brute shoulders
  const headR   = s*0.16*m.feat.headS;

  const lean   = 0.25 + clamp01(m.ferocity)*0.55;   // hunch/shear toward the throat below
  const shoCx  = m.cx + dir*s*0.09*lean;
  const headCx = shoCx + dir*s*0.05*lean;
  const headCy = shoY - headR*0.95;

  const tx = m.target.x, ty = m.target.y;           // the harbour point below

  // ---- rock LEDGE + shadow under the feet (perch on the cliff rim) ----
  pen.paint(()=>{ g.ellipse(m.cx, footY+s*0.015, s*0.34, s*0.075, 0,0,7); }, toneSolid(inkLevel(4)), cw*0.7);
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(m.cx, footY+s*0.02, s*0.30, s*0.05, 0,0,7); g.fill();

  // ---- LEGS : two thick columns, braced apart on the ledge ----
  const legW = Math.max(3, s*0.12);
  for (const side of [-1,1]){
    const hx = m.cx + side*hipHalf*0.6;
    const fx = m.cx + side*hipHalf*0.85;
    pen.limb(()=>{ g.moveTo(hx, hipY); g.lineTo(fx, footY); }, body, legW);
    pen.paint(()=>{ g.ellipse(fx+dir*s*0.02, footY, s*0.08, s*0.032, 0,0,7); }, dark, cw*0.7);
  }

  // ---- TORSO : a heavy leaning trapezoid boulder of a body ----
  pen.paint(()=>{
    g.moveTo(m.cx-hipHalf, hipY+s*0.02);
    g.lineTo(m.cx+hipHalf, hipY+s*0.02);
    g.lineTo(shoCx+shoHalf, shoY);
    g.quadraticCurveTo(shoCx, shoY-s*0.06, shoCx-shoHalf, shoY);
    g.closePath();
  }, body, cw);
  // a rough loin/skin seam
  pen.seam(()=>{ g.moveTo(m.cx-hipHalf, hipY); g.lineTo(m.cx+hipHalf, hipY); }, cw*0.6);

  // ---- FAR ARM (behind torso, drawn first for depth) ----
  const farShX = shoCx - dir*shoHalf*0.7, farShY = shoY + s*0.05;
  pen.limb(()=>{ g.moveTo(farShX, farShY); g.lineTo(farShX - dir*s*0.05, hipY+s*0.10); },
           toneSolid(inkLevel(Math.max(1, m.sh.body-1))), Math.max(2.5, s*0.085));

  // aim vector from the near shoulder to the harbour
  const nearShX = shoCx + dir*shoHalf*0.82, nearShY = shoY + s*0.04;
  const aim = Math.atan2(ty-nearShY, tx-nearShX);

  // ---- NEAR ARM + the ATTACK it performs ----
  if (m.action === "hurl"){
    // arm raised up-and-back over the head, a great boulder in the fist
    const rAng = -Math.PI*0.60 - dir*0.22;
    const elX = nearShX + Math.cos(rAng)*s*0.30, elY = nearShY + Math.sin(rAng)*s*0.30;
    const haX = elX + Math.cos(rAng)*s*0.26,     haY = elY + Math.sin(rAng)*s*0.26;
    pen.limb(()=>{ g.moveTo(nearShX,nearShY); g.lineTo(elX,elY); }, body, Math.max(3,s*0.10));
    pen.limb(()=>{ g.moveTo(elX,elY); g.lineTo(haX,haY); }, body, Math.max(3,s*0.085));
    const rockR = s*0.19*m.feat.rockR;
    pen.paint(()=>{ g.ellipse(haX, haY-rockR*0.5, rockR, rockR*0.92, 0.3,0,7); }, dark, cw*0.9);
    // a couple of faceted seams so the boulder reads as stone
    pen.seam(()=>{ g.moveTo(haX-rockR*0.5, haY-rockR*0.7); g.lineTo(haX+rockR*0.2, haY-rockR*0.2); }, cw*0.5);
    pen.seam(()=>{ g.moveTo(haX+rockR*0.1, haY-rockR*0.95); g.lineTo(haX+rockR*0.45, haY-rockR*0.35); }, cw*0.5);
  } else if (m.action === "spear"){
    // both hands couch a long harpoon thrust steeply DOWN at the swimming men
    const gripX = nearShX + Math.cos(aim)*s*0.34, gripY = nearShY + Math.sin(aim)*s*0.34;
    pen.limb(()=>{ g.moveTo(nearShX,nearShY); g.lineTo(gripX,gripY); }, body, Math.max(3,s*0.095));
    const spLen = s*0.82;
    const tipX = gripX + Math.cos(aim)*spLen, tipY = gripY + Math.sin(aim)*spLen;
    pen.limb(()=>{ g.moveTo(gripX,gripY); g.lineTo(tipX,tipY); }, toneSolid(inkLevel(6)), Math.max(2,s*0.03));
    // barbed leaf head at the tip
    pen.paint(()=>{ g.ellipse(tipX, tipY, s*0.03, s*0.085, aim+Math.PI/2, 0,7); }, toneSolid(inkLevel(7)), cw*0.6);
  } else { // haul
    // arm angled down gripping a haul-line/spear with a limp speared victim lifted up
    const hAng = aim - dir*0.15;
    const gripX = nearShX + Math.cos(hAng)*s*0.30, gripY = nearShY + Math.sin(hAng)*s*0.30;
    pen.limb(()=>{ g.moveTo(nearShX,nearShY); g.lineTo(gripX,gripY); }, body, Math.max(3,s*0.09));
    const lineLen = s*0.62;
    const endX = gripX + Math.cos(hAng)*lineLen, endY = gripY + Math.sin(hAng)*lineLen;
    pen.ink(()=>{ g.moveTo(gripX,gripY); g.lineTo(endX,endY); }, cw*0.7);
    drawVictim(pen, endX, endY, s*0.16, hAng);   // a small dangling speared man
  }

  // ---- NECK + HEAD ----
  pen.limb(()=>{ g.moveTo(shoCx+dir*s*0.01, shoY-s*0.01); g.lineTo(headCx, headCy+headR*0.7); }, skin, s*0.10);
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.98, headR, 0,0,7); }, skin, cw*0.8);

  // shaggy mane over the CROWN only (kept high so it never covers the eyes)
  pen.paint(()=>{
    g.moveTo(headCx-headR*1.0, headCy-headR*0.30);
    g.lineTo(headCx-headR*0.5, headCy-headR*1.20);
    g.lineTo(headCx-headR*0.1, headCy-headR*0.72);
    g.lineTo(headCx+headR*0.32, headCy-headR*1.26);
    g.lineTo(headCx+headR*0.62, headCy-headR*0.7);
    g.lineTo(headCx+headR*1.0, headCy-headR*0.30);
    g.quadraticCurveTo(headCx, headCy-headR*0.6, headCx-headR*1.0, headCy-headR*0.30);
    g.closePath();
  }, dark, cw*0.6);

  // ---- THE TWO EYES — the signature (pair, not one). Pale sockets + dark pupils
  //      under one continuous shelf-brow, aimed down at the water by `gaze`. ----
  const eyeR   = headR*0.24;
  const eyeGap = headR*0.44;
  const eyeY   = headCy + headR*0.10;
  for (const es of [-1, 1]){
    const ex = headCx + es*eyeGap + dir*headR*0.04;
    pen.paint(()=>{ g.ellipse(ex, eyeY, eyeR, eyeR*0.9, 0,0,7); }, toneSolid(inkLevel(0)), cw*0.6);
    const px = ex + m.gaze.x*eyeR*0.35, py = eyeY + m.gaze.y*eyeR*0.5;
    g.fillStyle = INK; g.beginPath(); g.arc(px, py, eyeR*0.5, 0,7); g.fill();
  }
  // one heavy shelf-brow across both eyes (the scowl)
  g.strokeStyle=INK; g.lineWidth=Math.max(2.5, headR*0.22); g.lineCap="round";
  g.beginPath();
  g.moveTo(headCx-eyeGap-eyeR*1.2, eyeY-eyeR*1.35);
  g.lineTo(headCx+eyeGap+eyeR*1.2, eyeY-eyeR*1.25);
  g.stroke();
  // a snarling maw
  g.lineWidth=Math.max(2, headR*0.14);
  g.beginPath();
  g.moveTo(headCx-headR*0.4, headCy+headR*0.55);
  g.quadraticCurveTo(headCx, headCy+headR*0.78, headCx+headR*0.42, headCy+headR*0.55);
  g.stroke();
  if (m.feat.beard)
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.62, headCy+headR*0.5);
      g.quadraticCurveTo(headCx, headCy+headR*1.5, headCx+headR*0.62, headCy+headR*0.5);
      g.quadraticCurveTo(headCx, headCy+headR*0.85, headCx-headR*0.62, headCy+headR*0.5);
    }, dark, cw*0.55);

  return { head:{x:headCx,y:headCy}, r:headR };
}

/* a small limp speared victim — a fish-caught sailor. Generic token, NOT a
   reusable character: a slack body with head lolling, a spear line through it. */
function drawVictim(pen, x, y, s, hang){
  const g = pen.ctx;
  const t = toneSolid(inkLevel(4));
  g.save(); g.translate(x,y); g.rotate(hang - Math.PI/2 + 0.2);
  // slack torso
  pen.paint(()=>{ g.ellipse(0, s*0.5, s*0.28, s*0.6, 0,0,7); }, t, Math.max(1.4,s*0.09));
  // lolling head
  pen.paint(()=>{ g.arc(s*0.18, s*1.05, s*0.24, 0,7); }, toneSolid(inkLevel(3)), Math.max(1.4,s*0.09));
  // dangling limbs
  g.strokeStyle=INK; g.lineWidth=Math.max(1.6,s*0.11); g.lineCap="round";
  g.beginPath(); g.moveTo(-s*0.1,s*0.7); g.lineTo(-s*0.5,s*1.3); g.stroke();
  g.beginPath(); g.moveTo(s*0.15,s*0.9); g.lineTo(s*0.5,s*1.5); g.stroke();
  g.restore();
}

/* a small crowded hull crammed into the harbour, an easy target below ------- */
function drawBoat(pen, cx, cy, s, tone){
  const g = pen.ctx;
  pen.paint(()=>{
    g.moveTo(cx-s, cy);
    g.quadraticCurveTo(cx-s*1.05, cy+s*0.5, cx-s*0.55, cy+s*0.55);
    g.lineTo(cx+s*0.55, cy+s*0.55);
    g.quadraticCurveTo(cx+s*1.05, cy+s*0.5, cx+s, cy);
    g.closePath();
  }, tone, Math.max(1.6,s*0.09));
  // a stub mast + oar ticks
  pen.ink(()=>{ g.moveTo(cx, cy+s*0.1); g.lineTo(cx, cy-s*0.7); }, Math.max(1.6,s*0.08));
  g.strokeStyle=INK; g.lineWidth=Math.max(1.4,s*0.06);
  for(let k=-2;k<=2;k++){ g.beginPath(); g.moveTo(cx+k*s*0.28, cy+s*0.12); g.lineTo(cx+k*s*0.32, cy+s*0.4); g.stroke(); }
}

/* ============================================================
   The HARBOUR of Telepylos: a narrow rock-walled cove. Steep cliff faces on
   both sides close to a slim throat; a pool of water at the bottom where the
   ships are trapped. Drawn behind the giants so they line its rim and lean over
   it. Not a baked character in sight — only the trap and its little hulls.
   ============================================================ */
function drawHarbour(pen, W, H, st){
  const g = pen.ctx;
  const rimY   = H*0.565;                // the cliff edge the giants stand on
  const waterY = H*0.60;                 // the water surface, just below the rim

  // ---- SKY behind the clifftop giants (lightest, so each giant reads clear) ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,rimY);
  // a faint far headland line so the sky isn't dead empty
  g.fillStyle = inkLevel(2);
  g.beginPath(); g.moveTo(0, rimY);
  for(let x=0;x<=W;x+=W*0.06){ const t=x/W; g.lineTo(x, rimY - (Math.sin(t*5.1+2)*0.5+0.5)*H*0.03 - H*0.008); }
  g.lineTo(W, rimY); g.closePath(); g.fill();

  // ---- the CLIFF EDGE the population lines (a dark rocky lip across) ----
  pen.paint(()=>{
    g.moveTo(0, rimY-H*0.018);
    for(let x=0;x<=W;x+=W*0.045){ const t=x/W; g.lineTo(x, rimY - (Math.sin(t*11+0.5)*0.5+0.5)*H*0.012); }
    g.lineTo(W, waterY); g.lineTo(0, waterY); g.closePath();
  }, toneSolid(inkLevel(4)), 4);
  pen.ink(()=>{ g.moveTo(0,rimY-H*0.014); g.lineTo(W,rimY-H*0.014); }, 3);

  // ---- WATER: the trapped pool filling the lower cove (mid tone, rippled) ----
  g.fillStyle = inkLevel(3); g.fillRect(0, waterY, W, H-waterY);
  g.fillStyle = inkLevel(4);
  g.beginPath(); g.ellipse(W*0.5, H*0.78, W*0.34, H*0.13, 0,0,7); g.fill();   // deep churned centre
  g.fillStyle = inkLevel(2);                                                  // lit foam nearer the mouth
  g.beginPath(); g.ellipse(W*0.5, H*0.985, W*0.5, H*0.09, 0,0,7); g.fill();
  g.strokeStyle=INK; g.lineWidth=2.4; g.globalAlpha=0.30;
  for(let j=1;j<=8;j++){ const y=waterY + (H-waterY)*(j/9);
    g.beginPath(); g.moveTo(W*0.06, y); g.quadraticCurveTo(W*0.5, y-H*0.008, W*0.94, y); g.stroke(); }
  g.globalAlpha=1;

  // ---- CLIFF ARMS closing the harbour mouth — pointed rock spurs, not towers ----
  pen.paint(()=>{
    g.moveTo(0, waterY-H*0.012);
    g.lineTo(W*0.17, waterY+H*0.03);
    g.quadraticCurveTo(W*0.13, H*0.72, W*0.05, H*0.84);
    g.lineTo(0, H*0.80); g.closePath();
  }, toneSolid(inkLevel(5)), 4);
  pen.paint(()=>{
    g.moveTo(W, waterY-H*0.012);
    g.lineTo(W*0.83, waterY+H*0.03);
    g.quadraticCurveTo(W*0.87, H*0.72, W*0.95, H*0.84);
    g.lineTo(W, H*0.80); g.closePath();
  }, toneSolid(inkLevel(5)), 4);
  pen.ink(()=>{ g.moveTo(W*0.06, waterY); g.lineTo(W*0.94, waterY); }, 2);
}

/* ============================================================
   Build the giant population deterministically. Members line a CLIFF-LINE arc
   over the harbour; `converge` pulls the arc inward and leans every giant over
   the throat; each is assigned an attack action (wings hurl, centre spears,
   some haul). Boulders-in-air + water victim tokens scale with ferocity/density.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const n = Math.max(2, p.count|0);
  const converge = clamp01(p.converge);
  const ferocity = clamp01(p.ferocity);
  const cprog = smooth(converge);
  const HX = W*p.harbourX, HY = H*p.harbourY;

  const members = [];
  for (let i=0;i<n;i++){
    const rng = rnd((i*149 + 51)>>>0);
    const t = n>1 ? i/(n-1) : 0.5;
    const u = t - 0.5;                                  // -0.5 .. 0.5 across the rim

    // CLIFF-LINE home: strung wide along the rim, wings dip nearer (lower/bigger)
    const rimX = W*0.5 + u*W*0.96 + (rng()-0.5)*W*0.015;
    const rimY = H*0.46 + Math.abs(u)*H*0.075 + (rng()-0.5)*H*0.01;
    // CONVERGE target: the arc draws inward over the throat
    const cvX = W*0.5 + u*W*0.78;
    const cvY = rimY - H*0.004;

    let cx = lerp(rimX, cvX, cprog);
    let by = lerp(rimY, cvY, cprog);
    cx = clamp(cx, W*0.07, W*0.93);

    const depth = clamp01(Math.abs(u)/0.5);             // 0 centre(back) .. 1 wings(near)
    const s = H*lerp(0.185, 0.255, depth) * (0.92 + rng()*0.12);

    const dir = (HX - cx) >= 0 ? 1 : -1;                // face toward the throat

    // action: wings HURL boulders, centre SPEARS the water, a few HAUL a catch
    const a = rng();
    let action;
    if (Math.abs(u) > 0.26) action = a<0.72 ? "hurl" : "spear";
    else                    action = a<0.5 ? "spear" : (a<0.82 ? "hurl" : "haul");

    // gaze down at the water
    const dx = HX - cx, dy = HY - (by - s*0.55), gl = Math.hypot(dx,dy)||1;
    const gaze = { x: dx/gl, y: clamp(dy/gl, 0, 0.95) };

    // alternate neighbour tones so overlapping brutes stay legible as separate shapes
    const parity = (i%2)===0 ? -1 : 1;
    const sh = { body: clamp(Math.round(lerp(3.6, 5, depth) + parity*0.7), 3, 6) };
    const feat = { headS:0.9+rng()*0.2, bulk:rng(), beard:rng()<0.55, rockR:0.85+rng()*0.35 };

    members.push({ cx, baseY:by, s, dir, action, gaze, sh, feat,
                   ferocity, target:{x:HX,y:HY}, depth:Math.abs(u), rng });
  }
  // painter order: back/centre (small baseY) -> front/wings (large baseY)
  members.sort((a,b)=> a.baseY - b.baseY);

  // boulders in the air, arcing down toward the water
  const airRocks = [];
  const nRocks = Math.round(lerp(0, 5, ferocity) * clamp01(p.density));
  for (let i=0;i<nRocks;i++){
    const rr = rnd((i*71 + 900)>>>0);
    const side = i%2 ? 1 : -1;
    const x0 = W*(0.5 + side*(0.18 + rr()*0.2));
    const y0 = H*(0.30 + rr()*0.12);
    const prog = 0.25 + rr()*0.5;                       // how far down the arc
    const x = lerp(x0, HX, prog) + (rr()-0.5)*W*0.02;
    const y = lerp(y0, HY-H*0.02, prog*prog);
    airRocks.push({ x, y, r: H*(0.018 + rr()*0.02), tone: 5+(i%2) });
  }
  // speared victims / thrashing men in the water
  const victims = [];
  const nVic = Math.round(lerp(2, 7, ferocity) * clamp01(p.density));
  for (let i=0;i<nVic;i++){
    const rr = rnd((i*57 + 400)>>>0);
    victims.push({ x: W*(0.30 + rr()*0.40), y: H*(0.65 + rr()*0.16), s: H*(0.02+rr()*0.012) });
  }
  return { members, airRocks, victims,
           showHarbour:p.showHarbour, showBoats:p.showBoats,
           HX, HY, harbourX:p.harbourX, harbourY:p.harbourY };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);

  if (B.showHarbour) drawHarbour(pen, W, H, { ...params, ...st });

  // the trapped fleet — crowded hulls jammed into the cove, easy targets below
  if (B.showBoats){
    const fleet = [
      [0.36,0.700,0.030,4],[0.52,0.690,0.026,5],[0.64,0.720,0.034,4],
      [0.44,0.760,0.038,6],[0.58,0.800,0.042,5],[0.40,0.845,0.034,4],
      [0.56,0.870,0.030,6],
    ];
    // painter order: far (higher) first
    for (const [fx,fy,fs,tn] of fleet){
      drawBoat(pen, W*fx, H*fy, H*fs, toneSolid(inkLevel(tn)));
    }
  }
  // thrashing / speared men in the water (fish-caught sailors)
  for (const v of B.victims){
    pen.paint(()=>{ g.ellipse(v.x, v.y, v.s*0.9, v.s*0.5, 0.3,0,7); }, toneSolid(inkLevel(6)), Math.max(1.4,v.s*0.12));
    g.strokeStyle=INK; g.lineWidth=Math.max(1.4,v.s*0.16); g.lineCap="round";
    g.beginPath(); g.moveTo(v.x-v.s*0.7, v.y-v.s*0.4); g.lineTo(v.x+v.s*0.9, v.y-v.s*0.9); g.stroke(); // flung arm/splash
  }

  // the population of giants, painter-sorted centre -> wings
  for (const m of B.members) drawGiant(pen, m);

  // boulders raining down through the air (drawn over the giants, mid-flight)
  for (const r of B.airRocks){
    pen.paint(()=>{ g.ellipse(r.x, r.y, r.r, r.r*0.92, 0.2,0,7); }, toneSolid(inkLevel(r.tone)), Math.max(1.8,r.r*0.12));
    pen.seam(()=>{ g.moveTo(r.x-r.r*0.4, r.y-r.r*0.5); g.lineTo(r.x+r.r*0.2, r.y+r.r*0.1); }, Math.max(1.2,r.r*0.1));
    // a faint motion streak trailing up the arc
    g.strokeStyle="rgba(0,0,0,0.18)"; g.lineWidth=Math.max(1.4,r.r*0.2);
    g.beginPath(); g.moveTo(r.x, r.y-r.r); g.lineTo(r.x-(r.x-B.HX)*0.06, r.y-r.r*2.4); g.stroke();
  }

  // a single ACCENT at the harbour throat — the point the whole city converges on
  g.fillStyle=ACCENT; g.beginPath(); g.arc(B.HX, B.HY, Math.max(2.6, W*0.007), 0,7); g.fill();
}

export const asset = {
  id:"ensemble.laestrygonian-giants",
  type:"ENSEMBLE",
  name:"Laestrygonian giants",
  statusWord:"RAVENOUS",
  scene:"OD-B10-S02",

  params,
  // ONE two-eyed giant template, instanced deterministically along the cliff rim
  member:{ template:"giant", actions:["hurl","spear","haul"] },
  // back -> front draw order the ensemble honors
  layers:["sky","far-cliff","cliff-arms","water","boats","victims","giant-band","air-boulders","focus"],
  // normalized 0..1 anchors: the throat they converge on, the rim, the wings
  anchors:{
    "harbour:throat":{x:.50,y:.80},
    "rim:centre":{x:.50,y:.40},
    "wing:left":{x:.08,y:.51},   "wing:right":{x:.92,y:.51},
    "ledge:left":{x:.20,y:.46},  "ledge:right":{x:.80,y:.46},
    "water:pool":{x:.50,y:.88},
    "center":{x:.50,y:.55},       "camera:wide":{x:.50,y:.50},
  },
  // the rock rim the population occupies + the trap-water below (for placement)
  zones:{
    rim:{ x0:.04,y0:.36,x1:.96,y1:.56 },
    harbour:{ x0:.22,y0:.70,x1:.78,y1:.98 },
    throat:{ x0:.40,y0:.66,x1:.60,y1:.72 },
  },
  channels:["formation","converge","ferocity","density","reaction"],
  states:{
    initial:"lining",
    nodes:{
      // the city pours to the clifftops, strung loosely along the rim, poised
      lining:    { preview:{ formation:"cliff-line", converge:0.2,  ferocity:0.25, status:"LINING" } },
      // the whole population converges inward, leaning over the trapped ships
      converging:{ preview:{ formation:"converge",   converge:0.7,  ferocity:0.55, status:"CONVERGING" } },
      // full assault — boulders raining, spears thrust, the water churning
      slaughter: { preview:{ formation:"converge",   converge:0.9,  ferocity:0.95, status:"RAVENOUS" } },
      // hauling the speared catch up the rock, the attack thinning
      hauling:   { preview:{ formation:"converge",   converge:0.8,  ferocity:0.5,  status:"HAULING" } },
    },
    edges:[
      ["lining","converging"],["converging","slaughter"],
      ["slaughter","hauling"],["hauling","converging"],
    ],
  },

  // neutral preview = full assault, the whole population leaning over the throat
  preview:()=>({ formation:"converge", converge:0.6, ferocity:0.75, status:"RAVENOUS", progress:0.7 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
