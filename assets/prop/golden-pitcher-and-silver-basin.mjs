/* prop.golden-pitcher-and-silver-basin — the hospitality set: a golden ewer
   (pitcher, darker gold tone) paired with a wide silver basin (lighter tone).
   PROP asset for the guest-washing ritual. Drawn in SOLID grays + hard
   contour into the offscreen ctx; the engine dotify pass supplies the
   halftone. Do NOT pre-dither.
   Scene function (OD-B01-S04): a reusable hospitality object with four
   states — PLACE (ewer stands at rest beside the basin), CARRY (ewer lifted,
   handle gripped), POUR (ewer raised + tilted over the basin, water streaming),
   WASH (basin filled, ripples, ewer tipped at rest angle over the water).
   The gold ewer is a mid-dark metal; the silver basin is a light metal — the
   tonal contrast is what separates the two vessels in monochrome.
   Grip/contact/pour anchors declared in 0..1 space. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  ewerH:0.34,        // ewer height (fraction of H)
  ewerW:0.52,        // ewer body width as fraction of its height
  basinR:0.26,       // basin rim half-width (fraction of W)
  basinFlat:0.34,    // basin rim ellipse flatten (rh = rw*flat)
  spoutRight:true,   // ewer spout faces +x (toward the basin)
  bands:3,           // decorative girdle bands on the ewer body
};

const GOLD  = 4;     // ewer body ink level (mid metal, gold)
const GOLD2 = 5;     // ewer shadow / foot
const GOLD3 = 5;     // ewer lip (a touch darker to read as a rim)
const SILV  = 3;     // basin exterior (light metal)
const SILV2 = 5;     // basin interior hollow (shadow)
const WATER = 2;     // water surface (very light)

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
   THE SILVER BASIN — a wide shallow footed bowl centred at (cx, cy) with
   rim mouth at cy. fill 0..1 raises a water surface inside; t drives ripples.
   ------------------------------------------------------------------ */
function drawBasin(pen,g,W,H,cx,cy,rw,fill,t){
  const rh   = rw*params.basinFlat;      // rim ellipse half-height
  const bowl = rh*2.4;                    // bowl depth below the rim
  const footY= cy+bowl;                   // bottom of the bowl

  // ---- pedestal foot under the bowl ----
  const fw = rw*0.42;
  pen.paint(()=>{ rr(g, cx-fw*0.5, footY-rh*0.2, fw, rh*1.5, rh*0.4); }, toneSolid(inkLevel(SILV+1)), 5);
  pen.paint(()=>{ g.ellipse(cx, footY+rh*1.2, fw*0.9, rh*0.55, 0,0,7); }, toneSolid(inkLevel(SILV)), 5);

  // ---- bowl exterior body (the U beneath the rim) ----
  pen.paint(()=>{
    g.moveTo(cx-rw, cy);
    g.quadraticCurveTo(cx-rw*0.9, cy+bowl*0.9, cx, footY);
    g.quadraticCurveTo(cx+rw*0.9, cy+bowl*0.9, cx+rw, cy);
    // back around the far rim
    g.ellipse(cx, cy, rw, rh, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(SILV)), 6);

  // ---- rim mouth: dark hollow interior ----
  pen.paint(()=>{ g.ellipse(cx, cy, rw, rh, 0,0,7); }, toneSolid(inkLevel(SILV2)), 5);
  // near-rim lip highlight (light band so the metal edge reads)
  pen.paint(()=>{ g.ellipse(cx, cy, rw, rh, 0, 0.05, Math.PI-0.05); }, toneSolid(inkLevel(SILV-1)), 4);

  // ---- water surface inside ----
  if (fill>0.02){
    const sr = rw*lerp(0.55,0.86,fill);
    const sy = cy - rh*0.15;             // sits just below the rim
    pen.paint(()=>{ g.ellipse(cx, sy, sr, sr*params.basinFlat, 0,0,7); }, toneSolid(inkLevel(WATER)), 3);
    // concentric ripples
    g.strokeStyle=inkLevel(SILV); g.lineWidth=2; g.lineCap="round";
    for(let i=1;i<=3;i++){
      const rr2 = sr*(0.30+0.22*i) + Math.sin(t*2+i)*sr*0.03;
      g.beginPath(); g.ellipse(cx, sy, rr2, rr2*params.basinFlat, 0,0,7); g.stroke();
    }
  }
  return { rim:{x:cx,y:cy}, waterY:cy-rh*0.15 };
}

/* ------------------------------------------------------------------
   THE GOLDEN EWER — drawn in a LOCAL frame (base at origin, up = -y) then
   placed by the caller via translate(pivot)+rotate(tilt). Returns the spout
   tip + grip in LOCAL coords so the caller can map them to world space.
   ------------------------------------------------------------------ */
function ewerGeometry(h){
  const w = h*params.ewerW;             // body width
  return { h, w,
    bodyCy:-h*0.42, bodyRx:w*0.5, bodyRy:h*0.30,
    footTop:-h*0.06, footHalfTop:w*0.24, footHalfBot:w*0.32,
    neckY:-h*0.72, neckHalf:w*0.19,
    lipY:-h*0.88,  lipHalf:w*0.26,
    spout:{ x:w*0.64, y:-h*0.86 },       // spout beak tip (right side)
    handle:{ top:{x:-w*0.34,y:-h*0.70}, bot:{x:-w*0.30,y:-h*0.24} },
    grip:{ x:-w*0.98, y:-h*0.48 },       // outside of the handle bow
  };
}

function drawEwer(pen,g,h){
  const G = ewerGeometry(h);
  const dir = params.spoutRight?1:-1;

  // ---- HANDLE (behind the body so the body overlaps its roots; a thin bow
  //      pushed well out so a paper gap opens between it and the body -> loop) ----
  pen.limb(()=>{
    g.moveTo(G.handle.top.x, G.handle.top.y);
    g.quadraticCurveTo(G.grip.x, (G.handle.top.y+G.handle.bot.y)/2, G.handle.bot.x, G.handle.bot.y);
  }, toneSolid(inkLevel(GOLD)), h*0.050);

  // ---- FOOT (trapezoid base) ----
  pen.paint(()=>{
    g.moveTo(-G.footHalfBot, 0);
    g.lineTo( G.footHalfBot, 0);
    g.lineTo( G.footHalfTop, G.footTop);
    g.lineTo(-G.footHalfTop, G.footTop);
    g.closePath();
  }, toneSolid(inkLevel(GOLD2)), 5);

  // ---- BODY (ovoid bulb) ----
  pen.paint(()=>{ g.ellipse(0, G.bodyCy, G.bodyRx, G.bodyRy, 0,0,7); }, toneSolid(inkLevel(GOLD)), 6);

  // ---- NECK (body shoulder up to the lip) ----
  pen.paint(()=>{
    g.moveTo(-G.bodyRx*0.5, G.bodyCy-G.bodyRy*0.75);
    g.lineTo( G.bodyRx*0.5, G.bodyCy-G.bodyRy*0.75);
    g.lineTo( G.neckHalf,   G.neckY);
    g.lineTo(-G.neckHalf,   G.neckY);
    g.closePath();
  }, toneSolid(inkLevel(GOLD)), 5);

  // ---- LIP + SPOUT (flared cup with a triangular pouring beak to +dir) ----
  const s = dir;
  pen.paint(()=>{
    g.moveTo(-s*G.neckHalf, G.neckY);                // back neck
    g.lineTo(-s*G.lipHalf,  G.lipY);                 // back lip corner (flare)
    g.lineTo( s*G.lipHalf*0.45, G.lipY-h*0.015);     // rim running toward the beak
    g.lineTo( s*G.spout.x,  G.spout.y);              // beak tip (up + out)
    g.lineTo( s*G.lipHalf*0.30, G.lipY+h*0.05);      // underside of the beak
    g.lineTo( s*G.neckHalf, G.neckY);                // front neck
    g.closePath();
  }, toneSolid(inkLevel(GOLD3)), 5);
  // beak trough seam (reads as the open pouring channel)
  pen.seam(()=>{ g.moveTo(s*G.lipHalf*0.35, G.lipY); g.lineTo(s*G.spout.x*0.92, G.spout.y+h*0.015); }, 2.5);

  // ---- decorative girdle bands (highlight seams) ----
  for(let i=1;i<=params.bands;i++){
    const yy = G.bodyCy + G.bodyRy*(-0.5 + i/(params.bands+1)*1.4);
    const hw = G.bodyRx*Math.sqrt(Math.max(0,1-Math.pow((yy-G.bodyCy)/G.bodyRy,2)))*0.95;
    pen.seam(()=>{ g.moveTo(-hw, yy); g.lineTo(hw, yy); }, 3);
  }
  // vertical body highlight
  pen.seam(()=>{ g.moveTo(-G.bodyRx*0.35, G.bodyCy-G.bodyRy*0.6); g.lineTo(-G.bodyRx*0.42, G.bodyCy+G.bodyRy*0.5); }, 2.5);

  return G;
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const tilt  = st.tilt  ?? 0;    // ewer tip angle (rad, +tips spout down)
  const lift  = st.lift  ?? 0;    // 0 grounded .. 1 raised over basin
  const fill  = st.fill  ?? 0;    // basin water level
  const stream= st.stream?? 0;    // water stream from spout
  const hand  = st.hand  ?? 0;    // show a gripping hand on the handle
  const t     = st.t     ?? 0;

  const h = H*params.ewerH;
  const basinCx = W*0.52, basinCy = H*0.68, basinRw = W*params.basinR;

  // ---- ground shadow (both vessels when the ewer rests) ----
  if (lift<0.5){
    g.fillStyle="rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(W*0.30, H*0.755, W*0.15, H*0.02, 0,0,7); g.fill();
  }

  // ---- BASIN (drawn first; ewer + stream sit in front) ----
  const basin = drawBasin(pen,g,W,H, basinCx, basinCy, basinRw, fill, t);

  // ---- EWER placement: lerp base pivot from "beside" to "raised over basin"
  const placed = { x:W*0.30, y:H*0.735 };
  const raised = { x:W*0.44, y:H*0.44 };
  const px = lerp(placed.x, raised.x, lift);
  const py = lerp(placed.y, raised.y, lift);

  // map a LOCAL ewer point through translate(px,py)+rotate(tilt)
  const toWorld = (lx,ly)=>({
    x: px + lx*Math.cos(tilt) - ly*Math.sin(tilt),
    y: py + lx*Math.sin(tilt) + ly*Math.cos(tilt),
  });

  g.save();
  g.translate(px,py); g.rotate(tilt);
  const G = drawEwer(pen,g,h);
  g.restore();

  // ---- WATER STREAM from spout tip to the basin surface ----
  const spoutW = toWorld(G.spout.x, G.spout.y);
  if (stream>0.02){
    const landY = basin.waterY;
    const landX = basinCx + (basinCx>spoutW.x?1:-1)*basinRw*0.10;
    g.save();
    pen.paint(()=>{
      const midX = lerp(spoutW.x, landX, 0.5) + Math.sin(t*3)*W*0.01;
      const wpx = W*0.018*stream;   // stream half-width
      g.moveTo(spoutW.x-wpx, spoutW.y);
      g.quadraticCurveTo(midX-wpx, (spoutW.y+landY)/2, landX-wpx*1.4, landY);
      g.lineTo(landX+wpx*1.4, landY);
      g.quadraticCurveTo(midX+wpx, (spoutW.y+landY)/2, spoutW.x+wpx, spoutW.y);
      g.closePath();
    }, toneSolid(inkLevel(WATER)), 3);
    // splash ticks at the landing
    g.strokeStyle=inkLevel(SILV); g.lineWidth=2; g.lineCap="round";
    for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(landX+i*W*0.02, landY); g.lineTo(landX+i*W*0.03, landY-H*0.02); g.stroke(); }
    g.restore();
  }

  // ---- HAND gripping the handle (carry / pour) ----
  if (hand>0.4){
    const grip = toWorld(G.grip.x, G.grip.y);
    pen.paint(()=>{ g.ellipse(grip.x, grip.y, W*0.030, W*0.024, tilt, 0,7); }, toneSolid(inkLevel(4)), 4);
    // wrist stub trailing off toward the frame edge
    pen.limb(()=>{ g.moveTo(grip.x, grip.y); g.lineTo(grip.x-W*0.10, grip.y-H*0.03*lift+H*0.02); }, toneSolid(inkLevel(3)), W*0.028);
  }
}

export const asset = {
  id:"prop.golden-pitcher-and-silver-basin",
  type:"PROP",
  name:"Golden Pitcher and Silver Basin",
  statusWord:"PLACED",
  scene:"OD-B01-S04",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","basin-foot","basin-body","basin-rim","water","ewer-handle","ewer-body","ewer-lip","bands","stream","hand"],
  // normalized 0..1 anchors: grip, spout, support/contact, pour target
  anchors:{
    "grip:handle":{x:.22,y:.49},       // where a hand takes the ewer handle
    "spout:lip":{x:.52,y:.40},         // pour lip of the ewer
    "contact:ewer-foot":{x:.30,y:.735},// ewer base on the ground (placed)
    "contact:basin-foot":{x:.52,y:.86},// basin pedestal on the ground
    "rim:basin":{x:.52,y:.68},         // basin mouth centre
    "target:pour":{x:.52,y:.66},       // where the stream lands in the basin
  },
  // collision shape (AABB in 0..1) for placement / pathing
  zones:{ bounds:{ x0:.16,y0:.36,x1:.80,y1:.90 }, basin:{ x0:.26,y0:.60,x1:.78,y1:.90 } },
  states:{
    initial:"place",
    nodes:{
      place:{ preview:{ tilt:0,    lift:0,   fill:0,    stream:0, hand:0, status:"PLACED", progress:.15 } },
      carry:{ preview:{ tilt:0.14, lift:0.9, fill:0,    stream:0, hand:1, status:"CARRIED", progress:.45 } },
      pour: { preview:{ tilt:0.85, lift:1.0, fill:0.45, stream:1, hand:1, status:"POURING", progress:.75 } },
      wash: { preview:{ tilt:0.35, lift:0.4, fill:0.8,  stream:0.3, hand:0, status:"WASHING", progress:.95 } },
    },
    edges:[["place","carry"],["carry","pour"],["pour","wash"],["wash","place"],["carry","place"],["pour","carry"]],
  },
  channels:["tilt","lift","fill","stream","hand","t"],

  preview:()=>({ tilt:0, lift:0, fill:0, stream:0, hand:0, t:0, status:"PLACED", progress:.15 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
