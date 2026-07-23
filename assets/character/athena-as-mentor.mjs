/* character.athena-as-mentor — Athena wearing the familiar elder Mentor.
   A DISGUISE variant of character.athena: the goddess takes the shape of
   MENTOR, Odysseus' aged, grey-bearded loyalist of Ithaca — a body the
   household knows and trusts. But she carries it with unmistakable DIVINE
   confidence: she does not stoop or shuffle like a mortal greybeard; she
   stands tall, directs with logistical command, and — in Book II — is the
   secret organizer, the pilot, the source of the ship's supernatural
   propulsion. The mortal shell is complete (weathered skin, a full white
   loyalist's beard, a long robe and cloak) but one tell leaks through: the
   eyes stay unnaturally BRIGHT, an over-lit divine glint no old man owns.
   That bright-eye cue is the continuity thread back to character.athena and
   the thing that separates her from a plain character.mentor.
   Atlas:
     OD-B02-S05 — familiar elder form carrying divine confidence + command.
     OD-B02-S07 — secret organizer, pilot, source of supernatural propulsion. */
import { makeFigure, INK, ACCENT } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Mentor poses: brow + gaze + arm authored together ----
   The hero rig reads expressive facial channels ONLY from the composed pose
   (the scene-state overlay can just smile or draw a frown-line). To land a
   CALM but COMMANDING face — level chin, steady authoritative eyes, a firm
   directive arm — the disguise ships its own poses into the shared registry,
   exactly as character.halitherses does. Convention: armRUpper ~ -1.5 sends
   the RIGHT arm forward level; negative headPitch lifts the chin; point hand
   = one extended finger. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "athena-mentor", n, opt }; };

// THE CARD — LOGISTICAL COMMAND (OD-B02-S05): the elder stands TALL, chin
// level, and lays out an order with a firm forward directive of the right
// arm, index finger extended to the task. The face is calm authority, not
// anger — brows lifted and only lightly knit, eyes steady and a touch
// narrowed with command, mouth just parted mid-instruction. Divine
// confidence in an old man's frame: upright, unhurried, certain.
P("mentor_command", {
  browUp:.30, browKnit:.14, eyeNarrow:.22, frown:0, jaw:.20, mouthAsym:.12,
  headPitch:-.06, neckPitch:-.04, headRoll:.03,
  gazeX:-.16, gazeY:-.02,                        // leveled steadily on the listener
  spineLean:-.06, chestOpen:.55, bodyYaw:-.14, headYaw:-.10,
  armRUpper:-1.28, armRLower:.14, shoulderLiftR:.14,   // right arm forward-and-down, directing
  armLUpper:.24, armLLower:-.26, rootScale:1.05,       // stands tall — divine bearing
}, { hands:["relaxed","point"] });

// MARSHALLING THE LAUNCH (OD-B02-S07): the secret organizer becomes the
// pilot — both arms sweep up and forward as if drawing the ship out to sea,
// commanding the supernatural wind that fills the sail. Chest thrown open,
// a slight forward lean of intent, brows RAISED, eyes WIDE with divine
// purpose, mouth open on the launching word. Energy, not rage.
P("mentor_marshal", {
  browUp:.46, browKnit:.08, eyeWide:.34, eyeNarrow:0, jaw:.38, mouthAsym:.06,
  headPitch:-.08, gazeX:.14, gazeY:-.12,
  spineLean:-.15, chestOpen:1, bodyYaw:.06,
  armLUpper:1.72, armLLower:-.30, shoulderLiftL:.52,   // both arms sweeping up/out
  armRUpper:-1.72, armRLower:.30, shoulderLiftR:.52,
  rootScale:1.05,
}, { hands:["open_palm","open_palm"] });

// COUNSEL — the calm baseline: composed, an open measuring hand, chin level,
// a knowing authoritative half-smile, steady level gaze. The trusted elder
// giving quiet counsel before the command hardens it.
P("mentor_counsel", {
  browUp:.18, browKnit:.06, eyeNarrow:.16, jaw:.14, mouthAsym:.22, smile:.18,
  headPitch:-.02, gazeX:.12, gazeY:0,
  spineLean:-.02, chestOpen:.30, bodyYaw:-.10, headYaw:.06,
  armRUpper:-1.02, armRLower:.60, shoulderLiftR:.06,   // open offering/measuring hand
  armLUpper:.22, armLLower:-.22, rootScale:1.03,
}, { hands:["relaxed","offering"] });

// COMPOSED — nearly still, hands lowered, faint knowing look; the disguise
// simply present in the hall, watched but unreadable, standing straighter
// than any true greybeard would.
P("mentor_still", {
  browUp:.14, browKnit:.06, eyeNarrow:.18, jaw:0, mouthAsym:.16, smile:.10,
  headPitch:-.02, headYaw:-.30, gazeX:-.22, gazeY:0,
  bodyYaw:-.24, spineLean:-.02, rootScale:1.03,
  armLUpper:.20, armLLower:-.16, armRUpper:-.20, armRLower:.14,
}, { hands:["relaxed","relaxed"] });

/* MENTOR shell: an aged loyalist of Ithaca. Weathered skin, a full WHITE
   seer/elder beard + mane (grey light enough to read as age, dark enough to
   register as mass under the dither), a long robe and a cloak. bareLegs off
   — the elder is robed to the ankle. Distinct from the darker sea-captain
   MENTES shell and from young Odysseus' tunic. */
const params = {
  skin:"#cdb89c", hairColor:"#7b776d",
  hair:"curly", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.0,
};

const fig = makeFigure(params);

// --- the divine tell: bright, over-lit eyes that outlast the disguise ---
// Uses the figure's reported head anchor so it tracks pose/band. This is the
// single cue that marks this body as Athena and NOT a plain mortal Mentor.
function drawBrightEyes(ctx, W, H, anchors, state){
  if (!anchors || !anchors.head) return;
  const hx = anchors.head.x * W, hy = anchors.head.y * H;
  const R = Math.min(H*0.9, W*1.26) * (params.scale||1) * 0.105; // mirrors rig headR
  const eyeY = hy - R*0.10;
  const dx = R*0.34;
  const gz = state && state.gaze ? state.gaze : {x:0,y:0};
  const pid = (state && (state.pose||state.band)) || "";
  const profile = /profile/.test(pid);
  const eyes = profile ? [1] : [-1,1];
  for (const es of eyes){
    const ex = hx + es*dx;
    // an over-bright catchlight — the goddess showing through the old man
    ctx.fillStyle = "#fbfbf7";
    ctx.beginPath();
    ctx.arc(ex - R*0.05 + gz.x*R*0.06, eyeY - R*0.05, R*0.065, 0, 7);
    ctx.fill();
  }
}

export const asset = {
  id:"character.athena-as-mentor",
  type:"CHARACTER",
  name:"Athena as Mentor",
  statusWord:"COMMANDING",
  scene:"OD-B02-S05",

  params,
  layers:["shadow","hair-back","legs","torso","robe","far-arm","neck","head","face","hair-front","beard","near-arm","bright-eyes"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.78,y:.56}, leftHand:{x:.34,y:.62},
    directPoint:{x:.88,y:.58}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"command",
    nodes:{
      // OD-B02-S05 — THE beat: divine confidence + logistical command. Elder
      // stands tall and lays out an order with a firm forward directive.
      command:  { preview:{ pose:"mentor_command", gaze:{x:-.16,y:-.02},
                            status:"COMMANDING" } },
      // OD-B02-S07 — the pilot: both arms marshalling the launch, calling the
      // supernatural wind, eyes wide with divine purpose, mouth on the word.
      marshal:  { preview:{ pose:"mentor_marshal", gaze:{x:.14,y:-.12},
                            status:"PILOTING" } },
      // calm counsel — the trusted elder, open measuring hand, knowing look
      counsel:  { preview:{ pose:"mentor_counsel", gaze:{x:.12,y:0} } },
      // composed and present — watched but unreadable
      still:    { preview:{ pose:"mentor_still", gaze:{x:-.22,y:0} } },
      // stable identity turns
      profile:  { preview:{ pose:"profile_left" } },
      back:     { preview:{ pose:"back_view" } },
    },
    edges:[
      ["still","counsel"],["counsel","command"],["command","marshal"],
      ["marshal","counsel"],["command","counsel"],["counsel","still"],
      ["command","profile"],["command","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // SIGNATURE = command: the familiar grey elder standing tall, chin level,
  // laying out an order with a firm forward directive of the arm and a calm
  // authoritative face. The divine tell (over-bright eyes) is painted last.
  preview:()=>({ pose:"mentor_command", gaze:{x:-.16,y:-.02},
                 t:0.4, status:"COMMANDING", progress:.24 }),

  draw(ctx, W, H, state={}){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    const out = fig.draw(ctx, W, H, state) || {};
    // the divine tell, painted last so the bright eyes survive the shell
    drawBrightEyes(ctx, W, H, out.anchors, state);
    return out;
  },
};
export default asset;
