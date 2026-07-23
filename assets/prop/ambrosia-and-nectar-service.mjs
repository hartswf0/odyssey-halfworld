/* prop.ambrosia-and-nectar-service — the divine hospitality service: a low
   footed TRAY bearing three vessels — a shallow AMBROSIA DISH heaped with the
   food of the gods, a small golden NECTAR EWER, and a stemmed NECTAR CUP — the
   whole set faintly self-luminous (a soft divine glow behind it).
   PROP asset. Drawn in SOLID grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone. Do NOT pre-dither.
   Scene function (OD-B05-S02): a reusable divine-hospitality object with four
   states — SET (arranged on the tray, dish heaped, cup empty, ewer upright,
   glow up), POUR (ewer lifted + tipped over the cup, nectar streaming, cup
   filling), DRINK (cup raised + tilted toward the guest, ewer back at rest),
   CLEAR (service taken away: vessels emptied, glow gone, everything dimmed).
   The gold ewer is a mid metal; the silver dish + cup are a light metal — the
   tonal contrast separates the vessels in monochrome, and the ambrosia mound /
   nectar surface are the brightest tones (near paper) so the divine food reads.
   Scale, grip/support/contact anchors, ownership and collision box in 0..1. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  trayTopY:0.640,    // back edge of the tray surface (fraction of H)
  trayDepth:0.052,   // perspective depth of the tray surface
  trayThick:0.034,   // front-rim thickness
  trayHalfBack:0.360,// tray half-width at the back edge (fraction of W)
  trayHalfFront:0.410,
  dishRw:0.135,      // ambrosia dish rim half-width (fraction of W)
  ewerH:0.205,       // nectar ewer height (fraction of H)
  cupW:0.150,        // nectar cup outer width (fraction of W)
  ownedBy:"gods:olympian-hospitality",
};

const TRAY   = 3;    // tray surface (light metal)
const TRAY_D = 5;    // tray front rim (shadow band)
const TRAY_E = 4;    // tray surface edge seam
const SILV   = 3;    // dish + cup body (light metal)
const SILV_D = 5;    // dish + cup dark hollow interior
const GOLD   = 4;    // ewer body (mid metal, gold)
const GOLD_D = 5;    // ewer foot / lip
const FOOD   = 2;    // ambrosia mound (bright, faintly glowing)
const FOOD_H = 1;    // ambrosia highlight cap (near paper)
const NECT   = 2;    // nectar surface (bright)
const GLOWT  = 1;    // divine glow field (lightest)

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

/* ------------------------------------------------------------------
   THE TRAY — a low footed platter drawn as a perspective trapezoid top
   surface plus a front rim band. Vessels rest on the surface baseline. */
function drawTray(pen,g,W,H,cx,topY,dim){
  const hb = W*params.trayHalfBack, hf = W*params.trayHalfFront;
  const depth = H*params.trayDepth, thick = H*params.trayThick;
  // top surface (trapezoid; back edge narrower for depth)
  pen.paint(()=>{
    g.moveTo(cx-hb, topY);
    g.lineTo(cx+hb, topY);
    g.lineTo(cx+hf, topY+depth);
    g.lineTo(cx-hf, topY+depth);
    g.closePath();
  }, toneSolid(inkLevel(dim?TRAY-1:TRAY)), 5);
  // back rim lip (thin light band along the far edge)
  pen.paint(()=>{ g.ellipse(cx, topY, hb, depth*0.28, 0, Math.PI, 0, true); }, toneSolid(inkLevel(TRAY_E)), 4);
  // front rim band (darker, gives the tray thickness)
  pen.paint(()=>{
    g.moveTo(cx-hf, topY+depth);
    g.lineTo(cx+hf, topY+depth);
    g.lineTo(cx+hf*0.96, topY+depth+thick);
    g.lineTo(cx-hf*0.96, topY+depth+thick);
    g.closePath();
  }, toneSolid(inkLevel(dim?TRAY_D-1:TRAY_D)), 5);
  // surface seam so the top plane reads distinct from the rim
  pen.seam(()=>{ g.moveTo(cx-hf,topY+depth); g.lineTo(cx+hf,topY+depth); }, 3);
  // two short feet peeking below the front rim
  const fy=topY+depth+thick;
  pen.paint(()=>{ rr(g, cx-hf*0.72, fy-1, W*0.05, thick*0.7, 4); }, toneSolid(inkLevel(TRAY_D)), 4);
  pen.paint(()=>{ rr(g, cx+hf*0.72-W*0.05, fy-1, W*0.05, thick*0.7, 4); }, toneSolid(inkLevel(TRAY_D)), 4);
}

/* ------------------------------------------------------------------
   THE AMBROSIA DISH — a wide shallow footed bowl; food>0 heaps a glowing
   mound of ambrosia. Contact (foot) sits on baseY. */
function drawDish(pen,g,W,H,cx,baseY,food,dim){
  const rw = W*params.dishRw, rh = rw*0.32;      // wide flat rim ellipse
  const footHW = rw*0.40, footH = rh*0.9;
  const bowlBottomY = baseY - footH;
  const bowlDepth = rh*1.0;                        // SHALLOW dish
  const cy = bowlBottomY - bowlDepth;             // rim centre

  // ---- foot (short trumpet pedestal) ----
  pen.paint(()=>{
    g.moveTo(cx-rw*0.24, bowlBottomY);
    g.lineTo(cx+rw*0.24, bowlBottomY);
    g.lineTo(cx+footHW,  baseY);
    g.lineTo(cx-footHW,  baseY);
    g.closePath();
  }, toneSolid(inkLevel(dim?SILV:SILV+1)), 5);
  pen.paint(()=>{ g.ellipse(cx, baseY, footHW*0.92, rh*0.5, 0,0,7); }, toneSolid(inkLevel(dim?SILV-1:SILV)), 4);

  // ---- bowl exterior (shallow open saucer beneath the rim) ----
  pen.paint(()=>{
    g.moveTo(cx-rw, cy);
    g.quadraticCurveTo(cx-rw*0.62, cy+bowlDepth*1.35, cx, bowlBottomY);
    g.quadraticCurveTo(cx+rw*0.62, cy+bowlDepth*1.35, cx+rw, cy);
    g.ellipse(cx, cy, rw, rh, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(dim?SILV-1:SILV)), 6);

  // ---- dark hollow interior (the open mouth) ----
  pen.paint(()=>{ g.ellipse(cx, cy, rw, rh, 0,0,7); }, toneSolid(inkLevel(SILV_D)), 4);

  // ---- ambrosia mound (glowing food; a bright dome heaped in the dish) ----
  if (food>0.02){
    const mr = rw*lerp(0.5,0.9,food);
    // dome sitting in the mouth, rising above the near rim
    pen.paint(()=>{
      g.moveTo(cx-mr, cy+rh*0.15);
      g.bezierCurveTo(cx-mr*0.7, cy-rh*2.0*food-rh*0.6, cx+mr*0.7, cy-rh*2.0*food-rh*0.6, cx+mr, cy+rh*0.15);
      g.ellipse(cx, cy+rh*0.15, mr, rh*0.7, 0, 0, Math.PI, true);
      g.closePath();
    }, toneSolid(inkLevel(FOOD)), 4);
    // bright crown highlight
    pen.fillPath(()=>{ g.ellipse(cx-mr*0.1, cy-rh*0.9*food, mr*0.5, mr*0.34, 0,0,7); }, inkLevel(FOOD_H));
    // sparkle ticks rising off the mound (the divine shimmer)
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
    for(let k=-2;k<=2;k++){
      const sx=cx+k*mr*0.30, sy=cy-rh*1.5*food-rh*0.4-Math.abs(k)*rh*0.15;
      g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx, sy-rh*0.6); g.stroke();
    }
  }
  // near-rim lip highlight so the silver saucer edge reads
  pen.paint(()=>{ g.ellipse(cx, cy, rw, rh, 0, 0.06, Math.PI-0.06); }, toneSolid(inkLevel(SILV-1)), 3);
  return { rim:{x:cx,y:cy}, waterY:cy };
}

/* ------------------------------------------------------------------
   THE NECTAR EWER — a small golden jug drawn in a LOCAL frame (base at
   origin, up = -y) so the caller can translate + rotate it to pour. */
function ewerGeom(h){
  const w = h*0.60;
  return { h, w,
    bodyCy:-h*0.40, bodyRx:w*0.5, bodyRy:h*0.30,
    footHalfBot:w*0.34, footHalfTop:w*0.24, footTop:-h*0.055,
    neckY:-h*0.66, neckHalf:w*0.20,
    lipY:-h*0.80, lipHalf:w*0.25,
    spout:{ x:w*0.62, y:-h*0.79 },
    handle:{ top:{x:-w*0.32,y:-h*0.64}, bot:{x:-w*0.28,y:-h*0.22} },
    grip:{ x:-w*0.94, y:-h*0.44 },
  };
}
function drawEwer(pen,g,h,dim){
  const G = ewerGeom(h);
  const gd = dim?GOLD-1:GOLD, gdd = dim?GOLD_D-1:GOLD_D;
  // handle (behind the body -> a paper loop opens)
  pen.limb(()=>{
    g.moveTo(G.handle.top.x, G.handle.top.y);
    g.quadraticCurveTo(G.grip.x, (G.handle.top.y+G.handle.bot.y)/2, G.handle.bot.x, G.handle.bot.y);
  }, toneSolid(inkLevel(gd)), h*0.052);
  // foot
  pen.paint(()=>{
    g.moveTo(-G.footHalfBot, 0); g.lineTo(G.footHalfBot, 0);
    g.lineTo(G.footHalfTop, G.footTop); g.lineTo(-G.footHalfTop, G.footTop); g.closePath();
  }, toneSolid(inkLevel(gdd)), 5);
  // body
  pen.paint(()=>{ g.ellipse(0, G.bodyCy, G.bodyRx, G.bodyRy, 0,0,7); }, toneSolid(inkLevel(gd)), 6);
  // neck
  pen.paint(()=>{
    g.moveTo(-G.bodyRx*0.5, G.bodyCy-G.bodyRy*0.72); g.lineTo(G.bodyRx*0.5, G.bodyCy-G.bodyRy*0.72);
    g.lineTo(G.neckHalf, G.neckY); g.lineTo(-G.neckHalf, G.neckY); g.closePath();
  }, toneSolid(inkLevel(gd)), 5);
  // lip + spout beak (to +x)
  pen.paint(()=>{
    g.moveTo(-G.neckHalf, G.neckY);
    g.lineTo(-G.lipHalf, G.lipY);
    g.lineTo(G.lipHalf*0.45, G.lipY-h*0.015);
    g.lineTo(G.spout.x, G.spout.y);
    g.lineTo(G.lipHalf*0.30, G.lipY+h*0.05);
    g.lineTo(G.neckHalf, G.neckY); g.closePath();
  }, toneSolid(inkLevel(gdd)), 5);
  pen.seam(()=>{ g.moveTo(G.lipHalf*0.35, G.lipY); g.lineTo(G.spout.x*0.92, G.spout.y+h*0.015); }, 2.5);
  // girdle bands + highlight
  for(let i=1;i<=2;i++){
    const yy=G.bodyCy+G.bodyRy*(-0.4+i/3*1.3);
    const hw=G.bodyRx*Math.sqrt(Math.max(0,1-Math.pow((yy-G.bodyCy)/G.bodyRy,2)))*0.92;
    pen.seam(()=>{ g.moveTo(-hw,yy); g.lineTo(hw,yy); }, 2.5);
  }
  pen.seam(()=>{ g.moveTo(-G.bodyRx*0.34, G.bodyCy-G.bodyRy*0.5); g.lineTo(-G.bodyRx*0.4, G.bodyCy+G.bodyRy*0.45); }, 2.5);
  return G;
}

/* ------------------------------------------------------------------
   THE NECTAR CUP — a small stemmed kylix drawn in a LOCAL frame (base at
   origin, up = -y). fill>0 raises a bright nectar surface inside. */
function cupGeom(cw){
  const rw=cw*0.5, rh=rw*0.36;
  return { rw, rh, footHW:cw*0.32, stemTop:-cw*0.26, rimY:-cw*0.66,
           handleY:-cw*0.60 };
}
function drawCup(pen,g,cw,fill,dim){
  const C = cupGeom(cw);
  const bd = dim?SILV-1:SILV;
  // foot disc
  pen.paint(()=>{ g.ellipse(0, 0, C.footHW, C.footHW*0.34, 0,0,7); }, toneSolid(inkLevel(bd+1)), 4);
  // stem
  pen.paint(()=>{ g.rect(-cw*0.055, C.stemTop, cw*0.11, -C.stemTop); }, toneSolid(inkLevel(bd)), 4);
  // small loop handles at the bowl sides (behind the bowl)
  for(const s of [-1,1]){
    pen.limb(()=>{
      g.moveTo(s*C.rw*0.86, C.handleY);
      g.quadraticCurveTo(s*(C.rw+cw*0.16), C.handleY+cw*0.02, s*C.rw*0.86, C.handleY+cw*0.14);
    }, toneSolid(inkLevel(bd)), cw*0.032);
  }
  // bowl exterior (shallow)
  pen.paint(()=>{
    g.moveTo(-C.rw, C.rimY);
    g.quadraticCurveTo(-C.rw*0.6, (C.rimY+C.stemTop)*0.5, 0, C.stemTop);
    g.quadraticCurveTo(C.rw*0.6, (C.rimY+C.stemTop)*0.5, C.rw, C.rimY);
    g.ellipse(0, C.rimY, C.rw, C.rh, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(bd)), 6);
  // dark hollow interior
  pen.paint(()=>{ g.ellipse(0, C.rimY, C.rw, C.rh, 0,0,7); }, toneSolid(inkLevel(SILV_D)), 4);
  // nectar surface inside (bright)
  if (fill>0.02){
    const sr=C.rw*lerp(0.5,0.9,fill);
    pen.paint(()=>{ g.ellipse(0, C.rimY+C.rh*0.12, sr, sr*0.36, 0,0,7); }, toneSolid(inkLevel(NECT)), 3);
  }
  // near-rim highlight
  pen.paint(()=>{ g.ellipse(0, C.rimY, C.rw, C.rh, 0, 0.06, Math.PI-0.06); }, toneSolid(inkLevel(bd-1)), 3);
  return C;
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const pour    = st.pour    ?? 0;    // ewer lift + tip over the cup
  const stream  = st.stream  ?? 0;    // nectar stream from the spout
  const fill    = st.fill    ?? 0;    // nectar in the cup
  const drink   = st.drink   ?? 0;    // cup raised + tilted to the guest
  const food    = st.food    ?? 1;    // ambrosia mound in the dish
  const glow    = st.glow    ?? 1;    // divine self-luminance behind the set
  const cleared = st.cleared ?? 0;    // service dimmed / taken away
  const t       = st.t       ?? 0;

  const cx = W*0.5;
  const trayTopY = H*params.trayTopY;
  const baseY = trayTopY + H*params.trayDepth*0.55;   // vessels rest here
  const dim = cleared>0.5;

  const dishX = cx - W*0.225;
  const ewerX = cx + W*0.030;
  const cupX  = cx + W*0.235;

  // ---- DIVINE GLOW behind the whole service (soft field + slow rings) ----
  const gA = glow*(1-cleared*0.9);
  if (gA>0.02){
    g.save();
    const gx=cx, gy=H*0.50;
    g.globalAlpha = 0.9*gA;
    g.fillStyle=inkLevel(GLOWT);
    g.beginPath(); g.ellipse(gx, gy, W*0.44, H*0.26, 0,0,7); g.fill();
    const rings=4;
    for(let i=0;i<rings;i++){
      const phase=((t*0.35+i/rings)%1);
      const rr2=W*0.14+phase*W*0.30;
      g.strokeStyle=inkLevel(1+Math.round((1-phase)*1.5)); g.lineWidth=Math.max(1.2,2.6*(1-phase));
      g.beginPath(); g.ellipse(gx, gy, rr2, rr2*0.6, 0,0,7); g.stroke();
    }
    g.restore();
  }

  // ---- ground shadow under the tray ----
  g.fillStyle=`rgba(0,0,0,${0.11*(1-cleared*0.6)})`;
  g.beginPath(); g.ellipse(cx, trayTopY+H*params.trayDepth+H*params.trayThick+H*0.012,
                           W*params.trayHalfFront*1.02, H*0.016, 0,0,7); g.fill();

  // ---- TRAY (vessels sit on top) ----
  drawTray(pen,g,W,H,cx,trayTopY,dim);

  // ---- AMBROSIA DISH (left) ----
  drawDish(pen,g,W,H, dishX, baseY, food, dim);

  // ---- NECTAR CUP (right) — drawn before the ewer/stream so pour lands in front ----
  const cw = W*params.cupW;
  const cupLift = drink*H*0.085;
  const cupTilt = -drink*0.42;                      // tips the rim toward the guest (left)
  const cupPivY = baseY - cw*0.66;                  // rim height
  const cupToWorld = (lx,ly)=>{
    const x0=lx, y0=ly;
    const rx = x0*Math.cos(cupTilt) - y0*Math.sin(cupTilt);
    const ry = x0*Math.sin(cupTilt) + y0*Math.cos(cupTilt);
    return { x: cupX + rx, y: (baseY - cupLift) + ry };
  };
  g.save();
  g.translate(cupX, baseY - cupLift);
  g.rotate(cupTilt);
  const C = drawCup(pen,g,cw,fill,dim);
  g.restore();

  // ---- NECTAR EWER (centre) — lifts + tips toward the cup when pouring ----
  const h = H*params.ewerH;
  const tilt = pour*0.80;                            // clockwise -> spout down + toward +x
  const ewLift = pour*H*0.055;
  const ewShift = pour*W*0.045;                      // slide toward the cup
  const px = ewerX + ewShift, py = baseY - ewLift;
  const ewToWorld = (lx,ly)=>({
    x: px + lx*Math.cos(tilt) - ly*Math.sin(tilt),
    y: py + lx*Math.sin(tilt) + ly*Math.cos(tilt),
  });
  g.save();
  g.translate(px, py); g.rotate(tilt);
  const G = drawEwer(pen,g,h,dim);
  g.restore();

  // ---- NECTAR STREAM from the ewer spout into the cup ----
  if (stream>0.02){
    const sp = ewToWorld(G.spout.x, G.spout.y);
    const landPt = cupToWorld(0, C.rimY);
    const landX = landPt.x, landY = landPt.y;
    pen.paint(()=>{
      const midX = lerp(sp.x, landX, 0.5) + Math.sin(t*3)*W*0.008;
      const wpx = W*0.013*stream;
      g.moveTo(sp.x-wpx, sp.y);
      g.quadraticCurveTo(midX-wpx, (sp.y+landY)/2, landX-wpx*1.3, landY);
      g.lineTo(landX+wpx*1.3, landY);
      g.quadraticCurveTo(midX+wpx, (sp.y+landY)/2, sp.x+wpx, sp.y);
      g.closePath();
    }, toneSolid(inkLevel(NECT)), 3);
    // splash ticks at the landing
    g.strokeStyle=inkLevel(SILV+1); g.lineWidth=2; g.lineCap="round";
    for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(landX+i*W*0.014, landY); g.lineTo(landX+i*W*0.022, landY-H*0.014); g.stroke(); }
  }

  // ---- CLEAR overlay: a faint dimming wash so the emptied set reads as taken away ----
  if (cleared>0.02){
    g.save();
    g.globalAlpha = 0.28*cleared;
    g.fillStyle = inkLevel(2);
    g.fillRect(W*0.10, trayTopY-H*0.30, W*0.80, H*0.40);
    g.restore();
  }
}

export const asset = {
  id:"prop.ambrosia-and-nectar-service",
  type:"PROP",
  name:"Ambrosia and Nectar Service",
  statusWord:"SET",
  scene:"OD-B05-S02",

  params,
  // back -> front draw order the prop honors
  layers:["glow","shadow","tray","dish-foot","dish-body","dish-interior","ambrosia",
          "cup","cup-nectar","ewer-handle","ewer-body","ewer-lip","stream","splash","dim"],
  // normalized 0..1 anchors: grip / support / contact / pour target
  anchors:{
    "grip:ewer-handle":{x:.475,y:.595},   // where a hand takes the ewer handle
    "spout:ewer":{x:.615,y:.545},         // pour lip of the ewer
    "rim:cup":{x:.735,y:.585},            // mouth of the nectar cup
    "rim:dish":{x:.275,y:.610},           // mouth of the ambrosia dish
    "target:pour":{x:.735,y:.585},        // where the nectar stream lands
    "contact:tray":{x:.50,y:.740},        // tray foot on the ground
    "support:tray-surface":{x:.50,y:.690},// the tray plane vessels rest on
    "grip:tray-carry":{x:.10,y:.700},     // edge grip to carry the whole tray
  },
  // collision box (AABB in 0..1) for placement / pathing
  zones:{ bounds:{ x0:.09,y0:.34,x1:.91,y1:.76 }, footprint:{ x0:.14,y0:.69,x1:.86,y1:.74 } },
  ownership:{ owner:"the gods", context:"divine hospitality", kind:"service" },
  states:{
    initial:"set",
    nodes:{
      set:  { preview:{ pour:0, stream:0, fill:0,   drink:0, food:1,   glow:1, cleared:0, status:"SET",      progress:.15 } },
      pour: { preview:{ pour:1, stream:1, fill:0.5, drink:0, food:1,   glow:1, cleared:0, status:"POURING",  progress:.45 } },
      drink:{ preview:{ pour:0, stream:0, fill:0.7, drink:1, food:0.6, glow:1, cleared:0, status:"DRINKING", progress:.72 } },
      clear:{ preview:{ pour:0, stream:0, fill:0,   drink:0, food:0,   glow:0, cleared:1, status:"CLEARED",  progress:.98 } },
    },
    edges:[["set","pour"],["pour","drink"],["drink","clear"],["clear","set"],
           ["pour","set"],["drink","pour"]],
  },
  channels:["pour","stream","fill","drink","food","glow","cleared","t"],

  preview:()=>({ pour:0, stream:0, fill:0, drink:0, food:1, glow:1, cleared:0, t:0, status:"SET", progress:.15 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
