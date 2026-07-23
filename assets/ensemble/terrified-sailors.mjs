/* ensemble.terrified-sailors — Odysseus's crew frozen in dread.
   ENSEMBLE asset. Scene function (OD-B09-S07): the sailors are FROZEN
   WITNESSES recoiling from a wrath overhead — some throw their hands up to
   ZEUS, some stifle a cry behind a cupped hand, and the rest track the SEALED
   EXIT they cannot reach. Built from ONE separable member template (drawSailor)
   instanced N times deterministically in a RECOIL-CLUSTER. Exposes formation,
   density, attention (the upward pull toward Zeus), and a TERROR reaction-wave:
   `terror` (collective intensity) + `wave`/`waveLag` (a dread front sweeping the
   ranks). Drawn in SOLID grays + hard contour; the engine dotify pass supplies
   the halftone. Neither Zeus nor the exit is baked as a character — Zeus is a
   small diagrammatic bolt overhead, the exit a sealed diagram at the side. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"recoil-cluster", // recoil-cluster | rows | arc
  rows:3,                     // depth tiers (back..front)
  perRow:[7,6,4],             // members per tier (density)
  terror:0.85,               // collective dread intensity, 0=calm .. 1=frozen
  wave:0.7,                   // dread FRONT position across the ranks (0..1)
  waveLag:0.7,                // per-member LAG spread of the wave
  attention:0.85,            // upward pull toward Zeus (0=none .. 1=full)
  exitSide:1,                 // which side the sealed exit sits (-1 left, +1 right)
  showZeus:true,              // draw the small bolt/wrath sign overhead
  showExit:true,              // draw the sealed doorway diagram
  showRays:true,              // faint attention rays from Zeus into the ranks
  groundY:0.90,               // front-row footline as fraction of H
};

/* two-segment arm shoulder->elbow->wrist; elbow sags toward the midpoint */
function armTo(pen, sh, wr, tone, w){
  const mx=(sh.x+wr.x)/2, my=(sh.y+wr.y)/2;
  const el={ x:mx + (wr.x-sh.x)*0.08, y:my + Math.abs(wr.x-sh.x)*0.10 + w*0.5 };
  pen.limb(()=>{ pen.ctx.moveTo(sh.x,sh.y); pen.ctx.lineTo(el.x,el.y); }, tone, w);
  pen.limb(()=>{ pen.ctx.moveTo(el.x,el.y); pen.ctx.lineTo(wr.x,wr.y); }, tone, w*0.86);
  return wr;
}

/* ============================================================
   ONE member template — a terrified sailor.
   Keyed off `s` (member height). The dread pose packs: recoil (weight thrown
   back), leanX (torso shear away from the wrath), headTurn (toward the exit),
   lookUp (chin flung to Zeus), armMode (hail | stifle | ward | side), and
   mouthOpen (a stifled/open cry). `feat` carries deterministic identity.
   ============================================================ */
function drawSailor(pen, m){
  const g = pen.ctx, s = m.s;
  const recoil = m.recoil, leanX = m.leanX, headTurn = m.headTurn, lookUp = m.lookUp;
  const tunic = toneSolid(inkLevel(m.shade.tunic));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const leg   = toneSolid(inkLevel(m.shade.leg));
  const dark  = toneSolid(inkLevel(m.shade.hair));

  const footY   = m.baseY;
  const footHalf= s*0.14, hipHalf = s*0.10, shoHalf = s*0.155;
  const legLen  = s*0.44, torsoLen= s*0.34;
  // recoil throws the hips low and the weight onto the back foot
  const hipY    = footY - legLen*(1 - 0.20*recoil);
  const kneeY   = footY - legLen*0.50*(1 - 0.14*recoil);
  const kneeHalf= hipHalf + s*0.06*recoil;
  // the torso shears AWAY (leanX already carries the recoil direction+amount)
  const shoCx   = m.cx + leanX;
  const shoY    = hipY - torsoLen*(1 - 0.06*recoil);
  const headR   = s*0.115*m.feat.headS;
  const headCx  = shoCx + leanX*0.30 + headTurn*headR*0.42;
  // chin flung back toward Zeus rides the head higher and further back
  const headCy  = shoY - headR*1.0 - s*0.02 - lookUp*headR*0.60 + recoil*headR*0.10;
  const lw      = Math.max(2, s*0.03);

  // ---- legs : one foot planted, the back foot braced behind (recoil stance) ----
  const legW = Math.max(3, s*0.075);
  const braceDir = m.recoilDir;                 // back foot slides opposite the lean
  for (const side of [-1, 1]){
    const back = (side === -braceDir);
    const hp={ x:m.cx+side*hipHalf, y:hipY };
    const kp={ x:m.cx+side*kneeHalf, y:kneeY };
    const fp={ x:m.cx+side*footHalf + (back? -braceDir*s*0.10*recoil : 0), y:footY };
    pen.limb(()=>{ g.moveTo(hp.x,hp.y); g.lineTo(kp.x,kp.y); }, leg, legW);
    pen.limb(()=>{ g.moveTo(kp.x,kp.y); g.lineTo(fp.x,fp.y); }, leg, legW*0.9);
    pen.paint(()=>{ g.ellipse(fp.x+side*s*0.03, fp.y, s*0.075, s*0.032, 0,0,7); }, toneSolid(inkLevel(6)), lw*0.7);
  }

  // ---- torso: sailor's tunic trapezoid, sheared by the recoil ----
  pen.paint(()=>{
    g.moveTo(m.cx-hipHalf, hipY);
    g.lineTo(m.cx+hipHalf, hipY);
    g.lineTo(shoCx+shoHalf, shoY);
    g.lineTo(shoCx-shoHalf, shoY);
    g.closePath();
  }, tunic, lw);
  // chiton drapery seams
  pen.seam(()=>{ g.moveTo(shoCx, shoY+s*0.02); g.lineTo(m.cx, hipY); }, Math.max(2,s*0.016));
  pen.seam(()=>{ g.moveTo(shoCx-shoHalf*0.5, shoY+s*0.04); g.lineTo(m.cx-hipHalf*0.6, hipY); }, Math.max(1.5,s*0.013));

  // ---- neck ----
  pen.paint(()=>{ g.rect(headCx-headR*0.30, shoY-headR*0.55, headR*0.60, headR*0.85); }, skin, Math.max(2,s*0.018));

  // ---- shoulders ----
  const shL={ x:shoCx-shoHalf*0.92, y:shoY+s*0.015 };
  const shR={ x:shoCx+shoHalf*0.92, y:shoY+s*0.015 };
  const armW = Math.max(3, s*0.06);

  // wrist targets per armMode ----------------------------------------------
  const armWrist = (side, sh)=>{
    switch(m.armMode){
      case "hail":  // both hands flung up to Zeus in a pleading V, palms to the sky
        return { x: headCx + side*headR*1.25, y: headCy - headR*1.30 - lookUp*headR*0.35 };
      case "stifle": // near hand clapped over the mouth, far hand clutched to chest
        return side===m.faceSide
          ? { x: headCx + side*headR*0.10, y: headCy + headR*0.55 }
          : { x: shoCx - side*s*0.02, y: shoY + torsoLen*0.34 };
      case "ward":  // near hand thrown up to shield, far hand braced back
        return side===m.wardSide
          ? { x: headCx + side*headR*1.35, y: headCy - headR*0.90 }
          : { x: sh.x - side*s*0.10*recoil, y: hipY - s*0.04 };
      default:      // arms drawn tight to the body, frozen
        return { x: sh.x + side*s*0.015, y: hipY - s*0.02 };
    }
  };

  // FAR arm first (side away from head lean), then head, then NEAR arm on top
  const nearSide = headTurn>=0 ? 1 : -1;
  const farSide  = -nearSide;
  armTo(pen, farSide<0?shL:shR, armWrist(farSide, farSide<0?shL:shR), tunic, armW*0.9);

  // ---- head ----
  if (m.feat.hair!=="bald")
    pen.paint(()=>{ g.ellipse(headCx, headCy+headR*0.12, headR*1.12, headR*1.2, 0,0,7); }, dark, Math.max(2,s*0.026));
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0,0,7); }, skin, Math.max(2,s*0.028));

  // ---- face : wide terror eyes, high brows, open/stifled cry ----
  const eyeY = headCy - headR*0.05 - lookUp*headR*0.28;
  const gx   = headTurn*headR*0.34;            // eyes dart toward the exit
  const eyeR = headR*0.13 + headR*0.05*m.terror;   // fear widens the eyes
  g.fillStyle = INK;
  const eL = headCx - headR*0.34 + gx, eR = headCx + headR*0.34 + gx;
  const showR = headTurn > -0.6, showL = headTurn < 0.6;
  // white-of-eye ring under the pupil sells the terror stare
  if (showR){ g.fillStyle="#fff"; g.beginPath(); g.ellipse(eR, eyeY, eyeR*1.15, eyeR*1.2, 0,0,7); g.fill();
              g.fillStyle=INK;    g.beginPath(); g.ellipse(eR, eyeY, eyeR*0.6, eyeR*0.7, 0,0,7); g.fill(); }
  if (showL){ g.fillStyle="#fff"; g.beginPath(); g.ellipse(eL, eyeY, eyeR*1.15, eyeR*1.2, 0,0,7); g.fill();
              g.fillStyle=INK;    g.beginPath(); g.ellipse(eL, eyeY, eyeR*0.6, eyeR*0.7, 0,0,7); g.fill(); }
  // brows shot high with alarm (steep inner peak)
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.16); g.lineCap="round";
  const browY = eyeY - headR*0.40 - m.terror*headR*0.14;
  if (showL){ g.beginPath(); g.moveTo(headCx-headR*0.5+gx, browY+headR*0.10);
              g.lineTo(headCx-headR*0.12+gx, browY-headR*0.05); g.stroke(); }
  if (showR){ g.beginPath(); g.moveTo(headCx+headR*0.12+gx, browY-headR*0.05);
              g.lineTo(headCx+headR*0.5+gx, browY+headR*0.10); g.stroke(); }
  // nose
  g.lineWidth=Math.max(2,headR*0.12);
  g.beginPath();
  g.moveTo(headCx+gx*0.6, eyeY+headR*0.12);
  g.lineTo(headCx + headTurn*headR*0.42, eyeY+headR*0.46 - lookUp*headR*0.14);
  g.stroke();
  // mouth : an open cry, unless a hand stifles it (then a thin pressed line)
  if (m.armMode==="stifle"){
    g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.12);
    g.beginPath(); g.moveTo(headCx-headR*0.22+gx, headCy+headR*0.52);
    g.lineTo(headCx+headR*0.22+gx, headCy+headR*0.52); g.stroke();
  } else if (m.mouthOpen>0.12){
    g.fillStyle=INK; g.beginPath();
    g.ellipse(headCx+gx, headCy+headR*0.52, headR*0.15, headR*0.14*m.mouthOpen+headR*0.06, 0,0,7); g.fill();
  }

  // hair front cap + optional beard
  if (m.feat.hair!=="bald")
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.95, headCy-headR*0.02);
      g.quadraticCurveTo(headCx, headCy-headR*1.35, headCx+headR*0.95, headCy-headR*0.02);
      g.quadraticCurveTo(headCx+headR*0.5, headCy-headR*0.5, headCx, headCy-headR*0.45);
      g.quadraticCurveTo(headCx-headR*0.5, headCy-headR*0.5, headCx-headR*0.95, headCy-headR*0.02);
    }, dark, Math.max(2,s*0.02));
  if (m.feat.beard)
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.55, headCy+headR*0.35);
      g.quadraticCurveTo(headCx, headCy+headR*1.45, headCx+headR*0.55, headCy+headR*0.35);
      g.quadraticCurveTo(headCx, headCy+headR*0.7, headCx-headR*0.55, headCy+headR*0.35);
    }, dark, Math.max(2,s*0.018));

  // ---- NEAR arm on top ----
  armTo(pen, nearSide<0?shL:shR, armWrist(nearSide, nearSide<0?shL:shR), tunic, armW);

  // hands: small knuckle blobs at the raised wrists sell the "raised to Zeus"
  if (m.armMode==="hail"||m.armMode==="ward"){
    const upSide = m.armMode==="ward" ? m.wardSide : 1;
    for (const side of (m.armMode==="hail"? [-1,1] : [upSide])){
      const wr = armWrist(side, side<0?shL:shR);
      pen.paint(()=>{ g.arc(wr.x, wr.y, headR*0.24, 0, 7); }, skin, lw*0.7);
    }
  }
  return { head:{ x:headCx, y:headCy }, r:headR, act:m.act, armMode:m.armMode };
}

/* -------- Zeus overhead: a diagrammatic thunderbolt + radiating wrath --------
   NOT a figure — a jagged bolt with a struck accent spark and portent strokes,
   the thing every raised hand and flung-back chin is aimed at. */
function drawZeus(pen, cx, cy, s, attention){
  const g = pen.ctx;
  // radiating wrath strokes
  g.strokeStyle=INK; g.globalAlpha=0.30+0.2*attention; g.lineCap="round"; g.lineWidth=Math.max(2,s*0.05);
  for (let k=0;k<12;k++){ const ang=k/12*Math.PI*2;
    g.beginPath(); g.moveTo(cx+Math.cos(ang)*s*1.15, cy+Math.sin(ang)*s*0.85);
    g.lineTo(cx+Math.cos(ang)*s*1.6, cy+Math.sin(ang)*s*1.2); g.stroke(); }
  g.globalAlpha=1;
  // the bolt : a hard zig-zag driving down toward the crew
  g.strokeStyle=INK; g.lineJoin="miter"; g.lineCap="butt"; g.lineWidth=Math.max(4,s*0.18);
  g.beginPath();
  g.moveTo(cx - s*0.35, cy - s*0.7);
  g.lineTo(cx + s*0.12, cy - s*0.15);
  g.lineTo(cx - s*0.18, cy - s*0.05);
  g.lineTo(cx + s*0.30, cy + s*0.7);
  g.lineTo(cx + s*0.02, cy + s*0.15);
  g.lineTo(cx + s*0.34, cy + s*0.05);
  g.stroke();
  // struck spark at the bolt's tip (the single blue mark of divine strike)
  g.fillStyle=ACCENT;
  g.beginPath(); g.arc(cx + s*0.30, cy + s*0.72, Math.max(3,s*0.10), 0, 7); g.fill();
}

/* -------- the SEALED EXIT: a barred doorway the eyes track but cannot use ---- */
function drawSealedExit(pen, x, groundY, doorW, doorH, side){
  const g = pen.ctx;
  const x0 = x - doorW/2;
  // dark doorway recess
  pen.paint(()=>{ g.rect(x0, groundY-doorH, doorW, doorH); }, toneSolid(inkLevel(6)), 5);
  // heavy jamb + lintel frame
  pen.paint(()=>{ g.rect(x0-doorW*0.14, groundY-doorH-doorH*0.06, doorW*0.14, doorH+doorH*0.06); }, toneSolid(inkLevel(4)), 4);
  pen.paint(()=>{ g.rect(x0+doorW,      groundY-doorH-doorH*0.06, doorW*0.14, doorH+doorH*0.06); }, toneSolid(inkLevel(4)), 4);
  pen.paint(()=>{ g.rect(x0-doorW*0.14, groundY-doorH-doorH*0.10, doorW*1.28, doorH*0.10); }, toneSolid(inkLevel(5)), 4);
  // TWO barring planks nailed across — the "sealed" mark
  g.strokeStyle=INK; g.lineCap="butt";
  for (const f of [0.34, 0.62]){
    const by = groundY - doorH*f;
    pen.paint(()=>{ g.rect(x0-doorW*0.10, by-doorH*0.05, doorW*1.20, doorH*0.10); }, toneSolid(inkLevel(3)), 4);
  }
  // blue seal mark on the bar
  g.fillStyle=ACCENT; g.fillRect(x-doorW*0.05, groundY-doorH*0.48, doorW*0.10, doorH*0.05);
}

/* ============================================================
   pose selection : each member gets a ROLE (hail/stifle/watch) plus a wave
   activation `a`. Terror scales the whole reaction.
   ============================================================ */
function poseForRole(role, a, terror, exitSide, feat){
  const e = smooth(a) * terror;
  let recoil=0.25*e, leanX=0, headTurn=0, lookUp=0, armMode="side", mouthOpen=0, wardSide=1;
  switch(role){
    case "hail":     // hands flung up to Zeus, chin back, crying out
      recoil = 0.35*e; lookUp = 0.9*e; armMode = e>0.35?"hail":"side";
      mouthOpen = 0.85*e; headTurn = 0; break;
    case "stifle":   // recoiling hard, a hand clapped over a stifled cry
      recoil = 0.7*e; armMode = e>0.3?"stifle":"side"; mouthOpen = 0;
      headTurn = (feat.wob>0?0.2:-0.2)*e; lookUp = 0.2*e; break;
    case "watch":    // frozen, eyes darted to the sealed exit, one hand warding
      recoil = 0.6*e; headTurn = exitSide*0.75*e; armMode = e>0.4?"ward":"side";
      wardSide = -exitSide; lookUp = 0.15*e; mouthOpen = 0.3*e; break;
    default: break;
  }
  return { recoil, leanX, headTurn, lookUp, armMode, mouthOpen, wardSide };
}

function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const terror = clamp01(p.terror);
  const wave = clamp01(p.wave);
  const lag  = clamp01(p.waveLag);
  const attention = clamp01(p.attention);
  const exitSide = p.exitSide>=0 ? 1 : -1;
  const cluster = p.formation!=="rows" && p.formation!=="arc";
  const rows = Math.max(1, p.rows|0);
  const perRow = p.perRow || [7,6,4];

  const members = [];
  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 0;                 // 0=back .. 1=front
    const n = perRow[Math.min(r, perRow.length-1)] || (7-2*r);
    const scale = lerp(150, 250, depth);                    // back small, front large
    const rowY  = H*(0.52 + depth*(p.groundY-0.52));
    // cluster huddles the crew AWAY from the exit side, pressed against the wall
    // opposite the barred door; the crowd span stops short of the exit so the
    // sealed doorway stays legible beside the huddle.
    const marginX = lerp(0.18, 0.10, depth);
    const leftM   = exitSide<0 ? 0.24 : marginX;      // reserve the exit side
    const rightM  = exitSide>0 ? 0.24 : marginX;
    const stagger = (r%2)*0.5;
    for (let i=0;i<n;i++){
      const t  = n>1 ? (i+stagger)/(n-1+stagger) : 0.5;
      const px = clamp01(lerp(leftM, 1-rightM, clamp01(t)));
      const rng = rnd((r*131+i*17+11)>>>0);
      const feat = { beard: rng()<0.5, hair: rng()<0.14?"bald":"full",
                     headS: 0.9+rng()*0.22, wob: rng()<0.5?-1:1 };

      // assign a reaction role deterministically (mixed crowd)
      const roll = rng();
      const role = roll<0.34 ? "hail" : roll<0.68 ? "stifle" : "watch";

      // reaction-wave: dread reaches the near/leftward members first
      const spread = 0.15 + lag*0.85;
      const a = clamp01(wave*(1+spread) - px*spread);
      const pose = poseForRole(role, a, terror, exitSide, feat);

      // recoil direction : lean AWAY from Zeus (screen centre) — outward
      const recoilDir = px<0.5 ? -1 : 1;
      const leanPx = recoilDir * pose.recoil * scale * 0.14;

      // placement
      let cx = W*px;
      let by = rowY;
      if (p.formation==="arc") by = rowY + Math.sin(clamp01(t)*Math.PI)*scale*0.10;
      if (cluster){ cx += (rng()-0.5)*scale*0.24; by += (rng()-0.5)*scale*0.10; }

      members.push({
        cx, baseY:by, s:scale, depth, px,
        recoil:pose.recoil, recoilDir, leanX:leanPx,
        headTurn:pose.headTurn, lookUp:pose.lookUp,
        armMode:pose.armMode, mouthOpen:pose.mouthOpen, wardSide:pose.wardSide,
        faceSide: pose.headTurn>=0?1:-1, terror:terror*smooth(a),
        role, act:a, feat,
        shade:{
          tunic: Math.round(lerp(2, 4, depth)) + (i%2===0?0:1),
          skin:  Math.round(lerp(2, 3, depth)),
          leg:   Math.round(lerp(3, 4, depth)),
          hair:  Math.round(lerp(4, 6, depth)),
        },
      });
    }
  }
  // sort back->front so nearer members overpaint
  members.sort((a,b)=>a.depth-b.depth || a.baseY-b.baseY);
  return { members, terror, wave, lag, attention, exitSide,
           showZeus:p.showZeus, showExit:p.showExit, showRays:p.showRays,
           zeus:{ x:W*0.5, y:H*0.15, s:W*0.06 },
           exit:{ x: exitSide>0 ? W*0.90 : W*0.10, ground:H*p.groundY,
                  w:W*0.11, h:H*0.34 } };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);

  // faint deck / hold-floor rules under the crew
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.20;
  for (let k=0;k<=3;k++){ const y=H*(0.55+k*0.11); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // the SEALED EXIT at the side (drawn before the crew so they read in front)
  if (B.showExit) drawSealedExit(pen, B.exit.x, B.exit.ground, B.exit.w, B.exit.h, B.exitSide);

  // Zeus / the wrath overhead
  if (B.showZeus) drawZeus(pen, B.zeus.x, B.zeus.y, B.zeus.s, B.attention);

  // faint attention RAYS from Zeus down into the ranks (the upward pull)
  if (B.showRays && B.attention>0.05){
    g.strokeStyle=INK; g.lineCap="round";
    for (let i=0;i<7;i++){
      const fx = lerp(W*0.16, W*0.84, i/6);
      g.globalAlpha = 0.09*B.attention; g.lineWidth = 2;
      g.beginPath(); g.moveTo(B.zeus.x, B.zeus.y+B.zeus.s*0.6); g.lineTo(fx, H*0.55); g.stroke();
    }
    g.globalAlpha=1;
  }

  // the DREAD WAVE FRONT — a faint marker sweeping the crew
  {
    const wx = lerp(W*0.06, W*0.94, B.wave);
    g.strokeStyle=ACCENT; g.globalAlpha=0.26; g.lineWidth=Math.max(2,W*0.006);
    g.setLineDash([W*0.012, W*0.02]);
    g.beginPath(); g.moveTo(wx, H*0.36); g.lineTo(wx, H*0.92); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
  }

  // members, back -> front
  const heads = B.members.map(m => drawSailor(pen, m));

  // stifled-cry marks: little pressed jitter over the most terrified stiflers
  g.strokeStyle=INK; g.lineCap="round";
  heads.forEach(h=>{ if (h.armMode==="stifle" && h.act>0.5){
    g.globalAlpha=0.30*h.act;
    for (let q=1;q<=2;q++){ g.lineWidth=1.5; g.beginPath();
      g.arc(h.head.x, h.head.y+h.r*0.5, h.r*0.4*q, 0.5, 2.6); g.stroke(); }
  }});
  g.globalAlpha=1;
}

export const asset = {
  id:"ensemble.terrified-sailors",
  type:"ENSEMBLE",
  name:"Terrified sailors",
  statusWord:"TERRIFIED",
  scene:"OD-B09-S07",

  params,
  // back -> front draw order the ensemble honors
  layers:["floor","exit","zeus","rays","wave-front","back-row","mid-row","front-row","overlay"],
  // normalized 0..1 anchors: the wrath source, the sealed exit, wave poles, handles
  anchors:{
    "zeus:overhead":{x:.50,y:.15}, "exit:sealed":{x:.90,y:.72},
    "wave:start":{x:.06,y:.66}, "wave:end":{x:.94,y:.66},
    "huddle:center":{x:.46,y:.72}, "row:back":{x:.50,y:.52}, "row:front":{x:.50,y:.86},
    "camera:wide":{x:.50,y:.54},
  },
  zones:{ crowd:{ x0:.06,y0:.48,x1:.84,y1:.94 }, exitZone:{ x0:.82,y0:.56,x1:.98,y1:.94 } },
  states:{
    initial:"frozen",
    nodes:{
      // the whole crew locked in dread, hands up, cries stifled, eyes on the exit
      frozen:  { preview:{ terror:0.9, wave:1.0, waveLag:0.3, attention:0.85, status:"FROZEN" } },
      // the dread front mid-sweep across the ranks
      recoiling:{ preview:{ terror:0.8, wave:0.55, waveLag:0.8, attention:0.7, status:"RECOILING" } },
      // hands flung high to Zeus, the collective plea
      hailing: { preview:{ terror:0.95, wave:1.0, waveLag:0.2, attention:1.0, status:"BESEECHING" } },
      // eyes locked on the barred door
      eyeing:  { preview:{ terror:0.7, wave:1.0, waveLag:0.4, attention:0.4, status:"TRAPPED" } },
    },
    edges:[
      ["recoiling","frozen"],["frozen","hailing"],["frozen","eyeing"],
      ["hailing","frozen"],["eyeing","frozen"],
    ],
  },
  channels:["terror","wave","waveLag","attention","formation","density","depth"],

  // neutral preview = the frozen tableau: recoiling, hands to Zeus, tracking the exit
  preview:()=>({ terror:0.9, wave:1.0, waveLag:0.3, attention:0.85, formation:"recoil-cluster",
                 status:"TERRIFIED", progress:0.5 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
