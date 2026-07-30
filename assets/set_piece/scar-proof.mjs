/* set_piece.scar-proof — the PROOF plate: the tusk-wound offered as evidence.
   SET_PIECE. A separable body-surface component that attaches to the same place
   as `set_piece.boar-scar` (right thigh, above the knee) but is a different
   instrument: boar-scar is the close-up the hand FINDS in the dark; scar-proof is
   the deposition plate the owner OPENS — the marker deliberately shown, in
   daylight, to named witnesses.

   So the plate is not a limb filling the frame. It is an EXHIBIT WINDOW — a hard
   sheared aperture cut in the rag, the bared limb seen through it — flanked by two
   garment FLAPS held back by GRIP CLAMPS (the deliberate act, drawn as geometry:
   a bracket and three finger bars, never a baked-in figure), with two WITNESS
   SIGHTLINE cones converging on the welt from addressable stations 1 and 2
   (Eumaeus, Philoetius). Fingers do not appear: the channel here is the EYE.
   A tally of assents and an oath SEAL close the proof.

   States: covered / presented / witnessed / sworn —
     covered   the rag lies shut over the aperture, the welt only a dashed ghost;
     presented the flaps are clamped back, the welt readable, sightlines still open;
     witnessed both rays land, both tallies struck;
     sworn     the seal added — the proof becomes the pledge that arms the hall.

   Solid tones + hard contour only; the engine dotify pass supplies the halftone.
   Atlas: OD-B21-S04 — persistent body marker shown deliberately rather than
   discovered by touch. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth, rnd } from "../../engine/halfworld-engine.mjs";

/* ---- normalized layout: draw() and anchors share these fractions of W,H ---- */
const L = {
  winX0:  0.285,  winX1: 0.700,       // aperture, at its top edge
  winY0:  0.125,  winY1: 0.590,
  shear:  0.052,  // *W  the aperture (and the limb in it) leans right going down
  limbHW: 0.150,  // *W  half-width of the bared limb at the top of the aperture
  weltV0: 0.180,  weltV1: 0.720,      // welt entry / exit, as v down the aperture
  weltK0: 0.160,  weltK1: 0.840,      // and across the limb (0 outer .. 1 inner)
  flapL:  0.138,  flapR: 0.862,       // outer edges of the two drawn-back flaps
  flapV0: 0.080,  flapV1: 0.700,
  eyeAx:  0.112,  eyeAy: 0.690,       // witness station 1  (left)
  eyeBx:  0.888,  eyeBy: 0.662,       // witness station 2  (right)
  ruleX:  0.952,  markX: 0.052,
  indexX: 0.052,  indexY: 0.836,
  tallyX: 0.372,  tallyY: 0.700,
  sealX:  0.786,  sealY: 0.868,
};

const params = {
  weltW:    0.052,  // *W  half-width of the raised welt ribbon at its fattest
  seamW:    0.011,  // *W  half-width of the dark seam core
  puckers:  7,
  coneT:    0.030,  // *W  half-width of a sightline cone where it lands
  coneS:    0.062,  // *W  half-width of a sightline cone at its station
  witnesses: 2,
  rimShade: true,
  clamps:   true,
  rule:     true,
  index:    true,
};

/* ---------- geometry ---------- */
function profile(keys, u){
  u = clamp(u, 0, 1);
  for (let i=0;i<keys.length-1;i++){
    const [u0,v0]=keys[i], [u1,v1]=keys[i+1];
    if (u<=u1) return lerp(v0, v1, smooth((u-u0)/Math.max(1e-6,u1-u0)));
  }
  return keys[keys.length-1][1];
}
// the limb narrows a little toward the knee; the aperture crops it long before
// either end, so this is a section, not a whole leg.
const TAPER_P = [[0,1.02],[0.34,0.99],[0.70,0.92],[1,0.85]];

function geom(W,H){
  const wy0 = L.winY0*H, wy1 = L.winY1*H, sh = L.shear*W;
  const vY  = v => lerp(wy0, wy1, v);
  const sX  = v => sh*clamp(v,-0.4,1.4);
  const winL= v => L.winX0*W + sX(v);
  const winR= v => L.winX1*W + sX(v);
  const cAt = v => (L.winX0+L.winX1)/2*W + sX(v);
  const hw  = v => L.limbHW*W*profile(TAPER_P, v);
  return {
    wy0, wy1, vY, sX, winL, winR, cAt, hw,
    lAt: v => cAt(v)-hw(v),
    rAt: v => cAt(v)+hw(v),
    across: (v,k) => cAt(v) + hw(v)*(k*2-1),
    // the aperture as a closed path (a parallelogram, so nothing reads as a bar)
    winPath: (g, pad=0) => {
      g.moveTo(winL(0)-pad, vY(0)-pad);
      g.lineTo(winR(0)+pad, vY(0)-pad);
      g.lineTo(winR(1)+pad, vY(1)+pad);
      g.lineTo(winL(1)-pad, vY(1)+pad);
      g.closePath();
    },
  };
}

const qb = (p0,p1,p2,t)=>{ const m=1-t; return {
  x: m*m*p0.x + 2*m*t*p1.x + t*t*p2.x, y: m*m*p0.y + 2*m*t*p1.y + t*t*p2.y }; };

// the welt centreline: a shallow arc kept wholly inside the limb section
function weltLine(G, N=30){
  const a = { x: G.across(L.weltV0, L.weltK0), y: G.vY(L.weltV0) };
  const c = { x: G.across(L.weltV1, L.weltK1), y: G.vY(L.weltV1) };
  const vm = (L.weltV0+L.weltV1)/2;
  const b = { x: G.across(vm, 0.40), y: G.vY(vm) };
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

/* seven-segment numerals drawn as GEOMETRY — small type dissolves in the lattice */
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
function drawProof(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx, t = st.t||0;
  const mode = st.mode || "presented";      // covered | presented | witnessed | sworn
  const DEF = {
    covered:   ["cone-idle","window","limb","rim","shut","ghost","station","rule","marks","tally","seal-slot","index"],
    presented: ["cone","window","limb","rim","welt","seam","pucker","flap","clamp","ray-open","station","rule","marks","tally","seal-slot","index"],
    witnessed: ["cone","window","limb","rim","welt","seam","pucker","flap","clamp","ray","hit","station","focus","rule","marks","tally","seal-slot","index"],
    sworn:     ["cone","window","limb","rim","welt","seam","pucker","flap","clamp","ray","hit","station","focus","rule","marks","tally","seal","index"],
  };
  const layers = st.layers || DEF[mode] || DEF.presented;
  const has = l => layers.includes(l);
  const struck = st.assent!=null ? st.assent : (mode==="witnessed"||mode==="sworn" ? 2 : 0);

  const G = geom(W,H);
  const pts = weltLine(G);
  const belly = pts[Math.round(pts.length/2)];
  const STA = [{ x:L.eyeAx*W, y:L.eyeAy*H, d:1 }, { x:L.eyeBx*W, y:L.eyeBy*H, d:-1 }];

  /* ---- SIGHTLINE CONES (back layer): the two lines of sight, as wedges ---- */
  const coneOf = S => {
    let dx=belly.x-S.x, dy=belly.y-S.y; const m=Math.hypot(dx,dy)||1; dx/=m; dy/=m;
    return { dx, dy, nx:-dy, ny:dx, len:m };
  };
  if (has("cone") || has("cone-idle")){
    const faint = has("cone-idle");
    for (const S of STA){
      const c = coneOf(S);
      const stop = faint ? 0.42 : 1.0;                       // idle: the look never lands
      const ex = S.x + c.dx*c.len*stop, ey = S.y + c.dy*c.len*stop;
      const wT = lerp(params.coneS, params.coneT, stop)*W;
      pen.fillPath(()=>{
        g.moveTo(S.x + c.nx*params.coneS*W, S.y + c.ny*params.coneS*W);
        g.lineTo(ex + c.nx*wT, ey + c.ny*wT);
        g.lineTo(ex - c.nx*wT, ey - c.ny*wT);
        g.lineTo(S.x - c.nx*params.coneS*W, S.y - c.ny*params.coneS*W);
        g.closePath();
      }, inkLevel(1));
      g.save(); g.strokeStyle=INK; g.lineWidth=2.6; g.globalAlpha=faint?0.30:0.52;
      g.setLineDash(faint?[W*0.014,W*0.020]:[]);
      for (const s of [1,-1]){
        g.beginPath();
        g.moveTo(S.x + s*c.nx*params.coneS*W, S.y + s*c.ny*params.coneS*W);
        g.lineTo(ex + s*c.nx*wT, ey + s*c.ny*wT);
        g.stroke();
      }
      g.restore();
      if (faint){                                            // the look stopped short
        g.save(); g.strokeStyle=INK; g.lineWidth=5; g.lineCap="butt";
        g.beginPath();
        g.moveTo(ex + c.nx*wT*1.05, ey + c.ny*wT*1.05);
        g.lineTo(ex - c.nx*wT*1.05, ey - c.ny*wT*1.05);
        g.stroke(); g.restore();
      }
    }
  }

  /* ---- WINDOW: the aperture torn in the rag. Light plane; the SIDES carry the
          hard contour, the top and bottom are torn edges broken in the middle,
          so nothing lays a black bar across the plate. ---- */
  if (has("window")){
    pen.fillPath(()=>{ G.winPath(g); }, inkLevel(0));
    g.save(); g.strokeStyle=INK; g.lineWidth=6; g.lineCap="round"; g.lineJoin="round";
    for (const side of [-1,1]){                      // the two cut sides: vertical, unbroken
      const ex = v => side<0 ? G.winL(v) : G.winR(v);
      g.beginPath(); g.moveTo(ex(0), G.vY(0)); g.lineTo(ex(1), G.vY(1)); g.stroke();
    }
    g.lineWidth=4.5;
    for (const [v,dir,gap0,gap1] of [[0,-1,0.36,0.62],[1,1,0.30,0.55]]){
      const rr = rnd(v?5501:2207);
      for (const [a,b] of [[0,gap0],[gap1,1]]){      // torn, and broken in the middle
        g.beginPath();
        for (let i=0;i<=8;i++){
          const f = lerp(a,b,i/8);
          const x = lerp(G.winL(v), G.winR(v), f);
          const y = G.vY(v) + dir*(i%2 ? H*0.011 : H*0.002) + rr()*H*0.006*dir;
          i?g.lineTo(x,y):g.moveTo(x,y);
        }
        g.stroke();
      }
    }
    g.restore();
  }

  /* ---- LIMB: the bared section seen through it — clipped, so it is an excerpt ---- */
  if (has("limb")){
    g.save(); g.beginPath(); G.winPath(g, -2); g.clip();
    const N=28, v0=-0.18, v1=1.18;
    pen.paint(()=>{
      g.moveTo(G.lAt(v0), G.vY(v0));
      for (let i=1;i<=N;i++){ const v=lerp(v0,v1,i/N); g.lineTo(G.lAt(v), G.vY(v)); }
      for (let i=N;i>=0;i--){ const v=lerp(v0,v1,i/N); g.lineTo(G.rAt(v), G.vY(v)); }
      g.closePath();
    }, toneSolid(inkLevel(1)), 5);

    if (has("rim") && params.rimShade){
      const band=(k0,k1,lv)=>pen.fillPath(()=>{
        g.moveTo(G.across(v0,k0), G.vY(v0));
        for (let i=1;i<=N;i++){ const v=lerp(v0,v1,i/N); g.lineTo(G.across(v,k0), G.vY(v)); }
        for (let i=N;i>=0;i--){ const v=lerp(v0,v1,i/N); g.lineTo(G.across(v,k1), G.vY(v)); }
        g.closePath();
      }, inkLevel(lv));
      band(0.00,0.13,3); band(0.13,0.24,2); band(0.89,1.00,2);
      // one long muscle seam, thin ink, broken well short of both crops
      g.save(); g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.38; g.lineCap="round";
      g.beginPath();
      for (let i=0;i<=20;i++){ const v=lerp(0.02,0.94,i/20);
        const x=G.across(v,0.70)+Math.sin(v*3.1)*W*0.006, y=G.vY(v);
        i?g.lineTo(x,y):g.moveTo(x,y); }
      g.stroke(); g.restore();
    }

    /* ---- SHUT (covered): the rag lying closed across the aperture ---- */
    if (has("shut")){
      const rr = rnd(9137);
      const clothPath = ()=>{
        g.moveTo(G.winL(-0.1)-W*0.02, G.vY(-0.1));
        for (let i=0;i<=10;i++){                              // scalloped, never a bar
          const v=lerp(-0.1,1.1,i/10);
          g.lineTo(G.winL(v)-W*0.02+Math.sin(i*1.1)*W*0.012, G.vY(v));
        }
        for (let i=0;i<=8;i++){
          const x=lerp(G.winL(1.1)-W*0.02, G.winR(1.1)+W*0.02, i/8);
          g.lineTo(x, G.vY(1.1) + (i%2?H*0.012:-H*0.006));
        }
        for (let i=10;i>=0;i--){
          const v=lerp(-0.1,1.1,i/10);
          g.lineTo(G.winR(v)+W*0.02-Math.sin(i*0.8)*W*0.010, G.vY(v));
        }
        g.closePath();
      };
      pen.paint(clothPath, toneSolid(inkLevel(2)), 5);
      g.save(); g.beginPath(); clothPath(); g.clip();
      g.strokeStyle=INK; g.globalAlpha=0.24; g.lineWidth=2.4;
      for (let i=-6;i<24;i++){                                 // weave, counter to the welt
        const yy=G.vY(0)+i*H*0.028;
        g.beginPath(); g.moveTo(G.winL(0)-W*0.03, yy+H*0.09); g.lineTo(G.winR(1)+W*0.03, yy); g.stroke();
      }
      g.restore();
      g.save(); g.strokeStyle=INK; g.globalAlpha=0.55; g.lineWidth=3.2; g.lineCap="round";
      for (let i=0;i<4;i++){                                   // broken fold seams
        const k=(i+0.6)/4.4, va=0.06+0.14*(i%3), vb=0.58+0.30*((i+1)%3)/2;
        g.beginPath();
        for (let j=0;j<=10;j++){ const v=lerp(va,vb,j/10);
          const x=G.across(v,k)+Math.sin(j*0.9+i)*W*0.006; j?g.lineTo(x,G.vY(v)):g.moveTo(x,G.vY(v)); }
        g.stroke();
      }
      g.restore();
      if (has("ghost")){                                       // the marker is under there
        g.save(); g.strokeStyle=INK; g.globalAlpha=0.85; g.lineWidth=5.5;
        g.setLineDash([W*0.022,W*0.020]);
        g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
        for (const p of pts) g.lineTo(p.x, p.y);
        g.stroke(); g.restore();
      }
    }

    /* ---- WELT / SEAM / PUCKER: the healed ridge, readable ---- */
    if (has("welt")){
      pen.paint(()=>{ ribbon(g, pts, tt => params.weltW*W*taper(tt)); }, toneSolid(inkLevel(2)), 4);
      pen.fillPath(()=>{ ribbon(g, shift(pts, params.weltW*W*0.50),
        tt => params.weltW*W*0.13*taper(tt)); }, inkLevel(0));
    }
    if (has("seam")){
      pen.paint(()=>{ ribbon(g, pts, tt => params.seamW*W*taper(tt)); }, toneSolid(inkLevel(6)), 2.5);
    }
    if (has("pucker")){
      g.save(); g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
      for (let i=0;i<params.puckers;i++){
        const tt = 0.14 + 0.72*(i/(params.puckers-1));
        const p = pts[Math.round(tt*(pts.length-1))];
        const s = (i%2===0)?1:-1;
        const a = params.seamW*W*taper(tt)*1.3, b = params.weltW*W*taper(tt)*0.88;
        if (b<=a) continue;
        g.beginPath(); g.moveTo(p.x+p.nx*a*s, p.y+p.ny*a*s);
        g.lineTo(p.x+p.nx*b*s, p.y+p.ny*b*s); g.stroke();
      }
      g.restore();
    }
    g.restore();  // end aperture clip
    // corner ticks: the aperture registered like an exhibit, not framed like a box
    g.save(); g.strokeStyle=INK; g.lineWidth=5; g.lineCap="butt";
    for (const [v,side] of [[0,-1],[0,1],[1,-1],[1,1]]){
      const cx = side<0 ? G.winL(v) : G.winR(v), cy = G.vY(v);
      const dy = v===0 ? -1 : 1;                       // ticks sit OUTSIDE the aperture
      g.beginPath(); g.moveTo(cx, cy+dy*H*0.008); g.lineTo(cx, cy+dy*H*0.040); g.stroke();
      g.beginPath(); g.moveTo(cx+side*W*0.006, cy+dy*H*0.030);
      g.lineTo(cx+side*W*0.028, cy+dy*H*0.030); g.stroke();
    }
    g.restore();
  }

  /* ---- FLAPS: the rag pulled back on both sides and held ---- */
  if (has("flap")){
    for (const side of [-1, 1]){
      const inner = v => side<0 ? G.winL(v) : G.winR(v);
      const outer = (side<0 ? L.flapL : L.flapR)*W;
      const v0=L.flapV0, v1=L.flapV1, N=10;
      const rr = rnd(side<0?3313:7717);
      const path = ()=>{
        g.moveTo(inner(v0), G.vY(v0));
        for (let i=0;i<=N;i++){ const v=lerp(v0,v1,i/N); g.lineTo(inner(v), G.vY(v)); }
        // gathered lower edge: scallops, not a straight span
        for (let i=0;i<=4;i++){
          const x=lerp(inner(v1), outer, i/4);
          g.quadraticCurveTo(x-W*0.014*side, G.vY(v1)+H*0.024, x, G.vY(v1)-H*0.004+rr()*H*0.012);
        }
        // outer edge, bellied out by the pull
        for (let i=N;i>=0;i--){ const v=lerp(v0,v1,i/N);
          g.lineTo(outer - side*Math.sin(Math.PI*i/N)*W*0.026, G.vY(v)); }
        // upper edge back to the aperture: a short zigzag
        for (let i=0;i<=3;i++){
          const x=lerp(outer, inner(v0), i/3);
          g.lineTo(x, G.vY(v0) + (i%2?H*0.014:-H*0.004));
        }
        g.closePath();
      };
      pen.paint(path, toneSolid(inkLevel(2)), 5);
      // hatch: pulled taut toward the clamp, so it reads as held, clipped to the flap
      g.save(); g.beginPath(); path(); g.clip();
      g.strokeStyle=INK; g.globalAlpha=0.30; g.lineWidth=2.4;
      const gx = side<0 ? outer : outer, gy = G.vY(0.36);
      for (let i=0;i<16;i++){
        const v = lerp(v0-0.1, v1+0.1, i/15);
        g.beginPath(); g.moveTo(inner(v), G.vY(v)); g.lineTo(gx, gy + (i-7.5)*H*0.012); g.stroke();
      }
      g.restore();
    }
  }

  /* ---- CLAMPS: the grip that keeps the rag open — the deliberate act, as
          geometry: a knuckle block outboard on the cloth, three fingers closed
          over the torn edge. No figure is drawn; the hand is an addressable pin. ---- */
  if (has("clamp") && params.clamps){
    for (const side of [-1, 1]){
      const v = side<0 ? 0.40 : 0.30;
      const x = (side<0 ? G.winL(v) : G.winR(v)), y = G.vY(v);
      const a = W*0.030;
      pen.paint(()=>{                                   // knuckle mass, out on the cloth
        g.moveTo(x + side*4.0*a, y - a*1.9);
        g.quadraticCurveTo(x + side*4.9*a, y, x + side*4.0*a, y + a*1.9);
        g.lineTo(x + side*2.2*a, y + a*1.7);
        g.lineTo(x + side*2.2*a, y - a*1.7);
        g.closePath();
      }, toneSolid(inkLevel(1)), 5);
      for (let i=-1;i<=1;i++){                          // three fingers closed over the edge
        const y0 = y + i*a*1.34, y1 = y + i*a*1.02;
        pen.limb(()=>{ g.moveTo(x + side*2.5*a, y0); g.lineTo(x - side*1.35*a, y1); },
          toneSolid(inkLevel(0)), a*0.92);
      }
      pen.limb(()=>{                                    // thumb, back across the cloth
        g.moveTo(x + side*2.9*a, y + a*1.9); g.lineTo(x + side*0.6*a, y + a*2.9);
      }, toneSolid(inkLevel(0)), a*0.86);
    }
  }

  /* ---- RAYS: the axis of each look, landing on the welt ---- */
  if (has("ray") || has("ray-open")){
    const open = has("ray-open");
    for (const S of STA){
      const c = coneOf(S);
      const gap = W*0.052;
      const ex = belly.x - c.dx*gap, ey = belly.y - c.dy*gap;
      g.save(); g.strokeStyle=INK; g.lineWidth=3.4; g.globalAlpha=open?0.45:0.85;
      g.setLineDash(open?[W*0.020,W*0.018]:[]);
      g.beginPath(); g.moveTo(S.x + c.dx*W*0.075, S.y + c.dy*W*0.075); g.lineTo(ex, ey); g.stroke();
      g.restore();
      if (has("hit")){                                  // the arrowhead: the look lands
        const hw2 = W*0.021;
        pen.fillPath(()=>{
          g.moveTo(belly.x - c.dx*W*0.012, belly.y - c.dy*W*0.012);
          g.lineTo(ex + c.nx*hw2, ey + c.ny*hw2);
          g.lineTo(ex - c.nx*hw2, ey - c.ny*hw2);
          g.closePath();
        }, inkLevel(7));
      }
    }
    if (has("hit")){                                    // one contact ring, no scatter
      const pulse = 0.5+0.5*Math.sin(t*2.2);
      g.save(); g.strokeStyle=INK; g.lineWidth=3.2; g.globalAlpha=0.55;
      g.setLineDash([W*0.018,W*0.022]);
      g.beginPath(); g.arc(belly.x, belly.y, W*0.088*(1.0+0.06*pulse), 0, 7); g.stroke();
      g.restore();
    }
  }

  /* ---- STATIONS: two addressable witnesses, drawn as eyes — never as figures ---- */
  if (has("station")){
    const open = !has("cone-idle");
    STA.forEach((S,i)=>{
      const ew = W*0.052, eh = H*0.026;
      if (open){
        pen.paint(()=>{                                  // lens: paper inside, dark pupil
          g.moveTo(S.x-ew, S.y);
          g.quadraticCurveTo(S.x, S.y-eh*2.0, S.x+ew, S.y);
          g.quadraticCurveTo(S.x, S.y+eh*2.0, S.x-ew, S.y);
          g.closePath();
        }, toneSolid(inkLevel(0)), 5);
        pen.paint(()=>{ g.arc(S.x, S.y, ew*0.30, 0, 7); }, toneSolid(inkLevel(6)), 3);
      } else {
        g.save(); g.strokeStyle=INK; g.lineWidth=5.5; g.lineCap="round";
        g.beginPath(); g.moveTo(S.x-ew, S.y-eh*0.3);
        g.quadraticCurveTo(S.x, S.y+eh*1.1, S.x+ew, S.y-eh*0.3); g.stroke();
        for (let k=-1;k<=1;k++){                         // lashes: the eye is shut
          g.beginPath(); g.moveTo(S.x+k*ew*0.5, S.y+eh*0.55);
          g.lineTo(S.x+k*ew*0.5, S.y+eh*1.25); g.stroke();
        }
        g.restore();
      }
      if (has("focus")){
        g.save(); g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.7;
        for (const s of [-1,1]){                          // focus brackets, left and right
          const bx=S.x+s*ew*1.55;
          g.beginPath(); g.moveTo(bx-s*ew*0.22, S.y-eh*1.5);
          g.lineTo(bx, S.y-eh*1.5); g.lineTo(bx, S.y+eh*1.5);
          g.lineTo(bx-s*ew*0.22, S.y+eh*1.5); g.stroke();
        }
        g.restore();
      }
      // station number, as bars
      const dw=W*0.040, dh=H*0.050, th=W*0.013;
      sevenSeg(pen, g, S.x-dw/2, S.y+H*0.052, dw, dh, i+1, th, 6);
    });
  }

  /* ---- RULE: vertical measure + the welt's span bracket (never horizontal) ---- */
  if (has("rule") && params.rule){
    const rx=L.ruleX*W, ya=H*0.140, yb=H*0.640;
    g.save(); g.strokeStyle=INK; g.lineWidth=3.4; g.lineCap="butt";
    g.beginPath(); g.moveTo(rx, ya); g.lineTo(rx, yb); g.stroke();
    for (let i=0;i<=12;i++){
      const y=lerp(ya,yb,i/12), len=(i%4===0)?W*0.042:W*0.022;
      g.beginPath(); g.moveTo(rx, y); g.lineTo(rx-len, y); g.stroke();
    }
    const s0=Math.min(pts[0].y, pts[pts.length-1].y), s1=Math.max(pts[0].y, pts[pts.length-1].y);
    const bx=rx-W*0.062; g.lineWidth=5;
    g.beginPath(); g.moveTo(bx, s0); g.lineTo(bx, s1); g.stroke();
    for (const yy of [s0,s1]){
      g.beginPath(); g.moveTo(bx-W*0.014, yy); g.lineTo(bx+W*0.022, yy); g.stroke();
    }
    g.restore();
  }

  /* ---- MARKS: registration crosses keyed to entry / belly / exit ---- */
  if (has("marks")){
    const key=[pts[0], belly, pts[pts.length-1]];
    g.save(); g.lineCap="butt";
    key.forEach((p,i)=>{
      const mx=L.markX*W, my=p.y, a=W*0.032;
      g.strokeStyle=INK; g.globalAlpha=1; g.lineWidth=5; g.setLineDash([]);
      g.beginPath(); g.moveTo(mx-a,my); g.lineTo(mx+a,my); g.stroke();
      g.beginPath(); g.moveTo(mx,my-a); g.lineTo(mx,my+a); g.stroke();
      g.globalAlpha=0.30; g.setLineDash([W*0.014,W*0.022]); g.lineWidth=2.6;
      const stop = G.winL(clamp((my-G.wy0)/(G.wy1-G.wy0),0,1)) - W*0.014;
      g.beginPath(); g.moveTo(mx+a*1.5, my); g.lineTo(Math.max(mx+a*2.2, stop), my); g.stroke();
    });
    g.restore();
    // the semantic ACCENT: solid mark keyed to the belly — the point deposed
    g.save(); g.fillStyle=ACCENT;
    g.fillRect(L.markX*W-W*0.014, belly.y+H*0.028, W*0.028, H*0.009);
    g.restore();
  }

  /* ---- TALLY: one box per witness; struck when the assent is on record ---- */
  if (has("tally")){
    const bw=W*0.082, bh=H*0.058, gap=W*0.030;
    for (let i=0;i<params.witnesses;i++){
      const x=L.tallyX*W+i*(bw+gap), y=L.tallyY*H;
      pen.paint(()=>{ g.rect(x,y,bw,bh); }, toneSolid(inkLevel(0)), 5);
      if (i < struck){
        g.save(); g.strokeStyle=INK; g.lineWidth=7; g.lineCap="round"; g.lineJoin="round";
        g.beginPath();
        g.moveTo(x+bw*0.18, y+bh*0.52);
        g.lineTo(x+bw*0.42, y+bh*0.80);
        g.lineTo(x+bw*0.84, y+bh*0.20);
        g.stroke(); g.restore();
      }
    }
    // short bracket under the pair — deliberately short of the frame
    g.save(); g.strokeStyle=INK; g.lineWidth=4;
    const bx0=L.tallyX*W, bx1=L.tallyX*W+bw*2+gap, by=L.tallyY*H+bh+H*0.020;
    g.beginPath(); g.moveTo(bx0,by-H*0.012); g.lineTo(bx0,by); g.lineTo(bx1,by); g.lineTo(bx1,by-H*0.012);
    g.stroke(); g.restore();
    // each box is wired to its station: the assent belongs to a named witness
    g.save(); g.strokeStyle=INK; g.lineWidth=2.6; g.globalAlpha=0.34;
    g.setLineDash([W*0.014,W*0.020]);
    STA.forEach((S,i)=>{
      const ex = i===0 ? L.tallyX*W : L.tallyX*W+bw*2+gap;
      g.beginPath();
      g.moveTo(S.x + (i===0?1:-1)*W*0.062, S.y);
      g.lineTo(ex - (i===0?1:-1)*W*0.014, L.tallyY*H + bh*0.42);
      g.stroke();
    });
    g.restore();
  }

  /* ---- SEAL: the oath struck over the proof (and, before it, its empty slot) ---- */
  const octPath = (cx,cy,r)=>{
    for (let i=0;i<8;i++){
      const a=Math.PI/8 + i*Math.PI/4;
      const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r*(W/H)*1.32;
      i?g.lineTo(x,y):g.moveTo(x,y);
    }
    g.closePath();
  };
  if (has("seal-slot")){
    const cx=L.sealX*W, cy=L.sealY*H, r=W*0.072;
    g.save(); g.strokeStyle=INK; g.lineWidth=3.6; g.globalAlpha=0.55;
    g.setLineDash([W*0.020,W*0.018]);
    g.beginPath(); octPath(cx,cy,r); g.stroke(); g.restore();
  }
  if (has("seal")){
    const cx=L.sealX*W, cy=L.sealY*H, r=W*0.072;
    pen.paint(()=>{ octPath(cx,cy,r); }, toneSolid(inkLevel(1)), 6);
    g.save(); g.strokeStyle=INK; g.lineWidth=6.5; g.lineCap="round";
    for (const s of [1,-1]){
      g.beginPath();
      g.moveTo(cx-r*0.46, cy-s*r*0.46*(W/H)*1.32);
      g.lineTo(cx+r*0.46, cy+s*r*0.46*(W/H)*1.32);
      g.stroke();
    }
    g.restore();
    pen.paint(()=>{ g.rect(cx-r*0.13, cy-r*0.13*(W/H)*1.32, r*0.26, r*0.26*(W/H)*1.32); },
      toneSolid(inkLevel(6)), 2.5);
  }

  /* ---- INDEX: the plate number, as bars ---- */
  if (has("index") && params.index){
    const x=L.indexX*W, y=L.indexY*H, dw=W*0.058, dh=H*0.070, th=W*0.015, gp=W*0.026;
    [2,1].forEach((d,i)=> sevenSeg(pen, g, x+i*(dw+gp), y, dw, dh, d, th, 6));
    g.save(); g.fillStyle=INK; g.fillRect(x, y+dh+H*0.018, dw*2+gp, H*0.007); g.restore();
  }
}

/* ---- anchors computed from the SAME geometry, normalized 0..1 ---- */
const NG = geom(1,1), NP = weltLine(NG), NB = NP[Math.round(NP.length/2)];
const r3 = v => Math.round(v*1000)/1000;

export const asset = {
  id:"set_piece.scar-proof",
  type:"SET_PIECE",
  name:"Scar Proof",
  statusWord:"SHOWN",
  scene:"OD-B21-S04",

  params,
  layers:["cone","cone-idle","window","limb","rim","shut","ghost","welt","seam","pucker",
          "flap","clamp","ray","ray-open","hit","station","focus","rule","marks","tally","seal","index"],

  // same body fact as set_piece.boar-scar, different instrument: this one is
  // opened and deposed, not found by touch.
  attach:{ to:"character.odysseus-b16", bone:"thigh.right", above:"knee.right", side:"outer" },
  kin:"set_piece.boar-scar",
  depth:"body-surface",       // rides ON a figure; the rag is its occluder

  anchors:{
    "attach:thigh-right": { x:r3(NG.cAt(0.42)),  y:r3(NG.vY(0.42)) },
    "marker:entry":       { x:r3(NP[0].x),       y:r3(NP[0].y) },
    "marker:belly":       { x:r3(NB.x),          y:r3(NB.y) },
    "marker:exit":        { x:r3(NP[NP.length-1].x), y:r3(NP[NP.length-1].y) },
    "aperture:top":       { x:r3((L.winX0+L.winX1)/2), y:L.winY0 },
    "aperture:base":      { x:r3((L.winX0+L.winX1)/2+L.shear), y:L.winY1 },
    "grip:cloth-left":    { x:r3(NG.winL(0.36)), y:r3(NG.vY(0.36)) },
    "grip:cloth-right":   { x:r3(NG.winR(0.28)), y:r3(NG.vY(0.28)) },
    "sight:witness-1":    { x:L.eyeAx,           y:L.eyeAy },
    "sight:witness-2":    { x:L.eyeBx,           y:L.eyeBy },
    "record:tally":       { x:r3(L.tallyX+0.097),y:r3(L.tallyY+0.029) },
    "seal:oath":          { x:L.sealX,           y:L.sealY },
    "measure:rule":       { x:L.ruleX,           y:0.390 },
    "camera:proof":       { x:r3(NB.x),          y:r3(NB.y) },
    "camera:plate":       { x:0.500,             y:0.500 },
  },
  zones:{
    footprint: { x0:r3(L.flapL-0.01), y0:r3(L.winY0-0.02), x1:r3(L.flapR+0.01), y1:r3(L.winY1+0.03) },
    exhibit:   { x0:L.winX0, y0:L.winY0, x1:r3(L.winX1+L.shear), y1:L.winY1 },
    // the readable target: what a witness (or a camera) must have line of sight to
    proof:     { x0:r3(NB.x-0.115), y0:r3(NB.y-0.088), x1:r3(NB.x+0.115), y1:r3(NB.y+0.088) },
    witness_l: { x0:r3(L.eyeAx-0.085), y0:r3(L.eyeAy-0.052), x1:r3(L.eyeAx+0.085), y1:r3(L.eyeAy+0.130) },
    witness_r: { x0:r3(L.eyeBx-0.085), y0:r3(L.eyeBy-0.052), x1:r3(L.eyeBx+0.085), y1:r3(L.eyeBy+0.130) },
    occluder:  { x0:L.flapL, y0:r3(L.winY0-0.01), x1:L.flapR, y1:r3(L.winY1+0.01) },
    margin:    { x0:0.880, y0:0.130, x1:0.980, y1:0.650 },
  },
  states:{
    initial:"presented",
    nodes:{
      // the rag shut over it: the marker exists, nobody can read it
      covered:  { preview:{ mode:"covered",   t:0,   status:"COVERED",   progress:.10, assent:0 } },
      // drawn back and clamped open — offered, not yet looked at
      presented:{ preview:{ mode:"presented", t:0,   status:"SHOWN",     progress:.46, assent:0 } },
      // both lines of sight land on the welt; both assents struck
      witnessed:{ preview:{ mode:"witnessed", t:0.6, status:"WITNESSED", progress:.80, assent:2 } },
      // the proof closed as a pledge — this is what arms the two herdsmen
      sworn:    { preview:{ mode:"sworn",     t:0.6, status:"SWORN",     progress:.97, assent:2 } },
    },
    edges:[["covered","presented"],["presented","witnessed"],["witnessed","sworn"],
           ["presented","covered"],["sworn","covered"],["witnessed","presented"]],
  },
  channels:["reveal","grip","sightline","assent","oath","occlusion"],

  preview:()=>({ mode:"witnessed", t:0.6, status:"WITNESSED", progress:.80, assent:2 }),
  draw(ctx,W,H,state){ drawProof(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
