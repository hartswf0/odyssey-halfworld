/* ensemble.restored-crew — the crew turned back from swine to renewed men.
   ENSEMBLE asset. Scene function (OD-B10-S07): Odysseus' companions, held as
   pigs in Circe's sty, are anointed back into human shape — and rise TALLER,
   YOUNGER, and handsomer than before — then feast in the hall for a whole year.
   Built from ONE separable member template (drawMember) whose silhouette MORPHS
   continuously along a single scalar `r` (restore): r=0 is a low four-legged
   swine (barrel body, snout, curly tail, bristled hide); r=1 is an upright
   renewed young man (vertical torso, tunic, bare pale skin, joyful face, arms
   that were forelegs now lifted). Instanced N times deterministically.

   Channels:
     · the pig->human TRANSITION channel: `restore` (global progress) + `wave`
       (how wide the transition spreads across the line, so a restoration-line
       shows the whole spectrum pig->man left-to-right at once).
     · JOY (0 spent .. 1 arms up, broad smiles) and ATTENTION (heads lean to a
       shared focus — Circe / the hearth).
   Two formations: `restoration-line` (a procession mid-change) and `feast`
   (renewed men behind a long board, cups raised, the year-cycle marked above).
   Drawn in SOLID grays + hard contour; the engine dotify pass supplies the
   halftone. No named hero is baked in — anonymous restored companions. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

const params = {
  formation:"restoration-line", // restoration-line | feast
  count:6,                       // members along the line / seats at the board
  restore:0.5,                   // 0 = all swine .. 1 = all renewed men
  wave:0.62,                     // spatial spread of the transition across the line
  joy:0.55,                      // 0 spent/blank .. 1 arms lifted, broad smiles
  attention:0.6,                 // heads lean toward the shared focus (Circe/hearth)
  density:1.0,                   // 0 front rank only .. 1 add the back rank
  focus:0.5,                     // shared focus x (0..1) the heads attend to
  showCycle:true,                // the year-cycle season arc above (they feast a year)
  showPen:true,                  // the sty gate at left (pigs emerge) — line only
  showHall:true,                 // Circe's hall arch at right (renewed exit) — line only
  groundY:0.71,                  // front footline as fraction of H
};

/* ============================================================
   MEMBER TEMPLATE — one companion, MORPHED along r (restore).
   m = { cx, footY, s, r, joy, flip, lvlSkin, lvlTunic, seed, showCup,
         seated, attn, focusX }.  All px except r/joy/attn in 0..1.
   The whole silhouette is a continuous lerp between a swine (r=0) and a
   renewed man (r=1): posture rises, snout retracts, tail/ears fade, tunic +
   hair fade in, forelegs lift into arms.
   ============================================================ */
function drawMember(pen, g, m){
  const R    = clamp01(m.r);
  const rise = smooth(R);
  const joy  = clamp01(m.joy);
  const F    = m.flip;                 // facing dir: +1 = toward renewal (right)
  const s    = m.s;
  const cw   = Math.max(2, s*0.020);
  const rng  = rnd(m.seed);
  const jit  = (rng()-0.5)*s*0.03;

  // blended tones: swine hide/snout -> renewed pale skin + tunic
  const skinLvl = Math.round(lerp(3.8, m.lvlSkin, rise));
  const tunLvl  = m.lvlTunic;
  const skinT   = toneSolid(inkLevel(skinLvl));
  const snoutT  = toneSolid(inkLevel(Math.round(lerp(4.6, 3, rise))));
  const tunT    = toneSolid(inkLevel(tunLvl));
  const hairT   = toneSolid(inkLevel(6));
  const legT    = toneSolid(inkLevel(Math.round(lerp(5, 3, rise))));

  // ---- skeleton points: hip (rear) -> shoulder (front) barrel/torso vector ----
  const footY  = m.footY;
  const hipY   = footY - s*lerp(0.20, 0.46, rise);
  const hipX   = m.cx - F*s*lerp(0.15, 0.0, rise) + jit;
  const bodyLen= s*lerp(0.42, 0.34, rise);
  const ang    = lerp(80, 6, rise) * Math.PI/180;     // from vertical: near-horizontal -> upright
  const shX    = hipX + Math.sin(ang)*F*bodyLen;
  const shY    = hipY - Math.cos(ang)*bodyLen;

  const headR  = s*lerp(0.115, 0.140, rise);
  const headFwd= lerp(s*0.16, 0, rise);
  const headUp = lerp(s*0.02, headR*1.12, rise);
  const attn   = clamp01(m.attn)*(m.focusX!=null?1:0);
  const attShift = m.focusX!=null ? (m.focusX - m.cx)*0.05*attn : 0;
  const hX     = shX + F*headFwd + attShift;
  const hY     = shY - headUp;

  // ---- ground shadow ----
  g.fillStyle = "rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(m.cx, footY+s*0.010, s*lerp(0.34,0.20,rise), s*0.034, 0,0,7); g.fill();

  // ---- curly SWINE TAIL at the hind (fades as it renews) ----
  if (R < 0.85){
    const tx = hipX - F*s*0.06, ty = hipY - s*0.02, c = 1-R;
    pen.ink(()=>{
      g.moveTo(tx, ty);
      g.quadraticCurveTo(tx - F*s*0.11, ty - s*0.06, tx - F*s*0.02, ty - s*0.11*c);
      g.quadraticCurveTo(tx + F*s*0.07, ty - s*0.15, tx - F*s*0.03, ty - s*0.19*c);
    }, cw*0.9);
  }

  // ---- HIND legs (two): stubby trotters -> standing legs ----
  for (const side of [-1, 1]){
    const lx = hipX + side*s*0.07;
    const ankX = lx + side*s*lerp(0.015, 0.030, rise) - F*lerp(s*0.02,0,rise);
    pen.limb(()=>{ g.moveTo(lx, hipY); g.lineTo(ankX, footY); }, legT, s*lerp(0.050,0.055,rise));
    // hoof (swine) -> foot
    pen.paint(()=>{ g.ellipse(ankX + F*s*0.006, footY, s*lerp(0.045,0.052,rise), s*0.020, 0,0,7); },
              toneSolid(inkLevel(6)), cw*0.7);
  }

  // ---- BARREL / TORSO (capsule between hip and shoulder) ----
  pen.limb(()=>{ g.moveTo(hipX, hipY); g.lineTo(shX, shY); }, skinLvl>=4?snoutT:skinT, s*lerp(0.27, 0.22, rise));
  // bristled back ridge (swine) fades out
  if (R < 0.6){
    g.strokeStyle=INK; g.globalAlpha=0.5*(1-R/0.6); g.lineWidth=Math.max(1.5,s*0.012); g.lineCap="round";
    for (let k=0;k<5;k++){
      const t=k/4, bx=lerp(hipX,shX,t), by=lerp(hipY,shY,t)-s*0.11;
      g.beginPath(); g.moveTo(bx,by); g.lineTo(bx - F*s*0.006, by - s*0.045); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- renewed TUNIC over the torso (fades in only when mostly upright) ----
  if (rise > 0.55){
    const tw = s*0.30, hw = s*0.34;
    pen.paint(()=>{
      g.moveTo(shX - tw*0.5, shY - s*0.01);
      g.lineTo(shX + tw*0.5, shY - s*0.01);
      g.lineTo(hipX + hw*0.5, hipY + s*0.02);
      g.lineTo(hipX - hw*0.5, hipY + s*0.02);
      g.closePath();
    }, tunT, cw);
    pen.seam(()=>{ g.moveTo(hipX - hw*0.42, hipY - s*0.03); g.lineTo(hipX + hw*0.42, hipY - s*0.03); }, cw*0.7);
    pen.seam(()=>{ g.moveTo(shX, shY + s*0.02); g.lineTo(hipX, hipY); }, cw*0.55);
  }

  // ---- HEAD: snouted swine skull -> round renewed face ----
  const snout = lerp(s*0.16, 0, rise);
  pen.paint(()=>{ g.ellipse(hX, hY, headR*lerp(0.98,0.90,rise), headR*lerp(0.78,1.0,rise), 0,0,7); }, skinT, cw);
  if (snout > s*0.01){
    pen.paint(()=>{ g.ellipse(hX + F*(headR*0.68 + snout*0.4), hY + headR*0.16, snout*0.55 + headR*0.22, headR*0.40, 0,0,7); }, snoutT, cw*0.9);
    g.fillStyle=INK;
    g.beginPath(); g.arc(hX + F*(headR*0.66+snout*0.62), hY + headR*0.02, Math.max(1.4,s*0.011), 0,7); g.fill();
    g.beginPath(); g.arc(hX + F*(headR*0.66+snout*0.62), hY + headR*0.30, Math.max(1.4,s*0.011), 0,7); g.fill();
  }
  // pointed swine EARS (fade), then human HAIR cap
  if (rise < 0.7){
    const eo = 1 - rise;
    pen.paint(()=>{ g.moveTo(hX-headR*0.30, hY-headR*0.55); g.lineTo(hX-headR*0.58, hY-headR*(0.9+0.5*eo)); g.lineTo(hX+headR*0.02, hY-headR*0.66); g.closePath(); }, skinT, cw*0.8);
    pen.paint(()=>{ g.moveTo(hX+headR*0.30, hY-headR*0.55); g.lineTo(hX+headR*0.58, hY-headR*(0.9+0.5*eo)); g.lineTo(hX-headR*0.02, hY-headR*0.66); g.closePath(); }, skinT, cw*0.8);
  }
  if (rise > 0.5){
    pen.paint(()=>{
      g.moveTo(hX-headR*0.98, hY);
      g.quadraticCurveTo(hX, hY-headR*1.48, hX+headR*0.98, hY);
      g.quadraticCurveTo(hX+headR*0.58, hY-headR*0.55, hX, hY-headR*0.5);
      g.quadraticCurveTo(hX-headR*0.58, hY-headR*0.55, hX-headR*0.98, hY);
    }, hairT, cw*0.8);
  }

  // ---- FACE ----
  const eyeY = hY - headR*0.10;
  const edx  = headR*0.36*lerp(0.7,1,rise);
  g.fillStyle=INK;
  g.beginPath(); g.arc(hX-edx, eyeY, headR*0.10, 0,7); g.fill();
  g.beginPath(); g.arc(hX+edx, eyeY, headR*0.10, 0,7); g.fill();
  if (rise > 0.55){
    g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.12); g.lineCap="round";
    g.beginPath(); g.moveTo(hX-edx-headR*0.12, eyeY-headR*0.28); g.lineTo(hX-edx+headR*0.12, eyeY-headR*0.30); g.stroke();
    g.beginPath(); g.moveTo(hX+edx-headR*0.12, eyeY-headR*0.30); g.lineTo(hX+edx+headR*0.12, eyeY-headR*0.28); g.stroke();
    // renewed smile (opens with joy)
    const my = hY + headR*0.46, sm = 0.10 + joy*0.30;
    g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.11);
    g.beginPath(); g.moveTo(hX-headR*0.28, my); g.quadraticCurveTo(hX, my+headR*sm*2, hX+headR*0.28, my); g.stroke();
  }

  // ---- FRONT limbs: forelegs -> lifted arms (drawn over the body) ----
  const raise = 0.30 + 0.70*joy;
  for (const side of [-1, 1]){
    const shoX = shX + side*s*0.06, shoY = shY + s*0.015;
    const groundW = { x: shX + F*s*0.12 + side*s*0.03, y: footY };                 // r=0: foreleg to ground
    const armW    = { x: shX + side*s*(0.17+0.08*joy) + F*s*0.02, y: shY - s*(0.01+0.13*raise) }; // r=1: arm out, chest-high
    const wr = { x: lerp(groundW.x, armW.x, rise), y: lerp(groundW.y, armW.y, rise) };
    const el = { x:(shoX+wr.x)/2 + F*s*0.02*(1-rise), y:(shoY+wr.y)/2 + s*0.03*(1-0.6*rise) };
    const limbTone = rise>0.6 ? skinT : legT;
    pen.limb(()=>{ g.moveTo(shoX,shoY); g.lineTo(el.x,el.y); }, limbTone, s*lerp(0.050,0.045,rise));
    pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(wr.x,wr.y); }, limbTone, s*lerp(0.045,0.040,rise));
    if (rise>0.6) pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skinT, cw*0.7);
    else pen.paint(()=>{ g.ellipse(wr.x,wr.y,s*0.040,s*0.020,0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
    // a lifted cup at the feast (near hand)
    if (m.showCup && side===F && rise>0.6){
      pen.paint(()=>{
        g.moveTo(wr.x-s*0.032, wr.y-s*0.028); g.lineTo(wr.x+s*0.032, wr.y-s*0.028);
        g.lineTo(wr.x+s*0.020, wr.y+s*0.028); g.lineTo(wr.x-s*0.020, wr.y+s*0.028); g.closePath();
      }, toneSolid(inkLevel(5)), cw*0.7);
    }
  }

  return { head:{x:hX,y:hY}, r:R, headR };
}

/* ---- a low sty GATE at left where the swine emerge (line formation) ---- */
function drawPenGate(pen, g, x, groundY, s){
  const postT = toneSolid(inkLevel(3)), barT = toneSolid(inkLevel(2));
  pen.paint(()=>{ g.rect(x-s*0.06, groundY-s*0.52, s*0.06, s*0.52); }, postT, Math.max(2,s*0.02));
  pen.paint(()=>{ g.rect(x+s*0.24, groundY-s*0.52, s*0.06, s*0.52); }, postT, Math.max(2,s*0.02));
  for (let k=1;k<=3;k++){ const y=groundY-s*0.52*(k/3.4); pen.paint(()=>{ g.rect(x-s*0.06, y, s*0.36, s*0.045); }, barT, Math.max(2,s*0.014)); }
}
/* ---- Circe's hall ARCH at right where the renewed men pass in (line) ---- */
function drawHallArch(pen, g, x, groundY, s){
  const wallT = toneSolid(inkLevel(2)), darkT = toneSolid(inkLevel(4));
  pen.paint(()=>{ g.rect(x-s*0.02, groundY-s*0.70, s*0.40, s*0.70); }, wallT, Math.max(2,s*0.02));
  pen.paint(()=>{
    g.moveTo(x+s*0.08, groundY); g.lineTo(x+s*0.08, groundY-s*0.42);
    g.quadraticCurveTo(x+s*0.18, groundY-s*0.62, x+s*0.30, groundY-s*0.42);
    g.lineTo(x+s*0.30, groundY); g.closePath();
  }, darkT, Math.max(2,s*0.02));
}
/* ---- the long feast BOARD (occludes seated legs), with a hearth glyph ---- */
function drawFeastBoard(pen, g, W, H, boardY){
  const topT=toneSolid(inkLevel(4)), legTn=toneSolid(inkLevel(5));
  const x0=W*0.06, x1=W*0.94;
  pen.paint(()=>{ g.rect(x0, boardY, x1-x0, H*0.10); }, topT, Math.max(3,W*0.004));
  pen.seam(()=>{ g.moveTo(x0, boardY+H*0.02); g.lineTo(x1, boardY+H*0.02); }, Math.max(2,W*0.002));
  pen.paint(()=>{ g.rect(x0+W*0.03, boardY+H*0.10, W*0.03, H*0.10); }, legTn, Math.max(3,W*0.004));
  pen.paint(()=>{ g.rect(x1-W*0.06, boardY+H*0.10, W*0.03, H*0.10); }, legTn, Math.max(3,W*0.004));
  // platters along the board
  for (let k=0;k<6;k++){ const px=lerp(x0+W*0.06,x1-W*0.06,k/5); pen.paint(()=>{ g.ellipse(px, boardY+H*0.03, W*0.026, H*0.010, 0,0,7); }, toneSolid(inkLevel(2)), Math.max(2,W*0.002)); }
}

/* ---- the YEAR-CYCLE arc above: sun + season ticks (they feast a full year) ---- */
function drawYearCycle(pen, g, W, H, strength){
  const cx=W*0.5, cy=H*0.30, rx=W*0.40, ry=H*0.20;
  g.strokeStyle=INK; g.globalAlpha=0.16*strength; g.lineWidth=Math.max(1.5,W*0.002);
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, Math.PI*1.02, Math.PI*1.98); g.stroke();
  g.globalAlpha=1;
  for (let k=0;k<12;k++){
    const a = Math.PI*1.04 + (Math.PI*0.92)*(k/11);
    const px = cx+Math.cos(a)*rx, py = cy+Math.sin(a)*ry;
    g.fillStyle = k===0 ? ACCENT : INK; g.globalAlpha = k===0?0.9:0.28*strength;
    g.beginPath(); g.arc(px, py, Math.max(2,W*(k%3===0?0.004:0.0026)), 0,7); g.fill();
  }
  g.globalAlpha=1;
  // a small sun at the arc's crown
  g.fillStyle=ACCENT; g.globalAlpha=0.9;
  g.beginPath(); g.arc(cx, cy-ry, Math.max(4,W*0.010), 0,7); g.fill();
  g.strokeStyle=ACCENT; g.lineWidth=Math.max(2,W*0.003);
  for (let k=0;k<8;k++){ const a=k/8*Math.PI*2; g.beginPath(); g.moveTo(cx+Math.cos(a)*W*0.016, cy-ry+Math.sin(a)*W*0.016); g.lineTo(cx+Math.cos(a)*W*0.024, cy-ry+Math.sin(a)*W*0.024); g.stroke(); }
  g.globalAlpha=1;
}

/* ---- build the restoration-LINE deterministically (spatial transition) ---- */
function buildLine(W, H, st){
  const p = { ...params, ...st };
  const restore = clamp01(p.restore), wave = clamp01(p.wave);
  const joy = clamp01(p.joy), attn = clamp01(p.attention);
  const n = Math.max(2, p.count|0);
  const focusX = p.focus*W;
  const BANDS = [ { y:0.485, s:154, tun:3, lvl:2, dx:0.05 },   // back rank (higher, smaller)
                  { y:p.groundY, s:220, tun:4, lvl:2, dx:0.0 } ]; // front rank
  const ranks = (p.density>=1) ? BANDS : [BANDS[1]];
  const members=[];
  ranks.forEach((b, bi)=>{
    const cnt = bi===0 ? n-1 : n;
    for (let i=0;i<cnt;i++){
      const posFrac = cnt>1 ? i/(cnt-1) : 0.5;
      const r = clamp01(lerp(restore-wave, restore+wave, posFrac));
      const cx = lerp(W*0.14, W*0.88, posFrac) + (bi===0? W*0.06 : 0);
      members.push({
        cx, footY:b.y*H, s:b.s, r,
        joy: joy*smooth(r),                 // only the renewed are joyful
        flip:+1,                            // procession faces toward renewal (right)
        lvlSkin:b.lvl, lvlTunic:b.tun,
        seed: 4100 + bi*300 + i*47,
        showCup:false, attn, focusX,
      });
    }
  });
  members.sort((a,b)=> a.footY - b.footY);
  return { members, restore, wave };
}

/* ---- build the FEAST: renewed men behind a board, cups up ---- */
function buildFeast(W, H, st){
  const p = { ...params, ...st };
  const joy = clamp01(p.joy), attn = clamp01(p.attention);
  const n = Math.max(2, p.count|0);
  const focusX = p.focus*W;
  const seatY = 0.70*H;         // members' footline (legs hidden by the board)
  const members=[];
  for (let i=0;i<n;i++){
    const posFrac = n>1 ? i/(n-1) : 0.5;
    const cx = lerp(W*0.12, W*0.88, posFrac);
    members.push({
      cx, footY:seatY, s:206, r:1,
      joy: clamp01(joy + ((i%2)?0.05:-0.03)),
      flip: cx < W*0.5 ? +1 : -1,           // inner-facing toward the hearth centre
      lvlSkin:2, lvlTunic: 3 + (i%2),
      seed: 5200 + i*53,
      showCup:true, seated:true, attn, focusX,
    });
  }
  members.sort((a,b)=> a.cx - b.cx);
  return { members, boardY:0.70*H };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const p = { ...params, ...st };
  const groundY = p.groundY*H;

  // ---- FIELD: pale ground + faint floor rules ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  g.fillStyle = inkLevel(2); g.fillRect(0, groundY, W, H-groundY);
  g.strokeStyle=INK; g.globalAlpha=0.14; g.lineWidth=2;
  for (let k=0;k<=3;k++){ const y=groundY + (H-groundY)*(k/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // ---- the year-cycle arc above (they feast a full year) ----
  if (p.showCycle) drawYearCycle(pen, g, W, H, p.formation==="feast"?1.0:0.6);

  if (p.formation === "feast"){
    const B = buildFeast(W, H, st);
    // members first, then the board occludes their lower bodies
    for (const m of B.members) drawMember(pen, g, m);
    drawFeastBoard(pen, g, W, H, B.boardY);
    // re-draw cups/heads? board sits in front of legs only (boardY below heads) — heads stay visible
    // a hearth glyph at centre-back
    const hx=W*0.5, hy=groundY-H*0.02;
    pen.paint(()=>{ g.rect(hx-W*0.05, hy-H*0.03, W*0.10, H*0.04); }, toneSolid(inkLevel(5)), Math.max(3,W*0.004));
    g.fillStyle=ACCENT;
    for (let k=-1;k<=1;k++){ g.beginPath(); g.moveTo(hx+k*W*0.02, hy-H*0.03); g.quadraticCurveTo(hx+k*W*0.02+W*0.01, hy-H*0.07, hx+k*W*0.02, hy-H*0.09); g.lineTo(hx+k*W*0.02-W*0.008, hy-H*0.05); g.closePath(); g.fill(); }
  } else {
    const L = buildLine(W, H, st);
    // the sty gate (pigs emerge) at left, Circe's hall arch (renewed pass in) at right
    if (p.showPen)  drawPenGate(pen, g, W*0.035, groundY, 160);
    if (p.showHall) drawHallArch(pen, g, W*0.905, groundY, 150);
    // faint blue transition arrows above the mid-change members (the restoration channel)
    for (const m of L.members){
      if (m.r>0.20 && m.r<0.85){
        const ax=m.cx, ay=m.footY - m.s*0.62, mag=1-Math.abs(m.r-0.5)*2;
        g.strokeStyle=ACCENT; g.globalAlpha=0.30+0.35*mag; g.lineWidth=Math.max(2,W*0.003);
        g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax, ay - m.s*0.16); g.stroke();
        g.beginPath(); g.moveTo(ax - m.s*0.04, ay - m.s*0.10); g.lineTo(ax, ay - m.s*0.16); g.lineTo(ax + m.s*0.04, ay - m.s*0.10); g.stroke();
        g.globalAlpha=1;
      }
    }
    // the crew, painted far -> near
    for (const m of L.members) drawMember(pen, g, m);
  }
}

export const asset = {
  id:"ensemble.restored-crew",
  type:"ENSEMBLE",
  name:"Restored crew",
  statusWord:"RENEWED",
  scene:"OD-B10-S07",

  params,
  // ONE separable member template morphed along `restore`, instanced N times
  member:{ template:"drawMember", morph:"restore", count:params.count, formations:["restoration-line","feast"] },
  // back -> front draw order the ensemble honors
  layers:["ground","year-cycle","pen-gate","hall-arch","transition-arrows","back-rank","front-rank","feast-board","hearth"],
  // normalized 0..1 anchors: the sty, the hall, the line ends, the board + hearth
  anchors:{
    "sty:gate":{x:.07,y:.82}, "hall:arch":{x:.90,y:.80},
    "line:swine-end":{x:.16,y:.86}, "line:renewed-end":{x:.86,y:.86},
    "rank:back":{x:.50,y:.665}, "rank:front":{x:.50,y:.86},
    "board:centre":{x:.50,y:.70}, "hearth:fire":{x:.50,y:.84},
    "focus:circe":{x:.50,y:.50}, "cycle:sun":{x:.50,y:.10},
    "camera:wide":{x:.50,y:.56}, "camera:line":{x:.50,y:.78},
  },
  // walkable ground the procession moves along
  zones:{ ground:{ x0:.05,y0:.62,x1:.95,y1:.96 }, board:{ x0:.06,y0:.66,x1:.94,y1:.80 } },
  channels:["formation","restore","wave","joy","attention","density"],
  states:{
    initial:"restoring",
    nodes:{
      // still swine, penned — the crew as Circe left them
      swine:{     preview:{ formation:"restoration-line", restore:0.06, wave:0.14, joy:0.0, attention:0.4, status:"SWINE" } },
      // the change running across the line: pig at one end, renewed man at the other
      restoring:{ preview:{ formation:"restoration-line", restore:0.5, wave:0.62, joy:0.5, attention:0.6, status:"RESTORING" } },
      // all upright, taller and younger than before, arms lifting in joy
      renewed:{   preview:{ formation:"restoration-line", restore:1.0, wave:0.10, joy:0.9, attention:0.7, status:"RENEWED" } },
      // the year-long feast in the hall, cups raised, the seasons turning above
      feast:{     preview:{ formation:"feast", restore:1.0, wave:0.0, joy:0.85, attention:0.7, status:"FEASTING" } },
    },
    // the scene arc: swine -> restoring -> renewed -> a year at the feast
    edges:[["swine","restoring"],["restoring","renewed"],["renewed","feast"],["feast","renewed"]],
  },

  // neutral preview = the transition itself, the whole spectrum pig->man across the line
  preview:()=>({ formation:"restoration-line", restore:0.5, wave:0.62, joy:0.55,
                 attention:0.6, density:1.0, status:"RESTORING", progress:0.5 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
