/* character.athena-as-pitcher-girl — Athena's third Ithaca-to-Scheria disguise.
   A DISGUISE variant of character.athena: the goddess folds herself into the
   small body of a young PHAEACIAN GIRL fetching water — a slight youthful
   frame, a plain short belted dress, bare young legs, loose short hair, and a
   heavy WATER PITCHER balanced on her near shoulder, one hand steadying its
   foot. The mortal shell is a child of the town; but the same tell that leaks
   through every Athena disguise leaks through here: the eyes stay unnaturally
   BRIGHT, a divine glint too knowing for a water-girl. That bright-eye cue is
   the continuity thread back to character.athena (the flashing-eyed goddess).

   Her whole function is GUIDANCE: she walks Odysseus up through Scheria hidden
   in a shed of mist, pointing the road, naming the harbour, coaching him on
   Alcinous, Arete, and how to win the Phaeacian court. So her signature is a
   GUIDING gesture — the free hand thrust out to point the way — over a helpful,
   bright, open child's face.

   Scene function:
     OD-B07-S01 — local child disguise walking beside him with concise route
                  and political instruction

   Built on the engine hero rig: a slighter scale, a custom SHORT belted dress
   over bare legs, a shoulder-borne pitcher (drawn after the figure so it reads
   crisp), and the divine bright-eye catchlight painted last. All solid grays —
   the engine's dotify POST pass supplies the halftone, so no pre-dithering. */
import { makeFigure, INK, gray } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  skin:"#f0e4d1", hairColor:"#4b3a26",              // fresh youthful skin, warm short hair
  hair:"short", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:true, scale:0.80,   // small child's frame
};

const fig = makeFigure(params);

/* ---- custom poses ----
   Every beat keeps the NEAR (left, viewer-left) arm raised so the hand sits at
   the pitcher's foot on that shoulder — the pitcher lives there constantly. The
   FAR (right) arm does the acting: pointing the way, offering an instruction,
   swinging in a walk. The rig reads brow/jaw/eye channels only from the pose
   def, so each expression needs its own authored pose. POSES is a shared module
   singleton, so registering here makes these ids resolvable by composeStatic. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"pitcher-girl", n, opt:hands?{hands}:{} }; }

// steadying arm preset — near (left) upper arm lifted to the shoulder, forearm
// folded up so the hand rests at the pitcher's foot beside the ear.
const STEADY = { armLUpper:2.62, armLLower:-2.34, handRotL:.34, shoulderLiftL:.6 };

// SIGNATURE — GUIDING / POINTING THE WAY (OD-B07-S01): the free far hand thrusts
// out and points up the road, chin lifted and turned to follow it, a bright
// helpful open smile, brows up, eager young eyes. The water-girl showing the
// stranger where to go.
P("pitcher_guiding", {
  ...STEADY,
  browUp:.36, browKnit:.02, smile:.34, eyeWide:.16, jaw:.1,
  headYaw:.16, headRoll:-.04, spineLean:-.06, chestOpen:.32,
  armRUpper:-1.52, armRLower:.14, handRotR:.16, shoulderLiftR:.12,   // far hand points the way
}, ["relaxed","point"]);

// CONCISE ROUTE + POLITICAL INSTRUCTION (OD-B07-S01): the pointing softens into
// an offering hand held level, jaw open on a word (naming Arete, the harbour),
// a measured but still bright face — coaching him, not just directing.
P("pitcher_instructing", {
  ...STEADY,
  browUp:.24, browKnit:.06, smile:.18, mouthAsym:.24, eyeNarrow:.1, jaw:.3,
  headYaw:.1, headRoll:.03, spineLean:-.03,
  armRUpper:-1.04, armRLower:.58, handRotR:.12, shoulderLiftR:.06,   // offering the instruction forward
}, ["relaxed","offering"]);

// WALKING BESIDE HIM (OD-B07-S01): she steps along, the far arm swinging low and
// a little forward, head tilted UP to the tall stranger she's leading, mouth
// just parted mid-sentence, bright and busy.
P("pitcher_walking", {
  ...STEADY,
  browUp:.22, smile:.2, jaw:.16, eyeWide:.08,
  headYaw:.12, headPitch:-.12, headRoll:-.03, gazeY:-.2,
  spineLean:-.04, rootScale:1.0,
  hipL:.34, hipR:-.3, kneeL:.1, kneeR:.4,                            // mid-stride legs
  armRUpper:-.42, armRLower:.34,                                     // far arm swings low
}, ["relaxed","relaxed"]);

// HELPFUL UPWARD GLANCE (OD-B07-S01): pausing, she looks up and across at him
// with an encouraging bright grin, free hand lifted in a small open reassuring
// gesture — the friendly local putting a nervous newcomer at ease.
P("pitcher_helpful", {
  ...STEADY,
  browUp:.4, smile:.44, eyeWide:.22, cheek:.24, jaw:.06,
  headYaw:.18, headPitch:-.14, headRoll:.05, gazeX:.24, gazeY:-.22,
  spineLean:-.02,
  armRUpper:-.9, armRLower:.72, handRotR:.18,                        // small open reassuring hand
}, ["relaxed","open_palm"]);

// composed baseline — small and upright under the pitcher, a faint bright smile,
// the free hand resting easy at her side.
P("pitcher_poise", {
  ...STEADY,
  browUp:.18, smile:.2, eyeWide:.08,
  headRoll:-.02, spineLean:-.01, chestOpen:.16,
  armRUpper:-.16, armRLower:.26,                                     // free arm easy at side
}, ["relaxed","relaxed"]);

/* Short belted dress — a plain light bell of cloth from a high belt down to
   mid-thigh (SHORT, so young bare legs show below), drawn OVER the rig's hips.
   Simpler and shorter than Nausicaa's full gown: one clear belt, a couple of
   light pleats, reading YOUNG and workaday. Solid gray; dotify supplies weave. */
function drawDress(ctx, W, H){
  const cx = W*0.50, waistY = H*0.575, hemY = H*0.735;   // hem stops high — a short dress
  const wTop = W*0.070, wHem = W*0.120;
  ctx.fillStyle = gray(0xbe); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.90, H*0.685, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.020, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.90, H*0.685, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // a couple of light vertical pleats
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.lineCap = "round";
  for (let i=-1;i<=1;i++){
    const tx = i/1.5;
    ctx.beginPath();
    ctx.moveTo(cx + tx*wTop, waistY + H*0.010);
    ctx.quadraticCurveTo(cx + tx*wHem*0.92, H*0.685, cx + tx*wHem, hemY - H*0.004);
    ctx.stroke();
  }
  // the high belt — a clear band with a small knot
  ctx.fillStyle = gray(0x6c); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop*1.04, waistY - H*0.004);
  ctx.quadraticCurveTo(cx, waistY + H*0.012, cx + wTop*1.04, waistY - H*0.004);
  ctx.lineTo(cx + wTop*1.04, waistY + H*0.012);
  ctx.quadraticCurveTo(cx, waistY + H*0.028, cx - wTop*1.04, waistY + H*0.012);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = gray(0x6c); ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.ellipse(cx, waistY + H*0.006, W*0.012, H*0.010, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
}

/* The water pitcher — a rounded Greek hydria balanced on her NEAR (viewer-left)
   shoulder, tilted slightly in toward the neck, one loop handle out to the side,
   a flared lip and a small foot. Drawn AFTER the figure so it sits crisply on
   the shoulder in front of it. Solid grays; dotify supplies the ceramic tone. */
function drawPitcher(ctx, W, H){
  const cx = W*0.360, cy = H*0.335;          // body centre, on the near shoulder beside the head
  const rx = W*0.090, ry = H*0.078;
  const tilt = -0.20;                          // leans in toward the neck
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(tilt);

  // one loop handle, arcing from shoulder of the jug to its belly (behind body -> drawn first)
  ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(rx*0.42, -ry*0.86);
  ctx.quadraticCurveTo(rx*1.42, -ry*0.30, rx*0.66, ry*0.34);
  ctx.stroke();
  ctx.strokeStyle = gray(0x7c); ctx.lineWidth = 5.5;
  ctx.beginPath();
  ctx.moveTo(rx*0.42, -ry*0.86);
  ctx.quadraticCurveTo(rx*1.42, -ry*0.30, rx*0.66, ry*0.34);
  ctx.stroke();

  // rounded body (belly of the jug)
  ctx.fillStyle = gray(0xa4); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-rx*0.36, -ry*0.92);                        // shoulder of the jug (neck join, left)
  ctx.quadraticCurveTo(-rx*1.06, -ry*0.30, -rx*0.66, ry*0.60);
  ctx.quadraticCurveTo(-rx*0.30, ry*1.14, 0, ry*1.16);   // round underbelly
  ctx.quadraticCurveTo( rx*0.30, ry*1.14,  rx*0.66, ry*0.60);
  ctx.quadraticCurveTo( rx*1.06, -ry*0.30, rx*0.36, -ry*0.92);
  ctx.quadraticCurveTo(0, -ry*0.72, -rx*0.36, -ry*0.92);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // neck
  ctx.fillStyle = gray(0x9a);
  ctx.beginPath();
  ctx.moveTo(-rx*0.34, -ry*0.90);
  ctx.lineTo(-rx*0.30, -ry*1.44);
  ctx.lineTo( rx*0.30, -ry*1.44);
  ctx.lineTo( rx*0.34, -ry*0.90);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // flared lip
  ctx.fillStyle = gray(0xb2);
  ctx.beginPath();
  ctx.moveTo(-rx*0.46, -ry*1.44);
  ctx.quadraticCurveTo(0, -ry*1.30, rx*0.46, -ry*1.44);
  ctx.quadraticCurveTo(rx*0.40, -ry*1.66, 0, -ry*1.60);
  ctx.quadraticCurveTo(-rx*0.40, -ry*1.66, -rx*0.46, -ry*1.44);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // small foot / base ring
  ctx.fillStyle = gray(0x8a);
  ctx.beginPath();
  ctx.ellipse(0, ry*1.14, rx*0.34, ry*0.16, 0, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();

  // two decorative band lines around the belly (solid ink; dotify keeps them)
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-rx*0.86, -ry*0.10); ctx.quadraticCurveTo(0, ry*0.14, rx*0.86, -ry*0.10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-rx*0.78,  ry*0.30); ctx.quadraticCurveTo(0, ry*0.52, rx*0.78,  ry*0.30); ctx.stroke();
  ctx.restore();
}

/* The divine tell — a small over-bright catchlight in each eye, painted last so
   the goddess shows through the water-girl shell. Uses the rig's reported head
   anchor so it tracks pose/band (mirrors athena-as-mentes' bright-eye cue). */
function drawBrightEyes(ctx, W, H, anchors, state){
  if (!anchors || !anchors.head) return;
  const hx = anchors.head.x * W, hy = anchors.head.y * H;
  const R = Math.min(H*0.9, W*1.26) * (params.scale||1) * 0.105;   // mirrors rig headR
  const eyeY = hy - R*0.10;
  const dx = R*0.34;
  const gz = state && state.gaze ? state.gaze : {x:0,y:0};
  const profile = /profile/.test((state && (state.pose||state.band)) || "");
  const eyes = profile ? [1] : [-1,1];
  for (const es of eyes){
    const ex = hx + es*dx;
    ctx.fillStyle = "#fcfcf8";
    ctx.beginPath();
    ctx.arc(ex - R*0.05 + gz.x*R*0.06, eyeY - R*0.05 + gz.y*R*0.05, R*0.065, 0, 7);
    ctx.fill();
  }
}

export const asset = {
  id:"character.athena-as-pitcher-girl",
  type:"CHARACTER",
  name:"Athena as pitcher girl",
  statusWord:"GUIDING",
  scene:"OD-B07-S01",

  params,
  layers:["shadow","legs","dress","far-arm","neck","head","face","hair-front","near-arm","pitcher","bright-eyes"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.24}, crown:{x:.50,y:.17}, eyes:{x:.50,y:.25},
    pitcher:{x:.36,y:.335}, pitcherLip:{x:.355,y:.24},
    rightHand:{x:.70,y:.50}, leftHand:{x:.40,y:.34},
    hip:{x:.50,y:.62}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // composed baseline — small and upright under the pitcher, faint bright smile
      neutral:     { preview:{ pose:"pitcher_poise", gaze:{x:0,y:0}, t:0.5 } },
      // OD-B07-S01 SIGNATURE — guiding: free hand points the way, bright helpful face
      guiding:     { preview:{ pose:"pitcher_guiding", gaze:{x:.4,y:-.06}, t:0.5 } },
      // OD-B07-S01 — concise route + political instruction, offering hand, jaw open
      instructing: { preview:{ pose:"pitcher_instructing", gaze:{x:.16,y:.02}, t:0.5 } },
      // OD-B07-S01 — walking beside him, glancing up at the tall stranger
      walking:     { preview:{ pose:"pitcher_walking", gaze:{x:.2,y:-.18}, t:0.5 } },
      // OD-B07-S01 — helpful upward glance, small reassuring open hand
      helpful:     { preview:{ pose:"pitcher_helpful", gaze:{x:.24,y:-.22}, t:0.5 } },
    },
    edges:[["neutral","guiding"],["guiding","instructing"],["instructing","walking"],
           ["walking","helpful"],["helpful","guiding"],["guiding","neutral"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — GUIDING: the water-girl mid-guidance. Pitcher balanced on
  // the near shoulder, free hand thrust out to point the road, chin lifted to
  // follow it, a bright helpful open smile with brows up, and the divine
  // bright-eye tell glinting through.
  preview:()=>({ pose:"pitcher_guiding", gaze:{x:.4,y:-.06},
                 browUp:.36, smile:.34, eyeWide:.16, jaw:.1,
                 t:0.5, status:"GUIDING", progress:.22 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    const r = fig.draw(ctx, W, H, st);
    // short belted dress over the hips/legs
    drawDress(ctx, W, H);
    // the pitcher, crisp on the near shoulder in front of the figure
    drawPitcher(ctx, W, H);
    // the divine bright-eye tell, painted last so it survives the shell
    drawBrightEyes(ctx, W, H, r && r.anchors, st);
    return r;
  },
};
export default asset;
