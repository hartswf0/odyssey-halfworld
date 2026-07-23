/* character.demodocus — the blind inspired bard of the Phaeacians.
   CHARACTER asset on the HALFTRACK hero rig: an older man whose sight is
   gone (closed, blank eyes) but whose song is god-given. Robed, seated-bard
   bearing, a phorminx (lyre) cradled to the chest and raised as he projects.
   His whole identity is the INSPIRED BLIND FACE: sightless eyes, chin lifted,
   brows raised, mouth open in song — the Muse pouring through a man who
   cannot see his own audience.

   Scene function:
     OD-B08-S02  blind bard locating the lyre and PROJECTING SONG, unaware
                 the stranger (Odysseus) has collapsed weeping nearby
     OD-B08-S05  bard performing an EXACT story — proof of divine inspiration

   EXPRESSIVENESS: the hero rig reads facial channels (blink, browUp, browKnit,
   jaw, smile, gaze) from the composed pose + state. Blindness is authored with
   blink≈1 (eyes held closed — no pupils) in EVERY state, so he never "looks"
   at anything; the rapture is carried by lifted brows + a raised chin + an open
   jaw. Like Nestor/Phemius he ships bespoke poses into the shared POSE registry
   so brow + head-lift + arms-on-the-lyre are authored together and every state
   actually emotes. The lyre is a capability layer, cradled upright against the
   chest (the flat rig splays any "reach" sideways, so it anchors to the torso,
   not the hands) and RAISED in the song states. Stowed on the back turn. */
import { makeFigure, INK } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Demodocus poses: brow + head-lift + arms on the lyre together.
   Convention: negative headPitch/neckPitch lifts the chin (the inspired,
   sightless upward bearing); a slight positive spineLean arches him back into
   the song; the left forearm bends up to CRADLE the soundbox, the right lifts
   toward the strings to PLUCK. Blindness (blink) is set per-state below. ---- */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "demodocus", n, opt }; };

// THE CARD — INSPIRED: sightless eyes closed, chin lifted and tilted, brows
// raised high in rapture, mouth just parted as the next verse forms. Cradling
// the lyre, right hand at the strings. The blind man singing into a light he
// cannot see.
P("demo_rapt", {
  browUp:.66, browKnit:.08, jaw:.30, smile:.08,
  headPitch:-.24, neckPitch:-.12, headRoll:.07,
  spineLean:.10, bodyYaw:-.08, headYaw:.06,
  armLUpper:.18, armLLower:-1.46, shoulderLiftL:.14,  // left forearm folds up, cradling the box
  armRUpper:.12, armRLower:1.50, shoulderLiftR:.16,   // right forearm folds across to the strings
}, { hands:["relaxed","point"] });

// PROJECTING — OD-B08-S02: located the lyre, now throwing the song out over the
// hall, head lifted, jaw dropped open on a sung vowel, brows high. He is turned
// UP and OUT, wholly unaware of the stranger's collapse below.
P("demo_projecting", {
  browUp:.74, browKnit:.04, jaw:.52, smile:.16,
  headPitch:-.34, neckPitch:-.18, headRoll:.05,
  spineLean:.13, bodyYaw:-.06, headYaw:.10, chestOpen:.28,
  armLUpper:.22, armLLower:-1.50, shoulderLiftL:.16,  // cradle folded up
  armRUpper:.06, armRLower:1.38, shoulderLiftR:.20,   // hand folded in at the strings
}, { hands:["relaxed","point"] });

// LOCATING — OD-B08-S02 (earlier beat): the sightless hand FINDING the lyre —
// reaching out and down to feel for the instrument, head still lifted, brows
// raised in the listening/anticipating way of the blind. Right arm out low.
P("demo_locating", {
  browUp:.52, browKnit:.16, jaw:.10,
  headPitch:-.14, neckPitch:-.06, headRoll:.04,
  spineLean:-.06, bodyYaw:-.14, headYaw:.14,
  armLUpper:.30, armLLower:-.60,
  armRUpper:-1.18, armRLower:.52, shoulderLiftR:.10,  // hand out, feeling for the strings
}, { hands:["relaxed","offering"] });

// INSPIRED — OD-B08-S05: performing the EXACT story, proof the Muse is in him.
// Head thrown back, chest arched open, jaw WIDE on the pouring song, brows at
// their highest. Both arms locked to the raised lyre. Divine inspiration made
// visible — a blind man reciting a truth he could not have witnessed.
P("demo_inspired", {
  browUp:.82, browKnit:.02, jaw:.66, smile:.14, cheek:.2,
  headPitch:-.42, neckPitch:-.24, headRoll:.02,
  spineLean:.18, chestOpen:.52, bodyYaw:-.04, headYaw:.04,
  armLUpper:.28, armLLower:-1.56, shoulderLiftL:.22,  // cradle, lifted high
  armRUpper:.02, armRLower:1.50, shoulderLiftR:.26,   // hand folded in, high on the strings
}, { hands:["relaxed","point"] });

const params = {
  // an OLDER man: weathered warm skin, a WHITE mane + full grey beard. hairColor
  // a light-mid grey — light enough to read as a white-haired elder, dark enough
  // that the mane + beard hold real halftone mass and don't wash into the skin.
  skin:"#d3c2a6", hairColor:"#6d695f",
  hair:"curly", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.02,
};

const fig = makeFigure(params);

/* ---- phorminx palette (solid grays + hard contour; the engine POST pass
   supplies the halftone, so no pre-dithering here) ---- */
const BOX_WOOD = "#938a7e";   // soundbox (tortoise-shell bowl) — pale wood
const BOX_RIM  = "#6f685e";   // soundbox rim / deeper edge
const ARM_HORN = "#a89f93";   // the two curving arms (goat-horn / wood)
const YOKE_BAR = "#8c8377";   // crossbar

/* draw a phorminx whose soundbox base sits at (baseX,baseY) and whose yoke
   rises toward (topX,topY). Proportions keyed off R (headR) so it stays a
   stable identity prop; the aim point only sets position + tilt, not size.
   Local frame: y=0 at the soundbox base, the instrument grows toward -y. */
function lyre(ctx, baseX, baseY, topX, topY, R){
  const dx = topX-baseX, dy = topY-baseY;
  const theta = Math.atan2(dx, -dy);          // local -Y aligns to (dx,dy)
  const H = R*2.25;                            // base -> yoke height
  ctx.save();
  ctx.translate(baseX, baseY);
  ctx.rotate(theta);
  ctx.lineJoin = "round"; ctx.lineCap = "round";

  const armY  = -H;                            // yoke height
  const boxTop= -R*0.95;                       // top of the soundbox
  const bridgeY = -R*0.78;                     // string bridge on the box
  const cornerX = R*0.42;                      // where arms leave the box (narrow)
  const tipX    = R*1.0;                       // arm-tip / yoke half-width (horns)

  // --- soundbox: rounded tortoise-shell bowl, rim first for a hard edge ---
  ctx.fillStyle = BOX_RIM; ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(0, -R*0.45, R*0.8, R*0.68, 0, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = BOX_WOOD;
  ctx.beginPath(); ctx.ellipse(0, -R*0.5, R*0.62, R*0.52, 0, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();

  // --- two arms bowing OUT of the box like horns, then in to the yoke tips ---
  ctx.fillStyle = ARM_HORN; ctx.strokeStyle = INK; ctx.lineWidth = 4;
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(s*cornerX, boxTop);
    ctx.quadraticCurveTo(s*R*1.4,  -H*0.42,   s*tipX,        armY+R*0.30);
    ctx.lineTo(s*(tipX-R*0.30), armY+R*0.30);
    ctx.quadraticCurveTo(s*R*0.85, -H*0.42,   s*cornerX*0.4, boxTop-R*0.02);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }

  // --- yoke (crossbar) linking the two arm tips, overhanging past them ---
  ctx.fillStyle = YOKE_BAR;
  ctx.beginPath();
  ctx.roundRect(-tipX-R*0.14, armY-R*0.04, (tipX+R*0.14)*2, R*0.30, R*0.13);
  ctx.fill(); ctx.stroke();

  // --- pale string-plane so the strings read against it (not lost on the robe) ---
  const span = R*0.46;
  ctx.fillStyle = "#c9c1b5"; ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-span-R*0.14, bridgeY);
  ctx.lineTo( span+R*0.14, bridgeY);
  ctx.lineTo( span+R*0.02, armY+R*0.18);
  ctx.lineTo(-span-R*0.02, armY+R*0.18);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // --- strings: bridge on the box up to the yoke ---
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
  const nStr = 7;
  for (let i=0;i<nStr;i++){
    const x = -span + (span*2)*(i/(nStr-1));
    ctx.beginPath(); ctx.moveTo(x, bridgeY); ctx.lineTo(x*0.9, armY+R*0.14); ctx.stroke();
  }
  // bridge + a soundbox seam so the box keeps a face under the dots
  ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.moveTo(-span-R*0.1, bridgeY); ctx.lineTo(span+R*0.1, bridgeY); ctx.stroke();
  ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(0, -R*0.45, R*0.14, 0, Math.PI*2); ctx.stroke();

  ctx.restore();
}

// how high the lyre rides for a given pose — cradled low at rest, lifted and
// pushed out into the hall as the song projects.
function lyreRaiseFor(pose){
  if (pose === "demo_inspired")   return 1.0;
  if (pose === "demo_projecting") return 0.66;
  if (pose === "demo_rapt")       return 0.44;
  if (pose === "demo_locating")   return 0.10;
  return 0.22;
}

export const asset = {
  id:"character.demodocus",
  type:"CHARACTER",
  name:"Demodocus",
  statusWord:"INSPIRED",
  scene:"OD-B08-S02",

  params,
  layers:["shadow","hair-back","legs","torso","robe","far-arm","neck","head","face","hair-front","beard","near-arm","lyre"],
  // normalized 0..1 anchors for scene attachment / gaze / the instrument
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.62,y:.52}, leftHand:{x:.38,y:.60},
    lyreGrip:{x:.40,y:.60}, yoke:{x:.55,y:.32},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
    audience:{x:.16,y:.30}, sky:{x:.60,y:.08},
  },
  states:{
    initial:"inspired",
    nodes:{
      // THE beat / signature — the rapt blind singer, chin lifted, mouth parted
      inspiredCalm:{ preview:{ pose:"demo_rapt", blink:1, gaze:{x:0,y:0},
                               status:"INSPIRED" } },
      // OD-B08-S02 — locating the lyre by touch, sightless hand out
      locating:    { preview:{ pose:"demo_locating", blink:1, gaze:{x:0,y:0},
                               status:"LOCATING" } },
      // OD-B08-S02 — projecting the song out over the hall, jaw open, unaware
      projecting:  { preview:{ pose:"demo_projecting", blink:1, gaze:{x:0,y:0},
                               status:"SINGING" } },
      // OD-B08-S05 — the exact story pouring through: head back, jaw wide, arched
      inspired:    { preview:{ pose:"demo_inspired", blink:1, gaze:{x:0,y:0},
                               status:"INSPIRED" } },
      // stable identity turns (eyes stay closed — he is always blind)
      profile:     { preview:{ pose:"profile_left", blink:1, lyre:true } },
      back:        { preview:{ pose:"back_view", blink:1, lyre:false } },
    },
    edges:[
      ["inspiredCalm","locating"],["locating","projecting"],
      ["projecting","inspired"],["inspired","inspiredCalm"],
      ["inspiredCalm","projecting"],["inspiredCalm","profile"],["inspiredCalm","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band","blink","lyre",
            "browUp","browKnit","jaw","smile","cheek"],

  // EXPRESSIVE signature — INSPIRED: a blind, white-haired bard, eyes held shut,
  // chin lifted and tilted into a light he cannot see, brows raised in rapture,
  // mouth parted on the forming verse, the lyre cradled and raised against his
  // chest. blink:1 keeps the eyes sightless so the face can't read as "looking."
  preview:()=>({ pose:"demo_rapt", blink:1, gaze:{x:0,y:0}, t:0.4,
                 status:"INSPIRED", progress:.22 }),

  draw(ctx, W, H, state={}){
    if (state && state.band) fig.spec.band = state.band;
    // 1) the rig, in solid grays + contour. blindness rides in on state.blink.
    const out = fig.draw(ctx, W, H, state);
    const rig = fig.hero.rig, d = rig.dim, R = d.headR;

    // 2) the phorminx — capability; stowed on the back turn. Cradled upright
    //    against the chest and lifted by the active song pose.
    const pose = state.pose || "demo_rapt";
    const turnedAway = (pose === "back_view" || state.band === "back" || state.lyre === false);
    if (!turnedAway){
      const chest = rig.chest.point(), pel = rig.pelvis.point();
      const raise = lyreRaiseFor(pose);
      const baseX = pel.x - R*0.72;
      const baseY = pel.y + R*0.18 - raise*R*1.15;   // ride up into the song
      const topX  = baseX + R*(0.15 + raise*0.10);    // tilt a touch outward when raised
      const topY  = baseY - R*2.25;                   // U-frame rises to the shoulder
      lyre(ctx, baseX, baseY, topX, topY, R);
    }
    return out;
  },
};
export default asset;
