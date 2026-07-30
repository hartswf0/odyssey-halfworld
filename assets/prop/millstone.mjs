/* prop.millstone — the HAND QUERN of Book XX: a pair of dressed stones, a wide
   squared BEDSTONE standing on the floor and a round RUNNER seated in it, turned
   by a single oak peg handle planted out on the runner's rim, with barley fed
   through the central eye and meal squeezing from the joint, shedding off the
   bed's two corners and banking in drifts round the foot.
   PROP asset. This is the household mill the twelve women work through the
   night; eleven have finished, one is still turning when Zeus thunders.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B20-S02) — four states:
     GRIND   runner turning, three rotation arrows sweeping the rim, barley in
             the eye, meal squeezing from the joint and shedding at both corners
     SLOW    the turn dying: one short arrow, thin sheds, basket nearly out
     STOP    still. the peg released and upright, no arrows, the eye empty, all
             the meal settled in the drifts at the foot
     PRAYER-PAUSE  still, but caught mid-stroke: the last barley still in the
             eye, registration brackets on the abandoned grip, and the LISTEN
             mark — a rising chevron and three ticks above the stone — the
             moment the woman lifts her head at the thunder and speaks

   A RATE COLUMN on the right reads turns-per-minute as GEOMETRY (two
   seven-segment digits over a rung ladder with a caret), never as small type.
   Tone plan: dressed limestone is LIGHT so paper carries the frame — the wide
   bedstone is level 2, the smaller runner level 3, and the value step alone
   separates them. The dark is the hard contour, the eye (6) and the filled
   rungs (5). Meal is level 1 — almost bare paper — so it reads as flour, not as
   shadow. The two stones also differ in width, in silhouette (squared block vs
   round drum) and in flank texture (pecked stipple vs broken chisel courses),
   so the pair never collapses into one mass; the bedstone's base is undercut in
   the middle so its own foot is never one rule across the frame.
   Scale, grip/support/contact anchors, ownership and zones are declared in
   0..1 space. */
import { makePen, toneSolid, inkLevel, INK, PAPER, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  cx:0.355,          // quern axis (fraction of W)
  runnerTopY:0.318,  // top face of the runner stone (fraction of H)
  bedTopY:0.400,     // top face of the bedstone = the grinding joint
  groundY:0.532,     // floor line — the bedstone is squared off flat on it
  rxR:0.205,         // runner radius (fraction of W)
  rxB:0.262,         // bedstone radius (fraction of W) — a wide step out
  flat:0.340,        // ellipse flatten for every horizontal disc (ry = rx*flat)
  eyeR:0.072,        // central feed eye radius (fraction of W)
  pegH:0.152,        // handle peg height (fraction of H)
  gaugeX0:0.800,     // rate column
  gaugeX1:0.950,
  rungs:8,
  furrows:7,         // dressing furrows on the grinding face (plan view)
  diamCm:52,         // runner diameter, centimetres
  scaleM:0.52,
  material:"dressed limestone, oak peg handle",
  ownedBy:"palace-of-odysseus:mill room (twelve women)",
};

const STONE   = 3;   // dressed limestone — LIGHT
const STONE_D = 4;   // shaded flank of a drum
const CREST   = 2;   // lit upper face
const SHADE   = 5;   // the one dark crescent per drum, kept hard against the edge
const EYE     = 6;   // the feed hole — the deepest note in the frame
const WOOD    = 4;   // oak peg
const WOOD_D  = 5;   // worn grip band
const MEAL    = 1;   // ground meal — nearly paper
const BASKET  = 3;   // woven grain basket
const GRAIN   = 2;   // unground barley
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

/* ---------- an upright drum (a stone disc seen in perspective) ----------
   Silhouette first (one hard contour), then a single shaded crescent pinned to
   the right edge, then a flank texture. The two drums are given DIFFERENT
   textures — the runner gets short broken chisel courses, the bedstone gets a
   pecked stipple — so the pair never reads as one mass and neither one stripes.
   `tex`: "courses" | "pecked".                                             */
function drum(pen,g,cx,topY,botY,rx,ry,{ crest=true, tex="courses", dark=STONE_D, seed=7,
                                        flatBase=false, body=STONE }={}){
  const flank = ()=>{
    g.moveTo(cx-rx, topY);
    if (flatBase){
      // squared off — a dressed block that sits flat. The base is UNDERCUT in
      // the middle so the block bears on two feet: that jog breaks what would
      // otherwise be one long rule straight across the frame.
      const ch = Math.min(rx*0.10, (botY-topY)*0.22), fh = (botY-topY)*0.11;
      g.lineTo(cx-rx, botY-ch);   g.lineTo(cx-rx+ch, botY);
      g.lineTo(cx-rx*0.60, botY); g.lineTo(cx-rx*0.54, botY-fh);
      g.lineTo(cx+rx*0.54, botY-fh); g.lineTo(cx+rx*0.60, botY);
      g.lineTo(cx+rx-ch, botY);   g.lineTo(cx+rx, botY-ch);
    } else {
      g.lineTo(cx-rx, botY);
      g.ellipse(cx, botY, rx, ry, 0, Math.PI, 0, true); // front of the base
    }
    g.lineTo(cx+rx, topY);
    g.ellipse(cx, topY, rx, ry, 0, 0, Math.PI, true);   // back over the top rim
    g.closePath();
  };
  pen.paint(flank, toneSolid(inkLevel(body)), 6);

  g.save();
  g.beginPath(); flank(); g.clip();
  const hgt = botY-topY;
  // ONE crescent, hard against the right edge — the rest of the flank stays light
  g.fillStyle=inkLevel(dark);
  g.beginPath(); g.ellipse(cx+rx*1.06, topY+hgt*0.45, rx*0.26, hgt*0.98, 0,0,7); g.fill();
  g.fillStyle=inkLevel(Math.max(1,dark-2));
  g.beginPath(); g.ellipse(cx-rx*1.04, topY+hgt*0.50, rx*0.18, hgt*0.92, 0,0,7); g.fill();
  if (tex==="courses"){
    // two chisel courses, each cut into short runs — never one span
    g.strokeStyle=inkLevel(dark+1); g.lineWidth=2.8; g.lineCap="round";
    for(let i=0;i<2;i++){
      const yy = lerp(topY,botY,0.36+0.30*i);
      for(const [a,b] of [[-0.78,-0.34],[-0.08,0.28],[0.52,0.80]]){
        g.beginPath(); g.moveTo(cx+rx*a, yy); g.lineTo(cx+rx*b, yy+2); g.stroke();
      }
    }
  } else {
    // pecked stipple — the quarry face of the bedstone. Dots, so no stripes.
    const rnd = seeded(seed);
    g.fillStyle=inkLevel(dark);
    for(let i=0;i<52;i++){
      const px = cx + rx*(rnd()*2-1)*0.94;
      const py = lerp(topY+hgt*0.16, botY-hgt*0.10, rnd());
      g.beginPath(); g.arc(px,py, 1.6+rnd()*2.6, 0, 7); g.fill();
    }
    // a broken chamfer under the top edge, in two runs
    g.strokeStyle=inkLevel(dark+1); g.lineWidth=3.2; g.lineCap="round";
    g.beginPath(); g.moveTo(cx-rx*0.82, topY+hgt*0.14); g.lineTo(cx-rx*0.22, topY+hgt*0.175); g.stroke();
    g.beginPath(); g.moveTo(cx+rx*0.16, topY+hgt*0.175); g.lineTo(cx+rx*0.78, topY+hgt*0.14); g.stroke();
  }
  g.restore();

  if (crest){
    pen.paint(()=>{ g.ellipse(cx, topY, rx*0.98, ry*0.98, 0,0,7); },
              toneSolid(inkLevel(CREST)), 5);
  }
}

/* deterministic 0..1 from a seed — the pecked face must not flicker */
function seeded(seed){ let s=(seed>>>0)||1;
  return ()=>{ s^=s<<13; s^=s>>>17; s^=s<<5; return ((s>>>0)%100000)/100000; }; }

/* ---------- the runner's top face: shallow hopper funnel + the eye -------- */
function runnerFace(pen,g,W,H,cx,ty,rx,ry,feed,t){
  const er = W*params.eyeR, erY = er*params.flat;
  const ey = ty + ry*0.16;
  // funnel: one clean step down to the eye (light, so paper still shows)
  pen.paint(()=>{ g.ellipse(cx, ey, rx*0.54, ry*0.54, 0,0,7); },
            toneSolid(inkLevel(STONE_D)), 4.5);
  // the eye — the deepest hole in the plate
  pen.paint(()=>{ g.ellipse(cx, ey, er, erY, 0,0,7); },
            toneSolid(inkLevel(EYE)), 4.5);
  // barley standing in the eye + a few grains dropping in from a lifted hand
  if (feed>0.02){
    pen.paint(()=>{ g.ellipse(cx, ey-erY*0.30*feed, er*0.74, erY*0.70, 0,0,7); },
              toneSolid(inkLevel(GRAIN)), 4);
    pen.seam(()=>{
      for(let i=0;i<3;i++){
        const dx = cx - er*0.34 + er*0.34*i;
        g.moveTo(dx, ey-erY*0.60); g.lineTo(dx+er*0.10, ey-erY*0.18);
      }
    }, 2.6);
    pen.ink(()=>{
      for(let i=0;i<4;i++){
        const dx = cx - er*0.70 + er*0.46*i;
        const dy = ty - ry*(1.35 + 0.55*((i*3)%4)) - H*0.004*Math.sin(t+i);
        g.moveTo(dx,dy); g.lineTo(dx+W*0.005, dy+H*0.019);
      }
    }, 3.4);
  }
}

/* ---------- the oak peg handle standing at the runner's rim -------------- */
function pegAt(W,H,cx,ty,rx,ry,theta){
  // well OUT on the rim (0.86R) — a peg planted near the middle would collide
  // with the hopper funnel and read as a chimney instead of a crank
  return { x: cx + rx*0.86*Math.cos(theta), y: ty + ry*0.86*Math.sin(theta) };
}
function handle(pen,g,W,H,p,released,brackets){
  const bw = W*0.040, tw = W*0.028, hh = H*params.pegH;
  const lean = released ? 0 : -W*0.028;            // it leans into the stroke
  const topX = p.x + lean, topY = p.y - hh;
  // socket collar seated in the stone
  pen.paint(()=>{ g.ellipse(p.x, p.y, bw*1.05, bw*0.38, 0,0,7); },
            toneSolid(inkLevel(STONE_D)), 4);
  // tapered post
  pen.paint(()=>{
    g.moveTo(p.x-bw, p.y+bw*0.12);
    g.lineTo(topX-tw, topY);
    g.lineTo(topX+tw, topY);
    g.lineTo(p.x+bw, p.y+bw*0.12);
    g.closePath();
  }, toneSolid(inkLevel(WOOD)), 5.5);
  // worn grip band (where every hand has closed on it)
  const gy = lerp(p.y, topY, 0.58), gx = lerp(p.x, topX, 0.58);
  pen.paint(()=>{
    g.moveTo(gx-tw*1.26, gy); g.lineTo(gx+tw*1.26, gy-3);
    g.lineTo(gx+tw*1.18, gy+H*0.034); g.lineTo(gx-tw*1.18, gy+H*0.034+3); g.closePath();
  }, toneSolid(inkLevel(WOOD_D)), 4.5);
  // rounded head
  pen.paint(()=>{ g.ellipse(topX, topY, tw*1.28, tw*0.92, 0,0,7); },
            toneSolid(inkLevel(WOOD)), 5);
  pen.fillPath(()=>{ g.ellipse(topX-tw*0.30, topY-tw*0.20, tw*0.44, tw*0.30, 0,0,7); }, inkLevel(1));
  // grain of the oak — two short strokes, broken
  pen.seam(()=>{
    g.moveTo(p.x-bw*0.34, p.y-hh*0.10); g.lineTo(topX-tw*0.36, topY+hh*0.30);
    g.moveTo(p.x+bw*0.36, p.y-hh*0.32); g.lineTo(topX+tw*0.32, topY+hh*0.14);
  }, 2.8);
  // registration brackets: the grip the hands have just left
  if (brackets){
    const r = W*0.062, k = W*0.024, sx = gx, sy = gy + H*0.016;
    pen.ink(()=>{
      g.moveTo(sx-r, sy-r+k); g.lineTo(sx-r, sy-r); g.lineTo(sx-r+k, sy-r);
      g.moveTo(sx+r-k, sy-r); g.lineTo(sx+r, sy-r); g.lineTo(sx+r, sy-r+k);
      g.moveTo(sx+r, sy+r-k); g.lineTo(sx+r, sy+r); g.lineTo(sx+r-k, sy+r);
      g.moveTo(sx-r+k, sy+r); g.lineTo(sx-r, sy+r); g.lineTo(sx-r, sy+r-k);
    }, 4.5);
  }
}

/* ---------- meal squeezing out of the joint ----------------------------- */
function mealSkirt(pen,g,W,H,cx,jy,rx,ry,amount){
  if (amount<=0.02) return;
  // three separate lobes pushed out under the runner's rim — the meal being
  // made. Three, not a row: five reads as a band across the middle.
  for(const u of [0.20,0.50,0.80]){
    const a = Math.PI*u;
    const px = cx + rx*Math.cos(a), py = jy + ry*Math.sin(a);
    const s = 0.60 + 0.40*Math.sin(u*Math.PI);
    pen.paint(()=>{
      g.ellipse(px, py+H*0.008, W*0.034*s*(0.6+0.6*amount), H*0.014*s, 0, 0, 7);
    }, toneSolid(inkLevel(MEAL)), 3.5);
  }
}

/* ---------- meal shedding off the two corners of the joint --------------
   Only at the extreme left and right of the joint ellipse, curving OUTWARD as
   it falls, so nothing ever curtains down across the stone's face.        */
function mealShed(pen,g,W,H,cx,jy,rx,gY,fall){
  if (fall<=0.02) return;
  const land = gY - H*0.010;
  for(const s of [-1,1]){
    // start at the widest point of the bed's rim and swing straight OUT, so the
    // whole fall happens clear of the stone's silhouette
    const px = cx + s*rx, w0 = W*0.011*fall, w1 = W*0.024*fall;
    const lx = cx + s*rx*1.12;
    pen.paint(()=>{
      g.moveTo(px, jy);
      g.bezierCurveTo(px+s*w0*2, lerp(jy,land,0.42), lx-s*w1, lerp(jy,land,0.70), lx-s*w1, land);
      g.lineTo(lx+s*w1, land);
      g.bezierCurveTo(lx+s*w1, lerp(jy,land,0.70), px+s*w0*4, lerp(jy,land,0.42), px+s*w0*2.2, jy);
      g.closePath();
    }, toneSolid(inkLevel(MEAL)), 3.5);
  }
}

/* ---------- the meal already ground: a drift banked round the base ------ */
function mealDrift(pen,g,W,H,cx,gY,rx,heap){
  if (heap<=0.02) return;
  const y = gY - H*0.002;
  const w = rx*(0.72+0.16*heap), h = H*(0.010+0.024*heap);
  // three SEPARATED piles with clear paper between them — a drift, not a bar,
  // and never wider than the stone that made it
  for(const [u,s] of [[-0.86,0.92],[0.00,1.00],[0.86,0.86]]){
    const px = cx + w*u, lw = w*0.34*s;
    pen.paint(()=>{
      g.moveTo(px-lw, y+h*0.24);
      g.quadraticCurveTo(px-lw*0.52, y-h*1.30*s, px-lw*0.04, y-h*0.86*s);
      g.quadraticCurveTo(px+lw*0.44, y-h*1.42*s, px+lw*0.82, y-h*0.36*s);
      g.quadraticCurveTo(px+lw*1.02, y-h*0.10, px+lw, y+h*0.24);
      g.closePath();
    }, toneSolid(inkLevel(MEAL)), 4);
    pen.seam(()=>{
      g.moveTo(px-lw*0.44, y-h*0.28*s); g.lineTo(px-lw*0.06, y-h*0.54*s);
    }, 2.6);
  }
}

/* ---------- the barley basket standing clear to the right, set back ------ */
function grainBasket(pen,g,W,H,level){
  const bwd = W*0.038;
  const bx = W*0.718, top = H*0.408, bot = H*params.groundY - bwd*0.34;
  const tw = W*0.060;
  const body = ()=>{
    g.moveTo(bx-tw, top); g.lineTo(bx-bwd, bot);
    g.ellipse(bx, bot, bwd, bwd*0.34, 0, Math.PI, 0, true);
    g.lineTo(bx+tw, top);
    g.ellipse(bx, top, tw, tw*0.34, 0, 0, Math.PI, true);
    g.closePath();
  };
  pen.paint(body, toneSolid(inkLevel(BASKET)), 5);
  // weave courses — three short broken runs each
  g.save(); g.beginPath(); body(); g.clip();
  g.fillStyle=inkLevel(BASKET+1);
  g.beginPath(); g.ellipse(bx+tw*0.98, (top+bot)/2, tw*0.28, (bot-top)*0.8, 0,0,7); g.fill();
  g.strokeStyle=inkLevel(BASKET+2); g.lineWidth=2.6; g.lineCap="round";
  for(let i=1;i<=4;i++){
    const yy = lerp(top,bot,i/5), hw = lerp(tw,bwd,i/5);
    for(const [a,b] of [[-0.90,-0.30],[-0.06,0.40],[0.62,0.92]]){
      g.beginPath(); g.moveTo(bx+hw*a, yy); g.lineTo(bx+hw*b, yy+2); g.stroke();
    }
  }
  g.restore();
  // mouth + the barley standing in it
  pen.paint(()=>{ g.ellipse(bx, top, tw*0.94, tw*0.32, 0,0,7); },
            toneSolid(inkLevel(EYE-1)), 4.5);
  if (level>0.04){
    pen.paint(()=>{
      g.ellipse(bx, top + tw*0.26*(1-level), tw*0.76*(0.5+0.5*level), tw*0.24*(0.5+0.5*level), 0,0,7);
    }, toneSolid(inkLevel(GRAIN)), 4);
  }
}

/* ---------- rotation arrows sweeping the rim (grind / slow) ------------- */
function rotationArrows(pen,g,W,H,cx,ty,rx,ry,rate,theta){
  if (rate<=0.02) return;
  // fixed stations in the clear air ABOVE the stone, so an arrow is never
  // buried in the flank: upper-left, over the back, upper-right
  const seats = rate>0.55 ? [1.13,1.50,1.87] : [1.50];
  const AR = 1.16, VE = 1.85;               // just outside the rim, exaggerated
  for(const u of seats){
    const a0 = Math.PI*u + theta*0.06;
    const a1 = a0 + 0.40 + 0.26*rate;
    pen.ink(()=>{ g.ellipse(cx, ty, rx*AR, ry*AR*VE, 0, a0, a1, false); }, 6);
    const hx = cx + rx*AR*Math.cos(a1), hy = ty + ry*AR*VE*Math.sin(a1);
    const tx = -rx*AR*Math.sin(a1), tyv = ry*AR*VE*Math.cos(a1);
    const m = Math.hypot(tx,tyv)||1, ux=tx/m, uy=tyv/m, nx=-uy, ny=ux;
    const L = W*0.040, Wd = W*0.018;
    pen.paint(()=>{
      g.moveTo(hx+ux*L, hy+uy*L);
      g.lineTo(hx-nx*Wd, hy-ny*Wd);
      g.lineTo(hx+nx*Wd, hy+ny*Wd);
      g.closePath();
    }, toneSolid(inkLevel(6)), 3.5);
  }
}

/* ---------- the LISTEN mark: the head lifting at the thunder ------------ */
function listenMark(pen,g,W,H,cx,ty,rx){
  const mx = cx + rx*1.02, my = ty - H*0.128;
  pen.ink(()=>{
    g.moveTo(mx-W*0.058, my+H*0.034); g.lineTo(mx, my); g.lineTo(mx+W*0.058, my+H*0.034);
  }, 6);
  pen.ink(()=>{
    for(let i=0;i<3;i++){
      const dx = mx - W*0.042 + W*0.042*i, dy = my - H*0.022 - H*0.016*i;
      g.moveTo(dx, dy); g.lineTo(dx+W*0.012, dy-H*0.028);
    }
  }, 5);
}

/* =======================================================================
   THE RATE COLUMN (world space, right margin) — turns per minute as bars
   ======================================================================= */
function rateColumn(pen,g,W,H,rate){
  const x0=W*params.gaugeX0, x1=W*params.gaugeX1, gw=x1-x0;
  const rpm = Math.max(0, Math.min(99, Math.round(rate*26)));
  const dw = gw*0.40, dh = H*0.082, th = Math.max(8, dw*0.24), gap = gw*0.14;
  const dy = H*0.078;
  segDigit(g, Math.floor(rpm/10), x0, dy, dw, dh, th, inkLevel(7));
  segDigit(g, rpm%10, x0+dw+gap, dy, dw, dh, th, inkLevel(7));

  const top=H*0.215, bot=H*0.585, n=params.rungs;
  const rowH=(bot-top)/n, barH=rowH*0.50, bx=x0+gw*0.10, bw=gw*0.66;
  for(let i=0;i<n;i++){
    const lvl=(i+0.5)/n;
    const y = bot - (i+1)*rowH + (rowH-barH)/2;
    if (lvl<=clamp(rate,0,1)){
      pen.paint(()=>{ g.rect(bx,y,bw,barH); }, toneSolid(inkLevel(BAR)), 4);
    } else {
      pen.ink(()=>{ g.rect(bx,y,bw,barH); }, 3);
    }
  }
  pen.ink(()=>{
    for(let i=0;i<n;i++){ const y=bot-(i+1)*rowH;
      g.moveTo(x0+gw*0.02, y+rowH*0.20); g.lineTo(x0+gw*0.02, y+rowH*0.80); }
  }, 3);
  const cy = bot - clamp(rate,0,1)*(bot-top);
  pen.paint(()=>{
    g.moveTo(x1, cy); g.lineTo(x1-gw*0.20, cy-gw*0.11); g.lineTo(x1-gw*0.20, cy+gw*0.11); g.closePath();
  }, toneSolid(inkLevel(6)), 3.5);
}

/* =======================================================================
   KEY PLATE — the orthographic key under the elevation: a PLAN of the
   dressed grinding face (eye, handle socket, furrows) with a dimensioned
   diameter, and a SECTION through both stones carrying the meal path.
   Numerals are seven-segment geometry, never type.
   ======================================================================= */
function keyPlate(pen,g,W,H,theta,rate){
  /* ---- PLAN of the runner, seen from below (the dressed face) ---- */
  const px=W*0.185, py=H*0.770, R=W*0.104;
  pen.paint(()=>{ g.ellipse(px,py,R,R,0,0,7); }, toneSolid(inkLevel(STONE)), 6);
  pen.seam(()=>{ g.ellipse(px,py,R*0.90,R*0.90,0,0,7); }, 3);
  // dressing furrows: chords struck off-radial — the harp that does the cutting
  pen.ink(()=>{
    for(let i=0;i<params.furrows;i++){
      const a = (i/params.furrows)*Math.PI*2;
      const b = a + 0.70;
      g.moveTo(px+Math.cos(a)*R*0.30, py+Math.sin(a)*R*0.30);
      g.lineTo(px+Math.cos(b)*R*0.88, py+Math.sin(b)*R*0.88);
    }
  }, 4.5);
  // the eye, punched through — paper shows, so it reads as a hole
  pen.fillPath(()=>{ g.ellipse(px,py,R*0.26,R*0.26,0,0,7); }, PAPER);
  pen.ink(()=>{ g.ellipse(px,py,R*0.26,R*0.26,0,0,7); }, 5);
  // the handle socket near the rim, at the live handle angle
  const sx = px+Math.cos(theta)*R*0.72, sy = py+Math.sin(theta)*R*0.72;
  pen.fillPath(()=>{ g.ellipse(sx,sy,R*0.135,R*0.135,0,0,7); }, PAPER);
  pen.ink(()=>{ g.ellipse(sx,sy,R*0.135,R*0.135,0,0,7); }, 5);
  // broken centre cross
  pen.ink(()=>{
    g.moveTo(px-R*1.22,py); g.lineTo(px-R*0.44,py);
    g.moveTo(px+R*0.44,py); g.lineTo(px+R*1.22,py);
    g.moveTo(px,py-R*1.22); g.lineTo(px,py-R*0.44);
    g.moveTo(px,py+R*0.44); g.lineTo(px,py+R*1.22);
  }, 3.5);
  /* ---- diameter dimension under the plan ---- */
  const dy=H*0.906, x0=px-R, x1=px+R;
  pen.ink(()=>{
    g.moveTo(x0,dy-H*0.013); g.lineTo(x0,dy+H*0.013);
    g.moveTo(x1,dy-H*0.013); g.lineTo(x1,dy+H*0.013);
    g.moveTo(x0,dy); g.lineTo(x1,dy);
  }, 4);
  const nw=W*0.038, nh=H*0.050, nt=Math.max(8,nw*0.24), nx=x1+W*0.040;
  segDigit(g, Math.floor(params.diamCm/10), nx, dy-nh*0.52, nw, nh, nt, inkLevel(7));
  segDigit(g, params.diamCm%10, nx+nw*1.36, dy-nh*0.52, nw, nh, nt, inkLevel(7));

  /* ---- SECTION through the pair ---- */
  const scx=W*0.660, ty=H*0.716, hw=W*0.152;
  const rt=H*0.040, bt=H*0.036, gapY=H*0.007, er=hw*0.15;
  const jy = ty+rt;                       // the grinding joint
  // upper stone, cut either side of the funnel eye
  const upper = (s)=>()=>{
    g.moveTo(scx+s*hw, ty);
    g.lineTo(scx+s*er*2.0, ty);
    g.lineTo(scx+s*er, jy);
    g.lineTo(scx+s*hw, jy);
    g.closePath();
  };
  pen.paint(upper(-1), toneSolid(inkLevel(STONE)), 5);
  pen.paint(upper( 1), toneSolid(inkLevel(STONE)), 5);
  // lower stone
  pen.paint(()=>{
    g.moveTo(scx-hw, jy+gapY); g.lineTo(scx+hw, jy+gapY);
    g.lineTo(scx+hw*0.84, jy+gapY+bt); g.lineTo(scx-hw*0.84, jy+gapY+bt); g.closePath();
  }, toneSolid(inkLevel(STONE)), 5);
  // hatch ticks in both cut stones (short, sparse)
  pen.ink(()=>{
    for(let i=0;i<4;i++){
      const u=(i+1)/5;
      const ax=scx-hw*0.92+hw*0.55*u, ay=ty+rt*0.28;
      g.moveTo(ax,ay); g.lineTo(ax+W*0.012, ay+H*0.012);
      const bx2=scx+hw*0.28+hw*0.56*u, by2=jy+gapY+bt*0.30;
      g.moveTo(bx2,by2); g.lineTo(bx2+W*0.012, by2+H*0.012);
    }
  }, 2.8);
  // the meal path: dashes running out along the joint to both rims
  pen.ink(()=>{
    for(const s of [-1,1]) for(let i=0;i<3;i++){
      const a=scx+s*(hw*0.30+i*hw*0.22), b=a+s*hw*0.14;
      g.moveTo(a, jy+gapY*0.5); g.lineTo(b, jy+gapY*0.5);
    }
  }, 3.5);
  // meal shed at each rim — light wedges
  for(const s of [-1,1]){
    pen.paint(()=>{
      g.moveTo(scx+s*hw, jy+gapY*0.2);
      g.lineTo(scx+s*hw*1.22, jy+gapY+bt*0.95);
      g.lineTo(scx+s*hw*0.92, jy+gapY+bt*0.95); g.closePath();
    }, toneSolid(inkLevel(MEAL)), 4);
  }
  // the handle socket, blind-drilled into the upper stone
  pen.ink(()=>{
    g.moveTo(scx+hw*0.62, ty); g.lineTo(scx+hw*0.62, ty+rt*0.60);
    g.lineTo(scx+hw*0.78, ty+rt*0.60); g.lineTo(scx+hw*0.78, ty);
  }, 4);
  // a segmented rate scale under the section, filled to the live rate
  const scY = jy+gapY+bt+H*0.030, segs=6, segW=hw*1.9/segs;
  for(let i=0;i<segs;i++){
    const a = scx-hw + i*segW + segW*0.12, w = segW*0.76;
    if ((i+0.5)/segs <= clamp(rate,0,1)) pen.paint(()=>{ g.rect(a, scY, w, H*0.011); }, toneSolid(inkLevel(BAR)), 3);
    else pen.ink(()=>{ g.rect(a, scY, w, H*0.011); }, 2.6);
  }
}

/* =======================================================================
   DRAW
   ======================================================================= */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const theta  = st.theta  ?? 0.62;   // handle angle on the rim, rad
  const rate   = st.rate   ?? 1;      // turning rate 0..1
  const feed   = st.feed   ?? 1;      // barley standing in the eye
  const meal   = st.meal   ?? 1;      // meal squeezing from the joint
  const fall   = st.fall   ?? 1;      // meal shedding to the board
  const heap   = st.heap   ?? 0.4;    // meal already ground, on the board
  const basket = st.basket ?? 0.8;    // barley left in the basket
  const listen = st.listen ?? 0;      // the LISTEN mark (prayer-pause)
  const t      = st.t      ?? 0;

  const cx  = W*params.cx;
  const rTY = H*params.runnerTopY, bTY = H*params.bedTopY;
  const gY  = H*params.groundY;
  const rxR = W*params.rxR, ryR = rxR*params.flat;
  const rxB = W*params.rxB, ryB = rxB*params.flat;

  /* ---- floor: two short ticks well clear of the stone, so the block's own
     base edge is never extended into one rule across the frame ---- */
  pen.ink(()=>{ g.moveTo(W*0.664,gY); g.lineTo(W*0.716,gY); }, 3.5);

  /* ---- the barley basket, standing clear to the left ---- */
  grainBasket(pen,g,W,H,basket);

  /* ---- the two stones: a wide squared bedstone, a narrower round runner ---- */
  drum(pen,g,cx,bTY,gY,rxB,ryB, { crest:false, tex:"pecked", dark:STONE_D, seed:23,
                                  flatBase:true, body:CREST });

  // the peg goes BEHIND the runner when it stands on the far side of the axis
  const p = pegAt(W,H,cx,rTY,rxR,ryR,theta);
  const inFront = Math.sin(theta) >= 0;
  if (!inFront) handle(pen,g,W,H,p,rate<0.05,listen>0.5);

  drum(pen,g,cx,rTY,bTY,rxR,ryR, { crest:true, tex:"courses", dark:SHADE, seed:41,
                                   body:STONE });
  runnerFace(pen,g,W,H,cx,rTY,rxR,ryR,feed,t);

  /* ---- the bed's top rim, front arc only: a hard seam, broken clear of the
     silhouette corners so it never reads as a rule across the frame ---- */
  pen.ink(()=>{ g.ellipse(cx, bTY, rxB*0.99, ryB*0.99, 0, 0.22, Math.PI-0.22, false); }, 4.5);

  /* ---- meal: out of the joint (the RUNNER's rim, where the stones meet),
     off the bed's corners, and banked round the base ---- */
  mealSkirt(pen,g,W,H,cx,bTY,rxR,ryR,meal);
  mealShed (pen,g,W,H,cx,bTY,rxB,gY,fall);
  mealDrift(pen,g,W,H,cx,gY,rxB,heap);

  if (inFront) handle(pen,g,W,H,p,rate<0.05,listen>0.5);

  /* ---- rotation arrows / the listen mark ---- */
  rotationArrows(pen,g,W,H,cx,rTY,rxR,ryR,rate,theta);
  if (listen>0.5) listenMark(pen,g,W,H,cx,rTY,rxR);

  /* ---- the rate column + the orthographic key plate ---- */
  rateColumn(pen,g,W,H,rate);
  keyPlate(pen,g,W,H,theta,rate);
}

export const asset = {
  id:"prop.millstone",
  type:"PROP",
  name:"Millstone",
  statusWord:"GRINDING",
  scene:"OD-B20-S02",

  params,
  layers:["floor","grain-basket","bedstone","handle-far","runner","runner-face",
          "eye","joint-seam","meal-skirt","meal-shed","meal-drift","handle-near",
          "rotation-arrows","listen-mark","rate-column","key-plate"],

  // normalized 0..1 grip / support / contact / target stations
  anchors:{
    "grip:handle":{x:.482,y:.256},     // the oak peg where a hand closes
    "socket:handle":{x:.499,y:.344},   // the peg's socket, out on the runner rim
    "eye:feed":{x:.355,y:.326},        // the central eye barley is poured into
    "top:runner":{x:.355,y:.318},      // crown of the upper stone
    "face:grind":{x:.355,y:.400},      // the joint plane between the stones
    "rim:meal":{x:.189,y:.431},        // where meal squeezes out at the joint
    "shed:left":{x:.062,y:.522},       // meal falling off the left corner
    "shed:right":{x:.648,y:.522},      // meal falling off the right corner
    "drift:meal":{x:.355,y:.522},      // the ground meal banked round the base
    "contact:floor":{x:.355,y:.532},   // the bedstone on the mill-room floor
    "seat:worker":{x:.520,y:.545},     // where the woman kneels to turn it
    "source:grain":{x:.718,y:.408},    // the barley basket mouth
    "mark:listen":{x:.564,y:.190},     // the LISTEN station (head lifting)
    "gauge:read":{x:.874,y:.119},      // turns-per-minute readout
  },
  // collision / placement zones (AABB in 0..1)
  zones:{
    bounds:{ x0:.030, y0:.185, x1:.960, y1:.545 },
    stone:{  x0:.093, y0:.318, x1:.617, y1:.532 },
    work:{   x0:.045, y0:.470, x1:.700, y1:.545 },
    drift:{  x0:.040, y0:.495, x1:.670, y1:.538 },
  },
  ownership:{ owner:"palace-of-odysseus", household:"mill room", portable:false,
              turnedBy:"mill-woman", scaleM:params.scaleM, material:params.material },

  states:{
    initial:"stop",
    nodes:{
      grind:  { preview:{ theta:0.62, rate:1.00, feed:1.0,  meal:1.0,  fall:1.0,
                          heap:0.40, basket:0.85, listen:0,
                          status:"GRINDING", progress:.34 } },
      slow:   { preview:{ theta:2.32, rate:0.34, feed:0.45, meal:0.55, fall:0.40,
                          heap:0.72, basket:0.35, listen:0,
                          status:"SLOWING",  progress:.62 } },
      stop:   { preview:{ theta:1.62, rate:0.00, feed:0.0,  meal:0.30, fall:0.0,
                          heap:0.95, basket:0.10, listen:0,
                          status:"STOPPED",  progress:.90 } },
      "prayer-pause":
              { preview:{ theta:1.05, rate:0.00, feed:0.25, meal:0.45, fall:0.0,
                          heap:0.88, basket:0.16, listen:1,
                          status:"PRAYING",  progress:.78 } },
    },
    edges:[["grind","slow"],["slow","grind"],["slow","stop"],["stop","grind"],
           ["slow","prayer-pause"],["grind","prayer-pause"],
           ["prayer-pause","grind"],["prayer-pause","stop"],["stop","prayer-pause"]],
  },
  channels:["theta","rate","feed","meal","fall","heap","basket","listen","t"],

  preview:()=>({ theta:0.62, rate:1.00, feed:1.0, meal:1.0, fall:1.0,
                 heap:0.40, basket:0.85, listen:0, t:0,
                 status:"GRINDING", progress:.34 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
