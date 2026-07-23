/* character.nestor — aged king of Pylos, gracious host, and the vast living
   archive of the Trojan war. CHARACTER asset on the HALFTRACK hero rig: a very
   old man — white beard and mane, long robe and cloak, a staff at his side,
   dignified and upright despite his years. His whole function is memory: he
   receives Telemachus as a host, then opens like a book and pours out the war.

   Scene function:
     OD-B03-S02  aged king shifting from HOST to LIVING ARCHIVE of the war
     OD-B03-S03  narrator MAPPING strategic choices — regret + exact route memory
     OD-B03-S04  mentor holding up remembered REVENGE as warning and model
     OD-B03-S05  awed host converting revelation into PRAYER

   EXPRESSIVENESS: the hero rig reads facial channels (browUp, browKnit,
   eyeWide, eyeNarrow, frown, jaw, mouthAsym) from the composed POSE, and the
   scene-state `mouth` overlay can only smile or draw a frown-line. The states
   Nestor must hit — the far-off reminiscing gaze of a storyteller, the regret
   of mapping a route only he remembers, the raised warning finger, the upward
   awe of prayer — need brow + gaze + arm authored TOGETHER. So Nestor ships
   bespoke poses into the shared POSE registry (the same module instance the
   hero figure reads) so the card and every state actually EMOTE. */
import { makeFigure } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Nestor poses: brow + gaze + arm authored together ----
   Convention (mirrors halitherses): negative headPitch + negative gazeY casts
   the eyes UP; armRUpper near -2.0 lifts the RIGHT arm; open_palm = a measured
   orator's hand, point = one finger. Nestor's baseline is a slight forward
   stoop (spineLean small +) and a lifted, dignified chin. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "nestor", n, opt }; };

// THE CARD — STORYTELLING: the signature the prompt asks for. Right hand lifted
// in a slow, measured orator's gesture (open palm, held mid-height, not thrust);
// the reflective/reminiscing FACE — brows RAISED soft and even, eyes lifted and
// slid off-frame into memory, a faint knit of concentration, mouth barely parted
// as the next remembered line forms. An old man watching the war replay behind
// his eyes.
P("nestor_telling", {
  browUp:.50, browKnit:.14, eyeWide:.10, eyeNarrow:.06, frown:0, jaw:.10,
  headPitch:-.14, neckPitch:-.08, headRoll:.05,
  gazeX:.34, gazeY:-.42,                        // eyes drifting up-and-away, remembering
  spineLean:.05, bodyYaw:-.10, headYaw:.12,     // upright, chin lifted, turned to his hand
  armRUpper:-2.14, armRLower:.60, shoulderLiftR:.44,   // right hand raised head-high, telling
  armLUpper:.20, armLLower:-.26,                // left arm rests toward the staff
}, { hands:["relaxed","open_palm"] });

// HOST — receiving the young guest: chest opened, both arms turned outward in
// welcome, warm lifted brows and a real smile, gaze level and attentive on the
// visitor. Gracious xenia before the memory opens.
P("nestor_host", {
  smile:.42, browUp:.34, eyeWide:.12, jaw:.14,
  chestOpen:.85, spineLean:-.06, headPitch:-.04,
  bodyYaw:.04, headYaw:-.06, gazeX:-.14, gazeY:.06,   // level, on the guest
  armLUpper:1.02, armLLower:-.30, armRUpper:-1.02, armRLower:.30,
  shoulderLiftL:.24, shoulderLiftR:.24,
}, { hands:["open_palm","open_palm"] });

// ARCHIVE — the living archive: hands lower, head tilts back a touch, the gaze
// goes long and unfocused, brows lift high and knit faintly. The host has
// dissolved into pure remembering. Still, inward, vast.
P("nestor_archive", {
  browUp:.58, browKnit:.20, eyeNarrow:.14, jaw:.06,
  headPitch:-.20, neckPitch:-.12, headRoll:.07,
  gazeX:.20, gazeY:-.54,                         // far off, into the war years
  spineLean:.08, bodyYaw:-.06, headYaw:.10,
  armRUpper:-.86, armRLower:.60, shoulderLiftR:.18,   // one hand half-lifted, recalling
  armLUpper:.22, armLLower:-.20,
}, { hands:["relaxed","offering"] });

// MAPPING — narrating strategic choices with REGRET and exact route memory:
// the arm drops to trace a route across an imagined map, index finger extended,
// eyes following the traced line downward, brows lifted AND knit hard (the ache
// of a choice remembered), mouth open on the telling. He sees the whole voyage.
P("nestor_mapping", {
  browUp:.36, browKnit:.52, eyeNarrow:.22, frown:.16, mouthAsym:.10,
  jaw:.44,                                       // speaking the route aloud
  headPitch:.24, neckPitch:.14, headRoll:-.04,
  gazeX:-.30, gazeY:.34,                          // eyes down, following his finger on the map
  spineLean:-.16, bodyYaw:-.12, headYaw:-.10, chestOpen:.20,
  armRUpper:-1.34, armRLower:.66, shoulderLiftR:.10,   // arm out and down, tracing
  armLUpper:.24, armLLower:-.18, rootScale:1.01,
}, { hands:["relaxed","point"] });

// WARNING — holding up remembered revenge (Orestes) as warning and model: the
// raised admonishing finger, brow knit hard under lifted inner ends, eyes
// narrowed and stern, jaw half-open on the grave lesson. "Let it be a model
// to you." Old-king authority.
P("nestor_warning", {
  browKnit:.62, browUp:.28, eyeNarrow:.34, frown:.20, jaw:.34,
  spineLean:-.10, headPitch:-.02, headYaw:.08, gazeX:.18, gazeY:-.06,
  armRUpper:-2.16, armRLower:.54, shoulderLiftR:.52,   // raised warning finger
  armLUpper:.24, armLLower:-.16, rootScale:1.02,
}, { hands:["relaxed","point"] });

// PRAYER — awed host converting revelation into prayer: both arms lifted and
// opened to the sky, palms up, chin raised, eyes WIDE and cast up in wonder,
// brows high, mouth open on the invocation. The archive stops; only reverence.
P("nestor_prayer", {
  browUp:.72, browKnit:.06, eyeWide:.48, jaw:.42,
  headPitch:-.34, neckPitch:-.20, headRoll:0,
  gazeX:.06, gazeY:-.66,                          // lifted to the goddess
  spineLean:-.10, chestOpen:.70, bodyYaw:0, headYaw:0,
  armLUpper:2.34, armLLower:-.28, armRUpper:-2.34, armRLower:.28,
  shoulderLiftL:.62, shoulderLiftR:.62, rootY:-.02,
}, { hands:["palm_up","palm_up"] });

const params = {
  // very old: weathered warm skin, a WHITE mane + full patriarch's beard.
  // hairColor a light-mid grey: light enough to read as a WHITE-haired elder
  // next to the dark-bearded younger men, dark enough that the full patriarch's
  // beard + mane carry real halftone mass and don't vanish into the skin.
  skin:"#d6c5a8", hairColor:"#8f8b81",
  hair:"curly", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.0,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.nestor",
  type:"CHARACTER",
  name:"Nestor",
  statusWord:"REMEMBERING",
  scene:"OD-B03-S02",

  params,
  layers:["shadow","hair-back","legs","torso","robe","far-arm","neck","head","face","hair-front","beard","near-arm","staff"],
  // normalized 0..1 anchors for scene attachment / gaze / props / staff
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.70,y:.34}, leftHand:{x:.34,y:.62},
    staffGrip:{x:.33,y:.40}, staffFoot:{x:.31,y:.93},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
    hearth:{x:.20,y:.60}, sky:{x:.62,y:.10},
  },
  states:{
    initial:"telling",
    nodes:{
      // THE beat / signature — the storyteller's raised hand + reminiscing face
      telling:  { preview:{ pose:"nestor_telling", gaze:{x:.34,y:-.42}, status:"REMEMBERING" } },
      // OD-B03-S02a — the gracious host receiving the guest
      host:     { preview:{ pose:"nestor_host", gaze:{x:-.14,y:.06}, status:"HOSTING" } },
      // OD-B03-S02b — dissolving from host into the living archive
      archive:  { preview:{ pose:"nestor_archive", gaze:{x:.20,y:-.54}, status:"ARCHIVING" } },
      // OD-B03-S03 — mapping strategic choices with regret + route memory
      mapping:  { preview:{ pose:"nestor_mapping", gaze:{x:-.30,y:.34}, status:"MAPPING" } },
      // OD-B03-S04 — remembered revenge held up as warning and model
      warning:  { preview:{ pose:"nestor_warning", gaze:{x:.18,y:-.06}, status:"WARNING" } },
      // OD-B03-S05 — revelation converted into prayer
      prayer:   { preview:{ pose:"nestor_prayer", gaze:{x:.06,y:-.66}, status:"PRAYING" } },
      // stable identity turns
      profile:  { preview:{ pose:"profile_left" } },
      back:     { preview:{ pose:"back_view" } },
    },
    edges:[
      ["telling","host"],["host","archive"],["archive","telling"],
      ["telling","mapping"],["mapping","warning"],["warning","prayer"],
      ["prayer","telling"],["telling","profile"],["telling","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "browUp","browKnit","eyeWide","eyeNarrow","jaw","frown","mouthAsym"],

  // EXPRESSIVE signature — REMEMBERING: a very old king with a raised
  // storyteller's hand and a face gone reflective — brows lifted, eyes drifted
  // up-and-away into the war years, mouth just parting on the next line. No
  // `mouth` overlay field so the reminiscing gaze in the pose can't be flattened.
  preview:()=>({ pose:"nestor_telling", gaze:{x:.34,y:-.42}, t:0.4,
                 status:"REMEMBERING", progress:.22 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // pass the whole state through: pose, gaze, mouth, blink, t all reach the rig
    const out = fig.draw(ctx, W, H, state);

    // ---- staff: a tall knotted elder's staff held at his left side, drawn in
    // solid grays + hard contour so the engine POST pass halftones it with the
    // rest. Anchored to the reported left-hand position when available. ----
    try {
      const a = out && out.anchors;
      const lh = a && a.leftHand;
      // plant the staff just OUTSIDE his left hand so the pole clears the
      // shoulder/arm mass and reads as a separate vertical element.
      const gx = (lh ? lh.x : .34) * W - W*.045;
      const gy = (lh ? lh.y : .60) * H;
      const topY = gy - H*.20;               // rises to about chest/neck height
      const footY = H*.925;                   // plants near the ground line
      const lean = W*.010;                    // slight lean, foot tucked inward
      ctx.save();
      ctx.lineCap="round"; ctx.lineJoin="round";
      // contour underlay
      ctx.strokeStyle="#141414"; ctx.lineWidth=W*.028;
      ctx.beginPath(); ctx.moveTo(gx, topY); ctx.lineTo(gx+lean, footY); ctx.stroke();
      // wood fill
      ctx.strokeStyle="#565651"; ctx.lineWidth=W*.015;
      ctx.beginPath(); ctx.moveTo(gx, topY); ctx.lineTo(gx+lean, footY); ctx.stroke();
      // knotted head of the staff
      ctx.fillStyle="#565651"; ctx.strokeStyle="#141414"; ctx.lineWidth=W*.010;
      ctx.beginPath(); ctx.arc(gx, topY, W*.022, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.restore();
    } catch(e){ /* staff is decorative; never block the figure render */ }
    return out;
  },
};
export default asset;
