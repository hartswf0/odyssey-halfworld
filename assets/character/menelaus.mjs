/* character.menelaus — the wealthy, war-returned king of Sparta, whose hall
   glitters with Trojan spoils and whose every act of hospitality keeps opening
   a door onto grief. CHARACTER asset on the HALFTRACK hero rig: a mature, fair-
   haired (xanthos) Atreid — full beard, a rich robe and cloak, a golden circlet
   across his brow. The lavish host who cannot pour wine without weeping for the
   dead he left at Troy, and the man who once wrestled the shape-shifting Old Man
   of the Sea to wring the truth from him.

   Scene function:
     OD-B04-S01  wealthy war-returned king whose HOSPITALITY opens into GRIEF
     OD-B04-S02  host moving from MEMORY to RECOGNITION and shared grief
     OD-B04-S05  narrator enduring a prolonged SUPERNATURAL GRAPPLE (Proteus)
     OD-B04-S06  lavish HOST adapting his generosity to his guests

   EXPRESSIVENESS: the hero rig reads facial channels (browUp, browKnit, frown,
   eyeWide, eyeNarrow, jaw, mouthAsym) off the composed POSE. Menelaus's whole
   register — a welcoming gesture that shades mid-motion into sorrow, the buckle
   from memory into recognition, the clenched strain of the wrestling match — needs
   brow + gaze + arm authored TOGETHER. So (like nestor/halitherses) he ships
   bespoke poses into the shared POSE registry the hero figure reads, so the card
   and every state genuinely EMOTE. A golden circlet is drawn on top afterward. */
import { makeFigure } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Menelaus poses: brow + gaze + arm authored together ----
   Convention (mirrors nestor): armRUpper near -1.0 offers the right hand forward;
   positive gazeY + headPitch casts the eyes down into welling grief; negative
   casts them level/up. Menelaus's baseline is an open, hosting chest and a
   slight forward inclination toward a guest. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "menelaus", n, opt }; };

// THE CARD — WELCOMING: the signature the prompt asks for. The host gesture that
// shades into grief. Right hand offered out in open welcome, left hand turned
// up beside it — the whole body says "be seated, be at home" — but the FACE has
// already buckled: brows lifted high AND knit at the inner ends, a real frown
// pulling the mouth, eyes narrowed and glistening, gaze slid down and off. The
// wine is poured and the tears come with it.
P("menelaus_welcome_grief", {
  browUp:.54, browKnit:.44, frown:.52, eyeNarrow:.24, jaw:.14, mouthAsym:.10,
  headPitch:.08, headRoll:.05, neckPitch:.04,
  gazeX:-.16, gazeY:.20,                          // eyes cast down, welling
  spineLean:-.06, bodyYaw:-.08, headYaw:-.06, chestOpen:.38,
  armRUpper:-1.06, armRLower:.60, shoulderLiftR:.16,   // right hand offered in welcome
  armLUpper:.64, armLLower:-.36, shoulderLiftL:.12,    // left hand turned up beside it
}, { hands:["open_palm","offering"] });

// HOSTING — the lavish host adapting his generosity (OD-B04-S06): both arms
// thrown wide over a laden hall, chest opened, a warm and genuine smile, brows
// lifted in pleasure, gaze level and attentive on the guests. Pure xenia,
// before the grief surfaces.
P("menelaus_hosting", {
  smile:.44, browUp:.30, eyeWide:.10, jaw:.16,
  chestOpen:.92, spineLean:-.08, headPitch:-.05,
  bodyYaw:.05, headYaw:-.06, gazeX:-.12, gazeY:.04,    // level, on the guest
  armLUpper:1.12, armLLower:-.28, armRUpper:-1.12, armRLower:.28,
  shoulderLiftL:.30, shoulderLiftR:.30, rootY:-.02,
}, { hands:["open_palm","open_palm"] });

// RECOGNITION — memory tipping into recognition and shared grief (OD-B04-S02):
// the host falters, one hand rising toward his own chest/face as the name lands,
// head bowed, brows lifted AND knit hard, frown deep, jaw parted on a caught
// breath, eyes down and brimming. The moment a guest is known and the loss is
// shared aloud.
P("menelaus_recognition", {
  browUp:.60, browKnit:.52, frown:.56, eyeNarrow:.30, jaw:.30, mouthAsym:.12,
  headPitch:.28, neckPitch:.16, headRoll:.07,
  gazeX:.18, gazeY:.42,                            // eyes down, welling over
  spineLean:.08, bodyYaw:-.06, headYaw:.08, chestOpen:.10,
  armRUpper:-.68, armRLower:1.18, shoulderLiftR:.22,   // hand rising to the heart
  armLUpper:.42, armLLower:-.52,
}, { hands:["relaxed","offering"] });

// GRAPPLE — enduring the prolonged supernatural wrestling match with Proteus,
// the Old Man of the Sea (OD-B04-S05): braced and crouched, both fists clenched
// forward gripping a thing that keeps changing shape, chest set, shoulders
// hauled up with effort, brows knit into a hard bar, eyes narrowed, jaw wrenched
// open on the strain. He will not let go.
P("menelaus_grapple", {
  browKnit:.88, browUp:.18, eyeNarrow:.55, frown:.50, jaw:.52, mouthAsym:.06,
  headPitch:.14, headRoll:-.06, neckPitch:.06,
  gazeX:-.22, gazeY:.06,
  spineLean:-.34, bodyYaw:-.10, chestOpen:.42, crouch:.36, kneeL:.44, kneeR:.44,
  hipL:-.10, hipR:.14,
  armLUpper:.92, armLLower:-1.16, armRUpper:-.92, armRLower:1.16,   // both fists hauled in
  shoulderLiftL:.42, shoulderLiftR:.42, rootScale:1.06,
}, { hands:["fist","fist"] });

// GRIEF — the still, private version of the sorrow: arms lowered, head bowed,
// gaze fallen to the floor, brows lifted and knit, the mouth drawn down. Used as
// the resting low point the host keeps returning to.
P("menelaus_grief", {
  browUp:.56, browKnit:.54, frown:.60, eyeNarrow:.20, jaw:.06,
  headPitch:.42, headY:.12, neckPitch:.18, headRoll:.03,
  gazeX:.02, gazeY:.50,
  spineLean:.12, bodyYaw:-.04, headYaw:.04,
  armRUpper:.44, armRLower:1.28, armLUpper:.18, armLLower:-.20,
}, { hands:["relaxed","relaxed"] });

const params = {
  // mature Atreid king: warm weathered skin; a fair, tawny-auburn mane + full
  // beard (Homer's xanthos Menelaos — light enough to read "fair" beside the
  // dark-bearded younger men, dark enough to carry real halftone mass). Rich
  // robe + cloak of a wealthy war-returned king; shod, not bare-legged.
  skin:"#d3bd9c", hairColor:"#7a5636",
  hair:"curly", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.14,
};

const fig = makeFigure(params);

/* golden circlet: a low crown resting across the brow, drawn AFTER the figure in
   solid grays + hard contour so the engine POST pass halftones it with the rest.
   Anchored to the reported head/crown positions so it tracks head scale. Gold
   reads as a bright mid-gray band with a hard ink edge and a darker central gem. */
function drawCirclet(ctx, W, H, out){
  try {
    const a = out && out.anchors; if(!a || !a.head || !a.crown) return;
    const hx = a.head.x * W, hy = a.head.y * H;
    const cy = a.crown.y * H;
    const Rv = Math.max(8, hy - cy);            // vertical head radius in px
    const Rw = Rv * 0.90;                         // horizontal half-width of the band
    const browY = hy - Rv * 0.50;                 // sits across the upper forehead
    const bandH = Rv * 0.22;
    // gold reads as a bright mid-gray band whose HARD ink contour + dark gem +
    // triangular points breaking the hairline are what make it read as a crown.
    const gold = "#8f8b80", goldDeep = "#5c5951", gem = "#2c2c28";
    const dip = Rv * 0.16;                         // band bows down at center-front
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
    ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(2.5, Rv*0.075); ctx.stroke();
    // triangular points rising off the band into the hairline — the crown silhouette
    const peaks = [-0.66,-0.33,0,0.33,0.66];
    for(const f of peaks){
      const px = hx + f*Rw;
      const topY = browY - bandH/2 + dip*(1-f*f) - Rv*(f===0?0.30:0.20);
      const baseY = browY - bandH/2 + dip*(1-f*f) + Rv*0.02;
      ctx.beginPath();
      ctx.moveTo(px - Rw*0.10, baseY);
      ctx.lineTo(px, topY);
      ctx.lineTo(px + Rw*0.10, baseY);
      ctx.closePath();
      ctx.fillStyle = gold; ctx.fill();
      ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(1.5, Rv*0.045); ctx.stroke();
      // dark point-tip stud
      ctx.beginPath(); ctx.arc(px, topY, Math.max(1.5, Rv*0.05), 0, Math.PI*2);
      ctx.fillStyle = gem; ctx.fill();
    }
    // lower rim shadow line
    ctx.strokeStyle = goldDeep; ctx.lineWidth = Math.max(1.5, Rv*0.04);
    ctx.beginPath();
    ctx.moveTo(hx+Rw, browY+bandH/2);
    ctx.quadraticCurveTo(hx, browY+bandH/2+dip, hx-Rw, browY+bandH/2);
    ctx.stroke();
    // central gem — a diamond at the brow's midpoint
    const gy = browY + dip*0.7;
    ctx.beginPath();
    ctx.moveTo(hx, gy-bandH*0.66); ctx.lineTo(hx+bandH*0.55, gy);
    ctx.lineTo(hx, gy+bandH*0.66); ctx.lineTo(hx-bandH*0.55, gy); ctx.closePath();
    ctx.fillStyle = gem; ctx.fill();
    ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(1.5, Rv*0.04); ctx.stroke();
    ctx.restore();
  } catch(e){ /* circlet is decorative; never block the figure render */ }
}

export const asset = {
  id:"character.menelaus",
  type:"CHARACTER",
  name:"Menelaus",
  statusWord:"WELCOMING",
  scene:"OD-B04-S01",

  params,
  layers:["shadow","hair-back","legs","robe","torso","cloak","far-arm","neck",
          "head","face","hair-front","beard","circlet","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, circlet:{x:.50,y:.15}, eyes:{x:.50,y:.20},
    rightHand:{x:.68,y:.50}, leftHand:{x:.34,y:.52},
    cupGrip:{x:.68,y:.48}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
    guest:{x:.16,y:.58}, hall:{x:.84,y:.30},
  },
  states:{
    initial:"welcoming",
    nodes:{
      // THE beat / signature — the welcome that opens into grief
      welcoming:  { preview:{ pose:"menelaus_welcome_grief", gaze:{x:-.16,y:.20}, status:"WELCOMING" } },
      // OD-B04-S06 — the lavish host in full generous flow
      hosting:    { preview:{ pose:"menelaus_hosting", gaze:{x:-.12,y:.04}, status:"HOSTING" } },
      // OD-B04-S02 — memory tipping into recognition and shared grief
      recognition:{ preview:{ pose:"menelaus_recognition", gaze:{x:.18,y:.42}, status:"RECOGNIZING" } },
      // OD-B04-S05 — the prolonged supernatural grapple with Proteus
      grappling:  { preview:{ pose:"menelaus_grapple", gaze:{x:-.22,y:.06}, status:"GRAPPLING" } },
      // the private low point the host keeps returning to
      grieving:   { preview:{ pose:"menelaus_grief", gaze:{x:.02,y:.50}, status:"GRIEVING" } },
      // stable identity turns
      profile:    { preview:{ pose:"profile_left" } },
    },
    edges:[
      ["welcoming","hosting"],["hosting","welcoming"],
      ["welcoming","recognition"],["recognition","grieving"],
      ["grieving","welcoming"],["welcoming","grappling"],
      ["grappling","welcoming"],["welcoming","profile"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // EXPRESSIVE signature — WELCOMING: a rich, bearded, circlet-crowned king with
  // both hands open in host's welcome, whose face has already shaded into sorrow —
  // brows lifted and knit, a real frown, eyes narrowed and cast down. Hospitality
  // opening onto grief in a single gesture. No `mouth` overlay so the pose's
  // authored grief can't be flattened.
  preview:()=>({ pose:"menelaus_welcome_grief", gaze:{x:-.16,y:.20}, t:0.42,
                 status:"WELCOMING", progress:.24 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    const out = fig.draw(ctx, W, H, state);
    drawCirclet(ctx, W, H, out);
    return out;
  },
};
export default asset;
