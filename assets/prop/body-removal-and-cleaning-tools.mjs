/* prop.body-removal-and-cleaning-tools — the KIT that clears the megaron after
   the killing in Book XXII: a slatted carrying BIER (two ash poles + a lashed
   deck, with a wrapped load state), two WATER VESSELS (a two-handled jar and a
   wide bail bucket), two many-holed SPONGES, and two SCRAPERS (a long-hafted
   listron and a short hand scraper) — laid out as an orthographic KIT PLATE
   over a five-stage CLEANING TRANSITION STRIP.

   PROP asset. Drawn in SOLID grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone. Do NOT pre-dither. No figures are
   baked in — the bier's load is a wrapped, lashed bundle (cargo geometry), and
   the bearers are placed by the scene through the four pole grips.

   Scene function (OD-B22-S07) — the clearing detail, six states:
     STOWED    everything racked by the door, vessels full, floor still fouled
     CARRYING  the bier lifted off its legs, a wrapped load lashed to the deck
     SCRAPING  the listron works the floor; the strip advances to the scraped tile
     SPONGING  the sponges are saturated and dripping; tables and seats wiped
     RINSING   the vessels are pouring out; residue washed to the door
     CLEANED   tools back down, gauge at full, the strip ends on bare paper

   The CLEANING TRANSITION is the whole point of the prop, so it is drawn as a
   readable diagram rather than implied: five floor sample tiles, left to right,
   FOULED -> SCRAPED -> SPONGED -> RINSED -> CLEAN, with the live stage called
   out by registration brackets and a caret. Numerals (stage index, per-cent
   clean) are seven-segment GEOMETRY, never small type.

   Tone plan: ash and linen are LIGHT (levels 2-3) so plenty of paper shows;
   the dark is carried by the hard contour, the iron blades (5-6), the lashing
   straps and the fouling blots — which shrink stage by stage until the last
   tile is bare paper. Every long member (poles, floor line, gauge rail, tile
   row) is broken so nothing stripes the frame.
   Scale, grip/support/contact anchors, ownership and collision are declared in
   0..1 space. */
import { makePen, toneSolid, inkLevel, INK, PAPER, clamp, lerp, rnd }
  from "../../engine/halfworld-engine.mjs";

const params = {
  // kit-plate slots, fractions of W/H (floor contacts sit on `floorY`)
  bierX:0.400, bierY:0.186, bierHalfLen:0.222, bierHalfDeep:0.049, bierSkew:0.040,
  bierTilt:-0.066, bierPoleEnd:1.24, slats:7,
  jarX:0.118, bucketX:0.284, spongeX:0.452, scraperX:0.596, handScraperX:0.702,
  floorY:0.607,
  gaugeX0:0.778, gaugeX1:0.950, gaugeTop:0.200, gaugeBot:0.556, rungs:7,
  stripY:0.664, stripH:0.152, stripX0:0.058, tiles:5, tileGap:0.017,
  holesBig:9, holesSmall:6,
  scaleM:2.05,           // bier pole length, metres
  material:"ash poles, ox-hide lashing, terracotta, beaten iron, sea sponge",
};

/* ---- eight-level tone plan (light kit, dark accents) ---- */
const DECK   = 2;   // deck slats — light ash
const DECK_D = 3;   // alternate slat / shaded face
const WOOD   = 3;   // poles and hafts
const WOOD_D = 4;   // leg stubs, shaded wood
const SHROUD = 2;   // the wrapped load — linen, very light
const STRAP  = 5;   // lashing straps and knots
const VESSEL = 3;   // terracotta
const VESSEL_D=4;   // vessel foot / shaded lip
const RIMB   = 2;   // lit rim band
const WATER  = 1;   // water — nearly paper
const SPONGE = 2;   // dry sponge
const SPONGE_D=3;   // saturated sponge
const IRON   = 3;   // scraper blades — light metal, the contour does the work
const IRON_D = 4;   // sockets / deepest iron
const EDGE   = 2;   // bright ground working edge
const TILE   = 1;   // floor sample plate
const SOIL   = 6;   // fouling, unworked
const SOIL2  = 4;   // fouling, part lifted
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
  g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round";
  for(let i=-1;i<=1;i++){
    g.beginPath(); g.moveTo(x-w/2, y+i*w*0.42-w*0.10);
    g.lineTo(x+w/2, y+i*w*0.42+w*0.10); g.stroke();
  }
}

/* =======================================================================
   THE BIER — two ash poles, a slatted deck between them, an optional
   wrapped load lashed down. Drawn in a local frame: origin at deck centre,
   u along the poles (-1..1 = deck), v across (-1 far pole, +1 near pole).
   ======================================================================= */
function drawBier(pen,g,W,H,st){
  const load = clamp(st.load ?? 0,0,1);
  const lift = clamp(st.lift ?? 0,0,1);
  const cx = W*params.bierX, cy = H*params.bierY - lift*H*0.026;
  const L  = W*params.bierHalfLen, D = H*params.bierHalfDeep, SK = W*params.bierSkew;
  const pt = (u,v)=>({ x:u*L + v*SK, y:v*D });
  const poleT = H*0.019;

  g.save(); g.translate(cx,cy); g.rotate(params.bierTilt);

  /* ---- trestle leg stubs, only while the bier is grounded ---- */
  if (lift < 0.45){
    for (const u of [-0.70, 0.70]){
      const a = pt(u, 1);
      pen.paint(()=>{ rr(g, a.x-W*0.011, a.y+poleT*0.30, W*0.022, H*0.052, W*0.007); },
                toneSolid(inkLevel(WOOD_D)), 4);
    }
  }

  /* ---- far pole ---- */
  const PE = params.bierPoleEnd;
  const farA = pt(-PE,-1), farB = pt(PE,-1);
  pen.paint(()=>{ rr(g, farA.x, farA.y-poleT/2, farB.x-farA.x, poleT, poleT/2); },
            toneSolid(inkLevel(WOOD)), 4.5);

  /* ---- deck slats, alternating tone, paper gaps between every one ---- */
  const n = params.slats, du = 0.070;
  for (let i=0;i<n;i++){
    const u = -0.80 + (1.60*i)/(n-1);
    const p0=pt(u-du,-1), p1=pt(u+du,-1), p2=pt(u+du,1), p3=pt(u-du,1);
    pen.paint(()=>{ g.moveTo(p0.x,p0.y); g.lineTo(p1.x,p1.y);
                    g.lineTo(p2.x,p2.y); g.lineTo(p3.x,p3.y); g.closePath(); },
              toneSolid(inkLevel(i%2 ? DECK_D : DECK)), 3.5);
  }

  /* ---- the wrapped load (cargo geometry: a lashed bundle, no anatomy) ---- */
  if (load > 0.02){
    const x0=-L*0.88, x1=L*0.82;
    const yT=-D*0.42 - H*0.046*load, yB=D*0.40;
    const hh=yB-yT;
    pen.paint(()=>{
      g.moveTo(x0+L*0.11, yT);
      g.lineTo(x1-L*0.17, yT);
      g.lineTo(x1, yT+hh*0.42);
      g.lineTo(x1-L*0.07, yB);
      g.lineTo(x0+L*0.06, yB);
      g.lineTo(x0, yT+hh*0.46);
      g.closePath();
    }, toneSolid(inkLevel(SHROUD)), 5);
    // linen folds — three long broken diagonals, never a span
    pen.seam(()=>{
      for(let i=0;i<3;i++){
        const a = x0+L*0.30 + i*L*0.52;
        g.moveTo(a, yT+hh*0.14); g.lineTo(a-L*0.14, yT+hh*0.62);
        g.moveTo(a+L*0.22, yT+hh*0.66); g.lineTo(a+L*0.12, yB-hh*0.06);
      }
    }, 3);
    // three lashing straps, each broken by its knot block
    for (const u of [-0.56, 0.02, 0.58]){
      const sx = u*L, sw = W*0.017;
      pen.paint(()=>{ rr(g, sx-sw/2, yT-hh*0.05, sw, hh*0.40, sw*0.30); },
                toneSolid(inkLevel(STRAP)), 3);
      pen.paint(()=>{ rr(g, sx-sw/2, yT+hh*0.62, sw, hh*0.46, sw*0.30); },
                toneSolid(inkLevel(STRAP)), 3);
      pen.paint(()=>{ rr(g, sx-sw*0.95, yT+hh*0.40, sw*1.9, hh*0.24, sw*0.34); },
                toneSolid(inkLevel(STRAP-1)), 3);
    }
  }

  /* ---- near pole (crosses in front of deck + load) ---- */
  const nearA = pt(-PE,1), nearB = pt(PE,1);
  pen.paint(()=>{ rr(g, nearA.x, nearA.y-poleT/2, nearB.x-nearA.x, poleT, poleT/2); },
            toneSolid(inkLevel(WOOD)), 4.5);

  /* ---- corner lashings where the deck meets the poles ---- */
  g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round";
  for (const u of [-0.86, 0.86]) for (const v of [-1,1]){
    const p=pt(u,v), w=L*0.055;
    g.beginPath(); g.moveTo(p.x-w,p.y-poleT*0.8); g.lineTo(p.x+w,p.y+poleT*0.8);
    g.moveTo(p.x-w,p.y+poleT*0.8); g.lineTo(p.x+w,p.y-poleT*0.8); g.stroke();
  }

  /* ---- carry grips on the four pole ends ---- */
  for (const v of [-1,1]) for (const s of [-1,1]){
    const p=pt(s*(PE-0.08),v); gripTicks(g,p.x,p.y,W*0.030);
  }
  g.restore();
}

/* =======================================================================
   WATER VESSELS
   ======================================================================= */
function drawJar(pen,g,W,H,fill){
  const cx=W*params.jarX, by=H*params.floorY;
  const hgt=H*0.202, rw=W*0.056;
  // foot
  pen.paint(()=>{ g.moveTo(cx-rw*0.40, by-hgt*0.060); g.lineTo(cx+rw*0.40, by-hgt*0.060);
                  g.lineTo(cx+rw*0.52, by); g.lineTo(cx-rw*0.52, by); g.closePath(); },
            toneSolid(inkLevel(VESSEL_D)), 4);
  // belly
  pen.paint(()=>{
    g.moveTo(cx-rw*0.34, by-hgt*0.055);
    g.bezierCurveTo(cx-rw*1.10, by-hgt*0.24, cx-rw*1.02, by-hgt*0.62, cx-rw*0.32, by-hgt*0.70);
    g.lineTo(cx+rw*0.32, by-hgt*0.70);
    g.bezierCurveTo(cx+rw*1.02, by-hgt*0.62, cx+rw*1.10, by-hgt*0.24, cx+rw*0.34, by-hgt*0.055);
    g.closePath();
  }, toneSolid(inkLevel(VESSEL)), 5);
  // neck
  pen.paint(()=>{ rr(g, cx-rw*0.29, by-hgt*0.93, rw*0.58, hgt*0.26, rw*0.10); },
            toneSolid(inkLevel(VESSEL)), 4.5);
  // two side handles — thin arcs, paper between them and the neck
  for (const s of [-1,1]){
    pen.limb(()=>{ g.moveTo(cx+s*rw*0.28, by-hgt*0.84);
                   g.quadraticCurveTo(cx+s*rw*1.00, by-hgt*0.78, cx+s*rw*0.80, by-hgt*0.55); },
             toneSolid(inkLevel(VESSEL)), rw*0.15);
  }
  // flared mouth
  pen.paint(()=>{ g.ellipse(cx, by-hgt*0.945, rw*0.44, hgt*0.042, 0,0,7); },
            toneSolid(inkLevel(RIMB)), 4);
  pen.paint(()=>{ g.ellipse(cx, by-hgt*0.950, rw*0.27, hgt*0.026, 0,0,7); },
            toneSolid(inkLevel(VESSEL_D+1)), 3);
  // shoulder course — broken, two short runs
  pen.seam(()=>{ g.moveTo(cx-rw*0.88, by-hgt*0.50); g.lineTo(cx-rw*0.26, by-hgt*0.53);
                 g.moveTo(cx+rw*0.24, by-hgt*0.53); g.lineTo(cx+rw*0.88, by-hgt*0.50); }, 2.6);
  // dashed contents level across the belly (diagram, not a painted fluid)
  const wy = by - hgt*0.09 - hgt*0.54*clamp(fill,0,1);
  pen.ink(()=>{ for(let i=0;i<4;i++){ const a=cx-rw*0.82+i*rw*0.44;
                  g.moveTo(a,wy); g.lineTo(a+rw*0.27,wy); } }, 3);
}

function drawBucket(pen,g,W,H,fill,t){
  const cx=W*params.bucketX, by=H*params.floorY;
  const tw=W*0.076, bw=W*0.057, dh=H*0.098, ty=by-dh, rh=tw*0.31;
  // body
  pen.paint(()=>{
    g.moveTo(cx-tw,ty); g.lineTo(cx-bw,by); g.lineTo(cx+bw,by); g.lineTo(cx+tw,ty);
    g.ellipse(cx,ty,tw,rh,0,0,Math.PI,true); g.closePath();
  }, toneSolid(inkLevel(VESSEL)), 5);
  // stave seams — short, staggered, never full depth
  pen.seam(()=>{
    g.moveTo(cx-tw*0.52, ty+dh*0.28); g.lineTo(cx-bw*0.50, by-dh*0.16);
    g.moveTo(cx+tw*0.20, ty+dh*0.14); g.lineTo(cx+bw*0.19, by-dh*0.40);
    g.moveTo(cx+tw*0.66, ty+dh*0.36); g.lineTo(cx+bw*0.64, by-dh*0.10);
  }, 2.5);
  // water surface seen through the mouth
  if (fill>0.02){
    const k = clamp(fill,0,1);
    const sy = ty + dh*0.10 + dh*0.62*(1-k);
    const sw = tw*(0.86 - 0.16*(1-k));
    pen.paint(()=>{ g.ellipse(cx, sy, sw, rh*0.78, 0,0,7); }, toneSolid(inkLevel(WATER)), 3.5);
    pen.ink(()=>{ g.moveTo(cx-sw*0.70, sy+Math.sin(t*2)*1.4); g.lineTo(cx-sw*0.16, sy+1);
                  g.moveTo(cx+sw*0.14, sy-1); g.lineTo(cx+sw*0.66, sy+Math.sin(t*2+1)*1.4); }, 2.4);
  }
  // rim annulus (light lip closing the mouth)
  pen.paint(()=>{ g.ellipse(cx,ty,tw,rh,0,0,7);
                  g.ellipse(cx,ty,tw*0.86,rh*0.78,0,0,7,true); },
            toneSolid(inkLevel(RIMB)), 4.5);
  // bail handle standing up
  pen.limb(()=>{ g.moveTo(cx-tw*0.93, ty-rh*0.10);
                 g.quadraticCurveTo(cx, ty-dh*0.86, cx+tw*0.93, ty-rh*0.10); },
           toneSolid(inkLevel(VESSEL_D)), W*0.011);
}

/* =======================================================================
   SPONGES — polytretoi, "many-holed". Punched holes let paper through, so a
   big object stays light.
   ======================================================================= */
function oneSponge(pen,g,cx,cy,rx,ry,seed,tone,holes){
  pen.paint(()=>{ blobPath(g,cx,cy,rx,ry,seed,11,0.30); }, toneSolid(inkLevel(tone)), 5);
  const R=rnd(seed+17);
  for(let i=0;i<holes;i++){
    const a=R()*6.2832, k=Math.sqrt(R())*0.70;
    const hx=cx+Math.cos(a)*rx*k, hy=cy+Math.sin(a)*ry*k;
    const hr=rx*(0.115+R()*0.095);   // big enough to survive the dot lattice
    pen.fillPath(()=>{ g.ellipse(hx,hy,hr,hr*0.86,0,0,7); }, PAPER);
    pen.ink(()=>{ g.ellipse(hx,hy,hr,hr*0.86,0,0,7); }, 2.2);
  }
}

function drawSponges(pen,g,W,H,wet,t){
  const cx=W*params.spongeX, cy=H*0.548, floor=H*params.floorY;
  // small dry sponge, set back left
  oneSponge(pen,g, cx-W*0.052, cy+H*0.030, W*0.038, H*0.028, 771, SPONGE, params.holesSmall);
  // the working sponge — saturated darkens it one level only
  oneSponge(pen,g, cx+W*0.022, cy-H*0.006, W*0.058, H*0.044, 313,
            wet>0.5 ? SPONGE_D : SPONGE, params.holesBig);
  if (wet>0.05){
    // drips off the working sponge + a small catch puddle on the floor
    pen.ink(()=>{
      for(let i=0;i<3;i++){
        const dx = cx - W*0.010 + i*W*0.030;
        const dy = cy + H*0.038 + ((i*5)%3)*H*0.010 + Math.sin(t*2+i)*2;
        g.moveTo(dx,dy); g.lineTo(dx, dy+H*0.020);
      }
    }, 3);
    pen.paint(()=>{ blobPath(g, cx+W*0.020, floor+H*0.010, W*0.048*wet+W*0.014,
                             H*0.012*wet+H*0.004, 909, 9, 0.30); },
              toneSolid(inkLevel(WATER)), 3.5);
  }
}

/* =======================================================================
   SCRAPERS — the long-hafted listron that lifts the fouled floor course, and
   a short hand scraper for the tables and the seats.
   ======================================================================= */
function drawListron(pen,g,W,H){
  const cx=W*params.scraperX, by=H*params.floorY;
  g.save(); g.translate(cx,by); g.rotate(-0.20);
  // haft
  pen.paint(()=>{ rr(g,-W*0.012,-H*0.258, W*0.024, H*0.186, W*0.012); },
            toneSolid(inkLevel(WOOD)), 4.5);
  gripTicks(g,0,-H*0.196,W*0.030);
  // socket collar
  pen.paint(()=>{ rr(g,-W*0.019,-H*0.080, W*0.038, H*0.026, W*0.006); },
            toneSolid(inkLevel(IRON_D)), 4);
  // flat blade, splayed to the working edge
  pen.paint(()=>{ g.moveTo(-W*0.036,-H*0.056); g.lineTo(W*0.036,-H*0.056);
                  g.lineTo(W*0.055,-H*0.004); g.lineTo(-W*0.055,-H*0.004); g.closePath(); },
            toneSolid(inkLevel(IRON)), 5);
  // lighter cheek so the blade is not one flat plate
  pen.paint(()=>{ g.moveTo(-W*0.028,-H*0.049); g.lineTo(W*0.014,-H*0.049);
                  g.lineTo(W*0.030,-H*0.016); g.lineTo(-W*0.040,-H*0.016); g.closePath(); },
            toneSolid(inkLevel(EDGE)), 0);
  // bright ground working edge — the one light strip on the iron
  pen.paint(()=>{ g.moveTo(-W*0.055,-H*0.004); g.lineTo(W*0.055,-H*0.004);
                  g.lineTo(W*0.049,-H*0.021); g.lineTo(-W*0.049,-H*0.021); g.closePath(); },
            toneSolid(inkLevel(EDGE-1)), 2.5);
  g.restore();
}

function drawHandScraper(pen,g,W,H){
  const cx=W*params.handScraperX, by=H*params.floorY;
  g.save(); g.translate(cx,by); g.rotate(0.30);
  // short grip
  pen.paint(()=>{ rr(g,-W*0.013,-H*0.132, W*0.026, H*0.078, W*0.013); },
            toneSolid(inkLevel(WOOD)), 4.5);
  gripTicks(g,0,-H*0.100,W*0.028);
  // socket + curved blade, hollow side to the paper
  pen.paint(()=>{ rr(g,-W*0.016,-H*0.062, W*0.032, H*0.018, W*0.005); },
            toneSolid(inkLevel(IRON_D)), 3.5);
  pen.paint(()=>{
    g.moveTo(-W*0.016,-H*0.050); g.lineTo(W*0.016,-H*0.050);
    g.quadraticCurveTo(W*0.044,-H*0.034, W*0.038,-H*0.004);
    g.lineTo(-W*0.038,-H*0.004);
    g.quadraticCurveTo(-W*0.044,-H*0.034, -W*0.016,-H*0.050);
    g.closePath();
  }, toneSolid(inkLevel(IRON)), 4.5);
  pen.paint(()=>{ g.moveTo(-W*0.038,-H*0.004); g.lineTo(W*0.038,-H*0.004);
                  g.lineTo(W*0.033,-H*0.019); g.lineTo(-W*0.033,-H*0.019); g.closePath(); },
            toneSolid(inkLevel(EDGE-1)), 2.5);
  g.restore();
}

/* =======================================================================
   THE CLEANING TRANSITION STRIP — five floor sample tiles, left to right.
   ======================================================================= */
const BLOBS = [[0.30,0.36,0.27,0.22],[0.63,0.58,0.23,0.18],
               [0.45,0.78,0.18,0.13],[0.78,0.27,0.15,0.11]];

function drawTile(pen,g,W,H,x,y,tw,th,stage,live,t){
  // the sample plate — almost paper, hard contour
  pen.paint(()=>{ rr(g,x,y,tw,th,W*0.008); }, toneSolid(inkLevel(TILE)), 3.4);
  // two broken flagstone joints so the plate is not an empty box
  pen.seam(()=>{ g.moveTo(x+tw*0.33,y+th*0.07); g.lineTo(x+tw*0.33,y+th*0.33);
                 g.moveTo(x+tw*0.69,y+th*0.63); g.lineTo(x+tw*0.69,y+th*0.93); }, 2.2);

  if (stage <= 3){
    const k    = [1.00,0.88,0.58,0.38][stage];
    const tone = [SOIL,SOIL,SOIL2,3][stage];
    const n    = [4,4,3,2][stage];
    g.save(); g.beginPath(); rr(g,x+3,y+3,tw-6,th-6,W*0.008); g.clip();
    for(let i=0;i<n;i++){
      const b=BLOBS[i];
      pen.paint(()=>{ blobPath(g, x+tw*b[0], y+th*b[1], tw*b[2]*k, th*b[3]*k,
                               40+i*7+stage*13, 9, 0.36); },
                toneSolid(inkLevel(tone)), 3);
    }
    if (stage===1){
      // scraper swaths: courses lifted clean out of the fouling
      g.strokeStyle=PAPER; g.lineWidth=th*0.095; g.lineCap="butt";
      for(let i=0;i<4;i++){
        const yy=y+th*(0.17+0.215*i);
        g.beginPath(); g.moveTo(x+tw*0.04, yy+th*0.05); g.lineTo(x+tw*0.96, yy-th*0.03); g.stroke();
      }
    }
    if (stage===2){
      // sponge sheen — two broken wet bands
      g.strokeStyle=inkLevel(WATER+2); g.lineWidth=th*0.15; g.lineCap="round";
      for(const [a,b,yy] of [[0.08,0.44,0.30],[0.54,0.92,0.62]]){
        g.beginPath(); g.moveTo(x+tw*a, y+th*yy); g.lineTo(x+tw*b, y+th*(yy+0.05)); g.stroke();
      }
    }
    if (stage===3){
      // rinse streaks running to the door side
      g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="round";
      for(let i=0;i<3;i++){
        const yy=y+th*(0.26+0.22*i);
        g.beginPath(); g.moveTo(x+tw*0.12, yy); g.lineTo(x+tw*0.58, yy+th*0.05); g.stroke();
      }
    }
    g.restore();
  } else {
    // CLEAN — bare paper carrying only a struck tick
    pen.ink(()=>{ g.moveTo(x+tw*0.30,y+th*0.52); g.lineTo(x+tw*0.44,y+th*0.70);
                  g.lineTo(x+tw*0.72,y+th*0.28); }, 5.5);
  }

  if (live){
    // registration brackets on the live stage
    const m=W*0.011, e=tw*0.22;
    pen.ink(()=>{
      g.moveTo(x-m, y-m+e); g.lineTo(x-m,y-m); g.lineTo(x-m+e, y-m);
      g.moveTo(x+tw+m-e, y-m); g.lineTo(x+tw+m,y-m); g.lineTo(x+tw+m, y-m+e);
      g.moveTo(x-m, y+th+m-e); g.lineTo(x-m,y+th+m); g.lineTo(x-m+e, y+th+m);
      g.moveTo(x+tw+m-e, y+th+m); g.lineTo(x+tw+m,y+th+m); g.lineTo(x+tw+m, y+th+m-e);
    }, 4);
    // caret above
    pen.paint(()=>{ g.moveTo(x+tw*0.5, y-m*1.4);
                    g.lineTo(x+tw*0.5-W*0.019, y-m*1.4-H*0.015);
                    g.lineTo(x+tw*0.5+W*0.019, y-m*1.4-H*0.015); g.closePath(); },
              toneSolid(inkLevel(6)), 3.5);
  }
}

function drawStrip(pen,g,W,H,phase,t){
  const n=params.tiles, gap=W*params.tileGap;
  const x0=W*params.stripX0;
  const tw=(W*(1-2*params.stripX0) - gap*(n-1))/n;
  const y=H*params.stripY, th=H*params.stripH;
  for(let i=0;i<n;i++){
    const x=x0+i*(tw+gap);
    drawTile(pen,g,W,H,x,y,tw,th,i,i===phase,t);
    // chevron in the gap pointing to the next stage
    if (i<n-1){
      const gx=x+tw+gap*0.5, gy=y+th*0.5;
      pen.ink(()=>{ g.moveTo(gx-gap*0.22, gy-gap*0.34); g.lineTo(gx+gap*0.20, gy);
                    g.lineTo(gx-gap*0.22, gy+gap*0.34); }, 3.4);
    }
    // stage index as seven-segment geometry under the tile
    const dw=W*0.032, dh=H*0.048, dth=Math.max(9, dw*0.28);
    segDigit(g, i+1, x+tw*0.5-dw*0.5, y+th+H*0.024, dw, dh, dth, inkLevel(7));
  }
}

/* =======================================================================
   THE GAUGE COLUMN — per-cent of the hall cleared, as geometry.
   ======================================================================= */
function drawGauge(pen,g,W,H,cleanF){
  const x0=W*params.gaugeX0, x1=W*params.gaugeX1, gw=x1-x0;
  const k=clamp(cleanF,0,1);
  // two seven-segment digits
  const pct=Math.max(0,Math.min(99,Math.round(k*99)));
  const dw=gw*0.40, dh=H*0.086, th=Math.max(9, dw*0.24), gap=gw*0.14, dy=H*0.086;
  segDigit(g, Math.floor(pct/10), x0, dy, dw, dh, th, inkLevel(7));
  segDigit(g, pct%10, x0+dw+gap, dy, dw, dh, th, inkLevel(7));
  // rung ladder
  const top=H*params.gaugeTop, bot=H*params.gaugeBot, n=params.rungs;
  const rowH=(bot-top)/n, barH=rowH*0.52, bx=x0+gw*0.11, bw=gw*0.64;
  for(let i=0;i<n;i++){
    const lvl=(i+0.5)/n;
    const y=bot-(i+1)*rowH+(rowH-barH)/2;
    if (lvl<=k) pen.paint(()=>{ rr(g,bx,y,bw,barH,barH*0.26); }, toneSolid(inkLevel(BAR)), 4);
    else        pen.ink(()=>{ rr(g,bx,y,bw,barH,barH*0.26); }, 3);
  }
  // broken rail
  pen.ink(()=>{ for(let i=0;i<n;i++){ const y=bot-(i+1)*rowH;
    g.moveTo(x0+gw*0.02, y+rowH*0.20); g.lineTo(x0+gw*0.02, y+rowH*0.80); } }, 3);
  // caret at the live level
  const cy=bot-k*(bot-top);
  pen.paint(()=>{ g.moveTo(x1,cy); g.lineTo(x1-gw*0.20, cy-gw*0.11);
                  g.lineTo(x1-gw*0.20, cy+gw*0.11); g.closePath(); },
            toneSolid(inkLevel(6)), 3.5);
}

/* =======================================================================
   DRAW
   ======================================================================= */
const FOCUS_LIFT = {   // grip-ring centres for the picked-up tool, 0..1 space
  bier:   { x:0.701, y:0.220, r:0.048 },   // ring the aft-near bearer grip
  jar:    { x:0.118, y:0.470, r:0.058 },
  bucket: { x:0.284, y:0.500, r:0.058 },
  sponge: { x:0.485, y:0.542, r:0.058 },
  scraper:{ x:0.556, y:0.400, r:0.050 },
  "hand-scraper": { x:0.735, y:0.500, r:0.045 },
};

function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t      = st.t ?? 0;
  const cleanF = clamp(st.clean ?? 0,0,1);
  const phase  = Math.max(0, Math.min(params.tiles-1, Math.round(st.phase ?? 0)));
  const fill   = clamp(st.fill ?? 1,0,1);
  const wet    = clamp(st.wet ?? 0,0,1);
  const focus  = st.focus || null;

  /* ---- floor line under the kit: broken dashes, never one bar ---- */
  const fy = H*params.floorY;
  pen.ink(()=>{ for(const [a,b] of [[0.048,0.212],[0.246,0.402],[0.436,0.582],[0.616,0.752]]){
    g.moveTo(W*a, fy); g.lineTo(W*b, fy); } }, 3.5);

  /* ---- kit, back to front ---- */
  drawBier(pen,g,W,H,st);
  drawJar(pen,g,W,H,fill);
  drawBucket(pen,g,W,H,fill,t);
  drawSponges(pen,g,W,H,wet,t);
  drawListron(pen,g,W,H);
  drawHandScraper(pen,g,W,H);

  /* ---- the cleaning transition strip + the gauge ---- */
  drawStrip(pen,g,W,H,phase,t);
  drawGauge(pen,g,W,H,cleanF);

  /* ---- ring the grip of the tool currently in hand ---- */
  if (focus && FOCUS_LIFT[focus]){
    const F=FOCUS_LIFT[focus];
    g.strokeStyle=INK; g.lineWidth=3.2; g.setLineDash([8,7]);
    g.beginPath(); g.ellipse(W*F.x, H*F.y, W*F.r, W*F.r, 0,0,7); g.stroke();
    g.setLineDash([]);
  }
}

export const asset = {
  id:"prop.body-removal-and-cleaning-tools",
  type:"PROP",
  name:"Body-Removal and Cleaning Tools",
  statusWord:"STOWED",
  scene:"OD-B22-S07",

  params,
  // back -> front draw order the module honors
  layers:["floor-line","bier-legs","bier-far-pole","bier-deck","bier-load",
          "bier-near-pole","bier-lashings","water-jar","bucket","sponges",
          "listron","hand-scraper","transition-strip","gauge","grip-ring"],

  // normalized 0..1 grip / support / contact / target stations
  anchors:{
    "grip:pole-fore-far": {x:.099,y:.152},   // four bearers, one per pole end
    "grip:pole-fore-near":{x:.187,y:.246},
    "grip:pole-aft-far":  {x:.613,y:.126},
    "grip:pole-aft-near": {x:.701,y:.220},
    "support:deck":       {x:.400,y:.186},   // where the wrapped load rides
    "grip:jar-handle":    {x:.176,y:.462},
    "grip:bucket-bail":   {x:.284,y:.464},
    "grip:sponge":        {x:.474,y:.542},
    "grip:sponge-dry":    {x:.400,y:.578},
    "grip:scraper":       {x:.556,y:.412},
    "grip:hand-scraper":  {x:.735,y:.500},
    "contact:floor":      {x:.400,y:.607},   // the kit stands here
    "target:pour":        {x:.452,y:.618},   // where a rinse stream lands
    "mark:stage":         {x:.500,y:.740},   // the live tile on the strip
    "gauge:read":         {x:.864,y:.128},
  },
  // collision / placement zones (AABB in 0..1)
  zones:{
    bounds:{ x0:.045, y0:.070, x1:.955, y1:.900 },
    bier:  { x0:.082, y0:.115, x1:.720, y1:.270 },
    kit:   { x0:.055, y0:.340, x1:.760, y1:.625 },
    strip: { x0:.058, y0:.660, x1:.942, y1:.900 },
  },
  ownership:{ owner:"household:odysseus", detail:"telemachus, eumaeus, philoetius, the serving women",
              portable:true, scaleM:params.scaleM, material:params.material },

  states:{
    initial:"stowed",
    nodes:{
      stowed:  { preview:{ load:0, lift:0, fill:1.00, wet:0,    clean:0.00, phase:0,
                           focus:null, status:"STOWED",   progress:.06 } },
      carrying:{ preview:{ load:1, lift:1, fill:1.00, wet:0,    clean:0.14, phase:0,
                           focus:"bier", status:"CARRYING", progress:.20 } },
      scraping:{ preview:{ load:0, lift:0, fill:0.86, wet:0.15, clean:0.38, phase:1,
                           focus:"scraper", status:"SCRAPING", progress:.40 } },
      sponging:{ preview:{ load:0, lift:0, fill:0.60, wet:1.00, clean:0.62, phase:2,
                           focus:"sponge", status:"SPONGING", progress:.62 } },
      rinsing: { preview:{ load:0, lift:0, fill:0.22, wet:0.80, clean:0.82, phase:3,
                           focus:"bucket", status:"RINSING",  progress:.82 } },
      cleaned: { preview:{ load:0, lift:0, fill:0.10, wet:0.25, clean:1.00, phase:4,
                           focus:null, status:"CLEANED",  progress:.99 } },
    },
    edges:[["stowed","carrying"],["carrying","stowed"],["carrying","carrying"],
           ["carrying","scraping"],["scraping","sponging"],["sponging","rinsing"],
           ["rinsing","cleaned"],["cleaned","stowed"],["sponging","sponging"],
           ["scraping","scraping"],["rinsing","sponging"]],
  },
  channels:["load","lift","fill","wet","clean","phase","focus","t"],

  preview:()=>({ load:0, lift:0, fill:0.86, wet:0.35, clean:0.46, phase:2,
                 focus:null, t:0, status:"CLEARING", progress:.46 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{});
    return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
