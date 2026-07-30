/* character.eurybates-memory-variant — Odysseus's herald, produced as PROOF.
   A memory-flashback variant: not a herald doing herald things, but a herald
   held up for inspection. In OD-B19-S03 the beggar names the purple cloak and
   the hound-and-fawn brooch, and then — the clinching detail, the SECOND
   identity check — the man who walked at the king's shoulder: "round in the
   shoulders, dark-skinned, woolly-haired, and his name was Eurybates."

   Those three facts ARE the asset. Every pose in this module carries all three
   so the identity survives front, three-quarter, profile and back:
     · ROUND SHOULDERS — both shoulders permanently hauled up and forward, the
       head sunk down between them. Baked into every pose's numbers, never a
       one-off silhouette, so the stoop is the reading from any angle.
     · DARK SKIN — the darkest skin in the Ithacan cast, a clear step below the
       weathered #c9b79c of Medon and the palace people, but well short of ink:
       the face still halftones as open dots on paper, not a black mass.
     · WOOLLY HAIR — hair:"curly", which gives the rig its crown of tight
       lobes; the one near-full-ink accent on an otherwise light figure.
   A herald is a listener and a carrier, so the garment stays the light tunic
   and the legs stay bare — the paper shows through everywhere the three
   diagnostics are not.

   Memory-toned: he never acts on his own account here. He stands, attends,
   carries, and assents — a remembered servant summoned into the hall of the
   present to be checked against a wife's memory, and found to match.
   Atlas: OD-B19-S03 — "round-shouldered dark herald used as a second identity check". */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  // TONAL PLAN. The dark skin is the identity fact, so it has to be a real
  // step below the palace weathered tone (#c9b79c) — but if the whole figure
  // sits in that band it prints as one undifferentiated mass and the hard
  // contour dies with it. So the darkness is CONCENTRATED: it lands on the
  // head, forearms and hands (which are exactly the diagnostic surfaces) while
  // the torso and legs stay a light plane, and the woolly crown supplies the
  // single near-ink accent. Paper shows everywhere else.
  skin:"#96826b", hairColor:"#171310",
  hair:"curly",                   // OULOKARENOS — the rig's tight crown lobes
  beard:false,                    // Odysseus's description is head-hair only;
                                  // it also keeps the dark head to ONE mass
  glasses:false,
  // "dress" is the engine's tone key for the LIGHT full-length garment: a
  // herald's long chiton to the ankle. It is the lightest garment the palette
  // offers, and by covering the legs it keeps two tall dark skin columns out
  // of the frame — the body reads light, the head and hands read dark.
  garment:"dress", cloak:false, bareLegs:false,
  scale:0.95,                     // a little older than the king, and stooped
};

const fig = makeFigure(params);

/* ---- the eurybates pose family ----
   Registered additively onto the shared table. THE RULE for this family: every
   entry carries the round-shoulder trio (shoulderLiftL/R high, headY sunk, a
   touch of forward spineLean) so the diagnostic silhouette cannot fall out of
   a pose. Nothing here is hand-painted; the rig does all of it. */
const STOOP = { shoulderLiftL:1.05, shoulderLiftR:1.12, headY:.09, spineLean:-.14 };
function P(id, n, hands){
  POSES[id] = { id, label:id, group:"eurybates", n:{ ...STOOP, ...n },
                opt: hands ? { hands } : {} };
}

// THE SIGNATURE — IDENTITY, three-quarter: the herald simply standing to be
// looked at. Shoulders up round his ears, head sunk and pushed a little
// forward off them, arms hanging in close and slack the way a servant's do,
// weight even, face mild and unhurried with a servant's level attention.
// The whole point is that nothing distracts from the three facts.
P("eb_identity", {
  bodyYaw:-.70, headYaw:-.40, headRoll:-.07, gazeX:-.22, rootScale:.99,
  shoulderTilt:.10, shoulderLiftL:1.16, shoulderLiftR:.98,
  armLUpper:.16, armLLower:-.34, handRotL:.16,
  armRUpper:-.10, armRLower:.40, handRotR:-.14,
  hipL:.18, kneeL:.06, hipR:-.02, kneeR:.16,
  weightShift:.55, pelvisX:.22, pelvisRot:.07,
  browUp:.14, browKnit:.12, eyeNarrow:.08, smile:.04,
}, ["relaxed","relaxed"]);

// IDENTITY FRONT — the same man squared up to the viewer: the check made
// face-on, both round shoulders symmetrical, the woolly crown at its widest,
// gaze level and out of frame at whoever is doing the verifying.
P("eb_front", {
  bodyYaw:0, headYaw:.04, gazeX:0, gazeY:-.04,
  armLUpper:.22, armLLower:-.40, armRUpper:-.22, armRLower:.40,
  hipL:.05, kneeL:.08, hipR:-.05, kneeR:.08,
  browUp:.16, browKnit:.10, eyeNarrow:.06,
}, ["relaxed","relaxed"]);

// IDENTITY PROFILE — the diagnostic view: side-on, the curve of the back and
// the shoulders rolled forward over a sunken neck is unmistakable, and the
// crown of wool sits proud of the skull line.
P("eb_profile", {
  bodyYaw:-1.32, headYaw:-1.22, gazeX:-.48, spineLean:-.20, headY:.20,
  armLUpper:.34, armLLower:-.52, armRUpper:-.14, armRLower:.34,
  hipL:.10, kneeL:.12, hipR:-.06, kneeR:.07,
  browUp:.14, browKnit:.12,
}, ["relaxed","relaxed"]);

// IDENTITY BACK — walking away at the king's heel, which is how a herald is
// most often seen; from behind the stoop and the woolly head are the whole
// silhouette, and they are still enough to name him.
P("eb_back", {
  bodyYaw:Math.PI, headYaw:Math.PI, shoulderLiftL:1.10, shoulderLiftR:1.10,
  headY:.20, spineLean:-.16,
  armLUpper:.20, armLLower:-.34, armRUpper:-.20, armRLower:.34,
  hipL:.06, kneeL:.10, hipR:-.06, kneeR:.10,
}, ["relaxed","relaxed"]);

// ATTENDING — half a step behind and turned up toward his king: body angled
// away, head cranked back over the raised shoulder, hands drawn in and clasped
// low at the belt, brows up in the ready, patient listening of a man who is
// waiting to be told. The pose Penelope would have watched a thousand times.
P("eb_attending", {
  bodyYaw:.46, headYaw:-.72, gazeX:-.62, gazeY:-.10, headY:.14,
  armLUpper:-.26, armLLower:-1.04, handRotL:-.26,
  armRUpper:.30, armRLower:1.02, handRotR:.26,
  hipL:.04, kneeL:.10, hipR:-.08, kneeR:.06, weightShift:-.24, pelvisX:-.10,
  browUp:.34, browKnit:.16, eyeNarrow:.04, smile:.03,
}, ["relaxed","relaxed"]);

// PROCLAIMING — the herald doing his one job: near arm thrown up open-palmed
// to open the floor, jaw down on the cry, chin lifted. The shoulders stay
// round even at full stretch — that is the tell that this is still him.
P("eb_proclaiming", {
  bodyYaw:-.22, headYaw:-.10, gazeX:.14, gazeY:-.16, headY:.10,
  armRUpper:-2.38, armRLower:.26, handRotR:.14, shoulderLiftR:1.34,
  armLUpper:.30, armLLower:-.50, handRotL:.12,
  hipL:.06, kneeL:.08, hipR:-.06, kneeR:.08,
  browUp:.52, browKnit:.10, eyeWide:.22, jaw:.46, rootScale:1.0,
}, ["relaxed","open_palm"]);

// BEARING — carrying the king's folded purple cloak on both forearms, the way
// a servant carries cloth: elbows in at the ribs, forearms level and offered
// forward, head bowed over the load. The prop lives in its own module; this is
// only the shape of the hands that will hold it.
P("eb_bearing", {
  bodyYaw:-.30, headYaw:-.14, headY:.22, spineLean:-.20, gazeY:.30,
  armLUpper:.30, armLLower:-1.46, handRotL:-.24,
  armRUpper:-.26, armRLower:1.46, handRotR:.24,
  hipL:.05, kneeL:.10, hipR:-.05, kneeR:.10,
  browUp:.20, browKnit:.20, eyeNarrow:.14,
}, ["offering","offering"]);

// ASSENTING — the check lands: the head goes down and the shoulders come up in
// the small, complete bow of a servant confirming a thing is so. This is the
// beat where the detail is verified and the memory is accepted as true.
P("eb_assenting", {
  bodyYaw:-.20, headYaw:-.06, headY:.30, headPitch:.52, neckPitch:.26,
  spineLean:-.26, shoulderLiftL:1.16, shoulderLiftR:1.20, gazeY:.42,
  armLUpper:.34, armLLower:-.62, handRotL:.16,
  armRUpper:-.30, armRLower:.66, handRotR:-.14,
  hipL:.06, kneeL:.12, hipR:-.06, kneeR:.12,
  browUp:.28, browKnit:.18, eyeNarrow:.30, smile:.06,
}, ["relaxed","relaxed"]);

export const asset = {
  id:"character.eurybates-memory-variant",
  type:"CHARACTER",
  name:"Eurybates memory variant",
  statusWord:"VERIFIED",
  scene:"OD-B19-S03",

  params,
  layers:["shadow","hair-back","legs","tunic","far-arm","neck","head","face",
          "hair-front","near-arm"],
  // normalized 0..1 anchors: attachment (the carried cloak, a herald's staff),
  // contact (the post at the king's shoulder) and the diagnostic points the
  // identity check actually reads — the rolled shoulder line and the crown.
  anchors:{
    head:{x:.50,y:.24}, crown:{x:.50,y:.16}, eyes:{x:.50,y:.25},
    shoulderRoll:{x:.62,y:.38}, napeStoop:{x:.50,y:.34},
    rightHand:{x:.64,y:.56}, leftHand:{x:.36,y:.56},
    cloakCarry:{x:.50,y:.56}, staffGrip:{x:.34,y:.60},
    attendPost:{x:.30,y:.72},
    hip:{x:.50,y:.68}, feet:{x:.50,y:.93},
  },
  states:{
    initial:"identity",
    nodes:{
      // SIGNATURE — IDENTITY: the herald stood up in the middle of a story to
      // be checked. Round shoulders, dark skin, woolly head, and nothing else
      // asking for attention.
      identity:   { preview:{ pose:"eb_identity", browUp:.14, browKnit:.12,
                              eyeNarrow:.08, smile:.04,
                              gaze:{x:-.16,y:-.02}, t:0.5 } },
      // the same check taken face-on and side-on — the two views a description
      // has to survive if it is going to work as proof.
      squared:    { preview:{ pose:"eb_front", browUp:.16, browKnit:.10,
                              gaze:{x:0,y:-.04}, t:0.5 } },
      profiled:   { preview:{ pose:"eb_profile", browUp:.14, browKnit:.12,
                              gaze:{x:-.48,y:0}, t:0.5 } },
      // ATTENDING — at the king's shoulder, turned back and up, hands clasped,
      // waiting to be told. The remembered working posture.
      attending:  { preview:{ pose:"eb_attending", browUp:.34, browKnit:.16,
                              smile:.03, gaze:{x:-.62,y:-.10}, t:0.5 } },
      // PROCLAIMING — arm up, mouth open, the crier's one act.
      proclaiming:{ preview:{ pose:"eb_proclaiming", browUp:.52, eyeWide:.22,
                              jaw:.46, gaze:{x:.14,y:-.16}, t:0.5 } },
      // BEARING — the purple cloak carried folded on both forearms, head bowed
      // over it. The detail that ties this figure to the brooch and the cloak.
      bearing:    { preview:{ pose:"eb_bearing", browUp:.20, browKnit:.20,
                              eyeNarrow:.14, gaze:{x:-.08,y:.30}, t:0.5 } },
      // ASSENTING — the bow that closes the check: yes, that was the man.
      assenting:  { preview:{ pose:"eb_assenting", browUp:.28, browKnit:.18,
                              eyeNarrow:.30, smile:.06,
                              gaze:{x:-.04,y:.42}, t:0.5 } },
      // WITHDRAWING — the memory leaves the room the way a servant does, at
      // the heel of his king, still unmistakable from behind.
      withdrawing:{ preview:{ pose:"eb_back", gaze:{x:0,y:0}, t:0.5 } },
    },
    edges:[["identity","squared"],["squared","profiled"],["profiled","identity"],
           ["identity","attending"],["attending","proclaiming"],
           ["proclaiming","attending"],["attending","bearing"],
           ["bearing","assenting"],["assenting","identity"],
           ["identity","assenting"],["attending","withdrawing"],
           ["withdrawing","identity"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band","mirror",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — VERIFIED: the second identity check itself. A dark,
  // round-shouldered, woolly-headed man standing three-quarter with his arms
  // hanging slack, doing nothing at all except being exactly what he was
  // described as. The proof is the silhouette, not the action.
  preview:()=>({ pose:"eb_identity",
                 browUp:.14, browKnit:.12, eyeNarrow:.08, smile:.04,
                 gaze:{x:-.16,y:-.02}, t:0.5,
                 status:"VERIFIED", progress:.34 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band; else fig.spec.band = "front";
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
