/* character.laodamas — the courteous young Phaeacian prince, Alcinous's son.
   CHARACTER asset on the HALFTRACK hero rig. Where Euryalus is the sharp, well-
   built athlete who taunts the stranger, Laodamas is the gracious one: the son
   who INVITES the guest into the games and, when the taunt sours the hall, helps
   set it right. He reads as a young prince by FINER DRESS (a rich robe + a
   fastened cloak, shod not bare-legged, a slim brow-fillet of a prince) and by an
   OPEN, inviting bearing — beardless, bright-faced, chest turned out, a hand
   perpetually offered forward.

   Scene function:
     OD-B08-S03  the courteous prince inviting the stranger to take part in the
                 games, and later supporting the reconciliation after Euryalus's
                 taunt.

   EXPRESSIVENESS: the hero rig reads facial channels (smile, browUp, browKnit,
   eyeWide, eyeNarrow, jaw, mouthAsym, gaze) off the composed POSE. Laodamas's
   register — warm invitation, a hosting sweep, an earnest conciliatory reach —
   needs brow + gaze + arm authored TOGETHER, so (like alcinous/pisistratus) he
   ships bespoke poses into the shared POSE registry the hero figure reads. A slim
   princely fillet is drawn on top afterward in solid grays + hard contour so the
   engine POST pass halftones it with the rest of the figure. */
import { makeFigure } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Laodamas poses: brow + gaze + arm authored together ----
   Convention: armRUpper near -1.0 offers the right hand forward/up in welcome;
   a small +gazeY and open chest keep the bearing warm and inclined toward the
   guest rather than commanding. The left arm rests easy at his side. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "laodamas", n, opt }; };

// THE CARD — COURTEOUS: the signature. The prince turns his open right hand out
// and slightly up in INVITATION — "come, take part" — chest turned open toward
// the stranger, body inclined a touch forward, weight light. The face is warm and
// gracious: brows lifted soft and even, an unforced welcoming smile, eyes bright
// and level on the guest he is drawing in. Youthful open hospitality.
P("laodamas_inviting", {
  smile:.40, browUp:.40, browKnit:.03, eyeWide:.12, jaw:.12, mouthAsym:.04,
  headPitch:-.03, neckPitch:-.01, headRoll:.03,
  gazeX:-.14, gazeY:.04,                              // warm, level, on the guest
  spineLean:-.14, bodyYaw:-.10, headYaw:-.08, chestOpen:.46,
  armRUpper:-1.02, armRLower:.58, shoulderLiftR:.18,  // right hand offered out and up
  armLUpper:.16, armLLower:-.12,                       // left arm rests easy
}, { hands:["relaxed","offering"] });

// HOSTING — the fuller welcome: both arms sweeping open over the field, chest
// thrown wide, a broad genuine smile and lifted brows, gaze bright on the hall.
// The generous "join us" of a young prince opening the games to a stranger.
P("laodamas_hosting", {
  smile:.58, browUp:.44, eyeWide:.20, jaw:.16, browKnit:.02,
  chestOpen:.92, spineLean:-.10, headPitch:-.04,
  bodyYaw:.04, headYaw:-.05, gazeX:-.10, gazeY:.02,
  armLUpper:1.18, armLLower:-.24, armRUpper:-1.18, armRLower:.24,
  shoulderLiftL:.30, shoulderLiftR:.30, rootY:-.02,
}, { hands:["open_palm","open_palm"] });

// SPEAKING — mid-courtesy, addressing the stranger: chin level, brows a touch up,
// jaw dropped on a vowel, an open persuasive right hand at mid-height. The easy
// eloquence of a well-bred host paying his guest a compliment.
P("laodamas_speaking", {
  smile:.24, browUp:.30, eyeWide:.08, jaw:.42, mouthAsym:.05,
  headPitch:-.02, neckPitch:-.01, headYaw:-.05,
  gazeX:.12, gazeY:-.02,
  spineLean:-.06, bodyYaw:-.04, chestOpen:.40,
  armRUpper:-1.36, armRLower:.50, shoulderLiftR:.24,
  armLUpper:.16, armLLower:-.14,
}, { hands:["relaxed","open_palm"] });

// RECONCILING — the second beat of OD-B08-S03: Euryalus's taunt has stung the
// guest, and Laodamas leans in to mend it. An earnest, conciliatory reach — palm
// turned up and forward, body inclined, brows lifted AND faintly knit with
// concern, a soft placating half-smile, eyes gentle and low on the offended man.
P("laodamas_reconciling", {
  smile:.16, browUp:.46, browKnit:.20, eyeWide:.06, jaw:.14, frown:.04,
  headPitch:.14, neckPitch:.06, headRoll:.04,
  gazeX:-.12, gazeY:.24,                              // gaze softened, down toward the guest
  spineLean:-.22, bodyYaw:-.08, headYaw:-.06, chestOpen:.34,
  armRUpper:-0.94, armRLower:.70, shoulderLiftR:.14,  // palm up and forward, placating
  armLUpper:.20, armLLower:-.16, rootScale:.99,
}, { hands:["relaxed","palm_up"] });

const params = {
  // young Phaeacian prince: fair sea-people skin, dark neat hair, BEARDLESS
  // (young). A rich robe + fastened cloak mark him finer than the athlete
  // Euryalus; shod, not bare-legged, as a court prince. Ordinary princely scale.
  skin:"#d7c3a2", hairColor:"#2b241c",
  hair:"short", beard:false, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.02,
};

const fig = makeFigure(params);

/* ---- FILLET: a slim princely brow-band, much lower and plainer than a king's
   crown — a single fine circlet across the forehead marking rank without pomp.
   Drawn AFTER the figure in solid grays + hard contour so the POST pass halftones
   it with the rest. Anchored to the reported head/crown positions so it tracks
   head scale and turn. ---- */
function drawFillet(ctx, W, H, out){
  try {
    const a = out && out.anchors; if(!a || !a.head || !a.crown) return;
    const hx = a.head.x * W, hy = a.head.y * H;
    const cy = a.crown.y * H;
    const Rv = Math.max(8, hy - cy);              // vertical head radius in px
    const Rw = Rv * 0.80;                          // horizontal half-width
    const browY = hy - Rv * 0.52;                  // rides across the forehead
    const bandH = Rv * 0.13;
    const gold = "#8f8b80", goldDeep = "#5c5951", gem = "#2c2c28";
    const dip = Rv * 0.10;
    ctx.save();
    ctx.lineJoin="round"; ctx.lineCap="round";
    // filled band — a shallow downward-bowed arc across the brow
    ctx.beginPath();
    ctx.moveTo(hx-Rw, browY-bandH/2);
    ctx.quadraticCurveTo(hx, browY-bandH/2+dip, hx+Rw, browY-bandH/2);
    ctx.lineTo(hx+Rw, browY+bandH/2);
    ctx.quadraticCurveTo(hx, browY+bandH/2+dip, hx-Rw, browY+bandH/2);
    ctx.closePath();
    ctx.fillStyle = gold; ctx.fill();
    ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(2, Rv*0.06); ctx.stroke();
    // lower rim shadow line
    ctx.strokeStyle = goldDeep; ctx.lineWidth = Math.max(1.2, Rv*0.035);
    ctx.beginPath();
    ctx.moveTo(hx+Rw, browY+bandH/2);
    ctx.quadraticCurveTo(hx, browY+bandH/2+dip, hx-Rw, browY+bandH/2);
    ctx.stroke();
    // a single small centre stud — the one modest jewel of a prince's fillet
    const gy = browY + dip*0.6;
    ctx.beginPath(); ctx.arc(hx, gy, Math.max(1.8, Rv*0.06), 0, Math.PI*2);
    ctx.fillStyle = gem; ctx.fill();
    ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(1, Rv*0.025); ctx.stroke();
    ctx.restore();
  } catch(e){ /* fillet is decorative; never block the figure render */ }
}

export const asset = {
  id:"character.laodamas",
  type:"CHARACTER",
  name:"Laodamas",
  statusWord:"COURTEOUS",
  scene:"OD-B08-S03",

  params,
  layers:["shadow","hair-back","legs","robe","torso","cloak",
          "far-arm","neck","head","face","hair-front","fillet","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.21},
    rightHand:{x:.68,y:.55}, leftHand:{x:.34,y:.60},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
    guest:{x:.16,y:.72}, field:{x:.84,y:.30}, euryalus:{x:.82,y:.66},
  },
  states:{
    initial:"courteous",
    nodes:{
      // THE beat / signature — inviting the stranger into the games
      courteous:  { preview:{ pose:"laodamas_inviting", gaze:{x:-.14,y:.04}, status:"COURTEOUS" } },
      // the fuller welcome — arms swept open over the field
      hosting:    { preview:{ pose:"laodamas_hosting", gaze:{x:-.10,y:.02}, status:"WELCOMING" } },
      // paying the guest a courteous compliment mid-word
      speaking:   { preview:{ pose:"laodamas_speaking", gaze:{x:.12,y:-.02}, status:"SPEAKING" } },
      // OD-B08-S03b — mending the hall after Euryalus's taunt
      reconciling:{ preview:{ pose:"laodamas_reconciling", gaze:{x:-.12,y:.24}, status:"MENDING" } },
      // a courteous inclined nod of greeting
      bowing:     { preview:{ pose:"head_lowered", smile:.22, browUp:.24,
                              gaze:{x:0,y:.28}, status:"GRACIOUS" } },
      // stable identity turn
      profile:    { preview:{ pose:"profile_left" } },
    },
    edges:[
      ["courteous","hosting"],["hosting","courteous"],
      ["courteous","speaking"],["speaking","courteous"],
      ["courteous","reconciling"],["reconciling","courteous"],
      ["courteous","bowing"],["bowing","courteous"],["courteous","profile"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // EXPRESSIVE signature — COURTEOUS: a beardless young prince in a fine robe +
  // cloak and a slim brow-fillet, his open right hand offered out and up in
  // INVITATION, chest turned open, body inclined toward the guest. The face is
  // warm graciousness — brows lifted soft, a welcoming smile, bright level eyes.
  // No `mouth` overlay so the pose's authored warmth can't be flattened.
  preview:()=>({ pose:"laodamas_inviting", gaze:{x:-.14,y:.04}, t:0.45,
                 status:"COURTEOUS", progress:.22 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    const out = fig.draw(ctx, W, H, state);
    drawFillet(ctx, W, H, out);
    return out;
  },
};
export default asset;
