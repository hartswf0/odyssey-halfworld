/* character.alcinous — the generous king of the Phaeacians, host of Scheria,
   whose open hall and magic ships carry the stranger home. CHARACTER asset on
   the HALFTRACK hero rig: a mature, dark-bearded king in a rich robe + cloak,
   set apart from the other host-kings (Menelaus/Nestor) by a tall CROWN and a
   royal SCEPTRE planted at his side. His register is magnanimity — the man who
   lifts a suppliant out of the ashes, restores the broken ritual, promises a
   ship, and then, admiring his guest, offers him a daughter and a kingdom.

   Scene function:
     OD-B07-S03  host king initially STUNNED by the suppliant, then restoring
                 ritual order and PROMISING transport
     OD-B07-S04  admiring host expanding HOSPITALITY into a marriage offer

   EXPRESSIVENESS: the hero rig reads facial channels (browUp, browKnit, frown,
   eyeWide, eyeNarrow, jaw, mouthAsym) off the composed POSE. Alcinous's arc —
   the raised-brow shock of a stranger at the hearth, the settling into level
   royal authority as he re-orders the rite and pledges a ship, the broad warm
   sweep of the marriage offer — needs brow + gaze + arm authored TOGETHER. So
   (like nestor/menelaus) he ships bespoke poses into the shared POSE registry
   the hero figure reads, so the card and every state genuinely EMOTE. A tall
   crown and a sceptre are drawn on top afterward in solid grays + hard contour
   so the engine POST pass halftones them with the rest of the figure. */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Alcinous poses: brow + gaze + arm authored together ----
   Convention (mirrors menelaus/nestor): armRUpper near -1.2 offers the right
   hand forward/down; positive gazeY + headPitch casts the eyes DOWN toward the
   suppliant at the hearth; negative casts them level/up for royal address. The
   left arm rests low at his side (armLUpper small +) alongside the planted
   sceptre. His baseline is an open, inclining, magnanimous chest. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "alcinous", n, opt }; };

// THE CARD — GENEROUS: the signature the prompt asks for. The great host-gesture
// of RAISING THE SUPPLIANT — the right hand reached out and DOWN to lift a kneeling
// stranger up out of the ashes of the hearth, the body inclined toward him, chest
// opened. The FACE is pure genial magnanimity: brows lifted soft and even, a warm
// unforced smile, eyes gone kind and cast down to the man he is lifting. Royal
// welcome without a trace of suspicion.
P("alcinous_raising", {
  smile:.36, browUp:.42, browKnit:.04, eyeWide:.06, jaw:.10, mouthAsym:.05,
  headPitch:.16, neckPitch:.07, headRoll:.03,
  gazeX:-.16, gazeY:.32,                            // eyes down, on the suppliant he lifts
  spineLean:-.16, bodyYaw:-.06, headYaw:-.07, chestOpen:.32,
  armRUpper:-0.90, armRLower:.30, shoulderLiftR:.10,   // right hand reached out and DOWN to raise him
  armLUpper:.14, armLLower:-.10,                        // left arm rests low by the sceptre
}, { hands:["relaxed","offering"] });

// STUNNED — the first beat of OD-B07-S03: a stranger has appeared at the queen's
// knees and the hall has fallen silent. The king is caught mid-astonishment —
// drawn back a little, brows flung high, eyes wide, jaw parted on a held breath,
// one hand lifted in startled arrest. The magnanimity is there but not yet moving.
P("alcinous_stunned", {
  browUp:.70, browKnit:.10, eyeWide:.58, jaw:.30, frown:.06,
  headPitch:.06, headRoll:.04, neckPitch:.02,
  gazeX:-.12, gazeY:.18,                            // fixed on the suppliant at the hearth
  spineLean:.20, bodyYaw:-.06, headYaw:-.05, rootScale:.99,
  armRUpper:-.72, armRLower:.44, shoulderLiftR:.32,   // hand half-raised, arrested
  armLUpper:.16, armLLower:-.12,
}, { hands:["relaxed","open_palm"] });

// RESTORING — the second beat of OD-B07-S03: the king recovers, re-orders the
// broken rite (raise the guest, pour the libation) and PROMISES transport home.
// Level royal authority now — chin lifted, brows settled, a measured commanding
// gesture of the right hand mid-height, mouth open on the pledge. Steady, certain.
P("alcinous_restoring", {
  browUp:.24, browKnit:.14, eyeNarrow:.10, jaw:.36, frown:0, mouthAsym:.04,
  headPitch:-.06, neckPitch:-.03, headRoll:-.03,
  gazeX:.16, gazeY:-.04,                            // level, addressing the hall
  spineLean:-.06, bodyYaw:.04, headYaw:.06, chestOpen:.32,
  armRUpper:-1.60, armRLower:.52, shoulderLiftR:.42,   // right hand raised, ordering / pledging
  armLUpper:.16, armLLower:-.14, rootScale:1.02,
}, { hands:["relaxed","open_palm"] });

// MARRIAGE — OD-B07-S04: the admiring host, warming to his guest, throws
// hospitality wide open into a marriage offer — both arms swept out over the
// hall, chest thrown open, a broad genuine smile, brows lifted in pleasure, gaze
// warm and level on the man he would make a son. The most expansive of gestures.
P("alcinous_marriage", {
  smile:.54, browUp:.42, eyeWide:.14, jaw:.20, browKnit:.02,
  chestOpen:.96, spineLean:-.10, headPitch:-.04,
  bodyYaw:.05, headYaw:-.06, gazeX:-.14, gazeY:.06,   // warm, level, on the guest
  armLUpper:1.20, armLLower:-.26, armRUpper:-1.20, armRLower:.26,
  shoulderLiftL:.32, shoulderLiftR:.32, rootY:-.02,
}, { hands:["open_palm","open_palm"] });

// PROMISING — a quieter proclaiming beat, the pledge of the ship offered with an
// open persuasive palm turned up: brows lifted and even, a faint reassuring
// smile, gaze steady on the guest. Used as the resting "gracious host" register.
P("alcinous_promising", {
  smile:.20, browUp:.34, eyeWide:.06, jaw:.14,
  headPitch:-.02, headYaw:-.05, gazeX:-.10, gazeY:.02,
  spineLean:-.08, bodyYaw:-.05, chestOpen:.28,
  armRUpper:-1.02, armRLower:.66, shoulderLiftR:.16,   // open palm-up, offering the ship
  armLUpper:.16, armLLower:-.12,
}, { hands:["relaxed","palm_up"] });

const params = {
  // mature Phaeacian king: warm weathered skin; a dark iron-brown mane + full
  // beard (dark enough to carry real halftone mass and to read distinct from
  // Menelaus's tawny-auburn and Nestor's white). Rich robe + cloak of a wealthy
  // sea-king; shod, not bare-legged. A touch larger in scale — an imposing,
  // throned host presence.
  skin:"#d0bb98", hairColor:"#39332b",
  hair:"curly", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.12,
};

const fig = makeFigure(params);

/* ---- CROWN: a tall royal diadem, distinct from Menelaus's low brow-circlet.
   It sits HIGHER on the head (near the hairline crown) and rises into taller
   points, so the silhouette reads unmistakably as a full crown rather than a
   circlet. Drawn AFTER the figure in solid grays + hard contour so the engine
   POST pass halftones it with the rest. Anchored to the reported head/crown
   positions so it tracks head scale and turn. ---- */
function drawCrown(ctx, W, H, out){
  try {
    const a = out && out.anchors; if(!a || !a.head || !a.crown) return;
    const hx = a.head.x * W, hy = a.head.y * H;
    const cy = a.crown.y * H;
    const Rv = Math.max(8, hy - cy);              // vertical head radius in px
    const Rw = Rv * 0.86;                          // horizontal half-width of the band
    const browY = hy - Rv * 0.74;                  // rides high, across the top of the skull
    const bandH = Rv * 0.26;
    const gold = "#8f8b80", goldDeep = "#5c5951", gem = "#2c2c28";
    const dip = Rv * 0.14;                          // band bows down at center-front
    ctx.save();
    ctx.lineJoin="round"; ctx.lineCap="round";
    // filled band — a shallow downward-bowed arc across the top of the head
    ctx.beginPath();
    ctx.moveTo(hx-Rw, browY-bandH/2);
    ctx.quadraticCurveTo(hx, browY-bandH/2+dip, hx+Rw, browY-bandH/2);
    ctx.lineTo(hx+Rw, browY+bandH/2);
    ctx.quadraticCurveTo(hx, browY+bandH/2+dip, hx-Rw, browY+bandH/2);
    ctx.closePath();
    ctx.fillStyle = gold; ctx.fill();
    ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(2.5, Rv*0.08); ctx.stroke();
    // TALL triangular points rising off the band — the crown silhouette. The
    // center point is the tallest (a royal peak), stepping down to the sides.
    const peaks = [-0.72,-0.36,0,0.36,0.72];
    for(const f of peaks){
      const px = hx + f*Rw;
      const tall = f===0 ? 0.62 : (Math.abs(f)<0.5 ? 0.48 : 0.34);
      const topY = browY - bandH/2 + dip*(1-f*f) - Rv*tall;
      const baseY = browY - bandH/2 + dip*(1-f*f) + Rv*0.02;
      ctx.beginPath();
      ctx.moveTo(px - Rw*0.12, baseY);
      ctx.lineTo(px, topY);
      ctx.lineTo(px + Rw*0.12, baseY);
      ctx.closePath();
      ctx.fillStyle = gold; ctx.fill();
      ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(1.5, Rv*0.05); ctx.stroke();
      // bright jewel-stud at each point tip
      ctx.beginPath(); ctx.arc(px, topY, Math.max(1.6, Rv*0.055), 0, Math.PI*2);
      ctx.fillStyle = gem; ctx.fill();
      ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(1, Rv*0.02); ctx.stroke();
    }
    // lower rim shadow line
    ctx.strokeStyle = goldDeep; ctx.lineWidth = Math.max(1.5, Rv*0.045);
    ctx.beginPath();
    ctx.moveTo(hx+Rw, browY+bandH/2);
    ctx.quadraticCurveTo(hx, browY+bandH/2+dip, hx-Rw, browY+bandH/2);
    ctx.stroke();
    // central gem — a large diamond at the band's midpoint
    const gy = browY + dip*0.6;
    ctx.beginPath();
    ctx.moveTo(hx, gy-bandH*0.72); ctx.lineTo(hx+bandH*0.62, gy);
    ctx.lineTo(hx, gy+bandH*0.72); ctx.lineTo(hx-bandH*0.62, gy); ctx.closePath();
    ctx.fillStyle = gem; ctx.fill();
    ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(1.5, Rv*0.045); ctx.stroke();
    ctx.restore();
  } catch(e){ /* crown is decorative; never block the figure render */ }
}

/* ---- SCEPTRE: a tall royal sceptre planted at his LEFT side, topped with an
   ornate finial (orb + collar). Held/planted at a fixed side position (not the
   moving hand) so it stands steady as a throned king's staff across every pose,
   including the wide-armed marriage sweep. Drawn in solid grays + hard contour
   so the POST pass halftones it with the figure. ---- */
function drawSceptre(ctx, W, H){
  try {
    const gx = W*0.255;                    // planted just outside his left side, clear of the arm
    const topY = H*0.245;                  // finial rides up near the shoulder, above the hand
    const footY = H*0.925;                 // plants near the ground line
    const lean = W*0.012;                  // slight lean, foot tucked inward
    const pole = "#6a675f", poleDeep = "#3f3d38", gold = "#8f8b80", gem = "#2c2c28";
    ctx.save();
    ctx.lineCap="round"; ctx.lineJoin="round";
    // contour underlay for the shaft
    ctx.strokeStyle="#141414"; ctx.lineWidth=W*0.030;
    ctx.beginPath(); ctx.moveTo(gx, topY); ctx.lineTo(gx+lean, footY); ctx.stroke();
    // shaft fill
    ctx.strokeStyle=pole; ctx.lineWidth=W*0.017;
    ctx.beginPath(); ctx.moveTo(gx, topY); ctx.lineTo(gx+lean, footY); ctx.stroke();
    // a thin shadow line down one edge of the shaft
    ctx.strokeStyle=poleDeep; ctx.lineWidth=W*0.005;
    ctx.beginPath(); ctx.moveTo(gx+W*0.006, topY); ctx.lineTo(gx+lean+W*0.006, footY); ctx.stroke();
    // collar rings just below the finial
    ctx.strokeStyle="#141414"; ctx.lineWidth=W*0.006;
    for(let i=0;i<2;i++){
      const cy = topY + W*0.03 + i*W*0.022;
      ctx.beginPath(); ctx.moveTo(gx-W*0.018, cy); ctx.lineTo(gx+W*0.018, cy); ctx.stroke();
    }
    // ornate finial — an orb crowned by a small stud
    ctx.fillStyle=gold; ctx.strokeStyle="#141414"; ctx.lineWidth=W*0.010;
    ctx.beginPath(); ctx.arc(gx, topY, W*0.032, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // dark gem at the orb's center
    ctx.beginPath(); ctx.arc(gx, topY, W*0.012, 0, Math.PI*2);
    ctx.fillStyle=gem; ctx.fill();
    // a small crowning stud on top of the orb
    ctx.fillStyle=gold; ctx.strokeStyle="#141414"; ctx.lineWidth=W*0.008;
    ctx.beginPath(); ctx.arc(gx, topY - W*0.040, W*0.013, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.restore();
  } catch(e){ /* sceptre is decorative; never block the figure render */ }
}

export const asset = {
  id:"character.alcinous",
  type:"CHARACTER",
  name:"Alcinous",
  statusWord:"GENEROUS",
  scene:"OD-B07-S03",

  params,
  layers:["shadow","sceptre-back","hair-back","legs","robe","torso","cloak",
          "far-arm","neck","head","face","hair-front","beard","crown","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.09}, eyes:{x:.50,y:.20},
    rightHand:{x:.68,y:.52}, leftHand:{x:.34,y:.58},
    sceptreGrip:{x:.255,y:.55}, sceptreTop:{x:.255,y:.245},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
    suppliant:{x:.16,y:.82}, hearth:{x:.20,y:.70}, hall:{x:.84,y:.28},
  },
  states:{
    initial:"generous",
    nodes:{
      // THE beat / signature — raising the suppliant out of the ashes
      generous:  { preview:{ pose:"alcinous_raising", gaze:{x:-.14,y:.28}, status:"GENEROUS" } },
      // OD-B07-S03a — first stunned by the stranger at the hearth
      stunned:   { preview:{ pose:"alcinous_stunned", gaze:{x:-.12,y:.18}, status:"STUNNED" } },
      // OD-B07-S03b — restoring the rite and promising transport
      restoring: { preview:{ pose:"alcinous_restoring", gaze:{x:.16,y:-.04}, status:"RESTORING" } },
      // OD-B07-S03c — the quieter pledge of the ship
      promising: { preview:{ pose:"alcinous_promising", gaze:{x:-.10,y:.02}, status:"PROMISING" } },
      // OD-B07-S04 — hospitality opening into a marriage offer
      marriage:  { preview:{ pose:"alcinous_marriage", gaze:{x:-.14,y:.06}, status:"OFFERING" } },
      // stable identity turn
      profile:   { preview:{ pose:"profile_left" } },
    },
    edges:[
      ["stunned","restoring"],["restoring","promising"],["promising","generous"],
      ["generous","marriage"],["marriage","generous"],
      ["generous","restoring"],["restoring","stunned"],["generous","profile"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // EXPRESSIVE signature — GENEROUS: a mature, dark-bearded, CROWNED king with a
  // royal sceptre planted at his side, his right hand reached out and down to
  // RAISE A SUPPLIANT up out of the ashes, the body inclined toward him, chest
  // opened. The face is pure genial magnanimity — brows lifted soft, a warm
  // smile, kind eyes cast down on the man he lifts. No `mouth` overlay so the
  // pose's authored warmth can't be flattened.
  preview:()=>({ pose:"alcinous_raising", gaze:{x:-.14,y:.28}, t:0.42,
                 status:"GENEROUS", progress:.24 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // sceptre back-half is planted before the figure so the shaft reads as held
    drawSceptre(ctx, W, H);
    const out = fig.draw(ctx, W, H, state);
    drawCrown(ctx, W, H, out);
    return out;
  },
};
export default asset;
