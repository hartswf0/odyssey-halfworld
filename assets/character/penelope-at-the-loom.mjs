/* character.penelope-at-the-loom — a MEMORY-layer variant of Penelope shown
   at her work: the veiled queen leaning to a warp-weighted loom, hands working
   thread, a wistful, secretive face. Reuses Penelope's identity (veil, long
   hair, dress) but posed at the loom instead of standing in grief.

   Scene function: OD-B02-S02 — the recalled performance. By day she weaves the
   shroud in plain sight of the suitors; by torchlight she picks the same web
   loose again. So the loom carries two moods (woven / unwoven) and the face two
   secrets (serene in public, glancing over the shoulder in the dark).

   Built on the engine hero rig with the SAME custom veil hood, hair drape and
   long dress as character.penelope, plus a procedural upright loom drawn in
   solid grays so the engine's dotify POST pass supplies the halftone. */
import { makeFigure, INK, gray } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

const params = {
  skin:"#e0d9cb", hairColor:"#33291f",
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:0.97,
};

const fig = makeFigure(params);

/* ---- custom poses for the loom beats ----
   The rig reads brow/frown channels from the pose def, so each working beat
   registers its own id on the shared POSES singleton (same pattern as
   character.penelope). All beats turn her body toward the loom (bodyYaw>0,
   loom sits to her right / screen-right) and raise BOTH hands to the warp. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"penelope-loom", n, opt:hands?{hands}:{} }; }

// The far (left) arm hangs quietly at her side in every working beat (keeps the
// silhouette clean — mirror of penelope_grief's uncrossed far arm); the near
// (right) arm does the work up at the warp.
const FAR_ARM = { armLUpper:.16, armLLower:-.34, handRotL:0, shoulderLiftL:0 };

// NOTE: the forward lean (spineLean) also shifts the head off-centre in this 2D
// rig, and the hair-drape/veil are centred on the head — so keep spineLean and
// bodyYaw modest so the veiled head stays under its hood. The reach is carried
// by the near arm, not by throwing the whole torso over.

// SIGNATURE — WEAVING: turned to the loom, the near hand lifted to the shed
// working thread, head tipped toward the work, a wistful secret half-smile.
P("penelope_weave", {
  bodyYaw:.24, headYaw:.18, spineLean:-.10, headPitch:.13, neckPitch:.06,
  ...FAR_ARM,
  armRUpper:.66,  armRLower:1.70, handRotR:-.22, shoulderLiftR:.46,   // near hand up at the warp
}, ["relaxed","offering"]);

// PUBLIC weaving — composed, upright, serene: what the suitors are allowed to
// see. Hand at the shed, mouth closed, gaze quietly on the work.
P("penelope_weave_public", {
  bodyYaw:.20, headYaw:.14, spineLean:-.05, headPitch:.10,
  ...FAR_ARM,
  armRUpper:.58,  armRLower:1.60, handRotR:-.20, shoulderLiftR:.40,
}, ["relaxed","offering"]);

// UNWEAVING by torchlight — the secret undone: the near hand drops to pull a
// picked thread loose, and she GLANCES BACK over her shoulder, away from the
// work, brow knit, tense — is anyone watching?
P("penelope_unweave", {
  bodyYaw:.18, headYaw:-.60, neckYaw:-.28, spineLean:-.03, headRoll:-.06,
  ...FAR_ARM,
  armRUpper:.30,  armRLower:.86,  handRotR:-.10, shoulderLiftR:.06,    // near hand pulled DOWN, tugging thread loose
}, ["relaxed","point"]);

// PAUSED — hand stilled at the loom, gaze lifted off the work into the middle
// distance: the wistful remembering-Odysseus beat.
P("penelope_pause", {
  bodyYaw:.18, headYaw:-.08, spineLean:-.04, headPitch:-.04,
  ...FAR_ARM,
  armRUpper:.52,  armRLower:1.44, handRotR:-.16, shoulderLiftR:.32,
}, ["relaxed","offering"]);

/* ---- SHARED identity geometry (ported from character.penelope) ---- */
function drawHairDrape(ctx, W, H){
  const cx = W*0.50, crownY = H*0.145, shY = H*0.545;
  ctx.fillStyle = gray(0x2c); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - W*0.150, crownY + H*0.055);
  ctx.quadraticCurveTo(cx - W*0.185, H*0.30, cx - W*0.150, shY);
  ctx.quadraticCurveTo(cx, shY + H*0.05, cx + W*0.150, shY);
  ctx.quadraticCurveTo(cx + W*0.185, H*0.30, cx + W*0.150, crownY + H*0.055);
  ctx.quadraticCurveTo(cx, crownY - H*0.035, cx - W*0.150, crownY + H*0.055);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}
function drawSkirt(ctx, W, H){
  const cx = W*0.50, waistY = H*0.610, hemY = H*0.905;
  const wTop = W*0.088, wHem = W*0.158;
  ctx.fillStyle = gray(0x9c); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.9, H*0.78, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.022, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.9, H*0.78, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (let i=-2;i<=2;i++){
    const tx = i/2.4;
    ctx.beginPath();
    ctx.moveTo(cx + tx*wTop, waistY + H*0.012);
    ctx.quadraticCurveTo(cx + tx*wHem*0.95, H*0.78, cx + tx*wHem, hemY - H*0.004);
    ctx.stroke();
  }
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY + H*0.004);
  ctx.quadraticCurveTo(cx, waistY + H*0.016, cx + wTop, waistY + H*0.004);
  ctx.stroke();
}
function drawVeil(ctx, W, H, head, crown){
  const cx = head.x*W, cy = head.y*H;
  let R = (head.y - crown.y)*H;
  if (!(R > 8)) R = W*0.10;
  // A face-framing hood rather than the standing Penelope's long drape: with the
  // body compact and turned to the loom, a full drape hangs in empty space to
  // her left. Close the veil near the neck so it hugs the face.
  const shY = cy + R*1.45;
  ctx.fillStyle = gray(0xc2); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - R*1.58, shY);
  ctx.quadraticCurveTo(cx - R*1.66, cy - R*0.55, cx - R*1.22, cy - R*0.35);
  ctx.quadraticCurveTo(cx - R*1.10, cy - R*1.62, cx, cy - R*1.60);
  ctx.quadraticCurveTo(cx + R*1.10, cy - R*1.62, cx + R*1.22, cy - R*0.35);
  ctx.quadraticCurveTo(cx + R*1.66, cy - R*0.55, cx + R*1.58, shY);
  ctx.lineTo(cx + R*1.04, shY);
  ctx.quadraticCurveTo(cx + R*1.14, cy - R*0.20, cx + R*1.02, cy - R*0.80);
  ctx.quadraticCurveTo(cx + R*0.72, cy - R*1.22, cx, cy - R*1.20);
  ctx.quadraticCurveTo(cx - R*0.72, cy - R*1.22, cx - R*1.02, cy - R*0.80);
  ctx.quadraticCurveTo(cx - R*1.14, cy - R*0.20, cx - R*1.04, shY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (const s of [-1, 1]){
    // folds kept INSIDE the hood outline so none pokes out into empty space
    ctx.beginPath();
    ctx.moveTo(cx + s*R*1.14, cy - R*0.55);
    ctx.quadraticCurveTo(cx + s*R*1.22, cy + R*0.30, cx + s*R*1.10, shY - R*0.08);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + s*R*0.92, cy - R*1.02);
    ctx.quadraticCurveTo(cx + s*R*1.02, cy - R*0.30, cx + s*R*0.96, cy + R*0.40);
    ctx.stroke();
  }
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - R*1.58, shY); ctx.quadraticCurveTo(cx - R*1.3, shY + R*0.14, cx - R*1.04, shY);
  ctx.moveTo(cx + R*1.04, shY); ctx.quadraticCurveTo(cx + R*1.3, shY + R*0.14, cx + R*1.58, shY);
  ctx.stroke();
}

/* ---- THE LOOM: an upright warp-weighted loom, drawn BEHIND the figure so she
   stands in front of the warp and works it. Two posts + a top cloth-beam; a
   band of finished cloth hung under the beam; the warp falling in ordered
   threads to a row of loom-weights at the shins. `mode`:
     "woven"   — a deep band of cloth, warp taut and even (the public work).
     "unwoven" — the cloth band shrunk, and the lower warp picked loose into
                 slack, wandering threads (the torchlight undoing). */
function drawLoom(ctx, W, H, mode){
  const xL = W*0.585, xR = W*0.870;             // the two posts
  const yTop = H*0.150, yBot = H*0.820;         // beam height / weight row
  const postW = W*0.026;
  const woodDark = gray(0x38), woodMid = gray(0x54), clothGray = gray(0x84);
  const unwoven = mode === "unwoven";

  // ground foot-braces under each post
  ctx.fillStyle = woodDark; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  for (const px of [xL, xR]){
    ctx.beginPath();
    ctx.ellipse(px, yBot + H*0.055, postW*1.9, H*0.014, 0, 0, 7);
    ctx.fill(); ctx.stroke();
  }
  // two uprights
  ctx.fillStyle = woodMid;
  for (const px of [xL, xR]){
    ctx.beginPath();
    ctx.rect(px - postW/2, yTop - H*0.02, postW, (yBot + H*0.05) - (yTop - H*0.02));
    ctx.fill(); ctx.stroke();
  }
  // top cloth-beam (the finished cloth rolls onto this)
  ctx.fillStyle = woodDark;
  ctx.beginPath();
  ctx.rect(xL - postW*1.1, yTop - H*0.028, (xR - xL) + postW*2.2, H*0.040);
  ctx.fill(); ctx.stroke();

  // finished cloth band hung under the beam
  const clothTop = yTop + H*0.012;
  const clothBot = clothTop + (unwoven ? H*0.070 : H*0.190);
  ctx.fillStyle = clothGray;
  ctx.beginPath();
  ctx.rect(xL + postW*0.7, clothTop, (xR - xL) - postW*1.4, clothBot - clothTop);
  ctx.fill(); ctx.stroke();
  // weft rows across the cloth
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.lineCap = "round";
  for (let y = clothTop + H*0.014; y < clothBot - H*0.006; y += H*0.020){
    ctx.beginPath(); ctx.moveTo(xL + postW*0.9, y); ctx.lineTo(xR - postW*0.9, y); ctx.stroke();
  }

  // warp threads falling from the cloth edge to the weights
  const nWarp = 11;
  const wx0 = xL + postW*1.0, wx1 = xR - postW*1.0;
  ctx.lineCap = "round";
  for (let i = 0; i < nWarp; i++){
    const t = i/(nWarp-1);
    const x = wx0 + (wx1 - wx0)*t;
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x, clothBot);
    if (unwoven && i % 2 === 0){
      // picked-loose thread: slack, wandering down instead of taut
      const sway = W*0.012 * (i%3===0? 1 : -1);
      ctx.bezierCurveTo(x + sway, clothBot + H*0.10,
                        x - sway, clothBot + H*0.18,
                        x + sway*0.6, yBot - H*0.005);
    } else {
      ctx.lineTo(x, yBot - H*0.005);
    }
    ctx.stroke();
  }

  // loom-weights: a row of small hung weights tensioning the warp
  ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.lineJoin = "round";
  for (let i = 0; i < nWarp; i += 2){
    const t = i/(nWarp-1);
    const wobble = unwoven ? W*0.006*Math.sin(i*1.7) : 0;
    const x = wx0 + (wx1 - wx0)*t + wobble;
    const wy = yBot + H*0.006;
    ctx.fillStyle = woodDark;
    ctx.beginPath();                    // little conical warp-weight
    ctx.moveTo(x - W*0.012, wy);
    ctx.lineTo(x + W*0.012, wy);
    ctx.lineTo(x + W*0.006, wy + H*0.030);
    ctx.lineTo(x - W*0.006, wy + H*0.030);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  // torchlight cue for the undoing: a loose thread trailing off toward her hand
  if (unwoven){
    ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(wx0 + (wx1-wx0)*0.10, clothBot + H*0.02);
    ctx.bezierCurveTo(xL - W*0.02, clothBot + H*0.10,
                      xL - W*0.05, clothBot + H*0.20,
                      xL - W*0.055, clothBot + H*0.30);
    ctx.stroke();
  }
}

export const asset = {
  id:"character.penelope-at-the-loom",
  type:"CHARACTER",
  name:"Penelope at the loom",
  statusWord:"SECRETIVE",
  scene:"OD-B02-S02",

  params,
  layers:["shadow","hair-drape","loom","legs","dress","far-arm","neck","head",
          "face","hair-front","near-arm","skirt","veil"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.48,y:.20}, crown:{x:.48,y:.13}, eyes:{x:.48,y:.21},
    veilPeak:{x:.48,y:.08},
    loomBeam:{x:.72,y:.16}, warpTop:{x:.72,y:.28}, warpBase:{x:.72,y:.82},
    workingHands:{x:.60,y:.44}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"weaving",
    nodes:{
      // SIGNATURE — leaning to the loom, both hands at the shed, wistful secret smile
      weaving:  { preview:{ pose:"penelope_weave", loom:"woven",
                            gaze:{x:.30,y:.16}, smile:.16, mouthAsym:.44,
                            browUp:.16, eyeNarrow:.14, t:0.4 } },
      // OD-B02-S02 daylight — composed public weaving before the suitors
      public:   { preview:{ pose:"penelope_weave_public", loom:"woven",
                            gaze:{x:.28,y:.14}, smile:.06, browUp:.08,
                            eyeNarrow:.06, t:0.5 } },
      // OD-B02-S02 torchlight — unpicking the web, glancing back over her shoulder
      unweaving:{ preview:{ pose:"penelope_unweave", loom:"unwoven",
                            gaze:{x:-.55,y:-.05}, browKnit:.42, browUp:.20,
                            eyeWide:.22, frown:.16, mouthAsym:.30, t:0.5 } },
      // wistful pause — hands stilled, gaze lifted off the work, remembering
      pausing:  { preview:{ pose:"penelope_pause", loom:"woven",
                            gaze:{x:-.10,y:-.12}, browUp:.34, frown:.14,
                            eyeNarrow:.12, mouthAsym:.22, t:0.5 } },
      // plain three-quarter identity read (veil + dress, standing at the loom)
      neutral:  { preview:{ pose:"three_quarter_right", loom:"woven",
                            gaze:{x:.2,y:.12}, browUp:.06, t:0.5 } },
    },
    edges:[["weaving","public"],["public","unweaving"],["unweaving","pausing"],
           ["pausing","weaving"],["weaving","neutral"],["neutral","weaving"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym","loom"],

  // CARD SIGNATURE — SECRETIVE: the veiled queen leaning to her loom, both hands
  // lifted to the warp, a wistful half-smile skewed with a secret, eyes on the
  // work she means to undo again tonight.
  preview:()=>({ pose:"penelope_weave", loom:"woven",
                 gaze:{x:.30,y:.16}, smile:.16, mouthAsym:.44,
                 browUp:.16, eyeNarrow:.14, t:0.4,
                 status:"SECRETIVE", progress:.24 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    const loomMode = st.loom || "woven";
    // long hair mass behind the figure
    drawHairDrape(ctx, W, H);
    // the loom, behind her — she works it from the front
    drawLoom(ctx, W, H, loomMode);
    // the figure (arms reaching to the warp)
    const r = fig.draw(ctx, W, H, st);
    // long dress skirt draped over the legs
    drawSkirt(ctx, W, H);
    // sheer veil hood in front, tracking the rig's head + crown anchors
    const head  = (r && r.anchors && r.anchors.head)  || { x:0.48, y:0.20 };
    const crown = (r && r.anchors && r.anchors.crown) || { x:0.48, y:0.13 };
    drawVeil(ctx, W, H, head, crown);
    return r;
  },
};
export default asset;
