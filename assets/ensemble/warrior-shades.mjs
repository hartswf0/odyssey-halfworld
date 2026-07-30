/* ensemble.warrior-shades — the Achaean war-dead as a REPUTATION CHORUS.
   ENSEMBLE asset. Scene function (OD-B24-S02): the famous dead of Troy — helmeted,
   still carrying their wounds and their spears — stand in the asphodel and LISTEN
   to a shade testify, then turn, assent, and rise into acclaim. What sweeps
   through this group is not panic but JUDGEMENT, and it travels as a
   reaction-wave along the rank: the chorus is the instrument by which a deed
   becomes fame.

   Built from ONE separable member template (drawWarrior) instanced N times
   deterministically over a chorus arc whose ends bow forward around an OPEN
   FRONT-CENTRE — the speaker's ground. The testifying shade is NOT baked in;
   only the diegetic focus tick that marks where the chorus is aimed.

   Tonally the members are LIGHT PLANES (near-paper wisp, pale cuirass, pale skin)
   held by a HARD BLACK contour, with solid black reserved for the helmet crests,
   the hollow eye-slots, the spear heads and the wound marks. Paper carries the
   plate; the crests are the only mass.

   Exposed controls (the ENSEMBLE contract): formation (chorus-arc | wedge |
   double-file | cluster), density (rows / perRow), attention (how hard every
   shade orients on the focus), the reaction-wave pair (wave front position +
   waveLag spread) driving a `phase` behaviour, and foreground/background
   (layer: full | background | foreground) so a scene can split the chorus
   around its principals. */
import { inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"chorus-arc",  // chorus-arc | wedge | double-file | cluster
  rows:3,                  // depth tiers (back..front)
  perRow:[6,5,4],          // members per tier (density) back -> front
  phase:"listening",       // listening | turning | assenting | acclaim
  wave:0.55,               // reaction-wave FRONT position, 0=left edge .. 1=passed all
  waveLag:0.7,             // per-member LAG spread of the wave across the rank
  attention:0.85,          // orientation pull toward the focus (0=slack .. 1=all turned)
  focus:{ x:0.50, y:0.92 },// the testifying shade's ground — open, never drawn
  layer:"full",            // full | background | foreground  (depth split for scenes)
  showFocus:true,          // the focus tick + the chorus's aiming arc
  showWave:true,           // the travelling reaction-wave front
  showMeadow:true,         // asphodel tufts + broken horizon
  groundY:0.72,            // front-tier shoulder line as fraction of H
};

/* ---------------- drawing helpers: light plane + hard contour, weights that
   scale with the member so nothing turns into a slab at rank size ------------- */
function plane(g, pathFn, fillHex, lw){
  g.beginPath(); pathFn();
  g.fillStyle=fillHex; g.fill();
  g.strokeStyle=INK; g.lineWidth=lw; g.lineJoin="round"; g.stroke();
}
function seam(g, pathFn, lw){
  g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="round"; g.lineJoin="round";
  g.beginPath(); pathFn(); g.stroke();
}
function limb(g, pts, coreHex, w){
  g.lineCap="round"; g.lineJoin="round";
  const run=()=>{ g.beginPath(); g.moveTo(pts[0].x,pts[0].y);
                  for(let i=1;i<pts.length;i++) g.lineTo(pts[i].x,pts[i].y); g.stroke(); };
  g.strokeStyle=INK; g.lineWidth=w*1.85; run();
  g.strokeStyle=coreHex; g.lineWidth=w; run();
}
function arm(g, sh, wr, coreHex, w){
  const el={ x:(sh.x+wr.x)/2, y:(sh.y+wr.y)/2 + Math.abs(wr.x-sh.x)*0.10 + w*0.55 };
  limb(g, [sh, el, wr], coreHex, w);
  return el;
}

/* ============================================================
   ONE member template — a HELMETED WARRIOR SHADE.
   A pale cuirass with a scalloped hem over a dissolving wisp instead of legs; a
   crested helmet whose crest, brow band and eye-slots carry the member's only
   black; a grounded or lifted spear; some carry a round shield seen edge-on.
   Pose is four scalars — turn, nod, armRaise, mouth — so every phase is the same
   body differently aimed.
   ============================================================ */
function drawWarrior(g, m){
  const s     = m.s;
  const robe  = inkLevel(m.sh.robe);
  const skin  = inkLevel(m.sh.skin);
  const wisp  = inkLevel(m.sh.wisp);
  const metal = inkLevel(m.sh.metal);
  const dark  = inkLevel(7);
  const lw    = Math.max(1.8, s*0.022);
  const dir   = m.dir;

  const headR    = s*0.150*m.feat.headS;
  const torsoLen = s*0.30;
  const shoHalf  = s*0.175*m.feat.build;
  const hipHalf  = s*0.130;
  const shoulderY= m.cy;
  const shoCx    = m.cx + m.lean;
  const hipY     = shoulderY + torsoLen;

  /* ---- dissolving WISP lower body: a tapering shroud scalloped into tongues ---- */
  const yBot = hipY + s*0.36;
  plane(g, ()=>{
    g.moveTo(m.cx - hipHalf*0.94, hipY - s*0.02);
    const tongues = 3;
    for (let k=0;k<tongues;k++){
      const x0 = lerp(m.cx - hipHalf*0.94, m.cx + hipHalf*0.94, k/tongues);
      const x1 = lerp(m.cx - hipHalf*0.94, m.cx + hipHalf*0.94, (k+1)/tongues);
      g.quadraticCurveTo((x0+x1)/2, yBot - (k===1?0:s*0.10), x1, hipY + s*0.02);
    }
    g.closePath();
  }, wisp, lw*0.8);

  /* ---- CUIRASS torso, hem scalloped into three lobes (a broken span) ---- */
  plane(g, ()=>{
    g.moveTo(shoCx - shoHalf, shoulderY);
    g.lineTo(shoCx + shoHalf, shoulderY);
    g.lineTo(m.cx + hipHalf, hipY - s*0.05);
    for (let k=0;k<3;k++){
      const x0 = lerp(m.cx + hipHalf, m.cx - hipHalf, k/3);
      const x1 = lerp(m.cx + hipHalf, m.cx - hipHalf, (k+1)/3);
      g.quadraticCurveTo((x0+x1)/2, hipY + s*0.055, x1, hipY - s*0.05);
    }
    g.closePath();
  }, robe, lw);
  // yoke: an INSET shoulder band, well short of the silhouette edges
  seam(g, ()=>{
    g.moveTo(shoCx - shoHalf*0.58, shoulderY + s*0.055);
    g.lineTo(shoCx + shoHalf*0.58, shoulderY + s*0.055);
  }, lw*0.7);

  /* ---- the WOUND the shade still carries (its claim on the story) ---- */
  if (m.feat.wound){
    g.strokeStyle=dark; g.lineCap="round";
    if (m.feat.wound==="chest"){
      g.lineWidth=Math.max(2.2, s*0.028);
      g.beginPath();
      g.moveTo(shoCx - dir*shoHalf*0.24, shoulderY + torsoLen*0.36);
      g.lineTo(shoCx + dir*shoHalf*0.30, shoulderY + torsoLen*0.72);
      g.stroke();
    } else if (m.feat.wound==="throat"){
      g.lineWidth=Math.max(2, s*0.024);
      g.beginPath();
      g.moveTo(shoCx - headR*0.32, shoulderY + s*0.012);
      g.lineTo(shoCx + headR*0.36, shoulderY + s*0.028);
      g.stroke();
    } else { // arrow stub still standing in the cuirass
      const ax = shoCx - dir*shoHalf*0.10, ay = shoulderY + torsoLen*0.52;
      g.lineWidth=Math.max(2.2, s*0.026);
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax - dir*s*0.13, ay - s*0.06); g.stroke();
    }
  }

  /* ---- shoulders ---- */
  const shFront = { x: shoCx + dir*shoHalf*0.82, y: shoulderY + s*0.04 };
  const shBack  = { x: shoCx - dir*shoHalf*0.82, y: shoulderY + s*0.045 };
  const armW    = Math.max(2.4, s*0.040);

  /* ---- FAR arm: hangs, or carries a round shield seen edge-on ---- */
  if (m.feat.shield){
    const sx = shBack.x - dir*s*0.055, sy = shoulderY + torsoLen*0.60;
    arm(g, shBack, { x: sx + dir*s*0.05, y: sy - s*0.09 }, robe, armW*0.85);
    plane(g, ()=>{ g.ellipse(sx, sy, s*0.055, s*0.185, 0, 0, 7); }, wisp, lw);
    plane(g, ()=>{ g.ellipse(sx, sy, s*0.020, s*0.050, 0, 0, 7); }, inkLevel(4), lw*0.6);
  } else {
    arm(g, shBack, { x: m.cx - dir*s*0.06, y: hipY - s*0.03 }, robe, armW*0.85);
  }

  /* ---- HEAD: pale gaunt face under a crested helmet ---- */
  const turn   = m.turn;
  const headCx = shoCx + dir*headR*(0.12 + 0.30*turn);
  const headCy = shoulderY - headR*1.06 + m.nod*headR*0.40;

  // neck
  plane(g, ()=>{ g.rect(headCx - headR*0.26, shoulderY - headR*0.62, headR*0.52, headR*0.76); }, skin, lw*0.7);
  // face
  plane(g, ()=>{ g.ellipse(headCx, headCy, headR*0.84, headR*1.00, 0,0,7); }, skin, lw);

  // elder beard (light) — some of the dead are old kings, not young spearmen
  if (m.feat.beard){
    plane(g, ()=>{
      g.moveTo(headCx-headR*0.48, headCy+headR*0.34);
      g.quadraticCurveTo(headCx, headCy+headR*1.38, headCx+headR*0.48, headCy+headR*0.34);
      g.quadraticCurveTo(headCx, headCy+headR*0.66, headCx-headR*0.48, headCy+headR*0.34);
      g.closePath();
    }, inkLevel(m.sh.robe+1), lw*0.7);
  }

  // HOLLOW EYE-SLOTS (the death mask — sized to survive the dot lattice)
  const eyeY = headCy + headR*0.14;
  const eyeDX= headR*0.34, eyeRx = headR*0.20, eyeRy = headR*0.23;
  g.fillStyle=dark;
  if (turn < 0.66){ g.beginPath(); g.ellipse(headCx - dir*eyeDX, eyeY, eyeRx, eyeRy, 0,0,7); g.fill(); }
  g.beginPath(); g.ellipse(headCx + dir*eyeDX, eyeY, eyeRx, eyeRy, 0,0,7); g.fill();
  // mouth — opens as assent becomes voice
  if (m.mouth > 0.18){
    g.fillStyle=dark;
    g.beginPath();
    g.ellipse(headCx + dir*headR*0.06, headCy + headR*0.60, headR*0.17, headR*0.09 + headR*0.15*m.mouth, 0,0,7);
    g.fill();
  }

  /* ---- HELMET: dome + one dark brow band + the black crest ---- */
  if (m.feat.helm !== "none"){
    plane(g, ()=>{                                   // dome
      g.ellipse(headCx, headCy - headR*0.22, headR*1.02, headR*0.92, 0, Math.PI, 0);
      g.lineTo(headCx + headR*1.02, headCy - headR*0.22);
      g.lineTo(headCx - headR*1.02, headCy - headR*0.22);
      g.closePath();
    }, metal, lw);
    g.fillStyle=dark;                                // brow band (the helmet's shadow line)
    g.fillRect(headCx - headR*1.02, headCy - headR*0.40, headR*2.04, headR*0.18);
    const cH = m.feat.helm==="high" ? headR*0.95 : headR*0.46;
    g.beginPath();                                   // CREST — the member's one black mass
    g.moveTo(headCx - headR*0.80, headCy - headR*0.98);
    g.quadraticCurveTo(headCx, headCy - headR*1.12 - cH, headCx + headR*0.80, headCy - headR*0.98);
    g.quadraticCurveTo(headCx, headCy - headR*0.90 - cH*0.30, headCx - headR*0.80, headCy - headR*0.98);
    g.closePath(); g.fillStyle=dark; g.fill();
    if (m.feat.helm==="plume"){                      // a plume falling behind the neck
      g.strokeStyle=dark; g.lineCap="round"; g.lineWidth=Math.max(2.4, headR*0.22);
      g.beginPath();
      g.moveTo(headCx - dir*headR*0.60, headCy - headR*1.02);
      g.quadraticCurveTo(headCx - dir*headR*1.32, headCy - headR*0.34, headCx - dir*headR*1.10, headCy + headR*0.52);
      g.stroke();
    }
  } else {
    // bare head: a light hair cap — this one's helmet is gone
    plane(g, ()=>{
      g.moveTo(headCx - headR*0.92, headCy - headR*0.06);
      g.quadraticCurveTo(headCx, headCy - headR*1.46, headCx + headR*0.92, headCy - headR*0.06);
      g.quadraticCurveTo(headCx + headR*0.46, headCy - headR*0.56, headCx, headCy - headR*0.50);
      g.quadraticCurveTo(headCx - headR*0.46, headCy - headR*0.56, headCx - headR*0.92, headCy - headR*0.06);
      g.closePath();
    }, inkLevel(4), lw*0.7);
  }

  /* ---- NEAR arm + SPEAR: grounded when listening, lifted into acclaim ---- */
  const raise = m.armRaise;
  const wr = { x: shFront.x + dir*s*(0.10 + 0.06*raise),
               y: shoulderY + s*(0.28 - 0.44*raise) };
  arm(g, shFront, wr, robe, armW);

  if (m.feat.spear){
    const th = lerp(-0.17, 0.14, raise) * dir;       // butt-back at rest, tipped in on acclaim
    const u  = { x: Math.sin(th), y: -Math.cos(th) };
    const L  = s*1.30;
    const up = L*(0.62 + 0.28*raise), dn = L*(0.34 - 0.22*raise);
    const tip  = { x: wr.x + u.x*up, y: wr.y + u.y*up };
    const butt = { x: wr.x - u.x*dn, y: wr.y - u.y*dn };
    g.strokeStyle=INK; g.lineCap="round"; g.lineWidth=Math.max(2.4, s*0.030);
    g.beginPath(); g.moveTo(butt.x,butt.y); g.lineTo(tip.x,tip.y); g.stroke();
    const hl = s*0.120, hw = s*0.032;                // hard-black spear head
    const nx = -u.y, ny = u.x;
    g.beginPath();
    g.moveTo(tip.x + u.x*hl, tip.y + u.y*hl);
    g.lineTo(tip.x + nx*hw,  tip.y + ny*hw);
    g.lineTo(tip.x - nx*hw,  tip.y - ny*hw);
    g.closePath();
    g.fillStyle=INK; g.fill();
  }
  // the grip closes on the shaft last, so hand and spear read as one hold
  plane(g, ()=>{ g.ellipse(wr.x, wr.y, headR*0.26, headR*0.20, 0,0,7); }, skin, lw*0.6);

  return { head:{ x:headCx, y:headCy }, r:headR, act:m.act, cx:m.cx, cy:shoulderY };
}

/* ============================================================
   POSE — one body, four collective behaviours, driven by the local activation
   `a` (how far the reaction-wave has reached this member).
   ============================================================ */
function poseFor(phase, a, att, wob){
  const e = smooth(a);
  switch(phase){
    case "turning":   // heads snap onto the speaker as the wave passes
      return { turn: 0.30 + 0.60*e, nod: -0.10*e, armRaise: 0.10*e, mouth: 0.10*e, leanK: 0.55*e };
    case "assenting": // the judgement lands: chins dip, spear butts tap the ground
      return { turn: 0.55 + 0.18*att, nod: 0.85*e, armRaise: 0.06*(1-e), mouth: 0.32*e, leanK: 0.85*e };
    case "acclaim":   // the fame breaks out: spears up, heads back, mouths open
      return { turn: 0.34 + 0.14*att, nod: -0.70*e, armRaise: e, mouth: 0.95*e, leanK: 0.25 };
    default:          // listening — still, aimed, only a slow uneven sway
      return { turn: 0.34 + 0.40*att, nod: 0.10*wob*(0.4+0.6*e), armRaise: 0.05,
               mouth: 0, leanK: 0.35*att };
  }
}

/* ============================================================
   build the chorus deterministically. The arc bows FORWARD at its ends around an
   open front-centre (the speaker's ground); tiers run back(small/high) to
   front(large/low) with enough pitch that no rank swallows the one behind it.
   formation re-maps the same seats; layer splits the tiers for
   foreground/background staging.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st, focus:{ ...params.focus, ...((st&&st.focus)||{}) } };
  const wave = clamp01(p.wave);
  const lag  = clamp01(p.waveLag);
  const att  = clamp01(p.attention);
  const phase= p.phase || "listening";
  const rows = Math.max(1, p.rows|0);
  const perRow = p.perRow || [6,5,4];
  const layer = p.layer || "full";
  const fx = p.focus.x*W, fy = p.focus.y*H;
  const form = p.formation || "chorus-arc";

  const members = [];
  for (let r=0;r<rows;r++){
    if (layer==="background" && r===rows-1) continue;      // principals stand in front
    if (layer==="foreground" && r!==rows-1) continue;      // only the near rank
    const depth = rows>1 ? r/(rows-1) : 0;                 // 0=back .. 1=front
    const n = perRow[Math.min(r, perRow.length-1)] || 4;
    const marginX = lerp(0.145, 0.190, depth);
    const stagger = (r%2)*0.5;
    const rowY = lerp(H*0.290, H*p.groundY, depth);

    for (let i=0;i<n;i++){
      const t  = n>1 ? (i+stagger)/(n-1+stagger) : 0.5;
      const rng = rnd((r*211 + i*37 + 13)>>>0);
      const bow = Math.pow(Math.abs(t-0.5)*2, 1.7);        // 0 at centre .. 1 at the ends

      let px = lerp(marginX, 1-marginX, clamp01(t));
      let cx = W*px;
      let cy = rowY;
      let scale = lerp(H*0.135, H*0.190, depth);

      if (form==="wedge"){
        // a V aimed at the focus: ranks narrow and step down toward the speaker
        cx = W*0.5 + (px-0.5)*W*lerp(1.0, 0.66, depth);
        cy = rowY - (1-bow)*H*0.040;
        scale *= 1 + 0.04*bow;
      } else if (form==="double-file"){
        // two files flanking a wide central aisle
        px = t<0.5 ? lerp(0.13, 0.34, t*2) : lerp(0.66, 0.87, (t-0.5)*2);
        cx = W*px;
        cy = rowY + (t<0.5 ? (0.5-t)*2 : (t-0.5)*2) * H*0.040;
        scale *= 1.03;
      } else if (form==="cluster"){
        cx += (rng()-0.5)*scale*0.50;
        cy += (rng()-0.5)*H*0.040;
      } else {
        // chorus-arc: the ends bow forward (nearer, lower, larger)
        cy = rowY + bow*H*0.060*(0.55+0.45*depth);
        scale *= 1 + 0.06*bow;
      }

      // reaction-wave: left members activate first, right members lag
      const spread = 0.15 + lag*0.85;
      const a = clamp01(wave*(1+spread) - clamp01(t)*spread);
      const wob = rng()<0.5 ? -1 : 1;
      const pose = poseFor(phase, a, att, wob);

      const dir = (fx <= cx) ? -1 : 1;                     // face the focus
      const lean = dir * scale*0.040 * pose.leanK * (0.35+0.65*att);

      const ar = rng();
      const helm = ar<0.16 ? "none" : ar<0.48 ? "high" : ar<0.74 ? "low" : "plume";
      const wr2 = rng();
      const wound = wr2<0.28 ? "chest" : wr2<0.46 ? "throat" : wr2<0.58 ? "arrow" : null;

      members.push({
        cx, cy, s:scale, depth, dir, lean, act:a,
        turn:clamp01(pose.turn), nod:pose.nod, armRaise:clamp01(pose.armRaise), mouth:pose.mouth,
        feat:{
          helm, wound,
          beard: helm==="none" ? true : rng()<0.24,
          shield: rng()<0.36,
          spear: rng()<0.72,
          headS: 0.94 + rng()*0.14,
          build: 0.94 + rng()*0.14,
        },
        sh:{
          robe:  depth>0.72 ? 2 : 1,      // pale cuirass; the near rank one step firmer
          skin:  1,
          wisp:  1,
          metal: depth>0.72 ? 3 : 2,
        },
      });
    }
  }

  // draw back -> front so the near rank occludes the far ones
  members.sort((a,b)=> a.cy - b.cy);
  return { members, wave, lag, att, phase, focus:{ x:fx, y:fy },
           showFocus:p.showFocus, showWave:p.showWave, showMeadow:p.showMeadow, layer };
}

/* -------- the asphodel meadow: broken tufts + a broken horizon (never a full rule) -------- */
function drawMeadow(g, W, H){
  const rng = rnd(90210);
  // horizon in three separated segments so nothing stripes the frame
  g.strokeStyle=inkLevel(6); g.globalAlpha=0.55; g.lineWidth=Math.max(3.6, W*0.0062);
  for (const [x0,x1] of [[0.10,0.31],[0.39,0.61],[0.70,0.91]]){
    g.beginPath(); g.moveTo(W*x0, H*0.210); g.lineTo(W*x1, H*0.210); g.stroke();
  }
  g.globalAlpha=1;
  // asphodel: a few clumps of short stalks with a bud, on the open near ground
  g.lineCap="round";
  for (let k=0;k<11;k++){
    const cx = W*(0.07 + rng()*0.86);
    const cy = H*(0.80 + rng()*0.15);
    const s  = H*(0.026 + rng()*0.022);
    g.strokeStyle=inkLevel(4); g.lineWidth=Math.max(1.6, s*0.11); g.globalAlpha=0.75;
    for (let q=-1;q<=1;q++){
      g.beginPath();
      g.moveTo(cx + q*s*0.34, cy);
      g.quadraticCurveTo(cx + q*s*0.50, cy - s*0.55, cx + q*s*0.38, cy - s);
      g.stroke();
      g.beginPath(); g.arc(cx + q*s*0.38, cy - s*1.10, Math.max(1.4, s*0.12), 0, 7);
      g.fillStyle=inkLevel(5); g.fill();
    }
    g.globalAlpha=1;
  }
}

function drawEnsemble(ctx, W, H, st){
  const g = ctx;
  const B = buildMembers(W, H, st);

  if (B.showMeadow) drawMeadow(g, W, H);

  // the travelling REACTION-WAVE front (diagram device, not decoration)
  if (B.showWave){
    const wx = lerp(W*0.06, W*0.94, B.wave);
    g.strokeStyle=ACCENT; g.globalAlpha=0.24; g.lineWidth=Math.max(2, W*0.0055);
    g.setLineDash([W*0.014, W*0.024]);
    g.beginPath(); g.moveTo(wx, H*0.16); g.lineTo(wx, H*0.90); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
  }

  // the chorus, back -> front
  const heads = B.members.map(m => drawWarrior(g, m));

  // where the chorus is AIMED: the open speaker's ground (the shade is not drawn)
  if (B.showFocus){
    const fx=B.focus.x, fy=B.focus.y;
    g.strokeStyle=inkLevel(5); g.globalAlpha=0.35; g.lineWidth=Math.max(2, W*0.004);
    g.setLineDash([9,11]);
    g.beginPath(); g.ellipse(fx, fy, W*0.150, H*0.048, 0, Math.PI*1.04, Math.PI*1.96); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
    g.fillStyle=ACCENT;
    g.fillRect(fx - W*0.009, fy - H*0.007, W*0.018, H*0.014);
  }

  // ACCLAIM: broken song-arcs over the heads the wave has already lifted
  if (B.phase==="acclaim"){
    g.strokeStyle=INK; g.lineCap="round";
    heads.forEach(h=>{
      if (h.act < 0.55) return;
      g.globalAlpha = 0.34*h.act; g.lineWidth = Math.max(1.8, h.r*0.14);
      for (let q=1;q<=2;q++){
        g.beginPath(); g.arc(h.head.x, h.head.y - h.r*2.0, h.r*(0.9+0.6*q), -2.45, -0.70); g.stroke();
      }
      g.globalAlpha=1;
    });
  }
  // ASSENT: a short down-tick over each head that has already agreed
  if (B.phase==="assenting"){
    g.strokeStyle=INK; g.lineCap="round";
    heads.forEach(h=>{
      if (h.act < 0.5) return;
      g.globalAlpha=0.32*h.act; g.lineWidth=Math.max(1.8, h.r*0.13);
      g.beginPath(); g.moveTo(h.head.x, h.head.y - h.r*1.85); g.lineTo(h.head.x, h.head.y - h.r*2.45); g.stroke();
      g.globalAlpha=1;
    });
  }
}

export const asset = {
  id:"ensemble.warrior-shades",
  type:"ENSEMBLE",
  name:"Warrior shades",
  statusWord:"ATTENDING",
  scene:"OD-B24-S02",

  params,
  // back -> front draw order the ensemble honors
  layers:["meadow","horizon","wave-front","back-rank","mid-rank","front-rank","focus-ground","chorus-overlay"],
  // normalized 0..1 anchors: the speaker's ground, rank handles, wave poles
  anchors:{
    "focus:speaker":{x:.50,y:.92}, "focus:stand":{x:.50,y:.86},
    "rank:back":{x:.50,y:.32}, "rank:mid":{x:.50,y:.52}, "rank:front":{x:.50,y:.72},
    "wing:left":{x:.19,y:.78}, "wing:right":{x:.81,y:.78},
    "wave:start":{x:.06,y:.54}, "wave:end":{x:.94,y:.54},
    "aisle:centre":{x:.50,y:.80}, "camera:wide":{x:.50,y:.54},
  },
  zones:{
    chorus:{ x0:.06,y0:.18,x1:.94,y1:.90 },     // where the ranks stand
    open:{   x0:.34,y0:.84,x1:.66,y1:.99 },     // the speaker's ground — keep it clear
  },
  states:{
    initial:"listening",
    nodes:{
      // the war-dead stand aimed at the testifying shade, still, spears grounded
      listening:{ preview:{ phase:"listening", wave:0.5,  waveLag:0.6,  attention:0.85, status:"LISTENING" } },
      // the wave of attention sweeps the rank — heads snap onto the speaker
      turning:  { preview:{ phase:"turning",   wave:0.55, waveLag:0.8,  attention:1.0,  status:"TURNING" } },
      // the judgement lands: chins dip, spear butts touch the ground
      assenting:{ preview:{ phase:"assenting", wave:0.8,  waveLag:0.55, attention:0.9,  status:"ASSENTING" } },
      // fame breaks out: spears lift, heads go back, the chorus becomes a song
      acclaim:  { preview:{ phase:"acclaim",   wave:0.72, waveLag:0.5,  attention:0.6,  status:"ACCLAIM" } },
    },
    edges:[
      ["listening","turning"],["turning","assenting"],["assenting","acclaim"],
      ["acclaim","listening"],["listening","assenting"],
    ],
  },
  channels:["wave","waveLag","phase","attention","formation","density","layer","focus","depth"],

  // neutral preview = the rank aimed and half-turned, the wave mid-sweep
  preview:()=>({ phase:"turning", wave:0.58, waveLag:0.7, attention:0.9,
                 formation:"chorus-arc", layer:"full", status:"ATTENDING", progress:0.42 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
