/* prop.mast-ropes-and-beeswax — the binding + hearing-block kit for the Sirens.
   PROP asset. A single reusable object pairing (1) a upright MAST SECTION wound
   with BINDING ROPES — the coil band where Odysseus is lashed to the mast — and
   (2) a lump of BEESWAX with formed EAR-PLUGS, the crew's hearing-block. Drawn in
   SOLID grays + hard contour into the offscreen ctx; the engine dotify pass
   supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B12-S03): the binding/hearing-block apparatus cycling through
   apply / secure / tighten / cut / remove. The rope band's coil COUNT and
   TIGHTNESS drive the lashing (loose -> compressed), a knot + belayed tail appear
   once secured, strain marks read on tighten, frayed severed ends read on cut, and
   on remove the coils are gone (a slack rope coil sits at the mast foot). The
   beeswax cycles soft-lump -> formed ear-plugs -> plugs removed beside the lump.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  mastHWFrac:0.072,   // mast half-width as fraction of W
  mastCXFrac:0.40,    // mast centre x (offset left, leaving room for the wax kit)
  mastTopFrac:0.05,   // masthead y
  mastBotFrac:0.95,   // heel y
  bandCenY:0.44,      // vertical centre of the lashing band
  wood:4,             // ink level for the pine mast
  rope:5,             // ink level for the hemp rope
  wax:4,              // ink level for the beeswax
};

/* per-state pose */
const POSE = {
  apply:   { coils:4, tight:0.22, knot:0, tail:"loose",   cut:0, removed:0, wax:"soft",  status:"APPLY",   progress:0.14 },
  secure:  { coils:6, tight:0.55, knot:1, tail:"belayed", cut:0, removed:0, wax:"plugs", status:"SECURE",  progress:0.40 },
  tighten: { coils:7, tight:1.00, knot:1, tail:"belayed", cut:0, removed:0, wax:"plugs", strain:1, status:"TIGHTEN", progress:0.62 },
  cut:     { coils:6, tight:0.55, knot:1, tail:"belayed", cut:1, removed:0, wax:"plugs", status:"CUT",     progress:0.82 },
  remove:  { coils:0, tight:0,    knot:0, tail:"none",    cut:0, removed:1, wax:"out",   status:"REMOVE",  progress:1.00 },
};

function geom(W,H){
  const mastCX = W*params.mastCXFrac;
  const mastHW = W*params.mastHWFrac;
  const mastTop = H*params.mastTopFrac;
  const mastBot = H*params.mastBotFrac;
  const bandCen = H*params.bandCenY;
  const cleatY  = H*0.745;                 // belaying cleat on the mast
  return { mastCX, mastHW, mastTop, mastBot, bandCen, cleatY };
}

/* a horizontal capsule (rope coil / cleat) sub-path — caller wraps in paint/clip */
function capsule(g, x0, x1, y, r){
  g.moveTo(x0, y-r);
  g.lineTo(x1, y-r);
  g.arc(x1, y, r, -Math.PI/2, Math.PI/2, false);
  g.lineTo(x0, y+r);
  g.arc(x0, y, r,  Math.PI/2, Math.PI*1.5, false);
  g.closePath();
}

/* one rope coil wound across the mast, bulging past both edges */
function drawCoil(g, pen, G, y, r, twistPhase){
  const over = G.mastHW*0.30 + 6;                 // rope bulges past the mast sides
  const x0 = G.mastCX - G.mastHW - over;
  const x1 = G.mastCX + G.mastHW + over;
  pen.paint(()=>capsule(g, x0, x1, y, r), toneSolid(inkLevel(params.rope)), 3);
  g.save(); g.beginPath(); capsule(g, x0, x1, y, r); g.clip();
  // rounded rope: bright top strip, dark underside
  g.fillStyle=inkLevel(3); g.fillRect(x0-2, y-r, (x1-x0)+4, r*0.55);
  g.fillStyle=inkLevel(7); g.fillRect(x0-2, y+r*0.30, (x1-x0)+4, r*0.7);
  // twisted-fibre hatch (the rope's lay)
  g.strokeStyle=INK; g.lineWidth=1.6; g.lineCap="round";
  for(let x=x0-r; x<x1+r; x+=r*0.9){
    g.beginPath(); g.moveTo(x, y+r); g.lineTo(x+r*0.9, y-r); g.stroke();
  }
  g.restore();
  // dark cap ellipses where the rope curves around the mast's back
  g.fillStyle=inkLevel(7);
  g.beginPath(); g.ellipse(x0, y, r*0.55, r, 0,0,7); g.fill();
  g.beginPath(); g.ellipse(x1, y, r*0.55, r, 0,0,7); g.fill();
}

/* beeswax lump organic blob sub-path */
function blob(g, cx, cy, R){
  g.moveTo(cx+R, cy);
  g.bezierCurveTo(cx+R, cy+R*0.72, cx+R*0.5, cy+R*1.06, cx-R*0.12, cy+R*0.98);
  g.bezierCurveTo(cx-R*0.92, cy+R*0.88, cx-R*1.06, cy+R*0.2, cx-R*0.94, cy-R*0.32);
  g.bezierCurveTo(cx-R*0.80, cy-R*1.0, cx-R*0.1, cy-R*1.06, cx+R*0.42, cy-R*0.86);
  g.bezierCurveTo(cx+R*0.92, cy-R*0.70, cx+R*1.02, cy-R*0.38, cx+R, cy);
  g.closePath();
}

function drawBeeswax(g, pen, cx, cy, R, mode){
  // lump
  pen.paint(()=>blob(g,cx,cy,R), toneSolid(inkLevel(params.wax)), 4);
  g.save(); g.beginPath(); blob(g,cx,cy,R); g.clip();
  g.fillStyle=inkLevel(2); g.beginPath(); g.ellipse(cx-R*0.28, cy-R*0.34, R*0.52, R*0.36, -0.3, 0,7); g.fill();
  g.fillStyle=inkLevel(6); g.beginPath(); g.ellipse(cx+R*0.34, cy+R*0.42, R*0.6, R*0.42, 0.1, 0,7); g.fill();
  // kneading dents while still soft
  if (mode==="soft"){
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round"; g.globalAlpha=0.7;
    for(let i=-1;i<=1;i++){ g.beginPath(); g.arc(cx+i*R*0.42, cy+R*0.1, R*0.22, Math.PI*0.15, Math.PI*0.85); g.stroke(); }
    g.globalAlpha=1;
  }
  g.restore();

  // formed / removed ear-plug pair
  if (mode==="plugs" || mode==="out"){
    const pr = R*0.32;
    const plug = (px,py)=>{
      pen.paint(()=>{ g.ellipse(px,py,pr,pr*1.05,0,0,7); }, toneSolid(inkLevel(3)), 3);
      g.fillStyle=inkLevel(1); g.beginPath(); g.arc(px-pr*0.3, py-pr*0.35, pr*0.35, 0,7); g.fill();
      // pinched tip
      g.fillStyle=inkLevel(5); g.beginPath(); g.ellipse(px+pr*0.6, py, pr*0.4, pr*0.5, 0,0,7); g.fill();
    };
    if (mode==="plugs"){ plug(cx+R*1.35, cy-R*0.15); plug(cx+R*1.78, cy+R*0.42); }
    else { plug(cx+R*1.5, cy+R*0.55); plug(cx+R*1.9, cy+R*0.15); } // set aside, out of ears
  }
}

function drawMastRopes(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "secure";
  const P = POSE[mode] || POSE.secure;
  const G = geom(W,H);
  const { mastCX, mastHW, mastTop, mastBot, bandCen, cleatY } = G;

  // ================= MAST SECTION =================
  // shaft
  pen.paint(()=>{ g.rect(mastCX-mastHW, mastTop+18, mastHW*2, mastBot-mastTop-18); },
            toneSolid(inkLevel(params.wood)), 5);
  g.save(); g.beginPath(); g.rect(mastCX-mastHW, mastTop+18, mastHW*2, mastBot-mastTop-18); g.clip();
  // round the spar: bright left, shaded right
  g.fillStyle=inkLevel(2); g.fillRect(mastCX-mastHW+2, mastTop, mastHW*0.34, mastBot-mastTop);
  g.fillStyle=inkLevel(6); g.fillRect(mastCX+mastHW*0.28, mastTop, mastHW*0.72, mastBot-mastTop);
  // long wood grain
  g.strokeStyle=INK; g.lineWidth=1.4; g.lineCap="round"; g.globalAlpha=0.4;
  for(let k=-1;k<=2;k++){ const x=mastCX+k*mastHW*0.5;
    g.beginPath(); g.moveTo(x, mastTop+24); g.lineTo(x+6, mastBot-10); g.stroke(); }
  g.globalAlpha=1; g.restore();

  // masthead cap + sheave
  pen.paint(()=>{ g.rect(mastCX-mastHW*1.18, mastTop, mastHW*2.36, 30); }, toneSolid(inkLevel(6)), 5);
  g.fillStyle=inkLevel(0); g.beginPath(); g.ellipse(mastCX, mastTop+15, mastHW*0.42, 9, 0,0,7); g.fill();
  g.strokeStyle=INK; g.lineWidth=2; g.beginPath(); g.ellipse(mastCX, mastTop+15, mastHW*0.42, 9, 0,0,7); g.stroke();

  // belaying CLEAT (where the lashing tail is made fast) — hidden once ropes removed
  if (P.tail==="belayed" || P.tail==="loose"){
    pen.paint(()=>{ g.rect(mastCX-mastHW*1.7, cleatY-7, mastHW*0.55, 14); }, toneSolid(inkLevel(6)), 3);
    pen.paint(()=>{ g.rect(mastCX-mastHW*1.7, cleatY-16, mastHW*0.55, 9); }, toneSolid(inkLevel(6)), 3);
    pen.paint(()=>{ g.rect(mastCX-mastHW*1.7, cleatY+7,  mastHW*0.55, 9); }, toneSolid(inkLevel(6)), 3);
  }

  // ================= LASHING BAND =================
  const bandH = lerp(H*0.30, H*0.185, P.tight);       // compresses as it tightens
  const bandTop = bandCen - bandH/2, bandBot = bandCen + bandH/2;
  const coilR = clamp(bandH/(P.coils*2.05), 8, 20);

  if (P.coils > 0){
    // strain / creak marks radiating from the taut band
    if (P.strain){
      g.strokeStyle="rgba(0,0,0,0.28)"; g.lineWidth=2.4; g.lineCap="round";
      for(let s=-2;s<=2;s++){
        const yy = bandCen + s*bandH*0.22;
        g.beginPath(); g.moveTo(mastCX-mastHW-16, yy); g.lineTo(mastCX-mastHW-30, yy); g.stroke();
        g.beginPath(); g.moveTo(mastCX+mastHW+16, yy); g.lineTo(mastCX+mastHW+30, yy); g.stroke();
      }
    }
    for(let i=0;i<P.coils;i++){
      const t = P.coils>1 ? i/(P.coils-1) : 0.5;
      const y = lerp(bandTop, bandBot, t);
      if (P.cut && i===Math.floor(P.coils/2)) continue;   // one coil severed
      drawCoil(g, pen, G, y, coilR, i);
    }

    // knot bulge on the front once secured
    if (P.knot){
      const ky = bandCen, kx = mastCX + mastHW*0.15;
      pen.paint(()=>{ g.ellipse(kx, ky, coilR*1.5, coilR*1.9, 0,0,7); }, toneSolid(inkLevel(6)), 3);
      g.strokeStyle=INK; g.lineWidth=1.8;
      g.beginPath(); g.moveTo(kx-coilR, ky-coilR*0.9); g.lineTo(kx+coilR, ky+coilR*0.9); g.stroke();
      g.beginPath(); g.moveTo(kx+coilR, ky-coilR*0.9); g.lineTo(kx-coilR, ky+coilR*0.9); g.stroke();
    }

    // belayed tail running down from the band to the cleat
    if (P.tail==="belayed"){
      g.strokeStyle=INK; g.lineWidth=coilR*0.8; g.lineCap="round";
      g.beginPath();
      g.moveTo(mastCX-mastHW*0.6, bandBot-coilR);
      g.bezierCurveTo(mastCX-mastHW*1.4, bandBot+40, mastCX-mastHW*1.5, cleatY-40, mastCX-mastHW*1.42, cleatY);
      g.stroke();
      g.strokeStyle=inkLevel(3); g.lineWidth=coilR*0.4; g.stroke();
    } else if (P.tail==="loose"){
      // one loose rope end dangling free, not yet made fast
      g.strokeStyle=INK; g.lineWidth=coilR*0.8; g.lineCap="round";
      g.beginPath();
      g.moveTo(mastCX+mastHW*0.4, bandBot-coilR);
      g.bezierCurveTo(mastCX+mastHW*1.6, bandBot+50, mastCX+mastHW*1.2, cleatY-30, mastCX+mastHW*1.9, cleatY+20);
      g.stroke();
      // frayed free end
      g.lineWidth=2; g.strokeStyle=INK;
      for(let f=-2;f<=2;f++){ g.beginPath(); g.moveTo(mastCX+mastHW*1.9, cleatY+20);
        g.lineTo(mastCX+mastHW*1.9+f*5, cleatY+42); g.stroke(); }
    }

    // severed / frayed ends for the cut state
    if (P.cut){
      const cy = bandCen;
      g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
      for(const dir of [-1,1]){
        const ex = mastCX + dir*(mastHW+8);
        for(let f=-2;f<=2;f++){
          g.beginPath(); g.moveTo(ex, cy-6);
          g.lineTo(ex + dir*14 + f*3, cy-6 + f*4); g.stroke();
        }
      }
    }
  }

  // ================= REMOVED: slack rope coil at the mast foot =================
  if (P.removed){
    const rx = mastCX, ry = H*0.80;
    for(let r=1;r<=4;r++){
      pen.paint(()=>{ g.ellipse(rx, ry, mastHW*0.5+r*10, 9+r*3, 0, 0, 7); }, toneSolid(inkLevel(params.rope)), 3);
    }
    // fibre lay across the coil
    g.strokeStyle=INK; g.lineWidth=1.4; g.globalAlpha=0.6;
    for(let a=0;a<Math.PI*2;a+=0.5){
      const rr=mastHW*0.5+42;
      g.beginPath(); g.moveTo(rx+Math.cos(a)*rr*0.4, ry+Math.sin(a)*14);
      g.lineTo(rx+Math.cos(a)*rr, ry+Math.sin(a)*22); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ================= BEESWAX + EAR-PLUGS =================
  drawBeeswax(g, pen, W*0.74, H*0.80, W*0.062, P.wax);
}

export const asset = {
  id:"prop.mast-ropes-and-beeswax",
  type:"PROP",
  name:"Mast Ropes and Beeswax",
  statusWord:"SECURE",
  scene:"OD-B12-S03",

  params,
  // back -> front draw order the module honors
  layers:["mast","masthead","cleat","strain","coils","knot","tail","cut-ends","rope-pile","beeswax","ear-plugs"],

  // normalized 0..1 attachment / support / contact anchors
  anchors:{
    "grip:masthead":{x:.40,y:.07},     // top of the spar (halyard sheave)
    "bind:torso":{x:.40,y:.44},        // the lashing band — where a body is lashed to the mast
    "knot:front":{x:.42,y:.44},        // the securing knot
    "belay:cleat":{x:.28,y:.745},      // cleat the tail is made fast to
    "contact:heel":{x:.40,y:.94},      // mast heel / foot
    "rope:pile":{x:.40,y:.80},         // slack coil once removed
    "wax:lump":{x:.74,y:.80},          // the beeswax lump
    "plug:left":{x:.83,y:.79},         // formed ear-plug
    "plug:right":{x:.86,y:.83},        // formed ear-plug
  },
  // collision shape: the standing spar (asset space)
  collision:{ kind:"capsule", a:{x:.40,y:.05}, b:{x:.40,y:.95}, r:.075 },
  ownership:"odysseus",                // the ship's mast; wax kneaded for the crew

  states:{
    initial:"apply",
    nodes:{
      apply:   { preview:{ mode:"apply",   status:"APPLY",   progress:0.14 } },
      secure:  { preview:{ mode:"secure",  status:"SECURE",  progress:0.40 } },
      tighten: { preview:{ mode:"tighten", status:"TIGHTEN", progress:0.62 } },
      cut:     { preview:{ mode:"cut",     status:"CUT",     progress:0.82 } },
      remove:  { preview:{ mode:"remove",  status:"REMOVE",  progress:1.00 } },
    },
    edges:[
      ["apply","secure"],["secure","tighten"],["tighten","secure"],
      ["tighten","cut"],["secure","cut"],["cut","remove"],["secure","remove"],
    ],
  },
  channels:["mode","tight","strain","t"],

  preview:()=>({ mode:"secure", status:"SECURE", progress:0.40, t:0 }),
  draw(ctx,W,H,state){ drawMastRopes(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
