/* character.poseidon — the sea-god of storms, earth-shaker.
   CHARACTER asset. Scene function (OD-B05-S05): the distant god operates
   storm, wave, and wind as extensions of his anger — a trident-raised
   smiting figure looming over the water. Built on the HALFTRACK hero rig:
   a powerful, broad, wild-bearded god, bare-torsoed under a cloak, hair and
   beard breaking like sea-foam. He is DISTINCT from Zeus by the TRIDENT he
   grips overhead and the wave motifs that churn at his feet.

   EXPRESSIVENESS: the rig only emotes from the composed POSE (a scene-state
   mouth overlay can make a smile/frown-line but never a wrathful OPEN shout).
   So Poseidon ships his own bespoke poses in the shared registry, each fusing
   a hard-knit brow + a bared open-mouthed roar + the trident arm. The trident
   and churning sea are drawn as a props layer OVER the figure, anchored to the
   grip hand the rig reports, so they follow whatever pose is driven. */
import { makeFigure, gray, shade, INK, LW } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Poseidon poses: brow + jaw + trident arm authored together ----
   Registered into the shared rig registry (the same module instance the hero
   figure reads) so preview()/states can name them like any built-in pose. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "poseidon", n, opt }; };

// THE CARD — wrathful smiting: brow knit HARD, eyes narrowed to storm-slits,
// mouth bared open in a roar, LEFT arm flung overhead gripping the trident,
// right arm sweeping out over the sea, forward lean, looming (rootScale>1).
P("poseidon_smite", {
  browKnit:1, browUp:.10, eyeNarrow:.28, frown:.55, mouthAsym:.12,
  jaw:.72,                                   // OPEN — a roar over the water
  spineLean:-.20, headPitch:-.05, chestOpen:.40,
  bodyYaw:-.07, headYaw:-.12, gazeX:-.30, gazeY:.06,   // near-frontal: BOTH brows + roar read
  armLUpper:2.42, armLLower:-.12, shoulderLiftL:.7,    // left arm high: trident raised, held inward
  armRUpper:-1.02, armRLower:.30,            // right arm sweeps out over the sea
  handRotL:-.15, shoulderLiftR:.16, rootScale:1.0,
}, { hands:["fist","point"] });             // left FIST grips the shaft

// storm-command — leveled, distant control of the water: brow knit, mouth
// firm-set, right arm extended low and flat, pushing the swell. Trident still
// gripped overhead but the face is cold, not roaring. The distant counterpoint.
P("poseidon_storm", {
  browKnit:.55, browUp:.06, eyeNarrow:.42, frown:.24, jaw:.05,
  spineLean:-.06, headPitch:.04, headYaw:.16, gazeX:.34, gazeY:.12,
  armLUpper:2.4, armLLower:-.16, shoulderLiftL:.64,    // trident held aloft
  armRUpper:-1.30, armRLower:-.10,           // right arm flat, low, sweeping the sea
  rootScale:1.0,
}, { hands:["fist","open_palm"] });

// wrath-peak — the earth-shaker at full fury: jaw wide, brow crushed down,
// chest thrown open, trident driven straight up. The apex of the beat.
P("poseidon_wrath", {
  browKnit:1, browUp:.16, eyeNarrow:.2, frown:.4, mouthAsym:.14,
  jaw:.72,                                    // wide open — the shout
  spineLean:-.14, headPitch:-.08, chestOpen:.6,
  bodyYaw:-.05, headYaw:-.08, gazeX:-.2, gazeY:-.04,
  armLUpper:2.5, armLLower:-.08, shoulderLiftL:.78,
  armRUpper:-2.34, armRLower:.2, shoulderLiftR:.55,     // both arms up — total fury
  rootScale:1.03,
}, { hands:["fist","fist"] });

// grim calm — the god at rest on the swell: trident planted at his side, level
// heavy-lidded stare, mouth closed. The still, watchful base state.
P("poseidon_calm", {
  browKnit:.14, browUp:.02, eyeNarrow:.2, frown:.06, jaw:0,
  headPitch:.03, gazeX:0, gazeY:.06,
  armLUpper:.34, armLLower:-.20,             // left arm low at side: trident planted
  armRUpper:-.22, armRLower:.14,
}, { hands:["fist","relaxed"] });

const params = {
  skin:"#c9b393", hairColor:"#3a3a36",   // sea-weathered skin, wild storm-dark mane + beard
  hair:"curly", beard:true, glasses:false,
  garment:"bare", cloak:true, bareLegs:true, scale:0.9,   // bare torso, cloak off one shoulder
};

const fig = makeFigure(params);

/* ---- props layer: the TRIDENT + churning sea, drawn OVER the rig ----
   Solid grays + hard INK contour (no pre-dither — the engine POST pass makes
   the dots). Anchored to the grip hand the rig reports so it tracks the pose. */
const BRONZE = "#6a6a62", BRONZE_D = "#3a3a36";

function drawTrident(ctx, hx, hy, W, H, raised){
  // The tined HEAD is pinned to a fixed high point so the three prongs (the
  // Poseidon silhouette) always stay inside the card, whatever the pose. The
  // shaft runs from the grip hand up to that head and down to a butt.
  const headY = H*0.135;                              // fixed high anchor for the fork
  const headX = hx + (W*0.5 - hx)*0.42;               // pull toward centre for framing margin
  const down  = raised ? H*0.22 : H*0.30;             // butt below the hand
  const head = { x: headX, y: headY };
  const bdir = Math.atan2(hy-headY, hx-headX);        // shaft direction hand->butt
  const butt = { x: hx + Math.cos(bdir)*down, y: hy + Math.sin(bdir)*down };
  const shaftW = W*0.017;

  // --- shaft: black casing then bronze core (capsule) ---
  ctx.lineCap="round"; ctx.lineJoin="round";
  ctx.strokeStyle=INK; ctx.lineWidth=shaftW+LW*2.2;
  ctx.beginPath(); ctx.moveTo(butt.x,butt.y); ctx.lineTo(head.x,head.y); ctx.stroke();
  ctx.strokeStyle=BRONZE; ctx.lineWidth=shaftW;
  ctx.beginPath(); ctx.moveTo(butt.x,butt.y); ctx.lineTo(head.x,head.y); ctx.stroke();
  // shaft grip-rings
  ctx.strokeStyle=INK; ctx.lineWidth=Math.max(2,W*0.006);
  const dir = { x:(head.x-butt.x), y:(head.y-butt.y) };
  const dl = Math.hypot(dir.x,dir.y)||1; dir.x/=dl; dir.y/=dl;
  const perp = { x:-dir.y, y:dir.x };
  for (const f of [0.30,0.42,0.54]){
    const gx=butt.x+dir.x*dl*f, gy=butt.y+dir.y*dl*f;
    ctx.beginPath();
    ctx.moveTo(gx-perp.x*shaftW*.6, gy-perp.y*shaftW*.6);
    ctx.lineTo(gx+perp.x*shaftW*.6, gy+perp.y*shaftW*.6);
    ctx.stroke();
  }

  // --- the three-tined head (the Poseidon silhouette) ---
  const span = W*0.075;                 // half-spread of the outer tines
  const tineLen = H*0.085;              // how far the tines rise above the crossbar
  const cross = head;                   // crossbar sits at the head point
  // crossbar (where the tines meet the shaft)
  ctx.strokeStyle=INK; ctx.lineWidth=shaftW*1.35;
  ctx.beginPath();
  ctx.moveTo(cross.x-perp.x*span, cross.y-perp.y*span);
  ctx.lineTo(cross.x+perp.x*span, cross.y+perp.y*span);
  ctx.stroke();
  ctx.strokeStyle=BRONZE_D; ctx.lineWidth=shaftW*0.7;
  ctx.beginPath();
  ctx.moveTo(cross.x-perp.x*span, cross.y-perp.y*span);
  ctx.lineTo(cross.x+perp.x*span, cross.y+perp.y*span);
  ctx.stroke();

  // a barbed tine: base -> curves out -> spikes to a point, drawn as a filled
  // slim prong so it reads solid under the dot pass.
  const tine = (side)=>{
    const bx = cross.x + perp.x*span*side, by = cross.y + perp.y*span*side; // outer base
    const tipx = bx + dir.x*tineLen*1.06 + perp.x*(side===0?0:span*0.10*side);
    const tipy = by + dir.y*tineLen*1.06 + perp.y*(side===0?0:span*0.10*side);
    const w = shaftW*0.62;
    // black casing
    ctx.strokeStyle=INK; ctx.lineCap="round";
    ctx.lineWidth=w+LW*1.7;
    ctx.beginPath();
    ctx.moveTo(bx,by);
    ctx.quadraticCurveTo(bx+dir.x*tineLen*.5+perp.x*side*span*.18,
                         by+dir.y*tineLen*.5+perp.y*side*span*.18, tipx,tipy);
    ctx.stroke();
    ctx.strokeStyle=BRONZE; ctx.lineWidth=w;
    ctx.beginPath();
    ctx.moveTo(bx,by);
    ctx.quadraticCurveTo(bx+dir.x*tineLen*.5+perp.x*side*span*.18,
                         by+dir.y*tineLen*.5+perp.y*side*span*.18, tipx,tipy);
    ctx.stroke();
    // spearpoint tip
    ctx.fillStyle=INK;
    ctx.beginPath();
    ctx.moveTo(tipx-perp.x*w*.9-dir.x*2, tipy-perp.y*w*.9-dir.y*2);
    ctx.lineTo(tipx+dir.x*w*1.9, tipy+dir.y*w*1.9);
    ctx.lineTo(tipx+perp.x*w*.9-dir.x*2, tipy+perp.y*w*.9-dir.y*2);
    ctx.closePath(); ctx.fill();
  };
  tine(-1); tine(1); tine(0);   // centre tine last, sits on top
}

function drawSea(ctx, W, H){
  // A low band of churning swell he stands over — light grays so the dot pass
  // reads it as WATER, not a slab. Crest lines + foam curls, flat solids only.
  const baseY = H*0.905, bandH = H*0.024, step = W/6;
  for (let b=0; b<2; b++){
    const y = baseY + b*bandH*1.9;
    const tone = gray(214 - b*20);      // very light -> the dots stay sparse
    ctx.fillStyle=tone; ctx.strokeStyle=INK; ctx.lineWidth=Math.max(2,W*0.005);
    ctx.beginPath();
    const amp = bandH*(1.0+b*0.3);
    ctx.moveTo(-10, y);
    for (let x=-10, k=0; x<=W+step; x+=step, k++){
      const cx=x+step*0.5, cy=y - (k%2? amp: -amp*0.3);
      ctx.quadraticCurveTo(cx, cy, x+step, y);
    }
    ctx.lineTo(W+10, H+10); ctx.lineTo(-10, H+10); ctx.closePath();
    ctx.fill(); ctx.stroke();
    // foam curls on the crests
    ctx.lineWidth=Math.max(1.5,W*0.0035);
    for (let x=step*0.5; x<W; x+=step){
      ctx.beginPath(); ctx.arc(x, y-amp*0.5, bandH*0.32, Math.PI*0.05, Math.PI*0.9); ctx.stroke();
    }
  }
}

export const asset = {
  id:"character.poseidon",
  type:"CHARACTER",
  name:"Poseidon",
  statusWord:"WRATHFUL",
  scene:"OD-B05-S05",

  params,
  layers:["sea-back","shadow","hair-back","legs","torso","cloak","far-arm",
          "neck","head","face","hair-front","beard","near-arm","trident","sea-front"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.22}, crown:{x:.50,y:.13}, eyes:{x:.50,y:.23},
    rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.28},
    tridentGrip:{x:.34,y:.28}, tridentHead:{x:.36,y:.06},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.95}, seaLine:{x:.50,y:.94},
  },
  states:{
    initial:"calm",
    nodes:{
      // grim watchful rest — trident planted at his side, level heavy stare
      calm:    { preview:{ pose:"poseidon_calm", gaze:{x:0,y:.06} } },
      // THE scene beat: distant operator of the storm — trident aloft, right
      // arm sweeping flat over the swell, cold narrowed eyes
      storm:   { preview:{ pose:"poseidon_storm", gaze:{x:.34,y:.12}, status:"STORM" } },
      // wrathful smiting — trident raised, roar open, brow crushed down
      smiting: { preview:{ pose:"poseidon_smite", gaze:{x:-.30,y:.06}, status:"WRATHFUL" } },
      // apex of fury — both arms up, jaw wide, the earth-shaker
      wrath:   { preview:{ pose:"poseidon_wrath", gaze:{x:-.2,y:-.04}, status:"EARTH-SHAKER" } },
      // stable identity turn
      profile: { preview:{ pose:"profile_left" } },
    },
    edges:[
      ["calm","storm"],["storm","smiting"],["smiting","wrath"],
      ["wrath","storm"],["smiting","calm"],["calm","profile"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // EXPRESSIVE signature — WRATHFUL: brow knit hard, eyes narrowed to slits,
  // mouth bared open in a roar, trident flung overhead, right arm sweeping the
  // sea, forward lean. No `mouth` field — the open roar lives in the pose so
  // the mouth overlay can't flatten it to a smile.
  preview:()=>({ pose:"poseidon_smite", gaze:{x:-.30,y:.06}, t:0.4,
                 status:"WRATHFUL", progress:.26 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // churning sea behind the god first
    drawSea(ctx, W, H);
    // the figure (rig reports normalized hand anchors)
    const out = fig.draw(ctx, W, H, state) || {};
    // the trident, gripped in the LEFT hand the rig reports
    const st = state || {};
    const pose = st.pose || "poseidon_smite";
    const raised = pose !== "poseidon_calm" && pose !== "profile_left";
    const lh = (out.anchors && out.anchors.leftHand) || { x:.34, y: raised?.28:.62 };
    drawTrident(ctx, lh.x*W, lh.y*H, W, H, raised);
    return out;
  },
};
export default asset;
