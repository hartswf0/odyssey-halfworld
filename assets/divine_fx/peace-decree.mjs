/* divine_fx.peace-decree — the last act of the poem drawn as a legal instrument:
   Zeus's assent, spoken to Athena above the field at Ithaca, entered as a
   FUTURE-BINDING STATE over the island. DIVINE_FX asset.

   Scene function (OD-B24-S07): the feud between Odysseus' house and the kin of
   the dead suitors is stopped by decree, not by argument. Zeus grants what
   Athena asks and names its terms. The effect renders that grant as a DECREE
   TABLET: authority descends from a single ASSENT SEAL at the top, runs down a
   spine rail, and stamps five CLAUSES, each a broken plate carrying a counted
   index (square pips, drawn as geometry — never small type) and one blocky
   clause glyph:

     I   KINGSHIP           — a crown: Odysseus rules on, uncontested.
     II  OATH               — a raised sworn hand: a covenant is struck.
     III FORGETTING         — a grievance tile wiped from the right: the memory
                              of the slaughtered sons is erased.
     IV  WEALTH             — a stacked pyramid of goods: prosperity restored.
     V   CIVIC STABILITY    — a level on a fulcrum with a true plumb: peace held.

   The visible CONSEQUENCE runs along the bottom: the VENDETTA LINE, a barbed
   zigzag of blood-feud, is flattened left-to-right by an advancing settling
   front until it is a straight civic course with small standing marks on it —
   a town, at peace, on solid ground.

   Procedural over state.t + intensity, bind, settle, reach:
     SOURCE   (low)   — the assent seal alone; clauses drawn but blank, the
                        vendetta line still jagged end to end.
     TARGET   (mid)   — the spine descends, the first clauses take.
     FIELD    (high)  — clauses seal one by one; the settling front advances.
     TRANSFORM(full)  — all five stamped, the feud line run true. DECREED.
   `bind`  : how many of the five clauses have sealed (bind*5).
   `settle`: how far the flattening front has run along the vendetta line.
   `reach` : how far the spine rail and the duration axis extend into the future.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. The plate is
   kept deliberately LIGHT — paper-dominant, pale clause plates, dark only in the
   small seals, pips and the feud line — and no span crosses the full frame:
   every plate is staggered and every long run is broken. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* the five clauses of the decree, back-to-front top-to-bottom. Each row gives
   its own plate span (x0,x1 as frac of W) so the stack is staggered and never
   stripes the frame with a full-width bar. */
const CLAUSES = [
  { key:"kingship",  glyph:"crown", y:0.258, x0:0.150, x1:0.762 },
  { key:"oath",      glyph:"hand",  y:0.368, x0:0.204, x1:0.856 },
  { key:"forgetting",glyph:"wipe",  y:0.478, x0:0.150, x1:0.700 },
  { key:"wealth",    glyph:"stack", y:0.588, x0:0.230, x1:0.856 },
  { key:"stability", glyph:"level", y:0.698, x0:0.150, x1:0.790 },
];

const params = {
  clauses:  CLAUSES,
  tablet:   { x0:0.090, x1:0.884, y0:0.196, y1:0.796 },  // the decree tablet
  sealCx:   0.50,     // assent seal (SOURCE) center x
  sealCy:   0.104,    // assent seal center y
  sealR:    0.052,    // assent seal radius, frac of W
  spineX:   0.117,    // the decree spine rail inside the tablet's left gutter
  axisX:    0.930,    // right-margin duration axis (the "future" the state binds)
  feudY:    0.860,    // the vendetta line / civic course
  feudX:    [0.095,0.900],
  rowH:     0.086,    // clause plate height, frac of H
  glyphS:   0.104,    // clause glyph box side, frac of W
  pips:     5,
  intensity:1.0,
};

/* ---------- small geometry helpers ---------- */
function rectPath(g,x,y,w,h){ g.rect(x,y,w,h); }
function dashRun(g,x0,x1,y,seg,gap){       // a broken horizontal run (never one bar)
  let x = x0;
  while (x < x1){ const e = Math.min(x+seg, x1); g.moveTo(x,y); g.lineTo(e,y); x = e + gap; }
}

/* ---- FIELD: the decree tablet. A pale bounded plane (NOT the whole frame) with
   a hard contour that is deliberately BROKEN at top centre, where authority
   enters, and at bottom centre, where the consequence leaves. ---- */
function drawTablet(pen,g,W,H){
  const T = params.tablet;
  const x0=W*T.x0, x1=W*T.x1, y0=H*T.y0, y1=H*T.y1;
  g.fillStyle = inkLevel(1); g.fillRect(x0,y0,x1-x0,y1-y0);
  const gapL = W*0.44, gapR = W*0.56;                 // the openings
  pen.ink(()=>{
    g.moveTo(x0,y0); g.lineTo(gapL,y0);  g.moveTo(gapR,y0); g.lineTo(x1,y0);
    g.moveTo(x0,y1); g.lineTo(gapL,y1);  g.moveTo(gapR,y1); g.lineTo(x1,y1);
    g.moveTo(x0,y0); g.lineTo(x0,y1);
    g.moveTo(x1,y0); g.lineTo(x1,y1);
  }, 3.4);
}

/* ---- SOURCE: the assent seal. Zeus's granted word, a heavy disc with a nod
   wedge driven down through it, flanked by the two divine marks that speak it —
   a bolt tick (Zeus) left, an upright spear-and-crossguard (Athena) right. ---- */
function drawAssent(pen,g,W,H,t,inten){
  const cx=W*params.sealCx, cy=H*params.sealCy, R=W*params.sealR;
  // sworn boundary, faint
  pen.ink(()=>{ g.arc(cx,cy,R*1.42,0,TAU); }, 2.2);
  // the seal body: dark rim, light aperture
  pen.paint(()=>{ g.arc(cx,cy,R,0,TAU); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.arc(cx,cy,R*0.62,0,TAU); }, toneSolid(inkLevel(1)), 3);
  // the nod: a downward wedge in the aperture
  pen.paint(()=>{
    g.moveTo(cx-R*0.34, cy-R*0.30); g.lineTo(cx+R*0.34, cy-R*0.30);
    g.lineTo(cx, cy+R*0.40); g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  // sworn notches on the rim
  g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round";
  for(let i=0;i<12;i++){
    const th = i/12*TAU + Math.sin(t*0.7)*0.02;
    g.beginPath();
    g.moveTo(cx+Math.cos(th)*R*0.70, cy+Math.sin(th)*R*0.70);
    g.lineTo(cx+Math.cos(th)*R*0.94, cy+Math.sin(th)*R*0.94);
    g.stroke();
  }
  // flanking divine marks
  const lx=W*0.335, rx=W*0.665, my=cy;
  g.strokeStyle=INK; g.lineWidth=4; g.lineJoin="round"; g.lineCap="round";
  g.beginPath();                                        // Zeus: a bolt tick
  g.moveTo(lx+W*0.020, my-H*0.026); g.lineTo(lx-W*0.010, my+H*0.002);
  g.lineTo(lx+W*0.012, my+H*0.002); g.lineTo(lx-W*0.016, my+H*0.028);
  g.stroke();
  g.beginPath();                                        // Athena: spear upright
  g.moveTo(rx, my-H*0.030); g.lineTo(rx, my+H*0.030);
  g.moveTo(rx-W*0.020, my-H*0.008); g.lineTo(rx+W*0.020, my-H*0.008);
  g.stroke();
  pen.paint(()=>{                                        // spear head
    g.moveTo(rx, my-H*0.050); g.lineTo(rx+W*0.020, my-H*0.020);
    g.lineTo(rx-W*0.020, my-H*0.020); g.closePath();
  }, toneSolid(inkLevel(6)), 2.8);
}

/* ---- authority stem: a narrow double line dropping from the seal into the
   tablet through the break in its top edge. ---- */
function drawStem(pen,g,W,H){
  const cx=W*params.sealCx, y0=H*params.sealCy + W*params.sealR*1.46;
  const y1=H*params.tablet.y0 + H*0.014;
  const d = W*0.011;
  pen.ink(()=>{ g.moveTo(cx-d,y0); g.lineTo(cx-d,y1); g.moveTo(cx+d,y0); g.lineTo(cx+d,y1); }, 3);
  pen.paint(()=>{                                        // arrowhead into the tablet
    g.moveTo(cx-d*2.2, y1-H*0.006); g.lineTo(cx+d*2.2, y1-H*0.006);
    g.lineTo(cx, y1+H*0.014); g.closePath();
  }, toneSolid(inkLevel(6)), 2.6);
}

/* ---- the decree SPINE: a double rail down the tablet's left gutter with a node
   at every clause row, descending as `reach` grows and continuing past the last
   clause to the vendetta line — the link between decree and consequence. ---- */
function drawSpine(pen,g,W,H,reach){
  const x=W*params.spineX, d=W*0.008;
  const y0=H*(params.tablet.y0+0.016);
  const yEnd=lerp(y0, H*(params.feudY-0.012), smooth(clamp01(reach)));
  pen.ink(()=>{ g.moveTo(x-d,y0); g.lineTo(x-d,yEnd); g.moveTo(x+d,y0); g.lineTo(x+d,yEnd); }, 2.8);
  for(const c of CLAUSES){
    const cy=H*c.y;
    if (cy > yEnd) continue;
    pen.paint(()=>{ g.arc(x,cy,W*0.016,0,TAU); }, toneSolid(inkLevel(4)), 2.8);
    pen.ink(()=>{ g.moveTo(x+W*0.016, cy); g.lineTo(W*c.x0, cy); }, 2.4);
  }
}

/* ---- right-margin DURATION AXIS: the span of time the state binds. A broken
   vertical rule with graduation ticks and a forward arrow at its foot. ---- */
function drawAxis(pen,g,W,H,reach){
  const x=W*params.axisX;
  const y0=H*params.tablet.y0, y1=H*(params.feudY-0.030);
  const yE=lerp(y0,y1,smooth(clamp01(reach)));
  g.strokeStyle=inkLevel(6); g.lineWidth=3.4; g.lineCap="butt";
  g.beginPath();
  let y=y0; while(y<yE){ const e=Math.min(y+H*0.034,yE); g.moveTo(x,y); g.lineTo(x,e); y=e+H*0.014; }
  g.stroke();
  g.strokeStyle=INK; g.lineWidth=3;
  for(const c of CLAUSES){ if(H*c.y>yE) continue;
    g.beginPath(); g.moveTo(x-W*0.020,H*c.y); g.lineTo(x,H*c.y); g.stroke(); }
  if (reach>0.55) pen.paint(()=>{
    g.moveTo(x-W*0.018,yE); g.lineTo(x+W*0.018,yE); g.lineTo(x,yE+H*0.024); g.closePath();
  }, toneSolid(inkLevel(6)), 2.6);
}

/* ---------- clause GLYPHS: blocky diagrams, each inside a square box ---------- */
function glyphCrown(pen,g,x,y,s){
  pen.paint(()=>{                                   // three merlons on a band
    g.moveTo(x, y+s*0.86); g.lineTo(x, y+s*0.30);
    g.lineTo(x+s*0.17, y+s*0.52); g.lineTo(x+s*0.34, y+s*0.16);
    g.lineTo(x+s*0.50, y+s*0.52); g.lineTo(x+s*0.67, y+s*0.16);
    g.lineTo(x+s*0.83, y+s*0.52); g.lineTo(x+s, y+s*0.30);
    g.lineTo(x+s, y+s*0.86); g.closePath();
  }, toneSolid(inkLevel(4)), 3.2);
  pen.ink(()=>{ g.moveTo(x+s*0.06,y+s*0.68); g.lineTo(x+s*0.94,y+s*0.68); }, 2.6);
}
function glyphHand(pen,g,x,y,s){
  pen.paint(()=>{ rectPath(g, x+s*0.22, y+s*0.46, s*0.60, s*0.36); },  // palm
            toneSolid(inkLevel(3)), 3.4);
  for(let i=0;i<4;i++){                                                // fingers
    const fx = x+s*0.26+i*s*0.145;
    pen.paint(()=>{ rectPath(g, fx, y+s*0.08, s*0.108, s*0.40); }, toneSolid(inkLevel(3)), 3);
  }
  pen.paint(()=>{ rectPath(g, x+s*0.02, y+s*0.50, s*0.20, s*0.17); },   // thumb
            toneSolid(inkLevel(3)), 3);
  pen.ink(()=>{ g.moveTo(x+s*0.06,y+s*0.94); g.lineTo(x+s*0.96,y+s*0.94); }, 4);
}
function glyphWipe(pen,g,x,y,s,u){
  pen.paint(()=>{ rectPath(g,x,y,s,s); }, toneSolid(inkLevel(1)), 3.4);
  const keep = 1 - 0.56*smooth(clamp01(u));
  g.save(); g.beginPath(); g.rect(x, y, s*keep, s); g.clip();
  g.strokeStyle=INK; g.lineWidth=5; g.lineJoin="round"; g.lineCap="round";
  g.beginPath();
  for(let i=0;i<=5;i++){
    const px=x+s*(i/5), py=y+s*(i%2?0.28:0.72);
    if(i) g.lineTo(px,py); else g.moveTo(px,py);
  }
  g.stroke(); g.restore();
  // the wiping front + what is left of the grievance, dissolving
  if (u>0.02){
    const fx = x+s*keep;
    pen.ink(()=>{ g.moveTo(fx,y+s*0.02); g.lineTo(fx,y+s*0.98); }, 4);
    g.fillStyle=inkLevel(5);
    for(let i=0;i<3;i++){
      const px=fx+s*(0.14+i*0.24), py=y+s*(i%2?0.34:0.64);
      if(px>x+s*0.94) break;
      g.beginPath(); g.arc(px,py,s*0.055*(1-i*0.25),0,TAU); g.fill();
    }
  }
}
function glyphStack(pen,g,x,y,s){
  const bw=s*0.30, bh=s*0.27;
  const rows=[3,2,1];
  rows.forEach((n,r)=>{
    const yy=y+s*0.92-(r+1)*bh;
    const x0=x+(s-(n*bw+(n-1)*s*0.03))/2;
    for(let i=0;i<n;i++){
      const xx=x0+i*(bw+s*0.03);
      pen.paint(()=>{ rectPath(g,xx,yy,bw,bh); }, toneSolid(inkLevel(r===2?5:3)), 3);
    }
  });
  pen.paint(()=>{                                    // a jar handle on the top block
    g.moveTo(x+s*0.34,y+s*0.13); g.lineTo(x+s*0.66,y+s*0.13);
  }, toneSolid(inkLevel(6)), 4);
  g.strokeStyle=INK; g.lineWidth=3; g.beginPath();
  dashRun(g, x+s*0.02, x+s*0.98, y+s*0.98, s*0.24, s*0.09); g.stroke();
}
function glyphLevel(pen,g,x,y,s,t){
  pen.paint(()=>{                                                       // fulcrum
    g.moveTo(x+s*0.50,y+s*0.34); g.lineTo(x+s*0.86,y+s*0.90);
    g.lineTo(x+s*0.14,y+s*0.90); g.closePath();
  }, toneSolid(inkLevel(5)), 3.4);
  pen.paint(()=>{ rectPath(g, x+s*0.02, y+s*0.14, s*0.96, s*0.20); },   // beam, dead level
            toneSolid(inkLevel(2)), 3.4);
  pen.paint(()=>{ g.arc(x+s*0.50,y+s*0.24,s*0.075,0,TAU); },            // the bubble, centred
            toneSolid(inkLevel(0)), 3);
  pen.ink(()=>{ g.moveTo(x+s*0.30,y+s*0.14); g.lineTo(x+s*0.30,y+s*0.34);
                g.moveTo(x+s*0.70,y+s*0.14); g.lineTo(x+s*0.70,y+s*0.34); }, 2.6);
  g.strokeStyle=INK; g.lineWidth=3.4; g.lineCap="butt";                 // solid ground
  g.beginPath(); dashRun(g, x, x+s, y+s*0.96, s*0.26, s*0.10); g.stroke();
}
const GLYPHS = {
  crown:(p,g,x,y,s)=>glyphCrown(p,g,x,y,s),
  hand: (p,g,x,y,s)=>glyphHand(p,g,x,y,s),
  wipe: (p,g,x,y,s,t,u)=>glyphWipe(p,g,x,y,s,u),
  stack:(p,g,x,y,s)=>glyphStack(p,g,x,y,s),
  level:(p,g,x,y,s,t)=>glyphLevel(p,g,x,y,s,t),
};

/* ---- one CLAUSE row: a staggered pale plate carrying a counted index (square
   pips, drawn as geometry so nothing depends on small type), the clause glyph,
   a broken extent measure, and the seal socket at its right end. `u` is how far
   this clause has sealed. ---- */
function drawClause(pen,g,W,H,c,n,u,t){
  const x0=W*c.x0, x1=W*c.x1, cy=H*c.y, h=H*params.rowH;
  const y0=cy-h/2;
  // the plate — blank paper while pending, taking tone once the clause has bound
  pen.paint(()=>{ rectPath(g,x0,y0,x1-x0,h); },
            toneSolid(inkLevel(u>0.5?2:0)), 3.6);
  // counted index: a punched white slot with (n) solid pips
  const bw=W*0.160, bh=h*0.50, bx=x0+W*0.014, by=cy-bh/2;
  pen.paint(()=>{ rectPath(g,bx,by,bw,bh); }, toneSolid(inkLevel(0)), 3);
  const pw=W*0.021, gp=W*0.0085;
  const run=n*pw+(n-1)*gp, px0=bx+(bw-run)/2;
  for(let i=0;i<n;i++){
    g.fillStyle=inkLevel(7);
    g.fillRect(px0+i*(pw+gp), cy-pw*0.52, pw, pw*1.04);
  }
  // the clause glyph
  const s=W*params.glyphS, gx=bx+bw+W*0.026, gy=cy-s/2;
  (GLYPHS[c.glyph]||GLYPHS.crown)(pen,g,gx,gy,s,t,u);
  // broken extent measure from the glyph to the seal socket
  const mx0=gx+s+W*0.026, mx1=x1-W*0.074;
  if (mx1>mx0){
    g.strokeStyle=inkLevel(u>0.5?6:4); g.lineWidth=u>0.5?4:2.6; g.lineCap="butt";
    g.beginPath(); dashRun(g,mx0,mx1,cy,W*0.034,W*0.016); g.stroke();
    g.strokeStyle=INK; g.lineWidth=2.6;
    g.beginPath();
    g.moveTo(mx0,cy-h*0.20); g.lineTo(mx0,cy+h*0.20);
    g.moveTo(mx1,cy-h*0.20); g.lineTo(mx1,cy+h*0.20);
    g.stroke();
  }
  // SEAL socket at the right end — stamped solid as the clause binds
  const sx=x1-W*0.038, R=W*0.030;
  pen.paint(()=>{ g.arc(sx,cy,R,0,TAU); }, toneSolid(inkLevel(0)), 3);
  if (u>0.02){
    const uu=smooth(clamp01(u));
    pen.paint(()=>{ g.arc(sx,cy,R*lerp(0.30,0.86,uu),0,TAU); },
              toneSolid(inkLevel(7)), 2.6);
    if (uu>0.55){
      g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
      for(let i=0;i<8;i++){
        const th=i/8*TAU+t*0.10;
        g.beginPath();
        g.moveTo(sx+Math.cos(th)*R*0.92, cy+Math.sin(th)*R*0.92);
        g.lineTo(sx+Math.cos(th)*R*1.22, cy+Math.sin(th)*R*1.22);
        g.stroke();
      }
    }
  }
}

/* ---- CONSEQUENCE: the vendetta line. Barbed zigzag of blood-feud to the right
   of the settling front, straight civic course to the left of it, with small
   standing marks on the settled stretch. Broken into segments so it never reads
   as one bar across the frame. ---- */
function drawFeud(pen,g,W,H,t,settle){
  const y=H*params.feudY, x0=W*params.feudX[0], x1=W*params.feudX[1];
  const S=smooth(clamp01(settle));
  const fx=lerp(x0,x1,S);
  const amp=H*0.026, step=(x1-x0)/16;
  // still-feuding stretch: barbed zigzag
  g.strokeStyle=INK; g.lineWidth=3.6; g.lineJoin="round"; g.lineCap="round";
  if (fx < x1-2){
    g.beginPath();
    let started=false;
    for(let x=x0;x<=x1+0.001;x+=step){
      if (x < fx-0.001) continue;
      const k=Math.round((x-x0)/step);
      const py=y+(k%2?-amp:amp)*(0.9+0.1*Math.sin(t*1.6+k));
      if(!started){ g.moveTo(Math.max(x,fx),py); started=true; } else g.lineTo(x,py);
    }
    g.stroke();
    // barbs on the feud
    g.lineWidth=2.6;
    for(let x=fx+step*0.5;x<x1-step*0.4;x+=step){
      const k=Math.round((x-x0)/step);
      const py=y+(k%2?-amp:amp)*0.55;
      g.beginPath(); g.moveTo(x,py); g.lineTo(x+step*0.16, py-amp*0.55); g.stroke();
    }
  }
  // settled stretch: a broken straight course
  if (fx > x0+2){
    g.strokeStyle=INK; g.lineWidth=5.4; g.lineCap="butt";
    g.beginPath(); dashRun(g,x0,fx,y,W*0.072,W*0.022); g.stroke();
    // small standing civic marks on solid ground
    for(let i=0;i<7;i++){
      const px=x0+W*0.045+i*W*0.112;
      if (px>fx-W*0.020) break;
      pen.paint(()=>{ rectPath(g,px,y-H*0.030,W*0.030,H*0.030); },
                toneSolid(inkLevel(2)), 2.8);
      pen.paint(()=>{
        g.moveTo(px-W*0.012,y-H*0.030); g.lineTo(px+W*0.042,y-H*0.030);
        g.lineTo(px+W*0.015,y-H*0.058); g.closePath();
      }, toneSolid(inkLevel(5)), 2.8);
    }
  }
  // the settling front: a wedge driving the feud flat
  if (S>0.01 && S<0.995){
    pen.paint(()=>{
      g.moveTo(fx-W*0.020,y-H*0.040); g.lineTo(fx+W*0.020,y-H*0.040);
      g.lineTo(fx,y-H*0.008); g.closePath();
    }, toneSolid(inkLevel(6)), 2.8);
    pen.ink(()=>{ g.moveTo(fx,y-H*0.052); g.lineTo(fx,y+H*0.040); }, 3);
  }
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=st.t ?? 0;
  const inten=st.intensity ?? params.intensity;
  const bind  = st.bind   ?? clamp(inten,0,1);
  const settle= st.settle ?? clamp((inten-0.45)*2.0,0,1);
  const reach = st.reach  ?? clamp((inten-0.10)*1.30,0,1);
  const layers = st.layers || ["tablet","assent","stem","spine","axis","clauses","feud"];
  const has = l => layers.includes(l);

  if (has("tablet")) drawTablet(pen,g,W,H);
  if (has("spine"))  drawSpine(pen,g,W,H,reach);
  if (has("axis"))   drawAxis(pen,g,W,H,reach);
  if (has("clauses")) CLAUSES.forEach((c,i)=>{
    drawClause(pen,g,W,H,c,i+1, clamp01(bind*CLAUSES.length - i), t);
  });
  if (has("stem"))   drawStem(pen,g,W,H);
  if (has("assent")) drawAssent(pen,g,W,H,t,inten);
  if (has("feud"))   drawFeud(pen,g,W,H,t,settle);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine-fx.peace-decree",
  type:"DIVINE_FX",
  name:"Peace decree",
  statusWord:"DECREED",
  scene:"OD-B24-S07",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["tablet","spine","axis","clauses","stem","assent","feud"],
  // normalized 0..1 source / target / field / clause / consequence anchors
  anchors:{
    "source:zeus-assent":{   x:0.500, y:0.104 },  // the granted word, the seal
    "source:zeus-mark":{     x:0.335, y:0.104 },  // the bolt tick
    "source:athena-mark":{   x:0.665, y:0.104 },  // the spear upright
    "field:decree":{         x:0.487, y:0.496 },  // the tablet as a whole
    "spine:rail":{           x:0.117, y:0.496 },  // the authority spine
    "clause:kingship":{      x:0.456, y:0.258 },
    "clause:oath":{          x:0.530, y:0.368 },
    "clause:forgetting":{    x:0.425, y:0.478 },
    "clause:wealth":{        x:0.543, y:0.588 },
    "clause:stability":{     x:0.470, y:0.698 },
    "seal:last":{            x:0.752, y:0.698 },  // the fifth stamp
    "axis:duration":{        x:0.940, y:0.500 },  // the span of time it binds
    "target:ithaca":{        x:0.500, y:0.860 },  // the island the state falls on
    "consequence:feud":{     x:0.500, y:0.860 },  // the flattened vendetta line
    "camera:wide":{          x:0.500, y:0.500 },
  },
  // affected regions
  zones:{
    decree:{ x0:0.090, y0:0.196, x1:0.884, y1:0.796 },  // the tablet footprint
    assent:{ x0:0.300, y0:0.030, x1:0.700, y1:0.180 },  // the source seal band
    feud:{   x0:0.080, y0:0.800, x1:0.910, y1:0.905 },  // the vendetta corridor
  },
  // DIVINE_FX transformation states: spoken -> entered -> sealing -> decreed
  states:{
    initial:"transform",
    nodes:{
      // source: the assent alone; clauses blank, the feud jagged end to end
      source:{    preview:{ t:0.4, intensity:0.22, bind:0.0,  settle:0.0,  reach:0.10,
                            status:"SPOKEN",  progress:0.12 } },
      // target: the spine descends and the first clauses take
      target:{    preview:{ t:1.1, intensity:0.52, bind:0.42, settle:0.14, reach:0.58,
                            status:"ENTERED", progress:0.38 } },
      // field: clauses seal one by one, the settling front runs
      field:{     preview:{ t:1.9, intensity:0.80, bind:0.76, settle:0.55, reach:0.88,
                            status:"SEALING", progress:0.64 } },
      // transform: all five stamped, the vendetta line run true (neutral)
      transform:{ preview:{ t:2.7, intensity:1.25, bind:1.0,  settle:1.0,  reach:1.0,
                            status:"DECREED", progress:0.94 } },
    },
    edges:[["source","target"],["target","field"],["field","transform"],
           ["transform","field"],["field","target"]],
  },
  duration:7.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","bind","settle","reach"],

  // neutral preview: the decree fully entered — assent sealed above, all five
  // clauses stamped, and the blood-feud flattened into a straight civic course.
  preview:()=>({ t:2.6, intensity:1.25, bind:1.0, settle:1.0, reach:1.0,
                 status:"DECREED", progress:0.94,
                 layers:["tablet","spine","axis","clauses","stem","assent","feud"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
