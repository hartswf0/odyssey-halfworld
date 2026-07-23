/* character.eurylochus — Odysseus's cautious second-in-command.
   CHARACTER asset built on the engine hero rig. A sturdy, middle-aged
   veteran crewman: weathered skin, SHORT GRAYING hair + a full grizzled
   BEARD, plain sailor's TUNIC with a travel CLOAK, planted stocky build.
   Deliberately distinct from Odysseus (dark curls, kingly bearing) and
   from the young beardless sailors — this is the wary old hand who counts
   the exits. Expression is the point: a suspicious hold-back warning and
   an apprehensive knit-browed frown.
   Atlas Book 10: OD-B10-S03 / S04 / S07. */
import { makeFigure, HERO_POSES } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke poses, registered additively onto the shared rig table so the
   runtime can drive them by id. Three signatures the young sailors never
   strike: the flat-palm hold-back warning, the frozen-in-dread crouch, and
   the two-handed warding refusal of a traumatized dissenter. ---- */

// A flat "stop / hold back" palm thrown up on the right while the body rocks
// back onto its heels, weight recoiling from what's ahead. Brows knit, eyes
// narrowed, a suspicious downturned mouth. THIS is the card signature.
HERO_POSES.wary_warning = {
  id:"wary_warning", label:"wary hold-back warning", group:"emotion",
  n:{ bodyYaw:-.30, spineLean:.16, headYaw:-.12, weightShift:.3, pelvisX:-.12,
      armRUpper:-1.32, armRLower:-.82, handRotR:.16, shoulderLiftR:.38,
      armLUpper:.46, armLLower:-.52, handRotL:-.2,
      browKnit:.62, eyeNarrow:.42, frown:.32, mouthAsym:.3, gazeX:-.22 },
  opt:{ hands:["relaxed","stop"] },
};

// The hidden observer FREEZING: body shrinks and twists away, shoulders hunch,
// both hands snatch up toward the chest, eyes blown wide, brows fly up AND knit
// in dread, jaw parts on a held breath. Coiled to bolt.
HERO_POSES.dread_freeze = {
  id:"dread_freeze", label:"frozen in dread", group:"emotion",
  n:{ bodyYaw:.36, spineLean:.22, headYaw:-.34, rootScale:.95, rootY:.03,
      armLUpper:-.68, armLLower:-1.52, armRUpper:.60, armRLower:1.44,
      shoulderLiftL:.5, shoulderLiftR:.5,
      eyeWide:.72, browUp:.6, browKnit:.42, jaw:.28, frown:.34,
      gazeX:-.55, gazeY:-.06 },
  opt:{ hands:["open_palm","open_palm"] },
};

// Traumatized dissenter RESISTING the return: both arms flung up warding it
// off, body braced back, a cornered desperation — brows lifted and knit, eyes
// wide, mouth open on a refusal. Pushing the whole voyage away.
HERO_POSES.dissenter_resist = {
  id:"dissenter_resist", label:"resisting the return", group:"emotion",
  n:{ spineLean:.30, bodyYaw:-.12, rootScale:1.0,
      armLUpper:.92, armRUpper:-.92, armLLower:-.88, armRLower:.88,
      handRotL:-.3, handRotR:.3,
      browUp:.68, browKnit:.5, eyeWide:.4, frown:.55, jaw:.34,
      gazeX:.1, gazeY:-.04 },
  opt:{ hands:["stop","stop"] },
};

const params = {
  skin:"#c8ad8c", hairColor:"#565049",   // weathered skin, dark iron-gray hair + grizzled beard
  hair:"short", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:1.02,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.eurylochus",
  type:"CHARACTER",
  name:"Eurylochus",
  statusWord:"WARY",
  scene:"OD-B10-S03",

  params,
  layers:["shadow","hair-back","legs","torso","cloak","far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.67,y:.50}, leftHand:{x:.35,y:.62},
    swordGrip:{x:.36,y:.60}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // Baseline: the wary old hand at rest — guarded three-quarter stance,
      // weight banked back, brows already knit, gaze cut sidelong, mouth set
      // in a permanent faint suspicion. Never quite at ease.
      neutral:   { preview:{ pose:"guarded_withdrawal", browKnit:.34, eyeNarrow:.3,
                             frown:.16, mouthAsym:.18, gaze:{x:-.4,y:.06}, t:0.5 } },
      // THE SIGNATURE — the suspicious hold-back warning: flat palm thrown up,
      // body recoiling, knit-browed apprehensive frown. (OD-B10-S03 core.)
      warning:   { preview:{ pose:"wary_warning",
                             browKnit:.62, eyeNarrow:.42, frown:.34, mouthAsym:.3,
                             gaze:{x:-.22,y:.04}, t:0.4 } },
      // OD-B10-S03: leading the party forward with GROWING suspicion — a
      // guarded forward point, but the brow stays knit and the gaze rakes the
      // treeline. Advancing, distrusting every step.
      suspicious_leading:{ preview:{ pose:"pointing_arm", browKnit:.5, eyeNarrow:.4,
                             frown:.24, mouthAsym:.2, gaze:{x:-.5,y:.02}, t:0.5 } },
      // OD-B10-S04: the hidden observer FREEZING in dread — hunched, hands
      // snatched up, eyes blown wide, breath held.
      dread:     { preview:{ pose:"dread_freeze",
                             eyeWide:.72, browUp:.6, browKnit:.42, jaw:.28, frown:.34,
                             gaze:{x:-.55,y:-.06}, t:0.45 } },
      // …then FLEEING — the freeze breaks into a hard scramble away, a
      // backward glance of terror over the shoulder.
      fleeing:   { preview:{ pose:"walk_neutral", browUp:.4, browKnit:.4, eyeWide:.45,
                             frown:.3, jaw:.22, gaze:{x:-.6,y:-.02}, t:0.3 } },
      // OD-B10-S07: the traumatized dissenter RESISTING the return — both
      // arms up warding the voyage off, cornered and desperate.
      resisting: { preview:{ pose:"dissenter_resist",
                             browUp:.68, browKnit:.5, eyeWide:.4, frown:.55, jaw:.34,
                             gaze:{x:.1,y:-.04}, t:0.5 } },
      // Grinding through the argument — head bowed, jaw set, grief banked into
      // stubbornness. The dissent that won't be talked down.
      dissenting:{ preview:{ pose:"head_lowered", frown:.4, browKnit:.5,
                             eyeNarrow:.24, mouthAsym:.2, gaze:{x:.04,y:.3}, t:0.5 } },
    },
    edges:[
      ["neutral","warning"],["warning","suspicious_leading"],
      ["suspicious_leading","dread"],["dread","fleeing"],["fleeing","neutral"],
      ["neutral","resisting"],["resisting","dissenting"],["dissenting","neutral"],
      ["warning","dread"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — WARY: the second-in-command's caution in one frame. A
  // flat hold-back palm thrown up, the sturdy body rocked back on its heels,
  // brows knit hard over narrowed distrustful eyes, and a downturned frown —
  // a veteran counting the exits before anyone else has noticed the danger.
  preview:()=>({ pose:"wary_warning",
                 browKnit:.62, eyeNarrow:.42, frown:.34, mouthAsym:.3,
                 gaze:{x:-.22,y:.04}, t:0.4, status:"WARY", progress:.2 }),

  draw(ctx, W, H, state){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
