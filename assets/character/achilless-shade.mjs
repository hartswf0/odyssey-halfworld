/* character.achilless-shade — the pale ghost of the greatest of the Achaeans.
   CHARACTER asset. In the House of Hades (OD-B11-S07) Odysseus finds the
   shade of Achilles — a powerful young armored hero — and praises his glory
   among the dead. Achilles answers with STRIPPED-DOWN REGRET (he would
   rather be a hired hand among the living than king of all the perished
   dead), then is REVIVED to pride by news that his son Neoptolemus fights
   like a hero, and strides off across the field of asphodel, head high.

   Built on the HALFTRACK hero rig. Distinct silhouette: a tall, strong,
   BEARDLESS young warrior in ARMOR with bare warrior's legs — but rendered
   as a SHADE: pale skin, ghostly LIGHT ink (the figure drawn faint so the
   dotify pass thins the ink and lets the paper bleed through), lower body
   washing out into the asphodel. Strong build carried by an up-scaled rig.

   EXPRESSIVENESS: the rig reads face channels from the composed POSE + a
   thin scene overlay, so Achilles ships bespoke poses into the shared
   registry — each fusing a specific brow/jaw/gaze with an ARM gesture. That
   is the whole emotional arc: bowed regret (head down, palm turned up in
   weary "what use was glory") -> revived pride (chest flung open, chin
   lifted, arm raised) -> a proud martial stride. */
import { makeFigure, HERO_POSES } from "/engine/halfworld-engine.mjs";

/* ---- bespoke Achilles poses (additive; shared table). Distinct ids so they
   never collide with any other performer's poses. ---- */

// THE CARD — stripped-down regret, speaking. Head bowed heavy, gaze cast down
// into the pit, brows shot up AND knit in sorrow, mouth open on the bitter
// confession, the right hand turned palm-up in a weary "what was any of it
// worth" gesture, the left arm hanging spent. A great warrior emptied out.
HERO_POSES.ach_regret = { id:"ach_regret", label:"stripped-down regret", group:"achilles",
  n:{ browUp:.58, browKnit:.52, frown:.55, jaw:.38, eyeNarrow:.16, mouthAsym:.12,
      headPitch:.56, neckPitch:.3, headY:.14, headRoll:.04,
      spineLean:-.16, chestOpen:-.1, bodyYaw:-.06, gazeY:.5,
      shoulderLiftL:-.14, shoulderLiftR:-.14,               // shoulders sunk, caved-in
      armRUpper:-.9, armRLower:.74, handRotR:.15,           // right hand turned open, palm-up
      armLUpper:.16, armLLower:-.12,                        // left arm hangs heavy at his side
      rootScale:1.02 },
  opt:{ hands:["relaxed","palm_up"] } };

// speaking the confession — mid-line, still bowed but chin a touch more level,
// jaw wide on the vowel, one hand lifted open toward Odysseus at the pit.
HERO_POSES.ach_confess = { id:"ach_confess", label:"confessing among the dead", group:"achilles",
  n:{ browUp:.5, browKnit:.4, frown:.34, jaw:.6, eyeNarrow:.1,
      headPitch:.22, neckPitch:.1, headY:.06,
      spineLean:.02, bodyYaw:-.05, gazeY:.24, gazeX:.12,
      armRUpper:-1.04, armRLower:.46, shoulderLiftR:.08,    // right hand lifted, offering
      armLUpper:.22, armLLower:-.18,
      rootScale:1.03 },
  opt:{ hands:["relaxed","offering"] } };

// REVIVED by news of his son — the great heart flares. Chest flung open, chin
// lifted, brows up, a fierce proud half-smile breaking through, one arm thrown
// high. The instant the shade remembers what he is.
HERO_POSES.ach_revived = { id:"ach_revived", label:"revived by his son's fame", group:"achilles",
  n:{ browUp:.5, browKnit:.06, smile:.32, eyeWide:.3, jaw:.34,
      headPitch:-.24, neckPitch:-.12, headRoll:-.03,
      spineLean:-.12, chestOpen:.9, bodyYaw:-.05,
      armLUpper:2.28, armLLower:-.2, shoulderLiftL:.66,     // left arm flung up, exultant
      armRUpper:-.7, armRLower:.28, shoulderLiftR:.12,      // right arm open at his side
      rootScale:1.08 },
  opt:{ hands:["open_palm","fist"] } };

// striding off across the asphodel, head high — proud martial gait, chest out,
// chin up, brows level, a set fierce jaw. Great strides on the news of his boy.
HERO_POSES.ach_stride = { id:"ach_stride", label:"striding off proud", group:"achilles",
  n:{ browUp:.18, browKnit:.16, eyeNarrow:.14, smile:.14,
      headPitch:-.16, neckPitch:-.08, headYaw:.1, gazeX:.16,
      spineLean:-.08, chestOpen:.5, walkSpeed:1,
      armRUpper:-.34, armLUpper:.34,
      rootScale:1.07 },
  opt:{ hands:["fist","relaxed"], action:"walk", loop:true } };

// martial identity turn — a proud beardless warrior's three-quarter stance,
// one hand resting where a sword-hilt would be, brows level, level gaze.
HERO_POSES.ach_martial = { id:"ach_martial", label:"martial stance", group:"achilles",
  n:{ browUp:.12, browKnit:.14, eyeNarrow:.12,
      bodyYaw:-.5, headYaw:-.34, gazeX:-.2,
      spineLean:-.04, chestOpen:.4,
      armLUpper:-.34, armLLower:-.74, handRotL:.2,          // left hand rests at the hip/hilt
      armRUpper:-.16, armRLower:.14,
      rootScale:1.06 },
  opt:{ hands:["relaxed","relaxed"] } };

/* pale shade of a golden young hero: near-paper skin, light golden hair (reads
   faint/ghostly under the dot pass), armor, bare warrior's legs, up-scaled for
   the strong build of the greatest of the Achaeans. */
const params = {
  skin:"#e4dfd4", hairColor:"#b9ac8c",
  hair:"short", beard:false, glasses:false,
  garment:"armor", cloak:false, bareLegs:true, scale:1.07,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.achilless-shade",
  type:"CHARACTER",
  name:"Achilles's shade",
  statusWord:"REGRETFUL",
  scene:"OD-B11-S07",

  params,
  layers:["lower-fade","shadow","hair-back","legs","armor","torso","far-arm","neck","head","face","hair-front","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    rightHand:{x:.66,y:.52}, leftHand:{x:.34,y:.52},
    swordHilt:{x:.34,y:.60}, hip:{x:.50,y:.65}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"regret",
    nodes:{
      // OD-B11-S07 — the arc. Each node sets its own face channels so the card
      // actually EMOTES, and every beat gestures with the arms.
      // the signature: bowed, gaze down, palm turned up in weary regret
      regret:  { preview:{ pose:"ach_regret", gaze:{x:0,y:.42},
                           browUp:.55, browKnit:.5, frown:.5, jaw:.4,
                           t:0.5, status:"REGRETFUL" } },
      // speaking the bitter confession to Odysseus across the pit
      confess: { preview:{ pose:"ach_confess", gaze:{x:.12,y:.24},
                           browUp:.5, browKnit:.4, frown:.34, jaw:.6,
                           t:0.5, status:"CONFESSING" } },
      // REVIVED — the news of Neoptolemus flares the great heart back to pride
      revived: { preview:{ pose:"ach_revived", gaze:{x:.05,y:-.18},
                           browUp:.5, browKnit:.06, smile:.32, eyeWide:.3, jaw:.34,
                           t:0.5, status:"REVIVED" } },
      // striding off across the asphodel, head high
      striding:{ preview:{ pose:"ach_stride", gaze:{x:.16,y:-.04},
                           browUp:.18, browKnit:.16, smile:.14, eyeNarrow:.14,
                           t:0.35, status:"PROUD" } },
      // stable martial identity turn
      martial: { preview:{ pose:"ach_martial", gaze:{x:-.2,y:0},
                           browUp:.12, browKnit:.14, eyeNarrow:.12, t:0.5 } },
    },
    edges:[
      ["regret","confess"],["confess","regret"],
      ["confess","revived"],["revived","striding"],
      ["regret","martial"],["martial","regret"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band","ghostAlpha",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym","blink"],

  // CARD SIGNATURE — REGRETFUL: the pale armored shade of the great warrior
  // bowed heavy, gaze cast down into the pit, brows shot up and knit in sorrow,
  // mouth open on the bitter confession, right hand turned palm-up in a weary
  // "what was any of the glory worth". Faint, half-there, unmistakably the
  // emptied-out ghost of the greatest of the Achaeans.
  preview:()=>({ pose:"ach_regret", gaze:{x:0,y:.42},
                 browUp:.55, browKnit:.5, frown:.5, jaw:.4,
                 t:0.5, status:"REGRETFUL", progress:.16 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    const st = state || {};

    // a shade: draw the whole figure faint so the dotify pass thins the ink and
    // lets the paper bleed through — ghostly light ink. A great warrior's shade
    // reads a touch MORE present than a common soul (he still burns), and lifts
    // further on the revived/striding beats as pride floods back.
    const revived = st.pose==="ach_revived" || st.pose==="ach_stride";
    const alpha = (typeof st.ghostAlpha==="number") ? st.ghostAlpha
                : (revived ? 0.7 : 0.58);
    ctx.save();
    ctx.globalAlpha = alpha;
    const r = fig.draw(ctx, W, H, st);
    ctx.restore();

    // faint lower body: wash the legs out into the paper so the shade has no
    // solid footing and dissolves down into the field of asphodel.
    const gy0 = H*0.58;
    const grad = ctx.createLinearGradient(0, gy0, 0, H);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.62, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0.86)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, gy0, W, H - gy0);

    return r;
  },
};
export default asset;
