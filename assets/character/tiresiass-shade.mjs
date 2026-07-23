/* character.tiresiass-shade — the blind Theban prophet, met among the dead.
   CHARACTER asset. In the House of Hades (OD-B11-S03) Odysseus lets the
   shade of Tiresias drink the dark blood; the prophet gains temporary
   clarity and delivers a structured conditional future ("IF you leave the
   cattle of the Sun untouched... BUT if you harm them...").

   Built on the HALFTRACK hero rig. Distinct silhouette: a gaunt, BALD old
   seer in a long robe + cloak, a full pale beard, leaning on a GOLD
   ring-topped staff (drawn as a bespoke prop over the figure). BLIND — the
   eyes stay closed/blank (high blink) so he reads sightless. He is a shade,
   so the whole figure is drawn faint (paper bleeds through the dot pass) —
   but LESS faint than a common shade: as he drinks the blood he gains
   clarity, so his alpha lifts and the gold staff stays nearly solid.

   EXPRESSIVENESS: the rig only reads face channels from the composed POSE +
   a thin scene overlay, so Tiresias ships bespoke poses into the shared
   registry, each fusing a grave brow (raised AND knit), a blind lidded
   stare, an open prophesying jaw, a staff-gripping right hand and a solemn
   pointing/raised left arm. That is what lets the card actually EMOTE. */
import { makeFigure, HERO_POSES, INK } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke Tiresias poses (additive; shared table) ----
   Conventions: right hand grips the staff (armR reaches to the right side);
   left arm lifts to point/prophesy; blindness rides on `blink` in the state,
   not the pose. jaw>0 = speaking the prophecy aloud. */

// THE CARD — prophesying with clarity: right hand planted on the gold staff,
// left arm raised with a pointing finger tracing the conditional future,
// chin level-to-lifted, brows raised AND knit in grave augury, jaw OPEN on
// the oracle, eyes closed/sightless. Leaning, gaunt, solemn.
HERO_POSES.tir_prophesy = { id:"tir_prophesy", label:"prophesying", group:"tiresias",
  n:{ browUp:.5, browKnit:.42, eyeNarrow:.3, frown:.12, jaw:.5, mouthAsym:.08,
      headPitch:-.06, neckPitch:-.04, headRoll:.05,
      spineLean:-.06, bodyYaw:-.06, headYaw:.08,
      armRUpper:-.34, armRLower:.42, shoulderLiftR:.04,     // right hand grips staff at his side
      armLUpper:2.06, armLLower:-.28, shoulderLiftL:.56,    // left arm raised high, pointing
      rootScale:.99 },
  opt:{ hands:["point","fist"] } };

// leaning on the staff — quiet, waiting for the blood. Both hands rest on the
// staff top, head bowed low, brows knit, mouth closed. A stooped, sightless,
// patient hush before the clarity comes.
HERO_POSES.tir_lean = { id:"tir_lean", label:"leaning on staff", group:"tiresias",
  n:{ browUp:.22, browKnit:.34, eyeNarrow:.42, frown:.16, jaw:0,
      headPitch:.30, neckPitch:.16, headRoll:.06, headY:.10,
      spineLean:.14, bodyYaw:-.04,
      armRUpper:-.42, armRLower:.60,                        // right hand on staff at his side
      armLUpper:.30, armLLower:.95, handRotL:.2,            // left hand crosses to the staff too
      rootScale:.98 },
  opt:{ hands:["relaxed","relaxed"] } };

// the clarity — the moment the dark blood gives him sight of the future.
// Chin lifted, jaw wide on the revelation, brows flung up, one hand still on
// the staff, the other lifted open. The most "present" (least faint) beat.
HERO_POSES.tir_clarity = { id:"tir_clarity", label:"gaining clarity", group:"tiresias",
  n:{ browUp:.8, browKnit:.2, eyeNarrow:.16, jaw:.66,
      headPitch:-.22, neckPitch:-.12, headRoll:0,
      spineLean:-.14, chestOpen:.4, bodyYaw:-.04,
      armRUpper:-.40, armRLower:.45,                        // right hand on staff at his side
      armLUpper:2.18, armLLower:-.2, shoulderLiftL:.62,     // left hand lifted open, high
      rootScale:1.01 },
  opt:{ hands:["open_palm","fist"] } };

const params = {
  skin:"#d9d4c9", hairColor:"#a39e90",   // pale shade skin; wispy grey seer's beard (light-ish => reads faint but present)
  hair:"bald", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:0.98,
};

const fig = makeFigure(params);

/* ---- the GOLD ring-topped staff, drawn as a bespoke prop over the figure ----
   Rendered in solid grays + hard contour (the engine's POST pass supplies the
   dots). Gold reads as a BRIGHT metallic rod (light-mid gray, few dots) with a
   black contour and a ring finial, so it stands clear of the dark robe. Placed
   from the returned right-hand anchor: shaft runs ground->grip->finial. */
function drawStaff(ctx, hx, hy, W, H){
  const x = hx;
  const foot = H*0.935;                 // planted on the ground
  const top  = Math.min(hy - H*0.155, H*0.24);  // ring finial above the grip
  const goldLo = "#8f8a72";             // shaded side of the rod
  const goldHi = "#cdc7ac";             // lit face of the rod (bright => reads gold)
  const shaftW = Math.max(6, W*0.016);
  // shaft: black contour, then a bright core, then a lit highlight sliver
  ctx.lineCap="round";
  ctx.strokeStyle=INK; ctx.lineWidth=shaftW+8;
  ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, foot); ctx.stroke();
  ctx.strokeStyle=goldLo; ctx.lineWidth=shaftW;
  ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, foot); ctx.stroke();
  ctx.strokeStyle=goldHi; ctx.lineWidth=shaftW*0.42;
  ctx.beginPath(); ctx.moveTo(x - shaftW*0.22, top); ctx.lineTo(x - shaftW*0.22, foot); ctx.stroke();
  // three metal bands along the shaft (prophet's instrument)
  ctx.strokeStyle=INK; ctx.lineWidth=Math.max(2.5, W*0.006);
  for (const f of [0.34, 0.5, 0.66]){
    const by = top + (foot-top)*f;
    ctx.beginPath(); ctx.moveTo(x - shaftW*0.62, by); ctx.lineTo(x + shaftW*0.62, by); ctx.stroke();
  }
  // ring finial: a gold torus at the top (bright annulus, black contour)
  const R = Math.max(14, W*0.05), r = R*0.5;
  ctx.strokeStyle=INK; ctx.lineWidth=Math.max(3, W*0.007);
  ctx.fillStyle=goldHi;
  ctx.beginPath(); ctx.arc(x, top - R*0.55, R, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle="#ffffff";               // punch the ring hole
  ctx.beginPath(); ctx.arc(x, top - R*0.55, r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  // a couple of shading strokes on the ring so it reads round/metallic
  ctx.strokeStyle=goldLo; ctx.lineWidth=Math.max(2.5, W*0.006);
  ctx.beginPath(); ctx.arc(x, top - R*0.55, (R+r)/2, Math.PI*0.15, Math.PI*0.85); ctx.stroke();
}

/* blind eyes: draw closed/blank lids over the rig's eyes so no pupil shows.
   Uses the returned eye anchor; a flat lid line + a faint sunken shadow reads
   as sightless. Kept faint under the shade alpha. */
function drawBlindEyes(ctx, ex, ey, W){
  const dx = W*0.052, w = W*0.03;
  ctx.strokeStyle=INK; ctx.lineCap="round";
  for (const s of [-1, 1]){
    const cx = ex + s*dx;
    // blank the socket to paper so any pupil underneath is covered
    ctx.fillStyle="#efeee9";
    ctx.beginPath(); ctx.ellipse(cx, ey, w*1.05, w*0.7, 0, 0, Math.PI*2); ctx.fill();
    // closed lid line
    ctx.lineWidth=Math.max(2.5, W*0.006);
    ctx.beginPath(); ctx.moveTo(cx-w, ey+w*0.1); ctx.quadraticCurveTo(cx, ey+w*0.5, cx+w, ey+w*0.1); ctx.stroke();
    // lash/lower crease hint
    ctx.lineWidth=Math.max(1.5, W*0.003);
    ctx.beginPath(); ctx.moveTo(cx-w*0.7, ey+w*0.42); ctx.lineTo(cx+w*0.7, ey+w*0.42); ctx.stroke();
  }
}

export const asset = {
  id:"character.tiresiass-shade",
  type:"CHARACTER",
  name:"Tiresias's shade",
  statusWord:"PROPHESYING",
  scene:"OD-B11-S03",

  params,
  layers:["shadow","hair-back","legs","robe","torso","far-arm","neck","head","face","beard","near-arm","blind-eyes","staff"],
  // normalized 0..1 anchors for scene attachment / gaze / the staff prop
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    rightHand:{x:.66,y:.50}, leftHand:{x:.32,y:.34},
    staffFoot:{x:.66,y:.93}, staffGrip:{x:.66,y:.50}, staffTop:{x:.66,y:.28},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"prophesy",
    nodes:{
      // THE beat — prophesying with clarity, staff planted, pointing arm up
      prophesy: { preview:{ pose:"tir_prophesy", blink:.92, clarity:true,
                            gaze:{x:0,y:0}, status:"PROPHESYING" } },
      // stooped, sightless, leaning on the staff before he drinks — faintest
      leaning:  { preview:{ pose:"tir_lean", blink:.96, gaze:{x:0,y:.2},
                            status:"WAITING" } },
      // the surge of clarity from the blood — chin up, jaw wide, hand lifted
      clarity:  { preview:{ pose:"tir_clarity", blink:.9, clarity:true,
                            gaze:{x:0,y:-.1}, status:"CLEAR-SIGHTED" } },
      // stable identity turns
      profile:  { preview:{ pose:"profile_left", blink:.94, gaze:{x:0,y:0} } },
      neutral:  { preview:{ pose:"neutral_front", blink:.94, gaze:{x:0,y:0} } },
    },
    edges:[
      ["leaning","clarity"],["clarity","prophesy"],["prophesy","leaning"],
      ["prophesy","profile"],["prophesy","neutral"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band","blink","clarity","solid",
            "browUp","browKnit","eyeWide","eyeNarrow","jaw","frown","mouthAsym"],

  // EXPRESSIVE signature — PROPHESYING: leaning on the gold ring-topped staff,
  // left arm raised with a pointing finger, chin level, brows raised AND knit
  // in grave augury, jaw open on the oracle, eyes closed/sightless. Faint (a
  // shade) but clearer than the common dead as the blood gives him sight.
  preview:()=>({ pose:"tir_prophesy", blink:.92, clarity:true, gaze:{x:0,y:0},
                 t:0.45, status:"PROPHESYING", progress:.2 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    const st = state || {};
    // a shade: draw the figure faint. LESS faint than a common shade, and
    // clearer still on the clarity/prophesy beats as the blood gives him sight.
    const alpha = st.solid ? 1 : (st.clarity ? 0.72 : 0.58);
    ctx.save();
    ctx.globalAlpha = alpha;
    const r = fig.draw(ctx, W, H, st);
    ctx.restore();
    // blind eyes over the face (a touch more present than the body)
    const eye = (r.anchors && r.anchors.head) || { x:.5, y:.2 };
    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha + 0.18);
    drawBlindEyes(ctx, eye.x*W, (eye.y*H) - H*0.012, W);
    ctx.restore();
    // the gold staff — nearly solid, the one clear object he carries
    const hand = (r.anchors && r.anchors.rightHand) || { x:.66, y:.5 };
    ctx.save();
    ctx.globalAlpha = st.solid ? 1 : 0.9;
    drawStaff(ctx, hand.x*W, hand.y*H, W, H);
    ctx.restore();
    return r;
  },
};
export default asset;
