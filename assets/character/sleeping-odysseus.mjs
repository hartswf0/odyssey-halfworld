/* character.sleeping-odysseus — Book 12.
   Odysseus carried inland by his crew and laid, still wrapped in sleep, on
   the shore of Thrinacia — but here the beat is the supernatural version:
   the leader removed and HELD under an unnatural sleep by the gods until the
   irreversible act (the slaughter of Helios's cattle) is done. Keeps his
   identity (skin / curly hair / beard) but reclines — the hero rig is tipped
   onto the ground, propped against inland ROCKS (no leaves), a faint radiant
   SLEEP-GLOW haloing the head, and the FACE carries a peaceful, unaware calm:
   sealed lids, soft brow, a slack, near-smiling mouth. Distinct from the
   sleeping-under-leaves variant: rocks not litter, a longer open recline, a
   supernatural glow instead of a buried body.
   Scene: OD-B12-S06 (removed leader held asleep until the act is irreversible). */
import { makeFigure, HERO_POSES, INK, gray, clamp01 } from "/engine/halfworld-engine.mjs";

const params = {
  skin:"#cdb89a", hairColor:"#241d16",       // same identity as odysseus.mjs
  hair:"curly", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:0.74,
};

const fig = makeFigure(params);

/* ---- bespoke reclining poses — an OPEN, relaxed sleep against rock ----
   Registered additively onto the shared hero table. Unlike the tight fetal
   curl of the under-leaves variant, this body is elongated and propped: the
   upper back leans on stone, legs are loosely extended, one arm drapes across
   the belly, the head lolls back to one side. */
HERO_POSES.recline_hold = { id:"recline_hold", label:"held asleep", group:"torso",
  n:{ bodyYaw:-.18, crouch:.34, spineLean:.30, headPitch:.10, headRoll:.36, headY:.06,
      kneeL:.62, kneeR:.30, hipL:-.24, hipR:-.02, ankleL:.16, ankleR:.04,
      armLUpper:.28, armLLower:1.08, armRUpper:.52, armRLower:1.30,
      shoulderLiftL:.14, shoulderLiftR:.08, rootY:.04 },
  opt:{ hands:["relaxed","relaxed"] } };

HERO_POSES.recline_settle = { id:"recline_settle", label:"settling under", group:"torso",
  n:{ bodyYaw:-.14, crouch:.42, spineLean:.20, headPitch:.02, headRoll:.20, headY:.03,
      kneeL:.74, kneeR:.42, hipL:-.30, hipR:-.08, ankleL:.18, ankleR:.06,
      armLUpper:.22, armLLower:.92, armRUpper:.44, armRLower:1.12,
      shoulderLiftL:.10, shoulderLiftR:.06, rootY:.02 },
  opt:{ hands:["relaxed","relaxed"] } };

HERO_POSES.recline_deep = { id:"recline_deep", label:"oblivious", group:"torso",
  n:{ bodyYaw:-.20, crouch:.28, spineLean:.34, headPitch:.14, headRoll:.48, headY:.08,
      kneeL:.52, kneeR:.24, hipL:-.18, hipR:.02, ankleL:.14, ankleR:.02,
      armLUpper:.30, armLLower:1.16, armRUpper:.58, armRLower:1.40,
      shoulderLiftL:.16, shoulderLiftR:.10, rootY:.05 },
  opt:{ hands:["relaxed","relaxed"] } };

/* how far to tip the whole figure onto the ground (radians, counter-clockwise).
   Slightly less than a full lie-down so he reads as PROPPED against the rock
   rather than flat on the earth. */
const RECLINE = -0.90;

/* ---- inland rocks: blocky angular boulders the sleeper is laid against ----
   Flat mid-grays + hard ink contour; the POST pass supplies the dots. Kept as
   a few distinct faceted stones (not one mass) so they read as rock. Drawn in
   the rotated figure frame, massed behind the head + upper back. */
function drawRocks(ctx, W, H){
  // figure-frame coords — the rig's head lands near (0.48W,0.48H); this
  // cluster sits just behind/under the head-and-shoulder so, once tipped,
  // it reads as the stone ledge his head is propped on.
  const stones = [
    // [cx, cy, w, h, rot, fill]
    [W*0.26, H*0.57, W*0.13, H*0.095, -0.16, "#83807a"],
    [W*0.19, H*0.50, W*0.10, H*0.085,  0.24, "#9a968d"],
    [W*0.33, H*0.61, W*0.115,H*0.080,  0.12, "#6f6e69"],
    [W*0.14, H*0.58, W*0.085,H*0.075, -0.34, "#8d8983"],
  ];
  for (const [cx,cy,w,h,rot,fill] of stones){
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(rot);
    ctx.fillStyle = fill; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin="round";
    // faceted angular boulder (irregular hexagon)
    ctx.beginPath();
    ctx.moveTo(-w, -h*0.25);
    ctx.lineTo(-w*0.55, -h);
    ctx.lineTo( w*0.50, -h*0.85);
    ctx.lineTo( w,       h*0.10);
    ctx.lineTo( w*0.45,  h);
    ctx.lineTo(-w*0.60,  h*0.80);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // one internal facet crease so the stone reads solid, not a blob
    ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-w*0.55, -h);
    ctx.lineTo(-w*0.05,  h*0.20);
    ctx.lineTo( w*0.45,  h);
    ctx.stroke();
    ctx.restore();
  }
}

/* ---- faint supernatural sleep-glow: a radiant halo around the head ----
   Drawn BEHIND the figure so it reads as an aura. A very light-gray disc
   (dotifies to a sparse scatter = "faint"), ringed by short radiating rays.
   Centered on where the reclined head lands (upper-left of the frame). */
function drawGlow(ctx, W, H, cx, cy, R){
  ctx.save();
  // faint light disc — light gray so the POST pass stamps only a few dots
  ctx.fillStyle = "#e6e4de";
  ctx.beginPath(); ctx.arc(cx, cy, R*1.15, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#dcdad3";
  ctx.beginPath(); ctx.arc(cx, cy, R*0.78, 0, Math.PI*2); ctx.fill();
  // radiating rays — thin mid-gray ticks around the halo
  ctx.strokeStyle = "#b8b4ac"; ctx.lineWidth = 3; ctx.lineCap="round";
  const N = 16;
  for (let i=0;i<N;i++){
    const a = (i/N)*Math.PI*2 + 0.2;
    const r0 = R*1.02, r1 = R*(1.30 + 0.12*((i%2)===0?1:0));
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*r0, cy+Math.sin(a)*r0);
    ctx.lineTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1);
    ctx.stroke();
  }
  ctx.restore();
}

export const asset = {
  id:"character.sleeping-odysseus",
  type:"CHARACTER",
  name:"Sleeping Odysseus",
  statusWord:"HELD",
  scene:"OD-B12-S06",

  params,
  layers:["rocks","glow","shadow","legs","torso","far-arm","neck","head",
          "face","hair","beard","near-arm"],
  // normalized 0..1 anchors — the reclined figure reads left-to-right:
  // head propped at upper-left against the rocks, feet trailing lower-right.
  anchors:{
    head:{x:.34,y:.42}, crown:{x:.28,y:.37}, eyes:{x:.35,y:.43},
    chest:{x:.52,y:.56}, restingHand:{x:.50,y:.62},
    hip:{x:.60,y:.66}, feet:{x:.80,y:.80},
    rockLedge:{x:.24,y:.56}, glow:{x:.33,y:.40},
  },
  states:{
    initial:"held",
    nodes:{
      // settling under — lids drooping shut, brows just softening
      settling: { preview:{ pose:"recline_settle", blink:.82, browUp:.10, browKnit:.04,
                            eyeNarrow:.5, jaw:.05, smile:.02, gaze:{x:0,y:.15}, t:0.5 } },
      // held — the signature: sealed lids, soft brow, slack near-smile,
      // the supernatural hold at its deepest and calmest
      held:     { preview:{ pose:"recline_hold", blink:1, browUp:.06, browKnit:0,
                            jaw:.08, smile:.10, gaze:{x:0,y:.2}, t:0.5 } },
      // oblivious — deepest, head rolled fully away, peaceful and unaware
      // while the irreversible act completes off-frame
      oblivious:{ preview:{ pose:"recline_deep", blink:1, browUp:.04, browKnit:0,
                            jaw:.11, smile:.14, gaze:{x:0,y:.25}, t:0.5 } },
    },
    edges:[["settling","held"],["held","oblivious"],
           ["oblivious","held"],["held","settling"]],
  },
  channels:["gaze","mouth","breath","pose","blink",
            "smile","browUp","browKnit","eyeWide","eyeNarrow","jaw"],

  // CARD SIGNATURE — HELD: the deep-hold beat. Body tipped onto the inland
  // rocks in a long, loose recline, head lolled to one side and haloed by a
  // faint sleep-glow, lids sealed, mouth slack in a peaceful, unaware calm.
  preview:()=>({ pose:"recline_hold", blink:1, browUp:.06, jaw:.08, smile:.10,
                 gaze:{x:0,y:.2}, t:0.5, status:"HELD", progress:.18 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    const cx = W*0.50, cy = H*0.55;
    ctx.save();
    // nudge the reclined mass so it sits centered on the card without clipping
    ctx.translate(-W*0.01, -H*0.09);
    ctx.translate(cx, cy);
    ctx.rotate(RECLINE);
    ctx.translate(-cx, -cy);
    // behind the figure: the rocks he is laid against, then the sleep-glow
    // haloing the head (figure-frame head ≈ (0.47W,0.46H))
    drawRocks(ctx, W, H);
    drawGlow(ctx, W, H, W*0.47, H*0.44, H*0.088);
    const res = fig.draw(ctx, W, H, state);
    ctx.restore();
    return res;
  },
};
export default asset;
