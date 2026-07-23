/* character.athena-as-herald — Athena's Book 8 disguise in the streets of Scheria.
   A DISGUISE variant of character.athena: the goddess takes the body of a
   PHAEACIAN TOWN HERALD — a brisk, clean-shaven civic crier in a short tunic
   and a herald's cloak, a knobbed herald's staff in the near hand, an olive
   crier's wreath on the brow. She moves through the town raising a proclaiming
   voice, calling the Phaeacians to assembly to look on the stranger — a mobile
   civic voice recruiting curiosity while never naming who really sends the call.
   The mortal shell is complete, but the same tell that leaks through every
   Athena disguise leaks through here: the eyes stay unnaturally BRIGHT, a divine
   glint too knowing for a town crier. That bright-eye cue is the continuity
   thread back to character.athena (the flashing-eyed goddess).

   Scene function:
     OD-B08-S01 — mobile civic voice recruiting curiosity while concealing
                  divine authorship

   Built on the engine hero rig: the near (viewer-left) arm holds the staff
   down at the side across every beat, while the FAR (right) arm does the acting
   — flung up in proclamation, thrust out to summon, swinging in a stride, or
   dropped low and confiding. Staff + wreath are drawn around the figure so they
   read crisp. All solid grays + hard contour — the engine's dotify POST pass
   supplies the halftone, so nothing is pre-dithered. */
import { makeFigure, INK, gray } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

// HERALD shell: a lean brisk crier. Clean-shaven and short-haired to read
// YOUNGER and quicker than the bearded Mentes sea-captain, warm Phaeacian skin,
// a short tunic with a herald's cloak thrown back off the calling arm.
const params = {
  skin:"#d8bd96", hairColor:"#28201a",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:0.98,
};

const fig = makeFigure(params);

/* ---- custom poses ----
   Every beat keeps the NEAR (left, viewer-left) arm dropped at the side so the
   hand grips the staff planted there; the FAR (right) arm carries the whole
   performance. The rig reads brow/jaw/eye channels only from the pose def, so
   each expression needs its own authored pose. POSES is a shared module
   singleton — registering here makes these ids resolvable by composeStatic. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"herald", n, opt:hands?{hands}:{} }; }

// staff arm preset — near (left) upper arm dropped nearly straight down, forearm
// tucked slightly in so the hand closes on the staff shaft at the side.
const STAFF = { armLUpper:.16, armLLower:-.12, handRotL:.10, shoulderLiftL:.06 };

// SIGNATURE — PROCLAIMING (OD-B08-S01): the far arm flung high, palm open, mouth
// wide on a called summons, brows up, eyes bright and wide, chest thrown open,
// chin lifted to carry the voice across the square. The civic crier at full cry.
P("herald_proclaim", {
  ...STAFF,
  browUp:.44, browKnit:.04, eyeWide:.26, jaw:.66, voiceEnergy:.7, smile:.06,
  headYaw:.08, headPitch:-.08, spineLean:-.07, chestOpen:.48, rootY:-.02,
  armRUpper:-2.58, armRLower:.24, handRotR:.12, shoulderLiftR:.72,   // far arm raised, calling
}, ["relaxed","open_palm"]);

// SUMMONING (OD-B08-S01): the raised cry drops into a beckoning point across the
// square — far hand thrust out and up to gather the crowd, chin turned to follow
// it, mouth open mid-word, eager recruiting eyes.
P("herald_summon", {
  ...STAFF,
  browUp:.36, browKnit:.06, eyeWide:.18, jaw:.4, smile:.12,
  headYaw:-.12, headRoll:-.03, gazeX:-.32, spineLean:-.08, chestOpen:.3,
  armRUpper:-1.62, armRLower:.1, handRotR:.16, shoulderLiftR:.2,      // far hand points/gathers
}, ["relaxed","point"]);

// STRIDING (OD-B08-S01): the mobile voice on the move — stepping briskly through
// the town, far arm swinging low, head up and calling, mouth just parted, staff
// carried at the side.
P("herald_stride", {
  ...STAFF,
  browUp:.24, smile:.1, jaw:.26, eyeWide:.1,
  headYaw:.07, headPitch:-.06, spineLean:-.05,
  hipL:.36, hipR:-.32, kneeL:.12, kneeR:.42,                          // mid-stride legs
  armRUpper:-.5, armRLower:.34,                                       // far arm swings low
}, ["relaxed","relaxed"]);

// CONFIDING (OD-B08-S01): the recruiting undertone — the voice lowers, the far
// hand turns palm-up and offers a word close in, a knowing half-smile skews the
// mouth, one brow lifts, the gaze slides sidelong. Curiosity being seeded, the
// real author of the call left unnamed.
P("herald_confide", {
  ...STAFF,
  browUp:.3, browKnit:.14, eyeNarrow:.26, smile:.28, mouthAsym:.52, jaw:.18,
  headYaw:.1, headRoll:.05, gazeX:.34, spineLean:-.03,
  armRUpper:-1.0, armRLower:.62, handRotR:.14,                        // far hand offers, low
}, ["relaxed","offering"]);

// composed baseline — upright and alert with the staff planted, a faint ready
// smile, the far arm resting easy, poised to lift into the next cry.
P("herald_poise", {
  ...STAFF,
  browUp:.16, smile:.12, eyeNarrow:.08,
  headYaw:.02, spineLean:-.01, chestOpen:.16,
  armRUpper:-.18, armRLower:.28,                                      // free arm easy at side
}, ["relaxed","relaxed"]);

/* The herald's staff — a plain tall wooden staff with a rounded knob finial and
   a bound grip, planted on the near (viewer-left) side under the left hand. Not
   a spear: no blade, just the crier's badge of office. Drawn BEFORE the figure
   so the near left hand closes over the grip in front of it. Solid grays; the
   dotify POST pass supplies the wood grain. */
function drawStaff(ctx, W, H){
  const x = W*0.335;                    // aligns under the dropped near (left) hand
  const topY = H*0.180, buttY = H*0.935;
  // shaft — ink casing then wood core
  ctx.lineCap = "round";
  ctx.strokeStyle = INK; ctx.lineWidth = 11;
  ctx.beginPath(); ctx.moveTo(x, topY + H*0.028); ctx.lineTo(x, buttY); ctx.stroke();
  ctx.strokeStyle = gray(0x86); ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(x, topY + H*0.028); ctx.lineTo(x, buttY); ctx.stroke();
  // rounded knob finial at the top
  ctx.fillStyle = gray(0x9a); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.ellipse(x, topY, W*0.026, H*0.024, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  // a small collar under the knob
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - W*0.018, topY + H*0.030); ctx.lineTo(x + W*0.018, topY + H*0.030); ctx.stroke();
  // two binding rings at the grip
  ctx.lineWidth = 2.6;
  for (const gy of [H*0.575, H*0.615]){
    ctx.beginPath(); ctx.moveTo(x - W*0.016, gy); ctx.lineTo(x + W*0.016, gy); ctx.stroke();
  }
}

/* The crier's wreath — a low olive circlet bound across the brow over the hair,
   a couple of small leaves lifting from it. The badge that marks a herald in the
   square. Drawn AFTER the figure so it sits crisp on the head; tracks the rig's
   reported head anchor so it follows pose/band. Solid grays. */
function drawWreath(ctx, W, H, anchors){
  if (!anchors || !anchors.head) return;
  const hx = anchors.head.x * W, hy = anchors.head.y * H;
  const R = Math.min(H*0.9, W*1.26) * (params.scale||1) * 0.105;   // mirrors rig headR
  const browY = hy - R*0.42;                                        // low on the visible forehead
  const rx = R*0.86, ry = R*0.30;
  // the bound band across the brow (front arc of a low circlet, on skin so it reads)
  ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.lineCap = "round";
  ctx.beginPath(); ctx.ellipse(hx, browY, rx, ry, 0, Math.PI*0.10, Math.PI*0.90); ctx.stroke();
  ctx.strokeStyle = gray(0x54); ctx.lineWidth = 4.5;
  ctx.beginPath(); ctx.ellipse(hx, browY, rx, ry, 0, Math.PI*0.10, Math.PI*0.90); ctx.stroke();
  // small leaves lifting UP off the band, breaking the hairline so they read
  ctx.fillStyle = gray(0x48); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.lineJoin = "round";
  for (let i = -3; i <= 3; i++){
    const t = i/3;                                                  // -1..1 across the front
    const ax = hx + t*rx*0.94;
    const ay = browY - ry*(1 - Math.cos(t*Math.PI*0.5))*0.8;
    const lift = R*0.30*(1 - Math.abs(t)*0.25);
    const lean = t*R*0.12;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.quadraticCurveTo(ax + lean - R*0.05, ay - lift*0.7, ax + lean, ay - lift);
    ctx.quadraticCurveTo(ax + lean + R*0.05, ay - lift*0.7, ax, ay);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
}

/* The divine tell — a small over-bright catchlight in each eye, painted last so
   the goddess shows through the herald's shell. Uses the rig's reported head
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
    ctx.arc(ex - R*0.05 + gz.x*R*0.06, eyeY - R*0.05 + gz.y*R*0.05, R*0.062, 0, 7);
    ctx.fill();
  }
}

export const asset = {
  id:"character.athena-as-herald",
  type:"CHARACTER",
  name:"Athena as herald",
  statusWord:"PROCLAIMING",
  scene:"OD-B08-S01",

  params,
  layers:["shadow","staff","hair-back","legs","torso","far-arm","cloak","neck","head","face","hair-front","near-arm","wreath","bright-eyes"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.21}, crown:{x:.50,y:.14}, eyes:{x:.50,y:.22},
    staffTop:{x:.335,y:.18}, staffGrip:{x:.335,y:.595},
    rightHand:{x:.70,y:.20}, leftHand:{x:.34,y:.60},
    hip:{x:.50,y:.65}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // composed baseline — upright, alert, staff planted, faint ready smile
      neutral:     { preview:{ pose:"herald_poise", gaze:{x:.02,y:0}, t:0.5 } },
      // OD-B08-S01 SIGNATURE — proclaiming: far arm flung high, mouth wide on a cry
      proclaiming: { preview:{ pose:"herald_proclaim", gaze:{x:.1,y:-.12}, t:0.5 } },
      // OD-B08-S01 — summoning: beckoning point across the square, mouth open
      summoning:   { preview:{ pose:"herald_summon", gaze:{x:-.32,y:-.04}, t:0.5 } },
      // OD-B08-S01 — striding: the mobile voice moving briskly through the town
      striding:    { preview:{ pose:"herald_stride", gaze:{x:.12,y:-.06}, t:0.5 } },
      // OD-B08-S01 — confiding: voice lowered, palm-up, knowing half-smile, sidelong
      confiding:   { preview:{ pose:"herald_confide", gaze:{x:.34,y:.02}, t:0.5 } },
    },
    edges:[["neutral","proclaiming"],["proclaiming","summoning"],["summoning","striding"],
           ["striding","confiding"],["confiding","proclaiming"],["proclaiming","neutral"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — PROCLAIMING: the disguised goddess at full cry. Herald's
  // staff planted in the near hand, wreath on the brow, the far arm flung high
  // with an open calling palm, mouth wide on a summons, brows up and eyes bright
  // and wide, and the divine bright-eye tell glinting through the crier's shell.
  preview:()=>({ pose:"herald_proclaim", gaze:{x:.1,y:-.12},
                 browUp:.44, eyeWide:.26, jaw:.66, smile:.06,
                 t:0.5, status:"PROCLAIMING", progress:.24 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // staff planted behind the near hand so the grip reads
    drawStaff(ctx, W, H);
    const r = fig.draw(ctx, W, H, st) || {};
    // crier's wreath on the brow, crisp over the hair
    drawWreath(ctx, W, H, r.anchors);
    // the divine bright-eye tell, painted last so it survives the shell
    drawBrightEyes(ctx, W, H, r.anchors, st);
    return r;
  },
};
export default asset;
