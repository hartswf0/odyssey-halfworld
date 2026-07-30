/* prop.farm-clothing-and-tools — the kit Odysseus finds his father wearing in
   the orchard of Book XXIV: a filthy PATCHED WORK CHITON, a goatskin CAP, two
   thorn GLOVES, a pair of stitched leather GAITERS, the digging HOE, and the
   PRUNING GEAR (a hooked billhook, a small curved vine knife, a coil of withy
   ties) — laid out as an orthographic KIT PLATE over a four-stage STATUS
   DESCENT STRIP that counts the mends: 0 -> 2 -> 5 -> 9 patches, king to
   farmhand.

   PROP asset. Drawn in SOLID grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone. Do NOT pre-dither. No figure is
   baked in — the clothing hangs and stands as empty garment geometry, and the
   wearer is placed by the scene through the declared attach anchors.

   Scene function (OD-B24-S03) — six states:
     STOWED    kit laid out cold, laces slack, gloves flat, hoe idle
     WORN      laces cinched, gloves curled shut, cap corded — the attach rings
               light up so the scene can hang the kit on Laertes
     DIGGING   the hoe is the live tool, earth on its blade and a turned mound
     PRUNING   the billhook is the live tool, cut shoots on the ground
     LAID DOWN half-shed: gloves loose, blade clean, the strip holds
     RESTORED  the kit is set aside and the strip walks back to stage 0 — the
               one moment the diminished-status reading is allowed to rise

   The "diminished status" reading is the point of the prop, so it is drawn as
   a diagram rather than implied: four garment sample tiles with a growing
   patch census, the live stage called out by registration brackets and a
   caret, the count under each tile as seven-segment GEOMETRY (never small
   type), and a rank ladder at the right that fills as status returns.

   Tone plan: hide, cloth and ash are LIGHT (levels 1-3) so plenty of paper
   shows; the dark is carried by the hard contour, the cuffs and cord (4-5),
   a handful of dark patches, the earth (5) and the seven-segment numerals.
   The lacing gaps, the neck opening, the glove finger gaps and the hollow of
   the hook all cut paper straight back through the objects. Every long member
   — hafts, floor line, hem, gauge rail, tile row — is broken so nothing
   stripes the frame. Scale, grip/attach/contact anchors, ownership and
   collision are declared in 0..1 space. */
import { makePen, toneSolid, inkLevel, INK, PAPER, clamp, lerp, rnd }
  from "../../engine/halfworld-engine.mjs";

const params = {
  /* kit-plate slots, fractions of W/H; floor contacts sit on `floorY` */
  floorY:0.600,
  capX:0.118,  capY:0.228,  capW:0.150,
  tunicX:0.398, tunicTop:0.100, tunicBot:0.378, tunicW:0.296, tunicTeeth:7,
  gloveX0:0.636, gloveX1:0.756, gloveY:0.238, gloveW:0.100,
  gaiterX0:0.122, gaiterX1:0.252, gaiterH:0.168, gaiterTilt:0.055,
  coilX:0.390, coilY:0.566, coilRings:4,
  knifeX:0.512, knifeY:0.578,
  hookX:0.630, hookLen:0.250, hookTilt:0.16,
  hoeX:0.880,  hoeTop:0.120,  hoeTilt:-0.055,
  stripX0:0.055, stripX1:0.836, stripY:0.660, stripH:0.120, tiles:4, tileGap:0.016,
  census:[0,2,4,6],                    // mends counted per status stage
  gaugeX0:0.886, gaugeX1:0.958, gaugeTop:0.665, gaugeBot:0.840, rungs:4,
  patchesOnTunic:5,
  scaleM:1.34,                         // hoe haft length, metres
  material:"goatskin, stitched ox-hide, coarse worn linen, olive-wood haft, beaten iron, withy",
};

/* ---- eight-level tone plan (light kit, dark accents) ---- */
const CLOTH   = 2;   // the work chiton — worn linen, very light
const CLOTH_D = 3;   // its shaded flank / sleeve underside
const HIDE_L  = 2;   // lit leather (cap dome, glove fingers, far gaiter panel)
const HIDE    = 3;   // leather body
const HIDE_D  = 4;   // cuffs, brim band, shaded panel
const CORD     = 5;  // laces, chin cord, hanging cord — the dark thread
const PATCH_A = 2;   // a bleached patch
const PATCH_B = 4;   // a dark patch
const WOOD    = 3;   // hafts
const WOOD_D  = 4;   // ferrules, wrapped grips
const IRON    = 3;   // blades — light metal, the contour does the work
const IRON_D  = 4;   // sockets, deepest iron
const EDGE    = 1;   // bright ground working edge
const WITHY   = 3;   // the tie coil
const EARTH   = 5;   // turned soil and clods
const TILE    = 1;   // status sample plate
const ICON    = 2;   // garment icon on the plate
const BAR     = 5;   // filled gauge rung

/* ---------- blocky seven-segment numeral (geometry, never small type) ---- */
const SEG = { 0:"abcdef",1:"bc",2:"abged",3:"abgcd",4:"fgbc",5:"afgcd",
              6:"afgecd",7:"abc",8:"abcdefg",9:"abcfgd" };
function segDigit(g,d,x,y,w,h,th,color){
  const half=h/2, on=(SEG[d]||"").split("");
  const bars={ a:[x,y,w,th], b:[x+w-th,y,th,half], c:[x+w-th,y+half,th,half],
               d:[x,y+h-th,w,th], e:[x,y+half,th,half], f:[x,y,th,half],
               g:[x,y+half-th/2,w,th] };
  g.fillStyle=color;
  for(const s of on){ const b=bars[s]; if(b) g.fillRect(b[0],b[1],b[2],b[3]); }
}

/* ---------- rounded-rect sub-path (no fill/stroke; caller wraps) -------- */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}

/* ---------- deterministic wobbly closed blob sub-path ------------------- */
function blobPath(g,cx,cy,rx,ry,seed,n=9,wob=0.34){
  const R=rnd(seed), pts=[];
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2, k=1-wob*0.5+R()*wob;
    pts.push({ x:cx+Math.cos(a)*rx*k, y:cy+Math.sin(a)*ry*k });
  }
  g.moveTo((pts[0].x+pts[n-1].x)/2,(pts[0].y+pts[n-1].y)/2);
  for(let i=0;i<n;i++){
    const p=pts[i], q=pts[(i+1)%n];
    g.quadraticCurveTo(p.x,p.y,(p.x+q.x)/2,(p.y+q.y)/2);
  }
  g.closePath();
}

/* ---------- three binding ticks so a shaft reads as a grip zone -------- */
function gripTicks(g,x,y,w){
  g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
  for(let i=-1;i<=1;i++){
    g.beginPath(); g.moveTo(x-w/2, y+i*w*0.44-w*0.10);
    g.lineTo(x+w/2, y+i*w*0.44+w*0.10); g.stroke();
  }
}

/* ---------- a sewn-on patch: skewed quad + running stitch -------------- */
function patch(pen,g,cx,cy,w,h,tone,skew=0){
  pen.paint(()=>{
    g.moveTo(cx-w/2+skew, cy-h/2);
    g.lineTo(cx+w/2, cy-h/2-skew*0.6);
    g.lineTo(cx+w/2-skew, cy+h/2);
    g.lineTo(cx-w/2, cy+h/2+skew*0.6);
    g.closePath();
  }, toneSolid(inkLevel(tone)), 3);
  g.strokeStyle=INK; g.lineWidth=2; g.setLineDash([4,4]);
  g.strokeRect(cx-w/2+3.5, cy-h/2+3.5, w-7, h-7);
  g.setLineDash([]);
}

/* ---------- dashed attach ring (only while the kit is worn) ------------ */
function attachRing(g,x,y,r){
  g.strokeStyle=INK; g.lineWidth=2.8; g.setLineDash([7,6]);
  g.beginPath(); g.ellipse(x,y,r,r*0.82,0,0,7); g.stroke();
  g.setLineDash([]);
}

/* =======================================================================
   THE GOATSKIN CAP — a peaked dome on a hide brim band, hair ticked round
   the crown, one patch, a chin cord once it is worn.
   ======================================================================= */
function drawCap(pen,g,W,H,wear){
  const cx=W*params.capX, by=H*params.capY, cw=W*params.capW;
  const d=cw*0.46, hgt=cw*0.86*lerp(1.0,0.93,wear);

  // dome
  pen.paint(()=>{
    g.moveTo(cx-d, by-cw*0.02);
    g.bezierCurveTo(cx-d*1.04, by-hgt*0.74, cx-d*0.52, by-hgt*1.18, cx+d*0.02, by-hgt*1.16);
    g.bezierCurveTo(cx+d*0.60, by-hgt*1.13, cx+d*1.04, by-hgt*0.70, cx+d, by-cw*0.02);
    g.closePath();
  }, toneSolid(inkLevel(HIDE_L)), 5);
  // shaded right cheek of the dome (no stroke — interior modelling only)
  pen.fillPath(()=>{
    g.moveTo(cx+d*0.30, by-cw*0.03);
    g.bezierCurveTo(cx+d*0.62, by-hgt*0.60, cx+d*0.70, by-hgt*0.92, cx+d*0.30, by-hgt*1.10);
    g.bezierCurveTo(cx+d*0.86, by-hgt*0.94, cx+d*1.00, by-hgt*0.56, cx+d*0.98, by-cw*0.03);
    g.closePath();
  }, inkLevel(HIDE));
  // brim band — two short runs with a paper break at the centre
  for(const s of [-1,1]){
    pen.paint(()=>{ rr(g, cx+(s<0?-d*1.06:d*0.12), by-cw*0.075, d*0.94, cw*0.13, cw*0.05); },
              toneSolid(inkLevel(HIDE_D)), 4);
  }
  // goat hair — ticks standing off the crown, in two broken runs
  g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="round";
  for(const [a0,a1] of [[-1.05,-0.35],[0.10,0.90]]){
    for(let k=0;k<4;k++){
      const a=lerp(a0,a1,k/3);
      const sx=cx+Math.sin(a)*d*0.94, sy=by-hgt*1.00+ (1-Math.cos(a))*hgt*0.55;
      g.beginPath(); g.moveTo(sx,sy);
      g.lineTo(sx+Math.sin(a)*cw*0.20, sy-cw*0.10); g.stroke();
    }
  }
  // one dome patch
  patch(pen,g, cx-d*0.30, by-hgt*0.62, cw*0.26, cw*0.21, PATCH_B, cw*0.02);
  if (wear>0.5){
    // chin cord dropping from both brim ends
    g.strokeStyle=inkLevel(CORD); g.lineWidth=4; g.lineCap="round";
    g.beginPath();
    g.moveTo(cx-d*0.96, by+cw*0.05); g.quadraticCurveTo(cx, by+cw*0.30, cx+d*0.96, by+cw*0.05);
    g.stroke();
    g.strokeStyle=INK; g.lineWidth=1.6; g.stroke();
    attachRing(g, cx, by-hgt*0.30, cw*0.60);
  }
}

/* =======================================================================
   THE WORK CHITON — hung from a peg by a cord. Trapezoid body, stub
   sleeves, a paper neck hole, a ragged toothed hem, patches, one tear.
   ======================================================================= */
function drawTunic(pen,g,W,H,st){
  const cx=W*params.tunicX, top=H*params.tunicTop, bot=H*params.tunicBot;
  const w=W*params.tunicW, h=bot-top;
  const shY = top+h*0.16;                 // the shoulder line
  const hemY = bot-h*0.055;

  // peg + one short cord through the neck (never a long converging pair —
  // that reads as a roof, not a garment)
  pen.paint(()=>{ rr(g, cx-w*0.11, top, w*0.22, h*0.030, w*0.015); },
            toneSolid(inkLevel(WOOD_D)), 3.5);
  g.strokeStyle=inkLevel(CORD); g.lineWidth=4; g.lineCap="round";
  g.beginPath(); g.moveTo(cx, top+h*0.028); g.lineTo(cx, shY+h*0.030); g.stroke();
  g.strokeStyle=INK; g.lineWidth=1.5; g.stroke();

  // sleeves first, so the body overlaps them at the shoulder
  for(const s of [-1,1]){
    pen.paint(()=>{
      g.moveTo(cx+s*w*0.24, shY-h*0.012);
      g.lineTo(cx+s*w*0.52, shY+h*0.120);
      g.lineTo(cx+s*w*0.46, shY+h*0.260);
      g.lineTo(cx+s*w*0.24, shY+h*0.180);
      g.closePath();
    }, toneSolid(inkLevel(CLOTH_D)), 4.5);
  }

  // body — broad shoulders, nipped waist, flaring ragged hem
  const teeth=params.tunicTeeth;
  pen.paint(()=>{
    g.moveTo(cx-w*0.36, shY);
    g.lineTo(cx-w*0.10, shY-h*0.020);
    g.lineTo(cx+w*0.10, shY-h*0.020);
    g.lineTo(cx+w*0.36, shY);
    g.lineTo(cx+w*0.28, shY+h*0.400);
    g.lineTo(cx+w*0.44, hemY);
    for(let i=teeth;i>=0;i--){
      const u=i/teeth, x=lerp(cx-w*0.44, cx+w*0.44, u);
      g.lineTo(x, hemY + (i%2 ? h*0.052 : h*0.010));
    }
    g.lineTo(cx-w*0.44, hemY);
    g.lineTo(cx-w*0.28, shY+h*0.400);
    g.closePath();
  }, toneSolid(inkLevel(CLOTH)), 5);

  // shaded right flank so the cloth is not one flat plate
  pen.fillPath(()=>{
    g.moveTo(cx+w*0.17, shY+h*0.08);
    g.lineTo(cx+w*0.30, shY+h*0.06);
    g.lineTo(cx+w*0.42, hemY-h*0.01);
    g.lineTo(cx+w*0.25, hemY-h*0.01);
    g.closePath();
  }, inkLevel(CLOTH_D));

  // keyhole neck — paper straight through the cloth
  pen.fillPath(()=>{
    g.ellipse(cx, shY+h*0.045, w*0.115, h*0.048, 0,0,7);
    g.moveTo(cx-w*0.045, shY+h*0.055); g.lineTo(cx+w*0.045, shY+h*0.055);
    g.lineTo(cx, shY+h*0.175); g.closePath();
  }, PAPER);
  pen.ink(()=>{
    g.ellipse(cx, shY+h*0.045, w*0.115, h*0.048, 0,0,7);
    g.moveTo(cx-w*0.042, shY+h*0.075); g.lineTo(cx, shY+h*0.175);
    g.lineTo(cx+w*0.042, shY+h*0.075);
  }, 4);

  // the belt: two short courses at the waist, broken at the centre
  pen.paint(()=>{ rr(g, cx-w*0.29, shY+h*0.375, w*0.24, h*0.045, w*0.012); },
            toneSolid(inkLevel(CORD-1)), 3.4);
  pen.paint(()=>{ rr(g, cx+w*0.05, shY+h*0.375, w*0.24, h*0.045, w*0.012); },
            toneSolid(inkLevel(CORD-1)), 3.4);

  // broken yoke course under the shoulders
  pen.seam(()=>{
    g.moveTo(cx-w*0.30, shY+h*0.115); g.lineTo(cx-w*0.16, shY+h*0.130);
    g.moveTo(cx+w*0.15, shY+h*0.130); g.lineTo(cx+w*0.30, shY+h*0.115);
  }, 3);

  // the mends
  const P=[[-0.25,0.24,PATCH_B],[0.18,0.22,PATCH_A],[-0.06,0.58,PATCH_B],
           [0.26,0.62,PATCH_A],[-0.26,0.78,PATCH_A]];
  for(let i=0;i<Math.min(params.patchesOnTunic,P.length);i++){
    const p=P[i];
    patch(pen,g, cx+w*p[0], shY+h*p[1], w*0.165, h*0.120, p[2], w*0.014*(i%2?1:-1));
  }

  // one open tear at the hem, paper showing through
  pen.fillPath(()=>{
    g.moveTo(cx+w*0.06, shY+h*0.74); g.lineTo(cx+w*0.13, shY+h*0.84);
    g.lineTo(cx+w*0.08, shY+h*0.96); g.lineTo(cx+w*0.02, shY+h*0.82); g.closePath();
  }, PAPER);
  pen.ink(()=>{
    g.moveTo(cx+w*0.06, shY+h*0.74); g.lineTo(cx+w*0.13, shY+h*0.84);
    g.lineTo(cx+w*0.08, shY+h*0.96); g.lineTo(cx+w*0.02, shY+h*0.82); g.closePath();
  }, 4);

  if ((st.wear??0) > 0.5) attachRing(g, cx, shY+h*0.045, w*0.22);
}

/* =======================================================================
   THORN GLOVES — a gauntlet cuff, a palm block, three fingers with paper
   gaps between them, a thumb. Curled shut once worn.
   ======================================================================= */
function drawGlove(pen,g,W,H,cx,by,gw,side,closed){
  const cuffW=gw*0.86, cuffH=gw*0.52;
  // gauntlet cuff
  pen.paint(()=>{ rr(g, cx-cuffW/2, by-cuffH, cuffW, cuffH, gw*0.10); },
            toneSolid(inkLevel(HIDE_D)), 4.5);
  g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round";
  for(let i=0;i<2;i++){
    const yy=by-cuffH+cuffH*(0.34+0.34*i);
    g.beginPath(); g.moveTo(cx-cuffW*0.40, yy); g.lineTo(cx+cuffW*0.40, yy-cuffH*0.06); g.stroke();
  }
  // palm block
  const pw=gw*0.92, ph=gw*0.72, py=by-cuffH-ph;
  pen.paint(()=>{ rr(g, cx-pw/2, py, pw, ph+gw*0.06, gw*0.12); },
            toneSolid(inkLevel(HIDE)), 5);
  // fingers — three, separated by paper
  const fw=pw*0.25, fg=pw*0.055;
  const x0=cx-pw/2+pw*0.055;
  for(let i=0;i<3;i++){
    const fx=x0+i*(fw+fg);
    const fh = closed ? gw*(0.20+0.02*i) : gw*(0.40-Math.abs(i-1)*0.045);
    pen.paint(()=>{ rr(g, fx, py-fh, fw, fh+gw*0.10, fw*0.44); },
              toneSolid(inkLevel(HIDE_L)), 4);
  }
  // thumb, swung out to the pair's outer side
  pen.paint(()=>{
    g.save();
    g.translate(cx+side*pw*0.46, py+ph*0.36); g.rotate(side*0.85);
    rr(g, -gw*0.11, -gw*0.30, gw*0.22, gw*0.42, gw*0.10);
    g.restore();
  }, toneSolid(inkLevel(HIDE_L)), 4);
  // palm patch
  patch(pen,g, cx-pw*0.06, py+ph*0.60, pw*0.42, ph*0.40, PATCH_A, pw*0.03);
  if (closed){
    // curl seam across the knuckles
    pen.seam(()=>{ g.moveTo(cx-pw*0.36, py+ph*0.16);
                   g.quadraticCurveTo(cx, py+ph*0.02, cx+pw*0.36, py+ph*0.18); }, 3.4);
    attachRing(g, cx, by-cuffH*0.5, cuffW*0.62);
  }
}

/* =======================================================================
   STITCHED GAITERS — two hide panels laced up the front; the lacing gap
   cuts paper straight through the leg guard, and cinches shut when worn.
   ======================================================================= */
function drawGaiter(pen,g,W,H,cx,by,gh,tilt,wear,seed){
  g.save(); g.translate(cx,by); g.rotate(tilt);
  const topW=gh*0.52, botW=gh*0.25;
  const gap = lerp(gh*0.180, gh*0.085, wear);   // the lacing gap stays paper
  for(const s of [-1,1]){
    pen.paint(()=>{
      g.moveTo(s*gap*0.5, -gh);
      g.lineTo(s*topW*0.5, -gh*0.985);
      g.lineTo(s*botW*0.5, 0);
      g.lineTo(s*gap*0.40, 0);
      g.closePath();
    }, toneSolid(inkLevel(s<0?HIDE_L:HIDE)), 5);
  }
  // cross lacing over the gap — three thin X's with paper between them
  g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round";
  for(let i=0;i<3;i++){
    const y0=-gh*(0.78-0.22*i), y1=y0+gh*0.12;
    g.beginPath();
    g.moveTo(-gap*0.46, y0); g.lineTo(gap*0.46, y1);
    g.moveTo( gap*0.46, y0); g.lineTo(-gap*0.46, y1); g.stroke();
  }
  // knee cuff + ankle strap (both short, neither spans)
  pen.paint(()=>{ rr(g, -topW*0.54, -gh-gh*0.050, topW*1.08, gh*0.078, gh*0.028); },
            toneSolid(inkLevel(HIDE_D)), 4);
  pen.paint(()=>{ rr(g, -botW*0.66, -gh*0.150, botW*1.32, gh*0.070, gh*0.024); },
            toneSolid(inkLevel(HIDE_D)), 4);
  // shin patch, one per guard, clear of the lacing gap
  patch(pen,g, -topW*0.26, -gh*0.55, topW*0.30, gh*0.19, PATCH_B, topW*0.03);
  if (wear>0.5) attachRing(g, 0, -gh*0.92, topW*0.52);
  g.restore();
}

/* =======================================================================
   THE HOE — olive-wood haft broken by a wrapped grip, an iron socket, a
   splayed blade with a bright ground edge, clods and a turned mound.
   ======================================================================= */
function drawHoe(pen,g,W,H,soil,t){
  const cx=W*params.hoeX, by=H*params.floorY, topY=H*params.hoeTop;
  const L=by-topY, hw=W*0.026;
  g.save(); g.translate(cx,by); g.rotate(params.hoeTilt);
  // upper haft
  pen.paint(()=>{ rr(g,-hw/2,-L, hw, L*0.36, hw*0.5); }, toneSolid(inkLevel(WOOD)), 4.5);
  // wrapped grip (breaks the haft in two)
  pen.paint(()=>{ rr(g,-hw*0.78,-L*0.66, hw*1.56, L*0.085, hw*0.30); },
            toneSolid(inkLevel(WOOD_D)), 4);
  gripTicks(g,0,-L*0.62,hw*1.5);
  // lower haft
  pen.paint(()=>{ rr(g,-hw/2,-L*0.565, hw, L*0.47, hw*0.5); }, toneSolid(inkLevel(WOOD)), 4.5);
  // socket collar
  pen.paint(()=>{ rr(g,-hw*0.86,-L*0.115, hw*1.72, L*0.055, hw*0.25); },
            toneSolid(inkLevel(IRON_D)), 4);
  // blade — splayed, sheared toward the plate centre so it clears the frame
  pen.paint(()=>{
    g.moveTo(-W*0.030,-L*0.075); g.lineTo(W*0.026,-L*0.075);
    g.lineTo(W*0.030,-H*0.004);  g.lineTo(-W*0.062,-H*0.004); g.closePath();
  }, toneSolid(inkLevel(IRON)), 5);
  // lighter cheek so the blade is not one flat plate
  pen.fillPath(()=>{
    g.moveTo(-W*0.024,-L*0.066); g.lineTo(W*0.008,-L*0.066);
    g.lineTo(W*0.010,-H*0.020);  g.lineTo(-W*0.044,-H*0.020); g.closePath();
  }, inkLevel(EDGE+1));
  // bright ground working edge
  pen.paint(()=>{
    g.moveTo(-W*0.062,-H*0.004); g.lineTo(W*0.030,-H*0.004);
    g.lineTo(W*0.026,-H*0.019);  g.lineTo(-W*0.054,-H*0.019); g.closePath();
  }, toneSolid(inkLevel(EDGE)), 2.6);
  // clods clinging to the blade
  if (soil>0.05){
    for(let i=0;i<3;i++){
      const k=0.4+0.6*soil;
      pen.paint(()=>{ blobPath(g, -W*0.040+i*W*0.026, -H*0.013+((i*3)%2)*H*0.006,
                               W*0.014*k, H*0.008*k, 400+i*13, 8, 0.36); },
                toneSolid(inkLevel(EARTH)), 2.6);
    }
  }
  g.restore();
  // turned mound at the blade's foot — outside the rotation, on the floor
  if (soil>0.05){
    const k=soil;
    pen.paint(()=>{ blobPath(g, cx-W*0.046, by+H*0.010, W*(0.024+0.020*k),
                             H*(0.006+0.005*k), 771, 10, 0.30); },
              toneSolid(inkLevel(EARTH-2)), 3.0);
    pen.ink(()=>{ for(let i=0;i<3;i++){ const a=cx-W*0.064+i*W*0.020;
      g.moveTo(a, by+H*0.005); g.lineTo(a+W*0.011, by+H*0.013); } }, 2.4);
  }
}

/* =======================================================================
   PRUNING GEAR — a hooked billhook, a small curved vine knife lying on the
   floor, a coil of withy ties, and (while pruning) the cut shoots.
   ======================================================================= */
function drawBillhook(pen,g,W,H,live){
  const cx=W*params.hookX, by=H*params.floorY, L=H*params.hookLen;
  g.save(); g.translate(cx,by); g.rotate(params.hookTilt - (live?0.10:0));
  const hw=W*0.028;
  // haft
  pen.paint(()=>{ rr(g,-hw/2,-L*0.52, hw, L*0.52, hw*0.5); }, toneSolid(inkLevel(WOOD)), 4.5);
  gripTicks(g,0,-L*0.32,hw*1.5);
  // ferrule
  pen.paint(()=>{ rr(g,-hw*0.80,-L*0.575, hw*1.60, L*0.062, hw*0.26); },
            toneSolid(inkLevel(IRON_D)), 3.6);
  // crescent blade — the hollow of the hook is paper
  pen.paint(()=>{
    g.moveTo(-hw*0.42,-L*0.575);
    g.bezierCurveTo(-W*0.075,-L*0.86, -W*0.030,-L*1.10, W*0.062,-L*1.02);
    g.bezierCurveTo(W*0.086,-L*1.00,  W*0.092,-L*0.90,  W*0.062,-L*0.885);
    g.bezierCurveTo(W*0.006,-L*0.95, -W*0.020,-L*0.83, -W*0.004,-L*0.60);
    g.closePath();
  }, toneSolid(inkLevel(IRON)), 5);
  // bright inner cutting curve
  g.strokeStyle=inkLevel(EDGE); g.lineWidth=Math.max(4, W*0.010); g.lineCap="round";
  g.beginPath();
  g.moveTo(-hw*0.10,-L*0.62);
  g.bezierCurveTo(-W*0.020,-L*0.84, W*0.006,-L*0.96, W*0.058,-L*0.905);
  g.stroke();
  g.restore();
}

function drawVineKnife(pen,g,W,H){
  const cx=W*params.knifeX, cy=H*params.knifeY;
  g.save(); g.translate(cx,cy); g.rotate(-0.26);
  // handle
  pen.paint(()=>{ rr(g,-W*0.070,-H*0.011, W*0.062, H*0.023, H*0.010); },
            toneSolid(inkLevel(WOOD_D)), 3.6);
  // hooked blade
  pen.paint(()=>{
    g.moveTo(-W*0.010,-H*0.010);
    g.bezierCurveTo(W*0.042,-H*0.020, W*0.078,-H*0.004, W*0.062, H*0.016);
    g.bezierCurveTo(W*0.058,-H*0.000, W*0.028, H*0.004, -W*0.010, H*0.010);
    g.closePath();
  }, toneSolid(inkLevel(IRON)), 4);
  pen.ink(()=>{ g.moveTo(-W*0.004,-H*0.006);
                g.bezierCurveTo(W*0.038,-H*0.014, W*0.066,-H*0.002, W*0.056, H*0.011); }, 3);
  g.restore();
}

function drawCoil(pen,g,W,H){
  const cx=W*params.coilX, cy=H*params.coilY, rx=W*0.062, ry=H*0.022;
  for(let i=0;i<params.coilRings;i++){
    const k=1-i*0.16, yy=cy-i*ry*0.30;
    // each ring is drawn as two broken arcs so the coil never reads as a bar
    g.strokeStyle=inkLevel(WITHY); g.lineWidth=Math.max(4, H*0.008);
    g.lineCap="round";
    g.beginPath(); g.ellipse(cx,yy,rx*k,ry*k, 0.06, 0.25, Math.PI*0.95); g.stroke();
    g.beginPath(); g.ellipse(cx,yy,rx*k,ry*k, 0.06, Math.PI*1.10, Math.PI*1.92); g.stroke();
    g.strokeStyle=INK; g.lineWidth=1.6;
    g.beginPath(); g.ellipse(cx,yy,rx*k,ry*k, 0.06, 0.25, Math.PI*0.95); g.stroke();
    g.beginPath(); g.ellipse(cx,yy,rx*k,ry*k, 0.06, Math.PI*1.10, Math.PI*1.92); g.stroke();
  }
  // the loose tie end
  pen.ink(()=>{ g.moveTo(cx+rx*0.86, cy-ry*0.55);
                g.quadraticCurveTo(cx+rx*1.36, cy-ry*0.10, cx+rx*1.10, cy+ry*0.70); }, 3.4);
}

function drawCutShoots(pen,g,W,H){
  const by=H*params.floorY;
  for(let i=0;i<3;i++){
    const bx=W*(0.585+i*0.042), yy=by+H*(0.010+((i*2)%3)*0.007);
    g.save(); g.translate(bx,yy); g.rotate(-0.5+i*0.42);
    pen.ink(()=>{
      g.moveTo(-W*0.030,0); g.lineTo(W*0.030,-H*0.004);
      g.moveTo(W*0.004,-H*0.001); g.lineTo(W*0.020,-H*0.016);
      g.moveTo(-W*0.012,-H*0.001); g.lineTo(-W*0.002,-H*0.014);
    }, 3.4);
    g.restore();
  }
}

/* =======================================================================
   THE STATUS DESCENT STRIP — four garment sample plates, left to right,
   each carrying the mends counted under it as seven-segment geometry.
   ======================================================================= */
/* fixed mend slots so the census reads as a count, never as a scatter */
const MEND_SLOTS = [[-0.21,0.40],[0.21,0.40],[-0.23,0.66],[0.21,0.66],
                    [-0.19,0.90],[0.23,0.90]];

function iconChiton(pen,g,x,y,w,h,mends){
  const cx=x, top=y-h*0.5, bot=y+h*0.5;
  // sleeves, under the body
  for(const s of [-1,1]){
    pen.paint(()=>{
      g.moveTo(cx+s*w*0.22, top+h*0.10);
      g.lineTo(cx+s*w*0.52, top+h*0.24);
      g.lineTo(cx+s*w*0.46, top+h*0.42);
      g.lineTo(cx+s*w*0.22, top+h*0.28);
      g.closePath();
    }, toneSolid(inkLevel(ICON+1)), 3);
  }
  // body
  pen.paint(()=>{
    g.moveTo(cx-w*0.30, top+h*0.10);
    g.lineTo(cx+w*0.30, top+h*0.10);
    g.lineTo(cx+w*0.26, top+h*0.52);
    g.lineTo(cx+w*0.42, bot);
    g.lineTo(cx-w*0.42, bot);
    g.lineTo(cx-w*0.26, top+h*0.52);
    g.closePath();
  }, toneSolid(inkLevel(ICON)), 3.6);
  // neck — paper
  pen.fillPath(()=>{ g.ellipse(cx, top+h*0.14, w*0.12, h*0.060, 0,0,7); }, PAPER);
  pen.ink(()=>{ g.ellipse(cx, top+h*0.14, w*0.12, h*0.060, 0,0,7); }, 2.6);
  if (mends===0){
    // the undiminished garment carries a belt course instead of mends
    pen.paint(()=>{ rr(g, cx-w*0.27, top+h*0.46, w*0.22, h*0.075, w*0.02); },
              toneSolid(inkLevel(CORD-1)), 2.6);
    pen.paint(()=>{ rr(g, cx+w*0.05, top+h*0.46, w*0.22, h*0.075, w*0.02); },
              toneSolid(inkLevel(CORD-1)), 2.6);
    return;
  }
  const pw=w*0.30, ph=h*0.17;
  for(let i=0;i<Math.min(mends,MEND_SLOTS.length);i++){
    const s=MEND_SLOTS[i], px=cx+w*s[0], py=top+h*s[1];
    pen.paint(()=>{ g.rect(px-pw/2, py-ph/2, pw, ph); },
              toneSolid(inkLevel(i%2?PATCH_B:PATCH_A)), 2.6);
    g.strokeStyle=INK; g.lineWidth=1.8; g.setLineDash([4,4]);
    g.strokeRect(px-pw/2+3, py-ph/2+3, pw-6, ph-6);
    g.setLineDash([]);
  }
}

function drawTile(pen,g,W,H,x,y,tw,th,i,live){
  pen.paint(()=>{ rr(g,x,y,tw,th,W*0.008); }, toneSolid(inkLevel(TILE)), 3.4);
  iconChiton(pen,g, x+tw*0.5, y+th*0.50, tw*0.66, th*0.80, params.census[i]);
  if (live){
    const m=W*0.011, e=tw*0.24;
    pen.ink(()=>{
      g.moveTo(x-m, y-m+e); g.lineTo(x-m,y-m); g.lineTo(x-m+e, y-m);
      g.moveTo(x+tw+m-e, y-m); g.lineTo(x+tw+m,y-m); g.lineTo(x+tw+m, y-m+e);
      g.moveTo(x-m, y+th+m-e); g.lineTo(x-m,y+th+m); g.lineTo(x-m+e, y+th+m);
      g.moveTo(x+tw+m-e, y+th+m); g.lineTo(x+tw+m,y+th+m); g.lineTo(x+tw+m, y+th+m-e);
    }, 4);
    pen.paint(()=>{ g.moveTo(x+tw*0.5, y-m*1.5);
                    g.lineTo(x+tw*0.5-W*0.020, y-m*1.5-H*0.016);
                    g.lineTo(x+tw*0.5+W*0.020, y-m*1.5-H*0.016); g.closePath(); },
              toneSolid(inkLevel(6)), 3.5);
  }
}

function drawStrip(pen,g,W,H,stage){
  const n=params.tiles, gap=W*params.tileGap;
  const x0=W*params.stripX0;
  const tw=(W*(params.stripX1-params.stripX0) - gap*(n-1))/n;
  const y=H*params.stripY, th=H*params.stripH;
  for(let i=0;i<n;i++){
    const x=x0+i*(tw+gap);
    drawTile(pen,g,W,H,x,y,tw,th,i,i===stage);
    if (i<n-1){
      const gx=x+tw+gap*0.5, gy=y+th*0.5;
      pen.ink(()=>{ g.moveTo(gx-gap*0.24, gy-gap*0.36); g.lineTo(gx+gap*0.22, gy);
                    g.lineTo(gx-gap*0.24, gy+gap*0.36); }, 3.4);
    }
    // mend count as seven-segment geometry under the plate
    const dw=W*0.040, dh=H*0.050, dth=Math.max(10, dw*0.30);
    segDigit(g, params.census[i], x+tw*0.5-dw*0.5, y+th+H*0.018, dw, dh, dth, inkLevel(7));
  }
}

/* =======================================================================
   THE RANK LADDER — how much of the man's standing the kit still shows.
   ======================================================================= */
function drawGauge(pen,g,W,H,rank){
  const x0=W*params.gaugeX0, x1=W*params.gaugeX1, gw=x1-x0;
  const k=clamp(rank,0,1);
  const top=H*params.gaugeTop, bot=H*params.gaugeBot, n=params.rungs;
  const rowH=(bot-top)/n, barH=rowH*0.56, bx=x0+gw*0.10, bw=gw*0.76;
  for(let i=0;i<n;i++){
    const lvl=(i+0.5)/n;
    const yy=bot-(i+1)*rowH+(rowH-barH)/2;
    if (lvl<=k) pen.paint(()=>{ rr(g,bx,yy,bw,barH,barH*0.26); }, toneSolid(inkLevel(BAR)), 4);
    else        pen.ink(()=>{ rr(g,bx,yy,bw,barH,barH*0.26); }, 3);
  }
  // broken rail
  pen.ink(()=>{ for(let i=0;i<n;i++){ const yy=bot-(i+1)*rowH;
    g.moveTo(x0+gw*0.03, yy+rowH*0.20); g.lineTo(x0+gw*0.03, yy+rowH*0.78); } }, 3);
  // caret at the live level, standing outside the ladder and pointing in
  const cy=clamp(bot-k*(bot-top), top+rowH*0.30, bot-rowH*0.20);
  pen.paint(()=>{ g.moveTo(x0-gw*0.04,cy); g.lineTo(x0-gw*0.34, cy-gw*0.22);
                  g.lineTo(x0-gw*0.34, cy+gw*0.22); g.closePath(); },
            toneSolid(inkLevel(6)), 3.5);
}

/* =======================================================================
   DRAW
   ======================================================================= */
const FOCUS = {   // grip / attach ring centres for the piece in use, 0..1
  hoe:      { x:0.860, y:0.330, r:0.050 },
  billhook: { x:0.634, y:0.510, r:0.046 },
  knife:    { x:0.496, y:0.576, r:0.042 },
  coil:     { x:0.390, y:0.560, r:0.050 },
  cap:      { x:0.118, y:0.158, r:0.058 },
  gloves:   { x:0.696, y:0.180, r:0.066 },
  gaiters:  { x:0.187, y:0.510, r:0.066 },
  tunic:    { x:0.398, y:0.245, r:0.080 },
};

function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t     = st.t ?? 0;
  const wear  = clamp(st.wear ?? 0,0,1);
  const soil  = clamp(st.soil ?? 0,0,1);
  const stage = Math.max(0, Math.min(params.tiles-1, Math.round(st.stage ?? params.tiles-1)));
  const tool  = st.tool || null;
  const cut   = clamp(st.cut ?? 0,0,1);
  const rank  = st.rank ?? (1 - stage/(params.tiles-1));

  /* ---- floor line: broken dashes, never one bar ---- */
  const fy = H*params.floorY;
  pen.ink(()=>{ for(const [a,b] of [[0.050,0.200],[0.226,0.302],[0.352,0.566],
                                    [0.606,0.724],[0.786,0.944]]){
    g.moveTo(W*a, fy); g.lineTo(W*b, fy); } }, 3.5);

  /* ---- kit, back to front ---- */
  drawTunic(pen,g,W,H,{ wear });
  drawCap(pen,g,W,H,wear);
  drawGlove(pen,g,W,H, W*params.gloveX0, H*params.gloveY, W*params.gloveW, -1, wear>0.5);
  drawGlove(pen,g,W,H, W*params.gloveX1, H*params.gloveY, W*params.gloveW,  1, wear>0.5);
  drawGaiter(pen,g,W,H, W*params.gaiterX0, fy, H*params.gaiterH, -params.gaiterTilt, wear, 21);
  drawGaiter(pen,g,W,H, W*params.gaiterX1, fy, H*params.gaiterH,  params.gaiterTilt, wear, 22);
  drawCoil(pen,g,W,H);
  drawVineKnife(pen,g,W,H);
  if (cut>0.3) drawCutShoots(pen,g,W,H);
  drawBillhook(pen,g,W,H, tool==="billhook");
  drawHoe(pen,g,W,H,soil,t);

  /* ---- the status descent strip + the rank ladder ---- */
  drawStrip(pen,g,W,H,stage);
  drawGauge(pen,g,W,H,rank);

  /* ---- ring the piece currently in use ---- */
  if (tool && FOCUS[tool]){
    const F=FOCUS[tool];
    g.strokeStyle=INK; g.lineWidth=3.2; g.setLineDash([9,7]);
    g.beginPath(); g.ellipse(W*F.x, H*F.y, W*F.r, W*F.r, 0,0,7); g.stroke();
    g.setLineDash([]);
  }
}

export const asset = {
  id:"prop.farm-clothing-and-tools",
  type:"PROP",
  name:"Farm Clothing and Tools",
  statusWord:"STOWED",
  scene:"OD-B24-S03",

  params,
  // back -> front draw order the module honors
  layers:["floor-line","tunic-peg","tunic-body","tunic-patches","cap","gloves",
          "gaiters","withy-coil","vine-knife","cut-shoots","billhook","hoe",
          "status-strip","rank-ladder","focus-ring"],

  // normalized 0..1 grip / attach / contact / read stations
  anchors:{
    "grip:hoe-upper":   {x:.872,y:.170},
    "grip:hoe-lower":   {x:.860,y:.330},
    "contact:hoe-edge": {x:.856,y:.598},
    "grip:billhook":    {x:.634,y:.520},
    "contact:hook-tip": {x:.684,y:.352},
    "grip:knife":       {x:.478,y:.580},
    "grip:coil":        {x:.390,y:.554},
    "attach:head":      {x:.118,y:.160},
    "attach:hand-l":    {x:.636,y:.208},
    "attach:hand-r":    {x:.756,y:.208},
    "attach:shin-l":    {x:.122,y:.512},
    "attach:shin-r":    {x:.252,y:.512},
    "attach:torso":     {x:.398,y:.170},
    "contact:ground":   {x:.398,y:.600},
    "mark:stage":       {x:.446,y:.720},
    "gauge:read":       {x:.922,y:.752},
  },
  // collision / placement zones (AABB in 0..1)
  zones:{
    bounds:  { x0:.045, y0:.075, x1:.955, y1:.860 },
    clothing:{ x0:.045, y0:.075, x1:.830, y1:.605 },
    tools:   { x0:.545, y0:.115, x1:.910, y1:.625 },
    strip:   { x0:.050, y0:.655, x1:.955, y1:.850 },
  },
  collision:{ kind:"box", x0:.045, y0:.075, x1:.955, y1:.630 },
  ownership:{ owner:"laertes", detail:"kept and mended by the old Sicilian woman on the farm",
              portable:true, scaleM:params.scaleM, material:params.material },

  states:{
    initial:"stowed",
    nodes:{
      stowed:   { preview:{ wear:0.00, soil:0.10, stage:3, tool:null, cut:0,
                            status:"STOWED",    progress:.08 } },
      worn:     { preview:{ wear:1.00, soil:0.15, stage:3, tool:null, cut:0,
                            status:"WORN",      progress:.24 } },
      digging:  { preview:{ wear:1.00, soil:1.00, stage:3, tool:"hoe", cut:0,
                            status:"DIGGING",   progress:.46 } },
      pruning:  { preview:{ wear:1.00, soil:0.45, stage:3, tool:"billhook", cut:1,
                            status:"PRUNING",   progress:.60 } },
      "laid-down":{ preview:{ wear:0.35, soil:0.55, stage:3, tool:null, cut:1,
                            status:"LAID DOWN", progress:.74 } },
      restored: { preview:{ wear:0.00, soil:0.00, stage:0, tool:null, cut:0,
                            status:"RESTORED",  progress:.98 } },
    },
    edges:[["stowed","worn"],["worn","digging"],["digging","pruning"],
           ["pruning","digging"],["digging","laid-down"],["pruning","laid-down"],
           ["laid-down","worn"],["laid-down","stowed"],["stowed","restored"],
           ["laid-down","restored"],["restored","stowed"],
           ["digging","digging"],["pruning","pruning"]],
  },
  channels:["wear","soil","stage","rank","tool","cut","t"],

  preview:()=>({ wear:1.00, soil:0.55, stage:3, tool:"hoe", cut:0, t:0,
                 status:"AT WORK", progress:.46 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{});
    return { anchors:asset.anchors, zones:asset.zones,
             collision:asset.collision, ownership:asset.ownership }; },
};
export default asset;
