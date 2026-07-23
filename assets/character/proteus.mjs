/* character.proteus — the Old Man of the Sea. CHARACTER asset on the HALFTRACK
   hero rig: the ancient shape-shifting sea-prophet — a very old man, white mane
   and streaming patriarch's beard, draped in seaweed, weathered by salt. His
   STABLE base form is this seaweed-hung elder; his gift is metamorphosis, so his
   states hint the beast / water / tree variants of the transformation chain
   (see divine_fx/... transformation FX): lion, serpent, leopard, boar, running
   water, a tall tree — each held in the body of the same old man before he slips
   into it.

   Scene function:
     OD-B04-S05  ancient sea prophet cycling rapid lion, serpent, leopard, boar,
                 water, tree variants while gripped — Menelaus must hold him fast.

   EXPRESSIVENESS: the hero rig reads facial channels (browUp, browKnit, eyeWide,
   eyeNarrow, frown, jaw, mouthAsym) from the composed POSE. The states Proteus
   must hit — the wary prophet grasping at water, the lion's roar, the serpent's
   sideways weave, the coiled leopard, the lowered boar, the dissolving flow of
   water, the raised stillness of a tree — need brow + gaze + arm authored
   TOGETHER, so Proteus ships bespoke poses into the shared POSE registry (the
   same instance the hero figure reads) so the card and every state EMOTE. */
import { makeFigure } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Proteus poses: brow + gaze + arm authored together ----
   Convention: he is very old and slightly stooped (small +spineLean at rest);
   the transformation poses distort that base body toward each beast/element. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "proteus", n, opt }; };

// THE CARD — PROPHESYING: the signature. The wary Old Man of the Sea, both hands
// come forward and cup DOWNWARD as if grasping a fistful of running water — the
// grasping-water gesture — while his face reads prophet-wary: inner brows lifted
// AND knit (the old seer's ache), eyes narrowed and cast off-frame at something
// only he sees coming, mouth just parted on the first word of a prophecy. Stooped
// forward over his own cupped hands.
P("proteus_prophet", {
  browUp:.40, browKnit:.42, eyeNarrow:.30, eyeWide:.06, frown:.06, jaw:.16,
  mouthAsym:.14,
  headPitch:.16, neckPitch:.10, headRoll:-.05,
  gazeX:-.40, gazeY:.22,                         // eyes cast off and down, seeing ahead
  spineLean:-.20, bodyYaw:0, headYaw:-.22, chestOpen:.10,
  // frontal + symmetric so both cupped hands read clearly, brought forward and
  // in toward the belly to hold a fistful of running water — the grasping gesture.
  armLUpper:1.06, armLLower:-.70, armRUpper:-1.06, armRLower:.70,
  shoulderLiftL:.10, shoulderLiftR:.10,
}, { hands:["offering","offering"] });

// LION — the first shape. A roar breaks the old body: jaw thrown wide, brows
// knit down hard, eyes narrowed to slits, a snarling frown, chest thrust, the
// right arm slashing out like a raking forepaw. The mane already looks leonine.
P("proteus_lion", {
  browKnit:.80, eyeNarrow:.42, frown:.55, jaw:.82, mouthAsym:.10,
  spineLean:-.22, headPitch:-.06, bodyYaw:-.10, chestOpen:.55,
  armRUpper:-1.46, armRLower:.30, shoulderLiftR:.30,     // raking forepaw
  armLUpper:.66, armLLower:-.44, rootScale:1.08,
}, { hands:["point","fist"] });

// SERPENT — the body drops and weaves. Head tilts and slides sideways on a
// craning neck, eyes narrowed and unblinking, jaw closed, a cold sidelong stare;
// the spine twists, one arm lowers and curls off to the side like the first coil.
P("proteus_serpent", {
  browKnit:.34, eyeNarrow:.55, eyeWide:.10, jaw:.02, mouthAsym:.30,
  headRoll:.30, headYaw:.52, neckYaw:.30,
  gazeX:.66, gazeY:.04,                           // cold sidelong lock
  spineLean:.10, spineTwist:.6, bodyYaw:.22,
  armRUpper:.42, armRLower:1.30, shoulderLiftR:-.10,      // low sideways coil
  armLUpper:-.30, armLLower:-.66, rootScale:.98,
}, { hands:["relaxed","relaxed"] });

// LEOPARD — coiled to spring. He crouches low and gathers, weight forward on both
// bent arms like a cat's forelegs, eyes WIDE and fixed, brows level and intent, a
// silent open-mouthed readiness. All potential, held one instant before the leap.
P("proteus_leopard", {
  browKnit:.24, eyeWide:.48, eyeNarrow:.06, jaw:.20,
  crouch:.85, kneeL:.9, kneeR:.9, hipL:-.34, hipR:.34,
  spineLean:-.30, headPitch:-.10, gazeX:.14, gazeY:-.06,
  armLUpper:.70, armLLower:-.62, armRUpper:-.70, armRLower:.62,   // forelegs planted
  shoulderLiftL:.20, shoulderLiftR:.20, rootY:.06,
}, { hands:["fist","fist"] });

// BOAR — head down and charging. The chin drops, the whole spine pitches forward,
// brows drive down over small furious eyes, the jaw sets with tusks bared; both
// arms swing back along the flanks as the body lowers to gore. Blunt, headlong.
P("proteus_boar", {
  browKnit:.72, eyeNarrow:.40, frown:.30, jaw:.30,
  headPitch:.52, neckPitch:.26, headRoll:.04,
  gazeX:.10, gazeY:.42,                            // eyes down along the charge
  spineLean:-.46, bodyYaw:-.06, chestOpen:.10,
  armLUpper:-.48, armLLower:-.30, armRUpper:.48, armRLower:.30,   // arms swept back
  rootScale:1.06, rootY:.05,
}, { hands:["fist","fist"] });

// WATER — he gives up shape and RUNS. The old body loosens and pours: arms open
// and sink, hands turning palm-up and spilling, shoulders drop, head bows, the
// gaze goes soft and downward. The frame of the man dissolving into flow.
P("proteus_water", {
  browUp:.30, browKnit:.10, eyeNarrow:.20, frown:.10, jaw:.06,
  headPitch:.30, neckPitch:.16,
  gazeX:-.06, gazeY:.40,                           // eyes lowered, unfocused
  spineLean:.14, chestOpen:.30, bodyYaw:.06,
  armLUpper:1.34, armLLower:-.14, armRUpper:-1.34, armRLower:.14,   // open and spilling
  shoulderLiftL:-.14, shoulderLiftR:-.14, rootY:.04,
}, { hands:["palm_up","palm_up"] });

// TREE — the last shape, and stillness. He rises tall and roots: both arms lift
// and spread wide and high like limbs putting out branches, chin raised, eyes all
// but shut, brows lifted calm, the mouth closed. The shape-shifter at rest as
// something that cannot run.
P("proteus_tree", {
  browUp:.48, browKnit:.04, eyeNarrow:.62, blinkL:.20, blinkR:.20, jaw:0,
  headPitch:-.30, neckPitch:-.18, headRoll:0,
  gazeX:0, gazeY:-.30,
  spineLean:.02, chestOpen:.55, rootScale:1.04, rootY:-.04,
  armLUpper:2.20, armLLower:-.44, armRUpper:-2.20, armRLower:.44,   // branches spread high
  shoulderLiftL:.55, shoulderLiftR:.55,
}, { hands:["open_palm","open_palm"] });

const params = {
  // very old sea-elder: cold salt-weathered skin with little warmth in it; a
  // WHITE mane + full streaming patriarch's beard (light-mid grey so the mass
  // carries real halftone weight, like Nestor). Draped in seaweed rags over bare,
  // salt-scoured legs, with a clinging kelp cloak.
  skin:"#c6c3b4", hairColor:"#8a8a80",
  hair:"curly", beard:true, glasses:false,
  garment:"rags", cloak:true, bareLegs:true, scale:1.0,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.proteus",
  type:"CHARACTER",
  name:"Proteus",
  statusWord:"SHIFTING",
  scene:"OD-B04-S05",

  params,
  layers:["shadow","hair-back","legs","torso","rags","seaweed-back","far-arm",
          "neck","head","face","hair-front","beard","near-arm","seaweed-front"],
  // normalized 0..1 anchors for scene attachment / gaze / the gripping struggle
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.68,y:.58}, leftHand:{x:.32,y:.58},
    graspPoint:{x:.50,y:.66},                       // where the cupped water sits
    shoulderGrip:{x:.62,y:.34}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
    sea:{x:.16,y:.72}, horizon:{x:.12,y:.30},
  },
  states:{
    initial:"prophet",
    nodes:{
      // THE beat / signature — the wary prophet cupping water
      prophet:  { preview:{ pose:"proteus_prophet", gaze:{x:-.40,y:.20}, status:"PROPHESYING" } },
      // OD-B04-S05 rapid variants — the transformation chain, one shape per node
      lion:     { preview:{ pose:"proteus_lion",    gaze:{x:.05,y:0},   status:"LION" } },
      serpent:  { preview:{ pose:"proteus_serpent", gaze:{x:.66,y:.04}, status:"SERPENT" } },
      leopard:  { preview:{ pose:"proteus_leopard", gaze:{x:.14,y:-.06},status:"LEOPARD" } },
      boar:     { preview:{ pose:"proteus_boar",    gaze:{x:.10,y:.42}, status:"BOAR" } },
      water:    { preview:{ pose:"proteus_water",   gaze:{x:-.06,y:.40},status:"WATER" } },
      tree:     { preview:{ pose:"proteus_tree",    gaze:{x:0,y:-.30},  status:"TREE" } },
      // stable identity turns
      profile:  { preview:{ pose:"profile_left" } },
      back:     { preview:{ pose:"back_view" } },
    },
    // the rapid cycle Menelaus must hold through: prophet -> beasts -> elements
    // -> back to the exhausted prophet, plus the stable turns.
    edges:[
      ["prophet","lion"],["lion","serpent"],["serpent","leopard"],
      ["leopard","boar"],["boar","water"],["water","tree"],["tree","prophet"],
      ["prophet","profile"],["prophet","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "browUp","browKnit","eyeWide","eyeNarrow","jaw","frown","mouthAsym"],

  // EXPRESSIVE signature — PROPHESYING: the ancient Old Man of the Sea, stooped
  // over his own cupped hands as if holding running water, face gone prophet-wary
  // (inner brows lifted AND knit, eyes narrowed and cast off at what's coming,
  // mouth just parting). No `mouth` overlay so the wary look can't be flattened
  // to a smile.
  preview:()=>({ pose:"proteus_prophet", gaze:{x:-.40,y:.20}, t:0.4,
                 status:"PROPHESYING", progress:.22 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // pass the whole state through: pose, gaze, mouth, blink, t all reach the rig
    const out = fig.draw(ctx, W, H, state);

    // ---- seaweed drape: clinging strands of kelp hung from his shoulders and
    // arms, drawn in solid grays + hard contour so the engine POST pass halftones
    // them with the rest of the figure. Anchored to the reported shoulder/hand
    // positions so they hang correctly whatever the pose. Deterministic wave. ----
    try {
      const a = out && out.anchors;
      const t = (state && state.t) || 0;
      // hang points: strands cling from the shoulders/chest and drape down the
      // torso — kept OFF the hands so they read as clean kelp, not scattered noise.
      const neck = a && a.neck ? a.neck : { x:.5, y:.34 };
      const hip  = a && a.hip  ? a.hip  : { x:.5, y:.66 };
      const nx = neck.x*W, ny = neck.y*H;
      const hangs = [
        { x:nx-W*.14, y:ny+H*.03, len:H*.26, sway:0.8 },   // off the left shoulder
        { x:nx+W*.14, y:ny+H*.03, len:H*.26, sway:1.6 },   // off the right shoulder
        { x:nx-W*.05, y:ny+H*.07, len:H*.20, sway:1.1 },   // down the chest
        { x:nx+W*.06, y:ny+H*.07, len:H*.22, sway:2.3 },
        { x:hip.x*W-W*.02, y:hip.y*H-H*.02, len:H*.16, sway:0.4 },   // off the hip
      ];
      ctx.save();
      ctx.lineCap="round"; ctx.lineJoin="round";
      for (const s of hangs){
        // a wavy tapering strand: contour underlay, then a mid-dark kelp fill.
        const seg = 5, pts = [];
        for (let i=0;i<=seg;i++){
          const f = i/seg;
          const wob = Math.sin(f*3.2 + s.sway + t*1.3) * (W*.018) * f;
          pts.push([ s.x + wob, s.y + s.len*f ]);
        }
        const stroke = (col,w)=>{
          ctx.strokeStyle=col; ctx.lineWidth=w; ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
          ctx.stroke();
        };
        stroke("#141414", W*.026);   // hard contour
        stroke("#4a4a44", W*.014);   // kelp body (mid-dark, halftones to a solid tone)
        // a couple of small leaf-blades off the strand
        ctx.fillStyle="#4a4a44"; ctx.strokeStyle="#141414"; ctx.lineWidth=W*.006;
        for (const bi of [2,4]){
          const p=pts[bi], sgn = (bi%2)?1:-1;
          ctx.beginPath();
          ctx.ellipse(p[0]+sgn*W*.02, p[1], W*.022, W*.010, sgn*0.5, 0, Math.PI*2);
          ctx.fill(); ctx.stroke();
        }
      }
      ctx.restore();
    } catch(e){ /* seaweed is decorative; never block the figure render */ }
    return out;
  },
};
export default asset;
