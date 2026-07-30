/* prop.odysseuss-remembered-cloak-and-brooch — the proof-token of Book XIX.
   The beggar "Aethon" describes what Odysseus wore the day he sailed: a woollen
   sea-purple cloak, DOUBLED (diplax), and on it a golden brooch whose face
   carries a hound holding a dappled fawn in its forepaws, its jaws at the
   fawn's throat; under the cloak a tunic bright as the skin of a dried onion.
   The brooch is fastened by twin sheaths and a single pin. Penelope checks
   each detail against memory and accepts.

   PROP asset. This is not a costume — it is an INSPECTABLE MEMORY OBJECT: the
   garment plus a magnified read of its identifying device plus a verification
   ledger drawn as geometry (never small type). Solid grays + hard contour into
   the offscreen ctx; the engine dotify pass supplies the halftone. Do NOT
   pre-dither.

   States:
     · described — the memory plate: the doubled cloak hanging under registration
                   brackets, a leader out to a magnified brooch callout, the
                   tunic swatch, and a ledger with only the first detail checked.
     · verified  — the same plate with every ledger row checked and the brooch
                   glinting: Penelope has matched all three details.
     · brooch    — the brooch alone, blown up: hound-and-fawn device full size,
                   measure ticks around the rim, the pin-and-sheath elevation.
     · worn      — the cloak as worn on an implied body (no figure rig): doubled
                   mantle, bright tunic column beneath, brooch pinning the right
                   shoulder at medium detail.
   Grip / pin / contact anchors in 0..1; ownership + collision box. */
import { makePen, toneSolid, inkLevel, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  hemWaves:5,        // scallops along the cloak hem (never a flat bar)
  foldsN:5,          // vertical drape folds in the cloak
  dapples:6,         // spots on the fawn — the "dappled" detail
  rimTicks:24,       // measure ticks around the magnified brooch
  ledgerRows:3,      // cloak / brooch / tunic — the three checked details
};

/* ink levels (1 near-paper .. 7 full ink) — keep the plate LIGHT, dark only
   where the story needs an accent (device, rim, checked boxes) */
const CLOAK  = 3;   // sea-purple wool reads as a mid tone, not a black mass
const CLOAK2 = 4;   // the doubled under-layer showing at edge + hem
const TUNIC  = 1;   // onion-skin bright — almost paper, carried by contour
const TUNIC2 = 2;   // one facet of shade so it is not empty
const FACE   = 2;   // brooch face plate (bright gold)
const RIM    = 5;   // brooch rim / bezel
const HOUND  = 6;   // the hound — the darkest accent on the plate
const FAWN   = 3;   // the fawn, light so the hound reads over it
const SPOT   = 6;   // dapples
const CHIP   = 4;   // ledger chips

/* rounded-rect sub-path (no fill/stroke; caller wraps in pen.paint) */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}
/* polygon from [[x,y],...] in device units, scaled by s about (cx,cy) */
function poly(g,cx,cy,s,pts){
  pts.forEach((p,i)=>{ const x=cx+p[0]*s, y=cy+p[1]*s;
    if(i) g.lineTo(x,y); else g.moveTo(x,y); });
  g.closePath();
}
/* a blocky limb bar: from (x0,y0) toward (x1,y1), width w */
function bar(pen,g,x0,y0,x1,y1,w,tone,lw=2.4){
  const a=Math.atan2(y1-y0,x1-x0), L=Math.hypot(x1-x0,y1-y0);
  g.save(); g.translate(x0,y0); g.rotate(a);
  pen.paint(()=>{ rr(g, 0, -w/2, L, w, w*0.42); }, tone, lw);
  g.restore();
}

/* ==================================================================
   HOUND AND FAWN — the device on the brooch face. Blocky diagrammatic
   animals: a hound standing over a fallen dappled fawn, forepaws on its
   flank, jaws reaching the throat. `s` is the device half-extent; the
   device occupies roughly 1.9s x 1.45s. Detail is level-of-detail'd so
   the same device works at 30px (a shoulder pin) and at 400px (a plate).
   ================================================================== */
function houndAndFawn(pen,g,cx0,cy0,s){
  const cx=cx0, cy=cy0 - s*0.03;
  if (s < 36){                       // GLYPH — too small for animals
    pen.paint(()=>{ poly(g,cx,cy,s,[[-.85,-.20],[-.10,-.55],[.75,-.25],[.80,.25],[-.20,.55],[-.85,.25]]); },
      toneSolid(inkLevel(HOUND)), 1.8);
    return;
  }
  const simple = s < 62;             // SIMPLE — torso + head blocks only
  /* Two clearly separated bands so both silhouettes read: the hound occupies
     the upper band and stays dark against paper; the fawn lies in the lower
     band, light, and only the hound's forepaws and jaws cross into it. */

  /* ---- FAWN: gone down in front, body tilted rump-low, head thrown up to
     the right so the throat lands exactly under the hound's jaws ---- */
  if (!simple){
    for (const [ax,ay,bx,by] of [[-.30,.58,-.60,.80],[-.06,.58,-.16,.84],[.22,.50,.44,.76],[.34,.42,.68,.58]])
      bar(pen,g, cx+ax*s,cy+ay*s, cx+bx*s,cy+by*s, s*0.070, toneSolid(inkLevel(FAWN)), 2.2);
  }
  pen.paint(()=>{ poly(g,cx,cy,s,                     // fawn torso, tilted
    [[-.48,.44],[-.16,.22],[.24,.16],[.44,.30],[.20,.54],[-.26,.64]]); },
    toneSolid(inkLevel(FAWN)), s*0.048);
  pen.paint(()=>{ poly(g,cx,cy,s,                     // neck + head thrown up to the right
    [[.30,.18],[.56,.06],[.72,-.02],[.94,.06],[.92,.20],[.66,.20],[.42,.36]]); },
    toneSolid(inkLevel(FAWN)), s*0.044);
  if (!simple){
    pen.paint(()=>{ poly(g,cx,cy,s,[[.74,-.02],[.80,-.22],[.90,.02]]); },  // fawn ear
      toneSolid(inkLevel(FAWN)), s*0.032);
    pen.fillPath(()=>{ g.ellipse(cx+0.82*s, cy+0.10*s, s*0.038, s*0.034,0,0,7); }, inkLevel(7)); // eye
    for (let i=0;i<params.dapples;i++){                                   // the dapples
      const u=(i+0.5)/params.dapples;
      const dx=lerp(-0.32,0.16,u), dy=lerp(0.48,0.28,u)+((i%2)?0.12:0);
      pen.fillPath(()=>{ g.ellipse(cx+dx*s, cy+dy*s, s*0.062, s*0.055, 0,0,7); }, inkLevel(SPOT));
    }
  }

  /* ---- HOUND: the upper band, dark, head bent down onto the throat ---- */
  if (!simple){
    for (const [ax,ay,bx,by] of [[-.62,-.16,-.76,.34],[-.44,-.14,-.40,.36]])   // hind legs
      bar(pen,g, cx+ax*s,cy+ay*s, cx+bx*s,cy+by*s, s*0.11, toneSolid(inkLevel(HOUND)), 2.2);
    pen.ink(()=>{ g.moveTo(cx-0.84*s, cy-0.40*s);                               // tail
      g.quadraticCurveTo(cx-1.08*s, cy-0.50*s, cx-0.98*s, cy-0.78*s); }, Math.max(2, s*0.055));
  }
  pen.paint(()=>{ poly(g,cx,cy,s,                     // hound torso: haunch, waist, deep chest
    [[-.84,-.38],[-.56,-.58],[-.10,-.56],[.16,-.60],[.34,-.42],[.28,-.20],
     [-.02,-.18],[-.34,-.14],[-.64,-.18],[-.86,-.18]]); },
    toneSolid(inkLevel(HOUND)), s*0.050);
  pen.paint(()=>{ poly(g,cx,cy,s,                     // muzzle down to the fawn's throat
    [[.20,-.52],[.44,-.50],[.78,-.20],[.80,-.02],[.62,.04],[.54,-.16],[.24,-.24]]); },
    toneSolid(inkLevel(HOUND)), s*0.050);
  if (!simple){
    pen.paint(()=>{ poly(g,cx,cy,s,[[.30,-.54],[.36,-.82],[.52,-.50]]); },      // pricked ear
      toneSolid(inkLevel(HOUND)), s*0.035);
    // incised chasing — light cuts that keep the dark body from going flat
    pen.paint(()=>{ g.ellipse(cx-0.62*s, cy-0.34*s, s*0.15, s*0.11, 0.2,0,7); },
      toneSolid(inkLevel(FACE)), s*0.028);                                      // haunch
    pen.paint(()=>{ g.ellipse(cx+0.02*s, cy-0.38*s, s*0.10, s*0.16, 0.1,0,7); },
      toneSolid(inkLevel(FACE)), s*0.028);                                      // shoulder
    pen.fillPath(()=>{ g.ellipse(cx+0.46*s, cy-0.36*s, s*0.050, s*0.045,0,0,7); }, inkLevel(FACE)); // eye
    for (const [ax,ay,bx,by] of [[.16,-.20,.26,.20],[-.04,-.18,-.10,.30]])      // forepaws on the flank
      bar(pen,g, cx+ax*s,cy+ay*s, cx+bx*s,cy+by*s, s*0.115, toneSolid(inkLevel(HOUND)), 2.2);
  }
}

/* ==================================================================
   BROOCH — bezel + face plate + device. `glint` adds the four-point spark.
   ================================================================== */
function brooch(pen,g,cx,cy,r,{glint=false,ticks=false,t=0}={}){
  pen.paint(()=>{ g.ellipse(cx,cy,r,r,0,0,7); }, toneSolid(inkLevel(RIM-1)), Math.max(2.5,r*0.028));
  pen.paint(()=>{ g.ellipse(cx,cy,r*0.905,r*0.905,0,0,7); }, toneSolid(inkLevel(FACE)), Math.max(2,r*0.020));
  if (r>36) pen.seam(()=>{ g.ellipse(cx,cy,r*0.955,r*0.955,0,0,7); }, Math.max(1.2,r*0.012)); // bezel rule
  houndAndFawn(pen,g,cx,cy+r*0.04,r*0.70);
  if (ticks){                                   // measure ticks around the bezel
    for(let i=0;i<params.rimTicks;i++){
      const a=(i/params.rimTicks)*Math.PI*2, lng=(i%3===0);
      const r0=r*1.06, r1=r*(lng?1.20:1.13);
      pen.ink(()=>{ g.moveTo(cx+Math.cos(a)*r0, cy+Math.sin(a)*r0);
                    g.lineTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1); }, lng?3.0:1.4);
    }
  }
  if (glint){
    const gx=cx-r*0.50, gy=cy-r*0.54, k=r*0.17;
    pen.fillPath(()=>{ g.ellipse(gx,gy,k*0.55,k*0.55,0,0,7); }, inkLevel(0));
    pen.ink(()=>{ g.moveTo(gx-k,gy); g.lineTo(gx+k,gy);
                  g.moveTo(gx,gy-k); g.lineTo(gx,gy+k); }, Math.max(1.6,r*0.020));
  }
}

/* the BACK of the brooch: the plate seen from behind with the twin sheaths
   ("doioi aulotere") and the single pin that runs through them. Small, and
   nothing in it spans the frame. */
function broochBack(pen,g,cx,cy,r){
  pen.paint(()=>{ g.ellipse(cx,cy,r,r,0,0,7); }, toneSolid(inkLevel(1)), 3.0);   // back plate
  pen.seam(()=>{ g.ellipse(cx,cy,r*0.80,r*0.80,0,0,7); }, 1.6);
  for (const u of [-0.44, 0.06]){                                                // twin sheaths
    const sx=cx+r*u;
    pen.paint(()=>{ rr(g, sx, cy-r*0.26, r*0.20, r*0.52, r*0.07); },
      toneSolid(inkLevel(HOUND)), 2.4);
    pen.fillPath(()=>{ g.rect(sx+r*0.05, cy-r*0.09, r*0.10, r*0.18); }, inkLevel(0)); // the bore
  }
  pen.ink(()=>{ g.moveTo(cx-r*0.74, cy); g.lineTo(cx+r*0.78, cy); }, 3.6);       // the pin
  pen.paint(()=>{ g.moveTo(cx+r*0.74,cy-r*0.13); g.lineTo(cx+r*1.02,cy);
    g.lineTo(cx+r*0.74,cy+r*0.13); g.closePath(); }, toneSolid(inkLevel(HOUND)), 1.8);
  pen.paint(()=>{ g.ellipse(cx-r*0.76, cy, r*0.09, r*0.09,0,0,7); },              // the hinge knop
    toneSolid(inkLevel(RIM)), 2.0);
}

/* ==================================================================
   THE CLOAK — a DOUBLED woollen mantle. Drawn as an implied-body drape:
   collar bar, two shoulder falls, drape folds, and a scalloped hem with the
   second (doubled) layer showing beneath it. Never a flat rectangle.
   ================================================================== */
function cloakDrape(pen,g,cx,topY,hemY,shW,hemW){
  const L = hemY-topY;
  const dip = L*0.075, amp = L*0.055;          // catenary sag + scallop depth
  /* hem sampled far finer than the scallop period — sampling ON the period
     is what flattens a hem into a bar. `k` phases the doubled layer. */
  const hemPt = (u, k)=> ({
    x: lerp(cx-hemW, cx+hemW, u),
    y: hemY + dip*Math.sin(Math.PI*u) + (k===0 ? amp*Math.abs(Math.sin(u*Math.PI*params.hemWaves))
                                              : amp*0.62),
  });
  const N = params.hemWaves*8;
  const belly = Math.max(shW*1.15, hemW*1.06);   // the side edges just clear the hem

  // the DOUBLED under-layer — visible only in the scallop troughs and along
  // the turned-back right edge, so it never forms a bar under the cloak
  pen.paint(()=>{
    g.moveTo(cx-shW*0.84, topY+L*0.10);
    g.lineTo(cx+shW*0.92, topY+L*0.02);
    g.quadraticCurveTo(cx+belly*1.02, lerp(topY,hemY,0.60), cx+hemW*1.04, hemY+dip*0.30);
    for(let i=N;i>=0;i--){ const p=hemPt(i/N,1); g.lineTo(lerp(cx,p.x,0.99), p.y); }
    g.closePath();
  }, toneSolid(inkLevel(CLOAK2)), 4.0);

  // the outer layer — a mantle: narrow at the pinned shoulder, spreading to a
  // wide scalloped hem, side edges bellying outward the way hung wool does
  pen.paint(()=>{
    g.moveTo(cx-shW, topY+L*0.075);
    g.quadraticCurveTo(cx-belly, lerp(topY,hemY,0.62), cx-hemW, hemY+dip*0.20);
    for(let i=0;i<=N;i++){ const p=hemPt(i/N,0); g.lineTo(p.x,p.y); }
    g.quadraticCurveTo(cx+belly, lerp(topY,hemY,0.62), cx+shW, topY);
    g.closePath();
  }, toneSolid(inkLevel(CLOAK)), 5);

  // rolled collar edge — a thin strip following the shoulder slope, no step
  pen.paint(()=>{
    g.moveTo(cx-shW*0.99, topY+L*0.078); g.lineTo(cx+shW*0.99, topY+L*0.004);
    g.lineTo(cx+shW*0.99, topY+L*0.058); g.lineTo(cx-shW*0.99, topY+L*0.132); g.closePath();
  }, toneSolid(inkLevel(CLOAK2)), 2.6);

  // the WRAP seam: right shoulder (under the pin) across to the left hip —
  // this is the fold of the doubling, and it breaks the flat field
  pen.seam(()=>{ g.moveTo(cx+shW*0.86, topY+L*0.10);
    g.quadraticCurveTo(cx+shW*0.10, lerp(topY,hemY,0.40), cx-hemW*0.86, lerp(topY,hemY,0.72)); }, 3.4);
  pen.seam(()=>{ g.moveTo(cx+shW*0.92, topY+L*0.20);
    g.quadraticCurveTo(cx+shW*0.18, lerp(topY,hemY,0.50), cx-hemW*0.88, lerp(topY,hemY,0.82)); }, 1.6);

  // drape folds, fanning from the pinned shoulder
  for(let f=1;f<=params.foldsN;f++){
    const u=f/(params.foldsN+1);
    const xT=lerp(cx-shW*0.80, cx+shW*0.62, u), xH=lerp(cx-hemW*0.86, cx+hemW*0.86, u);
    pen.seam(()=>{ g.moveTo(xT, topY+L*0.16);
      g.quadraticCurveTo(lerp(xT,xH,0.45), lerp(topY,hemY,0.62), xH, hemPt(0.08+0.84*u,0).y - L*0.03); },
      f%2?2.8:1.5);
  }
}

/* registration brackets — the "this is a remembered object under inspection"
   frame. Corners only, so nothing stripes the plate. */
function brackets(pen,g,x0,y0,x1,y1,k,solid){
  // thick on purpose: a 2px vertical falls between the dot lattice's sample
  // columns and vanishes, while horizontals survive — so both must be heavy
  const lw = solid?7.0:5.0;
  for (const [sx,sy,cx0,cy0] of [[1,1,x0,y0],[-1,1,x1,y0],[1,-1,x0,y1],[-1,-1,x1,y1]]){
    pen.ink(()=>{ g.moveTo(cx0+sx*k, cy0); g.lineTo(cx0, cy0);
                  g.lineTo(cx0, cy0+sy*k); }, lw);
  }
}

/* ledger — three checked details drawn as GEOMETRY, never as type.
   row = [icon chip] [segmented memory bar] [check box].
   `done` = how many rows are confirmed. */
function ledger(pen,g,x,y,w,rowH,done){
  for(let i=0;i<params.ledgerRows;i++){
    const ry = y + i*rowH, ck = i<done;
    const cs = rowH*0.56;
    // icon chip: cloak trapezoid / brooch disc / tunic block
    pen.paint(()=>{ rr(g, x, ry, cs, cs, cs*0.18); }, toneSolid(inkLevel(1)), 2.6);
    if (i===0) pen.paint(()=>{ poly(g, x+cs/2, ry+cs/2, cs*0.34,
                 [[-.62,-.78],[.62,-.78],[1.0,.85],[-1.0,.85]]); }, toneSolid(inkLevel(CLOAK)), 2.0);
    else if (i===1){ pen.paint(()=>{ g.ellipse(x+cs/2, ry+cs/2, cs*0.30, cs*0.30,0,0,7); },
                 toneSolid(inkLevel(FACE)), 2.0);
                 pen.fillPath(()=>{ g.ellipse(x+cs/2, ry+cs/2, cs*0.13, cs*0.13,0,0,7); }, inkLevel(HOUND)); }
    else pen.paint(()=>{ rr(g, x+cs*0.24, ry+cs*0.18, cs*0.52, cs*0.64, cs*0.10); },
                 toneSolid(inkLevel(TUNIC2)), 2.0);
    // segmented memory bar
    const bx=x+cs*1.35, bw=w-cs*1.35-rowH*0.86;
    pen.paint(()=>{ rr(g, bx, ry+cs*0.22, bw, cs*0.48, cs*0.12); },
      toneSolid(inkLevel(ck?CHIP:1)), 2.4);
    for(let k2=1;k2<4;k2++) pen.seam(()=>{ const sx=bx+bw*k2/4;
      g.moveTo(sx, ry+cs*0.22); g.lineTo(sx, ry+cs*0.70); }, 1.6);
    // check box — filled (and crossed) once the detail is confirmed
    const kx=x+w-rowH*0.62, ks=rowH*0.56;
    pen.paint(()=>{ rr(g, kx, ry, ks, ks, ks*0.14); }, toneSolid(inkLevel(ck?7:1)), 2.8);
    if (ck) pen.fillPath(()=>{ // bright tick cut out of the black box
      g.moveTo(kx+ks*0.18, ry+ks*0.52); g.lineTo(kx+ks*0.40, ry+ks*0.74);
      g.lineTo(kx+ks*0.84, ry+ks*0.22); g.lineTo(kx+ks*0.72, ry+ks*0.12);
      g.lineTo(kx+ks*0.40, ry+ks*0.50); g.lineTo(kx+ks*0.28, ry+ks*0.38); g.closePath();
    }, inkLevel(0));
  }
}

/* the tunic swatch — "bright as the skin of a dried onion", so it is carried
   almost entirely by contour, with one shaded facet and a sun glint. */
function tunicSwatch(pen,g,x,y,w,h){
  const N=24;
  const hem = u => y + h*0.84 + Math.abs(Math.sin(u*Math.PI*3))*h*0.15;
  pen.paint(()=>{                                    // a hanging swatch of the tunic
    g.moveTo(x+w*0.06, y+h*0.10);
    g.lineTo(x+w*0.94, y);                           // slanted top: cut from the shoulder
    g.quadraticCurveTo(x+w*1.06, y+h*0.46, x+w, hem(1));
    for(let i=N;i>=0;i--){ const u=i/N; g.lineTo(lerp(x+w,x,u), hem(u)); }
    g.closePath();
  }, toneSolid(inkLevel(TUNIC)), 4.2);
  pen.paint(()=>{                                    // one shaded facet so it is not blank
    g.moveTo(x+w*0.62, y+h*0.05); g.lineTo(x+w*0.94, y);
    g.quadraticCurveTo(x+w*1.06, y+h*0.46, x+w, hem(1));
    g.lineTo(x+w*0.70, hem(0.78)); g.closePath();
  }, toneSolid(inkLevel(TUNIC2)), 2.4);
  for(let i=1;i<=4;i++){ const sx=lerp(x+w*0.18,x+w*0.60,i/5);   // fine ribbing
    pen.seam(()=>{ g.moveTo(sx, y+h*0.18); g.lineTo(sx+w*0.045, hem(0.15+0.45*i/5)-h*0.08); },
      i%2?2.6:1.5); }
  const gx=x+w*0.30, gy=y+h*0.62, k=h*0.20;                       // sun glint
  pen.ink(()=>{ g.moveTo(gx-k,gy); g.lineTo(gx+k,gy);
                g.moveTo(gx,gy-k); g.lineTo(gx,gy+k); }, 3.4);
}

/* ==================================================================
   MODES
   ================================================================== */
function drawPlate(pen,g,W,H,{done=1,glint=false}={}){
  // registration brackets around the garment under inspection
  brackets(pen,g, W*0.055, H*0.170, W*0.510, H*0.790, W*0.050, done>=params.ledgerRows);

  // the doubled cloak, hanging left of centre
  cloakDrape(pen,g, W*0.275, H*0.250, H*0.685, W*0.105, W*0.195);

  // the brooch AS PINNED at the cloak's right shoulder (small: glyph LOD)
  const px=W*0.360, py=H*0.288;
  brooch(pen,g, px, py, W*0.040, {});

  // magnified callout of the same brooch, upper right
  const cx=W*0.735, cy=H*0.310, R=W*0.190;
  pen.ink(()=>{ g.moveTo(px+W*0.034, py-W*0.026); g.lineTo(cx-R*0.88, cy-R*0.50);
                g.moveTo(px+W*0.036, py+W*0.028); g.lineTo(cx-R*0.92, cy+R*0.42); }, 2.0);
  brooch(pen,g, cx, cy, R, {glint, ticks:false});

  // how it fastens, and the tunic worn under the cloak
  broochBack(pen,g, W*0.660, H*0.585, W*0.072);
  tunicSwatch(pen,g, W*0.760, H*0.520, W*0.185, H*0.140);

  // the verification ledger
  ledger(pen,g, W*0.575, H*0.750, W*0.345, H*0.058, done);
}

function drawBrooch(pen,g,W,H,{glint=true,t=0}={}){
  const cx=W*0.500, cy=H*0.415, R=W*0.310;
  brackets(pen,g, W*0.075, H*0.095, W*0.925, H*0.905, W*0.060, true);
  brooch(pen,g, cx, cy, R, {glint, ticks:true, t});
  broochBack(pen,g, W*0.500, H*0.830, W*0.140);
}

function drawWorn(pen,g,W,H,{glint=false}={}){
  const cx=W*0.500;
  // ground shadow
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, H*0.800, W*0.250, H*0.018, 0,0,7); g.fill();
  // bright tunic column on the implied body — it must stay VISIBLE below the
  // cloak hem, so it falls lower and flares wider than the mantle covers
  const tHem=H*0.790, N=18;
  pen.paint(()=>{
    g.moveTo(cx-W*0.085, H*0.292); g.lineTo(cx+W*0.085, H*0.292);
    g.lineTo(cx+W*0.150, tHem-H*0.010);
    for(let i=0;i<=N;i++){ const u=i/N;
      g.lineTo(lerp(cx+W*0.150, cx-W*0.150, u),
               tHem + Math.abs(Math.sin(u*Math.PI*3))*H*0.016); }
    g.closePath();
  }, toneSolid(inkLevel(TUNIC)), 4.2);
  for(let i=1;i<=4;i++){ const sx=lerp(cx-W*0.090, cx+W*0.090, i/5);
    pen.seam(()=>{ g.moveTo(sx, H*0.330); g.lineTo(sx+W*0.014, tHem-H*0.012); }, i%2?2.6:1.5); }
  // the doubled mantle over it — shorter, so the tunic shows beneath
  cloakDrape(pen,g, cx, H*0.235, H*0.630, W*0.140, W*0.215);
  // brooch pinning the right shoulder
  brooch(pen,g, cx+W*0.112, H*0.268, W*0.058, {glint});
}

function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const mode = st.mode || "described";
  const t = st.t ?? 0;
  const glint = !!st.glint;
  const done = Number.isFinite(st.done) ? st.done
             : (mode==="verified" ? params.ledgerRows : 1);
  if (mode==="brooch")      drawBrooch(pen,g,W,H,{glint:true,t});
  else if (mode==="worn")   drawWorn(pen,g,W,H,{glint});
  else                      drawPlate(pen,g,W,H,{done,glint}); // described / verified
}

export const asset = {
  id:"prop.odysseuss-remembered-cloak-and-brooch",
  type:"PROP",
  name:"Odysseus's Remembered Cloak and Brooch",
  statusWord:"REMEMBERED",
  scene:"OD-B19-S03",

  params,
  // back -> front
  layers:["shadow","brackets","cloak-double","cloak-outer","fold","tunic","pin-brooch",
          "leader","callout-bezel","callout-face","fawn","hound","glint","pin-elevation","ledger"],
  // normalized 0..1 grip / contact / inspection anchors
  anchors:{
    "pin:shoulder":{x:.415,y:.272},     // where the brooch fastens the cloak (plate)
    "grip:collar":{x:.295,y:.225},      // lift / hand the cloak over
    "hem":{x:.295,y:.735},              // hem edge
    "contact:ground":{x:.295,y:.800},   // grounded contact of the hanging drape
    "attach:shoulders":{x:.500,y:.235}, // where it sits on a wearer (worn state)
    "mark:device":{x:.755,y:.300},      // the hound-and-fawn face — the proof
    "clasp:sheath":{x:.700,y:.560},     // the twin sheaths the pin passes through
    "swatch:tunic":{x:.750,y:.670},     // the onion-skin tunic
    "lens:inspect":{x:.755,y:.300},     // focus point when magnified
  },
  // continuity metadata: Ithacan royal wardrobe, worn the day he sailed for Troy,
  // now held only in two memories — his and hers.
  ownership:"ithaca:odysseus",
  collision:{ kind:"box", x0:.06, y0:.12, x1:.94, y1:.86 },
  zones:{ bounds:{ x0:.06,y0:.12,x1:.94,y1:.86 }, footprint:{ x0:.09,y0:.72,x1:.50,y1:.82 } },

  states:{
    initial:"described",
    nodes:{
      described:{ preview:{ mode:"described", done:1, glint:false, status:"DESCRIBED", progress:.35 } },
      brooch:   { preview:{ mode:"brooch",              glint:true,  status:"MAGNIFIED", progress:.60 } },
      worn:     { preview:{ mode:"worn",                glint:true,  status:"WORN",      progress:.75 } },
      verified: { preview:{ mode:"verified", done:3, glint:true,  status:"VERIFIED",  progress:1.0 } },
    },
    edges:[
      ["described","brooch"],["brooch","described"],
      ["described","verified"],["brooch","verified"],
      ["described","worn"],["worn","described"],["worn","verified"],
    ],
  },
  channels:["mode","done","glint","t"],

  preview:()=>({ mode:"described", done:1, glint:true, t:0, status:"REMEMBERED", progress:.35 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{});
    return { anchors:asset.anchors, collision:asset.collision, ownership:asset.ownership }; },
};
export default asset;
