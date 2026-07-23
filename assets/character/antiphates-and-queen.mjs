/* character.antiphates-and-queen — the cannibal Laestrygonian king and his
   colossal queen, launching the slaughter from their own hall (Book 10).
   A TWO-FIGURE CHARACTER: draws BOTH enormous brutish giants together inside a
   domestic interior — rough stone walls, a black threshold, a hearth. The KING
   (left) lunges with a seizing/pointing arm, roaring the order; the QUEEN
   (right) is MOUNTAINOUS — a heavier, taller frame — one great arm flung up
   summoning her people to the attack. Both wear rough hide rags, both carry
   monstrous knit-browed faces with jaws torn open.
   Composes the HALFTRACK hero rig TWICE (king + queen), each with bespoke
   poses, over a flat-gray interior backdrop. The engine POST pass adds the dots.
   Atlas scene: OD-B10-S02 — cannibal king + colossal queen initiating the attack. */
import { makeFigure, INK } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const TAU = Math.PI * 2;

/* ---- bespoke poses (brow + jaw + grasping/summoning arms authored together),
   registered into the shared rig registry so preview()/states can name them
   like any built-in pose. ---- */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "laestrygon", n, opt }; };

// KING — the seize/summon: a half-step lunge, chest thrown open, brow crushed
// to a V, jaw torn wide on the shouted order, near arm thrust FORWARD as a
// grasping claw pointing the attack, far arm swung back for the drive.
P("anti_seize", {
  bodyYaw:-.18, headYaw:-.14, gazeX:-.24, gazeY:.04,
  spineLean:-.28, chestOpen:.5, headPitch:-.02, shoulderTilt:.06,
  jaw:.9, browKnit:1, frown:.7, mouthAsym:.12, eyeNarrow:.35,
  armRUpper:-1.24, armRLower:.66, handRotR:.2,       // near arm thrust forward-DOWN — the seize
  armLUpper:.6, armLLower:-.36, shoulderLiftR:.34,   // far arm cocked back
  rootScale:1.0,
}, { hands:["fist","fist"] });

// KING roaring command — squared up, both fists up, maximal roar (the alarm).
P("anti_roar", {
  bodyYaw:-.04, headYaw:-.04, gazeX:-.05, gazeY:-.06,
  spineLean:-.20, chestOpen:.42, headPitch:-.08,
  jaw:.88, browKnit:1, frown:.6,
  armLUpper:-.40, armLLower:-1.30, armRUpper:.40, armRLower:1.30,  // both forearms up as claws
  handRotL:-.28, handRotR:.28, shoulderLiftL:.4, shoulderLiftR:.4,
}, { hands:["open_palm","open_palm"] });

// QUEEN — the summons: one colossal arm flung overhead calling the horde in,
// far arm sweeping low, body turned to face the hall, brow knit, jaw wide on a
// bellow. Mountainous by scale (set on her figure spec).
P("queen_summon", {
  bodyYaw:.22, headYaw:.16, gazeX:.26, gazeY:-.14,
  spineLean:-.12, chestOpen:.55, headPitch:-.08,
  jaw:.8, browKnit:.95, frown:.6, mouthAsym:-.12, eyeWide:.22,
  armLUpper:2.62, armLLower:-.12, shoulderLiftL:.72,   // near arm flung HIGH overhead — the summons
  armRUpper:-.7, armRLower:.7, handRotR:.2,             // far arm sweeping the horde forward
}, { hands:["open_palm","fist"] });

// QUEEN reaching to seize — both great arms out, grasping, leaning her mountain
// of a body forward over the prey.
P("queen_grasp", {
  bodyYaw:.10, headYaw:.10, gazeX:.16, gazeY:.06,
  spineLean:-.24, chestOpen:.4,
  jaw:.5, browKnit:1, frown:.55,
  armLUpper:1.36, armLLower:-.22, armRUpper:-1.42, armRLower:.2,  // both arms reach out wide
  handRotL:-.22, handRotR:.22, shoulderLiftL:.3, shoulderLiftR:.3,
}, { hands:["open_palm","open_palm"] });

// both figures looming still — heads lowered, watching, before the eruption.
P("anti_loom", {
  bodyYaw:-.14, headYaw:-.10, gazeX:-.2, gazeY:.16,
  spineLean:-.06, headPitch:.20, neckPitch:.12,
  jaw:.08, browKnit:.55,
  armLUpper:.16, armLLower:-.30, armRUpper:-.20, armRLower:.34,
}, { hands:["fist","relaxed"] });
P("queen_loom", {
  bodyYaw:.14, headYaw:.10, gazeX:.2, gazeY:.16,
  spineLean:-.05, headPitch:.22, neckPitch:.12,
  jaw:.06, browKnit:.5,
  armLUpper:.20, armLLower:-.34, armRUpper:-.16, armRLower:.30,
}, { hands:["relaxed","fist"] });

/* ---- the two giants. Both brutish, rough hide rags, wild shaggy hair. The
   KING is broad and bearded; the QUEEN is MOUNTAINOUS — a larger scale so she
   towers as the bigger of the two — with a wild loose mane, no beard. Distinct
   silhouettes so they never read as one doubled figure. ---- */
const kingParams = {
  skin:"#b7936a", hairColor:"#241c12",
  hair:"curly", beard:true, glasses:false,
  garment:"rags", cloak:false, bareLegs:true,
  scale:1.14,                         // huge
};
const queenParams = {
  skin:"#c2a079", hairColor:"#2a2016",
  hair:"curly", beard:false, glasses:false,
  garment:"rags", cloak:true, bareLegs:false,
  scale:1.34,                         // MOUNTAINOUS — the bigger of the two
};

const kingFig  = makeFigure(kingParams);
const queenFig = makeFigure(queenParams);

/* per-variant sub-poses for each giant. */
const V = {
  // INITIATING (the card) — king seizes/points the order, queen flings up the summons.
  initiating: {
    king:  { pose:"anti_seize",   browKnit:1,   jaw:1.25, frown:.5, mouthAsym:.15, eyeNarrow:.35, voiceEnergy:.7, gaze:{x:-.24,y:.04}, t:.5 },
    queen: { pose:"queen_summon", browKnit:.95, jaw:1.15, frown:.45, eyeWide:.3, voiceEnergy:.7, gaze:{x:.26,y:-.14}, t:.5 },
  },
  // ROARING — both squared to the hall, jaws unhinged, the full alarm going up.
  roaring: {
    king:  { pose:"anti_roar",    browKnit:1,  jaw:.88, eyeWide:.35, frown:.6, gaze:{x:-.05,y:-.06}, t:.5 },
    queen: { pose:"queen_grasp",  browKnit:1,  jaw:.66, eyeWide:.3,  frown:.55, gaze:{x:.16,y:.06}, t:.5 },
  },
  // LOOMING — the pause before: heads lowered, watching the trapped prey, brows
  // already knit, hands half-closing.
  looming: {
    king:  { pose:"anti_loom",  browKnit:.55, jaw:.08, eyeNarrow:.35, gaze:{x:-.2,y:.16}, t:.5 },
    queen: { pose:"queen_loom", browKnit:.5,  jaw:.06, eyeNarrow:.3,  gaze:{x:.2,y:.16}, t:.5 },
  },
};

/* ---- the domestic interior: a rough Laestrygonian hall drawn in FLAT grays
   behind the giants — heavy stone back wall in coarse blocks, a black doorway
   threshold the horde will pour through, a low hearth glow, a plank floor.
   Kept mid/light so the dark giants read hard against it. ---- */
function drawInterior(ctx, W, H){
  const wallTop = H*0.06, floorY = H*0.74;
  const wall="#c9c9c2", wallDeep="#b4b4ac", mortar="#9a9a92";
  const floor="#bdbdb5", floorDeep="#a6a69e";
  const dark="#2b2b26";
  ctx.save();
  ctx.lineJoin="round"; ctx.lineCap="round";
  // back wall
  ctx.fillStyle=wall; ctx.strokeStyle=INK; ctx.lineWidth=5;
  ctx.beginPath(); ctx.rect(0, wallTop, W, floorY-wallTop); ctx.fill(); ctx.stroke();
  // coarse stone courses — staggered blocks, mortar lines only (no fill spam)
  ctx.strokeStyle=mortar; ctx.lineWidth=3;
  const rows=5, rh=(floorY-wallTop)/rows;
  for(let r=0;r<rows;r++){
    const y=wallTop+r*rh;
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    const off=(r%2)?0:W*0.11;
    for(let x=off; x<W; x+=W*0.22){
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+rh); ctx.stroke();
    }
  }
  // a couple of blocks shaded deeper for tonal variety
  ctx.fillStyle=wallDeep;
  ctx.fillRect(W*0.06, wallTop+rh*1, W*0.22, rh);
  ctx.fillRect(W*0.55, wallTop+rh*3, W*0.22, rh);
  ctx.fillRect(W*0.30, wallTop+rh*4, W*0.22, rh);

  // black doorway / threshold on the right — where the cannibal horde floods in
  const dx=W*0.78, dw=W*0.20, dTop=wallTop+rh*0.4, dBot=floorY;
  ctx.fillStyle=dark; ctx.strokeStyle=INK; ctx.lineWidth=5;
  ctx.beginPath();
  ctx.moveTo(dx, dBot);
  ctx.lineTo(dx, dTop+rh*0.7);
  ctx.quadraticCurveTo(dx+dw*0.5, dTop, dx+dw, dTop+rh*0.7);
  ctx.lineTo(dx+dw, dBot);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // heavy lintel + jamb ink
  ctx.strokeStyle=INK; ctx.lineWidth=6;
  ctx.beginPath(); ctx.moveTo(dx, dBot); ctx.lineTo(dx, dTop+rh*0.7);
  ctx.quadraticCurveTo(dx+dw*0.5, dTop, dx+dw, dTop+rh*0.7);
  ctx.lineTo(dx+dw, dBot); ctx.stroke();

  // low hearth on the left — a stone bowl with a dark fire-pit mouth
  const hx=W*0.13, hy=floorY-H*0.02, hw=W*0.16, hh=H*0.05;
  ctx.fillStyle=wallDeep; ctx.strokeStyle=INK; ctx.lineWidth=5;
  ctx.beginPath(); ctx.ellipse(hx, hy, hw, hh, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle=dark;
  ctx.beginPath(); ctx.ellipse(hx, hy-hh*0.2, hw*0.6, hh*0.5, 0, 0, TAU); ctx.fill();

  // floor
  ctx.fillStyle=floor; ctx.strokeStyle=INK; ctx.lineWidth=5;
  ctx.beginPath(); ctx.rect(0, floorY, W, H-floorY); ctx.fill(); ctx.stroke();
  ctx.fillStyle=floorDeep; ctx.fillRect(0, floorY, W, H*0.012);
  // plank seams receding
  ctx.strokeStyle=mortar; ctx.lineWidth=2.5;
  for(let i=1;i<6;i++){ const x=W*i/6; ctx.beginPath(); ctx.moveTo(x,floorY); ctx.lineTo(W*0.5+(x-W*0.5)*1.6, H); ctx.stroke(); }
  ctx.restore();
}

/* draw one giant into a box centered at cx (normalized), full-height so both
   stand on the same interior floor. */
function drawGiant(ctx, W, H, fig, sub, cx, boxFrac){
  const boxW = W*boxFrac;
  ctx.save();
  ctx.translate(cx*W - boxW/2, 0);
  ctx.beginPath(); ctx.rect(-W*0.06, 0, boxW+W*0.12, H); ctx.clip();
  fig.draw(ctx, boxW, H, sub);
  ctx.restore();
}

export const asset = {
  id:"character.antiphates-and-queen",
  type:"CHARACTER",
  name:"Antiphates and queen",
  statusWord:"MONSTROUS",
  scene:"OD-B10-S02",

  params:{ king:kingParams, queen:queenParams, figures:2 },
  layers:["interior","shadow","hair-back","legs","torso","far-arm","neck",
          "head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors: each giant's head + gesturing hand, the shared
  // threshold the horde pours through, and the floor line.
  anchors:{
    kingHead:{x:.30,y:.20}, kingHand:{x:.46,y:.46},
    queenHead:{x:.68,y:.15}, queenHand:{x:.60,y:.14},
    threshold:{x:.88,y:.40}, hearth:{x:.13,y:.72}, feet:{x:.50,y:.90},
  },
  states:{
    initial:"initiating",
    nodes:{
      // the card — king points/seizes the order, queen flings up the summons
      initiating: { preview:{ variant:"initiating" } },
      // both squared to the hall, jaws unhinged, full alarm raised
      roaring:    { preview:{ variant:"roaring" } },
      // the loom before the eruption — heads lowered, watching the prey
      looming:    { preview:{ variant:"looming" } },
    },
    edges:[["looming","initiating"],["initiating","roaring"],
           ["roaring","initiating"]],
  },
  channels:["variant","pose","gaze","mouth","jaw","browUp","browKnit",
            "frown","eyeWide","eyeNarrow","blink"],

  // CARD SIGNATURE — MONSTROUS: two enormous brutes in their stone hall, the
  // bearded king lunging with a seizing arm and a torn-open roar, the
  // mountainous queen towering beside him with one great arm flung up
  // summoning the attack. Both brows crushed, both jaws wide.
  preview:()=>({ variant:"initiating", status:"MONSTROUS", progress:.3 }),

  draw(ctx, W, H, state){
    const s = state || {};
    const v = V[s.variant] || V.initiating;
    drawInterior(ctx, W, H);
    // queen first (bigger, set slightly back), then king in front-left
    drawGiant(ctx, W, H, queenFig, v.queen, 0.70, 0.58);
    drawGiant(ctx, W, H, kingFig,  v.king,  0.27, 0.58);
  },
};
export default asset;
