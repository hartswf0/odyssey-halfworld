/* prop.silver-mixing-bowl — an ORNATE FOOTED SILVER KRATER offered as a guest-
   gift: a tall presentation vessel with volute scroll handles, a decorated
   belly, and a stepped molded foot. PROP asset. Distinct from Helen's WIDE
   two-handled mixing bowl — this piece is TALL and ceremonial, a thing to be
   given, wrapped, carried, and stored, then set out again for later use.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.
   Scene function (OD-B04-S06): a reusable ornate portable vessel with five
   states — GIFT (bare on presentation, a soft prestige glow behind it),
   WRAP (a cloth drape folded over the belly + a tie at the neck for the
   journey), CARRY (lifted + slightly tilted, two hands gripping the volute
   handles, ground shadow gone), STORE (set down inside a storage niche/chest
   with a low cover, dimmed), and DISPLAY (later use: stood on a plinth,
   uncovered, a bright band of contents inside the mouth).
   Silver = a LIGHT metal (few dots); the dark interior + the tonal steps on
   the foot moldings and girdle bands read the ornament in monochrome.
   Scale, grip/support/contact anchors, ownership, and collision box declared
   in 0..1 space. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  rimHalf:0.235,     // flaring mouth half-width (fraction of W)
  rimFlat:0.24,      // mouth ellipse flatten (rh = rimHalf*rimFlat)
  rimY:0.200,        // mouth height (tall vessel -> mouth sits high)
  neckHalf:0.135,    // concave neck pinch half-width
  neckY:0.285,
  bellHalf:0.300,    // widest belly half-width (fraction of W)
  bellY:0.440,       // height of the widest belly
  bodyBotY:0.610,    // where the belly narrows into the stem
  waistHalf:0.060,   // stem half-width
  stemBotY:0.665,
  footTopY:0.690,    // top of the stepped foot
  footBaseY:0.800,   // foot rests on the ground here
  footHalf:0.170,    // foot disc half-width (fraction of W)
  girdles:3,         // decorative frieze bands on the belly
  ownedBy:"gift:menelaus->telemachus",  // ownership tag (a parting guest-gift)
};

const BODY   = 3;    // silver body (LIGHT metal)
const BODY_D = 4;    // shoulder / shaded silver
const RIMTONE= 4;    // flared lip band
const INTER  = 6;    // dark hollow interior of the mouth
const FOOT   = 4;    // foot moldings
const FOOT_D = 5;    // deep molding step
const HANDLE = 4;    // volute scroll handles
const CLOTH  = 5;    // wrapping cloth (dark drape)
const CLOTH_D= 6;    // cloth fold shadow
const CONTENT= 2;    // bright contents band (display)

/* belly cross-section: half-width at fraction f from rim(0) to stem join(1). */
function bodyHalf(f){
  f = clamp(f,0,1);
  // rim -> concave neck -> swell to bell -> taper to waist, all in one curve
  const rim = params.rimHalf, neck = params.neckHalf, bell = params.bellHalf, waist = params.waistHalf;
  if (f < 0.28){ const u=f/0.28; return lerp(rim, neck, u*u); }        // flare into neck
  if (f < 0.62){ const u=(f-0.28)/0.34; return lerp(neck, bell, Math.sin(u*Math.PI*0.5)); } // swell
  const u=(f-0.62)/0.38; return lerp(bell, waist, u*u);               // taper to stem
}

/* --------------------------------------------------------------
   VOLUTE SCROLL HANDLE on one side. Rises from the shoulder, arcs
   up past the rim, and curls into a spiral coil (the volute). */
function drawVoluteHandle(pen,g,W,H,cx,side, rimY,rimRh, shoulderY){
  const rootX = cx + side*W*bodyHalf(0.34)*0.98;   // lower root on the shoulder
  const rootY = shoulderY;
  const topX  = cx + side*W*params.neckHalf*1.02;  // upper root near the rim
  const topY  = rimY + rimRh*0.8;
  const outX  = cx + side*W*(params.bellHalf+0.055);
  const peakY = rimY - rimRh*1.4;                  // handle rises above the mouth

  // the C-scroll ribbon (thick limb pushed out so a paper loop opens)
  pen.limb(()=>{
    g.moveTo(topX, topY);
    g.quadraticCurveTo(outX, peakY, outX, (peakY+rootY)/2);
    g.quadraticCurveTo(outX, rootY, rootX, rootY);
  }, toneSolid(inkLevel(HANDLE)), W*0.026);

  // the VOLUTE coil at the top of the handle (a little spiral)
  const coilX = outX, coilY = peakY + rimRh*0.2, r0 = W*0.030;
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
  g.beginPath();
  for(let a=0;a<=Math.PI*2.4;a+=0.25){
    const r = r0*(1 - a/(Math.PI*3.0));
    const x = coilX + Math.cos(a - side*0.6)*r*side;
    const y = coilY + Math.sin(a - side*0.6)*r;
    if (a===0) g.moveTo(x,y); else g.lineTo(x,y);
  }
  g.stroke();
  // filled coil core
  g.fillStyle=inkLevel(BODY_D); g.beginPath(); g.arc(coilX, coilY, r0*0.34, 0,7); g.fill();

  return { grip:{ x:outX, y:(peakY+rootY)/2 } };
}

/* --------------------------------------------------------------
   THE ORNATE SILVER KRATER, drawn in absolute canvas coords.
   Returns key world points for state overlays + anchors. */
function drawKrater(pen,g,W,H, opts={}){
  const cx = W*0.5;
  const rimHalf = W*params.rimHalf;
  const rimY    = H*params.rimY;
  const rimRh   = rimHalf*params.rimFlat;
  const bodyBot = H*params.bodyBotY;
  const stemBot = H*params.stemBotY;
  const footTop = H*params.footTopY;
  const footBase= H*params.footBaseY;
  const footHW  = W*params.footHalf;
  const shoulderY = H*params.neckY + (H*params.bellY - H*params.neckY)*0.35;
  const span    = bodyBot - rimY;
  const halfAt  = f => W*bodyHalf(f);

  // ---- ground shadow (skipped while carried) ----
  if (!opts.airborne){
    g.fillStyle="rgba(0,0,0,0.11)";
    g.beginPath(); g.ellipse(cx, footBase+H*0.006, footHW*1.12, H*0.017, 0,0,7); g.fill();
  }

  // ---- VOLUTE HANDLES (behind the body so the belly overlaps their roots) ----
  const gripL = drawVoluteHandle(pen,g,W,H,cx,-1, rimY,rimRh, shoulderY).grip;
  const gripR = drawVoluteHandle(pen,g,W,H,cx, 1, rimY,rimRh, shoulderY).grip;

  // ---- STEPPED MOLDED FOOT (a spreading base of stacked discs) ----
  pen.paint(()=>{ g.ellipse(cx, footBase, footHW, H*0.020, 0,0,7); }, toneSolid(inkLevel(FOOT_D)), 5); // base disc
  pen.paint(()=>{                                              // trumpet flare
    g.moveTo(cx-footHW*0.94, footBase);
    g.lineTo(cx+footHW*0.94, footBase);
    g.lineTo(cx+W*params.waistHalf*1.15, footTop);
    g.lineTo(cx-W*params.waistHalf*1.15, footTop);
    g.closePath();
  }, toneSolid(inkLevel(FOOT)), 5);
  pen.paint(()=>{ g.ellipse(cx, footTop, footHW*0.44, H*0.012, 0,0,7); }, toneSolid(inkLevel(FOOT_D)), 4); // torus ring
  pen.paint(()=>{ g.ellipse(cx, footBase-H*0.028, footHW*0.80, H*0.014, 0,0,7); }, toneSolid(inkLevel(FOOT_D)), 4); // lower ring
  // ---- STEM between belly and foot ----
  pen.paint(()=>{
    const sw = W*params.waistHalf;
    g.moveTo(cx-sw*0.9, bodyBot); g.lineTo(cx+sw*0.9, bodyBot);
    g.lineTo(cx+sw*1.18, footTop); g.lineTo(cx-sw*1.18, footTop); g.closePath();
  }, toneSolid(inkLevel(FOOT)), 5);
  pen.paint(()=>{ g.ellipse(cx, stemBot, W*params.waistHalf*1.1, H*0.010, 0,0,7); }, toneSolid(inkLevel(FOOT_D)), 3); // stem knop

  // ---- BODY silhouette (rim flare -> concave neck -> bell -> stem) ----
  pen.paint(()=>{
    g.moveTo(cx-rimHalf, rimY);
    // left profile down to the stem join
    for(let i=1;i<=24;i++){ const f=i/24; g.lineTo(cx-halfAt(f), rimY+span*f); }
    // across the bottom
    g.lineTo(cx+halfAt(1), bodyBot);
    // right profile back up to the rim
    for(let i=23;i>=0;i--){ const f=i/24; g.lineTo(cx+halfAt(f), rimY+span*f); }
    // back rim arc closes the flared mouth
    g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(BODY)), 6);

  // ---- shaded shoulder (a darker crescent to give the belly volume) ----
  pen.paint(()=>{
    const f0=0.32, f1=0.60;
    g.moveTo(cx+halfAt(f0)*0.55, rimY+span*f0);
    for(let i=0;i<=8;i++){ const f=lerp(f0,f1,i/8); g.lineTo(cx+halfAt(f)*0.98, rimY+span*f); }
    for(let i=8;i>=0;i--){ const f=lerp(f0,f1,i/8); g.lineTo(cx+halfAt(f)*0.62, rimY+span*f); }
    g.closePath();
  }, toneSolid(inkLevel(BODY_D)), 0);

  // ---- flared LIP band ----
  pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf, rimRh, 0,0,7); }, toneSolid(inkLevel(RIMTONE)), 5);
  // ---- dark hollow interior ----
  pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf*0.86, rimRh*0.86, 0,0,7); }, toneSolid(inkLevel(INTER)), 3);
  // bright contents band inside (only for display/later-use)
  if (opts.contents>0.02){
    pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf*0.80*opts.contents, rimRh*0.80*opts.contents, 0,0,7); },
              toneSolid(inkLevel(CONTENT)), 2);
  }
  // near-rim highlight so the silver lip reads
  pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0.06, Math.PI-0.06); }, toneSolid(inkLevel(BODY-1)), 3);
  pen.seam(()=>{ g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0, Math.PI); }, 3);

  // ---- ORNAMENT: girdle frieze bands + fluting ticks on the belly ----
  for(let i=1;i<=params.girdles;i++){
    const f = 0.34 + i*0.10;
    const yy = rimY+span*f, hw = halfAt(f)*0.98;
    pen.seam(()=>{ g.moveTo(cx-hw,yy); g.lineTo(cx+hw,yy); }, 2.5);
  }
  // a run of engraved ticks on the widest band (the decorated frieze)
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  const fy = rimY+span*0.46, fhw = halfAt(0.46)*0.9;
  for(let k=-5;k<=5;k++){ const x=cx+k*fhw/5.5; g.beginPath(); g.moveTo(x, fy-span*0.03); g.lineTo(x, fy+span*0.03); g.stroke(); }
  // vertical body highlight seam
  pen.seam(()=>{ g.moveTo(cx-rimHalf*0.4, rimY+span*0.14); g.lineTo(cx-halfAt(0.55)*0.5, rimY+span*0.55); }, 2.5);

  return { cx, rimY, rimHalf, rimRh, bellY:H*params.bellY, bodyBot, footBase, footTop,
           gripL, gripR, span, halfAt };
}

/* -------------------------- state overlays -------------------------- */
function drawWrapCloth(pen,g,W,H,K){
  const cx=K.cx, topY=K.rimY+K.rimRh*0.6, botY=K.bodyBot+H*0.01;
  const wHalf=W*(params.bellHalf+0.03);
  // the drape covering the belly (a folded cloth pulled over)
  pen.paint(()=>{
    g.moveTo(cx-wHalf*0.7, topY);
    g.quadraticCurveTo(cx-wHalf*1.05, (topY+botY)/2, cx-wHalf*0.4, botY);
    g.quadraticCurveTo(cx, botY+H*0.03, cx+wHalf*0.4, botY);
    g.quadraticCurveTo(cx+wHalf*1.05, (topY+botY)/2, cx+wHalf*0.7, topY);
    g.quadraticCurveTo(cx, topY-H*0.02, cx-wHalf*0.7, topY);
    g.closePath();
  }, toneSolid(inkLevel(CLOTH)), 6);
  // fold shadows
  g.strokeStyle=inkLevel(CLOTH_D); g.lineWidth=3; g.lineCap="round";
  for(let k=-2;k<=2;k++){
    const x=cx+k*wHalf*0.32;
    g.beginPath(); g.moveTo(x, topY+H*0.01);
    g.quadraticCurveTo(x+wHalf*0.06, (topY+botY)/2, x, botY-H*0.01); g.stroke();
  }
  // the tie / knot gathered at the neck
  pen.paint(()=>{ g.ellipse(cx, topY-H*0.006, W*0.055, H*0.02, 0,0,7); }, toneSolid(inkLevel(CLOTH_D)), 4);
  pen.limb(()=>{ g.moveTo(cx-W*0.06, topY-H*0.02); g.lineTo(cx-W*0.11, topY-H*0.055); }, toneSolid(inkLevel(CLOTH)), W*0.012);
  pen.limb(()=>{ g.moveTo(cx+W*0.06, topY-H*0.02); g.lineTo(cx+W*0.11, topY-H*0.055); }, toneSolid(inkLevel(CLOTH)), W*0.012);
}

function drawHand(pen,g,W,H,x,y,side){
  pen.paint(()=>{ g.ellipse(x, y, W*0.032, W*0.026, side*0.25, 0,7); }, toneSolid(inkLevel(4)), 4);
  // wrist trailing off toward the frame edge
  pen.limb(()=>{ g.moveTo(x,y); g.lineTo(x+side*W*0.09, y-H*0.02); }, toneSolid(inkLevel(3)), W*0.028);
  // knuckle ticks
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(x+i*W*0.008, y-W*0.02); g.lineTo(x+i*W*0.008, y-W*0.008); g.stroke(); }
}

function drawStoreNiche(pen,g,W,H){
  // a shallow storage niche / chest interior behind the vessel (dim frame)
  g.save();
  pen.paint(()=>{ g.rect(W*0.14, H*0.14, W*0.72, H*0.70); }, toneSolid(inkLevel(2)), 5);
  // shelf edge + side walls (darker so the niche reads as recessed)
  pen.paint(()=>{ g.rect(W*0.14, H*0.78, W*0.72, H*0.06); }, toneSolid(inkLevel(4)), 5);
  pen.seam(()=>{ g.moveTo(W*0.14,H*0.14); g.lineTo(W*0.20,H*0.20); }, 3);
  pen.seam(()=>{ g.moveTo(W*0.86,H*0.14); g.lineTo(W*0.80,H*0.20); }, 3);
  // wood/grain hint lines on the shelf
  g.strokeStyle=inkLevel(3); g.lineWidth=2;
  for(let i=1;i<=3;i++){ const y=H*0.78+i*H*0.015; g.beginPath(); g.moveTo(W*0.16,y); g.lineTo(W*0.84,y); g.stroke(); }
  g.restore();
}

function drawPlinth(pen,g,W,H,K){
  // a low display plinth under the foot (later-use)
  const cx=K.cx, py=K.footBase+H*0.004;
  pen.paint(()=>{ g.rect(cx-W*0.22, py, W*0.44, H*0.055); }, toneSolid(inkLevel(4)), 5);
  pen.paint(()=>{ g.rect(cx-W*0.25, py, W*0.50, H*0.014); }, toneSolid(inkLevel(FOOT_D)), 4);
  pen.seam(()=>{ g.moveTo(cx-W*0.22,py+H*0.055); g.lineTo(cx+W*0.22,py+H*0.055); }, 3);
}

/* -------------------------------------------------------------------- */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const wrap    = st.wrap    ?? 0;   // cloth drape over the belly
  const carry   = st.carry   ?? 0;   // lifted + tilted, hands on handles
  const store   = st.store   ?? 0;   // set inside a storage niche
  const display = st.display ?? 0;   // later use: on a plinth, contents inside
  const glow    = st.glow    ?? 0;   // prestige presentation glow behind
  const t       = st.t       ?? 0;

  // ---- STORE niche is drawn first (behind everything) ----
  if (store>0.5) drawStoreNiche(pen,g,W,H);

  // ---- prestige glow behind the gift (soft, light) ----
  if (glow>0.02){
    g.save();
    const gx=W*0.5, gy=H*0.42;
    g.fillStyle=inkLevel(1);
    g.beginPath(); g.ellipse(gx, gy, W*0.42*glow, H*0.30*glow, 0,0,7); g.fill();
    const rings=4;
    for(let i=0;i<rings;i++){
      const phase=((t*0.4+i/rings)%1);
      const rr=W*0.16+phase*W*0.30;
      g.strokeStyle=inkLevel(2+Math.round((1-phase)*1.5)); g.lineWidth=Math.max(1.5,3*(1-phase));
      g.beginPath(); g.ellipse(gx, gy, rr, rr*0.72, 0,0,7); g.stroke();
    }
    g.restore();
  }

  // ---- CARRY transform: lift up + a slight tilt about the belly ----
  const airborne = carry>0.5;
  let K;
  if (carry>0.02){
    const pivX=W*0.5, pivY=H*params.bellY;
    const tilt = 0.10*carry + Math.sin(t*1.4)*0.012*carry;   // gentle sway
    g.save();
    g.translate(0, -H*0.035*carry);
    g.translate(pivX,pivY); g.rotate(tilt); g.translate(-pivX,-pivY);
    K = drawKrater(pen,g,W,H,{ airborne:true, contents:display });
    // map handle grips through the same transform for the hands
    const map=(p)=>({
      x: pivX + (p.x-pivX)*Math.cos(tilt) - (p.y-pivY)*Math.sin(tilt),
      y: (pivY + (p.x-pivX)*Math.sin(tilt) + (p.y-pivY)*Math.cos(tilt)) - H*0.035*carry,
    });
    g.restore();
    const hL=map(K.gripL), hR=map(K.gripR);
    drawHand(pen,g,W,H, hL.x, hL.y, -1);
    drawHand(pen,g,W,H, hR.x, hR.y,  1);
  } else {
    K = drawKrater(pen,g,W,H,{ airborne, contents:display });
  }

  // ---- WRAP cloth over the belly ----
  if (wrap>0.5) drawWrapCloth(pen,g,W,H,K);

  // ---- DISPLAY plinth under the foot (later use) ----
  if (display>0.5) drawPlinth(pen,g,W,H,K);

  // ---- STORE low cover cloth pulled over the mouth (dim) ----
  if (store>0.5){
    g.save(); g.globalAlpha=0.9;
    pen.paint(()=>{ g.ellipse(K.cx, K.rimY-K.rimRh*0.1, K.rimHalf*1.1, K.rimRh*1.2, 0,0,7); }, toneSolid(inkLevel(CLOTH)), 4);
    g.restore();
  }
}

export const asset = {
  id:"prop.silver-mixing-bowl",
  type:"PROP",
  name:"Silver Mixing Bowl",
  statusWord:"GIFT",
  scene:"OD-B04-S06",

  params,
  // back -> front draw order the prop honors
  layers:["niche","glow","shadow","handles","foot","stem","body","shoulder","lip","interior",
          "contents","ornament","wrap","plinth","hands","cover"],
  // normalized 0..1 anchors: grip / support / contact / presentation
  anchors:{
    "rim:mouth":{x:.50,y:.200},          // centre of the flared mouth
    "grip:handle-l":{x:.145,y:.34},      // left volute handle (a carrying grip)
    "grip:handle-r":{x:.855,y:.34},      // right volute handle
    "contact:foot":{x:.50,y:.80},        // molded foot on the ground / plinth
    "support:belly":{x:.50,y:.44},       // widest belly (a cradling support point)
    "present:face":{x:.50,y:.44},        // camera-facing presentation point
    "wrap:knot":{x:.50,y:.22},           // where the wrapping cloth is tied
  },
  // collision box (AABB in 0..1) for placement / pathing
  zones:{ bounds:{ x0:.10,y0:.16,x1:.90,y1:.82 }, footprint:{ x0:.33,y0:.78,x1:.67,y1:.82 } },
  // ownership: a parting guest-gift changing hands
  ownership:{ giver:"Menelaus", receiver:"Telemachus", kind:"guest-gift" },
  states:{
    initial:"gift",
    nodes:{
      gift:   { preview:{ wrap:0, carry:0, store:0, display:0, glow:1, status:"GIFT",     progress:.15 } },
      wrap:   { preview:{ wrap:1, carry:0, store:0, display:0, glow:0, status:"WRAPPED",  progress:.35 } },
      carry:  { preview:{ wrap:1, carry:1, store:0, display:0, glow:0, status:"CARRIED",  progress:.55 } },
      store:  { preview:{ wrap:0, carry:0, store:1, display:0, glow:0, status:"STORED",   progress:.75 } },
      display:{ preview:{ wrap:0, carry:0, store:0, display:1, glow:.6, status:"DISPLAYED",progress:.95 } },
    },
    edges:[["gift","wrap"],["wrap","carry"],["carry","store"],["store","display"],
           ["display","gift"],["carry","wrap"],["store","carry"],["display","store"]],
  },
  channels:["wrap","carry","store","display","glow","t"],

  preview:()=>({ wrap:0, carry:0, store:0, display:0, glow:1, t:0, status:"GIFT", progress:.15 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
