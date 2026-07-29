/* divine_fx.silent-revenge-vow — the unspoken prayer that MARKS a man. DIVINE_FX
   asset. Scene function (OD-B17-S05): the footstool strikes Odysseus's shoulder,
   he does not stagger, and he prays in silence for Antinous's death. Nothing is
   said and nothing visibly happens — so the effect is drawn as an INTERNAL
   TARGET-LOCK: a sighting instrument that exists only inside the beggar's head.

   The diagram reads left -> right:
     SOURCE  (left)   the beggar's head sealed inside a dashed containment ring —
                      mouth barred shut, the speech glyph struck through. The vow
                      is made, and it is made silently.
     FIELD   (middle) a fine dashed BEARING running from the sealed man's eye to
                      the throat of the man across the hall.
     TARGET  (right)  Antinous, cup still in hand, standing unaware inside a
                      RETICLE whose brackets travel inward and shut.
     CONSEQUENCE      the FIRST-ARROW CUE: a heavy dashed shaft with a solid head
                      parked well OUTSIDE the reticle — the arrow that has not been
                      loosed yet — indexed by a seven-segment numeral 1 so the lock
                      is filed against a future shot, not against this moment.
     CLOCK            a short tick strip with one dark window: the vow is BRIEF.

   Narrative / procedural over state.t + lock, cue, silence:
     SOURCE   (lock low,  cue 0)   — brackets wide, sightline faint, nothing filed.
     TARGET   (lock mid,  cue 0)   — the reticle finds the throat, brackets close in.
     FIELD    (lock full, cue mid) — the lock shuts; the arrow cue begins to form.
     TRANSFORM(lock full, cue full)— the first-arrow cue is attached and indexed. MARKED.
   `lock`   : how far the reticle brackets have travelled in and shut.
   `cue`    : how fully the future first arrow is drawn onto the bearing.
   `silence`: how hard the mouth is barred / the speech glyph struck out.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. Bodies are kept on
   the LIGHT levels (2-4) so the black instrument drawn over them keeps its bite,
   the paper around the diagram is left empty, and no span crosses the full frame. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  srcX:      0.145,  // the sealed man (SOURCE) head centre, frac of W
  srcY:      0.630,  // ... frac of H
  eyeX:      0.205,  // where the bearing departs (his open eye), frac of W
  eyeY:      0.608,
  tgtX:      0.625,  // Antinous (TARGET) centre line, frac of W
  footY:     0.815,  // his standing line, frac of H
  lockX:     0.625,  // reticle centre = his throat
  lockY:     0.352,
  ringR:     0.195,  // reticle radius, frac of W
  bracket:   1.18,   // shut-bracket radius as a multiple of ringR
  standoff:  1.62,   // arrow-head radius as a multiple of ringR (it has NOT landed)
  ticks:     24,     // range ticks around the reticle band
  indexX:    0.300,  // first-arrow index plate centre, frac of W
  indexY:    0.755,
  clockX0:   0.440,  // brief-duration tick strip (top right), frac of W
  clockX1:   0.900,
  clockY:    0.140,
  lock:      1.0,
  cue:       1.0,
  silence:   1.0,
};

/* ---- geom(): the two ends of the vow and the unit vector between them. Every
   piece of the instrument resolves off this one line, so the sightline, the arrow
   cue and the reticle can never disagree about where the shot goes. ---- */
function geom(W,H){
  const S = { x:W*params.eyeX,  y:H*params.eyeY  };
  const C = { x:W*params.lockX, y:H*params.lockY };
  const dx = C.x-S.x, dy = C.y-S.y, L = Math.hypot(dx,dy)||1;
  return { S, C, L, ux:dx/L, uy:dy/L, R:W*params.ringR, nx:-dy/L, ny:dx/L };
}
const along = (G,u)=>({ x:G.S.x+G.ux*G.L*u, y:G.S.y+G.uy*G.L*u });

/* ---- FIELD: nothing but a pale disc of attention behind the reticle. The rest of
   the sheet stays paper — this happens inside a man's head, not in a room, so there
   is no ground plane to fill and no horizon to blacken. ---- */
function drawField(g,W,H){
  const G = geom(W,H);
  g.fillStyle = inkLevel(1);
  g.beginPath(); g.ellipse(G.C.x, G.C.y+H*0.048, W*0.288, W*0.308, 0, 0, TAU); g.fill();
}

/* ---- the standing line under the TARGET. Deliberately BROKEN: a short light
   plinth under his feet plus two detached dashes — never a bar across the frame. -- */
function drawStand(pen,g,W,H){
  const fy = H*params.footY, cx = W*params.tgtX;
  pen.paint(()=>{ g.rect(cx-W*0.145, fy, W*0.290, H*0.019); }, toneSolid(inkLevel(2)), 4);
  pen.ink(()=>{ g.moveTo(cx-W*0.145, fy); g.lineTo(cx+W*0.145, fy); }, 4);
  g.strokeStyle = inkLevel(4); g.lineWidth = 5; g.lineCap = "butt";
  g.beginPath(); g.moveTo(cx-W*0.300, fy+H*0.012); g.lineTo(cx-W*0.212, fy+H*0.012); g.stroke();
  g.beginPath(); g.moveTo(cx+W*0.192, fy+H*0.012); g.lineTo(cx+W*0.280, fy+H*0.012); g.stroke();
}

/* ---- TARGET: Antinous. A light blocky performer — robe plane at level 3, flesh at
   4 — so the black reticle over him keeps its bite instead of sinking into a dark
   body. Cup still raised: he is mid-feast and has no idea he has been filed. ---- */
function drawTarget(pen,g,W,H,t){
  const cx = W*params.tgtX, fy = H*params.footY;
  const shY = H*0.372, waistY = H*0.560, hemY = H*0.668;
  const shW = W*0.150, waistW = W*0.102;
  const headCy = H*0.248, hrx = W*0.055, hry = H*0.046;
  const robe = toneSolid(inkLevel(3));
  const flesh = toneSolid(inkLevel(4));
  const breath = Math.sin(t*1.1)*H*0.0022;

  // contact shadow
  g.fillStyle = "rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, fy+2, W*0.108, H*0.012, 0, 0, TAU); g.fill();

  // legs below the hem
  for(const s of [-1,1]){
    pen.limb(()=>{ g.moveTo(cx+s*W*0.036, hemY-H*0.008); g.lineTo(cx+s*W*0.044, fy-H*0.006); },
             flesh, W*0.034);
    pen.paint(()=>{ g.ellipse(cx+s*W*0.048, fy-H*0.002, W*0.038, H*0.010, 0, 0, TAU); },
              toneSolid(inkLevel(5)), 3);
  }
  // robe: shoulders -> waist -> hem, one light plane
  pen.paint(()=>{
    g.moveTo(cx-shW/2, shY+breath); g.lineTo(cx+shW/2, shY+breath);
    g.lineTo(cx+waistW/2, waistY);  g.lineTo(cx+waistW*0.60, hemY);
    g.lineTo(cx-waistW*0.60, hemY); g.lineTo(cx-waistW/2, waistY);
    g.closePath();
  }, robe, 5);
  // belt + two short hem folds
  pen.seam(()=>{ g.moveTo(cx-waistW*0.50, waistY); g.lineTo(cx+waistW*0.50, waistY); }, 4);
  pen.seam(()=>{ g.moveTo(cx-waistW*0.18, waistY+H*0.014); g.lineTo(cx-waistW*0.26, hemY-H*0.008); }, 2);
  pen.seam(()=>{ g.moveTo(cx+waistW*0.22, waistY+H*0.014); g.lineTo(cx+waistW*0.30, hemY-H*0.008); }, 2);

  // far arm slack at his side
  pen.limb(()=>{ g.moveTo(cx-shW*0.42, shY+H*0.014); g.lineTo(cx-shW*0.60, H*0.505); },
           flesh, W*0.028);
  // near arm bent, holding the cup out to his right, clear of the crosshair
  const el = { x:cx+shW*0.62, y:H*0.505 }, wr = { x:cx+shW*0.86, y:H*0.440 };
  pen.limb(()=>{ g.moveTo(cx+shW*0.42, shY+H*0.014); g.lineTo(el.x,el.y); }, flesh, W*0.028);
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(wr.x,wr.y); }, flesh, W*0.024);
  // the kylix — shallow bowl, stem, foot
  const bw = W*0.036;
  pen.paint(()=>{
    g.moveTo(wr.x-bw, wr.y-H*0.030); g.lineTo(wr.x+bw, wr.y-H*0.030);
    g.lineTo(wr.x+bw*0.42, wr.y-H*0.006); g.lineTo(wr.x-bw*0.42, wr.y-H*0.006);
    g.closePath();
  }, toneSolid(inkLevel(2)), 4);
  pen.ink(()=>{ g.moveTo(wr.x-bw*0.80, wr.y-H*0.026); g.lineTo(wr.x+bw*0.80, wr.y-H*0.026); }, 3);
  pen.ink(()=>{ g.moveTo(wr.x, wr.y-H*0.006); g.lineTo(wr.x, wr.y+H*0.008); }, 5);
  pen.paint(()=>{ g.ellipse(wr.x, wr.y+H*0.011, W*0.020, H*0.006, 0, 0, TAU); },
            toneSolid(inkLevel(4)), 3);

  // neck + head, turned away from the source — he is looking off to his right
  pen.limb(()=>{ g.moveTo(cx, shY+breath); g.lineTo(cx, headCy+hry*0.7); }, flesh, W*0.036);
  pen.paint(()=>{ g.ellipse(cx, headCy, hrx, hry, 0, 0, TAU); }, flesh, 5);
  // hair cap — a short dark accent on the crown only
  pen.paint(()=>{
    g.moveTo(cx-hrx*1.00, headCy-hry*0.22);
    g.quadraticCurveTo(cx, headCy-hry*1.62, cx+hrx*1.00, headCy-hry*0.22);
    g.quadraticCurveTo(cx, headCy-hry*0.72, cx-hrx*1.00, headCy-hry*0.22);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  // eye + jaw in profile
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(cx+hrx*0.44, headCy+hry*0.04, hrx*0.14, hry*0.11, 0, 0, TAU); g.fill();
  pen.ink(()=>{ g.moveTo(cx+hrx*0.60, headCy+hry*0.34); g.lineTo(cx+hrx*0.92, headCy+hry*0.38); }, 3);
}

/* ---- BEARING: the sightline. One fine dashed run from the sealed man's eye all
   the way through to the throat, with three range ticks laid across it. It is the
   only thing joining the two halves of the sheet, and it stays light — a line of
   intent, not a line of force. ---- */
function drawBearing(g,W,H,t){
  const G = geom(W,H);
  g.save();
  g.strokeStyle = inkLevel(4); g.lineWidth = 3; g.lineCap = "butt";
  g.setLineDash([7,9]); g.lineDashOffset = -(t*8)%16;
  g.beginPath(); g.moveTo(G.S.x,G.S.y); g.lineTo(G.C.x,G.C.y); g.stroke();
  g.setLineDash([]);
  g.strokeStyle = inkLevel(5); g.lineWidth = 3.5;
  for(const u of [0.26,0.55,0.78]){
    const p = along(G,u), k = W*0.015;
    g.beginPath();
    g.moveTo(p.x-G.nx*k, p.y-G.ny*k); g.lineTo(p.x+G.nx*k, p.y+G.ny*k);
    g.stroke();
  }
  g.restore();
}

/* ---- SOURCE: the man who says nothing. His head sits inside a DASHED CONTAINMENT
   RING — the vow never leaves it. Kept on light levels so the two dark marks that
   carry the meaning read: a solid barred MOUTH SLOT, and, just outside the ring
   where the words would have escaped, a speech glyph STRUCK THROUGH. Both grow
   with `silence`. ---- */
function drawSource(pen,g,W,H,t,silence){
  const cx = W*params.srcX, cy = H*params.srcY;
  const hrx = W*0.078, hry = H*0.068;
  const s = smooth(clamp01(silence));

  // containment ring: this stays inside him
  g.save();
  g.strokeStyle = inkLevel(4); g.lineWidth = 3; g.setLineDash([8,8]);
  g.lineDashOffset = (t*6)%16;
  g.beginPath(); g.ellipse(cx, cy-H*0.004, W*0.125, W*0.133, 0, 0, TAU); g.stroke();
  g.setLineDash([]); g.restore();

  // head in profile, facing up-right toward the target
  pen.paint(()=>{ g.ellipse(cx, cy, hrx, hry, 0, 0, TAU); }, toneSolid(inkLevel(3)), 5);
  // hair over the back of the skull only
  pen.paint(()=>{
    g.moveTo(cx-hrx*1.02, cy+hry*0.06);
    g.quadraticCurveTo(cx-hrx*0.92, cy-hry*1.18, cx+hrx*0.10, cy-hry*0.98);
    g.quadraticCurveTo(cx-hrx*0.46, cy-hry*0.62, cx-hrx*0.60, cy+hry*0.28);
    g.closePath();
  }, toneSolid(inkLevel(5)), 3);
  // beard along the jaw, lower left
  pen.paint(()=>{
    g.moveTo(cx-hrx*0.84, cy+hry*0.24);
    g.quadraticCurveTo(cx-hrx*0.30, cy+hry*1.46, cx+hrx*0.34, cy+hry*0.80);
    g.quadraticCurveTo(cx-hrx*0.16, cy+hry*0.78, cx-hrx*0.84, cy+hry*0.24);
    g.closePath();
  }, toneSolid(inkLevel(5)), 3);
  // the open eye the bearing departs from, brow, nose notch
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(cx+hrx*0.40, cy-hry*0.22, hrx*0.14, hry*0.11, 0, 0, TAU); g.fill();
  pen.ink(()=>{ g.moveTo(cx+hrx*0.14, cy-hry*0.52); g.lineTo(cx+hrx*0.68, cy-hry*0.44); }, 4);
  pen.ink(()=>{ g.moveTo(cx+hrx*0.62, cy-hry*0.14); g.lineTo(cx+hrx*0.92, cy+hry*0.12); }, 3);

  // MOUTH BARRED SHUT — a solid slot clamped over the lips
  const mw = hrx*lerp(0.26, 0.58, s), mx = cx+hrx*0.30, my = cy+hry*0.50;
  pen.paint(()=>{ g.rect(mx-mw, my-H*0.008, mw*2, H*0.016); }, toneSolid(inkLevel(7)), 3);
  pen.ink(()=>{ g.moveTo(mx-mw, my+H*0.014); g.lineTo(mx+mw, my+H*0.014); }, 2);

  // the words that never left: a speech glyph outside the ring, struck through
  const gx = cx+W*0.148, gy = cy+H*0.058;
  g.save();
  g.strokeStyle = inkLevel(4); g.lineWidth = 3.5; g.lineCap = "round";
  for(let k=1;k<=2;k++){
    g.beginPath();
    g.arc(gx-W*0.020, gy, W*0.020*k, -Math.PI*0.34, Math.PI*0.34);
    g.stroke();
  }
  g.strokeStyle = INK; g.lineWidth = lerp(3, 7, s);
  const pr = W*0.048, a = -Math.PI*0.28;
  const x0 = gx-Math.cos(a)*pr, y0 = gy-Math.sin(a)*pr;
  const x1 = gx+Math.cos(a)*pr, y1 = gy+Math.sin(a)*pr;
  g.beginPath(); g.moveTo(x0,y0); g.lineTo(lerp(x0,x1,s), lerp(y0,y1,s)); g.stroke();
  g.restore();
}

/* ---- RETICLE: the lock itself. Strokes only — an open ring in four arcs, a band
   of range ticks, a broken crosshair with a gap at the middle, four corner brackets
   that travel in from the margins as `lock` shuts, and one small solid pip exactly
   on the throat. Nothing here is filled, so the instrument prints as hard black
   line over a light body and open paper. ---- */
function drawReticle(pen,g,W,H,t,lock){
  const G = geom(W,H);
  const cx = G.C.x, cy = G.C.y;
  const k = smooth(clamp01(lock));
  const R = G.R * lerp(1.26, 1.00, k);

  g.save();
  // open ring, four arcs
  g.strokeStyle = INK; g.lineWidth = lerp(3, 6, k); g.lineCap = "butt";
  for(let q=0;q<4;q++){
    const a0 = q*Math.PI/2 + 0.22, a1 = (q+1)*Math.PI/2 - 0.22;
    g.beginPath(); g.arc(cx, cy, R, a0, a1); g.stroke();
  }
  // inner ring arrives with the lock
  if (k > 0.25){
    g.strokeStyle = inkLevel(5); g.lineWidth = 2.5;
    g.beginPath(); g.arc(cx, cy, R*0.58, 0, TAU); g.stroke();
  }
  // range ticks inside the band
  g.strokeStyle = INK; g.lineCap = "butt";
  const n = params.ticks;
  for(let i=0;i<n;i++){
    const th = i/n*TAU + 0.03;
    const long = (i%6===0);
    if(!long && k < 0.45) continue;
    const r0 = R*(long?0.80:0.88), r1 = R*0.97;
    g.lineWidth = long ? 4 : 2.5;
    g.beginPath();
    g.moveTo(cx+Math.cos(th)*r0, cy+Math.sin(th)*r0);
    g.lineTo(cx+Math.cos(th)*r1, cy+Math.sin(th)*r1);
    g.stroke();
  }
  // broken crosshair — short stubs, gap at the middle, clear of his face
  g.strokeStyle = INK; g.lineWidth = lerp(3, 5, k); g.lineCap = "round";
  for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){
    g.beginPath();
    g.moveTo(cx+d[0]*R*0.30, cy+d[1]*R*0.30);
    g.lineTo(cx+d[0]*R*0.46, cy+d[1]*R*0.46);
    g.stroke();
  }
  // four corner brackets travelling inward
  const D = G.R * lerp(2.00, params.bracket, k), arm = R*0.28;
  const q = D*Math.SQRT1_2;
  g.lineWidth = lerp(4, 8, k); g.lineJoin = "miter"; g.lineCap = "butt";
  for(const s of [[-1,-1],[1,-1],[-1,1],[1,1]]){
    const bx = cx + s[0]*q, by = cy + s[1]*q;
    g.beginPath();
    g.moveTo(bx, by + s[1]*-arm);
    g.lineTo(bx, by);
    g.lineTo(bx + s[0]*-arm, by);
    g.stroke();
  }
  g.restore();
  // the pip on the throat
  pen.paint(()=>{ g.arc(cx, cy, W*0.013, 0, TAU); }, toneSolid(inkLevel(7)), 3);
  if (k > 0.9) pen.ink(()=>{ g.arc(cx, cy, W*0.030, 0, TAU); }, 3);
}

/* ---- CONSEQUENCE / the FIRST-ARROW CUE: the shaft that has not been shot. A heavy
   dashed shaft lying exactly on the bearing, three fletch strokes at the tail, and a
   SOLID head parked a clear standoff OUTSIDE the reticle brackets. Dashed = future
   tense; solid head = already aimed. Grows with `cue`. ---- */
function drawCue(pen,g,W,H,t,cue){
  const G = geom(W,H);
  const c = smooth(clamp01(cue));
  if (c <= 0.02) return;
  const uHead = 1 - (G.R*params.standoff)/G.L;
  const uTail = 0.06;
  const uNow = lerp(uTail+0.03, uHead, c);
  const tail = along(G,uTail), now = along(G,uNow);

  g.save();
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
  g.setLineDash([13,10]); g.lineDashOffset = -(t*10)%23;
  g.beginPath(); g.moveTo(tail.x,tail.y); g.lineTo(now.x,now.y); g.stroke();
  g.setLineDash([]);
  // fletching at the tail
  g.lineWidth = 4; g.lineCap = "round";
  for(let i=0;i<3;i++){
    const p = { x:tail.x+G.ux*i*W*0.021, y:tail.y+G.uy*i*W*0.021 };
    g.beginPath();
    g.moveTo(p.x-G.nx*W*0.025, p.y-G.ny*W*0.025);
    g.lineTo(p.x+G.nx*W*0.025, p.y+G.ny*W*0.025);
    g.stroke();
  }
  g.restore();
  // solid head, parked short of the lock
  if (c > 0.5){
    const h = along(G,uHead), b = W*0.040;
    pen.paint(()=>{
      g.moveTo(h.x+G.ux*b*1.10, h.y+G.uy*b*1.10);
      g.lineTo(h.x-G.ux*b*0.50-G.nx*b*0.58, h.y-G.uy*b*0.50-G.ny*b*0.58);
      g.lineTo(h.x-G.ux*b*0.50+G.nx*b*0.58, h.y-G.uy*b*0.50+G.ny*b*0.58);
      g.closePath();
    }, toneSolid(inkLevel(7)), 3);
  }
}

/* ---- seven-segment digit drawn as GEOMETRY (bars, never type) so the numeral
   survives the dot lattice. ---- */
const SEG = { // a b c d e f g
  0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
  4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1], 6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
  8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1],
};
function sevenSeg(pen,g,x,y,w,h,d){
  const on = SEG[d] || SEG[8], tk = Math.min(w,h)*0.24;
  const bar = (bx,by,bw,bh)=> pen.paint(()=>{ g.rect(bx,by,bw,bh); }, toneSolid(inkLevel(7)), 2);
  const hx = x+tk*0.55, hw = w-tk*1.10;
  if(on[0]) bar(hx, y, hw, tk);                          // a  top
  if(on[5]) bar(x, y+tk*0.55, tk, h/2-tk*0.85);          // f  upper left
  if(on[1]) bar(x+w-tk, y+tk*0.55, tk, h/2-tk*0.85);     // b  upper right
  if(on[6]) bar(hx, y+h/2-tk/2, hw, tk);                 // g  middle
  if(on[4]) bar(x, y+h/2+tk*0.30, tk, h/2-tk*0.85);      // e  lower left
  if(on[2]) bar(x+w-tk, y+h/2+tk*0.30, tk, h/2-tk*0.85); // c  lower right
  if(on[3]) bar(hx, y+h-tk, hw, tk);                     // d  bottom
}

/* ---- INDEX: the cue is FILED, not fired. A light bracketed plate carrying a solid
   arrow icon and a seven-segment 1 — arrow number one, the shot that opens the
   killing. A dashed leader ties the plate to the fletching of the cue. ---- */
function drawIndex(pen,g,W,H,cue){
  const c = smooth(clamp01(cue));
  if (c <= 0.15) return;
  const cx = W*params.indexX, cy = H*params.indexY;
  const pw = W*0.250, ph = H*0.112;
  const x = cx-pw/2, y = cy-ph/2;
  pen.paint(()=>{ g.rect(x, y, pw, ph); }, toneSolid(inkLevel(1)), 4);
  // corner brackets on the plate
  g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap="butt"; g.lineJoin="miter";
  const a = Math.min(pw,ph)*0.28;
  for(const s of [[-1,-1],[1,-1],[-1,1],[1,1]]){
    const bx = cx + s[0]*pw/2, by = cy + s[1]*ph/2;
    g.beginPath();
    g.moveTo(bx, by - s[1]*a); g.lineTo(bx, by); g.lineTo(bx - s[0]*a, by);
    g.stroke();
  }
  g.restore();
  // arrow icon: nocked shaft + head, on the left of the plate
  const ax = x+pw*0.30, ay = cy;
  g.save();
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap="butt";
  g.beginPath(); g.moveTo(ax-W*0.070, ay); g.lineTo(ax-W*0.006, ay); g.stroke();
  g.lineWidth = 4; g.lineCap="round";
  for(let i=0;i<3;i++){
    const px = ax-W*0.070+i*W*0.015;
    g.beginPath(); g.moveTo(px, ay-H*0.016); g.lineTo(px, ay+H*0.016); g.stroke();
  }
  g.restore();
  pen.paint(()=>{
    g.moveTo(ax+W*0.028, ay);
    g.lineTo(ax-W*0.002, ay-H*0.019);
    g.lineTo(ax-W*0.002, ay+H*0.019);
    g.closePath();
  }, toneSolid(inkLevel(7)), 2);
  // the numeral, as bars
  sevenSeg(pen,g, x+pw*0.72, cy-ph*0.32, pw*0.16, ph*0.64, 1);
  // leader from the plate up to the cue's fletching
  const G = geom(W,H), f = along(G,0.10);
  g.save();
  g.strokeStyle = inkLevel(4); g.lineWidth = 3; g.setLineDash([6,7]);
  g.beginPath(); g.moveTo(cx-pw*0.10, y); g.lineTo(f.x+W*0.012, f.y+H*0.024); g.stroke();
  g.setLineDash([]); g.restore();
}

/* ---- CLOCK: the vow is BRIEF. A short tick strip (never a full-width rule) with
   one dark window and a bracket under it — the whole effect occupies a sliver of
   the scene's clock and then closes. ---- */
function drawClock(pen,g,W,H,t){
  const x0 = W*params.clockX0, x1 = W*params.clockX1, y = H*params.clockY;
  const n = 12;
  g.save();
  g.strokeStyle = inkLevel(4); g.lineWidth = 3; g.lineCap = "butt";
  for(let i=0;i<=n;i++){
    const x = lerp(x0,x1,i/n), tall = (i%4===0);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + H*(tall?0.019:0.011)); g.stroke();
  }
  g.restore();
  const wx0 = lerp(x0,x1,3/12), wx1 = lerp(x0,x1,4.6/12);
  pen.paint(()=>{ g.rect(wx0, y-H*0.024, wx1-wx0, H*0.024); }, toneSolid(inkLevel(6)), 3);
  pen.ink(()=>{
    g.moveTo(wx0, y+H*0.032); g.lineTo(wx0, y+H*0.024);
    g.lineTo(wx1, y+H*0.024); g.lineTo(wx1, y+H*0.032);
  }, 3);
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten = st.intensity ?? 1.0;
  const lock    = st.lock    ?? clamp(inten*1.10, 0, 1);
  const cue     = st.cue     ?? clamp((inten-0.45)*1.9, 0, 1);
  const silence = st.silence ?? clamp(inten*1.35, 0, 1);
  const layers = st.layers || asset.layers;
  const has = l => layers.includes(l);

  if (has("field"))    drawField(g,W,H);
  if (has("stand"))    drawStand(pen,g,W,H);
  if (has("target"))   drawTarget(pen,g,W,H,t);
  if (has("bearing"))  drawBearing(g,W,H,t);
  if (has("source"))   drawSource(pen,g,W,H,t,silence);
  if (has("reticle"))  drawReticle(pen,g,W,H,t,lock);
  if (has("cue"))      drawCue(pen,g,W,H,t,cue);
  if (has("index"))    drawIndex(pen,g,W,H,cue);
  if (has("clock"))    drawClock(pen,g,W,H,t);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.silent-revenge-vow",
  type:"DIVINE_FX",
  name:"Silent revenge vow",
  statusWord:"MARKED",
  scene:"OD-B17-S05",

  params,
  // back -> front; a scene may pass a subset (e.g. drop "clock"/"index" in wide shots)
  layers:["field","stand","target","bearing","source","reticle","cue","index","clock"],
  // normalized 0..1 source / field / target / consequence anchors
  anchors:{
    "source:odysseus-mind":{ x:0.145, y:0.630 },  // the man who says nothing
    "source:eye":{           x:0.205, y:0.608 },  // where the bearing departs
    "source:sealed-mouth":{  x:0.170, y:0.664 },  // the barred slot
    "field:bearing-mid":{    x:0.415, y:0.480 },  // midpoint of the sightline
    "target:antinous":{      x:0.625, y:0.700 },  // the marked man's body
    "target:throat":{        x:0.625, y:0.352 },  // the lock point / future wound
    "lock:reticle":{         x:0.625, y:0.352 },
    "cue:arrow-head":{       x:0.379, y:0.502 },  // the first arrow, parked short
    "cue:arrow-tail":{       x:0.230, y:0.593 },
    "index:first-arrow":{    x:0.330, y:0.800 },  // the filed cue number
    "clock:brief":{          x:0.670, y:0.140 },
    "camera:wide":{          x:0.500, y:0.500 },
    "camera:lock":{          x:0.625, y:0.352 },
  },
  // affected regions
  zones:{
    source:{  x0:0.02, y0:0.49, x1:0.30, y1:0.77 },   // the sealed containment
    bearing:{ x0:0.20, y0:0.33, x1:0.64, y1:0.63 },   // the sightline corridor
    lock:{    x0:0.37, y0:0.13, x1:0.88, y1:0.58 },   // the reticle footprint
    target:{  x0:0.47, y0:0.19, x1:0.79, y1:0.84 },   // Antinous's standing box
  },
  // DIVINE_FX transformation states: silent -> sighted -> locked -> cued
  states:{
    initial:"transform",
    nodes:{
      // source: the vow is swallowed; the reticle is still wide open
      source:{    preview:{ t:0.3, intensity:0.22, lock:0.10, cue:0.0, silence:0.45,
                            status:"SILENT",   progress:0.12 } },
      // target: the brackets travel in and find the throat
      target:{    preview:{ t:0.9, intensity:0.55, lock:0.55, cue:0.0, silence:0.85,
                            status:"SIGHTED",  progress:0.38 } },
      // field: the lock shuts and the arrow cue begins to draw itself
      field:{     preview:{ t:1.5, intensity:0.82, lock:1.0,  cue:0.45, silence:1.0,
                            status:"LOCKED",   progress:0.66 } },
      // transform: the future first arrow is attached and filed (neutral)
      transform:{ preview:{ t:2.1, intensity:1.20, lock:1.0,  cue:1.0,  silence:1.0,
                            status:"MARKED",   progress:0.90 } },
    },
    edges:[["source","target"],["target","field"],["field","transform"],
           ["transform","field"],["field","target"]],
  },
  duration:3.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","lock","cue","silence"],

  // neutral preview: the lock fully shut and the first-arrow cue attached —
  // mouth barred, speech struck out, reticle closed on the throat, arrow filed.
  preview:()=>({ t:2.0, intensity:1.20, lock:1.0, cue:1.0, silence:1.0,
                 status:"MARKED", progress:0.90,
                 layers:["field","stand","target","bearing","source","reticle","cue","index","clock"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
