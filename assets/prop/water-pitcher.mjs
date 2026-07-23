/* prop.water-pitcher — an ordinary carried terracotta water jug: a bulbous
   fired-clay body with one arched handle and a pulled-out pouring spout.
   PROP asset. Drawn in SOLID grays + hard contour into the offscreen ctx;
   the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B07-S01): the plain everyday vessel a disguised Athena
   carries to pass as a local girl — it must read as unremarkable pottery.
   Three states:
     REST  — set down upright on a surface, water sitting in the belly.
     CARRY — lifted, tilted a touch to the grip side, water sloshed level.
     POUR  — tipped over the spout with a water stream leaving the lip.
   One member (a single jug) is drawn from a parametric template with a
   declared scale, grip / spout / contact anchors, and a collision box. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  jugH:0.62,          // jug height as fraction of card H (rest, upright)
  bodyW:0.34,         // belly half-width as fraction of jug height
  baseY:0.88,         // where the flat base sits (fraction of H) at rest
  handleSide:-1,      // handle on the left, spout on the right
  scale:1.0,          // reusable scale knob (relative to the declared jugH)
  capacity:1,         // ordinary single-carry vessel
};

const CLAY   = 4;   // fired terracotta body — mid tone
const CLAY_D = 5;   // shoulder / handle / spout shade (a touch darker)
const CLAY_L = 3;   // lit belly band
const WATER  = 6;   // water inside the belly / the pouring stream (dark)
const RIMK   = 6;   // open mouth interior

/* ------------------------------------------------------------------
   THE JUG TEMPLATE — drawn in a LOCAL frame with the flat base centred on
   the origin and the mouth up (-y). Height Hj. opts.fill 0..1 raises the
   water surface; the spout sits on the +x side, the handle on the -x side
   (the caller mirrors via params.handleSide by flipping the frame).
   ------------------------------------------------------------------ */
function jugGeom(Hj){
  const w = Hj*params.bodyW;
  return { Hj, w,
    baseHalf:  w*0.60,  baseY:0,
    bellyHalf: w,        bellyY:-Hj*0.42,
    shoulderHalf:w*0.66, shoulderY:-Hj*0.66,
    neckHalf:  w*0.40,   neckY:-Hj*0.80,
    rimHalf:   w*0.46,   rimY:-Hj*0.88,
  };
}

function jugBodyPath(g,G){
  // right side: base -> belly -> shoulder -> neck -> rim, then mirror down.
  g.moveTo(G.baseHalf, G.baseY);
  g.quadraticCurveTo(G.bellyHalf*1.02, -G.Hj*0.16, G.bellyHalf, G.bellyY);
  g.quadraticCurveTo(G.bellyHalf*0.96, -G.Hj*0.58, G.shoulderHalf, G.shoulderY);
  g.lineTo(G.neckHalf, G.neckY);
  g.lineTo(G.rimHalf, G.rimY);
  g.lineTo(-G.rimHalf, G.rimY);
  g.lineTo(-G.neckHalf, G.neckY);
  g.lineTo(-G.shoulderHalf, G.shoulderY);
  g.quadraticCurveTo(-G.bellyHalf*0.96, -G.Hj*0.58, -G.bellyHalf, G.bellyY);
  g.quadraticCurveTo(-G.bellyHalf*1.02, -G.Hj*0.16, -G.baseHalf, G.baseY);
  g.closePath();
}

function drawJug(pen,g,Hj,opts={}){
  const G = jugGeom(Hj);
  const fill  = opts.fill ?? 0.55;
  const tone  = opts.tone ?? CLAY;

  // ---- HANDLE (behind the body so the belly overlaps its root -> a paper
  //      loop opens up). One arch from the neck down to the upper belly. ----
  pen.limb(()=>{
    g.moveTo(-G.neckHalf*0.92, -Hj*0.83);
    g.quadraticCurveTo(-G.bellyHalf*1.55, -Hj*0.66, -G.bellyHalf*0.86, -Hj*0.40);
  }, toneSolid(inkLevel(CLAY_D)), Hj*0.05);

  // ---- SPOUT (a pulled-out pouring lip on the +x side of the rim) ----
  pen.paint(()=>{
    g.moveTo(G.neckHalf*0.9, G.neckY);
    g.lineTo(G.rimHalf*1.75, G.rimY - Hj*0.02);
    g.lineTo(G.rimHalf*1.62, G.rimY + Hj*0.06);
    g.lineTo(G.rimHalf*0.72, G.neckY + Hj*0.02);
    g.closePath();
  }, toneSolid(inkLevel(CLAY_D)), 4);

  // ---- BODY (the bulbous jug silhouette) ----
  pen.paint(()=>jugBodyPath(g,G), toneSolid(inkLevel(tone)), 5);

  // ---- lit belly band + girdle seams that read the terracotta curve
  //      (a faint highlight, not a bright disc) ----
  pen.seam(()=>{ const hw=G.bellyHalf*0.82; g.moveTo(-hw,G.bellyY); g.lineTo(hw,G.bellyY); }, 2.5);
  pen.seam(()=>{ g.moveTo(-G.shoulderHalf,G.shoulderY); g.lineTo(G.shoulderHalf,G.shoulderY); }, 2.5);

  // ---- OPEN MOUTH: an open ring; when filled its interior reads as the
  //      water surface (opaque clay body, so the level only shows at the top) ----
  const inner = fill > 0.02 ? WATER : RIMK;
  pen.paint(()=>{ g.ellipse(0, G.rimY, G.rimHalf*0.82, Hj*0.035, 0, 0, 7); },
            toneSolid(inkLevel(inner)), 3);
  pen.seam(()=>{ g.moveTo(-G.rimHalf,G.rimY); g.lineTo(G.rimHalf,G.rimY); }, 2.5);
  return G;
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const fill  = st.fill  ?? 0.55;
  const tilt  = st.tilt  ?? 0;      // radians the jug is rotated to the spout side
  const lifted= !!st.lifted;        // off the surface (carry / pour)
  const pour  = !!st.pour;          // draw a water stream from the spout

  const Hj = H*params.jugH*params.scale;
  const cx = W*0.5;
  // pivot: at rest the base sits on baseY; lifted raises it a little
  const pivotY = H*params.baseY - (lifted ? H*0.06 : 0);

  // ---- ground / surface band + contact shadow at rest ----
  if (!lifted){
    g.fillStyle = inkLevel(2);
    g.fillRect(0, pivotY-2, W, H-(pivotY-2));
    g.fillStyle = "rgba(0,0,0,0.12)";
    g.beginPath(); g.ellipse(cx, pivotY+Hj*0.02, Hj*0.30, Hj*0.05, 0, 0, 7); g.fill();
  } else {
    g.fillStyle = "rgba(0,0,0,0.08)";
    g.beginPath(); g.ellipse(cx, H*0.94, Hj*0.34, Hj*0.05, 0, 0, 7); g.fill();
  }

  // ---- the jug, in its own rotated frame (handle left / spout right) ----
  g.save();
  g.translate(cx, pivotY);
  // spout points +x; a positive tilt rotates the mouth toward the +x pour side
  g.rotate(tilt);
  g.scale(params.handleSide < 0 ? 1 : -1, 1);   // mirror so handle sits on chosen side
  const G = drawJug(pen, g, Hj, { fill });
  g.restore();

  // ---- POURING STREAM (world space, from the tipped spout lip) ----
  if (pour){
    // spout lip in local coords, transformed by the same tilt
    const G2 = jugGeom(Hj);
    const lx = G2.rimHalf*1.75, ly = G2.rimY;
    const sx = cx + (lx*Math.cos(tilt) - ly*Math.sin(tilt));
    const sy = pivotY + (lx*Math.sin(tilt) + ly*Math.cos(tilt));
    // an arcing water ribbon falling to the ground
    pen.paint(()=>{
      g.moveTo(sx, sy);
      g.quadraticCurveTo(sx+Hj*0.30, sy+Hj*0.34, sx+Hj*0.30, H*0.90);
      g.lineTo(sx+Hj*0.44, H*0.90);
      g.quadraticCurveTo(sx+Hj*0.20, sy+Hj*0.30, sx+Hj*0.12, sy);
      g.closePath();
    }, toneSolid(inkLevel(WATER)), 3);
    // splash pool
    pen.paint(()=>{ g.ellipse(sx+Hj*0.36, H*0.90, Hj*0.16, Hj*0.03, 0, 0, 7); },
              toneSolid(inkLevel(WATER)), 2);
  }
}

export const asset = {
  id:"prop.water-pitcher",
  type:"PROP",
  name:"Water Pitcher",
  statusWord:"CARRIED",
  scene:"OD-B07-S01",

  params,
  // back -> front draw order the prop honors
  layers:["surface","shadow","handle","spout","body","water","mouth","stream"],
  // normalized 0..1 anchors (near member template): grip / spout / contact
  anchors:{
    "grip:handle":{x:.34,y:.44},      // the arched handle, where a hand takes it
    "spout:lip":{x:.63,y:.40},        // the pouring lip
    "rim:mouth":{x:.50,y:.40},        // the open top
    "contact:base":{x:.50,y:.88},     // flat base footprint on a surface
    "carry:hip":{x:.42,y:.55},        // rest point when carried against the hip
    "member:template":{x:.50,y:.62},  // the one drawn jug
  },
  // collision box (AABB in 0..1) for the vessel
  zones:{ bounds:{ x0:.28,y0:.34,x1:.72,y1:.90 }, footprint:{ x0:.40,y0:.84,x1:.60,y1:.90 } },
  // ownership: an ordinary local vessel, carried by whoever holds it (no fixed owner)
  ownership:{ kind:"portable", owner:null, carriedBy:"holder" },
  states:{
    initial:"rest",
    nodes:{
      rest:  { preview:{ fill:0.55, tilt:0,     lifted:false, pour:false, status:"REST",   progress:.20 } },
      carry: { preview:{ fill:0.55, tilt:-0.14, lifted:true,  pour:false, status:"CARRIED",progress:.55 } },
      pour:  { preview:{ fill:0.30, tilt:0.85,  lifted:true,  pour:true,  status:"POURING",progress:.85 } },
    },
    edges:[["rest","carry"],["carry","rest"],["carry","pour"],["pour","carry"]],
  },
  channels:["fill","tilt","lifted","pour"],

  preview:()=>({ fill:0.55, tilt:0, lifted:false, pour:false, status:"REST", progress:.20 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
