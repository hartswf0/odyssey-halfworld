/* prop.odysseuss-bow — the great bow of Eurytus, kept in the storeroom.
   PROP asset. One reusable object: a palintone composite bow — horn belly,
   wood core, sinew back, spliced ears with bronze nock caps, corded grip —
   and the string that only its owner can seat.

   The whole crisis of Book XXI is in the state machine:
     stored    — reflexed in its case on a peg, string coiled off one ear
     carried   — lifted down and borne to the hall, tilted, case slung
     examined  — the inspection diagram: horn, core, sinew, joints, string path
     heated    — warmed at the brazier so the horn will yield (it does not)
     greased   — smeared with tallow, gloss on the belly (it still does not)
     bestowed  — laid flat across two hands; the ownership tally cuts its 3rd bar
     strung    — braced, the string seated, the double curve reversed
     drawn     — string to the full, limbs loaded
     shot      — released: limbs recoiling, string singing past brace

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B21-S01, OD-B21-S06. */
import { makePen, toneSolid, inkLevel, INK, clamp01, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const params = {
  lengthMM: 1550,          // declared scale: tip to tip, unstrung
  massG: 1250,
  drawWeightN: 400,        // "no man now living could bend it"
  limbs: 2, laminae: 3,
  horn: 2, core: 4, sinew: 5, bronze: 6, cord: 4, ivory: 1, leather: 3,
  halfLen: 0.415,          // half-length as a fraction of H
  ownerChain: ["eurytus", "iphitus", "odysseus"],
};

/* ---------- limb spine keyframes (unit L; grip at +x, string side at -x) ---------- */
const SHAPES = {
  reflex: [[ .34, 0], [ .26, -.30], [ .04, -.58], [-.32, -.76], [-.70, -.82]],
  braced: [[ .34, 0], [.315, -.32], [.215, -.62], [.075, -.84], [-.130, -.93]],
  drawn:  [[ .40, 0], [.390, -.31], [.330, -.61], [.190, -.85], [-.020, -.96]],
  loose:  [[ .28, 0], [.265, -.32], [.170, -.63], [.010, -.85], [-.185, -.93]],
};

function cr(p0, p1, p2, p3, t){
  const t2 = t*t, t3 = t2*t;
  const f = (a,b,c,d)=> .5*((2*b) + (-a+c)*t + (2*a-5*b+4*c-d)*t2 + (-a+3*b-3*c+d)*t3);
  return { x:f(p0[0],p1[0],p2[0],p3[0]), y:f(p0[1],p1[1],p2[1],p3[1]) };
}
function spine(key, n){
  const P = [key[0], ...key, key[key.length-1]], out = [];
  for (let i=0;i<n;i++){
    const seg = (i/(n-1))*(key.length-1);
    const k = Math.min(key.length-2, Math.floor(seg));
    out.push(cr(P[k], P[k+1], P[k+2], P[k+3], seg-k));
  }
  return out;
}
/* limb section width along the spine: thick at the grip fade, thin at the
   splice, swelling again into the stiff ear paddle */
const widthAt = u => .072 - .044*smooth(clamp01((u-.06)/.74)) + .014*smooth(clamp01((u-.84)/.16));

function limbGeom(key, L, n=54){
  const sp = spine(key, n).map(p=>({ x:p.x*L, y:p.y*L }));
  const back=[], belly=[], mid=[];
  for (let i=0;i<n;i++){
    const a = sp[Math.max(0,i-1)], b = sp[Math.min(n-1,i+1)];
    let tx=b.x-a.x, ty=b.y-a.y; const m=Math.hypot(tx,ty)||1; tx/=m; ty/=m;
    const nx=-ty, ny=tx, w = widthAt(i/(n-1))*L;
    back.push ({ x:sp[i].x+nx*w, y:sp[i].y+ny*w });
    belly.push({ x:sp[i].x-nx*w, y:sp[i].y-ny*w });
    mid.push  ({ x:sp[i].x, y:sp[i].y, nx, ny, w });
  }
  return { sp, back, belly, mid, n, L };
}
/* `cont` continues the current subpath instead of starting a new one — a band
   between two rails must be ONE closed ribbon, not two open strokes. */
function poly(g, pts, rev, cont){
  const a = rev ? pts.slice().reverse() : pts;
  if (cont) g.lineTo(a[0].x, a[0].y); else g.moveTo(a[0].x, a[0].y);
  for (let i=1;i<a.length;i++) g.lineTo(a[i].x, a[i].y);
}
const ribbon = (g, railA, railB) => { poly(g, railA); poly(g, railB, true, true); g.closePath(); };
const at = (G, u) => G.mid[Math.round(clamp01(u)*(G.n-1))];

/* ---------- seven-segment numerals: labels as GEOMETRY, never small type ---------- */
const SEG = [[1,1,1,1,1,1,0],[0,1,1,0,0,0,0],[1,1,0,1,1,0,1],[1,1,1,1,0,0,1],
             [0,1,1,0,0,1,1],[1,0,1,1,0,1,1],[1,0,1,1,1,1,1],[1,1,1,0,0,0,0],
             [1,1,1,1,1,1,1],[1,1,1,1,0,1,1]];
function segDigit(g, x, y, w, h, d, t){
  const s = SEG[d] || SEG[0], hh = h/2;
  const bars = [[x,y,w,t],[x+w-t,y,t,hh],[x+w-t,y+hh,t,hh],[x,y+h-t,w,t],
                [x,y+hh,t,hh],[x,y,t,hh],[x,y+hh-t/2,w,t]];
  g.fillStyle = INK;
  for (let i=0;i<7;i++) if (s[i]) g.fillRect(bars[i][0],bars[i][1],bars[i][2],bars[i][3]);
  if (d===1) g.fillRect(x + w*.20, y + h - t, w*.80, t);   // foot bar, so 1 ≠ a tick
}

/* ---------- the ownership tally: one bar per owner, the live one struck ---------- */
function ownerPlate(pen, g, x, y, s, n, struck){
  pen.paint(()=>{ g.rect(x, y, s*3.05, s*1.5); }, toneSolid(inkLevel(1)), 4);
  g.fillStyle = INK;
  for (let i=0;i<n;i++) g.fillRect(x + s*.42 + i*s*.78, y + s*.30, s*.24, s*.90);
  if (struck){
    g.strokeStyle = INK; g.lineWidth = Math.max(4, s*.15); g.lineCap="round";
    g.beginPath(); g.moveTo(x + s*.22, y + s*1.22); g.lineTo(x + s*2.86, y + s*.22); g.stroke();
  }
}

/* ---------- the bow itself, drawn in a local frame with the grip at (0,0) ---------- */
/* a rect in the limb's local frame at spine position u: half-extent `ww`
   across the limb, `e` along it. Returns the four corners. */
function bandQuad(G, u, ww, e){
  const m = at(G, u), tx = -m.ny, ty = m.nx;
  return [
    { x:m.x + m.nx*ww + tx*e, y:m.y + m.ny*ww + ty*e },
    { x:m.x + m.nx*ww - tx*e, y:m.y + m.ny*ww - ty*e },
    { x:m.x - m.nx*ww - tx*e, y:m.y - m.ny*ww - ty*e },
    { x:m.x - m.nx*ww + tx*e, y:m.y - m.ny*ww + ty*e },
  ];
}
function limbHalf(pen, g, G, o={}){
  const L = G.L, iE = Math.round(G.n*.885);
  // horn belly: ONE light plane with a hard contour — the limb reads by silhouette
  pen.paint(()=>{ ribbon(g, G.back, G.belly); },
            toneSolid(inkLevel(params.horn)), 5);
  // sinew back: a single thin dark accent along the outer edge
  const sinB = G.mid.map(m=>({ x:m.x+m.nx*m.w*.62, y:m.y+m.ny*m.w*.62 }));
  pen.fillPath(()=>{ ribbon(g, G.back, sinB); }, inkLevel(params.sinew));
  // the stiff ear, spliced on: bronze-capped paddle
  pen.paint(()=>{ ribbon(g, G.back.slice(iE), G.belly.slice(iE)); },
            toneSolid(inkLevel(params.sinew)), 4);
  // nock: a V cut into the string side of the tip
  const tp = G.mid[G.n-1], vx = -tp.ny, vy = tp.nx;
  pen.paint(()=>{
    const b = { x:tp.x - tp.nx*tp.w*1.05, y:tp.y - tp.ny*tp.w*1.05 };
    g.moveTo(b.x + vx*L*.030, b.y + vy*L*.030);
    g.lineTo(b.x + tp.nx*L*.040, b.y + tp.ny*L*.040);
    g.lineTo(b.x - vx*L*.030, b.y - vy*L*.030);
    g.closePath();
  }, toneSolid(inkLevel(0)), 3.2);
  // splice bindings at the joints the inspection exposes
  for (const u of [.28, .62, .805]){
    const q = bandQuad(G, u, at(G,u).w*1.18, L*.024);
    pen.paint(()=>{ poly(g, q); g.closePath(); }, toneSolid(inkLevel(params.cord)), 3.6);
    g.strokeStyle = INK; g.lineWidth = 2.2; g.lineCap="round";
    for (const k of [.28,.5,.72]){
      g.beginPath();
      g.moveTo(lerp(q[0].x,q[1].x,k), lerp(q[0].y,q[1].y,k));
      g.lineTo(lerp(q[3].x,q[2].x,k+.22), lerp(q[3].y,q[2].y,k+.22));
      g.stroke();
    }
  }
  if (o.gloss){ // tallow sheen on the belly
    for (const u of [.22,.40,.58,.74]){
      const m = at(G, u), tx=-m.ny, ty=m.nx;
      pen.paint(()=>{
        g.ellipse(m.x - m.nx*m.w*.45, m.y - m.ny*m.w*.45, L*.030, m.w*.30,
                  Math.atan2(ty,tx), 0, 7);
      }, toneSolid(inkLevel(0)), 2.2);
    }
  }
  if (o.heat){ // heat shimmer off the horn
    g.strokeStyle = inkLevel(3); g.lineWidth = 3; g.lineCap="round";
    for (const u of [.28,.46,.64]){
      const m = at(G, u);
      g.beginPath();
      let px = m.x - m.nx*m.w*1.5, py = m.y - m.ny*m.w*1.5;
      g.moveTo(px, py);
      for (let s=1;s<=4;s++) g.lineTo(px - L*.055*s, py + (s%2? L*.030 : -L*.030));
      g.stroke();
    }
  }
}

function gripBlock(pen, g, key, L, o={}){
  const gx = key[0][0]*L, w = widthAt(0)*L;
  pen.paint(()=>{ g.rect(gx - w*1.20, -L*.115, w*2.40, L*.230); },
            toneSolid(inkLevel(params.leather)), 5);
  g.strokeStyle = INK; g.lineWidth = 2.2; g.lineCap="round";
  for (let s=-L*.100; s<L*.095; s+=L*.040){
    g.beginPath(); g.moveTo(gx - w*1.20, s); g.lineTo(gx + w*1.20, s + L*.030); g.stroke();
  }
  // bolsters top and bottom — the raised ends of the wrap
  for (const sg of [-1,1])
    pen.paint(()=>{ g.rect(gx - w*1.34, sg*L*.115 - (sg>0?L*.022:0), w*2.68, L*.022); },
              toneSolid(inkLevel(params.leather)), 3.4);
  // ivory arrow-shelf plate on the belly side: the one bright note on the object
  pen.paint(()=>{ g.rect(gx - w*1.88, -L*.040, w*.80, L*.080); },
            toneSolid(inkLevel(params.ivory)), 4);
}

/* string: taut between the two nocks, optionally pulled to a draw point */
function nockOf(G){ const t = G.mid[G.n-1]; return { x:t.x - t.nx*t.w*.95, y:t.y - t.ny*t.w*.95 }; }

function stringTaut(pen, g, G, L, drawTo){
  const nu = nockOf(G), nl = { x:nu.x, y:-nu.y };
  const path = drawTo
    ? ()=>{ g.moveTo(nu.x,nu.y); g.lineTo(drawTo.x,drawTo.y); g.lineTo(nl.x,nl.y); }
    : ()=>{ g.moveTo(nu.x,nu.y); g.lineTo(nl.x,nl.y); };
  pen.ink(path, 5);
  // the served centre section + nocking point
  const c = drawTo || { x:(nu.x+nl.x)/2, y:0 };
  pen.ink(()=>{ g.moveTo(c.x - (c.x-nu.x)*.10, c.y - (c.y-nu.y)*.10);
                g.lineTo(c.x + (c.x-nu.x)*.10, c.y + (c.y-nu.y)*.10); }, 9);
  pen.paint(()=>{ g.rect(c.x - L*.018, c.y - L*.014, L*.036, L*.028); },
            toneSolid(inkLevel(params.horn)), 3);
  return { nu, nl, c };
}
function stringCoiled(pen, g, G, L){
  const nl = nockOf(G); const n = { x:nl.x, y:-nl.y };  // hangs off the LOWER ear
  // the loose string sags INSIDE the reflexed curve and ends in a coil
  pen.ink(()=>{ g.moveTo(n.x, n.y);
                g.bezierCurveTo(n.x + L*.26, n.y + L*.06, n.x + L*.52, n.y - L*.20,
                                n.x + L*.46, n.y - L*.44); }, 4);
  g.strokeStyle = INK; g.lineWidth = 4;
  for (let i=0;i<3;i++){
    g.beginPath(); g.ellipse(n.x + L*.46, n.y - L*.50 - i*L*.012, L*.075, L*.030, .18, 0, 7); g.stroke();
  }
}

/* ---------- state renderers ---------- */
function bowFrame(g, W, H, { cx, cy, L, rot=0 }){
  g.save(); g.translate(cx, cy); if (rot) g.rotate(rot);
  return ()=> g.restore();
}
function drawBody(pen, g, key, L, o={}){
  const G = limbGeom(key, L);
  if (o.string === "coiled") stringCoiled(pen, g, G, L);
  g.save(); g.scale(1,-1); limbHalf(pen, g, G, o); g.restore();   // lower half
  limbHalf(pen, g, G, o);                                          // upper half
  gripBlock(pen, g, key, L, o);
  let S = null;
  if (o.string === "taut")  S = stringTaut(pen, g, G, L, null);
  if (o.string === "drawn") S = stringTaut(pen, g, G, L, { x:-L*.62, y:0 });
  if (o.string === "loosed"){
    const nu = nockOf(G), nl = { x:nu.x, y:-nu.y };
    g.strokeStyle = inkLevel(3); g.lineWidth = 3.4;
    for (const b of [-.075, .055, -.030]){
      g.beginPath(); g.moveTo(nu.x,nu.y);
      g.quadraticCurveTo(nu.x + b*L*2.2, 0, nl.x, nl.y); g.stroke();
    }
    S = stringTaut(pen, g, G, L, null);
  }
  return { G, S };
}
function brokenFloor(pen, g, W, y){
  for (const [a,b] of [[.055,.30],[.345,.62],[.665,.945]])
    pen.ink(()=>{ g.moveTo(W*a, y); g.lineTo(W*b, y); }, 4);
}
function streaks(g, x, y, ang, n, len, gap){
  g.save(); g.translate(x,y); g.rotate(ang);
  g.strokeStyle = "rgba(0,0,0,0.24)"; g.lineCap="round";
  for (let i=0;i<n;i++){ g.lineWidth = 6-i*1.4;
    g.beginPath(); g.moveTo(i*gap, 0); g.lineTo(i*gap, len - i*len*.18); g.stroke(); }
  g.restore();
}

function drawStored(pen, g, W, H){
  const L = H*params.halfLen*.90, done = bowFrame(g, W, H, { cx:W*.50, cy:H*.48, L, rot:.10 });
  const G = limbGeom(SHAPES.reflex, L);
  // the shaped case, behind: a sleeve down the lower two thirds of both limbs
  const sleeve = (mirror)=>{
    g.save(); if (mirror) g.scale(1,-1);
    const a=[], b=[];
    for (let i=0;i<=Math.round(G.n*.74);i++){
      const m = G.mid[i], k = 2.5;
      a.push({ x:m.x+m.nx*m.w*k, y:m.y+m.ny*m.w*k });
      b.push({ x:m.x-m.nx*m.w*k, y:m.y-m.ny*m.w*k });
    }
    pen.paint(()=>{ ribbon(g, a, b); }, toneSolid(inkLevel(params.horn)), 5);
    g.strokeStyle = INK; g.lineWidth = 2.4;
    for (let i=6;i<a.length-4;i+=9){ g.beginPath(); g.moveTo(a[i].x,a[i].y); g.lineTo(b[i].x,b[i].y); g.stroke(); }
    g.restore();
  };
  sleeve(true); sleeve(false);
  stringCoiled(pen, g, G, L);
  g.save(); g.scale(1,-1); limbHalf(pen, g, G); g.restore();
  limbHalf(pen, g, G);
  gripBlock(pen, g, SHAPES.reflex, L);
  // peg + strap over the upper ear
  const tp = G.mid[G.n-1];
  pen.paint(()=>{ g.rect(tp.x - L*.075, tp.y - L*.20, L*.20, L*.055); },
            toneSolid(inkLevel(params.leather)), 4);
  pen.ink(()=>{ g.moveTo(tp.x + L*.010, tp.y - L*.145);
                g.bezierCurveTo(tp.x - L*.03, tp.y - L*.09, tp.x - L*.03, tp.y - L*.02, tp.x, tp.y); }, 4);
  ownerPlate(pen, g, SHAPES.reflex[0][0]*L + L*.14, L*.045, L*.085, 3, false);
  done();
  brokenFloor(pen, g, W, H*.925);
}

function drawCarried(pen, g, W, H){
  const L = H*params.halfLen*.84, done = bowFrame(g, W, H, { cx:W*.56, cy:H*.50, L, rot:.62 });
  streaks(g, -L*.62, L*.34, .62, 3, L*.34, 15);
  drawBody(pen, g, SHAPES.reflex, L, { string:"coiled" });
  // carry strap across the grip
  const gx = SHAPES.braced[0][0]*L;
  pen.paint(()=>{ g.rect(gx - widthAt(0)*L*1.7, -L*.048, widthAt(0)*L*3.4, L*.096); },
            toneSolid(inkLevel(params.leather)), 4);
  pen.ink(()=>{ g.moveTo(gx + widthAt(0)*L*1.7, -L*.030); g.lineTo(gx + L*.150, -L*.115);
                g.moveTo(gx + widthAt(0)*L*1.7,  L*.030); g.lineTo(gx + L*.135,  L*.125); }, 4);
  done();
}

function drawHeated(pen, g, W, H){
  const L = H*params.halfLen*.90, done = bowFrame(g, W, H, { cx:W*.47, cy:H*.49, L, rot:.06 });
  drawBody(pen, g, SHAPES.reflex, L, { string:"coiled", heat:true });
  ownerPlate(pen, g, SHAPES.reflex[0][0]*L + L*.14, L*.045, L*.085, 3, true);
  done();
  // dashed heat zone: two broken arcs, not a bar
  g.save(); g.setLineDash([12,12]);
  g.strokeStyle = inkLevel(3); g.lineWidth = 3;
  for (const r of [.30,.40]){
    g.beginPath(); g.arc(W*.20, H*.52, W*r, -1.05, 1.05); g.stroke();
  }
  g.setLineDash([]); g.restore();
  brokenFloor(pen, g, W, H*.925);
}

function drawGreased(pen, g, W, H){
  const L = H*params.halfLen*.90, done = bowFrame(g, W, H, { cx:W*.46, cy:H*.49, L, rot:-.05 });
  drawBody(pen, g, SHAPES.reflex, L, { string:"coiled", gloss:true });
  ownerPlate(pen, g, SHAPES.reflex[0][0]*L + L*.14, L*.045, L*.085, 3, true);
  done();
  // wipe arcs where the tallow was dragged along the belly
  g.strokeStyle = "rgba(0,0,0,0.26)"; g.lineWidth = 4; g.lineCap="round";
  for (let i=0;i<4;i++){
    g.beginPath(); g.arc(W*.30, H*(.34+i*.11), W*.115, -.85, .55); g.stroke();
  }
  brokenFloor(pen, g, W, H*.925);
}

function drawBestowed(pen, g, W, H){
  const L = H*params.halfLen*.62, done = bowFrame(g, W, H, { cx:W*.50, cy:H*.44, L, rot:Math.PI/2 });
  drawBody(pen, g, SHAPES.reflex, L, { string:"coiled" });
  done();
  // two open-hand contact brackets under the shaft: the guest-gift handover
  g.strokeStyle = INK; g.lineWidth = 7; g.lineCap="round";
  for (const x of [.30,.68]){
    g.beginPath();
    g.moveTo(W*x - W*.075, H*.575); g.lineTo(W*x - W*.075, H*.635);
    g.lineTo(W*x + W*.075, H*.635); g.lineTo(W*x + W*.075, H*.575); g.stroke();
  }
  // the tally cutting its third bar
  ownerPlate(pen, g, W*.395, H*.715, W*.068, 3, true);
  segDigit(g, W*.315, H*.712, 30, 52, 3, 10);
}

function drawStrung(pen, g, W, H){
  const L = H*params.halfLen, done = bowFrame(g, W, H, { cx:W*.50 - L*.105, cy:H*.50, L });
  drawBody(pen, g, SHAPES.braced, L, { string:"taut" });
  done();
}

function drawDrawn(pen, g, W, H){
  const L = H*params.halfLen, done = bowFrame(g, W, H, { cx:W*.50 + L*.11, cy:H*.50, L });
  drawBody(pen, g, SHAPES.drawn, L, { string:"drawn" });
  // draw-hand contact bracket at the nocking point
  g.strokeStyle = INK; g.lineWidth = 7; g.lineCap="round";
  g.beginPath();
  g.moveTo(-L*.70, -L*.085); g.lineTo(-L*.58, -L*.085);
  g.moveTo(-L*.70,  L*.085); g.lineTo(-L*.58,  L*.085);
  g.moveTo(-L*.70, -L*.085); g.lineTo(-L*.70,  L*.085); g.stroke();
  // load arrows: the limbs under strain
  g.strokeStyle = "rgba(0,0,0,0.30)"; g.lineWidth = 5;
  for (const sy of [-1,1]){
    g.beginPath(); g.moveTo(L*.40, sy*L*.62); g.lineTo(L*.56, sy*L*.62); g.stroke();
    g.beginPath(); g.moveTo(L*.56, sy*L*.62); g.lineTo(L*.49, sy*L*.575);
    g.lineTo(L*.49, sy*L*.665); g.closePath(); g.fillStyle="rgba(0,0,0,0.30)"; g.fill();
  }
  done();
}

function drawShot(pen, g, W, H){
  const L = H*params.halfLen, done = bowFrame(g, W, H, { cx:W*.50 - L*.05, cy:H*.50, L });
  drawBody(pen, g, SHAPES.loose, L, { string:"loosed" });
  // recoil arcs off both ears — the note the string makes
  g.strokeStyle = inkLevel(3); g.lineWidth = 3.4;
  for (const sy of [-1,1]) for (const r of [.10,.16,.22]){
    g.beginPath(); g.arc(-L*.06, sy*L*.97, L*r, sy>0? .5 : -2.0, sy>0? 2.2 : -.3); g.stroke();
  }
  done();
  streaks(g, W*.30, H*.50, -Math.PI/2, 3, W*.16, 15);
}

/* ---------- the inspection diagram: OD-B21-S06 close performance ---------- */
function drawExamined(pen, g, W, H){
  const L = H*.360, bx = W*.400, by = H*.460;
  const done = bowFrame(g, W, H, { cx:bx, cy:by, L });
  drawBody(pen, g, SHAPES.braced, L, { string:"taut" });
  // string path: dashed seating loops around each ear
  g.save(); g.setLineDash([9,9]); g.strokeStyle = INK; g.lineWidth = 2.6;
  for (const sy of [-1,1]){
    g.beginPath(); g.arc(-L*.13, sy*L*.93, L*.070, 0, 7); g.stroke();
  }
  g.setLineDash([]); g.restore();
  // familiar handling: contact brackets flanking the grip, clear of it
  g.strokeStyle = INK; g.lineWidth = 6; g.lineCap="round";
  for (const sy of [-1,1]){
    g.beginPath();
    g.moveTo(L*.235, sy*L*.230); g.lineTo(L*.235, sy*L*.170);
    g.lineTo(L*.445, sy*L*.170); g.lineTo(L*.445, sy*L*.230); g.stroke();
  }
  done();

  // ---- leader lines: bow feature -> legend row, ordered so none cross ----
  const rowY = i => H*(.150 + i*.128);
  const FEAT = [
    [-.115, -.905],   // 1  ear + bronze nock
    [ .150, -.700],   // 2  sinew back
    [ .285, -.400],   // 3  horn belly
    [-.130,  0    ],  // 4  string + serving
    [ .200,  .620],   // 5  splice binding
  ];
  FEAT.forEach((p,i)=>{
    const sx = bx + p[0]*L, sy = by + p[1]*L, ty = rowY(i) + 27;
    g.strokeStyle = INK; g.lineWidth = 2.6;
    g.beginPath(); g.arc(sx, sy, 6, 0, 7); g.fillStyle = INK; g.fill();
    g.beginPath(); g.moveTo(sx, sy); g.lineTo(W*.665, ty); g.lineTo(W*.700, ty); g.stroke();
    segDigit(g, W*.715, rowY(i), 30, 54, i+1, 10);
    const sx0 = W*.800, sy0 = rowY(i)+12, sw = W*.110, sh = 32;
    if (i===3){                       // the string: a rule, not a solid block
      pen.paint(()=>{ g.rect(sx0, sy0, sw, sh); }, toneSolid(inkLevel(0)), 3.4);
      pen.ink(()=>{ g.moveTo(sx0+6, sy0+sh/2); g.lineTo(sx0+sw-6, sy0+sh/2); }, 8);
    } else {
      pen.paint(()=>{ g.rect(sx0, sy0, sw, sh); },
                toneSolid(inkLevel([params.bronze, params.sinew, params.horn, 0, params.cord][i])), 3.4);
    }
  });

  // ---- cross-section inset, bottom left: the three laminae, numbered ----
  const cxs = W*.215, cys = H*.795, rr = W*.085;
  pen.paint(()=>{ g.ellipse(cxs, cys, rr, rr*.66, 0, 0, 7); }, toneSolid(inkLevel(params.horn)), 5);
  pen.fillPath(()=>{ g.ellipse(cxs, cys - rr*.14, rr*.82, rr*.26, 0, 0, 7); }, inkLevel(params.core));
  pen.paint(()=>{ g.moveTo(cxs - rr*.92, cys - rr*.50);
                  g.quadraticCurveTo(cxs, cys - rr*.92, cxs + rr*.92, cys - rr*.50);
                  g.quadraticCurveTo(cxs, cys - rr*.60, cxs - rr*.92, cys - rr*.50);
                  g.closePath(); }, toneSolid(inkLevel(params.sinew)), 3);
  segDigit(g, cxs - rr*.22, cys - rr*1.85, 26, 46, 2, 9);   // sinew back
  segDigit(g, cxs - rr*1.90, cys - rr*.42, 26, 46, 6, 9);   // wood core
  segDigit(g, cxs - rr*.22, cys + rr*1.15, 26, 46, 3, 9);   // horn belly
  g.strokeStyle = INK; g.lineWidth = 2.6;
  g.beginPath(); g.moveTo(cxs, cys - rr*.74); g.lineTo(cxs, cys - rr*1.24); g.stroke();
  g.beginPath(); g.moveTo(cxs - rr*.68, cys - rr*.16); g.lineTo(cxs - rr*1.30, cys - rr*.19); g.stroke();
  g.beginPath(); g.moveTo(cxs, cys + rr*.44); g.lineTo(cxs, cys + rr*1.05); g.stroke();
  // ownership tally, top right
  ownerPlate(pen, g, W*.760, H*.845, W*.055, 3, false);
}

const MODES = {
  stored:drawStored, carried:drawCarried, examined:drawExamined, heated:drawHeated,
  greased:drawGreased, bestowed:drawBestowed, strung:drawStrung, drawn:drawDrawn, shot:drawShot,
};

export const asset = {
  id:"prop.odysseuss-bow",
  type:"PROP",
  name:"Odysseus's Bow",
  statusWord:"EXAMINED",
  scene:"OD-B21-S01",

  params,
  layers:["case","string-coil","limb-lower","limb-upper","core","sinew","ears",
          "bindings","grip","ivory-plate","string","owner-tally","callouts","inset"],

  // normalized 0..1 anchors, measured in the canonical STRUNG frame
  anchors:{
    grip:{x:.587,y:.500},              // the hand that holds the bow
    "grip:draw":{x:.413,y:.500},       // the hand that takes the string
    "nock:upper":{x:.413,y:.098},
    "nock:lower":{x:.413,y:.902},
    "joint:upper":{x:.537,y:.231},
    "joint:lower":{x:.537,y:.769},
    "string:centre":{x:.413,y:.500},   // nocking point / arrow seat
    shelf:{x:.560,y:.500},             // ivory arrow shelf
    "contact:ground":{x:.440,y:.930},  // lower ear when the bow is stood up
    "contact:peg":{x:.470,y:.075},     // storeroom peg
    carry:{x:.587,y:.500},             // balance point when borne
  },
  collision:{ kind:"capsule", a:{x:.45,y:.09}, b:{x:.45,y:.91}, r:.09 },

  // ownership is a channel, not a colour: the tally plate carries the chain
  ownership:"odysseus",
  ownershipChain:params.ownerChain,   // eurytus -> iphitus -> odysseus

  states:{
    initial:"stored",
    nodes:{
      stored:  { preview:{ mode:"stored",   status:"STORED",   progress:0.05, owner:3 } },
      carried: { preview:{ mode:"carried",  status:"CARRIED",  progress:0.18, owner:3 } },
      examined:{ preview:{ mode:"examined", status:"EXAMINED", progress:0.50, owner:3 } },
      heated:  { preview:{ mode:"heated",   status:"WARMED",   progress:0.32, owner:0 } },
      greased: { preview:{ mode:"greased",  status:"GREASED",  progress:0.38, owner:0 } },
      bestowed:{ preview:{ mode:"bestowed", status:"BESTOWED", progress:0.12, owner:3 } },
      strung:  { preview:{ mode:"strung",   status:"STRUNG",   progress:0.72, owner:3 } },
      drawn:   { preview:{ mode:"drawn",    status:"DRAWN",    progress:0.90, owner:3 } },
      shot:    { preview:{ mode:"shot",     status:"LOOSED",   progress:1.00, owner:3 } },
    },
    edges:[
      ["stored","carried"],["carried","examined"],["examined","heated"],
      ["heated","greased"],["greased","examined"],["examined","strung"],
      ["strung","drawn"],["drawn","shot"],["shot","drawn"],["shot","strung"],
      ["bestowed","stored"],["carried","stored"],["examined","carried"],
      ["strung","examined"],
    ],
  },
  channels:["mode","flex","owner","progress","t"],

  // CARD SIGNATURE — EXAMINED: the OD-B21-S06 close performance. The braced
  // bow at left with its string path called out, the three laminae opened in
  // cross-section, the two hand brackets of a man who has held this before.
  preview:()=>({ mode:"examined", status:"EXAMINED", progress:0.50, owner:3, t:0 }),

  draw(ctx, W, H, state){
    const pen = makePen(ctx, { outline:true });
    (MODES[(state&&state.mode)] || drawExamined)(pen, ctx, W, H);
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
