/* character.telemachus — the young prince of Ithaca, Odysseus' son.
   CHARACTER asset. Grieving youth who is roused to alertness, performs
   hospitality, and — at his father's return — first asserts kingship.
   Built on the engine hero rig. Youthful silhouette: slighter build,
   shorter stature, beardless, dark short hair, princely tunic + cloak.
   Atlas Book 1 scenes: OD-B01-S03..S06. */
import { makeFigure } from "/engine/halfworld-engine.mjs";

const params = {
  skin:"#d8c3a2", hairColor:"#2a2118",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:0.9,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.telemachus",
  type:"CHARACTER",
  name:"Telemachus",
  statusWord:"GRIEVING",
  scene:"OD-B01-S03",

  params,
  layers:["shadow","hair-back","legs","torso","cloak","far-arm","neck","head","face","hair-front","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.22}, crown:{x:.50,y:.14}, eyes:{x:.50,y:.23},
    rightHand:{x:.66,y:.62}, leftHand:{x:.34,y:.62},
    cupGrip:{x:.66,y:.58}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"grieving",
    nodes:{
      // OD-B01-S03: grief that becomes alert, then performs hospitality.
      // Each node sets its OWN face channels (gaze/mouth/blink) so it does not
      // inherit the signature frown; brows/jaw/arms ride on the emotion pose.
      grieving:    { preview:{ pose:"grief", gaze:{x:-.12,y:.62}, mouth:-1, blink:.3 } },        // downcast, oblique brows, hand to chest
      alert:       { preview:{ pose:"lean_forward", gaze:{x:.22,y:-.12}, mouth:-.15, blink:0 } }, // head snaps up, leaning in
      hospitality: { preview:{ pose:"offering_hand", gaze:{x:.25,y:.02}, mouth:.55, blink:.05 } },// warm host, open mouth mid-word
      // OD-B01-S04: quietly ashamed, skeptical of hope
      ashamed:     { preview:{ pose:"head_lowered", gaze:{x:-.14,y:.42}, mouth:-.45, blink:.22 } },
      skeptical:   { preview:{ pose:"skepticism", gaze:{x:-.24,y:0}, mouth:-.1, blink:0 } },      // asym brow, narrowed eyes, arm folded up
      // OD-B01-S05: absorbing counsel that converts grief into a future
      listening:   { preview:{ pose:"lean_forward", gaze:{x:.1,y:-.05}, mouth:-.05, blink:0 } },
      // OD-B01-S06: astonished recognition, then first assertion of authority
      astonished:  { preview:{ pose:"desperation", gaze:{x:.12,y:-.16}, mouth:-.25, blink:0 } },  // brows fly up, eyes wide, mouth open (jaw), arms flung
      command:     { preview:{ pose:"confrontation", gaze:{x:.32,y:-.06}, mouth:-.28, blink:0 } },// knit brow, frown, pointing/fist
      neutral:     { preview:{ pose:"neutral", gaze:{x:0,y:0}, mouth:0, blink:0 } },
    },
    edges:[
      ["grieving","alert"],["alert","hospitality"],["hospitality","neutral"],
      ["grieving","ashamed"],["ashamed","skeptical"],["skeptical","listening"],
      ["listening","astonished"],["astonished","command"],
      ["command","neutral"],["neutral","grieving"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band"],

  // Signature card: a downcast young prince mid-grief — head lowered, inner
  // brows raised + knit (the oblique grief brow), mouth pulled down, heavy
  // lids, and a hand drawn up toward the chest. Arms gesture, face emotes.
  preview:()=>({ pose:"grief", gaze:{x:-.12,y:.62}, mouth:-1, blink:.3, t:0.4, status:"GRIEVING", progress:.18 }),

  draw(ctx, W, H, state){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
