/* character.minos — the enthroned judge of the underworld dead.
   CHARACTER asset on the HALFTRACK hero rig. Minos is NOT a wispy shade: he
   is the one SOLID, seated authority among the drifting phantoms — a robed,
   crowned king set on a high stone throne, a GOLD sceptre lifted in his fist
   as he decrees. The register is grave impartiality: the stern, level face of
   a magistrate who weighs the disputes of the dead and hands down judgement
   without heat and without mercy.

   Scene function:
     OD-B11-S08  the seated underworld judge receiving the disputes of the
                 dead, golden sceptre raised, delivering his decrees.

   EXPRESSIVENESS: the hero rig reads facial channels (browKnit, browUp,
   eyeNarrow, frown, jaw, mouthAsym) off the composed POSE, and the scene-state
   mouth overlay can only bend a smile/frown line — never a grave OPEN decreeing
   mouth. So (like zeus / alcinous) Minos ships bespoke SEATED poses into the
   shared POSE registry the hero figure reads, each fusing a heavy judging brow +
   an open decreeing jaw + a lifted sceptre arm, so the card genuinely EMOTES.

   A high stone THRONE is drawn behind him, a tall CROWN on top, and the GOLD
   SCEPTRE raised in his hand — all in solid grays + hard contour so the engine
   POST pass halftones them with the figure. */
import { makeFigure } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Minos poses: SEATED (crouch splay reads as enthroned in the
   frontal rig) + judging brow + decreeing jaw + a raised sceptre arm authored
   together. Convention: crouch/hip-splay lowers the pelvis onto the seat and
   drops the shins vertically; armRUpper strongly negative lifts the RIGHT arm
   so the sceptre stands aloft; the left arm rests on the throne arm. ---- */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "minos", n, opt }; };

// THE CARD — GRAVE: the seated judge mid-decree. Enthroned (crouch splay,
// pelvis settled, shins dropped), the right arm LIFTED with the sceptre, the
// face pure impartial severity: brows knit and level, eyes narrowed and stern,
// the mouth parted on a pronounced judgement. Chin level, unmoved.
P("minos_judging", {
  crouch:.72, hipL:-.30, hipR:.30, kneeL:.64, kneeR:.64, rootY:.04,
  browKnit:.62, browUp:.10, eyeNarrow:.36, frown:.26, mouthAsym:.06,
  jaw:.42,                                     // OPEN — pronouncing the decree
  spineLean:-.04, chestOpen:.24, headPitch:-.02,
  bodyYaw:-.06, headYaw:-.08, gazeX:-.20, gazeY:.06,   // near-frontal so BOTH brows + mouth read
  armRUpper:-2.02, armRLower:.22, shoulderLiftR:.44,   // right arm raised aloft with the sceptre
  armLUpper:.26, armLLower:-.30,                        // left arm rests low on the throne arm
}, { hands:["relaxed","fist"] });

// RECEIVING — the quieter first beat: the judge settled, listening to the
// dispute laid before him. Sceptre lowered to rest, brows level and heavy,
// eyes cast a touch down onto the pleading dead, mouth closed and firm.
P("minos_receiving", {
  crouch:.88, hipL:-.5, hipR:.5, kneeL:1.0, kneeR:1.0, rootY:.07,
  browKnit:.28, browUp:.04, eyeNarrow:.22, frown:.10, jaw:0,
  spineLean:.04, headPitch:.10, neckPitch:.05,
  bodyYaw:-.05, headYaw:-.06, gazeX:-.16, gazeY:.24,   // eyes down on the suppliant dead
  armRUpper:-.42, armRLower:.30,                        // sceptre held low, at rest across the knee
  armLUpper:.24, armLLower:-.26,
}, { hands:["relaxed","fist"] });

// DECREEING — the peak: the sceptre thrust HIGHEST, brow driven hard down, the
// mouth wide on a pronouncement, chin lifted in absolute authority. The verdict.
P("minos_decreeing", {
  crouch:.82, hipL:-.54, hipR:.54, kneeL:.94, kneeR:.94, rootY:.05,
  browKnit:.80, browUp:.06, eyeNarrow:.42, frown:.34, mouthAsym:.10,
  jaw:.60,                                     // wide open — the verdict spoken
  spineLean:-.10, chestOpen:.34, headPitch:-.08,
  bodyYaw:-.04, headYaw:-.05, gazeX:-.10, gazeY:-.02,
  armRUpper:-2.66, armRLower:.14, shoulderLiftR:.72,   // sceptre driven to its highest
  armLUpper:.30, armLLower:-.34, rootScale:1.02,
}, { hands:["relaxed","fist"] });

const params = {
  // an ancient, iron-grey king: sun-gone skin of a long-dead sovereign, a
  // heavy silver mane and full beard (dark-enough grey to carry halftone mass
  // and read as venerable, not young). A rich dark robe + cloak of a throned
  // judge; shod, not bare-legged. Slightly larger scale — an imposing, solid
  // authority amid the thin shades.
  skin:"#c9b59a", hairColor:"#6b6760",
  hair:"curly", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.04,
};

const fig = makeFigure(params);

/* ---- THRONE: a high stone judgement-seat drawn BEHIND the figure (before the
   rig) so the seated king overlaps and reads as enthroned. Tall slab back with
   post-finials, a seat slab under the hips, and two blocky armrests at the
   sides. Solid grays + hard contour so the POST pass halftones it. ---- */
function drawThrone(ctx, W, H){
  try {
    const cx = W*0.50;
    const stone = "#7a776f", stoneDeep = "#4f4c46", stoneLite = "#8f8c83", ink = "#141414";
    const backW = W*0.46, backTop = H*0.115, seatY = H*0.66, footY = H*0.94;
    const armW = W*0.085;
    ctx.save();
    ctx.lineJoin="round"; ctx.lineCap="round";
    // tall back slab
    ctx.fillStyle = stoneDeep; ctx.strokeStyle = ink; ctx.lineWidth = W*0.012;
    ctx.beginPath();
    ctx.rect(cx-backW/2, backTop, backW, seatY-backTop+H*0.02);
    ctx.fill(); ctx.stroke();
    // inset panel on the back (carved judgement-seat face)
    ctx.fillStyle = stone; ctx.lineWidth = W*0.006;
    ctx.beginPath();
    ctx.rect(cx-backW/2+W*0.045, backTop+H*0.03, backW-W*0.09, seatY-backTop-H*0.06);
    ctx.fill(); ctx.stroke();
    // back-post finials (small blocky orbs riding the top corners, well above
    // the head so they read as throne posts, not ears)
    ctx.fillStyle = stoneLite; ctx.lineWidth = W*0.010;
    for(const s of [-1,1]){
      ctx.beginPath(); ctx.arc(cx+s*backW/2, backTop-H*0.002, W*0.026, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
    }
    // seat slab
    ctx.fillStyle = stone; ctx.lineWidth = W*0.012;
    ctx.beginPath();
    ctx.rect(cx-backW/2-W*0.01, seatY, backW+W*0.02, H*0.055);
    ctx.fill(); ctx.stroke();
    // two side armrests (vertical blocks + top slab)
    for(const s of [-1,1]){
      const ax = cx + s*(backW/2 + armW*0.1) - (s<0?armW:0);
      // post down to the ground
      ctx.fillStyle = stoneDeep; ctx.lineWidth = W*0.010;
      ctx.beginPath(); ctx.rect(ax, seatY, armW, footY-seatY); ctx.fill(); ctx.stroke();
      // armrest cap slab (rides forward at hip height)
      ctx.fillStyle = stoneLite; ctx.lineWidth = W*0.010;
      ctx.beginPath(); ctx.rect(ax-W*0.01, seatY-H*0.10, armW+W*0.02, H*0.045); ctx.fill(); ctx.stroke();
      // a couple of carved step-lines on the arm face
      ctx.strokeStyle = stoneDeep; ctx.lineWidth = W*0.004;
      for(let i=1;i<=2;i++){ const ly=seatY+(footY-seatY)*i/3;
        ctx.beginPath(); ctx.moveTo(ax, ly); ctx.lineTo(ax+armW, ly); ctx.stroke(); }
      ctx.strokeStyle = ink;
    }
    ctx.restore();
  } catch(e){ /* throne is decorative; never block the figure render */ }
}

/* ---- CROWN: a tall royal diadem riding high across the top of the skull,
   anchored to the reported head/crown positions so it tracks head scale + turn.
   Drawn AFTER the figure in solid grays + hard contour. (Same construction as
   the other throned kings so the crowns read as one family.) ---- */
function drawCrown(ctx, W, H, out){
  try {
    const a = out && out.anchors; if(!a || !a.head || !a.crown) return;
    const hx = a.head.x * W, hy = a.head.y * H;
    const cy = a.crown.y * H;
    const Rv = Math.max(8, hy - cy);
    const Rw = Rv * 0.86;
    const browY = hy - Rv * 0.74;
    const bandH = Rv * 0.26;
    const gold = "#8f8b80", goldDeep = "#5c5951", gem = "#2c2c28";
    const dip = Rv * 0.14;
    ctx.save();
    ctx.lineJoin="round"; ctx.lineCap="round";
    // filled band
    ctx.beginPath();
    ctx.moveTo(hx-Rw, browY-bandH/2);
    ctx.quadraticCurveTo(hx, browY-bandH/2+dip, hx+Rw, browY-bandH/2);
    ctx.lineTo(hx+Rw, browY+bandH/2);
    ctx.quadraticCurveTo(hx, browY+bandH/2+dip, hx-Rw, browY+bandH/2);
    ctx.closePath();
    ctx.fillStyle = gold; ctx.fill();
    ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(2.5, Rv*0.08); ctx.stroke();
    // tall triangular points
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
      ctx.beginPath(); ctx.arc(px, topY, Math.max(1.6, Rv*0.055), 0, Math.PI*2);
      ctx.fillStyle = gem; ctx.fill();
      ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(1, Rv*0.02); ctx.stroke();
    }
    // lower rim shadow
    ctx.strokeStyle = goldDeep; ctx.lineWidth = Math.max(1.5, Rv*0.045);
    ctx.beginPath();
    ctx.moveTo(hx+Rw, browY+bandH/2);
    ctx.quadraticCurveTo(hx, browY+bandH/2+dip, hx-Rw, browY+bandH/2);
    ctx.stroke();
    // central diamond gem
    const gy = browY + dip*0.6;
    ctx.beginPath();
    ctx.moveTo(hx, gy-bandH*0.72); ctx.lineTo(hx+bandH*0.62, gy);
    ctx.lineTo(hx, gy+bandH*0.72); ctx.lineTo(hx-bandH*0.62, gy); ctx.closePath();
    ctx.fillStyle = gem; ctx.fill();
    ctx.strokeStyle = "#141414"; ctx.lineWidth = Math.max(1.5, Rv*0.045); ctx.stroke();
    ctx.restore();
  } catch(e){ /* crown is decorative; never block the figure render */ }
}

/* ---- GOLD SCEPTRE, RAISED: attached to the figure's RIGHT hand anchor and
   thrust aloft — the emblem of judgement lifted mid-decree. A bright gold shaft
   (lighter gray = fewer POST dots, so it reads metallic-pale against the dark
   robe), collar rings, and an ornate orb + stud finial at the very top. Drawn
   after the figure so it sits in the raised fist. Falls back to a fixed raised
   position if the hand anchor is unavailable. ---- */
function drawScepter(ctx, W, H, out){
  try {
    const a = out && out.anchors;
    let hx = W*0.66, hy = H*0.40;
    if (a && a.rightHand){ hx = a.rightHand.x * W; hy = a.rightHand.y * H; }
    // the shaft runs from a little below the fist up to a raised finial,
    // leaning very slightly outward as it rises
    const topX = hx + W*0.02, topY = hy - H*0.185;  // finial, held high (kept in frame)
    const botX = hx - W*0.008, botY = hy + H*0.08;  // butt just below the grip
    const gold = "#a49f8f", goldDeep = "#6e6a5d", gem = "#2c2c28", ink = "#141414";
    const finR = W*0.030;
    ctx.save();
    ctx.lineCap="round"; ctx.lineJoin="round";
    // contour underlay for the shaft
    ctx.strokeStyle=ink; ctx.lineWidth=W*0.032;
    ctx.beginPath(); ctx.moveTo(botX, botY); ctx.lineTo(topX, topY); ctx.stroke();
    // gold shaft fill
    ctx.strokeStyle=gold; ctx.lineWidth=W*0.018;
    ctx.beginPath(); ctx.moveTo(botX, botY); ctx.lineTo(topX, topY); ctx.stroke();
    // thin shadow edge down one side
    ctx.strokeStyle=goldDeep; ctx.lineWidth=W*0.005;
    ctx.beginPath(); ctx.moveTo(botX+W*0.006, botY); ctx.lineTo(topX+W*0.006, topY); ctx.stroke();
    // collar rings just below the finial
    ctx.strokeStyle=ink; ctx.lineWidth=W*0.006;
    for(let i=0;i<2;i++){
      const t = 0.10 + i*0.06;
      const cxr = topX + (botX-topX)*t, cyr = topY + (botY-topY)*t;
      ctx.beginPath(); ctx.moveTo(cxr-W*0.018, cyr); ctx.lineTo(cxr+W*0.018, cyr); ctx.stroke();
    }
    // ornate finial orb
    ctx.fillStyle=gold; ctx.strokeStyle=ink; ctx.lineWidth=W*0.010;
    ctx.beginPath(); ctx.arc(topX, topY, finR, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // dark gem at the orb center
    ctx.beginPath(); ctx.arc(topX, topY, finR*0.42, 0, Math.PI*2);
    ctx.fillStyle=gem; ctx.fill();
    // crowning stud on top of the orb
    ctx.fillStyle=gold; ctx.strokeStyle=ink; ctx.lineWidth=W*0.008;
    ctx.beginPath(); ctx.arc(topX, topY - finR*1.3, W*0.013, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.restore();
  } catch(e){ /* sceptre is decorative; never block the figure render */ }
}

export const asset = {
  id:"character.minos",
  type:"CHARACTER",
  name:"Minos",
  statusWord:"GRAVE",
  scene:"OD-B11-S08",

  params,
  layers:["throne","shadow","hair-back","legs","robe","torso","cloak",
          "far-arm","neck","head","face","hair-front","beard","crown","near-arm","sceptre"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.66,y:.38}, leftHand:{x:.34,y:.62},
    sceptreGrip:{x:.66,y:.38}, sceptreTop:{x:.68,y:.10},
    hip:{x:.50,y:.64}, feet:{x:.50,y:.94},
    throneSeat:{x:.50,y:.66}, suppliant:{x:.16,y:.86}, dead:{x:.82,y:.84},
  },
  states:{
    initial:"grave",
    nodes:{
      // THE beat / signature — seated judge mid-decree, sceptre raised, stern
      grave:     { preview:{ pose:"minos_judging", gaze:{x:-.20,y:.06}, status:"GRAVE" } },
      // OD-B11-S08a — receiving the dispute, sceptre at rest, listening
      receiving: { preview:{ pose:"minos_receiving", gaze:{x:-.16,y:.24}, status:"WEIGHING" } },
      // OD-B11-S08b — the verdict, sceptre at its highest, mouth wide
      decreeing: { preview:{ pose:"minos_decreeing", gaze:{x:-.10,y:-.02}, status:"DECREEING" } },
      // stable identity turn
      profile:   { preview:{ pose:"profile_left", gaze:{x:-.3,y:0} } },
    },
    edges:[
      ["receiving","grave"],["grave","decreeing"],["decreeing","grave"],
      ["grave","receiving"],["grave","profile"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // EXPRESSIVE signature — GRAVE: the seated, crowned underworld judge on his
  // stone throne, a GOLD sceptre lifted in his fist, his face pure impartial
  // severity: brows knit and level, eyes narrowed, mouth parted on a decree. No
  // `mouth` overlay, so the pose's authored gravity is never flattened to a smile.
  preview:()=>({ pose:"minos_judging", gaze:{x:-.20,y:.06}, t:0.42,
                 status:"GRAVE", progress:.24 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // throne is planted first so the seated king overlaps and reads as enthroned
    drawThrone(ctx, W, H);
    const out = fig.draw(ctx, W, H, state);
    drawCrown(ctx, W, H, out);
    drawScepter(ctx, W, H, out);
    return out;
  },
};
export default asset;
