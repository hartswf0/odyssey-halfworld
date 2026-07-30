/* prop.courtyard-execution-cable — the ship's cable rigged across the yard.
   PROP asset. Book XXII: Telemachus refuses the clean sword. He makes the
   cable of a dark-prowed ship fast to a great pillar of the court, throws
   the other part about the round-house and sets it up high, so that no foot
   should reach the ground.

   The object is therefore a RIGGED LINE with a duty cycle, not scenery —
   an anchor, a bearing, a tension, twelve marked stations, and a release.
   It is built as one:

     · the ANCHOR — a round turn and two half hitches taken under the
       capital of the court pillar, the tail stopped off short
     · the BEARING — the far part carried over the haunch of the round-house
       and down its far slope to a stake driven at the wall foot
     · the TENSION — the standing part swigged taut with a heaver through a
       bight, so the span rises and the sag closes from slack to a hand's
       breadth; the SAG is dimensioned off the chord
     · the STATIONS — twelve seizings marked along the span at even pitch;
       each takes one running noose of lighter cord
     · the piece reads off two counts: LOOPS bent on, and CLEAR — the
       height of the lowest eye above the yard floor in centimetres, which
       is the whole point of setting the line high.

   No body is drawn. This is the rig, isolated and reusable, exactly as the
   PROP contract asks: the nooses are empty cordage and the load is declared
   as sag, chevrons and a clearance dimension.

   States:
     coiled     — the hawser off the ship, made up at the pillar foot;
                  nothing rove, the stake not yet driven
     anchored   — hitched to the pillar, carried over the round-house and
                  hitched to the stake; the span hangs deeply slack
     tensioned  — swigged with the heaver; the sag closes, the line comes
                  up taut and the twelve stations are marked off
     looped     — twelve running nooses seized on at their stations, open
                  and hanging free
     suspended  — the line under load: nooses drawn closed and down, the
                  span sagging, the lowest eye dimensioned clear of the floor
     released   — cut down at mid-span, both ends sprung and frayed, the
                  hitches cast off, the cord struck and coiled on the ground

   Upper band is the piece at scale: the running noose, the pillar hitch,
   and the heaver taking up the slack. Below the broken rule is the yard in
   elevation. Bottom is the six-state ledger.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B22-S07. */
import { makePen, toneSolid, inkLevel, INK, lerp, clamp } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared parameters ---------------- */

const params = {
  loops: 12, parts: 1,
  // declared scale (metres / kilonewtons)
  cableDiameter_m: 0.058, cableLength_m: 11.80,
  spanLength_m: 6.40, spanRise_m: 2.92,
  sagSlack_m: 0.74, sagTaut_m: 0.12, sagLoaded_m: 0.41,
  clearance_m: 0.34, cordDiameter_m: 0.014, nooseDrop_m: 0.55,
  pillarHeight_m: 3.05, pillarWidth_m: 0.40,
  tholosDiameter_m: 3.55, tholosEaves_m: 2.10, stakeLength_m: 0.80,

  yard:   { pillarX:0.100, pillarW:0.054, capY:0.452, capH:0.026,
            tholosCx:0.730, tholosR:0.092, eaveR:0.112,
            tholosApex:0.482, tholosEave:0.570, yGround:0.800 },
  study:  { cy:0.226, noose:0.170, anchor:0.494, heave:0.826, r:0.078 },
  caliper:{ x0:0.302, x1:0.698, y:0.336 },
  headY:0.040, headH:0.050,
  divider:0.376,
  ledgerY:0.848, ledgerH:0.034,

  // ink levels — light planes, dark accents, plenty of paper
  stone:1, drum:1, roof:1, cable:2, cord:2, timber:2, earth:3, iron:5,
};

const ORDER = ["coiled","anchored","tensioned","looped","suspended","released"];

/* ---------------- seven-segment numerals (numbers as GEOMETRY) ---------------- */

const SEG_MAP = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc", 5:"afgcd",
                  6:"afgedc", 7:"abc", 8:"abcdefg", 9:"abcdfg" };

function segDigit(g, x, y, h, d){
  const w = h*0.56, t = h*0.170, half = h/2;
  const S = {
    a:[x+t*.55, y,            w-t*1.10, t],
    g:[x+t*.55, y+half-t/2,   w-t*1.10, t],
    d:[x+t*.55, y+h-t,        w-t*1.10, t],
    f:[x,       y+t*.55,      t, half-t*.85],
    b:[x+w-t,   y+t*.55,      t, half-t*.85],
    e:[x,       y+half+t*.30, t, half-t*.85],
    c:[x+w-t,   y+half+t*.30, t, half-t*.85],
  };
  g.fillStyle = INK;
  for (const s of (SEG_MAP[d] || "")){ const r = S[s]; g.fillRect(r[0], r[1], r[2], r[3]); }
  return w;
}
function segNumber(g, x, y, h, value, digits=2){
  const str = String(Math.max(0, value|0)).padStart(digits, "0");
  const w = h*0.56, gap = h*0.20;
  let cx = x;
  for (const ch of str){ segDigit(g, cx, y, h, +ch); cx += w + gap; }
  return cx - gap - x;
}

/* ---------------- cordage ----------------
   Two weights, and the difference is the point: the HAWSER is a ship's
   cable, heavy, laid, with a hard contour; the NOOSES are lighter cord and
   are drawn as line, so twelve of them never turn the frame into a mass. */

function rope(pen, g, pts, { w=7, level=params.cable, lay=true }={}){
  if (pts.length < 2) return;
  const path = ()=>{ g.moveTo(pts[0].x, pts[0].y);
                     for (let i=1;i<pts.length;i++) g.lineTo(pts[i].x, pts[i].y); };
  pen.limb(path, toneSolid(inkLevel(level)), w);
  if (!lay) return;
  g.strokeStyle = INK; g.lineWidth = 2.0; g.lineCap = "butt";
  for (let i=2;i<pts.length-1;i+=3){
    const a = pts[i-1], b = pts[i+1];
    const dx = b.x-a.x, dy = b.y-a.y, n = Math.hypot(dx,dy) || 1;
    const px = -dy/n*w*0.44, py = dx/n*w*0.44;
    g.beginPath();
    g.moveTo(pts[i].x-px + dx/n*w*0.22, pts[i].y-py + dy/n*w*0.22);
    g.lineTo(pts[i].x+px - dx/n*w*0.22, pts[i].y+py - dy/n*w*0.22);
    g.stroke();
  }
}
function cord(g, pts, lw=3.0){
  if (pts.length < 2) return;
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
  for (let i=1;i<pts.length;i++) g.lineTo(pts[i].x, pts[i].y);
  g.stroke();
}
function frayed(g, x, y, dx, dy, s){
  const n = Math.hypot(dx,dy) || 1; const ux = dx/n, uy = dy/n;
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap = "round";
  for (const a of [-0.44, 0, 0.44]){
    const px = -uy, py = ux;
    g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x+ux*s*0.55 + px*a*s*0.30, y+uy*s*0.55 + py*a*s*0.30,
                       x+ux*s + px*a*s*1.15,      y+uy*s + py*a*s*1.15);
    g.stroke();
  }
}
/* a coil of hawser lying on its side */
function coil(pen, g, cx, cy, R, w){
  for (let k=0;k<3;k++){
    const rr = R*(1 - k*0.26), pts = [];
    for (let i=0;i<=30;i++){
      const a = i/30*Math.PI*2 - Math.PI*0.5;
      pts.push({ x: cx + Math.cos(a)*rr, y: cy + Math.sin(a)*rr*0.38 });
    }
    rope(pen, g, pts, { w, lay:k===0 });
  }
}

/* ---------------- the span ----------------
   A chord from A to B with a sine sag. Sliced so a cut state can take out
   the middle and let both parts fall. */
function spanPt(A, B, sag, t){
  return { x: lerp(A.x,B.x,t), y: lerp(A.y,B.y,t) + Math.sin(Math.PI*t)*sag };
}
function spanPts(A, B, sag, t0=0, t1=1, n=30){
  const out = [];
  for (let i=0;i<=n;i++) out.push(spanPt(A, B, sag, lerp(t0,t1,i/n)));
  return out;
}

/* ---------------- the yard ---------------- */

function yardGeo(W, H){
  const Y = params.yard;
  const px0 = W*Y.pillarX, pw = W*Y.pillarW, px1 = px0+pw;
  const capY = H*Y.capY, capH = H*Y.capH;
  const yG = H*Y.yGround;
  const tcx = W*Y.tholosCx, tR = W*Y.tholosR, eR = W*Y.eaveR;
  const apex = H*Y.tholosApex, eave = H*Y.tholosEave;
  const A = { x: px1, y: capY + H*0.050 };                    // the made-fast point
  const B = { x: tcx - eR*0.82, y: eave - (eave-apex)*0.30 }; // the bearing on the haunch
  const C = { x: tcx, y: apex - H*0.006 };                    // the crown it passes over
  const D = { x: tcx + eR*0.90, y: eave - (eave-apex)*0.12 };
  const S = { x: tcx + eR*1.70, y: yG - H*0.010 };            // the stake
  return { px0, pw, px1, capY, capH, yG, tcx, tR, eR, apex, eave, A, B, C, D, S };
}

/* the court pillar: five drums with paper joints, a capital that overhangs.
   Never one tall plane — the joints break it. */
function pillar(pen, g, G, H){
  const n = 3, top = G.capY + G.capH, h = G.yG - H*0.020 - top, ch = (h - (n-1)*5)/n;
  for (let i=0;i<n;i++){
    const y = top + i*(ch+5);
    const inset = i*G.pw*0.03;                        // a slight entasis
    pen.paint(()=>{ g.rect(G.px0+inset*0.5, y, G.pw-inset, ch); },
      toneSolid(inkLevel(i===1 ? params.stone : 0)), 2.6);
    // one short flute per drum, staggered — never a full-height line
    const fx = G.px0 + G.pw*((i%2) ? 0.64 : 0.36);
    pen.seam(()=>{ g.moveTo(fx, y+ch*0.22); g.lineTo(fx, y+ch*0.66); }, 2.0);
  }
  // capital: abacus over an echinus, both overhanging the shaft
  pen.paint(()=>{ g.rect(G.px0-G.pw*0.24, G.capY, G.pw*1.48, G.capH*0.50); },
    toneSolid(inkLevel(0)), 2.8);
  pen.paint(()=>{ g.moveTo(G.px0-G.pw*0.20, G.capY+G.capH*0.50);
                  g.lineTo(G.px0+G.pw*1.20, G.capY+G.capH*0.50);
                  g.lineTo(G.px0+G.pw*0.94, G.capY+G.capH*1.04);
                  g.lineTo(G.px0+G.pw*0.06, G.capY+G.capH*1.04); g.closePath(); },
    toneSolid(inkLevel(params.stone)), 2.6);
  // base plinth
  pen.paint(()=>{ g.rect(G.px0-G.pw*0.18, G.yG-H*0.020, G.pw*1.36, H*0.020); },
    toneSolid(inkLevel(0)), 2.8);
}

/* the round-house: a low drum under a cone. Courses are cut into two blocks
   with a real gap of paper so no course ever prints as one band. */
function tholos(pen, g, G, H){
  const cx = G.tcx, R = G.tR, eR = G.eR, top = G.eave, h = G.yG - top;
  const ell = eR*0.26;                       // how much the eave curve dips
  // ── the drum: ONE light plane, courses read as broken seams, not panes ──
  pen.paint(()=>{ g.rect(cx-R, top+H*0.008, 2*R, G.yG-top-H*0.008); },
    toneSolid(inkLevel(0)), 3.0);
  for (let i=1;i<=2;i++){
    const y = top + H*0.008 + (G.yG-top-H*0.008)*i/3;
    for (const [a,b] of (i%2 ? [[-0.94,-0.30],[-0.10,0.94]] : [[-0.94,0.10],[0.30,0.94]]))
      pen.seam(()=>{ g.moveTo(cx+R*a, y); g.lineTo(cx+R*b, y); }, 2.2);
  }
  // one darker jamb beside the door, so the wall has weight without a grid
  pen.paint(()=>{ g.rect(cx-R*0.30, G.yG-h*0.48, R*0.16, h*0.48); },
    toneSolid(inkLevel(params.drum)), 2.2);
  // the foot, an ellipse arc: this is what makes the drum read ROUND
  pen.ink(()=>{ g.ellipse(cx, G.yG-R*0.22, R*0.98, R*0.30, 0, 0.14, Math.PI-0.14); }, 3.8);
  // the doorway — paper, under a timber lintel
  const dw = R*0.46, dh = h*0.48;
  pen.paint(()=>{ g.rect(cx-dw*0.12, G.yG-dh, dw, dh); }, toneSolid(inkLevel(0)), 2.8);
  pen.paint(()=>{ g.rect(cx-dw*0.30, G.yG-dh-H*0.013, dw*1.36, H*0.013); },
    toneSolid(inkLevel(params.timber)), 2.6);
  // ── the dome: a light plane with a CURVED eave, so it is never a gable ──
  pen.paint(()=>{
    g.moveTo(cx-eR, G.eave);
    g.quadraticCurveTo(cx-eR*0.46, G.apex + (G.eave-G.apex)*0.04, cx, G.apex);
    g.quadraticCurveTo(cx+eR*0.46, G.apex + (G.eave-G.apex)*0.04, cx+eR, G.eave);
    g.quadraticCurveTo(cx, G.eave + ell, cx-eR, G.eave);
  }, toneSolid(inkLevel(params.roof)), 3.2);
  // radial ribs, stopped short of the crown
  for (const f of [-0.66,-0.30, 0.30, 0.66]){
    pen.seam(()=>{
      g.moveTo(cx+eR*f*0.30, lerp(G.apex, G.eave, 0.20));
      g.quadraticCurveTo(cx+eR*f*0.78, lerp(G.apex, G.eave, 0.62),
                         cx+eR*f, G.eave + ell*(1-f*f)*0.86);
    }, 2.0);
  }
  // one broken purlin ring
  for (const [a,b] of [[-0.60,-0.14],[0.14,0.60]]){
    const yr = lerp(G.apex, G.eave, 0.62);
    pen.seam(()=>{ g.moveTo(cx+eR*a*0.72, yr+Math.abs(a)*4);
                   g.lineTo(cx+eR*b*0.72, yr+Math.abs(b)*4); }, 2.2);
  }
  // the crown ring the far part is thrown over
  pen.paint(()=>{ g.ellipse(cx, G.apex, 9, 5, 0, 0, 7); },
    toneSolid(inkLevel(params.iron)), 2.2);
}

/* the stake driven at the wall foot, with its guy */
function stake(pen, g, G, H, driven){
  const s = G.S, len = H*0.062;
  if (!driven){
    // drawn and lying by
    pen.paint(()=>{ g.rect(s.x-len*0.52, G.yG-9, len, 9); },
      toneSolid(inkLevel(params.timber)), 2.8);
    return;
  }
  g.save(); g.translate(s.x, G.yG); g.rotate(-0.26);
  pen.paint(()=>{ g.rect(-6, -len, 12, len); }, toneSolid(inkLevel(params.timber)), 3.0);
  pen.seam(()=>{ g.moveTo(-6, -len*0.46); g.lineTo(6, -len*0.46); }, 2.2);
  g.restore();
  // the spoil kicked up either side
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap = "round";
  for (const d of [-1,1]){
    g.beginPath(); g.moveTo(s.x+d*11, G.yG); g.lineTo(s.x+d*20, G.yG+7); g.stroke();
  }
}

/* the hitch at the pillar: a round turn under the capital and two half
   hitches, the tail stopped short */
function pillarHitch(pen, g, G, w){
  const y = G.A.y, xL = G.px0 - G.pw*0.10, xR = G.px1 + G.pw*0.10;
  // two turns across the face of the shaft, well apart so they never merge
  for (const dy of [-11, 9]){
    rope(pen, g, [{x:xL,y:y+dy},{x:xR,y:y+dy}], { w:w*0.62, lay:false });
  }
  // the part that passes round the back, seen at the edge
  g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "round";
  g.beginPath(); g.moveTo(xR-2, y-11);
  g.quadraticCurveTo(xR+9, y-1, xR-2, y+9); g.stroke();
  // the stopped tail, down the near side
  const tail = [];
  for (let i=0;i<=12;i++){
    const t = i/12;
    tail.push({ x: xL - 2 - t*9 + Math.sin(t*2.6)*5, y: y + 12 + t*38 });
  }
  rope(pen, g, tail, { w:w*0.52, lay:false });
  frayed(g, tail[tail.length-1].x, tail[tail.length-1].y, -0.4, 1, 11);
}

/* the far part hitched round the stake */
function stakeHitch(pen, g, G, w){
  const s = G.S, pts = [];
  for (let i=0;i<=20;i++){
    const a = i/20*Math.PI*2 - Math.PI/2;
    pts.push({ x: s.x + Math.cos(a)*13, y: s.y - 6 + Math.sin(a)*8 });
  }
  rope(pen, g, pts, { w:w*0.72, lay:false });
}

/* a seizing: the mark and the whipping that holds a noose at its station */
function seizing(g, P, ang, bent){
  const px = -Math.sin(ang), py = Math.cos(ang);
  g.strokeStyle = INK; g.lineWidth = bent ? 2.6 : 2.2; g.lineCap = "butt";
  const r = bent ? 8 : 6;
  for (const o of (bent ? [-3.0, 3.0] : [0])){
    const ox = Math.cos(ang)*o, oy = Math.sin(ang)*o;
    g.beginPath();
    g.moveTo(P.x+ox-px*r, P.y+oy-py*r);
    g.lineTo(P.x+ox+px*r, P.y+oy+py*r);
    g.stroke();
  }
}

/* ONE running noose, in lighter cord. open: the eye stands round and slack;
   closed: the eye is drawn small and the neck comes down taut. */
function noose(g, P, drop, r, closed, lean){
  const ex = P.x + lean, ey = P.y + drop;
  // the neck: ONE part when the eye is drawn closed, two apart when it is open
  for (const d of (closed ? [0] : [-2.8, 2.8])){
    cord(g, [{ x:P.x + d, y:P.y + 4 },
             { x:lerp(P.x+d, ex+d*0.5, 0.60), y:lerp(P.y, ey-r*1.05, 0.62) },
             { x:ex + d*0.42, y:ey - r*0.94 }], closed ? 2.6 : 2.2);
  }
  // the eye
  g.strokeStyle = INK; g.lineWidth = closed ? 2.8 : 2.4;
  g.beginPath(); g.ellipse(ex, ey, r, r*(closed ? 0.70 : 0.96), 0, 0, 7); g.stroke();
  // the knot on the standing part — one short accent, never a block
  g.fillStyle = INK; g.fillRect(ex + r*0.66, ey - r*0.30, 3.6, r*0.62);
  // the running tail
  cord(g, [{ x:ex - r*0.86, y:ey + r*0.54 },
           { x:ex - r*1.34, y:ey + r*1.30 }], 2.2);
}

/* load: a short chevron under a station, used at four stations only */
function loadChevron(g, x, y, s){
  g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath();
  g.moveTo(x-s, y); g.lineTo(x, y+s*0.8); g.lineTo(x+s, y);
  g.stroke();
}

/* the sag dimension: the chord, broken, and a plumb down to the low point */
function sagDim(pen, g, G, sag){
  const t = 0.5, chord = { x:lerp(G.A.x,G.B.x,t), y:lerp(G.A.y,G.B.y,t) };
  const low = { x:chord.x, y:chord.y + sag };
  g.save(); g.setLineDash([10,7]); g.strokeStyle = INK; g.lineWidth = 3.0;
  g.beginPath();
  g.moveTo(G.A.x+18, lerp(G.A.y,G.B.y,0.05)); g.lineTo(lerp(G.A.x,G.B.x,0.34), lerp(G.A.y,G.B.y,0.34));
  g.moveTo(lerp(G.A.x,G.B.x,0.64), lerp(G.A.y,G.B.y,0.64)); g.lineTo(G.B.x-18, lerp(G.A.y,G.B.y,0.95));
  g.stroke();
  g.setLineDash([]); g.restore();
  g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "butt";
  g.beginPath(); g.moveTo(chord.x, chord.y); g.lineTo(low.x, low.y); g.stroke();
  for (const p of [chord, low]){
    g.beginPath(); g.moveTo(p.x-11, p.y); g.lineTo(p.x+11, p.y); g.stroke();
  }
}

/* the clearance dimension: lowest eye down to the yard floor, arrowed */
function clearDim(g, x, yTop, yG){
  g.save(); g.setLineDash([11,8]); g.strokeStyle = INK; g.lineWidth = 3.4;
  g.beginPath(); g.moveTo(x, yTop+14); g.lineTo(x, yG-14); g.stroke();
  g.setLineDash([]); g.restore();
  g.fillStyle = INK;
  for (const [y, d] of [[yTop, 1], [yG, -1]]){
    g.beginPath(); g.moveTo(x, y); g.lineTo(x-8, y+d*17); g.lineTo(x+8, y+d*17);
    g.closePath(); g.fill();
  }
  // witness ticks at both ends
  g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "butt";
  for (const y of [yTop, yG]){
    g.beginPath(); g.moveTo(x-15, y); g.lineTo(x+15, y); g.stroke();
  }
}

/* tension arrows at both ends, shown while the line is being swigged up */
function pullArrows(g, G){
  g.strokeStyle = INK; g.lineWidth = 4.2; g.lineCap = "butt";
  const draw = (x, y, dir)=>{
    for (const [a,b] of [[0.04,0.34],[0.46,0.76]]){
      g.beginPath();
      g.moveTo(x + dir*(16 + a*40), y); g.lineTo(x + dir*(16 + b*40), y);
      g.stroke();
    }
    g.fillStyle = INK; g.beginPath();
    g.moveTo(x, y); g.lineTo(x + dir*16, y-7); g.lineTo(x + dir*16, y+7);
    g.closePath(); g.fill();
  };
  draw(G.A.x - 8, G.A.y + 30, -1);
  draw(G.S.x + 8, G.S.y - 46,  1);
}

/* the yard floor: three short hatch runs, never a span */
function ground(pen, g, G, W){
  for (const [a,b] of [[G.px0-16, G.px1+26],
                       [W*0.340, W*0.540],
                       [G.tcx-G.eR*0.86, G.S.x+22]]){
    pen.ink(()=>{ g.moveTo(a, G.yG); g.lineTo(b, G.yG); }, 4.4);
    g.strokeStyle = INK; g.lineWidth = 2.8; g.lineCap = "butt";
    for (let x=a+8; x<b-5; x+=16){
      g.beginPath(); g.moveTo(x, G.yG+3); g.lineTo(x-8, G.yG+15); g.stroke();
    }
  }
}

/* ---------------- the upper studies ---------------- */

/* the running noose at scale: bight, eye, and the part that renders */
function nooseStudy(pen, g, W, H){
  const S = params.study, cx = W*S.noose, cy = H*S.cy, R = W*S.r;
  const ey = cy - R*0.62;                       // the small eye
  // the seizing on the span above — where this noose lives
  rope(pen, g, [{x:cx-R*1.18,y:cy-R*1.48},{x:cx+R*1.34,y:cy-R*1.42}], { w:5 });
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap = "butt";
  for (const o of [-4, 4]){
    g.beginPath(); g.moveTo(cx+o, cy-R*1.62); g.lineTo(cx+o, cy-R*1.28); g.stroke();
  }
  // the standing part down to the eye
  cord(g, [{x:cx,y:cy-R*1.28},{x:cx-R*0.06,y:cy-R*0.94},{x:cx-R*0.14,y:ey-R*0.16}], 3.4);
  g.strokeStyle = INK; g.lineWidth = 3.4;
  g.beginPath(); g.ellipse(cx, ey, R*0.22, R*0.17, 0.28, 0, 7); g.stroke();
  // the part rove through the eye becomes the loop below — the two meet
  cord(g, [{x:cx-R*0.18,y:ey+R*0.14},{x:cx-R*0.52,y:cy+R*0.02}], 3.4);
  cord(g, [{x:cx+R*0.20,y:ey+R*0.12},{x:cx+R*0.50,y:cy+R*0.06}], 3.4);
  g.lineWidth = 3.6;
  g.beginPath(); g.ellipse(cx, cy+R*0.66, R*0.62, R*0.60, 0, 0, 7); g.stroke();
  // the running part leaving the eye, with an arrow: the way it renders home
  cord(g, [{x:cx+R*0.24,y:ey-R*0.10},{x:cx+R*1.02,y:ey+R*0.06},
           {x:cx+R*1.36,y:ey+R*0.62}], 3.0);
  g.fillStyle = INK; g.beginPath();
  g.moveTo(cx+R*1.44, cy-R*0.02); g.lineTo(cx+R*1.16, cy-R*0.24);
  g.lineTo(cx+R*1.52, cy-R*0.40); g.closePath(); g.fill();
}

/* the pillar hitch at scale: the drum in section, a round turn, two hitches */
function anchorStudy(pen, g, W, H){
  const S = params.study, cx = W*S.anchor, cy = H*S.cy, R = W*S.r;
  const hw = R*0.62;                                   // half the shaft width
  pen.paint(()=>{ g.rect(cx-hw, cy-R*1.22, hw*2, R*2.44); },
    toneSolid(inkLevel(params.stone)), 3.4);
  pen.seam(()=>{ g.moveTo(cx-hw, cy+R*0.72); g.lineTo(cx+hw, cy+R*0.72); }, 2.2);
  pen.seam(()=>{ g.moveTo(cx-hw, cy-R*0.94); g.lineTo(cx+hw, cy-R*0.94); }, 2.2);
  // the round turn: two passes across the face, and the bight round the back
  for (const dy of [-R*0.56, R*0.16]){
    rope(pen, g, [{x:cx-hw*1.20,y:cy+dy},{x:cx+hw*1.20,y:cy+dy}], { w:4.5, lay:false });
  }
  g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "round";
  g.beginPath(); g.moveTo(cx+hw*1.14, cy-R*0.56);
  g.quadraticCurveTo(cx+hw*1.78, cy-R*0.20, cx+hw*1.14, cy+R*0.16); g.stroke();
  // the standing part running off left, with two half hitches on it
  rope(pen, g, [{x:cx-hw*1.14,y:cy+R*0.16},{x:cx-R*1.34,y:cy+R*0.06},
                {x:cx-R*2.04,y:cy+R*0.14}], { w:4.5 });
  g.strokeStyle = INK; g.lineWidth = 2.8;
  for (const f of [1.10, 1.56]){
    g.beginPath(); g.ellipse(cx-R*f, cy+R*0.10, R*0.15, R*0.26, 0.22, 0, 7); g.stroke();
  }
  // the stopped tail
  cord(g, [{x:cx+hw*0.30,y:cy+R*0.28},{x:cx+R*0.54,y:cy+R*0.84},
           {x:cx+R*0.32,y:cy+R*1.30}], 3.0);
}

/* the heaver at scale: a bight, a bar through it, and the twist that
   takes up the slack */
function heaveStudy(pen, g, W, H){
  const S = params.study, cx = W*S.heave, cy = H*S.cy, R = W*S.r;
  const yc = cy - R*1.02;
  // the cable, broken at both edges of the study, the bight taken out of it
  rope(pen, g, [{x:cx-R*1.62,y:yc},{x:cx-R*0.56,y:yc}], { w:5 });
  rope(pen, g, [{x:cx+R*0.56,y:yc},{x:cx+R*1.62,y:yc}], { w:5 });
  // the bight below — a clean U, both legs standing well apart
  cord(g, [{x:cx-R*0.56,y:yc+3},{x:cx-R*0.50,y:cy+R*0.36},
           {x:cx-R*0.24,y:cy+R*0.66},{x:cx+R*0.24,y:cy+R*0.66},
           {x:cx+R*0.50,y:cy+R*0.36},{x:cx+R*0.56,y:yc+3}], 4.0);
  // the heaver: a bar through the bight, standing at an angle
  g.save(); g.translate(cx, cy+R*0.18); g.rotate(-0.38);
  pen.paint(()=>{ g.rect(-R*0.11, -R*0.74, R*0.22, R*1.48); },
    toneSolid(inkLevel(0)), 2.8);
  pen.seam(()=>{ g.moveTo(-R*0.11, -R*0.16); g.lineTo(R*0.11, -R*0.16); }, 2.0);
  g.restore();
  // the twist that takes up the slack
  g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "round";
  g.beginPath(); g.arc(cx, cy+R*0.18, R*0.94, -2.36, -1.10); g.stroke();
  g.fillStyle = INK; g.beginPath();
  g.moveTo(cx+R*0.62, cy-R*0.68); g.lineTo(cx+R*0.28, cy-R*0.76);
  g.lineTo(cx+R*0.44, cy-R*1.10); g.closePath(); g.fill();
}

/* broken scale caliper — the declared span */
function caliper(pen, g, W, H){
  const C = params.caliper, x0 = W*C.x0, x1 = W*C.x1, y = H*C.y, t = H*0.016;
  g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "butt";
  for (const x of [x0, x1]){ g.beginPath(); g.moveTo(x, y-t); g.lineTo(x, y+t); g.stroke(); }
  for (const [a,b] of [[0.02,0.28],[0.38,0.62],[0.72,0.98]]){
    g.beginPath(); g.moveTo(x0+(x1-x0)*a, y); g.lineTo(x0+(x1-x0)*b, y); g.stroke();
  }
  g.lineWidth = 2.6;
  for (const f of [0.32, 0.68]){ const x = x0+(x1-x0)*f;
    g.beginPath(); g.moveTo(x, y-t*0.55); g.lineTo(x, y+t*0.55); g.stroke(); }
}

/* ---------------- header + ledger ---------------- */

/* the mark: a noose glyph — an eye on a neck, drawn open or drawn closed */
function nooseGlyph(g, x, cy, s, closed){
  g.strokeStyle = INK; g.lineWidth = 4.2; g.lineCap = "round";
  const r = closed ? s*0.22 : s*0.34;
  g.beginPath(); g.moveTo(x-s*0.10, cy-s*0.62); g.lineTo(x-s*0.02, cy-r*1.0); g.stroke();
  g.beginPath(); g.moveTo(x+s*0.10, cy-s*0.62); g.lineTo(x+s*0.02, cy-r*1.0); g.stroke();
  g.beginPath(); g.ellipse(x, cy+s*0.06, r, r*(closed?0.74:0.96), 0, 0, 7); g.stroke();
  g.fillStyle = INK; g.fillRect(x+r*0.70, cy-s*0.10, 5.5, s*0.34);
}

function header(pen, g, W, H, M){
  const dh = H*params.headH, dy = H*params.headY, cy = dy+dh/2;
  nooseGlyph(g, W*0.070, cy, dh*0.92, M.closed);
  segNumber(g, W*0.140, dy, dh, M.loops, 2);

  // the tension mark: three solid runs when the line is up taut, broken slack
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
  const runs = M.taut ? [[0.318,0.392],[0.404,0.478],[0.490,0.564]]
                      : [[0.318,0.348],[0.452,0.482],[0.534,0.564]];
  for (const [a,b] of runs){ g.beginPath(); g.moveTo(W*a, cy); g.lineTo(W*b, cy); g.stroke(); }

  segNumber(g, W*0.628, dy, dh, M.clear, 2);

  // the seal: the anchor eye — filled when made fast, X'd when cut down
  const kx = W*0.905, ks = dh*0.50;
  pen.paint(()=>{ g.arc(kx, cy, ks, 0, 7); },
    toneSolid(inkLevel(M.fast ? params.iron : 2)), 3.4);
  pen.paint(()=>{ g.arc(kx, cy, ks*0.46, 0, 7); }, toneSolid(inkLevel(0)), 2.6);
  if (M.cut){
    g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "round";
    g.beginPath();
    g.moveTo(kx-ks*1.05, cy-ks*1.05); g.lineTo(kx+ks*1.05, cy+ks*1.05);
    g.moveTo(kx+ks*1.05, cy-ks*1.05); g.lineTo(kx-ks*1.05, cy+ks*1.05); g.stroke();
  }
}

function divider(pen, g, W, H){
  const y = H*params.divider;
  for (const [a,b] of [[0.052,0.245],[0.305,0.470],[0.530,0.700],[0.760,0.948]])
    pen.ink(()=>{ g.moveTo(W*a, y); g.lineTo(W*b, y); }, 3.2);
}

/* six-state ledger, in three groups of two */
function ledger(pen, g, W, H, idx, isCut){
  const y = H*params.ledgerY, hh = H*params.ledgerH;
  const gapW = W*0.032, span = W*0.876 - gapW*2, per = span/6;
  let x = W*0.062, i = 0;
  for (let grp=0; grp<3; grp++){
    pen.ink(()=>{ g.moveTo(x+per*0.14, y+hh+H*0.014);
                  g.lineTo(x+per*2-per*0.14, y+hh+H*0.014); }, 2.6);
    for (let c=0;c<2;c++, i++){
      const bw = per*0.62, bx = x+(per-bw)/2;
      if (i < idx){
        pen.paint(()=>{ g.rect(bx, y, bw, hh); }, toneSolid(inkLevel(0)), 3);
        pen.paint(()=>{ g.rect(bx, y+hh*0.58, bw, hh*0.42); }, toneSolid(inkLevel(2)), 2.4);
      } else if (i === idx){
        pen.paint(()=>{ g.rect(bx, y, bw, hh); }, toneSolid(inkLevel(5)), 3);
        g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "round"; g.lineJoin = "round";
        if (isCut){
          g.beginPath();
          g.moveTo(bx+bw*0.22, y-H*0.026); g.lineTo(bx+bw*0.78, y-H*0.008);
          g.moveTo(bx+bw*0.78, y-H*0.026); g.lineTo(bx+bw*0.22, y-H*0.008); g.stroke();
        } else {
          const s = hh*0.50, tx = bx+bw*0.22, ty = y-H*0.012;
          g.beginPath(); g.moveTo(tx, ty-s*0.24); g.lineTo(tx+s*0.44, ty+s*0.30);
          g.lineTo(tx+s*1.08, ty-s*0.80); g.stroke();
        }
      } else {
        g.save(); g.setLineDash([5,5]); g.strokeStyle = INK; g.lineWidth = 2.6;
        g.beginPath(); g.rect(bx, y, bw, hh); g.stroke();
        g.setLineDash([]); g.restore();
      }
      x += per;
    }
    x += gapW;
  }
}

/* ---------------- state table ---------------- */

const MODES = {
  coiled:    { fast:false, rove:false, sag:0,     taut:false, marks:false, loops:0,
               drop:0,    closed:false, load:false, coil:true,  driven:false,
               clear:0,  cut:false, down:false },
  anchored:  { fast:true,  rove:true,  sag:0.086, taut:false, marks:false, loops:0,
               drop:0,    closed:false, load:false, coil:false, driven:true,
               clear:0,  cut:false, down:false },
  tensioned: { fast:true,  rove:true,  sag:0.016, taut:true,  marks:true,  loops:0,
               drop:0,    closed:false, load:false, coil:false, driven:true,
               clear:0,  cut:false, down:false, pull:true },
  looped:    { fast:true,  rove:true,  sag:0.024, taut:true,  marks:true,  loops:12,
               drop:0.054, closed:false, load:false, coil:false, driven:true,
               clear:0,  cut:false, down:false },
  suspended: { fast:true,  rove:true,  sag:0.050, taut:true,  marks:true,  loops:12,
               drop:0.042, closed:true, load:true,  coil:false, driven:true,
               clear:34, cut:false, down:false },
  released:  { fast:false, rove:true,  sag:0.050, taut:false, marks:true,  loops:0,
               drop:0,    closed:false, load:false, coil:true,  driven:true,
               clear:0,  cut:true,  down:true },
};

/* ---------------- the render ---------------- */

function draw(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const key = MODES[st.mode] ? st.mode : "suspended";
  const M = MODES[key];
  const G = yardGeo(W, H);
  const w = 7;                                  // the hawser
  const sag = H*M.sag;

  header(pen, g, W, H, M);

  // ── the piece at scale ──
  nooseStudy(pen, g, W, H);
  anchorStudy(pen, g, W, H);
  heaveStudy(pen, g, W, H);
  caliper(pen, g, W, H);
  divider(pen, g, W, H);

  // ── the yard ──
  ground(pen, g, G, W);
  pillar(pen, g, G, H);
  tholos(pen, g, G, H);
  stake(pen, g, G, H, M.driven);

  // ── the cable ──
  if (M.rove && !M.down){
    // the span, pillar to haunch
    rope(pen, g, spanPts(G.A, G.B, sag), { w });
    // the bearing saddle where it takes the roof
    pen.paint(()=>{ g.rect(G.B.x-13, G.B.y-5, 26, 11); },
      toneSolid(inkLevel(params.timber)), 2.4);
    // the part carried ROUND the round-house — hidden behind the dome, so it
    // is dashed: diagram language, and it keeps the crown clear of ink
    g.save(); g.setLineDash([9,8]); g.strokeStyle = INK; g.lineWidth = 3.0;
    g.beginPath();
    g.moveTo(G.B.x+10, G.B.y-4);
    g.quadraticCurveTo(lerp(G.B.x,G.C.x,0.62), G.C.y-4, G.C.x, G.C.y);
    g.quadraticCurveTo(lerp(G.C.x,G.D.x,0.38), G.C.y-4, G.D.x-10, G.D.y-4);
    g.stroke();
    g.setLineDash([]); g.restore();
    // and down the far slope to the stake — clear of the wall, so it reads as
    // a guy across paper and never as a post against the drum
    rope(pen, g, [G.D, { x:lerp(G.D.x,G.S.x,0.46), y:lerp(G.D.y,G.S.y,0.52) }, G.S],
      { w:w*0.74 });
    pillarHitch(pen, g, G, w);
    stakeHitch(pen, g, G, w);
    // a served length at mid-span — breaks the run, and is where the blade goes
    const sv = spanPts(G.A, G.B, sag, 0.44, 0.56, 6);
    g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "butt";
    for (let i=1;i<sv.length;i++){
      const a = sv[i-1], b = sv[i];
      const dx = b.x-a.x, dy = b.y-a.y, n = Math.hypot(dx,dy)||1;
      g.beginPath();
      g.moveTo(a.x + dy/n*8, a.y - dx/n*8); g.lineTo(a.x - dy/n*8, a.y + dx/n*8);
      g.stroke();
    }
  }
  if (M.down){
    // cut down: both parts fall away from mid-span
    for (const [t0,t1,s] of [[0, 0.42, -1],[0.58, 1, 1]]){
      const pts = spanPts(G.A, G.B, sag, t0, t1, 16);
      for (let i=0;i<pts.length;i++){
        const f = s<0 ? i/(pts.length-1) : 1-i/(pts.length-1);
        pts[i].y += f*f*(G.yG - G.A.y)*0.86;
      }
      rope(pen, g, pts, { w:w*0.9 });
      const e = s<0 ? pts[pts.length-1] : pts[0];
      frayed(g, e.x, e.y, -s*0.9, -0.3, 13);
    }
    // the far part slack over the round-house, still on its stake
    rope(pen, g, [G.C, { x:lerp(G.C.x,G.D.x,0.6), y:lerp(G.C.y,G.D.y,0.70) }, G.D,
                  { x:lerp(G.D.x,G.S.x,0.5), y:G.S.y-8 }, G.S], { w:w*0.86 });
    stakeHitch(pen, g, G, w);
    // the nick where the blade went through
    g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "round";
    const nx = lerp(G.A.x,G.B.x,0.5), ny = lerp(G.A.y,G.B.y,0.5) + sag - 26;
    g.beginPath(); g.moveTo(nx-13, ny-11); g.lineTo(nx, ny); g.lineTo(nx+13, ny-11); g.stroke();
  }

  // ── the twelve stations ──
  if (M.marks){
    const N = params.loops;
    let lowest = null, lowX = 0;
    for (let k=0;k<N;k++){
      const t = (k+0.5)/N;
      const P = spanPt(G.A, G.B, M.down ? sag : sag, t);
      if (M.down){ continue; }
      const a = Math.atan2(G.B.y-G.A.y, G.B.x-G.A.x);
      seizing(g, P, a, M.loops > 0);
      if (M.loops > 0){
        const alt = k % 2;
        const drop = H*M.drop*(alt ? 1.34 : 1.0);
        const r = M.closed ? 8 : 11;
        noose(g, P, drop, r, M.closed, (k%3-1)*2.4);
        const ey = P.y + drop;
        if (lowest === null || ey > lowest){ lowest = ey; lowX = P.x; }
        if (M.load && k%3 === 1) loadChevron(g, P.x, ey + r*1.6, 9);
      }
    }
    if (M.load && lowest !== null)
      clearDim(g, lowX + (G.B.x-G.A.x)/(N*2), lowest + 20, G.yG);
  }
  // the stations struck: the cut cord lying under where the line ran
  if (M.down){
    for (const [cx, rr] of [[W*0.300, 15],[W*0.395, 12],[W*0.480, 17]]){
      g.strokeStyle = INK; g.lineWidth = 2.8;
      g.beginPath(); g.ellipse(cx, G.yG-8, rr, rr*0.34, 0.12, 0, 7); g.stroke();
    }
  }

  if (M.sag > 0.03 && !M.down) sagDim(pen, g, G, sag);
  if (M.pull) pullArrows(g, G);
  if (M.coil) coil(pen, g, G.px1 + W*0.070, G.yG - 14, 30, w*0.8);

  ledger(pen, g, W, H, ORDER.indexOf(key), key === "released");
}

/* ---------------- normalized anchors ----------------
   The twelve loop stations are computed from the same geometry the render
   uses, in the SUSPENDED state, so a scene can address any one of them. */

const NA = { x: params.yard.pillarX + params.yard.pillarW,
             y: params.yard.capY + 0.030 };
const NB = { x: params.yard.tholosCx - params.yard.eaveR*0.86,
             y: params.yard.tholosApex
                + (params.yard.tholosEave - params.yard.tholosApex)*0.34 };
const NSAG = MODES.suspended.sag, NDROP = MODES.suspended.drop;

function loopAnchors(){
  const out = {};
  for (let k=0;k<params.loops;k++){
    const t = (k+0.5)/params.loops;
    const x = lerp(NA.x, NB.x, t);
    const y = lerp(NA.y, NB.y, t) + Math.sin(Math.PI*t)*NSAG;
    const drop = NDROP*((k%2) ? 1.24 : 1.0);
    out[`loop:${String(k+1).padStart(2,"0")}`] =
      { x: +clamp(x, 0, 1).toFixed(3), y: +clamp(y + drop, 0, 1).toFixed(3) };
  }
  return out;
}

/* ---------------- the asset ---------------- */

export const asset = {
  id:"prop.courtyard-execution-cable",
  type:"PROP",
  name:"Courtyard Execution Cable",
  statusWord:"SUSPENDED",
  scene:"OD-B22-S07",

  params,
  layers:["counts","noose-study","anchor-study","heaver-study","caliper","divider",
          "ground","pillar","round-house","stake","span","far-part","pillar-hitch",
          "stake-hitch","serving","seizings","nooses","load","sag-dim","clearance",
          "pull-arrows","coil","ledger"],

  // normalized 0..1 anchors, measured in the SUSPENDED state
  anchors:{
    "anchor:pillar-hitch": {x:.154, y:.502},   // round turn + two half hitches
    "anchor:stake":        {x:.920, y:.790},   // the far end made fast
    "bear:roof-haunch":    {x:.638, y:.544},   // where the part takes the roof
    "bear:roof-crown":     {x:.730, y:.476},
    "grip:standing-part":  {x:.300, y:.540},   // both hands to swig the line up
    "grip:hauling-part":   {x:.876, y:.676},
    "grip:tail":           {x:.128, y:.548},   // the stopped tail at the pillar
    "grip:heaver":         {x:.826, y:.256},
    "cut:point":           {x:.396, y:.573},   // the served length, mid-span
    "support:pillar-cap":  {x:.127, y:.452},
    "carry:coil":          {x:.224, y:.784},
    "contact:ground":      {x:.396, y:.800},
    "clearance:plumb":     {x:.416, y:.700},
    "camera:span":         {x:.396, y:.580},
    "camera:yard":         {x:.500, y:.650},
    "count:loops":         {x:.174, y:.065},
    "count:clear":         {x:.662, y:.065},
    ...loopAnchors(),
  },
  // collision: the working envelope — pillar face to stake, cable to floor
  collision:{ kind:"box", a:{x:.098, y:.435}, b:{x:.912, y:.806} },
  ownership:"house-of-odysseus · a hawser off one of Odysseus's dark-prowed "
          + "ships, carried up from the shore store. Rigged across the outer "
          + "court by Telemachus, who makes it fast to a pillar of the "
          + "colonnade and throws the far part over the round-house, setting "
          + "it high so that no foot can reach the ground",

  states:{
    initial:"coiled",
    nodes:{
      coiled:    { preview:{ mode:"coiled",    status:"COILED",    progress:0.05 } },
      anchored:  { preview:{ mode:"anchored",  status:"ANCHORED",  progress:0.24 } },
      tensioned: { preview:{ mode:"tensioned", status:"TAUT",      progress:0.44 } },
      looped:    { preview:{ mode:"looped",    status:"LOOPED",    progress:0.62 } },
      suspended: { preview:{ mode:"suspended", status:"SUSPENDED", progress:0.84 } },
      released:  { preview:{ mode:"released",  status:"CUT DOWN",  progress:1.00 } },
    },
    edges:[
      ["coiled","anchored"],["anchored","tensioned"],["tensioned","anchored"],
      ["tensioned","looped"],["looped","tensioned"],["looped","suspended"],
      ["suspended","released"],["looped","released"],["tensioned","released"],
      ["released","coiled"],
    ],
  },
  channels:["mode","loops","tension","sag","drop","clear","load","t","progress"],

  // CARD SIGNATURE — SUSPENDED: the hawser made fast under the pillar
  // capital, carried over the round-house to its stake, twelve nooses seized
  // on at station and drawn down, the lowest eye dimensioned clear of the yard.
  preview:()=>({ mode:"suspended", status:"SUSPENDED", progress:0.84, t:0 }),

  draw(ctx, W, H, state){
    draw(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
