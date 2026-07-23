/* character.aeolus — the genial wind-keeper king of the floating isle of Aeolia,
   who binds the storm-winds in an ox-hide bag and gives them to a guest, then, when
   that guest is blown back to his door a second time, recoils in horror and turns
   him away as a man the gods must hate. CHARACTER asset on the HALFTRACK hero rig:
   a mature, full-bearded king in a rich robe + cloak, set apart from the other
   host-kings (Alcinous/Menelaus/Nestor) not by a crown but by a low WIND-AND-CLOUD
   CIRCLET — a band ringed with curling gust-spirals and a little cloud puff.

   Scene function:
     OD-B10-S01  the generous wind-keeper — open-handed, handing over the bag of
                 winds — becoming HORRIFIED and ABSOLUTE when the failed guests
                 return: recoil, a warding hand, a final refusal.

   EXPRESSIVENESS: the hero rig reads facial channels (browUp, browKnit, frown,
   eyeWide, eyeNarrow, jaw, mouthAsym) off the composed POSE. Aeolus's arc — the
   warm two-handed GIVING of the bag, then the flinch back with one hand flung up
   to WARD the returning stranger off, then the hard flat FINALITY of his refusal —
   needs brow + gaze + arm authored TOGETHER. So (like alcinous/nestor) he ships
   bespoke poses into the shared POSE registry the hero figure reads, so the card
   and every state genuinely EMOTE. The circlet is drawn on top in solid grays +
   hard contour so the engine POST pass halftones it with the rest of the figure. */
import { makeFigure } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Aeolus poses: brow + gaze + arm authored together ----
   Convention (mirrors alcinous): armRUpper near -1.0 offers the right hand
   forward/down; near -1.9 flings it UP as a warding stop; armRLower positive
   swings the forearm out/up. His baseline is an open, inclining, magnanimous
   host — until the guests return, when the whole body recoils. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "aeolus", n, opt }; };

// THE CARD — GENEROUS: the signature the prompt asks for. The great host-gesture
// of GIVING — both hands reached out and forward, offering the ox-hide bag of winds
// to his departing guest, the body inclined toward him, chest thrown open. The FACE
// is pure genial welcome: brows lifted soft and even, a warm unforced smile, eyes
// gone kind and level on the man he is sending home. Open-handed abundance.
P("aeolus_giving", {
  smile:.42, browUp:.44, browKnit:.02, eyeWide:.08, jaw:.12, mouthAsym:.04,
  headPitch:.04, neckPitch:.03, headRoll:.03,
  gazeX:.16, gazeY:.06,                              // warm, level, on the guest he gifts
  spineLean:-.18, bodyYaw:.06, headYaw:.05, chestOpen:.44,
  armLUpper:1.02, armLLower:-.30, shoulderLiftL:.10,   // left hand offered forward/out
  armRUpper:-1.02, armRLower:.34, shoulderLiftR:.10,   // right hand offered forward/out
}, { hands:["offering","offering"] });

// WELCOMING — the gracious resting register: the genial wind-keeper hosting a
// stranger, one open palm turned up in easy hospitality, brows lifted soft, a
// faint warm smile, gaze level and kind. The baseline before the gift.
P("aeolus_welcoming", {
  smile:.26, browUp:.34, browKnit:.03, eyeWide:.05, jaw:.10,
  headPitch:-.02, neckPitch:-.01, headRoll:.02,
  gazeX:-.10, gazeY:.02,
  spineLean:-.08, bodyYaw:-.05, headYaw:-.05, chestOpen:.30,
  armRUpper:-1.00, armRLower:.64, shoulderLiftR:.14,   // open palm-up, welcoming
  armLUpper:.16, armLLower:-.12,
}, { hands:["relaxed","palm_up"] });

// HORRIFIED — the turn of OD-B10-S01: the guest he sent home rich has been blown
// back to his door. The king RECOILS — draws back off his heels, one hand flung UP
// to ward the returning stranger off, brows flung high, eyes wide, jaw dropped on a
// held breath of dread. Generosity curdling into superstitious horror.
P("aeolus_horrified", {
  browUp:.82, browKnit:.14, eyeWide:.70, jaw:.42, frown:.24, mouthAsym:.08,
  headPitch:.02, neckPitch:.01, headRoll:-.05,
  gazeX:.14, gazeY:.10,                              // fixed on the man at his door
  spineLean:.30, bodyYaw:.14, headYaw:-.06, rootScale:.98, rootY:-.02,
  armRUpper:-1.92, armRLower:.52, shoulderLiftR:.54,   // right hand flung UP, warding
  armLUpper:-.22, armLLower:-.46,                       // left arm pulled in, drawing back
}, { hands:["relaxed","stop"] });

// REFUSING — the last beat of OD-B10-S01: recovered from the flinch, the king is
// ABSOLUTE. Both hands push the stranger away, brows knit hard and low, mouth set in
// a flat frown, eyes narrowed — begone; the gods hate you, and I will not help a man
// they hate. Final, unmovable. The hardest register in his arc.
P("aeolus_refusing", {
  browKnit:.74, browUp:.06, eyeNarrow:.34, frown:.54, jaw:.16, mouthAsym:.05,
  headPitch:-.05, neckPitch:-.02, headRoll:.03,
  gazeX:.18, gazeY:-.02,                             // hard, level, on the man he casts out
  spineLean:-.06, bodyYaw:.05, headYaw:.05, rootScale:1.03,
  armLUpper:1.18, armLLower:.78, shoulderLiftL:.28,    // both hands thrust out, pushing away
  armRUpper:-1.18, armRLower:-.78, shoulderLiftR:.28,
}, { hands:["stop","stop"] });

const params = {
  // mature wind-keeper king: warm weathered skin; an iron grey-brown mane + full
  // beard (grizzled — lighter than Alcinous's near-black, darker than Nestor's
  // white, so he reads as his own man). Rich robe + cloak of a wealthy island
  // king; shod, not bare-legged. A touch larger in scale — an imposing host.
  skin:"#cdb89a", hairColor:"#4c463b",
  hair:"curly", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.10,
};

const fig = makeFigure(params);

/* ---- WIND-AND-CLOUD CIRCLET: what sets Aeolus apart from the other host-kings.
   NOT a tall crown (Alcinous) or a plain brow-circlet (Menelaus): a low band that
   rides across the forehead, ringed with bold curling GUST-SPIRALS and crowned at
   center by a little CLOUD PUFF. Drawn AFTER the figure in solid grays + hard
   contour so the engine POST pass halftones it with the rest. Anchored to the
   reported head/crown positions so it tracks head scale and turn. All strokes are
   deliberately chunky so the wind curls survive the dot pass. ---- */
function drawWindCirclet(ctx, W, H, out){
  try {
    const a = out && out.anchors; if(!a || !a.head || !a.crown) return;
    const hx = a.head.x * W, hy = a.head.y * H;
    const cy = a.crown.y * H;
    const Rv = Math.max(8, hy - cy);              // vertical head radius in px
    const Rw = Rv * 0.90;                          // horizontal half-width of the band
    const browY = hy - Rv * 0.56;                  // rides LOW across the forehead
    const bandH = Rv * 0.17;
    const gold = "#8f8b80", goldDeep = "#5c5951", cloud = "#c4c2ba", gem = "#2c2c28";
    const dip = Rv * 0.12;                          // band bows down at center-front
    ctx.save();
    ctx.lineJoin="round"; ctx.lineCap="round";

    // filled band — a shallow downward-bowed arc across the forehead
    ctx.beginPath();
    ctx.moveTo(hx-Rw, browY-bandH/2);
    ctx.quadraticCurveTo(hx, browY-bandH/2+dip, hx+Rw, browY-bandH/2);
    ctx.lineTo(hx+Rw, browY+bandH/2);
    ctx.quadraticCurveTo(hx, browY+bandH/2+dip, hx-Rw, browY+bandH/2);
    ctx.closePath();
    ctx.fillStyle = gold; ctx.fill();
    ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(2.5, Rv*0.075); ctx.stroke();

    // ---- WIND-GUST SPIRALS rising off the band, two per side, curling OUTWARD.
    // Each is a bold stroked comma that sweeps up off the band and rolls into a
    // little spiral eye — the heraldic sign of a gust of wind. Chunky so it holds
    // under the halftone. ---- */
    const curl = (bx, sign) => {
      const baseY = browY - bandH*0.4 + dip*0.5;
      const r = Rv*0.135;                           // radius of the spiral eye
      const ex = bx + sign*r*1.2, eyY = baseY - Rv*0.24;   // eye sits low, just above the band
      ctx.strokeStyle="#141414"; ctx.lineWidth=Math.max(3, Rv*0.09); ctx.lineCap="round";
      // a horizontal wind-tail streaming OUT off the band, then rolling into the eye
      ctx.beginPath();
      ctx.moveTo(bx - sign*r*1.5, baseY - Rv*0.02);
      ctx.quadraticCurveTo(bx + sign*r*0.1, baseY - Rv*0.20, ex - sign*r, eyY + r*0.2);
      // the spiral: roughly one and a quarter turns inward
      ctx.arc(ex, eyY, r, sign>0?Math.PI:0, sign>0?(Math.PI*2.15):(Math.PI*1.15), sign<0);
      ctx.stroke();
      // gust-fill: a lighter core so the eye reads as a bright swirl, not a blob
      ctx.beginPath(); ctx.arc(ex, eyY, r*0.42, 0, Math.PI*2);
      ctx.fillStyle=gold; ctx.fill();
      ctx.strokeStyle="#141414"; ctx.lineWidth=Math.max(1.5, Rv*0.03); ctx.stroke();
    };
    curl(hx - Rw*0.50, -1);
    curl(hx - Rw*0.18, -1);
    curl(hx + Rw*0.18,  1);
    curl(hx + Rw*0.50,  1);

    // ---- CENTRAL CLOUD PUFF: three overlapping bumps crowning the band front,
    // the still eye of the storm he keeps. Light-toned so it halftones pale. ----
    const clx = hx, clBase = browY - bandH/2 + dip;
    const puffs = [[-Rv*0.20, -Rv*0.10, Rv*0.17],
                   [ Rv*0.00, -Rv*0.24, Rv*0.21],
                   [ Rv*0.22, -Rv*0.09, Rv*0.16]];
    ctx.fillStyle=cloud; ctx.strokeStyle="#141414"; ctx.lineWidth=Math.max(2, Rv*0.055);
    ctx.beginPath();
    for(const [dx,dy,pr] of puffs){ ctx.moveTo(clx+dx+pr, clBase+dy); ctx.arc(clx+dx, clBase+dy, pr, 0, Math.PI*2); }
    ctx.fill(); ctx.stroke();

    // lower rim shadow line of the band
    ctx.strokeStyle = goldDeep; ctx.lineWidth = Math.max(1.5, Rv*0.045);
    ctx.beginPath();
    ctx.moveTo(hx+Rw, browY+bandH/2);
    ctx.quadraticCurveTo(hx, browY+bandH/2+dip, hx-Rw, browY+bandH/2);
    ctx.stroke();

    // small dark gem centred low on the band, under the cloud
    const gy = browY + dip*0.55;
    ctx.beginPath(); ctx.arc(hx, gy, Math.max(2, bandH*0.42), 0, Math.PI*2);
    ctx.fillStyle=gem; ctx.fill();
    ctx.strokeStyle="#141414"; ctx.lineWidth=Math.max(1.5, Rv*0.04); ctx.stroke();

    ctx.restore();
  } catch(e){ /* circlet is decorative; never block the figure render */ }
}

export const asset = {
  id:"character.aeolus",
  type:"CHARACTER",
  name:"Aeolus",
  statusWord:"GENEROUS",
  scene:"OD-B10-S01",

  params,
  layers:["shadow","hair-back","legs","robe","torso","cloak",
          "far-arm","neck","head","face","hair-front","beard","circlet","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.68,y:.52}, leftHand:{x:.32,y:.52},
    windBagGrip:{x:.50,y:.54}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
    guest:{x:.86,y:.80}, doorway:{x:.86,y:.40},
  },
  states:{
    initial:"generous",
    nodes:{
      // THE beat / signature — the two-handed giving of the bag of winds
      generous:  { preview:{ pose:"aeolus_giving",    gaze:{x:.16,y:.06}, status:"GENEROUS" } },
      // the gracious resting host register
      welcoming: { preview:{ pose:"aeolus_welcoming", gaze:{x:-.10,y:.02}, status:"WELCOMING" } },
      // OD-B10-S01 turn — recoiling in horror as the failed guests return
      horrified: { preview:{ pose:"aeolus_horrified", gaze:{x:.14,y:.10}, status:"HORRIFIED" } },
      // OD-B10-S01 close — the absolute, final refusal
      refusing:  { preview:{ pose:"aeolus_refusing",  gaze:{x:.18,y:-.02}, status:"ABSOLUTE" } },
      // stable identity turn
      profile:   { preview:{ pose:"profile_left" } },
    },
    edges:[
      ["welcoming","generous"],["generous","welcoming"],
      ["generous","horrified"],["horrified","refusing"],
      ["refusing","welcoming"],["generous","profile"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // EXPRESSIVE signature — GENEROUS: a mature, full-bearded wind-keeper king in a
  // low WIND-AND-CLOUD circlet, both hands reached out and forward to GIVE the bag
  // of winds to his departing guest, body inclined toward him, chest thrown open.
  // The face is pure genial welcome — brows lifted soft, a warm smile, kind level
  // eyes. No `mouth` overlay, so the pose's authored warmth can't be flattened.
  preview:()=>({ pose:"aeolus_giving", gaze:{x:.16,y:.06}, t:0.42,
                 status:"GENEROUS", progress:.22 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    const out = fig.draw(ctx, W, H, state);
    drawWindCirclet(ctx, W, H, out);
    return out;
  },
};
export default asset;
