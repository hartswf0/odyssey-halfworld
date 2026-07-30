/* character.amphimedons-shade — the suitor who tells the story from the losing side.
   CHARACTER asset. Son of Melaneus, host of Odysseus's father-in-law's line and
   one of the hundred-odd young men who ate out Odysseus's house. In Book XXII he
   nicked Telemachus's wrist and Telemachus put a spear straight through him. In
   OD-B24-S02 he is a brand-new shade in the asphodel, and Agamemnon — who
   recognizes him from a guest-visit years before — asks how so many good young
   men came to die on one day. Amphimedon answers. He is the ONLY narrator of the
   massacre the poem gives us from inside the defeat: the loom unwoven at night,
   the beggar nobody searched, the axes, the bow, the doors.

   Built on the HALFTRACK hero rig — the identity lives in the spec and in the
   pose channels, not in overpaint, so he stays in family with the other suitors
   (antinous, eurymachus, amphinomus) and with the other shades.

   SILHOUETTE — deliberately not Agamemnon's. Where Agamemnon's shade is a broad
   BEARDED king in ARMOR under a heavy cloak, Amphimedon is a slight, CLEAN-SHAVEN
   young man in the light feast tunic he was killed in, no cloak, no armour, no
   weight: a party guest who never got his hands on a shield. Drained shade
   colouring (bloodless skin, hair gone ashen) and the whole figure drawn
   TRANSLUCENT so the paper reads through him.

   THE ONE MARK — a single spear-hole at mid-chest, Telemachus's thrust, drawn a
   touch more present than the ghost body. One small wound, not a cluster: the
   testimony is the point, the wound is only its credential. */
import { makeFigure, HERO_POSES, INK, gray } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke Amphimedon poses (additive; registered on the shared table) ----
   Conventions: this is a man giving EVIDENCE, so the right arm always carries an
   open, laying-out gesture (never a fist, never a jab — he has no standing left
   to threaten anyone with) and the weight stays back on the heels. Nothing about
   him commands; he explains. */

/* THE CARD — TESTIMONY. Angled a quarter turn toward the listening ranks of the
   dead, one open palm turned up and forward, laying the sequence out fact by
   fact; the other hand low and half-open, empty. Face mid-sentence: brows driven
   UP and knit together (the grievance and the bewilderment at once), eyes a
   little narrowed against what he is describing, jaw parted on a word, mouth
   skewed bitter. Gaze lifted off to Agamemnon, not to us. */
HERO_POSES.amph_testify = { id:"amph_testify", label:"testimony", group:"amphimedon",
  n:{ browUp:.52, browKnit:.38, eyeNarrow:.16, frown:.18, jaw:.44, mouthAsym:.22,
      headYaw:-.28, headPitch:-.06, headRoll:.06, gazeX:-.34, gazeY:-.18,
      spineLean:-.14, bodyYaw:-.40, chestOpen:.26,
      armRUpper:-.98, armRLower:-.62, handRotR:.34, shoulderLiftR:.16,  // open palm carried forward at chest height
      armLUpper:.34, armLLower:-.42, handRotL:-.12,                      // far hand low and empty
      rootScale:.98 },
  opt:{ hands:["relaxed","palm_up"] } };

/* THE LOOM — the part of the story he is proudest of having seen through: three
   years of weaving undone every night by torchlight. One finger raised to mark
   the count, the other forearm drawn across as if against the warp. Narrower,
   more confidential; the head tips in. */
HERO_POSES.amph_count = { id:"amph_count", label:"counting the trick", group:"amphimedon",
  n:{ browUp:.36, browKnit:.32, eyeNarrow:.26, jaw:.28, mouthAsym:.14,
      headYaw:-.18, headPitch:-.10, headRoll:.12, gazeX:-.20, gazeY:-.06,
      spineLean:-.08, bodyYaw:-.22, chestOpen:.14,
      armRUpper:-.52, armRLower:-1.26, handRotR:.20, shoulderLiftR:.26,  // index raised, marking one
      armLUpper:.20, armLLower:-.94, handRotL:-.20,                       // forearm drawn across
      rootScale:.97 },
  opt:{ hands:["palm_up","point"] } };

/* THE BOW TURNS — the beat where the hall stopped being a party. Weight thrown
   back onto the heels, both palms up in a warding stop, shoulders jammed to the
   ears, brows flung high, eyes wide, jaw open on a shout that never got finished.
   The only frame in which he is not narrating but reliving. */
HERO_POSES.amph_recoil = { id:"amph_recoil", label:"the bow turns", group:"amphimedon",
  n:{ browUp:.86, browKnit:.20, eyeWide:.62, jaw:.66, frown:.24,
      headPitch:-.12, neckPitch:-.06, headYaw:.14, gazeX:.20, gazeY:-.12,
      spineLean:.30, bodyYaw:.16,
      armRUpper:-1.12, armRLower:-.84, handRotR:.16, shoulderLiftR:.52,
      armLUpper:.92, armLLower:-1.04, handRotL:-.16, shoulderLiftL:.52,
      rootScale:.97 },
  opt:{ hands:["stop","stop"] } };

/* THE UNBURIED — his last complaint, the one all the new shades share: the
   bodies still lying in the hall, nobody sent for, no washing, no wailing. Head
   bowed and turned off, gaze on the floor, one hand laid flat over the spear-hole
   in his chest. Quiet, bitter, inward. */
HERO_POSES.amph_wound = { id:"amph_wound", label:"the unburied dead", group:"amphimedon",
  n:{ browUp:.30, browKnit:.54, frown:.46, eyeNarrow:.42,
      headPitch:.40, neckPitch:.20, headYaw:.26, headY:.10, gazeY:.44, gazeX:.16,
      spineLean:.10, bodyYaw:.18,
      armLUpper:-.50, armLLower:-1.44, handRotL:.28,   // palm laid over the chest wound
      armRUpper:.22, armRLower:.40, handRotR:-.10,
      rootScale:.96 },
  opt:{ hands:["open_palm","relaxed"] } };

/* REST — a shade standing among shades while somebody else speaks. Hands low,
   nothing to hold, a permanent faint knit to the brow. Staging continuity. */
HERO_POSES.amph_calm = { id:"amph_calm", label:"shade at rest", group:"amphimedon",
  n:{ browUp:.12, browKnit:.26, frown:.20, eyeNarrow:.14,
      headPitch:.10, gazeY:.14, chestOpen:.10,
      armLUpper:.14, armLLower:.28, armRUpper:-.14, armRLower:.28,
      rootScale:.96 },
  opt:{ hands:["relaxed","relaxed"] } };

const params = {
  // bloodless shade flesh; young hair drained to ash — light, so plenty of paper
  // survives the dot pass. No beard: the clean jaw is what separates his head
  // silhouette from Agamemnon's and Amphinomus's at a glance.
  skin:"#e2ddd2", hairColor:"#9d988e",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:1.0,
};

const fig = makeFigure(params);

/* ---- THE SPEAR-HOLE, the only bespoke overpaint in the module ----
   Telemachus's thrust, mid-chest, one clean puncture. Flat solid grays + hard
   contour only (the POST pass supplies the dots — never pre-dither). A pale torn
   ring around a small dark core, with two short ink splits at the edge so it
   reads as a hole rather than a button. Deliberately SMALL and single: a cluster
   of gashes here would print as one black mass and swallow the tunic. */
function drawSpearHole(ctx, W, H, head, hip){
  const cx = ((head ? head.x : 0.50)*0.45 + (hip ? hip.x : 0.50)*0.55) * W - W*0.018;
  const cy = ((head ? head.y : 0.20) + (hip ? hip.y : 0.62)) * 0.52 * H;
  const r  = W*0.024;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.22);
  // pale bruise halo — UNSTROKED on purpose: a contoured ring turns the wound
  // into a badge sewn on the tunic instead of a hole torn through it.
  ctx.fillStyle = gray(0xd8);
  ctx.beginPath(); ctx.ellipse(0, 0, r*1.9, r*1.5, 0, 0, Math.PI*2); ctx.fill();
  // four tears radiating from the puncture — drawn FIRST so the dark core sits
  // on top of where they meet. This is what makes it read as torn cloth.
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0,0); ctx.lineTo(-r*2.0, -r*1.15);
  ctx.moveTo(0,0); ctx.lineTo( r*1.9, -r*0.55);
  ctx.moveTo(0,0); ctx.lineTo( r*0.85, r*1.85);
  ctx.moveTo(0,0); ctx.lineTo(-r*1.15, r*1.55);
  ctx.stroke();
  // the puncture itself — a small ragged dark eye, hard contour, kept tight so
  // it prints as a hole and not as a black plate across the chest
  ctx.fillStyle = gray(0x30); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-r*0.95, r*0.10);
  ctx.lineTo(-r*0.28, -r*0.62);
  ctx.lineTo( r*0.52, -r*0.46);
  ctx.lineTo( r*0.92,  r*0.22);
  ctx.lineTo( r*0.16,  r*0.70);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

export const asset = {
  id:"character.amphimedons-shade",
  type:"CHARACTER",
  name:"Amphimedon's shade",
  statusWord:"TESTIFYING",
  scene:"OD-B24-S02",

  params,
  layers:["shadow","legs","tunic","torso","far-arm","neck","head","face",
          "hair-front","near-arm","spear-hole"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    spearHole:{x:.48,y:.42},                 // the wound — proof, and a touch target
    rightHand:{x:.70,y:.52}, leftHand:{x:.36,y:.62},
    openPalm:{x:.72,y:.50},                  // the palm that carries the testimony
    hip:{x:.50,y:.64}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"testifying",
    nodes:{
      // THE beat — the narration itself, an open palm laying out the sequence
      testifying:{ preview:{ pose:"amph_testify", gaze:{x:-.30,y:-.18},
                             browUp:.52, browKnit:.38, eyeNarrow:.16,
                             jaw:.36, mouthAsym:.22, status:"TESTIFYING" } },
      // the loom and the three unwoven years, counted off on a raised finger
      counting:  { preview:{ pose:"amph_count", gaze:{x:-.20,y:-.06},
                             browUp:.36, browKnit:.32, eyeNarrow:.26,
                             jaw:.28, status:"RECOUNTING" } },
      // reliving the turn: the bow strung, the doors shut, both palms up
      recoiling: { preview:{ pose:"amph_recoil", gaze:{x:.20,y:-.12},
                             browUp:.86, eyeWide:.62, jaw:.66, status:"AMBUSHED" } },
      // the last complaint — the bodies still unwashed in the hall
      grieving:  { preview:{ pose:"amph_wound", gaze:{x:.16,y:.44},
                             browUp:.30, browKnit:.54, frown:.46,
                             eyeNarrow:.42, status:"UNBURIED" } },
      // listening while Agamemnon answers; standing rest for staging
      neutral:   { preview:{ pose:"amph_calm", gaze:{x:0,y:.14},
                             browUp:.12, browKnit:.26, frown:.20, status:"FADED" } },
    },
    edges:[
      ["neutral","testifying"],["testifying","counting"],["counting","recoiling"],
      ["recoiling","testifying"],["testifying","grieving"],["grieving","neutral"],
      ["counting","testifying"],["grieving","testifying"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band","solid",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — TESTIFYING: the beaten side's witness, half-turned to the
  // ranks of the dead, one empty palm open and turned up as he lays the sequence
  // out fact by fact, brows raised AND knit, jaw parted mid-word, a single
  // spear-hole in the feast tunic he was killed in, the whole ghost translucent.
  preview:()=>({ pose:"amph_testify", gaze:{x:-.30,y:-.18},
                 browUp:.52, browKnit:.38, eyeNarrow:.16, frown:.18,
                 jaw:.36, mouthAsym:.22, t:0.45, status:"TESTIFYING", progress:.34 }),

  draw(ctx, W, H, state){
    const st = state || {};
    // a shade: the body is drawn translucent so paper reads through him.
    // `solid` forces him fully present (memory / flashback staging).
    const alpha = st.solid ? 1 : 0.66;
    ctx.save();
    ctx.globalAlpha = alpha;
    const r = fig.draw(ctx, W, H, st);
    ctx.restore();
    // the spear-hole, a touch more present than the ghost body
    const head = (r && r.anchors && r.anchors.head) || { x:0.50, y:0.20 };
    const hip  = (r && r.anchors && r.anchors.hip)  || { x:0.50, y:0.62 };
    ctx.save();
    ctx.globalAlpha = st.solid ? 1 : Math.min(1, alpha + 0.20);
    drawSpearHole(ctx, W, H, head, hip);
    ctx.restore();
    return r;
  },
};
export default asset;
