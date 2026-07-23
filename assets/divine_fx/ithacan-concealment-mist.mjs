/* divine_fx.ithacan-concealment-mist — the landmark-obscuring grey mist Athena
   pours over Odysseus's own coastline so his home reads as a FOREIGN shore until
   she chooses to release it. DIVINE_FX asset. Scene function (OD-B13-S02): the
   known Ithacan coast — Mount Neriton, the harbour of Phorkys, the long-leafed
   OLIVE, the cave of the Nymphs — is draped in a horizontal veiling fog band that
   DIMS every feature to a flat grey; the recognizable landmarks survive only as
   faint dashed GHOST outlines under the veil, so the whole familiar landscape
   reads as an unknown country. A compact readout glyph (a landmark peak inside a
   recognition ring: barred = FOREIGN, open = KNOWN) reads the field charge.

   Composition (looking at the shore from Odysseus's beached position, sea in the
   foreground): SKY over the ridge -> MOUNTAIN (Neriton) -> the LAND band carrying
   the olive, the harbour inlet and the nymph-cave -> foreground SEA. The mist
   veils the mountain base + land band; the near sea stays clear.

   Procedural over state.t + veil (the master field charge):
     SOURCE   (t≈.3, veil≈.30) — the goddess-origin gathers off the ridge; the fog
                                 is thin wisps, the coast still mostly itself, the
                                 landmarks solid and legible.
     FIELD    (t≈2.0, veil≈1.0)— full opacity veil band draped across the shore;
                                 every landmark dimmed to flat grey, surviving only
                                 as dashed ghosts: the known coast reads FOREIGN.
     TRANSFORM(t≈2.8, veil→low)— the veil WITHDRAWS (lifts and thins upward); the
                                 landmarks re-emerge solid and dark, ghosts fade,
                                 recognition restored: KNOWN / RELEASED.
   The mist is drawn as overlapping SOLID light puffs forming a horizontal band
   (the engine POST pass dithers them into a soft fog); do NOT pre-dither. Engine
   primitives only, solid grays + hard contour. Keep the sky band light so the
   card LABEL stays legible. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  ridgeY:    0.44,   // where sky meets the island ridgeline, frac of H
  seaY:      0.72,   // top of the clear foreground sea (below the land band)
  neritonX:  0.44,   // Mount Neriton apex x, frac of W (the great recognizable peak)
  oliveX:    0.255,  // the long-leafed olive x, frac of W
  harbourX:  0.52,   // harbour of Phorkys inlet x
  caveX:     0.755,  // cave of the Nymphs x
  puffs:     15,     // soft fog puffs distributed along the veil band
  bandY:     0.40,   // veil-band center y, frac of H
  veil:      1.0,    // master field charge (channel-driven): fog / dim / foreign
};

/* ============================================================
   LANDMARK PATH HELPERS — each lays down a bare path (no begin/fill/stroke) so
   the SOLID land draw and the dashed GHOST-outline pass can share one geometry.
   ============================================================ */
function pathNeriton(g,W,H){
  const ax=W*params.neritonX, ay=H*0.155, base=H*params.ridgeY;
  g.moveTo(W*0.14, base);
  g.lineTo(W*0.30, H*0.28);                       // lower left shoulder
  g.lineTo(ax-W*0.05, H*0.21);
  g.lineTo(ax, ay);                                // main summit
  g.lineTo(ax+W*0.09, H*0.235);
  g.lineTo(W*0.66, H*0.30);                        // a secondary crag
  g.lineTo(W*0.62, H*0.235);
  g.lineTo(W*0.72, base);
  g.closePath();
}
function pathOlive(g,W,H){
  const cx=W*params.oliveX, baseY=H*0.60, topY=H*0.475;
  // trunk
  g.moveTo(cx-W*0.014, baseY);
  g.lineTo(cx-W*0.010, topY+H*0.02);
  g.lineTo(cx+W*0.010, topY+H*0.02);
  g.lineTo(cx+W*0.014, baseY);
  g.closePath();
}
function pathOliveCanopy(g,W,H){
  const cx=W*params.oliveX, cy=H*0.455, rx=W*0.075, ry=H*0.052;
  // a lobed olive crown (three bumps)
  g.moveTo(cx-rx, cy+ry*0.2);
  g.arc(cx-rx*0.45, cy, ry*0.95, Math.PI*0.65, Math.PI*1.9);
  g.arc(cx+rx*0.05, cy-ry*0.35, ry*1.05, Math.PI*1.05, Math.PI*2.0);
  g.arc(cx+rx*0.55, cy+ry*0.05, ry*0.9, Math.PI*1.55, Math.PI*0.45);
  g.lineTo(cx+rx, cy+ry*0.4);
  g.quadraticCurveTo(cx, cy+ry*1.15, cx-rx, cy+ry*0.2);
  g.closePath();
}
function pathCaveHill(g,W,H){
  const cx=W*params.caveX, base=H*0.64;
  g.moveTo(cx-W*0.14, base);
  g.quadraticCurveTo(cx-W*0.11, H*0.505, cx, H*0.495);
  g.quadraticCurveTo(cx+W*0.11, H*0.505, cx+W*0.145, base);
  g.closePath();
}
function pathCaveMouth(g,W,H){
  const cx=W*params.caveX, base=H*0.635, w=W*0.045, top=H*0.565;
  g.moveTo(cx-w, base);
  g.lineTo(cx-w, top+H*0.02);
  g.quadraticCurveTo(cx, top-H*0.012, cx+w, top+H*0.02);
  g.lineTo(cx+w, base);
  g.closePath();
}

/* ============================================================
   SKY + FOREGROUND SEA (kept clear) — the frame the veil sits inside.
   ============================================================ */
function drawSky(pen,g,W,H){
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H*params.ridgeY);
}
function drawSea(pen,g,W,H,t){
  const sy=H*params.seaY;
  g.fillStyle = inkLevel(2); g.fillRect(0,sy,W,H-sy);
  g.fillStyle = inkLevel(3); g.fillRect(0,sy,W,H*0.010);
  pen.ink(()=>{ g.moveTo(0,sy); g.lineTo(W,sy); }, 4);
  // clear near-water ripple streaks (paper channels) drifting with t
  g.strokeStyle = inkLevel(1); g.lineCap="round";
  const n=4;
  for(let r=0;r<n;r++){
    const f=(r+0.5)/n;
    const y=lerp(sy+H*0.02, H*0.985, f);
    const amp=lerp(2.5,7,f), step=lerp(74,52,f), drift=(t*18+r*21)%step;
    g.lineWidth=lerp(1.6,3.4,f);
    g.beginPath();
    for(let x=-step;x<W+step;x+=step){ const cx=x+drift; g.moveTo(cx,y); g.quadraticCurveTo(cx+step*0.5,y-amp,cx+step,y); }
    g.stroke();
  }
}

/* ============================================================
   THE KNOWN COAST — mountain + land band carrying the three landmarks, drawn
   SOLID. `dim` (=veil) drives the tone lighter so the whole coast fades toward a
   flat grey as the veil takes (the "reads as foreign" flatten). Returns nothing;
   the ghost pass re-uses the path helpers.
   ============================================================ */
function drawCoast(pen,g,W,H,dim){
  const d=clamp01(dim);
  const ridge=H*params.ridgeY, land=H*(params.seaY-0.005);

  // MOUNTAIN (Neriton) — the great recognizable peak; stays dark enough to read
  // THROUGH the fog (dims 5 -> 3, so under full veil it's a flat mid-grey mass).
  const mLvl=clamp(Math.round(lerp(5,3,d)),3,5);
  pen.paint(()=>pathNeriton(g,W,H), toneSolid(inkLevel(mLvl)), 5);
  // a light snow/scar seam on the summit so it reads as a landmark, not a blob
  g.strokeStyle=inkLevel(1); g.lineWidth=2.4; g.lineCap="round";
  g.beginPath();
  g.moveTo(W*params.neritonX, H*0.18); g.lineTo(W*params.neritonX-W*0.03, H*0.235);
  g.moveTo(W*params.neritonX, H*0.18); g.lineTo(W*params.neritonX+W*0.035, H*0.245);
  g.stroke();

  // LAND BAND (the island shore) beneath the ridge; solid mass, gentle ridgeline.
  // dims 5 -> 4 so a real landscape survives under the veil.
  const lLvl=clamp(Math.round(lerp(5,4,d)),4,5);
  pen.paint(()=>{
    g.moveTo(0, ridge);
    g.lineTo(W*0.20, ridge-H*0.006);
    g.lineTo(W*0.42, ridge+H*0.018);
    g.lineTo(W*0.58, ridge+H*0.030);
    g.lineTo(W*0.86, ridge+H*0.006);
    g.lineTo(W, ridge-H*0.002);
    g.lineTo(W, land); g.lineTo(0, land);
    g.closePath();
  }, toneSolid(inkLevel(lLvl)), 5);

  // harbour of Phorkys — a small light inlet biting into the shore base (a bay of
  // clear water), with two mooring ticks. Sits BELOW the fog so it reads clear.
  const hx=W*params.harbourX, hy=land-H*0.050;
  pen.paint(()=>{ g.ellipse(hx, hy, W*0.080, H*0.026, 0, 0, TAU); }, toneSolid(inkLevel(2)), 4);
  g.strokeStyle=inkLevel(1); g.lineWidth=2.4; g.lineCap="round";
  g.beginPath(); g.moveTo(hx-W*0.050, hy); g.lineTo(hx+W*0.050, hy); g.stroke();
  g.strokeStyle=INK; g.lineWidth=2.6;
  g.beginPath(); g.moveTo(hx-W*0.02, hy+H*0.004); g.lineTo(hx-W*0.02, hy-H*0.016);
  g.moveTo(hx+W*0.02, hy+H*0.004); g.lineTo(hx+W*0.02, hy-H*0.016); g.stroke();

  // CAVE-hill on the right (dims 6 -> 4) with a dark cave mouth (kept darkest)
  const hLvl=clamp(Math.round(lerp(6,4,d)),4,6);
  pen.paint(()=>pathCaveHill(g,W,H), toneSolid(inkLevel(hLvl)), 5);
  const cLvl=clamp(Math.round(lerp(7,5,d)),5,7);
  pen.paint(()=>pathCaveMouth(g,W,H), toneSolid(inkLevel(cLvl)), 4);

  // the long-leafed OLIVE — trunk + lobed canopy (dims 6 -> 4)
  const tLvl=clamp(Math.round(lerp(6,4,d)),4,6);
  pen.paint(()=>pathOlive(g,W,H), toneSolid(inkLevel(clamp(tLvl+1,5,7))), 4);
  pen.paint(()=>pathOliveCanopy(g,W,H), toneSolid(inkLevel(tLvl)), 5);
}

/* ============================================================
   THE VEIL — a horizontal band of overlapping soft LIGHT puffs draped across the
   mountain base + land band, dithered by the POST pass into a grey fog. Coverage,
   count-active and vertical spread scale with `veil`; the band DRIFTS on t and,
   as the veil WITHDRAWS (low veil), it lifts upward and thins so the clear coast
   returns. Drawn in flat light grays; do NOT pre-dither.
   ============================================================ */
function drawVeil(pen,g,W,H,t,veil){
  const v=clamp01(veil);
  if (v<=0.02) return;
  const perRow=8, rows=2;
  // as the veil withdraws the whole band rises toward the ridge and thins
  const bandCy=H*params.bandY - (1-v)*H*0.11;
  const cover = lerp(0.55, 1.06, v);            // puff radius scale
  // draw the fog as two overlapping rows of MID-grey puffs forming one soft bank.
  // no contour (outline off) so the puffs fuse into a continuous drape; the POST
  // pass dithers the flat grey into fog. Lower row is the denser body, upper the
  // thinning crest that lifts away first on withdraw.
  for(let row=0; row<rows; row++){
    const rowUp = row===1;                       // the crest row
    if (rowUp && v<0.45) continue;               // crest gone once it starts lifting
    const ry = bandCy + (rowUp ? -H*0.075 : H*0.026);
    const lvl = rowUp ? 2 : 3;                   // fog LIGHTER than the land it dims
    for(let k=0;k<perRow;k++){
      const fx=(k+ (rowUp?0.5:0))/(perRow-1);
      const drift=Math.sin(t*0.7 + k*1.3 + row)*W*0.016;
      const px=lerp(-W*0.06, W*1.06, fx) + drift;
      const py=ry + Math.sin(t*1.3 + k*2.1 + row*1.7)*H*0.006;
      const pr=W*(0.080 + 0.020*Math.sin(k*2.3+row)) * cover;
      g.beginPath(); g.ellipse(px,py,pr,pr*0.62, Math.sin(k+row)*0.15, 0, TAU);
      g.fillStyle=inkLevel(lvl); g.fill();
    }
  }
}

/* ============================================================
   GHOST OUTLINES — the surviving trace of the known landmarks UNDER the veil:
   faint dashed contours of the mountain, olive and cave, drawn over the fog so
   the viewer sees WHAT is hidden. They strengthen with the veil (you only see the
   ghost when the solid feature is fog-dimmed) and fade out as it withdraws.
   ============================================================ */
function drawGhosts(pen,g,W,H,veil){
  const v=clamp01(veil);
  if (v<=0.12) return;
  g.save();
  g.strokeStyle=inkLevel(clamp(3+Math.round(v*2),3,5));
  g.lineWidth=2.2; g.setLineDash([7,6]); g.lineCap="round"; g.lineJoin="round";
  g.beginPath(); pathNeriton(g,W,H); g.stroke();
  g.beginPath(); pathOliveCanopy(g,W,H); g.stroke();
  g.beginPath(); pathCaveHill(g,W,H); g.stroke();
  g.beginPath(); pathCaveMouth(g,W,H); g.stroke();
  g.restore();
  // small "?" recognition ticks floating over the dimmed landmarks (foreign)
  if (v>0.5){
    g.strokeStyle=inkLevel(5); g.lineWidth=2.6; g.lineCap="round";
    for(const lx of [params.oliveX, params.neritonX, params.caveX]){
      const qx=W*lx, qy=H*0.335;
      g.beginPath();
      g.arc(qx, qy, W*0.012, Math.PI*0.9, Math.PI*0.2, false);
      g.stroke();
      g.beginPath(); g.moveTo(qx+W*0.006, qy+W*0.010); g.lineTo(qx+W*0.006, qy+W*0.018); g.stroke();
      g.beginPath(); g.arc(qx+W*0.006, qy+W*0.026, 1.4, 0, TAU); g.stroke();
    }
  }
}

/* ============================================================
   SOURCE — the unseen goddess-origin (Athena). A faint dashed marker up in the
   sky pouring thin dotted wisps down onto the ridgeline where the mist gathers.
   Kept very light so it reads as "not embodied."
   ============================================================ */
function drawSource(pen,g,W,H,t,veil){
  const v=clamp01(veil);
  const sx=W*0.16, sy=H*0.115;
  g.save();
  g.strokeStyle=inkLevel(clamp(1+Math.round(v*2),1,3)); g.lineWidth=1.8;
  g.setLineDash([4,5]); g.lineCap="round";
  g.beginPath(); g.arc(sx, sy, W*0.028, 0, TAU); g.stroke();
  for(let k=0;k<3;k++){
    const off=(k-1)*W*0.03;
    const tx=W*(params.neritonX-0.02)+off, ty=H*params.ridgeY-H*0.01;
    g.beginPath();
    g.moveTo(sx+off*0.3, sy+W*0.028);
    g.quadraticCurveTo((sx+tx)/2+off, (sy+ty)/2-H*0.02+Math.sin(t*1.3+k)*4, tx, ty);
    g.stroke();
  }
  g.restore();
}

/* ============================================================
   READOUT GLYPH — a landmark peak inside a recognition ring. When the field is
   charged the ring is BARRED (a slash) = the coast reads FOREIGN; as it releases
   the bar clears and an outward tick opens = KNOWN. Charge pips read the veil.
   ============================================================ */
function drawGlyph(pen,g,W,H,veil){
  const v=clamp01(veil);
  const gx=W*0.82, gy=H*0.135, s=W*0.070;
  // recognition ring
  pen.paint(()=>{ g.arc(gx, gy, s*0.9, 0, TAU); }, toneSolid(inkLevel(2)), 3);
  // the landmark peak inside (darkens with charge — the obscured feature)
  const pkLvl=clamp(4+Math.round(v*3),4,7);
  pen.paint(()=>{
    g.moveTo(gx-s*0.55, gy+s*0.45);
    g.lineTo(gx-s*0.10, gy-s*0.35);
    g.lineTo(gx+s*0.12, gy+s*0.05);
    g.lineTo(gx+s*0.30, gy-s*0.15);
    g.lineTo(gx+s*0.6, gy+s*0.45);
    g.closePath();
  }, toneSolid(inkLevel(pkLvl)), 3);
  // barred (FOREIGN) vs open (KNOWN)
  g.lineCap="round";
  if (v>0.45){
    g.strokeStyle=INK; g.lineWidth=3.4;
    g.beginPath(); g.moveTo(gx-s*0.95, gy-s*0.7); g.lineTo(gx+s*0.95, gy+s*0.7); g.stroke();
  } else {
    g.strokeStyle=INK; g.lineWidth=2.6;
    g.beginPath(); g.moveTo(gx+s*0.9, gy); g.lineTo(gx+s*1.35, gy); g.stroke();
    g.beginPath(); g.moveTo(gx+s*1.35, gy); g.lineTo(gx+s*1.18, gy-s*0.14); g.moveTo(gx+s*1.35,gy); g.lineTo(gx+s*1.18, gy+s*0.14); g.stroke();
  }
  // charge pips
  const pips=Math.round(clamp01(v)*3);
  for(let p=0;p<3;p++){
    g.beginPath(); g.arc(gx-s*0.6+p*W*0.026, gy+s*1.15, W*0.008, 0, TAU);
    g.fillStyle = p<pips ? inkLevel(6) : inkLevel(2); g.fill();
  }
}

/* ============================================================ */
function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=st.t ?? 0;
  const veil=st.veil ?? params.veil;
  const layers=st.layers || ["sky","coast","sea","veil","ghosts","source","glyph"];
  const has=l=>layers.includes(l);

  if (has("sky"))    drawSky(pen,g,W,H);
  if (has("coast"))  drawCoast(pen,g,W,H,veil);
  if (has("sea"))    drawSea(pen,g,W,H,t);
  if (has("veil"))   drawVeil(pen,g,W,H,t,veil);
  if (has("ghosts")) drawGhosts(pen,g,W,H,veil);
  if (has("source")) drawSource(pen,g,W,H,t,veil);
  if (has("glyph"))  drawGlyph(pen,g,W,H,veil);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.ithacan-concealment-mist",
  type:"DIVINE_FX",
  name:"Ithacan concealment mist",
  statusWord:"FOREIGN",
  scene:"OD-B13-S02",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["sky","coast","sea","veil","ghosts","source","glyph"],
  // normalized 0..1 source / field / landmark / consequence anchors
  anchors:{
    "source:athena":{  x:0.16, y:0.115 },   // the unseen goddess-origin (no body)
    "field:band":{     x:0.50, y:0.40  },   // veil-band center
    "mark:neriton":{   x:0.44, y:0.20  },   // Mount Neriton (the obscured peak)
    "mark:olive":{     x:0.255,y:0.455 },   // the long-leafed olive
    "mark:harbour":{   x:0.52, y:0.66  },   // harbour of Phorkys inlet
    "mark:cave":{      x:0.755,y:0.60  },   // cave of the Nymphs
    "readout:glyph":{  x:0.82, y:0.135 },   // the FOREIGN/KNOWN recognition glyph
    "camera:wide":{    x:0.50, y:0.50  },
  },
  // affected regions
  zones:{
    veilband:{ x0:0.00, y0:0.24, x1:1.00, y1:0.66 },   // the fog footprint over the coast
    coast:{    x0:0.06, y0:0.14, x1:0.94, y1:0.72 },   // the obscured known landscape
    clearsea:{ x0:0.00, y0:0.72, x1:1.00, y1:1.00 },   // the near water left legible
  },
  // DIVINE_FX field states: source -> field(veil) -> transform(withdraw)
  states:{
    initial:"field",
    nodes:{
      // source: the mist gathers off the ridge; coast still mostly itself
      source:{    preview:{ t:0.3, veil:0.30, status:"GATHERING", progress:0.14,
                            layers:["sky","coast","sea","veil","source"] } },
      // field: full veil; landmarks flattened to grey, surviving as ghosts (neutral)
      field:{     preview:{ t:2.0, veil:1.00, status:"FOREIGN",   progress:0.72 } },
      // transform: the veil withdraws, landmarks re-emerge, recognition restored
      transform:{ preview:{ t:2.8, veil:0.16, status:"KNOWN",     progress:0.94,
                            layers:["sky","coast","sea","veil","source","glyph"] } },
    },
    edges:[["source","field"],["field","transform"],["transform","field"],["field","source"]],
  },
  duration:5.5,
  // animation channels the runtime can drive over the scene clock
  channels:["t","veil"],

  // neutral preview: the veil fully taken — the known Ithacan coast draped in grey
  // fog, its landmarks dimmed to flat greys and surviving only as dashed ghosts,
  // the near sea still clear, the recognition glyph BARRED: reads unmistakably as
  // a familiar landscape made foreign.
  preview:()=>({ t:2.0, veil:1.0, status:"FOREIGN", progress:0.72,
                 layers:["sky","coast","sea","veil","ghosts","source","glyph"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
