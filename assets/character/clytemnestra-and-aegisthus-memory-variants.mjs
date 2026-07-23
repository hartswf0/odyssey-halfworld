/* character.clytemnestra-and-aegisthus-memory-variants — the two conspirators
   as they surface inside Agamemnon's recollection in the House of the Dead.
   A "memory variant" CHARACTER that draws BOTH plotters: CLYTEMNESTRA (left),
   the treacherous queen, a blade lifted overhead in a striking gesture, her
   face cold — narrowed eyes, knit brow, a cruel skewed mouth, NOT screaming;
   and AEGISTHUS (right), the lover-usurper, urging her on / watching with the
   same cold malice. They are memory-figures, not present speakers and not full
   ghosts: the whole pair is rendered FAINT (reduced ink) so it reads as a thing
   remembered, hanging inside Agamemnon's account rather than standing in the room.
   Composes the HALFTRACK hero rig TWICE, with bespoke conspirator poses, and
   draws the queen's dagger as a prop pinned to her striking hand. The engine
   POST pass supplies the halftone dots.
   Atlas scene: OD-B11-S06 — conspirators acting WITHIN Agamemnon's account. */
import { makeFigure, INK, HERO_POSES } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI * 2;

/* ---- bespoke poses (brow + jaw + arms authored together as one cold,
   treacherous attitude), registered into the shared rig registry so preview()
   and the state machine can name them like any built-in pose. ---- */
const P = (id, n, opt = {}) => { HERO_POSES[id] = { id, label: id, group: "conspirators", n, opt }; };

// CLYTEMNESTRA striking — turned slightly toward the remembered victim, her
// NEAR (right) arm flung overhead gripping the dagger to plunge it down, far
// arm braced forward. Face COLD: jaw shut, brow crushed, eyes narrowed to
// slits, mouth skewed in cruelty — a controlled kill, not a shriek.
P("clyt_strike", {
  bodyYaw:.18, headYaw:.12, gazeX:.30, gazeY:.06,
  spineLean:-.12, chestOpen:.24, shoulderTilt:.06,
  jaw:.04, browKnit:.62, frown:.24, eyeNarrow:.5, mouthAsym:.42,
  armRUpper:-2.66, armRLower:.30, handRotR:.12, shoulderLiftR:.72,   // near arm flung overhead — the strike
  armLUpper:.66, armLLower:-.42,                                     // far arm braced toward the victim
}, { hands:["relaxed","fist"] });

// CLYTEMNESTRA cold hold — the blade lowered at her side, a queen simply
// waiting, her cold stare fixed sidelong. The malice held still.
P("clyt_cold", {
  bodyYaw:.14, headYaw:.08, gazeX:.24, gazeY:.05,
  spineLean:-.02,
  jaw:0, browKnit:.46, frown:.16, eyeNarrow:.5, mouthAsym:.34,
  armRUpper:-.34, armRLower:.56, handRotR:.08,                       // right arm down, blade held low at side
  armLUpper:.16, armLLower:-.20,
}, { hands:["relaxed","fist"] });

// CLYTEMNESTRA conspiring — leaning in to Aegisthus, blade drawn low and
// hidden against her hip, one hand slid out to coax him, cold and intimate.
P("clyt_conspire", {
  bodyYaw:.30, headYaw:.22, gazeX:.34, gazeY:.06,
  spineLean:-.20, headPitch:-.04,
  jaw:.08, browKnit:.34, eyeNarrow:.4, mouthAsym:.4,
  armRUpper:-.20, armRLower:.72, handRotR:.1,                        // blade hand tucked low at the hip
  armLUpper:.9, armLLower:-.34,                                      // near hand slid toward him, coaxing
}, { hands:["relaxed","fist"] });

// AEGISTHUS urging — the lover-usurper on the right, his NEAR (left) arm
// thrust toward her pointing the victim out, cold face, jaw set, mouth
// skewed the other way so the two cruelties mirror.
P("aeg_urge", {
  bodyYaw:-.22, headYaw:-.15, gazeX:-.28, gazeY:.03,
  spineLean:-.14, chestOpen:.14,
  jaw:.05, browKnit:.5, frown:.2, eyeNarrow:.44, mouthAsym:-.34,
  armLUpper:-1.18, armLLower:-.5, handRotL:-.1,                      // near/left arm extended, urging her on
  armRUpper:.34, armRLower:.44,
}, { hands:["point","relaxed"] });

// AEGISTHUS watching — arms folded, cold-eyed, waiting for the blow to fall.
P("aeg_watch", {
  bodyYaw:-.16, headYaw:-.10, gazeX:-.22, gazeY:.06,
  jaw:0, browKnit:.54, frown:.14, eyeNarrow:.5, mouthAsym:-.3,
  armLUpper:-1.02, armLLower:-1.30, armRUpper:1.02, armRLower:1.30,  // arms crossed
  handRotL:-.4, handRotR:.4,
}, { hands:["relaxed","relaxed"] });

// AEGISTHUS conspiring — leaning close, whispering the plan, one hand low
// between them, the same cold skewed mouth.
P("aeg_lean", {
  bodyYaw:-.32, headYaw:-.22, gazeX:-.32, gazeY:.05,
  spineLean:-.26, headPitch:-.04,
  jaw:.14, browKnit:.3, eyeNarrow:.32, mouthAsym:-.38,
  armLUpper:-.76, armLLower:-.72, handRotL:-.08,
  armRUpper:.4, armRLower:.52,
}, { hands:["relaxed","relaxed"] });

/* ---- the two conspirators. Distinct silhouettes so they never read as one
   doubled figure: CLYTEMNESTRA is a queen in a long dress, dark hair, no
   cloak; AEGISTHUS is a bearded man in a robe + cloak, a touch shorter and
   broader. ---- */
const clytParams = {
  skin:"#dcc6a6", hairColor:"#22190f",
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:1.08,
};
const aegParams = {
  skin:"#c7ad86", hairColor:"#281c11",
  hair:"curly", beard:true, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:1.02,
};

const clytFig = makeFigure(clytParams);
const aegFig  = makeFigure(aegParams);

/* per-variant sub-poses for each conspirator. */
const V = {
  // STRIKING (the card) — queen's dagger overhead mid-plunge, Aegisthus urging.
  striking: {
    clyt: { pose:"clyt_strike",  browKnit:.62, eyeNarrow:.5, frown:.24, mouthAsym:.42, gaze:{x:.30,y:.06}, t:.5 },
    aeg:  { pose:"aeg_urge",     browKnit:.5,  eyeNarrow:.44, frown:.2, mouthAsym:-.34, gaze:{x:-.28,y:.03}, t:.5 },
  },
  // COLD — the held pause: blade lowered, both faces set in cold malice.
  cold: {
    clyt: { pose:"clyt_cold",    browKnit:.46, eyeNarrow:.5, frown:.16, mouthAsym:.34, gaze:{x:.24,y:.05}, t:.5 },
    aeg:  { pose:"aeg_watch",    browKnit:.54, eyeNarrow:.5, frown:.14, mouthAsym:-.3,  gaze:{x:-.22,y:.06}, t:.5 },
  },
  // CONSPIRING — heads leaned together, plotting, the blade hidden low.
  conspiring: {
    clyt: { pose:"clyt_conspire", browKnit:.34, eyeNarrow:.4, mouthAsym:.4,  gaze:{x:.34,y:.06}, t:.5 },
    aeg:  { pose:"aeg_lean",      browKnit:.3,  eyeNarrow:.32, mouthAsym:-.38, gaze:{x:-.32,y:.05}, t:.5 },
  },
};

/* ---- the queen's dagger, pinned to whichever hand grips it. Drawn in flat
   metal grays + hard contour; the engine dotifies it with everything else.
   `up` raises the blade for the overhead strike; otherwise it hangs point-down
   at her side. Coordinates are in the figure's local box space. ---- */
function drawDagger(ctx, hx, hy, S, up){
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(up ? -0.35 : 2.15);           // point up-forward on the strike, down at the side
  const bl = S*3.6, bw = S*0.6;            // blade length + half-width
  // pommel + grip (below the hand)
  ctx.fillStyle="#3a352c"; ctx.strokeStyle=INK; ctx.lineWidth=3.5; ctx.lineJoin="round";
  ctx.beginPath(); ctx.roundRect(-bw*0.5, S*0.2, bw, S*1.05, bw*0.4); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, S*1.35, bw*0.55, 0, TAU); ctx.fill(); ctx.stroke();
  // crossguard
  ctx.fillStyle="#4a463c";
  ctx.beginPath(); ctx.roundRect(-bw*1.35, -S*0.05, bw*2.7, S*0.34, bw*0.3); ctx.fill(); ctx.stroke();
  // blade — long tapering triangle rising from the guard
  ctx.fillStyle="#8f8f88"; ctx.strokeStyle=INK; ctx.lineWidth=3.5;
  ctx.beginPath();
  ctx.moveTo(-bw*0.62, 0);
  ctx.lineTo( bw*0.62, 0);
  ctx.lineTo( bw*0.12, -bl);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // fuller / bright edge highlight down the spine
  ctx.strokeStyle="#dedad0"; ctx.lineWidth=2.4;
  ctx.beginPath(); ctx.moveTo(-bw*0.1, -S*0.2); ctx.lineTo(-bw*0.02, -bl*0.9); ctx.stroke();
  ctx.restore();
}

/* draw one conspirator into a full-height box centered at cx (normalized), so
   both stand on the same remembered floor. Returns the figure's live anchors. */
function drawConspirator(ctx, W, H, fig, sub, cx, boxFrac){
  const boxW = W*boxFrac;
  ctx.save();
  ctx.translate(cx*W - boxW/2, 0);
  ctx.beginPath(); ctx.rect(-W*0.06, 0, boxW+W*0.12, H); ctx.clip();
  const out = fig.draw(ctx, boxW, H, sub) || {};
  // hand back into the shared frame (un-normalized to this box, still translated)
  let hand = null;
  if (out.anchors && out.anchors.rightHand){
    hand = { x: out.anchors.rightHand.x*boxW, y: out.anchors.rightHand.y*H };
  }
  ctx.restore();
  if (hand) hand = { x: hand.x + (cx*W - boxW/2), y: hand.y };
  return { hand, boxW };
}

/* a faint memory frame: a soft light-gray oval seating the pair "inside" the
   recollection, plus a low ground shadow band. Kept light so the dotify pass
   renders it as a whisper of texture, not a wall. */
function drawMemoryField(ctx, W, H){
  ctx.save();
  // soft recollection halo — a couple of very light concentric ovals
  ctx.strokeStyle="#cfcfc7"; ctx.lineWidth=6;
  ctx.beginPath(); ctx.ellipse(W*0.5, H*0.52, W*0.44, H*0.46, 0, 0, TAU); ctx.stroke();
  ctx.strokeStyle="#dcdcd4"; ctx.lineWidth=4;
  ctx.beginPath(); ctx.ellipse(W*0.5, H*0.52, W*0.40, H*0.42, 0, 0, TAU); ctx.stroke();
  // faint low ground the memory-figures stand on
  ctx.fillStyle="#d2d2ca";
  ctx.beginPath(); ctx.ellipse(W*0.5, H*0.90, W*0.40, H*0.05, 0, 0, TAU); ctx.fill();
  ctx.restore();
}

export const asset = {
  id:"character.clytemnestra-and-aegisthus-memory-variants",
  type:"CHARACTER",
  name:"Clytemnestra and Aegisthus memory variants",
  statusWord:"TREACHERY",
  scene:"OD-B11-S06",

  params:{ clytemnestra:clytParams, aegisthus:aegParams, figures:2, memoryTone:true },
  layers:["memory-field","shadow","hair-back","legs","torso","cloak","far-arm",
          "neck","head","face","hair-front","beard","near-arm","dagger"],
  // normalized 0..1 anchors: each conspirator's head + the queen's striking
  // hand + blade tip, and the contested midpoint between them.
  anchors:{
    clytemnestraHead:{x:.32,y:.19}, clytemnestraHand:{x:.44,y:.16},
    bladeTip:{x:.46,y:.05},
    aegisthusHead:{x:.70,y:.21}, aegisthusHand:{x:.56,y:.50},
    plotPoint:{x:.50,y:.44}, feet:{x:.50,y:.90},
  },
  states:{
    initial:"striking",
    nodes:{
      // the card — the queen's dagger overhead mid-plunge, Aegisthus urging her on
      striking:   { preview:{ variant:"striking" } },
      // the held pause — blade lowered, both faces cold, waiting
      cold:       { preview:{ variant:"cold" } },
      // heads leaned together, plotting, the blade hidden low
      conspiring: { preview:{ variant:"conspiring" } },
    },
    edges:[["conspiring","cold"],["cold","striking"],
           ["striking","cold"],["cold","conspiring"]],
  },
  channels:["variant","pose","gaze","mouth","jaw","browUp","browKnit",
            "frown","eyeNarrow","eyeWide","mouthAsym","blink"],

  // CARD SIGNATURE — TREACHERY: two faint remembered conspirators. The queen
  // Clytemnestra lifts the dagger overhead to strike, cold-eyed and skewed of
  // mouth; Aegisthus at her side points the victim out with the same cold
  // malice. The whole pair rendered faint — a thing recalled, not present.
  preview:()=>({ variant:"striking", status:"TREACHERY", progress:.5 }),

  draw(ctx, W, H, state){
    const s = state || {};
    const v = V[s.variant] || V.striking;

    drawMemoryField(ctx, W, H);

    // MEMORY TONE: render the conspirators FAINT (reduced ink) so they read as
    // recollected figures inside Agamemnon's account, not full solid ghosts.
    ctx.save();
    ctx.globalAlpha = 0.72;
    // Aegisthus first (slightly back on the right), then the queen front-left
    drawConspirator(ctx, W, H, aegFig, v.aeg, 0.68, 0.56);
    const clyt = drawConspirator(ctx, W, H, clytFig, v.clyt, 0.33, 0.56);
    // the dagger, pinned to the queen's gripping (right) hand
    if (clyt.hand){
      const S = H*0.028;
      const up = (s.variant || "striking") === "striking";
      drawDagger(ctx, clyt.hand.x, clyt.hand.y, S, up);
    }
    ctx.restore();
  },
};
export default asset;
