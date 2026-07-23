/* character.phemius — the bard of Ithaca, son of Terpes.
   CHARACTER asset. Scene function (OD-B01-S06): the coerced court singer
   who continues the "return of the Achaeans" song under the suitors while
   Penelope grieves it from the stair and Telemachus cuts him off. Built on
   the HALFTRACK hero rig: a mature, robed performer, bearded, greying, with
   one identity prop layered over the rig — the phorminx (lyre) cradled on
   the left and plucked with the right. Stable identity across
   front/three-quarter/profile/back; face, gaze, mouth, and every joint stay
   exposed so scenes can make him sing, falter, track Penelope, and stop.
   The lyre is a capability — drawn when state.lyre !== false (default), and
   stowed for the back turn. */
import { makeFigure, INK } from "/engine/halfworld-engine.mjs";

const params = {
  skin:"#cdb999", hairColor:"#6d6a62",        // greying court singer
  hair:"short", beard:true, glasses:false,
  garment:"robe", cloak:false, bareLegs:false, // a full singer's robe to the ankle
  scale:1.03,                                  // tall, upright, standing to perform
};

const fig = makeFigure(params);

/* ---- lyre palette (solid grays + hard contour; the engine's POST pass
   supplies the halftone, so no pre-dithering here) ---- */
const BOX_WOOD  = "#938a7e";   // soundbox (tortoise-shell bowl) — pale wood, pops off the robe
const BOX_RIM   = "#6f685e";   // soundbox rim / deeper edge
const ARM_HORN  = "#a89f93";   // the two curving arms (goat-horn / wood)
const YOKE_BAR  = "#8c8377";   // crossbar

/* draw a phorminx cradled at (baseX,baseY) and rising toward (topX,topY).
   Fixed proportions keyed off R (headR) so it stays a stable identity prop;
   the aim point only sets position + tilt, not size. Local frame: y=0 at the
   soundbox base (in the left hand), the instrument grows toward -y (up). */
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
    ctx.quadraticCurveTo(s*R*1.4,  -H*0.42,   s*tipX,        armY+R*0.30);  // outer: bow wide then up
    ctx.lineTo(s*(tipX-R*0.30), armY+R*0.30);
    ctx.quadraticCurveTo(s*R*0.85, -H*0.42,   s*cornerX*0.4, boxTop-R*0.02);// inner edge back down
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
  const nStr = 6;
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

export const asset = {
  id:"character.phemius",
  type:"CHARACTER",
  name:"Phemius",
  statusWord:"COERCED",
  scene:"OD-B01-S06",

  params,
  layers:["shadow","hair-back","legs","robe","far-arm","neck","head","face",
          "hair-front","beard","near-arm","lyre"],
  // normalized 0..1 anchors for scene attachment / gaze / the instrument
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.60,y:.58}, leftHand:{x:.38,y:.64},
    lyreGrip:{x:.40,y:.62}, yoke:{x:.55,y:.42},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"performing",
    nodes:{
      // OD-B01-S06: singing the return-song — leaning into it, mouth open in song,
      // brows lifted, eyes out over the hall. lean_forward brings both arms in
      // over the lyre; mouth:.7 opens the jaw to teeth.
      performing:  { preview:{ pose:"lean_forward", gaze:{x:.28,y:-.08}, mouth:.7, lyre:true } },
      // coerced: sings on but wary — a sidelong, skeptical glance off the song,
      // brow knit, one eye narrowed, mouth pulled asymmetric, an arm folded in.
      coerced:     { preview:{ pose:"skepticism", gaze:{x:-.5,y:-.1}, mouth:-.15, lyre:true } },
      // tracking Penelope's grief on the stair — head bowed, brows knit & raised,
      // frown, right arm folded across toward the strings, eyes cast down & aside.
      tracking:    { preview:{ pose:"grief", gaze:{x:-.3,y:.42}, mouth:-.35, lyre:true } },
      // Telemachus cuts him off — recoils, blocking arm up, song caught in the throat,
      // brows knit, eyes wide up at the prince.
      interrupted: { preview:{ pose:"protective_block", gaze:{x:-.25,y:-.28}, mouth:0, lyre:true } },
      // lowered / silenced between songs — head hung, a small downturned mouth.
      silent:      { preview:{ pose:"head_lowered", gaze:{x:0,y:.4}, mouth:-.2, lyre:true } },
      // stable identity turns
      neutral:     { preview:{ pose:"neutral_front", gaze:{x:0,y:0}, mouth:0, lyre:true } },
      profile:     { preview:{ pose:"profile_left", lyre:true } },
      back:        { preview:{ pose:"back_view", lyre:false } },
    },
    edges:[
      ["performing","coerced"],["coerced","tracking"],["tracking","performing"],
      ["performing","interrupted"],["interrupted","silent"],["silent","performing"],
      ["performing","neutral"],["neutral","profile"],["neutral","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band","lyre"],

  // SIGNATURE — COERCED: a bard bowed over his lyre, brows knit and raised in
  // pained/wistful grief, mouth downturned, right arm folded in across the
  // strings, eyes cast down to the instrument he is forced to keep playing.
  preview:()=>({ pose:"grief", gaze:{x:-.18,y:.42}, mouth:-.72, t:0.4,
                 lyre:true, status:"COERCED", progress:.2 }),

  draw(ctx, W, H, state={}){
    if (state && state.band) fig.spec.band = state.band;
    // 1) the rig, in solid grays + contour
    const out = fig.draw(ctx, W, H, state);
    const rig = fig.hero.rig, d = rig.dim, R = d.headR;

    // 2) the phorminx — capability; stowed on the back turn.
    //    Cradled UPRIGHT against the chest (the flat rig turns any "reach"
    //    into a sideways splay, so we anchor to the torso, not the hands):
    //    soundbox low at the hip, yoke up at the shoulder, a slight tilt.
    const turnedAway = (state.pose === "back_view" || state.band === "back" || state.lyre === false);
    if (!turnedAway){
      const chest = rig.chest.point(), pel = rig.pelvis.point();
      const baseX = pel.x - R*0.75, baseY = pel.y + R*0.2;   // soundbox at the waist, figure-left
      const topX  = baseX + R*0.15, topY = baseY - R*2.25;   // U-frame rises near-upright to the shoulder
      lyre(ctx, baseX, baseY, topX, topY, R);
    }
    return out;
  },
};
export default asset;
