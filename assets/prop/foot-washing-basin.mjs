/* prop.foot-washing-basin — the NURSE'S FOOTBATH of Book XIX: a wide, shallow
   beaten-bronze lebes with two pierced lug plates, a low ring foot, a linen
   drying cloth folded over the far rim and a small dipper standing in it.
   PROP asset. Distinct from the hospitality ewer-and-basin set: this vessel is
   LOW and WIDE, it sits on the floor, it is meant to be knelt beside, and its
   whole dramatic career is that it gets kicked over.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B19-S04) — seven states:
     CARRY   basin lifted, empty, dry; two hands on the lug plates; no shadow
     FILL    set on the floor, water arriving as a stream from off-frame above,
             the level gauge climbing
     WASH    brimful, still, the guest's shin and foot standing in the water,
             a refraction break at the surface line
     REVEAL  the foot lifted clear, water running off it, the scar station on
             the shin called out by registration brackets (the boar-scar
             SET_PIECE is placed on `mark:scar` — this prop never draws it)
     DROP    the foot falls, the basin is struck: it tips on its ring foot, the
             water heaves to the low side, bronze rings out in arcs
     SPILL   tipped past the rim; the water is gone onto the floor as a puddle,
             the dipper has been flung out
     RESET   righted, emptied, wiped; cloth back on the rim, gauge at zero

   A GAUGE COLUMN on the right reads the water level as geometry, never as
   small type: two seven-segment digits (per-cent of capacity) over a rung
   ladder with a caret at the current level.
   Tone plan: bronze is a LIGHT metal (level 3) so plenty of paper shows; the
   dark comes from the hard contour, the cavity (5) and the filled gauge rungs.
   Scale, grip/support/contact anchors, ownership and collision box are
   declared in 0..1 space. */
import { makePen, toneSolid, inkLevel, INK, PAPER, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  cx:0.400,        // basin centre (fraction of W)
  rimY:0.440,      // rim plane (fraction of H)
  rw:0.265,        // rim half-width (fraction of W)
  rimFlat:0.400,   // rim ellipse flatten (rh = rw*flat)
  bowlDeep:0.150,  // rim -> bowl floor (fraction of H)
  footRing:0.055,  // bowl floor -> ground (ring foot, fraction of H)
  lugOut:0.082,    // lug plate projection beyond the rim (fraction of W)
  groundY:0.645,   // floor line (fraction of H) — the ring foot rests here
  gaugeX0:0.800,   // level-gauge column (fraction of W)
  gaugeX1:0.948,
  rungs:9,         // gauge ladder rungs
  scaleM:0.46,     // real rim diameter, metres
  material:"beaten bronze, tinned interior",
  ownedBy:"palace:eurycleia (the nurse's washing set)",
};

const BODY   = 3;   // bronze exterior — LIGHT metal
const BODY_D = 4;   // shaded underside / ring foot
const RIMB   = 2;   // near rim band (the lit lip)
const CAVITY = 3;   // hollow interior above the waterline
const WATER  = 1;   // water body — nearly paper
const CLOTH  = 2;   // linen drying cloth
const CLOTH_D= 3;   // cloth fold shadow
const SKIN   = 4;   // shin / foot contact stub — the one mid-dark accent
const DIP    = 3;   // dipper
const PUDDLE = 1;   // spilled water on the floor
const BAR    = 5;   // filled gauge rung

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

/* ---------- rounded-rect sub-path ---------- */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}

/* =======================================================================
   THE BASIN — everything below is drawn in the BASIN-LOCAL frame:
   origin at the rim centre, +y down, already rotated by `tilt`.
   ======================================================================= */
function basinShell(pen,g,M){
  const {rwPx,rhPx,bd,fr}=M;

  // ---- ring foot (under the bowl) ----
  pen.paint(()=>{
    g.moveTo(-rwPx*0.30, bd-2); g.lineTo(rwPx*0.30, bd-2);
    g.lineTo(rwPx*0.36, bd+fr); g.lineTo(-rwPx*0.36, bd+fr); g.closePath();
  }, toneSolid(inkLevel(BODY_D)), 5);
  pen.paint(()=>{ g.ellipse(0, bd+fr, rwPx*0.40, rhPx*0.42, 0,0,7); },
            toneSolid(inkLevel(BODY_D)), 5);

  // ---- bowl exterior: shallow, wide, tucked under to a small flat floor ----
  pen.paint(()=>{
    g.moveTo(-rwPx, 0);
    g.bezierCurveTo(-rwPx*1.02, bd*0.52, -rwPx*0.86, bd, -rwPx*0.40, bd);
    g.lineTo(rwPx*0.40, bd);
    g.bezierCurveTo(rwPx*0.86, bd, rwPx*1.02, bd*0.52, rwPx, 0);
    g.ellipse(0,0,rwPx,rhPx,0,0,Math.PI,true);   // back over the far rim
    g.closePath();
  }, toneSolid(inkLevel(BODY)), 6);

  // hammer-course seams on the belly (broken, never a full span)
  for(let i=1;i<=2;i++){
    const yy = bd*(0.28+0.30*i);
    const hw = rwPx*(0.92-0.30*i);
    pen.seam(()=>{ g.moveTo(-hw*0.94, yy); g.lineTo(-hw*0.20, yy+2); }, 2.5);
    pen.seam(()=>{ g.moveTo( hw*0.16, yy+2); g.lineTo( hw*0.92, yy); }, 2.5);
  }

  // ---- cavity (inside the rim ring, which is laid over it later) ----
  pen.paint(()=>{ g.ellipse(0,0,rwPx*0.90,rhPx*0.80,0,0,7); },
            toneSolid(inkLevel(CAVITY)), 5);
}

/* water inside the cavity: clipped to the bowl, counter-rotated so the
   surface stays LEVEL in world space however far the basin is tipped. */
function basinWater(pen,g,M,fill,tilt,t){
  if (fill<=0.02) return;
  const {rwPx,rhPx,bd}=M;
  const surfY = lerp(bd*0.96, -rhPx*0.18, clamp(fill,0,1));
  g.save();
  g.beginPath();
  g.ellipse(0,0,rwPx*0.90,rhPx*0.80,0,0,7);
  g.moveTo(-rwPx*0.90, 0); g.lineTo(rwPx*0.90, 0);
  g.lineTo(rwPx*0.40, bd*0.97); g.lineTo(-rwPx*0.40, bd*0.97); g.closePath();
  g.clip();
  g.rotate(-tilt);                            // level the water plane
  g.fillStyle = inkLevel(WATER);
  g.fillRect(-rwPx*2.4, surfY, rwPx*4.8, bd*3+rhPx*3);
  // surface line + two ripple strokes
  g.strokeStyle=inkLevel(RIMB+2); g.lineWidth=3; g.lineCap="round";
  // broken into three runs — a level surface, never one bar across the frame
  for(const [a,b] of [[-1.55,-0.62],[-0.34,0.30],[0.58,1.55]]){
    g.beginPath(); g.moveTo(rwPx*a, surfY); g.lineTo(rwPx*b, surfY); g.stroke();
  }
  g.lineWidth=2;
  for(let i=1;i<=2;i++){
    const yy = surfY + rhPx*0.30*i + Math.sin(t*2+i)*2;
    g.beginPath(); g.moveTo(-rwPx*(0.66-0.16*i), yy); g.lineTo(-rwPx*0.10, yy); g.stroke();
    g.beginPath(); g.moveTo( rwPx*0.14, yy); g.lineTo( rwPx*(0.62-0.16*i), yy); g.stroke();
  }
  g.restore();
  return surfY;
}

function basinRimAndLugs(pen,g,M){
  const {rwPx,rhPx}=M;
  // rim RING: a light lip that closes the mouth and crosses in front of the
  // water and the standing foot. Drawn as an annulus, so the interior never
  // reads as one flat dark bar across the frame.
  pen.paint(()=>{
    g.ellipse(0,0,rwPx,rhPx,0,0,7);
    g.ellipse(0,0,rwPx*0.90,rhPx*0.80,0,0,7,true);
  }, toneSolid(inkLevel(RIMB)), 5);
  // ---- two pierced lug plates ----
  for(const s of [-1,1]){
    const x0 = s*rwPx*0.80, x1 = s*(rwPx + M.lug);
    const hh = rhPx*0.78;
    pen.paint(()=>{
      g.moveTo(x0, -hh*0.95); g.lineTo(x1, -hh*0.62);
      g.lineTo(x1,  hh*0.62); g.lineTo(x0,  hh*0.95); g.closePath();
    }, toneSolid(inkLevel(BODY)), 5);
    // punched hole -> paper shows through, so it reads as a grip
    const hx = s*(rwPx + M.lug*0.52);
    pen.fillPath(()=>{ g.ellipse(hx, 0, M.lug*0.24, hh*0.42, 0,0,7); }, PAPER);
    pen.ink(()=>{ g.ellipse(hx, 0, M.lug*0.24, hh*0.42, 0,0,7); }, 3.5);
  }
}

/* linen drying cloth: a folded stack squared off on the FAR rim, left of
   centre. A folded pad, not a hanging drape — it must not stripe the frame
   and must not fight the lug plates. */
function basinCloth(pen,g,M,amt){
  if (amt<=0.02) return;
  const {rwPx,rhPx}=M;
  const x0=-rwPx*0.74, x1=-rwPx*0.12, tk=rhPx*(0.22+0.28*amt);
  const yb=-rhPx*0.62, yt=yb-tk*2.1;
  // top face (slight perspective plate)
  pen.paint(()=>{
    g.moveTo(x0+rwPx*0.07, yt-tk*0.55); g.lineTo(x1, yt-tk*0.30);
    g.lineTo(x1-rwPx*0.06, yt+tk*0.14); g.lineTo(x0, yt); g.closePath();
  }, toneSolid(inkLevel(CLOTH)), 4.5);
  // the folded stack: three courses, each one stepped so no course spans flat
  for(let i=0;i<3;i++){
    const yy=yt+tk*(0.10+0.62*i), off=rwPx*0.045*i;
    pen.paint(()=>{
      g.moveTo(x0+off, yy); g.lineTo(x1-rwPx*0.06-off*0.4, yy+tk*0.16);
      g.lineTo(x1-rwPx*0.08-off*0.4, yy+tk*0.70); g.lineTo(x0+off*1.1, yy+tk*0.56);
      g.closePath();
    }, toneSolid(inkLevel(i===1?CLOTH_D:CLOTH)), 4);
  }
  // selvedge ticks on the near edge
  pen.seam(()=>{
    for(let i=0;i<4;i++){ const xx=x0+rwPx*0.10+i*rwPx*0.14;
      g.moveTo(xx, yb-tk*0.08); g.lineTo(xx+rwPx*0.03, yb+tk*0.16); }
  }, 2.5);
}

/* the small dipper standing in the basin, handle rising to the upper left */
function basinDipper(pen,g,M,amt){
  if (amt<=0.02) return;
  const {rwPx,rhPx,HH}=M;
  const cupX = rwPx*0.62, cupY = -rhPx*0.66;       // cup sits proud of the rim
  const cr   = rwPx*0.20,  crh = cr*0.44;
  const hx = rwPx*1.00, hy = -HH*0.250;
  // handle: a straight rod up to the right with a hooked end
  pen.limb(()=>{ g.moveTo(cupX+cr*0.55, cupY-crh*0.5); g.lineTo(hx,hy); },
           toneSolid(inkLevel(DIP)), rwPx*0.036);
  pen.limb(()=>{ g.moveTo(hx,hy); g.lineTo(hx-rwPx*0.22, hy-rhPx*0.42); },
           toneSolid(inkLevel(DIP)), rwPx*0.036);
  // cup: a small bowl with its own mouth ellipse
  pen.paint(()=>{
    g.moveTo(cupX-cr, cupY);
    g.quadraticCurveTo(cupX-cr*0.86, cupY+crh*2.6, cupX, cupY+crh*3.0);
    g.quadraticCurveTo(cupX+cr*0.86, cupY+crh*2.6, cupX+cr, cupY);
    g.ellipse(cupX, cupY, cr, crh, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(DIP)), 4.5);
  pen.paint(()=>{ g.ellipse(cupX, cupY, cr*0.90, crh*0.90, 0,0,7); },
            toneSolid(inkLevel(DIP+2)), 3.5);
}

/* =======================================================================
   THE GAUGE COLUMN (world space, right margin)
   ======================================================================= */
function gauge(pen,g,W,H,fill){
  const x0=W*params.gaugeX0, x1=W*params.gaugeX1, gw=x1-x0;
  // --- two seven-segment digits: per cent of capacity ---
  const pct = Math.max(0, Math.min(99, Math.round(clamp(fill,0,1)*99)));
  const dw = gw*0.40, dh = H*0.088, th = Math.max(8, dw*0.24), gap = gw*0.14;
  const dy = H*0.082;
  segDigit(g, Math.floor(pct/10), x0, dy, dw, dh, th, inkLevel(7));
  segDigit(g, pct%10, x0+dw+gap, dy, dw, dh, th, inkLevel(7));

  // --- rung ladder ---
  const top=H*0.235, bot=H*0.700, n=params.rungs;
  const rowH=(bot-top)/n, barH=rowH*0.54, bx=x0+gw*0.10, bw=gw*0.66;
  for(let i=0;i<n;i++){
    const lvl=(i+0.5)/n;                       // 0 at the floor, 1 at the brim
    const y = bot - (i+1)*rowH + (rowH-barH)/2;
    if (lvl<=clamp(fill,0,1)){
      pen.paint(()=>{ rr(g,bx,y,bw,barH,barH*0.25); }, toneSolid(inkLevel(BAR)), 4);
    } else {
      pen.ink(()=>{ rr(g,bx,y,bw,barH,barH*0.25); }, 3);
    }
  }
  // broken rail on the left of the ladder
  pen.ink(()=>{
    for(let i=0;i<n;i++){
      const y=bot-(i+1)*rowH;
      g.moveTo(x0+gw*0.02, y+rowH*0.18); g.lineTo(x0+gw*0.02, y+rowH*0.82);
    }
  }, 3);
  // caret at the current level
  const cy = bot - clamp(fill,0,1)*(bot-top);
  pen.paint(()=>{
    g.moveTo(x1, cy); g.lineTo(x1-gw*0.20, cy-gw*0.11); g.lineTo(x1-gw*0.20, cy+gw*0.11); g.closePath();
  }, toneSolid(inkLevel(6)), 3.5);
}

/* =======================================================================
   KEY PLATE — the orthographic key that runs under the elevation:
   a PLAN circle with its two lug tabs and a dimensioned diameter, and a
   half-SECTION through the wall carrying the water line. Numerals are
   seven-segment geometry, never type.
   ======================================================================= */
function keyPlate(pen,g,W,H,fill){
  /* ---- PLAN ---- */
  const px=W*0.165, py=H*0.800, R=W*0.090;
  pen.paint(()=>{ g.ellipse(px,py,R,R,0,0,7); }, toneSolid(inkLevel(BODY)), 5);
  pen.fillPath(()=>{ g.ellipse(px,py,R*0.70,R*0.70,0,0,7); }, PAPER);
  pen.ink(()=>{ g.ellipse(px,py,R*0.70,R*0.70,0,0,7); }, 3.5);
  for(const s of [-1,1]){                       // lug tabs, in plan
    pen.paint(()=>{
      g.moveTo(px+s*R*0.90,-R*0.30+py); g.lineTo(px+s*R*1.34,-R*0.20+py);
      g.lineTo(px+s*R*1.34, R*0.20+py); g.lineTo(px+s*R*0.90, R*0.30+py); g.closePath();
    }, toneSolid(inkLevel(BODY)), 4);
    pen.fillPath(()=>{ g.ellipse(px+s*R*1.14,py,R*0.11,R*0.11,0,0,7); }, PAPER);
    pen.ink(()=>{ g.ellipse(px+s*R*1.14,py,R*0.11,R*0.11,0,0,7); }, 3);
  }
  pen.ink(()=>{                                  // centre cross, broken
    g.moveTo(px-R*0.26,py); g.lineTo(px+R*0.26,py);
    g.moveTo(px,py-R*0.26); g.lineTo(px,py+R*0.26);
  }, 3);
  /* ---- diameter dimension under the plan ---- */
  const dy=H*0.905, x0=px-R*1.34, x1=px+R*1.34;
  pen.ink(()=>{
    g.moveTo(x0,dy-H*0.014); g.lineTo(x0,dy+H*0.014);
    g.moveTo(x1,dy-H*0.014); g.lineTo(x1,dy+H*0.014);
    g.moveTo(x0,dy); g.lineTo(x1,dy);
  }, 3.5);
  // the diameter in centimetres, as seven-segment geometry, clear of the plan
  const dw=W*0.040, dh=H*0.058, th=Math.max(8,dw*0.24);
  const nx=x1+W*0.040;
  segDigit(g,4, nx, dy-dh*0.52, dw, dh, th, inkLevel(7));
  segDigit(g,6, nx+dw*1.34, dy-dh*0.52, dw, dh, th, inkLevel(7));

  /* ---- half-SECTION through the wall ---- */
  const sx=W*0.640, sy=H*0.790, hw=W*0.135, dp=H*0.062, wall=W*0.014;
  pen.ink(()=>{
    g.moveTo(sx-hw,sy);
    g.bezierCurveTo(sx-hw*1.02, sy+dp*0.52, sx-hw*0.86, sy+dp, sx-hw*0.40, sy+dp);
    g.lineTo(sx+hw*0.40, sy+dp);
    g.bezierCurveTo(sx+hw*0.86, sy+dp, sx+hw*1.02, sy+dp*0.52, sx+hw, sy);
  }, 4);
  pen.ink(()=>{
    g.moveTo(sx-hw+wall,sy);
    g.bezierCurveTo(sx-hw*1.02+wall, sy+dp*0.52, sx-hw*0.86+wall, sy+dp-wall, sx-hw*0.40, sy+dp-wall);
    g.lineTo(sx+hw*0.40, sy+dp-wall);
    g.bezierCurveTo(sx+hw*0.86-wall, sy+dp-wall, sx+hw*1.02-wall, sy+dp*0.52, sx+hw-wall, sy);
  }, 2.5);
  pen.ink(()=>{ g.moveTo(sx-hw-W*0.016,sy); g.lineTo(sx-hw+W*0.020,sy);
                g.moveTo(sx+hw-W*0.020,sy); g.lineTo(sx+hw+W*0.016,sy); }, 4);
  // hatch ticks in the wall thickness
  pen.ink(()=>{
    for(let i=0;i<5;i++){
      const u=(i+1)/6, bx=sx-hw+ (hw*0.60)*u*u, by=sy+dp*u*1.02;
      g.moveTo(bx,by); g.lineTo(bx+wall*0.9, by+wall*0.5);
    }
  }, 2.5);
  // water line inside the section, dashed, at the live level
  const wy = sy + dp*(1-clamp(fill,0,1))*0.92 + H*0.004;
  pen.ink(()=>{
    for(let i=0;i<5;i++){
      const a=sx-hw*0.78+ i*hw*0.33, b=a+hw*0.20;
      g.moveTo(a,wy); g.lineTo(b,wy);
    }
  }, 3);
  // ring-foot stub under the section
  pen.ink(()=>{
    g.moveTo(sx-hw*0.26, sy+dp); g.lineTo(sx-hw*0.30, sy+dp+H*0.022);
    g.lineTo(sx+hw*0.30, sy+dp+H*0.022); g.lineTo(sx+hw*0.26, sy+dp);
  }, 3.5);
}

/* =======================================================================
   DRAW
   ======================================================================= */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const tilt   = st.tilt   ?? 0;    // basin tip, rad (negative = tips left)
  const lift   = st.lift   ?? 0;    // 0 on the floor .. 1 carried
  const fill   = st.fill   ?? 0;    // water level 0..1
  const stream = st.stream ?? 0;    // water arriving from off-frame above
  const foot   = st.foot   ?? 0;    // guest's shin+foot present
  const raise  = st.raise  ?? 0;    // foot lifted clear of the water
  const spill  = st.spill  ?? 0;    // water on the floor
  const ring   = st.ring   ?? 0;    // struck bronze ringing
  const cloth  = st.cloth  ?? 1;    // drying cloth on the rim
  const dipper = st.dipper ?? 1;    // dipper standing in the basin
  const grip   = st.grip   ?? 0;    // hands on the lug plates
  const mark   = st.mark   ?? 0;    // scar registration brackets
  const t      = st.t      ?? 0;

  const rwPx = W*params.rw, rhPx = rwPx*params.rimFlat;
  const bd   = H*params.bowlDeep, fr = H*params.footRing;
  const M = { rwPx, rhPx, bd, fr, lug:W*params.lugOut, HH:H };
  const groundY = H*params.groundY;

  // pivot: the low corner of the ring foot the basin rocks on
  const pivot = { x: W*params.cx - rwPx*0.36, y: H*params.rimY + bd + fr };
  const cxw = W*params.cx;
  const cyw = H*params.rimY - lift*H*0.135;

  const applyBasin = ()=>{ g.translate(cxw,cyw); g.rotate(tilt); };
  // local -> world
  const toWorld = (lx,ly)=>({
    x: cxw + lx*Math.cos(tilt) - ly*Math.sin(tilt),
    y: cyw + lx*Math.sin(tilt) + ly*Math.cos(tilt),
  });

  /* ---- ground: broken dashes, never one bar across the frame ---- */
  const segs=[[0.045,0.27],[0.325,0.56],[0.615,0.760]];
  pen.ink(()=>{ for(const [a,b] of segs){ g.moveTo(W*a,groundY); g.lineTo(W*b,groundY); } }, 3.5);

  /* ---- contact shadow under the basin (only when it is down) ---- */
  if (lift<0.35){
    g.fillStyle="rgba(0,0,0,0.09)";
    g.beginPath(); g.ellipse(cxw, groundY+H*0.006, rwPx*0.66, H*0.011, 0,0,7); g.fill();
  }

  /* ---- spilled water on the floor ---- */
  if (spill>0.02){
    const px = cxw - rwPx*(0.30+0.30*spill), py = groundY + H*0.012;
    const a  = rwPx*(0.35+0.40*spill), b = H*0.024;
    pen.paint(()=>{
      g.moveTo(px-a, py);
      g.quadraticCurveTo(px-a*0.55, py-b*1.5, px-a*0.05, py-b*0.75);
      g.quadraticCurveTo(px+a*0.42, py-b*1.7, px+a*0.92, py-b*0.30);
      g.quadraticCurveTo(px+a*1.05, py+b*1.25, px+a*0.25, py+b*1.05);
      g.quadraticCurveTo(px-a*0.45, py+b*1.6, px-a, py);
      g.closePath();
    }, toneSolid(inkLevel(PUDDLE)), 4);
    // thrown droplets (deterministic)
    pen.ink(()=>{
      for(let i=0;i<6;i++){
        const dx = px - a*0.9 + a*0.34*i, dy = py - b*(2.1 + ((i*7)%5)*0.42);
        g.moveTo(dx,dy); g.lineTo(dx+W*0.012, dy-H*0.014);
      }
    }, 3);
    // the falling sheet from the low rim to the puddle
    const low = toWorld(-rwPx*0.96, 0);
    pen.paint(()=>{
      g.moveTo(low.x-W*0.012, low.y);
      g.quadraticCurveTo(low.x-W*0.05, (low.y+py)/2, px-a*0.35, py-b*0.6);
      g.lineTo(px-a*0.02, py-b*0.5);
      g.quadraticCurveTo(low.x-W*0.005, (low.y+py)/2, low.x+W*0.018, low.y);
      g.closePath();
    }, toneSolid(inkLevel(WATER)), 3.5);
  }

  /* ---- BASIN, pass 1: shell + cavity + water ---- */
  g.save(); applyBasin();
  basinShell(pen,g,M);
  basinWater(pen,g,M,fill*(1-spill*0.98),tilt,t);
  g.restore();

  /* ---- the guest's shin + foot standing in the water (contact stub) ---- */
  const ankle = { x: cxw + rwPx*0.02, y: H*params.rimY - rhPx*0.40 - raise*H*0.105 };
  const knee  = { x: cxw + rwPx*0.16, y: H*0.170 };
  if (foot>0.2){
    // shin: a tapered calf, wider at the cut, narrow at the ankle
    const kw=W*0.038, aw=W*0.024;
    pen.paint(()=>{
      g.moveTo(knee.x-kw, knee.y);
      g.bezierCurveTo(knee.x-kw*1.20, lerp(knee.y,ankle.y,0.45),
                      ankle.x-aw*1.5, lerp(knee.y,ankle.y,0.80), ankle.x-aw, ankle.y);
      g.lineTo(ankle.x+aw, ankle.y);
      g.bezierCurveTo(ankle.x+aw*1.4, lerp(knee.y,ankle.y,0.80),
                      knee.x+kw*0.90, lerp(knee.y,ankle.y,0.45), knee.x+kw, knee.y);
      g.closePath();
    }, toneSolid(inkLevel(SKIN)), 5);
    // section cut at the top of the stub (diagrammatic crop, two rules)
    pen.ink(()=>{ g.moveTo(knee.x-kw*1.06,knee.y+H*0.002); g.lineTo(knee.x+kw*1.06,knee.y+H*0.002);
                  g.moveTo(knee.x-kw*1.06,knee.y+H*0.012); g.lineTo(knee.x+kw*1.06,knee.y+H*0.012); }, 3.5);
    // foot: heel behind, arch, toes forward — big enough to survive the lattice
    const A=ankle, FX=W, FY=H;
    pen.paint(()=>{
      g.moveTo(A.x-FX*0.046, A.y-FY*0.004);          // back of the ankle
      g.quadraticCurveTo(A.x-FX*0.062, A.y+FY*0.046, A.x-FX*0.030, A.y+FY*0.062); // heel
      g.quadraticCurveTo(A.x+FX*0.040, A.y+FY*0.078, A.x+FX*0.108, A.y+FY*0.066); // sole
      g.lineTo(A.x+FX*0.140, A.y+FY*0.048);          // toe tip
      g.quadraticCurveTo(A.x+FX*0.072, A.y+FY*0.012, A.x+FX*0.038, A.y-FY*0.004); // instep
      g.closePath();
    }, toneSolid(inkLevel(SKIN)), 5);
    // toe divisions + ankle bone (seams, so they stay hard black)
    pen.seam(()=>{
      for(let i=0;i<3;i++){
        const u=0.72+i*0.075;
        g.moveTo(A.x+FX*(0.030+0.150*u), A.y+FY*(0.070-0.030*u));
        g.lineTo(A.x+FX*(0.024+0.150*u), A.y+FY*(0.084-0.030*u));
      }
    }, 3);
    pen.seam(()=>{ g.moveTo(A.x-FX*0.020, A.y+FY*0.018); g.lineTo(A.x-FX*0.004, A.y+FY*0.022); }, 3);
    // refraction break where the foot crosses the surface
    const surfW = cyw + lerp(bd*0.96, -rhPx*0.18, clamp(fill,0,1));
    if (fill>0.05 && raise<0.35 && surfW>A.y && surfW<A.y+H*0.080){
      pen.ink(()=>{
        g.moveTo(A.x-FX*0.090, surfW); g.lineTo(A.x-FX*0.052, surfW-3);
        g.moveTo(A.x+FX*0.152, surfW-3); g.lineTo(A.x+FX*0.196, surfW);
      }, 3);
    }
    // water running off a lifted foot
    if (raise>0.3){
      pen.ink(()=>{
        for(let i=0;i<4;i++){
          const dx = ankle.x - W*0.020 + W*0.036*i;
          const dy = ankle.y + H*0.062 + H*0.012*((i*5)%3);
          g.moveTo(dx,dy); g.lineTo(dx-W*0.004, dy+H*0.028);
        }
      }, 3);
    }
    // scar station: registration brackets only — the SET_PIECE draws the scar
    if (mark>0.3){
      const sx = ankle.x + W*0.012, sy = ankle.y - H*0.088;
      const r = W*0.052, k = W*0.020;
      pen.ink(()=>{
        g.moveTo(sx-r, sy-r+k); g.lineTo(sx-r, sy-r); g.lineTo(sx-r+k, sy-r);
        g.moveTo(sx+r-k, sy-r); g.lineTo(sx+r, sy-r); g.lineTo(sx+r, sy-r+k);
        g.moveTo(sx+r, sy+r-k); g.lineTo(sx+r, sy+r); g.lineTo(sx+r-k, sy+r);
        g.moveTo(sx-r+k, sy+r); g.lineTo(sx-r, sy+r); g.lineTo(sx-r, sy+r-k);
      }, 4);
    }
  }

  /* ---- BASIN, pass 2: near rim, lugs, cloth, dipper (in front of the foot) ---- */
  g.save(); applyBasin();
  basinRimAndLugs(pen,g,M);
  basinCloth(pen,g,M,cloth);
  basinDipper(pen,g,M,dipper);
  g.restore();

  /* ---- water arriving from off-frame above ---- */
  if (stream>0.02){
    const sx = cxw - rwPx*0.30, top = H*0.055;
    const land = cyw + lerp(bd*0.96, -rhPx*0.18, clamp(fill,0,1));
    const wpx = W*0.017*stream;
    pen.paint(()=>{
      g.moveTo(sx-wpx*0.6, top);
      g.quadraticCurveTo(sx-wpx*1.4, (top+land)/2, sx-wpx*1.5+Math.sin(t*3)*4, land);
      g.lineTo(sx+wpx*1.5+Math.sin(t*3)*4, land);
      g.quadraticCurveTo(sx+wpx*1.4, (top+land)/2, sx+wpx*0.6, top);
      g.closePath();
    }, toneSolid(inkLevel(WATER)), 3.5);
    pen.ink(()=>{
      for(let i=-1;i<=1;i+=2){
        g.moveTo(sx+i*W*0.030, land); g.lineTo(sx+i*W*0.046, land-H*0.024);
      }
    }, 3);
  }

  /* ---- struck bronze: ringing arcs off the near lug ---- */
  if (ring>0.02){
    const p = toWorld(rwPx + M.lug*0.9, 0);
    pen.ink(()=>{
      for(let i=1;i<=3;i++){
        const r = W*(0.045+0.036*i)*(0.75+0.35*ring);
        g.moveTo(p.x + r*Math.cos(-0.85), p.y + r*Math.sin(-0.85));
        g.arc(p.x, p.y, r, -0.85, 0.85);
      }
    }, 3.5);
  }

  /* ---- hands on the lug plates (carry) ---- */
  if (grip>0.4){
    for(const s of [-1,1]){
      const p = toWorld(s*(rwPx + M.lug*0.52), 0);
      pen.paint(()=>{ g.ellipse(p.x, p.y, W*0.030, W*0.023, tilt, 0,7); },
                toneSolid(inkLevel(4)), 4);
      pen.limb(()=>{ g.moveTo(p.x,p.y); g.lineTo(p.x+s*W*0.075, p.y-H*0.045); },
               toneSolid(inkLevel(SKIN)), W*0.028);
    }
  }

  /* ---- the level gauge + the orthographic key plate ---- */
  gauge(pen,g,W,H,fill*(1-spill*0.98));
  keyPlate(pen,g,W,H,fill*(1-spill*0.98));
}

export const asset = {
  id:"prop.foot-washing-basin",
  type:"PROP",
  name:"Foot-washing Basin",
  statusWord:"FILLED",
  scene:"OD-B19-S04",

  params,
  layers:["ground","shadow","spill-puddle","bowl-foot","bowl-body","cavity",
          "water","shin","foot","rim-band","lug-plates","cloth","dipper",
          "in-stream","ring-arcs","hands","gauge"],
  // normalized 0..1 anchors: grip / support / contact / target stations
  anchors:{
    "grip:lug-left":{x:.092,y:.440},   // left lug plate hole (carry hand)
    "grip:lug-right":{x:.708,y:.440},  // right lug plate hole (carry hand)
    "grip:dipper":{x:.665,y:.190},     // dipper handle hook
    "rim:near":{x:.400,y:.520},        // near lip — where a kneeling nurse leans
    "rim:cloth":{x:.286,y:.345},       // folded linen on the far rim
    "contact:floor":{x:.400,y:.645},   // ring foot on the floor
    "contact:foot":{x:.405,y:.408},    // where the guest's foot stands
    "mark:scar":{x:.417,y:.320},       // SET_PIECE station for the boar scar
    "target:pour":{x:.400,y:.455},     // where an incoming stream lands
    "pivot:tip":{x:.305,y:.645},       // the ring-foot corner it rocks on
    "gauge:read":{x:.874,y:.126},      // level readout
  },
  // collision shape (AABB in 0..1) for placement / pathing
  zones:{
    bounds:{ x0:.030, y0:.150, x1:.960, y1:.700 },
    vessel:{ x0:.092, y0:.360, x1:.708, y1:.650 },
    spill:{  x0:.030, y0:.620, x1:.560, y1:.700 },
  },
  ownership:{ owner:"eurycleia", household:"palace-of-odysseus", portable:true,
              scaleM:params.scaleM, material:params.material },
  states:{
    initial:"reset",
    nodes:{
      carry: { preview:{ tilt:-0.06, lift:1, fill:0,    stream:0, foot:0, raise:0,
                         spill:0, ring:0, cloth:1, dipper:1, grip:1, mark:0,
                         status:"CARRIED",  progress:.12 } },
      fill:  { preview:{ tilt:0,     lift:0, fill:0.55, stream:1, foot:0, raise:0,
                         spill:0, ring:0, cloth:1, dipper:1, grip:0, mark:0,
                         status:"FILLING",  progress:.30 } },
      wash:  { preview:{ tilt:0,     lift:0, fill:0.88, stream:0, foot:1, raise:0,
                         spill:0, ring:0, cloth:1, dipper:1, grip:0, mark:0,
                         status:"WASHING",  progress:.48 } },
      reveal:{ preview:{ tilt:0,     lift:0, fill:0.88, stream:0, foot:1, raise:1,
                         spill:0, ring:0, cloth:1, dipper:1, grip:0, mark:1,
                         status:"REVEALED", progress:.66 } },
      drop:  { preview:{ tilt:-0.26, lift:0, fill:0.80, stream:0, foot:1, raise:0.55,
                         spill:0.15, ring:1, cloth:1, dipper:1, grip:0, mark:1,
                         status:"STRUCK",   progress:.80 } },
      spill: { preview:{ tilt:-0.62, lift:0, fill:0.10, stream:0, foot:1, raise:0.9,
                         spill:1, ring:0.4, cloth:1, dipper:0, grip:0, mark:1,
                         status:"SPILLED",  progress:.92 } },
      reset: { preview:{ tilt:0,     lift:0, fill:0,    stream:0, foot:0, raise:0,
                         spill:0, ring:0, cloth:1, dipper:1, grip:0, mark:0,
                         status:"RESET",    progress:.05 } },
    },
    edges:[["reset","carry"],["carry","fill"],["fill","wash"],["wash","reveal"],
           ["reveal","drop"],["drop","spill"],["spill","reset"],["wash","wash"],
           ["reveal","wash"],["carry","reset"],["fill","carry"],["spill","carry"]],
  },
  channels:["tilt","lift","fill","stream","foot","raise","spill","ring",
            "cloth","dipper","grip","mark","t"],

  preview:()=>({ tilt:0, lift:0, fill:0.82, stream:0, foot:1, raise:0, spill:0,
                 ring:0, cloth:1, dipper:1, grip:0, mark:0, t:0,
                 status:"FILLED", progress:.42 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
