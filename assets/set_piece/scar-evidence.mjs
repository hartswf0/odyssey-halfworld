/* set_piece.scar-evidence — the SPOKEN proof: the scar as reported speech.
   SET_PIECE. Third and last instrument built on the same body fact, and the
   only one where the marker is never actually present:
     · set_piece.boar-scar   the welt the hand FINDS in the dark
     · set_piece.scar-proof  the welt the owner OPENS to named witnesses
     · this                  the welt QUOTED — carried upstairs in a nurse's
                             mouth, arriving as a claim, not as a thing.

   So the plate is a TRANSCRIPT, not an exhibit. The limb is drawn as a dashed
   GHOST outline (described, not shown); only the WELT is solid, because the
   welt is the one part of the body that made it into the sentence. The whole
   excerpt sits inside a QUOTE panel with corner brackets and two blocky speech
   glyphs — reported, second-hand.

   Under it runs the RELAY: basin (where the hand found it) -> mouth (the
   telling) -> stair (the threshold it is carried over) -> ear (the hearing).
   The chain DEGRADES as it travels: heavy from the basin, medium from the
   mouth, dashed across the last leg, and what arrives at the ear is a small
   hollow COPY of the welt — the proof reduced to a report.

   The ledger closes the argument the way Book XXIII does: TOLD is struck,
   HEARD is struck, ACCEPTED is never struck. A HOLD bar lies across it and the
   RESERVE token is sealed instead — the listener keeps her own test. This
   object connects the nurse's recognition to the decision WITHOUT making it:
   the empty third box is the whole point.

   States: untold / spoken / heard / doubted / reserved.
   Solid tones + hard contour only; the engine dotify pass supplies the halftone.
   Atlas: OD-B23-S01 — spoken proof object connecting nurse recognition to
   Penelope's decision without replacing her own test. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth, rnd } from "../../engine/halfworld-engine.mjs";

/* ---- normalized layout: draw() and anchors share these fractions of W,H ---- */
const L = {
  qx0:  0.200, qx1: 0.790,        // the quote panel (the excerpt, as quoted)
  qy0:  0.098, qy1: 0.428,
  skew: 0.040,                    // *W  panel and limb lean right going down

  limbX: 0.492, limbHW: 0.148,    // the described limb, drawn only as a ghost
  weltV0: 0.150, weltV1: 0.870,   // welt entry / exit down the panel
  weltK0: 0.190, weltK1: 0.790,   // and across the limb (0 outer .. 1 inner)

  quoteAx: 0.238, quoteAy: 0.126, // the two speech glyphs, hugging the excerpt
  quoteBx: 0.716, quoteBy: 0.336,

  basinX: 0.124, basinY: 0.495,   // RELAY station 0 — the hand in the water
  mouthX: 0.352, mouthY: 0.640,   // RELAY station 1 — the telling
  stairX: 0.585, stairY: 0.512,   // RELAY station 2 — carried over the threshold
  earX:   0.860, earY:   0.630,   // RELAY station 3 — the hearing

  copyX: 0.672, copyY: 0.688,     // what actually arrives: a hollow copy
  copyR: 0.062,

  ledX:  0.068, ledY: 0.722,      // ledger of three boxes
  ledW:  0.113, ledH: 0.052, ledGap: 0.042,

  resX:  0.800, resY: 0.780,      // the test she keeps for herself
  ruleX: 0.955, markX: 0.048,
  indexX:0.068, indexY: 0.858,
};

const params = {
  weltW:    0.048,  // *W  half-width of the raised welt at its fattest
  seamW:    0.010,  // *W  half-width of the dark seam core
  puckers:  6,
  links:    3,      // relay legs: basin->mouth->stair->ear
  emits:    3,      // arcs off the speaking mouth
  whorls:   3,      // arcs inside the listening ear
  ghost:    true,   // the limb is described, never shown
  rule:     true,
  index:    true,
};

/* ---------- shared geometry ---------- */
function profile(keys, u){
  u = clamp(u, 0, 1);
  for (let i=0;i<keys.length-1;i++){
    const [u0,v0]=keys[i], [u1,v1]=keys[i+1];
    if (u<=u1) return lerp(v0, v1, smooth((u-u0)/Math.max(1e-6,u1-u0)));
  }
  return keys[keys.length-1][1];
}
const TAPER_P = [[0,1.00],[0.36,0.97],[0.72,0.90],[1,0.83]];

function geom(W,H){
  const qy0 = L.qy0*H, qy1 = L.qy1*H, sk = L.skew*W;
  const vY = v => lerp(qy0, qy1, v);
  const sX = v => sk*clamp(v,-0.4,1.4);
  const panL = v => L.qx0*W + sX(v);
  const panR = v => L.qx1*W + sX(v);
  const cAt  = v => L.limbX*W + sX(v);
  const hw   = v => L.limbHW*W*profile(TAPER_P, v);
  return {
    qy0, qy1, vY, sX, panL, panR, cAt, hw,
    lAt: v => cAt(v)-hw(v),
    rAt: v => cAt(v)+hw(v),
    across: (v,k) => cAt(v) + hw(v)*(k*2-1),
    panPath: (g, pad=0) => {
      g.moveTo(panL(0)-pad, vY(0)-pad);
      g.lineTo(panR(0)+pad, vY(0)-pad);
      g.lineTo(panR(1)+pad, vY(1)+pad);
      g.lineTo(panL(1)-pad, vY(1)+pad);
      g.closePath();
    },
  };
}

const qb = (p0,p1,p2,t)=>{ const m=1-t; return {
  x: m*m*p0.x + 2*m*t*p1.x + t*t*p2.x, y: m*m*p0.y + 2*m*t*p1.y + t*t*p2.y }; };

/* the welt centreline — a shallow arc kept wholly inside the ghost limb */
function weltLine(G, N=30){
  const a = { x: G.across(L.weltV0, L.weltK0), y: G.vY(L.weltV0) };
  const c = { x: G.across(L.weltV1, L.weltK1), y: G.vY(L.weltV1) };
  const vm = (L.weltV0+L.weltV1)/2;
  const b = { x: G.across(vm, 0.36), y: G.vY(vm) };
  const pts=[];
  for (let i=0;i<=N;i++){
    const t=i/N, p=qb(a,b,c,t), q=qb(a,b,c,Math.min(1,t+0.005));
    let dx=q.x-p.x, dy=q.y-p.y; const m=Math.hypot(dx,dy)||1; dx/=m; dy/=m;
    pts.push({ x:p.x, y:p.y, nx:-dy, ny:dx, t });
  }
  return pts;
}
const taper = t => Math.pow(Math.sin(Math.PI*clamp(t,0,1)), 0.5);
function ribbon(g, pts, widthAt){
  const up=[], dn=[];
  for (const p of pts){ const w=widthAt(p.t);
    up.push({ x:p.x+p.nx*w, y:p.y+p.ny*w }); dn.push({ x:p.x-p.nx*w, y:p.y-p.ny*w }); }
  g.moveTo(up[0].x, up[0].y);
  for (let i=1;i<up.length;i++) g.lineTo(up[i].x, up[i].y);
  for (let i=dn.length-1;i>=0;i--) g.lineTo(dn[i].x, dn[i].y);
  g.closePath();
}
const shift = (pts,d) => pts.map(p=>({ ...p, x:p.x+p.nx*d, y:p.y+p.ny*d }));

/* seven-segment numerals as GEOMETRY — small type dissolves in the lattice */
const SEG = {
  0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
  4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1], 6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
  8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1],
};
function sevenSeg(pen, g, x, y, w, h, d, th, tone){
  const s = SEG[d] || SEG[8], hh = h/2, gp = th*0.6;
  const bar=(bx,by,bw,bh)=> pen.paint(()=>{ g.rect(bx,by,bw,bh); }, toneSolid(inkLevel(tone)), 3);
  if (d===1){ // a bare pair of verticals dissolves — give the 1 a stem, foot and serif
    bar(x+w/2-th/2, y,          th,       h);
    bar(x+gp*0.5,   y+h-th,     w-gp,     th);
    bar(x+gp*0.5,   y,          w/2-th/2, th);
    return;
  }
  if(s[0]) bar(x+gp,   y,           w-gp*2, th);
  if(s[1]) bar(x+w-th, y+gp,        th,     hh-gp*1.7);
  if(s[2]) bar(x+w-th, y+hh+gp*0.7, th,     hh-gp*1.7);
  if(s[3]) bar(x+gp,   y+h-th,      w-gp*2, th);
  if(s[4]) bar(x,      y+hh+gp*0.7, th,     hh-gp*1.7);
  if(s[5]) bar(x,      y+gp,        th,     hh-gp*1.7);
  if(s[6]) bar(x+gp,   y+hh-th*0.5, w-gp*2, th);
}

/* ---------- the plate ---------- */
function drawEvidence(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx, t = st.t||0;
  const mode = st.mode || "heard";     // untold | spoken | heard | doubted | reserved
  const DEF = {
    untold:  ["panel","bracket","glyph","limb-ghost","welt","seam","pucker","basin",
              "chain","station","ledger","reserve-slot","rule","marks","index"],
    spoken:  ["panel","bracket","glyph","limb-ghost","welt","seam","pucker","basin",
              "chain","station","emit","ledger","reserve-slot","rule","marks","index"],
    heard:   ["panel","bracket","glyph","limb-ghost","welt","seam","pucker","basin",
              "chain","station","emit","whorl","copy","ledger","reserve-slot","rule","marks","index"],
    doubted: ["panel","bracket","glyph","limb-ghost","welt","seam","pucker","basin",
              "chain","station","emit","whorl","copy","ledger","hold","reserve-slot",
              "rule","marks","index"],
    reserved:["panel","bracket","glyph","limb-ghost","welt","seam","pucker","basin",
              "chain","station","emit","whorl","copy","ledger","hold","reserve",
              "rule","marks","index"],
  };
  const layers = st.layers || DEF[mode] || DEF.heard;
  const has = l => layers.includes(l);
  /* how far the claim has travelled along the relay, 0..3 */
  const REACH = { untold:0.30, spoken:1.55, heard:3, doubted:3, reserved:3 };
  const reach = st.reach!=null ? st.reach : (REACH[mode] ?? 3);

  const G = geom(W,H);
  const pts = weltLine(G);
  const belly = pts[Math.round(pts.length/2)];

  const REL = [
    { x:L.basinX*W, y:L.basinY*H },
    { x:L.mouthX*W, y:L.mouthY*H },
    { x:L.stairX*W, y:L.stairY*H },
    { x:L.earX*W,   y:L.earY*H   },
  ];

  /* ================= QUOTE PANEL — the excerpt, held as speech =================
     A leaning parallelogram: the two sides carry the hard contour, top and
     bottom are torn and broken in the middle so no black bar crosses the plate. */
  if (has("panel")){
    pen.fillPath(()=>{ G.panPath(g); }, inkLevel(1));
    g.save(); g.strokeStyle=INK; g.lineWidth=6; g.lineCap="round"; g.lineJoin="round";
    for (const side of [-1,1]){
      const ex = v => side<0 ? G.panL(v) : G.panR(v);
      g.beginPath(); g.moveTo(ex(0), G.vY(0)); g.lineTo(ex(1), G.vY(1)); g.stroke();
    }
    g.lineWidth=4.5;
    for (const [v,dir,gap0,gap1] of [[0,-1,0.34,0.60],[1,1,0.40,0.66]]){
      const rr = rnd(v?4409:1601);
      for (const [a,b] of [[0,gap0],[gap1,1]]){
        g.beginPath();
        for (let i=0;i<=8;i++){
          const f = lerp(a,b,i/8);
          const x = lerp(G.panL(v), G.panR(v), f);
          const y = G.vY(v) + dir*(i%2 ? H*0.010 : H*0.002) + rr()*H*0.005*dir;
          i?g.lineTo(x,y):g.moveTo(x,y);
        }
        g.stroke();
      }
    }
    g.restore();
  }

  /* ---- GUTTER: a stepped shade down the inside of the panel, in three broken
          runs, so the field has depth without a bar crossing it ---- */
  if (has("panel")){
    for (const [va,vb,lv,k] of [[0.04,0.30,3,0.30],[0.38,0.62,2,0.22],[0.70,0.96,3,0.26]]){
      pen.fillPath(()=>{
        g.moveTo(G.panL(va), G.vY(va));
        g.lineTo(G.panL(va)+W*k*0.18, G.vY(va));
        g.lineTo(G.panL(vb)+W*k*0.18, G.vY(vb));
        g.lineTo(G.panL(vb), G.vY(vb));
        g.closePath();
      }, inkLevel(lv));
    }
  }

  /* ---- LIMB GHOST: the body is described, not present — so it is a HOLE in
          the report: paper where flesh would be, with a dashed contour. ---- */
  if (has("limb-ghost") && params.ghost){
    const N=26, v0=0.02, v1=0.98;
    pen.fillPath(()=>{
      g.moveTo(G.lAt(v0), G.vY(v0));
      for (let i=1;i<=N;i++){ const v=lerp(v0,v1,i/N); g.lineTo(G.lAt(v), G.vY(v)); }
      for (let i=N;i>=0;i--){ const v=lerp(v0,v1,i/N); g.lineTo(G.rAt(v), G.vY(v)); }
      g.closePath();
    }, inkLevel(0));
    g.save(); g.strokeStyle=INK; g.lineWidth=5; g.globalAlpha=0.85;
    g.setLineDash([W*0.030, W*0.022]); g.lineCap="butt";
    for (const edge of [G.lAt, G.rAt]){
      g.beginPath();
      for (let i=0;i<=N;i++){ const v=lerp(v0,v1,i/N);
        i?g.lineTo(edge(v), G.vY(v)):g.moveTo(edge(v), G.vY(v)); }
      g.stroke();
    }
    // crop ticks at the two ends — the citation is an excerpt, not a whole leg
    g.setLineDash([]); g.globalAlpha=1; g.lineWidth=6;
    for (const v of [v0, v1]){
      for (const [k0,k1] of [[0.00,0.22],[0.78,1.00]]){
        g.beginPath();
        g.moveTo(G.across(v,k0), G.vY(v)); g.lineTo(G.across(v,k1), G.vY(v)); g.stroke();
      }
    }
    g.restore();
  }

  /* ---- WELT / SEAM / PUCKER: the one part of the body inside the sentence ---- */
  if (has("welt")){
    pen.paint(()=>{ ribbon(g, pts, tt => params.weltW*W*taper(tt)); }, toneSolid(inkLevel(2)), 4);
    pen.fillPath(()=>{ ribbon(g, shift(pts, params.weltW*W*0.48),
      tt => params.weltW*W*0.13*taper(tt)); }, inkLevel(0));
  }
  if (has("seam")){
    pen.paint(()=>{ ribbon(g, pts, tt => params.seamW*W*taper(tt)); }, toneSolid(inkLevel(6)), 2.5);
  }
  if (has("pucker")){
    g.save(); g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
    for (let i=0;i<params.puckers;i++){
      const tt = 0.16 + 0.70*(i/(params.puckers-1));
      const p = pts[Math.round(tt*(pts.length-1))];
      const s = (i%2===0)?1:-1;
      const a = params.seamW*W*taper(tt)*1.3, b = params.weltW*W*taper(tt)*0.86;
      if (b<=a) continue;
      g.beginPath(); g.moveTo(p.x+p.nx*a*s, p.y+p.ny*a*s);
      g.lineTo(p.x+p.nx*b*s, p.y+p.ny*b*s); g.stroke();
    }
    g.restore();
  }

  /* ---- BRACKETS: the excerpt registered at its corners, never boxed in ---- */
  if (has("bracket")){
    g.save(); g.strokeStyle=INK; g.lineWidth=6; g.lineCap="butt"; g.lineJoin="miter";
    const a=W*0.052, b=H*0.030;
    for (const [v,side] of [[0,-1],[0,1],[1,-1],[1,1]]){
      const cx = side<0 ? G.panL(v)-W*0.022 : G.panR(v)+W*0.022;
      const cy = G.vY(v) + (v===0 ? -H*0.020 : H*0.020);
      const dy = v===0 ? 1 : -1;
      g.beginPath();
      g.moveTo(cx + side*a, cy);
      g.lineTo(cx, cy);
      g.lineTo(cx, cy + dy*b);
      g.stroke();
    }
    g.restore();
  }

  /* ---- GLYPHS: two blocky speech marks — this is a quotation ---- */
  if (has("glyph")){
    const mark = (px,py,dir)=>{
      const u = W*0.036;
      for (let i=0;i<2;i++){
        const ox = px + i*u*1.75*dir;
        pen.paint(()=>{                                 // blocky head
          g.moveTo(ox,          py);
          g.lineTo(ox + dir*u,  py);
          g.lineTo(ox + dir*u,  py + u*1.05);
          g.lineTo(ox,          py + u*1.05);
          g.closePath();
        }, toneSolid(inkLevel(7)), 3.4);
        pen.paint(()=>{                                 // the tail that makes it a comma
          g.moveTo(ox + dir*u*0.10, py + u*1.05);
          g.lineTo(ox + dir*u,      py + u*1.05);
          g.lineTo(ox + dir*u*0.34, py + u*2.05);
          g.closePath();
        }, toneSolid(inkLevel(7)), 3.4);
      }
    };
    mark(L.quoteAx*W, L.quoteAy*H,  1);
    mark(L.quoteBx*W, L.quoteBy*H, -1);
  }

  /* ================= RELAY CHAIN — the claim, degrading as it travels ======== */
  const PAD = [0.072, 0.100, 0.092, 0.096];        // keep clear of each station glyph
  if (has("chain")){
    for (let i=0;i<params.links;i++){
      const u = clamp(reach - i, 0, 1);
      if (u<=0.001) continue;
      const A = REL[i], B = REL[i+1];
      const ex = lerp(A.x,B.x,u), ey = lerp(A.y,B.y,u);
      let dx=B.x-A.x, dy=B.y-A.y; const m=Math.hypot(dx,dy)||1; dx/=m; dy/=m;
      const nx=-dy, ny=dx;
      const p0 = W*PAD[i], p1 = W*PAD[i+1];
      const sx = A.x+dx*p0, sy = A.y+dy*p0;
      const last = (i===params.links-1);           // the last leg is hearsay: dashed
      g.save(); g.strokeStyle=INK; g.lineCap="round";
      g.lineWidth = last ? 3.6 : (i===0 ? 7.5 : 5.5);
      g.globalAlpha = last ? 0.72 : 1;
      g.setLineDash(last ? [W*0.024, W*0.020] : []);
      g.beginPath(); g.moveTo(sx,sy);
      g.lineTo(ex - (u>=1?dx*p1:0), ey - (u>=1?dy*p1:0)); g.stroke();
      g.restore();
      // one chevron per leg: the direction of the telling
      const cf = lerp(PAD[i]*W/m, 1-p1/m, 0.55)*u + (1-u)*0.4;
      const mxp = lerp(A.x,B.x,clamp(cf,0.18,0.82)), myp = lerp(A.y,B.y,clamp(cf,0.18,0.82));
      const cw = W*(last?0.019:0.023);
      pen.fillPath(()=>{
        g.moveTo(mxp+dx*cw*2.5, myp+dy*cw*2.5);
        g.lineTo(mxp-dx*cw*0.7+nx*cw*0.88, myp-dy*cw*0.7+ny*cw*0.88);
        g.lineTo(mxp-dx*cw*0.7-nx*cw*0.88, myp-dy*cw*0.7-ny*cw*0.88);
        g.closePath();
      }, inkLevel(last?5:7));
    }
  }

  /* ---- STATIONS: basin, mouth, stair, ear — instruments, never figures ---- */
  if (has("basin")){
    const cx=REL[0].x, cy=REL[0].y, bw=W*0.062, bh=H*0.034;
    pen.paint(()=>{                                   // the foot-bath: a shallow bowl
      g.moveTo(cx-bw, cy-bh*0.62);
      g.lineTo(cx+bw, cy-bh*0.62);
      g.lineTo(cx+bw*0.62, cy+bh*0.86);
      g.lineTo(cx-bw*0.62, cy+bh*0.86);
      g.closePath();
    }, toneSolid(inkLevel(1)), 5);
    g.save(); g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="round";
    for (let i=0;i<2;i++){                            // water, broken into ripples
      const yy = cy - bh*0.16 + i*bh*0.44, s = bw*(0.72-i*0.16);
      g.beginPath();
      for (let j=0;j<=6;j++){
        const x = cx - s + (2*s)*(j/6), y = yy + (j%2?H*0.005:-H*0.004);
        j?g.lineTo(x,y):g.moveTo(x,y);
      }
      g.stroke();
    }
    g.restore();
    // the contact: where the hand met the ridge, a solid tick with a short riser
    g.save(); g.strokeStyle=INK; g.lineWidth=6; g.lineCap="butt";
    g.beginPath(); g.moveTo(cx, cy-bh*1.55); g.lineTo(cx, cy-bh*0.80); g.stroke();
    g.beginPath(); g.moveTo(cx-W*0.020, cy-bh*1.55); g.lineTo(cx+W*0.020, cy-bh*1.55); g.stroke();
    g.restore();
  }

  if (has("station")){
    /* MOUTH — the telling. An aperture with a dark interior; no face. */
    const mx=REL[1].x, my=REL[1].y, mw=W*0.048, mh=H*0.034;
    const open = reach>=1;
    if (open){
      pen.paint(()=>{                                 // an open speaking aperture
        g.moveTo(mx-mw, my);
        g.quadraticCurveTo(mx, my-mh*2.30, mx+mw, my);
        g.quadraticCurveTo(mx, my+mh*2.30, mx-mw, my);
        g.closePath();
      }, toneSolid(inkLevel(0)), 5);
      pen.paint(()=>{ g.ellipse(mx, my, mw*0.40, mh*0.74, 0, 0, 7); },
        toneSolid(inkLevel(5)), 2.6);
      g.save(); g.strokeStyle=INK; g.lineWidth=5; g.lineCap="round";
      for (const s of [-1,1]){                        // lip corners: a mouth, not an eye
        g.beginPath(); g.moveTo(mx+s*mw, my); g.lineTo(mx+s*mw*1.40, my-mh*0.34); g.stroke();
      }
      g.restore();
    } else {
      g.save(); g.strokeStyle=INK; g.lineWidth=6; g.lineCap="round";
      g.beginPath(); g.moveTo(mx-mw, my); g.lineTo(mx+mw, my); g.stroke();
      g.restore();
    }
    if (has("emit")){        // a narrow fan, aimed up the stair the words go
      const a0 = Math.atan2(REL[2].y-my, REL[2].x-mx);
      g.save(); g.strokeStyle=INK; g.lineWidth=4.6; g.globalAlpha=0.92; g.lineCap="round";
      for (let i=0;i<params.emits;i++){
        const r = mw*(1.34+i*0.32)*(1+0.03*Math.sin(t*2.1+i));
        g.beginPath(); g.arc(mx, my, r, a0-0.52, a0+0.52); g.stroke();
      }
      g.restore();
    }

    /* STAIR — the threshold the claim is carried over. Three separate treads. */
    const sx=REL[2].x, sy=REL[2].y, tw=W*0.040, th2=H*0.019;
    for (let i=0;i<3;i++){
      pen.paint(()=>{ g.rect(sx-tw*1.5+i*tw, sy+th2*1.1-i*th2*1.15, tw*0.92, th2); },
        toneSolid(inkLevel(i===2?3:1)), 4);
    }
    g.save(); g.strokeStyle=INK; g.lineWidth=5; g.lineCap="butt";   // the door jamb
    g.beginPath(); g.moveTo(sx+tw*1.72, sy-th2*1.7); g.lineTo(sx+tw*1.72, sy+th2*1.0); g.stroke();
    g.beginPath(); g.moveTo(sx+tw*1.20, sy-th2*1.7); g.lineTo(sx+tw*1.72, sy-th2*1.7); g.stroke();
    g.restore();

    /* EAR — the hearing. Nested arcs, opening back toward the stair. */
    const ex=REL[3].x, ey=REL[3].y, er=W*0.058;
    pen.paint(()=>{
      g.moveTo(ex+er*0.34, ey-er*1.16);
      g.quadraticCurveTo(ex+er*1.12, ey-er*0.30, ex+er*0.52, ey+er*1.08);
      g.quadraticCurveTo(ex-er*0.34, ey+er*0.72, ex-er*0.30, ey-er*0.28);
      g.quadraticCurveTo(ex-er*0.22, ey-er*1.12, ex+er*0.34, ey-er*1.16);
      g.closePath();
    }, toneSolid(inkLevel(1)), 5);
    if (has("whorl")){
      g.save(); g.strokeStyle=INK; g.lineWidth=3.6; g.lineCap="round";
      for (let i=0;i<params.whorls;i++){
        const r = er*(0.24+i*0.26);
        g.beginPath(); g.arc(ex+er*0.10, ey-er*0.06, r, 2.30, 5.90); g.stroke();
      }
      g.restore();
      pen.paint(()=>{ g.arc(ex+er*0.10, ey-er*0.06, er*0.13, 0, 7); },
        toneSolid(inkLevel(6)), 2.4);
    }
  }

  /* ---- COPY: what actually arrives — the welt, hollow and half size ---- */
  if (has("copy")){
    const cx=L.copyX*W, cy=L.copyY*H, r=L.copyR*W;
    const src = pts;
    const x0=src[0].x, y0=src[0].y, x1=src[src.length-1].x, y1=src[src.length-1].y;
    const mxp=(x0+x1)/2, myp=(y0+y1)/2;
    const span=Math.hypot(x1-x0, y1-y0)||1, k=(r*2.0)/span;
    const mapped = src.map(p=>({ x:cx+(p.x-mxp)*k, y:cy+(p.y-myp)*k, nx:p.nx, ny:p.ny, t:p.t }));
    // hollow: the shape of the mark arrives, the substance does not
    pen.paint(()=>{ ribbon(g, mapped, tt => params.weltW*W*k*1.9*taper(tt)); },
      toneSolid(inkLevel(0)), 5);
    // held in two brackets — a quotation of a quotation
    g.save(); g.strokeStyle=INK; g.lineWidth=5; g.lineCap="butt"; g.lineJoin="miter";
    for (const s of [-1,1]){
      const bx=cx+s*r*1.45;
      g.beginPath();
      g.moveTo(bx-s*r*0.34, cy-r*1.05); g.lineTo(bx, cy-r*1.05);
      g.lineTo(bx, cy+r*1.05); g.lineTo(bx-s*r*0.34, cy+r*1.05);
      g.stroke();
    }
    g.restore();
    // the tie back to the ear that received it
    g.save(); g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.42;
    g.setLineDash([W*0.016,W*0.020]);
    g.beginPath(); g.moveTo(cx+r*1.85, cy-r*0.55);
    g.lineTo(L.earX*W-W*0.030, L.earY*H+H*0.030); g.stroke(); g.restore();
  }

  /* ================= LEDGER — told, heard, and the box left open =============
     Three separate boxes with generous gaps: no bar crosses the plate. */
  if (has("ledger")){
    const bw=L.ledW*W, bh=L.ledH*H, gp=L.ledGap*W;
    const struck = [reach>=2, reach>=3, false];       // ACCEPTED is never struck
    for (let i=0;i<3;i++){
      const x=L.ledX*W+i*(bw+gp), y=L.ledY*H;
      pen.paint(()=>{ g.rect(x,y,bw,bh); }, toneSolid(inkLevel(0)), 5);
      if (struck[i]){
        g.save(); g.strokeStyle=INK; g.lineWidth=7; g.lineCap="round"; g.lineJoin="round";
        g.beginPath();
        g.moveTo(x+bw*0.18, y+bh*0.54);
        g.lineTo(x+bw*0.42, y+bh*0.80);
        g.lineTo(x+bw*0.84, y+bh*0.20);
        g.stroke(); g.restore();
      }
      const dw=W*0.048, dh=H*0.054, th=W*0.016;       // the box number, as bars
      sevenSeg(pen, g, x+bw/2-dw/2, y+bh+H*0.018, dw, dh, i+1, th, 6);
    }
    // the third box wired to the reserve token: the decision moved, it did not close
    if (has("hold")){
      const x=L.ledX*W+2*(bw+gp), y=L.ledY*H;
      g.save(); g.strokeStyle=INK; g.lineWidth=8; g.lineCap="butt";
      g.beginPath(); g.moveTo(x+bw*0.10, y+bh*0.86); g.lineTo(x+bw*0.90, y+bh*0.14); g.stroke();
      g.lineWidth=3.4; g.globalAlpha=0.55; g.setLineDash([W*0.016,W*0.020]);
      g.beginPath(); g.moveTo(x+bw*1.10, y+bh*0.62);
      g.lineTo(L.resX*W-W*0.078, L.resY*H-H*0.008); g.stroke();
      g.restore();
    }
  }

  /* ---- RESERVE: the test she keeps for herself. Slot first, then sealed. ---- */
  const octPath = (cx,cy,r)=>{
    for (let i=0;i<8;i++){
      const a=Math.PI/8 + i*Math.PI/4;
      const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r*(W/H)*1.32;
      i?g.lineTo(x,y):g.moveTo(x,y);
    }
    g.closePath();
  };
  if (has("reserve-slot")){
    const cx=L.resX*W, cy=L.resY*H, r=W*0.074;
    g.save(); g.strokeStyle=INK; g.lineWidth=3.8; g.globalAlpha=0.58;
    g.setLineDash([W*0.020,W*0.018]);
    g.beginPath(); octPath(cx,cy,r); g.stroke(); g.restore();
  }
  if (has("reserve")){
    const cx=L.resX*W, cy=L.resY*H, r=W*0.074;
    pen.paint(()=>{ octPath(cx,cy,r); }, toneSolid(inkLevel(1)), 6);
    // a keyed post standing in the middle: her own test, rooted, not answered here
    pen.paint(()=>{ g.rect(cx-r*0.16, cy-r*0.72*(W/H)*1.32, r*0.32, r*1.44*(W/H)*1.32); },
      toneSolid(inkLevel(5)), 4);
    g.save(); g.strokeStyle=INK; g.lineWidth=6; g.lineCap="round";
    for (const s of [-1,1]){
      g.beginPath();
      g.moveTo(cx+s*r*0.16, cy-r*0.16*(W/H)*1.32);
      g.lineTo(cx+s*r*0.62, cy-r*0.44*(W/H)*1.32);
      g.stroke();
    }
    g.restore();
  }

  /* ---- RULE: vertical measure + the quoted span (never horizontal) ---- */
  if (has("rule") && params.rule){
    const rx=L.ruleX*W, ya=L.qy0*H, yb=L.qy1*H+H*0.030;
    g.save(); g.strokeStyle=INK; g.lineWidth=3.4; g.lineCap="butt";
    g.beginPath(); g.moveTo(rx, ya); g.lineTo(rx, yb); g.stroke();
    for (let i=0;i<=10;i++){
      const y=lerp(ya,yb,i/10), len=(i%5===0)?W*0.040:W*0.020;
      g.beginPath(); g.moveTo(rx, y); g.lineTo(rx-len, y); g.stroke();
    }
    const s0=Math.min(pts[0].y, pts[pts.length-1].y), s1=Math.max(pts[0].y, pts[pts.length-1].y);
    const bx=rx-W*0.058; g.lineWidth=5;
    g.beginPath(); g.moveTo(bx, s0); g.lineTo(bx, s1); g.stroke();
    for (const yy of [s0,s1]){
      g.beginPath(); g.moveTo(bx-W*0.013, yy); g.lineTo(bx+W*0.021, yy); g.stroke();
    }
    g.restore();
  }

  /* ---- MARKS: registration crosses keyed to entry / belly / exit ---- */
  if (has("marks")){
    const key=[pts[0], belly, pts[pts.length-1]];
    g.save(); g.lineCap="butt";
    key.forEach(p=>{
      const mx=L.markX*W, my=p.y, a=W*0.030;
      g.strokeStyle=INK; g.globalAlpha=1; g.lineWidth=5; g.setLineDash([]);
      g.beginPath(); g.moveTo(mx-a,my); g.lineTo(mx+a,my); g.stroke();
      g.beginPath(); g.moveTo(mx,my-a); g.lineTo(mx,my+a); g.stroke();
      g.globalAlpha=0.28; g.setLineDash([W*0.013,W*0.021]); g.lineWidth=2.6;
      const stop = G.panL(clamp((my-G.qy0)/(G.qy1-G.qy0),0,1)) - W*0.016;
      g.beginPath(); g.moveTo(mx+a*1.5, my); g.lineTo(Math.max(mx+a*2.2, stop), my); g.stroke();
    });
    g.restore();
    /* the semantic ACCENT: keyed to the box that stays open — the point the
       report does NOT settle. (Prints black; the colour is not the signal.) */
    g.save(); g.fillStyle=ACCENT;
    const ax=L.ledX*W+2*(L.ledW*W+L.ledGap*W);
    g.fillRect(ax, L.ledY*H-H*0.032, W*0.030, H*0.017);
    g.restore();
  }

  /* ---- INDEX: the plate number, as bars ---- */
  if (has("index") && params.index){
    const x=L.indexX*W, y=L.indexY*H, dw=W*0.056, dh=H*0.066, th=W*0.015, gp=W*0.026;
    [2,3].forEach((d,i)=> sevenSeg(pen, g, x+i*(dw+gp), y, dw, dh, d, th, 6));
    g.save(); g.fillStyle=INK; g.fillRect(x, y+dh+H*0.016, dw*2+gp, H*0.007); g.restore();
  }
}

/* ---- anchors computed from the SAME geometry, normalized 0..1 ---- */
const NG = geom(1,1), NP = weltLine(NG), NB = NP[Math.round(NP.length/2)];
const r3 = v => Math.round(v*1000)/1000;

export const asset = {
  id:"set_piece.scar-evidence",
  type:"SET_PIECE",
  name:"Scar Evidence",
  statusWord:"SPOKEN",
  scene:"OD-B23-S01",

  params,
  layers:["panel","bracket","glyph","limb-ghost","welt","seam","pucker","basin","chain",
          "station","emit","whorl","copy","ledger","hold","reserve-slot","reserve",
          "rule","marks","index"],

  /* same body fact as set_piece.boar-scar and set_piece.scar-proof, third
     instrument: this one is REPORTED. It is a speech object, so it attaches to
     the teller's mouth and the room's air, not to the thigh — the limb inside
     it is a citation, drawn as a ghost. */
  attach:{ to:"character.eurycleia", bone:"mouth", carries:"set_piece.boar-scar" },
  kin:["set_piece.boar-scar","set_piece.scar-proof"],
  cites:"character.odysseus-b16",
  depth:"speech-overlay",       // a diagram laid over the room, not built into it
  collision:{ x0:0.040, y0:0.080, x1:0.980, y1:0.940 },

  anchors:{
    "quote:top":       { x:r3((L.qx0+L.qx1)/2),        y:L.qy0 },
    "quote:base":      { x:r3((L.qx0+L.qx1)/2+L.skew), y:L.qy1 },
    "marker:entry":    { x:r3(NP[0].x),                y:r3(NP[0].y) },
    "marker:belly":    { x:r3(NB.x),                   y:r3(NB.y) },
    "marker:exit":     { x:r3(NP[NP.length-1].x),      y:r3(NP[NP.length-1].y) },
    "cite:limb-left":  { x:r3(NG.lAt(0.5)),            y:r3(NG.vY(0.5)) },
    "cite:limb-right": { x:r3(NG.rAt(0.5)),            y:r3(NG.vY(0.5)) },
    "relay:basin":     { x:L.basinX, y:L.basinY },
    "relay:mouth":     { x:L.mouthX, y:L.mouthY },
    "relay:stair":     { x:L.stairX, y:L.stairY },
    "relay:ear":       { x:L.earX,   y:L.earY   },
    "claim:arrival":   { x:L.copyX,  y:L.copyY  },
    "record:told":     { x:r3(L.ledX+L.ledW/2),                    y:r3(L.ledY+L.ledH/2) },
    "record:heard":    { x:r3(L.ledX+L.ledW*1.5+L.ledGap),         y:r3(L.ledY+L.ledH/2) },
    "record:accepted": { x:r3(L.ledX+L.ledW*2.5+L.ledGap*2),       y:r3(L.ledY+L.ledH/2) },
    "reserve:own-test":{ x:L.resX,   y:L.resY },
    "measure:rule":    { x:L.ruleX,  y:r3((L.qy0+L.qy1)/2) },
    "camera:quote":    { x:r3(NB.x), y:r3(NB.y) },
    "camera:relay":    { x:0.500,    y:0.565 },
    "camera:plate":    { x:0.500,    y:0.500 },
  },
  zones:{
    footprint: { x0:0.040, y0:0.080, x1:0.980, y1:0.940 },
    quote:     { x0:L.qx0, y0:L.qy0, x1:r3(L.qx1+L.skew), y1:L.qy1 },
    // the readable target: what a listener (or a camera) must be able to take in
    claim:     { x0:r3(NB.x-0.115), y0:r3(NB.y-0.086), x1:r3(NB.x+0.115), y1:r3(NB.y+0.086) },
    relay:     { x0:r3(L.basinX-0.070), y0:r3(L.stairY-0.060),
                 x1:r3(L.earX+0.070),   y1:r3(L.mouthY+0.060) },
    listener:  { x0:r3(L.earX-0.080), y0:r3(L.earY-0.060), x1:r3(L.earX+0.080), y1:r3(L.earY+0.060) },
    ledger:    { x0:r3(L.ledX-0.010), y0:r3(L.ledY-0.030),
                 x1:r3(L.ledX+L.ledW*3+L.ledGap*2+0.010), y1:r3(L.ledY+L.ledH+0.075) },
    reserved:  { x0:r3(L.resX-0.090), y0:r3(L.resY-0.070), x1:r3(L.resX+0.090), y1:r3(L.resY+0.070) },
    margin:    { x0:0.880, y0:0.090, x1:0.980, y1:0.470 },
  },
  states:{
    initial:"untold",
    nodes:{
      // the nurse knows and has not said it: the mark sits in the basin, unspoken
      untold:  { preview:{ mode:"untold",  t:0,   status:"UNTOLD",   progress:.12, reach:0.30 } },
      // said aloud — the claim leaves the mouth and starts up the stair
      spoken:  { preview:{ mode:"spoken",  t:0.4, status:"SPOKEN",   progress:.42, reach:1.55 } },
      // it lands in the listener's ear as a hollow copy, not as the thing
      heard:   { preview:{ mode:"heard",   t:0.8, status:"HEARD",    progress:.66, reach:3 } },
      // told and heard are on record; accepted is barred
      doubted: { preview:{ mode:"doubted", t:0.8, status:"DOUBTED",  progress:.82, reach:3 } },
      // the decision is moved, not closed — she keeps her own test
      reserved:{ preview:{ mode:"reserved",t:0.8, status:"DEFERRED", progress:.96, reach:3 } },
    },
    edges:[["untold","spoken"],["spoken","heard"],["heard","doubted"],["doubted","reserved"],
           ["heard","reserved"],["spoken","untold"],["reserved","doubted"],["doubted","heard"]],
  },
  channels:["telling","relay","arrival","credence","reserve","citation"],

  preview:()=>({ mode:"reserved", t:0.8, status:"DEFERRED", progress:.96, reach:3 }),
  draw(ctx,W,H,state){ drawEvidence(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
