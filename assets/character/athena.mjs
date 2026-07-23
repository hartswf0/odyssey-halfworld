/* character.athena — the bright-eyed strategist, grey-eyed goddess of counsel.
   CHARACTER asset. Armored / cloaked goddess with a borne spear and a
   pushed-back plumed helmet crest; bound hair; stable identity across views.
   Scene function: shifts the assembly from abstract blame to a concrete
   rescue plan (OD-B01-S01), then moves from speech into departure (OD-B01-S02). */
import { makeFigure, INK, gray, HERO_POSES } from "../../engine/halfworld-engine.mjs";

const params = {
  skin:"#dcd6c8", hairColor:"#2a2118",
  hair:"short", beard:false, glasses:false,
  garment:"armor", cloak:true, bareLegs:false, scale:1.0,
};

/* ---- Athena-specific poses: each bakes the FACE channels (eyeWide, browUp,
   browKnit, jaw, smile, frown, mouthAsym) together with a gesturing ARM set,
   so every state emotes on the face AND with the arms — not just a pose name.
   Registered into the shared hero pose table under athena_* ids. */
const ATHENA_POSES = {
  // SIGNATURE — the bright-eyed strategist: wide alert eyes, raised sharp brows,
  // lips parted mid-word, right arm thrust out in a decisive point across body.
  athena_strategist:{ id:"athena_strategist", label:"strategist", group:"emotion",
    n:{ armRUpper:-1.06, armRLower:.66, armLUpper:.74, armLLower:-.82,
        bodyYaw:-.14, headYaw:-.22, spineLean:-.12, chestOpen:.5, rootScale:1.03,
        eyeWide:.82, browUp:.56, browKnit:.14, smile:.22, jaw:.26, mouthAsym:.12 },
    opt:{ hands:["open_palm","point"] } },
  // SPEAKING — open-palm address to the assembly, mouth open on a word.
  athena_speak:{ id:"athena_speak", label:"speaking", group:"emotion",
    n:{ chestOpen:1, armLUpper:.98, armRUpper:-.98, armLLower:-.52, armRLower:.52,
        handRotL:-.25, handRotR:.25, spineLean:-.07,
        jaw:.52, browUp:.34, eyeWide:.24, smile:.16 },
    opt:{ hands:["open_palm","open_palm"] } },
  // COMMAND — stern authority: knit brows, narrowed eyes, jaw set, arm pointing.
  athena_command:{ id:"athena_command", label:"command", group:"emotion",
    n:{ browKnit:.66, eyeNarrow:.34, frown:.34, jaw:.16,
        armRUpper:-1.04, armRLower:.6, armLUpper:.36, armLLower:-1.02,
        bodyYaw:-.1, headYaw:-.18, spineLean:-.06, rootScale:1.06 },
    opt:{ hands:["fist","point"] } },
  // RESOLUTE (the "calm" node) — composed but never slack: eyes steady and a
  // touch wide, one brow lifted, faint set mouth, one hand raised at the spear.
  athena_resolute:{ id:"athena_resolute", label:"resolute", group:"emotion",
    n:{ armLUpper:.44, armLLower:-.5, armRUpper:-.22, armRLower:.12,
        eyeWide:.2, browUp:.18, browKnit:.06, smile:.08, headYaw:.14, headRoll:.03 },
    opt:{ hands:["relaxed","relaxed"] } },
};
for (const k in ATHENA_POSES) HERO_POSES[k] = ATHENA_POSES[k];

const fig = makeFigure(params);

/* The borne spear — a tall shaft with a leaf blade, drawn in solid grays so
   the engine's dotify pass supplies the halftone. Placed at the right-hand
   grip so the figure's near hand reads as holding it. Behind the figure. */
function drawSpear(ctx, W, H){
  const x = W*0.665, bladeTop = H*0.085, sockY = H*0.165, footY = H*0.965;
  const sw = W*0.016;
  // shaft
  ctx.fillStyle = gray(0x6b); ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.beginPath(); ctx.rect(x - sw/2, sockY, sw, footY - sockY); ctx.fill(); ctx.stroke();
  // leaf blade
  ctx.fillStyle = gray(0x3a);
  ctx.beginPath();
  ctx.moveTo(x, bladeTop);
  ctx.quadraticCurveTo(x + W*0.026, bladeTop + H*0.028, x + sw*0.55, sockY - H*0.006);
  ctx.quadraticCurveTo(x, sockY + H*0.004, x - sw*0.55, sockY - H*0.006);
  ctx.quadraticCurveTo(x - W*0.026, bladeTop + H*0.028, x, bladeTop);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // midrib
  ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x, bladeTop + H*0.01); ctx.lineTo(x, sockY - H*0.01); ctx.stroke();
  // socket collar
  ctx.fillStyle = gray(0x26);
  ctx.beginPath(); ctx.ellipse(x, sockY, sw*0.85, H*0.011, 0, 0, 7); ctx.fill(); ctx.stroke();
}

/* Pushed-back plumed helmet crest — a solid arc rising from behind the crown,
   a goddess-of-war marker that never covers the bright eyes. */
function drawCrest(ctx, W, H, crown){
  const cx = crown.x*W, cy = crown.y*H;
  ctx.fillStyle = gray(0x30); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - W*0.028, cy + H*0.010);
  ctx.quadraticCurveTo(cx - W*0.030, cy - H*0.075, cx + W*0.030, cy - H*0.088);
  ctx.quadraticCurveTo(cx + W*0.060, cy - H*0.052, cx + W*0.028, cy - H*0.006);
  ctx.quadraticCurveTo(cx + W*0.006, cy - H*0.028, cx - W*0.028, cy + H*0.010);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // crest ribs
  ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
  for (let i=1;i<=3;i++){
    const t=i/4;
    ctx.beginPath();
    ctx.moveTo(cx - W*0.028 + (cx+W*0.030-(cx-W*0.028))*t, cy - H*0.088*t*0.9 + H*0.010*(1-t));
    ctx.lineTo(cx + W*0.028 + (cx+W*0.030-(cx-W*0.028))*t*0.2, cy - H*0.006 - H*0.02*t);
    ctx.stroke();
  }
}

export const asset = {
  id:"character.athena",
  type:"CHARACTER",
  name:"Athena",
  statusWord:"STRATEGIST",
  scene:"OD-B01-S01",

  params,
  layers:["shadow","spear","hair-back","legs","torso","cloak","far-arm","neck","head","face","hair-front","crest","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    spearGrip:{x:.665,y:.60}, spearTip:{x:.665,y:.09},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // calm-but-coiled: steady wide grey eyes, one brow up, hand at the spear
      neutral:    { preview:{ pose:"athena_resolute", gaze:{x:.16,y:-.02} } },
      // OD-B01-S01: bright-eyed strategist naming a concrete plan to the assembly
      strategist: { preview:{ pose:"athena_strategist", gaze:{x:-.5,y:-.05} } },
      // mid-address, mouth open on a word, both palms open to the room
      speaking:   { preview:{ pose:"athena_speak", gaze:{x:-.12,y:0} } },
      // stern order: knit brows, narrowed eyes, decisive point
      command:    { preview:{ pose:"athena_command", gaze:{x:-.4,y:0} } },
      // OD-B01-S02: decisive planner moving from speech into immediate departure
      departing:  { preview:{ pose:"stride", band:"threeq", browUp:.2 } },
    },
    edges:[["neutral","strategist"],["strategist","speaking"],["speaking","command"],
           ["strategist","departing"],["command","departing"],["departing","neutral"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band"],

  // the card leads with the signature: pointing strategist, eyes bright and wide
  preview:()=>({ pose:"athena_strategist", gaze:{x:-.5,y:-.05}, t:0.45, status:"STRATEGIST", progress:.24 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band;
    // spear behind the figure so the near hand reads as gripping it
    drawSpear(ctx, W, H);
    const r = fig.draw(ctx, W, H, st);
    // plumed crest above the head, using the rig's reported crown anchor
    const crown = (r && r.anchors && r.anchors.crown) || { x:0.5, y:0.24 };
    drawCrest(ctx, W, H, crown);
    return r;
  },
};
export default asset;
