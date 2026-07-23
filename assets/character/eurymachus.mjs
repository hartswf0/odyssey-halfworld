/* character.eurymachus — the smooth, handsome ringleader of the suitors.
   CHARACTER asset. A young noble who ridicules the eagle-omen and redirects
   the hall's fear into a threat of social punishment. Built on the engine
   hero rig. Silhouette: taller athletic build, clean-shaven, sleek dark
   styled hair, a fine noble ROBE with a mantled cloak (well-dressed, moneyed)
   — deliberately distinct from Odysseus (bearded, curls, tunic) and the
   slighter beardless Telemachus. Expression is the point: a scornful smirk
   (skewed mouth, one lifted brow, narrowed eyes) over a dismissive gesture.
   Atlas Book 2: OD-B02-S03. */
import { makeFigure } from "/engine/halfworld-engine.mjs";

const params = {
  skin:"#d9c1a0", hairColor:"#20180f",
  hair:"short", beard:false, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.04,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.eurymachus",
  type:"CHARACTER",
  name:"Eurymachus",
  statusWord:"SCORNFUL",
  scene:"OD-B02-S03",

  params,
  layers:["shadow","hair-back","legs","torso","cloak","far-arm","neck","head","face","hair-front","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.68,y:.58}, leftHand:{x:.33,y:.62},
    scepterGrip:{x:.70,y:.55}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"scornful",
    nodes:{
      // Baseline: a smooth, superior calm — chin high, three-quarter poise,
      // the faint smug half-smile and a single raised brow already reading.
      neutral:   { preview:{ pose:"three_quarter_right", gaze:{x:.24,y:-.06},
                             smile:.14, mouthAsym:.4, browUp:.28, eyeNarrow:.14, t:0.5 } },
      // THE SIGNATURE — scornful smirk: mouth skewed hard to one side, one brow
      // arched up while the other narrows, half-lidded contempt, and the loose
      // dismissive forearm of the skepticism pose flicked up as if brushing the
      // omen away. Gaze slides down his nose at the speaker.
      scornful:  { preview:{ pose:"skepticism", smile:.22, mouthAsym:.82,
                             browUp:.5, browKnit:.28, eyeNarrow:.5,
                             gaze:{x:-.28,y:.14}, t:0.4 } },
      // OD-B02-S03 core: openly RIDICULING the omen — a mocking shrug, palms
      // turned up ("so a couple of birds fought — what of it?"), brows flung up,
      // a wide derisive grin with the corner still skewed. Jaw parts on a laugh.
      ridiculing:{ preview:{ pose:"shrug", smile:.6, jaw:.34, mouthAsym:.5,
                             browUp:.62, eyeNarrow:.2,
                             gaze:{x:.14,y:-.04}, t:0.45 } },
      // …then redirecting fear toward SOCIAL PUNISHMENT — the smile drops into a
      // hard confrontational point, brows knit, a threat leveled at the prophet.
      threatening:{ preview:{ pose:"confrontation", frown:.42, browKnit:.72,
                              eyeNarrow:.42, mouthAsym:.24,
                              gaze:{x:.36,y:-.04}, t:0.5 } },
      // Mid-taunt oration — arm thrown out pointing, jaw dropped on a jeer.
      taunting:  { preview:{ pose:"pointing_arm", jaw:.5, smile:.4, mouthAsym:.36,
                             browUp:.34, eyeNarrow:.16, gaze:{x:-.4,y:-.02}, t:0.5 } },
      // Cool aggressor at rest — arms crossed, appraising, contempt banked.
      appraising:{ preview:{ pose:"arms_crossed", smile:.1, mouthAsym:.34,
                             browUp:.3, eyeNarrow:.34, gaze:{x:-.2,y:.06}, t:0.5 } },
    },
    edges:[
      ["neutral","scornful"],["scornful","ridiculing"],["ridiculing","threatening"],
      ["threatening","neutral"],["neutral","taunting"],["taunting","scornful"],
      ["neutral","appraising"],["appraising","scornful"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — SCORNFUL: the handsome suitor's contempt in one frame.
  // Mouth wrenched to one side in a smirk, one brow arched while the other
  // narrows, heavy half-lids, gaze cast down the nose, and the loose flick of
  // a dismissive forearm brushing the omen aside.
  preview:()=>({ pose:"skepticism",
                 smile:.22, mouthAsym:.82, browUp:.5, browKnit:.28, eyeNarrow:.5,
                 gaze:{x:-.28,y:.14}, t:0.4, status:"SCORNFUL", progress:.2 }),

  draw(ctx, W, H, state){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
