/* character.polyphemus — the man-eating Cyclops of Book 9.
   CHARACTER asset. A COLOSSAL one-eyed giant: a single great central eye
   (no paired eyes), a shaggy mane and wild beard, a muscular brute in a
   rough hide tunic. Built on the HALFTRACK hero rig for the body/pose, with
   the cyclopean face painted OVER the rig: a skin patch erases the rig's
   paired eyes and a single huge eye + heavy shaggy unibrow + hanging fringe
   is stamped at the skull anchor the rig reports (so it tracks any pose).

   The one eye is a STATE: watch / glare / half-lidded (drunk) / shut (sleep)
   / blind (the bloodied, stake-ruined socket after Odysseus puts it out).
   Scene span OD-B09-S06..S11 — pastoral labor, predatory rage, drunken
   carelessness, the blinding, groping at the door, hurling from the shore. */
import { makeFigure, INK } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const TAU = Math.PI * 2;

/* ---- bespoke Polyphemus poses (brow + jaw + grasping arms authored
   together), registered into the shared rig registry so preview()/states
   can name them like any built-in pose. Each carries an `eye` mode read by
   the overpaint. ---- */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "polyphemus", n, opt }; };

// THE CARD — BRUTAL: casual contempt erupting into predatory violence. Brow
// crushed to a V, single eye glaring, mouth torn wide in a roar, both arms
// swung forward as grasping claws, chest thrown open, a half-step looming in.
P("poly_brutal", {
  bodyYaw:-.06, headYaw:-.08, gazeX:-.10, gazeY:-.02,
  spineLean:-.24, chestOpen:.45, headPitch:-.05,
  jaw:.72, browKnit:1, frown:.5, mouthAsym:.10,
  // both forearms swung UP in front of the chest as grasping claws
  armLUpper:-.34, armLLower:-1.34, armRUpper:.34, armRLower:1.34,
  handRotL:-.30, handRotR:.30, shoulderLiftL:.30, shoulderLiftR:.30,
  rootScale:1.0,
}, { hands:["open_palm","open_palm"] });

// pastoral labor — a heavy giant at routine work (herding, hauling), leaning
// down over his flock, not yet aware of intruders. Brow low but not enraged.
P("poly_labor", {
  bodyYaw:-.30, headYaw:-.24, gazeX:-.22, gazeY:.28,
  spineLean:-.20, headPitch:.26, neckPitch:.14,
  browKnit:.28, jaw:.05,
  armRUpper:-1.18, armRLower:.55, armLUpper:.46, armLLower:-.34,   // right arm reaching down to the flock
  handRotR:.15,
}, { hands:["relaxed","offering"] });

// satiated sleep — after the feast, slumped and rolled over, single eye shut,
// jaw hanging slack. The vulnerable beat that invites the blinding.
P("poly_sleep", {
  spineLean:.30, headPitch:.58, headRoll:.26, neckPitch:.30, headY:.14,
  jaw:.24, browKnit:.05,
  armLUpper:.16, armLLower:-.55, armRUpper:-.20, armRLower:.62,
  crouch:.24, kneeL:.42, kneeR:.42, hipL:-.12, hipR:.12,
}, { hands:["relaxed","relaxed"] });

// drunken carelessness — the wine working on him: weight slung onto one hip,
// head lolling, single eye down to a heavy-lidded slit, a loose slack grin.
P("poly_drunk", {
  bodyYaw:.18, headYaw:.12, headRoll:-.22, headPitch:.10,
  weightShift:.75, pelvisX:.30, spineLean:.12,
  smile:.34, jaw:.20, eyeNarrow:.6, browUp:.14,
  armRUpper:-.68, armRLower:.72, armLUpper:.50, armLLower:-.40, handRotR:.18,
}, { hands:["relaxed","open_palm"] });

// the blinding — drunken collapse into maximal pain: both fists driven up to
// the ruined eye, jaw torn wide in a howl, chest recoiling, brow crushed.
P("poly_blinded", {
  spineLean:.30, headPitch:-.12, chestOpen:.30,
  jaw:.80, browKnit:1, frown:.6,
  armLUpper:-.52, armLLower:-1.78, armRUpper:.52, armRLower:1.78,   // both hands clutch the face
  shoulderLiftL:.55, shoulderLiftR:.55, rootScale:1.0,
}, { hands:["fist","fist"] });

// blind gatekeeper — feeling the woolly backs at the cave door, head bowed to
// listen, groping arms spread, addressing his favorite ram. Eye ruined, dark.
P("poly_grope", {
  bodyYaw:-.16, headPitch:.42, neckPitch:.22, headY:.10,
  spineLean:-.18, jaw:.30, browKnit:.42,
  armLUpper:1.15, armLLower:.34, armRUpper:-1.15, armRLower:-.20,   // both hands out, feeling
  handRotL:-.18, handRotR:.18,
}, { hands:["open_palm","open_palm"] });

// blind on the shore — orienting by the voice on the water, face lifted, one
// arm hurling a torn crag overhead, roaring a curse / prayer to Poseidon.
P("poly_shore", {
  spineLean:-.10, headPitch:-.42, neckPitch:-.20, gazeY:-.34,
  jaw:.58, browKnit:.7, chestOpen:.42,
  armLUpper:2.46, armLLower:-.18, shoulderLiftL:.72,               // left arm high — the hurl
  armRUpper:-1.08, armRLower:.34,
}, { hands:["fist","point"] });

const params = {
  skin:"#c49a63",                       // sun-baked, ruddy-tan giant hide
  hairColor:"#2a231a",                  // wild dark-brown shaggy mane + beard
  hair:"curly", beard:true, glasses:false,
  garment:"rags", cloak:false, bareLegs:true,
  scale:1.6,                            // COLOSSAL — the scene/atlas scale for
                                        // composing him against human figures
};
// solo-card portrait scale: 1.6 overflows the frame (the head clips off the
// top), so the reusable card renders the giant at a fitted, still-looming size
// while `params.scale` stays the canonical 1.6 for scene placement.
const CARD_SCALE = 1.18;

const fig = makeFigure({ ...params, scale:CARD_SCALE });

/* ---- the cyclopean face, painted OVER the rig at the reported skull anchor.
   Erases the rig's paired eyes with a skin patch, then stamps a single huge
   eye (or ruined socket), one heavy shaggy unibrow, and a hanging fringe. ---- */
function drawCyclopsEye(ctx, cx, cy, R, st){
  const mode = st.eye || "glare";
  const gx = (st.gaze && st.gaze.x) || 0;
  const gy = (st.gaze && st.gaze.y) || 0;
  const eyeCy = cy - R*0.05;
  const SKIN = params.skin, HAIR = params.hairColor;

  // 1) skin patch — erase the rig's two eyes + paired brows
  ctx.fillStyle = SKIN;
  ctx.beginPath();
  ctx.ellipse(cx, cy - R*0.10, R*0.72, R*0.48, 0, 0, TAU);
  ctx.fill();

  if (mode === "blind"){
    // ruined, bloodied socket — dark ragged mass with radiating burn/blood
    // streaks and a pinched, weeping lid. Reads dark under the halftone.
    ctx.fillStyle = "#241c17";
    ctx.beginPath();
    const n = 12;
    for (let i=0;i<=n;i++){ const a=i/n*TAU; const rr=R*(0.30+0.07*Math.sin(a*3+1.6));
      const x=cx+Math.cos(a)*rr, y=eyeCy+Math.sin(a)*rr*0.82;
      i? ctx.lineTo(x,y):ctx.moveTo(x,y); }
    ctx.closePath(); ctx.fill();
    // radiating jagged streaks
    ctx.strokeStyle = INK; ctx.lineWidth = R*0.05; ctx.lineCap="round";
    for (let i=0;i<8;i++){ const a=(i/8)*TAU+0.25;
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(a)*R*0.26, eyeCy+Math.sin(a)*R*0.20);
      ctx.lineTo(cx+Math.cos(a)*R*0.60, eyeCy+Math.sin(a)*R*0.48);
      ctx.stroke(); }
    // pinched upper + lower lid
    ctx.strokeStyle = INK; ctx.lineWidth = R*0.08; ctx.lineCap="round";
    ctx.beginPath();
    ctx.moveTo(cx-R*0.46, eyeCy-R*0.02);
    ctx.quadraticCurveTo(cx, eyeCy-R*0.26, cx+R*0.46, eyeCy-R*0.02);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx-R*0.40, eyeCy+R*0.04);
    ctx.quadraticCurveTo(cx, eyeCy+R*0.26, cx+R*0.40, eyeCy+R*0.04);
    ctx.stroke();
  } else {
    // one huge central eye: watch/glare wide, half heavy-lidded, shut = a seam
    const open = mode==="shut" ? 0.06 : mode==="half" ? 0.52 : 1.0;
    const ew = R*0.54, eh = R*0.40*open;
    if (mode !== "shut"){
      // white almond
      ctx.fillStyle = "#f4f4f0"; ctx.strokeStyle = INK; ctx.lineWidth = R*0.05;
      ctx.beginPath();
      ctx.moveTo(cx-ew, eyeCy);
      ctx.quadraticCurveTo(cx, eyeCy-eh, cx+ew, eyeCy);
      ctx.quadraticCurveTo(cx, eyeCy+eh, cx-ew, eyeCy);
      ctx.closePath(); ctx.fill();
      // iris + pupil, clipped to the eye, gaze-shifted
      ctx.save(); ctx.clip();
      const px = cx + gx*R*0.24, py = eyeCy + gy*R*0.18 + R*0.02;
      ctx.fillStyle = "#3a312a";                       // iris
      ctx.beginPath(); ctx.arc(px, py, R*0.30, 0, TAU); ctx.fill();
      ctx.fillStyle = INK;                             // pupil
      ctx.beginPath(); ctx.arc(px, py, R*0.175, 0, TAU); ctx.fill();
      ctx.fillStyle = "#f4f4f0";                       // catchlight
      ctx.beginPath(); ctx.arc(px-R*0.07, py-R*0.07, R*0.055, 0, TAU); ctx.fill();
      ctx.restore();
    }
    // bold ink rim around the whole orb — reads as ONE staring eye
    ctx.strokeStyle = INK; ctx.lineWidth = R*0.075; ctx.lineCap="round"; ctx.lineJoin="round";
    ctx.beginPath();
    ctx.moveTo(cx-ew, eyeCy);
    ctx.quadraticCurveTo(cx, eyeCy-eh, cx+ew, eyeCy);
    if (mode === "shut"){
      ctx.stroke();
    } else {
      ctx.quadraticCurveTo(cx, eyeCy+eh, cx-ew, eyeCy);
      ctx.stroke();
    }
    if (mode === "half"){
      // a heavy fold pulled down over the orb — drowsy / drunk
      ctx.lineWidth = R*0.07;
      ctx.beginPath();
      ctx.moveTo(cx-ew*0.9, eyeCy-eh*0.35);
      ctx.quadraticCurveTo(cx, eyeCy-eh*0.95, cx+ew*0.9, eyeCy-eh*0.35);
      ctx.stroke();
    }
  }

  // 2) single heavy shaggy unibrow — a hard V (knit) over the eye
  const knit = st.browKnit != null ? st.browKnit : 0.6;
  const browY = eyeCy - R*0.52;
  ctx.strokeStyle = HAIR; ctx.lineWidth = R*0.15; ctx.lineCap="butt"; ctx.lineJoin="round";
  ctx.beginPath();
  ctx.moveTo(cx-R*0.62, browY - R*0.05);
  ctx.lineTo(cx,        browY + knit*R*0.22);
  ctx.lineTo(cx+R*0.62, browY - R*0.05);
  ctx.stroke();

  // 3) shaggy fringe hanging over the brow (covers the top skin-patch seam,
  //    ties into the crown mane) — a jagged band of pointed tufts
  ctx.fillStyle = HAIR; ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.lineJoin="round";
  const top = browY - R*0.58, bot = browY - R*0.04;
  ctx.beginPath();
  ctx.moveTo(cx-R*0.80, top);
  ctx.lineTo(cx+R*0.80, top);
  const T = 9;
  for (let i=0;i<=T;i++){
    const x = cx + R*0.80 - (i/T)*R*1.60;
    const y = (i % 2 === 0) ? bot : bot - R*0.24;
    ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

export const asset = {
  id:"character.polyphemus",
  type:"CHARACTER",
  name:"Polyphemus",
  statusWord:"BRUTAL",
  scene:"OD-B09-S07",

  params,
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head","beard",
          "near-arm","eye-patch","cyclops-eye","unibrow","fringe"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    eye:{x:.50,y:.22}, crown:{x:.50,y:.09}, head:{x:.50,y:.22},
    rightHand:{x:.30,y:.56}, leftHand:{x:.70,y:.56},
    mouth:{x:.50,y:.30}, hip:{x:.50,y:.64}, feet:{x:.50,y:.96},
  },
  states:{
    initial:"laboring",
    nodes:{
      // S06 — routine pastoral labor before he notices the intruders
      laboring: { preview:{ pose:"poly_labor", eye:"watch", browKnit:.28,
                            gaze:{x:-.22,y:.28}, t:0.5 } },
      // S07 — casual contempt erupting into predatory violence (the card)
      raging:   { preview:{ pose:"poly_brutal", eye:"glare", browKnit:1,
                            gaze:{x:-.10,y:-.02}, t:0.45 } },
      // S07 — satiated sleep after the feast, single eye shut
      sleeping: { preview:{ pose:"poly_sleep", eye:"shut", browKnit:.05,
                            gaze:{x:0,y:.2}, t:0.5 } },
      // S08 — routine turning careless as the wine takes hold, eye half-lidded
      drunk:    { preview:{ pose:"poly_drunk", eye:"half", browKnit:.05,
                            smile:.3, gaze:{x:.14,y:.18}, t:0.5 } },
      // S09 — the blinding: maximal pain, rage, blind guarding, ruined eye
      blinded:  { preview:{ pose:"poly_blinded", eye:"blind", browKnit:1,
                            gaze:{x:0,y:-.1}, t:0.45 } },
      // S10 — blind gatekeeper feeling the backs, addressing his ram
      groping:  { preview:{ pose:"poly_grope", eye:"blind", browKnit:.42,
                            gaze:{x:0,y:.4}, t:0.5 } },
      // S11 — blind on the shore, hurling a crag, praying to Poseidon
      hurling:  { preview:{ pose:"poly_shore", eye:"blind", browKnit:.7,
                            gaze:{x:.05,y:-.34}, t:0.45 } },
    },
    edges:[["laboring","raging"],["raging","sleeping"],["sleeping","drunk"],
           ["drunk","blinded"],["blinded","groping"],["groping","hurling"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band","eye",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — BRUTAL: the single eye glaring wide under a crushed
  // unibrow, mouth torn open in a roar, both arms swung forward as grasping
  // claws. A colossal, shaggy, one-eyed brute mid-lunge.
  preview:()=>({ pose:"poly_brutal", eye:"glare", browKnit:1,
                 gaze:{x:-.10,y:-.02}, t:0.45, status:"BRUTAL", progress:.24 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band;
    const out = fig.draw(ctx, W, H, st) || {};
    // stamp the cyclopean face at the reported skull anchor so it tracks pose
    const head  = (out.anchors && out.anchors.head)  || { x:.50, y:.24 };
    const crown = (out.anchors && out.anchors.crown) || { x:.50, y:.12 };
    const cx = head.x*W, cy = head.y*H;
    const R  = Math.hypot((head.x-crown.x)*W, (head.y-crown.y)*H) || H*0.09;
    drawCyclopsEye(ctx, cx, cy, R, st);
    return out;
  },
};
export default asset;
