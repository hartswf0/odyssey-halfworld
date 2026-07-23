/* prop.marons-wine-skin — Maron of Ismarus' gift: a single bulging goatskin
   wine bag with a tied leather neck/spout, the potent unmixed wine Odysseus
   carries into the Cyclops' cave. PROP asset. Drawn in SOLID grays + hard
   contour into the offscreen ctx; the engine dotify pass supplies the
   halftone. Do NOT pre-dither.
   Scene function (OD-B09-S05): one reusable goatskin container with six
   states — SEALED (upright, plump, spout knotted shut), CARRIED (slung on a
   shoulder cord, leaning), POURED (tilted, an unmixed stream running from the
   open spout), DILUTED (tilted over a mixing bowl, wine cut with water — the
   twenty-to-one measure), OFFERED (held out, spout open, presented), EMPTIED
   (slack, sagging, creased, flattened base, open spout).
   fill drives the belly bulge; tilt / strap / pour / bowl / sag flags carry
   the rest. Grip / spout / contact anchors + a collision box are declared in
   0..1 space. Ownership: Maron's gift, held by Odysseus. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  legNubs:3,          // tied-off goat leg stubs read the hide as a goatskin
  creases:2,          // hide fold seams across the belly
  neckTie:true,       // leather thong cinching the neck into a spout
};

const HIDE   = 4;    // goatskin body (tanned leather, mid tone)
const HIDE_D = 5;    // shaded near-flank / underside of the hide
const HIDE_L = 3;    // lit crown of the belly
const THONG  = 6;    // leather neck-thong / cinch band (dark)
const SPOUT  = 6;    // spout knot / open mouth (dark)
const WINE   = 6;    // wine stream (dark, unmixed)
const WINE_M = 5;    // diluted wine surface in the bowl
const WATER  = 2;    // water already in the mixing bowl (very light)
const BOWL   = 4;    // mixing-bowl clay
const BOWL_D = 5;    // bowl shaded face
const CORD   = 6;    // carry cord

/* ------------------------------------------------------------------
   THE GOATSKIN — one plump hide bag drawn in a LOCAL frame with the resting
   base centre at (cx, cy) and up = -y, rotated by `tilt` about that base.
     fill 0 = slack/empty .. 1 = taut/full  (drives belly bulge + base spread)
     spoutOpen  false = knotted shut .. true = open pour mouth
     sag  true = deflated: extra fold creases + drooping base
   Returns the world-space spout tip (for pour streams / anchors).
   ------------------------------------------------------------------ */
function drawSkin(pen, g, cx, cy, w, h, { fill=1, tilt=0, spoutOpen=false, sag=false }={}){
  const bHalf  = w*(0.34 + 0.24*fill);          // belly half-width
  const shHalf = w*(0.17 + 0.09*fill);          // shoulder half-width
  const nHalf  = w*0.11;                          // neck half-width (stubby, not a bottle)
  const base   = w*(0.22 + 0.13*(1-fill));       // rounded base contact half-width (spreads when empty)
  const yBulge = -h*0.42, yShoulder=-h*0.62, yNeck=-h*0.70;
  const yTie   = -h*0.79, yTip=-h*0.89;
  const drop   = sag ? h*0.11 : h*0.045;         // how far the rounded base sags below origin

  // spout tip in local frame, then rotated into world space
  const ca=Math.cos(tilt), sa=Math.sin(tilt);
  const tip = { x: cx + 0*ca - yTip*sa, y: cy + 0*sa + yTip*ca };
  const rimW= { x: cx + (nHalf*0.5)*ca - yTip*sa, y: cy + (nHalf*0.5)*sa + yTip*ca };

  g.save(); g.translate(cx,cy); g.rotate(tilt);

  const body = (gg)=>{
    gg.moveTo(-base, drop*0.2);
    gg.quadraticCurveTo(-bHalf, yBulge, -shHalf, yShoulder);   // left flank up
    gg.lineTo(-nHalf, yNeck);
    gg.lineTo( nHalf, yNeck);
    gg.lineTo( shHalf, yShoulder);
    gg.quadraticCurveTo( bHalf, yBulge,  base, drop*0.2);       // right flank down
    gg.quadraticCurveTo( 0, drop, -base, drop*0.2);             // rounded / sagging base
    gg.closePath();
  };

  // ---- tied-off goat leg stubs: short cones rooted ON the hide edge, drawn
  //      first so the body covers their roots and only the tied toe shows ----
  const nub=(ax,ay,ox,oy)=>{
    const px=-oy, py=ox, n=Math.hypot(px,py)||1, ux=px/n*w*0.05, uy=py/n*w*0.05;
    pen.paint(()=>{
      g.moveTo(ax-ux, ay-uy); g.lineTo(ax+ox, ay+oy); g.lineTo(ax+ux, ay+uy); g.closePath();
    }, toneSolid(inkLevel(HIDE_D)), 4);
    pen.paint(()=>{ g.arc(ax+ox, ay+oy, w*0.024, 0, 7); }, toneSolid(inkLevel(THONG)), 3); // tie knot at the toe
  };
  nub(-bHalf*0.72, -h*0.20, -w*0.085, h*0.065);                 // fore leg L (short, tied, angled down)
  nub( bHalf*0.72, -h*0.20,  w*0.085, h*0.065);                 // fore leg R
  if (params.legNubs>2) nub(0, drop*0.3, 0, h*0.07);           // hind leg, tied, pointing down

  // ---- BODY (the plump hide silhouette) ----
  pen.paint(()=>body(g), toneSolid(inkLevel(HIDE)), 6);

  // lit crown of the belly (a soft light wedge so it reads as round, not flat)
  pen.paint(()=>{
    g.moveTo(-shHalf*0.6, yShoulder*0.98);
    g.quadraticCurveTo(-bHalf*0.55, yBulge*1.02, -bHalf*0.15, yBulge*0.6);
    g.quadraticCurveTo(-bHalf*0.3, yShoulder*0.9, -shHalf*0.6, yShoulder*0.98);
    g.closePath();
  }, toneSolid(inkLevel(HIDE_L)), 0);

  // shaded near-flank: a thin crescent hugging the lower-right hide edge
  pen.paint(()=>{
    g.moveTo(bHalf*0.55, yBulge*0.5);
    g.quadraticCurveTo(bHalf*0.98, yBulge*0.9, base*0.85, drop*0.15);
    g.quadraticCurveTo(bHalf*0.6, yBulge*0.4, bHalf*0.55, yBulge*0.5);
    g.closePath();
  }, toneSolid(inkLevel(HIDE_D)), 0);

  // ---- belly fold creases, kept within the wide belly zone (curved, hugging
  //      the local width so they never poke past the narrow base) ----
  const nc = params.creases + (sag?2:0);
  for(let i=0;i<nc;i++){
    const t = (i+1)/(nc+1);
    const yy = lerp(yShoulder*0.75, yBulge*0.45, t);   // stay in the wide belly band
    const hw = bHalf*(0.70 - 0.12*i) * (sag? 0.9 : 1);
    const dz = sag ? h*0.04 : h*0.02;
    pen.seam(()=>{ g.moveTo(-hw, yy); g.quadraticCurveTo(0, yy+dz, hw, yy); }, 2.4);
  }

  // ---- NECK cinched into a SPOUT ----
  pen.paint(()=>{
    g.moveTo(-nHalf, yNeck);
    g.lineTo(-nHalf*0.62, yTie);
    g.lineTo(-nHalf*0.5, yTip);
    g.lineTo( nHalf*0.5, yTip);
    g.lineTo( nHalf*0.62, yTie);
    g.lineTo( nHalf, yNeck);
    g.closePath();
  }, toneSolid(inkLevel(HIDE_D)), 5);

  // leather neck-thong biting in at the cinch
  if (params.neckTie){
    pen.paint(()=>{ g.rect(-nHalf*0.9, yTie-h*0.012, nHalf*1.8, h*0.03); }, toneSolid(inkLevel(THONG)), 3);
    pen.ink(()=>{ g.moveTo(nHalf*0.7, yTie+h*0.005); g.lineTo(nHalf*1.7, yTie+h*0.05); }, 2.4); // loose tail
  }

  // spout: knotted shut (sealed) or an open dark mouth (pouring / offered / empty)
  if (spoutOpen){
    pen.paint(()=>{ g.ellipse(0, yTip, nHalf*0.62, h*0.02, 0,0,7); }, toneSolid(inkLevel(SPOUT)), 3);
  } else {
    pen.paint(()=>{ g.ellipse(0, yTip-h*0.01, nHalf*0.7, nHalf*0.6, 0,0,7); }, toneSolid(inkLevel(SPOUT)), 4);
    pen.ink(()=>{ g.moveTo(-nHalf*0.4, yTip-h*0.01); g.lineTo(nHalf*0.4, yTip-h*0.01); }, 2.2);
  }

  g.restore();
  return { tip, rimW };
}

/* mixing bowl (krater) that catches the diluted pour ---------------- */
function drawBowl(pen, g, cx, cy, w, wine){
  const rTop=w*0.5, rBot=w*0.30, hB=w*0.44;
  // basin
  pen.paint(()=>{
    g.moveTo(cx-rTop, cy-hB);
    g.quadraticCurveTo(cx-rBot*1.1, cy+hB*0.4, cx-rBot, cy);
    g.quadraticCurveTo(cx, cy+hB*0.5, cx+rBot, cy);
    g.quadraticCurveTo(cx+rBot*1.1, cy+hB*0.4, cx+rTop, cy-hB);
    g.closePath();
  }, toneSolid(inkLevel(BOWL)), 5);
  // rim ellipse
  pen.paint(()=>{ g.ellipse(cx, cy-hB, rTop, hB*0.28, 0,0,7); }, toneSolid(inkLevel(BOWL_D)), 4);
  // twin handles
  for(const s of [-1,1]) pen.limb(()=>{
    g.moveTo(cx+s*rTop*0.92, cy-hB*1.0);
    g.quadraticCurveTo(cx+s*rTop*1.24, cy-hB*0.7, cx+s*rTop*0.9, cy-hB*0.35);
  }, toneSolid(inkLevel(BOWL_D)), w*0.045);
  // water/wine surface inside the rim
  const surf = wine ? WINE_M : WATER;
  pen.paint(()=>{ g.ellipse(cx, cy-hB*0.86, rTop*0.86, hB*0.22, 0,0,7); }, toneSolid(inkLevel(surf)), 3);
  // ripple lines on the surface
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
  for(let i=1;i<=2;i++){ g.beginPath(); g.ellipse(cx, cy-hB*0.86, rTop*0.86*(1-i*0.28), hB*0.22*(1-i*0.28), 0,0,7); g.stroke(); }
  g.globalAlpha=1;
}

/* wine stream from a spout tip down to a target y ------------------- */
function drawStream(pen, g, from, toY, t){
  const midY = (from.y+toY)/2;
  const wob = Math.sin(t*5)*4;           // live shimmer
  const kink = 10;                        // fixed lateral lean so it reads as a falling ribbon, not a rod
  const topX = from.x+2, botX = from.x+kink+wob;
  pen.paint(()=>{
    g.moveTo(topX-3, from.y);
    g.quadraticCurveTo(topX+kink*0.5, midY, botX-4, toY);
    g.lineTo(botX+4, toY);
    g.quadraticCurveTo(topX+kink*0.5+7, midY, topX+3, from.y);
    g.closePath();
  }, toneSolid(inkLevel(WINE)), 2.5);
  // a couple of falling droplets past the target
  g.fillStyle=inkLevel(WINE);
  for(let i=0;i<3;i++){ const yy=toY + ((t*160+i*40)%40);
    g.beginPath(); g.arc(botX+Math.sin(i*2)*4, yy, 2.2, 0,7); g.fill(); }
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t     = st.t ?? 0;
  const fill  = st.fill ?? 0.95;
  const tilt  = st.tilt ?? 0;
  const open  = !!st.open;
  const sag   = !!st.sag;
  const strap = !!st.strap;
  const pour  = !!st.pour;
  const bowl  = !!st.bowl;

  // shift the skin up + left when it is pouring so the stream + bowl have room
  const cx = (pour||bowl) ? W*0.38 : W*0.50;
  const cy = (pour||bowl) ? H*0.58 : H*0.70;
  const w  = W*0.52, h = H*0.50;

  // ground contact shadow under the resting base
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, cy+h*0.06, w*(0.30+0.14*(1-fill)), h*0.045, 0,0,7); g.fill();

  // the mixing bowl sits under the spout for the diluted pour
  let bowlTop=null, bx=0, by=0;
  if (bowl){ bx=W*0.72; by=H*0.86; const bw=W*0.30; drawBowl(pen,g,bx,by,bw,true); bowlTop=by-bw*0.44*0.86; }

  // the goatskin
  const { tip } = drawSkin(pen, g, cx, cy, w, h, { fill, tilt, spoutOpen:open||sag, sag });

  // carry cord slung over the neck (carried)
  if (strap){
    g.strokeStyle=inkLevel(CORD); g.lineCap="round";
    g.lineWidth=6;
    g.beginPath();
    g.moveTo(cx-w*0.02, cy-h*0.72);
    g.quadraticCurveTo(cx+w*0.34, cy-h*1.02, cx+w*0.44, cy-h*0.55); // loop up over an unseen shoulder
    g.stroke();
    // hard contour under it
    g.strokeStyle=INK; g.lineWidth=2; g.stroke();
    // knot where the cord meets the neck
    pen.paint(()=>{ g.arc(cx-w*0.02, cy-h*0.72, w*0.03, 0,7); }, toneSolid(inkLevel(CORD)), 3);
  }

  // pour stream from the open spout
  if (pour){
    const toY = bowl ? bowlTop : H*0.92;
    drawStream(pen, g, tip, toY, t);
  }
}

export const asset = {
  id:"prop.marons-wine-skin",
  type:"PROP",
  name:"Maron's Wine Skin",
  statusWord:"SEALED",
  scene:"OD-B09-S05",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","bowl","leg-nubs","hide-body","hide-flank","creases","neck","thong","spout","cord","stream"],
  // normalized 0..1 anchors: spout / grip / contact points
  anchors:{
    "spout:mouth":{x:.50,y:.20},        // the tied neck / pour spout (sealed, upright)
    "grip:neck":{x:.50,y:.28},          // where a hand takes the cinched neck
    "grip:belly":{x:.50,y:.55},         // two-handed lift point on the full belly
    "carry:cord":{x:.66,y:.14},         // shoulder-cord loop point
    "contact:base":{x:.50,y:.76},       // resting base footprint centre
    "pour:target":{x:.72,y:.72},        // where the stream lands (bowl rim / cup)
  },
  // ownership + collision box (AABB in 0..1) for placement / pathing
  owner:"odysseus:marons-gift",
  zones:{ bounds:{ x0:.20,y0:.16,x1:.80,y1:.80 }, footprint:{ x0:.30,y0:.70,x1:.70,y1:.80 } },
  states:{
    initial:"sealed",
    nodes:{
      sealed:  { preview:{ fill:0.98, tilt:0,     open:false, status:"SEALED",  progress:.95 } },
      carried: { preview:{ fill:0.94, tilt:-0.14, open:false, strap:true, status:"CARRIED", progress:.85 } },
      poured:  { preview:{ fill:0.72, tilt:0.60,  open:true,  pour:true, status:"POURED",  progress:.55 } },
      diluted: { preview:{ fill:0.60, tilt:0.60,  open:true,  pour:true, bowl:true, status:"DILUTED", progress:.45 } },
      offered: { preview:{ fill:0.88, tilt:0.30,  open:true,  status:"OFFERED", progress:.75 } },
      emptied: { preview:{ fill:0.06, tilt:0,     open:true,  sag:true, status:"EMPTIED", progress:.05 } },
    },
    edges:[
      ["sealed","carried"],["carried","offered"],["offered","poured"],
      ["poured","diluted"],["diluted","emptied"],["poured","emptied"],
      ["carried","poured"],["offered","sealed"],
    ],
  },
  channels:["fill","tilt","open","pour","bowl","strap","sag","t"],

  preview:()=>({ fill:0.98, tilt:0, open:false, status:"SEALED", progress:.95 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones, owner:asset.owner }; },
};
export default asset;
