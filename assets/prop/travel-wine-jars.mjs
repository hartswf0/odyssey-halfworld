/* prop.travel-wine-jars — twelve sealable two-handled amphorae, drawn as a
   grouped stash (a staggered back+front row) from ONE member template.
   PROP asset for provisioning the ship. Drawn in SOLID grays + hard contour
   into the offscreen ctx; the engine dotify pass supplies the halftone. Do
   NOT pre-dither.
   Scene function (OD-B02-S06): a reusable set of travel wine jars with five
   states — EMPTY (open mouths, no wine), FILLED (wine level visible in the
   bellies, mouths open), SEALED (clay stoppers + seal bands over the mouths),
   CARRIED (sealed jars slung on a shoulder-pole yoke through the handles),
   STOWED (sealed jars nested tip-down in a wooden storage rack for the hold).
   Twelve members are drawn deterministically from an amphora template with
   scale / depth / formation controls. Grip / contact / stopper anchors and a
   collision box are declared in 0..1 space. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  count:12,            // total jars in the set
  rows:2,              // back + front
  perRow:6,
  jarW:0.24,          // body half-width as fraction of jar height
  frontH:0.40,        // front-row jar height (fraction of H)
  backH:0.30,         // back-row jar height
  frontTipY:0.865,    // where the pointed base of a front jar sits (fraction of H)
  backTipY:0.635,
  handles:2,
};

const CLAY   = 4;    // jar body ink level (fired terracotta, mid tone)
const CLAY_B = 3;    // back-row body (dimmer for depth)
const CLAY_D = 5;    // shoulder / handle shade
const WINE   = 6;    // wine inside the belly (dark)
const STOP   = 6;    // clay stopper
const WOOD   = 4;    // rack / carry-pole timber
const WOOD_D = 5;    // timber shadow face

/* ------------------------------------------------------------------
   THE AMPHORA TEMPLATE — drawn in a LOCAL frame with the pointed base at
   the origin and the mouth up (-y). Height Hj. opts.fill 0..1 raises a wine
   surface in the belly; opts.sealed adds a stopper + seal band; tone is the
   body ink level (back rows pass a dimmer tone). Returns local anchor points.
   ------------------------------------------------------------------ */
function jarGeom(Hj){
  const w = Hj*params.jarW;
  return { Hj, w,
    tip:{x:0,y:0},
    bellyY:-Hj*0.46, bellyHalf:w,
    shoulderY:-Hj*0.70, shoulderHalf:w*0.55,
    neckY:-Hj*0.88, neckHalf:w*0.36,
    rimY:-Hj*0.95, rimHalf:w*0.56,
    handTop:{x:w*0.42,y:-Hj*0.85}, handBot:{x:w*0.60,y:-Hj*0.62},
  };
}

function jarBodyPath(g,G){
  // right side, tip -> belly -> shoulder -> neck -> rim, across, mirror down.
  g.moveTo(G.tip.x, G.tip.y);
  g.quadraticCurveTo(G.bellyHalf*1.06, -G.Hj*0.18, G.bellyHalf, G.bellyY);
  g.quadraticCurveTo(G.bellyHalf*0.98, -G.Hj*0.62, G.shoulderHalf, G.shoulderY);
  g.lineTo(G.neckHalf, G.neckY);
  g.lineTo(G.rimHalf, G.rimY);
  g.lineTo(-G.rimHalf, G.rimY);
  g.lineTo(-G.neckHalf, G.neckY);
  g.lineTo(-G.shoulderHalf, G.shoulderY);
  g.quadraticCurveTo(-G.bellyHalf*0.98, -G.Hj*0.62, -G.bellyHalf, G.bellyY);
  g.quadraticCurveTo(-G.bellyHalf*1.06, -G.Hj*0.18, G.tip.x, G.tip.y);
  g.closePath();
}

function drawJar(pen,g,Hj,opts={}){
  const G = jarGeom(Hj);
  const tone = opts.tone ?? CLAY;
  const fill = opts.fill ?? 0;
  const sealed = !!opts.sealed;

  // ---- HANDLES (behind the body so the belly overlaps their roots and a
  //      paper gap opens into a loop) — one arch on each side ----
  for(const s of [-1,1]){
    pen.limb(()=>{
      g.moveTo(s*G.neckHalf*0.9, -Hj*0.86);
      g.quadraticCurveTo(s*G.handBot.x*1.4, -Hj*0.80, s*G.handBot.x, G.handBot.y);
    }, toneSolid(inkLevel(CLAY_D)), Hj*0.045);
  }

  // ---- BODY (the ovoid amphora silhouette) ----
  pen.paint(()=>jarBodyPath(g,G), toneSolid(inkLevel(tone)), 5);

  // ---- WINE in the belly — only visible through an OPEN mouth; a sealed
  //      terracotta jar is opaque, so we do not darken its body ----
  if (fill>0.02 && !sealed){
    const surfY = lerp(G.tip.y, G.shoulderY, clamp(fill,0,1));
    g.save();
    g.beginPath(); jarBodyPath(g,G); g.clip();
    g.fillStyle = inkLevel(WINE);
    g.fillRect(-G.bellyHalf*1.2, surfY, G.bellyHalf*2.4, -surfY + Hj*0.02);
    g.restore();
    // wine surface glint line across the belly
    const hw = G.bellyHalf*0.9;
    pen.seam(()=>{ g.moveTo(-hw, surfY); g.lineTo(hw, surfY); }, 2.5);
  }

  // ---- MOUTH: open dark ellipse, or a stopper if sealed ----
  if (sealed){
    // clay stopper cap seated over the rim
    pen.paint(()=>{
      g.moveTo(-G.rimHalf*0.8, G.rimY);
      g.lineTo( G.rimHalf*0.8, G.rimY);
      g.lineTo( G.rimHalf*0.55, G.rimY-Hj*0.07);
      g.lineTo(-G.rimHalf*0.55, G.rimY-Hj*0.07);
      g.closePath();
    }, toneSolid(inkLevel(STOP)), 4);
    // seal band around the neck
    pen.paint(()=>{ g.rect(-G.neckHalf, G.neckY-Hj*0.015, G.neckHalf*2, Hj*0.04); }, toneSolid(inkLevel(CLAY_D)), 3);
  } else {
    pen.paint(()=>{ g.ellipse(0, G.rimY, G.rimHalf*0.72, Hj*0.03, 0,0,7); }, toneSolid(inkLevel(WINE)), 3);
  }

  // ---- rim lip highlight + a belly girdle seam (reads the terracotta) ----
  pen.seam(()=>{ g.moveTo(-G.rimHalf, G.rimY); g.lineTo(G.rimHalf, G.rimY); }, 2.5);
  pen.seam(()=>{
    const yy=G.bellyY, hw=G.bellyHalf*0.85;
    g.moveTo(-hw, yy); g.lineTo(hw, yy);
  }, 2.5);
  return G;
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const fill   = st.fill   ?? 0;     // wine level in every jar
  const sealed = !!st.sealed;        // stoppers on
  const rack   = !!st.rack;          // stowed in a wooden rack
  const pole   = !!st.pole;          // carried on a shoulder-pole yoke

  const frontH = H*params.frontH, backH = H*params.backH;
  const frontTip = H*params.frontTipY, backTip = H*params.backTipY;

  // horizontal placement: 6 front, 6 back staggered behind the front gaps
  const x0 = W*0.15, sp = W*0.13, backOff = W*0.065;
  const frontX = i => x0 + i*sp;
  const backX  = i => x0 + i*sp + backOff;

  // ---- ground band the stash rests on (light) ----
  g.fillStyle = inkLevel(2);
  g.fillRect(0, frontTip-frontH*0.02, W, H-(frontTip-frontH*0.02));

  // ---- BACK RACK BEAM (stowed) then the back row ----
  if (rack){
    pen.paint(()=>{ g.rect(W*0.04, backTip-backH*0.06, W*0.92, backH*0.14); }, toneSolid(inkLevel(WOOD)), 5);
  }
  for(let i=0;i<params.perRow;i++){
    g.save(); g.translate(backX(i), backTip);
    drawJar(pen,g,backH,{ tone:CLAY_B, fill, sealed });
    g.restore();
  }

  // ---- FRONT RACK BEAM (stowed) then the front row (drawn in front) ----
  if (rack){
    pen.paint(()=>{ g.rect(W*0.02, frontTip-frontH*0.05, W*0.96, frontH*0.16); }, toneSolid(inkLevel(WOOD_D)), 5);
    // rack uprights / cradle notches between the jars
    g.strokeStyle=INK; g.lineWidth=3;
    for(let i=0;i<=params.perRow;i++){ const x=frontX(i)-sp*0.5; g.beginPath(); g.moveTo(x, frontTip-frontH*0.05); g.lineTo(x, frontTip+frontH*0.11); g.stroke(); }
  } else {
    // soft contact shadows under the front row
    g.fillStyle="rgba(0,0,0,0.10)";
    for(let i=0;i<params.perRow;i++){ g.beginPath(); g.ellipse(frontX(i), frontTip+frontH*0.015, frontH*0.16, frontH*0.03, 0,0,7); g.fill(); }
  }
  for(let i=0;i<params.perRow;i++){
    g.save(); g.translate(frontX(i), frontTip);
    drawJar(pen,g,frontH,{ tone:CLAY, fill, sealed });
    g.restore();
  }

  // ---- CARRY-POLE YOKE across the front row, roped through the handles ----
  if (pole){
    const poleY = frontTip - frontH*0.99;
    pen.paint(()=>{ g.rect(W*0.05, poleY-frontH*0.02, W*0.90, frontH*0.05); }, toneSolid(inkLevel(WOOD_D)), 5);
    g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
    for(let i=0;i<params.perRow;i++){
      const x=frontX(i);
      g.beginPath();
      g.moveTo(x-frontH*0.10, poleY+frontH*0.03);
      g.lineTo(x-frontH*0.14, frontTip-frontH*0.82);
      g.moveTo(x+frontH*0.10, poleY+frontH*0.03);
      g.lineTo(x+frontH*0.14, frontTip-frontH*0.82);
      g.stroke();
    }
  }
}

export const asset = {
  id:"prop.travel-wine-jars",
  type:"PROP",
  name:"Travel Wine Jars",
  statusWord:"SEALED",
  scene:"OD-B02-S06",

  params,
  // back -> front draw order the prop honors
  layers:["ground","back-rack","back-row","front-rack","shadow","front-row","wine","stopper","yoke"],
  // normalized 0..1 anchors: one member template's grip/contact + set extents
  anchors:{
    "grip:handle-l":{x:.11,y:.55},        // left handle of the near member
    "grip:handle-r":{x:.19,y:.55},        // right handle of the near member
    "stopper:mouth":{x:.15,y:.44},        // stopper seat of the near member
    "contact:front-base":{x:.15,y:.865},  // pointed base of the near member
    "contact:set-base":{x:.50,y:.90},     // the stash footprint centre
    "carry:pole":{x:.50,y:.46},           // shoulder-pole grip point
    "member:template":{x:.15,y:.66},      // the one drawn member template
  },
  // collision box (AABB in 0..1) for the whole grouped set
  zones:{ bounds:{ x0:.06,y0:.38,x1:.94,y1:.92 }, footprint:{ x0:.08,y0:.78,x1:.92,y1:.92 } },
  states:{
    initial:"stowed",
    nodes:{
      empty:  { preview:{ fill:0,    sealed:false, rack:false, pole:false, status:"EMPTY",   progress:.10 } },
      filled: { preview:{ fill:0.9,  sealed:false, rack:false, pole:false, status:"FILLED",  progress:.45 } },
      sealed: { preview:{ fill:0.9,  sealed:true,  rack:false, pole:false, status:"SEALED",  progress:.65 } },
      carried:{ preview:{ fill:0.9,  sealed:true,  rack:false, pole:true,  status:"CARRIED", progress:.80 } },
      stowed: { preview:{ fill:0.9,  sealed:true,  rack:true,  pole:false, status:"STOWED",  progress:.95 } },
    },
    edges:[["empty","filled"],["filled","sealed"],["sealed","carried"],["carried","stowed"],["stowed","carried"],["carried","sealed"],["sealed","empty"]],
  },
  channels:["fill","sealed","rack","pole"],

  preview:()=>({ fill:0.9, sealed:true, rack:false, pole:false, status:"SEALED", progress:.65 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
